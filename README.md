# IDE UI Kit - 엔터프라이즈 애플리케이션 플랫폼

> **"VS Code, Figma처럼 만들고 싶다면?"**
>
> 상용 애플리케이션에 필요한 모든 것을 Full Package로 제공하는 UI 플랫폼

**Core Innovation**: IDDL (Intent-Driven Design Language) - 의도를 선언하면 패턴대로 화면이 나오는 선언적 UI 시스템

**Current Status**: Phase 1 (선언적 UI 렌더링) 진행 중 (~80% 완성)

---

## 🎯 프로젝트 목표

### 문제: 엔터프라이즈 앱을 만들기 어렵다

VS Code, Figma, Notion 같은 상용 애플리케이션을 만들려고 하면:

1. **세세한 디자인 문제가 끊임없이 발생**
   - 버튼 색상, 간격, 폰트를 매번 결정
   - 개발자마다 다른 스타일
   - 일관성 유지가 어려움

2. **기본 기능을 처음부터 구현해야 함**
   - Command Palette (Cmd+K)
   - 키보드 단축키 시스템
   - 패널 리사이징
   - Drag & Drop
   - Multi-select (Cmd+클릭, Shift+클릭)
   - Context Menu
   - ...

3. **기존 디자인 시스템은 겉모습만 제공**
   - Material-UI, shadcn/ui: 예쁜 버튼, 인풋만
   - 애플리케이션 레벨의 상호작용은 직접 구현
   - 전체 앱의 조율이 안 됨

### 해결책: 엔터프라이즈급 Full Package

이 프로젝트는 **3단계 전략**으로 문제를 해결합니다:

```
Phase 1: 선언적 UI 렌더링 (현재, ~80%)
         "의도를 선언하면 패턴대로 화면이 나온다"

Phase 2: 데이터 바인딩 & 상태 (다음)
         "입력과 상태가 자동으로 연결된다"

Phase 3: 인터랙션 행동 시스템 (최종 목표)
         "포커스, 선택, 리사이징이 자연스럽게 동작한다"
```

**최종 목표**: VS Code, Figma에 **당연히 있는** 기능들을 패키지로 제공

---

## 🚀 핵심 기능

### ✅ 이미 제공되는 것 (Phase 1)

| 기능 | 설명 | 상태 |
|------|------|------|
| **IDDL** | 의도 기반 선언적 UI 언어 | ✅ 스펙 완성 |
| **Design Tokens** | 색상, 간격, 타이포그래피 시스템 | ✅ 완성 |
| **Layout System** | Depth-based 계층 레이아웃 | ✅ 완성 |
| **Theme System** | Light/Dark, Color schemes, Density | ✅ 완성 |
| **Page Component** | Application/Document/Focus/Fullscreen | ✅ 95% |
| **Resizable Panels** | 드래그 리사이징, 최소/최대 제한 | ✅ 완성 |
| **Command Palette** | Cmd+K 글로벌 명령 검색 | ✅ 기본 완성 |
| **IDDL Inspector** | Cmd+D 컴포넌트 트리 디버깅 | ✅ 완성 |

### 🚧 진행 중 (Phase 1)

| 기능 | 설명 | 상태 |
|------|------|------|
| **CVA Variants** | prominence × intent 패턴 시스템 | 🚧 70% |
| **Field Components** | 21가지 dataType (text, number, date...) | 🚧 60% |
| **Block Components** | Card, Form, Toolbar, List, Grid | 🚧 70% |
| **Search Modal** | 글로벌 검색 | 🚧 UI 완성 |
| **Settings Modal** | 설정 패널 | 🚧 UI 완성 |

### 🎯 계획됨 (Phase 2-3)

| 기능 | 설명 | Phase |
|------|------|-------|
| **Keyboard Navigation** | 방향키, Tab, 글로벌 단축키 | Phase 3 |
| **Focus Management** | Focus Trap, Restore, Scope | Phase 3 |
| **Selection System** | 단일/다중 선택, Cmd+클릭 | Phase 3 |
| **Drag & Drop** | 항목 순서 변경, 파일 이동 | Phase 3 |
| **Undo/Redo** | 히스토리 관리 (Cmd+Z) | Phase 2-3 |
| **Context Menu** | 우클릭 메뉴 | Phase 3 |
| **Data Binding** | model 기반 자동 바인딩 | Phase 2 |
| **Validation** | dataType 기반 자동 검증 | Phase 2 |

