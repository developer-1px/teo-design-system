# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (port 5173)
pnpm dev

# Type checking (no emit)
pnpm lint

# Production build
pnpm build

# Preview production build
pnpm preview

# Build Vite plugins (when modified)
pnpm build:iddl-inspector   # Build IDDL Inspector client
```

## Project Overview

This is a **design-system-driven IDE UI Kit** built with React 19, TypeScript, and TailwindCSS 4.x. The project emphasizes **rule-based design decisions** to enable consistent UI development by both AI and human developers.

**Core Innovation**: IDDL (Intent-Driven Design Language) - a TSX-based DSL where developers declare "why" (purpose + prominence) instead of "how" (colors + sizes). The system automatically handles tokens, semantics, and accessibility.

### Tech Stack
- **React 19** with TypeScript for type-safe components
- **Vite 7** for fast development and building
- **TailwindCSS 4.x** with PostCSS and custom design tokens
- **CodeMirror 6** for code editing functionality
- **Lucide React** for consistent iconography
- **IDDL v1.0.1** - Custom TSX-based DSL for intent-driven UI

## Design System Architecture

### ⭐ NEW: Purpose-Based Design (Why-Based System)

**Core Concept**: Developers specify "why" (purpose + prominence), system handles "how" (tokens, semantics, accessibility).

```tsx
// ❌ How-based (old)
<button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold">
  Save
</button>

// ✅ Why-based (new)
<Group purpose="action" prominence={1}>
  <Item>Save</Item>
</Group>
```

**Developer's Job**:
1. **Grouping**: What's the role? → `purpose` (navigation, action, form, content, list, media, status, info)
2. **Prominence**: How important? → `prominence` (1: Primary, 2: Secondary, 3: Tertiary)

**System's Job**:
- Suggest appropriate UI patterns
- Apply tokens automatically
- Generate semantic HTML
- Set up keyboard accessibility

**See**: [docs/PURPOSE_BASED_DESIGN.md](docs/PURPOSE_BASED_DESIGN.md) for complete guide.

---

### Core Philosophy

The design system follows these fundamental principles:

1. **Purpose-first**: Define "why it exists" before "how it looks"
2. **Use the weakest visual means first**: Background color difference → Border → Shadow → Accent color
3. **Limit accent usage**: Maximum 1-2 accent uses per screen (primary CTA, focus states only)
4. **Minimal tokens**: Only 16 tokens (6 colors, 4 sizes, 2 weights, 4 spacings)
5. **Document all exceptions**: Any deviation from rules must include inline comment explaining why

### Layout System (범용 레이아웃)

The codebase uses a **Layout system** that combines depth (visual hierarchy) with layout patterns (grid, flex, stack, scroll). This unified system works across all OS apps. All layouts are defined in:
- **Component**: `src/components/ui/Layout.tsx`
- **Design tokens**: `src/shared/config/tokens.ts`
- **Grid templates**: `src/styles/themes.css` (CSS variables)

#### Depth Hierarchy (0 = base, 6 = highest)

| Depth | Purpose | Background | Shadow | Z-Index | Example Use Cases |
|-------|---------|------------|--------|---------|-------------------|
| 0 | App base | `#fafafa` | none | 0 | Application background |
| 1 | Sunken | `#f5f5f5` | inset | 10 | Input fields, terminal |
| 2 | Base surface | `#ffffff` | none | 20 | Sidebar, panels |
| 3 | Primary surface | `#ffffff` | subtle | 30 | Editor, main content, cards |
| 4 | Elevated | `#ffffff` | medium | 40 | Toolbars, active tabs, dropdowns |
| 5 | Floating | `#ffffff` | strong | 50 | Popovers, tooltips |
| 6 | Overlay | `#ffffff` | strongest | 60 | Modals, dialogs |

**Critical rules**:
- NEVER reverse depth levels (dark inside light)
- NEVER exceed 4 levels of nesting
- Depths 2-6 use **same background color** with **different shadows** for depth

#### Layout Variants

