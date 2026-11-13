# Fortal Market v0.2 — cadastro assistido de comerciantes

**Situação:** ferramenta interna experimental, sem backend, sem cadastro público, sem consentimento automatizado e sem publicação de ofertas.

## Por que esta etapa existe

O marketplace não deve divulgar contatos, preços, imagens ou endereços de comerciantes antes de registrar autorização e confirmar as condições. O primeiro piloto propõe até cinco estabelecimentos e cerca de 50 produtos na região de Castelo Encantado/Vicente Pinzón, com expansão para Serviluz sujeita à validação.

## Operação recomendada

1. Conversar com o comerciante e demonstrar o protótipo no celular.
2. Consultar o operador antes de apresentar condições: taxas, comissões, frete, retirada e pagamento dependem de aprovação explícita. Não prometer gratuidade. Cada solicitação futura dependerá de confirmação do estabelecimento.
3. Abrir **tools/onboarding/index.html** localmente no próprio navegador (a ferramenta não faz envio a servidores).
4. Preencher nome fantasia, bairro oficial, localidade, horários, canal comercial, modalidades de atendimento e produtos propostos.
5. Baixar JSON com status **draft** e autorização **pending**. Guardar somente no dispositivo/armazenamento privado do operador, não no GitHub público.
6. Conferir com comerciante dados, preços, fotos, disponibilidade e cobertura de entregas. Armazenar em repositório privado, fora da aplicação, o registro de autorização e revisão.
7. Só depois de comprovar autorização e definir processo de atualização será elaborado o catálogo público. O formulário atual não autoriza nem realiza essa ativação.

## Dados e limites

| Campo | Objetivo |
| --- | --- |
| trade_name | Identificação comercial a exibir após autorização |
| official_neighborhood | Bairro oficial para busca e organização |
| locality | Comunidade/localidade dentro ou próxima do bairro |
| primary_category | Categoria principal para filtro |
| public_whatsapp | Exclusivamente número comercial, opcional na ficha |
| fulfillment | Retirada e/ou entrega efetuada pelo comerciante |
| service_area_text | Área onde o estabelecimento confirma atendimento |
| price_cents | Valor em centavos informado pelo comerciante, ainda não confirmado |
| products[].availability | Inicialmente `unconfirmed`, nunca prometer estoque |
| publication_status | Inicialmente `draft` |
| authorization_status | Inicialmente `pending` |
| internal_review | Três verificações começam com valor `false` |

## Autorização: registro a obter fora do site

O responsável pelo comércio precisa confirmar de maneira documentada:
- Quais informações comerciais autoriza divulgar (nome, logo, fotos, endereço comercial, horários, telefone comercial).
- Quem é o responsável por preços, estoque, pagamento, entrega, devoluções e contato com compradores.
- Como solicitar correção/retirada de dados e ofertas.
- Quais condições comerciais foram aprovadas pelo operador, antes de qualquer oferta de participação.
- Data, identificação do autorizador e canal/documento que sustenta a autorização.

**Importante:** esta lista é uma pauta operacional de autorização, não substitui documento jurídico adequado nem base legal para tratar informações pessoais. Evitar registrar CPF, RG, conta bancária e endereços residenciais no cadastro inicial.

## Validação técnica

```bash
node scripts/validate-submission.cjs data/examples/merchant-submission.sample.json
node --test tests/onboarding.test.cjs
```

A validação verifica apenas o formato e o estado de rascunho. **Não prova que a loja exista, que os preços estejam corretos ou que alguém tenha autorizado a divulgação.**

## Próxima iteração

- Converter fichas autorizadas em catálogo público com moderação e carimbo de última atualização.
- Definir identificação territorial consistente e política para ofertas desatualizadas.
- Criar botões de contato exclusivamente para WhatsApps comerciais verificados.
- Testar ponta a ponta com lojas e moradores, medindo pedidos realmente confirmados.

Referência operacional: [Issue #2](https://github.com/adriziomartins/fortalmarket/issues/2).

## Contrato de rascunho e pendências da Issue #2

- IDs de comerciante e produto são gerados uma vez por ficha/linha e preservados em downloads repetidos. O produto referencia `merchant_id`. Limpar ou recarregar inicia outra ficha; não há importação nem persistência. Para revisão posterior, preservar os IDs no arquivo privado.
- `products[].description` aceita texto opcional. `price_verified_at` permanece `null` e disponibilidade `unconfirmed`: o preço digitado é apenas informado, não uma confirmação com data.
- Logo e foto ficam `null`, com autorização `pending`. Arquivos, URLs e provas de autorização não são coletados nesta etapa; exigem revisão privada e autorização documentada antes de uso público.
- Horário, contato e área podem ficar vazios em rascunho. Endereço comercial e identificação de responsáveis pelo atendimento/resolução ficam para conferência privada posterior, evitando coleta prematura de dados pessoais.
- Antes de ativar: conferir cada campo com o comerciante, registrar responsável e canal para problemas, data de confirmação de preço/estoque, cobertura, frete e retirada; obter autorização granular de nome, logo, endereço comercial, horário, WhatsApp e fotos, com possibilidade de correção/retirada.
- Desativação rápida depende de catálogo público futuro: exigir remoção de loja/produto a pedido do responsável ou quando desatualizado, antes de habilitar publicação. Não existe ativação neste formulário.
- O limite técnico é 50 produtos por ficha; a meta operacional é até 5 lojas e 50 produtos no total, sujeita à adesão. Serviluz é expansão sujeita à validação.

A ferramenta atende somente à preparação técnica. O aceite operacional da Issue #2 continua pendente de autorizações, catálogo revisado e política comercial aprovada. Use apenas dados fictícios nos testes; coleta real exige autorização própria.

O formato experimental `0.2` agora exige IDs, descrição (pode ser vazia) e estados de imagem. Fichas anteriores precisam de adequação privada ao contrato e nova validação; não há migração automática nem alteração de autorizações.
