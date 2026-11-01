"""CyberQuiz - Cybersecurity Awareness Quiz Platform (Flask + MySQL)."""
import hmac
import os
import re
import secrets
from datetime import datetime, timezone
from io import BytesIO
from functools import wraps
from math import ceil
from flask import send_file

import mysql.connector
from flask import (Flask, abort, flash, g, redirect, render_template,
                   request, session, url_for)
from werkzeug.security import check_password_hash, generate_password_hash

from config import Config

app = Flask(__name__)
app.config.from_object(Config)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PER_PAGE = 15
TOPIC_TEXT = {
    "Phishing": "spotting phishing",
    "Malware": "handling malware threats",
    "Password Security": "password security",
    "Online Safety": "staying safe online",
}


# ------------------------------------------------------------------ database
def get_db():
    """One MySQL connection per request, closed automatically."""
    if "db" not in g:
        g.db = mysql.connector.connect(
            host=Config.DB_HOST, user=Config.DB_USER,
            password=Config.DB_PASSWORD, database=Config.DB_NAME)
    return g.db


@app.teardown_appcontext
def close_db(_exc):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def query(sql, params=(), one=False):
    cur = get_db().cursor(dictionary=True, buffered=True)
    cur.execute(sql, params)
    rows = cur.fetchone() if one else cur.fetchall()
    cur.close()
    return rows


def execute(sql, params=()):
    db = get_db()
    cur = db.cursor()
    cur.execute(sql, params)
    db.commit()
    last_id = cur.lastrowid
    cur.close()
    return last_id


# ----------------------------------------------------------- security helpers
def csrf_token():
    if "_csrf" not in session:
        session["_csrf"] = secrets.token_hex(16)
    return session["_csrf"]


app.jinja_env.globals["csrf_token"] = csrf_token


@app.before_request
def check_csrf():
    if request.method == "POST":
        sent = request.form.get("_csrf", "")
        if not sent or not hmac.compare_digest(sent, session.get("_csrf", "")):
            abort(400)


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            flash("Please log in first.", "warning")
            return redirect(url_for("login"))
        user = query("SELECT status FROM users WHERE user_id = %s",
                     (session["user_id"],), one=True)
        if not user or user["status"] != "active":
            session.clear()
            flash("Your account is not available.", "danger")
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return wrapper


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if session.get("role") != "admin":
            flash("Admin access only.", "danger")
            return redirect(url_for("dashboard"))
        return f(*args, **kwargs)
    return wrapper


# ------------------------------------------------------------ template extras
@app.context_processor
def inject_settings():
    return {"quiz_minutes": Config.QUIZ_SECONDS // 60,
            "pass_percent": Config.PASS_PERCENT}


@app.template_filter("dt")
def format_datetime(value):
    if isinstance(value, str):
        try:
            value = datetime.fromisoformat(value)
        except ValueError:
            return value
    return value.strftime("%d %b %Y, %H:%M") if value else ""


@app.errorhandler(400)
def bad_request(_e):
    return render_template("error.html", code=400,
                           message="Bad request or expired form. Please go back and try again."), 400


@app.errorhandler(404)
def not_found(_e):
    return render_template("error.html", code=404, message="Page not found."), 404


# -------------------------------------------------------------- public pages
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm", "")
        error = None
        if not name or len(name) > 100:
            error = "Enter your full name."
        elif not EMAIL_RE.match(email) or len(email) > 120:
            error = "Enter a valid email address."
        elif len(password) < 8:
            error = "Password must be at least 8 characters."
        elif password != confirm:
            error = "Passwords do not match."
        elif query("SELECT user_id FROM users WHERE email = %s", (email,), one=True):
            error = "Email already registered."
        if error:
            flash(error, "danger")
            return render_template("register.html", form=request.form)
        execute("INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
                (name, email, generate_password_hash(password)))
        flash("Registration successful. Please log in.", "success")
        return redirect(url_for("login"))
    return render_template("register.html", form={})


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        user = query("SELECT * FROM users WHERE email = %s", (email,), one=True)
        if user and user["status"] == "active" and \
                check_password_hash(user["password_hash"], password):
            session.clear()                      # prevents session fixation
            session["user_id"] = user["user_id"]
            session["name"] = user["name"]
            session["role"] = user["role"]
            if user["role"] == "admin":
                return redirect(url_for("admin_panel"))
            return redirect(url_for("dashboard"))
        flash("Invalid email or password.", "danger")
        return render_template("login.html", form=request.form)
    return render_template("login.html", form={})


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))


