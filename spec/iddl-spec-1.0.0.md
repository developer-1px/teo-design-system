다음은 우리가 함께 정의한 **Intent-Driven UI DSL (IDDL)**의 기술 명세서(Technical Specification) 초안입니다.

이 명세서는 W3C 표준 문서 형식을 차용하여 작성되었으며, 다른 LLM(GPT-4, Claude 3 등)이 이 문서를 읽고 **정확한 JSON 스키마를 생성하거나 UI 코드를 렌더링할 수 있도록** 엄격하게 정의되었습니다.

---

# Intent-Driven UI DSL Specification (IDDL)

**Version:** 1.0.0 (Draft)

**Date:** 2026-01-08

**Author:** Teo & Gemini

**Status:** Working Draft

## 1. Abstract

Intent-Driven UI DSL(IDDL)은 UI의 시각적 구현(Implementation)이 아닌 **설계 의도(Design Intent)**와 **데이터 구조(Data Structure)**를 정의하기 위한 선언형 언어(Declarative Language)이다. 이 명세는 스타일링(CSS)과 구체적인 컴포넌트 라이브러리로부터 독립적이며, **구조(Structure)**, **위계(Hierarchy)**, **역할(Role)**, **의도(Intent)**의 4가지 핵심 축을 통해 UI를 기술한다.

## 2. Core Concepts (Design Tokens)

IDDL의 모든 노드는 다음 4가지 핵심 속성(Properties)을 통해 디자인 시스템에 렌더링 지침을 전달한다.

### 2.1. Prominence (주목도)

UI 요소의 시각적 계층(Visual Hierarchy)과 무게감을 정의한다. 순서(Order)가 아닌 강도(Weight)를 의미한다.

* `Hero`: 최상위 강조. 거대한 크기 또는 배경색이 가득 찬 형태.
* `Primary`: 표준 강조. 주요 컨텐츠 및 핵심 액션(Solid).
* `Secondary`: 보조 강조. 부가 정보 또는 차순위 액션(Outline).
* `Tertiary`: 최소 강조. 배경에 녹아들거나 숨겨진 형태(Ghost).

### 2.2. Intent (의도)

UI 요소가 전달하고자 하는 의미(Semantic Meaning)와 감정(Mood)을 정의한다. 주로 색상(Color Palette) 결정에 사용된다.

* `Neutral`: 일반적 정보. 무채색(Gray/Black/White). (Default)
* `Brand`: 브랜드 아이덴티티 강조. 주요 액션(Primary Color).
* `Success`: 긍정적 상태, 완료, 성공(Green).
* `Warning`: 주의, 경고, 대기(Yellow/Orange).
* `Danger`: 위험, 삭제, 에러, 파괴적 액션(Red).

### 2.3. Density (밀도)

정보를 소비하는 방식(Scanning Pattern)과 공간감(Spacing)을 정의한다. 주로 컨테이너(`Group`, `Section`)에 적용되어 자식 요소의 레이아웃에 영향을 미친다.

* `Comfortable`: 넓은 여백. 마케팅 페이지, 대시보드 요약 뷰.
* `Standard`: 표준 간격. 일반적인 문서, 폼 입력. (Default)
* `Compact`: 좁은 간격. 데이터 그리드, 전문가용 도구, 리스트 뷰.

### 2.4. Role (역할)

컴포넌트의 기능적 본질(Functional Identity)을 정의한다. 각 노드 타입(`Type`)마다 허용되는 Role이 엄격히 제한된다. (Section 4 참조)

---

## 3. Data Model & Hierarchy

문서의 구조는 `Page`를 루트(Root)로 하는 트리(Tree) 구조를 가진다.

**[Hierarchy Diagram]**

> `Page` (Root)
> ├── `Section` (Layout Layer - Ground)
> │   └── `Group` (Container - Recursive)
> │       ├── `Text` (Static Content)
> │       ├── `Field` (Dynamic Data)
> │       └── `Action` (Trigger)
> └── `Overlay` (Interaction Layer - Air)
> └── `Group` ...

### 3.1. Primitives (Leaf Nodes)

UI를 구성하는 최소 단위 요소.

#### 3.1.1. Text Node

**"데이터 바인딩이 없는 순수한 정적 콘텐츠"**

