# Fortal Market

**Seu bairro em um só lugar.**

Plataforma hiperlocal para descoberta de produtos, estabelecimentos e serviços, começando por uma operação piloto em Fortaleza (CE).

## Estado do projeto

**v0.1 — protótipo demonstrativo.** Os produtos, preços e estabelecimentos são fictícios. Não existem integração de pagamento, envio de pedidos, entregas, cadastro de usuários ou lojistas reais nesta versão.

### Funcionalidades demonstradas

- Interface responsiva, com foco no uso por celular.
- Busca textual por produto e descrição.
- Seleção de território: Castelo Encantado / Vicente Pinzón e Serviluz.
- Filtros por categorias.
- Vitrine de produtos e carrinho por estabelecimento.
- Cálculo de subtotal e cópia de uma lista de teste.

### Executar localmente

Não é necessário instalar dependências. Na pasta do projeto, execute:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000` no navegador.

### Publicação

Este é um site estático (HTML, CSS e JavaScript). Pode ser publicado em um serviço de hospedagem estática, como Cloudflare Pages. Nenhum deploy ou domínio personalizado foi configurado pelo código.

### Próximos passos

1. Validar o território piloto e conversar com cinco comerciantes locais.
2. Substituir os dados de demonstração por informações autorizadas e atualizadas.
3. Implementar canal de pedido real pelo WhatsApp, somente após verificar número e consentimento do estabelecimento.
4. Definir processo de confirmação de preço, estoque e entrega.
5. Preparar documentação de privacidade e termos de uso antes de coletar dados pessoais.

Veja [escopo e critérios do MVP](docs/MVP.md).

### Repositório

[github.com/adriziomartins/fortalmarket](https://github.com/adriziomartins/fortalmarket)

Domínio planejado: `fortalmarket.com.br` (a disponibilidade informada não significa registro efetuado).