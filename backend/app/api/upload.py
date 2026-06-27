from fastapi import APIRouter, File, UploadFile

from app.schemas.upload_schema import ImageUploadResponse
from app.services.storage_service import upload_issue_image

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


@router.post("/image", response_model=ImageUploadResponse)
async def upload_image_route(file: UploadFile = File(...)):
    return await upload_issue_image(file)
