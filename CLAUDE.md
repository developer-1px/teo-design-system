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
6. **Text inheritance (v3.1)**: App/Page root에 `text-base text-text-primary` 설정 → 모든 하위 Text가 자동 상속 → `text-*` className 최소화
7. **Minimal IDDL (v3.1)**: role 기반으로 일관되게 정리, 수동 className 최소화, `selected` prop 사용

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
<Layout variant="stack" depth={1} className="h-96">
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

**Developer declares**: Purpose + Prominence + Selected
**System handles**: Tokens, Semantics, Accessibility, Keyboard Navigation, Interactive States (hover/active/focus), Spacing (gap/padding)

**v3.1 Updates:**
- **Interactive State Token System**: `prominence × intent × state → className` (hover, active, selected, disabled, focus 자동 생성)
- **Spacing Token System**: `prominence × density → gap/padding` (수동 spacing 제거)
- **Text Inheritance**: App/Page root에서 font 설정 → 모든 하위 Text 자동 상속
- **Minimal IDDL**: `selected` prop으로 선택 상태 표현, 수동 className 최소화

### IDDL Component Hierarchy

```
Page (Root - Application level)
 ├─ role="Document" (default): Scrollable content page with max-width
 ├─ role="Application": Full-screen app layout with CSS Grid
 ├─ role="Focus": Centered content (login, payment)
 └─ role="Fullscreen": Locked full-screen (presentation, kiosk)
      └─ Section (Layout regions: Header, Sidebar, Editor, Panel, etc.)
          └─ Group (Logical grouping: Form, Card, Toolbar, List, Grid)
              └─ Item (IDDL Type - v4.0)
                  ├─ Text (Static content: Title, Body, Label, Code)
                  ├─ Field (Data binding: text, number, date, select, etc.)
                  └─ Action (Interactions: buttons, links)

Overlay (Floating UI: Dialog, Drawer, Popover, Toast, Tooltip)
```

**Key Changes in v5.0** (2026-01-10):
- **PageRole renamed values**: "App" → "Application", "Content" → "Document"
- **New PageRole values**: "Focus" (centered content), "Fullscreen" (locked viewport)
- **template prop → layout prop**: Clearer naming with PascalCase values
- **Removed redundant props**: layout="grid" implied by role="Application", direction removed
- **Backward compatibility maintained**: Deprecated props still work with warnings

**Key Changes in v4.0**:
- **Item introduced as formal IDDL type**: All primitives (Text, Field, Action) are now under `Item` namespace
- **Page role-based rendering**: Different PageRole values for different page types
- **Dynamic grid template system**: Section roles automatically generate CSS Grid layouts

### Key IDDL Props

All IDDL components share these core props:

- **`role`**: What is it? (e.g., `Container`, `Form`, `Toolbar`, `Navigator`)
- **`prominence`**: How important? (`Hero` | `Primary` | `Secondary` | `Tertiary`)
- **`intent`**: What meaning? (`Neutral` | `Brand` | `Positive` | `Caution` | `Critical` | `Info`)
- **`density`**: How spacious? (`Comfortable` | `Standard` | `Compact`)

### IDDL Component Examples

```tsx
// Page - Application root (v5.0)
// role="Application": Full-screen layout with dynamic grid
<Page role="Application" layout="Studio" density="Compact">
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
  <Section role="Panel">...</Section>
</Page>

// role="Document": Scrollable content page (default)
<Page role="Document" title="User Settings" maxWidth="lg" centered>
  <Section role="Container">
    <Group role="Form">...</Group>
  </Section>
</Page>

// role="Focus": Centered content (login, payment)
<Page role="Focus" title="Sign In" centered>
  <Section role="Container">
    <Group role="Form">...</Group>
  </Section>
</Page>

// Section - Layout regions with role-based positioning (v4.1)
<Section role="PrimarySidebar" resizable={{ direction: 'horizontal', minSize: 200, maxSize: 400 }}>
  <Group role="List">...</Group>
</Section>

// Group - Logical grouping
<Group role="Toolbar" prominence="Primary">
  <Action prominence="Primary" intent="Positive">Save</Action>
  <Action prominence="Secondary">Cancel</Action>
</Group>

// Item primitives (v4.0)
<Text role="Title" prominence="Primary">Welcome</Text>
<Field label="Email" model="user.email" dataType="email" required />
<Action prominence="Primary" intent="Brand" behavior={{ action: "submit" }}>
  Submit
</Action>
```

