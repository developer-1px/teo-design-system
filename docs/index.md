# IDDL Specification

> **Intent-Driven Design Language - A Taxonomy for UI Components**

**Version**: 1.0.1
**Last Updated**: 2026-01-09

---

## Quick Reference

| Document | Description |
|----------|-------------|
| [Component Taxonomy](./2-areas/core/3-reference/component-role-mapping.md) | Standard naming & classification system for UI components |
| [Field API Reference](./2-areas/core/3-reference/field-reference.md) | Complete spec for Field component (21 data types) |
| [Page API Reference](./2-areas/core/3-reference/page-v2-spec.md) | Complete spec for Page component (layouts & navigation) |

---

## The Formula

All UI elements are defined by a single formula:

```tsx
<Type role="Function" prominence="Weight" intent="Meaning">
  {Content}
</Type>
```

**4 Axes**:
1. **Type** - Structural atom (Page, Section, Overlay, Group, Item)
2. **Role** - Functional purpose (Container, List, Form, Button, Label...)
3. **Prominence** - Visual hierarchy (Hero, Primary, Secondary, Tertiary)
4. **Intent** - Semantic meaning (Neutral, Brand, Positive, Caution, Critical, Info)

---

## Core Concepts

### 1. Type Hierarchy (FSD-like Structure)

```
Page (Root)
 ├─ Section (Layout regions)
 ├─ Overlay (Floating layers)
 └─ Group (Logical containers)
     ├─ Group (Nested)
     └─ Item (Terminals: Action, Text, Field)
```

**Rule**: Items cannot contain Items. Sections cannot contain Sections.

### 2. Role Classification

**Group Roles**: `Container`, `List`, `Grid`, `Form`, `Fieldset`, `Toolbar`, `Inline`, `Tabs`, `Steps`

**Item Roles**:
- **Action**: `Button`, `Link`, `Tab`, `Menuitem`
- **Text**: `Title`, `Body`, `Label`, `Caption`, `Code`
- **Field**: Determined by `dataType` prop (21 types)

### 3. Prominence Levels

| Level | Meaning | Typical Expression |
|-------|---------|-------------------|
| **Hero** | Page protagonist, only one | Largest, with background |
| **Primary** | Main content/action | Solid color, bold font |
| **Secondary** | Supporting, most common | Outline, regular font |
| **Tertiary** | Supplementary, subtle | Ghost, muted color |

### 4. Intent Colors

| Intent | Meaning | Visual Metaphor |
|--------|---------|----------------|
| **Neutral** | Default information | Gray, Black/White |
| **Brand** | Service identity | Brand Color (Blue/Purple) |
| **Positive** | Success, completion | Green |
| **Caution** | Warning, in-progress | Yellow/Orange |
| **Critical** | Danger, error | Red |
| **Info** | Informational help | Blue/Cyan |

---

## Token Constraints

1. **Density**: `Compact` \| `Standard` \| `Comfortable`
2. **Size**: Auto-determined by Prominence + Density (no manual sizing)
3. **Space**: 4px grid system (4, 8, 16, 24...)

---

## Example Usage

### AS-IS (How-based)
> "Blue button with white text and rounded corners, placed at top right."

### TO-BE (IDDL Standard)
> "Header Section with right-aligned Toolbar, containing a Brand-intent Primary Action."

```tsx
<Section role="Header">
  <Group role="Toolbar" align="right">
    <Action prominence="Primary" intent="Brand" label="Save" />
  </Group>
</Section>
```

---

## Archive

Historical documents and extended explanations are available in [4-archive/](./4-archive/).

---

**Philosophy**: "Developers declare **intent**. Systems handle **implementation**."
