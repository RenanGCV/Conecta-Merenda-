"""
Inicialização do pacote services.
"""
from .geolocation import (
    haversine_distance,
    calcular_score_match,
    calcular_desconto_proximidade,
    ordenar_produtores_por_match,
    filtrar_por_raio
)
from .ia_cardapio import (
    gerar_sugestao_substituicao,
    analisar_feedback_cardapio
)
from .qrcode_gen import (
    gerar_qrcode_pedido,
    gerar_qrcode_produtor,
    decodificar_qrcode
)
from .pdf_reports import (
    gerar_relatorio_compra_pdf,
    salvar_pdf
)

__all__ = [
    # Geolocalização
    "haversine_distance",
    "calcular_score_match",
    "calcular_desconto_proximidade",
    "ordenar_produtores_por_match",
    "filtrar_por_raio",
    
    # IA Cardápio
    "gerar_sugestao_substituicao",
    "analisar_feedback_cardapio",
    
    # QR Code
    "gerar_qrcode_pedido",
    "gerar_qrcode_produtor",
    "decodificar_qrcode",
    
    # PDF Reports
    "gerar_relatorio_compra_pdf",
    "salvar_pdf",
]
