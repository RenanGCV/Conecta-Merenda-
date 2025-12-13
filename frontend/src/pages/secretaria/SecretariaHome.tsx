import { motion } from 'framer-motion'
import { 
  TrendingUp, Users, School, DollarSign, Package, 
  Award, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'
import { produtores } from '../../data/produtores'
import { escolas } from '../../data/escolas'
import { pedidos, getRankingProdutores } from '../../data/pedidos'

export default function SecretariaHome() {
  const totalProdutores = produtores.length
  const totalEscolas = escolas.length
  const produtoresAtivos = produtores.filter(p => p.selo_dap).length
  const totalPedidos = pedidos.length
  const pedidosEntregues = pedidos.filter(p => p.status === 'Entregue').length
  const valorTotal = pedidos.reduce((acc, p) => acc + p.total, 0)
  const ranking = getRankingProdutores()

  const stats = [
    { 
      icon: Users, 
      label: 'Produtores Cadastrados', 
      value: totalProdutores,
      change: '+12%',
      positive: true,
      color: 'green'
    },
    { 
      icon: School, 
      label: 'Escolas Ativas', 
      value: totalEscolas,
      change: '+5%',
      positive: true,
      color: 'blue'
    },
    { 
      icon: DollarSign, 
      label: 'Volume Transacionado', 
      value: `R$ ${(valorTotal / 1000).toFixed(1)}k`,
      change: '+23%',
      positive: true,
      color: 'emerald'
    },
    { 
      icon: Package, 
      label: 'Pedidos Realizados', 
      value: totalPedidos,
      change: '+18%',
      positive: true,
      color: 'purple'
    },
  ]

  const dadosMensais = [
    { mes: 'Jan', valor: 45000, pedidos: 120 },
    { mes: 'Fev', valor: 52000, pedidos: 145 },
    { mes: 'Mar', valor: 48000, pedidos: 132 },
    { mes: 'Abr', valor: 61000, pedidos: 168 },
    { mes: 'Mai', valor: 55000, pedidos: 151 },
    { mes: 'Jun', valor: 67000, pedidos: 189 },
    { mes: 'Jul', valor: 72000, pedidos: 201 },
    { mes: 'Ago', valor: 69000, pedidos: 195 },
    { mes: 'Set', valor: 78000, pedidos: 215 },
    { mes: 'Out', valor: 82000, pedidos: 228 },
    { mes: 'Nov', valor: 89000, pedidos: 245 },
    { mes: 'Dez', valor: 95000, pedidos: 262 },
  ]

  const dadosCategorias = [
    { name: 'Hortaliças', value: 35, color: '#22c55e' },
    { name: 'Frutas', value: 28, color: '#f59e0b' },
    { name: 'Grãos', value: 20, color: '#8b5cf6' },
    { name: 'Laticínios', value: 10, color: '#3b82f6' },
    { name: 'Outros', value: 7, color: '#64748b' },
  ]

  const metaPNAE = 30
  const percentualAtingido = 42

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Painel da Secretaria 📊
        </h1>
        <p className="text-rose-100">
          Visão consolidada do programa de alimentação escolar
        </p>
      </motion.div>

      {/* Meta PNAE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Meta PNAE (30%)</h2>
            <p className="text-slate-500 text-sm">
              Percentual de compras da agricultura familiar
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">{percentualAtingido}%</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +12% vs mês anterior
              </p>
            </div>
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { value: percentualAtingido, color: '#22c55e' },
                      { value: 100 - percentualAtingido, color: '#e2e8f0' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-3">
          <Award className="w-5 h-5 text-green-600" />
          <p className="text-green-700 text-sm">
            🎉 Parabéns! A meta mínima do PNAE foi superada em {percentualAtingido - metaPNAE}%
          </p>
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
              <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Evolução Mensal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📈 Evolução Mensal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dadosMensais}>
              <defs>
                <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Area 
                type="monotone" 
                dataKey="valor" 
                stroke="#ec4899" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValor)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribuição por Categoria */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">🥗 Compras por Categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dadosCategorias}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {dadosCategorias.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value: number) => [`${value}%`, 'Participação']} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Produtores e Alertas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Produtores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">🏆 Top Produtores</h3>
          <div className="space-y-3">
            {ranking.slice(0, 5).map((prod, index) => (
              <div 
                key={prod.produtor_id}
                className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-amber-100 text-amber-700' :
                  index === 1 ? 'bg-slate-200 text-slate-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{prod.nome}</p>
                  <p className="text-xs text-slate-500">{prod.totalPedidos} pedidos</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">
                    R$ {prod.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Award className="w-3 h-3" />
                    <span className="text-xs font-medium">{prod.pontos} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alertas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">⚠️ Alertas e Pendências</h3>
          <div className="space-y-3">
            {[
              { tipo: 'warning', msg: '3 escolas abaixo da meta de 30%', acao: 'Ver escolas' },
              { tipo: 'info', msg: '12 novos produtores aguardando aprovação DAP', acao: 'Revisar' },
              { tipo: 'success', msg: 'Relatório mensal disponível para download', acao: 'Baixar' },
              { tipo: 'warning', msg: 'Alerta de seca pode afetar fornecimento', acao: 'Ver detalhes' },
            ].map((alerta, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  alerta.tipo === 'warning' ? 'bg-amber-50 border border-amber-200' :
                  alerta.tipo === 'info' ? 'bg-blue-50 border border-blue-200' :
                  'bg-green-50 border border-green-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alerta.tipo === 'warning' ? 'text-amber-600' :
                    alerta.tipo === 'info' ? 'text-blue-600' :
                    'text-green-600'
                  }`} />
                  <p className={`text-sm font-medium ${
                    alerta.tipo === 'warning' ? 'text-amber-800' :
                    alerta.tipo === 'info' ? 'text-blue-800' :
                    'text-green-800'
                  }`}>
                    {alerta.msg}
                  </p>
                </div>
                <button className={`text-xs font-medium px-3 py-1 rounded-lg ${
                  alerta.tipo === 'warning' ? 'bg-amber-200 text-amber-800' :
                  alerta.tipo === 'info' ? 'bg-blue-200 text-blue-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {alerta.acao}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
