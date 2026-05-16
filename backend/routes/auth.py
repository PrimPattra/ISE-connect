from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from flask import Blueprint, jsonify, request, g
from bson import ObjectId
from pydantic import ValidationError

from config import JWT_SECRET, JWT_EXPIRY_HOURS
from db import users_col
from models import UserCreate, UserLogin, UserDoc
from middleware.auth import require_auth

auth_bp = Blueprint('auth', __name__)


def _generate_token(user_id: str, role: str) -> str:
    payload = {
        'sub': user_id,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


@auth_bp.post('/register')
def register():
    try:
        body = UserCreate(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 422

    if users_col.find_one({'email': body.email.lower().strip()}):
        return jsonify({'error': 'Email already registered'}), 409

    if users_col.find_one({'student_id': body.student_id.strip()}):
        return jsonify({'error': 'Student ID already registered'}), 409

    password_hash = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()

    doc = UserDoc(
        email=body.email.lower().strip(),
        password_hash=password_hash,
        role=body.role,
        first_name=body.first_name,
        last_name=body.last_name,
        student_id=body.student_id,
        cohort=body.cohort,
        avatar_color=body.avatar_color,
        track=body.track,
        headline=body.headline,
        skills=body.skills,
        company=body.company,
        company_tag=body.company_tag,
        is_alumni=body.is_alumni,
        alumni_cohort=body.alumni_cohort,
        position=body.position,
    )

    result = users_col.insert_one(doc.to_mongo())
    user_id = str(result.inserted_id)
    token = _generate_token(user_id, body.role)

    doc.id = user_id
    return jsonify({'token': token, 'user': doc.to_response()}), 201


@auth_bp.post('/login')
def login():
    try:
        body = UserLogin(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 422

    raw = users_col.find_one({'email': body.email.lower().strip()})
    if not raw:
        return jsonify({'error': 'No account found with this email'}), 404

    if not bcrypt.checkpw(body.password.encode(), raw['password_hash'].encode()):
        return jsonify({'error': 'Incorrect password'}), 401

    user = UserDoc.from_mongo(raw)
    token = _generate_token(user.id, user.role)
    return jsonify({'token': token, 'user': user.to_response()}), 200


@auth_bp.get('/me')
@require_auth
def me():
    raw = users_col.find_one({'_id': ObjectId(g.user_id)})
    if not raw:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(UserDoc.from_mongo(raw).to_response()), 200
