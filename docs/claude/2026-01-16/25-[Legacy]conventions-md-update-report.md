# conventions.md Legacy Update Report

**Date**: 2026-01-16
**Task**: Review and update .agent/conventions.md to reflect current implementation
**Status**: Completed

## Executive Summary

Updated `.agent/conventions.md` to remove legacy concepts and align with the current 2-Tier token system and branded type architecture. All outdated examples, deprecated APIs, and non-existent components have been removed or corrected.

---

## Changes Made

### 1. Section 0: THE GOLDEN RULE (Complete Rewrite)

**❌ REMOVED - Legacy Token Mapping**:
```tsx
// Old - Incorrect token mapping
p={4} results in 16px (from --space-4)
p={20} results in 160px (from --space-20)

Standard Scale:
- 1 = 4px
- 2 = 8px
- 4 = 16px
```

**✅ ADDED - Branded Type System**:
```tsx
// New - Explicit token constants
import { Space, Size, IconSize } from "../design-system/token/token.const.1tier";

// ✅ CORRECT
<Frame override={{ p: Space.n16, gap: Space.n12 }} w={Size.n240}>

// ❌ WRONG (TypeScript will error)
<Frame override={{ p: 16, gap: 12 }} w={240}>
```

**Rationale**:
- Old system implied numeric props mapped to tokens
- New system enforces explicit token constants via branded types
- Better AI guidance and type safety

---

### 2. Section 1: Import Order (Updated)

**ADDED - Token imports category**:
```tsx
4. Design system tokens  // NEW
5. Utilities and types
6. CSS imports

import { Space, Size, IconSize } from "../design-system/token/token.const.1tier";
import { Radius2 } from "../design-system/token/token.const.2tier";
```

**FIXED - Component import paths**:
```tsx
// Old (incorrect)
import { Frame } from "../design-system/Frame";

// New (correct)
import { Frame } from "../design-system/Frame/Frame";
import { Layout } from "../design-system/Frame/Layout/Layout";
import { Text } from "../design-system/text/Text";
```

---

### 3. Section 2: Token System Usage (Complete Rewrite)

**❌ REMOVED - Legacy shorthand examples**:
```tsx
p={2}, w={65}, gap={4}  // Old style
```

**✅ ADDED - Explicit token usage**:
```tsx
Space.n16, Size.n240, IconSize.n24  // New style
```

**ADDED - Frame API deprecation notice**:
```tsx
// ❌ DEPRECATED - Legacy shorthand props
<Frame gap={4} flex p={3} grid>  // DO NOT USE

// ✅ RECOMMENDED - Use layout presets
<Frame layout={Layout.Stack.Content.Default}>

// ✅ ALTERNATIVE - Use override for custom tokens
<Frame override={{ gap: Space.n12, p: Space.n16 }}>
```

**ADDED - Token Categories Table**:
- Spacing (`Space.*`) → `var(--space-n{value})`
- Sizing (`Size.*`) → `var(--size-n{value})`
- Icon Size (`IconSize.*`) → `var(--icon-size-n{value})`
- Font Size (`FontSize.*`) → `var(--font-size-n{value})`
- Radius (`Radius2.*`) → `var(--radius-{name})`
- Opacity (`Opacity.*`) → `var(--opacity-n{value})`

**UPDATED - Surface Padding Law**:
```tsx
// Old: p={2} (ambiguous)
// New: Space.n8 or layout preset (explicit)
```

---

### 4. Section 11: Design Token System (Complete Rewrite)

**❌ REMOVED - Incorrect token naming**:
```tsx
--space-{0-40}  // Old (wrong)
--size-{3-300}  // Old (wrong)
```

**❌ REMOVED - toToken() Utility (Never existed)**:
```tsx
toToken(2, "space")      // → "var(--space-2)"
toToken(65, "size")      // → "var(--size-65)"
```

**✅ ADDED - 1-Tier + 2-Tier Token Structure**:

