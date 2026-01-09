# Role 시스템 완전 정복 🎭

**예상 소요 시간**: 15분
**난이도**: ⭐⭐⭐ 중급
**사전 지식**: [Density 시스템](./03-density.md)

---

## 이 문서를 읽고 나면

- Role의 개념과 중요성을 이해합니다
- 노드 타입별 Role을 완벽히 구분할 수 있습니다
- 적절한 Role을 선택하여 의미 있는 UI를 만들 수 있습니다

---

## Role이란?

> **"이것은 무엇인가?"** - 기능적 정체성

Role은 UI 요소의 **기능적 본질(Functional Identity)**을 정의합니다.
단순한 시각적 스타일이 아니라 **"왜 존재하는가?"**를 명시합니다.

---

## 왜 Role이 중요한가?

### Before: Role 없이

```json
{
  "type": "Text",
  "content": "User Dashboard",
  "className": "text-2xl font-bold"
}
```

- "큰 굵은 텍스트"일 뿐
- 의미 없음
- 접근성 제로

### After: Role 있음

```json
{
  "type": "Text",
  "role": "Title",
  "content": "User Dashboard",
  "prominence": "Hero"
}
```

- **제목**이라는 의미 명확
- `<h1>` 또는 `<h2>`로 렌더링
- 스크린 리더가 "제목" 인식

---

## 노드 타입별 Role

### 1. Text 노드의 Role

**용도**: 정적 콘텐츠의 역할 정의

| Role | 의미 | HTML 태그 | 사용 예시 |
|------|------|----------|-----------|
| `Title` | 제목 | `<h1>` ~ `<h6>` | 페이지 타이틀, 섹션 제목 |
| `Body` | 본문 | `<p>` | 설명, 본문 텍스트 |
| `Label` | 라벨 | `<span>` | 짧은 라벨, 태그 |
| `Caption` | 캡션 | `<small>` | 부연 설명, 힌트 |
| `Code` | 코드 | `<code>` | 코드 스니펫, 명령어 |

```json
// Title: 페이지 최상단 제목
{
  "type": "Text",
  "role": "Title",
  "content": "Dashboard",
  "prominence": "Hero"
}
// → <h1 class="text-4xl font-bold">Dashboard</h1>

// Body: 일반 설명
{
  "type": "Text",
  "role": "Body",
  "content": "Welcome back, Teo"
}
// → <p>Welcome back, Teo</p>

// Label: 짧은 태그
{
  "type": "Text",
  "role": "Label",
  "content": "New"
}
// → <span class="badge">New</span>

// Caption: 부연 설명
{
  "type": "Text",
  "role": "Caption",
  "content": "Last updated 2 hours ago",
  "prominence": "Tertiary"
}
// → <small>Last updated 2 hours ago</small>

// Code: 코드 표시
{
  "type": "Text",
  "role": "Code",
  "content": "npm install iddl"
}
// → <code>npm install iddl</code>
```

---

### 2. Field 노드의 Role

Field는 **dataType으로 구분**되므로 별도 role이 없습니다.

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email"  // ← dataType이 role 역할
}
```

---

### 3. Action 노드의 Role

Action도 **prominence + intent로 구분**되므로 별도 role이 없습니다.

```json
{
  "type": "Action",
  "label": "Save",
  "prominence": "Primary",  // ← 시각적 강조
  "intent": "Positive"      // ← 의미/색상
}
```

---

### 4. Group 노드의 Role

**용도**: 컨테이너의 기능적 목적 정의

| Role | 의미 | 기본 레이아웃 | 사용 예시 |
|------|------|--------------|-----------|
| `Container` | 일반 박스 | Stack (세로) | 일반 묶음 |
| `Form` | 폼 (검증 컨텍스트) | Stack | 입력 폼 |
| `Fieldset` | 폼 내 필드 그룹 | Stack | 폼 안의 섹션 |
| `Toolbar` | 액션 버튼 집합 | Inline (가로) | 버튼 그룹 |
| `List` | 단일 컬럼 목록 | Stack | 세로 리스트 |
| `Grid` | 다중 컬럼 그리드 | Grid | 카드 그리드 |
| `Table` | 테이블 데이터 | Table | 데이터 테이블 |
| `Tabs` | 탭 컨테이너 | Tabs | 탭 전환 |
| `Steps` | 스텝 진행 | Steps | 다단계 마법사 |
| `Split` | 분할 패널 | Split | 좌우 분할 |
| `Card` | 카드 컨테이너 | Stack | 카드 UI |
| `Inline` | 인라인 요소 그룹 | Inline | 가로 나열 |

```json
// Container: 일반 묶음
{
  "type": "Group",
  "role": "Container",
  "children": [...]
}

// Form: 입력 폼 (검증 컨텍스트)
{
  "type": "Group",
  "role": "Form",
  "children": [
    { "type": "Field", "label": "Name" },
    { "type": "Field", "label": "Email" },
    { "type": "Action", "label": "Submit" }
  ]
}

