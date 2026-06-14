// front/src/App.js
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

function App() {
  return (
    <div className="dashboard">
      <header><h1>Fiscaliza Ambiental CDA</h1></header>
      <MapContainer center={[-7.6, -49.2]} zoom={13} style={{ height: "80vh" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
      <button onClick={() => alert('Nova Autuação')}>Registrar Infração</button>
    </div>
  );
}

export default App;