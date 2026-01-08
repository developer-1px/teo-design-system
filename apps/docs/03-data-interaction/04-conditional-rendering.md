# 조건부 렌더링: 동적 UI 구성하기 🔀

**예상 소요 시간**: 11분
**난이도**: ⭐⭐⭐⭐ 고급
**사전 지식**: [Field 타입](./01-field-types.md), [Action 동작](./03-action-behaviors.md)

---

## 이 문서를 읽고 나면

- condition 속성을 이해합니다
- 데이터 상태에 따라 UI를 동적으로 변경할 수 있습니다
- if-then-else, switch 패턴을 활용할 수 있습니다

---

## condition이란?

> **"데이터 상태에 따라 UI를 다르게 렌더링"**

condition은 **동적 UI**를 선언합니다. 같은 노드가 상황에 따라 다르게 보입니다.

```json
{
  "type": "Action",
  "label": "Follow",
  "condition": {
    "if": "user.isFollowing",
    "then": {
      "label": "Unfollow",
      "intent": "Neutral"
    },
    "else": {
      "label": "Follow",
      "intent": "Brand"
    }
  }
}
```

**렌더링**:
- `user.isFollowing === true` → `[Unfollow]` (회색)
- `user.isFollowing === false` → `[Follow]` (파란색)

---

## if-then-else 패턴

### 기본 구조

```json
{
  "condition": {
    "if": "expression",     // ← 조건식
    "then": { ... },        // ← 참일 때 속성
    "else": { ... }         // ← 거짓일 때 속성
  }
}
```

### 예시 1: 좋아요 버튼

```json
{
  "type": "Action",
  "label": "Like",
  "icon": "heart",
  "prominence": "Tertiary",
  "condition": {
    "if": "post.isLiked",
    "then": {
      "icon": "heart-filled",
      "intent": "Positive",
      "label": "Unlike"
    },
    "else": {
      "icon": "heart",
      "intent": "Neutral",
      "label": "Like"
    }
  }
}
```

**결과**:
```
isLiked = true  → ❤️ Unlike (빨간색)
isLiked = false → ♡ Like (회색)
```

---

### 예시 2: 상태 배지

```json
{
  "type": "Text",
  "role": "Label",
  "model": "order.status",
  "condition": {
    "if": "order.status === 'completed'",
    "then": {
      "intent": "Positive",
      "content": "✓ Completed"
    },
    "else": {
      "intent": "Caution",
      "content": "⏳ Pending"
    }
  }
}
```

---

## 조건식 문법

### 비교 연산자

```javascript
// 같음
"user.role === 'admin'"

// 다름
"user.status !== 'banned'"

// 크기 비교
"user.age >= 18"
"product.stock > 0"

// 포함 여부
"user.tags.includes('premium')"
```

### 논리 연산자

```javascript
// AND
"user.isActive && user.isVerified"

// OR
"user.role === 'admin' || user.role === 'moderator'"

// NOT
"!user.isBanned"
```

### null/undefined 체크

```javascript
// 값 존재 여부
"user.email != null"

// Truthy 체크
"user.name"

// Falsy 체크
"!user.deletedAt"
```

---

## switch 패턴

### 다중 조건 분기

```json
{
  "type": "Text",
  "role": "Label",
  "model": "order.status",
  "condition": {
    "switch": "order.status",
    "cases": {
      "pending": {
        "content": "⏳ Pending",
        "intent": "Caution"
      },
      "processing": {
        "content": "🔄 Processing",
        "intent": "Info"
      },
      "completed": {
        "content": "✓ Completed",
        "intent": "Positive"
      },
      "cancelled": {
        "content": "✗ Cancelled",
        "intent": "Critical"
      }
    },
    "default": {
      "content": "Unknown",
      "intent": "Neutral"
    }
  }
}
```

---

## hidden - 조건부 표시/숨김

### 기본 사용

```json
{
  "type": "Action",
  "label": "Admin Panel",
  "hidden": "user.role !== 'admin'",
  "behavior": {
    "action": "navigate",
    "to": "/admin"
  }
}
```

**결과**:
- `user.role === 'admin'` → 버튼 표시
- `user.role !== 'admin'` → 버튼 숨김

---

