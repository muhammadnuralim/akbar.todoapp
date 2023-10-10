from os import environ, path
import datetime
from dotenv import load_dotenv

basedir = path.dirname(__file__)
load_dotenv(path.join(path.dirname(basedir), ".env"))
DB_URI = 'sqlite:///' + path.join(basedir, 'app.db')

class Config:
    """Set Flask config variables."""

    # General Config
    FLASK_APP = environ.get("FLASK_APP")
    FLASK_DEBUG = environ.get("FLASK_DEBUG")
    ENVIRONMENT = environ.get("ENVIRONMENT")
    SECRET_KEY = environ.get("SECRET_KEY")
    STATIC_FOLDER = "static"
    TEMPLATES_FOLDER = "templates"
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = datetime.timedelta(days=7)

    # Database
    SQLALCHEMY_DATABASE_URI = DB_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Authentication
    JWT_SECRET_KEY = environ.get("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=7)
