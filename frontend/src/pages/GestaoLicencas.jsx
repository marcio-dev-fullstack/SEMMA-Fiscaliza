import React, { useState } from 'react';
import { 
  PlusIcon, 
  DocumentMagnifyingGlassIcon, 
  ArrowDownTrayIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';

const GestaoLicencas = () => {
  // Mock de dados - Em breve integrado com seu FastAPI
  const [processos, setProcessos] = useState([
    { id: '2026.0001', empresa: 'Construtora Vale do Araguaia', tipo: 'LP', status: 'Em Análise', data: '15/04/2026', vencimento: '-' },
    { id: '2026.0042', empresa: 'Posto Petrobras CDA', tipo: 'LO', status: 'Deferido', data: '10/01/2026', vencimento: '10/01/2028' },
    { id: '2026.0089', empresa: 'Indústria de Laticínios Pará', tipo: 'LI', status: 'Vencido', data: '20/03/2025', vencimento: '20/03/2026' },
  ]);

  const getStatusBadge = (status) => {
    const styles = {
      'Deferido': 'bg-green-100 text-green-800 border-green-200',
      'Em Análise': 'bg-blue-100 text-blue-800 border-blue-200',
      'Vencido': 'bg-red-100 text-red-800 border-red-200',
      'Indeferido': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return styles[status] || styles['Indeferido'];
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho de Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Gestão de Licenciamento</h1>
          <p className="text-sm text-gray-500 font-medium">Monitoramento de LP, LI e LO</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all font-semibold shadow-md active:scale-95">
            <PlusIcon className="h-5 w-5" />
            Nova Licença
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all font-semibold shadow-sm">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            Filtros
          </button>
        </div>
      </div>

      {/* Grid de Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Licenças Ativas</p>
          <span className="text-3xl font-black text-emerald-600">124</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Aguardando Análise</p>
          <span className="text-3xl font-black text-blue-600">18</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Vencimento Próximo</p>
          <span className="text-3xl font-black text-amber-500">07</span>
        </div>
      </div>

      {/* Tabela de Processos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Protocolo</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Empreendimento</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tipo</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vencimento</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {processos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 font-mono text-sm text-gray-600 font-bold">{p.id}</td>
                <td className="p-4 font-semibold text-gray-700">{p.empresa}</td>
                <td className="p-4 text-center">
                  <span className="font-bold text-gray-900 px-2 py-1 bg-gray-100 rounded text-xs">{p.tipo}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">{p.vencimento}</td>
                <td className="p-4 text-right flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button title="Ver Detalhes" className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600">
                    <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                  <button title="Download PDF Oficial" className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestaoLicencas;