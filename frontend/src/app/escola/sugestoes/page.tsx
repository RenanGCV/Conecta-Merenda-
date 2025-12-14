'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  Leaf,
  Apple,
  RefreshCw,
  Check,
  ShoppingCart,
  Info,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  Spinner,
  Modal,
  OpenAIBadge,
} from '@/components/ui';
import { escolasService } from '@/services/api';
import toast from 'react-hot-toast';

interface Sugestao {
  id: string;
  produtoAtual: string;
  produtoSugerido: string;
  economia: number;
  motivo: string;
  nutricao: string;
  emSafra: boolean;
  aceita: boolean | null;
}

const SUGESTOES_MOCK: Sugestao[] = [
  {
    id: '1',
    produtoAtual: 'Cenoura',
    produtoSugerido: 'Batata Doce',
    economia: 25,
    motivo: 'Batata doce está na safra de dezembro e tem preço 25% menor.',
    nutricao: 'Rica em vitamina A, similar à cenoura. Excelente fonte de fibras.',
    emSafra: true,
    aceita: null,
  },
  {
    id: '2',
    produtoAtual: 'Uva',
    produtoSugerido: 'Morango',
    economia: 30,
    motivo: 'Morango está na safra e tem maior aceitação entre os alunos.',
    nutricao: 'Rico em vitamina C e antioxidantes. Baixo índice glicêmico.',
    emSafra: true,
    aceita: null,
  },
  {
    id: '3',
    produtoAtual: 'Beterraba',
    produtoSugerido: 'Abóbora',
    economia: 15,
    motivo: 'Feedback negativo sobre beterraba. Abóbora tem melhor aceitação.',
    nutricao: 'Rica em vitamina A e potássio. Sabor mais adocicado.',
    emSafra: true,
    aceita: null,
  },
];

