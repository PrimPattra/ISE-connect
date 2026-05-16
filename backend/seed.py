"""
Run once to populate MongoDB with development seed data.
  python seed.py
"""
import bcrypt
from db import (
    users_col, jobs_col, applications_col,
    projects_col, reviews_col, resources_col,
    interviews_col, qa_col, init_indexes,
)
from datetime import datetime, timezone

def now():
    return datetime.now(timezone.utc)

def seed_users():
    users_col.delete_many({})
    password_hash = bcrypt.hashpw(b"password123", bcrypt.gensalt()).decode()
    users = [
        {
            "email": "proudmorakod@student.chula.ac.th",
            "password_hash": password_hash,
            "role": "hunter",
            "first_name": "Proudmorakod",
            "last_name": "T.",
            "student_id": "6430001234",
            "cohort": "ICE#21",
            "avatar_color": "#0d9488",
            "track": "Computer",
            "headline": "CV + robotics, looking for Jun–Aug",
            "skills": ["Python", "ROS", "PyTorch"],
            "created_at": now(),
        },
        {
            "email": "anong@gmail.com",
            "password_hash": password_hash,
            "role": "recruiter",
            "first_name": "Anong",
            "last_name": "K.",
            "student_id": "5830009999",
            "cohort": "ICE#14",
            "company": "Linewell Robotics",
            "company_tag": "Bangkok · Hardware/AI",
            "position": "Engineering Lead",
            "created_at": now(),
        },
        {
            "email": "pim@alumni.chula.ac.th",
            "password_hash": password_hash,
            "role": "hunter",
            "first_name": "Pim",
            "last_name": "L.",
            "student_id": "6130005678",
            "cohort": "ICE#19",
            "avatar_color": "#7c3aed",
            "track": "Computer",
            "headline": "Shipped 4 production Next.js apps",
            "skills": ["Next.js", "TypeScript", "Tailwind"],
            "created_at": now(),
        },
    ]
    result = users_col.insert_many(users)
    print(f"  users: inserted {len(result.inserted_ids)}")
    return {u["email"]: str(uid) for u, uid in zip(users, result.inserted_ids)}


def seed_jobs(user_ids: dict):
    jobs_col.delete_many({})
    anong_id = user_ids.get("anong@gmail.com", "000000000000000000000000")
    pim_id   = user_ids.get("pim@alumni.chula.ac.th", "000000000000000000000000")
    jobs = [
        {
            "title": "Software Engineering Intern",
            "company": "Linewell Robotics",
            "company_tag": "Bangkok · Hardware/AI",
            "type": "Internship",
            "location": "On-site · Bangkok",
            "comp": "฿28,000/mo",
            "skills": ["Python", "ROS", "C++", "Linux"],
            "poster": {"name": "Anong K.", "tag": "ICE#14", "role": "Engineering Lead", "user_id": anong_id},
            "blurb": "Build perception and motion-planning modules for a warehouse pick-and-place arm.",
            "period": "Off-cycle · Jun–Aug",
            "application_link": "https://forms.gle/linewell-swe-intern",
            "saved_by": [],
            "created_at": now(),
        },
        {
            "title": "Frontend Engineer (Contract)",
            "company": "Kapi Studio",
            "company_tag": "Remote · Design tools",
            "type": "Freelance",
            "location": "Remote",
            "comp": "฿900/hr",
            "skills": ["Next.js", "TypeScript", "Tailwind"],
            "poster": {"name": "Pim L.", "tag": "ICE#19", "role": "Founder", "user_id": pim_id},
            "blurb": "3-month contract building a collaborative whiteboard.",
            "period": "Project · 12 weeks",
            "application_link": "https://forms.gle/kapi-frontend",
            "saved_by": [],
            "created_at": now(),
        },
        {
            "title": "Research Assistant — Computer Vision",
            "company": "Chula ISE Vision Lab",
            "company_tag": "Faculty · Pathumwan",
            "type": "Research",
            "location": "Hybrid · Bangkok",
            "comp": "Stipend ฿15,000/mo",
            "skills": ["PyTorch", "OpenCV", "Paper writing"],
            "poster": {"name": "Prof. Naree S.", "tag": "Faculty", "role": "PI, Vision Lab", "user_id": anong_id},
            "blurb": "Joining ongoing work on Thai-language scene-text detection.",
            "period": "Academic · 1 semester",
            "application_link": "https://forms.gle/ise-vision-lab-ra",
            "saved_by": [],
            "created_at": now(),
        },
        {
            "title": "Data Analyst — New Grad",
            "company": "Siam Commercial Insights",
            "company_tag": "Sathorn · Finance",
            "type": "Full-time",
            "location": "On-site · Bangkok",
            "comp": "฿42,000–55,000/mo",
            "skills": ["SQL", "Python", "Tableau", "A/B testing"],
            "poster": {"name": "Worawut J.", "tag": "ICE#11", "role": "Talent Partner", "user_id": anong_id},
            "blurb": "Graduating ICE student preferred. Rotational program across credit, retail, and risk analytics.",
            "period": "New grad · Aug start",
            "application_link": "https://forms.gle/sci-data-analyst",
            "saved_by": [],
            "created_at": now(),
        },
        {
            "title": "Product Design Intern",
            "company": "Moonleaf",
            "company_tag": "Remote · Health",
            "type": "Internship",
            "location": "Remote",
            "comp": "฿20,000/mo",
            "skills": ["Figma", "Prototyping", "Research"],
            "poster": {"name": "Oranas Y.", "tag": "ICE#19", "role": "Design Lead", "user_id": pim_id},
            "blurb": "Owning one feature end-to-end on our menstrual-tracking app.",
            "period": "Off-cycle · 10 weeks",
            "application_link": "https://forms.gle/moonleaf-design-intern",
            "saved_by": [],
            "created_at": now(),
        },
        {
            "title": "ML Engineering — Summer Internship",
            "company": "Aksorn AI",
            "company_tag": "Bangkok · NLP",
            "type": "Internship",
            "location": "Hybrid · Bangkok",
            "comp": "฿32,000/mo",
            "skills": ["Python", "PyTorch", "LLMs", "AWS"],
            "poster": {"name": "Kittipat C.", "tag": "ICE#16", "role": "Tech Lead", "user_id": anong_id},
            "blurb": "Working on Thai-English translation eval pipelines.",
            "period": "Off-cycle · Jun–Aug",
            "application_link": "https://forms.gle/aksorn-ml-intern",
            "saved_by": [],
            "created_at": now(),
        },
    ]
    result = jobs_col.insert_many(jobs)
    print(f"  jobs: inserted {len(result.inserted_ids)}")
    return [str(uid) for uid in result.inserted_ids]


