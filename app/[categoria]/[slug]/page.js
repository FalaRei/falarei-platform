// Só aparece quando o projeto ainda não tem deployment associado. Com deployment, a Vercel
// reencaminha /<categoria>/<slug>/ para o projeto antes de chegar aqui (rewrites em next.config.mjs).
import Link from "next/link";
import { notFound } from "next/navigation";
import { projeto, projetos } from "../../../lib/registo.mjs";
import { Estado } from "../../../components/Projetos.js";

export const dynamicParams = false;
export const generateStaticParams = () => projetos().map((p) => ({ categoria: p.category, slug: p.slug }));

export default async function EmPreparacao({ params }) {
  const { categoria, slug } = await params;
  const p = projeto(slug);
  if (!p || p.category !== categoria) notFound();
  return (
    <section className="largura secao" style={{ paddingBlock: "88px" }}>
      <Estado status={p.status} />
      <h1 style={{ fontSize: "clamp(38px, 6vw, 60px)", margin: "16px 0" }}>{p.name} está a ser preparado.</h1>
      <p className="lead" style={{ color: "var(--tinta-2)", maxWidth: "52ch" }}>
        Ainda não há uma versão publicada neste endereço. Vê como está a correr o projeto.
      </p>
      <div className="acoes" style={{ marginTop: 24 }}>
        <Link className="btn primario" href={`/projetos/${p.slug}/`}>
          Ver o projeto
        </Link>
      </div>
    </section>
  );
}
