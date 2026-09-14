from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.database import db

router = APIRouter(prefix="/api/classes", tags=["Classes"])

classes_collection = db["classes"]


class ClassData(BaseModel):
    className: str
    division: str
    classTeacher: str
    roomNo: str
    students: int
    academicYear: str
    status: str = "Active"


@router.get("/")
def get_classes():
    classes = list(
        classes_collection.find({}, {"_id": 0})
    )
    return classes


@router.post("/")
def create_class(class_data: ClassData):
    class_id = str(uuid4())

    data = class_data.model_dump()
    data["id"] = class_id

    classes_collection.insert_one(data)

    saved_class = classes_collection.find_one(
        {"id": class_id},
        {"_id": 0}
    )

    return saved_class


@router.get("/{class_id}")
def get_class(class_id: str):
    class_data = classes_collection.find_one(
        {"id": class_id},
        {"_id": 0}
    )

    if not class_data:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    return class_data


@router.put("/{class_id}")
def update_class(
    class_id: str,
    class_data: ClassData
):
    data = class_data.model_dump()

    result = classes_collection.update_one(
        {"id": class_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    return {
        "id": class_id,
        **data
    }


@router.delete("/{class_id}")
def delete_class(class_id: str):
    result = classes_collection.delete_one(
        {"id": class_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    return {
        "message": "Class deleted successfully"
    }