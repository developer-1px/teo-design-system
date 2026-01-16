# Designing an AI-Native Design System

This document explores how to structure our 4-Pillar System (Surface, Layout, Sizing, Behavior) specifically to **maximize AI understanding and generation capabilities**.

**The Goal**: A system where the "Pit of Success" is so wide that an LLM naturally falls into it. We want to reduce "Hallucinations" (AI making up props) and increase "Semantic Intent" (AI understanding *why* it's styling something).

---

## Model 1: The "Strict Separation" Model (Context-Free)
The most "computer-science" approach. Attributes are mutually exclusive and purely descriptive.

*   **Philosophy**: "One Prop, One Effect." No magic side effects.
*   **AI Benefit**: Low hallucination rate. If the AI wants padding, it finds `padding`. It behaves exactly like CSS but with restricted tokens.

```tsx
<Frame
  // 1. Layout (Strictly Positioning)
  layout="row" 
  gap="n4" 
  distribute="between" // vs 'justify'
  
  // 2. Surface (Strictly Painting)
  surface="card" 
  
  // 3. Sizing (Strictly Dimensions)
  w="full"
/>
```
*   **Verdict**: Good for **Precision**, bad for **Creativity**. The AI acts like a "translator" from CSS to Props.

---

## Model 2: The "Intent-Based" Model (Semantic)
Grouping by *design intent* rather than mechanics. This leverages the LLM's strength in natural language understanding.

*   **Philosophy**: "Tell me WHAT, not HOW."
*   **AI Benefit**: High semantic match. LLMs understand "This is a prominent card" better than "This has shadow-lg and border-n1".

```tsx
<Frame
  // Intent: "I want a container for a list item"
  role="list-item" 
  prominence="high" // AI infers: shadow, border, lighter background
  
  // Modifiers
  layout="row-center"
/>
```
*   **Verdict**: Excellent for **Generation**. The AI can produce high-quality UI from a simple prompt like "Make a list of users". However, fine-tuning is harder.

---

## Model 3: The "Context-Injection" Model (Recursive)
Props change meaning based on where they are. This mimics how human designers think ("Padding here means 'cell padding' because I'm in a Table").

*   **Philosophy**: "Context dictates default."
*   **AI Benefit**: Efficient tokens. The AI generates minimal code because defaults handle the rest.

```tsx
<Table>
  <Row>
     {/* 'cell' variant automatically implied by being inside Row */}
    <Frame>Content</Frame> 
  </Row>
</Table>
```
*   **Verdict**: Powerful but **High Cognitive Load** for the AI (it must track deep context). Risk of "Context Hallucination" where AI assumes a context that doesn't exist.

---

## The Hybrid Recommendation: "Descriptive Semantics"
To guide the AI best, we should combine **Model 1 (Structure)** with **Model 2 (Intent)**.

### The 4 Pillars for AI
We redefine the pillars not just by what they *do*, but by what question they answer for the AI.

1.  **Layout**: *"How do items relate to each other?"*
    *   **AI Instruction**: "Use `flow` to describe relationship (row, stack, grid)."
    *   **Props**: `flow="stack"`, `gap="connected"` (semantic spacing).

2.  **Surface**: *"What is the texture of this object?"*
    *   **AI Instruction**: "Use `material` to describe physics (glass, card, paper)."
    *   **Props**: `material="glass"`, `elevation="floating"`.

3.  **Sizing**: *"How much space does this claim?"*
    *   **AI Instruction**: "Use relative terms (fill, hug) over absolute pixels."
    *   **Props**: `fit="hug"`, `fill="parent"`.

4.  **Behavior**: *"How does this react?"*
    *   **AI Instruction**: "Describe interactivity."
    *   **Props**: `pressable`, `scrollable`.

### Example AI Prompting Strategy
When we feed this system to an AI, the system prompt becomes:

> "Construct the UI using 4 steps:
> 1. Define the **Structure** (Layout)
> 2. Apply the **Material** (Surface)
> 3. Claim the **Space** (Sizing)
> 4. Add **Life** (Behavior)"

This structured thinking process aligns perfectly with Chain-of-Thought (CoT) prompting.
