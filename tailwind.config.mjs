/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                accent: {
                    DEFAULT: '#50C5A9',
                    50: '#E8F8F4',
                    100: '#D1F1E9',
                    200: '#A3E3D3',
                    300: '#76D5BD',
                    400: '#50C5A9',
                    500: '#3BA88E',
                    600: '#2D8070',
                    700: '#205A4F',
                    800: '#133530',
                    900: '#091A18',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
        },
    },
    plugins: [],
};
