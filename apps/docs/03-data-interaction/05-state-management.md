# 상태 관리: Loading, Error, Empty 처리하기 ⏳

**예상 소요 시간**: 10분
**난이도**: ⭐⭐⭐ 중급
**사전 지식**: [Group](../02-structure/02-group.md)

---

## 이 문서를 읽고 나면

- Group의 state 속성을 이해합니다
- Loading, Empty, Error 상태를 처리할 수 있습니다
- 적절한 피드백 UI를 구성할 수 있습니다

---

## state란?

> **"데이터 로딩 상태를 선언적으로 관리"**

state는 **비동기 데이터**의 현재 상태를 나타냅니다.

```json
{
  "type": "Group",
  "role": "Table",
  "state": "loading",  // ← 로딩 중
  "children": [...]
}
```

---

## 4가지 state 값

### 1. idle - 정상 상태

**의미**: 데이터가 정상적으로 로드됨

```json
{
  "type": "Group",
  "role": "List",
  "state": "idle",  // ← 기본값
  "children": [
    { "type": "Text", "content": "Item 1" },
    { "type": "Text", "content": "Item 2" }
  ]
}
```

**렌더링**:
```
• Item 1
• Item 2
```

---

### 2. loading - 로딩 중

**의미**: 데이터를 불러오는 중

```json
{
  "type": "Group",
  "role": "Table",
  "state": "loading",
  "children": [...]
}
```

**렌더링**:
```
⏳ Loading...
  (스피너 표시)
```

---

### 3. empty - 데이터 없음

**의미**: 성공적으로 로드했지만 데이터가 0개

```json
{
  "type": "Group",
  "role": "List",
  "state": "empty",
  "emptyContent": {
    "type": "Group",
    "role": "Container",
    "children": [
      {
        "type": "Text",
        "role": "Body",
        "content": "No items found",
        "align": "center",
        "prominence": "Tertiary"
      },
      {
        "type": "Action",
        "label": "Create New",
        "prominence": "Primary",
        "intent": "Brand",
        "behavior": {
          "action": "navigate",
          "to": "/items/new"
        }
      }
    ]
  },
  "children": []
}
```

**렌더링**:
```
  No items found
  [Create New]
```

---

### 4. error - 에러 발생

**의미**: 데이터 로드 실패

```json
{
  "type": "Group",
  "role": "Table",
  "state": "error",
  "errorContent": {
    "type": "Group",
    "role": "Card",
    "intent": "Critical",
    "children": [
      {
        "type": "Text",
        "role": "Title",
        "content": "Failed to load data",
        "prominence": "Secondary"
      },
      {
        "type": "Text",
        "role": "Body",
        "content": "Please try again later.",
        "prominence": "Tertiary"
      },
      {
        "type": "Action",
        "label": "Retry",
        "prominence": "Secondary",
        "intent": "Critical",
        "behavior": {
          "action": "command",
          "endpoint": "/api/items",
          "method": "GET"
        }
      }
    ]
  },
  "children": []
}
```

**렌더링**:
```
┌───────────────────────┐
│ Failed to load data   │ ← 빨간 배경
│ Please try again later│
│ [Retry]               │
└───────────────────────┘
```

---

## emptyContent - 빈 상태 UI

### 기본 패턴

```json
{
  "type": "Group",
  "role": "List",
  "state": "empty",
  "emptyContent": {
    "type": "Group",
    "role": "Container",
    "children": [
      {
        "type": "Text",
        "content": "📭 No messages yet",
        "align": "center",
        "prominence": "Tertiary"
      }
    ]
  }
}
```

---

### 실용적인 emptyContent

```json
{
  "emptyContent": {
    "type": "Group",
    "role": "Container",
    "children": [
      // 아이콘/일러스트
      {
        "type": "Text",
        "role": "Title",
        "content": "📋",
        "align": "center",
        "prominence": "Hero"
      },

      // 메시지
      {
        "type": "Text",
        "role": "Body",
        "content": "No tasks yet",
        "align": "center",
        "prominence": "Secondary"
      },

      // 설명
      {
        "type": "Text",
        "role": "Caption",
        "content": "Create your first task to get started",
        "align": "center",
        "prominence": "Tertiary"
      },

      // CTA 버튼
      {
        "type": "Action",
        "label": "Create Task",
        "prominence": "Primary",
        "intent": "Brand",
        "behavior": {
          "action": "navigate",
          "to": "/tasks/new"
        }
      }
    ]
  }
}
```

---

## errorContent - 에러 상태 UI

### 기본 패턴

```json
{
  "type": "Group",
  "role": "Table",
  "state": "error",
  "errorContent": {
    "type": "Group",
    "role": "Card",
    "intent": "Critical",
    "children": [
      {
        "type": "Text",
        "content": "⚠️ Failed to load data",
        "prominence": "Secondary"
      },
      {
        "type": "Action",
        "label": "Retry",
        "prominence": "Secondary",
        "intent": "Critical",
        "behavior": {
          "action": "command",
          "endpoint": "/api/data",
          "method": "GET"
        }
      }
    ]
  }
}
```

---

### 상세한 errorContent

```json
{
  "errorContent": {
    "type": "Group",
    "role": "Card",
    "intent": "Critical",
    "children": [
      // 에러 제목
      {
        "type": "Text",
        "role": "Title",
        "content": "Something went wrong",
        "prominence": "Secondary"
      },

      // 에러 메시지
      {
        "type": "Text",
        "role": "Body",
        "model": "error.message",  // ← 서버에서 받은 에러 메시지
        "prominence": "Tertiary"
      },

      // 액션 버튼들
      {
        "type": "Group",
        "role": "Toolbar",
        "children": [
          {
            "type": "Action",
            "label": "Go Back",
            "prominence": "Secondary",
            "intent": "Neutral",
            "behavior": {
              "action": "navigate",
              "to": "/"
            }
          },
          {
            "type": "Action",
            "label": "Retry",
            "prominence": "Secondary",
            "intent": "Critical",
            "behavior": {
              "action": "command",
              "endpoint": "/api/data",
              "method": "GET"
            }
          }
        ]
      }
    ]
  }
}
```

---

## 실습 1: 사용자 목록 (모든 상태)

Loading → Empty → Error → Idle:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Table",
  "density": "Compact",
  "state": "idle",  // ← 동적으로 변경됨

  // 로딩 상태 (자동 처리)
  // state="loading" 시 스피너 표시

  // 빈 상태
  "emptyContent": {
    "type": "Group",
    "role": "Container",
    "children": [
      {
        "type": "Text",
        "role": "Title",
        "content": "👥",
        "align": "center",
        "prominence": "Hero"
      },
      {
        "type": "Text",
        "role": "Body",
        "content": "No users found",
        "align": "center",
        "prominence": "Secondary"
      },
      {
        "type": "Text",
        "role": "Caption",
        "content": "Try adjusting your filters or create a new user",
        "align": "center",
        "prominence": "Tertiary"
      },
      {
        "type": "Action",
        "label": "Create User",
        "prominence": "Primary",
        "intent": "Brand",
        "behavior": {
          "action": "navigate",
          "to": "/users/new"
        }
      }
    ]
  },

  // 에러 상태
  "errorContent": {
    "type": "Group",
    "role": "Card",
    "intent": "Critical",
    "children": [
      {
        "type": "Text",
        "role": "Title",
        "content": "Failed to load users",
        "prominence": "Secondary"
      },
      {
        "type": "Text",
        "role": "Body",
        "model": "error.message",
        "prominence": "Tertiary"
      },
      {
        "type": "Group",
        "role": "Toolbar",
        "children": [
          {
            "type": "Action",
            "label": "Retry",
            "prominence": "Secondary",
            "intent": "Critical",
            "behavior": {
              "action": "command",
              "endpoint": "/api/users",
              "method": "GET"
            }
          }
        ]
      }
    ]
  },

  // 정상 상태 (데이터)
  "children": [
    { "type": "Field", "label": "ID", "model": "item.id" },
    { "type": "Field", "label": "Name", "model": "item.name" },
    { "type": "Field", "label": "Email", "model": "item.email" },
    { "type": "Field", "label": "Status", "model": "item.status" }
  ]
}
```

</details>

---

## 실습 2: 대시보드 카드

통계 카드의 상태 관리:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Grid",
  "density": "Comfortable",
  "children": [
    // Revenue 카드
    {
      "type": "Group",
      "role": "Card",
      "state": "idle",
      "errorContent": {
        "type": "Group",
        "role": "Container",
        "children": [
          {
            "type": "Text",
            "content": "⚠️ Failed to load",
            "prominence": "Tertiary",
            "intent": "Critical"
          }
        ]
      },
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

    // Orders 카드
    {
      "type": "Group",
      "role": "Card",
      "state": "loading",  // ← 로딩 중
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

    // Customers 카드
    {
      "type": "Group",
      "role": "Card",
      "state": "idle",
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

### 실수 1: emptyContent 없음

```json
// ❌ Wrong: empty 상태인데 메시지 없음
{
  "type": "Group",
  "role": "List",
  "state": "empty",
  "children": []
  // 사용자는 빈 화면만 봄
}

