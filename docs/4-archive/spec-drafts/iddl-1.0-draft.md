# IDDL 1.0 — Part 1: Intent & Structure Core

**Status:** Draft (Core Freeze Candidate)  
**Target:** Renderer Implementers, Validator Implementers, Authoring Tool Developers  
**Date:** 2026-01-10  

---

## 1. Abstract

IDDL (Intent-Driven Design Language) is a declarative specification for describing UI based on **Intent** and **Structure**, rather than **Implementation**.

The core objectives of IDDL are:

*   **Maximizing Renderer (Design System) Autonomy**: The same IDDL document must be transformable not just in color but also in **wireframe layout and structure** to fit the brand/product UI language.
*   **Preserving Intent**: Even with transformations, the **semantic meaning (Intent/Prominence/Density)** conveyed by the author must be preserved.

This document (Part 1) defines the "Core" of IDDL, focusing purely on **Intent, Structure, and Renderer Autonomy**.  
Data binding, conditional expressions, and state models are defined in **Part 2**.

---

## 2. Conformance Terminology

The keywords "MUST", "MUST NOT", "SHOULD", and "MAY" in this document are to be interpreted as described in RFC 2119.

---

## 3. Core Philosophy

### 3.1 Intent over Implementation
IDDL describes UI by meaning, such as "Critical Action", rather than "Red Button".

### 3.2 Strict Structure
IDDL uses a **strict hierarchical structure** to ensure stability in understanding, validating, and generating UI.

### 3.3 Renderer Autonomy with Intent Preservation
Renderers MAY reinterpret **structure, patterns, and layout** to fit their brand. However, they MUST preserve the **semantic effect of the Intent Axes** defined by IDDL.

---

## 4. Scope

### 4.1 Included in Part 1
*   Hierarchy Model: Page / Section / Block / Element (6 types)
*   5 Axes: Role / Intent / Prominence / Density / Spec
*   Renderer Autonomy and Intent Preservation Norms
*   TSX-based Type Interfaces (Normalized)

### 4.2 Excluded (Scheduled for Part 2)
*   Data Binding (Read/Write standards, Expressions)
*   Conditional Rendering (`condition`) syntax and execution model
*   State Standards (loading, error, disabled, invalid, etc.)
*   Command Execution/Permission/Security Models

---

## 5. Hierarchy Model

### 5.1 Node Types
An IDDL document is a Tree structure, where each node is one of the following:

*   **Page**: Root unit for a document or route.
*   **Section**: Top-level physical partition of the screen.
*   **Block**: Semantic component unit or layout container.
*   **Element**: Leaf unit representing actual content/interaction.

### 5.2 Normative Child Rules
Validators and Renderers MUST enforce the following rules:

1.  **Page children MUST be Sections.**
2.  **Section children MUST be Blocks.**
3.  **Block children MUST be Blocks or Elements.**
4.  **Elements MUST NOT have children** (except for Text content).

> **Note**: These rules prioritize **predictability** as an Intent/Structure language over the freedom of arbitrary nesting like HTML.

---

## 6. The 5 Axes of Definition

All nodes (Section/Block/Element) MAY be defined by the following 5 Axes. (Role may be MUST for certain nodes).

1.  **Role**: "What is this?"
2.  **Intent**: "What is the semantic context?"
3.  **Prominence**: "How important is this?"
4.  **Density**: "How dense is the interface?"
5.  **Spec**: "Role-dependent parameters to establish/concretize the Role."

---

## 7. Axes Definitions

### 7.1 Role
Role indicates the functional identity of the node. Renderers MAY use Role to select patterns/structures.

*   **Section Role (MUST)**: `Header`, `Footer`, `Main`, `Sidebar`, `Drawer`, `Modal`
*   **Block Role (MAY)**: `Form`, `Card`, `List`, `Toolbar`, `Menu`, `Grid`, etc.
*   **Element (6 Types)**: `Text`, `Image`, `Video`, `Field`, `Action`, `Separator`

