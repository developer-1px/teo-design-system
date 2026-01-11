# IDDL 학습 가이드

**IDDL (Intent-Driven Design Language)** 공식 학습 문서입니다.

> "의도를 선언하면, 구현은 따라온다"

---

## 🎯 IDDL이란?

IDDL은 **"왜"(Why)를 선언하면 "어떻게"(How)는 시스템이 알아서 처리하는** TSX 기반 DSL입니다.

```tsx
// ❌ How-based (기존 방식)
<button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600">
  Save Changes
</button>

// ✅ Why-based (IDDL)
<Action prominence="Strong" intent="Positive">
  Save Changes
</Action>
```

**개발자가 하는 일**: prominence (중요도) + intent (의미) 선언
**시스템이 하는 일**: 토큰, 스타일, 접근성, 키보드 탐색 자동 처리

---

## 📚 학습 로드맵

### 🟢 초보자 경로 (총 3시간)

처음 IDDL을 배우는 분들을 위한 경로입니다.

| 단계 | 문서 | 소요 시간 | 핵심 내용 |
|------|------|----------|----------|
| 1 | [왜 IDDL인가?](./00-introduction/01-why-iddl.md) | 10분 | 기존 디자인 시스템의 문제점 |
| 2 | [핵심 개념](./00-introduction/02-core-concept.md) | 15분 | Why-based System, 5 Axes |
| 3 | [Quick Start](./00-introduction/03-quick-start.md) | 20분 | 5분 안에 첫 UI 만들기 |
| 4 | [Prominence](./01-fundamentals/01-prominence.md) | 20분 | 시각적 중요도 이해 |
| 5 | [Intent](./01-fundamentals/02-intent.md) | 20분 | 의미적 색상 이해 |
| 6 | [Text 컴포넌트](./02-components/01-element-text.md) | 25분 | 가장 간단한 Element |
| 7 | [Action 컴포넌트](./02-components/02-element-action.md) | 30분 | 버튼, 링크, 메뉴 |
| 8 | [폼 패턴](./03-patterns/01-form.md) | 40분 | 로그인 폼 만들기 |

**완료 후**: IDDL로 기본적인 UI를 만들 수 있습니다.

---

### 🟡 실무자 경로 (총 6시간)

실무에서 IDDL로 상용 앱을 만들 분들을 위한 경로입니다.

| 단계 | 문서 | 소요 시간 | 핵심 내용 |
|------|------|----------|----------|
| 1-8 | 초보자 경로 | 3시간 | 기초 다지기 |
| 9 | [Density](./01-fundamentals/03-density.md) | 15분 | 간격과 크기 조절 |
| 10 | [Role](./01-fundamentals/04-role.md) | 20분 | 역할 기반 설계 |
| 11 | [Type](./01-fundamentals/05-type.md) | 20분 | 컴포넌트 계층 구조 |
| 12 | [Field 컴포넌트](./02-components/03-element-field.md) | 45분 | 21개 dataType 마스터 |
| 13 | [Block 컴포넌트](./02-components/04-block.md) | 30분 | 논리적 그룹핑 |
| 14 | [Section 컴포넌트](./02-components/05-section.md) | 25분 | 레이아웃 영역 |
| 15 | [Page 컴포넌트](./02-components/06-page.md) | 30분 | Application vs Document |
| 16 | [리스트 패턴](./03-patterns/02-list.md) | 40분 | 파일 목록, 검색 결과 |
| 17 | [대시보드 패턴](./03-patterns/03-dashboard.md) | 40분 | 카드, 통계, 차트 |

**완료 후**: IDDL로 엔터프라이즈 수준의 앱을 만들 수 있습니다.

---

### 🔴 아키텍트 경로 (총 10시간)

IDDL의 내부 동작을 이해하고 확장하려는 분들을 위한 경로입니다.

