import type { CollectionEntry } from "astro:content";
import type { LocalePair } from "./locale-switch";
import {
  articleJsonLd,
  findTranslationPartner,
  hreflangAlternates,
  ogLocaleAlternate,
  postPublicPath,
  xDefaultCanonical,
  type PostLang
} from "./posts";

export type PostPageContext = {
  schema: ReturnType<typeof articleJsonLd>;
  hreflangAlternates: { hreflang: string; href: string }[] | undefined;
  xDefaultHref: string | undefined;
  ogLocaleAlternate: string | undefined;
  translationLink: { href: string; label: string } | undefined;
  localePair: LocalePair;
};

/** Shared SEO + locale switch data for PT/EN article routes. */
export function buildPostPageContext(
  post: CollectionEntry<"posts">,
  allPosts: CollectionEntry<"posts">[],
  pageLang: PostLang
): PostPageContext {
  const partner = findTranslationPartner(post, allPosts);
  const hrefs = hreflangAlternates(post, partner);

  const translationLink = partner
    ? {
        href: postPublicPath(partner),
        label: partner.data.lang === "en-US" ? "Read in English" : "Ler em português"
      }
    : undefined;

  const localePair: LocalePair = partner
    ? {
        ptPath: postPublicPath(post.data.lang === "pt-BR" ? post : partner),
        enPath: postPublicPath(post.data.lang === "en-US" ? post : partner)
      }
    : pageLang === "pt-BR"
      ? { ptPath: postPublicPath(post), enPath: "/en/posts/" }
      : { ptPath: "/posts/", enPath: postPublicPath(post) };

  return {
    schema: articleJsonLd(post),
    hreflangAlternates: hrefs.length ? hrefs : undefined,
    xDefaultHref: partner ? xDefaultCanonical(post, partner) : undefined,
    ogLocaleAlternate: ogLocaleAlternate(post, partner),
    translationLink,
    localePair
  };
}
