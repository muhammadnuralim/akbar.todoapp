from flask import request, jsonify, flash
from flask_jwt_extended import jwt_required, get_jwt
from flask_login import logout_user

from . import auth_bp, check_if_token_is_revoked
from ...extensions import db
from ...models import BlocklistToken


@auth_bp.route("/logout", methods=["POST"], strict_slashes=False)
@jwt_required()
def logout():
    # If the user logs out:
    # 1. Get them out of the session
    logout_user()

    jwt = get_jwt()
    jti = jwt.get("jti")

    token = BlocklistToken(jti=jti)

    # 2. Add their token on the blocklist
    try:
        db.session.add(token)
        db.session.commit()
    except:
        db.session.rollback()

        return jsonify({"success": False, "message": "Logout failed!"}), 500
    else:
        flash("You have been logged out. See you next time.", category="info")
        return jsonify({"success": True, "message": "Logout success!"}), 200
