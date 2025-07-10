from flask import Blueprint, request, jsonify
from .models import Review
from . import db


from flask_wtf.csrf import CSRFError
from flask import current_app

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.order_by(Review.id.desc()).all()
    return jsonify([r.to_dict() for r in reviews]), 200


@api_bp.route('/review', methods=['POST'])
def add_review_api():
    # Disable CSRF for API POST
    setattr(request, 'csrf_processing_failed', False)
    data = request.get_json()
    errors = []
    if not data:
        return jsonify({'success': False, 'error': 'Missing JSON body'}), 400
    school_name = data.get('school_name')
    reviewer_name = data.get('reviewer_name')
    rating = data.get('rating')
    comment = data.get('comment')
    if not school_name or not isinstance(school_name, str) or len(school_name) > 100:
        errors.append('Invalid or missing school_name')
    if not reviewer_name or not isinstance(reviewer_name, str) or len(reviewer_name) > 100:
        errors.append('Invalid or missing reviewer_name')
    if not isinstance(rating, int) or not (1 <= rating <= 5):
        errors.append('Rating must be an integer between 1 and 5')
    if not comment or not isinstance(comment, str):
        errors.append('Invalid or missing comment')
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    review = Review(
        school_name=school_name,
        reviewer_name=reviewer_name,
        rating=rating,
        comment=comment
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'success': True, 'review': review.to_dict()}), 201

@api_bp.errorhandler(CSRFError)
def handle_csrf_error(e):
    return jsonify({'success': False, 'error': 'CSRF token missing or incorrect'}), 400

@api_bp.route('/review/<int:review_id>', methods=['GET'])
def get_single_review(review_id):
    review = Review.query.get_or_404(review_id)
    return jsonify({'success': True, 'review': review.to_dict()}), 200
