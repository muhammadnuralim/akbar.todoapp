from datetime import datetime
from flask_login import UserMixin

from . import db, bcrypt


class Users(db.Model, UserMixin):
    __tablename__ = "users"
    user_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.String(1000))
    created_at = db.Column(db.DateTime(), nullable=False, default=datetime.now())
    projects = db.Relationship("Projects", back_populates="users", lazy=True)

    def serialize(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "role": self.role,
            "bio": self.bio,
            "email": self.email,
            "created_at": self.created_at,
        }

    def get_id(self):
        return self.user_id

    @property
    def password(self):
        return self.password

    @password.setter
    def password(self, plain_text_password):
        self.password_hash = bcrypt.generate_password_hash(plain_text_password).decode(
            "utf-8"
        )

    def password_auth(self, password_input):
        return bcrypt.check_password_hash(self.password_hash, password_input)

    def __repr__(self):
        return f"{self.name}"


class Projects(db.Model):
    __tablename__ = "projects"
    project_id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(250))
    user_id = db.Column(db.Integer(), db.ForeignKey("users.user_id"))
    created_at = db.Column(db.DateTime(), nullable=False, default=datetime.now())
    users = db.relationship("Users", back_populates="projects")
    todos = db.relationship(
        "Todos", back_populates="projects", lazy=True, cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "project_id": self.project_id,
            "title": self.title,
            "description": self.description,
            "user_id": self.user_id,
            "created_at": self.created_at,
        }

    def __repr__(self):
        return f"{self.title}"


class Todos(db.Model):
    __tablename__ = "todos"
    todo_id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(250))
    project_id = db.Column(db.Integer(), db.ForeignKey("projects.project_id"))
    is_done = db.Column(db.Boolean(), nullable=False, default=False)
    created_at = db.Column(db.DateTime(), nullable=False, default=datetime.now())
    projects = db.relationship("Projects", back_populates="todos")

    def serialize(self):
        return {
            "todo_id": self.todo_id,
            "title": self.title,
            "description": self.description,
            "project_id": self.project_id,
            "is_done": self.is_done,
            "created_at": self.created_at,
        }

    def __repr__(self):
        return f"{self.title}"


class BlocklistToken(db.Model):
    token_id = db.Column(db.Integer(), primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)

    def serialize(self):
        return {"token_id": self.token_id, "jti": self.jti}
