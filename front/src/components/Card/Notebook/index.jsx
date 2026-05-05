import Status from '../../../components/Span/Status';
import ModalHistManutencao from '../../../components/Modal/HistoricoManutencao';
import ModalDetalhes from '../../Modal/DetalhesEmprestimo';
import ModalEditarNote from '../../Modal/EditarNote';
import { useEffect, useState } from 'react';
import api from '../../../services/api';

function CardNotebook({ notebook, refreshList }) {
    if (!notebook) return null;

    // --- Estados para Controle dos Modais ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenHist, setIsModalOpenHist] = useState(false);
    const [isModalOpenEditNote, setIsModalOpenEditNote] = useState(false);

    // --- Estados para Dados Selecionados ---
    const [selectedHistManut, setSelectedHistManut] = useState(null); 
    const [selectedEditNote, setSelectedEditNote] = useState(null); 
    const [emprestimoAtivo, setEmprestimoAtivo] = useState(null);
    const [loadingEmprestimo, setLoadingEmprestimo] = useState(false);

    // --- Funções de Abertura ---
    const openHistManuten = (item) => {
        setSelectedHistManut(item);
        setIsModalOpenHist(true);
    };

    const openEditNote = (item) => {
        setSelectedEditNote(item);
        setIsModalOpenEditNote(true);
    };

    // --- Busca Dados do Empréstimo se o Status for 2 (Emprestado) ---
    useEffect(() => {
        let isMounted = true;

        const getEmprestimoAtual = async () => {
            if (notebook.status === 2) {
                setLoadingEmprestimo(true);
                try {
                    const response = await api.get(`/emprestimos/atual/${notebook.id_notebook}`);
                    if (isMounted) {
                        setEmprestimoAtivo(response.data);
                    }
                } catch (error) {
                    console.error('Erro ao buscar informações do empréstimo:', error);
                } finally {
                    if (isMounted) setLoadingEmprestimo(false);
                }
            } else {
                setEmprestimoAtivo(null);
            }
        };

        getEmprestimoAtual();

        return () => { isMounted = false; };
    }, [notebook.id_note, notebook.status]);
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col gap-3 min-h-[220px]">
            {/* Cabeçalho do Card */}
            <div>
                <p className="text-sm text-slate-500">Nº Patrimônio</p>
                <p className="font-semibold text-lg text-slate-800">{notebook.numero_patrimonio}</p>
            </div>

            {/* Informações Técnicas */}
            <div className="flex-1">
                <p className="text-sm text-slate-500">Equipamento</p>
                <p className="text-slate-700 font-medium">{notebook.marca} {notebook.modelo}</p>
                <p className="text-xs text-slate-600">{notebook.specs}</p>
            </div>

            {/* Status Visual */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Status</p>
                <Status 
                    titulo={
                        notebook.status === 1 ? 'Disponível' : 
                        notebook.status === 3 ? 'Em Manutenção' : 
                        notebook.status === 2 ? 'Emprestado' : 'Desconhecido'
                    }
                    cor={
                        notebook.status === 1 ? 'green' : 
                        notebook.status === 3 ? 'red' : 
                        notebook.status === 2 ? 'yellow' : 'gray'}
                />
            </div>

            {/* Ações Inferiores */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-2">
                <button 
                    onClick={() => openHistManuten(notebook)} 
                    className="text-xs font-medium text-sky-700 hover:underline"
                >
                    Ver Histórico
                </button>

                {notebook.status === 2 ? (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className={`text-xs font-medium hover:underline ${loadingEmprestimo ? 'text-slate-400' : 'text-amber-700'}`}
                        disabled={loadingEmprestimo || !emprestimoAtivo}
                    >                        
                        {loadingEmprestimo ? 'Carregando...' : 'Ver Empréstimo'}
                    </button>
                ) : (
                    <button 
                        onClick={() => openEditNote(notebook)}
                        className="text-xs font-medium text-slate-600 hover:underline"
                    >
                        Editar
                    </button>
                )}
            </div>

            {/* Modais de Interação */}
            <ModalHistManutencao
                isOpen={isModalOpenHist} 
                onClose={() => setIsModalOpenHist(false)} 
                notebook={selectedHistManut} 
            />

            <ModalDetalhes 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                emprestimo={emprestimoAtivo} 
            />

            <ModalEditarNote 
                isOpen={isModalOpenEditNote} 
                onClose={() => setIsModalOpenEditNote(false)} 
                notebook={selectedEditNote} 
                refreshList={refreshList}
            />
        </div>
    );
}

export default CardNotebook;