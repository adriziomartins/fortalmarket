const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const js = fs.readFileSync("app.js", "utf8");
const headers = fs.readFileSync("_headers", "utf8");

test("a página tem conteúdo e metadados em português", () => {
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /<title>Fortal Market/);
  assert.match(html, /VERSÃO DEMONSTRATIVA/);
  assert.match(html, /src="\.\/app\.js"/);
  assert.match(html, /href="\.\/styles\.css"/);
});

test("componentes mínimos exigidos pela aplicação existem no HTML", () => {
  const ids = [
    "busca", "territorio", "categorias", "produtos",
    "resultado-contagem", "sem-resultados", "abrir-carrinho",
    "carrinho", "fechar-carrinho", "contador", "loja-carrinho",
    "itens-carrinho", "subtotal", "copiar-pedido",
    "mensagem-carrinho", "sobreposicao"
  ];
  for (const id of ids) {
    assert.ok(html.includes('id="' + id + '"'), "Elemento ausente: " + id);
  }
});

test("catálogo e fluxo continuam demonstrativos", () => {
  assert.match(js, /catálogo inteiramente FICTÍCIO/);
  assert.match(js, /LISTA DE TESTE/);
  assert.match(js, /window\.confirm/);
  assert.ok(!/https?:\/\/api\.whatsapp\.com|https?:\/\/wa\.me\//.test(js));
});

test("layout responsivo e headers de pré-lançamento estão presentes", () => {
  assert.match(css, /@media\(max-width:540px\)/);
  assert.match(headers, /X-Robots-Tag: noindex, nofollow/);
  assert.match(headers, /Content-Security-Policy:/);
});

test("Worker está configurado para publicar os arquivos em dist", () => {
  const wrangler = JSON.parse(fs.readFileSync("wrangler.jsonc", "utf8"));
  assert.equal(wrangler.name, "fortalmarket");
  assert.equal(wrangler.assets.directory, "./dist");
  assert.ok(/^20\d{2}-\d{2}-\d{2}$/.test(wrangler.compatibility_date));
});
