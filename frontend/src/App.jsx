import React, { useState, useEffect } from 'react';
import Login from './Login';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [telaAtual, setTelaAtual] = useState('painel'); // 'painel', 'emitir_licenca', 'listar_empresas', 'auditoria', 'nova_empresa'
  const [empresas, setEmpresas] = useState([]);
  const [logs, setLogs] = useState([]);
  
  // Estado das Métricas Estatísticas
  const [metricas, setMetricas] = useState({
    empresas: 0,
    logs: 0,
    licencas: { lp: 0, li: 0, lo: 0, total: 0 }
  });

  // Estados do Formulário de Emissão
  const [empresaId, setEmpresaId] = useState('');
  const [tipoLicenca, setTipoLicenca] = useState('LP');
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [diasValidade, setDiasValidade] = useState('365');
  const [conteudoTecnico, setConteudoTecnico] = useState('');
  
  // Estados do Formulário de Nova Empresa
  const [novaRazao, setNovaRazao] = useState('');
  const [novoCnpj, setNovoCnpj] = useState('');

  // Estados de Notificação
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const sessaoSalva = localStorage.getItem('usuario_logado');
    if (sessaoSalva) {
      setUsuario(JSON.parse(sessaoSalva));
    }
    buscarEmpresas();
    buscarMetricasDashboard();
  }, []);

  const buscarMetricasDashboard = async () => {
    try {
      const resposta = await fetch('http://127.0.0.1:8000/dashboard/metricas');
      if (resposta.ok) {
        const dados = await resposta.json();
        setMetricas(dados);
      }
    } catch (err) {
      console.error("Erro ao carregar métricas estatísticas:", err);
    }
  };

  const buscarEmpresas = async () => {
    try {
      const resposta = await fetch('http://127.0.0.1:8000/empresas');
      if (resposta.ok) {
        const dados = await resposta.json();
        setEmpresas(dados);
        if (dados.length > 0) {
          setEmpresaId(dados[0].id.toString());
        }
      }
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
    }
  };

  const buscarLogsAuditoria = async () => {
    try {
      const resposta = await fetch('http://127.0.0.1:8000/auditoria');
      if (resposta.ok) {
        const dados = await resposta.json();
        setLogs(dados);
        setTelaAtual('auditoria');
      }
    } catch (err) {
      console.error("Erro ao carregar logs:", err);
    }
  };

  const deslogarSistema = () => {
    localStorage.removeItem('access_token');
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
        buscarMetricasDashboard(); // Recarrega os gráficos na home
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

  const gerenciarCadastroEmpresa = async (e) => {
    e.preventDefault();
    setMensagemSucesso('');
    setMensagemErro('');
    setCarregando(true);

    const payload = {
      razao_social: novaRazao,
      cnpj: novoCnpj,
      usuario_id: usuario.id
    };

    try {
      const resposta = await fetch('http://127.0.0.1:8000/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagemSucesso(`Empresa '${novaRazao}' cadastrada com sucesso na base municipal!`);
        setNovaRazao('');
        setNovoCnpj('');
        await buscarEmpresas();
        await buscarMetricasDashboard(); // Atualiza gráfico de volume
      } else {
        setMensagemErro(dados.detail || 'Erro ao salvar cadastro da empresa.');
      }
    } catch (err) {
      setMensagemErro('Falha na conexão com a API de dados.');
    } finally {
      setCarregando(false);
    }
  };

  // Cálculo percentual seguro para as barras de gráfico Tailwind
  const maxLicencas = Math.max(metricas.licencas.lp, metricas.licencas.li, metricas.licencas.lo, 1);
  const pctLP = (metricas.licencas.lp / maxLicencas) * 100;
  const pctLI = (metricas.licencas.li / maxLicencas) * 100;
  const pctLO = (metricas.licencas.lo / maxLicencas) * 100;

  if (!usuario) {
    return <Login onLoginSuccess={(dados) => setUsuario(dados)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      {/* Barra de Navegação Superior */}
      <nav className="bg-green-700 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => { setTelaAtual('painel'); setMensagemSucesso(''); setMensagemErro(''); buscarMetricasDashboard(); }}>
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

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {telaAtual === 'painel' && (
          /* TELA 01: PAINEL PRINCIPAL COM BLOCOS GRÁFICOS */
          <div className="space-y-8">
            
            {/* LINHA 1: CARD DE CONTADORES RÁPIDOS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Empresas Monitoradas</p>
                <p className="text-3xl font-black text-gray-800 mt-1">{metricas.empresas}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total de Licenças Emitidas</p>
                <p className="text-3xl font-black text-green-700 mt-1">{metricas.licencas.total}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Operações Auditadas (RBAC)</p>
                <p className="text-3xl font-black text-blue-700 mt-1">{metricas.logs}</p>
              </div>
            </div>

            {/* LINHA 2: GRÁFICOS DE BARRAS VIA TAILWIND NATIVO */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-3 mb-5">
                Volumetria de Certidões Regulatórias por Categoria
              </h3>
              
              <div className="space-y-4 max-w-xl">
                {/* Barra LP */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>LP — Licença Prévia</span>
                    <span>{metricas.licencas.lp} emitidas</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full rounded-full transition-all duration-500" style={{ width: `${pctLP}%` }}></div>
                  </div>
                </div>

                {/* Barra LI */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>LI — Licença de Instalação</span>
                    <span>{metricas.licencas.li} emitidas</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${pctLI}%` }}></div>
                  </div>
                </div>

                {/* Barra LO */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>LO — Licença de Operação</span>
                    <span>{metricas.licencas.lo} emitidas</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-green-600 h-full rounded-full transition-all duration-500" style={{ width: `${pctLO}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* LINHA 3: CARD DE AÇÕES OPERACIONAIS */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-3 mb-6">
                Módulos Administrativos Disponíveis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-md transition-all bg-gray-50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-800 mb-2">Emitir Licença Ambiental</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">Geração automática de minutas com criptografia de QR Code imutável.</p>
                  </div>
                  <button onClick={() => setTelaAtual('emitir_licenca')} className="text-xs font-bold text-left text-green-600 hover:text-green-700 focus:outline-none">
                    Acessar Módulo &rarr;
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-md transition-all bg-gray-50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-800 mb-2">Empresas Cadastradas</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">Consulte a situação cadastral e o histórico de vistorias das empresas locais no banco.</p>
                  </div>
                  <button onClick={() => { buscarEmpresas(); setTelaAtual('listar_empresas'); }} className="text-xs font-bold text-left text-green-600 hover:text-green-700 focus:outline-none">
                    Consultar Empresas &rarr;
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-md transition-all bg-gray-50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-800 mb-2">Logs de Auditoria (RBAC)</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">Trilha imutável de segurança jurídica registrando ações executadas pelos analistas.</p>
                  </div>
                  <button onClick={buscarLogsAuditoria} className="text-xs font-bold text-left text-green-600 hover:text-green-700 focus:outline-none">
                    Exibir Logs &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {telaAtual === 'emitir_licenca' && (
          /* TELA 02: FORMULÁRIO DE EMISSÃO */
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 max-w-2xl mx-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Nova Emissão de Licença Ambiental</h2>
                <p className="text-xs text-gray-400 mt-0.5">Preencha os pareceres e os dados do processo regulatório</p>
              </div>
              <button onClick={() => { setTelaAtual('painel'); setMensagemSucesso(''); setMensagemErro(''); }} className="text-xs font-bold text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 transition-colors">
                &larr; Voltar
              </button>
            </div>

            <form onSubmit={gerenciarEmissao} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Empresa Alvo</label>
                  <select value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none">
                    {empresas.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.razao_social} (ID {emp.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tipo de Licença</label>
                  <select value={tipoLicenca} onChange={(e) => setTipoLicenca(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none">
                    <option value="LP">LP - Licença Prévia</option>
                    <option value="LI">LI - Licença de Instalação</option>
                    <option value="LO">LO - Licença de Operação</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nº do Processo Administrativo</label>
                  <input type="text" required placeholder="Ex: 4572/2026-SEMMA" value={numeroProcesso} onChange={(e) => setNumeroProcesso(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prazo de Validade (Dias)</label>
                  <input type="number" required value={diasValidade} onChange={(e) => setDiasValidade(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Parecer Técnico e Restrições Obras/Operação</label>
                <textarea rows="6" required placeholder="Injete aqui os laudos, condicionantes, restrições..." value={conteudoTecnico} onChange={(e) => setConteudoTecnico(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none font-mono"/>
              </div>

              {mensagemSucesso && <div className="text-green-700 text-xs font-semibold bg-green-50 p-3 rounded-lg border border-green-200 text-center">{mensagemSucesso}</div>}
              {mensagemErro && <div className="text-red-700 text-xs font-semibold bg-red-50 p-3 rounded-lg border border-red-200 text-center">{mensagemErro}</div>}

              <button type="submit" disabled={carregando} className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all shadow-md disabled:bg-gray-400">
                {carregando ? 'Processando Validações e Emitindo...' : 'Concluir Emissão e Assinar Documento'}
              </button>
            </form>
          </div>
        )}

        {telaAtual === 'listar_empresas' && (
          /* TELA 03: TABELA DE VISUALIZAÇÃO DE EMPRESAS */
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Empresas Monitoradas Municipais</h2>
                <p className="text-xs text-gray-400 mt-0.5">Relação de CNPJs cadastrados na base de dados estruturada</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => { setTelaAtual('nova_empresa'); setMensagemSucesso(''); setMensagemErro(''); }} className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg px-3 py-1.5 transition-colors shadow-sm">
                  + Cadastrar Empresa
                </button>
                <button onClick={() => { setTelaAtual('painel'); setMensagemSucesso(''); setMensagemErro(''); }} className="text-xs font-bold text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 transition-colors">
                  &larr; Voltar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 font-bold text-gray-700 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Razão Social</th>
                    <th className="px-6 py-3 text-left">CNPJ Regulatório</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
                  {empresas.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-green-700">{emp.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{emp.razao_social}</td>
                      <td className="px-6 py-4 font-mono">{emp.cnpj}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {telaAtual === 'nova_empresa' && (
          /* TELA 05: FORMULÁRIO DE CADASTRO DE NOVA EMPRESA */
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 max-w-md mx-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Inclusão Cadastral Municipal</h2>
                <p className="text-xs text-gray-400 mt-0.5">Registre um novo estabelecimento para monitoramento</p>
              </div>
              <button onClick={() => { setTelaAtual('listar_empresas'); setMensagemSucesso(''); setMensagemErro(''); }} className="text-xs font-bold text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 transition-colors">
                &larr; Cancelar
              </button>
            </div>

            <form onSubmit={gerenciarCadastroEmpresa} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Razão Social Corporativa</label>
                <input type="text" required placeholder="Ex: Lava-Jato Daiane Ltda" value={novaRazao} onChange={(e) => setNovaRazao(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CNPJ Oficial</label>
                <input type="text" required placeholder="Ex: 00.000.000/0001-00" value={novoCnpj} onChange={(e) => setNovoCnpj(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:outline-none"/>
              </div>

              {mensagemSucesso && <div className="text-green-700 text-xs font-semibold bg-green-50 p-3 rounded-lg border border-green-200 text-center">{mensagemSucesso}</div>}
              {mensagemErro && <div className="text-red-700 text-xs font-semibold bg-red-50 p-3 rounded-lg border border-red-200 text-center">{mensagemErro}</div>}

              <button type="submit" disabled={carregando} className="w-full py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all shadow-md disabled:bg-gray-400">
                {carregando ? 'Salvando no Banco...' : 'Confirmar Registro no Sistema'}
              </button>
            </form>
          </div>
        )}

        {telaAtual === 'auditoria' && (
          /* TELA 04: TABELA DE CONTROLE DE AUDITORIA */
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Trilha Imutável de Auditoria (RBAC)</h2>
                <p className="text-xs text-gray-400 mt-0.5">Histórico completo de segurança regulatória do município</p>
              </div>
              <button onClick={() => { setTelaAtual('painel'); setMensagemSucesso(''); setMensagemErro(''); }} className="text-xs font-bold text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 transition-colors">
                &larr; Voltar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 font-bold text-gray-700 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">ID Log</th>
                    <th className="px-6 py-3 text-left">Utilizador</th>
                    <th className="px-6 py-3 text-left">Operação</th>
                    <th className="px-6 py-3 text-left">Alvo Modificado</th>
                    <th className="px-6 py-3 text-left">Data/Hora Registo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-400">#{log.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{log.usuario}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100">
                          {log.acao}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                        {log.tabela_afetada} (Ref-ID: {log.registro_id})
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{new Date(log.data_registro).toLocaleString('pt-PT')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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