| Variant | Purpose | Use Case |
|---------|---------|----------|
| `surface` | Basic container (default) | Simple panels, cards |
| `grid` | CSS Grid layout | Bento Grid, IDE layouts, structured layouts |
| `flex` | Flexbox layout | Headers, toolbars, dynamic alignment |
| `stack` | Vertical/horizontal stack (scrollable) | File lists, scrollable menus |
| `scroll` | Pure scroll container | Long content areas |

#### Layout.Island (독립 UI 영역)

Islands are independent UI regions within a layout (e.g., cells in a Bento Grid):

```tsx
<Layout variant="grid" template="sidebar-content">
  <Layout.Island area="sidebar" variant="scroll">
    <Navigation />
  </Layout.Island>
  <Layout.Island area="content" variant="flex">
    <Main />
  </Layout.Island>
</Layout>
```

**Backward compatibility**: `Layer` is aliased to `Layout` for compatibility.

### Theme System

The project supports **three independent theme axes** (see `src/shared/lib/theme.ts`):

1. **Theme**: `light` | `dark`
2. **Color Scheme**: `emerald` | `blue` | `purple` | `red` (accent color variants)
3. **Density**: `compact` | `normal` | `comfortable` (spacing variants)

All theme values are applied via CSS custom properties using `data-*` attributes on `<html>`.

### Design Tokens

All design values are centralized in `src/shared/config/tokens.ts`:

- **Colors**: `accent`, `layer`, `text`, `border`, `semantic`
- **Shadows**: `shadow.0` through `shadow.6` (mapped to layers)
- **Spacing**: Only allowed values are `4, 8, 12, 16, 24, 32, 48, 64, 96` (px)
- **Typography**: `fontSize`, `fontWeight` (400, 500, 600 only), `lineHeight`
- **Icon Sizes**: `16px` (inline), `20px` (buttons), `24px` (navigation)

**Never hardcode design values** - always reference tokens or Tailwind utilities that map to CSS variables.

### Component Patterns

#### Layout Component

```tsx
import { Layout } from '@/components/ui/Layout';

// ✅ Basic usage (surface variant)
<Layout depth={2} rounded="lg" className="p-4">
  <h2>Panel</h2>
  <Layout depth={1} rounded className="p-2">
    <input />
  </Layout>
</Layout>

// ✅ Grid layout with Islands
<Layout variant="grid" template="sidebar-content" gap={4}>
  <Layout.Island area="sidebar" variant="scroll">
    <FileTree />
  </Layout.Island>
  <Layout.Island area="content" variant="flex">
    <Editor />
  </Layout.Island>
</Layout>

// ✅ Bento Grid (Dashboard)
<Layout variant="grid" template="dashboard" gap={3}>
  <Layout.Island className="col-span-2 row-span-2">
    <Chart />
  </Layout.Island>
  <Layout.Island>
    <StatsCard />
  </Layout.Island>
</Layout>

// ✅ Stack (scrollable list)
<Layout variant="stack" direction="vertical" depth={1} className="h-96">
  {items.map(item => (
    <Layout key={item.id} depth={2} clickable>
      {item.title}
    </Layout>
  ))}
</Layout>

// ❌ Wrong - depth reversal
<Layout depth={1}>
  <Layout depth={2} /> {/* Light inside dark - NEVER */}
</Layout>
```

**Key Props**:
- `depth`: Visual hierarchy (0-6)
- `variant`: Layout type (surface | grid | flex | stack | scroll)
- `template`: Predefined grid template (ide | sidebar-content | dashboard | split | custom)
- `resizable`: Enable user resizing
- `gap`: Spacing between children (0, 1, 2, 3, 4, 6, 8, 12, 16, 24)

#### Button Component

```tsx
import { Button } from '@/components/ui/Button';

// ✅ Correct - one accent per screen
<div className="flex gap-2 justify-end">
  <Button variant="ghost">Cancel</Button>
  <Button variant="accent">Save</Button> {/* Only one accent */}
</div>

// ❌ Wrong - multiple accents
<Button variant="accent">Save</Button>
<Button variant="accent">Publish</Button>
```

**Button variants**:
- `accent` - Primary action (limit 1 per screen)
- `ghost` - Secondary action (no background)
- `outline` - Dangerous action (border only, no fill)

