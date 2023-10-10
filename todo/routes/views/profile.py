from flask import render_template
from flask_login import login_required

from . import views_bp, load_user, unauthorized


@views_bp.route("/profile", strict_slashes=False)
@login_required
def profile_page():
    return render_template("profile.html")
