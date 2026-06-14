import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MapView from "./pages/MapView";
import NovaOcorrencia from "./pages/NovaOcorrencia";
import ListaAutuacoes from "./pages/ListaAutuacoes";
import DetalhesAutuacao from "./pages/DetalhesAutuacao";
import Dashboard from "./pages/Dashboard";

// Componente para proteger rotas privadas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Se não houver token, redireciona imediatamente para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se tiver token, exibe o conteúdo da rota normalmente
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/mapa"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nova-ocorrencia"
          element={
            <ProtectedRoute>
              <NovaOcorrencia />
            </ProtectedRoute>
          }
        />
        <Route
          path="/autuacoes"
          element={
            <ProtectedRoute>
              <ListaAutuacoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/autuacoes/:id"
          element={
            <ProtectedRoute>
              <DetalhesAutuacao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
