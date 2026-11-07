# Playbook replicável — Fábrica de Desenvolvimento com IA

**Origem:** piloto FORTALMARKET (06/11/2026).  
**Propósito:** reproduzir processo de execução e governança, **não** copiar stack técnica nem regras de negócio.

## Núcleo obrigatório em cada novo projeto

1. Repositório Git versionado e acessos mínimos necessários.
2. `README.md`: visão, estado atual, como executar, ambientes, limitações.
3. `AGENTS.md`: contexto, padrões, testes, o que o agente pode/não pode fazer, dados sensíveis e arquivos de referência.
4. `docs/OPERACAO_DESENVOLVIMENTO.md`: papéis, fluxo, responsáveis por aprovar, verificação, deploy e rollback.
5. Definição de produto: problema, perfis, hipótese, limites, resultados desejados, critérios do MVP.
6. Modelo de issue, modelo de PR, CI básico funcional e evidências de testes.
7. Registro de decisões relevantes com data, alternativas e motivação; o repositório deve apontar para esse registro.
8. Backlog único e rastreável; optar entre GitHub Issues ou sincronização deliberada com outro gerenciador (evitar dois locais concorrentes).

## Ficha de implantação por projeto

Copiar e preencher **antes de liberar o primeiro agente**:

| Campo | Informação |
| --- | --- |
| Código/nome do projeto | [PREENCHER] |
| Repositório e branch principal | [PREENCHER] |
| Problema e público | [PREENCHER] |
| Produto e estágio observado | [PREENCHER] |
| Stack real (não presumida) | [PREENCHER] |
| Ambientes de teste/produção | [PREENCHER] |
| Hospedagem e limite de custos | [PREENCHER] |
| Dados pessoais, pagamentos e riscos | [PREENCHER] |
| Comandos de CI e testes | [PREENCHER] |
| Pessoa que aprova escopo/merge/deploy | [PREENCHER] |
| Agente implementador e permissões | [PREENCHER] |
| O que exige consentimento/validação | [PREENCHER] |
| Primeira tarefa pequena para ensaio | [PREENCHER] |
| Critério de sucesso do piloto da esteira | [PREENCHER] |

## Etapas de implantação da operação

**E0 — Auditoria read-only:** inventariar arquivos, branches, issues, CI, deploy, segredos, bugs conhecidos e processos existentes. Não instalar ferramentas ou mudar ambiente neste passo.

**E1 — Contrato:** escrever README/AGENTS, DoR/DoD, nomenclatura, responsabilidades e lista de operações vedadas.

**E2 — Esteira mínima:** issue clara → branch isolada → testes → PR → revisão humana → merge autorizado → deploy controlado → smoke test e rollback.

**E3 — Ensaio:** concluir uma tarefa pequena com evidências. Medir falhas de especificação, custo/tempo e necessidade de intervenção.

**E4 — Otimização:** criar prompts repetíveis e automações adicionais apenas para pontos de ganho medido. Cuidado com ciclos automáticos sem limites de custo e com permissões excessivas.

**E5 — Replicação:** duplicar apenas documentos/modelos/controles; reavaliar produto, stack, riscos e infraestrutura de cada projeto.

## Particularidades dos projetos seguintes

### CREATIX
- Confirmar propósito atual, estado do código, repositório e arquitetura antes de preencher a ficha.
- Priorizar descoberta e backlog do produto já existente; não assumir mesmo fluxo comercial ou hospedagem do FORTALMARKET.
- Escolher testes e agentes adequados às funcionalidades reais.

### RPGENIUS
- Confirmar estágio atual e responsabilidades da Gignere Studios antes de estruturar as issues.
- Diferenciar engine, editor, simulador, sistemas de jogo, geração por IA e dados persistentes.
- Separar requisitos de qualidade determinística (regras, saves, performance) de avaliação criativa (narrativa, NPCs, experiência do jogador).

### Demais projetos
- Reaplicar os mesmos controles de versão, testes, incidentes, segurança, custos e aprovações.
- Alterar domínios, stack, ferramentas e métricas quando o contexto exigir; nenhuma dependência comum é obrigatória por padrão.

## Métrica de maturidade da operação

| Nível | Capacidade comprovada |
| --- | --- |
| 0 | Ideias e código sem rastreabilidade consistente |
| 1 | Repositório, tarefas e instruções de agente definidos |
| 2 | PRs pequenos com testes automatizados e revisão |
| 3 | Deploy/rollback rastreável, monitoramento e gestão de incidentes |
| 4 | Delegação recorrente e supervisionada, com métricas de qualidade e custo |
| 5 | Multiprojeto, com modelos reutilizáveis e melhoria contínua baseada em dados |

O FORTALMARKET não deve ser declarado nível 4 apenas por possuir documentação ou CI; agentes recorrentes exigem integração, permissões, limites e prova de execução.

## Prompt-padrão de auditoria para um novo projeto

> Faça somente uma auditoria do repositório [LINK]. Identifique estado real, stack, branches, CI, PRs, deploy, lacunas e riscos. Compare com este playbook e proponha o mínimo necessário para operar com Codex e revisão humana. Não modifique código, dados, configurações, serviços externos, produção ou custos nesta etapa. Entregue uma tabela de fatos, suposições e decisões pendentes.

## Prompt-padrão para executar tarefa aprovada

> Siga o AGENTS.md deste projeto. Execute a issue [LINK] em branch isolada, preservando convenções e trabalho em andamento. Acrescente testes proporcionais ao risco. Entregue PR em rascunho com critérios de aceite, evidências, riscos e rollback. Não mescle nem publique sem aprovação humana.
