# 첫 번째 UI 만들기 🚀

**예상 소요 시간**: 10분
**난이도**: ⭐ 입문
**사전 지식**: 없음 (JSON 읽을 수 있으면 OK)

---

## 이 문서를 읽고 나면

- IDDL JSON을 직접 작성할 수 있습니다
- Text, Field, Action의 차이를 이해합니다
- 간단한 프로필 페이지를 만들 수 있습니다

---

## 목표: 사용자 프로필 페이지 만들기

우리가 만들 UI는 다음과 같습니다:

```
┌─────────────────────────────┐
│  Teo                        │  ← 이름 (제목)
│  Senior Frontend Developer  │  ← 직책 (부제)
│  teo@example.com           │  ← 이메일 (데이터)
│  Seoul, Korea              │  ← 위치 (데이터)
│                            │
│  [Edit Profile]            │  ← 버튼 (액션)
└─────────────────────────────┘
```

---

## Step 1: 페이지 뼈대 만들기

모든 IDDL UI는 `Page`로 시작합니다:

```json
{
  "type": "Page",
  "title": "User Profile",
  "children": []
}
```

### 설명

- `type: "Page"`: 이것은 페이지의 루트입니다
- `title`: 브라우저 탭에 표시될 제목
- `children`: 이 안에 실제 UI를 담습니다

---

## Step 2: 메인 섹션 추가하기

페이지 안에 `Section`을 넣습니다:

```json
{
  "type": "Page",
  "title": "User Profile",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "view",
      "children": []
    }
  ]
}
```

### 설명

- `Section`: 페이지의 큰 구획 (예: 헤더, 메인, 사이드바)
- `role: "Container"`: 일반적인 컨텐츠 영역
- `mode: "view"`: 읽기 전용 모드 (편집은 "edit")

---

## Step 3: 그룹으로 묶기

Section 안에 `Group`을 넣어 관련 요소를 묶습니다:

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "view",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "density": "Comfortable",
      "children": []
    }
  ]
}
```

### 설명

- `Group`: 논리적으로 연관된 요소들의 묶음
- `role: "Card"`: 카드 스타일로 렌더링 (보통 배경 + 그림자)
- `density: "Comfortable"`: 넓은 여백 (편안한 느낌)

---

## Step 4: 텍스트 추가하기 (Text 노드)

이제 실제 콘텐츠를 넣습니다. 먼저 **정적 텍스트**:

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Teo",
      "prominence": "Primary"
    },
    {
      "type": "Text",
      "role": "Body",
      "content": "Senior Frontend Developer",
      "prominence": "Secondary"
    }
  ]
}
```

### 설명

- `type: "Text"`: 정적 텍스트 (변하지 않는 콘텐츠)
- `role: "Title"`: 제목 역할 → `<h1>`, `<h2>` 등으로 렌더링
- `role: "Body"`: 본문 역할 → `<p>`로 렌더링
- `prominence`: 시각적 강조 수준 (Primary = 표준, Secondary = 흐림)

---

## Step 5: 데이터 필드 추가하기 (Field 노드)

이메일과 위치는 **데이터베이스에서 가져오는 동적 데이터**입니다:

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Teo",
      "prominence": "Primary"
    },
    {
      "type": "Text",
      "role": "Body",
      "content": "Senior Frontend Developer",
      "prominence": "Secondary"
    },
    {
      "type": "Field",
      "label": "Email",
      "model": "user.email",
      "dataType": "email"
    },
    {
      "type": "Field",
      "label": "Location",
      "model": "user.location",
      "dataType": "text"
    }
  ]
}
```

### 설명

- `type: "Field"`: 데이터 바인딩 필드
- `label`: 필드 이름 (예: "Email")
- `model`: 데이터 경로 (예: `user.email` → `{ user: { email: "teo@example.com" } }`)
- `dataType`: 데이터 타입 (email, text, number, date 등)

### Text vs Field 차이

| | Text | Field |
|---|---|---|
| 데이터 바인딩 | ✗ 없음 | ✓ 있음 |
| 편집 가능 | ✗ 불가 | ✓ mode="edit" 시 가능 |
| 사용 예시 | 제목, 설명, 라벨 | 이름, 이메일, 가격 |

---

## Step 6: 버튼 추가하기 (Action 노드)

마지막으로 **클릭 가능한 버튼**을 추가합니다:

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Teo",
      "prominence": "Primary"
    },
    {
      "type": "Text",
      "role": "Body",
      "content": "Senior Frontend Developer",
      "prominence": "Secondary"
    },
    {
      "type": "Field",
      "label": "Email",
      "model": "user.email",
      "dataType": "email"
    },
    {
      "type": "Field",
      "label": "Location",
      "model": "user.location",
      "dataType": "text"
    },
    {
      "type": "Action",
      "label": "Edit Profile",
      "prominence": "Primary",
      "intent": "Brand",
      "behavior": {
        "action": "navigate",
        "to": "/profile/edit"
      }
    }
  ]
}
```

### 설명

