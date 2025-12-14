# 🚀 Task List Mestra: AgroMerenda MVP (48h)

**Objetivo:** Entregar um MVP funcional com 3 perfis (Agricultor, Escola, Secretaria) usando Mock Data e IA. Use este documento para acompanhar o progresso.

---

## 🟢 FASE 0: Fundação & Dados (Prioridade Máxima)
*Sem isso, nada roda. O foco é criar os "falsos bancos de dados" e a estrutura.*

### 0.1 Setup do Ambiente
- [ ] **Criar Estrutura de Pastas:** Reproduzir exatamente a árvore de diretórios (`backend/`, `frontend/`, `data/`, `assets/`).
- [ ] **Dependências:** Criar `requirements.txt` com as libs listadas (`fastapi`, `streamlit`, `openai`, `folium`, `plotly`, `qrcode`, `reportlab`).
- [ ] **Variáveis de Ambiente:** Criar `.env` e configurar a `OPENAI_API_KEY`.
- [ ] **Repositório:** Dar `git init` e subir o esqueleto inicial.

### 0.2 Criação do Mock Data (JSONs)
*Atenção: Os dados devem parecer reais para a demo.*
- [ ] **`produtores.json`:** Criar 10 produtores variados (com e sem DAP, diferentes localizações num raio de 100km, avaliações entre 3.5 e 5.0).
- [ ] **`safra_regional.json`:** Criar calendário de safra (ex: Dezembro/Sudeste) com pelo menos 20 produtos (Hortaliças, Frutas, Proteínas) e dados nutricionais.
- [ ] **`clima_previsao.json`:** Criar 3 alertas climáticos (ex: Chuva Intensa, Seca) com severidade e recomendação.
- [ ] **`escolas.json`:** Criar 5 escolas com coordenadas geográficas, total de alunos e orçamento mensal.
- [ ] **`pedidos.json` & `avaliacoes.json`:** Criar histórico de 20 pedidos passados para popular os dashboards da Secretaria.
- [ ] **Assets:** Baixar 10 fotos genéricas de "agricultores" e "plantações" para salvar em `assets/images/`.

---

## 🟡 FASE 1: Backend (FastAPI)
*A lógica que conecta o Frontend aos dados JSON.*

### 1.1 Core API
- [ ] **Setup FastAPI:** Criar `app.py` básico rodando com Uvicorn.
- [ ] **Auth Router (`routers/auth.py`):** Criar endpoint de login simulado que retorna o perfil do usuário (Agricultor, Escola ou Secretaria).

### 1.2 Endpoints de Dados (Leitura de JSON)
- [ ] **Agricultores:** Endpoint `GET /agricultores` que lê o JSON e aceita filtros de distância.
- [ ] **Escolas/Pedidos:** Endpoint `POST /pedido` que salva um novo pedido no JSON e `POST /avaliacao` para salvar notas.
- [ ] **Dashboard:** Endpoint `GET /dashboard-data` que agrega os dados para a Secretaria.

### 1.3 Serviços Inteligentes
- [ ] **Geolocalização (`services/geolocation.py`):** Implementar função Haversine para calcular distância entre escola e produtor.
- [ ] **Algoritmo de Match (`services/geolocation.py`):** Implementar a fórmula de score: `(0.6 * distância) + (0.4 * nota_media)`.
- [ ] **IA Cardápio (`services/ia_cardapio.py`):** Criar função que chama a API da OpenAI com o prompt estruturado de sugestão de substituição alimentar.

---

## 🚜 FASE 2: Frontend - Perfil Agricultor
*Foco: Acessibilidade e Onboarding.*

- [ ] **Login:** Botão simples "Sou Agricultor".
- [ ] **Chatbot de Onboarding:**
    - [ ] Criar interface de chat.
    - [ ] Implementar fluxo condicional: Pergunta DAP/CAF -> Se não, mostra tutorial; Se sim, pede foto.
- [ ] **Cadastro Simplificado:** Formulário para nome, local (GPS simulado) e produtos.
- [ ] **Mapa da Vizinhança:** Usar `folium` para mostrar outros produtores próximos (Prova Social).
- [ ] **Gamificação:** Implementar visualização de badge "Líder Comunitário" e contador de indicações "Indique um Vizinho".

---

## 🏫 FASE 3: Frontend - Perfil Escola (O Core)
*Foco: Funcionalidade, IA e Compra.*

### 3.1 Inteligência
- [ ] **Merendômetro:** Criar componente visual para input de feedback (👍/👎) sobre o cardápio anterior.
- [ ] **Sugestão IA:** Botão que aciona o serviço de IA. Deve mostrar: Alimento Substituto, Justificativa e Economia.
- [ ] **Alertas Climáticos:** Banner no topo da página lendo `clima_previsao.json` com recomendações.

### 3.2 Marketplace e Compra
- [ ] **Busca de Produtores:** Mapa interativo com filtros (Raio, Categoria). Cards devem mostrar precificação dinâmica (desconto por proximidade).
- [ ] **Checkout:** Carrinho de compras onde a diretora define a logística ("Entrega pelo Produtor" ou "Retirada").
- [ ] **Pós-Entrega:** Tela para "Confirmar Recebimento" e dar nota (Estrelas + Tags).

### 3.3 Compliance
- [ ] **Relatórios:** Botão que gera um PDF simples (mockado usando `reportlab`) com os dados da compra para prestação de contas PNAE.

---

## 🏛️ FASE 4: Frontend - Perfil Secretaria
*Foco: Auditoria e Visualização.*

- [ ] **Dashboard Financeiro:** Gráficos Plotly mostrando "Gasto Total" vs "Meta 30% Agricultura Familiar".
- [ ] **Rankings:** Tabelas de "Top 5 Escolas" e "Top 5 Agricultores".
- [ ] **Auditoria:** Lista filtrável de avaliações, destacando notas baixas.
- [ ] **Rastreabilidade:**
    - [ ] Implementar gerador de QR Code (`services/qrcode_gen.py`).
    - [ ] Tela que simula o scan e mostra a "ficha técnica" do produtor e da entrega.

---

## 🎨 FASE 5: Polimento & Demo (Apresentação)
*Foco: UX e Wow Factor.*

- [ ] **Design System:** Padronizar cores (Verde para Agricultor, Azul para Governo) e tipografia.
- [ ] **Feedback Visual:** Adicionar *spinners* de carregamento quando a IA estiver "pensando" e mensagens de sucesso ("Pedido Confirmado!").
- [ ] **IA Explicável:** Garantir que o texto da IA explique *por que* sugeriu aquela troca (ex: "Mesma vitamina, 15% mais barato").
- [ ] **Roteiro de Teste:** Rodar o fluxo completo: Escola dá feedback negativo -> IA sugere troca -> Escola compra do vizinho -> Secretaria vê o dado no painel.

---

### 🆘 Cheat Sheet: Lógica de Negócio (Para consulta rápida)

* **Fórmula de Match:** `Score = (0.6 / distancia) + (0.4 * nota_media)`.
* **Desconto Proximidade:** Se distância < 50km, `desconto = (50 - distancia) / 2` (Máx 20%).
* **Meta PNAE:** O dashboard deve sempre comparar o gasto atual com **30%** do orçamento total.