# 02-analise-requisitos.md

## 1. Requisitos Funcionais (RF)
- RF001: [M] Sistema de login (Admin/Fiscal).
- RF002: [M] CRUD de Denúncias Ambientais.
- RF003: [M] Upload de evidências (fotos com metadados).
- RF004: [M] Registro de geolocalização automática.
- RF005: [M] Dashboard de status de denúncias.
- RF006: [S] Geração de PDF de auto de infração.
- RF007: [S] Filtros de busca por data, tipo e fiscal.
- RF008: [S] Histórico de alterações por fiscal (auditoria).
- RF009: [C] Notificação de progresso da denúncia.
- RF010: [C] Exportação de relatórios estatísticos (CSV/Excel).

## 2. Requisitos Não-Funcionais (RNF)
- **Performance**: Tempo de resposta de API inferior a 200ms.
- **Segurança**: Criptografia de dados sensíveis e autenticação via JWT.
- **Usabilidade**: Interface Mobile-First (essencial para fiscais em campo).
- **Disponibilidade**: 99.9% (considerando servidor local estável).

## 3. Matriz de Riscos
- Risco: Falha na API. Mitigação: Log de erros robusto e feedback visual para o usuário.
- Risco: Falha na Internet. Mitigação: Desenvolvimento com foco em LocalStorage (Offline-First).