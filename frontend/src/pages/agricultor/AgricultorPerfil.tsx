import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Gift, Users, Copy, Check, Share2, Trophy, Star, Medal, Crown
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { produtores } from '../../data/produtores'

const rewards = [
  { indicacoes: 1, reward: 'Destaque na busca por 1 semana', icon: Star },
  { indicacoes: 3, reward: 'Badge "Líder Comunitário"', icon: Medal },
  { indicacoes: 5, reward: 'Prioridade em grandes pedidos', icon: Trophy },
  { indicacoes: 10, reward: 'Selo "Embaixador AgroMerenda"', icon: Crown },
]

export default function AgricultorPerfil() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  
  const produtor = produtores.find(p => p.id === user?.agricultor?.id) || produtores[0]
  const codigoIndicacao = `AGRO${produtor.id.replace('PROD', '')}`

  const handleCopy = () => {
    navigator.clipboard.writeText(codigoIndicacao)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AgroMerenda - Indique um Vizinho',
        text: `Use meu código ${codigoIndicacao} para se cadastrar no AgroMerenda e vender seus produtos para escolas!`,
        url: 'https://agromerenda.app'
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Indique um Vizinho 🎁
        </h1>
        <p className="text-slate-600">
          Convide outros agricultores e ganhe recompensas exclusivas
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white"
        >
          <Gift className="w-10 h-10 mb-3 opacity-80" />
          <p className="text-3xl font-bold">{produtor.indicacoes}</p>
          <p className="text-purple-200">Indicações feitas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
        >
          <Users className="w-10 h-10 mb-3 opacity-80" />
          <p className="text-3xl font-bold">{produtor.indicacoes >= 3 ? produtor.indicacoes - 2 : 3 - produtor.indicacoes}</p>
          <p className="text-green-200">
            {produtor.indicacoes >= 3 ? 'Vizinhos convertidos' : 'Para próxima recompensa'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white"
        >
          <Trophy className="w-10 h-10 mb-3 opacity-80" />
          <p className="text-3xl font-bold">{produtor.badge ? '🏆' : '🎯'}</p>
          <p className="text-amber-200">{produtor.badge || 'Conquiste seu badge!'}</p>
        </motion.div>
      </div>

      {/* Código de Indicação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Seu Código de Indicação</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-slate-50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-2xl font-mono font-bold text-slate-800 tracking-wider">
              {codigoIndicacao}
            </span>
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors ${
                copied ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Quando um vizinho se cadastrar usando seu código, vocês dois ganham benefícios!
        </p>
      </motion.div>

      {/* Recompensas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Recompensas por Indicação</h2>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200" />
          <div 
            className="absolute left-6 top-8 w-0.5 bg-green-500 transition-all duration-500"
            style={{ 
              height: `${Math.min(100, (produtor.indicacoes / 10) * 100)}%` 
            }}
          />

          <div className="space-y-6">
            {rewards.map((reward, index) => {
              const Icon = reward.icon
              const isAchieved = produtor.indicacoes >= reward.indicacoes
              const isCurrent = produtor.indicacoes < reward.indicacoes && 
                (index === 0 || produtor.indicacoes >= rewards[index - 1].indicacoes)
              
              return (
                <motion.div
                  key={reward.indicacoes}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`flex items-center gap-4 ${isAchieved ? '' : 'opacity-60'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    isAchieved 
                      ? 'bg-green-500 text-white' 
                      : isCurrent
                        ? 'bg-amber-100 text-amber-600 ring-4 ring-amber-100'
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isAchieved ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{reward.indicacoes} indicaç{reward.indicacoes > 1 ? 'ões' : 'ão'}</span>
                      {isAchieved && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Conquistado!
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                          Próximo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{reward.reward}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Como Funciona */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-50 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Como Funciona?</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              1️⃣
            </div>
            <h3 className="font-medium text-slate-800 mb-1">Compartilhe</h3>
            <p className="text-sm text-slate-600">Envie seu código para vizinhos agricultores</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              2️⃣
            </div>
            <h3 className="font-medium text-slate-800 mb-1">Cadastro</h3>
            <p className="text-sm text-slate-600">Seu vizinho se cadastra usando o código</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              3️⃣
            </div>
            <h3 className="font-medium text-slate-800 mb-1">Ganhe</h3>
            <p className="text-sm text-slate-600">Vocês dois recebem benefícios exclusivos!</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
