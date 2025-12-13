import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, RefreshCw, ShoppingCart, AlertTriangle, 
  Leaf, TrendingUp, Check, Info, ChevronDown, ChevronUp
} from 'lucide-react'
import { safra } from '../../data/safra'
import { getAlertasAtivos } from '../../data/clima'

interface CardapioItem {
  dia: string
  refeicao: string
  produtos: string[]
  alternativas: string[]
  impactoClimatico: boolean
}

export default function IACardapio() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [cardapioGerado, setCardapioGerado] = useState(false)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [carrinho, setCarrinho] = useState<string[]>([])

  const alertasAtivos = getAlertasAtivos()
  const produtosSafra = safra.filter(p => p.disponibilidade === 'Alta')
  
  const cardapioSemanal: CardapioItem[] = [
    { 
      dia: 'Segunda-feira', 
      refeicao: 'Arroz, feijão, frango grelhado, salada de alface e tomate, banana',
      produtos: ['Arroz', 'Feijão Carioca', 'Alface Crespa', 'Tomate', 'Banana Prata'],
      alternativas: ['Rúcula no lugar de alface', 'Laranja no lugar de banana'],
      impactoClimatico: false
    },
    { 
      dia: 'Terça-feira', 
      refeicao: 'Macarrão com molho de tomate, carne moída, salada de beterraba, laranja',
      produtos: ['Tomate', 'Beterraba', 'Laranja'],
      alternativas: ['Cenoura ralada no lugar de beterraba'],
      impactoClimatico: true
    },
    { 
      dia: 'Quarta-feira', 
      refeicao: 'Arroz, feijão, peixe assado, salada de cenoura e repolho, abacaxi',
      produtos: ['Feijão Carioca', 'Cenoura', 'Repolho', 'Abacaxi'],
      alternativas: ['Couve no lugar de repolho'],
      impactoClimatico: false
    },
    { 
      dia: 'Quinta-feira', 
      refeicao: 'Sopa de legumes com macarrão, pão integral, suco de laranja',
      produtos: ['Cenoura', 'Batata', 'Chuchu', 'Laranja'],
      alternativas: ['Abóbora no lugar de batata', 'Limão no lugar de laranja'],
      impactoClimatico: false
    },
    { 
      dia: 'Sexta-feira', 
      refeicao: 'Arroz, feijão, omelete, salada de pepino e tomate, melancia',
      produtos: ['Feijão Carioca', 'Ovos Caipira', 'Pepino', 'Tomate', 'Melancia'],
      alternativas: ['Maxixe no lugar de pepino'],
      impactoClimatico: false
    },
  ]

  const handleGerarCardapio = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setCardapioGerado(true)
    }, 2500)
  }

  const handleAdicionarCarrinho = (produtos: string[]) => {
    const novosProdutos = produtos.filter(p => !carrinho.includes(p))
    setCarrinho([...carrinho, ...novosProdutos])
  }

  const getNutrientInfo = (produto: string) => {
    const item = safra.find(s => s.nome === produto)
    return item?.info_nutricional || { calorias: 0, proteinas: 0, carboidratos: 0, fibras: 0 }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-7 h-7" />
                Cardápio Inteligente com IA
              </h1>
              <p className="text-purple-100">
                Sugestões nutricionais baseadas na safra local e alertas climáticos
              </p>
            </div>
            <button
              onClick={handleGerarCardapio}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Cardápio
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Alerta Climático */}
      {alertasAtivos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">
                ⚠️ A IA considerou: {alertasAtivos[0].tipo} prevista afetará {alertasAtivos[0].impacto_produtos.join(', ')}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Alternativas foram sugeridas automaticamente no cardápio
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Produtos em Alta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-slate-800">🌿 Produtos em Alta na Safra</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {produtosSafra.slice(0, 8).map((produto) => (
            <span 
              key={produto.id}
              className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
            >
              {produto.nome} • R$ {produto.preco_medio.toFixed(2)}/kg
            </span>
          ))}
        </div>
      </motion.div>

      {/* Cardápio Gerado */}
      <AnimatePresence>
        {cardapioGerado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span>📅</span> Cardápio Semanal Sugerido
              </h2>
              {carrinho.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="font-medium">{carrinho.length} produtos no pedido</span>
                </div>
              )}
            </div>

            {cardapioSemanal.map((dia, index) => (
              <motion.div
                key={dia.dia}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                  dia.impactoClimatico ? 'border-amber-200' : 'border-slate-100'
                }`}
              >
                <div 
                  className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedDay(expandedDay === dia.dia ? null : dia.dia)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        dia.impactoClimatico ? 'bg-amber-100' : 'bg-purple-100'
                      }`}>
                        <span className="text-xl">
                          {index === 0 ? '🌙' : index === 1 ? '🔥' : index === 2 ? '💧' : index === 3 ? '⚡' : '🌟'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800">{dia.dia}</h3>
                          {dia.impactoClimatico && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                              ⚠️ Ajuste climático
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-0.5">{dia.refeicao}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAdicionarCarrinho(dia.produtos)
                        }}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center gap-1"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Adicionar
                      </button>
                      {expandedDay === dia.dia ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedDay === dia.dia && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 overflow-hidden"
                    >
                      <div className="p-4 bg-slate-50 space-y-4">
                        {/* Produtos */}
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-600" />
                            Produtos da Agricultura Familiar
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {dia.produtos.map((produto) => {
                              const nutri = getNutrientInfo(produto)
                              return (
                                <span 
                                  key={produto}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${
                                    carrinho.includes(produto) 
                                      ? 'bg-green-100 text-green-700 border border-green-300' 
                                      : 'bg-white text-slate-700 border border-slate-200'
                                  }`}
                                  title={`${nutri.calorias} kcal | ${nutri.proteinas}g proteína`}
                                >
                                  {carrinho.includes(produto) && <Check className="w-3 h-3" />}
                                  {produto}
                                </span>
                              )
                            })}
                          </div>
                        </div>

                        {/* Alternativas */}
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                            <Info className="w-4 h-4 text-blue-600" />
                            Alternativas Sugeridas pela IA
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {dia.alternativas.map((alt) => (
                              <span 
                                key={alt}
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200"
                              >
                                💡 {alt}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Info Nutricional */}
                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            Estimativa Nutricional da Refeição
                          </p>
                          <div className="grid grid-cols-4 gap-3">
                            {[
                              { label: 'Calorias', value: '450 kcal', color: 'orange' },
                              { label: 'Proteínas', value: '25g', color: 'red' },
                              { label: 'Carboidratos', value: '55g', color: 'blue' },
                              { label: 'Fibras', value: '8g', color: 'green' },
                            ].map((nutri) => (
                              <div key={nutri.label} className="text-center p-2 bg-white rounded-lg border border-slate-200">
                                <p className={`text-lg font-bold text-${nutri.color}-600`}>{nutri.value}</p>
                                <p className="text-xs text-slate-500">{nutri.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Botão Finalizar Pedido */}
            {carrinho.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
              >
                <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <ShoppingCart className="w-5 h-5" />
                  Ir para Busca de Produtores ({carrinho.length} produtos)
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder antes de gerar */}
      {!cardapioGerado && !isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Clique em "Gerar Cardápio" para começar
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            A IA vai analisar a safra disponível, alertas climáticos e necessidades 
            nutricionais para sugerir o melhor cardápio semanal.
          </p>
        </motion.div>
      )}

      {/* Loading */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Sparkles className="w-12 h-12 text-purple-600" />
            <div className="absolute inset-0 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Analisando dados...
          </h3>
          <p className="text-slate-500">
            Verificando safra, preços, alertas climáticos e informações nutricionais
          </p>
        </motion.div>
      )}
    </div>
  )
}
