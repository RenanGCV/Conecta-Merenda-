# 🚀 CONECTA MERENDA - GUIA DE INSTALAÇÃO RÁPIDA

## ⚡ Instalação em 3 Passos (5 minutos)

### 📋 Pré-requisitos

Você precisa ter instalado:
- **Python 3.10 ou superior** → [Baixar aqui](https://www.python.org/downloads/)
  - ⚠️ **IMPORTANTE:** Marque "Add Python to PATH" durante a instalação!

---

## 🎯 Instalação Automática (RECOMENDADO)

### Windows:

1. **Extraia o projeto** em uma pasta (ex: `C:\Projetos\Conecta-Merenda`)

2. **Execute o instalador**:
   - Clique duas vezes em `INSTALAR.bat`
   - Aguarde (2-3 minutos para instalar tudo)

3. **Configure a chave OpenAI**:
   - Abra o arquivo `.env` com Bloco de Notas
   - Substitua `sk-proj-exemplo...` pela sua chave real
   - Obtenha em: https://platform.openai.com/api-keys

4. **Inicie o servidor**:
   - Clique duas vezes em `iniciar.bat`
   - Aguarde o servidor iniciar

5. **Pronto!** 🎉
   - Abra: http://localhost:8000/docs (Documentação da API)
   - Abra: http://localhost:8000/api/v1/dashboard/visual (Dashboard Visual)

---

## 🔧 Instalação Manual

Se preferir instalar manualmente:

```powershell
# 1. Abrir PowerShell na pasta do projeto
cd C:\Projetos\Conecta-Merenda

# 2. Criar ambiente virtual
py -m venv venv

# 3. Ativar ambiente virtual
.\venv\Scripts\Activate.ps1

# 4. Instalar dependências
pip install -r backend\requirements.txt

# 5. Configurar .env (copiar do exemplo)
copy .env.example .env
notepad .env

# 6. Iniciar servidor
cd backend
python start.py
```

---

## ❓ Problemas Comuns

### ❌ "Python não encontrado"
**Solução:**
1. Instale Python: https://www.python.org/downloads/
2. Marque "Add Python to PATH"
3. Reinicie o computador
4. Tente novamente

### ❌ "Erro ao executar scripts"
**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ "Dependências não instalam"
**Solução:**
```powershell
pip install --upgrade pip
pip install -r backend\requirements.txt --no-cache-dir
```

### ❌ "Porta 8000 já em uso"
**Solução:**
```powershell
# Matar processo na porta 8000
netstat -ano | findstr :8000
taskkill /F /PID <número_do_pid>
```

### ❌ "OpenAI API Key inválida"
**Solução:**
1. Crie uma conta em: https://platform.openai.com/
2. Gere uma chave API
3. Cole no arquivo `.env`

---

## 📂 Estrutura do Projeto

```
Conecta-Merenda/
├── INSTALAR.bat          ← Instalador automático
├── iniciar.bat           ← Inicia o servidor
├── .env                  ← Configurações (API keys)
├── backend/
│   ├── app.py           ← Aplicação principal
│   ├── start.py         ← Script de inicialização
│   ├── requirements.txt ← Dependências Python
│   ├── data/            ← Dados JSON
│   ├── routers/         ← Endpoints da API
│   └── services/        ← Serviços (IA, PDF, etc)
└── docs/                ← Documentação completa
```

---

## 🎓 Próximos Passos

Após instalação:

1. **Leia a documentação:**
   - `docs/README.md` - Visão geral
   - `docs/IA_AVANCADA.md` - Sistema de IA
   - `docs/TESTES.md` - Como testar

2. **Teste a API:**
   - Abra: http://localhost:8000/docs
   - Clique em "Try it out" nos endpoints
   - Teste login, listar produtores, etc.

3. **Veja o Dashboard:**
   - Abra: http://localhost:8000/api/v1/dashboard/visual
   - Dashboard interativo com gráficos

4. **Explore os endpoints:**
   - `/api/v1/auth/login` - Login
   - `/api/v1/escolas/cardapio-automatico` - Gerar cardápio com IA
   - `/api/v1/professores/consumo-diario` - Registrar consumo
   - `/api/v1/escolas/dashboard-inteligente/{id}` - Insights de IA

---

## 🆘 Suporte

Se tiver problemas:

1. Verifique os logs no terminal
2. Leia `docs/TESTES.md`
3. Confira se o Python está instalado corretamente
4. Verifique se a chave OpenAI está configurada

---

## ✅ Checklist de Verificação

Após instalação, você deve conseguir:

- [ ] `py --version` mostra Python 3.10+
- [ ] Arquivo `.env` existe e tem a chave OpenAI
- [ ] `iniciar.bat` inicia o servidor sem erros
- [ ] http://localhost:8000/docs abre a documentação
- [ ] http://localhost:8000/health retorna `{"status": "ok"}`
- [ ] Dashboard visual carrega com gráficos

Se todos os itens estiverem OK, está tudo funcionando! 🎉

---

**Sistema pronto para uso!** 🚀

Para mais detalhes, consulte a documentação completa em `docs/`
