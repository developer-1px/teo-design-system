# 핵심 개념

**난이도**: ⭐⭐☆☆☆
**소요 시간**: 15분
**선행 학습**: [왜 IDDL인가?](./01-why-iddl.md)

---

## 📌 이 문서에서 배울 내용

- IDDL의 5 Axes System
- Why-based vs How-based 차이
- prominence × intent × density 자동화
- 컴포넌트 계층 구조

---

## 🎯 IDDL의 핵심: 5 Axes System

IDDL은 모든 UI 요소를 **5가지 축(Axes)**으로 정의합니다:

```tsx
<Action
  type="Element"        // 1️⃣ Type: 무엇인가?
  role="Button"         // 2️⃣ Role: 어떤 역할?
  prominence="Strong"  // 3️⃣ Prominence: 얼마나 중요?
  intent="Positive"     // 4️⃣ Intent: 무슨 의미?
  density="Standard"    // 5️⃣ Density: 얼마나 촘촘?
>
  Save
</Action>
```

이 5가지 축이 조합되어 **자동으로 className이 생성**됩니다.

---

## 1️⃣ Type: 무엇인가? (What)

컴포넌트의 **분류**를 나타냅니다.

| Type | 설명 | 예시 |
|------|------|------|
| **Page** | 최상위 루트 | Application, Document |
| **Section** | 레이아웃 영역 | Sidebar, Editor, Panel |
| **Block** | 논리적 그룹 | Form, Card, Toolbar |
| **Element** | 기본 요소 | Text, Field, Action |
| **Overlay** | Floating UI | Dialog, Toast, Tooltip |

```tsx
// 계층 구조
<Page>
  <Section>
    <Block>
      <Element />
    </Block>
  </Section>
</Page>
```

**개발자가 직접 지정**: 보통 컴포넌트 이름으로 자동 결정
**시스템이 처리**: 계층 구조 검증

---

## 2️⃣ Role: 어떤 역할? (Why)

컴포넌트의 **구체적인 역할**을 나타냅니다.

### Element Role 예시

```tsx
// Text Element의 다양한 Role
<Text role="Title">Welcome</Text>      // 제목
<Text role="Body">Description</Text>   // 본문
<Text role="Label">Email</Text>        // 레이블
<Text role="Badge">New</Text>          // 뱃지

// Action Element의 다양한 Role
<Action role="Button">Save</Action>           // 버튼
<Action role="IconButton">⚙️</Action>         // 아이콘 버튼
<Action role="Link" href="/docs">Docs</Action> // 링크
```

**개발자가 선언**: `role="Button"`
**시스템이 처리**:
- HTML 태그 (`<button>`)
- ARIA 속성 (`role="button"`)
- 기본 스타일

---

## 3️⃣ Prominence: 얼마나 중요? (Importance)

**시각적 중요도**를 나타냅니다.

| Prominence | 용도 | 화면당 개수 | 예시 |
|-----------|------|-----------|------|
| **Hero** | 최상위 강조 | 0-1개 | 랜딩 페이지 제목 |
| **Strong** | 주요 요소 | 1-3개 | 주요 CTA, 제목 |
| **Standard** | 보조 요소 | 3-10개 | 보조 버튼, 부제목 |
| **Subtle** | 덜 중요한 요소 | 제한 없음 | 레이블, 작은 텍스트 |

```tsx
// 버튼 예시
<Action prominence="Strong">Save</Action>     // 큰 패딩, 강조된 배경
<Action prominence="Standard">Cancel</Action> // 중간 패딩, 투명 배경
<Action prominence="Subtle">Help</Action>    // 작은 패딩, 텍스트만

// 텍스트 예시
<Text prominence="Hero">Welcome to IDDL</Text>     // 48px, 굵게
<Text prominence="Strong">Getting Started</Text>  // 16px, 중간
<Text prominence="Standard">Learn the basics</Text> // 14px, 보통
```

**자동 적용**:
- Font size: Hero (48px) → Primary (16px) → Secondary (14px) → Tertiary (12px)
- Font weight: Hero (600) → Primary (500) → Secondary (400) → Tertiary (400)
- Padding: Hero (px-8 py-4) → Primary (px-6 py-3) → Secondary (px-4 py-2) → Tertiary (px-2 py-1)

---

## 4️⃣ Intent: 무슨 의미? (Meaning)

**의미적 색상**을 나타냅니다.

| Intent | 의미 | 색상 | 사용 예시 |
|--------|------|------|----------|
| **Neutral** | 중립 | Gray | 기본 버튼, 일반 텍스트 |
| **Brand** | 브랜드 | Accent | 브랜드 CTA, 강조 |
| **Positive** | 긍정/성공 | Green | 저장, 성공 메시지 |
| **Caution** | 주의 | Yellow | 경고, 주의사항 |
| **Critical** | 위험/에러 | Red | 삭제, 에러 메시지 |
| **Info** | 정보 | Blue | 정보 메시지, 도움말 |

```tsx
// Action 예시
<Action intent="Neutral">Cancel</Action>    // 회색
<Action intent="Brand">Learn More</Action>  // Accent 색
<Action intent="Positive">Save</Action>     // 초록색
<Action intent="Caution">Warning</Action>   // 노란색
<Action intent="Critical">Delete</Action>   // 빨간색

// Text 예시
<Text role="Alert" intent="Positive">Success!</Text>  // 초록색 경고
<Text role="Alert" intent="Critical">Error!</Text>    // 빨간색 경고
```

**자동 적용**:
- Background color
- Text color
- Border color
- Hover/Focus states

---

## 5️⃣ Density: 얼마나 촘촘? (Spacing)

**간격과 크기**를 나타냅니다.

| Density | 간격 | 사용 상황 |
|---------|------|----------|
| **Comfortable** | 넓은 간격 | 데스크톱, 여유로운 UI |
| **Standard** | 중간 간격 | 기본값 |
| **Compact** | 좁은 간격 | 모바일, 정보 밀도 높은 UI |

```tsx
// Form 예시
<Block role="Form" density="Comfortable">  // gap-6, p-6
  <Field label="Name" />
  <Field label="Email" />
</Block>

<Block role="Form" density="Standard">     // gap-4, p-4
  <Field label="Name" />
  <Field label="Email" />
</Block>

<Block role="Form" density="Compact">      // gap-2, p-2
  <Field label="Name" />
  <Field label="Email" />
</Block>
```

**자동 적용**:
- Gap: Comfortable (24px) → Standard (16px) → Compact (8px)
- Padding: Comfortable (24px) → Standard (16px) → Compact (8px)

---

## ⚙️ 자동화 공식

### prominence × intent → className

```tsx
<Action prominence="Strong" intent="Positive">
  Save
</Action>

// 시스템이 생성하는 className:
// bg-green-500        // intent="Positive" → green
// text-white
// px-6 py-3          // prominence="Strong" → 큰 패딩
// font-semibold      // prominence="Strong" → 강조
// rounded-lg
// hover:bg-green-600
// focus:ring-2 focus:ring-green-500
// active:bg-green-700
```

### prominence × intent × density → className

```tsx
<Block role="Form" prominence="Strong" density="Compact">
  ...
</Block>

// 생성되는 className:
// bg-white            // prominence="Strong" → 강조 배경
// shadow-md          // prominence="Strong" → 그림자
// p-2                // density="Compact" → 좁은 패딩
// gap-2              // density="Compact" → 좁은 간격
// rounded-lg
```

**개발자가 하는 일**: 3개 props 선언
**시스템이 하는 일**: 10+ className 자동 생성

---

## 📊 컴포넌트 계층 구조

```
Page (Root)
 │
 ├─ role="Application"  → IDE, Dashboard (Full-screen grid)
 ├─ role="Document"     → 문서, 폼 (Scrollable)
 ├─ role="Focus"        → 로그인 (Centered)
 └─ role="Fullscreen"   → 프레젠테이션 (Locked)
      │
      └─ Section (Layout regions)
           │
           ├─ role="ActivityBar"
           ├─ role="Sidebar"
           ├─ role="Editor"
           └─ role="Panel"
                │
                └─ Block (Logical grouping)
                     │
                     ├─ role="Form"
                     ├─ role="Card"
                     ├─ role="Toolbar"
                     └─ role="List"
                          │
                          └─ Element (Primitives)
                               │
                               ├─ Text (Title, Body, Label, etc.)
                               ├─ Field (text, email, select, etc.)
                               └─ Action (Button, Link, etc.)

Overlay (Floating UI)
 ├─ role="Dialog"
 ├─ role="Toast"
 └─ role="Tooltip"
```

---

## 🔥 실전 예시: 대시보드

```tsx
<Page role="Application" layout="Studio">
  <Section role="Sidebar">
    <Block role="List" density="Compact">
      <Text role="Title" prominence="Strong">Projects</Text>
      {projects.map(p => (
        <Text role="Body" prominence="Standard">{p.name}</Text>
      ))}
    </Block>
  </Section>

  <Section role="Editor">
    <Block role="Grid" density="Standard">
      {stats.map(stat => (
        <Block role="Card" prominence="Strong">
          <Text role="Title" prominence="Hero">{stat.value}</Text>
          <Text role="Body" prominence="Subtle">{stat.label}</Text>
        </Block>
      ))}
    </Block>
  </Section>
</Page>
```

**자동으로 처리되는 것**:
- ✅ IDE 레이아웃 (grid-template-areas)
- ✅ Sidebar 너비 (250px)
- ✅ Resizable panels
- ✅ Card 스타일 (shadow, padding, rounded)
- ✅ Text 크기 (Hero: 48px, Tertiary: 12px)
- ✅ Grid 간격 (Standard: 16px)
- ✅ 모든 ARIA 속성
- ✅ 키보드 탐색

---

## 🎯 핵심 요약

### 5 Axes

1. **Type** - 컴포넌트 분류 (Page, Section, Block, Element, Overlay)
2. **Role** - 구체적 역할 (Button, Form, Title, etc.)
3. **Prominence** - 시각적 중요도 (Hero, Strong, Standard, Subtle)
4. **Intent** - 의미적 색상 (Neutral, Brand, Positive, Caution, Critical, Info)
5. **Density** - 간격/크기 (Comfortable, Standard, Compact)

### 자동화 공식

```
prominence × intent × density × state → className

개발자: 3개 props
시스템: 10+ className + ARIA + 키보드
```

### Why-based

```tsx
// ❌ How-based
<button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold">
  Save
</button>

// ✅ Why-based
<Action prominence="Strong" intent="Positive">
  Save
</Action>
```

---

## ✅ 이 문서를 읽고 나면

- [x] 5 Axes System을 이해했다
- [x] prominence × intent × density 자동화를 이해했다
- [x] 컴포넌트 계층 구조를 파악했다
- [x] Why-based의 장점을 체득했다

---

## 🔗 다음 단계

[Quick Start](./03-quick-start.md) - 5분 안에 첫 IDDL UI를 만들어봅니다!

---

**최종 업데이트**: 2026-01-11
**난이도**: 기초
**예상 소요 시간**: 15분
