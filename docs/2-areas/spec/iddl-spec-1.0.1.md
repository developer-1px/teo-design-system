# Intent-Driven UI DSL Specification (IDDL)

**Version:** 1.0.1  
**Date:** 2025-01-08  
**Author:** Teo & Claude  
**Status:** Working Draft  

---

## 0. Motivation: Why IDDL Exists

### 0.1. The Problem

현대 UI 개발의 근본적 비효율은 **"의도의 손실(Intent Loss)"**에서 비롯된다.

```
[Designer's Intent] → [Figma] → [Developer's Interpretation] → [Code] → [Runtime UI]
         ↓                              ↓
    "이건 위험한 액션이야"         "빨간 버튼으로 해야겠다"
    "이건 핵심 정보야"            "font-weight: bold 해야지"
```

각 변환 단계에서 **왜(Why)**는 사라지고 **어떻게(How)**만 남는다. 결과적으로:

- 디자인 시스템은 `Button variant="danger"`처럼 **구현 지시**가 된다
- 새로운 맥락에서 "danger가 맞나? destructive가 맞나?" 매번 고민한다
- AI에게 UI 생성을 요청하면 **스타일 추측**을 시작한다

### 0.2. The Solution

IDDL은 **의도(Intent)**와 **데이터 구조(Structure)**만 선언한다. 렌더러가 맥락에 맞게 해석한다.

```
[Data + Intent] → [IDDL Schema] → [Design System Renderer] → [UI]
                        ↓
              "이 액션은 파괴적이다"
              "이 정보는 최상위 강조다"
              → 렌더러가 브랜드/플랫폼에 맞게 해석
```

### 0.3. Design Principles

| Principle | Description |
|-----------|-------------|
| **Intent over Implementation** | `intent: 'Danger'`라고 선언하지, `color: 'red'`라고 지시하지 않는다 |
| **Structure over Style** | 계층과 관계를 정의하지, 레이아웃 픽셀을 지정하지 않는다 |
| **Data-Driven** | UI는 데이터의 시각적 투영이다. 데이터 스키마가 UI 구조를 결정한다 |
| **Renderer Autonomy** | 동일한 IDDL이 Web/Mobile/CLI에서 각각 적합하게 렌더링될 수 있다 |
| **LLM-Friendly** | 사람과 AI 모두 읽고 생성할 수 있는 명확한 어휘 체계 |

### 0.4. What IDDL is NOT

- ❌ 디자인 시스템이 아니다 (디자인 시스템의 **입력**이다)
- ❌ 컴포넌트 라이브러리가 아니다 (컴포넌트로 **변환**되는 것이다)
- ❌ 스타일 가이드가 아니다 (스타일은 렌더러가 결정한다)
- ❌ 특정 프레임워크에 종속되지 않는다

---

## 1. Abstract

Intent-Driven UI DSL(IDDL)은 UI의 시각적 구현(Implementation)이 아닌 **설계 의도(Design Intent)**와 **데이터 구조(Data Structure)**를 정의하기 위한 선언형 언어(Declarative Language)이다.

이 명세는 스타일링(CSS)과 구체적인 컴포넌트 라이브러리로부터 독립적이며, **구조(Structure)**, **위계(Hierarchy)**, **역할(Role)**, **의도(Intent)**의 4가지 핵심 축을 통해 UI를 기술한다.

**Target Audience:**
- LLM이 데이터 스키마로부터 적절한 UI를 생성할 때
- 디자인 시스템 렌더러가 플랫폼별 구현을 생성할 때
- 개발자가 UI 요구사항을 구현 독립적으로 명세할 때

---

## 2. Core Concepts (Design Tokens)

IDDL의 모든 노드는 다음 4가지 핵심 속성(Properties)을 통해 디자인 시스템에 렌더링 지침을 전달한다.

### 2.1. Prominence (주목도)

UI 요소의 시각적 강조 수준(Visual Weight)을 정의한다.

| Value | Intent | Typical Rendering |
|-------|--------|-------------------|
| `Hero` | 페이지의 핵심. 즉시 눈에 들어와야 함 | 가장 큰 크기, 배경색 채움, 풀 블리드 |
| `Primary` | 주요 컨텐츠/액션. 자연스럽게 주목됨 | 표준 강조, Solid 스타일 |
| `Secondary` | 보조 정보/액션. 필요시 발견됨 | 약한 강조, Outline/Subtle 스타일 |
| `Tertiary` | 부가 정보. 배경에 녹아듦 | 최소 강조, Ghost/Link 스타일 |

**Prominence는 순서(Order)가 아니다.** Hero가 항상 먼저 오는 게 아니라, 어디에 있든 가장 강하게 보인다는 뜻이다.

**맥락별 해석 예시:**

| Node Type | Hero | Primary | Secondary | Tertiary |
|-----------|------|---------|-----------|----------|
| Text/Title | Display size | Heading | Subheading | Caption |
| Action | Full-width CTA | Solid button | Outline button | Text link |
| Field | Hero input | Standard input | Compact input | Inline edit |
| Group | Card with shadow | Bordered card | Subtle border | No border |

### 2.2. Intent (의도)

UI 요소가 전달하고자 하는 **의미론적 목적(Semantic Purpose)**을 정의한다.

| Value | Meaning | Use Cases |
|-------|---------|-----------|
| `Neutral` | 일반 정보, 기본 상태 | 대부분의 컨텐츠, 네비게이션 |
| `Brand` | 브랜드 강조, 핵심 액션 | Primary CTA, 주요 링크 |
| `Positive` | 성공, 완료, 긍정적 상태 | 저장 완료, 활성 상태, 수익 |
| `Caution` | 주의, 경고, 대기 상태 | 검토 필요, pending, 주의사항 |
| `Critical` | 위험, 에러, 파괴적 액션 | 삭제, 에러, 손실, 만료 |
| `Info` | 참고 정보, 도움말 | 툴팁, 안내 메시지 |

> **Note:** `Success/Warning/Danger` 대신 `Positive/Caution/Critical`로 변경. "Danger button"처럼 구현 용어가 아닌 의미 중심 용어 사용.

### 2.3. Density (밀도)

정보 소비 패턴과 공간 활용을 정의한다. 주로 컨테이너에 적용되어 자식 요소에 전파된다.

