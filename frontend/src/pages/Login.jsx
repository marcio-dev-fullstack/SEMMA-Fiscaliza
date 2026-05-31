import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    const ADMIN_EMAIL = "suporte@razgo.com.br";
=======

    // CREDENCIAIS DEFINIDAS POR VOCÊ
    const ADMIN_EMAIL = "marcio@razgo.com.br";
>>>>>>> 260debc3eb025df6c6fe2ecdb31a2e6252b761c4
    const ADMIN_PASS = "123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      navigate("/");
    } else {
      alert("Acesso Negado: Credenciais de Administrador incorretas.");
    }
  };

  return (
    /* 1. Adicionada a imagem de fundo aqui via style */
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/tela2.png')" }}
    >
      
      {/* 2. Overlay para escurecer um pouco a imagem e dar destaque ao card */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none"></div>

      <div className="max-w-md w-full relative">
        {/* Card de Login */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Cabeçalho do Card */}
          <div className="bg-emerald-700 p-8 text-center">
            <div className="inline-flex p-3 bg-emerald-600 rounded-2xl mb-4 border border-emerald-500 shadow-inner">
              <ShieldCheckIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
              FISCALIZA
            </h1>
            <p className="text-emerald-100 text-[10px] mt-2 font-medium uppercase tracking-[0.2em]">
              Gestão e Licenciamento Ambiental
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="seu-email@exemplo.com.br"
=======
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="analista@sema.com.br"
>>>>>>> 260debc3eb025df6c6fe2ecdb31a2e6252b761c4
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Senha de Acesso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-black transition-all active:scale-95"
            >
              Entrar no Sistema
            </button>
          </form>

          {/* Rodapé do Card */}
          <div className="bg-slate-50/80 p-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
              Desenvolvido por:
            </p>
            <a 
              href="https://razgo.com.br/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group transition-all"
            >
              <p className="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                RAZGO <span className="text-emerald-600">TECNOLOGIA</span>
              </p>
              <p className="text-[12px] text-slate-400 font-medium group-hover:text-slate-600">
                (62) 99646-6033
              </p>
            </a>
          </div>
        </div>

        {/* Informação Legal - Cor alterada para branco para melhor leitura sobre a imagem */}
        <p className="text-center mt-8 text-white/70 text-[10px] font-medium uppercase tracking-tighter">
          <span className="text-emerald-400 font-bold">© 2026 RAZGO TECNOLOGIA</span> | Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;
