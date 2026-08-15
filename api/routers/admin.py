from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import os, jwt
from datetime import datetime, timedelta, timezone

from .. import schemas, models, auth
from ..database import get_db

router = APIRouter(prefix="/api/admin", tags=["admin"])

# ── Constants ─────────────────────────────────────────────────────────────────
SECRET_KEY     = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM     = "HS256"
ADMIN_PASS_KEY = "admin_password"


# ── DB helpers ────────────────────────────────────────────────────────────────

def get_admin_password(db: Session) -> str:
    """Read admin password from the admin_settings table."""
    row = db.query(models.AdminSettings).filter(
        models.AdminSettings.key == ADMIN_PASS_KEY
    ).first()
    if not row:
        raise HTTPException(status_code=500, detail="Admin password not configured in database")
    return row.value


def set_admin_password(db: Session, new_password: str) -> None:
    """Upsert admin password in the admin_settings table."""
    row = db.query(models.AdminSettings).filter(
        models.AdminSettings.key == ADMIN_PASS_KEY
    ).first()
    if row:
        row.value = new_password
    else:
        row = models.AdminSettings(key=ADMIN_PASS_KEY, value=new_password)
        db.add(row)
    db.commit()


# ── Token helpers ──────────────────────────────────────────────────────────────

def create_admin_token() -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=8)
    return jwt.encode({"sub": "admin", "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def verify_admin_token(token: str) -> bool:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub") == "admin"
    except Exception:
        return False


def require_admin(request: Request):
    """FastAPI dependency: raises 401 if the Bearer admin token is invalid."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Admin authentication required")
    token = auth_header.split(" ", 1)[1]
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Invalid or expired admin token")


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/login", response_model=schemas.AdminToken)
def admin_login(body: schemas.AdminLogin, db: Session = Depends(get_db)):
    stored = get_admin_password(db)
    if body.password != stored:
        raise HTTPException(status_code=401, detail="Invalid admin password")
    return {"access_token": create_admin_token(), "token_type": "bearer"}


@router.get("/users", response_model=List[schemas.AdminUserResponse])
def list_users(
    search: Optional[str] = None,
    request: Request = None,
    db: Session = Depends(get_db),
):
    require_admin(request)
    query = db.query(models.User)
    if search:
        query = query.filter(models.User.username.ilike(f"%{search}%"))
    users = query.order_by(models.User.created_at.desc()).all()

    now = datetime.now(timezone.utc)
    res = []
    for u in users:
        is_online = False
        if u.last_active_at:
            last_active = u.last_active_at
            if last_active.tzinfo is None:
                last_active = last_active.replace(tzinfo=timezone.utc)
            # Active within last 3 minutes (180s)
            is_online = (now - last_active).total_seconds() < 180

        res.append(schemas.AdminUserResponse(
            id=u.id,
            username=u.username,
            plain_password=u.plain_password,
            email=u.email,
            domain=u.domain,
            current_course=u.current_course,
            created_at=u.created_at,
            last_active_at=u.last_active_at,
            is_online=is_online,
        ))
    return res


@router.put("/users/{user_id}", response_model=schemas.AdminUserResponse)
def update_user(
    user_id: int,
    body: schemas.AdminUserUpdate,
    request: Request = None,
    db: Session = Depends(get_db),
):
    require_admin(request)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if body.username:
        existing = db.query(models.User).filter(
            models.User.username == body.username,
            models.User.id != user_id,
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="Username already taken")
        user.username = body.username

    if body.password:
        user.plain_password = body.password
        user.password_hash  = auth.get_password_hash(body.password)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    request: Request = None,
    db: Session = Depends(get_db),
):
    require_admin(request)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()


@router.post("/change-password", response_model=schemas.AdminToken)
def change_admin_password(
    new_pass: schemas.AdminLogin,
    request: Request = None,
    db: Session = Depends(get_db),
):
    require_admin(request)
    set_admin_password(db, new_pass.password)
    return {"access_token": create_admin_token(), "token_type": "bearer"}
