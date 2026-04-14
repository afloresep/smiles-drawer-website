---
name: Aesthetic Redesign (Relaxed Swiss)
description: Full visual redesign of the SmilesDrawer website in a relaxed-Swiss voice with seafoam-mint accent and a light-only ground, executed as a shell rewrite that preserves the playground JavaScript module (single mode, batch mode, publication export) unchanged
type: design
date: 2026-04-14
status: draft
---

# Aesthetic Redesign — Design Spec

## Goal

Redesign the SmilesDrawer documentation/marketing website with a distinctive, non-generic aesthetic — a relaxed Swiss-grid voice with a seafoam-mint accent — while preserving every feature the playground currently has. The redesign supersedes the 2026-04-13 shadcn redesign effort, which added infrastructure (React, shadcn primitives) without delivering meaningful visual change and dropped batch mode from its scope.

The bet is that the "AI-ish" feel of the current site comes from generic visual flourishes (heavy translucency, pill chips, oversized rounded cards, custom multi-parameter shadows, thin-tracked uppercase micro-labels, gradient backgrounds) — not from the stack. A confident typographic voice with committed restraint fixes the problem without touching the build pipeline or the working playground JavaScript.

## Non-Goals

The following are explicitly **out of scope**:

- Installing React, `@astrojs/react`, shadcn primitives, or any UI component library. The current Astro + Tailwind stack is kept.
- Page-level dark mode. Light only. Molecule render themes (light, dark, matrix, github, solarized, etc.) inside the playground and examples remain, because those are library features, not a page-level dark mode.
- Rewriting the playground's JavaScript logic. The single-mode render loop, the batch render loop, the publication export pipeline (uniform viewBox computation, B&W rewrite, DPI-scaled PNG export), pagination, selection, file import — all preserved unchanged.
- Monorepo relocation into `reymond-group/smilesDrawer`. That is a separate effort with its own PR.
- Switching SmilesDrawer from the bundled `public/js/smiles-drawer.min.js` to the npm package.
- New pages (blog, pricing, team). The site keeps four pages: landing, playground, getting-started, examples.
- Content rewrites beyond what structural changes force. Long-form docs content is preserved.
- Analytics, telemetry, command palette, search.
- Tests, Storybook, visual regression. The project has no test runner and this redesign does not add one.
- A build-step font pipeline. Fonts load from Google Fonts as today.

## Direction

**Relaxed Swiss grid** — committed typographic voice with numbered sections (`01 / 02 / 03`), uppercase tracked labels, hard 1px rules, a consistent 4px spacing rhythm, and a single accent color. "Relaxed" as opposed to strict: 6–8px rounded corners are allowed on surfaces, the accent appears in more places than just surfaces (hover states, focus rings, highlighted inline text), and the overall feel is intended to be disciplined but warm — not austere.

**Voice cues:**

- Numbered nav (`01 Docs`, `02 Playground`, `03 Examples`, `04 GitHub ↗`)
- Numbered accordion groups in the playground sidebar (`001` through `007`)
- Uppercase tracked section labels (`02 / PLAYGROUND`, `SMILES · ONE PER LINE`, `LIVE PREVIEW`)
- Monospace tabular figures for any numeric readout (slider values, SMILES strings, formulas, molecular weights)
- Grid-paper preview backgrounds (20px × 20px faint rule grid) in the molecule render areas — a small graphical cue that the molecule lives on engineering paper
- One accent color, used consistently (primary CTA surface, rule bars, highlight marks, hover states)
- Zero shadows on page chrome; cards get at most a 1px border and no shadow

## Visual System

### Typography

- **Sans:** Inter Tight (Google Fonts). Used for all body text, headings, nav, labels. Chosen as a free Helvetica stand-in — it holds up at display sizes, has real `font-variation-settings` support, and ships a wide weight range.
- **Mono:** JetBrains Mono (Google Fonts). Used for SMILES strings, slider readouts, code blocks, formulas, molecular weights.
- **Weights loaded:** Inter Tight 400 / 500 / 600 / 700 / 800; JetBrains Mono 400 / 500. No italic variants needed.
- **Scale:** headline `48px / 0.98 / -0.03em`, section `34px / -0.025em`, h3 `24px / -0.02em`, body `15px / 1.55`, small `11px`, micro-label `9–10px / 0.14em tracking / uppercase`.
- **Numeric figures:** tabular-nums enabled globally so slider readouts and formulas don't jitter.

