---
name: Shadcn Redesign
description: Full visual + UX redesign of the SmilesDrawer documentation site using shadcn/ui primitives and shadcnblocks.com block patterns, executed in this standalone repo before relocation into the main library monorepo
type: design
date: 2026-04-13
status: draft
---

# Shadcn Redesign — Design Spec

## Goal

Restyle the entire SmilesDrawer documentation/marketing website using shadcn/ui primitives and shadcnblocks.com block patterns, in a single feature branch, in this standalone repository. Visual and UX scope only — no relocation, no library swap, no content rewrites. Once the redesigned site is something the user is happy with, a separate follow-up effort will move the files into the `reymond-group/smilesDrawer` monorepo and switch the GitHub Pages publishing source.

## Non-Goals

The following are explicitly **out of scope** for this design and must not be smuggled in:

- Teal brand accent — the redesign starts on shadcn's neutral zinc palette. Brand color reintroduction is a follow-up decision after the user has lived with the neutral version.
- `next-themes` — Next-only library, not applicable to Astro. Dark mode keeps its current implementation.
- Switching SmilesDrawer from the CDN script to the `smiles-drawer` npm package. The CDN tag in `Layout.astro` stays exactly as-is. The package switch (and the version bump from 2.1.7 to 2.2.1) belongs to the future relocation PR, where path and dependency changes live together.
- Relocation into the smilesDrawer monorepo. No anticipatory directory restructuring, no `outDir` changes, no `base` path changes, no contributor-notes (`docs/internal/`) handling. All of that is a separate effort.
- New pages (pricing, blog, team, etc.). The site keeps its four pages: landing, playground, getting started, examples.
- Content rewrites. Copy stays as-is unless a section's structural change forces a small adjustment.
- Replacing `CodeBlock`'s vanilla copy button with a React version.
- Search / command palette (cmd+k).
- Analytics, telemetry, tracking.
- Storybook, component catalog, visual regression tests, Playwright, Chromatic.
- Performance budget targets beyond what Astro's defaults plus the islands discipline give for free.
- Accessibility audit beyond what shadcn primitives provide out of the box.

## Architectural Direction

The site stays Astro-first. The standard Astro islands architecture is exactly the right shape for shadcn adoption: static pages remain `.astro` files that ship zero JavaScript, and only the genuinely interactive components hydrate as React islands. Shadcn's CSS-variable token system means that `.astro` files and `.tsx` islands share one design system without duplication.

The redesign is **full adoption** rather than "shadcn-inspired without React" or a hybrid that only touches the playground. The reasoning: hand-maintaining a facsimile of shadcn primitives (without React) is a permanent maintenance tax, and the primitives that would need rebuilding (Slider, Dialog, Combobox) are exactly the ones hardest to get right at the accessibility level. Installing `@astrojs/react` and using shadcn primitives via the official CLI is the path with the least long-term drift.

## Stack Changes

The following dependencies and tools are added:

- `@astrojs/react` integration registered in `astro.config.mjs`
- `react`, `react-dom`, `@types/react`, `@types/react-dom`
- `npx shadcn@latest init` — generates `src/components/ui/`, `src/lib/utils.ts`, `components.json`, and patches `tailwind.config.mjs` and `src/styles/global.css` with shadcn's CSS-variable token scaffold
- Base palette: **zinc**. Selected because it reads cleanly against the green molecule SVGs and is shadcn's most common neutral default.
- `lucide-react` for icons inside React islands
- `astro-icon` plus `@iconify-json/lucide` for icons inside `.astro` files. The split exists so static pages don't pay a React runtime cost just to render an icon.
- Inter and JetBrains Mono fonts stay (Inter is what shadcn ships against by default).
- The SmilesDrawer CDN script in `Layout.astro` stays unchanged.

The following are removed:

