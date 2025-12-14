"""
Router de autenticação.
Gerencia login e tokens JWT (simulado para MVP).
"""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Dict, Optional
import json

from config import settings
from schemas import LoginRequest, TokenResponse

router = APIRouter()
security = HTTPBearer()


# Mock de usuários (em produção, viria do banco de dados)
MOCK_USERS = {
    "escola@email.com": {
        "senha": "escola123",
        "perfil": "escola",
        "user_id": "ESC001",
        "nome": "EMEF Prof. João Carlos de Oliveira"
    },
    "diretora@escola.rj.gov.br": {
        "senha": "123456",
        "perfil": "escola",
        "user_id": "ESC002",
        "nome": "E.M. Professora Maria da Glória"
    },
    "agricultor@email.com": {
        "senha": "agri123",
        "perfil": "agricultor",
        "user_id": "PROD001",
        "nome": "João Silva"
    },
    "secretaria@email.com": {
        "senha": "sec123",
        "perfil": "secretaria",
        "user_id": "SEC001",
        "nome": "Secretaria Municipal de Educação"
    }
}


def criar_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Cria token JWT.
    
    Args:
        data: Dados a serem codificados no token
        expires_delta: Tempo de expiração
    
    Returns:
        Token JWT assinado
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm
    )
    
    return encoded_jwt


def verificar_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """
    Verifica e decodifica token JWT.
    
    Args:
        credentials: Credenciais HTTP com token Bearer
    
    Returns:
        Payload decodificado do token
    
    Raises:
        HTTPException: Se token inválido ou expirado
    """
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: usuário não encontrado"
            )
        
        return payload
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido ou expirado: {str(e)}"
        )


@router.post("/login", response_model=TokenResponse, summary="Login de usuário")
async def login(credentials: LoginRequest):
    """
    Realiza login e retorna token de acesso.
    
    **Usuários de teste:**
    - Email: `escola@email.com` / Senha: `escola123`
    - Email: `agricultor@email.com` / Senha: `agri123`
    - Email: `secretaria@email.com` / Senha: `sec123`
    """
    # Buscar usuário no mock
    user = MOCK_USERS.get(credentials.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    # Verificar senha (em produção, usar hash bcrypt)
    if user["senha"] != credentials.senha:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    # Criar token
    access_token = criar_access_token(
        data={
            "sub": user["user_id"],
            "email": credentials.email,
            "perfil": user["perfil"]
        }
    )
    
    return TokenResponse(
        access_token=access_token,
        perfil=user["perfil"],
        user_info={
            "id": user["user_id"],
            "nome": user["nome"],
            "email": credentials.email
        }
    )


@router.get("/me", summary="Obter dados do usuário logado")
async def obter_usuario_atual(token_data: Dict = Depends(verificar_token)):
    """
    Retorna informações do usuário autenticado.
    Requer token JWT válido no header Authorization.
    """
    return {
        "user_id": token_data.get("sub"),
        "email": token_data.get("email"),
        "perfil": token_data.get("perfil"),
        "token_expires": token_data.get("exp")
    }


@router.post("/logout", summary="Logout (invalidar token)")
async def logout(token_data: Dict = Depends(verificar_token)):
    """
    Logout do usuário.
    
    Nota: Em JWT, o logout é geralmente feito no cliente (removendo o token).
    Este endpoint serve apenas como confirmação.
    """
    return {
        "message": "Logout realizado com sucesso",
        "user_id": token_data.get("sub")
    }
