"""Creates the database, the tables, the admin account and the starter questions.

Run once:   python init_db.py
"""
import random
import mysql.connector
from werkzeug.security import generate_password_hash
from config import Config
from seed_data import QUESTIONS


def main():
    # 1. Create database and tables from schema.sql
    conn = mysql.connector.connect(host=Config.DB_HOST, user=Config.DB_USER,
                                   password=Config.DB_PASSWORD)
    cur = conn.cursor()
    script = open("schema.sql", encoding="utf-8").read().replace("quizdb", Config.DB_NAME)
    for statement in script.split(";"):
        if statement.strip():
            cur.execute(statement)
    conn.commit()
    cur.close(); conn.close()
    print("Database and tables are ready.")

    conn = mysql.connector.connect(host=Config.DB_HOST, user=Config.DB_USER,
                                   password=Config.DB_PASSWORD, database=Config.DB_NAME)
    cur = conn.cursor()

    # 2. Admin account
    cur.execute("SELECT user_id FROM users WHERE email = %s", (Config.ADMIN_EMAIL,))
    if cur.fetchone():
        print("Admin account already exists.")
    else:
        cur.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, 'admin')",
            (Config.ADMIN_NAME, Config.ADMIN_EMAIL, generate_password_hash(Config.ADMIN_PASSWORD)))
        print(f"Admin created: {Config.ADMIN_EMAIL} / {Config.ADMIN_PASSWORD}  (change it!)")

    # 3. Starter questions (only if the table is empty)
    cur.execute("SELECT COUNT(*) FROM questions")
    if cur.fetchone()[0] == 0:
        rng = random.Random(7)
        difficulty_counts = {name: 0 for name in ("Phishing", "Malware", "Password Security", "Online Safety")}
        cur.execute("SELECT category_id, category_name FROM categories")
        cat_ids = {name: cid for cid, name in cur.fetchall()}
        for cat, text, correct, wrong, explanation in QUESTIONS:
            index = difficulty_counts[cat]
            difficulty = ("easy", "medium", "hard")[min(index // 5, 2)]
            difficulty_counts[cat] += 1
            cur.execute(
                "INSERT INTO questions (category_id, question_text, explanation, difficulty) VALUES (%s, %s, %s, %s)",
                (cat_ids[cat], text, explanation, difficulty))
            qid = cur.lastrowid
            options = [(correct, 1)] + [(w, 0) for w in wrong]
            rng.shuffle(options)
            for opt_text, flag in options:
                cur.execute(
                    "INSERT INTO options (question_id, option_text, is_correct) VALUES (%s, %s, %s)",
                    (qid, opt_text, flag))
        print(f"{len(QUESTIONS)} starter questions added.")
    # Upgrade older databases created by the earlier version: distribute each
    # category's existing 15 starter questions into 5 questions per level.
    cur.execute("SELECT COUNT(*) FROM questions WHERE difficulty IN ('medium','hard')")
    if cur.fetchone()[0] == 0:
        cur.execute("SELECT category_id FROM categories")
        for (category_id,) in cur.fetchall():
            cur.execute("SELECT question_id FROM questions WHERE category_id=%s ORDER BY question_id", (category_id,))
            ids = [row[0] for row in cur.fetchall()]
            for index, question_id in enumerate(ids):
                level = ("easy", "medium", "hard")[min(index // 5, 2)]
                cur.execute("UPDATE questions SET difficulty=%s WHERE question_id=%s", (level, question_id))
        print("Difficulty levels checked/upgraded.")

    conn.commit()
    cur.close(); conn.close()


if __name__ == "__main__":
    main()
