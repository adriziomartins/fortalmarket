const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const { validar } = require("../scripts/validate-submission.cjs");

let browser;
test.before(async () => { browser = await chromium.launch({ headless: true }); });
test.after(async () => { if (browser) await browser.close(); });
async function abrirFormulario() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve("tools/onboarding/index.html")).href);
  return { context, page, errors };
}
test("ficha de lojista não libera exportação com dados incompletos", async () => {
  const {context,page,errors}=await abrirFormulario();
  try {
    await page.getByRole("button",{name:"Baixar ficha JSON"}).click();
    assert.match(await page.locator("#resultado").innerText(),/Preencha nome fantasia/);
    assert.equal(errors.length,0);
  } finally { await context.close(); }
});
test("exporta ficha válida de rascunho sem envio de rede", async () => {
  const {context,page,errors}=await abrirFormulario();
  try {
    await page.locator("#nome").fill("Mercado de Teste");
    await page.locator("#categoria").selectOption("mercado");
    await page.locator("#whatsapp").fill("85999999999");
    await page.locator('.product-row [name="nome"]').fill("Arroz 1 kg");
    await page.locator('.product-row [name="preco"]').fill("6,50");
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button",{name:"Baixar ficha JSON"}).click()
    ]);
    const payload=JSON.parse(fs.readFileSync(await download.path(),"utf8"));
    assert.equal(payload.merchant.trade_name,"Mercado de Teste");
    assert.equal(payload.merchant.public_whatsapp,"5585999999999");
    assert.equal(payload.merchant.authorization_status,"pending");
    assert.equal(payload.merchant.publication_status,"draft");
    assert.equal(payload.products[0].price_cents,650);
    assert.deepEqual(validar(payload),[]);
    assert.equal(errors.length,0);
  } finally { await context.close(); }
});
test("DDD 55 não é confundido com DDI na exportação", async () => {
  const {context,page}=await abrirFormulario();
  try {
    await page.locator("#nome").fill("Comércio Fictício");
    await page.locator("#categoria").selectOption("mercado");
    await page.locator("#whatsapp").fill("55999999999");
    await page.locator('.product-row [name="nome"]').fill("Detergente");
    await page.locator('.product-row [name="preco"]').fill("2,70");
    const [download]=await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button",{name:"Baixar ficha JSON"}).click()
    ]);
    const payload=JSON.parse(fs.readFileSync(await download.path(),"utf8"));
    assert.equal(payload.merchant.public_whatsapp,"5555999999999");
    assert.deepEqual(validar(payload),[]);
  } finally { await context.close(); }
});
test("preço inválido impede exportação", async () => {
  const {context,page}=await abrirFormulario();
  try {
    await page.locator("#nome").fill("Comércio Fictício");
    await page.locator("#categoria").selectOption("mercado");
    await page.locator('.product-row [name="nome"]').fill("Detergente");
    await page.locator('.product-row [name="preco"]').fill("-2");
    await page.getByRole("button",{name:"Baixar ficha JSON"}).click();
    assert.match(await page.locator("#resultado").innerText(),/preço válido maior que zero/);
  } finally { await context.close(); }
});