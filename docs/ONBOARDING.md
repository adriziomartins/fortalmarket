# Fortal Market v0.2 — cadastro assistido de comerciantes

**Situação:** ferramenta interna experimental, sem backend, sem cadastro público, sem consentimento automatizado e sem publicação de ofertas.

## Por que esta etapa existe

O marketplace não deve divulgar contatos, preços, imagens ou endereços de comerciantes antes de registrar autorização e confirmar as condições. O primeiro piloto propõe até cinco estabelecimentos e cerca de 50 produtos na região de Castelo Encantado/Vicente Pinzón, com possibilidade de bairros vizinhos.

## Operação recomendada

1. Conversar com o comerciante e demonstrar o protótipo no celular.
2. Explicar condições: taxa da plataforma R$ 0 no piloto; o estabelecimento determina frete, retirada e forma de pagamento; cada pedido é confirmado diretamente com ele.
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
| products[].availability | Inicialmente \`unconfirmed\`, nunca prometer estoque |
| publication_status | Inicialmente \`draft\` |
| authorization_status | Inicialmente \`pending\` |
| internal_review | Três verificações começam com valor \`false\` |

## Autorização: registro a obter fora do site

O responsável pelo comércio precisa confirmar de maneira documentada:
- Quais informações comerciais autoriza divulgar (nome, logo, fotos, endereço comercial, horários, telefone comercial).
- Quem é o responsável por preços, estoque, pagamento, entrega, devoluções e contato com compradores.
- Como solicitar correção/retirada de dados e ofertas.
- Que o piloto não cria exclusividade e não implica comissão da plataforma.
- Data, identificação do autorizador e canal/documento que sustenta a autorização.

**Importante:** esta lista é uma pauta operacional de autorização, não substitui documento jurídico adequado nem base legal para tratar informações pessoais. Evitar registrar CPF, RG, conta bancária e endereços residenciais no cadastro inicial.

## Validação técnica

\`\`\`bash
node scripts/validate-submission.cjs data/examples/merchant-submission.sample.json
node --test tests/onboarding.test.cjs
\`\`\`

A validação verifica apenas o formato e o estado de rascunho. **Não prova que a loja exista, que os preços estejam corretos ou que alguém tenha autorizado a divulgação.**

## Próxima iteração

- Converter fichas autorizadas em catálogo público com moderação e carimbo de última atualização.
- Definir identificação territorial consistente e política para ofertas desatualizadas.
- Criar botões de contato exclusivamente para WhatsApps comerciais verificados.
- Testar ponta a ponta com lojas e moradores, medindo pedidos realmente confirmados.

Referência operacional: [Issue #2](https://github.com/adriziomartins/fortalmarket/issues/2).
