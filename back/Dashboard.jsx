import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const response = await fetch("http://localhost:8000/api/estatisticas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar os dados do dashboard");
        }

        const data = await response.json();
        setEstatisticas(data);
        // Pequeno atraso para a animação disparar após os dados renderizarem
        setTimeout(() => setAnimated(true), 100);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderBarChart = (dados, total, colorClass) => {
    if (!dados || dados.length === 0)
      return <p className="text-gray-500 text-sm">Sem dados suficientes.</p>;

    // Ordena do maior pro menor
    const sorted = [...dados].sort((a, b) => b.valor - a.valor);

    return sorted.map((item, index) => {
      const porcentagem =
        total > 0 ? Math.round((item.valor / total) * 100) : 0;
      return (
        <div key={index} className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-gray-700">{item.nome}</span>
            <span className="text-gray-500">
              {item.valor} ({porcentagem}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${colorClass} transition-all duration-1000 ease-out`}
              style={{ width: animated ? `${porcentagem}%` : "0%" }}
            ></div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-white p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="font-bold text-xl">
          &larr;
        </button>
        <h1 className="font-bold">Painel de Estatísticas</h1>
      </header>

      <main className="p-4 flex flex-col gap-6">
        {loading && (
          <p className="text-center text-gray-500 mt-4">
            Carregando métricas...
          </p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {estatisticas && (
          <>
            {/* Card de Total */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">
                Total de Denúncias
              </p>
              <p className="text-5xl font-black text-primary mt-2">
                {estatisticas.total}
              </p>
            </div>

            {/* Gráfico por Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                Por Status
              </h2>
              {renderBarChart(
                estatisticas.por_status,
                estatisticas.total,
                "bg-secondary",
              )}
            </div>

            {/* Gráfico por Tipo de Crime */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                Por Tipo de Infração
              </h2>
              {renderBarChart(
                estatisticas.por_tipo,
                estatisticas.total,
                "bg-primary",
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
