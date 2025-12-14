"""
Router de dashboard.
Endpoints consolidados para visualizações e métricas gerais.
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import HTMLResponse
import json
from pathlib import Path
from collections import Counter
from decimal import Decimal

from routers.auth import verificar_token
from services.dashboard_html import gerar_dashboard_html

router = APIRouter()

# Caminho para os dados
DATA_DIR = Path(__file__).parent.parent / "data"


def carregar_json(filename: str) -> list:
    """Carrega arquivo JSON."""
    filepath = DATA_DIR / filename
    if filepath.exists():
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


@router.get("/visao-geral", summary="Visão geral do sistema")
async def obter_visao_geral(token_data: dict = Depends(verificar_token)):
    """
    **📊 Visão Geral do Sistema**
    
    Dashboard consolidado com as principais métricas:
    - Totais de escolas, produtores, pedidos
    - Valores transacionados
    - Status geral do programa
    """
    escolas = carregar_json("escolas.json")
    produtores = carregar_json("produtores.json")
    pedidos = carregar_json("pedidos.json")
    avaliacoes = carregar_json("avaliacoes.json")
    
    # Calcular métricas
    total_transacionado = sum(Decimal(str(p.get("valor_total", 0))) for p in pedidos)
    
    # Status dos pedidos
    status_count = Counter(p.get("status") for p in pedidos)
    
    # Média de avaliações
    if avaliacoes:
        media_avaliacoes = sum(av.get("nota", 0) for av in avaliacoes) / len(avaliacoes)
    else:
        media_avaliacoes = 0
    
    return {
        "totais": {
            "escolas": len(escolas),
            "produtores": len(produtores),
            "pedidos": len(pedidos),
            "avaliacoes": len(avaliacoes)
        },
        "financeiro": {
            "total_transacionado": float(total_transacionado),
            "ticket_medio": float(total_transacionado / len(pedidos)) if pedidos else 0
        },
        "pedidos_por_status": dict(status_count),
        "qualidade": {
            "media_avaliacoes": round(media_avaliacoes, 2),
            "total_avaliacoes": len(avaliacoes)
        }
    }


@router.get("/categorias-mais-compradas", summary="Categorias mais compradas")
async def obter_categorias_mais_compradas(token_data: dict = Depends(verificar_token)):
    """
    **📦 Categorias Mais Compradas**
    
    Análise de quais categorias de produtos são mais demandadas.
    Útil para planejamento de produção.
    """
    pedidos = carregar_json("pedidos.json")
    
    # Contar produtos por categoria
    categorias_count = Counter()
    
    for pedido in pedidos:
        for item in pedido.get("itens", []):
            # Inferir categoria pelo nome do produto (simplificado)
            produto_nome = item.get("produto_nome", "").lower()
            
            if any(x in produto_nome for x in ["alface", "couve", "tomate", "brócolis", "cenoura"]):
                categoria = "Hortaliças"
            elif any(x in produto_nome for x in ["banana", "laranja", "manga", "uva", "morango"]):
                categoria = "Frutas"
            elif any(x in produto_nome for x in ["batata", "mandioca"]):
                categoria = "Tubérculos"
            elif any(x in produto_nome for x in ["ovo", "frango", "carne"]):
                categoria = "Proteínas"
            else:
                categoria = "Outros"
            
            categorias_count[categoria] += float(item.get("quantidade", 0))
    
    return {
        "categorias": [
            {"categoria": cat, "quantidade_total": round(qtd, 2)}
            for cat, qtd in categorias_count.most_common()
        ]
    }


@router.get("/mapa-produtores", summary="Dados para mapa de produtores")
async def obter_dados_mapa_produtores():
    """
    **🗺️ Dados para Mapa de Produtores**
    
    Retorna coordenadas e informações básicas de todos os produtores
    para visualização em mapa interativo (Folium, Leaflet, etc).
    """
    produtores = carregar_json("produtores.json")
    
    dados_mapa = []
    for produtor in produtores:
        loc = produtor.get("localizacao", {})
        dados_mapa.append({
            "id": produtor["id"],
            "nome": produtor["nome"],
            "propriedade": produtor.get("nome_propriedade"),
            "latitude": loc.get("latitude"),
            "longitude": loc.get("longitude"),
            "cidade": loc.get("cidade"),
            "possui_dap": produtor.get("possui_dap"),
            "avaliacao": produtor.get("avaliacao_media"),
            "produtos": [p["nome"] for p in produtor.get("produtos", [])]
        })
    
    return {
        "total_produtores": len(dados_mapa),
        "produtores": dados_mapa
    }


@router.get("/estatisticas-tempo-real", summary="Estatísticas em tempo real")
async def obter_estatisticas_tempo_real(token_data: dict = Depends(verificar_token)):
    """
    **⚡ Estatísticas em Tempo Real**
    
    Métricas atualizadas para monitoramento em dashboards live.
    """
    pedidos = carregar_json("pedidos.json")
    avaliacoes = carregar_json("avaliacoes.json")
    
    # Pedidos recentes (últimos 7 dias - simulado)
    pedidos_recentes = pedidos[-10:] if len(pedidos) > 10 else pedidos
    
    # Avaliações recentes
    avaliacoes_recentes = avaliacoes[-10:] if len(avaliacoes) > 10 else avaliacoes
    
    return {
        "pedidos_recentes": len(pedidos_recentes),
        "valor_pedidos_recentes": sum(float(p.get("valor_total", 0)) for p in pedidos_recentes),
        "avaliacoes_recentes": len(avaliacoes_recentes),
        "media_avaliacoes_recentes": round(
            sum(av.get("nota", 0) for av in avaliacoes_recentes) / len(avaliacoes_recentes), 2
        ) if avaliacoes_recentes else 0,
        "timestamp": "2024-12-13T10:30:00Z"
    }


@router.get("/visual", response_class=HTMLResponse, summary="Dashboard Visual Interativo")
async def dashboard_visual(escola_id: str = "ESC001"):
    """
    🎨 **Dashboard Visual Completo (HTML)**
    
    Interface visual interativa com gráficos em tempo real, SEM precisar de frontend!
    
    **O que você vê:**
    - 📊 Gráficos de aceitação e consumo
    - 🎯 Métricas principais (aceitação, desperdício, nutrição)
    - 🤖 Recomendações inteligentes da IA
    - 💡 Receitas criativas sugeridas
    
    **Como usar:**
    1. Acesse no navegador: `http://localhost:8000/api/v1/dashboard/visual`
    2. Pronto! Dashboard completo renderizado
    
    **Tecnologias:**
    - Chart.js para gráficos interativos
    - CSS moderno com gradientes
    - Responsivo (funciona no mobile)
    - Cores baseadas na identidade visual
    
    Perfeito para apresentações e demonstrações! 🚀
    """
    return gerar_dashboard_html(escola_id)
