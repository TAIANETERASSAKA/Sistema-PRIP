import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Alerta from '../../../components/Toltip/Alert';

const RecuperarSenha = () => {
    const navigate = useNavigate();
    const [alerta, setAlerta] = useState(null); 
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/usuarios/recuperar/', {'email': email});

            setEmail('');
            setAlerta({
                tipo: 'sucesso',
                mensagem: 'Uma nova senha foi enviada para o seu e-mail.'
            });
            
        } catch (error) {
            setAlerta({
                tipo: 'erro',
                mensagem: error.response?.data?.message || "Erro ao tentar recuperar senha."
            });        
        } finally {
            setLoading(false);
        }
    };

    const navigateLogin = () => {
        // Ajuste a rota abaixo caso a sua rota de login seja diferente de '/' ou '/login'
        navigate('/'); 
    };

    return (
        <div id="recuperar-view" className="view active w-full max-w-md">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-sky-800">Recuperar Senha</h1>
                    <p className="text-slate-500 mt-2">Informe o seu e-mail cadastrado para receber uma nova senha.</p>
                </div>
                
                <form id="recuperar-form" onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="exemplo@usp.br"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full bg-sky-700 text-white py-2.5 rounded-lg font-semibold transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-sky-800'}`}
                    >
                        {loading ? 'Enviando...' : 'Recuperar Senha'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-slate-600">Lembrou da sua senha?</p>
                    <button 
                        onClick={navigateLogin}
                        className="w-full mt-2 bg-slate-200 text-slate-800 py-2.5 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                    >
                        Voltar para o Login
                    </button>
                </div>
            </div>

            {alerta && (
                <Alerta
                    mensagem={alerta.mensagem}
                    tipo={alerta.tipo}
                    duracao={3000}
                    onClose={() => setAlerta(null)}
                />
            )}
         </div>
    );
};

export default RecuperarSenha;