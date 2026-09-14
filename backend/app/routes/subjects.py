from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.database import db

router = APIRouter(
    prefix="/api/subjects",
    tags=["Subjects"]
)

subjects_collection = db["subjects"]


class Subject(BaseModel):
    name: str
    code: str
    type: str
    teacher: str
    classes: str
    weeklyClasses: int
    status: str = "Active"


@router.get("/")
def get_subjects():
    subjects = list(
        subjects_collection.find({}, {"_id": 0})
    )
    return subjects


@router.post("/")
def create_subject(subject: Subject):
    subject_id = str(uuid4())

    data = subject.model_dump()
    data["id"] = subject_id

    subjects_collection.insert_one(data)

    saved_subject = subjects_collection.find_one(
        {"id": subject_id},
        {"_id": 0}
    )

    return saved_subject


@router.get("/{subject_id}")
def get_subject(subject_id: str):
    subject = subjects_collection.find_one(
        {"id": subject_id},
        {"_id": 0}
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return subject


@router.put("/{subject_id}")
def update_subject(
    subject_id: str,
    subject: Subject
):
    data = subject.model_dump()

    result = subjects_collection.update_one(
        {"id": subject_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return {
        "id": subject_id,
        **data
    }


@router.delete("/{subject_id}")
def delete_subject(subject_id: str):
    result = subjects_collection.delete_one(
        {"id": subject_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return {
        "message": "Subject deleted successfully"
    }