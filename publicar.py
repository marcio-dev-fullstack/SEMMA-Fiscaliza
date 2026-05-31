import os
import subprocess
import sys
from datetime import datetime

def executar_comando(comando, diretorio=None):
    """Executa um comando de terminal e exibe a saída em tempo real."""
    print(f"\n🚀 Executando: {' '.join(comando)} (em: {diretorio if diretorio else 'raiz'})")
    try:
        resultado = subprocess.run(
            comando, 
            cwd=diretorio, 
            shell=True, 
            check=True,
            text=True
        )
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar o comando: {e}")
        return False

def publicar_projeto():
    # URL oficial do repositório remoto informado pelo usuário
    repo_url = "https://github.com/marcio-dev-fullstack/SEMMA-Fiscaliza.git"
    
    # Caminhos absolutos baseados no local do script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(base_dir, "frontend")
    
    print("====================================================")
    # Identidade corporativa de desenvolvimento do projeto
    print("      SISTEMA DE PUBLICAÇÃO AUTOMÁTICA - RAZGO      ")
    print("====================================================")

    # 1. Garantir o build atualizado do Frontend React
    if os.path.exists(frontend_dir):
        print("\n📦 Passo 1: Atualizando e Compilando o Frontend...")
        # Instala dependências e gera a pasta dist dentro de frontend/
        if not executar_comando(["npm", "install"], diretorio=frontend_dir):
            print("⚠️ Falha ao instalar dependências do npm. Tentando build direto...")
        
        # Correção da separação de argumentos do comando npm run build
        if not executar_comando(["npm", "run", "build"], diretorio=frontend_dir):
            print("❌ Falha crítica na compilação do Frontend. Abortando publicação.")
            sys.exit(1)
    else:
        print("⚠️ Diretório 'frontend' não localizado para build automático.")

    # 2. Configurações de sincronização do Git local com o GitHub remoto
    print("\n🔧 Passo 2: Sincronizando referências do Git...")
    executar_comando(["git", "init"])
    
    # Tenta definir a URL remota de origem correta do repositório do usuário
    try:
        subprocess.run(["git", "remote", "add", "origin", repo_url], shell=True, capture_output=True)
    except:
        pass  # Se a origem já existir, apenas ignora o erro
    
    # Garante que a URL remota está atualizada e apontando para o link correto
    executar_comando(["git", "remote", "set-url", "origin", repo_url])

    # 3. Empacotamento dos arquivos para commits
    print("\n📝 Passo 3: Adicionando modificações ao Stage do Git...")
    # Garante que pastas pesadas de desenvolvimento local fiquem de fora do push remoto
    executar_comando(["git", "rm", "-r", "--cached", "frontend/node_modules", "backend/venv"], diretorio=base_dir)
    executar_comando(["git", "add", "."])

    # 4. Geração do Commit de Entrega Técnica com carimbo de data/hora
    timestamp = datetime.now().strftime("%d/%m/%Y às %H:%M:%S")
    mensagem_commit = f"Release Fiscaliza Ambiental - Entrega Completa ({timestamp})"
    
    print(f"\n💾 Passo 4: Criando Commit de Produção...")
    executar_comando(["git", "commit", "-m", f'"{mensagem_commit}"'])

    # 5. Push final do repositório para a nuvem pública do GitHub
    print("\n🌐 Passo 5: Fazendo Upload de arquivos para o GitHub...")
    # Garante o uso do branch principal correto (main)
    executar_comando(["git", "branch", "-M", "main"])
    
    # Dispara o push forçado para garantir que a árvore remota se alinhe com a nova organização física de pastas
    if executar_comando(["git", "push", "-u", "origin", "main", "--force"]):
        print("\n====================================================")
        print("✨ PROJETO PUBLICADO COM SUCESSO NO GITHUB!")
        print(f"🔗 Link: {repo_url}")
        print("====================================================")
    else:
        print("\n❌ Erro ao enviar os arquivos para o GitHub. Verifique suas credenciais de acesso.")

if __name__ == "__main__":
    publicar_projeto()