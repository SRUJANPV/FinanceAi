/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: { extend: { colors: { ink: '#101828', brand: { 500: '#635bff', 600: '#5148ee' } }, boxShadow: { glow: '0 12px 40px rgba(99,91,255,.2)' } } },
  plugins: []
};
