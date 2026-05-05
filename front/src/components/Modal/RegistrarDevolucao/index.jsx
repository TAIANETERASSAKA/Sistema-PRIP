import FecharBtn from '../../../components/Botao/FecharModal';
import React, { useState } from 'react';
import api from '../../../services/api';
import Alerta from '../../../components/Toltip/Alert';

function ModalRegistDevolucao({ isOpen, onClose, emprestimo, refreshEmprestimos }) {
    if (!isOpen || !emprestimo) return null;
    const [alerta, setAlerta] = useState(null); 
    
    //----------------Pegando o valor da observacao---------------//
    const [selectedObs, setSelectedObs] = useState('');
    const handleObsChange = (e) => {
        setSelectedObs(e.target.value);
    };

    //----------------Pegando o valor do status---------------//
    const [selectedStatus, setSelectedStatus] = useState(1);
    const handleStatusChange = (e) => {
        setSelectedStatus(parseInt(e.target.value));
    };

    //----------------Confirmar Devolucao Note---------------//
    const confirmarRetirada = async (e) => {
        try {
            const formData = {
                'data_devolucao_real': new Date().toISOString(),
                'status' : 4
            }

            //se o status for devolvido com avaria, a observação é obrigatória
            if(selectedStatus === 3 && selectedObs.trim() === '') {
                setAlerta({
                    tipo: 'erro',
                    mensagem: 'A observação é obrigatória ao registrar devolução com avaria.'
                });
                return;
            }

            //Alterando dados emprestimo
            await api.put('/emprestimos/' + emprestimo.id_emprestimo, formData);
            //Alterando status do Note
            await api.put('/notebooks/' + emprestimo.id_notebook, {'status': selectedStatus });

            if(selectedStatus === 3) {
                await api.post('/manutencoes/' + emprestimo.id_notebook, {'data_entrada': new Date().toISOString(),'id_emprestimo': emprestimo.id_emprestimo ,'motivo' : selectedObs,});
            }

            setAlerta({
                tipo: 'sucesso',
                mensagem: 'Devolução registrada com sucesso!'
            });
            
            refreshEmprestimos();
            
            setTimeout(() => {
                onClose();
                setAlerta(null);
            }, 1500);
        } catch (error) {
            setAlerta({
                tipo: 'erro',
                mensagem: error.response?.data?.message || "Erro ao registrar devolução."
            });
        }
    }

    return (
        <div id="return-modal" class="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div class="modal-content bg-white w-full max-w-lg rounded-lg shadow-xl relative">
                <div class="flex justify-between items-center p-4 border-b border-slate-200">
                    <h3 class="text-xl font-bold text-slate-800">Registrar Devolução</h3>
                    <FecharBtn id="close-confirm-return-modal" onClose={onClose} />
                </div>
                <div class="p-6 space-y-4">
                    <p class="text-slate-600">Confirme a devolução do equipamento e atualize seu status.</p>
                    <div>
                        <label for="status" class="block text-sm font-medium text-slate-700 mb-1">Status do Equipamento</label>
                        <select id="status" onChange={handleStatusChange} class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500">
                            <option value={1} >Devolvido (OK)</option>
                            <option value={3} >Devolvido com Avaria (Manutenção)</option>
                        </select>
                    </div>
                    <div>
                        <label for="observaca_devolucao" class="block text-sm font-medium text-slate-700 mb-1">Observações da Devolução (Obrigatório se avariado)</label>
                        <textarea id="observaca_devolucao" onChange={handleObsChange} class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" rows="3" placeholder="Ex: Tela com risco, carregador com mau contato..."></textarea>
                    </div>
                </div>
                <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-center gap-3">
                     <button onClick={onClose} type="button" id="cancel-return-btn" class="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancelar</button>
                     <button id="confirm-return-btn" onClick={confirmarRetirada} class="bg-emerald-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-emerald-700 transition-colors">
                        Confirmar Devolução
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
}

export default ModalRegistDevolucao;