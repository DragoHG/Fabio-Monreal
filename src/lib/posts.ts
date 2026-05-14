import type { CollectionEntry } from "astro:content";
import { absoluteUrl, SITE_URL } from "./site";

export type PostLang = "pt-BR" | "en-US";

export function postsByLang(posts: CollectionEntry<"posts">[], lang: PostLang) {
  return posts
    .filter((p) => p.data.lang === lang)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatPostDate(date: Date, lang: PostLang) {
  const locale = lang === "en-US" ? "en-US" : "pt-BR";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function postPublicPath(post: CollectionEntry<"posts">) {
  return post.data.lang === "en-US" ? `/en/posts/${post.id}/` : `/posts/${post.id}/`;
}

export function findTranslationPartner(
  post: CollectionEntry<"posts">,
  posts: CollectionEntry<"posts">[]
): CollectionEntry<"posts"> | undefined {
  const slug = post.data.translationSlug;
  if (!slug) return undefined;
  return posts.find((p) => p.id === slug);
}

export function hreflangAlternates(
  post: CollectionEntry<"posts">,
  partner: CollectionEntry<"posts"> | undefined
): { hreflang: string; href: string }[] {
  if (!partner) return [];
  return [
    { hreflang: "pt-BR", href: post.data.lang === "pt-BR" ? post.data.canonicalURL : partner.data.canonicalURL },
    { hreflang: "en-US", href: post.data.lang === "en-US" ? post.data.canonicalURL : partner.data.canonicalURL }
  ];
}

/** For PT+EN pairs, x-default targets the English URL (editorial default). */
export function xDefaultCanonical(
  post: CollectionEntry<"posts">,
  partner: CollectionEntry<"posts"> | undefined
): string {
  if (!partner) return post.data.canonicalURL;
  return partner.data.lang === "en-US" ? partner.data.canonicalURL : post.data.canonicalURL;
}

export function ogLocaleAlternate(post: CollectionEntry<"posts">, partner: CollectionEntry<"posts"> | undefined) {
  if (!partner) return undefined;
  return post.data.lang === "pt-BR" ? "en_US" : "pt_BR";
}

export function articleSchemaImage(post: CollectionEntry<"posts">) {
  const url = absoluteUrl(post.data.ogImage);
  const w = post.data.ogImageWidth;
  const h = post.data.ogImageHeight;
  const caption = post.data.ogImageAlt ?? post.data.title;
  if (w != null && h != null) {
    return {
      "@type": "ImageObject",
      url,
      width: w,
      height: h,
      caption
    };
  }
  return url;
}

export function articleJsonLd(post: CollectionEntry<"posts">) {
  const inLanguage = post.data.lang;
  const syndication = post.data.syndicationOf;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.date.toISOString(),
    url: post.data.canonicalURL,
    image: articleSchemaImage(post),
    inLanguage,
    author: {
      "@type": "Person",
      name: "Fábio Monreal",
      url: new URL("/sobre/", SITE_URL).href
    },
    publisher: {
      "@type": "Person",
      name: "Fábio Monreal",
      url: new URL("/sobre/", SITE_URL).href
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.data.canonicalURL
    },
    ...(syndication
      ? {
          isBasedOn: {
            "@type": "CreativeWork",
            url: syndication
          }
        }
      : {})
  };
}
