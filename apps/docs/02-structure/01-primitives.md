# Primitives: UI의 최소 단위 🧱

**예상 소요 시간**: 12분
**난이도**: ⭐⭐ 기초
**사전 지식**: [속성 조합하기](../01-fundamentals/05-combining-properties.md)

---

## 이 문서를 읽고 나면

- Text, Field, Action의 차이를 완벽히 이해합니다
- 언제 어떤 Primitive를 써야 할지 판단할 수 있습니다
- Primitive만으로 의미 있는 UI를 만들 수 있습니다

---

## Primitive란?

> **"더 이상 쪼갤 수 없는 최소 단위"** - Leaf Nodes

Primitive는 IDDL의 **잎(Leaf) 노드**입니다. 자식을 가질 수 없습니다.

```
Group (Container)
 ├─ Text ✓    ← Primitive (자식 없음)
 ├─ Field ✓   ← Primitive (자식 없음)
 └─ Action ✓  ← Primitive (자식 없음)
```

---

## 3가지 Primitive

### 1. Text - 정적 콘텐츠

**의미**: "데이터 바인딩이 없는 순수한 고정 텍스트"

**언제 사용**:
- 제목, 설명, 라벨
- 변하지 않는 콘텐츠
- 장식 텍스트

**주요 속성**:
- `role`: Title, Body, Label, Caption, Code
- `content`: 텍스트 내용 (고정값)
- `prominence`: 시각적 강조
- `align`: left, center, right

```json
{
  "type": "Text",
  "role": "Title",
  "content": "Welcome to Dashboard",
  "prominence": "Hero"
}
```

### 2. Field - 동적 데이터

**의미**: "데이터베이스와 바인딩되는 동적 값"

**언제 사용**:
- 사용자 이름, 이메일 등 DB 데이터
- 입력 폼 (mode="edit")
- 읽기 전용 데이터 표시 (mode="view")

**주요 속성**:
- `label`: 필드명
- `model`: 데이터 경로 (예: "user.email")
- `dataType`: text, number, email, date, boolean 등
- `required`: 필수 여부

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "required": true
}
```

### 3. Action - 인터랙션

**의미**: "클릭하면 무언가 실행되는 트리거"

**언제 사용**:
- 버튼
- 링크
- 명령 실행

**주요 속성**:
- `label`: 버튼 텍스트
- `behavior`: 동작 정의 (command, navigate, submit 등)
- `prominence`: 시각적 강조
- `intent`: 의미/색상

```json
{
  "type": "Action",
  "label": "Save Changes",
  "prominence": "Primary",
  "intent": "Positive",
  "behavior": {
    "action": "submit"
  }
}
```

---

## Text vs Field vs Action

| | Text | Field | Action |
|---|------|-------|--------|
| **데이터 바인딩** | ✗ 없음 | ✓ 있음 | ✗ 없음 |
| **편집 가능** | ✗ 불가 | ✓ mode="edit" 시 | ✗ 불가 |
| **클릭 가능** | ✗ 불가 | ✗ 불가 | ✓ 가능 |
| **예시** | "Welcome", "총 합계" | 사용자 이름, 이메일 | Save, Delete, 링크 |

---

## Text 노드 상세

### role별 렌더링

```json
// Title → <h1>, <h2> 등
{
  "type": "Text",
  "role": "Title",
  "content": "Dashboard",
  "prominence": "Hero"
}
// → <h1 class="text-4xl font-bold">Dashboard</h1>

// Body → <p>
{
  "type": "Text",
  "role": "Body",
  "content": "Welcome back, Teo"
}
// → <p>Welcome back, Teo</p>

// Label → <span> (짧은 태그)
{
  "type": "Text",
  "role": "Label",
  "content": "New",
  "intent": "Positive"
}
// → <span class="badge badge-success">New</span>

// Caption → <small> (부연 설명)
{
  "type": "Text",
  "role": "Caption",
  "content": "Last updated 2 hours ago",
  "prominence": "Tertiary"
}
// → <small class="text-gray-400">Last updated 2 hours ago</small>

// Code → <code>
{
  "type": "Text",
  "role": "Code",
  "content": "npm install iddl"
}
// → <code>npm install iddl</code>
```

### 정렬 (align)

```json
// 왼쪽 정렬 (기본값)
{ "align": "left" }

// 중앙 정렬
{
  "type": "Text",
  "role": "Title",
  "content": "404 Not Found",
  "align": "center",
  "prominence": "Hero"
}

// 오른쪽 정렬
{
  "type": "Text",
  "role": "Body",
  "content": "Total: $1,234",
  "align": "right"
}
```

---

## Field 노드 상세

### mode에 따른 렌더링

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email"
}
```

**mode="view"** (읽기 전용):
```html
<div>
  <label>Email</label>
  <div>teo@example.com</div>
</div>
```

**mode="edit"** (편집 가능):
```html
<div>
  <label>Email</label>
  <input type="email" value="teo@example.com" />
</div>
```

### dataType 종류

| dataType | view 모드 | edit 모드 |
|----------|-----------|-----------|
| `text` | 일반 텍스트 | `<input type="text">` |
| `email` | 이메일 링크 | `<input type="email">` |
| `number` | 숫자 | `<input type="number">` |
| `date` | 날짜 포맷 | Date Picker |
| `boolean` | Yes/No | Toggle/Checkbox |
| `select` | 선택된 항목 | Dropdown |
| `password` | ••••• | `<input type="password">` |
| `textarea` | 여러 줄 텍스트 | `<textarea>` |
| `currency` | $1,234.56 | Currency Input |
| `phone` | 전화번호 링크 | Phone Input |

### required와 placeholder

```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "required": true,          // ← 필수 항목
  "placeholder": "Enter your username",
  "constraints": {
    "minLength": 3,
    "maxLength": 20
  }
}
```

---

## Action 노드 상세

### behavior 종류

```json
// 1. Command (함수 실행)
{
  "type": "Action",
  "label": "Delete",
  "behavior": {
    "action": "command",
    "command": "user.delete",
    "args": { "id": "123" }
  }
}

// 2. Navigate (페이지 이동)
{
  "type": "Action",
  "label": "View Profile",
  "behavior": {
    "action": "navigate",
    "to": "/profile/123"
  }
}

// 3. Submit (폼 제출)
{
  "type": "Action",
  "label": "Save",
  "behavior": {
    "action": "submit"
  }
}

// 4. Open (오버레이 열기)
{
  "type": "Action",
  "label": "Edit",
  "behavior": {
    "action": "open",
    "overlay": "edit-modal"
  }
}

// 5. Close (오버레이 닫기)
{
  "type": "Action",
  "label": "Cancel",
  "behavior": {
    "action": "close"
  }
}
```

### confirm 메시지

```json
{
  "type": "Action",
  "label": "Delete Account",
  "intent": "Critical",
  "confirm": "This action cannot be undone. Are you sure?",
  "behavior": {
    "action": "command",
    "command": "account.delete"
  }
}
```

**렌더링**:
```javascript
onClick={() => {
  if (window.confirm("This action cannot be undone. Are you sure?")) {
    executeCommand("account.delete");
  }
}}
```

### icon 속성

```json
{
  "type": "Action",
  "label": "Download",
  "icon": "download",        // ← 아이콘 이름
  "prominence": "Secondary"
}
```

---

## 실습 1: 프로필 카드 (Primitive만)

Primitive 3개만 사용하여 프로필 카드를 만드세요:

```
Teo                    ← 이름 (고정)
teo@example.com        ← 이메일 (동적)
[Edit Profile]         ← 버튼
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    // Text: 이름 (고정)
    {
      "type": "Text",
      "role": "Title",
      "content": "Teo",
      "prominence": "Primary"
    },

    // Field: 이메일 (동적)
    {
      "type": "Field",
      "label": "Email",
      "model": "user.email",
      "dataType": "email"
    },

    // Action: 버튼
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

</details>

---

## 실습 2: 로그인 폼

Primitive만으로 로그인 폼을 만드세요:

```
Sign In                ← 제목
Email:    [________]   ← 입력
Password: [________]   ← 입력
[Sign In]              ← 버튼
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    // Text: 제목
    {
      "type": "Text",
      "role": "Title",
      "content": "Sign In",
      "prominence": "Primary"
    },

    // Field: 이메일
    {
      "type": "Field",
      "label": "Email",
      "model": "credentials.email",
      "dataType": "email",
      "required": true
    },

    // Field: 비밀번호
    {
      "type": "Field",
      "label": "Password",
      "model": "credentials.password",
      "dataType": "password",
      "required": true
    },

    // Action: 로그인 버튼
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

## 실습 3: 알림 메시지

성공/에러 알림을 만드세요:

```
✓ Success              ← 제목
Profile updated!       ← 내용
[Close]                ← 버튼
```

<details>
<summary>정답 보기</summary>

```json
// 성공 알림
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
      "behavior": {
        "action": "close"
      }
    }
  ]
}

// 에러 알림
{
  "type": "Group",
  "role": "Card",
  "intent": "Critical",  // ← 빨간색
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Error",
      "prominence": "Secondary"
    },
    {
      "type": "Text",
      "role": "Body",
      "content": "Failed to update profile",
      "prominence": "Tertiary"
    },
    {
      "type": "Action",
      "label": "Retry",
      "prominence": "Secondary",
      "intent": "Critical",
      "behavior": {
        "action": "command",
        "command": "profile.update"
      }
    }
  ]
}
```

</details>

---

## 핵심 정리

### Primitive 선택 가이드

```
고정 텍스트?       → Text
DB 데이터?        → Field
클릭 가능한 버튼?  → Action
```

### 필수 속성

**Text**:
- `role`: Title, Body, Label, Caption, Code
- `content`: 텍스트 내용

**Field**:
- `label`: 필드명
- `model`: 데이터 경로
- `dataType`: 데이터 타입

**Action**:
- `label`: 버튼 텍스트
- `behavior`: 동작 정의

### 공통 속성

모든 Primitive는 다음을 가질 수 있음:
- `prominence`: Hero, Primary, Secondary, Tertiary
- `intent`: Neutral, Brand, Positive, Caution, Critical, Info
- `hidden`: 숨김 여부
- `condition`: 조건부 렌더링

---

## 다음 단계

Primitive를 완벽히 이해했습니다!
이제 Primitive를 **묶는** Group을 배워봅시다.

**다음**: [Group 컨테이너 →](./02-group.md)

**관련 문서**:
- [Field dataType 전체 목록](../03-data-interaction/01-field-types.md)
- [Action behavior 전체 목록](../03-data-interaction/03-action-behaviors.md)
- [실전: 폼 패턴](../04-patterns/03-form-patterns.md)

---

**이전**: [← 속성 조합하기](../01-fundamentals/05-combining-properties.md)
**다음**: [Group 컨테이너 →](./02-group.md)
