import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import AgricultorLayout from './pages/agricultor/AgricultorLayout'
import EscolaLayout from './pages/escola/EscolaLayout'
import SecretariaLayout from './pages/secretaria/SecretariaLayout'

function App() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas do Agricultor */}
        <Route 
          path="/agricultor/*" 
          element={
            isAuthenticated && user?.perfil === 'agricultor' 
              ? <AgricultorLayout /> 
              : <Navigate to="/login" />
          } 
        />
        
        {/* Rotas da Escola */}
        <Route 
          path="/escola/*" 
          element={
            isAuthenticated && user?.perfil === 'escola' 
              ? <EscolaLayout /> 
              : <Navigate to="/login" />
          } 
        />
        
        {/* Rotas da Secretaria */}
        <Route 
          path="/secretaria/*" 
          element={
            isAuthenticated && user?.perfil === 'secretaria' 
              ? <SecretariaLayout /> 
              : <Navigate to="/login" />
          } 
        />
        
        {/* Rota padrão */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
