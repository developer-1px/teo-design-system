# 폼 패턴: 완벽한 입력 폼 디자인하기 📝

**예상 소요 시간**: 16분
**난이도**: ⭐⭐⭐⭐ 고급
**사전 지식**: [Field 타입](../03-data-interaction/01-field-types.md), [검증](../03-data-interaction/02-validation.md)

---

## 이 문서를 읽고 나면

- 완전한 입력 폼을 구성할 수 있습니다
- 적절한 레이아웃을 선택할 수 있습니다
- 에러 처리와 피드백을 올바르게 구현할 수 있습니다

---

## 폼이란?

> **"사용자 입력을 수집하고 검증하는 UI"**

회원가입, 프로필 편집, 설정 변경 등에서 사용됩니다.

**필수 구성 요소**:
```
1. 제목 (무엇을 입력하는 폼인지)
2. 필드 그룹 (논리적으로 묶기)
3. 검증 및 에러 메시지
4. 액션 버튼 (저장, 취소)
5. 성공/실패 피드백
```

---

## 레이아웃 패턴

### 1. 단일 컬럼 (권장)

**장점**: 읽기 쉬움, 모바일 친화적

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    { "type": "Field", "label": "Name" },
    { "type": "Field", "label": "Email" },
    { "type": "Field", "label": "Password" },
    { "type": "Action", "label": "Submit" }
  ]
}
```

**렌더링**:
```
Name:     [________________]
Email:    [________________]
Password: [________________]
          [Submit]
```

---

### 2. 2열 그리드

**사용 사례**: 관련된 짧은 필드 (이름/성, 도시/우편번호)

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Group",
      "role": "Grid",
      "children": [
        { "type": "Field", "label": "First Name" },
        { "type": "Field", "label": "Last Name" }
      ]
    },
    {
      "type": "Group",
      "role": "Grid",
      "children": [
        { "type": "Field", "label": "City" },
        { "type": "Field", "label": "ZIP Code" }
      ]
    }
  ]
}
```

**렌더링**:
```
First Name: [_______]  Last Name: [_______]
City:       [_______]  ZIP Code:  [_______]
```

---

## 완전한 예시: 회원가입 폼

```json
{
  "type": "Page",
  "title": "Sign Up",
  "layout": "single",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "edit",  // ← 편집 모드
      "density": "Standard",
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            // === 제목 ===
            {
              "type": "Text",
              "role": "Title",
              "content": "Create your account",
              "prominence": "Hero"
            },
            {
              "type": "Text",
              "role": "Body",
              "content": "Fill in the details below to get started",
              "prominence": "Tertiary"
            },

            // === Fieldset 1: 기본 정보 ===
            {
              "type": "Group",
              "role": "Fieldset",
              "children": [
                {
                  "type": "Text",
                  "role": "Title",
                  "content": "Basic Information",
                  "prominence": "Secondary"
                },

                {
                  "type": "Field",
                  "label": "Username",
                  "model": "user.username",
                  "dataType": "text",
                  "required": true,
                  "placeholder": "Choose a unique username",
                  "constraints": {
                    "minLength": 3,
                    "maxLength": 20,
                    "pattern": "^[a-zA-Z0-9_]+$"
                  },
                  "errorMessages": {
                    "required": "Username is required",
                    "minLength": "Username must be at least 3 characters",
                    "pattern": "Only letters, numbers, and underscores allowed"
                  }
                },

                {
                  "type": "Field",
                  "label": "Email",
                  "model": "user.email",
                  "dataType": "email",
                  "required": true,
                  "placeholder": "you@example.com",
                  "errorMessages": {
                    "required": "Email is required",
                    "pattern": "Please enter a valid email address"
                  }
                }
              ]
            },

            // === Fieldset 2: 비밀번호 ===
            {
              "type": "Group",
              "role": "Fieldset",
              "children": [
                {
                  "type": "Text",
                  "role": "Title",
                  "content": "Security",
                  "prominence": "Secondary"
                },

                {
                  "type": "Field",
                  "label": "Password",
                  "model": "user.password",
                  "dataType": "password",
                  "required": true,
                  "placeholder": "At least 8 characters",
                  "constraints": {
                    "minLength": 8,
                    "pattern": "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$"
                  },
                  "errorMessages": {
                    "required": "Password is required",
                    "minLength": "Password must be at least 8 characters",
                    "pattern": "Must contain letters, numbers, and special characters"
                  }
                },

                {
                  "type": "Field",
                  "label": "Confirm Password",
                  "model": "user.confirmPassword",
                  "dataType": "password",
                  "required": true,
                  "placeholder": "Re-enter your password",
                  "constraints": {
                    "match": "user.password"
                  },
                  "errorMessages": {
                    "required": "Please confirm your password",
                    "match": "Passwords do not match"
                  }
                }
              ]
            },

            // === Fieldset 3: 약관 동의 ===
            {
              "type": "Group",
              "role": "Fieldset",
              "children": [
                {
                  "type": "Field",
                  "label": "I agree to the Terms of Service",
                  "model": "user.agreedToTerms",
                  "dataType": "boolean",
                  "required": true,
                  "errorMessages": {
                    "required": "You must accept the terms to continue"
                  }
                },

                {
                  "type": "Field",
                  "label": "Subscribe to newsletter",
                  "model": "user.newsletter",
                  "dataType": "boolean"
                }
              ]
            },

            // === 액션 버튼 ===
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
                    "action": "submit",
                    "endpoint": "/api/auth/signup",
                    "method": "POST",
                    "onSuccess": {
                      "action": "navigate",
                      "to": "/welcome"
                    },
                    "onError": {
                      "action": "open",
                      "overlay": "error-toast"
                    }
                  }
                }
              ]
            },

            // === 대안 액션 ===
            {
              "type": "Group",
              "role": "Inline",
              "children": [
                {
                  "type": "Text",
                  "role": "Caption",
                  "content": "Already have an account?",
                  "prominence": "Tertiary"
                },
                {
                  "type": "Action",
                  "label": "Sign In",
                  "prominence": "Tertiary",
                  "intent": "Brand",
                  "behavior": {
                    "action": "navigate",
                    "to": "/login"
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

---

## 패턴: 인라인 검증

실시간 피드백:

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
    "required": "Username is required",
    "minLength": "Too short (min 3 characters)",
    "pattern": "Only letters, numbers, and underscores"
  },
  "helpText": "This will be your public display name"
}
```

