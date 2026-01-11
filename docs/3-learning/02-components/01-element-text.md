# Text 컴포넌트

**난이도**: ⭐⭐☆☆☆
**소요 시간**: 25분
**선행 학습**: [Type](../01-fundamentals/05-type.md)

---

## 📌 이 문서에서 배울 내용

- Text Element가 무엇인가?
- 5가지 Text Role 완전 이해
- Prominence × Intent 조합
- 실전 활용 패턴
- 자주 하는 실수와 해결법

---

## 🎯 Text란?

**Text**는 정적 콘텐츠를 표시하는 IDDL Element입니다.

```tsx
// 데이터 바인딩 없는 순수한 정적 텍스트
<Text role="Title" prominence="Hero">
  Welcome to IDDL
</Text>
```

**핵심 특징**:
- **Type**: Element (더 이상 분해할 수 없는 원자적 요소)
- **용도**: 제목, 본문, 레이블, 코드 등 정적 텍스트
- **데이터 바인딩**: 없음 (Field와의 차이점)

---

## 📚 5가지 Text Role

### Title (제목)

**용도**: 페이지, 섹션, 카드의 제목

**HTML 매핑**:
- prominence="Hero" → `<h1>`
- prominence="Strong" → `<h2>`
- prominence="Standard" → `<h3>`
- prominence="Subtle" → `<h4>`

**예시**:
```tsx
// 페이지 메인 제목
<Text role="Title" prominence="Hero">
  Dashboard
</Text>

// 섹션 제목
<Text role="Title" prominence="Strong">
  Recent Activity
</Text>

// 카드 제목
<Text role="Title" prominence="Standard">
  User Profile
</Text>

// 서브섹션 제목
<Text role="Title" prominence="Subtle">
  Personal Information
</Text>
```

**자동 스타일**:
- font-semibold, tracking-tight
- prominence에 따라 text-4xl ~ text-xl

---

### Body (본문)

**용도**: 본문, 설명, 단락 텍스트

**HTML 매핑**: `<p>`

**예시**:
```tsx
// 강조 본문 (리드 텍스트)
<Text role="Body" prominence="Hero">
  This is the main introduction paragraph with larger text.
</Text>

// 일반 본문
<Text role="Body" prominence="Standard">
  This is normal body text for general content.
</Text>

// 작은 설명
<Text role="Body" prominence="Subtle">
  This is smaller, muted text for less important content.
</Text>
```

**자동 스타일**:
- leading-7 (line-height)
- prominence에 따라 text-xl ~ text-sm

---

### Label (레이블)

**용도**: 폼 필드 레이블, UI 요소 라벨

**HTML 매핑**: `<span>` (보통 Field와 함께 사용 시 `<label>`)

**예시**:
```tsx
// 폼 레이블 (Field가 자동 처리)
<Field label="Email" dataType="email" />

// 독립 레이블
<Text role="Label">Email Address</Text>
```

**자동 스타일**:
- text-sm, font-medium
- leading-none

---

### Caption (캡션)

**용도**: 이미지 캡션, 작은 설명, 메타 정보

**HTML 매핑**: `<small>`

**예시**:
```tsx
// 이미지 캡션
<Text role="Caption">
  Fig 1. System Architecture Diagram
</Text>

// 메타 정보
<Text role="Caption">
  Last updated: 5 minutes ago
</Text>

// 도움말 텍스트
<Text role="Caption">
  Password must be at least 8 characters
</Text>
```

**자동 스타일**:
- text-sm, text-subtle (낮은 opacity)

---

### Code (코드)

**용도**: 인라인 코드, 명령어, 변수명

**HTML 매핑**: `<code>`

**예시**:
```tsx
// 인라인 코드
<Text role="Body">
  Run <Text role="Code">npm install</Text> to install dependencies.
</Text>

// 독립 코드 블록
<Text role="Code">
  const x = 10;
</Text>

// 변수명 강조
<Text role="Body">
  Set the <Text role="Code">API_KEY</Text> environment variable.
</Text>
```

**자동 스타일**:
- font-mono (monospace)
- bg-surface-sunken (회색 배경)
- px-[0.3rem] py-[0.2rem]
- rounded

---

## 🎨 Prominence × Role 조합

### Title 계층 구조

```tsx
function TitleHierarchy() {
  return (
    <div className="flex flex-col gap-4">
      {/* Hero: 페이지 메인 제목 */}
      <Text role="Title" prominence="Hero">
        Page Title (H1)
      </Text>

      {/* Strong: 섹션 제목 */}
      <Text role="Title" prominence="Strong">
        Section Header (H2)
      </Text>

      {/* Standard: 카드 제목 */}
      <Text role="Title" prominence="Standard">
        Card Header (H3)
      </Text>

      {/* Subtle: 서브섹션 */}
      <Text role="Title" prominence="Subtle">
        Subsection (H4)
      </Text>
    </div>
  );
}
```

