import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Send, FileText, Camera, CheckCircle2, ArrowRight, 
  Bot, User, HelpCircle, FileCheck
} from 'lucide-react'

interface Message {
  id: number
  type: 'bot' | 'user'
  content: string
  options?: string[]
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: 'bot',
    content: 'Olá! 👋 Sou o assistente AgroMerenda. Vou te ajudar a se cadastrar no PNAE (Programa Nacional de Alimentação Escolar).',
  },
  {
    id: 2,
    type: 'bot',
    content: 'Para vender seus produtos para escolas públicas, você precisa ter a DAP (Declaração de Aptidão ao PRONAF) ou o CAF (Cadastro Nacional da Agricultura Familiar).',
  },
  {
    id: 3,
    type: 'bot',
    content: 'Você já possui DAP ou CAF ativa?',
    options: ['Sim, já tenho', 'Não tenho ainda', 'Não sei o que é']
  }
]

const tutorialDAP = [
  {
    step: 1,
    title: 'O que é DAP/CAF?',
    content: 'A DAP (Declaração de Aptidão ao PRONAF) ou CAF (Cadastro Nacional da Agricultura Familiar) é um documento que identifica agricultores familiares e permite acessar políticas públicas.'
  },
  {
    step: 2,
    title: 'Quem pode obter?',
    content: 'Agricultores familiares, pescadores artesanais, aquicultores, silvicultores, extrativistas, quilombolas, indígenas e assentados da reforma agrária.'
  },
  {
    step: 3,
    title: 'Onde solicitar?',
    content: 'Procure o Sindicato dos Trabalhadores Rurais, EMATER, ou órgão de assistência técnica do seu município. Leve RG, CPF, comprovante de residência e documentos da propriedade.'
  },
  {
    step: 4,
    title: 'Documentos necessários',
    content: '• RG e CPF de todos da família\n• Comprovante de residência\n• Contrato de arrendamento ou escritura\n• Bloco de notas do produtor\n• Declaração de aptidão ao PRONAF'
  }
]

export default function AgricultorOnboarding() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [showTutorial, setShowTutorial] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleOptionClick = (option: string) => {
    // Adiciona mensagem do usuário
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: option
    }
    setMessages(prev => [...prev, userMessage])

    // Resposta do bot
    setTimeout(() => {
      if (option === 'Sim, já tenho') {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'bot',
          content: 'Ótimo! 🎉 Para validar seu cadastro, você pode enviar uma foto do documento ou informar o número da DAP/CAF.',
        }])
        setTimeout(() => setShowUpload(true), 500)
      } else if (option === 'Não tenho ainda' || option === 'Não sei o que é') {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'bot',
          content: 'Sem problemas! Vou te explicar como obter sua DAP/CAF. É um processo simples e gratuito! 📋',
        }])
        setTimeout(() => setShowTutorial(true), 500)
      }
    }, 800)
  }

  const handleUpload = () => {
    setUploadSuccess(true)
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'bot',
      content: '✅ Documento recebido com sucesso! Seu cadastro foi validado. Agora você pode começar a vender para as escolas da região!'
    }])
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simular resposta
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        content: 'Obrigado pela informação! Estou processando seu cadastro...'
      }])
    }, 800)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Cadastro no PNAE
        </h1>
        <p className="text-slate-600">
          Complete seu cadastro para começar a vender para escolas
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px]"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Assistente AgroMerenda</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'bot' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {message.type === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className={`p-3 rounded-2xl ${
                        message.type === 'bot'
                          ? 'bg-slate-100 text-slate-800 rounded-tl-none'
                          : 'bg-green-500 text-white rounded-tr-none'
                      }`}>
                        {message.content}
                      </div>
                      {message.options && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleOptionClick(option)}
                              className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Upload Section */}
            <AnimatePresence>
              {showUpload && !uploadSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4"
                >
                  <p className="text-sm text-green-800 mb-3 font-medium">
                    Envie uma foto do seu documento DAP/CAF:
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleUpload}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-dashed border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      Tirar Foto
                    </button>
                    <button 
                      onClick={handleUpload}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-dashed border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      Enviar Arquivo
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {uploadSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500 text-white rounded-xl p-6 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">Cadastro Validado!</h3>
                  <p className="text-green-100">
                    Você já pode começar a receber pedidos das escolas
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tutorial Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <AnimatePresence mode="wait">
            {showTutorial ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-slate-800">Como obter DAP/CAF</h3>
                </div>
                
                <div className="space-y-4">
                  {tutorialDAP.map((item, index) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{item.title}</h4>
                        <p className="text-sm text-slate-600 whitespace-pre-line">{item.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button className="w-full mt-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                  Encontrar órgão mais próximo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
              >
                <HelpCircle className="w-10 h-10 mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Precisa de ajuda?</h3>
                <p className="text-green-100 mb-4">
                  Nosso assistente virtual está pronto para responder suas dúvidas sobre o cadastro no PNAE.
                </p>
                <ul className="space-y-2 text-sm text-green-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Como obter DAP/CAF
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Documentos necessários
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Requisitos para vender
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
