# 📘 Manual de Marca: Conecta Merenda
> **Versão:** 1.0
> **Data:** Dezembro 2025
> **Projeto:** Webapp de Gestão PNAE

---

## 1. Manifesto da Marca
O **Conecta Merenda** não é apenas um software de compras governamentais; é a ponte entre o campo e o prato da criança. A nossa missão é remover a frieza da burocracia e trazer a cor e a alegria de uma alimentação saudável para dentro da gestão pública.

### A Nossa Personalidade
* **Amigável, mas Eficiente:** Somos acessíveis como um desenho animado, mas funcionais como uma folha de cálculo bem feita.
* **Orgânico:** Nada de cantos vivos ou cinzento corporativo. Tudo é arredondado, colorido e vivo.
* **Transparente:** Comunicação clara, letras grandes e processos óbvios.

---

## 2. O Logo
O nosso logo é um selo de qualidade e alegria. Representa a união de vegetais frescos com sorrisos.

### Área de Respiro
O logo deve ter uma margem de segurança equivalente à altura da letra "C" de *Conecta* em todos os lados. Nenhum outro elemento gráfico deve invadir esse espaço.

### Usos Proibidos 🚫
* Não remover os rostos dos vegetais.
* Não aplicar sombras realistas (*drop shadow*) no logo.
* Não distorcer ou "esticar" o logo.
* Não usar sobre fundos vibrantes que prejudiquem a leitura (use a versão monocromática branca).

---

## 3. Paleta de Cores
As nossas cores são inspiradas na horta. São saturadas, alegres e de alto contraste.

### Cores Institucionais
| Cor | Hex | Uso Principal |
| :--- | :--- | :--- |
| 🟢 **Verde Conecta** | `#0B4F35` | **Cor Primária.** Textos principais, Bordas (Strokes), Botões de ação. |
| 📜 **Creme Papel** | `#FFFDF5` | **Cor de Fundo.** Substituto do branco puro. Tom quente e acolhedor. |

### Cores de Apoio (Os Vegetais)
* 🔴 **Vermelho Tomate:** `#E04F38` (Erros, Cancelamentos)
* 🟠 **Laranja Cenoura:** `#F47C20` (Alertas, Pendências)
* 🌱 **Verde Brócolos:** `#9BC53D` (Sucesso, Destaques)
* 🟡 **Amarelo Pimentão:** `#FCCE38` (Informações, Favoritos)

### Regra de Contraste
Para textos sobre fundos coloridos, use sempre **Branco** ou **Verde Conecta**. Nunca use cinzento.

---

## 4. Tipografia
A tipografia reflete o estilo "arredondado" e acessível da marca.

### Títulos (H1, H2, H3)
* **Fonte:** [Nunito](https://fonts.google.com/specimen/Nunito)
* **Peso:** 800 (ExtraBold) ou 900 (Black).
* **Estilo:** Sempre em **Verde Conecta** (`#0B4F35`).
* **Aplicação:** Cabeçalhos de página, *Hero sections*, Modais.

### Corpo de Texto
* **Fonte:** [Nunito](https://fonts.google.com/specimen/Nunito) (Interface geral) ou [Inter](https://fonts.google.com/specimen/Inter) (Tabelas densas).
* **Peso:** 500 (Medium) para leitura e 700 (Bold) para destaque.
* **Cor:** Preto Suave (`#1A1A1A`) ou Cinzento Escuro (`#333333`).

---

## 5. Estilo de Ilustração e Iconografia (Cartoon Outline)
A identidade visual aposta num estilo de desenho animado "flat".

1.  **Traço Grosso (Thick Stroke):** Elementos principais têm um contorno **Verde Conecta** (`#0B4F35`) com espessura entre `2px` e `4px`.
2.  **Cores Chapadas:** Preenchimento sólido, sem degradés complexos.
3.  **Humanização:** Vegetais, camiões e documentos podem ter rostos simples (olhos pontilhados e sorrisos curvos).

---

## 6. UI Design (Interface do Utilizador)
A interface deve parecer tátil e macia.

### Botões e CTAs
* **Formato:** Pílula completa (`border-radius: 50px`) ou Retângulos arredondados (`border-radius: 16px`).
* **Estilo:** Flat com borda grossa e definida.
* **Interação:** Ao passar o rato (*hover*), o botão move-se ligeiramente ou muda de cor, mantendo a borda visível.

### Cards e Painéis
* **Bordas:** Grossas (`2px` ou `3px`) na cor `#0B4F35`.
* **Sombra Sólida (Hard Shadow):** Sombra deslocada sem desfoque (*blur*), criando efeito de "recorte de papel" ou autocolante.
    * *Exemplo:* `box-shadow: 4px 4px 0px #0B4F35;`

### Inputs (Campos de Texto)
* Fundo branco, borda grossa, cantos arredondados.
* **Foco:** A borda muda para **Laranja Cenoura** ou **Verde Brócolos**.

---

## 7. Tom de Voz
* **Incentivador:** "Oba! Cadastrou 3 novos produtos da agricultura familiar."
* **Didático:** "Para receber o pagamento, precisamos da nota fiscal. Pode enviar uma foto?"
* **Claro:** Evite siglas técnicas sem explicação prévia.

---

## 8. Snippet CSS (Variaveis Globais)

Copie este bloco para o ficheiro CSS principal do projeto:

```css
:root {
  /* --- Cores Institucionais --- */
  --c-stroke: #0B4F35;    /* Cor da borda grossa e textos */
  --c-bg: #FFFDF5;        /* Fundo creme */
  --c-surface: #FFFFFF;   /* Branco puro */
  
  /* --- Cores de Ação --- */
  --c-primary: #9BC53D;   /* Verde Claro */
  --c-accent: #F47C20;    /* Laranja */
  --c-danger: #E04F38;    /* Vermelho */
  
  /* --- Estilização Cartoon --- */
  --border-thick: 3px solid var(--c-stroke);
  --shadow-hard: 4px 4px 0px var(--c-stroke);
  --shadow-hard-hover: 6px 6px 0px var(--c-stroke);
  
  /* --- Arredondamento --- */
  --radius-card: 24px;
  --radius-btn: 50px;
  --radius-input: 12px;
  
  /* --- Tipografia --- */
  --font-display: 'Nunito', sans-serif;
  --font-body: 'Inter', sans-serif;
}

/* Classe utilitária para Cards */
.card-conecta {
  background: var(--c-surface);