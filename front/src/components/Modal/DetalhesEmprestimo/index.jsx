import FecharBtn from '../../../components/Botao/FecharModal';

function ModalDetalhes({ isOpen, onClose, emprestimo }) {
    if (!isOpen || !emprestimo) return null;

    return (
         <div 
            onClick={(e) => e.target.id === 'modal-overlay' && onClose()} 
            id="modal-overlay" 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        >
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl relative flex flex-col max-h-[90vh]"> 
                <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 p-6 relative flex-shrink-0">
                    <h3 className="text-xl font-bold text-slate-800">Detalhes do Empréstimo</h3>
                    <FecharBtn id="close-confirm-pickup-modal" onClose={onClose} />
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </div>
                                <h4 className="text-lg font-semibold text-slate-700">Dados do Aluno</h4>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-500">Nome</label>
                                    <p className="font-medium text-slate-800">{emprestimo.usuario.nome || 'Não informado'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-500">Número USP</label>
                                    <p className="font-medium text-slate-800">{emprestimo.usuario.numero_usp || '--'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-500">Email institucional </label>
                                    <p className="font-medium text-slate-800">{emprestimo.usuario.email || '--'}</p>
                                </div>
                            </div>
                        </div>
    
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>
                                </div>
                                <h4 className="text-lg font-semibold text-slate-700">Notebook</h4>
                            </div>
                             <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-500">Equipamento</label>
                                    <p className="font-medium text-slate-800">
                                        {emprestimo.notebook 
                                            ? `${emprestimo.notebook.marca} - ${emprestimo.notebook.modelo}` 
                                            : 'Nenhum notebook atribuído'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-500">Nº de Patrimônio</label>
                                    <p className="font-medium text-slate-800">
                                        {emprestimo.notebook 
                                            ? `${emprestimo.notebook.numero_patrimonio}` 
                                            : '---'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-6 md:p-8 pt-0 md:pt-0 space-y-6">
                    <div id="details-obs-wrapper" class="space-y-3">
                        <h4 class="text-md font-semibold text-slate-600 border-t border-slate-200 pt-6">
                            Observações da Retirada
                        </h4>
                        <p id="details-notebook-obs" class="font-medium text-slate-700 bg-slate-50 p-3 rounded-lg text-sm">
                            {emprestimo.observacao 
                                ? `${emprestimo.observacao}` 
                                : 'Sem observação registrada na retirada'
                            }  
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalDetalhes;