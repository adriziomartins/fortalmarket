# Publicação de testes — Cloudflare Workers (Static Assets)

**Situação:** os arquivos estão preparados para o Worker já criado na Cloudflare. Esta documentação não executa o deploy e não comprova que o site esteja online.

## Diagnóstico dos erros relatados (03/11/2026)

- O build inicial falhou porque a Cloudflare utilizou a branch `main`, que ainda não contém `scripts/build.sh`.
- O segundo build falhou com `root directory not found` porque a configuração tinha o valor literal `raiz/`; essa pasta não existe no repositório.
- O projeto criado no painel é **Workers**, não Pages; o deploy command `npx wrangler deploy` exige uma configuração Wrangler, que agora está no repositório.

## Configure o Worker existente `fortalmarket`

1. Abra https://dash.cloudflare.com/ → Workers & Pages → **fortalmarket**.
2. Em **Settings → Build → Branch control**, selecione como production branch: `feat/mvp-v0.1-prototipo`. Ela tem o código; `main` ainda contém apenas o README original.
3. Em **Settings → Build → Build configuration**, edite os campos:

| Campo | Valor |
| --- | --- |
| Git repository | `adriziomartins/fortalmarket` |
| Production branch | `feat/mvp-v0.1-prototipo` |
| Root directory | Deixe em branco, se o painel permitir, ou use `/` (raiz do repositório). **Não escreva `raiz/`.** |
| Build command | `bash scripts/build.sh` |
| Deploy command | `npx wrangler deploy` |
| Build variables | Nenhuma exigida nesta versão |

4. Confirme que as configurações foram salvas. Execute um novo deploy no commit mais recente da branch ou publique uma nova alteração que dispare o build. Um simples retry anterior pode reusar o commit/branch errados.
5. O arquivo `wrangler.jsonc` define `name: fortalmarket` e `assets.directory: ./dist`; o nome deve corresponder ao Worker existente.
6. Verifique logs: deve constar `Fortal Market: arquivos estaticos copiados para dist/` e, depois, a conclusão do comando Wrangler.

## Validar após o status Success

- Abra a **URL real fornecida pelo painel** (para Worker, normalmente `*.workers.dev`; não invente URL).
- No celular e computador, teste: busca, filtros, seleção territorial, adicionar/remover itens, troca de loja e copiar a lista de teste.
- Confirmar que o conteúdo ainda declara claramente que lojas e preços são fictícios.
- O cabeçalho `X-Robots-Tag: noindex, nofollow` protege o protótipo contra indexação em motores de busca enquanto ainda houver dados fictícios.
- O arquivo `_headers` é colocado dentro de `dist` pelo script, sendo compatível com Workers Static Assets.

## Publicação definitiva futura

1. Fazer revisão visual e testes de acessibilidade/funcionalidade.
2. Revisar e mesclar o PR #1 em `main` quando aprovado.
3. Trocar production branch para `main` no painel, após o merge.
4. Substituir dados de demonstração por dados autorizados, definir regras comerciais e privacidade.
5. Registrar `fortalmarket.com.br` e associar domínio no painel (a simples disponibilidade não significa registro).
6. Retirar a regra de não indexação apenas quando a plataforma estiver pronta para lançamento público.

Documentação oficial:
- https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/static-assets/headers/