**렌더링 (에러 시)**:
```
Username *
[__a_____]
❌ Too short (min 3 characters)
```

**렌더링 (성공 시)**:
```
Username *
[__alice__]
✓ This will be your public display name
```

---

## 패턴: 조건부 필드

선택에 따라 추가 필드 표시:

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
      "required": true,
      "hidden": "user.accountType !== 'business'"
    },

    {
      "type": "Field",
      "label": "Tax ID",
      "model": "user.taxId",
      "dataType": "text",
      "hidden": "user.accountType !== 'business'"
    }
  ]
}
```

---

## 패턴: 다단계 폼 (Wizard)

긴 폼을 여러 단계로:

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    // 진행 표시
    {
      "type": "Group",
      "role": "Steps",
      "children": [
        { "type": "Group", "id": "step-1", "label": "Account" },
        { "type": "Group", "id": "step-2", "label": "Profile" },
        { "type": "Group", "id": "step-3", "label": "Verify" }
      ]
    },

    // Step 1: Account
    {
      "type": "Group",
      "role": "Container",
      "hidden": "currentStep !== 1",
      "children": [
        {
          "type": "Text",
          "role": "Title",
          "content": "Create Account",
          "prominence": "Primary"
        },
        { "type": "Field", "label": "Email", "model": "user.email" },
        { "type": "Field", "label": "Password", "model": "user.password" },

        {
          "type": "Action",
          "label": "Next",
          "prominence": "Primary",
          "intent": "Brand",
          "behavior": {
            "action": "command",
            "command": "nextStep"
          }
        }
      ]
    },

    // Step 2: Profile
    {
      "type": "Group",
      "role": "Container",
      "hidden": "currentStep !== 2",
      "children": [
        {
          "type": "Text",
          "role": "Title",
          "content": "Your Profile",
          "prominence": "Primary"
        },
        { "type": "Field", "label": "Name", "model": "user.name" },
        { "type": "Field", "label": "Bio", "model": "user.bio", "dataType": "textarea" },

        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            {
              "type": "Action",
              "label": "Back",
              "prominence": "Secondary",
              "behavior": {
                "action": "command",
                "command": "previousStep"
              }
            },
            {
              "type": "Action",
              "label": "Next",
              "prominence": "Primary",
              "intent": "Brand",
              "behavior": {
                "action": "command",
                "command": "nextStep"
              }
            }
          ]
        }
      ]
    },

    // Step 3: Verify
    {
      "type": "Group",
      "role": "Container",
      "hidden": "currentStep !== 3",
      "children": [
        {
          "type": "Text",
          "role": "Title",
          "content": "Verify Your Email",
          "prominence": "Primary"
        },
        {
          "type": "Text",
          "role": "Body",
          "content": "We sent a code to {email}",
          "prominence": "Tertiary"
        },
        { "type": "Field", "label": "Verification Code", "model": "user.verificationCode" },

        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            {
              "type": "Action",
              "label": "Back",
              "prominence": "Secondary",
              "behavior": {
                "action": "command",
                "command": "previousStep"
              }
            },
            {
              "type": "Action",
              "label": "Finish",
              "prominence": "Primary",
              "intent": "Positive",
              "behavior": {
                "action": "submit"
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

## 패턴: 자동 저장

변경사항 자동 저장:

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Field",
      "label": "Title",
      "model": "draft.title",
      "dataType": "text",
      "behavior": {
        "onChange": {
          "action": "command",
          "endpoint": "/api/drafts/{id}",
          "method": "PATCH",
          "debounce": 1000  // ← 1초 후 자동 저장
        }
      }
    },

    {
      "type": "Text",
      "role": "Caption",
      "content": "Last saved: {time}",
      "model": "draft.lastSavedAt",
      "prominence": "Tertiary"
    }
  ]
}
```

