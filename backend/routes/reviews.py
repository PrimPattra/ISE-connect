from flask import Blueprint, jsonify, request, g
from bson import ObjectId
from pydantic import ValidationError

from db import reviews_col, users_col
from models import ReviewCreate, ReviewDoc
from middleware.auth import hunter_only, optional_auth

reviews_bp = Blueprint('reviews', __name__)


@reviews_bp.get('/')
@optional_auth
def list_reviews():
    company = request.args.get('company')
    query = {'company': company} if company else {}
    docs = list(reviews_col.find(query).sort('created_at', -1))
    return jsonify([ReviewDoc.from_mongo(d).to_response() for d in docs]), 200


@reviews_bp.post('/')
@hunter_only
def create_review():
    try:
        body = ReviewCreate(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 422

    user_raw = users_col.find_one({'_id': ObjectId(g.user_id)})
    if not user_raw:
        return jsonify({'error': 'User not found'}), 404

    doc = ReviewDoc(
        company=body.company,
        role=body.role,
        review_text=body.review_text,
        salary=body.salary,
        when=body.when,
        by=f"Anonymous · {user_raw['cohort']}",
        user_id=g.user_id,
    )

    result = reviews_col.insert_one(doc.to_mongo())
    doc.id = str(result.inserted_id)
    return jsonify(doc.to_response()), 201