### Color tokens

| Token | Hex | Role |
|---|---|---|
| `paper` | `#fafaf7` | Page ground |
| `ink` | `#0a0a0a` | Primary text, borders, hard rules |
| `inkMuted` | `#444` | Body copy |
| `inkSubtle` | `#666` | Secondary text |
| `inkHint` | `#888` | Tertiary hints |
| `inkFaint` | `#c0c0c0` | Section numbers |
| `rule` | `rgba(10,10,10,0.12)` | 1px internal rules |
| `mint` | `#9dd4c0` | Primary accent (CTA surface, rule bars, active states) |
| `mintDeep` | `#3e8572` | Accent text, hover state, publication-panel emphasis |
| `mintTint` | `#d6ecdf` | Accent surface background (slider fills, readout chips, highlight marks) |

Tailwind extends its palette with these tokens; no new color scales.

### Spacing, radius, rules

- **Rhythm:** 4px grid. All padding, margin, and gap values are multiples of 4.
- **Radius:** 6px on surfaces and inputs, 4px on small controls (buttons, chips, toggles), 3px on the smallest readouts. Nothing above 8px.
- **Rules:** 1px rules for internal section boundaries use `rgba(10,10,10,0.12)`. Full 1px solid `#0a0a0a` rules for page-level boundaries (header bottom, primary containers, mode switcher outlines).
- **Shadows:** none on page chrome. Popovers and dropdown menus get a soft `0 8px 24px rgba(0,0,0,0.15)` and nothing else.

### Component patterns

- **Buttons:** `.btn-primary` uses `bg-mint border border-mint text-ink` with a small hover shift to `bg-mintDeep/0.9`. `.btn-secondary` uses `bg-white border border-ink text-ink`. Both at `6px` radius, `12/18px` padding, uppercase `0.05em` tracked labels, `font-weight: 700`, `font-size: 11–12px`.
- **Inputs:** 6px radius, 1px border `rule`, white surface, JetBrains Mono for SMILES-style inputs, Inter Tight for text inputs.
- **Sliders:** 4px rail `#e4e4de`, fill is `mint`, thumb is a 10–12px `ink` circle. Label above the rail, readout value in a `mintTint` chip right-aligned.
- **Toggles:** 24×14px or 28×16px pill, off state `#eee`, on state `mint`, white thumb.
- **Accordions:** 10–14px vertical padding on the row, left-aligned number, centered title, right-aligned summary hint, rotating chevron. Expanded body is indented 26px and inset with a left 2px `mint` rule.
- **Tabs:** inline horizontal tabs, active tab gets `inset 0 -2px 0 mint` as a bottom rule and pale ground fill.
- **Cards:** 1px `ink` border, 6px radius, white surface, no shadow.

## Page Layouts

### `index.astro` — Home

- **Header** (sticky, bottom-ruled in `ink`): `SMILESDRAWER v2.2.1` wordmark left, numbered nav right (`01 Docs`, `02 Playground`, `03 Examples`, `04 GitHub ↗`). Hover state uses `mintDeep` text.
- **Hero** (two-column at `lg:`): left column is eyebrow (`Open source · MIT`), headline (`Draw molecules from SMILES strings. In the browser.` — "SMILES" is wrapped in a `bg-mintTint` highlight mark), lead paragraph, two CTAs (`Read the docs →` primary, `Open playground` secondary), metadata strip. Right column is the live demo panel: 6px-radius bordered card with a tiny header strip (`LIVE PREVIEW` · `RENDER ENGINE · SVG`), a 280px grid-paper preview area, a `SMILES` input row with label prefix, a presets row (`Caffeine · Aspirin · Benzene · Dopamine · Glucose` as 5 small buttons), and an action strip at the bottom (`Copy SMILES · Download SVG · Open in playground`).
- **Link strip** — three 1/3-width cells as a full-width row with 1px rules between them: `01 / DOCUMENTATION`, `02 / PLAYGROUND`, `03 / EXAMPLES`. Each cell is a large heading plus short description plus arrow link. Hover fills the cell with `mintTint`.
- **Footer** — minimal strip: `SMILESDRAWER · MIT · Pure JavaScript` left, `GITHUB ↗ · NPM ↗ · REPORT ISSUE ↗` right, mint links.

Home reuses the existing `HeroPlayground.astro` component but drastically simplified — the current 215-line component is cut down to the input + preview + presets + action strip as described. No theme reactivity needed because the site is light-only; the playground component still respects the molecule render theme setting but defaults to light.