// ✅ Correct: emptyContent 제공
{
  "state": "empty",
  "emptyContent": {
    "type": "Text",
    "content": "No items found",
    "align": "center"
  }
}
```

### 실수 2: errorContent에 Retry 없음

```json
// ❌ Wrong: 에러만 표시
{
  "errorContent": {
    "type": "Text",
    "content": "Error occurred"
  }
}

// ✅ Correct: Retry 버튼 제공
{
  "errorContent": {
    "type": "Group",
    "role": "Container",
    "children": [
      { "type": "Text", "content": "Error occurred" },
      {
        "type": "Action",
        "label": "Retry",
        "behavior": { "action": "command", ... }
      }
    ]
  }
}
```

### 실수 3: loading 상태를 수동으로 처리

```json
// ❌ Wrong: 수동으로 loading 처리
{
  "type": "Group",
  "children": [
    {
      "type": "Text",
      "content": "Loading...",
      "hidden": "!isLoading"
    },
    {
      "type": "Group",
      "hidden": "isLoading",
      "children": [...]  // 실제 데이터
    }
  ]
}

// ✅ Correct: state 사용
{
  "type": "Group",
  "state": "loading",  // ← 자동으로 스피너 표시
  "children": [...]
}
```

---

## 핵심 정리

### state 값

```
idle     → 정상 (기본값)
loading  → 로딩 중 (스피너 자동 표시)
empty    → 데이터 0개 (emptyContent 표시)
error    → 로드 실패 (errorContent 표시)
```

### emptyContent 구성

```
1. 아이콘/일러스트 (시각적 피드백)
2. 메시지 (현재 상태 설명)
3. 설명 (다음 액션 안내)
4. CTA 버튼 (해결 방법 제시)
```

### errorContent 구성

```
1. 에러 제목 (무엇이 실패했는지)
2. 에러 메시지 (왜 실패했는지)
3. Retry 버튼 (다시 시도)
4. 대안 버튼 (뒤로가기 등)
```

### Best Practice

```
✓ 모든 비동기 데이터에 state 관리
✓ emptyContent에 CTA 제공
✓ errorContent에 Retry 제공
✓ loading 상태는 자동 처리
✗ 수동으로 loading UI 구현 금지
```

---

## 축하합니다! 🎉

**Level 3 (데이터와 상호작용)** 완료!

이제 IDDL의 동적 기능을 모두 이해했습니다:
- ✅ Field dataType (21가지)
- ✅ Validation (constraints, errorMessages)
- ✅ Action behavior (7가지)
- ✅ Conditional rendering (condition, hidden)
- ✅ State management (loading, empty, error)

---

## 다음 단계

이론을 완벽히 이해했으니, 이제 **실전 패턴**을 배워봅시다!

**다음**: [Level 4: 실전 패턴 →](../04-patterns/01-crud-list.md)

**관련 문서**:
- [Group 컨테이너](../02-structure/02-group.md) - state 속성
- [Field 타입](./01-field-types.md) - 데이터 처리

---

**이전**: [← 조건부 렌더링](./04-conditional-rendering.md)
**다음**: [Level 4: CRUD 목록 →](../04-patterns/01-crud-list.md)