### 7.2 Intent
Indicates semantic context.

*   **Values**: `Neutral`, `Brand`, `Positive`, `Caution`, `Critical`, `Info`

### 7.3 Prominence
Indicates importance/weight.

*   **Values**: `Hero`, `Standard`, `Subtle`, `Hidden`

#### Minimum Normative Meaning of Hidden
*   Nodes marked `Hidden` MUST NOT be displayed in the UI visible to the user.
*   Technical implementation (removal vs visual hiding) MAY vary by Renderer policy.

### 7.4 Density
Determines the physical density (spacing/target size/rhythm) of the UI.

*   **Values**: `Standard`, `Comfortable`, `Compact`
*   **Core Meaning**:
    *   `Standard`: Default density.
    *   `Comfortable`: Spacious (Enhanced readability/touch targets).
    *   `Compact`: Dense (Suitable for data-heavy/expert interfaces).

> **Note**: Pixel values and token mappings are the responsibility of the Renderer.

### 7.5 Spec (Role Specification)

#### 7.5.1 Definition
`spec` is a set of **role-dependent parameters** required to establish or concretize the node's `role`.

#### 7.5.2 Role-Dependence
The schema of `spec` (required/optional fields, types) MUST be determined by the `role`.

#### 7.5.3 Data Constraints
*   `spec` MUST be **Plain Data** (Serializable).
*   It MUST NOT contain functions, class instances, or runtime handles/references.

#### 7.5.4 Prohibition of Presentation Parameters
*   `spec` MUST NOT be used to directly describe presentation (CSS/Pixels/Colors/Fonts).
*   It MUST aim to provide "Minimum Parameters required for Pattern establishment".

#### 7.5.5 Inheritance
`spec` MUST NOT be inherited.

> **Note**: Allowing spec inheritance/merging complicates the core as rules would vary by role. It is prohibited in Part 1 Core.

---

## 8. Element Taxonomy

IDDL represents UI leaves using only these 6 Elements.

### 8.1 Text
*   Role: `Title`, `Heading`, `Body`, `Label`, `Caption`
*   Props(Part 1): `content?: string`, `align?`, `icon?`

### 8.2 Image
*   Props: `src: string`, `alt: string`
*   Options: `aspectRatio?`, `fit?`

### 8.3 Video
*   Props: `src: string`
*   Options: `poster?`, `autoplay?`, `loop?`, `controls?`

### 8.4 Field
*   Props: `label: string`, `model: string`, `type: FieldType`, `required?`, `disabled?`
*   **Note**: `model` indicates "input location", but binding standards are defined in Part 2.

### 8.5 Action
*   Props: `label: string`, `icon?`, `behavior?`
*   **Note**: behaviors define structure only; execution/permissions are Part 2 scope.

### 8.6 Separator
*   Props: `type?`, `size?`, `orientation?`, `content?`
*   Purpose: Logical separation and layout flattening.

---

## 9. Renderer Autonomy and Intent Preservation

### 9.1 Permitted Transformations (Autonomy)
Renderers MAY:
*   Transform Role/Spec into internal Design System patterns (including component shape changes).
*   Reconfigure layout/wireframes.
*   Apply brand-specific minimal styles or component style variations.

### 9.2 Preservation Obligation
Renderers MUST NOT compromise the semantic effect of the following Axes:
*   `Intent`
*   `Prominence`
*   `Density`

### 9.3 Functional Meaning Preservation
Renderers MUST NOT alter the following functional meanings:
*   The type of action implied by Action `behavior.type`.
*   The meaning of input controls implied by Field (type/required/disabled).

---

## 10. Default Mappings (Developer-Friendly Core)

Part 1 aims to enable "Minimum UI Development without Design". To achieve this:
*   Renderers SHOULD provide reasonable default mappings (Pattern/Default Layout) for each Role.

