import Menu from '../Menu'; 
import { Outlet } from 'react-router-dom';
const AlunoLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Menu /> 
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      <Outlet /> 
      </main>
    </div>
  );
};

export default AlunoLayout; 