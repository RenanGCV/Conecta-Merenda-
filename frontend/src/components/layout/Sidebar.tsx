'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  School,
  Bell,
  Package,
  BarChart3,
  Sparkles,
  CalendarDays,
  User,
} from 'lucide-react';
import { useCarrinho } from '@/contexts/CarrinhoContext';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface SidebarProps {
  perfil?: 'escola' | 'agricultor' | 'secretaria';
}

// Menu apenas para a Diretora da Escola
const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/escola/dashboard', icon: LayoutDashboard },
  { label: 'Sugestões IA', href: '/escola/sugestoes', icon: Sparkles },
  { label: 'Marketplace', href: '/escola/marketplace', icon: Store },
  { label: 'Meus Pedidos', href: '/escola/pedidos', icon: Package },
  { label: 'Cardápio', href: '/escola/cardapio', icon: CalendarDays },
  { label: 'Relatórios', href: '/escola/relatorios', icon: BarChart3 },
  { label: 'Perfil', href: '/escola/perfil', icon: Settings },
];

export function Sidebar({ perfil = 'escola' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { totalItens } = useCarrinho();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full bg-verde-conecta z-50',
        'flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥦</span>
              <div>
                <h1 className="font-display font-bold text-white text-sm">
                  Conecta Merenda
                </h1>
                <p className="text-white/60 text-xs">Painel da Diretora</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const showBadge = item.href.includes('marketplace') && totalItens > 0;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl',
                    'font-display font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-verde-brocolis text-verde-conecta shadow-hard'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {showBadge && (
                        <span className="bg-vermelho-tomate text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {totalItens}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-verde-brocolis border-2 border-white flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">Maria Silva</p>
              <p className="text-white/60 text-xs">Diretora</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={clsx(
            'flex items-center gap-3 w-full px-4 py-3 rounded-xl',
            'font-display font-semibold text-white/80',
            'hover:bg-vermelho-tomate hover:text-white transition-all duration-200'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}

// Header Component
interface HeaderProps {
  user: {
    nome: string;
    perfil: string;
  };
}

export function Header({ user }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b-3 border-verde-conecta flex items-center justify-between px-6">
      {/* Breadcrumb / Title */}
      <div>
        <h2 className="font-display font-bold text-xl text-verde-conecta">
          Olá, {user.nome.split(' ')[0]}! 👋
        </h2>
        <p className="font-body text-sm text-text-muted">
          Bem-vindo ao Conecta Merenda
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-off-white transition-colors"
          >
            <Bell className="w-6 h-6 text-verde-conecta" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-vermelho-tomate rounded-full border-2 border-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl border-3 border-verde-conecta shadow-hard p-4">
              <h3 className="font-display font-bold text-verde-conecta mb-3">
                Notificações
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-verde-brocolis/10 rounded-lg">
                  <p className="font-body text-sm">
                    <span className="font-bold">Novo pedido!</span> O produtor João confirmou sua entrega.
                  </p>
                  <span className="text-xs text-text-muted">Há 5 minutos</span>
                </div>
                <div className="p-3 bg-amarelo-pimentao/10 rounded-lg">
                  <p className="font-body text-sm">
                    <span className="font-bold">Alerta climático!</span> Previsão de chuva forte amanhã.
                  </p>
                  <span className="text-xs text-text-muted">Há 1 hora</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-verde-brocolis border-2 border-verde-conecta flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="font-display font-bold text-verde-conecta text-sm">
              {user.nome}
            </p>
            <span className="text-xs font-semibold text-verde-brocolis bg-verde-brocolis/20 px-2 py-0.5 rounded-full">
              Diretora
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Sidebar;