### 예시: 조건부 필드

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Field",
      "label": "Account Type",
      "model": "user.accountType",
      "dataType": "radio",
      "options": [
        { "value": "personal", "label": "Personal" },
        { "value": "business", "label": "Business" }
      ]
    },

    // Business 선택 시에만 표시
    {
      "type": "Field",
      "label": "Company Name",
      "model": "user.companyName",
      "dataType": "text",
      "hidden": "user.accountType !== 'business'"
    }
  ]
}
```

---

## 실습 1: 사용자 역할별 버튼

역할에 따라 다른 버튼 표시:

```
일반 사용자: [Edit Profile]
관리자:     [Edit Profile] [Admin Panel] [Delete User]
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    // 모든 사용자에게 표시
    {
      "type": "Action",
      "label": "Edit Profile",
      "prominence": "Secondary",
      "intent": "Brand",
      "behavior": {
        "action": "navigate",
        "to": "/profile/edit"
      }
    },

    // 관리자에게만 표시
    {
      "type": "Action",
      "label": "Admin Panel",
      "prominence": "Secondary",
      "intent": "Info",
      "hidden": "currentUser.role !== 'admin'",
      "behavior": {
        "action": "navigate",
        "to": "/admin"
      }
    },

    // 관리자에게만 표시 (위험한 동작)
    {
      "type": "Action",
      "label": "Delete User",
      "prominence": "Secondary",
      "intent": "Critical",
      "hidden": "currentUser.role !== 'admin'",
      "confirm": "Delete this user permanently?",
      "behavior": {
        "action": "command",
        "endpoint": "/api/users/{id}",
        "method": "DELETE"
      }
    }
  ]
}
```

</details>

---

## 실습 2: 주문 상태 표시

주문 상태에 따라 다른 UI:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Order #12345"
    },

    // 상태 배지 (switch 패턴)
    {
      "type": "Text",
      "role": "Label",
      "model": "order.status",
      "condition": {
        "switch": "order.status",
        "cases": {
          "pending": {
            "content": "⏳ Pending Payment",
            "intent": "Caution"
          },
          "processing": {
            "content": "📦 Processing",
            "intent": "Info"
          },
          "shipped": {
            "content": "🚚 Shipped",
            "intent": "Brand"
          },
          "delivered": {
            "content": "✓ Delivered",
            "intent": "Positive"
          },
          "cancelled": {
            "content": "✗ Cancelled",
            "intent": "Critical"
          }
        }
      }
    },

    // 상태별 버튼
    {
      "type": "Group",
      "role": "Toolbar",
      "children": [
        // Pending → Pay 버튼
        {
          "type": "Action",
          "label": "Pay Now",
          "prominence": "Primary",
          "intent": "Brand",
          "hidden": "order.status !== 'pending'",
          "behavior": {
            "action": "navigate",
            "to": "/checkout/{id}",
            "params": { "id": "order.id" }
          }
        },

        // Processing/Shipped → Track 버튼
        {
          "type": "Action",
          "label": "Track Order",
          "prominence": "Secondary",
          "intent": "Info",
          "hidden": "order.status !== 'processing' && order.status !== 'shipped'",
          "behavior": {
            "action": "navigate",
            "to": "/orders/{id}/track",
            "params": { "id": "order.id" }
          }
        },

        // Pending → Cancel 버튼
        {
          "type": "Action",
          "label": "Cancel Order",
          "prominence": "Tertiary",
          "intent": "Critical",
          "hidden": "order.status !== 'pending'",
          "confirm": "Cancel this order?",
          "behavior": {
            "action": "command",
            "endpoint": "/api/orders/{id}/cancel",
            "method": "POST"
          }
        }
      ]
    }
  ]
}
```

</details>

---

## 실습 3: 로그인/로그아웃 상태