# ------------------------------------------------------------------ user area
@app.route("/dashboard")
@login_required
def dashboard():
    categories = query(
        "SELECT c.category_id, c.category_name, c.description, "
        "COUNT(q.question_id) AS question_count "
        "FROM categories c LEFT JOIN questions q ON q.category_id = c.category_id "
        "GROUP BY c.category_id, c.category_name, c.description "
        "ORDER BY c.category_name")
    taken = query("SELECT COUNT(*) AS n FROM results WHERE user_id = %s",
                  (session["user_id"],), one=True)["n"]
    return render_template("dashboard.html", categories=categories, taken=taken)


@app.route("/quiz/<int:category_id>")
@login_required
def quiz(category_id):
    category = query("SELECT * FROM categories WHERE category_id = %s",
                     (category_id,), one=True)
    if not category:
        abort(404)
    difficulty = request.args.get("difficulty", "easy").lower()
    if difficulty not in ("easy", "medium", "hard"):
        difficulty = "easy"
    lengths = {"easy": 5, "medium": 10, "hard": 15}
    questions = query(
        "SELECT question_id, question_text FROM questions "
        "WHERE category_id = %s AND difficulty = %s ORDER BY RAND() LIMIT %s",
        (category_id, difficulty, lengths[difficulty]))
    if not questions:
        flash("This category has no questions yet.", "warning")
        return redirect(url_for("dashboard"))
    for q in questions:
        # is_correct is NOT sent to the browser
        q["options"] = query(
            "SELECT option_id, option_text FROM options "
            "WHERE question_id = %s ORDER BY RAND()", (q["question_id"],))
    seconds = {"easy": 300, "medium": 600, "hard": 900}[difficulty]
    session["quiz"] = {"category_id": category_id,
                       "difficulty": difficulty,
                       "started_at": datetime.now(timezone.utc).timestamp(),
                       "seconds": seconds,
                       "qids": [q["question_id"] for q in questions]}
    return render_template("quiz.html", category=category, questions=questions,
                           seconds=seconds)


