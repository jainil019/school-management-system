from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.database import db

router = APIRouter(
    prefix="/api/assignments",
    tags=["Assignments"]
)

assignments_collection = db["assignments"]


class Assignment(BaseModel):
    classId: str
    subjectId: str
    teacherId: str
    weeklyPeriods: int
    academicYear: str
    status: str = "Active"


@router.get("/")
def get_assignments():
    assignments = list(
        assignments_collection.find({}, {"_id": 0})
    )
    return assignments


@router.post("/")
def create_assignment(assignment: Assignment):
    assignment_id = str(uuid4())

    data = assignment.model_dump()
    data["id"] = assignment_id

    assignments_collection.insert_one(data)

    saved_assignment = assignments_collection.find_one(
        {"id": assignment_id},
        {"_id": 0}
    )

    return saved_assignment


@router.get("/{assignment_id}")
def get_assignment(assignment_id: str):
    assignment = assignments_collection.find_one(
        {"id": assignment_id},
        {"_id": 0}
    )

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    return assignment


@router.put("/{assignment_id}")
def update_assignment(
    assignment_id: str,
    assignment: Assignment
):
    data = assignment.model_dump()

    result = assignments_collection.update_one(
        {"id": assignment_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    return {
        "id": assignment_id,
        **data
    }


@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: str):
    result = assignments_collection.delete_one(
        {"id": assignment_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    return {
        "message": "Assignment deleted successfully"
    }