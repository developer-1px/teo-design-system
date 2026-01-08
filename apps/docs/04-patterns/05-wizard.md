# Wizard: 다단계 프로세스 가이드하기 🪄

**예상 소요 시간**: 17분
**난이도**: ⭐⭐⭐⭐⭐ 최고급
**사전 지식**: [폼 패턴](./03-form-patterns.md), [조건부 렌더링](../03-data-interaction/04-conditional-rendering.md)

---

## 이 문서를 읽고 나면

- 완전한 다단계 Wizard를 구성할 수 있습니다
- 단계별 검증과 네비게이션을 구현할 수 있습니다
- 진행 상태를 시각적으로 표현할 수 있습니다

---

## Wizard란?

> **"복잡한 프로세스를 여러 단계로 나눠 안내하는 UI"**

온보딩, 회원가입, 결제, 설정 마법사 등에서 사용됩니다.

**필수 구성 요소**:
```
1. 진행 표시 (Progress Indicator)
2. 단계별 폼
3. 네비게이션 버튼 (뒤로/다음/완료)
4. 단계 검증
5. 요약 확인
```

---

## 기본 구조

### 레이아웃

```
┌───────────────────────────────────┐
│ ① ──→ ② ──→ ③ ──→ ④              │ ← 진행 표시
├───────────────────────────────────┤
│ Step 2: Your Profile              │ ← 제목
│                                   │
│ Name:     [_________________]     │ ← 폼 필드
│ Email:    [_________________]     │
│ Phone:    [_________________]     │
│                                   │
│ [Back]                   [Next]   │ ← 네비게이션
└───────────────────────────────────┘
```

---

## 완전한 예시: 회원가입 Wizard

