import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import api from '../../../services/api';

function Cadastro () {

    //Redirecionamento para pagina de Login
    const navigate = useNavigate();

    const navigateLogin = () => {
        navigate('/login');
    }

    //Enviando dados do formulario para api
    
    // Estados para os campos do formulário
    const [formData, setFormData] = useState({
        numero_usp: '',
        nome: '',
        email: '',
        isAdmin: true, //apagar depois
        senha: ''
    });

    // Função para atualizar o estado conforme o usuário digita
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Função para enviar para api
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/usuarios', formData);
            navigateLogin();
            alert('Usuário cadastrado com sucesso!');
        } catch (error) {
            alert(error.response.data.message);
        }
    };
    
    
    return (
        <div id="register-view" className="view w-full max-w-md">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <h1 className="text-2xl font-bold text-center mb-6 text-sky-800">Cadastro de Novo Aluno</h1>
                <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label for="nome" className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
                        <input type="text" id="nome" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <div>
                        <label for="numero_usp" className="block text-sm font-medium text-slate-700 mb-1">Número USP</label>
                        <input type="text" id="numero_usp" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <div>
                        <label for="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail institucional</label>
                        <input type="email" id="email" onChange={handleChange}  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <div>
                        <label for="senha" className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                        <input type="password" id="senha" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <button type="submit"  className="w-full bg-sky-700 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-800 transition-colors">Cadastrar</button>
                    <div className="text-center pt-2">
                        <button 
                            id="show-login-btn" 
                            onClick={navigateLogin}
                            className="text-sm text-sky-700 hover:underline"
                        >Já tenho uma conta</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Cadastro;