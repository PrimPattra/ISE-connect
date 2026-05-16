from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class Salary(BaseModel):
    amount: float
    currency: str          # e.g. "THB"
    period: str            # e.g. "month" | "hour"
    role: str


class ReviewCreate(BaseModel):
    company: str
    role: str
    review_text: str
    salary: Optional[Salary] = None
    when: str              # e.g. "2025 · Internship"


class ReviewDoc(BaseModel):
    id: Optional[str] = None
    company: str
    role: str
    review_text: str
    salary: Optional[Salary] = None
    when: str
    by: str                # anonymous tag e.g. "Anonymous · ICE#21"
    user_id: str           # actual user_id (never exposed in response)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={'id'})

    @classmethod
    def from_mongo(cls, doc: dict) -> ReviewDoc:
        doc = dict(doc)
        doc['id'] = str(doc.pop('_id'))
        return cls(**doc)

    def to_response(self) -> dict:
        from utils import camel_dict
        return camel_dict(self.model_dump(exclude={'user_id', 'created_at'}))