Everything on the home page is static HTML + existing inline `<script is:inline>` blocks using the same `window.SmilesWebsite` helper module.

### `playground.astro` — Playground (single mode)

- **Header** and **title strip** as above. Title strip contains the eyebrow (`02 / PLAYGROUND`), an H1 (`Render, tweak, export.`), and a mode switch at the right (`● Single` / `Batch`) inside a bordered 6px pill.
- **Main grid:** 280px sidebar on the left, 1fr main pane on the right.
- **Sidebar** (seven numbered accordion groups, vertically scrollable inside a max-height container):
  1. `001 PRESET` — preset molecule combobox (categorized list from `playgroundPresets`)
  2. `002 THEME` — 4-swatch grid for molecule render theme (light, dark, matrix, solarized, plus any additional themes from `themePresets`)
  3. `003 SIZING` — bond length, bond thickness, font size sliders (the most commonly touched values)
  4. `004 CANVAS` — canvas width, canvas height, short bond length, bond spacing sliders
  5. `005 DISPLAY` — terminal carbons, explicit hydrogens, compact drawing, debug toggles
  6. `006 ATOMS` — atom style (default / balls / all-balls), weight type (MW / exact / atomic formula)
  7. `007 REACTION` — all nine reaction options (scale, spacing, font size, plus size, plus thickness, arrow length, arrow thickness, arrow head size, arrow margin) — this group is always collapsed by default because it only applies when the SMILES input is a reaction string
- **Density presets** at the sticky top of the sidebar: `● Essential` (opens groups 001, 002, 003), `All options` (opens all seven), `Reaction` (opens only 007, collapses the rest). Each preset is a single click; users can still open/close individual groups on top of the preset.
- **Accordion row summary:** each closed row shows a one-line readout of its current values in JetBrains Mono (e.g. `L19 · T1.1 · F6.3` for the Sizing group) so the user can see what's set without expanding. On expand, the content is inset with a left `mint` rule.
- **Main pane:**
  - Top: SMILES input bar (`SMILES` label prefix, monospace input, inline `VALID`/`INVALID` indicator on the right with a mint dot)
  - Below: tabs row (`Preview` / `SVG source` / `Share URL`) on the left, actions (`Reset`, `Copy SMILES`, `Export ▼`) on the right, joined in a single ruled bar
  - Preview area: full-width grid-paper background, molecule SVG centered
  - Status strip at the bottom: live formula, molecular weight, atom count, and the canvas dimensions + current draw option readout

### `playground.astro` — Playground (batch mode)

Same shell. Mode switch flipped to `● Batch`. Sidebar reorganized to four groups because the batch mode has a different option set:

1. `001 GRID` — grid presets (2×2, 3×3, 3×4, 4×4, 5×5 buttons), columns, rows, cell size sliders
2. `002 DISPLAY` — show labels, show formula, show molecular weight toggles
3. `003 THEME` — 4-swatch molecule render theme
4. `004 PUBLICATION EXPORT` — the mint-tinted "heavy" group, visually distinct with a `mintTint` background, a top `2px mint` rule, and a `mintDeep` title. Contains:
   - Publication style toggle (with subtitle "Uniform bond lengths, black atoms/bonds")
   - DPI preset row (72 / 144 / 300 / 600 — 300 active by default)
   - Background radio row (Theme / White / Transparent)
   - Figure title text input
   - Atom style select
   - Bond length, bond thickness, short bond length, bond spacing sliders (publication-specific overrides)
   - `Export SVG` and `Export PNG` buttons at the bottom (primary button is PNG, styled `bg-mintDeep text-white`)

**Main pane:**
- Top: SMILES textarea area (label `SMILES · ONE PER LINE`, molecule count readout, `Import .smi file` secondary button, textarea 6 rows, render row at the bottom with page info and a primary `Render All →` button)
- Middle: the grid area. Background is `paper` when publication mode is off, white when publication mode is on (so the user sees exactly the export output).
- Bottom: pagination strip (`‹ Prev` / `Page 1 of N · N molecules` / `Next ›`)
- Selection bar appears when cells are selected (Select All / Deselect All / Delete Selected)

**Preserved behaviors:** all pagination, selection, file import, DPI-scaled PNG export, uniform viewBox computation, B&W stop-color rewriting, publication-mode theme forcing to light (lines 1544–1545 of current `playground.astro`), figure title rendering into exported PNG, grid preset application, and the `?smiles=` URL sharing. None of the JS that implements these is touched — the shell just wraps it with new markup, and every DOM id the script queries is preserved.

