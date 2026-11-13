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
test("320px, teclado, limite e foco ao remover produto", async () => {
  const { context, page } = await abrirFormulario();
  try {
    await page.setViewportSize({width:320,height:700});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.locator('#nome').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#bairro').evaluate(e => e === document.activeElement), true);
    for (let i=1;i<50;i++) await page.locator('#adicionar-produto').click();
    await page.locator('#adicionar-produto').click();
    assert.equal(await page.locator('.product-row').count(),50);
    assert.match(await page.locator('#resultado').innerText(), /Máximo de 50/);
    assert.equal(await page.locator('#resultado').evaluate(e=>e===document.activeElement),true);
    await page.locator('.product-row button').last().click();
    assert.equal(await page.locator('#adicionar-produto').evaluate(e=>e===document.activeElement),true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    fs.mkdirSync('test-artifacts',{recursive:true});
    await page.screenshot({path:'test-artifacts/onboarding-320.png'});
  } finally { await context.close(); }
});
test("exportação repetida mantém IDs, texto inerte e nenhum envio ou persistência", async () => {
  const {context,page}=await abrirFormulario();
  const network=[];
  page.on('request', r=> { if (/^https?:/.test(r.url())) network.push(r.url()); });
  try {
    await page.locator('#nome').fill('Exemplo Fictício');
    await page.locator('#categoria').selectOption('mercado');
    await page.locator('#whatsapp').fill('+55 (85) 99999-9999');
    await page.locator('.product-row [name="nome"]').fill('<img src=x onerror=alert(1)>');
    await page.locator('.product-row [name="descricao"]').fill('Descrição fictícia');
    await page.locator('.product-row [name="preco"]').fill('12,9');
    const exportar = async () => {
      const [d]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Baixar ficha JSON'}).click()]);
      assert.match(d.suggestedFilename(),/^rascunho-[a-f0-9-]+\.json$/);
      return JSON.parse(fs.readFileSync(await d.path(),'utf8'));
    };
    const a=await exportar(), b=await exportar();
    assert.deepEqual(a,b);
    assert.equal(a.products[0].price_cents,1290);
    assert.equal(a.products[0].merchant_id,a.merchant.id);
    assert.equal(a.products[0].description,'Descrição fictícia');
    assert.deepEqual(validar(a),[]);
    assert.deepEqual(network,[]);
    assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
    assert.equal(await page.locator('.product-row img').count(),0);
    page.once('dialog', d=>d.accept());
    await page.locator('#limpar').click();
    assert.equal(await page.locator('#nome').inputValue(),'');
    assert.equal(await page.locator('.product-row').count(),1);
  } finally { await context.close(); }
});

test("rejeita telefone curto, preços inválidos e ausência de modalidade/produtos", async () => {
  const {context,page}=await abrirFormulario();
  try {
    await page.locator('#nome').fill('Exemplo Fictício');
    await page.locator('#categoria').selectOption('mercado');
    await page.locator('#whatsapp').fill('123');
    await page.getByRole('button',{name:'Baixar ficha JSON'}).click();
    assert.match(await page.locator('#resultado').innerText(), /WhatsApp inválido/);
    await page.locator('#whatsapp').fill('');
    await page.locator('.product-row [name="nome"]').fill('Produto fictício');
    for (const valor of ['0','1.50','1,234','1000000','-1']) {
      await page.locator('.product-row [name="preco"]').fill(valor);
      await page.getByRole('button',{name:'Baixar ficha JSON'}).click();
      assert.match(await page.locator('#resultado').innerText(), /preço válido/);
    }
    await page.locator('#retirada').uncheck();
    await page.getByRole('button',{name:'Baixar ficha JSON'}).click();
    assert.match(await page.locator('#resultado').innerText(), /modalidade/);
    await page.locator('#retirada').check();
    await page.locator('.product-row button').click();
    await page.getByRole('button',{name:'Baixar ficha JSON'}).click();
    assert.match(await page.locator('#resultado').innerText(), /ao menos um produto/);
  } finally { await context.close(); }
});
