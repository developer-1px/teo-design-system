# Legacy Transition Report

## Executive Summary

The minimal-design-kit codebase is in a **transition phase** between multiple system generations. This report identifies legacy patterns, inconsistencies, and migration needs across the design system.

**Analysis Date**: 2026-01-14
**Total Files Analyzed**: 40+ components and apps
**Critical Findings**: 7 major legacy systems
**Migration Status**: ~40% complete

---

## 1. Legacy Text System (Critical)

### Current State: Dual Text Systems Coexisting

#### Legacy System: `Text.tsx` (Direct variant prop)
**Location**: `src/design-system/text/Text.tsx`

```tsx
// OLD API (still in use in 3 apps)
<Text variant="heading-lg">Title</Text>
<Text variant="body-md">Body</Text>
<Text variant="code">Code</Text>
```

**Usage Count**:
- IDEApp.tsx: Uses legacy Text variant API
- CRMApp.tsx: Uses legacy Text variant API
- ChatApp.tsx: Uses legacy Text variant API

**Problems**:
1. ❌ No semantic context (Application vs Document vs Landing)
2. ❌ Flat hierarchy - AI cannot reason about usage
3. ❌ Generic "body-md" doesn't indicate content type
4. ❌ Mixes with new Context-based system

---

#### Modern System: `Text.{Context}.{Slot}` (Partially adopted)

```tsx
// NEW API (used in 73 locations)
<Text.Prose.Title variant="xl">Title</Text.Prose.Title>
<Text.Card.Title>Card Title</Text.Card.Title>
<Text.Field.Label>Label</Text.Field.Label>
```

**Adoption Status**:
- ✅ LandingApp: Fully migrated to new system
- ✅ SlideApp: Fully migrated to new system
- ✅ TextSystemApp: Fully migrated (demo app)
- ⚠️ IDEApp: Mixed usage (legacy Text + new Text.*)
- ⚠️ CRMApp: Mixed usage
- ⚠️ ChatApp: Mixed usage
- ⚠️ LoginApp: Mixed usage (uses ProseOld + new Text)

**Migration Path**:
```tsx
// Before
<Text variant="heading-lg" color="primary">

// After
<Text.Prose.Title variant="lg">
// or
<Text.Card.Title>
```

**Recommendation**:
- 🔴 **URGENT**: Remove legacy `TextRoot` direct usage from apps
- 🔴 Deprecate `variant="body-md"` pattern in favor of Context-based API
- ✅ Keep `TextRoot` internal for Context implementations only

---

## 2. ProseOld.tsx (Deprecated Component)

### Status: Legacy File Still in Use

**Location**: `src/design-system/ProseOld.tsx`
**File Status**: Marked as "Old" but not deleted

#### Current Usage

```bash
# Files importing ProseOld:
- src/apps/LoginApp.tsx (ProseOld, ProseDocument)
- src/apps/TokensApp.tsx (ProseSection, ProseDocument)
```

#### Problems

1. ❌ **Naming Confusion**: `ProseOld` vs `Text.Prose` - which to use?
2. ❌ **API Mismatch**: Uses `role="h1"` prop instead of `Text.Prose.Title variant="xl"`
3. ❌ **Duplicate Functionality**: `ProseDocument` exists in both old and new systems
4. ❌ **Inconsistent Imports**: Some apps import old, some import new

#### Old API

```tsx
// ProseOld API (deprecated)
<ProseOld role="h1" align="center" color="primary">
  Title
</ProseOld>

<ProseDocument maxWidth={680} gap={4}>
  <ProseOld role="body">Content</ProseOld>
</ProseDocument>
```

#### New API Equivalent

```tsx
// Text.Prose API (current)
<Text.Prose.Title variant="xl" style={{ textAlign: "center" }}>
  Title
</Text.Prose.Title>

// Note: ProseDocument doesn't exist in new system yet!
// Should use Frame with Layout preset
<Frame layout={Layout.Stack.Content.Default} override={{ maxWidth: 680 }}>
  <Text.Prose.Body>Content</Text.Prose.Body>
</Frame>
```

**Recommendation**:
- 🔴 **DELETE**: `ProseOld.tsx` after migrating LoginApp and TokensApp
- 🟡 **DECIDE**: Keep `ProseDocument` as utility or enforce Frame usage?
- 🟡 **MIGRATE**: Convert all `ProseOld role="x"` to `Text.Prose.*` components

---

## 3. Frame Layout System (Incomplete Migration)

### Status: Mandatory Layout Prop Not Enforced