**→ [엔터프라이즈 기능 전체 체크리스트](./docs/2-areas/core/0-evolution/enterprise-features-checklist.md) (100+ 기능)**

---

## 🤔 Why: 왜 IDDL이 필요한가?

### 문제: 의도의 손실

기존 UI 개발 과정에서 **의도(Intent)**가 계속 손실됩니다:

```
디자이너 의도
  "이 버튼은 중요하니까 눈에 띄게"
  "이 텍스트는 부연 설명이니까 덜 중요하게"

     ↓ Figma

개발자가 받는 것
  "파란색 배경, 16px 패딩, 14px 글꼴"
  "회색 텍스트, 12px 글꼴, 60% 투명도"

     ↓ 구현

코드
  <button className="bg-blue-500 px-4 py-2 text-sm">
  <span className="text-gray-400 text-xs opacity-60">
```

**결과**: "왜 파란색인가?", "왜 14px인가?"를 아무도 모릅니다. 변경이 두렵습니다.

---

### 해결: 의도의 선언

IDDL은 **"왜(Why)"를 코드로 만듭니다**:

```json
{
  "type": "Action",
  "label": "저장",
  "prominence": "Primary",   // "중요하다"
  "intent": "Positive"       // "긍정적 결과"
}

{
  "type": "Text",
  "content": "마지막 저장: 2분 전",
  "prominence": "Tertiary"   // "덜 중요하다"
}
```

**의도가 명확하면**:
- ✅ LLM이 UI를 생성할 수 있습니다 ("중요한 저장 버튼" → Primary + Positive)
- ✅ 디자인 시스템 변경 시 자동으로 업데이트됩니다
- ✅ 접근성, 반응형이 자동으로 처리됩니다
- ✅ 코드 리뷰에서 의도를 논의할 수 있습니다

---

## 📖 Background: 배경

### UI 개발의 3가지 관점

1. **디자이너**: "이 요소는 왜 중요한가?" (의도)
2. **개발자**: "어떻게 구현하는가?" (구현)
3. **LLM**: "무엇을 만드는가?" (패턴 학습)

**문제**: 세 관점이 연결되지 않습니다.

### IDDL의 접근

```
의도 (Intent)
  ↓
IDDL (선언)
  ↓
구현 (Implementation)
```

- **의도는 불변**: "중요하다", "긍정적이다"
- **구현은 가변**: 파란색 → 초록색, 16px → 14px
- **IDDL은 중간 계층**: 의도와 구현을 분리

---

## 💡 Core Concepts: 핵심 개념

### 1. 의도 기반 (Intent-Driven)

**"어떻게"가 아닌 "왜"를 선언합니다.**

```json
// ❌ How: 구현 지시
{
  "backgroundColor": "#3b82f6",
  "padding": "16px 24px",
  "fontWeight": 600,
  "borderRadius": "8px"
}

// ✅ Why: 의도 선언
{
  "type": "Action",
  "prominence": "Primary",  // 가장 중요
  "intent": "Brand"         // 브랜드 액션
}
```

---

### 2. 4가지 핵심 질문

모든 UI 요소는 4가지 질문에 답합니다:

```json
{
  "type": "Action",        // 1. 무엇인가? (What)
  "role": "Button",        // 2. 어떤 역할인가? (Role)
  "prominence": "Primary", // 3. 얼마나 중요한가? (How Prominent)
  "intent": "Positive",    // 4. 어떤 의미인가? (What Intent)
  "density": "Standard"    // 보너스: 얼마나 여유있는가?
}
```

이 5가지 속성만으로 **모든 시각적 결정이 자동**으로 이루어집니다.

---

### 3. 계층 구조 (Hierarchy)

IDDL은 **의미적 계층**을 따릅니다:

```
Page (루트)
 └─ Section (영역: Header, Main, Sidebar)
     └─ Group (묶음: Form, Table, Card)
         └─ Primitives (요소: Text, Field, Action)
```

**장점**:
- 각 레벨이 명확한 책임을 가집니다
- `mode`(view/edit)가 Section에서 하위로 전파됩니다
- 구조만 봐도 UI를 이해할 수 있습니다

---

### 4. LLM 친화적

IDDL은 **LLM이 이해하고 생성하기 쉽게** 설계되었습니다:

```
User: "사용자 목록 페이지 만들어줘. 검색 기능 있고,
       신규 사용자 버튼은 눈에 띄게."

LLM: "알겠습니다. 구조를 생성합니다..."
     → prominence: Primary (눈에 띄게)
     → intent: Brand (신규 생성 액션)
     → role: Table (목록)
```

**왜 LLM 친화적인가?**
- 자연어 개념(중요하다, 긍정적이다)과 매핑됩니다
- JSON 구조가 명확하고 일관적입니다
- 예시만 보면 패턴을 학습할 수 있습니다

---

## 🎯 Design Philosophy: 설계 철학

### 1. 의도 우선 (Intent First)

**Bad**:
```json
{
  "className": "text-sm text-gray-600"
}
```
→ "왜 회색인가?"를 알 수 없습니다.

**Good**:
```json
{
  "prominence": "Tertiary",
  "intent": "Neutral"
}
```
→ "덜 중요하고, 중립적이다"가 명확합니다.

---

### 2. 선언적 (Declarative)

**Bad** (명령형):
```typescript
if (mode === 'edit') {
  return <input value={value} onChange={...} />
} else {
  return <span>{value}</span>
}
```

**Good** (선언적):
```json
{
  "type": "Field",
  "model": "user.email",
  "mode": "edit"
}
```
→ 렌더러가 알아서 처리합니다.

---

### 3. 불변 vs 가변

| 불변 (Invariant) | 가변 (Variant) |
|------------------|----------------|
| prominence (중요도) | 색상 |
| intent (의미) | 크기 |
| role (역할) | 폰트 |
| 구조 (hierarchy) | 간격 |

**IDDL은 불변만 선언하고, 가변은 테마가 결정합니다.**

---

### 4. 점진적 복잡성

**Level 0** (입문):
```json
{
  "type": "Text",
  "content": "Hello"
}
```

**Level 1** (속성 추가):
```json
{
  "type": "Text",
  "content": "Hello",
  "prominence": "Hero",
  "intent": "Brand"
}
```

**Level 2** (조건부):
```json
{
  "type": "Text",
  "content": "Hello",
  "condition": {
    "if": "user.isAdmin",
    "then": { "intent": "Positive" }
  }
}
```

---

## 🏗️ Architecture: 아키텍처

### IDDL 생태계

```
┌─────────────────────────────────────────┐
│           Applications                   │
│  (CMS, Dashboard, Admin Panel)          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         IDDL Specification              │
│   (JSON Schema, 의도 선언)              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          Renderers                      │
│  • React Renderer                       │
│  • Vue Renderer                         │
│  • Mobile Renderer                      │
│  • AI-generated Renderer                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│        Design Systems                   │
│  • Material Design                      │
│  • Tailwind                             │
│  • Custom Theme                         │
└─────────────────────────────────────────┘
```

---

### 역할 분리

| 역할 | 책임 |
|------|------|
| **IDDL Spec** | 의도 정의 (prominence, intent, role) |
| **Renderer** | 의도 → UI 변환 (React, Vue, etc.) |
| **Design System** | 시각적 토큰 (색상, 크기, 간격) |
| **Application** | 비즈니스 로직 + IDDL 생성 |

---

## 🚀 Quick Start

### 1. 첫 번째 IDDL

```json
{
  "type": "Page",
  "title": "Hello IDDL",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "children": [
        {
          "type": "Group",
          "role": "Card",
          "children": [
            {
              "type": "Text",
              "role": "Title",
              "content": "Welcome",
              "prominence": "Primary"
            },
            {
              "type": "Text",
              "role": "Body",
              "content": "This is your first IDDL UI",
              "prominence": "Secondary"
            },
            {
              "type": "Action",
              "label": "Get Started",
              "prominence": "Primary",
              "intent": "Brand",
              "behavior": {
                "action": "navigate",
                "to": "/dashboard"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 2. 렌더링

```typescript
import { renderIDDL } from '@iddl/react-renderer';

