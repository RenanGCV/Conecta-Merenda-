import type { Metadata } from 'next';
import { Nunito, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Conecta Merenda - Gestão Inteligente PNAE',
  description: 'Sistema de gestão de compras do Programa Nacional de Alimentação Escolar com IA',
  keywords: ['PNAE', 'merenda escolar', 'agricultura familiar', 'alimentação escolar'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${inter.variable}`}>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1A1A1A',
              border: '3px solid #0B4F35',
              borderRadius: '16px',
              fontFamily: 'var(--font-body)',
            },
            success: {
              iconTheme: {
                primary: '#9BC53D',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#E04F38',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
