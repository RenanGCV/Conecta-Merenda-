# 🎯 Guia de Implementação - AgroMerenda MVP

**Documento de Referência para Desenvolvimento (Hackathon 48h)**

---

## 📦 1. ESTRUTURA DE ARQUIVOS A CRIAR

### 1.1 Diretórios Base
- [ ] `backend/` - Servidor FastAPI
- [ ] `frontend/` - Interface Streamlit
- [ ] `data/` - Mock Data (JSONs)
- [ ] `assets/images/` - Fotos de perfil e produtos
- [ ] `assets/qrcodes/` - QR Codes gerados
- [ ] `docs/` - Documentação

### 1.2 Backend (`backend/`)
- [ ] `app.py` - Aplicação FastAPI principal
- [ ] `routers/auth.py` - Sistema de login por perfil
- [ ] `routers/agricultores.py` - CRUD e busca de produtores
- [ ] `routers/escolas.py` - Pedidos, avaliações, busca
- [ ] `routers/secretaria.py` - Dashboard e métricas
- [ ] `services/ia_cardapio.py` - Integração OpenAI para sugestões
- [ ] `services/geolocation.py` - Cálculo de distância e matchmaking
- [ ] `services/qrcode_gen.py` - Geração de QR Codes
- [ ] `models/schemas.py` - Modelos Pydantic

### 1.3 Frontend (`frontend/`)
- [ ] `app_streamlit.py` - App principal com roteamento
- [ ] `pages/1_🚜_Agricultor.py` - Interface do Agricultor
- [ ] `pages/2_🏫_Escola.py` - Interface da Escola
- [ ] `pages/3_🏛️_Secretaria.py` - Interface da Secretaria
- [ ] `components/merendometro.py` - Componente de feedback
- [ ] `components/mapa_produtores.py` - Mapa interativo
- [ ] `components/dashboard_bi.py` - Gráficos e métricas

### 1.4 Arquivos Mock Data (`data/`)
- [ ] `produtores.json` - 10 agricultores com localização
- [ ] `safra_regional.json` - Calendário de produtos por mês
- [ ] `clima_previsao.json` - Alertas meteorológicos simulados
- [ ] `nutricao_alunos.json` - Dados SISVAN fictícios
- [ ] `escolas.json` - 5 escolas com orçamento e localização
- [ ] `pedidos.json` - Histórico de pedidos
- [ ] `avaliacoes.json` - Avaliações de entregas

### 1.5 Configuração
- [ ] `requirements.txt` - Dependências Python
- [ ] `.env.example` - Template de variáveis de ambiente
- [ ] `.env` - Chave OpenAI (não versionar)
- [ ] `README.md` - Documentação do projeto

---

## 🎨 2. INTERFACES POR PERFIL

### 2.1 Perfil AGRICULTOR 🚜
#### Página de Onboarding
- [ ] Chatbot IA perguntando sobre DAP/CAF
- [ ] Fluxo condicional:
  - [ ] **Possui DAP/CAF**: Upload de foto do documento
  - [ ] **Não possui**: Tutorial passo-a-passo interativo
- [ ] Validação mockada de documentos

#### Página de Cadastro
- [ ] Formulário: Nome, CPF, Telefone
- [ ] Seletor de localização (latitude/longitude)
- [ ] Multi-select de produtos ofertados
- [ ] Campo de capacidade mensal (kg)
- [ ] Upload de foto de perfil

#### Mapa da Vizinhança
- [ ] Mapa Folium mostrando outros agricultores (5km de raio)
- [ ] Marcadores com nome e produtos
- [ ] Legenda de "prova social"

#### Gamificação
- [ ] Sistema "Indique um Vizinho"
- [ ] Contador de indicações
- [ ] Badge "Líder Comunitário" (3+ indicações)
- [ ] Selo visual no perfil

### 2.2 Perfil ESCOLA 🏫
#### Merendômetro (Feedback)
- [ ] Interface simples de registro
- [ ] Seletor de cardápio anterior
- [ ] Botões de aceitação: 👍 Boa | 👎 Rejeição
- [ ] Campo de texto para observações
- [ ] Histórico de feedbacks

#### IA de Cardápio
- [ ] Botão "Sugerir Cardápio com IA"
- [ ] Prompt integrando:
  - [ ] Feedbacks negativos
  - [ ] Produtos em safra atual
  - [ ] Equivalência nutricional
- [ ] Exibição da sugestão:
  - [ ] Alimento substituto
  - [ ] Justificativa nutricional
  - [ ] Comparativo de preço
  - [ ] Link para buscar produtor

#### Busca de Produtores
- [ ] Mapa interativo Folium
- [ ] Filtros:
  - [ ] Categoria (Hortaliças, Frutas, Proteínas)
  - [ ] Raio de distância (slider 10-100km)
  - [ ] Disponibilidade (em safra)
- [ ] Ordenação:
  - [ ] Por Relevância (distância + avaliação)
  - [ ] Por Proximidade
  - [ ] Por Avaliação
- [ ] Cards de produtores com:
  - [ ] Foto
  - [ ] Nome e distância
  - [ ] Produtos disponíveis
  - [ ] Avaliação (estrelas)
  - [ ] Tags de qualidade
  - [ ] Precificação dinâmica (desconto por proximidade)

#### Checkout e Pedido
- [ ] Carrinho de compras
- [ ] Seleção de produtos e quantidade (kg)
- [ ] Cálculo automático de preço
- [ ] Escolha de logística:
  - [ ] "Entrega pelo Produtor"
  - [ ] "Retirada pelo Veículo da Prefeitura"
- [ ] Data de entrega desejada
- [ ] Botão "Finalizar Pedido"
- [ ] Confirmação visual

#### Pós-Entrega
- [ ] Botão "Confirmar Recebimento"
- [ ] Sistema de avaliação:
  - [ ] Estrelas (1-5)
  - [ ] Tags pré-definidas: ["Fresco", "No Prazo", "Bem Embalado", "Mal Embalado", "Atrasado"]
  - [ ] Campo de comentário opcional
- [ ] Feedback enviado ao backend

#### Alertas Climáticos
- [ ] Banner de alerta quando `clima_previsao.json` tem avisos
- [ ] Exibição de:
  - [ ] Tipo de alerta (Chuva, Seca, Geada)
  - [ ] Severidade (Baixa, Média, Alta)
  - [ ] Produtos afetados
  - [ ] Recomendação de ação
- [ ] Botão "Ver Produtores Alternativos"

#### Relatórios PNAE
- [ ] Botão "Exportar Relatório PNAE"
- [ ] Geração de PDF/Excel com:
  - [ ] Dados da escola
  - [ ] Lista de pedidos do período
  - [ ] Total gasto em agricultura familiar
  - [ ] % do orçamento (meta 30%)
  - [ ] Assinaturas mockadas

### 2.3 Perfil SECRETARIA 🏛️
#### Dashboard Financeiro
- [ ] Gráfico de pizza: Orçamento gasto vs. Disponível
- [ ] Métrica destaque: **% em Agricultura Familiar** (meta 30%)
- [ ] Gráfico de barras: Gasto por escola
- [ ] Timeline de compras (últimos 3 meses)

#### Rankings
- [ ] **Top 5 Escolas**:
  - [ ] Ordenação por volume de compra
  - [ ] Exibição de total (kg) e valor (R$)
- [ ] **Top 5 Agricultores**:
  - [ ] Ordenação por vendas + avaliação
  - [ ] Exibição de nota média e total de entregas

#### Auditoria de Qualidade
- [ ] Tabela de todas as avaliações
- [ ] Filtros:
  - [ ] Por escola
  - [ ] Por produtor
  - [ ] Por período
  - [ ] Por nota (< 3 estrelas = alertar)
- [ ] Identificação visual de problemas recorrentes
- [ ] Botão "Contatar Produtor"

#### Rastreabilidade
- [ ] Lista de pedidos com QR Codes gerados
- [ ] Botão "Visualizar QR Code"
- [ ] Scanner simulado (clicar para abrir info)
- [ ] Página de rastreio mostrando:
  - [ ] Foto do produtor
  - [ ] Nome e localização do sítio
  - [ ] Produto e quantidade
  - [ ] Data da colheita
  - [ ] Data da entrega
  - [ ] Avaliação recebida

