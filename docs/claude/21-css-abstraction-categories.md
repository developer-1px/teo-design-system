# Act 1: 이미 발견한 범주들 - 시작점

**Claude**: 좋습니다! 지금까지 우리가 발견한 CSS 속성 묶음들을 먼저 정리해볼게요.

**이미 발견한 4개 범주**:

1. **Surface** (배경면)
   - `background-color`, `border`, `border-radius`, `box-shadow`
   - **WHY?**: "이 요소가 다른 요소와 어떻게 구분되는가?"
   - **의미**: 시각적 경계와 깊이 표현

2. **Layout** (배치)
   - `display: flex`, `gap`, `padding`, `overflow`
   - **WHY?**: "내부 요소들을 어떻게 배치할 것인가?"
   - **의미**: 내부 콘텐츠의 흐름과 간격

3. **Overlay** (겹침)
   - `position`, `z-index`, `backdrop-filter`
   - **WHY?**: "다른 요소 위에 떠 있어야 하는가?"
   - **의미**: 레이어 순서와 공간적 관계

4. **State** (상태)
   - `:hover`, `:active`, `.selected`, `.disabled`
   - **WHY?**: "사용자 상호작용에 어떻게 반응하는가?"
   - **의미**: 인터랙션 피드백

**User**: 맞아. 이제 나머지 CSS 속성들도 이런 식으로 "WHY"를 찾아서 범주화해보자.

---

# Act 2: Typography - "전달"의 문제

**Claude**: Typography 관련 속성들을 보면:
- `font-size`, `line-height`, `letter-spacing`, `font-weight`, `font-family`, `text-align`, `color`

이것들은 왜 함께 묶일까요? 공통된 WHY는 뭘까요?

**User**: 글자를 "어떻게 보여줄 것인가"가 아니라... "어떻게 읽히게 할 것인가"야. 전달의 문제지.

**Claude**: 맞습니다!

**5. Typography** (전달)
- **WHY?**: "이 텍스트가 어떻게 읽혀야 하는가?"
- **의미**: 정보의 위계와 가독성
- **속성들**:
  - `font-size`, `line-height` → 읽기 편안함 (Readability)
  - `font-weight`, `color` → 중요도 표현 (Hierarchy)
  - `letter-spacing`, `text-align` → 리듬과 흐름 (Rhythm)
  - `font-family` → 톤앤매너 (Voice)

**결정 트리 예시**:
```
"이 텍스트가 어떻게 읽혀야 하는가?"
├─ "주목해야 함" → font-weight: 600, color: primary
├─ "편안하게 읽어야 함" → line-height: 1.6, font-size: 16px
├─ "빠르게 스캔해야 함" → font-weight: 500, letter-spacing: 0.05em
└─ "분위기를 전달해야 함" → font-family: serif/sans-serif
```

---

# Act 3: Spacing vs Padding - "관계"의 발견

**User**: 근데 잠깐, `padding`은 Layout에 넣었는데, `margin`은 어디 가야 해? 둘이 같은 간격인데 왜 분리되지?

**Claude**: 좋은 질문입니다! 이게 바로 핵심이에요.

- **Padding**: "내 안의 콘텐츠와 나(경계) 사이의 관계" → Layout (내부 배치)
- **Margin**: "나와 형제 요소들 사이의 관계" → ???

`margin`은 Layout이 아니라 다른 범주가 필요해 보입니다.

**6. Spacing** (관계)
- **WHY?**: "이 요소가 다른 요소들과 어떤 관계인가?"
- **의미**: 요소 간의 의미적 거리
- **속성들**:
  - `margin` → 형제 요소와의 거리
  - `gap` (Layout과 중복?) → 자식 요소들 간의 균일한 거리
  - `margin-block-start`, `margin-inline` → 문맥적 간격

**User**: 잠깐, 그럼 `gap`은 Layout이야 Spacing이야?

**Claude**: 아! 이게 중요한 발견입니다.

**`gap`은 Layout**:
- "자식들을 어떻게 배치할 것인가?"의 문제
- 부모가 자식들을 제어

**`margin`은 Spacing**:
- "나는 다른 요소들과 어떤 관계인가?"의 문제
- 자기 자신이 자신의 위치를 제어

같은 "간격"이지만 **의도(Intent)가 다릅니다**!

---

# Act 4: Sizing - "존재감"의 문제

**Claude**: 이제 크기 관련 속성들을 보죠:
- `width`, `height`, `min-width`, `max-width`, `min-height`, `max-height`
- `flex-grow`, `flex-shrink`, `flex-basis`

