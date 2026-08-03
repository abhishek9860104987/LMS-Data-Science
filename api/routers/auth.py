from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from .. import schemas, models, auth
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=409, detail="Username already registered")

    if user.email:
        db_email = db.query(models.User).filter(models.User.email == user.email).first()
        if db_email:
            raise HTTPException(status_code=409, detail="Email already registered")
        
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        plain_password=user.password          # stored for admin panel
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Initialize empty progress
    initial_progress = models.UserProgress(user_id=new_user.id)
    db.add(initial_progress)
    db.commit()
    
    return {"message": "User created successfully"}

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "username": db_user.username}

@router.get("/profile", response_model=schemas.ProfileResponse)
def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.put("/profile", response_model=schemas.ProfileResponse)
def update_profile(
    profile_data: schemas.ProfileUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    update_data = profile_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/password")
def update_password(
    password_data: schemas.PasswordUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if not auth.verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    current_user.password_hash = auth.get_password_hash(password_data.new_password)
    current_user.plain_password = password_data.new_password   # keep plain copy in sync
    db.commit()
    return {"message": "Password updated successfully"}

