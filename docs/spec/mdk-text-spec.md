알겠습니다.
아래는 **기술 홈페이지에 노출되는 소개 페이지용 문서**로 바로 쓸 수 있게 쓴 글입니다.
(디자인 시스템을 “설명”하지 않고, **왜 필요한지 → 어떻게 쓰는지 → 무엇이 달라지는지** 흐름으로 구성)

---

# MDK Text System

### A Context-First Typography Architecture

---

## Why another text system?

Most typography systems start with **what the text is**.

> Heading, Body, Caption
> H1, H2, H3
> Title, Subtitle, Label

These abstractions worked when screens were simple.
They break down in modern products.

In real interfaces, designers don’t ask:

> *“Is this a heading or a body?”*

They ask:

> *“This is inside a card — what should I use?”*
> *“This is a table cell — which text style applies?”*
> *“This is a button — not content, not prose.”*

MDK Text System is built for that reality.

---

## The core idea

**Text is not defined by meaning.
Text is defined by where it lives.**

MDK replaces role-based typography with a **spatial, context-first model** that aligns design, frontend code, and AI generation.

---

## The hierarchy

MDK text is described using four explicit layers:

```
Experience > Context > Slot > Variant
```

Each layer answers one concrete question.

| Layer          | Question it answers                     |
| -------------- | --------------------------------------- |
| **Experience** | What kind of experience is this screen? |
| **Context**    | Where is this text placed?              |
| **Slot**       | Why does this text exist here?          |
| **Variant**    | How should it look?                     |

No guessing. No interpretation.

---

## Experience

### The world the screen belongs to

**Experience** defines the overall usage expectation of a screen.

It does not style text directly.
It sets the tone, density, and behavioral defaults.

Common experiences include:

* **Application** — product usage, dashboards, IDEs, chats
* **Landing** — marketing and acquisition pages
* **Document** — guides, help, long-form reading

The same text context behaves differently across experiences — intentionally.

---

## Context

### The spatial container of text

Every piece of text belongs to **exactly one context**.

MDK defines **five contexts only** — no more, no less.

| Context   | Purpose                        |
| --------- | ------------------------------ |
| **Prose** | Continuous reading flow        |
| **Card**  | Grouped, scannable information |
| **Field** | User input                     |
| **Table** | Structured comparison          |
| **Menu**  | Selection and actions          |

If you know the context, you already know 80% of the typography decision.

---

## Slot

### The reason text exists

Slots describe **why a text node is there**, not how it looks.

Each context exposes only the slots that are actually needed.

### Prose

* `Title` — introduces a section or document
* `Body` — main readable content
* `Note` — annotations, warnings, footnotes

### Card

* `Title` — what this card is about
* `Desc` — the core summary
* `Note` — metadata or secondary information

### Field

* `Label` — what the input represents
* `Value` — the user-entered value
* `Note` — hints, validation, errors

### Table

* `Head` — column or row headers
* `Cell` — data values

### Menu

* `Item` — a selectable action
* `Group` — logical grouping label

Slots are **finite by design**.
If a new slot feels necessary, it usually means the context is wrong.

---

## Variant

### Controlled differences, not new types

All visual differences live in **variants**, never in new slots or contexts.

Typical variants include:

* **Size** — `s / m / l / xl`
* **Tone** — `application / marketing`
* **Density** — `compact / comfortable`
* **Emphasis** — `normal / strong`
* **Style** — `mono / italic`

Markdown headings, hero titles, compact tables, CTA buttons —
all are handled through variants, not structural changes.

---

## A simple example

Instead of asking:

> *Is this an H2 or an H3?*

MDK asks:

```text
Experience: Application
Context: Prose
Slot: Title
Variant: size=l
```

The decision becomes deterministic.

---

## Buttons, links, and actions

Buttons are **not a special text type**.

They are always:

```text
Context: Menu
Slot: Item
```

Primary buttons, tabs, navigation links, CTAs —
all share the same textual logic.
Differences are expressed through variants.

---

## What this enables

### For designers

* No more “which text style should I pick?”
* Decisions are spatial, not semantic
* Systems scale without collapsing

### For frontend engineers

* Maps cleanly to component APIs
* Aligns with modern compound components
* Reduces naming inconsistencies

### For AI systems

* Deterministic text generation
* Clear constraints
* No role ambiguity

---

## The principle

> **MDK Text System does not describe text.
> It describes where text belongs.**

Once that is fixed, everything else follows.

---

If you want, next we can:

* turn this into a **one-page visual diagram**
* map it to **Figma text styles**
* or export it as **design tokens / JSON schema**

Just tell me where this goes next.
