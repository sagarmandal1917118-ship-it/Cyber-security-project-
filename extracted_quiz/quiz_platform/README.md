# CyberQuiz – Cybersecurity Awareness Quiz Platform

## Features
- Registration, login, logout, role-based admin panel
- Four topic categories and admin question management
- Easy/Medium/Hard quiz selection (5/10/15 questions)
- Randomised questions and options; server-side time-limit validation
- Score, answer explanations, attempt history and leaderboard
- Cybersecurity learning resources
- User profile and performance analytics charts
- PDF certificate for passed attempts
- CSRF protection, password hashing, parameterised SQL queries

## Requirements
Python 3.10+, MySQL 8+, and packages in requirements.txt.

## Setup (Windows / VS Code)
1. Extract this ZIP. Open the `quiz_platform` folder in VS Code.
2. Create and activate a virtual environment:
   `python -m venv venv`
   Windows: `venv\Scripts\activate`
   macOS/Linux: `source venv/bin/activate`
3. Install packages: `pip install -r requirements.txt`
4. Ensure MySQL Server is running. Set database credentials as environment variables if needed:
   Windows PowerShell: `$env:DB_HOST='localhost'; $env:DB_USER='root'; $env:DB_PASSWORD='your_mysql_password'`
5. Initialise database and sample data: `python init_db.py`
6. Start website: `python app.py`
7. Open `http://127.0.0.1:5000` in your browser.

## Admin login
Default email: `admin@cyberquiz.com`
Default password: `Admin@12345`
Change the default password and set a strong SECRET_KEY before any public deployment.

## Notes
- The starter question bank is populated by `init_db.py`. Difficulty defaults to easy for existing records; edit questions or update their difficulty in MySQL to populate medium and hard sets.
- Certificate downloads require ReportLab (included in requirements).
- The browser timer is for user feedback; the server independently checks elapsed time on submission.
- This is an educational project. Before production use, add HTTPS, email-based password reset, login throttling, security monitoring and deployment hardening.
