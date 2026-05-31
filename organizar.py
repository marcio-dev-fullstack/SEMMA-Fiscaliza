import os
import shutil

def organizar_projeto():
    # 1. Definir os caminhos das novas pastas
    backend_dir = "backend"
    frontend_dir = "frontend"
    
    # Criar os diretórios se não existirem
    os.makedirs(backend_dir, exist_ok=True)
    os.makedirs(frontend_dir, exist_ok=True)
    
    # 2. Listar o que vai para o FRONTEND (Ecossistema Node/Vite/React)
    itens_frontend = [
        "dist", "node_modules", "public", "src", 
        "eslint.config.js", "index.html", "package-lock.json", 
        "package.json", "tailwind.config.js", "vite.config.js"
    ]
    
    # 3. Listar o que vai para o BACKEND (Arquivos Python/API)
    itens_backend = [
        "main.py"
    ]
    
    print("🚚 Movendo arquivos do Frontend...")
    for item in itens_frontend:
        if os.path.exists(item):
            try:
                shutil.move(item, os.path.join(frontend_dir, item))
                print(print(f" [OK] {item} -> {frontend_dir}/"))
            except Exception as e:
                print(f" [ERRO] Não foi possível mover {item}: {e}")

    print("\n🐍 Movendo arquivos do Backend...")
    for item in itens_backend:
        if os.path.exists(item):
            try:
                shutil.move(item, os.path.join(backend_dir, item))
                print(f" [OK] {item} -> {backend_dir}/")
            except Exception as e:
                print(f" [ERRO] Não foi possível mover {item}: {e}")
                
    print("\n✨ Estrutura reorganizada com sucesso!")

if __name__ == "__main__":
    organizar_projeto()