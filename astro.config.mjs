import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const site = process.env.PUBLIC_SITE_URL ?? "https://fabiomonreal.com";

// Vite dev/preview: serve index.html de pastas em public/ com URL limpa (como cleanUrls na Vercel).
function staticCleanUrlsPlugin() {
  const rewrites = new Map([
    ["/resumo/pt", "/resumo/pt/index.html"],
    ["/resumo/en", "/resumo/en/index.html"],
    ["/perito", "/resumo/pt/perito/index.html"]
  ]);

  function attach(server) {
    server.middlewares.use((req, _res, next) => {
      const raw = req.url ?? "/";
      const [pathname, search = ""] = raw.split("?");
      const suffix = search ? `?${search}` : "";
      const normalized = pathname.endsWith("/") && pathname.length > 1
        ? pathname.slice(0, -1)
        : pathname;
      const target = rewrites.get(normalized);

      if (target) {
        req.url = `${target}${suffix}`;
      }

      next();
    });
  }

  return {
    name: "static-clean-urls",
    configureServer: attach,
    configurePreviewServer: attach
  };
}

export default defineConfig({
  site,
  vite: {
    plugins: [staticCleanUrlsPlugin()]
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      customPages: [
        `${site}/resumo/pt/`,
        `${site}/resumo/en/`,
        `${site}/perito/`
      ],
      changefreq: "monthly",
      lastmod: new Date("2026-06-09"),
      filter: (page) => !page.includes("/resumo/pt/perito"),
      serialize(item) {
        if (item.url.endsWith("/perito/")) {
          item.priority = 0.8;
        }
        return item;
      }
    })
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
