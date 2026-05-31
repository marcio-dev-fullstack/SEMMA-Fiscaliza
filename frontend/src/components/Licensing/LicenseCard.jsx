// src/components/Licensing/LicenseCard.jsx
const statusStyles = {
  LP: 'bg-blue-100 text-blue-800 border-blue-200',
  LI: 'bg-orange-100 text-orange-800 border-orange-200',
  LO: 'bg-green-100 text-green-800 border-green-200',
};

export const LicenseCard = ({ process }) => (
  <div className="p-4 bg-white rounded-lg shadow border-l-4 border-l-emerald-500 mb-3">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-gray-700">{process.companyName}</h3>
      <span className={`px-2 py-1 rounded text-xs font-bold ${statusStyles[process.type]}`}>
        {process.type}
      </span>
    </div>
    <p className="text-sm text-gray-500">Protocolo: {process.id}</p>
    <div className="mt-4 flex gap-2">
      <button className="text-sm bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700">
        Gerar PDF
      </button>
      <button className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
        Detalhes
      </button>
    </div>
  </div>
);