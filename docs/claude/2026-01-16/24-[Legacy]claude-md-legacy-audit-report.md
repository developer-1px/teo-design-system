# CLAUDE.md Legacy Audit Report

**Date**: 2026-01-16
**Task**: Review CLAUDE.md for legacy concepts and inconsistencies with actual codebase
**Status**: Completed

## Executive Summary

CLAUDE.md contained several legacy concepts that no longer match the current implementation. This report documents:
1. Legacy concepts removed from CLAUDE.md
2. Deprecated code still present in the codebase
3. Migration recommendations

---

## 1. Legacy Concepts Removed from CLAUDE.md

### 1.1 ProseDocument & ProseSection Components

**Status**: ❌ **Removed from documentation (never implemented)**

**CLAUDE.md Previously Stated**:
```tsx
- `ProseDocument` - Document container with max-width and centered layout
- `ProseSection` - Full-width section with ProseDocument inside
```

**Reality**: These components do not exist in the codebase. No files found matching these names.

**Impact**: Low - Documentation-only issue, no code cleanup needed.

---

### 1.2 Field Scrubbing Feature

**Status**: ❌ **Removed from documentation (not implemented)**

**CLAUDE.md Previously Stated**:
> **Note:** Fields with labels support **scrubbing** - drag horizontally on the label to increment/decrement numeric values.

**Reality**:
- `Field.tsx` contains no scrubbing logic
- No event handlers for drag-based value manipulation
- Field is a simple input wrapper with icon support

**Impact**: Low - Documentation-only issue.

---

### 1.3 toToken() Utility Function

**Status**: ❌ **Removed from documentation (not used)**

**CLAUDE.md Previously Stated**:
```typescript
toToken(2, "space")      // → "var(--space-2)"
toToken("md", "radius")  // → "var(--radius-md)"
toToken("12px", "space") // → "12px" (passes through)
```

**Reality**:
- Function does not exist in codebase
- `grep -r "toToken"` returns 0 results
- Token system now uses explicit constants (`Space.n16`, `Size.n240`, etc.)

**Impact**: Medium - This was a core documentation feature. Updated to reflect branded type system.

---

### 1.4 Frame Component Legacy Props

**Status**: ⚠️ **Documented as deprecated (but still in code)**

**CLAUDE.md Previously Stated**:
```tsx
<Frame
  gap={2}         // Gap using space tokens
  flex            // Flex: 1
  fill            // Width/height: 100%
  grid            // Display: grid
  // ... etc
/>
```

**Reality**:
```typescript
// Frame.tsx lines 23-26
gap, // @deprecated
grid, // @deprecated
fill,// @deprecated
flex,// @deprecated
```

**Current Recommended API**:
```tsx
<Frame
  layout={Layout.Stack.Content.Default}  // 2-Tier semantic preset
  override={{
    gap: Space.n12,
    p: Space.n16,
    row: true,
    align: "center"
  }}
/>
```

**Impact**: **HIGH** - See Section 2 for active usage in codebase.

---

### 1.5 Token System Naming

**Status**: ✅ **Updated to reflect current implementation**

**CLAUDE.md Previously Stated**:
```typescript
- `--space-0` (0px) through `--space-16` (128px)
- Common: `--space-1` (4px), `--space-2` (8px), `--space-4` (16px)
```

**Current Reality**:
```typescript
- `--space-n0` (0px) through `--space-n160` (160px)
- Common: `--space-n4` (4px), `--space-n8` (8px), `--space-n16` (16px)
- Used via: Space.n4, Space.n8, Space.n16
```

**Impact**: Medium - Critical for AI understanding. Now documented correctly.

---

### 1.6 Action Component Size Prop

**Status**: ✅ **Updated to reflect T-shirt sizing**

**CLAUDE.md Previously Stated**:
```tsx
<Action size={32} />  // Square size shortcut
```

**Current Reality**:
```tsx
<Action size="sm" />  // T-shirt sizes: "sm" (32px), "md" (40px), "lg" (48px)
```

**Impact**: Medium - Type safety issue. Now documented correctly.

---

### 1.7 Prose Component Access Pattern

**Status**: ✅ **Updated to reflect Text namespace convention**

**CLAUDE.md Previously Stated**:
```tsx
<Prose.Title variant="xl">Main Heading</Prose.Title>
<Prose.Body>Paragraph</Prose.Body>
```

**Current Reality** (per `.agent/conventions.md`):
```tsx
import { Text } from "../design-system/text/Text";

<Text.Prose.Title variant="xl">Main Heading</Text.Prose.Title>
<Text.Prose.Body>Paragraph</Text.Prose.Body>
```

**Impact**: High - Incorrect usage would cause runtime errors.

---

## 2. Deprecated Code Found in Codebase

### 2.1 Frame Legacy Props Usage

**Status**: ⚠️ **Active usage of deprecated props**

**Deprecated Props**: `gap`, `flex`, `fill`, `grid`

**Files Using Deprecated Props**: 10 files found

```
/Users/user/Desktop/minimal-design-kit/src/apps/LoginApp.tsx
/Users/user/Desktop/minimal-design-kit/src/apps/cms/FeatureGridSection.tsx
/Users/user/Desktop/minimal-design-kit/src/apps/TextSystemApp.tsx
/Users/user/Desktop/minimal-design-kit/src/apps/TokensApp.tsx
/Users/user/Desktop/minimal-design-kit/src/apps/crm/drawer/ExpandableValue.tsx
/Users/user/Desktop/minimal-design-kit/src/apps/crm/drawer/JsonTable.tsx
/Users/user/Desktop/minimal-design-kit/src/apps/crm/drawer/JsonTree.tsx
/Users/user/Desktop/minimal-design-kit/src/apps/crm/drawer/JsonPropertyGrid.tsx
/Users/user/Desktop/minimal-design-kit/src/apps/SurfaceApp.tsx
/Users/user/Desktop/minimal-design-kit/src/apps/LandingApp.tsx
```

