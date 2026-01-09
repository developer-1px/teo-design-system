# Intent 시스템 완전 정복 🎨

**예상 소요 시간**: 12분
**난이도**: ⭐⭐ 기초
**사전 지식**: [Prominence 시스템](./01-prominence.md)

---

## 이 문서를 읽고 나면

- Intent의 6가지 값을 완벽히 이해합니다
- 색상이 아닌 "의미"로 생각하는 법을 배웁니다
- 버튼, 알림, 상태 표시에 적절한 Intent를 선택할 수 있습니다

---

## Intent란?

> **"이것이 전달하는 의미는 무엇인가?"** - 의미론적 맥락

Intent는 UI 요소의 **시맨틱 목적(Semantic Purpose)**을 정의합니다.
"빨간색"이 아니라 **"위험"**, "파란색"이 아니라 **"브랜드"**로 생각합니다.

---

## 6가지 Intent

### Neutral - 일반 정보 (기본값)

**의미**: "일반적인 정보, 기본 상태"

**색상**: 회색, 검은색, 흰색 (무채색)

**사용 예시**:
- 대부분의 텍스트
- 일반 버튼 (Cancel, Close)
- 네비게이션 메뉴

```json
{
  "type": "Text",
  "role": "Body",
  "content": "This is a description",
  "intent": "Neutral"  // 생략 가능 (기본값)
}
```

**렌더링**:
```
This is a description
(검은색 또는 회색 텍스트)

[Cancel] ← 회색 버튼
```

---

### Brand - 브랜드 강조

**의미**: "브랜드 아이덴티티, 핵심 액션"

**색상**: Primary Color (회사 브랜드 색상)

**사용 예시**:
- Primary CTA (Call To Action)
- 주요 링크
- 브랜드 강조 요소

```json
{
  "type": "Action",
  "label": "Get Started",
  "prominence": "Hero",
  "intent": "Brand"
}
```

**렌더링**:
```
[========== Get Started ==========]
(브랜드 색상으로 채워진 거대한 버튼)
```

**사용 원칙**:
- 페이지당 1-2개만 사용
- 가장 중요한 액션에만 사용

---

### Positive - 성공/긍정

**의미**: "성공, 완료, 긍정적 상태, 수익"

**색상**: 녹색 (Green)

**사용 예시**:
- 성공 메시지
- 저장 완료
- 활성 상태
- 수익/증가 표시

```json
{
  "type": "Text",
  "role": "Body",
  "content": "Profile updated successfully",
  "intent": "Positive"
}
```

**렌더링**:
```
┌─────────────────────────────┐
│ ✓ Profile updated successfully │ (녹색 배경)
└─────────────────────────────┘

[Save] ← 녹색 버튼
```

---

### Caution - 주의/경고

**의미**: "주의, 경고, 대기 상태, 검토 필요"

**색상**: 노란색/주황색 (Yellow/Orange)

**사용 예시**:
- 경고 메시지
- Pending 상태
- 검토 필요 항목
- 주의사항

```json
{
  "type": "Group",
  "role": "Card",
  "intent": "Caution",
  "children": [
    {
      "type": "Text",
      "role": "Body",
      "content": "Your trial expires in 3 days"
    }
  ]
}
```

**렌더링**:
```
┌────────────────────────────┐
│ ⚠ Your trial expires in 3 days │ (노란색 배경)
└────────────────────────────┘
```

---

### Critical - 위험/에러

**의미**: "위험, 에러, 파괴적 액션, 손실, 만료"

**색상**: 빨간색 (Red)

**사용 예시**:
- 삭제 버튼
- 에러 메시지
- 계정 정지
- 손실/감소 표시

```json
{
  "type": "Action",
  "label": "Delete Account",
  "prominence": "Secondary",
  "intent": "Critical",
  "confirm": "This action cannot be undone"
}
```

**렌더링**:
```
[ Delete Account ] ← 빨간 테두리 버튼
(클릭 시: "This action cannot be undone" 확인창)
```

**중요**: Critical intent는 자동으로 confirm 메시지를 권장합니다.

---

### Info - 참고 정보

**의미**: "참고 정보, 도움말, 안내"

**색상**: 파란색 (Blue)

**사용 예시**:
- 도움말 툴팁
- 안내 메시지
- 정보 알림
- Learn more 링크

```json
{
  "type": "Group",
  "role": "Card",
  "intent": "Info",
  "children": [
    {
      "type": "Text",
      "role": "Body",
      "content": "Tip: You can use keyboard shortcuts"
    }
  ]
}
```

**렌더링**:
```
┌─────────────────────────────────┐
│ ℹ Tip: You can use keyboard shortcuts │ (파란색 배경)
└─────────────────────────────────┘
```

---

## Intent 비교표

| Intent | 색상 | 의미 | 사용 예시 | 빈도 |
|--------|------|------|-----------|------|
| **Neutral** | Gray/Black | 기본, 일반 | 텍스트, Cancel | 가장 많음 |
| **Brand** | Primary | 브랜드, 핵심 액션 | CTA, 주요 링크 | 페이지당 1-2개 |
| **Positive** | Green | 성공, 완료, 긍정 | 저장 완료, 활성 | 자주 |
| **Caution** | Yellow | 주의, 경고, 대기 | 경고 메시지, Pending | 가끔 |
| **Critical** | Red | 위험, 에러, 삭제 | 삭제, 에러 | 드물게 |
| **Info** | Blue | 참고, 도움말 | 툴팁, 안내 | 가끔 |

---

## 노드 타입별 Intent 사용

### Action (버튼)

```json
// 메인 CTA
{
  "type": "Action",
  "label": "Sign Up",
  "prominence": "Primary",
  "intent": "Brand"
}
// → 브랜드 색상 버튼

// 저장
{
  "type": "Action",
  "label": "Save",
  "intent": "Positive"
}
// → 녹색 버튼

// 취소
{
  "type": "Action",
  "label": "Cancel",
  "intent": "Neutral"
}
// → 회색 버튼

// 삭제
{
  "type": "Action",
  "label": "Delete",
  "intent": "Critical",
  "confirm": "Are you sure?"
}
// → 빨간색 버튼 + 확인창
```

### Text (알림 메시지)

```json
// 성공
{
  "type": "Text",
  "role": "Body",
  "content": "Changes saved successfully",
  "intent": "Positive"
}

// 경고
{
  "type": "Text",
  "role": "Body",
  "content": "Please verify your email",
  "intent": "Caution"
}

// 에러
{
  "type": "Text",
  "role": "Body",
  "content": "Failed to load data",
  "intent": "Critical"
}

// 정보
{
  "type": "Text",
  "role": "Body",
  "content": "Click to learn more",
  "intent": "Info"
}
```

### Group (카드/컨테이너)

```json
// 경고 박스
{
  "type": "Group",
  "role": "Card",
  "intent": "Caution",
  "children": [
    { "type": "Text", "content": "Trial expires soon" }
  ]
}
// → 노란색 배경 카드

// 에러 박스
{
  "type": "Group",
  "role": "Card",
  "intent": "Critical",
  "children": [
    { "type": "Text", "content": "Payment failed" }
  ]
}
// → 빨간색 배경 카드
```

### Field (상태 표시)

```json
// 활성 상태
{
  "type": "Field",
  "label": "Status",
  "model": "user.status",
  "dataType": "text",
  "intent": "Positive"
}
// → 녹색 텍스트 "Active"

// 대기 상태
{
  "type": "Field",
  "label": "Status",
  "model": "order.status",
  "dataType": "text",
  "intent": "Caution"
}
// → 노란색 텍스트 "Pending"
```

---

## 실습 1: 알림 메시지

다음 알림들의 Intent를 정의하세요:

```
A) "Email sent successfully"
B) "Server error occurred"
C) "Your session will expire in 5 minutes"
D) "New feature available. Learn more"
```

<details>
<summary>정답 보기</summary>

```json
// A) 성공 메시지
{
  "type": "Text",
  "content": "Email sent successfully",
  "intent": "Positive"
}

// B) 에러 메시지
{
  "type": "Text",
  "content": "Server error occurred",
  "intent": "Critical"
}

// C) 경고 메시지
{
  "type": "Text",
  "content": "Your session will expire in 5 minutes",
  "intent": "Caution"
}

// D) 정보 메시지
{
  "type": "Text",
  "content": "New feature available. Learn more",
  "intent": "Info"
}
```

</details>

---

## 실습 2: 버튼 그룹

사용자 편집 페이지의 버튼 그룹을 정의하세요:

```
[Delete]  [Cancel]  [Save Changes]
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    {
      "type": "Action",
      "label": "Delete",
      "prominence": "Tertiary",  // 작게 (덜 중요)
      "intent": "Critical",  // 빨간색
      "confirm": "Delete this user?"
    },
    {
      "type": "Action",
      "label": "Cancel",
      "prominence": "Secondary",
      "intent": "Neutral"  // 회색
    },
    {
      "type": "Action",
      "label": "Save Changes",
      "prominence": "Primary",  // 메인 버튼
      "intent": "Positive"  // 녹색 (저장 = 성공)
    }
  ]
}
```

**포인트**:
- Delete: Critical (위험) + Tertiary (덜 강조)
- Cancel: Neutral (중립) + Secondary (보조)
- Save: Positive (성공) + Primary (메인)

</details>

---

## 실습 3: 상태 뱃지

