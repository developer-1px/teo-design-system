# IDDL Field Specification

**Draft Community Group Report, 11 January 2026**

---

## Abstract

This specification defines the Field element for the Intent-Driven Design Language (IDDL). Field represents user input controls in a declarative, intent-focused manner, abstracting away implementation details while ensuring consistent behavior across renderers.

IDDL is a **superset of WAI-ARIA**. All ARIA roles are valid IDDL roles with identical semantics. IDDL extends ARIA with additional roles required for modern application development.

---

## Status of This Document

This document is a **Working Draft**. It is inappropriate to cite this document as other than work in progress.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [ARIA Compatibility](#2-aria-compatibility)
3. [Conformance](#3-conformance)
4. [Terminology](#4-terminology)
5. [Field Categories](#5-field-categories)
6. [Field Roles](#6-field-roles)
7. [Common Properties](#7-common-properties)
8. [The `spec` Property](#8-the-spec-property)
9. [Renderer Requirements](#9-renderer-requirements)
10. [Accessibility Considerations](#10-accessibility-considerations)
11. [Examples](#11-examples)

---

## 1. Introduction

### 1.1 Background

Modern frontend development requires numerous specialized input libraries to compensate for the limitations of native HTML form controls. Developers routinely integrate separate packages for:

- Input masking and formatting
- Date/time selection with calendar UI
- Searchable, async-loading select controls
- Drag-and-drop file uploads
- Range sliders with dual handles
- Color pickers with format conversion
- OTP/PIN code inputs
- Signature capture
- And many more...

Each library introduces its own API, styling approach, and behavioral patterns, leading to inconsistent user experiences and increased maintenance burden.

### 1.2 Design Goals

The IDDL Field specification aims to:

1. **Unify** diverse input patterns under a single declarative model
2. **Abstract** implementation details while preserving semantic intent
3. **Minimize** the vocabulary developers must learn
4. **Enable** renderer autonomy in visual and behavioral implementation
5. **Ensure** accessibility by design through ARIA alignment

### 1.3 Scope

This specification covers:

- Classification of field roles by interaction pattern
- Required and optional properties for each field role
- The `spec` property schema for role-specific parameters
- Conformance requirements for IDDL renderers

This specification does NOT cover:

- Visual styling or theming
- Specific UI component implementations
- Form-level validation logic (see IDDL Part 2)
- Data binding mechanisms (see IDDL Part 2)

---

## 2. ARIA Compatibility

### 2.1 IDDL as ARIA Superset

IDDL is designed as a **superset of WAI-ARIA (Accessible Rich Internet Applications)**.

This means:

1. **All ARIA roles are valid IDDL roles** with identical semantics
2. **IDDL extends ARIA** with additional roles for modern application needs
3. **Accessibility is built-in**, not an afterthought

### 2.2 Design Principle: Role-Based Declaration

Both ARIA and IDDL share the same foundational principle:

> **Declare what an element IS, not how it LOOKS.**

- ARIA: Provides semantic meaning to assistive technologies
- IDDL: Provides semantic intent to renderers AND assistive technologies

By aligning with ARIA, IDDL ensures that:

- Intent declaration automatically produces accessible output
- Developers learn one concept (`role`) that works everywhere
- Renderers can map IDDL roles directly to ARIA roles

### 2.3 Naming Convention

| Source | Convention | Example |
|--------|------------|---------|
| ARIA | lowercase | `textbox`, `combobox` |
| IDDL | PascalCase | `Textbox`, `Combobox` |

**Rule:** IDDL uses PascalCase for all role values, following component naming conventions. When rendering to HTML, IDDL roles MUST be converted to lowercase ARIA equivalents.

```xml
<!-- IDDL declaration -->
<Field role="Textbox" />

<!-- Rendered HTML -->
<input type="text" role="textbox" />
```

### 2.4 ARIA Role Mapping

#### 2.4.1 Direct Mappings (ARIA → IDDL)

| ARIA role | IDDL role |
|-----------|-----------|
| textbox | Textbox |
| searchbox | Searchbox |
| spinbutton | Spinbutton |
| checkbox | Checkbox |
| switch | Switch |
| radio | Radio |
| combobox | Combobox |
| listbox | Listbox |
| slider | Slider |

#### 2.4.2 IDDL Extensions (No ARIA equivalent)

| IDDL role | Renders as | Description |
|-----------|------------|-------------|
| Datepicker | dialog + grid | Date selection |
| Timepicker | listbox / spinbutton | Time selection |
| Filepicker | button + dialog | File upload |
| Colorpicker | dialog + slider | Color selection |
| Signature | application | Signature capture |
| Otp | group + textbox[] | One-time password |
| Hidden | (none) | Hidden form data |

IDDL extension roles MUST render with appropriate ARIA patterns to maintain accessibility.

---

## 3. Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119].

A conforming IDDL renderer:

1. MUST recognize all field roles defined in this specification
2. MUST map IDDL roles to appropriate ARIA roles when rendering
3. MUST implement the required behaviors for each field category
4. MUST provide custom UI components as specified in Section 9.1
5. SHOULD provide appropriate fallback for unsupported `spec` options
6. MAY extend field roles with renderer-specific capabilities

---

## 4. Terminology

<dl>
<dt>Field</dt>
<dd>An IDDL Element with <code>role</code> attribute indicating user input. Fields are atomic units that cannot contain other Elements.</dd>

<dt>Role</dt>
<dd>A semantic identifier declaring what an element IS and how it should BEHAVE. IDDL roles are a superset of ARIA roles.</dd>

<dt>Field Category</dt>
<dd>A grouping of Field roles by their primary interaction pattern (Input, Choice, Control, Picker, Meta).</dd>

<dt>spec</dt>
<dd>A role-specific property object containing parameters that modify Field behavior without changing its fundamental role.</dd>

<dt>items</dt>
<dd>An array of selectable options. REQUIRED for Choice category fields.</dd>

<dt>Renderer</dt>
<dd>A software component that interprets IDDL declarations and produces a user interface with appropriate ARIA semantics.</dd>
</dl>

---

## 5. Field Categories

Fields are classified into five categories based on their primary interaction pattern.

### 5.1 Category Overview

| Category | Interaction Pattern | Defining Characteristic |
|----------|--------------------|-----------------------|
| **Input** | User types value | Keyboard-driven text entry |
| **Choice** | User selects from options | `items` property REQUIRED |
| **Control** | User manipulates continuous value | Visual manipulation (drag, click) |
| **Picker** | User invokes specialized UI | System or popup interface |
| **Meta** | No direct interaction | Hidden or programmatic |

### 5.2 Category Determination

A field's category is determined by its `role` attribute:

```
Field
├── Input   : Textbox, Searchbox, Spinbutton, Otp
├── Choice  : Checkbox, Switch, Radio, Combobox, Listbox
├── Control : Slider, Colorpicker
├── Picker  : Datepicker, Timepicker, Filepicker, Signature
└── Meta    : Hidden
```

### 5.3 Category Behaviors

#### 5.3.1 Input Category

Input fields MUST:
- Accept keyboard input as primary interaction
- Support standard text editing operations (select, copy, paste)
- Emit value change events on input

Input fields SHOULD:
- Display placeholder text when empty
- Support input masking when `spec.mask` is provided

#### 5.3.2 Choice Category

Choice fields MUST:
- Require the `items` property (except single Checkbox/Switch)
- Render selectable options from `items`
- Track selected state

Choice fields SHOULD:
- Support keyboard navigation through options
- Indicate selected state visually

#### 5.3.3 Control Category

Control fields MUST:
- Operate on a continuous or discrete value range
- Support manipulation via pointer (mouse/touch) interaction

Control fields SHOULD:
- Provide keyboard-accessible value adjustment
- Display current value visually

#### 5.3.4 Picker Category

Picker fields MUST:
- Invoke a specialized interface for value selection
- Return a structured value appropriate to the role

Picker fields SHOULD:
- Support both popup and inline modes where appropriate
- Provide keyboard accessibility for the picker interface

#### 5.3.5 Meta Category

Meta fields MUST:
- Not render visible UI
- Participate in form submission

---

## 6. Field Roles

### 6.1 Input Category Roles

#### 6.1.1 `Textbox`

**ARIA equivalent:** `textbox`

Single-line or multi-line text input.

| spec property | Type | Description |
|---------------|------|-------------|
| `multiline` | boolean | Enable multi-line input (like textarea) |
| `format` | enum | Semantic format: `email`, `password`, `tel`, `url` |
| `mask` | string | Input mask pattern (e.g., `"###-####-####"`) |
| `maxLength` | integer | Maximum character count |
| `rows` | integer | Visible row count (when multiline) |
| `maxRows` | integer | Maximum rows for auto-resize |
| `autoResize` | boolean | Enable automatic height adjustment |
| `showToggle` | boolean | Show visibility toggle (for password) |
| `mentions` | object | Enable @mention functionality |

**Mask Pattern Characters:**
- `#` — Digit (0-9)
- `A` — Letter (A-Z, a-z)
- `*` — Alphanumeric

**mentions object:**
```
{
  trigger: string,      // e.g., "@" or "#"
  data: string | array  // Data source identifier or static array
}
```

#### 6.1.2 `Searchbox`

**ARIA equivalent:** `searchbox`

Text input optimized for search queries.

| spec property | Type | Description |
|---------------|------|-------------|
| `debounce` | integer | Milliseconds to debounce input |
| `minChars` | integer | Minimum characters before emitting search |

**Note:** Use the common `autocomplete` property for search suggestions.

#### 6.1.3 `Spinbutton`

**ARIA equivalent:** `spinbutton`

Numeric input with increment/decrement controls.

| spec property | Type | Description |
|---------------|------|-------------|
| `min` | number | Minimum value |
| `max` | number | Maximum value |
| `step` | number | Increment step |
| `stepper` | boolean | Show increment/decrement controls |
| `format` | enum | Display format: `integer`, `decimal`, `currency`, `percent` |
| `locale` | string | Locale for formatting (e.g., `"ko-KR"`) |
| `precision` | integer | Decimal places |

#### 6.1.4 `Otp`

**IDDL extension** (renders as `group` + multiple `textbox`)

One-time password / PIN code input.

| spec property | Type | Description |
|---------------|------|-------------|
| `length` | integer | Number of digits/characters (REQUIRED) |
| `type` | enum | `numeric`, `alphanumeric` |
| `masked` | boolean | Hide entered characters |
| `autoSubmit` | boolean | Auto-submit when complete |
| `separator` | string | Visual separator pattern (e.g., `"3-3"` for XXX-XXX) |

---

### 6.2 Choice Category Roles

#### 6.2.1 `Checkbox`

**ARIA equivalent:** `checkbox`

Boolean or multi-select control.

| spec property | Type | Description |
|---------------|------|-------------|
| `indeterminate` | boolean | Allow indeterminate (mixed) state |

**Behavior:**
- Without `items`: Single boolean checkbox
- With `items`: Multi-select checkbox group

#### 6.2.2 `Switch`

**ARIA equivalent:** `switch`

Toggle control for on/off states.

| spec property | Type | Description |
|---------------|------|-------------|
| (none) | — | Switch has no additional spec options |

**Note:** Switch is semantically distinct from Checkbox. Use Switch for immediate-effect toggles (e.g., settings), Checkbox for form selections.

#### 6.2.3 `Radio`

**ARIA equivalent:** `radio` (within `radiogroup`)

Single-select from mutually exclusive options.

| spec property | Type | Description |
|---------------|------|-------------|
| `variant` | enum | `default`, `segmented` (segmented control UI) |

`items` is REQUIRED for Radio fields.

#### 6.2.4 `Combobox`

**ARIA equivalent:** `combobox`

Dropdown selection with optional search.

| spec property | Type | Description |
|---------------|------|-------------|
| `multiple` | boolean | Allow multiple selection |
| `searchable` | boolean | Enable search/filter within options |
| `creatable` | boolean | Allow creating new options |
| `clearable` | boolean | Allow clearing selection |
| `async` | object | Async data loading configuration |
| `virtualize` | boolean | Enable virtualization for large lists |
| `cascading` | boolean | Enable cascading/dependent selection |
| `tree` | boolean | Enable tree-structured selection |

**async object:**
```
{
  url: string,          // API endpoint
  debounce: integer,    // Debounce milliseconds
  minChars: integer     // Minimum characters before fetching
}
```

#### 6.2.5 `Listbox`

**ARIA equivalent:** `listbox`

Always-visible selection list.

| spec property | Type | Description |
|---------------|------|-------------|
| `multiple` | boolean | Allow multiple selection |
| `virtualize` | boolean | Enable virtualization for large lists |

---

### 6.3 Control Category Roles

#### 6.3.1 `Slider`

**ARIA equivalent:** `slider`

Slider for selecting numeric value(s).

| spec property | Type | Description |
|---------------|------|-------------|
| `min` | number | Minimum value (default: 0) |
| `max` | number | Maximum value (default: 100) |
| `step` | number | Increment step (default: 1) |
| `dual` | boolean | Enable dual-handle range selection |
| `marks` | array | Tick marks at specific values |
| `orientation` | enum | `horizontal`, `vertical` |
| `variant` | enum | `default`, `rating` (star rating UI) |

**rating variant additional spec:**
```
{
  variant: "rating",
  max: integer,         // Number of stars (default: 5)
  allowHalf: boolean,   // Allow half-star selection
  icon: string          // Custom icon identifier
}
```

#### 6.3.2 `Colorpicker`

**IDDL extension** (renders as `dialog` with custom controls)

Color selection.

| spec property | Type | Description |
|---------------|------|-------------|
| `format` | enum | Output format: `hex`, `rgb`, `hsl`, `hsv` |
| `alpha` | boolean | Enable alpha/transparency |
| `presets` | array | Preset color swatches |
| `variant` | enum | `default`, `compact`, `swatch-only` |

---

### 6.4 Picker Category Roles

#### 6.4.1 `Datepicker`

**IDDL extension** (renders as `dialog` with `grid`)

Date selection with calendar interface.

| spec property | Type | Description |
|---------------|------|-------------|
| `range` | boolean | Enable date range selection |
| `variant` | enum | `date`, `datetime`, `month`, `year`, `week` |
| `min` | string | Minimum selectable date (ISO format) |
| `max` | string | Maximum selectable date (ISO format) |
| `disabled` | array | Disabled dates or date patterns |
| `locale` | string | Locale for display formatting |
| `firstDayOfWeek` | integer | 0 (Sunday) through 6 (Saturday) |

**Note:** Use `variant: "datetime"` for combined date and time selection. Use `Timepicker` for time-only selection.

#### 6.4.2 `Timepicker`

**IDDL extension** (renders as `listbox` or `spinbutton` group)

Time selection.

| spec property | Type | Description |
|---------------|------|-------------|
| `format` | enum | `12h`, `24h` |
| `minuteStep` | integer | Minute increment (default: 1) |
| `secondStep` | integer | Second increment (omit to hide seconds) |
| `min` | string | Minimum time (e.g., `"09:00"`) |
| `max` | string | Maximum time (e.g., `"18:00"`) |

#### 6.4.3 `Filepicker`

**IDDL extension** (renders as `button` triggering file dialog)

File upload.

| spec property | Type | Description |
|---------------|------|-------------|
| `accept` | string | Accepted MIME types (e.g., `"image/*"`) |
| `multiple` | boolean | Allow multiple files |
| `maxSize` | integer | Maximum file size in bytes |
| `maxFiles` | integer | Maximum number of files |
| `dragDrop` | boolean | Enable drag-and-drop zone |
| `preview` | boolean | Show file/image preview |
| `variant` | enum | `default`, `avatar` (circular avatar upload) |

#### 6.4.4 `Signature`

**IDDL extension** (renders as `application` with canvas)

Signature capture.

| spec property | Type | Description |
|---------------|------|-------------|
| `penColor` | string | Stroke color |
| `penWidth` | number | Stroke width |
| `backgroundColor` | string | Canvas background |
| `outputFormat` | enum | `png`, `jpeg`, `svg`, `dataUrl` |
| `trimWhitespace` | boolean | Trim empty space on export |

---

### 6.5 Meta Category Roles

#### 6.5.1 `Hidden`

**IDDL extension** (renders as `<input type="hidden">`)

Non-visible field for form data.

| spec property | Type | Description |
|---------------|------|-------------|
| (none) | — | Hidden fields have no spec options |

---

## 7. Common Properties

All Field elements share the following properties:

### 7.1 Core Properties

| Property | Type | Category | Description |
|----------|------|----------|-------------|
| `role` | string | REQUIRED | Field role identifier (PascalCase) |
| `label` | string | RECOMMENDED | Visible label text |
| `name` | string | Form | Accessible name / form field name |
| `description` | string | A11y | Help text, error message, or tooltip |
| `placeholder` | string | UI | Placeholder text (Input category) |
| `value` | any | Data | Current value (Part 2) |
| `defaultValue` | any | Data | Initial value (Part 2) |
| `disabled` | boolean | State | Disable interaction |
| `readOnly` | boolean | State | Prevent modification |
| `required` | boolean | Validation | Mark as required |
| `intent` | enum | Semantic | Visual intent (Neutral, Critical, etc.) |
| `prominence` | enum | Semantic | Visual prominence level |
| `density` | enum | Layout | Spacing density |
| `spec` | object | Role-specific | Role-specific parameters |
| `items` | array | Choice | Selectable options (Choice category) |

### 7.2 Input Enhancement Properties

The following properties are available for Input and Choice category fields:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `clearable` | boolean | false | Show clear button (×) to reset value |
| `prefix` | string | — | Fixed text/icon before input (e.g., `"$"`, `"@"`) |
| `suffix` | string | — | Fixed text/icon after input (e.g., `".com"`, `"kg"`) |
| `autocomplete` | boolean \| string \| object | — | Autocomplete behavior |

**autocomplete values:**

| Value | Behavior |
|-------|----------|
| `true` | Enable browser autocomplete |
| `false` or `"off"` | Disable autocomplete |
| `string` | HTML autocomplete hint (e.g., `"email"`, `"tel"`, `"address-line1"`) |
| `object` | Custom autocomplete configuration |

**autocomplete object:**
```
{
  data: string | array,   // Data source identifier or static options
  minChars: integer,      // Minimum characters before showing suggestions
  debounce: integer,      // Debounce milliseconds
  highlight: boolean      // Highlight matching text in suggestions
}
```

**Applicability:**

| Property | Input | Choice | Control | Picker | Meta |
|----------|-------|--------|---------|--------|------|
| `clearable` | ✓ | ✓ (Combobox) | — | ✓ (Datepicker, Timepicker) | — |
| `prefix` | ✓ | — | — | — | — |
| `suffix` | ✓ | — | — | — | — |
| `autocomplete` | ✓ | — | — | — | — |

---

## 8. The `spec` Property

### 8.1 Design Principles

The `spec` property follows these principles:

1. **No Presentation** — `spec` MUST NOT contain styling information
2. **No Inheritance** — `spec` values do not cascade to children
3. **No Functions** — `spec` values MUST be serializable (no callbacks)
4. **Role-Specific** — `spec` schema varies by field role
5. **Graceful Degradation** — Unknown properties SHOULD be ignored

### 8.2 Validation

Renderers SHOULD validate `spec` properties against the schema for the given field role. Invalid properties SHOULD be ignored with a warning, not cause errors.

### 8.3 Extension

Renderers MAY support additional `spec` properties beyond those defined in this specification. Such extensions SHOULD be prefixed with the renderer name (e.g., `myrenderer_customProp`).

---

## 9. Renderer Requirements

### 9.1 UI Consistency Requirement

#### 9.1.1 Native Input Limitations

Native HTML input elements have significant limitations that prevent consistent cross-browser and cross-platform user experiences:

| Native Element | Limitations |
|----------------|-------------|
| `<input type="date">` | Inconsistent calendar UI across browsers; virtually unstyled; locale handling varies by OS |
| `<input type="time">` | No standardized picker; AM/PM vs 24h determined by OS locale, not controllable |
| `<input type="color">` | Invokes OS-level color picker; no customization possible |
| `<input type="number">` | Stepper buttons inconsistently styled; spin button behavior varies |
| `<input type="range">` | Track/thumb styling requires vendor prefixes; no marks support |
| `<input type="file">` | Button text unchangeable; no drag-drop; no preview capability |
| `<select>` | Dropdown virtually unstyled; no search; limited option rendering |

Due to these limitations, IDDL renderers MUST NOT rely solely on native HTML inputs for user-facing UI.

#### 9.1.2 Required Custom UI Components

Conforming IDDL renderers MUST provide custom UI implementations for the following field roles to ensure consistent user experience:

| Field Role | Required Component | Key Features |
|------------|-------------------|--------------|
| `Datepicker` | Calendar picker | Consistent calendar grid, keyboard navigation |
| `Timepicker` | Time selector | Spinner, dropdown, or clock interface |
| `Combobox` | Styled dropdown | Keyboard navigation, search support |
| `Filepicker` | Upload zone | Styled button, drag-drop area |
| `Colorpicker` | Color picker panel | Saturation/hue controls, format display |
| `Slider` | Styled slider | Custom track/thumb, marks support |
| `Otp` | Split input boxes | Auto-advance, paste handling |
| `Signature` | Drawing canvas | Stroke capture, clear/undo |

#### 9.1.3 Recommended Custom UI Components

The following field roles SHOULD have custom implementations for better UX:

| Field Role | Recommended Enhancement |
|------------|------------------------|
| `Textbox` | Clearable button, prefix/suffix areas, consistent focus ring |
| `Spinbutton` | Styled stepper buttons, formatted display |
| `Checkbox` | Custom indicator with animation |
| `Switch` | Custom toggle with animation |
| `Radio` | Custom indicator with animation |

#### 9.1.4 Baseline UI Kit

Renderers SHOULD provide a cohesive baseline UI kit including:

1. **Input Container** — Consistent border, background, focus ring, error/success states
2. **Clear Button** — × icon to reset value, consistent positioning
3. **Prefix/Suffix Slot** — Fixed content areas (text, icon, or interactive)
4. **Dropdown Panel** — Positioned overlay with shadow, border, max-height
5. **Calendar Grid** — Month view, day cells, navigation, range highlighting
6. **Time Spinner** — Hour/minute/second columns with scroll or buttons
7. **Slider Track** — Horizontal/vertical track, thumb(s), optional marks
8. **Color Panel** — Saturation area, hue bar, alpha bar, format toggle
9. **File Drop Zone** — Dashed border, hover state, file list with preview
10. **OTP Cell Grid** — Fixed-width cells with focus indication

This baseline ensures users experience consistent interaction patterns regardless of browser, operating system, or device.

### 9.2 Required Role Support

Conforming renderers MUST support:

- All 16 field roles defined in this specification
- The `items` property for Choice category fields
- Basic `spec` properties marked as commonly supported
- Common properties: `clearable`, `prefix`, `suffix`, `autocomplete`

### 9.3 ARIA Mapping Requirement

Renderers MUST:

1. Convert IDDL PascalCase roles to lowercase ARIA roles
2. Apply appropriate ARIA attributes based on field state
3. Generate accessible names from `label` property
4. Associate descriptions using `aria-describedby`

### 9.4 Fallback Behavior

When a renderer cannot fully implement a field role or spec option:

1. The renderer SHOULD render a reasonable fallback
2. The fallback MUST preserve the field's semantic intent
3. The fallback SHOULD allow basic value input
4. The fallback MUST maintain ARIA semantics

**Example Fallbacks:**

| Unsupported | Fallback |
|-------------|----------|
| `Datepicker` with calendar | Native `<input type="date">` with `role="textbox"` |
| `Timepicker` with picker | Native `<input type="time">` |
| `Colorpicker` with picker | Text input accepting hex values |
| `Signature` | File upload for signature image |
| `spec.mask` | Text input without masking |

### 9.5 Feature Detection

Renderers SHOULD provide a mechanism to query supported field roles and spec options.

---

## 10. Accessibility Considerations

### 10.1 General Requirements

All Field implementations MUST:

1. Associate labels with inputs programmatically
2. Provide keyboard accessibility for all interactions
3. Communicate state changes to assistive technologies
4. Support sufficient color contrast

### 10.2 ARIA Role Application

Renderers MUST apply ARIA roles as specified:

| IDDL Role | ARIA Role | Additional ARIA |
|-----------|-----------|-----------------|
| `Textbox` | `textbox` | `aria-multiline` if multiline |
| `Searchbox` | `searchbox` | `aria-autocomplete` |
| `Spinbutton` | `spinbutton` | `aria-valuemin`, `aria-valuemax`, `aria-valuenow` |
| `Checkbox` | `checkbox` | `aria-checked` |
| `Switch` | `switch` | `aria-checked` |
| `Radio` | `radio` (within `radiogroup`) | `aria-checked` |
| `Combobox` | `combobox` | `aria-expanded`, `aria-controls` |
| `Listbox` | `listbox` | `aria-multiselectable` |
| `Slider` | `slider` | `aria-valuemin`, `aria-valuemax`, `aria-valuenow` |
| `Datepicker` | `combobox` or `dialog` | Pattern-dependent |
| `Timepicker` | `combobox` or `listbox` | Pattern-dependent |
| `Colorpicker` | `application` or `dialog` | Custom labeling |
| `Filepicker` | `button` | `aria-label` for upload action |
| `Signature` | `application` | Custom labeling |
| `Otp` | `group` containing `textbox`es | `aria-label` for group |

### 10.3 Error Communication

Field error states MUST be communicated via:

- `aria-invalid="true"` on the input
- `aria-describedby` linking to error message
- Visual indication (not color alone)

---

## 11. Examples

### 11.1 Basic Text Input

```xml
<Field
  role="Textbox"
  label="Full Name"
  name="fullName"
  placeholder="Enter your name"
  required
/>
```

### 11.2 Masked Phone Input

```xml
<Field
  role="Textbox"
  label="Phone Number"
  spec={{
    format: "tel",
    mask: "###-####-####"
  }}
  clearable
/>
```

### 11.3 Email with Suffix

```xml
<Field
  role="Textbox"
  label="Username"
  suffix="@company.com"
  spec={{
    format: "email"
  }}
/>
```

### 11.4 Multi-line Text (Textarea)

```xml
<Field
  role="Textbox"
  label="Description"
  spec={{
    multiline: true,
    rows: 4,
    autoResize: true
  }}
/>
```

### 11.5 Currency Input with Prefix

```xml
<Field
  role="Spinbutton"
  label="Price"
  prefix="₩"
  spec={{
    format: "currency",
    locale: "ko-KR",
    min: 0
  }}
  clearable
/>
```

### 11.6 Searchable Multi-Select

```xml
<Field
  role="Combobox"
  label="Skills"
  items={skills}
  spec={{
    multiple: true,
    searchable: true,
    creatable: true
  }}
/>
```

### 11.7 Date Range Picker

```xml
<Field
  role="Datepicker"
  label="Travel Dates"
  spec={{
    range: true,
    min: "2026-01-01"
  }}
  clearable
/>
```

### 11.8 Time Selection

```xml
<Field
  role="Timepicker"
  label="Appointment Time"
  spec={{
    format: "12h",
    minuteStep: 15,
    min: "09:00",
    max: "17:00"
  }}
/>
```

### 11.9 Star Rating

```xml
<Field
  role="Slider"
  label="Your Rating"
  spec={{
    variant: "rating",
    max: 5,
    allowHalf: true
  }}
/>
```

### 11.10 File Upload with Preview

```xml
<Field
  role="Filepicker"
  label="Profile Photo"
  spec={{
    accept: "image/*",
    preview: true,
    variant: "avatar",
    maxSize: 5242880
  }}
/>
```

### 11.11 OTP Input

```xml
<Field
  role="Otp"
  label="Verification Code"
  spec={{
    length: 6,
    autoSubmit: true
  }}
/>
```

### 11.12 Mentions in Textarea

```xml
<Field
  role="Textbox"
  label="Comment"
  spec={{
    multiline: true,
    autoResize: true,
    mentions: {
      trigger: "@",
      data: "users"
    }
  }}
/>
```

### 11.13 Toggle Switch

```xml
<Field
  role="Switch"
  label="Enable Notifications"
/>
```

### 11.14 Text with Autocomplete

```xml
<Field
  role="Textbox"
  label="City"
  autocomplete={{
    data: "cities",
    minChars: 2,
    debounce: 300,
    highlight: true
  }}
  clearable
/>
```

---

## Appendix A: Field Role Summary

| Role | Category | ARIA | items | Primary Use Case |
|------|----------|------|-------|------------------|
| `Textbox` | Input | ✓ | — | Text input, textarea |
| `Searchbox` | Input | ✓ | — | Search queries |
| `Spinbutton` | Input | ✓ | — | Numeric values, currency |
| `Otp` | Input | — | — | Verification codes |
| `Checkbox` | Choice | ✓ | Optional | Boolean or multi-select |
| `Switch` | Choice | ✓ | — | On/off toggles |
| `Radio` | Choice | ✓ | REQUIRED | Single-select, exclusive |
| `Combobox` | Choice | ✓ | REQUIRED | Dropdown, searchable select |
| `Listbox` | Choice | ✓ | REQUIRED | Always-visible list |
| `Slider` | Control | ✓ | — | Numeric range, rating |
| `Colorpicker` | Control | — | — | Color selection |
| `Datepicker` | Picker | — | — | Date selection |
| `Timepicker` | Picker | — | — | Time selection |
| `Filepicker` | Picker | — | — | File upload |
| `Signature` | Picker | — | — | Signature capture |
| `Hidden` | Meta | — | — | Hidden form data |

---

## Appendix B: ARIA Compatibility Reference

| IDDL Role | ARIA Role | ARIA States/Properties |
|-----------|-----------|------------------------|
| `Textbox` | `textbox` | `aria-multiline`, `aria-readonly`, `aria-required`, `aria-invalid` |
| `Searchbox` | `searchbox` | `aria-autocomplete`, `aria-controls` |
| `Spinbutton` | `spinbutton` | `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` |
| `Checkbox` | `checkbox` | `aria-checked` (true/false/mixed) |
| `Switch` | `switch` | `aria-checked` (true/false) |
| `Radio` | `radio` | `aria-checked`, parent `radiogroup` |
| `Combobox` | `combobox` | `aria-expanded`, `aria-controls`, `aria-activedescendant` |
| `Listbox` | `listbox` | `aria-multiselectable`, `aria-activedescendant` |
| `Slider` | `slider` | `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-orientation` |

---

## Appendix C: References

### Normative References

- [RFC 2119] Key words for use in RFCs to Indicate Requirement Levels
- [WAI-ARIA 1.2] Accessible Rich Internet Applications
- [WCAG 2.1] Web Content Accessibility Guidelines

### Informative References

- [IDDL 1.0 Part 1] Intent & Structure Core
- [IDDL 1.0 Part 2] Data Binding & State (forthcoming)
- [ARIA Authoring Practices Guide] W3C APG Patterns

---

## Appendix D: Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-11 | Draft 0.3 | Changed from `type` to `role`; ARIA superset alignment; PascalCase convention; Switch separated from Checkbox; textarea merged into Textbox with multiline |
| 2026-01-11 | Draft 0.2 | Added `time` type; added `clearable`, `prefix`, `suffix`, `autocomplete` common properties; added Renderer UI Consistency requirements |
| 2026-01-11 | Draft 0.1 | Initial draft |

---

*End of Document*