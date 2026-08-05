import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			/** Short title for <title>/OG when the display title is too long. */
			seoTitle: z.string().max(60).optional(),
			/** Short meta description (≤155 chars) when the excerpt is too long. */
			seoDescription: z.string().max(155).optional(),
			pubDate: z.coerce.date(),
			category: z.string().default("Therapy"),
			heroImage: image().optional(),
			heroImageAlt: z.string().optional(),
		}),
});

export const collections = { blog };
