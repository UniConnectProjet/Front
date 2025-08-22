/** @type {import('tailwindcss').Config} */
/* eslint-disable no-undef */  // 🚀 Ignore l'erreur "no-undef"

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Inclut tous les fichiers React
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Ajouter Poppins comme font
      },
      fontSize: {
        title: ['38px', { lineHeight: '64px', fontWeight: '700' }], // Titre
        subtitle: ['18px', { lineHeight: '32px', fontWeight: '700' }], // Sous-titre
        text: ['14px', { lineHeight: '16px', fontWeight: '400' }], // Texte normal
      },
      colors: {
        primary: {
          100: "#cdedfb",
          200: "#9bdaf7",
          300: "#68c8f2",
          400: "#36b5ee",
          500: "#04a3ea",
          600: "#0382bb",
          700: "#02628c",
          800: "#02415e",
        },
        secondary: {
          100: "#d5fafa",
          200: "#abf5f5",
          300: "#82eff0",
          400: "#58eaeb",
          500: "#2ee5e6",
          600: "#25b7b8",
          700: "#1c898a",
          800: "#125c5c",
        },
        text: {
          100: "#d6d6d6",
          200: "#adadad",
          300: "#858585",
          400: "#5c5c5c",
          500: "#333333",
          600: "#292929",
          700: "#1f1f1f",
          800: "#141414",
        },
        buttonColor: {
          100: "#d5e3fa",
          200: "#abc6f5",
          300: "#82aaf0",
          400: "#588deb",
          500: "#2e71e6",
          600: "#255ab8",
          700: "#1c448a",
          800: "#122d5c",
        },
        background: '#FFF', // Couleur de fond
      },
      backgroundImage: {
        'blue-to-white': 'linear-gradient(to bottom, #04A3EA, #FFFFFF)', // Dégradé bleu à blanc
      },
    },
  },
  plugins: [],
};