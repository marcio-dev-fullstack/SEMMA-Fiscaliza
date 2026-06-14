import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";

export default function DetalhesAutuacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detalhes, setDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const response = await fetch(
          `http://localhost:8000/api/ocorrencias/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar os detalhes da autuação");
        }

        const data = await response.json();
        setDetalhes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhes();
  }, [id]);

  const handleConcluir = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/ocorrencias/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Concluído" }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o status");
      }

      // Atualiza o estado local para refletir a mudança instantaneamente
      setDetalhes({ ...detalhes, status: "Concluído" });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExcluir = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta denúncia definitivamente?",
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/ocorrencias/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir a denúncia");
      }

      navigate("/autuacoes", { replace: true });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col print:bg-white">
      <header className="bg-primary text-white p-4 flex items-center gap-4 print:hidden">
        <button onClick={() => navigate(-1)} className="font-bold text-xl">
          &larr;
        </button>
        <h1 className="font-bold">Detalhes da Ocorrência</h1>
      </header>
      <main className="p-4 flex flex-col gap-4">
        {loading && (
          <p className="text-center text-gray-500 mt-4">Carregando...</p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {detalhes && (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary flex flex-col gap-5 print:shadow-none print:border-none print:p-0 print:text-black">
            {/* Cabeçalho exclusivo para o PDF */}
            <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-4">
              <h1 className="text-2xl font-bold uppercase">
                Prefeitura de Conceição do Araguaia
              </h1>
              <h2 className="text-xl font-semibold">
                Secretaria Municipal de Meio Ambiente - SEMMA
              </h2>
              <div className="mt-4">
                <span className="text-lg font-bold uppercase border-2 border-black px-4 py-2">
                  Auto de Infração Nº {String(id).padStart(5, "0")}
                </span>
              </div>
            </div>

            <div className="hidden print:block text-right text-sm font-semibold mb-2">
              Data da Autuação:{" "}
              {new Date(detalhes.data_criacao).toLocaleString("pt-BR")}
            </div>

            <div>
              <h2 className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Tipo de Crime
              </h2>
              <p className="text-xl font-bold text-gray-900 leading-tight">
                {detalhes.tipo_crime}
              </p>
            </div>

            <div>
              <h2 className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Status
              </h2>
              <span
                className={`inline-block mt-1 text-sm font-bold px-3 py-1 rounded-full ${detalhes.status === "Pendente" ? "bg-secondary text-gray-900" : "bg-green-100 text-primary"}`}
              >
                {detalhes.status}
              </span>
            </div>

            <div>
              <h2 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Descrição
              </h2>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {detalhes.descricao}
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${detalhes.latitude},${detalhes.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg border border-blue-100 active:scale-[0.98] transition-transform cursor-pointer hover:bg-blue-100"
            >
              <div>
                <h2 className="text-xs text-blue-600 uppercase font-bold tracking-wider">
                  Latitude
                </h2>
                <p className="text-gray-900 font-mono font-semibold">
                  {detalhes.latitude.toFixed(6)}
                </p>
              </div>
              <div>
                <h2 className="text-xs text-blue-600 uppercase font-bold tracking-wider">
                  Longitude
                </h2>
                <p className="text-gray-900 font-mono font-semibold">
                  {detalhes.longitude.toFixed(6)}
                </p>
              </div>
              <div className="col-span-2 text-center text-xs text-blue-500 font-semibold mt-1 print:hidden">
                📍 Toque para abrir no Google Maps
              </div>
            </a>

            {detalhes.foto_url && (
              <div>
                <h2 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
                  Evidência Fotográfica
                </h2>
                <img
                  src={`http://localhost:8000${detalhes.foto_url}`}
                  alt="Evidência da infração"
                  className="w-full max-h-64 object-cover rounded-lg border border-gray-200 shadow-sm print:max-h-96"
                />
              </div>
            )}

            {detalhes.status !== "Concluído" && (
              <button
                onClick={handleConcluir}
                className="w-full bg-primary text-white font-bold py-4 rounded-lg mt-2 shadow-md active:scale-95 transition-transform print:hidden"
              >
                Marcar como Concluído
              </button>
            )}

            {role === "admin" && (
              <button
                onClick={handleExcluir}
                className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-4 rounded-lg mt-2 shadow-sm active:scale-95 transition-transform print:hidden"
              >
                Excluir Denúncia
              </button>
            )}

            {/* Botão de impressão */}
            <button
              onClick={() => window.print()}
              className="w-full bg-gray-800 text-white font-bold py-4 rounded-lg mt-2 shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 print:hidden"
            >
              <Printer size={20} />
              Gerar PDF do Auto de Infração
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
