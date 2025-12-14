'use client';

import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Star,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Leaf,
  Truck,
  Award,
  Map,
  List,
  Building2,
  Tractor,
  AlertTriangle,
  Package,
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
import { MapaProdutores } from '@/components/MapaProdutores';
import { MapaFornecedores } from '@/components/MapaFornecedores';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { Produtor, Produto, TipoFornecedor } from '@/types';
import toast from 'react-hot-toast';

// Coordenadas padrão da escola (Botafogo, RJ)
const ESCOLA_COORDENADAS_PADRAO = {
  latitude: -22.9519,
  longitude: -43.1857,
};

// Mock de fornecedores normais (distribuidores/atacadistas do RJ)
const FORNECEDORES_NORMAIS: Produtor[] = [
  {
    id: 'f1',
    nome: 'Ceasa Rio Distribuidora',
    nome_propriedade: 'CEASA-RJ',
    telefone: '(21) 3333-1001',
    email: 'vendas@ceasario.com.br',
    possui_dap: false,
    localizacao: {
      endereco: 'Av. Brasil, 19001 - Irajá',
      bairro: 'Irajá',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '21540-000',
      latitude: -22.8338,
      longitude: -43.3175,
    },
    produtos: [
      { nome: 'Arroz Tipo 1 (5kg)', categoria: 'Outros', unidade: 'pacote', preco_unitario: 24.90 },
      { nome: 'Feijão Carioca (1kg)', categoria: 'Outros', unidade: 'pacote', preco_unitario: 8.50 },
      { nome: 'Macarrão Espaguete (500g)', categoria: 'Outros', unidade: 'pacote', preco_unitario: 4.20 },
      { nome: 'Óleo de Soja (900ml)', categoria: 'Outros', unidade: 'unidade', preco_unitario: 7.80 },
      { nome: 'Sal Refinado (1kg)', categoria: 'Outros', unidade: 'pacote', preco_unitario: 2.50 },
    ],
    avaliacao_media: 4.5,
    total_avaliacoes: 234,
    total_entregas: 1500,
    certificacoes: ['ISO 9001', 'ANVISA'],
    raio_entrega_km: 150,
    tipo_fornecedor: 'fornecedor_normal',
    distancia_km: 18,
  },
  {
    id: 'f2',
    nome: 'Hortifruti Maracanã',
    nome_propriedade: 'Atacado Maracanã',
    telefone: '(21) 2234-5678',
    email: 'contato@hortifrutimaracana.com.br',
    possui_dap: false,
    localizacao: {
      endereco: 'Rua São Francisco Xavier, 500',
      bairro: 'Maracanã',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20550-013',
      latitude: -22.9108,
      longitude: -43.2282,
    },
    produtos: [
      { nome: 'Carne Bovina Acém (kg)', categoria: 'Proteínas', unidade: 'kg', preco_unitario: 32.90 },
      { nome: 'Frango Inteiro (kg)', categoria: 'Proteínas', unidade: 'kg', preco_unitario: 12.90 },
      { nome: 'Leite Integral (1L)', categoria: 'Outros', unidade: 'caixa', preco_unitario: 5.20 },
      { nome: 'Ovos (dúzia)', categoria: 'Proteínas', unidade: 'dúzia', preco_unitario: 12.00 },
    ],
    avaliacao_media: 4.3,
    total_avaliacoes: 189,
    total_entregas: 980,
    certificacoes: ['SIF'],
    raio_entrega_km: 80,
    tipo_fornecedor: 'fornecedor_normal',
    distancia_km: 6,
  },
  {
    id: 'f3',
    nome: 'Distribuidora Zona Sul',
    nome_propriedade: 'ZS Alimentos LTDA',
    telefone: '(21) 3456-7890',
    email: 'comercial@zsalimentos.com.br',
    possui_dap: false,
    localizacao: {
      endereco: 'Av. das Américas, 4200 - Barra da Tijuca',
      bairro: 'Barra da Tijuca',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22640-102',
      latitude: -22.9994,
      longitude: -43.3657,
    },
    produtos: [
      { nome: 'Açúcar Cristal (5kg)', categoria: 'Outros', unidade: 'pacote', preco_unitario: 18.90 },
      { nome: 'Farinha de Trigo (1kg)', categoria: 'Outros', unidade: 'pacote', preco_unitario: 5.50 },
      { nome: 'Molho de Tomate (340g)', categoria: 'Outros', unidade: 'lata', preco_unitario: 3.20 },
      { nome: 'Achocolatado (400g)', categoria: 'Outros', unidade: 'lata', preco_unitario: 8.90 },
      { nome: 'Margarina (500g)', categoria: 'Outros', unidade: 'pote', preco_unitario: 6.50 },
    ],
    avaliacao_media: 4.7,
    total_avaliacoes: 312,
    total_entregas: 2100,
    certificacoes: ['ISO 22000', 'HACCP'],
    raio_entrega_km: 100,
    tipo_fornecedor: 'fornecedor_normal',
    distancia_km: 22,
  },
  {
    id: 'f4',
    nome: 'Frigorífico Niterói',
    nome_propriedade: 'Frigorífico Niterói S.A.',
    telefone: '(21) 2620-1234',
    email: 'vendas@frigoniteroi.com.br',
    possui_dap: false,
    localizacao: {
      endereco: 'Av. Visconde do Rio Branco, 880',
      bairro: 'Centro',
      cidade: 'Niterói',
      estado: 'RJ',
      cep: '24020-006',
      latitude: -22.8957,
      longitude: -43.1094,
    },
    produtos: [
      { nome: 'Carne Moída (kg)', categoria: 'Proteínas', unidade: 'kg', preco_unitario: 28.90 },
      { nome: 'Linguiça Toscana (kg)', categoria: 'Proteínas', unidade: 'kg', preco_unitario: 22.50 },
      { nome: 'Filé de Tilápia (kg)', categoria: 'Proteínas', unidade: 'kg', preco_unitario: 35.90 },
      { nome: 'Coxa de Frango (kg)', categoria: 'Proteínas', unidade: 'kg', preco_unitario: 14.90 },
    ],
    avaliacao_media: 4.6,
    total_avaliacoes: 156,
    total_entregas: 890,
    certificacoes: ['SIF', 'HACCP'],
    raio_entrega_km: 60,
    tipo_fornecedor: 'fornecedor_normal',
    distancia_km: 12,
  },
  {
    id: 'f5',
    nome: 'Atacadão Baixada',
    nome_propriedade: 'Atacadão Baixada Fluminense',
    telefone: '(21) 2779-4567',
    email: 'vendas@atacadaobaixada.com.br',
    possui_dap: false,
    localizacao: {
      endereco: 'Rodovia Presidente Dutra, Km 173',
      bairro: 'Centro',
      cidade: 'Nova Iguaçu',
      estado: 'RJ',
      cep: '26210-000',
      latitude: -22.7558,
      longitude: -43.4497,
    },
    produtos: [
      { nome: 'Batata Inglesa (kg)', categoria: 'Tubérculos', unidade: 'kg', preco_unitario: 5.90 },
      { nome: 'Cebola (kg)', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 4.50 },
      { nome: 'Alho (kg)', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 35.00 },
      { nome: 'Tomate (kg)', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 6.90 },
      { nome: 'Cenoura (kg)', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 4.20 },
    ],
    avaliacao_media: 4.2,
    total_avaliacoes: 278,
    total_entregas: 1650,
    certificacoes: ['ANVISA'],
    raio_entrega_km: 120,
    tipo_fornecedor: 'fornecedor_normal',
    distancia_km: 35,
  },
];

