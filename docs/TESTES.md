# 🧪 Guia de Testes - Conecta Merenda

## ✅ Checklist de Verificação

### Antes de Começar

- [ ] Python 3.10+ instalado
- [ ] Git instalado (opcional)
- [ ] Editor de código (VS Code recomendado)
- [ ] Postman/Insomnia (opcional, para testes manuais)

---

## 🚀 PASSO 1: Instalação

### Windows PowerShell
```powershell
# 1. Navegar para a pasta do projeto
cd d:\Projeto\Conecta-Merenda-\backend

# 2. Criar ambiente virtual
python -m venv venv

# 3. Ativar ambiente virtual
.\venv\Scripts\Activate.ps1

# Se der erro de política de execução:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 4. Instalar dependências
pip install -r requirements.txt
```

### Verificar Instalação
```powershell
# Verificar Python
python --version  # Deve mostrar 3.10+

# Verificar FastAPI
python -c "import fastapi; print(fastapi.__version__)"

# Verificar OpenAI
python -c "import openai; print(openai.__version__)"
```

---

## ⚙️ PASSO 2: Configuração

### Configurar .env
```powershell
# 1. Abrir arquivo .env no editor
notepad ..\.env

# 2. Adicionar sua chave OpenAI (obtenha em https://platform.openai.com/api-keys)
# OPENAI_API_KEY=sk-proj-sua-chave-real-aqui

# 3. Salvar e fechar
```

### Verificar Arquivos de Dados
```powershell
# Verificar se os JSONs existem
ls data\*.json

# Deve mostrar:
# - produtores.json
# - escolas.json
# - safra_regional.json
# - clima_previsao.json
# - pedidos.json
# - avaliacoes.json
```

---

## 🎬 PASSO 3: Iniciar Servidor

### Método 1: Script de Inicialização (Recomendado)
```powershell
python start.py
```

**O que deve acontecer:**
```
🔍 Verificando configuração do ambiente...

✅ Python 3.11.5
✅ Arquivo .env encontrado
✅ OPENAI_API_KEY configurada
✅ Dependências principais instaladas
✅ Arquivos de dados OK (6 arquivos)

==================================================
✅ Ambiente configurado corretamente!
🚀 Iniciando servidor...

INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
🚀 Conecta Merenda API iniciando...
📍 Ambiente: Desenvolvimento
🌐 CORS habilitado para: ['http://localhost:3000', 'http://localhost:8501']
INFO:     Application startup complete.
```

### Método 2: Direto
```powershell
python app.py
```

### Método 3: Uvicorn
```powershell
uvicorn app:app --reload
```

---

## 🧪 PASSO 4: Testes Automatizados

### Abrir NOVO Terminal (manter servidor rodando)
```powershell
# 1. Navegar para backend
cd d:\Projeto\Conecta-Merenda-\backend

# 2. Ativar ambiente virtual
.\venv\Scripts\Activate.ps1

# 3. Executar testes
python test_api.py
```

**Resultado Esperado:**
```
🧪 Iniciando testes da API Conecta Merenda

==================================================
✅ Health Check
   Status: 200

✅ Login
   Token obtido: eyJhbGciOiJIUzI1NiIs...

✅ Listar Produtores
   Total: 10 produtores

✅ Dashboard Financeiro
   Gasto Total: R$ 0

==================================================

✅ Testes concluídos!
📚 Documentação completa: http://localhost:8000/docs
```

---

## 🌐 PASSO 5: Testar no Navegador

### 1. Documentação Interativa (Swagger)
```
http://localhost:8000/docs
```

**Teste Manual:**

1. **Encontre o endpoint `/api/v1/auth/login`**
2. **Clique em "Try it out"**
3. **Preencha:**
   ```json
   {
     "email": "escola@email.com",
     "senha": "escola123"
   }
   ```
4. **Clique em "Execute"**
5. **Copie o `access_token` da resposta**

6. **Clique no botão "Authorize" (cadeado) no topo**
7. **Cole o token** no campo (adicione `Bearer ` na frente se necessário)
8. **Clique em "Authorize" e depois "Close"**

9. **Agora você pode testar qualquer endpoint autenticado!**

### 2. Testar Health Check
```
http://localhost:8000/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-12-13T...",
  "environment": "development"
}
```

### 3. Ver Informações da API
```
http://localhost:8000/
```

---

## 🔬 PASSO 6: Testes com PowerShell

### Login
```powershell
$body = @{
    email = "escola@email.com"
    senha = "escola123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$token = $response.access_token
Write-Host "Token: $token"
```

### Listar Produtores
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$produtores = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/agricultores/" `
    -Method GET `
    -Headers $headers

Write-Host "Total de produtores: $($produtores.Count)"
$produtores | Format-Table id, nome, avaliacao_media
```