| Value | Use Case | Characteristics |
|-------|----------|-----------------|
| `Comfortable` | 마케팅, 온보딩, 개요 | 넓은 여백, 큰 타이포, 여유로운 터치 영역 |
| `Standard` | 일반 폼, 문서, 설정 | 표준 간격, 읽기 편한 밀도 |
| `Compact` | 데이터 테이블, 전문가 도구 | 좁은 간격, 정보 밀도 최대화 |

### 2.4. Role (역할)

컴포넌트의 **기능적 정체성(Functional Identity)**을 정의한다. 각 노드 타입마다 허용되는 Role이 제한된다. (Section 5 참조)

---

## 3. Defaults & Inheritance

### 3.1. Default Values

모든 속성의 기본값을 명시한다. 생략 시 이 값이 적용된다.

| Property | Default | Scope |
|----------|---------|-------|
| `prominence` | `'Primary'` | All nodes |
| `intent` | `'Neutral'` | All nodes |
| `density` | `'Standard'` | Containers |
| `mode` | `'view'` | Section |
| `align` | `'left'` | Text |
| `placement` | `'center'` | Overlay |
| `required` | `false` | Field |
| `disabled` | `false` | Action |
| `hidden` | `false` | All nodes |

### 3.2. Inheritance Rules

일부 속성은 부모에서 자식으로 전파된다.

| Property | Inheritance |
|----------|-------------|
| `density` | Section → Group → Children (override 가능) |
| `mode` | Section → 모든 하위 Field (Field별 override 가능) |
| `intent` | 전파되지 않음 (각 노드가 명시) |
| `prominence` | 전파되지 않음 |

```json
{
  "type": "Section",
  "mode": "edit",
  "density": "Compact",
  "children": [
    {
      "type": "Group",
      "density": "Standard",  // Override
      "children": [
        { "type": "Field", "model": "name" }  // mode: edit, density: Standard
      ]
    }
  ]
}
```

---

## 4. Data Model & Hierarchy

문서의 구조는 `Page`를 루트(Root)로 하는 트리(Tree) 구조를 가진다.

```
Page (Root)
├── Section (Layout Layer - Ground)
│   └── Group (Container - Recursive)
│       ├── Text (Static Content)
│       ├── Field (Dynamic Data)
│       ├── Action (Trigger)
│       └── Group (Nested)
└── Overlay (Interaction Layer - Air)
    └── Group ...
```

### 4.1. Primitives (Leaf Nodes)

#### 4.1.1. Text Node

**"데이터 바인딩이 없는 순수한 정적 콘텐츠"**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | `'Text'` | ✓ | 노드 타입 식별자 |
| `role` | `'Title' \| 'Body' \| 'Label' \| 'Code' \| 'Caption'` | ✓ | 텍스트 기능 |
| `content` | `string` | ✓ | 텍스트 내용 |
| `align` | `'left' \| 'center' \| 'right'` | | 정렬 (default: left) |

#### 4.1.2. Field Node

**"조회와 편집이 가능한 데이터 객체"**

부모 컨텍스트의 `mode`에 따라 **읽기 전용 텍스트(view)** 또는 **입력 컨트롤(edit)**로 렌더링된다.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | `'Field'` | ✓ | 노드 타입 식별자 |
| `label` | `string` | ✓ | 필드 라벨 |
| `model` | `string` | ✓ | 데이터 바인딩 경로 (ex: `user.email`) |
| `dataType` | `DataType` | ✓ | 데이터 유형 (아래 참조) |
| `required` | `boolean` | | 필수 여부 (default: false) |
| `placeholder` | `string` | | 빈 값일 때 힌트 텍스트 |
| `options` | `Option[]` | | select/radio/checkbox용 선택지 |
| `constraints` | `Constraints` | | 유효성 검사 규칙 |
| `dependsOn` | `string` | | 의존하는 다른 필드의 model |
| `modeOverride` | `'view' \| 'edit'` | | 부모 mode 무시하고 강제 지정 |
| `clearable` | `boolean` | | 입력 내용 지우기 버튼 표시 (v1.0.2, text 계열만) |

**DataType Values:**

| Value | View Mode | Edit Mode |
|-------|-----------|-----------|
| `text` | Plain text | Text input |
| `number` | Formatted number | Number input |
| `currency` | Currency format | Currency input |
| `date` | Formatted date | Date picker |
| `datetime` | Formatted datetime | Datetime picker |
| `boolean` | Yes/No badge | Toggle/Checkbox |
| `select` | Selected label | Dropdown |
| `multiselect` | Tag list | Multi-select |
| `radio` | Selected label | Radio group |
| `checkbox` | Checked items | Checkbox group |
| `textarea` | Multiline text | Textarea |
| `richtext` | Rendered HTML | Rich text editor |
| `image` | Image preview | Image uploader |
| `file` | File info | File uploader |
| `password` | Masked | Password input |
| `email` | Email link | Email input |
| `url` | Clickable link | URL input |
| `phone` | Phone link | Phone input |
| `color` | Color swatch | Color picker |
| `rating` | Star display | Star input |
| `range` | Value display | Slider |

**Constraints Object:**

```typescript
interface Constraints {
  min?: number;           // number, date, range
  max?: number;           // number, date, range
  minLength?: number;     // text, textarea
  maxLength?: number;     // text, textarea
  pattern?: string;       // regex pattern
  patternMessage?: string; // pattern 실패 시 메시지
  custom?: string;        // 커스텀 validator 함수명
}
```

#### 4.1.3. Action Node

**"시스템에 변화를 주는 명령 트리거"**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | `'Action'` | ✓ | 노드 타입 식별자 |
| `label` | `string` | | 버튼 텍스트 |
| `icon` | `string` | | 아이콘 식별자 |
| `behavior` | `ActionBehavior` | ✓ | 동작 정의 (아래 참조) |
| `disabled` | `boolean \| string` | | 비활성 조건 (boolean 또는 표현식) |
| `confirm` | `string` | | 실행 전 확인 메시지 |
| `loading` | `boolean` | | 로딩 상태 |

**ActionBehavior (Discriminated Union):**

```typescript
type ActionBehavior = 
  | { action: 'command'; command: string; args?: Record<string, any> }
  | { action: 'navigate'; to: string; target?: '_blank' | '_self' }
  | { action: 'submit'; form?: string }
  | { action: 'reset'; form?: string }
  | { action: 'open'; overlay: string }
  | { action: 'close'; overlay?: string }
  | { action: 'toggle'; target: string };
```

### 4.2. Containers (Branch Nodes)

#### 4.2.1. Group Node

