import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, Clock, Truck, CheckCircle, AlertCircle, 
  ChevronDown, ChevronUp, MapPin, Phone, Calendar,
  FileText, X
} from 'lucide-react'
import { pedidos } from '../../data/pedidos'
import { useAuth } from '../../contexts/AuthContext'
import { escolas } from '../../data/escolas'

export default function MeusPedidos() {
  const { user } = useAuth()
  const escola = escolas.find(e => e.id === user?.escola?.id) || escolas[0]
  
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [expandedPedido, setExpandedPedido] = useState<string | null>(null)
  const [showDetalhes, setShowDetalhes] = useState<typeof pedidos[0] | null>(null)

  const meusPedidos = pedidos.filter(p => p.escola_id === escola.id)
  
  const pedidosFiltrados = filtroStatus === 'todos' 
    ? meusPedidos 
    : meusPedidos.filter(p => p.status === filtroStatus)

  const contadores = {
    todos: meusPedidos.length,
    Pendente: meusPedidos.filter(p => p.status === 'Pendente').length,
    Confirmado: meusPedidos.filter(p => p.status === 'Confirmado').length,
    'Em Transporte': meusPedidos.filter(p => p.status === 'Em Transporte').length,
    Entregue: meusPedidos.filter(p => p.status === 'Entregue').length,
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pendente': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'Confirmado': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Em Transporte': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'Entregue': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pendente': return <Clock className="w-5 h-5" />
      case 'Confirmado': return <CheckCircle className="w-5 h-5" />
      case 'Em Transporte': return <Truck className="w-5 h-5" />
      case 'Entregue': return <Package className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Package className="w-7 h-7" />
          Meus Pedidos
        </h1>
        <p className="text-indigo-100">
          Acompanhe o status das suas compras da agricultura familiar
        </p>
      </motion.div>

      {/* Filtros por Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {Object.entries(contadores).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFiltroStatus(status)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filtroStatus === status
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            {status === 'todos' ? 'Todos' : status}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              filtroStatus === status 
                ? 'bg-white/20' 
                : 'bg-slate-100'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {pedidosFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-xl border border-slate-100"
          >
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhum pedido encontrado</p>
          </motion.div>
        ) : (
          pedidosFiltrados.map((pedido, index) => (
            <motion.div
              key={pedido.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
            >
              {/* Cabeçalho do Pedido */}
              <div 
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(pedido.status)}`}>
                      {getStatusIcon(pedido.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">Pedido #{pedido.id.slice(-6)}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(pedido.status)}`}>
                          {pedido.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                        <span className="mx-1">•</span>
                        {pedido.produtor_nome}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-slate-800">R$ {pedido.total.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{pedido.itens.length} itens</p>
                    </div>
                    {expandedPedido === pedido.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Detalhes Expandidos */}
              <AnimatePresence>
                {expandedPedido === pedido.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 overflow-hidden"
                  >
                    <div className="p-4 bg-slate-50 space-y-4">
                      {/* Timeline de Status */}
                      <div className="flex items-center justify-between bg-white rounded-xl p-4">
                        {['Pendente', 'Confirmado', 'Em Transporte', 'Entregue'].map((status, idx) => {
                          const statusOrder = ['Pendente', 'Confirmado', 'Em Transporte', 'Entregue']
                          const currentIdx = statusOrder.indexOf(pedido.status)
                          const isCompleted = idx <= currentIdx
                          const isCurrent = status === pedido.status
                          
                          return (
                            <div key={status} className="flex items-center">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-slate-200 text-slate-400'
                                } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                                  {isCompleted ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <span className="text-xs font-bold">{idx + 1}</span>
                                  )}
                                </div>
                                <span className={`text-xs mt-1 ${isCompleted ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                                  {status}
                                </span>
                              </div>
                              {idx < 3 && (
                                <div className={`w-12 md:w-20 h-1 mx-1 rounded ${
                                  idx < currentIdx ? 'bg-green-500' : 'bg-slate-200'
                                }`} />
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Itens do Pedido */}
                      <div className="bg-white rounded-xl p-4">
                        <h4 className="font-semibold text-slate-800 mb-3">Itens do Pedido</h4>
                        <div className="space-y-2">
                          {pedido.itens.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🥬</span>
                                <div>
                                  <p className="font-medium text-slate-700">{item.produto}</p>
                                  <p className="text-sm text-slate-500">
                                    {item.quantidade} {item.unidade} × R$ {item.preco_unitario.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <p className="font-semibold text-slate-700">
                                R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between pt-3 mt-3 border-t border-slate-200">
                          <span className="font-semibold text-slate-700">Total</span>
                          <span className="font-bold text-lg text-slate-800">R$ {pedido.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Info de Entrega */}
                      {pedido.logistica && (
                        <div className="bg-white rounded-xl p-4">
                          <h4 className="font-semibold text-slate-800 mb-3">Informações de Entrega</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                              <Truck className="w-5 h-5 text-indigo-600" />
                              <div>
                                <p className="text-xs text-slate-500">Tipo</p>
                                <p className="font-medium text-slate-700">{pedido.logistica.tipo}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                              <MapPin className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-xs text-slate-500">Distância</p>
                                <p className="font-medium text-slate-700">{pedido.logistica.distancia_km} km</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowDetalhes(pedido)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                          Ver Detalhes Completos
                        </button>
                        {pedido.status === 'Entregue' && !pedido.avaliacao && (
                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors">
                            ⭐ Avaliar Entrega
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Detalhes */}
      <AnimatePresence>
        {showDetalhes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetalhes(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Pedido #{showDetalhes.id.slice(-6)}</h3>
                <button 
                  onClick={() => setShowDetalhes(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div className={`p-4 rounded-xl ${getStatusColor(showDetalhes.status)}`}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(showDetalhes.status)}
                    <div>
                      <p className="font-semibold">{showDetalhes.status}</p>
                      <p className="text-sm opacity-80">
                        Atualizado em {new Date(showDetalhes.data_pedido).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Produtor */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-semibold text-slate-800 mb-2">Produtor</h4>
                  <p className="font-medium text-slate-700">{showDetalhes.produtor_nome}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>(11) 99999-0000</span>
                  </div>
                </div>

                {/* Previsão */}
                {showDetalhes.data_entrega_prevista && (
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <h4 className="font-semibold text-indigo-800 mb-2">Previsão de Entrega</h4>
                    <p className="text-lg font-bold text-indigo-700">
                      {new Date(showDetalhes.data_entrega_prevista).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-800">Total do Pedido</span>
                    <span className="text-2xl font-bold text-green-700">
                      R$ {showDetalhes.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetalhes(null)}
                  className="w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
