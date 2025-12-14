"""
Script de inicialização e verificação do ambiente.
Executa verificações antes de iniciar o servidor.
"""
import sys
import os
from pathlib import Path

def verificar_ambiente():
    """Verifica se o ambiente está configurado corretamente."""
    print("🔍 Verificando configuração do ambiente...\n")
    
    erros = []
    avisos = []
    
    # 1. Verificar Python version
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 10):
        erros.append(f"❌ Python 3.10+ necessário. Versão atual: {python_version.major}.{python_version.minor}")
    else:
        print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # 2. Verificar arquivo .env
    env_path = Path(__file__).parent.parent / ".env"
    if not env_path.exists():
        erros.append("❌ Arquivo .env não encontrado! Copie .env.example para .env")
    else:
        print("✅ Arquivo .env encontrado")
        
        # Verificar chave OpenAI
        with open(env_path, 'r') as f:
            env_content = f.read()
            if "sk-proj-exemplo" in env_content or "sua-chave-aqui" in env_content:
                avisos.append("⚠️  OPENAI_API_KEY parece ser um placeholder. Configure uma chave real.")
            else:
                print("✅ OPENAI_API_KEY configurada")
    
    # 3. Verificar dependências
    try:
        import fastapi
        import openai
        import pydantic
        print("✅ Dependências principais instaladas")
    except ImportError as e:
        erros.append(f"❌ Dependência faltando: {str(e)}")
        erros.append("   Execute: pip install -r requirements.txt")
    
    # 4. Verificar arquivos de dados
    data_dir = Path(__file__).parent / "data"
    required_files = [
        "produtores.json",
        "escolas.json",
        "safra_regional.json",
        "clima_previsao.json",
        "pedidos.json",
        "avaliacoes.json"
    ]
    
    missing_files = [f for f in required_files if not (data_dir / f).exists()]
    if missing_files:
        erros.append(f"❌ Arquivos de dados faltando: {', '.join(missing_files)}")
    else:
        print(f"✅ Arquivos de dados OK ({len(required_files)} arquivos)")
    
    # 5. Resumo
    print("\n" + "="*50)
    
    if erros:
        print("\n❌ ERROS ENCONTRADOS:")
        for erro in erros:
            print(f"   {erro}")
        print("\n🛑 Corrija os erros antes de continuar.\n")
        return False
    
    if avisos:
        print("\n⚠️  AVISOS:")
        for aviso in avisos:
            print(f"   {aviso}")
    
    print("\n✅ Ambiente configurado corretamente!")
    print("🚀 Iniciando servidor...\n")
    return True


if __name__ == "__main__":
    if verificar_ambiente():
        # Importar e executar app
        import uvicorn
        from config import settings
        
        uvicorn.run(
            "app:app",
            host=settings.api_host,
            port=settings.api_port,
            reload=settings.debug,
            log_level="info"
        )
    else:
        sys.exit(1)
