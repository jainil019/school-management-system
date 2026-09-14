from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.database import db

router = APIRouter(
    prefix="/api/notices",
    tags=["Notices"]
)

notices_collection = db["notices"]


class Notice(BaseModel):
    title: str
    description: str
    audience: str
    date: str


@router.get("/")
def get_notices():
    notices = list(
        notices_collection.find({}, {"_id": 0})
    )
    return notices


@router.post("/")
def create_notice(notice: Notice):
    notice_id = str(uuid4())

    data = notice.model_dump()
    data["id"] = notice_id

    notices_collection.insert_one(data)

    saved_notice = notices_collection.find_one(
        {"id": notice_id},
        {"_id": 0}
    )

    return saved_notice


@router.get("/{notice_id}")
def get_notice(notice_id: str):
    notice = notices_collection.find_one(
        {"id": notice_id},
        {"_id": 0}
    )

    if not notice:
        raise HTTPException(
            status_code=404,
            detail="Notice not found"
        )

    return notice


@router.put("/{notice_id}")
def update_notice(
    notice_id: str,
    notice: Notice
):
    data = notice.model_dump()

    result = notices_collection.update_one(
        {"id": notice_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Notice not found"
        )

    return {
        "id": notice_id,
        **data
    }


@router.delete("/{notice_id}")
def delete_notice(notice_id: str):
    result = notices_collection.delete_one(
        {"id": notice_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Notice not found"
        )

    return {
        "message": "Notice deleted successfully"
    }