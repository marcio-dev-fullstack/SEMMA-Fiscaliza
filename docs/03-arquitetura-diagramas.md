# 03 - Arquitetura e Diagramas

## Diagrama de Arquitetura
[Front (GitHub Pages/CDN)] <---> [API REST - Node.js/Python (Docker)] <---> [PostgreSQL/PostGIS]

## Stack Tecnológica Definitiva
- Front: React + Vite + Leaflet (Mapas) + TailwindCSS.
- Back: FastAPI (Python) para alta performance de geoprocessamento.
- Banco: PostgreSQL com extensão PostGIS (indispensável para dados geográficos).
- Infra: Docker Compose para orquestração local; GitHub Actions para CI/CD do front.