**User**: 이건 "얼마나 공간을 차지할 것인가"의 문제야. 존재감이지.

**Claude**: 정확합니다!

**7. Sizing** (존재감)
- **WHY?**: "이 요소가 얼마나 공간을 차지해야 하는가?"
- **의미**: 콘텐츠의 중요도와 공간 배분
- **속성들**:
  - `width`, `height` → 절대적 크기 (고정)
  - `min/max-width`, `min/max-height` → 반응형 제약 (유연)
  - `flex-grow`, `flex-shrink` → 상대적 크기 (협상)
  - `aspect-ratio` → 비율 유지 (형태)

**결정 트리 예시**:
```
"이 요소가 얼마나 공간을 차지해야 하는가?"
├─ "콘텐츠만큼만" → width: auto
├─ "가능한 최대한" → flex: 1
├─ "정확히 이만큼" → width: 240px
├─ "최소 이정도는" → min-width: 200px
└─ "비율을 유지하며" → aspect-ratio: 16/9
```

---

# Act 5: Transform/Motion - "변화"의 문제

**Claude**: 이제 움직임 관련 속성들:
- `transform`, `transition`, `animation`
- `translate`, `rotate`, `scale`

이것들의 공통된 WHY는 무엇일까요?

**User**: "상태 변화를 어떻게 보여줄 것인가"야. 순간이동이 아니라 여행을 보여주는 거지.

**Claude**: 완벽합니다!

**8. Motion** (변화)
- **WHY?**: "변화가 어떻게 인지되어야 하는가?"
- **의미**: 상태 전환의 연속성과 자연스러움
- **속성들**:
  - `transition` → 자동 전환 (A에서 B로)
  - `animation` → 연출된 움직임 (시퀀스)
  - `transform` → 공간 변형 (위치, 크기, 회전)
  - `transition-timing-function` → 움직임의 성격 (ease, spring...)

**결정 트리 예시**:
```
"변화가 어떻게 인지되어야 하는가?"
├─ "부드럽게 전환" → transition: all 0.2s ease
├─ "즉각 반응" → transition: none
├─ "주목받아야 함" → animation: bounce 0.5s
├─ "물리적 사실성" → transition-timing-function: spring
└─ "공간적 이동" → transform: translate(100px, 0)
```

---

# Act 6: Visual Effects - "분위기"의 문제

**Claude**: 이제 시각 효과 속성들:
- `opacity`, `filter`, `mix-blend-mode`, `backdrop-filter`
- `blur()`, `brightness()`, `contrast()`, `saturate()`

**User**: 이건 "어떤 느낌을 줄 것인가"야. 분위기지.

**Claude**: 맞습니다!

**9. Visual Effects** (분위기)
- **WHY?**: "이 요소가 어떤 느낌을 주어야 하는가?"
- **의미**: 감성적 표현과 시각적 강조
- **속성들**:
  - `opacity` → 존재감 조절 (희미함/선명함)
  - `filter: blur()` → 초점 제어 (흐림/선명)
  - `filter: brightness/contrast` → 톤 조절 (밝음/어두움)
  - `mix-blend-mode` → 레이어 합성 (혼합)
  - `backdrop-filter` → 배경과의 관계 (글래스모피즘)

**결정 트리 예시**:
```
"이 요소가 어떤 느낌을 주어야 하는가?"
├─ "비활성화된 느낌" → opacity: 0.5
├─ "초점에서 벗어남" → filter: blur(4px)
├─ "유리처럼 투명" → backdrop-filter: blur(10px)
├─ "강조되어야 함" → filter: brightness(1.2) contrast(1.1)
└─ "다른 레이어와 혼합" → mix-blend-mode: multiply
```

---

# Act 7: Content Flow - "표시"의 문제

**Claude**: 이제 콘텐츠 표시 관련:
- `display`, `visibility`, `clip-path`, `mask`
- `content` (::before, ::after)

이것들은 뭘까요?

**User**: "보여줄 것인가 말 것인가", "어떻게 보여줄 것인가"의 문제야.

**Claude**:

**10. Content Flow** (표시)
- **WHY?**: "이 콘텐츠가 어떻게 표시되어야 하는가?"
- **의미**: 콘텐츠의 렌더링 방식과 가시성 제어
- **속성들**:
  - `display` → 렌더링 방식 (block, flex, grid, none...)
  - `visibility` → 공간을 유지하며 숨김 (hidden)
  - `clip-path` → 부분만 보여줌 (마스킹)
  - `content` → 가상 콘텐츠 생성 (::before/::after)
  - `overflow` → 넘치는 콘텐츠 처리 (hidden/scroll/auto)

