from flask import Blueprint, abort

from ...extensions import db, jwt_manager
from ...models import Users

api_bp = Blueprint("api", __name__, url_prefix="/api")


@jwt_manager.user_lookup_loader
def load_user(jwt_header, jwt_payload):
    """
    A function to get a logged in user data so it can be accessed from the 'current_user' object
    """
    identity = jwt_payload["sub"]
    user = db.session.execute(db.select(Users).filter_by(user_id=identity)).scalar_one()
    return user


@jwt_manager.unauthorized_loader
def unauthorized():
    return abort(401)


from . import users, projects, todos, dones
