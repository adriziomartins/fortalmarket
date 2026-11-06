(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const produtos = $("produtos");
  const resultado = $("resultado");
  const moedaEmCentavos = (texto) => {
    const s = String(texto).trim();
    if (!/^\d{1,6}(?:,\d{1,2})?$/.test(s)) return null;
    const [reais, centavos = ""] = s.split(",");
    return Number(reais) * 100 + Number(centavos.padEnd(2, "0"));
  };
  const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0,65);
  const el = (tag, properties = {}) => Object.assign(document.createElement(tag), properties);
  function campo(label, name, tipo, placeholder = "") {
    const wrap = el("div", { className: "field" });
    const id = "p-" + name + "-" + String(Math.random()).slice(2);
    const lab = el("label", { htmlFor: id, textContent: label });
    const input = el(tipo === "select" ? "select" : "input", { id, name });
    if (tipo === "select") {
      [["un", "Unidade"], ["kg", "Quilo"], ["g", "Grama"], ["l", "Litro"], ["ml", "Mililitro"], ["porcao", "Porção"], ["pacote", "Pacote"]].forEach(([value, text]) => input.add(el("option", { value, textContent: text })));
    } else {
      input.type = "text"; input.placeholder = placeholder; input.maxLength = name === "nome" ? 110 : 20;
    }
    input.setAttribute("aria-label", label);
    wrap.append(lab, input);
    return wrap;
  }
  function adicionarProduto() {
    if (produtos.children.length >= 50) {
      exibir("Máximo de 50 produtos por ficha.", true);
      return;
    }
    const linha = el("div", { className: "product-row" });
    const nome = campo("Produto *", "nome", "text", "Ex.: Arroz 1 kg");
    const unidade = campo("Unidade", "unidade", "select");
    const valor = campo("Preço em R$ *", "preco", "text", "12,90");
    valor.querySelector("input").inputMode = "decimal";
    linha.append(nome, unidade, valor);
    const botao = el("button", { type: "button", textContent: "Remover" });
    botao.addEventListener("click", () => { linha.remove(); exibir(""); });
    linha.append(botao);
    produtos.append(linha);
  }
  function exibir(msg, erro = false) {
    resultado.textContent = msg;
    resultado.className = "status " + (erro ? "error" : "ok");
  }
  function coletar() {
    const valor = (id) => $(id).value.trim();
    const name = valor("nome"), bairro = valor("bairro"), localidade = valor("localidade"), categoria = valor("categoria");
    const whatsapp = valor("whatsapp").replace(/\D/g, "");
    const methods = [ $("retirada").checked && "pickup", $("entrega").checked && "merchant_delivery" ].filter(Boolean);
    if (!name || !bairro || !localidade || !categoria) throw new Error("Preencha nome fantasia, bairro, localidade e categoria.");
    if (!methods.length) throw new Error("Escolha ao menos uma modalidade: retirada ou entrega.");
    if (whatsapp && !/^(?:55)?[1-9][0-9]{10}$/.test(whatsapp)) throw new Error("WhatsApp inválido. Informe DDD + número celular, sem símbolos.");
    const linhas = Array.from(produtos.querySelectorAll(".product-row"));
    if (!linhas.length) throw new Error("Cadastre ao menos um produto para revisão.");
    const itens = linhas.map((linha, i) => {
      const nomeProduto = linha.querySelector('[name="nome"]').value.trim();
      const unidade = linha.querySelector('[name="unidade"]').value;
      const preco = moedaEmCentavos(linha.querySelector('[name="preco"]').value);
      if (!nomeProduto || preco === null || preco <= 0) throw new Error("Produto " + (i + 1) + ": informe nome e preço válido maior que zero, usando vírgula nos centavos.");
      return { name: nomeProduto, unit: unidade, price_cents: preco, status: "draft", availability: "unconfirmed", price_verified_at: null };
    });
    return {
      schema_version: "0.2",
      merchant: {
        trade_name: name, official_neighborhood: bairro, locality: localidade,
        primary_category: categoria,
        description: valor("descricao"), opening_hours_text: valor("horario"),
        public_whatsapp: whatsapp ? (whatsapp.startsWith("55") ? whatsapp : "55" + whatsapp) : "",
        service_area_text: valor("atendimento"), fulfillment: methods,
        publication_status: "draft", authorization_status: "pending"
      },
      products: itens,
      internal_review: { price_confirmed: false, contact_verified: false, evidence_stored_privately: false }
    };
  }
  function baixar(data) {
    const json = JSON.stringify(data, null, 2) + "\n";
    const url = URL.createObjectURL(new Blob([json], { type: "application/json;charset=utf-8" }));
    const link = el("a", { href: url, download: "rascunho-" + (slug(data.merchant.trade_name) || "comerciante") + ".json" });
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $("adicionar-produto").addEventListener("click", adicionarProduto);
  $("ficha").addEventListener("submit", (event) => {
    event.preventDefault();
    try { baixar(coletar()); exibir("Ficha de rascunho preparada para download. Não foi enviada nem publicada."); }
    catch (error) { exibir(error.message, true); }
  });
  $("limpar").addEventListener("click", () => {
    if (!window.confirm("Descartar todos os dados digitados nesta ficha?")) return;
    $("ficha").reset(); produtos.replaceChildren(); adicionarProduto(); exibir("Ficha limpa.");
  });
  adicionarProduto();
})();