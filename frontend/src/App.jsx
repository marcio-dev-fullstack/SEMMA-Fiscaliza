import React, { useState, useEffect } from 'react';
import Login from './Login';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [telaAtual, setTelaAtual] = useState('painel'); // 'painel' ou 'emitir_licenca'
  
  // Estados do Formulário de Emissão
  const [empresaId, setEmpresaId] = useState('1'); // Padrão: Lava-Jato Daiane (ID 1 do Seed)
  const [tipoLicenca, setTipoLicenca] = useState('LP');
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [diasValidade, setDiasValidade] = useState('365');
  const [conteudoTecnico, setConteudoTecnico] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const sessaoSalva = localStorage.getItem('usuario_logado');
    if (sessaoSalva) {
      setUsuario(JSON.parse(sessaoSalva));
    }
  }, []);

  const deslogarSistema = () => {
    localStorage.removeItem('usuario_logado');
    setUsuario(null);
    setTelaAtual('painel');
  };

  const gerenciarEmissao = async (e) => {
    e.preventDefault();
    setMensagemSucesso('');
    setMensagemErro('');
    setCarregando(true);

    const payload = {
      empresa_id: parseInt(empresaId),
      tipo: tipoLicenca,
      numero_processo: numeroProcesso,
      dias_validade: parseInt(diasValidade),
      conteudo_tecnico: conteudoTecnico,
      usuario_id: usuario.id
    };

    try {
      const resposta = await fetch('http://127.0.0.1:8000/licencas/emitir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagemSucesso(`Licença emitida com sucesso! ID: ${dados.licenca_id}. Abrindo documento...`);
        setNumeroProcesso('');
        setConteudoTecnico('');
        
        // Abre automaticamente o PDF gerado pelo ReportLab do Backend em nova aba
        window.open(`http://127.0.0.1:8000/licencas/${dados.licenca_id}/pdf`, '_blank');
      } else {
        setMensagemErro(dados.detail || 'Erro ao processar emissão regulatória.');
      }
    } catch (err) {
      setMensagemErro('Falha na comunicação com o servidor FastAPI.');
    } finally {
      setCarregando(false);
    }
  };

  if (!usuario) {
    return <Login onLoginSuccess={(dados) => setUsuario(dados)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      {/* Barra de Navegação Superior */}
      <nav className="bg-green-700 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => setTelaAtual('painel')}>
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
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm focus:outline-none"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Renderização Condicional de Telas */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {telaAtual === 'painel' ? (
          /* TELA 01: PAINEL PRINCIPAL */
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Bem-vindo ao Ambiente do Desenvolvedor</h2>
              <p className="text-sm text-gray-500 mt-1">Gerencie os módulos regulatórios municipais e emissão de certidões.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 01 - Direciona para o formulário */}
              <div className="border border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-md transition-all bg-gray-50 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-800 mb-2">Emitir Licença Ambiental</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">Geração automática de minutas (LP, LI, LO) integradas com criptografia de QR Code imutável.</p>
                </div>
                <button 
                  onClick={() => setTelaAtual('emitir_licenca')}
                  className="text-xs font-bold text-left text-green-600 hover:text-green-700 focus:outline-none"
                >
                  Acessar Módulo &rarr;
                </button>
              </div>

              {/* Card 02 - Empresas Cadastradas (Fictício) */}
              <div className="border border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-md transition-all bg-gray-50 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-800 mb-2">Empresas Cadastradas</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">Consulte a situação cadastral, CNPJs ativos e histórico de vistorias das empresas locais.</p>
                </div>
                <span className="text-xs font-bold text-gray-400 cursor-not-allowed">Consultar Empresas &rarr;</span>
              </div>

              {/* Card 03 - Logs de Auditoria (Fictício) */}
              <div className="border border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-md transition-all bg-gray-50 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-800 mb-2">Logs de Auditoria (RBAC)</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">Trilha imutável de segurança jurídica registrando ações executadas pelos analistas.</p>
                </div>
                <span className="text-xs font-bold text-gray-400 cursor-not-allowed">Exibir Logs &rarr;</span>
              </div>
            </div>
          </div>
        ) : (
          /* TELA 02: FORMULÁRIO DE EMISSÃO REGULATÓRIA */
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 max-w-2xl mx-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Nova Emissão de Licença Ambiental</h2>
                <p className="text-xs text-gray-400 mt-0.5">Preencha os pareceres e os dados do processo regulatório</p>
              </div>
              <button 
                onClick={() => setTelaAtual('painel')}
                className="text-xs font-bold text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 transition-colors"
              >
                &larr; Voltar
              </button>
            </div>

            <form onSubmit={gerenciarEmissao} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Empresa Alvo</label>
                  <select 
                    value={empresaId} 
                    onChange={(e) => setEmpresaId(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none"
                  >
                    <option value="1">Lava-Jato Daiane EIRELI (ID 1)</option>
                    <option value="2">Madeireira Tocantins Ltda (ID 2)</option>
                    <option value="3">Posto Rio Araguaia S.A. (ID 3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tipo de Licença</label>
                  <select 
                    value={tipoLicenca} 
                    onChange={(e) => setTipoLicenca(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none"
                  >
                    <option value="LP">LP - Licença Prévia</option>
                    <option value="LI">LI - Licença de Instalação</option>
                    <option value="LO">LO - Licença de Operação</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nº do Processo Administrativo</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: 4572/2026-SEMMA"
                    value={numeroProcesso}
                    onChange={(e) => setNumeroProcesso(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prazo de Validade (Dias)</label>
                  <input 
                    type="number" 
                    required 
                    value={diasValidade}
                    onChange={(e) => setDiasValidade(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Parecer Técnico e Restrições Obras/Operação</label>
                <textarea 
                  rows="5" 
                  required
                  placeholder="Injete aqui os laudos, condicionantes, restrições ambientais de escoamento e conformidades da instalação jurídica vistoriada..."
                  value={conteudoTecnico}
                  onChange={(e) => setConteudoTecnico(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none font-mono"
                />
              </div>

              {mensagemSucesso && <div className="text-green-700 text-xs font-semibold bg-green-50 p-3 rounded-lg border border-green-200 text-center">{mensagemSucesso}</div>}
              {mensagemErro && <div className="text-red-700 text-xs font-semibold bg-red-50 p-3 rounded-lg border border-red-200 text-center">{mensagemErro}</div>}

              <button 
                type="submit" 
                disabled={carregando}
                className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all shadow-md disabled:bg-gray-400"
              >
                {carregando ? 'Processando Validações e Emitindo...' : 'Concluir Emissão e Assinar Documento'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="w-full text-center py-6 text-gray-400 text-xs font-bold tracking-widest uppercase border-t border-gray-200 mt-20 bg-white">
        Homologação Local — Desenvolvido por RAZGO
      </footer>
    </div>
  );
}