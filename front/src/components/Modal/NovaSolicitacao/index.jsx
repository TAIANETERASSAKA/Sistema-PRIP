import { useState } from "react";
import api from '../../../services/api';

function NovaSolicitacao({ isOpen, onClose }){
    if (!isOpen) return null;

    const [justificativa, setJustificativa] = useState(''); // Estado simples

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = {
            justificativa: justificativa
        };

        try{ 
            console.log(formData);
            await api.post('/emprestimos', formData);
            alert('Solicitação enviada com sucesso!');
            onClose()
        }catch(error){
            alert(error.response.data.message)
        }
    }

    return(
    <div id="solicitacao-modal" class="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg m-4">
            <h2 className="text-2xl font-bold mb-2 text-sky-800">Nova Solicitação de Empréstimo</h2>
            <p className="text-lg text-slate-600 mb-1">Notebook: <span className="font-medium">A ser atribuído pela administração</span></p>
            <p className="text-sm text-slate-500 mb-6">Ex: Dell XPS 13, Lenovo ThinkPad, etc.</p>
            
            <form id="solicitacao-form" onSubmit={handleSubmit}>                
                <div className="mb-4">
                    <label for="justificativa" className="block text-sm font-medium text-slate-700 mb-1">Justificativa da Solicitação (Obrigatório)</label>
                    <textarea 
                        id="justificativa" 
                        rows="4"
                        value={justificativa} 
                        onChange={(e) => setJustificativa(e.target.value)} 
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Ex: Para acompanhar as aulas e desenvolver projetos da disciplina."
                    />
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button"  onClick={onClose} id="close-solicitacao-modal-btn" className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg font-semibold hover:bg-slate-300">Cancelar</button>
                    <button type="submit" className="bg-sky-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-800">Enviar Solicitação</button>
                </div>
            </form>
        </div>
    </div>
    );
};

export default NovaSolicitacao;