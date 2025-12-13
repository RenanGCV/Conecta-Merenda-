import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { Icon } from 'leaflet'
import { 
  Search, Filter, Star, MapPin, Phone, Package, 
  Truck, Award, ChevronDown, ShoppingCart, X
} from 'lucide-react'
import { produtores } from '../../data/produtores'
import { useAuth } from '../../contexts/AuthContext'
import { escolas } from '../../data/escolas'
import 'leaflet/dist/leaflet.css'

const farmIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const schoolIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function BuscaProdutores() {
  const { user } = useAuth()
  const escola = escolas.find(e => e.id === user?.escola?.id) || escolas[0]
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduto, setSelectedProduto] = useState('')
  const [raioKm, setRaioKm] = useState(30)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProdutor, setSelectedProdutor] = useState<typeof produtores[0] | null>(null)
  const [carrinho, setCarrinho] = useState<{produtorId: string, produtos: string[]}[]>([])

  const allProdutos = useMemo(() => {
    const produtos = new Set<string>()
    produtores.forEach(p => p.produtos.forEach(prod => produtos.add(prod)))
    return Array.from(produtos).sort()
  }, [])

  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const produtoresFiltrados = useMemo(() => {
    return produtores
      .map(p => ({
        ...p,
        distancia: calcularDistancia(
          escola.localizacao.lat,
          escola.localizacao.lng,
          p.localizacao.lat,
          p.localizacao.lng
        )
      }))
      .filter(p => {
        const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.produtos.some(prod => prod.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchProduto = !selectedProduto || p.produtos.includes(selectedProduto)
        const matchRaio = p.distancia <= raioKm
        return matchSearch && matchProduto && matchRaio
      })
      .sort((a, b) => a.distancia - b.distancia)
  }, [searchTerm, selectedProduto, raioKm, escola])

  const adicionarAoCarrinho = (produtorId: string, produto: string) => {
    setCarrinho(prev => {
      const existing = prev.find(c => c.produtorId === produtorId)
      if (existing) {
        if (existing.produtos.includes(produto)) {
          return prev.map(c => 
            c.produtorId === produtorId 
              ? { ...c, produtos: c.produtos.filter(p => p !== produto) }
              : c
          ).filter(c => c.produtos.length > 0)
        }
        return prev.map(c => 
          c.produtorId === produtorId 
            ? { ...c, produtos: [...c.produtos, produto] }
            : c
        )
      }
      return [...prev, { produtorId, produtos: [produto] }]
    })
  }

  const isNoCarrinho = (produtorId: string, produto: string) => {
    return carrinho.find(c => c.produtorId === produtorId)?.produtos.includes(produto) || false
  }

  const totalItensCarrinho = carrinho.reduce((acc, c) => acc + c.produtos.length, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <MapPin className="w-7 h-7" />
          Buscar Produtores
        </h1>
        <p className="text-green-100">
          Encontre agricultores familiares próximos à {escola.nome}
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-700">Filtros</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 pt-4 border-t border-slate-100 grid md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Produto</label>
              <select
                value={selectedProduto}
                onChange={(e) => setSelectedProduto(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todos os produtos</option>
                {allProdutos.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Raio de busca: <span className="text-green-600 font-bold">{raioKm} km</span>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={raioKm}
                onChange={(e) => setRaioKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>5 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Mapa e Lista */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mapa */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-[500px]"
        >
          <MapContainer 
            center={[escola.localizacao.lat, escola.localizacao.lng]} 
            zoom={11} 
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Círculo de raio */}
            <Circle
              center={[escola.localizacao.lat, escola.localizacao.lng]}
              radius={raioKm * 1000}
              pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.1 }}
            />

            {/* Escola */}
            <Marker 
              position={[escola.localizacao.lat, escola.localizacao.lng]}
              icon={schoolIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold">🏫 {escola.nome}</p>
                  <p className="text-sm text-slate-600">Sua escola</p>
                </div>
              </Popup>
            </Marker>

            {/* Produtores */}
            {produtoresFiltrados.map((produtor) => (
              <Marker
                key={produtor.id}
                position={[produtor.localizacao.lat, produtor.localizacao.lng]}
                icon={farmIcon}
                eventHandlers={{
                  click: () => setSelectedProdutor(produtor)
                }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <p className="font-bold text-green-700">🌱 {produtor.nome}</p>
                    <p className="text-xs text-slate-600">{produtor.cidade}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span className="text-sm font-medium">{produtor.avaliacao}</span>
                      <span className="text-xs text-slate-400">• {produtor.distancia?.toFixed(1)} km</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {produtor.produtos.slice(0, 3).map(p => (
                        <span key={p} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Lista de Produtores */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
        >
          <p className="text-sm text-slate-600">
            {produtoresFiltrados.length} produtores encontrados
          </p>

          {produtoresFiltrados.map((produtor) => (
            <div
              key={produtor.id}
              onClick={() => setSelectedProdutor(produtor)}
              className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                selectedProdutor?.id === produtor.id ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{produtor.nome}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {produtor.cidade} • {produtor.distancia?.toFixed(1)} km
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-semibold text-amber-700">{produtor.avaliacao}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {produtor.selo_dap && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    DAP/CAF
                  </span>
                )}
                {produtor.certificacoes.map(cert => (
                  <span key={cert} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                    {cert}
                  </span>
                ))}
              </div>

              {/* Produtos */}
              <div className="flex flex-wrap gap-2 mb-3">
                {produtor.produtos.slice(0, 4).map(p => (
                  <span key={p} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs">
                    {p}
                  </span>
                ))}
                {produtor.produtos.length > 4 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs">
                    +{produtor.produtos.length - 4}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  {produtor.capacidade_entrega}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {produtor.entregas_realizadas} entregas
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal Produtor Selecionado */}
      {selectedProdutor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProdutor(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedProdutor.nome}</h3>
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedProdutor.cidade} • {selectedProdutor.distancia?.toFixed(1)} km
                </p>
              </div>
              <button 
                onClick={() => setSelectedProdutor(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-lg">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="font-semibold text-amber-700">{selectedProdutor.avaliacao}</span>
              </div>
              <div className="text-sm text-slate-600">
                {selectedProdutor.entregas_realizadas} entregas realizadas
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl mb-4">
              <Phone className="w-5 h-5 text-green-600" />
              <span className="font-medium text-slate-700">{selectedProdutor.telefone}</span>
            </div>

            <h4 className="font-semibold text-slate-800 mb-3">Produtos Disponíveis</h4>
            <div className="space-y-2 mb-6">
              {selectedProdutor.produtos.map(produto => (
                <div 
                  key={produto}
                  onClick={() => adicionarAoCarrinho(selectedProdutor.id, produto)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isNoCarrinho(selectedProdutor.id, produto)
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                  }`}
                >
                  <span className="font-medium text-slate-700">{produto}</span>
                  {isNoCarrinho(selectedProdutor.id, produto) ? (
                    <span className="text-green-600 text-sm font-medium">✓ Adicionado</span>
                  ) : (
                    <span className="text-slate-400 text-sm">+ Adicionar</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedProdutor(null)}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Carrinho Flutuante */}
      {totalItensCarrinho > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <ShoppingCart className="w-5 h-5" />
            Finalizar Pedido ({totalItensCarrinho} produtos de {carrinho.length} produtores)
          </button>
        </motion.div>
      )}
    </div>
  )
}
