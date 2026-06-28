/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4F46E5', 50: '#EEEEFF', 100: '#DDD9FF', 500: '#4F46E5', 600: '#4338CA', 700: '#3730A3' },
        secondary: { DEFAULT: '#8B5CF6', 500: '#8B5CF6', 600: '#7C3AED' },
        accent: { DEFAULT: '#06B6D4', 500: '#06B6D4' },
        dark: { DEFAULT: '#0F172A', 50: '#F8FAFC', 100: '#F1F5F9', 800: '#1E293B', 900: '#0F172A' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], display: ['Clash Display', 'Inter', 'sans-serif'] },
      animation: { 'float': 'float 6s ease-in-out infinite', 'glow': 'glow 2s ease-in-out infinite' },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        glow: { '0%,100%': { boxShadow: '0 0 20px rgba(79,70,229,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(79,70,229,0.6)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
