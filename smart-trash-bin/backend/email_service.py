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
        print(f"DEBUG EMAIL: Config eksik! Host:{SMTP_HOST}, Port:{SMTP_PORT}, User:{SMTP_USER}")
        return False

    if not to_email:
        print("DEBUG EMAIL: Alici email adresi yok.")
        return False

    # Sifredeki olasi bosluklari temizle (Gmail uygulama sifreleri icin)
    password = SMTP_PASSWORD.replace(" ", "").strip()

    email = EmailMessage()
    email["From"] = SMTP_USER
    email["To"] = to_email
    email["Subject"] = f"Smart Trash Bin Alert: {alert_type}"
    email.set_content(f"Sistem Uyarisi: {alert_type}\nMesaj: {message}")

    print(f"DEBUG EMAIL: {to_email} adresine baglanti kuruluyor (Port: {SMTP_PORT})...")

    try:
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as smtp:
                print("DEBUG EMAIL: SSL baglantisi kuruldu, login olunuyor...")
                smtp.login(SMTP_USER, password)
                smtp.send_message(email)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as smtp:
                print("DEBUG EMAIL: SMTP baglantisi kuruldu, TLS baslatiliyor...")
                smtp.starttls()
                print("DEBUG EMAIL: TLS basarili, login olunuyor...")
                smtp.login(SMTP_USER, password)
                smtp.send_message(email)

        print(f"DEBUG EMAIL: Basarili! Mail gonderildi: {to_email}")
        return True

    except smtplib.SMTPAuthenticationError:
        print("DEBUG EMAIL: HATA! Gmail Kullanici adi veya Uygulama Sifresi hatali.")
        return False
    except Exception as error:
        print(f"DEBUG EMAIL: HATA! Baglanti sorunu: {error}")
        return False
