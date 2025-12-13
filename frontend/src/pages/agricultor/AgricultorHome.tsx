import { motion } from 'framer-motion'
import { 
  TrendingUp, Package, Star, Bell, MapPin, Users, ShoppingBag, Clock
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { pedidos } from '../../data/pedidos'
import { produtores } from '../../data/produtores'

export default function AgricultorHome() {
  const { user } = useAuth()
  
  // Buscar dados do produtor logado
  const produtor = produtores.find(p => p.id === user?.agricultor?.id) || produtores[0]
  
  // Pedidos do produtor
  const meusPedidos = pedidos.filter(p => p.produtor_id === produtor.id)
  const pedidosPendentes = meusPedidos.filter(p => p.status === 'Pendente' || p.status === 'Confirmado')
  const totalVendas = meusPedidos.filter(p => p.status === 'Entregue').reduce((acc, p) => acc + p.total, 0)

  const stats = [
    { 
      icon: ShoppingBag, 
      label: 'Total Vendas', 
      value: `R$ ${totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      icon: Package, 
      label: 'Pedidos Pendentes', 
      value: pedidosPendentes.length,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50'
    },
    { 
      icon: Star, 
      label: 'Avaliação', 
      value: produtor.avaliacao.media.toFixed(1),
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: Users, 
      label: 'Indicações', 
      value: produtor.indicacoes,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Olá, {produtor.nome.split(' ')[0]}! 👋
            </h1>
            <p className="text-green-100">
              Você tem {pedidosPendentes.length} pedido(s) aguardando ação
            </p>
          </div>
          {produtor.badge && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
              <span className="text-xl">🏆</span>
              <span className="font-medium">{produtor.badge}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 card-hover"
            >
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pedidos Recentes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Pedidos Recentes</h2>
            <span className="text-sm text-green-600 font-medium cursor-pointer hover:underline">
              Ver todos
            </span>
          </div>
          
          <div className="space-y-4">
            {meusPedidos.slice(0, 4).map((pedido) => (
              <div 
                key={pedido.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  pedido.status === 'Entregue' ? 'bg-green-100 text-green-600' :
                  pedido.status === 'Pendente' ? 'bg-amber-100 text-amber-600' :
                  pedido.status === 'Confirmado' ? 'bg-blue-100 text-blue-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{pedido.escola_nome}</p>
                  <p className="text-sm text-slate-500">
                    {pedido.itens.map(i => i.produto).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">
                    R$ {pedido.total.toFixed(2)}
                  </p>
                  <p className={`text-xs font-medium ${
                    pedido.status === 'Entregue' ? 'text-green-600' :
                    pedido.status === 'Pendente' ? 'text-amber-600' :
                    'text-blue-600'
                  }`}>
                    {pedido.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notificações */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Notificações</h2>
            <Bell className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-green-800">Novo pedido recebido!</p>
                <p className="text-sm text-green-600">EMEF Prof. Maria Aparecida solicitou 50kg de Tomate</p>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Há 2 horas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-blue-800">Nova avaliação 5 estrelas!</p>
                <p className="text-sm text-blue-600">"Produtos de excelente qualidade!" - EMEF Dr. José</p>
                <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Ontem
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-purple-800">Indicação convertida!</p>
                <p className="text-sm text-purple-600">Maria Costa se cadastrou usando seu código</p>
                <p className="text-xs text-purple-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 2 dias atrás
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Produtos em Destaque */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Meus Produtos</h2>
        <div className="flex flex-wrap gap-2">
          {produtor.produtos.flatMap(cat => cat.itens).map((produto) => (
            <span
              key={produto}
              className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100"
            >
              {produto}
            </span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {produtor.localizacao.endereco.split(' - ').slice(-1)[0]}
          </span>
          <span>•</span>
          <span>Capacidade: {produtor.capacidade_mensal_kg}kg/mês</span>
        </div>
      </motion.div>
    </div>
  )
}
