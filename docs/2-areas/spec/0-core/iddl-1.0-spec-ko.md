# IDDL 1.0 — Part 1: Intent & Structure Core

**문서 상태:** Draft (Core Freeze Candidate)  
**대상:** Renderer 구현자, 유효성 검사기(Validator) 제작자, 저작 도구 개발자  
**날짜:** 2026-01-10  

---

## 1. 개요 (Abstract)

IDDL(Intent-Driven Design Language)은 UI를 **구현(Implementation)**이 아닌 **의도(Intent)**와 **구조(Structure)**로 기술하기 위한 선언형 명세입니다.

IDDL의 핵심 목적은 다음과 같습니다.

*   **렌더러(디자인 시스템)의 자율성 극대화:** 동일한 IDDL 문서가 브랜드/제품의 UI 언어에 맞춰 **색상 수준을 넘어 와이어프레임 수준까지** 변형될 수 있어야 합니다.
*   **의도 전달의 보존:** 변형이 발생하더라도, 작성자가 전달한 **의미(의도/중요도/밀도)**는 유지되어야 합니다.

본 문서(Part 1)는 IDDL의 “코어”로서, **의도·구조·렌더러 자율성**만 정의합니다.  
데이터 바인딩, 조건식, 상태 모델 등은 **Part 2**에서 정의합니다.

---

## 2. 용어 및 규범 키워드 (Conformance Terminology)

본 문서에서 “MUST”, “MUST NOT”, “SHOULD”, “MAY”는 규범적 요구사항을 의미합니다.

*   **MUST**: 반드시 준수해야 함
*   **MUST NOT**: 절대 해서는 안 됨
*   **SHOULD**: 강력 권고 (정당한 사유가 있으면 예외 가능)
*   **MAY**: 선택 사항

---

## 3. 코어 철학 (Core Philosophy)

### 3.1 Intent over Implementation
IDDL은 “빨간 버튼”이 아니라 “위험한 행동(Critical Action)”처럼 **의미**로 UI를 기술합니다.

### 3.2 Strict Structure
IDDL은 UI를 안정적으로 이해/검증/생성하기 위해 **엄격한 계층 구조**를 사용합니다.

### 3.3 Renderer Autonomy with Intent Preservation
Renderer는 IDDL을 자사 브랜드에 맞춰 **구조/패턴/레이아웃을 재해석**할 수 있습니다. 단, IDDL이 명시한 **의도 축의 의미 효과**는 보존되어야 합니다.

### 3.4 IDDL as ARIA Superset
IDDL은 **ARIA(Accessible Rich Internet Applications)의 상위호환**으로 설계되었습니다.

#### 3.4.1 ARIA의 범위
ARIA는 웹 애플리케이션의 접근성을 위해 **역할(role)과 상태(state)**를 선언합니다:
```html
<button role="button" aria-pressed="false" aria-label="Close">
  Close
</button>
```

ARIA가 다루는 영역:
*   ✅ **접근성**: 스크린 리더, 키보드 탐색을 위한 의미적 정보
*   ❌ **디자인**: 색상, 크기, 간격 등 시각적 표현 (CSS 별도 필요)
*   ❌ **레이아웃**: 요소 배치, 그리드 구조 (별도 HTML/CSS 필요)
*   ❌ **상태 시각화**: loading, selected 상태의 시각적 표현 (별도 구현 필요)

#### 3.4.2 IDDL의 확장
IDDL은 ARIA의 접근성 개념을 확장하여 **접근성 + 디자인 + 레이아웃 + 상태**를 모두 선언적으로 표현합니다:

```tsx
<Action
  role="Button"
  prominence="Strong"
  intent="Critical"
  selected={false}
  disabled={false}
>
  Close
</Action>
```

IDDL이 다루는 영역:
*   ✅ **접근성**: ARIA 속성 자동 생성 (`role`, `aria-*`)
*   ✅ **디자인**: prominence × intent → 색상/크기/패딩 자동 결정
*   ✅ **레이아웃**: role → 배치/정렬 자동 결정 (예: Toolbar → flex-row, List → flex-col)
*   ✅ **상태 시각화**: selected, loading, disabled → 시각적 피드백 자동 적용

