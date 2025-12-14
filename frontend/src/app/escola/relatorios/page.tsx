'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Leaf,
  CheckCircle,
  Printer,
  Eye,
  X,
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
  Modal,
} from '@/components/ui';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Relatorio {
  id: string;
  tipo: string;
  periodo: string;
  dataGeracao: string;
  status: 'disponivel' | 'gerando';
  dados?: RelatorioData;
}

interface RelatorioData {
  escolaNome: string;
  escolaCNPJ: string;
  periodo: string;
  dataGeracao: string;
  tipo: string;
  resumo: {
    totalGasto: number;
    gastoAgriculturaFamiliar: number;
    percentualAF: number;
    metaPNAE: number;
    atingiuMeta: boolean;
    totalPedidos: number;
    totalFornecedores: number;
  };
  itens: Array<{
    fornecedor: string;
    produto: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    tipoFornecedor: string;
    dap?: string;
  }>;
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

// Função para gerar dados mockados do relatório
function gerarDadosRelatorio(tipo: string, periodo: string): RelatorioData {
  const itensAF = [
    { fornecedor: 'João da Roça', produto: 'Alface Crespa', quantidade: 50, valorUnitario: 3.50, dap: 'DAP/RJ-2023-001234' },
    { fornecedor: 'Maria Orgânica', produto: 'Couve Manteiga', quantidade: 40, valorUnitario: 4.00, dap: 'DAP/RJ-2023-002345' },
    { fornecedor: 'Pedro Frutas', produto: 'Banana Prata', quantidade: 80, valorUnitario: 5.00, dap: 'DAP/RJ-2023-003456' },
    { fornecedor: 'Ana Hortifruti', produto: 'Tomate', quantidade: 60, valorUnitario: 6.00, dap: 'DAP/RJ-2023-004567' },
    { fornecedor: 'Carlos Tubérculos', produto: 'Batata Doce', quantidade: 70, valorUnitario: 5.00, dap: 'DAP/RJ-2023-005678' },
    { fornecedor: 'Fernanda Ovos', produto: 'Ovos Caipira (dúzia)', quantidade: 30, valorUnitario: 15.00, dap: 'DAP/RJ-2023-006789' },
  ];

  const itensFornecedor = [
    { fornecedor: 'Ceasa Rio Distribuidora', produto: 'Arroz Tipo 1 (5kg)', quantidade: 100, valorUnitario: 24.90 },
    { fornecedor: 'Ceasa Rio Distribuidora', produto: 'Feijão Carioca (1kg)', quantidade: 80, valorUnitario: 8.50 },
    { fornecedor: 'Hortifruti Maracanã', produto: 'Carne Bovina Acém (kg)', quantidade: 50, valorUnitario: 32.90 },
    { fornecedor: 'Hortifruti Maracanã', produto: 'Frango Inteiro (kg)', quantidade: 60, valorUnitario: 12.90 },
    { fornecedor: 'Distribuidora Zona Sul', produto: 'Açúcar Cristal (5kg)', quantidade: 40, valorUnitario: 18.90 },
    { fornecedor: 'Frigorífico Niterói', produto: 'Carne Moída (kg)', quantidade: 45, valorUnitario: 28.90 },
  ];

  const itensCompletos = [
    ...itensAF.map((i) => ({ ...i, valorTotal: i.quantidade * i.valorUnitario, tipoFornecedor: 'Agricultura Familiar' })),
    ...itensFornecedor.map((i) => ({ ...i, valorTotal: i.quantidade * i.valorUnitario, tipoFornecedor: 'Fornecedor', dap: undefined })),
  ];

  const totalAF = itensAF.reduce((acc, i) => acc + i.quantidade * i.valorUnitario, 0);
  const totalFornecedor = itensFornecedor.reduce((acc, i) => acc + i.quantidade * i.valorUnitario, 0);
  const totalGeral = totalAF + totalFornecedor;
  const percentual = (totalAF / totalGeral) * 100;

  return {
    escolaNome: 'EMEF Prof. João Carlos de Oliveira',
    escolaCNPJ: '12.345.678/0001-90',
    periodo,
    dataGeracao: new Date().toLocaleDateString('pt-BR'),
    tipo,
    resumo: {
      totalGasto: totalGeral,
      gastoAgriculturaFamiliar: totalAF,
      percentualAF: percentual,
      metaPNAE: 30,
      atingiuMeta: percentual >= 30,
      totalPedidos: 24,
      totalFornecedores: 12,
    },
    itens: itensCompletos,
  };
}

// Função para gerar PDF
function gerarPDF(dados: RelatorioData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(11, 79, 53); // Verde Conecta
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CONECTA MERENDA', pageWidth / 2, 18, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(dados.tipo.toUpperCase(), pageWidth / 2, 28, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Período: ${dados.periodo}`, pageWidth / 2, 36, { align: 'center' });

  // Informações da Escola
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DA ESCOLA', 14, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Nome: ${dados.escolaNome}`, 14, 60);
  doc.text(`CNPJ: ${dados.escolaCNPJ}`, 14, 66);
  doc.text(`Data de Geração: ${dados.dataGeracao}`, 14, 72);

  // Resumo Financeiro
  doc.setFillColor(245, 245, 245);
  doc.rect(14, 80, pageWidth - 28, 40, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('RESUMO FINANCEIRO', 18, 90);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const col1 = 18;
  const col2 = pageWidth / 2;

  doc.text(`Total Gasto no Período: R$ ${dados.resumo.totalGasto.toFixed(2)}`, col1, 100);
  doc.text(`Gasto Agricultura Familiar: R$ ${dados.resumo.gastoAgriculturaFamiliar.toFixed(2)}`, col1, 108);

  doc.text(`Percentual AF: ${dados.resumo.percentualAF.toFixed(1)}%`, col2, 100);
  doc.text(`Meta PNAE: ${dados.resumo.metaPNAE}%`, col2, 108);

  // Status da Meta
  const statusMeta = dados.resumo.atingiuMeta ? 'META ATINGIDA ✓' : 'META NÃO ATINGIDA ✗';
  const corStatus = dados.resumo.atingiuMeta ? [34, 139, 34] : [220, 20, 60];
  doc.setTextColor(corStatus[0], corStatus[1], corStatus[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(statusMeta, col1, 116);

  // Tabela de Itens
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DETALHAMENTO DAS COMPRAS', 14, 132);

  const tableData = dados.itens.map((item) => [
    item.fornecedor,
    item.produto,
    item.quantidade.toString(),
    `R$ ${item.valorUnitario.toFixed(2)}`,
    `R$ ${item.valorTotal.toFixed(2)}`,
    item.tipoFornecedor,
    item.dap || '-',
  ]);

  autoTable(doc, {
    startY: 138,
    head: [['Fornecedor', 'Produto', 'Qtd', 'Vlr Unit.', 'Vlr Total', 'Tipo', 'DAP']],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [11, 79, 53],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 250, 245],
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 35 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 22, halign: 'right' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 28 },
      6: { cellWidth: 30 },
    },
  });

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount} | Gerado pelo Sistema Conecta Merenda | ${new Date().toLocaleString('pt-BR')}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
}

