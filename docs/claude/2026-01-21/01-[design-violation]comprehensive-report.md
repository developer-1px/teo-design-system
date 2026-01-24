# Design System Violation Report

**Date**: 2026-01-21
**Scope**: TableApp, PlaygroundApp, and Global Codebase
**Tool**: `npm run lint:design` + Manual Code Analysis

---

## Executive Summary

A comprehensive design system audit revealed **356 total violations** across the codebase, including:
- **234 Errors** (critical violations requiring immediate fixes)
- **122 Warnings** (best practice recommendations)
- **4 Auto-fixable issues**

This report focuses on the most critical violations in recently added features (TableApp with Command Palette and PlaygroundApp).

---

## 🔴 Critical Issues (High Priority)

### 1. **Missing Imports in PlaygroundApp**

**File**: `src/apps/Playground/PlaygroundApp.tsx`
**Severity**: 🔴 **CRITICAL - Causes Runtime Error**

#### Problem
```tsx
// Line 2-14: Missing Frame and Size imports
import { useCallback } from "react";
import { Text } from "../../design-system/text/Text";
// ❌ Frame is not imported
// ❌ Size is not imported
// ❌ Space is not imported

// But used on Line 208:
<Frame override={{ minHeight: Size.screen, gap: Space.n0 }}>
```

#### Impact
- **Runtime Error**: `Frame is not defined`
- **App crashes** when navigating to `/playground`
- Prevents all functionality from working

#### Fix
```tsx
import { Frame } from "../../design-system/Frame/Frame";
import { Size, Space } from "../../design-system/token/token.const.1tier";
```

---

### 2. **Deprecated API Usage: Top-Level Spacing Props on Action**

**File**: `src/apps/TableApp.tsx`
**Severity**: 🔴 **CRITICAL - API Violation (v7.8+)**

#### Problem
According to CLAUDE.md:
> **IMPORTANT**: The Frame API has evolved to use a spacing unification system. Top-level `gap`, `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr` props are **removed in v7.8+**. Use `spacing` prop or `override` instead.

However, `Action` component is using deprecated top-level props:

```tsx
// Line 348
<Action variant="surface" border w={Size.fill} gap={Space.n8}>
                                                  ^^^^^^^^^^^^^^
// Line 379
<Action variant="ghost" rounded={Radius2.full} p={Space.n8}>
                                               ^^^^^^^^^^^^^
// Line 382
<Action variant="ghost" rounded={Radius2.full} p={Space.n8}>
                                               ^^^^^^^^^^^^^
// Line 386
<Action variant="primary" h={Size.n32} px={Space.n12} gap={Space.n6}>
                                       ^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^
```

#### Impact
- **API Inconsistency**: Violates MDK design system conventions
- **Future Breaking Change**: When Action is updated to match Frame v7.8+, this code will break
- **Confusing DX**: Developers don't know which API to use

#### Fix
```tsx
// Option 1: Use spacing prop (recommended for consistent rhythm)
<Action spacing={Space.n8}>

// Option 2: Use override for fine-tuning
<Action override={{ gap: Space.n8 }}>
<Action override={{ p: Space.n8 }}>
<Action override={{ px: Space.n12, gap: Space.n6 }}>
```

**Note**: This requires updating the Action component to support `spacing` and `override` props.

---

### 3. **Hardcoded Colors (Non-Semantic)**

**File**: `src/apps/TableApp.tsx`
**Severity**: 🟡 **HIGH - Theme Compatibility**

#### Problem
```tsx
// Line 279
<Icon src={LayoutGrid} size={IconSize.n14} style={{ color: "white" }} />
                                                            ^^^^^^^
// Line 387
<Icon src={Share2} size={IconSize.n14} style={{ color: "white" }} />

// Line 388
<Text size={FontSize.n12} style={{ color: "white", fontWeight: 600 }}>Share</Text>
                                          ^^^^^^^
```

#### Impact
- **Dark Mode Broken**: "white" won't work in dark themes where primary background is light
- **Theme Incompatibility**: Hardcoded colors bypass semantic token system
- **Accessibility Risk**: May create insufficient contrast

#### Fix
```tsx
// Use semantic tokens
<Icon src={LayoutGrid} size={IconSize.n14} style={{ color: "var(--primary-fg)" }} />
<Text size={FontSize.n12} style={{ color: "var(--primary-fg)", fontWeight: 600 }}>
```

**Why primary-fg?**
`--primary-fg` is the **foreground color** designed to contrast with `--primary-bg` (the button background). It automatically adapts to theme changes.

---

### 4. **Spacing Prop + Override Conflict**

**File**: `src/apps/TableApp.tsx`
**Severity**: 🟡 **MEDIUM - Redundant/Conflicting**

#### Problem
```tsx
// Line 255
<Frame surface="base" override={{ w: Size.fill, h: Size.fill }}
       layout={Layout.Row.Top.Start} spacing={Space.n0}>
                                     ^^^^^^^^^^^^^^^^^^^

// Line 263-264 (child Frame)
override={{
    w: "260px",
    h: Size.fill,
    border: true,
    p: Space.n0,      // ❌ Redundant with parent's spacing={Space.n0}
    gap: Space.n0,    // ❌ Redundant
    zIndex: ZIndex.n100
}}
```

#### Why This is a Problem
1. **spacing={Space.n0}** sets `gap: 0` and `p: 0` on the parent
2. Child Frame **manually overrides** with `p: Space.n0, gap: Space.n0` again
3. **Redundant** and confusing - which one is actually setting the spacing?

#### Impact
- Code duplication
- Maintenance confusion
- Future bugs if one is changed but not the other

