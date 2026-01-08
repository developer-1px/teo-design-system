# Overlay: 떠 있는 레이어 ☁️

**예상 소요 시간**: 8분
**난이도**: ⭐⭐ 기초
**사전 지식**: [Section](./03-section.md)

---

## 이 문서를 읽고 나면

- Overlay가 무엇인지 이해합니다
- 7가지 Overlay role을 구분할 수 있습니다
- Modal, Drawer, Toast를 올바르게 사용할 수 있습니다

---

## Overlay란?

> **"페이지 흐름 위에 부유하는 레이어"**

Overlay는 **Z-index 상위**에 떠 있는 UI입니다. Section은 "땅"이라면, Overlay는 "하늘"입니다.

```
┌─────────────────┐
│  Page (땅)      │
│  Section        │ ← 레벨 0
│    └─ Group     │
│                 │
│  ┌───────────┐  │
│  │ Overlay   │  │ ← 레벨 10 (위에 떠 있음)
│  │ (하늘)    │  │
│  └───────────┘  │
└─────────────────┘
```

---

## 7가지 Overlay Role

### 1. Dialog - 중앙 모달

**용도**: 확인, 경고, 폼 입력

**위치**: 화면 중앙, 배경 딤 처리

```json
{
  "type": "Overlay",
  "id": "confirm-delete",
  "role": "Dialog",
  "placement": "center",
  "dismissable": false,      // 외부 클릭으로 닫기 불가
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "role": "Title", "content": "Confirm Delete" },
        { "type": "Text", "role": "Body", "content": "Are you sure?" },
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { "type": "Action", "label": "Cancel", "behavior": { "action": "close" } },
            { "type": "Action", "label": "Delete", "intent": "Critical" }
          ]
        }
      ]
    }
  ]
}
```

---

### 2. Drawer - 사이드 패널

**용도**: 필터, 설정, 상세 정보

**위치**: 왼쪽/오른쪽에서 슬라이드

```json
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
        { "type": "Field", "label": "Category", "dataType": "select" },
        { "type": "Field", "label": "Price Range", "dataType": "range" }
      ]
    }
  ]
}
```

---

### 3. Toast - 일시적 알림

**용도**: 성공/에러 메시지

**위치**: 우상단, 자동 사라짐

```json
{
  "type": "Overlay",
  "id": "success-toast",
  "role": "Toast",
  "placement": "top-right",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "intent": "Positive",
      "children": [
        { "type": "Text", "content": "✓ Saved successfully" }
      ]
    }
  ]
}
```

---

### 4. Popover - 요소 근처 팝업

**용도**: 메뉴, 드롭다운

**위치**: 트리거 버튼 근처

```json
{
  "type": "Overlay",
  "id": "action-menu",
  "role": "Popover",
  "placement": "bottom",
  "children": [
    {
      "type": "Group",
      "role": "List",
      "children": [
        { "type": "Action", "label": "Edit" },
        { "type": "Action", "label": "Duplicate" },
        { "type": "Action", "label": "Delete", "intent": "Critical" }
      ]
    }
  ]
}
```

---

### 5. Tooltip - 힌트 팝업

**용도**: 짧은 도움말

**위치**: 마우스 근처

```json
{
  "type": "Overlay",
  "id": "help-tooltip",
  "role": "Tooltip",
  "placement": "top",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "content": "Click to download", "prominence": "Tertiary" }
      ]
    }
  ]
}
```

---

### 6. Sheet - 모바일 하단 시트

**용도**: 모바일 선택, 액션

**위치**: 하단에서 올라옴

```json
{
  "type": "Overlay",
  "id": "mobile-actions",
  "role": "Sheet",
  "placement": "bottom",
  "children": [
    {
      "type": "Group",
      "role": "List",
      "children": [
        { "type": "Action", "label": "Share" },
        { "type": "Action", "label": "Save" },
        { "type": "Action", "label": "Report" }
      ]
    }
  ]
}
```

---

### 7. Lightbox - 미디어 뷰어

**용도**: 이미지/비디오 확대

**위치**: 전체 화면

```json
{
  "type": "Overlay",
  "id": "image-viewer",
  "role": "Lightbox",
  "placement": "center",
  "dismissable": true,
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Field", "model": "image.url", "dataType": "image" }
      ]
    }
  ]
}
```

---

## isOpen과 dismissable

### isOpen (표시 상태)

```json
{
  "type": "Overlay",
  "id": "my-modal",
  "role": "Dialog",
  "isOpen": true,     // ← 열림/닫힘 상태
  "children": [...]
}
```

### dismissable (외부 클릭 닫기)

```json
// 외부 클릭 시 닫힘
{
  "dismissable": true
}

// 외부 클릭 해도 안 닫힘 (명시적 Close 필요)
{
  "dismissable": false
}
```

---

## Overlay 열고 닫기

### Action으로 열기

```json
{
  "type": "Action",
  "label": "Edit",
  "behavior": {
    "action": "open",
    "overlay": "edit-modal"  // ← Overlay id와 매칭
  }
}
```

### Action으로 닫기

```json
{
  "type": "Action",
  "label": "Cancel",
  "behavior": {
    "action": "close"        // ← 현재 Overlay 닫기
  }
}

// 또는 특정 Overlay 닫기
{
  "behavior": {
    "action": "close",
    "overlay": "edit-modal"
  }
}
```

---

## 실습: 사용자 편집 모달

버튼을 누르면 모달이 열리고, 폼을 제출하거나 취소하면 닫히는 UI를 만드세요.

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Page",
  "title": "User Profile",
  "children": [
    // 메인 섹션
    {
      "type": "Section",
      "role": "Container",
      "mode": "view",
      "children": [
        {
          "type": "Group",
          "role": "Card",
          "children": [
            { "type": "Field", "label": "Name", "model": "user.name" },
            { "type": "Field", "label": "Email", "model": "user.email" },

            // 편집 버튼 → 모달 열기
            {
              "type": "Action",
              "label": "Edit Profile",
              "intent": "Brand",
              "behavior": {
                "action": "open",
                "overlay": "edit-modal"   // ← 모달 열기
              }
            }
          ]
        }
      ]
    },

    // 편집 모달
    {
      "type": "Overlay",
      "id": "edit-modal",                 // ← id 매칭
      "role": "Dialog",
      "placement": "center",
      "dismissable": false,
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            { "type": "Text", "role": "Title", "content": "Edit Profile" },

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
              "type": "Group",
              "role": "Toolbar",
              "children": [
                // 취소 → 모달 닫기
                {
                  "type": "Action",
                  "label": "Cancel",
                  "prominence": "Secondary",
                  "behavior": { "action": "close" }
                },
                // 저장 → 제출 후 모달 닫기
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
  ]
}
```

</details>

---

## Role 선택 가이드

```
확인/경고/폼 → Dialog
필터/설정 → Drawer
알림 메시지 → Toast
메뉴/드롭다운 → Popover
짧은 힌트 → Tooltip
모바일 액션 → Sheet
이미지 확대 → Lightbox
```

---

## 핵심 정리

- Overlay는 페이지 위에 떠 있는 레이어
- `id`로 식별, Action의 behavior로 열고 닫음
- `dismissable`로 외부 클릭 닫기 제어
- Section과 같은 레벨 (Page의 직접 자식)

---

## 다음 단계

Overlay까지 완벽히 이해했습니다!
마지막으로 모든 것을 담는 **Page**를 배워봅시다.

**다음**: [Page 구성 →](./05-page.md)

---

**이전**: [← Section](./03-section.md)
**다음**: [Page 구성 →](./05-page.md)