### IDDL Type Reference

**See**: `src/components/types/Item/types.ts` for complete type definitions (v4.0 location)

**Specification**: `docs/2-areas/spec/iddl-spec-1.0.1.md` for official IDDL spec

## IDDL Component Architecture Patterns (v4.0)

### Field Component: Headless + Renderer Pattern

Field v4.0 uses a **separation of concerns** pattern:

**Structure**:
```
Field.tsx (Main component)
  ├─ headless/           # Logic hooks (NO UI)
  │   ├─ useTextField.ts      # Text input logic
  │   ├─ useNumberField.ts    # Number input logic
  │   ├─ useSelectField.ts    # Select dropdown logic
  │   ├─ useRadioField.ts     # Radio group logic
  │   └─ useRatingField.ts    # Star rating logic
  ├─ renderers/          # UI components (NO logic)
  │   ├─ TextField.tsx        # Text input UI with CVA
  │   ├─ NumberField.tsx      # Number input UI with CVA
  │   ├─ SelectField.tsx      # Select dropdown UI with CVA
  │   └─ RadioField.tsx       # Radio group UI with CVA
  └─ role/               # Primitive field variants
      ├─ Input.tsx
      ├─ Select.tsx
      ├─ Checkbox.tsx
      └─ Radio.tsx
```

**Pattern**:
```tsx
// Field.tsx - Main component with dataType branching
export function Field({ dataType, ...props }: FieldProps) {
  if (dataType === 'text') {
    return <TextField {...props} />;
  }
  if (dataType === 'number') {
    return <NumberField {...props} />;
  }
  // ... other dataTypes
}

// headless/useTextField.ts - Pure logic hook
export function useTextField(props: UseTextFieldProps) {
  const [value, setValue] = useState(props.value);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e.target.value);
  };
  return {
    inputProps: () => ({ value, onChange: handleChange, ... }),
    labelProps: () => ({ htmlFor: id, ... }),
    // ... other prop getters
  };
}

// renderers/TextField.tsx - UI component using hook + CVA
export function TextField(props: FieldProps) {
  const field = useTextField(props);
  return (
    <div className={fieldContainerVariants({ prominence, intent })}>
      <label {...field.labelProps()}>{props.label}</label>
      <input {...field.inputProps()} className={inputVariants({ prominence, intent, state })} />
    </div>
  );
}
```

**Benefits**:
- Logic is testable without UI rendering
- UI can be swapped (Material, Ant Design, etc.)
- CVA variants handle all styling consistently
- Headless hooks can be reused across different renderers

**Supported dataTypes** (21 total):
- **Text inputs**: text, email, password, url, tel, search
- **Numbers**: number, currency, percentage
- **Dates**: date, time, datetime, month, week, daterange
- **Selections**: select, radio, checkbox, multiselect
- **Rich**: textarea, richtext, rating, color

## Page Component Architecture (v5.0)

### Role-Based Rendering Pattern

Page v5.0 refines **role-based rendering** with clearer PageRole values and unified layout prop:

```tsx
// Page.tsx - Main component with role-based branching
export function Page({ role = 'Document', ... }: PageProps) {
  if (role === 'Application') {
    return <AppLayout>...</AppLayout>;  // Full-screen grid layout
  }
  // Default: Document page (scrollable, max-width constrained)
  return <div className="h-full overflow-y-auto">...</div>;
}
```

