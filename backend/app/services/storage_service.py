import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile
from storage3.exceptions import StorageApiError

from app.config.settings import settings
from app.database.supabase_client import get_supabase_client

BUCKET_NAME = "issue-images"
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}
_PLACEHOLDER_SERVICE_KEYS = {
    "",
    "your_actual_service_role_key",
    "your-service-role-key",
}


def _has_valid_storage_key() -> bool:
    service_role_key = settings.supabase_service_role_key
    if not service_role_key or service_role_key.strip() in _PLACEHOLDER_SERVICE_KEYS:
        return False
    return service_role_key.startswith(("eyJ", "sb_secret_"))


async def upload_issue_image(file: UploadFile) -> dict[str, str]:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")

    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File size exceeds the 10 MB limit.")

    extension = Path(file.filename or "").suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid image file type. Allowed: jpg, jpeg, png, gif, webp, bmp.",
        )

    if not _has_valid_storage_key():
        raise HTTPException(
            status_code=503,
            detail=(
                "Storage uploads require a valid SUPABASE_SERVICE_ROLE_KEY "
                "(sb_secret_... or legacy service_role JWT) in backend/.env."
            ),
        )

    file_id = uuid.uuid4()
    storage_path = f"issues/{file_id}{extension}"

    supabase = get_supabase_client()

    try:
        supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": file.content_type},
        )
    except StorageApiError as exc:
        error_message = str(exc).lower()
        if "row-level security" in error_message or getattr(exc, "status_code", None) == 403:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Storage upload denied by Supabase RLS. "
                    "Set SUPABASE_SERVICE_ROLE_KEY to your sb_secret_ key in backend/.env."
                ),
            ) from exc
        raise HTTPException(
            status_code=500,
            detail="Failed to upload image to storage.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to upload image to storage.",
        ) from exc

    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)

    return {"image_url": public_url}
