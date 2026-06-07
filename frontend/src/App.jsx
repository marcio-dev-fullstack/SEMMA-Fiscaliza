import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, FileText, BarChart3, Search, UserCheck, UserPlus, LogOut, LogIn, Users, Award, Building2, Lock, Download, QrCode, Zap, Printer, FileCheck, RefreshCw } from 'lucide-react';

const formatCPF = (value) => {
  const d = value.replace(/\D/g, '');
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ cpf: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const API_URL = "http://127.0.0.1:8000/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: loginForm.cpf, password: loginForm.password })
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } else {
        alert(data.detail || "Erro de autenticação");
      }
    } catch (e) { alert("Erro de conexão com o servidor"); }
    finally { setLoginLoading(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4" autoComplete="off">
          <input type="text" style={{display:'none'}} />
          <input type="password" style={{display:'none'}} />
          <h1 className="font-bold text-center text-xl">FISCALIZA AMBIENTAL</h1>
          <div>
            <label className="block text-xs font-bold text-slate-500">CPF DO SERVIDOR</label>
            <input type="text" required maxLength="14" placeholder="000.000.000-00" className="w-full p-2 border rounded font-mono" value={loginForm.cpf} onChange={(e) => setLoginForm({...loginForm, cpf: formatCPF(e.target.value)})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500">SENHA DE ACESSO</label>
            <input type="password" required autoComplete="new-password" className="w-full p-2 border rounded" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loginLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
            {loginLoading ? "CONECTANDO..." : "ENTRAR NO SISTEMA"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h1 className="font-bold text-lg mb-10">FISCALIZA</h1>
        <div className="bg-slate-800 p-3 rounded-lg mb-6">
          <p className="text-xs font-bold">{currentUser.name}</p>
          <p className="text-[10px] text-emerald-400">{currentUser.role}</p>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className="w-full text-left py-2 px-3 hover:bg-slate-800 rounded text-sm">Painel</button>
          <button onClick={() => { setIsAuthenticated(false); setCurrentUser(null); }} className="w-full text-left py-2 px-3 text-rose-400 hover:bg-rose-950 rounded text-sm">Sair do Sistema</button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Bem-vindo, {currentUser.name}</h2>
        <div className="grid grid-cols-4 gap-6">
            {/* Espaço para as métricas */}
        </div>
      </main>
    </div>
  );
} 