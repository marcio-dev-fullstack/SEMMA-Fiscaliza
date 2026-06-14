import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correção dos ícones padrão do Leaflet que quebram no Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Sub-componente para recentralizar o mapa quando a posição mudar
function RecenterAutomatically({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function MapaBase() {
  // Coordenadas padrão de fallback (Conceição do Araguaia)
  const [position, setPosition] = useState([-8.253, -49.265]);
  const [loading, setLoading] = useState(true);
  const [ocorrencias, setOcorrencias] = useState([]);

  useEffect(() => {
    // 1. Obter geolocalização do usuário
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setLoading(false);
        },
        (err) => {
          console.warn("Erro ao obter localização. Usando padrão.", err);
          setLoading(false);
        },
        { enableHighAccuracy: true }, // Importante para o Mobile-First (GPS)
      );
    } else {
      setLoading(false);
    }

    // 2. Buscar ocorrências cadastradas na API
    const fetchOcorrencias = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:8000/api/mapa", {
          headers: {
            "Authorization": `Bearer ${token}` // Autenticação JWT do Fiscal
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOcorrencias(data);
        }
      } catch (error) {
        console.error("Erro ao buscar ocorrências:", error);
      }
    };

    fetchOcorrencias();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-300">
        <p className="animate-pulse">Obtendo localização do GPS...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full z-0">
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically lat={position[0]} lng={position[1]} />
        
        {/* Marcador da Posição do Usuário */}
        <Marker position={position}>
          <Popup>Você está aqui!</Popup>
        </Marker>

        {/* Marcadores das Ocorrências da API */}
        {ocorrencias.map((ocorrencia) => (
          <Marker key={ocorrencia.id} position={[ocorrencia.latitude, ocorrencia.longitude]}>
            <Popup>
              <div className="text-sm">
                <strong className="block text-primary">{ocorrencia.tipo_crime}</strong>
                <span className="text-gray-600">Status: {ocorrencia.status}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
