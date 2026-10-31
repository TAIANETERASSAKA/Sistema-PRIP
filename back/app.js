require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const dbConfig = require('./config/config.js')[process.env.NODE_ENV || 'development'];
const { iniciarVerificacaoAtrasos } = require('./services/atrasoService');

const app = express();
const PORT = process.env.PORT || 7070;
const EM_PRODUCAO = process.env.NODE_ENV === 'production';

if (EM_PRODUCAO && !process.env.SESSION_SECRET) {
    throw new Error('Defina SESSION_SECRET no .env antes de rodar em produção.');
}

// Necessário para o cookie seguro funcionar atrás de um proxy HTTPS (nginx)
if (process.env.COOKIE_SECURE === 'true') {
    app.set('trust proxy', 1);
}

// Cabeçalhos de segurança HTTP
app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limite maior para comportar a imagem da assinatura do termo
app.use(express.json({ limit: '5mb' }));

// Configuração da sessão (salva no Postgres para não perder logins ao reiniciar o servidor)
app.use(session({
    store: new PgSession({
        conObject: {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database
        },
        tableName: 'sessoes',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'troque-este-segredo-no-env',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.COOKIE_SECURE === 'true', // true quando o sistema estiver em HTTPS
        httpOnly: true,
        sameSite: 'lax', // permite o cookie no retorno da Senha Única USP
        maxAge: 24 * 60 * 60 * 1000 // 1 dia
    }
}));

// Importação das rotas
const emprestimoRoutes = require('./routes/emprestimos');
const notebookRoutes = require('./routes/notebooks');
const usuarioRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
const mensagemRoutes = require('./routes/mensagens');
const termoRoutes = require('./routes/termos');
const manutencaoRoutes = require('./routes/manutencoes');

// Definição do prefixo da sua API
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/notebooks', notebookRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mensagens', mensagemRoutes);
app.use('/api/termos', termoRoutes);
app.use('/api/manutencoes', manutencaoRoutes);

// Tratamento de erros não previstos (não expõe detalhes internos ao usuário)
app.use((err, req, res, next) => {
    console.error(err);

    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: "arquivo_grande", message: "Os dados enviados são grandes demais." });
    }
    res.status(err.status || 500).json({ error: "erro_interno", message: "Erro interno no servidor." });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    iniciarVerificacaoAtrasos();
});
