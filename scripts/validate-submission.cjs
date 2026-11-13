#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
function validar(obj) {
  const errors = [];
  const req = (cond, msg) => { if (!cond) errors.push(msg); };
  const isObj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
  const str = (v, max = 200) => typeof v === "string" && v.length <= max;
  req(isObj(obj), "Objeto JSON esperado");
  if (!isObj(obj)) return errors;
  req(obj.schema_version === "0.2", "schema_version deve ser 0.2");
  const id = v => typeof v === "string" && /^[a-zA-Z0-9][a-zA-Z0-9-]{7,79}$/.test(v);
  const m = obj.merchant;
  req(isObj(m), "merchant é obrigatório");
  if (isObj(m)) {
    req(id(m.id), "merchant.id inválido");
    req(m.logo === null && m.logo_authorization_status === "pending", "merchant.logo deve permanecer ausente e pendente");
    for (const [k,max] of [["trade_name",100],["official_neighborhood",80],["locality",80],["primary_category",32]]) {
      req(str(m[k],max) && m[k].trim().length > 0, "merchant." + k + " é obrigatório e tem limite de caracteres");
    }
    for (const [k,max] of [["description",280],["opening_hours_text",160],["service_area_text",160]]) req(str(m[k],max), "merchant." + k + " deve ser texto válido");
    req(str(m.public_whatsapp,13) && (m.public_whatsapp === "" || /^55[1-9][0-9]{10}$/.test(m.public_whatsapp)), "merchant.public_whatsapp deve conter 55 + DDD + número móvel, ou vazio");
    req(["mercado","refeicoes","limpeza","beleza","farmacia","outros"].includes(m.primary_category), "merchant.primary_category inválida");
    req(Array.isArray(m.fulfillment) && m.fulfillment.length > 0 && m.fulfillment.length <= 2 && new Set(m.fulfillment).size === m.fulfillment.length && m.fulfillment.every(x => ["pickup","merchant_delivery"].includes(x)), "merchant.fulfillment inválido");
    req(m.publication_status === "draft", "merchant.publication_status deve ser draft nesta etapa");
    req(m.authorization_status === "pending", "merchant.authorization_status deve ser pending nesta etapa");
  }
  req(Array.isArray(obj.products) && obj.products.length >= 1 && obj.products.length <= 50, "products precisa conter 1 a 50 itens");
  const ids = new Set();
  if (Array.isArray(obj.products)) obj.products.forEach((p,i) => {
    const k = "products[" + i + "]";
    req(isObj(p), k + " deve ser objeto");
    if (!isObj(p)) return;
    req(id(p.id) && !ids.has(p.id), k + ".id inválido ou duplicado");
    ids.add(p.id);
    req(isObj(m) && p.merchant_id === m.id, k + ".merchant_id inválido");
    req(str(p.description,280), k + ".description inválida");
    req(p.image === null && p.image_authorization_status === "pending", k + ".image deve permanecer ausente e pendente");
    req(str(p.name,110) && p.name.trim().length > 0, k + ".name é obrigatório");
    req(["un","kg","g","l","ml","porcao","pacote"].includes(p.unit), k + ".unit inválida");
    req(Number.isSafeInteger(p.price_cents) && p.price_cents > 0 && p.price_cents <= 99999999, k + ".price_cents deve ser inteiro positivo");
    req(p.status === "draft", k + ".status deve ser draft");
    req(p.availability === "unconfirmed", k + ".availability deve ser unconfirmed");
    req(p.price_verified_at === null, k + ".price_verified_at deve ser null");
  });
  const rev = obj.internal_review;
  req(isObj(rev), "internal_review é obrigatório");
  if (isObj(rev)) for (const k of ["price_confirmed","contact_verified","evidence_stored_privately"]) req(rev[k] === false, "internal_review." + k + " deve começar false");
  return errors;
}
if (require.main === module) {
  const path = process.argv[2];
  if (!path) { console.error("Uso: node scripts/validate-submission.cjs caminho/rascunho.json"); process.exit(2); }
  let data;
  try { data = JSON.parse(fs.readFileSync(path,"utf8")); } catch(e) { console.error("Arquivo/JSON inválido: " + e.message); process.exit(2); }
  const erros = validar(data);
  if (erros.length) { console.error("Ficha rejeitada:\n- " + erros.join("\n- ")); process.exit(1); }
  console.log("Ficha de rascunho válida. ATENÇÃO: isso não autoriza publicação.");
}
module.exports = { validar };
