import os
import resend
from dotenv import load_dotenv






load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
resend.api_key = RESEND_API_KEY

def is_email_configured() -> bool:
    return bool(RESEND_API_KEY)

def send_alert_email(to_email: str, alert_type: str, message: str) -> bool:
    if not is_email_configured():
        print("DEBUG EMAIL: RESEND_API_KEY eksik! Mail gonderilemedi.")
        return False

    if not to_email:
        print("DEBUG EMAIL: Alici adresi eksik.")
        return False

    try:
        print(f"DEBUG EMAIL: Resend API uzerinden {to_email} adresine mail gonderiliyor...")
        
        
        
        
        
        params = {
            "from": "Smart Trash <onboarding@resend.dev>",
            "to": [to_email],
            "subject": f"Kritik Uyari: {alert_type}",
            "html": f"""
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #d32f2f;">Akilli Cop Kovasi Uyarisi</h2>
                    <p><strong>Alarm Tipi:</strong> {alert_type}</p>
                    <p><strong>Mesaj:</strong> {message}</p>
                    <hr/>
                    <p style="font-size: 12px; color: #888;">Bu mail FastAPI backend tarafindan Resend API kullanilarak gonderilmistir.</p>
                </div>
            """,
        }

        r = resend.Emails.send(params)
        print(f"DEBUG EMAIL: Basarili! Resend ID: {r['id']}")
        return True

    except Exception as error:
        print(f"DEBUG EMAIL: Resend hatasi: {error}")
        return False
