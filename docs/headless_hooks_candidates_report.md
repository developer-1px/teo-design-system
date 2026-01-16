# Headless Hooks Integration Opportunities Report

**Analysis Date:** January 16, 2026  
**Codebase:** /Users/user/Desktop/minimal-design-kit  
**Scope:** Full TypeScript React codebase (src/apps, src/components, src/design-system)  
**Thoroughness Level:** Very Thorough

---

## Executive Summary

This report identifies all components in the codebase that could benefit from the existing headless hooks library (`useAccordion`, `useDropdown`, `useTabs`, `useModal`). After comprehensive analysis, **9 components** with manual state management patterns were found that are excellent candidates for refactoring with headless hooks.

### Current Hook Library Status
- **useAccordion** ✅ Implemented and partially used
- **useDropdown** ✅ Implemented, not yet used  
- **useTabs** ✅ Implemented, not yet used
- **useModal** ✅ Implemented, not yet used
- **useTooltip** ✅ Implemented, not yet used

---

## Candidates by Hook Type

### 1. useAccordion Candidates

#### **[ALREADY USING] DrawerProperties.tsx**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/apps/crm/drawer/DrawerProperties.tsx`

**Status:** ✅ **Already using useAccordion**

**Implementation Details:**
- Uses `useAccordion` hook for multi-level accordion sections
- Groups properties by category with expand/collapse functionality
- Supports nested accordions for complex property structures
- Default expansion based on `isPrimary` flag

**Pattern:**
```tsx
const { getItemProps, getPanelProps } = useAccordion({
  items: groupIds,
  defaultExpanded,
  allowMultiple: true,
});

// Rendering with spread props
<Frame {...itemProps} onClick={itemProps.onToggle}>
  {itemProps.expanded ? <ChevronDown /> : <ChevronRight />}
</Frame>
<Frame {...panelProps}>{content}</Frame>
```

**Leverage:** Excellent reference implementation for other accordion patterns.

---

#### **PropertySection.tsx**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/apps/crm/drawer/PropertySection.tsx`

**Current Implementation:** Manual `useState` for `expanded` state

**Pattern:**
```tsx
const [expanded, setExpanded] = useState(defaultExpanded);
// Returns toggle button with chevron and conditional content render
```

**Why It's a Good Candidate:**
- Single collapsible section pattern
- Manual state management with `setExpanded(!expanded)`
- Uses chevron icons to indicate state (ChevronDown/ChevronRight)
- Has defaultExpanded prop for initialization

**Refactoring Opportunity:**
- Could use `useAccordion` for single-item accordion
- Benefits: Automatic ARIA attributes, keyboard support (Space/Enter)
- Current: Basic expand/collapse without a11y features
- Risk Level: LOW

**Lines of Code to Refactor:** ~80 lines

---

#### **PropertyTree.tsx (Inspector)**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/inspector/components/PropertyTree.tsx`

**Current Implementation:** Recursive component with manual `useState` for `isOpen`

**Pattern:**
```tsx
const [isOpen, setIsOpen] = useState(true);
// Recursive rendering with ChevronDown/ChevronRight icons
```

**Why It's a Good Candidate:**
- Recursive tree structure with expand/collapse at each level
- Manual state management on line 25: `const [isOpen, setIsOpen] = useState(true)`
- Chevron icon toggle (line 90-92)
- Empty objects are non-expandable (handled with spacing)

**Refactoring Opportunity:**
- Convert to accordion pattern for tree nodes
- Each node gets a unique ID for accordion items
- Benefits: Consistent expand/collapse behavior, keyboard navigation
- Challenge: Recursive structure requires ID generation strategy
- Risk Level: MEDIUM

**Lines of Code to Refactor:** ~50 lines

---

#### **FAQBoardFooter.tsx**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/apps/cms/FAQBoardFooter.tsx`

**Current Implementation:** Manual `useState` in FAQRow component

