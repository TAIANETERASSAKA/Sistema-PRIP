import Menu from '../Menu'; 
import { Outlet } from 'react-router-dom';
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Menu /> 
      <main className="flex-1 p-8 overflow-auto">
         <Outlet /> 
      </main>
    </div>
  );
};

export default Layout; 