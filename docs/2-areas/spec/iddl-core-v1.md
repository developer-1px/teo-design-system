# Intent-Driven Design Language (IDDL) 1.0 — Part 1: Intent & Structure Core

다음은 지금까지 합의된 방향을 반영해 **IDDL Part 1(Intent & Structure Core)** 를 “W3C 명세 스타일”로, 그러나 대중이 읽을 수 있도록 친절하게 다시 작성한 **Draft 스펙 정의서**입니다.

(요청대로 **데이터 바인딩은 Part 2로 제외**했고, **5축(Role/Intent/Prominence/Density/Spec)** 과 “렌더러 자율성 + 의도 보존” 계약을 코어에 포함했습니다.)

---

# Intent-Driven Design Language (IDDL) 1.0 — Part 1: Intent & Structure Core

**Status:** Draft (Core Freeze Candidate)
**Target:** Renderer / Validator / Authoring Tool / Designers & Developers
**Date:** 2026-01-10

---

## 1. 개요 (Abstract)

IDDL(Intent-Driven Design Language)은 UI를 **구현(Implementation)** 이 아니라 **의도(Intent)** 와 **구조(Structure)** 로 기술하기 위한 선언형 명세이다.

IDDL의 핵심 목적은 다음과 같다.

* **렌더러(디자인 시스템)의 자율성 극대화:**
  동일한 IDDL 문서가 브랜드/제품의 UI 언어에 맞춰 **색상 수준을 넘어 와이어프레임 수준까지** 변형될 수 있다.
* **의도 전달의 보존:**
  변형이 발생하더라도, 작성자가 전달한 **의미(의도/중요도/밀도)** 는 유지되어야 한다.

본 문서(Part 1)는 IDDL의 “코어”로서, **의도·구조·렌더러 자율성**만 정의한다.
데이터 바인딩, 조건식, 상태 모델 등은 Part 2에서 정의한다.

---

## 2. 용어 및 규범 키워드 (Conformance Terminology)

본 문서에서 “MUST”, “MUST NOT”, “SHOULD”, “MAY”는 규범적 요구사항을 의미한다.

* **MUST**: 반드시 준수해야 함
* **MUST NOT**: 절대 해서는 안 됨
* **SHOULD**: 강력 권고(정당한 사유가 있으면 예외 가능)
* **MAY**: 선택 사항

---

## 3. 코어 철학 (Core Philosophy)

### 3.1 Intent over Implementation

IDDL은 “빨간 버튼”이 아니라 “위험한 행동(Critical Action)”처럼 **의미**로 UI를 기술한다.

### 3.2 Strict Structure

IDDL은 UI를 안정적으로 이해/검증/생성하기 위해 **엄격한 계층 구조**를 사용한다.

### 3.3 Renderer Autonomy with Intent Preservation

Renderer는 IDDL을 자사 브랜드에 맞춰 **구조/패턴/레이아웃을 재해석**할 수 있다.
단, IDDL이 명시한 **의도 축의 의미 효과**는 보존되어야 한다.

---

## 4. 범위 (Scope)

### 4.1 Part 1에 포함되는 것

* 계층 모델: Page / Section / Block / Element(6종)
* 5축(Axes): Role / Intent / Prominence / Density / Spec
* Renderer 자율성 및 의도 보존 규범
* TSX 기반 타입 인터페이스(정규화된 형태)

### 4.2 Part 1에서 제외되는 것(Part 2)

* 데이터 바인딩(읽기/쓰기 표준, 표현식)
* 조건 렌더링(condition)의 문법/실행 모델
* 상태(state: loading/error/disabled/invalid 등) 표준
* command 실행/권한/보안 모델

---

## 5. 계층 구조 (Hierarchy Model)

### 5.1 노드 종류

IDDL 문서는 트리(Tree) 구조이며, 각 노드는 다음 중 하나이다.

* **Page**: 문서/라우트 단위의 루트
* **Section**: 화면의 물리적 구획(영역)
* **Block**: 의미적 덩어리 또는 레이아웃 컨테이너
* **Element**: leaf(최소) 단위의 실체 요소

### 5.2 자식 구성 규칙 (Normative)

Validator 및 Renderer는 다음 규칙을 MUST로 강제해야 한다.

