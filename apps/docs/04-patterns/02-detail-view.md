# 상세 페이지: 완벽한 Detail View 만들기 📄

**예상 소요 시간**: 15분
**난이도**: ⭐⭐⭐⭐ 고급
**사전 지식**: [Section](../02-structure/03-section.md), [조건부 렌더링](../03-data-interaction/04-conditional-rendering.md)

---

## 이 문서를 읽고 나면

- 완전한 상세 페이지를 구성할 수 있습니다
- 읽기/편집 모드 전환을 구현할 수 있습니다
- 탭 기반 정보 구성을 활용할 수 있습니다

---

## 상세 페이지란?

> **"단일 엔티티의 모든 정보를 보여주는 페이지"**

사용자 프로필, 제품 상세, 주문 내역 등에서 사용됩니다.

**필수 구성 요소**:
```
1. 헤더 (제목 + 액션 버튼)
2. 기본 정보 섹션
3. 관련 데이터 섹션
4. 액션 버튼 (편집, 삭제, 뒤로가기)
```

---

## 기본 구조

### 레이아웃

```
┌───────────────────────────────────┐
│ Teo          [Edit] [Delete]      │ ← 헤더
├───────────────────────────────────┤
│ ┌──────────────── Card ─────────┐ │
│ │ Email:  teo@example.com       │ │ ← 기본 정보
│ │ Phone:  010-1234-5678         │ │
│ │ Status: Active                │ │
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ [Profile] [Orders] [Activity]     │ ← 탭
├───────────────────────────────────┤
│ Tab Content...                    │
└───────────────────────────────────┘
```

---

## 완전한 예시: 사용자 상세

```json
{
  "type": "Page",
  "title": "User Detail",
  "layout": "single",
  "breadcrumbs": [
    { "label": "Home", "to": "/" },
    { "label": "Users", "to": "/users" },
    { "label": "Teo" }
  ],
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "view",  // ← 읽기 전용
      "density": "Standard",
      "children": [
        // === 1. 헤더 ===
        {
          "type": "Group",
          "role": "Container",
          "children": [
            // 이름
            {
              "type": "Field",
              "model": "user.name",
              "dataType": "text",
              "prominence": "Hero"
            },

            // 액션 버튼들
            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                // 뒤로가기
                {
                  "type": "Action",
                  "label": "Back",
                  "prominence": "Tertiary",
                  "intent": "Neutral",
                  "behavior": {
                    "action": "navigate",
                    "to": "/users"
                  }
                },

                // 편집
                {
                  "type": "Action",
                  "label": "Edit",
                  "prominence": "Secondary",
                  "intent": "Brand",
                  "behavior": {
                    "action": "navigate",
                    "to": "/users/{id}/edit",
                    "params": {
                      "id": "user.id"
                    }
                  }
                },

                // 삭제
                {
                  "type": "Action",
                  "label": "Delete",
                  "prominence": "Secondary",
                  "intent": "Critical",
                  "confirm": "Delete this user? This action cannot be undone.",
                  "behavior": {
                    "action": "command",
                    "endpoint": "/api/users/{id}",
                    "method": "DELETE",
                    "params": {
                      "id": "user.id"
                    },
                    "onSuccess": {
                      "action": "navigate",
                      "to": "/users"
                    }
                  }
                }
              ]
            }
          ]
        },

        // === 2. 기본 정보 카드 ===
        {
          "type": "Group",
          "role": "Card",
          "children": [
            {
              "type": "Text",
              "role": "Title",
              "content": "Basic Information",
              "prominence": "Secondary"
            },

            // 필드들 (2열 그리드)
            {
              "type": "Group",
              "role": "Grid",
              "children": [
                {
                  "type": "Field",
                  "label": "Email",
                  "model": "user.email",
                  "dataType": "email"
                },
                {
                  "type": "Field",
                  "label": "Phone",
                  "model": "user.phone",
                  "dataType": "phone"
                },
                {
                  "type": "Field",
                  "label": "Birth Date",
                  "model": "user.birthDate",
                  "dataType": "date"
                },

                // 상태 (조건부 스타일)
                {
                  "type": "Text",
                  "role": "Label",
                  "label": "Status",
                  "model": "user.status",
                  "condition": {
                    "if": "user.status === 'active'",
                    "then": {
                      "content": "✓ Active",
                      "intent": "Positive"
                    },
                    "else": {
                      "content": "○ Inactive",
                      "intent": "Neutral"
                    }
                  }
                }
              ]
            }
          ]
        },

        // === 3. 추가 정보 카드 ===
        {
          "type": "Group",
          "role": "Card",
          "children": [
            {
              "type": "Text",
              "role": "Title",
              "content": "Additional Information",
              "prominence": "Secondary"
            },

            {
              "type": "Field",
              "label": "Bio",
              "model": "user.bio",
              "dataType": "textarea"
            },

            {
              "type": "Field",
              "label": "Website",
              "model": "user.website",
              "dataType": "url"
            },

            {
              "type": "Field",
              "label": "Tags",
              "model": "user.tags",
              "dataType": "multiselect"
            }
          ]
        },

        // === 4. 메타 정보 ===
        {
          "type": "Group",
          "role": "Container",
          "density": "Compact",
          "children": [
            {
              "type": "Text",
              "role": "Caption",
              "content": "Created: {date}",
              "model": "user.createdAt",
              "prominence": "Tertiary"
            },
            {
              "type": "Text",
              "role": "Caption",
              "content": "Last Updated: {date}",
              "model": "user.updatedAt",
              "prominence": "Tertiary"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 패턴: 읽기/편집 토글

같은 페이지에서 모드 전환:

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "view",  // ← 동적으로 변경
  "condition": {
    "if": "isEditing",
    "then": {
      "mode": "edit"
    }
  },
  "children": [
    // 헤더
    {
      "type": "Group",
      "role": "Container",
      "children": [
        {
          "type": "Field",
          "model": "user.name",
          "prominence": "Hero"
        },

        // 모드에 따라 다른 버튼
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            // 읽기 모드 → 편집 버튼
            {
              "type": "Action",
              "label": "Edit",
              "prominence": "Primary",
              "intent": "Brand",
              "hidden": "isEditing",
              "behavior": {
                "action": "command",
                "command": "setEditing",
                "args": { "value": true }
              }
            },

            // 편집 모드 → 저장/취소 버튼
            {
              "type": "Action",
              "label": "Cancel",
              "prominence": "Secondary",
              "intent": "Neutral",
              "hidden": "!isEditing",
              "behavior": {
                "action": "command",
                "command": "setEditing",
                "args": { "value": false }
              }
            },
            {
              "type": "Action",
              "label": "Save",
              "prominence": "Primary",
              "intent": "Positive",
              "hidden": "!isEditing",
              "behavior": {
                "action": "submit",
                "endpoint": "/api/users/{id}",
                "method": "PATCH",
                "onSuccess": {
                  "action": "command",
                  "command": "setEditing",
                  "args": { "value": false }
                }
              }
            }
          ]
        }
      ]
    },

    // 폼 필드들 (mode에 따라 자동 전환)
    {
      "type": "Group",
      "role": "Card",
      "children": [
        {
          "type": "Field",
          "label": "Email",
          "model": "user.email",
          "dataType": "email"
        },
        {
          "type": "Field",
          "label": "Phone",
          "model": "user.phone",
          "dataType": "phone"
        }
      ]
    }
  ]
}
```

