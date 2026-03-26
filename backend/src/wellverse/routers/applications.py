from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import GuideApplication
from ..schemas import ApplicationCreate, ApplicationOut
from ..email_service import send_application_received

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.post("", response_model=ApplicationOut, status_code=201)
def submit_application(data: ApplicationCreate, db: Session = Depends(get_db)):
    if not data.full_name or not data.email or not data.role_specialty:
        raise HTTPException(400, "Name, email, and role/specialty are required")

    app = GuideApplication(**data.model_dump())
    db.add(app)
    db.commit()
    db.refresh(app)

    send_application_received(data.email, data.full_name)
    return app


@router.get("", response_model=list[ApplicationOut])
def list_applications(db: Session = Depends(get_db)):
    return db.query(GuideApplication).order_by(GuideApplication.created_at.desc()).all()
