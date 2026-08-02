from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models, auth
from ..database import get_db

router = APIRouter(prefix="/api/progress", tags=["progress"])

@router.get("", response_model=schemas.ProgressResponse)
def get_progress(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # 1. Fetch user progress
    user_progress = db.query(models.UserProgress).filter(models.UserProgress.user_id == current_user.id).first()
    if not user_progress:
        user_progress = models.UserProgress(user_id=current_user.id, completed_lesson_ids=[])
        db.add(user_progress)
        db.commit()
        db.refresh(user_progress)

    # 2. Fetch watch history (order by most recently watched)
    history_records = db.query(models.RecentlyWatched)\
        .filter(models.RecentlyWatched.user_id == current_user.id)\
        .order_by(models.RecentlyWatched.watched_at.desc())\
        .limit(5).all()

    watch_history = [record.lesson_data for record in history_records if record.lesson_data]

    # 3. Fetch bookmarks
    bookmarks = db.query(models.Bookmark).filter(models.Bookmark.user_id == current_user.id).all()
    bookmark_ids = [b.lesson_id for b in bookmarks]

    return {
        "completedIds": user_progress.completed_lesson_ids or [],
        "watchHistory": watch_history,
        "bookmarks": bookmark_ids
    }

@router.post("")
def update_progress(progress: schemas.ProgressUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # Update completed IDs
    user_progress = db.query(models.UserProgress).filter(models.UserProgress.user_id == current_user.id).first()
    if not user_progress:
        user_progress = models.UserProgress(user_id=current_user.id)
        db.add(user_progress)
        
    user_progress.completed_lesson_ids = progress.completedIds
    if len(progress.watchHistory) > 0:
        user_progress.last_watched_lesson_id = progress.watchHistory[0].get("id")
        
    # Update watch history. Since we just keep 5, an easy way is to clear and rewrite, or just merge.
    # The frontend sends the new watchHistory array entirely. Let's rewrite it.
    db.query(models.RecentlyWatched).filter(models.RecentlyWatched.user_id == current_user.id).delete()
    for lesson in progress.watchHistory:
        rw = models.RecentlyWatched(
            user_id=current_user.id,
            lesson_id=lesson.get("id"),
            lesson_data=lesson
        )
        db.add(rw)
        
    db.commit()
    return {"message": "Progress synced successfully"}

@router.post("/bookmark")
def toggle_bookmark(bookmark: schemas.BookmarkToggle, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    existing = db.query(models.Bookmark).filter(
        models.Bookmark.user_id == current_user.id, 
        models.Bookmark.lesson_id == bookmark.lesson_id
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Bookmark removed", "bookmarked": False}
    else:
        new_bookmark = models.Bookmark(user_id=current_user.id, lesson_id=bookmark.lesson_id)
        db.add(new_bookmark)
        db.commit()
        return {"message": "Bookmark added", "bookmarked": True}
