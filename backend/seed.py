from app import app, db, User, Category, Sensor, Measurement
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

with app.app_context():
    # Καθαρισμός και επαναδημιουργία πινάκων
    db.drop_all()
    db.create_all()

    # 1. Χρήστες (Με κρυπτογραφημένους κωδικούς)
    admin = User(
        username='admin', 
        password=generate_password_hash('123'), 
        full_name='Διαχειριστής Συστήματος', 
        email='admin@example.com', 
        role='Admin'
    )
    simple_user = User(
        username='user', 
        password=generate_password_hash('123'), 
        full_name='Απλός Χρήστης', 
        email='user@example.com', 
        role='Simple'
    )
    db.session.add_all([admin, simple_user])

    # 2. Κατηγορίες
    cat_temp = Category(name='Θερμοκρασία')
    cat_hum = Category(name='Υγρασία')
    db.session.add_all([cat_temp, cat_hum])
    db.session.commit()

    # 3. Αισθητήρες 
    s1 = Sensor(name='Αισθητήρας Σαλονιού', description='Κεντρικός χώρος - Θερμοκρασία & Υγρασία')
    s1.categories.extend([cat_temp, cat_hum])

    s2 = Sensor(name='Αισθητήρας Κουζίνας', description='Παρακολούθηση θερμοκρασίας μαγειρέματος')
    s2.categories.append(cat_temp)

    s3 = Sensor(name='Αισθητήρας Μπάνιου', description='Έλεγχος επιπέδων υγρασίας')
    s3.categories.append(cat_hum)

    db.session.add_all([s1, s2, s3])
    db.session.commit()

    # 4. Μετρήσεις
    now = datetime.utcnow()
    measurements = [
        Measurement(sensor_id=s1.id, value=23.4, unit='°C', timestamp=now - timedelta(hours=1)),
        Measurement(sensor_id=s1.id, value=45.0, unit='%', timestamp=now - timedelta(minutes=45)),
        Measurement(sensor_id=s2.id, value=25.1, unit='°C', timestamp=now - timedelta(minutes=20)),
        Measurement(sensor_id=s3.id, value=65.5, unit='%', timestamp=now - timedelta(minutes=10))
    ]
    db.session.add_all(measurements)
    db.session.commit()

    print("------------------------------------------")
    print("Η βάση ενημερώθηκε επιτυχώς")
    print("------------------------------------------")
