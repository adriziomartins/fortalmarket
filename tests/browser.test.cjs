const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE = process.env.FORTALMARKET_TEST_URL || "http://127.0.0.1:4173";
let browser;

test.before(async () => { browser = await chromium.launch({ headless: true }); });
test.after(async () => { if (browser) await browser.close(); });

async function pagina(options = {}) {
  const context = await browser.newContext({
    viewport: options.viewport || { width: 1280, height: 800 },
    permissions: options.permissions || [],
    locale: "pt-BR"
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  return { page, context };
}
async function terminar(ctx) { await ctx.close(); }

test("página e catálogo demonstrativo carregam sem erro de JS", async () => {
  const { page, context } = await pagina();
  try {
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.reload({ waitUntil: "networkidle" });
    assert.match(await page.title(), /Fortal Market/);
    assert.equal(await page.locator(".product-card").count(), 6);
    assert.equal(await page.locator("#resultado-contagem").innerText(), "6 produtos demonstrativos");
    assert.equal(errors.length, 0, "Erros de JavaScript: " + errors.join(" | "));
  } finally { await terminar(context); }
});

test("busca aceita acentos e apresenta estado vazio", async () => {
  const { page, context } = await pagina();
  try {
    await page.locator("#busca").fill("bobo");
    assert.equal(await page.locator(".product-card").count(), 1);
    assert.match(await page.locator(".product-card").first().innerText(), /Bobó de camarão/);
    await page.locator("#busca").fill("item-que-nao-existe");
    assert.equal(await page.locator(".product-card").count(), 0);
    assert.equal(await page.locator("#sem-resultados").isVisible(), true);
  } finally { await terminar(context); }
});

test("territórios isolam produtos sem bloquear outros bairros", async () => {
  const { page, context } = await pagina();
  try {
    await page.locator("#territorio").selectOption("castelo");
    assert.equal(await page.locator(".product-card").count(), 4);
    await page.locator("#territorio").selectOption("serviluz");
    assert.equal(await page.locator(".product-card").count(), 2);
    assert.match(await page.locator("#produtos").innerText(), /Bobó de camarão/);
    await page.locator("#territorio").selectOption("todos");
    assert.equal(await page.locator(".product-card").count(), 6);
  } finally { await terminar(context); }
});

test("filtros de categoria preservam o foco ao clicar", async () => {
  const { page, context } = await pagina();
  try {
    const mercado = page.getByRole("button", { name: /Mercado/ });
    await mercado.focus();
    await mercado.press("Enter");
    assert.equal(await page.locator(".product-card").count(), 2);
    assert.equal(await mercado.getAttribute("aria-pressed"), "true");
    assert.equal(await mercado.evaluate((el) => document.activeElement === el), true);
  } finally { await terminar(context); }
});

test("carrinho calcula total, conserva foco e contém navegação por teclado", async () => {
  const { page, context } = await pagina();
  try {
    const add = page.getByRole("button", { name: "Adicionar Arroz 1 kg ao pedido" });
    await add.click();
    const dialog = page.getByRole("dialog", { name: "Meu pedido" });
    assert.equal(await dialog.isVisible(), true);
    assert.match(await page.locator("#subtotal").innerText(), /6,50/);
    assert.equal(await page.locator("#contador").innerText(), "1");
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.locator("#copiar-pedido").evaluate(el => document.activeElement === el), true);
    await page.keyboard.press("Tab");
    assert.equal(await page.locator("#fechar-carrinho").evaluate(el => document.activeElement === el), true);
    await page.keyboard.press("Escape");
    assert.equal(await dialog.isVisible(), false);
    assert.equal(await add.evaluate(el => document.activeElement === el), true);
    await page.getByRole("button", { name: "Adicionar Feijão 1 kg ao pedido" }).click();
    assert.match(await page.locator("#subtotal").innerText(), /14,30/);
    assert.equal(await page.locator("#contador").innerText(), "2");
  } finally { await terminar(context); }
});

test("carrinho exige confirmação ao trocar estabelecimento", async () => {
  const { page, context } = await pagina();
  try {
    await page.getByRole("button", { name: "Adicionar Arroz 1 kg ao pedido" }).click();
    await page.getByRole("button", { name: "Fechar carrinho" }).click();
    const bobó = page.getByRole("button", { name: "Adicionar Bobó de camarão ao pedido" });
    page.once("dialog", async (d) => await d.dismiss());
    await bobó.click();
    assert.equal(await page.locator("#contador").innerText(), "1");
    page.once("dialog", async (d) => await d.accept());
    await bobó.click();
    assert.match(await page.locator("#loja-carrinho").innerText(), /Cozinha Demonstrativa/);
    assert.match(await page.locator("#subtotal").innerText(), /27,00/);
  } finally { await terminar(context); }
});

test("lista copiada informa que não representa compra real", async () => {
  const { page, context } = await pagina({ permissions: ["clipboard-read", "clipboard-write"] });
  try {
    await page.getByRole("button", { name: "Adicionar Arroz 1 kg ao pedido" }).click();
    await page.locator("#copiar-pedido").click();
    assert.match(await page.locator("#mensagem-carrinho").innerText(), /copiada/);
    const texto = await page.evaluate(() => navigator.clipboard.readText());
    assert.match(texto, /LISTA DE TESTE/);
    assert.match(texto, /1x Arroz 1 kg/);
    assert.match(texto, /não é um pedido real/);
  } finally { await terminar(context); }
});

test("larguras desktop e celular não produzem rolagem horizontal", async () => {
  fs.mkdirSync(path.join(process.cwd(), "test-artifacts"), { recursive: true });
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }, { width: 320, height: 640 }]) {
    const { page, context } = await pagina({ viewport });
    try {
      const size = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth
      }));
      assert.ok(size.pageWidth <= size.viewportWidth + 1, "overflow em " + viewport.width + "px");
      if (viewport.width !== 320) {
        await page.screenshot({
          path: path.join(process.cwd(), "test-artifacts", viewport.width === 1280 ? "desktop.png" : "mobile.png"),
          fullPage: true
        });
      }
    } finally { await terminar(context); }
  }
});
