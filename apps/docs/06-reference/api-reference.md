# API 레퍼런스 📚

**IDDL Specification v1.0.1**

완전한 IDDL API 레퍼런스입니다. 빠른 참조를 위한 요약본입니다.

---

## 목차

1. [노드 타입](#노드-타입)
2. [공통 속성](#공통-속성)
3. [Primitive 노드](#primitive-노드)
4. [Container 노드](#container-노드)
5. [Field dataType](#field-datatype)
6. [Action behavior](#action-behavior)

---

## 노드 타입

### 계층 구조

```
Page (Root)
 └─ Section | Overlay
     └─ Group
         └─ Text | Field | Action | Group
```

### 분류

| 분류 | 노드 타입 | 자식 가능 |
|------|-----------|-----------|
| **Root** | Page | Section, Overlay |
| **Layout** | Section, Overlay | Group |
| **Container** | Group | Text, Field, Action, Group |
| **Primitive** | Text, Field, Action | ✗ 없음 |

---

## 공통 속성

모든 노드가 가질 수 있는 속성:

| 속성 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `type` | string | 노드 타입 | 필수 |
| `id` | string | 고유 식별자 | - |
| `hidden` | boolean \| string | 숨김 여부 (조건식 가능) | false |
| `condition` | Condition | 조건부 속성 변경 | - |
| `prominence` | Prominence | 시각적 강조 | - |
| `intent` | Intent | 의미/색상 | Neutral |
| `density` | Density | 여백 | Standard |

### Prominence

```typescript
type Prominence = 'Hero' | 'Primary' | 'Secondary' | 'Tertiary';
```

- **Hero**: 48px, 700 weight, 100% opacity
- **Primary**: 16px, 500 weight, 100% opacity
- **Secondary**: 14px, 400 weight, 60% opacity
- **Tertiary**: 12px, 400 weight, 40% opacity

### Intent

```typescript
type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
```

- **Neutral**: 회색 (기본)
- **Brand**: 파란색 (브랜드)
- **Positive**: 초록색 (성공, 완료)
- **Caution**: 주황색 (경고, 대기)
- **Critical**: 빨간색 (에러, 삭제)
- **Info**: 하늘색 (정보)

### Density

```typescript
type Density = 'Comfortable' | 'Standard' | 'Compact';
```

- **Comfortable**: 16-24px 여백
- **Standard**: 12-16px 여백
- **Compact**: 4-8px 여백

---

## Primitive 노드

### Text

**용도**: 정적 텍스트

```typescript
interface TextNode {
  type: 'Text';
  role: 'Title' | 'Body' | 'Label' | 'Caption' | 'Code';
  content: string;
  model?: string;
  align?: 'left' | 'center' | 'right';
  prominence?: Prominence;
  intent?: Intent;
}
```

**예시**:
```json
{
  "type": "Text",
  "role": "Title",
  "content": "Dashboard",
  "prominence": "Hero"
}
```

---

### Field

**용도**: 데이터 바인딩 필드

```typescript
interface FieldNode {
  type: 'Field';
  label: string;
  model: string;
  dataType: DataType;
  mode?: 'view' | 'edit';
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  constraints?: Constraints;
  errorMessages?: Record<string, string>;
  options?: Option[];  // select, multiselect, radio, checkbox
}
```

**예시**:
```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "required": true,
  "placeholder": "you@example.com"
}
```

---

### Action

**용도**: 인터랙션 트리거

```typescript
interface ActionNode {
  type: 'Action';
  label: string;
  icon?: string;
  title?: string;  // IconButton의 경우 필수
  prominence?: Prominence;
  intent?: Intent;
  confirm?: string;
  behavior: Behavior;
}
```

**예시**:
```json
{
  "type": "Action",
  "label": "Save",
  "prominence": "Primary",
  "intent": "Positive",
  "behavior": {
    "action": "submit"
  }
}
```

---

## Container 노드

### Page

**용도**: 루트 노드

```typescript
interface PageNode {
  type: 'Page';
  title: string;
  description?: string;
  layout: 'single' | 'sidebar' | 'dashboard' | 'split' | 'wizard';
  breadcrumbs?: Breadcrumb[];
  children: (SectionNode | OverlayNode)[];
}
```

---

### Section

**용도**: 페이지 영역

```typescript
interface SectionNode {
  type: 'Section';
  role: 'Container' | 'Header' | 'Footer' | 'Navigator' | 'Aside';
  mode?: 'view' | 'edit';
  density?: Density;
  children: GroupNode[];
}
```

---

### Overlay

**용도**: 부유 레이어

```typescript
interface OverlayNode {
  type: 'Overlay';
  id: string;
  role: 'Dialog' | 'Drawer' | 'Toast' | 'Popover' | 'Tooltip' | 'Sheet' | 'Lightbox';
  placement?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  isOpen?: boolean;
  dismissable?: boolean;
  children: GroupNode[];
}
```

---

### Group

**용도**: 논리적 묶음

```typescript
interface GroupNode {
  type: 'Group';
  role: 'Container' | 'Form' | 'Fieldset' | 'Toolbar' | 'List' | 'Grid' | 'Table' | 'Card' | 'Tabs' | 'Steps' | 'Split' | 'Inline';
  density?: Density;
  state?: 'idle' | 'loading' | 'empty' | 'error';
  emptyContent?: Node;
  errorContent?: Node;
  children: Node[];
}
```

---

## Field dataType

### 텍스트 계열

| dataType | view 모드 | edit 모드 |
|----------|-----------|-----------|
| `text` | 일반 텍스트 | `<input type="text">` |
| `textarea` | 여러 줄 | `<textarea>` |
| `richtext` | HTML | WYSIWYG 에디터 |
| `password` | `••••••` | `<input type="password">` |
| `email` | 이메일 링크 | `<input type="email">` |
| `url` | URL 링크 | `<input type="url">` |

### 숫자 계열

| dataType | view 모드 | edit 모드 |
|----------|-----------|-----------|
| `number` | 숫자 | `<input type="number">` |
| `currency` | $1,234.56 | Currency Input |
| `rating` | ★★★★☆ | Star Rating |
| `range` | 50% | `<input type="range">` |

### 날짜 계열

| dataType | view 모드 | edit 모드 |
|----------|-----------|-----------|
| `date` | 2025-01-08 | Date Picker |
| `datetime` | 2025-01-08 14:30 | DateTime Picker |

### 선택 계열

| dataType | view 모드 | edit 모드 |
|----------|-----------|-----------|
| `boolean` | Yes/No | Toggle/Checkbox |
| `select` | 선택된 항목 | `<select>` |
| `multiselect` | 항목1, 항목2 | Multi-select |
| `radio` | 선택된 항목 | Radio group |
| `checkbox` | 선택된 항목들 | Checkbox group |

### 파일 계열

| dataType | view 모드 | edit 모드 |
|----------|-----------|-----------|
| `file` | 다운로드 링크 | File input |
| `image` | `<img>` | Image uploader |

### 기타

| dataType | view 모드 | edit 모드 |
|----------|-----------|-----------|
| `phone` | 전화번호 링크 | Phone input |
| `color` | 🟦 #3b82f6 | Color picker |

---

## Action behavior

### 7가지 Action

| action | 용도 | 필수 속성 |
|--------|------|-----------|
| `command` | API 호출 | endpoint, method |
| `navigate` | 페이지 이동 | to |
| `submit` | 폼 제출 | endpoint, method |
| `reset` | 폼 초기화 | - |
| `open` | Overlay 열기 | overlay (id) |
| `close` | Overlay 닫기 | - |
| `toggle` | 상태 토글 | model |

### Behavior 상세

```typescript
interface CommandBehavior {
  action: 'command';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, any>;
  body?: any;
  onSuccess?: Behavior;
  onError?: Behavior;
}

interface NavigateBehavior {
  action: 'navigate';
  to: string;
  params?: Record<string, any>;
}

interface SubmitBehavior {
  action: 'submit';
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  onSuccess?: Behavior;
  onError?: Behavior;
}

interface ResetBehavior {
  action: 'reset';
}

interface OpenBehavior {
  action: 'open';
  overlay: string;  // Overlay id
}

interface CloseBehavior {
  action: 'close';
  overlay?: string;  // 생략 시 현재 Overlay
}

interface ToggleBehavior {
  action: 'toggle';
  model: string;
  endpoint?: string;
  method?: 'POST' | 'PUT' | 'PATCH';
}
```

---

## Constraints

### 공통

| 속성 | 타입 | 적용 dataType |
|------|------|---------------|
| `required` | boolean | 모든 타입 |

### 문자열

| 속성 | 타입 | 적용 dataType |
|------|------|---------------|
| `minLength` | number | text, textarea, richtext, password, email, url, phone |
| `maxLength` | number | 위와 동일 |
| `pattern` | string (regex) | 위와 동일 |

### 숫자

| 속성 | 타입 | 적용 dataType |
|------|------|---------------|
| `min` | number | number, currency, range |
| `max` | number | 위와 동일 |
| `step` | number | 위와 동일 |

### 날짜

| 속성 | 타입 | 적용 dataType |
|------|------|---------------|
| `min` | string (ISO 8601) | date, datetime |
| `max` | string (ISO 8601) | 위와 동일 |

### 파일

| 속성 | 타입 | 적용 dataType |
|------|------|---------------|
| `accept` | string | file, image |
| `maxSize` | number (bytes) | 위와 동일 |

### 다중 선택

| 속성 | 타입 | 적용 dataType |
|------|------|---------------|
| `minItems` | number | multiselect, checkbox |
| `maxItems` | number | 위와 동일 |

---

## 조건부 렌더링

### if-then-else

```typescript
interface Condition {
  if: string;  // 조건식
  then: Partial<Node>;  // 참일 때 속성
  else?: Partial<Node>;  // 거짓일 때 속성
}
```

**예시**:
```json
{
  "type": "Action",
  "label": "Follow",
  "condition": {
    "if": "user.isFollowing",
    "then": {
      "label": "Unfollow",
      "intent": "Neutral"
    },
    "else": {
      "label": "Follow",
      "intent": "Brand"
    }
  }
}
```

### switch

```typescript
interface SwitchCondition {
  switch: string;  // 변수
  cases: Record<string, Partial<Node>>;
  default?: Partial<Node>;
}
```

**예시**:
```json
{
  "type": "Text",
  "model": "order.status",
  "condition": {
    "switch": "order.status",
    "cases": {
      "pending": { "content": "⏳ Pending", "intent": "Caution" },
      "completed": { "content": "✓ Completed", "intent": "Positive" }
    }
  }
}
```

---

## 상태 관리

### Group 상태

| state | 의미 | 렌더링 |
|-------|------|--------|
| `idle` | 정상 | 자식 렌더링 |
| `loading` | 로딩 중 | 스피너 |
| `empty` | 데이터 없음 | emptyContent |
| `error` | 에러 발생 | errorContent |

---

## 성능 최적화

### 가상 스크롤링

```typescript
interface GroupNode {
  virtualized?: boolean;
  rowHeight?: number;
  overscan?: number;
}
```

### 지연 로딩

```typescript
interface GroupNode {
  lazyLoad?: boolean;  // Tabs
}

interface FieldNode {
  lazy?: boolean;  // 이미지
}
```

### 캐싱

```typescript
interface GroupNode {
  cacheKey?: string;
  cacheDuration?: number;  // ms
}
```

---

## 참고

- **전체 스펙**: [IDDL Specification v1.0.1](/spec/iddl-spec-1.0.1.md)
- **속성 매트릭스**: [Property Matrix](./property-matrix.md)
- **Role 분류**: [Role Taxonomy](./role-taxonomy.md)

---

**이전**: [← Best Practices](../05-advanced/05-best-practices.md)
**다음**: [Property Matrix →](./property-matrix.md)
