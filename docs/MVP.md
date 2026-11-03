# Fortal Market — definição do MVP v0.1

**Data:** 03/11/2026  
**Fase:** exploração e prototipação; sem clientes nem estabelecimentos reais cadastrados.

## Problema

Moradores nem sempre conhecem o comércio de sua região, os produtos disponíveis, preços ou opções de entrega. Sair de casa pode interromper atividades importantes. O comerciante de bairro, por sua vez, dispõe de poucos recursos para criar uma vitrine digital.

## Hipótese

Se moradores puderem buscar produtos por bairro, visualizar ofertas claras e entrar em contato diretamente com estabelecimentos próximos, conseguirão localizar itens úteis com menos esforço, e comerciantes receberão novas solicitações sem pagar comissões iniciais à plataforma.

## Público e território de validação

- Moradores e pequenos comerciantes de Fortaleza.
- Piloto sugerido: Castelo Encantado, na região de Vicente Pinzón.
- Expansão sob demanda para Serviluz e outras localidades, sem exclusividade territorial.
- Diferenciar bairro oficial, comunidade/localidade e área de atendimento de entrega.

## Fluxo-alvo (depois da demonstração)

1. Escolher território ou explorar outros bairros.
2. Buscar um produto, categoria ou estabelecimento.
3. Ver loja, preço informado, disponibilidade e opções de entrega/retirada.
4. Selecionar produtos de uma única loja.
5. Abrir conversa com WhatsApp verificado da loja, com lista preparada.
6. O comerciante confirma estoque, valor final, prazo, frete e meio de pagamento fora da plataforma.

## Entregue no protótipo

- Busca, filtro por território, categorias, vitrine e carrinho.
- Dados fictícios explicitamente identificados.
- Cópia de lista de teste, sem pedido real.

## Fora do escopo da v0.1

- Processamento de pagamentos e repasses.
- Entregadores próprios e rastreamento logístico.
- Carrinho com múltiplos estabelecimentos.
- Contas, autenticação ou cadastro de consumidores.
- Painel de gestão de lojistas, estoque em tempo real e persistência.
- Envio automático de mensagens ou integração oficial de WhatsApp.
- Garantia de disponibilidade do produto.

## Regras fundamentais

- **Taxa da plataforma:** R$ 0 para consumidor e comerciante no piloto.
- **Frete:** informado e cobrado pelo comerciante, quando aplicável.
- **Preço:** deve conter data/hora de confirmação e pode mudar; não exibir oferta como garantida sem atualização.
- **Estoque:** confirmado pelo comerciante antes do pedido definitivo.
- **Território:** não limitar artificialmente a compra ao bairro de residência.
- **Segurança:** nunca expor credenciais, números privados ou informações pessoais sem base legal e autorização.
- **Confiabilidade:** não simular avaliações, lojas reais, descontos ou pedidos concluídos.

## Metas de teste (hipóteses, não previsões)

- 5 estabelecimentos participantes.
- 50 produtos reais com cadastro autorizado.
- 30 moradores convidados para teste.
- 10 pedidos efetivamente confirmados em um piloto de 14 dias.

Métricas complementares: buscas sem resultado, cliques de contato, taxa de confirmação do comerciante, indisponibilidade, cancelamentos, prazo de resposta e custos operacionais.

## Critérios para avançar

- Evidência de demanda e pedidos concluídos, não somente visitas ou cliques.
- Pelo menos um comerciante disposto a manter o catálogo atualizado.
- Processo claro para reclamações, valores, entrega e devoluções.
- Revisão de privacidade, transparência comercial e uso de WhatsApp.

## Decisões técnicas provisórias

- Repositório: \`adriziomartins/fortalmarket\`.
- Prototipação: HTML + CSS + JavaScript sem dependências e sem backend, para lançamento e validação rápidos.
- Migração para React/TypeScript, banco de dados e PWA instalável será considerada apenas quando o piloto demonstrar necessidade.
- Hospedagem: serviço de hosting estático; GitHub é repositório de código, não o serviço comercial de hospedagem escolhido.
- Domínio planejado: \`fortalmarket.com.br\`, ainda sem confirmação de compra.

## Próxima iteração

Cadastrar estabelecimentos reais com consentimento, gerar arquivos de catálogo com campos consistentes e habilitar contato por loja, sempre distinguindo pedido solicitado de pedido confirmado.