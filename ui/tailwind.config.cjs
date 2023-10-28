/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{svelte,js,ts}'],
  daisyui: {
    themes: ['autumn']
  },
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}

