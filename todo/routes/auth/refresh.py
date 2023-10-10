from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_login import login_user

from . import auth_bp, check_if_token_is_revoked


@auth_bp.route("/refresh", methods=["POST"], strict_slashes=False)
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()

    access_token = {"access_token": create_access_token(identity=current_user)}

    return jsonify(access_token), 201
