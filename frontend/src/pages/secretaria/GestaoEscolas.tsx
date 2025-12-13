import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  School, MapPin, Phone, Mail, Users, DollarSign,
  Search, Filter, Plus, Edit, Trash2, Eye, X,
  TrendingUp, CheckCircle, AlertTriangle, Building2
} from 'lucide-react'
import { escolas } from '../../data/escolas'

export default function GestaoEscolas() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [escolaSelecionada, setEscolaSelecionada] = useState<typeof escolas[0] | null>(null)

  const escolasFiltradas = escolas.filter(e => {
    const matchSearch = e.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTipo = !filterTipo || e.tipo === filterTipo
    return matchSearch && matchTipo
  })

  const totalAlunos = escolas.reduce((acc, e) => acc + e.num_alunos, 0)
  const totalOrcamento = escolas.reduce((acc, e) => acc + e.orcamento_mensal, 0)
  const mediaConformidade = 89 // Simulado

  const stats = [
    { label: 'Total de Escolas', value: escolas.length, icon: School, color: 'blue' },
    { label: 'Total de Alunos', value: totalAlunos.toLocaleString('pt-BR'), icon: Users, color: 'green' },
    { label: 'Orçamento Mensal', value: `R$ ${(totalOrcamento / 1000).toFixed(0)}k`, icon: DollarSign, color: 'purple' },
    { label: 'Conformidade PNAE', value: `${mediaConformidade}%`, icon: CheckCircle, color: 'emerald' },
  ]

  const tiposEscola = ['Municipal', 'Estadual', 'CMEI', 'Integral']

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Building2 className="w-7 h-7" />
              Gestão de Escolas
            </h1>
            <p className="text-blue-100">
              Gerencie todas as escolas do município
            </p>
          </div>
          <button
            onClick={() => {
              setEscolaSelecionada(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nova Escola</span>
          </button>
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar escola..."
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os Tipos</option>
            {tiposEscola.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Lista de Escolas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4"
      >
        {escolasFiltradas.map((escola) => (
          <div 
            key={escola.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Info Principal */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <School className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{escola.nome}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {escola.endereco}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                        {escola.tipo}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                        {escola.num_alunos} alunos
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="flex flex-col gap-1 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {escola.contato.telefone}
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {escola.contato.email}
                </span>
              </div>

              {/* Orçamento */}
              <div className="text-right">
                <p className="text-sm text-slate-500">Orçamento Mensal</p>
                <p className="text-lg font-bold text-slate-800">
                  R$ {escola.orcamento_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEscolaSelecionada(escola)
                    setShowModal(true)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Visualizar"
                >
                  <Eye className="w-5 h-5 text-slate-600" />
                </button>
                <button
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {escolasFiltradas.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
            <School className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhuma escola encontrada</p>
          </div>
        )}
      </motion.div>

      {/* Modal Detalhes */}
      <AnimatePresence>
        {showModal && escolaSelecionada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <School className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{escolaSelecionada.nome}</h3>
                      <p className="text-blue-200">{escolaSelecionada.tipo}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Stats da Escola */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-800">{escolaSelecionada.num_alunos}</p>
                    <p className="text-sm text-slate-500">Alunos</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-800">
                      R$ {(escolaSelecionada.orcamento_mensal / 1000).toFixed(1)}k
                    </p>
                    <p className="text-sm text-slate-500">Orçamento/Mês</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-800">92%</p>
                    <p className="text-sm text-slate-500">Conformidade</p>
                  </div>
                </div>

                {/* Informações */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800">Informações de Contato</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Responsável</p>
                      <p className="font-medium text-slate-800">{escolaSelecionada.contato.responsavel}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Telefone</p>
                      <p className="font-medium text-slate-800">{escolaSelecionada.contato.telefone}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl col-span-2">
                      <p className="text-sm text-slate-500 mb-1">Email</p>
                      <p className="font-medium text-slate-800">{escolaSelecionada.contato.email}</p>
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800">Localização</h4>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      {escolaSelecionada.endereco}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 flex items-center justify-center gap-2">
                    <Edit className="w-5 h-5" />
                    Editar Escola
                  </button>
                  <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Eye className="w-5 h-5" />
                    Ver Pedidos
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
