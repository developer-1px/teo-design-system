# 반응형 디자인: 모든 화면에 최적화하기 📱

**예상 소요 시간**: 14분
**난이도**: ⭐⭐⭐⭐ 고급
**사전 지식**: [Density](../01-fundamentals/03-density.md), [Layout](../02-structure/05-page.md)

---

## 이 문서를 읽고 나면

- IDDL의 반응형 전략을 이해합니다
- 화면 크기별 조건부 렌더링을 구현할 수 있습니다
- 모바일 최적화 패턴을 활용할 수 있습니다

---

## IDDL 반응형 철학

> **"선언적 의도, 반응형 구현"**

IDDL은 **의도**를 선언하고, 렌더러가 **화면 크기에 맞게 구현**합니다.

**핵심 원칙**:
```
1. 의도 우선 (prominence, role, density)
2. 조건부 렌더링 (hidden, condition)
3. 레이아웃 자동 전환 (Grid → List)
4. 모바일 전용 컴포넌트 (Sheet, Bottom Navigation)
```

---

## 1. 자동 반응형

### Density 활용

```json
{
  "type": "Group",
  "role": "Table",
  "density": "Comfortable",  // ← 데스크톱
  // 모바일: 자동으로 "Compact"로 전환
  "children": [...]
}
```

**렌더링**:
- **Desktop**: Comfortable (넓은 여백)
- **Tablet**: Standard (중간 여백)
- **Mobile**: Compact (좁은 여백)

---

### Grid 자동 변환

```json
{
  "type": "Group",
  "role": "Grid",
  "children": [
    { "type": "Group", "role": "Card", "children": [...] },
    { "type": "Group", "role": "Card", "children": [...] },
    { "type": "Group", "role": "Card", "children": [...] }
  ]
}
```

**렌더링**:
- **Desktop**: 3열 그리드
- **Tablet**: 2열 그리드
- **Mobile**: 1열 리스트

---

### Table → 카드 전환

```json
{
  "type": "Group",
  "role": "Table",
  "density": "Compact",
  "children": [
    { "type": "Field", "label": "Name", "model": "item.name" },
    { "type": "Field", "label": "Email", "model": "item.email" },
    { "type": "Field", "label": "Status", "model": "item.status" }
  ]
}
```

**렌더링**:
- **Desktop**: 테이블 (행/열)
```
┌──────┬────────────┬────────┐
│ Name │ Email      │ Status │
├──────┼────────────┼────────┤
│ Teo  │ teo@...    │ Active │
└──────┴────────────┴────────┘
```

- **Mobile**: 카드 리스트
```
┌──────────────┐
│ Name: Teo    │
│ Email: teo@  │
│ Status: Active│
└──────────────┘
```

---

## 2. 조건부 반응형

### 화면 크기 조건

```json
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    // 데스크톱: 텍스트 버튼
    {
      "type": "Action",
      "label": "Edit Profile",
      "prominence": "Secondary",
      "hidden": "$screenSize === 'mobile'",
      "behavior": { "action": "navigate", "to": "/profile/edit" }
    },

    // 모바일: 아이콘 버튼
    {
      "type": "Action",
      "icon": "edit",
      "title": "Edit Profile",
      "prominence": "Secondary",
      "hidden": "$screenSize !== 'mobile'",
      "behavior": { "action": "navigate", "to": "/profile/edit" }
    }
  ]
}
```

---

### 레이아웃 전환

```json
{
  "type": "Page",
  "layout": "sidebar",  // ← 기본 레이아웃
  "condition": {
    "if": "$screenSize === 'mobile'",
    "then": {
      "layout": "single"  // ← 모바일: 사이드바 숨김
    }
  },
  "children": [...]
}
```

---

### 컴포넌트 대체

