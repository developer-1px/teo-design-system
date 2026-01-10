# IDE Design System Philosophy

## Core Objective
The primary goal of this project is **not** to build a fully functional IDE features (like actual git operations, real debugging, or extension marketplaces). Instead, our objective is to **validate and demonstrate the robustness of the Intent-Driven Design Language (IDDL)**.

We aim to prove that **IDDL can embrace any complex UI/UX requirement** found in modern applications, specifically the most complex class of apps: Integrated Development Environments (IDEs).

## Design > Functionality
- **System First**: We prioritize the design system's architecture, naming conventions (Role, Prominence, Intent, Density), and component composition over backend logic.
- **Minimal Implementation**: We implement "shell" or "skeleton" UIs that look and feel real but may use mock data. This allows us to rapidly iterate on the *design language* without getting bogged down in implementation details.
- **Specification**: Every UI element must map back to a clear IDDL specification. If a UI pattern cannot be expressed in IDDL, the DSL itself must be evolved, not the app hacked to support it.

## Scope of Implementation
for the IDE Left Toolbar (Activity Bar), we provide minimal reference implementations for each common view to demonstrate how IDDL's `Section`, `Group`, `Action`, and `Text` components compose to form these familiar layouts.

### Main Content Areas (Sidebars)
1. **Files (Explorer)**: (Implemented) Tree view structure, hierarchical data.
2. **Search**: Form inputs, search results list, replacing functionality.
3. **Source Control**: List of changed files, action buttons (commit, stage), diff views.
4. **Debug**: Variable lists, call stacks, watch windows (data grids).
5. **Extensions**: Card lists with images, ratings, and action buttons.
6. **Run & Deploy**: Configuration forms, logs, status indicators.
7. **Design Tokens**: Color palettes, typography scales, spacing visualizers.
8. **JSON Viewer**: Tree view of raw data structures.
9. **Presentation**: Slide lists, preview thumbnails.
10. **Settings**: Categorized lists, switch toggles, select inputs.

This diversity of views ensures we test IDDL against Forms, Lists, Trees, Grids, Cards, and Data Visualizations.
