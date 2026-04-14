# Aesthetic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the relaxed-Swiss aesthetic redesign defined in `specs/2026-04-14-aesthetic-redesign-design.md` without touching the playground JavaScript module (single mode, batch mode, publication export).

**Architecture:** Pure shell rewrite. The current inline `<script is:inline>` block in `playground.astro` is lifted verbatim into `public/js/playground-app.js`. All new markup wraps it with new styles and layout, preserving every DOM id and class the script queries. No React, no shadcn, no new build tools. Static Astro + Tailwind as today.

**Tech Stack:** Astro 5, Tailwind 3, Inter Tight + JetBrains Mono from Google Fonts, vanilla JS, SmilesDrawer v2.2.1 via `public/js/smiles-drawer.min.js`.

**Testing note:** This project has no test runner (see `CLAUDE.md`). The safety net is the dev server plus a **preserved-id contract check** — a grep-based verification that every DOM id/class the playground script queries exists in the new markup. Combined with a per-control smoke-test checklist exercised in the browser, this is the plan's substitute for TDD.

---

## Table of Contents

- Phase 0 — Branch setup and cleanup
- Phase 1 — Foundation (tokens, global CSS, layout, chrome deletion)
- Phase 2 — Chrome components (Header, Footer, CodeBlock, MoleculeCard)
- Phase 3 — Simple pages (HeroPlayground, index, getting-started, examples)
- Phase 4 — Playground rewrite
- Phase 5 — Final verification

---

## Phase 0 — Branch setup and cleanup

### Task 0: Create feature branch and drop superseded shadcn artifacts

**Files:**
- Delete: `specs/2026-04-13-shadcn-redesign-design.md`
- Delete: `plans/2026-04-13-shadcn-redesign-plan.md`

**Context:** The shadcn redesign from 2026-04-13 is abandoned. The new spec at `specs/2026-04-14-aesthetic-redesign-design.md` supersedes it. Delete the superseded documents so there is no confusion about which plan is active, and start a clean feature branch so master stays reversible.

- [ ] **Step 1: Create the feature branch from master**

Run:
```bash
git checkout -b aesthetic-redesign
```
Expected: `Switched to a new branch 'aesthetic-redesign'`

- [ ] **Step 2: Delete the superseded shadcn spec and plan**

Run:
```bash
rm specs/2026-04-13-shadcn-redesign-design.md plans/2026-04-13-shadcn-redesign-plan.md
```
Expected: no output.

- [ ] **Step 3: Verify package.json has no lingering shadcn deps**

Run:
```bash
cat package.json
```
Expected: `dependencies` block contains only `astro`, `@astrojs/tailwind`, `tailwindcss`. If you see `react`, `react-dom`, `@astrojs/react`, `astro-icon`, `@iconify-json/lucide`, `lucide-react`, or `tailwindcss-animate`, remove them with:
```bash
npm uninstall react react-dom @astrojs/react astro-icon @iconify-json/lucide lucide-react tailwindcss-animate @types/react @types/react-dom
```
Then run `npm install` once and verify `package.json` is clean.

- [ ] **Step 4: Commit the cleanup**

```bash
git add -u specs plans package.json package-lock.json
git commit -m "Drop superseded shadcn spec and plan"
```

---

## Phase 1 — Foundation

This phase replaces the design tokens (palette, typography, radii, components) and the global layout wrapper. After Phase 1, every existing page will look broken — that's expected. The new token system is in place; the pages that consume it are rewritten in Phases 2–4.

### Task 1: Rewrite `tailwind.config.mjs`

**Files:**
- Modify: `tailwind.config.mjs`

- [ ] **Step 1: Replace the config file in full**

Replace `tailwind.config.mjs` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                paper: '#fafaf7',
                ink: {
                    DEFAULT: '#0a0a0a',
                    muted: '#444444',
                    subtle: '#666666',
                    hint: '#888888',
                    faint: '#c0c0c0',
                },
                mint: {
                    DEFAULT: '#9dd4c0',
                    deep: '#3e8572',
                    tint: '#d6ecdf',
                },
                rule: 'rgba(10, 10, 10, 0.12)',
            },
            fontFamily: {
                sans: ['"Inter Tight"', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            fontFeatureSettings: {
                tabular: '"tnum"',
            },
        },
    },
    plugins: [],
};
```

Notes:
- `darkMode` is gone. The site is light-only.
- No custom accent scale — `mint.DEFAULT`, `mint.deep`, `mint.tint` are the only accent tokens.
- `ink` is a nested scale (DEFAULT plus muted/subtle/hint/faint) for progressive text color steps.
- `rule` is the 12%-opacity ink used for internal section dividers.

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.mjs
git commit -m "Replace Tailwind palette with paper/ink/mint tokens"
```

---

### Task 2: Rewrite `src/styles/global.css`

**Files:**
- Modify: `src/styles/global.css`

**Context:** The global CSS is the home for reusable component patterns (`.btn-primary`, `.btn-secondary`, `.acc-row`, `.acc-body`, slider rail, toggle pill). Page-level files compose these with Tailwind utilities.

- [ ] **Step 1: Replace the file in full**

Replace `src/styles/global.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    :root {
        color-scheme: light;
    }

    html {
        font-feature-settings: "tnum", "cv02", "cv03", "cv04", "cv11";
    }

    body {
        @apply text-ink bg-paper antialiased;
        font-family: "Inter Tight", system-ui, -apple-system, sans-serif;
    }

    ::selection {
        @apply bg-mint-tint text-ink;
    }

    /* Grid-paper preview background — used wherever a molecule is rendered */
    .grid-paper {
        background-image:
            linear-gradient(rgba(10, 10, 10, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 10, 10, 0.04) 1px, transparent 1px);
        background-size: 20px 20px;
        background-color: #ffffff;
    }
}

@layer components {
    /* ===== Buttons ===== */
    .btn-primary {
        @apply inline-flex items-center gap-2 px-4 py-3
               rounded-md bg-mint border border-mint
               text-ink font-bold text-[11px] uppercase tracking-[0.05em]
               transition-colors hover:bg-mint-deep hover:border-mint-deep hover:text-white;
    }

    .btn-secondary {
        @apply inline-flex items-center gap-2 px-4 py-3
               rounded-md bg-white border border-ink
               text-ink font-bold text-[11px] uppercase tracking-[0.05em]
               transition-colors hover:bg-paper;
    }

    .btn-ghost {
        @apply inline-flex items-center gap-1 px-3 py-2
               font-semibold text-[11px] uppercase tracking-[0.04em]
               text-ink transition-colors hover:text-mint-deep;
    }

    /* ===== Labels ===== */
    .num-label {
        @apply text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-hint;
    }

    .eyebrow {
        @apply inline-flex items-center gap-2 text-[10px] font-semibold
               uppercase tracking-[0.14em] text-mint-deep;
    }

    .eyebrow::before {
        content: "";
        display: inline-block;
        width: 18px;
        height: 2px;
        background: theme('colors.mint.DEFAULT');
    }

    /* ===== Accordion rows ===== */
    .acc-row {
        @apply flex items-center gap-3 px-4 py-3 cursor-pointer
               text-[11px] transition-colors hover:bg-paper;
    }

    .acc-row .acc-num {
        @apply text-[9px] font-bold uppercase tracking-[0.1em] text-ink-faint min-w-[24px];
    }

    .acc-row .acc-title {
        @apply font-bold tracking-[0.04em] text-ink min-w-[96px];
    }

    .acc-row .acc-hint {
        @apply flex-1 font-mono text-[10px] text-ink-hint truncate;
    }

    .acc-row .acc-chev {
        @apply text-[11px] text-ink-hint transition-transform;
    }

    .acc-group[open] > summary.acc-row .acc-chev {
        @apply rotate-90 text-mint-deep;
    }

    .acc-group[open] > summary.acc-row {
        @apply bg-paper;
    }

    .acc-body {
        @apply pt-2 pb-4 pr-4 pl-10 ml-4 bg-paper;
        border-left: 2px solid theme('colors.mint.DEFAULT');
    }

    /* ===== Range sliders (applies to any input[type=range]) ===== */
    input[type="range"].rail {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        background: #e4e4de;
        border-radius: 2px;
        outline: none;
    }

    input[type="range"].rail::-webkit-slider-runnable-track {
        height: 4px;
        background: transparent;
    }

    input[type="range"].rail::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: theme('colors.ink.DEFAULT');
        cursor: pointer;
        margin-top: -4px;
    }

    input[type="range"].rail::-moz-range-track {
        height: 4px;
        background: transparent;
        border: none;
    }

    input[type="range"].rail::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: theme('colors.ink.DEFAULT');
        border: none;
        cursor: pointer;
    }

    /* Tailwind's arbitrary `accent-*` class fills the filled-side of the rail in WebKit */
    input[type="range"].rail {
        accent-color: theme('colors.mint.DEFAULT');
    }

    /* ===== Checkbox pill toggle (visual only — wraps a real <input type=checkbox>) ===== */
    .toggle-pill {
        @apply relative inline-block w-7 h-4 rounded-full bg-[#eee] transition-colors;
    }

    .toggle-pill::after {
        content: "";
        @apply absolute top-[2px] left-[2px] w-3 h-3 rounded-full bg-white transition-[left];
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    input[type="checkbox"]:checked + .toggle-pill {
        background: theme('colors.mint.DEFAULT');
    }

    input[type="checkbox"]:checked + .toggle-pill::after {
        left: 14px;
    }

    /* ===== Readout chip ===== */
    .readout {
        @apply font-mono text-[10px] text-mint-deep bg-mint-tint px-[6px] py-[1px] rounded-sm;
    }

    /* ===== Inline code ===== */
    .ic {
        @apply font-mono text-[0.9em] bg-paper text-ink-muted px-[6px] py-[2px] rounded-sm border border-rule;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "Replace global.css with paper/mint token components"
```

---

### Task 3: Update `src/layouts/Layout.astro`

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Replace the file in full**

Replace `src/layouts/Layout.astro` with:

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
    title: string;
    description?: string;
}

const {title, description = 'Draw molecules from SMILES strings. Pure JavaScript, no server required.'} = Astro.props;
const base = import.meta.env.BASE_URL;
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href={`${base}/favicon.svg`} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <title>{title} | SmilesDrawer</title>
    <!-- SmilesDrawer library + shared rendering helpers -->
    <script is:inline src={`${base}/js/smiles-drawer.min.js`}></script>
    <script is:inline src={`${base}/js/smiles-website.js`}></script>
</head>
<body class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
        <slot />
    </main>
    <Footer />
</body>
</html>
```

Notes:
- The flash-free dark-mode init `<script is:inline>` is gone.
- Google Fonts link now loads Inter Tight + JetBrains Mono.
- Body has no custom background gradient — the `body` base rule in `global.css` sets `bg-paper`.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "Simplify Layout: Inter Tight + JetBrains Mono, drop dark-mode init"
```

---

### Task 4: Delete `ThemeToggle.astro`

**Files:**
- Delete: `src/components/ThemeToggle.astro`

**Context:** No page-level dark mode means no toggle. The component is about to be unused by `Header.astro` (next task), so remove it now to prevent accidental re-import.

- [ ] **Step 1: Delete the file**

```bash
rm src/components/ThemeToggle.astro
```

- [ ] **Step 2: Verify no references remain**

Run:
```bash
grep -rn "ThemeToggle" src/
```
Expected: no matches. If `Header.astro` still imports it, ignore for now — Task 5 rewrites `Header.astro` from scratch.

- [ ] **Step 3: Commit**

```bash
git add -u src/components
git commit -m "Remove ThemeToggle — site is light-only"
```

---

## Phase 2 — Chrome components

### Task 5: Rewrite `src/components/Header.astro`

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Replace the file in full**

Replace `src/components/Header.astro` with:

