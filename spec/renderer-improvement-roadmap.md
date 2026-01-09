# IDDL Renderer Improvement Roadmap

**Based on:** `minimal-renderer-guide.md` v1.0.1
**Current State:** IDDL 1.0.1 with partial minimal design implementation
**Date:** 2026-01-09

---

## 0. Executive Summary

현재 IDDL 렌더러는 **기본적인 Prominence/Intent 시스템**과 **CVA 기반 variant**를 갖추고 있으나, `minimal-renderer-guide.md`에서 정의한 **Minimal Design 원칙**이 완전히 구현되지 않았습니다.

### Current Status

| Category | Status | Details |
|----------|--------|---------|
| ✅ **DSL Components** | Good | Page, Section, Group, Action, Text, Field, Overlay |
| ✅ **CVA Integration** | Good | All components use class-variance-authority |
| ✅ **Prominence System** | Good | Hero/Primary/Secondary/Tertiary implemented |
| ✅ **Intent System** | Good | Brand/Positive/Caution/Critical/Info/Neutral |
| ⚠️ **Design Tokens** | Partial | 토큰 구조는 있지만 가이드와 불일치 |
| ⚠️ **Padding/Spacing** | Partial | 패딩이 있지만 토큰화되지 않음 |
| ❌ **Tooltip** | Missing | 아이콘 버튼에 필수 (guide Section 7.2) |
| ❌ **Toast** | Missing | 상태 피드백에 필수 (guide Section 8.2) |
| ❌ **Density System** | Missing | Compact/Standard/Comfortable (guide Section 5.4) |
| ❌ **Token Alignment** | Missing | 가이드 토큰과 themes.css 불일치 |

---

## 1. Phase 1: Token System Alignment (High Priority)

**Goal:** `minimal-renderer-guide.md` Section 10의 CSS Variables와 `themes.css`를 완전히 일치시킵니다.

### 1.1. Gap Token Mismatch

**Guide 정의:**
```css
--space-1: 4px;   /* 인라인 요소 내부 */
--space-2: 8px;   /* 밀접한 요소 사이 */
--space-3: 16px;  /* 그룹 내 요소 사이 */
--space-4: 24px;  /* 그룹 사이 */
--space-5: 48px;  /* 섹션 사이 */
```

**Current State (themes.css):**
```css
--spacing-0: 0;
--spacing-1: 0.25rem;  /* 4px ✓ */
--spacing-2: 0.5rem;   /* 8px ✓ */
--spacing-3: 0.75rem;  /* 12px ✗ should be 16px */
--spacing-4: 1rem;     /* 16px ✗ should be 24px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px ✓ */
--spacing-16: 4rem;    /* 64px (not in guide) */
```

**Action Items:**
- [ ] Rename `--spacing-*` to `--space-*`
- [ ] Adjust values to match guide (1:4px, 2:8px, 3:16px, 4:24px, 5:48px)
- [ ] Remove non-standard spacings (--spacing-12px, --spacing-16)
- [ ] Update all component gap/margin usages

### 1.2. Padding Token Missing

**Guide 정의:**
```css
--padding-xs: 4px 8px;     /* badge, tag */
--padding-sm: 6px 10px;    /* tooltip */
--padding-md: 8px 12px;    /* input, table cell */
--padding-button: 8px 16px; /* button */
--padding-lg: 16px;        /* card */
--padding-xl: 24px;        /* modal, section */
```

**Current State:** ❌ **Not defined in themes.css**

**Action Items:**
- [ ] Add all padding tokens to themes.css Tier 1
- [ ] Replace hardcoded padding in Action.tsx (py-3 px-6 → var(--padding-button))
- [ ] Replace hardcoded padding in Group.tsx (p-4 → var(--padding-lg))
- [ ] Replace hardcoded padding in Section.tsx

### 1.3. Shadow Token Mismatch

**Guide 정의:**
```css
--shadow-float: 0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
--shadow-modal: 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08);
```

**Current State:**
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

