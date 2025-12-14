"""
Schemas Pydantic para validação de dados.
Define os modelos de entrada e saída da API.
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Literal, Dict
from datetime import datetime
from decimal import Decimal


# ==================== AUTENTICAÇÃO ====================

class LoginRequest(BaseModel):
    """Requisição de login."""
    email: EmailStr = Field(..., description="Email do usuário")
    senha: str = Field(..., min_length=6, description="Senha do usuário")


class TokenResponse(BaseModel):
    """Resposta com token de acesso."""
    access_token: str
    token_type: str = "bearer"
    perfil: Literal["agricultor", "escola", "secretaria"]
    user_info: dict


# ==================== PRODUTOR/AGRICULTOR ====================

class LocalizacaoBase(BaseModel):
    """Dados de localização."""
    endereco: str
    cidade: str
    estado: str
    cep: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class ProdutoBase(BaseModel):
    """Produto oferecido por um agricultor."""
    nome: str = Field(..., min_length=2, max_length=100)
    categoria: Literal["Hortaliças", "Frutas", "Tubérculos", "Proteínas", "Outros"]
    unidade: str = Field(..., examples=["kg", "maço", "dúzia", "unidade"])
    preco_unitario: Decimal = Field(..., gt=0, decimal_places=2)


class ProdutorResponse(BaseModel):
    """Resposta com dados do produtor."""
    id: str
    nome: str
    nome_propriedade: str
    telefone: str
    email: EmailStr
    possui_dap: bool
    numero_dap: Optional[str] = None
    localizacao: LocalizacaoBase
    produtos: List[ProdutoBase]
    avaliacao_media: float = Field(..., ge=0, le=5)
    total_avaliacoes: int = Field(..., ge=0)
    total_entregas: int = Field(..., ge=0)
    certificacoes: List[str]
    raio_entrega_km: int = Field(..., gt=0)
    
    # Campos calculados (podem ser adicionados dinamicamente)
    distancia_km: Optional[float] = None
    score_match: Optional[float] = None
    desconto_proximidade: Optional[float] = None


# ==================== ESCOLA ====================

class DadosEscolaresBase(BaseModel):
    """Dados operacionais da escola."""
    total_alunos: int = Field(..., gt=0)
    turnos: List[str]
    refeicoes_dia: int = Field(..., gt=0)
    orcamento_mensal_pnae: Decimal = Field(..., gt=0, decimal_places=2)


class EscolaResponse(BaseModel):
    """Resposta com dados da escola."""
    id: str
    nome: str
    tipo: str
    cnpj: str
    localizacao: LocalizacaoBase
    contato: dict
    dados_escolares: DadosEscolaresBase
    membro_desde: str


# ==================== PEDIDOS ====================

class ItemPedidoCreate(BaseModel):
    """Item individual de um pedido."""
    produto_nome: str
    quantidade: Decimal = Field(..., gt=0)
    unidade: str
    preco_unitario: Decimal = Field(..., gt=0, decimal_places=2)


class PedidoCreate(BaseModel):
    """Criação de novo pedido."""
    escola_id: str
    produtor_id: str
    itens: List[ItemPedidoCreate] = Field(..., min_items=1)
    tipo_logistica: Literal["entrega", "retirada"] = "entrega"
    data_entrega_desejada: str
    observacoes: Optional[str] = None


class PedidoResponse(BaseModel):
    """Resposta com dados do pedido."""
    id: str
    escola_id: str
    produtor_id: str
    itens: List[dict]
    valor_total: Decimal
    tipo_logistica: str
    data_pedido: str
    data_entrega_desejada: str
    status: Literal["pendente", "confirmado", "entregue", "cancelado"]
    observacoes: Optional[str] = None


# ==================== AVALIAÇÕES ====================

class AvaliacaoCreate(BaseModel):
    """Criação de avaliação de entrega."""
    pedido_id: str
    escola_id: str
    produtor_id: str
    nota: int = Field(..., ge=1, le=5, description="Nota de 1 a 5 estrelas")
    tags: List[str] = Field(default=[], description="Tags descritivas (ex: 'Pontual', 'Qualidade')")
    comentario: Optional[str] = Field(None, max_length=500)
    
    @validator('tags')
    def validate_tags(cls, v):
        """Valida que as tags são de uma lista permitida."""
        allowed_tags = [
            "Pontual", "Atrasado", "Qualidade Excelente", "Qualidade Regular",
            "Embalagem Boa", "Embalagem Ruim", "Atencioso", "Produto Fresco",
            "Produto Murcho", "Recomendo", "Não Recomendo"
        ]
        for tag in v:
            if tag not in allowed_tags:
                raise ValueError(f"Tag '{tag}' não permitida. Use: {', '.join(allowed_tags)}")
        return v


class AvaliacaoResponse(BaseModel):
    """Resposta com dados da avaliação."""
    id: str
    pedido_id: str
    escola_id: str
    produtor_id: str
    nota: int
    tags: List[str]
    comentario: Optional[str]
    data_avaliacao: str


# ==================== MERENDÔMETRO (FEEDBACK) ====================

class FeedbackCardapioCreate(BaseModel):
    """Feedback sobre aceitação do cardápio."""
    escola_id: str
    produto_rejeitado: str
    tipo_feedback: Literal["positivo", "negativo", "neutro"]
    motivo: Optional[str] = Field(None, description="Ex: 'Sobrou muita comida', 'Alunos pediram mais'")
    data_refeicao: str


# ==================== SUGESTÃO IA ====================

class SugestaoIARequest(BaseModel):
    """Requisição para sugestão de substituição pela IA."""
    escola_id: str
    produto_atual: str
    motivo_troca: str = Field(..., description="Motivo da troca (ex: baixa aceitação, alto custo)")
    restricoes: Optional[List[str]] = Field(default=[], description="Ex: ['sem glúten', 'vegetariano']")


class SugestaoIAResponse(BaseModel):
    """Resposta da IA com sugestão de substituição."""
    produto_sugerido: str
    justificativa: str
    economia_estimada_percentual: float
    producoes_disponiveis: List[ProdutorResponse]
    valor_nutricional_comparativo: dict


# ==================== DASHBOARD ====================

class DashboardFinanceiroResponse(BaseModel):
    """Dados financeiros para dashboard da secretaria."""
    gasto_total: Decimal
    gasto_agricultura_familiar: Decimal
    percentual_af: float
    meta_pnae: float = 30.0
    economia_gerada: Decimal
    numero_escolas: int
    numero_produtores_ativos: int


class RankingEscola(BaseModel):
    """Escola no ranking."""
    escola_id: str
    escola_nome: str
    percentual_af: float
    gasto_total: Decimal
    numero_pedidos: int


class RankingProdutor(BaseModel):
    """Produtor no ranking."""
    produtor_id: str
    produtor_nome: str
    total_vendas: Decimal
    numero_entregas: int
    avaliacao_media: float


# ==================== GEOLOCALIZAÇÃO ====================

class BuscaProdutoresRequest(BaseModel):
    """Parâmetros de busca de produtores."""
    escola_latitude: float = Field(..., ge=-90, le=90)
    escola_longitude: float = Field(..., ge=-180, le=180)
    raio_km: int = Field(default=100, ge=10, le=200, description="Raio de busca em km")
    categoria_produto: Optional[Literal["Hortaliças", "Frutas", "Tubérculos", "Proteínas", "Outros"]] = None
    apenas_com_dap: bool = Field(default=False, description="Filtrar apenas produtores com DAP")
    avaliacao_minima: float = Field(default=0.0, ge=0, le=5)


# ==================== RELATÓRIOS ====================

class RelatorioCompraRequest(BaseModel):
    """Requisição para gerar relatório de compra."""
    pedido_id: str
    escola_id: str


class RelatorioCompraResponse(BaseModel):
    """Resposta com URL do relatório PDF."""
    pedido_id: str
    url_pdf: str
    data_geracao: str


# ==================== CONSUMO DIÁRIO (PROFESSORES) ====================

class ItemConsumoDiario(BaseModel):
    """Item do registro diário de consumo."""
    prato_nome: str = Field(..., description="Nome do prato servido")
    quantidade_servida: int = Field(..., ge=1, description="Quantidade de porções servidas")
    quantidade_consumida: int = Field(..., ge=0, description="Porções efetivamente consumidas")
    quantidade_desperdicada: int = Field(..., ge=0, description="Porções desperdiçadas")
    nivel_aceitacao: Literal["alta", "media", "baixa"] = Field(..., description="Nível de aceitação pelas crianças")
    observacoes: Optional[str] = Field(None, max_length=500, description="Observações do professor")


class RegistroConsumoDiario(BaseModel):
    """Registro diário de consumo pela escola."""
    escola_id: str
    professor_id: str
    professor_nome: str
    data: str = Field(..., description="Data no formato YYYY-MM-DD")
    turma: str = Field(..., description="Ex: '1º Ano A'")
    total_alunos_presentes: int = Field(..., ge=1)
    refeicao_tipo: Literal["cafe_manha", "almoco", "lanche", "jantar"] = Field(..., description="Tipo de refeição")
    itens: List[ItemConsumoDiario] = Field(..., min_length=1)
    comentario_geral: Optional[str] = Field(None, max_length=1000)


class RegistroConsumoResponse(BaseModel):
    """Resposta do registro de consumo."""
    id: str
    escola_id: str
    data: str
    refeicao_tipo: str
    indice_aceitacao: float = Field(..., ge=0, le=100, description="Percentual de aceitação geral")
    indice_desperdicio: float = Field(..., ge=0, le=100, description="Percentual de desperdício")


# ==================== GERAÇÃO AUTOMÁTICA DE CARDÁPIOS ====================

class PreferenciaAlimento(BaseModel):
    """Preferência de um alimento pelos alunos."""
    alimento: str
    score_aceitacao: float = Field(..., ge=0, le=10, description="Score de 0-10 baseado no histórico")
    vezes_servido: int = Field(..., ge=0)
    vezes_rejeitado: int = Field(..., ge=0)
    percentual_desperdicio: float = Field(..., ge=0, le=100)


class SolicitacaoCardapio(BaseModel):
    """Solicitação de geração automática de cardápio."""
    escola_id: str
    periodo_inicio: str = Field(..., description="Data início YYYY-MM-DD")
    periodo_fim: str = Field(..., description="Data fim YYYY-MM-DD")
    tipo_refeicao: Literal["cafe_manha", "almoco", "lanche", "jantar"]
    considerar_preferencias: bool = Field(True, description="Considerar histórico de preferências")
    prioridade_nutricao: int = Field(7, ge=1, le=10, description="Peso da nutrição (1-10)")
    prioridade_aceitacao: int = Field(3, ge=1, le=10, description="Peso da aceitação (1-10)")
    restricoes_alergias: Optional[List[str]] = Field(default=[], description="Ex: ['glúten', 'lactose']")
    orcamento_diario: Optional[float] = Field(None, ge=0, description="Orçamento máximo por dia")


class PratoCardapio(BaseModel):
    """Prato sugerido no cardápio."""
    dia: str
    nome_prato: str
    ingredientes: List[str]
    valor_nutricional: Dict[str, float]
    score_aceitacao_previsto: float = Field(..., ge=0, le=10)
    custo_estimado: float
    producao_local: bool
    justificativa: str


class CardapioGerado(BaseModel):
    """Cardápio completo gerado pela IA."""
    escola_id: str
    periodo_inicio: str
    periodo_fim: str
    tipo_refeicao: str
    pratos: List[PratoCardapio]
    resumo_nutricional: Dict[str, float]
    custo_total_estimado: float
    indice_aceitacao_previsto: float = Field(..., ge=0, le=100)
    recomendacoes_ia: List[str] = Field(..., description="Recomendações adicionais da IA")


# ==================== DASHBOARD INTELIGENTE ====================

class AnaliseAceitacao(BaseModel):
    """Análise de aceitação dos alunos."""
    alimento: str
    score_aceitacao: float = Field(..., ge=0, le=10)
    tendencia: Literal["crescente", "estavel", "decrescente"]
    ultima_avaliacao: str
    recomendacao: str


class AlertaDesperdicio(BaseModel):
    """Alerta de desperdício alto."""
    alimento: str
    percentual_desperdicio: float
    frequencia_servido: int
    sugestao_substituicao: Optional[str] = None
    receitas_alternativas: List[str] = Field(default=[])


class DashboardInteligente(BaseModel):
    """Dashboard com insights de IA."""
    escola_id: str
    periodo_analise: str
    # Métricas gerais
    indice_aceitacao_geral: float = Field(..., ge=0, le=100)
    indice_desperdicio_geral: float = Field(..., ge=0, le=100)
    score_nutricional_medio: float = Field(..., ge=0, le=10)
    
    # Análises detalhadas
    top_alimentos_aceitos: List[AnaliseAceitacao] = Field(..., max_length=10)
    top_alimentos_rejeitados: List[AnaliseAceitacao] = Field(..., max_length=10)
    alertas_desperdicio: List[AlertaDesperdicio]
    
    # Recomendações IA
    acoes_recomendadas: List[str] = Field(..., description="Ações prioritárias sugeridas pela IA")
    receitas_sugeridas: List[Dict[str, str]] = Field(..., description="Receitas para alimentos rejeitados")
    economia_potencial: float = Field(..., description="Economia estimada seguindo recomendações")


# ==================== FISCALIZAÇÃO E CONFORMIDADE ====================

class ItemNotaFiscal(BaseModel):
    """Item individual da nota fiscal."""
    produto_nome: str = Field(..., description="Nome do produto comprado")
    quantidade: float = Field(..., ge=0)
    unidade: str = Field(..., description="kg, litro, unidade, etc")
    preco_unitario: float = Field(..., ge=0)
    valor_total: float = Field(..., ge=0)
    fornecedor_nome: str
    fornecedor_cnpj: Optional[str] = None


class UploadNotaFiscal(BaseModel):
    """Upload de nota fiscal pela diretora."""
    escola_id: str
    numero_nota: str = Field(..., description="Número da NF-e")
    data_emissao: str = Field(..., description="YYYY-MM-DD")
    fornecedor_nome: str
    fornecedor_cnpj: str = Field(..., min_length=14, max_length=18)
    valor_total: float = Field(..., ge=0)
    itens: List[ItemNotaFiscal] = Field(..., min_length=1)
    categoria_compra: Literal["merenda", "equipamentos", "servicos", "outros"]
    arquivo_url: Optional[str] = Field(None, description="URL do arquivo PDF/imagem da nota")
    observacoes: Optional[str] = None


class NotaFiscalResponse(BaseModel):
    """Resposta do upload de nota fiscal."""
    id: str
    escola_id: str
    numero_nota: str
    valor_total: float
    status_analise: Literal["pendente", "em_analise", "aprovada", "com_alertas"] = "pendente"
    data_upload: str
    conformidade_score: Optional[float] = Field(None, ge=0, le=100, description="Score de conformidade (0-100)")


class AlertaFiscalizacao(BaseModel):
    """Alerta de possível irregularidade detectado pela IA."""
    tipo: Literal[
        "preco_inflacionado",
        "produto_incompativel", 
        "fornecedor_irregular",
        "volume_suspeito",
        "duplicidade",
        "fora_periodo"
    ]
    severidade: Literal["baixa", "media", "alta", "critica"]
    descricao: str
    detalhes: Dict[str, any]
    recomendacao: str


class AnaliseNotaFiscal(BaseModel):
    """Análise completa da nota fiscal pela IA."""
    nota_fiscal_id: str
    escola_id: str
    conformidade_score: float = Field(..., ge=0, le=100, description="0=muito suspeito, 100=totalmente conforme")
    risco_fraude: Literal["baixo", "medio", "alto", "critico"]
    alertas: List[AlertaFiscalizacao]
    analise_preco: Dict[str, any] = Field(..., description="Comparação com preços de mercado")
    analise_fornecedor: Dict[str, any] = Field(..., description="Histórico e regularidade do fornecedor")
    analise_compatibilidade: Dict[str, any] = Field(..., description="Produtos compatíveis com PNAE")
    justificativa_ia: str = Field(..., description="Explicação da IA sobre a análise")
    requer_investigacao: bool = Field(..., description="Se deve ser investigado manualmente")


class DashboardFiscalizacaoGoverno(BaseModel):
    """Dashboard de fiscalização EXCLUSIVO do governo."""
    periodo_analise: str
    
    # Métricas gerais
    total_escolas_monitoradas: int
    total_notas_analisadas: int
    valor_total_fiscalizado: float
    
    # Alertas e riscos
    escolas_com_alertas: int
    total_alertas_ativos: int
    distribuicao_severidade: Dict[str, int] = Field(..., description="Contagem por severidade")
    
    # Top alertas
    escolas_alto_risco: List[Dict[str, any]] = Field(..., description="Escolas que requerem investigação")
    fornecedores_suspeitos: List[Dict[str, any]] = Field(..., description="Fornecedores com padrões irregulares")
    produtos_preco_inflacionado: List[Dict[str, any]]
    
    # Estatísticas de conformidade
    score_conformidade_medio: float = Field(..., ge=0, le=100)
    percentual_notas_aprovadas: float = Field(..., ge=0, le=100)
    percentual_com_alertas: float = Field(..., ge=0, le=100)
    percentual_irregulares: float = Field(..., ge=0, le=100)
    
    # Tendências
    tendencia_mes_atual: Dict[str, any]
    economia_potencial_recuperacao: float = Field(..., description="Valor estimado de possíveis desvios")


class RelatorioFiscalizacao(BaseModel):
    """Relatório detalhado para auditoria."""
    escola_id: str
    periodo: str
    notas_fiscais: List[Dict[str, any]]
    total_gasto: float
    conformidade_geral: float
    alertas_encontrados: List[AlertaFiscalizacao]
    parecer_ia: str
    status_recomendado: Literal["regular", "atencao", "investigacao_necessaria", "bloqueio_recomendado"]
