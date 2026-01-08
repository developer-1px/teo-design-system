# Page: 완전한 화면 구성 📄

**예상 소요 시간**: 10분
**난이도**: ⭐⭐ 기초
**사전 지식**: [Overlay](./04-overlay.md)

---

## 이 문서를 읽고 나면

- Page의 역할을 이해합니다
- Page layout 템플릿을 활용할 수 있습니다
- 완전한 페이지를 처음부터 끝까지 작성할 수 있습니다

---

## Page란?

> **"IDDL의 루트 노드. 완전한 화면"**

Page는 **모든 것의 시작점**입니다. Section과 Overlay를 자식으로 가집니다.

```
Page (Root)
 ├─ Section (Header)
 ├─ Section (Navigator)
 ├─ Section (Container)
 └─ Overlay (Dialog)
```

---

## Page 기본 구조

```json
{
  "type": "Page",
  "title": "Dashboard",           // ← 브라우저 탭 제목
  "description": "User dashboard", // ← 메타 설명
  "layout": "sidebar",             // ← 레이아웃 템플릿
  "breadcrumbs": [                 // ← 경로 네비게이션
    { "label": "Home", "to": "/" },
    { "label": "Dashboard" }
  ],
  "children": [                    // ← Section + Overlay
    ...
  ]
}
```

---

## Layout 템플릿

### 1. single - 단일 컬럼

```json
{
  "type": "Page",
  "layout": "single",
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
│   Content   │
│             │
│             │
└─────────────┘
```

---

### 2. sidebar - 사이드바 + 메인

```json
{
  "type": "Page",
  "layout": "sidebar",
  "children": [
    {
      "type": "Section",
      "role": "Navigator",  // 사이드바
      "children": [...]
    },
    {
      "type": "Section",
      "role": "Container",  // 메인
      "children": [...]
    }
  ]
}
```

**레이아웃**:
```
┌────┬───────────┐
│ S  │   Main    │
│ i  │           │
│ d  │           │
│ e  │           │
└────┴───────────┘
```

---

### 3. dashboard - 그리드 대시보드

```json
{
  "type": "Page",
  "layout": "dashboard",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "children": [
        {
          "type": "Group",
          "role": "Grid",
          "children": [...]  // 카드들
        }
      ]
    }
  ]
}
```

**레이아웃**:
```
┌──────┬──────┬──────┐
│Card 1│Card 2│Card 3│
├──────┼──────┼──────┤
│Card 4│Card 5│Card 6│
└──────┴──────┴──────┘
```

---

### 4. split - 좌우 분할

```json
{
  "type": "Page",
  "layout": "split",
  "children": [
    {
      "type": "Section",
      "role": "Container",  // 왼쪽
      "children": [...]
    },
    {
      "type": "Section",
      "role": "Aside",      // 오른쪽
      "children": [...]
    }
  ]
}
```

**레이아웃**:
```
┌───────┬──────┐
│  Main │ Side │
│       │      │
│       │      │
└───────┴──────┘
```

---

### 5. wizard - 다단계 마법사

```json
{
  "type": "Page",
  "layout": "wizard",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "children": [
        {
          "type": "Group",
          "role": "Steps",
          "children": [...]  // 단계들
        }
      ]
    }
  ]
}
```

**레이아웃**:
```
┌─────────────────┐
│ ① ──→ ② ──→ ③   │ ← 진행 표시
├─────────────────┤
│ Step 1 Content  │
│                 │
└─────────────────┘
```

---

## Breadcrumbs (경로 네비게이션)

```json
{
  "type": "Page",
  "title": "Edit User",
  "breadcrumbs": [
    { "label": "Home", "to": "/" },
    { "label": "Users", "to": "/users" },
    { "label": "Teo", "to": "/users/123" },
    { "label": "Edit" }  // 마지막은 링크 없음
  ],
  "children": [...]
}
```

**렌더링**:
```
Home > Users > Teo > Edit
```

---

## 실습 1: 사용자 목록 페이지

완전한 사용자 목록 페이지를 만드세요:
- 사이드바 레이아웃
- 검색 + 신규 버튼
- 데이터 테이블

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Page",
  "title": "Users",
  "layout": "sidebar",
  "breadcrumbs": [
    { "label": "Home", "to": "/" },
    { "label": "Users" }
  ],
  "children": [
    // 사이드바
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
    },

    // 메인 영역
    {
      "type": "Section",
      "role": "Container",
      "children": [
        // 헤더
        {
          "type": "Group",
          "role": "Container",
          "children": [
            {
              "type": "Text",
              "role": "Title",
              "content": "Users",
              "prominence": "Hero"
            },
            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                {
                  "type": "Field",
                  "label": "Search",
                  "model": "filters.search",
                  "dataType": "text",
                  "placeholder": "Search users..."
                },
                {
                  "type": "Action",
                  "label": "New User",
                  "prominence": "Primary",
                  "intent": "Brand",
                  "behavior": {
                    "action": "navigate",
                    "to": "/users/new"
                  }
                }
              ]
            }
          ]
        },

        // 테이블
        {
          "type": "Group",
          "role": "Table",
          "density": "Compact",
          "children": [
            { "type": "Field", "label": "ID", "model": "item.id" },
            { "type": "Field", "label": "Name", "model": "item.name" },
            { "type": "Field", "label": "Email", "model": "item.email" },
            { "type": "Field", "label": "Status", "model": "item.status" }
          ]
        }
      ]
    }
  ]
}
```

</details>

---

## 실습 2: 대시보드

그리드 레이아웃의 대시보드를 만드세요:

<details>
<summary>정답 보기</summary>

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
          "type": "Text",
          "role": "Title",
          "content": "Dashboard",
          "prominence": "Hero"
        },

        {
          "type": "Group",
          "role": "Grid",
          "children": [
            // 통계 카드 1
            {
              "type": "Group",
              "role": "Card",
              "intent": "Positive",
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

            // 통계 카드 2
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

            // 통계 카드 3
            {
              "type": "Group",
              "role": "Card",
              "intent": "Caution",
              "children": [
                {
                  "type": "Field",
                  "model": "stats.pending",
                  "dataType": "number",
                  "prominence": "Hero"
                },
                {
                  "type": "Text",
                  "content": "Pending",
                  "prominence": "Tertiary"
                }
              ]
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

### Page 구조

```
Page
 ├─ title         (브라우저 제목)
 ├─ description   (메타 설명)
 ├─ layout        (레이아웃 템플릿)
 ├─ breadcrumbs   (경로 네비게이션)
 └─ children      (Section + Overlay)
```

### Layout 선택

```
단일 페이지 → single
사이드바 앱 → sidebar
대시보드 → dashboard
비교 뷰 → split
온보딩 → wizard
```

---

## 축하합니다! 🎉

**Level 2 (구조 이해하기)** 완료!

이제 IDDL의 모든 노드 타입을 완벽히 이해했습니다:
- ✅ Primitives (Text, Field, Action)
- ✅ Group (12가지 role)
- ✅ Section (5가지 role)
- ✅ Overlay (7가지 role)
- ✅ Page (5가지 layout)

---

## 다음 단계

구조를 완벽히 이해했으니, 이제 **데이터와 상호작용**을 깊이 파봅시다!

**다음**: [Level 3: 데이터와 상호작용 →](../03-data-interaction/01-field-types.md)

**관련 문서**:
- [실전 패턴](../04-patterns/) (Level 4) - 자주 쓰는 페이지 패턴
- [API 레퍼런스](../06-reference/api-reference.md) - 전체 스펙

---

**이전**: [← Overlay](./04-overlay.md)
**다음**: [Level 3: Field 타입 →](../03-data-interaction/01-field-types.md)
