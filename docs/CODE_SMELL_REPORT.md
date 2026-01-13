# Code Smell Report - Minimal Design Kit

**Date:** 2026-01-13
**Reviewer:** Claude Code
**Scope:** Full codebase analysis

## Executive Summary

This report identifies code smells, anti-patterns, and technical debt across the Minimal Design Kit codebase. The project demonstrates a well-designed design system with token-driven architecture, but several patterns violate best practices around maintainability, consistency, and architectural principles.

**Severity Levels:**
- 🔴 **Critical** - Significant architectural issues requiring immediate attention
- 🟡 **Medium** - Moderate issues affecting maintainability
- 🟢 **Low** - Minor improvements for code quality

---

## 🔴 Critical Issues

### 1. Import Path Inconsistency (Architectural Violation)

**Location:** Multiple files throughout codebase
**Pattern:** Mixed use of direct component imports vs. Element subdirectory imports

**Evidence:**
```tsx
// SlidesPanel.tsx (lines 2-5)
import { Action } from "../design-system/Element/Action.tsx";
import { Frame } from "../design-system/Frame";
import { Text } from "../design-system/Element/Text.tsx";

// FloatingToolbar.tsx (lines 13-14)
import { Action } from "../design-system/Element/Action.tsx";
import { Frame } from "../design-system/Frame";

// SlideApp.tsx (lines 14-16)
import { Action } from "../design-system/Element/Action.tsx";
import { Frame } from "../design-system/Frame";
```

**Issue:**
- `Frame` lives in `design-system/Frame.tsx` (root level)
- `Action`, `Text` live in `design-system/Element/` subdirectory
- Creates cognitive load and confusion about component organization
- Violates single location principle
- Makes refactoring dangerous (inconsistent import paths)

**Root Cause:**
The codebase appears to have undergone reorganization where some components were moved to an `Element/` subdirectory, but `Frame` and other core components remained at the root. This creates an inconsistent mental model.

**Recommendation:**
1. **Option A (Preferred):** Move ALL components to `design-system/` root level (flatten structure)
   - Remove `Element/` subdirectory entirely
   - Consistent pattern: `import { X } from "../design-system/X"`
2. **Option B:** Move ALL components into `Element/` subdirectory
   - `Frame.tsx` → `Element/Frame.tsx`
   - Consistent pattern: `import { X } from "../design-system/Element/X"`

**Note:** User's global CLAUDE.md states "never barrel export" - so index.ts files should NOT be used to solve this.

---

### 2. Barrel Export Violation

**Location:** `src/components/*`, `src/design-system/Element/*`
**Pattern:** Some imports suggest intent for barrel exports but none exist

**Evidence:**
User's global instructions explicitly state: "never barrel export"

However, the current directory structure (`Element/` subdirectory) suggests a grouping pattern that typically uses barrel exports. The codebase correctly avoids barrel exports, but the directory structure creates an illusion that they might exist.

**Issue:**
- Directory structure implies organizational grouping
- Developers may be tempted to add `index.ts` files
- Violates stated architectural principle

**Recommendation:**
Flatten the directory structure to remove temptation and align with the "no barrel exports" principle.

---

### 3. Magic Numbers and Hard-coded Values

**Location:** Throughout component files, especially in demo apps
**Severity:** 🟡 Medium (elevated to Critical due to scale)

**Evidence:**

```tsx
// SlidesPanel.tsx (line 14)
style={{ width: "160px", minWidth: "160px" }}

// PropertiesPanel.tsx (line 98)
style={{ width: "260px" }}

// LinearApp.tsx (line 37)
style={{ width: 240 }}

// PropertiesPanel.tsx (lines 53-54)
style={{ width: "20px", height: "20px" }}

// InspectorOverlay.tsx (line 165)
const PANEL_WIDTH = 260; // size-65

// SlideApp.tsx (line 32)
style={{ height: "44px" }}

// LinearApp.tsx (line 185)
style={{ paddingLeft: 18, paddingRight: 12, height: 28 }}
```

**Issue:**
- 50+ instances of magic numbers throughout the codebase
- Inconsistent with the token-driven design system
- Makes design changes difficult (no single source of truth)
- Violates the project's core architectural principle
- Some values have comments indicating they SHOULD be tokens (e.g., `// size-65`)

