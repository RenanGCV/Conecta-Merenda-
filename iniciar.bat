@echo off
chcp 65001 >nul 2>nul
title Conecta Merenda - Iniciando...

echo.
echo  ================================================================
echo.
echo       CONECTA MERENDA
echo       Sistema Inteligente de Gestao PNAE
echo.
echo       Hackathon 2025
echo.
echo  ================================================================
echo.

:: Ir para pasta do script
cd /d "%~dp0"

:: Verificar se Docker está instalado
docker --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo  [ERRO] Docker nao encontrado!
    echo.
    echo  Para executar este projeto, voce precisa do Docker Desktop.
    echo  Baixe em: https://www.docker.com/products/docker-desktop
    echo.
    echo  Pressione qualquer tecla para sair...
    pause >nul
    exit /b 1
)

echo  [OK] Docker encontrado!

:: Verificar se Docker está rodando
docker info >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Docker nao esta rodando. Iniciando...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" 2>nul
    echo.
    echo  Aguardando Docker iniciar...
    :WAIT_DOCKER
    timeout /t 5 /nobreak >nul
    docker info >nul 2>nul
    if %ERRORLEVEL% NEQ 0 goto WAIT_DOCKER
    echo  [OK] Docker iniciado!
)

echo.
echo  Construindo e iniciando containers...
echo  (Primeira vez pode demorar alguns minutos)
echo.

:: Iniciar containers
docker-compose up --build -d

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [ERRO] Falha ao iniciar. Verifique se as portas 3000 e 8000 estao livres.
    echo.
    echo  Pressione qualquer tecla para sair...
    pause >nul
    exit /b 1
)

echo.
echo  Aguardando servicos ficarem prontos...
timeout /t 10 /nobreak >nul

echo.
echo  ================================================================
echo.
echo   SISTEMA PRONTO!
echo.
echo   Abrindo navegador...
echo.
echo   ----------------------------------------------------------------
echo.
echo   LOGIN:
echo      Email: diretora@escola.rj.gov.br
echo      Senha: 123456
echo.
echo   ----------------------------------------------------------------
echo.
echo   URLs:
echo      Frontend:  http://localhost:3000
echo      Backend:   http://localhost:8000
echo      API Docs:  http://localhost:8000/docs
echo.
echo  ================================================================
echo.

:: Abrir navegador
start http://localhost:3000

echo.
echo  Para PARAR o sistema, execute: PARAR.bat
echo.
echo  Pressione qualquer tecla para fechar esta janela...
echo  (O sistema continuara rodando em segundo plano)
echo.
pause >nul
