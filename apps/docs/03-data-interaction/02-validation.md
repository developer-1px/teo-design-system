# 검증과 제약조건: 안전한 데이터 입력 🛡️

**예상 소요 시간**: 12분
**난이도**: ⭐⭐⭐ 중급
**사전 지식**: [Field 타입](./01-field-types.md)

---

## 이 문서를 읽고 나면

- constraints 속성을 완벽히 이해합니다
- 클라이언트/서버 검증의 차이를 알게 됩니다
- 적절한 에러 메시지를 작성할 수 있습니다

---

## constraints란?

> **"Field가 받아들일 수 있는 값의 범위를 선언"**

constraints는 **데이터 무결성**을 보장합니다. 사용자가 잘못된 값을 입력하는 것을 방지합니다.

```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "required": true,
  "constraints": {
    "minLength": 3,
    "maxLength": 20,
    "pattern": "^[a-zA-Z0-9_]+$"
  }
}
```

---

## required - 필수 여부

**의미**: 반드시 값이 있어야 함

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "required": true  // ← 필수 항목
}
```

**렌더링**:
```html
<label>
  Email <span class="text-red-500">*</span>
</label>
<input type="email" required />
```

**검증 에러**:
```
This field is required.
```

---

## 문자열 제약 (text, textarea, richtext)

### minLength / maxLength

**의미**: 최소/최대 글자 수

```json
{
  "type": "Field",
  "label": "Bio",
  "model": "user.bio",
  "dataType": "textarea",
  "constraints": {
    "minLength": 10,
    "maxLength": 500
  }
}
```

**검증 에러**:
```
Bio must be at least 10 characters.
Bio must not exceed 500 characters.
```

### pattern (정규표현식)

**의미**: 특정 패턴만 허용

```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "constraints": {
    "pattern": "^[a-zA-Z0-9_]+$"
  }
}
```

**검증 에러**:
```
Username can only contain letters, numbers, and underscores.
```

**자주 쓰는 패턴**:
```javascript
// 영문자+숫자만
"pattern": "^[a-zA-Z0-9]+$"

// 한글만
"pattern": "^[가-힣]+$"

// 영문자만
"pattern": "^[a-zA-Z]+$"

// URL slug (소문자+하이픈)
"pattern": "^[a-z0-9-]+$"
```

---

## 숫자 제약 (number, currency, range)

### min / max

**의미**: 최소/최대 값

```json
{
  "type": "Field",
  "label": "Age",
  "model": "user.age",
  "dataType": "number",
  "constraints": {
    "min": 18,
    "max": 120
  }
}
```

**검증 에러**:
```
Age must be at least 18.
Age must not exceed 120.
```

### step

**의미**: 증감 단위

```json
{
  "type": "Field",
  "label": "Price",
  "model": "product.price",
  "dataType": "currency",
  "constraints": {
    "min": 0,
    "step": 0.01  // ← 0.01 단위로 증감
  }
}
```

---

## 날짜 제약 (date, datetime)

### min / max

**의미**: 최소/최대 날짜

```json
{
  "type": "Field",
  "label": "Birth Date",
  "model": "user.birthDate",
  "dataType": "date",
  "constraints": {
    "max": "2007-01-01"  // ← 2007년 이전 출생만 (18세 이상)
  }
}
```

**검증 에러**:
```
Birth Date must be before 2007-01-01.
```

### 동적 날짜 제약

```json
// 오늘 이후 날짜만 허용
{
  "label": "Event Date",
  "model": "event.date",
  "dataType": "date",
  "constraints": {
    "min": "$today"  // ← 동적 값 (오늘)
  }
}

// 지난 1년 내 날짜만
{
  "label": "Invoice Date",
  "model": "invoice.date",
  "dataType": "date",
  "constraints": {
    "min": "$today-365d",
    "max": "$today"
  }
}
```

---

## 파일 제약 (file, image)

### accept

**의미**: 허용할 파일 타입

```json
{
  "type": "Field",
  "label": "Profile Picture",
  "model": "user.avatar",
  "dataType": "image",
  "constraints": {
    "accept": "image/png,image/jpeg",
    "maxSize": 2097152  // ← 2MB (bytes)
  }
}
```

**accept 패턴**:
```javascript
// 특정 MIME 타입
"accept": "image/png,image/jpeg"

// 파일 확장자
"accept": ".pdf,.docx"

// 모든 이미지
"accept": "image/*"

// 모든 비디오
"accept": "video/*"
```

### maxSize

**의미**: 최대 파일 크기 (bytes)

```json
{
  "constraints": {
    "maxSize": 5242880  // 5MB
  }
}
```

**검증 에러**:
```
File size must not exceed 5MB.
```

---

## 선택 제약 (multiselect, checkbox)

### minItems / maxItems

**의미**: 최소/최대 선택 개수

```json
{
  "type": "Field",
  "label": "Tags",
  "model": "post.tags",
  "dataType": "multiselect",
  "constraints": {
    "minItems": 1,
    "maxItems": 5
  },
  "options": [...]
}
```

**검증 에러**:
```
Please select at least 1 tag.
Please select no more than 5 tags.
```

---

## 커스텀 검증 메시지

### errorMessage

**의미**: 커스텀 에러 메시지

```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "required": true,
  "constraints": {
    "minLength": 3,
    "pattern": "^[a-zA-Z0-9_]+$"
  },
  "errorMessages": {
    "required": "아이디를 입력해주세요",
    "minLength": "아이디는 최소 3자 이상이어야 합니다",
    "pattern": "아이디는 영문자, 숫자, 밑줄(_)만 사용할 수 있습니다"
  }
}
```

---

## 클라이언트 vs 서버 검증

### 클라이언트 검증

**장점**: 즉각적인 피드백

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "required": true,
  "constraints": {
    "pattern": "^[^@]+@[^@]+\\.[^@]+$"
  }
}
```

**렌더링** (실시간 검증):
```html
<input
  type="email"
  required
  pattern="^[^@]+@[^@]+\.[^@]+$"
  onBlur={validate}
/>
```

### 서버 검증

**필수**: 보안을 위해 서버에서도 반드시 검증

```json
{
  "type": "Action",
  "label": "Submit",
  "behavior": {
    "action": "submit",
    "endpoint": "/api/users",
    "method": "POST",
    "onError": {
      "type": "Overlay",
      "role": "Toast",
      "intent": "Critical",
      "children": [
        { "type": "Text", "model": "error.message" }
      ]
    }
  }
}
```

**서버 응답**:
```json
{
  "errors": {
    "email": "Email already exists"
  }
}
```

---

## 실습 1: 회원가입 폼 검증

