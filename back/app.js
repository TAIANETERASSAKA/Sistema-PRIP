const express = require('express');
const cors = require('cors'); 
const session = require('express-session');
const app = express();
const PORT = 7070;

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configuração da sessão
app.use(session({
    secret: 'seu-segredo-aqui', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 //
    }
}));

// Importação das rotas 
const emprestimoRoutes = require('./routes/emprestimos');
const notebookRoutes = require('./routes/notebooks');
const usuarioRoutes = require('./routes/usuarios');
const loginRoutes = require('./routes/login');
const mensagemRoutes = require('./routes/mensagens');
const termoRoutes = require('./routes/termos');
const manutencaoRoutes = require('./routes/manutencoes');



// Definição do prefixo da sua API
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/notebooks', notebookRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/mensagens', mensagemRoutes);
app.use('/api/termos', termoRoutes);
app.use('/api/manutencoes', manutencaoRoutes);


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});



