"""
Notification router — /api/notifications

Admin endpoints (require_admin):
  POST   /api/notifications              create
  GET    /api/notifications/admin        list all (filters: type, recipient, search, date)
  PUT    /api/notifications/{id}         update
  DELETE /api/notifications/{id}         delete

Student endpoints (get_current_user):
  GET    /api/notifications              list my notifications (ALL + personal, non-expired)
  GET    /api/notifications/unread-count { count: N }
  POST   /api/notifications/{id}/read    mark one as read
  POST   /api/notifications/read-all     mark all as read
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from datetime import datetime, timezone

from .. import schemas, models, auth
from ..database import get_db
from ..routers.admin import require_admin   # reuse existing admin auth

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


# ── helpers ───────────────────────────────────────────────────────────────────

def _now() -> datetime:
    return datetime.now(timezone.utc)


def _resolve_user(username: Optional[str], db: Session) -> Optional[int]:
    """Return user.id for a given username (case-insensitive), or raise 404."""
    if not username:
        return None
    user = db.query(models.User).filter(
        models.User.username.ilike(username.strip())
    ).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"User '{username}' not found. Check the username and try again."
        )
    return user.id


def _is_read(notification_id: int, user_id: int, db: Session) -> bool:
    """Check if a user has already read a notification."""
    return db.query(models.NotificationRead).filter(
        models.NotificationRead.notification_id == notification_id,
        models.NotificationRead.user_id == user_id
    ).first() is not None


def _active_for_user(user_id: int, db: Session):
    """
    Return active (non-expired) notifications visible to a user:
    - All notifications with recipient_type='ALL'
    - Notifications with recipient_type='USER' for this specific user
    Pinned notifications come first, then newest first.
    """
    now = _now()
    # Make now naive if needed (Neon stores naive UTC datetimes)
    now_naive = now.replace(tzinfo=None)

    query = db.query(models.Notification).filter(
        or_(
            models.Notification.recipient_type == "ALL",
            and_(
                models.Notification.recipient_type == "USER",
                models.Notification.recipient_user_id == user_id,
            )
        ),
        or_(
            models.Notification.expires_at == None,
            models.Notification.expires_at > now_naive,
        )
    ).order_by(
        models.Notification.is_pinned.desc(),
        models.Notification.created_at.desc()
    )
    return query.all()


# ── Admin: Create ─────────────────────────────────────────────────────────────

@router.post("", response_model=schemas.AdminNotificationResponse, status_code=201)
def create_notification(
    body: schemas.NotificationCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    require_admin(request)

    if body.notif_type.upper() not in schemas.NOTIF_TYPES:
        raise HTTPException(status_code=422, detail=f"Invalid notif_type. Must be one of {schemas.NOTIF_TYPES}")

    recipient_user_id = None
    if body.recipient_type.upper() == "USER":
        if not body.recipient_username:
            raise HTTPException(status_code=422, detail="recipient_username required when recipient_type=USER")
        recipient_user_id = _resolve_user(body.recipient_username, db)

    notif = models.Notification(
        title=body.title,
        message=body.message,
        notif_type=body.notif_type.upper(),
        recipient_type=body.recipient_type.upper(),
        recipient_user_id=recipient_user_id,
        attachment_url=body.attachment_url or None,
        external_link=body.external_link or None,
        is_pinned=body.is_pinned,
        expires_at=body.expires_at.replace(tzinfo=None) if body.expires_at else None,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)

    # Resolve username for response
    recipient_username = None
    if notif.recipient_user_id:
        u = db.query(models.User).filter(models.User.id == notif.recipient_user_id).first()
        recipient_username = u.username if u else None

    return schemas.AdminNotificationResponse(
        **{c: getattr(notif, c) for c in [
            "id", "title", "message", "notif_type", "recipient_type",
            "recipient_user_id", "attachment_url", "external_link",
            "is_pinned", "expires_at", "created_at", "updated_at"
        ]},
        recipient_username=recipient_username,
    )


# ── Admin: List all ───────────────────────────────────────────────────────────

@router.get("/admin", response_model=List[schemas.AdminNotificationResponse])
def admin_list_notifications(
    request: Request,
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    notif_type: Optional[str] = Query(None),
    recipient_type: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
):
    require_admin(request)

    query = db.query(models.Notification)

    if search:
        query = query.filter(
            or_(
                models.Notification.title.ilike(f"%{search}%"),
                models.Notification.message.ilike(f"%{search}%"),
            )
        )
    if notif_type:
        query = query.filter(models.Notification.notif_type == notif_type.upper())
    if recipient_type:
        query = query.filter(models.Notification.recipient_type == recipient_type.upper())
    if date_from:
        try:
            df = datetime.fromisoformat(date_from)
            query = query.filter(models.Notification.created_at >= df.replace(tzinfo=None))
        except ValueError:
            pass
    if date_to:
        try:
            dt = datetime.fromisoformat(date_to)
            query = query.filter(models.Notification.created_at <= dt.replace(tzinfo=None))
        except ValueError:
            pass

    notifications = query.order_by(
        models.Notification.is_pinned.desc(),
        models.Notification.created_at.desc()
    ).all()

    results = []
    for n in notifications:
        recipient_username = None
        if n.recipient_user_id:
            u = db.query(models.User).filter(models.User.id == n.recipient_user_id).first()
            recipient_username = u.username if u else None
        results.append(schemas.AdminNotificationResponse(
            **{c: getattr(n, c) for c in [
                "id", "title", "message", "notif_type", "recipient_type",
                "recipient_user_id", "attachment_url", "external_link",
                "is_pinned", "expires_at", "created_at", "updated_at"
            ]},
            recipient_username=recipient_username,
        ))
    return results


# ── Admin: Update ─────────────────────────────────────────────────────────────

@router.put("/{notif_id}", response_model=schemas.AdminNotificationResponse)
def update_notification(
    notif_id: int,
    body: schemas.NotificationUpdate,
    request: Request,
    db: Session = Depends(get_db),
):
    require_admin(request)

    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    if body.title is not None:        notif.title = body.title
    if body.message is not None:      notif.message = body.message
    if body.notif_type is not None:
        if body.notif_type.upper() not in schemas.NOTIF_TYPES:
            raise HTTPException(status_code=422, detail=f"Invalid notif_type")
        notif.notif_type = body.notif_type.upper()
    if body.attachment_url is not None: notif.attachment_url = body.attachment_url or None
    if body.external_link is not None:  notif.external_link = body.external_link or None
    if body.is_pinned is not None:      notif.is_pinned = body.is_pinned
    if body.expires_at is not None:
        notif.expires_at = body.expires_at.replace(tzinfo=None) if body.expires_at else None

    # Handle recipient_type change
    if body.recipient_type is not None:
        notif.recipient_type = body.recipient_type.upper()
        if body.recipient_type.upper() == "USER":
            notif.recipient_user_id = _resolve_user(body.recipient_username, db)
        else:
            notif.recipient_user_id = None

    notif.updated_at = _now().replace(tzinfo=None)
    db.commit()
    db.refresh(notif)

    recipient_username = None
    if notif.recipient_user_id:
        u = db.query(models.User).filter(models.User.id == notif.recipient_user_id).first()
        recipient_username = u.username if u else None

    return schemas.AdminNotificationResponse(
        **{c: getattr(notif, c) for c in [
            "id", "title", "message", "notif_type", "recipient_type",
            "recipient_user_id", "attachment_url", "external_link",
            "is_pinned", "expires_at", "created_at", "updated_at"
        ]},
        recipient_username=recipient_username,
    )


# ── Admin: Delete ─────────────────────────────────────────────────────────────

@router.delete("/{notif_id}", status_code=204)
def delete_notification(
    notif_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    require_admin(request)
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notif)
    db.commit()


# ── Student: unread count (lightweight — used for polling) ────────────────────

@router.get("/unread-count", response_model=schemas.UnreadCountResponse)
def unread_count(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    active = _active_for_user(current_user.id, db)
    read_ids = {
        r.notification_id
        for r in db.query(models.NotificationRead).filter(
            models.NotificationRead.user_id == current_user.id
        ).all()
    }
    count = sum(1 for n in active if n.id not in read_ids)
    return {"count": count}


# ── Student: list my notifications ────────────────────────────────────────────

@router.get("", response_model=List[schemas.NotificationResponse])
def list_my_notifications(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    active = _active_for_user(current_user.id, db)
    read_ids = {
        r.notification_id
        for r in db.query(models.NotificationRead).filter(
            models.NotificationRead.user_id == current_user.id
        ).all()
    }

    results = []
    for n in active:
        results.append(schemas.NotificationResponse(
            id=n.id,
            title=n.title,
            message=n.message,
            notif_type=n.notif_type,
            recipient_type=n.recipient_type,
            attachment_url=n.attachment_url,
            external_link=n.external_link,
            is_pinned=n.is_pinned,
            expires_at=n.expires_at,
            created_at=n.created_at,
            is_read=n.id in read_ids,
        ))
    return results


# ── Student: mark one as read ─────────────────────────────────────────────────

@router.post("/{notif_id}/read", status_code=200)
def mark_read(
    notif_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    # Verify the notification exists and is visible to this user
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    # Idempotent: do nothing if already read
    existing = db.query(models.NotificationRead).filter(
        models.NotificationRead.notification_id == notif_id,
        models.NotificationRead.user_id == current_user.id,
    ).first()
    if not existing:
        receipt = models.NotificationRead(
            notification_id=notif_id,
            user_id=current_user.id,
        )
        db.add(receipt)
        db.commit()
    return {"ok": True}


# ── Student: mark all as read ─────────────────────────────────────────────────

@router.post("/read-all", status_code=200)
def mark_all_read(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    active = _active_for_user(current_user.id, db)
    read_ids = {
        r.notification_id
        for r in db.query(models.NotificationRead).filter(
            models.NotificationRead.user_id == current_user.id
        ).all()
    }
    new_reads = [
        models.NotificationRead(notification_id=n.id, user_id=current_user.id)
        for n in active
        if n.id not in read_ids
    ]
    if new_reads:
        db.bulk_save_objects(new_reads)
        db.commit()
    return {"ok": True, "marked": len(new_reads)}
