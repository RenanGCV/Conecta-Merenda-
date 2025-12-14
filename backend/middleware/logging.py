"""
Middleware de logging de requisições.
Registra todas as requisições HTTP para auditoria e debugging.
"""
import logging
import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware que registra informações sobre cada requisição.
    Útil para auditoria, monitoramento e debugging.
    """
    
    async def dispatch(self, request: Request, call_next):
        # Capturar início da requisição
        start_time = time.time()
        
        # Informações da requisição
        client_host = request.client.host if request.client else "unknown"
        method = request.method
        url = str(request.url)
        
        # Processar requisição
        try:
            response: Response = await call_next(request)
            
            # Calcular tempo de processamento
            process_time = time.time() - start_time
            
            # Log estruturado
            logger.info(
                f"{method} {url} - "
                f"Status: {response.status_code} - "
                f"Client: {client_host} - "
                f"Time: {process_time:.3f}s"
            )
            
            # Adicionar header com tempo de processamento
            response.headers["X-Process-Time"] = str(round(process_time, 3))
            
            return response
            
        except Exception as e:
            # Log de erros
            process_time = time.time() - start_time
            logger.error(
                f"{method} {url} - "
                f"ERROR: {str(e)} - "
                f"Client: {client_host} - "
                f"Time: {process_time:.3f}s",
                exc_info=True
            )
            raise
