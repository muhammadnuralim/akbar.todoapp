from flask import current_app
from flask_wtf import FlaskForm
from wtforms import (
    HiddenField,
    StringField,
    PasswordField,
    SubmitField,
    TextAreaField,
    SelectField,
    ValidationError,
)
from wtforms.validators import InputRequired, DataRequired, Length, Email, EqualTo

from .extensions import db
from .models import *


class RegisterForm(FlaskForm):
    def validate_email(self, email_input):
        """
        Check if the email entered by the user already taken or not. If already taken, raise an error.
        """
        email_exists = db.session.execute(
            db.select(Users).filter(Users.email == email_input.data)
        ).scalar_one_or_none()
        if email_exists:
            raise ValidationError(
                "Email address already registered! Please login or use a different one"
            )

    name = StringField(
        "Name",
        validators=[Length(min=1, max=50), InputRequired()],
        id="form-register-name",
    )
    role = StringField(
        "Role",
        validators=[Length(min=1, max=50), InputRequired()],
        id="form-register-role",
    )
    email = StringField(
        "Email",
        validators=[Length(min=1, max=50), InputRequired(), Email()],
        id="form-register-email",
    )
    password = PasswordField(
        "Password",
        validators=[Length(min=6, max=100), InputRequired()],
        id="form-register-password",
    )
    confirm_password = PasswordField(
        "Confirm Password",
        validators=[EqualTo("password", "The passwords do not match"), InputRequired()],
        id="form-register-confirm-password",
    )


class LoginForm(FlaskForm):
    email = StringField(
        "Email",
        validators=[Length(min=1, max=50), InputRequired(), Email()],
        id="form-login-email",
    )
    password = PasswordField(
        "Password",
        validators=[Length(min=6, max=100), InputRequired()],
        id="form-login-password",
    )


class AddProjectForm(FlaskForm):
    title = StringField(
        "Title",
        validators=[Length(min=1, max=100), InputRequired()],
        id="form-add-project-title",
    )
    description = TextAreaField(
        "Description", validators=[Length(max=250)], id="form-add-project-description"
    )


class EditProjectForm(FlaskForm):
    put_method = HiddenField(name="_method", default="PUT")
    project_id = HiddenField(id="form-edit-project-id")
    title = StringField(
        "Title",
        validators=[Length(min=1, max=100), InputRequired()],
        id="form-edit-project-title",
    )
    description = TextAreaField(
        "Description",
        validators=[Length(max=250)],
        id="form-edit-project-description",
    )


class AddTodoForm(FlaskForm):
    project = SelectField(
        "Choose project:",
        coerce=int,
        validators=[DataRequired()],
        id="form-add-todo-project",
    )
    title = StringField(
        "Title",
        validators=[Length(min=1, max=100), InputRequired()],
        id="form-add-todo-title",
    )
    description = TextAreaField(
        "Description", validators=[Length(max=250)], id="form-add-todo-description"
    )

    def load_choices(self, user_id):
        """
        Fill the options on the select field based on the projects data in the database
        """
        with current_app.app_context():
            projects = db.session.execute(
                db.select(Projects).filter(Projects.user_id == user_id)
            ).scalars()
            self.project.choices = [
                (project.project_id, project.title) for project in projects
            ]


class EditTodoForm(FlaskForm):
    put_method = HiddenField(name="_method", default="PUT")
    todo_id = HiddenField(id="form-edit-todo-id")
    project = SelectField(
        "Choose project:",
        coerce=int,
        validators=[DataRequired()],
        id="form-edit-todo-project",
    )
    title = StringField(
        "Title",
        validators=[Length(min=1, max=100), InputRequired()],
        id="form-edit-todo-title",
    )
    description = TextAreaField(
        "Description", validators=[Length(max=250)], id="form-edit-todo-description"
    )

    def load_choices(self, user_id):
        """
        Fill the options on the select field based on the projects data in the database
        """
        with current_app.app_context():
            projects = db.session.execute(
                db.select(Projects).filter(Projects.user_id == user_id)
            ).scalars()
            self.project.choices = [
                (project.project_id, project.title) for project in projects
            ]