| 단계 | 문서 | 소요 시간 | 핵심 내용 |
|------|------|----------|----------|
| 1-17 | 실무자 경로 | 6시간 | 실전 경험 쌓기 |
| 18 | [Overlay 컴포넌트](./02-components/07-overlay.md) | 30분 | Dialog, Toast, Tooltip |
| 19 | [IDE 레이아웃 패턴](./03-patterns/04-ide-layout.md) | 45분 | VS Code 스타일 |
| 20 | [CVA Variants](./04-advanced/01-cva-variants.md) | 60분 | prominence × intent 자동화 |
| 21 | [Headless Hooks](./04-advanced/02-headless-hooks.md) | 60분 | 로직과 UI 분리 |
| 22 | [Accessibility](./04-advanced/03-accessibility.md) | 45분 | ARIA, 키보드, 스크린 리더 |
| 23 | [Keyboard Navigation](./04-advanced/04-keyboard-nav.md) | 45분 | Focus management |
| 24 | [Theming](./04-advanced/05-theming.md) | 30분 | Theme, Color Scheme |
| 25 | [API Reference](./05-reference/) | 90분 | 전체 Props API |

**완료 후**: IDDL 아키텍처를 이해하고 커스텀 확장을 만들 수 있습니다.

---

## 🎓 학습 레벨

### Level 0: Introduction (입문)

IDDL의 필요성과 핵심 개념을 이해합니다.

- [왜 IDDL인가?](./00-introduction/01-why-iddl.md) ⭐
- [핵심 개념](./00-introduction/02-core-concept.md) ⭐
- [Quick Start](./00-introduction/03-quick-start.md) ⭐

**목표**: "IDDL이 뭔지, 왜 필요한지" 이해하기

---

### Level 1: Fundamentals (기초)

IDDL의 5 Axes System을 완전히 이해합니다.

- [Prominence](./01-fundamentals/01-prominence.md) - 시각적 중요도
- [Intent](./01-fundamentals/02-intent.md) - 의미적 색상
- [Density](./01-fundamentals/03-density.md) - 간격과 크기
- [Role](./01-fundamentals/04-role.md) - 역할 정의
- [Type](./01-fundamentals/05-type.md) - 컴포넌트 타입

**목표**: "prominence × intent × density → className" 자동화 이해하기

---

### Level 2: Components (컴포넌트)

IDDL 컴포넌트 계층을 아래에서 위로 학습합니다.

#### Element (가장 기본)
- [Text](./02-components/01-element-text.md) - Title, Body, Label, Badge, etc.
- [Action](./02-components/02-element-action.md) - Button, IconButton, Link, MenuItem
- [Field](./02-components/03-element-field.md) - 21개 dataType (text, email, select, etc.)

#### Block, Section, Page (상위 레이어)
- [Block](./02-components/04-block.md) - Form, Card, Toolbar, List, Grid
- [Section](./02-components/05-section.md) - ActivityBar, Sidebar, Editor, Panel
- [Page](./02-components/06-page.md) - Application, Document, Focus, Fullscreen

#### Overlay (Floating UI)
- [Overlay](./02-components/07-overlay.md) - Dialog, Drawer, Toast, Tooltip

**목표**: "Page → Section → Block → Element" 계층 구조 이해하기

---

### Level 3: Patterns (실전 패턴)

실무에서 자주 쓰이는 UI 패턴을 IDDL로 구현합니다.

- [폼 패턴](./03-patterns/01-form.md) - 로그인, 회원가입, 설정
- [리스트 패턴](./03-patterns/02-list.md) - 파일 목록, 검색 결과, 필터링
- [대시보드 패턴](./03-patterns/03-dashboard.md) - 카드 그리드, 통계, 차트
- [IDE 레이아웃 패턴](./03-patterns/04-ide-layout.md) - VS Code 스타일
- [설정 페이지 패턴](./03-patterns/05-settings.md) - 탭, 아코디언

**목표**: "실제 앱 화면을 IDDL로 만들 수 있다"

---

### Level 4: Advanced (고급)

IDDL의 내부 아키텍처와 확장 방법을 학습합니다.

- [CVA Variants](./04-advanced/01-cva-variants.md) - 자동 스타일링 시스템
- [Headless Hooks](./04-advanced/02-headless-hooks.md) - 로직과 UI 분리
- [Accessibility](./04-advanced/03-accessibility.md) - ARIA, 키보드, 스크린 리더
- [Keyboard Navigation](./04-advanced/04-keyboard-nav.md) - Focus management
- [Theming](./04-advanced/05-theming.md) - Theme, Color Scheme, Density

