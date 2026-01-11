# Prominence (시각적 중요도)

**난이도**: ⭐⭐☆☆☆
**소요 시간**: 20분
**선행 학습**: [핵심 개념](../00-introduction/02-core-concept.md), [Quick Start](../00-introduction/03-quick-start.md)

---

## 📌 이 문서에서 배울 내용

- Prominence가 무엇이고 왜 중요한가?
- 4가지 Prominence 레벨 완전 이해
- 화면당 적정 Prominence 개수
- 컴포넌트별 Prominence 적용법
- 자주 하는 실수와 해결법

---

## 🎯 Prominence란?

**Prominence**는 "시각적 중요도"를 나타내는 IDDL의 핵심 축입니다.

```tsx
// "이 요소가 얼마나 중요한가?"를 선언
<Action prominence="Strong">Save</Action>   // 중요함
<Action prominence="Standard">Cancel</Action> // 덜 중요함
```

**개발자가 선언하는 것**: 이 요소의 중요도
**시스템이 처리하는 것**: 크기, 패딩, 폰트 굵기, 배경 강도, 그림자

---

## 📊 4가지 Prominence 레벨

### Hero (최상위 강조)

**용도**: 화면에서 가장 중요한 요소 (보통 1개)

**자동 적용 스타일**:
- Font size: `48px` (text-5xl)
- Font weight: `600` (font-semibold)
- Padding: `px-8 py-4` (큰 패딩)
- 강한 배경 또는 accent 색상

**사용 예시**:
```tsx
// ✅ 랜딩 페이지 메인 제목
<Text role="Title" prominence="Hero">
  Welcome to IDDL
</Text>

// ✅ 주요 CTA (Call To Action)
<Action prominence="Hero" intent="Brand">
  Get Started Now
</Action>

// ✅ 대시보드 주요 숫자
<Text role="Title" prominence="Hero">
  $1,234,567
</Text>
```

**화면당 개수**: 0-1개 (없어도 됨, 있으면 1개만)

---

### Strong (주요 요소)

**용도**: 화면의 핵심 요소들 (1-3개)

**자동 적용 스타일**:
- Font size: `16px` (text-base)
- Font weight: `500` (font-medium)
- Padding: `px-6 py-3` (중간 패딩)
- 배경 또는 테두리 강조

**사용 예시**:
```tsx
// ✅ 폼의 제출 버튼
<Action prominence="Strong" intent="Positive">
  Submit
</Action>

// ✅ 섹션 제목
<Text role="Title" prominence="Strong">
  User Settings
</Text>

// ✅ 주요 카드
<Block role="Card" prominence="Strong">
  <Text role="Title">Featured Article</Text>
</Block>
```

**화면당 개수**: 1-3개 (너무 많으면 안 됨)

---

### Standard (보조 요소)

**용도**: 보조적인 역할 (3-10개)

**자동 적용 스타일**:
- Font size: `14px` (text-sm)
- Font weight: `400` (font-normal)
- Padding: `px-4 py-2` (작은 패딩)
- 투명 배경 또는 subtle 테두리

**사용 예시**:
```tsx
// ✅ 취소 버튼
<Action prominence="Standard">
  Cancel
</Action>

// ✅ 부제목
<Text role="Body" prominence="Standard">
  Configure your account preferences
</Text>

// ✅ 덜 중요한 카드
<Block role="Card" prominence="Standard">
  <Text role="Body">Additional Info</Text>
</Block>
```

**화면당 개수**: 3-10개

---

### Subtle (최소 강조)

**용도**: 가장 덜 중요한 요소 (제한 없음)

**자동 적용 스타일**:
- Font size: `12px` (text-xs)
- Font weight: `400` (font-normal)
- Padding: `px-2 py-1` (최소 패딩)
- 배경 없음, 텍스트만

**사용 예시**:
```tsx
// ✅ 레이블
<Text role="Label" prominence="Subtle">
  Email
</Text>

// ✅ 도움말 버튼
<Action prominence="Subtle" intent="Neutral">
  Help
</Action>

// ✅ 메타 정보
<Text role="Body" prominence="Subtle">
  Last updated: 2026-01-11
</Text>
```

**화면당 개수**: 제한 없음

---

## 🎨 컴포넌트별 Prominence 적용

### Action (버튼)

```tsx
function ButtonExample() {
  return (
    <div className="flex flex-col gap-4 p-8">
      {/* Hero: 랜딩 페이지 주요 CTA */}
      <Action prominence="Hero" intent="Brand">
        Start Free Trial
      </Action>

      {/* Strong: 폼 제출 버튼 */}
      <Action prominence="Strong" intent="Positive">
        Save Changes
      </Action>

      {/* Standard: 보조 액션 */}
      <Action prominence="Standard">
        Cancel
      </Action>

      {/* Subtle: 덜 중요한 링크 */}
      <Action prominence="Subtle" intent="Info">
        Learn More
      </Action>
    </div>
  );
}
```

