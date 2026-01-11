# IDDL Usage Guide

## Introduction
The **Intent-Driven Design Language (IDDL)** utility generates Tailwind CSS classes based on semantic intents rather than visual values.

## Usage

```tsx
import { iddl } from '@/shared/iddl';

// 1. Basic Action (Button)
<button className={iddl({ 
  role: 'Button', 
  intent: 'Brand', 
  prominence: 'Hero' 
})}>
  Save Changes
</button>

// 2. Critical Action
<button className={iddl({ 
  role: 'Button', 
  intent: 'Critical', 
  prominence: 'Standard' 
})}>
  Delete Account
</button>

// 3. Text Typography
<h1 className={iddl({ 
  role: 'Text', 
  spec: { role: 'Title' } 
})}>
  Page Title
</h1>
```

## The 5 Axes

1. **Role**: `Button` | `Text` | `Container`
2. **Intent**: `Brand` | `Critical` | `Neutral` | `Positive` | `Caution` | `Info`
3. **Prominence**: `Hero` | `Standard` | `Subtle`
4. **Density**: `Compact` | `Standard`
5. **Spec**: Specific variant overrides (e.g. `variant: 'outline'`).

## Customization

The binding logic is located in `src/shared/iddl/resolve.ts`.
Token definitions are in `src/shared/iddl/tokens.ts`.
