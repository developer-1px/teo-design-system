# Minimal Design Kit Feedback - IDE Implementation

During the implementation of the VS Code-like IDE interface using the Minimal Design Kit, several observations and potential areas for enhancement were identified.

## 1. Missing "Split View" / Resizable Layouts
**Observation:**
VS Code relies heavily on resizable panes (Sidebar width, detailed editor groups, terminal height).
**Constraint:**
The current `Frame` component supports variable widths and flex layouts, but does not provide a native way to handle user-resizable splitters.
**Recommendation:**
Add a `SplitPane` or `ResizableFrame` component that handles drag-events to adjust sibling widths/heights, maintaining the kit's "frame" philosophy.

## 2. Advanced Tree/List Component
**Observation:**
The File Explorer requires a nested tree structure with expand/collapse animations, selection states, and indentation.
**Constraint:**
I had to manually compose `Action` and `Frame` loops to create the tree. This leads to boilerplate for common hierarchical data.
**Recommendation:**
Introduce a `Tree` primitive or a `List` component that supports virtualized rendering and nesting, optimized for "dense" UI like an IDE sidebar.

## 3. Syntax Highlighting & Code Blocks
**Observation:**
The `Text` component works for simple text, but simulating a code editor required standard HTML spans with hardcoded colors.
**Constraint:**
No dedicated component for displaying code with syntax highlighting themes that match the design system's tokens.
**Recommendation:**
A `CodeBlock` component that accepts a language and content, effectively applying the kit's color tokens to syntax elements.

## 4. Custom Scrollbars
**Observation:**
The native browser scrollbars can clash with the "premium" dark mode aesthetic of an IDE.
**Constraint:**
`overflow="auto"` on `Frame` uses native bars.
**Recommendation:**
Expose a high-level prop or CSS utility in `tokens.css` to style scrollbars (width, track color, thumb color) matching the `surface` tokens.

## 5. Tab Management
**Observation:**
Editor tabs are a specific UI pattern (active state, dirty state, close button, drag handle).
**Constraint:**
Built manually using `Frame` and `Action`.
**Recommendation:**
A `Tabs` compound component (e.g., `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`) would standardize this common navigation pattern.

## 6. Icon Standardization
**Observation:**
I used `lucide-react` directly.
**Constraint:**
While flexible, ensuring consistent stroke widths and sizing across the app involves manual prop passing.
**Recommendation:**
Consider re-exporting a curated set of icons or a wrapper that enforces the design system's sizing logic automatically.

## General Design Kit Assessment
The kit is surprisingly robust. The `Frame` + `Action` combination covers 90% of UI needs. The "surface" system (`surface={1}`, `surface={2}`) made handling dark mode depth very intuitive. The layout constraints (`padding="1 2"`) felt restrictive at first but resulted in a very consistent, disciplined grid that mimics the professional feel of VS Code effectively.