> **Note**: This guarantees a minimum developer experience where "An IDDL document produces a basic screen". The details of 'basic' are Renderer policy.

---

## 11. Normative TSX Interfaces (Part 1)

```ts
// --- Axes ---
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
export type Prominence = 'Hero' | 'Standard' | 'Subtle' | 'Hidden';
export type Density = 'Standard' | 'Comfortable' | 'Compact';

// spec is role-dependent plain data
export type Spec = Record<string, unknown>;

// --- Base Props (Part 1 Core) ---
interface BaseProps {
  intent?: Intent;
  prominence?: Prominence;
  density?: Density;
  spec?: Spec;
}

// Page
export interface PageProps {
  title?: string;
}

// Section
export type SectionRole = 'Header' | 'Footer' | 'Main' | 'Sidebar' | 'Drawer' | 'Modal';
export interface SectionProps extends BaseProps {
  role: SectionRole;
}

// Block
export type BlockRole = 'Form' | 'Card' | 'List' | 'Toolbar' | 'Menu' | 'Grid';
export interface BlockProps extends BaseProps {
  role?: BlockRole; // Layout-only Blocks may omit role
}

// Elements
export interface TextProps extends BaseProps {
  role: 'Title' | 'Heading' | 'Body' | 'Label' | 'Caption';
  content?: string;
  align?: 'left' | 'center' | 'right';
  icon?: string;
}

export interface ImageProps extends BaseProps {
  src: string;
  alt: string;
  aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3';
  fit?: 'cover' | 'contain';
}

export interface VideoProps extends BaseProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export type FieldType =
  | 'text' | 'number' | 'email' | 'password'
  | 'select' | 'date' | 'checkbox' | 'radio';

export interface FieldProps extends BaseProps {
  label: string;
  model: string;
  type: FieldType;
  options?: Array<{ label: string; value: any }>;
  required?: boolean;
  disabled?: boolean;
}

export type ActionBehavior =
  | { type: 'submit' }
  | { type: 'navigate'; to: string; target?: string }
  | { type: 'command'; id: string; params?: any }
  | { type: 'open'; target: string };

export interface ActionProps extends BaseProps {
  label: string;
  icon?: string;
  behavior?: ActionBehavior;
}

export interface SeparatorProps extends BaseProps {
  type?: 'line' | 'space';
  size?: 'small' | 'medium' | 'large';
  orientation?: 'horizontal' | 'vertical';
  content?: string;
}
```

---

## 12. Examples (Informative)

> Data binding is defined in Part 2, so examples use literals.

```tsx
<Page title="Edit Profile">
  <Section role="Header">
    <Block role="Toolbar" density="Standard">
      <Text role="Title" content="Settings" />
      <Action label="Close" behavior={{ type: 'navigate', to: '/home' }} prominence="Subtle" />
    </Block>
  </Section>

  <Section role="Main" density="Comfortable">
    <Block role="Card">
      <Text role="Heading" content="Profile" />
      <Separator type="line" />

      <Block role="Form" density="Standard">
        <Field label="Nickname" model="user.nickname" type="text" required />
        <Field label="Bio" model="user.bio" type="text" />
        <Separator type="space" size="medium" />
        <Field label="opt-in" model="user.optIn" type="checkbox" />
      </Block>

      <Separator type="space" size="large" />

      <Action label="Save" intent="Brand" prominence="Hero" behavior={{ type: 'submit' }} />
      <Action label="Delete" intent="Critical" prominence="Subtle" behavior={{ type: 'command', id: 'deleteAccount' }} />
    </Block>
  </Section>
</Page>
```

---

## 13. Non-Normative Notes

*   Part 1 fixes the "UI Intent/Structure Language" core.
*   Part 2 will deal with "Execution/Data/State" standardization.
*   This separation is an intentional choice to secure developer friendliness without compromising renderer autonomy.
