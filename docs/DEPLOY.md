# Publicação de testes — Cloudflare Workers (Static Assets)

> **Aviso histórico:** o diagnóstico inicial é de **03/11/2026** e suas instruções não devem ser reproduzidas automaticamente. Revisão documental em **07/11/2026**: `main` já contém o protótipo v0.1 e `scripts/build.sh`. A configuração atual da Cloudflare está **a confirmar no painel**.

Este guia não executa nem autoriza publicação e não comprova disponibilidade da URL. Aplicam-se os controles de [operação de desenvolvimento](OPERACAO_DESENVOLVIMENTO.md) e do [AGENTS.md](../AGENTS.md): merge, deploy, rollback e mudanças de infraestrutura exigem aprovação explícita.

## Histórico do diagnóstico inicial — 03/11/2026

- O build inicial relatado falhou porque a Cloudflare utilizou `main`, que **naquele momento** ainda não continha `scripts/build.sh`.
- O segundo build relatado falhou com `root directory not found` porque a configuração tinha o valor literal `raiz/`; essa pasta não existe no repositório.
- O serviço relatado era **Workers**, não Pages. Para aquele fluxo foram preparados o build estático, `wrangler.jsonc` e o comando de publicação `npx wrangler deploy`.
- A orientação da época era selecionar `feat/mvp-v0.1-prototipo`, pois ela continha o código. Isso é histórico, **não uma recomendação de branch de produção atual**.
- O [PR #1](https://github.com/adriziomartins/fortalmarket/pull/1) foi integrado à `main` em 03/11/2026 (merge `d01a066baaae6e5bf65656a6c6784e7b1f58ba4f`). A instrução antiga de aguardar esse merge está superada.

## Fatos confirmados no repositório — 07/11/2026

Referência desta revisão: `main` no SHA `823eab7f82a299f5446536efbcf0b1eae9162f06`. Esse SHA identifica o código consultado, não uma versão comprovadamente publicada.

| Evidência | Fato confirmado |
| --- | --- |
| [PR #1](https://github.com/adriziomartins/fortalmarket/pull/1), [README](../README.md) e [MVP](MVP.md) | `main` inclui o protótipo v0.1 demonstrativo, com dados fictícios. |
| [scripts/build.sh](../scripts/build.sh) | O build recria `dist/` e copia `index.html`, `styles.css`, `app.js` e `_headers`. |
| [wrangler.jsonc](../wrangler.jsonc) | A configuração versionada declara `name: fortalmarket` e `assets.directory: ./dist`. |
| [_headers](../_headers) | Declara cabeçalhos de segurança e `X-Robots-Tag: noindex, nofollow`; sua presença nas respostas públicas exige verificação real. |
| [CI](../.github/workflows/verify.yml) | Há jobs `static-checks` e `browser-tests`. Isso não comprova aprovação de uma execução específica. |

## Checklist de auditoria antes de uma publicação futura

Começar somente com inspeção, sem salvar alterações nem disparar builds. Não é necessário login ou API Cloudflare para concluir a correção documental da Issue #6; registrar a ausência de inspeção remota como lacuna.

| Item | Verificação no ambiente real |
| --- | --- |
| Serviço e repositório | Confirmar conta, Worker e vínculo com `adriziomartins/fortalmarket`; o nome local não comprova a configuração remota. |
| Branch de produção | **A confirmar no painel.** `main` contém o build, mas isso não prova que seja a branch configurada. Não selecionar automaticamente a branch histórica. |
| Diretório raiz | **A confirmar no painel**, em relação à raiz real do repositório. O valor histórico `raiz/` era inválido. |
| Comando de build | Comparar o valor remoto com `bash scripts/build.sh`, disponível no repositório; não alterar nem executar durante a auditoria. |
| Comando de publicação | **A confirmar no painel.** `npx wrangler deploy` pertence ao fluxo histórico e não é autorização de execução. |
| Variáveis e secrets | O protótipo não exige variáveis de aplicação; conferir necessidades remotas sem copiar valores privados para logs, documentação ou PRs. |
| Builds automáticos e previews | Confirmar gatilhos de push/PR antes de publicar branch ou abrir PR. Há [registro de tentativa de preview no PR #3](https://github.com/adriziomartins/fortalmarket/pull/3#issuecomment-6681908990); isso não comprova a configuração atual. |
| URL, domínio e versão ativa | **A confirmar no painel** e por verificação da URL real. Não presumir domínio configurado, disponibilidade ou correspondência entre SHA local e versão ativa. |
| Reversão disponível | Identificar a versão anterior, seu SHA quando disponível, o procedimento aplicável e quem autoriza o rollback. |

Registrar data, responsável e evidências da inspeção. Divergências devem virar propostas para revisão humana, sem mudança automática de branch, comandos, domínio ou infraestrutura.

## Publicação futura — condicionada à aprovação

1. Revisar o PR e os testes pertinentes: verificações estáticas, build, navegador, acessibilidade e revisão visual/mobile conforme o impacto. Registrar comandos, resultados, links de CI e lacunas; testes sobre build local não comprovam funcionamento da URL pública.
2. Obter aprovação humana para merge e, separadamente, para publicação e eventuais mudanças de configuração. Confirmar gatilhos automáticos antes de push, abertura de PR ou merge.
3. Antes de publicar, registrar ambiente, branch aprovada, **SHA exato aprovado**, configuração conferida, responsável, autorização e versão anterior para reversão. Não presumir que o commit mais recente seja o aprovado.
4. Executar apenas o procedimento expressamente autorizado. Conferir nos logs o SHA utilizado, a geração dos assets e o resultado da publicação; registrar a versão Cloudflare e a URL efetivamente fornecidas pelo serviço.
5. Executar smoke test na **URL publicada**, registrando data, SHA/versão, cenários e resultados: abertura da página, busca, filtros, território, inclusão/remoção de itens, troca de loja e cópia da lista demonstrativa. Conferir celular/desktop, avisos de dados fictícios e cabeçalhos HTTP de segurança e não indexação.
6. Em caso de falha, interromper o avanço, registrar o incidente e solicitar autorização específica para rollback, caso ainda não concedida para esse cenário. Restaurar somente a versão anterior identificada e aprovada, pelo procedimento conferido; repetir o smoke test e registrar versão restaurada e resultado. Não improvisar alterações em DNS ou branch de produção.

Publicar o protótipo não autoriza publicar comércios reais, registrar domínio ou retirar a não indexação. Essas decisões exigem aprovação própria, dados autorizados, regras comerciais e privacidade, conforme o MVP e a governança.

## Reversão da correção documental — Issue #6

Reverter o commit documental mediante revisão e aprovação, se integrado. Essa reversão afeta somente o guia e não executa rollback do Worker nem altera o funcionamento do protótipo.

## Referências oficiais para conferência futura

- https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/static-assets/headers/
