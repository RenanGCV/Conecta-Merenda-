import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Tractor, School, Building2, Leaf, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth, UserProfile } from '../contexts/AuthContext'

const profiles = [
  {
    id: 'agricultor' as UserProfile,
    title: 'Agricultor',
    description: 'Venda seus produtos para escolas da região',
    icon: Tractor,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverBorder: 'hover:border-green-400',
    iconColor: 'text-green-600'
  },
  {
    id: 'escola' as UserProfile,
    title: 'Escola',
    description: 'Compre alimentos frescos de produtores locais',
    icon: School,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    iconColor: 'text-blue-600'
  },
  {
    id: 'secretaria' as UserProfile,
    title: 'Secretaria',
    description: 'Monitore e audite as compras públicas',
    icon: Building2,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverBorder: 'hover:border-purple-400',
    iconColor: 'text-purple-600'
  }
]

export default function Login() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!selectedProfile) return
    
    setIsLoading(true)
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 800))
    
    login(selectedProfile)
    navigate(`/${selectedProfile}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AgroMerenda</h1>
            <p className="text-sm text-slate-500">Agricultura Familiar nas Escolas</p>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Bem-vindo ao AgroMerenda
            </h2>
            <p className="text-lg text-slate-600">
              Selecione seu perfil para continuar
            </p>
          </motion.div>

          {/* Profile Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {profiles.map((profile, index) => {
              const Icon = profile.icon
              const isSelected = selectedProfile === profile.id
              
              return (
                <motion.button
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => setSelectedProfile(profile.id)}
                  className={`
                    relative p-6 rounded-2xl border-2 text-left transition-all duration-300
                    ${isSelected 
                      ? `${profile.bgColor} ${profile.borderColor} ring-4 ring-offset-2 ring-${profile.id === 'agricultor' ? 'green' : profile.id === 'escola' ? 'blue' : 'purple'}-200` 
                      : `bg-white border-slate-200 ${profile.hoverBorder} hover:shadow-lg`
                    }
                  `}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${profile.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {profile.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {profile.description}
                  </p>
                </motion.button>
              )
            })}
          </div>

          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <button
              onClick={handleLogin}
              disabled={!selectedProfile || isLoading}
              className={`
                px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all duration-300
                ${selectedProfile
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar como {selectedProfile ? profiles.find(p => p.id === selectedProfile)?.title : '...'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-6 text-center"
          >
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600">30%</div>
              <div className="text-sm text-slate-600">Meta PNAE para Agricultura Familiar</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600">10+</div>
              <div className="text-sm text-slate-600">Produtores Cadastrados</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-600">5</div>
              <div className="text-sm text-slate-600">Escolas Conectadas</div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-slate-500">
        <p>🌱 AgroMerenda - Conectando quem planta com quem alimenta</p>
        <p className="mt-1">Hackathon MVP 2024</p>
      </footer>
    </div>
  )
}
