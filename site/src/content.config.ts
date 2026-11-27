import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		// `date` and `author` are already set in page frontmatter; declaring them
		// keeps them on entry.data so the homepage can list the newest pages.
		schema: docsSchema({
			extend: z.object({
				date: z.coerce.date().optional(),
				author: z.string().optional(),
			}),
		}),
	}),
};
