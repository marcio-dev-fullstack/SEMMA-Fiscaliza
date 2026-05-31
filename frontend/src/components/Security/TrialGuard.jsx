import React from 'react';
import { LockClosedIcon, ShieldExclamationIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const TrialGuard = ({ isExpired, daysRemaining, children }) => {
  // Se a licença estiver ativa, renderiza o sistema normalmente
  if (!isExpired) {
    return <>{children}</>;
  }

  // Se a licença expirou, renderiza a tela de bloqueio total
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decorativo com efeito de rede/engenharia */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#1e293b 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-200">
        {/* Barra superior de Alerta Crítico */}
        <div className="bg-red-600 h-2 w-full"></div>
        
        <div className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 animate-ping rounded-full opacity-20"></div>
              <div className="relative p-5 bg-red-50 rounded-full border-2 border-red-100">
                <LockClosedIcon className="h-14 w-14 text-red-600" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase">
            Acesso Suspenso
          </h1>
          
          <div className="space-y-4 text-slate-600 mb-8">
            <p className="text-sm md:text-base leading-relaxed">
              O período de avaliação de <span className="font-bold text-slate-900">90 dias</span> do 
              <span className="text-emerald-700 font-bold"> FISCALIZA AMBIENTAL</span> chegou ao fim.
            </p>
            <p className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-2 justify-center">
              <ShieldExclamationIcon className="h-4 w-4 text-amber-500" />
              Módulos de Gestão, Fiscalização e Emissão de PDFs bloqueados.
            </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => window.open('https://wa.me/5594991122334', '_blank')} // Ajuste seu número aqui
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-emerald-400" />
              Falar com Engenheiro Márcio
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-white text-slate-500 font-bold py-3 text-xs uppercase tracking-widest hover:text-slate-800 transition-colors"
            >
              Tentar Reconectar
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Desenvolvido por Márcio Rodrigues de Oliveira
            </p>
            <p className="text-[9px] text-slate-300 mt-1 uppercase">
              Engenharia de Software | Engenharia Civil | Segurança do Trabalho
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialGuard;