from flask import render_template, request, flash, redirect, url_for
from app import app, db
from models import Contact, EventInquiry
from datetime import datetime


@app.route('/')
def index():
    """Home page route"""
    return render_template('index.html')


@app.route('/about')
def about():
    """About page route"""
    return render_template('about.html')


@app.route('/services')
def services():
    """Services page route"""
    return render_template('services.html')


@app.route('/gallery')
def gallery():
    """Gallery page route"""
    return render_template('gallery.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page route with form handling"""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        event_type = request.form.get('event_type', '').strip()
        event_date = request.form.get('event_date', '').strip()
        budget_range = request.form.get('budget_range', '').strip()
        guest_count = request.form.get('guest_count', '').strip()
        message = request.form.get('message', '').strip()

        # Basic validation
        if not name or not email or not message:
            flash('Please fill in all required fields (Name, Email, and Event Details).', 'error')
        elif '@' not in email or '.' not in email:
            flash('Please enter a valid email address.', 'error')
        else:
            try:
                # Create new contact record
                new_contact = Contact(
                    name=name,
                    email=email,
                    phone=phone or None,
                    event_type=event_type or None,
                    event_date=datetime.strptime(event_date, '%Y-%m-%d').date() if event_date else None,
                    budget_range=budget_range or None,
                    guest_count=int(guest_count) if guest_count and guest_count.isdigit() else None,
                    message=message
                )

                # Save to database
                db.session.add(new_contact)
                db.session.commit()

                event_text = f" for your {event_type}" if event_type else ""
                flash(
                    f'Thank you, {name}! Your event inquiry{event_text} has been received. Our team will contact you within 24 hours to discuss your requirements.',
                    'success')
                return redirect(url_for('contact'))

            except Exception as e:
                db.session.rollback()
                flash('There was an error processing your request. Please try again.', 'error')
                print(f"Database error: {e}")

    return render_template('contact.html')


@app.route('/admin/contacts')
def admin_contacts():
    """Admin view to see contact form submissions - password protected"""
    # Simple password protection
    auth = request.authorization
    if not auth or auth.username != 'admin' or auth.password != 'roylencia2025':
        return ('Admin Login Required', 401, {'WWW-Authenticate': 'Basic realm="Admin Area"'})

    try:
        contacts = Contact.query.order_by(Contact.created_at.desc()).all()
        return render_template('admin_contacts.html', contacts=contacts)
    except Exception as e:
        flash('Error accessing contact database.', 'error')
        print(f"Database error: {e}")
        return redirect(url_for('index'))


@app.route('/favicon.ico')
def favicon():
    """Serve favicon file"""
    from flask import send_from_directory
    return send_from_directory('static', 'favicon.ico')


@app.errorhandler(404)
def page_not_found(e):
    """404 error handler"""
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    """500 error handler"""
    return render_template('500.html'), 500
