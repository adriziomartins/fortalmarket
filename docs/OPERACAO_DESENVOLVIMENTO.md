# FORTALMARKET — Operação de Desenvolvimento Automatizado

**Versão:** 1.0 (proposta operacional)  
**Data-base:** 06/11/2026  
**Proprietário das decisões de produto, custo e produção:** responsável pelo FORTALMARKET  
**Status:** governança documentada; automação de testes já existente; execução autônoma de agentes e publicação automática **não** habilitadas por este documento.

## 1. Objetivo e princípios

Implantar desenvolvimento assistido por IA com tarefas pequenas, rastreabilidade, testes reproduzíveis, revisão humana e aprendizado do piloto. Preservar a implementação atual e criar uma operação que possa ser replicada com personalizações em CREATIX e RPGENIUS.

Princípios:
- Produto antes de tecnologia: validar problemas e valor para comerciante e morador antes de expandir funcionalidades.
- Menor solução viável: não construir infraestrutura sem necessidade demonstrada.
- Evidência antes de declaração: testes, autorizações, deploy e resultados devem ser verificáveis.
- Automação reversível: o agente propõe e desenvolve em branch; produção depende de aprovação.
- Um trabalho por issue e um escopo por PR; documentação e decisão acompanham a mudança.
- Gastos e riscos legais/comerciais exigem decisão explícita.

## 2. Inventário inicial verificado

- Repositório: https://github.com/adriziomartins/fortalmarket — branch principal `main`.
- v0.1 demonstrativa, já integrada: HTML/CSS/JavaScript, catálogo fictício, filtros e carrinho de uma única loja.
- CI: `.github/workflows/verify.yml` roda validações estáticas, build e testes de navegador em PRs.
- Publicação: Cloudflare Workers/Static Assets, URL relatada `https://fortalmarket.adriziomartins.workers.dev`. A disponibilidade e configuração remota devem ser confirmadas no painel e por smoke test.
- Issue de evolução: https://github.com/adriziomartins/fortalmarket/issues/2
- PR #3 em rascunho: https://github.com/adriziomartins/fortalmarket/pull/3 — ferramenta offline de pré-cadastro, **não** catálogo público real.
- A documentação `docs/DEPLOY.md` possui orientações históricas da branch v0.1 já integrada; auditar antes de qualquer modificação no painel.

## 3. Matriz de responsabilidades

| Papel | Responsabilidade | Limite |
| --- | --- | --- |
| Responsável humano | Visão, prioridades, aceites, autorização de custos, dados e releases | Único aprovador das ações sensíveis |
| ChatGPT / coordenação de produto | Sintetizar pesquisa, preparar requisitos, detalhar histórias, analisar riscos e revisar evidências | Não supor que uma conversa inicia execução em segundo plano |
| Codex / agente de implementação | Desenvolver em branch, preparar testes, documentação e PR | Não fazer deploy, merge ou coletar dados reais sem autorização |
| GitHub Issues e PRs | Fonte rastreável de tarefas, código, decisões, diffs e revisões | Issues não equivalem a funcionalidades concluídas |
| GitHub Actions | Verificação automática de cada PR dentro do workflow configurado | Teste local não prova funcionamento da publicação |
| Agent Lee / agente de infraestrutura | Inicialmente auditoria somente leitura da Cloudflare, custo e configuração | Não criar D1/R2/KV, mudar DNS ou alterar Worker |
| Comerciante / morador participante | Evidência de problema, usabilidade e operação no território | Conversa não substitui autorização ou confirmação comercial |

Linear ou outras ferramentas podem servir como visão de portfólio, mas não criar espelhos duplicados sem definir proprietário, integração e sincronização.

## 4. Pipeline padrão: da hipótese à produção

**G0 — Descoberta:** cadastrar problema observado, perfil, fonte, data, hipótese e incertezas; entrevistas baseadas em comportamento passado, não em elogios hipotéticos.

**G1 — Priorização:** selecionar uma oportunidade por valor esperado, risco, esforço, dependências e proximidade do MVP. Registrar por que entra e por que outras opções ficam de fora.

**G2 — Especificação:** criar issue com problema, história do usuário, critério de aceite objetivo, itens fora do escopo, dados envolvidos, protótipo necessário e política de rollback. Sem `Definition of Ready`, não encaminhar ao Codex.

**G3 — Desenvolvimento:** agente cria branch `feat/`, `fix/` ou `docs/`; altera apenas o necessário; documenta decisões; mantém segredos fora do repositório.

**G4 — Verificação:** rodar validações de sintaxe/estrutura/build/browser, revisão de acessibilidade, mobile, segurança e adequação aos cenários críticos. Falha de teste bloqueia progressão.

**G5 — Pull request:** PR referencia issue, apresenta diff, testes reais, artefatos, limites, riscos e passos para rollback. Para ações de maior risco, abrir como rascunho.

**G6 — Aceite humano:** revisão de código/produto, atualização da branch e aprovação do responsável. Merge só após verificações exigidas e liberação.

**G7 — Publicação controlada:** verificar configuração Cloudflare, publicar somente versão aprovada, registrar commit/versão e executar smoke test na URL publicada. Se houver falha, interromper avanço e usar rollback planejado.

