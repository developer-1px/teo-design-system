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
pnpm build:debug-panel      # Build debug panel client

# Code quality
pnpm lint:biome             # Run Biome linter
pnpm format                 # Format code with Biome
pnpm fix                    # Auto-fix linting issues
pnpm check                  # Run TypeScript + Biome checks
```

## Project Overview

This is an **enterprise application platform** (엔터프라이즈 애플리케이션 플랫폼) that provides VS Code/Figma-level features as a full package. Built with React 19, TypeScript, and TailwindCSS 4.x, the project solves the endless design inconsistencies that plague commercial applications by providing a **declarative, intent-driven design system**.

**Core Innovation**: IDDL (Intent-Driven Design Language) - a TSX-based DSL where developers declare "why" (purpose + prominence) instead of "how" (colors + sizes). The system automatically handles tokens, semantics, and accessibility.

**Current Status**: Phase 1 (~80% complete) - Declarative UI Rendering
**Goal**: Provide all essential enterprise features (Command Palette, Keyboard Navigation, Focus Management, Selection System, Undo/Redo, etc.) as built-in, ready-to-use components.

**3-Phase Strategy**:
- **Phase 1**: 선언적 UI 렌더링 (현재, ~80%) - "의도를 선언하면 패턴대로 화면이 나온다"
- **Phase 2**: 데이터 바인딩 & 상태 (다음) - "입력과 상태가 자동으로 연결된다"
- **Phase 3**: 인터랙션 행동 시스템 (최종 목표) - "포커스, 선택, 리사이징이 자연스럽게 동작한다"

See [Application Platform Vision](docs/2-areas/core/0-evolution/application-platform-vision.md) for complete vision and roadmap.

### Tech Stack
- **React 19** with TypeScript for type-safe components
- **Vite 7** for fast development and building
- **TailwindCSS 4.x** with PostCSS and custom design tokens
- **Wouter** for hash-based routing
- **CodeMirror 6** for code editing functionality
- **Lucide React** for consistent iconography
- **Biome** for linting and formatting
- **IDDL** - Custom TSX-based DSL for intent-driven UI

### Application Structure

The project is a **multi-app showcase** demonstrating different aspects of IDDL. Each app is accessible via hash routing:

**Main Apps** (production-ready examples):
- `/ide` - IDE application (file tree, editor, panels)
- `/ppt` - Presentation app (markdown to slides)
- `/notion` - JSON data viewer
- `/emoji` - Emoji designer tool
- `/design` - Documentation browser
- `/builder` - DSL builder tool
- `/showcase` - Component showcase

**IDDL Component Showcases** (development/testing):
- `/page` - Page component examples
- `/section` - Section component examples
- `/block` - Block component examples
- `/field` - Field component examples
- `/text` - Text component examples
- `/action` - Action component examples
- `/overlay` - Overlay component examples

All apps are routed in `src/app/App.tsx` using Wouter's hash-based routing.

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
          └─ Block (Logical grouping: Form, Card, Toolbar, List, Grid)
              └─ Element (IDDL Primitives - current structure)
                  ├─ Text (Static content: Title, Body, Label, Code, Badge, Alert)
                  ├─ Field (Data binding: text, number, date, select, etc.)
                  ├─ Action (Interactions: buttons, links)
                  └─ Separator (Visual dividers)

Overlay (Floating UI: Dialog, Drawer, Popover, Toast, Tooltip)
```

**Note**: The specification uses `Group` and `Item` terminology, but the current implementation uses `Block` and `Element` as folder names in `src/components/types/`. When reading/writing code, use the actual folder structure (`Element`, `Block`). When discussing concepts, both terminologies are understood.

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

**See**: `src/components/types/Element/` for Element primitives (Text, Field, Action, Separator)

**Specification**:
- `docs/2-areas/spec/5-field/field.spec.md` - Field specification with role catalog
- `docs/2-areas/spec/1-page/` - Page specifications
- `docs/2-areas/spec/2-sectoin/section.spec.md` - Section specification

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

