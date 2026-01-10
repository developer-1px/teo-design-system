# IDDL Component Showcase Walkthrough

## Overview
This walkthrough introduces the standardized IDDL component showcases and the architectural shift from "Page Templates" to "Page Layouts". All showcases now follow a consistent "Gallery" pattern with `ScrollMenu` navigation and strict IDDL component usage.

## Architecture Change: Page Layouts
We have officially deprecated the `template` prop in favor of the `layout` prop for the `Page` component to better reflect the spatial division of the page.

- **Old (Deprecated)**: `<Page template="studio">`
- **New (Standard)**: `<Page role="Application" layout="Studio">`

The `layout` prop strictly defines the allowed `Section` roles (e.g., `Studio` layout allows `ActivityBar`, `PrimarySidebar`, etc.).

## Standardized Showcases
Visit these routes to explore the capabilities of each IDDL component:

| Component | Route | Description |
| :--- | :--- | :--- |
| **Page** | `/#/page` | Live gallery of all 7 Page Layouts (Single, Studio, HolyGrail, etc.) |
| **Section** | `/#/section` | Visualization of semantic regions (Universal, IDE, Web, Dialog) |
| **Token** | `/#/tokens` | 3-Tier Design Token viewer with search and statistics |
| **Field** | `/#/field` | Comprehensive input gallery with validations and states |
| **Action** | `/#/action` | Button matrix, states, and interactive elements |
| **Text** | `/#/text` | Typography system, intents, and prominences |
| **Group** | `/#/group` | Container patterns (Cards, Lists, Forms, Toolbars) |
| **Overlay** | `/#/overlay` | Dialogs, Drawers, Toasts, and Popovers |

## Design Tokens App (`/#/tokens`)
The Design Tokens app has been completely rebuilt to use the IDDL Studio layout.
- **Sidebar**: Navigate through Primitive, Semantic, and Component token tiers.
- **Search**: Filter tokens by name or value.
- **Statistics**: View distribution of tokens by type and tier.

## Key Implementation Patterns
- **MECE Galleries**: Showcases are designed to be Mutually Exclusive, Collectively Exhaustive.
- **Pure IDDL**: No `div`s or raw HTML/CSS. All UI is built using `Page`, `Section`, `Group`, `Text`, `Action`, `Field`.
- **Minimal Aesthetic**: Uses `Standard` and `Subtle` prominences for a clean, professional look similar to modern UI kits.
