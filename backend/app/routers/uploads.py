import time
import uuid

import boto3
from botocore.client import Config
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import get_settings

router = APIRouter()


class PresignRequest(BaseModel):
    filename: str
    contentType: str


class PresignResponse(BaseModel):
    uploadUrl: str
    publicUrl: str
    key: str


def _s3_client() -> tuple:
    settings = get_settings()
    region = settings.effective_aws_region
    if not region:
        raise HTTPException(status_code=500, detail="AWS_REGION not configured")
    session = boto3.session.Session(
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key,
        region_name=region,
    )
    return session.client("s3", config=Config(signature_version="s3v4")), region


@router.post("/presign", response_model=PresignResponse)
def presign(req: PresignRequest) -> PresignResponse:
    settings = get_settings()
    bucket = settings.s3_bucket
    if not bucket:
        raise HTTPException(status_code=500, detail="S3_BUCKET not configured")
    client, region = _s3_client()
    # key: images/yyyy/mm/uuid-filename
    ts = time.gmtime()
    safe_name = req.filename.replace("/", "-")
    key = f"images/{ts.tm_year:04d}/{ts.tm_mon:02d}/{uuid.uuid4().hex}-{safe_name}"

    try:
        upload_url = client.generate_presigned_url(
            "put_object",
            Params={"Bucket": bucket, "Key": key, "ContentType": req.contentType},
            ExpiresIn=3600,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to presign: {e}") from e

    public_base = settings.s3_public_base
    if public_base:
        public_url = f"{public_base.rstrip('/')}/{key}"
    else:
        public_url = f"https://{bucket}.s3.{region}.amazonaws.com/{key}"

    return PresignResponse(uploadUrl=upload_url, publicUrl=public_url, key=key)


