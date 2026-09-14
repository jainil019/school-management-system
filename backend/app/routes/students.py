from fastapi import APIRouter, HTTPException
from app.database import students_collection
from pydantic import BaseModel
from uuid import uuid4


router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)


class Student(BaseModel):
    name: str
    email: str
    phone: str
    className: str
    division: str
    rollNo: int
    gender: str
    status: str = "Active"


# GET ALL STUDENTS
@router.get("/")
def get_students():
    students = list(
        students_collection.find(
            {},
            {"_id": 0}
        )
    )

    return students


# CREATE STUDENT
@router.post("/")
def create_student(student: Student):

    student_id = str(uuid4())

    data = student.model_dump()
    data["id"] = student_id

    students_collection.insert_one(data)

    saved_student = students_collection.find_one(
        {"id": student_id},
        {"_id": 0}
    )

    return saved_student


# GET ONE STUDENT
@router.get("/{student_id}")
def get_student(student_id: str):

    student = students_collection.find_one(
        {"id": student_id},
        {"_id": 0}
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return student


# UPDATE STUDENT
@router.put("/{student_id}")
def update_student(
    student_id: str,
    student: Student
):

    data = student.model_dump()

    result = students_collection.update_one(
        {"id": student_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "id": student_id,
        **data
    }


# DELETE STUDENT
@router.delete("/{student_id}")
def delete_student(student_id: str):

    result = students_collection.delete_one(
        {"id": student_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student deleted successfully"
    }       