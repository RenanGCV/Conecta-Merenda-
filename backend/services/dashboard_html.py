"""
Dashboard Visual HTML - Interface interativa sem necessidade de frontend.
Gera página HTML com gráficos usando Chart.js.
"""
import json
from typing import Dict
from pathlib import Path


def gerar_dashboard_html(escola_id: str = "ESC001") -> str:
    """
    Gera HTML completo com dashboard interativo.
    Inclui gráficos de aceitação, desperdício, ranking de alimentos.
    """
    
    # Carregar dados mockados
    DATA_DIR = Path(__file__).parent.parent / "data"
    
    try:
        with open(DATA_DIR / "preferencias_alunos.json", "r", encoding="utf-8") as f:
            prefs = json.load(f)
            alimentos = prefs.get("preferencias_alunos", [])[:10]
            
            # Se não encontrou, tenta direto na raiz
            if not alimentos:
                # Usar dados de exemplo
                alimentos = [
                    {"alimento": "Arroz com feijão", "score_aceitacao": 9.2, "percentual_consumo": 92},
                    {"alimento": "Frango grelhado", "score_aceitacao": 8.8, "percentual_consumo": 88},
                    {"alimento": "Batata frita", "score_aceitacao": 9.5, "percentual_consumo": 95},
                    {"alimento": "Macarrão", "score_aceitacao": 8.5, "percentual_consumo": 85},
                    {"alimento": "Banana", "score_aceitacao": 8.9, "percentual_consumo": 89},
                    {"alimento": "Melancia", "score_aceitacao": 9.3, "percentual_consumo": 93},
                    {"alimento": "Suco natural", "score_aceitacao": 9.0, "percentual_consumo": 90},
                    {"alimento": "Salada", "score_aceitacao": 6.5, "percentual_consumo": 60},
                    {"alimento": "Chuchu", "score_aceitacao": 4.2, "percentual_consumo": 42},
                    {"alimento": "Jiló", "score_aceitacao": 2.8, "percentual_consumo": 25}
                ]
    except Exception as e:
        # Dados de fallback
        alimentos = [
            {"alimento": "Arroz com feijão", "score_aceitacao": 9.2, "percentual_consumo": 92},
            {"alimento": "Frango grelhado", "score_aceitacao": 8.8, "percentual_consumo": 88},
            {"alimento": "Batata frita", "score_aceitacao": 9.5, "percentual_consumo": 95},
            {"alimento": "Macarrão", "score_aceitacao": 8.5, "percentual_consumo": 85},
            {"alimento": "Banana", "score_aceitacao": 8.9, "percentual_consumo": 89},
            {"alimento": "Melancia", "score_aceitacao": 9.3, "percentual_consumo": 93},
            {"alimento": "Suco natural", "score_aceitacao": 9.0, "percentual_consumo": 90},
            {"alimento": "Salada", "score_aceitacao": 6.5, "percentual_consumo": 60},
            {"alimento": "Chuchu", "score_aceitacao": 4.2, "percentual_consumo": 42},
            {"alimento": "Jiló", "score_aceitacao": 2.8, "percentual_consumo": 25}
        ]
    
    # Dados para gráficos
    nomes_alimentos = [a.get("alimento", "") for a in alimentos]
    scores_aceitacao = [a.get("score_aceitacao", 0) for a in alimentos]
    percentuais_consumo = [a.get("percentual_consumo", 0) for a in alimentos]
    
    html = f"""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🍎 Conecta Merenda - Dashboard Inteligente</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
        }}
        
        .header {{
            background: white;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }}
        
        .header h1 {{
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }}
        
        .header p {{
            color: #666;
            font-size: 1.1em;
        }}
        
        .metrics-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}
        
        .metric-card {{
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }}
        
        .metric-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }}
        
        .metric-card h3 {{
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }}
        
        .metric-value {{
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }}
        
        .metric-card.success .metric-value {{
            color: #10b981;
        }}
        
        .metric-card.warning .metric-value {{
            color: #f59e0b;
        }}
        
        .metric-card.danger .metric-value {{
            color: #ef4444;
        }}
        
        .metric-card.info .metric-value {{
            color: #3b82f6;
        }}
        
        .metric-subtitle {{
            color: #999;
            font-size: 0.9em;
        }}
        
        .charts-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}
        
        .chart-card {{
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        
        .chart-card h2 {{
            color: #333;
            margin-bottom: 20px;
            font-size: 1.3em;
        }}
        
        .recommendations {{
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        
        .recommendations h2 {{
            color: #333;
            margin-bottom: 20px;
            font-size: 1.5em;
        }}
        
        .recommendation-item {{
            background: #f8fafc;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
        }}
        
        .recommendation-item strong {{
            color: #667eea;
            display: block;
            margin-bottom: 5px;
        }}
        
        .badge {{
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            margin-top: 5px;
        }}
        
        .badge.success {{
            background: #d1fae5;
            color: #065f46;
        }}
        
        .badge.warning {{
            background: #fef3c7;
            color: #92400e;
        }}
        
        .badge.danger {{
            background: #fee2e2;
            color: #991b1b;
        }}
        
        .footer {{
            text-align: center;
            color: white;
            margin-top: 30px;
            padding: 20px;
        }}
        
        @media (max-width: 768px) {{
            .charts-grid {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🍎 Conecta Merenda</h1>
            <p>Dashboard Inteligente - Escola {escola_id} | Análise em Tempo Real</p>
        </div>
        
        <!-- Métricas Principais -->
        <div class="metrics-grid">
            <div class="metric-card success">
                <h3>📈 Índice de Aceitação</h3>
                <div class="metric-value">78.5%</div>
                <div class="metric-subtitle">↑ 12% vs mês anterior</div>
            </div>
            
            <div class="metric-card warning">
                <h3>🗑️ Taxa de Desperdício</h3>
                <div class="metric-value">18.2%</div>
                <div class="metric-subtitle">↓ 5% vs mês anterior</div>
            </div>
            
            <div class="metric-card info">
                <h3>🥗 Score Nutricional</h3>
                <div class="metric-value">8.3/10</div>
                <div class="metric-subtitle">Excelente qualidade</div>
            </div>
            
            <div class="metric-card success">
                <h3>💰 Economia Potencial</h3>
                <div class="metric-value">R$ 1.2k</div>
                <div class="metric-subtitle">Seguindo recomendações IA</div>
            </div>
        </div>
        
        <!-- Gráficos -->
        <div class="charts-grid">
            <!-- Gráfico de Aceitação -->
            <div class="chart-card">
                <h2>📊 Top 10 Alimentos - Score de Aceitação</h2>
                <canvas id="aceitacaoChart"></canvas>
            </div>
            
            <!-- Gráfico de Consumo -->
            <div class="chart-card">
                <h2>🍽️ Percentual de Consumo por Alimento</h2>
                <canvas id="consumoChart"></canvas>
            </div>
        </div>
        
        <!-- Gráfico de Pizza - Distribuição -->
        <div class="chart-card" style="margin-bottom: 30px;">
            <h2>🥧 Distribuição de Categorias Alimentares</h2>
            <div style="max-width: 500px; margin: 0 auto;">
                <canvas id="categoriaChart"></canvas>
            </div>
        </div>
        
        <!-- Recomendações da IA -->
        <div class="recommendations">
            <h2>🤖 Recomendações Inteligentes da IA</h2>
            
            <div class="recommendation-item">
                <strong>🎯 Alta Prioridade: Jiló</strong>
                <p>Alimento com 73% de desperdício mas rico em vitaminas. Sugestão: preparar em farofa bem temperada - o sabor amargo fica disfarçado.</p>
                <span class="badge danger">Alto Desperdício</span>
                <span class="badge success">Nutritivo</span>
            </div>
            
            <div class="recommendation-item">
                <strong>✨ Receita Criativa: Espinafre</strong>
                <p>Baixa aceitação (35%). Transformar em bolinho de espinafre com queijo - as crianças adoram queijo e não sentirão o gosto do espinafre.</p>
                <span class="badge warning">Baixa Aceitação</span>
                <span class="badge success">Receita Disponível</span>
            </div>
            
            <div class="recommendation-item">
                <strong>💡 Oportunidade: Beterraba</strong>
                <p>Usar em bolo de chocolate - a cor fica bonita (rosa) e o sabor do chocolate mascara completamente a beterraba. Score previsto: 9/10!</p>
                <span class="badge success">Alta Aceitação Esperada</span>
            </div>
            
            <div class="recommendation-item">
                <strong>📈 Manter no Cardápio: Arroz com Feijão</strong>
                <p>Aceitação de 92% - continuar servindo regularmente. Base perfeita para adicionar vegetais menos aceitos.</p>
                <span class="badge success">Alta Aceitação</span>
            </div>
            
            <div class="recommendation-item">
                <strong>🌱 Produção Local: Tomate</strong>
                <p>Produtor a 8km de distância oferece 15% de desconto. Economia estimada: R$ 230/mês mantendo qualidade.</p>
                <span class="badge success">Economia</span>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>💚 Sistema desenvolvido para otimizar a alimentação escolar do PNAE</p>
            <p style="margin-top: 10px; font-size: 0.9em;">Documentação completa: <a href="/docs" style="color: white; text-decoration: underline;">localhost:8000/docs</a></p>
        </div>
    </div>
    
    <script>
        // Dados dos gráficos
        const nomesAlimentos = {json.dumps(nomes_alimentos)};
        const scoresAceitacao = {json.dumps(scores_aceitacao)};
        const percentuaisConsumo = {json.dumps(percentuais_consumo)};
        
        // Cores
        const coresGradient = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(237, 100, 166, 0.8)',
            'rgba(255, 154, 158, 0.8)',
            'rgba(250, 208, 196, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(168, 85, 247, 0.8)'
        ];
        
        // Gráfico de Aceitação (Barra Horizontal)
        const ctxAceitacao = document.getElementById('aceitacaoChart').getContext('2d');
        new Chart(ctxAceitacao, {{
            type: 'bar',
            data: {{
                labels: nomesAlimentos,
                datasets: [{{
                    label: 'Score de Aceitação (0-10)',
                    data: scoresAceitacao,
                    backgroundColor: coresGradient,
                    borderColor: coresGradient.map(c => c.replace('0.8', '1')),
                    borderWidth: 2,
                    borderRadius: 5
                }}]
            }},
            options: {{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    legend: {{
                        display: false
                    }},
                    tooltip: {{
                        callbacks: {{
                            label: function(context) {{
                                return 'Aceitação: ' + context.parsed.x.toFixed(1) + '/10';
                            }}
                        }}
                    }}
                }},
                scales: {{
                    x: {{
                        beginAtZero: true,
                        max: 10,
                        grid: {{
                            color: 'rgba(0,0,0,0.05)'
                        }}
                    }},
                    y: {{
                        grid: {{
                            display: false
                        }}
                    }}
                }}
            }}
        }});
        
        // Gráfico de Consumo (Barra Vertical)
        const ctxConsumo = document.getElementById('consumoChart').getContext('2d');
        new Chart(ctxConsumo, {{
            type: 'bar',
            data: {{
                labels: nomesAlimentos,
                datasets: [{{
                    label: 'Percentual Consumido',
                    data: percentuaisConsumo,
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    borderRadius: 5
                }}]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    legend: {{
                        display: false
                    }},
                    tooltip: {{
                        callbacks: {{
                            label: function(context) {{
                                return 'Consumo: ' + context.parsed.y + '%';
                            }}
                        }}
                    }}
                }},
                scales: {{
                    y: {{
                        beginAtZero: true,
                        max: 100,
                        grid: {{
                            color: 'rgba(0,0,0,0.05)'
                        }},
                        ticks: {{
                            callback: function(value) {{
                                return value + '%';
                            }}
                        }}
                    }},
                    x: {{
                        grid: {{
                            display: false
                        }},
                        ticks: {{
                            maxRotation: 45,
                            minRotation: 45
                        }}
                    }}
                }}
            }}
        }});
        
        // Gráfico de Pizza - Categorias
        const ctxCategoria = document.getElementById('categoriaChart').getContext('2d');
        new Chart(ctxCategoria, {{
            type: 'doughnut',
            data: {{
                labels: ['Carboidratos', 'Proteínas', 'Hortaliças', 'Frutas', 'Bebidas'],
                datasets: [{{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 3
                }}]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {{
                    legend: {{
                        position: 'bottom',
                        labels: {{
                            padding: 20,
                            font: {{
                                size: 14
                            }}
                        }}
                    }},
                    tooltip: {{
                        callbacks: {{
                            label: function(context) {{
                                return context.label + ': ' + context.parsed + '%';
                            }}
                        }}
                    }}
                }}
            }}
        }});
        
        // Ajustar altura dos gráficos
        document.getElementById('aceitacaoChart').height = 400;
        document.getElementById('consumoChart').height = 400;
    </script>
</body>
</html>
"""
    return html
