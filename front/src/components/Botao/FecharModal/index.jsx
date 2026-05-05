function FecharBtn({ id, onClose }) {         

    return (    
    <button 
        id={id}
        onClick={onClose} 
        className="p-1 text-slate-400 hover:text-slate-600 transition-colors z-10 absolute top-4 right-4"
    > 
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    )
}

export default FecharBtn;