사용자 인증 상태에 따라:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Section",
  "role": "Header",
  "children": [
    {
      "type": "Group",
      "role": "Toolbar",
      "children": [
        // 로그인 시: 사용자 이름 + 로그아웃
        {
          "type": "Group",
          "role": "Inline",
          "hidden": "!currentUser",
          "children": [
            {
              "type": "Text",
              "role": "Body",
              "content": "Welcome, {name}",
              "model": "currentUser.name"
            },
            {
              "type": "Action",
              "label": "Logout",
              "prominence": "Tertiary",
              "intent": "Neutral",
              "behavior": {
                "action": "command",
                "endpoint": "/api/auth/logout",
                "method": "POST",
                "onSuccess": {
                  "action": "navigate",
                  "to": "/"
                }
              }
            }
          ]
        },

        // 비로그인 시: 로그인/회원가입
        {
          "type": "Group",
          "role": "Toolbar",
          "hidden": "currentUser != null",
          "children": [
            {
              "type": "Action",
              "label": "Sign In",
              "prominence": "Tertiary",
              "intent": "Neutral",
              "behavior": {
                "action": "navigate",
                "to": "/login"
              }
            },
            {
              "type": "Action",
              "label": "Sign Up",
              "prominence": "Primary",
              "intent": "Brand",
              "behavior": {
                "action": "navigate",
                "to": "/signup"
              }
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

## 흔한 실수

### 실수 1: 복잡한 조건식

```json
// ❌ Wrong: 읽기 어려움
{
  "hidden": "(user.role !== 'admin' && user.role !== 'moderator') || (user.isBanned || !user.isVerified)"
}

// ✅ Correct: 데이터에 계산된 속성 추가
// Backend에서:
user.canAccess = user.role === 'admin' || user.role === 'moderator'
user.isEligible = !user.isBanned && user.isVerified

// IDDL에서:
{
  "hidden": "!user.canAccess || !user.isEligible"
}
```

### 실수 2: then/else에 중복

```json
// ❌ Wrong: 중복된 속성
{
  "type": "Action",
  "label": "Follow",
  "prominence": "Secondary",  // ← 중복
  "behavior": { ... },        // ← 중복
  "condition": {
    "if": "user.isFollowing",
    "then": {
      "label": "Unfollow",
      "prominence": "Secondary",  // ← 불필요
      "behavior": { ... }         // ← 불필요
    }
  }
}

// ✅ Correct: 변경되는 속성만
{
  "type": "Action",
  "label": "Follow",
  "prominence": "Secondary",
  "behavior": { ... },
  "condition": {
    "if": "user.isFollowing",
    "then": {
      "label": "Unfollow"  // ← 변경되는 것만
    }
  }
}
```

### 실수 3: hidden 대신 condition 남용

```json
// ❌ Wrong: condition으로 완전히 다른 UI
{
  "type": "Action",
  "label": "Button",
  "condition": {
    "if": "user.role === 'admin'",
    "then": {
      "label": "Admin Panel",
      "intent": "Info",
      "behavior": { "action": "navigate", "to": "/admin" }
    },
    "else": {
      "label": "Profile",
      "intent": "Brand",
      "behavior": { "action": "navigate", "to": "/profile" }
    }
  }
}

// ✅ Correct: 별도의 Action + hidden
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    {
      "type": "Action",
      "label": "Admin Panel",
      "hidden": "user.role !== 'admin'",
      "behavior": { "action": "navigate", "to": "/admin" }
    },
    {
      "type": "Action",
      "label": "Profile",
      "hidden": "user.role === 'admin'",
      "behavior": { "action": "navigate", "to": "/profile" }
    }
  ]
}
```

---

## 핵심 정리

### condition 패턴

```
if-then-else: 두 가지 상태
switch: 여러 가지 상태
hidden: 표시/숨김만
```

### 조건식

```
비교: ===, !==, >, <, >=, <=
논리: &&, ||, !
포함: .includes()
존재: != null, !variable
```

### 사용 원칙

```
1. condition: 같은 요소의 다른 모습
2. hidden: 완전히 표시/숨김
3. 별도 노드: 완전히 다른 요소
```

### Best Practice

```
✓ 단순한 조건식 사용
✓ 복잡한 로직은 백엔드에서 계산
✓ 변경되는 속성만 then/else에
✗ 과도하게 중첩된 조건 피하기
```

---

## 다음 단계

조건부 렌더링을 완벽히 이해했습니다!
마지막으로 **상태 관리**를 배워봅시다.

**다음**: [상태 관리 →](./05-state-management.md)

---

**이전**: [← Action 동작](./03-action-behaviors.md)
**다음**: [상태 관리 →](./05-state-management.md)
