"""
Gera PDFs A4 (máximo 2 páginas) a partir dos HTML do currículo.
A escala é descoberta automaticamente (maior scale possível que ainda cabe em <= 2 páginas).
Dependências: playwright, pypdf  →  pip install playwright pypdf && playwright install chromium
"""

from __future__ import annotations

import asyncio
from pathlib import Path

from playwright.async_api import async_playwright
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parent
SCRATCH_NAME = ".pdf_fit_scratch.pdf"

# Produção no repositório (sem telefone no HTML público).
HTML_PT_REPO = ROOT / "index.html"
HTML_EN_REPO = ROOT / "index_en.html"
# Cópias locais opcionais (gitignored): telefone, envio direto, PDF preferencial.
HTML_PT_PRIVATE = ROOT / "index_private.html"
HTML_EN_PRIVATE = ROOT / "index_en_private.html"
HTML_PERITO = ROOT / "sobre" / "Fabio_Monreal_Perito.html"
HTML_PERITO_PRIVATE = ROOT / "sobre" / "Fabio_Monreal_Perito_private.html"


def file_url(path: Path | str) -> str:
    return "file:///" + str(path).replace(chr(92), "/")


def resolve_cv_html(private_path: Path, repo_path: Path) -> Path:
    """
    Prioridade: *_private.html (local, não versionado); senão index.html/index_en.html de produção.
    """
    if private_path.exists():
        return private_path.resolve()
    if repo_path.exists():
        print(
            f"Nota: {private_path.name} não encontrado - "
            f"a usar {repo_path.name} (clone do GitHub / produção)."
        )
        return repo_path.resolve()
    raise FileNotFoundError(
        "Nenhum HTML de currículo encontrado. Esperado "
        f"{private_path.name} ou {repo_path.name} em {ROOT}"
    )


def repair_en_mojibake(en_source: Path) -> None:
    """Alguns editores gravam 'Fábio' como 'F?bio'. Corrige o ficheiro EN usado no render."""
    if not en_source.exists():
        return
    text = en_source.read_text(encoding="utf-8")
    if "F?bio" in text or "S?o Paulo" in text:
        text = text.replace("F?bio", "Fábio").replace("S?o Paulo", "São Paulo")
        en_source.write_text(text, encoding="utf-8")
        print(f"Repaired accents in {en_source.name} (UTF-8).")


DOCUMENT_TITLE = (
    "Fábio Monreal | Senior Multi-Cloud & Security Architect | MBA FIAP | "
    "Incident Commander & CISO Advisor | FinOps & Sovereign GenAI | SRE | "
    "Perito Judicial & Auditoria de TI (Due Diligence / M&A) | GRC/Compliance"
)

# Alinhado às meta keywords de index.html / index_en.html (produção).
KEYWORDS_PT = (
    "Fábio Monreal, Senior Multi-Cloud Architect, Principal Architect, Security Architect, "
    "Incident Commander, CISO Advisor, Founder, CISO, MBA FIAP, FinOps, Zero Trust, ZTNA, "
    "GRC, Compliance, TOGAF, Sovereign GenAI, IA Soberana, SaaS B2B, Justitia, "
    "Monreal Digital Intelligence, Inteligência Jurídica, Due Diligence M&A, Perícia Digital, "
    "Forense Digital, RAG, Multi-Agent AI, MLOps, n8n, modelos preditivos, OCR Forense, ICR, VLM, "
    "Serpro, GLEIF, Cadeia de Custódia, SHA-256, Isolamento Multi-tenant, DevSecOps, Zero-Touch, "
    "SRE, Observability, Zabbix, Datadog, Log Management, SOAR, Security Operations, "
    "controles SOC 2 TSC, ISO 27001, NIST CSF, CIS, Hetzner, Docker, Django, Next.js, "
    "PostgreSQL, Vector DB, Redis, Celery, Privacy by Design, LGPD, GDPR, DFIR, XDR, "
    "Perito Judicial, TJSP, TRT2, OAB/SP, Product Ownership, SEO Institucional, São Paulo, Brazil"
)

