"""
Faculty Workload and Timetable Management System
Python + MySQL API Server
"""

import os
import json
import http.server
import socketserver
import urllib.parse
import mysql.connector

PORT = 8085
CONFIG_FILE = 'db_config.json'

DEFAULT_CONFIG = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "",
    "database": "university_workload_db"
}

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return DEFAULT_CONFIG.copy()

def save_config(cfg):
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(cfg, f, indent=2)

def get_db_connection(cfg=None):
    if cfg is None:
        cfg = load_config()
    return mysql.connector.connect(
        host=cfg.get("host", "127.0.0.1"),
        port=int(cfg.get("port", 3306)),
        user=cfg.get("user", "root"),
        password=cfg.get("password", ""),
        database=cfg.get("database", "university_workload_db"),
        connection_timeout=3
    )

class APIRequestHandler(http.server.SimpleHTTPRequestHandler):
    def send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/status':
            self.handle_status()
        elif path == '/api/config':
            self.handle_get_config()
        elif path == '/api/faculty':
            self.handle_get_faculty()
        elif path == '/api/timetable':
            self.handle_get_timetable()
        else:
            # Fall back to normal static file serving
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        data = {}
        try:
            data = json.loads(body)
        except Exception:
            pass

        if path == '/api/test-connection':
            self.handle_test_connection(data)
        elif path == '/api/init-database':
            self.handle_init_database(data)
        elif path == '/api/config':
            self.handle_save_config(data)
        else:
            self.send_error(404, "Endpoint not found")

    def handle_get_config(self):
        cfg = load_config()
        safe_cfg = {**cfg, "hasPassword": bool(cfg.get("password"))}
        if "password" in safe_cfg:
            del safe_cfg["password"]
        self.send_json(safe_cfg)

    def handle_save_config(self, data):
        cfg = load_config()
        for k in ["host", "port", "user", "password", "database"]:
            if k in data:
                cfg[k] = data[k]
        save_config(cfg)
        self.send_json({"success": True, "message": "Configuration saved."})

    def handle_status(self):
        cfg = load_config()
        try:
            conn = get_db_connection(cfg)
            if conn.is_connected():
                cursor = conn.cursor()
                cursor.execute("SELECT VERSION(), DATABASE();")
                row = cursor.fetchone()
                cursor.close()
                conn.close()
                self.send_json({
                    "connected": True,
                    "version": row[0],
                    "database": row[1],
                    "host": cfg.get("host"),
                    "port": cfg.get("port"),
                    "user": cfg.get("user")
                })
                return
        except Exception as e:
            self.send_json({
                "connected": False,
                "error": str(e),
                "host": cfg.get("host"),
                "port": cfg.get("port"),
                "user": cfg.get("user")
            })

    def handle_test_connection(self, data):
        host = data.get("host", "127.0.0.1")
        port = int(data.get("port", 3306))
        user = data.get("user", "root")
        password = data.get("password", "")

        try:
            conn = mysql.connector.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                connection_timeout=3
            )
            if conn.is_connected():
                cursor = conn.cursor()
                cursor.execute("SHOW DATABASES LIKE 'university_workload_db';")
                db_exists = bool(cursor.fetchone())
                cursor.close()
                conn.close()

                cfg = load_config()
                cfg["host"] = host
                cfg["port"] = port
                cfg["user"] = user
                cfg["password"] = password
                save_config(cfg)

                self.send_json({
                    "success": True,
                    "databaseExists": db_exists,
                    "message": f"Successfully authenticated with MySQL Server on {host}:{port} as '{user}'! " + 
                               ("Database 'university_workload_db' exists." if db_exists else "Database not created yet.")
                })
        except Exception as e:
            self.send_json({
                "success": False,
                "error": str(e)
            }, status=400)

    def handle_init_database(self, data):
        cfg = load_config()
        password = data.get("password", cfg.get("password", ""))
        cfg["password"] = password

        try:
            conn = mysql.connector.connect(
                host=cfg.get("host", "127.0.0.1"),
                port=int(cfg.get("port", 3306)),
                user=cfg.get("user", "root"),
                password=password,
                connection_timeout=5
            )
            cursor = conn.cursor()

            # Execute schema_mysql.sql script
            script_path = os.path.join(os.path.dirname(__file__), 'schema_mysql.sql')
            with open(script_path, 'r', encoding='utf-8') as f:
                sql_script = f.read()

            for stmt in sql_script.split(';'):
                raw = stmt.strip()
                if not raw or raw.startswith('--') or raw.startswith('DELIMITER') or raw == '//':
                    continue
                try:
                    cursor.execute(raw)
                except Exception:
                    pass

            conn.commit()
            cursor.close()
            conn.close()
            save_config(cfg)

            self.send_json({
                "success": True,
                "message": "Database 'university_workload_db' created & populated with 7 tables, views, and data!"
            })
        except Exception as e:
            self.send_json({
                "success": False,
                "error": f"MySQL error: {str(e)}"
            }, status=400)

    def handle_get_faculty(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM v_faculty_workload_analysis;")
            rows = cursor.fetchall()
            cursor.close()
            conn.close()
            self.send_json({"success": True, "data": rows})
        except Exception as e:
            self.send_json({"success": False, "error": str(e)}, status=500)

    def handle_get_timetable(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM v_timetable_master_schedule;")
            rows = cursor.fetchall()
            cursor.close()
            conn.close()
            self.send_json({"success": True, "data": rows})
        except Exception as e:
            self.send_json({"success": False, "error": str(e)}, status=500)

if __name__ == '__main__':
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), APIRequestHandler) as httpd:
        print(f"Server operational on http://localhost:{PORT}")
        httpd.serve_forever()
