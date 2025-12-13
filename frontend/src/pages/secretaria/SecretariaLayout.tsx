import { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Trophy, FileSearch, QrCode, 
  LogOut, Menu, X, Building2, Bell, School, Users, FileText
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import SecretariaHome from './SecretariaHome'
import Rankings from './Rankings'
import Auditoria from './Auditoria'
import Rastreabilidade from './Rastreabilidade'
import GestaoEscolas from './GestaoEscolas'
import GestaoProdutores from './GestaoProdutores'
import Relatorios from './Relatorios'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/secretaria' },
  { icon: School, label: 'Escolas', path: '/secretaria/escolas' },
  { icon: Users, label: 'Produtores', path: '/secretaria/produtores' },
  { icon: Trophy, label: 'Rankings', path: '/secretaria/rankings' },
  { icon: FileSearch, label: 'Auditoria', path: '/secretaria/auditoria' },
  { icon: QrCode, label: 'Rastreabilidade', path: '/secretaria/rastreabilidade' },
  { icon: FileText, label: 'Relatórios', path: '/secretaria/relatorios' },
]

export default function SecretariaLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">AgroMerenda</h1>
              <p className="text-xs text-slate-500">Secretaria</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100">
          <p className="font-semibold text-slate-800 text-sm truncate">{user?.nome}</p>
          <p className="text-xs text-slate-500 truncate">Secretaria de Educação</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/secretaria'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-rose-100 text-rose-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800">AgroMerenda</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="lg:hidden fixed right-0 top-0 h-screen w-72 bg-white z-50 shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/secretaria'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-rose-100 text-rose-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-6 px-4 lg:px-8 pb-8">
        <Routes>
          <Route index element={<SecretariaHome />} />
          <Route path="escolas" element={<GestaoEscolas />} />
          <Route path="produtores" element={<GestaoProdutores />} />
          <Route path="rankings" element={<Rankings />} />
          <Route path="auditoria" element={<Auditoria />} />
          <Route path="rastreabilidade" element={<Rastreabilidade />} />
          <Route path="relatorios" element={<Relatorios />} />
        </Routes>
      </main>
    </div>
  )
}