**Pattern:**
```tsx
const [isOpen, setIsOpen] = useState(false);
// Toggle on click: onClick={() => setIsOpen(!isOpen)}
// Shows/hides content based on state
```

**Why It's a Good Candidate:**
- Perfect accordion use case: FAQs are the canonical accordion pattern
- Multiple independent collapsible items (FAQRows)
- Manual state management (line 109)
- Plus icon rotates based on state (visual feedback)
- Border-based section styling

**Refactoring Opportunity:**
- Move FAQRow state to parent with useAccordion
- Each FAQ is an accordion item
- Benefits: Better state management, allowMultiple support for multiple FAQs
- Current: Each FAQRow manages its own state independently
- Risk Level: LOW

**Lines of Code to Refactor:** ~40 lines

---

#### **ExpandableValue.tsx**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/apps/crm/drawer/ExpandableValue.tsx`

**Current Implementation:** Manual Set-based state for expandable parts

**Pattern:**
```tsx
const [expandedParts, setExpandedParts] = useState<Set<number>>(new Set());
// Toggle logic on line 40-49
```

**Why It's a Good Candidate:**
- Multiple expandable items within a single value display
- Uses Set to track expanded indices
- Toggle logic (add/remove from set)
- ChevronDown/ChevronRight icons for each expandable part
- Supports showing/hiding hidden items

**Refactoring Opportunity:**
- Use `useAccordion` with numeric string IDs ("0", "1", etc.)
- Cleaner state management than Set manipulation
- Benefits: Standardized ARIA attributes, keyboard support
- Current: Manual Set handling loses some standardization
- Risk Level: MEDIUM

**Lines of Code to Refactor:** ~45 lines

---

### 2. useDropdown Candidates

#### **CRMSidebar.tsx**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/apps/crm/CRMSidebar.tsx`

**Current Implementation:** Jotai atoms for dataset selection + basic button group

**Pattern:**
```tsx
const [selectedDataset, setSelectedDataset] = useAtom(selectedDatasetAtom);
// DatasetItem components render with variant based on active state
// No dropdown menu, but selection pattern similar to dropdown
```

**Why It's a Good Candidate:**
- Dataset selection pattern could use dropdown for workspace switcher
- Currently renders all datasets as buttons (line 170-178)
- ChevronDown icon on workspace switcher (line 160) suggests dropdown intent
- Potential enhancement: Convert workspace switcher to dropdown menu

**Refactoring Opportunity:**
- Create a dropdown for "Workspace Switcher" section
- Limited scope - workspace selection dropdown only
- Benefits: Compact UI, keyboard navigation, ARIA support
- Current: Simple button selection doesn't need full dropdown complexity
- Risk Level: OPTIONAL - Nice to have, not critical

**Lines of Code to Add:** ~20-30 lines

---

#### **PropertiesPanel.tsx (Components)**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/components/PropertiesPanel.tsx`

**Current Implementation:** Manual `useState` for tab selection

**Pattern:**
```tsx
const [activeTab, setActiveTab] = useState<"DESIGN" | "ANIMATE">("DESIGN");
// Rendered as Action buttons with conditional styling
// No dropdown, but could benefit from dropdown for more options
```

**Why It's a Good Candidate:**
- Multiple configuration dropdowns embedded in the UI (lines 318, 336, 344, etc.)
- Font dropdown (line 335: Field with ChevronDown)
- Text weight dropdown (line 344)
- Property selectors have dropdown indicators
- Currently just text fields, not functional dropdowns

**Refactoring Opportunity:**
- Convert placeholder dropdowns to functional useDropdown hooks
- Each font/weight/style selector becomes a dropdown
- Benefits: Interactive property panels, keyboard navigation
- Current: Dropdown indicators without functionality
- Risk Level: MEDIUM

**Lines of Code to Add:** ~100-150 lines

---

#### **CMSSidebar.tsx**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/apps/cms/CMSSidebar.tsx`

**Current Implementation:** Jotai atoms + basic button group for view mode