---

## 패턴: 에러 처리

서버 에러 표시:

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    // 전역 에러 메시지
    {
      "type": "Group",
      "role": "Card",
      "intent": "Critical",
      "hidden": "!formError",
      "children": [
        {
          "type": "Text",
          "role": "Body",
          "model": "formError.message",
          "prominence": "Secondary"
        }
      ]
    },

    // 필드들
    {
      "type": "Field",
      "label": "Email",
      "model": "user.email",
      "dataType": "email",
      "required": true,
      "errorMessages": {
        "required": "Email is required",
        "pattern": "Invalid email format",
        "serverError": "This email is already registered"  // ← 서버 에러
      }
    },

    {
      "type": "Action",
      "label": "Submit",
      "prominence": "Primary",
      "behavior": {
        "action": "submit",
        "endpoint": "/api/users",
        "method": "POST",
        "onError": {
          "action": "command",
          "command": "showFormError",
          "args": {
            "message": "error.message"
          }
        }
      }
    }
  ]
}
```

---

## 패턴: 성공 피드백

제출 후 피드백:

```json
{
  "type": "Action",
  "label": "Save Changes",
  "prominence": "Primary",
  "intent": "Positive",
  "behavior": {
    "action": "submit",
    "endpoint": "/api/users/{id}",
    "method": "PATCH",
    "onSuccess": {
      "action": "open",
      "overlay": "success-toast"
    }
  }
}

// Toast 정의
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
        {
          "type": "Text",
          "content": "✓ Changes saved successfully",
          "prominence": "Secondary"
        }
      ]
    }
  ]
}
```

---

## 핵심 정리

### 레이아웃 선택

```
단순 폼 → 단일 컬럼
관련 짧은 필드 → 2열 그리드
긴 폼 → Fieldset으로 구분
매우 긴 폼 → Wizard (다단계)
```

### 필드 순서

```
1. 중요한 것부터 (이메일 > 프로필 사진)
2. 논리적 그룹 (기본 정보 > 추가 정보)
3. 민감한 것은 나중에 (비밀번호는 중간/후반)
```

### 검증 타이밍

```
입력 중 (onChange) → 형식 검증 (이메일, 패턴)
포커스 벗어남 (onBlur) → 서버 검증 (중복 확인)
제출 시 (onSubmit) → 전체 검증
```

### 버튼 배치

```
단일 액션 → 우측 정렬
여러 액션 → 좌측(취소) + 우측(저장)
Wizard → 좌측(뒤로) + 우측(다음)
```

### Best Practice

```
✓ 단일 컬럼 레이아웃 우선
✓ Fieldset으로 논리적 그룹화
✓ 인라인 검증 + 친절한 에러 메시지
✓ 성공 시 Toast 피드백
✓ 저장은 Primary + Positive
✓ helpText로 입력 가이드
✓ placeholder로 예시 제공
✗ 너무 많은 필수 항목 지양
✗ 2열 이상 레이아웃 지양
```

---

## 다음 단계

폼 패턴을 완벽히 이해했습니다!
이제 **대시보드** 패턴을 배워봅시다.

**다음**: [대시보드 →](./04-dashboard.md)

---

**이전**: [← 상세 페이지](./02-detail-view.md)
**다음**: [대시보드 →](./04-dashboard.md)
