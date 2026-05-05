import { useState } from 'react';
import { useSignaturePad } from '../../../hooks/useSignaturePad';
import api from '../../../services/api';

function ModalTermoCompromisso({ isOpen, onClose, emprestimo , refreshEmprestimos}) {
    if (!isOpen || !emprestimo) return null;

    const { clear, getBase64, isEmpty } = useSignaturePad('signature-pad');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const handleConfirmar = async () => {
        const assinatura = getBase64();
        if (!assinatura) {
            setErro('Por favor, assine o termo antes de confirmar.');
            return;
        }

        setErro('');
        setLoading(true);

        try {
            const formData = {
                id_emprestimo: emprestimo.id_emprestimo,
                assinatura_base64: assinatura
            };
            const res =  await api.post('/termos', formData);
            refreshEmprestimos()
            onClose()
        } catch (e) {
            setErro(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl relative">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-2xl font-bold">Termo de Empréstimo</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
                </div>

                <div className="p-8">
                    <h3 className="text-lg font-semibold mb-2">Contrato de Responsabilidade</h3>
                    <div className="prose prose-sm max-w-none h-48 overflow-y-auto border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
                        <p>Eu, <span className="font-semibold">{emprestimo.usuario?.nome}</span>, 
                        matrícula <span className="font-semibold">{emprestimo.usuario?.numero_usp}</span>, 
                        declaro que no dia {new Date().toLocaleDateString('pt-BR')}, recebi o notebook modelo <span className="font-semibold">{emprestimo.notebook?.modelo}</span> (N patrimonio: {emprestimo.notebook?.numero_patrimonio}) em perfeitas condições de uso.</p>
                        <p>Comprometo-me a zelar pelo equipamento, utilizando-o de forma adequada e exclusiva para fins acadêmicos. Fico ciente de que sou responsável por quaisquer danos, perda ou roubo do equipamento durante o período de empréstimo.</p>
                        <p>A devolução deverá ser feita até a data estipulada, <strong>respeitando o prazo máximo de 1 (um) semestre letivo</strong>, conforme definido pela comissão responsável. O não cumprimento do prazo implicará em sanções previstas no regulamento da instituição.</p>                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Assine no campo abaixo:</label>
                        <canvas id="signature-pad" className="w-full h-[200px] bg-white border border-slate-300 rounded-lg"></canvas>
                    </div>

                    {erro && (
                        <p className="text-red-600 text-sm mb-4">{erro}</p>
                    )}


                    <div className="flex items-center justify-end gap-4 mt-6">
                        <button onClick={clear} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                            Limpar
                        </button>
                        <button
                            onClick={handleConfirmar}
                            disabled={loading || isEmpty}
                            className="bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Salvando...' : 'Confirmar Assinatura'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalTermoCompromisso;