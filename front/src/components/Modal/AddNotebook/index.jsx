import React, { useState } from 'react';
import api from '../../../services/api';

function ModalAddNote({ isOpen, onClose, refreshList }) {
    if (!isOpen) return null;

    // Estados para os campos do formulário
    const [formData, setFormData] = useState({
        numero_patrimonio: '',
        marca: '',
        modelo: '',
        especif: '',
        status: 1
    });

    // Função para atualizar o estado conforme o usuário digita
    const handleChange = (e) => {
        const { id, value } = e.target;
        const valorFormatado = id === 'status' ? parseInt(value, 10) : value;
        setFormData({ ...formData, [id]: valorFormatado });
    };

    // Função para enviar para api
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/notebooks', formData);
            refreshList();
            onClose();
        } catch (error) {
            alert(error.response.data.message);
       }
    };
    
    return (
        <div id="laptop-form-wrapper" class="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="modal-content bg-white w-full max-w-lg rounded-lg shadow-xl relative flex flex-col p-6" style={{ height: '500px' }}>
            <h3 class="text-xl font-bold mb-6">Registrar Novo Notebook</h3>
                <form id="laptop-form" onSubmit={handleSubmit} class="space-y-6">
                    <div>
                        <label for="numero_patrimonio" class="block text-sm font-medium text-slate-700 mb-1">Número de Patrimônio (Único)</label>
                        <input type="text" id="numero_patrimonio" onChange={handleChange}  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="Ex: USP-12345"/>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="marca" class="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                            <input type="text" id="marca" onChange={handleChange}  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="Ex: Dell"/>
                        </div>
                        <div>
                            <label for="modelo" class="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                            <input type="text" id="modelo" onChange={handleChange}  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="Ex: XPS 13"/>
                        </div>
                    </div>
                    <div>
                        <label for="especif" class="block text-sm font-medium text-slate-700 mb-1">Especificações (Opcional)</label>
                        <input type="text" id="especif" onChange={handleChange} class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="Ex: Intel i7, 16GB RAM, 512GB SSD"/>
                    </div>
                    <div>
                        <label for="status" class="block text-sm font-medium text-slate-700 mb-1">Status Inicial</label>
                        <select id="status" onChange={handleChange} class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500">
                            <option value={1} selected>Disponível</option>
                            <option value={2} >Em Manutenção</option>
                        </select>
                    </div>
                    <div class="pt-2 flex gap-4">
                        <button type="button" onClick={onClose} id="cancel-laptop-form-btn" class="w-full bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancelar</button>
                        <button type="submit" class="w-full bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors">Salvar Notebook</button>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default ModalAddNote;