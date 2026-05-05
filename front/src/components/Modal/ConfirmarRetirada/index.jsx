import FecharBtn from '../../../components/Botao/FecharModal';
import api from '../../../services/api';
import React, { useState } from 'react';
import Alerta from '../../../components/Toltip/Alert';


function ModalConfirRetirada({ isOpen, onClose, emprestimo, onContinuar }) {
    if (!isOpen || !emprestimo) return null;

    const [alerta, setAlerta] = useState(null); 
    
    //----------------Pegando o valor da observacao---------------//
    const [selectedObs, setSelectedObs] = useState('');
    const handleObsChange = (e) => {
        setSelectedObs(e.target.value);
    };

    //----------------Pegando a data de devolucao---------------//
    const [selectedDataDev, setSelectedDataDev] = useState('');
    const handleDataDevChange = (e) => {
        setSelectedDataDev(e.target.value);
    };

    //----------------Editar Confirmar Retirada Note---------------//
    const confirmarRetirada = async (e) => {
        const formData = {
            'data_retirada': new Date().toISOString(),
            'data_devolucao_prevista': new Date(selectedDataDev + 'T21:00:00Z'), //colocando o horario limite de entrega ate as 18:00:00 br
            'observacao' : selectedObs,
            'status' : 3
        }

        try {
            await api.put('/emprestimos/' + emprestimo.id_emprestimo, formData);
            onContinuar();
        } catch (error) {
            const data = error.response?.data;
            const mensagemErro = (typeof data.message === 'string' ? data.message : data.message[0])|| 'Erro ao criar cadastro.';
            
            setAlerta({
                tipo: 'erro',
                mensagem: mensagemErro
            });              }
    }

    return (
        <div id="pickup-modal" class="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div class="modal-content bg-white w-full max-w-lg rounded-lg shadow-xl relative">
            <div class="flex justify-between items-center p-4 border-b border-slate-200">
                <h3 class="text-xl font-bold text-slate-800">Confirmar Retirada</h3>
                <FecharBtn id="close-confirm-pickup-modal" onClose={onClose} />
            </div>
            <div class="p-6 space-y-4">
                <p class="text-slate-600">Defina a data de devolução e adicione observações (opcional).</p>
                <div>
                    <label for="data_devolucao_prevista" class="block text-sm font-medium text-slate-700 mb-1">Data de Devolução</label>
                    <input 
                        type="date" id="data_devolucao_prevista"                             
                        onChange={handleDataDevChange}
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>
                <div>
                    <label for="observacao" class="block text-sm font-medium text-slate-700 mb-1">Observações da Retirada</label>
                    <textarea 
                        id="observacao" 
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                        rows="3" 
                        onChange={handleObsChange}
                        placeholder="Ex: Entregue com carregador e mouse. Pequeno risco na tampa..."    
                    >
                    </textarea>
                </div>
            </div>
            <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-center gap-3">
                 <button  onClick={onClose}  type="button" id="cancel-pickup-btn" class="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancelar</button>
                 <button id="confirm-pickup-btn" onClick={confirmarRetirada} class="bg-emerald-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-emerald-700 transition-colors">
                    Continuar para Assinatura
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

export default ModalConfirRetirada;