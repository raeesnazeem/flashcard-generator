/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#ffffff',
          dark: '#010120',
          soft: '#fafafa',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f7f7f8',
          dark: '#0b0b2b',
          'dark-soft': '#1a1a36',
          'dark-card': '#121230',
        },
        hairline: {
          DEFAULT: '#ebebeb',
          dark: '#26263a',
          strong: '#d6d6d6',
        },
        ink: {
          DEFAULT: '#000000',
          secondary: '#555555',
          muted: '#888888',
          light: '#aaaaaa',
          white: '#ffffff',
        },
        brand: {
          orange: '#fc4c02',
          magenta: '#ef2cc1',
          periwinkle: '#bdbbff',
          mint: '#c8f6f9',
        },
      },
      fontFamily: {
        sans: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        'display-2xl': ['56px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-xl': ['36px', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'display-lg': ['26px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'display-md': ['20px', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        'body-lg': ['18px', { lineHeight: '1.45', letterSpacing: '-0.01em' }],
        'body-base': ['15px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'body-sm': ['13px', { lineHeight: '1.45', letterSpacing: '0' }],
        'mono-btn': ['13px', { lineHeight: '1', letterSpacing: '0.06em' }],
        'mono-eyebrow': ['11px', { lineHeight: '1', letterSpacing: '0.08em' }],
        'mono-caption': ['11px', { lineHeight: '1.4', letterSpacing: '0.03em' }],
      },
      borderRadius: {
        xs: '3px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        'card-hairline': '0 0 0 1px #ebebeb',
        'card-dark': '0 0 0 1px #26263a',
        'soft-drop': '0 4px 14px rgba(1, 1, 32, 0.08)',
        'float-orb': '0 8px 24px rgba(1, 1, 32, 0.16)',
      },
    },
  },
  plugins: [],
}


