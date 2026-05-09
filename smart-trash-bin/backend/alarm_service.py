from datetime import datetime, timedelta

from sqlalchemy.orm import Session
from sqlalchemy import desc

import crud
import models
import schemas
import email_service








ALARM_COOLDOWN_MINUTES = 1


def can_create_alert(db: Session, bin_id: int, alert_type: str) -> bool:
    last_alert = (
        db.query(models.Alert)
        .filter(models.Alert.bin_id == bin_id)
        .filter(models.Alert.type == alert_type)
        .order_by(desc(models.Alert.created_at))
        .first()
    )

    if last_alert is None:
        return True

    now = datetime.now(last_alert.created_at.tzinfo)
    cooldown_time = last_alert.created_at + timedelta(minutes=ALARM_COOLDOWN_MINUTES)

    return now >= cooldown_time


def create_alert_and_send_email(
    db: Session,
    bin_id: int,
    alert_type: str,
    message: str
):
    alert = crud.create_alert(
        db=db,
        bin_id=bin_id,
        alert_type=alert_type,
        message=message
    )

    
    owner_email = crud.get_bin_owner_email(db, bin_id)
    
    
    import os
    target_email = owner_email or os.getenv("ALERT_EMAIL_TO")

    email_sent = False
    if target_email:
        email_sent = email_service.send_alert_email(
            to_email=target_email,
            alert_type=alert_type,
            message=message
        )
    else:
        print(f"Uyari: Bin ID {bin_id} icin hicbir mail adresi (sahip veya varsayilan) bulunamadi.")

    return {
        "alert": alert,
        "email_sent": email_sent
    }


def process_alerts(db: Session, reading: schemas.ReadingCreate):
    created_alerts = []

    if reading.is_full or reading.status == "full":
        if can_create_alert(db, reading.bin_id, "full"):
            message = f"Trash bin is full. Fill level: {reading.fill_percent}%"

            result = create_alert_and_send_email(
                db=db,
                bin_id=reading.bin_id,
                alert_type="full",
                message=message
            )

            created_alerts.append(result)

    if reading.odor_alert or reading.status == "odor_alert":
        if can_create_alert(db, reading.bin_id, "odor_alert"):
            message = f"Odor alert detected. Gas raw value: {reading.gas_raw}"

            result = create_alert_and_send_email(
                db=db,
                bin_id=reading.bin_id,
                alert_type="odor_alert",
                message=message
            )

            created_alerts.append(result)

    return created_alerts
