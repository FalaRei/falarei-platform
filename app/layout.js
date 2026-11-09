import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { CATEGORIAS } from "../lib/registo.mjs";
import "./globals.css";

const titulo = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-titulo", weight: ["600", "700", "800"] });
const texto = Geist({ subsets: ["latin"], variable: "--f-texto" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--f-mono" });

export const metadata = {
  metadataBase: new URL("https://falarei.online"),
  title: { default: "FalaRei", template: "%s · FalaRei" },
  description: "Apps, jogos, websites e projetos de IA da FalaRei, todos num só sítio.",
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

function Coroa() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--tinta)" />
      <path d="M8 21.5 6.5 11l6 4.5L16 8.5l3.5 7 6-4.5L24 21.5z" fill="var(--ouro)" />
      <rect x="8" y="23" width="16" height="2.4" rx="1.2" fill="var(--ouro)" />
    </svg>
  );
}

export default function Layout({ children }) {
  return (
    <html lang="pt" className={`${titulo.variable} ${texto.variable} ${mono.variable}`}>
      <body>
        <header className="topo">
          <div className="largura topo-in">
            <Link href="/" className="marca">
              <Coroa />
              FalaRei
            </Link>
            <nav className="nav" aria-label="Categorias">
              {CATEGORIAS.map((c) => (
                <Link key={c.id} href={`/${c.id}/`}>
                  {c.nome}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="rodape">
          <div className="largura">
            <span>
              © {new Date().getFullYear()} FalaRei · Criado por <b style={{ color: "var(--tinta)" }}>Vladimiro</b>, <b style={{ color: "var(--tinta)" }}>Delcio</b> e <b style={{ color: "var(--tinta)" }}>Luis</b>
            </span>
            <a href="https://github.com/FalaRei" rel="noopener">GitHub da FalaRei</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
