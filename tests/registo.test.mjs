import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validarRegisto, rewritesDe, vercelJsonDe, caminhoDe, linkExperimentar, projetos } from "../lib/registo.mjs";

const base = { name: "Teste", category: "apps", slug: "teste", repository: "teste", status: "development", deployment: "", description: "x", responsaveis: [{ nome: "A" }] };

test("o registo real é válido", () => {
  assert.deepEqual(validarRegisto(projetos()), []);
});

test("a validação apanha os erros comuns", () => {
  const erros = validarRegisto([
    { ...base, slug: "Com Espaços" },
    { ...base, category: "jogo" },
    { ...base, slug: "dup" },
    { ...base, slug: "dup" },
    { ...base, slug: "url", deployment: "http://inseguro.com" },
    { ...base, slug: "barra", deployment: "https://x.vercel.app/" },
    { ...base, slug: "try", tryPath: "/app/" },
    { ...base, slug: "sem-resp", responsaveis: [] },
    { ...base, slug: "estado", status: "pronto" },
  ]).join("\n");
  for (const esperado of ["só pode ter letras", 'categoria "jogo"', 'slug "dup" já existe', "endereço https", "barra final", "tryPath", "responsável", 'estado "pronto"']) assert.match(erros, new RegExp(esperado.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("só os projetos com deployment são reencaminhados, com e sem barra final", () => {
  const r = rewritesDe([base, { ...base, slug: "vivo", deployment: "https://vivo.vercel.app" }]);
  assert.deepEqual(r, [{ source: "/apps/vivo/(.*)", destination: "https://vivo.vercel.app/$1" }]);
});

test("caminhos públicos e link para experimentar", () => {
  assert.equal(caminhoDe(base), "/apps/teste/");
  assert.equal(linkExperimentar(base), null);
  assert.equal(linkExperimentar({ ...base, deployment: "https://t.vercel.app", tryPath: "app/" }), "/apps/teste/app/");
});


test("o vercel.json está em sincronia com o registo (senão: npm run rotas)", () => {
  assert.deepEqual(JSON.parse(readFileSync("vercel.json", "utf8")), vercelJsonDe());
});
