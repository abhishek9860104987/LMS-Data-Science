import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, progress, admin, notifications, course_requests
from .database import engine, Base

# Auto-create all tables on startup (safe for Neon/PostgreSQL — won't drop existing tables)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Celebal LMS API")

origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(progress.router)
app.include_router(admin.router)
app.include_router(notifications.router)
app.include_router(course_requests.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Celebal LMS API. Use /api/auth and /api/progress endpoints."}
