
from pydantic import BaseModel, EmailStr, HttpUrl


class Project(BaseModel):
    id: int
    title: str
    description: str
    tags: list[str] = []
    github_url: HttpUrl | None = None
    live_url: HttpUrl | None = None
    image_url: HttpUrl | None = None


class ContactMessage(BaseModel):
	name: str
	email: EmailStr
	subject: str
	message: str


class BlogPost(BaseModel):
    slug: str
    title: str
    summary: str
    content: str
    created_at: str


class BlogPostListItem(BaseModel):
    slug: str
    title: str
    summary: str
    created_at: str


class BlogPostCreate(BaseModel):
    title: str
    summary: str
    content: str


class BlogPostUpdate(BaseModel):
    title: str | None = None
    summary: str | None = None
    content: str | None = None


