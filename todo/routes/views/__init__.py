from flask import Blueprint, redirect, url_for

from ...extensions import db, login_manager
from ...models import Users

views_bp = Blueprint("views", __name__)


@login_manager.user_loader
def load_user(user_id):
    """
    A function to get a logged in user data so it can be accessed from the 'current_user' object
    """
    user = db.session.execute(
        db.select(Users).filter_by(user_id=user_id)
    ).scalar_one_or_none()
    return user


@login_manager.unauthorized_handler
def unauthorized():
    """Redirect all unauthorized visitors to the landing page"""
    return redirect(url_for("views.landing_page"))


from . import landing, home, register, login, profile, projects