---

## 🧩 3. FUNCIONALIDADES TÉCNICAS

### 3.1 Autenticação
- [ ] Sistema de login mockado (sem senha real)
- [ ] Seletor de perfil: Agricultor | Escola | Secretaria
- [ ] Session state do Streamlit para manter login
- [ ] Redirecionamento automático para página correta

### 3.2 Geolocalização
- [ ] Função de cálculo de distância (Haversine)
- [ ] Entrada: (lat1, lon1, lat2, lon2)
- [ ] Saída: distância em km
- [ ] Integração com mapa Folium:
  - [ ] Marcadores personalizados
  - [ ] Popup com informações
  - [ ] Raio de busca visual

### 3.3 Matchmaking de Produtores
- [ ] Algoritmo de relevância:
  ```
  score = (peso_distancia * (1 / distancia_km)) + 
          (peso_avaliacao * avaliacao_media)
  ```
- [ ] Pesos sugeridos: 0.6 (distância), 0.4 (avaliação)
- [ ] Filtro de disponibilidade (safra atual)
- [ ] Retorno: lista ordenada de produtores

### 3.4 Precificação Dinâmica
- [ ] Cálculo de desconto por proximidade:
  ```
  desconto_percent = max(0, min(20, (50 - distancia_km) / 2))
  preco_final = preco_base * (1 - desconto_percent/100)
  ```
- [ ] Exibição: "Economia de R$ X devido à proximidade"

### 3.5 IA - Sugestão de Cardápio
- [ ] Integração OpenAI (GPT-4o)
- [ ] Prompt estruturado com:
  - [ ] Alimento rejeitado
  - [ ] Lista de safra atual
  - [ ] Pedido de equivalência nutricional
- [ ] Parse da resposta JSON:
  ```json
  {
    "substituto": "Cenoura",
    "justificativa": "Mesma vitamina A, 15% mais barata, boa aceitação infantil"
  }
  ```
- [ ] Fallback mockado se API falhar

### 3.6 IA - Onboarding Agricultor
- [ ] Chatbot conversacional
- [ ] Fluxo:
  1. Pergunta sobre DAP/CAF
  2. Se NÃO → Tutorial contextualizado por cidade
  3. Se SIM → Solicitar número/foto
- [ ] Linguagem acessível e empática
- [ ] Fallback com texto pré-definido

### 3.7 Geração de QR Code
- [ ] Biblioteca `qrcode` do Python
- [ ] Entrada: ID do pedido
- [ ] Conteúdo codificado: URL mockada `agromerenda.app/pedido/{id}`
- [ ] Salvamento em `assets/qrcodes/{id}.png`
- [ ] Exibição na interface

### 3.8 Exportação de Relatórios
- [ ] Formato: PDF (usar `reportlab`) ou Excel (`openpyxl`)
- [ ] Template seguindo formato PNAE/FNDE
- [ ] Dados incluídos:
  - [ ] Cabeçalho da escola
  - [ ] Período do relatório
  - [ ] Tabela de pedidos
  - [ ] Total gasto e % agricultura familiar
  - [ ] Assinaturas mockadas

---

## 📊 4. SCHEMAS DOS DADOS (JSON)

### 4.1 produtores.json
```json
[
  {
    "id": "PROD001",
    "nome": "João da Silva",
    "cpf": "123.456.789-00",
    "telefone": "(11) 98765-4321",
    "dap_caf": {
      "possui": true,
      "numero": "DAP-12345678",
      "tipo": "DAP Física",
      "validade": "2025-12-31"
    },
    "localizacao": {
      "latitude": -23.5505,
      "longitude": -46.6333,
      "endereco": "Sítio Boa Vista, Zona Rural, São Paulo - SP",
      "raio_entrega_km": 50
    },
    "produtos": [
      {
        "categoria": "Hortaliças",
        "itens": ["Alface", "Tomate", "Cenoura", "Beterraba"]
      }
    ],
    "capacidade_mensal_kg": 500,
    "avaliacao": {
      "media": 4.8,
      "total_vendas": 12,
      "tags": ["Fresco", "No Prazo", "Bem Embalado"]
    },
    "foto_perfil": "assets/images/joao_silva.jpg",
    "data_cadastro": "2024-01-15"
  }
]
```
**Criar 10 produtores** com variação de:
- [ ] Localizações diferentes (raio 100km)
- [ ] Produtos variados
- [ ] Avaliações (3.5 a 5.0)
- [ ] DAP/CAF (80% possui, 20% não)

