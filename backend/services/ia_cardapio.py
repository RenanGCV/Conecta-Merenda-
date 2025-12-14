"""
Serviço de Inteligência Artificial para sugestões de cardápio.
Integração com OpenAI GPT para recomendações nutricionais inteligentes.
"""
import json
import logging
from typing import List, Dict, Optional
from openai import OpenAI
from config import settings

logger = logging.getLogger(__name__)

# Inicializar cliente OpenAI
client = OpenAI(api_key=settings.openai_api_key)


def gerar_sugestao_substituicao(
    produto_atual: str,
    motivo_troca: str,
    produtos_disponiveis: List[Dict],
    safra_regional: Dict,
    restricoes: Optional[List[str]] = None
) -> Dict:
    """
    Usa IA para sugerir substituição inteligente de alimentos no cardápio.
    
    Args:
        produto_atual: Produto que precisa ser substituído
        motivo_troca: Razão da substituição (ex: baixa aceitação, alto custo)
        produtos_disponiveis: Lista de produtos disponíveis na região
        safra_regional: Dados de safra com informações nutricionais
        restricoes: Lista de restrições alimentares (ex: sem glúten, vegetariano)
    
    Returns:
        Dicionário com sugestão, justificativa e dados nutricionais
    """
    try:
        # Preparar contexto nutricional
        info_nutricional = _extrair_info_nutricional(safra_regional)
        
        # Construir lista de produtos disponíveis formatada
        produtos_formatados = _formatar_produtos_disponiveis(produtos_disponiveis, safra_regional)
        
        # Construir prompt estruturado
        prompt = _construir_prompt_substituicao(
            produto_atual=produto_atual,
            motivo_troca=motivo_troca,
            produtos_disponiveis=produtos_formatados,
            info_nutricional=info_nutricional,
            restricoes=restricoes or []
        )
        
        logger.info(f"Gerando sugestão IA para substituir: {produto_atual}")
        
        # Chamar API OpenAI
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Você é um nutricionista especializado em alimentação escolar "
                        "e gestão do Programa Nacional de Alimentação Escolar (PNAE). "
                        "Sua missão é sugerir substituições inteligentes de alimentos "
                        "considerando nutrição, sazonalidade, custo e aceitação infantil. "
                        "Sempre priorize produtos da agricultura familiar local e da safra atual."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=800,
            response_format={"type": "json_object"}
        )
        
        # Parsear resposta
        resultado = json.loads(response.choices[0].message.content)
        
        logger.info(f"Sugestão gerada: {resultado.get('produto_sugerido')}")
        
        return resultado
        
    except Exception as e:
        logger.error(f"Erro ao gerar sugestão IA: {str(e)}", exc_info=True)
        
        # Fallback: sugestão básica sem IA
        return _gerar_sugestao_fallback(produto_atual, produtos_disponiveis)


def _construir_prompt_substituicao(
    produto_atual: str,
    motivo_troca: str,
    produtos_disponiveis: str,
    info_nutricional: str,
    restricoes: List[str]
) -> str:
    """Constrói prompt estruturado para a IA."""
    
    restricoes_texto = f"\n- Restrições: {', '.join(restricoes)}" if restricoes else ""
    
    prompt = f"""
Preciso substituir o alimento "{produto_atual}" no cardápio escolar.

**Contexto:**
- Motivo da troca: {motivo_troca}
- Região: Sudeste/São Paulo
- Mês atual: Dezembro (Verão){restricoes_texto}

**Produtos Disponíveis na Região (Agricultura Familiar Local):**
{produtos_disponiveis}

**Informações Nutricionais de Referência:**
{info_nutricional}

**Tarefa:**
Sugira o MELHOR alimento substituto considerando:
1. Valor nutricional similar ou superior
2. Preferência por produtos da safra (mais baratos e frescos)
3. Alta aceitação por crianças de 6-12 anos
4. Custo-benefício
5. Disponibilidade local (agricultura familiar)

**Formato de Resposta (JSON):**
{{
  "produto_sugerido": "Nome do produto",
  "categoria": "Frutas/Hortaliças/Tubérculos/Proteínas",
  "justificativa": "Explicação clara e objetiva do por que essa é a melhor escolha (máx 150 caracteres)",
  "beneficios_nutricionais": "Comparação nutricional com o produto original",
  "economia_estimada_percentual": 0.0,
  "aceitacao_infantil": "Alta/Média/Baixa",
  "em_safra": true/false,
  "forma_preparo_sugerida": "Sugestão breve de preparo"
}}
"""
    return prompt


