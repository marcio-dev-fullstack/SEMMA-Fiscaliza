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
  MapPin,
  Flame,
  Leaf,
  Layers,
  Filter
} from 'lucide-react';

// --- CARD DE MÉTRICA DINÂMICO E VIVO ---
const MetricCard = ({ title, value, icon: Icon, change, type = 'default' }) => {
  const styles = {
    default: {
      bg: 'from-cyan-500/20 to-blue-600/5 border-cyan-500/30 text-cyan-400',
      iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/40 text-slate-950',
      badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
    },
    success: {
      bg: 'from-emerald-500/20 to-teal-600/5 border-emerald-500/30 text-emerald-400',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/40 text-slate-950',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    },
    warning: {
      bg: 'from-amber-500/20 to-orange-600/5 border-amber-500/30 text-amber-400',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/40 text-slate-950',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    },
    danger: {
      bg: 'from-rose-500/20 to-red-600/5 border-rose-500/30 text-rose-400',
      iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/40 text-slate-950',
      badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    },
  };

  return (
    <div className={`bg-gradient-to-br ${styles[type].bg} backdrop-blur-md p-6 rounded-2xl border shadow-xl shadow-slate-950/40 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex items-start justify-between group`}>
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">{value}</h3>
        {change && (
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-block ${styles[type].badge}`}>
            {change}
          </span>
        )}
      </div>
      <div className={`p-3.5 rounded-xl ${styles[type].iconBg} shadow-lg group-hover:rotate-12 transition-transform duration-300 font-bold`}>
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

  // Gatilho visual de sincronização
  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // --- DADOS DO ESCOPO SEMMA-FISCALIZA ---
  const [occurrences] = useState([
    { id: 'OC-2026-081', local: 'Setor Industrial', type: 'Descarte Irregular', risk: 'Alto', agent: 'M. Oliveira', status: 'Em Campo' },
    { id: 'OC-2026-082', local: 'Zona Rural Leste', type: 'Supressão Vegetal', risk: 'Crítico', agent: 'K. Quadros', status: 'Atrasado' },
    { id: 'OC-2026-083', local: 'Perímetro Urbano Central', type: 'Poluição Sonora', risk: 'Baixo', agent: 'Carlos S.', status: 'Concluído' },
    { id: 'OC-2026-084', local: 'Margem do Rio Araguaia', type: 'Captação Comercial Irregular', risk: 'Alto', agent: 'M. Oliveira', status: 'Planejado' },
  ]);

  // Histórico de Ações Coletivas / Auditoria Interna (Estrutura Digital MAZZ / RAZGO)
  const [actions] = useState([
    { id: 'Ação #01', title: 'Análise do Plano de Controle Ambiental - PCA (Lava-Jato Daiane)', category: 'Licenciamento', status: 'Concluído', date: '28/05/2026', views: 245 },
    { id: 'Ação #02', title: 'Vistoria de Campo e Delimitação Georreferenciada de Lote Comercial', category: 'Fiscalização', status: 'Em Andamento', date: '29/05/2026', views: 412 },
    { id: 'Ação #03', title: 'Auditoria de Emissão de Pareceres Técnicos e Licenças Ambientais', category: 'Transparência', status: 'Análise', date: '30/05/2026', views: 134 },
  ]);

  const filteredOccurrences = occurrences.filter(o => o.local.toLowerCase().includes(searchTerm.toLowerCase()) || o.type.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredActions = actions.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-emerald-500 selection:text-slate-900">
      
      {/* --- SIDEBAR BIO-CYBERPUNK --- */}
      <aside className={`bg-slate-900 fixed inset-y-0 left-0 z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-out border-r border-slate-800 flex flex-col justify-between shadow-2xl shadow-black`}>
        <div>
          {/* Header SEMMA */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 p-2 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20 animate-pulse">
                <Leaf size={20} />
              </div>
              <div>
                <h1 className="font-black text-base uppercase tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SEMMA Fiscaliza</h1>
                <span className="text-[10px] text-emerald-400 font-bold tracking-widest block -mt-0.5">PLATAFORMA MAZZ</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Links de Navegação com Bordas Ativas */}
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Painel de Controle', icon: BarChart3 },
              { id: 'inspections', label: 'Vistorias e Campo', icon: ShieldAlert },
              { id: 'licensing', label: 'Controle Ambiental', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    isSelected 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5' 
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

        {/* Assinatura de Desenvolvimento RAZGO */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-widest text-slate-500">
            DEVELOPED BY <span className="text-emerald-400 font-black drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">RAZGO</span> 2026
          </div>
        </div>
      </aside>

      {/* --- CONTEÚDO OPERACIONAL PRINCIPAL --- */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full transition-all duration-300">
        
        {/* Topbar Dinâmica */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-lg">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors lg:hidden">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-lg font-black tracking-tight text-white capitalize">
                {activeTab === 'dashboard' ? 'Centro de Operações' : activeTab === 'inspections' ? 'Monitor de Ocorrências' : 'Análise de Licenciamento'}
              </h2>
            </div>
          </div>

          {/* Busca contextualizada e Ações */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Filtrar eventos em tempo real..."
                className="w-64 pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-300 placeholder-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              onClick={triggerRefresh}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-emerald-400 transition-all active:scale-95 border border-slate-700/50"
              title="Sincronizar Banco"
            >
              <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </header>

        {/* Corpo do Painel */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          
          {/* --- VIEW: DASHBOARD PRINCIPAL --- */}
          {activeTab === 'dashboard' && (
            <>
              {/* Grid Ultra Neon de Indicadores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Áreas Monitoradas" value="14" icon={MapPin} change="📍 Cobertura Total" type="default" />
                <MetricCard title="Alertas Críticos" value="01" icon={Flame} change="🔥 Resposta Urgente" type="danger" />
                <MetricCard title="Processos Deferidos" value="09" icon={CheckCircle} change="✓ Em Conformidade" type="success" />
                <MetricCard title="Vistorias Pendentes" value="03" icon={Clock} change="⏱ Cronograma Semanal" type="warning" />
              </div>

              {/* Divisões de Monitoramento Interno */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Lado Esquerdo: Ocorrências de Campo */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-emerald-500" />
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-white flex items-center gap-2 tracking-tight"><Zap size={18} className="text-emerald-400 animate-bounce" /> Despacho de Viaturas (Live)</h3>
                    <button onClick={() => setActiveTab('inspections')} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">Mapa de Campo &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {occurrences.slice(0, 3).map(occ => (
                      <div key={occ.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-black text-slate-400">{occ.id}</span>
                            <p className="text-sm font-bold text-slate-200">{occ.type}</p>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">Local: {occ.local} • Fiscal: {occ.agent}</p>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                          occ.risk === 'Crítico' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                          occ.risk === 'Alto' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}>{occ.risk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lado Direito: Linha de Auditoria / Transparência Social MAZZ */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-emerald-500" />
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-white flex items-center gap-2 tracking-tight"><FileText size={18} className="text-purple-400" /> Auditoria e Controle Coletivo</h3>
                    <button onClick={() => setActiveTab('licensing')} className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline transition-colors">Ver Atas &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {actions.map(action => (
                      <div key={action.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
                        <div className="truncate pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">{action.id}</span>
                            <p className="text-sm font-bold text-slate-200 truncate">{action.title}</p>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{action.category} • {action.date}</p>
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

          {/* --- VIEW: MONITOR DE OCORRÊNCIAS DE CAMPO --- */}
          {activeTab === 'inspections' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-xl text-white tracking-tight">Painel de Eventos Ativos</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Triagem de denúncias e relatórios georreferenciados.</p>
                </div>
                <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
                  <AlertTriangle size={15}/> Lançar Alerta de Infração
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <th className="p-4 pl-6 w-32">Código</th>
                      <th className="p-4">Tipificação Legal</th>
                      <th className="p-4">Localização / Alvo</th>
                      <th className="p-4">Fiscal Responsável</th>
                      <th className="p-4 text-center">Status Operacional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-300">
                    {filteredOccurrences.length > 0 ? (filteredOccurrences.map(occ => (
                      <tr key={occ.id} className="hover:bg-slate-950/40 transition-colors group">
                        <td className="p-4 pl-6 font-mono font-black text-emerald-400">{occ.id}</td>
                        <td className="p-4 font-bold text-white group-hover:text-emerald-400 transition-colors">{occ.type}</td>
                        <td className="p-4 text-slate-400">{occ.local}</td>
                        <td className="p-4"><span className="bg-slate-950 px-2.5 py-1 rounded-md text-xs text-slate-300 border border-slate-800">{occ.agent}</span></td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            occ.status === 'Em Campo' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 
                            occ.status === 'Atrasado' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 
                            occ.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              occ.status === 'Em Campo' ? 'bg-blue-400' : 
                              occ.status === 'Atrasado' ? 'bg-rose-400' : 
                              occ.status === 'Concluído' ? 'bg-emerald-400' : 'bg-slate-500'
                            }`} />
                            {occ.status}
                          </span>
                        </td>
                      </tr>
                    ))) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-700 font-bold">Nenhum evento registrado no perímetro selecionado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- VIEW: LICENCIAMENTO E CONTROLE (MAZZ / RAZGO) --- */}
          {activeTab === 'licensing' && (
            <div className="space-y-6">
              
              {/* Banner Técnico do PCA */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-emerald-300 tracking-tight">Módulo de Transparência de Estudos Ambientais</h3>
                    <p className="text-sm text-slate-400 max-w-2xl">
                      Listagem cronológica espelhada de vistorias, laudos de PCA (Planos de Controle Ambiental) e relatórios de conformidade urbana.
                    </p>
                  </div>
                  <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-3 text-center shadow-inner">
                    <span className="text-[10px] uppercase tracking-widest block text-emerald-400 font-black">Ordenação de Atas</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">Ação #01 &rarr; Ativa</span>
                  </div>
                </div>
              </div>

              {/* Tabela de Auditorias */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">Eventos Cronológicos Auditados</h3>
                    <p className="text-xs text-slate-500">Histórico unificado em conformidade com as diretrizes de transparência municipal.</p>
                  </div>
                  <button className="bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors border border-slate-700">
                    <Filter size={14} className="inline mr-1" /> Filtrar Categoria
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <th className="p-4 pl-6 w-28">Código</th>
                        <th className="p-4">Alvo / Objeto da Ação</th>
                        <th className="p-4">Segmento</th>
                        <th className="p-4">Publicado Em</th>
                        <th className="p-4">Acessos Públicos</th>
                        <th className="p-4 text-right pr-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-300">
                      {filteredActions.length > 0 ? (filteredActions.map(action => (
                        <tr key={action.id} className="hover:bg-slate-950/40 transition-colors group">
                          <td className="p-4 pl-6 font-mono font-black text-emerald-400">{action.id}</td>
                          <td className="p-4 font-bold text-white max-w-xs md:max-w-md truncate group-hover:text-emerald-300 transition-colors">{action.title}</td>
                          <td className="p-4"><span className="bg-slate-950 px-2.5 py-1 rounded-md text-xs text-slate-400 border border-slate-800">{action.category}</span></td>
                          <td className="p-4 text-slate-500">{action.date}</td>
                          <td className="p-4">
                            <span className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
                              <TrendingUp size={13} className="text-emerald-400"/>
                              {action.views} visualizações
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                              action.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              action.status === 'Em Andamento' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-400'
                            }`}>{action.status}</span>
                          </td>
                        </tr>
                      ))) : (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-slate-700 font-bold">Nenhum evento registrado.</td>
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