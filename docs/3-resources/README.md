# Resources

Reference materials, tools, and external links for IDDL development.

---

## External Documentation

### Frameworks & Libraries
- [React 19 Documentation](https://react.dev/) - Official React documentation
- [TypeScript](https://www.typescriptlang.org/) - TypeScript language reference
- [Vite 7](https://vitejs.dev/) - Build tool and dev server
- [TailwindCSS 4.x](https://tailwindcss.com/) - Utility-first CSS framework

### UI & Design Systems
- [Material Design 3](https://m3.material.io/) - Google's design system
- [Human Interface Guidelines](https://developer.apple.com/design/) - Apple's design principles
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [CVA (Class Variance Authority)](https://cva.style/) - TypeScript-first variant API

### Accessibility
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) - WAI-ARIA patterns
- [WebAIM](https://webaim.org/) - Web accessibility resources
- [A11y Project](https://www.a11yproject.com/) - Community-driven accessibility resources

---

## Development Tools

### Built-in Tools
- **IDDL Inspector** - Press `Cmd+D` (Mac) or `Ctrl+D` (Windows) in dev mode
  - Shows React component tree in JSX format
  - Filters out HTML elements, shows only React components
  - Displays IDDL-relevant props only
  - Implementation: `vite-plugins/iddl-inspector/`

### Code Quality
- [Biome](https://biomejs.dev/) - Fast linter and formatter (replaces ESLint + Prettier)
- [TypeScript ESLint](https://typescript-eslint.io/) - TypeScript linting rules

### Testing & Development
- [Storybook](https://storybook.js.org/) - Component development and documentation
- [Vitest](https://vitest.dev/) - Fast unit testing framework
- [React DevTools](https://react.dev/learn/react-developer-tools) - React debugging

---

## Design System References

### Token Systems
- [Design Tokens Community Group](https://www.designtokens.org/) - Token standards
- [Style Dictionary](https://amzn.github.io/style-dictionary/) - Token transformation tool
- [Tokens Studio for Figma](https://tokens.studio/) - Design token management in Figma

### Component Patterns
- [Inclusive Components](https://inclusive-components.design/) - Accessible component patterns
- [Patterns.dev](https://www.patterns.dev/) - Modern web app patterns
- [Component Encyclopedia](https://component.gallery/) - Component naming and patterns

### Visual Design
- [Refactoring UI](https://www.refactoringui.com/) - Visual design tactics
- [Laws of UX](https://lawsofux.com/) - UX principles and heuristics
- [Can I Use](https://caniuse.com/) - Browser compatibility tables

---

## Learning Resources

### IDDL Curriculum
- **Internal:** `/docs/3-learning/` - IDDL 공식 학습 커리큘럼
  - Level 0: Introduction (3 docs, 45 min) - 왜 IDDL인가, 핵심 개념, Quick Start
  - Level 1: Fundamentals (5 docs, 1.5 hours) - Prominence, Intent, Density, Role, Type
  - Level 2: Components (7 docs, 3 hours) - Text, Action, Field, Block, Section, Page, Overlay
  - Level 3: Patterns (5 docs, 3 hours) - 폼, 리스트, 대시보드, IDE 레이아웃, 설정
  - Level 4: Advanced (5 docs, 4 hours) - CVA variants, Headless hooks, Accessibility, Keyboard nav, Theming
  - Level 5: Reference (3 docs) - API 레퍼런스, Design tokens, Best practices

### Related Concepts
- [Atomic Design](https://atomicdesign.bradfrost.com/) - Component hierarchy methodology
- [FSD (Feature-Sliced Design)](https://feature-sliced.design/) - Architecture methodology
- [PARA Method](https://fortelabs.com/blog/para/) - Information organization system

---

## Community & Support

### IDDL Project
- **Issues:** GitHub Issues (when repository is public)
- **Discussions:** GitHub Discussions (when repository is public)
- **Documentation:** See `/docs/index.md` and `/CLAUDE.md`

### Related Communities
- [React Community](https://react.dev/community) - Official React community
- [TypeScript Community](https://www.typescriptlang.org/community) - TypeScript discussions
- [TailwindCSS Discord](https://tailwindcss.com/discord) - TailwindCSS community

---

## Maintenance

### Adding New Resources

When adding a new resource:
1. Ensure it's relevant to IDDL development
2. Verify the link is active and maintained
3. Add a brief description (1-2 sentences)
4. Categorize appropriately
5. Update this README's "Last Updated" date

### Reviewing Resources

Periodically review resources (quarterly):
- Check for broken links
- Remove deprecated resources
- Update outdated information
- Archive obsolete materials to `/docs/4-archive/`

---

**Last Updated:** 2026-01-10
**Maintained By:** IDDL Core Team
