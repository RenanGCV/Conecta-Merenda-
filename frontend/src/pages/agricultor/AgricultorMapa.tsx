import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Users, Star, Phone, Package } from 'lucide-react'
import { produtores, Produtor, calcularDistancia } from '../../data/produtores'
import { useAuth } from '../../contexts/AuthContext'

// Fix Leaflet default icon issue
import 'leaflet/dist/leaflet.css'

// Custom marker icon
const createMarkerIcon = (isCurrentUser: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${isCurrentUser ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #0284c7, #0369a1)'};
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    ">${isCurrentUser ? '📍' : '👨‍🌾'}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 11)
  }, [center, map])
  return null
}

export default function AgricultorMapa() {
  const { user } = useAuth()
  const [selectedProdutor, setSelectedProdutor] = useState<Produtor | null>(null)
  
  // Produtor atual (logado)
  const produtorAtual = produtores.find(p => p.id === user?.agricultor?.id) || produtores[0]
  
  // Outros produtores na vizinhança (excluindo o atual)
  const outrosProdutores = produtores.filter(p => p.id !== produtorAtual.id)
  
  // Calcular distância de cada produtor
  const produtoresComDistancia = outrosProdutores.map(p => ({
    ...p,
    distancia: calcularDistancia(
      produtorAtual.localizacao.latitude,
      produtorAtual.localizacao.longitude,
      p.localizacao.latitude,
      p.localizacao.longitude
    )
  })).sort((a, b) => a.distancia - b.distancia)

  const center: [number, number] = [
    produtorAtual.localizacao.latitude,
    produtorAtual.localizacao.longitude
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Mapa da Vizinhança
        </h1>
        <p className="text-slate-600">
          Veja outros agricultores cadastrados na sua região
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{outrosProdutores.length}</p>
            <p className="text-sm text-slate-500">Agricultores próximos</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">50km</p>
            <p className="text-sm text-slate-500">Raio de busca</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">
              {produtorAtual.indicacoes}
            </p>
            <p className="text-sm text-slate-500">Suas indicações</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[500px]"
        >
          <MapContainer
            center={center}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={center} />

            {/* Raio de entrega do produtor atual */}
            <Circle
              center={center}
              radius={produtorAtual.localizacao.raio_entrega_km * 1000}
              pathOptions={{
                color: '#16a34a',
                fillColor: '#16a34a',
                fillOpacity: 0.1,
                weight: 2
              }}
            />

            {/* Marcador do produtor atual */}
            <Marker 
              position={center}
              icon={createMarkerIcon(true)}
            >
              <Popup>
                <div className="text-center p-2">
                  <p className="font-bold text-green-700">📍 Você está aqui</p>
                  <p className="text-sm text-slate-600">{produtorAtual.nome}</p>
                </div>
              </Popup>
            </Marker>

            {/* Marcadores dos outros produtores */}
            {produtoresComDistancia.map(produtor => (
              <Marker
                key={produtor.id}
                position={[produtor.localizacao.latitude, produtor.localizacao.longitude]}
                icon={createMarkerIcon(false)}
                eventHandlers={{
                  click: () => setSelectedProdutor(produtor)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{produtor.foto_perfil}</span>
                      <div>
                        <p className="font-bold text-slate-800">{produtor.nome}</p>
                        <p className="text-xs text-slate-500">{produtor.distancia.toFixed(1)} km de você</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{produtor.avaliacao.media}</span>
                      <span className="text-slate-400 text-xs">({produtor.avaliacao.total_vendas} vendas)</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {produtor.produtos.flatMap(c => c.itens).slice(0, 3).map(item => (
                        <span key={item} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {item}
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
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 h-[500px] overflow-y-auto"
        >
          <h3 className="font-semibold text-slate-800 mb-4">Agricultores Próximos</h3>
          
          <div className="space-y-3">
            {produtoresComDistancia.map((produtor, index) => (
              <motion.div
                key={produtor.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedProdutor(produtor)}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedProdutor?.id === produtor.id
                    ? 'border-green-300 bg-green-50'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {produtor.foto_perfil}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800 truncate">{produtor.nome}</p>
                      {produtor.badge && (
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                          🏆
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {produtor.distancia.toFixed(1)} km
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">{produtor.avaliacao.media}</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        {produtor.avaliacao.total_vendas} vendas
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Produtos */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {produtor.produtos.flatMap(c => c.itens).slice(0, 4).map(item => (
                    <span key={item} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Prova Social */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">🌱 Junte-se à comunidade!</h3>
            <p className="text-green-100">
              {outrosProdutores.length} agricultores já estão vendendo para escolas da região.
              Convide seus vizinhos e ganhe destaque!
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors flex-shrink-0">
            Convidar Vizinho
          </button>
        </div>
      </motion.div>
    </div>
  )
}
