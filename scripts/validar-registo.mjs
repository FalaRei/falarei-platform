// npm run validar  → confirma que projetos/registo.json está correto antes de fazeres push.
import { projetos, validarRegisto, rewritesDe, caminhoDe, linkExperimentar } from "../lib/registo.mjs";

const lista = projetos();
const erros = validarRegisto(lista);
if (erros.length) {
  console.error(`\n✕ O registo tem ${erros.length} erro(s):\n  - ${erros.join("\n  - ")}\n`);
  process.exit(1);
}
console.log(`\n✓ Registo válido: ${lista.length} projeto(s)\n`);
for (const p of lista) {
  console.log(`  ${p.name.padEnd(20)} ${caminhoDe(p).padEnd(28)} ${p.deployment ? `→ ${p.deployment}` : "(sem deployment: mostra a página em preparação)"}`);
  if (linkExperimentar(p)) console.log(`  ${"".padEnd(20)} experimentar: ${linkExperimentar(p)}`);
}
console.log(`\n  ${rewritesDe(lista).length} regra(s) de encaminhamento.\n`);