### PageRole Types (v5.0)

| Role | Physical Laws | Use Case |
|------|---------------|----------|
| **Application** | Full-screen, no scroll (`w-screen h-screen overflow-hidden`) | IDE, Studio, Dashboard, Complex apps |
| **Document** | Scrollable page (`min-h-screen overflow-y-auto`) | Articles, Docs, Forms, Settings |
| **Focus** | Centered content (`flex items-center justify-center`) | Login, Payment, Single-task flows |
| **Fullscreen** | Locked viewport (no scroll, no chrome) | Presentations, Kiosks, Immersive experiences |

### role="Application" - Full-Screen Application Layout

**Use case**: IDE, Studio, Dashboard, PPT apps

**Features**:
- `w-screen h-screen overflow-hidden` - No scrolling, fills viewport
- Dynamic CSS Grid generation based on Section roles
- Supports multiple layout patterns (Studio, HolyGrail, Sidebar, Split)

**Page Layouts** (v5.0):

| Layout | Section Roles | Use Case |
|--------|---------------|----------|
| `Studio` | ActivityBar, PrimarySidebar, Editor, Panel, SecondarySidebar | IDE/Studio (IntelliJ-style) |
| `HolyGrail` | Header, Navigator, Container, Aside, Footer | 3-column complete layout |
| `Sidebar` | Navigator, Container | Documentation, Settings |
| `Split` | Master, Detail | Master-detail views |
| `Single` | Header, Container, Footer | Basic single-column |
| `Blank` | Container | Custom layouts, dialogs |

**Dynamic Grid System** (v5.0):

The system automatically generates CSS Grid layout from Section roles:

```tsx
// IDEPage.tsx
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">...</Section>  // Auto: 48px
  <Section role="PrimarySidebar">...</Section>  // Auto: 250px
  <Section role="Editor">...</Section>       // Auto: 1fr
  <Section role="Panel">...</Section>        // Auto: 300px
</Page>

// Generates CSS Grid based on role-config.ts mappings:
// grid-template-areas: "activitybar sidebar editor panel"
// grid-template-columns: 48px 250px 1fr 300px
// grid-template-rows: 1fr
```

**Resizable Panels** (v4.0):

```tsx
<Section
  role="PrimarySidebar"
  resizable={{
    direction: 'horizontal',
    minSize: 200,
    maxSize: 400
  }}
  collapsible
>
  ...
</Section>
```

**Implementation**:
- **AppLayout renderer**: `src/components/types/Page/renderers/AppLayout.tsx`
- **Dynamic grid hook**: `src/components/types/Page/hooks/useDynamicGridTemplate.ts`
- **Role config**: `src/components/types/Section/role-config.ts`
- **Resizable hook**: `src/components/types/Page/hooks/useResizable.ts`

### role="Document" - Scrollable Content Page

**Use case**: Documentation, Settings, Forms, Content pages (default)

**Features**:
- `h-full overflow-y-auto` - Scrollable content
- `max-width` constraint with optional centering
- Support for breadcrumbs, title, description
- Loading and error states

**Example**:
```tsx
<Page
  role="Document"
  title="Settings"
  description="Configure your preferences"
  maxWidth="lg"
  centered
  breadcrumbs={[...]}
>
  <Section role="Container">...</Section>
</Page>
```

### role="Focus" - Centered Content (v5.0 NEW)

**Use case**: Login, Payment, Single-task flows

**Features**:
- `flex items-center justify-center` - Centered layout
- Minimal chrome, focus on primary task
- Ideal for authentication, checkout, wizards

**Example**:
```tsx
<Page role="Focus" title="Sign In">
  <Section role="Container">
    <Group role="Form">...</Group>
  </Section>
</Page>
```

### role="Fullscreen" - Locked Viewport (v5.0 NEW)

**Use case**: Presentations, Kiosks, Immersive experiences

