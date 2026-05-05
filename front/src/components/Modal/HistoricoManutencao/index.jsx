import FecharBtn from '../../../components/Botao/FecharModal';
import api from '../../../services/api';
import React, { useState, useEffect } from 'react';

function ModalHistManutencao({ isOpen, onClose, notebook }) {
    const [manutencoes, setManutencoes] = useState([]);

    useEffect(() => {
        if (!isOpen || !notebook) return;

        const fetchManutencoes = async () => {
            try {
                const response = await api.get('/manutencoes/' + notebook.id_notebook);
                setManutencoes(response.data.manutencoes);
            } catch (error) {
                console.error('Erro ao buscar informações notebooks:', error);
            }
        };

        fetchManutencoes();
    }, [isOpen, notebook]);

    if (!isOpen || !notebook) return null;

    return (
        <div id="maintenance-history-modal" className="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="modal-content bg-white w-full max-w-xl rounded-lg shadow-xl relative flex flex-col max-h-[70vh]">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
                    <h3 className="text-xl font-bold text-slate-800">Histórico de Manutenção</h3>
                    <FecharBtn id="close-maintenance-modal" onClose={onClose} />
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="mb-4 pb-4 border-b border-slate-200">
                        <p className="text-sm text-slate-500">
                            Equipamento: <strong id="history-laptop-model" className="text-slate-700">{notebook.marca} {notebook.modelo}</strong>
                        </p>
                        <p className="text-sm text-slate-500">
                            Nº Patrimônio: <strong id="history-laptop-patrimonio" className="text-slate-700">{notebook.numero_patrimonio}</strong>
                        </p>
                    </div>
                    <div id="maintenance-history-list" className="space-y-3 text-sm">
                        {manutencoes.map((manutencao, index) => (
                            <div key={index} className="border-b border-slate-100 pb-2 mb-2">
                                <p className="font-medium text-slate-700">{new Date(manutencao.data_entrada).toLocaleDateString('pt-BR') }</p>
                                <p className="text-slate-600">motivo: {manutencao.motivo}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalHistManutencao;