# 속성 조합하기 🎯

**예상 소요 시간**: 15분
**난이도**: ⭐⭐⭐ 중급
**사전 지식**: [Role 시스템](./04-role.md)

---

## 이 문서를 읽고 나면

- 4가지 속성을 효과적으로 조합할 수 있습니다
- 좋은 조합과 나쁜 조합을 구분할 수 있습니다
- 실전에서 바로 쓸 수 있는 패턴을 익힙니다

---

## 4가지 속성 복습

```
role        → 무엇인가?      (Title, Form, Card, ...)
prominence  → 얼마나 눈에 띄는가?  (Hero, Primary, Secondary, Tertiary)
intent      → 무슨 맥락인가?    (Neutral, Brand, Positive, Caution, Critical)
density     → 얼마나 빽빽한가?   (Comfortable, Standard, Compact)
```

이 4가지를 **조합**하여 의미 있는 UI를 만듭니다.

---

## 기본 조합 패턴

### 패턴 1: 페이지 제목

```json
{
  "type": "Text",
  "role": "Title",          // 제목
  "prominence": "Hero",     // 거대하게
  "intent": "Neutral",      // 기본 색상 (생략 가능)
  "content": "Dashboard"
}
```

**결과**: 페이지 최상단의 거대한 검은색 제목

---

### 패턴 2: 메인 CTA 버튼

```json
{
  "type": "Action",
  "label": "Get Started",
  "prominence": "Hero",     // 거대하게
  "intent": "Brand"         // 브랜드 색상
}
```

**결과**: 가장 눈에 띄는 브랜드 색상 버튼

---

### 패턴 3: 삭제 버튼

```json
{
  "type": "Action",
  "label": "Delete",
  "prominence": "Secondary", // 작게 (덜 강조)
  "intent": "Critical",      // 빨간색 (위험)
  "confirm": "Are you sure?"
}
```

**결과**: 작은 빨간색 버튼 + 확인 메시지

---

### 패턴 4: 데이터 테이블

```json
{
  "type": "Group",
  "role": "Table",          // 테이블
  "density": "Compact",     // 촘촘하게
  "children": [...]
}
```

**결과**: 좁은 간격의 데이터 그리드

---

### 패턴 5: 대시보드 통계 카드

```json
{
  "type": "Group",
  "role": "Card",           // 카드
  "density": "Comfortable", // 넓게
  "children": [
    {
      "type": "Field",
      "model": "stats.revenue",
      "dataType": "currency",
      "prominence": "Hero"    // 거대한 숫자
    },
    {
      "type": "Text",
      "role": "Label",
      "content": "Revenue",
      "prominence": "Tertiary" // 작은 라벨
    }
  ]
}
```

**결과**: 여유 있는 카드 안에 거대한 숫자 + 작은 라벨

---

## 좋은 조합 vs 나쁜 조합

### 예제 1: 성공 알림

```json
// ✅ Good: 의미가 명확
{
  "type": "Group",
  "role": "Card",
  "intent": "Positive",         // 녹색 (성공)
  "children": [
    {
      "type": "Text",
      "role": "Body",
      "content": "Profile updated",
      "prominence": "Primary"    // 표준 크기
    }
  ]
}

// ❌ Bad: 의미 충돌
{
  "type": "Group",
  "role": "Card",
  "intent": "Critical",         // 빨간색 (위험???)
  "children": [
    {
      "type": "Text",
      "content": "Profile updated" // 성공 메시지인데???
    }
  ]
}
```

---

### 예제 2: 버튼 그룹

```json
// ✅ Good: 명확한 계층
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    {
      "type": "Action",
      "label": "Cancel",
      "prominence": "Secondary",  // 보조
      "intent": "Neutral"         // 회색
    },
    {
      "type": "Action",
      "label": "Save",
      "prominence": "Primary",    // 메인
      "intent": "Positive"        // 녹색
    }
  ]
}

// ❌ Bad: 모두 같은 강조
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    {
      "type": "Action",
      "label": "Cancel",
      "prominence": "Primary",    // 똑같음
      "intent": "Brand"           // 똑같음
    },
    {
      "type": "Action",
      "label": "Save",
      "prominence": "Primary",    // 똑같음
      "intent": "Brand"           // 똑같음
    }
  ]
}
// → 어느 게 중요한지 모름
```