### Buscar Produtores Próximos
```powershell
$busca = @{
    escola_latitude = -22.7247
    escola_longitude = -47.6492
    raio_km = 50
    apenas_com_dap = $true
} | ConvertTo-Json

$resultado = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/agricultores/buscar" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $busca

Write-Host "Encontrados: $($resultado.Count) produtores"
$resultado | Format-Table nome, distancia_km, score_match, desconto_proximidade
```

### Dashboard Financeiro
```powershell
$dashboard = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/secretaria/dashboard-financeiro" `
    -Method GET `
    -Headers $headers

$dashboard | Format-List
```

---

## 🎯 PASSO 7: Testar Funcionalidade de IA

### Sugestão de Substituição (GPT-4)
```powershell
$sugestao = @{
    escola_id = "ESC001"
    produto_atual = "Uva"
    motivo_troca = "Baixa aceitação dos alunos e alto custo"
    restricoes = @()
} | ConvertTo-Json

$resposta = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/escolas/sugestao-ia" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $sugestao

Write-Host "Produto Sugerido: $($resposta.produto_sugerido)"
Write-Host "Justificativa: $($resposta.justificativa)"
Write-Host "Economia: $($resposta.economia_estimada_percentual)%"
```

**Nota:** Requer chave OpenAI válida no .env!

---

## 🐛 Solução de Problemas

### Erro: "OPENAI_API_KEY not found"
```powershell
# Verificar se .env existe
Test-Path ..\.env

# Abrir e verificar conteúdo
notepad ..\.env

# Deve ter: OPENAI_API_KEY=sk-...
```

### Erro: "Module not found"
```powershell
# Reinstalar dependências
pip install -r requirements.txt --force-reinstall
```

### Erro: "Address already in use"
```powershell
# Descobrir processo na porta 8000
netstat -ano | findstr :8000

# Matar processo (substitua PID)
taskkill /F /PID <PID>

# Ou mudar porta
$env:API_PORT = "8001"
python start.py
```

### Erro: "Permission denied" (venv)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Servidor não responde
```powershell
# Verificar se está rodando
Test-NetConnection -ComputerName localhost -Port 8000

# Verificar logs
# (devem aparecer no terminal onde executou start.py)
```

---

## ✅ Checklist de Sucesso

Ao final dos testes, você deve conseguir:

- [ ] ✅ Servidor iniciando sem erros
- [ ] ✅ Health check respondendo
- [ ] ✅ Login funcionando e retornando token
- [ ] ✅ Listar produtores (10 itens)
- [ ] ✅ Buscar produtores por localização
- [ ] ✅ Dashboard mostrando métricas
- [ ] ✅ Documentação Swagger abrindo
- [ ] ✅ Testes automatizados passando
- [ ] ✅ IA sugerindo substituições (se chave configurada)

---

## 📊 Testes Avançados

### Criar Pedido Completo
```powershell
$pedido = @{
    escola_id = "ESC001"
    produtor_id = "PROD001"
    itens = @(
        @{
            produto_nome = "Alface"
            quantidade = 50
            unidade = "maço"
            preco_unitario = 3.50
        },
        @{
            produto_nome = "Tomate"
            quantidade = 30
            unidade = "kg"
            preco_unitario = 5.80
        }
    )
    tipo_logistica = "entrega"
    data_entrega_desejada = "2024-12-20"
    observacoes = "Entrega pela manhã"
} | ConvertTo-Json -Depth 10

$novoPedido = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/escolas/pedidos" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $pedido

Write-Host "Pedido criado: $($novoPedido.id)"
Write-Host "Valor total: R$ $($novoPedido.valor_total)"
```

### Ver Produtos em Safra
```powershell
$safra = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/secretaria/produtos-safra" `
    -Method GET

$safra.produtos_recomendados | Format-Table nome, preco_medio_kg, variacao_preco, disponibilidade
```

---

## 📖 Documentação de Referência

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **README:** [backend/README.md](README.md)
- **Exemplos:** [backend/EXEMPLOS.md](EXEMPLOS.md)

---

## 🎓 Próximos Passos

Após validar que tudo funciona:

1. **Explore todos os endpoints** no Swagger
2. **Leia os exemplos** em EXEMPLOS.md
3. **Entenda a estrutura** em ESTRUTURA.md
4. **Personalize** os dados em `data/*.json`
5. **Integre com frontend** (Streamlit/React)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs no terminal
2. Consulte a seção "Solução de Problemas"
3. Revise a documentação em /docs
4. Abra uma issue no GitHub

---

**✅ Sistema testado e funcionando!** 🎉
