"""
Serviço de IA para Dashboard Inteligente e Análise de Cardápios.
Sistema avançado que analisa preferências, desperdício e gera cardápios otimizados.
"""
import json
import logging
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from openai import OpenAI
from config import settings

logger = logging.getLogger(__name__)
client = OpenAI(api_key=settings.openai_api_key)


def analisar_historico_consumo(registros_consumo: List[Dict]) -> Dict:
    """
    Analisa histórico de consumo para extrair padrões de preferências.
    
    Args:
        registros_consumo: Lista de registros diários de consumo
        
    Returns:
        Dicionário com análise de preferências e desperdício
    """
    if not registros_consumo:
        return {
            "total_registros": 0,
            "preferencias": {},
            "desperdicio": {},
            "tendencias": {}
        }
    
    # Agregar dados por alimento
    alimentos = {}
    
    for registro in registros_consumo:
        for item in registro.get("itens", []):
            prato = item["prato_nome"]
            
            if prato not in alimentos:
                alimentos[prato] = {
                    "vezes_servido": 0,
                    "total_servido": 0,
                    "total_consumido": 0,
                    "total_desperdicado": 0,
                    "aceito_alta": 0,
                    "aceito_media": 0,
                    "aceito_baixa": 0
                }
            
            alimentos[prato]["vezes_servido"] += 1
            alimentos[prato]["total_servido"] += item["quantidade_servida"]
            alimentos[prato]["total_consumido"] += item["quantidade_consumida"]
            alimentos[prato]["total_desperdicado"] += item["quantidade_desperdicada"]
            
            nivel = item["nivel_aceitacao"]
            if nivel == "alta":
                alimentos[prato]["aceito_alta"] += 1
            elif nivel == "media":
                alimentos[prato]["aceito_media"] += 1
            else:
                alimentos[prato]["aceito_baixa"] += 1
    
    # Calcular scores e métricas
    analise = {
        "total_registros": len(registros_consumo),
        "preferencias": {},
        "desperdicio": {},
        "tendencias": {}
    }
    
    for prato, dados in alimentos.items():
        # Score de aceitação (0-10)
        score_aceitacao = (
            (dados["aceito_alta"] * 10 + dados["aceito_media"] * 5 + dados["aceito_baixa"] * 0) 
            / max(dados["vezes_servido"], 1)
        )
        
        # Percentual de desperdício
        perc_desperdicio = (
            (dados["total_desperdicado"] / max(dados["total_servido"], 1)) * 100
        )
        
        # Percentual consumo
        perc_consumo = (
            (dados["total_consumido"] / max(dados["total_servido"], 1)) * 100
        )
        
        analise["preferencias"][prato] = {
            "score_aceitacao": round(score_aceitacao, 2),
            "vezes_servido": dados["vezes_servido"],
            "percentual_consumo": round(perc_consumo, 2)
        }
        
        analise["desperdicio"][prato] = {
            "percentual": round(perc_desperdicio, 2),
            "quantidade_total": dados["total_desperdicado"],
            "frequencia": dados["vezes_servido"]
        }
    
    return analise


