

<h1 align="center">🥦 Conecta Merenda</h1>

<p align="center">
  <strong>Plataforma inteligente de gestão de compras do PNAE</strong><br/>
  <em>Conectando escolas públicas a agricultores familiares locais</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai" alt="OpenAI"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS"/>
</p>

---

## 📋 Índice

- [🚀 Início Rápido (Jurados)](#-início-rápido-jurados)
- [O Problema](#-o-problema)
- [A Solução](#-a-solução)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação Manual](#-instalação-manual)
- [Uso](#-uso)
- [Arquitetura](#-arquitetura)
- [API](#-api)

---

## 🚀 Início Rápido (Jurados)

> **Para jurados e avaliadores:** Execute o projeto com apenas **2 passos**!

### Pré-requisito
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e rodando

### Executar

```bash
# 1. Abra o Docker Desktop e aguarde inicializar

# 2. Dê duplo-clique no arquivo:
EXECUTAR.bat
```

**Pronto!** 🎉 O navegador abrirá automaticamente em http://localhost:3000

### Login de Demonstração
| Perfil | Email | Senha |
|--------|-------|-------|
| 🏫 **Diretora** | diretora@escola.rj.gov.br | 123456 |

### Parar o Sistema
- Pressione qualquer tecla na janela do terminal, **ou**
- Execute `PARAR.bat`

---

## 🚨 O Problema

A **Lei 11.947/2009** determina que **no mínimo 30%** dos recursos do PNAE (Programa Nacional de Alimentação Escolar) devem ser utilizados na compra de alimentos da **agricultura familiar local**. Porém, na prática:

| Problema | Impacto |
|----------|---------|
| 🔍 **Dificuldade de encontrar produtores** | Escolas não sabem quem são os agricultores próximos |
| 📊 **Falta de monitoramento** | Gestores não conseguem acompanhar a meta de 30% |
| 🍎 **Compras fora de safra** | Desperdício e custos elevados |
| 📝 **Burocracia excessiva** | Relatórios manuais e processos lentos |
| 🚨 **Pouca fiscalização** | Irregularidades passam despercebidas |

---

## 💡 A Solução

O **Conecta Merenda** é uma plataforma B2G (Business-to-Government) que usa **Inteligência Artificial** para revolucionar a gestão da merenda escolar:

### 🎯 Proposta de Valor

```
┌─────────────────────────────────────────────────────────────────┐
│  ANTES                          →   DEPOIS COM CONECTA MERENDA │
├─────────────────────────────────────────────────────────────────┤
│  Busca manual de produtores     →   Match automático por GPS   │
│  Cardápios genéricos            →   IA sugere receitas sazonais│
│  Relatórios em planilha         →   PDF automático com 1 clique│
│  Meta 30% no escuro             →   Dashboard tempo real       │
│  Fiscalização pontual           →   Alertas automáticos de IA  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Funcionalidades

### 🏫 Para Diretoras de Escola

| Funcionalidade | Descrição |
|----------------|-----------|
| 🤖 **Cardápio com IA** | GPT-4 sugere substituições baseadas em safra regional, valor nutricional e preferências dos alunos |
| 🛒 **Marketplace** | Compre de agricultores familiares (30%) e fornecedores (70%) em uma única interface |
| 📍 **Mapa de Produtores** | Visualize produtores próximos com desconto por distância (até 20%) |
| 📊 **Dashboard PNAE** | Monitore em tempo real o cumprimento da meta de 30% |
| 📄 **Relatórios PDF** | Gere relatórios completos para prestação de contas com 1 clique |
| 💡 **Sugestões IA** | Receba recomendações personalizadas de economia e nutrição |

### 🌾 Para Agricultores Familiares

| Funcionalidade | Descrição |
|----------------|-----------|
| 📋 **Cadastro Simplificado** | Registre produtos com preços e disponibilidade |
| 🏆 **Visibilidade** | Apareça no mapa para escolas da região |
| ⭐ **Avaliações** | Construa reputação com sistema de reviews |
| 📦 **Gestão de Pedidos** | Acompanhe entregas e recebimentos |

### 🏛️ Para Secretarias de Educação

| Funcionalidade | Descrição |
|----------------|-----------|
| 📈 **Dashboard Consolidado** | Visão geral de todas as escolas da rede |
| 🔍 **Fiscalização IA** | Detecção automática de irregularidades e sobrepreço |
| 📊 **Relatórios Agregados** | Exportação de dados para auditoria |
| 🚨 **Alertas** | Notificações de escolas abaixo da meta |

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Uso |
|------------|-----|
| **FastAPI** | Framework web assíncrono |
| **Pydantic** | Validação de dados |
| **OpenAI GPT-4** | Geração de cardápios e análises |
| **JWT** | Autenticação segura |
| **ReportLab** | Geração de PDFs |
| **QRCode** | Rastreabilidade de alimentos |

### Frontend
| Tecnologia | Uso |
|------------|-----|
| **Next.js 14** | Framework React com App Router |
| **TypeScript** | Tipagem estática |
| **TailwindCSS** | Estilização utilitária |
| **Leaflet** | Mapas interativos |
| **jsPDF** | Geração de PDFs no cliente |
| **Lucide Icons** | Ícones consistentes |

### Design System
- **Estilo:** Cartoon Outline (bordas 3px, sombras 4px)
- **Cores:** Verde Conecta (#0B4F35), Verde Brócolis (#9BC53D), Laranja Cenoura (#F47C20)
- **Fontes:** Nunito (títulos) + Inter (corpo)

---

## �️ Instalação Manual

> **Nota:** Para execução rápida, use o [Docker](#-início-rápido-jurados). A instalação manual é para desenvolvedores.

### Pré-requisitos
- Node.js 18+
- Python 3.10+
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/conecta-merenda.git
cd conecta-merenda
```

### 2. Instale o Backend
```bash
cd backend
pip install -r requirements.txt
```

### 3. Instale o Frontend
```bash
cd frontend
npm install
```

### 4. Configure as variáveis de ambiente
```bash
# backend/.env
OPENAI_API_KEY=sua_chave_aqui

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. Inicie os servidores

**Opção 1 - Script automático (Windows):**
```bash
./iniciar.bat
```

**Opção 2 - Manual:**
```bash
# Terminal 1 - Backend
cd backend && python start.py

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 6. Acesse
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **Docs API:** http://localhost:8000/docs

---

## 📱 Uso

### Login de Demonstração
| Perfil | Email | Senha |
|--------|-------|-------|
| 🏫 Diretora | diretora@escola.rj.gov.br | 123456 |

### Fluxo Principal

```
Login → Dashboard → Gerar Cardápio IA → Marketplace → Carrinho → Finalizar Pedido
                         ↓
              Agricultura Familiar (30%)
              Fornecedores Normais (70%)
```

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  Next.js 14 + React + TailwindCSS + TypeScript                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Dashboard│ │Cardápio │ │Marketplace│ │Relatórios│ │ Perfil │   │
│  └────┬────┘ └────┬────┘ └────┬─────┘ └────┬─────┘ └────┬────┘   │
└───────┼──────────┼──────────┼───────────┼───────────┼──────────┘
        │          │          │           │           │
        ▼          ▼          ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  FastAPI + Pydantic + JWT                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Auth   │ │Escolas  │ │Agricult.│ │Dashboard│ │  IA     │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
└───────┼──────────┼──────────┼───────────┼───────────┼──────────┘
        │          │          │           │           │
        ▼          ▼          ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │JSON Data │  │ OpenAI   │  │ Haversine│  │  ReportLab   │    │
│  │  (Mock)  │  │  GPT-4   │  │   (Geo)  │  │    (PDF)     │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 API

### Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Autenticação JWT |
| GET | `/escolas/{id}` | Dados da escola |
| GET | `/agricultores/proximos` | Produtores por geolocalização |
| POST | `/ia/cardapio/gerar` | Gerar cardápio com IA |
| POST | `/ia/cardapio/substituir` | Substituir item do cardápio |
| GET | `/dashboard/pnae` | Métricas PNAE em tempo real |
| POST | `/fiscalizacao/analise` | Análise de irregularidades |


---

## 🎨 Identidade Visual

| Verde Conecta | Verde Brócolis | Laranja Cenoura | Creme Papel |
|:-------------:|:--------------:|:---------------:|:-----------:|
| #0B4F35 | #9BC53D | #F47C20 | #FFFDF5 |
| Principal | Destaque | Ação | Background |

---

## 🌱 Impacto Social

- 💚 **Fortalecimento da agricultura familiar** - Conexão direta com escolas
- 🍎 **Alimentação escolar mais saudável** - Produtos frescos e da safra
- 🌍 **Sustentabilidade** - Redução da pegada de carbono (compras locais)
- 📚 **Transparência** - Rastreabilidade completa
- 💰 **Economia** - Até 20% de desconto por proximidade

---

## 📄 Licença

Este projeto foi desenvolvido para o **Hackathon Devs De Impacto 2025** e está disponível sob a licença MIT.

---

<p align="center">
  <strong>🥦 Conecta Merenda</strong><br/>
  <em>Alimentando o futuro com tecnologia e sustentabilidade</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Powered%20by-OpenAI-412991?style=flat-square&logo=openai" alt="Powered by OpenAI"/>
</p>
