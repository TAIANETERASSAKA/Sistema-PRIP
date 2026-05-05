const SpanSatus = ({ titulo, cor}) => {
    return (    
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full bg-${cor}-100 text-${cor}-800 `}>{titulo}</span>
    )
};

export default SpanSatus;
