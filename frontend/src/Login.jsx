import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('cda.marcio@gmail.com');
  const [senha, setSenha] = useState('********');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerenciarSubmissao = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Armazena o token JWT real e os dados do usuário para conformidade
        localStorage.setItem('access_token', dados.access_token);
        localStorage.setItem('usuario_logado', JSON.stringify(dados.usuario));
        
        if (onLoginSuccess) {
          onLoginSuccess(dados.usuario);
        }
      } else {
        setErro(dados.detail || 'Falha na autenticação regulatória municipal.');
      }
    } catch (err) {
      setErro('Impossível conectar com a API de segurança do FastAPI.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-black text-green-700 tracking-tight">
            FISCALIZA AMBIENTAL
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Sistema Municipal de Gestão de Licenciamento
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={gerenciarSubmissao}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                E-mail Funcional
              </label>
              <input
                type="email"
                required
                disabled={carregando}
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-100"
                placeholder="nome.sobrenome@municipio.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                disabled={carregando}
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-100"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          {erro && (
            <div className="text-red-700 text-xs font-semibold bg-red-50 p-3 rounded-lg border border-red-200 text-center">
              {erro}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={carregando}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md disabled:bg-gray-400"
            >
              {carregando ? 'Validando Assinatura...' : 'Entrar no Sistema'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
            Homologação Local — Desenvolvido por RAZGO
          </p>
        </div>
      </div>
    </div>
  );
}