- `type: "Action"`: 인터랙션 트리거 (버튼, 링크)
- `label`: 버튼 텍스트
- `prominence: "Primary"`: 주요 버튼 (Solid 스타일)
- `intent: "Brand"`: 브랜드 색상 사용 (Primary CTA)
- `behavior`: 클릭 시 동작
  - `action: "navigate"`: 페이지 이동
  - `to`: 이동할 경로

---

## 완성된 전체 코드

```json
{
  "type": "Page",
  "title": "User Profile",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "view",
      "children": [
        {
          "type": "Group",
          "role": "Card",
          "density": "Comfortable",
          "children": [
            {
              "type": "Text",
              "role": "Title",
              "content": "Teo",
              "prominence": "Primary"
            },
            {
              "type": "Text",
              "role": "Body",
              "content": "Senior Frontend Developer",
              "prominence": "Secondary"
            },
            {
              "type": "Field",
              "label": "Email",
              "model": "user.email",
              "dataType": "email"
            },
            {
              "type": "Field",
              "label": "Location",
              "model": "user.location",
              "dataType": "text"
            },
            {
              "type": "Action",
              "label": "Edit Profile",
              "prominence": "Primary",
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

---

## 실습: 직접 만들어보기

### 연습 1: 알림 메시지

다음 UI를 IDDL로 작성해보세요:

```
┌────────────────────┐
│ ✓ Success          │
│ Profile updated!   │
│ [Close]            │
└────────────────────┘
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Card",
  "intent": "Positive",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Success",
      "prominence": "Secondary"
    },
    {
      "type": "Text",
      "role": "Body",
      "content": "Profile updated!",
      "prominence": "Tertiary"
    },
    {
      "type": "Action",
      "label": "Close",
      "prominence": "Tertiary",
      "intent": "Neutral",
      "behavior": {
        "action": "close"
      }
    }
  ]
}
```

</details>

### 연습 2: 로그인 폼

다음 UI를 IDDL로 작성해보세요:

```
┌──────────────────────┐
│ Login                │
│                      │
│ Email:    [________] │
│ Password: [________] │
│                      │
│ [Sign In]            │
└──────────────────────┘
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Login",
      "prominence": "Primary"
    },
    {
      "type": "Field",
      "label": "Email",
      "model": "credentials.email",
      "dataType": "email",
      "required": true
    },
    {
      "type": "Field",
      "label": "Password",
      "model": "credentials.password",
      "dataType": "password",
      "required": true
    },
    {
      "type": "Action",
      "label": "Sign In",
      "prominence": "Primary",
      "intent": "Brand",
      "behavior": {
        "action": "submit"
      }
    }
  ]
}
```

</details>

---

## 핵심 정리

### 3가지 기본 노드

| 노드 | 용도 | 예시 |
|------|------|------|
| **Text** | 정적 콘텐츠 | 제목, 설명, 라벨 |
| **Field** | 동적 데이터 | 이름, 이메일, 가격 |
| **Action** | 인터랙션 | 버튼, 링크 |

### 계층 구조

```
Page
 └─ Section (큰 구획)
     └─ Group (묶음)
         └─ Text / Field / Action (실제 콘텐츠)
```

### 필수 속성

- `type`: 노드 타입 (Text, Field, Action, Group, Section, Page)
- `role`: 역할 (Title, Body, Card, Form 등)
- `prominence`: 시각적 강조 (Hero, Primary, Secondary, Tertiary)
- `intent`: 맥락/색상 (Neutral, Brand, Positive, Caution, Critical)

---

## 다음 단계

축하합니다! 첫 번째 IDDL UI를 만들었습니다.

### 더 깊이 배우기

1. **[IDDL의 핵심 아이디어](./02-core-idea.md)** ← 다음 단계
   - 4가지 속성의 철학 이해하기

2. **[Prominence 시스템](../01-fundamentals/01-prominence.md)** (Level 1)
   - 시각적 계층 완전 정복

3. **[실전 패턴: CRUD 목록](../04-patterns/01-crud-list.md)** (Level 4)
   - 실무에서 바로 쓸 수 있는 패턴

---

## 문제 해결

### Q: Field의 mode는 어디서 정의하나요?

Field는 부모 Section의 `mode`를 상속받습니다:
- `mode: "view"` → 읽기 전용 텍스트로 표시
- `mode: "edit"` → 입력 폼으로 표시

### Q: prominence와 intent의 차이는?

- **prominence**: 크기/무게감 (얼마나 눈에 띄는가?)
- **intent**: 색상/맥락 (무슨 의미인가?)

예: `prominence: "Hero", intent: "Critical"` = 아주 큰 빨간 버튼

### Q: Group 없이 Section에 바로 Text를 넣으면 안 되나요?

안 됩니다. Section은 Group만 자식으로 가질 수 있습니다. 이는 명확한 계층 구조를 위함입니다.

---

**이전**: [← IDDL 소개](./00-welcome.md)
**다음**: [IDDL의 핵심 아이디어 →](./02-core-idea.md)
