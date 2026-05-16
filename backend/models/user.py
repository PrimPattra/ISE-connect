from __future__ import annotations
from datetime import datetime, timezone
from typing import Literal, Optional
from pydantic import BaseModel, Field


# ── Input schemas (API request bodies) ──────────────────────────────────────

class UserCreate(BaseModel):
    email: str
    password: str          # plain-text; hashed before saving
    role: Literal['hunter', 'recruiter']
    first_name: str
    last_name: str
    student_id: str
    cohort: str            # e.g. "ICE#19"
    avatar_color: Optional[str] = None
    # hunter
    track: Optional[str] = None
    headline: Optional[str] = None
    skills: list[str] = []
    # recruiter
    company: Optional[str] = None
    company_tag: Optional[str] = None
    is_alumni: bool = False
    alumni_cohort: Optional[str] = None
    position: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


# ── Document schema (MongoDB shape) ─────────────────────────────────────────

class UserDoc(BaseModel):
    id: Optional[str] = None          # maps to _id (string form of ObjectId)
    email: str
    password_hash: str
    role: Literal['hunter', 'recruiter']
    first_name: str
    last_name: str
    student_id: str
    cohort: str
    avatar_color: Optional[str] = None
    track: Optional[str] = None
    headline: Optional[str] = None
    skills: list[str] = []
    company: Optional[str] = None
    company_tag: Optional[str] = None
    is_alumni: bool = False
    alumni_cohort: Optional[str] = None
    position: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={'id'})

    @classmethod
    def from_mongo(cls, doc: dict) -> UserDoc:
        doc = dict(doc)
        doc['id'] = str(doc.pop('_id'))
        return cls(**doc)

    def to_response(self) -> dict:
        """Safe dict for API responses — password_hash excluded."""
        d = self.model_dump(exclude={'password_hash'})
        d['name'] = self.name
        return d
