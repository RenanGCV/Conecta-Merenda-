# 📁 CONTEXTO DO PROJETO: AgroMerenda (Hackathon MVP)

**ATENÇÃO LLM:** Este documento serve de contexto base para que você atue como nosso **Tech Lead e Product Manager**. Leia atentamente as especificações abaixo para gerar o Plano de Ação solicitado ao final.

---

## 1. O Objetivo
Desenvolver, em **48 horas**, um MVP (Mínimo Produto Viável) da plataforma **AgroMerenda**. O objetivo é apresentar uma **Prova de Conceito (PoC)** funcional para um júri, simulando uma operação real com dados fictícios (Mock Data).

**Filosofia de Desenvolvimento:** "Vibecoding". Foco em velocidade, interfaces visuais impactantes e lógica de negócio clara. Não perderemos tempo com infraestrutura complexa ou integrações reais de APIs que demoram para configurar.

---

## 2. O Problema (Dores Resolvidas)
1.  **Desconexão Pedagógica:** A compra de merenda ignora a preferência dos alunos, gerando desperdício (o "prato cheio que vai para o lixo").
2.  **Caixa Preta da Qualidade:** A Secretaria de Educação (quem paga) não recebe feedback sobre a qualidade real dos alimentos entregues nas escolas.
3.  **Burocracia e Logística:** Dificuldade de encontrar agricultores locais (Cadeia Curta) e formalizar a compra exigida pelo PNAE (30% agricultura familiar).
4. **Burocracia de Cadastro** Dificuldade dos agricultores familiares de se cadastrar no PNAE e Declaração de Aptidão ao PRONAF (DAP) física ou jurídica, ou o novo Cadastro Nacional da Agricultura Familiar (CAF).

---

## 3. A Solução: AgroMerenda
Uma plataforma integrada que conecta **Agricultores Familiares**, **Escolas** e a **Secretaria de Educação**, utilizando IA e Geolocalização para otimizar a compra pública.

### 🛠️ Funcionalidades Chave (Escopo do MVP)

#### A. Módulo de Planejamento (Pré-Compra)
* **Merendômetro (Feedback dos Professores):** Interface simples onde professores registram a aceitação do cardápio anterior (Ex: "Rejeição alta à Beterraba").
* **Inteligência de Cardápio:** O sistema cruza o feedback (alunos não gostam de X) com a safra atual (o que está barato). Se rejeitam beterraba, a IA sugere cenoura (nutricionalmente equivalente e na safra).
* **Previsibilidade Climática:** Alertas simulados (baseados em dados históricos do INMET) avisando sobre riscos na colheita que podem afetar a entrega.

#### B. Módulo de Compra (Direção da Escola)
* **Geolocalização e Matchmaker:** Mapa mostrando agricultores aptos num raio curto.
* **Precificação Dinâmica:** O sistema sugere um preço de compra que considera a economia logística (quanto mais perto o produtor, melhor o preço para ambos).
* **Filtro de Disponibilidade:** Mostra apenas produtos que estão na safra (Dados simulados da CONAB).
* **Assistente IA (FAQ):** Chatbot para tirar dúvidas legais sobre o PNAE em tempo real.

#### C. Módulo de Transparência (Pós-Compra)
* **Auditoria de Qualidade:** A escola avalia a entrega (frescor, pontualidade). Esse dado vai para um Dashboard da Secretaria de Educação.
* **Rastreabilidade (QR Code):** Geração de um QR Code que mostra a origem do alimento (foto do produtor) para a comunidade escolar.

---

## 4. Stack Tecnológico & Estratégia de Dados

* **Frontend:** Streamlit (Python) ou React/V0 (para velocidade máxima).
* **Backend:** FastAPI (Python).
* **Inteligência Artificial:** OpenAI API (GPT-4o) para lógica de cardápio e geração de documentos.
* **Dados (CRÍTICO):**
    * **NÃO** faremos integrações reais com APIs do governo (CONAB/INMET) devido à instabilidade e tempo.
    * **USAREMOS MOCK DATA:** Arquivos JSON estáticos simulando:
        * `safra_regional.json` (Calendário de frutas/legumes).
        * `produtores.json` (Lista de agricultores com Lat/Long para o mapa).
        * `clima_previsao.json` (Alertas meteorológicos simulados).
        * `nutricao_alunos.json` (Dados fictícios do SISVAN sobre obesidade/carência).

