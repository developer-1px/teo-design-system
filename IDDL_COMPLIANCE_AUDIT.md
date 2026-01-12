# IDDL Compliance Audit Report

## Executive Summary

**Total files scanned**: 100+ .tsx files in `/src/apps/`  
**Files with IDDL violations**: 54 files (54% of app files)  
**Files using raw HTML**: 47 files (47% of app files)  
**Severity**: MEDIUM - Most violations are in development/showcase apps, not production code

---

## Violation Breakdown by App

### Tier 1: High Violation Count (Production Apps)
| App | Files with className | Total className lines | Primary Issues |
|-----|----------------------|----------------------|-----------------|
| **IDE** | 16 files | ~200+ | Manual flex/grid, hardcoded spacing, raw divs in sidebar views |
| **BLOCK** | 9 files | ~100+ | Showcase examples with manual layout, className noise |
| **DOCS** | 7 files | ~150+ | Design system documentation with intentional raw styles |
| **PAGE** | 6 files | ~80+ | Example pages mixing IDDL with raw HTML |
| **JSON** | 6 files | ~60+ | Database views with manual table layouts |

### Tier 2: Medium Violation Count (Secondary Apps)
| App | Files with className | Primary Issues |
|-----|----------------------|-----------------|
| **EMOJI** | 3 files | Pixel canvas with inline styles, form inputs |
| **SHOWCASE** | 2 files | Intentional demonstration files |
| **SECTION** | 1 file | Single showcase file |
| **PPT** | 1 file | Presentation rendering |
| **BEHAVIOR** | 1 file | Behavior showcase |
| **ADAPTIVE** | 1 file | Adaptive scale demo (100 className lines) |

---

## Common Violation Patterns

### Pattern 1: Manual Flex/Grid Layout (Most Common)
**Files affected**: ~30+ files  
**Example**:
```tsx
// WRONG - Manual flex + gap
<Section role="Container" className="flex flex-col gap-3">
  <Block role="Container" className="flex flex-col gap-3">
    <div className="flex items-center gap-2 text-xs font-bold">
      {/* content */}
    </div>
  </Block>
</Section>

// CORRECT - Should use Block role with layout prop
<Block role="Container" layout="vertical" gap="md">
  <Block role="Group" layout="vertical" gap="sm">
    <Text role="Label" prominence="Subtle">
      {/* content */}
    </Text>
  </Block>
</Block>
```

**Files with this pattern**:
- `/src/apps/IDE/widgets/sidebar-views/TokensView.tsx` (10+ instances)
- `/src/apps/IDE/widgets/sidebar-views/DebugView.tsx` (8+ instances)
- `/src/apps/DOCS/widgets/design-system/ShadowVsBorderGuide.tsx` (15+ instances)
- `/src/apps/ADAPTIVE/pages/AdaptiveScaleDemoPage.tsx` (50+ instances)
- `/src/apps/PAGE/widgets/examples/*.tsx` (40+ instances across 6 files)

---

### Pattern 2: Raw HTML Elements Instead of IDDL
**Files affected**: ~47 files  
**Example**:
```tsx
// WRONG - Raw HTML
<div className="flex items-center gap-2">
  <span>Label</span>
  <input type="text" />
</div>

// CORRECT - IDDL components
<Block role="Form" gap="sm">
  <Text role="Label">Label</Text>
  <Field dataType="text" />
</Block>
```

**Severity levels**:
- Critical: `<div>`, `<span>`, `<section>` for layout (should use Block/Section)
- Medium: `<input>`, `<select>` for forms (should use Field)
- Low: `<input type="checkbox">`, `<label>` for accessibility (common in legacy code)

---

### Pattern 3: Hardcoded Spacing with Tailwind Classes
**Files affected**: ~40+ files  
**Example**:
```tsx
// WRONG - Hardcoded spacing
<div className="p-4 mb-3 px-2 gap-2 flex-1">

// CORRECT - Use IDDL tokens + design system
<Block role="Container" padding="md" gap="sm" className="flex-1">
```

**Common violations**:
- `p-4`, `px-2`, `py-1` → Should use Block `padding` prop
- `gap-2`, `gap-3`, `gap-6` → Should use Block `gap` prop
- `mb-3`, `mt-4` → Should use spacing tokens or gap prop
- `flex flex-col`, `flex-1` → Should use Block `layout="vertical"` or `flex-1` class

---

### Pattern 4: Inline Style Attributes
**Files affected**: ~15 files  
**Example**:
```tsx
// WRONG - Inline styles (not using design tokens)
<div style={{ height: '56px', width: '100%', margin: '0 auto' }}>

// CORRECT - Use design system
<Block role="Container" className="w-full" style={{ minHeight: tokens.spacing.lg }}>
```

