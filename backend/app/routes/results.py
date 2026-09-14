from fastapi import APIRouter
from app.database import db

router = APIRouter(
    prefix="/api/results",
    tags=["Results"]
)

marks_collection = db["marks"]
exams_collection = db["exams"]


@router.get("/")
def get_results():
    marks = list(
        marks_collection.find({}, {"_id": 0})
    )

    results = []

    for mark in marks:
        exam = exams_collection.find_one(
            {"id": mark["examId"]},
            {"_id": 0}
        )

        results.append({
            **mark,
            "exam": exam
        })

    return results


@router.get("/student/{student_id}")
def get_student_results(student_id: str):
    marks = list(
        marks_collection.find(
            {"studentId": student_id},
            {"_id": 0}
        )
    )

    results = []

    for mark in marks:
        exam = exams_collection.find_one(
            {"id": mark["examId"]},
            {"_id": 0}
        )

        results.append({
            **mark,
            "exam": exam
        })

    return results