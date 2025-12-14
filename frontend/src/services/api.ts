import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Cliente Axios configurado
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const authService = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/api/v1/auth/login', { email, senha });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};

// ========== ESCOLAS ==========
export const escolasService = {
  listar: async () => {
    const response = await api.get('/api/v1/escolas/');
    return response.data;
  },
  obter: async (id: string) => {
    const response = await api.get(`/api/v1/escolas/${id}`);
    return response.data;
  },
  criarPedido: async (pedido: any) => {
    const response = await api.post('/api/v1/escolas/pedidos', pedido);
    return response.data;
  },
  listarPedidos: async (escolaId?: string) => {
    const params = escolaId ? { escola_id: escolaId } : {};
    const response = await api.get('/api/v1/escolas/pedidos', { params });
    return response.data;
  },
  confirmarRecebimento: async (pedidoId: string) => {
    const response = await api.post(`/api/v1/escolas/pedidos/${pedidoId}/confirmar`);
    return response.data;
  },
  criarAvaliacao: async (avaliacao: any) => {
    const response = await api.post('/api/v1/escolas/avaliacoes', avaliacao);
    return response.data;
  },
  enviarFeedback: async (feedback: any) => {
    const response = await api.post('/api/v1/escolas/feedback-cardapio', feedback);
    return response.data;
  },
  solicitarSugestaoIA: async (dados: any) => {
    const response = await api.post('/api/v1/escolas/sugestao-ia', dados);
    return response.data;
  },
  gerarCardapio: async (dados: any) => {
    const response = await api.post('/api/v1/escolas/cardapio-inteligente', dados);
    return response.data;
  },
  gerarDashboard: async (escolaId: string) => {
    const response = await api.post('/api/v1/escolas/dashboard-inteligente', { escola_id: escolaId });
    return response.data;
  },
  gerarRelatorio: async (dados: any) => {
    const response = await api.post('/api/v1/escolas/relatorio-compra', dados, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ========== AGRICULTORES ==========
export const agricultoresService = {
  listar: async (params?: any) => {
    const response = await api.get('/api/v1/agricultores/', { params });
    return response.data;
  },
  obter: async (id: string) => {
    const response = await api.get(`/api/v1/agricultores/${id}`);
    return response.data;
  },
  buscarProximos: async (dados: any) => {
    const response = await api.post('/api/v1/agricultores/buscar', dados);
    return response.data;
  },
  listarProdutos: async (produtorId: string) => {
    const response = await api.get(`/api/v1/agricultores/${produtorId}/produtos`);
    return response.data;
  },
};

// ========== DASHBOARD ==========
export const dashboardService = {
  visaoGeral: async () => {
    const response = await api.get('/api/v1/dashboard/visao-geral');
    return response.data;
  },
  categoriasMaisCompradas: async () => {
    const response = await api.get('/api/v1/dashboard/categorias-mais-compradas');
    return response.data;
  },
  mapaProdutores: async () => {
    const response = await api.get('/api/v1/dashboard/mapa-produtores');
    return response.data;
  },
  estatisticasTempoReal: async () => {
    const response = await api.get('/api/v1/dashboard/estatisticas-tempo-real');
    return response.data;
  },
  rankingEscolas: async () => {
    const response = await api.get('/api/v1/dashboard/ranking-escolas');
    return response.data;
  },
  rankingProdutores: async () => {
    const response = await api.get('/api/v1/dashboard/ranking-produtores');
    return response.data;
  },
};

// ========== SECRETARIA ==========
export const secretariaService = {
  dashboardFinanceiro: async () => {
    const response = await api.get('/api/v1/secretaria/dashboard-financeiro');
    return response.data;
  },
  metaPNAE: async () => {
    const response = await api.get('/api/v1/secretaria/meta-pnae');
    return response.data;
  },
  auditoriaAvaliacoes: async (params?: any) => {
    const response = await api.get('/api/v1/secretaria/auditoria/avaliacoes', { params });
    return response.data;
  },
  gerarQRCode: async (pedidoId: string) => {
    const response = await api.get(`/api/v1/secretaria/qrcode/${pedidoId}`);
    return response.data;
  },
  rastrearPedido: async (pedidoId: string) => {
    const response = await api.get(`/api/v1/secretaria/rastreabilidade/${pedidoId}`);
    return response.data;
  },
};

// ========== CLIMA ==========
export const climaService = {
  alertas: async () => {
    const response = await api.get('/api/v1/dashboard/alertas-climaticos');
    return response.data;
  },
};

// ========== FISCALIZAÇÃO ==========
export const fiscalizacaoService = {
  analisar: async (dados: any) => {
    const response = await api.post('/api/v1/fiscalizacao/analisar', dados);
    return response.data;
  },
  validarNota: async (dados: any) => {
    const response = await api.post('/api/v1/fiscalizacao/validar-nota', dados);
    return response.data;
  },
  relatorioCompleto: async (dados: any) => {
    const response = await api.post('/api/v1/fiscalizacao/relatorio-completo', dados);
    return response.data;
  },
};

export default api;
