from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.database import db

router = APIRouter(
    prefix="/api/marks",
    tags=["Marks"]
)

marks_collection = db["marks"]


class Mark(BaseModel):
    examId: str
    studentId: str
    marks: float
    totalMarks: float
    grade: str
    result: str


@router.get("/")
def get_marks():
    marks = list(
        marks_collection.find({}, {"_id": 0})
    )

    return marks


@router.post("/")
def create_mark(mark: Mark):
    mark_id = str(uuid4())

    data = mark.model_dump()
    data["id"] = mark_id

    marks_collection.insert_one(data)

    saved_mark = marks_collection.find_one(
        {"id": mark_id},
        {"_id": 0}
    )

    return saved_mark


@router.get("/{mark_id}")
def get_mark(mark_id: str):
    mark = marks_collection.find_one(
        {"id": mark_id},
        {"_id": 0}
    )

    if not mark:
        raise HTTPException(
            status_code=404,
            detail="Mark record not found"
        )

    return mark


@router.put("/{mark_id}")
def update_mark(
    mark_id: str,
    mark: Mark
):
    data = mark.model_dump()

    result = marks_collection.update_one(
        {"id": mark_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Mark record not found"
        )

    return {
        "id": mark_id,
        **data
    }


@router.delete("/{mark_id}")
def delete_mark(mark_id: str):
    result = marks_collection.delete_one(
        {"id": mark_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Mark record not found"
        )

    return {
        "message": "Mark deleted successfully"
    }