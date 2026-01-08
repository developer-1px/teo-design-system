# Section: 페이지의 큰 구획 🏗️

**예상 소요 시간**: 10분
**난이도**: ⭐⭐ 기초
**사전 지식**: [Group 컨테이너](./02-group.md)

---

## 이 문서를 읽고 나면

- Section의 역할을 이해합니다
- Section role 5가지를 구분할 수 있습니다
- mode 전파를 이해하고 활용할 수 있습니다

---

## Section이란?

> **"페이지 내 물리적 공간을 차지하는 큰 영역"**

Section은 페이지를 **레이아웃 단위**로 나눕니다. Section은 **Group만** 자식으로 가질 수 있습니다.

```
Page
 └─ Section (큰 구획)
     └─ Group (논리적 묶음)
         └─ Primitives (실제 콘텐츠)
```

---

## Section vs Group

| | Section | Group |
|---|---------|-------|
| **용도** | 페이지 영역 분할 | 논리적 묶음 |
| **부모** | Page | Section 또는 Group |
| **자식** | Group만 | Group, Primitives |
| **예시** | Header, Main, Sidebar | Form, Card, Toolbar |

---

## 5가지 Section Role

### 1. Container - 메인 컨텐츠

**용도**: 페이지의 주요 내용

```json
{
  "type": "Section",
  "role": "Container",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "role": "Title", "content": "Dashboard" },
        { "type": "Text", "role": "Body", "content": "Welcome back" }
      ]
    }
  ]
}
```

---

### 2. Header - 상단 고정

**용도**: 페이지 최상단 (로고, 네비게이션)

```json
{
  "type": "Section",
  "role": "Header",
  "density": "Compact",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "content": "Logo" },
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { "type": "Action", "label": "Home", "to": "/" },
            { "type": "Action", "label": "Profile", "to": "/profile" }
          ]
        }
      ]
    }
  ]
}
```

---

### 3. Footer - 하단 고정

**용도**: 페이지 최하단 (Copyright, 링크)

```json
{
  "type": "Section",
  "role": "Footer",
  "density": "Comfortable",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "content": "© 2025 Company", "align": "center" }
      ]
    }
  ]
}
```

---

### 4. Navigator - 네비게이션

**용도**: 사이드바, 탭바

```json
{
  "type": "Section",
  "role": "Navigator",
  "density": "Compact",
  "children": [
    {
      "type": "Group",
      "role": "List",
      "children": [
        { "type": "Action", "label": "Dashboard", "to": "/" },
        { "type": "Action", "label": "Users", "to": "/users" },
        { "type": "Action", "label": "Settings", "to": "/settings" }
      ]
    }
  ]
}
```

---

### 5. Aside - 보조 정보

**용도**: 사이드 패널 (필터, 정보)

```json
{
  "type": "Section",
  "role": "Aside",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "children": [
        { "type": "Text", "content": "Quick Info" },
        { "type": "Text", "content": "Additional details..." }
      ]
    }
  ]
}
```

---

## mode 전파

Section의 `mode`는 모든 하위 Field에 전파됩니다.

### mode="view" (읽기 전용)

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "view",              // ← 읽기 모드
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        {
          "type": "Field",
          "label": "Name",
          "model": "user.name",
          "dataType": "text"
          // mode 자동으로 "view"
        }
      ]
    }
  ]
}
```

**렌더링**:
```
Name: Teo  ← 일반 텍스트로 표시
```

---

### mode="edit" (편집 가능)

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "edit",              // ← 편집 모드
  "children": [
    {
      "type": "Group",
      "role": "Form",
      "children": [
        {
          "type": "Field",
          "label": "Name",
          "model": "user.name",
          "dataType": "text"
          // mode 자동으로 "edit"
        }
      ]
    }
  ]
}
```

**렌더링**:
```
Name: [___Teo___]  ← 입력 필드
```

---

### mode 오버라이드

개별 Field에서 mode를 오버라이드할 수 있습니다:

```json
{
  "type": "Section",
  "mode": "view",              // Section은 view
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        {
          "type": "Field",
          "label": "Name",
          "model": "user.name",
          "dataType": "text"
          // mode: "view" (상속)
        },
        {
          "type": "Field",
          "label": "Email",
          "model": "user.email",
          "dataType": "email",
          "modeOverride": "edit"  // ← 강제 편집 모드
        }
      ]
    }
  ]
}
```

**결과**:
```
Name: Teo              ← view (상속)
Email: [___teo@...___] ← edit (오버라이드)
```

---

## 레이아웃 패턴

### 패턴 1: 단일 컬럼

```json
{
  "type": "Page",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "children": [...]
    }
  ]
}
```

**레이아웃**:
```
┌─────────────┐
│   Main      │
│             │
└─────────────┘
```

---

### 패턴 2: Header + Main

```json
{
  "type": "Page",
  "children": [
    {
      "type": "Section",
      "role": "Header",
      "children": [...]
    },
    {
      "type": "Section",
      "role": "Container",
      "children": [...]
    }
  ]
}
```

**레이아웃**:
```
┌─────────────┐
│   Header    │
├─────────────┤
│   Main      │
│             │
└─────────────┘
```

---

### 패턴 3: Sidebar + Main

```json
{
  "type": "Page",
  "children": [
    {
      "type": "Section",
      "role": "Navigator",
      "children": [...]
    },
    {
      "type": "Section",
      "role": "Container",
      "children": [...]
    }
  ]
}
```

**레이아웃**:
```
┌────┬─────────┐
│ S  │  Main   │
│ i  │         │
│ d  │         │
│ e  │         │
└────┴─────────┘
```

---

### 패턴 4: Header + Sidebar + Main + Aside

```json
{
  "type": "Page",
  "children": [
    { "type": "Section", "role": "Header", "children": [...] },
    { "type": "Section", "role": "Navigator", "children": [...] },
    { "type": "Section", "role": "Container", "children": [...] },
    { "type": "Section", "role": "Aside", "children": [...] }
  ]
}
```

**레이아웃**:
```
┌────────────────────────┐
│       Header           │
├────┬───────────┬───────┤
│ S  │   Main    │ Aside │
│ i  │           │       │
│ d  │           │       │
│ e  │           │       │
└────┴───────────┴───────┘
```

---

## 실습 1: 프로필 상세 페이지

읽기 전용 프로필 페이지를 만드세요:

```
Name:  Teo           ← view 모드
Email: teo@...       ← view 모드
Phone: 010-...       ← view 모드
[Edit]               ← 버튼
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "view",          // ← 읽기 전용
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "children": [
        { "type": "Field", "label": "Name", "model": "user.name" },
        { "type": "Field", "label": "Email", "model": "user.email" },
        { "type": "Field", "label": "Phone", "model": "user.phone" },

        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            {
              "type": "Action",
              "label": "Edit",
              "intent": "Brand",
              "behavior": {
                "action": "navigate",
                "to": "/profile/edit"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

</details>

---

## 실습 2: 프로필 편집 페이지

편집 가능한 프로필 페이지를 만드세요:

```
Name:  [_______]     ← edit 모드
Email: [_______]     ← edit 모드
Phone: [_______]     ← edit 모드
[Save] [Cancel]      ← 버튼들
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "edit",          // ← 편집 모드
  "children": [
    {
      "type": "Group",
      "role": "Form",
      "children": [
        {
          "type": "Field",
          "label": "Name",
          "model": "user.name",
          "dataType": "text",
          "required": true
        },
        {
          "type": "Field",
          "label": "Email",
          "model": "user.email",
          "dataType": "email",
          "required": true
        },
        {
          "type": "Field",
          "label": "Phone",
          "model": "user.phone",
          "dataType": "phone"
        },

        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            {
              "type": "Action",
              "label": "Cancel",
              "prominence": "Secondary",
              "behavior": { "action": "navigate", "to": "/profile" }
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
  ]
}
```

</details>

---

## 핵심 정리

### Section role 선택

```
메인 영역 → Container
상단 고정 → Header
하단 고정 → Footer
사이드바 → Navigator
보조 패널 → Aside
```

### mode 전파

```
Section mode="view" → 모든 Field가 읽기 전용
Section mode="edit" → 모든 Field가 편집 가능
Field modeOverride → 개별 Field만 모드 변경
```

### 구조 규칙

```
Section은 Group만 자식으로 가질 수 있음
Section은 Page의 직접 자식
```

---

## 다음 단계

Section을 완벽히 이해했습니다!
이제 페이지 위에 떠 있는 **Overlay**를 배워봅시다.

**다음**: [Overlay (모달/드로어) →](./04-overlay.md)

---

**이전**: [← Group 컨테이너](./02-group.md)
**다음**: [Overlay →](./04-overlay.md)