**Pattern:**
```tsx
const [viewMode, setViewMode] = useState<"bar" | "thumbnail">("thumbnail");
// Toggle between two view modes via Action buttons (lines 133-146)
```

**Why It's a Good Candidate:**
- Not a true dropdown, but view mode toggle is dropdown-adjacent
- Could expand to support more view modes in the future
- Would benefit from dropdown if more modes are added
- Current: Simple binary toggle, scales to multiple options with dropdown

**Refactoring Opportunity:**
- Convert to `useDropdown` if view modes expand beyond 2
- Currently, binary toggle is simpler than dropdown
- Future-proof: Easier to add new view modes
- Risk Level: OPTIONAL - Only needed if more modes added

**Lines of Code to Add:** ~30-40 lines (if expanded)

---

### 3. useTabs Candidates

#### **PropertiesPanel.tsx (Components)**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/components/PropertiesPanel.tsx`

**Current Implementation:** Manual `useState` for tab selection

**Pattern:**
```tsx
const [activeTab, setActiveTab] = useState<"DESIGN" | "ANIMATE">("DESIGN");
// Rendered as Action buttons with conditional styling (lines 180-204)
// Conditional rendering of content based on activeTab
```

**Why It's a Good Candidate:**
- Perfect tabs pattern: Two tabs (DESIGN/ANIMATE) with different content
- Manual tab switching on line 185: `onClick={() => setActiveTab(tab as "DESIGN" | "ANIMATE")}`
- Conditional styling for active state (lines 186-189)
- Horizontal tab layout

**Refactoring Opportunity:**
- Replace with `useTabs` hook
- Benefits: Automatic ARIA attributes, keyboard navigation (Arrow keys)
- Cleaner state management with getTabProps/getPanelProps
- Current: Manual onClick handlers and conditional styling
- Risk Level: LOW

**Lines of Code to Refactor:** ~30-40 lines

**Expected Improvements:**
- Arrow key navigation between tabs
- Full ARIA tab attributes
- Reduced manual state management
- More accessible to screen readers

---

#### **ScrollTabSection.tsx**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/apps/cms/ScrollTabSection.tsx`

**Current Implementation:** Static tab list, no tab switching

**Pattern:**
```tsx
// Static tab buttons rendered from TABS array (lines 52-60)
// No state management, first tab has variant="primary"
// No functional tab switching
```

**Why It's a Good Candidate:**
- 14 tabs with only first one marked as "primary"
- No tab switching functionality currently
- Perfect for `useTabs` implementation
- Could enable tab switching with content panels

**Refactoring Opportunity:**
- Add `useTabs` hook for full tab functionality
- Add tab panels to show content per tab
- Benefits: Functional tab navigation, keyboard support, ARIA attributes
- Current: Static display without switching capability
- Risk Level: LOW

**Lines of Code to Add:** ~30-50 lines

---

### 4. useModal Candidates

#### **CMSDrawer.tsx**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/apps/cms/CMSDrawer.tsx`

**Current Implementation:** Manual state management via parent prop (onClose callback)

**Pattern:**
```tsx
// Receives onClose as prop
// Overlay component with position="fixed" (line 20)
// Close button calls onClose (line 60)
```

**Why It's a Good Candidate:**
- Drawer component acts like a modal/dialog
- Uses Overlay component for positioning
- Has close button with onClose callback
- Animation on open (slideInRight)

**Refactoring Opportunity:**
- Implement `useModal` hook for focus management
- Add keyboard support (Escape to close) via useModal
- Add focus trap to keep focus within drawer
- Benefits: Better accessibility, consistent modal behavior
- Current: Basic drawer without modal accessibility features
- Risk Level: MEDIUM

**Lines of Code to Add:** ~20-30 lines

---

#### **DrawerActivity.tsx / DrawerHeader.tsx / DrawerFooter.tsx**
**Path:** `/Users/user/Desktop/minimal-design-kit/src/apps/crm/drawer/`

