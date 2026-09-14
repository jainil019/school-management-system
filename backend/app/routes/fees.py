from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.database import db

router = APIRouter(
    prefix="/api/fees",
    tags=["Fees"]
)

fees_collection = db["fees"]


class Fee(BaseModel):
    studentId: str
    feeType: str
    amount: float
    paidAmount: float
    dueDate: str
    academicYear: str
    paymentDate: str
    paymentMethod: str
    notes: str


@router.get("/")
def get_fees():
    fees = list(
        fees_collection.find({}, {"_id": 0})
    )
    return fees


@router.post("/")
def create_fee(fee: Fee):
    fee_id = str(uuid4())

    data = fee.model_dump()
    data["id"] = fee_id

    fees_collection.insert_one(data)

    saved_fee = fees_collection.find_one(
        {"id": fee_id},
        {"_id": 0}
    )

    return saved_fee


@router.get("/{fee_id}")
def get_fee(fee_id: str):
    fee = fees_collection.find_one(
        {"id": fee_id},
        {"_id": 0}
    )

    if not fee:
        raise HTTPException(
            status_code=404,
            detail="Fee record not found"
        )

    return fee


@router.put("/{fee_id}")
def update_fee(
    fee_id: str,
    fee: Fee
):
    data = fee.model_dump()

    result = fees_collection.update_one(
        {"id": fee_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Fee record not found"
        )

    return {
        "id": fee_id,
        **data
    }


@router.delete("/{fee_id}")
def delete_fee(fee_id: str):
    result = fees_collection.delete_one(
        {"id": fee_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Fee record not found"
        )

    return {
        "message": "Fee deleted successfully"
    }