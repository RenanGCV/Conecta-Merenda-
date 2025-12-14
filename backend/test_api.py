"""
Script de testes rápidos da API.
Verifica se os principais endpoints estão funcionando.
"""
import requests
import json
from typing import Dict

BASE_URL = "http://localhost:8000"

def print_resultado(nome_teste: str, sucesso: bool, detalhes: str = ""):
    """Imprime resultado do teste."""
    status = "✅" if sucesso else "❌"
    print(f"{status} {nome_teste}")
    if detalhes:
        print(f"   {detalhes}")


def testar_health():
    """Testa endpoint de health check."""
    try:
        response = requests.get(f"{BASE_URL}/health")
        sucesso = response.status_code == 200
        print_resultado("Health Check", sucesso, f"Status: {response.status_code}")
        return sucesso
    except Exception as e:
        print_resultado("Health Check", False, f"Erro: {str(e)}")
        return False


def testar_login() -> Dict:
    """Testa login e retorna token."""
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={
                "email": "escola@email.com",
                "senha": "escola123"
            }
        )
        sucesso = response.status_code == 200
        
        if sucesso:
            data = response.json()
            token = data.get("access_token")
            print_resultado("Login", True, f"Token obtido: {token[:20]}...")
            return {"sucesso": True, "token": token}
        else:
            print_resultado("Login", False, f"Status: {response.status_code}")
            return {"sucesso": False}
            
    except Exception as e:
        print_resultado("Login", False, f"Erro: {str(e)}")
        return {"sucesso": False}


def testar_listar_produtores(token: str):
    """Testa listagem de produtores."""
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/agricultores/",
            headers={"Authorization": f"Bearer {token}"}
        )
        sucesso = response.status_code == 200
        
        if sucesso:
            produtores = response.json()
            print_resultado("Listar Produtores", True, f"Total: {len(produtores)} produtores")
        else:
            print_resultado("Listar Produtores", False, f"Status: {response.status_code}")
            
        return sucesso
    except Exception as e:
        print_resultado("Listar Produtores", False, f"Erro: {str(e)}")
        return False


def testar_dashboard(token: str):
    """Testa dashboard financeiro."""
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/secretaria/dashboard-financeiro",
            headers={"Authorization": f"Bearer {token}"}
        )
        sucesso = response.status_code == 200
        
        if sucesso:
            data = response.json()
            print_resultado("Dashboard Financeiro", True, f"Gasto Total: R$ {data.get('gasto_total', 0)}")
        else:
            print_resultado("Dashboard Financeiro", False, f"Status: {response.status_code}")
            
        return sucesso
    except Exception as e:
        print_resultado("Dashboard Financeiro", False, f"Erro: {str(e)}")
        return False


def main():
    """Executa suite de testes."""
    print("🧪 Iniciando testes da API Conecta Merenda\n")
    print("="*50)
    
    # 1. Health Check
    if not testar_health():
        print("\n❌ Servidor não está respondendo. Execute: python start.py")
        return
    
    print()
    
    # 2. Login
    resultado_login = testar_login()
    if not resultado_login["sucesso"]:
        print("\n❌ Login falhou. Verifique configurações.")
        return
    
    token = resultado_login["token"]
    print()
    
    # 3. Testes com autenticação
    testar_listar_produtores(token)
    print()
    
    testar_dashboard(token)
    print()
    
    print("="*50)
    print("\n✅ Testes concluídos!")
    print(f"📚 Documentação completa: {BASE_URL}/docs")


if __name__ == "__main__":
    main()
