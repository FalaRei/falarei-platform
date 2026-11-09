# Publicar projetos na FalaRei

Este guia é para quem entra na equipa. Não precisas de conhecer a arquitetura toda: segue a secção do que queres fazer.

---

## 0. Como está montado (2 minutos de leitura)

```
                    falarei.online  (projeto Vercel: falarei-platform)
                           │
   /  /apps/  /jogos/  /projetos/<slug>/    ← páginas da plataforma (Next.js)
                           │
   /apps/sentinelabot/...  ──rewrite──►  deployment do repositório FalaRei/sentinelabot
   /jogos/aranhatwon/...   ──rewrite──►  deployment do repositório FalaRei/aranhatwon
```

- **`falarei-platform`** (este repositório) é a porta de entrada: página inicial, catálogo, páginas de apresentação e as regras de encaminhamento.
- **Cada projeto tem o seu repositório, o seu projeto na Vercel, a sua tecnologia, a sua base de dados e a sua equipa.**
- A ligação entre os dois é **uma entrada em `projetos/registo.json`**. Quando essa entrada tem `deployment`, `npm run rotas` escreve no `vercel.json` uma regra que serve `falarei.online/<categoria>/<slug>/` a partir do deployment do projeto (rewrite na rede da Vercel). O visitante vê sempre `falarei.online`.

### Porque rewrites e não Microfrontends (decisão de novembro de 2026)

| Opção | Veredicto |
|---|---|
| A. Routing do Next.js com tudo num só repositório | ✕ Obriga todos os projetos a usar Next.js e a partilhar deploys. É contra o objetivo de equipas independentes. |
| **B. Vercel Rewrites a partir da plataforma** | ✓ **Escolhida.** Funciona no plano grátis, sem limite de projetos e com qualquer tecnologia. Cada projeto faz deploy sozinho. |
| C. Vercel Microfrontends | Mais tarde. Faz o mesmo com melhor integração (previews ligados, toolbar), mas o plano Hobby inclui só 2 projetos e 50 mil pedidos por mês, e no Pro cada projeto extra custa 250 $ por mês. Faz sentido quando houver equipa paga e poucos projetos grandes. |

**O que a opção B exige de cada projeto** (lê isto antes de criares um):
1. **Caminhos relativos.** O projeto vai ser servido em `/<categoria>/<slug>/`, por isso os assets e links não podem começar por `/`. No Vite usa `base: "./"`; no Next.js usa `basePath: "/<categoria>/<slug>"` (e nesse caso o `deployment` no registo inclui esse caminho).
2. **APIs relativas.** Chama `api/...` relativo à página, não `/api/...` (ver `urlApi` no Sentinela).
3. **Cookies com caminho.** Todos os projetos partilham o domínio `falarei.online`. Põe `Path=/<categoria>/<slug>/` nos cookies, para não colidirem com os de outros projetos.
4. **Autenticação.** Cada projeto tem a sua por agora. Um login único da FalaRei seria um projeto próprio no futuro.

---

## 1. Publicar um projeto novo no GitHub

```bash
cd o-teu-projeto
git init -b main
git add -A
git commit -m "Primeira versão"
gh repo create FalaRei/<slug> --public --source . --remote origin --push
```

- **Públicos ou privados?** No plano grátis da Vercel só dá para fazer deploy de repositórios **públicos** de uma organização. Privado exige Vercel Pro.
- **Nunca** faças commit de `.env`, chaves ou palavras-passe. Usa um `.env.example` vazio e as variáveis da Vercel (secção 6). Antes do primeiro push, procura chaves:
  ```bash
  git grep -nE "sk-|fal_sk_|AIza|password" -- . ':!*.example'
  ```

## 2. Ligar o repositório à Vercel

