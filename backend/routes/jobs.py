from flask import Blueprint, jsonify, request, g
from bson import ObjectId
from pydantic import ValidationError

from db import jobs_col, users_col
from models import JobCreate, JobDoc, JobPoster
from middleware.auth import require_auth, recruiter_only, optional_auth

jobs_bp = Blueprint('jobs', __name__)


@jobs_bp.get('/')
@optional_auth
def list_jobs():
    type_filter = request.args.get('type')
    query = {'type': type_filter} if type_filter else {}
    docs = list(jobs_col.find(query).sort('created_at', -1))
    return jsonify([JobDoc.from_mongo(d).to_response(g.user_id) for d in docs]), 200


@jobs_bp.get('/<job_id>')
@optional_auth
def get_job(job_id):
    raw = jobs_col.find_one({'_id': ObjectId(job_id)})
    if not raw:
        return jsonify({'error': 'Job not found'}), 404
    return jsonify(JobDoc.from_mongo(raw).to_response(g.user_id)), 200


@jobs_bp.post('/')
@recruiter_only
def create_job():
    try:
        body = JobCreate(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 422

    user_raw = users_col.find_one({'_id': ObjectId(g.user_id)})
    if not user_raw:
        return jsonify({'error': 'User not found'}), 404

    poster = JobPoster(
        name=f"{user_raw['first_name']} {user_raw['last_name']}",
        tag=user_raw['cohort'],
        role=user_raw.get('position', ''),
        user_id=g.user_id,
    )
    doc = JobDoc(poster=poster, **body.model_dump())
    result = jobs_col.insert_one(doc.to_mongo())
    doc.id = str(result.inserted_id)
    return jsonify(doc.to_response(g.user_id)), 201


@jobs_bp.patch('/<job_id>/save')
@require_auth
def toggle_save(job_id):
    raw = jobs_col.find_one({'_id': ObjectId(job_id)})
    if not raw:
        return jsonify({'error': 'Job not found'}), 404

    saved_by = raw.get('saved_by', [])
    if g.user_id in saved_by:
        jobs_col.update_one({'_id': ObjectId(job_id)}, {'$pull': {'saved_by': g.user_id}})
        saved = False
    else:
        jobs_col.update_one({'_id': ObjectId(job_id)}, {'$addToSet': {'saved_by': g.user_id}})
        saved = True

    return jsonify({'saved': saved}), 200


@jobs_bp.get('/mine')
@recruiter_only
def my_jobs():
    docs = list(jobs_col.find({'poster.user_id': g.user_id}).sort('created_at', -1))
    return jsonify([JobDoc.from_mongo(d).to_response(g.user_id) for d in docs]), 200


@jobs_bp.patch('/<job_id>')
@recruiter_only
def edit_job(job_id):
    raw = jobs_col.find_one({'_id': ObjectId(job_id)})
    if not raw:
        return jsonify({'error': 'Job not found'}), 404
    if raw['poster']['user_id'] != g.user_id:
        return jsonify({'error': 'You can only edit your own jobs'}), 403

    body = request.get_json(force=True) or {}
    allowed = {'title', 'type', 'location', 'comp', 'period', 'skills', 'blurb', 'duties', 'application_link'}
    update = {k: v for k, v in body.items() if k in allowed}
    if not update:
        return jsonify({'error': 'No valid fields to update'}), 422

    jobs_col.update_one({'_id': ObjectId(job_id)}, {'$set': update})
    updated = jobs_col.find_one({'_id': ObjectId(job_id)})
    return jsonify(JobDoc.from_mongo(updated).to_response(g.user_id)), 200


@jobs_bp.delete('/<job_id>')
@recruiter_only
def delete_job(job_id):
    raw = jobs_col.find_one({'_id': ObjectId(job_id)})
    if not raw:
        return jsonify({'error': 'Job not found'}), 404
    if raw['poster']['user_id'] != g.user_id:
        return jsonify({'error': 'You can only delete your own jobs'}), 403
    jobs_col.delete_one({'_id': ObjectId(job_id)})
    return jsonify({'deleted': True}), 200
