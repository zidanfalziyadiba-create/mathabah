"""
Mathabah Architectural Systems - Core Application Engine
Enterprise Backend Architecture & Security Middleware
"""

import os
import sqlite3
from datetime import datetime
from flask import Flask, render_template, request, abort

app = Flask(__name__)
DATABASE_PATH = os.path.join(os.path.dirname(__file__), "mathabah_secure.db")


def init_security_storage():
    """تهيئة قاعدة بيانات سجلات الأمان والحماية السحابية."""
    with sqlite3.connect(DATABASE_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS security_audit_trail (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                client_ip TEXT NOT NULL,
                user_agent TEXT,
                attack_vector TEXT NOT NULL,
                targeted_path TEXT NOT NULL
            )
            """
        )
        conn.commit()


init_security_storage()


def record_security_incident(ip_address, user_agent, incident_type, endpoint):
    """تدوين الأنشطة المشبوهة ومحاولات الفحص التلقائي في السجل المشفر."""
    try:
        with sqlite3.connect(DATABASE_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO security_audit_trail 
                (timestamp, client_ip, user_agent, attack_vector, targeted_path)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
                    ip_address,
                    user_agent,
                    incident_type,
                    endpoint,
                ),
            )
            conn.commit()
    except Exception as err:
        pass


@app.after_request
def enforce_security_policies(response):
    """تطبيق رؤوس الأمان الصارمة لمنع هجمات الحقن والتضمين الخبيث."""
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self' https:; "
        "style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com; "
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; "
        "script-src 'self'; "
        "img-src 'self' data: https:;"
    )
    return response


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/wp-admin")
@app.route("/administrator")
@app.route("/.env")
@app.route("/config.php")
@app.route("/shell.php")
@app.route("/actuator")
def security_honeypot():
    """مصائد استدراجية لاكتشاف وتوثيق أدوات الفحص الآلي للمخترقين."""
    remote_ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    user_agent = request.headers.get("User-Agent", "Unknown Client")
    record_security_incident(
        remote_ip, user_agent, "Automated Exploit Reconnaissance", request.path
    )
    abort(404)


if __name__ == "__main__":
    app.run(debug=True, port=5000)