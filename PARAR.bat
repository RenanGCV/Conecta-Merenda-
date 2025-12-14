@echo off
chcp 65001 >nul 2>nul
title Conecta Merenda - Parando...

echo.
echo  ================================================================
echo.
echo       CONECTA MERENDA - Encerrando sistema...
echo.
echo  ================================================================
echo.

:: Ir para pasta do script
cd /d "%~dp0"

echo  Parando containers...
docker-compose down

echo.
echo  [OK] Sistema encerrado com sucesso!
echo.
echo  Pressione qualquer tecla para fechar...
pause >nul
