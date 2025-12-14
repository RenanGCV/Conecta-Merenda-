# 🚀 Guia de Início Rápido - Conecta Merenda Backend

## ⚡ Setup em 5 Minutos

### 1️⃣ Instalar Dependências
```powershell
# Criar ambiente virtual
python -m venv venv
venv\Scripts\activate

# Instalar pacotes
pip install -r requirements.txt
```

### 2️⃣ Configurar Ambiente
```powershell
# Copiar arquivo de exemplo
Copy-Item .env.example .env

# Editar .env e adicionar:
# OPENAI_API_KEY=sk-sua-chave-aqui
# SECRET_KEY=uma-chave-secreta-forte-aqui
```

### 3️⃣ Executar Servidor
```powershell
# Método 1: Direto com Python
python app.py

# Método 2: Com Uvicorn
uvicorn app:app --reload
```

### 4️⃣ Testar API
Acesse: http://localhost:8000/docs

## 🧪 Teste Rápido

### Login
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"escola@email.com","senha":"escola123"}'
```

### Buscar Produtores
```bash
# PowerShell (substitua o TOKEN)
$token = "SEU_TOKEN_AQUI"
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/agricultores/" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}
```

## 📚 Endpoints Principais

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/docs` | GET | Documentação Swagger |
| `/api/v1/auth/login` | POST | Login |
| `/api/v1/agricultores/buscar` | POST | Buscar produtores por geolocalização |
| `/api/v1/escolas/sugestao-ia` | POST | 🤖 Sugestão IA de cardápio |
| `/api/v1/secretaria/dashboard-financeiro` | GET | Dashboard PNAE |

## 🔑 Usuários de Teste

- **Escola**: escola@email.com / escola123
- **Agricultor**: agricultor@email.com / agri123
- **Secretaria**: secretaria@email.com / sec123

## ❓ Problemas Comuns

### Erro: "OPENAI_API_KEY not found"
→ Configure a chave no arquivo `.env`

### Erro: "Module not found"
→ Execute `pip install -r requirements.txt`

### Porta 8000 já em uso
→ Mude em `config.py` ou use: `uvicorn app:app --port 8001`

## 📖 Documentação Completa
Veja [README.md](README.md) para documentação detalhada.
