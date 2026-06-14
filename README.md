# 🌿 SEMMA Fiscaliza

<div align="center">
  <p><strong>Sistema Inteligente de Gestão e Autuação de Crimes Ambientais</strong></p>
  
  [![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![PostGIS](https://img.shields.io/badge/PostGIS-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgis.net/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
</div>

<br/>

## 📖 Sobre o Projeto

O **SEMMA Fiscaliza** foi desenvolvido sob medida para a Secretaria Municipal de Meio Ambiente da prefeitura de Conceição do Araguaia. O objetivo do sistema é digitalizar, agilizar e dar total transparência ao processo de autuação de infrações ambientais (como desmatamento, descarte irregular e poluição sonora), substituindo os antigos blocos de papel por uma solução moderna focada no agente de campo.

Construído através de uma arquitetura **Mobile-First**, a aplicação oferece alta densidade de informação e botões responsivos projetados para o uso ao ar livre sob a luz do sol, com captura de coordenadas de altíssima precisão.

---

## ✨ Principais Funcionalidades

- 📍 **Geolocalização Automática:** Integração com a API nativa do dispositivo para registrar denúncias nas coordenadas espaciais exatas usando `PostGIS` (Leaflet dinâmico).
- 📸 **Evidências Digitais:** Captura de fotos acionando diretamente a câmera do celular de forma nativa.
- 📊 **Dashboard em Tempo Real:** Painel gerencial e estatístico com animações ricas renderizando dados por Tipo de Crime e Status.
- 🖨️ **Geração de PDF:** Emissão de "Autos de Infração" através de folhas de impressão estilizadas com o logo e cabeçalho oficial da prefeitura.
- 🔐 **Controle de Acesso (RBAC):** Autenticação de segurança robusta baseada em tokens JWT separando privilégios de **Fiscal** e **Admin**.

---

## 🛠️ Tecnologias Utilizadas

### Front-end

- **React.js** + **Vite:** Interface de usuário ultrarrápida.
- **Tailwind CSS:** Estilização ágil e responsiva com micro-interações táteis.
- **React Leaflet:** Para renderização dos componentes cartográficos.
- **Lucide React:** Biblioteca de iconografia limpa e moderna.

### Back-end

- **FastAPI:** API construída em Python oferecendo processamento assíncrono extremamente veloz e documentação Swagger automática.
- **SQLAlchemy:** ORM em Python para operações em banco de dados de alto desempenho.
- **GeoAlchemy2:** Extensão espacial para mapeamento dinâmico de SRIDs e cálculos geométricos.
- **Passlib & Jose JWT:** Camada criptográfica de autenticação.

### Infraestrutura

- **PostGIS:** Motor relacional robusto com extensões espaciais para persistir as denúncias georreferenciadas.
- **Docker Compose:** Orquestração completa de contêineres simplificando o processo de deploy.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Git**
- **Docker Desktop** (se estiver no Windows/Mac) ou `docker` e `docker-compose` (Linux)
- **Node.js** (v18 ou superior)

### 1. Clonar o Repositório

```bash
git clone https://github.com/marcio-dev-fullstack/SEMMA-Fiscaliza.git
cd SEMMA-Fiscaliza
```

### 2. Iniciar a API e o Banco de Dados (Back-end)

A API e o banco espacial são inteiramente conteinerizados.

```bash
# Levanta os containers em segundo plano (-d) e constrói as imagens
docker-compose up -d --build

# Popule o banco de dados com o super-usuário (admin / admin123) e dados falsos iniciais
docker-compose exec api python seed.py
```

> A API FastAPI estará escutando e disponível em: `http://localhost:8000`
> A documentação automática da API (Swagger) pode ser acessada em: `http://localhost:8000/docs`

### 3. Iniciar a Interface (Front-end)

Abra um novo terminal na pasta raiz do projeto.

```bash
cd front

# Instalar as dependências do React
npm install

# Iniciar o servidor de desenvolvimento do Vite
npm run dev
```

> A aplicação React estará disponível em: `http://localhost:5173`

---

## 📱 Credenciais de Acesso (Seed)

Após rodar o script `seed.py`, utilize as seguintes credenciais na tela de login da aplicação para obter privilégios máximos de exclusão e visualização:

- **Usuário:** `admin`
- **Senha:** `admin123`

---

## 📄 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo para detalhes.

<hr>

<div align="center">
  <i>Desenvolvido com 💚 focado na preservação do meio ambiente.</i>
</div>
