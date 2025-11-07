from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
  name: str = Field(..., min_length=1, max_length=120)
  email: EmailStr
  phone: str = Field(..., min_length=3, max_length=50)
  website: str | None = Field(default=None, max_length=120)


class UserCreate(UserBase):
  pass


class UserUpdate(BaseModel):
  name: str | None = Field(default=None, min_length=1, max_length=120)
  email: EmailStr | None = None
  phone: str | None = Field(default=None, min_length=3, max_length=50)
  website: str | None = Field(default=None, max_length=120)


class UserRead(UserBase):
  id: int
  created_at: datetime

  model_config = ConfigDict(from_attributes=True)