```json
{
  "type": "Page",
  "title": "Sign Up",
  "layout": "wizard",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "mode": "edit",
      "density": "Standard",
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            // === 진행 표시 ===
            {
              "type": "Group",
              "role": "Steps",
              "currentStep": 1,  // ← 동적으로 변경
              "children": [
                {
                  "type": "Group",
                  "id": "step-1",
                  "label": "Account",
                  "status": "completed"
                },
                {
                  "type": "Group",
                  "id": "step-2",
                  "label": "Profile",
                  "status": "active"
                },
                {
                  "type": "Group",
                  "id": "step-3",
                  "label": "Verify",
                  "status": "pending"
                },
                {
                  "type": "Group",
                  "id": "step-4",
                  "label": "Complete",
                  "status": "pending"
                }
              ]
            },

            // === Step 1: Account ===
            {
              "type": "Group",
              "role": "Container",
              "hidden": "currentStep !== 1",
              "children": [
                {
                  "type": "Text",
                  "role": "Title",
                  "content": "Create Your Account",
                  "prominence": "Primary"
                },
                {
                  "type": "Text",
                  "role": "Body",
                  "content": "Let's start with your account credentials",
                  "prominence": "Tertiary"
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
                    "pattern": "Please enter a valid email"
                  }
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
                  "helpText": "Must contain letters, numbers, and special characters",
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
                  "constraints": {
                    "match": "user.password"
                  },
                  "errorMessages": {
                    "match": "Passwords do not match"
                  }
                },

                {
                  "type": "Group",
                  "role": "Toolbar",
                  "children": [
                    {
                      "type": "Action",
                      "label": "Next",
                      "prominence": "Primary",
                      "intent": "Brand",
                      "behavior": {
                        "action": "command",
                        "command": "validateAndNext",
                        "args": { "step": 1 }
                      }
                    }
                  ]
                }
              ]
            },

            // === Step 2: Profile ===
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
                {
                  "type": "Text",
                  "role": "Body",
                  "content": "Tell us about yourself",
                  "prominence": "Tertiary"
                },

                {
                  "type": "Field",
                  "label": "Full Name",
                  "model": "user.name",
                  "dataType": "text",
                  "required": true,
                  "constraints": {
                    "minLength": 2
                  }
                },

                {
                  "type": "Field",
                  "label": "Phone",
                  "model": "user.phone",
                  "dataType": "phone",
                  "required": false
                },

                {
                  "type": "Field",
                  "label": "Date of Birth",
                  "model": "user.birthDate",
                  "dataType": "date",
                  "required": true,
                  "constraints": {
                    "max": "$today-18y"
                  },
                  "errorMessages": {
                    "max": "You must be at least 18 years old"
                  }
                },

                {
                  "type": "Field",
                  "label": "Profile Picture",
                  "model": "user.avatar",
                  "dataType": "image",
                  "required": false,
                  "constraints": {
                    "accept": "image/png,image/jpeg",
                    "maxSize": 2097152
                  }
                },

                {
                  "type": "Group",
                  "role": "Toolbar",
                  "children": [
                    {
                      "type": "Action",
                      "label": "Back",
                      "prominence": "Secondary",
                      "intent": "Neutral",
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
                        "command": "validateAndNext",
                        "args": { "step": 2 }
                      }
                    }
                  ]
                }
              ]
            },

            // === Step 3: Verify ===
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
                  "content": "We sent a verification code to {email}",
                  "prominence": "Tertiary"
                },

                {
                  "type": "Field",
                  "label": "Verification Code",
                  "model": "user.verificationCode",
                  "dataType": "text",
                  "required": true,
                  "placeholder": "Enter 6-digit code",
                  "constraints": {
                    "pattern": "^[0-9]{6}$"
                  },
                  "errorMessages": {
                    "pattern": "Code must be 6 digits"
                  }
                },

                {
                  "type": "Action",
                  "label": "Resend Code",
                  "prominence": "Tertiary",
                  "intent": "Brand",
                  "behavior": {
                    "action": "command",
                    "endpoint": "/api/auth/resend-code",
                    "method": "POST"
                  }
                },

                {
                  "type": "Group",
                  "role": "Toolbar",
                  "children": [
                    {
                      "type": "Action",
                      "label": "Back",
                      "prominence": "Secondary",
                      "intent": "Neutral",
                      "behavior": {
                        "action": "command",
                        "command": "previousStep"
                      }
                    },
                    {
                      "type": "Action",
                      "label": "Verify",
                      "prominence": "Primary",
                      "intent": "Brand",
                      "behavior": {
                        "action": "command",
                        "command": "verifyAndNext",
                        "endpoint": "/api/auth/verify",
                        "method": "POST"
                      }
                    }
                  ]
                }
              ]
            },

            // === Step 4: Complete ===
            {
              "type": "Group",
              "role": "Container",
              "hidden": "currentStep !== 4",
              "children": [
                {
                  "type": "Text",
                  "role": "Title",
                  "content": "Review & Complete",
                  "prominence": "Primary"
                },
                {
                  "type": "Text",
                  "role": "Body",
                  "content": "Please review your information",
                  "prominence": "Tertiary"
                },

                // 요약 카드
                {
                  "type": "Group",
                  "role": "Card",
                  "density": "Comfortable",
                  "mode": "view",
                  "children": [
                    {
                      "type": "Text",
                      "role": "Title",
                      "content": "Account",
                      "prominence": "Secondary"
                    },
                    {
                      "type": "Field",
                      "label": "Email",
                      "model": "user.email",
                      "dataType": "email"
                    },
                    {
                      "type": "Action",
                      "label": "Edit",
                      "prominence": "Tertiary",
                      "behavior": {
                        "action": "command",
                        "command": "goToStep",
                        "args": { "step": 1 }
                      }
                    }
                  ]
                },

                {
                  "type": "Group",
                  "role": "Card",
                  "density": "Comfortable",
                  "mode": "view",
                  "children": [
                    {
                      "type": "Text",
                      "role": "Title",
                      "content": "Profile",
                      "prominence": "Secondary"
                    },
                    {
                      "type": "Field",
                      "label": "Name",
                      "model": "user.name"
                    },
                    {
                      "type": "Field",
                      "label": "Phone",
                      "model": "user.phone",
                      "dataType": "phone"
                    },
                    {
                      "type": "Action",
                      "label": "Edit",
                      "prominence": "Tertiary",
                      "behavior": {
                        "action": "command",
                        "command": "goToStep",
                        "args": { "step": 2 }
                      }
                    }
                  ]
                },

                {
                  "type": "Field",
                  "label": "I accept the Terms and Conditions",
                  "model": "user.acceptedTerms",
                  "dataType": "boolean",
                  "required": true
                },

                {
                  "type": "Group",
                  "role": "Toolbar",
                  "children": [
                    {
                      "type": "Action",
                      "label": "Back",
                      "prominence": "Secondary",
                      "intent": "Neutral",
                      "behavior": {
                        "action": "command",
                        "command": "previousStep"
                      }
                    },
                    {
                      "type": "Action",
                      "label": "Complete Sign Up",
                      "prominence": "Primary",
                      "intent": "Positive",
                      "behavior": {
                        "action": "submit",
                        "endpoint": "/api/auth/signup",
                        "method": "POST",
                        "onSuccess": {
                          "action": "navigate",
                          "to": "/welcome"
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
  ]
}
```

---

## 패턴: 진행 표시 스타일

### 1. 점 + 선 (기본)

```
① ──→ ② ──→ ③ ──→ ④
✓     •     ○     ○
```

### 2. 숫자 + 라벨

```
┌─────┐   ┌─────┐   ┌─────┐
│  1  │───│  2  │───│  3  │
└─────┘   └─────┘   └─────┘
Account   Profile   Verify
```

### 3. 진행 바

```
████████░░░░░░░░  50%
Step 2 of 4
```

---

## 패턴: 단계 검증

각 단계 완료 전 검증:

```json
{
  "type": "Action",
  "label": "Next",
  "prominence": "Primary",
  "behavior": {
    "action": "command",
    "command": "validateAndNext",
    "endpoint": "/api/wizard/validate",
    "method": "POST",
    "body": {
      "step": "currentStep",
      "data": "formData"
    },
    "onSuccess": {
      "action": "command",
      "command": "nextStep"
    },
    "onError": {
      "action": "open",
      "overlay": "error-toast"
    }
  }
}
```

