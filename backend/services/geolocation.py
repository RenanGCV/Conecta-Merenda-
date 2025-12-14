"""
Serviço de geolocalização e matching de produtores.
Calcula distâncias e scores de compatibilidade.
"""
import math
from typing import List, Tuple
from decimal import Decimal


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calcula a distância entre duas coordenadas geográficas usando a fórmula de Haversine.
    
    Args:
        lat1, lon1: Latitude e longitude do ponto 1 (em graus)
        lat2, lon2: Latitude e longitude do ponto 2 (em graus)
    
    Returns:
        Distância em quilômetros
    
    A fórmula de Haversine é ideal para calcular distâncias curtas na superfície
    esférica da Terra, sendo muito precisa para distâncias até 500km.
    """
    # Raio médio da Terra em km
    R = 6371.0
    
    # Converter graus para radianos
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Diferenças
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Fórmula de Haversine
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    
    return round(distance, 2)


def calcular_score_match(distancia_km: float, nota_media: float) -> float:
    """
    Calcula o score de compatibilidade entre escola e produtor.
    
    Fórmula: Score = (0.6 / distância) + (0.4 * nota_media)
    - 60% peso para proximidade (quanto mais perto, melhor)
    - 40% peso para qualidade (avaliação)
    
    Args:
        distancia_km: Distância em km entre escola e produtor
        nota_media: Avaliação média do produtor (0-5)
    
    Returns:
        Score de match (quanto maior, melhor a compatibilidade)
    """
    if distancia_km <= 0:
        distancia_km = 0.1  # Evitar divisão por zero
    
    # Normalizar nota para escala 0-1
    nota_normalizada = nota_media / 5.0
    
    # Componente de proximidade (inverso da distância)
    proximidade_score = 0.6 / distancia_km
    
    # Componente de qualidade
    qualidade_score = 0.4 * nota_normalizada
    
    score_total = proximidade_score + qualidade_score
    
    return round(score_total, 4)


def calcular_desconto_proximidade(distancia_km: float, max_distancia: int = 50) -> float:
    """
    Calcula desconto baseado na proximidade.
    
    Regra de negócio: Produtores mais próximos economizam em logística,
    então podem oferecer desconto.
    
    Fórmula: Se distância < max_distancia km:
             desconto = (max_distancia - distância) / 2
             Máximo de 20% de desconto
    
    Args:
        distancia_km: Distância em km
        max_distancia: Distância máxima para desconto (padrão 50km)
    
    Returns:
        Percentual de desconto (0-20%)
    """
    if distancia_km >= max_distancia:
        return 0.0
    
    desconto = (max_distancia - distancia_km) / 2
    
    # Limitar a 20% máximo
    desconto = min(desconto, 20.0)
    
    return round(desconto, 2)


def aplicar_desconto_preco(preco_original: Decimal, desconto_percentual: float) -> Decimal:
    """
    Aplica desconto ao preço original.
    
    Args:
        preco_original: Preço base do produto
        desconto_percentual: Desconto em percentual (ex: 15.5 para 15.5%)
    
    Returns:
        Preço com desconto aplicado
    """
    if desconto_percentual <= 0:
        return preco_original
    
    fator_desconto = Decimal(1 - (desconto_percentual / 100))
    preco_com_desconto = preco_original * fator_desconto
    
    # Arredondar para 2 casas decimais
    return preco_com_desconto.quantize(Decimal('0.01'))


def ordenar_produtores_por_match(
    produtores: List[dict],
    escola_lat: float,
    escola_lon: float
) -> List[dict]:
    """
    Ordena lista de produtores por score de match.
    Adiciona campos calculados: distancia_km, score_match, desconto_proximidade.
    
    Args:
        produtores: Lista de dicionários com dados dos produtores
        escola_lat: Latitude da escola
        escola_lon: Longitude da escola
    
    Returns:
        Lista ordenada por score (melhor match primeiro)
    """
    for produtor in produtores:
        # Calcular distância
        prod_lat = produtor["localizacao"]["latitude"]
        prod_lon = produtor["localizacao"]["longitude"]
        distancia = haversine_distance(escola_lat, escola_lon, prod_lat, prod_lon)
        
        # Calcular score
        score = calcular_score_match(distancia, produtor["avaliacao_media"])
        
        # Calcular desconto
        desconto = calcular_desconto_proximidade(distancia)
        
        # Adicionar campos calculados
        produtor["distancia_km"] = distancia
        produtor["score_match"] = score
        produtor["desconto_proximidade"] = desconto
        
        # Aplicar desconto aos produtos
        if desconto > 0:
            for produto in produtor.get("produtos", []):
                preco_original = Decimal(str(produto["preco_unitario"]))
                produto["preco_com_desconto"] = float(aplicar_desconto_preco(preco_original, desconto))
    
    # Ordenar por score (maior primeiro)
    produtores_ordenados = sorted(produtores, key=lambda x: x["score_match"], reverse=True)
    
    return produtores_ordenados


def filtrar_por_raio(
    produtores: List[dict],
    escola_lat: float,
    escola_lon: float,
    raio_km: int
) -> List[dict]:
    """
    Filtra produtores dentro de um raio específico.
    
    Args:
        produtores: Lista de produtores
        escola_lat: Latitude da escola
        escola_lon: Longitude da escola
        raio_km: Raio máximo de busca
    
    Returns:
        Lista filtrada de produtores dentro do raio
    """
    produtores_filtrados = []
    
    for produtor in produtores:
        prod_lat = produtor["localizacao"]["latitude"]
        prod_lon = produtor["localizacao"]["longitude"]
        distancia = haversine_distance(escola_lat, escola_lon, prod_lat, prod_lon)
        
        if distancia <= raio_km:
            produtor["distancia_km"] = distancia
            produtores_filtrados.append(produtor)
    
    return produtores_filtrados
