"""
Router de secretaria.
Dashboard, auditoria e gestão de recursos PNAE.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List
import json
from pathlib import Path
from decimal import Decimal

from schemas import (
    DashboardFinanceiroResponse,
    RankingEscola,
    RankingProdutor
)
from routers.auth import verificar_token
from config import settings

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


@router.get(
    "/dashboard-financeiro",
    response_model=DashboardFinanceiroResponse,
    summary="Dashboard financeiro PNAE"
)
async def obter_dashboard_financeiro(token_data: dict = Depends(verificar_token)):
    """
    **📊 Dashboard Financeiro da Secretaria**
    
    Retorna métricas agregadas sobre uso dos recursos PNAE:
    - Gasto total
    - Percentual destinado à agricultura familiar
    - Comparação com meta de 30%
    - Economia gerada
    - Número de escolas e produtores ativos
    
    **Meta PNAE:** Lei 11.947/2009 - Mínimo 30% para agricultura familiar
    """
    # Carregar dados
    pedidos = carregar_json("pedidos.json")
    escolas = carregar_json("escolas.json")
    produtores = carregar_json("produtores.json")
    
    # Calcular totais
    gasto_total = Decimal(0)
    gasto_agricultura_familiar = Decimal(0)
    
    produtores_com_dap = {p["id"]: p["possui_dap"] for p in produtores}
    
    for pedido in pedidos:
        valor = Decimal(str(pedido.get("valor_total", 0)))
        gasto_total += valor
        
        # Verificar se é agricultura familiar (possui DAP)
        produtor_id = pedido.get("produtor_id")
        if produtores_com_dap.get(produtor_id, False):
            gasto_agricultura_familiar += valor
    
    # Calcular percentual
    percentual_af = float((gasto_agricultura_familiar / gasto_total * 100) if gasto_total > 0 else 0)
    
    # Economia estimada (compras diretas economizam ~20% vs intermediários)
    economia_gerada = gasto_total * Decimal("0.20")
    
    # Contar ativos
    escolas_ids_ativas = set(p["escola_id"] for p in pedidos)
    produtores_ids_ativos = set(p["produtor_id"] for p in pedidos)
    
    return {
        "gasto_total": gasto_total,
        "gasto_agricultura_familiar": gasto_agricultura_familiar,
        "percentual_af": round(percentual_af, 2),
        "meta_pnae": settings.pnae_meta_percentage,
        "economia_gerada": economia_gerada,
        "numero_escolas": len(escolas_ids_ativas),
        "numero_produtores_ativos": len(produtores_ids_ativos)
    }


@router.get(
    "/ranking-escolas",
    response_model=List[RankingEscola],
    summary="Ranking de escolas"
)
async def obter_ranking_escolas(
    limite: int = Query(10, ge=1, le=50, description="Número de escolas no ranking"),
    token_data: dict = Depends(verificar_token)
):
    """
    **🏆 Ranking de Escolas**
    
    Lista escolas ordenadas por:
    - Maior percentual de compras da agricultura familiar
    - Maior volume de compras
    
    Útil para identificar escolas modelo e compartilhar boas práticas.
    """
    pedidos = carregar_json("pedidos.json")
    escolas = carregar_json("escolas.json")
    produtores = carregar_json("produtores.json")
    
    produtores_com_dap = {p["id"]: p["possui_dap"] for p in produtores}
    escolas_dict = {e["id"]: e for e in escolas}
    
    # Agregar dados por escola
    stats_escolas = {}
    
    for pedido in pedidos:
        escola_id = pedido["escola_id"]
        valor = Decimal(str(pedido.get("valor_total", 0)))
        
        if escola_id not in stats_escolas:
            stats_escolas[escola_id] = {
                "gasto_total": Decimal(0),
                "gasto_af": Decimal(0),
                "numero_pedidos": 0
            }
        
        stats_escolas[escola_id]["gasto_total"] += valor
        stats_escolas[escola_id]["numero_pedidos"] += 1
        
        # Se for agricultura familiar
        if produtores_com_dap.get(pedido["produtor_id"], False):
            stats_escolas[escola_id]["gasto_af"] += valor
    
    # Criar ranking
    ranking = []
    for escola_id, stats in stats_escolas.items():
        percentual_af = float((stats["gasto_af"] / stats["gasto_total"] * 100) if stats["gasto_total"] > 0 else 0)
        
        ranking.append({
            "escola_id": escola_id,
            "escola_nome": escolas_dict.get(escola_id, {}).get("nome", "Desconhecida"),
            "percentual_af": round(percentual_af, 2),
            "gasto_total": stats["gasto_total"],
            "numero_pedidos": stats["numero_pedidos"]
        })
    
    # Ordenar por percentual AF (decrescente)
    ranking.sort(key=lambda x: x["percentual_af"], reverse=True)
    
    return ranking[:limite]


@router.get(
    "/ranking-produtores",
    response_model=List[RankingProdutor],
    summary="Ranking de produtores"
)
async def obter_ranking_produtores(
    limite: int = Query(10, ge=1, le=50, description="Número de produtores no ranking"),
    token_data: dict = Depends(verificar_token)
):
    """
    **🏆 Ranking de Produtores**
    
    Lista produtores ordenados por:
    - Maior volume de vendas
    - Número de entregas
    - Melhor avaliação
    
    Identifica parceiros mais relevantes do programa.
    """
    pedidos = carregar_json("pedidos.json")
    produtores = carregar_json("produtores.json")
    
    produtores_dict = {p["id"]: p for p in produtores}
    
    # Agregar vendas por produtor
    stats_produtores = {}
    
    for pedido in pedidos:
        produtor_id = pedido["produtor_id"]
        valor = Decimal(str(pedido.get("valor_total", 0)))
        
        if produtor_id not in stats_produtores:
            stats_produtores[produtor_id] = {
                "total_vendas": Decimal(0),
                "numero_entregas": 0
            }
        
        stats_produtores[produtor_id]["total_vendas"] += valor
        stats_produtores[produtor_id]["numero_entregas"] += 1
    
    # Criar ranking
    ranking = []
    for produtor_id, stats in stats_produtores.items():
        produtor = produtores_dict.get(produtor_id, {})
        
        ranking.append({
            "produtor_id": produtor_id,
            "produtor_nome": produtor.get("nome", "Desconhecido"),
            "total_vendas": stats["total_vendas"],
            "numero_entregas": stats["numero_entregas"],
            "avaliacao_media": produtor.get("avaliacao_media", 0)
        })
    
    # Ordenar por total de vendas (decrescente)
    ranking.sort(key=lambda x: float(x["total_vendas"]), reverse=True)
    
    return ranking[:limite]


@router.get("/auditoria/avaliacoes-baixas", summary="Auditoria de avaliações baixas")
async def obter_avaliacoes_baixas(
    nota_maxima: int = Query(3, ge=1, le=5, description="Nota máxima para considerar 'baixa'"),
    token_data: dict = Depends(verificar_token)
):
    """
    **🔍 Auditoria de Avaliações Baixas**
    
    Lista avaliações com notas baixas para investigação.
    Ajuda a identificar problemas de qualidade ou logística.
    """
    avaliacoes = carregar_json("avaliacoes.json")
    pedidos = carregar_json("pedidos.json")
    produtores = carregar_json("produtores.json")
    escolas = carregar_json("escolas.json")
    
    # Criar dicionários para lookup
    pedidos_dict = {p["id"]: p for p in pedidos}
    produtores_dict = {p["id"]: p for p in produtores}
    escolas_dict = {e["id"]: e for e in escolas}
    
    # Filtrar avaliações baixas
    avaliacoes_baixas = [av for av in avaliacoes if av.get("nota", 5) <= nota_maxima]
    
    # Enriquecer com informações
    resultado = []
    for av in avaliacoes_baixas:
        pedido = pedidos_dict.get(av["pedido_id"], {})
        
        resultado.append({
            "avaliacao_id": av["id"],
            "nota": av["nota"],
            "tags": av.get("tags", []),
            "comentario": av.get("comentario", ""),
            "data": av.get("data_avaliacao", ""),
            "escola": escolas_dict.get(av["escola_id"], {}).get("nome", ""),
            "produtor": produtores_dict.get(av["produtor_id"], {}).get("nome", ""),
            "valor_pedido": pedido.get("valor_total", 0)
        })
    
    return {
        "total_avaliacoes_baixas": len(resultado),
        "avaliacoes": resultado
    }


@router.get("/alertas-climaticos", summary="Alertas climáticos ativos")
async def obter_alertas_climaticos():
    """
    **🌦️ Alertas Climáticos**
    
    Retorna alertas climáticos que podem afetar a produção.
    Ajuda no planejamento de compras e gestão de riscos.
    """
    alertas = carregar_json("clima_previsao.json")
    
    return {
        "total_alertas": len(alertas),
        "alertas_ativos": alertas
    }


@router.get("/produtos-safra", summary="Produtos em safra")
async def obter_produtos_safra(mes: str = Query("dezembro_2024", description="Mês/ano da consulta")):
    """
    **🌱 Produtos em Safra**
    
    Lista produtos em safra para o período especificado.
    Recomenda compras mais econômicas e sustentáveis.
    """
    safra = carregar_json("safra_regional.json")
    
    dados_mes = safra.get(mes, {})
    
    if not dados_mes:
        raise HTTPException(status_code=404, detail=f"Dados de safra não encontrados para {mes}")
    
    produtos = dados_mes.get("produtos_safra", [])
    
    # Filtrar apenas os com alta disponibilidade
    produtos_recomendados = [
        p for p in produtos
        if p.get("disponibilidade") == "alta" and p.get("variacao_preco", 0) < 0
    ]
    
    return {
        "mes": mes,
        "regiao": dados_mes.get("regiao"),
        "total_produtos": len(produtos),
        "produtos_recomendados": produtos_recomendados
    }
