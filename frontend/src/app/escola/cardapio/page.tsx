'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  ChefHat,
  Leaf,
  DollarSign,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Modal,
  Select,
  OpenAIBadge,
} from '@/components/ui';
import toast from 'react-hot-toast';

interface RefeicoaoDia {
  dia: string;
  diaSemana: string;
  data: Date;
  pratos: Array<{
    tipo: string;
    nome: string;
    ingredientes: string[];
    emSafra: boolean;
    geradoPorIA?: boolean;
  }>;
}

// Gera cardápio mock para uma semana específica
function gerarCardapioSemana(inicioSemana: Date): RefeicoaoDia[] {
  const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const pratos = [
    {
      tipo: 'Principal',
      opcoes: [
        { nome: 'Arroz com Feijão e Frango Desfiado', ingredientes: ['Arroz', 'Feijão', 'Frango'] },
        { nome: 'Macarrão ao Sugo com Carne Moída', ingredientes: ['Macarrão', 'Molho de tomate', 'Carne moída'] },
        { nome: 'Arroz com Feijão e Omelete', ingredientes: ['Arroz', 'Feijão', 'Ovos', 'Tomate'] },
        { nome: 'Sopa de Legumes com Frango', ingredientes: ['Frango', 'Batata', 'Cenoura', 'Abobrinha'] },
        { nome: 'Arroz com Lentilha e Legumes', ingredientes: ['Arroz', 'Lentilha', 'Cenoura', 'Brócolis'] },
      ],
    },
    {
      tipo: 'Salada',
      opcoes: [
        { nome: 'Salada de Alface e Tomate', ingredientes: ['Alface', 'Tomate'] },
        { nome: 'Beterraba Ralada', ingredientes: ['Beterraba'] },
        { nome: 'Couve Refogada', ingredientes: ['Couve', 'Alho'] },
        { nome: 'Cenoura Ralada', ingredientes: ['Cenoura'] },
        { nome: 'Salada Verde', ingredientes: ['Alface', 'Rúcula', 'Pepino'] },
      ],
    },
    {
      tipo: 'Sobremesa',
      opcoes: [
        { nome: 'Banana', ingredientes: ['Banana'] },
        { nome: 'Laranja', ingredientes: ['Laranja'] },
        { nome: 'Mamão', ingredientes: ['Mamão'] },
        { nome: 'Morango', ingredientes: ['Morango'] },
        { nome: 'Melancia', ingredientes: ['Melancia'] },
      ],
    },
  ];

  return dias.map((diaSemana, idx) => {
    const data = new Date(inicioSemana);
    data.setDate(data.getDate() + idx);
    
    return {
      dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      diaSemana,
      data,
      pratos: pratos.map((tipo) => ({
        tipo: tipo.tipo,
        ...tipo.opcoes[idx],
        emSafra: Math.random() > 0.3,
      })),
    };
  });
}

