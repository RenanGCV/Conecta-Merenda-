# 🤖 Sistema de IA Avançado - Conecta Merenda

## 📋 Visão Geral

O sistema foi aprimorado com **Inteligência Artificial avançada** para gestão inteligente de cardápios escolares, focando em:

1. **Balancear** o que as crianças **GOSTAM** com o que elas **PRECISAM**
2. **Reduzir desperdício** através de receitas criativas
3. **Otimizar custos** priorizando produção local
4. **Aprender continuamente** com feedback dos professores

---

## 🎯 Funcionalidades Principais

### 1. **Registro Diário pelos Professores** 👨‍🏫

Professores registram dados após cada refeição:

- ✅ Quantidade servida vs consumida
- 📊 Nível de aceitação (alta/media/baixa)
- 🗑️ Quantidade desperdiçada
- 💬 Observações sobre reação das crianças

**Endpoint:** `POST /api/v1/professores/consumo-diario`

**Exemplo de Registro:**
```json
{
  "escola_id": "ESC001",
  "professor_id": "PROF001",
  "professor_nome": "Maria Silva",
  "data": "2024-12-13",
  "turma": "1º Ano A",
  "total_alunos_presentes": 28,
  "refeicao_tipo": "almoco",
  "itens": [
    {
      "prato_nome": "Arroz com feijão",
      "quantidade_servida": 30,
      "quantidade_consumida": 28,
      "quantidade_desperdicada": 2,
      "nivel_aceitacao": "alta",
      "observacoes": "As crianças adoraram!"
    },
    {
      "prato_nome": "Jiló refogado",
      "quantidade_servida": 30,
      "quantidade_consumida": 8,
      "quantidade_desperdicada": 22,
      "nivel_aceitacao": "baixa",
      "observacoes": "Muitas crianças recusaram, dizendo que era amargo"
    }
  ],
  "comentario_geral": "Refeição balanceada, mas jiló não foi bem aceito"
}
```

**Resposta:**
```json
{
  "id": "REG0001",
  "escola_id": "ESC001",
  "data": "2024-12-13",
  "refeicao_tipo": "almoco",
  "indice_aceitacao": 60.0,
  "indice_desperdicio": 40.0
}
```

---

### 2. **Dashboard Inteligente** 📊

Análise automática dos dados coletados com insights de IA.

**Endpoint:** `GET /api/v1/escolas/dashboard-inteligente/{escola_id}?periodo_dias=30`

**O que o Dashboard Mostra:**

#### Métricas Gerais
- **Índice de Aceitação Geral:** % médio de aceitação de todos os pratos
- **Índice de Desperdício Geral:** % médio de desperdício
- **Score Nutricional Médio:** Qualidade nutricional dos cardápios

#### Top 10 Alimentos Aceitos
```json
{
  "alimento": "Arroz com feijão",
  "score_aceitacao": 9.2,
  "tendencia": "estavel",
  "recomendacao": "Manter no cardápio - alta aceitação"
}
```

#### Top 10 Alimentos Rejeitados
```json
{
  "alimento": "Jiló refogado",
  "score_aceitacao": 2.8,
  "tendencia": "decrescente",
  "recomendacao": "Considerar receitas alternativas ou substituição"
}
```

#### Alertas de Desperdício
Para alimentos com >30% de desperdício:
```json
{
  "alimento": "Jiló refogado",
  "percentual_desperdicio": 73.3,
  "frequencia_servido": 8,
  "sugestao_substituicao": "berinjela ou abobrinha",
  "receitas_alternativas": [
    "Farofa de jiló",
    "Jiló empanado",
    "Jiló recheado"
  ]
}
```

#### Recomendações da IA
```json
"acoes_recomendadas": [
  "Introduzir jiló em farofa bem temperada (disfarça o sabor amargo)",
  "Combinar espinafre com queijo em tortas/bolinhos",
  "Usar beterraba em bolo de chocolate (cor rosa e sabor suave)",
  "Realizar oficina culinária com as crianças",
  "Educar sobre importância nutricional dos alimentos verdes"
]
```

#### Receitas Sugeridas pela IA
```json
"receitas_sugeridas": [
  {
    "nome": "Farofa crocante de jiló",
    "alimento_disfarçado": "jiló",
    "descricao": "Jiló picado muito fino misturado em farofa temperada - o crocante e tempero mascaram o sabor"
  },
  {
    "nome": "Bolinho de espinafre com queijo",
    "alimento_disfarçado": "espinafre",
    "descricao": "Espinafre picado em bolinho frito com queijo derretido - crianças adoram queijo"
  }
]
```