**Features**:
- `w-screen h-screen overflow-hidden` - No scroll, locked
- No default chrome (title, breadcrumbs hidden)
- Full control over viewport

**Example**:
```tsx
<Page role="Fullscreen">
  <Section role="Container">
    {/* Presentation slides */}
  </Section>
</Page>
```

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
│   ├── types/           # ⭐ IDDL Components (v4.0 structure)
│   │   ├── Page/        # Root application component
│   │   │   ├── Page.tsx              # Main Page component with role branching
│   │   │   ├── renderers/            # Role-specific renderers
│   │   │   │   └── AppLayout.tsx     # Full-screen app layout renderer
│   │   │   ├── hooks/                # Layout logic hooks
│   │   │   │   ├── useDynamicGridTemplate.ts  # Dynamic grid generation
│   │   │   │   └── useResizable.ts            # Resizable panel logic
│   │   │   ├── components/           # Layout components
│   │   │   │   └── ResizeHandle.tsx  # Drag handle for resizing
│   │   │   └── grid-templates.css    # CSS Grid definitions
│   │   ├── Section/     # Layout regions (ActivityBar, Sidebar, Editor, Panel)
│   │   │   ├── Section.tsx
│   │   │   └── role/    # Section role variants (Panel, Toolbar, RightBar)
│   │   ├── Group/       # Logical grouping (Form, Card, Toolbar, List)
│   │   │   ├── Group.tsx
│   │   │   └── role/    # Group role variants (Card, Tabs, DataTable, etc.)
│   │   ├── Item/        # ⭐ IDDL Primitives (v4.0)
│   │   │   ├── types.ts             # All IDDL type definitions
│   │   │   ├── Text/                # Static content
│   │   │   │   ├── Text.tsx
│   │   │   │   └── role/            # Text roles (Title, Body, Label, Code, Badge, Alert, Avatar, Kbd)
│   │   │   ├── Field/               # Data binding (Headless + Renderer pattern)
│   │   │   │   ├── Field.tsx        # Main Field component with dataType branching
│   │   │   │   ├── headless/        # Logic hooks (useTextField, useNumberField, etc.)
│   │   │   │   ├── renderers/       # UI renderers (TextField, NumberField, SelectField, etc.)
│   │   │   │   └── role/            # Field role variants (Input, Select, Checkbox, Radio, etc.)
│   │   │   └── Action/              # Interactions
│   │   │       ├── Action.tsx
│   │   │       └── role/            # Action roles (Button, IconButton, ResizeHandle)
│   │   └── Overlay/     # Floating UI (Dialog, Drawer, Popover, Tooltip)
│   │       ├── Overlay.tsx
│   │       ├── CommandPalette.tsx
│   │       ├── SearchModal.tsx
│   │       ├── SettingsModal.tsx
│   │       └── role/    # Overlay role variants (Tooltip)
│   └── context/         # React contexts (IDDL Context, Layout Provider)
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

// ✅ IDDL components (NO barrel export - direct imports from types/ v4.0)
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Action } from '@/components/types/Item/Action/Action';
import { Text } from '@/components/types/Item/Text/Text';
import { Field } from '@/components/types/Item/Field/Field';
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

**IMPORTANT**: Ignore `docs/4-archive/` directory - it contains outdated/deprecated documentation that should not be referenced.

**IDDL Specification** (Primary):
- **[docs/index.md](docs/index.md)** ⭐ IDDL Specification overview
- **[docs/2-areas/spec/iddl-spec-1.0.1.md](docs/2-areas/spec/iddl-spec-1.0.1.md)** - Official IDDL specification v1.0.1
- **[docs/2-areas/spec/iddl-coverage-analysis.md](docs/2-areas/spec/iddl-coverage-analysis.md)** - Implementation coverage analysis
- **[docs/2-areas/spec/minimal-renderer-guide.md](docs/2-areas/spec/minimal-renderer-guide.md)** - Minimal IDDL renderer guide
- **[docs/2-areas/spec/renderer-improvement-roadmap.md](docs/2-areas/spec/renderer-improvement-roadmap.md)** - Renderer improvement roadmap

