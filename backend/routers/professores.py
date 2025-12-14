"""
Router para funcionalidades dos Professores.
Registro diário de consumo e desperdício alimentar.
"""
import json
import logging
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pathlib import Path

from schemas import (
    RegistroConsumoDiario,
    RegistroConsumoResponse
)
from routers.auth import verificar_token

router = APIRouter(prefix="/api/v1/professores", tags=["Professores"])
logger = logging.getLogger(__name__)

# Caminho do arquivo de dados
DATA_DIR = Path(__file__).parent.parent / "data"
CONSUMO_FILE = DATA_DIR / "consumo_diario.json"


def _carregar_registros() -> List[dict]:
    """Carrega registros de consumo do arquivo JSON."""
    if not CONSUMO_FILE.exists():
        return []
    with open(CONSUMO_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _salvar_registros(registros: List[dict]):
    """Salva registros no arquivo JSON."""
    with open(CONSUMO_FILE, "w", encoding="utf-8") as f:
        json.dump(registros, f, ensure_ascii=False, indent=2)


@router.post("/consumo-diario", response_model=RegistroConsumoResponse, status_code=status.HTTP_201_CREATED)
def registrar_consumo_diario(
    registro: RegistroConsumoDiario,
    usuario=Depends(verificar_token)
):
    """
    📝 **Registrar consumo diário de refeição**
    
    Permite que professores registrem:
    - Quantidade servida vs consumida
    - Nível de aceitação dos alunos
    - Desperdício observado
    - Observações importantes
    
    Esses dados alimentam a IA para gerar cardápios otimizados!
    
    **Campos importantes:**
    - `nivel_aceitacao`: "alta", "media" ou "baixa"
    - `quantidade_desperdicada`: Porções que sobraram/foram descartadas
    - `observacoes`: Comentários do professor sobre reação das crianças
    """
    try:
        registros = _carregar_registros()
        
        # Gerar ID único
        registro_id = f"REG{len(registros) + 1:04d}"
        
        # Calcular métricas
        total_servido = sum(item.quantidade_servida for item in registro.itens)
        total_consumido = sum(item.quantidade_consumida for item in registro.itens)
        total_desperdicado = sum(item.quantidade_desperdicada for item in registro.itens)
        
        # Índice de aceitação (% do que foi consumido)
        indice_aceitacao = (total_consumido / total_servido * 100) if total_servido > 0 else 0
        
        # Índice de desperdício
        indice_desperdicio = (total_desperdicado / total_servido * 100) if total_servido > 0 else 0
        
        # Criar registro completo
        registro_completo = {
            "id": registro_id,
            "escola_id": registro.escola_id,
            "professor_id": registro.professor_id,
            "professor_nome": registro.professor_nome,
            "data": registro.data,
            "turma": registro.turma,
            "total_alunos_presentes": registro.total_alunos_presentes,
            "refeicao_tipo": registro.refeicao_tipo,
            "itens": [item.model_dump() for item in registro.itens],
            "comentario_geral": registro.comentario_geral,
            "metricas": {
                "total_servido": total_servido,
                "total_consumido": total_consumido,
                "total_desperdicado": total_desperdicado,
                "indice_aceitacao": round(indice_aceitacao, 2),
                "indice_desperdicio": round(indice_desperdicio, 2)
            },
            "criado_em": datetime.now().isoformat()
        }
        
        registros.append(registro_completo)
        _salvar_registros(registros)
        
        logger.info(f"✅ Registro de consumo criado: {registro_id} - Escola: {registro.escola_id}")
        
        return RegistroConsumoResponse(
            id=registro_id,
            escola_id=registro.escola_id,
            data=registro.data,
            refeicao_tipo=registro.refeicao_tipo,
            indice_aceitacao=round(indice_aceitacao, 2),
            indice_desperdicio=round(indice_desperdicio, 2)
        )
        
    except Exception as e:
        logger.error(f"❌ Erro ao registrar consumo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar registro: {str(e)}"
        )


@router.get("/consumo-diario/escola/{escola_id}", response_model=List[dict])
def listar_consumo_escola(
    escola_id: str,
    periodo_dias: int = 30,
    usuario=Depends(verificar_token)
):
    """
    📊 **Listar histórico de consumo de uma escola**
    
    Retorna registros dos últimos N dias para análise.
    """
    try:
        registros = _carregar_registros()
        
        # Filtrar por escola
        registros_escola = [r for r in registros if r["escola_id"] == escola_id]
        
        # Ordenar por data (mais recentes primeiro)
        registros_escola.sort(key=lambda x: x["data"], reverse=True)
        
        # Limitar ao período
        if periodo_dias:
            data_limite = datetime.now().date()
            registros_filtrados = []
            for r in registros_escola:
                try:
                    data_registro = datetime.fromisoformat(r["data"]).date()
                    diff_dias = (data_limite - data_registro).days
                    if diff_dias <= periodo_dias:
                        registros_filtrados.append(r)
                except:
                    continue
            registros_escola = registros_filtrados
        
        logger.info(f"📊 Listados {len(registros_escola)} registros para escola {escola_id}")
        return registros_escola
        
    except Exception as e:
        logger.error(f"❌ Erro ao listar consumo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/consumo-diario/professor/{professor_id}", response_model=List[dict])
def listar_consumo_professor(
    professor_id: str,
    usuario=Depends(verificar_token)
):
    """
    📝 **Listar registros de um professor específico**
    
    Útil para acompanhar os registros feitos por cada professor.
    """
    try:
        registros = _carregar_registros()
        registros_professor = [r for r in registros if r["professor_id"] == professor_id]
        
        # Ordenar por data (mais recentes primeiro)
        registros_professor.sort(key=lambda x: x["data"], reverse=True)
        
        logger.info(f"📝 Listados {len(registros_professor)} registros do professor {professor_id}")
        return registros_professor
        
    except Exception as e:
        logger.error(f"❌ Erro ao listar registros: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/consumo-diario/{registro_id}", response_model=dict)
def obter_registro(
    registro_id: str,
    usuario=Depends(verificar_token)
):
    """
    🔍 **Obter detalhes de um registro específico**
    """
    try:
        registros = _carregar_registros()
        
        registro = next((r for r in registros if r["id"] == registro_id), None)
        
        if not registro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Registro {registro_id} não encontrado"
            )
        
        return registro
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao obter registro: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