#### 3.4.3 비교 예시: 탭 네비게이션

**ARIA + CSS 방식** (전통적):
```html
<div role="tablist" class="flex border-b">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="panel-1"
    class="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-semibold"
  >
    Profile
  </button>
  <button
    role="tab"
    aria-selected="false"
    aria-controls="panel-2"
    class="px-4 py-2 text-gray-600 hover:text-gray-800"
  >
    Security
  </button>
</div>
```

**IDDL 방식**:
```tsx
<Block role="Tabs">
  <Action role="Tab" selected={true}>
    Profile
  </Action>
  <Action role="Tab" selected={false}>
    Security
  </Action>
</Block>
```

**Renderer의 자동 처리**:
1.  **접근성**: `role="tablist"`, `aria-selected`, `aria-controls` 자동 설정
2.  **디자인**: selected 상태 → border-bottom, text-color 자동 적용
3.  **레이아웃**: Block role="Tabs" → flex, border-b 자동 적용
4.  **키보드**: Arrow keys 탐색 자동 구현

#### 3.4.4 의미론적 확장

ARIA는 **"이것이 무엇인가"**(What)만 선언합니다:
```
role="button" → "버튼입니다"
```

IDDL은 **"무엇 + 왜 중요 + 어떤 의미"**(What + Why + Meaning)를 선언합니다:
```
role="Button" prominence="Strong" intent="Critical"
→ "중요한 위험한 버튼입니다"
→ Renderer: 접근성 + 빨간 배경 + 큰 패딩 + 경고 스타일
```

#### 3.4.5 Naming Convention: ARIA → IDDL

IDDL role은 ARIA role을 기반으로 하되, **PascalCase**로 표기합니다 (MUST).

**변환 규칙**:
```
ARIA (소문자) → IDDL (PascalCase)
textbox       → Textbox
searchbox     → Searchbox
spinbutton    → Spinbutton
checkbox      → Checkbox
radio         → Radio
combobox      → Combobox
slider        → Slider
```

**IDDL 확장 Role** (ARIA에 없음):
```
IDDL Role      설명
Datepicker    → 날짜 선택
Timepicker    → 시간 선택
Filepicker    → 파일 선택
Colorpicker   → 색상 선택
Signature     → 서명 입력
Otp           → 일회용 비밀번호
Hidden        → 숨겨진 필드
```

**예시**:
```tsx
<Section role="Main">
  <Block role="Form">
    <Field role="Textbox" label="Name" />
    <Field role="Combobox" label="Country" />
    <Field role="Datepicker" label="Birth Date" />
    <Action role="Button">Submit</Action>
  </Block>
</Section>
```

**Renderer 매핑** (MUST):
```tsx
// IDDL 입력
<Field role="Textbox" />

// Renderer 출력
<input
  type="text"
  role="textbox"        // 소문자로 변환
  aria-label="..."
/>
```

**원칙**:
1.  **Source of Truth**: IDDL은 PascalCase 사용
2.  **Renderer 책임**: ARIA 매핑 시 소문자로 변환
3.  **확장성**: ARIA에 없는 role도 IDDL에서 정의 가능 (Datepicker, Colorpicker 등)

#### 3.4.6 상위호환 원칙

IDDL Renderer는 다음을 **MUST**로 준수해야 합니다:
1.  모든 IDDL 노드는 적절한 ARIA role을 가져야 함
2.  IDDL role은 PascalCase, 렌더링된 HTML의 ARIA role은 소문자여야 함
3.  IDDL의 selected, disabled 등의 상태는 해당 ARIA 속성으로 매핑되어야 함 (aria-selected, aria-disabled)
4.  ARIA가 정의하지 않은 시각적 속성(prominence, intent, density)은 CSS/스타일로 렌더링되어야 함

