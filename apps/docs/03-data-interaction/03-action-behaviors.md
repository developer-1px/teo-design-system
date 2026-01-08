# Action 동작: 7가지 behavior 마스터하기 🎯

**예상 소요 시간**: 13분
**난이도**: ⭐⭐⭐ 중급
**사전 지식**: [Primitives](../02-structure/01-primitives.md), [Overlay](../02-structure/04-overlay.md)

---

## 이 문서를 읽고 나면

- 7가지 Action behavior를 완벽히 이해합니다
- 상황에 맞는 적절한 behavior를 선택할 수 있습니다
- confirm, onSuccess, onError를 활용할 수 있습니다

---

## behavior란?

> **"Action을 클릭하면 무슨 일이 일어나는지 선언"**

behavior는 **동작의 의도**를 선언합니다. 구현이 아닌 목적을 정의합니다.

```json
{
  "type": "Action",
  "label": "Save",
  "behavior": {
    "action": "submit"  // ← "폼을 제출한다"는 의도
  }
}
```

---

## 7가지 Action behavior

### 1. command - 서버 명령 실행

**의미**: API 엔드포인트 호출

**용도**: 삭제, 발행, 승인 등

```json
{
  "type": "Action",
  "label": "Delete User",
  "prominence": "Secondary",
  "intent": "Critical",
  "behavior": {
    "action": "command",
    "endpoint": "/api/users/{id}",
    "method": "DELETE",
    "params": {
      "id": "user.id"
    }
  }
}
```

**실행 흐름**:
```
1. 버튼 클릭
2. DELETE /api/users/123 호출
3. 성공 시: onSuccess 실행
4. 실패 시: onError 실행
```

---

### 2. navigate - 페이지 이동

**의미**: 다른 페이지로 라우팅

**용도**: 링크, 상세 보기, 목록으로 돌아가기

```json
{
  "type": "Action",
  "label": "View Profile",
  "prominence": "Tertiary",
  "intent": "Brand",
  "behavior": {
    "action": "navigate",
    "to": "/users/{id}",
    "params": {
      "id": "user.id"
    }
  }
}
```

**렌더링**:
```html
<a href="/users/123">View Profile</a>
```

**동적 URL**:
```json
// 변수 치환
{
  "to": "/users/{userId}/posts/{postId}",
  "params": {
    "userId": "user.id",
    "postId": "post.id"
  }
}
// → /users/123/posts/456
```

---

### 3. submit - 폼 제출

**의미**: 현재 Form의 데이터를 제출

**용도**: 저장, 생성, 업데이트

```json
{
  "type": "Action",
  "label": "Save",
  "prominence": "Primary",
  "intent": "Positive",
  "behavior": {
    "action": "submit",
    "endpoint": "/api/users",
    "method": "POST"
  }
}
```

**실행 흐름**:
```
1. Form 내 모든 Field 검증
2. 검증 실패 시: 에러 표시, 중단
3. 검증 성공 시: POST /api/users 호출
4. 서버 응답 처리
```

**자동 데이터 수집**:
```json
// Form 내 Field들
{
  "type": "Group",
  "role": "Form",
  "children": [
    { "type": "Field", "model": "user.name", "dataType": "text" },
    { "type": "Field", "model": "user.email", "dataType": "email" },
    { "type": "Action", "label": "Save", "behavior": { "action": "submit" } }
  ]
}

// 자동으로 수집되는 데이터
{
  "user": {
    "name": "Teo",
    "email": "teo@example.com"
  }
}
```

---

### 4. reset - 폼 초기화

**의미**: Form을 초기 상태로 되돌림

**용도**: 취소, 초기화

```json
{
  "type": "Action",
  "label": "Reset",
  "prominence": "Secondary",
  "intent": "Neutral",
  "behavior": {
    "action": "reset"
  }
}
```

**실행 흐름**:
```
1. 모든 Field를 초기값으로 복원
2. 검증 에러 초기화
3. dirty 상태 초기화
```

---

### 5. open - Overlay 열기

**의미**: 특정 Overlay를 표시

