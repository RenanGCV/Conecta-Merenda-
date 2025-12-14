'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Plus,
  ChefHat,
  Leaf,
  Sun,
  CloudRain,
  DollarSign,
  Users,
  Check,
  Edit,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Modal,
  Spinner,
  Select,
} from '@/components/ui';
import toast from 'react-hot-toast';

interface RefeicoaoDia {
  dia: string;
  diaSemana: string;
  pratos: Array<{
    tipo: string;
    nome: string;
    ingredientes: string[];
    emSafra: boolean;
  }>;
}

const CARDAPIO_SEMANA: RefeicoaoDia[] = [
  {
    dia: '16/12',
    diaSemana: 'Segunda',
    pratos: [
      {
        tipo: 'Principal',
        nome: 'Arroz com Feijão e Frango Desfiado',
        ingredientes: ['Arroz', 'Feijão', 'Frango', 'Alho', 'Cebola'],
        emSafra: true,
      },
      {
        tipo: 'Salada',
        nome: 'Salada de Alface e Tomate',
        ingredientes: ['Alface', 'Tomate'],
        emSafra: true,
      },
      {
        tipo: 'Sobremesa',
        nome: 'Banana',
        ingredientes: ['Banana'],
        emSafra: true,
      },
    ],
  },
  {
    dia: '17/12',
    diaSemana: 'Terça',
    pratos: [
      {
        tipo: 'Principal',
        nome: 'Macarrão ao Sugo com Carne Moída',
        ingredientes: ['Macarrão', 'Molho de tomate', 'Carne moída'],
        emSafra: true,
      },
      {
        tipo: 'Salada',
        nome: 'Beterraba Ralada',
        ingredientes: ['Beterraba'],
        emSafra: false,
      },
      {
        tipo: 'Sobremesa',
        nome: 'Laranja',
        ingredientes: ['Laranja'],
        emSafra: true,
      },
    ],
  },
  {
    dia: '18/12',
    diaSemana: 'Quarta',
    pratos: [
      {
        tipo: 'Principal',
        nome: 'Arroz com Feijão e Omelete',
        ingredientes: ['Arroz', 'Feijão', 'Ovos', 'Tomate'],
        emSafra: true,
      },
      {
        tipo: 'Salada',
        nome: 'Couve Refogada',
        ingredientes: ['Couve', 'Alho'],
        emSafra: true,
      },
      {
        tipo: 'Sobremesa',
        nome: 'Mamão',
        ingredientes: ['Mamão'],
        emSafra: true,
      },
    ],
  },
  {
    dia: '19/12',
    diaSemana: 'Quinta',
    pratos: [
      {
        tipo: 'Principal',
        nome: 'Sopa de Legumes com Frango',
        ingredientes: ['Frango', 'Batata', 'Cenoura', 'Abobrinha', 'Macarrão'],
        emSafra: true,
      },
      {
        tipo: 'Acompanhamento',
        nome: 'Pão Francês',
        ingredientes: ['Pão'],
        emSafra: true,
      },
      {
        tipo: 'Sobremesa',
        nome: 'Morango',
        ingredientes: ['Morango'],
        emSafra: true,
      },
    ],
  },
  {
    dia: '20/12',
    diaSemana: 'Sexta',
    pratos: [
      {
        tipo: 'Principal',
        nome: 'Arroz com Lentilha e Legumes',
        ingredientes: ['Arroz', 'Lentilha', 'Cenoura', 'Brócolis'],
        emSafra: true,
      },
      {
        tipo: 'Salada',
        nome: 'Salada Verde',
        ingredientes: ['Alface', 'Rúcula', 'Pepino'],
        emSafra: true,
      },
      {
        tipo: 'Sobremesa',
        nome: 'Melancia',
        ingredientes: ['Melancia'],
        emSafra: true,
      },
    ],
  },
];

export default function EscolaCardapio() {
  const [cardapio, setCardapio] = useState(CARDAPIO_SEMANA);
  const [modalGerar, setModalGerar] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [semana, setSemana] = useState('2025-W51');

  const handleGerarCardapio = async () => {
    setGerando(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success('Cardápio da semana gerado pela IA! 🤖');
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

          <div className="flex gap-3">
            <input
              type="week"
              value={semana}
              onChange={(e) => setSemana(e.target.value)}
              className="px-4 py-2 border-3 border-verde-conecta rounded-xl font-body"
            />
            <Button
              variant="action"
              onClick={() => setModalGerar(true)}
              icon={<Sparkles className="w-5 h-5" />}
            >
              Gerar com IA
            </Button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4">
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
            <CardContent className="flex items-center gap-4">
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
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-laranja-cenoura/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-laranja-cenoura" />
              </div>
              <div>
                <p className="font-body text-sm text-text-muted">Custo Est.</p>
                <p className="font-display font-bold text-xl text-verde-conecta">
                  R$ 2.450
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
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
          <CardContent className="flex flex-wrap gap-6">
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
              Gerar Cardápio
            </Button>
          </>
        }
      >
        <div className="space-y-4">
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
            options={[
              { value: '', label: 'Nenhuma restrição' },
              { value: 'sem_lactose', label: 'Sem lactose' },
              { value: 'sem_gluten', label: 'Sem glúten' },
              { value: 'vegetariano', label: 'Vegetariano' },
            ]}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
}