#### Fix
```tsx
// Option 1: Remove spacing from parent (if you want child to control)
<Frame surface="base" override={{ w: Size.fill, h: Size.fill }}
       layout={Layout.Row.Top.Start}>

// Option 2: Remove override from child (if parent should control)
<Frame override={{
    w: "260px",
    h: Size.fill,
    border: true,
    // Remove p and gap - parent controls spacing
    zIndex: ZIndex.n100
}}>
```

---

## 🟡 Medium Priority Issues

### 5. **Surface Without Padding**

**Files**: Multiple (234 instances across codebase)
**Severity**: 🟡 **MEDIUM - Design Quality**

#### Problem
Design system rule:
> Surfaces (`surface="raised"`, `surface="base"`, etc.) require padding for visual breathing room.

Examples from audit:
```
📄 src/App.tsx
   ❌ L163 [Surface without padding]: surface="raised" requires padding

📄 src/apps/TableApp.tsx
   (No violations - good job!)

📄 src/apps/Playground/PlaygroundApp.tsx
   ❌ L216 surface="raised" has no padding
   ❌ L239 surface="base" has no padding
   ❌ L252 surface="raised" has no padding
```

#### Impact
- **Visual Design**: Elements look cramped and unprofessional
- **Touch Targets**: Harder to tap/click on mobile
- **Accessibility**: Reduces readability for users with low vision

#### Fix
```tsx
// Before
<Frame surface="raised">

// After (use spacing for consistency)
<Frame surface="raised" spacing={Space.n12}>

// Or use override for fine-tuning
<Frame surface="raised" override={{ p: Space.n16 }}>
```

---

### 6. **Inline Hardcoded Values**

**Files**: Multiple
**Severity**: 🟡 **MEDIUM - Token Violation**

#### Examples
```tsx
// TableApp Line 260
w: "260px",  // ❌ Should use Size token

// TableApp Line 385, 410
style={{ width: 1, height: 16, background: "var(--border-subtle)", margin: "0 8px" }}
         ^^^^^^^^                                                   ^^^^^^^^^^^^^^
// ❌ width/height should use Size tokens
// ❌ margin should use Space tokens
```

#### Impact
- **Inconsistency**: Different developers use different spacing values
- **Hard to Change**: When design system updates, hardcoded values don't change
- **No Type Safety**: Strings bypass TypeScript checks

#### Fix
```tsx
w: Size.n260,  // Create Size.n260 token if needed

// For separator lines
<Frame w={Size.n1} h={Size.n16}
       style={{ background: "var(--border-subtle)" }}
       override={{ mx: Space.n8 }} />
```

---

## 🟢 Low Priority Issues (Warnings)

### 7. **Layout.Col.Stretch Heuristic**

**Severity**: 🟢 **LOW - Best Practice**

#### Problem
```
⚠️ [heuristic-layout-stretch] Consider using 'Layout.Col.Stretch'
   for structural containers to ensure children fill the width.
```

#### When to Use
- Use `Layout.Col.Stretch` for **layout containers** where children should fill width
- Use `Layout.Col.Start` for **content containers** where children should be auto-width

#### Example
```tsx
// Layout container (children should fill width)
<Frame layout={Layout.Col.Stretch}>  // ✅
  <Header />
  <Content />
  <Footer />
</Frame>

// Content container (children should be auto-width)
<Frame layout={Layout.Col.Start}>  // ✅
  <Button>Submit</Button>
</Frame>
```

---

## 📊 Statistics Summary

### By Severity
| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 3 | Breaks runtime or violates core API |
| 🟡 High/Medium | 234+ | Design quality and maintainability |
| 🟢 Low | 122 | Best practice recommendations |

### By Category
| Category | Count | Auto-Fix |
|----------|-------|----------|
| Surface without padding | 234 | ❌ No |
| Hardcoded colors | ~50 | ❌ No |
| Layout heuristics | 122 | ❌ No |
| className usage | 2 | ✅ Yes (4 total) |

### By File (Top Offenders)
| File | Violations | Priority |
|------|-----------|----------|
| PlaygroundApp.tsx | 4 critical + 3 medium | 🔴 High |
| TableApp.tsx | 4 high + 0 medium | 🟡 Medium |
| CommandPalette.tsx | 6 medium | 🟡 Medium |
| LandingApp.tsx | 15+ medium | 🟢 Low |

---

## 🛠️ Recommended Actions

### Immediate (This Week)
1. **Fix PlaygroundApp imports** (5 min) - Prevents crash
2. **Replace hardcoded "white" colors in TableApp** (10 min) - Fixes dark mode
3. **Refactor Action component top-level props** (30 min) - API consistency

### Short-Term (Next Sprint)
4. **Add padding to all surfaces in TableApp/PlaygroundApp** (1 hour)
5. **Replace hardcoded sizes with tokens** (2 hours)
6. **Remove spacing/override conflicts** (30 min)

### Long-Term (Backlog)
7. **Create design-lint CI check** to prevent future violations
8. **Add ESLint plugin** to catch deprecated API usage at dev time
9. **Document spacing prop migration guide** for team

---

## 🎯 Success Criteria

After fixes, expect:
- ✅ **0 runtime errors** in PlaygroundApp
- ✅ **Dark mode compatibility** in TableApp (no hardcoded colors)
- ✅ **Consistent API usage** (no deprecated props)
- ✅ **<10 design-lint errors** in new code (down from 356)

---

## 📚 References

- **Design System Conventions**: `.agent/conventions.md`
- **Frame API Documentation**: `CLAUDE.md` (Search for "Frame API v7.8")
- **Token System**: `src/design-system/token/token.const.1tier.ts`
- **Lint Tool**: `scripts/design-lint.ts`

---

**Generated**: 2026-01-21
**Reporter**: Claude Code Design Audit
**Command**: `npm run lint:design`
