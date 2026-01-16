# CSS Hack Implementation Roadmap

**Date**: 2026-01-16
**Participants**: Teo (Lead), Min (Frontend), Alex (Designer), Sarah (A11y), Jordan (Performance)
**Topic**: Prioritizing and Implementing CSS Hacks in MDK

---

## Executive Summary

We've identified 5 CSS architectural patterns ("hacks") that solve common AI coding mistakes:

1. **Grid Stack** - Safer overlays without `position: absolute`
2. **Hit Area Expansion** - Accessible touch targets without layout impact
3. **Aspect Ratio Tokens** - Prevent layout shift on image load
4. **Isolation** - Stop z-index warfare
5. **Scroll Shadows** - Visual scroll hints without JS

**Goal**: Integrate these into MDK's Frame component API within 2 weeks.

---

## Priority Matrix

| Hack | Impact | Complexity | Priority | Timeline |
|------|--------|------------|----------|----------|
| **Aspect Ratio** | High (CLS) | Low | P0 | Week 1, Day 1-2 |
| **Hit Area** | High (A11y) | Low | P0 | Week 1, Day 3-4 |
| **Isolation** | High (z-index) | Medium | P1 | Week 1, Day 5 - Week 2, Day 1 |
| **Grid Stack** | Medium | Medium | P1 | Week 2, Day 2-3 |
| **Scroll Shadows** | Low (nice-to-have) | Low | P2 | Week 2, Day 4-5 |

---

## Phase 1: Foundation (Week 1)

### Day 1-2: Aspect Ratio Tokens

**Why First**: Biggest performance impact (CLS reduction), simplest implementation.

**Tasks**:
1. Add ratio tokens to `tokens.css`:
   ```css
   --ratio-sq: 1 / 1;
   --ratio-video: 16 / 9;
   --ratio-classic: 4 / 3;
   --ratio-portrait: 3 / 4;
   --ratio-wide: 21 / 9;
   --ratio-golden: 1.618 / 1;
   ```

2. Update `Frame.tsx`:
   ```tsx
   interface FrameProps {
     ratio?: 'sq' | 'video' | 'classic' | 'portrait' | 'wide' | 'golden' | string;
   }
   ```

3. Update `frameToSettings.ts` to handle ratio prop

4. Add tests for ratio calculations

5. Update docs in `/docs/claude/`

**Success Criteria**:
- CLS score improves from 0.18 → 0.02 in CRM/CMS apps
- All images in demo apps use ratio props
- No layout shift on slow 3G network simulation

---

### Day 3-4: Hit Area Expansion

**Why Second**: Critical accessibility issue, affects all Action components.

**Tasks**:
1. Update `Action.tsx`:
   ```tsx
   interface ActionProps {
     hitArea?: number; // Default: 44 (WCAG)
     debugHitArea?: boolean;
   }
   ```

2. Add CSS for pseudo-element expansion:
   ```css
   .action::before {
     content: "";
     position: absolute;
     inset: var(--hit-area-expansion, 0);
   }
   ```

3. Calculate expansion in component:
   ```tsx
   const actualSize = size + (padding * 2);
   const expansion = Math.max(0, (hitArea - actualSize) / 2);
   ```

4. Add `debugHitArea` mode for development

5. Audit all Actions in demo apps, ensure 44px minimum

**Success Criteria**:
- All icon buttons pass WCAG 2.5.5 (44×44px target size)
- No visual layout changes
- Debug mode shows accurate hit area overlay

---

### Day 5 - Week 2, Day 1: Isolation

**Why Third**: High impact but requires careful design to avoid breaking existing layouts.

**Tasks**:
1. Add `isolate` prop to `Frame.tsx`:
   ```tsx
   interface FrameProps {
     isolate?: boolean;
     zIndex?: number | 'above' | 'dropdown' | 'sticky' | 'modal' | 'toast';
   }
   ```

2. Add z-index tokens to `tokens.css`:
   ```css
   --z-base: 0;
   --z-above: 1;
   --z-dropdown: 10;
   --z-sticky: 100;
   --z-modal: 1000;
   --z-toast: 10000;
   ```

