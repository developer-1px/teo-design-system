# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build production bundle (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on TypeScript/TSX files
- `npm run preview` - Preview production build

## Project Overview

This is a **minimal design system kit** demonstrating a refined, polished UI component library built with React 19, TypeScript, and Vite. The project showcases multiple design tool interfaces (Slide, Linear, IDE, CMS, Landing) with a custom component system.

### Tech Stack

- **React 19** with TypeScript for UI framework
- **Vite 7** for build tooling and fast HMR
- **React Router DOM 7** for client-side routing
- **Lucide React** for icon components
- **ESLint 9** with flat config format for code quality
- **vite-plugin-react-inspector** for component debugging (Cmd+Shift during dev)
- Custom CSS variables for theming (light/dark mode)

## Design System Architecture

The design system is located in `src/design-system/` and follows a **token-driven, prop-based component API**. All components use a consistent design token system defined in `tokens.css`.

### Core Components

**Layout & Structure:**
- `Frame` - Universal layout primitive with flexbox/grid, spacing, and surface tokens
- `Section` - Container component with title and optional surface styling

**Typography:**
- `Text` - Text component with variant system (1-4) and weight options
- `Prose` - Prose typography component with semantic role system (h1, h2, h3, h4, body, body-sm, caption)
- `ProseDocument` - Document container with max-width and centered layout
- `ProseSection` - Full-width section with ProseDocument inside

**Interactive:**
- `Action` - Button/action component with variants (ghost, surface, primary)
- `Field` - Input field with scrubbing support (drag to change numeric values)

**Visual:**
- `Separator` - Divider component (horizontal/vertical)

**Utilities:**
- `theme.tsx` - Theme provider and hook for light/dark mode with localStorage persistence
- `utils.ts` - Token conversion utility (`toToken`) for transforming prop values to CSS variables

### Design Token System

All design tokens are defined in `src/design-system/tokens.css` using CSS custom properties:

**Color System:**
- **Surfaces**: `--surface-base`, `--surface-sunken`, `--surface-raised`, `--surface-overlay`, `--surface-primary`, `--surface-selected`
- **Text**: `--text-primary`, `--text-body`, `--text-subtle`, `--text-muted`, `--text-dim`
- **Primary**: `--primary-bg`, `--primary-fg`
- **Border**: `--border-color`, `--border-width`

**Spacing Scale:**
- `--space-0` (0px) through `--space-16` (128px)
- Common: `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-5` (24px), `--space-6` (32px)

**Size Scale (Layout):**
- `--size-3` through `--size-300` (12px through 1200px)
- Common component sizes: `--size-3` (12px), `--size-4` (16px), `--size-6` (32px), `--size-action` (40px), `--size-header` (80px)
- Layout sizes: `--size-50` through `--size-300` (200px through 1200px)

**Typography:**
- **Font Sizes**: `--font-size-1` through `--font-size-6` (32px, 20px, 14px, 12px, 10px, 9px)
- **Font Weights**: `--font-weight-regular` (400), `--font-weight-medium` (500), `--font-weight-bold` (600)

**Prose Typography System:**
- `--prose-h1-size/height/spacing/weight` through `--prose-caption-*`
- H1: 80px/1.1/-0.03em/700
- H2: 56px/1.2/-0.02em/700
- H3: 40px/1.3/-0.01em/600
- H4: 24px/1.4/0em/600
- Body: 20px/1.6/0em/400
- Body-sm: 16px/1.6/0em/400
- Caption: 14px/1.5/0.05em/500

**Radius:**
- `--radius-none`, `--radius-sm` (4px), `--radius-md` (6px), `--radius-lg` (8px), `--radius-xl` (12px), `--radius-2xl` (16px), `--radius-3xl` (24px)
- `--radius-full` (9999px), `--radius-round` (50%), `--radius-round-md` (8px)

**Shadows:**
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### Component API Patterns

**Frame Component:**
```tsx
<Frame
  // Layout
  row             // Flexbox row direction
  flex            // Flex: 1
  fill            // Width/height: 100%
  gap={2}         // Gap using space tokens
  p={3}           // Padding using space tokens (shorthand)

  // Grid Layout
  grid            // Display: grid
  columns="1fr 2fr"  // Grid template columns
  rows="auto"     // Grid template rows

  // Alignment
  align="center"  // align-items (start, center, end, stretch, baseline)
  justify="between" // justify-content (start, center, end, between, around, evenly)
  pack            // Shortcut for pack

  // Visual
  surface="base"  // Background from surface tokens (base, raised, sunken, overlay, primary, selected)
  rounded="md"    // Border radius (none, sm, md, lg, xl, 2xl, 3xl, full, round)
  shadow="sm"     // Box shadow (sm, md, lg, xl, 2xl)
  border          // 1px solid border (true, "top", "bottom", "left", "right")
  borderColor="default" // Border color (default, text-4, text-primary, transparent)

  // Sizing
  w={60}          // Width using size tokens
  h={50}          // Height using size tokens
  minWidth={200}  // Min width
  maxWidth={800}  // Max width

  // Positioning
  position="absolute"
  top={0} left={0} bottom={0} right={0}
  zIndex={10}

  // Other
  overflow="hidden" // Overflow (hidden, auto, scroll, visible)
  cursor="pointer"  // Cursor (pointer, default, text, move, not-allowed, grab, grabbing)
  ratio="16/9"      // Aspect ratio
  as="main"         // Polymorphic component (defaults to "div")
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
  rounded="round"    // Border radius
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

**Prose Components:**
```tsx
// Individual prose element
<Prose
  role="h1"           // h1, h2, h3, h4, body, body-sm, caption
  as="h1"             // Optional element override
  align="center"      // left, center, right, justify
  color="primary"     // primary, secondary, tertiary, white, or custom