### 4.2 safra_regional.json
```json
{
  "regiao": "Sudeste",
  "mes_referencia": "Dezembro",
  "produtos_safra": [
    {
      "nome": "Tomate",
      "categoria": "Hortaliças",
      "disponibilidade": "Alta",
      "preco_medio_kg": 4.50,
      "nutricao": {
        "calorias": 18,
        "vitaminas": ["C", "A"],
        "minerais": ["Potássio"]
      },
      "alternativa_nutricional_para": []
    }
  ]
}
```
**Criar pelo menos 20 produtos** incluindo:
- [ ] 10 Hortaliças
- [ ] 5 Frutas
- [ ] 5 Proteínas (ovos, frango caipira)
- [ ] Definir alternativas nutricionais (ex: Cenoura ↔ Beterraba)

### 4.3 clima_previsao.json
```json
{
  "alertas": [
    {
      "id": "ALERT001",
      "regiao": "Sudeste",
      "tipo": "Chuva Intensa",
      "severidade": "Média",
      "data_inicio": "2024-12-20",
      "data_fim": "2024-12-22",
      "impacto_produtos": ["Tomate", "Alface"],
      "recomendacao": "Antecipar compras ou buscar fornecedores de regiões não afetadas"
    }
  ]
}
```
**Criar 3 alertas** variados:
- [ ] Chuva Intensa
- [ ] Seca Prolongada
- [ ] Geada

### 4.4 escolas.json
```json
[
  {
    "id": "ESC001",
    "nome": "EMEF Prof. Maria Aparecida",
    "localizacao": {
      "latitude": -23.5489,
      "longitude": -46.6388,
      "endereco": "Rua das Flores, 123 - São Paulo - SP"
    },
    "total_alunos": 450,
    "orcamento_mensal": 15000.00,
    "responsavel": {
      "nome": "Ana Paula Souza",
      "cargo": "Diretora",
      "email": "ana.souza@educacao.sp.gov.br"
    }
  }
]
```
**Criar 5 escolas** com:
- [ ] Diferentes tamanhos (200-800 alunos)
- [ ] Orçamentos proporcionais
- [ ] Localizações variadas

### 4.5 pedidos.json
```json
[
  {
    "id": "PED001",
    "escola_id": "ESC001",
    "produtor_id": "PROD001",
    "data_pedido": "2024-12-01",
    "data_entrega": "2024-12-05",
    "status": "Entregue",
    "itens": [
      {
        "produto": "Tomate",
        "quantidade_kg": 50,
        "preco_unitario": 4.50,
        "subtotal": 225.00
      }
    ],
    "total": 225.00,
    "logistica": "Entrega pelo Produtor",
    "avaliacao": {
      "nota": 5,
      "tags": ["Fresco", "No Prazo"],
      "comentario": "Produtos de excelente qualidade!"
    }
  }
]
```
**Criar 20 pedidos históricos** para:
- [ ] Popular dashboard da Secretaria
- [ ] Criar histórico de avaliações
- [ ] Testar filtros e rankings

### 4.6 avaliacoes.json
```json
[
  {
    "id": "AVAL001",
    "pedido_id": "PED001",
    "escola_id": "ESC001",
    "produtor_id": "PROD001",
    "nota": 5,
    "tags": ["Fresco", "No Prazo", "Bem Embalado"],
    "comentario": "Produtos de excelente qualidade!",
    "data": "2024-12-05"
  }
]
```
**Mesmo conteúdo de pedidos.json** (pode ser extraído)

---

## 🎯 5. CRONOGRAMA DETALHADO (48h)

