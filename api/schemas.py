from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    contact_number: Optional[str] = None
    passing_out_year: Optional[int] = None
    domain: Optional[str] = None
    current_course: Optional[str] = None

class ProfileResponse(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    contact_number: Optional[str] = None
    passing_out_year: Optional[int] = None
    domain: Optional[str] = None
    current_course: Optional[str] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class ProgressUpdate(BaseModel):
    completedIds: List[str]
    watchHistory: List[Dict[str, Any]]

class ProgressResponse(BaseModel):
    completedIds: List[str]
    watchHistory: List[Dict[str, Any]]
    bookmarks: List[str]

class BookmarkToggle(BaseModel):
    lesson_id: str

# ── Admin schemas ────────────────────────────────────────────────────────────

class AdminLogin(BaseModel):
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AdminUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    plain_password: Optional[str] = None
    email: Optional[str] = None
    domain: Optional[str] = None
    current_course: Optional[str] = None
    created_at: datetime

class AdminUserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