```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    // 데스크톱: Dialog
    {
      "type": "Overlay",
      "id": "filter-modal",
      "role": "Dialog",
      "hidden": "$screenSize === 'mobile'",
      "children": [...]
    },

    // 모바일: Sheet
    {
      "type": "Overlay",
      "id": "filter-modal",
      "role": "Sheet",
      "placement": "bottom",
      "hidden": "$screenSize !== 'mobile'",
      "children": [...]
    }
  ]
}
```

---

## 3. 모바일 최적화 패턴

### 패턴 1: Bottom Navigation

```json
{
  "type": "Section",
  "role": "Footer",
  "density": "Compact",
  "hidden": "$screenSize !== 'mobile'",
  "children": [
    {
      "type": "Group",
      "role": "Toolbar",
      "children": [
        {
          "type": "Action",
          "icon": "home",
          "label": "Home",
          "prominence": "Tertiary",
          "behavior": { "action": "navigate", "to": "/" }
        },
        {
          "type": "Action",
          "icon": "search",
          "label": "Search",
          "prominence": "Tertiary",
          "behavior": { "action": "navigate", "to": "/search" }
        },
        {
          "type": "Action",
          "icon": "user",
          "label": "Profile",
          "prominence": "Tertiary",
          "behavior": { "action": "navigate", "to": "/profile" }
        }
      ]
    }
  ]
}
```

---

### 패턴 2: 햄버거 메뉴

```json
{
  "type": "Section",
  "role": "Header",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        // 모바일: 햄버거 버튼
        {
          "type": "Action",
          "icon": "menu",
          "prominence": "Tertiary",
          "hidden": "$screenSize !== 'mobile'",
          "behavior": {
            "action": "open",
            "overlay": "mobile-menu"
          }
        },

        // 로고
        {
          "type": "Text",
          "role": "Title",
          "content": "Logo",
          "prominence": "Primary"
        }
      ]
    }
  ]
}

// 모바일 메뉴 Drawer
{
  "type": "Overlay",
  "id": "mobile-menu",
  "role": "Drawer",
  "placement": "left",
  "dismissable": true,
  "hidden": "$screenSize !== 'mobile'",
  "children": [
    {
      "type": "Group",
      "role": "List",
      "children": [
        { "type": "Action", "label": "Home", "to": "/" },
        { "type": "Action", "label": "Products", "to": "/products" },
        { "type": "Action", "label": "About", "to": "/about" }
      ]
    }
  ]
}
```

---

### 패턴 3: 모바일 필터

```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    // 데스크톱: 인라인 필터
    {
      "type": "Group",
      "role": "Toolbar",
      "hidden": "$screenSize === 'mobile'",
      "children": [
        { "type": "Field", "label": "Search", "model": "filters.search" },
        { "type": "Field", "label": "Category", "model": "filters.category", "dataType": "select" },
        { "type": "Field", "label": "Sort", "model": "filters.sort", "dataType": "select" }
      ]
    },

    // 모바일: 필터 버튼
    {
      "type": "Action",
      "label": "Filters",
      "icon": "filter",
      "prominence": "Secondary",
      "hidden": "$screenSize !== 'mobile'",
      "behavior": {
        "action": "open",
        "overlay": "filter-sheet"
      }
    }
  ]
}
```

---

### 패턴 4: 스와이프 액션

```json
{
  "type": "Group",
  "role": "List",
  "hidden": "$screenSize !== 'mobile'",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "swipeActions": {
        "left": [
          {
            "type": "Action",
            "label": "Delete",
            "icon": "trash",
            "intent": "Critical",
            "behavior": {
              "action": "command",
              "endpoint": "/api/items/{id}",
              "method": "DELETE"
            }
          }
        ],
        "right": [
          {
            "type": "Action",
            "label": "Archive",
            "icon": "archive",
            "intent": "Info",
            "behavior": {
              "action": "command",
              "command": "archive"
            }
          }
        ]
      },
      "children": [
        { "type": "Text", "model": "item.title" }
      ]
    }
  ]
}
```

---

