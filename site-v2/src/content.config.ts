import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['Published', 'Under Review', 'Research in Progress', 'Open Source']),
    period: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    sortOrder: z.number().default(99),
    paperUrl: z.string().url().optional(),
    paperType: z.enum(['Publication', 'Preprint']).optional(),
    codeUrl: z.string().url().optional(),
  }),
});

const publications = defineCollection({
  loader: glob({ base: './src/content/publications', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number().int().min(1990).max(2100),
    venue: z.string(),
    kind: z.enum(['Journal', 'Conference', 'Preprint']),
    doi: z.string().optional(),
    url: z.string().url().optional(),
    featured: z.boolean().default(false),
    legacySlug: z.string().optional(),
    project: z.string().optional(),
  }),
});

export const collections = { projects, publications };
