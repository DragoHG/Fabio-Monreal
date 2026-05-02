"""
Gera PDFs A4 (1 página) a partir dos HTML do currículo.
A escala é descoberta automaticamente (maior scale possível que ainda cabe em 1 página).
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
            f"Nota: {private_path.name} não encontrado — "
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
    "Fábio Monreal | Multi-Cloud & Security Architect | IC | CISO | FinOps"
)

# Alinhado às meta keywords de index.html / index_en.html (produção).
KEYWORDS_PT = (
    "Fábio Monreal, Senior Multi-Cloud Architect, Security Architect, Incident Commander, "
    "CISO Advisor, FinOps, Sovereign GenAI, MLOps, System Design, SRE, Multi-Cloud Architecture, "
    "Cyber Resilience, Data Security, AI Governance, LGPD, GDPR, Zero Trust, Azure, AWS, "
    "Microsoft Sentinel, Microsoft Purview, Zero Data Leakage, DFIR, XDR, EDR, DPO, Threat Hunting, "
    "São Paulo, Brasil curriculo"
)

KEYWORDS_EN = (
    "Fábio Monreal, Senior Multi-Cloud Architect, Security Architect, Incident Commander, "
    "CISO Advisor, FinOps, Sovereign GenAI, MLOps, System Design, SRE, Multi-Cloud, Cyber Resilience, "
    "Data Security, AI Governance, LGPD, GDPR, CCPA, Zero Trust, Azure, AWS, Sentinel, Purview, "
    "DFIR, XDR, Threat Hunting, DPO, Brazil, resume"
)

# Limites da busca binária (Playwright aceita scale em (0, 2]; na prática usamos ≤ 1)
DEFAULT_SCALE_MIN = 0.70
DEFAULT_SCALE_MAX = 1.0
BINARY_SEARCH_ITERATIONS = 14


async def _page_count_after_pdf(
    page, html_url: str, scratch: Path, scale: float
) -> int:
    await page.goto(html_url, wait_until="networkidle")
    await page.pdf(
        path=str(scratch),
        format="A4",
        print_background=True,
        scale=scale,
    )
    return len(PdfReader(str(scratch)).pages)


async def find_max_single_page_scale(
    html_path: Path,
    *,
    scale_min: float = DEFAULT_SCALE_MIN,
    scale_max: float = DEFAULT_SCALE_MAX,
    iterations: int = BINARY_SEARCH_ITERATIONS,
) -> float:
    """
    Maior `scale` em [scale_min, scale_max] para o qual o PDF gerado tem exatamente 1 página.
    Se já couber em scale_max, devolve scale_max.
    """
    html_url = file_url(html_path)
    scratch = ROOT / SCRATCH_NAME

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        pages_at_max = await _page_count_after_pdf(page, html_url, scratch, scale_max)
        if pages_at_max <= 1:
            await browser.close()
            return scale_max

        pages_at_min = await _page_count_after_pdf(page, html_url, scratch, scale_min)
        if pages_at_min > 1:
            await browser.close()
            raise RuntimeError(
                f"Conteúdo de {html_path.name} não cabe em 1 página A4 mesmo com scale={scale_min}. "
                "Enxugue texto ou aumente espaço (print.css menos denso)."
            )

        low, high = scale_min, scale_max
        for _ in range(iterations):
            mid = (low + high) / 2.0
            n = await _page_count_after_pdf(page, html_url, scratch, mid)
            if n <= 1:
                low = mid
            else:
                high = mid

        await browser.close()
        return round(low, 4)


async def generate_pdf(html_path: str, pdf_path: str, metadata: dict, *, scale: float) -> None:
    print(f"Generating PDF for {html_path} -> {pdf_path} (scale={scale})")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(file_url(Path(html_path)), wait_until="networkidle")
        await page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            scale=scale,
        )
        await browser.close()

    print(f"Adding metadata to {pdf_path}")
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
    if pages != 1:
        print("  WARNING: expected exactly 1 page for ATS one-pager layout.")


async def main() -> None:
    pt_src = resolve_cv_html(HTML_PT_PRIVATE, HTML_PT_REPO)
    en_src = resolve_cv_html(HTML_EN_PRIVATE, HTML_EN_REPO)
    repair_en_mojibake(en_src)

    title_line = DOCUMENT_TITLE

    scale_pt = await find_max_single_page_scale(pt_src)
    print(f"Optimal scale (PT, {pt_src.name}): {scale_pt}")

    scale_en = await find_max_single_page_scale(en_src)
    print(f"Optimal scale (EN, {en_src.name}): {scale_en}")

    subj_pt = "Currículo Executivo - Fábio Monreal"
    subj_en = "Executive Resume - Fábio Monreal"
    if pt_src.name == "index_private.html":
        subj_pt += " — cópia local (_private)"
    if en_src.name == "index_en_private.html":
        subj_en += " — local copy (_private)"

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


if __name__ == "__main__":
    asyncio.run(main())