**Current Implementation:** Drawer container doesn't use useModal

**Pattern:**
```tsx
// CRMDrawer.tsx uses Jotai atoms for open/close state
// No focus management or keyboard handling in drawer
```

**Why It's a Good Candidate:**
- CRMDrawer acts as a modal/drawer (positioned absolutely on right)
- Receives close handler via atoms
- Could benefit from useModal for proper modal behavior
- Currently missing: Focus trap, scroll lock, Escape key handling

**Refactoring Opportunity:**
- Wrap CRMDrawer with `useModal` hook
- Provides: Focus trap, scroll lock, Escape key handling
- Benefits: Better accessibility, improved UX
- Current: Basic drawer without modal features
- Risk Level: MEDIUM

**Lines of Code to Add:** ~30-40 lines

---

## Summary Table

| Component | File | Hook | Current Pattern | Priority | Risk | Effort |
|-----------|------|------|-----------------|----------|------|--------|
| PropertySection | CRM Drawer | useAccordion | useState + manual toggle | Medium | Low | 1 day |
| PropertyTree | Inspector | useAccordion | Recursive useState | Medium | Medium | 2-3 days |
| FAQBoardFooter | CMS | useAccordion | Multiple useState instances | High | Low | 1 day |
| ExpandableValue | CRM Drawer | useAccordion | useState<Set\> + toggle | Medium | Medium | 1-2 days |
| PropertiesPanel Tabs | Components | useTabs | useState + conditional styling | High | Low | 1 day |
| ScrollTabSection | CMS | useTabs | Static tabs (add functionality) | Medium | Low | 1 day |
| PropertiesPanel Dropdowns | Components | useDropdown | No dropdowns (add functionality) | Low | Medium | 2-3 days |
| CRMSidebar Workspace | CRM | useDropdown | Simple button (could enhance) | Low | Low | 1 day |
| CMSDrawer | CMS | useModal | Manual onClose prop | Medium | Medium | 1-2 days |
| CRMDrawer | CRM | useModal | Atom-based state | Medium | Medium | 1-2 days |

---

## Quick Win Refactoring Opportunities (HIGH PRIORITY)

### 1. FAQBoardFooter.tsx → useAccordion (1 DAY)
- **File:** `/Users/user/Desktop/minimal-design-kit/src/apps/cms/FAQBoardFooter.tsx`
- **Change:** Move FAQRow state to parent component using useAccordion
- **Current Code:** Lines 108-151 (FAQRow component with useState)
- **Benefit:** Cleaner state management, consistent accordion behavior
- **Impact:** Improves FAQs accessibility with keyboard support

### 2. PropertiesPanel Tabs → useTabs (1 DAY)
- **File:** `/Users/user/Desktop/minimal-design-kit/src/components/PropertiesPanel.tsx`
- **Change:** Replace manual useState(activeTab) with useTabs hook
- **Current Code:** Lines 143, 180-204
- **Benefit:** Arrow key navigation, automatic ARIA attributes
- **Impact:** Better keyboard navigation for design panel

### 3. PropertySection → useAccordion (1 DAY)
- **File:** `/Users/user/Desktop/minimal-design-kit/src/apps/crm/drawer/PropertySection.tsx`
- **Change:** Replace useState with useAccordion for single item
- **Current Code:** Lines 25-107
- **Benefit:** Consistent with DrawerProperties implementation
- **Impact:** Standardized accordion behavior across CRM

---

## Implementation Notes

### For useAccordion Refactoring:
1. Each collapsible section needs a unique ID
2. Group IDs into array for hook initialization
3. Use `allowMultiple: true` for multi-expand, `false` for single-expand
4. Spread `getItemProps(id)` on trigger element
5. Spread `getPanelProps(id)` on content element
6. Hook provides: `expanded` state, `onToggle` handler, ARIA attributes, keyboard support

