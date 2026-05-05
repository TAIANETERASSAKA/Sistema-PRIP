import api from '../../../services/api';
import { useEffect, useState } from 'react';
import ModalAddUsuario from '../../../components/Modal/AddUsuario'; 


function Usuario() {
    // --- Lógica para Manipular Modal ---
    const [isModalAddUsuario, setIsModalAddUsuario] = useState(false);

    const openModalAddUsuario = () => setIsModalAddUsuario(true);
    const closeModalAddUsuario = () => setIsModalAddUsuario(false);

    // --- Recebendo os usuários cadastrados ---
    const [usuarios, setUsuarios] = useState([]);

    async function getUsuarios() {
        try {
            const usuariosFromApi = await api.get('/usuarios');
            setUsuarios(usuariosFromApi.data.usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    }

    useEffect(() => {
        getUsuarios();
    }, []);

    return (
        <section id="registration" className="page-section">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h2>
            
            <div className="mb-6">
                <button 
                    onClick={openModalAddUsuario}
                    className="bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-800 transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M5 12h14"/><path d="M12 5v14"/>
                    </svg>
                    Adicionar Novo Usuário
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-black">Usuários Cadastrados</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                            <tr>
                                <th className="p-3">Nome</th>
                                <th className="p-3">Número USP</th>
                                <th className="p-3">Função</th>
                                <th className="p-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id_usuario} className="border-b border-slate-200">
                                    <td className="p-3">{usuario.nome}</td>
                                    <td className="p-3">{usuario.numero_usp}</td>
                                    <td className="p-3">{usuario.isAdmin ? 'Administrador' : 'Aluno'}</td>
                                    <td className="p-3 text-right">
                                        {/* Espaço para botões de ação se necessário */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalAddUsuario
                isOpen={isModalAddUsuario} 
                onClose={closeModalAddUsuario} 
                refreshList={getUsuarios}
            />
        </section>
    );
}

export default Usuario;