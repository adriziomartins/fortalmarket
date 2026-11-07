# Codex Cloud — Primeira execução controlada do FORTALMARKET

**Data da preparação:** 06/11/2026  
**Situação:** roteiro de configuração, **não** comprovação de ambiente Codex criado.  
**Dependência:** revisar PR #5, ter `AGENTS.md` na branch usada pelo Codex e aplicar controle de acesso à `main`.

## 1. Condições antes da primeira tarefa

- [ ] Revisar e aprovar o PR de documentação da operação: https://github.com/adriziomartins/fortalmarket/pull/5
- [ ] Proteger `main` por ruleset com PR obrigatório, pelo menos uma aprovação quando houver revisor independente, `static-checks` e `browser-tests`, bloqueio de force push e exclusão.
- [ ] Verificar se a regra foi realmente aplicada; uma regra escrita na documentação não protege o repositório.
- [ ] Manter os PRs de produto em andamento isolados: o PR #3 é onboarding, não parte da primeira tarefa do Codex.
- [ ] Não fornecer segredos do Cloudflare, credenciais pessoais, dados reais de comerciantes ou qualquer autorização de deploy ao agente.

## 2. Criar o ambiente do Codex Cloud

Segundo a documentação oficial, ambientes de nuvem são criados e publicados no aplicativo desktop ou na web, reunindo repositório, ferramentas e permissões. Depois podem ser reutilizados para tarefas, inclusive no celular, quando disponíveis.

1. Abra o Codex na web ou no aplicativo e faça login na conta correta.
2. Prepare um ambiente Cloud, conectando o GitHub autorizado ao repositório `adriziomartins/fortalmarket`.
3. Escolha como base a branch principal **após integrar AGENTS.md mediante aprovação**. Não usar uma branch de teste como branch de produção.
4. O repositório é HTML/CSS/JavaScript estático e seus smoke tests usam Node. Para o primeiro teste, não são necessários banco, Cloudflare, segredos nem variáveis de ambiente de produção.
5. Confirme que o ambiente pode ler `README.md`, `docs/MVP.md`, `AGENTS.md`, `.github/workflows/verify.yml` e a issue a executar.
6. Execute apenas tarefa em branch isolada. Se o acesso de escrita ao GitHub não estiver habilitado, exporte alterações como patch e revise manualmente, sem oferecer credenciais extras para contornar o bloqueio.

**Não habilitar:** acesso a produção, comandos automáticos de publicação, Cloudflare, DNS, WhatsApp, ferramentas de pagamento ou despesas externas.

Referências oficiais:
- https://help.openai.com/pt-br/articles/20001545-using-codex-cloud
- https://developers.openai.com/codex/environments/cloud-environments
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository

## 3. Tarefa piloto — documentação do deploy

Issue do primeiro ensaio: https://github.com/adriziomartins/fortalmarket/issues/6 (DOCS-001). Não utilizar PR #3 como ensaio inicial.

Copie o comando abaixo na tarefa do ambiente Codex:

> Trabalhe no repositório adriziomartins/fortalmarket. Leia AGENTS.md, README.md, docs/MVP.md, docs/DEPLOY.md, docs/OPERACAO_DESENVOLVIMENTO.md e a Issue #6. Faça somente a correção documental indicada na issue: deixe claro quais instruções de implantação Cloudflare são históricas e quais passos precisam ser verificados no painel atual. Não modifique app.js, CSS, HTML, Worker, DNS, CI, workflows, branches ou infraestrutura. Faça branch docs/ própria; use evidências verificáveis, não suponha a configuração remota. Execute os testes do repositório quando aplicáveis e registre qualquer impossibilidade. Abra PR em rascunho com escopo, testes, risco e rollback. Não faça merge nem deploy.

## 4. Validação da execução

- O Codex precisa ter produzido alterações efetivas em sua branch, não apenas uma resposta em texto.
- O PR deve indicar a issue, explicar o diff e informar o que foi ou não testado.
- GitHub Actions deve concluir os jobs aplicáveis `static-checks` e `browser-tests`.
- O proprietário do projeto examina o diff e decide sobre merge. A aprovação não é delegada ao mesmo agente que produziu a alteração.
- Só após o ensaio registrar o resultado na OPS-001: link da tarefa Codex (se disponível), PR, run de CI, tempo gasto, intervenção humana necessária, problemas, e custo de uso quando informado.

## 5. Limites da automação

Conectar GitHub e publicar um ambiente não equivale a configurar um orquestrador recorrente, tarefas automáticas ou agentes autônomos sem supervisão. A primeira prova será **uma tarefa iniciada conscientemente pelo responsável**. Qualquer recorrência futura precisa de gatilho, orçamento, escopo, credenciais mínimas, auditoria e mecanismo de parada.
