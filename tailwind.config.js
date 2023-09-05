/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dg: {
          gray: '#0D1821',
          blue: '#3083DC',
        },
        'light-gray': 'rgb(217, 217, 217)',
        light: {
          text: '#373737',
          button: '#F6F7F9',
        },
        dark: {
          button: '#383838',
          btnHover: '#404040',
        },
      },
    },
  },
  plugins: [],
};
