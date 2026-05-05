import { Outlet } from 'react-router-dom';
const AlunoLayout = ({ children }) => {
  return (
    <div id="auth-container" className="min-h-screen flex flex-col items-center justify-center p-4">
      <Outlet /> 
    </div>
  );
};

export default AlunoLayout; 