# [folder-structure] MDK src 폴더 구조 재설계 제안서

**작성일**: 2026-01-15
**버전**: 1.0
**태그**: `#folder-structure` `#architecture` `#3-tier-intent` `#design-system`

---

## 📑 목차

1. [서론: MDK 철학과 폴더 구조의 관계](#서론-mdk-철학과-폴더-구조의-관계)
2. [현재 구조 분석](#현재-구조-분석)
3. [제안된 구조: Hybrid Intent Structure](#제안된-구조-hybrid-intent-structure)
4. [설계 원칙](#설계-원칙)
5. [폴더별 상세 설명](#폴더별-상세-설명)
6. [Import 패턴](#import-패턴)
7. [마이그레이션 계획](#마이그레이션-계획)
8. [Option 비교](#option-비교)
9. [FAQ](#faq)
10. [부록](#부록)

---

## 서론: MDK 철학과 폴더 구조의 관계

### MDK의 핵심 철학: 3-Tier Intent System

Minimal Design Kit(MDK)은 **"Intent First, Props Follow"**라는 철학을 기반으로 합니다. 이는 컴포넌트를 설계할 때 다음 순서를 따라야 함을 의미합니다:

```
1. WHY (왜)   → Intent를 정의
2. WHAT (무엇) → Intent가 제공하는 기능
3. HOW (어떻게) → Component로 구현
```

### 3-Tier 구조

```
Tier 1: Primitive (Container Component)
   ↓ 무엇을 만드는가?
Tier 2: Intent (Purpose/Why)
   ↓ 왜 필요한가?
Tier 3: Component (Implementation/How)
   ↓ 어떻게 구현하는가?
```

**API Pattern**: `Primitive.{Intent}.{Component}`

### 예시: Field Component

```tsx
// Tier 1: Primitive
<Field name="email">

  {/* Tier 2: Intent - Guidance (왜? 사용자가 무엇을 입력해야 하는지 알아야 함) */}
  <Field.Guidance>
    <Field.Label>Email</Field.Label>              {/* Tier 3: Component */}
    <Field.Description>Login email</Field.Description>
  </Field.Guidance>

  {/* Tier 2: Intent - Control (왜? 사용자가 데이터를 입력할 수단이 필요함) */}
  <Field.Control>
    <Input />                                      {/* Tier 3: Component */}
  </Field.Control>

  {/* Tier 2: Intent - Validation (왜? 데이터가 올바른지 확인해야 함) */}
  <Field.Validation schema={emailSchema} />

  {/* Tier 2: Intent - Feedback (왜? 사용자가 입력 결과를 알아야 함) */}
  <Field.Feedback>
    <Field.Error />                                {/* Tier 3: Component */}
  </Field.Feedback>

</Field>
```

### 6가지 핵심 Intent

**Field의 6가지 Intent**:
1. **Guidance** - 사용자에게 입력 가이드 제공 (label, description, placeholder, required)
2. **Control** - 입력 메커니즘 제공 (Input, Select, Textarea, Custom UI)
3. **Validation** - 데이터 정확성 보장 (schema, rules, triggers, dependencies)
4. **Feedback** - 검증 결과 표시 (error, success, warning, info)
5. **State** - 필드 상태 관리 (value, touched, dirty, valid, disabled)
6. **Transform** - 데이터 포맷 변환 (format, parse, sanitize)

**Action의 6가지 Intent**:
1. **Handler** - 액션 동작 정의 (onClick, async handling)
2. **State** - 액션 상태 관리 (loading, disabled, pending, active)
3. **Confirmation** - 사용자 확인 요청 (dialog, message, buttons)
4. **Feedback** - 액션 결과 표시 (success, error, progress, toast)
5. **Prevention** - 원치 않는 실행 방지 (once, debounce, throttle, cooldown)
6. **Lifecycle** - 액션 생명주기 훅 (onStart, onSuccess, onError, onComplete)

### 폴더 구조가 중요한 이유

폴더 구조는 단순히 파일을 정리하는 것이 아니라, **시스템의 철학을 시각화**하는 도구입니다:

1. **교육적 가치**: 새로운 개발자가 폴더 탐색만으로 Intent 개념을 이해할 수 있음
2. **인지 부하 감소**: "이 컴포넌트가 왜 존재하는가?"라는 질문에 대한 답이 폴더명에 있음
3. **확장성**: Intent별로 격리된 구조는 새로운 Component 추가를 쉽게 만듦
4. **유지보수성**: 명확한 책임 분리로 코드 변경 영향 범위를 최소화

**MDK 슬로건**: *"See the Intent, Control the Component"* (Intent를 보고, Component를 제어하라)

---

## 현재 구조 분석

### 현재 폴더 구조 (As-Is)

```
src/
├── apps/                    # 애플리케이션
│   ├── cms/
│   ├── crm/
│   │   └── drawer/
│   └── mail/
├── components/              # 공유 컴포넌트 (정체성 모호)
│   ├── SlidesPanel.tsx
│   ├── PropertiesPanel.tsx
│   └── FloatingToolbar.tsx
├── data/                    # JSON 데이터
│   └── crm/
├── design-system/           # 디자인 시스템 (플랫 구조)
│   ├── Frame/
│   │   └── Layout/
│   ├── text/
│   │   └── context/
│   │       ├── Card.tsx
│   │       ├── Prose.tsx
│   │       ├── Field.tsx
│   │       ├── Menu.tsx
│   │       └── Table.tsx
│   ├── token/
│   ├── lib/
│   ├── Action.tsx           # 루트 레벨 (3-Tier 구조 없음)
│   ├── Field.tsx            # 루트 레벨 (3-Tier 구조 없음)
│   ├── Separator.tsx
│   ├── Divider.tsx
│   ├── Section.tsx
│   ├── Overlay.tsx
│   ├── Experience.tsx
│   ├── Icon.tsx
│   └── theme.tsx
├── inspector/               # 개발자 도구
│   ├── components/
│   ├── hooks/
│   └── lib/
├── style/                   # 글로벌 스타일
│   ├── frame.css
│   └── ...
└── ui/                      # 재사용 UI (design-system과 차이 불명확)
    └── table/
```

### 문제점 분석

#### 1. **3-Tier Intent 구조 부재**

**문제**:
- `Field.tsx`, `Action.tsx`가 단일 파일로 존재
- Intent 개념이 코드에만 존재하고 폴더 구조에 반영되지 않음
- 교육적 가치 손실: 폴더 탐색만으로는 Intent 개념을 이해할 수 없음

**예시**:
```
현재: design-system/Field.tsx (단일 파일, 수백 라인)
이상적: design-system/Field/
          ├── Guidance/
          ├── Control/
          ├── Validation/
          └── Feedback/
```

#### 2. **확장성 한계**

**문제**:
- Field에 새로운 Intent 추가 시 단일 파일이 비대해짐
- 예: `Field.tsx` 파일이 1000+ 라인으로 증가
- 코드 충돌 가능성 증가 (여러 개발자가 같은 파일 수정)

**시나리오**:
```typescript
// Field.tsx (현재)
// 600 라인 코드...
// Guidance 관련 100 라인
// Control 관련 100 라인
// Validation 관련 100 라인
// ... 계속 증가
```

#### 3. **Components vs Design-System vs UI 경계 모호**

**문제**:
- `components/` - 무엇이 여기 들어가야 하는가?
- `design-system/` - 디자인 시스템 코어
- `ui/table/` - 왜 design-system과 분리되어 있는가?

**혼란 포인트**:
```
SlidesPanel.tsx는 왜 components/에 있고,
Table 컴포넌트는 왜 ui/table/에 있는가?
둘 다 재사용 가능한 컴포넌트인데 차이는?
```

#### 4. **Text System의 접근 불일치**

**conventions.md 규칙**:
> ALWAYS access text components via the main Text namespace: `Text.Card.Title`, `Text.Prose.Body`.
> NEVER directly import from `text/context/*`.

**현재 구조**:
```
design-system/text/context/Card.tsx
design-system/text/context/Prose.tsx
```

**문제**:
- 폴더 구조가 "직접 import하지 말라"는 규칙과 맞지 않음
- `context/` 폴더명이 혼란 야기 (React Context API와 혼동)

#### 5. **FSD (Feature-Sliced Design) 미준수**

**문제**:
- `inspector/`, `ui/` 폴더가 FSD 계층에 맞지 않음
- `components/`가 shared layer 역할을 하는지 불명확

**FSD 표준 계층**:
```
app/        - 애플리케이션 초기화
pages/      - 페이지 (라우트)
widgets/    - 복합 UI 블록
features/   - 기능 모듈
entities/   - 비즈니스 엔티티
shared/     - 공유 리소스
```

---

## 제안된 구조: Hybrid Intent Structure

### 설계 목표

사용자 요구사항 기반:
1. **교육 + 실무 균형**: Intent 구조가 명확하면서도 실용적
2. **대규모 확장 (30개+)**: 확장성과 유지보수성 필수
3. **전면 리팩토링 가능**: 이상적인 구조 추구

### 전체 폴더 트리 (To-Be)

```
src/
├── apps/                              # 📱 Applications (애플리케이션 계층)
│   ├── mail/
│   │   ├── MailApp.tsx
│   │   ├── MailSidebar.tsx
│   │   ├── MailList.tsx
│   │   ├── MailDetail.tsx
│   │   ├── MailHeader.tsx
│   │   ├── store.ts
│   │   ├── types.ts
│   │   └── mockData.ts
│   │
│   ├── crm/
│   │   ├── CRMApp.tsx
│   │   ├── CRMHeader.tsx
│   │   ├── CRMSidebar.tsx
│   │   ├── CRMTable.tsx
│   │   ├── CRMToolbar.tsx
│   │   ├── CRMDrawer.tsx
│   │   ├── drawer/
│   │   │   ├── DrawerHeader.tsx
│   │   │   ├── DrawerProperties.tsx
│   │   │   ├── DrawerActivity.tsx
│   │   │   ├── DrawerFooter.tsx
│   │   │   └── drawerUtils.ts
│   │   ├── store.ts
│   │   ├── types.ts
│   │   ├── dataLoader.ts
│   │   └── CRMConstants.ts
│   │
│   ├── cms/
│   │   ├── CMSApp.tsx
│   │   ├── CMSNavigation.tsx
│   │   ├── CMSSidebar.tsx
│   │   ├── CMSRightPanel.tsx
│   │   ├── SiteHeader.tsx
│   │   ├── HeaderHero.tsx
│   │   ├── BodyContentSection.tsx
│   │   ├── FeatureGridSection.tsx
│   │   ├── ScrollTabSection.tsx
│   │   ├── ImageFooterBanner.tsx
│   │   ├── FAQBoardFooter.tsx
│   │   ├── MainFooter.tsx
│   │   └── EditableWrapper.tsx
│   │
│   ├── SlideApp.tsx
│   ├── IDEApp.tsx
│   ├── LandingApp.tsx
│   ├── TokensApp.tsx
│   ├── TextSystemApp.tsx
│   └── LoginApp.tsx
│
├── design-system/                     # 🎨 Design System Core (디자인 시스템 코어)
│   │
│   ├── Field/                         # 🔷 Primitive: Field
│   │   ├── Field.tsx                  # Tier 1: Primitive Container + FieldContext Provider
│   │   │
│   │   ├── Guidance/                  # 🎯 Intent: Guidance (입력 가이드)
│   │   │   ├── Guidance.tsx           #    └─ Tier 2: GuidanceContext Provider
│   │   │   ├── Label.tsx              #       └─ Tier 3: Label Component
│   │   │   ├── Description.tsx        #       └─ Tier 3: Description Component
│   │   │   ├── Required.tsx           #       └─ Tier 3: Required Indicator
│   │   │   └── Placeholder.tsx        #       └─ Tier 3: Placeholder Component
│   │   │
│   │   ├── Control/                   # 🎯 Intent: Control (입력 제어)
│   │   │   ├── Control.tsx            #    └─ Tier 2: ControlContext Provider
│   │   │   ├── Input.tsx              #       └─ Tier 3: Input Component
│   │   │   ├── Textarea.tsx           #       └─ Tier 3: Textarea Component
│   │   │   └── Select.tsx             #       └─ Tier 3: Select Component
│   │   │
│   │   ├── Validation/                # 🎯 Intent: Validation (검증)
│   │   │   ├── Validation.tsx         #    └─ Tier 2: ValidationContext Provider
│   │   │   ├── Schema.tsx             #       └─ Tier 3: Schema Component
│   │   │   ├── Rules.tsx              #       └─ Tier 3: Rules Component
│   │   │   └── Dependencies.tsx       #       └─ Tier 3: Dependencies Component
│   │   │
│   │   ├── Feedback/                  # 🎯 Intent: Feedback (피드백)
│   │   │   ├── Feedback.tsx           #    └─ Tier 2: FeedbackContext Provider
│   │   │   ├── Error.tsx              #       └─ Tier 3: Error Component
│   │   │   ├── Success.tsx            #       └─ Tier 3: Success Component
│   │   │   ├── Warning.tsx            #       └─ Tier 3: Warning Component
│   │   │   └── Info.tsx               #       └─ Tier 3: Info Component
│   │   │
│   │   ├── State/                     # 🎯 Intent: State (상태 관리)
│   │   │   ├── State.tsx              #    └─ Tier 2: StateContext Provider
│   │   │   ├── Value.tsx              #       └─ Tier 3: Value Component
│   │   │   ├── Touched.tsx            #       └─ Tier 3: Touched State
│   │   │   └── Dirty.tsx              #       └─ Tier 3: Dirty State
│   │   │
│   │   ├── Transform/                 # 🎯 Intent: Transform (변환)
│   │   │   ├── Transform.tsx          #    └─ Tier 2: TransformContext Provider
│   │   │   ├── Format.tsx             #       └─ Tier 3: Format Component
│   │   │   ├── Parse.tsx              #       └─ Tier 3: Parse Component
│   │   │   └── Sanitize.tsx           #       └─ Tier 3: Sanitize Component
│   │   │
│   │   ├── Field.types.ts             # Type definitions
│   │   └── Field.utils.ts             # Utility functions
│   │
│   ├── Action/                        # 🔷 Primitive: Action
│   │   ├── Action.tsx                 # Tier 1: Primitive Container + ActionContext
│   │   │
│   │   ├── Handler/                   # 🎯 Intent: Handler (핸들러)
│   │   │   ├── Handler.tsx            #    └─ Tier 2: HandlerContext Provider
│   │   │   ├── OnClick.tsx            #       └─ Tier 3: OnClick Component
│   │   │   ├── OnSubmit.tsx           #       └─ Tier 3: OnSubmit Component
│   │   │   └── AsyncHandler.tsx       #       └─ Tier 3: Async Handler
│   │   │
│   │   ├── State/                     # 🎯 Intent: State (상태)
│   │   │   ├── State.tsx              #    └─ Tier 2: StateContext Provider
│   │   │   ├── Loading.tsx            #       └─ Tier 3: Loading Component
│   │   │   ├── Disabled.tsx           #       └─ Tier 3: Disabled State
│   │   │   └── Pending.tsx            #       └─ Tier 3: Pending State
│   │   │
│   │   ├── Confirmation/              # 🎯 Intent: Confirmation (확인)
│   │   │   ├── Confirmation.tsx       #    └─ Tier 2: ConfirmationContext
│   │   │   ├── Dialog.tsx             #       └─ Tier 3: Dialog Component
│   │   │   └── Message.tsx            #       └─ Tier 3: Message Component
│   │   │
│   │   ├── Feedback/                  # 🎯 Intent: Feedback (피드백)
│   │   │   ├── Feedback.tsx           #    └─ Tier 2: FeedbackContext Provider
│   │   │   ├── Success.tsx            #       └─ Tier 3: Success Component
│   │   │   ├── Error.tsx              #       └─ Tier 3: Error Component
│   │   │   └── Progress.tsx           #       └─ Tier 3: Progress Component
│   │   │
│   │   ├── Prevention/                # 🎯 Intent: Prevention (방지)
│   │   │   ├── Prevention.tsx         #    └─ Tier 2: PreventionContext
│   │   │   ├── Once.tsx               #       └─ Tier 3: Once Component
│   │   │   ├── Debounce.tsx           #       └─ Tier 3: Debounce Component
│   │   │   └── Throttle.tsx           #       └─ Tier 3: Throttle Component
│   │   │
│   │   ├── Lifecycle/                 # 🎯 Intent: Lifecycle (생명주기)
│   │   │   ├── Lifecycle.tsx          #    └─ Tier 2: LifecycleContext
│   │   │   ├── OnStart.tsx            #       └─ Tier 3: OnStart Hook
│   │   │   ├── OnSuccess.tsx          #       └─ Tier 3: OnSuccess Hook
│   │   │   └── OnError.tsx            #       └─ Tier 3: OnError Hook
│   │   │
│   │   ├── Action.types.ts
│   │   └── Action.utils.ts
│   │
│   ├── Frame/                         # 🔷 Primitive: Frame (레이아웃)
│   │   ├── Frame.tsx                  # Main Frame component
│   │   ├── FrameProps.ts              # Prop type definitions
│   │   ├── frameToSettings.ts         # Props → CSS converter
│   │   ├── Layout.ts                  # Layout presets (Stack, Row, Grid, etc.)
│   │   └── Frame.types.ts             # Additional types
│   │
│   ├── Text/                          # 🔷 Primitive: Text
│   │   ├── Text.tsx                   # Main Text component (namespace root)
│   │   │
│   │   ├── Card/                      # 📝 Context: Card (카드 텍스트)
│   │   │   ├── Card.tsx               #    └─ CardContext Provider
│   │   │   ├── Title.tsx              #       └─ Card Title Component
│   │   │   ├── Description.tsx        #       └─ Card Description
│   │   │   └── Caption.tsx            #       └─ Card Caption
│   │   │
│   │   ├── Prose/                     # 📝 Context: Prose (문서 텍스트)
│   │   │   ├── Prose.tsx              #    └─ ProseContext Provider
│   │   │   ├── H1.tsx                 #       └─ Heading 1
│   │   │   ├── H2.tsx                 #       └─ Heading 2
│   │   │   ├── H3.tsx                 #       └─ Heading 3
│   │   │   ├── H4.tsx                 #       └─ Heading 4
│   │   │   ├── Body.tsx               #       └─ Body Text
│   │   │   ├── BodySm.tsx             #       └─ Small Body Text
│   │   │   └── Caption.tsx            #       └─ Caption Text
│   │   │
│   │   ├── Menu/                      # 📝 Context: Menu (메뉴 텍스트)
│   │   │   ├── Menu.tsx               #    └─ MenuContext Provider
│   │   │   ├── Item.tsx               #       └─ Menu Item
│   │   │   └── Label.tsx              #       └─ Menu Label
│   │   │
│   │   ├── Field/                     # 📝 Context: Field (폼 필드 텍스트)
│   │   │   ├── Field.tsx              #    └─ FieldContext Provider
│   │   │   ├── Label.tsx              #       └─ Field Label
│   │   │   └── Helper.tsx             #       └─ Helper Text
│   │   │
│   │   ├── Table/                     # 📝 Context: Table (테이블 텍스트)
│   │   │   ├── Table.tsx              #    └─ TableContext Provider
│   │   │   ├── Header.tsx             #       └─ Table Header
│   │   │   └── Cell.tsx               #       └─ Table Cell
│   │   │
│   │   └── Text.types.ts              # Type definitions
│   │
│   ├── Separator/                     # 🔷 Simple Component (구분선)
│   │   └── Separator.tsx
│   │
│   ├── Divider/                       # 🔷 Simple Component (분할선)
│   │   └── Divider.tsx
│   │
│   ├── Section/                       # 🔷 Simple Component (섹션)
│   │   └── Section.tsx
│   │
│   ├── Overlay/                       # 🔷 Complex Component (오버레이)
│   │   ├── Overlay.tsx
│   │   └── Overlay.types.ts
│   │
│   ├── Experience/                    # 🔷 Layout Component (경험 레이아웃)
│   │   └── Experience.tsx
│   │
│   ├── Icon/                          # 🔷 Visual Component (아이콘)
│   │   └── Icon.tsx
│   │
│   ├── tokens/                        # 🎨 Design Tokens (디자인 토큰)
│   │   ├── tokens.1tier.css           # 1-tier tokens (기본)
│   │   ├── tokens.2tier.css           # 2-tier tokens (컴포넌트)
│   │   ├── tokens.palette.css         # Color system
│   │   ├── tokens.typography.css      # Typography scale
│   │   ├── tokens.components.css      # Component-specific tokens
│   │   ├── tokens.themes.css          # Theme definitions
│   │   ├── tokens.experiences.css     # Experience tokens
│   │   ├── token.const.1tier.ts       # TypeScript constants (1-tier)
│   │   └── token.const.2tier.ts       # TypeScript constants (2-tier)
│   │
│   ├── theme/                         # 🌓 Theme System (테마 시스템)
│   │   ├── theme.tsx                  # Theme provider & useTheme hook
│   │   └── ThemeContext.tsx           # Theme context (if needed)
│   │
│   └── lib/                           # 🛠️ Utilities (유틸리티)
│       ├── utils.ts                   # General utilities
│       ├── toToken.ts                 # Token conversion utility
│       └── types.ts                   # Shared type definitions
│
├── features/                          # 📦 Feature Modules (FSD - 기능 모듈)
│   │
│   ├── table/                         # Table Feature
│   │   ├── TableRoot.tsx              # Table root component
│   │   ├── TableHeader.tsx            # Table header
│   │   ├── TableRow.tsx               # Table row
│   │   ├── TableHead.tsx              # Table head cell
│   │   ├── TableCell.tsx              # Table body cell
│   │   ├── TableEmpty.tsx             # Empty state
│   │   ├── Table.tsx                  # Compound export
│   │   └── README.md                  # Feature documentation
│   │
│   └── inspector/                     # Inspector Feature
│       ├── InspectorOverlay.tsx       # Inspector overlay UI
│       ├── InspectorPanel.tsx         # Inspector panel
│       ├── PropertyTree.tsx           # Property tree viewer
│       ├── useInspectorHotkeys.ts     # Hotkey hook
│       ├── useInspectorTarget.ts      # Target hook
│       ├── fiber-utils.ts             # React Fiber utilities
│       └── inspector-utils.ts         # Inspector utilities
│
├── shared/                            # 🔄 Shared Resources (FSD - 공유 리소스)
│   ├── ui/                            # App-level shared UI components
│   │   ├── SlidesPanel.tsx            # Slides panel for SlideApp
│   │   ├── PropertiesPanel.tsx        # Properties panel
│   │   ├── FloatingToolbar.tsx        # Floating toolbar
│   │   └── TeoLogo.tsx                # Logo component
│   │
│   ├── data/                          # Shared data files
│   │   └── crm/
│   │       ├── deals.json
│   │       ├── companies.json
│   │       ├── people.json
│   │       ├── projects.json
│   │       ├── tasks.json
│   │       └── 서비스 관리.json
│   │
│   └── styles/                        # Global styles
│       ├── index.css                  # Main stylesheet with global resets
│       └── frame.css                  # Frame-specific styles
│
├── App.tsx                            # Root App component with routing
└── main.tsx                           # Entry point
```

### 구조 요약

| 폴더 | 역할 | 예시 |
|------|------|------|
| `apps/` | 애플리케이션 (라우트별) | MailApp, CRMApp, CMSApp |
| `design-system/` | 디자인 시스템 코어 (Primitives) | Field, Action, Frame, Text |
| `features/` | 독립적 기능 모듈 | table, inspector |
| `shared/` | 공유 리소스 | ui, data, styles |

---

## 설계 원칙

### 1. 3-Tier Intent Visibility (교육적 명확성)

**원칙**: 폴더 구조 자체가 3-Tier 철학을 시각적으로 표현해야 함

**Before (문제)**:
```
design-system/
└── Field.tsx  (모든 Intent가 하나의 파일에)
```

**After (해결)**:
```
design-system/Field/        ← Tier 1: Primitive
├── Field.tsx
├── Guidance/               ← Tier 2: Intent (WHY - 왜 필요한가?)
│   ├── Guidance.tsx        ← Intent Context
│   ├── Label.tsx           ← Tier 3: Component (HOW - 어떻게 구현?)
│   └── Description.tsx
├── Control/                ← Tier 2: Intent
│   ├── Control.tsx
│   └── Input.tsx           ← Tier 3: Component
└── Validation/             ← Tier 2: Intent
    └── ...
```

**교육적 이점**:
- ✅ 폴더 탐색만으로 Intent 개념 이해 가능
- ✅ "왜 이 컴포넌트가 있는가?"라는 질문에 대한 답이 폴더명에 존재
- ✅ 새로운 개발자의 온보딩 시간 단축
- ✅ 코드 리뷰 시 Intent 위반 즉시 발견

**실제 시나리오**:
```typescript
// 개발자가 Label 컴포넌트를 찾고 있다면?
// 폴더 경로가 답을 제공:
design-system/Field/Guidance/Label.tsx
// ↑ "아, Label은 Field의 Guidance Intent에 속하는구나!"
```

### 2. Direct Import Path (실무 실용성)

**원칙**: Barrel export 없이 직접 import로 명확한 의존성 표현

**Barrel Export 금지 이유** (사용자 global instruction):
- ❌ 번들 사이즈 증가 (tree-shaking 실패)
- ❌ 순환 참조 위험
- ❌ IDE 성능 저하
- ❌ "어디서 import되는가?" 추적 어려움

**Direct Import 예시**:
```tsx
// ❌ BAD: Barrel export
import { Field } from '../design-system'  // design-system/index.ts를 통해
import { Label } from '../design-system'

// ✅ GOOD: Direct import
import { Field } from '../design-system/Field/Field'
import { Label } from '../design-system/Field/Guidance/Label'
```

**실무적 이점**:
- ✅ IDE 자동완성이 정확하게 작동 (파일 경로 직접 노출)
- ✅ "Go to Definition" 기능이 바로 원본 파일로 이동
- ✅ 번들러의 tree-shaking이 정확하게 작동
- ✅ Import 경로만 보고 파일 위치 즉시 파악

**성능 벤치마크** (가상):
```
Barrel Export 방식:
  - 번들 사이즈: 450KB
  - tree-shaking: 부분적 실패
  - Build time: 2.3s

Direct Import 방식:
  - 번들 사이즈: 320KB (29% 감소)
  - tree-shaking: 완벽
  - Build time: 1.8s (22% 빠름)
```

### 3. Scalable Architecture (대규모 확장성)

**원칙**: 30개 이상의 Primitive/Intent/Component를 관리할 수 있는 구조

**확장 시나리오 1: 새로운 Component 추가**
```
Field/Guidance/ 폴더에 Tooltip 컴포넌트 추가

Before: Field/Guidance/
  ├── Guidance.tsx
  ├── Label.tsx
  └── Description.tsx

After: Field/Guidance/
  ├── Guidance.tsx
  ├── Label.tsx
  ├── Description.tsx
  ├── Tooltip.tsx        ← 🆕 새로운 컴포넌트
  └── HelpIcon.tsx       ← 🆕 새로운 컴포넌트
```

**확장 시나리오 2: 새로운 Intent 추가**
```
Field에 새로운 Intent "Analytics" 추가

Field/
├── Guidance/
├── Control/
├── Validation/
├── Feedback/
├── State/
├── Transform/
└── Analytics/          ← 🆕 새로운 Intent
    ├── Analytics.tsx
    ├── TrackFocus.tsx
    └── TrackChange.tsx
```

**확장 시나리오 3: 새로운 Primitive 추가**
```
design-system/에 새로운 Primitive "Form" 추가

design-system/
├── Field/
├── Action/
├── Frame/
├── Text/
└── Form/               ← 🆕 새로운 Primitive
    ├── Form.tsx
    ├── Submit/         ← Intent
    ├── Reset/          ← Intent
    └── Progress/       ← Intent
```

**확장성 메트릭**:
- Primitive별 독립성: 100% (다른 Primitive 수정 없이 확장)
- Intent별 독립성: 100% (다른 Intent 수정 없이 확장)
- 최대 중첩 깊이: 3 레벨 (관리 가능)
- 폴더당 평균 파일 수: 3-5개 (인지 부하 낮음)

### 4. FSD (Feature-Sliced Design) 준수

**원칙**: 계층별 책임 명확화 및 의존성 방향 강제

**FSD 계층 구조**:
```
apps/        ← 최상위: 애플리케이션 조합
   ↓ (의존)
features/    ← 중간: 독립적 기능 모듈
   ↓ (의존)
shared/      ← 하위: 공유 리소스
```

**의존성 규칙**:
- ✅ `apps/` → `features/`, `shared/`, `design-system/` 의존 가능
- ✅ `features/` → `shared/`, `design-system/` 의존 가능
- ✅ `shared/` → `design-system/` 의존 가능
- ❌ `shared/` → `features/` 의존 금지
- ❌ `design-system/` → 외부 의존 금지 (완전 독립)

**예시**:
```tsx
// ✅ GOOD: apps → features
// apps/mail/MailApp.tsx
import { Table } from '../../features/table/Table'

// ✅ GOOD: features → shared
// features/table/TableRoot.tsx
import { Frame } from '../../design-system/Frame/Frame'

// ❌ BAD: shared → features (역방향 의존)
// shared/ui/SlidesPanel.tsx
import { Table } from '../../features/table/Table'  // 금지!
```

**FSD 이점**:
- ✅ 순환 참조 방지
- ✅ 계층별 테스트 전략 수립 용이
- ✅ 모노레포 전환 시 패키지 분리 쉬움
- ✅ 의존성 그래프 시각화 가능

### 5. Context Inheritance Pattern

**원칙**: 하위 컴포넌트는 상위 Context를 자동으로 상속

**상속 구조**:
```tsx
<Field name="email">              {/* FieldContext 생성 */}
  <Field.Guidance label="Email">  {/* GuidanceContext 생성, FieldContext 상속 */}
    <Field.Label />               {/* 둘 다 상속 */}
  </Field.Guidance>
</Field>
```

**Context 상속 다이어그램**:
```
FieldContext { name, id, value, error, touched }
      ↓ (상속)
GuidanceContext { label, description, required, labelId }
      ↓ (상속)
Label Component
      ↓ (사용)
  - FieldContext.id (htmlFor에 연결)
  - GuidanceContext.label (텍스트 표시)
  - GuidanceContext.required (필수 표시)
```

**코드 예시**:
```tsx
// Label.tsx
export function Label() {
  const field = useFieldContext()     // FieldContext 자동 상속
  const guidance = useGuidanceContext() // GuidanceContext 직접 사용

  return (
    <label htmlFor={field.id}>
      {guidance.label}
      {guidance.required && <span>*</span>}
    </label>
  )
}
```

**이점**:
- ✅ Props drilling 제거
- ✅ 자동 ID 연결 (label의 htmlFor와 input의 id)
- ✅ 일관된 상태 공유
- ✅ 컴포넌트 간 결합도 감소

---

## 폴더별 상세 설명

### design-system/Field/ (Primitive)

**역할**: Form input 관련 모든 기능을 Intent 기반으로 제공

**폴더 구조**:
```
Field/
├── Field.tsx              # Tier 1: Primitive Container
├── Guidance/              # Intent: 사용자 가이드
├── Control/               # Intent: 입력 제어
├── Validation/            # Intent: 데이터 검증
├── Feedback/              # Intent: 결과 피드백
├── State/                 # Intent: 상태 관리
├── Transform/             # Intent: 데이터 변환
├── Field.types.ts         # 타입 정의
└── Field.utils.ts         # 유틸리티 함수
```

**Field.tsx (Tier 1)**:
```tsx
import { createContext, useContext } from 'react'

interface FieldContextValue {
  name: string
  id: string
  value: unknown
  error?: string
  touched: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

export function Field({ name, children }) {
  const id = useId()
  const [value, setValue] = useState()
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState()

  return (
    <FieldContext.Provider value={{ name, id, value, error, touched }}>
      <div data-field={name}>
        {children}
      </div>
    </FieldContext.Provider>
  )
}

export function useFieldContext() {
  const context = useContext(FieldContext)
  if (!context) throw new Error('useFieldContext must be within Field')
  return context
}
```

### design-system/Field/Guidance/ (Intent)

**역할**: 사용자에게 "무엇을 입력해야 하는가" 가이드 제공

**WHY**: 사용자가 입력할 내용을 명확히 이해해야 하기 때문

**폴더 구조**:
```
Guidance/
├── Guidance.tsx          # Tier 2: GuidanceContext Provider
├── Label.tsx             # Tier 3: 입력 필드 레이블
├── Description.tsx       # Tier 3: 입력 필드 설명
├── Required.tsx          # Tier 3: 필수 표시
└── Placeholder.tsx       # Tier 3: 플레이스홀더 텍스트
```

**Guidance.tsx (Tier 2)**:
```tsx
interface GuidanceContextValue {
  label?: string
  description?: string
  required?: boolean
  labelId: string
}

const GuidanceContext = createContext<GuidanceContextValue | null>(null)

export function Guidance({ label, description, required, children }) {
  const field = useFieldContext()  // 상위 Context 상속
  const labelId = `${field.id}-label`

  return (
    <GuidanceContext.Provider value={{ label, description, required, labelId }}>
      <div data-guidance>
        {children || (
          <>
            {label && <Label />}
            {description && <Description />}
          </>
        )}
      </div>
    </GuidanceContext.Provider>
  )
}
```

**Label.tsx (Tier 3)**:
```tsx
export function Label({ children }: { children?: ReactNode }) {
  const field = useFieldContext()      // Tier 1 Context
  const guidance = useGuidanceContext() // Tier 2 Context

  return (
    <label htmlFor={field.id} id={guidance.labelId}>
      {children || guidance.label}
      {guidance.required && <span aria-label="required">*</span>}
    </label>
  )
}
```

### design-system/Field/Control/ (Intent)

**역할**: 사용자에게 실제 입력 수단 제공

**WHY**: 사용자가 데이터를 입력할 UI가 필요하기 때문

**폴더 구조**:
```
Control/
├── Control.tsx           # Tier 2: ControlContext Provider
├── Input.tsx             # Tier 3: Text input
├── Textarea.tsx          # Tier 3: Multiline input
└── Select.tsx            # Tier 3: Dropdown select
```

**Control.tsx (Tier 2)**:
```tsx
interface ControlContextValue {
  disabled?: boolean
  readonly?: boolean
  autoFocus?: boolean
}

export function Control({ disabled, readonly, autoFocus, children }) {
  return (
    <ControlContext.Provider value={{ disabled, readonly, autoFocus }}>
      <div data-control>
        {children}
      </div>
    </ControlContext.Provider>
  )
}
```

**Input.tsx (Tier 3)**:
```tsx
export function Input({ type = 'text', ...props }) {
  const field = useFieldContext()      // name, id, value
  const control = useControlContext()  // disabled, readonly
  const guidance = useGuidanceContext() // labelId for aria-labelledby

  return (
    <input
      id={field.id}
      name={field.name}
      type={type}
      value={field.value}
      disabled={control.disabled}
      readOnly={control.readonly}
      autoFocus={control.autoFocus}
      aria-labelledby={guidance?.labelId}
      {...props}
    />
  )
}
```

### design-system/Field/Validation/ (Intent)

**역할**: 입력된 데이터가 올바른지 검증

**WHY**: 잘못된 데이터가 시스템에 들어가는 것을 방지하기 위해

**폴더 구조**:
```
Validation/
├── Validation.tsx        # Tier 2: ValidationContext
├── Schema.tsx            # Tier 3: Zod/Yup schema
├── Rules.tsx             # Tier 3: Custom validation rules
└── Dependencies.tsx      # Tier 3: Field dependencies
```

### design-system/Field/Feedback/ (Intent)

**역할**: 검증 결과를 사용자에게 표시

**WHY**: 사용자가 입력이 올바른지 즉시 알아야 하기 때문

**폴더 구조**:
```
Feedback/
├── Feedback.tsx          # Tier 2: FeedbackContext
├── Error.tsx             # Tier 3: Error message
├── Success.tsx           # Tier 3: Success message
├── Warning.tsx           # Tier 3: Warning message
└── Info.tsx              # Tier 3: Info message
```

### design-system/Action/ (Primitive)

**역할**: 사용자 액션(클릭, 제출 등)을 Intent 기반으로 관리

**폴더 구조**:
```
Action/
├── Action.tsx            # Tier 1: Primitive
├── Handler/              # Intent: 액션 핸들러
├── State/                # Intent: 액션 상태
├── Confirmation/         # Intent: 사용자 확인
├── Feedback/             # Intent: 액션 결과
├── Prevention/           # Intent: 중복 실행 방지
├── Lifecycle/            # Intent: 생명주기 훅
├── Action.types.ts
└── Action.utils.ts
```

### design-system/Frame/ (Primitive)

**역할**: 레이아웃을 위한 범용 컨테이너

**특징**: Intent 구조 없음 (단일 목적: Layout)

**폴더 구조**:
```
Frame/
├── Frame.tsx             # Main component
├── FrameProps.ts         # Prop types
├── frameToSettings.ts    # Props → CSS 변환
├── Layout.ts             # Layout presets
└── Frame.types.ts
```

**왜 Intent가 없는가?**
- Frame은 "레이아웃"이라는 단일 목적만 가짐
- 사용자 질문이 없음 ("어떻게 배치할까?" 하나)
- Intent 분리가 불필요

### design-system/Text/ (Primitive)

**역할**: 텍스트 표현을 Context별로 제공

**폴더 구조**:
```
Text/
├── Text.tsx              # Main component (namespace)
├── Card/                 # Context: Card 내 텍스트
├── Prose/                # Context: 문서 텍스트
├── Menu/                 # Context: 메뉴 텍스트
├── Field/                # Context: 폼 필드 텍스트
├── Table/                # Context: 테이블 텍스트
└── Text.types.ts
```

**Text vs Intent의 차이**:
- Text는 "Context" 기반 (사용되는 위치)
- Field/Action은 "Intent" 기반 (목적)

**사용 규칙** (conventions.md):
```tsx
// ❌ WRONG: 직접 import 금지
import { Card } from '../design-system/Text/Card/Card'

// ✅ CORRECT: Text namespace를 통해서만 접근
import { Text } from '../design-system/Text/Text'
<Text.Card.Title>Hello</Text.Card.Title>
```

### features/table/

**역할**: 테이블 기능 모듈 (Tanstack Table 래퍼)

**폴더 구조**:
```
table/
├── TableRoot.tsx         # <table> wrapper
├── TableHeader.tsx       # <thead>
├── TableRow.tsx          # <tr>
├── TableHead.tsx         # <th>
├── TableCell.tsx         # <td>
├── TableEmpty.tsx        # Empty state
├── Table.tsx             # Compound namespace
└── README.md
```

**사용 예시**:
```tsx
import { Table } from '../../features/table/Table'

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
    </Table.Row>
  </Table.Header>
</Table.Root>
```

### features/inspector/

**역할**: 개발자 도구 (Cmd+D로 컴포넌트 inspect)

**폴더 구조**:
```
inspector/
├── InspectorOverlay.tsx      # Overlay UI
├── InspectorPanel.tsx        # Panel UI
├── PropertyTree.tsx          # Property viewer
├── useInspectorHotkeys.ts    # Cmd+D hotkey
├── useInspectorTarget.ts     # Hover target
├── fiber-utils.ts            # React Fiber 유틸
└── inspector-utils.ts        # 기타 유틸
```

### shared/ui/

**역할**: 애플리케이션 레벨 공유 UI 컴포넌트

**design-system과의 차이**:
- `design-system/`: 범용적, 재사용 가능, 프로젝트 독립적
- `shared/ui/`: 이 프로젝트 특화, 애플리케이션 로직 포함 가능

**예시**:
```
shared/ui/
├── SlidesPanel.tsx      # SlideApp 전용 (다른 프로젝트 재사용 어려움)
├── PropertiesPanel.tsx  # 여러 App에서 사용하지만 이 프로젝트 특화
└── FloatingToolbar.tsx  # 동일
```

### shared/data/

**역할**: 애플리케이션 간 공유 데이터

**폴더 구조**:
```
data/
└── crm/
    ├── deals.json
    ├── companies.json
    ├── people.json
    └── ...
```

### shared/styles/

**역할**: 전역 스타일시트

**폴더 구조**:
```
styles/
├── index.css      # 글로벌 리셋, 기본 스타일
└── frame.css      # Frame 전용 CSS (props → CSS 변환)
```

---

## Import 패턴

### Level 1: Simple (Props-based)

**특징**: Intent가 숨겨져 있음, 빠른 프로토타이핑용

```tsx
import { Field } from '../design-system/Field/Field'
import { Input } from '../design-system/Field/Control/Input'

function LoginForm() {
  return (
    <Field name="email" label="Email" validate={emailSchema}>
      <Input type="email" />
    </Field>
  )
}
```

**장점**:
- ✅ 빠른 작성
- ✅ 간결한 코드

**단점**:
- ❌ Intent가 명시적이지 않음
- ❌ 커스터마이징 제한

### Level 2: Structured (Intent-based)

**특징**: Intent가 명시적으로 드러남, 프로덕션 추천

```tsx
import { Field } from '../design-system/Field/Field'
import { Guidance } from '../design-system/Field/Guidance/Guidance'
import { Control } from '../design-system/Field/Control/Control'
import { Validation } from '../design-system/Field/Validation/Validation'
import { Feedback } from '../design-system/Field/Feedback/Feedback'
import { Error } from '../design-system/Field/Feedback/Error'
import { Input } from '../design-system/Field/Control/Input'

function LoginForm() {
  return (
    <Field name="email">
      <Guidance label="Email" description="Your login email" />
      <Control>
        <Input type="email" />
      </Control>
      <Validation schema={emailSchema} />
      <Feedback>
        <Error />
      </Feedback>
    </Field>
  )
}
```

**장점**:
- ✅ Intent가 명확히 드러남
- ✅ 교육적 가치
- ✅ 적절한 커스터마이징 가능

**단점**:
- ❌ 코드가 다소 장황함

### Level 3: Explicit (Full Control)

**특징**: 모든 Component를 명시적으로 제어, 최대 커스터마이징

```tsx
import { Field } from '../design-system/Field/Field'
import { Guidance } from '../design-system/Field/Guidance/Guidance'
import { Label } from '../design-system/Field/Guidance/Label'
import { Description } from '../design-system/Field/Guidance/Description'
import { Required } from '../design-system/Field/Guidance/Required'
import { Control } from '../design-system/Field/Control/Control'
import { Input } from '../design-system/Field/Control/Input'
import { Validation } from '../design-system/Field/Validation/Validation'
import { Schema } from '../design-system/Field/Validation/Schema'
import { Feedback } from '../design-system/Field/Feedback/Feedback'
import { Error } from '../design-system/Field/Feedback/Error'
import { Success } from '../design-system/Field/Feedback/Success'

function LoginForm() {
  return (
    <Field name="email">
      <Guidance>
        <Label>
          Email Address
          <Required />
        </Label>
        <Description>
          We'll never share your email with third parties.
        </Description>
      </Guidance>

      <Control>
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Control>

      <Validation>
        <Schema value={emailSchema} />
      </Validation>

      <Feedback>
        <Error>
          {(error) => (
            <AnimatedErrorMessage>
              {error.message}
            </AnimatedErrorMessage>
          )}
        </Error>
        <Success>Email looks good!</Success>
      </Feedback>
    </Field>
  )
}
```

**장점**:
- ✅ 완전한 제어
- ✅ 애니메이션, 커스텀 UI 가능
- ✅ 모든 Component 교체 가능

**단점**:
- ❌ 매우 장황함
- ❌ Import 목록이 김

### Import 경로 최적화 팁

**Path Alias 사용** (vite.config.ts):
```typescript
resolve: {
  alias: {
    '@': '/src',
    '@ds': '/src/design-system',
    '@features': '/src/features',
    '@shared': '/src/shared',
  }
}
```

**최적화된 Import**:
```tsx
// Before
import { Field } from '../../../design-system/Field/Field'

// After
import { Field } from '@ds/Field/Field'
```

---

## 마이그레이션 계획

### 전체 로드맵

```
현재 (As-Is)
   ↓
Phase 1: 구조 생성 (1-2일)
   ↓
Phase 2: 기존 파일 이동 (2-3일)
   ↓
Phase 3: Intent 구조 구현 (1-2주)
   ↓
Phase 4: FSD 마이그레이션 (3-4일)
   ↓
완료 (To-Be)
```

### Phase 1: 구조 생성 (1-2일)

**목표**: 새로운 폴더 구조 생성 (빈 폴더)

**작업**:
```bash
# 1. design-system Primitive 폴더 생성
mkdir -p src/design-system/Field/{Guidance,Control,Validation,Feedback,State,Transform}
mkdir -p src/design-system/Action/{Handler,State,Confirmation,Feedback,Prevention,Lifecycle}
mkdir -p src/design-system/Frame
mkdir -p src/design-system/Text/{Card,Prose,Menu,Field,Table}
mkdir -p src/design-system/Separator
mkdir -p src/design-system/Divider
mkdir -p src/design-system/Section
mkdir -p src/design-system/Overlay
mkdir -p src/design-system/Experience
mkdir -p src/design-system/Icon

# 2. Tokens, Theme, Lib 폴더
mkdir -p src/design-system/tokens
mkdir -p src/design-system/theme
mkdir -p src/design-system/lib

# 3. FSD 계층 폴더 생성
mkdir -p src/features/table
mkdir -p src/features/inspector
mkdir -p src/shared/ui
mkdir -p src/shared/data
mkdir -p src/shared/styles
```

**검증**:
```bash
tree src/design-system -L 2
tree src/features -L 2
tree src/shared -L 1
```

### Phase 2: 기존 파일 이동 (2-3일)

**목표**: 기존 파일을 새로운 위치로 이동 (기능 유지)

**2.1 Simple Components 이동**:
```bash
# Separator
mv src/design-system/Separator.tsx src/design-system/Separator/Separator.tsx

# Divider
mv src/design-system/Divider.tsx src/design-system/Divider/Divider.tsx

# Section
mv src/design-system/Section.tsx src/design-system/Section/Section.tsx

# Overlay
mv src/design-system/Overlay.tsx src/design-system/Overlay/Overlay.tsx

# Experience
mv src/design-system/Experience.tsx src/design-system/Experience/Experience.tsx

# Icon
mv src/design-system/Icon.tsx src/design-system/Icon/Icon.tsx
```

**2.2 Frame 이동** (이미 폴더 구조):
```bash
# 현재 위치 유지 (이미 적절함)
src/design-system/Frame/
├── Frame.tsx
├── FrameProps.ts
├── frameToSettings.ts
└── Layout/Layout.ts
```

**2.3 Text 재구조화**:
```bash
# Text.tsx를 Text 폴더로
mv src/design-system/text/Text.tsx src/design-system/Text/Text.tsx

# Context들을 각 폴더로
mv src/design-system/text/context/Card.tsx src/design-system/Text/Card/Card.tsx
mv src/design-system/text/context/Prose.tsx src/design-system/Text/Prose/Prose.tsx
mv src/design-system/text/context/Menu.tsx src/design-system/Text/Menu/Menu.tsx
mv src/design-system/text/context/Field.tsx src/design-system/Text/Field/Field.tsx
mv src/design-system/text/context/Table.tsx src/design-system/Text/Table/Table.tsx

# 기존 폴더 삭제
rm -rf src/design-system/text
```

**2.4 Tokens 이동**:
```bash
mv src/design-system/token/* src/design-system/tokens/
rm -rf src/design-system/token
```

**2.5 Theme 이동**:
```bash
mv src/design-system/theme.tsx src/design-system/theme/theme.tsx
```

**2.6 Lib 이동**:
```bash
mv src/design-system/lib/* src/design-system/lib/
# 이미 폴더 존재, 확인만
```

**2.7 FSD 마이그레이션**:
```bash
# ui/table → features/table
mv src/ui/table/* src/features/table/
rm -rf src/ui

# inspector → features/inspector
mv src/inspector/* src/features/inspector/
rm -rf src/inspector

# components → shared/ui
mv src/components/* src/shared/ui/
rm -rf src/components

# data → shared/data
mv src/data/* src/shared/data/
rm -rf src/data

# style → shared/styles
mv src/style/* src/shared/styles/
rm -rf src/style
```

**검증**:
```bash
# 앱 실행
npm run dev

# 에러 확인 (import 경로 수정 필요)
npm run typecheck
```

### Phase 3: Intent 구조 구현 (1-2주)

**목표**: Field와 Action에 3-Tier Intent 구조 적용

**3.1 Field Intent 구조 구현**

**Step 1: Field.tsx 분석**
```tsx
// 현재 Field.tsx 내용 분석
// - Guidance 관련 코드 → Field/Guidance/로 분리
// - Control 관련 코드 → Field/Control/로 분리
// - Validation 관련 코드 → Field/Validation/로 분리
// - Feedback 관련 코드 → Field/Feedback/로 분리
```

**Step 2: Guidance Intent 구현**
```bash
# 파일 생성
touch src/design-system/Field/Guidance/Guidance.tsx
touch src/design-system/Field/Guidance/Label.tsx
touch src/design-system/Field/Guidance/Description.tsx
touch src/design-system/Field/Guidance/Required.tsx
```

```tsx
// src/design-system/Field/Guidance/Guidance.tsx
import { createContext, useContext } from 'react'
import { useFieldContext } from '../Field'

interface GuidanceContextValue {
  label?: string
  description?: string
  required?: boolean
  labelId: string
}

const GuidanceContext = createContext<GuidanceContextValue | null>(null)

export function Guidance({
  label,
  description,
  required = false,
  children
}: GuidanceProps) {
  const field = useFieldContext()
  const labelId = `${field.id}-label`

  return (
    <GuidanceContext.Provider
      value={{ label, description, required, labelId }}
    >
      {children || (
        <>
          {label && <Label />}
          {description && <Description />}
        </>
      )}
    </GuidanceContext.Provider>
  )
}

export function useGuidanceContext() {
  const context = useContext(GuidanceContext)
  if (!context) {
    throw new Error('useGuidanceContext must be used within Guidance')
  }
  return context
}
```

```tsx
// src/design-system/Field/Guidance/Label.tsx
import { useFieldContext } from '../Field'
import { useGuidanceContext } from './Guidance'

export function Label({ children }: { children?: ReactNode }) {
  const field = useFieldContext()
  const guidance = useGuidanceContext()

  return (
    <label htmlFor={field.id} id={guidance.labelId}>
      {children || guidance.label}
      {guidance.required && <span aria-label="required">*</span>}
    </label>
  )
}
```

**Step 3: Control Intent 구현**
```bash
touch src/design-system/Field/Control/Control.tsx
touch src/design-system/Field/Control/Input.tsx
touch src/design-system/Field/Control/Textarea.tsx
touch src/design-system/Field/Control/Select.tsx
```

**Step 4: Validation Intent 구현**
```bash
touch src/design-system/Field/Validation/Validation.tsx
touch src/design-system/Field/Validation/Schema.tsx
touch src/design-system/Field/Validation/Rules.tsx
```

**Step 5: Feedback Intent 구현**
```bash
touch src/design-system/Field/Feedback/Feedback.tsx
touch src/design-system/Field/Feedback/Error.tsx
touch src/design-system/Field/Feedback/Success.tsx
touch src/design-system/Field/Feedback/Warning.tsx
```

**Step 6: State, Transform Intent 구현**
```bash
# State Intent
touch src/design-system/Field/State/State.tsx
touch src/design-system/Field/State/Value.tsx
touch src/design-system/Field/State/Touched.tsx

# Transform Intent
touch src/design-system/Field/Transform/Transform.tsx
touch src/design-system/Field/Transform/Format.tsx
touch src/design-system/Field/Transform/Parse.tsx
```

**Step 7: Field Namespace 구성**
```tsx
// src/design-system/Field/Field.tsx
import { Guidance } from './Guidance/Guidance'
import { Label } from './Guidance/Label'
import { Description } from './Guidance/Description'
import { Control } from './Control/Control'
import { Input } from './Control/Input'
// ... 기타 import

export function Field({ name, children }) {
  // ... Field 로직
}

// Namespace 구성
Field.Guidance = Guidance
Field.Label = Label
Field.Description = Description
Field.Control = Control
Field.Input = Input
// ... 기타 연결

// 개별 export도 제공 (Direct import용)
export { Guidance, Label, Description, Control, Input }
```

**3.2 Action Intent 구조 구현**

동일한 패턴으로 Action의 6가지 Intent 구현:
- Handler/
- State/
- Confirmation/
- Feedback/
- Prevention/
- Lifecycle/

**검증**:
```tsx
// Test 파일 작성
// src/design-system/Field/__tests__/Field.test.tsx
import { Field } from '../Field'

test('Level 1: Simple usage', () => {
  render(
    <Field name="email" label="Email">
      <input />
    </Field>
  )
  expect(screen.getByLabelText('Email')).toBeInTheDocument()
})

test('Level 2: Structured usage', () => {
  render(
    <Field name="email">
      <Field.Guidance label="Email" />
      <Field.Control><input /></Field.Control>
    </Field>
  )
  expect(screen.getByLabelText('Email')).toBeInTheDocument()
})
```

### Phase 4: FSD 정리 및 문서화 (3-4일)

**목표**: FSD 규칙 강제 및 문서화

**4.1 ESLint 규칙 추가**:
```javascript
// eslint.config.js
export default [
  {
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['**/features/**'],
            message: 'shared/ layer cannot import from features/',
          },
          {
            group: ['**/apps/**'],
            message: 'Lower layers cannot import from apps/',
          },
        ],
      }],
    },
  },
]
```

**4.2 README 작성**:
```bash
touch src/design-system/README.md
touch src/features/README.md
touch src/shared/README.md
```

**4.3 Import 경로 일괄 변경**:
```bash
# Find & Replace (VSCode)
Find: from '../design-system/Field'
Replace: from '../design-system/Field/Field'

Find: from '../design-system/Action'
Replace: from '../design-system/Action/Action'

# 기타 경로 수정
```

**4.4 최종 검증**:
```bash
# TypeScript 에러 없는지
npm run typecheck

# Lint 에러 없는지
npm run lint

# Build 성공하는지
npm run build

# 모든 앱 동작하는지
npm run dev
# 각 /mail, /crm, /cms, /slide 등 테스트
```

### 마이그레이션 체크리스트

- [ ] Phase 1: 폴더 구조 생성 완료
- [ ] Phase 2: 기존 파일 이동 완료
  - [ ] Simple Components 이동
  - [ ] Frame 확인
  - [ ] Text 재구조화
  - [ ] Tokens 이동
  - [ ] Theme 이동
  - [ ] Lib 확인
  - [ ] FSD 마이그레이션
- [ ] Phase 3: Intent 구조 구현
  - [ ] Field/Guidance 완료
  - [ ] Field/Control 완료
  - [ ] Field/Validation 완료
  - [ ] Field/Feedback 완료
  - [ ] Field/State 완료
  - [ ] Field/Transform 완료
  - [ ] Action 6가지 Intent 완료
- [ ] Phase 4: FSD 정리
  - [ ] ESLint 규칙 추가
  - [ ] README 작성
  - [ ] Import 경로 수정
  - [ ] 최종 검증

---

## Option 비교

### Option A: Intent-Based 구조 (완전한 3-Tier 반영)

**구조**:
```
design-system/
└── primitives/
    └── Field/
        ├── Field.tsx
        └── intents/
            ├── Guidance/
            ├── Control/
            └── Validation/
```

**장점**:
- ✅ 3-Tier Intent System을 **완전히** 반영
- ✅ Intent별 폴더가 명확히 분리 (교육적 가치 최고)
- ✅ FSD 아키텍처 완벽 준수
- ✅ "Intent First" 철학이 폴더에 그대로 드러남

**단점**:
- ❌ 깊은 중첩 (4-5 레벨): `design-system/primitives/Field/intents/Guidance/Label.tsx`
- ❌ Import 경로가 매우 길어짐
- ❌ 기존 코드 마이그레이션 작업량이 큼
- ❌ 실무에서 타이핑 부담

**적합한 경우**:
- 교육 목적이 최우선
- 대규모 팀 (10명 이상)
- 엔터프라이즈급 프로젝트

### Option B: Pragmatic Flat 구조 (실용적 접근)

**구조**:
```
design-system/
└── Field/
    ├── Field.tsx
    ├── FieldGuidance.tsx      # Intent를 파일명에
    ├── FieldLabel.tsx          # Component
    └── FieldControl.tsx
```

**장점**:
- ✅ 얕은 중첩 (최대 2-3 레벨)
- ✅ Import 경로가 짧음: `design-system/Field/FieldLabel`
- ✅ 기존 구조에서 점진적 마이그레이션 가능
- ✅ 빠른 타이핑

**단점**:
- ❌ Intent 구조가 파일명에만 반영 (폴더로는 명확하지 않음)
- ❌ 파일이 많아지면 Field 폴더가 복잡 (20+ 파일)
- ❌ 3-Tier 구조가 시각적으로 덜 명확

**적합한 경우**:
- 실무 중심 프로젝트
- 소규모 팀 (5명 이하)
- 빠른 개발 속도 우선

### Option C: Hybrid Intent Structure (추천)

**구조**:
```
design-system/
└── Field/
    ├── Field.tsx              # Tier 1
    ├── Guidance/              # Tier 2: Intent
    │   ├── Guidance.tsx
    │   ├── Label.tsx          # Tier 3: Component
    │   └── Description.tsx
    └── Control/               # Tier 2: Intent
        ├── Control.tsx
        └── Input.tsx          # Tier 3: Component
```

**장점**:
- ✅ 3-Tier 구조가 폴더에 명확히 드러남 (교육적)
- ✅ 적절한 중첩 깊이 (최대 3 레벨)
- ✅ Intent별 격리로 확장 용이
- ✅ Import 경로가 합리적: `design-system/Field/Guidance/Label`
- ✅ FSD 준수

**단점**:
- ⚠️ Option B보다는 경로가 김
- ⚠️ Option A보다는 교육적 명확성이 약간 떨어짐

**적합한 경우**:
- **교육 + 실무 균형** (사용자 요구사항 ✅)
- **대규모 확장** (30개+) (사용자 요구사항 ✅)
- **전면 리팩토링 가능** (사용자 요구사항 ✅)

### 비교표

| 측면 | Option A | Option B | Option C (추천) |
|------|----------|----------|-----------------|
| 교육적 명확성 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| 실무 실용성 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 확장성 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Import 경로 | `primitives/Field/intents/Guidance/Label` (길음) | `Field/FieldLabel` (짧음) | `Field/Guidance/Label` (중간) |
| 중첩 깊이 | 4-5 레벨 | 2-3 레벨 | 3 레벨 |
| 마이그레이션 난이도 | 높음 | 낮음 | 중간 |
| FSD 준수 | 완벽 | 부분적 | 완벽 |
| 3-Tier 시각화 | 완벽 | 약함 | 강함 |

### 최종 추천: Option C

**이유**:
1. 사용자 요구사항 **완벽 부합**:
   - ✅ 교육 + 실무 균형
   - ✅ 대규모 확장 (30개+)
   - ✅ 전면 리팩토링 가능

2. 3-Tier 철학 **충실히 반영**:
   ```
   Field/              ← Tier 1 (폴더로 명확)
   ├── Guidance/       ← Tier 2 (폴더로 명확)
   │   └── Label.tsx   ← Tier 3 (파일)
   ```

3. **실무에서 타이핑 부담 적음**:
   ```tsx
   import { Label } from '@ds/Field/Guidance/Label'
   // vs Option A
   import { Label } from '@ds/primitives/Field/intents/Guidance/Label'
   ```

4. **확장 시나리오 완벽 대응**:
   - 새로운 Component 추가: `Guidance/` 폴더에 파일 추가
   - 새로운 Intent 추가: `Field/` 폴더에 Intent 폴더 추가
   - 새로운 Primitive 추가: `design-system/` 폴더에 Primitive 폴더 추가

---

## FAQ

### Q1: 왜 Barrel Export를 사용하지 않나요?

**A**: 사용자의 글로벌 인스트럭션에 명시된 규칙입니다:
> - never barrel export

**이유**:
1. **번들 사이즈 증가**: tree-shaking이 제대로 작동하지 않음
2. **순환 참조 위험**: `index.ts`가 모든 파일을 import하면서 순환 참조 발생 가능
3. **IDE 성능 저하**: 자동완성 시 모든 export를 분석해야 함
4. **추적 어려움**: "이 컴포넌트가 어디서 왔는가?" 파악 힘듦

**대안**: Direct import
```tsx
// ✅ GOOD
import { Field } from '../design-system/Field/Field'
import { Label } from '../design-system/Field/Guidance/Label'
```

### Q2: Field와 Action은 왜 Intent 구조인데, Frame과 Text는 아닌가요?

**A**: 각 Primitive의 **본질적 차이** 때문입니다.

**Field와 Action의 본질**:
- 사용자와의 **상호작용**
- 여러 **목적**(Intent)을 가짐
- 예: Field는 "가이드, 제어, 검증, 피드백" 등 6가지 목적

**Frame의 본질**:
- **레이아웃** 전용
- 단일 목적: "요소를 배치한다"
- Intent 분리가 불필요

**Text의 본질**:
- **Context** 기반 (사용 위치)
- Intent가 아닌 "어디서 사용되는가"로 구분
- 예: Card 내 텍스트 vs 문서 내 텍스트

### Q3: Text.Card.Title은 왜 `Text/Card/` 폴더 구조인가요?

**A**: conventions.md의 명시적 규칙입니다:
> ALWAYS access text components via the main Text namespace: `Text.Card.Title`
> NEVER directly import from `text/context/*`

**구조**:
```
Text/
├── Text.tsx           # Namespace root
└── Card/              # Context
    ├── Card.tsx       # Context provider
    └── Title.tsx      # Component
```

**사용**:
```tsx
import { Text } from '../design-system/Text/Text'

<Text.Card.Title>Hello</Text.Card.Title>
```

**왜 이렇게?**:
- Text는 "typography system"으로, 단일 진입점(Text) 필요
- Card, Prose 등은 "사용 맥락"일 뿐, 별도 Primitive가 아님

### Q4: features/ vs shared/ui/ 차이는 무엇인가요?

**A**: FSD 계층의 차이입니다.

**features/**:
- **독립적 기능 모듈**
- 다른 프로젝트에 재사용 가능
- 비즈니스 로직 포함 가능
- 예: table (Tanstack Table 래퍼), inspector (개발자 도구)

**shared/ui/**:
- **이 프로젝트 특화** 공유 컴포넌트
- 다른 프로젝트 재사용 어려움
- 애플리케이션 로직 포함 가능
- 예: SlidesPanel (SlideApp 전용), FloatingToolbar

**판단 기준**:
```
"이 컴포넌트를 다른 프로젝트에 복사해서 쓸 수 있나?"
  ├─ Yes → features/
  └─ No → shared/ui/
```

### Q5: design-system/tokens/ vs design-system/theme/ 차이는?

**A**: 역할이 다릅니다.

**tokens/**:
- CSS 변수 정의 (`.css` 파일)
- TypeScript 상수 (`.ts` 파일)
- 예: `--space-4`, `--surface-base`

**theme/**:
- React 컴포넌트 (ThemeProvider)
- 테마 전환 로직 (light/dark)
- useTheme 훅

**관계**:
```
tokens/ (정의) → theme/ (적용) → 앱 (사용)
```

### Q6: 기존 코드 import를 일괄 변경하는 방법은?

**A**: VSCode의 Find & Replace (Regex) 사용

**예시**:
```regex
Find: from ['"]\.\.\/design-system\/Field['"]
Replace: from '../design-system/Field/Field'
```

**자동화 스크립트** (Node.js):
```javascript
// scripts/fix-imports.js
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const replacements = [
  [/from ['"]\.\.\/design-system\/Field['"]/g, `from '../design-system/Field/Field'`],
  [/from ['"]\.\.\/design-system\/Action['"]/g, `from '../design-system/Action/Action'`],
  // ... 기타
]

async function fixImports(dir) {
  const files = await readdir(dir, { recursive: true })
  for (const file of files) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue

    let content = await readFile(join(dir, file), 'utf-8')
    for (const [pattern, replacement] of replacements) {
      content = content.replace(pattern, replacement)
    }
    await writeFile(join(dir, file), content)
  }
}

fixImports('./src/apps')
```

### Q7: 마이그레이션 중 앱이 깨지면 어떻게 하나요?

**A**: Git branch 전략 사용

**전략**:
```bash
# 1. 새 브랜치 생성
git checkout -b refactor/folder-structure

# 2. Phase별로 커밋
git commit -m "Phase 1: Create folder structure"
git commit -m "Phase 2: Move simple components"
# ...

# 3. 각 Phase 후 검증
npm run dev
npm run typecheck
npm run lint

# 4. 문제 발생 시 해당 커밋으로 롤백
git revert HEAD
# 또는
git reset --hard <commit-hash>

# 5. 모든 Phase 완료 후 메인 브랜치 병합
git checkout main
git merge refactor/folder-structure
```

### Q8: TypeScript 에러가 너무 많이 나면?

**A**: 단계적 마이그레이션 + `@ts-expect-error` 임시 사용

**전략**:
```tsx
// 1. 우선 파일 이동만 완료
// 2. Import 경로 에러가 발생하는 곳에 임시 주석
// @ts-expect-error - TODO: Fix import path after migration
import { Field } from '../design-system/Field'

// 3. Phase 3 완료 후 일괄 제거
// VSCode: Search "@ts-expect-error - TODO: Fix import"
```

**더 나은 방법**: `tsconfig.json` 임시 수정
```json
{
  "compilerOptions": {
    "skipLibCheck": true,    // 라이브러리 체크 스킵
    "noEmit": true,          // 빌드 시도 안 함 (타입 체크만)
  }
}
```

### Q9: 30개 이상의 Primitive가 생기면 design-system/ 폴더가 너무 복잡해지지 않나요?

**A**: 그때는 카테고리별 분류를 추가합니다.

**미래 확장 (50+ Primitives)**:
```
design-system/
├── form/               # 폼 관련 Primitives
│   ├── Field/
│   ├── Checkbox/
│   ├── Radio/
│   └── Switch/
├── action/             # 액션 관련
│   ├── Action/
│   ├── Button/
│   └── Link/
├── layout/             # 레이아웃
│   ├── Frame/
│   ├── Grid/
│   └── Stack/
├── typography/         # 타이포그래피
│   └── Text/
└── feedback/           # 피드백
    ├── Alert/
    ├── Toast/
    └── Modal/
```

**하지만 현재는**:
- 10개 미만의 Primitive
- 플랫 구조 유지
- 필요 시점에 리팩토링

### Q10: Intent 폴더 안에 몇 개의 Component까지 허용되나요?

**A**: **명확한 기준은 없지만, 경험적으로 5-7개**

**예시**:
```
Field/Guidance/
├── Guidance.tsx          # Context
├── Label.tsx             # 1
├── Description.tsx       # 2
├── Required.tsx          # 3
├── Placeholder.tsx       # 4
├── Tooltip.tsx           # 5
├── HelpIcon.tsx          # 6
└── FloatingLabel.tsx     # 7 ← 여기까지는 OK
```

**7개 초과 시**:
```
Field/Guidance/
├── Guidance.tsx
├── components/           # 하위 폴더 추가
│   ├── Label.tsx
│   ├── Description.tsx
│   └── ...
└── utils/
    └── guidanceUtils.ts
```

---

## 부록

### A. Context Inheritance Pattern 상세

**패턴 구조**:
```
FieldContext
   ↓ (provides)
   { name, id, value, error, touched }
   ↓ (inherited by)
GuidanceContext
   ↓ (provides)
   { label, description, required, labelId }
   ↓ (both available in)
Label Component
```

**코드 예시**:
```tsx
// Field.tsx (Tier 1)
const FieldContext = createContext<FieldContextValue>(null)

export function Field({ name, children }) {
  const id = useId()
  const [value, setValue] = useState()

  return (
    <FieldContext.Provider value={{ name, id, value }}>
      {children}
    </FieldContext.Provider>
  )
}

export function useFieldContext() {
  const context = useContext(FieldContext)
  if (!context) throw new Error('Must be within Field')
  return context
}

// Guidance.tsx (Tier 2)
const GuidanceContext = createContext<GuidanceContextValue>(null)

export function Guidance({ label, children }) {
  const field = useFieldContext()  // ✅ 상위 Context 상속
  const labelId = `${field.id}-label`

  return (
    <GuidanceContext.Provider value={{ label, labelId }}>
      {children}
    </GuidanceContext.Provider>
  )
}

export function useGuidanceContext() {
  const context = useContext(GuidanceContext)
  if (!context) throw new Error('Must be within Guidance')
  return context
}

// Label.tsx (Tier 3)
export function Label() {
  const field = useFieldContext()      // ✅ Tier 1 Context 접근
  const guidance = useGuidanceContext() // ✅ Tier 2 Context 접근

  return (
    <label htmlFor={field.id} id={guidance.labelId}>
      {guidance.label}
    </label>
  )
}
```

**상속 체인 시각화**:
```
<Field name="email">                 {/* FieldContext 생성 */}
  value={{ name: "email", id: "1" }}
     ↓
  <Guidance label="Email">           {/* GuidanceContext 생성 + FieldContext 상속 */}
    value={{ label: "Email", labelId: "1-label" }}
       ↓
    <Label />                        {/* 둘 다 접근 가능 */}
      useFieldContext()    → { name: "email", id: "1" }
      useGuidanceContext() → { label: "Email", labelId: "1-label" }
  </Guidance>
</Field>
```

### B. Naming Convention 규칙

**파일명**:
```
PascalCase.tsx        # 컴포넌트
camelCase.ts          # 유틸리티
PascalCase.types.ts   # 타입 정의
PascalCase.utils.ts   # 컴포넌트별 유틸
```

**폴더명**:
```
PascalCase/           # Primitive, Intent, Component
camelCase/            # 기능 폴더 (tokens, theme, lib)
kebab-case/           # 설정 폴더 (design-system은 예외)
```

**변수명**:
```tsx
// React Component
const MyComponent = () => {}

// Hook
const useMyHook = () => {}

// Context
const MyContext = createContext()

// Context Hook
const useMyContext = () => {}

// Props Interface
interface MyComponentProps {}

// Context Value Interface
interface MyContextValue {}
```

**상수**:
```typescript
// 대문자 스네이크 케이스
const MAX_ITEMS = 100
const DEFAULT_THEME = 'light'

// Enum
enum Status {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}
```

### C. 디렉토리 구조 템플릿

**새로운 Primitive 추가 시**:
```bash
# 1. 폴더 생성
mkdir -p src/design-system/NewPrimitive

# 2. 파일 생성
touch src/design-system/NewPrimitive/NewPrimitive.tsx
touch src/design-system/NewPrimitive/NewPrimitive.types.ts
touch src/design-system/NewPrimitive/NewPrimitive.utils.ts

# 3. Intent가 필요하면
mkdir -p src/design-system/NewPrimitive/IntentName
touch src/design-system/NewPrimitive/IntentName/IntentName.tsx
touch src/design-system/NewPrimitive/IntentName/Component1.tsx
touch src/design-system/NewPrimitive/IntentName/Component2.tsx
```

**새로운 Feature 추가 시**:
```bash
# 1. 폴더 생성
mkdir -p src/features/feature-name

# 2. 파일 생성
touch src/features/feature-name/FeatureName.tsx
touch src/features/feature-name/useFeatureName.ts
touch src/features/feature-name/README.md
```

### D. Git Commit Convention

**커밋 메시지 형식**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `docs`: 문서 변경
- `style`: 코드 스타일 (포맷팅)
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 변경

**Scope**:
- `field`: Field Primitive
- `action`: Action Primitive
- `frame`: Frame Primitive
- `text`: Text Primitive
- `folder-structure`: 폴더 구조
- `migration`: 마이그레이션

**예시**:
```bash
git commit -m "refactor(folder-structure): create design-system Intent folders

- Add Field/Guidance/ Intent folder
- Add Field/Control/ Intent folder
- Add Field/Validation/ Intent folder
- Add Field/Feedback/ Intent folder

Phase 1 of folder structure migration"
```

### E. 참고 문서

**MDK 공식 문서**:
- `docs/claude/best/13-field-action-purpose-definition.md` - Intent 철학
- `docs/claude/best/15-three-tier-as-core-concept.md` - 3-Tier 핵심 개념
- `docs/claude/best/19-headless-vs-ui-component-philosophy.md` - Headless 철학
- `docs/claude/best/20-mdk-fundamental-purpose.md` - MDK 근본 목적
- `.agent/conventions.md` - 코딩 컨벤션

**FSD 공식 문서**:
- https://feature-sliced.design/

**관련 아티클**:
- "Why Barrel Exports are Bad" - 성능 문제
- "Feature-Sliced Design in Practice" - FSD 실무 적용
- "Intent-Driven Design" - Intent 기반 설계 철학

---

## 결론

이 문서에서 제안한 **Hybrid Intent Structure**는:

1. ✅ **MDK의 3-Tier Intent 철학을 충실히 반영**
2. ✅ **교육적 가치와 실무 실용성의 균형**
3. ✅ **대규모 확장 (30개+)에 대응 가능**
4. ✅ **FSD 아키텍처 완벽 준수**
5. ✅ **전면 리팩토링을 통한 이상적 구조 구현**

**핵심 원칙**:
- **"Intent First, Props Follow"** - 모든 설계 결정은 Intent에서 시작
- **"See the Intent, Control the Component"** - 폴더 구조가 Intent를 시각화
- **Direct Import** - Barrel export 없이 명확한 의존성 표현
- **Progressive Enhancement** - Level 1, 2, 3 사용법 지원

**다음 단계**:
1. 이 문서를 팀과 공유
2. 마이그레이션 계획 승인
3. Phase 1부터 순차적 진행
4. 각 Phase 완료 시 검증 및 문서화

**질문이나 피드백**:
- GitHub Issues에 문의
- 또는 이 문서에 직접 코멘트 추가

---

**문서 끝**

*이 문서는 MDK의 지속적인 발전을 위한 살아있는 문서입니다. 새로운 인사이트나 개선 사항이 발견되면 수시로 업데이트됩니다.*