---

### 예제 3: 경고 메시지

```json
// ✅ Good: 적절한 prominence
{
  "type": "Group",
  "role": "Card",
  "intent": "Caution",          // 노란색
  "children": [
    {
      "type": "Text",
      "role": "Body",
      "content": "Trial expires in 3 days",
      "prominence": "Secondary"  // 중간 크기
    }
  ]
}

// ❌ Bad: 과한 prominence
{
  "type": "Group",
  "role": "Card",
  "intent": "Caution",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Trial expires in 3 days",
      "prominence": "Hero"       // ← 너무 큼
    }
  ]
}
// → 경고가 페이지를 압도함
```

---

## 실전 시나리오

### 시나리오 1: 사용자 프로필 페이지

**요구사항**:
- 이름: 가장 눈에 띄게
- 이메일/전화: 일반 크기
- 가입일: 작고 흐리게
- 편집 버튼: 브랜드 색상
- 삭제 버튼: 빨간색, 작게

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "view",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "density": "Standard",
      "children": [
        // 이름: 가장 강조
        {
          "type": "Field",
          "label": "Name",
          "model": "user.name",
          "dataType": "text",
          "prominence": "Hero"        // ← 거대
        },

        // 이메일/전화: 표준
        {
          "type": "Field",
          "label": "Email",
          "model": "user.email",
          "dataType": "email",
          "prominence": "Primary"     // ← 표준 (기본값)
        },
        {
          "type": "Field",
          "label": "Phone",
          "model": "user.phone",
          "dataType": "phone",
          "prominence": "Primary"
        },

        // 가입일: 메타 정보
        {
          "type": "Field",
          "label": "Joined",
          "model": "user.createdAt",
          "dataType": "date",
          "prominence": "Tertiary"    // ← 작고 흐림
        },

        // 버튼 그룹
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            // 삭제: 작고 빨강
            {
              "type": "Action",
              "label": "Delete",
              "prominence": "Tertiary",   // ← 작게
              "intent": "Critical",       // ← 빨강
              "confirm": "Delete this user?"
            },
            // 편집: 메인 CTA
            {
              "type": "Action",
              "label": "Edit Profile",
              "prominence": "Primary",    // ← 표준
              "intent": "Brand"           // ← 브랜드 색
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

### 시나리오 2: 주문 목록 페이지

**요구사항**:
- 페이지 제목: 거대
- 검색 + 필터: 표준 크기
- 신규 주문 버튼: 브랜드 색상
- 테이블: 촘촘하게, 많은 데이터
- 상태 뱃지: 의미에 맞는 색상

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Page",
  "title": "Orders",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "children": [
        // 헤더
        {
          "type": "Group",
          "role": "Container",
          "children": [
            // 제목
            {
              "type": "Text",
              "role": "Title",
              "content": "Order Management",
              "prominence": "Hero"        // ← 거대
            },

            // 필터 + 액션
            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                // 검색
                {
                  "type": "Field",
                  "label": "Search",
                  "model": "filters.search",
                  "dataType": "text",
                  "placeholder": "Order ID or customer..."
                },
                // 신규 주문
                {
                  "type": "Action",
                  "label": "New Order",
                  "prominence": "Primary",
                  "intent": "Brand"        // ← 브랜드 색
                }
              ]
            }
          ]
        },

        // 테이블
        {
          "type": "Group",
          "role": "Table",
          "density": "Compact",           // ← 촘촘
          "children": [
            {
              "type": "Field",
              "label": "Order ID",
              "model": "item.id",
              "dataType": "text"
            },
            {
              "type": "Field",
              "label": "Customer",
              "model": "item.customer",
              "dataType": "text"
            },
            {
              "type": "Field",
              "label": "Total",
              "model": "item.total",
              "dataType": "currency"
            },
            // 상태: 색상으로 구분
            {
              "type": "Field",
              "label": "Status",
              "model": "item.status",
              "dataType": "select",
              "intent": "Positive",       // ← Delivered면 녹색
              "options": [
                { "label": "Delivered", "value": "delivered" }
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

### 시나리오 3: 로그인 + 에러 처리

**요구사항**:
- 로그인 폼: 표준 간격
- 에러 메시지: 빨간색 박스
- 로그인 버튼: 브랜드 색상, 전체 폭

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "edit",
  "children": [
    {
      "type": "Group",
      "role": "Form",
      "density": "Standard",          // ← 표준 간격
      "children": [
        // 제목
        {
          "type": "Text",
          "role": "Title",
          "content": "Sign In",
          "prominence": "Primary"
        },

        // 에러 메시지 (조건부)
        {
          "type": "Group",
          "role": "Card",
          "intent": "Critical",         // ← 빨간색
          "condition": "error !== null",
          "children": [
            {
              "type": "Text",
              "role": "Body",
              "content": "Invalid email or password",
              "prominence": "Secondary"
            }
          ]
        },

        // 입력 필드
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

        // 로그인 버튼
        {
          "type": "Action",
          "label": "Sign In",
          "prominence": "Hero",         // ← 전체 폭
          "intent": "Brand",            // ← 브랜드 색
          "behavior": { "action": "submit" }
        }
      ]
    }
  ]
}
```

</details>

---

## 조합 체크리스트

### ✅ 좋은 조합의 특징

1. **의미 일관성**: intent와 content가 일치
   ```json
   { "intent": "Positive", "content": "Success" }  // ✅
   { "intent": "Critical", "content": "Success" }  // ❌
   ```

2. **시각적 계층**: 중요도에 따른 prominence
   ```json
   // 메인 > 보조
   { "label": "Save", "prominence": "Primary" }
   { "label": "Cancel", "prominence": "Secondary" }
   ```

3. **적절한 밀도**: 용도에 맞는 density
   ```json
   { "role": "Table", "density": "Compact" }      // ✅
   { "role": "Table", "density": "Comfortable" }  // ❌
   ```

4. **의미 있는 role**: 기능에 맞는 role
   ```json
   // 버튼 그룹
   { "role": "Toolbar", "children": [Actions] }   // ✅
   { "role": "Form", "children": [Actions] }      // ❌
   ```

---

## 실습: 대시보드 만들기

다음 대시보드를 IDDL로 작성하세요:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dashboard                        ← Hero 제목
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────┐ ┌──────────┐ ┌──────────┐
│  $45,231 │ │  1,247   │ │    23    │  ← 큰 숫자들
│  Revenue │ │  Orders  │ │  Pending │  ← 작은 라벨들
└──────────┘ └──────────┘ └──────────┘
(넓은 간격)

Recent Orders                    ← 섹션 제목
┌─────┬────────┬────────┐
│ ID  │ Total  │ Status │         ← 촘촘한 테이블
├─────┼────────┼────────┤
│ 001 │ $1,234 │ Active │
│ 002 │ $5,678 │ Pending│
└─────┴────────┴────────┘
```

<details>
<summary>힌트</summary>

- 통계 카드: `role: "Grid"`, `density: "Comfortable"`
- 숫자: `prominence: "Hero"`
- 라벨: `prominence: "Tertiary"`
- 테이블: `role: "Table"`, `density: "Compact"`

</details>

---

## 핵심 정리

### 조합 원칙

1. **의미 우선**: 색상보다 intent의 의미를 따를 것
2. **계층 유지**: prominence는 중요도 순서대로
3. **맥락 고려**: 용도에 맞는 density와 role
4. **일관성**: 같은 패턴은 같은 조합으로

### 자주 쓰는 조합

```
페이지 제목    = role:Title + prominence:Hero
메인 CTA      = prominence:Hero + intent:Brand
저장 버튼      = prominence:Primary + intent:Positive
삭제 버튼      = prominence:Secondary + intent:Critical
데이터 테이블  = role:Table + density:Compact
대시보드 카드  = role:Card + density:Comfortable
```

---

## 다음 단계

축하합니다! Level 1 (4가지 핵심 속성)을 완료했습니다!

이제 UI의 **구조**를 깊이 이해할 차례입니다.

**다음**: [Level 2: 구조 이해하기 →](../02-structure/01-primitives.md)

**관련 문서**:
- [실전 패턴](../04-patterns/) (Level 4) - 바로 쓸 수 있는 패턴들
- [API 레퍼런스](../06-reference/api-reference.md) - 전체 속성 조합표

---

**이전**: [← Role 시스템](./04-role.md)
**다음**: [구조 이해하기: Primitives →](../02-structure/01-primitives.md)