// Fieldset: 폼 안의 섹션
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Group",
      "role": "Fieldset",
      "children": [
        { "type": "Text", "content": "Basic Info" },
        { "type": "Field", "label": "Name" }
      ]
    }
  ]
}

// Toolbar: 버튼 그룹
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    { "type": "Action", "label": "Save" },
    { "type": "Action", "label": "Cancel" }
  ]
}

// List: 세로 리스트
{
  "type": "Group",
  "role": "List",
  "children": [
    { "type": "Text", "content": "Item 1" },
    { "type": "Text", "content": "Item 2" }
  ]
}

// Grid: 카드 그리드
{
  "type": "Group",
  "role": "Grid",
  "children": [
    { "type": "Group", "role": "Card", "children": [...] },
    { "type": "Group", "role": "Card", "children": [...] }
  ]
}

// Table: 데이터 테이블
{
  "type": "Group",
  "role": "Table",
  "density": "Compact",
  "children": [
    { "type": "Field", "label": "ID", "model": "item.id" },
    { "type": "Field", "label": "Name", "model": "item.name" }
  ]
}

// Card: 카드 컨테이너
{
  "type": "Group",
  "role": "Card",
  "children": [
    { "type": "Text", "role": "Title", "content": "Title" },
    { "type": "Text", "role": "Body", "content": "Description" }
  ]
}
```

---

### 5. Section 노드의 Role

**용도**: 페이지 영역의 배치 목적 정의

| Role | 의미 | 위치 | 사용 예시 |
|------|------|------|-----------|
| `Container` | 메인 컨텐츠 | 중앙 | 페이지 본문 |
| `Header` | 페이지 상단 | 상단 고정 | 헤더 |
| `Footer` | 페이지 하단 | 하단 고정 | 푸터 |
| `Navigator` | 네비게이션 | 사이드/상단 | 사이드바, 탭바 |
| `Aside` | 보조 정보 | 사이드 | 사이드 패널 |

```json
// Container: 메인 영역
{
  "type": "Section",
  "role": "Container",
  "children": [...]
}

// Header: 상단 고정
{
  "type": "Section",
  "role": "Header",
  "children": [
    { "type": "Text", "content": "Logo" },
    { "type": "Group", "role": "Toolbar", "children": [...] }
  ]
}

// Navigator: 사이드바
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
        { "type": "Action", "label": "Users", "to": "/users" }
      ]
    }
  ]
}
```

---

### 6. Overlay 노드의 Role

**용도**: 부유 레이어의 유형 정의

| Role | 의미 | 위치 | 사용 예시 |
|------|------|------|-----------|
| `Dialog` | 중앙 모달 | Center | 확인 다이얼로그 |
| `Drawer` | 사이드 패널 | Left/Right | 설정 패널 |
| `Popover` | 요소 근처 팝업 | Near element | 메뉴, 드롭다운 |
| `Toast` | 일시적 알림 | Top-right | 성공/에러 알림 |
| `Tooltip` | 힌트 팝업 | Near cursor | 도움말 |
| `Sheet` | 하단 시트 | Bottom | 모바일 선택 |
| `Lightbox` | 미디어 뷰어 | Center | 이미지 확대 |

```json
// Dialog: 확인 모달
{
  "type": "Overlay",
  "id": "confirm-delete",
  "role": "Dialog",
  "placement": "center",
  "children": [
    {
      "type": "Group",
      "role": "Form",
      "children": [
        { "type": "Text", "content": "Are you sure?" },
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { "type": "Action", "label": "Cancel" },
            { "type": "Action", "label": "Delete", "intent": "Critical" }
          ]
        }
      ]
    }
  ]
}

