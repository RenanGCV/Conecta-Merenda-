import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, Home, User, MapPin, Gift, Bell, LogOut, Menu, X, ChevronRight,
  Package, FileText
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AgricultorHome from './AgricultorHome'
import AgricultorOnboarding from './AgricultorOnboarding'
import AgricultorMapa from './AgricultorMapa'
import AgricultorPerfil from './AgricultorPerfil'
import MeusProdutos from './MeusProdutos'
import MeusContratos from './MeusContratos'
import Notificacoes from './Notificacoes'

const menuItems = [
  { path: '', icon: Home, label: 'Início', end: true },
  { path: 'produtos', icon: Package, label: 'Meus Produtos' },
  { path: 'contratos', icon: FileText, label: 'Contratos' },
  { path: 'mapa', icon: MapPin, label: 'Vizinhança' },
  { path: 'notificacoes', icon: Bell, label: 'Notificações' },
  { path: 'indicacoes', icon: Gift, label: 'Indicações' },
  { path: 'onboarding', icon: User, label: 'Meu Perfil' },
]

export default function AgricultorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">AgroMerenda</h1>
              <p className="text-xs text-slate-500">Agricultor</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-green-50 text-green-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
              {user?.avatar || '👨‍🌾'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{user?.nome}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-slate-800">AgroMerenda</h1>
                    <p className="text-xs text-slate-500">Agricultor</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          end={item.end}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                            ${isActive 
                              ? 'bg-green-50 text-green-700 font-medium' 
                              : 'text-slate-600 hover:bg-slate-50'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                          <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* User Card */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                    {user?.avatar || '👨‍🌾'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{user?.nome}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">AgroMerenda</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-slate-100 relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Routes>
            <Route index element={<AgricultorHome />} />
            <Route path="produtos" element={<MeusProdutos />} />
            <Route path="contratos" element={<MeusContratos />} />
            <Route path="onboarding" element={<AgricultorOnboarding />} />
            <Route path="mapa" element={<AgricultorMapa />} />
            <Route path="notificacoes" element={<Notificacoes />} />
            <Route path="indicacoes" element={<AgricultorPerfil />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
