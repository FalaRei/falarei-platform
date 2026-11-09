import Link from "next/link";
import { notFound } from "next/navigation";
import { ESTADOS, categoria, projeto, projetos, linkExperimentar, caminhoDe } from "../../../lib/registo.mjs";
import { Estado } from "../../../components/Projetos.js";

export const dynamicParams = false;
export const generateStaticParams = () => projetos().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }) {
  const p = projeto((await params).slug);
  return p ? { title: p.name, description: p.description } : {};
}

const ETAPAS = ["ideia", "development", "teste", "beta", "live"];

export default async function Projeto({ params }) {
  const p = projeto((await params).slug);
  if (!p) notFound();
  const c = categoria(p.category);
  const experimentar = linkExperimentar(p);
  const nivel = ESTADOS[p.status].nivel;
  return (
    <section className="largura projeto">
      <div>
        <p className="migalhas">
          <Link href={`/${c.id}/`}>{c.nome}</Link> / {p.name}
        </p>
        <h1>{p.name}</h1>
        <p className="lead">{p.description}</p>
        <div className="acoes">
          {experimentar ? (
            <a className="btn primario" href={experimentar}>
              Experimentar →
            </a>
          ) : (
            <span className="btn" aria-disabled="true">
              Ainda sem versão para experimentar
            </span>
          )}
          <a className="btn" href={`https://github.com/FalaRei/${p.repository}`} rel="noopener">
            Código no GitHub
          </a>
        </div>
      </div>

      <aside className="ficha" aria-label="Ficha do projeto">
        <div>
          <p className="rotulo">Estado</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Estado status={p.status} />
          </div>
          {nivel >= 0 && (
            <>
              <div className="progresso" role="img" aria-label={`Etapa ${nivel + 1} de 5: ${ESTADOS[p.status].nome}`}>
                {ETAPAS.map((e, i) => (
                  <i key={e} className={i <= nivel ? "feito" : ""} />
                ))}
              </div>
              <div className="progresso-rotulos">
                <span>ideia</span>
                <span>disponível</span>
              </div>
            </>
          )}
        </div>
        <dl>
          <div>
            <dt>Responsáveis</dt>
            <dd>
              <ul>
                {p.responsaveis.map((r) => (
                  <li key={r.nome}>
                    {r.github ? (
                      <a href={`https://github.com/${r.github}`} rel="noopener">
                        {r.nome}
                      </a>
                    ) : (
                      r.nome
                    )}
                    {r.papel ? ` · ${r.papel}` : ""}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          {p.tecnologias?.length > 0 && (
            <div>
              <dt>Tecnologias</dt>
              <dd className="etiquetas">
                {p.tecnologias.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </dd>
            </div>
          )}
          <div>
            <dt>Endereço</dt>
            <dd>
              <code>falarei.online{caminhoDe(p)}</code>
            </dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