**Action Items:**
- [ ] Add `--shadow-float` for floating elements (Dropdown, Popover, Toast)
- [ ] Add `--shadow-modal` for Modal/Dialog/Drawer
- [ ] Keep existing shadows as primitives, add semantic shadows
- [ ] Update Overlay.tsx to use semantic shadow tokens

### 1.4. Surface Token Verification

**Guide 정의:**
```css
--surface-0: transparent;
--surface-1: rgba(0,0,0,0.02);  /* hover, 선택 */
--surface-2: rgba(0,0,0,0.05);  /* active, 강조 */
--surface-3: rgba(0,0,0,0.08);  /* 영역 구분 */
```

**Action Items:**
- [ ] Verify current surface tokens match guide values
- [ ] Ensure opacity values are consistent with minimal design
- [ ] Test dark mode surface values

### 1.5. Border Token Verification

**Guide 정의:**
```css
--border-subtle: 1px solid rgba(0,0,0,0.08);
--border-default: 1px solid rgba(0,0,0,0.15);
```

**Action Items:**
- [ ] Verify border tokens exist and match guide
- [ ] Ensure minimal use (guide Section 6: prefer gap over borders)

### 1.6. Missing Tokens

**Guide 정의 (현재 없음):**
```css
/* Icon */
--icon-size: 16px;
--icon-size-lg: 20px;

/* Transition */
--transition-fast: 100ms;

/* Backdrop */
--backdrop: rgba(0,0,0,0.4);
```

**Action Items:**
- [ ] Add `--icon-size` and `--icon-size-lg` to themes.css
- [ ] Add `--transition-fast` for state transitions
- [ ] Add `--backdrop` for Modal/Dialog/Drawer overlays
- [ ] Update Action.tsx icon sizing to use tokens
- [ ] Update Overlay.tsx backdrop to use token

---

## 2. Phase 2: Missing Components (High Priority)

### 2.1. Tooltip Component

**Why:** Guide Section 7.2 명시 - "아이콘만 있을 때 tooltip은 필수"

**Requirements:**
- Trigger: hover 200-300ms 후 표시
- Position: 아이콘 근처 (위/아래/좌/우 자동)
- Content: 간결한 동사구 ("Edit", "Delete", "View details")
- Style: radius-sm (4px), padding-sm (6px 10px)
- Shadow: 약하게 또는 없음
- Accessibility: role="tooltip", aria-describedby

**IDDL Mapping:**
```tsx
<Overlay role="Tooltip" prominence="Tertiary">
  <Text role="Caption">Edit</Text>
</Overlay>
```

**Files to Create:**
- [ ] `src/components/atoms/Tooltip.tsx`
- [ ] `src/components/atoms/TooltipProvider.tsx` (context for positioning)
- [ ] Update Action.tsx to support tooltip prop

**Example:**
```tsx
<Action
  icon="Edit"
  prominence="Tertiary"
  tooltip="Edit item"
  onClick={handleEdit}
/>
```

### 2.2. Toast Component

**Why:** Guide Section 8.2 - 상태 피드백 (Success, Error, Info)

**Requirements:**
- Position: 화면 상단 중앙 또는 우측 하단
- Duration: 3-5초 후 자동 소멸
- Style: shadow-float, radius-md (8px), padding-lg (16px)
- Icon + Message + Close button
- Intent colors: Positive/Critical/Info
- Animation: fade in/out (100ms)

**IDDL Mapping:**
```tsx
<Overlay role="Toast" prominence="Primary" intent="Positive">
  <Group role="Container">
    <Action icon="Check" prominence="Tertiary" disabled />
    <Text role="Body">Changes saved successfully</Text>
    <Action icon="X" prominence="Tertiary" onClick={dismiss} />
  </Group>
</Overlay>
```

**Files to Create:**
- [ ] `src/components/atoms/Toast.tsx`
- [ ] `src/components/atoms/ToastProvider.tsx` (context + queue)
- [ ] `src/lib/toast.ts` (useToast hook)

