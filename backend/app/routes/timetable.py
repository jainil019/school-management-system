from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.database import db

router = APIRouter(
    prefix="/api/timetable",
    tags=["Timetable"]
)

timetable_collection = db["timetable"]


class Timetable(BaseModel):
    className: str
    subject: str
    teacher: str
    day: str
    startTime: str
    endTime: str


@router.get("/")
def get_timetable():
    timetable = list(
        timetable_collection.find({}, {"_id": 0})
    )
    return timetable


@router.post("/")
def create_timetable(item: Timetable):
    timetable_id = str(uuid4())

    data = item.model_dump()
    data["id"] = timetable_id

    timetable_collection.insert_one(data)

    saved_item = timetable_collection.find_one(
        {"id": timetable_id},
        {"_id": 0}
    )

    return saved_item


@router.get("/{timetable_id}")
def get_timetable_item(timetable_id: str):
    item = timetable_collection.find_one(
        {"id": timetable_id},
        {"_id": 0}
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Timetable record not found"
        )

    return item


@router.put("/{timetable_id}")
def update_timetable(
    timetable_id: str,
    item: Timetable
):
    data = item.model_dump()

    result = timetable_collection.update_one(
        {"id": timetable_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Timetable record not found"
        )

    return {
        "id": timetable_id,
        **data
    }


@router.delete("/{timetable_id}")
def delete_timetable(timetable_id: str):
    result = timetable_collection.delete_one(
        {"id": timetable_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Timetable record not found"
        )

    return {
        "message": "Timetable deleted successfully"
    }