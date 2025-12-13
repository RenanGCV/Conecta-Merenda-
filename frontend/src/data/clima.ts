export interface AlertaClima {
  id: string
  regiao: string
  tipo: 'Chuva Intensa' | 'Seca Prolongada' | 'Geada' | 'Granizo'
  severidade: 'Baixa' | 'Média' | 'Alta'
  data_inicio: string
  data_fim: string
  impacto_produtos: string[]
  recomendacao: string
}

export const alertasClima: AlertaClima[] = [
  {
    id: "ALERT001",
    regiao: "Sudeste",
    tipo: "Chuva Intensa",
    severidade: "Média",
    data_inicio: "2024-12-18",
    data_fim: "2024-12-22",
    impacto_produtos: ["Tomate", "Alface", "Morango"],
    recomendacao: "Antecipar compras de folhosos ou buscar fornecedores de regiões não afetadas. Produtos sensíveis à umidade podem ter qualidade comprometida."
  },
  {
    id: "ALERT002",
    regiao: "Sudeste",
    tipo: "Seca Prolongada",
    severidade: "Alta",
    data_inicio: "2025-01-05",
    data_fim: "2025-01-20",
    impacto_produtos: ["Cenoura", "Beterraba", "Mandioca", "Batata Doce"],
    recomendacao: "Estocar raízes e tubérculos antes do período seco. Preços podem subir 20-30%. Considerar fornecedores com irrigação."
  },
  {
    id: "ALERT003",
    regiao: "Sul",
    tipo: "Geada",
    severidade: "Baixa",
    data_inicio: "2024-12-25",
    data_fim: "2024-12-27",
    impacto_produtos: ["Banana", "Mamão"],
    recomendacao: "Frutas tropicais podem ter oferta reduzida do Sul. Priorizar fornecedores do Sudeste para estas frutas."
  }
]

export function getAlertasAtivos(): AlertaClima[] {
  const hoje = new Date()
  return alertasClima.filter(alerta => {
    const inicio = new Date(alerta.data_inicio)
    const fim = new Date(alerta.data_fim)
    // Mostrar alertas que vão acontecer nos próximos 7 dias ou estão ativos
    const em7Dias = new Date()
    em7Dias.setDate(em7Dias.getDate() + 7)
    return inicio <= em7Dias && fim >= hoje
  })
}