**결과**:
- Hero: 가장 크고 강조됨 (px-8 py-4, font-semibold)
- Strong: 중간 크기 (px-6 py-3, font-medium)
- Standard: 작은 크기 (px-4 py-2, font-normal)
- Subtle: 최소 크기 (px-2 py-1, 텍스트 스타일)

---

### Text (텍스트)

```tsx
function TextExample() {
  return (
    <div className="flex flex-col gap-4 p-8">
      {/* Hero: 페이지 메인 제목 */}
      <Text role="Title" prominence="Hero">
        Dashboard
      </Text>

      {/* Strong: 섹션 제목 */}
      <Text role="Title" prominence="Strong">
        Recent Activity
      </Text>

      {/* Standard: 부제목 */}
      <Text role="Body" prominence="Standard">
        Here's what happened in the last 7 days
      </Text>

      {/* Subtle: 메타 정보 */}
      <Text role="Body" prominence="Subtle">
        Last sync: 5 minutes ago
      </Text>
    </div>
  );
}
```

**자동 적용**:
- Hero: `text-5xl` (48px), `font-semibold` (600)
- Strong: `text-base` (16px), `font-medium` (500)
- Standard: `text-sm` (14px), `font-normal` (400), `opacity-80`
- Subtle: `text-xs` (12px), `font-normal` (400), `opacity-60`

---

### Block (그룹)

```tsx
function BlockExample() {
  return (
    <div className="flex flex-col gap-4 p-8">
      {/* Strong: 주요 카드 (강조됨) */}
      <Block role="Card" prominence="Strong">
        <Text role="Title" prominence="Strong">
          Featured
        </Text>
        <Text role="Body" prominence="Standard">
          This is the main content
        </Text>
      </Block>

      {/* Standard: 보조 카드 */}
      <Block role="Card" prominence="Standard">
        <Text role="Title" prominence="Standard">
          Additional Info
        </Text>
        <Text role="Body" prominence="Subtle">
          Supporting content
        </Text>
      </Block>
    </div>
  );
}
```

**자동 적용**:
- Strong: `shadow-md`, `bg-white`, `border-2`
- Standard: `shadow-sm`, `bg-gray-50`, `border`

---

## ⚡ 화면당 적정 개수

### 규칙: "중요한 게 많으면 아무것도 중요하지 않다"

```tsx
// ✅ GOOD - 명확한 계층
<Page role="Document">
  <Section role="Container">
    {/* Hero: 1개 */}
    <Text role="Title" prominence="Hero">Settings</Text>

    {/* Strong: 2개 */}
    <Block role="Form" prominence="Strong">
      <Text role="Title" prominence="Strong">Profile</Text>
      <Field label="Name" />
      <Action prominence="Strong" intent="Positive">Save</Action>
    </Block>

    {/* Standard: 5개 */}
    <Action prominence="Standard">Cancel</Action>
    <Text role="Body" prominence="Standard">Help text 1</Text>
    <Text role="Body" prominence="Standard">Help text 2</Text>
    {/* ... */}

    {/* Subtle: 제한 없음 */}
    <Text role="Label" prominence="Subtle">Field 1</Text>
    <Text role="Label" prominence="Subtle">Field 2</Text>
    {/* ... */}
  </Section>
</Page>

// ❌ BAD - 모두 Strong
<Page role="Document">
  <Action prominence="Strong">Save</Action>
  <Action prominence="Strong">Delete</Action>
  <Action prominence="Strong">Cancel</Action>
  <Action prominence="Strong">Export</Action>
  {/* 모든 게 중요하면 아무것도 중요하지 않음 */}
</Page>
```

**권장 개수**:
| Prominence | 화면당 개수 | 비율 |
|-----------|-----------|------|
| Hero | 0-1개 | ~5% |
| Strong | 1-3개 | ~15% |
| Standard | 3-10개 | ~30% |
| Subtle | 제한 없음 | ~50% |

---

## 🚫 자주 하는 실수

### 실수 1: 모든 버튼을 Strong로

```tsx
// ❌ BAD
<Block role="Toolbar">
  <Action prominence="Strong">Save</Action>
  <Action prominence="Strong">Cancel</Action>
  <Action prominence="Strong">Delete</Action>
</Block>

// ✅ GOOD
<Block role="Toolbar">
  <Action prominence="Strong" intent="Positive">Save</Action>
  <Action prominence="Standard">Cancel</Action>
  <Action prominence="Standard" intent="Critical">Delete</Action>
</Block>
```

**이유**: 주요 액션은 1개만 있어야 합니다.

---