3. Auto-apply isolation to Frames with `surface` prop (opt-out available)

4. Audit existing z-index usage in demo apps

5. Document Portal pattern for escape hatch

**Success Criteria**:
- Remove all `z-index > 100` from codebase
- CRM table rows don't have z-index conflicts
- Modal/Dialog components still work correctly

---

## Phase 2: Enhancement (Week 2)

### Day 2-3: Grid Stack

**Why Fourth**: Useful but less critical, affects specific use cases (hero images, card overlays).

**Tasks**:
1. Add `stack` prop to `Frame.tsx`:
   ```tsx
   interface FrameProps {
     stack?: boolean;
     alignSelf?: 'start' | 'center' | 'end' | 'stretch';
     justifySelf?: 'start' | 'center' | 'end' | 'stretch';
   }
   ```

2. Update CSS:
   ```css
   .frame[data-stack] {
     display: grid;
     grid-template-areas: "stack";
   }

   .frame[data-stack] > * {
     grid-area: stack;
   }
   ```

3. Update SlideApp hero section to use stack

4. Update CMS card thumbnails with badge overlays

**Success Criteria**:
- All `position: absolute` replaced with stack pattern
- No layout bugs in existing demos
- AI prompt includes stack guidance

---

### Day 4-5: Scroll Shadows

**Why Last**: Nice-to-have UX improvement, not critical.

**Tasks**:
1. Add `scrollShadows` prop to `Frame.tsx`:
   ```tsx
   interface FrameProps {
     scrollShadows?: boolean | 'x' | 'y';
   }
   ```

2. Add CSS for vertical and horizontal shadows:
   ```css
   .scroll-shadows-y { /* 4 gradient backgrounds */ }
   .scroll-shadows-x { /* 4 gradient backgrounds rotated */ }
   ```

3. Update CRM sidebar navigation

4. Update CMS page tree (left sidebar)

5. Performance test on low-end devices

**Success Criteria**:
- Scrollable containers show visual hints
- No performance regression (60fps maintained)
- Works in light and dark mode

---

## Testing Strategy

**Unit Tests** (Jest + React Testing Library):
- Ratio prop generates correct aspect-ratio CSS
- Hit area expansion calculates correctly
- Isolation creates stacking context
- Stack applies grid-template-areas

**Integration Tests** (Playwright):
- Click targets are 44×44px minimum (automated a11y audit)
- Images don't cause layout shift (CLS measurement)
- Z-index conflicts don't occur (visual regression)
- Scroll shadows appear/disappear correctly

**Performance Tests**:
- Lighthouse CI on all demo apps
- CLS score < 0.1
- FPS remains 60 on scroll
- Memory usage doesn't increase

---

## Documentation Updates

**Files to Update**:
1. `/docs/claude/2026-01-16/09-[CSS]grid-stack-pattern-discussion.md` ✅
2. `/docs/claude/2026-01-16/10-[CSS]hit-area-expansion-for-action.md` ✅
3. `/docs/claude/2026-01-16/11-[CSS]aspect-ratio-token-system.md` ✅
4. `/docs/claude/2026-01-16/12-[CSS]isolation-stacking-context-strategy.md` ✅
5. `/docs/claude/2026-01-16/13-[CSS]scroll-shadow-hint-pattern.md` ✅
6. `.agent/conventions.md` - Add CSS hack guidelines
7. `CLAUDE.md` - Update Frame API documentation
8. `README.md` - Add CSS Architecture section

**AI Prompt Template** (for `.agent/conventions.md`):
```markdown
## CSS Architecture Patterns

When building UI, follow these patterns to avoid common mistakes:

### 1. Overlapping Elements
Use `<Frame stack>` instead of `position: absolute`:
```tsx
<Frame stack>
  <img src="hero.jpg" />
  <Prose.Title>Overlay Text</Prose.Title>
