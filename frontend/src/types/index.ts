// Tipos para Autenticação
export interface User {
  user_id: string;
  nome: string;
  perfil: 'escola' | 'agricultor' | 'secretaria';
  email?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  perfil: 'escola' | 'agricultor' | 'secretaria';
  user_info: User;
}

// Tipos para Localização
export interface Localizacao {
  endereco: string;
  bairro?: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number;
  longitude: number;
}

// Tipos para Escola
export interface DadosEscolares {
  total_alunos: number;
  turnos: string[];
  refeicoes_dia: number;
  orcamento_mensal_pnae: number;
}

export interface Escola {
  id: string;
  nome: string;
  tipo: string;
  cnpj: string;
  localizacao: Localizacao;
  contato: {
    diretor: string;
    telefone: string;
    email: string;
  };
  dados_escolares: DadosEscolares;
  membro_desde: string;
}

// Tipos para Produtor/Agricultor
export interface Produto {
  nome: string;
  categoria: 'Hortaliças' | 'Frutas' | 'Tubérculos' | 'Proteínas' | 'Outros';
  unidade: string;
  preco_unitario: number;
}

// Tipo de fornecedor
export type TipoFornecedor = 'agricultura_familiar' | 'fornecedor_normal';

export interface Produtor {
  id: string;
  nome: string;
  nome_propriedade: string;
  telefone: string;
  email: string;
  possui_dap: boolean;
  numero_dap?: string;
  localizacao: Localizacao;
  produtos: Produto[];
  avaliacao_media: number;
  total_avaliacoes: number;
  total_entregas: number;
  certificacoes: string[];
  raio_entrega_km: number;
  foto_perfil?: string;
  membro_desde?: string;
  capacidade_fornecimento_mensal?: string;
  // Campos calculados
  distancia_km?: number;
  score_match?: number;
  desconto_proximidade?: number;
  // Tipo do fornecedor
  tipo_fornecedor: TipoFornecedor;
}

// Fornecedor normal (atacadista/distribuidor)
export interface Fornecedor {
  id: string;
  nome: string;
  razao_social: string;
  cnpj: string;
  tipo: 'atacadista' | 'distribuidor' | 'cooperativa';
  telefone: string;
  email: string;
  localizacao: Localizacao;
  produtos: Produto[];
  avaliacao_media: number;
  total_avaliacoes: number;
  prazo_entrega_dias: number;
  pedido_minimo: number;
  tipo_fornecedor: TipoFornecedor;
}

// Tipos para Pedidos
export interface ItemPedido {
  produto_nome: string;
  quantidade: number;
  unidade: string;
  preco_unitario: number;
}

export interface Pedido {
  id: string;
  escola_id: string;
  produtor_id: string;
  itens: ItemPedido[];
  valor_total: number;
  tipo_logistica: 'entrega' | 'retirada';
  data_pedido: string;
  data_entrega_desejada: string;
  status: 'pendente' | 'confirmado' | 'entregue' | 'cancelado';
  observacoes?: string;
}

export interface PedidoCreate {
  escola_id: string;
  produtor_id: string;
  itens: ItemPedido[];
  tipo_logistica: 'entrega' | 'retirada';
  data_entrega_desejada: string;
  observacoes?: string;
}

// Tipos para Avaliações
export interface Avaliacao {
  id: string;
  pedido_id: string;
  escola_id: string;
  produtor_id: string;
  nota: number;
  tags: string[];
  comentario?: string;
  data_avaliacao: string;
}

export interface AvaliacaoCreate {
  pedido_id: string;
  escola_id: string;
  produtor_id: string;
  nota: number;
  tags: string[];
  comentario?: string;
}

// Tipos para Feedback (Merendômetro)
export interface FeedbackCardapio {
  escola_id: string;
  produto_rejeitado: string;
  tipo_feedback: 'positivo' | 'negativo' | 'neutro';
  motivo?: string;
  data_refeicao: string;
}

// Tipos para Sugestão IA
export interface SugestaoIARequest {
  escola_id: string;
  produto_atual: string;
  motivo_troca: string;
  restricoes?: string[];
}

export interface SugestaoIAResponse {
  produto_sugerido: string;
  justificativa: string;
  economia_estimada_percentual: number;
  producoes_disponiveis: Produtor[];
  valor_nutricional_comparativo: Record<string, any>;
}

// Tipos para Dashboard
export interface DashboardVisaoGeral {
  totais: {
    escolas: number;
    produtores: number;
    pedidos: number;
    avaliacoes: number;
  };
  financeiro: {
    total_transacionado: number;
    ticket_medio: number;
  };
  pedidos_por_status: Record<string, number>;
  qualidade: {
    media_avaliacoes: number;
    total_avaliacoes: number;
  };
}

export interface DashboardFinanceiro {
  gasto_total: number;
  gasto_agricultura_familiar: number;
  percentual_af: number;
  meta_pnae: number;
  atingiu_meta: boolean;
  economia_gerada: number;
}

// Tipos para Alertas Climáticos
export interface AlertaClimatico {
  id: string;
  tipo: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  titulo: string;
  descricao: string;
  recomendacao: string;
  data_inicio: string;
  data_fim: string;
  regioes_afetadas: string[];
}

// Tipos para Safra
export interface ProdutoSafra {
  nome: string;
  categoria: string;
  disponibilidade: 'alta' | 'media' | 'baixa';
  preco_medio_kg: number;
  variacao_preco: number;
  nutricao: {
    calorias_100g: number;
    proteinas_g: number;
    carboidratos_g: number;
    fibras_g: number;
    vitaminas: string[];
    minerais: string[];
  };
}

// Tipos para Carrinho de Compras
export interface ItemCarrinho {
  produtorId: string;
  produtorNome: string;
  produto: Produto;
  quantidade: number;
  tipoFornecedor: TipoFornecedor;
}

export interface Carrinho {
  itens: ItemCarrinho[];
  total: number;
  tipoFornecedor: TipoFornecedor | null;
}

// Tipos para Ranking
export interface RankingItem {
  id: string;
  nome: string;
  valor: number;
  posicao: number;
}

// Tipos para QR Code
export interface QRCodeData {
  pedido_id: string;
  qrcode_base64: string;
  url_rastreamento: string;
}

// Tipos para Rastreabilidade
export interface DadosRastreabilidade {
  pedido: Pedido;
  produtor: Produtor;
  escola: Escola;
  historico: Array<{
    data: string;
    status: string;
    descricao: string;
  }>;
}
