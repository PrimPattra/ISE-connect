from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class InterviewCreate(BaseModel):
    company: str
    role: str
    rounds: int
    timeline: str
    questions: list[str]


class InterviewDoc(BaseModel):
    id: Optional[str] = None
    company: str
    role: str
    rounds: int
    timeline: str
    questions: list[str]
    by: str                # anonymous tag e.g. "Anonymous · ICE#21"
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={'id'})

    @classmethod
    def from_mongo(cls, doc: dict) -> InterviewDoc:
        doc = dict(doc)
        doc['id'] = str(doc.pop('_id'))
        return cls(**doc)

    def to_response(self) -> dict:
        from utils import camel_dict
        return camel_dict(self.model_dump(exclude={'user_id', 'created_at'}))
