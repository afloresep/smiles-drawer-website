/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    // Keep `dark:*` variants gated on a class that never gets added.
    // Without this, Tailwind defaults to 'media' and OS dark-mode leaks through
    // every old `dark:text-gray-400` / `dark:bg-gray-900` in legacy markup.
    darkMode: 'class',
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
