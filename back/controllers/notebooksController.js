const { Notebook } = require('../models');

// Listar todos os notebooks
exports.listarNotebooks = async (req, res) => {
    try {
        const notebookList = await Notebook.findAll();
        res.status(200).json({ success: true, notebooks : notebookList });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.criarNotebook = async (req, res) => {
    try {
        const novo_notebook = await Notebook.create({
            numero_patrimonio: req.body.numero_patrimonio,
            marca: req.body.marca,
            status: req.body.status,
            modelo: req.body.modelo,
            especif: req.body.especif
        });

        res.status(200).json({ success: true });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: "patrimonio_duplicado",
                message: "Este número de patrimônio já está cadastrado no sistema."
            });
        }
        
        res.status(400).json({ error: error.message });
    }
};

// Editar notebook
exports.editarNotebook = async (req, res) => {
    try {
        console.log(req.params.id)
        const [linhasAfetadas, notebooksAtualizados] = await Notebook.update(
            {
                numero_patrimonio: req.body.numero_patrimonio,
                marca: req.body.marca,
                status: req.body.status,
                modelo: req.body.modelo,
                especif: req.body.especif
            },
            {
                where: { id_notebook: req.params.id },
                returning: true 
            }
        );

        if (linhasAfetadas === 0) {
            return res.status(404).json({ message: 'Notebook não encontrado' });
        }

        res.json({success: true});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deletar notebook
exports.deletarNotebook = async (req, res) => {
    try {
        const linhasDeletadas = await Notebook.destroy({
            where: { id_notebook: req.params.id }
        });

        if (linhasDeletadas === 0) {
            return res.status(404).json({ message: 'Notebook não encontrado para deleção' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};