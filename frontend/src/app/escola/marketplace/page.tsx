'use client';

import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Star,
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Leaf,
  Truck,
  Award,
  Map,
  List,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  Spinner,
  EmptyState,
  Avatar,
} from '@/components/ui';
import { MapaProdutores, PRODUTORES_RJ } from '@/components/MapaProdutores';
import { agricultoresService } from '@/services/api';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { Produtor, Produto } from '@/types';
import toast from 'react-hot-toast';

// Coordenadas padrão da escola (Botafogo, RJ)
const ESCOLA_COORDENADAS_PADRAO = {
  latitude: -22.9519,
  longitude: -43.1857,
};

export default function EscolaMarketplace() {
  const [loading, setLoading] = useState(true);
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroRaio, setFiltroRaio] = useState('100');
  const [buscaNome, setBuscaNome] = useState('');
  const [produtorSelecionado, setProdutorSelecionado] = useState<Produtor | null>(null);
  const [modalCarrinho, setModalCarrinho] = useState(false);
  const [visualizacao, setVisualizacao] = useState<'lista' | 'mapa'>('lista');
  const [escolaCoordenadas, setEscolaCoordenadas] = useState(ESCOLA_COORDENADAS_PADRAO);

  const { carrinho, adicionarItem, removerItem, atualizarQuantidade, limparCarrinho, totalItens } =
    useCarrinho();

  useEffect(() => {
    // Carregar coordenadas da escola do localStorage
    const perfilEscola = localStorage.getItem('perfilEscola');
    if (perfilEscola) {
      const perfil = JSON.parse(perfilEscola);
      if (perfil.coordenadas) {
        setEscolaCoordenadas(perfil.coordenadas);
      }
    }
    carregarProdutores();
  }, [filtroCategoria, filtroRaio]);

  const carregarProdutores = async () => {
    try {
      setLoading(true);
      const params: any = {
        limite: 50,
      };

      if (filtroCategoria) {
        params.categoria = filtroCategoria;
      }

      const data = await agricultoresService.listar(params);
      setProdutores(data);
    } catch (error) {
      toast.error('Erro ao carregar produtores');
    } finally {
      setLoading(false);
    }
  };

  const produtoresFiltrados = produtores.filter((p) =>
    p.nome.toLowerCase().includes(buscaNome.toLowerCase()) ||
    p.nome_propriedade.toLowerCase().includes(buscaNome.toLowerCase())
  );

  const handleAdicionarProduto = (produtor: Produtor, produto: Produto) => {
    adicionarItem(produtor.id, produtor.nome, produto, 1);
  };

  const calcularDesconto = (distancia?: number) => {
    if (!distancia || distancia >= 50) return 0;
    return Math.min(20, Math.floor((50 - distancia) / 2));
  };

  const handleProdutorNoMapa = (id: string) => {
    const produtor = produtores.find(p => p.id === id);
    if (produtor) {
      setProdutorSelecionado(produtor);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl text-verde-conecta">
              🛒 Marketplace
            </h1>
            <p className="font-body text-text-muted">
              Encontre produtores da agricultura familiar próximos
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Visualização */}
            <div className="flex bg-off-white rounded-full p-1 border-2 border-verde-conecta">
              <button
                onClick={() => setVisualizacao('lista')}
                className={`px-4 py-2 rounded-full font-display font-semibold text-sm transition-colors ${
                  visualizacao === 'lista'
                    ? 'bg-verde-conecta text-white'
                    : 'text-verde-conecta hover:bg-verde-conecta/10'
                }`}
              >
                <List className="w-4 h-4 inline mr-1" />
                Lista
              </button>
              <button
                onClick={() => setVisualizacao('mapa')}
                className={`px-4 py-2 rounded-full font-display font-semibold text-sm transition-colors ${
                  visualizacao === 'mapa'
                    ? 'bg-verde-conecta text-white'
                    : 'text-verde-conecta hover:bg-verde-conecta/10'
                }`}
              >
                <Map className="w-4 h-4 inline mr-1" />
                Mapa
              </button>
            </div>

            {/* Botão do Carrinho */}
            <Button
              variant="primary"
              onClick={() => setModalCarrinho(true)}
              icon={<ShoppingCart className="w-5 h-5" />}
            >
              Carrinho ({totalItens})
              {carrinho.total > 0 && (
                <span className="ml-2">
                  R$ {carrinho.total.toFixed(2)}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Buscar por nome ou propriedade..."
                  value={buscaNome}
                  onChange={(e) => setBuscaNome(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              <Select
                options={[
                  { value: '', label: 'Todas as categorias' },
                  { value: 'Hortaliças', label: '🥬 Hortaliças' },
                  { value: 'Frutas', label: '🍎 Frutas' },
                  { value: 'Tubérculos', label: '🥔 Tubérculos' },
                  { value: 'Proteínas', label: '🥚 Proteínas' },
                ]}
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              />
              <Select
                options={[
                  { value: '25', label: 'Até 25 km' },
                  { value: '50', label: 'Até 50 km' },
                  { value: '100', label: 'Até 100 km' },
                  { value: '200', label: 'Até 200 km' },
                ]}
                value={filtroRaio}
                onChange={(e) => setFiltroRaio(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Visualização Mapa */}
        {visualizacao === 'mapa' && (
          <Card>
            <CardContent className="p-0">
              <div className="h-[500px] rounded-xl overflow-hidden">
                <MapaProdutores
                  escolaCoordenadas={escolaCoordenadas}
                  produtores={PRODUTORES_RJ}
                  onProdutorClick={handleProdutorNoMapa}
                />
              </div>
              {/* Legenda */}
              <div className="p-4 bg-off-white border-t-2 border-border-light">
                <p className="font-display font-semibold text-sm text-verde-conecta mb-2">
                  📍 Legenda do Mapa
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-verde-conecta"></span>
                    <span>🏫 Sua escola</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-verde-brocolis"></span>
                    <span>Até 5 km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-amarelo-pimentao"></span>
                    <span>5-10 km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-laranja-cenoura"></span>
                    <span>+10 km</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Produtores */}
        {visualizacao === 'lista' && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : produtoresFiltrados.length === 0 ? (
              <EmptyState
                icon="🥦"
                title="Nenhum produtor encontrado"
                description="Tente ajustar os filtros de busca"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtoresFiltrados.map((produtor) => {
              const desconto = calcularDesconto(produtor.distancia_km);

              return (
                <Card key={produtor.id} hover>
                  <CardContent className="p-0">
                    {/* Header do Card */}
                    <div className="p-4 border-b-2 border-border-light">
                      <div className="flex items-start gap-3">
                        <Avatar fallback={produtor.nome} size="lg" />
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-verde-conecta">
                            {produtor.nome}
                          </h3>
                          <p className="font-body text-sm text-text-muted">
                            {produtor.nome_propriedade}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 text-amarelo-pimentao fill-amarelo-pimentao" />
                            <span className="font-body text-sm font-medium">
                              {Number(produtor.avaliacao_media || 0).toFixed(1)}
                            </span>
                            <span className="font-body text-xs text-text-muted">
                              ({produtor.total_avaliacoes} avaliações)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {produtor.possui_dap && (
                          <Badge variant="success">
                            <Leaf className="w-3 h-3 mr-1" /> DAP
                          </Badge>
                        )}
                        {produtor.certificacoes?.map((cert, i) => (
                          <Badge key={i} variant="info">
                            <Award className="w-3 h-3 mr-1" /> {cert}
                          </Badge>
                        ))}
                        {desconto > 0 && (
                          <Badge variant="warning">-{desconto}% proximidade</Badge>
                        )}
                      </div>
                    </div>

                    {/* Produtos */}
                    <div className="p-4">
                      <p className="font-display font-semibold text-sm text-verde-conecta mb-3">
                        Produtos disponíveis:
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {produtor.produtos.map((produto, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-off-white rounded-lg"
                          >
                            <div>
                              <p className="font-body font-medium text-sm">
                                {produto.nome}
                              </p>
                              <p className="font-body text-xs text-text-muted">
                                R$ {Number(produto.preco_unitario).toFixed(2)} / {produto.unidade}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAdicionarProduto(produtor, produto)}
                              className="w-8 h-8 rounded-full bg-verde-brocolis text-white flex items-center justify-center hover:bg-verde-conecta transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-off-white border-t-2 border-border-light flex items-center justify-between">
                      <div className="flex items-center gap-1 text-text-muted">
                        <MapPin className="w-4 h-4" />
                        <span className="font-body text-sm">
                          {produtor.localizacao.cidade}, {produtor.localizacao.estado}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-verde-brocolis">
                        <Truck className="w-4 h-4" />
                        <span className="font-body text-sm font-medium">
                          Entrega até {produtor.raio_entrega_km}km
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
          </>
        )}

      {/* Modal do Carrinho */}
      <Modal
        isOpen={modalCarrinho}
        onClose={() => setModalCarrinho(false)}
        title="🛒 Meu Carrinho"
        size="lg"
        footer={
          carrinho.itens.length > 0 && (
            <>
              <Button variant="secondary" onClick={limparCarrinho}>
                Limpar
              </Button>
              <Button variant="primary">
                Finalizar Pedido - R$ {carrinho.total.toFixed(2)}
              </Button>
            </>
          )
        }
      >
        {carrinho.itens.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="Carrinho vazio"
            description="Adicione produtos dos produtores"
          />
        ) : (
          <div className="space-y-4">
            {carrinho.itens.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 bg-off-white rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-display font-bold text-verde-conecta">
                    {item.produto.nome}
                  </p>
                  <p className="font-body text-sm text-text-muted">
                    {item.produtorNome} • R$ {Number(item.produto.preco_unitario).toFixed(2)} / {item.produto.unidade}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      atualizarQuantidade(item.produtorId, item.produto.nome, item.quantidade - 1)
                    }
                    className="w-8 h-8 rounded-full bg-white border-2 border-verde-conecta flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-display font-bold w-8 text-center">
                    {item.quantidade}
                  </span>
                  <button
                    onClick={() =>
                      atualizarQuantidade(item.produtorId, item.produto.nome, item.quantidade + 1)
                    }
                    className="w-8 h-8 rounded-full bg-verde-brocolis text-white flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-display font-bold text-verde-conecta w-24 text-right">
                  R$ {(Number(item.produto.preco_unitario) * item.quantidade).toFixed(2)}
                </p>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-verde-conecta">
              <span className="font-display font-bold text-xl text-verde-conecta">
                Total
              </span>
              <span className="font-display font-black text-2xl text-verde-conecta">
                R$ {carrinho.total.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </DashboardLayout>
  );
}
