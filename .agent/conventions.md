# Coding and Design Conventions

## 0. CRITICAL: THE GOLDEN RULE

### **NEVER CONFUSE NUMERIC TOKENS WITH PIXELS**
- All numeric values passed to layout props (`p`, `pt`, `pb`, `pl`, `pr`, `px`, `py`, `gap`, `w`, `h`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`, `size`, `top`, `bottom`, `left`, `right`) are interpreted as **TOKEN IDs**, not pixels.
- **Example**: `p={4}` results in `16px` (from `--space-4`), whereas `p={20}` results in `160px` (from `--space-20`).
- **Standard Scale**:
    - `1` = 4px
    - `2` = 8px
    - `3` = 12px
    - `4` = 16px
    - `5` = 24px (Standard Action/Icon size)
    - `6` = 32px
    - `8` = 48px
- **Sanity Check**: If you are using a number > 10 for padding or small icons, you are likely making a mistake.

## 1. Import & Module Organization

### Never Use Barrel Exports
- **NEVER** create `index.ts` or `index.tsx` files that re-export components
- Always import directly from source file: `import { Frame } from "../design-system/Frame"`

### Import Rules
- Omit file extensions (`.tsx`, `.ts`)
- Alphabetical order within groups
- Design system: flat structure at `src/design-system/` root (no subdirectories)

### Import Order
1. External libraries (React, Lucide)
2. Internal components (same feature)
3. Design system components
4. Utilities and types
5. CSS imports

```tsx
import { useState } from "react";
import { Plus } from "lucide-react";

import { PropertiesPanel } from "../components/PropertiesPanel";

import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame";

import type { ActionVariant } from "../design-system/types";
```

## 2. No Hardcoded Pixels

### Strict Rule
- **NEVER** use hardcoded `px` values in styles/props
- Use token props: `p={2}`, `w={65}`, `gap={4}`
- Non-token values (100%, auto) must be strings: `w="100%"`

### Token Mapping
- `p`, `gap`, `top`, `left` → `var(--space-*)`
- `w`, `h`, `minWidth` → `var(--size-*)`
- `rounded` → `var(--radius-*)`

### Component Props
- Use: `w`, `h`, `p`, `gap`, `rounded`
- NOT: `width`, `height`, `radius`

### Padding Law
If `Frame` has `surface` prop, it MUST have padding (default `p={2}`)

## 3. TypeScript Standards

### Type Safety Rules
- **NO** `any` type - use `unknown` + type guards
- **NO** `@ts-ignore` - fix types properly
- Use `import type` for type-only imports
- Handle null/undefined explicitly

```tsx
// ❌ WRONG
// @ts-ignore
return <Icon size={iconSize} />;

// ✅ CORRECT
const Icon = icon as React.ComponentType<{ size: number }>;
return <Icon size={iconSize} />;
```

### String Literals
Extract to type definitions:
```tsx
type TabType = "DESIGN" | "ANIMATE";
type Status = "todo" | "done" | "progress";
```

### Component Props
- Define explicit interfaces
- Extend with `React.ComponentProps<typeof Component>`
- Omit conflicting attributes:
```tsx
interface ActionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  tooltip?: string;
}
```

## 4. Component Architecture

### Single Responsibility
- **One component per file** (150 lines max)
- Extract helpers to separate files (not inline)
- Complex state (>3 related) → custom hooks/reducers

```tsx
// ❌ WRONG - helper inside
export function Panel() {
  const Helper = () => <div>...</div>;
  return <Helper />;
}

// ✅ CORRECT - separate file
// Helper.tsx
export function Helper() { return <div>...</div>; }

// Panel.tsx
import { Helper } from "./Helper";
```

### State Management
- Clear naming: `isOpen` not `open`
- No prop drilling - use context/composition
- Extract >3 related states to hooks

### Patterns
- Polymorphic: `<Frame as="main">`
- Compound: For related UI (Tabs, Accordion)

## 5. React Best Practices

### Keys
**NEVER** use array index - use stable IDs:
```tsx
// ❌ WRONG
{items.map((item, i) => <Item key={i} />)}

// ✅ CORRECT
{items.map((item) => <Item key={item.id} />)}
```

### Conditionals
Extract complex logic to functions:
```tsx
// ❌ WRONG
const color = status === "done" ? "green" : status === "progress" ? "yellow" : "gray";

