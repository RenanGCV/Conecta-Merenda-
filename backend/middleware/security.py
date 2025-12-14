"""
Middleware de segurança customizado.
Adiciona headers de segurança às respostas.
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adiciona headers de segurança HTTP às respostas.
    Proteção contra ataques comuns (XSS, Clickjacking, etc).
    """
    
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        
        # Proteção contra XSS (Cross-Site Scripting)
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # Proteção contra Clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        
        # XSS Protection (navegadores antigos)
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Content Security Policy (CSP) - Política restritiva
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self';"
        )
        
        # Referrer Policy - Não vazar informações
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Permissions Policy - Desabilitar features desnecessárias
        response.headers["Permissions-Policy"] = (
            "geolocation=(self), "
            "microphone=(), "
            "camera=(), "
            "payment=()"
        )
        
        # HSTS - Força HTTPS (apenas em produção)
        # response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response