**"논리적 묶음 단위"**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | `'Group'` | ✓ | 노드 타입 식별자 |
| `role` | `GroupRole` | ✓ | 기능적 역할 |
| `children` | `Node[]` | ✓ | 자식 노드 배열 |
| `value` | `string \| number` | | **선택 가능한 아이템의 고유 식별자** (v1.0.2)<br/>value가 있으면 Group은 선택 가능한 항목(Selectable Item)이 되며,<br/>hover, focus, selected 상태가 자동으로 관리됩니다.<br/>**멘탈 모델:** HTML의 `<option value="1">`과 동일 |
| `density` | `Density` | | 내부 간격 |
| `layout` | `Layout` | | 배치 방향 (role에 따라 기본값 다름) |
| `state` | `LoadState` | | 데이터 로딩 상태 |
| `emptyContent` | `TextNode` | | 비어있을 때 표시할 내용 |
| `errorContent` | `TextNode` | | 에러 시 표시할 내용 |

**GroupRole Values:**

| Value | Purpose | Default Layout |
|-------|---------|----------------|
| `Container` | 일반 박스 | `stack` |
| `Form` | 입력 필드 집합 (validation context) | `stack` |
| `Fieldset` | 폼 내 필드 그룹 | `stack` |
| `Toolbar` | 액션 버튼 집합 | `inline` |
| `List` | 단일 컬럼 데이터 목록 | `stack` |
| `Grid` | 다중 컬럼 데이터 그리드 | `grid` |
| `Table` | 테이블 형식 데이터 | `table` |
| `Tabs` | 탭 네비게이션 | `tabs` |
| `Steps` | 단계별 진행 | `steps` |
| `Split` | 좌우/상하 분할 | `split` |
| `Card` | 카드형 컨테이너 | `stack` |
| `Inline` | 인라인 요소 그룹 | `inline` |

**Layout Values:**

| Value | Description |
|-------|-------------|
| `stack` | 수직 쌓기 |
| `inline` | 수평 나열 (wrap) |
| `grid` | CSS Grid (자동 컬럼) |
| `table` | 테이블 레이아웃 |
| `split` | 분할 패널 |
| `tabs` | 탭 컨텐츠 전환 |
| `steps` | 스텝 네비게이션 |

**LoadState Values:**

| Value | Description |
|-------|-------------|
| `idle` | 기본 상태 |
| `loading` | 데이터 로딩 중 |
| `error` | 에러 발생 |
| `empty` | 데이터 없음 |

#### 4.2.2. Section Node

**"페이지 내 독립적 영역"**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | `'Section'` | ✓ | 노드 타입 식별자 |
| `role` | `SectionRole` | ✓ | 배치 역할 |
| `children` | `Group[]` | ✓ | 자식 그룹 배열 |
| `mode` | `'view' \| 'edit'` | | 읽기/편집 모드 (자식에 전파) |
| `density` | `Density` | | 밀도 (자식에 전파) |

**SectionRole Values:**

| Value | Description |
|-------|-------------|
| `Container` | 메인 컨텐츠 영역 |
| `Header` | 페이지 상단 고정 |
| `Footer` | 페이지 하단 고정 |
| `Navigator` | 사이드바, 탭바 등 네비게이션 |
| `Aside` | 보조 정보 사이드 패널 |

#### 4.2.3. Overlay Node

**"페이지 위에 부유하는 레이어"**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | `'Overlay'` | ✓ | 노드 타입 식별자 |
| `id` | `string` | ✓ | 참조용 고유 식별자 |
| `role` | `OverlayRole` | ✓ | 오버레이 유형 |
| `children` | `Group[]` | ✓ | 내부 컨텐츠 |
| `placement` | `Placement` | | 위치 |
| `isOpen` | `boolean` | | 표시 상태 |
| `dismissable` | `boolean` | | 외부 클릭으로 닫기 가능 여부 |

**OverlayRole Values:**

| Value | Description | Default Placement |
|-------|-------------|-------------------|
| `Dialog` | 중앙 모달 (dimmed) | `center` |
| `Drawer` | 사이드 패널 | `right` |
| `Popover` | 요소 근처 팝업 | `bottom` |
| `Toast` | 일시적 알림 | `top-right` |
| `Tooltip` | 마우스오버 힌트 | `top` |
| `Sheet` | 모바일 하단 시트 | `bottom` |
| `Lightbox` | 이미지/미디어 뷰어 | `center` |
| `Floating` | 지속적 인터랙티브 오버레이 (v1.0.2) | `bottom` |

**Placement Values:**
`center`, `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, `bottom-right`

### 4.3. Root Node

#### 4.3.1. Page Node

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | `'Page'` | ✓ | 루트 노드 식별자 |
| `title` | `string` | ✓ | 페이지 제목 |
| `description` | `string` | | 페이지 설명 |
| `layout` | `PageLayout` | | 전체 레이아웃 템플릿 |
| `breadcrumbs` | `Breadcrumb[]` | | 경로 네비게이션 |
| `children` | `(Section \| Overlay)[]` | ✓ | 페이지 구성 요소 |

**PageLayout Values:**

| Value | Description |
|-------|-------------|
| `single` | 단일 컬럼 |
| `sidebar` | 사이드바 + 메인 |
| `dashboard` | 그리드 대시보드 |
| `split` | 좌우 분할 |
| `wizard` | 스텝 마법사 |

---

## 5. Taxonomy (Role Definitions)

각 노드 타입별 허용 가능한 `role` 값 정의.

| Node Type | Role | Description |
|-----------|------|-------------|
| **Page** | (implicit) | 페이지는 role이 없음 |
| **Section** | `Container` | 메인 컨텐츠 영역 |
| | `Header` | 상단 고정 영역 |
| | `Footer` | 하단 고정 영역 |
| | `Navigator` | 네비게이션 영역 |
| | `Aside` | 보조 사이드 패널 |
| **Overlay** | `Dialog` | 중앙 모달 |
| | `Drawer` | 사이드 패널 |
| | `Popover` | 요소 근처 팝업 |
| | `Toast` | 일시적 알림 |
| | `Tooltip` | 힌트 팝업 |
| | `Sheet` | 하단 시트 |
| | `Lightbox` | 미디어 뷰어 |
| **Group** | `Container` | 일반 컨테이너 |
| | `Form` | 폼 컨텍스트 |
| | `Fieldset` | 폼 내 필드 그룹 |
| | `Toolbar` | 액션 버튼 집합 |
| | `List` | 단일 컬럼 목록 |
| | `Grid` | 다중 컬럼 그리드 |
| | `Table` | 테이블 |
| | `Tabs` | 탭 컨테이너 |
| | `Steps` | 스텝 진행 |
| | `Split` | 분할 패널 |
| | `Card` | 카드 컨테이너 |
| | `Inline` | 인라인 그룹 |
| **Text** | `Title` | 제목 |
| | `Body` | 본문 |
| | `Label` | 라벨 |
| | `Caption` | 캡션/부연 |
| | `Code` | 코드 텍스트 |
| **Field** | (by dataType) | Field는 dataType으로 구분 |
| **Action** | (by prominence/intent) | Action은 prominence/intent로 구분 |

---

## 6. Conditional Rendering

### 6.1. Condition Expression

모든 노드는 `condition` 속성으로 조건부 렌더링을 지정할 수 있다.

```typescript
interface BaseNode {
  // ...
  condition?: string;  // 표현식 (truthy면 렌더링)
}
```

**표현식 문법:**

```
// 단순 모델 참조 (truthy 체크)
"user.isAdmin"

