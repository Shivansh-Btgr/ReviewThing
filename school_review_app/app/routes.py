from flask import Blueprint, render_template, redirect, url_for, flash
from .forms import ReviewForm
from .models import Review
from . import db

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/add-review', methods=['GET', 'POST'])
def add_review():
    form = ReviewForm()
    if form.validate_on_submit():
        review = Review(
            school_name=form.school_name.data,
            reviewer_name=form.reviewer_name.data,
            rating=form.rating.data,
            comment=form.comment.data
        )
        db.session.add(review)
        db.session.commit()
        flash('Review submitted successfully!', 'success')
        return redirect(url_for('routes.reviews'))
    elif form.is_submitted() and not form.validate():
        flash('Please correct the errors in the form.', 'danger')
    return render_template('add_review.html', form=form)

@routes_bp.route('/reviews')
def reviews():
    all_reviews = Review.query.order_by(Review.id.desc()).all()
    return render_template('reviews.html', reviews=all_reviews)