// ✅ CORRECT
const getColor = (status: Status) => {
  const map = { done: "green", progress: "yellow", todo: "gray" };
  return map[status];
};
```

### Event Handlers
- Component methods: `handleClick`, `handleSubmit`
- Props: `onClick`, `onSubmit`

## 6. Modern IDE Architecture

### Hierarchy
`Workbench > Part > Frame > Section > Stack`

- **Workbench**: Main app shell
- **Part**: Large sections (Sidebar, Panel, Editor)
- **Section**: Semantic groupings with headers/separators

### Separators
`Section` manages padding so `Separator` stretches edge-to-edge

## 7. File Organization

### Structure
```
src/
├── apps/           # Application pages
├── components/     # Shared UI
├── design-system/  # Primitives (flat, no subdirs)
├── inspector/      # Dev tools
└── main.tsx
```

### Naming
- Components: PascalCase (`Frame.tsx`)
- Utilities: camelCase (`utils.ts`)
- Types: `types.ts` or `.types.ts`
- Constants: UPPER_SNAKE_CASE

### File Structure Order
1. Imports
2. Types/Interfaces
3. Constants
4. Helpers
5. Main component
6. Sub-components

## 8. Code Style

### Formatting
- **2 spaces** indentation
- **Biome** formatter: `biome check --write`
- Auto-organize imports

### Dead Code
- Remove commented code (use git)
- Remove unused imports/files
- Remove console.logs

### Comments
- Explain **why**, not what
- JSDoc for public APIs:
```tsx
/**
 * Universal layout primitive with flexbox/grid
 */
export function Frame(props: FrameProps) { }
```

## 9. Inspector & Debugging

### Behavior
- **Shortcut**: `Cmd+D` toggle/lock
- **Action**: Copy component shell + "fix this" to clipboard
- **Badge**: Top-left, outside outline
- **Source**: Show filename:line (e.g., `App.tsx:120`)

## 10. Performance

- Lazy load routes: `React.lazy` + `Suspense`
- Memoize expensive: `React.memo`, `useMemo`, `useCallback`
- Import icons individually from lucide-react
- Avoid unnecessary dependencies

## 11. Design Token System

### Available Tokens
- **Spacing**: `--space-{0-40}` (0px-160px)
- **Sizing**: `--size-{3-300}` (12px-1200px)
- **Typography**: `--font-size-{1-6}`, `--font-weight-{regular|medium|bold}`
- **Prose**: `--prose-{role}-{size|height|spacing|weight}`
- **Colors**: `--surface-*`, `--text-*`, `--primary-*`
- **Radius**: `--radius-{none|sm|md|lg|xl|2xl|3xl|full|round}`
- **Shadows**: `--shadow-{sm|md|lg|xl|2xl}`

### toToken() Utility
```tsx
toToken(2, "space")      // → "var(--space-2)"
toToken(65, "size")      // → "var(--size-65)"
toToken("100%", "space") // → "100%"
toToken("10 20", "space") // → "var(--space-10) var(--space-20)"
```

## 12. Visual Excellence

- Use rich gradients, subtle shadows (`shadow="lg"`)
- Proper typography (Inter, Outfit)
- **NO** placeholder text/images - generate real content
- Use `ProseDocument` and `ProseSection` for text-heavy content
- Use `Action` for buttons with consistent `iconSize` and `variant`

## 13. Design Principles

### 1. Convergent Evolution
UI elements with a background (surface) naturally demand internal spacing. If a `Frame` has a `surface`, it almost always needs `p={2}` or more. 

### 2. Semantic Hierarchy
Use `Prose` roles (`h1`, `h2`, `body`, etc.) instead of manual font sizes. This ensures consistency across the entire application and allows for easy global theme adjustments.

### 3. Purposeful Density
Avoid "airless" designs. Use the spacing scale to create clear visual grouping. Related items use small gaps (`gap={1}` or `gap={2}`), while unrelated sections use large spacing (`p={24}` or more).

### 4. Interactive Affordance
Every interactive element must use the `Action` component or `cursor="pointer"`. Feedback (hover, active states) is managed by the design system; do not override it with manual CSS unless absolutely necessary.

### 5. Standardized Atoms
Always prefer `Action`, `Text`, and `Frame` over raw HTML tags. This ensures that every part of the UI is connected to the IDDL token system.

## 14. Text System Conventions

### Unified Access
- **ALWAYS** access text components via the main `Text` namespace: `Text.Card.Title`, `Text.Prose.Body`.
- **NEVER** directly import from `text/context/*`.
- **NEVER** use `<Card.Title>` or `<Prose.Body>` directly; they must be namespaced under `Text`.

### Structure
- `Text` component acts as the single entry point.
- Contexts (`Card`, `Prose`, `Menu`, `Field`, `Table`) are attached as static properties.

### Example
```tsx
// ❌ WRONG
import { Card } from "../design-system/text/context/Card";
return <Card.Title>Hello</Card.Title>;

// ✅ CORRECT
import { Text } from "../design-system/text/Text";
return <Text.Card.Title>Hello</Text.Card.Title>;
```
