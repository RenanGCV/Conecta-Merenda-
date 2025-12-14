'use client';

import React, { useEffect, useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  Star,
  Calendar,
  MapPin,
  Phone,
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
  EmptyState,
  StarRating,
  Textarea,
} from '@/components/ui';
import { escolasService } from '@/services/api';
import toast from 'react-hot-toast';

interface Pedido {
  id: string;
  produtor_nome: string;
  produtor_propriedade: string;
  itens: Array<{ produto_nome: string; quantidade: number; unidade: string; preco_unitario: number }>;
  valor_total: number;
  status: 'pendente' | 'confirmado' | 'entregue' | 'cancelado';
  data_pedido: string;
  data_entrega_desejada: string;
  tipo_logistica: 'entrega' | 'retirada';
}

const PEDIDOS_MOCK: Pedido[] = [
  {
    id: 'PED001',
    produtor_nome: 'João Silva',
    produtor_propriedade: 'Sítio Esperança',
    itens: [
      { produto_nome: 'Alface', quantidade: 50, unidade: 'maço', preco_unitario: 3.5 },
      { produto_nome: 'Tomate', quantidade: 30, unidade: 'kg', preco_unitario: 5.8 },
    ],
    valor_total: 349.0,
    status: 'entregue',
    data_pedido: '2025-12-10T10:30:00',
    data_entrega_desejada: '2025-12-12',
    tipo_logistica: 'entrega',
  },
  {
    id: 'PED002',
    produtor_nome: 'Maria Santos',
    produtor_propriedade: 'Fazenda Vida Nova',
    itens: [
      { produto_nome: 'Banana', quantidade: 40, unidade: 'kg', preco_unitario: 4.5 },
      { produto_nome: 'Laranja', quantidade: 60, unidade: 'kg', preco_unitario: 3.8 },
    ],
    valor_total: 408.0,
    status: 'confirmado',
    data_pedido: '2025-12-12T14:00:00',
    data_entrega_desejada: '2025-12-15',
    tipo_logistica: 'entrega',
  },
  {
    id: 'PED003',
    produtor_nome: 'Pedro Oliveira',
    produtor_propriedade: 'Chácara São José',
    itens: [
      { produto_nome: 'Brócolis', quantidade: 25, unidade: 'maço', preco_unitario: 4.8 },
    ],
    valor_total: 120.0,
    status: 'pendente',
    data_pedido: '2025-12-13T09:00:00',
    data_entrega_desejada: '2025-12-16',
    tipo_logistica: 'retirada',
  },
];