* **Type Identifier:** `"Text"`
* **Description:** 변하지 않는 제목, 설명문, 장식 텍스트를 표현한다.
* **Attributes:**
* `content` (string, Required): 텍스트 내용.
* `role`: `Title`, `Body`, `Label`, `Code`.
* `align`: `left`, `center`, `right`.



#### 3.1.2. Field Node

**"조회와 편집이 가능한 데이터 객체"**

* **Type Identifier:** `"Field"`
* **Description:** 실제 데이터 모델과 바인딩되는 요소. 부모 컨텍스트(`mode`)에 따라 **Text(View)** 또는 **Input(Edit)**으로 렌더링된다.
* **Attributes:**
* `label` (string, Required): 필드명(Label).
* `model` (string, Required): 데이터 바인딩 키 (ex: `user.email`).
* `dataType`: `text`, `number`, `date`, `boolean`, `select`, `image`, `password`.
* `options`: (Optional) `select` 타입을 위한 선택지 배열 `[{ label, value }]`.
* `placeholder`: (Optional) 값이 없을 때 표시할 텍스트.
* `required`: (boolean) 필수값 여부.



#### 3.1.3. Action Node

**"시스템에 변화를 주는 명령 트리거"**

* **Type Identifier:** `"Action"`
* **Description:** 클릭 등의 상호작용을 통해 이벤트를 발생시키거나 페이지를 이동한다.
* **Attributes:**
* `label` (string): 버튼 라벨.
* `command` (string): 실행할 핸들러 명 (ex: `form.submit`).
* `args` (object): 핸들러에 전달할 인자.
* `to` (string): 페이지 이동 경로 (Hyperlink).
* `confirm` (string): 실행 전 확인 메시지.
* `disabled` (boolean): 비활성화 여부.



### 3.2. Containers (Branch Nodes)

자식 요소를 포함하며 레이아웃을 결정하는 단위.

#### 3.2.1. Group Node

**"논리적 묶음 단위"**

* **Type Identifier:** `"Group"`
* **Description:** 연관된 Primitives를 묶어주는 컨테이너. 재귀적으로 중첩 가능하다.
* **Attributes:**
* `children`: `(Group | Text | Field | Action)[]`
* `role`: `Container`, `Collection` (List/Grid), `Form`, `Toolbar`.
* `density`: 내부 간격 결정.



#### 3.2.2. Section Node

**"페이지의 흐름을 구성하는 주요 구획"**

* **Type Identifier:** `"Section"`
* **Description:** 페이지 내에서 물리적 공간을 차지하는 큰 영역(Layout).
* **Attributes:**
* `children`: `Group[]`
* `role`: `Container` (Main), `Navigator` (Sidebar/Tab), `Header`, `Footer`.
* `mode`: `view` | `edit` (자식 Field들의 렌더링 모드를 결정).



#### 3.2.3. Overlay Node

**"페이지 흐름 위에 부유하는 구획"**

* **Type Identifier:** `"Overlay"`
* **Description:** 모달, 토스트, 드로어 등 Z-index 레이어 상위에 존재하는 영역.
* **Attributes:**
* `children`: `Group[]`
* `role`: `Dialog` (Center Modal), `Drawer` (Side Panel), `Toast`, `Tooltip`.
* `placement`: `center`, `top`, `bottom`, `left`, `right`.
* `isOpen`: (boolean) 표시 여부 상태.



---

## 4. Taxonomy (Role Definition Definitions)

각 노드 타입별 허용 가능한 `Role` 값은 다음과 같다.

| Node Type | Role Value | Description |
| --- | --- | --- |
| **Section** | `Container` | 일반적인 컨텐츠 영역 (Main) |
|  | `Navigator` | 네비게이션, 사이드바, 탭 영역 |
|  | `Header` / `Footer` | 페이지 상/하단 고정 영역 |
| **Overlay** | `Dialog` | 중앙 정렬 모달 (Dimmed Background) |
|  | `Drawer` | 측면에서 슬라이드되는 패널 |
|  | `Toast` | 일시적인 알림 메시지 |
| **Group** | `Container` | 일반적인 박스 컨테이너 |
|  | `Collection` | 반복되는 데이터 리스트 또는 그리드 |
|  | `Form` | 입력 필드들의 집합 (Validation Context) |
|  | `Toolbar` | 버튼 및 액션 컨트롤의 집합 |
| **Text** | `Title` | 제목 (Heading Level은 위계에 따라 자동 결정) |
|  | `Body` | 본문 텍스트 |
|  | `Label` | 짧은 라벨 또는 주석 |
| **Action** | (None) | Action은 Role 대신 Prominence/Intent로 구분함 |
| **Field** | (None) | Field는 dataType으로 구분함 |

