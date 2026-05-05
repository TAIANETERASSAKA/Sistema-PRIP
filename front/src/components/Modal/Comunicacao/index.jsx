import FecharBtn from '../../../components/Botao/FecharModal';
import api from '../../../services/api';
import React, { useEffect, useState } from 'react';

function ModalChat({ isOpen, onClose, emprestimo, onOpenAtribuirModal, refreshEmprestimos }) {
    if (!isOpen || !emprestimo) return null;

    const usuario = JSON.parse(sessionStorage.getItem('usuario'));

    //----------------Editar Status Note---------------//
    const editarStatus = async (e) => {
        const statusNovo = parseInt(e.target.value)
        const formData = {
            'data_recusa': new Date().toISOString(),
            'status' : parseInt(e.target.value)
        }
        try {
            if(statusNovo === 6){
                await api.put('/emprestimos/' + emprestimo.id_emprestimo, formData);
                refreshEmprestimos()
                onClose()
            }

            if(statusNovo === 2){
                onClose()
                onOpenAtribuirModal(); 
            }
        
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    //----------------Receber mensagens--------------//
    const [mensagens, setMensagens] = useState([]);
    const buscarMensagens = async () => {
        try {
            const response = await api.get('/mensagens/' + emprestimo.id_emprestimo);
            setMensagens(response.data);
        } catch (error) {
            alert(error.response?.data?.message);
        }
    };

    //----------------Enviar mensagens--------------//
    const [conteudo, setConteudo] = useState('');
    const handleConteudo = (e) => {
        setConteudo(e.target.value);
    };

    const enviarMensagem = async () => {
        if(!conteudo){
            return false
        }
        const formData = {
            'id_emprestimo': emprestimo.id_emprestimo,
            'conteudo' : conteudo
        }

        try {
            await api.post('/mensagens', formData);
            setConteudo('');
            await buscarMensagens();  
        } catch (error) {
            alert(error.response?.data?.message);
        }
    };



    // ── Polling: busca ao abrir e a cada 8s ───────────────────────────────────
    useEffect(() => {
        if (!isOpen || !emprestimo) return;

        buscarMensagens();
        const intervalo = setInterval(buscarMensagens, 8000);
        return () => clearInterval(intervalo);
    }, [isOpen, emprestimo?.id_emprestimo]);

    return (
    <div id="chat-modal" class="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div class="modal-content bg-white w-full max-w-lg rounded-lg shadow-xl relative flex flex-col" style={{ height: '600px' }}>
            <div class="flex justify-between items-center p-4 border-b border-slate-200">
                <h3 class="text-xl font-bold text-slate-800">Comunicação</h3>
                <FecharBtn id="close-chat-modal" onClose={onClose} />
            </div>
            <div id="chat-history" class="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {mensagens.map((mensagem) => {
                const isMinha = mensagem.id_usuario === usuario.id_usuario;
                const bubbleClass = mensagem.isAdm ? "chat-bubble-admin" : "chat-bubble-aluno";
                const timeAlign = isMinha ? "text-right" : "text-left";
                return (
                <div key={mensagem.id_mensagem} className={`flex flex-col ${isMinha ? "items-end" : "items-start"}`}>
                    <div className={`chat-bubble ${bubbleClass} p-3 text-sm max-w-[75%]`}>
                    {mensagem.conteudo}
                    </div>
                    <span className={`text-xs text-slate-400 mt-0.5 mb-2 ${timeAlign}`}>
                    {new Date(mensagem.enviado_em).toLocaleString("pt-BR")}
                    </span>
                </div>
                );
            })}
            </div>
            
            <div class="p-4 border-t border-slate-200 bg-white">
                <div class="flex gap-2">
                    <input type="text" id="chat-message-input" onChange={handleConteudo}  value={conteudo} class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="Digite sua mensagem..."/>
                    <button id="send-chat-btn" onClick={enviarMensagem} class="bg-sky-700 text-white w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg hover:bg-sky-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 -mr-0.5 mt-0.5"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>
                    </button>
                </div>
            </div>
            {(onOpenAtribuirModal) && (
                 <div class="p-4 border-t border-slate-200 bg-slate-50 flex justify-center gap-3">
                 <button 
                     id="deny-btn" 
                     onClick={editarStatus}
                     value={6}
                     class="bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 transition-colors"
                 >
                     Negar Pedido
                 </button>
                 <button 
                     id="approve-btn"
                     onClick={editarStatus}
                     value={2} 
                     class="bg-emerald-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-emerald-700 transition-colors"
                 >
                     Aprovar e Atribuir
                 </button>
             </div>
            )}
           
        </div>
    </div>

    );
}

export default ModalChat;