**결과**:
| Prominence | Font Size | Font Weight | Use Case |
|-----------|-----------|-------------|----------|
| Hero | 48px (text-4xl) | 800 (extrabold) | 페이지 메인 제목 |
| Strong | 30px (text-3xl) | 600 (semibold) | 섹션 헤더 |
| Standard | 24px (text-2xl) | 600 (semibold) | 카드 헤더 |
| Subtle | 20px (text-xl) | 600 (semibold) | 서브섹션 |

---

### Body 계층 구조

```tsx
function BodyHierarchy() {
  return (
    <div className="flex flex-col gap-4">
      {/* Hero: 리드 텍스트 */}
      <Text role="Body" prominence="Hero">
        This is a lead paragraph with larger text for introduction.
      </Text>

      {/* Strong: 강조 본문 */}
      <Text role="Body" prominence="Strong">
        This is emphasized body text.
      </Text>

      {/* Standard: 일반 본문 */}
      <Text role="Body" prominence="Standard">
        This is normal body text for general content.
      </Text>

      {/* Subtle: 작은 설명 */}
      <Text role="Body" prominence="Subtle">
        This is smaller, muted text.
      </Text>
    </div>
  );
}
```

**결과**:
| Prominence | Font Size | Opacity | Use Case |
|-----------|-----------|---------|----------|
| Hero | 20px (text-xl) | 70% (muted) | 리드 텍스트 |
| Strong | 18px (text-lg) | 100% (medium) | 강조 본문 |
| Standard | 16px (text-base) | 100% | 일반 본문 |
| Subtle | 14px (text-sm) | 60% (subtle) | 작은 설명 |

---

## 🌈 Intent 적용

### 의미적 색상

```tsx
function IntentExamples() {
  return (
    <div className="flex flex-col gap-2">
      <Text role="Body" intent="Neutral">
        Normal text (default)
      </Text>

      <Text role="Body" intent="Brand">
        Brand accent text
      </Text>

      <Text role="Body" intent="Positive">
        Success message
      </Text>

      <Text role="Body" intent="Caution">
        Warning message
      </Text>

      <Text role="Body" intent="Critical">
        Error message
      </Text>

      <Text role="Body" intent="Info">
        Info message
      </Text>
    </div>
  );
}
```

**자동 색상**:
- Neutral: text-text (기본 텍스트 색)
- Brand: text-accent (브랜드 색)
- Positive: text-green-600
- Caution: text-yellow-600
- Critical: text-red-600
- Info: text-blue-600

---

## 🎯 실전 패턴

### 1. 페이지 헤더

```tsx
function PageHeader() {
  return (
    <div className="flex flex-col gap-2">
      <Text role="Title" prominence="Hero">
        Settings
      </Text>
      <Text role="Body" prominence="Subtle">
        Manage your account preferences and settings
      </Text>
    </div>
  );
}
```

---

### 2. 카드 UI

```tsx
function Card() {
  return (
    <Block role="Card" prominence="Standard">
      <Text role="Title" prominence="Standard">
        User Profile
      </Text>
      <Text role="Body" prominence="Standard">
        John Doe • john@example.com
      </Text>
      <Text role="Caption">
        Member since 2024
      </Text>
    </Block>
  );
}
```

---

### 3. 폼 필드 레이블

```tsx
function FormField() {
  return (
    <div>
      <Text role="Label">Email Address</Text>
      <Field dataType="email" />
      <Text role="Caption">
        We'll never share your email with anyone else.
      </Text>
    </div>
  );
}
```

---

### 4. 상태 메시지

```tsx
function StatusMessages() {
  return (
    <div className="flex flex-col gap-2">
      <Text role="Body" intent="Positive">
        ✓ Changes saved successfully
      </Text>

      <Text role="Body" intent="Caution">
        ⚠ Please review your input
      </Text>

      <Text role="Body" intent="Critical">
        ✗ An error occurred
      </Text>

      <Text role="Body" intent="Info">
        ℹ Additional information available
      </Text>
    </div>
  );
}
```

---

### 5. 인라인 코드

```tsx
function CodeExample() {
  return (
    <Text role="Body">
      Run <Text role="Code">npm install</Text> to install dependencies, then
      start the server with <Text role="Code">npm run dev</Text>.
    </Text>
  );
}
```

---

## 🚫 자주 하는 실수

