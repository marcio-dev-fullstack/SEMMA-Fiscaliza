import React, { useState } from 'react';
import { MapPinIcon, CameraIcon, ClipboardDocumentCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ModuloFiscalizacao = () => {
  const [loadingGps, setLoadingGps] = useState(false);
  const [formData, setFormData] = useState({ coordenadas: '' });

  const capturarLocalizacao = () => {
    setLoadingGps(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData({ coordenadas: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` });
        setLoadingGps(false);
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-emerald-800 p-6 rounded-xl text-white shadow-lg">
        <h1 className="text-xl font-bold flex items-center gap-2 uppercase tracking-widest text-white">
          <ClipboardDocumentCheckIcon className="h-6 w-6" />
          Vistoria Técnica de Campo
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Empreendimento</label>
          <input type="text" className="w-full border-gray-200 rounded-lg p-2.5 bg-gray-50" placeholder="Nome da Obra/Empresa" />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Coordenadas GPS</label>
            <input type="text" readOnly value={formData.coordenadas} className="w-full border-gray-200 rounded-lg bg-gray-100 p-2.5 font-mono text-sm" placeholder="Aguardando captura..." />
          </div>
          <button onClick={capturarLocalizacao} className="mt-5 bg-emerald-100 text-emerald-700 px-4 rounded-lg hover:bg-emerald-200">
            {loadingGps ? "..." : <MapPinIcon className="h-5 w-5" />}
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Parecer do Fiscal</label>
          <textarea className="w-full border-gray-200 rounded-lg p-2.5 bg-gray-50" rows="4"></textarea>
        </div>

        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl shadow-lg transition-all uppercase flex items-center justify-center gap-2">
          <CheckCircleIcon className="h-6 w-6" />
          Finalizar Relatório
        </button>
      </div>
    </div>
  );
};

export default ModuloFiscalizacao;