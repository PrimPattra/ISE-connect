from __future__ import annotations
from datetime import datetime, timezone
from typing import Literal, Optional
from pydantic import BaseModel, Field

MediaKind = Literal['image', 'video', 'pdf', 'link']


class MediaItem(BaseModel):
    kind: MediaKind
    label: str


class ProjectCollaborator(BaseModel):
    name: str
    tag: str
    user_id: Optional[str] = None


class ProjectAuthor(BaseModel):
    name: str
    tag: str
    user_id: str


class ProjectCreate(BaseModel):
    title: str
    description: str
    skills: list[str]
    project_link: str
    contact_info: str
    collaborators: list[ProjectCollaborator] = []
    media: list[MediaItem] = []


class ProjectDoc(BaseModel):
    id: Optional[str] = None
    title: str
    by: ProjectAuthor
    collaborators: list[ProjectCollaborator] = []
    skills: list[str]
    description: str
    project_link: str
    contact_info: str
    media: list[MediaItem] = []
    likes: int = 0
    liked_by: list[str] = []       # user_id list; compute liked:bool per-request
    views: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={'id'})

    @classmethod
    def from_mongo(cls, doc: dict) -> ProjectDoc:
        doc = dict(doc)
        doc['id'] = str(doc.pop('_id'))
        return cls(**doc)

    def to_response(self, requesting_user_id: Optional[str] = None) -> dict:
        from utils import camel_dict
        d = self.model_dump(exclude={'liked_by', 'created_at'})
        d['liked'] = requesting_user_id in self.liked_by if requesting_user_id else False
        return camel_dict(d)
