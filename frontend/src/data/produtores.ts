export interface Produtor {
  id: string
  nome: string
  cpf: string
  telefone: string
  dap_caf: {
    possui: boolean
    numero: string
    tipo: string
    validade: string
  }
  localizacao: {
    latitude: number
    longitude: number
    endereco: string
    raio_entrega_km: number
  }
  produtos: {
    categoria: string
    itens: string[]
  }[]
  capacidade_mensal_kg: number
  avaliacao: {
    media: number
    total_vendas: number
    tags: string[]
  }
  foto_perfil: string
  data_cadastro: string
  indicacoes: number
  badge?: string
}

export const produtores: Produtor[] = [
  {
    id: "PROD001",
    nome: "João da Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    dap_caf: {
      possui: true,
      numero: "DAP-12345678",
      tipo: "DAP Física",
      validade: "2025-12-31"
    },
    localizacao: {
      latitude: -23.5205,
      longitude: -46.5833,
      endereco: "Sítio Boa Vista, Zona Rural - Guarulhos - SP",
      raio_entrega_km: 50
    },
    produtos: [
      { categoria: "Hortaliças", itens: ["Alface", "Tomate", "Cenoura", "Beterraba"] },
      { categoria: "Frutas", itens: ["Banana", "Laranja", "Mamão"] }
    ],
    capacidade_mensal_kg: 500,
    avaliacao: { media: 4.8, total_vendas: 24, tags: ["Fresco", "No Prazo", "Bem Embalado"] },
    foto_perfil: "👨‍🌾",
    data_cadastro: "2024-01-15",
    indicacoes: 5,
    badge: "Líder Comunitário"
  },
  {
    id: "PROD002",
    nome: "Maria Fernanda Costa",
    cpf: "987.654.321-00",
    telefone: "(11) 91234-5678",
    dap_caf: {
      possui: true,
      numero: "CAF-87654321",
      tipo: "CAF",
      validade: "2026-06-30"
    },
    localizacao: {
      latitude: -23.4805,
      longitude: -46.6133,
      endereco: "Chácara Esperança - Mairiporã - SP",
      raio_entrega_km: 40
    },
    produtos: [
      { categoria: "Hortaliças", itens: ["Rúcula", "Espinafre", "Couve", "Brócolis"] },
      { categoria: "Temperos", itens: ["Manjericão", "Salsa", "Cebolinha"] }
    ],
    capacidade_mensal_kg: 300,
    avaliacao: { media: 4.9, total_vendas: 18, tags: ["Orgânico", "Fresco", "Excelente"] },
    foto_perfil: "👩‍🌾",
    data_cadastro: "2024-02-20",
    indicacoes: 3,
    badge: "Líder Comunitário"
  },
  {
    id: "PROD003",
    nome: "Antônio Pereira",
    cpf: "456.789.123-00",
    telefone: "(11) 94567-8901",
    dap_caf: {
      possui: true,
      numero: "DAP-45678912",
      tipo: "DAP Física",
      validade: "2025-08-15"
    },
    localizacao: {
      latitude: -23.5605,
      longitude: -46.5533,
      endereco: "Sítio São José - Mogi das Cruzes - SP",
      raio_entrega_km: 60
    },
    produtos: [
      { categoria: "Frutas", itens: ["Morango", "Amora", "Framboesa", "Mirtilo"] },
      { categoria: "Hortaliças", itens: ["Tomate Cereja", "Pimentão"] }
    ],
    capacidade_mensal_kg: 200,
    avaliacao: { media: 4.6, total_vendas: 12, tags: ["Fresco", "Premium"] },
    foto_perfil: "👴",
    data_cadastro: "2024-03-10",
    indicacoes: 1
  },
  {
    id: "PROD004",
    nome: "Francisca Oliveira",
    cpf: "321.654.987-00",
    telefone: "(11) 93456-7890",
    dap_caf: {
      possui: true,
      numero: "DAP-32165498",
      tipo: "DAP Jurídica",
      validade: "2025-11-20"
    },
    localizacao: {
      latitude: -23.5905,
      longitude: -46.6833,
      endereco: "Fazenda Santa Clara - Cotia - SP",
      raio_entrega_km: 45
    },
    produtos: [
      { categoria: "Proteínas", itens: ["Ovos Caipira", "Frango Caipira"] },
      { categoria: "Laticínios", itens: ["Queijo Minas", "Requeijão"] }
    ],
    capacidade_mensal_kg: 400,
    avaliacao: { media: 4.7, total_vendas: 20, tags: ["Qualidade", "Confiável", "No Prazo"] },
    foto_perfil: "👵",
    data_cadastro: "2024-01-25",
    indicacoes: 2
  },
  {
    id: "PROD005",
    nome: "Pedro Henrique Santos",
    cpf: "789.123.456-00",
    telefone: "(11) 92345-6789",
    dap_caf: {
      possui: true,
      numero: "CAF-78912345",
      tipo: "CAF",
      validade: "2026-03-15"
    },
    localizacao: {
      latitude: -23.4505,
      longitude: -46.5233,
      endereco: "Sítio Recanto Verde - Arujá - SP",
      raio_entrega_km: 55
    },
    produtos: [
      { categoria: "Hortaliças", itens: ["Cenoura", "Beterraba", "Batata Doce", "Mandioca"] },
      { categoria: "Frutas", itens: ["Abacate", "Manga", "Goiaba"] }
    ],
    capacidade_mensal_kg: 600,
    avaliacao: { media: 4.5, total_vendas: 15, tags: ["Grande Volume", "Pontual"] },
    foto_perfil: "👨‍🌾",
    data_cadastro: "2024-04-05",
    indicacoes: 0
  },
  {
    id: "PROD006",
    nome: "Ana Beatriz Lima",
    cpf: "654.987.321-00",
    telefone: "(11) 95678-9012",
    dap_caf: {
      possui: false,
      numero: "",
      tipo: "",
      validade: ""
    },
    localizacao: {
      latitude: -23.5305,
      longitude: -46.7133,
      endereco: "Chácara Sol Nascente - Carapicuíba - SP",
      raio_entrega_km: 35
    },
    produtos: [
      { categoria: "Hortaliças", itens: ["Alface", "Agrião", "Almeirão"] },
      { categoria: "Temperos", itens: ["Hortelã", "Alecrim", "Tomilho"] }
    ],
    capacidade_mensal_kg: 150,
    avaliacao: { media: 4.3, total_vendas: 8, tags: ["Iniciante", "Esforçado"] },
    foto_perfil: "👩‍🌾",
    data_cadastro: "2024-05-12",
    indicacoes: 0
  },
  {
    id: "PROD007",
    nome: "Roberto Carlos Almeida",
    cpf: "147.258.369-00",
    telefone: "(11) 96789-0123",
    dap_caf: {
      possui: true,
      numero: "DAP-14725836",
      tipo: "DAP Física",
      validade: "2025-09-30"
    },
    localizacao: {
      latitude: -23.6105,
      longitude: -46.5633,
      endereco: "Sítio Bela Vista - Suzano - SP",
      raio_entrega_km: 50
    },
    produtos: [
      { categoria: "Frutas", itens: ["Limão", "Laranja", "Tangerina", "Mexerica"] },
      { categoria: "Hortaliças", itens: ["Abobrinha", "Chuchu", "Pepino"] }
    ],
    capacidade_mensal_kg: 450,
    avaliacao: { media: 4.4, total_vendas: 16, tags: ["Cítricos", "Fresco"] },
    foto_perfil: "👨‍🌾",
    data_cadastro: "2024-02-28",
    indicacoes: 2
  },
  {
    id: "PROD008",
    nome: "Luciana Martins",
    cpf: "369.258.147-00",
    telefone: "(11) 97890-1234",
    dap_caf: {
      possui: true,
      numero: "CAF-36925814",
      tipo: "CAF",
      validade: "2026-01-20"
    },
    localizacao: {
      latitude: -23.4205,
      longitude: -46.6433,
      endereco: "Fazenda Três Irmãos - Franco da Rocha - SP",
      raio_entrega_km: 40
    },
    produtos: [
      { categoria: "Proteínas", itens: ["Ovos Caipira", "Mel"] },
      { categoria: "Frutas", itens: ["Jabuticaba", "Pitanga", "Acerola"] }
    ],
    capacidade_mensal_kg: 250,
    avaliacao: { media: 4.9, total_vendas: 22, tags: ["Premium", "Orgânico", "Excelente"] },
    foto_perfil: "👩‍🌾",
    data_cadastro: "2024-01-08",
    indicacoes: 4,
    badge: "Líder Comunitário"
  },
  {
    id: "PROD009",
    nome: "José Fernando Ribeiro",
    cpf: "258.369.147-00",
    telefone: "(11) 98901-2345",
    dap_caf: {
      possui: true,
      numero: "DAP-25836914",
      tipo: "DAP Física",
      validade: "2025-07-10"
    },
    localizacao: {
      latitude: -23.5005,
      longitude: -46.4833,
      endereco: "Sítio Água Limpa - Itaquaquecetuba - SP",
      raio_entrega_km: 45
    },
    produtos: [
      { categoria: "Hortaliças", itens: ["Repolho", "Couve-flor", "Brócolis", "Acelga"] },
      { categoria: "Frutas", itens: ["Caqui", "Pêssego"] }
    ],
    capacidade_mensal_kg: 350,
    avaliacao: { media: 4.2, total_vendas: 10, tags: ["Diversidade", "Bom Preço"] },
    foto_perfil: "👴",
    data_cadastro: "2024-03-22",
    indicacoes: 1
  },
  {
    id: "PROD010",
    nome: "Carla Regina Souza",
    cpf: "963.852.741-00",
    telefone: "(11) 99012-3456",
    dap_caf: {
      possui: true,
      numero: "CAF-96385274",
      tipo: "CAF",
      validade: "2026-04-25"
    },
    localizacao: {
      latitude: -23.5505,
      longitude: -46.7533,
      endereco: "Chácara Flor do Campo - Osasco - SP",
      raio_entrega_km: 30
    },
    produtos: [
      { categoria: "Hortaliças", itens: ["Tomate", "Pimentão", "Berinjela", "Jiló"] },
      { categoria: "Temperos", itens: ["Pimenta", "Coentro", "Cebolinha"] }
    ],
    capacidade_mensal_kg: 280,
    avaliacao: { media: 4.6, total_vendas: 14, tags: ["Variedade", "Fresco", "Confiável"] },
    foto_perfil: "👩‍🌾",
    data_cadastro: "2024-04-18",
    indicacoes: 2
  }
]

// Função para calcular distância entre dois pontos (Haversine)
export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Função para calcular desconto por proximidade
export function calcularDesconto(distanciaKm: number): number {
  return Math.max(0, Math.min(20, (50 - distanciaKm) / 2))
}