**Files with this pattern**:
- `/src/apps/EMOJI/pages/emoji-designer/EmojiDesignerPage.tsx` (gridTemplateColumns, gridTemplateRows)
- `/src/apps/EMOJI/widgets/emoji-designer/*.tsx` (custom pixel grid)
- `/src/apps/IDE/widgets/editor/MarkdownViewer.tsx` (toolbar height)
- `/src/apps/ADAPTIVE/pages/AdaptiveScaleDemoPage.tsx` (container dimensions)

---

### Pattern 5: Mixed IDDL and Raw HTML
**Files affected**: ~30+ files  
**Example**:
```tsx
// MIXED - IDDL component with raw HTML children
<Block role="Form">
  <div className="flex items-center gap-2">  {/* Raw HTML */}
    <label>Email</label>
    <input type="email" />
  </div>
</Block>

// Should be pure IDDL:
<Block role="Form">
  <Field label="Email" dataType="email" />
</Block>
```

**Most problematic files**:
- `/src/apps/IDE/widgets/sidebar-views/SettingsView.tsx`
- `/src/apps/IDE/widgets/sidebar-views/SourceControlView.tsx`
- `/src/apps/EMOJI/pages/emoji-designer/EmojiDesignerPage.tsx`
- `/src/apps/JSON/widgets/json-viewer/FormView.tsx`

---

## Files Requiring Immediate Cleanup

### Critical (Production Apps - High Priority)

1. **`/src/apps/IDE/widgets/sidebar-views/TokensView.tsx`** (100+ violations)
   - 10+ manual flex/grid combinations
   - Needs conversion to IDDL Block roles
   - ColorSwatch component needs IDDL wrapper

2. **`/src/apps/IDE/widgets/sidebar-views/DebugView.tsx`** (54 violations)
   - Heavy flex/gap usage
   - Multiple raw divs for layout
   - Should use Block for container structure

3. **`/src/apps/EMOJI/pages/emoji-designer/EmojiDesignerPage.tsx`** (80+ violations)
   - Large sections with raw HTML
   - Input fields using native HTML instead of Field component
   - Inline styles for grid layouts (lines 147-175, 184-222, 263-305, 354-423)

4. **`/src/apps/ADAPTIVE/pages/AdaptiveScaleDemoPage.tsx`** (100 violations)
   - Entire demo is raw HTML with Tailwind
   - Should migrate to IDDL for consistency
   - Uses inline styles instead of design tokens

### High (Educational/Secondary Apps)

5. **`/src/apps/DOCS/widgets/design-system/ShadowVsBorderGuide.tsx`** (98 violations)
   - Comparison examples intentionally showing raw patterns
   - Could benefit from hybrid approach (raw example + IDDL version)

6. **`/src/apps/PAGE/widgets/examples/*.tsx`** (40+ violations across 6 files)
   - These are intentional examples showing page patterns
   - Could be acceptable as "before/after" examples

7. **`/src/apps/JSON/widgets/database/views/TableView.tsx`** (30+ violations)
   - Complex table layout with manual grid
   - Should create IDDL Table component

### Medium (Showcase/Demo)

8. **`/src/apps/BLOCK/pages/block/examples/*.tsx`** (15+ files with violations)
   - Showcase examples are acceptable
   - Some could migrate to cleaner IDDL patterns

---

## Detailed File List with Violation Types

### IDE App (16 files with violations)

| File | Violations | Type | Priority |
|------|-----------|------|----------|
| `widgets/sidebar-views/TokensView.tsx` | 100+ | flex, grid, gap, divs | CRITICAL |
| `widgets/sidebar-views/DebugView.tsx` | 54 | flex, gap, spacing | CRITICAL |
| `widgets/sidebar-views/SettingsView.tsx` | 40 | flex, divs, forms | HIGH |
| `widgets/sidebar-views/SourceControlView.tsx` | 36 | flex, spacing | HIGH |
| `widgets/sidebar-views/RunView.tsx` | 36 | flex, divs | HIGH |
| `widgets/sidebar-views/ExtensionsView.tsx` | ~30 | flex, divs | HIGH |
| `widgets/sidebar-views/SearchView.tsx` | ~30 | flex, gap | HIGH |
| `widgets/sidebar-views/JsonView.tsx` | ~25 | divs, spacing | MEDIUM |
| `widgets/sidebar-views/PresentationView.tsx` | ~25 | divs | MEDIUM |
| `widgets/editor/MarkdownViewer.tsx` | 35 | inline styles, divs | MEDIUM |
| `widgets/editor/CodeEditor.tsx` | ~20 | spacing | MEDIUM |
| `widgets/editor/EditorTabs.tsx` | ~25 | flex, divs | MEDIUM |
| `widgets/editor/ComponentPreview.tsx` | ~20 | divs | MEDIUM |
| `widgets/file-tree/FileTree.tsx` | ~15 | flex, gap, divs | MEDIUM |
| `widgets/chat/AIAgentChat.tsx` | ~20 | divs, spacing | MEDIUM |
| `widgets/TopToolbar.tsx` | ~25 | spacing, divs | MEDIUM |

