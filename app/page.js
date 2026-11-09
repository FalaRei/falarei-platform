import Link from "next/link";
import { CATEGORIAS, projetos, projetosDa } from "../lib/registo.mjs";
import { GrelhaProjetos } from "../components/Projetos.js";

export default function Inicio() {
  const lista = projetos();
  return (
    <>
      <section className="largura heroi">
        <p className="sobre">Estúdio FalaRei</p>
        <h1>
          Fala, <em>rei</em>. Aqui está tudo o que construímos.
        </h1>
        <p className="lead">Apps, jogos, websites e projetos de IA. Cada um tem a sua equipa e o seu ritmo, e todos vivem aqui.</p>
      </section>

      <section className="largura secao" aria-labelledby="t-projetos">
        <div className="secao-titulo">
          <h2 id="t-projetos">Projetos</h2>
          <p>{lista.length === 1 ? "1 projeto" : `${lista.length} projetos`}</p>
        </div>
        <GrelhaProjetos lista={lista} />
      </section>

      <section className="largura secao" aria-labelledby="t-categorias">
        <div className="secao-titulo">
          <h2 id="t-categorias">Categorias</h2>
        </div>
        <div className="categorias">
          {CATEGORIAS.map((c) => {
            const n = projetosDa(c.id).length;
            return (
              <Link key={c.id} href={`/${c.id}/`} className="categoria">
                <b>{c.nome}</b>
                <span>{c.desc}</span>
                <small>{n === 0 ? "em breve" : n === 1 ? "1 projeto" : `${n} projetos`}</small>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