**결정 트리 예시**:
```
"이 콘텐츠가 어떻게 표시되어야 하는가?"
├─ "완전히 제거" → display: none
├─ "공간 유지하며 숨김" → visibility: hidden
├─ "일부만 보여줌" → clip-path: circle(50%)
├─ "넘치면 스크롤" → overflow: auto
└─ "장식 요소 추가" → ::before { content: "★" }
```

---

# Act 8: Interaction - "반응"의 문제

**Claude**: 인터랙션 관련 속성들:
- `cursor`, `pointer-events`, `user-select`, `touch-action`
- `scroll-behavior`, `overscroll-behavior`

**User**: 이건 "사용자 입력에 어떻게 반응할 것인가"야.

**Claude**:

**11. Interaction** (반응)
- **WHY?**: "사용자가 이 요소와 어떻게 상호작용하는가?"
- **의미**: 인터랙션 가능성과 제약
- **속성들**:
  - `cursor` → 상호작용 가능성 표시 (pointer, text, grab...)
  - `pointer-events` → 클릭/터치 활성화 여부 (none/auto)
  - `user-select` → 텍스트 선택 가능 여부 (none/text/all)
  - `touch-action` → 터치 제스처 제어 (pan-x, pinch-zoom...)
  - `scroll-behavior` → 스크롤 방식 (smooth/auto)

**결정 트리 예시**:
```
"사용자가 이 요소와 어떻게 상호작용하는가?"
├─ "클릭 가능함을 표시" → cursor: pointer
├─ "클릭 불가" → pointer-events: none
├─ "텍스트 선택 방지" → user-select: none
├─ "부드럽게 스크롤" → scroll-behavior: smooth
└─ "드래그 가능함을 표시" → cursor: grab
```

---

# Act 9: Position - "위치"의 재발견

**User**: 잠깐, `position` 속성은 Overlay에 넣었는데, 그게 맞아?

**Claude**: 좋은 지적입니다! 다시 생각해봅시다.

`position: absolute/fixed` → Overlay (겹침)
`position: relative` → ???
`position: sticky` → ???

**User**: `relative`는 자기 자신의 원래 위치 기준이고, `sticky`는 스크롤 맥락에서의 위치야. 이건 Overlay가 아니라 다른 거 같은데?

**Claude**: 맞습니다! `position`을 값에 따라 분리해야 합니다:

**Overlay (겹침)**:
- `position: absolute/fixed` + `top/left/right/bottom` + `z-index`
- **WHY?**: "다른 요소 위에 떠야 하는가?"

**12. Anchor** (고정)
- `position: sticky` + `top`
- **WHY?**: "스크롤 시 특정 위치에 고정되어야 하는가?"
- **의미**: 스크롤 맥락에서의 위치 제어

**13. Offset** (미세조정)
- `position: relative` + `top/left`
- **WHY?**: "원래 위치에서 약간 조정이 필요한가?"
- **의미**: 레이아웃을 깨지 않는 미세 이동

---

# Act 10: 전체 범주 맵 - 13개 범주 정리

**Claude**: 지금까지 발견한 모든 범주를 정리해볼게요:

| # | 범주 | WHY (의도) | 핵심 속성 | 해결하는 문제 |
|---|------|-----------|----------|-------------|
| 1 | **Surface** | 요소가 어떻게 구분되는가? | bg, border, radius, shadow | 시각적 경계와 깊이 |
| 2 | **Layout** | 내부를 어떻게 배치하는가? | flex, gap, padding, overflow | 내부 콘텐츠 흐름 |
| 3 | **Overlay** | 다른 요소 위에 떠야 하는가? | position (abs/fixed), z-index | 레이어 순서 |
| 4 | **State** | 상호작용에 어떻게 반응하는가? | :hover, :active, .selected | 인터랙션 피드백 |
| 5 | **Typography** | 텍스트가 어떻게 읽혀야 하는가? | font-size, line-height, weight | 정보 위계와 가독성 |
| 6 | **Spacing** | 다른 요소들과 어떤 관계인가? | margin | 요소 간 의미적 거리 |
| 7 | **Sizing** | 얼마나 공간을 차지해야 하는가? | width, height, flex-grow | 콘텐츠 존재감 |
| 8 | **Motion** | 변화가 어떻게 인지되어야 하는가? | transition, animation, transform | 상태 전환의 연속성 |
| 9 | **Visual Effects** | 어떤 느낌을 주어야 하는가? | opacity, filter, blend-mode | 감성적 표현 |
| 10 | **Content Flow** | 콘텐츠가 어떻게 표시되어야 하는가? | display, visibility, clip-path | 렌더링 방식 제어 |
| 11 | **Interaction** | 사용자가 어떻게 상호작용하는가? | cursor, pointer-events, user-select | 인터랙션 제약 |
| 12 | **Anchor** | 스크롤 시 고정되어야 하는가? | position: sticky, top | 스크롤 맥락 위치 |
| 13 | **Offset** | 원래 위치에서 조정이 필요한가? | position: relative, top/left | 미세 위치 조정 |

