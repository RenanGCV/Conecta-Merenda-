'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Users,
  Sparkles,
  CloudRain,
  Sun,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ArrowRight,
  Leaf,
  DollarSign,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Spinner } from '@/components/ui';
import { escolasService, dashboardService, climaService } from '@/services/api';
import toast from 'react-hot-toast';

interface DashboardData {
  totais: {
    escolas: number;
    produtores: number;
    pedidos: number;
    avaliacoes: number;
  };
  financeiro: {
    total_transacionado: number;
    ticket_medio: number;
  };
  pedidos_por_status: Record<string, number>;
  qualidade: {
    media_avaliacoes: number;
    total_avaliacoes: number;
  };
}

interface AlertaClimatico {
  tipo: string;
  severidade: string;
  titulo: string;
  descricao: string;
  recomendacao: string;
}

export default function EscolaDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [alertasClima, setAlertasClima] = useState<AlertaClimatico[]>([]);
  const [feedbackProduto, setFeedbackProduto] = useState('');
  const [enviandoFeedback, setEnviandoFeedback] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar dados do dashboard
      const [dashboard, clima] = await Promise.all([
        dashboardService.visaoGeral().catch(() => null),
        climaService.alertas().catch(() => ({ alertas: [] })),
      ]);

      if (dashboard) {
        setDashboardData(dashboard);
      }
      
      if (clima?.alertas) {
        setAlertasClima(clima.alertas);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const enviarFeedback = async (tipo: 'positivo' | 'negativo' | 'neutro') => {
    if (!feedbackProduto.trim()) {
      toast.error('Digite o nome do produto');
      return;
    }

    setEnviandoFeedback(true);
    try {
      await escolasService.enviarFeedback({
        escola_id: 'ESC001',
        produto_rejeitado: feedbackProduto,
        tipo_feedback: tipo,
        data_refeicao: new Date().toISOString().split('T')[0],
      });

      toast.success(
        tipo === 'positivo'
          ? 'Oba! Feedback positivo registrado! 🎉'
          : tipo === 'negativo'
          ? 'Feedback registrado. A IA vai sugerir alternativas!'
          : 'Feedback neutro registrado.'
      );
      setFeedbackProduto('');
    } catch (error) {
      toast.error('Erro ao enviar feedback');
    } finally {
      setEnviandoFeedback(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Alertas Climáticos */}
        {alertasClima.length > 0 && (
          <div className="space-y-3">
            {alertasClima.map((alerta, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-3 border-verde-conecta flex items-start gap-4 ${
                  alerta.severidade === 'alta' || alerta.severidade === 'critica'
                    ? 'bg-vermelho-tomate/20'
                    : alerta.severidade === 'media'
                    ? 'bg-laranja-cenoura/20'
                    : 'bg-amarelo-pimentao/20'
                }`}
              >
                {alerta.tipo.toLowerCase().includes('chuva') ? (
                  <CloudRain className="w-8 h-8 text-verde-conecta flex-shrink-0" />
                ) : (
                  <Sun className="w-8 h-8 text-laranja-cenoura flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-verde-conecta">
                      {alerta.titulo}
                    </h3>
                    <Badge
                      variant={
                        alerta.severidade === 'alta' || alerta.severidade === 'critica'
                          ? 'danger'
                          : alerta.severidade === 'media'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {alerta.severidade}
                    </Badge>
                  </div>
                  <p className="font-body text-sm text-text-main">{alerta.descricao}</p>
                  <p className="font-body text-sm text-verde-conecta mt-2 font-medium">
                    💡 {alerta.recomendacao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-text-muted">Pedidos Realizados</p>
                  <p className="font-display font-black text-3xl text-verde-conecta">
                    {dashboardData?.totais.pedidos || 0}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-verde-brocolis/20 flex items-center justify-center">
                  <Package className="w-7 h-7 text-verde-conecta" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-verde-brocolis">
                <TrendingUp className="w-4 h-4" />
                <span className="font-body text-sm font-medium">+12% este mês</span>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-text-muted">Total Transacionado</p>
                  <p className="font-display font-black text-3xl text-verde-conecta">
                    R$ {(dashboardData?.financeiro.total_transacionado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-verde-brocolis/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-verde-conecta" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-verde-brocolis">
                <TrendingUp className="w-4 h-4" />
                <span className="font-body text-sm font-medium">+8% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-text-muted">Produtores Parceiros</p>
                  <p className="font-display font-black text-3xl text-verde-conecta">
                    {dashboardData?.totais.produtores || 0}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-laranja-cenoura/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-laranja-cenoura" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-verde-brocolis">
                <Leaf className="w-4 h-4" />
                <span className="font-body text-sm font-medium">100% agricultura familiar</span>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-text-muted">Avaliação Média</p>
                  <p className="font-display font-black text-3xl text-verde-conecta">
                    ⭐ {dashboardData?.qualidade.media_avaliacoes?.toFixed(1) || '4.5'}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-amarelo-pimentao/20 flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="font-body text-sm text-text-muted">
                  {dashboardData?.qualidade.total_avaliacoes || 0} avaliações
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Merendômetro */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📊</span> Merendômetro
              </CardTitle>
              <p className="font-body text-sm text-text-muted">
                Registre o feedback sobre a aceitação do cardápio
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={feedbackProduto}
                    onChange={(e) => setFeedbackProduto(e.target.value)}
                    placeholder="Ex: Beterraba, Brócolis, Sopa de legumes..."
                    className="flex-1 px-4 py-3 font-body text-base bg-white rounded-xl border-3 border-verde-conecta focus:border-verde-brocolis focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="action"
                    onClick={() => enviarFeedback('positivo')}
                    loading={enviandoFeedback}
                    icon={<ThumbsUp className="w-5 h-5" />}
                    className="flex-1"
                  >
                    Gostaram!
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => enviarFeedback('neutro')}
                    loading={enviandoFeedback}
                    icon={<Minus className="w-5 h-5" />}
                    className="flex-1"
                  >
                    Normal
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => enviarFeedback('negativo')}
                    loading={enviandoFeedback}
                    icon={<ThumbsDown className="w-5 h-5" />}
                    className="flex-1"
                  >
                    Sobrou
                  </Button>
                </div>

                <p className="font-body text-sm text-text-muted text-center">
                  💡 Feedbacks negativos ativam sugestões da IA automaticamente
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sugestões IA */}
          <Card className="bg-gradient-to-br from-verde-brocolis/20 to-amarelo-pimentao/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-laranja-cenoura" />
                Sugestões da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border-2 border-verde-conecta">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥕</span>
                    <span className="text-2xl">→</span>
                    <span className="text-2xl">🍠</span>
                  </div>
                  <p className="font-display font-bold text-verde-conecta">
                    Troque Cenoura por Batata Doce
                  </p>
                  <p className="font-body text-sm text-text-muted mt-1">
                    Batata doce está na safra e 25% mais barata. Mesmas vitaminas!
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="success">-25% custo</Badge>
                    <Badge variant="info">Na safra</Badge>
                  </div>
                </div>

                <Link href="/escola/sugestoes">
                  <Button variant="primary" className="w-full" icon={<ArrowRight className="w-5 h-5" />}>
                    Ver Todas as Sugestões
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/escola/marketplace">
            <Card hover className="h-full">
              <CardContent className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-verde-brocolis flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-verde-conecta">
                    Comprar Alimentos
                  </h3>
                  <p className="font-body text-sm text-text-muted">
                    Encontre produtores próximos
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-verde-conecta ml-auto" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/escola/pedidos">
            <Card hover className="h-full">
              <CardContent className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-laranja-cenoura flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-verde-conecta">
                    Meus Pedidos
                  </h3>
                  <p className="font-body text-sm text-text-muted">
                    Acompanhe suas entregas
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-verde-conecta ml-auto" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/escola/relatorios">
            <Card hover className="h-full">
              <CardContent className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amarelo-pimentao flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-verde-conecta">
                    Gerar Relatório
                  </h3>
                  <p className="font-body text-sm text-text-muted">
                    Prestação de contas PNAE
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-verde-conecta ml-auto" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
