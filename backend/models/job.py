from __future__ import annotations
from datetime import datetime, timezone
from typing import Literal, Optional
from pydantic import BaseModel, Field

JobType = Literal['Full-time', 'Internship', 'Freelance', 'Research']


class JobPoster(BaseModel):
    name: str
    tag: str
    role: str
    user_id: str           # ObjectId string of the recruiter who posted


class JobCreate(BaseModel):
    title: str
    company: str
    company_tag: str
    type: JobType
    location: str
    comp: str
    skills: list[str]
    blurb: str
    duties: Optional[str] = None
    period: str
    application_link: str


class JobDoc(BaseModel):
    id: Optional[str] = None
    title: str
    company: str
    company_tag: str
    type: JobType
    location: str
    comp: str
    skills: list[str]
    poster: JobPoster
    blurb: str
    duties: Optional[str] = None
    period: str
    application_link: str
    saved_by: list[str] = []   # user_id list; compute saved:bool per-request
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={'id'})

    @classmethod
    def from_mongo(cls, doc: dict) -> JobDoc:
        doc = dict(doc)
        doc['id'] = str(doc.pop('_id'))
        return cls(**doc)

    def to_response(self, requesting_user_id: Optional[str] = None) -> dict:
        from utils import camel_dict
        d = self.model_dump(exclude={'created_at', 'saved_by'})
        d['saved'] = requesting_user_id in self.saved_by if requesting_user_id else False
        d['posted'] = self.created_at.isoformat()
        # strip internal user_id from poster
        d['poster'] = {k: v for k, v in d['poster'].items() if k != 'user_id'}
        return camel_dict(d)
