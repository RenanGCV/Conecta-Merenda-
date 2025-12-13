export interface Escola {
  id: string
  nome: string
  tipo: string
  endereco: string
  num_alunos: number
  orcamento_mensal: number
  contato: {
    responsavel: string
    telefone: string
    email: string
  }
  localizacao: {
    latitude: number
    longitude: number
    endereco: string
  }
  gasto_agricultura_familiar: number
}

export const escolas: Escola[] = [
  {
    id: "ESC001",
    nome: "EMEF Prof. Maria Aparecida",
    tipo: "Municipal",
    endereco: "Rua das Flores, 123 - Vila Mariana - São Paulo - SP",
    num_alunos: 450,
    orcamento_mensal: 15000.00,
    contato: {
      responsavel: "Ana Paula Souza",
      telefone: "(11) 3456-7890",
      email: "ana.souza@educacao.sp.gov.br"
    },
    localizacao: {
      latitude: -23.5489,
      longitude: -46.6388,
      endereco: "Rua das Flores, 123 - Vila Mariana - São Paulo - SP"
    },
    gasto_agricultura_familiar: 5200.00
  },
  {
    id: "ESC002",
    nome: "EMEF Dr. José de Campos",
    tipo: "Municipal",
    endereco: "Av. Brasil, 456 - Mooca - São Paulo - SP",
    num_alunos: 620,
    orcamento_mensal: 20000.00,
    contato: {
      responsavel: "Marcos Roberto Lima",
      telefone: "(11) 3567-8901",
      email: "marcos.lima@educacao.sp.gov.br"
    },
    localizacao: {
      latitude: -23.5289,
      longitude: -46.6188,
      endereco: "Av. Brasil, 456 - Mooca - São Paulo - SP"
    },
    gasto_agricultura_familiar: 7500.00
  },
  {
    id: "ESC003",
    nome: "EMEF Monteiro Lobato",
    tipo: "Municipal",
    endereco: "Rua Emília, 789 - Ipiranga - São Paulo - SP",
    num_alunos: 380,
    orcamento_mensal: 12500.00,
    contato: {
      responsavel: "Fernanda Costa",
      telefone: "(11) 3678-9012",
      email: "fernanda.costa@educacao.sp.gov.br"
    },
    localizacao: {
      latitude: -23.5689,
      longitude: -46.6588,
      endereco: "Rua Emília, 789 - Ipiranga - São Paulo - SP"
    },
    gasto_agricultura_familiar: 3800.00
  },
  {
    id: "ESC004",
    nome: "EMEF Paulo Freire",
    tipo: "Estadual",
    endereco: "Rua da Educação, 321 - Penha - São Paulo - SP",
    num_alunos: 520,
    orcamento_mensal: 17000.00,
    contato: {
      responsavel: "Ricardo Santos",
      telefone: "(11) 3789-0123",
      email: "ricardo.santos@educacao.sp.gov.br"
    },
    localizacao: {
      latitude: -23.5089,
      longitude: -46.5988,
      endereco: "Rua da Educação, 321 - Penha - São Paulo - SP"
    },
    gasto_agricultura_familiar: 6100.00
  },
  {
    id: "ESC005",
    nome: "EMEF Cecília Meireles",
    tipo: "CMEI",
    endereco: "Av. das Artes, 567 - Lapa - São Paulo - SP",
    num_alunos: 280,
    orcamento_mensal: 10000.00,
    contato: {
      responsavel: "Juliana Almeida",
      telefone: "(11) 3890-1234",
      email: "juliana.almeida@educacao.sp.gov.br"
    },
    localizacao: {
      latitude: -23.5189,
      longitude: -46.6888,
      endereco: "Av. das Artes, 567 - Lapa - São Paulo - SP"
    },
    gasto_agricultura_familiar: 4200.00
  }
]