// 비교 연산
"user.role === 'admin'"
"cart.items.length > 0"
"status !== 'deleted'"

// 논리 연산
"user.isAdmin && feature.enabled"
"status === 'draft' || status === 'pending'"

// 메서드 호출 (렌더러가 지원하는 경우)
"hasPermission('edit')"
```

**예시:**

```json
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    {
      "type": "Action",
      "label": "Delete",
      "intent": "Critical",
      "condition": "user.role === 'admin'",
      "behavior": { "action": "command", "command": "delete" }
    },
    {
      "type": "Action",
      "label": "Archive",
      "condition": "status !== 'archived'",
      "behavior": { "action": "command", "command": "archive" }
    }
  ]
}
```

---

## 6.5. Selection Model (v1.0.2)

**"선택 가능한 아이템 집합 관리"**

Group이 선택 가능한 항목들을 관리할 때 사용하는 모델입니다.

### 6.5.1. 개념

**핵심 원칙:** "선택 가능한 모든 것은 value를 가진다"

- Group에 `value` prop이 있으면 → 선택 가능한 항목(Selectable Item)
- 부모 Group에 `selectionModel`을 전달하면 → 자식들의 선택 상태를 관리
- **멘탈 모델:** HTML의 `<select>` 안의 `<option value="1">`과 동일

### 6.5.2. Selection Model 인터페이스

```typescript
interface SelectionModel {
  // 현재 선택된 값들의 집합
  selectedValues: Set<string | number>;

  // 특정 값이 선택되었는지 확인
  isSelected: (value: string | number) => boolean;

  // 선택 조작 (optional)
  select?: (value: string | number) => void;
  deselect?: (value: string | number) => void;
  toggle?: (value: string | number) => void;

  // 아이템 클릭 핸들러 (modifier keys 자동 처리)
  handleItemClick?: (value: string | number, event: React.MouseEvent) => void;
}
```

### 6.5.3. 자동 처리되는 기능

Group에 `value`가 있고 부모에 `selectionModel`이 있으면 다음이 자동으로 처리됩니다:

1. **Interactive States**: hover, focus, selected 스타일
2. **ARIA Attributes**: `role="option"`, `aria-selected`, `tabIndex`
3. **Event Handlers**: onClick (modifier keys 지원)
4. **Keyboard Navigation**: 방향키, 엔터, 스페이스

### 6.5.4. 사용 예시

```tsx
// 1. Selection Model 생성 (useSelection hook)
const selection = useSelection({
  items: slides,
  getId: (slide) => slide.id,
  onCopy: handleCopy,
  onCut: handleCut,
  onDelete: handleDelete,
});

// 2. 부모 Group에 selectionModel 전달
<Group role="List" selectionModel={selection}>
  {slides.map((slide) => (
    // 3. 자식 Group에 value 지정 (선택 가능해짐)
    <Group key={slide.id} role="Card" value={slide.id}>
      <SlidePreview slide={slide} />
    </Group>
  ))}
</Group>
```

**결과:**
- 클릭: 단일 선택
- Cmd/Ctrl + 클릭: 멀티 선택 (토글)
- Shift + 클릭: 범위 선택
- Cmd+C: 복사
- Cmd+X: 잘라내기
- Delete: 삭제
- Cmd+A: 전체 선택
- ESC: 선택 해제

모두 자동으로 처리됩니다.

---

## 7. TypeScript Interface Definition (Normative)

```typescript
/**
 * IDDL (Intent-Driven UI DSL) Schema v1.0.1
 */

// ============================================
// Design Tokens
// ============================================

export type Prominence = 'Hero' | 'Standard' | 'Strong' | 'Subtle';
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
export type Density = 'Comfortable' | 'Standard' | 'Compact';

// ============================================
// Base
// ============================================

interface BaseNode {
  id?: string;
  prominence?: Prominence;
  intent?: Intent;
  hidden?: boolean;
  condition?: string;
}

// ============================================
// Primitives (Leaf Nodes)
// ============================================

export interface TextNode extends BaseNode {
  type: 'Text';
  role: 'Title' | 'Body' | 'Label' | 'Caption' | 'Code';
  content: string;
  align?: 'left' | 'center' | 'right';
}

export type DataType =
  | 'text' | 'number' | 'currency' | 'date' | 'datetime' | 'boolean'
  | 'select' | 'multiselect' | 'radio' | 'checkbox'
  | 'textarea' | 'richtext'
  | 'image' | 'file'
  | 'password' | 'email' | 'url' | 'phone'
  | 'color' | 'rating' | 'range';

export interface FieldConstraints {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  custom?: string;
}

export interface FieldOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  icon?: string;
}

export interface FieldNode extends BaseNode {
  type: 'Field';
  label: string;
  model: string;
  dataType: DataType;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
  constraints?: FieldConstraints;
  dependsOn?: string;
  modeOverride?: 'view' | 'edit';
}

export type ActionBehavior =
  | { action: 'command'; command: string; args?: Record<string, unknown> }
  | { action: 'navigate'; to: string; target?: '_blank' | '_self' }
  | { action: 'submit'; form?: string }
  | { action: 'reset'; form?: string }
  | { action: 'open'; overlay: string }
  | { action: 'close'; overlay?: string }
  | { action: 'toggle'; target: string };

export interface ActionNode extends BaseNode {
  type: 'Action';
  label?: string;
  icon?: string;
  behavior: ActionBehavior;
  disabled?: boolean | string;
  confirm?: string;
  loading?: boolean;
}

