# MDK의 근본 목적: CSS 의사결정 시스템

**날짜**: 2026년 1월 15일 (정오 회의)
**참석자**: 6명 (동일 팀)
**목표**: "FE 디자인이란 무엇인가?"라는 근본 질문에서 MDK 재정립
**핵심**: 디자인 = CSS 선택, 문제 = 가짓수 폭발, 해법 = 의사결정 트리

---

## 🎬 Act 1: 근본 질문 - "FE 디자인이란 무엇인가?"

### Sarah (아키텍트)
*(회의 시작)*

우리가 몇 달 동안 MDK를 만들어왔는데...

잠깐, **FE 디자인이 정확히 뭔가요?**

### Marcus (개발자)
음... UI를 만드는 거요?

### Sarah
더 구체적으로요. **우리가 실제로 뭘 하고 있죠?**

### Dev (기여자)
*(생각하다가)*

결국...

```
HTML + CSS 를 결정하는 것
```

### Sarah
맞아요! FE 디자인은:
- HTML: 어떤 요소를 쓸까 (div, button, input)
- CSS: 어떻게 보일까 (크기, 색상, 배치, 간격)

**이 두 가지 결정의 집합**이에요.

---

## 🎬 Act 2: AI는 왜 디자인을 못하는가?

### Emma (디자이너)
그런데 AI는 HTML은 잘 선택해요.

```tsx
// AI가 잘 하는 것
<button>클릭</button>
<input type="email" />
<div>...</div>
```

문제는 **CSS**죠.

### Yuki (UX 연구원)
CSS가 왜 문제죠?

### Marcus (개발자)
*(화이트보드에)*

CSS 속성이 얼마나 많은지 볼까요?

---

### 📋 CSS 가짓수 계산

#### 간격 (Spacing)
```css
margin: 0~100px (무한)
padding: 0~100px (무한)
gap: 0~100px (무한)
```

**3가지 × 무한 = 무한**

---

#### 크기 (Sizing)
```css
width: 0~∞
height: 0~∞
min-width, max-width, min-height, max-height
```

**6가지 × 무한 = 무한**

---

#### 배치 (Layout)
```css
display: block | inline | flex | grid | ...
flex-direction: row | column
justify-content: start | center | end | between | around | evenly
align-items: start | center | end | stretch | baseline
```

**수백 가지 조합**

---

#### 색상 (Color)
```css
background: #000000 ~ #FFFFFF (16,777,216가지)
color: 16,777,216가지
border-color: 16,777,216가지
```

**수천만 가지**

---

#### 기타
```css
border-radius: 0~∞
box-shadow: (무한 조합)
font-size: 0~∞
line-height: 0~∞
letter-spacing: -∞~∞
```

---

### 📋 총 가짓수

```
간격 × 크기 × 배치 × 색상 × 기타
= 무한 × 무한 × 수백 × 수천만 × 무한
= 사실상 무한
```

### Marcus
**CSS는 조합 폭발(Combinatorial Explosion)이에요.**

### Sarah
이게 문제예요.

AI에게:
```
"버튼 만들어줘"
```

AI는:
```
어떤 padding? 어떤 색? 어떤 radius? 어떤 shadow?
→ 수백만 가지 선택지
```

**선택지가 너무 많아서 일관성을 유지할 수 없어요.**

---

## 🎬 Act 3: 구체적 사례 - AI의 혼란

### Emma (디자이너)
실제 예를 볼까요?

---

### 📋 사례 1: 버튼 패딩

```tsx
// AI가 만든 첫 버튼
<button style={{ padding: "8px 16px" }}>저장</button>

// 두 번째 버튼 (조금 수정 요청 후)
<button style={{ padding: "10px 20px" }}>취소</button>

// 세 번째 버튼
<button style={{ padding: "12px 24px" }}>확인</button>
```

**왜 다르죠?**
→ AI는 "8이 좋은지 10이 좋은지 12가 좋은지" 모릅니다.
→ 선택지가 너무 많아서 일관성 없음.

---

### 📋 사례 2: 카드 간격

```tsx
// 첫 번째 카드
<div style={{ gap: "12px" }}>

// 두 번째 카드
<div style={{ gap: "16px" }}>

// 세 번째 카드
<div style={{ gap: "20px" }}>
```