주문 상태를 표시하는 Field를 만드세요:

```
Status: [Pending]  ← 노란색
Status: [Shipped]  ← 파란색
Status: [Delivered] ← 녹색
Status: [Cancelled] ← 빨간색
```

<details>
<summary>정답 보기</summary>

```json
// Pending
{
  "type": "Field",
  "label": "Status",
  "model": "order.status",
  "dataType": "select",
  "intent": "Caution",  // 대기 = 주의
  "options": [
    { "label": "Pending", "value": "pending" }
  ]
}

// Shipped
{
  "type": "Field",
  "label": "Status",
  "model": "order.status",
  "dataType": "select",
  "intent": "Info",  // 진행 중 = 정보
  "options": [
    { "label": "Shipped", "value": "shipped" }
  ]
}

// Delivered
{
  "type": "Field",
  "label": "Status",
  "model": "order.status",
  "dataType": "select",
  "intent": "Positive",  // 완료 = 성공
  "options": [
    { "label": "Delivered", "value": "delivered" }
  ]
}

// Cancelled
{
  "type": "Field",
  "label": "Status",
  "model": "order.status",
  "dataType": "select",
  "intent": "Critical",  // 취소 = 위험
  "options": [
    { "label": "Cancelled", "value": "cancelled" }
  ]
}
```

</details>

---

## 흔한 실수

### 실수 1: Brand 남발

```json
// ❌ Wrong: 모든 버튼이 Brand
{
  "children": [
    { "intent": "Brand" },  // CTA
    { "intent": "Brand" },  // Save
    { "intent": "Brand" }   // Submit
  ]
}
// → 경쟁, 혼란

// ✅ Correct: Brand는 1개만
{
  "children": [
    { "intent": "Brand" },     // 메인 CTA만
    { "intent": "Positive" },  // Save
    { "intent": "Neutral" }    // Cancel
  ]
}
```

### 실수 2: 색상으로 생각하기

```json
// ❌ Wrong: "녹색 버튼이 예쁘니까"
{
  "type": "Action",
  "label": "Delete",
  "intent": "Positive"  // ← 삭제인데 Positive???
}

// ✅ Correct: "삭제는 위험한 액션"
{
  "type": "Action",
  "label": "Delete",
  "intent": "Critical"  // 의미가 맞음
}
```

### 실수 3: Neutral 무시

```json
// ❌ Wrong: 모든 버튼에 Intent 지정
{
  "type": "Action",
  "label": "Cancel",
  "intent": "Info"  // ← 굳이?
}

// ✅ Correct: Neutral 사용 (또는 생략)
{
  "type": "Action",
  "label": "Cancel",
  "intent": "Neutral"  // 또는 생략 (기본값)
}
```

---

## Intent와 Prominence 조합

Intent는 Prominence와 독립적입니다:

```json
// 큰 위험 버튼
{
  "prominence": "Hero",
  "intent": "Critical"
}
// → 거대한 빨간 버튼

// 작은 성공 메시지
{
  "prominence": "Tertiary",
  "intent": "Positive"
}
// → 작은 녹색 텍스트

// 보통 크기 브랜드 버튼
{
  "prominence": "Primary",
  "intent": "Brand"
}
// → 표준 크기 브랜드 버튼
```

---

## 다크모드 대응

Intent는 **의미**이므로, 다크모드에서도 의미는 유지됩니다:

```json
{
  "intent": "Critical"
}
```

**라이트모드**: 밝은 빨강 (#E53E3E)
**다크모드**: 어두운 빨강 (#DC2626)

→ **의미는 같음** (위험)

---

## 핵심 정리

### Intent 선택 가이드

```
Neutral → 일반 텍스트, Cancel 버튼 (기본값)
Brand → 메인 CTA, 주요 액션 (페이지당 1-2개)
Positive → 성공, 저장, 활성, 수익
Caution → 경고, Pending, 주의사항
Critical → 삭제, 에러, 손실
Info → 도움말, 안내, 참고
```

### 기억할 3가지 원칙

1. **색상이 아닌 의미로 생각**
2. **Brand는 최소한으로** (페이지당 1-2개)
3. **대부분은 Neutral** (기본값)

---

## 다음 단계

Intent를 완전히 이해했습니다!
이제 **정보 밀도**를 조절하는 Density를 배워봅시다.

**다음**: [Density 시스템 →](./03-density.md)

**관련 문서**:
- [Prominence 시스템](./01-prominence.md) - 시각적 강조
- [속성 조합하기](./05-combining-properties.md) - 4가지 속성 함께 쓰기
- [실전: 알림 시스템](../04-patterns/03-form-patterns.md)

---

**이전**: [← Prominence 시스템](./01-prominence.md)
**다음**: [Density 시스템 →](./03-density.md)