// ============================================
// Containers (Branch Nodes)
// ============================================

export type GroupRole =
  | 'Container' | 'Form' | 'Fieldset' | 'Toolbar'
  | 'List' | 'Grid' | 'Table'
  | 'Tabs' | 'Steps' | 'Split'
  | 'Card' | 'Inline';

export type Layout = 'stack' | 'inline' | 'grid' | 'table' | 'split' | 'tabs' | 'steps';
export type LoadState = 'idle' | 'loading' | 'error' | 'empty';

export interface GroupNode extends BaseNode {
  type: 'Group';
  role: GroupRole;
  children: Array<GroupNode | TextNode | FieldNode | ActionNode>;
  density?: Density;
  layout?: Layout;
  state?: LoadState;
  emptyContent?: TextNode;
  errorContent?: TextNode;
}

export type SectionRole = 'Container' | 'Header' | 'Footer' | 'Navigator' | 'Aside';

export interface SectionNode extends BaseNode {
  type: 'Section';
  role: SectionRole;
  children: GroupNode[];
  mode?: 'view' | 'edit';
  density?: Density;
}

export type OverlayRole = 'Dialog' | 'Drawer' | 'Popover' | 'Toast' | 'Tooltip' | 'Sheet' | 'Lightbox' | 'Floating';
export type Placement = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface OverlayNode extends BaseNode {
  type: 'Overlay';
  id: string;
  role: OverlayRole;
  children: GroupNode[];
  placement?: Placement;
  isOpen?: boolean;
  dismissable?: boolean;
}

// ============================================
// Root
// ============================================

export type PageLayout = 'single' | 'sidebar' | 'dashboard' | 'split' | 'wizard';

export interface Breadcrumb {
  label: string;
  to?: string;
}

export interface PageSchema {
  type: 'Page';
  title: string;
  description?: string;
  layout?: PageLayout;
  breadcrumbs?: Breadcrumb[];
  children: Array<SectionNode | OverlayNode>;
}

// ============================================
// Union Types
// ============================================

