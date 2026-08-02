from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base


class AdminSettings(Base):
    """Stores admin configuration — currently just the admin password."""
    __tablename__ = "admin_settings"

    id       = Column(Integer, primary_key=True, index=True)
    key      = Column(String(100), unique=True, nullable=False)   # e.g. 'admin_password'
    value    = Column(String(255), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    plain_password = Column(String(255), nullable=True)   # stored for admin visibility
    full_name = Column(String(150), nullable=True)
    contact_number = Column(String(20), nullable=True)
    passing_out_year = Column(Integer, nullable=True)
    domain = Column(String(100), nullable=True)
    current_course = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    progress = relationship("UserProgress", back_populates="user", uselist=False, cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    recently_watched = relationship("RecentlyWatched", back_populates="user", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    weeks = relationship("Week", back_populates="course", cascade="all, delete-orphan")

class Week(Base):
    __tablename__ = "weeks"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(255), nullable=False)
    week_number = Column(Integer)
    
    course = relationship("Course", back_populates="weeks")
    lessons = relationship("Lesson", back_populates="week", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String(50), primary_key=True, index=True) # E.g., '1-1', '1-2' to map to courseData.js
    week_id = Column(Integer, ForeignKey("weeks.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    video_url = Column(String(500))
    reading_url = Column(String(500))
    duration = Column(String(50))
    lesson_type = Column(String(50), default="video")

    week = relationship("Week", back_populates="lessons")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    # Storing array of lesson IDs for easy mapping with the frontend state
    completed_lesson_ids = Column(JSON, default=list)
    last_watched_lesson_id = Column(String(50), nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="progress")

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(String(50), nullable=False) # Maps to courseData.js lesson id
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="bookmarks")

class RecentlyWatched(Base):
    __tablename__ = "recently_watched"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(String(50), nullable=False)
    # Complete lesson JSON to match the frontend shape for easy rendering
    lesson_data = Column(JSON, nullable=False) 
    watched_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="recently_watched")
