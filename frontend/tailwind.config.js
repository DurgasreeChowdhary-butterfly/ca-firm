/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        blue: {
          950: '#0a1628',
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease forwards',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
