import { rewritesDe, validarRegisto, projetos } from "./lib/registo.mjs";

// Um registo inválido falha o build: assim um erro de escrita nunca chega à produção.
const erros = validarRegisto(projetos());
if (erros.length) throw new Error(`projetos/registo.json tem erros:\n- ${erros.join("\n- ")}`);

/** @type {import('next').NextConfig} */
const config = {
  trailingSlash: true,
  async rewrites() {
    // beforeFiles: quando o projeto tem deployment, o pedido vai para lá antes de procurar páginas da plataforma.
    // Sem deployment, a plataforma mostra a página "em preparação" do projeto.
    return { beforeFiles: rewritesDe(), afterFiles: [], fallback: [] };
  },
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
    return [{ source: "/:caminho*", has: [{ type: "host", value: "www.falarei.online" }], destination: "https://falarei.online/:caminho*", permanent: true }];
  },
};

export default config;
