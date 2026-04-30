import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv


# Sorumlu: Alper
# ALPER - Email Notification Service
# Alarm olustugunda sistem yoneticisine SMTP uzerinden e-posta gonderiyorum.
# SMTP bilgileri guvenlik icin .env dosyasindan okunuyor.

load_dotenv()


SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")


def is_email_configured() -> bool:
    return all([
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASSWORD
    ])


def send_alert_email(to_email: str, alert_type: str, message: str) -> bool:
    if not is_email_configured():
        print("Email config eksik. Mail gonderilmedi.")
        return False

    if not to_email:
        print("Alici email adresi eksik. Mail gonderilmedi.")
        return False

    email = EmailMessage()
    email["From"] = SMTP_USER
    email["To"] = to_email
    email["Subject"] = f"Smart Trash Bin Alert: {alert_type}"

    email.set_content(
        f"""
Smart Trash Bin alarm bildirimi

Alarm Type: {alert_type}
Message: {message}

Bu e-posta FastAPI backend tarafindan otomatik gonderilmistir.
"""
    )

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(email)

        print(f"Email gonderildi: {to_email}")
        return True

    except Exception as error:
        print(f"Email gonderilemedi: {error}")
        return False
