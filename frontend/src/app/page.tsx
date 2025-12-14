'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário logado
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      // Sempre redireciona para dashboard da escola (diretora)
      router.push('/escola/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-creme-papel">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-5xl animate-bounce" style={{ animationDelay: '0ms' }}>🥦</span>
          <span className="text-5xl animate-bounce" style={{ animationDelay: '150ms' }}>🍅</span>
          <span className="text-5xl animate-bounce" style={{ animationDelay: '300ms' }}>🥕</span>
        </div>
        <div className="w-12 h-12 border-4 border-verde-brocolis border-t-verde-conecta rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display font-bold text-verde-conecta text-xl">
          Conecta Merenda
        </p>
        <p className="font-body text-text-muted mt-2">
          Carregando...
        </p>
      </div>
    </div>
  );
}
