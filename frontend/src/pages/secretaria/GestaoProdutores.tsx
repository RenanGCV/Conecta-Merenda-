import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, MapPin, Phone, Star, Leaf, Package,
  Search, Filter, Plus, Eye, X, Award, TrendingUp,
  CheckCircle, AlertTriangle, Mail
} from 'lucide-react'
import { produtores } from '../../data/produtores'

export default function GestaoProdutores() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [produtorSelecionado, setProdutorSelecionado] = useState<typeof produtores[0] | null>(null)

  const produtoresFiltrados = produtores.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = !filterStatus || 
      (filterStatus === 'organico' && p.organico) ||
      (filterStatus === 'verificado' && p.verificado) ||
      (filterStatus === 'ativo' && p.ativo)
    return matchSearch && matchStatus
  })

  const stats = [
    { label: 'Total Produtores', value: produtores.length, icon: Users, color: 'green' },
    { label: 'Orgânicos', value: produtores.filter(p => p.organico).length, icon: Leaf, color: 'emerald' },
    { label: 'Verificados', value: produtores.filter(p => p.verificado).length, icon: CheckCircle, color: 'blue' },
    { label: 'Média Avaliação', value: (produtores.reduce((a, p) => a + p.avaliacao, 0) / produtores.length).toFixed(1), icon: Star, color: 'amber' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Users className="w-7 h-7" />
              Gestão de Produtores
            </h1>
            <p className="text-green-100">
              Gerencie os agricultores familiares cadastrados
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Produtor</span>
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
              placeholder="Buscar produtor..."
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: '', label: 'Todos' },
              { value: 'organico', label: '🌿 Orgânicos' },
              { value: 'verificado', label: '✓ Verificados' },
              { value: 'ativo', label: '● Ativos' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterStatus === opt.value
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lista de Produtores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4"
      >
        {produtoresFiltrados.map((produtor) => (
          <div 
            key={produtor.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Avatar e Info */}
              <div className="flex items-start gap-3 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {produtor.nome.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{produtor.nome}</h3>
                    {produtor.verificado && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {produtor.cidade}, {produtor.estado}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {produtor.organico && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        Orgânico
                      </span>
                    )}
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {produtor.avaliacao.toFixed(1)}
                    </span>
                    {produtor.badges.slice(0, 2).map((badge, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Produtos */}
              <div className="flex-1">
                <p className="text-sm text-slate-500 mb-2">Produtos</p>
                <div className="flex flex-wrap gap-1">
                  {produtor.produtos.slice(0, 4).map((prod, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
                      {prod}
                    </span>
                  ))}
                  {produtor.produtos.length > 4 && (
                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
                      +{produtor.produtos.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Contato */}
              <div className="text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {produtor.telefone}
                </p>
                <p className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {produtor.email}
                </p>
              </div>

              {/* Ação */}
              <button
                onClick={() => {
                  setProdutorSelecionado(produtor)
                  setShowModal(true)
                }}
                className="p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                title="Visualizar"
              >
                <Eye className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>
        ))}

        {produtoresFiltrados.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhum produtor encontrado</p>
          </div>
        )}
      </motion.div>

      {/* Modal Detalhes */}
      <AnimatePresence>
        {showModal && produtorSelecionado && (
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
              <div className="p-6 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                      {produtorSelecionado.nome.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{produtorSelecionado.nome}</h3>
                        {produtorSelecionado.verificado && (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-green-200">{produtorSelecionado.cidade}, {produtorSelecionado.estado}</p>
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
                {/* Stats do Produtor */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-800">{produtorSelecionado.avaliacao.toFixed(1)}</p>
                    <p className="text-sm text-slate-500">Avaliação</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-800">{produtorSelecionado.produtos.length}</p>
                    <p className="text-sm text-slate-500">Produtos</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-800">{produtorSelecionado.badges.length}</p>
                    <p className="text-sm text-slate-500">Conquistas</p>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Conquistas e Certificações</h4>
                  <div className="flex flex-wrap gap-2">
                    {produtorSelecionado.badges.map((badge, i) => (
                      <span key={i} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-medium flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {badge}
                      </span>
                    ))}
                    {produtorSelecionado.organico && (
                      <span className="px-3 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        Certificação Orgânica
                      </span>
                    )}
                  </div>
                </div>

                {/* Produtos */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Produtos Oferecidos</h4>
                  <div className="flex flex-wrap gap-2">
                    {produtorSelecionado.produtos.map((prod, i) => (
                      <span key={i} className="px-3 py-2 bg-slate-100 rounded-xl text-sm text-slate-700">
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contato */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Informações de Contato</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Telefone</p>
                      <p className="font-medium text-slate-800">{produtorSelecionado.telefone}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Email</p>
                      <p className="font-medium text-slate-800">{produtorSelecionado.email}</p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200">
                    Ver Histórico
                  </button>
                  <button className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">
                    Contatar Produtor
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
