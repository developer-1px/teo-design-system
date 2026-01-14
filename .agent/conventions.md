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

---

## 15. **CORE CONCEPT: 3-Tier Intent System**

### Overview

**CRITICAL**: MDK uses a universal **3-Tier Intent System** as the foundational pattern for all component specifications. This is the consistent methodology for defining every component in the design system.

### Philosophy: "Intent First, Props Follow"

Every component specification must answer three questions **in order**:

1. **WHY** does this component exist? → Define Intent
2. **WHAT** user problem does it solve? → Map Intent to capabilities
3. **HOW** is it implemented? → Create Components and Props

**Never start with "What props should this have?"** — Always start with "Why does this exist?"

### 3-Tier Structure

```
Tier 1: Primitive (Container Component)
   ↓
Tier 2: Intent (Purpose/Why)
   ↓
Tier 3: Component (Implementation/How)
```

**API Pattern**: `Primitive.{Intent}.{Component}`

### Example: Field Component

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

### Example: Action Component

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

### 6 Core Intents

**Field Intents**:
1. **Guidance** - Guide user on what to enter (label, description, placeholder, required)
2. **Control** - Provide input mechanism (Input, Select, Textarea, Custom UI)
3. **Validation** - Ensure data correctness (schema, rules, triggers, dependencies)
4. **Feedback** - Show validation results (error, success, warning, info)
5. **State** - Manage field state (value, touched, dirty, valid, disabled)
6. **Transform** - Convert data format (format, parse, sanitize)

**Action Intents**:
1. **Handler** - Define action behavior (onClick, async handling)
2. **State** - Manage action state (loading, disabled, pending, active)
3. **Confirmation** - Request user confirmation (dialog, message, buttons)
4. **Feedback** - Show action results (success, error, progress, toast)
5. **Prevention** - Prevent unwanted execution (once, debounce, throttle, cooldown)
6. **Lifecycle** - Hook into action phases (onStart, onSuccess, onError, onComplete)

### Progressive Enhancement: 3 Usage Levels

**Level 1: Simple** (Props-based, Intent hidden) - For rapid prototyping
```tsx
<Field name="email" label="Email" validate={schema}>
  <Input />
</Field>
```

**Level 2: Structured** (Intent groups visible) - For production apps
```tsx
<Field name="email">
  <Field.Guidance label="Email" description="For login" />
  <Field.Validation schema={schema} />
  <Field.Control><Input /></Field.Control>
  <Field.Feedback><Field.Error /></Field.Feedback>
</Field>
```

**Level 3: Explicit** (Full Intent + Component control) - For maximum customization
```tsx
<Field name="email">
  <Field.Guidance>
    <Field.Label required>Email Address</Field.Label>
    <Field.Description>We'll never share your email.</Field.Description>
  </Field.Guidance>
  <Field.Control><CustomFloatingInput /></Field.Control>
  <Field.Validation><Field.Schema value={schema} /></Field.Validation>
  <Field.Feedback>
    <Field.Error>{(error) => <AnimatedError message={error.message} />}</Field.Error>
  </Field.Feedback>
  <Field.Transform>
    <Field.Sanitize fn={(v) => v.trim().toLowerCase()} />
  </Field.Transform>
</Field>
```

### 5 Design Principles

1. **Intent Visibility** - API structure reveals WHY components exist
2. **Progressive Enhancement** - Start simple (Level 1), add complexity as needed (Level 2, 3)
3. **Default Composition** - Intent components auto-render if no children provided
4. **Context Inheritance** - Child components inherit parent and Intent contexts automatically
5. **Intent Independence** - Each Intent works standalone and is order-agnostic

### Context Inheritance Pattern

```tsx
// Field Context (name, id, value, error, touched)
//   ↓ inherited by
// Guidance Context (label, description, required, labelId)
//   ↓ inherited by
// Label Component (uses both contexts automatically)

<Field name="email">  {/* Creates FieldContext */}
  <Field.Guidance label="Email">  {/* Creates GuidanceContext, inherits FieldContext */}
    <Field.Label />  {/* Inherits both FieldContext + GuidanceContext */}
  </Field.Guidance>
</Field>
```

### Implementation Convention

**File Structure**:
```
src/design-system/
├── Field/
│   ├── Field.tsx              # Tier 1: Primitive + Context
│   ├── Guidance/
│   │   ├── Guidance.tsx       # Tier 2: Intent Context
│   │   ├── Label.tsx          # Tier 3: Component
│   │   ├── Description.tsx    # Tier 3: Component
│   │   └── index.ts
│   ├── Control/
│   │   ├── Control.tsx        # Tier 2: Intent Context
│   │   ├── Input.tsx          # Tier 3: Component
│   │   └── index.ts
│   └── index.ts
```

**Naming Convention**:
- Tier 1 (Primitive): PascalCase noun (Field, Action, Frame, Prose)
- Tier 2 (Intent): PascalCase concept (Guidance, Validation, Control, State)
- Tier 3 (Component): PascalCase specific (Label, Input, Error, Schema)

### Anti-Patterns to Avoid

❌ **Intent Confusion**: Mixing multiple Intents in one component
```tsx
// BAD: Control Intent contains Validation Intent
<Field.Input validate={schema} error={error} />

// GOOD: Clear Intent separation
<Field.Control><Input /></Field.Control>
<Field.Validation schema={schema} />
<Field.Feedback><Field.Error /></Field.Feedback>
```

❌ **Props First Thinking**: Starting with "what props do we need?"
```tsx
// BAD: Props without Intent reasoning
"Let's add debounce, throttle, once, confirm to Button"

// GOOD: Intent-driven reasoning
"Why? User clicks too fast → Intent: Prevention → Props: debounce, throttle
 Why? User might misclick → Intent: Confirmation → Props: confirm"
```

❌ **Arbitrary Grouping**: Technical grouping instead of Intent-based
```tsx
// BAD: What is "Visual" Intent?
<Field.Visual><Label /><Error /></Field.Visual>

// GOOD: Clear Intent purpose
<Field.Guidance><Label /></Field.Guidance>
<Field.Feedback><Error /></Field.Feedback>
```

### Documentation Reference

Complete 3-Tier specification details:
- `docs/claude/13-field-action-purpose-definition.md` - Intent philosophy and WHY-first approach
- `docs/claude/14-field-action-three-tier-structure.md` - Complete 3-Tier structure tables and examples

### Checklist: Before Implementing New Components

- [ ] Define 3-5 user questions this component answers
- [ ] Map each question to a specific Intent
- [ ] Create Intent capability table (Why, What, User Question)
- [ ] Design 3-Tier structure tree
- [ ] Document all 3 usage levels (Simple, Structured, Explicit)
- [ ] Verify Intent independence (each Intent works standalone)
- [ ] Implement Context inheritance pattern
- [ ] Write specification document following the template

### MDK Slogan

**"See the Intent, Control the Component"**

*Intent를 보고, Component를 제어하라*