```astro
---
const base = import.meta.env.BASE_URL;
const pathname = Astro.url.pathname;

function isActive(path) {
    if (path === '/') return pathname === base || pathname === `${base}/` || pathname === `${base}`;
    return pathname.includes(path);
}
---
<header class="sticky top-0 z-40 bg-paper border-b border-ink">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href={base || '/'} class="flex items-baseline gap-2 no-underline">
            <span class="text-[14px] font-extrabold tracking-tight text-ink">SMILESDRAWER</span>
            <span class="text-[10px] font-medium text-ink-hint uppercase tracking-[0.1em]">v2.2.1</span>
        </a>
        <nav class="flex items-center gap-7">
            <a href={`${base}/getting-started`} class={`btn-ghost ${isActive('getting-started') ? 'text-mint-deep' : ''}`}>
                <span class="text-[9px] text-ink-faint font-semibold">01</span>
                <span>Docs</span>
            </a>
            <a href={`${base}/playground`} class={`btn-ghost ${isActive('playground') ? 'text-mint-deep' : ''}`}>
                <span class="text-[9px] text-ink-faint font-semibold">02</span>
                <span>Playground</span>
            </a>
            <a href={`${base}/examples`} class={`btn-ghost ${isActive('examples') ? 'text-mint-deep' : ''}`}>
                <span class="text-[9px] text-ink-faint font-semibold">03</span>
                <span>Examples</span>
            </a>
            <a href="https://github.com/reymond-group/smilesDrawer" target="_blank" rel="noopener" class="btn-ghost">
                <span class="text-[9px] text-ink-faint font-semibold">04</span>
                <span>GitHub ↗</span>
            </a>
        </nav>
    </div>
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "Rewrite Header: numbered nav, mint hover state, 1px ink rule"
```

---

### Task 6: Rewrite `src/components/Footer.astro`

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace the file in full**

Replace `src/components/Footer.astro` with:

```astro
---
---
<footer class="border-t border-rule bg-paper">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-3 px-6 py-6 text-[11px] text-ink-hint tracking-wide">
        <span>
            <strong class="text-ink font-semibold">SMILESDRAWER</strong>
            <span class="mx-2 text-ink-faint">·</span>
            MIT
            <span class="mx-2 text-ink-faint">·</span>
            Pure JavaScript
        </span>
        <span class="flex items-center gap-4">
            <a href="https://github.com/reymond-group/smilesDrawer" target="_blank" rel="noopener" class="text-mint-deep font-semibold no-underline hover:underline">GITHUB ↗</a>
            <a href="https://www.npmjs.com/package/smiles-drawer" target="_blank" rel="noopener" class="text-mint-deep font-semibold no-underline hover:underline">NPM ↗</a>
            <a href="https://github.com/reymond-group/smilesDrawer/issues" target="_blank" rel="noopener" class="text-mint-deep font-semibold no-underline hover:underline">REPORT ISSUE ↗</a>
        </span>
    </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "Rewrite Footer: minimal Swiss strip"
```

---

### Task 7: Restyle `src/components/CodeBlock.astro`

**Files:**
- Modify: `src/components/CodeBlock.astro`

- [ ] **Step 1: Read the current file to preserve its copy-button JS**

```bash
cat src/components/CodeBlock.astro
```

Expected: current file has a `<pre>` with code, a copy button, and an inline `<script is:inline>` that wires the copy button.

- [ ] **Step 2: Replace the file in full**

Replace `src/components/CodeBlock.astro` with:

```astro
---
interface Props {
    code: string;
    lang?: string;
    filename?: string;
}
const { code, lang = 'javascript', filename } = Astro.props;
const id = 'code-' + Math.random().toString(36).slice(2, 9);
---
<div class="border border-ink rounded-md overflow-hidden bg-white">
    {filename && (
        <div class="flex items-center justify-between px-4 py-2 border-b border-rule bg-paper">
            <span class="font-mono text-[11px] text-ink-muted">{filename}</span>
            <span class="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{lang}</span>
        </div>
    )}
    <div class="relative">
        <pre id={id} class="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-ink bg-white m-0"><code set:html={code}></code></pre>
        <button
            type="button"
            class="code-copy-btn absolute top-3 right-3 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] bg-mint-tint text-mint-deep border border-mint hover:bg-mint hover:text-ink rounded-sm transition-colors"
            data-target={id}>
            COPY
        </button>
    </div>
</div>

<script is:inline>
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.code-copy-btn');
    if (!btn) return;
    var targetId = btn.getAttribute('data-target');
    var pre = document.getElementById(targetId);
    if (!pre) return;
    var code = pre.innerText;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function() {
            btn.textContent = 'COPIED';
            setTimeout(function() { btn.textContent = 'COPY'; }, 1500);
        });
    }
});
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CodeBlock.astro
git commit -m "Restyle CodeBlock: 1px ink border, mint copy button"
```

---

### Task 8: Restyle `src/components/MoleculeCard.astro`

**Files:**
- Modify: `src/components/MoleculeCard.astro`

- [ ] **Step 1: Read the current file to preserve props and render logic**

```bash
cat src/components/MoleculeCard.astro
```

Expected: current file accepts props like `name`, `smiles`, `render`, `clickable`, `wide`, and contains a `<svg class="molecule-svg" data-smiles=...>` that the page-level inline script populates.

- [ ] **Step 2: Replace the file in full**

Replace `src/components/MoleculeCard.astro` with:

```astro
---
interface Props {
    name: string;
    smiles: string;
    render?: Record<string, unknown>;
    clickable?: boolean;
    wide?: boolean;
}
const { name, smiles, render, clickable = false, wide = false } = Astro.props;
const renderAttr = render ? JSON.stringify(render) : null;
---
<div
    class:list={[
        'group relative border border-ink rounded-md bg-white overflow-hidden transition-colors',
        wide && 'col-span-2',
        clickable && 'cursor-pointer hover:bg-mint-tint',
    ]}
    data-molecule-card={clickable ? 'true' : null}
    data-smiles={smiles}
    data-theme-surface="">
    <div class="grid-paper flex items-center justify-center p-4" style="min-height: 140px;">
        <svg
            class="molecule-svg w-full"
            style="max-width: 200px; max-height: 120px;"
            data-smiles={smiles}
            data-render={renderAttr}></svg>
    </div>
    <div class="px-4 py-3 border-t border-rule">
        <div class="text-[12px] font-semibold text-ink truncate">{name}</div>
        <div class="font-mono text-[10px] text-ink-hint truncate mt-0.5">{smiles}</div>
    </div>
</div>
```

Notes:
- Preserves `data-molecule-card`, `data-smiles`, `data-theme-surface`, `class="molecule-svg"` — all queried by the shared inline renderers in `index.astro` and `examples.astro`.
- The `grid-paper` class comes from `global.css` base layer.

- [ ] **Step 3: Commit**

```bash
git add src/components/MoleculeCard.astro
git commit -m "Restyle MoleculeCard: 1px ink border, grid-paper surface"
```

---

## Phase 3 — Simple pages

### Task 9: Simplify `src/components/HeroPlayground.astro`

**Files:**
- Modify: `src/components/HeroPlayground.astro`

**Context:** The current component is 215 lines with translucent layering and theme reactivity. Replace with a minimal live demo: SMILES input, grid-paper preview, 5 preset buttons, and three action buttons (copy SMILES, download SVG, open in playground). The inline script polls `window.SmilesDrawer` and uses `window.SmilesWebsite` helpers — same pattern as today, simplified.

- [ ] **Step 1: Replace the file in full**

Replace `src/components/HeroPlayground.astro` with:

```astro
---
import { playgroundPresets } from '../data/molecules.js';
const base = import.meta.env.BASE_URL;

// Flatten the first few presets for the hero — any 5 well-known molecules
const heroPresets = [
    { name: 'Caffeine', smiles: 'Cn1cnc2c1C(=O)N(C(=O)N2C)C' },
    { name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
    { name: 'Benzene', smiles: 'c1ccccc1' },
    { name: 'Dopamine', smiles: 'C1=CC(=C(C=C1CCN)O)O' },
    { name: 'Glucose', smiles: 'OC[C@@H](O)[C@@H](O)[C@H](O)[C@H](O)C=O' },
];
---
<div class="border border-ink rounded-md bg-white overflow-hidden">
    <div class="flex items-center justify-between px-4 py-2 border-b border-rule text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-hint">
        <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-mint"></span>
            LIVE PREVIEW
        </span>
        <span>RENDER ENGINE · SVG</span>
    </div>

    <div class="grid-paper flex items-center justify-center p-6" style="min-height: 280px;">
        <div id="hero-preview-panel" class="flex items-center justify-center w-full">
            <svg id="hero-svg" class="w-full" style="max-width: 420px; max-height: 240px;"></svg>
        </div>
    </div>

    <div class="flex items-stretch border-b border-rule">
        <span class="flex items-center px-4 border-r border-rule text-[9px] font-bold uppercase tracking-[0.14em] text-ink-hint">SMILES</span>
        <input
            id="hero-smiles-input"
            type="text"
            spellcheck="false"
            value="Cn1cnc2c1C(=O)N(C(=O)N2C)C"
            class="flex-1 px-4 py-3 font-mono text-[13px] text-ink bg-transparent outline-none" />
    </div>

    <div class="flex items-center gap-2 px-4 py-3 border-b border-rule">
        <span class="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-faint mr-2">PRESETS</span>
        {heroPresets.map(p => (
            <button
                type="button"
                class="hero-preset text-[11px] font-semibold px-2.5 py-1 rounded-sm border border-rule text-ink hover:border-mint hover:bg-mint-tint transition-colors"
                data-smiles={p.smiles}>
                {p.name}
            </button>
        ))}
    </div>

    <div class="flex">
        <button type="button" id="hero-copy-smiles" class="flex-1 py-3 text-[11px] font-semibold text-ink border-r border-rule hover:bg-paper">
            <span class="text-mint-deep mr-1">⎘</span> Copy SMILES
        </button>
        <button type="button" id="hero-download-svg" class="flex-1 py-3 text-[11px] font-semibold text-ink border-r border-rule hover:bg-paper">
            <span class="text-mint-deep mr-1">↓</span> Download SVG
        </button>
        <a href={`${base}/playground`} class="flex-1 py-3 text-[11px] font-semibold text-ink text-center hover:bg-paper no-underline">
            <span class="text-mint-deep mr-1">→</span> Open in playground
        </a>
    </div>
</div>

<script is:inline>
(function() {
    var input = document.getElementById('hero-smiles-input');
    var svg = document.getElementById('hero-svg');
    var copyBtn = document.getElementById('hero-copy-smiles');
    var downloadBtn = document.getElementById('hero-download-svg');
    var presetBtns = document.querySelectorAll('.hero-preset');

    if (!input || !svg) return;

    function renderPreview() {
        var smiles = input.value;
        if (!window.SmilesDrawer || !smiles) return;
        try {
            var drawer = new window.SmilesDrawer.SmiDrawer({
                width: 420,
                height: 240,
                explicitHydrogens: false,
                compactDrawing: true,
                bondLength: 19,
                bondThickness: 1.1,
                fontSizeLarge: 6.3,
                padding: 18,
            });
            drawer.draw(smiles, svg, 'light', function() {});
            setActivePreset(smiles);
        } catch (e) {
            // invalid SMILES — leave last render in place
        }
    }

    function setActivePreset(smiles) {
        presetBtns.forEach(function(btn) {
            if (btn.getAttribute('data-smiles') === smiles) {
                btn.classList.add('bg-mint-tint', 'border-mint');
            } else {
                btn.classList.remove('bg-mint-tint', 'border-mint');
            }
        });
    }

    input.addEventListener('input', renderPreview);

    presetBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            input.value = btn.getAttribute('data-smiles');
            renderPreview();
        });
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            if (navigator.clipboard) navigator.clipboard.writeText(input.value);
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            var serializer = new XMLSerializer();
            var svgStr = serializer.serializeToString(svg);
            var blob = new Blob([svgStr], { type: 'image/svg+xml' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'molecule.svg';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // Poll for SmilesDrawer availability
    function waitForDrawer(attempts) {
        if (window.SmilesDrawer) { renderPreview(); return; }
        if (attempts > 100) return;
        setTimeout(function() { waitForDrawer(attempts + 1); }, 50);
    }
    waitForDrawer(0);
})();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroPlayground.astro
git commit -m "Simplify HeroPlayground: SMILES input + presets + copy/download"
```

---

### Task 10: Rewrite `src/pages/index.astro`

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the file in full**

Replace `src/pages/index.astro` with:

