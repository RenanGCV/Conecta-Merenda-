export interface ProdutoSafra {
  nome: string
  categoria: string
  disponibilidade: 'Alta' | 'Média' | 'Baixa'
  preco_medio_kg: number
  nutricao: {
    calorias: number
    vitaminas: string[]
    minerais: string[]
  }
  alternativa_nutricional_para?: string[]
  emoji: string
}

export interface Safra {
  regiao: string
  mes_referencia: string
  produtos_safra: ProdutoSafra[]
}

export const safraRegional: Safra = {
  regiao: "Sudeste",
  mes_referencia: "Dezembro",
  produtos_safra: [
    {
      nome: "Tomate",
      categoria: "Hortaliças",
      disponibilidade: "Alta",
      preco_medio_kg: 4.50,
      nutricao: { calorias: 18, vitaminas: ["C", "A"], minerais: ["Potássio"] },
      emoji: "🍅"
    },
    {
      nome: "Beterraba",
      categoria: "Hortaliças",
      disponibilidade: "Média",
      preco_medio_kg: 3.20,
      nutricao: { calorias: 43, vitaminas: ["C", "B9"], minerais: ["Ferro", "Potássio"] },
      alternativa_nutricional_para: ["Cenoura"],
      emoji: "🥬"
    },
    {
      nome: "Cenoura",
      categoria: "Hortaliças",
      disponibilidade: "Alta",
      preco_medio_kg: 3.80,
      nutricao: { calorias: 41, vitaminas: ["A", "K"], minerais: ["Potássio"] },
      alternativa_nutricional_para: ["Beterraba", "Batata Doce"],
      emoji: "🥕"
    },
    {
      nome: "Alface",
      categoria: "Hortaliças",
      disponibilidade: "Alta",
      preco_medio_kg: 2.50,
      nutricao: { calorias: 14, vitaminas: ["K", "A"], minerais: ["Cálcio"] },
      emoji: "🥬"
    },
    {
      nome: "Couve",
      categoria: "Hortaliças",
      disponibilidade: "Alta",
      preco_medio_kg: 3.00,
      nutricao: { calorias: 36, vitaminas: ["K", "C", "A"], minerais: ["Cálcio", "Ferro"] },
      alternativa_nutricional_para: ["Espinafre", "Brócolis"],
      emoji: "🥬"
    },
    {
      nome: "Brócolis",
      categoria: "Hortaliças",
      disponibilidade: "Média",
      preco_medio_kg: 6.50,
      nutricao: { calorias: 34, vitaminas: ["C", "K"], minerais: ["Ferro", "Potássio"] },
      alternativa_nutricional_para: ["Couve-flor", "Couve"],
      emoji: "🥦"
    },
    {
      nome: "Banana",
      categoria: "Frutas",
      disponibilidade: "Alta",
      preco_medio_kg: 3.50,
      nutricao: { calorias: 89, vitaminas: ["B6", "C"], minerais: ["Potássio", "Magnésio"] },
      emoji: "🍌"
    },
    {
      nome: "Laranja",
      categoria: "Frutas",
      disponibilidade: "Alta",
      preco_medio_kg: 2.80,
      nutricao: { calorias: 47, vitaminas: ["C"], minerais: ["Potássio"] },
      alternativa_nutricional_para: ["Tangerina", "Limão"],
      emoji: "🍊"
    },
    {
      nome: "Mamão",
      categoria: "Frutas",
      disponibilidade: "Alta",
      preco_medio_kg: 4.20,
      nutricao: { calorias: 43, vitaminas: ["C", "A"], minerais: ["Potássio"] },
      emoji: "🥭"
    },
    {
      nome: "Manga",
      categoria: "Frutas",
      disponibilidade: "Alta",
      preco_medio_kg: 5.00,
      nutricao: { calorias: 60, vitaminas: ["C", "A"], minerais: ["Potássio"] },
      emoji: "🥭"
    },
    {
      nome: "Morango",
      categoria: "Frutas",
      disponibilidade: "Média",
      preco_medio_kg: 15.00,
      nutricao: { calorias: 32, vitaminas: ["C"], minerais: ["Manganês"] },
      emoji: "🍓"
    },
    {
      nome: "Abacaxi",
      categoria: "Frutas",
      disponibilidade: "Alta",
      preco_medio_kg: 4.00,
      nutricao: { calorias: 50, vitaminas: ["C", "B6"], minerais: ["Manganês"] },
      emoji: "🍍"
    },
    {
      nome: "Batata Doce",
      categoria: "Hortaliças",
      disponibilidade: "Alta",
      preco_medio_kg: 4.50,
      nutricao: { calorias: 86, vitaminas: ["A", "C"], minerais: ["Potássio"] },
      alternativa_nutricional_para: ["Cenoura", "Abóbora"],
      emoji: "🍠"
    },
    {
      nome: "Mandioca",
      categoria: "Hortaliças",
      disponibilidade: "Alta",
      preco_medio_kg: 3.50,
      nutricao: { calorias: 160, vitaminas: ["C"], minerais: ["Potássio", "Magnésio"] },
      emoji: "🥔"
    },
    {
      nome: "Abóbora",
      categoria: "Hortaliças",
      disponibilidade: "Alta",
      preco_medio_kg: 3.00,
      nutricao: { calorias: 26, vitaminas: ["A", "C"], minerais: ["Potássio"] },
      alternativa_nutricional_para: ["Cenoura", "Batata Doce"],
      emoji: "🎃"
    },
    {
      nome: "Ovos Caipira",
      categoria: "Proteínas",
      disponibilidade: "Alta",
      preco_medio_kg: 18.00,
      nutricao: { calorias: 155, vitaminas: ["B12", "D"], minerais: ["Ferro", "Zinco"] },
      emoji: "🥚"
    },
    {
      nome: "Frango Caipira",
      categoria: "Proteínas",
      disponibilidade: "Média",
      preco_medio_kg: 25.00,
      nutricao: { calorias: 239, vitaminas: ["B6", "B12"], minerais: ["Zinco", "Fósforo"] },
      emoji: "🍗"
    },
    {
      nome: "Mel",
      categoria: "Proteínas",
      disponibilidade: "Média",
      preco_medio_kg: 40.00,
      nutricao: { calorias: 304, vitaminas: ["C"], minerais: ["Potássio"] },
      emoji: "🍯"
    },
    {
      nome: "Queijo Minas",
      categoria: "Laticínios",
      disponibilidade: "Média",
      preco_medio_kg: 35.00,
      nutricao: { calorias: 264, vitaminas: ["A", "B12"], minerais: ["Cálcio", "Fósforo"] },
      emoji: "🧀"
    },
    {
      nome: "Requeijão",
      categoria: "Laticínios",
      disponibilidade: "Média",
      preco_medio_kg: 28.00,
      nutricao: { calorias: 257, vitaminas: ["A", "B12"], minerais: ["Cálcio"] },
      emoji: "🧀"
    }
  ]
}

