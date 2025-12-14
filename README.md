# 🍎 Conecta Merenda - Sistema Completo

## 🎯 Visão Geral

Sistema inteligente de gestão de compras do PNAE (Programa Nacional de Alimentação Escolar) que conecta escolas públicas a agricultores familiares locais.

## 📦 Componentes

### Backend (FastAPI) ✅
Localização: `backend/`

API RESTful completa com:
- 31 endpoints funcionais
- Integração com IA (GPT-4)
- Geolocalização inteligente
- Autenticação JWT
- Geração de relatórios PDF
- QR Codes de rastreabilidade

[📖 Documentação Completa](backend/README.md)

### Frontend (Streamlit) 🚧
Localização: `frontend/` (a ser implementado)

### Dados
Localização: `backend/data/`

Mock data completo:
- 10 produtores rurais com geolocalização
- 5 escolas municipais
- Calendário de safra com informações nutricionais
- Alertas climáticos
- Histórico de pedidos e avaliações

## 🚀 Início Rápido

### 1. Clone o Repositório
```bash
git clone <url-do-repo>
cd Conecta-Merenda-
```

### 2. Configure o Ambiente
```bash
# Copie o arquivo de configuração
cp .env.example .env

# Edite .env e adicione sua chave OpenAI
# OPENAI_API_KEY=sk-...
```

### 3. Inicie o Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python start.py
```

### 4. Acesse a API
```
http://localhost:8000/docs  (Swagger UI)
```

## 🔑 Usuários de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| 🏫 Escola | escola@email.com | escola123 |
| 🚜 Agricultor | agricultor@email.com | agri123 |
| 🏛️ Secretaria | secretaria@email.com | sec123 |

## 📚 Documentação

### Backend
- [README.md](backend/README.md) - Documentação completa
- [QUICKSTART.md](backend/QUICKSTART.md) - Início rápido
- [EXEMPLOS.md](backend/EXEMPLOS.md) - Exemplos de uso
- [ESTRUTURA.md](backend/ESTRUTURA.md) - Visão da estrutura

### Projeto
- [contexto.md](contexto.md) - Contexto do projeto
- [guia_implementacao.md](guia_implementacao.md) - Guia de implementação
- [identidadeVisual.md](identidadeVisual.md) - Manual de identidade visual

## ✨ Funcionalidades Principais

### 🤖 IA para Cardápio
Sugestões inteligentes de substituição de alimentos baseadas em:
- Valor nutricional
- Safra regional
- Custo-benefício
- Aceitação infantil

### 📍 Match Inteligente
Algoritmo que conecta escolas e produtores considerando:
- Distância (60% do peso)
- Qualidade/Avaliação (40% do peso)
- Desconto por proximidade (até 20%)

### 📊 Dashboard PNAE
Monitoramento em tempo real:
- Meta de 30% agricultura familiar
- Gastos totais
- Rankings de escolas e produtores
- Economia gerada

### 🔍 Rastreabilidade
QR Codes para auditoria completa:
- Origem do produto
- Certificações do produtor
- Histórico de entrega

## 🛠️ Stack Tecnológico

### Backend
- FastAPI 0.108
- Python 3.10+
- OpenAI GPT-4
- JWT Authentication
- ReportLab (PDF)
- QRCode

### Segurança
- JWT Tokens
- Rate Limiting
- CORS
- Headers de Segurança HTTP
- Validação Pydantic

## 📈 Métricas do Projeto

- **31** endpoints da API
- **10** produtores mock
- **5** escolas mock
- **20** produtos em safra
- **3** alertas climáticos
- **100%** type hints
- **100%** documentado

## 🎯 Objetivos PNAE

Este sistema ajuda no cumprimento da **Lei 11.947/2009**:

> No mínimo 30% dos recursos destinados à alimentação escolar devem ser aplicados na aquisição de produtos da agricultura familiar.

### Como o sistema ajuda:
✅ Conecta escolas diretamente a agricultores
✅ Monitora percentual de compras da agricultura familiar
✅ Gera relatórios automáticos para prestação de contas
✅ Rastreabilidade completa das compras
✅ Economia de até 20% em logística

## 🌱 Impacto Social

- 💚 Fortalecimento da agricultura familiar
- 🍎 Alimentação escolar mais saudável
- 🌍 Redução da pegada de carbono (compras locais)
- 📚 Transparência na gestão pública
- 💰 Economia para os municípios

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido para o Programa Nacional de Alimentação Escolar (PNAE).

## 🏆 Créditos

Desenvolvido seguindo as melhores práticas de:
- Clean Code
- SOLID Principles
- RESTful API Design
- Security Best Practices
- Brazilian Government Standards (PNAE)

---

**🇧🇷 Melhorando a alimentação escolar no Brasil através da tecnologia**

Para mais informações: [backend/README.md](backend/README.md)