**Never** apply shadows to buttons (violates inline element principle).

#### IconButton Component

```tsx
import { IconButton } from '@/components/ui/IconButton';
import { Files } from 'lucide-react';

// ✅ Correct - title is required for accessibility
<IconButton title="Open Files" size="md">
  <Files size={20} />
</IconButton>
```

## IDDL (Intent-Driven Design Language)

### Core Concept

IDDL is a **TSX-based DSL** where you declare **intent** instead of implementation:

```tsx
// ❌ Traditional: How-based (implementation details)
<button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold">
  Save
</button>

// ✅ IDDL: Why-based (intent declaration)
<Action prominence="Primary" intent="Positive">
  Save
</Action>
```

**Developer declares**: Purpose + Prominence
**System handles**: Tokens, Semantics, Accessibility, Keyboard Navigation

### IDDL Component Hierarchy

```
Page (Root - Application level)
 └─ Section (Layout regions: Header, Sidebar, Editor, Panel)
     └─ Group (Logical grouping: Form, Card, Toolbar, List, Grid)
         └─ Primitives (Atomic elements)
             ├─ Text (Static content: Title, Body, Label, Code)
             ├─ Field (Data binding: text, number, date, select, etc.)
             └─ Action (Interactions: buttons, links)

Overlay (Floating UI: Dialog, Drawer, Popover, Toast, Tooltip)
```

### Key IDDL Props

All IDDL components share these core props:

- **`role`**: What is it? (e.g., `Container`, `Form`, `Toolbar`, `Navigator`)
- **`prominence`**: How important? (`Hero` | `Primary` | `Secondary` | `Tertiary`)
- **`intent`**: What meaning? (`Neutral` | `Brand` | `Positive` | `Caution` | `Critical` | `Info`)
- **`density`**: How spacious? (`Comfortable` | `Standard` | `Compact`)

### IDDL Component Examples

```tsx
// Page - Application root
<Page role="App" title="My IDE" layout="studio">
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
</Page>

// Section - Layout regions
<Section role="Container" prominence="Secondary">
  <Group role="Form">...</Group>
</Section>

// Group - Logical grouping
<Group role="Toolbar" prominence="Primary">
  <Action prominence="Primary" intent="Positive">Save</Action>
  <Action prominence="Secondary">Cancel</Action>
</Group>

// Primitives - Atomic elements
<Text role="Title" prominence="Primary">Welcome</Text>
<Field label="Email" model="user.email" dataType="email" required />
<Action prominence="Primary" intent="Brand" behavior={{ action: "submit" }}>
  Submit
</Action>
```

### IDDL Type Reference

**See**: `src/components/dsl/types.ts` for complete type definitions

**Specification**: `spec/iddl-spec-1.0.1.md` for official IDDL spec

## IDDL Inspector (Debugging Tool)

Press **Cmd+D** (Mac) or **Ctrl+D** (Windows) in dev mode to toggle the IDDL Inspector.

**What it shows**:
- Complete React component tree in JSX format
- Only React components (HTML elements filtered out)
- Wrapper components (Memo, ForwardRef) are transparent
- IDDL-relevant props only (role, prominence, intent, density, layout)

**Implementation**:
- Vite plugin: `vite-plugins/iddl-inspector/`
- React Fiber traversal: `vite-plugins/iddl-inspector/client/inspector.ts`
- Build: `pnpm build:iddl-inspector`

**Use case**: Quickly understand component hierarchy when debugging or refactoring IDDL structures.

## File Structure

### Modified FSD 2.1 Architecture (Pages-First, No Barrel Exports)

**Core Principles:**
- **No barrel exports** (`index.ts`/`index.tsx` files are NOT used)
- **App prefix for entry points** (e.g., `AppIDE.tsx`, `AppJSON.tsx`)
- **Pages-first** structure with progressive complexity
- **Direct imports** from specific files (no re-exports)

