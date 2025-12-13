# 🍎 Contexto do Projeto: AgroMerenda AI (School Edition)

**ATENÇÃO LLM:** Você atuará como Tech Lead e Desenvolvedor Fullstack Sênior. Este documento define o escopo de um MVP para Hackathon (48h).

## 1. O Pivot (Mudança de Escopo)
Abandonamos a ideia de marketplace bilateral. O foco agora é um **SaaS B2G (Business-to-Government)** exclusivo para **Gestores Escolares (Diretoras/Nutricionistas)**.
* **Não construiremos** app para o agricultor. O agricultor é apenas um dado no banco.
* **Não construiremos** painel para secretaria.
* **Foco Único:** Ajudar a Escola a comprar melhor, cumprir a lei do PNAE (30% agricultura familiar) e reduzir desperdício usando IA.

## 2. A Dor (Problem Statement)
As escolas desperdiçam dinheiro e comida porque compram itens que os alunos rejeitam ou que estão fora de safra (caros). A burocracia para encontrar produtores locais e montar o pedido trava a verba do PNAE.

## 3. A Solução (Core Features)
Uma plataforma Web onde a Diretora gerencia a alimentação escolar com inteligência.

### A. Painel de Inteligência (Home)
* **Cards de Sugestão (AI):** A IA analisa proativamente os dados e diz: *"Troque Uva por Morango. Motivo: Morango está na safra (30% mais barato) e a aceitação dos alunos é maior."*
* **Merendômetro:** Input rápido de feedback pós-refeição (ex: "Sobrou muita Beterraba hoje").

### B. Compra PNAE (Marketplace)
* **Mapa de Fornecedores:** Visualização de agricultores cadastrados (Mock Data) num raio próximo.
* **Carrinho Automático:** Ao aceitar uma sugestão da IA, o sistema já monta o pedido para os produtores vizinhos.

### C. Transparência (Relatórios)
* **Auditoria Automática:** Gráfico em tempo real mostrando quanto do orçamento foi para Agricultura Familiar.
* **Exportar PDF:** Gera a prestação de contas oficial com um clique.

## 4. Regras de Negócio (Mock Data)
Como é um Hackathon, **não temos usuários reais**.
* O banco de dados deve vir pré-populado (Seed) com:
    * 20 Agricultores fictícios (com geolocalização).
    * Calendário de Safra (Quais frutas dão em Dezembro).
    * Histórico de Preferências dos Alunos (Dados simulados).
* A IA deve consultar esses dados para gerar os insights.

## 5. Tom de Voz da Interface
* Profissional, mas extremamente simples.
* Foco em "Economia Gerada" e "Nutrição".