def seed_projects(user_ids: dict):
    projects_col.delete_many({})
    proud_id = user_ids.get("proudmorakod@student.chula.ac.th", "000000000000000000000000")
    pim_id   = user_ids.get("pim@alumni.chula.ac.th", "000000000000000000000000")
    projects = [
        {
            "title": "Phra Nakhon — walking-tour audio guide",
            "by": {"name": "Proudmorakod T.", "tag": "ICE#21", "user_id": proud_id},
            "collaborators": [
                {"name": "Oranas Y.", "tag": "ICE#19"},
                {"name": "Pim L.", "tag": "ICE#19", "user_id": pim_id},
            ],
            "skills": ["React Native", "Whisper", "UI/UX", "Field research"],
            "description": "A self-guided walking tour through old Bangkok with location-triggered audio.",
            "project_link": "https://github.com/proud/phranakhon",
            "contact_info": "proudmorakod@student.chula.ac.th",
            "media": [
                {"kind": "image", "label": "App home screen"},
                {"kind": "image", "label": "On-route detail card"},
                {"kind": "pdf",   "label": "Field study report (12 pp)"},
                {"kind": "link",  "label": "github.com/proud/phranakhon"},
            ],
            "likes": 42, "liked_by": [], "views": 318,
            "created_at": now(),
        },
        {
            "title": "TukTuk OD-matrix — passive Wi-Fi sensor",
            "by": {"name": "Oranas Y.", "tag": "ICE#19", "user_id": pim_id},
            "collaborators": [],
            "skills": ["Python", "ESP32", "Pandas", "Geo"],
            "description": "Estimating origin–destination flow of tuk-tuks in Yaowarat using passive Wi-Fi probe sniffing.",
            "project_link": "https://github.com/oranas/tuktuk-od",
            "contact_info": "oranas@alumni.chula.ac.th",
            "media": [
                {"kind": "image", "label": "Hardware enclosure"},
                {"kind": "image", "label": "Heatmap result"},
                {"kind": "video", "label": "Talk @ ISE Demo Day (3:24)"},
            ],
            "likes": 27, "liked_by": [], "views": 201,
            "created_at": now(),
        },
        {
            "title": "Saam — receipt → spending categories",
            "by": {"name": "Pim L.", "tag": "ICE#19", "user_id": pim_id},
            "collaborators": [{"name": "Proudmorakod T.", "tag": "ICE#21", "user_id": proud_id}],
            "skills": ["Next.js", "OCR", "GPT-4o", "Tailwind"],
            "description": "Snap a Thai receipt, get categorized line-items in your budget app within 4 seconds.",
            "project_link": "https://saam.app",
            "contact_info": "pim@alumni.chula.ac.th",
            "media": [
                {"kind": "image", "label": "Receipt → categories flow"},
                {"kind": "link",  "label": "saam.app"},
            ],
            "likes": 61, "liked_by": [], "views": 487,
            "created_at": now(),
        },
    ]
    result = projects_col.insert_many(projects)
    print(f"  projects: inserted {len(result.inserted_ids)}")


