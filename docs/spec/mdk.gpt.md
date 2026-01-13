좋아.
아래는 **기술 홈페이지 / 디자인 시스템 문서 첫 페이지에 그대로 실어도 되는 Introduce**야.
톤은 **설명보다 선언**, **기능보다 철학**, **읽히기보다 이해되게** 맞췄어.

---

# MDK Surface System

### A Meaning-Driven Layout Architecture

---

## Why another layout system?

Most layout systems describe **how things look**.

* background
* border
* shadow
* elevation
* position

These primitives are useful, but they don’t answer a more important question:

> **Why does this exist?**

Why is this area separated?
Why is this element floating?
Why is there a line here — and not there?

When a system cannot answer these questions,
design decisions become arbitrary.

MDK Surface System starts from a different assumption.

---

## The core principle

> **There is no meaningless design.
> Every visual distinction exists for a reason.**

Surface, line, shadow, spacing —
these are not decorative tools.
They are **signals of intent**.

MDK groups visual primitives by **why they exist**,
not by how they are implemented.

---

## From primitives to intention

Instead of treating background, border, and shadow as separate tools,
MDK unifies them into a single conceptual unit:

### **Surface**

A surface represents **the intention to distinguish**.

Whether that distinction is created by color, depth, or contrast
is a secondary concern.

What matters is **why this area is different from its surroundings**.

---

## The five surface intentions

MDK defines exactly five surface types.

No more. No less.

| Surface             | Intention                     |
| ------------------- | ----------------------------- |
| **surface-base**    | Neutral canvas                |
| **surface-sunken**  | Inset, contained area         |
| **surface-raised**  | Independent information block |
| **surface-primary** | Primary action or emphasis    |
| **surface-overlay** | Removed from the base flow    |

Each surface exists to answer a specific question.
If you cannot explain that reason, the surface should not exist.

---

## Layout is not just space — it’s structure

Visual separation happens in two fundamentally different ways:

1. **By changing the surface**
2. **By drawing a boundary**

MDK makes this distinction explicit.

---

## Frame vs Section

### **Frame**

A **Frame** is a container that owns a Surface.

> A Frame says:
> **“This is a different block.”**

* It always has a surface
* It may be rounded or sharp
* It represents an independent unit

Cards, panels, modals, and containers are Frames.

---

### **Section**

A **Section** divides content **within the same surface**.

> A Section says:
> **“This is a different part of the same block.”**

* It does not own a surface
* It is defined by dividers
* It exists only inside a Frame

Settings groups, table headers, and content partitions are Sections.

---

## Divider as an intentional tool

Lines are not decoration.

In MDK, dividers are explicit, intentional components.

### Divider variants

* **Space** — separation by distance
* **Dot** — lightweight inline separation
* **Line** — explicit visual boundary

A divider exists only when **a relationship must be clarified**.

---

## Overlay: leaving the base flow

Some UI elements do not belong to the normal layout flow.

Modals, sticky headers, floating panels, tooltips —
they are different in implementation, but identical in intention.

MDK unifies them under a single concept:

### **Overlay**

> An Overlay is a container that exists **above the base layout flow**,
> and contains Frames and Sections within it.

Overlay is not a component type.
It is not a positioning mode.
It is a **layout intention**.

---

## Conceptual hierarchy

MDK Surface System is organized by responsibility, not implementation.

```
Overlay
 ├─ Frame
 │   ├─ Surface
 │   └─ Rounded (yes / no)
 └─ Section
     └─ Divider (space / dot / line)
```

Each level answers a different question:

* **Overlay** — Why is this above the flow?
* **Frame** — Why is this block independent?
* **Section** — Why is this part separated?
* **Surface** — How is the distinction perceived?

---

## What this enables

### For designers

* Fewer arbitrary decisions
* Clear reasoning behind every layout choice
* A shared language to discuss structure

### For engineers

* Fewer ad-hoc layout hacks
* Clear separation of responsibility
* Implementation-agnostic concepts

### For systems and AI

* Deterministic layout reasoning
* No ambiguous primitives
* Predictable composition rules

---

## The philosophy, in one sentence

> **MDK Surface System does not describe how layouts are built.
> It explains why they exist.**

Everything else follows from that.

---

원하면 다음 단계로:

* 이 문서를 **한 장 다이어그램**으로 시각화
* 실제 UI 스크린에 **Frame / Section / Overlay 오버레이 표시**
* Text System과 Surface System을 연결한 **통합 MDK 개요 페이지**

어디까지 가져갈지 말해줘.
