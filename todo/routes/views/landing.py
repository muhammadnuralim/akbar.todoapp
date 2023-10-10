from flask import render_template, redirect, url_for
from flask_login import current_user

from . import views_bp, load_user, unauthorized


@views_bp.route("/", strict_slashes=False)
def landing_page():
    if current_user.is_authenticated:
        return redirect(url_for("views.home_page"))

    return render_template("landing.html")