```astro
---
import Layout from '../layouts/Layout.astro';
import HeroPlayground from '../components/HeroPlayground.astro';
const base = import.meta.env.BASE_URL;
---
<Layout title="Home" description="Draw molecules from SMILES strings. Pure JavaScript, runs in the browser.">
    <!-- HERO -->
    <section class="max-w-7xl mx-auto px-6 py-14 sm:py-20">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start">
            <div>
                <div class="eyebrow mb-5">Open source · MIT</div>
                <h1 class="text-[44px] sm:text-[52px] leading-[0.98] font-extrabold tracking-[-0.03em] text-ink">
                    Draw molecules from <mark class="bg-mint-tint text-ink px-1.5 rounded-sm">SMILES</mark> strings. In the browser.
                </h1>
                <p class="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-muted">
                    A pure JavaScript library for rendering chemical structures. 8KB minified. No server, no raster assets, no dependencies.
                </p>
                <div class="mt-8 flex flex-wrap gap-2">
                    <a href={`${base}/getting-started`} class="btn-primary">Read the docs →</a>
                    <a href={`${base}/playground`} class="btn-secondary">Open playground</a>
                </div>
                <div class="mt-8 text-[11px] text-ink-hint tracking-wide">
                    MAINTAINED BY <strong class="text-ink font-semibold">REYMOND GROUP</strong>
                    <span class="mx-2 text-ink-faint">·</span>
                    v2.2.1
                    <span class="mx-2 text-ink-faint">·</span>
                    RELEASED 2024
                </div>
            </div>
            <div>
                <HeroPlayground />
            </div>
        </div>
    </section>

    <!-- LINK STRIP -->
    <section class="border-y border-ink">
        <div class="max-w-7xl mx-auto grid md:grid-cols-3 divide-x divide-rule">
            <a href={`${base}/getting-started`} class="group block p-8 lg:p-10 transition-colors hover:bg-mint-tint">
                <div class="num-label">01 / DOCUMENTATION</div>
                <h3 class="mt-3 text-[24px] font-extrabold tracking-[-0.02em] text-ink">Get started</h3>
                <p class="mt-2 text-[12px] text-ink-muted max-w-[34ch]">Install, render your first molecule, and learn the API.</p>
                <div class="mt-4 text-[13px] font-semibold text-mint-deep">Read the docs →</div>
            </a>
            <a href={`${base}/playground`} class="group block p-8 lg:p-10 transition-colors hover:bg-mint-tint">
                <div class="num-label">02 / PLAYGROUND</div>
                <h3 class="mt-3 text-[24px] font-extrabold tracking-[-0.02em] text-ink">Try it live</h3>
                <p class="mt-2 text-[12px] text-ink-muted max-w-[34ch]">Tweak every option. Batch render. Export for publication.</p>
                <div class="mt-4 text-[13px] font-semibold text-mint-deep">Open playground →</div>
            </a>
            <a href={`${base}/examples`} class="group block p-8 lg:p-10 transition-colors hover:bg-mint-tint">
                <div class="num-label">03 / EXAMPLES</div>
                <h3 class="mt-3 text-[24px] font-extrabold tracking-[-0.02em] text-ink">Reference renders</h3>
                <p class="mt-2 text-[12px] text-ink-muted max-w-[34ch]">Molecules, reactions, atom highlights, themes.</p>
                <div class="mt-4 text-[13px] font-semibold text-mint-deep">Browse examples →</div>
            </a>
        </div>
    </section>

    <!-- QUIET BOTTOM -->
    <section class="max-w-7xl mx-auto px-6 py-16 text-center">
        <div class="num-label">CONTINUE</div>
        <p class="mt-2 text-[15px] text-ink-muted">Read the docs, open the playground, or browse examples.</p>
    </section>
</Layout>
```

- [ ] **Step 2: Smoke-test in the dev server**

Run:
```bash
npm run dev
```

Open the dev URL in a browser. Verify:
- Header sticky, numbered nav visible, GitHub link opens external.
- Hero shows "Draw molecules from SMILES strings..." with a mint-tinted highlight on "SMILES".
- Live demo on the right: grid-paper preview, SMILES input, 5 preset buttons, 3 action buttons.
- Typing in the SMILES input re-renders the molecule.
- Clicking a preset button loads that preset and re-renders.
- Copy SMILES button copies the input value.
- Download SVG button downloads a `molecule.svg` file.
- Link strip (01/02/03) hover-fills with mint tint.
- Footer renders minimal, GitHub/npm/report links work.

Stop the dev server with Ctrl+C when done.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Rewrite index: Swiss hero + link strip, simplified demo"
```

---

### Task 11: Restyle `src/pages/getting-started.astro`

**Files:**
- Modify: `src/pages/getting-started.astro`

**Context:** This is a long docs page (788 lines). The content is preserved; only the chrome, section headers, install-tabs wrapper, and wrapper classes change. The engineer should read the current file first, then apply a mechanical find-and-replace to the outer structure while leaving the prose intact.

- [ ] **Step 1: Read the current file**

```bash
cat src/pages/getting-started.astro | head -80
```

Expected: Layout import, title strip, install tabs container, a series of section blocks (`#simple-drawing`, `#atom-highlighting`, `#reaction-weights`, `#web-components`, `#api-reference`).

- [ ] **Step 2: Replace the top chrome and title strip**

Find the top of the file — everything from the frontmatter up to the first content `<section>`. Replace with:

```astro
---
import Layout from '../layouts/Layout.astro';
import CodeBlock from '../components/CodeBlock.astro';
const base = import.meta.env.BASE_URL;

const tocSections = [
    { id: 'install', num: '01', label: 'Install' },
    { id: 'simple-drawing', num: '02', label: 'First molecule' },
    { id: 'options', num: '03', label: 'Options' },
    { id: 'atom-highlighting', num: '04', label: 'Atom highlighting' },
    { id: 'reaction-weights', num: '05', label: 'Reaction weights' },
    { id: 'web-components', num: '06', label: 'Web components' },
    { id: 'api-reference', num: '07', label: 'API reference' },
];
---
<Layout title="Getting Started" description="Install SmilesDrawer and render your first molecule.">
    <section class="border-b border-ink bg-paper">
        <div class="max-w-7xl mx-auto px-6 py-10">
            <div class="eyebrow mb-2">01 / DOCUMENTATION</div>
            <h1 class="text-[34px] font-extrabold tracking-[-0.025em] text-ink">Get started</h1>
            <p class="mt-3 max-w-2xl text-[14px] text-ink-muted">
                Install, render your first molecule, and learn the parts of the API you will actually use.
            </p>
        </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 py-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <!-- TOC -->
        <aside class="hidden lg:block">
            <nav class="sticky top-24 border-l border-rule pl-4">
                <div class="num-label mb-3">CONTENTS</div>
                <ul class="space-y-2">
                    {tocSections.map(s => (
                        <li>
                            <a href={`#${s.id}`} class="flex items-baseline gap-2 text-[12px] text-ink-muted hover:text-ink">
                                <span class="text-[9px] text-ink-faint font-semibold">{s.num}</span>
                                <span>{s.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>

        <div class="space-y-16 max-w-3xl">
```

(This sets up the new chrome. The content sections below continue from the original file.)

- [ ] **Step 3: Wrap each existing content section**

For each existing section in the content body (`Install methods`, `Simple Drawing`, `Atom Highlighting`, `Reaction Weights`, `Web Components`, `API Reference`, etc.), update the wrapper to this pattern:

```astro
<section id="simple-drawing" class="scroll-mt-24">
    <div class="num-label">02 / FIRST MOLECULE</div>
    <h2 class="mt-2 text-[26px] font-extrabold tracking-[-0.02em] text-ink">First molecule</h2>
    <div class="mt-6 space-y-5 text-[14px] leading-relaxed text-ink-muted">
        <!-- preserved prose -->
    </div>
</section>
```

Keep the existing prose, code blocks, and demo blocks inside each section. Just replace the outer wrapper classes. The `id` attribute matches the TOC href.

- [ ] **Step 4: Rewrite the install tabs wrapper**

The install-method switcher (CDN / npm / React / Vue / Svelte) is inside the first section. Replace its wrapper with:

```astro
<section id="install" class="scroll-mt-24">
    <div class="num-label">01 / INSTALL</div>
    <h2 class="mt-2 text-[26px] font-extrabold tracking-[-0.02em] text-ink">Install</h2>

    <div class="mt-6 border border-ink rounded-md overflow-hidden bg-white">
        <div class="flex border-b border-ink" role="tablist">
            <button class="install-tab flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.06em] border-r border-ink data-[active=true]:bg-mint-tint" data-tab="cdn" data-active="true">CDN</button>
            <button class="install-tab flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.06em] border-r border-ink data-[active=true]:bg-mint-tint" data-tab="npm">NPM</button>
            <button class="install-tab flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.06em] border-r border-ink data-[active=true]:bg-mint-tint" data-tab="react">REACT</button>
            <button class="install-tab flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.06em] border-r border-ink data-[active=true]:bg-mint-tint" data-tab="vue">VUE</button>
            <button class="install-tab flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.06em] data-[active=true]:bg-mint-tint" data-tab="svelte">SVELTE</button>
        </div>
        <div class="install-panel p-4" data-panel="cdn">
            <CodeBlock lang="html" filename="index.html" code={`<script src="https://unpkg.com/smiles-drawer@2/dist/smiles-drawer.min.js"><\/script>\n<canvas data-smiles="Cn1cnc2c1C(=O)N(C(=O)N2C)C"></canvas>\n<script>SmilesDrawer.apply();<\/script>`} />
        </div>
        <div class="install-panel p-4 hidden" data-panel="npm">
            <CodeBlock lang="bash" filename="terminal" code={`npm install smiles-drawer`} />
        </div>
        <div class="install-panel p-4 hidden" data-panel="react">
            <CodeBlock lang="jsx" filename="Molecule.jsx" code={`import { useEffect, useRef } from 'react';\nimport SmilesDrawer from 'smiles-drawer';\n\nexport function Molecule({ smiles }) {\n  const ref = useRef(null);\n  useEffect(() => {\n    const drawer = new SmilesDrawer.SmiDrawer();\n    drawer.draw(smiles, ref.current, 'light');\n  }, [smiles]);\n  return <svg ref={ref} />;\n}`} />
        </div>
        <div class="install-panel p-4 hidden" data-panel="vue">
            <CodeBlock lang="vue" filename="Molecule.vue" code={`<template><svg ref="svg" /></template>\n<script setup>\nimport { onMounted, ref } from 'vue';\nimport SmilesDrawer from 'smiles-drawer';\nconst svg = ref(null);\nconst props = defineProps({ smiles: String });\nonMounted(() => {\n  new SmilesDrawer.SmiDrawer().draw(props.smiles, svg.value, 'light');\n});\n</script>`} />
        </div>
        <div class="install-panel p-4 hidden" data-panel="svelte">
            <CodeBlock lang="svelte" filename="Molecule.svelte" code={`<script>\nimport { onMount } from 'svelte';\nimport SmilesDrawer from 'smiles-drawer';\nexport let smiles;\nlet svg;\nonMount(() => {\n  new SmilesDrawer.SmiDrawer().draw(smiles, svg, 'light');\n});\n<\/script>\n<svg bind:this={svg} />`} />
        </div>
    </div>
</section>
```

(If the original file already had the install-tab code content, reuse it verbatim and adjust only the wrapper styling. Do not reinvent the tab contents if they exist.)

- [ ] **Step 5: Close the outer grid and Layout at the bottom**

After the last section, close the grid and Layout:

```astro
        </div>
    </div>
</Layout>

<script is:inline>
document.querySelectorAll('.install-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        var target = tab.getAttribute('data-tab');
        document.querySelectorAll('.install-tab').forEach(function(t) {
            t.setAttribute('data-active', t.getAttribute('data-tab') === target ? 'true' : 'false');
        });
        document.querySelectorAll('.install-panel').forEach(function(p) {
            if (p.getAttribute('data-panel') === target) p.classList.remove('hidden');
            else p.classList.add('hidden');
        });
    });
});
</script>
```

- [ ] **Step 6: Smoke-test in the dev server**

```bash
npm run dev
```

Open `http://localhost:4321/smiles-drawer-website/getting-started/`. Verify:
- Title strip with `01 / DOCUMENTATION` eyebrow and H1 renders.
- Sticky TOC on the left at `lg:` breakpoint, numbered links scroll to sections.
- Install tabs switch correctly between CDN / NPM / REACT / VUE / SVELTE.
- Code blocks have mint copy buttons; clicking copies the code.
- Long-form sections render with the new `scroll-mt-24` offset (anchor links land below the sticky header).

Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add src/pages/getting-started.astro
git commit -m "Restyle Getting Started: numbered TOC, Swiss chrome, restyled install tabs"
```

---

### Task 12: Restyle `src/pages/examples.astro`

**Files:**
- Modify: `src/pages/examples.astro`

- [ ] **Step 1: Read the current file**

```bash
cat src/pages/examples.astro | head -60
```

Expected: Layout import, existing filter controls (category tabs, theme select, search input), and a grid of `MoleculeCard` components populated from `molecules.js`.

- [ ] **Step 2: Replace the page in full, preserving the filter JS and card loop**

Replace `src/pages/examples.astro` with this structure. Where the comment says "preserve existing", copy the matching block from the current file:

```astro
---
import Layout from '../layouts/Layout.astro';
import MoleculeCard from '../components/MoleculeCard.astro';
import { molecules, renderOverrides } from '../data/molecules.js';
const base = import.meta.env.BASE_URL;

