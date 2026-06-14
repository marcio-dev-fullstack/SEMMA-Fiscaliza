# Inicialização e deploy
git init && git add . && git commit -m "feat: initial commit fiscaliza-cda" && git branch -M main
# Script de deploy contínuo (one-liner)
git pull origin main && npm run build && docker-compose restart api