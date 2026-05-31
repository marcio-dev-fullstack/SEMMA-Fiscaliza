import React from 'react';
import { 
  DocumentCheckIcon, 
  ExclamationCircleIcon, 
  UserGroupIcon, 
  MapIcon 
} from '@heroicons/react/24/outline';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const Dashboard = () => {
  // Mock de dados para os gráficos (Em breve via FastAPI)
  const dataProducao = [
    { name: 'Jan', licencas: 40, vistorias: 24 },
    { name: 'Fev', licencas: 30, vistorias: 13 },
    { name: 'Mar', licencas: 20, vistorias: 38 },
    { name: 'Abr', licencas: 27, vistorias: 39 },
  ];

  const dataStatus = [
    { name: 'LP', value: 400, color: '#3b82f6' },
    { name: 'LI', value: 300, color: '#f59e0b' },
    { name: 'LO', value: 300, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Saudação e Contexto */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase">Painel de Controle</h1>
          <p className="text-gray-500 font-medium italic">Monitoramento em tempo real - Conceição do Araguaia/PA</p>
        </div>
        <div className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          Status do Sistema: Operacional
        </div>
      </div>

      {/* Cartões de Indicadores (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Processos Totais', val: '1.240', icon: DocumentCheckIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Vistorias Pendentes', val: '12', icon: ExclamationCircleIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Fiscais em Campo', val: '04', icon: UserGroupIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Área Monitorada', val: '85%', icon: MapIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.label}</p>
              <p className="text-2xl font-black text-gray-800">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Produção Mensal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-6 flex items-center gap-2">
            Produção Mensal (Licenças vs Vistorias)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataProducao}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f9fafb'}} />
                <Bar dataKey="licencas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="vistorias" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Distribuição de Tipos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-6">Distribuição por Tipo de Licença</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataStatus}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4">
              {dataStatus.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-700 uppercase">Últimas Atualizações em Campo</h3>
          <button className="text-xs font-bold text-emerald-600 hover:underline">Ver tudo</button>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { user: 'Fiscal João Silva', action: 'Relatório de Vistoria Enviado', local: 'Loteamento Central', time: 'Há 12 min' },
            { user: 'Eng. Márcio Oliveira', action: 'LP Deferida e Assinada', local: 'Posto Petrobras', time: 'Há 45 min' },
            { user: 'Sistema', action: 'Alerta de Vencimento de Licença LO', local: 'Indústria Têxtil', time: 'Há 2 horas' },
          ].map((act, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{act.action}</p>
                  <p className="text-xs text-gray-500">{act.user} • {act.local}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;