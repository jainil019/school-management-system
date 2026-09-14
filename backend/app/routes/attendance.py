from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from app.database import db

router = APIRouter(
    prefix="/api/attendance",
    tags=["Attendance"]
)

attendance_collection = db["attendance"]


class Attendance(BaseModel):
    date: str
    classId: str
    subjectId: str
    studentId: str
    status: str


@router.get("/")
def get_attendance():
    attendance = list(
        attendance_collection.find({}, {"_id": 0})
    )

    return attendance


@router.post("/")
def create_attendance(attendance: Attendance):
    attendance_id = str(uuid4())

    data = attendance.model_dump()
    data["id"] = attendance_id

    attendance_collection.insert_one(data)

    saved_attendance = attendance_collection.find_one(
        {"id": attendance_id},
        {"_id": 0}
    )

    return saved_attendance


@router.get("/{attendance_id}")
def get_attendance_by_id(attendance_id: str):
    attendance = attendance_collection.find_one(
        {"id": attendance_id},
        {"_id": 0}
    )

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance record not found"
        )

    return attendance


@router.put("/{attendance_id}")
def update_attendance(
    attendance_id: str,
    attendance: Attendance
):
    data = attendance.model_dump()

    result = attendance_collection.update_one(
        {"id": attendance_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Attendance record not found"
        )

    return {
        "id": attendance_id,
        **data
    }


@router.delete("/{attendance_id}")
def delete_attendance(attendance_id: str):
    result = attendance_collection.delete_one(
        {"id": attendance_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Attendance record not found"
        )

    return {
        "message": "Attendance deleted successfully"
    }