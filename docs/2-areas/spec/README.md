# IDDL Specification

**IDDL (Intent-Driven Design Language)** 공식 스펙 문서 저장소입니다.

## 📁 폴더 구조

IDDL 스펙은 **컴포넌트 계층 구조**에 맞춰 폴더가 구성되어 있습니다:

```
spec/
├─ 0-core/              # 핵심 IDDL 스펙
│  ├─ iddl-1.0-draft.md          (영문 스펙)
│  ├─ iddl-1.0-spec-ko.md        (한글 스펙)
│  ├─ iddl.d.ts                  (TypeScript 타입 정의)
│  └─ iddl-key-pool.md           (키 풀 레퍼런스)
│
├─ 1-page/              # Page 컴포넌트 (Root)
│  ├─ page.gpt.spec.md
│  └─ page.gemini.spec.md
│
├─ 2-section/           # Section 컴포넌트 (Layout regions)
│  └─ section.spec.md
│
├─ 3-block/             # Block (Group) 컴포넌트 (Logical grouping)
│  └─ (스펙 문서 작성 예정)
│
├─ 4-element/           # Element (Item) 컴포넌트 (Primitives)
│  ├─ text/                      (정적 콘텐츠)
│  ├─ field/                     (데이터 바인딩)
│  │  └─ field.spec.md  ✅
│  ├─ action/                    (인터랙션)
│  └─ separator/                 (구분선)
│
├─ 5-overlay/           # Overlay 컴포넌트 (Floating UI)
│  └─ (스펙 문서 작성 예정)
│
└─ 9-meta/              # 메타 문서 (분석, 로드맵)
   ├─ iddl-coverage-analysis.md
   └─ renderer-improvement-roadmap.md
```

## 🎯 IDDL 컴포넌트 계층

```
Page (Root - Application level)
 ├─ role="Application": Full-screen app with dynamic grid
 ├─ role="Document": Scrollable content page
 ├─ role="Focus": Centered content (login, payment)
 └─ role="Fullscreen": Locked viewport (presentation)
      └─ Section (Layout regions)
          ├─ ActivityBar, PrimarySidebar, Editor, Panel, etc.
          └─ Block (Logical grouping - spec: "Group")
              ├─ Form, Card, Toolbar, List, Grid, Tabs, etc.
              └─ Element (Primitives - spec: "Item")
                  ├─ Text (Title, Body, Label, Code, Badge, etc.)
                  ├─ Field (21 dataTypes: text, email, number, select, etc.)
                  ├─ Action (Button, IconButton, Link, MenuItem)
                  └─ Separator (Horizontal, Vertical)

Overlay (Floating UI)
 └─ Dialog, Drawer, Popover, Toast, Tooltip, ContextMenu
```

## 🚀 빠른 시작

### 1. IDDL 개념 이해하기

읽는 순서:
1. [0-core/iddl-1.0-spec-ko.md](./0-core/iddl-1.0-spec-ko.md) - IDDL 핵심 개념
2. [0-core/iddl.d.ts](./0-core/iddl.d.ts) - TypeScript 타입 시스템
3. [0-core/iddl-key-pool.md](./0-core/iddl-key-pool.md) - 사용 가능한 키 목록

### 2. 컴포넌트별 스펙 확인

- **Page**: [1-page/](./1-page/) - 최상위 루트 컴포넌트
- **Section**: [2-section/](./2-section/) - 레이아웃 영역
- **Block**: [3-block/](./3-block/) - 논리적 그룹핑
- **Element**: [4-element/](./4-element/) - 기본 구성 요소
  - [field/](./4-element/field/) - 폼 입력 (21개 dataType)
  - [text/](./4-element/text/) - 정적 콘텐츠
  - [action/](./4-element/action/) - 버튼, 링크
  - [separator/](./4-element/separator/) - 구분선
- **Overlay**: [5-overlay/](./5-overlay/) - Floating UI

### 3. 구현 현황 확인