**왜 매번 다르죠?**
→ 12? 16? 20? 선택 기준 없음.

---

### 📋 사례 3: 컨테이너 배치

```tsx
// 첫 시도
<div style={{
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "8px"
}}>

// 수정 후
<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px"
}}>
```

**뭐가 맞죠?**
→ AI도 모릅니다. 선택지가 너무 많아요.

---

## 🎬 Act 4: 기존 접근들의 한계

### Alex (문서 작성자)
기존 디자인 시스템은 어떻게 해결했나요?

---

### 📋 접근 1: 컴포넌트 라이브러리 (Material-UI, Ant Design)

**방식**: 완성된 블록 제공

```tsx
<Button variant="contained">클릭</Button>
<Card>
  <CardHeader title="제목" />
  <CardContent>내용</CardContent>
</Card>
```

**한계**:
```tsx
// 여전히 선택 필요
<Button variant="contained">클릭</Button>  // variant?
<Card sx={{ padding: 2 }}>  // padding 얼마?
  <Box sx={{ gap: 1 }}>  // gap 얼마?
```

**블록은 줬지만, 블록 안 CSS는 여전히 선택해야 함.**

---

### 📋 접근 2: 디자인 토큰 (Design Tokens)

**방식**: 사용 가능한 값 제한

```css
/* 토큰 정의 */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
```

```tsx
// 사용
<div style={{ padding: "var(--space-2)" }}>
```

**한계**:
```tsx
// 여전히 선택 필요
<div style={{ padding: "var(--space-2)" }}>  // 2? 3? 4?
<div style={{ gap: "var(--space-3)" }}>      // 왜 3?
```

**값은 제한했지만, 언제 어떤 토큰을 쓸지는 여전히 결정 필요.**

---

### 📋 접근 3: Tailwind CSS

**방식**: 유틸리티 클래스

```tsx
<button className="px-4 py-2 bg-blue-500 rounded">
  클릭
</button>
```

**한계**:
```tsx
// 가짓수는 그대로
<button className="px-2">  // px-2? px-4? px-6?
<button className="px-4">
<button className="px-6">

<div className="gap-2">  // gap-2? gap-4?
<div className="gap-4">
```

**빠르게 만들 수는 있지만, 일관성은 보장 안 됨.**

---

### Marcus (개발자)
공통점이 보여요.

모두 **"선택지를 줄이려고"** 했어요:
- 컴포넌트: 블록으로 묶어서 줄임
- 토큰: 값 개수를 줄임
- Tailwind: 클래스로 줄임

하지만 여전히 **"언제 무엇을 쓸지"**는 사용자가 결정해야 해요.

### Sarah
정확해요. 문제는:

```
값을 줄이는 것 ≠ 선택을 줄이는 것
```

---

## 🎬 Act 5: 수렴 진화의 발견

### Yuki (UX 연구원)
*(다른 각도에서)*

그런데... 어드민 대시보드들을 보면

**비슷비슷**하지 않나요?

### Emma (디자이너)
맞아요!

*(여러 어드민 캡처 화면 보여주며)*

- 왼쪽 사이드바
- 상단 헤더
- 카드 그리드
- 테이블 리스트

**패턴이 수렴**하고 있어요!

---

### 📋 수렴 진화 (Convergent Evolution)

#### 관찰 1: 목적이 같으면 형태가 수렴함

**어드민 대시보드**:
- 목적: 데이터 관리
- 결과: 사이드바 + 헤더 + 테이블/카드 구조

**이커머스**:
- 목적: 상품 판매
- 결과: 히어로 + 그리드 + 필터 구조

**문서 사이트**:
- 목적: 정보 읽기
- 결과: 사이드바 TOC + 중앙 콘텐츠 구조

---

#### 관찰 2: 장식이 사라지고 있음

**2010년대**:
- 그라데이션
- 드롭 섀도우
- 스큐어모피즘
- 화려한 애니메이션

**2020년대**:
- Flat Design
- 미니멀
- 기능 중심
- 필요한 애니메이션만

**장식 ≠ 디자인, 디자인 = 기능**

---

#### 관찰 3: 이유 없는 요소는 제거됨

