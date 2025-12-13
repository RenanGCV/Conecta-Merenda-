import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, Package, CheckCircle, MessageSquare, 
  ThumbsUp, Clock, Award, X, Send
} from 'lucide-react'
import { pedidos } from '../../data/pedidos'
import { useAuth } from '../../contexts/AuthContext'
import { escolas } from '../../data/escolas'

const tags = [
  { id: 'pontual', label: '⏰ Pontual', color: 'blue' },
  { id: 'qualidade', label: '✨ Ótima Qualidade', color: 'green' },
  { id: 'fresco', label: '🥬 Produtos Frescos', color: 'emerald' },
  { id: 'organizado', label: '📦 Bem Embalado', color: 'purple' },
  { id: 'comunicativo', label: '💬 Boa Comunicação', color: 'indigo' },
  { id: 'quantidade', label: '⚖️ Quantidade Correta', color: 'cyan' },
]

export default function Avaliacoes() {
  const { user } = useAuth()
  const escola = escolas.find(e => e.id === user?.escola?.id) || escolas[0]
  
  const [showModal, setShowModal] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState<typeof pedidos[0] | null>(null)
  const [nota, setNota] = useState(0)
  const [hoverNota, setHoverNota] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comentario, setComentario] = useState('')
  const [avaliacaoEnviada, setAvaliacaoEnviada] = useState(false)

  const meusPedidos = pedidos.filter(p => p.escola_id === escola.id)
  const pedidosParaAvaliar = meusPedidos.filter(p => p.status === 'Entregue' && !p.avaliacao)
  const pedidosAvaliados = meusPedidos.filter(p => p.avaliacao)

  const handleAbrirAvaliacao = (pedido: typeof pedidos[0]) => {
    setSelectedPedido(pedido)
    setShowModal(true)
    setNota(0)
    setSelectedTags([])
    setComentario('')
    setAvaliacaoEnviada(false)
  }

  const handleToggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    )
  }

  const handleEnviarAvaliacao = () => {
    if (nota === 0) return
    setAvaliacaoEnviada(true)
    setTimeout(() => {
      setShowModal(false)
    }, 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Star className="w-7 h-7" />
          Avaliações
        </h1>
        <p className="text-amber-100">
          Avalie as entregas e ajude a melhorar a qualidade dos produtos
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: Clock, label: 'Pendentes', value: pedidosParaAvaliar.length, color: 'amber' },
          { icon: CheckCircle, label: 'Avaliados', value: pedidosAvaliados.length, color: 'green' },
          { icon: ThumbsUp, label: 'Média Geral', value: '4.7', color: 'blue' },
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

      {/* Pendentes de Avaliação */}
      {pedidosParaAvaliar.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Pendentes de Avaliação
          </h2>
          <div className="space-y-3">
            {pedidosParaAvaliar.map((pedido) => (
              <div 
                key={pedido.id}
                className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{pedido.produtor_nome}</p>
                    <p className="text-sm text-slate-500">
                      Pedido #{pedido.id.slice(-6)} • Entregue em {new Date(pedido.data_entrega_prevista || pedido.data_pedido).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAbrirAvaliacao(pedido)}
                  className="px-4 py-2 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Avaliar
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Avaliações Anteriores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Avaliações Realizadas
        </h2>
        
        {pedidosAvaliados.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">Nenhuma avaliação realizada ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosAvaliados.map((pedido) => (
              <div 
                key={pedido.id}
                className="p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-800">{pedido.produtor_nome}</p>
                    <p className="text-sm text-slate-500">
                      Pedido #{pedido.id.slice(-6)} • {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 rounded-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (pedido.avaliacao?.nota || 0)
                            ? 'text-amber-500 fill-current'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {pedido.avaliacao?.tags && pedido.avaliacao.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pedido.avaliacao.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium"
                      >
                        {tags.find(t => t.id === tag)?.label || tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {pedido.avaliacao?.comentario && (
                  <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                    <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                    <p className="text-sm text-slate-600">{pedido.avaliacao.comentario}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal de Avaliação */}
      <AnimatePresence>
        {showModal && selectedPedido && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !avaliacaoEnviada && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {avaliacaoEnviada ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Avaliação Enviada!</h3>
                  <p className="text-slate-600">Obrigado pelo seu feedback</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Avaliar Entrega</h3>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  {/* Info do Pedido */}
                  <div className="p-4 bg-slate-50 rounded-xl mb-6">
                    <p className="font-semibold text-slate-800">{selectedPedido.produtor_nome}</p>
                    <p className="text-sm text-slate-500">
                      Pedido #{selectedPedido.id.slice(-6)} • R$ {selectedPedido.total.toFixed(2)}
                    </p>
                  </div>

                  {/* Nota com Estrelas */}
                  <div className="text-center mb-6">
                    <p className="text-sm font-medium text-slate-700 mb-3">Como foi a entrega?</p>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverNota(star)}
                          onMouseLeave={() => setHoverNota(0)}
                          onClick={() => setNota(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-10 h-10 ${
                              star <= (hoverNota || nota)
                                ? 'text-amber-500 fill-current'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      {nota === 1 && 'Muito ruim'}
                      {nota === 2 && 'Ruim'}
                      {nota === 3 && 'Regular'}
                      {nota === 4 && 'Bom'}
                      {nota === 5 && 'Excelente!'}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-slate-700 mb-3">O que você mais gostou?</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => handleToggleTag(tag.id)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedTags.includes(tag.id)
                              ? 'bg-green-100 text-green-700 border-2 border-green-500'
                              : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200'
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comentário */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-slate-700 mb-2">Comentário (opcional)</p>
                    <textarea
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Conte mais sobre sua experiência..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Botão Enviar */}
                  <button
                    onClick={handleEnviarAvaliacao}
                    disabled={nota === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    Enviar Avaliação
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge de Gamificação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">🏆 Avaliador Ativo</h3>
            <p className="text-purple-100 text-sm">
              Você já avaliou {pedidosAvaliados.length} entregas! Continue avaliando para ganhar o selo de "Escola Parceira".
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso para o selo</span>
            <span>{pedidosAvaliados.length}/10 avaliações</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.min((pedidosAvaliados.length / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
