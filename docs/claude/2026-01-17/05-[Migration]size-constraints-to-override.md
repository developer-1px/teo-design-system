# Size Constraints Migration: Top-Level to Override

**Date**: 2026-01-17
**Migration Type**: Breaking Change - API Refactor
**Status**: ✅ Completed

## Overview

This migration removes `minWidth`, `minHeight`, `maxWidth`, and `maxHeight` from Frame's top-level props and moves them exclusively to the `override` prop for fine-tuning layout constraints.

## Motivation (WHY)

### Problem Statement

The Frame component had size constraint props (`minWidth`, `minHeight`, `maxWidth`, `maxHeight`) at the top level, which created API inconsistency:

1. **Unclear Intent**: Size constraints are fine-tuning tools, not primary layout decisions
2. **API Bloat**: Top-level props should represent semantic intent, not CSS granularity
3. **Inconsistent Pattern**: Other constraint properties (like `flex`, `fill`) are layout tokens, but min/max constraints are CSS overrides

### Design Philosophy Alignment

MDK's 2-Tier system should follow this hierarchy:

```
Tier 2 (Semantic): layout={Layout.Stack.Content.Default}
   ↓
Tier 1 (Fine-tuning): override={{ minHeight: Size.n40, maxWidth: Size.n640 }}
```

Size constraints are **fine-tuning tools** that adjust existing layouts, not primary layout decisions. They belong in `override`.

## Breaking Changes

### Removed Props

```typescript
// ❌ REMOVED from FramePresetProps
interface FramePresetProps {
  minWidth?: WidthToken;
  minHeight?: HeightToken;
  maxWidth?: MaxWidthToken;
  maxHeight?: MaxHeightToken;
}
```

### Migration Path

All size constraints must now be specified in the `override` prop:

```tsx
// ❌ Before (top-level)
<Frame
  minHeight={Size.n40}
  maxWidth={Size.n640}
>

// ✅ After (override)
<Frame
  override={{
    minHeight: Size.n40,
    maxWidth: Size.n640,
  }}
>
```

## Migration Guide

### Affected Files

Total: **99 occurrences** across **35 files**

### Common Patterns

#### Pattern 1: Single Constraint

```tsx
// Before
<Frame minHeight={Size.n40}>

// After
<Frame override={{ minHeight: Size.n40 }}>
```

#### Pattern 2: Multiple Constraints

```tsx
// Before
<Frame
  minHeight={Size.n32}
  maxWidth={Size.n640}
>

// After
<Frame
  override={{
    minHeight: Size.n32,
    maxWidth: Size.n640,
  }}
>
```

#### Pattern 3: Merging with Existing Override

```tsx
// Before
<Frame
  minHeight={Size.n40}
  override={{ gap: Space.n8, p: Space.n12 }}
>

// After
<Frame
  override={{
    gap: Space.n8,
    p: Space.n12,
    minHeight: Size.n40,
  }}
>
```

## Implementation Details

### Files Modified

**Core Type Definitions:**
- `src/design-system/Frame/FrameProps.ts` - Removed size constraint props
- `src/design-system/Frame/Frame.tsx` - Removed prop handling

**Migration Scripts:**
- `scripts/migrate-size-constraints.ts` - Automated migration (ts-morph, partial success)
- `scripts/fix-size-props.sh` - Perl regex script (simple cases)
- Manual fixes for complex cases with duplicate overrides

### Migration Challenges

1. **AST Manipulation**: ts-morph created duplicate override attributes instead of merging
2. **Duplicate Overrides**: Some files required manual merging of override objects
3. **TypeScript Errors**: 9 final errors required manual context-aware fixes

**Files with Manual Fixes:**
- `src/apps/crm/drawer/JsonTree.tsx` (3 instances)
- `src/apps/crm/drawer/PropertySection.tsx` (duplicate minHeight)
- `src/design-system/Action.tsx` (duplicate minHeight: 0 and minHeight: Size.n40)
- `src/inspector/components/InspectorControls.tsx` (3 duplicate overrides)
- `src/inspector/components/InspectorPanel.tsx` (1 duplicate override)

## Validation

### Type Safety

```bash
npm run typecheck  # ✅ 0 errors
```

### Production Build

```bash
npm run build      # ✅ Success
```

All 99 occurrences successfully migrated and validated.

## FAQ

### Q: Why remove these from top-level props?

**A:** Size constraints are **fine-tuning tools**, not semantic layout decisions. The top-level API should express intent (via `layout` prop), while `override` handles CSS-level adjustments. This maintains API clarity and prevents prop bloat.

### Q: What if I need minHeight for accessibility (e.g., touch targets)?

**A:** Use `override={{ minHeight: Size.n40 }}`. This is still a valid and necessary constraint, but it's a fine-tuning decision, not a primary layout concern.

### Q: Can I still use number values?

**A:** Yes! `override={{ minHeight: Size.n40 }}` uses token constants for consistency, but you can use literal numbers if needed: `override={{ minHeight: 40 }}`.

### Q: What about maxWidth for content containers?

**A:** Same pattern:

```tsx
<Frame
  layout={Layout.Stack.Content.Default}
  override={{ maxWidth: Size.n640 }}
>
```

The `layout` expresses semantic intent (content container), while `override` fine-tunes the constraint.

## Comparison: Spacing vs Size Constraints

| Migration | Before | After | Reason |
|-----------|--------|-------|--------|
| **Spacing** | `gap={Space.n12}` + `p={Space.n16}` | `spacing={Space.n12}` | Unify related props with formula |
| **Size Constraints** | `minHeight={Size.n40}` | `override={{ minHeight: Size.n40 }}` | Move fine-tuning to override tier |

**Key Difference:**
- Spacing migration **unified** gap and padding into a single semantic prop
- Size constraints migration **relocated** props to the appropriate API tier

## Lessons Learned

1. **AST Manipulation Complexity**: ts-morph is powerful but complex for attribute merging. Simple perl regex worked better for straightforward cases.
2. **Biome Auto-fix**: Running `npm run check` with biome helped auto-fix many formatting issues after automated migration.
3. **Manual Verification**: Final TypeScript errors (9 cases) required manual, context-aware fixes that automated tools couldn't handle reliably.
4. **Git Safety**: Using `git restore` to recover from corrupted files (from failed Python script) was essential.

## Next Steps

- ✅ All size constraints migrated to override
- ✅ TypeScript compilation passing
- ✅ Production build successful
- 📝 Update CLAUDE.md with new API examples
- 🎯 Consider future migrations for other fine-tuning props (border, shadow, etc.)

## References

- **Related Migration**: `04-[Migration]spacing-unification.md` - Spacing prop unification
- **Design Philosophy**: `.agent/conventions.md` - 3-Tier Intent System
- **API Documentation**: `CLAUDE.md` - Frame component API

---

**Migration completed successfully** with all 99 occurrences updated and validated.