**Analysis**: `layout` prop is defined as **mandatory** in `FrameProps`, but 293 Frame usages don't have it.

```typescript
// src/design-system/lib/props.ts (line 137)
export interface FrameProps {
  layout: import("../Layout").LayoutToken;  // MANDATORY
}
```

#### Current Reality

```bash
# Frame usage statistics:
- Total <Frame> usages: ~500+
- With layout= prop: ~207
- WITHOUT layout= prop: 293  ❌ Type violation
```

#### Problem Examples

**LoginApp.tsx** (Line 29):
```tsx
// ❌ Missing mandatory layout prop
<Text size={FontSize.n8} weight="bold">
  Welcome back
</Text>
```

**LandingApp.tsx**:
```tsx
// ❌ Still uses inline gap without layout
<Action variant="primary" rounded="full" p="3 5" gap={2}>
```

**CRMApp.tsx**:
```tsx
// ❌ Empty gap without layout context
gap={0}
```

#### Why This Happened

The `layout` prop was added as mandatory **after** many apps were already written with the old prop-based API:

```tsx
// OLD API (pre-Layout system)
<Frame row gap={3} p={4} align="center">

// NEW API (Layout system)
<Frame layout={Layout.Row.Item.Default}>
```

**Current Type System Issue**: TypeScript is not enforcing `layout` prop requirement due to `override` escape hatch.

**Recommendation**:
- 🔴 **ENFORCE**: Make TypeScript strictly require `layout` prop
- 🔴 **MIGRATE**: All 293 Frames without layout must use `Layout.Base.Default` minimum
- 🟡 **TOOLING**: Create ESLint rule or codemod to detect missing layout

---

## 4. Inline Styles Proliferation

### Status: 152 Inline Style Objects Across Apps

**Problem**: Direct `style={{}}` prop usage undermines token system.

```bash
# Inline style usage count: 152
```

#### Examples

**LoginApp.tsx**:
```tsx
// ❌ Inline border instead of token
style={{ border: "1px solid var(--border-color)" }}
```

**CRMApp.tsx**:
```tsx
// ❌ Inline transform instead of layout
style={{ width: 600, boxShadow: "var(--shadow-lg)" }}
```

**SlideApp.tsx**:
```tsx
// ❌ Magic numbers
style={{ height: "44px" }}  // Should be Size.n44
```

#### Override Prop Usage: 369 instances

While `override` is the intended escape hatch, 369 usages indicate:
1. Layout presets may be insufficient
2. Developers bypass system constraints
3. Token coverage has gaps

**Recommendation**:
- 🟡 **AUDIT**: Review all 369 `override` usages - are they necessary?
- 🟡 **EXPAND**: Add missing Layout variants for common patterns
- 🟢 **ACCEPTABLE**: Some override usage is expected for one-offs

---

## 5. Direct Token Imports in Apps

### Status: 127 Direct Token Imports Break Abstraction

**Problem**: Apps directly import and use tokens instead of Layout/Text abstractions.

```bash
# Direct token imports: 127 instances
FontSize, IconSize, Size, Space being imported in apps
```

#### Examples

**LoginApp.tsx**:
```tsx
import { IconSize, Size, Space } from "../design-system/token/token.const.1tier";

// Direct token usage (bypasses Layout system)
<Frame override={{ w: Size.full, maxWidth: Size.n384, gap: 8 }}>
<Text size={FontSize.n8} weight="bold">
<Icon src={Mail} size={IconSize.n16} />
```

**Why This Is Bad**:
1. ❌ Apps know about token internals (should be opaque)
2. ❌ Cannot change token system without breaking apps
3. ❌ Defeats purpose of Layout/Text semantic abstractions
4. ❌ AI cannot reason about intent ("Size.n384" means what?)

**Should Be**:
```tsx
// Layout handles sizing
<Frame layout={Layout.Stack.Form.Center}>

// Text handles font sizing
<Text.Card.Title>Welcome back</Text.Card.Title>

// Icon defaults to appropriate size
<Icon src={Mail} />  // size handled by context
```

**Recommendation**:
- 🔴 **RESTRICT**: Token imports should only be in `src/design-system/` files
- 🔴 **REFACTOR**: Remove all token imports from `src/apps/`
- 🟡 **EXPOSE**: Create higher-level APIs if apps need custom sizing

---

## 6. Section Component (Deprecated?)

### Status: Unclear If Legacy or Current

**Location**: `src/design-system/Section.tsx`

#### Problems

