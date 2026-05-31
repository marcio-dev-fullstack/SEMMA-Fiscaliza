import React, { useState } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  BarChart3, 
  Search, 
  CheckCircle, 
  Clock, 
  Menu, 
  X,
  RefreshCw,
  Award,
  Building2,
  Lock,
  Download,
  QrCode,
  Zap,
  Printer,
  FileCheck,
  UserCheck
} from 'lucide-react';

// --- CARD DE MÉTRICA EMPRESARIAL ---
const MetricCard = ({ title, value, icon: Icon, change, type = 'default' }) => {
  const styles = {
    default: {
      bg: 'bg-slate-50 border-slate-200 text-slate-700',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      badge: 'bg-blue-50 text-blue-700 border border-blue-100'
    },
    success: {
      bg: 'bg-slate-50 border-slate-200 text-slate-700',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    },
    warning: {
      bg: 'bg-slate-50 border-slate-200 text-slate-700',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      badge: 'bg-amber-50 text-amber-700 border border-amber-100'
    }
  };

  return (
    <div className={`bg-white p-5 rounded-xl border ${styles[type].bg} shadow-sm transition-all flex items-start justify-between`}>
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        {change && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md inline-block ${styles[type].badge}`}>
            {change}
          </span>
        )}
      </div>
      <div className={`p-2.5 rounded-lg ${styles[type].iconBg}`}>
        <Icon size={18} />
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [printingId, setPrintingId] = useState(null);

  // --- DADOS DO USUÁRIO LOGADO (MÓDULO DE GESTÃO DE SERVIDORES) ---
  const [currentUser] = useState({
    name: 'Márcio Rodrigues de Oliveira',
    role: 'Engenheiro Civil / Fiscal Municipal'
  });

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handlePrintSimulation = (id) => {
    setPrintingId(id);
    setTimeout(() => setPrintingId(null), 1200);
  };

  // --- MÓDULO: CADASTRO DE EMPRESAS ---
  const [companies] = useState([
    { id: 'EMP-041', name: 'Mineração Vale do Araguaia', sector: 'Industrial', status: 'Regular', doc: 'LO' },
    { id: 'EMP-042', name: 'Lava-Jato Daiane', sector: 'Serviços / Comercial', status: 'Notificado', doc: 'LO' },
    { id: 'EMP-043', name: 'Madeireira Progresso Regional', sector: 'Florestal', status: 'Irregular', doc: 'LI' },
  ]);

  // --- MÓDULO: LICENCIAMENTO AUTOMATIZADO (LP, LI, LO) ---
  const [licenses] = useState([
    { id: 'LIC-LO-2026', company: 'Lava-Jato Daiane', type: 'LO (Operação)', status: 'Emitido', token: 'QR-A48B', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
    { id: 'LIC-LI-2092', company: 'Construtora Leste PA', type: 'LI (Instalação)', status: 'Emitido', token: 'QR-F92C', color: 'text-blue-700 border-blue-200 bg-blue-50' },
    { id: 'LIC-LP-1054', company: 'Indústria AgroGerais', type: 'LP (Prévia)', status: 'Pendente', token: 'QR-B12A', color: 'text-amber-700 border-amber-200 bg-amber-50' },
  ]);

  const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredLicenses = licenses.filter(l => l.company.toLowerCase().includes(searchTerm.toLowerCase()) || l.type.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- SIDEBAR CORPORATIVA --- */}
      <aside className={`bg-slate-900 fixed inset-y-0 left-0 z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out border-r border-slate-800 flex flex-col justify-between shadow-sm`}>
        <div>
          {/* Header Institucional */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h1 className="font-bold text-sm uppercase tracking-wider text-white leading-none">Fiscaliza</h1>
                <span className="text-[10px] text-slate-400 font-medium tracking-widest block mt-1">AMBIENTAL</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Perfil Simplificado na Sidebar */}
          <div className="p-4 mx-3 mt-4 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-slate-800 text-blue-400 rounded-lg shrink-0">
              <UserCheck size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</p>
              <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{currentUser.role}</p>
            </div>
          </div>

          {/* Menus de Navegação */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Painel de Licenciamento', icon: BarChart3 },
              { id: 'companies', label: 'Cadastro de Empresas', icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <Icon size={16} /> 
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé Administrativo */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-center">
          <p className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
            Plataforma <span className="text-slate-300 font-bold">MAZZ</span>[cite: 1]
          </p>
          <p className="text-[10px] font-mono text-slate-600 mt-0.5">
            Desenvolvido por <span className="text-slate-400 font-semibold">RAZGO</span>[cite: 1]
          </p>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL (EMPRESARIAL BRANCO) --- */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full">
        
        {/* Topbar Corporativa */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-800 lg:hidden">
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                {activeTab === 'dashboard' ? 'Atos Autorizativos Homologados' : 'Gestão de Cadastros Ambientais'}[cite: 1]
              </h2>
            </div>
          </div>

          {/* Identificação e Pesquisa */}
          <div className="flex items-center gap-6">
            {/* Bloco do Usuário Ativo com Cargo na Topbar */}
            <div className="hidden sm:flex flex-col text-right border-r border-slate-200 pr-4">
              <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{currentUser.role}</span>
            </div>

            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Filtrar processos vigentes..."
                className="w-56 pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={triggerRefresh} 
              className="p-1.5 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 rounded-lg shadow-sm"
              title="Sincronizar APIs"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-blue-600' : ''} />
            </button>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          
          {/* AVISO DO PERÍODO COMERCIAL (TRIAL) */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><Clock size={16} /></div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Licença de Uso Comercial Ativa</h4>
                <p className="text-xs text-slate-500 mt-0.5">Emissão automatizada via WeasyPrint e ReportLab liberada para o município[cite: 1].</p>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-amber-200">
              180 dias restantes[cite: 1]
            </span>
          </div>

          {activeTab === 'dashboard' && (
            <>
              {/* INDICADORES EXCLUSIVOS DE LICENÇAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard title="Total de Licenças" value="12" icon={Award} change="Atos Regulatórios" type="success" />
                <MetricCard title="Licença Prévia (LP)" value="04" icon={FileText} change="Análise de Viabilidade" type="warning" />
                <MetricCard title="Licença Instalação (LI)" value="03" icon={FileCheck} change="Fase de Implantação" type="default" />
                <MetricCard title="Licença Operação (LO)" value="05" icon={Zap} change="Atividades Autorizadas" type="success" />
              </div>

              {/* SEÇÃO DA DASHBOARD: MOTOR DE DOCUMENTOS */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Award size={16} className="text-blue-600" /> Emissão Unificada de Licenças Ambientais (LP, LI, LO)[cite: 1]
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Impressão autenticada e imutável de atos regulatórios com chaves de segurança individuais[cite: 1].</p>
                </div>

                {/* GRID DE LICENÇAS DISPONÍVEIS */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5 bg-white">
                  {filteredLicenses.map((lic) => (
                    <div 
                      key={lic.id} 
                      className="bg-white rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between relative overflow-hidden shadow-sm group"
                    >
                      {/* MARCA D'ÁGUA REQUERIDA NO FUNDO DO CARD */}
                      <div className="absolute -right-3 -bottom-3 opacity-[0.04] text-slate-900 font-extrabold select-none pointer-events-none text-6xl uppercase tracking-tighter">
                        {lic.type.split(' ')[0]}[cite: 1]
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${lic.color}`}>
                            {lic.type}[cite: 1]
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">{lic.id}</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{lic.company}[cite: 1]</h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <Lock size={12} className="text-slate-400" /> Campos protegidos pós-emissão[cite: 1]
                        </p>
                      </div>

                      {/* EXTRAÇÃO E AUTENTICIDADE */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                          <QrCode size={14} className="text-slate-500" />[cite: 1]
                          <div className="text-[9px] font-mono leading-tight">
                            <span className="text-slate-400 block uppercase">Token</span>
                            <span className="text-slate-700 font-bold">{lic.token}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handlePrintSimulation(lic.id)}
                          disabled={printingId !== null || lic.status === 'Pendente'}
                          className={`px-2.5 py-1.5 rounded text-xs font-semibold tracking-wide flex items-center gap-1.5 border transition-all ${
                            lic.status === 'Pendente' 
                              ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm'
                          }`}
                        >
                          {printingId === lic.id ? (
                            <>
                              <Printer size={12} className="animate-pulse" />
                              <span>Compilando...</span>
                            </>
                          ) : (
                            <>
                              <Download size={12} />
                              <span>Gerar PDF</span>[cite: 1]
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB: CADASTRO DE EMPRESAS */}
          {activeTab === 'companies' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-bold text-sm text-slate-800">Cadastro de Contribuintes</h3>
                <p className="text-xs text-slate-500 mt-0.5">Relação cadastral completa de empresas monitoradas no município[cite: 1].</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                      <th className="p-3 pl-5 w-32">ID</th>
                      <th className="p-3">Razão Social / Alvo</th>
                      <th className="p-3">Segmento</th>
                      <th className="p-3">Documento Base</th>
                      <th className="p-3 text-center">Situação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                    {filteredCompanies.length > 0 ? (filteredCompanies.map(comp => (
                      <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 pl-5 font-mono font-bold text-blue-600">{comp.id}</td>
                        <td className="p-3 font-semibold text-slate-800">{comp.name}[cite: 1]</td>
                        <td className="p-3 text-slate-500">{comp.sector}[cite: 1]</td>
                        <td className="p-3 font-mono text-xs text-blue-500 font-bold">{comp.doc}[cite: 1]</td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            comp.status === 'Regular' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                            comp.status === 'Notificado' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>{comp.status}[cite: 1]</span>
                        </td>
                      </tr>
                    ))) : (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-slate-400 font-semibold">Nenhum registro encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}