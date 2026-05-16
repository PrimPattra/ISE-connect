from __future__ import annotations
from datetime import datetime, timezone
from typing import Literal, Optional
from pydantic import BaseModel, Field

ApplicantStatus = Literal['New', 'Reviewing', 'Interview', 'Hired', 'Pass']


class ApplicantProject(BaseModel):
    title: str
    skills: list[str]


class ApplicationCreate(BaseModel):
    job_id: str


class ApplicationDoc(BaseModel):
    id: Optional[str] = None
    job_id: str                        # ObjectId string of the job
    user_id: str                       # ObjectId string of the applicant
    # denormalized snapshot of hunter profile at time of apply
    name: str
    tag: str                           # e.g. "ICE#21"
    track: str
    headline: str
    skills: list[str]
    avatar_color: Optional[str] = None
    projects: list[ApplicantProject] = []
    status: ApplicantStatus = 'New'
    applied_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={'id'})

    @classmethod
    def from_mongo(cls, doc: dict) -> ApplicationDoc:
        doc = dict(doc)
        doc['id'] = str(doc.pop('_id'))
        return cls(**doc)

    def to_response(self) -> dict:
        from utils import camel_dict
        d = self.model_dump(exclude={'user_id', 'applied_at'})
        d['applied'] = self.applied_at.isoformat()
        return camel_dict(d)


class StatusUpdate(BaseModel):
    status: ApplicantStatus
