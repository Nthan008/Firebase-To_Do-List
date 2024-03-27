/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      'dark-rosemary': '#465a5e',
      'dark-coffee-brown': '#3e2723',
      'very-dark-pewter-gray': '#333333',
      'light-brown': '#A87F6B',
      'custom-bg': '#fce7d2',
    },
    
  },  

}
}