1. **Page의 자식은 Section만 허용한다.**
2. **Section의 자식은 Block만 허용한다.**
3. **Block의 자식은 Block 또는 Element만 허용한다.**
4. **Element는 자식을 가질 수 없다.**

> 친절한 설명:
> 이 규칙은 “HTML처럼 무엇이든 중첩되는 자유” 대신, **의도/구조 언어로서의 예측 가능성**을 선택한 것이다.

---

## 6. IDDL의 5축 (The 5 Axes of Definition)

모든 노드(Section/Block/Element)는 다음 5축으로 정의될 수 있다(MAY).
단, 특정 노드에서 Role은 필수일 수 있다(MUST).

1. **Role (역할):** “이것은 무엇인가?”
2. **Intent (의도):** “어떤 의미 맥락인가?”
3. **Prominence (위계):** “얼마나 중요한가?”
4. **Density (밀도):** “얼마나 촘촘한 인터페이스인가?”
5. **Spec (역할 명세):** “Role을 성립/구체화하기 위한 role-dependent 파라미터”

---

## 7. 축 상세 정의 (Axes)

## 7.1 Role

Role은 노드의 기능적 정체성을 나타낸다. Role은 Renderer가 패턴/구조를 선택하는 데 사용될 수 있다(MAY).

### Section Role (필수)

* `Header | Footer | Main | Sidebar | Drawer | Modal`

### Block Role (선택)

* `Form | Card | List | Toolbar | Menu | Grid`

### Element (6종)

* `Text | Image | Video | Field | Action | Separator`

---

## 7.2 Intent

Intent는 의미론적 맥락을 나타낸다.

**Values:**
`Neutral | Brand | Positive | Caution | Critical | Info`

---

## 7.3 Prominence

Prominence는 중요도/비중을 나타낸다.

**Values:**
`Hero | Standard | Subtle | Hidden`

### Hidden의 최소 규범 의미

* `Hidden`인 노드는 사용자에게 보이는 UI로 표시되어서는 안 된다(MUST NOT).
* Hidden의 기술적 구현(렌더 제거/시각 숨김 등)은 Renderer 정책에 따를 수 있다(MAY).

---

## 7.4 Density

Density는 UI의 물리적 밀도(간격/타깃 크기/리듬)를 결정하는 축이다.

**Values:**
`Standard | Comportable | Compact`

### 최소 의미(코어)

* `Standard`: 기본 밀도
* `Comportable`: 여유 있는 밀도(가독성/터치 여유 강화)
* `Compact`: 조밀한 밀도(정보량/작업량 많은 화면에 적합)

> Note: 픽셀 값, 토큰 맵핑은 Renderer의 책임이다.

---

## 7.5 Spec (역할 명세)

### 7.5.1 정의

`spec`은 해당 노드의 `role`을 성립시키거나 구체화하기 위한 **role-dependent 파라미터 집합**이다.

### 7.5.2 역할-종속성(role-dependent)

* `spec`의 스키마(필수/선택 필드, 타입)는 `role`에 의해 결정된다(MUST).

### 7.5.3 데이터 제약

* `spec`은 직렬화 가능한 **순수 데이터(Plain Data)** 여야 한다(MUST).
* 함수, 클래스 인스턴스, 런타임 핸들/참조를 포함해서는 안 된다(MUST NOT).

### 7.5.4 표현 파라미터 금지 (중요)

* `spec`은 표현(CSS/픽셀/색/폰트)을 직접 기술하기 위한 용도로 사용되어서는 안 된다(MUST NOT).
* `spec`은 “패턴 성립에 필요한 최소 파라미터” 제공을 목적으로 한다(MUST).

### 7.5.5 상속

* `spec`은 상속되지 않는다(MUST NOT).

> 친절한 설명:
> spec을 상속/병합하기 시작하면 role마다 규칙이 달라져 코어가 복잡해진다. Part 1 코어에서는 금지한다.

---

## 8. Element 코어 정의 (Element Taxonomy)

IDDL은 다음 6 Element만으로 UI leaf를 표현한다.

### 8.1 Text

* Role: `Title | Heading | Body | Label | Caption`
* Props(Part 1 코어): `content?: string`, `align?`, `icon?`

