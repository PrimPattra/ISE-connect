from flask import Flask
from flask_cors import CORS

from db import init_indexes
from routes.auth import auth_bp
from routes.jobs import jobs_bp
from routes.applications import applications_bp
from routes.projects import projects_bp
from routes.reviews import reviews_bp
from routes.resources import resources_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    init_indexes()

    app.register_blueprint(auth_bp,          url_prefix='/auth')
    app.register_blueprint(jobs_bp,          url_prefix='/jobs')
    app.register_blueprint(applications_bp,  url_prefix='/applications')
    app.register_blueprint(projects_bp,      url_prefix='/projects')
    app.register_blueprint(reviews_bp,       url_prefix='/reviews')
    app.register_blueprint(resources_bp,     url_prefix='/resources')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000, host='0.0.0.0')
