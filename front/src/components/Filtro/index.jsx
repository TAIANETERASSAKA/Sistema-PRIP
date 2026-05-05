const Filtro = ({ id, titulo, tipo, placeholder, onChange }) => {
    //tipo 1: aluno/marca/n patrimonio  / 2: data / 3: statusNote / 4: statusEmprestimo   
    const opcoesData = {
        3: [ 
            { value: 1, label: "Disponível" },
            { value: 2, label: "Emprestado" },
            { value: 3, label: "Manutenção" }
        ],
        4: [ 
            { value: 3, label: "Em uso" },
            { value: 2, label: "Retirada Pendente" },
            { value: 5, label: "Atrasado" }
        ],
        5: [ 
            { value: "Dell", label: "Dell" },
            { value: "Apple", label: "Apple" },
            { value: "Lenovo", label: "Lenovo" },
            { value: "HP", label: "HP" },
            { value: "Asus",  label: "Asus" },
            { value: "Microsoft", label: "Microsoft" },
            { value: "Acer", label: "Acer" }
        ]
    };

    // Pegamos as opções baseadas no tipo, se existirem
    const opcoes = opcoesData[tipo] || [];

    return (
        <div className="flex-1 min-w-[150px]">
            <label htmlFor={id} className="text-sm font-medium text-slate-600 block mb-1">
                {titulo}
            </label>
            
            {tipo !== 2 && tipo !== 1 && tipo !== 6  ? (
                <select id={id} onChange={onChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                    <option value="">Todos</option>
                    {opcoes.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input 
                    type={tipo === 2 ? "date" : "text"} 
                    id={id} 
                    placeholder={placeholder}  
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    onChange={onChange}
                />
            )}
        </div>
    );
};

export default Filtro;