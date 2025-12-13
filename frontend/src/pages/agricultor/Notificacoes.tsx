import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, Check, Trash2, Package, AlertTriangle, 
  TrendingUp, School, CloudRain, Leaf, Star,
  CheckCheck, Clock, X
} from 'lucide-react'

interface Notificacao {
  id: string
  tipo: 'pedido' | 'alerta' | 'oportunidade' | 'clima' | 'avaliacao'
  titulo: string
  mensagem: string
  data: string
  lida: boolean
  urgente?: boolean
  acao?: {
    label: string
    link: string
  }
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    {
      id: '1',
      tipo: 'pedido',
      titulo: 'Novo Pedido Recebido!',
      mensagem: 'Escola Municipal do Centro enviou um pedido de R$ 450,00 para 15/01/2025.',
      data: '2025-01-10T10:30:00',
      lida: false,
      urgente: true,
      acao: { label: 'Ver Pedido', link: '/agricultor/contratos' }
    },
    {
      id: '2',
      tipo: 'clima',
      titulo: '⚠️ Alerta de Geada',
      mensagem: 'Previsão de geada para os próximos 3 dias. Proteja suas culturas sensíveis.',
      data: '2025-01-10T08:00:00',
      lida: false,
      urgente: true
    },
    {
      id: '3',
      tipo: 'oportunidade',
      titulo: '💰 Oportunidade de Venda',
      mensagem: 'Escola Rural Vida Nova está procurando alface e tomate. Você tem esses produtos!',
      data: '2025-01-09T15:20:00',
      lida: false,
      acao: { label: 'Ver Escola', link: '/agricultor/mapa' }
    },
    {
      id: '4',
      tipo: 'avaliacao',
      titulo: '⭐ Nova Avaliação',
      mensagem: 'Escola Esperança avaliou sua última entrega com 5 estrelas!',
      data: '2025-01-08T14:00:00',
      lida: true
    },
    {
      id: '5',
      tipo: 'pedido',
      titulo: 'Entrega Confirmada',
      mensagem: 'A entrega do pedido #P003 foi confirmada pela Escola Educação para Todos.',
      data: '2025-01-07T16:45:00',
      lida: true
    },
    {
      id: '6',
      tipo: 'oportunidade',
      titulo: '📈 Safra em Alta',
      mensagem: 'Seus produtos estão entre os mais procurados este mês. Aproveite!',
      data: '2025-01-06T09:00:00',
      lida: true
    }
  ])

  const [filtro, setFiltro] = useState<'todas' | 'nao_lidas' | 'urgentes'>('todas')

  const notificacoesFiltradas = notificacoes.filter(n => {
    if (filtro === 'nao_lidas') return !n.lida
    if (filtro === 'urgentes') return n.urgente
    return true
  })

  const naoLidas = notificacoes.filter(n => !n.lida).length

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => prev.map(n => 
      n.id === id ? { ...n, lida: true } : n
    ))
  }

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
  }

  const excluirNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id))
  }

  const getIconByTipo = (tipo: string) => {
    switch(tipo) {
      case 'pedido': return Package
      case 'alerta': return AlertTriangle
      case 'oportunidade': return TrendingUp
      case 'clima': return CloudRain
      case 'avaliacao': return Star
      default: return Bell
    }
  }

  const getColorByTipo = (tipo: string) => {
    switch(tipo) {
      case 'pedido': return 'bg-blue-100 text-blue-600'
      case 'alerta': return 'bg-red-100 text-red-600'
      case 'oportunidade': return 'bg-green-100 text-green-600'
      case 'clima': return 'bg-amber-100 text-amber-600'
      case 'avaliacao': return 'bg-purple-100 text-purple-600'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr)
    const agora = new Date()
    const diffMs = agora.getTime() - data.getTime()
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHoras < 1) return 'Agora mesmo'
    if (diffHoras < 24) return `Há ${diffHoras}h`
    if (diffDias === 1) return 'Ontem'
    if (diffDias < 7) return `Há ${diffDias} dias`
    return data.toLocaleDateString('pt-BR')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Bell className="w-7 h-7" />
              Notificações
            </h1>
            <p className="text-rose-100">
              {naoLidas > 0 
                ? `Você tem ${naoLidas} notificação(ões) não lida(s)` 
                : 'Todas as notificações foram lidas'}
            </p>
          </div>
          {naoLidas > 0 && (
            <button
              onClick={marcarTodasComoLidas}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
            >
              <CheckCheck className="w-5 h-5" />
              <span>Marcar todas como lidas</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        {[
          { value: 'todas', label: 'Todas', count: notificacoes.length },
          { value: 'nao_lidas', label: 'Não Lidas', count: naoLidas },
          { value: 'urgentes', label: '🔴 Urgentes', count: notificacoes.filter(n => n.urgente).length },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => setFiltro(opt.value as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              filtro === opt.value
                ? 'bg-rose-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {opt.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filtro === opt.value ? 'bg-white/20' : 'bg-slate-100'
            }`}>
              {opt.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Lista de Notificações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <AnimatePresence>
          {notificacoesFiltradas.map((notif) => {
            const Icon = getIconByTipo(notif.tipo)
            
            return (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                  notif.lida 
                    ? 'border-slate-100 opacity-75' 
                    : notif.urgente 
                      ? 'border-red-200 bg-red-50/50' 
                      : 'border-slate-200'
                }`}
              >
                <div className="flex gap-4">
                  {/* Ícone */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getColorByTipo(notif.tipo)}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${notif.lida ? 'text-slate-600' : 'text-slate-800'}`}>
                        {notif.titulo}
                        {notif.urgente && !notif.lida && (
                          <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            Urgente
                          </span>
                        )}
                      </h3>
                      <span className="text-sm text-slate-400 whitespace-nowrap flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatarData(notif.data)}
                      </span>
                    </div>
                    <p className={`text-sm ${notif.lida ? 'text-slate-400' : 'text-slate-600'}`}>
                      {notif.mensagem}
                    </p>
                    
                    {/* Ações */}
                    <div className="flex items-center gap-2 mt-3">
                      {notif.acao && (
                        <button className="px-3 py-1.5 bg-rose-100 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-200 transition-colors">
                          {notif.acao.label}
                        </button>
                      )}
                      {!notif.lida && (
                        <button
                          onClick={() => marcarComoLida(notif.id)}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Marcar como lida
                        </button>
                      )}
                      <button
                        onClick={() => excluirNotificacao(notif.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {notificacoesFiltradas.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Nenhuma notificação encontrada</p>
            <p className="text-sm text-slate-400 mt-1">
              {filtro === 'nao_lidas' 
                ? 'Todas as notificações foram lidas' 
                : 'Você não tem notificações no momento'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Dica */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h4 className="font-medium text-slate-700">Dica do AgroMerenda</h4>
            <p className="text-sm text-slate-500 mt-1">
              Mantenha suas notificações em dia para não perder oportunidades de venda e 
              ficar atualizado sobre os pedidos das escolas.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
