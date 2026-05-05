import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import SpanSatus from '../../../components/Span/Status'; 
import ComunicacaoBtn from '../../../components/Botao/Comunicacao'; 
import ModalChat from '../../../components/Modal/Comunicacao'; 

function AlunoSolicitacao() {

    const [solicitacoes, setSolicitacoes] = useState([]);

    //Recebendo os emprestimos cadastrados
    async function getSolicitacoes() {
        try {
            const solicitacoesFromApi = await api.get('/emprestimos/solicitacoes');
            setSolicitacoes(solicitacoesFromApi.data);
        } catch (error) {
            console.error('Erro ao buscar empréstimos:', error);
        }
    }

    //----------------Manipulacao Modal Chat----------------//
    const [isModalOpenChat, setIsModalOpenChat] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null); 

    const openDetailsChat = (item) => {
        setSelectedChat(item);
        setIsModalOpenChat(true);
    };

    useEffect(() => {
        getSolicitacoes();
    }, []);

    return (
            <section id="solicitacoes" class="page-section">
                <h2 class="text-2xl font-bold mb-6">Minhas Solicitações</h2>
                <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 class="text-lg font-semibold mb-4">Acompanhamento</h3>
                    <div class="overflow-x-auto">
                        <table id="solicitacoes-table" class="w-full text-left">
                            <thead class="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                                <tr>
                                    <th class="p-3">Data da Solicitação</th>
                                    <th class="p-3">Status</th>
                                    <th class="p-3">Ações</th>
                                    <th class="p-3">Comunicação</th>
                                </tr>
                            </thead>
                            <tbody id="solicitacoes-list">
                                {solicitacoes.map((solicitacao) => (
                                    <tr key={solicitacao.id_usuario} className="border-b border-slate-200">
                                        <td className="p-3">{new Date(solicitacao.data_solicitacao).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-3">
                                        {(() => {
                                                switch (solicitacao.status) {
                                                    case 1:
                                                        return <SpanSatus titulo="Em análise" cor="amber" />;
                                                    case 2:
                                                        return <SpanSatus titulo="Aguardando retirada" cor="yellow" />;
                                                    case 3:
                                                        return <SpanSatus titulo="Em andamento" cor="green" />;
                                                    case 6:
                                                        return <SpanSatus titulo="Recusado" cor="red" />;
                                                    default:
                                                        return null;
                                                }
                                            })()}                                       
                                        </td>
                                        <td className="p-3">
                                            {solicitacao.status === 2 && (
                                            <button
                                                data-emprestimo-id={solicitacao.id_emprestimo}
                                                className="assinar-termo-btn text-purple-700 hover:underline text-sm font-medium"
                                            >
                                                Assinar Termo
                                            </button>
                                            )}
                                        </td>
                                        <td className="p-3 text-left">
                                            <ComunicacaoBtn onClick={() => openDetailsChat(solicitacao)} id={solicitacao.id_emprestimo}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <ModalChat
                    isOpen={isModalOpenChat} 
                    onClose={() => setIsModalOpenChat(false)} 
                    emprestimo={selectedChat} 
                />
        </section>
        )
}

export default AlunoSolicitacao;