import React, { useState, useEffect } from 'react';
import Login from './Login';

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Recupera a sessão segura salva no localStorage para evitar deslogar no F5
    const sessaoSalva = localStorage.getItem('usuario_logado');
    if (sessaoSalva) {
      setUsuario(JSON.parse(sessaoSalva));
    }
  }, []);

  const deslogarSistema = () => {
    localStorage.removeItem('usuario_logado');
    setUsuario(null);
  };

  // Se não houver usuário autenticado no estado, exibe a tela de login estilizada
  if (!usuario) {
    return <Login onLoginSuccess={(dados) => setUsuario(dados)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      {/* Barra de Navegação Superior Regulamentar */}
      <nav className="bg-green-700 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight uppercase">FISCALIZA AMBIENTAL</h1>
          <p className="text-xs text-green-100 font-medium">Painel Integrado de Controle Municipal</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-bold leading-tight">{usuario.nome}</p>
            <span className="inline-block mt-1 text-[10px] bg-green-800 px-2 py-0.5 rounded text-green-200 font-bold uppercase tracking-wider">
              {usuario.perfil}
            </span>
          </div>
          <button 
            onClick={deslogarSistema}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Conteúdo Central do Painel Administrativo */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <div className="border-b border-gray-100 pb-5 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Bem-vindo ao Ambiente do Desenvolvedor</h2>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie os módulos regulatórios de vistorias, empresas credenciadas e emissão de certidões.
            </p>
          </div>

          {/* Grid de Cards de Funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 01 - Emissão de Licenças */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-md transition-all bg-gray-50 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-gray-800 mb-2">Emitir Licença Ambiental</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Geração automática de minutas e certidões oficiais (LP, LI, LO) integradas com criptografia de QR Code imutável.
                </p>
              </div>
              <span className="text-xs font-bold text-green-600 hover:text-green-700 cursor-pointer inline-flex items-center group">
                Acessar Módulo <span className="transform group-hover:translate-x-1 transition-transform ml-1">&rarr;</span>
              </span>
            </div>

            {/* Card 02 - Empresas Cadastradas */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-md transition-all bg-gray-50 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-gray-800 mb-2">Empresas Cadastradas</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Consulte a situação cadastral, CNPJs ativos e histórico completo de processos administrativos ambientais.
                </p>
              </div>
              <span className="text-xs font-bold text-green-600 hover:text-green-700 cursor-pointer inline-flex items-center group">
                Consultar Empresas <span className="transform group-hover:translate-x-1 transition-transform ml-1">&rarr;</span>
              </span>
            </div>

            {/* Card 03 - Logs de Auditoria */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-md transition-all bg-gray-50 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-gray-800 mb-2">Logs de Auditoria (RBAC)</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Trilha imutável de segurança jurídica registrando todas as ações e consultas feitas por fiscais e analistas.
                </p>
              </div>
              <span className="text-xs font-bold text-green-600 hover:text-green-700 cursor-pointer inline-flex items-center group">
                Exibir Logs <span className="transform group-hover:translate-x-1 transition-transform ml-1">&rarr;</span>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé Oficial do Projeto */}
      <footer className="w-full text-center py-6 text-gray-400 text-xs font-bold tracking-widest uppercase border-t border-gray-200 mt-20 bg-white">
        Homologação Local — Desenvolvido por RAZGO
      </footer>
    </div>
  );
}