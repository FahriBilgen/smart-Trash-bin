

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
import crud
import alarm_service
import stats_service

from database import engine, get_db


models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Trash Bin API",
    description="Backend API for ESP32 based smart trash bin project",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "https://smart-trash-bin-nine.vercel.app",
    "https://smart-trash-bin.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    db = next(get_db())
    crud.create_default_bin_if_not_exists(db)


@app.get("/")
def root():
    return {
        "message": "Smart Trash Bin API is running",
        "status": "ok"
    }


@app.post("/api/device/readings")
def create_device_reading(
    reading: schemas.ReadingCreate,
    db: Session = Depends(get_db)
):
    allowed_statuses = ["normal", "warning", "full", "odor_alert"]

    if reading.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values: {allowed_statuses}"
        )

    crud.create_default_bin_if_not_exists(db)

    saved_reading = crud.create_reading(db, reading)

    created_alerts = alarm_service.process_alerts(db, reading)

    emails_sent = sum(1 for item in created_alerts if item.get("email_sent") is True)

    return {
        "message": "Reading saved successfully",
        "reading_id": saved_reading.id,
        "alerts_created": len(created_alerts),
        "emails_sent": emails_sent
    }


@app.get("/api/dashboard/latest")
def get_dashboard_latest(db: Session = Depends(get_db)):
    latest = crud.get_latest_reading(db)

    if latest is None:
        return {
            "message": "No readings found",
            "data": None
        }

    return latest


@app.get("/api/readings/recent")
def get_recent_readings(
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return crud.get_recent_readings(db, limit=limit)


@app.get("/api/alerts")
def get_alerts(
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return crud.get_recent_alerts(db, limit=limit)


@app.get("/api/stats/daily")
def get_daily_stats(db: Session = Depends(get_db)):
    return stats_service.get_daily_stats(db)


@app.patch("/api/alerts/{alert_id}/acknowledge")
def acknowledge_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    alert = crud.acknowledge_alert(db, alert_id)

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    return {
        "message": "Alert acknowledged successfully",
        "alert_id": alert.id,
        "acknowledged": alert.acknowledged
    }


@app.get("/api/user", response_model=schemas.User | None)
def get_user_info(db: Session = Depends(get_db)):
    return crud.get_user(db)


@app.post("/api/user", response_model=schemas.User)
def update_user_info(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.update_or_create_user(db, user_data)
