"""Email service using SendGrid. Falls back to logging when API key not configured."""

import logging
from .config import SENDGRID_API_KEY, SENDGRID_FROM_EMAIL

logger = logging.getLogger("wellverse.email")


def send_email(to_email: str, subject: str, html_content: str) -> bool:
    if not SENDGRID_API_KEY:
        logger.info(f"[EMAIL-DEV] To: {to_email} | Subject: {subject}")
        logger.info(f"[EMAIL-DEV] Body preview: {html_content[:200]}...")
        return True

    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail

        message = Mail(
            from_email=SENDGRID_FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            html_content=html_content,
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code in (200, 201, 202)
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return False


def send_waitlist_confirmation(email: str, vertical_label: str):
    send_email(
        to_email=email,
        subject=f"You're on the {vertical_label} waitlist — WellVerse",
        html_content=f"""
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:30px;">
            <h2 style="color:#2A6A60;">You're on the waitlist!</h2>
            <p>Thanks for joining the <strong>{vertical_label}</strong> waitlist on WellVerse.</p>
            <p>We'll email you as soon as this vertical launches with vetted guides ready to book.</p>
            <p style="color:#8A9E96;font-size:13px;margin-top:30px;">— The WellVerse Team</p>
        </div>
        """,
    )


def send_booking_confirmation(email: str, guide_name: str, date_time: str, booking_type: str):
    send_email(
        to_email=email,
        subject=f"{'Intro call' if booking_type == 'intro' else 'Session'} booked with {guide_name} — WellVerse",
        html_content=f"""
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:30px;">
            <h2 style="color:#2A6A60;">Booking Confirmed!</h2>
            <p>Your <strong>{'free 30-min intro call' if booking_type == 'intro' else 'session'}</strong>
            with <strong>{guide_name}</strong> is confirmed.</p>
            <p><strong>When:</strong> {date_time}</p>
            <p>You'll receive a reminder before the session.</p>
            <p style="color:#8A9E96;font-size:13px;margin-top:30px;">— The WellVerse Team</p>
        </div>
        """,
    )


def send_application_received(email: str, name: str):
    send_email(
        to_email=email,
        subject="Application received — WellVerse",
        html_content=f"""
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:30px;">
            <h2 style="color:#2A6A60;">We've received your application, {name}!</h2>
            <p>Our team reviews applications weekly. You'll hear back within 5 business days.</p>
            <p>If approved, your first 90 days on WellVerse are <strong>zero commission</strong>.</p>
            <p style="color:#8A9E96;font-size:13px;margin-top:30px;">— The WellVerse Team</p>
        </div>
        """,
    )


def send_application_decision(email: str, name: str, approved: bool):
    if approved:
        send_email(
            to_email=email,
            subject="Welcome to WellVerse — You're approved!",
            html_content=f"""
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:30px;">
                <h2 style="color:#2A6A60;">Congratulations, {name}!</h2>
                <p>Your application to join WellVerse as a guide has been <strong>approved</strong>.</p>
                <p>Your temporary password is <strong>welcome123</strong> — please change it after signing in.</p>
                <p>Your first 90 days are <strong>zero commission</strong>.</p>
                <p style="color:#8A9E96;font-size:13px;margin-top:30px;">— The WellVerse Team</p>
            </div>
            """,
        )
    else:
        send_email(
            to_email=email,
            subject="WellVerse application update",
            html_content=f"""
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:30px;">
                <h2 style="color:#6A2A40;">Application Update</h2>
                <p>Hi {name}, after careful review we're unable to approve your application at this time.</p>
                <p>This doesn't mean your work isn't valuable — it means we need to see more alignment with our current verticals and standards.</p>
                <p>You're welcome to reapply in the future.</p>
                <p style="color:#8A9E96;font-size:13px;margin-top:30px;">— The WellVerse Team</p>
            </div>
            """,
        )
