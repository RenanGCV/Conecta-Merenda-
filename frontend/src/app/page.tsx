'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/logo.png"
            alt="Conecta Merenda"
            width={180}
            height={180}
            className="animate-pulse"
            priority
          />
        </div>
        <div className="w-12 h-12 border-4 border-verde-brocolis border-t-verde-conecta rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-text-muted mt-2">
          Carregando...
        </p>
      </div>
    </div>
  );
}
