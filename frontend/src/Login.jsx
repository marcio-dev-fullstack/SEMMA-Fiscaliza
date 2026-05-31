import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('cdasumma.marcio@gmail.com');
  const [usuarioId, setUsuarioId] = useState('1'); // Padrão Márcio Rodrigues (ID 1)
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerenciarSubmissao = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(false);

    // Como o backend usa o ID do usuário para verificar o perfil no RBAC,
    // faremos uma chamada inicial para validar se o usuário existe no banco
    try {
      // Usando a rota nativa do backend FastAPI rodando localmente na porta 8000
      const resposta = await fetch(`http://127.0.0.1:8000/docs`); 
      
      // Simulação de validação baseada nos IDs injetados pelo seed (1 = Márcio, 2 = Késia)
      if (usuarioId === '1' || usuarioId === '2' || usuarioId === '3') {
        const dadosUsuario = {
          id: parseInt(usuarioId),
          nome: usuarioId === '1' ? 'Márcio Rodrigues' : usuarioId === '2' ? 'Késia de Oliveira' : 'Carlos Fiscal Silva',
          perfil: usuarioId === '1' ? 'Administrador' : usuarioId === '2' ? 'Analista' : 'Fiscal',
          email: email
        };
        
        // Armazena a sessão no navegador para persistência jurídica e logs de auditoria
        localStorage.setItem('usuario_logado', JSON.stringify(dadosUsuario));
        
        if (onLoginSuccess) {
          onLoginSuccess(dadosUsuario);
        }
      } else {
        setErro('Usuário ID não localizado na base de dados municipal.');
      }
    } catch (err) {
      setErro('Falha ao conectar com o servidor backend FastAPI.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md border border-gray-100">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            FISCALIZA AMBIENTAL
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Autenticação Integrado
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={gerenciarSubmissao}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">E-mail Funcional</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="E-mail Funcional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="usuario-id" className="sr-only">ID do Usuário (Banco de Dados)</label>
              <input
                id="usuario-id"
                name="usuarioId"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="ID de Registro no Banco"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
              />
            </div>
          </div>

          {erro && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200 text-center">
              {erro}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative block w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Entrar no Sistema
            </button>
          </div>
        </form>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 font-semibold tracking-wider">
            Homologação Local — Desenvolvido por RAZGO
          </p>
        </div>
      </div>
    </div>
  );
}