@app.route("/submit/<int:category_id>", methods=["POST"])
@login_required
def submit(category_id):
    quiz_data = session.get("quiz")
    if not quiz_data or quiz_data["category_id"] != category_id:
        flash("Quiz session expired. Please start the quiz again.", "warning")
        return redirect(url_for("dashboard"))
    elapsed = datetime.now(timezone.utc).timestamp() - float(quiz_data.get("started_at", 0))
    timed_out = elapsed > int(quiz_data.get("seconds", Config.QUIZ_SECONDS)) + 5
    category = query("SELECT * FROM categories WHERE category_id = %s",
                     (category_id,), one=True)
    if not category:
        abort(404)

    review, score = [], 0
    for qid in quiz_data["qids"]:
        q = query("SELECT question_text, explanation FROM questions "
                  "WHERE question_id = %s", (qid,), one=True)
        if not q:
            continue
        options = query("SELECT option_id, option_text, is_correct FROM options "
                        "WHERE question_id = %s ORDER BY option_id", (qid,))
        correct_opt = next((o for o in options if o["is_correct"]), None)
        raw = "" if timed_out else request.form.get(f"q_{qid}", "")
        chosen = None
        if raw.isdigit():
            chosen = next((o for o in options if o["option_id"] == int(raw)), None)
        is_right = bool(chosen and chosen["is_correct"])
        score += 1 if is_right else 0
        review.append({
            "question": q["question_text"],
            "explanation": q["explanation"],
            "your_answer": chosen["option_text"] if chosen else None,
            "correct_answer": correct_opt["option_text"] if correct_opt else "",
            "correct": is_right,
        })

    total = len(review)
    if total == 0:
        session.pop("quiz", None)
        return redirect(url_for("dashboard"))
    execute("INSERT INTO results (user_id, category_id, score, total_questions) "
            "VALUES (%s, %s, %s, %s)", (session["user_id"], category_id, score, total))
    session.pop("quiz", None)                    # one submission per quiz

    percent = round(score * 100 / total)
    passed = percent >= Config.PASS_PERCENT
    topic = TOPIC_TEXT.get(category["category_name"], category["category_name"].lower())
    if percent >= 80:
        message = f"Excellent work! You are very strong at {topic}."
    elif passed:
        message = f"Well done! You are getting better at {topic}."
    else:
        message = "Keep practising. Read the explanations below and try again."
    return render_template("result.html", category=category, score=score, total=total,
                           percent=percent, passed=passed, message=message, review=review,
                           timed_out=timed_out)


@app.route("/history")
@login_required
def history():
    rows = query(
        "SELECT r.result_id, r.score, r.total_questions, r.attempt_date, c.category_name, "
        "ROUND(r.score * 100.0 / r.total_questions) AS percent "
        "FROM results r JOIN categories c ON c.category_id = r.category_id "
        "WHERE r.user_id = %s ORDER BY r.attempt_date DESC, r.result_id DESC",
        (session["user_id"],))
    return render_template("history.html", rows=rows)


@app.route("/leaderboard")
@login_required
def leaderboard():
    rows = query(
        "SELECT u.user_id, u.name, COUNT(*) AS quizzes, SUM(r.score) AS total_score, "
        "ROUND(AVG(r.score * 100.0 / r.total_questions)) AS average "
        "FROM results r JOIN users u ON u.user_id = r.user_id "
        "WHERE u.role = 'user' AND u.status = 'active' "
        "GROUP BY u.user_id, u.name "
        "ORDER BY total_score DESC, average DESC, u.name LIMIT 10")
    return render_template("leaderboard.html", rows=rows)


# ----------------------------------------------------------------- admin area
@app.route("/admin")
@login_required
@admin_required
def admin_panel():
    count = lambda sql: query(sql, one=True)["n"]
    stats = {
        "users": count("SELECT COUNT(*) AS n FROM users WHERE role = 'user'"),
        "categories": count("SELECT COUNT(*) AS n FROM categories"),
        "questions": count("SELECT COUNT(*) AS n FROM questions"),
        "attempts": count("SELECT COUNT(*) AS n FROM results"),
    }
    rows = query(
        "SELECT c.category_name, COUNT(r.result_id) AS n "
        "FROM categories c LEFT JOIN results r ON r.category_id = c.category_id "
        "GROUP BY c.category_id, c.category_name ORDER BY c.category_name")
    for row in rows:
        row["percent"] = round(row["n"] * 100 / stats["attempts"]) if stats["attempts"] else 0
    return render_template("admin/panel.html", stats=stats, by_category=rows)


