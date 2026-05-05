import FecharBtn from '../../../components/Botao/FecharModal';
import Alerta from '../../../components/Toltip/Alert';
import React, { useState } from 'react';
import api from '../../../services/api';

function ModalEditarNote({ isOpen, onClose, notebook, refreshList }) {
    if (!isOpen || !notebook) return null;

    const [selectedStatus, setSelectedStatus] = useState(notebook.status);
    const [observacao, setObservacao] = useState('');
    const [erroObservacao, setErroObservacao] = useState(false);
    const [alerta, setAlerta] = useState(null); 
    const [carregando, setCarregando] = useState(false); 

    const handleStatusChange = (e) => {
        setSelectedStatus(parseInt(e.target.value));
        setErroObservacao(false);
    };

    const editarStatus = async (e) => {
        if (selectedStatus === 3 && observacao.trim() === '') {
            setErroObservacao(true);
            setAlerta({
                tipo: 'erro',
                mensagem: 'A observação é obrigatória ao enviar para Manutenção.'
            });
            return;
        }

        setCarregando(true);

        try {
            const response = await api.put('/notebooks/' + notebook.id_notebook, { 
                'status': selectedStatus 
            });

            if(selectedStatus === 3) {
                await api.post('/manutencoes/' + notebook.id_notebook, {'data_entrada': new Date().toISOString(), 'motivo' : observacao,});
            }

            setAlerta({
                tipo: 'sucesso',
                mensagem: 'Status do notebook atualizado com sucesso!'
            });
            
            await refreshList();
            
            setTimeout(() => {
                onClose();
                setAlerta(null);
            }, 1000);
        } catch (error) {            
            const mensagemErro = error.response?.data?.message || 
                                error.response?.data?.error || 
                                error.message || 
                                'Erro ao atualizar status do notebook.';
            
            setAlerta({
                tipo: 'erro',
                mensagem: mensagemErro
            });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
            <div id="edit-laptop-modal" className="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                <div className="modal-content bg-white w-full max-w-lg rounded-lg shadow-xl relative">
                    <div className="flex justify-between items-center p-4 border-b border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800">Editar Status do Notebook</h3>
                        <FecharBtn id="close-edit-laptop-modal" onClose={onClose} />
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-slate-600">Patrimônio: <strong className="text-slate-800">{notebook.numero_patrimonio}</strong></p>
                        <div>
                            <label htmlFor="edit-laptop-status-select" className="block text-sm font-medium text-slate-700 mb-1">
                                Status do Equipamento
                            </label>
                            <select
                                id="edit-laptop-status-select"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                                defaultValue={notebook.status}
                                onChange={handleStatusChange}
                                disabled={carregando}
                            >
                                <option value={1}>Disponível</option>
                                <option value={3}>Em Manutenção</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="observacao_manutencao" className="block text-sm font-medium text-slate-700 mb-1">
                                Nota (Obrigatório se mover para Manutenção)
                            </label>
                            <textarea
                                id="observacao_manutencao"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500 ${
                                    erroObservacao ? 'border-red-500' : 'border-slate-300'
                                }`}
                                rows="3"
                                placeholder="Ex: Enviado para troca de bateria, limpeza interna..."
                                value={observacao}
                                onChange={(e) => {
                                    setObservacao(e.target.value);
                                    if (e.target.value.trim() !== '') setErroObservacao(false);
                                }}
                                disabled={carregando}
                            />
                            {erroObservacao && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    ⚠️ A observação é obrigatória ao enviar para Manutenção.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center gap-3">
                        <button 
                            onClick={onClose} 
                            type="button" 
                            className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                            disabled={carregando}
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={editarStatus} 
                            className="bg-emerald-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                            disabled={carregando}
                        >
                            {carregando ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
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
        </>
    );
}

export default ModalEditarNote;