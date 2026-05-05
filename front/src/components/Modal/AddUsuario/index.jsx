import React, { useState } from 'react';
import api from '../../../services/api';
import Alerta from '../../../components/Toltip/Alert';

function ModalAddUsuario({ isOpen, onClose, refreshList }) {
    if (!isOpen) return null;
    const [alerta, setAlerta] = useState(null); 
    const [carregando, setCarregando] = useState(false); 

    // Estados para os campos do formulário
    const [formData, setFormData] = useState({
        numero_usp: '',
        nome: '',
        email: '',
        isAdmin: false
    });

    // Função para atualizar o estado conforme o usuário digita
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Função para enviar para api
    const criarUsuario = async (e) => {
        e.preventDefault();
        setCarregando(true)
        try {
            const  response = await api.post('/usuarios', formData);

            if (response.data.success) {
                setAlerta({
                    tipo: 'sucesso',
                    mensagem: 'Usuário criado com sucesso!'
                });
                
                await refreshList();
                
                setTimeout(() => {
                    onClose();
                    setAlerta(null);
                }, 1500);
            }
        } catch (error) {       
            const data = error.response?.data;
            const mensagemErro = (typeof data.message === 'string' ? data.message : data.message[0])|| 'Erro ao criar cadastro.';
            
            setAlerta({
                tipo: 'erro',
                mensagem: mensagemErro
            });        
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div id="add-user-modal" class="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="modal-content bg-white w-full max-w-lg rounded-lg shadow-xl relative flex flex-col p-6" style={{ height: '530px' }}>
                <h3 className="text-xl font-bold mb-6">Adicionar Novo Usuário</h3>
                <form id="student-form" onSubmit={criarUsuario} className="space-y-6">
                    <div>
                        <label for="nome" className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                        <input type="text" onChange={handleChange} id="nome"  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"/>
                    </div>
                    <div>
                        <label for="numero_usp" className="block text-sm font-medium text-slate-700 mb-1">Número USP</label>
                        <input type="text" id="numero_usp" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"/>
                    </div>
                    <div>
                        <label for="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail Institucional</label>
                        <input type="email" id="email" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"/>
                    </div>
                    <div>
                        <label for="isAdmin" className="block text-sm font-medium text-slate-700 mb-1">Função</label>
                        <select id="isAdmin" onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500">
                            <option value={false}>Aluno</option>
                            <option value={true}>Admin</option>
                        </select>
                    </div>
                    <div className="pt-7 flex gap-4">
                        <button type="button" onClick={onClose} id="cancel-form-btn" className="w-full bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancelar</button>
                        <button type="submit" disabled={carregando} className="w-full bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors">Salvar Usuário</button>
                    </div>
                </form>
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
}

export default ModalAddUsuario;