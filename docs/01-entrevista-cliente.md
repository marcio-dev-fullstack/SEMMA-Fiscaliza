# 01-entrevista-cliente.md

## 1. Script de Entrevista
1. Qual é o volume mensal de denúncias ambientais recebidas atualmente?
2. Existe algum sistema legado ou é tudo feito manualmente?
3. Quais são os três principais tipos de crimes ambientais fiscalizados (desmatamento, poluição sonora, etc)?
4. O fiscal precisa acessar o sistema offline em áreas rurais?
5. Quais dados são obrigatórios na autuação (fotos, coordenadas, dados do infrator)?
6. Existe integração com o Ministério Público ou outros órgãos?
7. Qual o prazo máximo para o atendimento de uma denúncia?
8. O design deve seguir algum padrão institucional (Cores/Logos da Prefeitura)?
9. Como é feito o acompanhamento das multas após a autuação?
10. O sistema precisa gerar relatórios mensais para a gestão municipal?

## 2. Checklist de Viabilidade
- **Tecnológica**: GitHub Pages suporta perfeitamente o front-end. API em Python (FastAPI) no servidor local é ideal para gerenciar o banco de dados.
- **Financeira**: Custo zero de hospedagem (Front) e baixo custo de infraestrutura local (Back).
- **Temporal**: O MVP é viável em 4 a 6 semanas com foco em CRUD e Dashboard.
- **Escalabilidade**: Arquitetura desacoplada permite adicionar novos módulos de licenciamento futuramente.

## 3. Parecer Final
**Viável**. O projeto atende às necessidades de fiscalização da SEMMA, garantindo modernização e transparência.