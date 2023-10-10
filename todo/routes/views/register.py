from flask import render_template, redirect, url_for
from flask_login import current_user

from . import views_bp, load_user, unauthorized
from ...forms import RegisterForm


@views_bp.route("/register", methods=["GET", "POST"], strict_slashes=False)
def register_page():
    if current_user.is_authenticated:
        return redirect(url_for("views.home_page"))

    form = RegisterForm()

    return render_template("register.html", form=form)