- The custom accent color palette in `tailwind.config.mjs` (the `#50C5A9` teal).
- The `.btn-primary`, `.btn-secondary`, and `.card` utility classes in `src/styles/global.css`. Every usage in `.astro` files migrates to either a shadcn primitive or shadcn-token Tailwind markup (`bg-card border rounded-lg`, etc.).

The following primitives are added via the shadcn CLI: `button`, `slider`, `switch`, `radio-group`, `select`, `tabs`, `dropdown-menu`, `dialog`, `sheet`, `separator`, `label`, `input`, `card`, `table`, `tooltip`, `badge`, `command`, `combobox`, `scroll-area`, `sonner`.

## Theming and Dark Mode

Light and dark CSS variable sets live in `src/styles/global.css` under `:root` and `.dark`. The variables follow shadcn's standard convention: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`. The radius variable `--radius` is also set globally.

Dark mode keeps its current implementation. The inline flash-free init script in `Layout.astro` head reads from `localStorage` and adds `class="dark"` to `<html>` before the body renders. This is exactly what shadcn's components read, so no replacement is needed and `next-themes` is not installed.

`ThemeToggle.astro` is reskinned to a shadcn `Button variant="ghost" size="icon"` containing lucide `Sun` and `Moon` icons that swap based on the current class. Behavior — toggling the class on `<html>` and persisting to `localStorage` — is unchanged.

## Path Discipline

All asset URLs and internal links inside React island `.tsx` files must go through a `withBase(path)` helper exported from `src/lib/utils.ts`. The helper wraps `import.meta.env.BASE_URL` so that the current `/smiles-drawer-website` base path resolves correctly during dev, build, and the future relocation. Hardcoded leading-slash paths like `/playground` are banned inside `.tsx` files.

The discipline rule is intentionally narrow: it only applies to `.tsx` islands. Static `.astro` files continue to use whatever pattern they currently use, because they already work at the current base path and re-engineering them is unnecessary friction during a visual redesign.

## React Islands

React only ships to four places. Everywhere else is static `.astro` markup using shadcn token classes. The four islands:

1. **`HeroPlayground.tsx`** (`client:load`) — the right pane of the landing hero, wrapping an interactive SMILES input and live render. The left pane (copy + CTAs) stays static.
2. **`PlaygroundApp.tsx`** (`client:load`) — the entire playground page is a single island. Containing it as one island (rather than many small ones) means React loads once, state is co-located, and there is no inter-island prop plumbing.
3. **`InstallTabs.tsx`** (`client:visible`) — the install-method switcher on the Getting Started page. CDN / npm / React / Vue / Svelte panels, each rendering an existing CodeBlock. `client:visible` because it sits below the fold.
4. **`ExamplesFilter.tsx`** (`client:load`) — the filter toolbar on the Examples page (category Tabs + theme Select + name/SMILES Input search). Filter state is mirrored to URL query params for shareability. The card grid itself stays static — only the toolbar is interactive.

Every island that touches SmilesDrawer uses a shared `useSmilesDrawer()` hook that polls `window.SmilesDrawer` on mount until it is defined, then resolves. The hook is small (under 20 lines) and well-isolated. It exists because the CDN script may not have finished loading by the time an island mounts, and it disappears in the future relocation PR when the npm package switch happens.

All SmilesDrawer rendering calls (whether in islands or in inline `.astro` scripts) happen inside `useEffect` (for React) or DOM-ready callbacks (for `.astro`), because rendering writes to the DOM. No SSR-time rendering of molecules.

## Per-Page Block Mapping

### Global chrome (every page)

`Header.astro` adopts a Navbar block pattern: logo mark, primary nav links, GitHub link, `ThemeToggle`, and an "Open Playground" CTA. Pure `.astro`, lucide icons via astro-icon.

`Footer.astro` adopts a simple Footer block pattern: columns for links, repo, license, credits. Pure `.astro`.

### `index.astro` — Landing

