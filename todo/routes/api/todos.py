from flask import request, jsonify, flash
from flask_jwt_extended import jwt_required, current_user
import json

from . import api_bp, load_user, unauthorized
from ...extensions import db
from ...models import Todos, Projects
from ...forms import AddTodoForm, EditTodoForm


@api_bp.route(
    "/users/<int:user_id>/todos",
    methods=["GET", "POST"],
    strict_slashes=False,
)
@jwt_required()
def access_all_todos(user_id):
    """
    GET: Get the data of all To-Do (unfinished) tasks from a single user
    POST: Create a new task
    """
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    if request.method == "POST":
        form = AddTodoForm(
            project=request.form["project"],
            title=request.form["title"],
            description=request.form["description"],
        )
        form.load_choices(user_id)

        if form.validate():
            todo = Todos(
                title=form.title.data,
                description=form.description.data,
                project_id=form.project.data,
            )

            try:
                db.session.add(todo)
                db.session.commit()
            except:
                db.session.rollback()

                return (
                    jsonify({"success": False, "message": "Failed to add the task"}),
                    500,
                )
            else:
                flash("Your task has been added", category="success")
                return jsonify({"success": True, "data": todo.serialize()}), 201
        if form.errors != {}:
            errors = [error for error in form.errors.values()]
            return jsonify({"success": False, "message": errors}), 400

    todos = db.session.execute(
        db.select(Todos)
        .join(Projects, Todos.project_id == Projects.project_id)
        .filter(Projects.user_id == user_id)
        .filter(Todos.is_done == False)
        .order_by(Todos.todo_id)
    ).scalars()
    data = []
    for todo in todos:
        serial = todo.serialize()
        serial.update({"project_title": todo.projects.title})
        data.append(serial)

    return jsonify({"success": True, "data": data}), 200


@api_bp.route(
    "/users/<int:user_id>/projects/<int:project_id>/todos",
    methods=["GET"],
    strict_slashes=False,
)
@jwt_required()
def get_todos(user_id, project_id):
    """Get the data of all tasks (unfinished and finished) of a single project from a single user"""
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    todos = db.session.execute(
        db.select(Todos)
        .join(Projects, Todos.project_id == Projects.project_id)
        .filter(Projects.user_id == user_id, Todos.project_id == project_id)
        .order_by(Todos.todo_id)
    ).scalars()
    data = []
    for todo in todos:
        serial = todo.serialize()
        serial.update({"project_title": todo.projects.title})
        data.append(serial)

    return jsonify({"success": True, "data": data}), 200


@api_bp.route(
    "/users/<int:user_id>/todos/<int:todo_id>",
    methods=["GET", "PUT", "DELETE"],
    strict_slashes=False,
)
@jwt_required()
def access_todo(user_id, todo_id):
    """
    GET: Get the data of a single task from a single user
    PUT: Update the data
    DELETE: Delete the data
    """
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    todo = db.session.execute(
        db.select(Todos).filter(Todos.todo_id == todo_id)
    ).scalar_one_or_none()
    data = todo.serialize()

    if request.method == "PUT":
        if list(request.form) != []:
            form = EditTodoForm(
                project=request.form["project"],
                title=request.form["title"],
                description=request.form["description"],
            )
            form.load_choices(user_id)

            if form.validate():
                todo.title = form.title.data
                todo.description = form.description.data
                todo.project_id = form.project.data
        else:
            updated_data = json.loads(request.get_data(as_text=True))
            todo.is_done = updated_data.get("is_done")

        try:
            db.session.commit()
        except:
            db.session.rollback()

            return (
                jsonify({"success": False, "message": "Failed to update the task"}),
                500,
            )
        else:
            updated_data = todo.serialize()

            flash("Your task has been updated!", category="success")
            return jsonify({"success": True, "data": updated_data}), 201
        if form.errors != {}:
            errors = [error for error in form.errors.values()]
            return jsonify({"success": False, "message": errors}), 400

    elif request.method == "DELETE":
        try:
            db.session.delete(todo)
            db.session.commit()
        except:
            db.session.rollback()

            return (
                jsonify({"success": False, "message": "Failed to delete the task"}),
                500,
            )
        else:
            flash("Your task has been deleted!", category="error")
            return (
                jsonify({"success": True, "message": "Your task has been deleted!"}),
                201,
            )

    return jsonify({"success": True, "data": data}), 200