## 4. 터치 최적화

### 터치 타겟 크기

```json
{
  "type": "Action",
  "label": "Button",
  "prominence": "Primary",
  "touchTarget": "large",  // ← 44x44px 최소
  "behavior": { "action": "submit" }
}
```

---

### 스크롤 영역

```json
{
  "type": "Group",
  "role": "List",
  "scrollable": true,
  "maxHeight": "60vh",  // ← 뷰포트 높이의 60%
  "children": [...]
}
```

---

## 5. 브레이크포인트

IDDL 렌더러는 다음 브레이크포인트를 사용합니다:

```
mobile:   < 768px
tablet:   768px - 1024px
desktop:  >= 1024px
```

### 사용 예시

```json
{
  "type": "Group",
  "role": "Grid",
  "columns": {
    "mobile": 1,
    "tablet": 2,
    "desktop": 3
  },
  "children": [...]
}
```

---

## 실전 예시: 반응형 대시보드

```json
{
  "type": "Page",
  "title": "Dashboard",
  "layout": "sidebar",
  "condition": {
    "if": "$screenSize === 'mobile'",
    "then": {
      "layout": "single"
    }
  },
  "children": [
    // 사이드바 (Desktop만)
    {
      "type": "Section",
      "role": "Navigator",
      "hidden": "$screenSize === 'mobile'",
      "children": [...]
    },

    // 메인
    {
      "type": "Section",
      "role": "Container",
      "children": [
        // 헤더
        {
          "type": "Group",
          "role": "Container",
          "children": [
            // 모바일: 햄버거 메뉴
            {
              "type": "Action",
              "icon": "menu",
              "hidden": "$screenSize !== 'mobile'",
              "behavior": { "action": "open", "overlay": "mobile-nav" }
            },

            { "type": "Text", "role": "Title", "content": "Dashboard" }
          ]
        },

        // 통계 카드 (자동 반응형)
        {
          "type": "Group",
          "role": "Grid",
          "children": [
            { "type": "Group", "role": "Card", "children": [...] },
            { "type": "Group", "role": "Card", "children": [...] },
            { "type": "Group", "role": "Card", "children": [...] }
          ]
        }
      ]
    },

    // 하단 네비게이션 (Mobile만)
    {
      "type": "Section",
      "role": "Footer",
      "hidden": "$screenSize !== 'mobile'",
      "children": [
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { "type": "Action", "icon": "home", "label": "Home" },
            { "type": "Action", "icon": "chart", "label": "Analytics" },
            { "type": "Action", "icon": "user", "label": "Profile" }
          ]
        }
      ]
    }
  ]
}
```

---

## 핵심 정리

### 반응형 전략

```
1. 자동 반응형 (density, Grid)
2. 조건부 렌더링 ($screenSize)
3. 컴포넌트 대체 (Dialog → Sheet)
4. 레이아웃 전환 (sidebar → single)
```

### 모바일 패턴

```
네비게이션 → Bottom Navigation
메뉴 → Drawer (햄버거)
필터 → Sheet (하단)
액션 → Swipe Actions
```

### 브레이크포인트

```
mobile:  < 768px   (1열)
tablet:  768-1024px (2열)
desktop: >= 1024px (3열)
```

### Best Practice

```
✓ 자동 반응형 우선 사용
✓ 터치 타겟 44x44px 이상
✓ 모바일은 Sheet 사용
✓ Desktop은 Dialog 사용
✓ Grid는 자동 변환 활용
✗ 수동으로 브레이크포인트 지정 지양
✗ 모바일에서 Tooltip 지양
```

---

## 다음 단계

반응형 디자인을 완벽히 이해했습니다!
이제 **성능 최적화**를 배워봅시다.

**다음**: [성능 최적화 →](./03-performance.md)

---

**이전**: [← 커스텀 확장](./01-custom-extensions.md)
**다음**: [성능 최적화 →](./03-performance.md)
