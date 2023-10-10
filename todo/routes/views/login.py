from flask import render_template, redirect, url_for
from flask_login import current_user

from . import views_bp, load_user, unauthorized
from ...forms import LoginForm


@views_bp.route("/login", methods=["GET", "POST"], strict_slashes=False)
def login_page():
    if current_user.is_authenticated:
        return redirect(url_for("views.home_page"))

    form = LoginForm()

    return render_template("login.html", form=form)
