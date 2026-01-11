# Intent (의미적 색상)

**난이도**: ⭐⭐☆☆☆
**소요 시간**: 20분
**선행 학습**: [Prominence](./01-prominence.md)

---

## 📌 이 문서에서 배울 내용

- Intent가 무엇이고 왜 중요한가?
- 6가지 Intent 완전 이해
- Intent × Prominence 조합 패턴
- 의미적 색상 일관성 유지법
- 자주 하는 실수와 해결법

---

## 🎯 Intent란?

**Intent**는 "의미적 색상"을 나타내는 IDDL의 핵심 축입니다.

```tsx
// "이 액션이 무슨 의미인가?"를 선언
<Action prominence="Strong" intent="Positive">Save</Action>     // 긍정적
<Action prominence="Strong" intent="Critical">Delete</Action>   // 위험함
```

**개발자가 선언하는 것**: 이 요소의 의미
**시스템이 처리하는 것**: 배경색, 텍스트 색, 테두리 색, hover/focus 상태

---

## 🌈 6가지 Intent

### Neutral (중립)

**의미**: 기본값, 중립적인 액션
**색상**: Gray (회색 계열)

**사용 예시**:
```tsx
// ✅ 취소 버튼
<Action prominence="Standard" intent="Neutral">
  Cancel
</Action>

// ✅ 기본 텍스트
<Text role="Body" intent="Neutral">
  This is normal text
</Text>

// ✅ 일반 카드
<Block role="Card" prominence="Strong" intent="Neutral">
  <Text role="Title">Regular Card</Text>
</Block>
```

**자동 적용 색상**:
- Background: `bg-gray-100` (밝은 회색)
- Text: `text-gray-900` (검은색에 가까운 회색)
- Border: `border-gray-300`
- Hover: `hover:bg-gray-200`

---

### Brand (브랜드)

**의미**: 브랜드 강조, 주요 CTA
**색상**: Accent (프로젝트 기본 accent 색)

**사용 예시**:
```tsx
// ✅ 주요 CTA
<Action prominence="Strong" intent="Brand">
  Get Started
</Action>

// ✅ 브랜드 강조 텍스트
<Text role="Badge" intent="Brand">
  New
</Text>

// ✅ 강조 알림
<Text role="Alert" intent="Brand">
  Welcome to our platform!
</Text>
```

**자동 적용 색상**:
- Background: `bg-accent` (브랜드 색)
- Text: `text-white`
- Border: `border-accent`
- Hover: `hover:bg-accent/90`

**규칙**: 화면당 1-2개만 사용 (과도하게 사용하면 효과 감소)

---

### Positive (긍정/성공)

**의미**: 성공, 확인, 저장, 승인
**색상**: Green (초록색 계열)

**사용 예시**:
```tsx
// ✅ 저장 버튼
<Action prominence="Strong" intent="Positive">
  Save Changes
</Action>

// ✅ 성공 메시지
<Text role="Alert" intent="Positive">
  ✓ Successfully saved!
</Text>

// ✅ 승인 상태
<Text role="Badge" intent="Positive">
  Approved
</Text>
```

**자동 적용 색상**:
- Background: `bg-green-500`
- Text: `text-white`
- Border: `border-green-500`
- Hover: `hover:bg-green-600`

---

### Caution (주의)

**의미**: 경고, 주의사항, 확인 필요
**색상**: Yellow/Orange (노란색/주황색 계열)

**사용 예시**:
```tsx
// ✅ 경고 버튼
<Action prominence="Strong" intent="Caution">
  Proceed with Caution
</Action>

// ✅ 경고 메시지
<Text role="Alert" intent="Caution">
  ⚠ This action cannot be undone
</Text>

// ✅ 대기 상태
<Text role="Badge" intent="Caution">
  Pending
</Text>
```

**자동 적용 색상**:
- Background: `bg-yellow-500`
- Text: `text-gray-900` (대비 확보)
- Border: `border-yellow-500`
- Hover: `hover:bg-yellow-600`

---

### Critical (위험/에러)

**의미**: 삭제, 에러, 거부, 위험한 액션
**색상**: Red (빨간색 계열)

**사용 예시**:
```tsx
// ✅ 삭제 버튼
<Action prominence="Strong" intent="Critical">
  Delete Account
</Action>

// ✅ 에러 메시지
<Text role="Alert" intent="Critical">
  ✗ Invalid email address
</Text>

// ✅ 거부 상태
<Text role="Badge" intent="Critical">
  Rejected
</Text>
```

**자동 적용 색상**:
- Background: `bg-red-500`
- Text: `text-white`
- Border: `border-red-500`
- Hover: `hover:bg-red-600`

---

### Info (정보)

**의미**: 정보 제공, 도움말, 안내
**색상**: Blue (파란색 계열)

**사용 예시**:
```tsx
// ✅ 도움말 버튼
<Action prominence="Subtle" intent="Info">
  Learn More
</Action>

// ✅ 정보 메시지
<Text role="Alert" intent="Info">
  ℹ Click here to learn more
</Text>

// ✅ 정보 뱃지
<Text role="Badge" intent="Info">
  Beta
</Text>
```

