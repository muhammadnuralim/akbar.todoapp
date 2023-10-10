from flask import Flask

from .extensions import *


def create_app():
    from . import models
    from .config import Config
    from .routes import api, views, auth

    app = Flask(__name__)

    app.config.from_object(Config)

    app.register_blueprint(api.api_bp)
    app.register_blueprint(views.views_bp)
    app.register_blueprint(auth.auth_bp)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt_manager.init_app(app)
    login_manager.init_app(app)
    static_digest.init_app(app)

    return app


app = create_app()
