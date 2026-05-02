/**
 * Sitemap servido via Serverless para garantir Content-Type application/xml
 * e corpo XML válido (evita respostas estranhas na CDN/cache).
 * Edit LASTMOD ao atualizar o currículo com relevância SEO.
 */
const LASTMOD = "2026-05-01";

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- PT-BR root -->
  <url>
    <loc>https://fabio-monreal.vercel.app/</loc>
    <xhtml:link rel="alternate"
                hreflang="pt-BR"
                href="https://fabio-monreal.vercel.app/" />
    <xhtml:link rel="alternate"
                hreflang="en-US"
                href="https://fabio-monreal.vercel.app/en" />
    <xhtml:link rel="alternate"
                hreflang="x-default"
                href="https://fabio-monreal.vercel.app/" />
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- EN -->
  <url>
    <loc>https://fabio-monreal.vercel.app/en</loc>
    <xhtml:link rel="alternate"
                hreflang="pt-BR"
                href="https://fabio-monreal.vercel.app/" />
    <xhtml:link rel="alternate"
                hreflang="en-US"
                href="https://fabio-monreal.vercel.app/en" />
    <xhtml:link rel="alternate"
                hreflang="x-default"
                href="https://fabio-monreal.vercel.app/" />
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
  );
  res.status(200).send(XML);
};
