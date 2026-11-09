import { notFound } from "next/navigation";
import { CATEGORIAS, categoria, projetosDa } from "../../lib/registo.mjs";
import { GrelhaProjetos } from "../../components/Projetos.js";

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIAS.map((c) => ({ categoria: c.id }));

export async function generateMetadata({ params }) {
  const c = categoria((await params).categoria);
  return c ? { title: c.nome, description: c.desc } : {};
}

export default async function Categoria({ params }) {
  const c = categoria((await params).categoria);
  if (!c) notFound();
  return (
    <section className="largura secao">
      <div className="heroi" style={{ paddingBlock: "48px 28px" }}>
        <p className="sobre">Categoria</p>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)" }}>{c.nome}</h1>
        <p className="lead">{c.desc}</p>
      </div>
      <GrelhaProjetos lista={projetosDa(c.id)} vazio={`Ainda não há projetos em ${c.nome}. Em breve.`} />
    </section>
  );
}
