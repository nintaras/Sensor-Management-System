from app import app, db, User, Category, Sensor # Προσθέσαμε τον Sensor εδώ

with app.app_context():
    # 1. Δημιουργία Κατηγοριών
    temp_cat = Category.query.filter_by(name='Θερμοκρασία').first()
    if not temp_cat:
        temp_cat = Category(name='Θερμοκρασία')
        db.session.add(temp_cat)
    
    hum_cat = Category.query.filter_by(name='Υγρασία').first()
    if not hum_cat:
        hum_cat = Category(name='Υγρασία')
        db.session.add(hum_cat)

    # 2. Δημιουργία Χρηστών
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            password='123',
            full_name='Διαχειριστής Συστήματος',
            email='admin@example.com',
            role='Admin'
        )
        db.session.add(admin)

    if not User.query.filter_by(username='user').first():
        simple_user = User(
            username='user',
            password='123',
            full_name='Απλός Χρήστης',
            email='user@example.com',
            role='Simple'
        )
        db.session.add(simple_user)

    # Κάνουμε commit εδώ για να σιγουρευτούμε ότι οι κατηγορίες πήραν ID
    db.session.commit()

    # 3. Δημιουργία Αισθητήρων (Το κομμάτι που έλειπε)
    if not Sensor.query.filter_by(name='S1-LivingRoom').first():
        s1 = Sensor(
            name='S1-LivingRoom', 
            description='Θερμοκρασία Σαλονιού', 
            category_id=temp_cat.id # Σύνδεση με την κατηγορία Θερμοκρασία
        )
        db.session.add(s1)

    if not Sensor.query.filter_by(name='S2-Kitchen').first():
        s2 = Sensor(
            name='S2-Kitchen', 
            description='Υγρασία Κουζίνας', 
            category_id=hum_cat.id # Σύνδεση με την κατηγορία Υγρασία
        )
        db.session.add(s2)

    if not Sensor.query.filter_by(name='S3-Bedroom').first():
        s3 = Sensor(
            name='S3-Bedroom', 
            description='Θερμοκρασία Υπνοδωματίου', 
            category_id=temp_cat.id
        )
        db.session.add(s3)

    db.session.commit()
    print("------------------------------------------")
    print("Η βάση ενημερώθηκε επιτυχώς!")
    print("Προστέθηκαν Χρήστες, Κατηγορίες και Αισθητήρες.")
    print("------------------------------------------")