- [9-meta/iddl-coverage-analysis.md](./9-meta/iddl-coverage-analysis.md) - 구현 커버리지
- [9-meta/renderer-improvement-roadmap.md](./9-meta/renderer-improvement-roadmap.md) - 개선 로드맵

## 📊 스펙 문서 현황

| Component | 스펙 완료 | 구현 코드 위치 |
|-----------|----------|--------------|
| **Core** | ✅ | - |
| **Page** | ✅ | `src/components/types/Page/` |
| **Section** | ✅ | `src/components/types/Section/` |
| **Block** | ⚠️ 필요 | `src/components/types/Block/` |
| **Element - Text** | ⚠️ 필요 | `src/components/types/Element/Text/` |
| **Element - Field** | ✅ | `src/components/types/Element/Field/` |
| **Element - Action** | ⚠️ 필요 | `src/components/types/Element/Action/` |
| **Element - Separator** | ⚠️ 필요 | `src/components/types/Element/Separator/` |
| **Overlay** | ⚠️ 필요 | `src/components/types/Overlay/` |

**범례**:
- ✅ 스펙 완료
- ⚠️ 스펙 작성 필요
- 🚧 스펙 작성 중

## 🎯 5 Axes System

모든 IDDL 컴포넌트는 **5가지 축(Axes)**으로 정의됩니다:

1. **Type**: 컴포넌트 분류 (Page, Section, Block, Element, Overlay)
2. **Role**: 구체적인 역할 (Button, TextInput, Title, ActivityBar, etc.)
3. **Prominence**: 시각적 중요도 (Hero, Primary, Secondary, Tertiary)
4. **Intent**: 의미적 색상 (Neutral, Brand, Positive, Caution, Critical, Info)
5. **Density**: 간격/크기 (Comfortable, Standard, Compact)

**핵심 공식**:
```
prominence × intent × density × state → className (자동 생성)
```

개발자는 "왜"(why)만 선언하고, 시스템이 "어떻게"(how)를 자동 처리합니다.

## 🔍 용어 주의사항

**스펙 vs 코드 용어 차이**:

| 스펙 용어 | 코드 폴더명 | 이유 |
|----------|-----------|------|
| Group | `Block/` | 코드 구조 일관성 |
| Item | `Element/` | TypeScript 예약어 충돌 방지 |

**읽을 때**: 스펙 문서는 "Group", "Item" 사용
**코딩할 때**: 코드는 `Block/`, `Element/` 폴더 사용

## 🔗 관련 문서

**프로젝트 비전**:
- [../core/0-evolution/application-platform-vision.md](../core/0-evolution/application-platform-vision.md) - 엔터프라이즈 플랫폼 비전
- [../core/0-evolution/phase-1-declarative-ui.md](../core/0-evolution/phase-1-declarative-ui.md) - Phase 1 현황
- [../core/0-evolution/enterprise-features-checklist.md](../core/0-evolution/enterprise-features-checklist.md) - 100+ 엔터프라이즈 기능

**구현 레퍼런스**:
- [../core/3-reference/](../core/3-reference/) - API 레퍼런스, 개발자 가이드

## 📝 스펙 작성 가이드

새로운 스펙을 작성할 때는 다음 구조를 따릅니다:

```markdown
# {Component} Specification

## 개요
- 컴포넌트의 목적과 역할

## {Component}Role 타입
- 지원하는 모든 role 정의

## Props API
- TypeScript 인터페이스
- 각 prop 설명

## 사용 예시
- 실제 코드 예시 (최소 3개)

## Accessibility
- ARIA 속성
- 키보드 탐색

## 구현 세부사항
- 렌더러가 따라야 할 규칙
- CVA variants 정의

## 관련 문서
- 다른 스펙 링크
```

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**Phase**: Phase 1 (~80% 완료)
**목표**: 엔터프라이즈 애플리케이션 플랫폼

**문의**: 스펙에 대한 질문이나 개선 제안은 이슈로 등록해주세요.
