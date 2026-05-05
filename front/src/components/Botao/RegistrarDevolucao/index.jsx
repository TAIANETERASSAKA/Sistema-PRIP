const RegistrarDevolucaoBtn = ({ id, onClick }) => (
    <button 
        onClick={onClick}
        data-active-id={id} 
        className="open-return-modal-btn text-sm bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-lg hover:bg-blue-200 transition-colors"
    >
        Registrar Devolução
    </button>
);

export default RegistrarDevolucaoBtn;