**자동 적용 색상**:
- Background: `bg-blue-500`
- Text: `text-white`
- Border: `border-blue-500`
- Hover: `hover:bg-blue-600`

---

## 🎨 Intent × Prominence 조합

### Action (버튼) 조합

```tsx
function IntentExamples() {
  return (
    <div className="flex flex-col gap-4 p-8">
      {/* Neutral: 기본 버튼 */}
      <Action prominence="Strong" intent="Neutral">
        Default Action
      </Action>

      {/* Brand: 주요 CTA */}
      <Action prominence="Strong" intent="Brand">
        Sign Up Now
      </Action>

      {/* Positive: 저장/확인 */}
      <Action prominence="Strong" intent="Positive">
        Save Changes
      </Action>

      {/* Caution: 경고 */}
      <Action prominence="Strong" intent="Caution">
        Proceed Anyway
      </Action>

      {/* Critical: 삭제 */}
      <Action prominence="Strong" intent="Critical">
        Delete Forever
      </Action>

      {/* Info: 정보 */}
      <Action prominence="Subtle" intent="Info">
        Learn More
      </Action>
    </div>
  );
}
```

**결과**:
- Neutral: 회색 배경
- Brand: Accent 색 배경 (강조)
- Positive: 초록색 배경
- Caution: 노란색 배경
- Critical: 빨간색 배경
- Info: 파란색 배경

---

### Text (알림) 조합

```tsx
function AlertExamples() {
  return (
    <div className="flex flex-col gap-4 p-8">
      {/* Neutral: 일반 알림 */}
      <Text role="Alert" intent="Neutral">
        This is a normal message
      </Text>

      {/* Brand: 브랜드 알림 */}
      <Text role="Alert" intent="Brand">
        🎉 Welcome to our platform!
      </Text>

      {/* Positive: 성공 메시지 */}
      <Text role="Alert" intent="Positive">
        ✓ Successfully saved!
      </Text>

      {/* Caution: 경고 메시지 */}
      <Text role="Alert" intent="Caution">
        ⚠ Please review before submitting
      </Text>

      {/* Critical: 에러 메시지 */}
      <Text role="Alert" intent="Critical">
        ✗ An error occurred
      </Text>

      {/* Info: 정보 메시지 */}
      <Text role="Alert" intent="Info">
        ℹ Click here to learn more
      </Text>
    </div>
  );
}
```

---

### Badge (뱃지) 조합

```tsx
function BadgeExamples() {
  return (
    <div className="flex gap-2 p-8">
      <Text role="Badge" intent="Neutral">Draft</Text>
      <Text role="Badge" intent="Brand">Featured</Text>
      <Text role="Badge" intent="Positive">Active</Text>
      <Text role="Badge" intent="Caution">Pending</Text>
      <Text role="Badge" intent="Critical">Expired</Text>
      <Text role="Badge" intent="Info">Beta</Text>
    </div>
  );
}
```

---

## ⚖️ Intent 선택 가이드

### 의미 기반으로 선택하세요

```tsx
// ✅ GOOD - 의미가 명확
<Action intent="Positive">Approve</Action>      // 승인 → Positive
<Action intent="Critical">Reject</Action>       // 거부 → Critical
<Action intent="Caution">Review</Action>        // 검토 → Caution
<Action intent="Info">View Details</Action>     // 정보 → Info

// ❌ BAD - 의미 불일치
<Action intent="Brand">Delete</Action>          // 삭제가 브랜드 액션?
<Action intent="Critical">Save</Action>         // 저장이 위험?
<Action intent="Positive">Cancel</Action>       // 취소가 긍정?
```

**원칙**: "이 액션의 결과가 무엇인가?"를 생각하세요.

---

### 액션별 권장 Intent

| 액션 | 권장 Intent | 이유 |
|------|------------|------|
| Save | Positive | 저장은 긍정적 행위 |
| Delete | Critical | 삭제는 위험한 행위 |
| Cancel | Neutral | 취소는 중립적 |
| Submit | Brand 또는 Positive | 주요 CTA |
| Edit | Neutral | 편집은 중립적 |
| Approve | Positive | 승인은 긍정적 |
| Reject | Critical | 거부는 부정적 |
| Warning | Caution | 경고는 주의사항 |
| Help | Info | 도움말은 정보 |

---

## 🚫 자주 하는 실수

### 실수 1: 의미 없이 색상만 선택

```tsx
// ❌ BAD - "빨간색이 예뻐서"
<Action intent="Critical">Click Me</Action>

// ✅ GOOD - 의미에 맞게
<Action intent="Neutral">Click Me</Action>
<Action intent="Critical">Delete Account</Action>
```

**이유**: Intent는 장식이 아니라 의미입니다.

---

### 실수 2: Brand를 과도하게 사용

