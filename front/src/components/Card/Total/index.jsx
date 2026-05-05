const CardTotal = ({ id, titulo, valor, cor }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-slate-500 font-medium">{titulo}</h3>
      
      <p id={id} className={`text-3xl font-bold ${cor}`}>
        {valor}
      </p>
    </div>
  );
  
  export default CardTotal;