**User**: 와, 이제 CSS의 모든 속성이 13개 범주로 정리되네!

---

# Act 11: 범주 간의 협력 관계

**Claude**: 이제 이 13개 범주가 어떻게 협력하는지 봅시다.

**독립적 범주** (단독으로 작동):
- Typography
- Visual Effects
- Content Flow

**협력 범주** (함께 사용될 때 의미가 생김):
- **Surface + State**: 버튼의 hover 시 배경 변화
- **Layout + Spacing**: 부모의 gap과 자식의 margin
- **Overlay + Motion**: 모달의 등장 애니메이션
- **Sizing + Layout**: flex-grow와 gap의 조합
- **Interaction + State**: cursor와 :hover의 조합
- **Anchor + Layout**: sticky header의 padding

**충돌 범주** (함께 쓰면 혼란):
- **Overlay + Layout**: absolute는 flex 레이아웃을 깸
- **Offset + Overlay**: relative + absolute 혼용 시 혼란
- **Spacing (margin) + Layout (gap)**: 둘 다 쓰면 간격이 이중으로

---

# Act 12: MDK의 범주별 API 설계

**User**: 이 13개 범주를 MDK에서 어떻게 제공할 거야?

**Claude**: 각 범주를 "이유 기반 의사결정"으로 제공합니다:

**1. Surface API**:
```tsx
// ❌ Before: 무한 조합
<div style={{
  backgroundColor: "#f5f5f5",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
}} />

// ✅ After: 이유 기반
<Frame surface="raised" />  // "떠 있는 카드처럼 보여야 함"
<Frame surface="sunken" />  // "눌린 것처럼 보여야 함"
<Frame surface="overlay" /> // "최상위 레이어처럼 보여야 함"
```

**2. Layout API**:
```tsx
// ❌ Before: 무한 조합
<div style={{
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "16px"
}} />

// ✅ After: 이유 기반
<Frame layout="stack.content" />  // "콘텐츠 리듬이 필요함"
<Frame layout="stack.section" /> // "큰 섹션 구분이 필요함"
<Frame layout="row.actions" />   // "액션 버튼들을 가로 배치"
```

**3. Typography API**:
```tsx
// ❌ Before: 무한 조합
<h1 style={{
  fontSize: "32px",
  lineHeight: "1.2",
  fontWeight: "700",
  letterSpacing: "-0.02em"
}} />

// ✅ After: 이유 기반
<Text.Prose.Title />      // "문서의 제목"
<Text.Prose.Body />       // "읽기 편한 본문"
<Text.Card.Title />       // "카드의 레이블"
```

**4. Motion API**:
```tsx
// ❌ Before: 무한 조합
<div style={{
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: "translateY(-2px)"
}} />

// ✅ After: 이유 기반
<Frame motion="hover.lift" />     // "호버 시 살짝 떠오름"
<Frame motion="press.shrink" />   // "클릭 시 살짝 줄어듦"
<Frame motion="enter.fade" />     // "등장 시 페이드인"
```

---

# Act 13: 범주별 Decision Tree 완성

**Claude**: 각 범주의 완전한 Decision Tree를 만들어봅시다.

**Surface Decision Tree**:
```
"이 요소가 어떻게 구분되어야 하는가?"
├─ "기본 배경" → surface="base"
├─ "눌린 느낌" → surface="sunken"
├─ "떠 있는 카드" → surface="raised"
├─ "최상위 레이어" → surface="overlay"
├─ "강조되어야 함" → surface="primary"
└─ "선택된 상태" → surface="selected"

각 surface는 자동으로 결정:
- background-color (6가지 중 1개)
- border (있음/없음)
- border-radius (일관된 값)
- box-shadow (깊이에 따라)

무한 조합 → 6가지 선택
```

