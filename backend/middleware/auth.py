import jwt
from functools import wraps
from flask import request, jsonify, g
from config import JWT_SECRET


def _decode_token():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None, ('Missing or invalid Authorization header', 401)
    try:
        payload = jwt.decode(auth[7:], JWT_SECRET, algorithms=['HS256'])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, ('Token expired', 401)
    except jwt.InvalidTokenError:
        return None, ('Invalid token', 401)


def require_auth(f):
    """Any authenticated user."""
    @wraps(f)
    def decorated(*args, **kwargs):
        payload, err = _decode_token()
        if err:
            return jsonify({'error': err[0]}), err[1]
        g.user_id = payload['sub']
        g.role = payload['role']
        return f(*args, **kwargs)
    return decorated


def hunter_only(f):
    """Authenticated hunters only."""
    @wraps(f)
    def decorated(*args, **kwargs):
        payload, err = _decode_token()
        if err:
            return jsonify({'error': err[0]}), err[1]
        if payload['role'] != 'hunter':
            return jsonify({'error': 'Hunter access only'}), 403
        g.user_id = payload['sub']
        g.role = payload['role']
        return f(*args, **kwargs)
    return decorated


def recruiter_only(f):
    """Authenticated recruiters only."""
    @wraps(f)
    def decorated(*args, **kwargs):
        payload, err = _decode_token()
        if err:
            return jsonify({'error': err[0]}), err[1]
        if payload['role'] != 'recruiter':
            return jsonify({'error': 'Recruiter access only'}), 403
        g.user_id = payload['sub']
        g.role = payload['role']
        return f(*args, **kwargs)
    return decorated


def optional_auth(f):
    """Sets g.user_id / g.role if token present; does not fail if missing."""
    @wraps(f)
    def decorated(*args, **kwargs):
        payload, _ = _decode_token()
        g.user_id = payload['sub'] if payload else None
        g.role = payload['role'] if payload else None
        return f(*args, **kwargs)
    return decorated
