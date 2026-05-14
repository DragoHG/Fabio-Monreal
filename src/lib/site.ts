export const SITE_URL =
  import.meta.env.PUBLIC_SITE_URL ?? "https://fabiomonreal.com";

export const SITE_NAME = "Fábio Monreal";
export const SITE_TITLE =
  "Fábio Monreal | Hub de Autoridade Técnica em Cloud, Segurança e FinOps";
export const SITE_DESCRIPTION =
  "Arquitetura multi-cloud, segurança, FinOps, SRE e GenAI soberana em publicações técnicas, casos de alto impacto e visão executiva.";
export const DEFAULT_OG_IMAGE = "/images/og/home.png";

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path, SITE_URL).toString();
}
