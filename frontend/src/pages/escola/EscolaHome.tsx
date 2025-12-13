import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ShoppingBag, DollarSign, TrendingUp, AlertTriangle, Clock, 
  Star, Package, ArrowRight, Sparkles, MapPin
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { escolas } from '../../data/escolas'
import { pedidos } from '../../data/pedidos'
import { getAlertasAtivos } from '../../data/clima'

export default function EscolaHome() {
  const { user } = useAuth()
  
  const escola = escolas.find(e => e.id === user?.escola?.id) || escolas[0]
  const meusPedidos = pedidos.filter(p => p.escola_id === escola.id)
  const pedidosPendentes = meusPedidos.filter(p => p.status === 'Pendente' || p.status === 'Confirmado')
  const totalGasto = meusPedidos.filter(p => p.status === 'Entregue').reduce((acc, p) => acc + p.total, 0)
  const percentualAgricFamiliar = ((totalGasto / escola.orcamento_mensal) * 100).toFixed(1)
  const alertasAtivos = getAlertasAtivos()

  const stats = [
    { 
      icon: DollarSign, 
      label: 'Orçamento Mensal', 
      value: `R$ ${escola.orcamento_mensal.toLocaleString('pt-BR')}`,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: ShoppingBag, 
      label: 'Gasto Agric. Familiar', 
      value: `R$ ${totalGasto.toLocaleString('pt-BR')}`,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      icon: TrendingUp, 
      label: 'Meta PNAE (30%)', 
      value: `${percentualAgricFamiliar}%`,
      color: parseFloat(percentualAgricFamiliar) >= 30 ? 'bg-green-500' : 'bg-amber-500',
      bgColor: parseFloat(percentualAgricFamiliar) >= 30 ? 'bg-green-50' : 'bg-amber-50'
    },
    { 
      icon: Package, 
      label: 'Pedidos Pendentes', 
      value: pedidosPendentes.length,
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
        className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Olá, {user?.nome?.split(' ')[0]}! 👋
            </h1>
            <p className="text-blue-100">
              {escola.nome} • {escola.total_alunos} alunos
            </p>
          </div>
          <Link 
            to="ia-cardapio"
            className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Sugestão IA</span>
          </Link>
        </div>
      </motion.div>

      {/* Alerta Climático */}
      {alertasAtivos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">⚠️ Alerta Climático</h3>
              <p className="text-sm text-amber-700 mt-1">
                {alertasAtivos[0].tipo} prevista para {new Date(alertasAtivos[0].data_inicio).toLocaleDateString('pt-BR')}.
                Produtos afetados: {alertasAtivos[0].impacto_produtos.join(', ')}.
              </p>
              <p className="text-sm text-amber-600 mt-2">
                💡 {alertasAtivos[0].recomendacao}
              </p>
            </div>
          </div>
        </motion.div>
      )}

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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <Link 
          to="merendometro"
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">Merendômetro</h3>
          <p className="text-sm text-slate-500">Registre feedback sobre o cardápio</p>
        </Link>

        <Link 
          to="busca"
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:border-green-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">Buscar Produtores</h3>
          <p className="text-sm text-slate-500">Encontre agricultores próximos</p>
        </Link>

        <Link 
          to="avaliacoes"
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">Avaliar Entregas</h3>
          <p className="text-sm text-slate-500">Avalie os produtos recebidos</p>
        </Link>
      </motion.div>

      {/* Pedidos Recentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Pedidos Recentes</h2>
          <Link to="pedidos" className="text-sm text-blue-600 font-medium hover:underline">
            Ver todos
          </Link>
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
                pedido.status === 'Em Transporte' ? 'bg-purple-100 text-purple-600' :
                'bg-slate-100 text-slate-600'
              }`}>
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{pedido.produtor_nome}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">
                  R$ {pedido.total.toFixed(2)}
                </p>
                <p className={`text-xs font-medium ${
                  pedido.status === 'Entregue' ? 'text-green-600' :
                  pedido.status === 'Pendente' ? 'text-amber-600' :
                  pedido.status === 'Em Transporte' ? 'text-purple-600' :
                  'text-blue-600'
                }`}>
                  {pedido.status}
                </p>
              </div>
              {pedido.status === 'Entregue' && !pedido.avaliacao && (
                <Link 
                  to="avaliacoes"
                  className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full hover:bg-amber-200"
                >
                  Avaliar
                </Link>
              )}
              {pedido.avaliacao && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{pedido.avaliacao.nota}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