### 실수 2: Hero를 남발

```tsx
// ❌ BAD - Hero가 2개
<Page role="Document">
  <Text role="Title" prominence="Hero">Dashboard</Text>
  <Text role="Title" prominence="Hero">Statistics</Text>
</Page>

// ✅ GOOD
<Page role="Document">
  <Text role="Title" prominence="Hero">Dashboard</Text>
  <Text role="Title" prominence="Strong">Statistics</Text>
</Page>
```

**이유**: Hero는 화면당 0-1개만 사용합니다.

---

### 실수 3: 계층 구조 무시

```tsx
// ❌ BAD - 부모가 자식보다 덜 강조됨
<Block role="Card" prominence="Subtle">
  <Text role="Title" prominence="Hero">
    Title
  </Text>
</Block>

// ✅ GOOD - 계층 구조 일치
<Block role="Card" prominence="Strong">
  <Text role="Title" prominence="Strong">
    Title
  </Text>
  <Text role="Body" prominence="Standard">
    Description
  </Text>
</Block>
```

**이유**: 부모 컴포넌트는 자식보다 같거나 높은 prominence를 가져야 합니다.

---

## 📝 실습: 대시보드 카드

### 요구사항

다음 요구사항을 만족하는 대시보드 카드를 만드세요:

1. 주요 통계 카드 1개 (가장 강조)
2. 보조 통계 카드 3개 (중간 강조)
3. 메타 정보 여러 개 (최소 강조)

### 정답 예시

```tsx
function DashboardCards() {
  return (
    <div className="grid grid-cols-2 gap-4 p-8">
      {/* 주요 카드 - Primary */}
      <Block
        role="Card"
        prominence="Strong"
        className="col-span-2"
      >
        <Text role="Title" prominence="Hero">
          $1,234,567
        </Text>
        <Text role="Body" prominence="Standard">
          Total Revenue
        </Text>
        <Text role="Body" prominence="Subtle">
          +12.5% from last month
        </Text>
      </Block>

      {/* 보조 카드 3개 - Secondary */}
      <Block role="Card" prominence="Standard">
        <Text role="Title" prominence="Strong">
          1,234
        </Text>
        <Text role="Body" prominence="Standard">
          Active Users
        </Text>
        <Text role="Body" prominence="Subtle">
          +5.2%
        </Text>
      </Block>

      <Block role="Card" prominence="Standard">
        <Text role="Title" prominence="Strong">
          567
        </Text>
        <Text role="Body" prominence="Standard">
          New Signups
        </Text>
        <Text role="Body" prominence="Subtle">
          +8.1%
        </Text>
      </Block>

      <Block role="Card" prominence="Standard">
        <Text role="Title" prominence="Strong">
          89%
        </Text>
        <Text role="Body" prominence="Standard">
          Satisfaction
        </Text>
        <Text role="Body" prominence="Subtle">
          +2.3%
        </Text>
      </Block>
    </div>
  );
}
```

**체크리스트**:
- [ ] 주요 카드가 `prominence="Strong"`인가?
- [ ] 주요 숫자가 `prominence="Hero"`인가?
- [ ] 보조 카드가 `prominence="Standard"`인가?
- [ ] 메타 정보가 `prominence="Subtle"`인가?
- [ ] Hero는 1개만 있는가?

---

## 🎯 자주 쓰는 패턴

### 1. 폼 버튼 조합

```tsx
<Block role="Toolbar">
  <Action prominence="Standard">Cancel</Action>
  <Action prominence="Strong" intent="Positive">Save</Action>
</Block>
```

---

### 2. 페이지 제목 계층

```tsx
<Text role="Title" prominence="Hero">Dashboard</Text>
<Text role="Title" prominence="Strong">Recent Activity</Text>
<Text role="Body" prominence="Standard">Last 7 days</Text>
<Text role="Body" prominence="Subtle">Updated 5 min ago</Text>
```

---

### 3. 카드 그리드

```tsx
<Block role="Card" prominence="Strong">
  {/* 주요 카드 */}
</Block>

<Block role="Card" prominence="Standard">
  {/* 보조 카드 1 */}
</Block>

<Block role="Card" prominence="Standard">
  {/* 보조 카드 2 */}
</Block>
```

---

## ✅ 이 문서를 읽고 나면

- [x] Prominence의 개념을 이해했다
- [x] 4가지 레벨의 차이를 알았다
- [x] 화면당 적정 개수를 파악했다
- [x] 자주 하는 실수를 피할 수 있다
- [x] 컴포넌트별 적용법을 익혔다

---

## 🔗 다음 단계

[Intent](./02-intent.md) - 의미적 색상 시스템을 배웁니다.

---

**최종 업데이트**: 2026-01-11
**난이도**: 기초
**예상 소요 시간**: 20분
