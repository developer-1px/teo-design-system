# Intent-Driven Design Language (IDDL) 1.0
## W3C-Style First Public Working Draft 10 January 2026

<dl>
  <dt>This version:</dt>
  <dd><a href="https://iddl.dev/spec/1.0/draft-01">https://iddl.dev/spec/1.0/draft-01</a></dd>
  <dt>Latest published version:</dt>
  <dd><a href="https://iddl.dev/spec/latest">https://iddl.dev/spec/latest</a></dd>
  <dt>Editors:</dt>
  <dd>Teo (Google Deepmind)</dd>
  <dd>Claude (Anthropic)</dd>
  <dd>Antigravity (Google Deepmind)</dd>
</dl>

---

## Abstract

The **Intent-Driven Design Language (IDDL)** is a declarative domain-specific language (DSL) and specification for defining user interfaces based on **semantic intent** and **data structure** rather than visual implementation details. By abstracting the "How" (styles, pixels, specific widgets) into the "Why" (prominence, intent, role), IDDL enables a separation of concerns where developers or AI agents declare the purpose of UI elements, and a renderer application deterministically generates the appropriate platform-specific interface. This specification defines the syntax, data model, component taxonomy, and rendering behavioral requirements for IDDL 1.0.

## Status of This Document

This is the **First Public Working Draft** of the IDDL 1.0 specification. This document describes the core architecture, data model, and normative interfaces for the language. It is produced by the Advanced Agentic Coding working group.

This document is a work in progress. It may be updated, replaced, or obsoleted by other documents at any time.

## Table of Contents