**Layout Decision Tree**:
```
"내부 요소들을 어떻게 배치할 것인가?"
├─ "세로 나열"
│   ├─ "큰 섹션 구분" → layout="stack.section" (gap: 24px, p: 24px)
│   ├─ "콘텐츠 리듬" → layout="stack.content" (gap: 12px, p: 16px)
│   ├─ "밀집 리스트" → layout="stack.list" (gap: 4px, p: 8px)
│   └─ "폼 필드" → layout="stack.field" (gap: 20px, p: 12px)
├─ "가로 나열"
│   ├─ "액션 버튼들" → layout="row.actions" (gap: 8px, p: 12px)
│   ├─ "아이템들" → layout="row.items" (gap: 12px, p: 16px)
│   └─ "툴바" → layout="row.toolbar" (gap: 4px, p: 8px)
├─ "중앙 정렬"
│   ├─ "아이콘만" → layout="center.icon"
│   └─ "콘텐츠" → layout="center.content"
└─ "그리드"
    ├─ "카드 그리드" → layout="grid.cards" (gap: 16px)
    └─ "데이터 그리드" → layout="grid.data" (gap: 1px)

무한 조합 → ~15가지 선택
```

**Typography Decision Tree**:
```
"이 텍스트가 어떻게 읽혀야 하는가?"
├─ "문서 타이포그래피"
│   ├─ "최상위 제목" → Text.Prose.H1 (80px, bold, tight)
│   ├─ "섹션 제목" → Text.Prose.H2 (56px, bold)
│   ├─ "하위 제목" → Text.Prose.H3 (40px, semibold)
│   ├─ "작은 제목" → Text.Prose.H4 (24px, semibold)
│   ├─ "본문" → Text.Prose.Body (20px, regular, 1.6 line-height)
│   ├─ "작은 본문" → Text.Prose.BodySm (16px, regular)
│   └─ "캡션" → Text.Prose.Caption (14px, medium, wide)
├─ "UI 타이포그래피"
│   ├─ "카드 제목" → Text.Card.Title (14px, medium)
│   ├─ "카드 설명" → Text.Card.Description (12px, regular)
│   ├─ "메뉴 항목" → Text.Menu.Item (14px, regular)
│   └─ "필드 레이블" → Text.Field.Label (12px, medium)
└─ "데이터 타이포그래피"
    ├─ "테이블 헤더" → Text.Table.Header (12px, bold, uppercase)
    └─ "테이블 셀" → Text.Table.Cell (14px, regular)

무한 조합 → ~15가지 선택
```

---

# Act 14: 범주 간 충돌 해결 규칙

**User**: 그런데 여러 범주를 같이 쓸 때 충돌하면 어떻게 해?

**Claude**: 좋은 질문입니다! 충돌 해결 규칙이 필요합니다.

**규칙 1: Layout vs Overlay 충돌**
```tsx
// ❌ 충돌: absolute는 flex layout을 무시함
<Frame layout="stack.content" position="absolute" />

// ✅ 해결: Overlay는 Layout을 포함하지 않음
<Overlay position="center">
  <Frame layout="stack.content">
    {/* 내용 */}
  </Frame>
</Overlay>
```

**규칙 2: Spacing (margin) vs Layout (gap) 충돌**
```tsx
// ❌ 충돌: gap과 margin이 이중으로 적용
<Frame layout="stack.content">  {/* gap: 12px */}
  <Frame m={3}>Item 1</Frame>   {/* margin: 12px */}
  <Frame m={3}>Item 2</Frame>   {/* 총 24px 간격! */}
</Frame>

// ✅ 해결: 부모가 gap을 제어하면 자식은 margin 사용 금지
<Frame layout="stack.content">
  <Frame>Item 1</Frame>
  <Frame>Item 2</Frame>
</Frame>
```

**규칙 3: State + Motion 협력**
```tsx
// ✅ 올바른 협력
<Frame
  surface="raised"
  motion="hover.lift"     // hover 시 자동으로 적용
  state:hover={{          // 추가 hover 스타일
    surface: "overlay"
  }}
/>
```

**규칙 4: Typography Context 우선순위**
```tsx
// Context가 있으면 Context 스타일 우선
<Card>
  <Text.Card.Title>제목</Text.Card.Title>  {/* Card Context 스타일 */}
</Card>

// Context 밖에서는 Prose 스타일
<Text.Prose.Body>본문</Text.Prose.Body>  {/* Prose 스타일 */}
```

---

# Act 15: 범주별 토큰 매핑

**Claude**: 각 범주가 사용하는 CSS 변수(토큰)를 정리해봅시다.