1. **Duplicate Functionality**: Section overlaps with Frame + Layout
2. **Custom Border Logic**: Reimplements Frame border handling
3. **Mixed Abstraction Level**: Uses Layout internally but exposes Frame props

```tsx
// Section API
<Section title="Settings" icon={<Settings />} border="top">
  {children}
</Section>

// Could be Frame + Layout instead
<Frame layout={Layout.Stack.Section.Default}>
  <Frame layout={Layout.Row.Header.Default}>
    <Settings size={16} />
    <Text.Card.Note>SETTINGS</Text.Card.Note>
  </Frame>
  {children}
</Frame>
```

**Usage Count**: Limited usage in apps (mostly SlideApp, CMSApp)

**Recommendation**:
- 🟡 **EVALUATE**: Is Section necessary or just convenience wrapper?
- 🟡 **DECIDE**: Keep as high-level component or remove in favor of Layout patterns?

---

## 7. Divider vs Separator (Naming Confusion)

### Status: Two Components with Same Purpose

**Files**:
- `src/design-system/Divider.tsx`
- `src/design-system/Separator.tsx`

#### Divider Features
- Variants: line, dot, slash, spacer
- Orientation: horizontal, vertical
- Size control

#### Separator Features
- Simpler API
- Just line dividers
- Used in FloatingToolbar

**Problem**: Unclear which component to use when.

**Recommendation**:
- 🟡 **MERGE**: Consolidate into single component
- 🟡 **NAMING**: Pick one name - "Separator" is more generic

---

## 8. Icon Component Wrapper (Questionable Value)

### Status: Thin Wrapper Over Lucide

**Location**: `src/design-system/Icon.tsx`

```tsx
// Current API
<Icon src={Mail} size={IconSize.n16} />

// Could just be Lucide
<Mail size={16} />
```

**Analysis**:
- Adds token-based sizing (IconSize.n16)
- Enforces consistent strokeWidth
- Adds minWidth/minHeight for layout stability

**Pros**:
- ✅ Consistent sizing via tokens
- ✅ Prevents icon shrinkage in flex

**Cons**:
- ❌ Extra abstraction layer
- ❌ Lucide already has good API
- ❌ Apps import 127 IconSize tokens anyway (defeats purpose)

**Recommendation**:
- 🟢 **KEEP**: If token sizing is enforced system-wide
- 🟡 **REMOVE**: If apps can use Lucide directly with px values

---

## Migration Priority Matrix

| Issue | Impact | Effort | Priority | Deadline |
|-------|--------|--------|----------|----------|
| Legacy Text variant API | 🔴 High | Medium | P0 | Week 1 |
| ProseOld.tsx deletion | 🔴 High | Low | P0 | Week 1 |
| Frame layout enforcement | 🔴 High | High | P1 | Week 2-3 |
| Direct token imports | 🟡 Medium | High | P2 | Week 4 |
| Inline styles audit | 🟡 Medium | Medium | P2 | Week 4 |
| Section component decision | 🟢 Low | Low | P3 | Month 2 |
| Divider/Separator merge | 🟢 Low | Low | P3 | Month 2 |
| Icon wrapper evaluation | 🟢 Low | Low | P3 | Month 2 |

---

## Detailed Migration Checklist

### Phase 1: Critical Text System Cleanup (Week 1)

- [ ] **Migrate IDEApp.tsx** from `<Text variant=` to `<Text.{Context}.*>`
- [ ] **Migrate CRMApp.tsx** from legacy Text API to Context-based
- [ ] **Migrate ChatApp.tsx** from legacy Text API to Context-based
- [ ] **Migrate LoginApp.tsx** from `ProseOld` to `Text.Prose.*`
- [ ] **Migrate TokensApp.tsx** from `ProseOld` to `Text.Prose.*`
- [ ] **Delete** `ProseOld.tsx` file entirely
- [ ] **Update CLAUDE.md** to remove ProseOld references
- [ ] **Mark TextRoot** as internal-only (not for app usage)

### Phase 2: Layout System Enforcement (Week 2-3)

- [ ] **Audit all 293 Frames** without `layout` prop
- [ ] **Create ESLint rule**: Enforce layout prop on all Frames
- [ ] **Add TypeScript lint**: Strict mode for FrameProps.layout
- [ ] **Migrate high-traffic apps** first (SlideApp, CMSApp, CRMApp)
- [ ] **Document Layout patterns** for common cases
- [ ] **Create codemod** for automatic migration where possible

### Phase 3: Token Abstraction Restoration (Week 4)

