import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const site = process.env.PUBLIC_SITE_URL ?? "https://fabiomonreal.com";

export default defineConfig({
  site,
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
