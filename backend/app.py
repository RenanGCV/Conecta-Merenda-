"""
🍎 Conecta Merenda - API Principal
Sistema de gestão inteligente de compras PNAE (Programa Nacional de Alimentação Escolar)

Este é o ponto de entrada da aplicação FastAPI.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn
import logging
from datetime import datetime

from config import settings
from routers import auth, agricultores, escolas, secretaria, dashboard, professores, fiscalizacao
from middleware.security import SecurityHeadersMiddleware
from middleware.logging import LoggingMiddleware

# Configurar logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Inicializar rate limiter
limiter = Limiter(key_func=get_remote_address)

# Criar aplicação FastAPI
app = FastAPI(
    title="Conecta Merenda API",
    description="API para gestão inteligente de compras do PNAE com suporte a IA",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,  # Desabilitar docs em produção
    redoc_url="/redoc" if settings.debug else None,
)

# Adicionar state para o limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ========== MIDDLEWARES DE SEGURANÇA ==========

# 1. CORS - Controle de acesso entre origens
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Page-Count"],
)

# 2. Trusted Host - Proteção contra host header attacks
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"] if settings.debug else ["conectamerenda.com.br", "*.conectamerenda.com.br"]
)

# 3. Headers de segurança customizados
app.add_middleware(SecurityHeadersMiddleware)

# 4. Logging de requisições
app.add_middleware(LoggingMiddleware)


# ========== ROUTERS ==========

# Incluir todos os routers da aplicação
app.include_router(auth.router, prefix="/api/v1/auth", tags=["🔐 Autenticação"])
app.include_router(agricultores.router, prefix="/api/v1/agricultores", tags=["🚜 Agricultores"])
app.include_router(escolas.router, prefix="/api/v1/escolas", tags=["🏫 Escolas"])
app.include_router(professores.router, tags=["👨‍🏫 Professores"])
app.include_router(secretaria.router, prefix="/api/v1/secretaria", tags=["🏛️ Secretaria"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["📊 Dashboard"])
app.include_router(fiscalizacao.router)  # Fiscalização já tem prefix no router


# ========== HEALTH CHECKS ==========

@app.get("/", tags=["Sistema"])
async def root():
    """
    Endpoint raiz - Informações básicas da API.
    """
    return {
        "name": "Conecta Merenda API",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "docs": "/docs" if settings.debug else "Documentação desabilitada em produção"
    }


@app.get("/health", tags=["Sistema"])
@limiter.limit("10/minute")
async def health_check(request: Request):
    """
    Health check para monitoramento.
    Verificação leve de disponibilidade da API.
    """
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": "development" if settings.debug else "production"
    }


@app.get("/api/v1/status", tags=["Sistema"])
@limiter.limit("30/minute")
async def detailed_status(request: Request):
    """
    Status detalhado da aplicação.
    Útil para debugging e monitoramento avançado.
    """
    return {
        "api": "online",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "features": {
            "ai_cardapio": True,
            "ai_fiscalizacao": True,
            "geolocation": True,
            "qrcode": True,
            "pdf_reports": True,
            "climate_alerts": True
        }
    }


# ========== EXCEPTION HANDLERS ==========

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Handler global para exceções não tratadas.
    Evita expor detalhes internos em produção.
    """
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    if settings.debug:
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Erro interno do servidor",
                "error": str(exc),
                "type": type(exc).__name__
            }
        )
    
    return JSONResponse(
        status_code=500,
        content={"detail": "Erro interno do servidor. Por favor, tente novamente mais tarde."}
    )


# ========== STARTUP E SHUTDOWN ==========

@app.on_event("startup")
async def startup_event():
    """
    Executado quando a aplicação inicia.
    """
    logger.info("🚀 Conecta Merenda API iniciando...")
    logger.info(f"📍 Ambiente: {'Desenvolvimento' if settings.debug else 'Produção'}")
    logger.info(f"🌐 CORS habilitado para: {settings.cors_origins}")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Executado quando a aplicação é encerrada.
    """
    logger.info("🛑 Conecta Merenda API encerrando...")


# ========== MAIN ==========

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )
