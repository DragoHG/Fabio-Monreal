# Fábio Monreal | Executive Resume & Portfolio

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DragoHG/Fabio-Monreal)

Source for an interactive executive résumé: a live portfolio and an automated, ATS-oriented PDF generator (Python + Playwright).

**Live site (canonical):** [fabio-monreal.vercel.app](https://fabio-monreal.vercel.app)

**Shortcut routes:** [/](https://fabio-monreal.vercel.app/) serves the Portuguese public page (via rewrite); [/en](https://fabio-monreal.vercel.app/en) redirects to the English résumé.

**GitHub:** [DragoHG/Fabio-Monreal](https://github.com/DragoHG/Fabio-Monreal)

> **Mirroring:** If you use GitHub Pages, the usual project URL pattern is  
> [DragoHG.github.io/Fabio-Monreal](https://DragoHG.github.io/Fabio-Monreal/).  
> Custom domains such as `fabio-monreal.github.io` require configuration in your GitHub account or DNS.  
> Prefer linking and sharing **fabio-monreal.vercel.app** as the primary URL for search engines.

---

## Executive profile

IT Infrastructure specialist and strategic lead with 14 years of delivery. Focus on complex engineering paired with business enablement:

- **Cyber resilience & crisis management:** Incident Commander and CISO advisor.
- **Sovereign GenAI & MLOps:** LLM infrastructure with strict data‑leakage controls.
- **Multi‑cloud architecture & FinOps:** High availability and cost‑efficiency under Zero Trust.
- **Data security & compliance:** ISO 27001, LGPD, and GDPR alignment.

---

## Editing HTML locally

Sources are kept **readable** (indented HTML, formatted JSON‑LD scripts). Touch any `*.html` or files under `assets/css/` directly.

Optional tidy-up after big pastes:

```bash
pip install djlint
djlint *.html --reformat --indent 2 --profile html
```

---

## Repository layout

- **Production site:** `index.html` (PT‑BR), `index_en.html` (EN), `assets/`, [`vercel.json`](vercel.json) (`/` → `index.html`, `/en` → `index_en.html`).
- **SEO:** Semantic HTML5, JSON‑LD (`schema.org/Person`), Open Graph, Twitter Cards; canonical **`fabio-monreal.vercel.app/`** (PT) and **`/en`** (EN).
- **Optional local `_private` HTML (never committed):** `index_private.html`, `index_en_private.html` — include phone where you want; [`generate_pdf.py`](generate_pdf.py) prefers them and otherwise uses the tracked `index.html` / `index_en.html`.
- **Automation:** [`generate_pdf.py`](generate_pdf.py) uses Playwright to render HTML and **pypdf** for ATS‑friendly PDF metadata.

---

## Build PDF locally (Poetry)

```bash
git clone https://github.com/DragoHG/Fabio-Monreal.git
cd Fabio-Monreal
poetry install
poetry run playwright install chromium
```

Optionally place `index_private.html` / `index_en_private.html` (phone, ATS extras) beside `generate_pdf.py`, then:

```bash
poetry run python generate_pdf.py
```

The script fits content to **a single A4 page** per language via automatic scaling. If the `*_private` files are absent, it uses the tracked **`index.html` / `index_en.html`** (production body text, no surprise errors).

### Without Poetry (pip)

```bash
pip install playwright pypdf
python -m playwright install chromium
python generate_pdf.py
```

---

## Contact & links

- **LinkedIn:** [linkedin.com/in/fabiomonreal](https://www.linkedin.com/in/fabiomonreal/)
- **Credly:** [credly.com/users/fabio-monreal/badges](https://www.credly.com/users/fabio-monreal/badges)
- **Email:** [fabio.monreal@outlook.com](mailto:fabio.monreal@outlook.com)

Architected for resilience, governed by compliance.