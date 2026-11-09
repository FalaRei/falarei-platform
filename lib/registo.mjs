// Registo central de projetos da FalaRei. Uma entrada em projetos/registo.json chega para o projeto:
// - aparecer na sua categoria e na página inicial;
// - ter página de apresentação em /projetos/<slug>;
// - ser servido em /<categoria>/<slug>/ quando tiver "deployment" (a Vercel reencaminha para lá).
// Este ficheiro é usado pelo Next.js (páginas e next.config.mjs) e pelos testes, por isso não depende do React.

import { readFileSync } from "node:fs";
import { join } from "node:path";

// Lido no build (as páginas são todas geradas de forma estática), a partir da raiz do projeto.
const registo = JSON.parse(readFileSync(join(process.cwd(), "projetos", "registo.json"), "utf8"));

export const CATEGORIAS = [
  { id: "apps", nome: "Apps", desc: "Ferramentas para usar no dia a dia." },
  { id: "jogos", nome: "Jogos", desc: "Para jogar no browser." },
  { id: "websites", nome: "Websites", desc: "Sites e páginas que construímos." },
  { id: "ai", nome: "IA", desc: "Projetos construídos com inteligência artificial." },
  { id: "experiments", nome: "Experiências", desc: "Ideias em teste. Podem mudar ou desaparecer." },
];

export const ESTADOS = {
  ideia: { nome: "Ideia", nivel: 0 },
  development: { nome: "Em desenvolvimento", nivel: 1 },
  teste: { nome: "Em teste", nivel: 2 },
  beta: { nome: "Beta", nivel: 3 },
  live: { nome: "Disponível", nivel: 4 },
  pausa: { nome: "Em pausa", nivel: -1 },
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Devolve a lista de erros do registo (vazia se estiver tudo bem). */
export function validarRegisto(lista) {
  const erros = [];
  if (!Array.isArray(lista)) return ["O registo tem de ser uma lista."];
  const vistos = new Set();
  lista.forEach((p, i) => {
    const onde = `Projeto ${i + 1} (${p?.slug ?? "sem slug"})`;
    if (!p?.name) erros.push(`${onde}: falta "name".`);
    if (!SLUG.test(p?.slug ?? "")) erros.push(`${onde}: "slug" só pode ter letras minúsculas, números e hífenes.`);
    if (vistos.has(p?.slug)) erros.push(`${onde}: o slug "${p.slug}" já existe.`);
    vistos.add(p?.slug);
    if (!CATEGORIAS.some((c) => c.id === p?.category)) erros.push(`${onde}: categoria "${p?.category}" não existe (usa: ${CATEGORIAS.map((c) => c.id).join(", ")}).`);
    if (!ESTADOS[p?.status]) erros.push(`${onde}: estado "${p?.status}" não existe (usa: ${Object.keys(ESTADOS).join(", ")}).`);
    if (p?.deployment && !/^https:\/\/[a-z0-9.-]+(\/[^\s?#]*)?$/i.test(p.deployment)) erros.push(`${onde}: "deployment" tem de ser um endereço https sem ? nem #.`);
    if (p?.deployment?.endsWith("/")) erros.push(`${onde}: tira a barra final do "deployment".`);
    if (p?.tryPath && (/^\//.test(p.tryPath) || /^https?:/.test(p.tryPath))) erros.push(`${onde}: "tryPath" é relativo ao projeto (ex: "app/"), sem barra inicial.`);
    if (!Array.isArray(p?.responsaveis) || !p.responsaveis.length) erros.push(`${onde}: indica pelo menos um responsável.`);
  });
  return erros;
}

export const projetos = () => registo;
export const projeto = (slug) => registo.find((p) => p.slug === slug) ?? null;
export const categoria = (id) => CATEGORIAS.find((c) => c.id === id) ?? null;
export const projetosDa = (cat) => registo.filter((p) => p.category === cat);

/** Caminho público do projeto no domínio principal. */
export const caminhoDe = (p) => `/${p.category}/${p.slug}/`;
/** Link "Experimentar": dentro do caminho do projeto, só quando há deployment associado. */
export const linkExperimentar = (p) => (p.deployment ? `${caminhoDe(p)}${p.tryPath ?? ""}` : null);

/**
 * Rewrites da Vercel: /<categoria>/<slug>/... -> <deployment>/...
 * O projeto continua num deployment independente; a plataforma só encaminha os pedidos.
 * Grupo de regex (.*) com $1: o resto do caminho passa intacto, incluindo a barra final ("app/").
 */
export function rewritesDe(lista = registo) {
  return lista
    .filter((p) => p.deployment)
    .map((p) => ({ source: `/${p.category}/${p.slug}/(.*)`, destination: `${p.deployment}/$1` }));
}

/** Conteúdo do vercel.json da plataforma (gerado por npm run rotas). */
export function vercelJsonDe(lista = registo) {
  return {
    $schema: "https://openapi.vercel.sh/vercel.json",
    // Sem barra, os caminhos relativos dos projetos sairiam da pasta: /apps/x -> /apps/x/
    redirects: lista.filter((p) => p.deployment).map((p) => ({ source: `/${p.category}/${p.slug}`, destination: `/${p.category}/${p.slug}/`, permanent: true })),
    rewrites: rewritesDe(lista),
  };
}