**Supported Field Roles** (from field.spec.md):
- **Text inputs**: TextInput, TextArea, PasswordInput, EmailInput, SearchInput
- **Numbers**: NumberInput
- **Selections**: Select, Combobox, Checkbox, Switch, RadioGroup
- **Dates/Time**: DateInput, TimeInput, DateTimeInput
- **Files**: FileInput
- **Special**: Slider, OTPInput, TagInput, Rating

**Implementation**: Each Field role has corresponding renderer in `src/components/types/Element/Field/renderers/` and primitive component in `src/components/types/Element/Field/role/`

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
├── app/                  # Root application (router, global contexts)
│   ├── App.tsx           # Main router with Wouter
│   ├── contexts/         # Global contexts (AppProvider)
│   └── widgets/          # Global widgets (FloatingBar)
├── apps/                 # Application modules (FSD 2.1)
│   ├── IDE/              # Main apps (production examples)
│   │   ├── AppIDE.tsx            # ✅ Entry point
│   │   ├── lib/                  # IDE-specific utilities
│   │   ├── pages/                # Page-level components
│   │   └── widgets/              # Complex UI blocks (editor, file-tree, chat, sidebar)
│   ├── JSON/
│   │   ├── AppJSON.tsx           # ✅ Entry point
│   │   ├── lib/                  # JSON-specific utilities
│   │   ├── pages/
│   │   └── widgets/
│   ├── PPT/
│   │   ├── AppPPT.tsx            # ✅ Entry point
│   │   ├── lib/                  # PPT-specific utilities (markdown-parser, markdown-to-dsl)
│   │   ├── pages/
│   │   └── widgets/
│   ├── EMOJI/
│   │   ├── AppEMOJI.tsx
│   │   ├── lib/                  # Emoji designer utilities
│   │   ├── pages/
│   │   └── widgets/
│   ├── DSLBuilder/
│   │   ├── AppDSLBuilder.tsx
│   │   ├── lib/                  # DSL builder utilities
│   │   ├── pages/
│   │   └── widgets/
│   ├── DOCS/
│   │   ├── AppDOCS.tsx
│   │   ├── lib/                  # docs-scanner.ts
│   │   ├── pages/
│   │   └── widgets/
│   ├── PAGE/             # IDDL Component showcases (development/testing)
│   │   └── AppPage.tsx
│   ├── SECTION/
│   │   └── AppSection.tsx
│   ├── BLOCK/
│   │   └── AppBlock.tsx
│   ├── FIELD/
│   │   └── AppField.tsx
│   ├── TEXT/
│   │   └── AppText.tsx
│   ├── ACTION/
│   │   └── AppAction.tsx
│   ├── OVERLAY/
│   │   └── AppOverlay.tsx
│   └── showcase/
│       └── AppShowcase.tsx
├── components/           # Shared UI components
│   ├── ui/              # Base UI components (Layout, Button, IconButton, etc.)
│   ├── workspace/       # Workspace navigation components
│   ├── modal/           # Modal dialogs (Settings, Search)
│   ├── types/           # ⭐ IDDL Components (current structure)
│   │   ├── Page/        # Root application component
│   │   │   ├── Page.tsx              # Main Page component with role branching
│   │   │   ├── renderers/            # Role-specific renderers
│   │   │   ├── hooks/                # Layout logic hooks
│   │   │   └── components/           # Layout components (ResizeHandle)
│   │   ├── Section/     # Layout regions (ActivityBar, Sidebar, Editor, Panel)
│   │   │   ├── Section.tsx
│   │   │   ├── renderers/            # Section renderers (IDESection, ContainerSection, etc.)
│   │   │   └── role/                 # Section role variants (Panel, Toolbar, RightBar)
│   │   ├── Block/       # ⭐ Logical grouping (spec: "Group")
│   │   │   ├── Block.tsx
│   │   │   └── role/                 # Block roles (Card, Tabs, DataTable, Accordion, etc.)
│   │   ├── Element/     # ⭐ IDDL Primitives (spec: "Item")
│   │   │   ├── Text/                # Static content
│   │   │   │   ├── Text.tsx
│   │   │   │   └── role/            # Text roles (Label, Code, Badge, Alert, Avatar, Kbd, etc.)
│   │   │   ├── Field/               # Data binding (Headless + Renderer pattern)
│   │   │   │   ├── Field.tsx        # Main Field component with role branching
│   │   │   │   ├── Field.types.ts   # Field type definitions
│   │   │   │   ├── renderers/       # UI renderers (TextField, NumberField, SelectField, DateField, etc.)
│   │   │   │   └── role/            # Field role primitives (Input, Select, Checkbox, Radio, Switch, Slider, etc.)
│   │   │   ├── Action/              # Interactions
│   │   │   │   ├── Action.tsx
│   │   │   │   ├── renderers/       # Action renderers (ButtonAction, IconButtonAction, LinkAction)
│   │   │   │   └── role/            # Action roles (Button, IconButton, ResizeHandle)
│   │   │   └── Separator/           # Visual dividers
│   │   │       └── Separator.tsx
│   │   └── Overlay/     # Floating UI (Dialog, Drawer, Popover, Tooltip)
│   │       ├── Overlay.tsx
│   │       ├── CommandPalette.tsx
│   │       ├── SearchModal.tsx
│   │       ├── SettingsModal.tsx
│   │       ├── SearchModalDSL.tsx
│   │       ├── SettingsModalDSL.tsx
│   │       └── role/                 # Overlay role variants (Tooltip)
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
import { AppIDE } from '@/apps/IDE/AppIDE.tsx';