**Surface 토큰**:
```css
/* Background */
--surface-base
--surface-sunken
--surface-raised
--surface-overlay
--surface-primary
--surface-selected

/* Border */
--border-color
--border-width

/* Radius */
--radius-sm
--radius-md
--radius-lg

/* Shadow */
--shadow-sm
--shadow-md
--shadow-lg
```

**Layout 토큰**:
```css
/* Gap */
--gap-section: 24px
--gap-content: 12px
--gap-list: 4px
--gap-field: 20px
--gap-actions: 8px
--gap-toolbar: 4px

/* Padding */
--padding-section: 24px
--padding-content: 16px
--padding-list: 8px
--padding-field: 12px
```

**Typography 토큰**:
```css
/* Prose */
--prose-h1-size: 80px
--prose-h1-height: 1.1
--prose-h1-spacing: -0.03em
--prose-h1-weight: 700

--prose-body-size: 20px
--prose-body-height: 1.6
--prose-body-spacing: 0em
--prose-body-weight: 400

/* UI */
--text-ui-title-size: 14px
--text-ui-title-weight: 500
--text-ui-body-size: 12px
```

**Motion 토큰**:
```css
/* Duration */
--motion-instant: 0ms
--motion-fast: 150ms
--motion-normal: 250ms
--motion-slow: 400ms

/* Easing */
--motion-ease-in: cubic-bezier(0.4, 0, 1, 1)
--motion-ease-out: cubic-bezier(0, 0, 0.2, 1)
--motion-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)

/* Transform */
--motion-lift: translateY(-2px)
--motion-shrink: scale(0.98)
```

---

# Act 16: 범주 조합 패턴

**Claude**: 실제로 자주 쓰이는 범주 조합 패턴을 정리해봅시다.

**패턴 1: Card (Surface + Layout + State + Motion)**
```tsx
<Frame
  surface="raised"        // Surface: 떠 있는 느낌
  layout="stack.content"  // Layout: 내부 콘텐츠 배치
  motion="hover.lift"     // Motion: 호버 시 반응
  p={4}                   // Layout: 내부 여백
  rounded="lg"            // Surface: 모서리
>
  <Text.Card.Title>제목</Text.Card.Title>
  <Text.Card.Description>설명</Text.Card.Description>
</Frame>
```

**패턴 2: Button (Surface + Typography + State + Motion + Interaction)**
```tsx
<Frame
  as="button"
  surface="primary"           // Surface: 강조 배경
  motion="press.shrink"       // Motion: 클릭 피드백
  cursor="pointer"            // Interaction: 클릭 가능 표시
  state:hover={{
    surface: "primary-hover"  // State: 호버 시 변화
  }}
  p="3 6"                     // Layout: 버튼 내부 여백
  rounded="md"                // Surface: 둥근 모서리
>
  <Text.Action.Label>클릭</Text.Action.Label>
</Frame>
```

**패턴 3: Modal (Overlay + Surface + Layout + Motion)**
```tsx
<Overlay
  position="center"          // Overlay: 화면 중앙
  backdrop="blur"            // Visual Effects: 배경 흐림
  motion="enter.fade"        // Motion: 등장 애니메이션
>
  <Frame
    surface="overlay"        // Surface: 최상위 레이어
    layout="stack.section"   // Layout: 내부 구조
    shadow="lg"              // Surface: 큰 그림자
    rounded="xl"             // Surface: 둥근 모서리
    w={120}                  // Sizing: 고정 너비
  >
    <Text.Prose.H3>제목</Text.Prose.H3>
    <Text.Prose.Body>내용</Text.Prose.Body>
  </Frame>
</Overlay>
```

**패턴 4: List Item (Layout + Typography + State + Interaction)**
```tsx
<Frame
  layout="row.items"         // Layout: 가로 배치
  cursor="pointer"           // Interaction: 클릭 가능
  state:hover={{
    surface: "sunken"        // State: 호버 시 배경
  }}
  state:selected={{
    surface: "selected"      // State: 선택 시 배경
  }}
>
  <Icon />
  <Text.Menu.Item>항목</Text.Menu.Item>
</Frame>
```

---

# Act 17: CSS 무한 조합 vs MDK 범주 시스템

**User**: 이제 정리해보자. 원래 CSS는 몇 가지 조합이었고, MDK는 몇 가지로 줄였어?

**Claude**: 계산해봅시다!