| Section | Block pattern | Primitives | Island? |
|---|---|---|---|
| Hero | Split hero (copy left, live demo right) | Button, Badge | Right pane is `HeroPlayground` React island; left pane static |
| Why SmilesDrawer comparison | Feature comparison | Table, Badge, Card | Static — Table-styled markup |
| Feature grid | Three-column Feature block with icons | Card | Static — lucide icons via astro-icon |
| Molecule showcase | Gallery block | Card, Badge | Static — molecules render via existing inline scripts |
| CTA | CTA block | Button | Static |

### `playground.astro` — the big rebuild

The whole page is a single React island, `<PlaygroundApp client:load />`. Layout: shell with a left sidebar (the controls) and a main pane (preview + outputs).

Sidebar controls:
- `Slider` for: bond thickness, bond length, font size weight, padding, compact drawing factor
- `Switch` for: terminal carbons, explicit hydrogens, debug, compact drawing
- `RadioGroup` for: theme (light, dark, oldschool, matrix, github, custom)
- `Select` for: atom visualization mode, weight type
- `Combobox` for the preset molecule picker (replacing the current plain `<select>`)
- `Label`, `Separator`, `Tooltip` (for option help text), `ScrollArea` (sidebar overflow)
- `Sheet` on mobile so the sidebar collapses into a slide-over with a Button trigger in the header

Main pane:
- `Tabs` with three views: Preview (rendered SVG), SVG source (CodeBlock with copy), Share URL (the `?smiles=` query string with copy)
- Top-right action cluster: Button "Reset", Button "Copy SMILES", DropdownMenu "Export" with SVG / PNG / Copy link options
- `sonner` toasts for "Copied" / "Exported" feedback
- `Input` for the SMILES editor with an inline validation Badge (valid / invalid)

The existing URL `?smiles=` sharing behavior is preserved.

### `getting-started.astro` — Docs

| Section | Block pattern | Primitives | Island? |
|---|---|---|---|
| Docs hero | Compact hero | Badge | Static |
| Install methods | Tabs section | Tabs | Small island: `<InstallTabs client:visible />` |
| Long-form sections (Atom Highlighting, Reaction Weights, Web Components, API Reference) | Long-form docs | Card, Separator, Badge | Static, with a sticky in-page TOC nav on the left at `lg:` breakpoint |
| `CodeBlock.astro` | Restyled to match shadcn aesthetic | — | Static, vanilla copy button stays |

### `examples.astro` — Gallery

| Section | Block pattern | Primitives | Island? |
|---|---|---|---|
| Filter bar | Toolbar | Tabs (category) + Select (theme) + Input (name/SMILES search) | Small island: `<ExamplesFilter client:load />` |
| Gallery grid | Gallery block | Card, Badge, Button | Static cards rendered from `molecules.js` |
| Card actions | "Open in playground", "Download SVG", "Copy SMILES" | Button, DropdownMenu | Vanilla JS handlers, no React per card |

`MoleculeCard.astro` is restyled to use shadcn's `Card` primitive markup.

## Migration Order

Single feature branch `shadcn-redesign`, merged to `master` once the whole site looks right.