---

## 패턴: 조건부 단계

선택에 따라 단계 건너뛰기:

```json
{
  "type": "Group",
  "role": "Steps",
  "children": [
    { "id": "step-1", "label": "Account" },
    { "id": "step-2", "label": "Profile" },

    // Business 선택 시에만 표시
    {
      "id": "step-3",
      "label": "Company Info",
      "hidden": "user.accountType !== 'business'"
    },

    { "id": "step-4", "label": "Complete" }
  ]
}
```

---

## 패턴: 저장하고 나중에 계속

진행 상황 저장:

```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    {
      "type": "Text",
      "role": "Caption",
      "content": "Your progress is saved automatically",
      "prominence": "Tertiary"
    },

    {
      "type": "Action",
      "label": "Save and Exit",
      "prominence": "Tertiary",
      "intent": "Neutral",
      "behavior": {
        "action": "command",
        "endpoint": "/api/wizard/save",
        "method": "POST",
        "onSuccess": {
          "action": "navigate",
          "to": "/"
        }
      }
    }
  ]
}
```

---

## 패턴: 요약 확인

마지막 단계에서 모든 정보 확인:

```json
{
  "type": "Group",
  "role": "Container",
  "hidden": "currentStep !== lastStep",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Review Your Information",
      "prominence": "Primary"
    },

    // 단계별 요약
    {
      "type": "Group",
      "role": "List",
      "density": "Comfortable",
      "children": [
        // Step 1 요약
        {
          "type": "Group",
          "role": "Card",
          "children": [
            {
              "type": "Group",
              "role": "Container",
              "children": [
                {
                  "type": "Text",
                  "role": "Title",
                  "content": "① Account",
                  "prominence": "Secondary"
                },
                {
                  "type": "Action",
                  "label": "Edit",
                  "prominence": "Tertiary",
                  "behavior": {
                    "action": "command",
                    "command": "goToStep",
                    "args": { "step": 1 }
                  }
                }
              ]
            },
            {
              "type": "Field",
              "label": "Email",
              "model": "user.email",
              "mode": "view"
            }
          ]
        },

        // Step 2 요약
        {
          "type": "Group",
          "role": "Card",
          "children": [
            {
              "type": "Group",
              "role": "Container",
              "children": [
                {
                  "type": "Text",
                  "role": "Title",
                  "content": "② Profile",
                  "prominence": "Secondary"
                },
                {
                  "type": "Action",
                  "label": "Edit",
                  "prominence": "Tertiary",
                  "behavior": {
                    "action": "command",
                    "command": "goToStep",
                    "args": { "step": 2 }
                  }
                }
              ]
            },
            {
              "type": "Field",
              "label": "Name",
              "model": "user.name",
              "mode": "view"
            },
            {
              "type": "Field",
              "label": "Phone",
              "model": "user.phone",
              "mode": "view"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 핵심 정리

### 필수 구성 요소

```
1. 진행 표시 (Steps)
2. 단계별 폼 (조건부 렌더링)
3. 네비게이션 버튼 (Back/Next/Complete)
4. 단계 검증
5. 요약 확인 (마지막 단계)
```

### 네비게이션 버튼

```
첫 단계 → [Next]만
중간 단계 → [Back] + [Next]
마지막 단계 → [Back] + [Complete]
```

### 단계 상태

```
completed → ✓ (체크마크)
active → • (현재)
pending → ○ (회색)
```

### 검증 전략

```
실시간 → onChange (형식 검증)
단계 이동 시 → validateAndNext (전체 검증)
제출 시 → 최종 검증
```

### Best Practice

```
✓ 3-5단계가 적절 (너무 많으면 지침)
✓ 각 단계는 5-7 필드 이하
✓ 진행 상황 자동 저장
✓ 단계 이동 시 검증
✓ 마지막에 요약 확인
✓ 편집 가능한 요약 (goToStep)
✓ 완료 버튼은 Positive intent
✗ 뒤로가기 시 데이터 손실 금지
✗ 필수 정보를 마지막 단계에 배치 금지
```

---

## 축하합니다! 🎉

**Level 4 (실전 패턴)** 완료!

이제 실무에서 바로 쓸 수 있는 패턴을 모두 익혔습니다:
- ✅ CRUD 목록 (검색, 필터, 테이블)
- ✅ 상세 페이지 (읽기/편집 모드)
- ✅ 폼 패턴 (검증, 다단계)
- ✅ 대시보드 (통계 카드, 차트)
- ✅ Wizard (다단계 프로세스)

---

## 다음 단계

실전 패턴까지 마스터했습니다!
이제 **고급 주제**를 탐구해봅시다.

**다음**: [Level 5: 고급 주제 →](../05-advanced/01-custom-extensions.md)

**관련 문서**:
- [폼 패턴](./03-form-patterns.md) - 기본 폼
- [조건부 렌더링](../03-data-interaction/04-conditional-rendering.md) - 단계 전환

---

**이전**: [← 대시보드](./04-dashboard.md)
**다음**: [Level 5: 커스텀 확장 →](../05-advanced/01-custom-extensions.md)
