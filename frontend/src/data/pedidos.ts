export interface ItemPedido {
  produto: string
  quantidade_kg: number
  preco_unitario: number
  subtotal: number
}

export interface Avaliacao {
  nota: number
  tags: string[]
  comentario: string
}

export interface Pedido {
  id: string
  escola_id: string
  escola_nome: string
  produtor_id: string
  produtor_nome: string
  data_pedido: string
  data_entrega: string
  status: 'Pendente' | 'Confirmado' | 'Em Transporte' | 'Entregue' | 'Cancelado'
  itens: ItemPedido[]
  total: number
  logistica: 'Entrega pelo Produtor' | 'Retirada pelo Veículo da Prefeitura'
  avaliacao?: Avaliacao
}

export const pedidos: Pedido[] = [
  {
    id: "PED001",
    escola_id: "ESC001",
    escola_nome: "EMEF Prof. Maria Aparecida",
    produtor_id: "PROD001",
    produtor_nome: "João da Silva",
    data_pedido: "2024-12-01",
    data_entrega: "2024-12-05",
    status: "Entregue",
    itens: [
      { produto: "Tomate", quantidade_kg: 50, preco_unitario: 4.50, subtotal: 225.00 },
      { produto: "Alface", quantidade_kg: 20, preco_unitario: 2.50, subtotal: 50.00 }
    ],
    total: 275.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Fresco", "No Prazo", "Bem Embalado"], comentario: "Produtos de excelente qualidade!" }
  },
  {
    id: "PED002",
    escola_id: "ESC002",
    escola_nome: "EMEF Dr. José de Campos",
    produtor_id: "PROD002",
    produtor_nome: "Maria Fernanda Costa",
    data_pedido: "2024-12-02",
    data_entrega: "2024-12-06",
    status: "Entregue",
    itens: [
      { produto: "Rúcula", quantidade_kg: 15, preco_unitario: 8.00, subtotal: 120.00 },
      { produto: "Espinafre", quantidade_kg: 20, preco_unitario: 7.50, subtotal: 150.00 },
      { produto: "Couve", quantidade_kg: 25, preco_unitario: 3.00, subtotal: 75.00 }
    ],
    total: 345.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Orgânico", "Fresco", "Excelente"], comentario: "Melhor fornecedor de folhosos!" }
  },
  {
    id: "PED003",
    escola_id: "ESC003",
    escola_nome: "EMEF Monteiro Lobato",
    produtor_id: "PROD003",
    produtor_nome: "Antônio Pereira",
    data_pedido: "2024-12-03",
    data_entrega: "2024-12-08",
    status: "Entregue",
    itens: [
      { produto: "Morango", quantidade_kg: 10, preco_unitario: 15.00, subtotal: 150.00 },
      { produto: "Amora", quantidade_kg: 5, preco_unitario: 20.00, subtotal: 100.00 }
    ],
    total: 250.00,
    logistica: "Retirada pelo Veículo da Prefeitura",
    avaliacao: { nota: 4, tags: ["Fresco", "Premium"], comentario: "Frutas muito saborosas, crianças adoraram!" }
  },
  {
    id: "PED004",
    escola_id: "ESC001",
    escola_nome: "EMEF Prof. Maria Aparecida",
    produtor_id: "PROD004",
    produtor_nome: "Francisca Oliveira",
    data_pedido: "2024-12-04",
    data_entrega: "2024-12-09",
    status: "Entregue",
    itens: [
      { produto: "Ovos Caipira", quantidade_kg: 30, preco_unitario: 18.00, subtotal: 540.00 },
      { produto: "Queijo Minas", quantidade_kg: 10, preco_unitario: 35.00, subtotal: 350.00 }
    ],
    total: 890.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Qualidade", "Confiável", "No Prazo"], comentario: "Ovos sempre fresquinhos!" }
  },
  {
    id: "PED005",
    escola_id: "ESC004",
    escola_nome: "EMEF Paulo Freire",
    produtor_id: "PROD005",
    produtor_nome: "Pedro Henrique Santos",
    data_pedido: "2024-12-05",
    data_entrega: "2024-12-10",
    status: "Entregue",
    itens: [
      { produto: "Cenoura", quantidade_kg: 40, preco_unitario: 3.80, subtotal: 152.00 },
      { produto: "Beterraba", quantidade_kg: 30, preco_unitario: 3.20, subtotal: 96.00 },
      { produto: "Batata Doce", quantidade_kg: 50, preco_unitario: 4.50, subtotal: 225.00 }
    ],
    total: 473.00,
    logistica: "Retirada pelo Veículo da Prefeitura",
    avaliacao: { nota: 4, tags: ["Grande Volume", "Pontual"], comentario: "Ótimo custo-benefício" }
  },
  {
    id: "PED006",
    escola_id: "ESC002",
    escola_nome: "EMEF Dr. José de Campos",
    produtor_id: "PROD001",
    produtor_nome: "João da Silva",
    data_pedido: "2024-12-06",
    data_entrega: "2024-12-11",
    status: "Entregue",
    itens: [
      { produto: "Banana", quantidade_kg: 60, preco_unitario: 3.50, subtotal: 210.00 },
      { produto: "Laranja", quantidade_kg: 40, preco_unitario: 2.80, subtotal: 112.00 }
    ],
    total: 322.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Fresco", "No Prazo"], comentario: "Frutas perfeitas para o lanche!" }
  },
  {
    id: "PED007",
    escola_id: "ESC005",
    escola_nome: "EMEF Cecília Meireles",
    produtor_id: "PROD008",
    produtor_nome: "Luciana Martins",
    data_pedido: "2024-12-07",
    data_entrega: "2024-12-12",
    status: "Entregue",
    itens: [
      { produto: "Mel", quantidade_kg: 5, preco_unitario: 40.00, subtotal: 200.00 },
      { produto: "Ovos Caipira", quantidade_kg: 20, preco_unitario: 18.00, subtotal: 360.00 }
    ],
    total: 560.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Premium", "Orgânico", "Excelente"], comentario: "Mel divino! Crianças amaram!" }
  },
  {
    id: "PED008",
    escola_id: "ESC003",
    escola_nome: "EMEF Monteiro Lobato",
    produtor_id: "PROD007",
    produtor_nome: "Roberto Carlos Almeida",
    data_pedido: "2024-12-08",
    data_entrega: "2024-12-13",
    status: "Em Transporte",
    itens: [
      { produto: "Laranja", quantidade_kg: 50, preco_unitario: 2.80, subtotal: 140.00 },
      { produto: "Limão", quantidade_kg: 20, preco_unitario: 3.50, subtotal: 70.00 }
    ],
    total: 210.00,
    logistica: "Entrega pelo Produtor"
  },
  {
    id: "PED009",
    escola_id: "ESC001",
    escola_nome: "EMEF Prof. Maria Aparecida",
    produtor_id: "PROD010",
    produtor_nome: "Carla Regina Souza",
    data_pedido: "2024-12-09",
    data_entrega: "2024-12-14",
    status: "Confirmado",
    itens: [
      { produto: "Tomate", quantidade_kg: 35, preco_unitario: 4.50, subtotal: 157.50 },
      { produto: "Pimentão", quantidade_kg: 15, preco_unitario: 6.00, subtotal: 90.00 }
    ],
    total: 247.50,
    logistica: "Entrega pelo Produtor"
  },
  {
    id: "PED010",
    escola_id: "ESC004",
    escola_nome: "EMEF Paulo Freire",
    produtor_id: "PROD002",
    produtor_nome: "Maria Fernanda Costa",
    data_pedido: "2024-12-10",
    data_entrega: "2024-12-15",
    status: "Pendente",
    itens: [
      { produto: "Brócolis", quantidade_kg: 25, preco_unitario: 6.50, subtotal: 162.50 },
      { produto: "Couve", quantidade_kg: 20, preco_unitario: 3.00, subtotal: 60.00 }
    ],
    total: 222.50,
    logistica: "Retirada pelo Veículo da Prefeitura"
  },
  {
    id: "PED011",
    escola_id: "ESC001",
    escola_nome: "EMEF Prof. Maria Aparecida",
    produtor_id: "PROD001",
    produtor_nome: "João da Silva",
    data_pedido: "2024-11-15",
    data_entrega: "2024-11-20",
    status: "Entregue",
    itens: [
      { produto: "Cenoura", quantidade_kg: 45, preco_unitario: 3.80, subtotal: 171.00 }
    ],
    total: 171.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Fresco", "No Prazo"], comentario: "Cenouras crocantes e doces!" }
  },
  {
    id: "PED012",
    escola_id: "ESC002",
    escola_nome: "EMEF Dr. José de Campos",
    produtor_id: "PROD004",
    produtor_nome: "Francisca Oliveira",
    data_pedido: "2024-11-18",
    data_entrega: "2024-11-23",
    status: "Entregue",
    itens: [
      { produto: "Frango Caipira", quantidade_kg: 30, preco_unitario: 25.00, subtotal: 750.00 }
    ],
    total: 750.00,
    logistica: "Retirada pelo Veículo da Prefeitura",
    avaliacao: { nota: 4, tags: ["Qualidade", "Saboroso"], comentario: "Frango muito saboroso!" }
  },
  {
    id: "PED013",
    escola_id: "ESC003",
    escola_nome: "EMEF Monteiro Lobato",
    produtor_id: "PROD001",
    produtor_nome: "João da Silva",
    data_pedido: "2024-11-20",
    data_entrega: "2024-11-25",
    status: "Entregue",
    itens: [
      { produto: "Mamão", quantidade_kg: 30, preco_unitario: 4.20, subtotal: 126.00 },
      { produto: "Banana", quantidade_kg: 40, preco_unitario: 3.50, subtotal: 140.00 }
    ],
    total: 266.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Fresco", "Bem Embalado"], comentario: "Frutas maduras no ponto certo!" }
  },
  {
    id: "PED014",
    escola_id: "ESC004",
    escola_nome: "EMEF Paulo Freire",
    produtor_id: "PROD009",
    produtor_nome: "José Fernando Ribeiro",
    data_pedido: "2024-11-22",
    data_entrega: "2024-11-27",
    status: "Entregue",
    itens: [
      { produto: "Repolho", quantidade_kg: 25, preco_unitario: 2.50, subtotal: 62.50 },
      { produto: "Couve-flor", quantidade_kg: 20, preco_unitario: 5.00, subtotal: 100.00 }
    ],
    total: 162.50,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 4, tags: ["Diversidade", "Bom Preço"], comentario: "Bom custo-benefício" }
  },
  {
    id: "PED015",
    escola_id: "ESC005",
    escola_nome: "EMEF Cecília Meireles",
    produtor_id: "PROD002",
    produtor_nome: "Maria Fernanda Costa",
    data_pedido: "2024-11-25",
    data_entrega: "2024-11-30",
    status: "Entregue",
    itens: [
      { produto: "Manjericão", quantidade_kg: 3, preco_unitario: 25.00, subtotal: 75.00 },
      { produto: "Salsa", quantidade_kg: 5, preco_unitario: 15.00, subtotal: 75.00 }
    ],
    total: 150.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Orgânico", "Aromático"], comentario: "Temperos incríveis!" }
  },
  {
    id: "PED016",
    escola_id: "ESC001",
    escola_nome: "EMEF Prof. Maria Aparecida",
    produtor_id: "PROD008",
    produtor_nome: "Luciana Martins",
    data_pedido: "2024-11-28",
    data_entrega: "2024-12-03",
    status: "Entregue",
    itens: [
      { produto: "Acerola", quantidade_kg: 15, preco_unitario: 12.00, subtotal: 180.00 }
    ],
    total: 180.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Vitamina C", "Fresco"], comentario: "Acerolas super vitaminadas!" }
  },
  {
    id: "PED017",
    escola_id: "ESC002",
    escola_nome: "EMEF Dr. José de Campos",
    produtor_id: "PROD005",
    produtor_nome: "Pedro Henrique Santos",
    data_pedido: "2024-10-15",
    data_entrega: "2024-10-20",
    status: "Entregue",
    itens: [
      { produto: "Mandioca", quantidade_kg: 60, preco_unitario: 3.50, subtotal: 210.00 },
      { produto: "Abacate", quantidade_kg: 25, preco_unitario: 8.00, subtotal: 200.00 }
    ],
    total: 410.00,
    logistica: "Retirada pelo Veículo da Prefeitura",
    avaliacao: { nota: 4, tags: ["Grande Volume"], comentario: "Mandioca de boa qualidade" }
  },
  {
    id: "PED018",
    escola_id: "ESC003",
    escola_nome: "EMEF Monteiro Lobato",
    produtor_id: "PROD010",
    produtor_nome: "Carla Regina Souza",
    data_pedido: "2024-10-18",
    data_entrega: "2024-10-23",
    status: "Entregue",
    itens: [
      { produto: "Berinjela", quantidade_kg: 20, preco_unitario: 4.50, subtotal: 90.00 },
      { produto: "Jiló", quantidade_kg: 15, preco_unitario: 4.00, subtotal: 60.00 }
    ],
    total: 150.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 3, tags: ["Rejeição Alta"], comentario: "Crianças não aceitaram muito bem o jiló" }
  },
  {
    id: "PED019",
    escola_id: "ESC004",
    escola_nome: "EMEF Paulo Freire",
    produtor_id: "PROD001",
    produtor_nome: "João da Silva",
    data_pedido: "2024-10-20",
    data_entrega: "2024-10-25",
    status: "Entregue",
    itens: [
      { produto: "Tomate", quantidade_kg: 40, preco_unitario: 4.50, subtotal: 180.00 },
      { produto: "Cenoura", quantidade_kg: 30, preco_unitario: 3.80, subtotal: 114.00 }
    ],
    total: 294.00,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 5, tags: ["Fresco", "Confiável"], comentario: "Sempre entrega no prazo!" }
  },
  {
    id: "PED020",
    escola_id: "ESC005",
    escola_nome: "EMEF Cecília Meireles",
    produtor_id: "PROD007",
    produtor_nome: "Roberto Carlos Almeida",
    data_pedido: "2024-10-22",
    data_entrega: "2024-10-27",
    status: "Entregue",
    itens: [
      { produto: "Pepino", quantidade_kg: 20, preco_unitario: 3.00, subtotal: 60.00 },
      { produto: "Abobrinha", quantidade_kg: 25, preco_unitario: 3.50, subtotal: 87.50 }
    ],
    total: 147.50,
    logistica: "Entrega pelo Produtor",
    avaliacao: { nota: 4, tags: ["Fresco", "Bom Preço"], comentario: "Legumes bem frescos" }
  }
]

