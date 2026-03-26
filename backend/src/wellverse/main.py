from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .database import engine, SessionLocal, Base
from .seed import seed_database
from .routers import (
    verticals, guides, waitlist, applications, bookings, reviews, stats,
    auth_router, messaging, notes, progress, library, circles, payments,
    uploads, admin, blog,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(title="WellVerse API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core routers
app.include_router(auth_router.router)
app.include_router(verticals.router)
app.include_router(guides.router)
app.include_router(waitlist.router)
app.include_router(applications.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(stats.router)

# Feature routers
app.include_router(messaging.router)
app.include_router(notes.router)
app.include_router(progress.router)
app.include_router(library.router)
app.include_router(circles.router)
app.include_router(payments.router)
app.include_router(uploads.router)
app.include_router(admin.router)
app.include_router(blog.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "WellVerse", "version": "2.0.0"}


# Serve frontend static files in production
dist = Path(__file__).resolve().parent.parent.parent.parent / "frontend" / "dist"
if dist.exists():
    app.mount("/", StaticFiles(directory=str(dist), html=True), name="frontend")