- [ ] **Remove all token imports** from `src/apps/`
- [ ] **Expand Layout variants** to cover common sizing needs
- [ ] **Create Frame size presets** (if absolutely needed)
- [ ] **Update examples** to never show direct token usage
- [ ] **Add eslint rule**: Ban token imports outside design-system/

### Phase 4: Code Quality (Month 2)

- [ ] **Audit 152 inline styles**: Can they use Layout instead?
- [ ] **Review 369 override usages**: Are they necessary?
- [ ] **Decide on Section**: Keep or replace with Layout patterns?
- [ ] **Merge Divider/Separator**: Single component API
- [ ] **Evaluate Icon wrapper**: Simplify or enhance?

---

## Breaking Changes Required

### 1. Remove TextRoot Direct Usage

```diff
- import { Text } from "../design-system/text/Text.tsx"
- <Text variant="heading-lg">Title</Text>

+ import { Text } from "../design-system/text/Text.tsx"
+ <Text.Card.Title>Title</Text.Card.Title>
```

**Impact**: 3 apps need updates

### 2. Delete ProseOld.tsx

```diff
- import { ProseOld, ProseDocument } from "../design-system/ProseOld.tsx"
- <ProseOld role="h1">Title</ProseOld>

+ import { Text } from "../design-system/text/Text.tsx"
+ <Text.Prose.Title variant="xl">Title</Text.Prose.Title>
```

**Impact**: 2 apps need updates

### 3. Enforce Layout Prop

```diff
- <Frame row gap={3} p={4}>
+ <Frame layout={Layout.Row.Item.Default}>
```

**Impact**: 293 Frame usages need updates (high effort!)

### 4. Ban Token Imports in Apps

```diff
- import { Size, Space, FontSize } from "../design-system/token/..."
- <Frame override={{ w: Size.n384, gap: Space.n8 }}>

+ <Frame layout={Layout.Stack.Form.Center}>
```

**Impact**: 127 import statements need removal

---

## Success Metrics

**System Health**:
- ✅ Zero direct Text variant usage in apps
- ✅ Zero ProseOld imports
- ✅ 100% Frame components have layout prop
- ✅ Zero token imports in src/apps/
- ✅ <50 inline style objects (exceptional cases only)

**AI Reasoning**:
- ✅ All text uses semantic Context (Prose, Card, Field, Menu, Table)
- ✅ All layouts use semantic Layout presets
- ✅ Token layer is opaque to apps (implementation detail)

---

## Long-Term Vision

### Current State (40% Complete)
```
App Layer
├─ Direct token imports ❌
├─ Mixed Text APIs ❌
├─ Manual Frame props ❌
└─ Inline styles ❌

Design System Layer
├─ Layout System ✅
├─ Text Context System ✅
└─ Token System ✅
```

### Target State (100% Complete)
```
App Layer
├─ No token knowledge ✅
├─ Text.{Context}.{Slot} only ✅
├─ layout= on all Frames ✅
└─ Minimal inline styles ✅

Design System Layer
├─ Layout System ✅
├─ Text Context System ✅
├─ Token System ✅
└─ Opaque abstraction ✅
```

---

## Recommendations Summary

### Immediate Action (P0 - This Week)
1. 🔴 Migrate 3 apps off legacy Text variant API
2. 🔴 Delete ProseOld.tsx after migrating 2 dependent apps
3. 🔴 Create ESLint rule to prevent regression

### Short Term (P1 - Next 2 Weeks)
4. 🔴 Enforce layout prop on all Frames (293 migrations)
5. 🔴 Document migration patterns clearly

### Medium Term (P2 - This Month)
6. 🟡 Remove 127 direct token imports from apps
7. 🟡 Audit and reduce 152 inline styles

### Long Term (P3 - Next Month)
8. 🟢 Consolidate Divider/Separator
9. 🟢 Decide on Section component fate
10. 🟢 Simplify Icon wrapper if possible

---

## Conclusion

The codebase is **40% through** a major design system transition. The new **Layout + Text Context** system is architecturally superior and enables AI reasoning, but incomplete migration creates:

1. **Learning Curve**: Which API to use? (old vs new)
2. **Type Safety Issues**: Mandatory props not enforced
3. **Abstraction Leaks**: Apps know about tokens
4. **Maintenance Burden**: Two systems to support

**The good news**: The new system works well where adopted (LandingApp, SlideApp). The path forward is clear - complete the migration and remove legacy systems.

**Estimated Completion**: 4-6 weeks with focused effort.