def _read_question_form():
    """Validate the add/edit question form. Returns (data, error)."""
    try:
        category_id = int(request.form.get("category_id", ""))
        correct = int(request.form.get("correct", ""))
    except ValueError:
        return None, "Choose a category and mark the correct option."
    text = request.form.get("question_text", "").strip()
    explanation = request.form.get("explanation", "").strip()
    difficulty = request.form.get("difficulty", "easy").lower()
    if difficulty not in ("easy", "medium", "hard"):
        return None, "Choose a valid difficulty level."
    options = [request.form.get(f"option{i}", "").strip() for i in range(1, 5)]
    if not text:
        return None, "Question text is required."
    if not all(options):
        return None, "All four options are required."
    if len(set(o.lower() for o in options)) < 4:
        return None, "The four options must be different."
    if correct not in (1, 2, 3, 4):
        return None, "Mark one option as correct."
    if not query("SELECT 1 AS ok FROM categories WHERE category_id = %s",
                 (category_id,), one=True):
        return None, "Unknown category."
    return {"category_id": category_id, "text": text, "explanation": explanation,
            "options": options, "correct": correct, "difficulty": difficulty}, None


@app.route("/admin/questions")
@login_required
@admin_required
def admin_questions():
    page = max(request.args.get("page", 1, type=int), 1)
    total = query("SELECT COUNT(*) AS n FROM questions", one=True)["n"]
    pages = max(ceil(total / PER_PAGE), 1)
    page = min(page, pages)
    questions = query(
        "SELECT q.question_id, q.question_text, c.category_name "
        "FROM questions q JOIN categories c ON c.category_id = q.category_id "
        "ORDER BY q.question_id LIMIT %s OFFSET %s",
        (PER_PAGE, (page - 1) * PER_PAGE))
    categories = query("SELECT * FROM categories ORDER BY category_name")
    return render_template("admin/questions.html", questions=questions,
                           categories=categories, page=page, pages=pages)


@app.route("/admin/questions/add", methods=["POST"])
@login_required
@admin_required
def add_question():
    data, error = _read_question_form()
    if error:
        flash(error, "danger")
        return redirect(url_for("admin_questions"))
    qid = execute("INSERT INTO questions (category_id, question_text, explanation, difficulty) "
                  "VALUES (%s, %s, %s, %s)",
                  (data["category_id"], data["text"], data["explanation"], data["difficulty"]))
    for i, opt in enumerate(data["options"], start=1):
        execute("INSERT INTO options (question_id, option_text, is_correct) "
                "VALUES (%s, %s, %s)", (qid, opt, 1 if i == data["correct"] else 0))
    flash("Question added.", "success")
    return redirect(url_for("admin_questions"))


@app.route("/admin/questions/<int:question_id>/edit", methods=["GET", "POST"])
@login_required
@admin_required
def edit_question(question_id):
    q = query("SELECT * FROM questions WHERE question_id = %s", (question_id,), one=True)
    if not q:
        abort(404)
    options = query("SELECT option_id, option_text, is_correct FROM options "
                    "WHERE question_id = %s ORDER BY option_id", (question_id,))
    if request.method == "POST":
        data, error = _read_question_form()
        if error:
            flash(error, "danger")
        else:
            execute("UPDATE questions SET category_id = %s, question_text = %s, "
                    "explanation = %s, difficulty = %s WHERE question_id = %s",
                    (data["category_id"], data["text"], data["explanation"], data["difficulty"], question_id))
            for i, opt in enumerate(options[:4], start=1):
                execute("UPDATE options SET option_text = %s, is_correct = %s "
                        "WHERE option_id = %s",
                        (data["options"][i - 1], 1 if i == data["correct"] else 0,
                         opt["option_id"]))
            flash("Question updated.", "success")
            return redirect(url_for("admin_questions"))
    categories = query("SELECT * FROM categories ORDER BY category_name")
    correct = next((i for i, o in enumerate(options, 1) if o["is_correct"]), 1)
    return render_template("admin/edit_question.html", q=q, categories=categories,
                           option_texts=[o["option_text"] for o in options] + [""] * (4 - len(options)),
                           correct=correct, difficulty=q["difficulty"])


@app.route("/admin/questions/<int:question_id>/delete", methods=["POST"])
@login_required
@admin_required
def delete_question(question_id):
    execute("DELETE FROM questions WHERE question_id = %s", (question_id,))
    flash("Question deleted.", "success")
    return redirect(url_for("admin_questions"))


