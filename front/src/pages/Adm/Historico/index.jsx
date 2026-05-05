import api from '../../../services/api';
import Filtro from '../../../components/Filtro'; 
import SpanSatus from '../../../components/Span/Status'; 
import React, { useState, useEffect } from 'react';

function Historico() {
    const [emprestimos, setEmprestimos] = useState([]);

    //Recebendo os emprestimos cadastrados
    async function getEmprestimos() {
        try {
            const emprestimosFromApi = await api.get('/emprestimos');
            setEmprestimos(emprestimosFromApi.data.emprestimos.filter(item => item.status === 4));
        } catch (error) {
            console.error('Erro ao buscar empréstimos:', error);
        }
    }

    //-----------------LOGICA DE FILTRAGEM DOS EMPRESTIMOS Finalizados--------------------------
    const [filtroAluno, setFiltroAluno] = useState(''); 
    const pegarFiltroAluno = (e) => {
        setFiltroAluno(e.target.value)
    }

    const [filtroPatrimonio, setFiltroPatrimonio] = useState(''); 
    const pegarFiltroPatrimonio = (e) => {
        setFiltroPatrimonio(e.target.value)
    }

    const [filtroDataInic, setfiltroDataInic] = useState(''); 
    const pegarfiltroDataInic = (e) => {
        setfiltroDataInic(e.target.value)
    }

    const [filtroDataFinal, setfiltroDataFinal] = useState(''); 
    const pegarfiltroDataFim = (e) => {
        setfiltroDataFinal(e.target.value)
    }

    const [emprestimosFinalizadosFiltrados, setEmprestimosFinalizadosFiltrados] = useState([]); 
    const filtrarEmprestimoFinalizados = () => {
        let filtrados = [...emprestimos];

        if(filtroAluno){
            filtrados = filtrados.filter(emprestimo => 
                emprestimo.usuario.nome.toLowerCase().includes(filtroAluno.toLowerCase()) || 
                emprestimo.usuario.numero_usp.toLowerCase().includes(filtroAluno.toLowerCase()));
        }

        if(filtroPatrimonio){
            filtrados = filtrados.filter(emprestimo => 
                emprestimo.notebook.numero_patrimonio.toLowerCase().includes(filtroPatrimonio.toLowerCase()));
        }

        if(filtroDataInic){
            filtrados = filtrados.filter(emprestimo => {
                if (emprestimo.data_devolucao_real) {
                    return  emprestimo.data_retirada.split('T')[0] > filtroDataInic;
                }

                return false;
            });
        }

        if(filtroDataFinal){
            filtrados = filtrados.filter(emprestimo => {
                if (emprestimo.data_devolucao_real) {
                    return  emprestimo.data_devolucao_real.split('T')[0] < filtroDataFinal;
                }

                return false;
            });
        }
        
        setEmprestimosFinalizadosFiltrados(filtrados);
    };

    // Efeito para aplicar filtros sempre que os valores dos filtros mudarem
    useEffect(() => {
        filtrarEmprestimoFinalizados();
    }, [filtroAluno, filtroDataFinal, filtroDataInic, filtroPatrimonio]);

    //Carregando os emprestimos ao carregar a página
    useEffect(() => {
        getEmprestimos();
    }, []);
    
  return (
    <section id="history" className="page-section">
        <h2 className="text-2xl font-bold mb-6">Histórico de Empréstimos</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4">Empréstimos Concluídos</h3>
            <div className="flex flex-wrap gap-4 mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Filtro
                        id="filter-history-student"
                        titulo="Aluno"
                        tipo={1}
                        placeholder={'Nome ou N° USP'}
                        onChange={pegarFiltroAluno}
                />
                <Filtro
                        id="filter-history-notebook"
                        titulo="Notebook"
                        tipo={6}
                        placeholder={'N° Patrimônio'}
                        onChange={pegarFiltroPatrimonio}

                />
                <Filtro
                    id="filter-history-date-inicial"
                    titulo="Data Inicial"
                    tipo={2}
                    onChange={pegarfiltroDataInic}
                />
                                <Filtro
                    id="filter-history-date-final"
                    titulo="Data Final"
                    tipo={2}
                    onChange={pegarfiltroDataFim}

                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                        <tr>
                            <th className="p-3">Aluno</th>
                            <th className="p-3">Notebook</th>
                            <th className="p-3">Data de Retirada</th>
                            <th className="p-3">Data de Devolução</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody id="history-loans-body">
                        {(() => {
                            const lista = (filtroPatrimonio || filtroAluno || filtroDataInic || filtroDataFinal)
                                ? emprestimosFinalizadosFiltrados
                                : emprestimos;

                            return lista.map((emprestimo) => (
                                <tr key={emprestimo.id_emprestimo} class="border-b border-slate-200">
                                    <td class="p-3">{emprestimo.usuario.nome}</td>
                                    <td class="p-3">{emprestimo.notebook.marca} {emprestimo.notebook.modelo} ({emprestimo.notebook.numero_patrimonio})</td>
                                    <td class="p-3">{new Date(emprestimo.data_retirada).toLocaleDateString('pt-BR')}</td>
                                    <td class="p-3">{new Date(emprestimo.data_devolucao_real).toLocaleDateString('pt-BR')}</td>
                                    <td class="p-3">
                                        <SpanSatus titulo="Concluído" cor="gray" />
                                    </td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
  );
}

export default Historico;