```tsx
// ❌ 이유 없음
<button style={{
  padding: "13px 19px",  // 왜 13px? 왜 19px?
  borderRadius: "7px",   // 왜 7px?
  boxShadow: "2px 3px 5px rgba(0,0,0,0.15)"  // 왜 이 값?
}}>

// ✅ 이유 있음
<button style={{
  padding: "var(--space-action)",  // 액션 요소 표준 간격
  borderRadius: "var(--radius-md)", // 중간 둥글기
  boxShadow: "var(--shadow-sm)"     // 약간 떠있는 느낌
}}>
```

**"왜?"라는 질문에 답할 수 없으면 제거되고 있음.**

---

### Sarah (아키텍트)
이게 핵심이에요!

**목적성 있는 UI는 디자인이 수렴한다.**

그리고 수렴된 디자인의 특징:
1. **이유 있는 선택**만 남음
2. **선택지가 줄어듦**
3. **일관성이 자연스럽게 생김**

---

## 🎬 Act 6: 디자인 = 이유의 집합

### Dev (기여자)
그럼... 디자인을 다르게 정의할 수 있겠네요.

---

### 📋 디자인의 재정의

#### 기존 정의
```
디자인 = 시각적 선택의 집합
```

예:
- 이 버튼은 파란색
- 패딩은 16px
- 모서리는 8px 둥글게

---

#### 새로운 정의
```
디자인 = 이유의 집합
```

예:
- 이 버튼은 **Primary Action**이라서 강조색
- 패딩은 **편하게 클릭 가능한 크기**라서 충분히 큼
- 모서리는 **부드러운 느낌**을 위해 둥글게

---

### 📋 이유 → 선택

**이유가 있으면 선택이 결정됨**:

| 이유 | 선택 |
|------|------|
| Primary Action | `color: var(--primary)` |
| 편하게 클릭 가능 | `padding: var(--space-action)` |
| 부드러운 느낌 | `border-radius: var(--radius-md)` |

**이유 없으면 선택 불가**:
```
이유: 없음
→ 선택: ??? (혼란)
```

---

### Sarah
이제 보이죠?

**선택지가 많은 게 문제가 아니라**
**이유 없이 선택하는 게 문제**예요.

이유가 있으면 선택지는 자연스럽게 줄어들어요.

---

## 🎬 Act 7: CSS 요소별 "왜?" 질문

### Emma (디자이너)
CSS 요소들에 "왜?"를 물어봅시다.

---

### 📋 간격 (Spacing)

#### 질문: "왜 이 간격인가?"

**이유 1: Section 구분**
```tsx
<Frame gap="section">  // 섹션 간 큰 간격
  <Section />
  <Section />
</Frame>
```
→ `gap: var(--space-section)` (24px)

**이유 2: Content 리듬**
```tsx
<Frame gap="content">  // 콘텐츠 간 중간 간격
  <Text.Title />
  <Text.Body />
</Frame>
```
→ `gap: var(--space-content)` (12px)

**이유 3: List 밀집**
```tsx
<Frame gap="list">  // 리스트 항목 간 작은 간격
  <ListItem />
  <ListItem />
</Frame>
```
→ `gap: var(--space-list)` (8px)

---

### 📋 면 (Surface)

#### 질문: "왜 이 높이인가?"

**이유 1: 기준면**
```tsx
<Frame surface="base">
```
→ 페이지 배경, 시작점

**이유 2: 떠있는 면**
```tsx
<Frame surface="raised">
```
→ 카드, 패널, 중요한 콘텐츠

**이유 3: 들어간 면**
```tsx
<Frame surface="sunken">
```
→ Input 내부, Well, 입력 영역

**이유 4: 최상위**
```tsx
<Frame surface="overlay">
```
→ Modal, Drawer, 페이지 위

---

### 📋 선 (Border)

#### 질문: "왜 경계가 필요한가?"

**이유 1: 물리적 경계**
```tsx
<Frame border surface="raised">
```
→ 카드 경계 명확화

**이유 2: 논리적 구분**
```tsx
<Frame border="top">
```
→ Header와 Body 구분

**이유 3: 시각적 구분만**
```tsx
<Divider />
```
→ 내부 영역 구분 (Frame 없이)

---

### 📋 그림자 (Shadow)

#### 질문: "왜 떠있는가?"

**이유 1: 약간 떠있음**
```tsx
<Frame surface="raised" shadow="sm">
```
→ 카드, 버튼

**이유 2: 명확히 떠있음**
```tsx
<Frame surface="overlay" shadow="md">
```
→ Dropdown, Popover

**이유 3: 강하게 떠있음**
```tsx
<Frame surface="overlay" shadow="lg">
```
→ Modal, Dialog

---

### 📋 색상 (Color)

#### 질문: "왜 이 색인가?"

**이유 1: 강조**
```tsx
<Frame surface="primary">
```
→ Primary Action, CTA

**이유 2: 선택됨**
```tsx
<Frame surface="selected">
```
→ Active Tab, Selected Item

**이유 3: 중요 (경고)**
```tsx
<Frame surface="error">
```
→ 에러 메시지, 위험한 액션

---

## 🎬 Act 8: 의사결정 트리 = 선택지 줄이기

### Marcus (개발자)
이제 보이네요!

**"왜?"에 답하면 선택이 결정**되는 거죠.

### Sarah (아키텍트)
맞아요! 이걸 **의사결정 트리(Decision Tree)**라고 해요.

---

### 📋 의사결정 트리 구조

```
질문
├─ 답 1 → 선택 A
├─ 답 2 → 선택 B
└─ 답 3 → 선택 C
```

#### 예시: 간격 의사결정 트리

```
"왜 간격이 필요한가?"
├─ "섹션을 구분하려고" → gap: var(--space-section) (24px)
├─ "콘텐츠 리듬을 위해" → gap: var(--space-content) (12px)
├─ "리스트 항목 구분" → gap: var(--space-list) (8px)
└─ "폼 필드 간격" → gap: var(--space-form) (20px)
```

**선택지: 무한 → 4개**

---

#### 예시: Surface 의사결정 트리

```
"이 요소는 얼마나 떠있는가?"
├─ "기준면" → surface: base
├─ "약간 위" → surface: raised
├─ "들어감" → surface: sunken
├─ "최상위" → surface: overlay
└─ "강조" → surface: primary
```

**선택지: 16,777,216가지 색상 → 5개**

---

### 📋 의사결정 트리의 효과

#### Before (무한 선택)
```tsx
<div style={{
  padding: "??px",  // 0~100 중 선택
  gap: "??px",      // 0~100 중 선택
  backgroundColor: "??",  // 1600만 색 중 선택
}}>
```

#### After (의사결정)
```tsx
<Frame
  layout="section"  // 왜? 섹션 구분 → gap/padding 결정됨
  surface="raised"  // 왜? 떠있는 카드 → 색상 결정됨
>
```

**선택지: 무한 × 무한 × 1600만 → 10 × 5 = 50가지**

---

## 🎬 Act 9: MDK = CSS 의사결정 레이어

### Sarah (아키텍트)
이제 MDK가 뭔지 명확해졌어요.

---

### 📋 MDK의 정의 (재정립)

```
MDK = CSS 의사결정 시스템
```

**역할**:
1. CSS 속성마다 "왜?" 질문 제시
2. 답변에 따라 선택지 자동 결정
3. 이유 없는 선택 원천 차단

---

### 📋 MDK의 레이어

#### Layer 1: Experience (전역 물리 법칙)
**질문**: "어떤 목적의 UI인가?"

```tsx
<Experience value="application">  // 어드민, 툴
<Experience value="landing">      // 마케팅, 홍보
<Experience value="document">     // 문서, 읽기
```

→ 전역 font-size, density, spacing 결정

---

#### Layer 2: Overlay (위치)
**질문**: "페이지 위에 떠있는가?"

```tsx
<Overlay type="modal">     // 중앙, backdrop
<Overlay type="drawer">    // 사이드
<Overlay type="dropdown">  // trigger 기준
```

→ position, z-index 결정

---

#### Layer 3: Frame (구조)
**질문**: "경계가 있는 컨테이너인가?"

```tsx
<Frame
  surface="raised"  // 얼마나 떠있는가? → 색상/그림자 결정
  layout="section"  // 어떻게 배치하는가? → gap/padding 결정
  rounded="md"      // 모서리 처리? → border-radius 결정
>
```

→ 대부분의 CSS 결정

---

#### Layer 4: Layout (배치)
**질문**: "내부를 어떻게 배치하는가?"

```tsx
<Frame layout={Layout.Stack.Section.Default}>   // 수직, 섹션 리듬
<Frame layout={Layout.Row.Header.Default}>      // 수평, 헤더 바
<Frame layout={Layout.Grid.Cards.Default}>      // 그리드, 카드
```

→ display, flex-direction, gap, align, justify 결정

---

#### Layer 5: Context (역할)
**질문**: "무슨 역할의 콘텐츠인가?"

```tsx
<Card.Title>   // 카드 제목 → 크기, 색상 결정
<Prose.Body>   // 읽기 본문 → 크기, 줄간격 결정
<Field.Label>  // 필드 레이블 → 크기, 색상 결정
```

→ font-size, line-height, color 결정

---

### 📋 의사결정 흐름

```
사용자: "버튼 만들어줘"

1. Experience: application → 밀도, 크기 기준 설정
2. Frame: surface="raised" → 배경, 그림자 결정
3. Layout: padding="action" → 클릭 가능한 크기
4. Context: Action → 버튼 색상, hover 스타일

결과:
<Frame surface="primary" p="action" rounded="md">
  <Action.Label>클릭</Action.Label>
</Frame>

CSS:
- background: var(--primary-bg)
- color: var(--primary-fg)
- padding: var(--space-action)
- border-radius: var(--radius-md)
- box-shadow: var(--shadow-sm)
```

**선택한 것: 3가지 (surface, p, rounded)**
**결정된 것: 5가지 CSS 속성 (background, color, padding, radius, shadow)**

---

## 🎬 Act 10: 블록 단위 → 의사결정 단위

### Emma (디자이너)
기존 디자인 시스템과 뭐가 다른가요?

---

### 📋 기존: 블록 단위

**제공**:
```tsx
<Button variant="contained" size="medium">
<Card elevation={2}>
<TextField variant="outlined">
```

**사용자가 여전히 결정**:
```tsx
<Box sx={{ padding: 2, gap: 3 }}>  // 2? 3?
  <Button>...</Button>
</Box>
```

→ **블록은 줬지만, 블록 조합은 사용자 책임**

---

### 📋 MDK: 의사결정 단위

**제공**:
```tsx
// 질문: "왜 이 레이아웃?"
<Frame layout={Layout.Stack.Section}>  // 섹션 구분

// 질문: "왜 이 면?"
<Frame surface="raised">  // 떠있는 카드

// 질문: "왜 이 역할?"
<Card.Title>  // 카드 제목
```

**자동 결정**:
```tsx
// Layout.Stack.Section → gap: 16, padding: 24
// surface="raised" → background, shadow
// Card.Title → font-size, weight, color
```

→ **"왜?"에 답하면 CSS는 자동 결정**

---

### 📋 비교

| 측면 | 기존 (블록) | MDK (의사결정) |
|------|-----------|-------------|
| **단위** | Button, Card, TextField | Layout, Surface, Context |
| **추상화** | 완성된 UI | CSS 속성 그룹 |
| **선택** | 블록 선택 | 이유 선택 |
| **조합** | 사용자가 조립 | 시스템이 조립 |
| **일관성** | 사용자 책임 | 시스템 보장 |

---

## 🎬 Act 11: AI가 추론 가능한 이유

### Marcus (개발자)
이제 AI가 왜 디자인을 잘 할 수 있는지 알겠어요!

---

### 📋 Before MDK: 선택지 폭발

```
AI: "버튼을 만들어야 해"

선택해야 할 것:
- padding: 0~100px → 무한 선택
- background: 1600만 색 → 무한 선택
- border-radius: 0~100px → 무한 선택
- box-shadow: (무한 조합) → 무한 선택
- font-size: 0~100px → 무한 선택

총: 무한 × 무한 × 무한 × 무한 × 무한
→ 일관성 불가능
```

---

### 📋 After MDK: 의사결정 트리

```
AI: "버튼을 만들어야 해"

질문 1: "어떤 목적의 UI?"
→ 답: application
→ 결정: 밀도, 크기 기준

질문 2: "얼마나 중요한 액션?"
→ 답: Primary Action
→ 결정: surface="primary"

질문 3: "어떤 레이아웃?"
→ 답: 클릭 가능한 액션
→ 결정: p="action"

총: 3개 질문, 각 3-5개 선택지
→ 추론 가능
```

---

### 📋 추론 가능의 의미

#### Before (암기)
```
AI가 외워야 하는 것:
- 버튼 padding은 16px
- 카드 gap은 12px
- 헤더 height는 64px
- ...수백 가지 규칙
```

→ 외우기 불가능, 일관성 불가능

---

#### After (추론)
```
AI가 이해하는 것:
- "Primary Action이면 강조색"
- "섹션 구분이면 큰 간격"
- "떠있는 카드면 그림자"
→ 3가지 원리

이 원리로 모든 상황 추론 가능
```

→ 외울 필요 없음, 일관성 자동

---

### Sarah
이게 핵심이에요!

```
암기 기반 → 추론 기반
규칙 기반 → 이유 기반
```

AI는 **이유를 이해**할 수 있어요.
그럼 **규칙은 자동으로 따라와요**.

---

## 🎬 Act 12: MDK의 진짜 목적

### Sarah (아키텍트)
*(최종 정리)*

MDK가 뭔지 이제 명확하죠?

---

### 📋 MDK ≠ 컴포넌트 라이브러리

```
MDK는:
- Button을 제공하지 않습니다
- Card를 제공하지 않습니다
- TextField를 제공하지 않습니다
```

---

### 📋 MDK = CSS 의사결정 시스템

```
MDK는:
- "왜 이 간격?"에 답할 수 있는 선택지
- "왜 이 색?"에 답할 수 있는 선택지
- "왜 이 배치?"에 답할 수 있는 선택지
→ 이유 기반 CSS 선택
```

---

### 📋 MDK의 목적

#### 문제
```
CSS 조합 = 무한
→ AI가 일관성 유지 불가
→ 커스터마이징 시 디자인 붕괴
```

#### 해결
```
이유 기반 선택지 제공
→ 질문에 답하면 CSS 자동 결정
→ 이유 있는 선택만 가능
→ 일관성 자동 유지
```

#### 결과
```
AI가:
- 추론으로 디자인
- 규칙 외울 필요 없음
- 커스터마이징해도 일관성 유지
```

---

### 📋 최종 정의

# **MDK = CSS 의사결정 레이어**

**"이유 없는 CSS는 선택할 수 없다"**

---

## 🎬 Act 13: 구체적 예시

### Emma (디자이너)
실제로 어떻게 쓰나요?

---

### 📋 예시 1: 대시보드 페이지

```tsx
// ❌ 기존 방식 (선택지 폭발)
<div style={{
  display: "flex",
  flexDirection: "column",
  gap: "??px",  // 얼마?
  padding: "??px", // 얼마?
  backgroundColor: "??", // 무슨 색?
}}>
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    padding: "??px", // 얼마?
    height: "??px", // 얼마?
  }}>
    <h1 style={{ fontSize: "??px" }}>대시보드</h1>
    <button style={{ padding: "??px ??px" }}>설정</button>
  </div>

  <div style={{
    display: "grid",
    gridTemplateColumns: "??",  // 뭐?
    gap: "??px",  // 얼마?
  }}>
    <div style={{
      padding: "??px",  // 얼마?
      backgroundColor: "??",  // 무슨 색?
      borderRadius: "??px",  // 얼마?
      boxShadow: "?? ?? ?? ??",  // 뭐?
    }}>
      카드 1
    </div>
  </div>
</div>
```

**선택해야 할 것: 13개 이상**

---

```tsx
// ✅ MDK 방식 (의사결정)
<Experience value="application">
  <Frame fill surface="base">

    {/* 왜? 헤더 바 */}
    <Frame layout={Layout.Row.Header.Default}>
      <Text.Prose.Title variant="sm">대시보드</Text.Prose.Title>
      <Action icon={Settings} />
    </Frame>

    {/* 왜? 섹션 구분 */}
    <Frame layout={Layout.Stack.Section.Default}>

      {/* 왜? 카드 그리드 */}
      <Frame layout={Layout.Grid.Cards.Default}>

        {/* 왜? 떠있는 카드 */}
        <Frame surface="raised" p={4} rounded="md">
          <Text.Card.Title>카드 1</Text.Card.Title>
        </Frame>

      </Frame>
    </Frame>

  </Frame>
</Experience>
```

**선택한 것: 7개 (value, layout, surface, p, rounded, variant, icon)**
**자동 결정된 것: 13개 이상 CSS 속성**

---

### 📋 예시 2: 폼 페이지

```tsx
// ❌ 기존 방식
<div style={{
  display: "flex",
  flexDirection: "column",
  gap: "??px",  // 필드 간격 얼마?
  maxWidth: "??px",  // 폼 너비 얼마?
  margin: "?? auto",
  padding: "??px",
}}>
  <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "??px",  // 레이블-인풋 간격 얼마?
  }}>
    <label style={{
      fontSize: "??px",  // 얼마?
      fontWeight: "??",  // 얼마?
      color: "??",  // 무슨 색?
    }}>이메일</label>
    <input style={{
      padding: "??px ??px",  // 얼마?
      backgroundColor: "??",  // 무슨 색?
      border: "??px solid ??",  // 얼마? 무슨 색?
      borderRadius: "??px",  // 얼마?
    }} />
  </div>

  <div style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "??px",  // 버튼 간격 얼마?
    marginTop: "??px",  // 얼마?
  }}>
    <button>취소</button>
    <button style={{
      backgroundColor: "??",  // 무슨 색?
      color: "??",  // 무슨 색?
      padding: "??px ??px",  // 얼마?
    }}>저장</button>
  </div>
</div>
```

**선택해야 할 것: 20개 이상**

---

```tsx
// ✅ MDK 방식
<Experience value="application">

  {/* 왜? 폼 영역 */}
  <Frame layout={Layout.Stack.Form.Center} maxWidth={120}>

    {/* 왜? 필드 입력 */}
    <Field name="email">
      <Field.Label>이메일</Field.Label>
      <Field.Control><input /></Field.Control>
    </Field>

    {/* 왜? 액션 그룹 */}
    <Frame layout={Layout.Row.Actions.Default}>
      <Action variant="ghost">취소</Action>
      <Action variant="primary">저장</Action>
    </Frame>

  </Frame>

</Experience>
```

**선택한 것: 6개 (value, layout, maxWidth, name, variant)**
**자동 결정된 것: 20개 이상 CSS 속성**

---

## 🎬 Act 14: 선택지 감소 효과

### Marcus (개발자)
숫자로 볼까요?

---

### 📋 선택지 감소 통계

#### 간격 (Spacing)
```
Before: 0~100px (무한)
After: 6가지 (list, content, form, section, action, page)
감소율: 99.99%
```

#### 색상 (Color)
```
Before: 16,777,216가지 (RGB)
After: 10가지 (base, raised, sunken, overlay, primary, selected, error, warning, success, info)
감소율: 99.9999%
```

#### 배치 (Layout)
```
Before: 수백 가지 flex/grid 조합
After: 30가지 프리셋 (Stack 5종, Row 5종, Grid 3종, Wrap 3종, Slots 2종, Center 2종)
감소율: 99%
```

#### 총 감소
```
Before: 무한 × 1600만 × 수백 = 사실상 무한
After: 6 × 10 × 30 = 1,800가지
감소율: 99.9999...%
```

---

### 📋 1,800가지도 많지 않나?

**아니요!**

실제로는:
```
자주 쓰는 조합: 약 50가지
- Stack.Section + surface="raised" + Card.*
- Row.Header + surface="base" + Text.Prose.*
- Grid.Cards + surface="raised" + Card.*
- ...
```

**50가지 패턴**으로 대부분의 UI 커버 가능.

---

## 🎬 Act 15: MDK의 미래

### Yuki (UX 연구원)
MDK가 완성되면 뭐가 달라지나요?

---

### 📋 MDK 적용 전

**AI에게**:
```
"관리자 대시보드 만들어줘"
```

**AI의 고민**:
```
- 사이드바 너비: 200px? 240px? 280px?
- 헤더 높이: 56px? 64px? 72px?
- 카드 간격: 12px? 16px? 20px?
- 카드 패딩: 16px? 20px? 24px?
- 카드 모서리: 4px? 8px? 12px?
- ...
→ 일관성 없는 결과
```

---

### 📋 MDK 적용 후

**AI에게**:
```
"관리자 대시보드 만들어줘"
```

**AI의 추론**:
```
1. Experience: application (어드민이니까)
2. Layout: Row.Header (헤더 바니까)
3. Layout: Grid.Cards (카드 그리드니까)
4. Surface: raised (카드니까)
5. Context: Card.* (요약 정보니까)

→ 모든 CSS 자동 결정
→ 일관성 보장
```

