"""
Router de escolas.
Gerencia pedidos, avaliações, feedbacks e sugestões de IA.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List
import json
from pathlib import Path
from datetime import datetime
import uuid

from schemas import (
    EscolaResponse,
    PedidoCreate,
    PedidoResponse,
    AvaliacaoCreate,
    AvaliacaoResponse,
    FeedbackCardapioCreate,
    SugestaoIARequest,
    SugestaoIAResponse,
    RelatorioCompraRequest,
    RelatorioCompraResponse,
    SolicitacaoCardapio,
    CardapioGerado,
    DashboardInteligente
)
from services.ia_cardapio import gerar_sugestao_substituicao, analisar_feedback_cardapio
from services.ia_dashboard import gerar_cardapio_inteligente, gerar_dashboard_inteligente
from services.pdf_reports import gerar_relatorio_compra_pdf, salvar_pdf
from services.qrcode_gen import gerar_qrcode_pedido
from routers.auth import verificar_token

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


def salvar_json(filename: str, data: list):
    """Salva dados em arquivo JSON."""
    with open(DATA_DIR / filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@router.get("/", response_model=List[EscolaResponse], summary="Listar escolas")
async def listar_escolas():
    """Lista todas as escolas cadastradas no sistema."""
    return carregar_json("escolas.json")


@router.get("/{escola_id}", response_model=EscolaResponse, summary="Obter escola")
async def obter_escola(escola_id: str):
    """Retorna informações detalhadas de uma escola específica."""
    escolas = carregar_json("escolas.json")
    escola = next((e for e in escolas if e["id"] == escola_id), None)
    
    if not escola:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    return escola


# ==================== PEDIDOS ====================

@router.post("/pedidos", response_model=PedidoResponse, summary="Criar pedido")
async def criar_pedido(
    pedido: PedidoCreate,
    token_data: dict = Depends(verificar_token)
):
    """
    Cria um novo pedido de compra.
    
    **Fluxo:**
    1. Valida escola e produtor
    2. Calcula valor total
    3. Salva pedido
    4. Retorna dados com ID gerado
    """
    # Validar escola
    escolas = carregar_json("escolas.json")
    escola = next((e for e in escolas if e["id"] == pedido.escola_id), None)
    if not escola:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    # Validar produtor
    produtores = carregar_json("produtores.json")
    produtor = next((p for p in produtores if p["id"] == pedido.produtor_id), None)
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")
    
    # Calcular valor total
    valor_total = sum(
        float(item.quantidade) * float(item.preco_unitario)
        for item in pedido.itens
    )
    
    # Criar pedido
    novo_pedido = {
        "id": f"PED{str(uuid.uuid4())[:8].upper()}",
        "escola_id": pedido.escola_id,
        "produtor_id": pedido.produtor_id,
        "itens": [item.dict() for item in pedido.itens],
        "valor_total": round(valor_total, 2),
        "tipo_logistica": pedido.tipo_logistica,
        "data_pedido": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "data_entrega_desejada": pedido.data_entrega_desejada,
        "status": "pendente",
        "observacoes": pedido.observacoes
    }
    
    # Salvar
    pedidos = carregar_json("pedidos.json")
    pedidos.append(novo_pedido)
    salvar_json("pedidos.json", pedidos)
    
    return novo_pedido


@router.get("/pedidos", response_model=List[PedidoResponse], summary="Listar pedidos")
async def listar_pedidos(
    escola_id: str = Query(None, description="Filtrar por escola"),
    produtor_id: str = Query(None, description="Filtrar por produtor"),
    status: str = Query(None, description="Filtrar por status"),
    token_data: dict = Depends(verificar_token)
):
    """Lista pedidos com filtros opcionais."""
    pedidos = carregar_json("pedidos.json")
    
    if escola_id:
        pedidos = [p for p in pedidos if p["escola_id"] == escola_id]
    
    if produtor_id:
        pedidos = [p for p in pedidos if p["produtor_id"] == produtor_id]
    
    if status:
        pedidos = [p for p in pedidos if p["status"] == status]
    
    return pedidos


@router.get("/pedidos/{pedido_id}", response_model=PedidoResponse, summary="Obter pedido")
async def obter_pedido(
    pedido_id: str,
    token_data: dict = Depends(verificar_token)
):
    """Retorna detalhes de um pedido específico."""
    pedidos = carregar_json("pedidos.json")
    pedido = next((p for p in pedidos if p["id"] == pedido_id), None)
    
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    return pedido


# ==================== AVALIAÇÕES ====================

@router.post("/avaliacoes", response_model=AvaliacaoResponse, summary="Criar avaliação")
async def criar_avaliacao(
    avaliacao: AvaliacaoCreate,
    token_data: dict = Depends(verificar_token)
):
    """
    Cria avaliação de uma entrega.
    
    Atualiza automaticamente a média do produtor.
    """
    # Validar pedido existe
    pedidos = carregar_json("pedidos.json")
    pedido = next((p for p in pedidos if p["id"] == avaliacao.pedido_id), None)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    # Criar avaliação
    nova_avaliacao = {
        "id": f"AV{str(uuid.uuid4())[:8].upper()}",
        **avaliacao.dict(),
        "data_avaliacao": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Salvar
    avaliacoes = carregar_json("avaliacoes.json")
    avaliacoes.append(nova_avaliacao)
    salvar_json("avaliacoes.json", avaliacoes)
    
    return nova_avaliacao


# ==================== FEEDBACK CARDÁPIO ====================

@router.post("/feedback-cardapio", summary="Registrar feedback sobre cardápio")
async def registrar_feedback(
    feedback: FeedbackCardapioCreate,
    token_data: dict = Depends(verificar_token)
):
    """
    Registra feedback sobre aceitação de um produto no cardápio.
    
    Usado pelo "Merendômetro" para coletar dados de aceitação dos alunos.
    """
    novo_feedback = {
        "id": f"FB{str(uuid.uuid4())[:8].upper()}",
        **feedback.dict(),
        "data_registro": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Salvar em arquivo de feedbacks (criar se não existir)
    feedbacks = carregar_json("feedbacks.json")
    feedbacks.append(novo_feedback)
    salvar_json("feedbacks.json", feedbacks)
    
    return {
        "message": "Feedback registrado com sucesso",
        "feedback_id": novo_feedback["id"]
    }


# ==================== SUGESTÃO IA ====================

@router.post("/sugestao-ia", response_model=SugestaoIAResponse, summary="Obter sugestão da IA")
async def obter_sugestao_ia(
    request: SugestaoIARequest,
    token_data: dict = Depends(verificar_token)
):
    """
    **🤖 IA para Substituição Inteligente de Cardápio**
    
    Usa GPT-4 para sugerir o melhor alimento substituto considerando:
    - Valor nutricional equivalente
    - Produtos em safra (mais baratos)
    - Agricultura familiar local
    - Aceitação infantil
    - Economia estimada
    
    **Exemplo de uso:**
    ```json
    {
      "escola_id": "ESC001",
      "produto_atual": "Uva",
      "motivo_troca": "Alto custo fora da safra",
      "restricoes": []
    }
    ```
    """
    # Carregar dados necessários
    escola = next((e for e in carregar_json("escolas.json") if e["id"] == request.escola_id), None)
    if not escola:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    # Carregar produtores e safra
    produtores = carregar_json("produtores.json")
    safra = carregar_json("safra_regional.json")
    
    # Gerar sugestão usando IA
    sugestao = gerar_sugestao_substituicao(
        produto_atual=request.produto_atual,
        motivo_troca=request.motivo_troca,
        produtos_disponiveis=produtores,
        safra_regional=safra,
        restricoes=request.restricoes
    )
    
    # Buscar produtores que oferecem o produto sugerido
    produto_sugerido = sugestao.get("produto_sugerido", "")
    produtores_disponiveis = [
        p for p in produtores
        if any(prod["nome"] == produto_sugerido for prod in p.get("produtos", []))
    ]
    
    return {
        **sugestao,
        "producoes_disponiveis": produtores_disponiveis[:5],  # Top 5
        "valor_nutricional_comparativo": sugestao.get("beneficios_nutricionais", {})
    }


# ==================== RELATÓRIOS ====================

@router.post("/relatorios", response_model=RelatorioCompraResponse, summary="Gerar relatório PDF")
async def gerar_relatorio(
    request: RelatorioCompraRequest,
    token_data: dict = Depends(verificar_token)
):
    """
    Gera relatório PDF de uma compra para prestação de contas PNAE.
    
    **Inclui:**
    - Dados completos do pedido
    - Informações do produtor e certificações
    - Declaração de conformidade PNAE
    - Assinaturas para validação
    """
    # Buscar dados
    pedido = next((p for p in carregar_json("pedidos.json") if p["id"] == request.pedido_id), None)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    escola = next((e for e in carregar_json("escolas.json") if e["id"] == request.escola_id), None)
    if not escola:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    produtor = next((p for p in carregar_json("produtores.json") if p["id"] == pedido["produtor_id"]), None)
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")
    
    # Gerar PDF
    pdf_bytes = gerar_relatorio_compra_pdf(pedido, escola, produtor)
    
    # Salvar arquivo
    filename = f"relatorio_{request.pedido_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = salvar_pdf(pdf_bytes, filename)
    
    return {
        "pedido_id": request.pedido_id,
        "url_pdf": f"/relatorios/{filename}",
        "data_geracao": datetime.now().isoformat()
    }


# ==================== QR CODE ====================

@router.get("/pedidos/{pedido_id}/qrcode", summary="Gerar QR Code de rastreio")
async def gerar_qrcode_rastreio(
    pedido_id: str,
    token_data: dict = Depends(verificar_token)
):
    """
    Gera QR Code para rastreabilidade do pedido.
    
    Retorna imagem em base64 que pode ser escaneada para verificar:
    - Origem do produto
    - Certificações do produtor
    - Dados da entrega
    """
    pedido = next((p for p in carregar_json("pedidos.json") if p["id"] == pedido_id), None)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    escola = next((e for e in carregar_json("escolas.json") if e["id"] == pedido["escola_id"]), None)
    produtor = next((p for p in carregar_json("produtores.json") if p["id"] == pedido["produtor_id"]), None)
    
    qrcode_base64 = gerar_qrcode_pedido(pedido_id, produtor, escola)
    
    return {
        "pedido_id": pedido_id,
        "qrcode": f"data:image/png;base64,{qrcode_base64}"
    }


@router.post("/cardapio-automatico", response_model=CardapioGerado)
def gerar_cardapio_automatico(
    solicitacao: SolicitacaoCardapio,
    usuario=Depends(verificar_token)
):
    """
    🤖 **Gerar cardápio automaticamente com IA**
    
    Sistema inteligente que cria cardápios balanceando:
    - ✅ O que as crianças **GOSTAM** (histórico de aceitação)
    - 🥗 O que elas **PRECISAM** (valor nutricional)
    - 💰 Orçamento disponível
    - 🌱 Produtos da safra local
    
    **Estratégias da IA:**
    - Alimentos rejeitados são usados em receitas "disfarçadas"
    - Combina alimentos aceitos com nutritivos
    - Varia preparos para reduzir monotonia
    - Prioriza produção local (menor custo, maior frescor)
    
    **Pesos de Prioridade:**
    - `prioridade_nutricao` (1-10): Quanto priorizamos saúde
    - `prioridade_aceitacao` (1-10): Quanto priorizamos preferência
    
    Exemplo: prioridade_nutricao=7, prioridade_aceitacao=3
    = 70% peso em nutrição, 30% em aceitação
    """
    try:
        # Carregar dados necessários
        consumo_historico = carregar_json("consumo_diario.json")
        safra = carregar_json("safra_regional.json")
        
        # Filtrar histórico da escola
        consumo_escola = [r for r in consumo_historico if r.get("escola_id") == solicitacao.escola_id]
        
        # Calcular período em dias
        from datetime import datetime
        data_inicio = datetime.fromisoformat(solicitacao.periodo_inicio)
        data_fim = datetime.fromisoformat(solicitacao.periodo_fim)
        periodo_dias = (data_fim - data_inicio).days + 1
        
        # Gerar cardápio com IA
        cardapio = gerar_cardapio_inteligente(
            escola_id=solicitacao.escola_id,
            periodo_dias=periodo_dias,
            tipo_refeicao=solicitacao.tipo_refeicao,
            historico_consumo=consumo_escola,
            safra_disponivel=safra.get("produtos_disponiveis", []),
            prioridade_nutricao=solicitacao.prioridade_nutricao,
            prioridade_aceitacao=solicitacao.prioridade_aceitacao,
            restricoes=solicitacao.restricoes_alergias,
            orcamento_diario=solicitacao.orcamento_diario
        )
        
        # Adicionar datas aos pratos
        cardapio["periodo_inicio"] = solicitacao.periodo_inicio
        cardapio["periodo_fim"] = solicitacao.periodo_fim
        
        return cardapio
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar cardápio: {str(e)}"
        )


@router.get("/dashboard-inteligente/{escola_id}", response_model=DashboardInteligente)
def obter_dashboard_inteligente(
    escola_id: str,
    periodo_dias: int = Query(30, ge=7, le=90, description="Período de análise em dias"),
    usuario=Depends(verificar_token)
):
    """
    📊 **Dashboard Inteligente com Insights de IA**
    
    Análise completa do histórico de consumo com:
    
    **Métricas Gerais:**
    - Índice de aceitação geral (0-100%)
    - Índice de desperdício geral (0-100%)
    - Score nutricional médio
    
    **Análises Detalhadas:**
    - Top 10 alimentos mais aceitos pelas crianças
    - Top 10 alimentos mais rejeitados
    - Alertas de desperdício alto (>30%)
    
    **Recomendações da IA:**
    - Ações prioritárias para reduzir desperdício
    - Receitas criativas para "disfarçar" alimentos rejeitados
    - Economia potencial seguindo as recomendações
    
    **Exemplo de Receitas Inteligentes:**
    - Jiló rejeitado → Farofa de jiló (disfarçado e aceito)
    - Espinafre rejeitado → Bolinho de espinafre com queijo
    - Beterraba rejeitada → Bolo de chocolate com beterraba
    """
    try:
        # Carregar histórico de consumo
        consumo_historico = carregar_json("consumo_diario.json")
        
        # Filtrar por escola e período
        consumo_escola = [
            r for r in consumo_historico 
            if r.get("escola_id") == escola_id
        ]
        
        # Gerar dashboard com IA
        dashboard = gerar_dashboard_inteligente(
            escola_id=escola_id,
            historico_consumo=consumo_escola,
            periodo_dias=periodo_dias
        )
        
        return dashboard
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar dashboard: {str(e)}"
        )