**Examples of Violation:**
```tsx
// Should use size token
<Frame style={{ width: "260px" }} />
// Should be: w={65} (--size-65 = 260px)

// Should use size token
style={{ width: "20px", height: "20px" }}
// Should be: size={5} (--size-5 = 24px, closest)
```

**Recommendation:**
1. Audit all inline `style` prop usages
2. Replace hard-coded dimensions with token-based props (`w`, `h`, `p`, `gap`)
3. Add ESLint rule to detect inline dimension styles
4. Create a migration guide for converting px values to tokens

---

## 🟡 Medium Issues

### 4. Prop Drilling and State Management

**Location:** `InspectorOverlay.tsx`, `PropertiesPanel.tsx`
**Pattern:** Complex state management without abstraction

**Evidence:**

```tsx
// InspectorOverlay.tsx (lines 9-14)
const [isActive, setIsActive] = useState(false);
const [isLocked, setIsLocked] = useState(false);
const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
const [targetName, setTargetName] = useState<string | null>(null);
const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
const [notification, setNotification] = useState<string | null>(null);
```

**Issue:**
- 6 related state variables in a single component
- Complex interdependencies between states
- Difficult to reason about state transitions
- No clear state machine pattern

**Recommendation:**
Extract to a custom hook or reducer:
```tsx
const {
  isActive,
  isLocked,
  targetRect,
  targetName,
  notification,
  lock,
  unlock,
  setTarget,
  notify
} = useInspectorState();
```

---

### 5. Type Safety Issues

**Location:** Multiple component files
**Pattern:** Use of `any`, `@ts-ignore`, loose typing

**Evidence:**

```tsx
// Action.tsx (line 71-72)
// @ts-ignore
return <Icon size={iconSize} />;

// PropertiesPanel.tsx (line 149)
surface={(tool as any).surface}

// Frame.tsx (various lines)
gap: toToken(gap, "space") as any,
```

**Issue:**
- `@ts-ignore` comments suppress TypeScript's safety net
- Type assertions (`as any`) bypass type checking
- Potential runtime errors from incorrect prop types

**Recommendation:**
1. Define proper types for icon components
2. Use discriminated unions for tool configurations
3. Fix `toToken` return type to eliminate need for `as any`

---

### 6. Component God Object

**Location:** `PropertiesPanel.tsx`, `InspectorOverlay.tsx`
**Pattern:** Components doing too many things

**Evidence:**

```tsx
// PropertiesPanel.tsx: 326 lines
// Responsibilities:
// - Tab state management
// - Transform state management
// - Rendering 8+ property sections
// - Helper component definitions (PropertySection, TransformField)
// - Data configuration (ALIGNMENT_TOOLS)
```

**Issue:**
- Single component > 300 lines
- Multiple responsibilities (SRP violation)
- Helper components defined inside parent file
- Data and presentation mixed

**Recommendation:**
Split into multiple files:
```
components/PropertiesPanel/
├── PropertiesPanel.tsx (orchestrator)
├── PropertySection.tsx
├── TransformFields.tsx
├── AlignmentTools.tsx
├── constants.ts
└── types.ts
```

---

### 7. Inconsistent Component Prop Patterns

**Location:** `Action.tsx`, `Text.tsx`, `Frame.tsx`
**Pattern:** Different approaches to prop handling

**Evidence:**

```tsx
// Action.tsx - complex defaulting logic
const finalVariant = variant ?? (label ? "surface" : "ghost");
const finalWidth = label ? "auto" : size;

// Text.tsx - variant-based color mapping
const colorMap = { 1: "...", 2: "...", 3: "...", 4: "...", 5: "...", 6: "..." };

// Frame.tsx - inline ternary chains
flexDirection: row ? "row" : "column"
```

**Issue:**
- Each component has different prop resolution strategy
- No consistent pattern for defaults
- Hard to predict behavior
- Increases cognitive load

**Recommendation:**
Establish consistent patterns:
1. Document prop defaulting strategy
2. Extract complex logic to named functions
3. Use configuration objects for variant mappings

---

