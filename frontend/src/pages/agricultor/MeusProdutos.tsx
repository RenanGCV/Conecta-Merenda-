import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, Plus, Edit, Trash2, Search, Filter, 
  Leaf, TrendingUp, AlertTriangle, Check, X, Camera
} from 'lucide-react'
import { safraRegional } from '../../data/safra'

interface Produto {
  id: string
  nome: string
  categoria: string
  unidade: string
  preco: number
  quantidade_disponivel: number
  disponibilidade: 'Alta' | 'Média' | 'Baixa'
  organico: boolean
  imagem?: string
}

export default function MeusProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([
    { id: '1', nome: 'Alface Crespa', categoria: 'Hortaliças', unidade: 'kg', preco: 5.50, quantidade_disponivel: 100, disponibilidade: 'Alta', organico: true },
    { id: '2', nome: 'Tomate', categoria: 'Hortaliças', unidade: 'kg', preco: 6.00, quantidade_disponivel: 80, disponibilidade: 'Alta', organico: true },
    { id: '3', nome: 'Cenoura', categoria: 'Hortaliças', unidade: 'kg', preco: 4.50, quantidade_disponivel: 50, disponibilidade: 'Média', organico: false },
    { id: '4', nome: 'Banana Prata', categoria: 'Frutas', unidade: 'kg', preco: 5.00, quantidade_disponivel: 200, disponibilidade: 'Alta', organico: true },
    { id: '5', nome: 'Feijão Carioca', categoria: 'Grãos', unidade: 'kg', preco: 8.00, quantidade_disponivel: 30, disponibilidade: 'Baixa', organico: false },
  ])
  
  const [showModal, setShowModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')

  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'Hortaliças',
    unidade: 'kg',
    preco: '',
    quantidade_disponivel: '',
    disponibilidade: 'Alta' as 'Alta' | 'Média' | 'Baixa',
    organico: false
  })

  const categorias = ['Hortaliças', 'Frutas', 'Grãos', 'Laticínios', 'Outros']

  const produtosFiltrados = produtos.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = !filterCategoria || p.categoria === filterCategoria
    return matchSearch && matchCategoria
  })

  const handleOpenModal = (produto?: Produto) => {
    if (produto) {
      setEditingProduto(produto)
      setFormData({
        nome: produto.nome,
        categoria: produto.categoria,
        unidade: produto.unidade,
        preco: produto.preco.toString(),
        quantidade_disponivel: produto.quantidade_disponivel.toString(),
        disponibilidade: produto.disponibilidade,
        organico: produto.organico
      })
    } else {
      setEditingProduto(null)
      setFormData({
        nome: '',
        categoria: 'Hortaliças',
        unidade: 'kg',
        preco: '',
        quantidade_disponivel: '',
        disponibilidade: 'Alta',
        organico: false
      })
    }
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.nome || !formData.preco) return

    if (editingProduto) {
      setProdutos(prev => prev.map(p => 
        p.id === editingProduto.id 
          ? { ...p, ...formData, preco: parseFloat(formData.preco), quantidade_disponivel: parseInt(formData.quantidade_disponivel) }
          : p
      ))
    } else {
      const novoProduto: Produto = {
        id: Date.now().toString(),
        nome: formData.nome,
        categoria: formData.categoria,
        unidade: formData.unidade,
        preco: parseFloat(formData.preco),
        quantidade_disponivel: parseInt(formData.quantidade_disponivel) || 0,
        disponibilidade: formData.disponibilidade,
        organico: formData.organico
      }
      setProdutos(prev => [...prev, novoProduto])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setProdutos(prev => prev.filter(p => p.id !== id))
  }

  const getDisponibilidadeColor = (disp: string) => {
    switch(disp) {
      case 'Alta': return 'bg-green-100 text-green-700'
      case 'Média': return 'bg-amber-100 text-amber-700'
      case 'Baixa': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Package className="w-7 h-7" />
              Meus Produtos
            </h1>
            <p className="text-green-100">
              Gerencie seus produtos e disponibilidade para as escolas
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Produto</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Produtos', value: produtos.length, icon: Package, color: 'blue' },
          { label: 'Alta Disponibilidade', value: produtos.filter(p => p.disponibilidade === 'Alta').length, icon: TrendingUp, color: 'green' },
          { label: 'Orgânicos', value: produtos.filter(p => p.organico).length, icon: Leaf, color: 'emerald' },
          { label: 'Estoque Baixo', value: produtos.filter(p => p.disponibilidade === 'Baixa').length, icon: AlertTriangle, color: 'amber' },
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todas Categorias</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Lista de Produtos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="grid gap-4 p-4">
          {produtosFiltrados.map((produto) => (
            <div 
              key={produto.id}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">🥬</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-800">{produto.nome}</h3>
                  {produto.organico && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      Orgânico
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{produto.categoria}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-medium text-slate-700">
                    R$ {produto.preco.toFixed(2)}/{produto.unidade}
                  </span>
                  <span className="text-sm text-slate-500">
                    Estoque: {produto.quantidade_disponivel} {produto.unidade}
                  </span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDisponibilidadeColor(produto.disponibilidade)}`}>
                {produto.disponibilidade}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(produto)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5 text-slate-600" />
                </button>
                <button
                  onClick={() => handleDelete(produto.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sugestões da Safra */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200"
      >
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          💡 Produtos em Alta na Safra
        </h3>
        <div className="flex flex-wrap gap-2">
          {safraRegional.produtos_safra.filter(p => p.disponibilidade === 'Alta').slice(0, 6).map(prod => (
            <span 
              key={prod.nome}
              className="px-3 py-2 bg-white rounded-lg text-sm font-medium text-slate-700 border border-amber-200"
            >
              {prod.emoji} {prod.nome} • R$ {prod.preco_medio_kg.toFixed(2)}/kg
            </span>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingProduto ? 'Editar Produto' : 'Novo Produto'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Produto</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Alface Crespa"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Categoria</label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Unidade</label>
                    <select
                      value={formData.unidade}
                      onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    >
                      <option value="kg">Quilograma (kg)</option>
                      <option value="un">Unidade (un)</option>
                      <option value="maco">Maço</option>
                      <option value="dz">Dúzia (dz)</option>
                      <option value="L">Litro (L)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({...formData, preco: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantidade</label>
                    <input
                      type="number"
                      value={formData.quantidade_disponivel}
                      onChange={(e) => setFormData({...formData, quantidade_disponivel: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Disponibilidade</label>
                  <div className="flex gap-2">
                    {['Alta', 'Média', 'Baixa'].map((disp) => (
                      <button
                        key={disp}
                        type="button"
                        onClick={() => setFormData({...formData, disponibilidade: disp as any})}
                        className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                          formData.disponibilidade === disp
                            ? getDisponibilidadeColor(disp)
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {disp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, organico: !formData.organico})}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      formData.organico
                        ? 'bg-green-500 border-green-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {formData.organico && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div>
                    <p className="font-medium text-slate-800">Produto Orgânico</p>
                    <p className="text-sm text-slate-500">Possui certificação orgânica</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
                  >
                    {editingProduto ? 'Salvar' : 'Adicionar'}
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