**Example:**
```tsx
const { toast } = useToast();

toast({
  intent: 'Positive',
  message: 'Changes saved successfully',
  duration: 3000,
});
```

### 2.3. Loading State Component

**Why:** Guide Section 8.2 - Loading state 표현

**Requirements:**
- Spinner icon (animated)
- Opacity 0.6
- Centered in container
- Optional overlay (prevents interaction)

**IDDL Mapping:**
```tsx
<Group role="Status" prominence="Tertiary">
  <Action icon="Loader2" loading disabled />
  <Text role="Caption" prominence="Tertiary">Loading...</Text>
</Group>
```

**Files to Update:**
- [ ] Add `<Spinner />` to `src/components/atoms/` (or use lucide-react Loader2)
- [ ] Update Action.tsx loading state (already exists, verify styling)
- [ ] Create `<LoadingOverlay />` for full-page loading

### 2.4. Empty State Component

**Why:** Guide Section 8.2 - Empty state 안내

**Requirements:**
- Centered message
- Icon (optional)
- Muted text (Tertiary prominence)
- Optional action button

**IDDL Mapping:**
```tsx
<Group role="Container" prominence="Tertiary">
  <Action icon="Inbox" prominence="Tertiary" disabled />
  <Text role="Body" prominence="Tertiary">No items found</Text>
  <Action label="Create new" prominence="Primary" intent="Brand" />
</Group>
```

**Files to Create:**
- [ ] `src/components/atoms/EmptyState.tsx`

---

## 3. Phase 3: Density System (Medium Priority)

**Why:** Guide Section 5.4 - Compact/Standard/Comfortable variants

### 3.1. Density Context

**Requirements:**
- Global density setting (Compact/Standard/Comfortable)
- Affects gap and padding across all components
- CSS variable multipliers

**Multipliers:**
| Density | Gap 배수 | Padding 배수 |
|---------|----------|-------------|
| Compact | 0.66x | 0.75x |
| Standard | 1x | 1x |
| Comfortable | 1.5x | 1.25x |

**Implementation:**
```css
/* themes.css */
@layer base {
  [data-density="compact"] {
    --space-multiplier: 0.66;
    --padding-multiplier: 0.75;
  }
  [data-density="standard"] {
    --space-multiplier: 1;
    --padding-multiplier: 1;
  }
  [data-density="comfortable"] {
    --space-multiplier: 1.5;
    --padding-multiplier: 1.25;
  }
}
```

**Files to Create/Update:**
- [ ] Add density to `src/lib/theme.ts`
- [ ] Add density controls to SettingsModal
- [ ] Update themes.css with density multipliers
- [ ] Test all components at 3 density levels

---

## 4. Phase 4: Component Refinements (Medium Priority)

### 4.1. Action Component Improvements

**Current State:** Good, but missing tooltip integration

**Action Items:**
- [ ] Add `tooltip?: string` prop
- [ ] Integrate with Tooltip component
- [ ] Verify padding matches guide (py-3 px-6 for Hero, py-2 px-4 for Primary)
- [ ] Add `variant="list-item"` styles alignment (already exists, verify)

### 4.2. Field Component Improvements

**Current State:** Basic implementation exists

**Action Items:**
- [ ] Verify padding matches guide (8px 12px for input)
- [ ] Add focus ring (2px outline brand)
- [ ] Add error state styling (Critical intent)
- [ ] Add disabled state (opacity 0.4)
- [ ] Add clearable feature (High priority per iddl-renderer-requirements)

### 4.3. Text Component Improvements

**Current State:** Good, Intent colors fixed

**Action Items:**
- [ ] Verify font sizes match guide:
  - Hero: text-lg (18px) + font-medium (500)
  - Primary: text-base (14px) + font-medium (500)
  - Secondary: text-base (14px) + font-normal (400)
  - Tertiary: text-sm (12px) + opacity 0.6
- [ ] Add line-height: 1.5 to all variants

### 4.4. Section Component Improvements

