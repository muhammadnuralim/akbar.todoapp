from flask import Blueprint

from ...extensions import db, jwt_manager
from ...models import BlocklistToken

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@jwt_manager.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.execute(
        db.select(BlocklistToken).filter_by(jti=jti)
    ).scalar_one_or_none()

    return token is not None


from . import register, login, refresh, logout
