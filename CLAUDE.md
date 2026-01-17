# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Common Workflow
- `npm run dev` - Start development server (port 5173)
- `npm run typecheck` - Run TypeScript compiler check (fastest validation)
- `npm run build` - Build production bundle (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build

### Code Quality
- `npm run lint` - Run Biome linter on all files
- `npm run lint:design` - Run design system audit (checks for hardcoded pixels, rigid rows, tiny actions, floating flat surfaces)
- `npm run format` - Format code with Biome
- `npm run check` - Run Biome check and auto-fix issues
- `npm run check:unused` - Find unused exports with ts-unused-exports
- `npm run packages` - Full validation suite (lint + typecheck + build)

### Before Committing
Run these three commands to ensure code quality:
```bash
npm run typecheck  # Catch type errors
npm run build      # Ensure production build works
npm run lint       # Check code style
```

## Project Overview

This is **Teo's Minimal Design Kit (MDK)** - a CSS decision-making framework designed to help AI and developers make consistent design choices. Unlike traditional design systems that provide components or tokens, MDK provides a **reasoning framework** for CSS decisions.

**Core Philosophy**: "No CSS Without Reason" - Every CSS choice must have a clear WHY. Instead of infinite CSS combinations, MDK reduces choices to ~100 meaningful, intent-based decisions across 13 categories (Surface, Layout, Sizing, Typography, Spacing, etc.).

The project showcases multiple demo applications (Slide, CMS, CRM, etc.) built with this framework, demonstrating how reason-driven design maintains consistency even as AI makes modifications.

### Tech Stack

- **React 19** with TypeScript for UI framework
- **Vite 7** for build tooling and fast HMR
- **React Router DOM 7** for client-side routing
- **Lucide React** for icon components
- **Tanstack Table v8** for data table components (CRM app)
- **Jotai** for atomic state management (CRM app)
- **Biome** for formatting and linting
- **ESLint 9** with flat config format for code quality
- **vite-plugin-react-inspector** for component debugging (Cmd+Shift during dev)
- Custom CSS variables for theming (light/dark mode)

## Design System Architecture

The design system is located in `src/design-system/` and follows a **token-driven, prop-based component API**. All components use a consistent design token system defined in `tokens.css`.

### Key MDK Concepts

**1. Reason-Based Token Selection**
Instead of choosing arbitrary values, tokens are organized by purpose:
- `surface="raised"` → automatically applies: light background, border, medium radius, shadow
- `layout="stack.content"` → automatically applies: padding 16px, gap 12px, flex column
- `w="sidebar"` → width 240px (optimal for text + icon, ergonomically derived)

**2. The 13 CSS Categories**
All CSS properties are grouped into categories with clear WHY questions:
- **Surface**: "How should this element be visually distinguished?"
- **Layout**: "How should internal elements be arranged?"
- **Sizing**: "What does this container hold and why this size?"
- **Typography**: "How should this be read?"
- **Spacing**: "What relationship exists between elements?"
(See README.md for complete list)

**3. Props Over Classes**
Components use semantic props instead of className strings:
```tsx
// ❌ Not this
<div className="flex gap-4 p-3 bg-surface-raised rounded-md">

// ✅ This
<Frame gap={4} p={3} surface="raised" rounded="md">
```

### MDK Core Architecture: 3-Tier Intent System

**CRITICAL**: MDK uses a universal **3-Tier Intent System** as the foundational pattern for all component specifications. This is the consistent methodology for defining every component in the design system.

#### 3-Tier Structure

```
Tier 1: Primitive (Container)
   ↓
Tier 2: Intent (Purpose/Why)
   ↓
Tier 3: Component (Implementation/How)
```

**Pattern**: `Primitive.{Intent}.{Component}`

#### Philosophy: "Intent First, Props Follow"

Every component specification must answer three questions in order:

1. **WHY** does this exist? → Define Intent
2. **WHAT** value does it provide? → Map Intent to capabilities
3. **HOW** is it implemented? → Create Components

#### Field Example

```tsx
// Tier 1: Primitive
<Field name="email">

  {/* Tier 2: Intent - Guidance (Why: User needs to know what to enter) */}
  <Field.Guidance>
    <Field.Label>Email</Field.Label>
    <Field.Description>For login purposes</Field.Description>
  </Field.Guidance>

  {/* Tier 2: Intent - Control (Why: User needs to input data) */}
  <Field.Control>
    <Input />
  </Field.Control>

  {/* Tier 2: Intent - Validation (Why: Data must be correct) */}
  <Field.Validation schema={emailSchema} />

  {/* Tier 2: Intent - Feedback (Why: User needs to know if input is valid) */}
  <Field.Feedback>
    <Field.Error />
  </Field.Feedback>

</Field>
```

#### Action Example

```tsx
// Tier 1: Primitive
<Action onClick={handleSave}>

  {/* Tier 2: Intent - State (Why: User needs to know loading status) */}
  <Action.State loading={isSaving} />

  {/* Tier 2: Intent - Confirmation (Why: Prevent accidental actions) */}
  <Action.Confirmation message="Save changes?" />

  {/* Tier 2: Intent - Feedback (Why: User needs to know outcome) */}
  <Action.Feedback>
    <Action.Success message="Saved!" />
  </Action.Feedback>

  <Button>Save</Button>
</Action>
```

#### 6 Core Intents

**Field Intents**:
1. **Guidance** - Guide user on what to enter (label, description, placeholder)
2. **Control** - Provide input mechanism (Input, Select, Textarea, custom UI)
3. **Validation** - Ensure data correctness (schema, rules, triggers)
4. **Feedback** - Show validation results (error, success, warning)
5. **State** - Manage field state (value, touched, dirty, valid)
6. **Transform** - Convert data format (format, parse, sanitize)

**Action Intents**:
1. **Handler** - Define action behavior (onClick, async handling)
2. **State** - Manage action state (loading, disabled, pending)
3. **Confirmation** - Request user confirmation (dialog, message)
4. **Feedback** - Show action results (success, error, progress)
5. **Prevention** - Prevent unwanted execution (once, debounce, throttle)
6. **Lifecycle** - Hook into action phases (onStart, onSuccess, onError)

#### Progressive Enhancement: 3 Usage Levels

The 3-Tier system supports progressive complexity:

**Level 1: Simple** (Props-based, Intent hidden)
```tsx
<Field name="email" label="Email" validate={schema}>
  <Input />
</Field>
```

**Level 2: Structured** (Intent groups visible)
```tsx
<Field name="email">
  <Field.Guidance label="Email" />
  <Field.Validation schema={schema} />
  <Field.Control><Input /></Field.Control>
</Field>
```

**Level 3: Explicit** (Full Intent + Component control)
```tsx
<Field name="email">
  <Field.Guidance>
    <Field.Label>Email</Field.Label>
    <Field.Description>Login credentials</Field.Description>
  </Field.Guidance>
  <Field.Control><CustomInput /></Field.Control>
  <Field.Validation><Field.Schema value={schema} /></Field.Validation>
  <Field.Feedback><Field.Error /></Field.Feedback>
</Field>
```

#### 5 Design Principles

1. **Intent Visibility** - API structure reveals WHY components exist
2. **Progressive Enhancement** - Start simple, add complexity as needed
3. **Default Composition** - Auto-render sensible defaults, allow overrides
4. **Context Inheritance** - Child components inherit parent Intent contexts
5. **Intent Independence** - Each Intent works standalone, order-agnostic

#### Documentation Reference

Complete 3-Tier specification details:
- `docs/claude/13-field-action-purpose-definition.md` - Intent philosophy and WHY-first approach
- `docs/claude/14-field-action-three-tier-structure.md` - Complete 3-Tier structure tables and examples
- `.agent/conventions.md` - Implementation conventions and guidelines

### Core Components

**Layout & Structure:**
- `Frame` - Universal layout primitive with flexbox/grid, spacing, and surface tokens
- `Section` - Container component with title and optional surface styling

**Typography:**
- `Text` - Text component with variant system and weight options
- `Text.Prose` - Prose typography component with semantic role system (accessed via Text namespace)

**Interactive:**
- `Action` - Button/action component with variants (ghost, surface, primary) and T-shirt sizing ("sm", "md", "lg")
- `Field` - Input field component with icon support

**Visual:**
- `Separator` - Divider component (horizontal/vertical)

**Utilities:**
- `theme.tsx` - Theme provider and hook for light/dark mode with localStorage persistence

### Design Token System

All design tokens are defined in `src/design-system/tokens.css` using CSS custom properties:

**Color System:**
- **Surfaces**: `--surface-base`, `--surface-sunken`, `--surface-raised`, `--surface-overlay`, `--surface-primary`, `--surface-selected`
- **Text**: `--text-primary`, `--text-body`, `--text-subtle`, `--text-muted`, `--text-dim`
- **Primary**: `--primary-bg`, `--primary-fg`
- **Border**: `--border-color`, `--border-width`

**Spacing Scale:**
- Format: `--space-n{value}` (e.g., `--space-n16` for 16px)
- Common values: n4 (4px), n8 (8px), n12 (12px), n16 (16px), n24 (24px), n32 (32px)
- Used via constants: `Space.n4`, `Space.n8`, `Space.n16`, etc.

**Size Scale (Layout):**
- Format: `--size-n{value}` (e.g., `--size-n240` for 240px)
- Common values: n16, n32, n40, n240 (sidebar), n680 (content), n1200 (max)
- Used via constants: `Size.n16`, `Size.n240`, etc.

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
  // Layout (2-Tier Semantic Presets - RECOMMENDED)
  layout={Layout.Stack.Content.Default}  // Use semantic layout presets

  // Spacing (Unified) ⭐ NEW
  spacing={Space.n12}  // Unified spacing: gap = spacing, p = spacing * 1.25
                       // Example: spacing={Space.n12} → gap: 12px, padding: 15px

  // Visual
  surface="base"  // Background from surface tokens (base, raised, sunken, overlay, primary, selected)
  opacity={Opacity.n80}  // Opacity token
  clip            // Clip overflow
  scroll          // Enable scrolling
  interactive     // Interactive states (hover, focus)

  // Sizing
  w={Size.n240}   // Width using Size tokens
  h={Size.n640}   // Height using Size tokens
  ratio="16/9"    // Aspect ratio

  // Overrides (1-Tier Tokens - use when fine-tuning is needed)
  override={{
    gap: Space.n12,        // Override gap independently
    p: Space.n16,          // Override padding independently
    px: Space.n8,          // Directional padding (px, py, pt, pb, pl, pr)
    row: true,
    align: "center",
    justify: "space-between",
    minHeight: Size.n40,   // Size constraints (min/max)
    maxWidth: Size.n1200,  // Size constraints (min/max)
    // ... other 1-tier tokens
  }}

  // Semantic
  title="Section title"  // Tooltip/title

  // DOM
  as="main"       // Polymorphic component (defaults to "div")
/>
```

**IMPORTANT**: The Frame API has evolved to use a **spacing unification system**:

**Spacing Priority (from lowest to highest):**
1. **Layout preset**: May include gap/padding defaults
2. **spacing prop**: Unified spacing for consistent rhythm (`gap = spacing`, `p = spacing * 1.25`)
3. **override prop**: Fine-tuning for exceptional cases

**Spacing Prop Usage:**
```tsx
// ✅ Recommended: Use spacing for consistent rhythm
<Frame spacing={Space.n12}>  // gap: 12px, padding: 15px (12 * 1.25)

// ✅ Override when fine-tuning needed
<Frame spacing={Space.n12} override={{ p: Space.n20 }}>  // gap: 12px, padding: 20px

// ✅ Directional padding in override
<Frame spacing={Space.n12} override={{ px: Space.n16, py: Space.n8 }}>

// ❌ Deprecated: Don't use top-level gap/p props (removed in v7.8+)
// <Frame gap={Space.n12} p={Space.n16}>  // This no longer works
```

**2-Tier System:**
- **Tier 2 (Recommended)**: Semantic layout presets via `layout` prop (e.g., `Layout.Stack.Start.Gap12.Content.Default`)
- **Tier 1 (Fine-tuning)**: Direct token control via `override` prop (e.g., `override={{ gap: Space.n12, p: Space.n16 }}`)
- **Deprecated (Removed in v7.8)**: Top-level `gap`, `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr` props - use `spacing` or `override` instead

**Layout Naming Convention**:
```
Layout.{Type}.{Alignment}.{Gap}.{Context}.{Variant}
       │      │           │     │         └─ Specific use case (Default, Tight, Loose, etc.)
       │      │           │     └─────────── Purpose (Content, Actions, Header, etc.)
       │      │           └───────────────── Gap size (Gap0, Gap4, Gap8, Gap12, Gap16, etc.)
       │      └───────────────────────────── Alignment (Start, Center, End, Baseline, Stretch, Between)
       └──────────────────────────────────── Layout type (Stack, Row, Grid)
```

**Examples**:
- `Layout.Stack.Start.Gap12.Content.Default` - Vertical stack, top-aligned, 12px gap, content rhythm
- `Layout.Row.Center.Gap8.Actions.Center` - Horizontal row, centered, 8px gap, button group
- `Layout.Grid.Start.Gap12.Col240.Cards.Default` - Grid layout, 240px columns, 12px gap, card grid

**Action Component:**
```tsx
<Action
  icon={Icon}        // Lucide icon component
  label="Text"       // Optional text label
  variant="primary"  // ghost (default), surface, primary
  size="sm"          // T-shirt size: "sm" (32px), "md" (40px), "lg" (48px)
  iconSize={IconSize.n16}  // Icon size token (or number)
  rounded={Radius2.round}  // Border radius token
/>
```

**Field Component:**
```tsx
<Field
  label="X"          // Optional label text
  icon={<Icon />}    // Left icon
  rightIcon={<Icon />} // Right icon
  value={value}      // Input value
  onChange={handler} // Change handler
  flex               // Flex: 1
  w="100%"           // Width
  override={{        // Additional token overrides
    gap: Space.n8,
    py: Space.n6,
  }}
/>
```

**Text Component Contexts:**
```tsx
// CRITICAL: Always access via Text namespace
// NEVER import Card, Prose, Menu, Field, Table directly

import { Text } from "../design-system/text/Text";

// Text.Prose - Long-form reading content
<Text.Prose.Title variant="xl">Main Heading</Text.Prose.Title>
<Text.Prose.Body>Paragraph content with comfortable reading flow.</Text.Prose.Body>

// Text.Card - Summarized information chunks
<Text.Card.Title>Card Title</Text.Card.Title>
<Text.Card.Desc>Description text</Text.Card.Desc>

// Text.Menu - Action items and navigation
<Text.Menu.Item>Menu Item</Text.Menu.Item>
<Text.Menu.Group>Section Header</Text.Menu.Group>

// Text.Field - Form labels and values
<Text.Field.Label>Email Address</Text.Field.Label>
<Text.Field.Note>Helper text</Text.Field.Note>

// Text.Table - Tabular data
<Text.Table.Header>Column Header</Text.Table.Header>
<Text.Table.Cell>Cell Value</Text.Table.Cell>
```

## Application Structure

The project uses **React Router DOM** with a hash router to showcase multiple demo applications:

### Design System Demos
- **`/` (LandingApp)** - Landing page showcase
- **`/tokens` (TokensApp)** - Design tokens reference and documentation
- **`/text` (TextSystemApp)** - Typography system showcase
- **`/surface` (SurfaceApp)** - Surface token demonstration
- **`/layouts` (LayoutShowcaseApp)** - Layout preset examples

### Application Demos
- **`/slide` (SlideApp)** - Presentation tool interface (Figma/Canva-like)
- **`/cms` (CMSApp)** - CMS/website builder interface
- **`/crm` (CRMApp)** - CRM application with Tanstack Table integration
- **`/mail` (MailApp)** - Mail client interface
- **`/discord` (DiscordApp)** - Discord-like chat interface
- **`/login` (LoginApp)** - Login/authentication interface
- **`/agent-editor` (AgentEditorApp)** - Agent editor interface
- **`/command-bar` (CommandBarDesignApp)** - Command palette design

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

### CRMApp Structure
Demonstrates a CRM application with Tanstack Table integration:
- **State Management**: Uses Jotai atoms for global state (no props drilling)
- **Data Table**: Tanstack Table v8 with sorting, filtering, and dynamic columns
- **Components**:
  - `CRMSidebar` - Dataset navigation and switching
  - `CRMHeader` - Search and action buttons
  - `CRMToolbar` - View controls and filters
  - `CRMTable` - Main data table with custom columns
  - `CRMDrawer` - Detail panel with properties and activity tabs
- **Data Loading**: Dynamic dataset loading with `import.meta.glob` (supports Korean filenames)
- **Auto Row IDs**: Generates unique `__rowId` for each data row to ensure stable keys

## Layout Generation System

**CRITICAL**: Layout presets are **auto-generated** from `layout.config.ts` via `scripts/generate-layout.ts`.

### How It Works
1. Define semantic layouts in `layout.config.ts`
2. Run `npm run dev` or manually: `npx tsx scripts/generate-layout.ts`
3. Generates `src/design-system/Frame/Layout/Layout.ts` with typed layout tree

### Adding New Layouts
```typescript
// layout.config.ts
export const LAYOUT_CONFIG = {
  Stack: {
    Start: {
      Gap16: {
        Content: {
          Comfortable: { gap: Space.n16, p: Space.n20 }
        }
      }
    }
  }
};
```

**Result**: `Layout.Stack.Start.Gap16.Content.Comfortable`

### DO NOT Edit Layout.ts Directly
- `Layout.ts` is auto-generated (has warning header)
- Always modify `layout.config.ts` instead
- Re-run generation script after changes

## Token System

MDK uses a **branded type system** with explicit token constants to prevent arbitrary values and enable dead code detection:

```typescript
import { Space, Size, IconSize, FontSize, Opacity } from "./design-system/token/token.const.1tier";
import { Radius2, ActionSize } from "./design-system/token/token.const.2tier";

// Usage
<Frame override={{ gap: Space.n12, p: Space.n16 }}>
<Action size="sm" iconSize={IconSize.n16} rounded={Radius2.md}>
```

**Key Benefits:**
- AI cannot use arbitrary numbers (enforced by branded types)
- Unused tokens are detected by `ts-unused-exports`
- Zero runtime overhead (types only)

## Key Architectural Decisions

1. **Token-Driven Design** - All spacing, colors, and sizing use CSS custom properties for consistency
2. **2-Tier Layout System** - Semantic layout presets (`layout` prop) + direct token overrides (`override` prop)
3. **Branded Type System** - TypeScript branded types enforce token usage and prevent arbitrary values
4. **Polymorphic Components** - Frame supports `as` prop to render as different HTML elements
5. **Theme System** - Light/dark mode with automatic persistence to localStorage (via `data-theme` attribute)
6. **TypeScript First** - Full type safety with strict typing on all component props
7. **Router-Based Demos** - Multiple demo apps showcase different use cases for the design system

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

**Biome** - Formatter and linter configured via `biome.json` (used in `npm run format`, `npm run check`)

**Design Audit Script** - Custom linting tool (`scripts/design-audit.cjs`) that enforces design system rules:
- Detects hardcoded pixel values (except 0px and 1px)
- Checks for "Rigid Row" pattern (fixed-width rows must have flexible children)
- Identifies "Floating Flat Surface" issues (surfaces without radius must touch edges)
- Validates minimum action sizes (20px minimum for interactive elements)

## Important Notes

- **Package Manager**: Use `npm` (package-lock.json is the active lock file, though pnpm-lock.yaml exists from earlier)
- **Architecture**: Never use barrel exports (per user's global instructions); prefer FSD (Feature-Sliced Design) architecture
- **Component Philosophy**: Components follow inline styles via props rather than separate CSS modules
- **Styling**: All interactive states (hover, focus, active) are defined in `index.css`
- **Design System**: Self-contained with no external component libraries (except Lucide for icons, Tanstack Table, and Jotai)
- **Theme Switching**: Handled via `data-theme` attribute on document root with localStorage persistence
- **Development Tools**: Use **Cmd+Shift** during dev to activate the React Inspector overlay for component debugging
- **Token System**: All numeric values in layout props (p, gap, w, h) are TOKEN IDs, not pixels. Example: `p={4}` = 16px (from `--space-4`), not 4px
- **Design Enforcement**: Run `npm run lint:design` to validate design system compliance before committing
- **File Structure**: Core design system components are in `src/design-system/`. Some components have subdirectories (e.g., `Frame/`, `text/`) for complex implementations
- **Documentation Location**: See `.agent/conventions.md` for comprehensive coding standards and the 3-Tier Intent System specification

## Documentation Standards

### File Naming Convention
Documentation files in `docs/claude/` use zero-padded number prefixes for sequential ordering:
- Format: `00-filename.md`, `01-filename.md`, `02-filename.md`, etc.
- Ensures logical reading order in file explorers
- Examples:
  - `00-layout-system-tree.md`
  - `01-text-system-tree.md`
  - `02-overlay-token-decision-tree.md`

### Architecture Notes
- **Frame vs Layout**: Frame is the primitive layout component. Layout (e.g., `Layout.Stack`, `Layout.Row`) is a sub-concept of Frame using preset tokens
- **Action Context**: Action is not a top-level category. Actions belong to specific contexts (Frame's Button, Form's Submit, Navigation's Link, etc.)

## Working with MDK Effectively

### Before Making Changes
1. **Understand the Intent**: Ask "WHY does this element exist?" before choosing CSS values
2. **Check Token Purpose**: Use tokens that match the semantic purpose, not just the numeric value
3. **Run Design Audit**: Use `npm run lint:design` to catch violations early
4. **Consult Conventions**: Reference `.agent/conventions.md` for the complete 3-Tier Intent System

### Common Mistakes to Avoid
1. **Top-level Spacing Props (REMOVED)**: Don't use `gap`, `p`, `px`, `py` as top-level Frame props. Use `spacing` prop or `override={{ gap: ..., p: ... }}`
   ```tsx
   // ❌ Wrong (removed in v7.8)
   <Frame gap={Space.n12} p={Space.n16}>

   // ✅ Correct
   <Frame spacing={Space.n12}>
   // or
   <Frame override={{ gap: Space.n12, p: Space.n16 }}>
   ```
2. **Token Constants**: Always use token constants: `Space.n16`, not `spacing={16}` or hardcoded strings
3. **Missing Surface Padding**: If Frame has `surface` prop, it should have padding via `spacing` or `override`
4. **Barrel Exports**: Never create index.ts files that re-export components
5. **Direct Context Imports**: Always import via namespace (e.g., `Text.Card.Title`, not `Card.Title`)
6. **Action Size**: Use T-shirt sizes (`size="sm"`), not numbers (`size={32}`)
7. **Layout Path Errors**: Use the full Layout path (e.g., `Layout.Stack.Start.Gap12.Content.Default`, not `Layout.Stack.Content.Default`)
8. **Wrong Text Components**: Use `Text.Menu.Group` for section headers, not `Text.Menu.Label`

### Token Quick Reference
**Most Common Values**:
- **Spacing**: `Space.n8` (8px), `Space.n12` (12px), `Space.n16` (16px), `Space.n24` (24px), `Space.n32` (32px)
- **Size**: `Size.n240` (240px), `Size.n320` (320px), `Size.n448` (448px), `Size.n640` (640px), `Size.fill`, `Size.screen`
- **Container**: `ContainerSize.n640`, `ContainerSize.n768`, `ContainerSize.n1024`, `ContainerSize.n1280`
- **Action size**: `size="sm"` (32px), `size="md"` (40px), `size="lg"` (48px)
- **Icon size**: `IconSize.n16`, `IconSize.n20`, `IconSize.n24`, `IconSize.n32`
- **Surfaces**: `ghost`, `base`, `raised`, `sunken`, `overlay`, `primary`, `selected`, `panel`
- **Radius**: `Radius2.sm`, `Radius2.md`, `Radius2.lg`, `Radius2.full`
- **Opacity**: `Opacity.n50`, `Opacity.n70`, `Opacity.n80`, `Opacity.n90`, `Opacity.n100`

**Common Layout Presets**:
- **Stack**: `Layout.Stack.Start.Gap12.Content.Default`, `Layout.Stack.Start.Gap8.Content.Tight`
- **Row**: `Layout.Row.Center.Gap8.Actions.Center`, `Layout.Row.Baseline.Gap8.LabelValue.Default`
- **Grid**: `Layout.Grid.Start.Gap12.Col240.Cards.Default`

### Debug Tools
- **React Inspector**: Press `Cmd+Shift` during development to inspect components and copy code
- **Design Audit**: Automated checks for design system violations
- **Unused Exports**: `npm run check:unused` finds dead code
- **Type Check**: `npm run typecheck` for full TypeScript validation
