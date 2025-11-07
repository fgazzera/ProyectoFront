import re
from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

ALLOWED_EMAIL_DOMAINS = {'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com'}
PHONE_REGEX = re.compile(r'^[1-9]\d{9}$')


def _normalize_name(value: str) -> str:
  cleaned = value.strip()
  if not cleaned:
    raise ValueError('El nombre es obligatorio')
  lowered = cleaned.lower()
  return lowered[0].upper() + lowered[1:]


def _normalize_email(value: EmailStr) -> str:
  email = str(value).strip().lower()
  local_part, _, domain = email.partition('@')
  if not local_part or not local_part[0].isalnum():
    raise ValueError('El email debe comenzar con una letra o número')
  if domain not in ALLOWED_EMAIL_DOMAINS:
    allowed = ', '.join(sorted(ALLOWED_EMAIL_DOMAINS))
    raise ValueError(f'Dominio no permitido. Usa uno de: {allowed}')
  return email


def _validate_phone(value: str) -> str:
  digits = value.strip()
  if not PHONE_REGEX.match(digits):
    raise ValueError('El teléfono debe tener 10 dígitos y no puede iniciar con 0')
  return digits


class Gender(str, Enum):
  femenino = 'femenino'
  masculino = 'masculino'
  otro = 'otro'


class UserBase(BaseModel):
  name: str = Field(..., min_length=1, max_length=120)
  email: EmailStr
  phone: str = Field(..., min_length=10, max_length=10)
  website: str | None = Field(default=None, max_length=120)
  gender: Gender
  gender_other: str | None = Field(default=None, max_length=120)
  birthdate: date

  @field_validator('name')
  @classmethod
  def normalize_name(cls, value: str) -> str:
    return _normalize_name(value)

  @field_validator('email')
  @classmethod
  def validate_email(cls, value: EmailStr) -> str:
    return _normalize_email(value)

  @field_validator('phone')
  @classmethod
  def validate_phone(cls, value: str) -> str:
    return _validate_phone(value)

  @field_validator('birthdate')
  @classmethod
  def validate_birthdate(cls, value: date) -> date:
    if value >= date.today():
      raise ValueError('La fecha de nacimiento debe ser anterior a hoy')
    return value

  @model_validator(mode='after')
  def validate_gender_other(self):
    if self.gender == Gender.otro:
      if not self.gender_other or not self.gender_other.strip():
        raise ValueError('Debes especificar el género personalizado')
      self.gender_other = self.gender_other.strip()
    else:
      self.gender_other = None
    return self


class UserCreate(UserBase):
  pass


class UserUpdate(BaseModel):
  name: str | None = Field(default=None, min_length=1, max_length=120)
  email: EmailStr | None = None
  phone: str | None = Field(default=None, min_length=10, max_length=10)
  website: str | None = Field(default=None, max_length=120)
  gender: Gender | None = None
  gender_other: str | None = Field(default=None, max_length=120)
  birthdate: date | None = None

  @field_validator('name')
  @classmethod
  def normalize_name(cls, value: str | None) -> str | None:
    if value is None:
      return value
    return _normalize_name(value)

  @field_validator('email')
  @classmethod
  def validate_email(cls, value: EmailStr | None) -> str | None:
    if value is None:
      return value
    return _normalize_email(value)

  @field_validator('phone')
  @classmethod
  def validate_phone(cls, value: str | None) -> str | None:
    if value is None:
      return value
    return _validate_phone(value)

  @field_validator('birthdate')
  @classmethod
  def validate_birthdate(cls, value: date | None) -> date | None:
    if value is None:
      return value
    if value >= date.today():
      raise ValueError('La fecha de nacimiento debe ser anterior a hoy')
    return value

  @model_validator(mode='after')
  def validate_gender_other(self):
    if self.gender == Gender.otro:
      if not self.gender_other or not self.gender_other.strip():
        raise ValueError('Debes especificar el género personalizado')
      self.gender_other = self.gender_other.strip()
    elif self.gender is not None:
      self.gender_other = None
    return self


class UserRead(UserBase):
  id: int
  created_at: datetime

  model_config = ConfigDict(from_attributes=True)