@app.route("/admin/users")
@login_required
@admin_required
def admin_users():
    users = query("SELECT user_id, name, email, role, status FROM users ORDER BY user_id")
    return render_template("admin/users.html", users=users)


def _set_user_status(user_id, status):
    execute("UPDATE users SET status = %s WHERE user_id = %s AND role = 'user'",
            (status, user_id))


@app.route("/admin/users/<int:user_id>/block", methods=["POST"])
@login_required
@admin_required
def block_user(user_id):
    _set_user_status(user_id, "blocked")
    flash("User blocked.", "success")
    return redirect(url_for("admin_users"))


@app.route("/admin/users/<int:user_id>/unblock", methods=["POST"])
@login_required
@admin_required
def unblock_user(user_id):
    _set_user_status(user_id, "active")
    flash("User unblocked.", "success")
    return redirect(url_for("admin_users"))


@app.route("/admin/users/<int:user_id>/delete", methods=["POST"])
@login_required
@admin_required
def delete_user(user_id):
    execute("DELETE FROM users WHERE user_id = %s AND role = 'user'", (user_id,))
    flash("User deleted.", "success")
    return redirect(url_for("admin_users"))


@app.route("/admin/results")
@login_required
@admin_required
def admin_results():
    rows = query(
        "SELECT r.result_id, u.name, c.category_name, r.score, r.total_questions, "
        "r.attempt_date, ROUND(r.score * 100.0 / r.total_questions) AS percent "
        "FROM results r JOIN users u ON u.user_id = r.user_id "
        "JOIN categories c ON c.category_id = r.category_id "
        "ORDER BY r.attempt_date DESC, r.result_id DESC LIMIT 200")
    return render_template("admin/results.html", rows=rows)



# ---------------------------------------------------------- enhanced features
@app.route("/learn")
@login_required
def learn():
    lessons = [
        ("Phishing", "Phishing is a fake email, message or website designed to steal information.", ["Check the sender address carefully.", "Do not open unexpected attachments.", "Visit websites by typing their address yourself.", "Report suspicious messages to the relevant organisation."]),
        ("Malware", "Malware is harmful software such as viruses, spyware, trojans and ransomware.", ["Install software only from trusted sources.", "Keep your operating system updated.", "Use reputable endpoint protection.", "Keep offline or protected backups."]),
        ("Password Security", "Strong, unique passwords help prevent unauthorised account access.", ["Use a long, unique password for every account.", "Use a password manager.", "Enable multi-factor authentication.", "Never share one-time passwords."]),
        ("Online Safety", "Safe browsing means protecting your personal information and devices online.", ["Use HTTPS websites for sensitive activity.", "Avoid sensitive transactions on public Wi-Fi.", "Review social media privacy settings.", "Do not share personal information with unknown people."]),
        ("Social Engineering", "Social engineering tricks people into revealing information or performing unsafe actions.", ["Be careful with urgent or threatening requests.", "Verify payment or password requests using another channel.", "Never share OTPs or recovery codes.", "Pause and think before clicking links."]),
        ("Two-Factor Authentication", "2FA adds another verification step beyond a password.", ["Prefer authenticator apps or security keys where possible.", "Keep backup codes in a safe place.", "Never approve an unexpected login prompt.", "Remove old devices from account security settings."]),
    ]
    return render_template("learn.html", lessons=lessons)