### For useTabs Refactoring:
1. Define tab IDs array
2. Initialize hook with `tabs`, `defaultTab`, `onChange`
3. Spread `getTabListProps()` on tab container
4. Spread `getTabProps(tabId)` on individual tabs
5. Spread `getTabPanelProps(tabId)` on panels
6. Hook provides: tab selection state, ARIA attributes, keyboard navigation

### For useDropdown Integration:
1. Define items array
2. Implement `itemToString` for display
3. Use `getToggleButtonProps()` on button
4. Use `getMenuProps()` on menu container
5. Use `getItemProps(item)` on each menu item
6. Hook provides: filtering, highlighting, keyboard navigation

### For useModal Integration:
1. Track open/close state at parent level
2. Pass `open` and `onClose` to hook
3. Spread returned props on dialog, backdrop, title, description
4. Hook provides: focus trap, scroll lock, Escape handling, focus restoration

---

## Files NOT Requiring Changes

### Properly State-Managed Components:
1. **CRMSidebar.tsx** - Uses Jotai atoms for selection (correct pattern)
2. **MailSidebar.tsx** - Uses Jotai atoms for folder selection (correct pattern)
3. **MailList.tsx** - Uses Jotai atoms for thread selection (correct pattern)
4. **MailDetail.tsx** - Reads Jotai atoms (correct pattern)

### Presentation-Only Components:
1. **SlidesPanel.tsx** - Static list, no state needed
2. **BodyContentSection.tsx** - Static content, no state needed
3. **FeatureGridSection.tsx** - Static cards, no state needed

---

## Recommendations

### Phase 1 (Week 1) - Quick Wins
1. **FAQBoardFooter** → useAccordion
2. **PropertiesPanel** → useTabs
3. **PropertySection** → useAccordion

**Expected Impact:** 3 components refactored, improved accessibility, reduced code complexity

### Phase 2 (Week 2) - Medium Priority
1. **PropertyTree** → useAccordion (with ID generation strategy)
2. **ExpandableValue** → useAccordion
3. **CMSDrawer** → useModal (for focus management)

**Expected Impact:** Better tree navigation, improved drawer accessibility

### Phase 3 (Week 3) - Optional Enhancements
1. **PropertiesPanel** → Add useDropdown for interactive dropdowns
2. **ScrollTabSection** → Add tab functionality with useTabs
3. **CRMDrawer** → useModal for full modal behavior

**Expected Impact:** More functional UI, better interactive patterns

### Phase 4 (Future) - Long-term
1. Monitor for additional accordion/dropdown/tabs/modal patterns
2. Consider custom hook for tree expansions (PropertyTree pattern)
3. Build compound component wrappers around headless hooks for reusability

---

## Code Quality Improvements

### Accessibility Enhancements
- **Keyboard Navigation:** All candidates gain arrow key support
- **Screen Reader Support:** ARIA attributes automatically added
- **Focus Management:** Modal hooks provide focus traps
- **Escape Key Handling:** Built into useModal and useDropdown

### Developer Experience
- **Prop Getters:** Cleaner API than manual onClick handlers
- **State Management:** Centralized state vs scattered useState calls
- **Type Safety:** Full TypeScript support with exported types
- **Composability:** Hooks can be combined for complex patterns

### Performance Considerations
- **Controlled Components:** Optional controlled mode for advanced use cases
- **Memoization:** Prop getters use useCallback for stable references
- **Set Operations:** Efficient state updates using Sets (especially useAccordion)

---

## Conclusion

The codebase is well-positioned for headless hook integration. With **9 strong candidates** identified across accordion, tabs, dropdown, and modal patterns, the refactoring effort will significantly improve:

1. **Accessibility** - ARIA attributes, keyboard navigation
2. **Developer Experience** - Cleaner prop-getter API
3. **Code Maintainability** - Centralized state management
4. **Feature Consistency** - Standardized interactive patterns

**Recommended Start:** FAQBoardFooter (1 day) → PropertiesPanel (1 day) → PropertySection (1 day)

**Total Effort Estimate:** 10-15 developer days for full implementation across all components.