// Histórico inicial mockado
const HISTORICO_INICIAL: Relatorio[] = [
  {
    id: 'R001',
    tipo: 'Prestação de Contas PNAE',
    periodo: 'Novembro/2025',
    dataGeracao: '2025-12-01',
    status: 'disponivel',
    dados: gerarDadosRelatorio('Prestação de Contas PNAE', 'Novembro/2025'),
  },
  {
    id: 'R002',
    tipo: 'Compras Agricultura Familiar',
    periodo: 'Outubro/2025',
    dataGeracao: '2025-11-01',
    status: 'disponivel',
    dados: gerarDadosRelatorio('Compras Agricultura Familiar', 'Outubro/2025'),
  },
];

export default function EscolaRelatorios() {
  const [gerando, setGerando] = useState<string | null>(null);
  const [mesInicio, setMesInicio] = useState('2025-12');
  const [mesFim, setMesFim] = useState('2025-12');
  const [historico, setHistorico] = useState<Relatorio[]>(HISTORICO_INICIAL);
  const [modalPreview, setModalPreview] = useState(false);
  const [relatorioPreview, setRelatorioPreview] = useState<Relatorio | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const formatarPeriodo = (inicio: string, fim: string) => {
    const [anoI, mesI] = inicio.split('-');
    const [anoF, mesF] = fim.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    if (inicio === fim) {
      return `${meses[parseInt(mesI) - 1]}/${anoI}`;
    }
    return `${meses[parseInt(mesI) - 1]}/${anoI} a ${meses[parseInt(mesF) - 1]}/${anoF}`;
  };

  const handleGerarRelatorio = async (tipoId: string) => {
    setGerando(tipoId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const tipo = RELATORIOS_DISPONIVEIS.find((r) => r.id === tipoId);
      const periodo = formatarPeriodo(mesInicio, mesFim);
      const dados = gerarDadosRelatorio(tipo?.tipo || 'Relatório', periodo);

      const novoRelatorio: Relatorio = {
        id: `R${Date.now()}`,
        tipo: tipo?.tipo || 'Relatório',
        periodo,
        dataGeracao: new Date().toISOString().split('T')[0],
        status: 'disponivel',
        dados,
      };

      setHistorico((prev) => [novoRelatorio, ...prev]);
      toast.success(`${tipo?.tipo} gerado com sucesso! 📄`);

      // Abrir preview automaticamente
      setRelatorioPreview(novoRelatorio);
      setModalPreview(true);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setGerando(null);
    }
  };

  const handleDownload = (relatorio: Relatorio) => {
    if (!relatorio.dados) {
      toast.error('Dados do relatório não disponíveis');
      return;
    }

    const doc = gerarPDF(relatorio.dados);
    const filename = `${relatorio.tipo.replace(/\s+/g, '_')}_${relatorio.periodo.replace(/\//g, '-')}.pdf`;
    doc.save(filename);
    toast.success(`PDF baixado: ${filename}`);
  };

  const handlePrint = (relatorio: Relatorio) => {
    if (!relatorio.dados) {
      toast.error('Dados do relatório não disponíveis');
      return;
    }

    const doc = gerarPDF(relatorio.dados);
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  const handlePreview = (relatorio: Relatorio) => {
    setRelatorioPreview(relatorio);
    setModalPreview(true);
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
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(rel)}
                        icon={<Eye className="w-4 h-4" />}
                      >
                        Ver
                      </Button>
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
                        onClick={() => handlePrint(rel)}
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

      {/* Modal de Preview */}
      <Modal
        isOpen={modalPreview}
        onClose={() => setModalPreview(false)}
        title={`📄 ${relatorioPreview?.tipo || 'Relatório'}`}
        size="lg"
        footer={
          relatorioPreview && (
            <>
              <Button variant="secondary" onClick={() => setModalPreview(false)}>
                Fechar
              </Button>
              <Button
                variant="ghost"
                onClick={() => handlePrint(relatorioPreview)}
                icon={<Printer className="w-4 h-4" />}
              >
                Imprimir
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDownload(relatorioPreview)}
                icon={<Download className="w-4 h-4" />}
              >
                Baixar PDF
              </Button>
            </>
          )
        }
      >
        {relatorioPreview?.dados && (
          <div ref={previewRef} className="space-y-6">
            {/* Header do Preview */}
            <div className="bg-verde-conecta text-white p-6 rounded-xl text-center">
              <h2 className="font-display font-black text-2xl mb-1">CONECTA MERENDA</h2>
              <p className="font-display text-lg">{relatorioPreview.dados.tipo}</p>
              <p className="font-body text-sm opacity-80">
                Período: {relatorioPreview.dados.periodo}
              </p>
            </div>

            {/* Dados da Escola */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-display font-bold text-verde-conecta">Escola</p>
                <p className="font-body text-sm">{relatorioPreview.dados.escolaNome}</p>
              </div>
              <div>
                <p className="font-display font-bold text-verde-conecta">CNPJ</p>
                <p className="font-body text-sm">{relatorioPreview.dados.escolaCNPJ}</p>
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-off-white p-4 rounded-xl">
              <h3 className="font-display font-bold text-verde-conecta mb-4">
                📊 Resumo Financeiro
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="font-body text-sm text-text-muted">Total Gasto</p>
                  <p className="font-display font-bold text-lg text-verde-conecta">
                    R$ {relatorioPreview.dados.resumo.totalGasto.toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="font-body text-sm text-text-muted">Agricultura Familiar</p>
                  <p className="font-display font-bold text-lg text-verde-brocolis">
                    R$ {relatorioPreview.dados.resumo.gastoAgriculturaFamiliar.toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="font-body text-sm text-text-muted">Percentual AF</p>
                  <p className="font-display font-bold text-lg text-verde-conecta">
                    {relatorioPreview.dados.resumo.percentualAF.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="font-body text-sm text-text-muted">Status Meta</p>
                  <Badge
                    variant={relatorioPreview.dados.resumo.atingiuMeta ? 'success' : 'danger'}
                    size="sm"
                  >
                    {relatorioPreview.dados.resumo.atingiuMeta ? '✓ Atingida' : '✗ Não atingida'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tabela de Itens */}
            <div>
              <h3 className="font-display font-bold text-verde-conecta mb-3">
                📋 Detalhamento das Compras
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-verde-conecta text-white">
                    <tr>
                      <th className="p-2 text-left rounded-tl-lg">Fornecedor</th>
                      <th className="p-2 text-left">Produto</th>
                      <th className="p-2 text-center">Qtd</th>
                      <th className="p-2 text-right">Vlr Unit.</th>
                      <th className="p-2 text-right">Vlr Total</th>
                      <th className="p-2 text-center">Tipo</th>
                      <th className="p-2 text-left rounded-tr-lg">DAP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioPreview.dados.itens.map((item, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-off-white' : 'bg-white'}
                      >
                        <td className="p-2 font-medium">{item.fornecedor}</td>
                        <td className="p-2">{item.produto}</td>
                        <td className="p-2 text-center">{item.quantidade}</td>
                        <td className="p-2 text-right">R$ {item.valorUnitario.toFixed(2)}</td>
                        <td className="p-2 text-right font-medium">
                          R$ {item.valorTotal.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          <Badge
                            variant={item.tipoFornecedor === 'Agricultura Familiar' ? 'success' : 'warning'}
                            size="sm"
                          >
                            {item.tipoFornecedor === 'Agricultura Familiar' ? '🌱' : '🏭'}
                          </Badge>
                        </td>
                        <td className="p-2 text-xs">{item.dap || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rodapé */}
            <div className="text-center text-sm text-text-muted border-t pt-4">
              <p>
                Relatório gerado pelo Sistema Conecta Merenda em{' '}
                {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
