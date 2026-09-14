from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.database import db

router = APIRouter(
    prefix="/api/homework",
    tags=["Homework"]
)

homework_collection = db["homework"]


class Homework(BaseModel):
    title: str
    description: str
    className: str
    subject: str
    dueDate: str


@router.get("/")
def get_homework():
    homework = list(
        homework_collection.find({}, {"_id": 0})
    )
    return homework


@router.post("/")
def create_homework(homework: Homework):
    homework_id = str(uuid4())

    data = homework.model_dump()
    data["id"] = homework_id

    homework_collection.insert_one(data)

    saved_homework = homework_collection.find_one(
        {"id": homework_id},
        {"_id": 0}
    )

    return saved_homework


@router.get("/{homework_id}")
def get_homework_by_id(homework_id: str):
    homework = homework_collection.find_one(
        {"id": homework_id},
        {"_id": 0}
    )

    if not homework:
        raise HTTPException(
            status_code=404,
            detail="Homework not found"
        )

    return homework


@router.put("/{homework_id}")
def update_homework(
    homework_id: str,
    homework: Homework
):
    data = homework.model_dump()

    result = homework_collection.update_one(
        {"id": homework_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Homework not found"
        )

    return {
        "id": homework_id,
        **data
    }


@router.delete("/{homework_id}")
def delete_homework(homework_id: str):
    result = homework_collection.delete_one(
        {"id": homework_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Homework not found"
        )

    return {
        "message": "Homework deleted successfully"
    }