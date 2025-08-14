/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sunlit Ocean Theme
        primary: {
          50: '#FFFBF0',   // Very light cream
          100: '#FFF8E1',  // Light cream
          200: '#FFECB3',  // Soft cream
          300: '#FFE082',  // Medium cream
          400: '#FFD54F',  // Medium yellow
          500: '#FFD700',  // Bright Yellow (main)
          600: '#FFC107',  // Darker yellow
          700: '#FFB300',  // Deep yellow
          800: '#FF8F00',  // Dark yellow
          900: '#FF6F00',  // Very dark yellow
        },
        secondary: {
          50: '#F0F4F8',   // Very light navy
          100: '#E1E8F0',  // Light navy
          200: '#C3D1E0',  // Soft navy
          300: '#A4B9D1',  // Medium navy
          400: '#86A2C2',  // Medium blue
          500: '#1E3A5F',  // Dark Blue / Navy (main)
          600: '#1A3454',  // Darker navy
          700: '#162E49',  // Deep navy
          800: '#12283E',  // Very dark navy
          900: '#0E2233',  // Almost black navy
        },
        accent1: {
          50: '#F0F8F0',   // Very light cream
          100: '#E8F0E8',  // Light cream
          200: '#D1E0D1',  // Soft cream
          300: '#B9D1B9',  // Medium cream
          400: '#A2C2A2',  // Medium cream
          500: '#F0E68C',  // Light Yellow / Cream (main)
          600: '#E6DC82',  // Darker cream
          700: '#DCD278',  // Deep cream
          800: '#D2C86E',  // Very dark cream
          900: '#C8BE64',  // Almost brown cream
        },
        accent2: {
          50: '#F0F8FF',   // Very light sky blue
          100: '#E1F0FF',  // Light sky blue
          200: '#C3E1FF',  // Soft sky blue
          300: '#A4D2FF',  // Medium sky blue
          400: '#86C3FF',  // Medium sky blue
          500: '#A4D7E1',  // Light Blue / Sky Blue (main)
          600: '#9ACDD7',  // Darker sky blue
          700: '#90C3CD',  // Deep sky blue
          800: '#86B9C3',  // Very dark sky blue
          900: '#7CAFB9',  // Almost blue sky blue
        },
        accent3: {
          50: '#FFF8F0',   // Very light peach
          100: '#FFF0E1',  // Light peach
          200: '#FFE1C3',  // Soft peach
          300: '#FFD2A4',  // Medium peach
          400: '#FFC386',  // Medium peach
          500: '#FFB74D',  // Orange / Peach (main)
          600: '#FFAD33',  // Darker peach
          700: '#FFA319',  // Deep peach
          800: '#FF9900',  // Very dark peach
          900: '#FF8F00',  // Almost orange peach
        },
        // Text colors
        'text-primary': '#1E3A5F',    // Dark navy for main text
        'text-secondary': '#4A5568',  // Medium gray for secondary text
        'text-muted': '#718096',      // Light gray for muted text
        'text-inverse': '#FFFFFF',    // White for text on dark backgrounds
        
        // Background colors
        'bg-primary': '#FFFBF0',      // Very light cream
        'bg-secondary': '#F0F4F8',    // Very light navy
        'bg-accent': '#FFF8E1',       // Light cream
        'bg-dark': '#1E3A5F',         // Dark navy
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(30, 58, 95, 0.07), 0 10px 20px -2px rgba(30, 58, 95, 0.04)',
        'glow': '0 0 20px rgba(255, 215, 0, 0.15)',
        'glow-lg': '0 0 40px rgba(255, 215, 0, 0.2)',
        'glow-navy': '0 0 20px rgba(30, 58, 95, 0.15)',
        'glow-peach': '0 0 20px rgba(255, 183, 77, 0.15)',
        'sunlit': '0 10px 25px -5px rgba(255, 215, 0, 0.1), 0 10px 10px -5px rgba(30, 58, 95, 0.04)',
      },
      backgroundImage: {
        'gradient-sunlit': 'linear-gradient(135deg, #FFD700 0%, #A4D7E1 50%, #1E3A5F 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #1E3A5F 0%, #A4D7E1 50%, #F0E68C 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFD700 0%, #FFB74D 50%, #F0E68C 100%)',
        'gradient-cool': 'linear-gradient(135deg, #1E3A5F 0%, #A4D7E1 50%, #F0F8FF 100%)',
        'gradient-cream': 'linear-gradient(135deg, #FFFBF0 0%, #F0E68C 50%, #FFD700 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'sunlit-glow': 'sunlitGlow 4s ease-in-out infinite alternate',
        'ocean-wave': 'oceanWave 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        sunlitGlow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
        },
        oceanWave: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(5px) rotate(1deg)' },
          '50%': { transform: 'translateX(0) rotate(0deg)' },
          '75%': { transform: 'translateX(-5px) rotate(-1deg)' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
    },
  },
  plugins: [],
}
