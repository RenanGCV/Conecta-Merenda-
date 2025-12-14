'use client';

import { CarrinhoProvider } from '@/contexts/CarrinhoContext';

export default function EscolaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CarrinhoProvider>
      {children}
    </CarrinhoProvider>
  );
}