const ui = renderIDDL(iddlSpec);
```

---

## 📚 Learn More

### 학습 경로

**[📖 Full Documentation](./apps/docs/)**

34개 문서로 구성된 완벽한 학습 커리큘럼:

- **Level 0**: [시작하기](./apps/docs/00-getting-started/) (3개 문서, 30분)
  - IDDL이 무엇인지, 왜 필요한지, 기본 사용법

- **Level 1**: [핵심 속성](./apps/docs/01-fundamentals/) (5개 문서, 1시간)
  - prominence, intent, density, role, 속성 조합

- **Level 2**: [구조 이해](./apps/docs/02-structure/) (5개 문서, 1시간)
  - Primitives, Group, Section, Overlay, Page

- **Level 3**: [데이터 상호작용](./apps/docs/03-data-interaction/) (5개 문서, 1.5시간)
  - Field 타입, 검증, Action, 조건부 렌더링, 상태 관리

- **Level 4**: [실전 패턴](./apps/docs/04-patterns/) (5개 문서, 2시간)
  - CRUD, 상세 페이지, 폼, 대시보드, Wizard

- **Level 5**: [고급 주제](./apps/docs/05-advanced/) (5개 문서, 2시간)
  - 커스텀 확장, 반응형, 성능, 접근성, Best Practices

- **Appendix**: [참조](./apps/docs/06-reference/) (5개 문서)
  - API 레퍼런스, 속성 매트릭스, 문제 해결

### 빠른 참조

- **[API Reference](./apps/docs/06-reference/api-reference.md)** - 전체 스펙 요약
- **[Specification v1.0.1](docs/2-areas/spec/iddl-spec-1.0.1.md)** - 공식 스펙 문서

---

## 🎨 Example: Before & After

### Before (기존 방식)

```tsx
// 의도를 알 수 없는 코드
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
    User Profile
  </h2>
  <div className="space-y-3">
    <div className="flex items-center">
      <span className="text-sm text-gray-600 w-24">Email:</span>
      <span className="text-base text-gray-900">user@example.com</span>
    </div>
  </div>
  <div className="flex justify-end gap-2 mt-6">
    <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
      Cancel
    </button>
    <button className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded">
      Save
    </button>
  </div>
</div>
```

**문제**:
- "왜 파란색인가?" → 모름
- "왜 text-sm인가?" → 모름
- LLM이 패턴을 이해하기 어려움
- 디자인 시스템 변경 시 수동 수정 필요

---

### After (IDDL 방식)

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "User Profile",
      "prominence": "Primary"
    },
    {
      "type": "Field",
      "label": "Email",
      "model": "user.email",
      "mode": "view"
    },
    {
      "type": "Group",
      "role": "Toolbar",
      "children": [
        {
          "type": "Action",
          "label": "Cancel",
          "prominence": "Secondary",
          "intent": "Neutral",
          "behavior": { "action": "navigate", "to": "/back" }
        },
        {
          "type": "Action",
          "label": "Save",
          "prominence": "Primary",
          "intent": "Positive",
          "behavior": { "action": "submit" }
        }
      ]
    }
  ]
}
```

**장점**:
- ✅ 의도가 명확: Primary = 중요, Positive = 긍정적 액션
- ✅ LLM이 패턴을 이해: "저장 버튼은 Primary + Positive"
- ✅ 디자인 시스템 변경 시 자동 업데이트
- ✅ 접근성, 반응형 자동 처리

---

## 🤖 LLM Integration

### LLM이 IDDL을 생성하는 방법

```
User: "사용자 등록 폼 만들어줘. 이메일, 비밀번호, 이름 필드가 필요하고,
       제출 버튼은 눈에 띄게 만들어줘."

LLM 추론:
1. "등록 폼" → type: Group, role: Form
2. "이메일, 비밀번호, 이름" → type: Field, dataType 자동 추론
3. "눈에 띄게" → prominence: Primary
4. "제출" → intent: Positive (긍정적 결과)

생성된 IDDL:
{
  "type": "Group",
  "role": "Form",
  "children": [
    { "type": "Field", "label": "Email", "dataType": "email", "required": true },
    { "type": "Field", "label": "Password", "dataType": "password", "required": true },
    { "type": "Field", "label": "Name", "dataType": "text", "required": true },
    {
      "type": "Action",
      "label": "Sign Up",
      "prominence": "Primary",
      "intent": "Positive",
      "behavior": { "action": "submit" }
    }
  ]
}
```

---

## 🌍 Use Cases: 사용 사례

### 1. CMS (Content Management System)

```json
// LLM: "블로그 포스트 편집기"
{
  "type": "Page",
  "layout": "single",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "edit",
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            { "type": "Field", "label": "Title", "dataType": "text" },
            { "type": "Field", "label": "Content", "dataType": "richtext" },
            { "type": "Action", "label": "Publish", "prominence": "Primary", "intent": "Positive" }
          ]
        }
      ]
    }
  ]
}
```

---

### 2. Admin Dashboard

