from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class QACreate(BaseModel):
    question: str
    tag: str               # e.g. "Career" | "Compensation" | "Internships"


class QADoc(BaseModel):
    id: Optional[str] = None
    question: str
    answers: int = 0
    by: str                # cohort tag e.g. "ICE#22"
    tag: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={'id'})

    @classmethod
    def from_mongo(cls, doc: dict) -> QADoc:
        doc = dict(doc)
        doc['id'] = str(doc.pop('_id'))
        return cls(**doc)

    def to_response(self) -> dict:
        from utils import camel_dict
        d = self.model_dump(exclude={'user_id', 'created_at'})
        d['q'] = d.pop('question')   # frontend QA type uses 'q' not 'question'
        return camel_dict(d)
