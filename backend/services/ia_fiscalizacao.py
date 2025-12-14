"""
Serviço de IA para Fiscalização e Detecção de Fraudes.
Analisa notas fiscais automaticamente para identificar irregularidades.
"""
import json
import logging
from typing import List, Dict, Optional
from datetime import datetime
from openai import OpenAI
from config import settings

logger = logging.getLogger(__name__)
client = OpenAI(api_key=settings.openai_api_key)


# Base de conhecimento de preços médios (normalmente viria de um banco de dados)
PRECOS_REFERENCIA = {
    "arroz": {"min": 3.5, "medio": 4.8, "max": 6.5, "unidade": "kg"},
    "feijao": {"min": 5.0, "medio": 7.2, "max": 9.0, "unidade": "kg"},
    "carne_bovina": {"min": 18.0, "medio": 24.0, "max": 32.0, "unidade": "kg"},
    "frango": {"min": 8.0, "medio": 11.5, "max": 15.0, "unidade": "kg"},
    "tomate": {"min": 3.0, "medio": 5.5, "max": 8.0, "unidade": "kg"},
    "alface": {"min": 1.5, "medio": 2.5, "max": 4.0, "unidade": "unidade"},
    "banana": {"min": 2.5, "medio": 4.0, "max": 6.0, "unidade": "kg"},
    "leite": {"min": 3.0, "medio": 4.5, "max": 6.0, "unidade": "litro"},
    "oleo": {"min": 5.0, "medio": 7.0, "max": 9.0, "unidade": "litro"},
}


