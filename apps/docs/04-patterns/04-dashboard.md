# 대시보드: 한눈에 보는 정보 대시보드 📊

**예상 소요 시간**: 14분
**난이도**: ⭐⭐⭐⭐ 고급
**사전 지식**: [Page](../02-structure/05-page.md), [상태 관리](../03-data-interaction/05-state-management.md)

---

## 이 문서를 읽고 나면

- 완전한 대시보드 페이지를 구성할 수 있습니다
- 통계 카드와 그리드 레이아웃을 활용할 수 있습니다
- 실시간 데이터 업데이트를 구현할 수 있습니다

---

## 대시보드란?

> **"핵심 지표와 정보를 한눈에 보여주는 페이지"**

관리자 화면, 분석 툴, SaaS 앱의 메인 화면에서 사용됩니다.

**필수 구성 요소**:
```
1. 헤더 (제목 + 기간 선택)
2. 통계 카드 (KPI)
3. 차트/그래프
4. 최근 활동 목록
5. 빠른 액션 버튼
```

---

## 기본 구조

### 레이아웃

```
┌───────────────────────────────────┐
│ Dashboard    [Last 7 days ▼]      │ ← 헤더
├───────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │Revenue │ │Orders  │ │Users   │ │ ← 통계 카드
│ │$12,345 │ │ 234    │ │ 1,023  │ │
│ └────────┘ └────────┘ └────────┘ │
├───────────────────────────────────┤
│ ┌─────────── Chart ─────────────┐ │
│ │   📈 Sales Overview          │ │ ← 차트
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ ┌───────── Recent Orders ──────┐ │
│ │ Order #123    $45.00         │ │ ← 최근 활동
│ │ Order #124    $78.50         │ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

---

## 완전한 예시: 관리자 대시보드

```json
{
  "type": "Page",
  "title": "Dashboard",
  "layout": "dashboard",
  "breadcrumbs": [
    { "label": "Home", "to": "/" },
    { "label": "Dashboard" }
  ],
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "density": "Comfortable",
      "children": [
        // === 1. 헤더 ===
        {
          "type": "Group",
          "role": "Container",
          "children": [
            {
              "type": "Text",
              "role": "Title",
              "content": "Dashboard",
              "prominence": "Hero"
            },

            // 기간 선택
            {
              "type": "Field",
              "label": "Period",
              "model": "filters.period",
              "dataType": "select",
              "options": [
                { "value": "7d", "label": "Last 7 days" },
                { "value": "30d", "label": "Last 30 days" },
                { "value": "90d", "label": "Last 90 days" },
                { "value": "1y", "label": "Last year" }
              ]
            }
          ]
        },

        // === 2. 통계 카드 (Grid) ===
        {
          "type": "Group",
          "role": "Grid",
          "density": "Comfortable",
          "children": [
            // 카드 1: Revenue
            {
              "type": "Group",
              "role": "Card",
              "intent": "Positive",
              "state": "idle",
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
                },

                // 변화율
                {
                  "type": "Text",
                  "role": "Label",
                  "model": "stats.revenueChange",
                  "condition": {
                    "if": "stats.revenueChange > 0",
                    "then": {
                      "content": "↑ +{value}%",
                      "intent": "Positive"
                    },
                    "else": {
                      "content": "↓ {value}%",
                      "intent": "Critical"
                    }
                  }
                }
              ]
            },

            // 카드 2: Orders
            {
              "type": "Group",
              "role": "Card",
              "intent": "Info",
              "state": "idle",
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
                },
                {
                  "type": "Text",
                  "role": "Label",
                  "content": "↑ +12%",
                  "intent": "Positive"
                }
              ]
            },

            // 카드 3: Customers
            {
              "type": "Group",
              "role": "Card",
              "intent": "Brand",
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
                },
                {
                  "type": "Text",
                  "role": "Label",
                  "content": "↑ +8%",
                  "intent": "Positive"
                }
              ]
            },

            // 카드 4: Pending
            {
              "type": "Group",
              "role": "Card",
              "intent": "Caution",
              "state": "idle",
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
                },
                {
                  "type": "Action",
                  "label": "Review",
                  "prominence": "Tertiary",
                  "intent": "Caution",
                  "behavior": {
                    "action": "navigate",
                    "to": "/orders?status=pending"
                  }
                }
              ]
            }
          ]
        },

        // === 3. 차트 섹션 ===
        {
          "type": "Group",
          "role": "Card",
          "state": "idle",
          "children": [
            {
              "type": "Text",
              "role": "Title",
              "content": "Sales Overview",
              "prominence": "Secondary"
            },

            // 차트 (외부 라이브러리)
            {
              "type": "Group",
              "role": "Container",
              "children": [
                {
                  "type": "Field",
                  "model": "charts.sales",
                  "dataType": "chart",
                  "chartType": "line"
                }
              ]
            }
          ]
        },

        // === 4. 2열 레이아웃 (최근 주문 + 최근 고객) ===
        {
          "type": "Group",
          "role": "Grid",
          "children": [
            // 최근 주문
            {
              "type": "Group",
              "role": "Card",
              "children": [
                {
                  "type": "Group",
                  "role": "Container",
                  "children": [
                    {
                      "type": "Text",
                      "role": "Title",
                      "content": "Recent Orders",
                      "prominence": "Secondary"
                    },
                    {
                      "type": "Action",
                      "label": "View All",
                      "prominence": "Tertiary",
                      "intent": "Brand",
                      "behavior": {
                        "action": "navigate",
                        "to": "/orders"
                      }
                    }
                  ]
                },

                {
                  "type": "Group",
                  "role": "List",
                  "density": "Compact",
                  "state": "idle",
                  "emptyContent": {
                    "type": "Text",
                    "content": "No orders yet",
                    "align": "center",
                    "prominence": "Tertiary"
                  },
                  "children": [
                    {
                      "type": "Group",
                      "role": "Container",
                      "children": [
                        {
                          "type": "Field",
                          "model": "item.id",
                          "dataType": "text",
                          "prominence": "Secondary"
                        },
                        {
                          "type": "Field",
                          "model": "item.total",
                          "dataType": "currency",
                          "prominence": "Primary"
                        },
                        {
                          "type": "Text",
                          "role": "Label",
                          "model": "item.status",
                          "condition": {
                            "switch": "item.status",
                            "cases": {
                              "completed": {
                                "content": "Completed",
                                "intent": "Positive"
                              },
                              "pending": {
                                "content": "Pending",
                                "intent": "Caution"
                              }
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },

            // 최근 고객
            {
              "type": "Group",
              "role": "Card",
              "children": [
                {
                  "type": "Group",
                  "role": "Container",
                  "children": [
                    {
                      "type": "Text",
                      "role": "Title",
                      "content": "New Customers",
                      "prominence": "Secondary"
                    },
                    {
                      "type": "Action",
                      "label": "View All",
                      "prominence": "Tertiary",
                      "intent": "Brand",
                      "behavior": {
                        "action": "navigate",
                        "to": "/customers"
                      }
                    }
                  ]
                },

                {
                  "type": "Group",
                  "role": "List",
                  "density": "Compact",
                  "state": "idle",
                  "children": [
                    {
                      "type": "Group",
                      "role": "Container",
                      "children": [
                        {
                          "type": "Field",
                          "model": "item.name",
                          "dataType": "text",
                          "prominence": "Secondary"
                        },
                        {
                          "type": "Field",
                          "model": "item.email",
                          "dataType": "email",
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

## 패턴: 실시간 업데이트

WebSocket으로 실시간 데이터:

```json
{
  "type": "Group",
  "role": "Card",
  "intent": "Info",
  "children": [
    {
      "type": "Field",
      "model": "liveStats.activeUsers",
      "dataType": "number",
      "prominence": "Hero",
      "realtime": true,  // ← 실시간 업데이트
      "websocket": {
        "url": "wss://api.example.com/stats",
        "event": "activeUsersUpdate"
      }
    },
    {
      "type": "Text",
      "content": "🟢 Active Now",
      "prominence": "Tertiary"
    }
  ]
}
```

---

## 패턴: 빠른 액션

자주 쓰는 액션 모음:

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Quick Actions",
      "prominence": "Secondary"
    },

    {
      "type": "Group",
      "role": "Grid",
      "density": "Compact",
      "children": [
        {
          "type": "Action",
          "label": "New Order",
          "icon": "plus",
          "prominence": "Secondary",
          "intent": "Brand",
          "behavior": {
            "action": "navigate",
            "to": "/orders/new"
          }
        },
        {
          "type": "Action",
          "label": "New Customer",
          "icon": "user-plus",
          "prominence": "Secondary",
          "intent": "Brand",
          "behavior": {
            "action": "navigate",
            "to": "/customers/new"
          }
        },
        {
          "type": "Action",
          "label": "Reports",
          "icon": "file-text",
          "prominence": "Secondary",
          "intent": "Info",
          "behavior": {
            "action": "navigate",
            "to": "/reports"
          }
        },
        {
          "type": "Action",
          "label": "Settings",
          "icon": "settings",
          "prominence": "Secondary",
          "intent": "Neutral",
          "behavior": {
            "action": "navigate",
            "to": "/settings"
          }
        }
      ]
    }
  ]
}
```

---

## 패턴: 진행률 표시

목표 대비 진행률:

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Monthly Goal",
      "prominence": "Secondary"
    },

    {
      "type": "Field",
      "model": "goals.progress",
      "dataType": "range",
      "min": 0,
      "max": 100,
      "readonly": true
    },

    {
      "type": "Group",
      "role": "Inline",
      "children": [
        {
          "type": "Field",
          "model": "goals.current",
          "dataType": "currency",
          "prominence": "Primary"
        },
        {
          "type": "Text",
          "content": "/",
          "prominence": "Tertiary"
        },
        {
          "type": "Field",
          "model": "goals.target",
          "dataType": "currency",
          "prominence": "Tertiary"
        }
      ]
    },

    {
      "type": "Text",
      "role": "Caption",
      "content": "{days} days remaining",
      "prominence": "Tertiary"
    }
  ]
}
```

---

## 패턴: 비교 통계

전월/전년 대비:

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    // 현재 값
    {
      "type": "Field",
      "model": "stats.current",
      "dataType": "currency",
      "prominence": "Hero"
    },
    {
      "type": "Text",
      "content": "This Month",
      "prominence": "Tertiary"
    },

    // 비교
    {
      "type": "Group",
      "role": "Container",
      "density": "Compact",
      "children": [
        // vs Last Month
        {
          "type": "Group",
          "role": "Inline",
          "children": [
            {
              "type": "Text",
              "content": "vs Last Month:",
              "prominence": "Tertiary"
            },
            {
              "type": "Text",
              "role": "Label",
              "model": "stats.monthChange",
              "condition": {
                "if": "stats.monthChange > 0",
                "then": {
                  "content": "↑ +{value}%",
                  "intent": "Positive"
                },
                "else": {
                  "content": "↓ {value}%",
                  "intent": "Critical"
                }
              }
            }
          ]
        },

        // vs Last Year
        {
          "type": "Group",
          "role": "Inline",
          "children": [
            {
              "type": "Text",
              "content": "vs Last Year:",
              "prominence": "Tertiary"
            },
            {
              "type": "Text",
              "role": "Label",
              "content": "↑ +45%",
              "intent": "Positive"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 패턴: 알림/경고 카드

주의가 필요한 사항:

```json
{
  "type": "Group",
  "role": "Card",
  "intent": "Caution",
  "hidden": "alerts.length === 0",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "⚠️ Alerts",
      "prominence": "Secondary"
    },

    {
      "type": "Group",
      "role": "List",
      "density": "Compact",
      "children": [
        {
          "type": "Group",
          "role": "Container",
          "children": [
            {
              "type": "Text",
              "model": "item.message",
              "prominence": "Secondary"
            },
            {
              "type": "Action",
              "label": "Review",
              "prominence": "Tertiary",
              "intent": "Caution",
              "behavior": {
                "action": "navigate",
                "to": "/alerts/{id}",
                "params": { "id": "item.id" }
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

## 핵심 정리

### 필수 구성 요소

```
1. 헤더 (제목 + 필터/기간 선택)
2. 통계 카드 Grid (2-4개)
3. 차트 (선택)
4. 최근 활동 리스트
5. 빠른 액션 (선택)
```

### 통계 카드 디자인

```
숫자 → prominence="Hero"
라벨 → prominence="Tertiary"
변화율 → intent (Positive/Critical)
intent로 카드 배경 색상 결정
```

### 레이아웃

```
통계 카드 → role="Grid" (2-4열)
차트 → 전체 너비 Card
최근 활동 → 2열 Grid로 병렬 배치
```

### 실시간 업데이트

```
중요 지표 → realtime=true
WebSocket 연결
3-5초 polling (대안)
```

### Best Practice

```
✓ 통계 카드는 4개 이하
✓ 가장 중요한 지표를 상단에
✓ 변화율은 화살표 + 색상으로
✓ 빈 상태 처리 (emptyContent)
✓ 로딩 상태 처리 (state="loading")
✓ 링크는 "View All" 텍스트로
✗ 너무 많은 차트 지양
✗ 카드당 2개 이상 지표 지양
```

---

## 다음 단계

대시보드 패턴을 완벽히 이해했습니다!
마지막으로 **Wizard (다단계 폼)** 패턴을 배워봅시다.

**다음**: [Wizard →](./05-wizard.md)

---

**이전**: [← 폼 패턴](./03-form-patterns.md)
**다음**: [Wizard →](./05-wizard.md)
