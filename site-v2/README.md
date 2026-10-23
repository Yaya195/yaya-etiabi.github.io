# Research Website V2 — Astro

This is the new static research website for Yaya Etiabi, developed **alongside** the existing Jekyll production site.

**Status:** implementation branch / review. The official website is still published from `yaya-etiabi/yaya-etiabi.github.io` and has not been replaced.

## Requirements

Node.js 22 or newer and npm.

## Local development

```sh
cd site-v2
npm ci
npm run dev
```

## Static production build

```sh
SITE_URL=https://yaya-etiabi.github.io BASE_PATH=/ npm run build
npm run test:links
```

GitHub Pages only receives files from `dist/`, not a running Node server.

### Fork subpath preview

A fork is a **project site**, not an organization-root site. To verify asset and navigation prefixes:

```sh
SITE_URL=https://Yaya195.github.io BASE_PATH=/yaya-etiabi.github.io/ npm run build
BASE_PATH=/yaya-etiabi.github.io/ npm run test:links
```

The fork preview is tagged `noindex,nofollow`; the official organization-root build is indexable.

## Content maintenance

- `src/content/projects/*.md` — technical case studies with validated status, tags and optional paper/code links
- `src/content/publications/*.md` — bibliographic data with DOI links and legacy slugs
- `src/content/blog/*.md` — dated essays and technical notes with category and optional old Jekyll post slug. New posts appear automatically on `/blog/` and `/blog/<slug>/`; retired `/posts/<legacySlug>/` URLs redirect only for revised, migrated articles.
- `src/content.config.ts` — schemas checked at build time
- `src/pages/` — page templates and static URL generation
- `src/styles/global.css` — accessible global design system
- `src/lib/site.ts` — shared profile links and base-path URL helper

Most content is plain Markdown plus YAML frontmatter. No backend database or runtime API is required.

## Deployment safety

The CI workflow at `../.github/workflows/site-v2-ci.yml` deliberately **does not deploy**. It checks two static builds. The release-ready `../.github/workflows/jekyll.yml` builds Astro but deploys only when this branch has been explicitly merged into `master` in the canonical organization repository. See `../docs/v2/PRODUCTION_RELEASE_CHECKLIST.md` for the release and rollback plan.

## Current limitations

- Publications have been reconciled against the 11 BibTeX entries supplied for this release, including one clearly marked preprint.
- Research-in-progress pages intentionally have no invented code links or accepted-paper claims.
- No PDF CV is published. Historical CV and résumé routes lead to About.
- A profile portrait and selected historical photos are included; Contact deliberately directs visitors to professional profiles.
- A dependency lockfile still needs to be generated from a real npm ci and committed prior to production release.

See `../docs/v2/` for the migration plan.

## Preview deployment note

The fork-only workflow generates a static `gh-pages` preview without modifying the canonical organization site. Its previews are tagged `noindex,nofollow`. The old direct-deploy preview workflow remains restricted to the fork and is not triggered on pushes.
