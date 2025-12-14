'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  Leaf,
  CheckCircle,
  Printer,
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
} from '@/components/ui';
import toast from 'react-hot-toast';

interface Relatorio {
  id: string;
  tipo: string;
  periodo: string;
  dataGeracao: string;
  status: 'disponivel' | 'gerando';
}

const RELATORIOS_DISPONIVEIS = [
  {
    id: '1',
    tipo: 'Prestação de Contas PNAE',
    descricao: 'Relatório oficial de prestação de contas para o FNDE',
    icone: '📄',
  },
  {
    id: '2',
    tipo: 'Compras Agricultura Familiar',
    descricao: 'Detalhamento de compras de produtores com DAP',
    icone: '🌱',
  },
  {
    id: '3',
    tipo: 'Cardápios Executados',
    descricao: 'Histórico de cardápios e feedbacks do período',
    icone: '🍽️',
  },
  {
    id: '4',
    tipo: 'Avaliações de Fornecedores',
    descricao: 'Resumo das avaliações de produtores',
    icone: '⭐',
  },
];

const HISTORICO_MOCK: Relatorio[] = [
  { id: 'R001', tipo: 'Prestação de Contas PNAE', periodo: 'Novembro/2025', dataGeracao: '2025-12-01', status: 'disponivel' },
  { id: 'R002', tipo: 'Compras Agricultura Familiar', periodo: 'Outubro/2025', dataGeracao: '2025-11-01', status: 'disponivel' },
  { id: 'R003', tipo: 'Prestação de Contas PNAE', periodo: 'Outubro/2025', dataGeracao: '2025-11-01', status: 'disponivel' },
];

export default function EscolaRelatorios() {
  const [gerando, setGerando] = useState<string | null>(null);
  const [mesInicio, setMesInicio] = useState('2025-12');
  const [mesFim, setMesFim] = useState('2025-12');
  const [historico, setHistorico] = useState<Relatorio[]>(HISTORICO_MOCK);

  const handleGerarRelatorio = async (tipoId: string) => {
    setGerando(tipoId);

    try {
      // Simular geração
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const tipo = RELATORIOS_DISPONIVEIS.find((r) => r.id === tipoId);

      const novoRelatorio: Relatorio = {
        id: `R${Date.now()}`,
        tipo: tipo?.tipo || 'Relatório',
        periodo: 'Dezembro/2025',
        dataGeracao: new Date().toISOString().split('T')[0],
        status: 'disponivel',
      };

      setHistorico((prev) => [novoRelatorio, ...prev]);
      toast.success(`${tipo?.tipo} gerado com sucesso! 📄`);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setGerando(null);
    }
  };

  const handleDownload = (relatorio: Relatorio) => {
    toast.success(`Baixando ${relatorio.tipo}...`);
    // Simular download
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display font-black text-3xl text-verde-conecta">
            📄 Relatórios
          </h1>
          <p className="font-body text-text-muted">
            Gere relatórios para prestação de contas e auditoria
          </p>
        </div>

        {/* Seletor de Período */}
        <Card>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block font-display font-semibold text-verde-conecta mb-2">
                  Período do Relatório
                </label>
                <div className="flex gap-3">
                  <Input
                    type="month"
                    value={mesInicio}
                    onChange={(e) => setMesInicio(e.target.value)}
                  />
                  <span className="flex items-center font-body text-text-muted">até</span>
                  <Input
                    type="month"
                    value={mesFim}
                    onChange={(e) => setMesFim(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Relatórios */}
        <div>
          <h2 className="font-display font-bold text-xl text-verde-conecta mb-4">
            Gerar Novo Relatório
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RELATORIOS_DISPONIVEIS.map((rel) => (
              <Card key={rel.id} hover>
                <CardContent className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-verde-brocolis/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{rel.icone}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-verde-conecta">
                      {rel.tipo}
                    </h3>
                    <p className="font-body text-sm text-text-muted mt-1">
                      {rel.descricao}
                    </p>
                  </div>
                  <Button
                    variant="action"
                    size="sm"
                    loading={gerando === rel.id}
                    onClick={() => handleGerarRelatorio(rel.id)}
                    icon={<FileText className="w-4 h-4" />}
                  >
                    Gerar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Histórico */}
        <Card>
          <CardHeader>
            <CardTitle>📁 Histórico de Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            {historico.length === 0 ? (
              <p className="text-center font-body text-text-muted py-8">
                Nenhum relatório gerado ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {historico.map((rel) => (
                  <div
                    key={rel.id}
                    className="flex items-center gap-4 p-4 bg-off-white rounded-xl"
                  >
                    <div className="w-12 h-12 rounded-full bg-verde-brocolis/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-verde-conecta" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-verde-conecta">
                        {rel.tipo}
                      </p>
                      <p className="font-body text-sm text-text-muted">
                        Período: {rel.periodo} • Gerado em{' '}
                        {new Date(rel.dataGeracao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Disponível
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownload(rel)}
                        icon={<Download className="w-4 h-4" />}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Printer className="w-4 h-4" />}
                      >
                        Imprimir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info PNAE */}
        <Card className="bg-amarelo-pimentao/10">
          <CardContent className="flex items-start gap-4">
            <Leaf className="w-8 h-8 text-verde-conecta flex-shrink-0" />
            <div>
              <h3 className="font-display font-bold text-verde-conecta mb-1">
                Sobre a Prestação de Contas PNAE
              </h3>
              <p className="font-body text-sm text-text-main">
                A Lei 11.947/2009 determina que no mínimo <strong>30% dos recursos</strong> do
                PNAE sejam utilizados na aquisição de gêneros alimentícios da agricultura
                familiar. O relatório de prestação de contas é essencial para comprovar o
                cumprimento desta meta junto ao FNDE.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
