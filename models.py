from app import db
from datetime import datetime


class Contact(db.Model):
    """Model for storing contact form submissions"""
    __tablename__ = 'contacts'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    event_type = db.Column(db.String(50), nullable=True)
    event_date = db.Column(db.Date, nullable=True)
    budget_range = db.Column(db.String(50), nullable=True)
    guest_count = db.Column(db.Integer, nullable=True)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    status = db.Column(db.String(20), default='new', nullable=False)  # new, contacted, completed

    def __repr__(self):
        return f'<Contact {self.name} - {self.email}>'

    def to_dict(self):
        """Convert contact to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'event_type': self.event_type,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'budget_range': self.budget_range,
            'guest_count': self.guest_count,
            'message': self.message,
            'created_at': self.created_at.isoformat(),
            'status': self.status
        }


class EventInquiry(db.Model):
    """Model for storing detailed event inquiries"""
    __tablename__ = 'event_inquiries'

    id = db.Column(db.Integer, primary_key=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False)
    venue_preference = db.Column(db.String(200), nullable=True)
    special_requirements = db.Column(db.Text, nullable=True)
    additional_services = db.Column(db.Text, nullable=True)  # JSON string of requested services
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship
    contact = db.relationship('Contact', backref=db.backref('inquiries', lazy=True))

    def __repr__(self):
        return f'<EventInquiry {self.id} for Contact {self.contact_id}>'