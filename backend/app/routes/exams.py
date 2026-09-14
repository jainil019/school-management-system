from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from app.database import db

router = APIRouter(
    prefix="/api/exams",
    tags=["Exams"]
)

exams_collection = db["exams"]


class Exam(BaseModel):
    name: str
    classId: str
    subjectId: str
    examDate: str
    totalMarks: int
    passingMarks: int
    academicYear: str
    status: str = "Scheduled"


@router.get("/")
def get_exams():
    exams = list(
        exams_collection.find({}, {"_id": 0})
    )

    return exams


@router.post("/")
def create_exam(exam: Exam):
    exam_id = str(uuid4())

    data = exam.model_dump()
    data["id"] = exam_id

    exams_collection.insert_one(data)

    saved_exam = exams_collection.find_one(
        {"id": exam_id},
        {"_id": 0}
    )

    return saved_exam


@router.get("/{exam_id}")
def get_exam(exam_id: str):
    exam = exams_collection.find_one(
        {"id": exam_id},
        {"_id": 0}
    )

    if not exam:
        raise HTTPException(
            status_code=404,
            detail="Exam not found"
        )

    return exam


@router.put("/{exam_id}")
def update_exam(
    exam_id: str,
    exam: Exam
):
    data = exam.model_dump()

    result = exams_collection.update_one(
        {"id": exam_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Exam not found"
        )

    return {
        "id": exam_id,
        **data
    }


@router.delete("/{exam_id}")
def delete_exam(exam_id: str):
    result = exams_collection.delete_one(
        {"id": exam_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Exam not found"
        )

    return {
        "message": "Exam deleted successfully"
    }