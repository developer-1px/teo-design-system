# CRUD 목록: 완벽한 리스트 페이지 만들기 📋

**예상 소요 시간**: 18분
**난이도**: ⭐⭐⭐⭐ 고급
**사전 지식**: [Page](../02-structure/05-page.md), [상태 관리](../03-data-interaction/05-state-management.md)

---

## 이 문서를 읽고 나면

- 완전한 CRUD 목록 페이지를 구성할 수 있습니다
- 검색, 필터, 정렬 UI를 올바르게 배치할 수 있습니다
- 대량 액션 패턴을 구현할 수 있습니다

---

## CRUD 목록이란?

> **"Create, Read, Update, Delete를 위한 데이터 목록 페이지"**

대부분의 관리 시스템에서 가장 많이 쓰이는 패턴입니다.

**필수 구성 요소**:
```
1. 헤더 (제목 + 신규 버튼)
2. 검색/필터 바
3. 데이터 테이블
4. 페이지네이션
5. 상태 관리 (loading, empty, error)
```

---

## 기본 구조

### 레이아웃

```
┌─────────────────────────────────┐
│ Users              [New User]   │ ← 헤더
├─────────────────────────────────┤
│ [Search] [Filter] [Sort]        │ ← 필터 바
├─────────────────────────────────┤
│ ┌─────┬────────┬────────┬─────┐│
│ │ ID  │ Name   │ Email  │ ... ││ ← 테이블
│ ├─────┼────────┼────────┼─────┤│
│ │ 001 │ Teo    │ teo@...│ ... ││
│ └─────┴────────┴────────┴─────┘│
├─────────────────────────────────┤
│ « 1 2 3 4 5 »                   │ ← 페이지네이션
└─────────────────────────────────┘
```

---