**Current State:** Auto-layout for Navigator/Aside added

**Action Items:**
- [ ] Verify padding in Header/Footer (should use --padding-lg or --padding-xl)
- [ ] Test Navigator width (fixed 288px = 18rem, per guide w-72)
- [ ] Ensure border colors use --border-subtle

### 4.5. Group Component Improvements

**Current State:** List auto-style added

**Action Items:**
- [ ] Verify gap values match guide (gap-1 = 4px, gap-2 = 8px, etc.)
- [ ] Add Card role with border-subtle and padding-lg
- [ ] Add Status role for loading/empty/error states

### 4.6. Overlay Component Improvements

**Current State:** Shadow tokens fixed (shadow-lg, shadow-xl)

**Action Items:**
- [ ] Replace shadow-lg/shadow-xl with --shadow-float/--shadow-modal
- [ ] Add backdrop dimming for Dialog/Drawer (rgba(0,0,0,0.4))
- [ ] Verify radius: lg (12px) for Modal, md (8px) for Dropdown/Popover

---

## 5. Phase 5: Accessibility & States (Low Priority)

### 5.1. Focus Management

**Requirements:**
- All interactive elements have visible focus ring
- Focus ring: 2px outline, brand color or currentColor
- Skip to main content link
- Trap focus in Modals/Dialogs

**Action Items:**
- [ ] Audit all Action variants for focus-visible styles
- [ ] Add focus trap to Overlay (Dialog/Drawer)
- [ ] Add skip link to Page component

### 5.2. Keyboard Navigation

**Requirements:**
- Tab order follows visual order
- Enter/Space triggers Actions
- Escape closes Overlays
- Arrow keys for lists (if implemented)

**Action Items:**
- [ ] Verify Action keyboard handlers (onClick responds to Enter/Space)
- [ ] Add Escape handler to Overlay
- [ ] Test tab order in complex layouts

### 5.3. ARIA Labels

**Requirements:**
- All icon-only Actions have aria-label
- Overlays have aria-modal, aria-labelledby, aria-describedby
- Loading states have aria-busy
- Error states have aria-invalid

**Action Items:**
- [ ] Add aria-label to Action when icon-only
- [ ] Add ARIA attributes to Overlay roles
- [ ] Add aria-busy to loading states
- [ ] Add aria-invalid to Field error states

### 5.4. Color Contrast

**Requirements:**
- Text contrast ≥ 4.5:1 (WCAG AA)
- Large text ≥ 3:1
- Non-text contrast ≥ 3:1 (borders, icons)

**Action Items:**
- [ ] Audit all color tokens for contrast
- [ ] Test Tertiary text (opacity 0.6) contrast
- [ ] Test border-subtle contrast
- [ ] Verify Intent colors meet contrast requirements

---

## 6. Phase 6: Design System Documentation (Low Priority)

### 6.1. Component Examples

**Goal:** Every component has usage examples demonstrating guide principles

**Action Items:**
- [ ] Create examples for each Prominence level
- [ ] Create examples for each Intent
- [ ] Create examples of proper padding/spacing
- [ ] Create examples of shadow usage (only Overlays)

**Files:**
- [ ] Update Showcase app with annotated examples
- [ ] Add comments explaining guide sections

### 6.2. Token Documentation

**Goal:** Auto-generated token reference like Token Viewer but with guide explanations

**Action Items:**
- [ ] Add "Purpose" field to Token type
- [ ] Link each token to guide section (e.g., --shadow-float → Section 2.2)
- [ ] Show usage examples for each token

**Files:**
- [ ] Extend `src/apps/tokens/parser/types.ts`
- [ ] Update `src/apps/tokens/parser/cssParser.ts` to extract comments
- [ ] Update Token Viewer to show guide references

### 6.3. Audit Tool

**Goal:** Automated checklist from guide Section 11

**Action Items:**
- [ ] Create audit script that checks:
  - All Actions have padding
  - All elements use rounded corners
  - Icon-only Actions have tooltips
  - Token count matches guide limits
  - No multiple Hero elements on same screen
  - Shadows only on Overlays