// ❌ Never use barrel exports
import { AppIDE } from '@/apps/IDE';  // NO index.ts!

// ✅ Direct import from specific file (include .tsx extension)
import { IDEPage } from '@/apps/IDE/pages/ide/IDEPage.tsx';

// ✅ IDDL components (NO barrel export - direct imports from types/)
import { Page } from '@/components/types/Page/Page.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { Block } from '@/components/types/Block/Block.tsx';  // spec: "Group"
import { Action } from '@/components/types/Element/Action/Action.tsx';  // spec: "Item"
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Field } from '@/components/types/Element/Field/Field.tsx';
import { Separator } from '@/components/types/Element/Separator/Separator.tsx';

// ✅ Shared utilities
import { cn } from '@/shared/lib/utils.ts';
import { useTheme } from '@/shared/lib/theme.ts';

// ✅ Design tokens
import { tokens } from '@/shared/config/tokens.ts';
```

**Note**: This project uses explicit `.tsx`/`.ts` extensions in imports (enabled by TypeScript's `allowImportingTsExtensions`).

**Naming Convention:**
- Entry points: `App{Name}.tsx` (e.g., `AppIDE.tsx`, `AppJSON.tsx`)
- Pages: `{Name}Page.tsx` (e.g., `IDEPage.tsx`, `JSONPage.tsx`)
- Widgets: Descriptive names (e.g., `FileTree.tsx`, `CodeEditor.tsx`)

## Configuration

- **Path alias**: `@/*` maps to `./src/*` (configured in `vite.config.ts`)
- **Linting**: Biome is used for linting and formatting (not ESLint/Prettier)
- **Vite plugins**: `iddlInspector()` plugin enabled (see `vite.config.ts`)
- **React 19**: Uses new React 19 features, jsx-dev-runtime is patched for IDDL Inspector

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

**Vision & Strategy** (Core - READ FIRST):
- **[docs/2-areas/core/0-evolution/application-platform-vision.md](docs/2-areas/core/0-evolution/application-platform-vision.md)** ⭐ Project vision & 3-phase strategy
- **[docs/2-areas/core/0-evolution/phase-1-declarative-ui.md](docs/2-areas/core/0-evolution/phase-1-declarative-ui.md)** - Phase 1 implementation status (~80%)
- **[docs/2-areas/core/0-evolution/enterprise-features-checklist.md](docs/2-areas/core/0-evolution/enterprise-features-checklist.md)** - 100+ enterprise features tracking

**IDDL Specification** (Primary):
- **[docs/2-areas/spec/5-field/field.spec.md](docs/2-areas/spec/5-field/field.spec.md)** - Field specification with role catalog (MECE field types)
- **[docs/2-areas/spec/1-page/](docs/2-areas/spec/1-page/)** - Page specifications (page.gpt.spec.md, page.gemini.spec.md)
- **[docs/2-areas/spec/2-sectoin/section.spec.md](docs/2-areas/spec/2-sectoin/section.spec.md)** - Section specification
- **[docs/2-areas/spec/iddl-coverage-analysis.md](docs/2-areas/spec/iddl-coverage-analysis.md)** - Implementation coverage analysis
- **[docs/2-areas/spec/renderer-improvement-roadmap.md](docs/2-areas/spec/renderer-improvement-roadmap.md)** - Renderer improvement roadmap
- **[docs/2-areas/spec/iddl-key-pool.md](docs/2-areas/spec/iddl-key-pool.md)** - IDDL key pool reference

**Active Projects** (1-project - In Progress):
- **[docs/1-project/1-type-role-aria-mapping-1.md](docs/1-project/1-type-role-aria-mapping-1.md)** - Type/Role/ARIA mapping
- **[docs/1-project/2-react-redender.md](docs/1-project/2-react-redender.md)** - React renderer implementation
- **[docs/1-project/3-how-to-renderer.md](docs/1-project/3-how-to-renderer.md)** - Renderer how-to guide
- **[docs/1-project/4-headless-hook.md](docs/1-project/4-headless-hook.md)** - Headless hooks implementation roadmap

**Note**: Documentation structure is evolving. Some referenced docs in this file may not exist yet. Always verify file existence before referencing.

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

// App-specific libraries (Note: Some of these apps may not be fully implemented)
import { createNewDesign } from '@/apps/EMOJI/lib/emoji-designer/utils';
import { generateId } from '@/apps/DSLBuilder/lib/dsl-builder/utils';
import { getAllDocs } from '@/apps/DOCS/lib/docs-scanner';

// IDDL components (NO barrel exports - direct imports from types/)
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Field } from '@/components/types/Element/Field/Field';
```

## Important Notes

- This project is in **Korean** for documentation comments and UI text
- **Enterprise Application Platform**: This is NOT just a design system - it's a full platform providing VS Code/Figma-level features (Command Palette, Keyboard Navigation, Focus Management, etc.)
- **3-Phase Strategy**: Currently in Phase 1 (~80% complete) - Declarative UI Rendering. See [application-platform-vision.md](docs/2-areas/core/0-evolution/application-platform-vision.md) for roadmap
- **IDDL-first development**: Use IDDL DSL components (Page, Section, Block, Action, Text, Field) instead of traditional HTML/CSS when building UI
- **ALL UI MUST USE IDDL**: NEVER use raw HTML/Tailwind for layout or design. Use IDDL components from `@/components/types/`:
  - ❌ `<div className="flex">` - WRONG
  - ✅ `<Block role="Toolbar">` - CORRECT
  - If a role doesn't exist, register it in the IDDL component and extend it
  - If customization is needed, add a new role variant to the IDDL component
- **Terminology**: Spec documents use `Group` and `Item`, but code uses `Block` and `Element` as folder names
- Design system adherence is **critical** - do not deviate without documenting exceptions
- Always check design tokens in `src/shared/config/tokens.ts` before making visual decisions
- When in doubt about depth levels, shadows, or accent usage - consult the design docs first
- **No barrel exports**: NEVER create `index.ts` files - always import from specific files
- **Cmd+D for debugging**: Use IDDL Inspector (press Cmd+D / Ctrl+D in dev mode) to understand component hierarchy during development