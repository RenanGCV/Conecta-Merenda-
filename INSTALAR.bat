@echo off
chcp 65001 > nul
echo ========================================
echo 🍎 CONECTA MERENDA - INSTALAÇÃO AUTOMÁTICA
echo ========================================
echo.

echo [1/5] Verificando Python...
py --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo.
    echo 📥 Baixe Python 3.10 ou superior em: https://www.python.org/downloads/
    echo    ⚠️  Marque a opção "Add Python to PATH" na instalação!
    echo.
    pause
    exit /b 1
)
py --version
echo ✅ Python encontrado!
echo.

echo [2/5] Criando ambiente virtual...
py -3.10 -m venv venv 2>nul
if errorlevel 1 (
    py -m venv venv
)
echo ✅ Ambiente virtual criado!
echo.

echo [3/5] Ativando ambiente virtual...
call venv\Scripts\activate.bat
echo ✅ Ambiente ativado!
echo.

echo [4/5] Instalando dependências (pode demorar 2-3 minutos)...
python -m pip install --upgrade pip --quiet
pip install -r backend\requirements.txt --quiet
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências
    echo Tentando novamente sem cache...
    pip install -r backend\requirements.txt --no-cache-dir
)
echo ✅ Dependências instaladas!
echo.

echo [5/5] Verificando configuração...
if not exist .env (
    echo ⚠️  Arquivo .env não encontrado!
    echo Criando a partir do exemplo...
    copy .env.example .env >nul
    echo ✅ Arquivo .env criado!
    echo.
    echo ⚠️  IMPORTANTE: Edite o arquivo .env e adicione sua chave OpenAI!
    echo    OPENAI_API_KEY=sua-chave-aqui
    echo.
)
echo.

echo ========================================
echo ✅ INSTALAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo 🚀 Para iniciar o servidor, execute:
echo    iniciar.bat
echo.
echo 📚 Documentação completa em: docs\
echo.
pause
