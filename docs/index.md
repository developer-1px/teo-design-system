# IDDL Specification

> **Intent-Driven Design Language**

**Version**: 1.0 (Part 1 Core Freeze)  
**Last Updated**: 2026-01-10

---

## Quick Reference

| Document | Description |
|----------|-------------|
| [**IDDL 1.0 Specification (Part 1)**](./1-project/iddl-1.0-draft.md) | ⭐ **Official Core Specification** (English) |
| [**IDDL 1.0 Specification (Korean)**](./1-project/iddl-1.0-spec-ko.md) | ⭐ **Official Core Specification** (Korean) |
| [Standard Role Registry](./1-project/iddl-1.0-standard-roles.md) | Standard Dictionary for Section/Block/Element Roles |
| [Developer Guide](./1-project/iddl-1.0-developer-guide-ko.md) | Practical Cheer Sheet for Developers |
| [Renderer Guide](./1-project/iddl-1.0-renderer-guide.md) | Implementation Guide for System Engineers |

---

## The Formula (IDDL 1.0)

All UI nodes are defined by **5 Axes**:

```tsx
<Node role="Function" intent="Meaning" prominence="Weight" density="Scale" spec={...}>
  {Content}
</Node>
```

**5 Axes**:
1.  **Role**: "What is this?" (e.g., `Header`, `Card`, `Button`)
2.  **Intent**: "Semantic Context" (`Neutral`, `Brand`, `Critical`...)
3.  **Prominence**: "Visual Weight" (`Hero`, `Standard`, `Subtle`)
4.  **Density**: "Physical Scale" (`Standard`, `Comfortable`, `Compact`)
5.  **Spec**: "Role Parameters" (e.g., `{ columns: 3 }` for Grid)

---

## Core Hierarchy

```
Page (Root)
 ├─ Section (Layout Layer) - Header, Main, Sidebar...
 └─ Block (Component Layer) - Card, Form, List, Toolbar...
     ├─ Block (Nested)
     └─ Element (Content Layer) - Text, Image, Field, Action...
```

**Rule**:
*   **Page** contains only **Sections**.
*   **Section** contains only **Blocks**.
*   **Block** contains **Blocks** or **Elements**.
*   **Element** is a leaf node.

---

## Archive (Legacy)

Documents in `./2-areas/` and `./4-archive/` may describe older versions (v4.0, v4.1).
Please refer to the **IDDL 1.0** documents in `./1-project/` for the latest "Part 1 Core Freeze" standards.

*   [Legacy v1.0.1 Spec](./2-areas/spec/iddl-spec-1.0.1.md) (Deprecated)
*   [Legacy Component Map](./2-areas/core/3-reference/component-role-mapping.md) (See Standard Role Registry)