### 8.2 Image

* Props: `src: string`, `alt: string`
* Option: `aspectRatio?`, `fit?`

### 8.3 Video

* Props: `src: string`
* Option: `poster?`, `autoplay?`, `loop?`, `controls?`

### 8.4 Field

* Props: `label: string`, `model: string`, `type: FieldType`, `required?`, `disabled?`
* Note: `model`은 “입력 위치”를 나타내지만, 읽기/쓰기 바인딩 표준은 Part 2에서 정의한다.

### 8.5 Action

* Props: `label: string`, `icon?`, `behavior?`
* behavior 종류는 구조만 확정하며 실행/권한은 Part 2 범위이다.

### 8.6 Separator

* Props: `type?`, `size?`, `orientation?`, `content?`
* 목적: 논리적 구분 및 레이아웃 평탄화

---

## 9. Renderer 자율성과 의도 보존 (Normative)

### 9.1 변형 허용 (Autonomy)

Renderer는 다음을 수행할 수 있다(MAY).

* role/spec를 자사 디자인 시스템의 패턴으로 변환(컴포넌트 형태 변경 포함)
* 레이아웃/와이어프레임 수준의 재구성
* 브랜드별 minimal 스타일, 컴포넌트 스타일 변형

### 9.2 보존 의무 (Preservation)

Renderer는 다음 축의 의미 효과를 훼손해서는 안 된다(MUST NOT).

* `Intent`
* `Prominence`
* `Density`

### 9.3 기능 의미 보존 (Functional Meaning)

Renderer는 다음 기능 의미를 변경해서는 안 된다(MUST NOT).

* Action의 `behavior.type`이 의미하는 행동 종류
* Field가 나타내는 입력 컨트롤의 의미(타입/required/disabled 등)

---

## 10. 기본 매핑 제공 (Developer-Friendly Core)

Part 1의 목표에는 “디자인 없이도 개발이 진행 가능한 최소 UI”가 포함된다. 이를 위해:

* Renderer는 각 Role에 대해 합리적인 기본 매핑(패턴/기본 레이아웃)을 제공해야 한다(SHOULD).

> 친절한 설명:
> 이 규정은 “IDDL 문서만 받아도 기본 화면이 나온다”는 최소 개발자 경험을 보장한다.
> 단, 어떤 모양이 ‘기본’인지의 상세는 Renderer 정책이다.

---

## 11. Normative TSX Interfaces (Part 1)

```ts
// --- Axes ---
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
export type Prominence = 'Hero' | 'Standard' | 'Subtle' | 'Hidden';
export type Density = 'Standard' | 'Comportable' | 'Compact';

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
  align?: 'left' | 'center' | 'right';
  icon?: string;
}

export interface ImageProps extends BaseProps {
  src: string;
  alt: string;
  aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3';
  fit?: 'cover' | 'contain';
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
  size?: 'small' | 'medium' | 'large';
  orientation?: 'horizontal' | 'vertical';
  content?: string;
}
```

---

## 12. 예시 (Informative)

> 데이터 바인딩은 Part 2에서 정의하므로, 본 예시는 리터럴 중심으로 작성한다.

```tsx
<Page title="프로필 수정">
  <Section role="Header">
    <Block role="Toolbar" density="Standard">
      <Text role="Title" content="설정" />
      <Action label="닫기" behavior={{ type: 'navigate', to: '/home' }} prominence="Subtle" />
    </Block>
  </Section>

  <Section role="Main" density="Comportable">
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

---

## 13. 비고 (Non-Normative Notes)

* Part 1은 “UI 의도/구조 언어”로서 코어를 고정한다.
* Part 2는 “실행/데이터/상태”의 표준화를 다룬다.
* 이 분리는 렌더러 자율성을 해치지 않으면서 개발자 친화성을 확보하기 위한 의도적 선택이다.

---

원하시면 다음 단계로, 이 Part 1 문서에 대해 **Validator 에러 코드 목록(예: HIERARCHY_VIOLATION, MISSING_ROLE 등)** 과 “비적합 예시(잘못된 트리)”까지 포함한 **구현자 친화 부록**을 추가해 드리겠습니다.

#iddl