/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2D5A27", // Verde Ambiental
        secondary: "#FFD700", // Amarelo Alerta
      },
    },
  },
  plugins: [],
};
