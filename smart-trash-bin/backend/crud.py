# Sorumlu: Alper + Mustafa

from sqlalchemy.orm import Session
from sqlalchemy import desc

import models
import schemas


def create_default_bin_if_not_exists(db: Session):
    existing_bin = db.query(models.Bin).filter(models.Bin.id == 1).first()

    if existing_bin:
        return existing_bin

    default_bin = models.Bin(
        id=1,
        name="Smart Trash Bin",
        empty_distance_cm=50.0,
        full_distance_cm=10.0,
        gas_threshold=1000.0
    )

    db.add(default_bin)
    db.commit()
    db.refresh(default_bin)

    return default_bin


def create_reading(db: Session, reading: schemas.ReadingCreate):
    db_reading = models.Reading(
        bin_id=reading.bin_id,
        distance_cm=reading.distance_cm,
        fill_percent=reading.fill_percent,
        gas_raw=reading.gas_raw,
        status=reading.status,
        is_full=reading.is_full,
        odor_alert=reading.odor_alert
    )

    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)

    return db_reading


def get_latest_reading(db: Session):
    return (
        db.query(models.Reading)
        .order_by(desc(models.Reading.created_at))
        .first()
    )


def get_recent_readings(db: Session, limit: int = 20):
    return (
        db.query(models.Reading)
        .order_by(desc(models.Reading.created_at))
        .limit(limit)
        .all()
    )


def create_alert(db: Session, bin_id: int, alert_type: str, message: str):
    db_alert = models.Alert(
        bin_id=bin_id,
        type=alert_type,
        message=message,
        acknowledged=False
    )

    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)

    return db_alert


def get_recent_alerts(db: Session, limit: int = 20):
    return (
        db.query(models.Alert)
        .order_by(desc(models.Alert.created_at))
        .limit(limit)
        .all()
    )


def acknowledge_alert(db: Session, alert_id: int):
    alert = (
        db.query(models.Alert)
        .filter(models.Alert.id == alert_id)
        .first()
    )

    if alert is None:
        return None

    alert.acknowledged = True

    db.commit()
    db.refresh(alert)

    return alert


def get_user(db: Session):
    # Bu proje icin tek bir kullanici oldugunu varsayiyoruz
    return db.query(models.User).first()


def update_or_create_user(db: Session, user_data: schemas.UserCreate):
    db_user = db.query(models.User).first()
    
    if db_user:
        db_user.email = user_data.email
        db_user.first_name = user_data.first_name
        db_user.last_name = user_data.last_name
    else:
        db_user = models.User(
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name
        )
        db.add(db_user)
    
    db.commit()
    db.refresh(db_user)
    
    # Varsayilan cop kutusunu bu kullaniciya bagla
    bin = db.query(models.Bin).filter(models.Bin.id == 1).first()
    if bin:
        bin.owner_id = db_user.id
        db.commit()
        
    return db_user


def get_bin_owner_email(db: Session, bin_id: int) -> str | None:
    bin = db.query(models.Bin).filter(models.Bin.id == bin_id).first()
    if bin and bin.owner:
        return bin.owner.email
    return None