**원래 CSS (조합 폭발)**:
```
Surface 관련:
- background-color: 16,777,216 가지 (RGB)
- border-color: 16,777,216 가지
- border-width: 0-100px (무한)
- border-radius: 0-100px (무한)
- box-shadow: 무한 조합

Layout 관련:
- display: 20+ 가지
- flex-direction: 4가지
- gap: 0-1000px (무한)
- padding: 0-1000px (무한)
- justify-content: 7가지
- align-items: 5가지

Typography 관련:
- font-size: 0-1000px (무한)
- line-height: 0-10 (무한)
- font-weight: 100-900 (9가지)
- letter-spacing: -1em ~ 1em (무한)
- color: 16,777,216 가지

총 조합:
Surface × Layout × Typography × ... = 사실상 무한
```

**MDK 범주 시스템**:
```
Surface: 6가지
- base, sunken, raised, overlay, primary, selected

Layout: ~15가지
- stack.section, stack.content, stack.list, stack.field
- row.actions, row.items, row.toolbar
- center.icon, center.content
- grid.cards, grid.data
- ...

Typography: ~15가지
- Prose: H1, H2, H3, H4, Body, BodySm, Caption
- Card: Title, Description
- Menu: Item
- Field: Label
- Table: Header, Cell
- ...

Motion: ~8가지
- hover.lift, hover.glow
- press.shrink, press.bounce
- enter.fade, enter.slide
- exit.fade, exit.slide

Visual Effects: ~6가지
- opacity: 0.5 (disabled), 0.8 (dimmed)
- blur: 4px (background), 10px (glass)
- ...

총 조합:
6 × 15 × 15 × 8 × 6 = 64,800가지

하지만 실제로는 자주 쓰는 패턴 조합 ~50가지로 수렴!
```

**결과**:
- **무한 → 50가지** (99.999% 감소)
- 각 선택에 "이유(WHY)"가 있음
- AI가 이해하고 추론 가능

---

# Act 18: 범주 간의 의존성 그래프

**Claude**: 13개 범주가 어떻게 의존하는지 그래프를 그려봅시다.

```
Foundation Layer (기반)
├─ Content Flow (display, visibility)
│   └─ 모든 범주의 전제 조건
│
├─ Sizing (width, height)
│   └─ Layout, Spacing에 영향
│
└─ Position Context (static, relative, absolute)
    ├─ Overlay (absolute/fixed)
    ├─ Anchor (sticky)
    └─ Offset (relative)

Visual Layer (시각)
├─ Surface (bg, border, shadow)
│   └─ State에서 변경됨
│
├─ Typography (text 스타일)
│   └─ State에서 변경됨
│
└─ Visual Effects (opacity, filter)
    └─ State, Motion과 협력

Structure Layer (구조)
├─ Layout (내부 배치)
│   └─ Spacing과 조정
│
└─ Spacing (외부 관계)
    └─ Layout과 충돌 가능

Interaction Layer (상호작용)
├─ Interaction (cursor, pointer-events)
│   └─ State의 전제 조건
│
├─ State (hover, active, selected)
│   ├─ Surface 변경
│   ├─ Typography 변경
│   └─ Motion 트리거
│
└─ Motion (transition, animation)
    └─ State에서 트리거됨
```

**의존성 규칙**:
1. **Content Flow가 가장 먼저** (display: none이면 나머지 무의미)
2. **Sizing이 Layout보다 먼저** (크기가 없으면 배치 불가)
3. **Surface가 State보다 먼저** (기본값 → 변화값)
4. **Interaction이 State보다 먼저** (클릭 가능 → 클릭 반응)
5. **State가 Motion보다 먼저** (상태 변화 → 애니메이션)

---

# Act 19: 범주별 "이유" 계층 구조

**Claude**: 각 범주의 WHY를 깊이별로 나눠봅시다.

**Level 1: 존재의 이유**
- Content Flow: "보여줄 것인가?"
- Sizing: "얼마나 존재하는가?"

**Level 2: 구조의 이유**
- Layout: "내부를 어떻게 조직하는가?"
- Spacing: "외부와 어떤 관계인가?"
- Position: "어디에 위치하는가?"
  - Overlay: "떠 있어야 하는가?"
  - Anchor: "고정되어야 하는가?"
  - Offset: "조정이 필요한가?"

**Level 3: 표현의 이유**
- Surface: "어떻게 구분되는가?"
- Typography: "어떻게 읽히는가?"
- Visual Effects: "어떤 느낌을 주는가?"

**Level 4: 반응의 이유**
- Interaction: "어떻게 상호작용하는가?"
- State: "상호작용에 어떻게 반응하는가?"
- Motion: "변화를 어떻게 보여주는가?"

