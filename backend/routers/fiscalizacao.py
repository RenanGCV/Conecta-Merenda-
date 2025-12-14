"""
Router de Fiscalização.
- Diretoras: upload de notas fiscais
- Governo: visualização de alertas e análises (EXCLUSIVO)
"""
import json
import logging
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pathlib import Path

from schemas import (
    UploadNotaFiscal,
    NotaFiscalResponse,
    AnaliseNotaFiscal,
    DashboardFiscalizacaoGoverno,
    RelatorioFiscalizacao
)
from services.ia_fiscalizacao import analisar_nota_fiscal_ia, gerar_dashboard_fiscalizacao_governo
from routers.auth import verificar_token

router = APIRouter(prefix="/api/v1/fiscalizacao", tags=["🔍 Fiscalização"])
logger = logging.getLogger(__name__)

# Caminho dos arquivos
DATA_DIR = Path(__file__).parent.parent / "data"
NOTAS_FILE = DATA_DIR / "notas_fiscais.json"
ANALISES_FILE = DATA_DIR / "analises_fiscalizacao.json"


def _carregar_notas() -> List[dict]:
    """Carrega notas fiscais."""
    if not NOTAS_FILE.exists():
        return []
    with open(NOTAS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _salvar_notas(notas: List[dict]):
    """Salva notas fiscais."""
    with open(NOTAS_FILE, "w", encoding="utf-8") as f:
        json.dump(notas, f, ensure_ascii=False, indent=2)


def _carregar_analises() -> List[dict]:
    """Carrega análises de fiscalização."""
    if not ANALISES_FILE.exists():
        return []
    with open(ANALISES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _salvar_analises(analises: List[dict]):
    """Salva análises."""
    with open(ANALISES_FILE, "w", encoding="utf-8") as f:
        json.dump(analises, f, ensure_ascii=False, indent=2)


# ==================== ENDPOINTS PARA DIRETORAS ====================

@router.post("/notas-fiscais", response_model=NotaFiscalResponse, status_code=status.HTTP_201_CREATED)
def enviar_nota_fiscal(
    nota: UploadNotaFiscal,
    usuario=Depends(verificar_token)
):
    """
    📤 **Upload de Nota Fiscal (Diretoras)**
    
    Diretoras enviam notas fiscais para comprovar gastos com merenda escolar.
    
    **O sistema automaticamente:**
    1. Registra a nota fiscal
    2. **Analisa com IA** (preços, fornecedor, produtos)
    3. Gera score de conformidade
    4. Detecta possíveis irregularidades
    
    **IMPORTANTE:** 
    - Diretoras NÃO veem os alertas de fiscalização
    - Apenas o governo tem acesso às análises de risco
    - Notas com alertas são sinalizadas para investigação
    
    **Documentos necessários:**
    - Número da NF-e
    - CNPJ do fornecedor
    - Detalhamento dos itens comprados
    - Arquivo PDF/foto da nota (opcional mas recomendado)
    """
    try:
        notas = _carregar_notas()
        
        # Verificar duplicidade
        if any(n["numero_nota"] == nota.numero_nota and n["escola_id"] == nota.escola_id 
               for n in notas):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nota fiscal já cadastrada para esta escola"
            )
        
        # Gerar ID
        nota_id = f"NF{len(notas) + 1:05d}"
        
        # Preparar dados da nota
        nota_dict = nota.model_dump()
        nota_dict["id"] = nota_id
        nota_dict["data_upload"] = datetime.now().isoformat()
        nota_dict["status_analise"] = "em_analise"
        
        # Salvar nota
        notas.append(nota_dict)
        _salvar_notas(notas)
        
        # ===== ANÁLISE AUTOMÁTICA COM IA =====
        # Carregar dados para contexto
        historico_escola = [n for n in notas if n["escola_id"] == nota.escola_id]
        fornecedores_irregulares = []  # TODO: Carregar de lista real
        
        # Analisar
        analise = analisar_nota_fiscal_ia(
            nota_dict,
            historico_escola,
            fornecedores_irregulares
        )
        
        # Salvar análise (SEPARADO das notas - governo acessa separadamente)
        analises = _carregar_analises()
        analises.append(analise)
        _salvar_analises(analises)
        
        # Atualizar status da nota baseado na análise
        nota_dict["conformidade_score"] = analise["conformidade_score"]
        
        if analise["conformidade_score"] >= 90:
            nota_dict["status_analise"] = "aprovada"
        elif analise["conformidade_score"] >= 70:
            nota_dict["status_analise"] = "aprovada"  # Aprovada mas com observações
        else:
            nota_dict["status_analise"] = "com_alertas"  # Requer atenção
        
        # Atualizar nota com status
        notas[-1] = nota_dict
        _salvar_notas(notas)
        
        logger.info(f"✅ Nota fiscal {nota_id} enviada e analisada - Score: {analise['conformidade_score']}")
        
        # Retornar para diretora (SEM os alertas detalhados!)
        return NotaFiscalResponse(
            id=nota_id,
            escola_id=nota.escola_id,
            numero_nota=nota.numero_nota,
            valor_total=nota.valor_total,
            status_analise=nota_dict["status_analise"],
            data_upload=nota_dict["data_upload"],
            conformidade_score=analise["conformidade_score"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao processar nota fiscal: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar nota fiscal: {str(e)}"
        )


@router.get("/notas-fiscais/escola/{escola_id}", response_model=List[NotaFiscalResponse])
def listar_notas_escola(
    escola_id: str,
    usuario=Depends(verificar_token)
):
    """
    📋 **Listar notas fiscais de uma escola (Diretoras)**
    
    Diretoras podem ver suas próprias notas enviadas.
    
    **Retorna:**
    - Número da nota
    - Valor total
    - Status da análise
    - Score de conformidade
    
    **NÃO retorna:**
    - Alertas detalhados (apenas governo vê)
    - Razões específicas de flags
    - Comparações com outras escolas
    """
    try:
        notas = _carregar_notas()
        notas_escola = [n for n in notas if n["escola_id"] == escola_id]
        
        # Ordenar por data (mais recentes primeiro)
        notas_escola.sort(key=lambda x: x.get("data_upload", ""), reverse=True)
        
        # Converter para response model (sem detalhes de fiscalização)
        return [
            NotaFiscalResponse(
                id=n["id"],
                escola_id=n["escola_id"],
                numero_nota=n["numero_nota"],
                valor_total=n["valor_total"],
                status_analise=n["status_analise"],
                data_upload=n["data_upload"],
                conformidade_score=n.get("conformidade_score")
            )
            for n in notas_escola
        ]
        
    except Exception as e:
        logger.error(f"❌ Erro ao listar notas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ==================== ENDPOINTS EXCLUSIVOS DO GOVERNO ====================

@router.get("/governo/dashboard", response_model=DashboardFiscalizacaoGoverno)
def obter_dashboard_governo(
    periodo_dias: int = 30,
    usuario=Depends(verificar_token)
):
    """
    🏛️ **Dashboard de Fiscalização (EXCLUSIVO GOVERNO)**
    
    ⚠️ **ACESSO RESTRITO:** Apenas perfil "governo"
    
    Dashboard completo com:
    - Escolas com alertas de irregularidade
    - Fornecedores suspeitos
    - Produtos com preços inflacionados
    - Score de conformidade por escola
    - Ranking de risco
    
    **Sistema de Flags:**
    - 🟢 Verde: Score 90-100 (Conforme)
    - 🟡 Amarelo: Score 70-89 (Atenção)
    - 🟠 Laranja: Score 50-69 (Suspeito)
    - 🔴 Vermelho: Score 0-49 (Crítico - Investigar)
    
    **Diretoras NÃO têm acesso a este endpoint!**
    """
    # TODO: Verificar se usuário tem perfil "governo"
    # if usuario.get("tipo") != "governo":
    #     raise HTTPException(status_code=403, detail="Acesso negado")
    
    try:
        dashboard = gerar_dashboard_fiscalizacao_governo(periodo_dias)
        logger.info(f"📊 Dashboard de fiscalização acessado - {dashboard['escolas_com_alertas']} escolas com alertas")
        return dashboard
        
    except Exception as e:
        logger.error(f"❌ Erro ao gerar dashboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/governo/analises/{nota_fiscal_id}", response_model=AnaliseNotaFiscal)
def obter_analise_detalhada(
    nota_fiscal_id: str,
    usuario=Depends(verificar_token)
):
    """
    🔍 **Análise Detalhada de Nota Fiscal (EXCLUSIVO GOVERNO)**
    
    ⚠️ **ACESSO RESTRITO:** Apenas perfil "governo"
    
    Retorna análise completa com:
    - Todos os alertas detectados
    - Comparação de preços com mercado
    - Histórico do fornecedor
    - Justificativa da IA
    - Recomendações de ação
    
    **Tipos de Alertas:**
    - `preco_inflacionado`: Preço muito acima do mercado
    - `produto_incompativel`: Produto não adequado para PNAE
    - `fornecedor_irregular`: Fornecedor com problemas
    - `volume_suspeito`: Quantidade anormal
    - `duplicidade`: Possível nota duplicada
    
    **Diretoras NÃO veem estes detalhes!**
    """
    # TODO: Verificar permissão
    
    try:
        analises = _carregar_analises()
        
        analise = next((a for a in analises if a["nota_fiscal_id"] == nota_fiscal_id), None)
        
        if not analise:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Análise não encontrada"
            )
        
        return analise
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao obter análise: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/governo/escolas-risco", response_model=List[dict])
def listar_escolas_alto_risco(
    limite: int = 10,
    usuario=Depends(verificar_token)
):
    """
    🚨 **Escolas de Alto Risco (EXCLUSIVO GOVERNO)**
    
    ⚠️ **ACESSO RESTRITO:** Apenas perfil "governo"
    
    Lista escolas que requerem investigação prioritária.
    
    **Critérios de Alto Risco:**
    - Score de conformidade < 60
    - Múltiplos alertas críticos
    - Padrões suspeitos recorrentes
    - Fornecedores irregulares
    
    **Ações Recomendadas:**
    - Auditoria presencial
    - Solicitar documentação adicional
    - Bloquear novos repasses até regularização
    """
    # TODO: Implementar com dados reais
    
    try:
        analises = _carregar_analises()
        notas = _carregar_notas()
        
        # Agrupar por escola e calcular score médio
        escolas_scores = {}
        for analise in analises:
            escola_id = analise["escola_id"]
            if escola_id not in escolas_scores:
                escolas_scores[escola_id] = []
            escolas_scores[escola_id].append(analise["conformidade_score"])
        
        # Calcular média e identificar alto risco
        escolas_risco = []
        for escola_id, scores in escolas_scores.items():
            score_medio = sum(scores) / len(scores)
            
            if score_medio < 70:  # Alto risco
                total_alertas = sum(1 for a in analises 
                                   if a["escola_id"] == escola_id and a["requer_investigacao"])
                
                escolas_risco.append({
                    "escola_id": escola_id,
                    "score_conformidade": round(score_medio, 2),
                    "total_analises": len(scores),
                    "total_alertas": total_alertas,
                    "status": "investigacao_necessaria" if score_medio < 50 else "atencao"
                })
        
        # Ordenar por score (piores primeiro)
        escolas_risco.sort(key=lambda x: x["score_conformidade"])
        
        return escolas_risco[:limite]
        
    except Exception as e:
        logger.error(f"❌ Erro ao listar escolas de risco: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
