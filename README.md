# Fábio Monreal | Authority Hub

Hub de autoridade técnica em **Astro 6** (site estático), com **SEO**, **Markdown** versionado e deploy na **Vercel** (`fabiomonreal.com`).

## Requisitos de ambiente

- **Node.js `>= 22.12.0`** (exigido pelo Astro 6; em Pop!_OS recomenda-se **fnm** ou **nvm**).
- **npm** acompanha o Node (versão recente evita avisos `EBADENGINE`).

```bash
node -v   # deve ser v22.12+ 
```

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | [Astro](https://astro.build/) 6 — output estático por defeito |
| Estilos | **Tailwind CSS 3** + [`@astrojs/tailwind`](https://docs.astro.build/en/guides/integrations-guide/tailwind/) em [`astro.config.mjs`](astro.config.mjs) (`applyBaseStyles: false`); [`tailwind.config.mjs`](tailwind.config.mjs) com `preflight: false` para conviver com o CSS legado |
| Leitura (posts `.md`) | [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin) — `prose prose-invert` em [`PostLayout.astro`](src/layouts/PostLayout.astro) |
| Design base | [`src/styles/global.css`](src/styles/global.css) — `@tailwind` + tokens (`:root`) e componentes existentes |
| Idioma (UI) | Toggle **PT / EN** no header ([`Header.astro`](src/components/Header.astro)): marca → *spacer* flex → [`site-nav`](src/components/Header.astro) → [`site-header__lang`](src/components/Header.astro); em **≤960px** grelha (marca + idioma na 1.ª linha, links com scroll horizontal na 2.ª). Lógica de URLs em [`locale-switch.ts`](src/lib/locale-switch.ts); posts com tradução passam `localePair` no [`BaseLayout`](src/layouts/BaseLayout.astro) |
| CV imprimível (A4) | [`scripts/build-resumo.mjs`](scripts/build-resumo.mjs) gera [`public/resumo/pt/index.html`](public/resumo/pt/index.html) e [`public/resumo/en/index.html`](public/resumo/en/index.html) a partir de `sobre/*.html` (correção de paths `/assets/...`). Corre antes de cada `npm run build`. |
| Conteúdo | `content/posts/*.md` + schema Zod em [`src/content.config.ts`](src/content.config.ts); páginas de artigo partilham [`src/lib/post-page.ts`](src/lib/post-page.ts) |
| SEO / URLs (código) | [`src/lib/site.ts`](src/lib/site.ts) — `SITE_URL`, `SITE_TITLE`, `SITE_TITLE_EN`, `DEFAULT_OG_IMAGE`, `absoluteUrl`, tipo `HreflangAlternate`. JSON-LD **WebSite** das homes: [`src/lib/home-schema.ts`](src/lib/home-schema.ts) (`ptHomeWebsiteJsonLd`, `enHomeWebsiteJsonLd`). Listagens e sobre usam `new URL("/rota/", SITE_URL).href` para canónicos |
| Navegação suave | [`ClientRouter`](https://docs.astro.build/en/guides/view-transitions/) de `astro:transitions` em [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro) (no Astro 6 o componente antigo `ViewTransitions` foi substituído) |
| Sitemap | [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/) |
| Robots | [`src/pages/robots.txt.ts`](src/pages/robots.txt.ts) |

O ficheiro [`.npmrc`](.npmrc) define `legacy-peer-deps=true` porque `@astrojs/tailwind@6` declara peer `astro` até v5, mas o projeto usa **Astro 6** — a integração funciona na prática para este site estático.

### O que não adicionar “por defeito”

- **Framework de UI em ilha** (React/Vue/Svelte) só quando houver necessidade real (filtros, modais, formulários com estado).
- **Pacote i18n** pesado: as rotas **PT** (`/`, `/posts/`, `/sobre/`) e **EN** (`/en/`, `/en/posts/`, `/en/sobre/`) bastam enquanto o volume for moderado.
- **Bibliotecas de animação** pesadas: preferir CSS, Tailwind `motion-reduce:` e o `ClientRouter`.

### Notas de interface

Toggle **PT/EN**, hero **Monreal**, texto de leitor na **home** e **publicações**, bloco de temas com base nos posts mais recentes, **Resumo** em **`/resumo/pt/`** e **`/resumo/en/`**, hero em **viewport cheia** (`min-h-dvh`) e scroll-snap suave quando o sistema não pede redução de movimento.

**Mobile (≤960px):** [`src/styles/global.css`](src/styles/global.css) — `.shell` a largura útil com `padding-inline`; secções com menos padding vertical; cartões e listas com melhor contraste; hero com CTAs em coluna; header em grelha (sem `display: contents` no agrupador do menu, para evitar sobreposição com `position: sticky` no Firefox). **Desktop (≥961px):** comportamento visual anterior preservado.

## Verificação limpa (Linux / macOS / WSL)

```bash
cd /caminho/para/Fabio-Monreal
fnm use 22   # ou nvm use 22
rm -rf node_modules .astro dist
npm install
npm run build
npm run dev
```

Com lockfile:

```bash
rm -rf node_modules .astro dist
npm ci
npm run build
```

## Comandos do dia a dia

```bash
npm install
npm run dev          # desenvolvimento
npm run build:resumo # só regenera o CV estático em public/resumo/ (opcional; o build já corre isto)
npm run build        # resumo + astro build → dist/
npm run preview      # servir dist/ localmente
```

## Estrutura do repositório

```text
content/
  posts/                 # Artigos PT e EN (mesma pasta; `lang` no frontmatter)
public/
  assets/                # CSS/JS/icons do CV legado e do site
  images/og/
  resumo/                # CV estático A4 (gerado no build) — pt/index.html, en/index.html
src/
  components/
  layouts/
  lib/
    home-schema.ts      # JSON-LD WebSite (home PT/EN)
    post-page.ts         # SEO + locale por artigo PT/EN
    posts.ts             # hreflang, JSON-LD Article, datas
    site.ts              # SITE_URL, títulos, tipo HreflangAlternate
    locale-switch.ts     # Toggle PT/EN no header (rotas)
  pages/
    posts/
    en/
      posts/
      sobre/
    sobre/
sobre/
  index.html             # Fonte do CV PT (PDF pipeline; cópia servida em /resumo/pt/)
  index_en.html
  Fabio_Monreal_Perito.html
  generate_pdf.py
AGENTS.md
```

Guia operacional para agentes de IA e contribuidores: [`AGENTS.md`](AGENTS.md).

## Rotas (PT vs EN)

| PT | EN |
|----|-----|
| `/` | `/en/` |
| `/posts/` | `/en/posts/` |
| `/posts/<id>/` | `/en/posts/<id>/` |
| `/sobre/` | `/en/sobre/` |
| `/resumo/pt/` | `/resumo/en/` |

O `<id>` é o stem do ficheiro Markdown (sem `.md`). PT e EN podem usar slugs diferentes no mesmo par traduzido.

## Conteúdo bilíngue

Cada `.md` declara `lang: pt-BR` ou `lang: en-US`. Convém **um ficheiro por idioma** na mesma pasta `content/posts/`, com `canonicalURL` e URL pública coerentes com o idioma.

- PT: rotas `/posts/<id>/`; `canonicalURL` deve ser a URL absoluta desse caminho no domínio do site.
- EN: rotas `/en/posts/<id>/`; idem para o prefixo `/en/`.

**`translationSlug` (opcional):** valor = **`id`** da outra entrada (nome do ficheiro sem `.md`). Quando `findTranslationPartner` encontra o par, as páginas de artigo emitem `link rel="alternate" hreflang="pt-BR|en-US"`, `hreflang="x-default"` (ver política abaixo) e `og:locale:alternate`, e o header recebe `localePair` explícito para o toggle PT/EN apontar para o URL certo de cada versão. Sem par resolvido, não há `hreflang`. Para metadados coerentes em **ambas** as versões do artigo, cada ficheiro deve declarar `translationSlug` apontando para o `id` do par.

**Política `x-default`:** se existir par PT+EN, `x-default` aponta para a versão **em inglês** (definição em [`src/lib/posts.ts`](src/lib/posts.ts), `xDefaultCanonical`).

Detalhes e exemplos mínimos de frontmatter seguem; o contrato completo está em [`src/content.config.ts`](src/content.config.ts).

## Frontmatter dos posts

### Frontmatter (PT)

```yaml
---
title: "Título do artigo (mínimo 8 caracteres)"
description: "Resumo para SEO entre 40 e 180 caracteres."
date: 2026-05-10
canonicalURL: "https://fabiomonreal.com/posts/meu-artigo"
ogImage: "/images/og/post-default.png"
lang: pt-BR
translationSlug: my-article-slug   # opcional: id da entrada EN
keywords:
  - cloud
  - segurança
---
```

### Frontmatter (EN)

```yaml
---
title: "Article title in English"
description: "Summary between 40 and 180 characters for SEO and social cards."
date: 2026-05-10
canonicalURL: "https://fabiomonreal.com/en/posts/my-article-slug"
ogImage: "/images/og/post-default.png"
lang: en-US
translationSlug: meu-artigo        # opcional: id da entrada PT
keywords:
  - cloud
  - security
---
```

### Campos opcionais (SEO e metadados)

| Campo | Efeito |
|-------|--------|
| `translationSlug` | Liga ao outro post pelo `id`; ativa alternates + link “Read in English” / “Ler em português” no [`PostLayout.astro`](src/layouts/PostLayout.astro). |
| `ogImageAlt` | Texto alternativo OG/Twitter e legenda rica em JSON-LD quando há dimensões (`articleSchemaImage` em [`src/lib/posts.ts`](src/lib/posts.ts)). Se omitido, usa-se o título. |
| `ogImageWidth` / `ogImageHeight` | Meta `og:image:width` / `height` em [`SeoHead.astro`](src/components/SeoHead.astro) e objeto `ImageObject` no JSON-LD do artigo quando **ambos** estão definidos. |
| `syndicationOf` | URL da peça original; serializa `isBasedOn` no JSON-LD `Article` ([`articleJsonLd`](src/lib/posts.ts)). |

**Domínio e build:** define `PUBLIC_SITE_URL` (ex.: `https://fabiomonreal.com`) no ambiente de build para alinhar [`astro.config.mjs`](astro.config.mjs) (`site`), [`src/lib/site.ts`](src/lib/site.ts) (`SITE_URL`), [`src/pages/robots.txt.ts`](src/pages/robots.txt.ts), JSON-LD (`home-schema`, schema `Person` em `/sobre/`) e canónicos gerados com `new URL(..., SITE_URL)` nas páginas de arquivo. Os exemplos literais de `canonicalURL` no frontmatter acima assumem esse domínio.

**Regra editorial:** com uma só língua disponível, o **inglês** é o padrão de alcance global; o arquivo PT pode listar entradas EN num bloco à parte (ver [`src/pages/posts/index.astro`](src/pages/posts/index.astro)).

## SEO

- Metadados: [`src/components/SeoHead.astro`](src/components/SeoHead.astro) — canonical, keywords, Open Graph, Twitter, tipo `article` + `article:published_time` quando aplicável, JSON-LD opcional; alternates `hreflang` tipados com `HreflangAlternate` (importado de [`site.ts`](src/lib/site.ts)).
- Layout: [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro) resolve o canónico com `canonicalURL ?? new URL(pathname, Astro.site ?? SITE_URL)` quando a página não passa URL explícita.
- Artigos: JSON-LD `Article` via [`articleJsonLd`](src/lib/posts.ts).
- Homes: JSON-LD `WebSite` + `Person` via [`ptHomeWebsiteJsonLd`](src/lib/home-schema.ts) / [`enHomeWebsiteJsonLd`](src/lib/home-schema.ts), usados em [`index.astro`](src/pages/index.astro) e [`en/index.astro`](src/pages/en/index.astro) (`SITE_TITLE` / `SITE_TITLE_EN`, URLs com `SITE_URL`).
- Sobre PT: JSON-LD `Person` em [`sobre/index.astro`](src/pages/sobre/index.astro) com `url` derivado de `SITE_URL`.
- `hreflang` + `x-default` quando existir par resolvido por `translationSlug` (ver secção de conteúdo).
- [`src/pages/robots.txt.ts`](src/pages/robots.txt.ts) e `sitemap-index.xml` no build.
- Variável opcional **`PUBLIC_SITE_URL`** alinhada a [`astro.config.mjs`](astro.config.mjs) e [`src/lib/site.ts`](src/lib/site.ts).

### CSS (manutenção)

- Componentes e tokens vivem sobretudo em [`src/styles/global.css`](src/styles/global.css). Seletores como `.panel` / `.stat-card` foram removidos por não terem uso nas páginas Astro; novos cartões devem reutilizar `.content-card`, `.post-card`, `.timeline-card`, etc.

## CV legado e PDF

Os HTMLs completos do currículo vivem em `sobre/` e alimentam o script de PDF. Cada PDF deve caber em **uma única página A4** (escala ajustada automaticamente pelo script).

| HTML | PDF | Público |
|------|-----|---------|
| `sobre/index.html` | `Fabio_Monreal_CV_PT.pdf` | Sim (site/canonical) |
| `sobre/index_en.html` | `Fabio_Monreal_CV_EN.pdf` | Sim |
| `sobre/Fabio_Monreal_Perito.html` | `Fabio_Monreal_Perito.pdf` | **Não** — uso privado, `noindex`, CSS inline |

O currículo de **Perito Judicial** não entra no sitemap nem na navegação do blog Astro.

**Resumo para impressão (A4) no browser:** versões estáticas em **`/resumo/pt/`** e **`/resumo/en/`** (ficheiros em `public/resumo/...`), com CSS em `/assets/css/...`. A página Astro **`/sobre/`** é o “sobre” editorial do hub.

### Gerar PDF localmente

```bash
poetry install
poetry run playwright install chromium
poetry run python sobre/generate_pdf.py
```

Com `pip`:

```bash
pip install playwright pypdf
python -m playwright install chromium
python sobre/generate_pdf.py
```
