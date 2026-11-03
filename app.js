/* Fortal Market v0.1 — catálogo inteiramente FICTÍCIO para demonstração. */
(function () {
  "use strict";
  const estabelecimentos = [
    { id: "mercado", nome: "Mercadinho Exemplo", bairro: "Vicente Pinzón", localidade: "Castelo Encantado", territorio: "castelo" },
    { id: "cozinha", nome: "Cozinha Demonstrativa", bairro: "Serviluz", localidade: "Serviluz", territorio: "serviluz" }
  ];
  const produtos = [
    { id: "arroz", loja: "mercado", nome: "Arroz 1 kg", descricao: "Pacote de arroz branco", categoria: "mercado", preco: 6.50, emoji: "🍚" },
    { id: "feijao", loja: "mercado", nome: "Feijão 1 kg", descricao: "Pacote de feijão", categoria: "mercado", preco: 7.80, emoji: "🫘" },
    { id: "detergente", loja: "mercado", nome: "Detergente 500 ml", descricao: "Produto de limpeza doméstica", categoria: "limpeza", preco: 2.75, emoji: "🧽" },
    { id: "shampoo", loja: "mercado", nome: "Shampoo 350 ml", descricao: "Produto para cuidados pessoais", categoria: "beleza", preco: 14.90, emoji: "🧴" },
    { id: "bobo", loja: "cozinha", nome: "Bobó de camarão", descricao: "Porção individual ilustrativa", categoria: "refeicoes", preco: 27.00, emoji: "🍤" },
    { id: "frango", loja: "cozinha", nome: "Pratinho de frango", descricao: "Refeição demonstrativa", categoria: "refeicoes", preco: 16.00, emoji: "🍛" }
  ];
  const categorias = [
    ["todos", "Tudo"], ["mercado", "🛒 Mercado"], ["refeicoes", "🍲 Refeições"],
    ["limpeza", "🧽 Limpeza"], ["beleza", "🧴 Beleza"]
  ];
  const state = { categoria: "todos", carrinho: new Map(), loja: null };
  let focoAnteriorCarrinho = null;
  const $ = (id) => document.getElementById(id);
  const dinheiro = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  const normalizar = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const lojaPorId = (id) => estabelecimentos.find((l) => l.id === id);
  const produtoPorId = (id) => produtos.find((p) => p.id === id);
  function elemento(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }
  function botao(texto, classe, acao, rotulo) {
    const b = elemento("button", classe, texto);
    b.type = "button";
    if (rotulo) b.setAttribute("aria-label", rotulo);
    b.addEventListener("click", acao);
    return b;
  }
  function atualizarCategorias() {
    $("categorias").querySelectorAll("button[data-categoria]").forEach((b) => {
      const selecionada = b.dataset.categoria === state.categoria;
      b.classList.toggle("active", selecionada);
      b.setAttribute("aria-pressed", String(selecionada));
    });
  }
  function renderizarCategorias() {
    const alvo = $("categorias");
    alvo.replaceChildren();
    categorias.forEach(([id, nome]) => {
      const b = botao(nome, "chip", () => {
        state.categoria = id;
        atualizarCategorias();
        renderizarProdutos();
      });
      b.dataset.categoria = id;
      alvo.append(b);
    });
    atualizarCategorias();
  }
  function renderizarProdutos() {
    const termo = normalizar($("busca").value.trim());
    const territorio = $("territorio").value;
    const encontrados = produtos.filter((p) => {
      const loja = lojaPorId(p.loja);
      const texto = normalizar([p.nome, p.descricao, loja.nome, loja.bairro, loja.localidade].join(" "));
      return (state.categoria === "todos" || p.categoria === state.categoria)
        && (territorio === "todos" || loja.territorio === territorio)
        && texto.includes(termo);
    });
    const grade = $("produtos");
    grade.replaceChildren();
    encontrados.forEach((p) => {
      const loja = lojaPorId(p.loja);
      const card = elemento("article", "product-card");
      const media = elemento("div", "product-media", p.emoji);
      media.setAttribute("aria-hidden", "true");
      const info = elemento("div", "product-info");
      info.append(
        elemento("p", "product-location", loja.nome + " · " + loja.localidade),
        elemento("h3", "", p.nome),
        elemento("p", "product-description", p.descricao),
        elemento("p", "product-price", dinheiro(p.preco)),
        botao("Adicionar ao pedido +", "product-button", () => adicionar(p.id), "Adicionar " + p.nome + " ao pedido")
      );
      card.append(media, info);
      grade.append(card);
    });
    $("resultado-contagem").textContent = encontrados.length + (encontrados.length === 1 ? " produto demonstrativo" : " produtos demonstrativos");
    $("sem-resultados").hidden = encontrados.length > 0;
  }
  function adicionar(id) {
    const p = produtoPorId(id);
    if (state.loja && state.loja !== p.loja && quantidadeTotal() > 0) {
      const trocar = window.confirm("O carrinho aceita produtos de uma loja por vez. Substituir seu pedido atual por um pedido de outra loja?");
      if (!trocar) return;
      state.carrinho.clear();
    }
    state.loja = p.loja;
    state.carrinho.set(id, (state.carrinho.get(id) || 0) + 1);
    renderizarCarrinho();
    abrirCarrinho();
  }
  function quantidadeTotal() {
    return Array.from(state.carrinho.values()).reduce((s, n) => s + n, 0);
  }
  function alterarQuantidade(id, delta) {
    const n = (state.carrinho.get(id) || 0) + delta;
    if (n <= 0) state.carrinho.delete(id);
    else state.carrinho.set(id, n);
    if (quantidadeTotal() === 0) state.loja = null;
    renderizarCarrinho();
  }
  function renderizarCarrinho() {
    $("contador").textContent = String(quantidadeTotal());
    const alvo = $("itens-carrinho");
    alvo.replaceChildren();
    let subtotal = 0;
    $("loja-carrinho").textContent = state.loja ? "Estabelecimento: " + lojaPorId(state.loja).nome : "";
    if (!quantidadeTotal()) alvo.append(elemento("p", "empty-cart", "Seu pedido está vazio. Escolha algum produto da vitrine."));
    state.carrinho.forEach((qtd, id) => {
      const p = produtoPorId(id);
      subtotal += p.preco * qtd;
      const linha = elemento("div", "cart-row");
      const detalhes = elemento("div", "cart-row-details");
      detalhes.append(elemento("strong", "", p.nome), elemento("span", "", dinheiro(p.preco) + " cada"));
      const controles = elemento("div", "quantity-controls");
      controles.append(
        botao("−", "", () => alterarQuantidade(id, -1), "Diminuir quantidade de " + p.nome),
        elemento("strong", "", String(qtd)),
        botao("+", "", () => alterarQuantidade(id, 1), "Aumentar quantidade de " + p.nome)
      );
      linha.append(detalhes, controles);
      alvo.append(linha);
    });
    $("subtotal").textContent = dinheiro(subtotal);
    $("copiar-pedido").disabled = !quantidadeTotal();
  }
  function abrirCarrinho() {
    focoAnteriorCarrinho = document.activeElement;
    $("carrinho").classList.add("open");
    $("carrinho").removeAttribute("inert");
    $("carrinho").setAttribute("aria-hidden", "false");
    $("sobreposicao").hidden = false;
    document.body.style.overflow = "hidden";
    $("fechar-carrinho").focus();
  }
  function fecharCarrinho() {
    $("carrinho").classList.remove("open");
    $("carrinho").setAttribute("inert", "");
    $("carrinho").setAttribute("aria-hidden", "true");
    $("sobreposicao").hidden = true;
    document.body.style.overflow = "";
    const destino = focoAnteriorCarrinho && focoAnteriorCarrinho.isConnected ? focoAnteriorCarrinho : $("abrir-carrinho");
    focoAnteriorCarrinho = null;
    destino.focus();
  }
  async function copiarPedido() {
    if (!quantidadeTotal()) return;
    const loja = lojaPorId(state.loja);
    const linhas = ["Olá! Esta é uma LISTA DE TESTE do protótipo Fortal Market (não é um pedido real).", "Estabelecimento fictício: " + loja.nome, ""];
    let subtotal = 0;
    state.carrinho.forEach((qtd, id) => {
      const p = produtoPorId(id);
      subtotal += p.preco * qtd;
      linhas.push(String(qtd) + "x " + p.nome + " — " + dinheiro(p.preco * qtd));
    });
    linhas.push("", "Subtotal fictício: " + dinheiro(subtotal), "Disponibilidade, frete e pagamento não são processados por este protótipo.");
    const mensagem = linhas.join("\n");
    try {
      await navigator.clipboard.writeText(mensagem);
      $("mensagem-carrinho").textContent = "Lista demonstrativa copiada para a área de transferência.";
    } catch (_) {
      window.prompt("Copie sua lista demonstrativa:", mensagem);
      $("mensagem-carrinho").textContent = "Use a janela para copiar a lista.";
    }
  }
  $("busca").addEventListener("input", renderizarProdutos);
  $("territorio").addEventListener("change", renderizarProdutos);
  $("abrir-carrinho").addEventListener("click", abrirCarrinho);
  $("fechar-carrinho").addEventListener("click", fecharCarrinho);
  $("sobreposicao").addEventListener("click", fecharCarrinho);
  $("copiar-pedido").addEventListener("click", copiarPedido);
  document.addEventListener("keydown", (e) => {
    if (!$("carrinho").classList.contains("open")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      fecharCarrinho();
      return;
    }
    if (e.key !== "Tab") return;
    const focaveis = Array.from($("carrinho").querySelectorAll("button:not([disabled])"));
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  });
  renderizarCategorias();
  renderizarProdutos();
  renderizarCarrinho();
})();