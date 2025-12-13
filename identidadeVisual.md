# Manual de Identidade Visual - Conecta Merenda
> **Projeto:** Webapp de gestão de compras PNAE (Programa Nacional de Alimentação Escolar)
> **Versão:** 1.0

## 1. Conceito e Propósito
A identidade visual busca equilibrar a **ludicidade** do ambiente escolar (alimentos frescos, crianças) com a **eficiência** necessária para uma ferramenta de gestão pública.

* **Pilares:** Conexão, Frescor, Transparência e Facilidade.
* **Vibe:** O sistema deve ser limpo, orgânico e inspirar saúde, fugindo da estética burocrática tradicional.

---

## 2. Paleta de Cores
As cores foram extraídas do logo e adaptadas para garantir acessibilidade e hierarquia na interface (UI).

### Cores Primárias (Identidade)
| Cor | Nome | Hex | Aplicação |
| :--- | :--- | :--- | :--- |
| 🟢 | **Verde Conecta** | `#0B4F35` | **Cor Principal.** Cabeçalhos, menus laterais, textos de destaque, botões primários. Transmite confiança. |
| 🌱 | **Verde Merenda** | `#9BC53D` | **Cor de Apoio.** Detalhes, ícones ativos, estados de "sucesso". Transmite frescor. |

### Cores Secundárias (Feedback & Ações)
* 🔴 **Vermelho Tomate** (`#E04F38`): Botões de cancelar, alertas de erro, estoque crítico.
* 🟠 **Laranja Cenoura** (`#F47C20`): Status "Pendente", "Em trânsito", chamadas de atenção.
* 🟡 **Amarelo Pimentão** (`#FCCE38`): Avisos, notas, ícones de favoritos/destaque.

### Cores Neutras (Estrutura)
* ⚪ **Off-White** (`#F4F7F5`): Fundo geral do sistema. Um branco levemente esverdeado/acinzentado para não cansar a vista.
* ⚫ **Texto Principal** (`#1A1A1A`): Preto suave para leitura.
* ⚪ **Surface** (`#FFFFFF`): Branco puro, usado apenas no fundo de Cards e Modais.

---

## 3. Tipografia
A combinação busca legibilidade em tabelas de dados sem perder a amabilidade da marca.

### Títulos e Cabeçalhos
* **Fonte:** [Nunito](https://fonts.google.com/specimen/Nunito)
* **Estilo:** Arredondada (Rounded).
* **Pesos:** Bold (700) e ExtraBold (800).
* **Uso:** Títulos de páginas, Modais, Marketing.

### Corpo de Texto e Dados
* **Fonte:** [Inter](https://fonts.google.com/specimen/Inter) (ou Lato)
* **Estilo:** Sans-serif moderna e legível.
* **Pesos:** Regular (400) e Semi-bold (600).
* **Uso:** Tabelas, formulários, botões, parágrafos.

---

## 4. Elementos de Interface (UI)

### Botões e Inputs
* **Bordas:** Arredondadas. Use `border-radius: 8px` para inputs e `50px` (pílula) para botões de ação principal.
* **Botão Primário:** Fundo `#0B4F35` + Texto Branco.
* **Botão Secundário:** Borda `#0B4F35` + Fundo Transparente.

### Cards e Containers
* Estilo "Clean" sobre fundo Off-White.
* Fundo Branco (`#FFFFFF`) com sombra suave (`box-shadow: 0 4px 12px rgba(0,0,0,0.05)`).
* Padding generoso para dar respiro às informações.

### Ícones
* Estilo **Outline** (contorno) com traços arredondados.
* Espessura do traço: 1.5px ou 2px.

---

## 5. Uso dos Mascotes
Os vegetais do logo (Tomate, Cenoura, Brócolis, Pimentão) devem ser usados para humanizar o sistema em momentos de feedback:

* **Sucesso:** Tomate sorrindo (ex: "Pedido enviado!").
* **Busca Vazia:** Brócolis com uma lupa (ex: "Nenhum edital encontrado").
* **Atenção:** Pimentão acenando (ex: "Novos fornecedores cadastrados").

---

## 6. Tom de Voz (UX Writing)
* **Direto, mas acolhedor.**
* Evite "burocratês".
* *De:* "Executar Aquisição via Chamada Pública" -> *Para:* "Iniciar Compra".
* *De:* "Indivíduo Fornecedor" -> *Para:* "Agricultor" ou "Produtor".

---

## 7. Variáveis CSS (Developer Handoff)

Copie e cole este bloco no arquivo `:root` do CSS global:

```css
:root {
  /* --- Cores da Marca --- */
  --color-primary: #0B4F35;      /* Verde Escuro */
  --color-secondary: #9BC53D;    /* Verde Lima */
  
  /* --- Cores de Feedback --- */
  --color-accent: #F47C20;       /* Laranja Cenoura */
  --color-danger: #E04F38;       /* Vermelho Tomate */
  --color-warning: #FCCE38;      /* Amarelo Pimentão */
  --color-success: #2E7D32;      /* Verde Sucesso Padrão */
  
  /* --- Cores Neutras & Estrutura --- */
  --color-bg: #F4F7F5;           /* Off-white fundo */
  --color-surface: #FFFFFF;      /* Branco cards */
  --color-text-main: #1A1A1A;    /* Preto suave */
  --color-text-muted: #666666;   /* Cinza legendas */
  --color-border: #E0E0E0;       /* Cinza bordas */

  /* --- Tipografia --- */
  --font-display: 'Nunito', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* --- Espaçamento e Bordas --- */
  --radius-sm: 8px;              /* Inputs e Cards pequenos */
  --radius-md: 16px;             /* Cards grandes */
  --radius-pill: 50px;           /* Botões */
  --shadow-soft: 0 4px 12px rgba(0,0,0,0.05);
}