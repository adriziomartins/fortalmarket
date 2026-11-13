const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { validar } = require("../scripts/validate-submission.cjs");

const model = JSON.parse(fs.readFileSync("data/examples/merchant-submission.sample.json","utf8"));
const clone = () => JSON.parse(JSON.stringify(model));
test("modelo fictício de ficha passa no validador", () => {
  assert.deepEqual(validar(model), []);
});
test("nenhum comércio pode ser ativado apenas pela ficha", () => {
  const x = clone();
  x.merchant.authorization_status = "approved";
  x.merchant.publication_status = "active";
  assert.ok(validar(x).some(e => e.includes("authorization_status")));
  assert.ok(validar(x).some(e => e.includes("publication_status")));
});
test("preço inteiro e campos mínimos são obrigatórios", () => {
  const x = clone();
  x.products[0].price_cents = 6.50;
  x.merchant.trade_name = "";
  assert.ok(validar(x).some(e => e.includes("price_cents")));
  assert.ok(validar(x).some(e => e.includes("trade_name")));
});
test("telefone comercial precisa de DDI e DDD válidos", () => {
  const x = clone();
  x.merchant.public_whatsapp = "123";
  assert.ok(validar(x).some(e => e.includes("public_whatsapp")));
  x.merchant.public_whatsapp = "5585999999999";
  assert.deepEqual(validar(x), []);
});
test("formulário é local e não publica automaticamente", () => {
  const html=fs.readFileSync("tools/onboarding/index.html","utf8");
  const js=fs.readFileSync("tools/onboarding/app.js","utf8");
  assert.match(html,/ferramenta interna/i);
  assert.match(html,/não envia dados à internet/i);
  assert.match(js,/URL\.createObjectURL/);
  assert.match(js,/authorization_status: "pending"/);
  assert.doesNotMatch(js,/\bfetch\s*\(|\bXMLHttpRequest\b|\blocalStorage\b|\bsessionStorage\b/);
  assert.doesNotMatch(js,/\.innerHTML\s*=/);
});
test("ferramenta interna não é copiada para dist no script de build", () => {
  const build = fs.readFileSync("scripts/build.sh","utf8");
  assert.match(build,/cp index\.html styles\.css app\.js _headers dist\//);
  assert.doesNotMatch(build,/tools\/onboarding/);
});
test("identificadores, vínculos e imagens não podem burlar o rascunho", () => {
  for (const mutate of [
    x => { delete x.merchant.id; },
    x => { x.products[0].merchant_id = "outro-comercio"; },
    x => { x.products.push({...x.products[0]}); },
    x => { x.products[0].image = "https://example.org/foto.jpg"; },
    x => { x.merchant.logo_authorization_status = "approved"; },
    x => { x.products[0].price_verified_at = "2026-11-09"; },
    x => { x.products[0].description = "x".repeat(281); }
  ]) {
    const x = clone(); mutate(x); assert.ok(validar(x).length);
  }
});
test("limites de produtos e estados de revisão", () => {
  const x = clone();
  x.products = Array.from({length:50}, (_, i) => ({...model.products[0], id: `product-demo-${i}`}));
  assert.deepEqual(validar(x), []);
  x.products.push({...model.products[0],id:"product-demo-51"});
  assert.ok(validar(x).some(e => e.includes("1 a 50")));
  x.products = []; assert.ok(validar(x).length);
});
