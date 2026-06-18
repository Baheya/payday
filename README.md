# payday

A personal project built to explore modern Astro patterns, native web platform APIs, and collaborative development workflows. This is still a work in progress.

## What it is

Payday is a web application for managing payroll-related data, built as an exploration of several newer browser and framework capabilities — including Astro Actions, Web Components via the Form Associated Custom Elements (FACE) API, and server-side authentication and data modeling with Supabase.

## Tech stack

- **[Astro](https://astro.build/)** — server-side rendering with the Netlify adapter
- **[Supabase](https://supabase.com/)** — authentication, database, and auto-generated TypeScript types via `supabase gen types`
- **[hCaptcha](https://www.hcaptcha.com/)** — bot protection on forms
- **[MiniSearch](https://lucaong.github.io/minisearch/)** — server-side full-text search
- **[unpic](https://unpic.pics/)** — optimized image handling
- **[PostCSS](https://postcss.org/)** with `postcss-preset-env` and custom media queries

## Notable technical decisions

**Web Components & Form Associated Custom Elements**
Custom form controls are implemented as native Web Components using the FACE API, allowing them to participate in standard HTML form submission and validation without a framework dependency.

**Astro Actions**
Server-side mutations are handled via Astro Actions, keeping data fetching and form handling close to the framework rather than reaching for a separate API layer.

**Server-side search**
Search is implemented server-side using MiniSearch as an exercise in understanding the tradeoffs — in a production application, this would be moved client-side or delegated to a dedicated search service like Algolia.

**Type-safe database layer**
Supabase types are generated directly from the database schema and piped through `supazod` to produce Zod schemas, giving end-to-end type safety from the database to the UI.

## Developer tooling

This project is configured as if intended for a collaborative team, with conventions enforced automatically:

- **ESLint** — linting for TypeScript, Astro, accessibility (jsx-a11y), browser compatibility (eslint-plugin-compat), and import ordering (perfectionist)
- **Stylelint** — CSS linting with clean property ordering and unsupported browser feature warnings
- **Prettier** — consistent formatting across `.ts`, `.astro`, and `.css` files
- **Browserslist** — defines the browser targets used by PostCSS and the compat linting plugins
- **Husky + lint-staged** — pre-commit hooks ensure code is formatted and linted before every commit
- **Vitest** — unit tests, with a separate browser test config via Playwright
