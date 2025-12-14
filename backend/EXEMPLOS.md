# 📚 Exemplos de Uso da API - Conecta Merenda

Este arquivo contém exemplos práticos de como usar a API.

## 🔐 Autenticação

### Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "escola@email.com",
    "senha": "escola123"
  }'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "perfil": "escola",
  "user_info": {
    "id": "ESC001",
    "nome": "EMEF Prof. João Carlos de Oliveira",
    "email": "escola@email.com"
  }
}
```

> 💡 **Importante:** Use o `access_token` no header `Authorization: Bearer TOKEN` nas próximas requisições.

---

## 🚜 Buscar Produtores Próximos

### Busca Geolocalizada
```bash
curl -X POST "http://localhost:8000/api/v1/agricultores/buscar" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "escola_latitude": -22.7247,
    "escola_longitude": -47.6492,
    "raio_km": 50,
    "apenas_com_dap": true,
    "avaliacao_minima": 4.5
  }'
```

**Resposta:**
```json
[
  {
    "id": "PROD001",
    "nome": "João Silva",
    "nome_propriedade": "Sítio Esperança",
    "possui_dap": true,
    "avaliacao_media": 4.8,
    "distancia_km": 12.5,
    "score_match": 0.184,
    "desconto_proximidade": 18.75,
    "produtos": [
      {
        "nome": "Alface",
        "preco_unitario": 3.50,
        "preco_com_desconto": 2.84
      }
    ]
  }
]
```

---

## 🤖 Sugestão Inteligente de IA

### Pedir Substituição de Cardápio
```bash
curl -X POST "http://localhost:8000/api/v1/escolas/sugestao-ia" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "escola_id": "ESC001",
    "produto_atual": "Uva",
    "motivo_troca": "Baixa aceitação dos alunos e alto custo",
    "restricoes": []
  }'
```

**Resposta:**
```json
{
  "produto_sugerido": "Morango",
  "categoria": "Frutas",
  "justificativa": "Morango está em safra (25% mais barato), tem alta aceitação infantil e mantém valor nutricional similar",
  "beneficios_nutricionais": "Rico em Vitamina C e antioxidantes, similar à uva",
  "economia_estimada_percentual": 25.0,
  "aceitacao_infantil": "Alta",
  "em_safra": true,
  "producoes_disponiveis": [
    {
      "id": "PROD006",
      "nome": "Fernanda Lima",
      "produtos": [
        {
          "nome": "Morango",
          "preco_unitario": 12.00
        }
      ]
    }
  ]
}
```

---

## 🛒 Criar Pedido

### Fazer Compra
```bash
curl -X POST "http://localhost:8000/api/v1/escolas/pedidos" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "escola_id": "ESC001",
    "produtor_id": "PROD001",
    "itens": [
      {
        "produto_nome": "Alface",
        "quantidade": 50,
        "unidade": "maço",
        "preco_unitario": 3.50
      },
      {
        "produto_nome": "Tomate",
        "quantidade": 30,
        "unidade": "kg",
        "preco_unitario": 5.80
      }
    ],
    "tipo_logistica": "entrega",
    "data_entrega_desejada": "2024-12-20",
    "observacoes": "Entrega preferencialmente pela manhã"
  }'
```

**Resposta:**
```json
{
  "id": "PEDABC123",
  "escola_id": "ESC001",
  "produtor_id": "PROD001",
  "valor_total": 349.00,
  "status": "pendente",
  "data_pedido": "2024-12-13 10:30:00"
}
```

---

## ⭐ Avaliar Entrega

### Registrar Avaliação
```bash
curl -X POST "http://localhost:8000/api/v1/escolas/avaliacoes" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pedido_id": "PEDABC123",
    "escola_id": "ESC001",
    "produtor_id": "PROD001",
    "nota": 5,
    "tags": ["Pontual", "Qualidade Excelente", "Produto Fresco"],
    "comentario": "Entrega pontual e produtos de excelente qualidade!"
  }'
