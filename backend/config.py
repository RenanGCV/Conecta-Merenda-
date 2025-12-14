"""
Configurações centralizadas da aplicação.
Carrega variáveis de ambiente de forma segura usando Pydantic Settings.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Classe de configuração que valida e carrega variáveis de ambiente.
    Usando Pydantic Settings para garantir type safety e validação.
    """
    
    # API Keys sensíveis (com defaults para demo/hackathon)
    openai_api_key: str = ""
    secret_key: str = "conecta-merenda-hackathon-2025-secret-key-demo"
    
    # Configurações do servidor
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    # Segurança JWT
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS - origens permitidas (inclui Docker e localhost)
    allowed_origins: str = "http://localhost:3000,http://localhost:8501,http://127.0.0.1:3000,http://frontend:3000,*"
    
    # Rate limiting
    rate_limit_per_minute: int = 60
    
    # Configurações PNAE
    pnae_meta_percentage: int = 30
    
    @property
    def cors_origins(self) -> List[str]:
        """Retorna lista de origens CORS permitidas."""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Instância global de configurações
settings = Settings()