이 계층 구조는 **의사결정 순서**이기도 합니다:
1. 먼저 "존재"를 결정
2. 그 다음 "구조"를 결정
3. 그 다음 "표현"을 결정
4. 마지막으로 "반응"을 결정

---

# Act 20: 최종 정리 - MDK CSS 추상화 시스템

**User**: 완벽해! 이제 MDK의 CSS 추상화 시스템을 정리해보자.

**Claude**:

## MDK CSS 추상화 시스템 (13개 범주)

### 핵심 원칙
**"No CSS Without Reason"** - 모든 CSS 속성은 13개 범주 중 하나에 속하며, 각 범주는 명확한 WHY를 가진다.

### 13개 범주 전체 맵

```
┌─────────────────────────────────────────────────────────┐
│                   CSS 추상화 레이어                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Level 1: 존재 (Existence)                               │
│  ├─ Content Flow  : 보여줄 것인가?                        │
│  └─ Sizing        : 얼마나 존재하는가?                     │
│                                                           │
│  Level 2: 구조 (Structure)                               │
│  ├─ Layout        : 내부를 어떻게 조직하는가?              │
│  ├─ Spacing       : 외부와 어떤 관계인가?                  │
│  ├─ Overlay       : 떠 있어야 하는가?                      │
│  ├─ Anchor        : 고정되어야 하는가?                     │
│  └─ Offset        : 조정이 필요한가?                       │
│                                                           │
│  Level 3: 표현 (Expression)                              │
│  ├─ Surface       : 어떻게 구분되는가?                     │
│  ├─ Typography    : 어떻게 읽히는가?                       │
│  └─ Visual Effects: 어떤 느낌을 주는가?                    │
│                                                           │
│  Level 4: 반응 (Response)                                │
│  ├─ Interaction   : 어떻게 상호작용하는가?                 │
│  ├─ State         : 상호작용에 어떻게 반응하는가?           │
│  └─ Motion        : 변화를 어떻게 보여주는가?              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 각 범주의 선택지 수

| 범주 | 원래 CSS | MDK | 감소율 |
|------|---------|-----|--------|
| Surface | 무한 | 6 | 99.999% |
| Layout | 무한 | 15 | 99.999% |
| Typography | 무한 | 15 | 99.999% |
| Motion | 무한 | 8 | 99.999% |
| Visual Effects | 무한 | 6 | 99.999% |
| Content Flow | 20+ | 5 | 75% |
| Interaction | 무한 | 8 | 99.999% |
| Spacing | 무한 | 10 | 99.999% |
| Sizing | 무한 | 12 | 99.999% |
| Overlay | 무한 | 6 | 99.999% |
| Anchor | 무한 | 3 | 99.999% |
| Offset | 무한 | 2 | 99.999% |
| State | 무한 | 4 | 99.999% |
| **총합** | **사실상 무한** | **~100** | **99.999%** |

### 의의

1. **AI 추론 가능성**: 무한한 선택지 → 이유 기반 ~100가지
2. **일관성 자동 보장**: 같은 이유 → 같은 결과
3. **학습 곡선 단축**: CSS 속성 암기 → 13개 범주 이해
4. **디자인 수렴**: 목적 기반 UI는 자연스럽게 비슷한 패턴 사용

### 다음 단계

이 13개 범주를 기반으로:
1. 각 범주별 완전한 토큰 세트 정의
2. 범주 간 충돌 방지 규칙 구현
3. 자주 쓰는 패턴 조합을 Preset으로 제공
4. AI가 이해할 수 있는 Decision Tree 문서화

**MDK는 이제 단순한 디자인 시스템이 아니라, CSS 의사결정 프레임워크입니다.**

---

# 결론

이 대화를 통해 우리는:

1. ✅ CSS 속성들을 "이유(WHY)" 기반으로 **13개 범주**로 분류
2. ✅ 각 범주의 **의미**와 **해결하는 문제** 정의
3. ✅ 무한한 CSS 조합을 **~100가지 선택지**로 축소
4. ✅ 범주 간의 **협력 관계**와 **충돌 규칙** 발견
5. ✅ **4단계 의사결정 계층** 구조 수립 (존재 → 구조 → 표현 → 반응)
6. ✅ 실제 사용 **패턴 조합** 예시 제공

**MDK의 본질**:
- Component Library ❌
- Design Token System ❌
- **CSS Decision-Making Framework** ✅

**핵심 가치**:
- "No CSS Without Reason"
- 무한 → 유한, 암기 → 이해, 규칙 → 이유
- AI가 추론할 수 있는 디자인 시스템