---

## 패턴: 탭 기반 정보

관련 데이터를 탭으로 구분:

```json
{
  "type": "Page",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "children": [
        // 헤더 (위와 동일)
        { ... },

        // 기본 정보 (위와 동일)
        { ... },

        // === 탭 ===
        {
          "type": "Group",
          "role": "Tabs",
          "children": [
            // 탭 1: 프로필
            {
              "type": "Group",
              "id": "tab-profile",
              "label": "Profile",
              "children": [
                {
                  "type": "Group",
                  "role": "Card",
                  "children": [
                    { "type": "Field", "label": "Bio", "model": "user.bio" },
                    { "type": "Field", "label": "Website", "model": "user.website" }
                  ]
                }
              ]
            },

            // 탭 2: 주문 내역
            {
              "type": "Group",
              "id": "tab-orders",
              "label": "Orders",
              "children": [
                {
                  "type": "Group",
                  "role": "Table",
                  "state": "idle",
                  "children": [
                    { "type": "Field", "label": "Order ID", "model": "item.id" },
                    { "type": "Field", "label": "Date", "model": "item.createdAt", "dataType": "date" },
                    { "type": "Field", "label": "Total", "model": "item.total", "dataType": "currency" },
                    {
                      "type": "Action",
                      "label": "View",
                      "prominence": "Tertiary",
                      "behavior": {
                        "action": "navigate",
                        "to": "/orders/{id}",
                        "params": { "id": "item.id" }
                      }
                    }
                  ]
                }
              ]
            },

            // 탭 3: 활동 로그
            {
              "type": "Group",
              "id": "tab-activity",
              "label": "Activity",
              "children": [
                {
                  "type": "Group",
                  "role": "List",
                  "density": "Comfortable",
                  "children": [
                    {
                      "type": "Group",
                      "role": "Container",
                      "children": [
                        {
                          "type": "Text",
                          "role": "Body",
                          "model": "item.action",
                          "prominence": "Secondary"
                        },
                        {
                          "type": "Text",
                          "role": "Caption",
                          "model": "item.timestamp",
                          "dataType": "datetime",
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
      ]
    }
  ]
}
```

---

## 패턴: Split Layout (2열)

메인 정보 + 보조 정보:

```json
{
  "type": "Page",
  "layout": "split",
  "children": [
    // 왼쪽: 메인 정보
    {
      "type": "Section",
      "role": "Container",
      "mode": "view",
      "children": [
        // 헤더
        { ... },

        // 기본 정보
        {
          "type": "Group",
          "role": "Card",
          "children": [
            { "type": "Field", "label": "Email", "model": "user.email" },
            { "type": "Field", "label": "Phone", "model": "user.phone" },
            { "type": "Field", "label": "Bio", "model": "user.bio" }
          ]
        }
      ]
    },

    // 오른쪽: 보조 정보
    {
      "type": "Section",
      "role": "Aside",
      "density": "Compact",
      "children": [
        // 통계 카드
        {
          "type": "Group",
          "role": "Card",
          "children": [
            {
              "type": "Text",
              "role": "Title",
              "content": "Statistics",
              "prominence": "Secondary"
            },
            {
              "type": "Field",
              "label": "Total Orders",
              "model": "stats.totalOrders",
              "dataType": "number"
            },
            {
              "type": "Field",
              "label": "Total Spent",
              "model": "stats.totalSpent",
              "dataType": "currency"
            }
          ]
        },

        // 최근 활동
        {
          "type": "Group",
          "role": "Card",
          "children": [
            {
              "type": "Text",
              "role": "Title",
              "content": "Recent Activity",
              "prominence": "Secondary"
            },
            {
              "type": "Group",
              "role": "List",
              "density": "Compact",
              "children": [
                {
                  "type": "Text",
                  "role": "Caption",
                  "model": "item.action",
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

---

## 패턴: 관련 엔티티

1:N 관계 표시:

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Posts by this user",
      "prominence": "Secondary"
    },

    // 테이블
    {
      "type": "Group",
      "role": "Table",
      "density": "Compact",
      "state": "idle",
      "emptyContent": {
        "type": "Text",
        "content": "No posts yet",
        "align": "center",
        "prominence": "Tertiary"
      },
      "children": [
        {
          "type": "Field",
          "label": "Title",
          "model": "item.title"
        },
        {
          "type": "Field",
          "label": "Published",
          "model": "item.publishedAt",
          "dataType": "date"
        },
        {
          "type": "Action",
          "label": "View",
          "prominence": "Tertiary",
          "behavior": {
            "action": "navigate",
            "to": "/posts/{id}",
            "params": { "id": "item.id" }
          }
        }
      ]
    },

    // 더보기 버튼
    {
      "type": "Action",
      "label": "View All Posts",
      "prominence": "Tertiary",
      "intent": "Brand",
      "behavior": {
        "action": "navigate",
        "to": "/posts?userId={id}",
        "params": { "id": "user.id" }
      }
    }
  ]
}
```

---

## 핵심 정리

### 필수 구성 요소

```
1. 헤더 (제목 + 액션 버튼)
2. 기본 정보 카드
3. 추가 정보 섹션
4. 관련 데이터 (탭 또는 카드)
5. 메타 정보 (생성일, 수정일)
```

### mode 활용

```
읽기 전용 → mode="view"
편집 가능 → mode="edit"
토글 → condition으로 동적 전환
```

### 레이아웃 선택

```
단순 → layout="single"
보조 정보 많음 → layout="split"
관련 데이터 많음 → Tabs 사용
```

### 액션 버튼 배치

```
뒤로가기 → 헤더 왼쪽 (Tertiary)
편집 → 헤더 오른쪽 (Secondary + Brand)
삭제 → 헤더 오른쪽 (Secondary + Critical)
```

### Best Practice

```
✓ 필드는 Card로 그룹화
✓ 2열 그리드로 공간 활용
✓ 관련 데이터는 탭으로
✓ 삭제는 반드시 confirm
✓ 메타 정보는 하단에 작게
```

---

## 다음 단계

상세 페이지 패턴을 완벽히 이해했습니다!
이제 **폼 패턴**을 배워봅시다.

**다음**: [폼 패턴 →](./03-form-patterns.md)

---

**이전**: [← CRUD 목록](./01-crud-list.md)
**다음**: [폼 패턴 →](./03-form-patterns.md)
