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
- Logo permanece `null`, com autorização `pending`. Fachada e foto de produto podem ser selecionadas localmente para revisão interna; provas de autorização continuam fora da ferramenta e exigem revisão privada antes de uso público.
- Horário, contato e área podem ficar vazios em rascunho. Endereço comercial e identificação de responsáveis pelo atendimento/resolução ficam para conferência privada posterior, evitando coleta prematura de dados pessoais.
- Antes de ativar: conferir cada campo com o comerciante, registrar responsável e canal para problemas, data de confirmação de preço/estoque, cobertura, frete e retirada; obter autorização granular de nome, logo, endereço comercial, horário, WhatsApp e fotos, com possibilidade de correção/retirada.
- Desativação rápida depende de catálogo público futuro: exigir remoção de loja/produto a pedido do responsável ou quando desatualizado, antes de habilitar publicação. Não existe ativação neste formulário.
- O limite técnico é 50 produtos por ficha; a meta operacional é até 5 lojas e 50 produtos no total, sujeita à adesão. Serviluz é expansão sujeita à validação.

A ferramenta atende somente à preparação técnica. O aceite operacional da Issue #2 continua pendente de autorizações, catálogo revisado e política comercial aprovada. Use apenas dados fictícios nos testes; coleta real exige autorização própria.

O formato experimental `0.2` agora exige IDs, descrição (pode ser vazia) e estados de imagem. Fichas anteriores precisam de adequação privada ao contrato e nova validação; não há migração automática nem alteração de autorizações.


## Fotos locais para revisão interna — v0.2.1

A foto da fachada e uma foto por produto são opcionais. Aceita-se JPEG, PNG ou WebP, até 5 MB por imagem. A prévia usa uma URL temporária `blob:` da memória do navegador; não há upload, backend ou persistência. Remover/substituir foto, remover produto ou limpar ficha libera as URLs correspondentes. Fechar/recarregar descarta as seleções.

O JSON exporta `merchant.facade_image` e `products[].image` como `null` quando não há seleção, ou somente:

```json
{"file_name":"foto-ficticia.png","mime_type":"image/png","authorization_status":"pending"}
```

Não inclui binário, base64, URL temporária, caminho completo ou EXIF. Guarde o arquivo original separadamente em armazenamento privado: o JSON não permite reconstruir a imagem e nomes iguais não identificam necessariamente o mesmo arquivo. Evite nomes de arquivo com informações pessoais; o nome é incluído na ficha privada. A seleção não comprova autoria, consentimento ou autorização de publicação. Nenhuma imagem será publicada automaticamente.

O campo `merchant.facade_image` ausente continua válido para fichas anteriores. `products[].image: null` permanece compatível. O validador aceita somente os três metadados acima com estado `pending`; rejeita conteúdo embutido, URLs, caminhos e estados aprovados. A validação do JSON não verifica o conteúdo do arquivo original. A prévia rejeita formatos não aceitos, arquivos vazios, maiores que o limite ou que o navegador não consiga decodificar.

Riscos: muitas imagens grandes podem consumir memória em aparelhos modestos; o limite por imagem não limita o total de uma ficha. Originais podem conter dados pessoais/EXIF e exigem revisão privada e autorização própria antes de qualquer uso real. Testes desta alteração usam apenas PNG sintético em memória.


Consolidação v0.2.1: o operador informou a homologação do formulário e da exportação de metadados. Este escopo substitui a proposta anterior de incorporar imagens ao JSON no comentário de 13/11 do PR #3. Não há exportação ZIP nesta etapa. A homologação técnica não encerra o aceite operacional da Issue #2 nem autoriza coleta ou publicação real.

Ao guardar os originais, mantenha em local privado uma correspondência entre o ID do comerciante/produto no JSON e o arquivo selecionado. Confira essa correspondência antes de fechar a ficha; não há importação ou recuperação automática das fotos pelo formulário. Para substituir uma foto, selecione outro arquivo no mesmo campo; para retirar, use “Remover foto”.

Verificação da consolidação: sintaxe, exemplo fictício, smoke, testes de onboarding, build e testes Chromium conforme o workflow do repositório. Os cenários de fotos cobrem prévia, substituição, remoção, exportação de metadados pendentes, rejeição de arquivos vazios/inválidos/grandes/corrompidos e ausência de rede/persistência. Capturas de 320, 390 e 1280 px ficam em `test-artifacts/`, ignorado pelo Git. Resultados efetivamente executados e checks do SHA consolidado são registrados no PR #3. Sem teste em aparelho físico, leitor de tela, conexão lenta ou URL pública.
