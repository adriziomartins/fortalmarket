# Revisão local do pré-cadastro — Issue #2 / PR #3

Data: 09/11/2026. Escopo: preparação técnica local; não representa aceite operacional ou aprovação de publicação.

## Objetivo e referência

- [Issue #2](https://github.com/adriziomartins/fortalmarket/issues/2): preparar entrada assistida dos comerciantes do piloto.
- [PR #3](https://github.com/adriziomartins/fortalmarket/pull/3), revisão de 09/11/2026: corrigir campos, compromissos comerciais, UX e integridade.
- Usuário beneficiado: operador que prepara fichas para revisão com comerciantes.
- Hipótese: fichas locais consistentes reduzem lacunas na conferência, sem implicar validação de mercado.

## Escopo e evidências

- Branch local `fix/issue-2-concluir-pre-cadastro`, criada do head `46270fe` do PR. `git fetch origin` atualizou referências. Merge local `9c465f7` incorporou `origin/main` (`1359597`) sem conflitos, preservando ambos os históricos. Nenhum rebase ou force push.
- IDs por ficha/produto, vínculo `merchant_id`, descrição opcional, logo/foto ausentes com autorização pendente. IDs preservados em downloads repetidos; nova sessão ou limpeza inicia outra ficha.
- Exportação continua `draft/pending`, preços não verificados, disponibilidade não confirmada e revisões `false`. Nome do arquivo usa UUID, sem nome comercial. JSON não é inserido como HTML.
- CSP bloqueia conexões e envio de formulário; sem persistência ou upload. Ferramenta permanece fora de `dist/`.
- Mensagens de erro recebem foco, remoção devolve foco ao botão de adicionar, campos acomodam 320 px e instruções têm contraste reforçado. Capturas mobile/desktop inspecionadas visualmente, sem cortes de conteúdo ou sobreposição.
- Documentação não promete taxa zero, ausência de comissão ou condições comerciais aprovadas.
- Adiamentos e critérios posteriores estão em [ONBOARDING.md](ONBOARDING.md): autorização privada, imagens/endereço, responsáveis, confirmação datada, condições comerciais e desativação no catálogo futuro.

## Testes executados

| Comando/cenário | Resultado |
| --- | --- |
| `node --check app.js` | passou |
| `node --check tools/onboarding/app.js` | passou |
| `node --check scripts/validate-submission.cjs` | passou |
| `node scripts/validate-submission.cjs data/examples/merchant-submission.sample.json` | ficha fictícia válida |
| `node --test tests/smoke.test.cjs tests/onboarding.test.cjs` | passou; execução direta confirmou 5 smoke + 8 onboarding |
| `bash scripts/build.sh` | passou |
| `PLAYWRIGHT_BROWSERS_PATH=/tmp/fortalmarket-browsers node --test tests/browser.test.cjs tests/onboarding-browser.test.cjs` | 15/15 passaram (8 vitrine + 7 onboarding) |
| `PLAYWRIGHT_BROWSERS_PATH=/tmp/fortalmarket-browsers node tests/onboarding-browser.test.cjs` | 7/7 passaram, com detalhes individuais |
| `git diff --check` | passou |
| `git diff --cached` e inventário de arquivos rastreados | índice vazio; sem caminhos privados ou padrões de credenciais encontrados |

Playwright 1.56.1 instalado somente para testes; Chromium em `/tmp`. As primeiras tentativas falharam por dependência ausente, DNS e restrições do sandbox. A execução bem-sucedida usou permissão para servidor local e Chromium fora do sandbox. Não houve alteração de CI.

Capturas locais ignoradas pelo Git: `test-artifacts/onboarding-form-320.png`, `test-artifacts/onboarding-form-desktop.png`, `test-artifacts/onboarding-320.png`.

Cobertura: telefone formatado e DDD 55, preço com vírgula/entradas inválidas, ausência de modalidade/produtos, limite 50, erros e foco por teclado, JSON com texto inerte, IDs estáveis e ausência de rede/persistência durante exportação. Somente dados fictícios nos testes.

**Não executado:** CI remoto desta revisão (sem push), teste em aparelho físico, leitor de tela, conexão limitada e URL de produção. A verificação visual foi feita em Chromium emulado. A busca por padrões de segredos complementa a leitura do diff; não é garantia absoluta sobre todo o histórico.

## Riscos e reversão

- Formato experimental exige campos novos: fichas anteriores precisam de adequação privada e nova validação. Sem migração automática.
- IDs persistem apenas na ficha em memória/JSON baixado. Recarregar perde os dados; interface avisa sobre essa limitação.
- Não foram adicionados dados reais de comerciantes, arquivos privados ou credenciais. Índice vazio no encerramento; downloads e dependências permanecem ignorados. Revisar novamente o índice ao preparar qualquer commit.
- Não houve push, edição remota do PR, merge em `main`, deploy ou alteração de Cloudflare. O PR #3 remoto ainda não contém esta revisão local. Mantido trabalho local para respeitar a autorização restrita e evitar gatilhos de preview registrados no PR.
- Reversão: descartar seletivamente o diff desta tarefa após preservar eventual trabalho posterior; se futuramente comitado, reverter o commit de correção por PR. A sincronização local tem histórico próprio; não requer reescrever commits nem rollback de produção.

## Decisões humanas e próximo passo

Revisar o diff local e as capturas. Antes de atualizar o PR #3, autorizar publicação da branch e conferir gatilhos de preview. Aprovação separada para merge/deploy, condições comerciais, coleta real e ativação de catálogo. A Issue #2 permanece aberta até cumprir o aceite operacional com evidências reais.
