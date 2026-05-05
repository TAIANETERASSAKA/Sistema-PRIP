import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

function Login () {
    const navigate = useNavigate();

    const validacaoUsuario = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const loginData = {
            numero_usp: formData.get('numero_usp'),
            senha: formData.get('senha')
        };
        
        try {            
            const response = await api.post('/login', loginData);
            const usuarioData = {
                id_usuario: response.data.usuario.id_usuario,
                numero_usp: response.data.usuario.numero_usp,
                nome: response.data.usuario.nome,
                isAdmin: response.data.usuario.isAdmin,
                email: response.data.usuario.email
            };
            
            // SALVAR NO sessionStorage
            sessionStorage.setItem('usuario', JSON.stringify(usuarioData));           
            if (response.data.isAdmin === true) {
                navigate('/dashboard');
            } else {
                navigate('/alunoPainel');
            }
            
        } catch (error) {
            alert(error.response?.data?.message || 'Erro ao fazer login');
        }
    };
    
    const navigateCadastro = () => {
        navigate('/cadastro');
    };

    const navigateRecuperar = () => {
        navigate('/recuperar');
    };

    return (
        <div id="login-view" className="view active w-full max-w-md">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-sky-800">Sistema de Empréstimos</h1>
                    <p className="text-slate-500 mt-2">Acesse sua conta para continuar</p>
                </div>
                
                <form id="login-form" onSubmit={validacaoUsuario}>
                    <div className="mb-4">
                        <label htmlFor="numero_usp" className="block text-sm font-medium text-slate-700 mb-1">
                            Número USP
                        </label>
                        <input 
                            type="text"             
                            name="numero_usp"  
                            id="numero_usp" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                            placeholder="Ex: 12345678"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="senha" className="block text-sm font-medium text-slate-700 mb-1">
                            Senha
                        </label>
                        <input 
                            type="password"             
                            name="senha"  
                            id="senha" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-sky-700 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-800 transition-colors">
                        Entrar
                    </button>
                </form>

                <div className="text-center mt-4">
                        <button 
                            onClick={navigateRecuperar}
                            className="text-sm text-sky-700 hover:underline"
                        >
                            Esqueci minha senha
                        </button>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-slate-600">Não tem uma conta?</p>
                    <button 
                        onClick={navigateCadastro}
                        className="w-full mt-2 bg-slate-200 text-slate-800 py-2.5 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                    >
                        Cadastre-se aqui
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
