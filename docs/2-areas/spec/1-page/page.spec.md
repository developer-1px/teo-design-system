# IDDL Page Specification

**Draft Community Group Report, 11 January 2026**

---

## Abstract

This specification defines the Page element for the Intent-Driven Design Language (IDDL). Page represents the root container of an application or document, declaring the physical behavior of the viewport and the spatial organization of content regions.

Unlike traditional CSS frameworks that focus on visual styling, IDDL Page defines **what the page IS** (Application, Document, Focus, etc.) and **how content should be organized** (Single column, Sidebar, Studio layout, etc.), letting renderers determine the optimal visual presentation.

---

## Status of This Document

This document is a **Working Draft**. It is inappropriate to cite this document as other than work in progress.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [HTML Compatibility](#2-html-compatibility)
3. [Conformance](#3-conformance)
4. [Terminology](#4-terminology)
5. [Page Roles (Physics)](#5-page-roles-physics)
6. [Page Layouts (Zoning)](#6-page-layouts-zoning)
7. [Role × Layout Compatibility](#7-role--layout-compatibility)
8. [Common Properties](#8-common-properties)
9. [Renderer Requirements](#9-renderer-requirements)
10. [Accessibility Considerations](#10-accessibility-considerations)
11. [Examples](#11-examples)
12. [Appendices](#appendices)

---

## 1. Introduction

### 1.1 Background

Modern web applications range from simple documents to complex multi-panel applications. Developers must repeatedly solve the same layout challenges:

- Full-screen application shells (IDE, dashboard, admin panels)
- Scrollable document pages (blog posts, documentation, forms)
- Focused single-action flows (login, payment, onboarding)
- Immersive experiences (landing pages, presentations)
- Print-ready documents (invoices, resumes, reports)

Each use case requires different viewport behaviors, scroll handling, and spatial organization. Current solutions mix CSS frameworks, JavaScript libraries, and custom code, leading to inconsistent implementations and accessibility issues.

### 1.2 Design Goals

The IDDL Page specification aims to:

1. **Separate intent from implementation** — Declare "what" the page is, not "how" it should look
2. **Provide clear semantics** — Page roles correspond to real-world use cases
3. **Enable flexible zoning** — Layout strategies work across different page roles
4. **Ensure accessibility** — Proper HTML landmark structure by default
5. **Support advanced layouts** — Multi-panel applications (IDE, Studio) without custom code

### 1.3 Scope

This specification covers:

- Classification of page roles by viewport behavior (physics)
- Layout strategies for spatial organization (zoning)
- Role × layout compatibility matrix
- Required and optional properties for Page element
- Conformance requirements for IDDL renderers

This specification does NOT cover:

- Visual styling or theming (see IDDL Design Tokens)
- Section-level components (see Section specification)
- Data binding or state management (see IDDL Part 2)
- Responsive breakpoint behavior (renderer implementation detail)

---

## 2. HTML Compatibility

### 2.1 Page as Document Root

Page is the root container element in IDDL. When rendered to HTML, it MUST produce a semantically correct document structure.

### 2.2 HTML Landmark Mapping

Page roles SHOULD map to appropriate HTML semantic elements:

| Page Role | Typical HTML Container | Document Role |
|-----------|----------------------|---------------|
| `Document` | `<main>` or `<article>` | Content-focused page |
| `Application` | `<div role="application">` | Interactive application |
| `Focus` | `<main>` | Task-focused page |
| `Immersive` | `<main>` | Presentation page |
| `Overlay` | `<dialog>` or `<div role="dialog">` | Modal-style page |
| `Paper` | `<main>` | Print document |

### 2.3 CSS Physical Laws

Each Page role defines a set of **physical laws** — CSS properties that govern viewport interaction:

```tsx
// Document: Scrollable content
role="Document" → min-h-screen overflow-y-auto

// Application: Fixed viewport
role="Application" → h-screen overflow-hidden

// Focus: Centered content
role="Focus" → h-screen flex items-center justify-center

// Immersive: Scroll snap
role="Immersive" → h-screen overflow-y-scroll snap-y snap-mandatory

// Overlay: Floating layer
role="Overlay" → fixed inset-0 z-50 bg-black/50

// Paper: Fixed dimensions
role="Paper" → w-[210mm] h-[297mm] bg-white shadow-lg
```

Renderers MUST implement these physical laws consistently.

---

## 3. Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119].

A conforming IDDL renderer:

1. MUST recognize all page roles defined in this specification
2. MUST implement the physical laws for each page role
3. MUST support all layout strategies defined in Section 6
4. MUST validate role × layout compatibility (Section 7)
5. MUST generate proper HTML landmark structure
6. SHOULD support dynamic grid template generation
7. MAY extend page roles with renderer-specific capabilities

---

## 4. Terminology

<dl>
<dt>Page</dt>
<dd>The root container element in IDDL. Represents the entire viewport or a page-level context.</dd>

<dt>Page Role (Physics)</dt>
<dd>A semantic identifier declaring how the page interacts with the browser viewport (scrolling, fixed height, centering, etc.).</dd>

<dt>Page Layout (Zoning)</dt>
<dd>A spatial organization strategy defining how content regions (Sections) are arranged within the page.</dd>

<dt>Section</dt>
<dd>A child of Page representing a semantic region (Header, Main, Sidebar, etc.). See Section specification.</dd>

<dt>Physical Laws</dt>
<dd>A set of CSS properties that define viewport behavior for a given page role.</dd>

<dt>Grid Template</dt>
<dd>CSS Grid layout configuration (grid-template-areas, grid-template-columns, grid-template-rows) generated from layout strategy.</dd>

<dt>Renderer</dt>
<dd>A software component that interprets IDDL declarations and produces a user interface with appropriate HTML semantics.</dd>
</dl>

---

## 5. Page Roles (Physics)

Page roles define **how the page behaves** in relation to the browser viewport.

### 5.1 Role Overview

| Role | Purpose | Scroll Behavior | Viewport Constraint |
|------|---------|-----------------|-------------------|
| `Document` | Content pages | Window scrolls | min-h-screen |
| `Application` | Interactive apps | Container scrolls | h-screen (fixed) |
| `Focus` | Single-task flows | No scroll | h-screen (centered) |
| `Immersive` | Presentations | Scroll snap | h-screen (sections) |
| `Overlay` | Modal pages | Body scroll locked | Fixed overlay |
| `Paper` | Print documents | None | Fixed aspect ratio |

### 5.2 Role Definitions

#### 5.2.1 `Document` (Default)

**Purpose:** Standard web content pages (blog posts, documentation, forms, settings).

**Physical Laws:**
```css
min-h-screen     /* At least full viewport height */
overflow-y-auto  /* Window scrolls vertically */
```

**Characteristics:**
- Content may extend beyond viewport (vertical scroll)
- Supports `maxWidth` constraint for readability
- Supports `centered` option for horizontal centering
- Best for text-heavy, sequential content

**Typical Use Cases:**
- Blog posts, articles
- Documentation pages
- Form wizards
- Settings pages
- Landing pages (with scroll)

#### 5.2.2 `Application`

**Purpose:** Full-screen web applications (IDE, dashboard, admin panels).

**Physical Laws:**
```css
h-screen         /* Fixed viewport height */
w-screen         /* Fixed viewport width */
overflow-hidden  /* No window scroll */
display: grid    /* CSS Grid layout */
```

**Characteristics:**
- Fixed viewport (100vh × 100vw)
- Individual Sections scroll independently
- Requires layout strategy (Studio, Sidebar, etc.)
- Grid-based multi-panel organization

**Typical Use Cases:**
- Code editors (VS Code, IntelliJ)
- Admin dashboards
- Data analysis tools
- Email clients
- Multi-panel applications

#### 5.2.3 `Focus`

**Purpose:** Single-action focused flows (login, payment, confirmation).

**Physical Laws:**
```css
min-h-screen              /* Full viewport height */
display: flex             /* Flexbox layout */
align-items: center       /* Vertical center */
justify-content: center   /* Horizontal center */
```

**Characteristics:**
- Content centered in viewport
- No navigation chrome
- Minimal distractions
- Single primary action

**Typical Use Cases:**
- Login pages
- Payment checkout
- Two-factor authentication
- Confirmation dialogs
- Onboarding steps

#### 5.2.4 `Immersive`

**Purpose:** Immersive experiences with scroll-snapping sections (presentations, storytelling).

**Physical Laws:**
```css
h-screen                  /* Fixed viewport height */
overflow-y-scroll         /* Vertical scroll */
scroll-snap-type: y mandatory  /* Snap to sections */
```

**Characteristics:**
- Full-screen sections
- Scroll snapping between sections
- Presentation-style navigation
- Section-level scrolling

**Typical Use Cases:**
- Landing pages (Apple-style)
- Product showcases
- Presentation mode
- Story-driven experiences
- Portfolio websites

#### 5.2.5 `Overlay`

**Purpose:** Modal-style pages floating above main content (quick views, dialogs).

**Physical Laws:**
```css
position: fixed    /* Fixed positioning */
inset: 0           /* Full viewport coverage */
z-index: 50        /* Above main content */
background: rgba(0, 0, 0, 0.5)  /* Dimmed backdrop */
```

**Characteristics:**
- Floats above main content
- Dimmed background backdrop
- Body scroll locked
- Dismissible overlay

**Typical Use Cases:**
- Quick view overlays
- Lightbox galleries
- Full-screen modals
- Drawer pages
- Interstitial pages

#### 5.2.6 `Paper`

**Purpose:** Print-ready documents with fixed aspect ratios (invoices, resumes, PDFs).

**Physical Laws:**
```css
width: 210mm       /* A4 width (or 8.5in for Letter) */
min-height: 297mm  /* A4 height (or 11in for Letter) */
background: white  /* Print background */
box-shadow: large  /* Paper shadow */
```

**Characteristics:**
- Fixed physical dimensions
- Print-optimized styles
- Page break support
- PDF export ready

**Typical Use Cases:**
- Invoices
- Resumes / CVs
- Contracts
- Reports
- Certificates

---

## 6. Page Layouts (Zoning)

Page layouts define **how content regions are spatially organized** within the page.

### 6.1 Layout Overview

| Layout | Grid Pattern | Section Count | Best For |
|--------|--------------|---------------|----------|
| `Single` | 1-column | 1-3 | Simple pages |
| `Sidebar` | 2-column (nav + main) | 2-4 | Documentation, settings |
| `Aside` | 2-column (main + aside) | 2-4 | Blog posts, articles |
| `HolyGrail` | 3-column (nav + main + aside) | 3-5 | Complex content pages |
| `Mobile` | 1-column + dock | 3-4 | Mobile apps |
| `Split` | 2-column (equal) | 2-4 | Master-detail, comparisons |
| `Studio` | Multi-panel (5-10) | 5-10 | IDE, complex applications |

### 6.2 Layout Definitions

#### 6.2.1 `Single` (Default)

**Pattern:** Vertical stack (Header → Main → Footer)

**Valid Sections:** `Header`, `Main`, `Footer`

**Grid Template:**
```css
grid-template-areas:
  "header"
  "main"
  "footer";
grid-template-columns: 1fr;
grid-template-rows: auto 1fr auto;
```

**Use Cases:**
- Landing pages
- Simple forms
- Focus pages
- Minimal layouts

#### 6.2.2 `Sidebar`

**Pattern:** Left navigation + content

**Valid Sections:** `Header`, `Nav`, `Main`, `Footer`

**Grid Template:**
```css
grid-template-areas:
  "header header"
  "nav    main"
  "footer footer";
grid-template-columns: 288px 1fr;
grid-template-rows: auto 1fr auto;
```

**Use Cases:**
- Documentation sites
- Settings pages
- Admin panels (simple)
- Blog listing pages

#### 6.2.3 `Aside`

**Pattern:** Content + right sidebar

**Valid Sections:** `Header`, `Main`, `Aside`, `Footer`

**Grid Template:**
```css
grid-template-areas:
  "header header"
  "main   aside"
  "footer footer";
grid-template-columns: 1fr 256px;
grid-template-rows: auto 1fr auto;
```

**Use Cases:**
- Blog posts (with related content)
- Article pages (with metadata)
- Product details (with specs)

#### 6.2.4 `HolyGrail`

**Pattern:** Navigation + content + sidebar (3-column)

**Valid Sections:** `Header`, `Nav`, `Main`, `Aside`, `Footer`

**Grid Template:**
```css
grid-template-areas:
  "header header header"
  "nav    main   aside"
  "footer footer footer";
grid-template-columns: 240px 1fr 300px;
grid-template-rows: auto 1fr auto;
```

**Use Cases:**
- Complex content pages
- E-commerce product pages
- News article pages
- Knowledge bases

#### 6.2.5 `Mobile`

**Pattern:** Header + content + bottom dock

**Valid Sections:** `Header`, `Main`, `Footer`, `Dock`

**Grid Template:**
```css
grid-template-areas:
  "header"
  "main"
  "footer"
  "dock";
grid-template-columns: 1fr;
grid-template-rows: auto 1fr auto auto;
```

**Use Cases:**
- Mobile applications
- PWA interfaces
- Tab bar navigation
- Bottom sheet layouts

#### 6.2.6 `Split`

**Pattern:** Two equal panels (Master-Detail or Panel-Panel)

**Valid Sections:** `Header`, `Master`, `Detail`, `Footer`, `Toolbar`

**Grid Template:**
```css
grid-template-areas:
  "header header"
  "panel-a panel-b"
  "footer footer";
grid-template-columns: 1fr 1fr;
grid-template-rows: auto 1fr auto;
```

**Use Cases:**
- Master-detail views
- Side-by-side comparisons
- Code diff viewers
- Split editors

#### 6.2.7 `Studio`

**Pattern:** Multi-panel application (IDE-style)

**Valid Sections:** `Header`, `Toolbar`, `ActivityBar`, `PrimarySidebar`, `Editor`, `SecondarySidebar`, `UtilityBar`, `Status`, `Panel`, `Footer`

**Grid Template:**
```css
grid-template-areas:
  "header header header header header"
  "act    side   main   aux    utility"
  "act    side   panel  aux    utility"
  "stat   stat   stat   stat   stat"
  "footer footer footer footer footer";
grid-template-columns: 48px 250px 1fr 250px 48px;
grid-template-rows: auto 1fr 200px 24px auto;
```

**Use Cases:**
- Code editors (VS Code, IntelliJ)
- Design tools (Figma)
- DAWs (Digital Audio Workstations)
- Video editors
- Complex dashboards

---

## 7. Role × Layout Compatibility

Not all layout strategies are appropriate for every page role.

### 7.1 Compatibility Matrix

| Layout ↓ / Role → | Document | Application | Focus | Immersive | Overlay | Paper |
|-------------------|----------|-------------|-------|-----------|---------|-------|
| **Single**        | ✅ Default | ✅ Simple apps | ✅ Default | ✅ Sections | ✅ Default | ✅ Default |
| **Sidebar**       | ✅ Docs | ✅ Admin | ⚠️ Rare | ❌ No | ⚠️ Rare | ❌ No |
| **Aside**         | ✅ Articles | ⚠️ Rare | ❌ No | ❌ No | ❌ No | ❌ No |
| **HolyGrail**     | ✅ Complex | ⚠️ Rare | ❌ No | ❌ No | ❌ No | ❌ No |
| **Mobile**        | ✅ PWA | ✅ Mobile apps | ⚠️ Tabs | ⚠️ Story | ⚠️ Drawer | ❌ No |
| **Split**         | ⚠️ Rare | ✅ Master-Detail | ❌ No | ❌ No | ⚠️ Compare | ❌ No |
| **Studio**        | ❌ No | ✅ Primary | ❌ No | ❌ No | ❌ No | ❌ No |

**Legend:**
- ✅ Recommended
- ⚠️ Possible but uncommon
- ❌ Not recommended (semantic mismatch)

### 7.2 Validation Rules

Renderers SHOULD warn when incompatible role × layout combinations are used:

```tsx
// ❌ Semantic mismatch
<Page role="Focus" layout="Studio">
  {/* Focus pages should not have complex multi-panel layouts */}
</Page>

// ✅ Correct usage
<Page role="Application" layout="Studio">
  {/* Application role with Studio layout for IDE */}
</Page>

// ✅ Correct usage
<Page role="Document" layout="Sidebar">
  {/* Document role with Sidebar layout for documentation */}
</Page>
```

---

## 8. Common Properties

All Page elements share the following properties:

### 8.1 Core Properties

| Property | Type | Category | Description |
|----------|------|----------|-------------|
| `title` | string | REQUIRED | Page title (browser title, H1) |
| `description` | string | Meta | Page description (subtitle, meta tag) |
| `role` | PageRole | Physics | Viewport behavior (default: `Document`) |
| `layout` | PageLayout | Zoning | Spatial organization (default: `Single`) |
| `maxWidth` | MaxWidth | Constraint | Content max-width (Document role only) |
| `centered` | boolean | Constraint | Center content horizontally (Document/Focus) |
| `prominence` | Prominence | Semantic | Visual prominence level |
| `density` | Density | Semantic | Spacing density |
| `intent` | Intent | Semantic | Semantic intent (Neutral, Critical, etc.) |
| `loading` | boolean | State | Loading state (shows spinner) |
| `error` | string | State | Error state (shows error message) |
| `children` | ReactNode | Slot | Content slot (Section components) |
| `className` | string | Style | Additional CSS classes |
| `onClick` | function | Event | Click event handler |

### 8.2 MaxWidth Values

| Value | CSS Class | Pixels (approx) |
|-------|-----------|-----------------|
| `sm` | max-w-sm | 384px |
| `md` | max-w-md | 448px |
| `lg` | max-w-lg | 512px |
| `xl` | max-w-xl | 576px |
| `2xl` | max-w-2xl | 672px |
| `4xl` | max-w-4xl | 896px |
| `none` | max-w-none | Unlimited |
| number | Custom | Custom pixel value |

**Applicability:** Only valid for `Document` and `Focus` roles.

### 8.3 Property Constraints

#### Document Role Constraints

```tsx
<Page role="Document" maxWidth="lg" centered>
  {/* maxWidth and centered are valid for Document */}
</Page>
```

#### Application Role Constraints

```tsx
<Page role="Application" layout="Studio">
  {/* maxWidth and centered are ignored for Application */}
  {/* layout is REQUIRED for Application */}
</Page>
```

#### Focus Role Constraints

```tsx
<Page role="Focus" centered>
  {/* centered is valid (auto-applied) */}
  {/* layout is typically Single (auto-applied) */}
</Page>
```

---

## 9. Renderer Requirements

### 9.1 Physical Laws Implementation

Renderers MUST implement the CSS physical laws for each page role as specified in Section 5.2.

**Example Implementation:**

```tsx
const pagePhysicsVariants = {
  Document: 'relative min-h-screen w-full overflow-y-auto flex flex-col',
  Application: 'relative h-screen w-screen overflow-hidden grid',
  Focus: 'relative min-h-screen w-full overflow-y-auto flex flex-col items-center justify-center',
  Immersive: 'relative h-screen w-full overflow-y-scroll snap-y snap-mandatory',
  Overlay: 'fixed inset-0 z-50 h-full w-full overflow-y-auto bg-black/50',
  Paper: 'relative mx-auto w-[210mm] min-h-[297mm] overflow-visible shadow-lg bg-white'
};
```

### 9.2 Grid Template Generation

For `Application` role, renderers MUST generate CSS Grid template based on:

1. Layout strategy (Studio, Sidebar, etc.)
2. Child Section roles
3. Section ordering

**Grid Template Generation Algorithm:**

```
1. Analyze children to extract Section roles
2. Lookup layout strategy (Studio, Sidebar, etc.)
3. Validate Section roles against layout's valid sections
4. Generate grid-template-areas from layout pattern
5. Generate grid-template-columns from layout pattern
6. Generate grid-template-rows from layout pattern
```

### 9.3 Section Validation

Renderers SHOULD validate that Section roles match the selected layout:

```tsx
// ✅ Valid: ActivityBar is valid for Studio layout
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
</Page>

// ❌ Invalid: ActivityBar is not valid for Sidebar layout
<Page role="Application" layout="Sidebar">
  <Section role="ActivityBar">...</Section>  {/* Warning */}
</Page>
```

### 9.4 Loading and Error States

Renderers MUST support loading and error states:

**Loading State:**
```tsx
<Page loading={true}>
  {/* Show centered spinner with loading message */}
</Page>
```

**Error State:**
```tsx
<Page error="Failed to load page">
  {/* Show error message with retry option */}
</Page>
```

### 9.5 Dynamic Resizing (Optional)

Renderers MAY support dynamic panel resizing for Application role:

```tsx
<Page role="Application" layout="Studio">
  <Section role="PrimarySidebar" resizable={{ direction: 'horizontal', minSize: 200, maxSize: 400 }}>
    {/* User can resize this panel */}
  </Section>
</Page>
```

---

## 10. Accessibility Considerations

### 10.1 General Requirements

All Page implementations MUST:

1. Provide a meaningful document title via `<title>` element
2. Generate proper HTML landmark structure
3. Support keyboard navigation between sections
4. Communicate loading/error states to screen readers

### 10.2 HTML Landmark Structure

Renderers MUST generate appropriate HTML5 semantic elements:

| Section Role | HTML Element | ARIA Role |
|--------------|--------------|-----------|
| `Header` | `<header>` | `banner` |
| `Nav` | `<nav>` | `navigation` |
| `Main` | `<main>` | `main` |
| `Aside` | `<aside>` | `complementary` |
| `Footer` | `<footer>` | `contentinfo` |
| `Editor` | `<main>` or `<section>` | `main` or `region` |
| `Panel` | `<section>` | `region` |

### 10.3 Skip Links

Document and Application roles SHOULD provide skip links for keyboard navigation:

```html
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### 10.4 ARIA Live Regions

Loading and error states MUST be announced to screen readers:

```tsx
// Loading state
<div role="status" aria-live="polite">
  Loading {title}...
</div>

// Error state
<div role="alert" aria-live="assertive">
  Error: {error}
</div>
```

### 10.5 Focus Management

Application role pages MUST manage focus correctly:

- Focus should be trapped within modal overlays
- Section changes should move focus appropriately
- Keyboard shortcuts should not conflict with browser defaults

---

## 11. Examples

### 11.1 Simple Document Page

```tsx
<Page
  title="User Guide"
  description="Complete guide to using our platform"
  role="Document"
  layout="Single"
  maxWidth="lg"
  centered
>
  <Section role="Header">
    <h1>User Guide</h1>
  </Section>
  <Section role="Main">
    {/* Article content */}
  </Section>
  <Section role="Footer">
    <p>© 2026 Company</p>
  </Section>
</Page>
```

### 11.2 Documentation Site with Sidebar

```tsx
<Page
  title="API Documentation"
  role="Document"
  layout="Sidebar"
>
  <Section role="Header">
    <nav>Logo, Search, Theme Toggle</nav>
  </Section>
  <Section role="Nav">
    <aside>Documentation navigation tree</aside>
  </Section>
  <Section role="Main">
    <article>API reference content</article>
  </Section>
  <Section role="Footer">
    <footer>Links, copyright</footer>
  </Section>
</Page>
```

### 11.3 Blog Post with Sidebar

```tsx
<Page
  title="10 Tips for Better Code"
  description="Practical advice for writing maintainable software"
  role="Document"
  layout="Aside"
  maxWidth="4xl"
>
  <Section role="Header">
    <header>Site header</header>
  </Section>
  <Section role="Main">
    <article>Blog post content</article>
  </Section>
  <Section role="Aside">
    <aside>Related posts, author bio, TOC</aside>
  </Section>
  <Section role="Footer">
    <footer>Comments, footer</footer>
  </Section>
</Page>
```

### 11.4 Login Page (Focus)

```tsx
<Page
  title="Sign In"
  role="Focus"
  layout="Single"
  centered
>
  <Section role="Main">
    <Block role="Form">
      <Field role="Textbox" label="Email" />
      <Field role="Textbox" label="Password" spec={{ format: "password" }} />
      <Action prominence="Primary">Sign In</Action>
    </Block>
  </Section>
</Page>
```

### 11.5 IDE Application (Studio Layout)

```tsx
<Page
  title="Code Editor"
  role="Application"
  layout="Studio"
>
  <Section role="Header">
    <nav>Menu bar</nav>
  </Section>
  <Section role="Toolbar">
    <div>Toolbar buttons</div>
  </Section>
  <Section role="ActivityBar">
    <nav>Icon menu (Files, Search, Git, etc.)</nav>
  </Section>
  <Section role="PrimarySidebar" resizable>
    <div>File tree</div>
  </Section>
  <Section role="Editor">
    <div>Code editor</div>
  </Section>
  <Section role="Panel" resizable>
    <div>Terminal, console, problems</div>
  </Section>
  <Section role="Status">
    <div>Status bar</div>
  </Section>
</Page>
```

### 11.6 Dashboard with HolyGrail Layout

```tsx
<Page
  title="Analytics Dashboard"
  role="Application"
  layout="HolyGrail"
>
  <Section role="Header">
    <header>Dashboard header with filters</header>
  </Section>
  <Section role="Nav">
    <nav>Dashboard navigation menu</nav>
  </Section>
  <Section role="Main">
    <div>Charts and metrics</div>
  </Section>
  <Section role="Aside">
    <aside>Notifications, recent activity</aside>
  </Section>
  <Section role="Footer">
    <footer>Export, settings</footer>
  </Section>
</Page>
```

### 11.7 Master-Detail View (Split Layout)

```tsx
<Page
  title="Email Client"
  role="Application"
  layout="Split"
>
  <Section role="Header">
    <header>Email toolbar</header>
  </Section>
  <Section role="Master">
    <div>Email list (inbox)</div>
  </Section>
  <Section role="Detail">
    <div>Email content viewer</div>
  </Section>
</Page>
```

### 11.8 Landing Page (Immersive)

```tsx
<Page
  title="Welcome to Our Product"
  role="Immersive"
  layout="Single"
>
  <Section role="Main">
    <div className="snap-start">Hero section</div>
    <div className="snap-start">Features section</div>
    <div className="snap-start">Testimonials section</div>
    <div className="snap-start">Pricing section</div>
    <div className="snap-start">CTA section</div>
  </Section>
</Page>
```

### 11.9 Invoice (Paper)

```tsx
<Page
  title="Invoice #2026-001"
  role="Paper"
  layout="Single"
>
  <Section role="Header">
    <header>Company logo, invoice number</header>
  </Section>
  <Section role="Main">
    <table>Invoice line items</table>
  </Section>
  <Section role="Footer">
    <footer>Total, payment terms</footer>
  </Section>
</Page>
```

### 11.10 Modal Overlay Page

```tsx
<Page
  title="Quick View"
  role="Overlay"
  layout="Single"
>
  <Section role="Main">
    <Block role="Card">
      <Text role="Title">Product Details</Text>
      <Text role="Body">Product information...</Text>
      <Action prominence="Primary">Add to Cart</Action>
    </Block>
  </Section>
</Page>
```

---

## Appendices

### Appendix A: Page Role Summary

| Role | Physics | Scroll | Layout Strategies | Primary Use Case |
|------|---------|--------|-------------------|------------------|
| `Document` | min-h-screen, overflow-y-auto | Window scrolls | Single, Sidebar, Aside, HolyGrail | Content pages |
| `Application` | h-screen, overflow-hidden, grid | Container scrolls | Sidebar, Split, Studio | Web applications |
| `Focus` | h-screen, flex center | No scroll | Single | Single-action flows |
| `Immersive` | h-screen, snap-y | Scroll snap | Single, Mobile | Presentations |
| `Overlay` | fixed, z-50, backdrop | Body locked | Single | Modal pages |
| `Paper` | w-[210mm], shadow | None | Single | Print documents |

### Appendix B: Layout Summary

| Layout | Pattern | Columns | Valid Sections | Best For |
|--------|---------|---------|----------------|----------|
| `Single` | 1-col stack | 1 | Header, Main, Footer | Simple pages |
| `Sidebar` | Nav + Main | 2 | Header, Nav, Main, Footer | Documentation |
| `Aside` | Main + Aside | 2 | Header, Main, Aside, Footer | Articles |
| `HolyGrail` | Nav + Main + Aside | 3 | Header, Nav, Main, Aside, Footer | Complex content |
| `Mobile` | Stack + Dock | 1 | Header, Main, Footer, Dock | Mobile apps |
| `Split` | Panel + Panel | 2 | Header, Master, Detail, Footer | Master-detail |
| `Studio` | Multi-panel | 5 | Header, Toolbar, ActivityBar, PrimarySidebar, Editor, Panel, Status, Footer | IDE apps |

### Appendix C: Grid Template Reference

#### Single Layout
```css
grid-template-areas: "header" "main" "footer";
grid-template-columns: 1fr;
grid-template-rows: auto 1fr auto;
```

#### Sidebar Layout
```css
grid-template-areas:
  "header header"
  "nav    main"
  "footer footer";
grid-template-columns: 288px 1fr;
grid-template-rows: auto 1fr auto;
```

#### Aside Layout
```css
grid-template-areas:
  "header header"
  "main   aside"
  "footer footer";
grid-template-columns: 1fr 256px;
grid-template-rows: auto 1fr auto;
```

#### HolyGrail Layout
```css
grid-template-areas:
  "header header header"
  "nav    main   aside"
  "footer footer footer";
grid-template-columns: 240px 1fr 300px;
grid-template-rows: auto 1fr auto;
```

#### Mobile Layout
```css
grid-template-areas: "header" "main" "footer" "dock";
grid-template-columns: 1fr;
grid-template-rows: auto 1fr auto auto;
```

#### Split Layout
```css
grid-template-areas:
  "header header"
  "panel-a panel-b"
  "footer footer";
grid-template-columns: 1fr 1fr;
grid-template-rows: auto 1fr auto;
```

#### Studio Layout
```css
grid-template-areas:
  "header header header header header"
  "act    side   main   aux    utility"
  "act    side   panel  aux    utility"
  "stat   stat   stat   stat   stat"
  "footer footer footer footer footer";
grid-template-columns: 48px 250px 1fr 250px 48px;
grid-template-rows: auto 1fr 200px 24px auto;
```

### Appendix D: References

#### Normative References

- [RFC 2119] Key words for use in RFCs to Indicate Requirement Levels
- [HTML5] HTML Living Standard — Sections and Outlines
- [CSS Grid] CSS Grid Layout Module Level 2
- [WAI-ARIA 1.2] Accessible Rich Internet Applications

#### Informative References

- [IDDL 1.0 Part 1] Intent & Structure Core
- [IDDL Section Specification] Section element specification
- [IDDL Block Specification] Block element specification
- [WCAG 2.1] Web Content Accessibility Guidelines

### Appendix E: Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-11 | Draft 0.1 | Initial W3C-style specification based on field.spec.md structure |

---

*End of Document*
