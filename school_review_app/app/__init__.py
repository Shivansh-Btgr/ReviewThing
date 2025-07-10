from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS
from .config import Config
from dotenv import load_dotenv
import os

db = SQLAlchemy()
csrf = CSRFProtect()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
    db.init_app(app)
    csrf.init_app(app)
    from .api import api_bp
    csrf.exempt(api_bp)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    from .routes import routes_bp
    from .api import api_bp
    app.register_blueprint(routes_bp)
    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()

    return app
