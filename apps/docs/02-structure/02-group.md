# Group: 논리적 묶음 단위 📦

**예상 소요 시간**: 13분
**난이도**: ⭐⭐⭐ 중급
**사전 지식**: [Primitives](./01-primitives.md)

---

## 이 문서를 읽고 나면

- Group의 역할을 완벽히 이해합니다
- 12가지 Group role을 구분할 수 있습니다
- 중첩 Group을 올바르게 사용할 수 있습니다

---

## Group이란?

> **"연관된 요소들을 논리적으로 묶는 컨테이너"**

Group은 Primitive(Text, Field, Action)나 다른 Group을 담는 **재귀적 컨테이너**입니다.

```
Group (Container)
 ├─ Text
 ├─ Field
 ├─ Action
 └─ Group (중첩 가능!)
     ├─ Text
     └─ Action
```

---

## 왜 Group이 필요한가?

### Before: Group 없이

```json
{
  "type": "Section",
  "children": [
    { "type": "Text", "content": "Title" },
    { "type": "Text", "content": "Description" },
    { "type": "Action", "label": "Button" }
  ]
}
```

❌ 문제:
- Section은 Group만 자식으로 가질 수 있음
- 구조 규칙 위반

### After: Group 사용

```json
{
  "type": "Section",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "content": "Title" },
        { "type": "Text", "content": "Description" },
        { "type": "Action", "label": "Button" }
      ]
    }
  ]
}
```

✅ 장점:
- 명확한 계층 구조
- role로 의미 부여
- density로 간격 조절

---

## 12가지 Group Role

### 1. Container - 일반 박스

**용도**: 일반적인 묶음

```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    { "type": "Text", "content": "Hello" },
    { "type": "Text", "content": "World" }
  ]
}
```

---

### 2. Form - 입력 폼

**용도**: 검증 컨텍스트, 제출 단위

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    { "type": "Field", "label": "Name", "model": "user.name" },
    { "type": "Field", "label": "Email", "model": "user.email" },
    { "type": "Action", "label": "Submit", "behavior": { "action": "submit" } }
  ]
}
```

---

### 3. Fieldset - 폼 내 필드 그룹

**용도**: 큰 폼 안의 섹션 나누기

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Group",
      "role": "Fieldset",
      "children": [
        { "type": "Text", "content": "Basic Info" },
        { "type": "Field", "label": "Name" }
      ]
    },
    {
      "type": "Group",
      "role": "Fieldset",
      "children": [
        { "type": "Text", "content": "Contact" },
        { "type": "Field", "label": "Email" }
      ]
    }
  ]
}
```

---

### 4. Toolbar - 액션 버튼 집합

**용도**: 가로로 나열된 버튼들

```json
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    { "type": "Action", "label": "Save", "intent": "Positive" },
    { "type": "Action", "label": "Cancel", "intent": "Neutral" },
    { "type": "Action", "label": "Delete", "intent": "Critical" }
  ]
}
```

**렌더링**: `[Save] [Cancel] [Delete]` (가로 배치)

---

### 5. List - 단일 컬럼 목록

**용도**: 세로로 쌓인 항목들

```json
{
  "type": "Group",
  "role": "List",
  "density": "Standard",
  "children": [
    { "type": "Text", "content": "Item 1" },
    { "type": "Text", "content": "Item 2" },
    { "type": "Text", "content": "Item 3" }
  ]
}
```

---

### 6. Grid - 다중 컬럼 그리드

**용도**: 카드들을 여러 열로 배치

```json
{
  "type": "Group",
  "role": "Grid",
  "density": "Comfortable",
  "children": [
    { "type": "Group", "role": "Card", "children": [...] },
    { "type": "Group", "role": "Card", "children": [...] },
    { "type": "Group", "role": "Card", "children": [...] }
  ]
}
```

**렌더링**:
```
[Card 1] [Card 2] [Card 3]
[Card 4] [Card 5] [Card 6]
```

---

### 7. Table - 데이터 테이블

**용도**: 행/열 구조의 데이터

```json
{
  "type": "Group",
  "role": "Table",
  "density": "Compact",
  "children": [
    { "type": "Field", "label": "ID", "model": "item.id" },
    { "type": "Field", "label": "Name", "model": "item.name" },
    { "type": "Field", "label": "Status", "model": "item.status" }
  ]
}
```