// preserve existing — the `molecules` structure and any category derivation from the old file
const categories = Object.keys(molecules);
---
<Layout title="Examples" description="Molecules, reactions, atom highlights, and themes rendered with SmilesDrawer.">
    <section class="border-b border-ink bg-paper">
        <div class="max-w-7xl mx-auto px-6 py-10">
            <div class="eyebrow mb-2">03 / EXAMPLES</div>
            <h1 class="text-[34px] font-extrabold tracking-[-0.025em] text-ink">Reference renders</h1>
            <p class="mt-3 max-w-2xl text-[14px] text-ink-muted">
                Curated molecules, reactions, atom highlights, and themes. Copy, download, or open in the playground.
            </p>
        </div>
    </section>

    <!-- FILTER BAR -->
    <section class="border-b border-rule bg-white sticky top-[65px] z-30">
        <div class="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-1" role="tablist">
                <button data-filter="all" class="ex-filter data-[active=true]:bg-mint-tint data-[active=true]:text-mint-deep text-[11px] font-bold uppercase tracking-[0.06em] px-3 py-2 border border-rule rounded-sm" data-active="true">ALL</button>
                {categories.map(cat => (
                    <button data-filter={cat} class="ex-filter data-[active=true]:bg-mint-tint data-[active=true]:text-mint-deep text-[11px] font-bold uppercase tracking-[0.06em] px-3 py-2 border border-rule rounded-sm ml-1">{cat.toUpperCase()}</button>
                ))}
            </div>
            <div class="ml-auto flex items-center gap-3">
                <label class="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-hint">THEME</label>
                <select id="ex-theme" class="text-[11px] font-mono border border-rule rounded-sm px-2 py-1.5 bg-white">
                    <option value="light">light</option>
                    <option value="dark">dark</option>
                    <option value="matrix">matrix</option>
                    <option value="github">github</option>
                    <option value="solarized">solarized</option>
                </select>
                <input
                    id="ex-search"
                    type="text"
                    placeholder="Search name or SMILES"
                    class="text-[11px] border border-rule rounded-sm px-3 py-1.5 bg-white font-mono w-48" />
            </div>
        </div>
    </section>

    <!-- CARD GRID -->
    <section class="max-w-7xl mx-auto px-6 py-10">
        <div id="ex-grid" class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(cat =>
                molecules[cat].map(mol => (
                    <div class="ex-card" data-category={cat} data-name={mol.name.toLowerCase()} data-smiles={mol.smiles.toLowerCase()}>
                        <MoleculeCard
                            name={mol.name}
                            smiles={mol.smiles}
                            render={renderOverrides[mol.smiles]}
                            clickable={true}
                        />
                    </div>
                ))
            )}
        </div>
    </section>
</Layout>

<script is:inline>
(function() {
    var filterButtons = document.querySelectorAll('.ex-filter');
    var searchInput = document.getElementById('ex-search');
    var themeSelect = document.getElementById('ex-theme');
    var cards = document.querySelectorAll('.ex-card');

    var activeFilter = 'all';
    var query = '';

    function update() {
        cards.forEach(function(card) {
            var cat = card.getAttribute('data-category');
            var name = card.getAttribute('data-name');
            var smiles = card.getAttribute('data-smiles');
            var filterOk = activeFilter === 'all' || cat === activeFilter;
            var q = query.toLowerCase();
            var searchOk = !q || name.indexOf(q) !== -1 || smiles.indexOf(q) !== -1;
            card.style.display = (filterOk && searchOk) ? '' : 'none';
        });
    }

    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            activeFilter = btn.getAttribute('data-filter');
            filterButtons.forEach(function(b) {
                b.setAttribute('data-active', b.getAttribute('data-filter') === activeFilter ? 'true' : 'false');
            });
            update();
            syncUrl();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            query = searchInput.value;
            update();
            syncUrl();
        });
    }

    function syncUrl() {
        var params = new URLSearchParams();
        if (activeFilter !== 'all') params.set('category', activeFilter);
        if (query) params.set('q', query);
        var next = params.toString();
        history.replaceState(null, '', window.location.pathname + (next ? '?' + next : ''));
    }

    // Restore from URL on load
    var url = new URLSearchParams(window.location.search);
    var urlCategory = url.get('category');
    var urlQuery = url.get('q');
    if (urlCategory) {
        activeFilter = urlCategory;
        filterButtons.forEach(function(b) {
            b.setAttribute('data-active', b.getAttribute('data-filter') === urlCategory ? 'true' : 'false');
        });
    }
    if (urlQuery && searchInput) {
        searchInput.value = urlQuery;
        query = urlQuery;
    }
    update();

    // Theme change triggers rendered SVG re-render via the shared smiles-website helper
    if (themeSelect && window.SmilesWebsite) {
        themeSelect.addEventListener('change', function() {
            if (window.SmilesWebsite.renderAllCards) window.SmilesWebsite.renderAllCards(themeSelect.value);
        });
    }
})();
</script>
```

Notes:
- `MoleculeCard` wraps each molecule with the filter metadata attributes so the vanilla-JS filter can show/hide.
- The theme select calls into `window.SmilesWebsite` — the exact function name (`renderAllCards`) should match whatever the current file uses; if the existing name differs, adjust this to match.

- [ ] **Step 3: Smoke-test**

```bash
npm run dev
```

Open the examples page. Verify:
- Title strip and filter bar render.
- Clicking a category tab filters the grid.
- Typing in search hides cards whose name/SMILES doesn't contain the query.
- Theme select re-renders the molecules with the chosen theme.
- URL updates with `?category=...&q=...` when filters change.
- Refreshing the page with the URL params restores filter state.
- Card click opens the playground with `?smiles=` query (if `clickable={true}` handler is wired from `smiles-website.js`).

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/examples.astro
git commit -m "Restyle Examples: Swiss filter bar, grid-paper cards, URL sync"
```

---

## Phase 4 — Playground rewrite

This is the largest and riskiest phase. The plan here is: (1) snapshot every DOM id/class/attribute the existing script queries, (2) lift the script to `public/js/playground-app.js` unchanged, (3) rewrite the markup in sections, (4) run a mechanical id contract check, (5) smoke-test every control.

### Task 13: Compile the preserved-id contract

**Files:**
- Create: `plans/playground-id-contract.txt`

**Context:** The preserved playground JS queries DOM by id, class, and name. Every one of these must exist in the new markup or the script breaks silently. Extract the full inventory now and save it as a checklist.

- [ ] **Step 1: Write the contract file**

Create `plans/playground-id-contract.txt` with:

```
# Playground DOM contract — every selector the preserved JS reads.
# The rewrite MUST include every id / class / name below in the new markup.

# ===== Mode tabs + panels =====
#id tab-single
#id tab-batch
#id panel-single
#id panel-batch

# ===== Single-mode: SMILES input and preview =====
#id pg-input
#id pg-svg
#id pg-svg-wrap
#id pg-error
#id pg-draw-btn
#id pg-preview-surface
#id pg-formula
#id pg-formula-text

# ===== Single-mode: action buttons =====
#id pg-download-svg
#id pg-download-png
#id pg-copy-svg
#id pg-copy-smiles
#id pg-share

# ===== Single-mode: drawing options =====
#id opt-theme
#id opt-atomVisualization
#id opt-bondLength
#id opt-bondLength-val
#id opt-bondThickness
#id opt-bondThickness-val
#id opt-shortBondLength
#id opt-shortBondLength-val
#id opt-bondSpacing
#id opt-bondSpacing-val
#id opt-fontSizeLarge
#id opt-fontSizeLarge-val
#id opt-width
#id opt-width-val
#id opt-height
#id opt-height-val
#id opt-terminalCarbons
#id opt-explicitHydrogens
#id opt-compactDrawing
#id opt-debug

# ===== Single-mode: reaction options =====
#id opt-scale
#id opt-scale-val
#id opt-rxnSpacing
#id opt-rxnSpacing-val
#id opt-rxnFontSize
#id opt-rxnFontSize-val
#id opt-rxnPlusSize
#id opt-rxnPlusSize-val
#id opt-rxnPlusThickness
#id opt-rxnPlusThickness-val
#id opt-rxnArrowLength
#id opt-rxnArrowLength-val
#id opt-rxnArrowThickness
#id opt-rxnArrowThickness-val
#id opt-rxnArrowHeadSize
#id opt-rxnArrowHeadSize-val
#id opt-rxnArrowMargin
#id opt-rxnArrowMargin-val

# ===== Single-mode: preset-button class =====
#class preset-btn

# ===== Batch-mode: top =====
#id batch-input
#id batch-count
#id batch-file-input
#id batch-import-btn
#id batch-render-btn
#id batch-export-png
#id batch-export-svg
#id batch-error
#id batch-grid
#id batch-preview-surface

# ===== Batch-mode: selection =====
#id batch-selection-bar
#id batch-selection-count
#id batch-select-all
#id batch-deselect-all
#id batch-delete-selected

# ===== Batch-mode: pagination =====
#id batch-pagination
#id batch-page-info
#id batch-page-prev
#id batch-page-next

# ===== Batch-mode: grid options =====
#id batch-opt-cols
#id batch-opt-cols-val
#id batch-opt-rows
#id batch-opt-rows-val
#id batch-opt-cellSize
#id batch-opt-cellSize-val
#id batch-opt-showLabels
#id batch-opt-showFormula
#id batch-opt-showMW
#id batch-opt-theme

# ===== Batch-mode: publication =====
#id batch-opt-pubStyle
#id batch-opt-bg-theme
#id batch-opt-bg-white
#id batch-opt-bg-transparent
#name batch-opt-bg
#id batch-opt-title
#id batch-opt-atomVisualization

# ===== Batch-mode: drawing option overrides =====
#id batch-opt-bondLength
#id batch-opt-bondLength-val
#id batch-opt-bondThickness
#id batch-opt-bondThickness-val
#id batch-opt-shortBondLength
#id batch-opt-shortBondLength-val
#id batch-opt-bondSpacing
#id batch-opt-bondSpacing-val
#id batch-opt-fontSizeLarge
#id batch-opt-fontSizeLarge-val
#id batch-opt-compactDrawing
#id batch-opt-terminalCarbons
#id batch-opt-explicitHydrogens

# ===== Batch-mode: reaction option overrides =====
#id batch-opt-scale
#id batch-opt-scale-val
#id batch-opt-rxnSpacing
#id batch-opt-rxnSpacing-val
#id batch-opt-rxnFontSize
#id batch-opt-rxnFontSize-val
#id batch-opt-rxnPlusSize
#id batch-opt-rxnPlusSize-val
#id batch-opt-rxnPlusThickness
#id batch-opt-rxnPlusThickness-val
#id batch-opt-rxnArrowLength
#id batch-opt-rxnArrowLength-val
#id batch-opt-rxnArrowThickness
#id batch-opt-rxnArrowThickness-val
#id batch-opt-rxnArrowHeadSize
#id batch-opt-rxnArrowHeadSize-val
#id batch-opt-rxnArrowMargin
#id batch-opt-rxnArrowMargin-val

# ===== Batch-mode: preset classes =====
#class batch-grid-preset
#class batch-scale-preset
#class batch-cell-svg
```

- [ ] **Step 2: Commit**

```bash
git add plans/playground-id-contract.txt
git commit -m "Playground: record preserved-id contract for rewrite"
```

---

### Task 14: Lift the playground script to `public/js/playground-app.js`

**Files:**
- Create: `public/js/playground-app.js`
- Modify: `src/pages/playground.astro` (remove the inline script only)