```json
// LLM: "매출 대시보드"
{
  "type": "Page",
  "layout": "dashboard",
  "children": [
    {
      "type": "Group",
      "role": "Grid",
      "children": [
        {
          "type": "Group",
          "role": "Card",
          "intent": "Positive",
          "children": [
            { "type": "Field", "model": "stats.revenue", "dataType": "currency", "prominence": "Hero" },
            { "type": "Text", "content": "Revenue", "prominence": "Tertiary" }
          ]
        }
      ]
    }
  ]
}
```

---

### 3. Mobile App

```json
// 반응형 자동 처리
{
  "type": "Overlay",
  "role": "Dialog",  // Desktop: 중앙 모달
  "condition": {
    "if": "$screenSize === 'mobile'",
    "then": { "role": "Sheet" }  // Mobile: 하단 시트
  }
}
```

---

## 🔧 Technical Details: 기술 세부사항

### 이 프로젝트 (React Renderer + Demo)

```bash
# 설치
pnpm install

# 개발 서버
pnpm dev

# 빌드
pnpm build
```

**Tech Stack**:
- React 19 + TypeScript
- Vite 7
- TailwindCSS 4.x
- IDDL Renderer (Custom)

**Structure**:
```
ide-ui-kit/
├── apps/
│   └── docs/               # 📚 IDDL 학습 문서 (34개)
├── spec/                   # 📋 IDDL Specification
│   ├── iddl-spec-1.0.1.md
│   └── iddl-coverage-analysis.md
├── src/
│   ├── components/         # React Components
│   │   ├── atoms/          # IDDL Primitives (Text, Field, Action)
│   │   └── ...
│   └── renderer/           # IDDL → React Renderer
└── README.md               # 👈 You are here
```

---

## 🤝 Contributing

IDDL은 **오픈 스펙**입니다. 누구나 기여할 수 있습니다:

1. **Renderer 구현**: Vue, Svelte, React Native 등
2. **확장 제안**: 새로운 role, dataType, behavior
3. **문서 개선**: 번역, 예시 추가
4. **피드백**: Issue에 사용 사례 공유

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

IDDL은 다음에서 영감을 받았습니다:

- **Declarative UI**: React, SwiftUI, Flutter
- **Design Tokens**: Design System 커뮤니티
- **Intent-Based Design**: Material Design, Human Interface Guidelines
- **LLM-Friendly DSL**: OpenAPI, JSON Schema

---

## 📚 핵심 문서

### 프로젝트 비전 & 전략

- **[Application Platform Vision](./docs/2-areas/core/0-evolution/application-platform-vision.md)** - 전체 프로젝트 비전과 3-Phase 전략
- **[Phase 1: Declarative UI](./docs/2-areas/core/0-evolution/phase-1-declarative-ui.md)** - 현재 Phase 상세 (~80% 완성)
- **[Enterprise Features Checklist](./docs/2-areas/core/0-evolution/enterprise-features-checklist.md)** - VS Code/Figma 기능 100+ 체크리스트
- **[IDE Design Philosophy](./docs/2-areas/core/0-evolution/ide-design-philosophy.md)** - IDDL의 디자인 철학

### IDDL 스펙 & 레퍼런스

- **[IDDL 1.0 Spec (한글)](./docs/2-areas/spec/iddl-1.0-spec-ko.md)** - 공식 스펙 문서
- **[IDDL 1.0 Draft (English)](./docs/2-areas/spec/iddl-1.0-draft.md)** - Official specification
- **[Standard Roles Registry](./docs/2-areas/core/3-reference/iddl-standard-roles.md)** - 표준 Role 레지스트리
- **[Developer Guide (한글)](./docs/2-areas/core/3-reference/iddl-developer-guide-ko.md)** - 개발자 치트 시트
- **[Renderer Guide](./docs/2-areas/core/3-reference/iddl-renderer-guide.md)** - 렌더러 구현 가이드

### 학습 자료

- **[Getting Started](./apps/docs/00-getting-started/)** - IDDL 시작하기 (30분)
- **[Fundamentals](./apps/docs/01-fundamentals/)** - 핵심 개념 (prominence, intent, role)
- **[Structure](./apps/docs/02-structure/)** - Page, Section, Block, Element 계층
- **[Full Documentation](./apps/docs/)** - 34개 문서 완벽 커리큘럼

---

## 📬 Contact

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: [Full Docs](./apps/docs/)

---

**Built with ❤️ for Enterprise Applications**

**Status**: Phase 1 (Declarative UI) ~80% Complete | Phase 2-3 Coming Soon
