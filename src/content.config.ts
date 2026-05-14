import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  loader: glob({ base: "./content/posts", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(40).max(180),
    date: z.coerce.date(),
    canonicalURL: z.string().url(),
    ogImage: z.string().min(1),
    keywords: z.array(z.string().min(2)).min(1),
    lang: z.enum(["pt-BR", "en-US"]),
    /** Other entry id: Markdown stem without extension (e.g. `tempest-attack-seeing-through-walls`). */
    translationSlug: z.string().min(2).optional(),
    /** OG / hero image alt text (SEO and accessibility). */
    ogImageAlt: z.string().min(10).max(200).optional(),
    ogImageWidth: z.number().int().positive().optional(),
    ogImageHeight: z.number().int().positive().optional(),
    /** Original publication URL when syndicating (e.g. LinkedIn). */
    syndicationOf: z.string().url().optional()
  })
});

export const collections = { posts };
