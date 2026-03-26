import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from PIL import Image
from io import BytesIO

from ..database import get_db
from ..models import User, Guide
from ..auth import require_user
from ..config import UPLOAD_DIR, MAX_FILE_SIZE

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large (max 5MB)")

    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename else "jpg"
    if ext not in ("jpg", "jpeg", "png", "webp"):
        raise HTTPException(400, "Only jpg, png, webp images allowed")

    # Resize to max 400x400
    img = Image.open(BytesIO(content))
    img.thumbnail((400, 400))
    filename = f"avatar_{user.id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    img.save(filepath)

    user.avatar_url = f"/api/uploads/files/{filename}"
    db.commit()
    return {"url": user.avatar_url}


@router.post("/guide-photo/{guide_id}")
async def upload_guide_photo(
    guide_id: int,
    file: UploadFile = File(...),
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    if user.role not in ("admin", "guide"):
        raise HTTPException(403, "Not authorized")

    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(404, "Guide not found")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large (max 5MB)")

    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename else "jpg"
    if ext not in ("jpg", "jpeg", "png", "webp"):
        raise HTTPException(400, "Only jpg, png, webp images allowed")

    img = Image.open(BytesIO(content))
    img.thumbnail((600, 600))
    filename = f"guide_{guide_id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    img.save(filepath)

    guide.photo_url = f"/api/uploads/files/{filename}"
    db.commit()
    return {"url": guide.photo_url}


from fastapi.responses import FileResponse

@router.get("/files/{filename}")
async def serve_file(filename: str):
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(404, "File not found")
    return FileResponse(filepath)