1. Em [vercel.com/new](https://vercel.com/new), escolhe a organização **FalaRei** no GitHub.
2. Se o repositório não aparecer: **Adjust GitHub App Permissions** e dá acesso ao repositório (ou a todos).
3. Importa. A Vercel deteta o framework. Confirma o *Build Command* e o *Output Directory*: no Sentinela, `npm run site` e `dist` (já estão no `vercel.json`).
4. **Deploy.** Ficas com um endereço `https://<projeto>.vercel.app`.

A partir daqui é automático (integração Git da Vercel):

| Fazes | Acontece |
|---|---|
| Push para qualquer branch | Deployment **Preview** com endereço próprio |
| Abres um Pull Request | Preview + comentário da Vercel no PR com o link |
| Merge para `main` | Deployment de **produção** |

## 3. Associar o projeto à plataforma

Edita `projetos/registo.json` neste repositório:

```json
{
  "name": "Sentinela",
  "category": "apps",
  "slug": "sentinelabot",
  "repository": "sentinelabot",
  "status": "teste",
  "deployment": "https://sentinela-falarei.vercel.app",
  "tryPath": "app/",
  "description": "Uma ou duas frases sobre o projeto.",
  "responsaveis": [{ "nome": "Nome", "papel": "O que faz", "github": "utilizador" }],
  "tecnologias": ["Vite", "JavaScript"]
}
```

| Campo | Regra |
|---|---|
| `category` | `apps`, `jogos`, `websites`, `ai` ou `experiments` |
| `slug` | minúsculas, números e hífenes; único |
| `status` | `ideia`, `development`, `teste`, `beta`, `live` ou `pausa` |
| `deployment` | endereço **de produção** do projeto na Vercel, `https://…`, sem barra final. Vazio = mostra a página "em preparação". |
| `tryPath` | onde está a parte para experimentar, relativo ao projeto (ex: `app/`). Opcional. |

Depois:

```bash
npm run validar   # confirma o registo
npm run rotas     # atualiza o vercel.json com as regras de encaminhamento
npm test          # falha se te esqueceres do passo anterior
git commit -am "Regista o projeto X" && git push
```

O projeto aparece sozinho na página inicial, na categoria e em `/projetos/<slug>/`. Um registo inválido **falha o build**, por isso um erro nunca chega à produção.

## 4. Adicionar uma rota

Não há rotas para escrever à mão: cada entrada com `deployment` gera, com `npm run rotas`, um redirect (`/<categoria>/<slug>` → `/<categoria>/<slug>/`) e um rewrite (`/<categoria>/<slug>/(.*)` → `<deployment>/$1`) no `vercel.json`. Ficam no `vercel.json` e não no `next.config.mjs` porque a Vercel os aplica na rede, antes do Next.js, e assim o caminho passa intacto, incluindo a barra final (com `:caminho*`, a barra final perdia-se e a app do projeto abria no sítio errado). Para **uma categoria nova**, junta-a a `CATEGORIAS` em `lib/registo.mjs`: o menu e a página da categoria aparecem sozinhos.

## 5. Configurar o domínio `falarei.online`

Só depois de o domínio estar comprado:

1. Vercel → projeto **falarei-platform** → **Settings → Domains** → adiciona `falarei.online`.
2. Adiciona também `www.falarei.online` e escolhe **Redirect to falarei.online** (308). O `next.config.mjs` faz o mesmo redirecionamento como rede de segurança.
3. A Vercel mostra os registos DNS exatos (`vercel domains verify falarei.online`). **Copia sempre os valores que a Vercel mostrar.** Em novembro de 2026 eram estes:

   | Tipo | Nome | Valor |
   |---|---|---|
   | A | `@` | `216.198.79.1` |
   | A | `@` | `64.29.17.1` |
   | CNAME | `www` | `c61ab4ecd9c87b09.vercel-dns-017.com.` |

   Alternativa mais simples: trocar os *nameservers* do domínio para `ns1.vercel-dns.com` e `ns2.vercel-dns.com` (a Vercel passa a gerir o DNS todo).
4. **Hostinger** (onde o domínio foi comprado): hPanel → **Domínios** → `falarei.online` → **DNS / Nameservers**. Apaga o registo `A` de estacionamento (`2.57.91.91`) e qualquer `CNAME` antigo de `www`, e cria os de cima. A propagação demora de minutos a 48 h.
5. Quando a Vercel mostrar **Valid Configuration**, o certificado HTTPS é emitido sozinho. Confirma abrindo `https://falarei.online`.

Pela CLI (depois de `vercel login`): `vercel domains add falarei.online` e `vercel domains inspect falarei.online`.

## 6. Variáveis de ambiente

- **Nunca** no código nem no Git. Ficam em Vercel → projeto → **Settings → Environment Variables**, por ambiente (Production, Preview, Development).
- Pela CLI: `vercel env add NOME production` (cola o valor quando pedir) e `vercel env pull .env.local` para as ter em casa.
- A plataforma não precisa de nenhuma. O Sentinela precisa de: `FAL_KEY` (ou `DEEPSEEK_API_KEY`) e `CODIGO_TESTE`. Ver `.env.example` no repositório dele.
- Mudar uma variável **não** atualiza o que já está publicado: faz *Redeploy* no último deployment.

## 7. Atualizações do dia a dia

```bash
git checkout -b melhoria-x
# … alterações …
git push -u origin melhoria-x     # → Preview para testar
gh pr create --fill               # → Preview no PR, a equipa revê
gh pr merge --squash              # → produção
```

Para voltar atrás: na Vercel, **Deployments**, escolhe o anterior e carrega em **Promote to Production** (é instantâneo).

---

## Estrutura da organização

```
FalaRei/
├── falarei-platform     página inicial, catálogo, encaminhamento (este repositório)
├── sentinelabot         Sentinela (apps)
├── aranhatwon           (jogos) ainda por criar
├── ai-projects          (ai) ainda por criar
├── websites-projects    (websites) ainda por criar
└── experimental-projects (experiments) ainda por criar
```

Um repositório por projeto é a regra. Os repositórios agregadores (`ai-projects`, …) servem para projetos pequenos que não justificam repositório próprio: cada um numa pasta, com o seu projeto na Vercel a apontar para essa pasta (*Root Directory*).
