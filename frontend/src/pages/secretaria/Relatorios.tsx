import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Download, Calendar, Filter, BarChart3,
  PieChart, TrendingUp, Users, School, DollarSign,
  FileSpreadsheet, FilePdf, Printer, Mail, CheckCircle
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'

export default function Relatorios() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mensal')
  const [tipoRelatorio, setTipoRelatorio] = useState('geral')

  // Dados para os gráficos
  const dadosMensais = [
    { mes: 'Jul', compras: 45000, meta: 50000 },
    { mes: 'Ago', compras: 52000, meta: 50000 },
    { mes: 'Set', compras: 48000, meta: 50000 },
    { mes: 'Out', compras: 61000, meta: 55000 },
    { mes: 'Nov', compras: 58000, meta: 55000 },
    { mes: 'Dez', compras: 72000, meta: 60000 },
  ]

  const dadosCategorias = [
    { name: 'Hortaliças', value: 35, color: '#22c55e' },
    { name: 'Frutas', value: 25, color: '#f59e0b' },
    { name: 'Grãos', value: 20, color: '#8b5cf6' },
    { name: 'Laticínios', value: 15, color: '#3b82f6' },
    { name: 'Outros', value: 5, color: '#64748b' },
  ]

  const tiposRelatorio = [
    { id: 'geral', label: 'Relatório Geral', icon: FileText },
    { id: 'compras', label: 'Compras por Escola', icon: School },
    { id: 'produtores', label: 'Desempenho de Produtores', icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'conformidade', label: 'Conformidade PNAE', icon: CheckCircle },
  ]

  const relatoriosRecentes = [
    { id: 1, nome: 'Relatório Mensal - Dezembro 2024', data: '15/01/2025', tipo: 'PDF', tamanho: '2.4 MB' },
    { id: 2, nome: 'Análise de Conformidade Q4', data: '10/01/2025', tipo: 'Excel', tamanho: '1.8 MB' },
    { id: 3, nome: 'Compras por Categoria 2024', data: '05/01/2025', tipo: 'PDF', tamanho: '3.1 MB' },
    { id: 4, nome: 'Ranking de Produtores 2024', data: '02/01/2025', tipo: 'PDF', tamanho: '1.2 MB' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FileText className="w-7 h-7" />
              Relatórios e Exportações
            </h1>
            <p className="text-violet-200">
              Gere relatórios detalhados e exporte dados do sistema
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors">
              <Printer className="w-5 h-5" />
              Imprimir
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors">
              <Mail className="w-5 h-5" />
              Enviar
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tipos de Relatório */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {tiposRelatorio.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => setTipoRelatorio(tipo.id)}
            className={`p-4 rounded-xl text-left transition-all ${
              tipoRelatorio === tipo.id
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-violet-300'
            }`}
          >
            <tipo.icon className={`w-6 h-6 mb-2 ${tipoRelatorio === tipo.id ? 'text-white' : 'text-violet-500'}`} />
            <p className="font-medium text-sm">{tipo.label}</p>
          </button>
        ))}
      </motion.div>

      {/* Filtros de Período */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="font-medium text-slate-700">Período:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'semanal', label: 'Semanal' },
              { value: 'mensal', label: 'Mensal' },
              { value: 'trimestral', label: 'Trimestral' },
              { value: 'semestral', label: 'Semestral' },
              { value: 'anual', label: 'Anual' },
            ].map(periodo => (
              <button
                key={periodo.value}
                onClick={() => setPeriodoSelecionado(periodo.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  periodoSelecionado === periodo.value
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {periodo.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <input
              type="date"
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500"
              defaultValue="2024-12-01"
            />
            <span className="text-slate-400 self-center">até</span>
            <input
              type="date"
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500"
              defaultValue="2024-12-31"
            />
          </div>
        </div>
      </motion.div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            Compras Mensais vs Meta
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosMensais}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="compras" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Compras" />
              <Bar dataKey="meta" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Meta" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de Pizza */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-violet-500" />
            Distribuição por Categoria
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={dadosCategorias}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dadosCategorias.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Opções de Exportação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <h3 className="font-semibold text-slate-800 mb-4">Exportar Relatório</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors group">
            <div className="w-12 h-12 bg-red-100 group-hover:bg-red-200 rounded-xl flex items-center justify-center">
              <FilePdf className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-800">PDF</p>
              <p className="text-sm text-slate-500">Documento</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
            <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-800">Excel</p>
              <p className="text-sm text-slate-500">Planilha</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
            <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-800">CSV</p>
              <p className="text-sm text-slate-500">Dados brutos</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors group">
            <div className="w-12 h-12 bg-violet-100 group-hover:bg-violet-200 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-violet-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-800">Email</p>
              <p className="text-sm text-slate-500">Enviar cópia</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Relatórios Recentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Relatórios Recentes</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {relatoriosRecentes.map((rel) => (
            <div key={rel.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                rel.tipo === 'PDF' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {rel.tipo === 'PDF' ? (
                  <FilePdf className="w-6 h-6 text-red-600" />
                ) : (
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{rel.nome}</h4>
                <p className="text-sm text-slate-500">Gerado em {rel.data} • {rel.tamanho}</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Download className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