```
src/
├── shared/               # ⭐ Shared utilities (FSD-compliant)
│   ├── lib/             # Common libraries
│   │   ├── utils.ts     # Utility functions (cn, etc.)
│   │   ├── theme.ts     # Theme management system
│   │   └── keyboard/    # Keyboard navigation & shortcuts
│   │       ├── KeyboardProvider.tsx
│   │       ├── useShortcut.ts
│   │       ├── useFocusScope.ts
│   │       ├── useNavigableCursor.ts
│   │       ├── useTreeNavigation.ts
│   │       ├── types.ts
│   │       └── index.ts  # EXCEPTION: keyboard re-exports only
│   ├── contexts/        # Global contexts
│   │   └── app-context.tsx  # App type switching
│   └── config/          # Design tokens & configuration
│       ├── tokens.ts             # Design system tokens
│       └── prominence-tokens.ts  # Prominence system tokens
├── apps/                 # Application modules (FSD 2.1)
│   ├── IDE/
│   │   ├── AppIDE.tsx           # ✅ Entry point (root level, easy to find)
│   │   ├── lib/                 # IDE-specific utilities
│   │   │   └── file-loader.ts
│   │   ├── pages/               # Page-level components
│   │   │   └── ide/
│   │   │       └── IDEPage.tsx
│   │   └── widgets/             # Complex UI blocks
│   │       ├── editor/
│   │       ├── file-tree/
│   │       ├── chat/
│   │       └── sidebar/
│   ├── JSON/
│   │   ├── AppJSON.tsx          # ✅ Entry point
│   │   ├── lib/                 # JSON-specific utilities
│   │   │   └── json-schema.ts
│   │   ├── pages/
│   │   │   ├── json/
│   │   │   ├── server-products/
│   │   │   └── server-products-dsl/
│   │   └── widgets/
│   │       └── json-viewer/
│   ├── PPT/
│   │   ├── AppPPT.tsx           # ✅ Entry point
│   │   ├── lib/                 # PPT-specific utilities
│   │   │   ├── markdown-parser.tsx
│   │   │   └── markdown-to-dsl.tsx
│   │   ├── pages/
│   │   │   └── ppt/
│   │   └── widgets/
│   │       └── presentation/
│   ├── EMOJI/
│   │   ├── AppEmoji.tsx
│   │   ├── lib/
│   │   │   └── emoji-designer/  # Emoji designer utilities
│   │   ├── pages/
│   │   └── widgets/
│   ├── DSLBuilder/
│   │   ├── AppDSLBuilder.tsx
│   │   ├── lib/
│   │   │   └── dsl-builder/     # DSL builder utilities
│   │   ├── pages/
│   │   └── widgets/
│   └── DOCS/
│       ├── AppDocs.tsx
│       ├── lib/
│       │   └── docs-scanner.ts
│       ├── pages/
│       └── widgets/
├── components/           # Shared UI components
│   ├── ui/              # Base UI components (Layer, Button, IconButton, etc.)
│   ├── workspace/       # Workspace navigation components
│   ├── modal/           # Modal dialogs (Settings, Search)
│   ├── dsl/             # IDDL DSL components (Page, Section, Group, Text, Field, Action, Overlay)
│   │   ├── Page.tsx     # Root application component
│   │   ├── Section.tsx  # Layout regions (ActivityBar, Sidebar, Editor, Panel)
│   │   ├── Group.tsx    # Logical grouping (Form, Card, Toolbar, List)
│   │   ├── Text.tsx     # Static content (Title, Body, Label, Code)
│   │   ├── Field.tsx    # Data binding (text, number, select, etc.)
│   │   ├── Action.tsx   # Interactions (buttons, links)
│   │   ├── Overlay.tsx  # Floating UI (Dialog, Drawer, Popover)
│   │   ├── types.ts     # IDDL type definitions
│   │   └── styles.ts    # IDDL styling utilities
│   └── atoms/           # Primitive UI elements
├── vite-plugins/        # Custom Vite plugins
│   └── iddl-inspector/  # IDDL Inspector debugging tool
│       ├── index.ts     # Vite plugin entry
│       ├── client/      # Client-side code (injected into browser)
│       │   ├── index.ts
│       │   ├── inspector.ts  # React Fiber tree traversal
│       │   ├── ui.ts         # Inspector UI
│       │   └── keyboard.ts   # Cmd+D handler
│       └── client.js    # Built bundle (generated)
└── spec/
    ├── iddl-spec-1.0.1.md          # IDDL official specification
    └── iddl-coverage-analysis.md   # Implementation coverage
```

