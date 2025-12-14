@echo off
echo ========================================
echo   Conecta Merenda - Inicializacao
echo ========================================
echo.

cd backend

echo [1/5] Verificando Python...
python --version
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Instale Python 3.10+ de python.org
    pause
    exit /b 1
)
echo.

echo [2/5] Criando ambiente virtual...
if not exist venv (
    python -m venv venv
    echo Ambiente virtual criado!
) else (
    echo Ambiente virtual ja existe.
)
echo.

echo [3/5] Ativando ambiente virtual...
call venv\Scripts\activate.bat
echo.

echo [4/5] Instalando dependencias...
pip install -r requirements.txt
echo.

echo [5/5] Iniciando servidor...
echo.
echo ========================================
echo   Servidor iniciando...
echo   Acesse: http://localhost:8000/docs
echo ========================================
echo.

python start.py

pause
