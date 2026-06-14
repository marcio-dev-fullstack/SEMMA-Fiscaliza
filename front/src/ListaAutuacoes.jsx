import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardInfra from "../components/CardInfra";

export default function ListaAutuacoes() {
  const navigate = useNavigate();
  const [autuacoes, setAutuacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  useEffect(() => {
    const fetchAutuacoes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const response = await fetch("http://localhost:8000/api/ocorrencias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const data = await response.json();
        setAutuacoes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAutuacoes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-white p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="font-bold text-xl">
          &larr;
        </button>
        <h1 className="font-bold">Minhas Autuações</h1>
      </header>
      <main className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 text-sm">
            Filtrar por Tipo de Crime
          </label>
          <select
            className="p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Desmatamento">Desmatamento</option>
            <option value="Poluição Sonora">Poluição Sonora</option>
            <option value="Descarte Irregular">Descarte Irregular</option>
          </select>
        </div>

        {loading && (
          <p className="text-center text-gray-500 mt-4">
            Carregando autuações...
          </p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {!loading && !error && autuacoes.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            Nenhuma autuação registrada.
          </p>
        )}

        {autuacoes
          .filter(
            (autuacao) =>
              filtroTipo === "Todos" || autuacao.tipo_crime === filtroTipo,
          )
          .map((autuacao) => {
            // Converte o datetime que vem do FastAPI para o padrão de data brasileiro
            const dataFormatada = new Date(
              autuacao.data_criacao,
            ).toLocaleDateString("pt-BR");
            return (
              <CardInfra
                key={autuacao.id}
                tipo={autuacao.tipo_crime}
                data={dataFormatada}
                status={autuacao.status}
                onClick={() => navigate(`/autuacoes/${autuacao.id}`)}
              />
            );
          })}
      </main>
    </div>
  );
}
