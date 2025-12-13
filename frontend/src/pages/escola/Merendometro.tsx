import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ThumbsUp, ThumbsDown, Calendar, Users, TrendingUp, 
  ChefHat, AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import { safra } from '../../data/safra'

interface FeedbackItem {
  id: string
  data: string
  turma: string
  produto: string
  aceitacao: 'alta' | 'media' | 'baixa'
  comentario: string
  quantidade_sobra: number
}

export default function Merendometro() {
  const [showForm, setShowForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedTurma, setSelectedTurma] = useState('')
  const [aceitacao, setAceitacao] = useState<'alta' | 'media' | 'baixa' | null>(null)
  const [comentario, setComentario] = useState('')
  const [sobra, setSobra] = useState(0)
  const [feedbackSalvo, setFeedbackSalvo] = useState(false)
  
  const [feedbackHistorico] = useState<FeedbackItem[]>([
    { id: '1', data: '2025-01-08', turma: '5º Ano A', produto: 'Alface Crespa', aceitacao: 'alta', comentario: 'Alunos adoraram na salada', quantidade_sobra: 5 },
    { id: '2', data: '2025-01-08', turma: '3º Ano B', produto: 'Cenoura', aceitacao: 'media', comentario: 'Preferem ralada com laranja', quantidade_sobra: 20 },
    { id: '3', data: '2025-01-07', turma: '4º Ano A', produto: 'Beterraba', aceitacao: 'baixa', comentario: 'Muita rejeição, tentar preparos diferentes', quantidade_sobra: 45 },
    { id: '4', data: '2025-01-07', turma: '1º Ano', produto: 'Banana Prata', aceitacao: 'alta', comentario: 'Excelente aceitação como sobremesa', quantidade_sobra: 3 },
    { id: '5', data: '2025-01-06', turma: '2º Ano B', produto: 'Feijão Carioca', aceitacao: 'alta', comentario: 'Bem temperado, todos repetiram', quantidade_sobra: 8 },
  ])

  const turmas = ['1º Ano', '2º Ano A', '2º Ano B', '3º Ano A', '3º Ano B', '4º Ano A', '4º Ano B', '5º Ano A', '5º Ano B']
  const produtosUsados = safra.slice(0, 10)

  const estatisticas = {
    avaliacoes_hoje: 4,
    aceitacao_media: 78,
    sobra_media: 12,
    produtos_populares: ['Banana Prata', 'Alface Crespa', 'Feijão Carioca']
  }

  const handleSalvarFeedback = () => {
    if (!selectedProduct || !selectedTurma || !aceitacao) return
    
    setFeedbackSalvo(true)
    setTimeout(() => {
      setFeedbackSalvo(false)
      setShowForm(false)
      setSelectedProduct('')
      setSelectedTurma('')
      setAceitacao(null)
      setComentario('')
      setSobra(0)
    }, 2000)
  }

  const getAceitacaoColor = (nivel: string) => {
    switch(nivel) {
      case 'alta': return 'bg-green-100 text-green-700 border-green-200'
      case 'media': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'baixa': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getAceitacaoIcon = (nivel: string) => {
    switch(nivel) {
      case 'alta': return <ThumbsUp className="w-4 h-4" />
      case 'media': return <AlertCircle className="w-4 h-4" />
      case 'baixa': return <ThumbsDown className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>📊</span> Merendômetro
            </h1>
            <p className="text-purple-100">
              Registre o feedback dos professores sobre a aceitação dos alimentos
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
          >
            <ChefHat className="w-5 h-5" />
            <span className="font-medium">Novo Registro</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Registros Hoje', value: estatisticas.avaliacoes_hoje, color: 'blue' },
          { icon: TrendingUp, label: 'Aceitação Média', value: `${estatisticas.aceitacao_media}%`, color: 'green' },
          { icon: AlertCircle, label: 'Sobra Média', value: `${estatisticas.sobra_media}%`, color: 'amber' },
          { icon: Users, label: 'Turmas Avaliadas', value: 5, color: 'purple' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          >
            <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Produtos Populares */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4">🏆 Campeões de Aceitação</h2>
        <div className="flex flex-wrap gap-3">
          {estatisticas.produtos_populares.map((produto, index) => (
            <div 
              key={produto}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full"
            >
              <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
              <span className="font-medium text-green-700">{produto}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Histórico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4">📝 Registros Recentes</h2>
        <div className="space-y-3">
          {feedbackHistorico.map((item) => (
            <div 
              key={item.id}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getAceitacaoColor(item.aceitacao)}`}>
                {getAceitacaoIcon(item.aceitacao)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-slate-800">{item.produto}</p>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getAceitacaoColor(item.aceitacao)}`}>
                    {item.aceitacao === 'alta' ? 'Alta' : item.aceitacao === 'media' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 truncate">{item.comentario}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{item.turma}</span>
                  <span>•</span>
                  <span>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                  <span>•</span>
                  <span>Sobra: {item.quantidade_sobra}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !feedbackSalvo && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {feedbackSalvo ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Feedback Registrado!</h3>
                  <p className="text-slate-600">Obrigado por contribuir com o Merendômetro</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ChefHat className="w-6 h-6 text-purple-600" />
                    Novo Registro
                  </h3>

                  <div className="space-y-4">
                    {/* Turma */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Turma</label>
                      <select
                        value={selectedTurma}
                        onChange={(e) => setSelectedTurma(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Selecione a turma...</option>
                        {turmas.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Produto */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Produto</label>
                      <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Selecione o produto...</option>
                        {produtosUsados.map(p => (
                          <option key={p.id} value={p.nome}>{p.nome}</option>
                        ))}
                      </select>
                    </div>

                    {/* Aceitação */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nível de Aceitação</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'alta', label: 'Alta', icon: ThumbsUp, color: 'green' },
                          { value: 'media', label: 'Média', icon: AlertCircle, color: 'amber' },
                          { value: 'baixa', label: 'Baixa', icon: ThumbsDown, color: 'red' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setAceitacao(option.value as 'alta' | 'media' | 'baixa')}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                              aceitacao === option.value 
                                ? `border-${option.color}-500 bg-${option.color}-50` 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <option.icon className={`w-5 h-5 ${aceitacao === option.value ? `text-${option.color}-600` : 'text-slate-400'}`} />
                            <span className={`text-sm font-medium ${aceitacao === option.value ? `text-${option.color}-700` : 'text-slate-600'}`}>
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sobra */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Percentual de Sobra: <span className="text-purple-600 font-bold">{sobra}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sobra}
                        onChange={(e) => setSobra(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Comentário */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Comentário</label>
                      <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Ex: Alunos preferiram a salada temperada com limão..."
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSalvarFeedback}
                        disabled={!selectedProduct || !selectedTurma || !aceitacao}
                        className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