def _extrair_info_nutricional(safra_regional: Dict) -> str:
    """Extrai e formata informações nutricionais da safra."""
    info_list = []
    
    # Pegar dados de dezembro
    dados_dezembro = safra_regional.get("dezembro_2024", {})
    produtos = dados_dezembro.get("produtos_safra", [])
    
    for produto in produtos[:10]:  # Limitar a 10 para não poluir o prompt
        nutricao = produto.get("nutricao", {})
        info = (
            f"- {produto['nome']}: "
            f"{nutricao.get('calorias_100g', 0)} kcal, "
            f"{nutricao.get('proteinas_g', 0)}g proteína, "
            f"Vitaminas: {', '.join(nutricao.get('vitaminas', [])[:3])}"
        )
        info_list.append(info)
    
    return "\n".join(info_list)


def _formatar_produtos_disponiveis(produtos_lista: List[Dict], safra_regional: Dict) -> str:
    """Formata lista de produtos disponíveis para o prompt."""
    
    # Criar mapa de produtos em safra
    dados_dezembro = safra_regional.get("dezembro_2024", {})
    produtos_safra = {p["nome"]: p for p in dados_dezembro.get("produtos_safra", [])}
    
    linhas = []
    for produtor in produtos_lista[:8]:  # Limitar quantidade
        for produto in produtor.get("produtos", []):
            nome = produto["nome"]
            em_safra = nome in produtos_safra
            safra_tag = " ⭐ [EM SAFRA]" if em_safra else ""
            
            linha = (
                f"- {nome} ({produto['categoria']}): "
                f"R$ {produto['preco_unitario']}/{produto['unidade']}"
                f"{safra_tag}"
            )
            linhas.append(linha)
    
    return "\n".join(linhas)


def _gerar_sugestao_fallback(produto_atual: str, produtos_disponiveis: List[Dict]) -> Dict:
    """
    Gera sugestão básica caso a IA falhe.
    Usa lógica simples de correspondência.
    """
    logger.warning("Usando sugestão fallback (IA não disponível)")
    
    # Mapeamento simples de substituições
    substituicoes_padrao = {
        "Uva": {"produto": "Morango", "economia": 25},
        "Tomate": {"produto": "Cenoura", "economia": 15},
        "Carne": {"produto": "Ovos Caipira", "economia": 30},
    }
    
    sugestao = substituicoes_padrao.get(
        produto_atual,
        {"produto": "Banana", "economia": 10}  # Default
    )
    
    return {
        "produto_sugerido": sugestao["produto"],
        "categoria": "Frutas",
        "justificativa": "Produto em safra com boa aceitação e custo reduzido",
        "beneficios_nutricionais": "Mantém valor nutricional similar",
        "economia_estimada_percentual": sugestao["economia"],
        "aceitacao_infantil": "Alta",
        "em_safra": True,
        "forma_preparo_sugerida": "Servir fresco ou em saladas"
    }


def analisar_feedback_cardapio(
    historico_feedbacks: List[Dict],
    cardapio_atual: List[str]
) -> Dict:
    """
    Analisa histórico de feedbacks e identifica padrões.
    
    Args:
        historico_feedbacks: Lista de feedbacks anteriores
        cardapio_atual: Lista de produtos no cardápio atual
    
    Returns:
        Análise com produtos problemáticos e recomendações
    """
    try:
        # Contar feedbacks negativos por produto
        contagem_negativa = {}
        for feedback in historico_feedbacks:
            if feedback.get("tipo_feedback") == "negativo":
                produto = feedback.get("produto_rejeitado")
                contagem_negativa[produto] = contagem_negativa.get(produto, 0) + 1
        
        # Identificar produtos problemáticos (>3 feedbacks negativos)
        produtos_problematicos = [
            produto for produto, count in contagem_negativa.items()
            if count >= 3
        ]
        
        return {
            "produtos_problematicos": produtos_problematicos,
            "total_feedbacks_analisados": len(historico_feedbacks),
            "requer_atencao": len(produtos_problematicos) > 0,
            "recomendacao": "Considere substituir produtos com alta rejeição" if produtos_problematicos else "Cardápio bem aceito"
        }
        
    except Exception as e:
        logger.error(f"Erro ao analisar feedbacks: {str(e)}")
        return {
            "produtos_problematicos": [],
            "total_feedbacks_analisados": 0,
            "requer_atencao": False,
            "recomendacao": "Erro na análise"
        }