**용도**: 모달 열기, 드로어 열기

```json
{
  "type": "Action",
  "label": "Edit",
  "prominence": "Tertiary",
  "intent": "Brand",
  "behavior": {
    "action": "open",
    "overlay": "edit-modal"  // ← Overlay id
  }
}
```

**Overlay 정의**:
```json
{
  "type": "Overlay",
  "id": "edit-modal",  // ← 매칭
  "role": "Dialog",
  "children": [...]
}
```

---

### 6. close - Overlay 닫기

**의미**: 현재 Overlay를 닫기

**용도**: 모달 닫기, 드로어 닫기

```json
{
  "type": "Action",
  "label": "Cancel",
  "prominence": "Secondary",
  "behavior": {
    "action": "close"
  }
}
```

**특정 Overlay 닫기**:
```json
{
  "behavior": {
    "action": "close",
    "overlay": "edit-modal"
  }
}
```

---

### 7. toggle - 상태 토글

**의미**: boolean 값 반전

**용도**: 좋아요, 북마크, 팔로우

```json
{
  "type": "Action",
  "label": "Like",
  "prominence": "Tertiary",
  "intent": "Brand",
  "behavior": {
    "action": "toggle",
    "model": "post.isLiked",
    "endpoint": "/api/posts/{id}/like",
    "method": "POST"
  }
}
```

**실행 흐름**:
```
1. post.isLiked를 true ↔ false 반전
2. POST /api/posts/123/like 호출 (optimistic update)
3. 실패 시: 원상 복구
```

---

## confirm - 확인 대화상자

**의미**: 실행 전 사용자 확인

**용도**: 위험한 동작 (삭제, 영구 변경)

```json
{
  "type": "Action",
  "label": "Delete",
  "intent": "Critical",
  "confirm": "This action cannot be undone. Are you sure?",
  "behavior": {
    "action": "command",
    "endpoint": "/api/users/{id}",
    "method": "DELETE"
  }
}
```

**렌더링**:
```javascript
onClick={() => {
  if (window.confirm("This action cannot be undone. Are you sure?")) {
    executeCommand();
  }
}}
```

---

## onSuccess / onError - 결과 처리

### onSuccess - 성공 시

**의미**: 성공 후 실행할 동작

```json
{
  "type": "Action",
  "label": "Save",
  "behavior": {
    "action": "submit",
    "endpoint": "/api/users",
    "method": "POST",
    "onSuccess": {
      "action": "navigate",
      "to": "/users"
    }
  }
}
```

**연쇄 동작**:
```
1. 폼 제출
2. 성공 시: /users로 이동
```

### onError - 실패 시

**의미**: 실패 시 에러 표시

```json
{
  "type": "Action",
  "label": "Delete",
  "behavior": {
    "action": "command",
    "endpoint": "/api/users/{id}",
    "method": "DELETE",
    "onError": {
      "action": "open",
      "overlay": "error-toast"
    }
  }
}
```

**Toast 정의**:
```json
{
  "type": "Overlay",
  "id": "error-toast",
  "role": "Toast",
  "placement": "top-right",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "intent": "Critical",
      "children": [
        { "type": "Text", "content": "Failed to delete user" }
      ]
    }
  ]
}
```

---

## 실습 1: CRUD 버튼

사용자 상세 페이지의 버튼들:

```
[Back to List] [Edit] [Delete]
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    // Back to List
    {
      "type": "Action",
      "label": "Back to List",
      "prominence": "Tertiary",
      "intent": "Neutral",
      "behavior": {
        "action": "navigate",
        "to": "/users"
      }
    },

    // Edit
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

    // Delete
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
        },
        "onError": {
          "action": "open",
          "overlay": "error-toast"
        }
      }
    }
  ]
}
```

</details>

---

## 실습 2: 모달 폼