**결론**: IDDL은 ARIA의 철학(선언적 접근성)을 유지하면서, 그 범위를 **전체 UI 시스템**으로 확장한 것입니다.

---

## 4. 범위 (Scope)

### 4.1 Part 1에 포함되는 것
*   계층 모델: Page / Section / Block / Element (6종)
*   5축(Axes): Role / Intent / Prominence / Density / Spec
*   Renderer 자율성 및 의도 보존 규범
*   TSX 기반 타입 인터페이스 (정규화된 형태)

### 4.2 Part 1에서 제외되는 것 (Part 2 예정)
*   데이터 바인딩 (읽기/쓰기 표준, 표현식)
*   조건 렌더링 (condition)의 문법/실행 모델
*   상태 (state: loading/error/disabled/invalid 등) 표준
*   Command 실행/권한/보안 모델

---

## 5. 계층 구조 (Hierarchy Model)

### 5.1 노드 종류
IDDL 문서는 트리(Tree) 구조이며, 각 노드는 다음 중 하나입니다.

*   **Page**: 문서/라우트 단위의 루트
*   **Section**: 화면의 물리적 구획(영역)
*   **Block**: 의미적 덩어리 또는 레이아웃 컨테이너
*   **Element**: leaf(최소) 단위의 실체 요소

### 5.2 자식 구성 규칙 (Normative)
Validator 및 Renderer는 다음 규칙을 MUST로 강제해야 합니다.

1.  **Page의 자식은 Section만 허용한다.**
2.  **Section의 자식은 Block만 허용한다.**
3.  **Block의 자식은 Block 또는 Element만 허용한다.**
4.  **Element는 자식을 가질 수 없다.** (Text 컨텐츠 제외)

> **참고**: 이 규칙은 “HTML처럼 무엇이든 중첩되는 자유” 대신, **의도/구조 언어로서의 예측 가능성**을 선택한 것입니다.

---

## 6. IDDL의 5축 (The 5 Axes of Definition)

모든 노드(Section/Block/Element)는 다음 5축으로 정의될 수 있습니다(MAY). 단, 특정 노드에서 Role은 필수일 수 있습니다(MUST).

1.  **Role (역할):** “이것은 무엇인가?”
2.  **Intent (의도):** “어떤 의미 맥락인가?”
3.  **Prominence (위계):** “얼마나 중요한가?”
4.  **Density (밀도):** “얼마나 촘촘한 인터페이스인가?”
5.  **Spec (역할 명세):** “Role을 성립/구체화하기 위한 role-dependent 파라미터”

---

## 7. 축 상세 정의 (Axes)

### 7.1 Role
Role은 노드의 기능적 정체성을 나타냅니다. Role은 Renderer가 패턴/구조를 선택하는 데 사용될 수 있습니다(MAY).

*   **Section Role (필수)**: `Header`, `Footer`, `Main`, `Sidebar`, `Drawer`, `Modal`
*   **Block Role (선택)**: `Form`, `Card`, `List`, `Toolbar`, `Menu`, `Grid` 등
*   **Element (6종)**: `Text`, `Image`, `Video`, `Field`, `Action`, `Separator`

### 7.2 Intent
Intent는 의미론적 맥락을 나타냅니다.

*   **Values**: `Neutral`, `Brand`, `Positive`, `Caution`, `Critical`, `Info`

### 7.3 Prominence
Prominence는 중요도/비중을 나타냅니다.

*   **Values**: `Hero`, `Standard`, `Subtle`, `Hidden`

#### Hidden의 최소 규범 의미
*   `Hidden`인 노드는 사용자에게 보이는 UI로 표시되어서는 안 됩니다 (MUST NOT).
*   Hidden의 기술적 구현(렌더 제거/시각 숨김 등)은 Renderer 정책에 따를 수 있습니다 (MAY).

### 7.4 Density
Density는 UI의 물리적 밀도(간격/타깃 크기/리듬)를 결정하는 축입니다.

