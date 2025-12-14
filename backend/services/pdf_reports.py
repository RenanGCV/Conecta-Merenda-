"""
Serviço de geração de relatórios PDF.
Cria relatórios de compras para prestação de contas PNAE.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
from typing import Dict, List
import io
import os


def gerar_relatorio_compra_pdf(pedido: Dict, escola: Dict, produtor: Dict) -> bytes:
    """
    Gera relatório PDF de compra para prestação de contas PNAE.
    
    Args:
        pedido: Dados do pedido
        escola: Dados da escola
        produtor: Dados do produtor
    
    Returns:
        Bytes do PDF gerado
    """
    # Buffer em memória para o PDF
    buffer = io.BytesIO()
    
    # Criar documento
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )
    
    # Container para elementos do PDF
    elements = []
    
    # Estilos
    styles = getSampleStyleSheet()
    titulo_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#0B4F35'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    # Título
    titulo = Paragraph("RELATÓRIO DE COMPRA - PNAE", titulo_style)
    elements.append(titulo)
    elements.append(Spacer(1, 0.5*cm))
    
    # Informações do cabeçalho
    info_header = [
        ["<b>Número do Pedido:</b>", pedido.get("id", "N/A")],
        ["<b>Data:</b>", pedido.get("data_pedido", datetime.now().strftime("%d/%m/%Y"))],
        ["<b>Escola:</b>", escola.get("nome", "N/A")],
        ["<b>CNPJ Escola:</b>", escola.get("cnpj", "N/A")],
        ["<b>Produtor:</b>", produtor.get("nome", "N/A")],
        ["<b>DAP/CAF:</b>", produtor.get("numero_dap", "Sem DAP")],
    ]
    
    table_header = Table(info_header, colWidths=[6*cm, 11*cm])
    table_header.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#0B4F35')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(table_header)
    elements.append(Spacer(1, 1*cm))
    
    # Tabela de itens
    subtitle = Paragraph("<b>Itens do Pedido</b>", styles['Heading2'])
    elements.append(subtitle)
    elements.append(Spacer(1, 0.3*cm))
    
    # Cabeçalho da tabela de itens
    dados_itens = [
        ["Produto", "Quantidade", "Unidade", "Preço Unit.", "Subtotal"]
    ]
    
    # Adicionar itens
    total_geral = 0
    for item in pedido.get("itens", []):
        quantidade = float(item.get("quantidade", 0))
        preco_unit = float(item.get("preco_unitario", 0))
        subtotal = quantidade * preco_unit
        total_geral += subtotal
        
        dados_itens.append([
            item.get("produto_nome", ""),
            f"{quantidade:.2f}",
            item.get("unidade", ""),
            f"R$ {preco_unit:.2f}",
            f"R$ {subtotal:.2f}"
        ])
    
    # Linha de total
    dados_itens.append([
        "", "", "", "<b>TOTAL:</b>", f"<b>R$ {total_geral:.2f}</b>"
    ])
    
    table_itens = Table(dados_itens, colWidths=[6*cm, 2.5*cm, 2.5*cm, 3*cm, 3*cm])
    table_itens.setStyle(TableStyle([
        # Cabeçalho
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0B4F35')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        
        # Corpo
        ('FONTNAME', (0, 1), (-1, -2), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -2), 10),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        
        # Linha de total
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#F4F7F5')),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('ALIGN', (-2, -1), (-1, -1), 'RIGHT'),
        
        # Bordas
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(table_itens)
    elements.append(Spacer(1, 1*cm))
    
    # Informações de logística
    elements.append(Paragraph("<b>Informações de Logística</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.3*cm))
    
    tipo_logistica = pedido.get("tipo_logistica", "entrega")
    data_entrega = pedido.get("data_entrega_desejada", "A combinar")
    
    info_logistica = [
        ["<b>Tipo:</b>", "Entrega pelo Produtor" if tipo_logistica == "entrega" else "Retirada na Propriedade"],
        ["<b>Data Prevista:</b>", data_entrega],
        ["<b>Observações:</b>", pedido.get("observacoes", "Nenhuma observação")]
    ]
    
    table_logistica = Table(info_logistica, colWidths=[4*cm, 13*cm])
    table_logistica.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(table_logistica)
    elements.append(Spacer(1, 1.5*cm))
    
    # Conformidade PNAE
    elements.append(Paragraph("<b>Declaração de Conformidade PNAE</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.3*cm))
    
    texto_conformidade = f"""
    Esta compra está em conformidade com a Lei nº 11.947/2009, que determina que no mínimo 30% 
    dos recursos destinados à alimentação escolar sejam aplicados na aquisição de produtos da 
    agricultura familiar.<br/><br/>
    <b>Produtor Certificado:</b> {'SIM - ' + produtor.get('numero_dap', '') if produtor.get('possui_dap') else 'Não possui DAP/CAF'}<br/>
    <b>Certificações:</b> {', '.join(produtor.get('certificacoes', ['Nenhuma']))}<br/>
    """
    
    elements.append(Paragraph(texto_conformidade, styles['BodyText']))
    elements.append(Spacer(1, 2*cm))
    
    # Assinaturas
    assinaturas = [
        ["_______________________________", "_______________________________"],
        ["Diretor(a) da Escola", "Produtor(a) Rural"],
        [escola.get("contato", {}).get("diretor", ""), produtor.get("nome", "")]
    ]
    
    table_ass = Table(assinaturas, colWidths=[8*cm, 8*cm])
    table_ass.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
        ('TOPPADDING', (0, 1), (-1, 1), 10),
    ]))
    elements.append(table_ass)
    
    # Rodapé
    elements.append(Spacer(1, 1*cm))
    rodape = Paragraph(
        f"<i>Documento gerado automaticamente em {datetime.now().strftime('%d/%m/%Y às %H:%M')} - Conecta Merenda</i>",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.grey, alignment=TA_CENTER)
    )
    elements.append(rodape)
    
    # Gerar PDF
    doc.build(elements)
    
    # Retornar bytes
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes


def salvar_pdf(pdf_bytes: bytes, filename: str, output_dir: str = "relatorios") -> str:
    """
    Salva PDF em disco.
    
    Args:
        pdf_bytes: Bytes do PDF
        filename: Nome do arquivo
        output_dir: Diretório de saída
    
    Returns:
        Caminho completo do arquivo salvo
    """
    # Criar diretório se não existir
    os.makedirs(output_dir, exist_ok=True)
    
    # Caminho completo
    filepath = os.path.join(output_dir, filename)
    
    # Salvar arquivo
    with open(filepath, 'wb') as f:
        f.write(pdf_bytes)
    
    return filepath
