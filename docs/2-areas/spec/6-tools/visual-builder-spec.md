# IDDL Visual Builder Specification v1.0

## Abstract

IDDL Visual Builder는 Intent-Driven Design Language를 시각적으로 편집할 수 있는 도구입니다. 개발자가 코드를 직접 작성하지 않고도 IDDL 컴포넌트를 드래그 앤 드롭으로 배치하고, 5 Axes 속성을 GUI로 편집하며, 실시간 미리보기를 통해 결과를 확인할 수 있습니다.

본 스펙은 IDDL Visual Builder의 핵심 요구사항, UI/UX 패턴, 기술적 구현 방향을 정의합니다.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Core Requirements](#2-core-requirements)
3. [Visual Representation](#3-visual-representation)
4. [Property Editing Interface](#4-property-editing-interface)
5. [Live Preview System](#5-live-preview-system)
6. [Code Generation](#6-code-generation)
7. [Validation and Type Safety](#7-validation-and-type-safety)
8. [User Workflow](#8-user-workflow)
9. [Section Context Awareness](#9-section-context-awareness)
10. [Advanced Features](#10-advanced-features)
11. [Technical Architecture](#11-technical-architecture)
12. [Implementation Roadmap](#12-implementation-roadmap)

---

## 1. Introduction

### 1.1 Purpose

IDDL Visual Builder는 다음 목표를 달성합니다:

- **접근성 향상**: 비개발자(디자이너, PM)도 IDDL 기반 UI를 구성할 수 있음
- **생산성 증대**: 반복적인 코드 작성 없이 컴포넌트를 빠르게 조합
- **실시간 검증**: 편집 중 즉시 IDDL 규칙 검증 및 시각적 피드백
- **학습 도구**: IDDL 개념을 시각적으로 학습할 수 있는 교육 플랫폼

### 1.2 IDDL 핵심 개념 복습

Visual Builder는 IDDL의 5 Axes System을 정확히 반영해야 합니다:

| Axis | Purpose | Example Values |
|------|---------|----------------|
| **Type** | What is it? | Page, Section, Block, Text, Field, Action, Overlay |
| **Role** | Specific variant | Page: Application/Document/Focus, Section: PrimarySidebar/Editor, Block: Card/Toolbar |
| **Prominence** | How important? | Hero, Primary, Secondary, Tertiary |
| **Intent** | What meaning? | Neutral, Brand, Positive, Caution, Critical, Info |
| **Density** | How spacious? | Comfortable, Standard, Compact |

### 1.3 Key Principles

1. **What You See Is What You Get (WYSIWYG)**: 편집 화면과 실제 렌더링 결과가 동일해야 함
2. **Context-Aware Editing**: Section Context에 따라 자동으로 Block/Text 스타일 조정
3. **Type Safety**: 잘못된 조합(예: Section 안에 Page)을 사전 차단
4. **Code First Compatibility**: Visual Builder로 만든 UI는 코드와 완전히 호환되어야 함

---

## 2. Core Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | IDDL 컴포넌트 드래그 앤 드롭 배치 | P0 |
| FR-02 | 5 Axes 속성 편집 (Type, Role, Prominence, Intent, Density) | P0 |
| FR-03 | 실시간 IDDL 렌더링 미리보기 | P0 |
| FR-04 | TSX 코드 생성 및 복사 | P0 |
| FR-05 | Section Context 기반 자동 스타일링 시뮬레이션 | P0 |
| FR-06 | Role × Layout 호환성 검증 | P1 |
| FR-07 | 컴포넌트 계층 구조 트리 뷰 | P1 |
| FR-08 | Undo/Redo 기능 | P1 |
| FR-09 | 프리셋/템플릿 관리 (IDE Layout, Form Layout 등) | P2 |
| FR-10 | 다크 모드 지원 | P2 |
| FR-11 | 키보드 단축키 (Cmd+C, Cmd+V, Delete 등) | P2 |

### 2.2 Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | 실시간 미리보기 렌더링 성능 | < 16ms (60fps) |
| NFR-02 | 컴포넌트 드래그 반응 지연 | < 50ms |
| NFR-03 | 코드 생성 속도 | < 100ms |
| NFR-04 | 브라우저 호환성 | Chrome 90+, Safari 14+, Firefox 88+ |
| NFR-05 | 최대 컴포넌트 트리 깊이 | 10 levels |

---

## 3. Visual Representation

### 3.1 Component Palette (좌측 패널)

컴포넌트는 IDDL Type별로 그룹화되어 표시됩니다.

```
┌─ Component Palette ─────────────┐
│ 🔍 Search components...         │
├─────────────────────────────────┤
│ 📄 Page (1)                     │
│   ├─ Application                │
│   ├─ Document                   │
│   ├─ Focus                      │
│   └─ Fullscreen                 │
├─────────────────────────────────┤
│ 📦 Section (15)                 │
│   ├─ PrimarySidebar             │
│   ├─ Editor                     │
│   ├─ Panel                      │
│   ├─ ActivityBar                │
│   └─ ... (collapsible)          │
├─────────────────────────────────┤
│ 🧱 Block (40+)                  │
│   ├─ Card                       │
│   ├─ Toolbar                    │
│   ├─ Form                       │
│   ├─ List                       │
│   └─ ... (collapsible)          │
├─────────────────────────────────┤
│ 📝 Text (12)                    │
│   ├─ Title                      │
│   ├─ Body                       │
│   ├─ Label                      │
│   └─ ... (collapsible)          │
├─────────────────────────────────┤
│ 🎛️ Field (20+)                  │
│   ├─ TextInput                  │
│   ├─ Select                     │
│   ├─ Checkbox                   │
│   └─ ... (collapsible)          │
├─────────────────────────────────┤
│ 🔘 Action (5)                   │
│   ├─ Button                     │
│   ├─ IconButton                 │
│   ├─ Link                       │
│   └─ ...                        │
├─────────────────────────────────┤
│ 🪟 Overlay (8)                  │
│   ├─ Dialog                     │
│   ├─ Drawer                     │
│   ├─ Popover                    │
│   └─ ...                        │
└─────────────────────────────────┘
```

**Design Specs**:
- **Width**: 240px (resizable 180-320px)
- **Background**: `bg-surface` (Layer 2)
- **Border**: `border-r border-border-default`
- **Scroll**: Virtual scrolling for 100+ items
- **Search**: Fuzzy search by component name/description

### 3.2 Canvas (중앙 편집 영역)

Canvas는 실제 IDDL 컴포넌트가 렌더링되는 영역입니다.

```
┌─ Canvas ────────────────────────────────────────────────────┐
│ ┌─ Page[Application, Studio] ─────────────────────────────┐ │
│ │ ┌─Act─┐ ┌─Sidebar─────┐ ┌─Editor───────┐ ┌─Panel─────┐ │ │
│ │ │     │ │             │ │              │ │           │ │ │
│ │ │ 🎯  │ │ 📁 Files    │ │ Code here... │ │ Settings  │ │ │
│ │ │ 📊  │ │ 📄 doc.tsx  │ │              │ │           │ │ │
│ │ │ ⚙️  │ │             │ │              │ │           │ │ │
│ │ └─────┘ └─────────────┘ └──────────────┘ └───────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Hover: Section[Editor] - Click to select]                  │
└──────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- **Background**: `bg-layer-0` (App base)
- **Grid**: Optional grid overlay (8px/16px/24px)
- **Selection**: 2px solid `border-accent` outline
- **Hover**: 1px dashed `border-border-emphasis` outline
- **Drop Zone**: Highlight with `bg-accent/10` when valid drop target

### 3.3 Visual Component Indicators

각 컴포넌트는 편집 모드에서 다음 시각적 요소를 포함합니다:

```tsx
┌─────────────────────────────────────────┐
│ Section[PrimarySidebar]           [×][⚙]│ ← Header bar (hover only)
├─────────────────────────────────────────┤
│                                         │
│   Block[Card, Standard, Neutral]        │ ← Nested component
│   ┌───────────────────────────────┐     │
│   │ Text[Title, Primary]          │     │
│   │ "My Card Title"               │     │
│   └───────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

**Component Badge** (top-left, hover only):
- Format: `Type[Role, Prominence, Intent]`
- Example: `Section[PrimarySidebar]`, `Block[Card, Standard, Neutral]`
- Background: `bg-accent/90 backdrop-blur-sm`
- Text: `text-white text-xs font-mono`

**Action Icons** (top-right, hover only):
- `[⚙]` Settings (opens property panel)
- `[×]` Delete
- `[⇕]` Move up/down (when in list)

### 3.4 Component Tree View (우측 하단)

계층 구조를 트리로 표시합니다.

```
┌─ Component Tree ───────────────┐
│ Page[Application]              │
│ ├─ Section[PrimarySidebar]     │
│ │  └─ Block[List]              │
│ │     ├─ Block[Card] ← selected│
│ │     └─ Block[Card]           │
│ ├─ Section[Editor]             │
│ │  └─ Text[Body]               │
│ └─ Section[Panel]              │
│    └─ Block[Form]              │
│       ├─ Field[TextInput]      │
│       └─ Action[Button]        │
└────────────────────────────────┘
```

**Interaction**:
- Click to select component (syncs with Canvas)
- Drag to reorder (within same parent)
- Right-click for context menu (duplicate, delete, wrap in...)

---

## 4. Property Editing Interface

### 4.1 Property Panel (우측 패널)

선택된 컴포넌트의 속성을 편집합니다.

```
┌─ Properties ───────────────────────────┐
│ Block[Card]                            │
├────────────────────────────────────────┤
│ Type: Block                    [🔒]    │ ← Read-only (change via palette)
│ Role: Card                     [▼]     │ ← Dropdown
├────────────────────────────────────────┤
│ Prominence                             │
│ ○ Hero  ● Standard  ○ Subtle           │ ← Radio buttons
├────────────────────────────────────────┤
│ Intent                                 │
│ ● Neutral  ○ Brand  ○ Positive         │
│ ○ Caution  ○ Critical  ○ Info          │
├────────────────────────────────────────┤
│ Density                                │
│ ○ Comfortable  ● Standard  ○ Compact   │
├────────────────────────────────────────┤
│ Layout (optional)                      │
│ □ Stack  □ Inline  □ Grid              │
├────────────────────────────────────────┤
│ Spec (Role-specific)                   │
│ ┌────────────────────────────────────┐ │
│ │ columns: [3]                       │ │ ← JSON editor
│ │ gap: [4]                           │ │
│ └────────────────────────────────────┘ │
├────────────────────────────────────────┤
│ Advanced                               │
│ □ Clickable                            │
│ □ Resizable                            │
│ Value: [_________]                     │ ← For selectable items
└────────────────────────────────────────┘
```

### 4.2 Role-Specific Property Panels

Role에 따라 다른 속성이 표시됩니다.

**Example: Field[TextInput]**
```
┌─ Properties ───────────────────────────┐
│ Field[TextInput]                       │
├────────────────────────────────────────┤
│ Label: [Email Address___________]     │
│ Model: [user.email______________]     │
│ Placeholder: [Enter email_______]     │
│ Required: [✓]                          │
│ Disabled: [ ]                          │
├────────────────────────────────────────┤
│ Constraints                            │
│ ┌────────────────────────────────────┐ │
│ │ pattern: "^[^@]+@[^@]+$"           │ │
│ │ maxLength: 100                     │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

**Example: Section[PrimarySidebar]**
```
┌─ Properties ───────────────────────────┐
│ Section[PrimarySidebar]                │
├────────────────────────────────────────┤
│ Width: [250px] (180px - 400px)         │
│ Resizable: [✓]                         │
│   Min: [150px]  Max: [400px]           │
│ Collapsible: [✓]                       │
│ Default Collapsed: [ ]                 │
└────────────────────────────────────────┘
```

### 4.3 Context-Aware Property Suggestions

Section Context에 따라 추천 속성이 변경됩니다.

**Example: Text[Label] in Section[Panel]**
```
┌─ Properties ───────────────────────────┐
│ Text[Label]                            │
│ 📍 Context: Section[Panel]             │
├────────────────────────────────────────┤
│ ⚠️ Auto-styling applied:                │
│ - Uppercase text                       │
│ - Small size (text-xs)                 │
│ - Subtle color                         │
│ - Tracking-wide                        │
│                                        │
│ [Override auto-styling]                │
└────────────────────────────────────────┘
```

---

## 5. Live Preview System

### 5.1 Preview Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Edit Mode** | Component badges visible, drag-drop enabled | Building UI |
| **Preview Mode** | Pure IDDL rendering, no editor UI | Final result verification |
| **Responsive Mode** | Breakpoint simulation (mobile, tablet, desktop) | Responsive testing |

### 5.2 Section Context Visualization

Section Context Awareness를 시각적으로 표시합니다.

```
┌─ Canvas ────────────────────────────────────────────────────┐
│ ┌─ Section[Panel] ───────────────────────────────────────┐  │
│ │ 📍 Context Active: Panel                              │  │
│ │ ┌───────────────────────────────────────────────────┐ │  │
│ │ │ Text[Label] "SETTINGS"                            │ │  │
│ │ │ ↑ Auto-styled: uppercase, text-xs, tracking-wide  │ │  │
│ │ └───────────────────────────────────────────────────┘ │  │
│ │ Block[Card]                                           │  │
│ │ ↑ sectionOverrides applied: border-0, shadow-none    │  │
│ └───────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 Real-Time Rendering

- **React Fiber Integration**: Use actual IDDL components from `@/components/types/`
- **Hot Reload**: Changes in property panel instantly reflect in preview
- **Error Boundaries**: Graceful error handling with inline error messages

---

## 6. Code Generation

### 6.1 TSX Output

Generate clean, formatted TSX code.

**Example Input** (Visual Builder state):
```json
{
  "type": "Page",
  "role": "Application",
  "layout": "Studio",
  "children": [
    {
      "type": "Section",
      "role": "PrimarySidebar",
      "resizable": { "direction": "horizontal", "minSize": 150, "maxSize": 400 },
      "children": [
        {
          "type": "Block",
          "role": "List",
          "density": "Compact",
          "children": [
            {
              "type": "Text",
              "role": "Label",
              "content": "Files"
            }
          ]
        }
      ]
    },
    {
      "type": "Section",
      "role": "Editor",
      "children": []
    }
  ]
}
```

**Example Output** (Generated TSX):
```tsx
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';

export function MyPage() {
  return (
    <Page role="Application" layout="Studio">
      <Section
        role="PrimarySidebar"
        resizable={{
          direction: 'horizontal',
          minSize: 150,
          maxSize: 400,
        }}
      >
        <Block role="List" density="Compact">
          <Text role="Label" content="Files" />
        </Block>
      </Section>

      <Section role="Editor">
        {/* TODO: Add editor content */}
      </Section>
    </Page>
  );
}
```

### 6.2 Code Generation Rules

1. **Import Optimization**: Only import used components
2. **Prop Ordering**: Follow convention (role, prominence, intent, density, spec, children)
3. **Default Value Omission**: Skip props with default values
4. **Comment Placeholders**: Add `{/* TODO */}` for empty containers
5. **Formatting**: Use Prettier/Biome formatting

### 6.3 Export Options

| Format | Description |
|--------|-------------|
| **Copy TSX** | Copy to clipboard |
| **Download .tsx** | Save as file |
| **Copy JSON** | Copy builder state (for saving/loading) |
| **Export Template** | Save as reusable template |

---

## 7. Validation and Type Safety

### 7.1 Component Hierarchy Validation

Enforce IDDL hierarchy rules:

```
✅ Valid Hierarchy:
Page > Section > Block > Text
Page > Section > Block > Field
Page > Section > Block > Block > Action

❌ Invalid Hierarchy:
Page > Text (Missing Section + Block)
Section > Page (Wrong order)
Text > Block (Leaf node cannot have children)
```

**Validation Rules**:
```typescript
type HierarchyRule = {
  parent: IDDLType;
  allowedChildren: IDDLType[];
};

const HIERARCHY_RULES: HierarchyRule[] = [
  { parent: 'Page', allowedChildren: ['Section'] },
  { parent: 'Section', allowedChildren: ['Block', 'Text', 'Field', 'Action'] },
  { parent: 'Block', allowedChildren: ['Block', 'Text', 'Field', 'Action', 'Separator'] },
  { parent: 'Text', allowedChildren: [] }, // Leaf node
  { parent: 'Field', allowedChildren: [] }, // Leaf node
  { parent: 'Action', allowedChildren: [] }, // Leaf node
];
```

### 7.2 Role × Layout Compatibility

Validate role/layout combinations:

```tsx
// ❌ Invalid: Section[Editor] cannot have layout="grid"
<Section role="Editor" layout="grid"> {/* Error shown */}

// ✅ Valid: Block[Grid] has layout="grid" by default
<Block role="Grid"> {/* Automatically sets layout="grid" */}
```

**Validation Matrix**:
```typescript
const ROLE_LAYOUT_COMPATIBILITY = {
  Page: {
    Application: ['grid'], // CSS Grid only
    Document: ['stack'], // Scrollable stack
    Focus: ['flex'], // Centered flex
    Fullscreen: ['grid'], // Full-screen grid
  },
  Section: {
    PrimarySidebar: ['stack', 'scroll'],
    Editor: ['flex'], // Cannot be grid
    Panel: ['stack', 'tabs'],
    // ...
  },
  Block: {
    Card: ['stack', 'grid'],
    Toolbar: ['inline', 'flex'],
    Form: ['stack'],
    // ...
  },
};
```

### 7.3 Required Property Enforcement

Show warnings for missing required props:

```
⚠️ Field[TextInput] requires "label" and "model" props
⚠️ Action[Button] should have either "content" or "children"
```

### 7.4 ARIA Compliance Verification

Check for accessibility issues:

```
❌ Action[IconButton] missing "title" prop (required for screen readers)
❌ Field[Checkbox] missing "label" prop
✅ All interactive elements have keyboard accessibility
```

---

## 8. User Workflow

### 8.1 Basic Workflow

1. **Create New Page**
   - Select Page role (Application/Document/Focus/Fullscreen)
   - Choose layout preset (Studio/HolyGrail/Sidebar/Single)

2. **Add Sections**
   - Drag Section from palette to Canvas
   - Sections auto-snap to grid-template-areas

3. **Add Blocks**
   - Drag Block into Section
   - Nested Blocks allowed

4. **Add Elements**
   - Drag Text/Field/Action into Block
   - Edit properties in right panel

5. **Preview & Export**
   - Toggle Preview Mode
   - Copy TSX code
   - Save as template

### 8.2 Advanced Workflows

#### 8.2.1 Template-Based Start

```
1. Choose template: "IDE Layout"
2. Pre-filled components:
   - Page[Application, Studio]
   - Section[ActivityBar]
   - Section[PrimarySidebar]
   - Section[Editor]
   - Section[Panel]
3. Customize content
```

#### 8.2.2 Component Wrapping

```
1. Select Text[Body]
2. Right-click > "Wrap in..."
3. Choose Block[Card]
4. Result: Block[Card] > Text[Body]
```

#### 8.2.3 Bulk Property Edit

```
1. Select multiple components (Shift+Click)
2. Edit shared properties (Density, Intent)
3. Apply to all selected
```

### 8.3 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+C` | Copy selected component |
| `Cmd+V` | Paste component |
| `Delete` | Delete selected component |
| `Cmd+Z` | Undo |
| `Cmd+Shift+Z` | Redo |
| `Cmd+D` | Duplicate component |
| `Cmd+P` | Toggle Preview Mode |
| `Cmd+K` | Open component search |
| `Arrow Keys` | Navigate tree (when tree focused) |

---

## 9. Section Context Awareness

### 9.1 Context Detection

Visual Builder must simulate Section Context Awareness (IDDL v5.2).

**Context Propagation**:
```
Page
└─ Section[Panel] ← Context starts here
   └─ Block[Stack]
      ├─ Text[Label] ← Auto-detects isPanelContext = true
      └─ Block[Card] ← Applies sectionOverrides.Panel
```

### 9.2 Visual Indicators

Show context-aware styling in Canvas:

```
┌─ Section[Panel] ─────────────────────────┐
│ 📍 Active Context: Panel                 │
│ ┌──────────────────────────────────────┐ │
│ │ Text[Label] "SETTINGS"               │ │
│ │ 🎨 Auto-styled:                      │ │
│ │    - text-xs                         │ │
│ │    - uppercase                       │ │
│ │    - tracking-wide                   │ │
│ │    - text-text-subtle                │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

### 9.3 sectionOverrides Preview

Property panel shows active overrides:

```
┌─ Properties ───────────────────────────┐
│ Block[Card]                            │
│ 📍 Context: Section[Panel]             │
├────────────────────────────────────────┤
│ 🎨 sectionOverrides.Panel applied:     │
│ - baseStyles: "bg-transparent border-0"│
│ - shadow: "none"                       │
│                                        │
│ [Disable override]                     │
└────────────────────────────────────────┘
```

---

## 10. Advanced Features

### 10.1 Component Variants

Allow saving custom component combinations as variants:

```
User creates: Block[Card] with specific styling
→ Save as "ProfileCard" variant
→ Appears in palette under "My Variants"
→ Drag-and-drop to reuse
```

### 10.2 Data Binding Mock

Simulate data binding for preview:

```tsx
// In Visual Builder:
Field[TextInput]
  model: "user.email"
  value: (mock) "john@example.com" ← Preview only

// Generated code:
<Field
  role="TextInput"
  label="Email"
  model="user.email"
  value={formData.user.email} ← Real binding
  onChange={handleChange}
/>
```

### 10.3 Responsive Breakpoints

Preview at different breakpoints:

| Breakpoint | Width | Use Case |
|------------|-------|----------|
| Mobile | 375px | iPhone SE |
| Tablet | 768px | iPad |
| Desktop | 1440px | MacBook Pro |
| Wide | 1920px | External monitor |

### 10.4 Version History

Track changes with undo/redo timeline:

```
┌─ History ──────────────────────────────┐
│ ● Added Section[Editor] (now)         │
│ ○ Changed Block density to Compact    │
│ ○ Deleted Text[Caption]               │
│ ○ Added Field[TextInput]              │
│ ○ Created Page[Application]           │
└────────────────────────────────────────┘
```

### 10.5 Collaboration (Future)

- **Real-time editing**: Multiple users edit same page
- **Comments**: Annotate components for team review
- **Design tokens sync**: Pull tokens from Figma/design system

---

## 11. Technical Architecture

### 11.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript |
| **State Management** | Zustand (component tree state) |
| **Drag-and-Drop** | `@dnd-kit/core` |
| **Code Generation** | Prettier API + custom AST builder |
| **IDDL Rendering** | Actual `@/components/types/` components |
| **Styling** | TailwindCSS 4.x |
| **Persistence** | IndexedDB (browser storage) |

### 11.2 Data Model

```typescript
// Component Node
interface ComponentNode {
  id: string; // UUID
  type: IDDLType; // Page, Section, Block, Text, Field, Action
  role: string; // Specific role (e.g., "PrimarySidebar", "Card")
  props: Record<string, any>; // All IDDL props
  children: ComponentNode[]; // Nested components
  parentId: string | null;
}

// Builder State
interface BuilderState {
  root: ComponentNode | null; // Root is always Page
  selectedId: string | null;
  clipboard: ComponentNode | null;
  history: {
    past: ComponentNode[][];
    future: ComponentNode[][];
  };
}
```

### 11.3 Code Generation Pipeline

```
ComponentNode Tree
  ↓
AST Builder (custom)
  ↓
TSX AST (babel-types)
  ↓
Prettier Format
  ↓
Final TSX String
```

**Example AST Builder**:
```typescript
function buildTSXAST(node: ComponentNode): t.JSXElement {
  const openingElement = t.jsxOpeningElement(
    t.jsxIdentifier(node.type),
    Object.entries(node.props).map(([key, value]) =>
      t.jsxAttribute(t.jsxIdentifier(key), buildPropValue(value))
    ),
    node.children.length === 0
  );

  const children = node.children.map(buildTSXAST);

  return t.jsxElement(
    openingElement,
    t.jsxClosingElement(t.jsxIdentifier(node.type)),
    children,
    node.children.length === 0
  );
}
```

### 11.4 Validation Engine

```typescript
// Hierarchy Validator
function validateHierarchy(node: ComponentNode): ValidationError[] {
  const errors: ValidationError[] = [];

  const allowedChildren = HIERARCHY_RULES.find(r => r.parent === node.type)?.allowedChildren || [];

  for (const child of node.children) {
    if (!allowedChildren.includes(child.type)) {
      errors.push({
        nodeId: child.id,
        severity: 'error',
        message: `${child.type} cannot be child of ${node.type}`,
      });
    }
  }

  return errors;
}

// Role Compatibility Validator
function validateRoleLayout(node: ComponentNode): ValidationError[] {
  const compatibleLayouts = ROLE_LAYOUT_COMPATIBILITY[node.type]?.[node.role];

  if (node.props.layout && !compatibleLayouts?.includes(node.props.layout)) {
    return [{
      nodeId: node.id,
      severity: 'warning',
      message: `${node.role} typically does not use layout="${node.props.layout}"`,
    }];
  }

  return [];
}
```

---

## 12. Implementation Roadmap

### Phase 1: MVP (4-6 weeks)

- [ ] Component Palette with drag-and-drop
- [ ] Canvas with basic rendering
- [ ] Property Panel with 5 Axes editing
- [ ] Component Tree View
- [ ] TSX code generation
- [ ] Basic validation (hierarchy, required props)

**Deliverable**: Functional Visual Builder for simple Page/Section/Block layouts

### Phase 2: Advanced Editing (4 weeks)

- [ ] Section Context Awareness simulation
- [ ] sectionOverrides preview
- [ ] Undo/Redo
- [ ] Keyboard shortcuts
- [ ] Component search
- [ ] Template presets (IDE, Form, Dashboard)

**Deliverable**: Production-ready editor with full IDDL v5.2 support

### Phase 3: Developer Experience (3 weeks)

- [ ] Role-specific property panels
- [ ] ARIA compliance checker
- [ ] Responsive breakpoint preview
- [ ] Data binding mock
- [ ] Version history
- [ ] Export as template

**Deliverable**: Professional tool for rapid prototyping

### Phase 4: Collaboration (Future)

- [ ] Real-time collaboration
- [ ] Comments and annotations
- [ ] Design token sync (Figma plugin)
- [ ] Component library management
- [ ] Cloud storage integration

**Deliverable**: Team collaboration platform

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **IDDL** | Intent-Driven Design Language |
| **5 Axes** | Type, Role, Prominence, Intent, Density |
| **Section Context** | Automatic styling based on parent Section role |
| **sectionOverrides** | Role-specific overrides for Block/Text in different Sections |
| **Canvas** | Central editing area where IDDL components are rendered |
| **Component Node** | Data structure representing a single IDDL component in the tree |

### B. References

- [IDDL 1.0 Core Specification](../0-core/iddl-1.0-spec-ko.md)
- [Field Element Specification](../4-element/field/field.spec.md)
- [Page Element Specification](../1-page/page.spec.md)
- [Section Specification](../2-section/section-spec.md)
- [Behavior Primitives](../behavior/behavior.md)

### C. Design Decisions

**Q: Why not use HTML contenteditable for Canvas?**
A: IDDL components have complex nested structures and Section Context logic. Direct React rendering ensures 100% WYSIWYG accuracy.

**Q: Why Zustand instead of Redux?**
A: Zustand is simpler, has less boilerplate, and is sufficient for builder state management. No need for Redux's complexity.

**Q: Why generate TSX instead of JSON DSL?**
A: TSX is the canonical format for IDDL. Developers can directly copy-paste generated code into their projects without conversion.

**Q: Why not support custom className in builder?**
A: Visual Builder enforces pure IDDL usage. Custom className violates IDDL principles and should be avoided.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-11
**Status**: Draft
**Authors**: Claude Code (based on IDDL v5.2 specification)
