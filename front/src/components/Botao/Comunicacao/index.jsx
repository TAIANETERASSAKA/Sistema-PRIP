const ComunicacaoBtn = ({ id, onClick }) => (
    <button 
        onClick={onClick}
        data-active-id={id} 
        className="chat-btn text-emerald-700 hover:underline text-sm font-medium"
    >
        Comunicação
    </button>
);

export default ComunicacaoBtn;