---

## 5. TypeScript Interface Definition (Normative)

```typescript
/**
 * IDDL (Intent-Driven UI DSL) Schema
 */

export type UIProminence = 'Hero' | 'Primary' | 'Secondary' | 'Tertiary';
export type UIIntent = 'Neutral' | 'Brand' | 'Success' | 'Warning' | 'Danger';
export type UIDensity = 'Comfortable' | 'Standard' | 'Compact';

interface BaseNode {
  id?: string;
  prominence?: UIProminence; // Default: 'Primary'
  intent?: UIIntent;         // Default: 'Neutral'
  hidden?: boolean;
}

// --- Leaf Nodes ---

export interface TextNode extends BaseNode {
  type: 'Text';
  role: 'Title' | 'Body' | 'Label' | 'Code';
  content: string;
  align?: 'left' | 'center' | 'right';
}

export interface FieldNode extends BaseNode {
  type: 'Field';
  // Data Definition
  label: string;
  model: string;
  dataType: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'image' | 'password';
  // Constraints
  required?: boolean;
  options?:Array<{ label: string; value: any }>; // For select type
  // View/Edit Config
  placeholder?: string;
}

export interface ActionNode extends BaseNode {
  type: 'Action';
  label?: string;
  icon?: string;
  // Behavior (Mutually Exclusive)
  command?: string; // Execute Function
  args?: Record<string, any>;
  to?: string;      // Navigate Link
  // State
  disabled?: boolean;
  confirm?: string; // Confirmation Message
}

// --- Container Nodes ---

export interface GroupNode extends BaseNode {
  type: 'Group';
  role: 'Container' | 'Collection' | 'Form' | 'Toolbar';
  children: Array<GroupNode | TextNode | FieldNode | ActionNode>;
  density?: UIDensity;
}

export interface SectionNode extends BaseNode {
  type: 'Section';
  role: 'Container' | 'Navigator' | 'Header' | 'Footer';
  children: GroupNode[];
  mode?: 'view' | 'edit'; // Context Propagation
}

export interface OverlayNode extends BaseNode {
  type: 'Overlay';
  role: 'Dialog' | 'Drawer' | 'Toast' | 'Tooltip';
  children: GroupNode[];
  placement?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

// --- Root ---

export interface PageSchema {
  type: 'Page';
  title: string;
  children: Array<SectionNode | OverlayNode>;
}

```

---

## 6. Example Usage (JSON)

다음은 사용자 프로필을 조회하고, 수정 모달을 띄우는 시나리오의 IDDL 명세이다.

```json
{
  "type": "Page",
  "title": "User Profile",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "view",
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            { "type": "Text", "role": "Title", "content": "Basic Info", "prominence": "Hero" },
            { "type": "Field", "label": "Username", "model": "user.name", "dataType": "text" },
            { "type": "Field", "label": "Email", "model": "user.email", "dataType": "text" }
          ]
        },
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { 
              "type": "Action", 
              "label": "Edit Profile", 
              "command": "modal.open", 
              "args": { "target": "edit-modal" }, 
              "prominence": "Primary", 
              "intent": "Brand" 
            }
          ]
        }
      ]
    },
    {
      "type": "Overlay",
      "role": "Dialog",
      "id": "edit-modal",
      "placement": "center",
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            { "type": "Text", "role": "Title", "content": "Edit Profile" },
            { "type": "Field", "label": "Username", "model": "user.name", "dataType": "text", "required": true },
            { "type": "Field", "label": "Email", "model": "user.email", "dataType": "text", "required": true },
            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                { "type": "Action", "label": "Cancel", "command": "modal.close", "intent": "Neutral" },
                { "type": "Action", "label": "Save", "command": "form.submit", "intent": "Brand" }
              ]
            }
          ]
        }
      ]
    }
  ]
}

```