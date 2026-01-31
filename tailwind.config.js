/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false, // Desactivar preflight para no afectar estilos existentes
  },
  theme: {
    extend: {},
  },
  plugins: [],
}