def analisar_nota_fiscal_ia(
    nota_fiscal: Dict,
    historico_escola: List[Dict] = None,
    fornecedores_irregulares: List[str] = None
) -> Dict:
    """
    Analisa nota fiscal usando IA para detectar possíveis irregularidades.
    
    Sistema de scoring:
    - 100-90: Totalmente conforme
    - 89-70: Pequenos desvios aceitáveis
    - 69-50: Atenção necessária
    - 49-30: Suspeito - investigar
    - 29-0: Altamente suspeito - bloquear
    
    Args:
        nota_fiscal: Dados da nota fiscal
        historico_escola: Histórico de compras da escola
        fornecedores_irregulares: Lista de CNPJs com problemas
    
    Returns:
        Análise completa com score, alertas e recomendações
    """
    try:
        alertas = []
        score = 100.0
        detalhes_analise = {}
        
        # 1. Análise de Preços
        analise_preco = _analisar_precos_itens(nota_fiscal.get("itens", []))
        if analise_preco["tem_desvio"]:
            alertas.extend(analise_preco["alertas"])
            score -= analise_preco["penalizacao"]
        detalhes_analise["precos"] = analise_preco
        
        # 2. Análise de Fornecedor
        analise_fornecedor = _analisar_fornecedor(
            nota_fiscal.get("fornecedor_cnpj"),
            nota_fiscal.get("fornecedor_nome"),
            fornecedores_irregulares or []
        )
        if analise_fornecedor["tem_problema"]:
            alertas.extend(analise_fornecedor["alertas"])
            score -= analise_fornecedor["penalizacao"]
        detalhes_analise["fornecedor"] = analise_fornecedor
        
        # 3. Análise de Compatibilidade PNAE
        analise_compatibilidade = _analisar_compatibilidade_pnae(nota_fiscal)
        if analise_compatibilidade["tem_incompatibilidade"]:
            alertas.extend(analise_compatibilidade["alertas"])
            score -= analise_compatibilidade["penalizacao"]
        detalhes_analise["compatibilidade"] = analise_compatibilidade
        
        # 4. Análise de Volume (se houver histórico)
        if historico_escola:
            analise_volume = _analisar_volume_suspeito(nota_fiscal, historico_escola)
            if analise_volume["suspeito"]:
                alertas.extend(analise_volume["alertas"])
                score -= analise_volume["penalizacao"]
            detalhes_analise["volume"] = analise_volume
        
        # 5. IA Avançada (GPT-4) para análise contextual
        analise_ia = _analise_contextual_gpt(nota_fiscal, alertas, score)
        
        # Classificar risco
        score = max(0, min(100, score))  # Garantir 0-100
        
        if score >= 90:
            risco = "baixo"
        elif score >= 70:
            risco = "medio"
        elif score >= 50:
            risco = "alto"
        else:
            risco = "critico"
        
        requer_investigacao = score < 70 or any(a["severidade"] in ["alta", "critica"] for a in alertas)
        
        return {
            "nota_fiscal_id": nota_fiscal.get("id", "TEMP"),
            "escola_id": nota_fiscal.get("escola_id"),
            "conformidade_score": round(score, 2),
            "risco_fraude": risco,
            "alertas": alertas,
            "analise_preco": detalhes_analise.get("precos", {}),
            "analise_fornecedor": detalhes_analise.get("fornecedor", {}),
            "analise_compatibilidade": detalhes_analise.get("compatibilidade", {}),
            "justificativa_ia": analise_ia.get("justificativa", "Análise automática concluída"),
            "requer_investigacao": requer_investigacao,
            "data_analise": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Erro na análise de nota fiscal: {e}")
        return {
            "nota_fiscal_id": nota_fiscal.get("id", "TEMP"),
            "escola_id": nota_fiscal.get("escola_id"),
            "conformidade_score": 50.0,
            "risco_fraude": "medio",
            "alertas": [{
                "tipo": "erro_analise",
                "severidade": "media",
                "descricao": "Erro ao processar análise automática",
                "detalhes": {"erro": str(e)},
                "recomendacao": "Revisar manualmente"
            }],
            "analise_preco": {},
            "analise_fornecedor": {},
            "analise_compatibilidade": {},
            "justificativa_ia": "Erro na análise automática - requer revisão manual",
            "requer_investigacao": True
        }


def _analisar_precos_itens(itens: List[Dict]) -> Dict:
    """Analisa se os preços estão dentro da faixa esperada."""
    alertas = []
    penalizacao = 0
    itens_suspeitos = []
    
    for item in itens:
        produto = item.get("produto_nome", "").lower()
        preco_pago = item.get("preco_unitario", 0)
        
        # Buscar referência (busca aproximada)
        referencia = None
        for key in PRECOS_REFERENCIA.keys():
            if key in produto:
                referencia = PRECOS_REFERENCIA[key]
                break
        
        if referencia:
            preco_max = referencia["max"]
            preco_medio = referencia["medio"]
            
            # Calcular desvio percentual
            desvio_percentual = ((preco_pago - preco_medio) / preco_medio) * 100
            
            if preco_pago > preco_max * 1.5:  # 50% acima do máximo
                alertas.append({
                    "tipo": "preco_inflacionado",
                    "severidade": "critica",
                    "descricao": f"Preço muito acima do mercado: {item['produto_nome']}",
                    "detalhes": {
                        "produto": item["produto_nome"],
                        "preco_pago": preco_pago,
                        "preco_medio_mercado": preco_medio,
                        "preco_maximo_aceitavel": preco_max,
                        "desvio_percentual": round(desvio_percentual, 2),
                        "valor_excedente": round((preco_pago - preco_max) * item.get("quantidade", 0), 2)
                    },
                    "recomendacao": "INVESTIGAR: Possível superfaturamento. Solicitar cotações de outros fornecedores."
                })
                penalizacao += 20
                itens_suspeitos.append(item["produto_nome"])
                
            elif preco_pago > preco_max * 1.2:  # 20% acima do máximo
                alertas.append({
                    "tipo": "preco_inflacionado",
                    "severidade": "alta",
                    "descricao": f"Preço elevado: {item['produto_nome']}",
                    "detalhes": {
                        "produto": item["produto_nome"],
                        "preco_pago": preco_pago,
                        "preco_medio_mercado": preco_medio,
                        "desvio_percentual": round(desvio_percentual, 2)
                    },
                    "recomendacao": "Verificar se há justificativa para o preço elevado."
                })
                penalizacao += 10
                itens_suspeitos.append(item["produto_nome"])
    
    return {
        "tem_desvio": len(alertas) > 0,
        "alertas": alertas,
        "penalizacao": min(penalizacao, 40),  # Máximo 40 pontos de penalização
        "itens_suspeitos": itens_suspeitos,
        "total_itens_analisados": len(itens)
    }


def _analisar_fornecedor(cnpj: str, nome: str, lista_irregular: List[str]) -> Dict:
    """Verifica se fornecedor está regular."""
    alertas = []
    penalizacao = 0
    
    # Verificar se está na lista de irregulares
    if cnpj in lista_irregular:
        alertas.append({
            "tipo": "fornecedor_irregular",
            "severidade": "critica",
            "descricao": f"Fornecedor com restrições: {nome}",
            "detalhes": {
                "cnpj": cnpj,
                "nome": nome,
                "motivo": "Consta em lista de fornecedores com irregularidades"
            },
            "recomendacao": "BLOQUEAR: Não comprar deste fornecedor até regularização."
        })
        penalizacao += 30
    
    # Validar formato CNPJ (básico)
    cnpj_numeros = ''.join(filter(str.isdigit, cnpj))
    if len(cnpj_numeros) != 14:
        alertas.append({
            "tipo": "fornecedor_irregular",
            "severidade": "alta",
            "descricao": "CNPJ inválido ou mal formatado",
            "detalhes": {"cnpj": cnpj},
            "recomendacao": "Verificar CNPJ na Receita Federal"
        })
        penalizacao += 15
    
    return {
        "tem_problema": len(alertas) > 0,
        "alertas": alertas,
        "penalizacao": penalizacao,
        "cnpj": cnpj,
        "nome": nome
    }


def _analisar_compatibilidade_pnae(nota_fiscal: Dict) -> Dict:
    """Verifica se produtos são compatíveis com PNAE."""
    alertas = []
    penalizacao = 0
    
    categoria = nota_fiscal.get("categoria_compra", "")
    itens = nota_fiscal.get("itens", [])
    
    # Produtos proibidos ou suspeitos no PNAE
    produtos_proibidos = [
        "refrigerante", "salgadinho", "doce industrializado", 
        "chocolate", "balas", "pirulito", "chips"
    ]
    
    # Equipamentos incompatíveis com merenda
    equipamentos_suspeitos = [
        "televisao", "computador", "celular", "tablet",
        "ar condicionado", "mobilia", "decoracao"
    ]
    
    for item in itens:
        produto = item.get("produto_nome", "").lower()
        
        # Verificar produtos proibidos
        for proibido in produtos_proibidos:
            if proibido in produto and categoria == "merenda":
                alertas.append({
                    "tipo": "produto_incompativel",
                    "severidade": "critica",
                    "descricao": f"Produto incompatível com PNAE: {item['produto_nome']}",
                    "detalhes": {
                        "produto": item["produto_nome"],
                        "motivo": "Produto não adequado para alimentação escolar saudável"
                    },
                    "recomendacao": "BLOQUEAR: PNAE não permite este tipo de produto."
                })
                penalizacao += 25
        
        # Verificar equipamentos na categoria errada
        for suspeito in equipamentos_suspeitos:
            if suspeito in produto and categoria == "merenda":
                alertas.append({
                    "tipo": "produto_incompativel",
                    "severidade": "alta",
                    "descricao": f"Produto não é alimento: {item['produto_nome']}",
                    "detalhes": {
                        "produto": item["produto_nome"],
                        "categoria_nota": categoria
                    },
                    "recomendacao": "Verificar se a categoria da nota está correta ou se há desvio."
                })
                penalizacao += 20
    
    return {
        "tem_incompatibilidade": len(alertas) > 0,
        "alertas": alertas,
        "penalizacao": min(penalizacao, 30),
        "categoria": categoria
    }


def _analisar_volume_suspeito(nota_fiscal: Dict, historico: List[Dict]) -> Dict:
    """Detecta volumes anormalmente altos ou baixos."""
    alertas = []
    penalizacao = 0
    
    valor_nota = nota_fiscal.get("valor_total", 0)
    
    # Calcular média histórica
    if historico:
        valores_historico = [h.get("valor_total", 0) for h in historico]
        media_historica = sum(valores_historico) / len(valores_historico)
        
        # Detectar desvios significativos
        if valor_nota > media_historica * 3:  # 3x a média
            alertas.append({
                "tipo": "volume_suspeito",
                "severidade": "alta",
                "descricao": "Valor da compra muito acima da média histórica",
                "detalhes": {
                    "valor_nota": valor_nota,
                    "media_historica": round(media_historica, 2),
                    "desvio_percentual": round(((valor_nota - media_historica) / media_historica) * 100, 2)
                },
                "recomendacao": "Verificar justificativa para volume atípico de compra."
            })
            penalizacao += 15
    
    return {
        "suspeito": len(alertas) > 0,
        "alertas": alertas,
        "penalizacao": penalizacao
    }


def _analise_contextual_gpt(nota_fiscal: Dict, alertas: List[Dict], score: float) -> Dict:
    """Usa GPT-4 para análise contextual mais sofisticada."""
    try:
        # Construir contexto para o GPT
        contexto = f"""Você é um auditor especialista em fiscalização de recursos públicos do PNAE.

Analise esta nota fiscal e forneça um parecer:

NOTA FISCAL:
- Escola: {nota_fiscal.get('escola_id')}
- Fornecedor: {nota_fiscal.get('fornecedor_nome')}
- Valor Total: R$ {nota_fiscal.get('valor_total')}
- Categoria: {nota_fiscal.get('categoria_compra')}
- Quantidade de Itens: {len(nota_fiscal.get('itens', []))}

ALERTAS DETECTADOS AUTOMATICAMENTE:
{json.dumps([{
    "tipo": a.get("tipo"),
    "severidade": a.get("severidade"),
    "descricao": a.get("descricao")
} for a in alertas], ensure_ascii=False, indent=2)}

SCORE ATUAL: {score}/100

Forneça uma justificativa profissional em JSON:
{{
  "justificativa": "Explicação técnica da análise",
  "pontos_atencao": ["ponto 1", "ponto 2"],
  "recomendacao_final": "O que fazer"
}}"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": contexto}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        logger.warning(f"Erro na análise GPT: {e}")
        return {
            "justificativa": f"Análise automática detectou {len(alertas)} alertas. Score de conformidade: {score}/100.",
            "pontos_atencao": ["Revisar manualmente"],
            "recomendacao_final": "Análise contextual indisponível"
        }


def gerar_dashboard_fiscalizacao_governo(periodo_dias: int = 30) -> Dict:
    """
    Gera dashboard de fiscalização para o governo.
    IMPORTANTE: Nunca expor para diretoras!
    """
    # TODO: Implementar com dados reais do banco
    # Por enquanto, retorna estrutura mockada
    
    return {
        "periodo_analise": f"Últimos {periodo_dias} dias",
        "total_escolas_monitoradas": 15,
        "total_notas_analisadas": 87,
        "valor_total_fiscalizado": 456780.50,
        "escolas_com_alertas": 4,
        "total_alertas_ativos": 12,
        "distribuicao_severidade": {
            "baixa": 3,
            "media": 5,
            "alta": 3,
            "critica": 1
        },
        "escolas_alto_risco": [
            {
                "escola_id": "ESC003",
                "escola_nome": "E.M. Santos Dumont",
                "score_conformidade": 45.5,
                "total_alertas": 5,
                "valor_suspeito": 12450.00,
                "motivo_principal": "Preços muito acima da média de mercado"
            },
            {
                "escola_id": "ESC007",
                "escola_nome": "E.M. Monteiro Lobato",
                "score_conformidade": 52.3,
                "total_alertas": 3,
                "valor_suspeito": 8900.00,
                "motivo_principal": "Fornecedor com histórico de irregularidades"
            }
        ],
        "fornecedores_suspeitos": [
            {
                "fornecedor": "Distribuidora XYZ Ltda",
                "cnpj": "12.345.678/0001-90",
                "total_vendas": 89450.00,
                "escolas_atendidas": 3,
                "score_medio": 58.2,
                "motivo": "Preços sistematicamente acima do mercado"
            }
        ],
        "produtos_preco_inflacionado": [
            {
                "produto": "Arroz tipo 1",
                "preco_medio_pago": 8.50,
                "preco_referencia": 4.80,
                "desvio": 77.1,
                "ocorrencias": 5
            }
        ],
        "score_conformidade_medio": 78.5,
        "percentual_notas_aprovadas": 75.0,
        "percentual_com_alertas": 18.0,
        "percentual_irregulares": 7.0,
        "tendencia_mes_atual": {
            "direcao": "melhorando",
            "variacao_percentual": 5.2
        },
        "economia_potencial_recuperacao": 35600.00
    }