**Example from Code**:
```tsx
// LoginApp.tsx - NEEDS MIGRATION
<Frame gap={4} flex>  // ❌ Deprecated props
  {/* content */}
</Frame>

// Should be:
<Frame
  layout={Layout.Stack.Content.Default}  // ✅ Semantic preset
  override={{ gap: Space.n16, flex: true }}  // ✅ or explicit override
>
```

**Recommendation**: These files need refactoring to use the 2-Tier system.

---

## 3. Migration Guide

### 3.1 Frame Component Migration

**Old Pattern** (Deprecated):
```tsx
<Frame
  gap={4}
  flex
  p={3}
  row
>
  {children}
</Frame>
```

**New Pattern** (2-Tier):

**Option A: Use Semantic Layout Preset**
```tsx
<Frame layout={Layout.Row.Toolbar.Default}>
  {children}
</Frame>
```

**Option B: Use Override for Custom Tokens**
```tsx
<Frame
  override={{
    gap: Space.n16,
    p: Space.n12,
    flex: true,
    row: true
  }}
>
  {children}
</Frame>
```

**Option C: Hybrid (Preset + Override)**
```tsx
<Frame
  layout={Layout.Stack.Content.Default}
  override={{ gap: Space.n20 }}  // Override just the gap
>
  {children}
</Frame>
```

---

### 3.2 Token Usage Migration

**Old Pattern** (Deprecated):
```tsx
// Numeric shorthand
<Frame gap={2} p={4} w={60} />
```

**New Pattern** (Explicit Constants):
```tsx
import { Space, Size } from "./design-system/token/token.const.1tier";

<Frame
  w={Size.n240}
  override={{
    gap: Space.n8,
    p: Space.n16
  }}
/>
```

---

### 3.3 Action Size Migration

**Old Pattern**:
```tsx
<Action size={32} iconSize={16} />
```

**New Pattern**:
```tsx
import { IconSize } from "./design-system/token/token.const.1tier";

<Action size="sm" iconSize={IconSize.n16} />
```

---

### 3.4 Text/Prose Migration

**Old Pattern**:
```tsx
import { Prose } from "./design-system/Prose";

<Prose.Title>Heading</Prose.Title>
```

**New Pattern**:
```tsx
import { Text } from "./design-system/text/Text";

<Text.Prose.Title>Heading</Text.Prose.Title>
```

---

## 4. Breaking Changes Summary

| Change | Severity | Migration Effort |
|--------|----------|------------------|
| Frame props deprecated | High | Medium (10 files) |
| Token naming convention | Medium | Low (types enforce) |
| Action size prop type | Medium | Low (types enforce) |
| Prose access pattern | High | Low (find & replace) |
| toToken() removal | Low | None (never used) |

---

## 5. Recommendations

### Immediate Actions:
1. ✅ **COMPLETED**: Update CLAUDE.md to reflect current API
2. ⚠️ **TODO**: Refactor 10 files using deprecated Frame props
3. ⚠️ **TODO**: Add ESLint rule to warn on deprecated prop usage
4. ⚠️ **TODO**: Update TypeScript types to mark deprecated props with `@deprecated` JSDoc

### Future Considerations:
1. Consider removing deprecated props entirely in next major version
2. Create codemod script for automatic migration
3. Add migration guide to project documentation
4. Consider adding runtime warnings for deprecated prop usage in development mode

---

## 6. Conclusion

CLAUDE.md has been successfully updated to reflect the current implementation. The primary concern is **10 files still using deprecated Frame props** that need migration to the 2-Tier system.

**Priority**: Medium-High
**Risk**: Low (deprecated props still work, but discouraged)
**Effort**: ~2-3 hours to refactor all 10 files

---

## Appendix A: Files Requiring Migration

### High Priority (Core Components)
- `src/apps/LoginApp.tsx` - Main auth interface
- `src/apps/LandingApp.tsx` - Landing page
- `src/apps/TextSystemApp.tsx` - Design system showcase

### Medium Priority (CRM Drawer Components)
- `src/apps/crm/drawer/ExpandableValue.tsx`
- `src/apps/crm/drawer/JsonTable.tsx`
- `src/apps/crm/drawer/JsonTree.tsx`
- `src/apps/crm/drawer/JsonPropertyGrid.tsx`

### Low Priority (Other)
- `src/apps/cms/FeatureGridSection.tsx`
- `src/apps/TokensApp.tsx`
- `src/apps/SurfaceApp.tsx`

---

## Appendix B: CLAUDE.md Changelog

### Added:
- 2-Tier layout system explanation
- Branded type system documentation
- Explicit token constant usage patterns
- Discord app route
- Layout preset examples

### Updated:
- Frame component API documentation
- Token naming convention (n-prefix format)
- Action size prop (T-shirt sizes)
- Text.Prose access pattern
- Token quick reference

### Removed:
- ProseDocument/ProseSection (never existed)
- Field scrubbing feature (not implemented)
- toToken() utility (not used)
- Incorrect token scale documentation
- Legacy shorthand prop examples

---

**Report Generated**: 2026-01-16
**Audited By**: Claude Code Assistant
**Status**: Ready for Review
