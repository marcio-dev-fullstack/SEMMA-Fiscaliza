import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadButton from "../components/UploadButton";

export default function NovaOcorrencia() {
  const navigate = useNavigate();
  const [tipoCrime, setTipoCrime] = useState("Desmatamento");
  const [descricao, setDescricao] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // Obtém as coordenadas atuais do fiscal assim que a tela abre
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) =>
          setError("Não foi possível obter a localização. Verifique o GPS."),
        { enableHighAccuracy: true },
      );
    } else {
      setError("Geolocalização não suportada pelo seu navegador.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError("Aguarde a obtenção das coordenadas do GPS.");
      return;
    }
    if (!descricao) {
      setError("A descrição é obrigatória.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Usuário não autenticado. Faça login novamente.");

      // Usando FormData para suportar envio de arquivo junto com texto
      const formData = new FormData();
      formData.append("tipo_crime", tipoCrime);
      formData.append("descricao", descricao);
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);
      if (imageFile) {
        formData.append("foto", imageFile);
      }

      const response = await fetch("http://localhost:8000/api/ocorrencia", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // IMPORTANTE: Não defina o Content-Type manualmente ao usar FormData!
          // O navegador vai criar automaticamente o "multipart/form-data" com o limite (boundary) certo.
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar a ocorrência no servidor.");
      }

      // Sucesso! Volta para a tela do mapa para ver o novo ponto
      navigate("/mapa");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-white p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="font-bold text-xl">
          &larr;
        </button>
        <h1 className="font-bold">Nova Ocorrência</h1>
      </header>

      <main className="p-4 flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Tipo de Crime</label>
            <select
              className="p-3 border border-gray-300 rounded-lg bg-white"
              value={tipoCrime}
              onChange={(e) => setTipoCrime(e.target.value)}
            >
              <option>Desmatamento</option>
              <option>Poluição Sonora</option>
              <option>Descarte Irregular</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Descrição</label>
            <textarea
              className="p-3 border border-gray-300 rounded-lg bg-white resize-none"
              rows={4}
              placeholder="Detalhes da ocorrência..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
          </div>

          <UploadButton onImageSelect={setImageFile} />

          <div className="text-xs text-gray-500 text-center font-mono">
            {location
              ? `GPS: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
              : "Aguardando sinal do GPS..."}
          </div>

          <button
            type="submit"
            disabled={loading || !location}
            className={`bg-primary text-white p-4 rounded-lg font-bold mt-2 active:scale-95 transition-transform ${loading || !location ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Registrando..." : "Registrar Autuação"}
          </button>
        </form>
      </main>
    </div>
  );
}
