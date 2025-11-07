from sqlalchemy import Column, Date, DateTime, Integer, String, func

from .database import Base


class User(Base):
  __tablename__ = 'users'

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String(120), nullable=False)
  email = Column(String(120), nullable=False, unique=True, index=True)
  phone = Column(String(50), nullable=False)
  website = Column(String(120), nullable=True)
  gender = Column(String(20), nullable=False)
  gender_other = Column(String(120), nullable=True)
  birthdate = Column(Date, nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
