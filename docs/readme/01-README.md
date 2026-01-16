# Minimal Design Kit (MDK)

**A CSS decision-making framework that helps AI maintain design consistency**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)

---

## Overview

MDK is not a component library or a design token system. **MDK is a CSS decision-making framework** that reduces infinite CSS combinations to ~100 meaningful choices by asking "WHY" before "HOW".

### The Problem

AI can generate beautiful UIs quickly, but struggles to maintain consistency when making modifications. Traditional design systems solve this for humans by providing constraints (tokens, components), but paradoxically make AI perform worse.

**Why?** CSS has infinite combinations:
- Spacing: `0~100px` (infinite)
- Sizing: `0~∞`
- Layout: `display × flex-direction × justify × align` (hundreds)
- Colors: `16,777,216` RGB combinations
- **Total**: Practically infinite

**Result**: AI cannot make consistent choices across infinite options, even with design tokens.

### The Solution

MDK transforms the question from "What value should I use?" to "What is the purpose?"

```tsx
// ❌ Before: Infinite choices
<div style={{
  padding: "??px",        // 0~100
  gap: "??px",            // 0~100
  backgroundColor: "??",  // 16,777,216 colors
  borderRadius: "??px"    // 0~100
}}>

// ✅ After: Purpose-driven choices
<Frame
  layout="stack.content"  // WHY? Content needs rhythm
  surface="raised"        // WHY? Card-like elevation
>
```

**One question**: "What does this element do?"
**One answer**: `layout="stack.content"`, `surface="raised"`
**Auto-determined**: padding 16px, gap 12px, background-color, border-radius 8px, box-shadow

**Result**: Infinite → ~100 meaningful choices (99.999% reduction)

