import os


class Settings:
  """Centralised application settings loaded from environment variables."""

  def __init__(self) -> None:
    self.project_name = os.getenv('PROJECT_NAME', 'Taller Web - API de Usuarios')
    self.database_url = os.getenv(
      'DATABASE_URL',
      'postgresql+psycopg2://usuarios_app:supersecret@localhost:5432/usuarios_db',
    )
    self._cors_origins_raw = os.getenv('CORS_ORIGINS', 'http://localhost:5173')

  @property
  def cors_origins(self) -> list[str]:
    return [origin.strip() for origin in self._cors_origins_raw.split(',') if origin.strip()]


settings = Settings()

