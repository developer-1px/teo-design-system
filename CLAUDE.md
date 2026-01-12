# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build production bundle (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on TypeScript/TSX files
- `npm run preview` - Preview production build

## Project Overview

This is a **minimal design system kit** demonstrating a refined, polished UI component library built with React 19, TypeScript, and Vite. The project showcases a design tool interface similar to Figma/Canva with a custom component system.

### Tech Stack

- **React 19** with TypeScript for UI framework
- **Vite 7** for build tooling and fast HMR
- **Lucide React** for icon components
- **ESLint 9** with flat config format for code quality
- Custom CSS variables for theming (light/dark mode)

## Design System Architecture

The design system is located in `src/design-system/` and follows a **token-driven, prop-based component API**. All components use a consistent design token system defined in `tokens.css`.

### Core Components

**Layout & Structure:**
- `Frame` - Universal layout primitive with flexbox, spacing, and surface tokens
- `Section` - Container component with title and optional surface styling

**Typography:**
- `Text` - Text component with variant system (1-4) and weight options

**Interactive:**
- `Action` - Button/action component with variants (ghost, surface, primary)
- `Field` - Input field with scrubbing support (drag to change numeric values)

**Visual:**
- `Separator` - Divider component (horizontal/vertical)

**Utilities:**
- `theme.tsx` - Theme provider and hook for light/dark mode with localStorage persistence

### Design Token System

All design tokens are defined in `src/design-system/tokens.css` using CSS custom properties:

**Color System:**
- `--surface-1` through `--surface-4` - Background/surface layers
- `--text-1` through `--text-5` - Text color hierarchy
- `--primary-bg/fg` - Primary action colors
- `--border-color` - Border colors

**Spacing Scale:**
- `--space-1` (4px) through `--space-6` (32px)

**Typography:**
- `--font-size-1` through `--font-size-4` (32px, 20px, 14px, 12px)
- `--font-weight-regular/medium/bold` (400, 500, 600)

**Radius:**
- `--radius-none/sm/md/lg/pill/round/round-md`

**Shadows:**
- `--shadow-sm/md/lg`

### Component API Patterns

**Frame Component:**
```tsx
<Frame
  // Layout
  row             // Flexbox row direction
  flex            // Flex: 1
  fill            // Width/height: 100%
  gap={2}         // Gap using space tokens
  padding={3}     // Padding using space tokens

  // Alignment
  align="center"  // align-items
  justify="between" // justify-content

  // Visual
  surface={1}     // Background color from surface tokens
  radius="round"  // Border radius from radius tokens
  shadow="sm"     // Box shadow from shadow tokens
  border          // 1px solid border

  // Positioning
  position="absolute"
  top={0} left={0}
/>
```

**Action Component:**
```tsx
<Action
  icon={Icon}        // Lucide icon component
  label="Text"       // Optional text label
  variant="primary"  // ghost (default), surface, primary
  size={32}          // Square size shortcut
  iconSize={16}      // Icon size
  radius="round"     // Border radius
/>
```

**Field Component:**
```tsx
<Field
  label="X"          // Optional label (enables scrubbing)
  icon={<Icon />}    // Left icon
  rightIcon={<Icon />} // Right icon
  value={value}      // Input value
  onChange={handler} // Change handler
  flex               // Flex: 1
/>
```

**Note:** Fields with labels support **scrubbing** - drag horizontally on the label to increment/decrement numeric values.

## Key Architectural Decisions

1. **Token-Driven Design** - All spacing, colors, and sizing use CSS custom properties for consistency
2. **Prop-Based API** - Components use semantic props (`surface`, `padding`, `gap`) instead of className strings
3. **Polymorphic Components** - Frame supports `as` prop to render as different HTML elements
4. **Theme System** - Light/dark mode with automatic persistence to localStorage
5. **TypeScript First** - Full type safety with strict typing on all component props

## TypeScript Configuration

The project uses TypeScript project references:
- `tsconfig.json` - Root config with project references
- `tsconfig.app.json` - Application source code config
- `tsconfig.node.json` - Node.js tooling (Vite config, etc.)

## ESLint Configuration

Uses flat config format (`eslint.config.js`) with:
- `@eslint/js` - JavaScript recommended rules
- `typescript-eslint` - TypeScript rules
- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - Fast refresh validation

## Application Structure

The main application (`src/App.tsx`) demonstrates a presentation/design tool interface with:
- Global header with app controls
- Left sidebar with slide thumbnails
- Central canvas area with presentation content
- Right sidebar with design panel (transform, typography, colors, effects)
- Bottom floating toolbar with design tools

This serves as a **reference implementation** for how to compose the design system components.

## Important Notes

- Never use barrel exports (per user's global instructions)
- Components follow inline styles via props rather than separate CSS modules
- All interactive states (hover, focus, active) are defined in `index.css`
- The design system is self-contained - no external component libraries
- Theme switching is handled via `data-theme` attribute on document root