### 8. Separator vs Divider Naming Confusion

**Location:** `design-system/`
**Pattern:** File named `Divider.tsx` but not imported anywhere

**Evidence:**
```bash
$ ls src/design-system/Element/
Divider.tsx  # File exists
```

```tsx
// FloatingToolbar.tsx imports Separator
import { Separator } from "../design-system/Separator";
```

**Issue:**
- Dead code: `Divider.tsx` exists but is never used
- Naming inconsistency: Is it Separator or Divider?
- Potential confusion for new developers

**Recommendation:**
1. Remove `Divider.tsx` if unused
2. Or rename `Separator` → `Divider` consistently
3. Document the decision

---

## 🟢 Low Issues

### 9. Commented Out Code

**Location:** `CMSApp.tsx` (line 3)

**Evidence:**
```tsx
// import { ProseDocument } from "../design-system/Prose";
```

**Issue:**
- Version control (git) already tracks history
- Commented imports create noise
- Unclear intent (why commented?)

**Recommendation:**
Remove commented code. Use git history if needed.

---

### 10. Inconsistent String Literal Types

**Location:** Various component files
**Pattern:** Mix of string literals and type unions

**Evidence:**

```tsx
// PropertiesPanel.tsx (line 84)
const [activeTab, setActiveTab] = useState<"DESIGN" | "ANIMATE">("DESIGN");

// IssueRow.tsx (line 256)
status?: "todo" | "done" | "progress";

// Some files use strings directly without types
surface="sunken"  // No type constraint in some contexts
```

**Issue:**
- Inconsistent approach to string literal types
- Some typed, some not
- Could lead to typos

**Recommendation:**
Extract to type definitions:
```tsx
type TabType = "DESIGN" | "ANIMATE";
type IssueStatus = "todo" | "done" | "progress";
```

---

### 11. Long Conditional Chains

**Location:** `Frame.tsx`, `Text.tsx`
**Pattern:** Nested ternary operators

**Evidence:**

```tsx
// Frame.tsx (lines 171-185)
alignItems:
  effectiveAlign === "start"
    ? "flex-start"
    : effectiveAlign === "end"
      ? "flex-end"
      : effectiveAlign,
justifyContent:
  effectiveJustify === "start"
    ? "flex-start"
    : effectiveJustify === "end"
      ? "flex-end"
      : effectiveJustify === "between"
        ? "space-between"
        : effectiveJustify === "around"
          ? "space-around"
          : effectiveJustify,
```

**Issue:**
- Hard to read nested ternaries
- Prone to errors
- Difficult to test individual conditions

**Recommendation:**
Extract to mapping functions:
```tsx
const mapAlign = (value: AlignToken) => {
  const map = { start: "flex-start", end: "flex-end" };
  return map[value] || value;
};
```

---

### 12. Inline Array Mapping with Index Keys

**Location:** Multiple files
**Pattern:** Using array index as React key

**Evidence:**

```tsx
// FloatingToolbar.tsx (lines 51-64)
{BOTTOM_TOOLS.map((tool, i) => (
  tool.separator ? (
    <Separator key={i} orientation="vertical" length="16px" />
  ) : (
    <Action key={i} icon={tool.icon} ... />
  )
))}

// PropertiesPanel.tsx (lines 141-156)
{ALIGNMENT_TOOLS.map((tool, i) => ...)}
```

**Issue:**
- Index as key is anti-pattern for static lists
- Can cause React reconciliation issues if list order changes
- Not actually problematic here (static arrays), but sets bad precedent

**Recommendation:**
Use stable identifiers:
```tsx
{BOTTOM_TOOLS.map((tool) => (
  tool.separator ? (
    <Separator key="separator-after-pen" />
  ) : (
    <Action key={tool.tooltip} icon={tool.icon} />
  )
))}
```

---

### 13. Component File Organization

**Location:** `src/apps/LinearApp.tsx` (563 lines)
**Pattern:** Multiple components in single file

**Evidence:**
```tsx
// LinearApp.tsx contains:
// - LinearSidebar (145 lines)
// - SectionHeader (20 lines)
// - NavItem (40 lines)
// - IssueRow (52 lines)
// - LinearIssueList (211 lines)
// - LinearApp (8 lines)
```