@app.route("/analytics")
@login_required
def analytics():
    rows = query("SELECT c.category_name, COUNT(*) AS attempts, ROUND(AVG(r.score*100.0/r.total_questions)) AS average, MAX(ROUND(r.score*100.0/r.total_questions)) AS best FROM results r JOIN categories c ON c.category_id=r.category_id WHERE r.user_id=%s GROUP BY c.category_id,c.category_name ORDER BY c.category_name", (session["user_id"],))
    summary = query("SELECT COUNT(*) AS attempts, COALESCE(ROUND(AVG(score*100.0/total_questions)),0) AS average, COALESCE(MAX(ROUND(score*100.0/total_questions)),0) AS best, COALESCE(SUM(score),0) AS correct FROM results WHERE user_id=%s", (session["user_id"],), one=True)
    badges = []
    if summary["attempts"] >= 1: badges.append("First Quiz")
    if summary["attempts"] >= 5: badges.append("Quiz Explorer · 5 Attempts")
    if summary["best"] >= 80: badges.append("Cybersecurity Pro · 80% Best")
    if summary["average"] >= 60 and summary["attempts"] >= 3: badges.append("Consistent Learner")
    return render_template("analytics.html", rows=rows, summary=summary, badges=badges)

@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    user = query("SELECT user_id,name,email,created_at FROM users WHERE user_id=%s", (session["user_id"],), one=True)
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        if not name or len(name) > 100:
            flash("Enter a name up to 100 characters.", "danger")
        else:
            execute("UPDATE users SET name=%s WHERE user_id=%s", (name, session["user_id"]))
            session["name"] = name
            flash("Profile updated.", "success")
            return redirect(url_for("profile"))
    stats = query("SELECT COUNT(*) AS attempts, COALESCE(MAX(ROUND(score*100.0/total_questions)),0) AS best FROM results WHERE user_id=%s", (session["user_id"],), one=True)
    return render_template("profile.html", user=user, stats=stats)

@app.route("/certificate/<int:result_id>")
@login_required
def certificate(result_id):
    row = query("SELECT u.name,c.category_name,r.score,r.total_questions,r.attempt_date FROM results r JOIN users u ON u.user_id=r.user_id JOIN categories c ON c.category_id=r.category_id WHERE r.result_id=%s AND r.user_id=%s", (result_id, session["user_id"]), one=True)
    if not row:
        abort(404)
    percent = round(row["score"] * 100 / row["total_questions"])
    if percent < Config.PASS_PERCENT:
        flash("A certificate is available only after passing a quiz.", "warning")
        return redirect(url_for("history"))
    try:
        from reportlab.lib.pagesizes import landscape, A4
        from reportlab.pdfgen import canvas
    except ImportError:
        flash("Install reportlab to generate certificates: pip install reportlab", "danger")
        return redirect(url_for("history"))
    data = BytesIO()
    pdf = canvas.Canvas(data, pagesize=landscape(A4))
    width, height = landscape(A4)
    pdf.setTitle("CyberQuiz Certificate")
    pdf.setStrokeColorRGB(0.08, 0.25, 0.45); pdf.setLineWidth(5); pdf.rect(25,25,width-50,height-50)
    pdf.setFont("Helvetica-Bold", 30); pdf.drawCentredString(width/2,height-115,"CERTIFICATE OF ACHIEVEMENT")
    pdf.setFont("Helvetica", 16); pdf.drawCentredString(width/2,height-165,"This certificate is proudly presented to")
    pdf.setFont("Helvetica-Bold", 27); pdf.drawCentredString(width/2,height-215,row["name"])
    pdf.setFont("Helvetica", 15); pdf.drawCentredString(width/2,height-260,"For successfully completing the Cybersecurity Awareness Quiz")
    pdf.setFont("Helvetica-Bold", 19); pdf.drawCentredString(width/2,height-300,row["category_name"])
    pdf.setFont("Helvetica", 14); pdf.drawCentredString(width/2,height-340,f"Score: {row['score']}/{row['total_questions']} ({percent}%)")
    pdf.setFont("Helvetica", 11); pdf.drawCentredString(width/2,75,f"Completed: {row['attempt_date']}")
    pdf.save(); data.seek(0)
    return send_file(data, mimetype="application/pdf", as_attachment=True, download_name="CyberQuiz_Certificate.pdf")


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1")