버튼을 누르면 모달이 열리고, 폼 제출 후 닫히기:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Page",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "children": [
        // 열기 버튼
        {
          "type": "Action",
          "label": "New User",
          "prominence": "Primary",
          "intent": "Brand",
          "behavior": {
            "action": "open",
            "overlay": "new-user-modal"
          }
        }
      ]
    },

    // 모달
    {
      "type": "Overlay",
      "id": "new-user-modal",
      "role": "Dialog",
      "placement": "center",
      "dismissable": false,
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            { "type": "Text", "role": "Title", "content": "New User" },

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
                  "behavior": {
                    "action": "close"
                  }
                },

                // 저장 → 제출 후 모달 닫기
                {
                  "type": "Action",
                  "label": "Save",
                  "prominence": "Primary",
                  "intent": "Positive",
                  "behavior": {
                    "action": "submit",
                    "endpoint": "/api/users",
                    "method": "POST",
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

</details>

---

## 실습 3: 좋아요 버튼

Toggle + 아이콘 변화:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Action",
  "label": "Like",
  "icon": "heart",  // 또는 "heart-filled" (상태에 따라)
  "prominence": "Tertiary",
  "intent": "Brand",
  "behavior": {
    "action": "toggle",
    "model": "post.isLiked",
    "endpoint": "/api/posts/{id}/like",
    "method": "POST",
    "params": {
      "id": "post.id"
    },
    "onError": {
      "action": "open",
      "overlay": "error-toast"
    }
  },
  "condition": {
    "if": "post.isLiked",
    "then": {
      "icon": "heart-filled",
      "intent": "Positive"
    },
    "else": {
      "icon": "heart",
      "intent": "Neutral"
    }
  }
}
```

</details>

---

## 흔한 실수

### 실수 1: submit vs command 혼동

```json
// ❌ Wrong: Form 밖에서 submit
{
  "type": "Action",
  "label": "Delete",
  "behavior": {
    "action": "submit"  // Form이 없는데 submit?
  }
}

// ✅ Correct: command 사용
{
  "behavior": {
    "action": "command",
    "endpoint": "/api/users/{id}",
    "method": "DELETE"
  }
}
```

**규칙**:
- `submit`: Form 안에서만 사용
- `command`: 독립적인 API 호출

### 실수 2: confirm 누락

```json
// ❌ Wrong: 삭제인데 confirm 없음
{
  "label": "Delete",
  "behavior": {
    "action": "command",
    "method": "DELETE"
  }
}

// ✅ Correct: confirm 추가
{
  "label": "Delete",
  "confirm": "Delete this item? This action cannot be undone.",
  "behavior": { ... }
}
```

### 실수 3: onError 처리 누락

```json
// ❌ Wrong: 에러 처리 없음
{
  "behavior": {
    "action": "command",
    "endpoint": "/api/users/{id}",
    "method": "DELETE"
  }
}

// ✅ Correct: onError 추가
{
  "behavior": {
    "action": "command",
    "endpoint": "/api/users/{id}",
    "method": "DELETE",
    "onError": {
      "action": "open",
      "overlay": "error-toast"
    }
  }
}
```

---

## 핵심 정리

### 7가지 behavior

```
command   → API 호출
navigate  → 페이지 이동
submit    → 폼 제출
reset     → 폼 초기화
open      → Overlay 열기
close     → Overlay 닫기
toggle    → 상태 토글
```

### behavior 선택 가이드

```
API 호출? → command
페이지 이동? → navigate
폼 저장? → submit
폼 취소? → reset
모달 열기? → open
모달 닫기? → close
좋아요/북마크? → toggle
```

### 필수 속성

```
command: endpoint, method
navigate: to
submit: endpoint, method
open: overlay
toggle: model
```

### 추가 속성

```
confirm: 위험한 동작에 반드시 추가
onSuccess: 성공 시 후속 동작
onError: 실패 시 에러 처리
```

---

## 다음 단계

Action behavior를 완벽히 이해했습니다!
이제 **조건부 렌더링**을 배워봅시다.

**다음**: [조건부 렌더링 →](./04-conditional-rendering.md)

---

**이전**: [← 검증과 제약조건](./02-validation.md)
**다음**: [조건부 렌더링 →](./04-conditional-rendering.md)