### `getting-started.astro` — Docs

- **Header + title strip** as above. Eyebrow `01 / DOCUMENTATION`, H1 `Get started`.
- **Install tabs** near the top: `CDN · NPM · REACT · VUE · SVELTE` as a tab row above a `CodeBlock`. Vanilla JS tabs (no React), same behavior as the existing `InstallTabs` pattern.
- **Two-column content layout** at `lg:` breakpoint:
  - Left 240px sticky TOC. Numbered section list: `01 Install`, `02 First molecule`, `03 Options`, `04 Atom highlighting`, `05 Reaction weights`, `06 Web components`, `07 API reference`. Active section highlighted with a left `mint` rule.
  - Right column: long-form content sections separated by 1px rules, each section is a numbered label + H2 + prose + code block(s) + demo blocks where applicable.
- **CodeBlock** component restyled: 1px `ink` border, 6px radius, white surface, filename label in a top strip, `mintDeep` copy button in the top-right, JetBrains Mono code body. No shadow.

Long-form content is preserved. Only the markup wrapping each section is new.

### `examples.astro` — Gallery

- **Header + title strip** as above. Eyebrow `03 / EXAMPLES`, H1 `Reference renders`.
- **Filter bar** below the title strip in a single ruled row:
  - Left: category tabs — `ALL · MOLECULES · REACTIONS · HIGHLIGHTS · THEMES` as a horizontal tab group
  - Middle: theme select (molecule render theme)
  - Right: text search input (filters by name or SMILES substring)
- **Card grid** — 3-up desktop, 2-up tablet, 1-up mobile. Each card is:
  - 1px `ink` border, 6px radius, white surface, no shadow
  - Grid-paper preview area at the top
  - Molecule name (Inter Tight 600) below
  - SMILES string (JetBrains Mono small) under the name
  - Hover reveals an action strip at the bottom: `COPY · DOWNLOAD · OPEN IN PLAYGROUND` — vanilla JS handlers, no framework per card
- Vanilla JS filter logic lives inline. URL query params (`?category=`, `?theme=`, `?q=`) are kept in sync for shareability.

## File-Level Plan

### Touched (rewritten or heavily modified)

| File | Change |
|---|---|
| `src/layouts/Layout.astro` | Remove dark-mode init script, swap font loading to Inter Tight + JetBrains Mono, new body background (`#fafaf7`) |
| `tailwind.config.mjs` | New palette (`mint`, `mintDeep`, `mintTint`, `paper`, `ink` and muted variants), new font families, drop `darkMode: 'class'` |
| `src/styles/global.css` | New component classes (`.btn-primary`, `.btn-secondary`, `.acc-row`, `.acc-body`, `.num-label`, `.slider-fill`, `.toggle-pill`), drop `.card` helper, drop all `dark:` layer CSS, remove the gradient body background |
| `src/components/Header.astro` | Numbered nav, mint hover state, sticky with bottom `1px ink` rule |
| `src/components/Footer.astro` | Minimal Swiss strip (left identity, right links) |
| `src/components/HeroPlayground.astro` | Simplified per section 1: input + preview + presets + action strip, 215 lines → ~80 lines |
| `src/components/MoleculeCard.astro` | New Swiss card style, grid-paper preview, hover action strip |
| `src/components/CodeBlock.astro` | New 6px radius, mint copy button, 1px border, JetBrains Mono body |
| `src/pages/index.astro` | Full rewrite per Home layout above |
| `src/pages/getting-started.astro` | Shell rewrite (new title strip, install tabs, sticky TOC, section wrappers); content sections preserved |
| `src/pages/examples.astro` | Shell rewrite (new title strip, filter bar, card grid); card render logic preserved |
| `src/pages/playground.astro` | Shell rewrite only. The `<script is:inline>` block is lifted to `public/js/playground-app.js` unchanged. New HTML wraps every preserved DOM id. Mode switch, sidebar accordions, density presets, batch grid area, publication panel — all new markup. |

### Deleted

- `src/components/ThemeToggle.astro` — no page-level dark mode

### Preserved (untouched)

- `public/js/smiles-drawer.min.js`
- `public/js/smiles-website.js`
- `src/data/molecules.js`
- `astro.config.mjs`
- The playground JS module's behavior — every function, every DOM query, every event listener