export default function EscolaPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_MOCK);
  const [loading, setLoading] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [pedidoDetalhe, setPedidoDetalhe] = useState<Pedido | null>(null);
  const [modalAvaliacao, setModalAvaliacao] = useState(false);
  const [avaliacao, setAvaliacao] = useState({ nota: 5, comentario: '' });
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pendente':
        return { label: 'Pendente', variant: 'warning' as const, icon: Clock, cor: 'text-amarelo-pimentao' };
      case 'confirmado':
        return { label: 'Confirmado', variant: 'info' as const, icon: CheckCircle, cor: 'text-laranja-cenoura' };
      case 'entregue':
        return { label: 'Entregue', variant: 'success' as const, icon: Truck, cor: 'text-verde-brocolis' };
      case 'cancelado':
        return { label: 'Cancelado', variant: 'danger' as const, icon: XCircle, cor: 'text-vermelho-tomate' };
      default:
        return { label: status, variant: 'default' as const, icon: Package, cor: 'text-text-muted' };
    }
  };

  const pedidosFiltrados = filtroStatus
    ? pedidos.filter((p) => p.status === filtroStatus)
    : pedidos;

  const handleConfirmarRecebimento = async (pedidoId: string) => {
    try {
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, status: 'entregue' as const } : p))
      );
      toast.success('Recebimento confirmado! 📦');
      setModalAvaliacao(true);
    } catch (error) {
      toast.error('Erro ao confirmar recebimento');
    }
  };

  const handleEnviarAvaliacao = async () => {
    setEnviandoAvaliacao(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Avaliação enviada com sucesso! ⭐');
      setModalAvaliacao(false);
      setPedidoDetalhe(null);
      setAvaliacao({ nota: 5, comentario: '' });
    } catch (error) {
      toast.error('Erro ao enviar avaliação');
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl text-verde-conecta">
              📦 Meus Pedidos
            </h1>
            <p className="font-body text-text-muted">
              Acompanhe suas compras e entregas
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={filtroStatus === '' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFiltroStatus('')}
          >
            Todos ({pedidos.length})
          </Button>
          <Button
            variant={filtroStatus === 'pendente' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFiltroStatus('pendente')}
          >
            <Clock className="w-4 h-4 mr-1" />
            Pendentes ({pedidos.filter((p) => p.status === 'pendente').length})
          </Button>
          <Button
            variant={filtroStatus === 'confirmado' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFiltroStatus('confirmado')}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Confirmados ({pedidos.filter((p) => p.status === 'confirmado').length})
          </Button>
          <Button
            variant={filtroStatus === 'entregue' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFiltroStatus('entregue')}
          >
            <Truck className="w-4 h-4 mr-1" />
            Entregues ({pedidos.filter((p) => p.status === 'entregue').length})
          </Button>
        </div>

        {/* Lista de Pedidos */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <EmptyState
            icon="📦"
            title="Nenhum pedido encontrado"
            description="Faça seu primeiro pedido no Marketplace!"
          />
        ) : (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => {
              const statusConfig = getStatusConfig(pedido.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={pedido.id}>
                  <CardContent>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Ícone de Status */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                          pedido.status === 'pendente'
                            ? 'bg-amarelo-pimentao/20'
                            : pedido.status === 'confirmado'
                            ? 'bg-laranja-cenoura/20'
                            : pedido.status === 'entregue'
                            ? 'bg-verde-brocolis/20'
                            : 'bg-vermelho-tomate/20'
                        }`}
                      >
                        <StatusIcon className={`w-8 h-8 ${statusConfig.cor}`} />
                      </div>

                      {/* Informações */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display font-bold text-lg text-verde-conecta">
                            {pedido.id}
                          </h3>
                          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        </div>
                        <p className="font-body text-text-main">
                          <strong>{pedido.produtor_nome}</strong> - {pedido.produtor_propriedade}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-text-muted">
                          <span className="flex items-center gap-1 font-body text-sm">
                            <Calendar className="w-4 h-4" />
                            Pedido em {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1 font-body text-sm">
                            <Truck className="w-4 h-4" />
                            Entrega: {new Date(pedido.data_entrega_desejada).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="font-body text-sm">
                            {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                      </div>

                      {/* Valor e Ações */}
                      <div className="flex flex-col items-end gap-3">
                        <p className="font-display font-black text-2xl text-verde-conecta">
                          R$ {pedido.valor_total.toFixed(2)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPedidoDetalhe(pedido)}
                            icon={<Eye className="w-4 h-4" />}
                          >
                            Detalhes
                          </Button>
                          {pedido.status === 'confirmado' && (
                            <Button
                              variant="action"
                              size="sm"
                              onClick={() => {
                                setPedidoDetalhe(pedido);
                                handleConfirmarRecebimento(pedido.id);
                              }}
                              icon={<CheckCircle className="w-4 h-4" />}
                            >
                              Confirmar Recebimento
                            </Button>
                          )}
                          {pedido.status === 'entregue' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setPedidoDetalhe(pedido);
                                setModalAvaliacao(true);
                              }}
                              icon={<Star className="w-4 h-4" />}
                            >
                              Avaliar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detalhes */}
      <Modal
        isOpen={!!pedidoDetalhe && !modalAvaliacao}
        onClose={() => setPedidoDetalhe(null)}
        title={`Pedido ${pedidoDetalhe?.id}`}
        size="lg"
      >
        {pedidoDetalhe && (
          <div className="space-y-6">
            {/* Produtor */}
            <div className="p-4 bg-verde-brocolis/10 rounded-xl">
              <h4 className="font-display font-bold text-verde-conecta mb-2">
                Produtor
              </h4>
              <p className="font-body text-text-main font-medium">
                {pedidoDetalhe.produtor_nome}
              </p>
              <p className="font-body text-sm text-text-muted">
                {pedidoDetalhe.produtor_propriedade}
              </p>
            </div>

            {/* Itens */}
            <div>
              <h4 className="font-display font-bold text-verde-conecta mb-3">
                Itens do Pedido
              </h4>
              <div className="space-y-2">
                {pedidoDetalhe.itens.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-off-white rounded-lg"
                  >
                    <div>
                      <p className="font-body font-medium">{item.produto_nome}</p>
                      <p className="font-body text-sm text-text-muted">
                        {item.quantidade} {item.unidade} × R$ {item.preco_unitario.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-display font-bold text-verde-conecta">
                      R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-verde-conecta rounded-xl">
              <span className="font-display font-bold text-white text-lg">
                Total
              </span>
              <span className="font-display font-black text-white text-2xl">
                R$ {pedidoDetalhe.valor_total.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Avaliação */}
      <Modal
        isOpen={modalAvaliacao}
        onClose={() => setModalAvaliacao(false)}
        title="⭐ Avaliar Entrega"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAvaliacao(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleEnviarAvaliacao}
              loading={enviandoAvaliacao}
            >
              Enviar Avaliação
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="font-body text-text-muted mb-4">
              Como foi a entrega de{' '}
              <strong className="text-verde-conecta">{pedidoDetalhe?.produtor_nome}</strong>?
            </p>
            <StarRating
              value={avaliacao.nota}
              onChange={(nota) => setAvaliacao((prev) => ({ ...prev, nota }))}
              size="lg"
            />
          </div>

          <Textarea
            label="Comentário (opcional)"
            placeholder="Conte como foi a experiência..."
            value={avaliacao.comentario}
            onChange={(e) => setAvaliacao((prev) => ({ ...prev, comentario: e.target.value }))}
            rows={4}
          />

          <div className="flex flex-wrap gap-2">
            {['Pontual', 'Qualidade Excelente', 'Produto Fresco', 'Atencioso', 'Recomendo'].map(
              (tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 rounded-full border-2 border-verde-conecta font-body text-sm hover:bg-verde-brocolis/20 transition-colors"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
