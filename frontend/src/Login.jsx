import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('cda.marcio@gmail.com');
  const [senha, setSenha] = useState('********');
  const [erro, setErro] = useState('');

  const gerenciarSubmissao = (e) => {
    e.preventDefault();
    setErro('');

    // Validação local alinhada com os dados inseridos pelo script de sementes (seed.py)
    if (email === 'cda.marcio@gmail.com' || email === 'cdasumma.marcio@gmail.com') {
      const dadosUsuario = {
        id: 1,
        nome: 'Márcio Rodrigues',
        perfil: 'Administrador',
        email: email
      };
      
      // Armazena a sessão para manter a conformidade e integridade dos logs
      localStorage.setItem('usuario_logado', JSON.stringify(dadosUsuario));
      
      if (onLoginSuccess) {
        onLoginSuccess(dadosUsuario);
      }
    } else {
      setErro('Credenciais inválidas. Verifique o e-mail e a senha de acesso.');
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
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md"
            >
              Entrar no Sistema
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