완전한 검증이 있는 회원가입 폼:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Field",
      "label": "Username",
      "model": "user.username",
      "dataType": "text",
      "required": true,
      "placeholder": "3-20자, 영문자/숫자/밑줄만",
      "constraints": {
        "minLength": 3,
        "maxLength": 20,
        "pattern": "^[a-zA-Z0-9_]+$"
      },
      "errorMessages": {
        "required": "아이디를 입력해주세요",
        "minLength": "아이디는 최소 3자 이상이어야 합니다",
        "maxLength": "아이디는 최대 20자까지 가능합니다",
        "pattern": "영문자, 숫자, 밑줄(_)만 사용할 수 있습니다"
      }
    },
    {
      "type": "Field",
      "label": "Email",
      "model": "user.email",
      "dataType": "email",
      "required": true,
      "errorMessages": {
        "required": "이메일을 입력해주세요",
        "pattern": "올바른 이메일 형식이 아닙니다"
      }
    },
    {
      "type": "Field",
      "label": "Password",
      "model": "user.password",
      "dataType": "password",
      "required": true,
      "placeholder": "최소 8자, 영문+숫자+특수문자 포함",
      "constraints": {
        "minLength": 8,
        "pattern": "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$"
      },
      "errorMessages": {
        "required": "비밀번호를 입력해주세요",
        "minLength": "비밀번호는 최소 8자 이상이어야 합니다",
        "pattern": "영문자, 숫자, 특수문자를 모두 포함해야 합니다"
      }
    },
    {
      "type": "Field",
      "label": "Confirm Password",
      "model": "user.confirmPassword",
      "dataType": "password",
      "required": true,
      "constraints": {
        "match": "user.password"
      },
      "errorMessages": {
        "match": "비밀번호가 일치하지 않습니다"
      }
    },
    {
      "type": "Field",
      "label": "Age",
      "model": "user.age",
      "dataType": "number",
      "required": true,
      "constraints": {
        "min": 18,
        "max": 120
      },
      "errorMessages": {
        "min": "만 18세 이상만 가입 가능합니다"
      }
    },
    {
      "type": "Field",
      "label": "Terms of Service",
      "model": "user.agreedToTerms",
      "dataType": "boolean",
      "required": true,
      "errorMessages": {
        "required": "이용약관에 동의해주세요"
      }
    },
    {
      "type": "Group",
      "role": "Toolbar",
      "children": [
        {
          "type": "Action",
          "label": "Sign Up",
          "prominence": "Primary",
          "intent": "Brand",
          "behavior": {
            "action": "submit"
          }
        }
      ]
    }
  ]
}
```

</details>

---

## 실습 2: 제품 등록 검증

파일/금액 검증:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Field",
      "label": "Product Name",
      "model": "product.name",
      "dataType": "text",
      "required": true,
      "constraints": {
        "minLength": 3,
        "maxLength": 100
      }
    },
    {
      "type": "Field",
      "label": "Price",
      "model": "product.price",
      "dataType": "currency",
      "required": true,
      "constraints": {
        "min": 0.01,
        "currency": "USD"
      },
      "errorMessages": {
        "min": "가격은 $0.01 이상이어야 합니다"
      }
    },
    {
      "type": "Field",
      "label": "Stock Quantity",
      "model": "product.stock",
      "dataType": "number",
      "required": true,
      "constraints": {
        "min": 0,
        "step": 1
      }
    },
    {
      "type": "Field",
      "label": "Product Images",
      "model": "product.images",
      "dataType": "image",
      "required": true,
      "constraints": {
        "accept": "image/png,image/jpeg",
        "maxSize": 5242880,
        "minItems": 1,
        "maxItems": 5
      },
      "errorMessages": {
        "maxSize": "이미지는 5MB 이하여야 합니다",
        "minItems": "최소 1장의 이미지를 업로드해주세요",
        "maxItems": "최대 5장까지 업로드 가능합니다"
      }
    },
    {
      "type": "Field",
      "label": "Category",
      "model": "product.category",
      "dataType": "select",
      "required": true,
      "options": [
        { "value": "electronics", "label": "Electronics" },
        { "value": "clothing", "label": "Clothing" }
      ]
    }
  ]
}
```

</details>

---

## 흔한 실수

### 실수 1: required만 있고 constraints 없음

```json
// ❌ Wrong: 너무 관대함
{
  "label": "Username",
  "dataType": "text",
  "required": true
  // 1자만 입력해도 통과
}

// ✅ Correct: 적절한 제약
{
  "label": "Username",
  "dataType": "text",
  "required": true,
  "constraints": {
    "minLength": 3,
    "maxLength": 20,
    "pattern": "^[a-zA-Z0-9_]+$"
  }
}
```

### 실수 2: 클라이언트 검증만 신뢰

```javascript
// ❌ Wrong: 서버 검증 없음
// 악의적인 사용자가 클라이언트 검증을 우회할 수 있음

// ✅ Correct: 서버에서도 반드시 검증
// Backend (Node.js + Zod 예시)
const userSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8)
});
```

### 실수 3: 에러 메시지가 불친절

```json
// ❌ Wrong: 기술적인 메시지
{
  "errorMessages": {
    "pattern": "Invalid pattern"
  }
}

// ✅ Correct: 사용자 친화적
{
  "errorMessages": {
    "pattern": "아이디는 영문자, 숫자, 밑줄(_)만 사용할 수 있습니다"
  }
}
```

---

## 핵심 정리

### constraints 속성

```
문자열: minLength, maxLength, pattern
숫자: min, max, step
날짜: min, max
파일: accept, maxSize
다중선택: minItems, maxItems
```

### 검증 원칙

```
1. 클라이언트 검증 (UX): 즉각적인 피드백
2. 서버 검증 (보안): 반드시 필수
3. 친절한 에러 메시지 (가독성): 어떻게 고칠지 알려주기
```

### 에러 메시지 작성 팁

```
❌ "Invalid input"
✅ "아이디는 3-20자 영문자/숫자만 가능합니다"

❌ "Error"
✅ "비밀번호는 영문+숫자+특수문자 포함 8자 이상이어야 합니다"
```

---

## 다음 단계

검증을 완벽히 이해했습니다!
이제 **Action의 behavior**를 배워봅시다.

**다음**: [Action 동작 →](./03-action-behaviors.md)

---

**이전**: [← Field 타입](./01-field-types.md)
**다음**: [Action 동작 →](./03-action-behaviors.md)
