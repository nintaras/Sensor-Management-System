from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity
from functools import wraps

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Ρυθμίσεις Βάσης Δεδομένων
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Ρυθμίσεις JWT (Ασφάλεια)
app.config['JWT_SECRET_KEY'] = 'super-secret-key-gia-tin-ergasia-2026' 
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=12)
jwt = JWTManager(app)

db = SQLAlchemy(app)

# --- ΜΟΝΤΕΛΑ ΔΕΔΟΜΕΝΩΝ ---
sensor_categories = db.Table('sensor_categories',
    db.Column('sensor_id', db.Integer, db.ForeignKey('sensors.id', ondelete="CASCADE"), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id', ondelete="CASCADE"), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False) 
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    role = db.Column(db.String(20), default='Simple') 

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

class Sensor(db.Model):
    __tablename__ = 'sensors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    categories = db.relationship('Category', secondary=sensor_categories, lazy='subquery',
                                 backref=db.backref('sensors', lazy=True))
    measurements = db.relationship('Measurement', backref='sensor', cascade="all, delete-orphan", lazy=True)

class Measurement(db.Model):
    __tablename__ = 'measurements'
    id = db.Column(db.Integer, primary_key=True)
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensors.id', ondelete="CASCADE"), nullable=False)
    value = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)  
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# --- DECORATOR ΓΙΑ ΕΛΕΓΧΟ ADMIN ---
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "Admin":
            return jsonify({"status": "error", "message": "Απαγορεύεται η πρόσβαση. Απαιτούνται δικαιώματα διαχειριστή."}), 403
        return fn(*args, **kwargs)
    return wrapper

# --- ROUTES (API ENDPOINTS) ---

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    user = User.query.filter_by(username=data.get('username')).first()
    
    if user and check_password_hash(user.password, data.get('password')):
        # Η διόρθωση είναι εδώ: str(user.id) ώστε να μην έχουμε 422 error
        access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
        return jsonify({
            "status": "success",
            "token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
        }), 200
    return jsonify({"status": "error", "message": "Λάθος στοιχεία σύνδεσης"}), 401

@app.route('/api/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories])

@app.route('/api/sensors', methods=['GET'])
@jwt_required()
def get_sensors():
    sensors = Sensor.query.all()
    result = []
    for s in sensors:
        category_names = ", ".join([c.name for c in s.categories]) if s.categories else "Χωρίς Κατηγορία"
        result.append({
            "id": s.id,
            "name": s.name,
            "category": category_names,
            "description": s.description,
            "categories": [{"id": c.id, "name": c.name} for c in s.categories],
            "measurements_count": len(s.measurements)
        })
    return jsonify(result)

@app.route('/api/sensors', methods=['POST'])
@admin_required 
def create_sensor():
    data = request.get_json() or {}
    name = data.get('name')
    if not name:
        return jsonify({"status": "error", "message": "Το όνομα είναι υποχρεωτικό"}), 400

    new_sensor = Sensor(name=name, description=data.get('description', ''))
    if data.get('category_ids'):
        new_sensor.categories = Category.query.filter(Category.id.in_(data['category_ids'])).all()

    db.session.add(new_sensor)
    db.session.commit()
    return jsonify({"status": "success", "message": "Ο αισθητήρας δημιουργήθηκε"}), 201

@app.route('/api/sensors/<int:sensor_id>', methods=['PUT'])
@admin_required 
def update_sensor(sensor_id):
    sensor = Sensor.query.get_or_404(sensor_id)
    data = request.get_json() or {}
    sensor.name = data.get('name', sensor.name)
    sensor.description = data.get('description', sensor.description)
    if 'category_ids' in data:
        sensor.categories = Category.query.filter(Category.id.in_(data['category_ids'])).all()
    db.session.commit()
    return jsonify({"status": "success", "message": "Ο αισθητήρας ενημερώθηκε"})

@app.route('/api/sensors/<int:sensor_id>', methods=['DELETE'])
@admin_required 
def delete_sensor(sensor_id):
    sensor = Sensor.query.get_or_404(sensor_id)
    db.session.delete(sensor)
    db.session.commit()
    return jsonify({"status": "success", "message": "Ο αισθητήρας διαγράφηκε"})

@app.route('/api/sensors/<int:sensor_id>/measurements', methods=['GET'])
@jwt_required()
def get_sensor_measurements(sensor_id):
    sensor = Sensor.query.get_or_404(sensor_id)
    measurements = Measurement.query.filter_by(sensor_id=sensor.id).order_by(Measurement.timestamp.desc()).all()
    return jsonify([
        {"id": m.id, "value": m.value, "unit": m.unit, "timestamp": m.timestamp.strftime("%Y-%m-%d %H:%M:%S")}
        for m in measurements
    ])

@app.route('/api/sensors/<int:sensor_id>/measurements', methods=['POST'])
def add_measurement(sensor_id):
    Sensor.query.get_or_404(sensor_id)
    data = request.get_json() or {}
    if data.get('value') is None:
        return jsonify({"status": "error", "message": "Η τιμή μέτρησης είναι απαραίτητη"}), 400
    meas = Measurement(sensor_id=sensor_id, value=float(data['value']), unit=data.get('unit', '°C'))
    db.session.add(meas)
    db.session.commit()
    return jsonify({"status": "success", "message": "Η μέτρηση καταγράφηκε"}), 201

@app.route('/api/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "username": u.username, "full_name": u.full_name, "email": u.email, "role": u.role} for u in users])

@app.route('/api/users', methods=['POST'])
@admin_required
def create_user():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"status": "error", "message": "Username και Password είναι υποχρεωτικά"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"status": "error", "message": "Το username υπάρχει ήδη"}), 400

    new_user = User(
        username=username,
        password=generate_password_hash(password),
        full_name=data.get('full_name', ''),
        email=data.get('email', ''),
        role=data.get('role', 'Simple')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"status": "success", "message": "Ο χρήστης δημιουργήθηκε"}), 201

@app.route('/api/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    user.full_name = data.get('full_name', user.full_name)
    user.email = data.get('email', user.email)
    user.role = data.get('role', user.role)
    if data.get('password'):
        user.password = generate_password_hash(data.get('password')) 
    db.session.commit()
    return jsonify({"status": "success", "message": "Ο χρήστης ενημερώθηκε"})

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.username == 'admin':
        return jsonify({"status": "error", "message": "Δεν επιτρέπεται η διαγραφή του βασικού Admin"}), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify({"status": "success", "message": "Ο χρήστης διαγράφηκε"})

@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    total_sensors = Sensor.query.count()
    total_users = User.query.count()
    total_measurements = Measurement.query.count()
    chart_data = [{"name": cat.name, "value": len(cat.sensors)} for cat in Category.query.all()]
    return jsonify({
        "total_sensors": total_sensors, "total_users": total_users,
        "total_measurements": total_measurements, "chart_data": chart_data
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
