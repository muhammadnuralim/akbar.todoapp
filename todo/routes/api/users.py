from flask import request, jsonify, flash
from flask_jwt_extended import jwt_required, current_user
import json

from . import api_bp, load_user, unauthorized
from ...extensions import db
from ...models import Users


@api_bp.route("/users", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_users():
    """Get all the registered users data"""
    if current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    users = db.session.execute(db.select(Users)).scalars()
    data = [user.serialize() for user in users]

    return jsonify({"success": True, "data": data}), 200


@api_bp.route("/users/<int:user_id>", methods=["GET", "PUT"], strict_slashes=False)
@jwt_required()
def access_user(user_id):
    """
    GET: Get the data of a single user
    PUT: Update the data
    """
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    user = db.session.execute(
        db.select(Users).filter_by(user_id=user_id)
    ).scalar_one_or_none()
    data = user.serialize()

    if request.method == "PUT":
        try:
            updated_data = json.loads(request.get_data(as_text=True))
            user.name = updated_data["name"]
            user.role = updated_data["role"]
            user.bio = updated_data["bio"]

            db.session.commit()
        except:
            db.session.rollback()

            return (
                jsonify({"success": False, "message": "Failed to update the profile"}),
                500,
            )
        else:
            updated_data = user.serialize()

            flash("Your profile has been updated", category="success")

            return jsonify({"success": True, "data": updated_data}), 201

    return jsonify({"success": True, "data": data}), 200