**1-Tier Tokens (Numeric, Absolute)**:
```tsx
Space.n0, Space.n4, Space.n8, Space.n12, Space.n16, Space.n24, ...
Size.n0, Size.n16, Size.n240, Size.n680, Size.n1200, ...
IconSize.n10, IconSize.n16, IconSize.n20, IconSize.n24, ...
FontSize.n9, FontSize.n10, FontSize.n12, FontSize.n14, ...
Opacity.n0, Opacity.n10, ...Opacity.n100
```

**2-Tier Tokens (Semantic, Contextual)**:
```tsx
Radius2.none, Radius2.sm, Radius2.md, Radius2.lg, Radius2.full
ActionSize.sm, ActionSize.md, ActionSize.lg
```

**✅ ADDED - Branded Type System Explanation**:
```tsx
// Benefits:
- AI cannot use arbitrary numbers
- Unused tokens detected by ts-unused-exports
- Zero runtime overhead (types only)
- Dead code elimination
```

---

### 5. Section 12: Visual Excellence

**❌ REMOVED - Non-existent components**:
```tsx
Use `ProseDocument` and `ProseSection` for text-heavy content
```

**✅ UPDATED**:
```tsx
Use `Text.Prose` for text-heavy content (accessed via Text namespace)
Use `Action` with T-shirt sizing (size="sm") and consistent icon sizes (IconSize.n16)
```

---

### 6. Section 13: Design Principles

**UPDATED - All examples to use token constants**:

**Section 13.1 - Convergent Evolution**:
```tsx
// Old: p={2}
// New: override={{ p: Space.n8 }}
```

**Section 13.2 - Semantic Hierarchy**:
```tsx
// Old: Use `Prose` roles
// New: Use `Text.Prose` roles (Text.Prose.Title, Text.Prose.Body)
```

**Section 13.3 - Purposeful Density**:
```tsx
// Old: gap={1}, gap={2}, p={24}
// New: Space.n4, Space.n8, Space.n24
```

---

### 7. Section 15: Documentation Reference