**IDDL Core Reference** (Areas - Continuously Maintained):
- **[docs/2-areas/core/3-reference/component-role-mapping.md](docs/2-areas/core/3-reference/component-role-mapping.md)** - Component taxonomy and role mapping
- **[docs/2-areas/core/3-reference/field-reference.md](docs/2-areas/core/3-reference/field-reference.md)** - Field component API (21 data types)
- **[docs/2-areas/core/3-reference/page-v2-spec.md](docs/2-areas/core/3-reference/page-v2-spec.md)** - Page component API (layouts & navigation)

**IDDL Patterns** (Areas - Best Practices):
- **[docs/2-areas/patterns/01-behavior-patterns.md](docs/2-areas/patterns/01-behavior-patterns.md)** - Behavior patterns
- **[docs/2-areas/patterns/02-accessibility-patterns.md](docs/2-areas/patterns/02-accessibility-patterns.md)** - Accessibility patterns
- **[docs/2-areas/patterns/03-data-patterns.md](docs/2-areas/patterns/03-data-patterns.md)** - Data patterns
- **[docs/2-areas/patterns/04-composition-patterns.md](docs/2-areas/patterns/04-composition-patterns.md)** - Composition patterns
- **[docs/2-areas/patterns/05-state-patterns.md](docs/2-areas/patterns/05-state-patterns.md)** - State patterns
- **[docs/2-areas/patterns/06-animation-patterns.md](docs/2-areas/patterns/06-animation-patterns.md)** - Animation patterns
- **[docs/2-areas/patterns/07-layout-patterns.md](docs/2-areas/patterns/07-layout-patterns.md)** - Layout patterns
- **[docs/2-areas/patterns/08-performance-patterns.md](docs/2-areas/patterns/08-performance-patterns.md)** - Performance patterns

**Active Projects** (1-project - In Progress):
- **[docs/1-project/1-type-role-aria-mapping-1.md](docs/1-project/1-type-role-aria-mapping-1.md)** - Type/Role/ARIA mapping
- **[docs/1-project/2-react-redender.md](docs/1-project/2-react-redender.md)** - React renderer implementation
- **[docs/1-project/3-how-to-renderer.md](docs/1-project/3-how-to-renderer.md)** - Renderer how-to guide
- **[docs/1-project/4-headless-hook.md](docs/1-project/4-headless-hook.md)** - Headless hooks implementation roadmap

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

// IDDL components (NO barrel exports - from types/ v4.0)
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Action } from '@/components/types/Item/Action/Action';
import { Text } from '@/components/types/Item/Text/Text';
import { Field } from '@/components/types/Item/Field/Field';
```

## Important Notes

- This project is in **Korean** for documentation comments and UI text
- **IDDL-first development**: Use IDDL DSL components (Page, Section, Group, Action, Text, Field) instead of traditional HTML/CSS when building UI
- **ALL UI MUST USE IDDL**: NEVER use raw HTML/Tailwind for layout or design. Use IDDL components from `@/components/types/`:
  - ❌ `<div className="flex">` - WRONG
  - ✅ `<Group role="Toolbar" layout="inline">` - CORRECT
  - If a role doesn't exist, register it in the IDDL component and extend it
  - If customization is needed, add a new role variant to the IDDL component
- Design system adherence is **critical** - do not deviate without documenting exceptions
- Always check `DESIGN_PRINCIPLES.md` before making visual decisions
- When in doubt about layer levels, shadows, or accent usage - consult the design docs first
- **No barrel exports**: NEVER create `index.ts` files - always import from specific files
- **Cmd+D for debugging**: Use IDDL Inspector to understand component hierarchy during development