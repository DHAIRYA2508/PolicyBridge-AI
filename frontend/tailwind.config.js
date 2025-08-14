/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FBF9F4',
          100: '#F5F0E6',
          200: '#FAF3E0',
          300: '#F0E8D0',
          400: '#E6DDB8',
          500: '#DCD2A0',
          600: '#D2C788',
          700: '#C8BC70',
          800: '#BEB158',
          900: '#B4A640'
        },
        secondary: {
          50: '#F2F3F1',
          100: '#E6E7E3',
          200: '#CDCFC7',
          300: '#B4B7AB',
          400: '#9B9F8F',
          500: '#4B5945',
          600: '#3F4A3A',
          700: '#333B2F',
          800: '#272C24',
          900: '#1B1D19'
        },
        accent1: {
          50: '#FDF6F5',
          100: '#FBE8E5',
          200: '#F7D1CB',
          300: '#F3BAB1',
          400: '#EFA397',
          500: '#D97B66',
          600: '#C36552',
          700: '#AD4F3E',
          800: '#97392A',
          900: '#812316'
        },
        accent2: {
          50: '#FDF9F0',
          100: '#FBF3E0',
          200: '#F7E7C1',
          300: '#F3DBA2',
          400: '#EFCF83',
          500: '#E6B566',
          600: '#D9A54F',
          700: '#CC9538',
          800: '#BF8521',
          900: '#B2750A'
        },
        surface: {
          50: '#FBF9F4',
          100: '#FAF3E0',
          200: '#F5E8C0',
          300: '#F0DDA0',
          400: '#EBD280',
          500: '#E6C760',
          600: '#E1BC40',
          700: '#DCB120',
          800: '#D7A600',
          900: '#D29B00'
        },
        text: {
          primary: '#2B2B2B',
          secondary: '#6E6B66',
          muted: '#9E9B96'
        },
        danger: '#B55239'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
    }
  },
  plugins: []
}
