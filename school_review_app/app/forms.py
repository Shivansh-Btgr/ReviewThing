from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, NumberRange, Length

class ReviewForm(FlaskForm):
    school_name = StringField('School Name', validators=[DataRequired(), Length(max=100)])
    reviewer_name = StringField('Reviewer Name', validators=[DataRequired(), Length(max=100)])
    rating = IntegerField('Rating (1-5)', validators=[DataRequired(), NumberRange(min=1, max=5)])
    comment = TextAreaField('Comment', validators=[DataRequired()])
    submit = SubmitField('Submit Review')
