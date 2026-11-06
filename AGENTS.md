# AGENTS.md — FORTALMARKET

Este arquivo orienta agentes de desenvolvimento (inclusive Codex) neste repositório. O projeto é uma plataforma hiperlocal para aproximar pequenos comerciantes e moradores de Fortaleza. O território-piloto é Castelo Encantado/Vicente Pinzón, com Serviluz como expansão sujeita a validação.

## Fonte de verdade e contexto inicial

Leia, nesta ordem:
1. `README.md` — situação do projeto e execução local.
2. `docs/MVP.md` — escopo, hipóteses, métricas e restrições de produto.
3. `docs/OPERACAO_DESENVOLVIMENTO.md` — fluxo e governança da operação.
4. `docs/DEPLOY.md` — histórico operacional; confira informações de branches e ambiente antes de aplicar comandos, pois partes podem estar desatualizadas.
5. A issue e o PR correspondentes à tarefa, incluindo critérios de aceite e comentários recentes.

Não trate propostas de funcionalidades, relatos de conversas ou dados demonstrativos como evidências de validação. Não invente lojas, preços reais, consentimentos, métricas ou resultados de testes.

## Estado técnico a preservar

- A base v0.1 é HTML/CSS/JavaScript com build estático em `scripts/build.sh`.
- O CI existente está em `.github/workflows/verify.yml`; há verificações estáticas e testes com Chromium/Playwright.
- O deploy publicado é gerenciado por Cloudflare Workers (Static Assets). Não suponha que a configuração remota seja idêntica ao repositório.
- A evolução v0.2 de pré-cadastro assistido de comerciantes está em PR separado; evite sobreposição de mudanças sem revisar o estado atual.

## Contrato de execução por tarefa

1. Identifique a issue, a hipótese, o usuário beneficiado e critérios de aceite verificáveis.
2. Inspecione os arquivos afetados, dependências e alterações em andamento.
3. Registre riscos, suposições e um plano curto antes de modificar código.
4. Trabalhe em branch própria de escopo pequeno; nunca faça alterações diretamente em `main`.
5. Implemente a menor mudança capaz de cumprir o aceite; respeite HTML sem dependências enquanto isso bastar.
6. Execute os testes pertinentes; registre comandos e resultados reais. Se não puder executar, declare expressamente a lacuna.
7. Abra PR com o modelo do repositório, evidências, impactos, riscos, plano de reversão e referência à issue.
8. Aguarde revisão/aprovação humana para merge, publicação, custos, coleta de dados e mudanças comerciais.

## Limites de autonomia

**Permitido em branch de trabalho:** ler código e documentação, criar ou corrigir testes, refatorações localizadas, documentação, protótipos fictícios e propostas de arquitetura, desde que vinculados à tarefa.

**Requer aprovação explícita do responsável:** merge, deploy/rollback, mudança de branch de produção, DNS/domínio, criação de recursos Cloudflare, integrações externas, aquisição de serviços, processamento de pagamentos, envio real de mensagens, publicação de loja/oferta real, migrações destrutivas e alterações que coletem ou exponham dados pessoais.

**Proibido:** divulgar segredos ou dados privados em commits/logs/PRs; contornar testes e proteções; fazer afirmações de aprovação sem evidência; converter dados fictícios em reais sem autorização; criar cobranças automaticamente.

Agent Lee ou qualquer agente de infraestrutura deve permanecer inicialmente em modo somente leitura: pode analisar configurações, inventariar riscos e sugerir mudanças, mas não executar mutações até autorização específica.

## Comandos de verificação existentes

- `node --check app.js`
- `node --test tests/smoke.test.cjs`
- `bash scripts/build.sh`
- `node --test tests/browser.test.cjs` — exige servidor local, Playwright e Chromium instalados conforme `.github/workflows/verify.yml`.

Os comandos não substituem revisão visual/mobile, acessibilidade, conferência de fluxos comerciais ou teste de fumaça da URL efetivamente publicada.

## Segurança e qualidade do produto

- Repositório público: não comitar fichas de lojistas, telefones pessoais, endereços residenciais, dados de consumidores, tokens ou credenciais.
- Qualquer informação de comércio real exige autorização documentada e conferência de canal, preço, horário, disponibilidade e políticas de entrega.
- Carrinho do piloto: uma loja por pedido. A finalização futura por WhatsApp depende de confirmação do próprio estabelecimento; não equivale a transação concluída.
- Não adicionar pagamentos integrados, frota, rastreamento, autenticação, banco de dados ou reescrita de framework por iniciativa própria.
- Interfaces: mobile-first, linguagem simples, desempenho em aparelhos modestos, navegação por teclado, sem depender apenas de cor e com atenção a conexões lentas.
- Alterações de escopo devem seguir descoberta e aprovação, não entusiasmo do agente.

## Como reportar

Ao finalizar uma tarefa, entregue: resumo do que foi alterado; issue e PR; testes executados e não executados; riscos e pendências; decisões que precisam de aprovação; recomendação de próximo passo. Nunca declare implantação em produção sem evidência do ambiente.

Este arquivo e o playbook em `docs/PLAYBOOK_REPLICAVEL.md` formam o núcleo reutilizável para outros projetos. As regras de negócio deste projeto não devem ser copiadas automaticamente para CREATIX, RPGENIUS ou outros sistemas.
