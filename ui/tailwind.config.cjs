/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/routes/**/*.{svelte,js,ts}'],
  daisyui: {
    themes: ['autumn']
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

