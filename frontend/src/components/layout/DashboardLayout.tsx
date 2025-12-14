'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sidebar, Header } from './Sidebar';
import { User } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-creme-papel">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Conecta Merenda"
              width={120}
              height={120}
              className="animate-pulse"
              priority
            />
          </div>
          <div className="w-10 h-10 border-4 border-verde-brocolis border-t-verde-conecta rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display font-bold text-verde-conecta">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-creme-papel">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <Header user={user} />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-border-light">
          <p className="text-center font-body text-sm text-text-muted">
            © 2025 Conecta Merenda - Gestão Inteligente PNAE
          </p>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;