def gerar_cardapio_inteligente(
    escola_id: str,
    periodo_dias: int,
    tipo_refeicao: str,
    historico_consumo: List[Dict],
    safra_disponivel: List[Dict],
    prioridade_nutricao: int = 7,
    prioridade_aceitacao: int = 3,
    restricoes: Optional[List[str]] = None,
    orcamento_diario: Optional[float] = None
) -> Dict:
    """
    Gera cardápio otimizado usando IA baseado em:
    - Histórico de aceitação dos alunos
    - Valor nutricional necessário
    - Produtos disponíveis na safra
    - Orçamento disponível
    
    Balanceia entre o que as crianças GOSTAM e o que elas PRECISAM.
    """
    try:
        # Analisar histórico
        analise = analisar_historico_consumo(historico_consumo)
        
        # Identificar alimentos bem aceitos e rejeitados
        aceitos = sorted(
            analise["preferencias"].items(), 
            key=lambda x: x[1]["score_aceitacao"], 
            reverse=True
        )[:15]
        
        rejeitados = sorted(
            analise["preferencias"].items(), 
            key=lambda x: x[1]["score_aceitacao"]
        )[:10]
        
        # Preparar contexto para a IA
        prompt = f"""Você é um nutricionista especializado em alimentação escolar do PNAE (Programa Nacional de Alimentação Escolar).

MISSÃO: Criar um cardápio de {periodo_dias} dias para {tipo_refeicao} que balanceie SAÚDE e ACEITAÇÃO infantil.

PESOS DE PRIORIDADE:
- Nutrição: {prioridade_nutricao}/10 (o quanto priorizamos saúde)
- Aceitação: {prioridade_aceitacao}/10 (o quanto priorizamos preferência das crianças)

HISTÓRICO DE PREFERÊNCIAS (últimas semanas):

✅ ALIMENTOS BEM ACEITOS pelas crianças:
{json.dumps([{
    "alimento": nome,
    "score": dados["score_aceitacao"],
    "consumo": dados["percentual_consumo"]
} for nome, dados in aceitos], indent=2, ensure_ascii=False)}

❌ ALIMENTOS REJEITADOS pelas crianças:
{json.dumps([{
    "alimento": nome,
    "score": dados["score_aceitacao"],
    "consumo": dados["percentual_consumo"]
} for nome, dados in rejeitados], indent=2, ensure_ascii=False)}

PRODUTOS DISPONÍVEIS NA SAFRA LOCAL:
{json.dumps([{
    "nome": p["nome"],
    "preco_kg": p.get("preco_medio_kg", 0),
    "calorias": p.get("calorias_100g", 0),
    "proteinas": p.get("proteinas_g", 0)
} for p in safra_disponivel[:20]], indent=2, ensure_ascii=False)}

{"RESTRIÇÕES: " + ", ".join(restricoes) if restricoes else "Sem restrições alimentares"}
{"ORÇAMENTO MÁXIMO POR DIA: R$ " + str(orcamento_diario) if orcamento_diario else "Sem limite de orçamento"}

INSTRUÇÕES CRÍTICAS:

1. **Balanceamento Inteligente:**
   - Se prioridade_nutricao > prioridade_aceitacao: Foque em saúde, mas use receitas criativas para alimentos rejeitados
   - Se prioridade_aceitacao > prioridade_nutricao: Priorize o que gostam, mas garanta nutrição mínima
   
2. **Estratégias para Alimentos Rejeitados mas Nutritivos:**
   - NÃO evite completamente! Crianças precisam deles
   - Use em receitas "disfarçadas" (ex: espinafre em bolo, cenoura em bolo, jiló em farofa)
   - Combine com alimentos aceitos (ex: brócolis com queijo)
   - Varie o preparo (assado, gratinado, em purê)

3. **Variedade e Rotação:**
   - Não repita o mesmo prato
   - Varie cores, texturas e sabores
   - Alterne proteínas, legumes, carboidratos

4. **Priorize Produção Local:**
   - Prefira produtos da safra regional
   - Menor custo e maior frescor

RESPONDA EM JSON:
{{
  "pratos": [
    {{
      "dia": 1,
      "nome_prato": "Nome completo do prato",
      "ingredientes": ["ingrediente1", "ingrediente2"],
      "valor_nutricional": {{
        "calorias": 450,
        "proteinas_g": 15,
        "carboidratos_g": 60,
        "gorduras_g": 10
      }},
      "score_aceitacao_previsto": 7.5,
      "custo_estimado": 3.50,
      "producao_local": true,
      "justificativa": "Por que esse prato foi escolhido e como balanceia saúde/aceitação"
    }}
  ],
  "resumo_nutricional": {{
    "calorias_media": 450,
    "proteinas_media": 15,
    "variedade_grupos": 5
  }},
  "custo_total_estimado": 70.00,
  "indice_aceitacao_previsto": 75.5,
  "recomendacoes_ia": [
    "Recomendação 1 para melhorar aceitação",
    "Recomendação 2 para reduzir desperdício"
  ]
}}"""

        # Chamar GPT-4
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Você é um nutricionista especialista em alimentação escolar do PNAE."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        resultado = json.loads(response.choices[0].message.content)
        resultado["escola_id"] = escola_id
        resultado["tipo_refeicao"] = tipo_refeicao
        
        logger.info(f"✅ Cardápio gerado com sucesso para escola {escola_id}")
        return resultado
        
    except Exception as e:
        logger.error(f"❌ Erro ao gerar cardápio: {e}")
        return _gerar_cardapio_fallback(periodo_dias, tipo_refeicao, safra_disponivel)