### BLOCK App (9 files)

| File | Type | Priority |
|------|------|----------|
| `pages/block/BlockShowcasePage.tsx` | Showcase (acceptable) | MEDIUM |
| `pages/block/examples/BlockStructureDemo.tsx` | Showcase (acceptable) | MEDIUM |
| `pages/block/examples/BlockFormsDemo.tsx` | Showcase (acceptable) | MEDIUM |
| `pages/block/examples/BlockToolbarsDemo.tsx` | Showcase (acceptable) | MEDIUM |
| `pages/block/examples/BlockCardsDemo.tsx` | Showcase (acceptable) | MEDIUM |
| `pages/block/examples/BlockNavigationDemo.tsx` | Showcase (acceptable) | MEDIUM |
| `pages/block/examples/BlockListsDemo.tsx` | Showcase (acceptable) | MEDIUM |
| `pages/block/examples/BlockSectionContextDemo.tsx` | Showcase (acceptable) | MEDIUM |
| `pages/block/examples/SectionSpecDemo.tsx` | Showcase (acceptable) | MEDIUM |

### DOCS App (7 files)

| File | Violations | Type | Priority |
|------|-----------|------|----------|
| `widgets/design-system/ShadowVsBorderGuide.tsx` | 98 | flex, divs, intentional | HIGH |
| `widgets/design-system/TokenTable.tsx` | 29 | flex, divs, spacing | MEDIUM |
| `widgets/design-system/ProminenceDemo.tsx` | ~30 | divs, spacing | MEDIUM |
| `widgets/design-system/ColorSwatch.tsx` | ~20 | divs | MEDIUM |
| `widgets/docs/MarkdownRenderer.tsx` | 34 | divs, spacing | MEDIUM |
| `widgets/docs/interactive/ComponentsShowcase.tsx` | ~25 | divs | MEDIUM |
| `widgets/showcase/AtomsShowcasePage.tsx` | ~20 | divs, spacing | MEDIUM |

### PAGE App (6 files)

| File | Violations | Type | Priority |
|------|-----------|------|----------|
| `widgets/examples/ApplicationExample.tsx` | 83 | flex, divs, spacing | HIGH (Intentional) |
| `widgets/examples/PaperExample.tsx` | 65 | flex, divs | HIGH (Intentional) |
| `widgets/examples/DocumentExample.tsx` | 42 | divs, spacing | MEDIUM (Intentional) |
| `widgets/examples/ImmersiveExample.tsx` | 52 | divs, flex | MEDIUM (Intentional) |
| `widgets/examples/FocusExample.tsx` | ~30 | divs | MEDIUM (Intentional) |
| `widgets/examples/OverlayExample.tsx` | 31 | divs, flex | MEDIUM (Intentional) |

### JSON App (6 files)

| File | Violations | Type | Priority |
|------|-----------|------|----------|
| `pages/json/JSONPage.tsx` | ~40 | divs, spacing | MEDIUM |
| `pages/server-products-dsl/ServerProductsViewDSL.tsx` | ~20 | divs | MEDIUM |
| `widgets/database/views/TableView.tsx` | ~50 | grid, flex, table | HIGH |
| `widgets/json-viewer/FormView.tsx` | ~30 | divs, forms | MEDIUM |
| `widgets/json-viewer/JsonSchemaSidebar.tsx` | ~35 | flex, divs | MEDIUM |
| `widgets/json-viewer/JsonSchemaSidebarDSL.tsx` | ~25 | divs | MEDIUM |

### EMOJI App (3 files)

| File | Violations | Type | Priority |
|------|-----------|------|----------|
| `pages/emoji-designer/EmojiDesignerPage.tsx` | 80+ | divs, forms, inline styles | CRITICAL |
| `widgets/emoji-designer/EmojiCanvas.tsx` | ~30 | inline styles, grid | MEDIUM |
| `widgets/emoji-designer/ColorPalette.tsx` | ~20 | flex, divs | MEDIUM |

### Other Apps

| File | Violations | Type | Priority |
|------|-----------|------|----------|
| `ADAPTIVE/pages/AdaptiveScaleDemoPage.tsx` | 100 | divs, flex, inline styles | CRITICAL |
| `SHOWCASE/pages/TokenEngineShowcase.tsx` | ~20 | className | MEDIUM |
| `SHOWCASE/pages/SectionTypeShowcase.tsx` | 27 | className | MEDIUM |
| `SECTION/pages/section/SectionShowcasePage.tsx` | ~15 | className | MEDIUM |
| `PPT/widgets/presentation/SlidePreview.tsx` | ~30 | className | MEDIUM |
| `BEHAVIOR/pages/BehaviorShowcasePage.tsx` | ~20 | className | MEDIUM |

