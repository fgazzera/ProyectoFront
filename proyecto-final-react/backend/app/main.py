from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import users

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.project_name)

app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.cors_origins or ['*'],
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*'],
)

app.include_router(users.router)


@app.get('/api/health', tags=['health'])
def health_check():
  return {'status': 'ok'}