**Issue:**
- 6 components in one file
- Hard to navigate
- Violates Single Responsibility Principle at file level
- Difficult to reuse components

**Recommendation:**
Split into file structure:
```
apps/LinearApp/
├── LinearApp.tsx
├── LinearSidebar.tsx
├── LinearIssueList.tsx
└── components/
    ├── SectionHeader.tsx
    ├── NavItem.tsx
    └── IssueRow.tsx
```

**Note:** This conflicts with user's FSD (Feature-Sliced Design) preference. Consider:
```
features/linear/
├── ui/
│   ├── LinearApp.tsx
│   ├── Sidebar.tsx
│   └── IssueList.tsx
└── model/
    └── types.ts
```

---

## 🔵 Observations (Not Smells, But Worth Noting)

### 14. Design System Maturity

**Positive Patterns:**
- Excellent token-driven design system
- Consistent prop-based API across components
- Good separation of concerns (mostly)
- Strong TypeScript usage (despite some gaps)

**Areas for Growth:**
- Missing compound component patterns (Tabs, Accordion, etc.)
- No component composition utilities
- Limited animation/transition support
- No form validation patterns

---

### 15. Test Coverage

**Observation:** No test files found in codebase

**Impact:**
- Refactoring is risky without tests
- Hard to verify token resolution logic
- Component prop combinations untested

**Recommendation:**
Add tests for:
1. `toToken` utility (critical path)
2. Component prop defaulting logic
3. Theme switching behavior
4. Inspector overlay state machine

---

## Prioritized Action Plan

### Phase 1: Critical (Week 1)
1. ✅ Fix import path inconsistency (flatten or organize consistently)
2. ✅ Remove magic numbers in favor of token props
3. ✅ Fix TypeScript `@ts-ignore` usages

### Phase 2: Medium (Week 2-3)
4. Extract state management to custom hooks
5. Split large components into smaller files
6. Implement consistent prop defaulting patterns
7. Remove dead code (`Divider.tsx`, commented imports)

### Phase 3: Low (Week 4)
8. Replace index keys with stable identifiers
9. Extract conditional mapping functions
10. Add comprehensive TypeScript types
11. Document component prop patterns

### Phase 4: Long-term
12. Add test coverage
13. Implement missing compound components
14. Create component composition utilities
15. Adopt FSD architecture consistently

---

## Architectural Recommendations

### 1. Adopt Feature-Sliced Design (FSD)

User's global CLAUDE.md states preference for FSD architecture. Current structure violates this:

**Current Structure:**
```
src/
├── apps/          # Mixed feature and presentation
├── components/    # Shared components (good)
├── design-system/ # Good separation
```

**Recommended FSD Structure:**
```
src/
├── app/           # App initialization
├── features/      # Business features
│   ├── slide-editor/
│   ├── linear-issues/
│   └── cms-builder/
├── shared/        # Shared utilities
│   └── ui/        # Design system
└── widgets/       # Complex UI blocks
```

### 2. Establish Component Development Guidelines

Create `COMPONENT_GUIDELINES.md`:
- Token usage requirements (no magic numbers)
- Prop naming conventions
- File organization rules
- Import path standards
- TypeScript strictness requirements

### 3. Add Pre-commit Hooks

Prevent regressions:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## Conclusion

The Minimal Design Kit demonstrates strong design system principles with its token-driven architecture and prop-based component API. However, several patterns violate best practices:

**Key Issues:**
1. 🔴 Import path inconsistency undermines code organization
2. 🔴 Magic numbers throughout (50+ instances) violate token-driven design
3. 🟡 Type safety gaps with `@ts-ignore` and `as any`
4. 🟡 Large components need decomposition
5. 🟢 Minor issues with keys, comments, and naming

**Strengths:**
- Excellent design token system
- Consistent prop API patterns
- Strong TypeScript foundation
- Good component primitives (Frame, Action, Text)

**Priority:** Address import inconsistency and magic numbers first, as these affect every future component and violate core architectural principles.

---

**Review Date:** 2026-01-13
**Reviewed By:** Claude Code
**Status:** Initial Assessment
**Next Review:** After Phase 1 completion
