/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
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

        /* Canonical Stitch Design System Tokens: Corporate Precision Billing (Matte Black & Chrome Grey) */
        'canvas-base': '#08080A',
        'surface-lowest': '#0E0E10',
        'surface-default': '#131315',
        'surface-variant': '#141519',
        'surface-bright': '#1F2128',
        'surface-high': '#2A2A2C',

        'text-primary': '#F8FAFC',
        'text-secondary': '#8E95A5',

        'status-cyan': '#67E8F9',
        'status-success': '#10B981',
        'status-danger': '#F43F5E',

        'border-subtle': 'rgba(226, 232, 240, 0.12)',
        'border-specular': 'rgba(226, 232, 240, 0.28)',

        'metallic-light': '#F8FAFC',
        'metallic-mid': '#CBD5E1',
        'metallic-dark': '#94A3B8',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'silver-gradient': 'linear-gradient(180deg, #F8FAFC 0%, #CBD5E1 45%, #94A3B8 100%)',
        'silver-gradient-hover': 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 45%, #CBD5E1 100%)',
        'specular-border':
          'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(226,232,240,0.06) 100%)',
      },
      boxShadow: {
        metallic: '0 1px 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.8)',
        panel: '0 10px 30px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        cyanGlow: '0 0 8px rgba(103, 232, 249, 0.65)',
        emeraldGlow: '0 0 8px rgba(16, 185, 129, 0.65)',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwindcss-animate'),
  ],
};
