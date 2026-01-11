# IDDL Documentation

> **HTML for Documents. IDDL for Applications.**

웹을 위한 앱 언어, IDDL의 공식 문서입니다.

**Current Version**: IDDL v1.0.1 (Implementation: Phase 1 ~80%)
**Last Updated**: 2026-01-11

---

## 🚀 Quick Start

### 1. IDDL이 뭔가요?

**IDDL (Intent-Driven Design Language)**은 웹 앱을 위한 선언적 언어입니다.

```tsx
// 이렇게 선언하면
<Navigable orientation="vertical">
  <Selectable mode="extended">
    <Block role="List">
      <Action role="ListItem" id="1">Item 1</Action>
      <Action role="ListItem" id="2">Item 2</Action>
    </Block>
  </Selectable>
</Navigable>

// 키보드 탐색, 다중 선택, 접근성이 자동으로 작동합니다!
```

### 2. 왜 필요한가요?

HTML은 **문서**를 위해 만들어졌습니다. **앱**이 아닙니다.

| HTML (문서) | IDDL (앱) |
|------------|----------|
| 읽는다 | 탐색한다, 선택한다, 조작한다 |
| 클릭 | 키보드로 모든 작업 가능 |
| 접근성은 추가 기능 | 접근성이 기본 |

**→ [상세 설명: Web vs App](./2-areas/core/behavior/01-web-vs-app.md)**

### 3. 어떻게 시작하나요?

```bash
# 1. Clone repository
git clone https://github.com/your-org/ide-ui-kit.git
cd ide-ui-kit

# 2. Install dependencies
pnpm install

# 3. Start dev server
pnpm dev

# 4. Open http://localhost:5175/#/behavior
# 3가지 실제 작동 예제를 확인하세요!
```

**→ [프로젝트 루트 README](../README.md)**

---

## 📚 Documentation Structure

이 문서는 **PARA 시스템**을 따릅니다:

```
docs/
├── 1-project/                # 📋 진행 중인 프로젝트
├── 2-areas/                  # 📖 주제별 문서 (핵심)
│   ├── core/
│   │   ├── 0-evolution/     # 프로젝트 비전 & 로드맵
│   │   ├── behavior/        # Behavior Primitives ⭐ NEW
│   │   └── 3-reference/     # 레퍼런스
│   └── spec/                # IDDL 스펙
│       ├── 1-page/
│       ├── 2-section/
│       ├── 5-field/
│       └── interaction/
├── 3-resources/              # 🔗 외부 리소스
└── 4-archive/                # 🗄️ 보관 문서
```

---

## 📖 Essential Reading (꼭 읽어야 할 문서)

### 🎯 1. Vision & Strategy

**프로젝트의 방향성과 전략을 이해하세요:**

#### ⭐ [Application Platform Vision](./2-areas/core/0-evolution/application-platform-vision.md)
- 전체 프로젝트 비전
- 3-Phase 전략 (Declarative UI → Data Binding → Interaction)
- VS Code/Figma급 기능을 Full Package로

#### [Phase 1: Declarative UI](./2-areas/core/0-evolution/phase-1-declarative-ui.md)
- 현재 Phase 상세 (~80% 완성)
- 구현 현황 및 남은 작업

#### [Enterprise Features Checklist](./2-areas/core/0-evolution/enterprise-features-checklist.md)
- 100+ 엔터프라이즈 기능 체크리스트
- VS Code, Figma가 제공하는 모든 기능

---

### 🧩 2. Behavior Primitives (NEW - 핵심 개념)

**IDDL의 가장 중요한 개념: 선언적 인터랙션**

#### ⭐ [01. Web vs App: 본질적 차이](./2-areas/core/behavior/01-web-vs-app.md)
- 문서와 앱의 근본적 차이
- Navigate → Select → Act 패턴
- 왜 HTML로 앱을 만드는 게 어려운가

#### [02. Navigable Specification](./2-areas/core/behavior/02-navigable.md)
- `<Navigable>` 완벽 가이드
- ↑↓←→, Home/End, Typeahead
- 키보드 탐색의 모든 것

#### [03. Selectable Specification](./2-areas/core/behavior/03-selectable.md)
- `<Selectable>` 완벽 가이드
- 단일/다중 선택, 범위 선택
- Shift+클릭, Ctrl+A 등

#### [04. PPT Thumbnail Example](./2-areas/core/behavior/04-ppt-thumbnail-example.md)
- 실제 사용 사례: 슬라이드 썸네일
- Navigable + Selectable 통합
- 완전한 구현 코드

#### [Behavior Primitives Overview](./2-areas/core/behavior/README.md)
- 전체 Behavior Primitives 개요
- Navigable, Selectable, FocusScope, Reorderable...

---

### 📋 3. IDDL Specification

**공식 스펙과 레퍼런스:**

#### [IDDL 1.0 Specification](./2-areas/spec/iddl-spec-1.0.1.md)
- 공식 스펙 문서
- Type, Role, Prominence, Intent, Density

#### [Field Specification](./2-areas/spec/5-field/field.spec.md)
- Field 컴포넌트 완벽 가이드
- 21가지 dataType (text, number, date, select...)
- Role 카탈로그 (MECE 분류)

#### [Page Specification](./2-areas/spec/1-page/)
- Page 컴포넌트 스펙
- PageRole: Application, Document, Focus, Fullscreen
- Layout system (Studio, HolyGrail, Sidebar...)

#### [Section Specification](./2-areas/spec/2-section/section.spec.md)
- Section 컴포넌트 스펙
- SectionRole: Header, Sidebar, Editor, Panel...
- ⭐ NEW (v4.1): Role-based configuration

#### [Interaction Specification (Draft)](./2-areas/spec/interaction/interaction.spec.draft.md)
- 인터랙션 스펙 (초안)
- Behavior Primitives 통합

---

### 🔧 4. Implementation Guides

**실제 구현을 위한 가이드:**

#### [Behavior Primitives Implementation](./1-project/5-behavior-primitives-implementation.md)
- Navigable + Selectable 구현 계획
- 3주 일정, 파일 구조, 테스트 전략
- ✅ Phase 1 완료 (2026-01-11)

#### [Headless Hooks Roadmap](./1-project/4-headless-hook.md)
- Headless Hook 패턴
- useField, useAction 등

#### [Renderer Implementation Guide](./1-project/3-how-to-renderer.md)
- 렌더러 구현 방법
- Role → Renderer 매핑

#### [Type/Role/ARIA Mapping](./1-project/1-type-role-aria-mapping-1.md)
- Type과 Role의 관계
- ARIA 자동 매핑 규칙

---

## 🎓 Learning Path (단계별 학습)

