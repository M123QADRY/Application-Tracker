from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date

from app.database import Base, engine, SessionLocal
from app.models import Application
from app.schemas import (
    ApplicationCreate,
    StatusUpdate
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Application Tracker AI Running"}


@app.post("/applications")
def create_application(application: ApplicationCreate):

    db: Session = SessionLocal()
    
    new_application = Application(
    organization=application.organization,
    title=application.title,

    application_type=application.application_type,

    status=application.status,

    date_applied=date.today(),

    source=application.source,

    application_url=application.application_url,

    location=application.location,

    notes=application.notes
)

    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    return new_application

@app.get("/applications")
def get_applications():

    db: Session = SessionLocal()

    return db.query(Application).all()

@app.put("/applications/{application_id}")
def update_status(
    application_id: int,
    status_update: StatusUpdate
):
    db: Session = SessionLocal()

    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        return {"error": "Application not found"}

    application.status = status_update.status

    db.commit()
    db.refresh(application)

@app.delete("/applications/{application_id}")
def delete_application(application_id: int):

    db: Session = SessionLocal()

    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        return {"error": "Application not found"}

    db.delete(application)
    db.commit()

    return {"message": "Application deleted"}

    return application