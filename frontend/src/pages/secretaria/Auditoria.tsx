import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileSearch, Filter, Calendar, Download, Eye, 
  CheckCircle, AlertTriangle, Clock, ChevronDown, 
  FileText, User, School, Package, X
} from 'lucide-react'
import { pedidos } from '../../data/pedidos'
import { produtores } from '../../data/produtores'
import { escolas } from '../../data/escolas'

interface AuditoriaItem {
  id: string
  tipo: 'pedido' | 'produtor' | 'escola'
  entidade: string
  descricao: string
  data: string
  status: 'aprovado' | 'pendente' | 'irregular'
  responsavel: string
  detalhes: string
}

export default function Auditoria() {
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [showDetalhes, setShowDetalhes] = useState<AuditoriaItem | null>(null)

  const auditorias: AuditoriaItem[] = [
    { 
      id: '1', tipo: 'pedido', entidade: 'Pedido #abc123', 
      descricao: 'Verificação de documentação fiscal', data: '2025-01-08',
      status: 'aprovado', responsavel: 'Maria Santos',
      detalhes: 'Todas as notas fiscais conferem com os produtos entregues. DAP do produtor válida até 2026.'
    },
    { 
      id: '2', tipo: 'produtor', entidade: 'João Silva', 
      descricao: 'Renovação de DAP/CAF', data: '2025-01-07',
      status: 'pendente', responsavel: 'Carlos Lima',
      detalhes: 'Aguardando envio de documentação atualizada. Prazo: 15/01/2025.'
    },
    { 
      id: '3', tipo: 'escola', entidade: 'E.M. Monteiro Lobato', 
      descricao: 'Verificação de meta PNAE', data: '2025-01-06',
      status: 'irregular', responsavel: 'Ana Costa',
      detalhes: 'Escola atingiu apenas 22% de compras da agricultura familiar. Meta mínima: 30%. Notificação enviada.'
    },
    { 
      id: '4', tipo: 'pedido', entidade: 'Pedido #def456', 
      descricao: 'Conferência de entrega', data: '2025-01-05',
      status: 'aprovado', responsavel: 'Pedro Alves',
      detalhes: 'Produtos entregues conforme especificado. Qualidade aprovada pela nutricionista.'
    },
    { 
      id: '5', tipo: 'produtor', entidade: 'Maria Oliveira', 
      descricao: 'Análise de capacidade produtiva', data: '2025-01-04',
      status: 'aprovado', responsavel: 'Fernanda Reis',
      detalhes: 'Produtor apto a fornecer até 500kg/semana de hortaliças. Estrutura adequada.'
    },
    { 
      id: '6', tipo: 'escola', entidade: 'E.M. Castro Alves', 
      descricao: 'Auditoria de cardápio', data: '2025-01-03',
      status: 'pendente', responsavel: 'Roberto Nunes',
      detalhes: 'Aguardando relatório nutricional do mês de dezembro.'
    },
  ]

  const auditoriasFiltradas = auditorias.filter(a => {
    const matchTipo = filtroTipo === 'todos' || a.tipo === filtroTipo
    const matchStatus = filtroStatus === 'todos' || a.status === filtroStatus
    return matchTipo && matchStatus
  })

  const contadores = {
    total: auditorias.length,
    aprovado: auditorias.filter(a => a.status === 'aprovado').length,
    pendente: auditorias.filter(a => a.status === 'pendente').length,
    irregular: auditorias.filter(a => a.status === 'irregular').length,
  }

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'aprovado': return { color: 'green', icon: CheckCircle, label: 'Aprovado' }
      case 'pendente': return { color: 'amber', icon: Clock, label: 'Pendente' }
      case 'irregular': return { color: 'red', icon: AlertTriangle, label: 'Irregular' }
      default: return { color: 'slate', icon: FileText, label: status }
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case 'pedido': return Package
      case 'produtor': return User
      case 'escola': return School
      default: return FileText
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FileSearch className="w-7 h-7" />
              Auditoria
            </h1>
            <p className="text-indigo-100">
              Acompanhe verificações e conformidade do programa
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors">
            <Download className="w-5 h-5" />
            <span className="font-medium">Exportar Relatório</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: contadores.total, color: 'slate', icon: FileText },
          { label: 'Aprovados', value: contadores.aprovado, color: 'green', icon: CheckCircle },
          { label: 'Pendentes', value: contadores.pendente, color: 'amber', icon: Clock },
          { label: 'Irregulares', value: contadores.irregular, color: 'red', icon: AlertTriangle },
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

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
            <div className="relative">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todos">Todos os tipos</option>
                <option value="pedido">Pedidos</option>
                <option value="produtor">Produtores</option>
                <option value="escola">Escolas</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <div className="relative">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todos">Todos os status</option>
                <option value="aprovado">Aprovados</option>
                <option value="pendente">Pendentes</option>
                <option value="irregular">Irregulares</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lista de Auditorias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">
            {auditoriasFiltradas.length} registros encontrados
          </h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {auditoriasFiltradas.map((auditoria) => {
            const statusConfig = getStatusConfig(auditoria.status)
            const TipoIcon = getTipoIcon(auditoria.tipo)
            
            return (
              <div 
                key={auditoria.id}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${statusConfig.color}-100`}>
                    <TipoIcon className={`w-5 h-5 text-${statusConfig.color}-600`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-800">{auditoria.entidade}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{auditoria.descricao}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(auditoria.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {auditoria.responsavel}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowDetalhes(auditoria)}
                    className="flex items-center gap-1 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Ver</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

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
              className="bg-white rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Detalhes da Auditoria</h3>
                <button 
                  onClick={() => setShowDetalhes(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Badge */}
                {(() => {
                  const config = getStatusConfig(showDetalhes.status)
                  return (
                    <div className={`p-4 rounded-xl bg-${config.color}-50 border border-${config.color}-200`}>
                      <div className="flex items-center gap-3">
                        <config.icon className={`w-6 h-6 text-${config.color}-600`} />
                        <div>
                          <p className={`font-semibold text-${config.color}-800`}>{config.label}</p>
                          <p className={`text-sm text-${config.color}-600`}>{showDetalhes.descricao}</p>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Informações */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Entidade</p>
                    <p className="font-medium text-slate-800">{showDetalhes.entidade}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Tipo</p>
                    <p className="font-medium text-slate-800 capitalize">{showDetalhes.tipo}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Data</p>
                    <p className="font-medium text-slate-800">
                      {new Date(showDetalhes.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Responsável</p>
                    <p className="font-medium text-slate-800">{showDetalhes.responsavel}</p>
                  </div>
                </div>

                {/* Detalhes */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-2">Observações</p>
                  <p className="text-slate-700">{showDetalhes.detalhes}</p>
                </div>

                <button
                  onClick={() => setShowDetalhes(null)}
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
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
