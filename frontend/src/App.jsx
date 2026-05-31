import React, { useState } from 'react';

function App() {
  // Estado para gerenciar se o usuário está autenticado e quem ele é
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  
  // Estados do formulário de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [loginErro, setLoginErro] = useState('');

  // Estados do Painel de Licenciamento
  const [empresas] = useState([{ id: 1, razao_social: "Lava-Jato Daiane", cnpj: "00.000.000/0001-00" }]);
  const [formData, setFormData] = useState({
    empresa_id: 1,
    tipo: 'LP',
    numero_processo: '',
    dias_validade: 365,
    conteudo_tecnico: ''
  });

  const [idGerado, setIdGerado] = useState(null);
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Função de Autenticação na Interface com as credenciais nominais da RAZGO
  const lidarComLogin = (e) => {
    e.preventDefault();
    setLoginErro('');

    // Validação estrita com seu e-mail nominal da RAZGO
    if (loginEmail === 'marcio@razgo.com.br' && loginSenha === '123') {
      setUsuarioLogado({
        id: 1,
        nome: 'Márcio Rodrigues',
        perfil: 'Administrador',
        email: 'marcio@razgo.com.br'
      });
    } else if (loginEmail === 'analista@semma.com' && loginSenha === '123456') {
      setUsuarioLogado({
        id: 2,
        nome: 'Analista Técnico',
        perfil: 'Analista',
        email: 'analista@semma.com'
      });
    } else {
      setLoginErro('Credenciais inválidas. Verifique o e-mail e a senha de acesso.');
    }
  };

  // Função de Emissão de Licenças com Rota Relativa e captura transparente de erro
  const ejecutarEmissao = async (e) => {
    e.preventDefault();
    setSucessoMsg('');
    setErroMsg('');
    setIdGerado(null);
    setLoading(true);

    try {
      // Rota relativa limpa: bate no próprio servidor que serve os arquivos
      const response = await fetch('/licencas/emitir', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          usuario_id: usuarioLogado.id // Vincula automaticamente o ID 1 do Márcio Rodrigues
        })
      });

      const resultado = await response.json();

      if (response.ok) {
        setSucessoMsg(`Documento Regulatório Emitido! Código de Validação: ${resultado.codigo_verificacao}`);
        setIdGerado(resultado.licenca_id);
      } else {
        // Captura rejeições controladas do FastAPI/PostgreSQL (ex: HTTP 400, 401, 403)
        setErroMsg(`Barramento da API: ${resultado.detail || 'Parâmetros recusados.'}`);
      }
    } catch (err) {
      // Diagnóstico bruto do navegador (Erro de sintaxe, JSON corrompido, quebra física real)
      setErroMsg(`Erro bruto capturado: ${err.message || err}. Inspecione o console do Python.`);
    } finally {
      setLoading(false);
    }
  };

  const lidarComLogout = () => {
    setUsuarioLogado(null);
    setLoginEmail('');
    setLoginSenha('');
    setSucessoMsg('');
    setErroMsg('');
    setIdGerado(null);
  };

  // RENDERIZAÇÃO CONDICIONAL: TELA DE LOGIN SECURE
  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center font-sans antialiased px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">FISCALIZA AMBIENTAL</h1>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Sistema de Autenticação Integrado</p>
          </div>

          <form onSubmit={lidarComLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">E-mail Funcional</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="marcio@razgo.com.br"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Senha de Acesso</label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="•••"
                value={loginSenha}
                onChange={e => setLoginSenha(e.target.value)}
              />
            </div>

            {loginErro && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg p-3">
                {loginErro}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-3 text-sm font-bold uppercase tracking-wide transition-all shadow-md"
            >
              Entrar no Sistema
            </button>
          </form>

          <div className="text-center border-t border-slate-100 pt-4">
            <p className="text-[10px] text-slate-400 font-mono">Homologação Local — Desenvolvido por Márcio Rodrigues</p>
          </div>
        </div>
      </div>
    );
  }

  // RENDERIZAÇÃO PAINEL ADMINISTRATIVO (PÓS-LOGIN)
  return (
    <div className="min-h-screen bg-slate-100 font-sans antialiased text-slate-800">
      {/* Barra de Navegação Superior */}
      <header className="bg-slate-900 text-white shadow-md px-8 py-5 flex justify-between items-center border-b-4 border-emerald-600">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-emerald-400">FISCALIZA AMBIENTAL</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">SST & Engenharia de Software Unificada</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-bold border border-emerald-500/20 block">
              {usuarioLogado.perfil}: {usuarioLogado.nome}
            </span>
          </div>
          <button 
            onClick={lidarComLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Grid Principal */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna do Formulário Técnico (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900">Emissão de Licença Ambiental Regulante</h2>
            <p className="text-sm text-slate-500">Insira as condicionantes técnicas para travamento e geração imutável do documento oficial.</p>
          </div>

          <form onSubmit={executarEmissao} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Empreendimento Alvo</label>
              <select 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                onChange={e => setFormData({...formData, empresa_id: parseInt(e.target.value)})}
              >
                {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.razao_social} ({emp.cnpj})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Modalidade Regulatória</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={formData.tipo} 
                  onChange={e => setFormData({...formData, tipo: e.target.value})}
                >
                  <option value="LP">LP - Licença Prévia</option>
                  <option value="LI">LI - Licença de Instalação</option>
                  <option value="LO">LO - Licença de Operação</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Número do Processo Administrativo</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required 
                  placeholder="Ex: PMA-2026/0001" 
                  value={formData.numero_processo} 
                  onChange={e => setFormData({...formData, numero_processo: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Prazo Autorizado de Validade (Dias)</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                value={formData.dias_validade} 
                onChange={e => setFormData({...formData, dias_validade: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Parecer e Diretrizes de Controle Ambiental</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm h-32 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                required 
                placeholder="Descreva as condicionantes para o plano de controle ambiental..." 
                value={formData.conteudo_tecnico} 
                onChange={e => setFormData({...formData, conteudo_tecnico: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-3 text-sm font-bold uppercase transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? 'Processando Gravação...' : 'Emitir e Autenticar Licença'}
            </button>
          </form>

          {/* Callbacks visuais de sucesso ou erro */}
          {sucessoMsg && (
            <div className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-5">
              <p className="font-bold text-sm mb-3">{sucessoMsg}</p>
              {idGerado && (
                <a 
                  href={`/licencas/${idGerado}/pdf`} // Rota de download relativa acoplada à porta 8000
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded shadow-sm transition-all"
                >
                  Download do PDF Oficial Emitido
                </a>
              )}
            </div>
          )}

          {erroMsg && (
            <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 font-medium text-sm">
              {erroMsg}
            </div>
          )}
        </div>

        {/* Coluna de Status Lateral (1/3) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Status de Segurança</h3>
            <div className="space-y-3">
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-semibold border border-emerald-100">
                Regime Comercial: Trial Ativo (180 dias)
              </div>
              <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs font-semibold border border-amber-100">
                Imputabilidade: Vinculado ao ID de Operador #{usuarioLogado.id} para auditoria fiscal imutável.
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-400 rounded-xl p-6 text-xs shadow-sm font-mono space-y-2">
            <p className="text-slate-200 font-bold uppercase border-b border-slate-800 pb-2 mb-2">Console de Operations Local</p>
            <p>[AUTH] Sessão ativa para: {usuarioLogado.email}</p>
            <p>[SYSTEM] Comunicação com o PostgreSQL ativa em UTF-8.</p>
            {idGerado && <p className="text-emerald-400 font-bold">[AUDIT] Licença #{idGerado} injetada na base.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;