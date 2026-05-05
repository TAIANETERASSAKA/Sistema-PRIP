import { NavLink } from 'react-router-dom';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
        await api.post('/login/logout');
        sessionStorage.removeItem('usuario');
        navigate('/login');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
  };

  const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

  return (
    <aside class="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">

      <div className="p-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-sky-800">NotebookLoan</h1>
        <p className="text-xs text-slate-500">Gestão de Empréstimos de Notebooks</p>
      </div>
      <nav class="p-4 space-y-2 flex-grow">
        <NavLink 
          to="/alunoPainel" 
          className={({ isActive }) => 
            `nav-link flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive ? 'bg-sky-100 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          Meu Painel
        </NavLink>
        
        <NavLink 
          to="/alunoSolicitacao" 
          className={({ isActive }) => 
            `nav-link flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive ? 'bg-sky-100 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>
          Solicitações
        </NavLink>
        
        <NavLink 
          to="/alunoHistorico" 
          className={({ isActive }) => 
            `nav-link flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive ? 'bg-sky-100 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Histórico
        </NavLink>
      </nav>

        <div class="p-4 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700">{usuario?.nome}</p>
            <p className="text-xs text-slate-500 mb-3">{usuario?.email}</p>
        <button id="logout-btn" onClick={logout} class="w-full mt-4 flex items-center justify-center gap-2 text-sm bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Sair
        </button>
    </div>
    </aside>
  );
};

export default Menu;