---

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [13 CSS Categories](#13-css-categories)
- [Design Philosophy](#design-philosophy)
- [Examples](#examples)
- [What MDK Is Not](#what-mdk-is-not)
- [Key Benefits](#key-benefits)

---

## Quick Start

### Installation

```bash
npm install minimal-design-kit
# or
yarn add minimal-design-kit
```

### Basic Usage

```tsx
import { Frame, Text } from 'minimal-design-kit';

function App() {
  return (
    <Frame
      layout="stack.content"  // Internal arrangement
      surface="raised"         // Visual identity
      w="content"             // Width purpose
    >
      <Text variant="h1">Hello MDK</Text>
      <Text variant="body">Purpose-driven CSS decisions</Text>
    </Frame>
  );
}
```

---

## Core Concepts

### 1. Surface = Complete Identity

Each surface is a **complete combination** of background + border + shadow + interactive behavior:

```tsx
// Surface is NOT just background color
<Frame surface="base" />     // Clean, flat background (no border, no shadow)
<Frame surface="raised" />   // Card-like (bg + border + shadow-sm)
<Frame surface="overlay" />  // Modal-like (bg + border + shadow-lg)
<Frame surface="ghost" />    // Transparent (becomes visible on hover)
```

**Key Principle**: You don't add border/shadow separately. The surface defines its complete visual identity.

### 2. Layout = Purpose-Driven Spacing

Instead of setting `padding`, `gap` individually, declare the **purpose**:

```tsx
<Frame layout="stack.section">    // Large section separation (gap 24px, p 24px)
<Frame layout="stack.content">    // Readable content rhythm (gap 12px, p 16px)
<Frame layout="stack.list.dense"> // Compact list scanning (gap 4px, p 8px)
<Frame layout="row.actions">      // Button group spacing (gap 8px, p 0)
```

**Result**: 15 semantic layouts instead of infinite spacing combinations.

### 3. Sizing = Content-Based Dimensions

Sizes are derived from **what the container holds**:

```tsx
w="sidebar"   // 240px - Optimal for text + icon (ergonomics)
w="content"   // 680px - Optimal reading width (50-75 chars, typography theory)
w="container" // 1200px - Max width before eye fatigue (visual ergonomics)
```

**Key Insight**: These aren't arbitrary numbers. They're **converged optimal values** from purpose.

### 4. Interactive = Contextual Response

Each surface responds in a way that **fits its identity**:

```tsx
<Frame surface="base" interactive>    // Darkens background (stays flat)
<Frame surface="raised" interactive>  // Tactile feedback (maintains elevation)
<Frame surface="ghost" interactive>   // Materializes from transparent
```

**Principle**: Interactive doesn't "elevate" surfaces. Each surface reacts **in character**.

---

## API Reference

### Frame Component

The universal layout primitive.

```tsx
interface FrameProps {
  // Layout (Internal arrangement)
  layout?: LayoutToken;              // Semantic layout preset
  row?: boolean;                     // Horizontal flow
  gap?: SpaceToken;                  // Item spacing

  // Surface (Visual identity)
  surface?: SurfaceToken;            // Complete visual identity
  rounded?: Radius2Token;            // Border radius override

  // Sizing (Container dimensions)
  w?: WidthToken;                    // Width purpose
  h?: HeightToken;                   // Height purpose
  fill?: boolean;                    // Fill parent
  flex?: boolean | number;           // Flex grow

  // Interactive (Behavior)
  interactive?: boolean | "button" | "text";

  // Overrides (Fine-tuning)
  override?: FrameOverrides;         // Token-based overrides
  style?: RestrictedFrameStyle;      // Escape hatch (restricted)
}
```

### Surface Tokens

```typescript
type SurfaceToken =
  | "base"      // Clean flat background
  | "sunken"    // Recessed background (#f9f9fb)
  | "raised"    // Card-like (bg + border + shadow-sm)
  | "overlay"   // Modal-like (bg + border + shadow-lg)
  | "ghost"     // Transparent (visible on hover)
  | "primary"   // Emphasis (black bg, white text)
  | "selected"; // Active selection state
```

### Layout Tokens

```typescript
type LayoutToken =
  | "stack.section"       // Large sections (gap 24px, p 24px)
  | "stack.content"       // Content rhythm (gap 12px, p 16px)
  | "stack.content.loose" // Relaxed content (gap 16px, p 20px)
  | "stack.list.dense"    // Compact list (gap 4px, p 8px)
  | "row.actions"         // Button groups (gap 8px)
  | "row.header"          // Header layout (gap 12px, p 16px)
  // ... 15 total semantic layouts
```

### Width Tokens

```typescript
type WidthToken =
  | "sidebar"    // 240px - Navigation panel width
  | "content"    // 680px - Optimal reading width
  | "container"  // 1200px - Max content width
  | "screen"     // 100vw - Full viewport
  | "fill"       // 100% - Fill parent
  | "hug"        // fit-content - Hug children
```

---

## 13 CSS Categories

MDK organizes all CSS properties into 13 categories, each answering a specific "WHY":

| Category | Question | Examples |
|----------|----------|----------|
| **Surface** | How is this distinguished? | base, raised, overlay, ghost |
| **Layout** | How are children arranged? | stack.content, row.actions |
| **Sizing** | What does this contain? | sidebar (240px), content (680px) |
| **Typography** | How should this be read? | h1, body, caption |
| **Spacing** | What's the relationship? | section, content, compact |
| **Motion** | How is change perceived? | instant, quick, smooth |
| **Visual Effects** | What feeling does this give? | shadow-sm, shadow-lg, blur |
| **Interaction** | How do users interact? | button, text, drag |
| **State** | How does it respond? | hover, focus, active, disabled |
| **Overlay** | Should it float above? | modal, dropdown, tooltip |
| **Content Flow** | How is content displayed? | scroll, clip, wrap |
| **Anchor** | Should it stick on scroll? | sticky-top, sticky-bottom |
| **Offset** | Adjustment from original? | nudge, offset |

**Total**: ~100 meaningful choices across 13 categories.

---

## Design Philosophy

### "No CSS Without Reason"

Every CSS choice must have a reason. Not "because it looks nice", but "because it serves a purpose".

- ❌ "24px looks good"
- ✅ "Large section separation requires 24px" (→ `layout="stack.section"`)

- ❌ "680px feels right"
- ✅ "Optimal reading width is 50-75 characters" (→ `w="content"`)

### Design Converges

UIs with clear purpose converge to similar solutions:
- Admin sidebars: 200-280px (ergonomic text + icon width)
- Blog content: 600-720px (optimal reading line length)
- Card spacing: 16-24px (visual grouping threshold)

**Same purpose → Same solution**

MDK accelerates this convergence by asking "WHY" first.

### AI-Friendly Design

Traditional design systems give AI **rules to memorize**:
- "Use --space-2 for compact, --space-3 for comfortable"
- Result: AI guesses inconsistently

MDK gives AI **context to reason**:
- "Sidebar needs navigation width" → `w="sidebar"` (240px)
- "List needs quick scanning" → `layout="stack.list.dense"`
- Result: AI infers correctly

**Why it works**: AI doesn't memorize values, it **reasons about purpose**.

---

## Examples

### Admin Dashboard Layout

```tsx
<Frame w="screen" h="screen" layout="row.app">
  {/* Sidebar */}
  <Frame w="sidebar" surface="sunken" layout="stack.list">
    <MenuItem />
    <MenuItem />
  </Frame>

  {/* Main Content */}
  <Frame flex scroll layout="stack.content">
    <Frame surface="raised" layout="stack.content">
      <Text variant="h2">Dashboard</Text>
      <Text variant="body">Content here</Text>
    </Frame>
  </Frame>
</Frame>
```

**Decisions made**:
- `w="sidebar"` → 240px (optimal for text + icon)
- `surface="sunken"` → recessed background (sidebar identity)
- `layout="stack.list"` → compact vertical list (gap 4px)
- `flex` → main content fills remaining space
- `surface="raised"` → card-like elevation

### Modal Dialog

```tsx
<Frame surface="overlay" w="content" layout="stack.content" rounded="lg">
  <Text variant="h3">Confirm Action</Text>
  <Text variant="body">Are you sure you want to proceed?</Text>

  <Frame layout="row.actions" justify="end">
    <Frame surface="ghost" interactive>Cancel</Frame>
    <Frame surface="primary" interactive>Confirm</Frame>
  </Frame>
</Frame>
```

**Decisions made**:
- `surface="overlay"` → modal-like (bg + border + shadow-lg)
- `w="content"` → readable width (680px)
- `layout="stack.content"` → content rhythm (gap 12px, p 16px)
- `layout="row.actions"` → button spacing (gap 8px)
- `surface="ghost"` → transparent button (materializes on hover)
- `surface="primary"` → emphasis button (black bg, white text)

### Input Field

```tsx
<Frame surface="sunken" interactive="text" layout="row.item">
  <Icon name="search" />
  <input placeholder="Search..." />
</Frame>
```

**Behavior**:
- Default: `sunken` background (#f9f9fb) + border
- Hover: Border darkens
- Focus: "Pops" to `base` background (white) + dark border

**Why**: Input fields are recessed by default, then "rise" when focused.

---

## What MDK Is Not

❌ **Not a Tailwind replacement** - MDK doesn't provide utility classes
❌ **Not a component library** - MDK doesn't ship pre-built UI components
❌ **Not a token system** - MDK provides decision framework, not just values

**MDK is a way to _decide_ CSS, not a way to _write_ CSS.**

---

## Key Benefits

### ✅ AI Maintains Consistency
- AI understands **purpose**, not just values
- Same context → Same choice
- Modifications stay coherent

### ✅ Scales Without Complexity
- 100 meaningful choices (not infinite)
- New features follow existing patterns
- Codebase stays readable

### ✅ Design Decisions Are Inferrable
- No memorization required
- Context provides the answer
- Onboarding is understanding, not learning rules

### ✅ Customization Preserves Intent
- Change values, keep purpose
- `w="sidebar"` can be 240px or 280px
- The meaning stays clear

---

## Philosophy Deep Dive

### Why 240px?

Not "because it looks good", but:
- 200px: Too narrow, text wraps awkwardly
- 280px: Too wide, compresses main content
- 240px: **Ergonomic optimum** for text + icon

This isn't arbitrary. It's a **converged value** from purpose.

### Why 680px?

Typography theory: 50-75 characters per line is optimal for reading.
- 16px font size
- 50-75 characters
- = ~680px width

Again, not arbitrary. **Purpose-driven**.

### Why gap: 24px / 12px / 4px?

- **24px**: Large section separation (visually distinct)
- **12px**: Content rhythm (comfortable reading)
- **4px**: Compact list (quick scanning)

These values **emerged from use cases**, not designer preference.

---

## Installation & Setup

### Requirements

- React 18+
- TypeScript 5.0+
- Node.js 18+

### Install

```bash
npm install minimal-design-kit
```

### Basic Setup

```tsx
import { Frame, Text } from 'minimal-design-kit';
import 'minimal-design-kit/dist/style.css';

function App() {
  return (
    <Frame layout="stack.content" surface="base">
      <Text variant="h1">Hello MDK</Text>
    </Frame>
  );
}
```

No configuration needed. The framework is ready to use.

---

## Advanced Usage

### Custom Layouts

```tsx
import { Layout } from 'minimal-design-kit';

// Use preset
<Frame layout={Layout.Stack.Content.Default} />

// Extend with override
<Frame
  layout={Layout.Stack.Content.Default}
  override={{ gap: Space.n24 }}
/>
```

### Interactive Variants

```tsx
<Frame surface="ghost" interactive>         // Default button behavior
<Frame surface="sunken" interactive="text"> // Input field behavior
<Frame surface="raised" interactive="button"> // Explicit button
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
git clone https://github.com/yourusername/minimal-design-kit
cd minimal-design-kit
npm install
npm run dev
```

---

## License

MIT © Teo

---

## Links

- [Documentation](https://docs.minimal-design-kit.dev)
- [GitHub](https://github.com/yourusername/minimal-design-kit)
- [Examples](https://examples.minimal-design-kit.dev)

---

**Remember**: Every CSS choice must have a reason. Ask "WHY" before "HOW".

**Core Insight**: Design is not decoration. Design is a collection of reasons.

— MDK Team
