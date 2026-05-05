import NovaSolicitacao from '../../../components/Modal/NovaSolicitacao';
import { useEffect, useState } from 'react';
import api from '../../../services/api';



function AlunoPainel() {
    // --- Lógica para Manipular Modal ---
    const [isModalAddSolicit, setisModalAddSolicit] = useState(false);

    const openModalAddSolicit = () => setisModalAddSolicit(true);
    const closeModalAddUsuario = () => setisModalAddSolicit(false);

    const [notificacoes, setNotificacoes] = useState([]);

    const usuario = JSON.parse(sessionStorage.getItem('usuario'));

    useEffect(() => {
        const fetchNotificacoes = async () => {
            try {
                const response = await api.get('/emprestimos/todos/' + usuario.id_usuario);
                setNotificacoes(response.data.notificacoes);
            } catch (error) {
                console.error('Erro ao buscar notificações:', error);
            }
        };

        fetchNotificacoes();
    }, []);

    // --- Lógica para Manipular NOtificacoes ---
    const getMensagem = (notificacao) => {
        const mensagens = {
            1: `Sua solicitação número ${notificacao.id_emprestimo} foi Enviada com sucesso no dia ${notificacao.data_solicitacao}`,
            2: `Sua solicitação número ${notificacao.id_emprestimo} foi APROVADA. Assine o termo para retirar o notebook.`,
            3: `Notebook foi retirado com sucesso no dia ${new Date(notificacao.data_retirada).toLocaleDateString('pt-BR') }. Seu empréstimo número ${notificacao.id_emprestimo} está em andamento.`,
            4: `Notebook foi devolvido com sucesso no dia ${new Date(notificacao.data_devolucao_real).toLocaleDateString('pt-BR')}. Seu empréstimo número ${notificacao.id_emprestimo} foi finalizado.`,
            5: `Sua solicitação número ${notificacao.id_emprestimo} está atrasada, a data de devolução foi definida para ${new Date(notificacao.data_devolucao_prevista).toLocaleDateString('pt-BR')}`,
            6: `Sua solicitação número ${notificacao.id_emprestimo} foi Negada no dia ${new Date(notificacao.data_recusa).toLocaleDateString('pt-BR')}`
        };
    
        return mensagens[notificacao.status] || "Status desconhecido";
    };


    return (
            <section id="dashboard" className="page-section">
                <h2 className="text-2xl font-bold mb-6">Meu Painel</h2>
                
                <div id="emprestimo-ativo-card" className="bg-white p-6 rounded-lg shadow-sm border border-emerald-300 mb-8 hidden">
                    <h3 className="text-lg font-semibold text-emerald-700 mb-4">Empréstimo Ativo</h3>
                    <div className="space-y-3 text-slate-700">
                        <p><strong>Notebook:</strong> <span id="ativo-notebook"></span></p>
                        <p><strong>Nº Patrimônio:</strong> <span id="ativo-patrimonio"></span></p>
                        <p><strong>Data de Retirada:</strong> <span id="ativo-retirada"></span></p>
                        <p><strong>Prazo de Devolução:</strong> <span id="ativo-devolucao"></span></p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="font-medium">Tempo restante:</p>
                        <p id="ativo-tempo-restante" className="text-2xl font-bold text-sky-700"></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <button 
                        id="open-solicitacao-modal-btn"
                        onClick={openModalAddSolicit}
                        className="bg-white p-6 rounded-lg shadow-sm border-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-slate-400 mb-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            <p className="text-lg font-semibold text-slate-700">Nova Solicitação de Empréstimo</p>
                    </button>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Notificações</h3>
                            <span id="notification-badge" className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"></span>
                        </div>
                        <div id="notificacoes-list" className="space-y-3 max-h-80 overflow-y-auto">
                            {notificacoes.length > 0 ? (
                                notificacoes.map((notificacao, index) => (
                                    <div key={index} className="p-3 rounded-lg text-sm bg-sky-50 text-sky-800 border-l-4 border-sky-400">
                                        <p>{getMensagem(notificacao)}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm">Nenhuma notificação encontrada.</p>
                            )}
                        </div>
                    </div>
                </div>

                <NovaSolicitacao 
                    isOpen={isModalAddSolicit} 
                    onClose={closeModalAddUsuario}
                />
            </section>
        
        )
}

export default AlunoPainel;