**렌더링**:
```
┌─────┬────────┬────────┐
│ ID  │ Name   │ Status │
├─────┼────────┼────────┤
│ 001 │ Teo    │ Active │
│ 002 │ Jane   │ Pending│
└─────┴────────┴────────┘
```

---

### 8. Card - 카드 컨테이너

**용도**: 배경 + 그림자가 있는 박스

```json
{
  "type": "Group",
  "role": "Card",
  "density": "Standard",
  "children": [
    { "type": "Text", "role": "Title", "content": "Card Title" },
    { "type": "Text", "role": "Body", "content": "Card content" }
  ]
}
```

**렌더링**:
```
┌────────────────┐
│ Card Title     │  ← 그림자 + 배경
│ Card content   │
└────────────────┘
```

---

### 9-12. Tabs, Steps, Split, Inline

```json
// Tabs: 탭 전환
{
  "type": "Group",
  "role": "Tabs",
  "children": [
    { "type": "Group", "id": "tab-1", "children": [...] },
    { "type": "Group", "id": "tab-2", "children": [...] }
  ]
}

// Steps: 다단계 진행
{
  "type": "Group",
  "role": "Steps",
  "children": [
    { "type": "Group", "id": "step-1", "children": [...] },
    { "type": "Group", "id": "step-2", "children": [...] }
  ]
}

// Split: 좌우 분할
{
  "type": "Group",
  "role": "Split",
  "children": [
    { "type": "Group", "children": [...] },  // 왼쪽
    { "type": "Group", "children": [...] }   // 오른쪽
  ]
}

// Inline: 인라인 요소 그룹
{
  "type": "Group",
  "role": "Inline",
  "children": [
    { "type": "Text", "content": "Label:" },
    { "type": "Text", "content": "Value", "intent": "Brand" }
  ]
}
```

---

## 중첩 Group

Group은 재귀적으로 중첩 가능합니다:

```json
{
  "type": "Group",
  "role": "Card",               // 레벨 1
  "children": [
    {
      "type": "Text",
      "content": "User Profile"
    },
    {
      "type": "Group",
      "role": "Container",      // 레벨 2 (중첩)
      "children": [
        { "type": "Field", "label": "Name" },
        { "type": "Field", "label": "Email" }
      ]
    },
    {
      "type": "Group",
      "role": "Toolbar",        // 레벨 2 (중첩)
      "children": [
        { "type": "Action", "label": "Edit" },
        { "type": "Action", "label": "Delete" }
      ]
    }
  ]
}
```

**구조**:
```
Card
 ├─ Text: "User Profile"
 ├─ Container
 │   ├─ Field: Name
 │   └─ Field: Email
 └─ Toolbar
     ├─ Action: Edit
     └─ Action: Delete
```

---

## Density 상속

Group의 density는 자식에게 전파됩니다:

```json
{
  "type": "Group",
  "role": "Container",
  "density": "Comfortable",  // ← 넓은 여백
  "children": [
    {
      "type": "Group",
      "role": "Card",
      // density 생략 → Comfortable 상속
      "children": [...]
    },
    {
      "type": "Group",
      "role": "Form",
      "density": "Standard",  // ← 오버라이드
      "children": [...]
    }
  ]
}
```

---

## 상태 관리 (state, emptyContent, errorContent)

```json
{
  "type": "Group",
  "role": "Table",
  "state": "loading",          // ← 로딩 중
  "emptyContent": {
    "type": "Text",
    "content": "No data found",
    "align": "center"
  },
  "errorContent": {
    "type": "Text",
    "content": "Failed to load data",
    "intent": "Critical"
  },
  "children": [...]
}
```

**state 값**:
- `idle`: 기본 상태
- `loading`: 로딩 중 (스피너 표시)
- `empty`: 데이터 없음 (emptyContent 표시)
- `error`: 에러 발생 (errorContent 표시)

---

## 실습 1: 프로필 카드

중첩 Group으로 프로필 카드를 만드세요:

```
┌───────────────────┐
│ User Profile      │  ← 제목
│                   │
│ Name:  Teo        │  ← 필드들
│ Email: teo@...    │
│                   │
│ [Edit] [Delete]   │  ← 버튼들
└───────────────────┘
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Card",              // 카드
  "children": [
    // 제목
    {
      "type": "Text",
      "role": "Title",
      "content": "User Profile",
      "prominence": "Primary"
    },

    // 필드 그룹
    {
      "type": "Group",
      "role": "Container",     // 중첩 Group
      "children": [
        { "type": "Field", "label": "Name", "model": "user.name" },
        { "type": "Field", "label": "Email", "model": "user.email" }
      ]
    },

    // 버튼 그룹
    {
      "type": "Group",
      "role": "Toolbar",       // 중첩 Group
      "children": [
        { "type": "Action", "label": "Edit", "intent": "Brand" },
        { "type": "Action", "label": "Delete", "intent": "Critical" }
      ]
    }
  ]
}
```

</details>

---

## 실습 2: 대시보드 통계

Grid로 통계 카드 3개를 만드세요:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Grid",              // 그리드 레이아웃
  "density": "Comfortable",
  "children": [
    // 카드 1: Revenue
    {
      "type": "Group",
      "role": "Card",
      "children": [
        {
          "type": "Field",
          "model": "stats.revenue",
          "dataType": "currency",
          "prominence": "Hero"
        },
        {
          "type": "Text",
          "content": "Revenue",
          "prominence": "Tertiary"
        }
      ]
    },

    // 카드 2: Orders
    {
      "type": "Group",
      "role": "Card",
      "children": [
        {
          "type": "Field",
          "model": "stats.orders",
          "dataType": "number",
          "prominence": "Hero"
        },
        {
          "type": "Text",
          "content": "Orders",
          "prominence": "Tertiary"
        }
      ]
    },

    // 카드 3: Customers
    {
      "type": "Group",
      "role": "Card",
      "children": [
        {
          "type": "Field",
          "model": "stats.customers",
          "dataType": "number",
          "prominence": "Hero"
        },
        {
          "type": "Text",
          "content": "Customers",
          "prominence": "Tertiary"
        }
      ]
    }
  ]
}
```

</details>

---

## 흔한 실수

### 실수 1: role 없이 Group 사용

```json
// ❌ Wrong
{
  "type": "Group",
  // role 없음 → 의미 불명
  "children": [...]
}

// ✅ Correct
{
  "type": "Group",
  "role": "Container",  // 명확한 의미
  "children": [...]
}
```

### 실수 2: 잘못된 role 선택

```json
// ❌ Wrong: 버튼만 있는데 Form?
{
  "type": "Group",
  "role": "Form",
  "children": [
    { "type": "Action", "label": "Save" },
    { "type": "Action", "label": "Cancel" }
  ]
}

// ✅ Correct: Toolbar가 적합
{
  "type": "Group",
  "role": "Toolbar",
  "children": [...]
}
```

### 실수 3: 과도한 중첩

```json
// ❌ Wrong: 불필요한 중첩
{
  "type": "Group",
  "role": "Container",
  "children": [
    {
      "type": "Group",
      "role": "Container",    // ← 불필요
      "children": [
        { "type": "Text", "content": "Hello" }
      ]
    }
  ]
}

// ✅ Correct: 단순화
{
  "type": "Group",
  "role": "Container",
  "children": [
    { "type": "Text", "content": "Hello" }
  ]
}
```

---

## 핵심 정리

### Group role 선택 가이드

```
일반 묶음 → Container
입력 폼 → Form
폼 안의 섹션 → Fieldset
버튼들 → Toolbar
세로 목록 → List
카드 그리드 → Grid
데이터 테이블 → Table
카드 UI → Card
```

### 중첩 규칙

- Group은 재귀적으로 중첩 가능
- 하지만 **의미 있을 때만** 중첩
- 4단계 이상 중첩은 피할 것

### Density 상속

- 부모 Group의 density는 자식에게 전파
- 자식에서 오버라이드 가능

---

## 다음 단계

Group을 완벽히 이해했습니다!
이제 페이지의 큰 구획을 나누는 **Section**을 배워봅시다.

**다음**: [Section과 레이아웃 →](./03-section.md)

---

**이전**: [← Primitives](./01-primitives.md)
**다음**: [Section과 레이아웃 →](./03-section.md)