KEYWORDS_EN = (
    "Fábio Monreal, Senior Multi-Cloud Architect, Principal Architect, Security Architect, "
    "Incident Commander, CISO Advisor, Founder, CISO, MBA FIAP, FinOps, Zero Trust, ZTNA, "
    "GRC, Compliance, TOGAF, Sovereign GenAI, sovereign AI, SaaS B2B, "
    "Justitia, Monreal Digital Intelligence, legal intelligence, Due Diligence M&A, "
    "digital forensics, RAG, Multi-Agent AI, MLOps, n8n, predictive models, forensic OCR, ICR, VLM, "
    "Serpro, GLEIF, chain of custody, SHA-256, multi-tenant isolation, DevSecOps, Zero-Touch, "
    "SRE, Observability, Zabbix, Datadog, Log Management, SOAR, Security Operations, "
    "SOC 2 TSC controls, ISO 27001, NIST CSF, CIS, Hetzner, Docker, Django, Next.js, "
    "PostgreSQL, Vector DB, Redis, Celery, Privacy by Design, LGPD, GDPR, CCPA, Azure, AWS, OCI, "
    "DFIR, XDR, Court-Appointed Expert, OAB/SP, Product Ownership, institutional SEO, Brazil, resume"
)

TITLE_PERITO = (
    "Fábio Monreal | Perito Judicial TI e Forense Digital | TJSP | TRT2"
)

KEYWORDS_PERITO = (
    "perito judicial, perito em informática, perícia forense digital, laudo pericial, "
    "prova digital, assistente técnico, Due Diligence TI, M&A, TJSP, TRT2, "
    "curriculo Lattes, CNPq, cadeia de custódia, SHA-256, OCR forense, laudo assistido, "
    "chancela humana, IA Soberana, Justitia, justit.ia.br, Monreal Digital Intelligence, n8n, "
    "modelos preditivos, OCR forense, ICR, VLM, Serpro, GLEIF, diários oficiais, "
    "Privacy by Design, Zero Trust, isolamento multi-tenant, Hetzner, Zabbix, Datadog, "
    "controles SOC 2 TSC, ISO 27001, CPP art. 158-A, ISO 27037, OAB/SP, Direito Digital, "
    "Privacidade, LGPD, GDPR, DFIR, São Paulo"
)

# Limites da busca binária (Playwright aceita scale em (0, 2]; na prática usamos ≤ 1)
DEFAULT_SCALE_MIN = 0.70
DEFAULT_SCALE_MAX = 1.0
DEFAULT_MAX_PAGES = 2
BINARY_SEARCH_ITERATIONS = 14


async def _wait_fonts_ready(page) -> None:
    """Aguarda fontes estáveis antes de gerar o PDF (evita reflow mid-render)."""
    try:
        await page.evaluate("document.fonts.ready")
    except Exception:
        pass


async def _page_count_after_pdf(
    page, html_url: str, scratch: Path, scale: float
) -> int:
    await page.goto(html_url, wait_until="networkidle")
    await _wait_fonts_ready(page)
    await page.pdf(
        path=str(scratch),
        format="A4",
        print_background=True,
        scale=scale,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        prefer_css_page_size=True,
    )
    return len(PdfReader(str(scratch)).pages)


async def find_max_fit_scale(
    html_path: Path,
    *,
    max_pages: int = DEFAULT_MAX_PAGES,
    scale_min: float = DEFAULT_SCALE_MIN,
    scale_max: float = DEFAULT_SCALE_MAX,
    iterations: int = BINARY_SEARCH_ITERATIONS,
) -> float:
    """
    Maior `scale` em [scale_min, scale_max] para o qual o PDF gerado tem <= max_pages.
    Se já couber em scale_max, devolve scale_max.
    """
    html_url = file_url(html_path)
    scratch = ROOT / SCRATCH_NAME

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        pages_at_max = await _page_count_after_pdf(page, html_url, scratch, scale_max)
        if pages_at_max <= max_pages:
            await browser.close()
            return scale_max

        pages_at_min = await _page_count_after_pdf(page, html_url, scratch, scale_min)
        if pages_at_min > max_pages:
            await browser.close()
            raise RuntimeError(
                f"Conteúdo de {html_path.name} não cabe em {max_pages} página(s) A4 "
                f"mesmo com scale={scale_min}. Enxugue texto ou ajuste print.css."
            )

        low, high = scale_min, scale_max
        for _ in range(iterations):
            mid = (low + high) / 2.0
            n = await _page_count_after_pdf(page, html_url, scratch, mid)
            if n <= max_pages:
                low = mid
            else:
                high = mid

        await browser.close()
        return round(low, 4)


