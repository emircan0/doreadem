/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F5ECD8',
          300: '#EFE2C3',
          400: '#E9D8AE',
          500: '#E3CE99',
          600: '#D4BA77',
          700: '#C5A655',
          800: '#B69233',
          900: '#8C6F27',
        },
        brown: {
          50: '#F9F7F5',
          100: '#F3EFEB',
          200: '#E7DFD7',
          300: '#DBCFC3',
          400: '#CFBFAF',
          500: '#C3AF9B',
          600: '#B79F87',
          700: '#AB8F73',
          800: '#8B715A',
          900: '#6B5341',
        },
        lux: {
          light: '#FFFBF7',
          bg: '#FFF9F1',
          dark: '#143621', // Deep Forest Green
          accent: '#DB2777', // Deep Rose
          gold: '#8BA18E', // Sage Green
          muted: '#637A69',
          border: 'rgba(20, 54, 33, 0.08)',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['"Playfair Display"', 'serif'],
        'display': ['"Cormorant Garamond"', 'serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.4em',
        'mega-wide': '0.6em',
      },
      animation: {
        'reveal': 'reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'scale-up': 'scaleUp 0.5s ease-out forwards',
        'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        reveal: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.1) translate(-2%, -2%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}