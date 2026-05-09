

from datetime import datetime, date, time

from sqlalchemy.orm import Session
from sqlalchemy import func

import models


def get_daily_stats(db: Session, selected_date: date | None = None):
    if selected_date is None:
        selected_date = date.today()

    start_datetime = datetime.combine(selected_date, time.min)
    end_datetime = datetime.combine(selected_date, time.max)

    reading_stats = (
        db.query(
            func.avg(models.Reading.fill_percent),
            func.max(models.Reading.fill_percent),
            func.min(models.Reading.fill_percent),
            func.count(models.Reading.id)
        )
        .filter(models.Reading.created_at >= start_datetime)
        .filter(models.Reading.created_at <= end_datetime)
        .first()
    )

    alarm_count = (
        db.query(func.count(models.Alert.id))
        .filter(models.Alert.created_at >= start_datetime)
        .filter(models.Alert.created_at <= end_datetime)
        .scalar()
    )

    average_fill = reading_stats[0] if reading_stats[0] is not None else 0
    max_fill = reading_stats[1] if reading_stats[1] is not None else 0
    min_fill = reading_stats[2] if reading_stats[2] is not None else 0
    reading_count = reading_stats[3] if reading_stats[3] is not None else 0

    return {
        "date": selected_date.isoformat(),
        "average_fill": round(float(average_fill), 2),
        "max_fill": round(float(max_fill), 2),
        "min_fill": round(float(min_fill), 2),
        "reading_count": int(reading_count),
        "alarm_count": int(alarm_count)
    }
