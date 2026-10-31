const { Usuario } = require('../models');
const senhaUnica = require('../services/senhaUnicaService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:7070';
const CALLBACK_URL = `${BACKEND_URL}/api/auth/senhaunica/callback`;

// Tipos de vínculo USP que podem solicitar empréstimo (ex: ALUNOGR, ALUNOPOS)
const VINCULOS_PERMITIDOS = (process.env.SENHAUNICA_VINCULOS || 'ALUNOGR,ALUNOPOS')
    .split(',').map(v => v.trim()).filter(Boolean);

// Código da unidade USP (opcional). Se vazio, aceita alunos de qualquer unidade
const CODIGO_UNIDADE = process.env.SENHAUNICA_CODIGO_UNIDADE || '';

// Números USP que sempre entram como administradores (primeiro acesso da CIP)
const ADMINS_INICIAIS = (process.env.SENHAUNICA_ADMINS || '')
    .split(',').map(n => n.trim()).filter(Boolean);

// Login simulado para desenvolvimento, enquanto a STI não libera as credenciais
const MODO_FAKE = process.env.SENHAUNICA_FAKE === 'true' && process.env.NODE_ENV !== 'production';

// Volta para a tela de login do front com um código de erro
const redirecionarErro = (res, codigo) => res.redirect(`${FRONTEND_URL}/login?erro=${codigo}`);

// Verifica se a pessoa tem um vínculo ativo permitido
const temVinculoPermitido = (vinculos = []) => vinculos.some(v =>
    VINCULOS_PERMITIDOS.includes(v.tipoVinculo) &&
    (!CODIGO_UNIDADE || String(v.codigoUnidade) === CODIGO_UNIDADE)
);

// Cria ou atualiza o usuário a partir dos dados da USP e abre a sessão
const concluirLogin = async (req, res, dadosUsp) => {
    const numero_usp = String(dadosUsp.loginUsuario);
    const isAdminInicial = ADMINS_INICIAIS.includes(numero_usp);
    const podeSolicitar = temVinculoPermitido(dadosUsp.vinculo);

    let usuario = await Usuario.findOne({ where: { numero_usp } });

    // Admins (membros da CIP) entram sempre; os demais precisam de vínculo de aluno
    if (!isAdminInicial && !usuario?.isAdmin && !podeSolicitar) {
        return redirecionarErro(res, 'sem_permissao');
    }

    const email = dadosUsp.emailPrincipalUsuario || dadosUsp.emailUspUsuario || usuario?.email;
    const dadosAtualizados = {
        nome: dadosUsp.nomeUsuario,
        email,
        isAdmin: isAdminInicial || Boolean(usuario?.isAdmin)
    };

    if (usuario) {
        try {
            await usuario.update(dadosAtualizados);
        } catch (error) {
            // Se o e-mail da USP já estiver em outro cadastro, mantém o e-mail atual
            if (error.name !== 'SequelizeUniqueConstraintError') throw error;
            await usuario.update({ nome: dadosAtualizados.nome, isAdmin: dadosAtualizados.isAdmin });
        }
    } else {
        usuario = await Usuario.create({ numero_usp, ...dadosAtualizados });
    }

    const dadosUsuario = {
        id_usuario: usuario.id_usuario,
        numero_usp: usuario.numero_usp,
        nome: usuario.nome,
        isAdmin: usuario.isAdmin,
        email: usuario.email
    };

    // Gera uma nova sessão para evitar reaproveitamento do cookie anterior
    req.session.regenerate((err) => {
        if (err) return redirecionarErro(res, 'falha_sessao');

        req.session.usuario = dadosUsuario;
        req.session.save(() => res.redirect(`${FRONTEND_URL}/auth/retorno`));
    });
};

// GET /api/auth/senhaunica - envia o usuário para a página de login da USP
exports.iniciarLogin = async (req, res) => {
    if (MODO_FAKE) {
        return res.redirect('/api/auth/fake');
    }

    if (!senhaUnica.estaConfigurado()) {
        return redirecionarErro(res, 'nao_configurado');
    }

    try {
        const { token, tokenSecret, urlLogin } = await senhaUnica.iniciarLogin(CALLBACK_URL);

        req.session.senhaUnica = { token, tokenSecret };
        req.session.save(() => res.redirect(urlLogin));
    } catch (error) {
        console.error('Erro ao iniciar login na Senha Única:', error.message);
        redirecionarErro(res, 'falha_usp');
    }
};

// GET /api/auth/senhaunica/callback - a USP devolve o usuário para cá
exports.callback = async (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;
    const temporario = req.session.senhaUnica;

    if (!temporario || !oauth_verifier || temporario.token !== oauth_token) {
        return redirecionarErro(res, 'login_invalido');
    }

    try {
        const dadosUsp = await senhaUnica.finalizarLogin(temporario.token, temporario.tokenSecret, oauth_verifier);
        delete req.session.senhaUnica;
        await concluirLogin(req, res, dadosUsp);
    } catch (error) {
        console.error('Erro no retorno da Senha Única:', error.message);
        redirecionarErro(res, 'falha_usp');
    }
};

// GET /api/auth/fake - formulário de login simulado (somente desenvolvimento)
exports.formularioFake = (req, res) => {
    if (!MODO_FAKE) return res.status(404).end();

    res.send(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Senha Única (simulada)</title></head>
<body style="font-family: sans-serif; max-width: 420px; margin: 60px auto;">
    <h2>Senha Única USP - modo simulado</h2>
    <p style="color: #b45309;">Apenas para desenvolvimento. Nenhuma senha é verificada.</p>
    <form method="post" action="/api/auth/fake" style="display: grid; gap: 12px;">
        <label>Número USP <input name="numero_usp" required></label>
        <label>Nome <input name="nome" required></label>
        <label>E-mail <input name="email" type="email" required></label>
        <label>Vínculo
            <select name="vinculo">
                <option value="ALUNOGR">ALUNOGR (graduação)</option>
                <option value="ALUNOPOS">ALUNOPOS (pós-graduação)</option>
                <option value="SERVIDOR">SERVIDOR</option>
            </select>
        </label>
        <button type="submit">Entrar</button>
    </form>
</body></html>`);
};

// POST /api/auth/fake - recebe o formulário simulado no mesmo formato da USP
exports.loginFake = async (req, res) => {
    if (!MODO_FAKE) return res.status(404).end();

    try {
        await concluirLogin(req, res, {
            loginUsuario: req.body.numero_usp,
            nomeUsuario: req.body.nome,
            emailPrincipalUsuario: req.body.email,
            vinculo: [{ tipoVinculo: req.body.vinculo, codigoUnidade: CODIGO_UNIDADE }]
        });
    } catch (error) {
        console.error('Erro no login simulado:', error.message);
        redirecionarErro(res, 'falha_usp');
    }
};

// GET /api/auth/me - devolve o usuário da sessão atual
exports.usuarioLogado = (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            error: "nao_autenticado",
            message: "Usuário não está logado."
        });
    }
    res.json({ success: true, usuario: req.session.usuario });
};

// POST /api/auth/logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao fazer logout" });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: "Logout realizado com sucesso" });
    });
};
