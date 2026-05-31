import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Users, 
  MapPin, 
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
  Bell
} from 'lucide-react';

// --- CARD DE MÉTRICA ULTRA VIVO ---
const MetricCard = ({ title, value, icon: Icon, change, type = 'default' }) => {
  const styles = {
    default: {
      bg: 'from-blue-500/20 to-indigo-600/5 border-blue-500/30 text-blue-400',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/40 text-white',
      badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    },
    success: {
      bg: 'from-emerald-500/20 to-teal-600/5 border-emerald-500/30 text-emerald-400',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/40 text-white',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    },
    warning: {
      bg: 'from-amber-500/20 to-orange-600/5 border-amber-500/30 text-amber-400',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/40 text-white',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    },
    danger: {
      bg: 'from-rose-500/20 to-red-600/5 border-rose-500/30 text-rose-400',
      iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/40 text-white',
      badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    },
  };

  return (
    <div className={`bg-gradient-to-br ${styles[type].bg} backdrop-blur-md p-6 rounded-2xl border shadow-xl shadow-slate-950/20 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex items-start justify-between group`}>
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">{value}</h3>
        {change && (
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-block ${styles[type].badge}`}>
            {change}
          </span>
        )}
      </div>
      <div className={`p-3.5 rounded-xl ${styles[type].iconBg} shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
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

  // Simulação de pulso/atualização ao vivo
  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const [routes] = useState([
    { id: 1, name: 'Rota 01 - Zona Rural Norte', driver: 'Carlos Silva', status: 'Em Rota', students: 42, delay: 'Nenhum' },
    { id: 2, name: 'Rota 02 - Setor Industrial', driver: 'Ana Oliveira', status: 'Atrasado', students: 28, delay: '15 min' },
    { id: 3, name: 'Rota 03 - Perímetro Urbano Central', driver: 'Marcos Souza', status: 'Concluído', students: 55, delay: 'Nenhum' },
    { id: 4, name: 'Rota 04 - Vila Rica Escolar', driver: 'João Costa', status: 'Manutenção', students: 0, delay: '-' },
  ]);

  const [actions] = useState([
    { id: 'Ação #01', title: 'Auditoria de Contratos de Combustível da Frota', category: 'Transparência', status: 'Concluído', date: '28/05/2026', views: 342 },
    { id: 'Ação #02', title: 'Fiscalização de Obras de Pavimentação Urbana', category: 'Infraestrutura', status: 'Em Andamento', date: '29/05/2026', views: 512 },
    { id: 'Ação #03', title: 'Análise de Repasses do PNATE (Transporte Escolar)', category: 'Fiscalização', status: 'Análise', date: '30/05/2026', views: 189 },
  ]);

  const filteredRoutes = routes.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.driver.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredActions = actions.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-slate-900">
      
      {/* --- SIDEBAR CYBERPUNK / PREMIUM --- */}
      <aside className={`bg-slate-900 fixed inset-y-0 left-0 z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-out border-r border-slate-800 flex flex-col justify-between shadow-2xl shadow-black`}>
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/30 animate-pulse">
                <Bus size={20} />
              </div>
              <div>
                <h1 className="font-black text-base uppercase tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">TransPorte CDA</h1>
                <span className="text-[10px] text-cyan-400 font-bold tracking-widest block -mt-0.5">SISTEMA MAZZ</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Links Emborrachados/Animados */}
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Painel Geral', icon: BarChart3 },
              { id: 'routes', label: 'Rotas e Telemetria', icon: MapPin },
              { id: 'fiscalization', label: 'Fiscalização Ativa', icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/5' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Icon size={18} className={isSelected ? 'text-cyan-400' : 'text-slate-400'} /> 
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé Tech */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-widest text-slate-500">
            ENGINE BY <span className="text-cyan-400 font-black drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">RAZGO</span> 2026
          </div>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL (DARK MODE VIVO) --- */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full transition-all duration-300">
        
        {/* Topbar Flutuante */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-lg">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors lg:hidden">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-lg font-black tracking-tight text-white capitalize">
                {activeTab === 'dashboard' ? 'Centro de Comando' : activeTab === 'routes' ? 'Radar de Operações' : 'Controle de Auditorias'}
              </h2>
            </div>
          </div>

          {/* Busca & Ações de Live Update */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Filtrar dados em tempo real..."
                className="w-64 pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-slate-300 placeholder-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Botão de Atualizar Dinâmico */}
            <button 
              onClick={triggerRefresh}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-cyan-400 transition-all active:scale-95 border border-slate-700/50"
              title="Forçar Atualização"
            >
              <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </header>

        {/* Corpo da Aplicação */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          
          {/* --- TAB: DASHBOARD --- */}
          {activeTab === 'dashboard' && (
            <>
              {/* Grid Ultra Neon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Alunos Atendidos" value="125" icon={Users} change="⚡ Status Online" type="success" />
                <MetricCard title="Frota em Movimento" value="3 / 4" icon={Bus} change="🚌 1 em Oficina" type="warning" />
                <MetricCard title="Ações Auditadas" value="01" icon={CheckCircle} change="✓ Inversão Concluída" type="default" />
                <MetricCard title="Alertas de Risco" value="1" icon={AlertTriangle} change="⚠ Verificar Rota 02" type="danger" />
              </div>

              {/* Seções em Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Esquerda: Painel de Monitoramento */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500" />
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-white flex items-center gap-2 tracking-tight"><Zap size={18} className="text-cyan-400 animate-bounce" /> Telemetria da Frota</h3>
                    <button onClick={() => setActiveTab('routes')} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">Painel Completo &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {routes.slice(0, 3).map(route => (
                      <div key={route.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-200">{route.name}</p>
                          <p className="text-xs text-slate-500 font-medium">Condutor: {route.driver}</p>
                        </div>
                        <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          route.status === 'Em Rota' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                          route.status === 'Atrasado' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>{route.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direita: Transparência Social */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500" />
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-white flex items-center gap-2 tracking-tight"><Bell size={18} className="text-purple-400" /> Linha do Tempo / Fiscal</h3>
                    <button onClick={() => setActiveTab('fiscalization')} className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline transition-colors">Auditar Todas &rarr;</button>
                  </div>
                  <div className="space-y-3">
                    {actions.map(action => (
                      <div key={action.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
                        <div className="truncate pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md">{action.id}</span>
                            <p className="text-sm font-bold text-slate-200 truncate">{action.title}</p>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{action.category} • {action.date}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                          <Eye size={12} className="text-cyan-400" /> {action.views}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* --- TAB: ROTAS --- */}
          {activeTab === 'routes' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
              <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-xl text-white tracking-tight">Monitor de Linhas Operacionais</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Visão unificada de tracking e contingências.</p>
                </div>
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95">
                  <MapPin size={15}/> Adicionar Nova Rota
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <th className="p-4 pl-6">Linha / Rota</th>
                      <th className="p-4">Motorista</th>
                      <th className="p-4">Capacidade Ocupada</th>
                      <th className="p-4">Janela de Atraso</th>
                      <th className="p-4 text-center">Status Operacional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-300">
                    {filteredRoutes.length > 0 ? (filteredRoutes.map(route => (
                      <tr key={route.id} className="hover:bg-slate-950/40 transition-colors group">
                        <td className="p-4 pl-6 font-bold text-white group-hover:text-cyan-400 transition-colors">{route.name}</td>
                        <td className="p-4 text-slate-400">{route.driver}</td>
                        <td className="p-4"><span className="bg-slate-950 px-2.5 py-1 rounded-md text-xs font-mono text-slate-300 border border-slate-800">{route.students} alunos</span></td>
                        <td className="p-4">
                          {route.delay !== 'Nenhum' && route.delay !== '-' ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1.5"><Clock size={14}/> {route.delay}</span>
                          ) : <span className="text-slate-600">{route.delay}</span>}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            route.status === 'Em Rota' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 
                            route.status === 'Atrasado' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 
                            route.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              route.status === 'Em Rota' ? 'bg-blue-400' : 
                              route.status === 'Atrasado' ? 'bg-amber-400' : 
                              route.status === 'Concluído' ? 'bg-emerald-400' : 'bg-slate-500'
                            }`} />
                            {route.status}
                          </span>
                        </td>
                      </tr>
                    ))) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-600 font-bold">Nenhum registro vivo encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- TAB: FISCALIZAÇÃO --- */}
          {activeTab === 'fiscalization' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Banner de Impacto */}
              <div className="bg-gradient-to-r from-purple-900/60 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-purple-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-purple-300 tracking-tight">Portal Integrado de Transparência Social</h3>
                    <p className="text-sm text-slate-400 max-w-2xl">
                      Listagem cronológica espelhada. Dados auditáveis pela população com integridade de visualizações garantida pelo ecossistema MAZZ.
                    </p>
                  </div>
                  <div className="bg-slate-950/80 border border-purple-500/20 rounded-xl p-3 text-center shadow-inner">
                    <span className="text-[10px] uppercase tracking-widest block text-purple-400 font-black">Sequência Corrigida</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">Ação #01 &rarr; Ativa</span>
                  </div>
                </div>
              </div>

              {/* Tabela de Ações */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">Eventos de Fiscalização Coletiva</h3>
                    <p className="text-xs text-slate-500">Histórico público ordenado de forma limpa.</p>
                  </div>
                  <button className="bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors border border-slate-700">
                    + Inserir Entrada
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <th className="p-4 pl-6 w-28">ID</th>
                        <th className="p-4">Alvo da Auditoria</th>
                        <th className="p-4">Segmento</th>
                        <th className="p-4">Publicado Em</th>
                        <th className="p-4">Engajamento Cívico</th>
                        <th className="p-4 text-right pr-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-300">
                      {filteredActions.length > 0 ? (filteredActions.map(action => (
                        <tr key={action.id} className="hover:bg-slate-950/40 transition-colors group">
                          <td className="p-4 pl-6 font-mono font-black text-purple-400">{action.id}</td>
                          <td className="p-4 font-bold text-white max-w-xs md:max-w-md truncate group-hover:text-purple-300 transition-colors">{action.title}</td>
                          <td className="p-4"><span className="bg-slate-950 px-2.5 py-1 rounded-md text-xs text-slate-400 border border-slate-800">{action.category}</span></td>
                          <td className="p-4 text-slate-500">{action.date}</td>
                          <td className="p-4">
                            <span className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
                              <TrendingUp size={13} className="text-emerald-400"/>
                              {action.views} acessos
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