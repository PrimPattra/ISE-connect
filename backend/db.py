from pymongo import MongoClient, ASCENDING, DESCENDING
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_col       = db["users"]
jobs_col        = db["jobs"]
applications_col = db["applications"]
projects_col    = db["projects"]
reviews_col     = db["reviews"]
resources_col   = db["resources"]
interviews_col  = db["interviews"]
qa_col          = db["qa"]


def init_indexes():
    """Call once on app startup to ensure indexes exist."""
    users_col.create_index([("email", ASCENDING)], unique=True)
    users_col.create_index([("student_id", ASCENDING)], unique=True)

    jobs_col.create_index([("created_at", DESCENDING)])
    jobs_col.create_index([("type", ASCENDING)])

    applications_col.create_index([("job_id", ASCENDING)])
    applications_col.create_index([("user_id", ASCENDING)])
    # one application per user per job
    applications_col.create_index(
        [("job_id", ASCENDING), ("user_id", ASCENDING)], unique=True
    )

    projects_col.create_index([("created_at", DESCENDING)])
    reviews_col.create_index([("company", ASCENDING)])
    interviews_col.create_index([("company", ASCENDING)])
    qa_col.create_index([("tag", ASCENDING)])