```tsx
// ❌ BAD - Brand 남발
<Action intent="Brand">Save</Action>
<Action intent="Brand">Cancel</Action>
<Action intent="Brand">Delete</Action>
<Action intent="Brand">Export</Action>

// ✅ GOOD - Brand는 주요 CTA만
<Action intent="Positive">Save</Action>
<Action intent="Neutral">Cancel</Action>
<Action intent="Critical">Delete</Action>
<Action intent="Brand">Upgrade to Pro</Action> {/* 유일한 Brand */}
```

**이유**: Brand는 화면당 1-2개만 사용해야 효과적입니다.

---

### 실수 3: 상태 표시를 Intent로

```tsx
// ❌ BAD - selected 상태를 intent로 표현
<Action intent="Brand" className={isSelected ? 'bg-blue-500' : ''}>
  Item
</Action>

// ✅ GOOD - selected prop 사용
<Action intent="Neutral" selected={isSelected}>
  Item
</Action>
```

**이유**: Intent는 의미, selected는 상태입니다.

---

### 실수 4: Positive와 Caution 혼동

```tsx
// ❌ BAD - "일단 진행"을 Positive로
<Action intent="Positive">Proceed Without Saving</Action>

// ✅ GOOD - 주의가 필요하면 Caution
<Action intent="Caution">Proceed Without Saving</Action>
```

**이유**: "저장 안 하고 진행"은 주의가 필요한 액션입니다.

---

## 📝 실습: 폼 버튼 조합

### 요구사항

다음 상황에 맞는 버튼 조합을 만드세요:

1. **회원 정보 수정 폼**
   - 저장 버튼
   - 취소 버튼
   - 계정 삭제 버튼

2. **게시글 작성 폼**
   - 발행 버튼 (주요 CTA)
   - 임시 저장 버튼
   - 취소 버튼

### 정답 예시

```tsx
// 1. 회원 정보 수정 폼
function UserEditForm() {
  return (
    <Block role="Toolbar" className="justify-between">
      <Action prominence="Standard" intent="Critical">
        Delete Account
      </Action>

      <div className="flex gap-2">
        <Action prominence="Standard" intent="Neutral">
          Cancel
        </Action>
        <Action prominence="Strong" intent="Positive">
          Save Changes
        </Action>
      </div>
    </Block>
  );
}

// 2. 게시글 작성 폼
function PostEditForm() {
  return (
    <Block role="Toolbar">
      <Action prominence="Standard" intent="Neutral">
        Cancel
      </Action>
      <Action prominence="Standard" intent="Neutral">
        Save Draft
      </Action>
      <Action prominence="Strong" intent="Brand">
        Publish
      </Action>
    </Block>
  );
}
```

**체크리스트**:
- [ ] 저장 버튼은 `intent="Positive"`인가?
- [ ] 삭제 버튼은 `intent="Critical"`인가?
- [ ] 취소 버튼은 `intent="Neutral"`인가?
- [ ] 주요 CTA는 `intent="Brand"`인가?
- [ ] Brand는 1개만 있는가?

---

## 🎯 자주 쓰는 패턴

### 1. CRUD 버튼

```tsx
// Create
<Action prominence="Strong" intent="Brand">
  Create New
</Action>

// Read (View)
<Action prominence="Standard" intent="Info">
  View Details
</Action>

// Update (Edit)
<Action prominence="Strong" intent="Positive">
  Save Changes
</Action>

// Delete
<Action prominence="Strong" intent="Critical">
  Delete
</Action>
```

---

### 2. 폼 제출 패턴

```tsx
<Block role="Toolbar">
  <Action prominence="Standard" intent="Neutral">
    Cancel
  </Action>
  <Action prominence="Strong" intent="Positive">
    Submit
  </Action>
</Block>
```

---

### 3. 상태 뱃지

```tsx
<Text role="Badge" intent="Positive">Active</Text>
<Text role="Badge" intent="Caution">Pending</Text>
<Text role="Badge" intent="Critical">Expired</Text>
<Text role="Badge" intent="Neutral">Draft</Text>
```

---

### 4. 알림 메시지

```tsx
// 성공
<Text role="Alert" intent="Positive">
  ✓ Operation completed successfully
</Text>

// 경고
<Text role="Alert" intent="Caution">
  ⚠ Please review your input
</Text>

// 에러
<Text role="Alert" intent="Critical">
  ✗ An error occurred
</Text>

// 정보
<Text role="Alert" intent="Info">
  ℹ Additional information available
</Text>
```

---

## ✅ 이 문서를 읽고 나면

- [x] Intent의 개념을 이해했다
- [x] 6가지 Intent의 의미를 파악했다
- [x] 액션별 적절한 Intent를 선택할 수 있다
- [x] Intent × Prominence 조합을 활용할 수 있다
- [x] 자주 하는 실수를 피할 수 있다

---

## 🔗 다음 단계

[Density](./03-density.md) - 간격과 크기 조절 시스템을 배웁니다.

---

**최종 업데이트**: 2026-01-11
**난이도**: 기초
**예상 소요 시간**: 20분
