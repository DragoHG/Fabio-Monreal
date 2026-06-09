import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const tmp = os.tmpdir();

function readMain(relPath) {
  return execFileSync("git", ["show", `main:${relPath}`], {
    cwd: root,
    encoding: "utf8"
  });
}

function mainIndexToSobre(html) {
  return html
    .replaceAll("./assets/", "../public/assets/")
    .replaceAll("https://fabio-monreal.vercel.app/en", "https://fabiomonreal.com/en/")
    .replaceAll("https://fabio-monreal.vercel.app/", "https://fabiomonreal.com/")
    .replace('href="/en"', 'href="/en/"');
}

function mainPeritoToDev(html) {
  return html
    .replaceAll("https://fabio-monreal.vercel.app/perito/", "https://fabiomonreal.com/perito/")
    .replaceAll("https://fabio-monreal.vercel.app/", "https://fabiomonreal.com/resumo/pt/");
}

const mainIndex = readMain("index.html");
const mainPerito = readMain("sobre/Fabio_Monreal_Perito.html");

fs.writeFileSync(path.join(root, "sobre", "index.html"), mainIndexToSobre(mainIndex));
fs.writeFileSync(
  path.join(root, "sobre", "Fabio_Monreal_Perito.html"),
  mainPeritoToDev(mainPerito)
);

console.log("OK: sobre/index.html + sobre/Fabio_Monreal_Perito.html from main");
