from flask import Blueprint, jsonify, request, g
from bson import ObjectId
from pydantic import ValidationError

from db import applications_col, jobs_col, users_col, projects_col
from models import ApplicationCreate, ApplicationDoc, StatusUpdate, ApplicantProject
from middleware.auth import hunter_only, recruiter_only

applications_bp = Blueprint('applications', __name__)


@applications_bp.post('/')
@hunter_only
def apply():
    try:
        body = ApplicationCreate(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 422

    if not jobs_col.find_one({'_id': ObjectId(body.job_id)}):
        return jsonify({'error': 'Job not found'}), 404

    if applications_col.find_one({'job_id': body.job_id, 'user_id': g.user_id}):
        return jsonify({'error': 'Already applied to this job'}), 409

    user_raw = users_col.find_one({'_id': ObjectId(g.user_id)})
    if not user_raw:
        return jsonify({'error': 'User not found'}), 404

    # Snapshot hunter's projects at time of application
    user_projects = list(projects_col.find({'by.user_id': g.user_id}))
    applicant_projects = [
        ApplicantProject(title=p['title'], skills=p['skills'])
        for p in user_projects
    ]

    doc = ApplicationDoc(
        job_id=body.job_id,
        user_id=g.user_id,
        name=f"{user_raw['first_name']} {user_raw['last_name']}",
        tag=user_raw['cohort'],
        track=user_raw.get('track', ''),
        headline=user_raw.get('headline', ''),
        skills=user_raw.get('skills', []),
        avatar_color=user_raw.get('avatar_color'),
        projects=applicant_projects,
    )

    result = applications_col.insert_one(doc.to_mongo())
    doc.id = str(result.inserted_id)
    return jsonify(doc.to_response()), 201


@applications_bp.get('/job/<job_id>')
@recruiter_only
def list_applicants(job_id):
    # Verify the recruiter owns this job
    job_raw = jobs_col.find_one({'_id': ObjectId(job_id)})
    if not job_raw:
        return jsonify({'error': 'Job not found'}), 404
    if job_raw['poster']['user_id'] != g.user_id:
        return jsonify({'error': 'Access denied'}), 403

    docs = list(applications_col.find({'job_id': job_id}).sort('applied_at', -1))
    return jsonify([ApplicationDoc.from_mongo(d).to_response() for d in docs]), 200


@applications_bp.patch('/<application_id>/status')
@recruiter_only
def update_status(application_id):
    try:
        body = StatusUpdate(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 422

    app_raw = applications_col.find_one({'_id': ObjectId(application_id)})
    if not app_raw:
        return jsonify({'error': 'Application not found'}), 404

    # Verify recruiter owns the job this application belongs to
    job_raw = jobs_col.find_one({'_id': ObjectId(app_raw['job_id'])})
    if not job_raw or job_raw['poster']['user_id'] != g.user_id:
        return jsonify({'error': 'Access denied'}), 403

    applications_col.update_one(
        {'_id': ObjectId(application_id)},
        {'$set': {'status': body.status}},
    )
    return jsonify({'status': body.status}), 200


@applications_bp.get('/mine')
@hunter_only
def my_applications():
    docs = list(applications_col.find({'user_id': g.user_id}).sort('applied_at', -1))
    return jsonify([ApplicationDoc.from_mongo(d).to_response() for d in docs]), 200
