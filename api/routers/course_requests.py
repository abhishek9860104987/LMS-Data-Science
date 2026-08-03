"""
Course Request & User Query Router — /api/course-requests

Student Endpoints (get_current_user):
  POST   /api/course-requests          Submit a new course request or query
  GET    /api/course-requests          List current user's submitted requests

Admin Endpoints (require_admin):
  GET    /api/course-requests/admin             List all student requests (filterable)
  PUT    /api/course-requests/admin/{req_id}   Update status or admin response
  DELETE /api/course-requests/admin/{req_id}   Delete a request
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import datetime, timezone

from .. import schemas, models, auth
from ..database import get_db
from ..routers.admin import require_admin

router = APIRouter(prefix="/api/course-requests", tags=["course-requests"])


# ── Student: Submit a request / query ────────────────────────────────────────

@router.post("", response_model=schemas.CourseRequestResponse, status_code=201)
def submit_course_request(
    body: schemas.CourseRequestCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    req_type = body.request_type.upper()
    if req_type not in schemas.REQUEST_TYPES:
        raise HTTPException(status_code=422, detail=f"Invalid request_type. Must be one of {schemas.REQUEST_TYPES}")

    if not body.title.strip() or not body.description.strip():
        raise HTTPException(status_code=422, detail="Title and description are required")

    new_req = models.CourseRequest(
        user_id=current_user.id,
        request_type=req_type,
        title=body.title.strip(),
        description=body.description.strip(),
        status="PENDING"
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req


# ── Student: List my submitted requests ──────────────────────────────────────

@router.get("", response_model=List[schemas.CourseRequestResponse])
def list_my_course_requests(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    requests = db.query(models.CourseRequest).filter(
        models.CourseRequest.user_id == current_user.id
    ).order_by(models.CourseRequest.created_at.desc()).all()
    return requests


# ── Admin: List all requests ──────────────────────────────────────────────────

@router.get("/admin", response_model=List[schemas.AdminCourseRequestResponse])
def admin_list_course_requests(
    request: Request,
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    request_type: Optional[str] = Query(None),
):
    require_admin(request)

    query = db.query(models.CourseRequest)

    if search:
        query = query.filter(
            or_(
                models.CourseRequest.title.ilike(f"%{search}%"),
                models.CourseRequest.description.ilike(f"%{search}%"),
            )
        )
    if status:
        query = query.filter(models.CourseRequest.status == status.upper())
    if request_type:
        query = query.filter(models.CourseRequest.request_type == request_type.upper())

    results = query.order_by(models.CourseRequest.created_at.desc()).all()

    output = []
    for r in results:
        user = db.query(models.User).filter(models.User.id == r.user_id).first()
        output.append(schemas.AdminCourseRequestResponse(
            id=r.id,
            user_id=r.user_id,
            username=user.username if user else "Unknown User",
            user_email=user.email if user else None,
            request_type=r.request_type,
            title=r.title,
            description=r.description,
            status=r.status,
            admin_response=r.admin_response,
            created_at=r.created_at,
            updated_at=r.updated_at,
        ))
    return output


# ── Admin: Update status / response ──────────────────────────────────────────

@router.put("/admin/{req_id}", response_model=schemas.AdminCourseRequestResponse)
def admin_update_course_request(
    req_id: int,
    body: schemas.AdminCourseRequestUpdate,
    request: Request,
    db: Session = Depends(get_db),
):
    require_admin(request)

    req = db.query(models.CourseRequest).filter(models.CourseRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if body.status is not None:
        st = body.status.upper()
        if st not in schemas.REQUEST_STATUSES:
            raise HTTPException(status_code=422, detail=f"Invalid status. Must be one of {schemas.REQUEST_STATUSES}")
        req.status = st

    if body.admin_response is not None:
        req.admin_response = body.admin_response.strip() or None

    req.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
    db.commit()
    db.refresh(req)

    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    return schemas.AdminCourseRequestResponse(
        id=req.id,
        user_id=req.user_id,
        username=user.username if user else "Unknown User",
        user_email=user.email if user else None,
        request_type=req.request_type,
        title=req.title,
        description=req.description,
        status=req.status,
        admin_response=req.admin_response,
        created_at=req.created_at,
        updated_at=req.updated_at,
    )


# ── Admin: Delete request ─────────────────────────────────────────────────────

@router.delete("/admin/{req_id}", status_code=204)
def admin_delete_course_request(
    req_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    require_admin(request)

    req = db.query(models.CourseRequest).filter(models.CourseRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    db.delete(req)
    db.commit()
