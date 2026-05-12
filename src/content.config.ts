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
    keywords: z.array(z.string().min(2)).min(1)
  })
});

export const collections = { posts };
