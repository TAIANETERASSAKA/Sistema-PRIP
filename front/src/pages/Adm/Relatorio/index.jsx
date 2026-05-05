import api from '../../../services/api';
import React, { useState, useEffect } from 'react';

function Relatorio() {

  const [relatorioStatusNote, setStatusNote] = useState([]);

  //----------------Relatorio dos status dos notebooks----------------//
  //Recebendo os status dos notebooks cadastrados
  async function getStatusNote() {
      try {
          const relatorioStatusNoteFromApi = await api.get('/notebooks');
          setStatusNote(relatorioStatusNoteFromApi.data.notebooks);
      } catch (error) {
          console.error('Erro ao buscar status dos notebooks:', error);
      }
  }

  // Calculando os totais com base no atributo 'status'
  const total = relatorioStatusNote.length;
  const disponiveis = relatorioStatusNote.filter(n => n.status === 1).length;
  const emprestados = relatorioStatusNote.filter(n => n.status === 2).length;
  const manutencao = relatorioStatusNote.filter(n => n.status === 3).length;

  // Função para calcular a porcentagem da barra
  const calcularPercentual = (valor) => {
    if (total === 0) return 0;
    return (valor / total) * 100;
  };


  //----------------Relatorio dos emprestimos por mes----------------//
  const [emprestimos, setEmprestimosMes] = useState([]);

  //Recebendo os emprestimos cadastrados
  async function getEmprestimosMes() {
      try {
          const emprestimosFromApi = await api.get('/emprestimos');
          setEmprestimosMes(emprestimosFromApi.data.emprestimos);
      } catch (error) {
          console.error('Erro ao buscar empréstimos:', error);
      }
  }

  // Lógica para contabilizar empréstimos por mês
  const contagemPorMes = Array(12).fill(0); // Cria um array [0, 0, ..., 0] para os 12 meses

  emprestimos.forEach(emp => {
    if (emp.data_retirada) {
      const data = new Date(emp.data_retirada);
      const mes = data.getUTCMonth(); // Retorna 0 para Janeiro, 1 para Fevereiro, etc.
      contagemPorMes[mes] += 1;
    }
  });

  // Encontra o maior valor para calcular a altura proporcional (escala do gráfico)
  const valorMaximo = Math.max(...contagemPorMes, 1); // Evita divisão por zero

  const mesesLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  //Carregando os relatorios ao inicializar a página
  useEffect(() => {
    getStatusNote();
    getEmprestimosMes();

  }, []);
  
  return (
    <section id="reports" className="page-section">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Relatórios de Utilização</h2>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h3 className="font-semibold text-lg mb-4 text-slate-700">Status da Frota de Notebooks</h3>
        
        <div className="space-y-4">
          {/* Barra: Disponíveis */}
          <ProgressBar 
            label="Disponíveis" 
            valor={disponiveis} 
            percentual={calcularPercentual(disponiveis)} 
            cor="bg-emerald-500" 
          />

          {/* Barra: Emprestados */}
          <ProgressBar 
            label="Emprestados" 
            valor={emprestados} 
            percentual={calcularPercentual(emprestados)} 
            cor="bg-amber-500" 
          />

          {/* Barra: Manutenção */}
          <ProgressBar 
            label="Manutenção" 
            valor={manutencao} 
            percentual={calcularPercentual(manutencao)} 
            cor="bg-red-500" 
          />

          {/* Barra: Total */}
          <div className="flex items-center gap-4">
            <span className="w-28 text-sm font-medium text-slate-600">Total</span>
            <div className="w-full bg-slate-200 rounded-full h-6">
              <div 
                className="bg-sky-700 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                style={{ width: '100%' }}
              >
                {total}
              </div>
            </div>
          </div>
        </div>

        {/* Seção do Gráfico de Meses*/}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="font-semibold text-lg mb-4 text-slate-700">Empréstimos por Mês</h3>
          <div className="flex items-end h-48 space-x-2 sm:space-x-4">
            {contagemPorMes.map((quantidade, index) => (
              <BarraMes 
                key={mesesLabels[index]} 
                mes={mesesLabels[index]} 
                altura={`${(quantidade / valorMaximo) * 100}%`} 
                valor={quantidade}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Sub-componente para as Barras de Progresso para evitar repetição de código
const ProgressBar = ({ label, valor, percentual, cor }) => (
  <div className="flex items-center gap-4">
    <span className="w-28 text-sm font-medium text-slate-600">{label}</span>
    <div className="w-full bg-slate-200 rounded-full h-6">
      <div 
        className={`${cor} h-6 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-700 ease-out`}
        style={{ width: `${percentual}%`, minWidth: valor > 0 ? '2rem' : '0' }}
      >
        {valor}
      </div>
    </div>
  </div>
);

// Sub-componente para as Barras de Mes para evitar repetição de código
const BarraMes = ({ mes, altura, valor }) => (
  <div className="flex-1 flex flex-col items-center justify-end h-full group"> 
    {/* Tooltip ou valor fixo aparece ao passar o mouse ou sempre */}
    <span className="text-[10px] font-bold text-sky-700 mb-1">{valor > 0 ? valor : ""}</span>
    <div 
      className="bg-sky-500 w-full max-w-[40px] transition-all duration-700 ease-out rounded-t-sm hover:bg-sky-600 cursor-help" 
      style={{ height: altura }}
      title={`${valor} empréstimos`}
    ></div>
    <span className="text-xs mt-2 text-slate-500 font-medium">{mes}</span>
  </div>
);

export default Relatorio;