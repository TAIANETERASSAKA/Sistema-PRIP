import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Layouts e páginas
import Layout from './pages/Adm/Layout';
import Dashboard from './pages/Adm/Dashboard';
import Historico from './pages/Adm/Historico';
import Usuario from './pages/Adm/Usuario';
import Relatorio from './pages/Adm/Relatorio';
import Notebook from './pages/Adm/Notebook'; 

import AlunoLayout from './pages/Aluno/Layout';
import AlunoPainel from './pages/Aluno/Painel';
import AlunoHistorico from './pages/Aluno/Historico';
import AlunoSolicitacao from './pages/Aluno/Solicitacao';

import LoginLayout from './pages/Login/Layout';
import Login from './pages/Login/Login'; 
import Cadastro from './pages/Login/Cadastro'; 
import Loginfea from './login.jsx';
import Recuperar from './pages/Login/RecuperarSenha'; 



// Componente de proteção de rotas
const RotaProtegida = ({ children, isAdmin }) => {
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');
    
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }
    
    if (isAdmin !== undefined && usuario.isAdmin !== isAdmin) {
        return <Navigate to={usuario.isAdmin ? "/dashboard" : "/alunoPainel"} replace />;
    }
    
    return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LoginLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="loginfea" element={<Loginfea />} />
          <Route path="cadastro" element={<Cadastro />} />
          <Route path="recuperar" element={<Recuperar />} />
        </Route>
        
        {/* Rotas do Administrador */}
        <Route 
          path="/" 
          element={
            <RotaProtegida isAdmin={true}>
              <Layout />
            </RotaProtegida>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="historico" element={<Historico />} />
          <Route path="usuarios" element={<Usuario />} />
          <Route path="relatorios" element={<Relatorio />} />
          <Route path="notebooks" element={<Notebook />} />
        </Route>
        
        {/* Rotas do Aluno */}
        <Route 
          path="/" 
          element={
            <RotaProtegida isAdmin={false}>
              <AlunoLayout />
            </RotaProtegida>
          }
        >
          <Route index element={<Navigate to="alunoPainel" replace />} />
          <Route path="alunoPainel" element={<AlunoPainel />} />
          <Route path="alunoHistorico" element={<AlunoHistorico />} />
          <Route path="alunoSolicitacao" element={<AlunoSolicitacao />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);