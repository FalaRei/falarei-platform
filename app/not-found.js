import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <section className="largura secao" style={{ paddingBlock: "96px" }}>
      <p className="sobre" style={{ font: "600 12.5px var(--f-mono)", color: "var(--ouro)", letterSpacing: "0.1em" }}>404</p>
      <h1 style={{ fontSize: "clamp(38px, 6vw, 60px)", margin: "12px 0 16px" }}>Esta página não existe.</h1>
      <div className="acoes">
        <Link className="btn primario" href="/">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
