from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix='/api/users', tags=['users'])


@router.get('/', response_model=list[schemas.UserRead])
def list_users(db: Session = Depends(get_db)):
  return db.query(models.User).order_by(models.User.id.asc()).all()


@router.get('/{user_id}', response_model=schemas.UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)):
  user = db.query(models.User).filter(models.User.id == user_id).first()
  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Usuario no encontrado')
  return user


@router.post('/', response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
  new_user = models.User(**payload.model_dump())
  db.add(new_user)
  try:
    db.commit()
  except IntegrityError as exc:
    db.rollback()
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='El email ya está registrado') from exc
  db.refresh(new_user)
  return new_user


@router.put('/{user_id}', response_model=schemas.UserRead)
def update_user(user_id: int, payload: schemas.UserUpdate, db: Session = Depends(get_db)):
  user = db.query(models.User).filter(models.User.id == user_id).first()
  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Usuario no encontrado')

  data = payload.model_dump(exclude_unset=True)
  for field, value in data.items():
    setattr(user, field, value)

  try:
    db.commit()
  except IntegrityError as exc:
    db.rollback()
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='El email ya está registrado') from exc

  db.refresh(user)
  return user


@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
  user = db.query(models.User).filter(models.User.id == user_id).first()
  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Usuario no encontrado')

  db.delete(user)
  db.commit()
  return None
