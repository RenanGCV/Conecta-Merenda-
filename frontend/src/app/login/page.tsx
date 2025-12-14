'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { authService } from '@/services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('escola@email.com');
  const [senha, setSenha] = useState('escola123');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(email, senha);
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user_info));
      
      toast.success(`Bem-vinda, ${response.user_info.nome}! 🎉`);
      
      // Sempre vai para dashboard da escola (diretora)
      router.push('/escola/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-creme-papel flex flex-col items-center justify-center p-4">
      {/* Header / Logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-6xl">🥦</span>
          <span className="text-5xl">🍅</span>
          <span className="text-6xl">🥕</span>
        </div>
        <h1 className="font-display font-black text-4xl md:text-5xl text-verde-conecta">
          Conecta Merenda
        </h1>
        <p className="font-body text-text-muted mt-2">
          Gestão inteligente de alimentação escolar
        </p>
      </div>

      {/* Card Principal */}
      <Card className="w-full max-w-md">
        {/* Header do Card */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-verde-brocolis border-3 border-verde-conecta flex items-center justify-center mb-4">
            <School className="w-10 h-10 text-verde-conecta" />
          </div>
          <h2 className="font-display font-bold text-2xl text-verde-conecta">
            Área da Diretora
          </h2>
          <p className="font-body text-text-muted mt-1">
            Gestão de merenda escolar
          </p>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
            />
          </div>

          <div className="relative">
            <Input
              label="Senha"
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-4 top-[42px] text-verde-conecta hover:text-verde-brocolis"
            >
              {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-6"
          >
            Entrar
          </Button>
        </form>

        {/* Info Demo */}
        <div className="mt-6 p-4 bg-verde-brocolis/20 rounded-xl border-2 border-verde-conecta">
          <p className="font-body text-sm text-text-main text-center">
            <span className="font-bold">👩‍💼 Acesso Demo:</span><br/>
            E-mail e senha já preenchidos para teste
          </p>
        </div>
      </Card>

      {/* Footer */}
      <p className="mt-8 font-body text-sm text-text-muted">
        © 2025 Conecta Merenda - Hackathon PNAE
      </p>
    </div>
  );
}
