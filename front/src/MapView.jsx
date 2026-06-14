import React from "react";
import { useNavigate } from "react-router-dom";
import MapaBase from "../components/MapaBase";
import { Plus, List, LogOut, BarChart3 } from "lucide-react";

export default function MapView() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="relative h-screen w-full flex flex-col">
      {/* Cabeçalho mobile super denso */}
      <header className="bg-primary text-white p-4 flex justify-between items-center z-10 shadow-md">
        <h1 className="font-bold">Mapa de Fiscalização</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white/20 rounded-lg active:bg-white/30"
            aria-label="Dashboard"
          >
            <BarChart3 size={20} />
          </button>
          <button
            onClick={() => navigate("/autuacoes")}
            className="p-2 bg-white/20 rounded-lg active:bg-white/30"
            aria-label="Minhas Autuações"
          >
            <List size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500/80 rounded-lg active:bg-red-600 shadow-sm"
            aria-label="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 bg-gray-200 relative">
        <MapaBase />
      </div>

      <button
        onClick={() => navigate("/nova-ocorrencia")}
        className="absolute bottom-6 right-6 bg-secondary text-primary p-4 rounded-full shadow-xl active:scale-90 transition-transform z-10"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
