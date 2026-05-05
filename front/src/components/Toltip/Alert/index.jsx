import { useState, useEffect } from 'react';

function Alerta({ mensagem, tipo, duracao = 3000, onClose }) {
    const [visivel, setVisivel] = useState(true);

    useEffect(() => {
        if (duracao > 0) {
            const timer = setTimeout(() => {
                setVisivel(false);
                if (onClose) onClose();
            }, duracao);
            return () => clearTimeout(timer);
        }
    }, [duracao, onClose]);

    if (!visivel) return null;

    const cores = {
        sucesso: 'bg-emerald-50 border-emerald-500 text-emerald-800',
        erro: 'bg-red-50 border-red-500 text-red-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800'
    };

    const icones = {
        sucesso: '✓',
        erro: '✗',
        info: 'ℹ'
    };

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border-l-4 shadow-lg ${cores[tipo]}`} role="alert">
            <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{icones[tipo]}</span>
                <div className="flex-1">
                    <p className="text-sm font-medium">{mensagem}</p>
                </div>
                <button 
                    onClick={() => {
                        setVisivel(false);
                        if (onClose) onClose();
                    }}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default Alerta;