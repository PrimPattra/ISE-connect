from flask import Blueprint, jsonify, request, g
from bson import ObjectId
from pydantic import ValidationError

from db import resources_col
from models import ResourceCreate, ResourceDoc
from middleware.auth import require_auth, optional_auth

resources_bp = Blueprint('resources', __name__)


@resources_bp.get('/')
@optional_auth
def list_resources():
    kind = request.args.get('kind')
    query = {'kind': kind} if kind else {}
    docs = list(resources_col.find(query).sort('created_at', -1))
    return jsonify([ResourceDoc.from_mongo(d).to_response() for d in docs]), 200


@resources_bp.post('/')
@require_auth
def create_resource():
    try:
        body = ResourceCreate(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 422

    doc = ResourceDoc(**body.model_dump())
    result = resources_col.insert_one(doc.to_mongo())
    doc.id = str(result.inserted_id)
    return jsonify(doc.to_response()), 201