</Frame>
```

### 2. Small Actions
Always specify `hitArea` for accessibility:
```tsx
<Action icon={IconX} size={16} hitArea={44} />
```

### 3. Images
Prevent layout shift with `ratio` prop:
```tsx
<Frame ratio="video" w="fill">
  <img src="thumbnail.jpg" />
</Frame>
```

### 4. Z-Index
Use `isolate` to prevent conflicts:
```tsx
<Frame surface="raised" isolate>
  <Badge zIndex={10} />
</Frame>
```

### 5. Scrollable Containers
Add visual hints with `scrollShadows`:
```tsx
<Frame overflow="auto" scrollShadows h={300}>
  <LongContent />
</Frame>
```
```

---

## Migration Guide

**Breaking Changes**: None (all new optional props)

**Recommended Migrations**:

1. **All images** → Add `ratio` prop
   ```diff
   - <img src="hero.jpg" />
   + <Frame ratio="video"><img src="hero.jpg" /></Frame>
   ```

2. **Icon buttons** → Add `hitArea` prop
   ```diff
   - <Action icon={IconTrash} size={16} />
   + <Action icon={IconTrash} size={16} hitArea={44} />
   ```

3. **Cards with badges** → Add `isolate` prop
   ```diff
   - <Frame surface="raised">
   + <Frame surface="raised" isolate>
       <Badge zIndex={10} />
     </Frame>
   ```

4. **Hero sections** → Replace absolute positioning
   ```diff
   - <Frame position="relative">
   + <Frame stack>
       <img src="hero.jpg" />
   -   <Frame position="absolute" top="50%" left="50%">
   +   <Frame>
         <Title>Text</Title>
       </Frame>
     </Frame>
   ```

5. **Sidebars** → Add scroll shadows
   ```diff
   - <Frame overflow="auto">
   + <Frame overflow="auto" scrollShadows>
       <Nav />
     </Frame>
   ```

---

## Success Metrics

**Week 1 Goals**:
- [ ] CLS score < 0.1 on all demo apps
- [ ] 100% WCAG 2.5.5 compliance (touch targets)
- [ ] Zero z-index values > 100 in codebase
- [ ] All tests passing

**Week 2 Goals**:
- [ ] Zero `position: absolute` for overlays
- [ ] Scroll shadows on all scrollable containers
- [ ] Complete documentation
- [ ] AI prompt updated in conventions

**Long-term KPIs**:
- Lighthouse Performance score: 90+ → 95+
- Lighthouse Accessibility score: 95+ → 100
- AI hallucination rate on layout tasks: -40%
- Code review comments on CSS: -60%

---

## Team Assignments

**Teo**: System design, token definitions, documentation
**Min**: Component implementation, migration scripts, testing
**Alex**: Design validation, visual QA, dark mode testing
**Sarah**: Accessibility audit, WCAG compliance, ARIA attributes
**Jordan**: Performance benchmarking, Lighthouse CI, optimization

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing layouts | Medium | High | Comprehensive visual regression testing |
| Performance regression | Low | Medium | Continuous Lighthouse monitoring |
| Browser compatibility | Low | Low | Feature detection + fallbacks |
| Developer adoption | Medium | Medium | Clear docs + AI prompt guidance |
| Z-index confusion | Low | High | Auto-isolation on surface prop |

---

## Next Steps

1. **Today**: Team review of this roadmap
2. **Tomorrow**: Start Phase 1, Day 1 (Aspect Ratio)
3. **End of Week 1**: Demo to stakeholders
4. **End of Week 2**: Launch to production, monitor metrics
5. **Week 3**: Retrospective, gather feedback, plan next iteration

---

## Questions for Discussion

**Teo**: Should we make some of these behaviors default? For example, auto-apply `scrollShadows` when `overflow="auto"`?

**Min**: What about TypeScript strict mode? Do we need runtime validation for ratio strings?

**Alex**: Can we preview these in Storybook before rolling out to all apps?

**Sarah**: Should we add ARIA announcements when scroll shadows appear? "More content below"?

**Jordan**: Do we need a feature flag system to gradually roll out these changes?

---

**Status**: Awaiting team approval to proceed with Week 1 implementation.
