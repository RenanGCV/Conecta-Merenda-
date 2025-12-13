import { createContext, useContext, useState, ReactNode } from 'react'

export type UserProfile = 'agricultor' | 'escola' | 'secretaria'

export interface User {
  id: string
  nome: string
  email: string
  perfil: UserProfile
  avatar?: string
  // Dados específicos por perfil
  escola?: {
    id: string
    nome: string
    endereco: string
  }
  agricultor?: {
    id: string
    nome: string
    produtos: string[]
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (perfil: UserProfile, userData?: Partial<User>) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuários mockados para cada perfil
const mockUsers: Record<UserProfile, User> = {
  agricultor: {
    id: 'PROD001',
    nome: 'João da Silva',
    email: 'joao.silva@email.com',
    perfil: 'agricultor',
    avatar: '👨‍🌾',
    agricultor: {
      id: 'PROD001',
      nome: 'João da Silva',
      produtos: ['Alface', 'Tomate', 'Cenoura', 'Banana']
    }
  },
  escola: {
    id: 'ESC001',
    nome: 'Ana Paula Souza',
    email: 'ana.souza@educacao.sp.gov.br',
    perfil: 'escola',
    avatar: '👩‍💼',
    escola: {
      id: 'ESC001',
      nome: 'EMEF Prof. Maria Aparecida',
      endereco: 'Rua das Flores, 123 - São Paulo - SP'
    }
  },
  secretaria: {
    id: 'SEC001',
    nome: 'Carlos Mendes',
    email: 'carlos.mendes@educacao.sp.gov.br',
    perfil: 'secretaria',
    avatar: '🏛️'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (perfil: UserProfile, userData?: Partial<User>) => {
    const baseUser = mockUsers[perfil]
    setUser({ ...baseUser, ...userData })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
