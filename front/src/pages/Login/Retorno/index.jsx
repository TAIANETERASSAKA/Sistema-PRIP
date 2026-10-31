import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

// Página de retorno da Senha Única USP: busca o usuário da sessão e redireciona
function Retorno () {
    const navigate = useNavigate();

    useEffect(() => {
        const carregarUsuario = async () => {
            try {
                const response = await api.get('/auth/me');
                const usuario = response.data.usuario;

                sessionStorage.setItem('usuario', JSON.stringify(usuario));
                navigate(usuario.isAdmin ? '/dashboard' : '/alunoPainel', { replace: true });
            } catch (error) {
                navigate('/login?erro=login_invalido', { replace: true });
            }
        };

        carregarUsuario();
    }, [navigate]);

    return <p className="text-slate-500">Entrando no sistema...</p>;
}

export default Retorno;
