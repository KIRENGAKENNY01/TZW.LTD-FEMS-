// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme');
const { colors: customColors } = require('./data/config/colors');

/** @type {import("tailwindcss").Config } */
module.exports = {
  content: [
    './node_modules/@shipixen/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx,css,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,css,mdx}',
    './components/**/*.{js,ts,jsx,tsx,css,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,css,mdx}',
    './demo/**/*.{js,ts,jsx,tsx,css,mdx}',
    './data/**/*.mdx',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-space-default)', ...fontFamily.sans],
        display: ['Inter', 'var(--font-space-display)', ...fontFamily.sans],
        mono: ['JetBrains Mono', 'Fira Code', ...fontFamily.mono],
        cursive: ['cursive'],
      },
      colors: {
        primary: {
          50:  customColors.primary[50],
          100: customColors.primary[100],
          200: customColors.primary[200],
          300: customColors.primary[300],
          400: customColors.primary[400],
          500: customColors.primary[500],
          600: customColors.primary[600],
          700: customColors.primary[700],
          800: customColors.primary[800],
          900: customColors.primary[900],
          950: customColors.primary[950],
        },
        secondary: {
          50:  customColors.secondary[50],
          100: customColors.secondary[100],
          200: customColors.secondary[200],
          300: customColors.secondary[300],
          400: customColors.secondary[400],
          500: customColors.secondary[500],
          600: customColors.secondary[600],
          700: customColors.secondary[700],
          800: customColors.secondary[800],
          900: customColors.secondary[900],
          950: customColors.secondary[950],
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: customColors.primary[500],
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: theme('colors.primary.500'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: `${theme('colors.primary.300')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.secondary.100'),
            },
          },
        },
      }),
      screens: {
        '2xl': '1400px',
        'tall-sm': { raw: '(min-height: 640px)' },
        'tall-md': { raw: '(min-height: 768px)' },
        'tall-lg': { raw: '(min-height: 1024px)' },
        'tall-xl': { raw: '(min-height: 1280px)' },
        'tall-2xl': { raw: '(min-height: 1536px)' },
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.05)',
        elevated: '0 4px 20px rgba(0,0,0,0.10)',
        hero: '0 8px 40px rgba(239,68,68,0.18)',
      },
      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
        110: 110,
      },
      transitionDuration: {
        2000: '2000ms',
        3000: '3000ms',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(-3deg)',
          },
          '50%': {
            transform: 'rotate(3deg)',
          },
        },
        marquee: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
        bounce: 'bounce 2s ease-in-out infinite',
        'fade-in-down-slow': 'fade-in-down 1s ease-in-out forwards',
        'fade-in-down-normal': 'fade-in-down 0.8s ease-in-out forwards',
        'fade-in-down-fast': 'fade-in-down 0.6s ease-in-out forwards',
        marquee: '30s marquee linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