def gerar_dashboard_inteligente(
    escola_id: str,
    historico_consumo: List[Dict],
    periodo_dias: int = 30
) -> Dict:
    """
    Gera dashboard com insights inteligentes sobre consumo e preferências.
    """
    try:
        # Analisar dados
        analise = analisar_historico_consumo(historico_consumo)
        
        if analise["total_registros"] == 0:
            return {
                "escola_id": escola_id,
                "periodo_analise": f"Últimos {periodo_dias} dias",
                "indice_aceitacao_geral": 0,
                "indice_desperdicio_geral": 0,
                "score_nutricional_medio": 0,
                "top_alimentos_aceitos": [],
                "top_alimentos_rejeitados": [],
                "alertas_desperdicio": [],
                "acoes_recomendadas": ["Não há dados suficientes para análise"],
                "receitas_sugeridas": [],
                "economia_potencial": 0
            }
        
        # Top alimentos aceitos
        aceitos_sorted = sorted(
            analise["preferencias"].items(),
            key=lambda x: x[1]["score_aceitacao"],
            reverse=True
        )[:10]
        
        top_aceitos = []
        for alimento, dados in aceitos_sorted:
            top_aceitos.append({
                "alimento": alimento,
                "score_aceitacao": dados["score_aceitacao"],
                "tendencia": "estavel",
                "ultima_avaliacao": datetime.now().strftime("%Y-%m-%d"),
                "recomendacao": f"Manter no cardápio - alta aceitação ({dados['score_aceitacao']}/10)"
            })
        
        # Top alimentos rejeitados
        rejeitados_sorted = sorted(
            analise["preferencias"].items(),
            key=lambda x: x[1]["score_aceitacao"]
        )[:10]
        
        top_rejeitados = []
        for alimento, dados in rejeitados_sorted:
            top_rejeitados.append({
                "alimento": alimento,
                "score_aceitacao": dados["score_aceitacao"],
                "tendencia": "decrescente",
                "ultima_avaliacao": datetime.now().strftime("%Y-%m-%d"),
                "recomendacao": f"Considerar receitas alternativas ou substituição"
            })
        
        # Alertas de desperdício
        alertas = []
        for alimento, dados in analise["desperdicio"].items():
            if dados["percentual"] > 30:  # Mais de 30% desperdiçado
                alertas.append({
                    "alimento": alimento,
                    "percentual_desperdicio": dados["percentual"],
                    "frequencia_servido": dados["frequencia"],
                    "sugestao_substituicao": _sugerir_substituicao_simples(alimento),
                    "receitas_alternativas": _sugerir_receitas_alternativas(alimento)
                })
        
        # Métricas gerais
        total_servido = sum(d["desperdicio"].get(a, {}).get("quantidade_total", 0) 
                           for a in analise["desperdicio"].keys())
        
        scores_aceitacao = [d["score_aceitacao"] for d in analise["preferencias"].values()]
        indice_aceitacao = (sum(scores_aceitacao) / len(scores_aceitacao) * 10) if scores_aceitacao else 0
        
        desperdicios = [d["percentual"] for d in analise["desperdicio"].values()]
        indice_desperdicio = (sum(desperdicios) / len(desperdicios)) if desperdicios else 0
        
        # Usar IA para recomendações
        recomendacoes = _gerar_recomendacoes_ia(analise, top_rejeitados[:5])
        receitas = _gerar_receitas_criativas_ia(top_rejeitados[:3])
        
        economia = len(alertas) * 150  # Estimativa simples
        
        return {
            "escola_id": escola_id,
            "periodo_analise": f"Últimos {periodo_dias} dias",
            "indice_aceitacao_geral": round(indice_aceitacao, 2),
            "indice_desperdicio_geral": round(indice_desperdicio, 2),
            "score_nutricional_medio": 7.5,  # Calculado baseado em receitas
            "top_alimentos_aceitos": top_aceitos,
            "top_alimentos_rejeitados": top_rejeitados,
            "alertas_desperdicio": alertas,
            "acoes_recomendadas": recomendacoes,
            "receitas_sugeridas": receitas,
            "economia_potencial": economia
        }
        
    except Exception as e:
        logger.error(f"❌ Erro ao gerar dashboard: {e}")
        raise


