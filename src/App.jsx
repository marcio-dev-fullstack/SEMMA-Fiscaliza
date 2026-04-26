import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TrialGuard from "./components/Security/TrialGuard";
import { useLicense } from "./hooks/useLicense";

// Páginas
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import GestaoLicencas from "./pages/GestaoLicencas";
import ModuloFiscalizacao from "./pages/ModuloFiscalizacao";

function App() {
  // Ajuste a data para testar o bloqueio se necessário
  const { isExpired, daysRemaining } = useLicense('2026-04-15');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <TrialGuard isExpired={isExpired} daysRemaining={daysRemaining}>
        <div className="min-h-screen flex flex-col bg-gray-100">
          
          <div className="flex-1">
            <Routes>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

              <Route 
                path="/" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
              />
              
              <Route 
                path="/licencas" 
                element={isAuthenticated ? <GestaoLicencas /> : <Navigate to="/login" />} 
              />

              <Route 
                path="/fiscalizacao" 
                element={isAuthenticated ? <ModuloFiscalizacao /> : <Navigate to="/login" />} 
              />

              <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
            </Routes>
          </div>

          {/* Footer só aparece se estiver logado */}
          {isAuthenticated && (
            <footer className="bg-white border-t border-gray-200 py-3 px-8 flex justify-between items-center">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                FISCALIZA - V.1.1
              </div>
              
              <div className="flex items-center gap-2">
                
                <a 
                  href="https://razgo.com.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-black text-emerald-700 hover:text-slate-900 transition-colors tracking-tighter"
                >
                  RAZGO.COM.BR
                </a>
              </div>
            </footer>
          )}
        </div>
      </TrialGuard>
    </Router>
  );
}

export default App;