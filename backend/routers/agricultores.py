"""
Router de agricultores/produtores.
Gerencia busca e informações de produtores rurais.
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
import json
from pathlib import Path

from schemas import ProdutorResponse, BuscaProdutoresRequest
from services.geolocation import filtrar_por_raio, ordenar_produtores_por_match
from routers.auth import verificar_token

router = APIRouter()

# Caminho para os dados
DATA_DIR = Path(__file__).parent.parent / "data"


def carregar_produtores() -> List[dict]:
    """Carrega lista de produtores do arquivo JSON."""
    with open(DATA_DIR / "produtores.json", "r", encoding="utf-8") as f:
        return json.load(f)


@router.get(
    "/",
    response_model=List[ProdutorResponse],
    summary="Listar todos os produtores"
)
async def listar_produtores(
    possui_dap: Optional[bool] = Query(None, description="Filtrar por DAP"),
    categoria: Optional[str] = Query(None, description="Filtrar por categoria de produto"),
    avaliacao_minima: Optional[float] = Query(None, ge=0, le=5, description="Avaliação mínima"),
    limite: int = Query(50, ge=1, le=100, description="Número máximo de resultados")
):
    """
    Lista todos os produtores cadastrados com filtros opcionais.
    
    **Filtros disponíveis:**
    - `possui_dap`: true/false para filtrar por certificação DAP
    - `categoria`: Hortaliças, Frutas, Tubérculos, Proteínas, Outros
    - `avaliacao_minima`: Nota mínima (0-5)
    - `limite`: Máximo de resultados retornados
    """
    produtores = carregar_produtores()
    
    # Aplicar filtros
    if possui_dap is not None:
        produtores = [p for p in produtores if p["possui_dap"] == possui_dap]
    
    if categoria:
        produtores = [
            p for p in produtores
            if any(prod["categoria"] == categoria for prod in p["produtos"])
        ]
    
    if avaliacao_minima:
        produtores = [p for p in produtores if p["avaliacao_media"] >= avaliacao_minima]
    
    # Limitar resultados
    produtores = produtores[:limite]
    
    return produtores


@router.get(
    "/{produtor_id}",
    response_model=ProdutorResponse,
    summary="Obter detalhes de um produtor"
)
async def obter_produtor(produtor_id: str):
    """
    Retorna informações detalhadas de um produtor específico.
    """
    produtores = carregar_produtores()
    
    produtor = next((p for p in produtores if p["id"] == produtor_id), None)
    
    if not produtor:
        raise HTTPException(
            status_code=404,
            detail=f"Produtor com ID '{produtor_id}' não encontrado"
        )
    
    return produtor


@router.post(
    "/buscar",
    response_model=List[ProdutorResponse],
    summary="Buscar produtores por localização"
)
async def buscar_produtores_proximos(
    params: BuscaProdutoresRequest,
    token_data: dict = Depends(verificar_token)
):
    """
    Busca produtores próximos a uma localização específica.
    
    **Funcionalidades:**
    - Calcula distância usando fórmula de Haversine
    - Aplica score de match (60% proximidade + 40% avaliação)
    - Calcula desconto por proximidade (até 20% para < 50km)
    - Ordena por melhor compatibilidade
    
    **Requer autenticação JWT.**
    """
    produtores = carregar_produtores()
    
    # Filtrar por raio
    produtores_proximos = filtrar_por_raio(
        produtores=produtores,
        escola_lat=params.escola_latitude,
        escola_lon=params.escola_longitude,
        raio_km=params.raio_km
    )
    
    # Aplicar filtros adicionais
    if params.apenas_com_dap:
        produtores_proximos = [p for p in produtores_proximos if p["possui_dap"]]
    
    if params.categoria_produto:
        produtores_proximos = [
            p for p in produtores_proximos
            if any(prod["categoria"] == params.categoria_produto for prod in p["produtos"])
        ]
    
    if params.avaliacao_minima:
        produtores_proximos = [p for p in produtores_proximos if p["avaliacao_media"] >= params.avaliacao_minima]
    
    # Calcular scores e ordenar
    produtores_ordenados = ordenar_produtores_por_match(
        produtores=produtores_proximos,
        escola_lat=params.escola_latitude,
        escola_lon=params.escola_longitude
    )
    
    if not produtores_ordenados:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhum produtor encontrado em um raio de {params.raio_km}km com os critérios especificados"
        )
    
    return produtores_ordenados


@router.get(
    "/{produtor_id}/produtos",
    summary="Listar produtos de um produtor"
)
async def listar_produtos_produtor(produtor_id: str):
    """
    Lista todos os produtos oferecidos por um produtor específico.
    """
    produtores = carregar_produtores()
    produtor = next((p for p in produtores if p["id"] == produtor_id), None)
    
    if not produtor:
        raise HTTPException(
            status_code=404,
            detail=f"Produtor com ID '{produtor_id}' não encontrado"
        )
    
    return {
        "produtor_id": produtor_id,
        "produtor_nome": produtor["nome"],
        "produtos": produtor["produtos"]
    }


@router.get(
    "/{produtor_id}/avaliacoes",
    summary="Obter avaliações de um produtor"
)
async def obter_avaliacoes_produtor(produtor_id: str):
    """
    Retorna o resumo de avaliações de um produtor.
    """
    produtores = carregar_produtores()
    produtor = next((p for p in produtores if p["id"] == produtor_id), None)
    
    if not produtor:
        raise HTTPException(
            status_code=404,
            detail=f"Produtor com ID '{produtor_id}' não encontrado"
        )
    
    # Carregar avaliações detalhadas
    with open(DATA_DIR / "avaliacoes.json", "r", encoding="utf-8") as f:
        todas_avaliacoes = json.load(f)
    
    avaliacoes_produtor = [
        av for av in todas_avaliacoes
        if av.get("produtor_id") == produtor_id
    ]
    
    return {
        "produtor_id": produtor_id,
        "produtor_nome": produtor["nome"],
        "avaliacao_media": produtor["avaliacao_media"],
        "total_avaliacoes": produtor["total_avaliacoes"],
        "avaliacoes_recentes": avaliacoes_produtor[:10]  # Últimas 10
    }
