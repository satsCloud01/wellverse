from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import Guide
from ..schemas import GuideOut

router = APIRouter(prefix="/api/guides", tags=["guides"])


@router.get("", response_model=list[GuideOut])
def list_guides(
    vertical_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    preview: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Guide)
    if vertical_id:
        q = q.filter(Guide.vertical_id == vertical_id)
    if preview is not None:
        q = q.filter(Guide.is_preview == preview)
    if search:
        term = f"%{search}%"
        # Search name, role, and cast methods JSON to string for LIKE
        q = q.filter(
            Guide.name.ilike(term)
            | Guide.role.ilike(term)
            | Guide.bio.ilike(term)
        )
    return q.all()


@router.get("/{guide_id}", response_model=GuideOut)
def get_guide(guide_id: int, db: Session = Depends(get_db)):
    g = db.query(Guide).filter(Guide.id == guide_id).first()
    if not g:
        raise HTTPException(404, "Guide not found")
    return g
