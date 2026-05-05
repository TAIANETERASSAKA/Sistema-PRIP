import api from '../../../services/api';
import Filtro from '../../../components/Filtro'; 
import ModalAddNote from '../../../components/Modal/AddNotebook'; 
import CardNotebook from '../../../components/Card/Notebook'; 
import { useEffect, useState } from 'react';


function Notebook() {
    // --- Lógica para Manipular Modal ---
    const [isModalAddNotebook, setIsModalAddNotebook] = useState(false);

    const openModalAddNotebook = () => setIsModalAddNotebook(true);
    const closeModalAddNotebook = () => setIsModalAddNotebook(false);
    
    //----------------Notebooks----------------//
    const [notebooks, setNotebooks] = useState([]);

    //Recebendo os notebooks cadastrados
    async function getNotebooks() {
        try {
            const notebooksFromApi = await api.get('/notebooks');
            setNotebooks(notebooksFromApi.data.notebooks);
        } catch (error) {
            console.error('Erro ao buscar notebooks:', error);
        }
    }

    //-----------------LOGICA DE FILTRAGEM DE NOTEBOOKS--------------------------
    const [filtroPatrimonio, setFiltroPatrimonio] = useState(''); 
    const pegarFiltroPatrimonio = (e) => {
        setFiltroPatrimonio(e.target.value)
    }

    const [filtroStatus, setFiltroStatus] = useState(''); 
    const pegarFiltroStatus = (e) => {
        setFiltroStatus(e.target.value)
    }


    const [filtroMarca, setFiltroMarca] = useState(''); 
    const pegarFiltroMarca = (e) => {
        setFiltroMarca(e.target.value)
    }

    const [filtroModelo, setFiltroModelo] = useState(''); 
    const pegarFiltroModelo = (e) => {
        setFiltroModelo(e.target.value)
    }

    const [notebooksFiltrados, setnotebooksFiltrados] = useState([]); 
    const filtrarNotebooks = () => {
        let filtrados = [...notebooks];

        if(filtroPatrimonio){
            filtrados = filtrados.filter(notebook => 
                notebook.numero_patrimonio.toLowerCase().includes(filtroPatrimonio.toLowerCase()));
        }

        if(filtroStatus){
            filtrados = filtrados.filter(notebook => {
                    return  notebook.status == filtroStatus;
            });
        }

        if(filtroMarca){
            filtrados = filtrados.filter(notebook => 
                notebook.marca.toLowerCase().includes(filtroMarca.toLowerCase()));
        }

        if(filtroModelo){
            filtrados = filtrados.filter(notebook => 
                notebook.modelo.toLowerCase().includes(filtroModelo.toLowerCase()));
        }


        setnotebooksFiltrados(filtrados);
    };

    // Efeito para aplicar filtros sempre que os valores dos filtros mudarem
    useEffect(() => {
        filtrarNotebooks();
    }, [filtroPatrimonio, filtroStatus, filtroMarca, filtroModelo ]);

    //Carregando os notebooks ao carregar a página
    useEffect(() => {
        getNotebooks();
    }, []);
    

  return (
    <section id="laptops" class="page-section">
        <h2 class="text-2xl font-bold mb-6">Gerenciamento de Notebooks</h2>
        <div class="mb-4 relative">
            <Filtro
                id="filter-history-notebook"
                tipo={1}
                placeholder={'N° Patrimônio'}
                onChange={pegarFiltroPatrimonio}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
        </div>
    
        <div class="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div class="flex-1 min-w-[150px]">
                <Filtro
                    id="filter-laptop-status"
                    titulo="Status"
                    tipo={3}
                    onChange={pegarFiltroStatus}
                />
            </div>
            <div class="flex-1 min-w-[150px]">
                <Filtro
                    id="filter-laptop-marca"
                    titulo="Marca"
                    tipo={5}
                    onChange={pegarFiltroMarca}

                />
            </div>
            <div class="flex-1 min-w-[150px]">
                <Filtro
                    id="filter-laptop-model"
                    titulo="Modelo"
                    tipo={1}
                    placeholder={"Ex: XPS 13"}
                    onChange={pegarFiltroModelo}

                />
            </div>
        </div>
    
        <div id="laptop-grid-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button id="add-laptop-card-btn" onClick={openModalAddNotebook} class="bg-white p-4 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:border-sky-500 hover:text-sky-600 transition-colors flex flex-col items-center justify-center min-h-[220px] shadow-sm hover:shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 mb-2">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
                <span class="font-semibold">Registrar Novo Notebook</span>
            </button>
            {(() => {
                const lista = (filtroPatrimonio || filtroStatus || filtroMarca || filtroModelo)
                    ? notebooksFiltrados
                    : notebooks;

                return lista.map((notebook) => (
                    <CardNotebook
                        key={notebook.id_note}
                        notebook={notebook}
                        refreshList={getNotebooks}
                    />
                ));
            })()}
        </div>

        <ModalAddNote
            isOpen={isModalAddNotebook} 
            onClose={closeModalAddNotebook} 
            refreshList={getNotebooks}
        />
    </section>
  );
}

export default Notebook;