*   **Values**: `Standard`, `Comfortable`, `Compact`
*   **최소 의미(코어)**:
    *   `Standard`: 기본 밀도
    *   `Comfortable`: 여유 있는 밀도 (가독성/터치 여유 강화)
    *   `Compact`: 조밀한 밀도 (정보량/작업량 많은 화면에 적합)

> **Note**: 픽셀 값, 토큰 맵핑은 Renderer의 책임입니다.

### 7.5 Spec (역할 명세)

#### 7.5.1 정의
`spec`은 해당 노드의 `role`을 성립시키거나 구체화하기 위한 **role-dependent 파라미터 집합**입니다.

#### 7.5.2 역할-종속성 (role-dependent)
`spec`의 스키마(필수/선택 필드, 타입)는 `role`에 의해 결정됩니다 (MUST).

#### 7.5.3 데이터 제약
*   `spec`은 직렬화 가능한 **순수 데이터(Plain Data)** 여야 합니다 (MUST).
*   함수, 클래스 인스턴스, 런타임 핸들/참조를 포함해서는 안 됩니다 (MUST NOT).

#### 7.5.4 표현 파라미터 금지 (중요)
*   `spec`은 표현(CSS/픽셀/색/폰트)을 직접 기술하기 위한 용도로 사용되어서는 안 됩니다 (MUST NOT).
*   `spec`은 “패턴 성립에 필요한 최소 파라미터” 제공을 목적으로 합니다 (MUST).

#### 7.5.5 상속
`spec`은 상속되지 않습니다 (MUST NOT).

> **참고**: spec을 상속/병합하기 시작하면 role마다 규칙이 달라져 코어가 복잡해집니다. Part 1 코어에서는 금지합니다.

---

## 8. Element 코어 정의 (Element Taxonomy)

IDDL은 다음 6 Element만으로 UI leaf를 표현합니다.

### 8.1 Text
*   Role: `Title`, `Heading`, `Body`, `Label`, `Caption`
*   Props(Part 1 코어): `content?: string`, `align?`, `icon?`

### 8.2 Image
*   Props: `src: string`, `alt: string`
*   Options: `aspectRatio?`, `fit?`

### 8.3 Video
*   Props: `src: string`
*   Options: `poster?`, `autoplay?`, `loop?`, `controls?`

### 8.4 Field
*   Props: `label: string`, `model: string`, `type: FieldType`, `required?`, `disabled?`
*   **Note**: `model`은 “입력 위치”를 나타내지만, 읽기/쓰기 바인딩 표준은 Part 2에서 정의합니다.

### 8.5 Action
*   Props: `label: string`, `icon?`, `behavior?`
*   **Note**: behavior 종류는 구조만 확정하며, 실행/권한은 Part 2 범위입니다.

### 8.6 Separator
*   Props: `type?`, `size?`, `orientation?`, `content?`
*   목적: 논리적 구분 및 레이아웃 평탄화.

---

## 9. Renderer 자율성과 의도 보존 (Normative)

### 9.1 변형 허용 (Autonomy)
Renderer는 다음을 수행할 수 있습니다 (MAY).
*   Role/Spec을 자사 디자인 시스템의 패턴으로 변환 (컴포넌트 형태 변경 포함)
*   레이아웃/와이어프레임 수준의 재구성
*   브랜드별 Minimal 스타일, 컴포넌트 스타일 변형

### 9.2 보존 의무 (Preservation)
Renderer는 다음 축의 의미 효과를 훼손해서는 안 됩니다 (MUST NOT).
*   `Intent`
*   `Prominence`
*   `Density`

### 9.3 기능 의미 보존 (Functional Meaning)
Renderer는 다음 기능 의미를 변경해서는 안 됩니다 (MUST NOT).
*   Action의 `behavior.type`이 의미하는 행동 종류
*   Field가 나타내는 입력 컨트롤의 의미 (타입/required/disabled 등)

---

## 10. 기본 매핑 제공 (Developer-Friendly Core)

Part 1의 목표에는 “디자인 없이도 개발이 진행 가능한 최소 UI”가 포함됩니다. 이를 위해:
*   Renderer는 각 Role에 대해 합리적인 기본 매핑(패턴/기본 레이아웃)을 제공해야 합니다 (SHOULD).

