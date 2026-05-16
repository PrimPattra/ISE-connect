from flask import Blueprint, jsonify, request, g
from bson import ObjectId
from pydantic import ValidationError

from db import projects_col, users_col
from models import ProjectCreate, ProjectDoc, ProjectAuthor
from middleware.auth import require_auth, hunter_only, optional_auth

projects_bp = Blueprint('projects', __name__)


@projects_bp.get('/')
@optional_auth
def list_projects():
    docs = list(projects_col.find().sort('created_at', -1))
    return jsonify([ProjectDoc.from_mongo(d).to_response(g.user_id) for d in docs]), 200


@projects_bp.get('/<project_id>')
@optional_auth
def get_project(project_id):
    raw = projects_col.find_one({'_id': ObjectId(project_id)})
    if not raw:
        return jsonify({'error': 'Project not found'}), 404
    projects_col.update_one({'_id': ObjectId(project_id)}, {'$inc': {'views': 1}})
    return jsonify(ProjectDoc.from_mongo(raw).to_response(g.user_id)), 200


@projects_bp.post('/')
@hunter_only
def create_project():
    try:
        body = ProjectCreate(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 422

    user_raw = users_col.find_one({'_id': ObjectId(g.user_id)})
    if not user_raw:
        return jsonify({'error': 'User not found'}), 404

    author = ProjectAuthor(
        name=f"{user_raw['first_name']} {user_raw['last_name']}",
        tag=user_raw['cohort'],
        user_id=g.user_id,
    )
    doc = ProjectDoc(by=author, **body.model_dump())
    result = projects_col.insert_one(doc.to_mongo())
    doc.id = str(result.inserted_id)
    return jsonify(doc.to_response(g.user_id)), 201


@projects_bp.patch('/<project_id>/like')
@require_auth
def toggle_like(project_id):
    raw = projects_col.find_one({'_id': ObjectId(project_id)})
    if not raw:
        return jsonify({'error': 'Project not found'}), 404

    liked_by = raw.get('liked_by', [])
    if g.user_id in liked_by:
        projects_col.update_one(
            {'_id': ObjectId(project_id)},
            {'$pull': {'liked_by': g.user_id}, '$inc': {'likes': -1}},
        )
        liked = False
    else:
        projects_col.update_one(
            {'_id': ObjectId(project_id)},
            {'$addToSet': {'liked_by': g.user_id}, '$inc': {'likes': 1}},
        )
        liked = True

    updated = projects_col.find_one({'_id': ObjectId(project_id)})
    return jsonify({'liked': liked, 'likes': updated['likes']}), 200


@projects_bp.delete('/<project_id>')
@hunter_only
def delete_project(project_id):
    raw = projects_col.find_one({'_id': ObjectId(project_id)})
    if not raw:
        return jsonify({'error': 'Project not found'}), 404
    if raw['by']['user_id'] != g.user_id:
        return jsonify({'error': 'You can only delete your own projects'}), 403
    projects_col.delete_one({'_id': ObjectId(project_id)})
    return jsonify({'deleted': True}), 200