1. **Branch and scaffold.** Create the branch. Install `@astrojs/react`, `react`, `react-dom`, type packages, `lucide-react`, `astro-icon`, `@iconify-json/lucide`. Run `npx shadcn@latest init` (zinc, CSS variables, `src/components/ui/`).
2. **Tokens.** Replace the custom palette in `tailwind.config.mjs`. Write the light and dark CSS variable sets in `global.css`. Remove `.btn-primary`, `.btn-secondary`, `.card` utility classes. Smoke test: `npm run dev`, verify the site loads. It will look broken — that is expected.
3. **Add primitives.** Run the shadcn CLI to add: `button slider switch radio-group select tabs dropdown-menu dialog sheet separator label input card table tooltip badge command combobox scroll-area sonner`.
4. **Reskin global chrome.** Update `Header.astro`, `Footer.astro`, `ThemeToggle.astro`. Verify the dark mode toggle still works flash-free across hard reloads.
5. **Add `withBase` and `useSmilesDrawer`.** Create `src/lib/utils.ts` with the `withBase()` helper. Create `src/lib/use-smiles-drawer.ts` with the polling hook. Add the `Window.SmilesDrawer` ambient declaration to `src/env.d.ts`.
6. **Restyle landing.** Section by section in `index.astro`. Build the `HeroPlayground` React island last so the visual layout settles first.
7. **Rebuild playground.** The biggest single chunk. Build `PlaygroundApp.tsx` as one island with the full sidebar, preview, exports, and mobile sheet. Preserve URL `?smiles=` sharing.
8. **Restyle getting started.** Convert the install switcher to `InstallTabs.tsx`. Rest stays static.
9. **Restyle examples.** Convert the filter bar to `ExamplesFilter.tsx`. Cards stay static.
10. **Visual QA pass.** Light and dark, mobile and desktop, every page. Run `npm run build && npm run preview` to verify the `/smiles-drawer-website` base path works in production mode.
11. **Single squash-merge to `master`.**

## Risks and Gotchas

1. **GitHub Pages base path.** The current base path is `/smiles-drawer-website`. Asset URLs and internal links from React islands must use `import.meta.env.BASE_URL`, never hardcoded `/`. Mitigation: the `withBase()` helper rule, applied uniformly inside `.tsx` files.

2. **CDN script timing.** SmilesDrawer is loaded as a global from unpkg. React islands that touch it must wait for `window.SmilesDrawer` to be defined. Mitigation: the `useSmilesDrawer()` hook polls on mount and resolves once the global appears. All rendering calls go inside `useEffect`.

3. **Dark mode flash.** The inline init script in `Layout.astro` head must not be removed or replaced. Shadcn reads `.dark` on `<html>`, which the script already sets. Verified by toggling and hard-reloading.

4. **`next-themes` temptation.** It is Next-only. Do not install it. Toggling a class is sufficient.

5. **Bundle bloat from islands.** Each `client:load` island ships its own React payload. Mitigation: islands below the fold use `client:visible`. The playground page is one big island rather than many small ones, so React loads once for the whole page. Static pages stay zero-React.

6. **Lucide icon split.** Two icon paths is a slight smell. Mitigation: a single rule documented in `CLAUDE.md` after the migration — "if it renders inside a `.astro` file, use astro-icon; if it renders inside a `.tsx` island, use `lucide-react`."

7. **Existing inline scripts.** `index.astro`, `examples.astro`, and `getting-started.astro` have inline `<script is:inline>` blocks calling `SmilesDrawer.parse()`. These can stay as-is on static pages — they are not in conflict with React islands. Don't rewrite what isn't broken.

8. **No tests.** The project has no test runner. Visual QA is the only safety net. Mitigation: explicit per-page checklist during the QA pass — every page in light + dark, mobile + desktop, base path verified.

9. **`docs/` is the build output, not a source folder.** Astro is configured with `outDir: './docs'`. Anything written to `docs/` will be wiped on `npm run build`. The design spec itself lives at `specs/2026-04-13-shadcn-redesign-design.md` at repo root for this reason.

## Success Criteria

The redesign is done when:

- Every page (landing, playground, getting started, examples) renders correctly in both light and dark mode.
- Every page renders correctly at mobile and desktop breakpoints.
- The playground's sidebar controls all work: changing any control updates the rendered SVG.
- The playground's URL `?smiles=` sharing still works.
- The Examples page filter bar (category + theme + search) all work.
- The Getting Started install switcher works.
- The dark mode toggle is flash-free across hard reloads on every page.
- `npm run build && npm run preview` produces a working site at `/smiles-drawer-website`.
- The user has visually reviewed the site and is happy enough to begin the relocation effort.