### DIA 1 - SPRINT 1 (0-4h): Setup e Fundação
- [ ] **0-1h**: Criar estrutura de pastas
- [ ] **0-1h**: Configurar `requirements.txt`
- [ ] **0-1h**: Setup `.env` com chave OpenAI
- [ ] **1-3h**: Gerar todos os JSONs mock
- [ ] **1-3h**: Coletar/gerar 10 fotos de perfil (avatares)
- [ ] **3-4h**: Backend básico FastAPI rodando
- [ ] **3-4h**: Endpoints `/agricultores`, `/escolas`, `/login`
- [ ] **3-4h**: Sistema de login mockado

### DIA 1 - SPRINT 2 (4-8h): Perfil Agricultor
- [ ] **4-5h**: Página Streamlit de Onboarding
- [ ] **4-5h**: Integração chatbot OpenAI
- [ ] **4-5h**: Fluxo condicional DAP/CAF
- [ ] **5-6h**: Formulário de cadastro completo
- [ ] **5-6h**: Mapa Folium com outros agricultores
- [ ] **6-7h**: Sistema "Indique um Vizinho"
- [ ] **6-7h**: Badge "Líder Comunitário"
- [ ] **7-8h**: Testes de fluxo
- [ ] **7-8h**: Ajustes visuais (cores, emojis)

### DIA 1 - SPRINT 3 (8-12h): Perfil Escola - Parte 1
- [ ] **8-9h**: Interface Merendômetro
- [ ] **8-9h**: Registro de feedbacks (salvar em JSON)
- [ ] **9-10h**: Integração OpenAI para cardápio
- [ ] **9-10h**: Prompt estruturado + parse resposta
- [ ] **9-10h**: Exibição de sugestão com justificativa
- [ ] **10-11h**: Mapa de busca de produtores
- [ ] **10-11h**: Filtros (categoria, raio)
- [ ] **11-12h**: Algoritmo de relevância
- [ ] **11-12h**: Precificação dinâmica

### DIA 1 - SPRINT 4 (12-16h): Perfil Escola - Parte 2
- [ ] **12-13h**: Carrinho de compras
- [ ] **12-13h**: Seleção de logística
- [ ] **12-13h**: Geração de pedido (salvar JSON)
- [ ] **13-14h**: Botão "Confirmar Recebimento"
- [ ] **13-14h**: Sistema de avaliação (estrelas + tags)
- [ ] **14-15h**: Exportação de relatório PNAE (PDF/Excel)
- [ ] **15-16h**: Alertas climáticos (ler JSON)
- [ ] **15-16h**: Sugestão de ações

### DIA 1 - SPRINT 5 (16-20h): Perfil Secretaria
- [ ] **16-17h**: Dashboard financeiro (Plotly)
- [ ] **16-17h**: Gráfico orçamento vs. meta 30%
- [ ] **17-18h**: Ranking Top 5 Escolas
- [ ] **17-18h**: Ranking Top 5 Agricultores
- [ ] **18-19h**: Tabela de auditoria de qualidade
- [ ] **18-19h**: Filtros (escola, produtor, período)
- [ ] **19-20h**: Geração de QR Code
- [ ] **19-20h**: Página de rastreabilidade

### DIA 2 - SPRINT 6 (20-24h): Polimento Visual
- [ ] **20-21h**: Design System (cores verde + azul)
- [ ] **20-21h**: Padronizar tipografia
- [ ] **21-22h**: Testar responsividade
- [ ] **21-22h**: Ajustar layouts Streamlit
- [ ] **22-23h**: Adicionar animações de transição
- [ ] **22-23h**: Feedbacks visuais (loading, sucesso)
- [ ] **23-24h**: Teste de fluxo completo E2E

### DIA 2 - SPRINT 7 (24-28h): Integração e Testes
- [ ] **24-26h**: Teste fluxo Agricultor completo
- [ ] **24-26h**: Teste fluxo Escola completo
- [ ] **24-26h**: Teste fluxo Secretaria completo
- [ ] **24-26h**: Corrigir bugs críticos
- [ ] **26-28h**: Otimizar performance (lazy loading)
- [ ] **26-28h**: Revisar textos e copywriting
- [ ] **26-28h**: Capturar screenshots de cada tela

