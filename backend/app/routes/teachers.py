from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.database import db

router = APIRouter(prefix="/api/teachers", tags=["Teachers"])

teachers_collection = db["teachers"]


class Teacher(BaseModel):
    name: str
    email: str
    phone: str
    subject: str
    qualification: str
    experience: int
    assignedClass: str
    joiningDate: str
    status: str = "Active"


@router.get("/")
def get_teachers():
    teachers = list(
        teachers_collection.find({}, {"_id": 0})
    )

    return teachers


@router.post("/")
def create_teacher(teacher: Teacher):
    teacher_id = str(uuid4())

    data = teacher.model_dump()
    data["id"] = teacher_id

    teachers_collection.insert_one(data)

    saved_teacher = teachers_collection.find_one(
        {"id": teacher_id},
        {"_id": 0}
    )

    return saved_teacher


@router.get("/{teacher_id}")
def get_teacher(teacher_id: str):
    teacher = teachers_collection.find_one(
        {"id": teacher_id},
        {"_id": 0}
    )

    if not teacher:
        raise HTTPException(
            status_code=404,
            detail="Teacher not found"
        )

    return teacher


@router.put("/{teacher_id}")
def update_teacher(
    teacher_id: str,
    teacher: Teacher
):
    data = teacher.model_dump()

    result = teachers_collection.update_one(
        {"id": teacher_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Teacher not found"
        )

    return {
        "id": teacher_id,
        **data
    }


@router.delete("/{teacher_id}")
def delete_teacher(teacher_id: str):
    result = teachers_collection.delete_one(
        {"id": teacher_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Teacher not found"
        )

    return {
        "message": "Teacher deleted successfully"
    }