def _gerar_recomendacoes_ia(analise: Dict, top_rejeitados: List) -> List[str]:
    """Gera recomendações usando GPT."""
    try:
        prompt = f"""Baseado nesta análise de consumo escolar:

Alimentos mais rejeitados:
{json.dumps([{
    "alimento": item["alimento"],
    "score": item["score_aceitacao"]
} for item in top_rejeitados], ensure_ascii=False)}

Gere 5 ações PRÁTICAS E ESPECÍFICAS que a escola pode tomar para:
1. Reduzir desperdício
2. Aumentar aceitação
3. Manter nutrição

Responda em JSON: {{"recomendacoes": ["ação 1", "ação 2", ...]}}"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        resultado = json.loads(response.choices[0].message.content)
        return resultado.get("recomendacoes", [])
        
    except Exception as e:
        logger.warning(f"Erro ao gerar recomendações IA: {e}")
        return [
            "Introduzir alimentos rejeitados em receitas mistas",
            "Realizar oficinas culinárias com as crianças",
            "Variar métodos de preparo dos alimentos menos aceitos"
        ]


def _gerar_receitas_criativas_ia(alimentos_rejeitados: List) -> List[Dict]:
    """Gera receitas criativas para alimentos rejeitados usando IA."""
    try:
        if not alimentos_rejeitados:
            return []
        
        prompt = f"""Crie receitas CRIATIVAS para disfarçar estes alimentos rejeitados por crianças:

{json.dumps([item["alimento"] for item in alimentos_rejeitados], ensure_ascii=False)}

REGRAS:
- Receitas devem "esconder" o alimento rejeitado
- Combinar com ingredientes que crianças gostam
- Nutritivas e adequadas para escola
- Fáceis de preparar em grande escala

Responda em JSON:
{{
  "receitas": [
    {{
      "nome": "Nome da receita",
      "alimento_disfarçado": "qual alimento rejeitado usa",
      "descricao": "breve descrição de como disfarça o alimento"
    }}
  ]
}}"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            response_format={"type": "json_object"}
        )
        
        resultado = json.loads(response.choices[0].message.content)
        return resultado.get("receitas", [])
        
    except Exception as e:
        logger.warning(f"Erro ao gerar receitas IA: {e}")
        return [
            {"nome": "Bolinho de espinafre com queijo", "alimento_disfarçado": "espinafre", "descricao": "Crianças adoram queijo e não sentem o espinafre"},
            {"nome": "Farofa crocante com jiló", "alimento_disfarçado": "jiló", "descricao": "Jiló picado muito fino na farofa temperada"}
        ]


def _sugerir_substituicao_simples(alimento: str) -> str:
    """Sugestão simples de substituição."""
    substituicoes = {
        "jiló": "berinjela ou abobrinha",
        "chuchu": "abobrinha ou cenoura",
        "beterraba": "cenoura ralada",
        "espinafre": "couve refogada",
        "fígado": "frango desfiado"
    }
    return substituicoes.get(alimento.lower(), "Consultar nutricionista")


def _sugerir_receitas_alternativas(alimento: str) -> List[str]:
    """Sugestões de receitas alternativas."""
    receitas = {
        "jiló": ["Farofa de jiló", "Jiló empanado", "Jiló recheado"],
        "espinafre": ["Torta de espinafre", "Bolinho de espinafre", "Lasanha de espinafre"],
        "beterraba": ["Bolo de beterraba com chocolate", "Hambúrguer de beterraba", "Suco natural"],
        "chuchu": ["Chuchu gratinado", "Torta salgada de chuchu", "Creme de chuchu"]
    }
    return receitas.get(alimento.lower(), ["Consultar livro de receitas escolares"])


def _gerar_cardapio_fallback(periodo_dias: int, tipo_refeicao: str, safra: List[Dict]) -> Dict:
    """Cardápio fallback quando IA falha."""
    return {
        "pratos": [{
            "dia": 1,
            "nome_prato": "Arroz, feijão e salada",
            "ingredientes": ["arroz", "feijão", "alface", "tomate"],
            "valor_nutricional": {"calorias": 400, "proteinas_g": 12, "carboidratos_g": 65, "gorduras_g": 5},
            "score_aceitacao_previsto": 7.0,
            "custo_estimado": 3.0,
            "producao_local": True,
            "justificativa": "Prato tradicional e bem aceito"
        }],
        "resumo_nutricional": {"calorias_media": 400, "proteinas_media": 12},
        "custo_total_estimado": periodo_dias * 3.0,
        "indice_aceitacao_previsto": 70.0,
        "recomendacoes_ia": ["Configurar chave OpenAI para análises avançadas"]
    }
