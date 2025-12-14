# 🍎 Conecta Merenda - Backend API

Backend completo do sistema Conecta Merenda - Plataforma inteligente de gestão de compras PNAE (Programa Nacional de Alimentação Escolar).

## 📋 Sobre o Projeto

Sistema B2G (Business-to-Government) que conecta escolas públicas a agricultores familiares locais, facilitando compras diretas e cumprimento da Lei 11.947/2009 (mínimo 30% do orçamento PNAE para agricultura familiar).

### ✨ Principais Funcionalidades

- **🤖 IA para Substituição de Cardápio**: GPT-4 sugere trocas inteligentes baseadas em safra, nutrição e custo
- **📍 Geolocalização Inteligente**: Algoritmo de match que pondera distância e qualidade
- **💰 Desconto por Proximidade**: Até 20% de desconto para produtores < 50km
- **📊 Dashboard PNAE**: Monitoramento em tempo real da meta de 30%
- **🔍 Rastreabilidade**: QR Codes para auditoria completa
- **📄 Relatórios PDF**: Prestação de contas automática

## 🚀 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **Pydantic** - Validação de dados com type hints
- **OpenAI GPT-4** - Inteligência artificial para sugestões
- **JWT** - Autenticação segura com tokens
- **ReportLab** - Geração de relatórios PDF
- **QRCode** - Rastreabilidade de produtos

## 📦 Instalação

### Requisitos

- Python 3.10+
- pip

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <url-do-repo>
cd Conecta-Merenda-/backend
```

2. **Crie um ambiente virtual**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Instale as dependências**
```bash
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp ../.env.example ../.env

# Edite o .env e adicione sua chave da OpenAI
# OPENAI_API_KEY=sk-...
# SECRET_KEY=sua-chave-secreta-forte
```

5. **Execute o servidor**
```bash
# Desenvolvimento (com reload automático)
python app.py

# Ou usando uvicorn diretamente
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

6. **Acesse a documentação**
```
http://localhost:8000/docs  (Swagger UI)
http://localhost:8000/redoc (ReDoc)
```

## 🏗️ Estrutura do Projeto

```
backend/
├── app.py                    # Aplicação principal FastAPI
├── config.py                 # Configurações e variáveis de ambiente
├── schemas.py                # Schemas Pydantic (validação)
├── requirements.txt          # Dependências Python
│
├── data/                     # Mock Data (JSONs)
│   ├── produtores.json       # 10 produtores variados
│   ├── escolas.json          # 5 escolas municipais
│   ├── safra_regional.json   # Calendário de safra
│   ├── clima_previsao.json   # Alertas climáticos
│   ├── pedidos.json          # Histórico de pedidos
│   └── avaliacoes.json       # Avaliações de entregas
│
├── routers/                  # Endpoints da API
│   ├── __init__.py
│   ├── auth.py              # Autenticação JWT
│   ├── agricultores.py      # CRUD e busca de produtores
│   ├── escolas.py           # Pedidos, avaliações, IA
│   ├── secretaria.py        # Dashboard e auditoria
│   └── dashboard.py         # Métricas gerais
│
├── services/                # Lógica de negócio
│   ├── __init__.py
│   ├── geolocation.py      # Haversine, match, descontos
│   ├── ia_cardapio.py      # Integração OpenAI GPT-4
│   ├── qrcode_gen.py       # Geração de QR Codes
│   └── pdf_reports.py      # Relatórios em PDF
│
└── middleware/              # Middlewares customizados
    ├── __init__.py
    ├── security.py         # Headers de segurança HTTP
    └── logging.py          # Log de requisições
```

## 🔐 Segurança Implementada

### Autenticação
- ✅ JWT (JSON Web Tokens) com expiração configurável
- ✅ Algoritmo HS256 com chave secreta forte
- ✅ Proteção de rotas sensíveis

### Headers de Segurança HTTP
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY (anti-clickjacking)
- ✅ Content-Security-Policy (CSP)
- ✅ X-XSS-Protection
- ✅ Referrer-Policy

### Rate Limiting
- ✅ Limite de 60 requisições/minuto por IP
- ✅ Proteção contra DDoS e brute force

### Validação de Dados
- ✅ Pydantic schemas com validação rigorosa
- ✅ Type hints em todo o código
- ✅ Sanitização de inputs

### CORS
- ✅ Configuração restritiva de origens permitidas
- ✅ Controle de métodos HTTP

## 📚 API Endpoints

### Autenticação
```
POST   /api/v1/auth/login              # Login (retorna JWT)
GET    /api/v1/auth/me                 # Dados do usuário logado
POST   /api/v1/auth/logout             # Logout
```

