# Sorumlu: Alper

from pydantic import BaseModel, Field
from datetime import datetime


class ReadingCreate(BaseModel):
    bin_id: int = Field(..., ge=1)
    distance_cm: float = Field(..., ge=0)
    fill_percent: float = Field(..., ge=0, le=100)
    gas_raw: float = Field(..., ge=0)
    status: str
    is_full: bool
    odor_alert: bool


class ReadingResponse(BaseModel):
    id: int
    bin_id: int
    distance_cm: float
    fill_percent: float
    gas_raw: float
    status: str
    is_full: bool
    odor_alert: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: str
    first_name: str | None = None
    last_name: str | None = None


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class AlertResponse(BaseModel):
    id: int
    bin_id: int
    type: str
    message: str
    acknowledged: bool
    created_at: datetime

    class Config:
        from_attributes = True