---

### 📋 가능해지는 것

**1. AI가 계속 디자인 가능**
- 추론 기반이라 일관성 유지
- 커스터마이징해도 안 무너짐

**2. 협업 일관성**
- 팀원들이 같은 의사결정 트리 사용
- 자동으로 일관된 디자인

**3. 유지보수 용이**
- "왜?"를 알면 수정 이유 명확
- 영향 범위 예측 가능

**4. 확장 가능**
- 새 패턴 추가 시 의사결정 트리에 추가
- 기존 패턴과 자동 조화

---

## 🎬 Epilogue: MDK의 본질

### Sarah (아키텍트)
*(마무리)*

우리가 만든 건...

---

### 📋 MDK의 본질

```
MDK ≠ UI 컴포넌트 라이브러리
MDK ≠ 디자인 토큰 시스템
MDK ≠ CSS 프레임워크
```

```
MDK = CSS 의사결정 레이어
```

**역할**:
```
무한한 CSS 조합
    ↓
이유 기반 질문
    ↓
선택지 자동 결정
    ↓
일관성 보장
```

---

### 📋 MDK가 해결하는 문제

**문제**: CSS 가짓수 폭발
**원인**: 이유 없는 선택
**해법**: 이유 기반 의사결정 트리
**결과**: 추론 가능한 디자인

---

### 📋 MDK의 슬로건

# **"이유 없는 CSS는 선택할 수 없다"**

**"No CSS Without Reason"**

---

**회의 종료**: 2026년 1월 15일 오후 2시
**결과**: MDK의 근본 목적 재정립
**핵심**: 디자인 = CSS 선택, MDK = 의사결정 시스템

---

## 📊 부록: CSS 의사결정 트리 전체 맵

### 간격 (Spacing) 의사결정 트리

```
"왜 간격이 필요한가?"
├─ "섹션 큰 구분" → gap: var(--space-section) (24px)
├─ "콘텐츠 리듬" → gap: var(--space-content) (12px)
├─ "리스트 밀집" → gap: var(--space-list) (8px)
├─ "폼 필드 구분" → gap: var(--space-form) (20px)
├─ "액션 그룹" → gap: var(--space-action) (8px)
└─ "페이지 여백" → gap: var(--space-page) (32px)
```

### 면 (Surface) 의사결정 트리

```
"얼마나 떠있는가?"
├─ "기준면" → surface: base (배경)
├─ "약간 위" → surface: raised (카드, 패널)
├─ "들어감" → surface: sunken (input, well)
├─ "최상위" → surface: overlay (modal, drawer)
├─ "강조" → surface: primary (CTA, 중요)
└─ "선택됨" → surface: selected (active, current)
```

### 배치 (Layout) 의사결정 트리

```
"어떻게 배치하는가?"
├─ "수직 흐름"
│   ├─ "섹션 구분" → Layout.Stack.Section
│   ├─ "콘텐츠 리듬" → Layout.Stack.Content
│   ├─ "리스트" → Layout.Stack.List
│   └─ "폼" → Layout.Stack.Form
├─ "수평 흐름"
│   ├─ "헤더 바" → Layout.Row.Header
│   ├─ "툴바" → Layout.Row.Toolbar
│   ├─ "항목" → Layout.Row.Item
│   └─ "액션" → Layout.Row.Actions
├─ "줄바꿈"
│   ├─ "태그/칩" → Layout.Wrap.Chips
│   └─ "필터" → Layout.Wrap.Filters
├─ "2D 그리드"
│   ├─ "카드" → Layout.Grid.Cards
│   ├─ "갤러리" → Layout.Grid.Gallery
│   └─ "대시보드" → Layout.Grid.Dashboard
└─ "중앙 정렬"
    └─ "빈 상태" → Layout.Center
```

### 역할 (Context) 의사결정 트리

```
"무슨 역할인가?"
├─ "읽기" → Prose.* (Title, Body, Note)
├─ "요약" → Card.* (Title, Desc, Note)
├─ "입력" → Field.* (Label, Value, Note)
├─ "비교" → Table.* (Head, Cell)
└─ "조작" → Menu.* (Label, Item)
```

---

**MDK = 이유 기반 CSS 의사결정 시스템**
