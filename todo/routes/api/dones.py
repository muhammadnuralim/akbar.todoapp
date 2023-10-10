from flask import request, jsonify
from flask_jwt_extended import jwt_required, current_user

from . import api_bp, load_user, unauthorized
from ...extensions import db
from ...models import Todos, Projects


@api_bp.route(
    "/users/<int:user_id>/dones",
    methods=["GET"],
    strict_slashes=False,
)
@jwt_required()
def get_all_dones(user_id):
    """Get the data of all Done (finished) tasks from a single user"""
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    dones = db.session.execute(
        db.select(Todos)
        .join(Projects, Todos.project_id == Projects.project_id)
        .filter(Projects.user_id == user_id)
        .filter(Todos.is_done == True)
        .order_by(Todos.todo_id)
    ).scalars()
    data = []
    for done in dones:
        serial = done.serialize()
        serial.update({"project_title": done.projects.title})
        data.append(serial)

    return jsonify({"success": True, "data": data}), 200
