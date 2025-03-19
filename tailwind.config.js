/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '380px', // Very small mobile devices
        'sm': '640px', // Small tablets and large phones
        'md': '768px', // Tablets
        'lg': '1024px', // Small laptops
        'xl': '1280px', // Desktops
        '2xl': '1536px', // Large desktops
      },
      animation: {
        'pulse-light': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-light': 'bounce 1s ease-out 1',
        'fade-in-down': 'fadeInDown 0.2s ease-out',
      },
      keyframes: {
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      // Custom touch-friendly focus styles
      ringWidth: {
        DEFAULT: '2px',
        '0': '0',
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
    },
  },
  plugins: [],
} 