**UPDATED - Paths to docs/0-best/**:
```tsx
// Old paths:
docs/claude/13-field-action-purpose-definition.md
docs/claude/14-field-action-three-tier-structure.md

// New paths:
docs/0-best/13-field-action-purpose-definition.md
docs/0-best/15-three-tier-as-core-concept.md
docs/0-best/19-headless-vs-ui-component-philosophy.md
```

---

## Summary of Legacy Concepts Removed

| Concept | Location | Status |
|---------|----------|--------|
| Numeric token mapping (`p={4}` = 16px) | Section 0 | Replaced with branded types |
| toToken() utility | Section 11 | Removed (never existed) |
| Wrong token naming (`--space-4`) | Section 11 | Fixed to `--space-n16` |
| Legacy Frame props (`gap={4}`) | Section 2 | Deprecated, alternatives provided |
| ProseDocument/ProseSection | Section 12 | Removed (never existed) |
| Direct Prose access | Section 13 | Changed to Text.Prose namespace |
| Numeric shorthand examples | Throughout | Replaced with token constants |
| Wrong import paths | Section 1 | Fixed to actual paths |

---

## New Concepts Added

1. **Branded Type System**
   - TypeScript branded types enforce token usage
   - AI cannot use arbitrary numbers
   - Compile-time enforcement

2. **2-Tier Layout System**
   - Semantic layout presets (`layout` prop)
   - Direct token overrides (`override` prop)
   - Clear deprecation of legacy props

3. **Token Categories**
   - Complete taxonomy of token types
   - Import paths and usage patterns
   - CSS variable format documentation

4. **Migration Guidance**
   - Deprecated props clearly marked
   - Recommended alternatives provided
   - Before/after examples

---

## Impact Assessment

### High Impact Changes:
1. **Golden Rule rewrite** - Fundamental shift from numeric props to token constants
2. **Frame API deprecation** - Clear guidance on 2-Tier system
3. **Token system documentation** - Complete overhaul with branded types

### Medium Impact Changes:
1. **Import order update** - Adds token imports as new category
2. **Component path corrections** - Fixes incorrect import paths
3. **Design principles updates** - All examples now use token constants

### Low Impact Changes:
1. **Documentation path updates** - Points to correct files
2. **Text.Prose namespace** - Clarifies correct access pattern
3. **Visual Excellence** - Removes non-existent components

---

## Consistency Check

Both CLAUDE.md and conventions.md now:
- ✅ Document the same token naming convention (`n{value}` format)
- ✅ Recommend the 2-Tier layout system
- ✅ Deprecate legacy Frame props
- ✅ Enforce branded type system
- ✅ Use Text.Prose namespace
- ✅ Reference correct documentation paths
- ✅ Provide explicit token constant usage

---

## Recommendations for Users

### For AI Assistants:
1. Always import token constants: `Space.n16`, `Size.n240`
2. Use layout presets when possible: `Layout.Stack.Content.Default`
3. Use `override` prop for custom tokens
4. Never use raw numbers for spacing/sizing
5. Access Prose via Text namespace: `Text.Prose.Title`

### For Developers:
1. Migrate deprecated Frame props to 2-Tier system
2. Update imports to include token constants
3. Use TypeScript to catch token violations
4. Run `npm run check:unused` to find dead tokens
5. Consult conventions.md for up-to-date patterns

---

## Files Modified

1. **`.agent/conventions.md`** - Complete sections rewritten:
   - Section 0: THE GOLDEN RULE
   - Section 1: Import Order
   - Section 2: Token System Usage (renamed from "No Hardcoded Pixels")
   - Section 11: Design Token System
   - Section 12: Visual Excellence
   - Section 13: Design Principles (examples updated)
   - Section 15: Documentation Reference

2. **`CLAUDE.md`** - Previously updated (see report #24)

---

## Next Steps

1. ✅ **COMPLETED**: conventions.md updated
2. ✅ **COMPLETED**: CLAUDE.md updated
3. ⚠️ **TODO**: Migrate 10 files using deprecated Frame props
4. ⚠️ **TODO**: Add ESLint rule for deprecated props
5. ⚠️ **TODO**: Create codemod for automatic migration

---

## Appendix: Before/After Examples

### Example 1: Basic Frame

**Before (Legacy)**:
```tsx
<Frame gap={4} flex p={3}>
  {children}
</Frame>
```

**After (Current)**:
```tsx
import { Layout } from "../design-system/Frame/Layout/Layout";

<Frame layout={Layout.Stack.Content.Default}>
  {children}
</Frame>
```

### Example 2: Custom Spacing

**Before (Legacy)**:
```tsx
<Frame gap={2} p={4} w={65}>
  {children}
</Frame>
```

**After (Current)**:
```tsx
import { Space, Size } from "../design-system/token/token.const.1tier";

<Frame
  w={Size.n260}
  override={{
    gap: Space.n8,
    p: Space.n16
  }}
>
  {children}
</Frame>
```

### Example 3: Prose Typography

**Before (Legacy)**:
```tsx
<Prose.Title variant="xl">Heading</Prose.Title>
```

**After (Current)**:
```tsx
import { Text } from "../design-system/text/Text";

<Text.Prose.Title variant="xl">Heading</Text.Prose.Title>
```

### Example 4: Action Button

**Before (Legacy)**:
```tsx
<Action size={32} iconSize={16}>
```

**After (Current)**:
```tsx
import { IconSize } from "../design-system/token/token.const.1tier";

<Action size="sm" iconSize={IconSize.n16}>
```

---

**Report Generated**: 2026-01-16
**Audited By**: Claude Code Assistant
**Status**: Conventions Updated, Ready for Review

## Related Reports
- See `24-[Legacy]claude-md-legacy-audit-report.md` for CLAUDE.md changes
