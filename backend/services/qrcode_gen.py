"""
Serviço de geração de QR Codes.
Cria QR Codes para rastreabilidade de produtos e pedidos.
"""
import qrcode
import io
import base64
import json
from typing import Dict
from datetime import datetime


def gerar_qrcode_pedido(pedido_id: str, produtor_info: Dict, escola_info: Dict) -> str:
    """
    Gera QR Code para rastreabilidade de um pedido.
    
    Args:
        pedido_id: ID único do pedido
        produtor_info: Informações do produtor
        escola_info: Informações da escola
    
    Returns:
        String base64 da imagem do QR Code
    """
    # Preparar dados para o QR Code
    dados_rastreio = {
        "pedido_id": pedido_id,
        "produtor": {
            "nome": produtor_info.get("nome"),
            "propriedade": produtor_info.get("nome_propriedade"),
            "dap": produtor_info.get("numero_dap"),
            "certificacoes": produtor_info.get("certificacoes", [])
        },
        "escola": {
            "nome": escola_info.get("nome"),
            "cidade": escola_info.get("localizacao", {}).get("cidade")
        },
        "data_geracao": datetime.utcnow().isoformat(),
        "url_rastreio": f"https://conectamerenda.com.br/rastreio/{pedido_id}"
    }
    
    # Converter para JSON
    dados_json = json.dumps(dados_rastreio, ensure_ascii=False)
    
    # Criar QR Code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(dados_json)
    qr.make(fit=True)
    
    # Gerar imagem
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Converter para base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    return img_base64


def gerar_qrcode_produtor(produtor_info: Dict) -> str:
    """
    Gera QR Code com informações do produtor.
    
    Args:
        produtor_info: Dicionário com dados do produtor
    
    Returns:
        String base64 da imagem do QR Code
    """
    # Preparar dados essenciais
    dados_produtor = {
        "id": produtor_info.get("id"),
        "nome": produtor_info.get("nome"),
        "propriedade": produtor_info.get("nome_propriedade"),
        "dap": produtor_info.get("numero_dap"),
        "avaliacao": produtor_info.get("avaliacao_media"),
        "certificacoes": produtor_info.get("certificacoes", []),
        "url_perfil": f"https://conectamerenda.com.br/produtor/{produtor_info.get('id')}"
    }
    
    dados_json = json.dumps(dados_produtor, ensure_ascii=False)
    
    # Criar e retornar QR Code
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(dados_json)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="#0B4F35", back_color="white")  # Cor da marca
    
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    return img_base64


def decodificar_qrcode(dados_qr: str) -> Dict:
    """
    Decodifica dados de um QR Code (para scan).
    
    Args:
        dados_qr: String JSON do QR Code
    
    Returns:
        Dicionário com os dados decodificados
    """
    try:
        return json.loads(dados_qr)
    except json.JSONDecodeError:
        return {"error": "QR Code inválido"}