### Level 1: 입문 (30분)
1. [README.md](../README.md) - IDDL 개요
2. [Web vs App](./2-areas/core/behavior/01-web-vs-app.md) - 문제 이해
3. **[Live Demo: /behavior](http://localhost:5175/#/behavior)** - 실제 예제 ⭐

### Level 2: 기본 (1시간)
1. [Navigable Spec](./2-areas/core/behavior/02-navigable.md)
2. [Selectable Spec](./2-areas/core/behavior/03-selectable.md)
3. [PPT Example](./2-areas/core/behavior/04-ppt-thumbnail-example.md)

### Level 3: 중급 (2시간)
1. [Field Spec](./2-areas/spec/5-field/field.spec.md)
2. [Page Spec](./2-areas/spec/1-page/)
3. [Implementation Guide](./1-project/5-behavior-primitives-implementation.md)

### Level 4: 고급 (3시간)
1. [IDDL 1.0 Spec](./2-areas/spec/iddl-spec-1.0.1.md)
2. [Renderer Guide](./1-project/3-how-to-renderer.md)
3. [Enterprise Features Checklist](./2-areas/core/0-evolution/enterprise-features-checklist.md)

---

## 🔍 Quick Reference

### IDDL 핵심 개념 (5초 요약)

| 개념 | 설명 |
|------|------|
| **Type** | 무엇인가? (Text, Field, Action, Block) |
| **Role** | 어떤 역할? (List, Button, Card, Modal) |
| **Prominence** | 얼마나 중요? (Hero, Primary, Secondary) |
| **Intent** | 무슨 의미? (Neutral, Brand, Positive, Critical) |
| **Density** | 얼마나 촘촘? (Comfortable, Standard, Compact) |

### Behavior Primitives (5초 요약)

| Primitive | 의도 | 자동 제공 |
|-----------|------|----------|
| `<Navigable>` | 키보드 탐색 | ↑↓←→, Home/End, Typeahead |
| `<Selectable>` | 선택 관리 | 클릭, Shift+클릭, Ctrl+A |
| `<FocusScope>` | 포커스 관리 | Tab 순환, Escape, 복원 |
| `<Reorderable>` | 순서 변경 | Drag & Drop, 키보드 |
| `<Expandable>` | 펼침/접힘 | →←, ARIA |
| `<Dismissable>` | 닫기 | Escape, 외부 클릭 |

---

## 🗂️ Complete Document Index

### Behavior & Interaction (NEW)
- ⭐ [Web vs App](./2-areas/core/behavior/01-web-vs-app.md)
- [Navigable](./2-areas/core/behavior/02-navigable.md)
- [Selectable](./2-areas/core/behavior/03-selectable.md)
- [PPT Thumbnail Example](./2-areas/core/behavior/04-ppt-thumbnail-example.md)
- [Behavior Primitives Overview](./2-areas/core/behavior/README.md)

### Components
- [Page Specification](./2-areas/spec/1-page/)
- [Section Specification](./2-areas/spec/2-section/section.spec.md)
- [Field Specification](./2-areas/spec/5-field/field.spec.md)

### Core Concepts
- [Application Platform Vision](./2-areas/core/0-evolution/application-platform-vision.md)
- [Phase 1: Declarative UI](./2-areas/core/0-evolution/phase-1-declarative-ui.md)
- [Enterprise Features Checklist](./2-areas/core/0-evolution/enterprise-features-checklist.md)

### Implementation
- [Behavior Primitives Implementation](./1-project/5-behavior-primitives-implementation.md) ✅ Complete
- [Headless Hooks](./1-project/4-headless-hook.md)
- [Renderer Guide](./1-project/3-how-to-renderer.md)
- [Type/Role/ARIA Mapping](./1-project/1-type-role-aria-mapping-1.md)

### Reference
- [Component Role Mapping](./2-areas/core/3-reference/component-role-mapping.md)
- [Field Reference](./2-areas/core/3-reference/field-reference.md)
- [Page v2 Spec](./2-areas/core/3-reference/page-v2-spec.md)
- [Section v4.1 Spec](./2-areas/core/3-reference/section-v4.1-spec.md)

### Patterns (Best Practices)
- [Behavior Patterns](./2-areas/patterns/01-behavior-patterns.md)
- [Accessibility Patterns](./2-areas/patterns/02-accessibility-patterns.md)
- [Data Patterns](./2-areas/patterns/03-data-patterns.md)
- [Composition Patterns](./2-areas/patterns/04-composition-patterns.md)
- [State Patterns](./2-areas/patterns/05-state-patterns.md)
- [Animation Patterns](./2-areas/patterns/06-animation-patterns.md)
- [Layout Patterns](./2-areas/patterns/07-layout-patterns.md)
- [Performance Patterns](./2-areas/patterns/08-performance-patterns.md)

---

## 💡 자주 찾는 문서

- **"IDDL이 뭔가요?"** → [README.md](../README.md)
- **"왜 필요한가요?"** → [Web vs App](./2-areas/core/behavior/01-web-vs-app.md)
- **"어떻게 쓰나요?"** → [Live Demo](http://localhost:5175/#/behavior)
- **"무엇을 만들 수 있나요?"** → [Enterprise Features Checklist](./2-areas/core/0-evolution/enterprise-features-checklist.md)
- **"어떻게 구현하나요?"** → [Behavior Primitives Implementation](./1-project/5-behavior-primitives-implementation.md)
- **"개발자 가이드는?"** → [/CLAUDE.md](../CLAUDE.md)

---

## 📬 Contributing to Docs

문서 개선에 참여하세요!

### 문서 작성 가이드

1. **명확성 우선**: 기술 용어를 피하고 명확한 설명
2. **예시 포함**: 코드 예시는 필수
3. **Why 설명**: 왜 이렇게 하는지 설명
4. **Progressive Disclosure**: 간단한 것부터, 복잡한 것은 나중에

### 문서 구조 템플릿

```markdown
# 제목

> 한 줄 요약

## 📋 요약 (TL;DR)

## 🤔 문제 (Problem)

## ✨ 해결책 (Solution)

## 📖 상세 설명 (Details)

## 🎨 예제 (Examples)

## 🚀 시작하기 (Getting Started)

## 📚 참고 (References)
```

---

## 📋 Maintenance (PARA System)

### When to Create a Project (1-project/)
- Clear deliverable (e.g., "Implement Navigable primitive")
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
- Project completed and delivered (예: Behavior Primitives → 2026-01-11)
- Documentation superseded by new approach
- Historical reference only

---

## 📬 Contact

- **Issues**: [GitHub Issues](https://github.com/your-org/ide-ui-kit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/ide-ui-kit/discussions)
- **Documentation Feedback**: [Docs Issue Template](https://github.com/your-org/ide-ui-kit/issues/new?template=docs.md)

---

<p align="center">
  <strong>HTML for Documents. IDDL for Applications.</strong>
</p>

<p align="center">
  Built with ❤️ for Enterprise Applications
</p>

---

**Documentation Version**: PARA 2.1 (Projects - Areas - Resources - Archive)
**Implementation Status**: Phase 1 ~80% Complete
**Last Updated**: 2026-01-11