>
  Heading Text
</Prose>

// Document container with centered max-width
<ProseDocument maxWidth={680} gap={4}>
  <Prose role="h1">Title</Prose>
  <Prose role="body">Content</Prose>
</ProseDocument>

// Full-width section with document inside
<ProseSection maxWidth={680} p="96 24">
  <Prose role="h2">Section Title</Prose>
  <Prose role="body">Section content</Prose>
</ProseSection>
```

## Application Structure

The project uses **React Router DOM** with a hash router to showcase multiple demo applications:

- **`/` (LandingApp)** - Landing page showcase
- **`/tokens` (TokensApp)** - Design tokens reference and documentation
- **`/slide` (SlideApp)** - Presentation tool interface (Figma/Canva-like)
- **`/linear` (LinearApp)** - Linear-style interface
- **`/ide` (IDEApp)** - IDE-style interface (VS Code-like)
- **`/cms` (CMSApp)** - CMS/website builder interface

Each app demonstrates different design patterns and component compositions. The main `App.tsx` includes a floating navigation pill to switch between demos.

### SlideApp Structure
Demonstrates a presentation/design tool interface with:
- Global header with app controls
- Left sidebar with slide thumbnails (`SlidesPanel`)
- Central canvas area with presentation content
- Right sidebar with design panel (`PropertiesPanel`)
- Bottom floating toolbar (`FloatingToolbar`) with design tools

### CMSApp Structure
Demonstrates a website builder/CMS interface with:
- Toggleable sidebar with page tree (`CMSSidebar`)
- Center canvas with rendered website (`ProseDocument` container)
- Top navigation bars for controls
- Multiple editable sections using `Prose` components

## Token Utility System

The `toToken` utility in `src/design-system/utils.ts` converts prop values to CSS custom properties:

```typescript
toToken(2, "space")      // → "var(--space-2)"
toToken("md", "radius")  // → "var(--radius-md)"
toToken("12px", "space") // → "12px" (passes through)
toToken("10 20", "space") // → "var(--space-10) var(--space-20)"
```

This enables the prop-based API to accept both token names and raw CSS values.

## Key Architectural Decisions

1. **Token-Driven Design** - All spacing, colors, and sizing use CSS custom properties for consistency
2. **Prop-Based API** - Components use semantic props (`surface`, `p`, `gap`) instead of className strings
3. **Polymorphic Components** - Frame supports `as` prop to render as different HTML elements
4. **Theme System** - Light/dark mode with automatic persistence to localStorage (via `data-theme` attribute)
5. **TypeScript First** - Full type safety with strict typing on all component props
6. **Router-Based Demos** - Multiple demo apps showcase different use cases for the design system
7. **Flexible Token Resolution** - `toToken` utility allows mixing token names and raw values

## TypeScript Configuration

The project uses TypeScript project references:
- `tsconfig.json` - Root config with project references
- `tsconfig.app.json` - Application source code config
- `tsconfig.node.json` - Node.js tooling (Vite config, etc.)

## Code Quality Tools

**ESLint** - Uses flat config format (`eslint.config.js`) with:
- `@eslint/js` - JavaScript recommended rules
- `typescript-eslint` - TypeScript rules
- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - Fast refresh validation

**Biome** - Alternative formatter/linter configured via `biome.json` (optional, not in npm scripts)

## Important Notes

- **Package Manager**: Use `npm` (package-lock.json is the active lock file, though pnpm-lock.yaml exists from earlier)
- **Architecture**: Never use barrel exports (per user's global instructions); prefer FSD (Feature-Sliced Design) architecture
- **Component Philosophy**: Components follow inline styles via props rather than separate CSS modules
- **Styling**: All interactive states (hover, focus, active) are defined in `index.css`
- **Design System**: Self-contained with no external component libraries (except Lucide for icons)
- **Theme Switching**: Handled via `data-theme` attribute on document root with localStorage persistence
- **Development Tools**: Use **Cmd+Shift** during dev to activate the React Inspector overlay for component debugging
- **Known Limitations**: See `IDE_DESIGN_FEEDBACK.md` for design system enhancement suggestions (resizable layouts, tree components, syntax highlighting, custom scrollbars, tab management)
