# IDDL 1.0 개발자 퀵 가이드 (Developer Cheat Sheet)

IDDL 1.0 Part 1 (Core Freeze) 기준의 핵심 규칙 요약입니다.

## 1. 3단계 계층 구조 (The 3 Levels)

UI 트리는 반드시 **Page > Section > Block > Element** 순서를 지켜야 합니다.

| Level | Component | 설명 | 예시 |
| :--- | :--- | :--- | :--- |
| **0** | `<Page>` | **루트 컨테이너**. 단 하나만 존재. 자식은 Section만 가능. | Page |
| **1** | `<Section>` | **레이아웃 영역**. 화면을 물리적으로 나눕니다. 자식은 Block만 가능. | Header, Main, Sidebar |
| **2** | `<Block>` | **기능 단위**. 의미적 덩어리. 자식은 Block/Element 가능. | Card, Form, List, Toolbar |
| **3** | `<Element>` | **최소 단위**. 더 이상 쪼개지지 않는 컨텐츠. | Text, Image, Field, Action |

---

## 2. 정의의 5대 축 (The 5 Axes)

모든 컴포넌트는 다음 5가지 축으로 디자인 의도를 전달합니다.

1.  **Role (역할)**: "이게 뭐죠?" (Button, Card, Header...)
2.  **Intent (의도)**: "왜 보여주죠?" (`Brand`, `Critical`, `Positive`...)
3.  **Prominence (위계)**: "얼마나 중요한가요?" (`Hero`, `Standard`, `Subtle`, `Hidden`)
4.  **Density (밀도)**: "얼마나 촘촘한가요?" (`Standard`, `Comfortable`, `Compact`)
5.  **Spec (명세)**: "Role(예:Grid)을 위한 필수 파라미터는요?" (role-dependent)

---

## 3. 레이아웃은 Role이 결정합니다

IDDL 1.0 Part 1에서는 **`layout`이나 `placement` 속성을 직접 쓰지 않습니다.**
대신 **`Role`**이 레이아웃을 유도합니다.

### Bad (더 이상 사용 안 함)
```tsx
// ❌ 레이아웃을 직접 지정하지 마세요
<Block layout="inline" placement="top">...</Block>
```

### Good (Role 사용)
```tsx
// ✅ Role이 "상단 배치 + 가로 나열"을 함축합니다
<Block role="Toolbar">...</Block>
```

### Grid의 경우 (Spec 사용)
Grid 처럼 설정이 꼭 필요한 Role은 `spec`을 사용합니다.
```tsx
<Block role="Grid" spec={{ columns: 2 }}>...</Block>
```

---

## 4. 6가지 핵심 Element

1.  **`<Text>`**: 텍스트 (`role`: Title, Body...)
2.  **`<Image>`**: 그림 (`src`)
3.  **`<Video>`**: 영상
4.  **`<Field>`**: 입력 (`type`: text, select...)
5.  **`<Action>`**: 버튼/링크 (`behavior`: submit, navigate...)
6.  **`<Separator>`**: 구분선/여백

---

## 5. 실전 예시 (Example)

### 툴바 (Toolbar)
Renderer가 `Role="Toolbar"`를 해석하여 적절한 위치(주로 상단)와 흐름(주로 가로)으로 배치합니다.

```tsx
<Block role="Toolbar" density="Compact">
  <Action label="저장" intent="Brand" />
  <Separator type="space" size="small" />
  <Action label="삭제" intent="Critical" prominence="Subtle" />
</Block>
```

### 카드 (Card)
Card는 정보를 묶어서 보여주는 컨테이너입니다.

```tsx
<Block role="Card">
   <Text role="Heading" content="카드 제목" />
   <Text role="Body" content="설명입니다." />
   <Separator type="line" />
   <Action label="확인" />
</Block>
```