**목표**: "IDDL을 확장하고 커스터마이징할 수 있다"

---

### Level 5: Reference (레퍼런스)

모든 Props API를 완전히 숙지합니다.

- [Page API](./05-reference/01-page-api.md) - PageProps 완전 레퍼런스
- [Section API](./05-reference/02-section-api.md) - SectionProps 완전 레퍼런스
- [Block API](./05-reference/03-block-api.md) - BlockProps 완전 레퍼런스
- [Element API](./05-reference/04-element-api.md) - TextProps, FieldProps, ActionProps
- [Overlay API](./05-reference/05-overlay-api.md) - OverlayProps 완전 레퍼런스
- [Design Tokens](./05-reference/06-tokens.md) - 전체 토큰 목록

**목표**: "IDDL API를 자유자재로 사용할 수 있다"

---

## 🎯 목표별 추천 학습 경로

### "빠르게 시작하고 싶어요" (1시간)

```
01-why-iddl.md
  ↓
02-core-concept.md
  ↓
03-quick-start.md
  ↓
01-element-text.md
  ↓
02-element-action.md
```

**완료 후**: 간단한 버튼, 텍스트 UI 만들 수 있음

---

### "폼을 만들고 싶어요" (2시간)

```
초보자 경로 (3시간)
  ↓
03-element-field.md (45분)
  ↓
01-form.md (40분)
```

**완료 후**: 로그인, 회원가입 폼 만들 수 있음

---

### "VS Code 같은 IDE를 만들고 싶어요" (4시간)

```
실무자 경로 (6시간)
  ↓
06-page.md (30분) - role="Application"
  ↓
05-section.md (25분) - ActivityBar, Sidebar, etc.
  ↓
04-ide-layout.md (45분)
```

**완료 후**: IDE 레이아웃 완성 가능

---

### "엔터프라이즈 앱을 만들고 싶어요" (8시간)

```
실무자 경로 (6시간)
  ↓
07-overlay.md (30분) - Dialog, Toast
  ↓
03-dashboard.md (40분)
  ↓
04-ide-layout.md (45분)
  ↓
01-cva-variants.md (60분) - 스타일 자동화
```

**완료 후**: 상용 수준의 앱 제작 가능

---

## 📖 학습 팁

### 1. 순서대로 학습하세요

IDDL은 점진적 학습이 중요합니다. Level 0부터 순서대로 진행하세요.

### 2. 직접 코드를 작성하세요

읽기만 하지 말고, 예시 코드를 직접 타이핑하고 실행해보세요.

### 3. Why를 이해하세요

"왜 이렇게 하는가?"를 항상 생각하세요. IDDL의 핵심은 Why-based입니다.

### 4. 스펙 문서를 참조하세요

학습 문서는 "배우기"용입니다. 상세한 내용은 [스펙 문서](../2-areas/spec/)를 참조하세요.

### 5. 실전 프로젝트로 연습하세요

학습 후에는 실제 프로젝트에 IDDL을 적용해보세요.

---

## 🔗 관련 문서

**프로젝트 비전**:
- [Application Platform Vision](../2-areas/core/0-evolution/application-platform-vision.md) - 왜 IDDL을 만들었는가?
- [Phase 1 현황](../2-areas/core/0-evolution/phase-1-declarative-ui.md) - 현재 구현 상태

**스펙 문서**:
- [IDDL 1.0 Spec](../2-areas/spec/0-core/iddl-1.0-spec-ko.md) - 공식 스펙 (한글)
- [Component Specs](../2-areas/spec/) - 컴포넌트별 상세 스펙

**개발자 가이드**:
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 구조 및 컨벤션
- [Code Conventions](../1-project/code-conventions-analysis.md) - 코드 컨벤션 분석

---

## 💬 피드백

학습하면서 불편하거나 개선이 필요한 부분이 있다면:

1. [GitHub Issues](https://github.com/anthropics/claude-code/issues)에 등록
2. IDDL 커뮤니티에 공유
3. 직접 PR 보내기

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**Phase**: Phase 1 (~80% 완료)

**학습을 시작하려면**: [왜 IDDL인가?](./00-introduction/01-why-iddl.md) 👈 여기서 시작하세요!
