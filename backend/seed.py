import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from psycopg2.extras import RealDictCursor
from datetime import datetime
import sys

def garantir_banco_existe():
    """Conecta na base padrao do Postgres para criar o fiscaliza_db se necessario."""
    config_padrao = {
        "dbname": "postgres",
        "user": "postgres",
        "password": "mamst1ns",
        "host": "127.0.0.1",
        "port": "5432"
    }
    
    try:
        # Abre conexao temporaria na base padrao 'postgres'
        conn = psycopg2.connect(**config_padrao)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Verifica se o banco de dados do projeto ja existe
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'fiscaliza_db';")
        existe = cursor.fetchone()
        
        if not existe:
            print("🚀 Banco 'fiscaliza_db' nao encontrado. Criando base de dados...")
            cursor.execute("CREATE DATABASE fiscaliza_db;")
            print("✅ Banco 'fiscaliza_db' criado com sucesso!")
        else:
            print("🔍 Banco 'fiscaliza_db' ja existente no servidor.")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print("\n❌ ERRO CRÍTICO NO SERVIDOR POSTGRESQL:")
        print("----------------------------------------------------")
        print("Nao foi possivel estabelecer a conexao inicial.")
        print("Verifique se o servico do PostgreSQL esta em execucao (Servicos do Windows).")
        print("A senha padrao configurada coincide com as suas configuracoes locais?")
        print("----------------------------------------------------")
        sys.exit(1)

def popular_banco():
    print("====================================================")
    print("   MIGRAÇÃO E CARGA DE DADOS INICIAIS - RAZGO        ")
    print("====================================================")
    
    # Primeiro garante a existencia da base fisica
    garantir_banco_existe()
    
    # Parametros de conexao oficiais do sistema
    db_config = {
        "dbname": "fiscaliza_db",
        "user": "postgres",
        "password": "mamst1ns",
        "host": "127.0.0.1",
        "port": "5432"
    }
    
    print("\n🔌 Conectando ao banco de dados 'fiscaliza_db'...")
    try:
        conn = psycopg2.connect(**db_config, cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        print("✅ Conexao estruturada estabelecida!")
    except Exception as e:
        print(f"❌ Falha ao acessar a base 'fiscaliza_db': {e}")
        return

    try:
        # 1. CRIAÇÃO DAS TABELAS (Segurança Juridica e Integridade)
        print("\n🛠️ Criando tabelas estruturais...")
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS controle_sistema (
                id SERIAL PRIMARY KEY,
                data_instalacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                chave_ativacao VARCHAR(255),
                bloqueado BOOLEAN DEFAULT FALSE
            );
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                text_nome VARCHAR(255) NOT NULL,
                perfil VARCHAR(50) NOT NULL
            );
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS empresas (
                id SERIAL PRIMARY KEY,
                razao_social VARCHAR(255) NOT NULL,
                cnpj VARCHAR(20) UNIQUE NOT NULL
            );
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS licencas_ambientais (
                id SERIAL PRIMARY KEY,
                empresa_id INT REFERENCES empresas(id),
                tipo VARCHAR(10) NOT NULL,
                numero_processo VARCHAR(100) NOT NULL,
                data_emissao DATE NOT NULL,
                data_vencimento DATE NOT NULL,
                emitido_por INT REFERENCES usuarios(id),
                conteudo_tecnico TEXT NOT NULL,
                bloqueado_para_edicao BOOLEAN DEFAULT TRUE,
                codigo_autenticidade_qr VARCHAR(150) UNIQUE NOT NULL
            );
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS logs_auditoria (
                id SERIAL PRIMARY KEY,
                usuario_id INT REFERENCES usuarios(id),
                acao VARCHAR(100) NOT NULL,
                tabela_afetada VARCHAR(100) NOT NULL,
                registro_id INT NOT NULL,
                data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        print("✅ Estrutura de tabelas mapeada com sucesso.")

        # 2. ALIMENTAÇÃO DOS DADOS DE TESTE (Seed)
        print("\n🌱 Populando massa de dados inicial...")

        cursor.execute("SELECT COUNT(*) FROM controle_sistema;")
        if cursor.fetchone()['count'] == 0:
            cursor.execute("INSERT INTO controle_sistema (data_instalacao, bloqueado) VALUES (%s, FALSE);", (datetime.now(),))
            print(" [OK] Trial comercial de 180 dias inicializado no banco.")

        cursor.execute("SELECT COUNT(*) FROM usuarios;")
        if cursor.fetchone()['count'] == 0:
            usuarios_seed = [
                ("Márcio Rodrigues", "Administrador"),
                ("Késia de Oliveira", "Analista"),
                ("Carlos Fiscal Silva", "Fiscal")
            ]
            for nome, perfil in usuarios_seed:
                cursor.execute("INSERT INTO usuarios (text_nome, perfil) VALUES (%s, %s);", (nome, perfil))
            print(" [OK] Usuarios de teste injetados (IDs: 1, 2 e 3).")

        cursor.execute("SELECT COUNT(*) FROM empresas;")
        if cursor.fetchone()['count'] == 0:
            empresas_seed = [
                ("Lava-Jato Daiane EIRELI", "12.345.678/0001-99"),
                ("Madeireira Tocantins Ltda", "98.765.432/0001-11"),
                ("Posto Rio Araguaia S.A.", "55.666.777/0001-22")
            ]
            for razao, cnpj in empresas_seed:
                cursor.execute("INSERT INTO empresas (razao_social, cnpj) VALUES (%s, %s);", (razao, cnpj))
            print(" [OK] Empresas locais de teste cadastradas.")

        conn.commit()
        print("\n✨ Sistema inicializado! Banco pronto para homologacao local e web.")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Erro critico na execucao das tabelas: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    popular_banco()