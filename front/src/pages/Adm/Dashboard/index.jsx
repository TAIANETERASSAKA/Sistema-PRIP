import api from '../../../services/api';
import React, { useState, useEffect } from 'react';
import ModalDetalhes from '../../../components/Modal/DetalhesEmprestimo'; 
import CardTotal from '../../../components/Card/Total'; 
import Filtro from '../../../components/Filtro'; 
import SpanSatus from '../../../components/Span/Status'; 
import ConfirmarRetiradaBtn from '../../../components/Botao/ConfirmarRetirada'; 
import RegistrarDevolucaoBtn from '../../../components/Botao/RegistrarDevolucao'; 
import ModalConfirRetirada from '../../../components/Modal/ConfirmarRetirada'; 
import ModalRegistDevolucao from '../../../components/Modal/RegistrarDevolucao'; 
import DetalhesEmprestimoBtn from '../../../components/Botao/DetalhesEmprestimo'; 
import ComunicacaoBtn from '../../../components/Botao/Comunicacao'; 
import ModalChat from '../../../components/Modal/Comunicacao'; 
import ModalAtribuirNote from '../../../components/Modal/AtribuirNotebook'; 
import ModalTermoCompromisso from '../../../components/Modal/TermoCompromisso'; 

function Dashboard() {
    //----------------Manipulacao Modal Detalhes----------------//
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmprestimo, setSelectedEmprestimo] = useState(null); 

    const openDetails = (item) => {
        setSelectedEmprestimo(item);
        setIsModalOpen(true);
    };

    //----------------Manipulacao Modal ConfirRetirada----------------//
    const [isModalOpenConfirRetirada, setIsModalOpenConfirRetirada] = useState(false);
    const [selectedConfirRetirada, setSelectedConfirRetirada] = useState(null); 

    const openConfirRetirada = (item) => {
        setSelectedConfirRetirada(item);
        setIsModalOpenConfirRetirada(true);
    };

    //----------------Manipulacao Termo Compromisso----------------//
    const [isModalOpenTermo, setIsModalOpenTermo] = useState(false);
    const [selectedTermo, setSelectedTermo] = useState(null);

    const handleConfirRetiradaContinuar = () => {
        setIsModalOpenConfirRetirada(false);
        setSelectedTermo(selectedConfirRetirada); // mesmo objeto de emprestimo
        setIsModalOpenTermo(true);
    };

    //----------------Manipulacao Modal Registrar Devolucao----------------//
    const [isModalOpenRegistDevolucao, setIsModalOpenRegistDevolucao] = useState(false);
    const [selectedRegistDevolucao, setSelectedRegistDevolucao] = useState(null); 

    const openRegistDevolucao = (item) => {
        setSelectedRegistDevolucao(item);
        setIsModalOpenRegistDevolucao(true);
    };

    //----------------Manipulacao Modal Chat----------------//
    const [isModalOpenChat, setIsModalOpenChat] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null); 

    const openDetailsChat = (item) => {
        setSelectedChat(item);
        setIsModalOpenChat(true);
    };

    //----------------Manipulacao Modal Atribuir Note---------------//
    const [isModalAtribuirNoteOpen, setIsModalAtribuirNote] = useState(false);
    const openAtribuirModal = () => {
        setIsModalAtribuirNote(true);
    };

    //----------------Notebooks----------------//
    const [relatorioNote, setNote] = useState([]);

    //Recebendo os status dos notebooks cadastrados
    async function getNote() {
        try {
            const relatorioNoteFromApi = await api.get('/notebooks');
            setNote(relatorioNoteFromApi.data.notebooks);
        } catch (error) {
            console.error('Erro ao buscar informações notebooks:', error);
        }
    }
  
    // Calculando os totais com base no atributo 'status'
    const total = relatorioNote.length;
    const disponiveis = relatorioNote.filter(n => n.status === 1).length;
    const emprestados = relatorioNote.filter(n => n.status === 2).length;

    //----------------Emprestimos----------------//
    const [relatorioEmprestimos, setEmprestimos] = useState([]);

    //Recebendo os emprestimos cadastrados
    async function getEmprestimos() {
        try {
            const emprestimosFromApi = await api.get('/emprestimos');
            setEmprestimos(emprestimosFromApi.data.emprestimos);
        } catch (error) {
            console.error('Erro ao buscar empréstimos:', error);
        }
    }

    // Calculando os totais com base no atributo 'status'
    const pendentesBusca = relatorioEmprestimos.filter(n => n.status === 1)
    const ativosBusca = relatorioEmprestimos.filter(n => n.status !== 1 && n.status !== 4 && n.status !== 6);

    const pendentes = relatorioEmprestimos.filter(n => n.status === 1).length;
    const aguardandoRetirada = relatorioEmprestimos.filter(n => n.status === 2).length;
    const atrasados = relatorioEmprestimos.filter(n => n.status === 5).length;

    //-----------------LOGICA DE FILTRAGEM DOS EMPRESTIMOS ATIVOS--------------------------
    //Pegando o aluno (nome/n_usp) atual
    const [filtroAlunoAtivo, setFiltroAlunoAtivo] = useState(''); 
    const pegarAlunoAtivo = (e) => {
        setFiltroAlunoAtivo(e.target.value)
    }

    //Pegando o status atual
    const [filtroStatus, setFiltroStatus] = useState(''); 
    const pegarFiltroStatus = (e) => {
        setFiltroStatus(e.target.value)
    }

    //Pegando a data de devolução prevista atual
    const [filtroDataDev, setFiltroDataDev] = useState(''); 
    const pegarFiltroDataDev = (e) => {
        setFiltroDataDev(e.target.value)
    }

    //Aplicando os filtros
    const [emprestimosAtivosFiltrados, setemprestimosAtivosFiltrados] = useState([]); 
    const filtrarEmprestimoAtivos = () => {
        let filtrados = [...ativosBusca];

        if(filtroAlunoAtivo){
            filtrados = filtrados.filter(emprestimo => 
                emprestimo.usuario.nome.toLowerCase().includes(filtroAlunoAtivo.toLowerCase()) || 
                emprestimo.usuario.numero_usp.toLowerCase().includes(filtroAlunoAtivo.toLowerCase()));
        }

        if(filtroStatus){
            filtrados = filtrados.filter(emprestimo => {
                    return  emprestimo.status == filtroStatus;
            });
        }

        if(filtroDataDev){
            filtrados = filtrados.filter(emprestimo => {
                if (emprestimo.data_devolucao_prevista) {
                    return  emprestimo.data_devolucao_prevista.split('T')[0] === filtroDataDev;
                }

                return false;
            });
        }

        setemprestimosAtivosFiltrados(filtrados);
    };

    // Efeito para aplicar filtros sempre que os valores dos filtros mudarem
    useEffect(() => {
        filtrarEmprestimoAtivos();
    }, [filtroAlunoAtivo, filtroStatus, filtroDataDev]);

    //-----------------LOGICA DE FILTRAGEM DOS EMPRESTIMOS PENDENTES--------------------------
    const [filtroAlunoPendente, setFiltroAlunoPend] = useState(''); 
    const pegarAlunoPend = (e) => {
        setFiltroAlunoPend(e.target.value)
    }

    const [filtroDataSolic, setFiltroDataSolic] = useState(''); 
    const pegarFiltroDataSolic = (e) => {
        setFiltroDataSolic(e.target.value)
    }

    const [emprestimosPendentesFiltrados, setEmprestimosPendentesFiltrados] = useState([]); 
    const filtrarEmprestimoPendentes = () => {
        let filtrados = [...pendentesBusca];

        if(filtroAlunoPendente){
            filtrados = filtrados.filter(emprestimo => 
                emprestimo.usuario.nome.toLowerCase().includes(filtroAlunoPendente.toLowerCase()) || 
                emprestimo.usuario.numero_usp.toLowerCase().includes(filtroAlunoPendente.toLowerCase()));
        }

        if(filtroDataSolic){
            filtrados = filtrados.filter(emprestimo => {
                if (emprestimo.data_solicitacao) {
                    return  emprestimo.data_solicitacao.split('T')[0] === filtroDataSolic;
                }

                return false;
            });
        }
        
        setEmprestimosPendentesFiltrados(filtrados);
    };

    // Efeito para aplicar filtros sempre que os valores dos filtros mudarem
    useEffect(() => {
        filtrarEmprestimoPendentes();
    }, [filtroAlunoPendente, filtroDataSolic]);

    //-----------------FUNCOES CHAMADAS ASSIM QUE A PAGINA CARREGA--------------------------
    useEffect(() => {
    getNote();
    getEmprestimos();
    }, []);
  
    return (
        <section id="dashboard" class="page-section">
            <h2 class="text-2xl font-bold mb-6">Dashboard do Administrador</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <CardTotal 
                    id="card-total"
                    titulo="Total de Notebooks" 
                    cor="text-sky-700"
                    valor={total}   
                />
                <CardTotal 
                    id="card-emprestados"
                    titulo="Notebooks Emprestados" 
                    cor="text-amber-600"
                    valor={emprestados}   
                />
                <CardTotal 
                    id="card-disponiveis"
                    titulo="Notebooks Disponíveis" 
                    cor="text-emerald-600"
                    valor={disponiveis}   
                />
                <CardTotal 
                    id="card-pendentes"
                    titulo="Solicitações Pendentes" 
                    cor="text-blue-600"
                    valor={pendentes}   
                />
                <CardTotal 
                    id="card-aguardando-retirada"
                    titulo="Pendentes para Retirada" 
                    cor="text-purple-600"
                    valor={aguardandoRetirada}   
                />
                <CardTotal 
                    id="card-atrasados"
                    titulo="Empréstimos Atrasados" 
                    valor={atrasados}   
                    cor="text-red-600"
                />
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h3 class="text-lg font-semibold mb-4">Empréstimos Pendentes</h3>       
                <div class="flex flex-wrap gap-4 mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <Filtro
                        id="filter-pending-student"
                        titulo="Aluno"
                        tipo={1}
                        placeholder={'Nome ou N° USP'}
                        onChange={pegarAlunoPend}
                    />
                    <Filtro 
                        id="filter-pending-date"
                        titulo="Data Solicitação"
                        tipo={2}
                        onChange={pegarFiltroDataSolic}
                    />
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                            <tr>
                                <th class="p-3">Aluno</th>
                                <th class="p-3">Data da Solicitação</th>
                                <th class="p-3">Status</th>
                                <th class="p-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="pending-loans-body">
                            {(()=>{
                                    const dadosParaExibir = (filtroAlunoPendente || filtroDataSolic) ? emprestimosPendentesFiltrados : pendentesBusca;

                                    if(dadosParaExibir.length > 0){
                                        return dadosParaExibir.map((emprestimo) => (
                                            <tr key={emprestimo.id_emprestimo} class="border-b border-slate-200">
                                                <td class="p-3">{emprestimo.usuario.nome}</td>
                                                <td class="p-3">{new Date(emprestimo.data_solicitacao).toLocaleDateString('pt-BR')}</td>
                                                <td class="p-3">
                                                    <SpanSatus titulo="Pendente" cor="blue" />
                                                </td>
                                                <td class="p-3">
                                                    <div class="flex items-center justify-between gap-4"> 
                                                        <DetalhesEmprestimoBtn onClick={() => openDetails(emprestimo)} id={emprestimo.id_emprestimo}/>
                                                        <ComunicacaoBtn onClick={() => openDetailsChat(emprestimo)} id={emprestimo.id_emprestimo}/>
                                                    </div>
                                                </td>
                                            </tr>))

                                    }else{
                                        return (
                                            <tr>
                                                <td colSpan="6" class="p-4 text-center text-slate-500">
                                                    Nenhum empréstimo encontrado.
                                                </td>
                                            </tr>
                                        );
                                    }
                            })()}  
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 class="text-lg font-semibold mb-4">Empréstimos Ativos</h3>
                <div class="flex flex-wrap gap-4 mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <Filtro
                        id="filter-active-student"
                        titulo="Aluno"
                        tipo={1}
                        placeholder={'Nome ou N° USP'}
                        onChange={pegarAlunoAtivo}

                    />
                    <Filtro
                        id="filter-active-status"
                        titulo="Status"
                        tipo={4}
                        onChange={pegarFiltroStatus}
                    />
                    <Filtro
                        id="filter-active-date"
                        titulo="Data Devolução"
                        tipo={2}
                        onChange={pegarFiltroDataDev}
                    />
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                            <tr>
                                <th class="p-3">Aluno</th>
                                <th class="p-3">Notebook</th>
                                <th class="p-3">Data de Retirada</th>
                                <th class="p-3">Data de Devolução</th>
                                <th class="p-3">Status</th>
                                <th class="p-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="active-loans-body">
                            {(() => {
                                const dadosParaExibir = (filtroAlunoAtivo || filtroStatus || filtroDataDev) 
                                    ? emprestimosAtivosFiltrados 
                                    : ativosBusca;
                                
                                if (dadosParaExibir.length > 0) {
                                    return dadosParaExibir.map((emprestimo) => (
                                        <tr key={emprestimo.id_emprestimo} class="border-b border-slate-200">
                                            <td class="p-3">{emprestimo.usuario.nome}</td>
                                            <td class="p-3">{emprestimo.notebook.marca} {emprestimo.notebook.modelo}</td>
                                            <td class="p-3">{emprestimo.data_retirada ? new Date(emprestimo.data_retirada).toLocaleDateString('pt-BR') : ''}</td>
                                            <td class="p-3">{emprestimo.data_devolucao_prevista ? new Date(emprestimo.data_devolucao_prevista).toLocaleDateString('pt-BR') : ''}</td>
                                            <td class="p-3">
                                                {(() => {
                                                    switch (emprestimo.status) {
                                                        case 2:
                                                            return <SpanSatus titulo="Aguardando Retirada" cor="amber" />;
                                                        case 3:
                                                            return <SpanSatus titulo="Em uso" cor="green" />;
                                                        case 5:
                                                            return <SpanSatus titulo="Em atraso" cor="red" />;
                                                        default:
                                                            return null;
                                                    }
                                                })()}
                                            </td>
                                            <td class="p-3">
                                                <div class="flex items-center justify-between gap-4"> 
                                                    <DetalhesEmprestimoBtn onClick={() => openDetails(emprestimo)} id={emprestimo.id_emprestimo}/>
                                                    {(() => {
                                                        switch (emprestimo.status) {
                                                            case 2:
                                                                return <ConfirmarRetiradaBtn onClick={() => openConfirRetirada(emprestimo)} id={emprestimo.id_emprestimo}/>;
                                                            case 3:
                                                            case 5:
                                                                return <RegistrarDevolucaoBtn onClick={() => openRegistDevolucao(emprestimo)} id={emprestimo.id_emprestimo} />;
                                                            default:
                                                                return null;
                                                        }
                                                    })()}
                                                </div>
                                            </td>
                                        </tr>
                                    ));
                                } else {
                                    return (
                                        <tr>
                                            <td colSpan="6" class="p-4 text-center text-slate-500">
                                                Nenhum empréstimo encontrado.
                                            </td>
                                        </tr>
                                    );
                                }
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalDetalhes 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                emprestimo={selectedEmprestimo} 
            />

            <ModalConfirRetirada
                isOpen={isModalOpenConfirRetirada}
                onClose={() => setIsModalOpenConfirRetirada(false)}
                emprestimo={selectedConfirRetirada}
                onContinuar={handleConfirRetiradaContinuar} 
            />

            <ModalTermoCompromisso
                isOpen={isModalOpenTermo} 
                onClose={() => setIsModalOpenTermo(false)} 
                emprestimo={selectedTermo} 
                refreshEmprestimos={getEmprestimos}
            />

            <ModalRegistDevolucao 
                isOpen={isModalOpenRegistDevolucao} 
                onClose={() => setIsModalOpenRegistDevolucao(false)} 
                emprestimo={selectedRegistDevolucao} 
                refreshEmprestimos={getEmprestimos}
            />

            <ModalChat
                isOpen={isModalOpenChat} 
                onClose={() => setIsModalOpenChat(false)} 
                emprestimo={selectedChat} 
                onOpenAtribuirModal={openAtribuirModal}
                refreshEmprestimos={getEmprestimos}
            />

            <ModalAtribuirNote
                isOpen={isModalAtribuirNoteOpen} 
                onClose={() => setIsModalAtribuirNote(false)}
                emprestimo={selectedChat} 
                notebooksDisponiveis={relatorioNote.filter(n => n.status === 1)}
                refreshEmprestimos={getEmprestimos}
            />
        </section>
    )
}

export default Dashboard;