---

### 3. **Geração Automática de Cardápios** 🤖

O sistema **mais importante** - a IA gera cardápios completos automaticamente!

**Endpoint:** `POST /api/v1/escolas/cardapio-automatico`

**Como Funciona:**

#### 🎛️ Sistema de Pesos

A IA balanceia entre **SAÚDE** e **ACEITAÇÃO** através de pesos configuráveis:

```json
{
  "prioridade_nutricao": 7,    // 0-10 (quanto priorizamos saúde)
  "prioridade_aceitacao": 3    // 0-10 (quanto priorizamos preferência)
}
```

**Interpretação:**
- `prioridade_nutricao: 7, prioridade_aceitacao: 3`
  - 70% do peso em saúde, 30% em aceitação
  - Prioriza alimentos nutritivos, mas usa receitas criativas
  
- `prioridade_nutricao: 5, prioridade_aceitacao: 5`
  - 50/50 - equilíbrio perfeito
  
- `prioridade_nutricao: 3, prioridade_aceitacao: 7`
  - 30% saúde, 70% aceitação
  - Foca no que crianças gostam, garante mínimo nutricional

#### 🧠 Estratégias da IA

1. **Análise de Histórico**
   - Identifica alimentos bem aceitos (score > 7)
   - Identifica alimentos rejeitados (score < 5)
   - Analisa padrões de desperdício

2. **Balanceamento Inteligente**
   - **Se nutrição > aceitação:** Foca em saúde, mas usa receitas criativas
   - **Se aceitação > nutrição:** Prioriza preferências, garante mínimo nutricional
   - **Nunca evita completamente** alimentos nutritivos rejeitados!

3. **Receitas "Disfarçadas"**
   - Jiló → Farofa de jiló (não sente o sabor amargo)
   - Espinafre → Bolinho com queijo (queijo mascara o gosto)
   - Beterraba → Bolo de chocolate (cor rosa, sabor suave)
   - Chuchu → Gratinado (coberto com queijo)

4. **Combinações Estratégicas**
   - Alimento rejeitado + Alimento aceito
   - Brócolis + Queijo
   - Fígado + Bacon
   - Espinafre + Lasanha

5. **Variedade de Preparo**
   - Não repetir receitas
   - Variar texturas (cru, cozido, assado, frito, gratinado)
   - Cores variadas (nutrição + visual atraente)

#### 📋 Exemplo de Solicitação

```json
{
  "escola_id": "ESC001",
  "periodo_inicio": "2024-12-16",
  "periodo_fim": "2024-12-20",
  "tipo_refeicao": "almoco",
  "considerar_preferencias": true,
  "prioridade_nutricao": 7,
  "prioridade_aceitacao": 3,
  "restricoes_alergias": ["glúten", "lactose"],
  "orcamento_diario": 5.50
}
```

#### 📊 Exemplo de Resposta

```json
{
  "escola_id": "ESC001",
  "periodo_inicio": "2024-12-16",
  "periodo_fim": "2024-12-20",
  "tipo_refeicao": "almoco",
  "pratos": [
    {
      "dia": 1,
      "nome_prato": "Arroz integral, frango grelhado e farofa de jiló",
      "ingredientes": [
        "Arroz integral",
        "Peito de frango",
        "Jiló picado",
        "Farinha de mandioca",
        "Alho, cebola, cheiro-verde"
      ],
      "valor_nutricional": {
        "calorias": 520,
        "proteinas_g": 28,
        "carboidratos_g": 65,
        "gorduras_g": 12
      },
      "score_aceitacao_previsto": 7.8,
      "custo_estimado": 4.20,
      "producao_local": true,
      "justificativa": "Frango é muito aceito (8.8/10). Jiló disfarçado na farofa crocante - crianças não sentirão o sabor amargo. Arroz integral garante fibras."
    },
    {
      "dia": 2,
      "nome_prato": "Macarrão integral com molho de tomate e bolinho de espinafre",
      "ingredientes": [
        "Macarrão integral",
        "Tomate",
        "Espinafre",
        "Queijo mozzarella",
        "Alho, cebola"
      ],
      "valor_nutricional": {
        "calorias": 480,
        "proteinas_g": 22,
        "carboidratos_g": 68,
        "gorduras_g": 14
      },
      "score_aceitacao_previsto": 8.2,
      "custo_estimado": 3.80,
      "producao_local": true,
      "justificativa": "Macarrão muito aceito (8.5/10). Espinafre rejeitado (3.5/10) é disfarçado em bolinho frito com queijo - o queijo mascara totalmente o gosto e as crianças adoram fritura."
    },
    {
      "dia": 3,
      "nome_prato": "Feijão tropeiro, couve refogada e banana assada",
      "ingredientes": [
        "Feijão",
        "Bacon",
        "Couve",
        "Farinha de milho",
        "Banana",
        "Canela"
      ],
      "valor_nutricional": {
        "calorias": 510,
        "proteinas_g": 20,
        "carboidratos_g": 72,
        "gorduras_g": 15
      },
      "score_aceitacao_previsto": 8.0,
      "custo_estimado": 4.50,
      "producao_local": true,
      "justificativa": "Feijão bem aceito. Couve (hortaliça) servida refogada com bacon para agregar sabor. Banana assada com canela é sobremesa muito aceita (8.9/10) e nutritiva."
    }
  ],
  "resumo_nutricional": {
    "calorias_media": 503,
    "proteinas_media": 23,
    "carboidratos_media": 68,
    "gorduras_media": 13,
    "variedade_grupos": 5
  },
  "custo_total_estimado": 20.50,
  "indice_aceitacao_previsto": 80.0,
  "recomendacoes_ia": [
    "Manter farofa de jiló - é a melhor forma de introduzir este alimento nutritivo",
    "Alternar preparos de hortaliças: refogado, gratinado, em bolinhos",
    "Sempre combinar vegetais menos aceitos com proteínas/queijos que crianças gostam",
    "Envolver alunos no preparo da banana assada - aumenta aceitação",
    "Educação nutricional paralela: explicar benefícios do espinafre (Popeye!)"
  ]
}
```

---

## 🔄 Fluxo Completo do Sistema

```
1. PROFESSOR REGISTRA DADOS
   ↓
   POST /api/v1/professores/consumo-diario
   (O que serviu, quanto foi consumido, quanto desperdiçado, aceitação)
   
2. SISTEMA ACUMULA HISTÓRICO
   ↓
   Armazena em consumo_diario.json
   Analisa padrões ao longo do tempo
   
3. IA ANALISA PADRÕES
   ↓
   GET /api/v1/escolas/dashboard-inteligente/{escola_id}
   - Identifica alimentos aceitos/rejeitados
   - Calcula scores de aceitação
   - Detecta desperdício
   - Gera recomendações
   
4. ESCOLA SOLICITA CARDÁPIO
   ↓
   POST /api/v1/escolas/cardapio-automatico
   Define pesos: prioridade_nutricao vs prioridade_aceitacao
   
5. IA GERA CARDÁPIO OTIMIZADO
   ↓
   - Consulta histórico de preferências
   - Balanceia saúde vs aceitação
   - Usa receitas criativas para alimentos rejeitados
   - Prioriza produção local
   - Respeita orçamento
   
6. ESCOLA EXECUTA CARDÁPIO
   ↓
   Professores continuam registrando dados...
   
7. CICLO SE REPETE
   ↓
   Sistema aprende continuamente! 🔄
```

---

## 💡 Casos de Uso Reais

### Caso 1: Jiló - Alimento Rejeitado mas Nutritivo

**Problema:** 
- Jiló tem score 2.8/10 (muito rejeitado)
- 73% de desperdício
- Rico em fibras, vitaminas A e C

**Solução da IA:**
- ❌ NÃO remove jiló do cardápio (é nutritivo!)
- ✅ Usa "Farofa de jiló picadinho"
- ✅ Combina com bacon/temperos fortes
- ✅ Jiló fica disfarçado e crocante
- 📈 Aceitação sobe para ~7/10

### Caso 2: Espinafre - Ferro Essencial

**Problema:**
- Espinafre 3.5/10 (rejeitado)
- Cor verde escura assusta crianças
- Essencial: ferro, ácido fólico