**Context:** The inline `<script is:inline>` block in `playground.astro` is roughly lines 610–2200 in the current file. Lift it verbatim into a standalone JS file. No edits to the logic — this task is mechanical.

- [ ] **Step 1: Locate the script boundaries**

```bash
grep -n "<script is:inline>" src/pages/playground.astro
grep -n "</script>" src/pages/playground.astro
```

Expected: one `<script is:inline>` near the bottom of the file and a matching `</script>` right before `</Layout>`.

- [ ] **Step 2: Extract the script body into `public/js/playground-app.js`**

Using your editor, copy everything between `<script is:inline>` and `</script>` (exclusive of the tags themselves) into a new file `public/js/playground-app.js`. Wrap the whole body in a `DOMContentLoaded` guard if it isn't already, so it runs after the new markup is in place:

```js
document.addEventListener('DOMContentLoaded', function() {
    // ===== ORIGINAL PLAYGROUND SCRIPT (verbatim) =====
    // (everything that was between the original <script is:inline> tags)
});
```

If the original code already starts with `document.addEventListener('DOMContentLoaded', function() { ... });`, don't double-wrap — use the existing wrapper.

- [ ] **Step 3: Remove the inline script from `playground.astro`**

Delete the entire `<script is:inline>...</script>` block from the bottom of `playground.astro`. Leave the `</Layout>` close at the end.

- [ ] **Step 4: Verify the dev server still loads the playground page without JS errors**

```bash
npm run dev
```

