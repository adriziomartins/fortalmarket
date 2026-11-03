# Publicação de testes — Cloudflare Pages

**Situação:** roteiro de configuração; nenhum deploy foi executado pelo repositório até que a integração Cloudflare–GitHub seja autorizada pelo responsável pela conta.

## Etapa 1 — Conectar o GitHub

1. Abrir https://dash.cloudflare.com/ e acessar **Workers & Pages**.
2. Escolher **Create application → Pages → Import an existing Git repository** (a disposição dos botões pode variar).
3. Autorizar o aplicativo Cloudflare a acessar o repositório `adriziomartins/fortalmarket`.
4. Selecionar este repositório.

## Etapa 2 — Configurar

| Campo | Valor de teste |
| --- | --- |
| Nome do projeto | `fortalmarket-demo` (ou outro nome livre) |
| Production branch | `feat/mvp-v0.1-prototipo` |
| Framework preset | None |
| Root directory | `/` (raiz) |
| Build command | `bash scripts/build.sh` |
| Build output directory | `dist` |
| Variáveis de ambiente | Nenhuma nesta versão |

A branch de teste é usada temporariamente como *production branch* do projeto Cloudflare porque a branch `main` ainda só contém o README original. Isso **não** publica um comércio funcional nem realiza pagamentos.

## Etapa 3 — Conferir o resultado

1. Aguardar o painel indicar **Success**.
2. Abrir o endereço `*.pages.dev` **real** mostrado no painel (não presumir qual será o endereço).
3. Testar no celular e computador: busca, troca de território, filtro, carrinho, aumento/diminuição da quantidade, troca de estabelecimento e cópia de lista.
4. Conferir cabeçalhos de segurança e indexação. A versão de teste envia `X-Robots-Tag: noindex, nofollow` para evitar indexação de produtos fictícios.

## Etapa 4 — Passar para `main` quando aprovado

1. Revisar e aprovar PR #1.
2. Fazer merge para `main`.
3. Trocar em **Settings → Builds → Branch control** a production branch da Cloudflare para `main`.
4. Somente ao preparar lançamento público, remover a diretiva de não indexação em `_headers` e cadastrar comerciantes reais com autorização.
5. Vincular o domínio depois de registrado, na seção de domínio personalizado da Cloudflare.

**Não incluir segredos ou dados pessoais no repositório público.**

Documentação oficial: https://developers.cloudflare.com/pages/get-started/git-integration/
