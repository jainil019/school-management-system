from fastapi import APIRouter
from app.database import db

router = APIRouter(
    prefix="/api/attendance-reports",
    tags=["Attendance Reports"]
)

attendance_collection = db["attendance"]


@router.get("/")
def get_attendance_report():
    records = list(
        attendance_collection.find({}, {"_id": 0})
    )

    return records