// Mock de produtores da agricultura familiar do RJ
const PRODUTORES_FAMILIARES: Produtor[] = [
  {
    id: 'af1',
    nome: 'João da Roça',
    nome_propriedade: 'Sítio Boa Esperança',
    telefone: '(21) 99876-5432',
    email: 'joao@sitioboaesperanca.com',
    possui_dap: true,
    numero_dap: 'DAP/RJ-2023-001234',
    localizacao: {
      endereco: 'Estrada do Sítio, 150',
      bairro: 'Zona Rural',
      cidade: 'Teresópolis',
      estado: 'RJ',
      cep: '25960-000',
      latitude: -22.4126,
      longitude: -42.9665,
    },
    produtos: [
      { nome: 'Alface Crespa', categoria: 'Hortaliças', unidade: 'maço', preco_unitario: 3.50 },
      { nome: 'Tomate Cereja', categoria: 'Hortaliças', unidade: 'bandeja', preco_unitario: 6.00 },
      { nome: 'Cenoura', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 4.50 },
    ],
    avaliacao_media: 4.8,
    total_avaliacoes: 45,
    total_entregas: 120,
    certificacoes: ['Orgânico'],
    raio_entrega_km: 50,
    tipo_fornecedor: 'agricultura_familiar',
    distancia_km: 25,
  },
  {
    id: 'af2',
    nome: 'Maria Orgânica',
    nome_propriedade: 'Fazenda Verde Vida',
    telefone: '(21) 98765-4321',
    email: 'contato@verdevida.com.br',
    possui_dap: true,
    numero_dap: 'DAP/RJ-2023-002345',
    localizacao: {
      endereco: 'Rodovia RJ-130, Km 45',
      bairro: 'Vale das Flores',
      cidade: 'Nova Friburgo',
      estado: 'RJ',
      cep: '28625-000',
      latitude: -22.2819,
      longitude: -42.5311,
    },
    produtos: [
      { nome: 'Couve Manteiga', categoria: 'Hortaliças', unidade: 'maço', preco_unitario: 4.00 },
      { nome: 'Brócolis', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 8.50 },
      { nome: 'Espinafre', categoria: 'Hortaliças', unidade: 'maço', preco_unitario: 5.00 },
      { nome: 'Rúcula', categoria: 'Hortaliças', unidade: 'maço', preco_unitario: 4.50 },
    ],
    avaliacao_media: 4.9,
    total_avaliacoes: 78,
    total_entregas: 200,
    certificacoes: ['Orgânico', 'Selo Verde'],
    raio_entrega_km: 60,
    tipo_fornecedor: 'agricultura_familiar',
    distancia_km: 35,
  },
  {
    id: 'af3',
    nome: 'Pedro Frutas',
    nome_propriedade: 'Pomar do Vale',
    telefone: '(24) 99234-5678',
    email: 'pedro@pomardovale.com',
    possui_dap: true,
    numero_dap: 'DAP/RJ-2023-003456',
    localizacao: {
      endereco: 'Estrada das Frutas, 500',
      bairro: 'Zona Rural',
      cidade: 'Petrópolis',
      estado: 'RJ',
      cep: '25725-000',
      latitude: -22.5112,
      longitude: -43.1779,
    },
    produtos: [
      { nome: 'Banana Prata', categoria: 'Frutas', unidade: 'kg', preco_unitario: 5.00 },
      { nome: 'Laranja Lima', categoria: 'Frutas', unidade: 'kg', preco_unitario: 4.00 },
      { nome: 'Mamão Formosa', categoria: 'Frutas', unidade: 'kg', preco_unitario: 6.00 },
      { nome: 'Manga Palmer', categoria: 'Frutas', unidade: 'kg', preco_unitario: 7.50 },
    ],
    avaliacao_media: 4.7,
    total_avaliacoes: 56,
    total_entregas: 150,
    certificacoes: [],
    raio_entrega_km: 45,
    tipo_fornecedor: 'agricultura_familiar',
    distancia_km: 20,
  },
  {
    id: 'af4',
    nome: 'Ana Hortifruti',
    nome_propriedade: 'Horta Familiar da Ana',
    telefone: '(21) 97654-3210',
    email: 'ana.hortifruti@gmail.com',
    possui_dap: true,
    numero_dap: 'DAP/RJ-2023-004567',
    localizacao: {
      endereco: 'Rua das Hortaliças, 88',
      bairro: 'Campo Grande',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '23087-000',
      latitude: -22.9035,
      longitude: -43.5618,
    },
    produtos: [
      { nome: 'Pepino Japonês', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 5.50 },
      { nome: 'Pimentão Colorido', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 8.00 },
      { nome: 'Abobrinha Italiana', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 6.00 },
      { nome: 'Berinjela', categoria: 'Hortaliças', unidade: 'kg', preco_unitario: 5.00 },
    ],
    avaliacao_media: 4.6,
    total_avaliacoes: 32,
    total_entregas: 85,
    certificacoes: ['Selo da Agricultura Familiar'],
    raio_entrega_km: 30,
    tipo_fornecedor: 'agricultura_familiar',
    distancia_km: 15,
  },
  {
    id: 'af5',
    nome: 'Carlos Tubérculos',
    nome_propriedade: 'Terra Boa Orgânicos',
    telefone: '(21) 96543-2109',
    email: 'carlos@terraboa.com.br',
    possui_dap: true,
    numero_dap: 'DAP/RJ-2023-005678',
    localizacao: {
      endereco: 'Estrada do Monjolo, 200',
      bairro: 'Guaratiba',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '23030-000',
      latitude: -23.0035,
      longitude: -43.6318,
    },
    produtos: [
      { nome: 'Batata Doce', categoria: 'Tubérculos', unidade: 'kg', preco_unitario: 5.00 },
      { nome: 'Mandioca', categoria: 'Tubérculos', unidade: 'kg', preco_unitario: 4.50 },
      { nome: 'Inhame', categoria: 'Tubérculos', unidade: 'kg', preco_unitario: 6.00 },
      { nome: 'Cará', categoria: 'Tubérculos', unidade: 'kg', preco_unitario: 7.00 },
    ],
    avaliacao_media: 4.5,
    total_avaliacoes: 28,
    total_entregas: 70,
    certificacoes: ['Orgânico'],
    raio_entrega_km: 40,
    tipo_fornecedor: 'agricultura_familiar',
    distancia_km: 22,
  },
  {
    id: 'af6',
    nome: 'Fernanda Ovos Caipira',
    nome_propriedade: 'Recanto Natural',
    telefone: '(21) 95432-1098',
    email: 'fernanda@recantonatural.com',
    possui_dap: true,
    numero_dap: 'DAP/RJ-2023-006789',
    localizacao: {
      endereco: 'Sitio Recanto, s/n',
      bairro: 'Vargem Grande',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22783-000',
      latitude: -22.9935,
      longitude: -43.4718,
    },
    produtos: [
      { nome: 'Ovos Caipira (dúzia)', categoria: 'Proteínas', unidade: 'dúzia', preco_unitario: 15.00 },
      { nome: 'Queijo Minas Fresco', categoria: 'Proteínas', unidade: 'kg', preco_unitario: 35.00 },
      { nome: 'Mel Puro', categoria: 'Outros', unidade: 'pote 500g', preco_unitario: 25.00 },
    ],
    avaliacao_media: 4.8,
    total_avaliacoes: 65,
    total_entregas: 180,
    certificacoes: ['SIF', 'Selo Orgânico'],
    raio_entrega_km: 35,
    tipo_fornecedor: 'agricultura_familiar',
    distancia_km: 12,
  },
  {
    id: 'af7',
    nome: 'Roberto Morango',
    nome_propriedade: 'Sítio São José',
    telefone: '(24) 98321-0987',
    email: 'roberto@sitiosaojose.com',
    possui_dap: true,
    numero_dap: 'DAP/RJ-2023-007890',
    localizacao: {
      endereco: 'Estrada Serrana, Km 15',
      bairro: 'Secretário',
      cidade: 'Petrópolis',
      estado: 'RJ',
      cep: '25730-000',
      latitude: -22.4612,
      longitude: -43.2079,
    },
    produtos: [
      { nome: 'Morango', categoria: 'Frutas', unidade: 'bandeja 300g', preco_unitario: 12.00 },
      { nome: 'Amora', categoria: 'Frutas', unidade: 'bandeja 200g', preco_unitario: 15.00 },
      { nome: 'Mirtilo', categoria: 'Frutas', unidade: 'bandeja 150g', preco_unitario: 18.00 },
    ],
    avaliacao_media: 4.9,
    total_avaliacoes: 89,
    total_entregas: 220,
    certificacoes: ['Orgânico', 'Global GAP'],
    raio_entrega_km: 55,
    tipo_fornecedor: 'agricultura_familiar',
    distancia_km: 30,
  },
  {
    id: 'af8',
    nome: 'Lucia Temperos',
    nome_propriedade: 'Chácara das Flores',
    telefone: '(21) 94321-0876',
    email: 'lucia@chacaradasflores.com.br',
    possui_dap: true,
    numero_dap: 'DAP/RJ-2023-008901',
    localizacao: {
      endereco: 'Rua das Flores, 45',
      bairro: 'Taquara',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22730-000',
      latitude: -22.9235,
      longitude: -43.3718,
    },
    produtos: [
      { nome: 'Manjericão', categoria: 'Hortaliças', unidade: 'maço', preco_unitario: 4.00 },
      { nome: 'Hortelã', categoria: 'Hortaliças', unidade: 'maço', preco_unitario: 3.50 },
      { nome: 'Cebolinha', categoria: 'Hortaliças', unidade: 'maço', preco_unitario: 3.00 },
      { nome: 'Salsinha', categoria: 'Hortaliças', unidade: 'maço', preco_unitario: 3.00 },
      { nome: 'Chá de Camomila', categoria: 'Outros', unidade: 'pacote 50g', preco_unitario: 8.00 },
    ],
    avaliacao_media: 4.4,
    total_avaliacoes: 41,
    total_entregas: 95,
    certificacoes: [],
    raio_entrega_km: 25,
    tipo_fornecedor: 'agricultura_familiar',
    distancia_km: 8,
  },
];

