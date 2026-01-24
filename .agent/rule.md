# Design Guidelines: Grid & Subgrid Layout System

## Core Philosophy
We are shifting away from arbitrary Flexbox nesting towards a structured **CSS Grid & Subgrid** architecture. This ensures strict alignment of visual "Key Lines" (e.g., labels, input fields, icons) across deeply nested components.

## Rules

### 1. Layout Engine
- **Primary**: Use `display: grid` for all structured layouts.
- **Alignment**: Use `subgrid` to pass column definitions down to children.
- **Flexbox**: Restricted to simple, 1-dimensional "stacking" where valid alignment is not required (e.g., tag lists, pure centering).

### 2. Key Line Consistency
- Define the master grid at the **Container** level (e.g., Panel, Window).
- Child components (Sections, Rows) must align to this master grid.
- **Anti-Pattern**: Do NOT create independent flex layouts for each row requiring width synchronization (e.g., setting `width: 80px` on all labels manually).

### 3. Property Panel Specifics
- **Structure**: The Inspector/Property panel must use a permanent multi-column grid.
  - Example: `[Label] [Input] [Unit/Icon]` or `[Label] [Field-A] [Label] [Field-B]`.
- **Implementation**:
  - Parent: `grid-template-columns: var(--grid-keyline-label) 1fr var(--grid-keyline-action);`
  - Child Row: `grid-column: 1 / -1; display: grid; grid-template-columns: subgrid;`

### 4. Spacing
- Use `gap` controls in Grid instead of margins.
- Vertical rhythm must be consistent.

## Example Code

```css
/* Master Container */
.properties-panel {
  display: grid;
  /* Define the rigid skeleton of the UI */
  grid-template-columns: 80px 1fr 24px; 
  gap: 8px 12px;
}

/* Child Section/Row */
.prop-group {
  /* Span full width of parent */
  grid-column: 1 / -1;
  
  /* Inherit the parent's columns */
  display: grid;
  grid-template-columns: subgrid;
}
```