### DIA 2 - SPRINT 8 (28-32h): Preparação da Demo
- [ ] **28-29h**: Escrever roteiro de 3 minutos
- [ ] **28-29h**: Definir quem fala o quê
- [ ] **29-30h**: Criar 3-5 slides de apoio
- [ ] **30-31h**: Ensaiar apresentação (cronometrar)
- [ ] **30-31h**: Ajustar narrativa
- [ ] **31-32h**: Deploy Streamlit Cloud ou preparar local
- [ ] **31-32h**: Testar em ambiente de apresentação

### DIA 2 - SPRINT 9 (32-40h): Buffer
- [ ] **32-40h**: Resolver bugs de última hora
- [ ] **32-40h**: Melhorias de UX
- [ ] **32-40h**: Descanso da equipe
- [ ] **32-40h**: Refinamento final

### DIA 2 - SPRINT 10 (40-48h): Apresentação
- [ ] **40-48h**: Últimos ajustes
- [ ] **40-48h**: Apresentação para o júri
- [ ] **40-48h**: Q&A

---

## 🎬 6. ROTEIRO DE DEMONSTRAÇÃO (3 MIN)

### Minuto 1: Contexto (30s)
- [ ] Falar sobre os 3 problemas (desperdício, falta de transparência, dificuldade de encontrar produtores)
- [ ] Apresentar AgroMerenda como solução

### Minuto 2: Demo - Cena 1 - Escola (45s)
- [ ] Login como Diretora
- [ ] Abrir Merendômetro → mostrar rejeição à beterraba
- [ ] Clicar "Sugerir Cardápio com IA"
- [ ] IA sugere cenoura (mesma vitamina, 15% mais barata)
- [ ] Abrir Mapa → filtrar cenoura
- [ ] Selecionar João da Silva (4.8⭐, 5km)
- [ ] Fazer pedido (50kg) → escolher "Entrega pelo Produtor"

### Minuto 2: Demo - Cena 2 - Agricultor (30s)
- [ ] Login como João da Silva
- [ ] Mostrar notificação de novo pedido
- [ ] Confirmar entrega
- [ ] Mostrar Mapa da Vizinhança (5 outros agricultores)

### Minuto 2: Demo - Cena 3 - Secretaria (45s)
- [ ] Login como Secretaria
- [ ] Dashboard: 32% em agricultura familiar ✅
- [ ] Top Escola: EMEF Maria Aparecida (12 pedidos)
- [ ] Top Produtor: João da Silva (4.8⭐, 15 entregas)
- [ ] Rastreabilidade: escanear QR Code
- [ ] Mostrar: foto de João, localização do sítio, data da colheita

### Minuto 3: Impacto (30s)
- [ ] Resumir: IA reduz desperdício, geolocalização conecta localmente, transparência total
- [ ] Mensagem final: plataforma simples, acessível até em celulares básicos

---

## 🎨 7. ELEMENTOS "WOW FACTOR"

- [ ] **IA Explicável**: Mostrar raciocínio da sugestão de cardápio
- [ ] **Mapa Animado**: Transição suave ao filtrar produtores
- [ ] **QR Code ao Vivo**: Gerar e "escanear" durante a demo
- [ ] **Dashboard Dinâmico**: Gráficos Plotly com animações
- [ ] **Gamificação Visível**: Badge "Líder Comunitário" em destaque

---

## 📚 8. DEPENDÊNCIAS PYTHON

```txt
fastapi==0.104.1
uvicorn==0.24.0
streamlit==1.28.0
openai==1.3.0
pydantic==2.5.0
folium==0.15.0
streamlit-folium==0.15.0
plotly==5.18.0
qrcode==7.4.2
Pillow==10.1.0
python-dotenv==1.0.0
reportlab==4.0.7
openpyxl==3.1.2
```

---

## 🚨 9. RISCOS E MITIGAÇÕES

| Risco | Mitigação |
|-------|-----------|
| ⚠️ API OpenAI instável | Ter respostas mockadas como fallback |
| ⚠️ Streamlit lento | Lazy loading de JSONs, cache |
| ⚠️ Bugs de última hora | 8h de buffer (Sprint 9) |
| ⚠️ Demo > 3min | Ensaiar 3x cronometrando |
| ⚠️ Internet cair na apresentação | Rodar local + screenshots backup |

