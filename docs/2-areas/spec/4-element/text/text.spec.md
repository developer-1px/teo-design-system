# IDDL Text Specification

**Draft Community Group Report, 11 January 2026**

---

## Abstract

This specification defines the Text element for the Intent-Driven Design Language (IDDL). Text represents content display in a declarative, intent-focused manner, abstracting away implementation details while ensuring consistent behavior across renderers.

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
5. [Text Categories](#5-text-categories)
6. [Text Roles](#6-text-roles)
7. [Common Properties](#7-common-properties)
8. [The `spec` Property](#8-the-spec-property)
9. [Renderer Requirements](#9-renderer-requirements)
10. [Accessibility Considerations](#10-accessibility-considerations)
11. [Examples](#11-examples)

---

## 1. Introduction

### 1.1 Background

Modern frontend development requires numerous specialized libraries to handle text display beyond simple paragraphs. Developers routinely integrate separate packages for:

- Markdown rendering with syntax highlighting
- Code blocks with language-specific highlighting
- Relative time display ("3 minutes ago")
- Number and currency formatting
- Text truncation with "read more"
- Diff visualization for text comparison
- JSON tree viewers
- Typing animations and effects
- Auto-linking URLs, mentions, and hashtags
- Search result highlighting

Each library introduces its own API, styling approach, and behavioral patterns, leading to inconsistent user experiences and increased maintenance burden.

### 1.2 Design Goals

The IDDL Text specification aims to:

1. **Unify** diverse text display patterns under a single declarative model
2. **Abstract** implementation details while preserving semantic intent
3. **Minimize** the vocabulary developers must learn
4. **Enable** renderer autonomy in visual and behavioral implementation
5. **Ensure** accessibility by design through ARIA alignment

### 1.3 Scope

This specification covers:

- Classification of text roles by display pattern
- Required and optional properties for each text role
- The `spec` property schema for role-specific parameters
- Conformance requirements for IDDL renderers

This specification does NOT cover:

- Visual styling or theming
- Specific UI component implementations
- Rich text editing (see IDDL Field specification)
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

### 2.3 Naming Convention

| Source | Convention | Example |
|--------|------------|---------|
| ARIA | lowercase | `heading`, `link` |
| IDDL | PascalCase | `Heading`, `Link` |

**Rule:** IDDL uses PascalCase for all role values. When rendering to HTML, IDDL roles MUST be converted to lowercase ARIA equivalents or appropriate HTML elements.

### 2.4 ARIA Role Mapping

#### 2.4.1 Direct Mappings (HTML/ARIA → IDDL)

| HTML/ARIA | IDDL Role | Notes |
|-----------|-----------|-------|
| `<h1>`-`<h6>` | `Heading` | Level via `spec.level` |
| `<p>` | `Body` | Default paragraph |
| `<strong>` | `Strong` | Important text |
| `<em>` | `Emphasis` | Emphasized text |
| `<del>` | `Deletion` | Deleted/removed text |
| `<ins>` | `Insertion` | Inserted/added text |
| `<sub>` | `Subscript` | Subscript text |
| `<sup>` | `Superscript` | Superscript text |
| `<mark>` | `Mark` | Highlighted/marked text |
| `<code>` | `Code` | Code snippet |
| `<kbd>` | `Kbd` | Keyboard input |
| `<time>` | `Time` | Date/time display |
| `<a>` / `role="link"` | `Link` | Hyperlink |

#### 2.4.2 IDDL Extensions (No direct HTML equivalent)

| IDDL Role | Renders as | Description |
|-----------|------------|-------------|
| `Title` | `<h1>` or custom | Page/section title |
| `Label` | `<label>` or `<span>` | Form label or descriptor |
| `Caption` | `<figcaption>` or `<span>` | Supporting caption text |
| `Markdown` | Parsed HTML | Markdown content |
| `Number` | `<span>` with formatting | Formatted number/currency |
| `Json` | Interactive tree | JSON data viewer |
| `Diff` | Styled spans | Text difference display |
| `Badge` | `<span>` with styling | Status indicator |

---

## 3. Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119].

A conforming IDDL renderer:

1. MUST recognize all text roles defined in this specification
2. MUST map IDDL roles to appropriate HTML elements and ARIA attributes
3. MUST implement the required behaviors for each text category
4. SHOULD provide appropriate fallback for unsupported `spec` options
5. MAY extend text roles with renderer-specific capabilities

---

## 4. Terminology

<dl>
<dt>Text</dt>
<dd>An IDDL Element with <code>role</code> attribute indicating content display. Text elements are atomic units that cannot contain other Elements (except inline semantic roles).</dd>

<dt>Role</dt>
<dd>A semantic identifier declaring what an element IS and how it should BEHAVE. IDDL roles are a superset of ARIA roles.</dd>

<dt>Text Category</dt>
<dd>A grouping of Text roles by their primary display pattern (Typography, Inline, Rich, Data, Navigation, Indicator).</dd>

<dt>spec</dt>
<dd>A role-specific property object containing parameters that modify Text behavior without changing its fundamental role.</dd>

<dt>content</dt>
<dd>The text string to be displayed. For most roles, this is the primary data.</dd>

<dt>Renderer</dt>
<dd>A software component that interprets IDDL declarations and produces a user interface with appropriate HTML/ARIA semantics.</dd>
</dl>

---

## 5. Text Categories

Text elements are classified into six categories based on their primary display pattern.

### 5.1 Category Overview

| Category | Display Pattern | Defining Characteristic |
|----------|-----------------|------------------------|
| **Typography** | Block-level text | Structural hierarchy (headings, paragraphs) |
| **Inline** | Inline semantic | Text-level semantics within content |
| **Rich** | Parsed/transformed | Content requires parsing (Markdown, Code) |
| **Data** | Formatted display | Dynamic data with formatting (Time, Number) |
| **Navigation** | Interactive | Clickable/actionable text |
| **Indicator** | Status display | Visual status or metadata |

### 5.2 Category Determination

A text's category is determined by its `role` attribute:

```
Text
├── Typography : Title, Heading, Body, Label, Caption
├── Inline     : Strong, Emphasis, Deletion, Insertion, Subscript, Superscript, Mark
├── Rich       : Markdown, Code
├── Data       : Time, Number, Json
├── Navigation : Link
└── Indicator  : Badge, Kbd
```

### 5.3 Category Behaviors

#### 5.3.1 Typography Category

Typography roles MUST:
- Render as block-level elements by default
- Support text alignment via `align` property
- Maintain semantic hierarchy (h1-h6 for headings)

Typography roles SHOULD:
- Support truncation via `spec.truncate`
- Support icons via `icon` property

#### 5.3.2 Inline Category

Inline roles MUST:
- Render as inline elements
- Preserve surrounding text flow
- Map to appropriate HTML semantic elements

Inline roles MAY:
- Be nested within Typography roles

#### 5.3.3 Rich Category

Rich roles MUST:
- Parse and transform input content
- Handle syntax highlighting for code
- Sanitize user-provided content (XSS prevention)

Rich roles SHOULD:
- Support theming for code blocks
- Support plugin extensions for Markdown

#### 5.3.4 Data Category

Data roles MUST:
- Format content according to locale and `spec` options
- Support dynamic updates
- Provide accessible text alternatives

Data roles SHOULD:
- Support animation for numeric changes
- Support interactive features (expand/collapse for JSON)

#### 5.3.5 Navigation Category

Navigation roles MUST:
- Support keyboard activation (Enter key)
- Indicate interactive state (hover, focus)
- Handle navigation behavior

#### 5.3.6 Indicator Category

Indicator roles MUST:
- Render with appropriate visual styling based on `intent`
- Remain non-interactive (except Kbd which is informational)

---

## 6. Text Roles

### 6.1 Typography Category Roles

#### 6.1.1 `Title`

**Renders as:** `<h1>` or styled heading

Primary page or section title. The highest level of content hierarchy.

| spec property | Type | Description |
|---------------|------|-------------|
| `icon` | string | Icon identifier to display before title |
| `truncate` | TruncateSpec | Truncation options |

#### 6.1.2 `Heading`

**Renders as:** `<h1>`-`<h6>` based on level

Section heading with semantic level.

| spec property | Type | Description |
|---------------|------|-------------|
| `level` | 1-6 | Heading level (default: 2) |
| `icon` | string | Icon identifier |
| `anchor` | boolean | Generate anchor link |
| `truncate` | TruncateSpec | Truncation options |

#### 6.1.3 `Body`

**Renders as:** `<p>` or `<div>`

Standard paragraph or body text.

| spec property | Type | Description |
|---------------|------|-------------|
| `truncate` | TruncateSpec | Truncation options |
| `linkify` | boolean \| LinkifySpec | Auto-link URLs, emails, mentions |
| `highlight` | HighlightSpec | Text highlighting |
| `typewriter` | TypewriterSpec | Typing animation |

#### 6.1.4 `Label`

**Renders as:** `<label>` or `<span>`

Form label or descriptor text.

| spec property | Type | Description |
|---------------|------|-------------|
| `for` | string | Associated field ID |
| `required` | boolean | Show required indicator |

#### 6.1.5 `Caption`

**Renders as:** `<figcaption>` or `<span>`

Supporting caption or helper text.

| spec property | Type | Description |
|---------------|------|-------------|
| (none) | — | Caption has no additional spec options |

---

### 6.2 Inline Category Roles

Inline roles are used within Typography content to provide semantic meaning.

#### 6.2.1 `Strong`

**HTML equivalent:** `<strong>`
**ARIA:** implicit strong semantics

Important text that should be rendered with strong importance.

| spec property | Type | Description |
|---------------|------|-------------|
| (none) | — | No additional options |

#### 6.2.2 `Emphasis`

**HTML equivalent:** `<em>`
**ARIA:** implicit emphasis semantics

Stressed emphasis text.

| spec property | Type | Description |
|---------------|------|-------------|
| (none) | — | No additional options |

#### 6.2.3 `Deletion`

**HTML equivalent:** `<del>`
**ARIA:** implicit deletion semantics

Text that has been deleted or removed.

| spec property | Type | Description |
|---------------|------|-------------|
| `cite` | string | URL to source explaining change |
| `datetime` | string | Date/time of deletion (ISO format) |

#### 6.2.4 `Insertion`

**HTML equivalent:** `<ins>`
**ARIA:** implicit insertion semantics

Text that has been inserted or added.

| spec property | Type | Description |
|---------------|------|-------------|
| `cite` | string | URL to source explaining change |
| `datetime` | string | Date/time of insertion (ISO format) |

#### 6.2.5 `Subscript`

**HTML equivalent:** `<sub>`

Subscript text (e.g., chemical formulas H₂O).

| spec property | Type | Description |
|---------------|------|-------------|
| (none) | — | No additional options |

#### 6.2.6 `Superscript`

**HTML equivalent:** `<sup>`

Superscript text (e.g., footnotes¹, exponents x²).

| spec property | Type | Description |
|---------------|------|-------------|
| (none) | — | No additional options |

#### 6.2.7 `Mark`

**HTML equivalent:** `<mark>`

Highlighted or marked text for reference.

| spec property | Type | Description |
|---------------|------|-------------|
| (none) | — | No additional options (use `intent` for color) |

---

### 6.3 Rich Category Roles

#### 6.3.1 `Markdown`

**IDDL extension** (renders as parsed HTML)

Markdown content with optional extensions.

| spec property | Type | Description |
|---------------|------|-------------|
| `flavor` | enum | `commonmark`, `gfm`, `mdx` (default: `gfm`) |
| `allowHtml` | boolean | Allow raw HTML (default: false) |
| `syntaxHighlight` | boolean | Enable code syntax highlighting |
| `linkTarget` | string | Default link target (`_blank`, `_self`) |
| `components` | object | Custom component mappings |

**Supported Markdown Features (GFM):**
- Headings, paragraphs, lists
- Bold, italic, strikethrough
- Links, images
- Code blocks with language
- Tables
- Task lists
- Autolinks

#### 6.3.2 `Code`

**HTML equivalent:** `<code>` or `<pre><code>`
**ARIA:** implicit code semantics

Code display with optional syntax highlighting.

| spec property | Type | Description |
|---------------|------|-------------|
| `language` | string | Programming language for highlighting |
| `inline` | boolean | Inline code (default: false for multiline) |
| `lineNumbers` | boolean | Show line numbers |
| `highlight` | number[] | Lines to highlight |
| `wrap` | boolean | Wrap long lines |
| `maxHeight` | string | Max height with scroll (e.g., `"400px"`) |
| `copyable` | boolean | Show copy button |
| `filename` | string | Display filename header |
| `diff` | boolean | Show as diff (with +/- highlighting) |

**Supported Languages:**
Renderers SHOULD support at minimum: `javascript`, `typescript`, `python`, `java`, `c`, `cpp`, `csharp`, `go`, `rust`, `ruby`, `php`, `swift`, `kotlin`, `sql`, `html`, `css`, `json`, `xml`, `yaml`, `markdown`, `bash`, `shell`.

---

### 6.4 Data Category Roles

#### 6.4.1 `Time`

**HTML equivalent:** `<time>`

Date/time display with formatting options.

| spec property | Type | Description |
|---------------|------|-------------|
| `value` | string \| Date | The datetime value (ISO format or Date) |
| `format` | enum | `relative`, `date`, `time`, `datetime`, `custom` |
| `pattern` | string | Custom format pattern (when format is `custom`) |
| `locale` | string | Locale for formatting (e.g., `"ko-KR"`) |
| `live` | boolean | Auto-update relative time |
| `updateInterval` | number | Update interval in ms (default: 60000) |

**Relative Time Examples:**
- "just now"
- "3 minutes ago"
- "2 hours ago"
- "yesterday"
- "3 days ago"
- "last week"
- "2 months ago"

**Format Patterns (when format is `custom`):**
- `YYYY` - 4 digit year
- `MM` - 2 digit month
- `DD` - 2 digit day
- `HH` - 24 hour
- `mm` - minutes
- `ss` - seconds

#### 6.4.2 `Number`

**IDDL extension** (renders as `<span>`)

Formatted number display with locale support.

| spec property | Type | Description |
|---------------|------|-------------|
| `value` | number | The numeric value |
| `format` | enum | `decimal`, `currency`, `percent`, `unit` |
| `locale` | string | Locale for formatting |
| `currency` | string | Currency code (e.g., `"USD"`, `"KRW"`) |
| `unit` | string | Unit type (e.g., `"kilometer"`, `"byte"`) |
| `notation` | enum | `standard`, `compact`, `scientific`, `engineering` |
| `minimumFractionDigits` | number | Minimum decimal places |
| `maximumFractionDigits` | number | Maximum decimal places |
| `signDisplay` | enum | `auto`, `always`, `exceptZero`, `never` |
| `animate` | AnimateSpec | Animation options for value changes |

**AnimateSpec:**
```typescript
{
  duration?: number;      // Animation duration in ms (default: 1000)
  easing?: string;        // Easing function (default: "easeOut")
  separator?: boolean;    // Animate with separator
  scrollSpy?: boolean;    // Trigger on scroll into view
}
```

#### 6.4.3 `Json`

**IDDL extension** (renders as interactive tree)

JSON data viewer with expand/collapse.

| spec property | Type | Description |
|---------------|------|-------------|
| `value` | object \| string | JSON data or JSON string |
| `collapsed` | boolean \| number | Collapse all or to depth |
| `theme` | string | Color theme (`light`, `dark`, `monokai`, etc.) |
| `displayDataTypes` | boolean | Show data type labels |
| `displayObjectSize` | boolean | Show object/array size |
| `enableClipboard` | boolean | Enable copy to clipboard |
| `editable` | boolean | Enable inline editing |
| `sortKeys` | boolean | Sort object keys alphabetically |
| `quotesOnKeys` | boolean | Show quotes on keys |
| `maxHeight` | string | Max height with scroll |

---

### 6.5 Navigation Category Roles

#### 6.5.1 `Link`

**HTML equivalent:** `<a>`
**ARIA:** `role="link"`

Hyperlink or navigation element.

| spec property | Type | Description |
|---------------|------|-------------|
| `href` | string | Link destination URL |
| `target` | string | Link target (`_blank`, `_self`, etc.) |
| `rel` | string | Link relationship (e.g., `noopener noreferrer`) |
| `download` | boolean \| string | Download attribute |
| `external` | boolean | Show external link indicator |
| `underline` | enum | `always`, `hover`, `none` |

---

### 6.6 Indicator Category Roles

#### 6.6.1 `Badge`

**IDDL extension** (renders as styled `<span>`)

Status indicator or tag.

| spec property | Type | Description |
|---------------|------|-------------|
| `icon` | string | Icon identifier |
| `dot` | boolean | Show as dot indicator only |
| `pulse` | boolean | Animate with pulse effect |
| `removable` | boolean | Show remove button |
| `maxCount` | number | Max count to display (shows `99+`) |

**Note:** Use `intent` property for semantic coloring (Positive, Caution, Critical, etc.)

#### 6.6.2 `Kbd`

**HTML equivalent:** `<kbd>`

Keyboard input display.

| spec property | Type | Description |
|---------------|------|-------------|
| `keys` | string[] | Array of keys (alternative to content) |
| `separator` | string | Key separator (default: `+`) |
| `size` | enum | `small`, `medium`, `large` |

**Example keys:** `["⌘", "Shift", "P"]` → displays as ⌘ + Shift + P

---

## 7. Common Properties

All Text elements share the following properties:

### 7.1 Core Properties

| Property | Type | Category | Description |
|----------|------|----------|-------------|
| `role` | string | REQUIRED | Text role identifier (PascalCase) |
| `content` | string | REQUIRED* | The text content to display |
| `name` | string | A11y | Accessible name override |
| `description` | string | A11y | Accessible description |
| `intent` | enum | Semantic | Visual intent (Neutral, Brand, Positive, Caution, Critical, Info) |
| `prominence` | enum | Semantic | Visual prominence level (Hero, Standard, Subtle, Hidden) |
| `density` | enum | Layout | Spacing density |
| `spec` | object | Role-specific | Role-specific parameters |

*`content` is required for most roles, but some roles use `spec.value` instead (Number, Time, Json).

### 7.2 Typography Properties

Available for Typography category roles:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `align` | enum | `left` | Text alignment: `left`, `center`, `right`, `justify` |
| `icon` | string | — | Icon identifier (displays before text) |
| `iconPosition` | enum | `start` | Icon position: `start`, `end` |

### 7.3 Shared Spec Types

#### 7.3.1 TruncateSpec

```typescript
interface TruncateSpec {
  maxLines?: number;        // Maximum lines before truncation
  maxLength?: number;       // Maximum characters
  ellipsis?: string;        // Ellipsis text (default: "...")
  expandable?: boolean;     // Show "read more" link
  expandText?: string;      // Custom expand text (default: "Read more")
  collapseText?: string;    // Custom collapse text (default: "Show less")
}
```

#### 7.3.2 LinkifySpec

```typescript
interface LinkifySpec {
  urls?: boolean;           // Auto-link URLs (default: true)
  emails?: boolean;         // Auto-link emails (default: true)
  mentions?: boolean | {    // Auto-link @mentions
    format?: (mention: string) => string;  // Format mention URL
  };
  hashtags?: boolean | {    // Auto-link #hashtags
    format?: (hashtag: string) => string;  // Format hashtag URL
  };
  target?: string;          // Link target (default: "_blank")
}
```

#### 7.3.3 HighlightSpec

```typescript
interface HighlightSpec {
  terms?: string[];         // Terms to highlight
  caseSensitive?: boolean;  // Case-sensitive matching (default: false)
  className?: string;       // Custom highlight class
  tag?: string;             // Custom wrapper tag (default: "mark")
}
```

#### 7.3.4 TypewriterSpec

```typescript
interface TypewriterSpec {
  speed?: number;           // Characters per second (default: 50)
  delay?: number;           // Initial delay in ms
  cursor?: boolean;         // Show blinking cursor (default: true)
  cursorChar?: string;      // Cursor character (default: "|")
  loop?: boolean;           // Loop animation
  deleteSpeed?: number;     // Deletion speed (for loop)
  pauseFor?: number;        // Pause duration between loops
}
```

---

## 8. The `spec` Property

### 8.1 Design Principles

The `spec` property follows these principles:

1. **No Presentation** — `spec` MUST NOT contain styling information (colors, sizes, fonts)
2. **No Inheritance** — `spec` values do not cascade to children
3. **No Functions** — `spec` values MUST be serializable (no callbacks)
4. **Role-Specific** — `spec` schema varies by text role
5. **Graceful Degradation** — Unknown properties SHOULD be ignored

### 8.2 Validation

Renderers SHOULD validate `spec` properties against the schema for the given text role. Invalid properties SHOULD be ignored with a warning, not cause errors.

### 8.3 Extension

Renderers MAY support additional `spec` properties beyond those defined in this specification. Such extensions SHOULD be prefixed with the renderer name (e.g., `myrenderer_customProp`).

---

## 9. Renderer Requirements

### 9.1 Custom Component Requirements

Due to the limitations of native HTML elements, IDDL renderers MUST provide custom implementations for:

| Text Role | Required Component | Key Features |
|-----------|-------------------|--------------|
| `Markdown` | Markdown parser | GFM support, XSS prevention, syntax highlighting |
| `Code` | Syntax highlighter | Language detection, line numbers, copy button |
| `Time` | Time formatter | Relative time, live updates, locale support |
| `Number` | Number formatter | Locale-aware, currency, animation |
| `Json` | JSON viewer | Expand/collapse, search, copy |
| `Badge` | Styled indicator | Intent colors, icons, animations |

### 9.2 Required Role Support

Conforming renderers MUST support:

- All 21 text roles defined in this specification
- Basic `spec` properties for each role
- Common properties: `align`, `icon`, `truncate`

### 9.3 Markdown Renderer Requirements

Markdown renderers MUST:

1. Support CommonMark and GFM (GitHub Flavored Markdown) syntax
2. Sanitize HTML to prevent XSS attacks
3. Support custom component mapping
4. Generate accessible markup (proper heading hierarchy, alt text)

### 9.4 Code Highlighting Requirements

Code renderers MUST:

1. Support at least 20 common programming languages
2. Provide consistent theming across languages
3. Support line numbers and line highlighting
4. Generate accessible markup

### 9.5 Fallback Behavior

When a renderer cannot fully implement a text role or spec option:

1. The renderer SHOULD render reasonable fallback content
2. The fallback MUST preserve the text's semantic meaning
3. The fallback MUST maintain accessibility

**Example Fallbacks:**

| Unsupported | Fallback |
|-------------|----------|
| `Markdown` parsing | Display raw text |
| `Code` highlighting | Plain `<pre><code>` |
| `Time` relative format | Display ISO date string |
| `Number` formatting | Display raw number |
| `Json` tree view | Pretty-printed `<pre>` |
| `typewriter` animation | Static text |

---

## 10. Accessibility Considerations

### 10.1 General Requirements

All Text implementations MUST:

1. Use semantic HTML elements where appropriate
2. Provide sufficient color contrast
3. Support screen reader announcements
4. Not rely solely on color for meaning

### 10.2 Role-Specific Accessibility

| IDDL Role | HTML Element | ARIA Considerations |
|-----------|--------------|---------------------|
| `Title` | `<h1>` | Document should have one |
| `Heading` | `<h1>`-`<h6>` | Maintain hierarchy |
| `Body` | `<p>` | — |
| `Strong` | `<strong>` | Conveys importance to AT |
| `Emphasis` | `<em>` | Conveys stress to AT |
| `Deletion` | `<del>` | Announced as deleted |
| `Insertion` | `<ins>` | Announced as inserted |
| `Mark` | `<mark>` | May need `role="mark"` polyfill |
| `Code` | `<code>` | Consider `aria-label` for context |
| `Time` | `<time>` | Use `datetime` attribute |
| `Link` | `<a>` | Distinguish from buttons |
| `Badge` | `<span>` | Add `aria-label` for icon-only |
| `Kbd` | `<kbd>` | Consider `aria-keyshortcuts` |

### 10.3 Live Regions

For dynamic content updates:

- `Time` with `spec.live`: Use `aria-live="polite"`
- `Number` with animation: Avoid announcing intermediate values
- `Badge` count changes: Use `aria-live` appropriately

### 10.4 Truncation Accessibility

When using `spec.truncate`:

- Full text MUST be accessible (via `aria-label` or expandable)
- "Read more" links MUST have descriptive text
- Expanded state changes MUST be announced

---

## 11. Examples

### 11.1 Basic Typography

```xml
<Text role="Title" content="Welcome to IDDL" />

<Text role="Heading" content="Getting Started" spec={{ level: 2 }} />

<Text
  role="Body"
  content="IDDL is a declarative language for describing user interfaces."
/>

<Text role="Caption" content="Last updated: January 2026" intent="Subtle" />
```

### 11.2 Inline Semantics

```xml
<Text role="Body">
  This is <Text role="Strong" content="important" /> and this is
  <Text role="Emphasis" content="emphasized" />.
</Text>

<Text role="Body">
  Water is H<Text role="Subscript" content="2" />O.
  E = mc<Text role="Superscript" content="2" />.
</Text>

<Text role="Body">
  The meeting was <Text role="Deletion" content="Monday" /> 
  <Text role="Insertion" content="Tuesday" />.
</Text>
```

### 11.3 Markdown Content

```xml
<Text
  role="Markdown"
  content={`
# Welcome

This is **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`javascript
const hello = "world";
\`\`\`
  `}
  spec={{
    flavor: "gfm",
    syntaxHighlight: true
  }}
/>
```

### 11.4 Code Block

```xml
<Text
  role="Code"
  content={`function greet(name) {
  return \`Hello, \${name}!\`;
}`}
  spec={{
    language: "javascript",
    lineNumbers: true,
    highlight: [2],
    copyable: true,
    filename: "greet.js"
  }}
/>
```

### 11.5 Relative Time

```xml
<Text
  role="Time"
  spec={{
    value: "2026-01-11T10:30:00Z",
    format: "relative",
    live: true
  }}
/>
<!-- Renders: "3 minutes ago" and updates automatically -->

<Text
  role="Time"
  spec={{
    value: "2026-01-11",
    format: "date",
    locale: "ko-KR"
  }}
/>
<!-- Renders: "2026년 1월 11일" -->
```

### 11.6 Formatted Numbers

```xml
<Text
  role="Number"
  spec={{
    value: 1234567.89,
    format: "currency",
    currency: "KRW",
    locale: "ko-KR"
  }}
/>
<!-- Renders: "₩1,234,568" -->

<Text
  role="Number"
  spec={{
    value: 0.156,
    format: "percent",
    minimumFractionDigits: 1
  }}
/>
<!-- Renders: "15.6%" -->

<Text
  role="Number"
  spec={{
    value: 1500000,
    notation: "compact",
    locale: "en-US"
  }}
/>
<!-- Renders: "1.5M" -->

<Text
  role="Number"
  spec={{
    value: 99,
    animate: {
      duration: 2000,
      scrollSpy: true
    }
  }}
/>
<!-- Animates from 0 to 99 when scrolled into view -->
```

### 11.7 JSON Viewer

```xml
<Text
  role="Json"
  spec={{
    value: {
      name: "IDDL",
      version: "1.0",
      features: ["declarative", "accessible", "flexible"]
    },
    collapsed: 1,
    theme: "monokai",
    enableClipboard: true
  }}
/>
```

### 11.8 Links

```xml
<Text
  role="Link"
  content="Documentation"
  spec={{
    href: "https://iddl.dev/docs",
    target: "_blank",
    external: true
  }}
/>
<!-- Renders with external link icon -->

<Text
  role="Link"
  content="Download PDF"
  spec={{
    href: "/report.pdf",
    download: "annual-report.pdf"
  }}
  icon="download"
/>
```

### 11.9 Badges

```xml
<Text role="Badge" content="New" intent="Positive" />

<Text role="Badge" content="3" intent="Critical" spec={{ pulse: true }} />

<Text
  role="Badge"
  content="Pro"
  intent="Brand"
  spec={{ icon: "star" }}
/>

<Text
  role="Badge"
  spec={{ dot: true }}
  intent="Positive"
/>
<!-- Renders as green dot indicator -->
```

### 11.10 Keyboard Shortcuts

```xml
<Text
  role="Kbd"
  spec={{
    keys: ["⌘", "K"],
    size: "small"
  }}
/>
<!-- Renders: ⌘ + K -->

<Text role="Kbd" content="Enter" />
<!-- Renders: Enter key indicator -->
```

### 11.11 Text with Truncation

```xml
<Text
  role="Body"
  content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  spec={{
    truncate: {
      maxLines: 2,
      expandable: true,
      expandText: "더 보기",
      collapseText: "접기"
    }
  }}
/>
```

### 11.12 Auto-linking Text

```xml
<Text
  role="Body"
  content="Contact us at hello@example.com or visit https://example.com. Follow @iddl on Twitter!"
  spec={{
    linkify: {
      urls: true,
      emails: true,
      mentions: {
        format: (mention) => `https://twitter.com/${mention}`
      }
    }
  }}
/>
```

### 11.13 Search Highlighting

```xml
<Text
  role="Body"
  content="The quick brown fox jumps over the lazy dog."
  spec={{
    highlight: {
      terms: ["quick", "fox", "dog"],
      caseSensitive: false
    }
  }}
/>
<!-- "quick", "fox", and "dog" are highlighted -->
```

### 11.14 Typing Animation

```xml
<Text
  role="Body"
  content="Welcome to the future of UI development."
  spec={{
    typewriter: {
      speed: 50,
      cursor: true,
      cursorChar: "▌"
    }
  }}
/>
```

---

## Appendix A: Text Role Summary

| Role | Category | HTML | Primary Use Case |
|------|----------|------|------------------|
| `Title` | Typography | `<h1>` | Page title |
| `Heading` | Typography | `<h1>`-`<h6>` | Section heading |
| `Body` | Typography | `<p>` | Paragraph text |
| `Label` | Typography | `<label>` | Form label |
| `Caption` | Typography | `<span>` | Helper text |
| `Strong` | Inline | `<strong>` | Important text |
| `Emphasis` | Inline | `<em>` | Emphasized text |
| `Deletion` | Inline | `<del>` | Deleted text |
| `Insertion` | Inline | `<ins>` | Inserted text |
| `Subscript` | Inline | `<sub>` | Subscript |
| `Superscript` | Inline | `<sup>` | Superscript |
| `Mark` | Inline | `<mark>` | Highlighted text |
| `Markdown` | Rich | Parsed HTML | Markdown content |
| `Code` | Rich | `<code>` | Code display |
| `Time` | Data | `<time>` | Date/time |
| `Number` | Data | `<span>` | Formatted number |
| `Json` | Data | Tree view | JSON display |
| `Link` | Navigation | `<a>` | Hyperlink |
| `Badge` | Indicator | `<span>` | Status indicator |
| `Kbd` | Indicator | `<kbd>` | Keyboard shortcut |

---

## Appendix B: Library Alignment

This specification was informed by analysis of popular npm libraries:

| Feature | Representative Library | Weekly Downloads |
|---------|----------------------|------------------|
| Markdown | react-markdown | 3.5M |
| Syntax Highlight | prism-react-renderer | 2.5M |
| Relative Time | react-timeago, dayjs | 1M+ |
| Number Format | react-number-format | 800K |
| Auto-link | linkifyjs | 3.1M |
| Truncation | react-lines-ellipsis | 150K |
| JSON Viewer | @uiw/react-json-view | 100K+ |
| Typing Animation | react-type-animation | 108K |
| Counter Animation | react-countup | 452K |
| Diff Viewer | react-diff-viewer | 50K |

---

## Appendix C: Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-11 | Draft 0.1 | Initial draft with 21 roles across 6 categories |

---

*End of Document*