**Import Convention:**
```tsx
// ✅ Direct import from entry point
import { AppIDE } from '@/apps/IDE/AppIDE';

// ❌ Never use barrel exports
import { AppIDE } from '@/apps/IDE';  // NO index.ts!

// ✅ Direct import from specific file
import { IDEPage } from '@/apps/IDE/pages/ide/IDEPage';

// ✅ IDDL components (NO barrel export - direct imports)
import { Page } from '@/components/dsl/Page';
import { Section } from '@/components/dsl/Section';
import { Group } from '@/components/dsl/Group';
import { Action } from '@/components/dsl/Action';
import { Text } from '@/components/dsl/Text';
import { Field } from '@/components/dsl/Field';
```

**Naming Convention:**
- Entry points: `App{Name}.tsx` (e.g., `AppIDE.tsx`, `AppJSON.tsx`)
- Pages: `{Name}Page.tsx` (e.g., `IDEPage.tsx`, `JSONPage.tsx`)
- Widgets: Descriptive names (e.g., `FileTree.tsx`, `CodeEditor.tsx`)

## Configuration

- **Path alias**: `@/*` maps to `./src/*` (configured in `vite.config.ts`)
- **MDX support**: Enabled via `@mdx-js/rollup` with `remarkGfm` and `remarkFrontmatter`
- **Prettier**: Single quotes, 80 char line width, 2 space tabs
- **Vite plugins**: `iddlInspector()` plugin enabled (see `vite.config.ts`)

## Vite Plugin Development

### Building Plugins

When modifying Vite plugins (e.g., IDDL Inspector), rebuild the client bundle:

```bash
pnpm build:iddl-inspector
```

This compiles `vite-plugins/iddl-inspector/client/` into `vite-plugins/iddl-inspector/client.js` (IIFE bundle).

### IDDL Inspector Architecture

**Vite Plugin** (`vite-plugins/iddl-inspector/index.ts`):
- Injects client script into HTML during dev mode
- Patches React 19's jsx-dev-runtime to enable `_debugSource`
- Provides virtual module for client code

**Client** (`vite-plugins/iddl-inspector/client/`):
- `inspector.ts`: Traverses React Fiber tree, converts to JSX format
- `ui.ts`: Renders central textarea with component tree
- `keyboard.ts`: Handles Cmd+D / Ctrl+D toggle
- `index.ts`: Entry point, initializes inspector

**Key Implementation Details**:
- Filters out HTML DOM elements (only shows React components)
- Skips wrapper components (Unknown, Anonymous, Fragment)
- Extracts component names from Memo/ForwardRef wrappers
- Shows only IDDL-relevant props (role, prominence, intent, density, layout)

## Design Rules Enforcement

Before implementing any UI:

1. **Visual hierarchy**: Can you use layer difference instead of borders/shadows?
2. **Borders**: Is this use case allowed? (See `DESIGN_PRINCIPLES.md` Part 3)
3. **Shadows**: Does this element have physical elevation? (Not for buttons/badges)
4. **Accent color**: Is there already 1+ accent on screen?
5. **Spacing**: Are you using allowed values? (4, 8, 12, 16, 24, 32, 48, 64, 96)
6. **Font weight**: Is it 400, 500, or 600?
7. **Icon size**: Is it 16, 20, or 24px?

### Common Violations to Avoid

```tsx
// ❌ Border + background simultaneously (except outline variant)
<div className="bg-white border border-gray" />

// ❌ Shadow on buttons
<Button className="shadow-lg">Click</Button>

// ❌ Multiple accents
<Button variant="accent">Save</Button>
<Button variant="accent">Publish</Button>

// ❌ Non-standard spacing
<div className="p-[15px]" /> {/* Use p-4 (16px) instead */}

// ❌ Hardcoded values
<div style={{ fontSize: '15px' }} /> {/* Use tokens */}

// ❌ Missing keyboard accessibility
<div onClick={handleClick}>Click me</div> {/* Use button or add keyboard handlers */}
```

