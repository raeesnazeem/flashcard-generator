/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#ffffff',
          surface: '#f5f5f7',
          'surface-warm': '#fbfbfd',
          ink: '#1d1d1f',
          'ink-2': '#424245',
          muted: '#6e6e73',
          meta: '#86868b',
          border: '#d2d2d7',
          'border-soft': '#e8e8ed',
          blue: {
            DEFAULT: '#0071e3',
            hover: '#0077ed',
            active: '#0066cc',
            bright: '#2997ff',
            tint: '#f0f6ff',
          },
          dark: {
            canvas: '#000000',
            surfaceA: '#272729',
            surfaceB: '#262629',
            surfaceC: '#28282b',
            surfaceD: '#2a2a2c',
          },
          success: '#16a34a',
          warn: '#eab308',
          danger: '#dc2626',
        },
      },
      fontFamily: {
        display: [
          '"SF Pro Display"',
          '"Inter Tight"',
          '"SF Pro Icons"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        sans: [
          '"SF Pro Text"',
          '"Inter"',
          '"SF Pro Icons"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'ui-monospace',
          '"JetBrains Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        'apple-xs': ['12px', { lineHeight: '1.33', letterSpacing: '-0.01em' }],
        'apple-sm': ['14px', { lineHeight: '1.43', letterSpacing: '-0.016em' }],
        'apple-base': ['17px', { lineHeight: '1.47', letterSpacing: '-0.022em' }],
        'apple-lg': ['21px', { lineHeight: '1.19', letterSpacing: '0.011em' }],
        'apple-xl': ['28px', { lineHeight: '1.14', letterSpacing: '0.007em' }],
        'apple-2xl': ['40px', { lineHeight: '1.10', letterSpacing: '0em' }],
        'apple-3xl': ['56px', { lineHeight: '1.07', letterSpacing: '-0.005em' }],
        'apple-4xl': ['80px', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
      },
      borderRadius: {
        'apple-xs': '5px',
        'apple-sm': '8px',
        'apple-md': '12px',
        'apple-lg': '18px',
        'apple-xl': '28px',
        'apple-pill': '980px',
      },
      boxShadow: {
        'apple-flat': 'none',
        'apple-ring': '0 0 0 1px #d2d2d7',
        'apple-card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'apple-raised': '0 12px 32px rgba(0, 0, 0, 0.08)',
        'apple-nav': '0 1px 0 rgba(0, 0, 0, 0.08)',
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.28, 0, 0.22, 1)',
      },
      transitionDuration: {
        'apple-fast': '150ms',
        'apple-base': '220ms',
      },
    },
  },
  plugins: [],
}


