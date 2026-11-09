import { validarRegisto, projetos } from "./lib/registo.mjs";

// Um registo inválido falha o build: assim um erro de escrita nunca chega à produção.
const erros = validarRegisto(projetos());
if (erros.length) throw new Error(`projetos/registo.json tem erros:\n- ${erros.join("\n- ")}`);

/** @type {import('next').NextConfig} */
const config = {
  trailingSlash: true,
  // Não acrescentar nem tirar barras automaticamente: os projetos reencaminhados precisam do caminho
  // exatamente como veio (a barra final decide onde os seus ficheiros e a sua API são procurados).
  skipTrailingSlashRedirect: true,
  // O encaminhamento para os projetos está no vercel.json (gerado por npm run rotas).
  async headers() {
    return [
      {
        source: "/:caminho*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    // www.falarei.online -> falarei.online (também se configura na Vercel; isto é a rede de segurança)
    return [
      { source: "/:caminho*", has: [{ type: "host", value: "www.falarei.online" }], destination: "https://falarei.online/:caminho*", permanent: true }
    ];
  },
};

export default config;
