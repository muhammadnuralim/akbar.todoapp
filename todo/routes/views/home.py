from flask import render_template
from flask_login import current_user, login_required

from . import views_bp, load_user, unauthorized
from ...forms import AddTodoForm, EditTodoForm, AddProjectForm


@views_bp.route("/home", strict_slashes=False)
@login_required
def home_page():
    add_todo_form = AddTodoForm()
    add_todo_form.load_choices(current_user.user_id)

    edit_todo_form = EditTodoForm()
    edit_todo_form.load_choices(current_user.user_id)

    add_project_form = AddProjectForm()

    return render_template(
        "index.html",
        add_todo_form=add_todo_form,
        add_project_form=add_project_form,
        edit_todo_form=edit_todo_form,
    )
