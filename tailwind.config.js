/**
 * TailwindCSS 4 Configuration
 *
 * With TailwindCSS 4's @theme directive, CSS custom properties
 * are automatically available as utility classes.
 *
 * @see src/styles/themes.css for token definitions
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // TailwindCSS 4 automatically generates utilities from @theme CSS variables
      // No need to manually extend colors, shadows, etc.
      //
      // Available utilities are generated from themes.css:
      // - bg-surface-base, bg-surface-sunken, bg-surface, bg-surface-elevated, etc.
      // - text-muted, text-subtle, text-inverse, etc.
      // - border-default, border-muted, border-strong, etc.
      // - shadow-sm, shadow-md, shadow-lg, shadow-xl, etc.
    },
  },
  plugins: [],
};