def seed_reviews():
    reviews_col.delete_many({})
    reviews = [
        {
            "company": "Linewell Robotics", "role": "SWE Intern",
            "review_text": "Intense mentorship from senior engineers — real shipping responsibility from week two.",
            "salary": {"amount": 28000, "currency": "THB", "period": "month", "role": "SWE Intern (ICE#21)"},
            "when": "2025 · Internship", "by": "Anonymous · ICE#21",
            "user_id": "seed", "created_at": now(),
        },
        {
            "company": "Aksorn AI", "role": "ML Intern",
            "review_text": "Genuinely interesting Thai-NLP work — you will read papers and ship things in the same week.",
            "salary": {"amount": 32000, "currency": "THB", "period": "month", "role": "ML Intern"},
            "when": "2024 · Internship", "by": "Anonymous · ICE#20",
            "user_id": "seed", "created_at": now(),
        },
        {
            "company": "Siam Commercial Insights", "role": "Data Analyst",
            "review_text": "Great brand on the resume and compensation is genuinely above market for new grads.",
            "salary": None,
            "when": "2024 · Full-time", "by": "Anonymous · ICE#13",
            "user_id": "seed", "created_at": now(),
        },
        {
            "company": "Kapi Studio", "role": "Frontend (Contract)",
            "review_text": "Founders treat contractors like real teammates. Async-friendly, code review is thoughtful.",
            "salary": {"amount": 900, "currency": "THB", "period": "hour", "role": "Frontend Contract"},
            "when": "2025 · Freelance", "by": "Anonymous · ICE#18",
            "user_id": "seed", "created_at": now(),
        },
    ]
    result = reviews_col.insert_many(reviews)
    print(f"  reviews: inserted {len(result.inserted_ids)}")


def seed_resources():
    resources_col.delete_many({})
    resources = [
        {"kind": "Article", "title": "Resume patterns that actually work for ISE students", "author": "Pim L. · ICE#19", "mins": 6, "created_at": now()},
        {"kind": "Video",   "title": "Mock technical interview — vision lab edition",        "author": "Prof. Naree S.",   "mins": 38, "created_at": now()},
        {"kind": "Guide",   "title": "How to choose between FT offer & grad school",         "author": "Worawut J. · ICE#11", "mins": 12, "created_at": now()},
        {"kind": "Article", "title": "Building a portfolio when you have no shipped work",   "author": "Oranas Y. · ICE#19", "mins": 8, "created_at": now()},
    ]
    result = resources_col.insert_many(resources)
    print(f"  resources: inserted {len(result.inserted_ids)}")


def seed_applications(user_ids: dict, job_ids: list):
    applications_col.delete_many({})
    proud_id = user_ids.get("proudmorakod@student.chula.ac.th", "seed")
    pim_id   = user_ids.get("pim@alumni.chula.ac.th", "seed")
    if len(job_ids) < 2:
        print("  applications: skipped (not enough jobs)")
        return
    applications = [
        {
            "job_id": job_ids[0], "user_id": proud_id,
            "name": "Proudmorakod T.", "tag": "ICE#21", "track": "Computer",
            "headline": "CV + robotics, looking for Jun–Aug",
            "skills": ["Python", "ROS", "PyTorch"],
            "avatar_color": "#0d9488",
            "projects": [
                {"title": "Phra Nakhon — walking-tour audio guide", "skills": ["React Native", "Whisper"]},
            ],
            "status": "New",
            "applied_at": now(),
        },
        {
            "job_id": job_ids[1], "user_id": pim_id,
            "name": "Pim L.", "tag": "ICE#19", "track": "Computer",
            "headline": "Shipped 4 production Next.js apps",
            "skills": ["Next.js", "TypeScript", "Tailwind"],
            "avatar_color": "#7c3aed",
            "projects": [
                {"title": "Saam — receipt → spending categories", "skills": ["Next.js", "OCR"]},
            ],
            "status": "Interview",
            "applied_at": now(),
        },
    ]
    result = applications_col.insert_many(applications)
    print(f"  applications: inserted {len(result.inserted_ids)}")


if __name__ == "__main__":
    print("Initializing indexes...")
    init_indexes()
    print("Seeding collections...")
    user_ids = seed_users()
    job_ids  = seed_jobs(user_ids)
    seed_projects(user_ids)
    seed_reviews()
    seed_resources()
    seed_applications(user_ids, job_ids)
    print("Done.")
