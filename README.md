# Sistema-PRIP
#execute 

docker compose up --build

#em seguida execute

docker exec -it cti-back npx sequelize-cli db:migrate

## Login pela Senha Única USP

O acesso é feito pela Senha Única USP (OAuth 1.0a da STI). O sistema não guarda senhas.

1. Peça à informática da unidade o cadastro da aplicação na Senha Única. Informe a URL de retorno:
   `http://SEU_DOMINIO:7070/api/auth/senhaunica/callback`
2. Preencha no `back/.env` (veja `back/.env.example`):
   - `SENHAUNICA_KEY`, `SENHAUNICA_SECRET` e `SENHAUNICA_CALLBACK_ID`, fornecidos pela STI
   - `SENHAUNICA_DEV=true` para o ambiente de testes da USP, `false` em produção
   - `SENHAUNICA_ADMINS` com o Número USP dos primeiros administradores da CIP
   - `SESSION_SECRET` com um texto aleatório e longo
3. Rode a migration nova: `docker-compose exec back npx sequelize-cli db:migrate`

Regras de acesso:
- Alunos com vínculo em `SENHAUNICA_VINCULOS` (padrão `ALUNOGR,ALUNOPOS`) entram como aluno.
  Para restringir a uma unidade, defina `SENHAUNICA_CODIGO_UNIDADE`.
- Administradores são os usuários marcados como admin na tela de Usuários ou listados em `SENHAUNICA_ADMINS`.
- Qualquer outra pessoa recebe a mensagem de acesso negado.

Para desenvolver sem as credenciais da STI, use `SENHAUNICA_FAKE=true`: o botão de login abre um
formulário simulado. Esse modo nunca deve ser ativado em produção.

## Configuração e implantação

- Copie `.env.example` para `.env` e `back/.env.example` para `back/.env` e preencha os valores.
  Os arquivos `.env` não são versionados.
- Depois de atualizar o código, rode as migrations: `docker-compose exec back npx sequelize-cli db:migrate`.
- Os termos assinados ficam no volume Docker `uploads` e não se perdem ao recriar os containers.
- As sessões ficam salvas no banco (tabela `sessoes`, criada automaticamente).
- Em produção com HTTPS, defina `COOKIE_SECURE=true` e `NODE_ENV=production` no `back/.env`.
- Para publicar o front em outro endereço, defina `VITE_API_URL` no `.env` da raiz antes do build.
- Empréstimos com prazo vencido são marcados como atrasados automaticamente a cada hora,
  e o aluno recebe um e-mail.
