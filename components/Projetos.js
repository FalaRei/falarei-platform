import Link from "next/link";
import { ESTADOS, categoria, linkExperimentar } from "../lib/registo.mjs";

export function Estado({ status }) {
  const e = ESTADOS[status];
  return (
    <span className={`estado n${e.nivel}`}>
      <i aria-hidden="true" />
      {e.nome}
    </span>
  );
}

export function CartaoProjeto({ p }) {
  const experimentar = linkExperimentar(p);
  return (
    <article className="cartao">
      <div className="cartao-topo">
        <span className="cat-mini">{categoria(p.category).nome}</span>
        <Estado status={p.status} />
      </div>
      <h3>
        <Link href={`/projetos/${p.slug}/`}>{p.name}</Link>
      </h3>
      <p>{p.description}</p>
      <div className="acoes">
        {experimentar && (
          <a className="btn primario" href={experimentar}>
            Experimentar →
          </a>
        )}
        <Link className="btn" href={`/projetos/${p.slug}/`}>
          Saber mais
        </Link>
      </div>
    </article>
  );
}

export function GrelhaProjetos({ lista, vazio = "Ainda não há projetos aqui." }) {
  if (!lista.length) return <p className="vazio">{vazio}</p>;
  return (
    <div className="grelha">
      {lista.map((p) => (
        <CartaoProjeto key={p.slug} p={p} />
      ))}
    </div>
  );
}