### 실수 1: 제목에 Body role 사용

```tsx
// ❌ BAD - 제목인데 Body
<Text role="Body" prominence="Hero">
  Page Title
</Text>

// ✅ GOOD - 제목은 Title role
<Text role="Title" prominence="Hero">
  Page Title
</Text>
```

**이유**: role과 prominence가 의미적으로 일치해야 합니다.

---

### 실수 2: 모든 텍스트를 prominence="Hero"로

```tsx
// ❌ BAD - 모두 Hero
<Text role="Title" prominence="Hero">Title 1</Text>
<Text role="Title" prominence="Hero">Title 2</Text>
<Text role="Title" prominence="Hero">Title 3</Text>

// ✅ GOOD - 계층 구조
<Text role="Title" prominence="Hero">Main Title</Text>
<Text role="Title" prominence="Strong">Section</Text>
<Text role="Title" prominence="Standard">Subsection</Text>
```

**이유**: Hero는 화면당 0-1개만 사용해야 합니다.

---

### 실수 3: Label 대신 Caption 사용

```tsx
// ❌ BAD - 필드 레이블인데 Caption
<Text role="Caption">Email</Text>
<Field dataType="email" />

// ✅ GOOD - Label 사용
<Text role="Label">Email</Text>
<Field dataType="email" />
```

**이유**: Caption은 메타 정보용, Label은 필드 레이블용입니다.

---

### 실수 4: Code role을 블록 코드에 사용

```tsx
// ❌ BAD - 여러 줄 코드를 Code role로
<Text role="Code">
  function hello() {'\n'}
  {'  '}console.log('Hello');{'\n'}
  {'}'}
</Text>

// ✅ GOOD - 코드 블록은 별도 처리 (또는 CodeEditor 사용)
<pre className="font-mono bg-surface-sunken p-4 rounded">
  <code>
    {`function hello() {
  console.log('Hello');
}`}
  </code>
</pre>
```

**이유**: Code role은 인라인 코드용입니다.

---

## 📝 실습: 블로그 포스트 헤더

### 요구사항

다음 요구사항을 만족하는 블로그 포스트 헤더를 만드세요:

1. 메인 제목: "Getting Started with IDDL"
2. 부제목: "A comprehensive guide to Intent-Driven Design Language"
3. 메타 정보: "Published on Jan 11, 2026 • 10 min read"

### 정답 예시

```tsx
function BlogPostHeader() {
  return (
    <div className="flex flex-col gap-3">
      {/* 메인 제목 */}
      <Text role="Title" prominence="Hero">
        Getting Started with IDDL
      </Text>

      {/* 부제목 */}
      <Text role="Body" prominence="Hero">
        A comprehensive guide to Intent-Driven Design Language
      </Text>

      {/* 메타 정보 */}
      <Text role="Caption">
        Published on Jan 11, 2026 • 10 min read
      </Text>
    </div>
  );
}
```

**체크리스트**:
- [ ] 메인 제목이 `role="Title" prominence="Hero"`인가?
- [ ] 부제목이 `role="Body" prominence="Hero"`인가?
- [ ] 메타 정보가 `role="Caption"`인가?
- [ ] 계층 구조가 명확한가?

---

## 💡 고급 기능

### highlight prop (v1.1)

텍스트 검색 결과에서 매칭된 부분을 강조합니다:

```tsx
<Text
  role="Body"
  content="This is a sample text with highlight"
  highlight="sample"
/>

// 결과: "This is a <mark>sample</mark> text with highlight"
```

---

### as prop (커스텀 HTML 태그)

기본 HTML 태그를 변경할 수 있습니다:

```tsx
// 기본: <h1>
<Text role="Title" prominence="Hero">Title</Text>

// 커스텀: <div>
<Text role="Title" prominence="Hero" as="div">
  Title as div
</Text>
```

---

### align prop (정렬)

```tsx
<Text role="Title" align="left">Left</Text>
<Text role="Title" align="center">Center</Text>
<Text role="Title" align="right">Right</Text>
```

---

## ✅ 이 문서를 읽고 나면

- [x] Text Element의 역할을 이해했다
- [x] 5가지 Text Role을 파악했다
- [x] Prominence × Role 조합을 활용할 수 있다
- [x] Intent로 의미적 색상을 적용할 수 있다
- [x] 실전 패턴을 익혔다

---

## 🔗 다음 단계

[Action 컴포넌트](./02-element-action.md) - 버튼, 링크, 메뉴 아이템 등 인터랙션 요소를 배웁니다.

---

**최종 업데이트**: 2026-01-11
**난이도**: 기초
**예상 소요 시간**: 25분
