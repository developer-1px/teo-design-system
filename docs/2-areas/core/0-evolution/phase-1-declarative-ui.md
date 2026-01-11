# Phase 1: 선언적 UI 렌더링

> **"의도를 선언하면 패턴대로 화면이 나온다"**

**Phase**: 1 of 3
**상태**: 진행 중 (~80% 완성)
**시작일**: 2025-12-01 (추정)
**목표 완료일**: 2026-01 말

---

## 📋 목차

1. [Phase 1 목표](#phase-1-목표)
2. [핵심 컨셉](#핵심-컨셉)
3. [아키텍처](#아키텍처)
4. [구현 현황](#구현-현황)
5. [패턴 시스템](#패턴-시스템)
6. [남은 작업](#남은-작업)
7. [성공 기준](#성공-기준)

---

## 1. Phase 1 목표

### 1.1 핵심 목표

**"개발자가 의도만 선언하면, 시스템이 패턴대로 화면을 렌더링한다"**

#### Before (기존 방식)
```tsx
// 개발자가 모든 디자인을 결정
<button
  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
  onClick={handleSave}
>
  Save
</button>

<input
  type="text"
  className="border border-gray-300 focus:border-blue-500 px-3 py-2 rounded"
  placeholder="Enter your name"
/>
```

**문제**:
- 🔴 매번 색상, 크기, 간격을 수동으로 결정
- 🔴 일관성 없음 (개발자마다 다른 값 사용)
- 🔴 변경 어려움 (디자인 토큰 변경 시 모든 곳 수정)
- 🔴 접근성 누락 (ARIA, 시맨틱 HTML 잊기 쉬움)

---

#### After (IDDL)
```tsx
// "왜 중요한가"만 선언
<Action prominence="Primary" intent="Positive">
  Save
</Action>

<Field label="Name" prominence="Standard" />
```

**자동으로 처리되는 것**:
- ✅ **색상**: prominence × intent → 토큰에서 자동 선택
- ✅ **크기**: prominence → 폰트/패딩 자동 결정
- ✅ **간격**: density → gap/padding 자동 결정
- ✅ **상태**: hover, active, focus, disabled → 자동 스타일
- ✅ **접근성**: role → ARIA, 시맨틱 HTML 자동 적용

---

### 1.2 Phase 1의 범위

**포함되는 것** (IDDL Part 1):
- ✅ 계층 구조: `Page → Section → Block → Element`
- ✅ 5개 축: `type`, `role`, `prominence`, `intent`, `density`
- ✅ 패턴 시스템: 축 조합 → 디자인 패턴
- ✅ 레이아웃 시스템: Depth-based hierarchy
- ✅ 테마 시스템: light/dark, color schemes, density

**제외되는 것** (Phase 2, 3):
- ❌ 데이터 바인딩 (`model` 속성)
- ❌ 유효성 검증 (자동 validation)
- ❌ 상태 관리 (loading, error)
- ❌ 키보드 네비게이션 (방향키, Tab)
- ❌ 선택 커서 (선택 시스템)
- ❌ 리사이징 (패널 크기 조절)

→ **Phase 1은 "화면만 그린다"**

---

## 2. 핵심 컨셉

### 2.1 의도 기반 (Intent-Driven)

**전통적 방식**: "어떻게 보일까" (How)
```tsx
<button className="bg-blue-500">Save</button>
```
→ "파란색 버튼"

**IDDL 방식**: "왜 중요한가" (Why)
```tsx
<Action prominence="Primary" intent="Positive">Save</Action>
```
→ "중요한 긍정적 액션"

**차이**:
- How: 구현 디테일 (blue-500, px-6)
- Why: 의도와 의미 (Primary, Positive)

→ **Why는 불변, How는 가변**

---

### 2.2 패턴화 (Pattern-Driven)

**핵심 아이디어**: "같은 의도는 항상 같은 모습"

#### 예시: Primary + Positive 조합

```tsx
// 어디서 사용하든 항상 같은 패턴
<Action prominence="Primary" intent="Positive">Save</Action>
<Action prominence="Primary" intent="Positive">Submit</Action>
<Action prominence="Primary" intent="Positive">Confirm</Action>
```

**결과**:
- ✅ 같은 배경색 (accent-500)
- ✅ 같은 호버 상태 (accent-600)
- ✅ 같은 폰트 크기 (text-base)
- ✅ 같은 패딩 (px-6 py-3)

→ **일관성 자동 보장**

---

#### 패턴의 장점

**1. 학습 가능**:
```
AI/개발자가 "Primary + Positive는 이렇게 생겼구나" 학습
→ 새로운 화면을 만들 때 자동으로 적용
```

**2. 변경 용이**:
```
prominence: Primary → accent-500
(패턴 정의 한 곳만 변경하면 모든 곳 자동 반영)
```

**3. 테스트 가능**:
```
"Primary + Positive 조합이 올바른 스타일인가?" 테스트
```

---

### 2.3 계층 구조 (Hierarchical)

**IDDL의 구조**:
```
Page (루트)
 └─ Section (영역: Header, Sidebar, Main)
     └─ Block (묶음: Form, Card, List)
         └─ Element (요소: Text, Field, Action)
```

**계층의 역할**:

| 레벨 | 책임 | 예시 |
|------|------|------|
| **Page** | 전체 페이지 레이아웃 | role="Application" (IDE), role="Document" (설정) |
| **Section** | 화면 영역 분할 | Header, Sidebar, Main, Footer |
| **Block** | 논리적 묶음 | Form, Card, Toolbar, List |
| **Element** | 실제 콘텐츠 | Text, Field, Action, Separator |

**계층의 장점**:
1. **예측 가능**: 어디에 무엇이 들어갈지 명확
2. **검증 가능**: Page → Section → Block → Element 규칙 위반 검증
3. **미래 준비**: Phase 3에서 포커스 순서, 선택 범위가 계층 기반

---

### 2.4 5개 축 (5 Axes)

모든 IDDL 요소는 5개 축으로 정의됩니다:

#### 1. `type` (무엇인가)
```tsx
<Page>      // 페이지
<Section>   // 영역
<Block>     // 묶음
<Element>   // 요소
  - Text    // 텍스트
  - Field   // 입력
  - Action  // 액션
```

---

#### 2. `role` (어떤 역할인가)

**Page roles**:
- `Application` - Full-screen app (IDE, Studio)
- `Document` - Scrollable page (Settings, Docs)
- `Focus` - Centered content (Login, Payment)

**Section roles**:
- `Header`, `Footer`, `PrimarySidebar`, `Editor`, `Panel`

**Block roles**:
- `Card`, `Form`, `Toolbar`, `List`, `Grid`

**Element roles**:
- Text: `Title`, `Heading`, `Body`, `Label`, `Caption`
- Field: `Input`, `Select`, `Checkbox`, `Radio`, `Switch`
- Action: `Button`, `IconButton`, `Link`

---

#### 3. `prominence` (얼마나 중요한가)

```
Hero       (가장 중요)
  ↓
Primary    (중요)
  ↓
Secondary  (보통)
  ↓
Tertiary   (덜 중요)
```

**영향**:
- 폰트 크기: Hero > Primary > Secondary > Tertiary
- 폰트 굵기: Hero (600) > Primary (500) > Secondary (400)
- 패딩/간격: prominence에 따라 자동 결정

---

#### 4. `intent` (어떤 의미인가)

```
Neutral    (중립)
Brand      (브랜드)
Positive   (긍정: 성공, 저장, 확인)
Caution    (경고: 주의, 검토 필요)
Critical   (위험: 삭제, 에러)
Info       (정보)
```

**영향**:
- 색상: intent에 따라 토큰 선택
  - `Neutral` → gray
  - `Brand` → accent (blue/emerald/purple)
  - `Positive` → green
  - `Critical` → red
- 시맨틱: ARIA role, HTML 태그

---

#### 5. `density` (얼마나 여유있는가)

```
Comfortable  (넓은 간격)
  ↓
Standard     (기본 간격)
  ↓
Compact      (좁은 간격)
```

**영향**:
- 패딩: Comfortable (16px) > Standard (12px) > Compact (8px)
- Gap: Comfortable (24px) > Standard (16px) > Compact (8px)

---

### 2.5 축의 조합 → 패턴

**핵심 공식**:
```
prominence × intent × density × state → 디자인 패턴
```

#### 예시: Button 패턴

| prominence | intent | 배경색 | 텍스트 색 | 패딩 |
|-----------|--------|--------|----------|------|
| Primary | Positive | green-500 | white | px-6 py-3 |
| Primary | Critical | red-500 | white | px-6 py-3 |
| Secondary | Neutral | transparent | gray-700 | px-4 py-2 |

**State 추가**:
| state | 배경색 변화 |
|-------|-----------|
| hover | +100 (green-500 → green-600) |
| active | +200 (green-500 → green-700) |
| disabled | opacity-50 |

→ **CVA (Class Variance Authority)로 구현**

---

## 3. 아키텍처

### 3.1 프로젝트 구조

```
src/
├── components/types/          # IDDL 컴포넌트
│   ├── Page/
│   │   ├── Page.tsx           # 메인 컴포넌트
│   │   ├── renderers/         # Role별 렌더러
│   │   └── hooks/             # 레이아웃 로직
│   ├── Section/
│   │   ├── Section.tsx
│   │   ├── renderers/
│   │   └── role/              # Role 변형
│   ├── Block/
│   │   ├── Block.tsx
│   │   └── role/
│   └── Element/
│       ├── Text/
│       │   ├── Text.tsx
│       │   └── role/          # Title, Body, Label...
│       ├── Field/
│       │   ├── Field.tsx
│       │   ├── renderers/     # TextField, NumberField...
│       │   └── role/          # Input, Select, Checkbox...
│       ├── Action/
│       │   ├── Action.tsx
│       │   ├── renderers/     # ButtonAction, IconButtonAction...
│       │   └── role/          # Button, IconButton...
│       └── Separator/
│
├── shared/
│   ├── config/
│   │   ├── tokens.ts          # 디자인 토큰
│   │   └── prominence-tokens.ts
│   └── lib/
│       ├── utils.ts           # cn() 유틸
│       └── theme.ts           # 테마 관리
│
└── apps/                      # 데모 앱들
    ├── IDE/
    ├── PPT/
    └── ...
```

---

### 3.2 컴포넌트 패턴: Headless + Renderer

**Field 컴포넌트 예시**:

```
Field.tsx (Main)
  ├─ headless/           # 로직만 (UI 없음)
  │   ├─ useTextField.ts      # 텍스트 입력 로직
  │   ├─ useNumberField.ts    # 숫자 입력 로직
  │   └─ useSelectField.ts    # 셀렉트 로직
  │
  ├─ renderers/          # UI만 (로직 없음)
  │   ├─ TextField.tsx        # CVA variants + headless hook
  │   ├─ NumberField.tsx
  │   └─ SelectField.tsx
  │
  └─ role/               # 원시 컴포넌트
      ├─ Input.tsx
      ├─ Select.tsx
      └─ Checkbox.tsx
```

**코드 예시**:
```tsx
// Field.tsx - Main component (dataType 분기)
export function Field({ dataType, ...props }: FieldProps) {
  if (dataType === 'text') return <TextField {...props} />;
  if (dataType === 'number') return <NumberField {...props} />;
  // ...
}

// headless/useTextField.ts - 로직만
export function useTextField(props: UseTextFieldProps) {
  const [value, setValue] = useState(props.value);
  const handleChange = (e) => {
    setValue(e.target.value);
    props.onChange?.(e.target.value);
  };
  return {
    inputProps: () => ({ value, onChange: handleChange }),
    labelProps: () => ({ htmlFor: id }),
  };
}

// renderers/TextField.tsx - UI + CVA
export function TextField(props: FieldProps) {
  const field = useTextField(props);
  return (
    <div className={containerVariants({ prominence, intent })}>
      <label {...field.labelProps()}>{props.label}</label>
      <input
        {...field.inputProps()}
        className={inputVariants({ prominence, intent, state })}
      />
    </div>
  );
}
```

**장점**:
- ✅ 로직은 테스트 가능 (UI 없이)
- ✅ UI는 교체 가능 (Material, Ant Design...)
- ✅ CVA로 패턴 일관성 보장

---

### 3.3 CVA (Class Variance Authority)

**역할**: prominence × intent × state → className 자동 생성

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  // base (공통)
  'rounded-lg font-medium transition-colors',
  {
    variants: {
      prominence: {
        Primary: 'px-6 py-3 text-base',
        Secondary: 'px-4 py-2 text-sm',
      },
      intent: {
        Positive: 'bg-green-500 text-white hover:bg-green-600',
        Critical: 'bg-red-500 text-white hover:bg-red-600',
        Neutral: 'bg-transparent text-gray-700 hover:bg-gray-100',
      },
    },
  }
);

// 사용
<button className={buttonVariants({ prominence: 'Primary', intent: 'Positive' })}>
  Save
</button>
```

**현황**:
- [✅] Layout variants (depth-based)
- [✅] Button variants (일부)
- [🚧] Field variants (진행 중)
- [🚧] Text variants (진행 중)

---

### 3.4 Design Tokens

**위치**: `src/shared/config/tokens.ts`

```typescript
export const tokens = {
  // 색상
  colors: {
    accent: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      // ...
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
    },
    semantic: {
      positive: '#10b981',
      critical: '#ef4444',
      caution: '#f59e0b',
    },
  },

  // 그림자 (depth-based)
  shadows: {
    0: 'none',
    1: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    2: 'none',
    3: '0 1px 3px rgba(0,0,0,0.1)',
    4: '0 4px 6px rgba(0,0,0,0.1)',
    5: '0 10px 15px rgba(0,0,0,0.1)',
    6: '0 20px 25px rgba(0,0,0,0.15)',
  },

  // 간격 (허용 값만)
  spacing: [4, 8, 12, 16, 24, 32, 48, 64, 96],

  // 타이포그래피
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
};
```

**TailwindCSS 통합**:
```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: tokens.colors,
      boxShadow: tokens.shadows,
    },
  },
};
```

---

## 4. 구현 현황

### 4.1 완성도 체크리스트 (2026-01-11 기준)

#### ✅ Core (100%)

- [x] IDDL 1.0 Spec (영문/한글)
- [x] TypeScript 타입 정의 (`iddl.d.ts`)
- [x] 계층 구조 규칙
- [x] 5개 축 정의

---

#### ✅ Infrastructure (100%)

- [x] Design Tokens 시스템
- [x] Theme 시스템 (light/dark, color schemes, density)
- [x] IDDL Inspector (Cmd+D)
- [x] Multi-app showcase (14개 앱)
- [x] Documentation structure

---

#### ✅ Page Component (95%)

- [x] role="Application" (Full-screen app)
- [x] role="Document" (Scrollable page)
- [x] role="Focus" (Centered content)
- [x] role="Fullscreen" (Locked viewport)
- [x] Dynamic grid templates (Studio, HolyGrail, Sidebar...)
- [x] Resizable panels
- [🚧] Breadcrumbs (구현되었지만 스타일 개선 필요)

---

#### ✅ Section Component (90%)

- [x] Section.tsx (메인 컴포넌트)
- [x] renderers/ (IDESection, ContainerSection, FrameSection, DialogSection)
- [x] role variants (Panel, Toolbar, RightBar)
- [🚧] 모든 Section role 구현 (일부 누락)

---

#### 🚧 Block Component (70%)

- [x] Block.tsx (메인 컴포넌트)
- [x] role variants:
  - [x] Card
  - [x] Tabs
  - [x] DataTable
  - [x] Accordion
  - [x] Toolbar
  - [x] Progress
  - [x] Divider
  - [x] Dropdown
  - [x] Spinner
  - [x] Skeleton
  - [x] SortableList
- [🚧] CVA variants 완성 필요
- [ ] Grid role 구현
- [ ] List role 구현
- [ ] Form role 구현

---

#### 🚧 Element.Text Component (75%)

- [x] Text.tsx (메인 컴포넌트)
- [x] role variants:
  - [x] Label
  - [x] Code
  - [x] CodeBlock
  - [x] Badge
  - [x] Alert
  - [x] Avatar
  - [x] Kbd
  - [x] Tag
  - [x] Content
- [🚧] prominence × intent variants 완성 필요
- [ ] Title, Heading, Body, Caption role 구현

---

#### 🚧 Element.Field Component (60%)

- [x] Field.tsx (dataType 분기)
- [x] Field.types.ts (타입 정의)
- [x] Headless hooks:
  - [🚧] useTextField (부분 구현)
  - [🚧] useNumberField (부분 구현)
  - [ ] useSelectField
  - [ ] useRadioField
  - [ ] useDateField
  - [ ] ...
- [🚧] Renderers:
  - [x] TextField
  - [x] NumberField
  - [x] TextareaField
  - [x] SelectField
  - [x] CheckboxField
  - [x] RadioField
  - [x] BooleanField (Switch)
  - [x] DateField
  - [x] ColorField
  - [x] FileField
  - [x] RatingField
  - [ ] 나머지 dataType (11개)
- [x] role primitives:
  - [x] Input
  - [x] Textarea
  - [x] Select
  - [x] Checkbox
  - [x] Radio
  - [x] RadioGroup
  - [x] CheckboxGroup
  - [x] Switch
  - [x] Slider
  - [x] SearchInput
  - [x] FormField

---

#### 🚧 Element.Action Component (70%)

- [x] Action.tsx (메인 컴포넌트)
- [🚧] Renderers:
  - [x] ButtonAction
  - [x] IconButtonAction
  - [x] LinkAction
- [x] role primitives:
  - [x] Button
  - [x] IconButton
  - [x] ResizeHandle
- [🚧] prominence × intent × state variants 완성 필요

---

#### ✅ Element.Separator Component (100%)

- [x] Separator.tsx

---

#### 🚧 Overlay Component (80%)

- [x] Overlay.tsx
- [x] CommandPalette
- [x] SearchModal
- [x] SettingsModal
- [x] SearchModalDSL
- [x] SettingsModalDSL
- [x] role/Tooltip
- [🚧] Dialog, Drawer, Popover, Toast 구현 필요

---

### 4.2 완성도 요약

| 컴포넌트 | 완성도 | 상태 |
|---------|--------|------|
| Core Spec | 100% | ✅ 완료 |
| Infrastructure | 100% | ✅ 완료 |
| Page | 95% | ✅ 거의 완료 |
| Section | 90% | ✅ 거의 완료 |
| Block | 70% | 🚧 진행 중 |
| Element.Text | 75% | 🚧 진행 중 |
| Element.Field | 60% | 🚧 진행 중 |
| Element.Action | 70% | 🚧 진행 중 |
| Element.Separator | 100% | ✅ 완료 |
| Overlay | 80% | ✅ 거의 완료 |

**전체 평균**: ~80%

---

## 5. 패턴 시스템

### 5.1 패턴 정의 전략

**패턴 = prominence × intent × state**

#### 조합 수
- prominence: 4개 (Hero, Primary, Secondary, Tertiary)
- intent: 6개 (Neutral, Brand, Positive, Caution, Critical, Info)
- state: 6개 (default, hover, active, focus, selected, disabled)

**총 조합**: 4 × 6 × 6 = 144개

→ **모든 조합을 수동으로 정의하는 건 불가능**

---

### 5.2 토큰 기반 자동 생성

**전략**: 기본 규칙 + 예외만 정의

```tsx
// 기본 규칙
const getBackgroundColor = (prominence, intent, state) => {
  // prominence가 Primary/Hero면 배경색 채움
  if (prominence === 'Primary' || prominence === 'Hero') {
    const baseColor = intentColors[intent]; // e.g., 'green' for Positive
    if (state === 'hover') return `${baseColor}-600`;
    if (state === 'active') return `${baseColor}-700`;
    return `${baseColor}-500`;
  }

  // Secondary/Tertiary는 투명 배경
  if (state === 'hover') return 'gray-100';
  return 'transparent';
};

// 예외 정의
const exceptions = {
  'Primary-Critical-disabled': 'bg-red-300 cursor-not-allowed',
};
```

---

### 5.3 CVA Variants 구조

```tsx
import { cva } from 'class-variance-authority';

export const actionVariants = cva(
  // base (모든 조합 공통)
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:ring-2',
  {
    variants: {
      prominence: {
        Hero: 'px-8 py-4 text-lg',
        Primary: 'px-6 py-3 text-base',
        Secondary: 'px-4 py-2 text-sm',
        Tertiary: 'px-2 py-1 text-xs',
      },
      intent: {
        Brand: '', // compoundVariants로 prominence와 조합
        Positive: '',
        Critical: '',
        Neutral: '',
      },
    },
    compoundVariants: [
      // Primary + Positive
      {
        prominence: 'Primary',
        intent: 'Positive',
        className: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
      },
      // Primary + Critical
      {
        prominence: 'Primary',
        intent: 'Critical',
        className: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
      },
      // Secondary + Neutral
      {
        prominence: 'Secondary',
        intent: 'Neutral',
        className: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
      },
      // ... 나머지 조합
    ],
  }
);
```

---

### 5.4 State 자동 생성

**Interactive States**:
```
default → hover → active → focus → selected → disabled
```

**구현**:
```tsx
// State를 className에 자동 추가
const getStateClasses = (prominence, intent, state) => {
  const base = actionVariants({ prominence, intent });

  if (state === 'disabled') {
    return `${base} opacity-50 cursor-not-allowed`;
  }

  if (state === 'selected') {
    // selected는 active 스타일 + 추가 시각적 표시
    return `${base} ring-2 ring-accent`;
  }

  // hover, active, focus는 이미 CVA에 정의됨
  return base;
};
```

---

## 6. 남은 작업

### 6.1 Phase 1 완료를 위한 TODO

#### 🎯 Priority 1 (필수)

**1. CVA Variants 완성**
- [ ] Action: 모든 prominence × intent 조합 (24개)
- [ ] Field: 모든 prominence × intent 조합 (24개)
- [ ] Text: 모든 prominence × intent 조합 (24개)
- [ ] Interactive states 토큰 시스템 (hover, active, selected, disabled, focus)

**2. Field dataType 완성**
- [ ] 나머지 11개 dataType 렌더러 구현:
  - [ ] url, tel, search (TextInput 변형)
  - [ ] currency, percentage (NumberInput 변형)
  - [ ] time, datetime, month, week, daterange (DateInput 변형)
  - [ ] multiselect (Select 변형)
  - [ ] richtext (Textarea 변형)

**3. Block role 완성**
- [ ] Grid role 구현
- [ ] List role 구현
- [ ] Form role 구현

**4. Text role 완성**
- [ ] Title, Heading, Body, Caption role 구현
- [ ] prominence × role 조합 패턴 정의

---

#### 🎯 Priority 2 (권장)

**5. Documentation**
- [ ] Pattern catalog (모든 prominence × intent 조합 시각화)
- [ ] Component API reference 완성
- [ ] Storybook stories 추가

**6. Testing**
- [ ] Visual regression tests (Percy, Chromatic)
- [ ] Accessibility tests (axe-core, jest-axe)
- [ ] Unit tests (컴포넌트 렌더링)

**7. Examples**
- [ ] 실제 앱 예시 (Dashboard, Settings, Profile)
- [ ] Before/After 비교 예시
- [ ] Migration guide 예시

---

#### 🎯 Priority 3 (선택)

**8. Developer Experience**
- [ ] VS Code snippets (IDDL 자동완성)
- [ ] ESLint plugin (IDDL 규칙 검증)
- [ ] Figma plugin (디자인 → IDDL 변환)

**9. Performance**
- [ ] Bundle size 최적화
- [ ] Runtime performance profiling
- [ ] Lazy loading 전략

---

### 6.2 작업 예상 시간

| 작업 | 예상 시간 | 중요도 |
|------|----------|--------|
| CVA Variants 완성 | 2주 | 🔥 Critical |
| Field dataType 완성 | 1주 | 🔥 Critical |
| Block role 완성 | 1주 | ⚠️ High |
| Text role 완성 | 1주 | ⚠️ High |
| Documentation | 1주 | ⚠️ High |
| Testing | 2주 | 📌 Medium |
| Examples | 1주 | 📌 Medium |
| DX Improvements | 2주 | 💡 Low |

**Phase 1 완료 예상**: 2026-01 말 (~3주)

---

## 7. 성공 기준

### 7.1 Phase 1 완료 기준

**"개발자가 IDDL만으로 화면을 만들 수 있다"**

#### 시나리오 1: 사용자 프로필 페이지

```tsx
<Page role="Document" title="User Profile">
  <Section role="Container">
    <Block role="Card">
      <Text role="Title" prominence="Primary">
        Profile Settings
      </Text>

      <Block role="Form">
        <Field label="Name" dataType="text" prominence="Standard" required />
        <Field label="Email" dataType="email" prominence="Standard" required />
        <Field label="Bio" dataType="textarea" prominence="Standard" />
      </Block>

      <Block role="Toolbar">
        <Action prominence="Secondary" intent="Neutral">Cancel</Action>
        <Action prominence="Primary" intent="Positive">Save</Action>
      </Block>
    </Block>
  </Section>
</Page>
```

**체크리스트**:
- [ ] 화면이 패턴대로 렌더링됨
- [ ] prominence × intent 조합이 일관됨
- [ ] 반응형 (모바일/데스크톱)
- [ ] 테마 지원 (light/dark)
- [ ] 접근성 (ARIA, 시맨틱 HTML, 키보드)
- [ ] 개발자가 className을 하나도 작성하지 않음

---

#### 시나리오 2: 대시보드

```tsx
<Page role="Application" layout="HolyGrail">
  <Section role="Header">
    <Block role="Toolbar">
      <Text role="Title" prominence="Primary">Dashboard</Text>
      <Action prominence="Secondary" intent="Neutral">
        Settings
      </Action>
    </Block>
  </Section>

  <Section role="Navigator">
    <Block role="List">
      {navItems.map(item => (
        <Text prominence="Secondary">{item.label}</Text>
      ))}
    </Block>
  </Section>

  <Section role="Container">
    <Block role="Grid">
      {widgets.map(widget => (
        <Block role="Card">
          <Text role="Heading" prominence="Primary">{widget.title}</Text>
          <Text prominence="Tertiary">{widget.value}</Text>
        </Block>
      ))}
    </Block>
  </Section>
</Page>
```

**체크리스트**:
- [ ] Grid layout 자동 생성
- [ ] Navigator + Container 분리
- [ ] 모든 역할이 명확
- [ ] 일관된 간격/색상

---

### 7.2 품질 기준

#### Accessibility (접근성)
- [ ] 모든 interactive 요소에 키보드 접근 가능
- [ ] 적절한 ARIA role, label
- [ ] 색상 대비 WCAG AA 이상
- [ ] 스크린 리더 테스트 통과

#### Performance (성능)
- [ ] First Contentful Paint < 1s
- [ ] Lighthouse 스코어 > 90
- [ ] Bundle size < 100KB (gzipped)

#### Developer Experience (개발 경험)
- [ ] TypeScript 타입 100% 지원
- [ ] 명확한 에러 메시지
- [ ] 자동완성 지원
- [ ] 예시 코드 충분

#### Consistency (일관성)
- [ ] 같은 prominence × intent는 항상 같은 모습
- [ ] 모든 컴포넌트가 5개 축 지원
- [ ] 테마 변경 시 자동 반영

---

### 7.3 다음 단계 (Phase 2 시작 조건)

**Phase 2를 시작하려면**:

1. ✅ Phase 1 핵심 기능 100% 완성
   - CVA Variants 완성
   - 모든 dataType 구현
   - 모든 role 구현

2. ✅ Documentation 완성
   - API Reference
   - Pattern Catalog
   - Examples

3. ✅ Testing 완성
   - Unit tests
   - Accessibility tests
   - Visual regression tests

4. ✅ 실제 앱 1개 완성
   - IDE 앱 완성도 90% 이상
   - 실제 사용 가능한 수준

→ **"Phase 1으로 화면을 충분히 만들 수 있다"는 확신**

---

## 8. 관련 문서

- [Application Platform Vision](./application-platform-vision.md) - 전체 3 Phase 비전
- [IDE Design Philosophy](./ide-design-philosophy.md) - IDDL의 디자인 철학
- [IDDL 1.0 Spec](../../spec/iddl-1.0-spec-ko.md) - 공식 스펙 (한글)
- [Standard Roles](../3-reference/iddl-standard-roles.md) - 표준 Role 레지스트리
- [Developer Guide](../3-reference/iddl-developer-guide-ko.md) - 개발자 치트 시트

---

**Last Updated**: 2026-01-11
**Status**: 진행 중 (~80% 완성)
**Next Milestone**: CVA Variants 완성 (2주 내)
