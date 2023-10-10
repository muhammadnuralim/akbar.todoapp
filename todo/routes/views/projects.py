from flask import render_template
from flask_login import current_user, login_required

from . import views_bp, load_user, unauthorized
from ...forms import AddTodoForm, AddProjectForm, EditProjectForm


@views_bp.route("/projects", strict_slashes=False)
@login_required
def projects_page():
    add_todo_form = AddTodoForm()
    add_todo_form.load_choices(current_user.user_id)

    add_project_form = AddProjectForm()
    edit_project_form = EditProjectForm()

    return render_template(
        "projects.html",
        add_todo_form=add_todo_form,
        add_project_form=add_project_form,
        edit_project_form=edit_project_form,
    )
