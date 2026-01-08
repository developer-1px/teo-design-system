# Property Matrix: 속성 호환성 표 📊

**IDDL Specification v1.0.1**

어떤 노드에 어떤 속성을 사용할 수 있는지 한눈에 보는 매트릭스입니다.

---

## 목차

1. [공통 속성](#공통-속성)
2. [시각적 속성](#시각적-속성)
3. [레이아웃 속성](#레이아웃-속성)
4. [데이터 속성](#데이터-속성)
5. [인터랙션 속성](#인터랙션-속성)
6. [성능 속성](#성능-속성)

---

## 공통 속성

모든 노드가 가질 수 있는 속성:

| 속성 | Page | Section | Overlay | Group | Text | Field | Action | 설명 |
|------|------|---------|---------|-------|------|-------|--------|------|
| `type` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 노드 타입 (필수) |
| `id` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 고유 식별자 |
| `hidden` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 숨김 여부 |
| `condition` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 조건부 속성 |

---

## 시각적 속성

### prominence

| 노드 타입 | 지원 | 기본값 | 적용 대상 | 비고 |
|-----------|------|--------|-----------|------|
| **Text** | ✅ | - | 텍스트 크기, 굵기, 투명도 | role에 따라 자동 설정 |
| **Field** | ❌ | - | - | label은 prominence 없음 |
| **Action** | ✅ | Secondary | 버튼 크기, 패딩 | Hero는 사용하지 않음 |
| **Group** | ❌ | - | - | 자식에만 적용 |
| **Section** | ❌ | - | - | - |
| **Overlay** | ❌ | - | - | - |
| **Page** | ❌ | - | - | - |

**값**: Hero, Primary, Secondary, Tertiary

---

### intent

| 노드 타입 | 지원 | 기본값 | 적용 대상 | 비고 |
|-----------|------|--------|-----------|------|
| **Text** | ✅ | Neutral | 텍스트 색상 | - |
| **Field** | ✅ | Neutral | 테두리, 포커스 색상 | 에러 시 자동 Critical |
| **Action** | ✅ | Neutral | 버튼 배경/텍스트 색상 | - |
| **Group** | ✅ | Neutral | 배경/테두리 색상 | Card, Alert에 주로 사용 |
| **Section** | ❌ | - | - | - |
| **Overlay** | ❌ | - | - | - |
| **Page** | ❌ | - | - | - |

**값**: Neutral, Brand, Positive, Caution, Critical, Info

---

### density

| 노드 타입 | 지원 | 기본값 | 적용 대상 | 비고 |
|-----------|------|--------|-----------|------|
| **Text** | ❌ | - | - | - |
| **Field** | ❌ | - | - | Group에서 상속 |
| **Action** | ❌ | - | - | Group에서 상속 |
| **Group** | ✅ | Standard | 내부 여백, 간격 | 자식에 영향 |
| **Section** | ✅ | Standard | 내부 여백, 간격 | 자식에 영향 |
| **Overlay** | ✅ | Standard | 내부 여백 | - |
| **Page** | ❌ | - | - | - |

**값**: Comfortable, Standard, Compact

---

## 레이아웃 속성

### role

| 노드 타입 | 필수 | 가능한 값 |
|-----------|------|-----------|
| **Text** | ✅ | Title, Body, Label, Caption, Code |
| **Field** | ❌ | - (dataType으로 구분) |
| **Action** | ❌ | - (자동으로 Button/IconButton) |
| **Group** | ✅ | Container, Form, Fieldset, Toolbar, List, Grid, Table, Card, Tabs, Steps, Split, Inline |
| **Section** | ✅ | Container, Header, Footer, Navigator, Aside |
| **Overlay** | ✅ | Dialog, Drawer, Toast, Popover, Tooltip, Sheet, Lightbox |
| **Page** | ❌ | - (layout으로 구분) |

---

### layout

| 노드 타입 | 지원 | 가능한 값 |
|-----------|------|-----------|
| **Page** | ✅ | single, sidebar, dashboard, split, wizard |
| 기타 | ❌ | - |

---

### children

| 노드 타입 | 필수 | 자식 타입 제한 |
|-----------|------|----------------|
| **Page** | ✅ | Section, Overlay |
| **Section** | ✅ | Group |
| **Overlay** | ✅ | Group |
| **Group** | ✅ | Text, Field, Action, Group |
| **Text** | ❌ | 자식 없음 |
| **Field** | ❌ | 자식 없음 |
| **Action** | ❌ | 자식 없음 |

---

## 데이터 속성

### model

| 노드 타입 | 지원 | 용도 | 예시 |
|-----------|------|------|------|
| **Text** | ✅ | 데이터 바인딩 | `"model": "user.name"` |
| **Field** | ✅ | 양방향 바인딩 | `"model": "user.email"` |
| **Action** | ❌ | - | behavior에서 사용 |
| **Group** | ❌ | - | - |
| **Section** | ❌ | - | - |
| **Overlay** | ❌ | - | - |
| **Page** | ❌ | - | - |

---

### dataType

| 노드 타입 | 지원 | 필수 | 가능한 값 |
|-----------|------|------|-----------|
| **Field** | ✅ | ✅ | text, textarea, richtext, password, email, url, number, currency, rating, range, date, datetime, boolean, select, multiselect, radio, checkbox, file, image, phone, color |
| 기타 | ❌ | - | - |

---

### mode

| 노드 타입 | 지원 | 기본값 | 전파 |
|-----------|------|--------|------|
| **Section** | ✅ | view | 자식에게 전파 |
| **Group** | ✅ | 상속 | Form, Fieldset에만 |
| **Field** | ✅ | 상속 | - |
| 기타 | ❌ | - | - |

**값**: view, edit

---

## 인터랙션 속성

### behavior

| 노드 타입 | 지원 | 필수 | 가능한 action |
|-----------|------|------|---------------|
| **Action** | ✅ | ✅ | command, navigate, submit, reset, open, close, toggle |
| 기타 | ❌ | - | - |

---

### confirm

| 노드 타입 | 지원 | 용도 |
|-----------|------|------|
| **Action** | ✅ | 실행 전 확인 메시지 |
| 기타 | ❌ | - |

---

### onChange

| 노드 타입 | 지원 | 용도 |
|-----------|------|------|
| **Field** | ✅ | 값 변경 시 동작 |
| 기타 | ❌ | - |

---

### constraints

| 노드 타입 | 지원 | 가능한 속성 |
|-----------|------|-------------|
| **Field** | ✅ | required, minLength, maxLength, pattern, min, max, step, accept, maxSize, minItems, maxItems |
| 기타 | ❌ | - |

---

## 성능 속성

### virtualized

| 노드 타입 | 지원 | 용도 |
|-----------|------|------|
| **Group** | ✅ | 가상 스크롤링 (Table, List) |
| 기타 | ❌ | - |

**관련 속성**: rowHeight, overscan

---

### lazyLoad

| 노드 타입 | 지원 | 용도 |
|-----------|------|------|
| **Group** | ✅ | 탭 지연 로딩 (Tabs) |
| **Field** | ✅ | 이미지 지연 로딩 (image) |
| 기타 | ❌ | - |

---

### cacheKey

| 노드 타입 | 지원 | 용도 |
|-----------|------|------|
| **Group** | ✅ | 데이터 캐싱 |
| 기타 | ❌ | - |

**관련 속성**: cacheDuration (ms)

---

### debounce

| 노드 타입 | 지원 | 용도 |
|-----------|------|------|
| **Field** | ✅ | 입력 디바운스 (ms) |
| 기타 | ❌ | - |

---

### throttle

| 노드 타입 | 지원 | 용도 |
|-----------|------|------|
| **Field** | ✅ | 입력 쓰로틀 (ms) |
| 기타 | ❌ | - |

---

## 상태 속성

### state

| 노드 타입 | 지원 | 가능한 값 |
|-----------|------|-----------|
| **Group** | ✅ | idle, loading, empty, error |
| 기타 | ❌ | - |

**관련 속성**: emptyContent, errorContent

---

### isOpen

| 노드 타입 | 지원 | 용도 |
|-----------|------|------|
| **Overlay** | ✅ | 열림/닫힘 상태 |
| 기타 | ❌ | - |

---

### dismissable

| 노드 타입 | 지원 | 기본값 | 용도 |
|-----------|------|--------|------|
| **Overlay** | ✅ | true | ESC/외부 클릭으로 닫기 |
| 기타 | ❌ | - | - |

---

## 접근성 속성

### title

| 노드 타입 | 지원 | 필수 | 용도 |
|-----------|------|------|------|
| **Action** | ✅ | IconButton만 | aria-label |
| 기타 | ❌ | - | - |

---

### ariaLabel

| 노드 타입 | 지원 | 용도 |
|-----------|------|------|
| **Group** | ✅ | 스크린 리더 레이블 |
| **Overlay** | ✅ | 모달 제목 |
| 기타 | ❌ | - |

---

### ariaLive

| 노드 타입 | 지원 | 가능한 값 |
|-----------|------|-----------|
| **Group** | ✅ | polite, assertive, off |
| 기타 | ❌ | - |

---

## 빠른 참조

### 노드별 주요 속성

#### Page

```typescript
{
  type: 'Page',
  title: string,               // ✅ 필수
  layout: Layout,              // ✅ 필수
  description?: string,
  breadcrumbs?: Breadcrumb[],
  children: (Section | Overlay)[]  // ✅ 필수
}
```

---

#### Section

```typescript
{
  type: 'Section',
  role: SectionRole,     // ✅ 필수
  mode?: Mode,           // view | edit
  density?: Density,
  hidden?: boolean | string,
  condition?: Condition,
  children: Group[]      // ✅ 필수
}
```

---

#### Overlay

```typescript
{
  type: 'Overlay',
  id: string,            // ✅ 필수
  role: OverlayRole,     // ✅ 필수
  placement?: Placement,
  isOpen?: boolean,
  dismissable?: boolean,
  ariaLabel?: string,
  children: Group[]      // ✅ 필수
}
```

---

#### Group

```typescript
{
  type: 'Group',
  role: GroupRole,       // ✅ 필수
  density?: Density,
  intent?: Intent,
  mode?: Mode,
  state?: State,
  emptyContent?: Node,
  errorContent?: Node,
  virtualized?: boolean,
  lazyLoad?: boolean,
  cacheKey?: string,
  hidden?: boolean | string,
  condition?: Condition,
  children: Node[]       // ✅ 필수
}
```

---

#### Text

```typescript
{
  type: 'Text',
  role: TextRole,        // ✅ 필수
  content?: string,
  model?: string,        // content OR model
  align?: Align,
  prominence?: Prominence,
  intent?: Intent,
  hidden?: boolean | string,
  condition?: Condition
}
```

---

#### Field

```typescript
{
  type: 'Field',
  label: string,         // ✅ 필수
  model: string,         // ✅ 필수
  dataType: DataType,    // ✅ 필수
  mode?: Mode,
  intent?: Intent,
  required?: boolean,
  placeholder?: string,
  helpText?: string,
  constraints?: Constraints,
  errorMessages?: Record<string, string>,
  options?: Option[],    // select, multiselect, radio, checkbox
  debounce?: number,
  throttle?: number,
  lazy?: boolean,        // image
  hidden?: boolean | string,
  condition?: Condition
}
```

---

#### Action

```typescript
{
  type: 'Action',
  label?: string,        // label OR icon
  icon?: string,
  title?: string,        // IconButton 필수
  prominence?: Prominence,
  intent?: Intent,
  confirm?: string,
  behavior: Behavior,    // ✅ 필수
  hidden?: boolean | string,
  condition?: Condition
}
```

---

## 핵심 정리

### 필수 속성

```
Page: type, title, layout, children
Section: type, role, children
Overlay: type, id, role, children
Group: type, role, children
Text: type, role, (content OR model)
Field: type, label, model, dataType
Action: type, (label OR icon), behavior
```

### 계층 전파

```
Section.mode → Group.mode → Field.mode
Section.density → Group.density → spacing
```

### 조건부 속성

```
모든 노드 (Page 제외): hidden, condition
```

### 시각적 속성

```
prominence: Text, Action
intent: Text, Field, Action, Group
density: Group, Section, Overlay
```

### 성능 속성

```
virtualized: Group (Table, List)
lazyLoad: Group (Tabs), Field (image)
cacheKey: Group
debounce/throttle: Field
```

---

## 참고

- **전체 스펙**: [IDDL Specification v1.0.1](/spec/iddl-spec-1.0.1.md)
- **API 레퍼런스**: [API Reference](./api-reference.md)
- **Role 분류**: [Role Taxonomy](./role-taxonomy.md)

---

**이전**: [← API 레퍼런스](./api-reference.md)
**다음**: [Role Taxonomy →](./role-taxonomy.md)
