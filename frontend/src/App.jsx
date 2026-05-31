import React, { useState, useEffect } from 'react';
import Login from './Login';

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Verifica se já existe uma sessão em conformidade jurídica salva localmente
    const sessaoSalva = localStorage.getItem('usuario_logado');
    if (sessaoSalva) {
      setUsuario(JSON.parse(sessaoSalva));
    }
  }, []);

  const deslogarSistma = () => {
    localStorage.removeItem('usuario_logado');
    setUsuario(null);
  };

  if (!usuario) {
    return <Login onLoginSuccess={(dados) => setUsuario(dados)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Barra de Navegação Superior */}
      <nav className="bg-green-700 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight">FISCALIZA AMBIENTAL</h1>
          <p className="text-xs text-green-200">Painel de Controle Municipal</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-bold">{usuario.nome}</p>
            <p className="text-[10px] bg-green-800 px-2 py-0.5 rounded text-green-300 uppercase tracking-wider">
              {usuario.perfil}
            </p>
          </div>
          <button 
            onClick={deslogarSistma}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded transition-colors shadow"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Conteúdo Principal do Sistema */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao Sistema Regulatória</h2>
          <p className="text-gray-600 mb-6">
            Utilize os módulos abaixo para gerenciar vistorias, empresas e emitir licenças oficiais (LP, LI, LO).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:border-green-500 transition-colors bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Emitir Licença</h3>
              <p className="text-sm text-gray-500 mb-4">Geração automatizada de LP, LI e LO com assinaturas e QR Code imutável.</p>
              <span className="text-xs font-bold text-green-600 cursor-pointer hover:underline">Acessar Módulo &rarr;</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 hover:border-green-500 transition-colors bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Empresas Cadastradas</h3>
              <p className="text-sm text-gray-500 mb-4">Gerencie a situação cadastral e o histórico de vistorias ambientais das empresas locais.</p>
              <span className="text-xs font-bold text-green-600 cursor-pointer hover:underline">Acessar Módulo &rarr;</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 hover:border-green-500 transition-colors bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Logs de Auditoria</h3>
              <p className="text-sm text-gray-500 mb-4">Trilha imutável de ações executadas pelos analistas para segurança jurídica.</p>
              <span className="text-xs font-bold text-green-600 cursor-pointer hover:underline">Acessar Módulo &rarr;</span>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé de Desenvolvimento */}
      <footer className="w-full text-center py-4 text-gray-400 text-xs font-bold tracking-widest uppercase border-t border-gray-200 mt-20">
        Homologação Local — Desenvolvido por RAZGO
      </footer>
    </div>
  );
}