> **참고**: 이 규정은 “IDDL 문서만 받아도 기본 화면이 나온다”는 최소 개발자 경험을 보장합니다. 단, 어떤 모양이 ‘기본’인지의 상세는 Renderer 정책입니다.

---

## 11. Normative TSX Interfaces (Part 1)

```ts
// --- Axes ---
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
export type Prominence = 'Hero' | 'Standard' | 'Subtle' | 'Hidden';
export type Density = 'Standard' | 'Comfortable' | 'Compact';

// spec은 role-dependent한 순수 데이터
export type Spec = Record<string, unknown>;

// --- Base Props (Part 1 Core) ---
interface BaseProps {
  intent?: Intent;
  prominence?: Prominence;
  density?: Density;
  spec?: Spec;
}

// Page
export interface PageProps {
  title?: string;
}

// Section
export type SectionRole = 'Header' | 'Footer' | 'Main' | 'Sidebar' | 'Drawer' | 'Modal';
export interface SectionProps extends BaseProps {
  role: SectionRole;
}

// Block
export type BlockRole = 'Form' | 'Card' | 'List' | 'Toolbar' | 'Menu' | 'Grid';
export interface BlockProps extends BaseProps {
  role?: BlockRole; // 레이아웃용 Block은 생략 가능
}

// Elements
export interface TextProps extends BaseProps {
  role: 'Title' | 'Heading' | 'Body' | 'Label' | 'Caption';
  content?: string;
  icon?: string;
  // align은 role에 따라 자동 결정됨
}

export interface ImageProps extends BaseProps {
  src: string;
  alt: string;
  // aspectRatio와 fit은 spec 객체에 포함되어야 함
  // spec?: { aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3'; fit?: 'cover' | 'contain' }
}

export interface VideoProps extends BaseProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export type FieldType =
  | 'text' | 'number' | 'email' | 'password'
  | 'select' | 'date' | 'checkbox' | 'radio';

export interface FieldProps extends BaseProps {
  label: string;
  model: string;
  type: FieldType;
  options?: Array<{ label: string; value: any }>;
  required?: boolean;
  disabled?: boolean;
}

export type ActionBehavior =
  | { type: 'submit' }
  | { type: 'navigate'; to: string; target?: string }
  | { type: 'command'; id: string; params?: any }
  | { type: 'open'; target: string };

export interface ActionProps extends BaseProps {
  label: string;
  icon?: string;
  behavior?: ActionBehavior;
}

export interface SeparatorProps extends BaseProps {
  type?: 'line' | 'space';
  orientation?: 'horizontal' | 'vertical';
  content?: string;
  // size는 density에서 자동 계산됨
}
```

---

## 12. 예시 (Informative)

> 데이터 바인딩은 Part 2에서 정의하므로, 본 예시는 리터럴 중심으로 작성합니다.

```tsx
<Page title="프로필 수정">
  <Section role="Header">
    <Block role="Toolbar" density="Standard">
      <Text role="Title" content="설정" />
      <Action label="닫기" behavior={{ type: 'navigate', to: '/home' }} prominence="Subtle" />
    </Block>
  </Section>

  <Section role="Main" density="Comfortable">
    <Block role="Card">
      <Text role="Heading" content="프로필" />
      <Separator type="line" />

      <Block role="Form" density="Standard">
        <Field label="닉네임" model="user.nickname" type="text" required />
        <Field label="소개" model="user.bio" type="text" />
        <Separator type="space" size="medium" />
        <Field label="이메일 수신" model="user.optIn" type="checkbox" />
      </Block>

      <Separator type="space" size="large" />

      <Action label="저장" intent="Brand" prominence="Hero" behavior={{ type: 'submit' }} />
      <Action label="계정 삭제" intent="Critical" prominence="Subtle" behavior={{ type: 'command', id: 'deleteAccount' }} />
    </Block>
  </Section>
</Page>
```
