import api from '../../../services/api';
import React, { useState } from 'react';
import Alerta from '../../../components/Toltip/Alert';

function ModalAtribuirNoteConteudo({ isOpen, onClose, emprestimo, notebooksDisponiveis, refreshEmprestimos }) {

    //----------------Pegando o id do note selecionado---------------//
    const [selectedNotebookId, setSelectedNotebookId] = useState('');
    const handleNotebookChange = (e) => {
        setSelectedNotebookId(e.target.value);
    };

 
    //----------------Editar Status Note---------------//
    const editarStatus = async (e) => {
        const formData = {
            'status': 2,
            'id_notebook' : parseInt(selectedNotebookId)
        }

        if (!selectedNotebookId) {
            alert('Selecione um notebook disponível.');
            return;
        }

        try {
            // O backend aprova o empréstimo e marca o notebook como em uso (2) na mesma operação
            await api.put('/emprestimos/' + emprestimo.id_emprestimo, formData);
            refreshEmprestimos()
            onClose()

        } catch (error) {
            alert(error.response?.data?.message || 'Erro ao atribuir o notebook.');
        }
    }

    return (
        <div id="assign-notebook-modal" className="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="modal-content bg-white w-full max-w-lg rounded-lg shadow-xl relative">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">Atribuir Notebook</h3>
                    <button id="close-assign-modal" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-600">O pedido foi aprovado. Selecione um notebook disponível para atribuir a este aluno.</p>
                    <div>
                        <label for="assign-notebook-select" className="block text-sm font-medium text-slate-700 mb-1">Notebooks Disponíveis</label>
                        <select 
                            id="assign-notebook-select" 
                            value={selectedNotebookId}
                            onChange={handleNotebookChange}
                            defaultValue=""
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                        >
                            <option value="" disabled >Selecione um notebook...</option>
                            {notebooksDisponiveis.map((notebook) => (
                                <option  key={notebook.id_notebook} value={notebook.id_notebook}  >{notebook.marca} - {notebook.modelo} ({notebook.numero_patrimonio})</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center gap-3">
                    <button type="button" id="cancel-assignment-btn" onClick={onClose} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancelar</button>
                    <button id="confirm-assignment-btn" onClick={editarStatus} className="bg-emerald-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-emerald-700 transition-colors">
                        Confirmar Atribuição
                    </button>
                </div>
            </div>



        </div>
    )
}

// Só monta o conteúdo quando há algo para exibir, mantendo os hooks sempre na mesma ordem
function ModalAtribuirNote(props) {
    if (!props.isOpen) return null;
    return <ModalAtribuirNoteConteudo {...props} />;
}

export default ModalAtribuirNote;