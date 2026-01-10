# IDDL Specification

> **Intent-Driven Design Language - A Taxonomy for UI Components**

**Version**: 1.0.1 (Implementation: v4.1)
**Last Updated**: 2026-01-09

---

## Quick Reference

| Document | Description |
|----------|-------------|
| [**IDDL v1.0.1 Specification**](./2-areas/spec/iddl-spec-1.0.1.md) | ⭐ Official IDDL specification |
| [Component Taxonomy](./2-areas/core/3-reference/component-role-mapping.md) | Standard naming & classification system for UI components |
| [Field API Reference](./2-areas/core/3-reference/field-reference.md) | Complete spec for Field component (21 data types) |
| [Page API Reference](./2-areas/core/3-reference/page-v2-spec.md) | Complete spec for Page component (layouts & navigation) |
| [**Section v4.1 Spec**](./2-areas/core/3-reference/section-v4.1-spec.md) | ⭐ NEW: Section role configuration (v4.1) |
| [**Page-Section Overflow Policy**](./2-areas/core/3-reference/page-section-overflow-policy.md) | ⭐ NEW: Scroll behavior responsibility model |

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
    <Action prominence="Standard" intent="Brand" label="Save" />
  </Group>
</Section>
```

---

## What's New in v4.1 (2026-01-09)

### Section Role Configuration 중앙화

IDDL v4.1 구현에서 **Section Role Configuration**을 중앙화했습니다. 이는 스펙 변경이 아닌 구현 최적화입니다.

**핵심 원칙**:
```
Page가 template을 정의하고, template + role 조합이 모든 Section 속성을 결정한다.
```

**주요 변경**:
- ✅ **role-config.ts** 신규 파일: 모든 Section role 속성 중앙 관리
- ✅ **Page 책임 원칙**: Page template + Section role → gridArea, overflow, htmlTag, ariaProps, baseStyles 자동 결정
- ✅ **Overflow 정책 명확화**: Template별 스크롤 동작 정의 (목록 `auto`, 에디터 `hidden`, 고정 영역 `hidden`)
- ✅ **Renderer 단순화**: 외부 주입 방식으로 하드코딩 제거

**문서**:
- [Section v4.1 스펙](./2-areas/core/3-reference/section-v4.1-spec.md) - 전체 스펙
- [Page-Section Overflow 정책](./2-areas/core/3-reference/page-section-overflow-policy.md) - 스크롤 정책
- [IDDL Spec Appendix D](./2-areas/spec/iddl-spec-1.0.1.md#appendix-d-section-v41-implementation-notes-2026-01-09) - 구현 노트

**아카이브**:
- [v4.0 문서](./4-archive/2026-01-09-v4.1-section-role-config/) - 이전 renderer 가이드

---

## Archive

Historical documents and extended explanations are available in [4-archive/](./4-archive/).

---

**Philosophy**: "Developers declare **intent**. Systems handle **implementation**."
