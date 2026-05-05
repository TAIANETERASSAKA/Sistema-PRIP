const DetalhesEmprestimoBtn = ({ id, onClick }) => (
    <button 
        onClick={onClick}
        data-active-id={id} 
        className="view-pending-details-btn text-sky-700 hover:underline text-sm font-medium"
    >
        Ver Detalhes
    </button>
);

export default DetalhesEmprestimoBtn;