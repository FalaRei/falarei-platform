// npm run rotas  → gera vercel.json a partir de projetos/registo.json.
// As regras ficam no vercel.json (e não no next.config) porque a Vercel aplica-as na rede, antes do
// Next.js, e com uma expressão regular o caminho passa intacto, incluindo a barra final.
// O teste tests/registo.test.mjs falha se o vercel.json não estiver em sincronia com o registo.
import { writeFileSync } from "node:fs";
import { vercelJsonDe, validarRegisto, projetos } from "../lib/registo.mjs";

const erros = validarRegisto(projetos());
if (erros.length) {
  console.error(`✕ Corrige o registo primeiro:\n  - ${erros.join("\n  - ")}`);
  process.exit(1);
}
writeFileSync("vercel.json", JSON.stringify(vercelJsonDe(), null, 2) + "\n");
console.log(`✓ vercel.json atualizado com ${vercelJsonDe().rewrites.length} regra(s).`);
