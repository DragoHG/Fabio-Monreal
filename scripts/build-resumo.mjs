import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function patchPt(html) {
  let h = html.replaceAll("../public/assets/", "/assets/");
  h = h.replace(
    '<link href="https://fabiomonreal.com/" rel="canonical" />',
    '<link href="https://fabiomonreal.com/resumo/pt/" rel="canonical" />'
  );
  h = h.replace(
    '<meta content="https://fabiomonreal.com/" property="og:url" />',
    '<meta content="https://fabiomonreal.com/resumo/pt/" property="og:url" />'
  );
  h = h.replace(
    `<link href="https://fabiomonreal.com/"
          hreflang="pt-BR"
          rel="alternate" />`,
    `<link href="https://fabiomonreal.com/resumo/pt/"
          hreflang="pt-BR"
          rel="alternate" />`
  );
  h = h.replace(
    `<link href="https://fabiomonreal.com/en/"
          hreflang="en-US"
          rel="alternate" />`,
    `<link href="https://fabiomonreal.com/resumo/en/"
          hreflang="en-US"
          rel="alternate" />`
  );
  h = h.replace(
    `<link href="https://fabiomonreal.com/"
          hreflang="x-default"
          rel="alternate" />`,
    `<link href="https://fabiomonreal.com/resumo/en/"
          hreflang="x-default"
          rel="alternate" />`
  );
  h = h.replace('"url": "https://fabiomonreal.com/"', '"url": "https://fabiomonreal.com/resumo/pt/"');
  h = h.replace('href="/en/"', 'href="/resumo/en/"');
  return h;
}

function patchEn(html) {
  let h = html.replaceAll("../public/assets/", "/assets/");
  h = h.replace(
    `<link href="https://fabiomonreal.com/en/"
          rel="canonical" />`,
    `<link href="https://fabiomonreal.com/resumo/en/"
          rel="canonical" />`
  );
  h = h.replace(
    '<meta content="https://fabiomonreal.com/en/" property="og:url" />',
    '<meta content="https://fabiomonreal.com/resumo/en/" property="og:url" />'
  );
  h = h.replace(
    `<link href="https://fabiomonreal.com/"
          hreflang="pt-BR"
          rel="alternate" />`,
    `<link href="https://fabiomonreal.com/resumo/pt/"
          hreflang="pt-BR"
          rel="alternate" />`
  );
  h = h.replace(
    `<link href="https://fabiomonreal.com/en/"
          hreflang="en-US"
          rel="alternate" />`,
    `<link href="https://fabiomonreal.com/resumo/en/"
          hreflang="en-US"
          rel="alternate" />`
  );
  h = h.replace(
    `<link href="https://fabiomonreal.com/en/"
          hreflang="x-default"
          rel="alternate" />`,
    `<link href="https://fabiomonreal.com/resumo/en/"
          hreflang="x-default"
          rel="alternate" />`
  );
  h = h.replace('"url": "https://fabiomonreal.com/en/"', '"url": "https://fabiomonreal.com/resumo/en/"');
  h = h.replace('href="/"', 'href="/resumo/pt/"');
  return h;
}

const ptOut = path.join(root, "public", "resumo", "pt", "index.html");
const enOut = path.join(root, "public", "resumo", "en", "index.html");
fs.mkdirSync(path.dirname(ptOut), { recursive: true });
fs.mkdirSync(path.dirname(enOut), { recursive: true });

const ptSrc = fs.readFileSync(path.join(root, "sobre", "index.html"), "utf8");
const enSrc = fs.readFileSync(path.join(root, "sobre", "index_en.html"), "utf8");

fs.writeFileSync(ptOut, patchPt(ptSrc));
fs.writeFileSync(enOut, patchEn(enSrc));
console.log("OK:", ptOut, enOut);