// Cardápios gerados pela IA (mais saudáveis e na safra)
function gerarCardapioIA(inicioSemana: Date): RefeicoaoDia[] {
  const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  
  const pratosIA = [
    {
      pratos: [
        { tipo: 'Principal', nome: 'Risoto de Abóbora com Frango', ingredientes: ['Arroz', 'Abóbora', 'Frango', 'Queijo'] },
        { tipo: 'Salada', nome: 'Mix de Folhas com Manga', ingredientes: ['Alface', 'Rúcula', 'Manga', 'Limão'] },
        { tipo: 'Sobremesa', nome: 'Salada de Frutas', ingredientes: ['Manga', 'Mamão', 'Banana', 'Laranja'] },
      ],
    },
    {
      pratos: [
        { tipo: 'Principal', nome: 'Escondidinho de Mandioca', ingredientes: ['Mandioca', 'Carne moída', 'Queijo'] },
        { tipo: 'Salada', nome: 'Beterraba com Cenoura', ingredientes: ['Beterraba', 'Cenoura', 'Limão'] },
        { tipo: 'Sobremesa', nome: 'Mousse de Maracujá', ingredientes: ['Maracujá', 'Leite condensado'] },
      ],
    },
    {
      pratos: [
        { tipo: 'Principal', nome: 'Feijão Tropeiro com Couve', ingredientes: ['Feijão', 'Bacon', 'Ovos', 'Couve'] },
        { tipo: 'Salada', nome: 'Tomate com Manjericão', ingredientes: ['Tomate', 'Manjericão', 'Azeite'] },
        { tipo: 'Sobremesa', nome: 'Banana Assada com Canela', ingredientes: ['Banana', 'Canela', 'Mel'] },
      ],
    },
    {
      pratos: [
        { tipo: 'Principal', nome: 'Cuscuz Paulista Nutritivo', ingredientes: ['Farinha de milho', 'Sardinha', 'Ovos'] },
        { tipo: 'Salada', nome: 'Pepino com Hortelã', ingredientes: ['Pepino', 'Hortelã', 'Iogurte'] },
        { tipo: 'Sobremesa', nome: 'Gelatina de Morango', ingredientes: ['Morango', 'Gelatina'] },
      ],
    },
    {
      pratos: [
        { tipo: 'Principal', nome: 'Panqueca de Legumes', ingredientes: ['Farinha', 'Ovos', 'Cenoura', 'Abobrinha'] },
        { tipo: 'Salada', nome: 'Coleslaw Brasileiro', ingredientes: ['Repolho', 'Cenoura', 'Maionese light'] },
        { tipo: 'Sobremesa', nome: 'Laranja com Canela', ingredientes: ['Laranja', 'Canela'] },
      ],
    },
  ];

  return dias.map((diaSemana, idx) => {
    const data = new Date(inicioSemana);
    data.setDate(data.getDate() + idx);
    
    return {
      dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      diaSemana,
      data,
      pratos: pratosIA[idx].pratos.map((p) => ({
        ...p,
        emSafra: true,
        geradoPorIA: true,
      })),
    };
  });
}

function getInicioSemana(data: Date): Date {
  const d = new Date(data);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatarPeriodoSemana(inicio: Date): string {
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + 4);
  const formatoInicio = inicio.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const formatoFim = fim.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return `${formatoInicio} - ${formatoFim}`;
}

function getNumeroSemana(data: Date): number {
  const inicio = new Date(data.getFullYear(), 0, 1);
  const diff = data.getTime() - inicio.getTime();
  const umDia = 1000 * 60 * 60 * 24;
  return Math.ceil((diff / umDia + inicio.getDay() + 1) / 7);
}

