import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  QrCode, Search, Package, MapPin, Calendar, User, 
  Truck, CheckCircle, Clock, Leaf, Award, Camera, X
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { pedidos } from '../../data/pedidos'
import { produtores } from '../../data/produtores'
import { escolas } from '../../data/escolas'

interface RastreioResult {
  pedido: typeof pedidos[0]
  produtor: typeof produtores[0]
  escola: typeof escolas[0]
  timeline: {
    status: string
    data: string
    descricao: string
    icon: any
  }[]
}

export default function Rastreabilidade() {
  const [codigoBusca, setCodigoBusca] = useState('')
  const [resultado, setResultado] = useState<RastreioResult | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedPedidoQR, setSelectedPedidoQR] = useState<typeof pedidos[0] | null>(null)
  const [buscando, setBuscando] = useState(false)

  const handleBuscar = () => {
    if (!codigoBusca.trim()) return
    
    setBuscando(true)
    
    // Simular busca
    setTimeout(() => {
      const pedido = pedidos.find(p => 
        p.id.toLowerCase().includes(codigoBusca.toLowerCase()) ||
        p.id.slice(-6).toLowerCase() === codigoBusca.toLowerCase()
      ) || pedidos[0]
      
      const produtor = produtores.find(p => p.id === pedido.produtor_id) || produtores[0]
      const escola = escolas.find(e => e.id === pedido.escola_id) || escolas[0]
      
      const timeline = [
        { status: 'Pedido Criado', data: pedido.data_pedido, descricao: `Pedido realizado por ${escola.nome}`, icon: Package },
        { status: 'Confirmado', data: new Date(new Date(pedido.data_pedido).getTime() + 86400000).toISOString().split('T')[0], descricao: `Produtor ${produtor.nome} confirmou o pedido`, icon: CheckCircle },
        { status: 'Colheita', data: new Date(new Date(pedido.data_pedido).getTime() + 86400000 * 2).toISOString().split('T')[0], descricao: 'Produtos colhidos na propriedade', icon: Leaf },
        { status: 'Em Transporte', data: new Date(new Date(pedido.data_pedido).getTime() + 86400000 * 3).toISOString().split('T')[0], descricao: `Saiu para entrega - ${pedido.logistica?.tipo || 'Próprio'}`, icon: Truck },
        { status: 'Entregue', data: pedido.data_entrega_prevista || new Date(new Date(pedido.data_pedido).getTime() + 86400000 * 4).toISOString().split('T')[0], descricao: `Entregue em ${escola.nome}`, icon: MapPin },
      ]
      
      setResultado({ pedido, produtor, escola, timeline })
      setBuscando(false)
    }, 1500)
  }

  const handleGerarQR = (pedido: typeof pedidos[0]) => {
    setSelectedPedidoQR(pedido)
    setShowQRModal(true)
  }

  const qrData = selectedPedidoQR ? JSON.stringify({
    sistema: 'AgroMerenda',
    pedido_id: selectedPedidoQR.id,
    produtor: selectedPedidoQR.produtor_nome,
    data: selectedPedidoQR.data_pedido,
    itens: selectedPedidoQR.itens.map(i => i.produto).join(', '),
    rastreio_url: `https://agromerenda.gov.br/rastreio/${selectedPedidoQR.id}`
  }) : ''

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <QrCode className="w-7 h-7" />
          Rastreabilidade
        </h1>
        <p className="text-teal-100">
          Acompanhe a origem e jornada dos alimentos do campo à mesa
        </p>
      </motion.div>

      {/* Busca */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
      >
        <h3 className="font-semibold text-slate-800 mb-4">🔍 Rastrear Pedido</h3>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={codigoBusca}
              onChange={(e) => setCodigoBusca(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              placeholder="Digite o código do pedido ou escaneie o QR Code..."
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleBuscar}
            disabled={buscando}
            className="px-6 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {buscando ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Rastrear
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          💡 Dica: Use os últimos 6 caracteres do código do pedido
        </p>
      </motion.div>

      {/* Resultado */}
      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Info do Pedido */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-800">
                      Pedido #{resultado.pedido.id.slice(-6)}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      resultado.pedido.status === 'Entregue' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {resultado.pedido.status}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Rastreie a jornada completa deste pedido
                  </p>
                </div>
                <button
                  onClick={() => handleGerarQR(resultado.pedido)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  Ver QR Code
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Produtor */}
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Produtor</span>
                  </div>
                  <p className="font-semibold text-slate-800">{resultado.produtor.nome}</p>
                  <p className="text-sm text-slate-600">{resultado.produtor.cidade}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {resultado.produtor.selo_dap && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        DAP/CAF ✓
                      </span>
                    )}
                    {resultado.produtor.certificacoes.slice(0, 1).map(cert => (
                      <span key={cert} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Escola */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Destino</span>
                  </div>
                  <p className="font-semibold text-slate-800">{resultado.escola.nome}</p>
                  <p className="text-sm text-slate-600">{resultado.escola.cidade}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {resultado.escola.total_alunos} alunos atendidos
                  </p>
                </div>

                {/* Logística */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Logística</span>
                  </div>
                  <p className="font-semibold text-slate-800">
                    {resultado.pedido.logistica?.tipo || 'Transporte Próprio'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {resultado.pedido.logistica?.distancia_km || 15} km percorridos
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Custo: R$ {resultado.pedido.logistica?.custo?.toFixed(2) || '25.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Produtos */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">📦 Produtos Rastreados</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {resultado.pedido.itens.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                      🥬
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{item.produto}</p>
                      <p className="text-sm text-slate-500">
                        {item.quantidade} {item.unidade} • R$ {item.preco_unitario.toFixed(2)}/{item.unidade}
                      </p>
                    </div>
                    <Leaf className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-6">📍 Jornada do Pedido</h3>
              <div className="relative">
                {resultado.timeline.map((evento, index) => {
                  const Icon = evento.icon
                  const isLast = index === resultado.timeline.length - 1
                  const isPast = index <= resultado.timeline.findIndex(e => 
                    e.status.toLowerCase().includes(resultado.pedido.status.toLowerCase())
                  )
                  
                  return (
                    <div key={index} className="flex gap-4 pb-8 last:pb-0">
                      {/* Linha conectora */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isPast ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 mt-2 ${
                            isPast ? 'bg-teal-500' : 'bg-slate-200'
                          }`} />
                        )}
                      </div>
                      
                      {/* Conteúdo */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-semibold ${isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                            {evento.status}
                          </p>
                          {isPast && index === resultado.timeline.findIndex(e => 
                            e.status.toLowerCase().includes(resultado.pedido.status.toLowerCase())
                          ) && (
                            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">
                              Atual
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${isPast ? 'text-slate-600' : 'text-slate-400'}`}>
                          {evento.descricao}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(evento.data).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pedidos Recentes para Rastrear */}
      {!resultado && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="font-semibold text-slate-800 mb-4">📋 Pedidos Recentes</h3>
          <div className="space-y-3">
            {pedidos.slice(0, 5).map((pedido) => (
              <div 
                key={pedido.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => {
                  setCodigoBusca(pedido.id.slice(-6))
                  handleBuscar()
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    pedido.status === 'Entregue' ? 'bg-green-100' :
                    pedido.status === 'Em Transporte' ? 'bg-purple-100' :
                    'bg-blue-100'
                  }`}>
                    <Package className={`w-5 h-5 ${
                      pedido.status === 'Entregue' ? 'text-green-600' :
                      pedido.status === 'Em Transporte' ? 'text-purple-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">#{pedido.id.slice(-6)}</p>
                    <p className="text-sm text-slate-500">{pedido.produtor_nome}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pedido.status === 'Entregue' ? 'bg-green-100 text-green-700' :
                    pedido.status === 'Em Transporte' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {pedido.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGerarQR(pedido)
                    }}
                    className="p-2 hover:bg-slate-200 rounded-lg"
                  >
                    <QrCode className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modal QR Code */}
      <AnimatePresence>
        {showQRModal && selectedPedidoQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm text-center"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">QR Code de Rastreio</h3>
                <button 
                  onClick={() => setShowQRModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-teal-200 inline-block mb-4">
                <QRCodeSVG 
                  value={qrData}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-4 text-left">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Pedido #{selectedPedidoQR.id.slice(-6)}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedPedidoQR.produtor_nome}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedPedidoQR.itens.map(i => i.produto).join(', ')}
                </p>
              </div>

              <p className="text-sm text-slate-500 mb-4">
                Escaneie este código para rastrear a origem dos alimentos
              </p>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
