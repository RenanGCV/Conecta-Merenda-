'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import { User, LoginResponse } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const storedUser = authService.getUser();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      setLoading(true);
      const response: LoginResponse = await authService.login(email, senha);
      
      // Salvar token e usuário
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user_info));
      
      setUser(response.user_info);
      
      toast.success(`Bem-vindo(a), ${response.user_info.nome}! 🎉`);
      
      // Redirecionar baseado no perfil
      switch (response.perfil) {
        case 'escola':
          router.push('/escola/dashboard');
          break;
        case 'agricultor':
          router.push('/agricultor/dashboard');
          break;
        case 'secretaria':
          router.push('/secretaria/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao fazer login';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Até logo! 👋');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// HOC para proteger rotas
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/login');
      }
      
      if (!loading && isAuthenticated && allowedRoles && user) {
        if (!allowedRoles.includes(user.perfil)) {
          toast.error('Você não tem permissão para acessar esta página');
          router.push('/');
        }
      }
    }, [loading, isAuthenticated, user, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-creme-papel">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-verde-brocolis border-t-verde-conecta rounded-full animate-spin mx-auto mb-4" />
            <p className="font-display font-bold text-verde-conecta">Carregando...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
