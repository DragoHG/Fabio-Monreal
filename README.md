# Fábio Monreal | Authority Hub

Hub de autoridade técnica em **Astro**, com foco em **SEO agressivo**, **performance máxima no Vercel** e gestão de conteúdo em **Markdown versionado no GitHub**.

## Stack

- `Astro` para geração estática
- `content/posts/*.md` como fonte de verdade dos artigos
- `@astrojs/sitemap` para gerar sitemap no build
- `src/pages/robots.txt.ts` para gerar `robots.txt` dinamicamente
- `sobre/` com os HTMLs legados do currículo e o pipeline de PDF em Python

## Comando inicial

```bash
npm install
```

Depois:

```bash
npm run dev
```

## Estrutura

```text
content/
  posts/
public/
  assets/
  images/og/
src/
  components/
  layouts/
  lib/
  pages/
    posts/
    sobre/
    en/
sobre/
  index.html
  index_en.html
  generate_pdf.py
```

## Frontmatter dos posts

```yaml
---
title: "Título do artigo"
description: "Resumo curto para SEO e compartilhamento social."
date: 2026-05-10
canonicalURL: "https://fabiomonreal.com/posts/titulo-do-artigo"
ogImage: "/images/og/post-default.png"
keywords:
  - cloud architecture
  - FinOps
  - cybersecurity
---
```

## SEO

- Canonical dinâmico apontando para `https://fabiomonreal.com`
- OpenGraph e Twitter Cards automáticos por página
- `robots.txt` gerado em `src/pages/robots.txt.ts`
- `sitemap-index.xml` gerado automaticamente pelo Astro no build

## PDFs do currículo

Os arquivos HTML legados foram movidos para `sobre/`, junto com `generate_pdf.py`.

Para gerar os PDFs:

```bash
poetry install
poetry run playwright install chromium
poetry run python sobre/generate_pdf.py
```

Também funciona com `pip`:

```bash
pip install playwright pypdf
python -m playwright install chromium
python sobre/generate_pdf.py
```