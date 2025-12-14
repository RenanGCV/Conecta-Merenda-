# 🚀 Conecta Merenda - Inicialização Automática
# Execute este script no PowerShell para iniciar o sistema

Write-Host "========================================" -ForegroundColor Green
Write-Host "   Conecta Merenda - Inicialização" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Set-Location backend

Write-Host "[1/5] Verificando Python..." -ForegroundColor Cyan
$pythonVersion = python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Python não encontrado!" -ForegroundColor Red
    Write-Host "Instale Python 3.10+ de python.org" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-Host "✅ $pythonVersion" -ForegroundColor Green
Write-Host ""

Write-Host "[2/5] Criando ambiente virtual..." -ForegroundColor Cyan
if (-not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "✅ Ambiente virtual criado!" -ForegroundColor Green
} else {
    Write-Host "✅ Ambiente virtual já existe." -ForegroundColor Green
}
Write-Host ""

Write-Host "[3/5] Ativando ambiente virtual..." -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao ativar ambiente virtual!" -ForegroundColor Red
    Write-Host "Execute: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-Host "✅ Ambiente ativado!" -ForegroundColor Green
Write-Host ""

Write-Host "[4/5] Instalando dependências..." -ForegroundColor Cyan
pip install -r requirements.txt --quiet
Write-Host "✅ Dependências instaladas!" -ForegroundColor Green
Write-Host ""

Write-Host "[5/5] Iniciando servidor..." -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Servidor iniciando..." -ForegroundColor Green
Write-Host "   Acesse: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

python start.py
