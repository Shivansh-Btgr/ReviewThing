from . import db

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school_name = db.Column(db.String(100), nullable=False)
    reviewer_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'school_name': self.school_name,
            'reviewer_name': self.reviewer_name,
            'rating': self.rating,
            'comment': self.comment
        }
