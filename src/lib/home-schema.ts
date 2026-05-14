import { profile } from "./about-content";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_TITLE_EN, SITE_URL } from "./site";

const authorSameAs = [profile.linkedin, profile.github, profile.medium, profile.devto];

export function ptHomeWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: new URL("/", SITE_URL).href,
    description: SITE_DESCRIPTION,
    author: {
      "@type": "Person",
      name: profile.name,
      url: new URL("/sobre/", SITE_URL).href,
      sameAs: authorSameAs
    }
  };
}

export function enHomeWebsiteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE_EN,
    url: new URL("/en/", SITE_URL).href,
    description,
    author: {
      "@type": "Person",
      name: profile.name,
      url: new URL("/en/sobre/", SITE_URL).href,
      sameAs: authorSameAs
    }
  };
}