// Métricas calculadas
export function calcularMetricasGerais() {
  const totalPedidos = pedidos.length
  const pedidosEntregues = pedidos.filter(p => p.status === 'Entregue')
  const totalGasto = pedidosEntregues.reduce((acc, p) => acc + p.total, 0)
  
  const avaliacoes = pedidosEntregues.filter(p => p.avaliacao)
  const mediaGeral = avaliacoes.reduce((acc, p) => acc + (p.avaliacao?.nota || 0), 0) / avaliacoes.length
  
  return {
    totalPedidos,
    pedidosEntregues: pedidosEntregues.length,
    totalGasto,
    mediaGeral: mediaGeral.toFixed(1)
  }
}

export function getRankingEscolas() {
  const gastosPorEscola = pedidos
    .filter(p => p.status === 'Entregue')
    .reduce((acc, p) => {
      acc[p.escola_nome] = (acc[p.escola_nome] || 0) + p.total
      return acc
    }, {} as Record<string, number>)
  
  return Object.entries(gastosPorEscola)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
}

export function getRankingProdutores() {
  const vendasPorProdutor = pedidos
    .filter(p => p.status === 'Entregue')
    .reduce((acc, p) => {
      if (!acc[p.produtor_nome]) {
        acc[p.produtor_nome] = { vendas: 0, total: 0, notas: [] }
      }
      acc[p.produtor_nome].vendas++
      acc[p.produtor_nome].total += p.total
      if (p.avaliacao) {
        acc[p.produtor_nome].notas.push(p.avaliacao.nota)
      }
      return acc
    }, {} as Record<string, { vendas: number; total: number; notas: number[] }>)
  
  return Object.entries(vendasPorProdutor)
    .map(([nome, data]) => ({
      nome,
      vendas: data.vendas,
      total: data.total,
      media: data.notas.length > 0 
        ? (data.notas.reduce((a, b) => a + b, 0) / data.notas.length).toFixed(1)
        : 'N/A'
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
}
