from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import client
from app.routes.students import router as students_router
from app.routes.teachers import router as teachers_router
from app.routes.classes import router as classes_router
from app.routes.subjects import router as subjects_router
from app.routes.assignments import router as assignments_router
from app.routes.attendance import router as attendance_router
from app.routes.attendance_reports import router as attendance_reports_router
from app.routes.exams import router as exams_router
from app.routes.marks import router as marks_router
from app.routes.results import router as results_router
from app.routes.fees import router as fees_router
from app.routes.homework import router as homework_router
from app.routes.timetable import router as timetable_router
from app.routes.notices import router as notices_router

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

app = FastAPI(title="School Management API")


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://school-management-system-eta-sandy.vercel.app",
],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "School Management API is running"}


@app.get("/api/test")
def test():
    try:
        client.admin.command("ping")
        return {"message": "FastAPI and MongoDB are connected!"}
    except Exception as error:
        return {
            "message": "MongoDB connection failed",
            "error": str(error),
        }


app.include_router(students_router)
app.include_router(teachers_router)
app.include_router(classes_router)  
app.include_router(subjects_router)
app.include_router(assignments_router)
app.include_router(attendance_router)
app.include_router(attendance_reports_router)
app.include_router(exams_router)
app.include_router(marks_router)
app.include_router(results_router)
app.include_router(fees_router)
app.include_router(homework_router)
app.include_router(timetable_router)
app.include_router(notices_router)