// Encontrar alternativa nutricional
export function encontrarAlternativa(alimentoRejeitado: string): ProdutoSafra | null {
  const alternativas = safraRegional.produtos_safra.filter(p => 
    p.alternativa_nutricional_para?.includes(alimentoRejeitado) &&
    p.disponibilidade !== 'Baixa'
  )
  
  if (alternativas.length === 0) return null
  
  // Ordenar por disponibilidade e preço
  alternativas.sort((a, b) => {
    if (a.disponibilidade === 'Alta' && b.disponibilidade !== 'Alta') return -1
    if (b.disponibilidade === 'Alta' && a.disponibilidade !== 'Alta') return 1
    return a.preco_medio_kg - b.preco_medio_kg
  })
  
  return alternativas[0]
}

// Alias para compatibilidade
export const safra = safraRegional.produtos_safra.map((p, index) => ({
  id: `prod-${index + 1}`,
  nome: p.nome,
  categoria: p.categoria,
  disponibilidade: p.disponibilidade,
  preco_medio: p.preco_medio_kg,
  info_nutricional: {
    calorias: p.nutricao.calorias,
    proteinas: Math.floor(Math.random() * 5) + 1,
    carboidratos: Math.floor(Math.random() * 15) + 5,
    fibras: Math.floor(Math.random() * 5) + 1
  },
  emoji: p.emoji
}))