- [ ] Output violations with guide section references

**Files:**
- [ ] `scripts/audit-design.ts`
- [ ] Integrate with ESLint or Storybook addon

---

## 7. Migration Strategy

### 7.1. Token Migration (Breaking Change)

**Problem:** Renaming `--spacing-*` to `--space-*` and changing values will break existing code.

**Strategy:**
1. **Add new tokens** (--space-1~5) alongside old tokens
2. **Deprecation warnings** in console for old token usage
3. **Gradual migration** over 2-3 commits:
   - Commit 1: Add new tokens, update themes.css
   - Commit 2: Update DSL components to use new tokens
   - Commit 3: Update app-specific components
   - Commit 4: Remove old tokens
4. **Testing:** Visual regression tests at each step

### 7.2. Component API Changes (Non-Breaking)

**New Props:**
- `Action.tooltip` (optional)
- `Field.clearable` (optional)
- `Overlay.backdrop` (optional)

**Strategy:** Additive only, no breaking changes to existing props.

### 7.3. Density System (Non-Breaking)

**Strategy:**
- Default to "standard" density
- Add opt-in via `<html data-density="compact">`
- No changes to component APIs

---

## 8. Success Metrics

### 8.1. Token Compliance

- [ ] 100% of spacing uses `--space-*` tokens (5 values)
- [ ] 100% of padding uses `--padding-*` tokens (6 values)
- [ ] 100% of radius uses `--radius-*` tokens (3 values)
- [ ] 100% of shadows use `--shadow-float` or `--shadow-modal`

### 8.2. Component Coverage

- [ ] Tooltip component exists and works
- [ ] Toast component exists and works
- [ ] All icon-only Actions have tooltips
- [ ] All interactive states (hover/focus/active/disabled) work correctly

### 8.3. Design Audit Pass

- [ ] No padding-less buttons/inputs
- [ ] No sharp corners (all border-radius applied)
- [ ] No shadows on non-Overlay elements
- [ ] No multiple Hero elements per screen
- [ ] All icons have tooltips

### 8.4. Accessibility

- [ ] All interactive elements keyboard accessible
- [ ] All icon-only elements have aria-label or tooltip
- [ ] All color contrast ≥ 4.5:1
- [ ] Focus indicators visible

---

## 9. Implementation Priority

### Must Have (Phase 1-2)

1. **Token Alignment** (1-2 days)
   - Fix spacing/padding/shadow tokens
   - Update all components to use tokens
   - Test visual regression

2. **Tooltip Component** (1 day)
   - Essential for icon-only Actions
   - Required by guide Section 7.2

3. **Toast Component** (1 day)
   - Essential for user feedback
   - Required by guide Section 8.2

### Should Have (Phase 3-4)

4. **Density System** (1 day)
   - Nice to have for user preference
   - Guide Section 5.4

5. **Component Refinements** (2 days)
   - Polish existing components
   - Field clearable feature
   - State handling improvements

### Nice to Have (Phase 5-6)

6. **Accessibility Audit** (1 day)
   - ARIA labels
   - Keyboard navigation
   - Focus management

7. **Documentation** (2 days)
   - Component examples
   - Token documentation
   - Audit tool

---

## 10. Next Steps

### Immediate Actions (Today)

1. Read this roadmap and approve priority order
2. Start Phase 1: Token System Alignment
   - Create backup branch: `git checkout -b backup/before-token-migration`
   - Begin token renaming in themes.css
   - Update Action.tsx as proof-of-concept

### This Week

1. Complete Phase 1 (Token Alignment)
2. Complete Phase 2.1 (Tooltip Component)
3. Complete Phase 2.2 (Toast Component)
4. Test all changes in Showcase app

### Next Week

1. Complete Phase 3 (Density System)
2. Complete Phase 4 (Component Refinements)
3. Begin Phase 5 (Accessibility)