**Solução da IA:**
- ❌ NÃO serve espinafre refogado simples
- ✅ "Bolinho de espinafre com queijo derretido"
- ✅ Frito = textura crocante que crianças amam
- ✅ Queijo mascara totalmente o gosto
- 📈 Aceitação sobe para ~8/10

### Caso 3: Beterraba - Antioxidantes

**Problema:**
- Beterraba 4/10 (baixa aceitação)
- Cor roxa/sabor terroso
- Rica em ferro, antioxidantes

**Solução da IA:**
- ❌ NÃO serve beterraba cozida
- ✅ "Bolo de chocolate com beterraba"
- ✅ Cor fica rosa (bonito!)
- ✅ Sabor do chocolate domina
- ✅ Crianças nem percebem a beterraba
- 📈 Aceitação: 9/10 (adoram bolo!)

---

## 📈 Benefícios do Sistema

### Para Nutricionistas/Secretaria:
- ✅ Cardápios gerados automaticamente
- ✅ Balanceados nutricionalmente
- ✅ Baseados em dados reais
- ✅ Redução de trabalho manual

### Para Escolas:
- ✅ Maior aceitação dos alunos
- ✅ Menos desperdício
- ✅ Economia de recursos
- ✅ Dados para prestação de contas

### Para Professores:
- ✅ Registro rápido e simples
- ✅ Feedback visível (contribuem para IA)
- ✅ Menos estresse com refeições

### Para Alunos:
- ✅ Comem o que gostam
- ✅ MAS também o que precisam!
- ✅ Receitas criativas e divertidas
- ✅ Melhor saúde e desenvolvimento

---

## 🎓 Princípios do Sistema

### 1. **Nunca Sacrificar Totalmente a Nutrição**
Mesmo com `prioridade_aceitacao = 10`, a IA sempre garante:
- Mínimo de proteínas, vitaminas, minerais
- Variedade de grupos alimentares
- Alimentos integrais quando possível

### 2. **Receitas Criativas > Evitar Alimentos**
Se um alimento é rejeitado mas nutritivo:
- ❌ NÃO remover do cardápio
- ✅ TRANSFORMAR em receita aceita

### 3. **Aprendizado Contínuo**
- Sistema melhora com mais dados
- Mais registros = IA mais precisa
- Padrões sazonais identificados

### 4. **Respeito à Cultura Local**
- Prioriza produtos da safra regional
- Receitas tradicionais adaptadas
- Menor custo, maior frescor

### 5. **Transparência**
- Toda sugestão tem justificativa
- Dados visíveis no dashboard
- Decisões explicáveis

---

## 🛠️ Configuração Recomendada

### Para Creches (2-5 anos):
```json
{
  "prioridade_nutricao": 8,
  "prioridade_aceitacao": 2
}
```
Foco máximo em nutrição (desenvolvimento cerebral crítico)

### Para Ensino Fundamental I (6-10 anos):
```json
{
  "prioridade_nutricao": 7,
  "prioridade_aceitacao": 3
}
```
Equilíbrio com foco em saúde

### Para Ensino Fundamental II (11-14 anos):
```json
{
  "prioridade_nutricao": 6,
  "prioridade_aceitacao": 4
}
```
Mais flexível (adolescentes mais exigentes)

---

## 📞 Endpoints Disponíveis

### Professores
- `POST /api/v1/professores/consumo-diario` - Registrar consumo
- `GET /api/v1/professores/consumo-diario/escola/{escola_id}` - Histórico escola
- `GET /api/v1/professores/consumo-diario/professor/{professor_id}` - Histórico professor

### Escolas (IA)
- `GET /api/v1/escolas/dashboard-inteligente/{escola_id}` - Dashboard com insights
- `POST /api/v1/escolas/cardapio-automatico` - Gerar cardápio automático

---

## 🎉 Resumo

O sistema agora é uma **máquina de aprendizado** que:

1. **Coleta dados** diários dos professores
2. **Aprende** preferências das crianças
3. **Identifica** alimentos rejeitados mas nutritivos
4. **Cria** receitas criativas para "disfarçar" esses alimentos
5. **Gera** cardápios balanceados automaticamente
6. **Otimiza** custos priorizando produção local
7. **Melhora continuamente** com mais dados

**Resultado:** Crianças comem **melhor**, escolas **economizam**, e professores trabalham **menos**! 🎯

---

**Desenvolvido com ❤️ para o PNAE - Alimentando o Futuro do Brasil** 🇧🇷