**G8 — Aprendizado:** medir uso real, incidentes, retorno de comerciantes/moradores, atualizar hipótese, backlog e registro de decisão. Recomeçar o ciclo.

Fluxo resumido: `observação → hipótese → issue → plano → branch → código → testes → PR → revisão → aprovação → deploy → smoke → evidência → aprendizado`.

## 5. Contratos mínimos para iniciar e concluir tarefas

### Definition of Ready (DoR)
- [ ] Problema e usuário afetado descritos.
- [ ] Hipótese, resultado desejado e métrica definidos.
- [ ] Critérios de aceite testáveis e fora de escopo.
- [ ] Dependências, riscos, classificação dos dados e autorização verificados.
- [ ] Branch, responsável por revisão e estratégia de rollback identificados.

### Definition of Done (DoD)
- [ ] Critérios de aceite atendidos com evidência.
- [ ] Código/documentação revisados; nenhum dado pessoal ou segredo no diff.
- [ ] Testes pertinentes executados com resultados registrados.
- [ ] Testes não executados declarados e justificados.
- [ ] PR aprovado e integrado sem burlar controles.
- [ ] Se houve publicação: commit, ambiente, smoke test e rollback registrados.
- [ ] Issue, documentação de produto e próximo aprendizado atualizados.

## 6. Três níveis de autonomia

**Nível 1 — execução técnica em branch:** investigação, documentação, testes, refatoração limitada e implementação de tarefa aprovada. Agente pode propor PR.

**Nível 2 — intervenção supervisionada:** reestruturação de arquitetura, novos serviços, integração WhatsApp, mudanças de privacidade, alteração de CI, alteração de custos ou da política de dados. Exige autorização antes da intervenção.

**Nível 3 — operação sensível:** merge em `main`, deploy, rollback, dados comerciais reais, pagamentos, mensageria real, novos gastos e publicações públicas. Requer aprovação específica e evidência de resultado. Nunca pressupor permissão permanente.

## 7. Protocolo para delegar uma tarefa ao Codex

Uma solicitação completa deve informar: link da issue; resultado desejado; arquivos/áreas envolvidas ou a investigar; critérios de aceite; limites de escopo; testes obrigatórios; riscos de privacidade; instrução para trabalhar em branch e abrir PR em rascunho; exigência de relatório final. O agente deve consultar `AGENTS.md` e o código vigente, em vez de trabalhar apenas com texto copiado de conversas antigas.

Modelo de comando:

> Leia AGENTS.md, docs/MVP.md e a issue indicada. Examine o estado real da branch e dos PRs abertos. Faça um plano curto, implemente apenas o escopo aprovado em branch própria, execute os testes relevantes, documente resultados e abra um PR em rascunho. Não faça merge, deploy, mudanças em Cloudflare ou publicação de informações reais sem aprovação expressa. Relate riscos, pendências e como reverter.

Este é um **modelo de delegação**, não uma tarefa disparada ou um agendamento de execução automática.

## 8. Controles críticos de FORTALMARKET

- Vitrine fictícia continua explicitamente demonstrativa até adesão real autorizada.
- Somente dados comerciais autorizados e confirmados podem ser publicados.
- Pedido via WhatsApp no MVP futuro é **solicitação**, não pagamento ou confirmação automática; preço, frete e estoque devem ser confirmados pela loja.
- Sem login, pagamentos integrados, cadastro público, banco de dados, múltiplas lojas no carrinho ou frota própria sem decisão posterior.
- Privacidade por padrão, armazenamento mínimo, separação entre dados internos de pré-cadastro e catálogo público.
- As metas de 5 lojas, 50 produtos, 30 moradores e 10 pedidos em 14 dias são **hipóteses de teste**, não resultados já obtidos.

## 9. Métricas e relatório

**Fluxo de engenharia:** lead time issue→PR, taxa de CI verde, retrabalho por revisão, defeitos pós-merge, deploys aprovados, incidentes e tempo de recuperação.

**Marketplace:** comerciantes autorizados/ativos, produtos com preço verificado, buscas sem resultado, contatos iniciados, solicitações confirmadas pela loja, cancelamentos, tempo de resposta e custo por operação.

**Relatório de ciclo:** data; issue/PR; hipótese; mudanças; testes (e links); riscos; aprovação pendente; status de produção; medição/feedback; próxima decisão. Publicar fatos com evidência, e marcar hipóteses como hipóteses.

## 10. Primeira sequência operacional

1. Revisar e concluir, **se aprovado**, o PR #3 sem publicar lojistas reais.
2. Auditar o estado de Cloudflare, branch de produção e instruções históricas em `docs/DEPLOY.md`, inicialmente em modo somente leitura.
3. Aplicar os modelos de issue/PR e instruções para agentes deste pacote.
4. Selecionar **uma** issue pequena e de baixo risco como primeiro teste completo da esteira Codex→PR→CI→revisão.
5. Medir retrabalho, clareza da tarefa e tempo de aprovação; ajustar o processo antes de replicá-lo.

Para reprodução em outros produtos, usar `docs/PLAYBOOK_REPLICAVEL.md`. Não copiar automaticamente decisões comerciais, stack e dados do FORTALMARKET.