### Month End

1. Complete all phases
2. Pass design audit checklist
3. Document all changes
4. Release IDDL Renderer v1.1.0

---

## 11. Open Questions

### Design Decisions

- [ ] Should we keep both `--shadow-lg` (primitive) and `--shadow-float` (semantic)?
- [ ] Should Density be global or per-component?
- [ ] Should Tooltip positioning be automatic or manual?
- [ ] Should Toast queue support stacking or replace?

### Technical Decisions

- [ ] Use Radix UI Tooltip or build from scratch?
- [ ] Use Radix UI Toast or build from scratch?
- [ ] Use CSS animations or React transitions?
- [ ] Support React 18 concurrent features?

### Migration Concerns

- [ ] Will token renaming break any existing code outside this repo?
- [ ] Should we provide codemod for --spacing-* → --space-* migration?
- [ ] Do we need a deprecation period or can we do hard cut?

---

## 12. References

- `spec/minimal-renderer-guide.md` - Design system principles
- `spec/iddl-spec-1.0.1.md` - IDDL component spec
- `docs/inbox/iddl-renderer-requirements-2026-01-09.md` - Recent requirements
- `src/styles/themes.css` - Current token definitions
- `src/components/dsl/*.tsx` - Current DSL components

---

## Appendix A: Token Comparison Table

| Token | Guide Value | Current Value | Status |
|-------|-------------|---------------|--------|
| --space-1 | 4px | --spacing-1: 4px ✓ | Rename |
| --space-2 | 8px | --spacing-2: 8px ✓ | Rename |
| --space-3 | 16px | --spacing-3: 12px ✗ | Fix + Rename |
| --space-4 | 24px | --spacing-4: 16px ✗ | Fix + Rename |
| --space-5 | 48px | --spacing-12: 48px ✓ | Rename |
| --padding-xs | 4px 8px | ❌ | Add |
| --padding-sm | 6px 10px | ❌ | Add |
| --padding-md | 8px 12px | ❌ | Add |
| --padding-button | 8px 16px | ❌ | Add |
| --padding-lg | 16px | ❌ | Add |
| --padding-xl | 24px | ❌ | Add |
| --radius-sm | 4px | 0.25rem ✓ | Keep |
| --radius-md | 8px | 0.375rem ✗ | Fix (6px→8px) |
| --radius-lg | 12px | 0.5rem ✗ | Fix (8px→12px) |
| --shadow-float | (guide value) | ❌ | Add |
| --shadow-modal | (guide value) | ❌ | Add |
| --icon-size | 16px | ❌ | Add |
| --icon-size-lg | 20px | ❌ | Add |
| --transition-fast | 100ms | ❌ | Add |
| --backdrop | rgba(0,0,0,0.4) | ❌ | Add |

---

## Appendix B: Component Coverage Matrix

| Component | Exists | Padding | Radius | Shadow | Tooltip | States | Guide Compliant |
|-----------|--------|---------|--------|--------|---------|--------|-----------------|
| Page | ✓ | N/A | N/A | N/A | N/A | N/A | ✓ |
| Section | ✓ | ⚠️ | ✓ | N/A | N/A | N/A | ⚠️ |
| Group | ✓ | ⚠️ | ⚠️ | N/A | N/A | N/A | ⚠️ |
| Action | ✓ | ✓ | ✓ | ❌ | ❌ | ✓ | ⚠️ |
| Text | ✓ | N/A | N/A | N/A | N/A | N/A | ✓ |
| Field | ✓ | ⚠️ | ✓ | N/A | N/A | ⚠️ | ⚠️ |
| Overlay | ✓ | ⚠️ | ✓ | ⚠️ | N/A | ✓ | ⚠️ |
| Tooltip | ❌ | - | - | - | - | - | ❌ |
| Toast | ❌ | - | - | - | - | - | ❌ |

Legend:
- ✓ Fully implemented
- ⚠️ Partially implemented or needs token alignment
- ❌ Missing
- N/A Not applicable