async def generate_pdf(
    html_path: str,
    pdf_path: str,
    metadata: dict,
    *,
    scale: float,
    max_pages: int = DEFAULT_MAX_PAGES,
) -> None:
    print(f"Generating PDF for {html_path} -> {pdf_path} (scale={scale}, max_pages={max_pages})")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(file_url(Path(html_path)), wait_until="networkidle")
        await _wait_fonts_ready(page)
        # Margem de segurança: se o scale ótimo ainda estourar, reduz até caber.
        current = scale
        for _ in range(8):
            await page.pdf(
                path=pdf_path,
                format="A4",
                print_background=True,
                scale=current,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
                prefer_css_page_size=True,
            )
            pages_now = len(PdfReader(pdf_path).pages)
            if pages_now <= max_pages:
                scale = current
                break
            current = round(max(DEFAULT_SCALE_MIN, current - 0.03), 4)
        else:
            scale = current
        await browser.close()

    print(f"Adding metadata to {pdf_path} (final scale={scale})")
    reader = PdfReader(pdf_path)
    writer = PdfWriter()
    for pg in reader.pages:
        writer.add_page(pg)

    writer.add_metadata(
        {
            "/Title": metadata.get("title", ""),
            "/Author": metadata.get("author", "Fábio Monreal"),
            "/Subject": metadata.get("subject", ""),
            "/Keywords": metadata.get("keywords", ""),
        }
    )

    with open(pdf_path, "wb") as f_out:
        writer.write(f_out)

    verify = PdfReader(pdf_path)
    pages = len(verify.pages)
    print(f"  Page count: {pages}")
    if pages > max_pages:
        print(
            f"  WARNING: expected at most {max_pages} pages "
            f"for ATS executive layout (got {pages})."
        )


async def main() -> None:
    pt_src = resolve_cv_html(HTML_PT_PRIVATE, HTML_PT_REPO)
    en_src = resolve_cv_html(HTML_EN_PRIVATE, HTML_EN_REPO)
    repair_en_mojibake(en_src)

    title_line = DOCUMENT_TITLE

    scale_pt = await find_max_fit_scale(pt_src)
    print(f"Optimal scale (PT, {pt_src.name}): {scale_pt}")

    scale_en = await find_max_fit_scale(en_src)
    print(f"Optimal scale (EN, {en_src.name}): {scale_en}")

    subj_pt = "Currículo Executivo - Fábio Monreal"
    subj_en = "Executive Resume - Fábio Monreal"
    if pt_src.name == "index_private.html":
        subj_pt += " - copia local (_private)"
    if en_src.name == "index_en_private.html":
        subj_en += " - local copy (_private)"

    await generate_pdf(
        str(pt_src),
        str(ROOT / "Fabio_Monreal_CV_PT.pdf"),
        {
            "title": title_line,
            "subject": subj_pt,
            "keywords": KEYWORDS_PT,
        },
        scale=scale_pt,
    )

    await generate_pdf(
        str(en_src),
        str(ROOT / "Fabio_Monreal_CV_EN.pdf"),
        {
            "title": title_line,
            "subject": subj_en,
            "keywords": KEYWORDS_EN,
        },
        scale=scale_en,
    )

    if not HTML_PERITO.exists() and not HTML_PERITO_PRIVATE.exists():
        print(f"Nota: perito omitido - {HTML_PERITO.name} não encontrado.")
    else:
        perito_src = resolve_cv_html(HTML_PERITO_PRIVATE, HTML_PERITO)
        scale_perito = await find_max_fit_scale(perito_src, max_pages=1)
        print(f"Optimal scale (Perito, {perito_src.name}): {scale_perito}")

        await generate_pdf(
            str(perito_src),
            str(ROOT / "sobre" / "Fabio_Monreal_Perito.pdf"),
            {
                "title": TITLE_PERITO,
                "subject": "Currículo Perito Judicial - Fábio Monreal",
                "keywords": KEYWORDS_PERITO,
                "author": "Fábio Monreal",
            },
            scale=scale_perito,
            max_pages=1,
        )


if __name__ == "__main__":
    asyncio.run(main())
