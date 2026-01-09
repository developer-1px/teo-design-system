# IDDL Documentation

> **Intent-Driven Design Language - Official Documentation**

This documentation follows the PARA method for organization.

**Current Version**: IDDL v1.0.1 (Implementation: v4.1)
**Last Major Update**: 2026-01-09 (Section Role Configuration 중앙화)

---

## Quick Start

- **For Developers:** Start with `/CLAUDE.md` - comprehensive development guide
- **For Learners:** Start with `/apps/docs/00-getting-started/` - 34-document curriculum
- **For Reference:** See `2-areas/spec/` - official IDDL specification
- **⭐ NEW (v4.1):** See `2-areas/core/3-reference/section-v4.1-spec.md` - Section role configuration

---

## Documentation Structure (PARA System)

### 1. Projects (`1-project/`)

**Active implementation work with clear completion criteria.**

Current active projects:
- `5-iddl-missing-cases.md` - Edge cases and missing functionality tracking

**Recently Completed (2026-01-09)**:
- ~~`2-react-redender.md`~~ → Archived to `4-archive/2026-01-09-v4.1-section-role-config/`
- ~~`3-how-to-renderer.md`~~ → Archived to `4-archive/2026-01-09-v4.1-section-role-config/`

**Lifecycle:**
- Projects represent ongoing work
- When completed, moved to `4-archive/`
- Check here for work-in-progress documentation

---

### 2. Areas (`2-areas/`)

**Long-term responsibilities requiring continuous maintenance.**

#### `spec/` - IDDL Specification
- `iddl-spec-1.0.1.md` - Official IDDL specification (living document)
- `iddl-coverage-analysis.md` - Implementation coverage tracking
- `minimal-renderer-guide.md` - Minimal renderer requirements
- `renderer-improvement-roadmap.md` - Future renderer enhancements

#### `core/` - Component References
- `3-reference/component-role-mapping.md` - Component taxonomy and role mapping
- `3-reference/field-reference.md` - Field component API (21 data types)
- `3-reference/page-v2-spec.md` - Page component API (layouts & navigation)
- ⭐ `3-reference/section-v4.1-spec.md` - **NEW**: Section role configuration (v4.1)
- ⭐ `3-reference/page-section-overflow-policy.md` - **NEW**: Scroll behavior responsibility model

#### `patterns/` - Best Practices
- `01-behavior-patterns.md` - Behavior and interaction patterns
- `02-accessibility-patterns.md` - Accessibility best practices
- `03-data-patterns.md` - Data binding and validation
- `04-composition-patterns.md` - Component composition strategies
- `05-state-patterns.md` - State management patterns
- `06-animation-patterns.md` - Animation and transition patterns
- `07-layout-patterns.md` - Layout and responsive design
- `08-performance-patterns.md` - Performance optimization

**Lifecycle:**
- Continuously maintained reference materials
- Updated as standards evolve
- Never archived (living documentation)

---

### 3. Resources (`3-resources/`)

**Reference materials, tools, and external links.**

- External documentation links
- Design system references
- Development tools and utilities

**Lifecycle:**
- Reference materials collected over time
- Outdated resources archived periodically
- Check here for learning resources

---

### 4. Archive (`4-archive/`)

**Completed or deprecated documentation.**

Current archives:
- `2026-01-10-v4-completed/` - IDDL v4.0 implementation work
- ⭐ `2026-01-09-v4.1-section-role-config/` - **NEW**: Section v4.0 → v4.1 전환 문서

**Lifecycle:**
- Completed projects moved here
- Kept for historical reference
- Not actively maintained

**Policy:**
- Read-only reference materials
- Check here for implementation history
- For current info, see Areas or CLAUDE.md

---

## Documentation by Audience

### For New Developers (Getting Started)

1. Read `/CLAUDE.md` - Development guide with v4.0 architecture
2. Browse `/apps/docs/00-getting-started/` - IDDL introduction
3. Check `2-areas/spec/iddl-spec-1.0.1.md` - Official specification
4. Explore `2-areas/patterns/` - Best practices and patterns

### For Contributors (Implementation)

1. Check `1-project/` - Active work items
2. Read `2-areas/core/3-reference/` - Component APIs
3. Follow patterns in `2-areas/patterns/`
4. Update CLAUDE.md when adding major features

### For Learners (IDDL Curriculum)

1. Start with `/apps/docs/` - 34-document learning path
2. Follow levels: Getting Started → Fundamentals → Structure → Data → Patterns → Advanced
3. Reference `2-areas/spec/` for official specification
4. Use `2-areas/patterns/` for real-world examples

---

## Maintenance Guidelines

### When to Create a Project (1-project/)

- Clear deliverable (e.g., "Implement ResizeHandle component")
- Defined completion criteria
- Active work item requiring tracking

### When to Update an Area (2-areas/)

- Standard changes (e.g., IDDL spec updates)
- Component API changes
- New best practice patterns
- Continuous reference material

### When to Add a Resource (3-resources/)

- External learning material discovered
- New tool or utility reference
- Design system inspiration

### When to Archive (4-archive/)

- Project completed and delivered
- Documentation superseded by new approach
- Historical reference only

---

## Related Documentation

- **`/CLAUDE.md`** - Primary development guide for Claude Code instances
- **`/README.md`** - Project overview and quick start
- **`/apps/docs/`** - 34-document IDDL learning curriculum
- **`/docs/index.md`** - IDDL Specification index

---

**Last Updated:** 2026-01-09
**Documentation Version:** PARA 2.0 (Projects - Areas - Resources - Archive)
**Current Implementation:** IDDL v1.0.1 (v4.1)
