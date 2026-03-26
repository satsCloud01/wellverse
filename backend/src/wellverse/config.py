import os

# JWT
SECRET_KEY = os.getenv("WELLVERSE_SECRET_KEY", "wellverse-dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Stripe
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
STRIPE_PRICE_SEEKER = os.getenv("STRIPE_PRICE_SEEKER", "")  # pay-per-session not subscription
STRIPE_PRICE_COMMITTED = os.getenv("STRIPE_PRICE_COMMITTED", "")  # $49/month

# SendGrid
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")
SENDGRID_FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL", "hello@wellverse.app")

# File uploads
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# App
APP_URL = os.getenv("WELLVERSE_APP_URL", "http://localhost:5190")