export default function EscolaSugestoes() {
  const [sugestoes, setSugestoes] = useState<Sugestao[]>(SUGESTOES_MOCK);
  const [loading, setLoading] = useState(false);
  const [gerandoNova, setGerandoNova] = useState(false);
  const [modalNova, setModalNova] = useState(false);
  const [produtoTroca, setProdutoTroca] = useState('');
  const [motivoTroca, setMotivoTroca] = useState('');

  const handleAceitarSugestao = (id: string) => {
    setSugestoes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, aceita: true } : s))
    );
    toast.success('Sugestão aceita! O produto foi adicionado ao seu próximo pedido. 🎉');
  };

  const handleRejeitarSugestao = (id: string) => {
    setSugestoes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, aceita: false } : s))
    );
    toast.success('Sugestão rejeitada. Entendido!');
  };

  const handleGerarSugestao = async () => {
    if (!produtoTroca) {
      toast.error('Informe o produto que deseja substituir');
      return;
    }

    setGerandoNova(true);
    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const novaSugestao: Sugestao = {
        id: Date.now().toString(),
        produtoAtual: produtoTroca,
        produtoSugerido: 'Abobrinha',
        economia: 20,
        motivo: motivoTroca || 'Produto mais acessível e na safra atual.',
        nutricao: 'Rica em vitaminas do complexo B. Baixa caloria e versátil.',
        emSafra: true,
        aceita: null,
      };

      setSugestoes((prev) => [novaSugestao, ...prev]);
      toast.success('Nova sugestão gerada pela IA! 🤖');
      setModalNova(false);
      setProdutoTroca('');
      setMotivoTroca('');
    } catch (error) {
      toast.error('Erro ao gerar sugestão');
    } finally {
      setGerandoNova(false);
    }
  };

  const sugestoesPendentes = sugestoes.filter((s) => s.aceita === null);
  const sugestoesAceitas = sugestoes.filter((s) => s.aceita === true);
  const economiaTotal = sugestoesAceitas.reduce((acc, s) => acc + s.economia, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display font-black text-3xl text-verde-conecta flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-laranja-cenoura" />
                Sugestões da IA
              </h1>
              <OpenAIBadge variant="light" size="sm" />
            </div>
            <p className="font-body text-text-muted">
              Recomendações inteligentes para economizar e nutrir melhor
            </p>
          </div>

          <Button
            variant="action"
            onClick={() => setModalNova(true)}
            icon={<RefreshCw className="w-5 h-5" />}
          >
            Pedir Nova Sugestão
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amarelo-pimentao/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-laranja-cenoura" />
              </div>
              <div>
                <p className="font-body text-sm text-text-muted">Sugestões Pendentes</p>
                <p className="font-display font-black text-2xl text-verde-conecta">
                  {sugestoesPendentes.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-verde-brocolis/20 flex items-center justify-center">
                <Check className="w-7 h-7 text-verde-conecta" />
              </div>
              <div>
                <p className="font-body text-sm text-text-muted">Sugestões Aceitas</p>
                <p className="font-display font-black text-2xl text-verde-conecta">
                  {sugestoesAceitas.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-verde-brocolis/20 to-amarelo-pimentao/20">
            <CardContent className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-verde-conecta flex items-center justify-center">
                <TrendingDown className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-body text-sm text-text-muted">Economia Estimada</p>
                <p className="font-display font-black text-2xl text-verde-conecta">
                  ~{economiaTotal}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Sugestões */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-verde-conecta">
            Sugestões de Substituição
          </h2>

          {sugestoes.map((sugestao) => (
            <Card
              key={sugestao.id}
              className={`transition-all ${
                sugestao.aceita === true
                  ? 'bg-verde-brocolis/10 border-verde-brocolis'
                  : sugestao.aceita === false
                  ? 'opacity-50'
                  : ''
              }`}
            >
              <CardContent>
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Transformação Visual */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-vermelho-tomate/20 flex items-center justify-center mb-2">
                        <span className="text-3xl">
                          {sugestao.produtoAtual.includes('Cenoura')
                            ? '🥕'
                            : sugestao.produtoAtual.includes('Uva')
                            ? '🍇'
                            : sugestao.produtoAtual.includes('Beterraba')
                            ? '🟣'
                            : '🥬'}
                        </span>
                      </div>
                      <p className="font-display font-bold text-sm text-vermelho-tomate">
                        {sugestao.produtoAtual}
                      </p>
                    </div>

                    <ArrowRight className="w-8 h-8 text-verde-conecta" />

                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-verde-brocolis/20 flex items-center justify-center mb-2">
                        <span className="text-3xl">
                          {sugestao.produtoSugerido.includes('Batata')
                            ? '🍠'
                            : sugestao.produtoSugerido.includes('Morango')
                            ? '🍓'
                            : sugestao.produtoSugerido.includes('Abóbora')
                            ? '🎃'
                            : '🥒'}
                        </span>
                      </div>
                      <p className="font-display font-bold text-sm text-verde-brocolis">
                        {sugestao.produtoSugerido}
                      </p>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="success">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        -{sugestao.economia}% custo
                      </Badge>
                      {sugestao.emSafra && (
                        <Badge variant="info">
                          <Leaf className="w-3 h-3 mr-1" />
                          Na safra
                        </Badge>
                      )}
                    </div>
                    <p className="font-body text-text-main mb-2">
                      <strong>Motivo:</strong> {sugestao.motivo}
                    </p>
                    <p className="font-body text-sm text-text-muted">
                      <strong>Nutrição:</strong> {sugestao.nutricao}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-3 flex-shrink-0">
                    {sugestao.aceita === null ? (
                      <>
                        <Button
                          variant="action"
                          onClick={() => handleAceitarSugestao(sugestao.id)}
                          icon={<Check className="w-5 h-5" />}
                        >
                          Aceitar
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleRejeitarSugestao(sugestao.id)}
                        >
                          Ignorar
                        </Button>
                      </>
                    ) : sugestao.aceita ? (
                      <div className="flex items-center gap-2 text-verde-brocolis">
                        <Check className="w-5 h-5" />
                        <span className="font-display font-bold">Aceita</span>
                      </div>
                    ) : (
                      <span className="font-body text-text-muted">Ignorada</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="bg-amarelo-pimentao/10">
          <CardContent className="flex items-start gap-4">
            <Info className="w-6 h-6 text-laranja-cenoura flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-bold text-verde-conecta mb-1">
                Como funcionam as sugestões?
              </h3>
              <p className="font-body text-sm text-text-main">
                Nossa IA analisa o calendário de safra regional, os feedbacks do Merendômetro,
                e os preços praticados pelos produtores locais para sugerir substituições
                inteligentes. O objetivo é sempre: <strong>economizar, nutrir melhor e reduzir desperdício</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Nova Sugestão */}
      <Modal
        isOpen={modalNova}
        onClose={() => setModalNova(false)}
        title="Solicitar Nova Sugestão"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalNova(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGerarSugestao}
              loading={gerandoNova}
              icon={<Sparkles className="w-5 h-5" />}
            >
              Gerar Sugestão
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Qual produto você quer substituir?"
            placeholder="Ex: Beterraba, Couve, Laranja..."
            value={produtoTroca}
            onChange={(e) => setProdutoTroca(e.target.value)}
          />

          <Select
            label="Motivo da troca"
            options={[
              { value: '', label: 'Selecione o motivo...' },
              { value: 'preco', label: '💰 Preço muito alto' },
              { value: 'aceitacao', label: '👎 Baixa aceitação dos alunos' },
              { value: 'qualidade', label: '📉 Qualidade insatisfatória' },
              { value: 'safra', label: '🌱 Fora de safra' },
              { value: 'outro', label: '❓ Outro motivo' },
            ]}
            value={motivoTroca}
            onChange={(e) => setMotivoTroca(e.target.value)}
          />

          <div className="p-4 bg-verde-brocolis/10 rounded-xl">
            <p className="font-body text-sm text-text-main">
              <Sparkles className="w-4 h-4 inline mr-2 text-laranja-cenoura" />
              A IA vai analisar os dados de safra, nutrição e preços para
              sugerir a melhor alternativa para você!
            </p>
          </div>

          {/* OpenAI Sponsor Badge */}
          <div className="flex justify-center pt-2">
            <OpenAIBadge variant="light" size="sm" />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
