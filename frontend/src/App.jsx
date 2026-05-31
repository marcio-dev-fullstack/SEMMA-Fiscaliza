import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  BarChart3, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Menu, 
  X,
  TrendingUp,
  Eye,
  Zap,
  RefreshCw,
  Award,
  Building2,
  Users,
  Lock,
  Download,
  QrCode
} from 'lucide-react';

// --- CARD DE MÉTRICA PREMIUM ULTRA REATIVO ---
const MetricCard = ({ title, value, icon: Icon, change, type = 'default' }) => {
  const styles = {
    default: {
      bg: 'from-cyan-500/15 to-blue-600/5 border-cyan-500/20 text-cyan-400',
      iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-cyan-500/30 text-slate-950',
      badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
    },
    success: {
      bg: 'from-emerald-500/15 to-teal-600/5 border-emerald-500/20 text-emerald-400',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/30 text-slate-950',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    },
    warning: {
      bg: 'from-amber-500/15 to-orange-600/5 border-amber-500/20 text-amber-400',
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-600 shadow-amber-500/30 text-slate-950',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    },
    danger: {
      bg: 'from-rose-500/15 to-red-600/5 border-rose-500/20 text-rose-400',
      iconBg: 'bg-gradient-to-br from-rose-400 to-red-600 shadow-rose-500/30 text-slate-950',
      badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    },
  };

  return (
    <div className={`bg-gradient-to-br ${styles[type].bg} backdrop-blur-md p-6 rounded-2xl border shadow-xl shadow-slate-950/50 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex items-start justify-between group`}>
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">{value}</h3>
        {change && (
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block ${styles[type].badge}`}>
            {change}
          </span>
        )}
      </div>
      <div className={`p-3 rounded-xl ${styles[type].iconBg} shadow-lg group-hover:rotate-12 transition-transform duration-300 font-bold`}>
        <Icon size={22} />
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Efeito visual de carregamento/sincronização
  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // --- MÓDULO 1: CADASTRO DE EMPRESAS & VISTORIAS ---
  const [companies] = useState([
    { id: 'EMP-041', name: 'Mineração Vale do Araguaia', sector: 'Industrial', status: 'Regular', lastInspection: '12/05/2026' },
    { id: 'EMP-042', name: 'Lava-Jato Daiane', sector: 'Serviços / Comercial', status: 'Notificado', lastInspection: '28/05/2026' },
    { id: 'EMP-043', name: 'Madeireira Progresso Regional', sector: 'Florestal', status: 'Irregular', lastInspection: '19/04/2026' },
  ]);

  // --- MÓDULO 2: LICENCIAMENTO AUTOMATIZADO (LP, LI, LO) ---
  const [licenses] = useState([
    { id: 'LIC-2026-001', company: 'Lava-Jato Daiane', type: 'LO (Operação)', expires: '28/11/2026', security: 'Imutável', auth: 'QR-OK' },
    { id: 'LIC-2026-002', company: 'Construtora Leste PA', type: 'LI (Instalação)', expires: '15/03/2027', security: 'Imutável', auth: 'QR-OK' },
    { id: 'LIC-2026-003', company: 'Indústria AgroGerais', type: 'LP (Prévia)', expires: '01/09/2026', security: 'Imutável', auth: 'QR-OK' },
  ]);

  // --- MÓDULO 3: GESTÃO DE SERVIDORES & AUDITORIA (PORTAL DE TRANSPARÊNCIA MAZZ) ---
  const [actions] = useState([
    { id: 'Ação #01', title: 'Emissão de Parecer Técnico PCA - Licenciamento Simplificado', agent: 'M. Oliveira', category: 'LO Automatizada', views: 412, date: '31/05/2026' },
    { id: 'Ação #02', title: 'Auditoria e Bloqueio de Edição Pós-Emissão (Logs de Segurança)', agent: 'Sistema', category: 'Integridade', views: 189, date: '30/05/2026' },
    { id: 'Ação #03', title: 'Emissão de Notificação por Descarte Inadequado de Efluentes', agent: 'K. Quadros', category: 'Fiscalização', views: 322, date: '29/05/2026' },
  ]);

  const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredLicenses = licenses.filter(l => l.company.toLowerCase().includes(searchTerm.toLowerCase()) || l.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-emerald-500 selection:text-slate-900">
      
      {/* --- SIDEBAR BIO-CYBERPUNK --- */}
      <aside className={`bg-slate-900 fixed inset-y-0 left-0 z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-out border-r border-slate-800 flex flex-col justify-between shadow-2xl shadow-black`}>
        <div>
          {/* Header do Sistema */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-emerald-400 to-cyan-500 p-2 rounded-xl text-slate-950 shadow-lg shadow-emerald-400/20 animate-pulse">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h1 className="font-black text-sm uppercase tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-none">Fiscaliza</h1>
                <span className="text-[10px] text-emerald-400 font-bold tracking-widest block mt-0.5">AMBIENTAL</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Abas Operacionais */}
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Painel de Comando', icon: BarChart3 },
              { id: 'companies', label: 'Cadastro & Empresas', icon: Building2 },
              { id: 'licensing', label: 'Licenças Automatizadas', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    isSelected 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-transparent'
                  }`}
                >
                  <Icon size={18} className={isSelected ? 'text-emerald-400' : 'text-slate-400'} /> 
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé Corporativo Exclusivo MAZZ / RAZGO */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-[10px] font-mono tracking-widest text-slate-500 text-center uppercase">
            Plataforma <span className="text-emerald-400 font-black drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">MAZZ</span>
          </div>
          <div className="text-[9px] font-mono text-slate-600 text-center mt-1">
            POWERED BY <span className="font-bold text-slate-400">RAZGO</span> &copy; 2026
          </div>
        </div>
      </aside>

      {/* --- CONTEÚDO OPERACIONAL --- */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full transition-all duration-300">
        
        {/* Topbar com Sinalizador de Sincronismo */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-lg">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors lg:hidden">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-lg font-black tracking-tight text-white capitalize">
                {activeTab === 'dashboard' ? 'Centro de Telemetria' : activeTab === 'companies' ? 'Módulo Cadastral' : 'Motor de Emissão Dinâmica'}
              </h2>
            </div>
          </div>

          {/* Filtro e Refresh do Motor PDF */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Pesquisar logs e registros..."
                className="w-64 pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-300 placeholder-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              onClick={triggerRefresh}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-emerald-400 transition-all active:scale-95 border border-slate-700/50"
              title="Sincronizar Relatórios"
            >
              <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </header>

        {/* Corpo da Aplicação */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          
          {/* --- BANNER DE ALERTA DE LICENCIAMENTO DO SOFTWARE (TRIAL 180 DIAS) --- */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-600/5 to-slate-900 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Clock size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Modo de Avaliação Comercial Ativo</h4>
                <p className="text-xs text-slate-400 mt-0.5">Período Trial de 180 dias. Emissão de documentos oficiais garantida.</p>
              </div>
            </div>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-md border border-amber-500/30">
              Restam 180 Dias
            </span>
          </div>

          {/* --- TAB: DASHBOARD PRINCIPAL --- */}
          {activeTab === 'dashboard' && (
            <>
              {/* Grid Viva de KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Empresas Cadastradas" value="43" icon={Building2} change="🏢 Monitoramento Ativo" type="default" />
                <MetricCard title="Licenças Emitidas" value="12" icon={Award} change="⚡ Validação Automática" type="success" />
                <MetricCard title="Alertas / Infrações" value="02" icon={AlertTriangle} change="⚠ Resposta Pendente" type="danger" />
                <MetricCard title="Fiscais em Campo" value="04" icon={Users} change="⏱ Gestão de Servidores" type="warning" />
              </div>

              {/* Módulos em Grid Dividida */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Lado Esquerdo: Últimas Empresas & Situação */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-emerald-500" />
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-white flex items-center gap-2 tracking-tight"><Zap size={18} className="text-emerald-400 animate-bounce" /> Situação Cadastral Ambiental</h3>
                    <button onClick={() => setActiveTab('companies')} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">Ver Painel Cadastral &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {companies.map(comp => (
                      <div key={comp.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">{comp.id}</span>
                            <p className="text-sm font-bold text-slate-200">{comp.name}</p>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-1">Setor: {comp.sector} • Última Vistoria: {comp.lastInspection}</p>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                          comp.status === 'Regular' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          comp.status === 'Notificado' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>{comp.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lado Direito: Histórico de Emissões Imutáveis (Transparência MAZZ) */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-emerald-500" />
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-white flex items-center gap-2 tracking-tight"><FileText size={18} className="text-purple-400" /> Atividades Recentes e Auditoria</h3>
                    <button onClick={() => setActiveTab('licensing')} className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline transition-colors">Ver Licenças &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {actions.map(action => (
                      <div key={action.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
                        <div className="truncate pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">{action.id}</span>
                            <p className="text-sm font-bold text-slate-200 truncate">{action.title}</p>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">Fiscal: {action.agent} • {action.date}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                          <Eye size={12} className="text-emerald-400" /> {action.views}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* --- TAB: CADASTRO DE EMPRESAS --- */}
          {activeTab === 'companies' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
              <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-xl text-white tracking-tight">Fichas Cadastrais Ambientais</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Histórico completo de vistorias e monitoramento regulatório municipal.</p>
                </div>
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
                  <Building2 size={15}/> Cadastrar Nova Empresa
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <th className="p-4 pl-6 w-32">ID</th>
                      <th className="p-4">Razão Social / Identificação</th>
                      <th className="p-4">Segmento de Atuação</th>
                      <th className="p-4">Última Ação de Campo</th>
                      <th className="p-4 text-center">Status Ambiental</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-300">
                    {filteredCompanies.length > 0 ? (filteredCompanies.map(comp => (
                      <tr key={comp.id} className="hover:bg-slate-950/40 transition-colors group">
                        <td className="p-4 pl-6 font-mono font-black text-emerald-400">{comp.id}</td>
                        <td className="p-4 font-bold text-white group-hover:text-emerald-400 transition-colors">{comp.name}</td>
                        <td className="p-4 text-slate-400">{comp.sector}</td>
                        <td className="p-4 text-slate-500">{comp.lastInspection}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            comp.status === 'Regular' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 
                            comp.status === 'Notificado' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 
                            'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              comp.status === 'Regular' ? 'bg-emerald-400' : 
                              comp.status === 'Notificado' ? 'bg-amber-400' : 'bg-rose-400'
                            }`} />
                            {comp.status}
                          </span>
                        </td>
                      </tr>
                    ))) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-700 font-bold">Nenhuma empresa localizada nos registros locais.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- TAB: LICENCIAMENTO AUTOMATIZADO --- */}
          {activeTab === 'licensing' && (
            <div className="space-y-6">
              
              {/* Painel do Motor Dinâmico de Impressão */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-emerald-300 tracking-tight">Motor Unificado de Geração Dinâmica de PDFs</h3>
                    <p className="text-sm text-slate-400 max-w-2xl">
                      Geração de documentos oficiais imutáveis com marcas d'água estruturadas via ReportLab/WeasyPrint e QR Code de autenticação integrado.
                    </p>
                  </div>
                  <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-4 text-center shadow-inner shrink-0 flex items-center gap-3">
                    <QrCode size={32} className="text-cyan-400 bg-slate-900 p-1 rounded-md border border-slate-800" />
                    <div className="text-left">
                      <span className="text-[10px] uppercase tracking-widest block text-emerald-400 font-black">Integridade Ativa</span>
                      <span className="text-xs font-mono font-bold text-white">Bloqueio de Pós-Emissão</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela de Licenças Emitidas */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">Licenças Ambientais Emitidas</h3>
                    <p className="text-xs text-slate-500">Controle automático de janelas de validade e prazos regulatórios.</p>
                  </div>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5">
                    + Emitir Nova Licença
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <th className="p-4 pl-6">Código do Processo</th>
                        <th className="p-4">Razão Social do Alvo</th>
                        <th className="p-4">Tipificação da Licença</th>
                        <th className="p-4">Data Limite / Validade</th>
                        <th className="p-4">Segurança Jurídica</th>
                        <th className="p-4 text-center pr-6">Ações Oficiais</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-300">
                      {filteredLicenses.length > 0 ? (filteredLicenses.map(lic => (
                        <tr key={lic.id} className="hover:bg-slate-950/40 transition-colors group">
                          <td className="p-4 pl-6 font-mono font-black text-emerald-400">{lic.id}</td>
                          <td className="p-4 font-bold text-white group-hover:text-emerald-400 transition-colors">{lic.company}</td>
                          <td className="p-4">
                            <span className="bg-slate-950 px-2.5 py-1 rounded-md text-xs text-cyan-400 font-bold border border-slate-800">
                              {lic.type}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 font-mono text-xs">{lic.expires}</td>
                          <td className="p-4">
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                              <Lock size={12} className="text-purple-400" /> {lic.security}
                            </span>
                          </td>
                          <td className="p-4 text-center pr-6">
                            <button className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-emerald-400 hover:text-emerald-300 transition-all active:scale-95 group-hover:border-emerald-500/30" title="Baixar PDF Autenticado">
                              <Download size={14} className="inline mr-1" /> <span className="text-xs font-bold font-sans uppercase">PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))) : (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-slate-700 font-bold">Nenhuma licença correspondente emitida até o momento.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}