import { useSearchParams } from 'react-router-dom';
import api from '../../../services/api';

// Mensagens para os códigos de erro enviados pelo backend
const MENSAGENS_ERRO = {
    sem_permissao: 'Seu vínculo com a USP não permite acesso a este sistema. Ele é destinado a alunos de graduação e pós-graduação.',
    login_invalido: 'Não foi possível validar o login. Tente novamente.',
    falha_usp: 'Não foi possível se comunicar com a Senha Única USP. Tente novamente em instantes.',
    falha_sessao: 'Erro ao iniciar a sessão. Tente novamente.',
    nao_configurado: 'O login pela Senha Única ainda não foi configurado no servidor.'
};

function Login () {
    const [searchParams] = useSearchParams();
    const erro = searchParams.get('erro');

    // Navega para o backend, que redireciona para a página de login da USP
    const entrarComSenhaUnica = () => {
        window.location.href = `${api.defaults.baseURL}auth/senhaunica`;
    };

    return (
        <div id="login-view" className="view active w-full max-w-md">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-sky-800">Sistema de Empréstimos</h1>
                    <p className="text-slate-500 mt-2">Acesse com seu Número USP e Senha Única</p>
                </div>

                {erro && (
                    <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                        {MENSAGENS_ERRO[erro] || 'Erro ao fazer login.'}
                    </div>
                )}

                <button
                    onClick={entrarComSenhaUnica}
                    className="w-full bg-sky-700 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-800 transition-colors"
                >
                    Entrar com Senha Única USP
                </button>

                <p className="text-center text-xs text-slate-500 mt-6">
                    Você será redirecionado para a página oficial da USP. Para recuperar sua senha,
                    acesse o <a href="https://uspdigital.usp.br/" target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">USP Digital</a>.
                </p>
            </div>
        </div>
    );
}

export default Login;