## 완전한 예시: 사용자 목록

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
    // 사이드바 (Navigator)
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

    // 메인 영역 (Container)
    {
      "type": "Section",
      "role": "Container",
      "density": "Standard",
      "children": [
        // === 1. 헤더 ===
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
        },

        // === 2. 필터 바 ===
        {
          "type": "Group",
          "role": "Toolbar",
          "density": "Compact",
          "children": [
            // 검색
            {
              "type": "Field",
              "label": "Search",
              "model": "filters.search",
              "dataType": "text",
              "placeholder": "Search users..."
            },

            // 상태 필터
            {
              "type": "Field",
              "label": "Status",
              "model": "filters.status",
              "dataType": "select",
              "options": [
                { "value": "all", "label": "All" },
                { "value": "active", "label": "Active" },
                { "value": "inactive", "label": "Inactive" }
              ]
            },

            // 정렬
            {
              "type": "Field",
              "label": "Sort by",
              "model": "filters.sortBy",
              "dataType": "select",
              "options": [
                { "value": "name", "label": "Name" },
                { "value": "email", "label": "Email" },
                { "value": "createdAt", "label": "Created Date" }
              ]
            },

            // 초기화 버튼
            {
              "type": "Action",
              "label": "Reset",
              "prominence": "Tertiary",
              "intent": "Neutral",
              "behavior": {
                "action": "reset"
              }
            }
          ]
        },

        // === 3. 데이터 테이블 ===
        {
          "type": "Group",
          "role": "Table",
          "density": "Compact",
          "state": "idle",

          // 로딩 상태 (자동 처리)

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
          },

          // 테이블 컬럼
          "children": [
            // ID
            {
              "type": "Field",
              "label": "ID",
              "model": "item.id",
              "dataType": "text"
            },

            // 이름
            {
              "type": "Field",
              "label": "Name",
              "model": "item.name",
              "dataType": "text"
            },

            // 이메일
            {
              "type": "Field",
              "label": "Email",
              "model": "item.email",
              "dataType": "email"
            },

            // 상태 (조건부 스타일)
            {
              "type": "Text",
              "role": "Label",
              "model": "item.status",
              "condition": {
                "if": "item.status === 'active'",
                "then": {
                  "content": "Active",
                  "intent": "Positive"
                },
                "else": {
                  "content": "Inactive",
                  "intent": "Neutral"
                }
              }
            },

            // 생성일
            {
              "type": "Field",
              "label": "Created",
              "model": "item.createdAt",
              "dataType": "date"
            },

            // 액션
            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                // 상세보기
                {
                  "type": "Action",
                  "label": "View",
                  "prominence": "Tertiary",
                  "intent": "Brand",
                  "behavior": {
                    "action": "navigate",
                    "to": "/users/{id}",
                    "params": {
                      "id": "item.id"
                    }
                  }
                },

                // 편집
                {
                  "type": "Action",
                  "label": "Edit",
                  "prominence": "Tertiary",
                  "intent": "Neutral",
                  "behavior": {
                    "action": "navigate",
                    "to": "/users/{id}/edit",
                    "params": {
                      "id": "item.id"
                    }
                  }
                },

                // 삭제
                {
                  "type": "Action",
                  "label": "Delete",
                  "prominence": "Tertiary",
                  "intent": "Critical",
                  "confirm": "Delete this user? This action cannot be undone.",
                  "behavior": {
                    "action": "command",
                    "endpoint": "/api/users/{id}",
                    "method": "DELETE",
                    "params": {
                      "id": "item.id"
                    },
                    "onSuccess": {
                      "action": "command",
                      "endpoint": "/api/users",
                      "method": "GET"
                    }
                  }
                }
              ]
            }
          ]
        },

        // === 4. 페이지네이션 ===
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            {
              "type": "Text",
              "role": "Caption",
              "content": "Showing {start}-{end} of {total}",
              "prominence": "Tertiary"
            },

            {
              "type": "Action",
              "label": "Previous",
              "prominence": "Tertiary",
              "hidden": "pagination.page === 1",
              "behavior": {
                "action": "command",
                "endpoint": "/api/users?page={page}",
                "params": {
                  "page": "pagination.page - 1"
                }
              }
            },

            {
              "type": "Action",
              "label": "Next",
              "prominence": "Tertiary",
              "hidden": "pagination.page === pagination.totalPages",
              "behavior": {
                "action": "command",
                "endpoint": "/api/users?page={page}",
                "params": {
                  "page": "pagination.page + 1"
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 패턴: 대량 액션 (Bulk Actions)

여러 항목을 선택하여 일괄 처리:

```json
{
  "type": "Group",
  "role": "Table",
  "children": [
    // 체크박스 컬럼
    {
      "type": "Field",
      "label": "",
      "model": "item.selected",
      "dataType": "boolean"
    },

    // 나머지 컬럼들
    { "type": "Field", "label": "Name", "model": "item.name" },
    { "type": "Field", "label": "Email", "model": "item.email" }
  ]
}

// 대량 액션 바 (선택된 항목이 있을 때만 표시)
{
  "type": "Group",
  "role": "Toolbar",
  "intent": "Info",
  "hidden": "selectedItems.length === 0",
  "children": [
    {
      "type": "Text",
      "content": "{count} items selected",
      "prominence": "Secondary"
    },

    {
      "type": "Action",
      "label": "Delete Selected",
      "prominence": "Secondary",
      "intent": "Critical",
      "confirm": "Delete {count} users?",
      "behavior": {
        "action": "command",
        "endpoint": "/api/users/bulk-delete",
        "method": "POST",
        "body": {
          "ids": "selectedItems"
        }
      }
    },

    {
      "type": "Action",
      "label": "Export Selected",
      "prominence": "Tertiary",
      "behavior": {
        "action": "command",
        "endpoint": "/api/users/export",
        "method": "POST",
        "body": {
          "ids": "selectedItems"
        }
      }
    }
  ]
}
```

---

## 패턴: 인라인 편집

테이블에서 바로 수정:

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "view",  // ← 기본은 view
  "children": [
    {
      "type": "Group",
      "role": "Table",
      "children": [
        // 편집 가능한 필드
        {
          "type": "Field",
          "label": "Name",
          "model": "item.name",
          "dataType": "text",
          "modeOverride": "edit"  // ← 이 필드만 edit 모드
        },

        // 읽기 전용 필드
        {
          "type": "Field",
          "label": "Email",
          "model": "item.email",
          "dataType": "email"
          // mode="view" (상속)
        },

        // 저장 버튼
        {
          "type": "Action",
          "label": "Save",
          "prominence": "Tertiary",
          "intent": "Positive",
          "behavior": {
            "action": "command",
            "endpoint": "/api/users/{id}",
            "method": "PATCH",
            "params": {
              "id": "item.id"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 패턴: 필터 드로어

복잡한 필터는 드로어로:

```json
{
  "type": "Page",
  "children": [
    // 필터 열기 버튼
    {
      "type": "Action",
      "label": "Filters",
      "icon": "filter",
      "prominence": "Secondary",
      "behavior": {
        "action": "open",
        "overlay": "filter-drawer"
      }
    },

    // 필터 드로어
    {
      "type": "Overlay",
      "id": "filter-drawer",
      "role": "Drawer",
      "placement": "right",
      "dismissable": true,
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            { "type": "Text", "role": "Title", "content": "Filters" },

            {
              "type": "Field",
              "label": "Status",
              "model": "filters.status",
              "dataType": "checkbox",
              "options": [
                { "value": "active", "label": "Active" },
                { "value": "inactive", "label": "Inactive" },
                { "value": "banned", "label": "Banned" }
              ]
            },

            {
              "type": "Field",
              "label": "Created Date",
              "model": "filters.createdAt",
              "dataType": "date"
            },

            {
              "type": "Field",
              "label": "Role",
              "model": "filters.role",
              "dataType": "multiselect",
              "options": [
                { "value": "admin", "label": "Admin" },
                { "value": "user", "label": "User" },
                { "value": "moderator", "label": "Moderator" }
              ]
            },

            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                {
                  "type": "Action",
                  "label": "Reset",
                  "prominence": "Secondary",
                  "behavior": {
                    "action": "reset"
                  }
                },
                {
                  "type": "Action",
                  "label": "Apply",
                  "prominence": "Primary",
                  "intent": "Brand",
                  "behavior": {
                    "action": "submit",
                    "onSuccess": {
                      "action": "close"
                    }
                  }
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

## 핵심 정리

### 필수 구성 요소

```
1. 헤더 (제목 + 신규 버튼)
2. 필터 바 (검색, 필터, 정렬)
3. 데이터 테이블
4. 페이지네이션
5. 상태 관리 (loading, empty, error)
```

### 액션 버튼 배치

```
행 단위 액션 → 테이블 각 행
대량 액션 → 테이블 상단
신규 생성 → 페이지 헤더 (우상단)
```

### 상태별 UI

```
loading → 자동 스피너
empty → 친절한 메시지 + CTA
error → 에러 메시지 + Retry
```

### Best Practice

```
✓ 신규 버튼은 Primary + Brand
✓ 검색은 Toolbar에 inline으로
✓ 복잡한 필터는 Drawer로
✓ 삭제는 반드시 confirm
✓ 테이블은 density="Compact"
```

---

## 다음 단계

CRUD 목록 패턴을 완벽히 이해했습니다!
이제 **상세 페이지** 패턴을 배워봅시다.

**다음**: [상세 페이지 →](./02-detail-view.md)

---

**이전**: [← 상태 관리](../03-data-interaction/05-state-management.md)
**다음**: [상세 페이지 →](./02-detail-view.md)
