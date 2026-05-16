from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class ResourceCreate(BaseModel):
    kind: str              # "Article" | "Video" | "Guide"
    title: str
    author: str
    mins: int
    description: Optional[str] = None
    url: Optional[str] = None
    image: Optional[str] = None


class ResourceDoc(BaseModel):
    id: Optional[str] = None
    kind: str
    title: str
    author: str
    mins: int
    description: Optional[str] = None
    url: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={'id'})

    @classmethod
    def from_mongo(cls, doc: dict) -> ResourceDoc:
        doc = dict(doc)
        doc['id'] = str(doc.pop('_id'))
        return cls(**doc)

    def to_response(self) -> dict:
        return self.model_dump()
