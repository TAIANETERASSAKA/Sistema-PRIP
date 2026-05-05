const ConfirmarRetiradaBtn = ({ id, onClick }) => (
    <button 
        onClick={onClick}
        data-active-id={id} 
        className="open-signature-btn text-sm bg-emerald-100 text-emerald-700 font-semibold py-1 px-3 rounded-lg hover:bg-emerald-200 transition-colors"
    >
        Confirmar Retirada
    </button>
);

export default ConfirmarRetiradaBtn;