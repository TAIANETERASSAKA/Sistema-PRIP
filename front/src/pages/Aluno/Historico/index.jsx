import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import SpanStatus from '../../../components/Span/Status';

function AlunoHistorico() {
  const [emprestimos, setEmprestimos] = useState([]);

  async function getEmprestimos() {
    try {
      const emprestimosFromApi = await api.get('/emprestimos/aluno');
      setEmprestimos(emprestimosFromApi.data);
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error);
    }
  }

  useEffect(() => {
    getEmprestimos();
  }, []);

  return (
    <section id="historico" className="page-section">
      <h2 className="text-2xl font-bold mb-6">Histórico de Empréstimos</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div id="historico-list" className="space-y-3">
          {emprestimos.map((emprestimo) => (
            <div className="border-b border-slate-200 pb-2" key={emprestimo.id_emprestimo}>
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {emprestimo.id_notebook
                    ? `${emprestimo.notebook.marca} ${emprestimo.notebook.modelo}`
                    : 'Nenhum notebook atribuído'}
                </p>
                {(() => {
                  switch (emprestimo.status) {
                    case 3:
                      return <SpanStatus titulo="Em andamento" cor="amber" />;
                    case 4:
                      return <SpanStatus titulo="Finalizado" cor="green" />;
                    case 5:
                      return <SpanStatus titulo="Em atraso" cor="red" />;
                    case 6:
                      return <SpanStatus titulo="Recusado" cor="red" />;
                    default:
                      return null;
                  }
                })()}
              </div>
            <p className="text-sm text-slate-500">
                {
                    ('Solicitado em: ' +  new Date(emprestimo.data_solicitacao).toLocaleDateString('pt-BR') )
                }
            </p>
            <p className="text-sm text-slate-500">
                {(emprestimo.status == 6 && emprestimo.data_recusa) && 
                    ('Recusado em: ' +  new Date(emprestimo.data_recusa).toLocaleDateString('pt-BR') )
                }
            </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AlunoHistorico;