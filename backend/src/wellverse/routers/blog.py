from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models import BlogPost

router = APIRouter(prefix="/api/blog", tags=["blog"])


class BlogPostOut(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str | None = None
    body: str
    author: str
    cover_image_url: str | None = None
    tags: list[str] | None = None
    published_at: datetime | None = None

    model_config = {"from_attributes": True}


@router.get("", response_model=list[BlogPostOut])
def list_posts(db: Session = Depends(get_db)):
    return db.query(BlogPost).filter(BlogPost.published == True).order_by(BlogPost.published_at.desc()).all()


@router.get("/{slug}", response_model=BlogPostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.published == True).first()
    if not post:
        raise HTTPException(404, "Post not found")
    return post