### Correct Patterns

```tsx
// ✅ Layer-based separation
<Layer level={2} className="p-4 rounded-lg">
  <h3>Title</h3>
</Layer>

// ✅ Standard spacing
<div className="p-4 gap-2">

// ✅ Keyboard accessibility
<button
  onClick={handleClick}
  className="focus-visible:ring-2 focus-visible:ring-accent"
>
  Click me
</button>

// ✅ Exception documentation
// EXCEPTION: Using border here instead of layer difference
// Reason: User specifically requested visual separator
// Reference: DESIGN_PRINCIPLES.md Part 3.2
<div className="border-b border-border" />
```

## Key Documentation

**IDDL Documentation** (Primary):
- **[README.md](README.md)** ⭐ IDDL overview and philosophy
- **[spec/iddl-spec-1.0.1.md](spec/iddl-spec-1.0.1.md)** - Official IDDL specification
- **[apps/docs/](apps/docs/)** - Complete IDDL learning curriculum (34 documents)
  - Level 0: Getting Started (3 docs, 30min)
  - Level 1: Core Attributes (5 docs, 1hr)
  - Level 2: Structure Understanding (5 docs, 1hr)
  - Level 3: Data Interaction (5 docs, 1.5hr)
  - Level 4: Practical Patterns (5 docs, 2hr)
  - Level 5: Advanced Topics (5 docs, 2hr)

**Design System** (Reference):
- **[docs/PURPOSE_BASED_DESIGN.md](docs/PURPOSE_BASED_DESIGN.md)** - Why-based design system
- **[docs/PROMINENCE_SYSTEM.md](docs/PROMINENCE_SYSTEM.md)** - Prominence system guide
- **[docs/LAYOUT_SYSTEM.md](docs/LAYOUT_SYSTEM.md)** - Layout system guide
- **[docs/DESIGN_PRINCIPLES.md](docs/DESIGN_PRINCIPLES.md)** - Design rules (15 parts)

## Code Conventions

### 🚫 No Barrel Exports

**NEVER create `index.ts` or `index.tsx` files for re-exporting.**

```tsx
// ❌ WRONG - Do NOT create index.ts files
// src/shared/index.ts
export * from './lib/utils';
export * from './lib/theme';

// ❌ WRONG - Do NOT import from directories
import { cn } from '@/shared';
import { getThemeConfig } from '@/shared';

// ✅ CORRECT - Direct imports from specific files
import { cn } from '@/shared/lib/utils';
import { getThemeConfig } from '@/shared/lib/theme';
```

**Rationale:**
- Explicit imports make dependencies clear
- Easier to track what's being used where
- Better for tree-shaking and code splitting
- Prevents circular dependency issues
- IDE autocomplete works better with direct imports

### Import Path Structure

```tsx
// Shared utilities (cross-app)
import { cn } from '@/shared/lib/utils';
import { useKeyboard } from '@/shared/lib/keyboard';
import { useApp } from '@/shared/contexts/app-context';
import { accent, spacing } from '@/shared/config/tokens';

// App-specific libraries
import { createNewDesign } from '@/apps/EMOJI/lib/emoji-designer/utils';
import { generateId } from '@/apps/DSLBuilder/lib/dsl-builder/utils';
import { getAllDocs } from '@/apps/DOCS/lib/docs-scanner';

// IDDL components (NO barrel exports)
import { Page } from '@/components/dsl/Page';
import { Section } from '@/components/dsl/Section';
import { Group } from '@/components/dsl/Group';
```

## Important Notes

- This project is in **Korean** for documentation comments and UI text
- **IDDL-first development**: Use IDDL DSL components (Page, Section, Group, Action, Text, Field) instead of traditional HTML/CSS when building UI
- Design system adherence is **critical** - do not deviate without documenting exceptions
- Always check `DESIGN_PRINCIPLES.md` before making visual decisions
- When in doubt about layer levels, shadows, or accent usage - consult the design docs first
- **No barrel exports**: NEVER create `index.ts` files - always import from specific files
- **Cmd+D for debugging**: Use IDDL Inspector to understand component hierarchy during development