// Toast: 알림
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
        { "type": "Text", "content": "Saved successfully" }
      ]
    }
  ]
}
```

---

## 실습 1: 로그인 폼

로그인 폼을 적절한 Role로 구성하세요:

```
┌────────────────────┐
│ Sign In            │  ← 제목
│                    │
│ Email:    [_____]  │  ← 입력
│ Password: [_____]  │  ← 입력
│                    │
│ [Sign In]          │  ← 버튼
└────────────────────┘
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Form",  // ← 폼 역할
  "children": [
    {
      "type": "Text",
      "role": "Title",  // ← 제목 역할
      "content": "Sign In",
      "prominence": "Primary"
    },
    {
      "type": "Field",
      "label": "Email",
      "model": "credentials.email",
      "dataType": "email",  // ← dataType이 role
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
      "behavior": { "action": "submit" }
    }
  ]
}
```

</details>

---

## 실습 2: 프로필 카드

프로필 카드를 구성하세요:

```
┌─────────────────────┐
│ Teo                 │  ← 이름 (제목)
│ Frontend Developer  │  ← 직책 (본문)
│ Seoul, Korea        │  ← 위치 (캡션)
│                     │
│ [Edit] [Message]    │  ← 버튼들
└─────────────────────┘
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Card",  // ← 카드 역할
  "children": [
    {
      "type": "Text",
      "role": "Title",  // ← 제목
      "content": "Teo",
      "prominence": "Primary"
    },
    {
      "type": "Text",
      "role": "Body",  // ← 본문
      "content": "Frontend Developer",
      "prominence": "Secondary"
    },
    {
      "type": "Text",
      "role": "Caption",  // ← 캡션
      "content": "Seoul, Korea",
      "prominence": "Tertiary"
    },
    {
      "type": "Group",
      "role": "Toolbar",  // ← 버튼 그룹
      "children": [
        {
          "type": "Action",
          "label": "Edit",
          "prominence": "Secondary"
        },
        {
          "type": "Action",
          "label": "Message",
          "prominence": "Primary",
          "intent": "Brand"
        }
      ]
    }
  ]
}
```

</details>

---

## 실습 3: 사이드바 레이아웃

페이지를 사이드바 + 메인으로 구성하세요:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Page",
  "title": "Dashboard",
  "children": [
    // 사이드바
    {
      "type": "Section",
      "role": "Navigator",  // ← 네비게이션 역할
      "density": "Compact",
      "children": [
        {
          "type": "Group",
          "role": "List",  // ← 리스트 역할
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
      "role": "Container",  // ← 메인 컨텐츠 역할
      "children": [
        {
          "type": "Group",
          "role": "Container",
          "children": [
            { "type": "Text", "role": "Title", "content": "Dashboard" }
          ]
        }
      ]
    }
  ]
}
```

</details>

---

## 흔한 실수

### 실수 1: Role 생략

```json
// ❌ Wrong: Group에 role 없음
{
  "type": "Group",
  // role이 없음 → 의미 불명
  "children": [...]
}

// ✅ Correct: 명확한 role
{
  "type": "Group",
  "role": "Form",  // 폼이라는 의미 명확
  "children": [...]
}
```

### 실수 2: 잘못된 Role 선택

```json
// ❌ Wrong: 버튼 그룹인데 Form
{
  "type": "Group",
  "role": "Form",  // ← 버튼만 있는데 Form???
  "children": [
    { "type": "Action", "label": "Edit" },
    { "type": "Action", "label": "Delete" }
  ]
}

// ✅ Correct: Toolbar 사용
{
  "type": "Group",
  "role": "Toolbar",
  "children": [...]
}
```

### 실수 3: 중첩 구조 무시

```json
// ❌ Wrong: Section에 Text 직접
{
  "type": "Section",
  "role": "Container",
  "children": [
    { "type": "Text", "content": "Title" }  // ← Section은 Group만 가능
  ]
}

// ✅ Correct: Group으로 감싸기
{
  "type": "Section",
  "role": "Container",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "content": "Title" }
      ]
    }
  ]
}
```

---

## Role 선택 가이드

### Text Role

```
Title → 제목 (h1-h6)
Body → 본문 (p)
Label → 라벨, 태그 (span)
Caption → 캡션, 힌트 (small)
Code → 코드 (code)
```

### Group Role

```
Container → 일반 묶음
Form → 입력 폼
Toolbar → 버튼 그룹
Card → 카드
List → 세로 목록
Grid → 카드 그리드
Table → 데이터 테이블
```

### Section Role

```
Container → 메인 영역
Header → 상단 고정
Footer → 하단 고정
Navigator → 사이드바/탭바
Aside → 보조 패널
```

### Overlay Role

```
Dialog → 중앙 모달
Drawer → 사이드 패널
Toast → 알림
Popover → 팝업 메뉴
Tooltip → 힌트
```

---

## 핵심 정리

### Role의 3가지 원칙

1. **의미를 명확히** - "무엇인가?"에 답할 것
2. **구조를 지킬 것** - Section > Group > Primitives
3. **일관성을 유지** - 같은 역할엔 같은 Role

### 계층 구조

```
Page
 └─ Section (Container, Header, Navigator)
     └─ Group (Form, Toolbar, Card, List, Table)
         └─ Text (Title, Body, Label)
         └─ Field (dataType으로 구분)
         └─ Action (prominence/intent로 구분)
```

---

## 다음 단계

Role까지 완벽히 이해했습니다!
이제 **4가지 속성을 조합**하는 법을 배워봅시다.

**다음**: [속성 조합하기 →](./05-combining-properties.md)

**관련 문서**:
- [구조 이해하기](../02-structure/) (Level 2) - 노드 타입 상세
- [실전 패턴](../04-patterns/) (Level 4) - 자주 쓰는 조합

---

**이전**: [← Density 시스템](./03-density.md)
**다음**: [속성 조합하기 →](./05-combining-properties.md)