### Critical constraint: preserved DOM id contract

The playground JS queries DOM elements by id (`opt-bondLength`, `opt-bondThickness`, `opt-theme`, `batch-input`, `batch-render-btn`, `batch-opt-pubStyle`, `batch-opt-cols`, etc.). Every one of these ids must be preserved in the new markup. The redesign is a shell rewrite — the script is an opaque block that must keep finding its elements.

During the implementation, the first step after the new shell is scaffolded is to compile the full list of queried ids from `playground.astro`'s script block and grep the new markup to verify every id is present. Missing any id means the playground breaks silently.

### GitHub Pages compatibility

- No new runtime dependencies
- No React, no SSR, no server requirements
- `npm run build` continues to produce the same `docs/` static output
- Base path (`/smiles-drawer-website`) unchanged; asset URL patterns unchanged
- `.nojekyll` file preserved
- Works on GitHub Pages unchanged after deployment

## Risks and Mitigations

1. **Preserved id contract silently breaks.** The playground script calls `getElementById` for many ids. A typo in the new markup means a control silently stops working.
   *Mitigation:* compile the id list from the existing script as the first implementation step, grep the new markup for each, include as an explicit checklist item in the implementation plan, and smoke-test by changing each control in the browser after the rewrite.

2. **Publication export breaks from theme forcing.** The current code forces `theme = 'light'` when publication mode is on (line 1545). The new light-only site removes the page theme toggle but the playground still has molecule render theme options. This must continue to work.
   *Mitigation:* the molecule render theme options are unrelated to the (removed) page-level dark mode. The publication-mode theme forcing in the JS is untouched. The only change is that the page chrome around it is always light.

3. **Font loading FOUT.** Inter Tight is a new font. Until it loads, text renders in system fallback.
   *Mitigation:* preload the woff2 variants via `<link rel="preload">` in `Layout.astro`'s head, same pattern as the current Inter preload. `font-display: swap` keeps content visible during load.

4. **The playground sidebar is too tall on mobile.** 22+ options in a vertical stack don't fit on a phone.
   *Mitigation:* on `< md` breakpoint the sidebar becomes a slide-over drawer, triggered by a button in the title strip. The density presets and accordions still apply inside the drawer. Accepting this means a small amount of mobile-specific CSS but no React.

5. **HeroPlayground simplification regresses features.** The current 215-line component has preset chips, copy button, SVG download, theme reactivity. Some of these may be wanted even in the simplified version.
   *Mitigation:* simplified version keeps preset chips + `Copy SMILES` + `Download SVG` per the user's explicit request; drops only the per-molecule theme reactivity (no-op on light-only). Verify in the implementation plan that the preset mechanism and the copy/download actions still work.

6. **Link-strip hover-fill affects click target readability.** Hover fill with `mintTint` must not make text hard to read.
   *Mitigation:* `mintTint` is explicitly chosen as a surface so `ink` text remains legible on top; verify during visual QA.

7. **No tests.** Visual QA is the only safety net.
   *Mitigation:* per-page, per-feature checklist in the implementation plan — every page at mobile + desktop, every playground control actuated, batch render + publication export exercised end-to-end, URL `?smiles=` sharing verified, `npm run build && npm run preview` run at the real base path before merge.

## Success Criteria

The redesign is done when:

- Every page (home, playground, getting-started, examples) renders in the new relaxed-Swiss voice
- Every page renders at mobile and desktop breakpoints
- The home page demo accepts SMILES input, shows a live preview, responds to preset clicks, supports Copy SMILES and Download SVG
- Playground single mode: every control in the sidebar accordion works; density presets open the expected groups; SMILES input shows inline valid/invalid; tabs (Preview / SVG source / Share URL) all work; Export menu provides SVG / PNG / Copy Link
- Playground batch mode: SMILES textarea accepts multi-line input, file import works, `Render All` populates the grid, pagination works, selection bar works, publication style toggle rewrites the grid to B&W uniform viewBox, DPI presets update the export resolution, Export SVG and Export PNG both produce valid files
- Getting Started: install tabs switch correctly, sticky TOC highlights the active section, all long-form content is readable, code blocks copy correctly
- Examples: filter bar (category + theme + search) filters the grid, card hover action strip works, molecule renders use the correct render theme
- `npm run build && npm run preview` produces a working site at `/smiles-drawer-website`
- No page-level dark mode; no ThemeToggle in the header
- The user has visually reviewed every page and approved the result