```

---

## 📊 Dashboard Secretaria

### Ver Métricas PNAE
```bash
curl -X GET "http://localhost:8000/api/v1/secretaria/dashboard-financeiro" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "gasto_total": 45000.00,
  "gasto_agricultura_familiar": 15750.00,
  "percentual_af": 35.0,
  "meta_pnae": 30.0,
  "economia_gerada": 9000.00,
  "numero_escolas": 5,
  "numero_produtores_ativos": 8
}
```

### Ranking de Escolas
```bash
curl -X GET "http://localhost:8000/api/v1/secretaria/ranking-escolas?limite=5" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📄 Gerar Relatório PDF

### Prestação de Contas
```bash
curl -X POST "http://localhost:8000/api/v1/escolas/relatorios" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pedido_id": "PEDABC123",
    "escola_id": "ESC001"
  }'
```

**Resposta:**
```json
{
  "pedido_id": "PEDABC123",
  "url_pdf": "/relatorios/relatorio_PEDABC123_20241213_103000.pdf",
  "data_geracao": "2024-12-13T10:30:00"
}
```

---

## 🔍 QR Code de Rastreabilidade

### Gerar QR Code
```bash
curl -X GET "http://localhost:8000/api/v1/escolas/pedidos/PEDABC123/qrcode" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "pedido_id": "PEDABC123",
  "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
}
```

> Use a string base64 diretamente em uma tag `<img src="...">` no frontend.

---

## 🌦️ Alertas Climáticos

### Ver Alertas Ativos
```bash
curl -X GET "http://localhost:8000/api/v1/secretaria/alertas-climaticos"
```

**Resposta:**
```json
{
  "total_alertas": 3,
  "alertas_ativos": [
    {
      "id": "ALERTA001",
      "tipo": "Chuva Intensa",
      "severidade": "alta",
      "regiao": "Região de Campinas",
      "impacto_produtos": ["Alface", "Morango"],
      "recomendacao": "Antecipe compras de hortaliças folhosas..."
    }
  ]
}
```

---

## 🍎 Produtos em Safra

### Consultar Safra Regional
```bash
curl -X GET "http://localhost:8000/api/v1/secretaria/produtos-safra?mes=dezembro_2024"
```

---

## 🗺️ Mapa de Produtores

### Obter Dados para Mapa
```bash
curl -X GET "http://localhost:8000/api/v1/dashboard/mapa-produtores"
```

**Resposta:**
```json
{
  "total_produtores": 10,
  "produtores": [
    {
      "id": "PROD001",
      "nome": "João Silva",
      "latitude": -22.7253,
      "longitude": -47.6489,
      "cidade": "Piracicaba",
      "possui_dap": true,
      "avaliacao": 4.8,
      "produtos": ["Alface", "Tomate", "Cenoura"]
    }
  ]
}
```

---

## 💡 Dicas

### Headers Comuns
```bash
-H "Authorization: Bearer SEU_TOKEN_JWT"
-H "Content-Type: application/json"
-H "Accept: application/json"
```

### Filtros Úteis
- `?possui_dap=true` - Apenas produtores com DAP
- `?categoria=Frutas` - Filtrar por categoria
- `?avaliacao_minima=4.5` - Nota mínima
- `?limite=10` - Limitar resultados

### Rate Limiting
- 60 requisições por minuto por IP
- Header de resposta: `X-RateLimit-Remaining`

---

## 🐍 Python (requests)

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/v1/auth/login",
    json={
        "email": "escola@email.com",
        "senha": "escola123"
    }
)
token = response.json()["access_token"]

# Buscar produtores
headers = {"Authorization": f"Bearer {token}"}
produtores = requests.get(
    "http://localhost:8000/api/v1/agricultores/",
    headers=headers
).json()

print(f"Total de produtores: {len(produtores)}")
```

---

## 📖 Documentação Interativa

Acesse http://localhost:8000/docs para testar todos os endpoints diretamente no navegador!
