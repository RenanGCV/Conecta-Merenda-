import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Clock, CheckCircle, XCircle, Eye, 
  School, Calendar, Package, DollarSign, Truck,
  ChevronRight, Filter, Download
} from 'lucide-react'
import { pedidos } from '../../data/pedidos'

type StatusContrato = 'todos' | 'pendente' | 'confirmado' | 'em_entrega' | 'entregue' | 'cancelado'

export default function MeusContratos() {
  const [filtroStatus, setFiltroStatus] = useState<StatusContrato>('todos')
  const [contratoSelecionado, setContratoSelecionado] = useState<typeof pedidos[0] | null>(null)

  // Simular contratos do agricultor (usando pedidos como base)
  const contratos = pedidos.map(p => ({
    ...p,
    valor_total: p.itens.reduce((acc, item) => acc + item.quantidade * item.preco_unitario, 0)
  }))

  const contratosFiltrados = contratos.filter(c => 
    filtroStatus === 'todos' || c.status === filtroStatus
  )

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'pendente':
        return { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock }
      case 'confirmado':
        return { label: 'Confirmado', color: 'bg-blue-100 text-blue-700', icon: CheckCircle }
      case 'em_entrega':
        return { label: 'Em Entrega', color: 'bg-purple-100 text-purple-700', icon: Truck }
      case 'entregue':
        return { label: 'Entregue', color: 'bg-green-100 text-green-700', icon: CheckCircle }
      case 'cancelado':
        return { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XCircle }
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700', icon: FileText }
    }
  }

  const stats = [
    { label: 'Total de Contratos', value: contratos.length, icon: FileText, color: 'blue' },
    { label: 'Pendentes', value: contratos.filter(c => c.status === 'pendente').length, icon: Clock, color: 'amber' },
    { label: 'Em Andamento', value: contratos.filter(c => ['confirmado', 'em_entrega'].includes(c.status)).length, icon: Truck, color: 'purple' },
    { label: 'Concluídos', value: contratos.filter(c => c.status === 'entregue').length, icon: CheckCircle, color: 'green' },
  ]

  const valorTotal = contratos
    .filter(c => c.status !== 'cancelado')
    .reduce((acc, c) => acc + c.valor_total, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FileText className="w-7 h-7" />
          Meus Contratos
        </h1>
        <p className="text-indigo-100">
          Acompanhe os pedidos e contratos das escolas
        </p>
        <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
          <p className="text-sm text-indigo-200">Valor total em contratos ativos</p>
          <p className="text-3xl font-bold">R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-700">Filtrar por status</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'todos', label: 'Todos' },
            { value: 'pendente', label: '⏳ Pendentes' },
            { value: 'confirmado', label: '✅ Confirmados' },
            { value: 'em_entrega', label: '🚚 Em Entrega' },
            { value: 'entregue', label: '📦 Entregues' },
            { value: 'cancelado', label: '❌ Cancelados' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFiltroStatus(opt.value as StatusContrato)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filtroStatus === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Lista de Contratos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="divide-y divide-slate-100">
          {contratosFiltrados.map((contrato) => {
            const statusConfig = getStatusConfig(contrato.status)
            const StatusIcon = statusConfig.icon
            
            return (
              <div 
                key={contrato.id}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setContratoSelecionado(contrato)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <School className="w-6 h-6 text-indigo-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800">{contrato.escola}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(contrato.data_pedido).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {contrato.itens.length} itens
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-800">
                      R$ {contrato.valor_total.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-500">
                      Entrega: {new Date(contrato.data_entrega).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            )
          })}

          {contratosFiltrados.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhum contrato encontrado</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {contratoSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setContratoSelecionado(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Contrato #{contratoSelecionado.id}</h3>
                    <p className="text-indigo-200">{contratoSelecionado.escola}</p>
                  </div>
                  <button
                    onClick={() => setContratoSelecionado(null)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Status Timeline */}
                <div className="flex items-center justify-between">
                  {['pendente', 'confirmado', 'em_entrega', 'entregue'].map((step, index) => {
                    const isActive = ['pendente', 'confirmado', 'em_entrega', 'entregue'].indexOf(contratoSelecionado.status) >= index
                    const isCurrent = contratoSelecionado.status === step
                    
                    return (
                      <div key={step} className="flex-1 flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-indigo-200' : ''}`}>
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <div className={`flex-1 h-1 ${isActive ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Datas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Data do Pedido</p>
                    <p className="font-semibold text-slate-800">
                      {new Date(contratoSelecionado.data_pedido).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Previsão de Entrega</p>
                    <p className="font-semibold text-slate-800">
                      {new Date(contratoSelecionado.data_entrega).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Itens */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Itens do Pedido</h4>
                  <div className="space-y-2">
                    {contratoSelecionado.itens.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-medium text-slate-800">{item.produto}</p>
                          <p className="text-sm text-slate-500">{item.quantidade} {item.unidade}</p>
                        </div>
                        <p className="font-semibold text-slate-800">
                          R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="p-4 bg-indigo-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">Valor Total</span>
                    <span className="text-xl font-bold text-indigo-600">
                      R$ {contratoSelecionado.valor_total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Baixar PDF
                  </button>
                  {contratoSelecionado.status === 'pendente' && (
                    <button className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Confirmar
                    </button>
                  )}
                  {contratoSelecionado.status === 'confirmado' && (
                    <button className="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2">
                      <Truck className="w-5 h-5" />
                      Iniciar Entrega
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