---

## 5. Solicitação para a LLM (Sua Tarefa Agora)

Com base no contexto acima, atue como um Tech Lead experiente e gere um **PLANO DE AÇÃO TÁTICO** para um time de 3 desenvolvedores entregarem isso em 2 dias.

**A saída deve conter:**

1.  **Estrutura de Pastas e Arquivos:** O esqueleto do projeto (ex: onde ficam os JSONs, onde fica o app.py).
2.  **Modelagem dos Dados (JSON Schema):** Um exemplo da estrutura dos JSONs de `produtores` e `safra` para usarmos de base.
3.  **Roadmap de Desenvolvimento (Hora a Hora):** Divida o trabalho em Sprints de 4 horas focadas em "Features Visuais" para a apresentação.
4.  **Sugestão de "Cena da Demo":** Um roteiro curto de como demonstrar o fluxo completo (do feedback do professor até a auditoria da secretaria) em 3 minutos.

## 6. Sistema de Acesso e Interfaces por Perfil (User Experience)

O sistema deve identificar o tipo de usuário no login e entregar interfaces completamente distintas, adaptadas à realidade de cada ator.

### 🚜 Perfil A: Agricultor (Foco em Acesso e Viralização)
* **Onboarding Guiado por IA:**
    * Ao entrar, um Chatbot (Assistente Virtual) pergunta: *"Você já possui DAP ou CAF ativa?"*
    * **Cenário Sim:** O sistema pede uma foto do documento ou o número para validação (Mockada).
    * **Cenário Não:** A IA fornece um passo-a-passo interativo e simplificado de como obter o registro no órgão mais próximo.
* **Mapa da Vizinhança:** Visualização de outros agricultores cadastrados na região. O objetivo é gerar "prova social" (ver que o vizinho está usando).
* **Gamificação (Growth):** Campanha "Indique um Vizinho". Se o agricultor trouxer outro produtor para a plataforma, ele ganha benefícios (ex: destaque na lista de busca das escolas ou selo de "Líder Comunitário").

### 🏫 Perfil B: Escola/Diretoria (Foco em Compra e Compliance)
* **Busca e Filtragem Inteligente:**
    * Lista de produtores filtrável por tipo de produto (ex: "Hortaliças", "Frutas").
    * **Ordenação Algorítmica:**
        1.  *Por Relevância (Default):* Combinação de Menor Distância + Melhor Avaliação.
        2.  *Por Proximidade:* Apenas distância geográfica.
        3.  *Por Avaliação:* Melhor nota histórica.
* **Definição Logística no Checkout:** No momento da geração do pedido, a diretora deve selecionar a responsabilidade do frete: *"Entrega pelo Produtor"* ou *"Retirada pelo Veículo da Prefeitura"*.
* **Feedback e Fechamento (Pós-Entrega):**
    * Botão de "Confirmar Recebimento".
    * Sistema de Avaliação (1 a 5 estrelas) e tags de qualidade (ex: "Fresco", "No Prazo", "Bem Embalado"). Isso alimenta o algoritmo de relevância.
* **Relatórios Oficiais:** Botão para exportar os relatórios de prestação de contas exigidos pelo PNAE/FNDE com um clique.

### 🏛️ Perfil C: Governo/Secretaria (Foco em Auditoria e BI)
* **Dashboard Financeiro Macro:** Visão total do orçamento gasto vs. meta de 30% da Agricultura Familiar.
* **Rankings e Métricas:**
    * *Top Escolas:* Quais estão comprando mais e melhor.
    * *Top Agricultores:* Quem vende mais e possui melhores notas.
* **Incentivo à Qualidade:** O sistema deve destacar agricultores com avaliações altas, sugerindo-os para compras maiores ou bonificações futuras.