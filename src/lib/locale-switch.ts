export type SiteLang = "pt-BR" | "en-US";

export type LocalePair = { ptPath: string; enPath: string };

function withSlash(path: string): string {
  if (path === "/" || path === "") return "/";
  if (path === "/en" || path === "/en/") return "/en/";
  if (!path.endsWith("/")) return `${path}/`;
  return path;
}

function norm(pathname: string): string {
  let p = pathname || "/";
  if (p !== "/" && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

/** Exact pathname (normalized) → locale pair when browsing in English. */
const enExact: Record<string, LocalePair> = {
  "/en": { ptPath: "/", enPath: "/en/" },
  "/en/posts": { ptPath: "/posts/", enPath: "/en/posts/" },
  "/en/sobre": { ptPath: "/sobre/", enPath: "/en/sobre/" }
};

/** Exact pathname (normalized) → locale pair when browsing in Portuguese. */
const ptExact: Record<string, LocalePair> = {
  "/": { ptPath: "/", enPath: "/en/" },
  "/posts": { ptPath: "/posts/", enPath: "/en/posts/" },
  "/sobre": { ptPath: "/sobre/", enPath: "/en/sobre/" }
};

/**
 * Default PT/EN paths for the header language toggle when no `explicit` pair
 * is passed (translated posts pass `explicit` from the post page helper).
 */
export function defaultLocalePair(pathname: string, lang: SiteLang): LocalePair {
  const p = norm(pathname);

  if (lang === "en-US") {
    const hit = enExact[p];
    if (hit) return hit;
    if (p.startsWith("/en/posts/")) {
      return { ptPath: "/posts/", enPath: withSlash(pathname === "/" ? "/en/" : pathname) };
    }
    return { ptPath: "/", enPath: "/en/" };
  }

  const ptHit = ptExact[p];
  if (ptHit) return ptHit;
  if (p.startsWith("/posts/")) {
    return {
      ptPath: withSlash(pathname.endsWith("/") ? pathname : `${pathname}/`),
      enPath: "/en/posts/"
    };
  }
  return { ptPath: "/", enPath: "/en/" };
}

export function resolveLocalePair(
  pathname: string,
  lang: SiteLang,
  explicit?: LocalePair
): LocalePair {
  if (explicit) {
    return { ptPath: withSlash(explicit.ptPath), enPath: withSlash(explicit.enPath) };
  }
  const d = defaultLocalePair(pathname, lang);
  return { ptPath: withSlash(d.ptPath), enPath: withSlash(d.enPath) };
}
