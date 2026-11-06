# FORTALMARKET — proteção da branch main

**Situação em 06/11/2026:** na última auditoria a API GitHub respondeu `protected: false` para `main` e `[]` para rulesets. Este documento e o JSON proposto **não ativam nenhuma proteção**; o administrador precisa configurar a regra no GitHub.

## Arquivo reutilizável de importação

`.github/rulesets/fortalmarket-main.json` contém uma **proposta** de ruleset de branch baseada no formato público documentado em https://github.com/github/ruleset-recipes e nas verificações reais do repositório. Objetivo: um administrador poderá importar o JSON e revisá-lo visualmente antes de ativá-lo.

Configuração proposta:
- Alvo: `~DEFAULT_BRANCH`, atualmente `main`.
- Exigir PR antes de merge.
- Exigir os checks `static-checks` e `browser-tests` (já observados no GitHub Actions).
- Bloquear exclusão de branch e force push.
- Exigir resolução de conversas.
- `required_approving_review_count = 0` como fase **provisória**, para não bloquear um repositório com apenas um mantenedor/revisor. O próprio autor não pode satisfazer uma aprovação obrigatória de seu PR; assim que houver revisor independente, elevar para pelo menos 1 e considerar dismissal de revisões obsoletas.
- `strict_required_status_checks_policy = false` inicialmente para não exigir atualização de branch em todo PR; reavaliar quando os ciclos de CI estiverem estáveis.

## Como aplicar no painel

1. Abra https://github.com/adriziomartins/fortalmarket/settings/rules
2. Verifique que você está no repositório correto.
3. Em Rulesets, utilize **Import ruleset** quando disponível ou crie **New branch ruleset** manualmente com os critérios acima.
4. Se importar JSON, selecione `.github/rulesets/fortalmarket-main.json` baixado da branch documental após revisão. Examine todos os campos antes de salvar.
5. Confirme a identificação dos checks exigidos na UI; alguns ambientes apresentam nome de workflow ou origem do check de forma diferente.
6. Ative a regra. Evite bypass global/irrestrito, especialmente para bots ou agentes. **Não** conceda merge automático nem permissão de administrador a agente.
7. Recarregue Settings → Rulesets e confirme que o ruleset está **Active** e inclui `main`.
8. Confira em um PR de teste que a ausência/falha de CI realmente bloqueia merge. Não execute merge nesse teste.

Se o menu não oferecer importação, crie manualmente. O JSON é uma especificação versionada, não uma promessa de importação bem-sucedida.

## Evidência da validação

Registrar na Issue #4:
- URL do ruleset ativo, responsável e data;
- lista de checks exigidos e origem;
- confirmação do bloqueio para um PR sem checks;
- prova de que PRs com checks aprovados continuam revisáveis;
- registro explícito de quem autoriza merge e deploy.

## Replicação em outros projetos

Copiar **o princípio**, não o conteúdo literal dos checks. Antes de aplicar em CREATIX, RPGENIUS ou outros:
1. Identificar branch principal e jobs reais.
2. Considerar quantidade de revisores independentes.
3. Auditar o CI para impedir bypass por alteração de workflow.
4. Revisar política de secrets, custos, deploy e permissões do agente.
5. Registrar aprovação e manter a regra sob controle humano.

Referências:
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