type AbaAtiva = 'agricultura_familiar' | 'fornecedores';

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
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('agricultura_familiar');

  const { carrinho, adicionarItem, removerItem, atualizarQuantidade, limparCarrinho, totalItens, tipoCarrinho } =
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
  }, [filtroCategoria, filtroRaio, abaAtiva]);

  const carregarProdutores = async () => {
    try {
      setLoading(true);

      if (abaAtiva === 'agricultura_familiar') {
        // Usar mock de produtores familiares
        setProdutores(PRODUTORES_FAMILIARES);
      } else {
        // Usar mock de fornecedores normais
        setProdutores(FORNECEDORES_NORMAIS);
      }
    } catch (error) {
      toast.error('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  const produtoresFiltrados = produtores.filter((p) =>
    p.nome.toLowerCase().includes(buscaNome.toLowerCase()) ||
    p.nome_propriedade.toLowerCase().includes(buscaNome.toLowerCase())
  );

  const handleAdicionarProduto = (produtor: Produtor, produto: Produto) => {
    const tipoFornecedor: TipoFornecedor =
      abaAtiva === 'agricultura_familiar' ? 'agricultura_familiar' : 'fornecedor_normal';
    adicionarItem(produtor.id, produtor.nome, produto, 1, tipoFornecedor);
  };

  const calcularDesconto = (distancia?: number) => {
    if (!distancia || distancia >= 50) return 0;
    return Math.min(20, Math.floor((50 - distancia) / 2));
  };

  const handleProdutorNoMapa = (id: string) => {
    const produtor = produtores.find((p) => p.id === id);
    if (produtor) {
      setProdutorSelecionado(produtor);
    }
  };

  const handleTrocarAba = (novaAba: AbaAtiva) => {
    // Verificar se há itens no carrinho de outro tipo
    if (tipoCarrinho) {
      const tipoNovaAba = novaAba === 'agricultura_familiar' ? 'agricultura_familiar' : 'fornecedor_normal';
      if (tipoCarrinho !== tipoNovaAba && carrinho.itens.length > 0) {
        toast(
          <div>
            <p className="font-bold">⚠️ Carrinho com itens</p>
            <p className="text-sm">
              Você tem itens de{' '}
              {tipoCarrinho === 'agricultura_familiar' ? 'Agricultura Familiar' : 'Fornecedores'}
              no carrinho. Finalize ou limpe antes de trocar.
            </p>
          </div>,
          { duration: 4000 }
        );
      }
    }
    setAbaAtiva(novaAba);
    setBuscaNome('');
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
              Compre de produtores familiares (30% PNAE) e fornecedores (70%)
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
                <span className="ml-2">R$ {carrinho.total.toFixed(2)}</span>
              )}
            </Button>
          </div>
        </div>

        {/* Abas: Agricultura Familiar x Fornecedores */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleTrocarAba('agricultura_familiar')}
            className={`p-4 rounded-2xl border-3 transition-all ${
              abaAtiva === 'agricultura_familiar'
                ? 'bg-verde-brocolis/20 border-verde-brocolis shadow-hard'
                : 'bg-white border-border-light hover:border-verde-brocolis/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  abaAtiva === 'agricultura_familiar' ? 'bg-verde-brocolis text-white' : 'bg-verde-brocolis/20'
                }`}
              >
                <Tractor className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-display font-bold text-verde-conecta">Agricultura Familiar</p>
                <p className="font-body text-sm text-text-muted">30% do orçamento PNAE</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge variant="success" size="sm">
                <Leaf className="w-3 h-3 mr-1" />
                DAP/CAF
              </Badge>
              <Badge variant="info" size="sm">Produtores locais</Badge>
            </div>
          </button>

          <button
            onClick={() => handleTrocarAba('fornecedores')}
            className={`p-4 rounded-2xl border-3 transition-all ${
              abaAtiva === 'fornecedores'
                ? 'bg-laranja-cenoura/20 border-laranja-cenoura shadow-hard'
                : 'bg-white border-border-light hover:border-laranja-cenoura/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  abaAtiva === 'fornecedores' ? 'bg-laranja-cenoura text-white' : 'bg-laranja-cenoura/20'
                }`}
              >
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-display font-bold text-verde-conecta">Fornecedores</p>
                <p className="font-body text-sm text-text-muted">70% do orçamento</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge variant="warning" size="sm">
                <Building2 className="w-3 h-3 mr-1" />
                Atacado
              </Badge>
              <Badge variant="info" size="sm">Distribuidores</Badge>
            </div>
          </button>
        </div>

        {/* Alerta de tipo de carrinho */}
        {tipoCarrinho && (
          <div
            className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
              tipoCarrinho === 'agricultura_familiar'
                ? 'bg-verde-brocolis/10 border-verde-brocolis'
                : 'bg-laranja-cenoura/10 border-laranja-cenoura'
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-amarelo-pimentao" />
            <p className="font-body text-sm">
              <strong>Carrinho ativo:</strong> Você está comprando de{' '}
              <Badge
                variant={tipoCarrinho === 'agricultura_familiar' ? 'success' : 'warning'}
                size="sm"
              >
                {tipoCarrinho === 'agricultura_familiar' ? '🌱 Agricultura Familiar' : '🏭 Fornecedores'}
              </Badge>
              . Finalize ou limpe o carrinho para comprar de outro tipo.
            </p>
          </div>
        )}

        {/* Filtros */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder={`Buscar ${abaAtiva === 'agricultura_familiar' ? 'produtor' : 'fornecedor'}...`}
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
                  { value: 'Outros', label: '📦 Outros' },
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

        {/* Visualização Mapa (apenas para agricultura familiar) */}
        {visualizacao === 'mapa' && abaAtiva === 'agricultura_familiar' && (
          <Card>
            <CardContent className="p-0">
              <div className="h-[500px] rounded-xl overflow-hidden">
                <MapaProdutores
                  escolaCoordenadas={escolaCoordenadas}
                  produtores={PRODUTORES_FAMILIARES.map((p) => ({
                    id: p.id,
                    nome: p.nome,
                    propriedade: p.nome_propriedade,
                    coordenadas: {
                      latitude: p.localizacao.latitude,
                      longitude: p.localizacao.longitude,
                    },
                    distancia: p.distancia_km || 0,
                    avaliacao: p.avaliacao_media,
                    produtos: p.produtos.map((prod) => prod.nome),
                  }))}
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

        {/* Visualização Mapa (para fornecedores normais) */}
        {visualizacao === 'mapa' && abaAtiva === 'fornecedores' && (
          <Card>
            <CardContent className="p-0">
              <div className="h-[500px] rounded-xl overflow-hidden">
                <MapaFornecedores
                  escolaCoordenadas={escolaCoordenadas}
                  fornecedores={FORNECEDORES_NORMAIS.map((f) => ({
                    id: f.id,
                    nome: f.nome,
                    propriedade: f.nome_propriedade,
                    coordenadas: {
                      latitude: f.localizacao.latitude,
                      longitude: f.localizacao.longitude,
                    },
                    distancia: f.distancia_km || 0,
                    avaliacao: f.avaliacao_media,
                    produtos: f.produtos.map((prod) => prod.nome),
                  }))}
                  onFornecedorClick={handleProdutorNoMapa}
                />
              </div>
              {/* Legenda */}
              <div className="p-4 bg-off-white border-t-2 border-border-light">
                <p className="font-display font-semibold text-sm text-laranja-cenoura mb-2">
                  📍 Legenda do Mapa - Fornecedores
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-verde-conecta"></span>
                    <span>🏫 Sua escola</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-laranja-cenoura"></span>
                    <span>Até 10 km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                    <span>10-30 km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gray-500"></span>
                    <span>+30 km</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Produtores/Fornecedores */}
        {visualizacao === 'lista' && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : produtoresFiltrados.length === 0 ? (
              <EmptyState
                icon={abaAtiva === 'agricultura_familiar' ? '🥦' : '🏭'}
                title={`Nenhum ${abaAtiva === 'agricultura_familiar' ? 'produtor' : 'fornecedor'} encontrado`}
                description="Tente ajustar os filtros de busca"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtoresFiltrados.map((produtor) => {
                  const desconto = calcularDesconto(produtor.distancia_km);
                  const isAgriculturaFamiliar = abaAtiva === 'agricultura_familiar';

                  return (
                    <Card key={produtor.id} hover>
                      <CardContent className="p-0">
                        {/* Header do Card */}
                        <div className="p-4 border-b-2 border-border-light">
                          <div className="flex items-start gap-3">
                            <Avatar fallback={produtor.nome} size="lg" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-display font-bold text-verde-conecta">
                                  {produtor.nome}
                                </h3>
                                {/* Tag de tipo */}
                                <Badge
                                  variant={isAgriculturaFamiliar ? 'success' : 'warning'}
                                  size="sm"
                                >
                                  {isAgriculturaFamiliar ? '🌱' : '🏭'}
                                </Badge>
                              </div>
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
                            {isAgriculturaFamiliar && produtor.possui_dap && (
                              <Badge variant="success">
                                <Leaf className="w-3 h-3 mr-1" /> DAP
                              </Badge>
                            )}
                            {!isAgriculturaFamiliar && (
                              <Badge variant="warning">
                                <Package className="w-3 h-3 mr-1" /> Atacado
                              </Badge>
                            )}
                            {produtor.certificacoes?.map((cert, i) => (
                              <Badge key={i} variant="info">
                                <Award className="w-3 h-3 mr-1" /> {cert}
                              </Badge>
                            ))}
                            {isAgriculturaFamiliar && desconto > 0 && (
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
                                  <p className="font-body font-medium text-sm">{produto.nome}</p>
                                  <p className="font-body text-xs text-text-muted">
                                    R$ {Number(produto.preco_unitario).toFixed(2)} / {produto.unidade}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleAdicionarProduto(produtor, produto)}
                                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center hover:opacity-80 transition-colors ${
                                    isAgriculturaFamiliar ? 'bg-verde-brocolis' : 'bg-laranja-cenoura'
                                  }`}
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
          title={
            tipoCarrinho
              ? `🛒 Carrinho - ${tipoCarrinho === 'agricultura_familiar' ? '🌱 Agricultura Familiar (30% PNAE)' : '🏭 Fornecedores (70%)'}`
              : '🛒 Meu Carrinho'
          }
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
            <EmptyState icon="🛒" title="Carrinho vazio" description="Adicione produtos dos fornecedores" />
          ) : (
            <div className="space-y-4">
              {/* Badge do tipo de compra */}
              <div
                className={`p-3 rounded-xl flex items-center gap-2 ${
                  tipoCarrinho === 'agricultura_familiar'
                    ? 'bg-verde-brocolis/10'
                    : 'bg-laranja-cenoura/10'
                }`}
              >
                {tipoCarrinho === 'agricultura_familiar' ? (
                  <>
                    <Tractor className="w-5 h-5 text-verde-brocolis" />
                    <span className="font-body text-sm">
                      <strong>Compra de Agricultura Familiar</strong> - Conta para os 30% obrigatórios do PNAE
                    </span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5 text-laranja-cenoura" />
                    <span className="font-body text-sm">
                      <strong>Compra de Fornecedores</strong> - Parte dos 70% do orçamento
                    </span>
                  </>
                )}
              </div>

              {carrinho.itens.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-off-white rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-bold text-verde-conecta">{item.produto.nome}</p>
                      <Badge
                        variant={item.tipoFornecedor === 'agricultura_familiar' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {item.tipoFornecedor === 'agricultura_familiar' ? '🌱' : '🏭'}
                      </Badge>
                    </div>
                    <p className="font-body text-sm text-text-muted">
                      {item.produtorNome} • R$ {Number(item.produto.preco_unitario).toFixed(2)} /{' '}
                      {item.produto.unidade}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        atualizarQuantidade(item.produtorId, item.produto.nome, item.quantidade - 1)
                      }
                      className="w-8 h-8 rounded-full bg-white border-2 border-verde-conecta flex items-center justify-center hover:bg-verde-conecta hover:text-white transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => {
                        const novaQtd = parseInt(e.target.value) || 1;
                        atualizarQuantidade(item.produtorId, item.produto.nome, Math.max(1, novaQtd));
                      }}
                      onBlur={(e) => {
                        if (!e.target.value || parseInt(e.target.value) < 1) {
                          atualizarQuantidade(item.produtorId, item.produto.nome, 1);
                        }
                      }}
                      className="w-16 h-8 text-center font-display font-bold border-2 border-verde-conecta rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-brocolis"
                    />
                    <button
                      onClick={() =>
                        atualizarQuantidade(item.produtorId, item.produto.nome, item.quantidade + 1)
                      }
                      className="w-8 h-8 rounded-full bg-verde-brocolis text-white flex items-center justify-center hover:bg-verde-conecta transition-colors"
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
                <span className="font-display font-bold text-xl text-verde-conecta">Total</span>
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
