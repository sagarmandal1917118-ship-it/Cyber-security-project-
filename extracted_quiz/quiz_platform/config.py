import os


class Config:
    # Change these (or set them as environment variables) before running.
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-change-this-secret-key")
    DB_HOST = os.environ.get("DB_HOST", "localhost")
    DB_USER = os.environ.get("DB_USER", "root")
    DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
    DB_NAME = os.environ.get("DB_NAME", "quizdb")

    # Quiz settings
    QUIZ_LENGTH = 5          # questions asked in one attempt
    QUIZ_SECONDS = 300       # time limit of one attempt (5 minutes)
    PASS_PERCENT = 60        # pass mark

    # First admin account created by init_db.py
    ADMIN_NAME = "Administrator"
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@cyberquiz.com")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Admin@12345")

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