1. [Introduction](#1-introduction)
    1.1 [Problem Statement](#11-problem-statement)
    1.2 [Design Principles](#12-design-principles)
    1.3 [Scope](#13-scope)
2. [Conformance](#2-conformance)
3. [Core Concepts](#3-core-concepts)
    3.1 [The Four Axes of Definition](#31-the-four-axes-of-definition)
    3.2 [Prominence (Visual Hierarchy)](#32-prominence-visual-hierarchy)
    3.3 [Intent (Semantic Meaning)](#33-intent-semantic-meaning)
    3.4 [Role (Functional Identity)](#34-role-functional-identity)
    3.5 [Density (Spatial Relation)](#35-density-spatial-relation)
4. [Document Object Model](#4-document-object-model)
    4.1 [Structure Overview](#41-structure-overview)
    4.2 [Root: Page](#42-root-page)
    4.3 [Layout Layer: Section](#43-layout-layer-section)
    4.4 [Container Layer: Group](#44-container-layer-group)
    4.5 [Interaction Layer: Overlay](#45-interaction-layer-overlay)
    4.6 [Primitives (Items)](#46-primitives-items)
5. [Taxonomy and Semantics](#5-taxonomy-and-semantics)
    5.1 [Section Roles](#51-section-roles)
    5.2 [Group Roles](#52-group-roles)
    5.3 [Item Types and Roles](#53-item-types-and-roles)
6. [Normative Interfaces (TypeScript)](#6-normative-interfaces-typescript)
7. [Behavioral Model](#7-behavioral-model)
    7.1 [Inheritance and Cascading](#71-inheritance-and-cascading)
    7.2 [Selection Model](#72-selection-model)
    7.3 [Conditional Rendering](#73-conditional-rendering)
8. [Rendering Requirements](#8-rendering-requirements)
9. [Accessibility Considerations](#9-accessibility-considerations)

---

## 1. Introduction

Modern user interface development suffers from "Intent Loss," a phenomenon where the original design intent ("this is a dangerous action") is degraded into implementation details ("make this button red") as it passes from designers to developers to code. IDDL solves this by preserving the intent as the primary definition of the UI.

### 1.1 Problem Statement

In traditional imperative UI frameworks, the following issues are prevalent:
*   **Coupling of Style and Logic**: Logic code is cluttered with class names and pixel values.
*   **Inconsistent Semantics**: A "primary" button might be blue in one module and green in another if not strictly policed.
*   **AI Interpretation Ambiguity**: When AI agents generate UI code, they often hallucinate styles or mix incompatible design systems.

### 1.2 Design Principles

IDDL adheres to the following normative principles:

1.  **Intent over Implementation**: Authors MUST declare *what* something is and *why* it is there, not *how* it looks.
2.  **Structure over Style**: The hierarchy and logical grouping of elements takes precedence over their spatial positioning.
3.  **Data-Driven**: The UI structure should reflect the underlying data schema.
4.  **Renderer Autonomy**: The consuming application (Renderer) has full authority over the visual presentation, theme, and platform adaptation.

### 1.3 Scope

This specification covers:
*   The abstract data model of an IDDL document.
*   The set of valid roles, intents, and prominence levels.
*   The rules for attribute inheritance and defaults.
*   The behavior of logical models like Selection.

This specification does **not** cover:
*   The specific CSS values or visual design (e.g., "what shade of blue is Brand intent").
*   The internal implementation of the Renderer (e.g., React vs Vue).

## 2. Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words **"MUST"**, **"MUST NOT"**, **"REQUIRED"**, **"SHALL"**, **"SHALL NOT"**, **"SHOULD"**, **"SHOULD NOT"**, **"RECOMMENDED"**, **"MAY"**, and **"OPTIONAL"** in this document are to be interpreted as described in [RFC2119].

## 3. Core Concepts

### 3.1 The Four Axes of Definition

All IDDL nodes are defined by their position on four axes. A conforming Renderer MUST support these axes.

### 3.2 Prominence (Visual Hierarchy)

Prominence defines the visual weight of an element relative to its siblings.

*   **`Hero`**: The single most important element in a context. MUST be rendered with maximum visual impact (e.g., largest size, full bleed).
*   **`Primary`**: Main content or preferred actions. SHOULD be rendered with solid fills or bold typography.
*   **`Secondary`**: Standard content. RECOMMENDED for the majority of UI elements (outline styles, regular weights).
*   **`Tertiary`**: Supplementary or meta-information. SHOULD be rendered subtly (ghost interactions, muted text).

### 3.3 Intent (Semantic Meaning)

Intent defines the semantic purpose or emotional context of an element. This is orthogonal to Prominence.

*   **`Neutral`**: Default. Standard information.
*   **`Brand`**: Represents the identity of the service.
*   **`Positive`**: Success, completion, or safe states.
*   **`Caution`**: Warnings, pauses, or irreversible but not error states.
*   **`Critical`**: Destructive actions, errors, or danger.
*   **`Info`**: Help, guidance, or auxiliary information.

### 3.4 Role (Functional Identity)

Role defines the functional contract of a component. For example, a Group with role `Toolbar` implies a horizontal layout of Actions, whereas a Group with role `Form` implies a validation context for Fields.

### 3.5 Density (Spatial Relation)

Density defines the tightness of the layout. Unlike Intnet, Density typically cascades down the tree.

*   **`Comfortable`**: Marketing pages, wide tables.
*   **`Standard`**: Default application UI.
*   **`Compact`**: High-density data grids, code editors.

## 4. Document Object Model

The IDDL DOM is a tree structure rooted at a `Page`.

### 4.1 Structure Overview

```text
Page (Root)
 ├── Section (Layout Layer)
 │    └── Group (Logical Container)
 │         ├── Item (Primitive: Text, Field, Action)
 │         └── Group (Nested)
 └── Overlay (Floating Layer)
      └── Group ...
```

### 4.2 Root: Page

The `Page` node represents a discrete view or screen.
*   **MUST** contain `children` of type `Section` or `Overlay`.
*   **MUST** define `title`.
*   **MAY** define `layout` strategy (e.g., `single`, `sidebar`, `dashboard`).

### 4.3 Layout Layer: Section

`Section` nodes represent distinct layout regions mapped to the Page's template.
*   **Roles**: `Container`, `Header`, `Footer`, `Navigator`, `Aside`.
*   Sections constitute the "skeleton" of the page.

### 4.4 Container Layer: Group

`Group` nodes represent logical collections of items.
*   **Roles**: `Form`, `List`, `Grid`, `Card`, `Toolbar`, etc.
*   Groups handle layout direction (`stack`, `inline`) and logical state (loading, error).

### 4.5 Interaction Layer: Overlay

`Overlay` nodes represent content that exists outside the normal document flow.
*   **Roles**: `Dialog`, `Drawer`, `Popover`, `Toast`.
*   **Placement**: Defines anchor points (`center`, `right`, `bottom`).

### 4.6 Primitives (Items)

Primitives are the leaf nodes of the tree.

1.  **Text**: Pure presentation (`Title`, `Body`, `Label`).
2.  **Field**: Data binding and input (`DataType` determines renderer: text, date, select, etc.).
3.  **Action**: Triggers (`Button`, `Link`). Defined by `ActionBehavior` (navigate, command, submit).

## 5. Taxonomy and Semantics

### 5.1 Section Roles

| Role | Semantics | Typical Rendering |
|---|---|---|
| `Header` | Top-level context | Sticky top bar |
| `Navigator` | Global navigation | Sidebar or Tab bar |
| `Container` | Primary content | Central scrollable area |
| `Aside` | Contextual help/tools | Right sidebar |
| `Footer` | Status or meta info | Bottom bar |

### 5.2 Group Roles

| Role | Semantics | Key Behaviors |
|---|---|---|
| `Form` | Data entry context | Validates children Fields on submit |
| `Toolbar` | Action cluster | Inline layout, gap management |
| `List` | Homogeneous items | Stack layout, virtualization candidate |
| `Card` | Discrete content unit | Border/Shadow containment |
| `Tabs` | Mutually exclusive views | Navigation between child Groups |

### 5.3 Item Types and Roles

Items do not have a single 'role' axis but rather specific subtypes.

**Field Types (DataTypes):**
*   `text`, `number`, `email`, `password`, `url`, `tel`
*   `date`, `time`, `datetime`, `daterange`
*   `select`, `multiselect`, `radio`, `checkbox`
*   `richtext`, `markdown`, `code`

**Action Roles (inferred):**
*   Primary actions (Submit, Save) uses `Prominence='Primary'`.
*   Destructive actions (Delete) uses `Intent='Critical'`.

## 6. Normative Interfaces (TypeScript)

The following TypeScript definitions are NORMATIVE. Implementation MUST adhere to these shapes.

```typescript
/**
 * IDDL Normative Type Definitions v1.0
 */

export type Prominence = 'Hero' | 'Standard' | 'Strong' | 'Subtle';
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
export type Density = 'Comfortable' | 'Standard' | 'Compact';

interface BaseNode {
  id?: string;
  prominence?: Prominence; // Default: 'Primary' (Standard)
  intent?: Intent;         // Default: 'Neutral'
  hidden?: boolean;
  condition?: string;      // Expression for conditional rendering
}

// --- Leaf Nodes ---

export interface TextNode extends BaseNode {
  type: 'Text';
  role: 'Title' | 'Body' | 'Label' | 'Caption' | 'Code';
  content: string;
  align?: 'left' | 'center' | 'right';
}

export interface ActionNode extends BaseNode {
  type: 'Action';
  label?: string;
  icon?: string;
  disabled?: boolean | string;
  behavior: 
    | { action: 'command'; command: string; args?: any }
    | { action: 'navigate'; to: string; target?: '_blank' | '_self' }
    | { action: 'submit'; form?: string }
    | { action: 'open'; overlay: string }
    | { action: 'close'; overlay?: string };
}

export interface FieldNode extends BaseNode {
  type: 'Field';
  label: string;
  model: string; // Binding path
  dataType: 
    | 'text' | 'number' | 'boolean' | 'date'
    | 'select' | 'radio' | 'checkbox' 
    | 'textarea' | 'richtext';
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
}

// --- Containers ---

export interface GroupNode extends BaseNode {
  type: 'Group';
  role: 
    | 'Container' | 'Form' | 'Fieldset' | 'Toolbar'
    | 'List' | 'Grid' | 'Table' | 'Card' | 'Tabs';
  children: Array<GroupNode | TextNode | FieldNode | ActionNode>;
  layout?: 'stack' | 'inline' | 'grid';
  density?: Density;
}

export interface SectionNode extends BaseNode {
  type: 'Section';
  role: 'Container' | 'Header' | 'Footer' | 'Navigator' | 'Aside';
  children: GroupNode[];
}

// --- Root ---

export interface PageNode {
  type: 'Page';
  title: string;
  layout?: 'single' | 'sidebar' | 'dashboard' | 'split';
  children: Array<SectionNode | OverlayNode>;
}
```

## 7. Behavioral Model

### 7.1 Inheritance and Cascading

To reduce verbosity, certain properties cascade from parent to child.

1.  **Density**: Explicitly cascades. A `Section` defined as `Compact` implies all children are `Compact` unless overridden.
2.  **Mode (View/Edit)**: Cascades. A `Form` in `view` mode renders all Child Fields as text-only displays.
3.  **Prominence/Intent**: Do **NOT** cascade. A `Critical` Group does not make its children Critical; it implies the container itself is critical (e.g., a red border).

### 7.2 Selection Model

Groups acting as lists (Role `List`, `Grid`, `Table`) MAY support a Selection Model.
*   If a `Group` child has a `value` prop, it is a **Selectable Item**.
*   The parent `Group` manages the selection state (`selectedValues`).
*   Renderers MUST handle standard interaction patterns (Click to select, Shift+Click for range, Cmd+Click for toggle) automatically.

### 7.3 Conditional Rendering

Nodes MAY possess a `condition` property containing a string expression.
*   The Renderer MUST evaluate this expression against the current data context.
*   If falsy, the node MUST NOT be rendered.
*   Supported syntax SHOULD include basic comparison (`==`, `!=`, `>`, `<`) and logical operators (`&&`, `||`, `!`).

## 8. Rendering Requirements

A conforming Renderer:
1.  **MUST** generate semantically correct HTML (e.g., `<button>` for Actions, `<form>` for Form Groups, `<h1-h6>` for Title Texts).
2.  **MUST** ensure accessibility (ARIA attributes) is automatically applied based on Role.
3.  **SHOULD** provide distinct visual treatments for all Intent and Prominence combinations.
4.  **MUST NOT** require CSS injection to function; the IDDL document is the source of truth.

## 9. Accessibility Considerations

IDDL is designed to enforce accessible patterns by default.
*   **Role Mapping**: IDDL Roles map directly to WAI-ARIA Roles (e.g., `Group role="Tabs"` -> `role="tablist"`).
*   **Contrast**: Renderers are responsible for ensuring color combinations generated by Intent/Prominence pairs meet WCAG AA standards.
*   **Focus Management**: Overlay nodes (Dialogs) MUST trap focus and support `Escape` key dismissal.

---
**End of Document**
