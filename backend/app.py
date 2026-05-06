from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import datetime

app = Flask(__name__)
# Επιτρέπουμε στη React να επικοινωνεί με τον Server
CORS(app, resources={r"/*": {"origins": "*"}})

# Ρυθμίσεις Βάσης Δεδομένων
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sensor_db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- ΜΟΝΤΕΛΑ ΔΕΔΟΜΕΝΩΝ ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    role = db.Column(db.String(20), default='Simple')

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    sensors = db.relationship('Sensor', backref='category', lazy=True)

class Sensor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

# Δημιουργία πινάκων αν δεν υπάρχουν
with app.app_context():
    db.create_all()

# --- ROUTES (API ENDPOINTS) ---

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.password == data.get('password'):
        return jsonify({
            "status": "success", 
            "user": {
                "full_name": user.full_name, 
                "role": user.role
            }
        }), 200
    return jsonify({"status": "error", "message": "Λάθος στοιχεία"}), 401

@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    sensors = Sensor.query.all()
    return jsonify([
        {
            "id": s.id, 
            "name": s.name, 
            "category": s.category.name,
            "description": s.description
        } for s in sensors
    ])

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_sensors = Sensor.query.count()
    total_users = User.query.count()
    
    # Υπολογισμός δεδομένων για το κυκλικό γράφημα (Pie Chart)
    categories = Category.query.all()
    chart_data = []
    for cat in categories:
        count = Sensor.query.filter_by(category_id=cat.id).count()
        chart_data.append({"name": cat.name, "value": count})

    return jsonify({
        "total_sensors": total_sensors,
        "total_users": total_users,
        "active_alerts": 0,
        "avg_temp": 24.5,
        "chart_data": chart_data # Αυτό θα κάνει το γράφημα να αλλάζει μόνο του!
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": u.id, 
            "username": u.username, 
            "full_name": u.full_name, 
            "email": u.email, 
            "role": u.role
        } for u in users
    ])

if __name__ == '__main__':
    app.run(debug=True, port=5001)