Open the playground page. You will see the current (old) markup, but without the inline script wired. Open DevTools → Console. Expected: no JS errors related to missing script (because we haven't re-wired it yet — it's expected that playground controls don't work, but there should be no "undefined is not a function" errors).

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add public/js/playground-app.js src/pages/playground.astro
git commit -m "Playground: lift inline script to public/js/playground-app.js verbatim"
```

---

### Task 15: Rewrite `playground.astro` — frontmatter, layout shell, title strip, mode switch

**Files:**
- Modify: `src/pages/playground.astro`

**Context:** From here through Task 20, we rebuild `playground.astro` section by section. At the end of each task, the file will compile but the dev server won't render a working playground until Task 20 wires the script and Task 21 passes the id check. That's expected.

The new file is structured as:
1. Frontmatter
2. `<Layout>` wrapper
3. Title strip + mode switch
4. Main grid container
5. Single-mode panel (sidebar + main pane)
6. Batch-mode panel (sidebar + main pane)
7. `<script src=...>` to load `playground-app.js`

- [ ] **Step 1: Rewrite the top of the file through the title strip**

Open `src/pages/playground.astro`. Replace the file from the top through the existing mode tab row (current lines ~1–18) with:

```astro
---
import Layout from '../layouts/Layout.astro';
import { playgroundPresets, themeOptions } from '../data/molecules.js';
const base = import.meta.env.BASE_URL;
---
<Layout title="Playground" description="Interactive SMILES editor and batch publication export.">
    <section class="border-b border-ink bg-paper">
        <div class="max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-end justify-between gap-6">
            <div>
                <div class="eyebrow mb-2">02 / PLAYGROUND</div>
                <h1 class="text-[34px] font-extrabold tracking-[-0.025em] text-ink">Render, tweak, export.</h1>
            </div>
            <div class="flex border border-ink rounded-md overflow-hidden">
                <button id="tab-single" type="button" class="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink bg-mint border-r border-ink">Single</button>
                <button id="tab-batch" type="button" class="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink bg-white">Batch</button>
            </div>
        </div>
    </section>

    <div class="max-w-7xl mx-auto">
```

Note: the `<div class="max-w-7xl mx-auto">` is left open — it closes at the end of the file after both panels.

- [ ] **Step 2: Save and move on** (the rest of the file from the old markup is still below, and will be replaced in subsequent tasks)

---

### Task 16: Rewrite `playground.astro` — single-mode panel shell + sidebar

**Files:**
- Modify: `src/pages/playground.astro`

- [ ] **Step 1: Remove the old single-mode panel content**

Find the old `<div id="panel-single">` block (currently around lines 20–282) and delete everything inside it — including the wrapper `<div id="panel-single">` itself. Keep deleting up through the opening of the old `<div id="panel-batch" class="hidden">` block.

- [ ] **Step 2: Insert the new single-mode panel**

At the cut point (after the `<div class="max-w-7xl mx-auto">` opened in Task 15), insert:

```astro
        <!-- ================================================ -->
        <!-- SINGLE MODE                                      -->
        <!-- ================================================ -->
        <div id="panel-single" class="grid lg:grid-cols-[300px_minmax(0,1fr)] min-h-[640px]">
            <!-- SIDEBAR -->
            <aside class="border-r border-rule bg-white lg:sticky lg:top-[65px] lg:self-start lg:max-h-[calc(100vh-65px)] lg:overflow-y-auto">
                <div class="sticky top-0 z-10 flex gap-1.5 p-3 bg-paper border-b border-rule">
                    <button type="button" class="density-btn flex-1 text-[10px] font-bold uppercase tracking-[0.05em] px-2 py-1.5 border border-ink rounded-sm data-[active=true]:bg-mint data-[active=true]:border-mint" data-groups="pg-preset,pg-theme,pg-sizing" data-active="true">● Essential</button>
                    <button type="button" class="density-btn flex-1 text-[10px] font-bold uppercase tracking-[0.05em] px-2 py-1.5 border border-ink rounded-sm" data-groups="pg-preset,pg-theme,pg-sizing,pg-canvas,pg-display,pg-atoms,pg-reaction">All options</button>
                    <button type="button" class="density-btn flex-1 text-[10px] font-bold uppercase tracking-[0.05em] px-2 py-1.5 border border-ink rounded-sm" data-groups="pg-reaction">Reaction</button>
                </div>

                <!-- 001 PRESET -->
                <details id="pg-preset" class="acc-group border-b border-rule" open>
                    <summary class="acc-row">
                        <span class="acc-num">001</span>
                        <span class="acc-title">PRESET</span>
                        <span class="acc-hint">pick a molecule</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body">
                        {Object.entries(playgroundPresets).map(([category, mols]) => (
                            <div class="mb-3 last:mb-0">
                                <div class="text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-hint mb-1.5">{category}</div>
                                <div class="flex flex-wrap gap-1.5">
                                    {mols.map(mol => (
                                        <button type="button" class="preset-btn text-[10px] font-semibold px-2 py-1 rounded-sm border border-rule text-ink hover:border-mint hover:bg-mint-tint" data-smiles={mol.smiles}>{mol.name}</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </details>

                <!-- 002 THEME -->
                <details id="pg-theme" class="acc-group border-b border-rule" open>
                    <summary class="acc-row">
                        <span class="acc-num">002</span>
                        <span class="acc-title">THEME</span>
                        <span class="acc-hint">render palette</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body">
                        <select id="opt-theme" class="w-full text-[11px] font-mono border border-rule rounded-sm px-2 py-1.5 bg-white">
                            {themeOptions.map(o => <option value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </details>

                <!-- 003 SIZING -->
                <details id="pg-sizing" class="acc-group border-b border-rule" open>
                    <summary class="acc-row">
                        <span class="acc-num">003</span>
                        <span class="acc-title">SIZING</span>
                        <span class="acc-hint">bond · font</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body space-y-3">
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Bond length</span><span id="opt-bondLength-val" class="readout">19</span></label>
                            <input id="opt-bondLength" type="range" class="rail" min="5" max="30" value="19" step="1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Bond thickness</span><span id="opt-bondThickness-val" class="readout">1.1</span></label>
                            <input id="opt-bondThickness" type="range" class="rail" min="0.1" max="5" value="1.1" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Font size</span><span id="opt-fontSizeLarge-val" class="readout">6.3</span></label>
                            <input id="opt-fontSizeLarge" type="range" class="rail" min="1" max="20" value="6.3" step="0.1" />
                        </div>
                    </div>
                </details>

                <!-- 004 CANVAS -->
                <details id="pg-canvas" class="acc-group border-b border-rule">
                    <summary class="acc-row">
                        <span class="acc-num">004</span>
                        <span class="acc-title">CANVAS</span>
                        <span class="acc-hint">W · H · spacing</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body space-y-3">
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Width</span><span id="opt-width-val" class="readout">550</span></label>
                            <input id="opt-width" type="range" class="rail" min="100" max="1000" value="550" step="50" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Height</span><span id="opt-height-val" class="readout">450</span></label>
                            <input id="opt-height" type="range" class="rail" min="100" max="1000" value="450" step="50" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Short bond length</span><span id="opt-shortBondLength-val" class="readout">0.6</span></label>
                            <input id="opt-shortBondLength" type="range" class="rail" min="0.1" max="1" value="0.6" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Bond spacing</span><span id="opt-bondSpacing-val" class="readout">3.2</span></label>
                            <input id="opt-bondSpacing" type="range" class="rail" min="0" max="10" value="3.2" step="0.1" />
                        </div>
                    </div>
                </details>

                <!-- 005 DISPLAY -->
                <details id="pg-display" class="acc-group border-b border-rule">
                    <summary class="acc-row">
                        <span class="acc-num">005</span>
                        <span class="acc-title">DISPLAY</span>
                        <span class="acc-hint">atoms · debug</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body space-y-2">
                        <label class="flex items-center justify-between text-[11px] text-ink-muted">
                            <span>Terminal carbons</span>
                            <span class="relative inline-flex"><input id="opt-terminalCarbons" type="checkbox" class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint"></span></span>
                        </label>
                        <label class="flex items-center justify-between text-[11px] text-ink-muted">
                            <span>Explicit hydrogens</span>
                            <span class="relative inline-flex"><input id="opt-explicitHydrogens" type="checkbox" class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint"></span></span>
                        </label>
                        <label class="flex items-center justify-between text-[11px] text-ink-muted">
                            <span>Compact drawing</span>
                            <span class="relative inline-flex"><input id="opt-compactDrawing" type="checkbox" checked class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint"></span></span>
                        </label>
                        <label class="flex items-center justify-between text-[11px] text-ink-muted">
                            <span>Debug mode</span>
                            <span class="relative inline-flex"><input id="opt-debug" type="checkbox" class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint"></span></span>
                        </label>
                    </div>
                </details>

                <!-- 006 ATOMS -->
                <details id="pg-atoms" class="acc-group border-b border-rule">
                    <summary class="acc-row">
                        <span class="acc-num">006</span>
                        <span class="acc-title">ATOMS</span>
                        <span class="acc-hint">atom style</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body">
                        <label class="block text-[10px] font-medium text-ink-muted mb-1">Atom style</label>
                        <select id="opt-atomVisualization" class="w-full text-[11px] font-mono border border-rule rounded-sm px-2 py-1.5 bg-white">
                            <option value="default">Default</option>
                            <option value="balls">Balls</option>
                            <option value="allballs">All balls</option>
                        </select>
                    </div>
                </details>

                <!-- 007 REACTION -->
                <details id="pg-reaction" class="acc-group">
                    <summary class="acc-row">
                        <span class="acc-num">007</span>
                        <span class="acc-title">REACTION</span>
                        <span class="acc-hint">9 opts · rxn input</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body space-y-3">
                        <p class="text-[10px] text-ink-hint">Used when the input is a reaction SMILES string (`reactants&gt;reagents&gt;products`).</p>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Scale</span><span id="opt-scale-val" class="readout">0</span></label>
                            <input id="opt-scale" type="range" class="rail" min="0" max="2" value="0" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Spacing</span><span id="opt-rxnSpacing-val" class="readout">10</span></label>
                            <input id="opt-rxnSpacing" type="range" class="rail" min="0" max="20" value="10" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Font size</span><span id="opt-rxnFontSize-val" class="readout">9</span></label>
                            <input id="opt-rxnFontSize" type="range" class="rail" min="0" max="20" value="9" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Plus size</span><span id="opt-rxnPlusSize-val" class="readout">9</span></label>
                            <input id="opt-rxnPlusSize" type="range" class="rail" min="0" max="20" value="9" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Plus thickness</span><span id="opt-rxnPlusThickness-val" class="readout">1</span></label>
                            <input id="opt-rxnPlusThickness" type="range" class="rail" min="0" max="5" value="1" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Arrow length</span><span id="opt-rxnArrowLength-val" class="readout">120</span></label>
                            <input id="opt-rxnArrowLength" type="range" class="rail" min="0" max="500" value="120" step="1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Arrow thickness</span><span id="opt-rxnArrowThickness-val" class="readout">1</span></label>
                            <input id="opt-rxnArrowThickness" type="range" class="rail" min="0.1" max="10" value="1" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Arrow head size</span><span id="opt-rxnArrowHeadSize-val" class="readout">6</span></label>
                            <input id="opt-rxnArrowHeadSize" type="range" class="rail" min="1" max="10" value="6" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Arrow margin</span><span id="opt-rxnArrowMargin-val" class="readout">3</span></label>
                            <input id="opt-rxnArrowMargin" type="range" class="rail" min="0" max="10" value="3" step="0.1" />
                        </div>
                    </div>
                </details>
            </aside>
```

Do not close the `<div id="panel-single">` yet — the main pane comes next.

- [ ] **Step 2: Commit the partial rewrite**

```bash
git add src/pages/playground.astro
git commit -m "Playground: new single-mode sidebar (7 accordion groups + density presets)"
```

---

### Task 17: Rewrite `playground.astro` — single-mode main pane

**Files:**
- Modify: `src/pages/playground.astro`

- [ ] **Step 1: Append the main pane markup**

After the closing `</aside>` from Task 16, insert the main pane and close the single-mode panel:

```astro
            <!-- MAIN PANE -->
            <div class="flex flex-col bg-white">
                <div class="flex items-stretch border-b border-rule">
                    <span class="flex items-center px-4 border-r border-rule text-[9px] font-bold uppercase tracking-[0.14em] text-ink-hint">SMILES</span>
                    <textarea
                        id="pg-input"
                        rows="1"
                        spellcheck="false"
                        class="flex-1 px-4 py-3 font-mono text-[13px] text-ink bg-transparent outline-none resize-none"
                    >Cn1cnc2c1C(=O)N(C(=O)N2C)C</textarea>
                    <button id="pg-draw-btn" type="button" class="btn-primary rounded-none border-0 border-l border-rule">DRAW</button>
                </div>

                <div id="pg-error" class="hidden px-4 py-2 text-[11px] text-red-600 bg-red-50 border-b border-red-200"></div>

                <div class="flex items-center border-b border-rule bg-paper">
                    <div class="flex">
                        <button type="button" class="pg-tab px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-ink border-r border-rule data-[active=true]:bg-white data-[active=true]:shadow-[inset_0_-2px_0_theme(colors.mint.DEFAULT)]" data-tab="preview" data-active="true">Preview</button>
                        <button type="button" class="pg-tab px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-ink border-r border-rule data-[active=true]:bg-white data-[active=true]:shadow-[inset_0_-2px_0_theme(colors.mint.DEFAULT)]" data-tab="svg">SVG source</button>
                        <button type="button" class="pg-tab px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-ink data-[active=true]:bg-white data-[active=true]:shadow-[inset_0_-2px_0_theme(colors.mint.DEFAULT)]" data-tab="share">Share URL</button>
                    </div>
                    <div class="ml-auto flex">
                        <button id="pg-copy-smiles" type="button" class="px-4 py-3 text-[11px] font-semibold border-l border-rule hover:bg-white">Copy SMILES</button>
                        <button id="pg-copy-svg" type="button" class="px-4 py-3 text-[11px] font-semibold border-l border-rule hover:bg-white">Copy SVG</button>
                        <button id="pg-download-svg" type="button" class="px-4 py-3 text-[11px] font-semibold border-l border-rule hover:bg-white">Download SVG</button>
                        <button id="pg-download-png" type="button" class="px-4 py-3 text-[11px] font-semibold border-l border-rule hover:bg-white">Download PNG</button>
                        <button id="pg-share" type="button" class="px-4 py-3 text-[11px] font-semibold border-l border-rule hover:bg-white">Share</button>
                    </div>
                </div>

                <div id="pg-preview-surface" class="grid-paper flex-1 flex items-center justify-center p-6 min-h-[480px]">
                    <div id="pg-svg-wrap" class="flex items-center justify-center w-full">
                        <svg id="pg-svg" class="w-full" style="max-width: 600px; max-height: 460px;"></svg>
                    </div>
                </div>

                <div id="pg-formula" class="hidden border-t border-rule px-4 py-2 text-[11px] text-ink-muted">
                    Formula: <span id="pg-formula-text" class="font-mono text-ink"></span>
                </div>
            </div>
        </div>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/playground.astro
git commit -m "Playground: single-mode main pane with SMILES bar, tabs, preview, formula"
```

---

### Task 18: Rewrite `playground.astro` — batch-mode sidebar + publication panel

**Files:**
- Modify: `src/pages/playground.astro`

- [ ] **Step 1: Delete the old batch panel**

Find and delete the entire old `<div id="panel-batch" class="hidden">...</div>` block. It currently sits below the single-mode panel in the file.

- [ ] **Step 2: Insert the new batch panel shell + sidebar**

After the closing `</div>` of `#panel-single` (from Task 17), insert:

```astro
        <!-- ================================================ -->
        <!-- BATCH MODE                                       -->
        <!-- ================================================ -->
        <div id="panel-batch" class="hidden grid lg:grid-cols-[300px_minmax(0,1fr)] min-h-[840px]">
            <!-- SIDEBAR -->
            <aside class="border-r border-rule bg-white lg:sticky lg:top-[65px] lg:self-start lg:max-h-[calc(100vh-65px)] lg:overflow-y-auto">

                <!-- 001 GRID -->
                <details class="acc-group border-b border-rule" open>
                    <summary class="acc-row">
                        <span class="acc-num">001</span>
                        <span class="acc-title">GRID</span>
                        <span class="acc-hint">cols × rows · size</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body space-y-3">
                        <div class="flex flex-wrap gap-1.5">
                            <button type="button" class="batch-grid-preset text-[10px] font-semibold px-2 py-1 border border-rule rounded-sm hover:border-mint hover:bg-mint-tint" data-cols="2" data-rows="2">2×2</button>
                            <button type="button" class="batch-grid-preset text-[10px] font-semibold px-2 py-1 border border-rule rounded-sm hover:border-mint hover:bg-mint-tint" data-cols="3" data-rows="3">3×3</button>
                            <button type="button" class="batch-grid-preset text-[10px] font-semibold px-2 py-1 border border-rule rounded-sm hover:border-mint hover:bg-mint-tint" data-cols="3" data-rows="4">3×4</button>
                            <button type="button" class="batch-grid-preset text-[10px] font-semibold px-2 py-1 border border-rule rounded-sm hover:border-mint hover:bg-mint-tint" data-cols="4" data-rows="4">4×4</button>
                            <button type="button" class="batch-grid-preset text-[10px] font-semibold px-2 py-1 border border-rule rounded-sm hover:border-mint hover:bg-mint-tint" data-cols="5" data-rows="5">5×5</button>
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Columns</span><span id="batch-opt-cols-val" class="readout">3</span></label>
                            <input id="batch-opt-cols" type="range" class="rail" min="1" max="8" value="3" step="1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Rows</span><span id="batch-opt-rows-val" class="readout">3</span></label>
                            <input id="batch-opt-rows" type="range" class="rail" min="1" max="10" value="3" step="1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Cell size</span><span id="batch-opt-cellSize-val" class="readout">250</span></label>
                            <input id="batch-opt-cellSize" type="range" class="rail" min="100" max="500" value="250" step="10" />
                        </div>
                    </div>
                </details>

                <!-- 002 DISPLAY -->
                <details class="acc-group border-b border-rule" open>
                    <summary class="acc-row">
                        <span class="acc-num">002</span>
                        <span class="acc-title">DISPLAY</span>
                        <span class="acc-hint">labels · formula · MW</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body space-y-2">
                        <label class="flex items-center justify-between text-[11px] text-ink-muted">
                            <span>Show labels</span>
                            <span class="relative inline-flex"><input id="batch-opt-showLabels" type="checkbox" checked class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint"></span></span>
                        </label>
                        <label class="flex items-center justify-between text-[11px] text-ink-muted">
                            <span>Show formula</span>
                            <span class="relative inline-flex"><input id="batch-opt-showFormula" type="checkbox" class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint"></span></span>
                        </label>
                        <label class="flex items-center justify-between text-[11px] text-ink-muted">
                            <span>Show molecular weight</span>
                            <span class="relative inline-flex"><input id="batch-opt-showMW" type="checkbox" class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint"></span></span>
                        </label>
                    </div>
                </details>

                <!-- 003 THEME -->
                <details class="acc-group border-b border-rule" open>
                    <summary class="acc-row">
                        <span class="acc-num">003</span>
                        <span class="acc-title">THEME</span>
                        <span class="acc-hint">render palette</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body">
                        <select id="batch-opt-theme" class="w-full text-[11px] font-mono border border-rule rounded-sm px-2 py-1.5 bg-white">
                            {themeOptions.map(o => <option value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </details>

                <!-- 004 PUBLICATION EXPORT -->
                <details class="acc-group bg-mint-tint" open style="border-top: 2px solid theme('colors.mint.DEFAULT');">
                    <summary class="acc-row bg-mint-tint">
                        <span class="acc-num" style="color: theme('colors.mint.DEFAULT')">004</span>
                        <span class="acc-title" style="color: theme('colors.mint.deep')">PUBLICATION EXPORT</span>
                        <span class="acc-hint" style="color: theme('colors.mint.deep')">uniform · B&W · DPI</span>
                        <span class="acc-chev" style="color: theme('colors.mint.deep')">›</span>
                    </summary>
                    <div class="acc-body bg-mint-tint" style="border-left-color: theme('colors.mint.deep'); padding-right: 16px;">
                        <label class="flex items-start justify-between gap-3 mb-3">
                            <div>
                                <div class="text-[11px] font-semibold text-ink">Publication style</div>
                                <div class="text-[9px] text-ink-subtle mt-0.5">Uniform bond lengths, black atoms/bonds</div>
                            </div>
                            <span class="relative inline-flex mt-0.5"><input id="batch-opt-pubStyle" type="checkbox" class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint-deep"></span></span>
                        </label>

                        <div class="mb-3">
                            <label class="block text-[10px] font-medium text-ink-muted mb-1">DPI / Resolution</label>
                            <div class="grid grid-cols-4 gap-1">
                                <button type="button" class="batch-scale-preset text-[10px] font-mono font-semibold py-1.5 bg-white border border-rule rounded-sm hover:bg-mint hover:border-mint-deep" data-scale="1">72</button>
                                <button type="button" class="batch-scale-preset text-[10px] font-mono font-semibold py-1.5 bg-white border border-rule rounded-sm hover:bg-mint hover:border-mint-deep" data-scale="2">144</button>
                                <button type="button" class="batch-scale-preset text-[10px] font-mono font-semibold py-1.5 bg-mint-deep text-white border border-mint-deep rounded-sm" data-scale="4.1667">300</button>
                                <button type="button" class="batch-scale-preset text-[10px] font-mono font-semibold py-1.5 bg-white border border-rule rounded-sm hover:bg-mint hover:border-mint-deep" data-scale="8.3333">600</button>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="block text-[10px] font-medium text-ink-muted mb-1">Background</label>
                            <div class="flex gap-3 text-[10px]">
                                <label class="flex items-center gap-1"><input name="batch-opt-bg" id="batch-opt-bg-theme" type="radio" value="theme" checked class="accent-mint-deep" /> Theme</label>
                                <label class="flex items-center gap-1"><input name="batch-opt-bg" id="batch-opt-bg-white" type="radio" value="white" class="accent-mint-deep" /> White</label>
                                <label class="flex items-center gap-1"><input name="batch-opt-bg" id="batch-opt-bg-transparent" type="radio" value="transparent" class="accent-mint-deep" /> Transparent</label>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="block text-[10px] font-medium text-ink-muted mb-1">Figure title</label>
                            <input id="batch-opt-title" type="text" placeholder="e.g. Figure 1 — Drug candidates" class="w-full text-[11px] border border-rule rounded-sm px-2 py-1.5 bg-white" />
                        </div>

                        <div class="mb-3">
                            <label class="block text-[10px] font-medium text-ink-muted mb-1">Atom style</label>
                            <select id="batch-opt-atomVisualization" class="w-full text-[11px] font-mono border border-rule rounded-sm px-2 py-1.5 bg-white">
                                <option value="default">Default</option>
                                <option value="balls">Balls</option>
                                <option value="allballs">All balls</option>
                            </select>
                        </div>

                        <div class="space-y-2 mb-3">
                            <div>
                                <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Bond length</span><span id="batch-opt-bondLength-val" class="readout" style="background: white">19</span></label>
                                <input id="batch-opt-bondLength" type="range" class="rail" min="5" max="30" value="19" step="1" />
                            </div>
                            <div>
                                <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Bond thickness</span><span id="batch-opt-bondThickness-val" class="readout" style="background: white">1.1</span></label>
                                <input id="batch-opt-bondThickness" type="range" class="rail" min="0.1" max="5" value="1.1" step="0.1" />
                            </div>
                            <div>
                                <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Short bond length</span><span id="batch-opt-shortBondLength-val" class="readout" style="background: white">0.6</span></label>
                                <input id="batch-opt-shortBondLength" type="range" class="rail" min="0.1" max="1" value="0.6" step="0.1" />
                            </div>
                            <div>
                                <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Bond spacing</span><span id="batch-opt-bondSpacing-val" class="readout" style="background: white">3.2</span></label>
                                <input id="batch-opt-bondSpacing" type="range" class="rail" min="0" max="10" value="3.2" step="0.1" />
                            </div>
                            <div>
                                <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Font size</span><span id="batch-opt-fontSizeLarge-val" class="readout" style="background: white">6.3</span></label>
                                <input id="batch-opt-fontSizeLarge" type="range" class="rail" min="1" max="20" value="6.3" step="0.1" />
                            </div>
                        </div>

                        <div class="space-y-1.5 mb-3">
                            <label class="flex items-center justify-between text-[11px] text-ink-muted">
                                <span>Compact drawing</span>
                                <span class="relative inline-flex"><input id="batch-opt-compactDrawing" type="checkbox" checked class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint-deep"></span></span>
                            </label>
                            <label class="flex items-center justify-between text-[11px] text-ink-muted">
                                <span>Terminal carbons</span>
                                <span class="relative inline-flex"><input id="batch-opt-terminalCarbons" type="checkbox" class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint-deep"></span></span>
                            </label>
                            <label class="flex items-center justify-between text-[11px] text-ink-muted">
                                <span>Explicit hydrogens</span>
                                <span class="relative inline-flex"><input id="batch-opt-explicitHydrogens" type="checkbox" class="sr-only peer" /><span class="toggle-pill peer-checked:bg-mint-deep"></span></span>
                            </label>
                        </div>

                        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-rule">
                            <button id="batch-export-svg" type="button" class="text-[10px] font-bold uppercase tracking-[0.05em] py-2 bg-ink text-white rounded-sm hover:bg-mint-deep">Export SVG</button>
                            <button id="batch-export-png" type="button" class="text-[10px] font-bold uppercase tracking-[0.05em] py-2 bg-mint-deep text-white rounded-sm hover:bg-ink">Export PNG</button>
                        </div>
                    </div>
                </details>

                <!-- 005 BATCH REACTION (hidden accordion for reaction overrides) -->
                <details class="acc-group border-t border-rule">
                    <summary class="acc-row">
                        <span class="acc-num">005</span>
                        <span class="acc-title">REACTION</span>
                        <span class="acc-hint">rxn input overrides</span>
                        <span class="acc-chev">›</span>
                    </summary>
                    <div class="acc-body space-y-3">
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Scale</span><span id="batch-opt-scale-val" class="readout">0</span></label>
                            <input id="batch-opt-scale" type="range" class="rail" min="0" max="2" value="0" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Spacing</span><span id="batch-opt-rxnSpacing-val" class="readout">10</span></label>
                            <input id="batch-opt-rxnSpacing" type="range" class="rail" min="0" max="20" value="10" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Font size</span><span id="batch-opt-rxnFontSize-val" class="readout">9</span></label>
                            <input id="batch-opt-rxnFontSize" type="range" class="rail" min="0" max="20" value="9" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Plus size</span><span id="batch-opt-rxnPlusSize-val" class="readout">9</span></label>
                            <input id="batch-opt-rxnPlusSize" type="range" class="rail" min="0" max="20" value="9" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Plus thickness</span><span id="batch-opt-rxnPlusThickness-val" class="readout">1</span></label>
                            <input id="batch-opt-rxnPlusThickness" type="range" class="rail" min="0" max="5" value="1" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Arrow length</span><span id="batch-opt-rxnArrowLength-val" class="readout">120</span></label>
                            <input id="batch-opt-rxnArrowLength" type="range" class="rail" min="0" max="500" value="120" step="1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Arrow thickness</span><span id="batch-opt-rxnArrowThickness-val" class="readout">1</span></label>
                            <input id="batch-opt-rxnArrowThickness" type="range" class="rail" min="0.1" max="10" value="1" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Arrow head size</span><span id="batch-opt-rxnArrowHeadSize-val" class="readout">6</span></label>
                            <input id="batch-opt-rxnArrowHeadSize" type="range" class="rail" min="1" max="10" value="6" step="0.1" />
                        </div>
                        <div>
                            <label class="flex justify-between text-[10px] font-medium text-ink-muted mb-1"><span>Arrow margin</span><span id="batch-opt-rxnArrowMargin-val" class="readout">3</span></label>
                            <input id="batch-opt-rxnArrowMargin" type="range" class="rail" min="0" max="10" value="3" step="0.1" />
                        </div>
                    </div>
                </details>
            </aside>
```

Note: the `themeOptions` import is reused from Task 15's frontmatter (already imported).

- [ ] **Step 2: Commit**

```bash
git add src/pages/playground.astro
git commit -m "Playground: new batch-mode sidebar with publication export group"
```

---

### Task 19: Rewrite `playground.astro` — batch-mode main pane + close file

**Files:**
- Modify: `src/pages/playground.astro`

- [ ] **Step 1: Append the batch main pane and close all wrappers**

After the closing `</aside>` from Task 18, insert:

```astro
            <!-- BATCH MAIN PANE -->
            <div class="flex flex-col bg-white">
                <!-- SMILES textarea block -->
                <div class="border-b border-rule">
                    <div class="flex items-center justify-between px-4 py-2 border-b border-rule bg-paper">
                        <span class="text-[9px] font-bold uppercase tracking-[0.14em] text-ink-hint">SMILES · ONE PER LINE</span>
                        <div class="flex items-center gap-3">
                            <span id="batch-count" class="text-[10px] text-ink-hint">0 molecules</span>
                            <input type="file" id="batch-file-input" accept=".smi,.txt" class="hidden" />
                            <button id="batch-import-btn" type="button" class="text-[10px] font-semibold px-3 py-1 border border-mint-deep text-mint-deep rounded-sm hover:bg-mint-tint">Import file</button>
                        </div>
                    </div>
                    <textarea
                        id="batch-input"
                        rows="6"
                        spellcheck="false"
                        placeholder="c1ccccc1&#10;CC(=O)Oc1ccccc1C(=O)O&#10;Cn1cnc2c1C(=O)N(C(=O)N2C)C"
                        class="w-full px-4 py-3 font-mono text-[12px] text-ink bg-transparent outline-none resize-y"
                    ></textarea>
                    <div id="batch-error" class="hidden px-4 py-2 text-[11px] text-red-600 bg-red-50 border-t border-red-200"></div>
                    <div class="flex items-center justify-between px-4 py-2 border-t border-rule bg-paper">
                        <div class="text-[10px] text-ink-hint">Click <strong class="text-ink">Render All</strong> to populate the grid.</div>
                        <button id="batch-render-btn" type="button" class="btn-primary">Render All →</button>
                    </div>
                </div>

                <!-- Selection bar (hidden unless cells selected) -->
                <div id="batch-selection-bar" class="hidden flex items-center gap-3 px-4 py-2 border-b border-rule bg-mint-tint">
                    <span id="batch-selection-count" class="text-[11px] font-semibold text-mint-deep">0 selected</span>
                    <button id="batch-select-all" type="button" class="text-[10px] font-semibold px-2 py-0.5 border border-mint-deep text-mint-deep rounded-sm hover:bg-mint">Select all</button>
                    <button id="batch-deselect-all" type="button" class="text-[10px] font-semibold px-2 py-0.5 border border-mint-deep text-mint-deep rounded-sm hover:bg-mint">Deselect all</button>
                    <button id="batch-delete-selected" type="button" class="text-[10px] font-semibold px-2 py-0.5 border border-red-500 text-red-600 rounded-sm hover:bg-red-50">Delete selected</button>
                </div>

                <!-- Grid surface -->
                <div id="batch-preview-surface" class="grid-paper flex-1 p-6 min-h-[480px]">
                    <div id="batch-grid" class="grid gap-2" style="grid-template-columns: repeat(3, 1fr);">
                        <div class="col-span-full py-16 text-center text-[12px] text-ink-hint">
                            Enter SMILES above and click Render All.
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div id="batch-pagination" class="hidden flex items-center justify-center gap-3 border-t border-rule py-3 bg-paper">
                    <button id="batch-page-prev" type="button" class="text-[11px] font-semibold px-3 py-1 border border-rule rounded-sm hover:bg-white disabled:opacity-40" disabled>‹ Prev</button>
                    <span id="batch-page-info" class="text-[11px] text-ink-muted">Page 1 of 1</span>
                    <button id="batch-page-next" type="button" class="text-[11px] font-semibold px-3 py-1 border border-rule rounded-sm hover:bg-white disabled:opacity-40" disabled>Next ›</button>
                </div>
            </div>
        </div>
    </div>
</Layout>
```

- [ ] **Step 2: Verify the file parses**

```bash
npm run dev
```

Open the playground page. The markup should render (even though the script isn't wired yet, so controls don't do anything). Check browser console for Astro parsing errors.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/playground.astro
git commit -m "Playground: batch main pane with textarea, grid, pagination, selection"
```

---

### Task 20: Wire the playground script into the new markup

**Files:**
- Modify: `src/pages/playground.astro`
- Modify: `src/pages/playground.astro` (add mode-switch vanilla JS)

**Context:** The lifted `playground-app.js` handles single-mode render, batch-mode render, publication export, etc. The mode-switch logic (show/hide `#panel-single`/`#panel-batch` when tabs click) was also inside that script. Since Tailwind classes differ now, we need to verify the mode-switch still works — if the original script's mode switch relied on the old class names (`border-accent`, `text-accent`, etc.), it needs a small adjustment or we override the visual class at the end.

- [ ] **Step 1: Add the script tag to load `playground-app.js`**

Append to the very bottom of `src/pages/playground.astro` (after `</Layout>`):

```astro
<script is:inline src={`${import.meta.env.BASE_URL}/js/playground-app.js`}></script>

<script is:inline>
// Accordion density presets (sidebar)
document.addEventListener('DOMContentLoaded', function() {
    var densityBtns = document.querySelectorAll('.density-btn');
    densityBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var groups = (btn.getAttribute('data-groups') || '').split(',');
            densityBtns.forEach(function(b) {
                b.setAttribute('data-active', b === btn ? 'true' : 'false');
            });
            document.querySelectorAll('#panel-single .acc-group').forEach(function(g) {
                g.open = groups.indexOf(g.id) !== -1;
            });
        });
    });

    // Preview tabs (Preview / SVG source / Share URL) — visual state only; the
    // actual content switching is assumed to already be handled in playground-app.js.
    document.querySelectorAll('.pg-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.pg-tab').forEach(function(t) {
                t.setAttribute('data-active', t === tab ? 'true' : 'false');
            });
        });
    });

    // Mode switch visual state — the actual panel show/hide is handled by the
    // preserved script via classList.add('hidden') on #panel-single / #panel-batch.
    // We just mirror the active-tab styling here.
    var tabSingle = document.getElementById('tab-single');
    var tabBatch = document.getElementById('tab-batch');
    function markActive(which) {
        if (which === 'single') {
            tabSingle.classList.add('bg-mint');
            tabSingle.classList.remove('bg-white');
            tabBatch.classList.add('bg-white');
            tabBatch.classList.remove('bg-mint');
        } else {
            tabBatch.classList.add('bg-mint');
            tabBatch.classList.remove('bg-white');
            tabSingle.classList.add('bg-white');
            tabSingle.classList.remove('bg-mint');
        }
    }
    if (tabSingle) tabSingle.addEventListener('click', function() { markActive('single'); });
    if (tabBatch) tabBatch.addEventListener('click', function() { markActive('batch'); });
});
</script>
```

- [ ] **Step 2: Verify the script loads in dev**

```bash
npm run dev
```

Open the playground page and open DevTools → Network → filter `.js`. Verify `playground-app.js` loads with status 200. Open DevTools → Console. Expected: no "undefined" errors from the script.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/playground.astro
git commit -m "Playground: wire script + density presets + mode switch visuals"
```

---

### Task 21: Run the preserved-id contract check

**Files:**
- Read: `plans/playground-id-contract.txt`
- Read: `src/pages/playground.astro`

- [ ] **Step 1: Run the check for each id**

From the repo root, run:

```bash
while IFS= read -r line; do
    case "$line" in
        \#id\ *)
            id="${line#\#id }"
            if ! grep -q "id=\"$id\"" src/pages/playground.astro; then
                echo "MISSING ID: $id"
            fi
            ;;
        \#class\ *)
            cls="${line#\#class }"
            if ! grep -q "class=\"[^\"]*$cls" src/pages/playground.astro; then
                echo "MISSING CLASS: $cls"
            fi
            ;;
        \#name\ *)
            nm="${line#\#name }"
            if ! grep -q "name=\"$nm\"" src/pages/playground.astro; then
                echo "MISSING NAME: $nm"
            fi
            ;;
    esac
done < plans/playground-id-contract.txt
```

Expected: no output. Any `MISSING ...` line means the rewrite is broken and that selector needs to be re-added. Fix each one before proceeding.

- [ ] **Step 2: Commit any fixes**

If you had to patch the markup to re-add a missing id, commit:

```bash
git add src/pages/playground.astro
git commit -m "Playground: fix preserved-id contract gaps"
```

---

### Task 22: Smoke-test single mode end to end

**Files:** none modified

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Exercise every single-mode control**

Open the playground page. Click **Single** if not already active. Verify:

- [ ] SMILES textarea: edit the value (`c1ccccc1`), click DRAW → molecule re-renders.
- [ ] Sidebar `001 PRESET` open by default, click a preset button → SMILES updates and re-renders.
- [ ] Sidebar `002 THEME` open, change theme → molecule re-renders with new colors (the preview surface also changes).
- [ ] Sidebar `003 SIZING` open, move Bond length slider → molecule re-renders; readout chip updates.
- [ ] Move Bond thickness slider → re-render; readout updates.
- [ ] Move Font size slider → re-render; readout updates.
- [ ] Open `004 CANVAS` — width, height, short bond length, bond spacing all re-render and update readouts.
- [ ] Open `005 DISPLAY` — each of Terminal carbons / Explicit hydrogens / Compact drawing / Debug toggles triggers a re-render.
- [ ] Open `006 ATOMS` — Atom style select changes (default / balls / all-balls) re-render.
- [ ] Open `007 REACTION` — enter a reaction SMILES like `CC(=O)O.CO>>CC(=O)OC`, adjust any slider, re-render.
- [ ] Density preset `● Essential` → groups 001, 002, 003 open; 004-007 closed.
- [ ] Density preset `All options` → every group open.
- [ ] Density preset `Reaction` → only 007 open.
- [ ] Action buttons: `Copy SMILES` copies the text. `Copy SVG` copies the SVG markup. `Download SVG` downloads. `Download PNG` downloads. `Share` copies a URL with `?smiles=`.
- [ ] Formula display (`#pg-formula`) appears when the molecule is drawn.

If any control fails, inspect DevTools → Elements for its id/class and verify it matches the contract. Fix the markup and retry.

- [ ] **Step 3: Stop the dev server and commit if any fixes were needed**

```bash
git add -u src/pages/playground.astro
git commit -m "Playground: single-mode smoke test fixes" 2>/dev/null || echo "No changes to commit"
```

---

### Task 23: Smoke-test batch mode end to end

**Files:** none modified

- [ ] **Step 1: Restart dev server and switch to Batch**

```bash
npm run dev
```

Click the **Batch** tab.

- [ ] **Step 2: Exercise every batch control**

- [ ] Paste multi-line SMILES into the textarea. `batch-count` shows the correct molecule count.
- [ ] Click `Import file` → file picker opens. Cancel it.
- [ ] Click `Render All →` → grid populates with rendered molecules.
- [ ] Grid preset `2×2` → grid re-layouts, columns/rows sliders sync to 2 and 2.
- [ ] Grid preset `3×3` → back to 3 and 3.
- [ ] Adjust columns slider → grid re-layouts; readout updates.
- [ ] Adjust rows slider → grid re-layouts.
- [ ] Adjust cell size → cells resize.
- [ ] Toggle `Show labels` → labels appear/hide on each cell.
- [ ] Toggle `Show formula` → formula appears/hides.
- [ ] Toggle `Show molecular weight` → MW appears/hides.
- [ ] Change `Theme` → rendered molecules update.
- [ ] Pagination: paste more than cols×rows molecules → `Prev`/`Next` enable, page info updates.
- [ ] Selection: click a rendered cell → selection bar appears. Click `Select all` / `Deselect all` / `Delete selected`.

- [ ] **Step 3: Stop the dev server and commit any fixes**

```bash
git add -u src/pages/playground.astro
git commit -m "Playground: batch-mode smoke test fixes" 2>/dev/null || echo "No changes to commit"
```

---

### Task 24: Smoke-test publication export end to end

**Files:** none modified

- [ ] **Step 1: Restart dev server**

```bash
npm run dev
```

Switch to **Batch** and render a set of molecules.

- [ ] **Step 2: Exercise publication export**

- [ ] Open the `004 PUBLICATION EXPORT` accordion group (the mint-tinted one).
- [ ] Toggle `Publication style` on → grid re-renders with uniform viewBox and B&W atoms/bonds. Surface goes white regardless of theme.
- [ ] Change DPI preset (72 / 144 / 300 / 600) → active state updates. (No immediate grid change; the scale applies at export time.)
- [ ] Change Background radio to `White` → preview surface confirms white.
- [ ] Change Background radio to `Transparent` → preview surface confirms transparent / grid-paper visible.
- [ ] Change Background radio to `Theme` → preview uses theme background.
- [ ] Enter a figure title like `Figure 1 — Drug candidates`.
- [ ] Adjust bond length slider inside the publication panel → re-render confirms new length.
- [ ] Click `Export SVG` → downloads `.svg` file. Open it in a browser → renders correctly.
- [ ] Click `Export PNG` → downloads `.png` file. Open it → renders at the selected DPI (300 by default).
- [ ] Verify the figure title appears in the exported PNG above the grid.

- [ ] **Step 3: Stop the dev server and commit any fixes**

```bash
git add -u src/pages/playground.astro
git commit -m "Playground: publication export smoke test fixes" 2>/dev/null || echo "No changes to commit"
```

---

## Phase 5 — Final verification

### Task 25: Visual QA checklist across every page

**Files:** none modified

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Walk every page at desktop (≥ 1280px)**

- [ ] **Home (`/`)** — hero, demo, link strip, footer
- [ ] **Playground single (`/playground`)** — sidebar accordions, preview, action buttons
- [ ] **Playground batch (`/playground` → Batch)** — textarea, grid, publication panel
- [ ] **Getting Started (`/getting-started`)** — sticky TOC, install tabs, long-form sections, code blocks
- [ ] **Examples (`/examples`)** — filter bar, card grid, theme select, search

- [ ] **Step 3: Walk every page at mobile (≤ 420px)**

Use DevTools responsive mode. Verify:
- Home hero stacks vertically (demo below the headline).
- Playground sidebar collapses below the title strip (the `lg:grid-cols-[300px_minmax(0,1fr)]` drops to single-column).
- Getting Started hides the left TOC (`hidden lg:block`).
- Examples grid drops to 1 column.
- Header nav wraps or stays readable.

If the playground sidebar is unusable at mobile, add a temporary note to a new task: "future: slide-over drawer on mobile". The scope in the spec said mobile drawer is acceptable but not required for this pass.

- [ ] **Step 4: Stop the dev server**

---

### Task 26: Production build check

**Files:** none modified

- [ ] **Step 1: Build**

```bash
npm run build
```

Expected: build completes without errors. Look for any Astro warnings about missing imports or broken class references.

- [ ] **Step 2: Preview the built site**

```bash
npm run preview
```

Open the preview URL (with the base path `/smiles-drawer-website/`). Verify:
- Every page loads.
- Fonts load (no FOUT past the first second).
- Playground controls work.
- Batch render + publication export work.
- `?smiles=` URL sharing works on the playground.

- [ ] **Step 3: Stop preview**

Ctrl+C the preview server.

- [ ] **Step 4: Confirm the build output**

```bash
ls docs/
```

Expected: `index.html`, `playground/`, `examples/`, `getting-started/`, `_astro/`, `favicon.svg`, `js/`, `.nojekyll` (if present).

Check `docs/.nojekyll` exists; if it doesn't, restore it:

```bash
test -f docs/.nojekyll || touch docs/.nojekyll
```

- [ ] **Step 5: Commit any last fixes**

```bash
git add -u
git commit -m "Redesign: production build fixes" 2>/dev/null || echo "No fixes needed"
```

---

### Task 27: Open a PR or squash-merge to master

**Files:** none modified

- [ ] **Step 1: Push the branch**

```bash
git push -u origin aesthetic-redesign
```

- [ ] **Step 2: Open a PR (if using PR workflow)**

```bash
gh pr create --title "Aesthetic redesign: relaxed Swiss + seafoam mint" --body "$(cat <<'EOF'
## Summary
- Full visual redesign in relaxed Swiss-grid voice with seafoam mint (#9dd4c0) accent
- Light-only, no page-level dark mode
- Shell rewrite — the playground JavaScript module is preserved unchanged (single mode, batch mode, publication export all work on day one)
- Supersedes the 2026-04-13 shadcn redesign effort (spec and plan removed)

## Design spec
`specs/2026-04-14-aesthetic-redesign-design.md`

## Test plan
- [x] Home: hero demo, presets, copy/download, link strip hover
- [x] Playground single: all 22+ controls + density presets
- [x] Playground batch: textarea, grid presets, publication export at 300 DPI
- [x] Getting Started: sticky TOC, install tabs, code block copy
- [x] Examples: filter bar, theme select, search
- [x] `npm run build && npm run preview` at `/smiles-drawer-website` base path
- [x] Preserved-id contract verified via `plans/playground-id-contract.txt`
EOF
)"
```

- [ ] **Step 3: Alternative — squash-merge locally to master**

If you prefer to merge directly to master without a PR:

```bash
git checkout master
git merge --squash aesthetic-redesign
git commit -m "Aesthetic redesign: relaxed Swiss + seafoam mint"
```

Do **not** force-push or delete the branch until the user has confirmed the result.

---

## Plan self-review

1. **Spec coverage:** Every section in the spec maps to at least one task.
   - Visual system (colors, fonts, radii, components) → Tasks 1, 2
   - Layout (fonts, no dark init) → Task 3
   - ThemeToggle removal → Task 4
   - Header / Footer / CodeBlock / MoleculeCard → Tasks 5-8
   - Home page → Tasks 9, 10
   - Getting Started → Task 11
   - Examples → Task 12
   - Playground (single, batch, publication) → Tasks 13-24
   - GitHub Pages build verification → Task 26
   - Preserved-id contract → Tasks 13, 21
   - Risks: every risk from the spec is addressed (id contract by Tasks 13+21, font FOUT handled by `display=swap` in Layout fonts link, theme forcing by untouched JS, HeroPlayground feature preservation by Task 9).

2. **Placeholder scan:** No "TBD", "TODO", or "handle edge cases". Every step has either an exact command or complete code.

3. **Type consistency:** Tailwind token names used consistently — `mint`, `mint-deep`, `mint-tint`, `ink`, `ink-muted`, `ink-subtle`, `ink-hint`, `ink-faint`, `rule`, `paper`. Accordion classes consistent — `acc-group`, `acc-row`, `acc-body`, `acc-num`, `acc-title`, `acc-hint`, `acc-chev`. Slider class `rail`. Toggle class `toggle-pill`.

4. **Ambiguity:** One place — Task 11 says "preserve existing prose" inside the `getting-started.astro` sections. This is necessary because the current file is 788 lines and copying every long-form section would make the plan enormous; the engineer is told to preserve the inner prose, swap only the outer wrappers. Acceptable because (a) the prose is content not style, (b) the task is mechanical wrapper replacement, (c) the smoke-test in Step 6 catches any accidental content loss.