export type LeafNode = TextNode | FieldNode | ActionNode;
export type ContainerNode = GroupNode | SectionNode | OverlayNode;
export type AnyNode = LeafNode | ContainerNode | PageSchema;
```

---

## 8. Example Scenarios

### 8.1. User Profile (View/Edit)

```json
{
  "type": "Page",
  "title": "User Profile",
  "layout": "single",
  "breadcrumbs": [
    { "label": "Users", "to": "/users" },
    { "label": "John Doe" }
  ],
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "view",
      "children": [
        {
          "type": "Group",
          "role": "Card",
          "children": [
            { "type": "Text", "role": "Title", "content": "Basic Information", "prominence": "Primary" },
            {
              "type": "Group",
              "role": "Fieldset",
              "density": "Standard",
              "children": [
                { "type": "Field", "label": "Name", "model": "user.name", "dataType": "text" },
                { "type": "Field", "label": "Email", "model": "user.email", "dataType": "email" },
                { "type": "Field", "label": "Role", "model": "user.role", "dataType": "select", "options": [
                  { "label": "Admin", "value": "admin" },
                  { "label": "Editor", "value": "editor" },
                  { "label": "Viewer", "value": "viewer" }
                ]},
                { "type": "Field", "label": "Avatar", "model": "user.avatar", "dataType": "image" }
              ]
            },
            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                {
                  "type": "Action",
                  "label": "Edit",
                  "icon": "edit",
                  "prominence": "Primary",
                  "intent": "Brand",
                  "behavior": { "action": "open", "overlay": "edit-modal" }
                },
                {
                  "type": "Action",
                  "label": "Delete",
                  "icon": "trash",
                  "prominence": "Secondary",
                  "intent": "Critical",
                  "condition": "currentUser.role === 'admin'",
                  "confirm": "Are you sure you want to delete this user?",
                  "behavior": { "action": "command", "command": "user.delete", "args": { "id": "{{user.id}}" } }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "Overlay",
      "id": "edit-modal",
      "role": "Dialog",
      "placement": "center",
      "dismissable": true,
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            { "type": "Text", "role": "Title", "content": "Edit Profile" },
            { "type": "Field", "label": "Name", "model": "user.name", "dataType": "text", "required": true,
              "constraints": { "minLength": 2, "maxLength": 50 }
            },
            { "type": "Field", "label": "Email", "model": "user.email", "dataType": "email", "required": true },
            { "type": "Field", "label": "Role", "model": "user.role", "dataType": "select", "options": [
              { "label": "Admin", "value": "admin" },
              { "label": "Editor", "value": "editor" },
              { "label": "Viewer", "value": "viewer" }
            ]},
            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                { "type": "Action", "label": "Cancel", "prominence": "Secondary", "behavior": { "action": "close" } },
                { "type": "Action", "label": "Save", "intent": "Brand", "behavior": { "action": "submit" } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 8.2. Data Table with Filters

```json
{
  "type": "Page",
  "title": "Orders",
  "layout": "single",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "children": [
        {
          "type": "Group",
          "role": "Container",
          "children": [
            { "type": "Text", "role": "Title", "content": "Order Management", "prominence": "Hero" },
            {
              "type": "Group",
              "role": "Toolbar",
              "layout": "inline",
              "children": [
                { "type": "Field", "label": "Search", "model": "filters.search", "dataType": "text", "placeholder": "Order ID or customer..." },
                { "type": "Field", "label": "Status", "model": "filters.status", "dataType": "select", "options": [
                  { "label": "All", "value": "" },
                  { "label": "Pending", "value": "pending" },
                  { "label": "Shipped", "value": "shipped" },
                  { "label": "Delivered", "value": "delivered" }
                ]},
                { "type": "Field", "label": "Date Range", "model": "filters.dateRange", "dataType": "date" },
                {
                  "type": "Action",
                  "label": "Export",
                  "icon": "download",
                  "prominence": "Secondary",
                  "behavior": { "action": "command", "command": "orders.export" }
                },
                {
                  "type": "Action",
                  "label": "New Order",
                  "icon": "plus",
                  "intent": "Brand",
                  "behavior": { "action": "navigate", "to": "/orders/new" }
                }
              ]
            }
          ]
        },
        {
          "type": "Group",
          "role": "Table",
          "density": "Compact",
          "state": "idle",
          "emptyContent": { "type": "Text", "role": "Body", "content": "No orders found", "align": "center" },
          "children": [
            { "type": "Field", "label": "Order ID", "model": "item.id", "dataType": "text" },
            { "type": "Field", "label": "Customer", "model": "item.customer.name", "dataType": "text" },
            { "type": "Field", "label": "Total", "model": "item.total", "dataType": "currency" },
            { "type": "Field", "label": "Status", "model": "item.status", "dataType": "select", "options": [
              { "label": "Pending", "value": "pending" },
              { "label": "Shipped", "value": "shipped" },
              { "label": "Delivered", "value": "delivered" }
            ]},
            { "type": "Field", "label": "Date", "model": "item.createdAt", "dataType": "date" },
            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                { "type": "Action", "icon": "eye", "prominence": "Tertiary", "behavior": { "action": "navigate", "to": "/orders/{{item.id}}" } },
                { "type": "Action", "icon": "edit", "prominence": "Tertiary", "behavior": { "action": "navigate", "to": "/orders/{{item.id}}/edit" } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 8.3. Dashboard

```json
{
  "type": "Page",
  "title": "Dashboard",
  "layout": "dashboard",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "density": "Comfortable",
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
                { "type": "Text", "role": "Label", "content": "Revenue" },
                { "type": "Field", "label": "", "model": "stats.revenue", "dataType": "currency", "prominence": "Hero" },
                { "type": "Text", "role": "Caption", "content": "+12.5% from last month", "intent": "Positive" }
              ]
            },
            {
              "type": "Group",
              "role": "Card",
              "children": [
                { "type": "Text", "role": "Label", "content": "Orders" },
                { "type": "Field", "label": "", "model": "stats.orders", "dataType": "number", "prominence": "Hero" },
                { "type": "Text", "role": "Caption", "content": "+5.2% from last month", "intent": "Positive" }
              ]
            },
            {
              "type": "Group",
              "role": "Card",
              "intent": "Caution",
              "children": [
                { "type": "Text", "role": "Label", "content": "Pending" },
                { "type": "Field", "label": "", "model": "stats.pending", "dataType": "number", "prominence": "Hero" },
                { "type": "Text", "role": "Caption", "content": "Needs attention", "intent": "Caution" }
              ]
            },
            {
              "type": "Group",
              "role": "Card",
              "children": [
                { "type": "Text", "role": "Label", "content": "Customers" },
                { "type": "Field", "label": "", "model": "stats.customers", "dataType": "number", "prominence": "Hero" },
                { "type": "Text", "role": "Caption", "content": "+23 this week" }
              ]
            }
          ]
        },
        {
          "type": "Group",
          "role": "Card",
          "children": [
            { "type": "Text", "role": "Title", "content": "Recent Orders" },
            {
              "type": "Group",
              "role": "List",
              "density": "Compact",
              "state": "idle",
              "children": [
                { "type": "Field", "label": "Order", "model": "item.id", "dataType": "text" },
                { "type": "Field", "label": "Customer", "model": "item.customer", "dataType": "text" },
                { "type": "Field", "label": "Amount", "model": "item.amount", "dataType": "currency" },
                { "type": "Field", "label": "Status", "model": "item.status", "dataType": "text" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 8.4. Settings with Tabs

```json
{
  "type": "Page",
  "title": "Settings",
  "layout": "single",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "edit",
      "children": [
        {
          "type": "Group",
          "role": "Tabs",
          "children": [
            {
              "type": "Group",
              "role": "Form",
              "id": "profile-tab",
              "children": [
                { "type": "Text", "role": "Title", "content": "Profile" },
                { "type": "Field", "label": "Display Name", "model": "settings.displayName", "dataType": "text", "required": true },
                { "type": "Field", "label": "Bio", "model": "settings.bio", "dataType": "textarea" },
                { "type": "Field", "label": "Avatar", "model": "settings.avatar", "dataType": "image" }
              ]
            },
            {
              "type": "Group",
              "role": "Form",
              "id": "notifications-tab",
              "children": [
                { "type": "Text", "role": "Title", "content": "Notifications" },
                { "type": "Field", "label": "Email Notifications", "model": "settings.emailNotifications", "dataType": "boolean" },
                { "type": "Field", "label": "Push Notifications", "model": "settings.pushNotifications", "dataType": "boolean" },
                { "type": "Field", "label": "Frequency", "model": "settings.frequency", "dataType": "radio", "options": [
                  { "label": "Real-time", "value": "realtime" },
                  { "label": "Daily Digest", "value": "daily" },
                  { "label": "Weekly Digest", "value": "weekly" }
                ]}
              ]
            },
            {
              "type": "Group",
              "role": "Form",
              "id": "security-tab",
              "children": [
                { "type": "Text", "role": "Title", "content": "Security" },
                { "type": "Field", "label": "Current Password", "model": "security.currentPassword", "dataType": "password" },
                { "type": "Field", "label": "New Password", "model": "security.newPassword", "dataType": "password",
                  "constraints": { "minLength": 8 }
                },
                { "type": "Field", "label": "Confirm Password", "model": "security.confirmPassword", "dataType": "password" },
                { "type": "Field", "label": "Two-Factor Auth", "model": "security.twoFactor", "dataType": "boolean" }
              ]
            }
          ]
        },
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { "type": "Action", "label": "Reset", "prominence": "Secondary", "behavior": { "action": "reset" } },
            { "type": "Action", "label": "Save Changes", "intent": "Brand", "behavior": { "action": "submit" } }
          ]
        }
      ]
    }
  ]
}
```

### 8.5. Multi-Step Wizard

```json
{
  "type": "Page",
  "title": "Create Campaign",
  "layout": "wizard",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "edit",
      "children": [
        {
          "type": "Group",
          "role": "Steps",
          "children": [
            {
              "type": "Group",
              "role": "Form",
              "id": "step-1",
              "children": [
                { "type": "Text", "role": "Title", "content": "Campaign Details" },
                { "type": "Text", "role": "Body", "content": "Enter the basic information for your campaign." },
                { "type": "Field", "label": "Campaign Name", "model": "campaign.name", "dataType": "text", "required": true },
                { "type": "Field", "label": "Description", "model": "campaign.description", "dataType": "textarea" },
                { "type": "Field", "label": "Type", "model": "campaign.type", "dataType": "radio", "options": [
                  { "label": "Email", "value": "email" },
                  { "label": "SMS", "value": "sms" },
                  { "label": "Push", "value": "push" }
                ]}
              ]
            },
            {
              "type": "Group",
              "role": "Form",
              "id": "step-2",
              "children": [
                { "type": "Text", "role": "Title", "content": "Audience" },
                { "type": "Text", "role": "Body", "content": "Select who will receive this campaign." },
                { "type": "Field", "label": "Segment", "model": "campaign.segment", "dataType": "select", "options": [
                  { "label": "All Users", "value": "all" },
                  { "label": "Active Users", "value": "active" },
                  { "label": "New Users", "value": "new" }
                ]},
                { "type": "Field", "label": "Exclude", "model": "campaign.exclude", "dataType": "multiselect", "options": [
                  { "label": "Unsubscribed", "value": "unsubscribed" },
                  { "label": "Bounced", "value": "bounced" }
                ]}
              ]
            },
            {
              "type": "Group",
              "role": "Form",
              "id": "step-3",
              "children": [
                { "type": "Text", "role": "Title", "content": "Schedule" },
                { "type": "Text", "role": "Body", "content": "When should this campaign be sent?" },
                { "type": "Field", "label": "Send Time", "model": "campaign.sendAt", "dataType": "datetime", "required": true },
                { "type": "Field", "label": "Timezone", "model": "campaign.timezone", "dataType": "select", "options": [
                  { "label": "UTC", "value": "UTC" },
                  { "label": "EST", "value": "America/New_York" },
                  { "label": "PST", "value": "America/Los_Angeles" }
                ]}
              ]
            },
            {
              "type": "Group",
              "role": "Container",
              "id": "step-4",
              "children": [
                { "type": "Text", "role": "Title", "content": "Review & Launch" },
                { "type": "Text", "role": "Body", "content": "Review your campaign settings before launching." },
                {
                  "type": "Group",
                  "role": "Card",
                  "density": "Compact",
                  "children": [
                    { "type": "Field", "label": "Name", "model": "campaign.name", "dataType": "text", "modeOverride": "view" },
                    { "type": "Field", "label": "Type", "model": "campaign.type", "dataType": "text", "modeOverride": "view" },
                    { "type": "Field", "label": "Audience", "model": "campaign.segment", "dataType": "text", "modeOverride": "view" },
                    { "type": "Field", "label": "Send At", "model": "campaign.sendAt", "dataType": "datetime", "modeOverride": "view" }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { "type": "Action", "label": "Back", "prominence": "Secondary", "behavior": { "action": "command", "command": "wizard.back" } },
            { "type": "Action", "label": "Next", "intent": "Brand", "condition": "!isLastStep", "behavior": { "action": "command", "command": "wizard.next" } },
            { "type": "Action", "label": "Launch Campaign", "intent": "Brand", "condition": "isLastStep", "behavior": { "action": "submit" } }
          ]
        }
      ]
    }
  ]
}
```

---

## 9. Changelog

### v1.0.1 (2025-01-08)

**Breaking Changes:**
- `Intent` 값 변경: `Success` → `Positive`, `Warning` → `Caution`, `Danger` → `Critical`
- `Action`의 `command`/`to` 속성이 `behavior` discriminated union으로 통합

**Additions:**
- Section 0: Motivation 추가 (Why IDDL Exists)
- Section 3: Defaults & Inheritance 추가
- Section 6: Conditional Rendering 추가
- `Text.role`: `Caption` 추가
- `Field.dataType`: `currency`, `datetime`, `multiselect`, `radio`, `checkbox`, `textarea`, `richtext`, `file`, `email`, `url`, `phone`, `color`, `rating`, `range` 추가
- `Field.constraints`: 유효성 검사 규칙 추가
- `Field.dependsOn`: 필드 간 의존성 추가
- `Field.modeOverride`: 개별 필드 모드 오버라이드 추가
- `Action.behavior`: 구조화된 동작 정의
- `Action.loading`: 로딩 상태 추가
- `Group.role`: `Fieldset`, `List`, `Grid`, `Table`, `Tabs`, `Steps`, `Split`, `Card`, `Inline` 추가
- `Group.layout`: 레이아웃 방향 명시
- `Group.state`: `idle`, `loading`, `error`, `empty` 상태 추가
- `Group.emptyContent`, `Group.errorContent`: 상태별 컨텐츠
- `Section.density`: 밀도 속성 추가
- `Section.role`: `Aside` 추가
- `Overlay.isOpen`: 표시 상태 (문서-코드 동기화)
- `Overlay.dismissable`: 외부 클릭 닫기 여부
- `Overlay.role`: `Popover`, `Sheet`, `Lightbox` 추가
- `Page.description`, `Page.layout`, `Page.breadcrumbs` 추가
- 추가 예제: Data Table, Dashboard, Settings, Wizard

**Fixes:**
- `Action.icon` 문서 누락 수정
- `Text.role: 'Code'` Taxonomy 누락 수정
- Default 값 명시 테이블 추가

---

## Appendix A: UI Pattern Coverage Matrix

IDDL이 커버하는 일반적인 Admin UI 패턴:

| Pattern | IDDL Coverage | Example |
|---------|---------------|---------|
| **CRUD List** | ✅ Full | Group[Table] + Toolbar |
| **CRUD Detail** | ✅ Full | Section[view] + Form |
| **CRUD Edit** | ✅ Full | Section[edit] + Form |
| **Dashboard** | ✅ Full | Page[dashboard] + Grid + Card |
| **Settings** | ✅ Full | Tabs + Form |
| **Wizard** | ✅ Full | Steps + Form |
| **Search/Filter** | ✅ Full | Toolbar + Field |
| **Modal Dialog** | ✅ Full | Overlay[Dialog] |
| **Side Panel** | ✅ Full | Overlay[Drawer] |
| **Toast/Alert** | ✅ Full | Overlay[Toast] |
| **Tabs** | ✅ Full | Group[Tabs] |
| **Accordion** | ⚠️ Partial | Group[List] (렌더러 해석 필요) |
| **Tree View** | ⚠️ Partial | Nested Group[List] |
| **Drag & Drop** | ❌ Not covered | 별도 확장 필요 |
| **Charts** | ❌ Not covered | Custom node 확장 필요 |
| **Maps** | ❌ Not covered | Custom node 확장 필요 |
| **Rich Text Editor** | ✅ Field | dataType: 'richtext' |
| **File Upload** | ✅ Field | dataType: 'file' / 'image' |
| **Date Picker** | ✅ Field | dataType: 'date' / 'datetime' |
| **Color Picker** | ✅ Field | dataType: 'color' |
| **Rating Input** | ✅ Field | dataType: 'rating' |
| **Slider** | ✅ Field | dataType: 'range' |

---

## Appendix B: Renderer Implementation Notes

IDDL 스키마를 실제 UI로 변환하는 렌더러 구현 시 고려사항:

### B.1. Prominence → Visual Weight Mapping

```typescript
const prominenceToButton = {
  Hero: 'full-width solid with elevated shadow',
  Standard: 'solid',
  Strong: 'outline',
  Subtle: 'ghost/link'
};

const prominenceToText = {
  Hero: 'display/h1',
  Standard: 'h2/h3',
  Strong: 'h4/body-large',
  Subtle: 'body/caption'
};
```

### B.2. Intent → Color Palette Mapping

```typescript
const intentToColor = {
  Neutral: 'gray',
  Brand: 'primary', // Design system's brand color
  Positive: 'green',
  Caution: 'yellow/orange',
  Critical: 'red',
  Info: 'blue'
};
```

### B.3. Mode Propagation

```typescript
function resolveMode(node: FieldNode, context: { mode: 'view' | 'edit' }): 'view' | 'edit' {
  return node.modeOverride ?? context.mode ?? 'view';
}
```

### B.4. Condition Evaluation

렌더러는 `condition` 표현식을 평가할 수 있어야 한다. 권장 접근법:

1. 간단한 경로 참조: `lodash.get`으로 값 추출 후 truthy 체크
2. 비교 연산: 간단한 표현식 파서 또는 `new Function` (보안 주의)
3. 복잡한 로직: 렌더러에 validator 함수 등록

---

## Appendix C: LLM Prompt Template

LLM이 데이터 스키마로부터 IDDL을 생성할 때 사용할 프롬프트 템플릿:

```
You are an IDDL (Intent-Driven UI DSL) generator. Given a data schema and user requirements, generate a valid IDDL JSON schema.

Rules:
1. Focus on INTENT, not implementation
2. Use appropriate Prominence for visual hierarchy
3. Use Intent to convey semantic meaning
4. Choose Density based on information consumption pattern
5. Select appropriate Group roles for data presentation
6. Use Section.mode to control view/edit behavior
7. Add conditions for role-based visibility
8. Include proper validation constraints

Data Schema:
{schema}

Requirements:
{requirements}

Generate IDDL JSON:
```

---

## Appendix D: Section v4.1 Implementation Notes (2026-01-09)

### D.1. Overview

IDDL v4.1 구현에서 **Section Role Configuration 중앙화**를 도입했습니다. 이는 스펙의 변경이 아닌 구현 최적화이며, IDDL 스펙은 그대로 유지됩니다.

### D.2. Key Changes

#### Before (v4.0): Distributed Configuration

```typescript
// Section.tsx
const roleToTag = { Header: 'header', ... };
const roleToAria = { Navigator: { role: 'navigation' }, ... };

// Renderer
const roleStyles = {
  PrimarySidebar: 'flex flex-col w-64 overflow-y-auto',
  // ... hardcoded styles
}[role];
```

#### After (v4.1): Centralized Configuration

```typescript
// role-config.ts (single source of truth)
export const ROLE_CONFIGS = {
  studio: {
    PrimarySidebar: {
      gridArea: 'sidebar',
      overflow: 'auto',
      htmlTag: 'aside',
      ariaProps: { 'aria-label': 'Primary Sidebar' },
      baseStyles: 'flex flex-col w-64 flex-shrink-0',
    },
  },
};

// Section.tsx (uses config)
const config = getRoleConfig(role, template);
```

### D.3. Page Responsibility Principle

```
Page가 template을 정의하고, template + role 조합이 모든 Section 속성을 결정한다.
```

**주요 결정**:
1. **Page가 결정**: gridArea, overflow (스크롤), layout
2. **Section이 받음**: 외부에서 주입된 설정 적용
3. **명시적 override 없음**: `overflow` prop 제공 안 함

### D.4. Overflow Policy

| Template | Role | Overflow | Reason |
|----------|------|----------|--------|
| studio | PrimarySidebar | `auto` | File tree scrolls |
| studio | Editor | `hidden` | CodeMirror handles scroll |
| studio | Panel | `auto` | Terminal output scrolls |
| 3-col | Navigator | `auto` | Slide list scrolls |
| 3-col | Main | `hidden` | Canvas handles scroll |
| 3-col | Aside | `auto` | Property panel scrolls |
| universal | Header/Footer | `hidden` | Fixed areas |

### D.5. Implementation Files

- **`role-config.ts`**: Central configuration for all Section roles
  - Defines `gridArea`, `overflow`, `htmlTag`, `ariaProps`, `baseStyles`
  - Supports 7 templates: studio, sidebar-content, 3-col, presentation, master-detail, dialog, universal

- **`Section.tsx`**: Role configuration consumer
  - Calls `getRoleConfig(role, template)`
  - Passes configuration to renderers

- **`useDynamicGridTemplate.ts`**: Grid template generator
  - Uses `getRoleConfig()` to get gridArea
  - Eliminates duplicate role → gridArea mapping

### D.6. Benefits

1. **Single Source of Truth**: All role properties in one place
2. **Consistency**: Same role always has same configuration
3. **Maintainability**: Change configuration in one place
4. **Extensibility**: Add new templates by updating role-config only
5. **Type Safety**: RoleConfig interface ensures type safety

### D.7. Documentation

상세한 v4.1 구현 문서:
- **Section v4.1 스펙**: `/docs/2-areas/core/3-reference/section-v4.1-spec.md`
- **Page-Section Overflow 정책**: `/docs/2-areas/core/3-reference/page-section-overflow-policy.md`
- **아카이브된 v4.0 문서**: `/docs/4-archive/2026-01-09-v4.1-section-role-config/`

### D.8. Migration Guide

기존 코드는 변경 없이 작동합니다. v4.1은 내부 구현 최적화이며, IDDL 스펙 호환성이 유지됩니다.

**변경 사항 없음**:
```tsx
// ✅ v4.0과 v4.1 모두 동일하게 작동
<Page role="App" template="studio">
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
</Page>
```

**변경 사항 (내부 구현만)**:
- Section.tsx: `getRoleConfig()` 사용
- Renderer: 외부 주입받은 `baseStyles`, `overflowClass` 사용
- useDynamicGridTemplate.ts: `getRoleConfig()` 사용

---

**Last Updated**: 2026-01-09 (v4.1 Implementation Notes)
