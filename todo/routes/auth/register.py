from flask import request, jsonify, flash

from . import auth_bp, check_if_token_is_revoked
from ...extensions import db
from ...models import Users
from ...forms import RegisterForm


@auth_bp.route("/register", methods=["POST"], strict_slashes=False)
def register():
    form = RegisterForm(
        name=request.form["name"],
        role=request.form["role"],
        email=request.form["email"],
        password=request.form["password"],
        confirm_password=request.form["confirm_password"],
    )

    if form.validate():
        user = Users(
            name=form.name.data,
            role=form.role.data,
            email=form.email.data,
            password=form.password.data,
        )

        try:
            db.session.add(user)
            db.session.commit()
        except:
            db.session.rollback()

            return (
                jsonify({"success": False, "message": "Failed to register the user"}),
                500,
            )
        else:
            flash(
                "Your account has been registered. Please login to proceed.",
                category="success",
            )
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "User registration is completed",
                        "data": user.serialize(),
                    }
                ),
                201,
            )
    if form.errors != {}:
        errors = [error for error in form.errors.values()]
        return jsonify({"success": False, "message": errors}), 400
