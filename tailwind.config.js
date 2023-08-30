/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        dg: {
          gray: '#0D1821',
          blue: '#3083DC',
        },
      },
    },
  },
  plugins: [],
};
