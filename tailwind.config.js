/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Accent - CSS Variable 참조
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          active: 'rgb(var(--accent-active) / <alpha-value>)',
          subtle: 'rgb(var(--accent-subtle) / <alpha-value>)',
        },

        // 7-Layer System - CSS Variable 참조
        layer: {
          0: 'rgb(var(--layer-0) / <alpha-value>)',
          1: 'rgb(var(--layer-1) / <alpha-value>)',
          2: 'rgb(var(--layer-2) / <alpha-value>)',
          3: 'rgb(var(--layer-3) / <alpha-value>)',
          4: 'rgb(var(--layer-4) / <alpha-value>)',
          5: 'rgb(var(--layer-5) / <alpha-value>)',
          6: 'rgb(var(--layer-6) / <alpha-value>)',
        },

        // Text - CSS Variable 참조
        text: {
          DEFAULT: 'rgb(var(--text-primary) / <alpha-value>)',
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--text-tertiary) / <alpha-value>)',
          inverse: 'rgb(var(--text-inverse) / <alpha-value>)',
        },

        // Border - CSS Variable 참조
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          subtle: 'rgb(var(--border-subtle) / <alpha-value>)',
        },

        // Semantic - CSS Variable 참조
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
      },

      boxShadow: {
        // 7-Layer shadows - CSS Variable 참조
        'layer-0': 'var(--shadow-layer-0)',
        'layer-1': 'var(--shadow-layer-1)',
        'layer-2': 'var(--shadow-layer-2)',
        'layer-3': 'var(--shadow-layer-3)',
        'layer-4': 'var(--shadow-layer-4)',
        'layer-5': 'var(--shadow-layer-5)',
        'layer-6': 'var(--shadow-layer-6)',
      },

      zIndex: {
        // 7-Layer z-index (고정값)
        'layer-0': '0',
        'layer-1': '10',
        'layer-2': '20',
        'layer-3': '30',
        'layer-4': '40',
        'layer-5': '50',
        'layer-6': '60',
      },

      spacing: {
        // Density-aware spacing
        // var(--spacing-unit)을 곱한 값으로 계산
        dense: {
          xs: 'calc(0.25rem * var(--spacing-unit))', // 4px
          sm: 'calc(0.5rem * var(--spacing-unit))', // 8px
          md: 'calc(0.75rem * var(--spacing-unit))', // 12px
          lg: 'calc(1rem * var(--spacing-unit))', // 16px
          xl: 'calc(1.5rem * var(--spacing-unit))', // 24px
        },
      },

      borderRadius: {
        none: 'var(--radius-none)', // 0
        sm: 'var(--radius-sm)', // 4px - 작은 요소
        DEFAULT: 'var(--radius-md)', // 6px - 기본
        md: 'var(--radius-md)', // 6px - 기본
        lg: 'var(--radius-lg)', // 8px - 패널
        xl: 'var(--radius-xl)', // 10px - 큰 패널
        '2xl': 'var(--radius-2xl)', // 12px - 특수
        full: 'var(--radius-full)', // 9999px - Circle
      },
    },
  },
  plugins: [],
};