### Agricultores
```
GET    /api/v1/agricultores/           # Listar produtores
GET    /api/v1/agricultores/{id}       # Detalhes do produtor
POST   /api/v1/agricultores/buscar     # Busca geolocalizada
GET    /api/v1/agricultores/{id}/produtos
GET    /api/v1/agricultores/{id}/avaliacoes
```

### Escolas
```
GET    /api/v1/escolas/                # Listar escolas
POST   /api/v1/escolas/pedidos         # Criar pedido
GET    /api/v1/escolas/pedidos         # Listar pedidos
POST   /api/v1/escolas/avaliacoes      # Avaliar entrega
POST   /api/v1/escolas/feedback-cardapio  # Merendômetro
POST   /api/v1/escolas/sugestao-ia     # 🤖 Sugestão da IA
POST   /api/v1/escolas/relatorios      # Gerar PDF
GET    /api/v1/escolas/pedidos/{id}/qrcode  # QR Code
```

### Secretaria
```
GET    /api/v1/secretaria/dashboard-financeiro
GET    /api/v1/secretaria/ranking-escolas
GET    /api/v1/secretaria/ranking-produtores
GET    /api/v1/secretaria/auditoria/avaliacoes-baixas
GET    /api/v1/secretaria/alertas-climaticos
GET    /api/v1/secretaria/produtos-safra
```

### Dashboard
```
GET    /api/v1/dashboard/visao-geral
GET    /api/v1/dashboard/categorias-mais-compradas
GET    /api/v1/dashboard/mapa-produtores
GET    /api/v1/dashboard/estatisticas-tempo-real
```

## 🧪 Usuários de Teste

Para testar a API, use estas credenciais:

| Email | Senha | Perfil |
|-------|-------|--------|
| escola@email.com | escola123 | Escola |
| agricultor@email.com | agri123 | Agricultor |
| secretaria@email.com | sec123 | Secretaria |

### Exemplo de Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "escola@email.com",
    "senha": "escola123"
  }'
```

## 🤖 Usando a IA

A funcionalidade mais poderosa é a sugestão de substituição de cardápio:

```bash
curl -X POST "http://localhost:8000/api/v1/escolas/sugestao-ia" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "escola_id": "ESC001",
    "produto_atual": "Uva",
    "motivo_troca": "Baixa aceitação dos alunos",
    "restricoes": []
  }'
```

**Resposta esperada:**
```json
{
  "produto_sugerido": "Morango",
  "justificativa": "Em safra, 25% mais barato, alta aceitação infantil",
  "economia_estimada_percentual": 25.0,
  "producoes_disponiveis": [...],
  "valor_nutricional_comparativo": {...}
}
```

## 📊 Algoritmos Principais

### 1. Fórmula de Match
```python
Score = (0.6 / distancia_km) + (0.4 * nota_media / 5)
```
- 60% peso para proximidade
- 40% peso para qualidade

### 2. Desconto por Proximidade
```python
if distancia < 50km:
    desconto = (50 - distancia) / 2  # Máximo 20%
```

### 3. Meta PNAE
```python
percentual_af = (gasto_agricultura_familiar / gasto_total) * 100
conforme = percentual_af >= 30  # Lei 11.947/2009
```

## 🐛 Debugging

### Ver logs
```bash
# Logs aparecem no console durante execução
# Em produção, redirecione para arquivo:
uvicorn app:app --log-config logging.conf
```

### Testar endpoints
Use o Swagger UI em `/docs` ou ferramentas como:
- Postman
- Insomnia
- Thunder Client (VS Code)
- curl

## 🚀 Deploy em Produção

### Checklist de Segurança

1. **Alterar SECRET_KEY**
```bash
# Gerar chave forte
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

2. **Desabilitar DEBUG**
```env
DEBUG=False
```

3. **Configurar HTTPS**
- Usar certificado SSL (Let's Encrypt)
- Habilitar HSTS no middleware

4. **Banco de Dados Real**
- Migrar de JSON para PostgreSQL/MySQL
- Implementar conexão com SQLAlchemy

5. **Variáveis de Ambiente**
- Nunca commitar `.env`
- Usar secrets do provedor (AWS, Azure, etc)

### Exemplo Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📄 Licença

Este projeto foi desenvolvido para o Programa Nacional de Alimentação Escolar (PNAE).

## 👥 Contribuindo

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Email: suporte@conectamerenda.com.br

---

**Desenvolvido com ❤️ para melhorar a alimentação escolar no Brasil** 🇧🇷
