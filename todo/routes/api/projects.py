from flask import request, jsonify, flash
from flask_jwt_extended import jwt_required, current_user

from . import api_bp, load_user, unauthorized
from ...extensions import db
from ...models import Projects
from ...forms import AddProjectForm, EditProjectForm


@api_bp.route(
    "/users/<int:user_id>/projects", methods=["GET", "POST"], strict_slashes=False
)
@jwt_required()
def access_projects(user_id):
    """
    GET: Get the data of all projects from a single user
    POST: Create a new project
    """
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    if request.method == "POST":
        form = AddProjectForm(
            title=request.form["title"], description=request.form["description"]
        )

        if form.validate():
            project = Projects(
                title=form.title.data,
                description=form.description.data,
                user_id=user_id,
            )

            try:
                db.session.add(project)
                db.session.commit()
            except:
                db.session.rollback()

                return (
                    jsonify({"success": False, "message": "Failed to add the project"}),
                    500,
                )
            else:
                flash("Your project has been added!", category="success")
                return jsonify({"success": True, "data": project.serialize()}), 201
        if form.errors != {}:
            errors = [error for error in form.errors.values()]
            return jsonify({"success": False, "message": errors}), 400

    projects = db.session.execute(
        db.select(Projects).filter_by(user_id=user_id).order_by(Projects.project_id)
    ).scalars()
    data = [project.serialize() for project in projects]

    return jsonify({"success": True, "data": data}), 200


@api_bp.route(
    "/users/<int:user_id>/projects/<int:project_id>",
    methods=["GET", "PUT", "DELETE"],
    strict_slashes=False,
)
@jwt_required()
def access_project(user_id, project_id):
    """
    GET: Get the data of a single project from a single user
    PUT: Update the data
    DELETE: Delete the data
    """
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    project = db.session.execute(
        db.select(Projects).filter_by(project_id=project_id)
    ).scalar_one_or_none()
    data = project.serialize()

    if request.method == "PUT":
        form = EditProjectForm(
            title=request.form["title"], description=request.form["description"]
        )

        if form.validate():
            try:
                project.title = form.title.data
                project.description = form.description.data

                db.session.commit()
            except:
                db.session.rollback()

                return (
                    jsonify(
                        {"success": False, "message": "Failed to update the project"}
                    ),
                    500,
                )
            else:
                updated_data = project.serialize()

                flash(f"Your project has been updated!", category="success")

                return jsonify({"success": True, "data": updated_data}), 201

    elif request.method == "DELETE":
        try:
            db.session.delete(project)
            db.session.commit()
        except:
            db.session.rollback()

            return (
                jsonify({"success": False, "message": "Failed to delete the project"}),
                500,
            )
        else:
            flash(f"Your project has been deleted!", category="error")

            return (
                jsonify({"success": True, "message": "Your project has been deleted!"}),
                201,
            )

    return jsonify({"success": True, "data": data}), 200