export default function EscolaCardapio() {
  const [semanaAtual, setSemanaAtual] = useState(() => getInicioSemana(new Date()));
  const [cardapiosGerados, setCardapiosGerados] = useState<Record<string, RefeicoaoDia[]>>({});
  const [modalGerar, setModalGerar] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [restricao, setRestricao] = useState('');

  const chaveSemana = semanaAtual.toISOString().split('T')[0];

  const cardapio = useMemo(() => {
    if (cardapiosGerados[chaveSemana]) {
      return cardapiosGerados[chaveSemana];
    }
    return gerarCardapioSemana(semanaAtual);
  }, [chaveSemana, cardapiosGerados, semanaAtual]);

  const navegarSemana = (direcao: 'anterior' | 'proxima') => {
    setSemanaAtual((atual) => {
      const nova = new Date(atual);
      nova.setDate(nova.getDate() + (direcao === 'anterior' ? -7 : 7));
      return nova;
    });
  };

  const irParaHoje = () => {
    setSemanaAtual(getInicioSemana(new Date()));
  };

  const isSemanAtual = useMemo(() => {
    const hojeInicio = getInicioSemana(new Date());
    return semanaAtual.getTime() === hojeInicio.getTime();
  }, [semanaAtual]);

  const isCardapioIA = !!cardapiosGerados[chaveSemana];

  const handleGerarCardapio = async () => {
    setGerando(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const novoCardapio = gerarCardapioIA(semanaAtual);
      setCardapiosGerados((prev) => ({
        ...prev,
        [chaveSemana]: novoCardapio,
      }));
      toast.success('Cardápio gerado com sucesso pela IA! 🤖✨');
      setModalGerar(false);
    } catch (error) {
      toast.error('Erro ao gerar cardápio');
    } finally {
      setGerando(false);
    }
  };

  const totalProdutosSafra = cardapio.reduce((acc, dia) => {
    return acc + dia.pratos.filter((p) => p.emSafra).length;
  }, 0);
  const totalPratos = cardapio.reduce((acc, dia) => acc + dia.pratos.length, 0);
  const percentualSafra = Math.round((totalProdutosSafra / totalPratos) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl text-verde-conecta">
              🍽️ Cardápio Semanal
            </h1>
            <p className="font-body text-text-muted">
              Planeje as refeições com sugestões inteligentes da IA
            </p>
          </div>

          <Button
            variant="action"
            onClick={() => setModalGerar(true)}
            icon={<Sparkles className="w-5 h-5" />}
          >
            Gerar com IA
          </Button>
        </div>

        {/* Seletor de Semana */}
        <div className="bg-verde-conecta text-white rounded-[24px] border-3 border-verde-conecta shadow-hard p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navegarSemana('anterior')}
              className="p-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-3 mb-1">
                <Calendar className="w-5 h-5" />
                <span className="font-display font-bold text-xl">
                  Semana {getNumeroSemana(semanaAtual)}
                </span>
                {isCardapioIA && (
                  <Badge variant="warning" size="sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    IA
                  </Badge>
                )}
              </div>
              <p className="font-body text-white/80">
                {formatarPeriodoSemana(semanaAtual)}
              </p>
              {!isSemanAtual && (
                <button
                  onClick={irParaHoje}
                  className="mt-2 text-sm font-body text-verde-brocolis hover:text-white flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Voltar para semana atual
                </button>
              )}
            </div>

            <button
              onClick={() => navegarSemana('proxima')}
              className="p-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-verde-brocolis/20 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-verde-conecta" />
              </div>
              <div>
                <p className="font-body text-sm text-text-muted">Refeições</p>
                <p className="font-display font-bold text-xl text-verde-conecta">
                  {totalPratos}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-verde-brocolis/20 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-verde-conecta" />
              </div>
              <div>
                <p className="font-body text-sm text-text-muted">Na Safra</p>
                <p className="font-display font-bold text-xl text-verde-conecta">
                  {percentualSafra}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-laranja-cenoura/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-laranja-cenoura" />
              </div>
              <div>
                <p className="font-body text-sm text-text-muted">Custo Est.</p>
                <p className="font-display font-bold text-xl text-verde-conecta">
                  R$ {isCardapioIA ? '1.890' : '2.450'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-amarelo-pimentao/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-verde-conecta" />
              </div>
              <div>
                <p className="font-body text-sm text-text-muted">Alunos</p>
                <p className="font-display font-bold text-xl text-verde-conecta">450</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicador de Cardápio IA */}
        {isCardapioIA && (
          <Card className="bg-gradient-to-r from-laranja-cenoura/10 to-verde-brocolis/10 border-laranja-cenoura">
            <CardContent className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-laranja-cenoura" />
                <div>
                  <p className="font-display font-bold text-verde-conecta">
                    Cardápio otimizado pela IA
                  </p>
                  <p className="font-body text-sm text-text-muted">
                    100% produtos da safra • Economia estimada de R$ 560 • Balanceado nutricionalmente
                  </p>
                </div>
              </div>
              <OpenAIBadge variant="light" size="sm" />
            </CardContent>
          </Card>
        )}

        {/* Cardápio da Semana */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {cardapio.map((dia) => (
            <Card key={dia.dia} className="h-full">
              <CardHeader className="pb-2">
                <div className="text-center">
                  <p className="font-display font-bold text-lg text-verde-conecta">
                    {dia.diaSemana}
                  </p>
                  <p className="font-body text-sm text-text-muted">{dia.dia}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dia.pratos.map((prato, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl ${
                        prato.emSafra ? 'bg-verde-brocolis/10' : 'bg-laranja-cenoura/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant={
                            prato.tipo === 'Principal'
                              ? 'success'
                              : prato.tipo === 'Salada'
                              ? 'info'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {prato.tipo}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {prato.geradoPorIA && (
                            <span title="Sugerido pela IA" className="text-laranja-cenoura">
                              <Sparkles className="w-3 h-3" />
                            </span>
                          )}
                          {prato.emSafra ? (
                            <span title="Na safra" className="text-verde-brocolis">
                              <Leaf className="w-4 h-4" />
                            </span>
                          ) : (
                            <span title="Fora de safra" className="text-laranja-cenoura">
                              ⚠️
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-body text-sm font-medium text-verde-conecta">
                        {prato.nome}
                      </p>
                      <p className="font-body text-xs text-text-muted mt-1">
                        {prato.ingredientes.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legenda */}
        <Card className="bg-off-white">
          <CardContent className="flex flex-wrap gap-6 py-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-verde-brocolis" />
              <span className="font-body text-sm">Na Safra (mais barato)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-laranja-cenoura" />
              <span className="font-body text-sm">Fora de Safra</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-laranja-cenoura" />
              <span className="font-body text-sm">Sugerido pela IA</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Gerar Cardápio */}
      <Modal
        isOpen={modalGerar}
        onClose={() => setModalGerar(false)}
        title="🤖 Gerar Cardápio com IA"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalGerar(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGerarCardapio}
              loading={gerando}
              icon={<Sparkles className="w-5 h-5" />}
            >
              {gerando ? 'Gerando...' : 'Gerar Cardápio'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-verde-brocolis/10 rounded-xl">
            <p className="font-display font-bold text-verde-conecta mb-1">
              Semana {getNumeroSemana(semanaAtual)}
            </p>
            <p className="font-body text-sm text-text-muted">
              {formatarPeriodoSemana(semanaAtual)}
            </p>
          </div>

          <p className="font-body text-text-main">
            A IA vai criar um cardápio semanal considerando:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 font-body text-sm">
              <Check className="w-4 h-4 text-verde-brocolis" />
              Produtos na safra (mais baratos)
            </li>
            <li className="flex items-center gap-2 font-body text-sm">
              <Check className="w-4 h-4 text-verde-brocolis" />
              Feedbacks anteriores do Merendômetro
            </li>
            <li className="flex items-center gap-2 font-body text-sm">
              <Check className="w-4 h-4 text-verde-brocolis" />
              Equilíbrio nutricional
            </li>
            <li className="flex items-center gap-2 font-body text-sm">
              <Check className="w-4 h-4 text-verde-brocolis" />
              Produtores disponíveis na região
            </li>
          </ul>

          <Select
            label="Restrições alimentares"
            value={restricao}
            onChange={(e) => setRestricao(e.target.value)}
            options={[
              { value: '', label: 'Nenhuma restrição' },
              { value: 'sem_lactose', label: 'Sem lactose' },
              { value: 'sem_gluten', label: 'Sem glúten' },
              { value: 'vegetariano', label: 'Vegetariano' },
            ]}
          />

          {isCardapioIA && (
            <div className="p-3 bg-amarelo-pimentao/20 rounded-xl">
              <p className="font-body text-sm text-text-main">
                ⚠️ Esta semana já possui um cardápio gerado pela IA. Gerar novamente substituirá o atual.
              </p>
            </div>
          )}

          {/* OpenAI Sponsor Badge */}
          <div className="flex justify-center pt-2">
            <OpenAIBadge variant="light" size="sm" />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