---

## ✅ 10. CHECKLIST PRÉ-APRESENTAÇÃO

### Funcionalidades
- [ ] Login funcionando para 3 perfis
- [ ] Agricultor: onboarding + cadastro + mapa vizinhança
- [ ] Escola: merendômetro + IA + busca + pedido + avaliação + alertas
- [ ] Secretaria: dashboard + rankings + auditoria + QR Code

### Dados
- [ ] 10 produtores realistas
- [ ] 5 escolas com orçamentos
- [ ] 20 produtos em safra
- [ ] 20 pedidos históricos
- [ ] 3 alertas climáticos

### Visual
- [ ] Design consistente (verde + azul)
- [ ] Emojis e ícones temáticos
- [ ] Animações suaves
- [ ] Responsivo

### Técnico
- [ ] IA OpenAI respondendo
- [ ] Mapa carregando < 2s
- [ ] QR Code gerando corretamente
- [ ] Gráficos Plotly funcionando
- [ ] Nenhum erro no console

### Apresentação
- [ ] Roteiro escrito e ensaiado
- [ ] Tempo exato: 3 minutos
- [ ] Screenshots de backup
- [ ] Slides de apoio (opcional)

---

## 🎯 11. PROMPTS OPENAI SUGERIDOS

### Para Sugestão de Cardápio
```
Você é um nutricionista especializado em merenda escolar.

Contexto: Alunos da EMEF rejeitaram {alimento_rejeitado}.
Safra atual disponível: {lista_safra}.

Tarefa: Sugira um alimento substituto que seja:
1. Nutricionalmente equivalente (mesmas vitaminas/minerais principais)
2. Esteja na safra atual (mais barato e fresco)
3. Tenha boa aceitação entre crianças de 6-12 anos

Responda em formato JSON:
{
  "substituto": "nome do alimento",
  "justificativa": "explicação em 1 frase sobre nutrição e preço",
  "economia_estimada": "percentual de economia"
}
```

### Para Onboarding Agricultor
```
Você é um assistente amigável que ajuda agricultores familiares a se cadastrarem no PNAE.

Pergunte ao usuário: "Olá! Você já possui DAP (Declaração de Aptidão ao PRONAF) ou CAF (Cadastro Nacional da Agricultura Familiar) ativa?"

Se a resposta for NÃO:
- Forneça um passo-a-passo simples de como obter o documento
- Indique o órgão responsável mais próximo em {cidade}
- Use linguagem acessível e empática
- Incentive o agricultor

Se a resposta for SIM:
- Peça o número do documento ou foto para validação
- Parabenize pela iniciativa
```

---

## 📝 12. NOTAS IMPORTANTES

1. **MOCK DATA É PRIORIDADE**: Não perder tempo com APIs reais do governo
2. **VISUAL PRIMEIRO**: Interface impactante > lógica perfeita
3. **IA DEVE SER VISÍVEL**: Mostrar quando e como a IA está atuando
4. **NARRATIVA CLARA**: Problema → Solução → Impacto
5. **TEMPO É CURTO**: Foco no MVP, não em features extras
6. **TESTES CONSTANTES**: Testar cada componente ao criar
7. **COMMITS FREQUENTES**: Salvar progresso a cada hora
8. **COMUNICAÇÃO**: Daily de 15min a cada 8h de trabalho

---

## 🎓 13. DIVISÃO DE RESPONSABILIDADES SUGERIDA

### Dev 1 - Backend + Lógica
- FastAPI completo
- Schemas Pydantic
- Algoritmos (matchmaking, precificação)
- Geolocalização

### Dev 2 - Frontend + UX
- Streamlit (todas as páginas)
- Componentes visuais
- Mapa Folium
- Design System

### Dev 3 - IA + Apresentação
- Integração OpenAI
- QR Codes
- Dashboard Plotly
- Roteiro de demo

---

**BOA SORTE NO HACKATHON! 🚀🌾**

*Documento criado em: Dezembro 2025*
*Válido para: AgroMerenda MVP - 48h*