---

## Violation Severity Classification

### Level 1: Critical (Anti-pattern Violations)
**Immediate fix required**

- Using raw `<div>` for layout structure instead of `<Block>`
- Using native `<input>` for forms instead of `<Field>`
- Hardcoded spacing with `p-`, `m-`, `gap-` instead of Block props
- Multiple flex/grid utilities mixed in single className

**Affected files**: 12-15 files  
**Examples**: TokensView.tsx, DebugView.tsx, EmojiDesignerPage.tsx, AdaptiveScaleDemoPage.tsx

### Level 2: High (Code Quality Issues)
**Should fix in next iteration**

- Inline styles instead of design tokens
- Mixed IDDL + raw HTML patterns
- Hardcoded values (widths, heights, spacing)

**Affected files**: 20-25 files  
**Examples**: Most sidebar views, JSON viewers, DOCS widgets

### Level 3: Medium (Acceptable)
**Can be deferred or intentional**

- Showcase/example files (intentionally demonstrating patterns)
- DOCS comparison examples (showing what NOT to do)
- Canvas/special renderers (custom pixel grids, markdown rendering)

**Affected files**: 15-20 files  
**Examples**: PAGE examples, BLOCK examples, DOCS guides

---

## Root Causes

### 1. Incomplete DSL Evolution
- Block component still lacking comprehensive layout props
- No standardized way to express all layout patterns in IDDL
- Some complex layouts (grid-based dashboards) need `layout="grid"` prop

### 2. Sidebar Views Architecture
- IDE sidebar views inherited from older codebase
- Each view (TokensView, DebugView, etc.) uses raw HTML for content
- Should create reusable IDDL patterns for sidebar content

### 3. Development/Demo Files
- Example pages intentionally show raw HTML for educational purposes
- DOCS widgets mix IDDL concepts with raw examples
- Adaptive demo is purely raw for demonstration

### 4. Special Cases
- Emoji designer needs custom pixel grid (harder to IDDL-ify)
- JSON table views need complex data rendering
- Markdown viewer needs special rendering logic

---

## Recommended Cleanup Strategy

### Phase 1: High-Impact Production Fixes (Week 1-2)
Priority: IDE app (production UI)

1. **TokensView.tsx**
   - Extract ColorSwatch to IDDL Block
   - Replace grid + gap with Block grid layout
   - Move headings to Text components

2. **DebugView.tsx**
   - Convert toolbar area to Block role="Toolbar"
   - Replace flex containers with appropriate Block roles
   - Use proper Text + Field components

3. **SettingsView.tsx**, **SourceControlView.tsx**
   - Similar patterns to DebugView
   - Batch migration possible

### Phase 2: Complex Cases (Week 2-3)
Priority: JSON, EMOJI apps

4. **EmojiDesignerPage.tsx**
   - Header: Block role="Toolbar"
   - Left sidebar: Block role="Navigator" with Form
   - Canvas: Keep inline styles (acceptable for custom rendering)
   - Right sidebar: Block role="Aside"

5. **JSON database views**
   - Create IDDL Table component if needed
   - Or wrap existing tables with Block roles

### Phase 3: Demo/Example Files (Week 3+)
Lower priority, can be deferred

6. **PAGE example files** - Could keep as-is (educational)
7. **DOCS comparison files** - Add IDDL versions alongside raw examples
8. **ADAPTIVE demo** - Migrate to showcase IDDL capabilities

---

## Metrics to Track

### Before Cleanup
- Files with className violations: **54**
- Total className instances: **500+**
- Raw HTML element count: **200+**
- Hardcoded spacing instances: **150+**

### Target (After Cleanup)
- Files with className violations: **<10** (special cases only)
- Total className instances: **<100** (utilities only)
- Raw HTML elements: **<30** (canvas, special renders)
- Hardcoded spacing instances: **0** (use Block props)

---

## Implementation Notes

### No Barrel Exports Rule Compliance
All imports must be direct:
```tsx
// WRONG
import { Block } from '@/components/dsl/Block';

// CORRECT
import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';
```

### IDDL Component References
- Block: `/src/components/dsl/Block/Block.tsx`
- Section: `/src/components/dsl/Section/Section.tsx`
- Action: `/src/components/dsl/Element/Action/Action.tsx`
- Text: `/src/components/dsl/Element/Text/Text.tsx`
- Field: `/src/components/dsl/Element/Field/Field.tsx`
- Page: `/src/components/dsl/Page/Page.tsx`

### Design Tokens
- Color tokens: `src/shared/config/tokens.ts`
- Spacing tokens: Check adaptive-scale-tokens.ts
- Typography: Type scale tokens in config
