from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from flask_static_digest import FlaskStaticDigest

# Database engine
db = SQLAlchemy()

# Database migration manager
migrate = Migrate()

# Password hash generator
bcrypt = Bcrypt()

# User authentication manager
jwt_manager = JWTManager()
login_manager = LoginManager()

# Static assets compiler
static_digest = FlaskStaticDigest()
