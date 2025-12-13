import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, Medal, TrendingUp, Star, Award, Filter,
  ChevronDown, School, Users, MapPin
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { produtores } from '../../data/produtores'
import { escolas } from '../../data/escolas'
import { getRankingProdutores } from '../../data/pedidos'

export default function Rankings() {
  const [tipoRanking, setTipoRanking] = useState<'produtores' | 'escolas'>('produtores')
  const [periodo, setPeriodo] = useState('mes')
  
  const rankingProdutores = getRankingProdutores()
  
  const rankingEscolas = escolas.map(e => ({
    ...e,
    percentualMeta: Math.random() * 30 + 25, // Simulado
    totalCompras: Math.floor(Math.random() * 50000) + 10000,
    pedidosRealizados: Math.floor(Math.random() * 50) + 10,
  })).sort((a, b) => b.percentualMeta - a.percentualMeta)

  const dadosGraficoProdutores = rankingProdutores.slice(0, 6).map(p => ({
    nome: p.nome.split(' ')[0],
    valor: p.valorTotal,
    pedidos: p.totalPedidos
  }))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-7 h-7" />
          Rankings
        </h1>
        <p className="text-amber-100">
          Acompanhe o desempenho de produtores e escolas
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex gap-2">
          <button
            onClick={() => setTipoRanking('produtores')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              tipoRanking === 'produtores'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Produtores
          </button>
          <button
            onClick={() => setTipoRanking('escolas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              tipoRanking === 'escolas'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'
            }`}
          >
            <School className="w-4 h-4" />
            Escolas
          </button>
        </div>
        
        <div className="relative">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="appearance-none px-4 py-2 pr-10 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          >
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="trimestre">Trimestre</option>
            <option value="ano">Este Ano</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </motion.div>

      {/* Top 3 Destaque */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {(tipoRanking === 'produtores' ? rankingProdutores : rankingEscolas).slice(0, 3).map((item, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl p-6 ${
              index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
              index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
              'bg-gradient-to-br from-orange-300 to-orange-500 text-white'
            }`}
          >
            <div className="absolute top-2 right-2">
              <span className="text-4xl font-bold opacity-30">#{index + 1}</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-white/20' : 'bg-white/20'
              }`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
              <div>
                <p className="font-bold text-lg">
                  {tipoRanking === 'produtores' 
                    ? (item as typeof rankingProdutores[0]).nome
                    : (item as typeof rankingEscolas[0]).nome
                  }
                </p>
                {tipoRanking === 'produtores' ? (
                  <p className="text-sm opacity-80">
                    {(item as typeof rankingProdutores[0]).totalPedidos} entregas
                  </p>
                ) : (
                  <p className="text-sm opacity-80 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {(item as typeof rankingEscolas[0]).cidade}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-end justify-between">
              {tipoRanking === 'produtores' ? (
                <>
                  <div>
                    <p className="text-xs opacity-70">Volume Total</p>
                    <p className="text-xl font-bold">
                      R$ {(item as typeof rankingProdutores[0]).valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                    <Award className="w-4 h-4" />
                    <span className="font-bold">{(item as typeof rankingProdutores[0]).pontos} pts</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs opacity-70">Meta PNAE</p>
                    <p className="text-xl font-bold">
                      {(item as typeof rankingEscolas[0]).percentualMeta.toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold">+5%</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Gráfico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          📊 {tipoRanking === 'produtores' ? 'Volume por Produtor' : 'Desempenho por Escola'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tipoRanking === 'produtores' ? dadosGraficoProdutores : rankingEscolas.slice(0, 6).map(e => ({
            nome: e.nome.split(' ').slice(0, 2).join(' '),
            valor: e.totalCompras,
            meta: e.percentualMeta
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="nome" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
            <Tooltip 
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Bar dataKey="valor" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Lista Completa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          🏅 Ranking Completo
        </h3>
        <div className="space-y-3">
          {(tipoRanking === 'produtores' ? rankingProdutores : rankingEscolas).map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                index < 3 
                  ? index === 0 ? 'bg-amber-100 text-amber-700' :
                    index === 1 ? 'bg-slate-200 text-slate-700' :
                    'bg-orange-100 text-orange-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {index < 3 ? (
                  index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  {tipoRanking === 'produtores' 
                    ? (item as typeof rankingProdutores[0]).nome
                    : (item as typeof rankingEscolas[0]).nome
                  }
                </p>
                <p className="text-sm text-slate-500">
                  {tipoRanking === 'produtores' 
                    ? `${(item as typeof rankingProdutores[0]).totalPedidos} entregas realizadas`
                    : `${(item as typeof rankingEscolas[0]).total_alunos} alunos`
                  }
                </p>
              </div>
              
              {tipoRanking === 'produtores' ? (
                <>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">
                      R$ {(item as typeof rankingProdutores[0]).valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-1 justify-end text-amber-600">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-medium">
                        {(item as typeof rankingProdutores[0]).pontos} pontos
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:flex gap-1">
                    {produtores.find(p => p.id === (item as typeof rankingProdutores[0]).produtor_id)?.badges?.slice(0, 2).map((badge, i) => (
                      <span key={i} className="text-lg" title={badge}>{badge}</span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-right">
                  <p className={`font-bold ${
                    (item as typeof rankingEscolas[0]).percentualMeta >= 30 
                      ? 'text-green-600' 
                      : 'text-amber-600'
                  }`}>
                    {(item as typeof rankingEscolas[0]).percentualMeta.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500">Meta PNAE</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
