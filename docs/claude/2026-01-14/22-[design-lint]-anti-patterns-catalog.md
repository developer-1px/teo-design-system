# Design Lint 안티패턴 카탈로그

> **목적**: MDK 디자인 시스템의 명백히 잘못된 디자인 사례를 감지하는 린트 규칙 카탈로그
> **철학**: "No CSS Without Reason" - 모든 CSS 선택은 WHY를 답해야 함
> **날짜**: 2025-01-15

---

## Part 1: 현재 스크립트 분석

### 1.1 구현된 4개 규칙

#### Rule 1: Hardcoded Pixel

**감지 대상**:
```tsx
// ❌ 안티패턴
<Frame width="240px" height="48px" />
<Action style={{ width: "32px" }} />

// ✅ 올바른 방식
<Frame w={240} h={48} />
<Action style={{ width: "var(--size-n32)" }} />
```

**WHY 문제인가**:
- 토큰 시스템 우회 → 일관성 붕괴
- 테마/반응형 대응 불가
- 디자인 시스템 의도 무시
- 유지보수 시 값 추적 불가

**감지 메커니즘**:
```javascript
const HARDCODED_PIXEL_REGEX =
  /:\s*['"]?\d+px['"]?|width={['"]?\d+px['"]?}|height={['"]?\d+px['"]?}/g
```

**예외 사항**:
- `1px` (border 기본값)
- `0px` (reset 값)

---

#### Rule 2: Rigid Row

**감지 대상**:
```tsx
// ❌ 안티패턴: 고정 너비 Row에 모든 자식이 고정 크기
<Frame layout={Layout.Row.Header.Default} w={800}>
  <Frame w={200}>Left</Frame>
  <Frame w={400}>Center</Frame>
  <Frame w={200}>Right</Frame>
</Frame>

// ✅ 올바른 방식: 최소 하나의 flexible child
<Frame layout={Layout.Row.Header.Default} w={800}>
  <Frame w={200}>Left</Frame>
  <Frame flex>Center (grows)</Frame>
  <Frame w={200}>Right</Frame>
</Frame>
```

**WHY 문제인가**:
- 콘텐츠 오버플로우 위험
- 반응형 대응 불가
- 고정 합계가 맞지 않으면 레이아웃 깨짐
- 유연성 상실

**감지 메커니즘**:
```javascript
// 1. Row + (maxWidth 또는 width) 감지
// 2. 모든 자식의 flex 속성 확인
// 3. 하나도 flexible하지 않으면 경고
if (node.isRow && node.hasCentering && !hasFlexibleChild) {
  warn("Rigid Row")
}
```

---

#### Rule 3: Floating Flat Surface

**감지 대상**:
```tsx
// ❌ 안티패턴: radius 없는 surface가 떠있음
<Frame surface="raised" w={600} style={{ margin: "0 auto" }}>
  Content
</Frame>

// ✅ 올바른 방식 1: radius 추가
<Frame surface="raised" rounded="md" w={600} style={{ margin: "0 auto" }}>
  Content
</Frame>

// ✅ 올바른 방식 2: edge에 닿게 (full width)
<Frame surface="raised" fill>
  Content
</Frame>
```

**WHY 문제인가**:
- 시각적 불협화음 (날카로운 모서리가 떠있음)
- 디자인 일관성 규칙 위반
- "Surface with corners must be rounded" 원칙

**감지 메커니즘**:
```javascript
// surface 있음 + radius 없음 + centering/maxWidth 있음
if (node.hasSurface && !node.hasRadius && node.hasCentering) {
  warn("Floating Flat Surface")
}
```

---

#### Rule 4: Tiny Action

**감지 대상**:
```tsx
// ❌ 안티패턴: 20px 미만 interactive 요소
<Action style={{ width: "16px", height: "16px" }} icon={Icon} />
<button style={{ width: "var(--size-n18)" }}>Click</button>

// ✅ 올바른 방식: 최소 20px (권장 28-32px)
<Action style={{ width: "var(--size-n28)" }} icon={Icon} />
<button style={{ width: "var(--size-n32)" }}>Click</button>
```

**WHY 문제인가**:
- 터치 타겟 접근성 위반 (WCAG 2.5.5)
- 모바일 사용성 저하
- 의도치 않은 클릭 오류 증가
- iOS/Android 권장사항 위반 (44px/48px)

**최소 크기 기준**:
- **절대 최소**: 20px (데스크탑 마우스)
- **권장 최소**: 28px (믹스 환경)
- **터치 최소**: 44px (모바일)

**감지 메커니즘**:
```javascript
const MIN_ACTION_SIZE = 20
if ((node.tag === "Action" || node.tag === "button") &&
    node.sizes.some(s => s > 0 && s < MIN_ACTION_SIZE)) {
  warn("Tiny Action")
}
```

---

## Part 2: MDK 철학 위반 안티패턴

### 2.1 "No CSS Without Reason" 위반

#### Anti-pattern: Arbitrary Values (토큰 미사용)

```tsx
// ❌ 안티패턴: 임의의 값
<Frame
  style={{
    padding: "17px",      // WHY 17? 토큰에 없는 값
    gap: "13px",          // WHY 13? 의미 없는 값
    width: "237px"        // WHY 237? 근거 없음
  }}
/>

// ✅ 올바른 방식: 시맨틱 토큰
<Frame
  p={16}                  // WHY? --space-n16 (comfortable spacing)
  gap={12}                // WHY? --space-n12 (compact gap)
  w={240}                 // WHY? --size-n240 (sidebar standard)
/>
```

**린트 규칙**:
- `ArbitrarySpacing`: 토큰 범위 밖 spacing 값 감지
- `ArbitrarySizing`: 토큰 범위 밖 sizing 값 감지

---

#### Anti-pattern: Style Prop Abuse (Props 시스템 우회)

```tsx
// ❌ 안티패턴: style prop으로 모든 것 처리
<Frame
  style={{
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    background: "var(--surface-raised)",
    borderRadius: "6px"
  }}
/>

// ✅ 올바른 방식: Props 시스템 사용
<Frame
  layout={Layout.Row.Item.Default}  // WHY? Row layout intent
  surface="raised"                   // WHY? Elevated surface
  rounded="md"                       // WHY? Soft corners
/>
```

**린트 규칙**:
- `StylePropOveruse`: style prop에 3개 이상 속성 금지
- `AvailablePropBypass`: Props로 가능한데 style 사용 감지

---

#### Anti-pattern: Intent Confusion (3-Tier 위반)

```tsx
// ❌ 안티패턴: Control Intent에 Validation 로직
<Field.Control>
  <Input
    onChange={(e) => {
      setValue(e.target.value)
      if (!emailRegex.test(e.target.value)) {  // ❌ Validation in Control
        setError("Invalid email")
      }
    }}
  />
</Field.Control>

// ✅ 올바른 방식: Intent 분리
<Field name="email">
  <Field.Control>
    <Input />
  </Field.Control>
  <Field.Validation schema={emailSchema} />  {/* ✅ Separate Intent */}
</Field>
```

**린트 규칙**:
- `IntentMixing`: 단일 컴포넌트 내 다중 Intent 감지
- `ValidationInControl`: Control 컴포넌트 내 validation 로직

---

### 2.2 Token System 규칙

#### Space Tokens (--space-n*)

**사용 가능한 값**:
```
0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
36, 40, 44, 48, 56, 64, 72, 80, 88, 96, 112, 128, 144, 160
```

**린트 규칙**:
```tsx
// ❌ 토큰 범위 밖
<Frame p={15} />  // 15는 토큰에 없음
<Frame gap={25} /> // 25는 토큰에 없음

// ✅ 가장 가까운 토큰 사용
<Frame p={16} />   // --space-n16
<Frame gap={24} /> // --space-n24
```

**예외 처리**:
- `override` prop 내에서는 허용 (ad-hoc 조정)
- `style` prop 내에서는 경고만 (강제 아님)

---

#### Size Tokens (--size-n*)

**사용 가능한 값**:
```
12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 56,
64, 72, 80, 88, 96, 112, 128, 144, 160, 180, 200, 240, 280, 320,
360, 400, 480, 560, 640, 680, 800, 960, 1200
```

**시맨틱 크기**:
```
action: 40px     (minimum touch target)
header: 44-48px  (app header height)
sidebar: 240px   (standard sidebar width)
content: 680px   (optimal reading width)
max: 1200px      (maximum content width)
```

---

## Part 3: 13개 CSS 카테고리별 안티패턴

### Level 1: Existence

#### Category 1: Content Flow
> "Should this be displayed?"

**Anti-pattern: Hidden Content Without Reason**
```tsx
// ❌ 안티패턴: 의미 없는 display:none
<Frame style={{ display: "none" }}>
  {/* 렌더링되지 않을 복잡한 콘텐츠 */}
</Frame>

// ✅ 올바른 방식: 조건부 렌더링
{shouldShow && <Frame>Content</Frame>}
```

**린트 규칙**: `UnnecessaryHiddenContent`

---

**Anti-pattern: Clip Without Overflow**
```tsx
// ❌ 안티패턴: 오버플로우 없는데 clip
<Frame clip style={{ width: "100%", height: "100%" }}>
  <Text>Short text</Text>  {/* 절대 overflow 안 됨 */}
</Frame>

// ✅ 올바른 방식: 오버플로우 가능성 있을 때만
<Frame clip h={400}>
  <LongScrollableContent />
</Frame>
```

**린트 규칙**: `UnnecessaryClip`

---

#### Category 2: Sizing
> "How much space should this occupy?"

**Anti-pattern: Conflicting Dimensions**
```tsx
// ❌ 안티패턴: width + flex 충돌
<Frame w={240} flex>Content</Frame>

// ❌ 안티패턴: fill + 고정 크기
<Frame fill w={400}>Content</Frame>

// ✅ 올바른 방식: 하나만 선택
<Frame w={240}>Fixed width</Frame>
<Frame flex>Flexible</Frame>
<Frame fill>Full size</Frame>
```

**린트 규칙**: `ConflictingDimensions`

---

**Anti-pattern: Missing Container Dimensions**
```tsx
// ❌ 안티패턴: scroll 있는데 h 없음
<Frame scroll>
  <VeryLongContent />  {/* 무한 높이로 늘어남 */}
</Frame>

// ✅ 올바른 방식: 명시적 높이
<Frame scroll h={600}>
  <VeryLongContent />
</Frame>
```

**린트 규칙**: `ScrollWithoutHeight`

---

### Level 2: Structure

#### Category 3: Layout
> "How to organize internal elements?"

**Anti-pattern: Layout Without Children**
```tsx
// ❌ 안티패턴: 자식 없는 layout
<Frame layout={Layout.Stack.Section}>
  {/* 빈 컨테이너 */}
</Frame>

// ✅ 올바른 방식: 자식이 있을 때만
<Frame layout={Layout.Stack.Section}>
  <Frame>Child 1</Frame>
  <Frame>Child 2</Frame>
</Frame>
```

**린트 규칙**: `EmptyLayoutContainer`

---

**Anti-pattern: Gap Without Layout**
```tsx
// ❌ 안티패턴: gap만 있고 layout 없음
<Frame gap={12}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Frame>

// ✅ 올바른 방식: layout 명시
<Frame layout={Layout.Stack.Content} gap={12}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Frame>
```

**린트 규칙**: `GapWithoutLayout`

---

**Anti-pattern: Excessive Nesting**
```tsx
// ❌ 안티패턴: 불필요한 중첩
<Frame>
  <Frame>
    <Frame>
      <Frame>
        <Text>Deep</Text>
      </Frame>
    </Frame>
  </Frame>
</Frame>

// ✅ 올바른 방식: 평탄화
<Frame p={16}>
  <Text>Flat</Text>
</Frame>
```

**린트 규칙**: `ExcessiveNesting` (4단계 이상 경고)

---

#### Category 4: Spacing
> "What relationship with other elements?"

**Anti-pattern: Padding + Margin Mixing**
```tsx
// ❌ 안티패턴: 패턴 혼재
<Frame p={16}>
  <Frame style={{ margin: "12px" }}>Item</Frame>  {/* margin 사용 */}
  <Frame p={12}>Item</Frame>                      {/* padding 사용 */}
</Frame>

// ✅ 올바른 방식: gap 사용 (일관된 패턴)
<Frame p={16} gap={12}>
  <Frame>Item</Frame>
  <Frame>Item</Frame>
</Frame>
```

**린트 규칙**: `InconsistentSpacing`

---

**Anti-pattern: Asymmetric Padding**
```tsx
// ❌ 안티패턴: 이유 없는 비대칭
<Frame pt={20} pb={8} pl={16} pr={16}>Content</Frame>

// ✅ 올바른 방식: 대칭 또는 명확한 이유
<Frame p={16}>Content</Frame>
<Frame py={20} px={16}>Content (vertical emphasis)</Frame>
```

**린트 규칙**: `AsymmetricPadding`

---

#### Category 5: Overlay
> "Should this float above?"

**Anti-pattern: Absolute Without Position**
```tsx
// ❌ 안티패턴: position:absolute인데 top/left/right/bottom 없음
<Frame style={{ position: "absolute" }}>
  Floating
</Frame>

// ✅ 올바른 방식: 위치 명시
<Frame style={{ position: "absolute", top: 0, right: 0 }}>
  Floating
</Frame>
```

**린트 규칙**: `AbsoluteWithoutPosition`

---

**Anti-pattern: Z-index Chaos**
```tsx
// ❌ 안티패턴: 임의의 z-index 값
<Frame style={{ zIndex: 999 }}>Layer 1</Frame>
<Frame style={{ zIndex: 9999 }}>Layer 2</Frame>
<Frame style={{ zIndex: 99999 }}>Layer 3</Frame>

// ✅ 올바른 방식: 시맨틱 스케일
<Frame style={{ zIndex: 10 }}>Layer 1 (overlay)</Frame>
<Frame style={{ zIndex: 20 }}>Layer 2 (modal)</Frame>
<Frame style={{ zIndex: 30 }}>Layer 3 (toast)</Frame>
```

**Z-index 스케일**:
```
0: default
10: overlay (dropdown, tooltip)
20: modal
30: toast/notification
40: emergency (critical alert)
```

**린트 규칙**: `ArbitraryZIndex` (스케일 외 값 경고)

---

#### Category 6: Anchor
> "Should this stick when scrolling?"

**Anti-pattern: Sticky Without Offset**
```tsx
// ❌ 안티패턴: position:sticky인데 top/bottom 없음
<Frame style={{ position: "sticky" }}>
  Sticky Header
</Frame>

// ✅ 올바른 방식: offset 명시
<Frame style={{ position: "sticky", top: 0 }}>
  Sticky Header
</Frame>
```

**린트 규칙**: `StickyWithoutOffset`

---

#### Category 7: Offset
> "Needs position adjustment?"

**Anti-pattern: Offset Without Reason**
```tsx
// ❌ 안티패턴: relative + offset (명확한 이유 없음)
<Frame style={{ position: "relative", top: "-5px" }}>
  Nudged
</Frame>

// ✅ 올바른 방식: layout으로 해결
<Frame style={{ marginTop: "-5px" }}>
  Overlapped intentionally
</Frame>
```

**린트 규칙**: `ArbitraryOffset`

---

### Level 3: Expression

#### Category 8: Surface
> "How to distinguish visually?"

**Anti-pattern: Surface Stacking Violation**
```tsx
// ❌ 안티패턴: raised 위에 sunken (역순)
<Frame surface="raised">
  <Frame surface="sunken">Content</Frame>
</Frame>

// ✅ 올바른 방식: 올바른 순서
<Frame surface="sunken">
  <Frame surface="raised">Content</Frame>
</Frame>
```

**Surface 계층**:
```
sunken < base < raised < overlay < primary/selected
```

**린트 규칙**: `InvalidSurfaceHierarchy`

---

**Anti-pattern: Duplicate Surface**
```tsx
// ❌ 안티패턴: 동일 surface 중첩
<Frame surface="raised">
  <Frame surface="raised">
    <Frame surface="raised">Content</Frame>
  </Frame>
</Frame>

// ✅ 올바른 방식: 한 단계씩 상승
<Frame surface="sunken">
  <Frame surface="base">
    <Frame surface="raised">Content</Frame>
  </Frame>
</Frame>
```

**린트 규칙**: `DuplicateSurface`

---

**Anti-pattern: Shadow Without Surface**
```tsx
// ❌ 안티패턴: shadow만 있고 surface 없음
<Frame shadow="md">Content</Frame>

// ✅ 올바른 방식: surface와 함께
<Frame surface="raised" shadow="md">Content</Frame>
```

**린트 규칙**: `ShadowWithoutSurface`

---

#### Category 9: Typography
> "How should text be read?"

**Anti-pattern: Text Without Semantic Role**
```tsx
// ❌ 안티패턴: div에 직접 텍스트
<div style={{ fontSize: "24px", fontWeight: "600" }}>
  Heading
</div>

// ✅ 올바른 방식: Prose 사용
<Prose role="h2">Heading</Prose>
```

**린트 규칙**: `UntypedText`

---

**Anti-pattern: Hardcoded Font Size**
```tsx
// ❌ 안티패턴: 임의의 font-size
<Text style={{ fontSize: "17px" }}>Content</Text>

// ✅ 올바른 방식: variant 사용
<Text variant={2}>Content</Text>  {/* 16px */}
```

**린트 규칙**: `HardcodedFontSize`

---

**Anti-pattern: Poor Readability**
```tsx
// ❌ 안티패턴: 긴 텍스트 + 제한 없는 너비
<Frame fill>
  <Prose role="body">
    Very long paragraph that extends to full width making it hard to read...
  </Prose>
</Frame>

// ✅ 올바른 방식: 최적 읽기 너비
<Frame maxWidth={680}>  {/* 50-75 chars/line */}
  <Prose role="body">
    Optimally readable paragraph width...
  </Prose>
</Frame>
```

**린트 규칙**: `UnconstrainedProse` (body 텍스트가 680px 초과)

---

#### Category 10: Visual Effects
> "What feeling to convey?"

**Anti-pattern: Low Opacity on Text**
```tsx
// ❌ 안티패턴: 텍스트 가독성 저하
<Text opacity={30}>Hard to read</Text>

// ✅ 올바른 방식: 색상으로 계층 표현
<Text color="tertiary">Subtle but readable</Text>
```

**린트 규칙**: `LowTextOpacity` (텍스트 opacity < 50)

---

**Anti-pattern: Excessive Blur**
```tsx
// ❌ 안티패턴: 과도한 blur로 인식 불가
<Frame style={{ filter: "blur(20px)" }}>Content</Frame>

// ✅ 올바른 방식: 적절한 blur
<Frame style={{ filter: "blur(4px)" }}>Background blur</Frame>
```

**린트 규칙**: `ExcessiveBlur` (blur > 10px)

---

### Level 4: Response

#### Category 11: Interaction
> "How do users interact?"

**Anti-pattern: Clickable Without Cursor**
```tsx
// ❌ 안티패턴: onClick 있는데 cursor:pointer 없음
<Frame onClick={handleClick}>
  Click me
</Frame>

// ✅ 올바른 방식: cursor 명시
<Frame onClick={handleClick} cursor="pointer">
  Click me
</Frame>
```

**린트 규칙**: `ClickableWithoutCursor`

---

**Anti-pattern: Disabled Without Visual Cue**
```tsx
// ❌ 안티패턴: disabled인데 시각적 표시 없음
<Action disabled onClick={handleClick}>
  Click
</Action>

// ✅ 올바른 방식: opacity로 disabled 표시
<Action disabled opacity={40} style={{ cursor: "not-allowed" }}>
  Click
</Action>
```

**린트 규칙**: `DisabledWithoutOpacity`

---

#### Category 12: State
> "How to react to interaction?"

**Anti-pattern: Hover Without Transition**
```tsx
// ❌ 안티패턴: 즉각적인 hover 변화
<Frame
  surface="base"
  onMouseEnter={() => setSurface("raised")}
>
  Hover me
</Frame>

// ✅ 올바른 방식: CSS transition
<Frame
  surface="base"
  style={{ transition: "background 0.2s" }}
  className="hover:bg-raised"
>
  Hover me
</Frame>
```

**린트 규칙**: `HoverWithoutTransition`

---

**Anti-pattern: Selected Without Visual Difference**
```tsx
// ❌ 안티패턴: selected 상태인데 시각적 차이 없음
<Frame onClick={handleSelect} data-selected={isSelected}>
  Item
</Frame>

// ✅ 올바른 방식: surface로 구분
<Frame
  onClick={handleSelect}
  surface={isSelected ? "selected" : "base"}
>
  Item
</Frame>
```

**린트 규칙**: `SelectedWithoutSurface`

---

#### Category 13: Motion
> "How to show change?"

**Anti-pattern: Action Without Motion Feedback**
```tsx
// ❌ 안티패턴: 버튼 클릭 피드백 없음
<Action onClick={handleClick}>
  Click
</Action>

// ✅ 올바른 방식: press motion
<Action onClick={handleClick} motion="press.shrink">
  Click
</Action>
```

**린트 규칙**: `ActionWithoutMotion`

---

**Anti-pattern: Instant State Change**
```tsx
// ❌ 안티패턴: 즉각적인 상태 변화 (jarring)
<Frame style={{ height: isExpanded ? "400px" : "48px" }}>
  Expandable
</Frame>

// ✅ 올바른 방식: transition 추가
<Frame
  style={{
    height: isExpanded ? "400px" : "48px",
    transition: "height 0.3s ease-out"
  }}
>
  Expandable
</Frame>
```

**린트 규칙**: `InstantSizeChange` (height/width 변화에 transition 없음)

---

## Part 4: 컴포넌트별 안티패턴

### 4.1 Frame 안티패턴

#### Empty Frame (의미 없는 컨테이너)

```tsx
// ❌ 안티패턴: 속성 없는 빈 Frame
<Frame>
  <Text>Content</Text>
</Frame>

// ✅ 올바른 방식: 의미 있는 속성
<Frame p={16}>  {/* WHY? Padding for spacing */}
  <Text>Content</Text>
</Frame>
```

**린트 규칙**: `EmptyFrame` (no props, single child)

---

#### Frame Without Intent (목적 불명확)

```tsx
// ❌ 안티패턴: surface, layout, sizing 중 하나도 없음
<Frame>
  <Child1 />
  <Child2 />
</Frame>

// ✅ 올바른 방식: 명확한 intent
<Frame layout={Layout.Stack.Content}>  {/* WHY? Stack layout */}
  <Child1 />
  <Child2 />
</Frame>
```

**린트 규칙**: `FrameWithoutIntent`

---

#### Scroll Without Shrink

```tsx
// ❌ 안티패턴: 부모가 shrink 없어서 scroll 작동 안 함
<Frame fill>
  <Frame scroll h={400}>  {/* 실제로는 늘어남 */}
    <LongContent />
  </Frame>
</Frame>

// ✅ 올바른 방식: shrink 추가
<Frame fill>
  <Frame scroll shrink>  {/* 컨테이너 크기 제한 */}
    <LongContent />
  </Frame>
</Frame>
```

**린트 규칙**: `ScrollWithoutShrink`

---

### 4.2 Action 안티패턴

#### Action Without Icon or Label

```tsx
// ❌ 안티패턴: 빈 버튼
<Action onClick={handleClick} />

// ✅ 올바른 방식: icon 또는 label
<Action icon={Plus} onClick={handleClick} />
<Action label="Add" onClick={handleClick} />
```

**린트 규칙**: `EmptyAction`

---

#### Icon-only Action Without Accessible Name

```tsx
// ❌ 안티패턴: 스크린 리더 접근성 없음
<Action icon={Close} onClick={handleClose} />

// ✅ 올바른 방식: aria-label 추가
<Action
  icon={Close}
  onClick={handleClose}
  aria-label="Close dialog"
/>
```

**린트 규칙**: `IconActionWithoutAriaLabel`

---

#### Primary Action Without Confirmation

```tsx
// ❌ 안티패턴: 위험한 작업인데 확인 없음
<Action
  variant="primary"
  onClick={handleDelete}
  label="Delete All"
/>

// ✅ 올바른 방식: 확인 단계 추가
<Action
  variant="primary"
  onClick={handleDelete}
  label="Delete All"
  requiresConfirmation
/>
```

**린트 규칙**: `DestructiveActionWithoutConfirmation` (delete, remove 키워드 감지)

---

### 4.3 Text/Prose 안티패턴

#### Prose Without Container

```tsx
// ❌ 안티패턴: Prose가 제한 없는 컨테이너에
<Frame fill>
  <Prose role="body">Long paragraph...</Prose>
</Frame>

// ✅ 올바른 방식: ProseDocument 사용
<ProseDocument maxWidth={680}>
  <Prose role="body">Long paragraph...</Prose>
</ProseDocument>
```

**린트 규칙**: `ProseWithoutContainer`

---

#### Heading Without Hierarchy

```tsx
// ❌ 안티패턴: h1 다음 바로 h4
<Prose role="h1">Title</Prose>
<Prose role="h4">Subheading</Prose>

// ✅ 올바른 방식: 순차적 hierarchy
<Prose role="h1">Title</Prose>
<Prose role="h2">Section</Prose>
<Prose role="h3">Subsection</Prose>
```

**린트 규칙**: `HeadingHierarchySkip`

---

### 4.4 Layout 안티패턴

#### Stack Without Gap

```tsx
// ❌ 안티패턴: Stack인데 gap 없음 (요소들 붙음)
<Frame layout={Layout.Stack.Content}>
  <Item1 />
  <Item2 />
  <Item3 />
</Frame>

// ✅ 올바른 방식: gap 추가
<Frame layout={Layout.Stack.Content} gap={12}>
  <Item1 />
  <Item2 />
  <Item3 />
</Frame>
```

**린트 규칙**: `StackWithoutGap`

---

#### Grid Without Template

```tsx
// ❌ 안티패턴: grid인데 columns/rows 없음
<Frame grid>
  <Item1 />
  <Item2 />
</Frame>

// ✅ 올바른 방식: template 명시
<Frame grid columns="1fr 2fr">
  <Item1 />
  <Item2 />
</Frame>
```

**린트 규칙**: `GridWithoutTemplate`

---

#### Center Alignment Abuse

```tsx
// ❌ 안티패턴: 모든 것을 center (가독성 저하)
<Frame layout={Layout.Stack.Content} align="center">
  <Prose role="h1" align="center">Title</Prose>
  <Prose role="body" align="center">Long paragraph...</Prose>
  <Prose role="body" align="center">Another paragraph...</Prose>
</Frame>

// ✅ 올바른 방식: 제목만 center, 본문은 left
<Frame layout={Layout.Stack.Content} align="center">
  <Prose role="h1" align="center">Title</Prose>
  <Prose role="body" align="left">Long paragraph...</Prose>
  <Prose role="body" align="left">Another paragraph...</Prose>
</Frame>
```

**린트 규칙**: `ExcessiveCenterAlignment` (body text + center)

---

## Part 5: 구현 가능한 린트 규칙 제안

### 5.1 우선순위 HIGH (즉시 구현 가능)

| 규칙 ID | 규칙 이름 | 감지 난이도 | 영향도 |
|---------|-----------|-------------|--------|
| H01 | `HardcodedPixel` | 쉬움 (regex) | 높음 |
| H02 | `ArbitrarySpacing` | 쉬움 (토큰 체크) | 높음 |
| H03 | `ArbitrarySizing` | 쉬움 (토큰 체크) | 높음 |
| H04 | `TinyAction` | 쉬움 (size 추출) | 높음 |
| H05 | `FloatingFlatSurface` | 쉬움 (props 조합) | 중간 |
| H06 | `RigidRow` | 중간 (자식 분석) | 중간 |
| H07 | `EmptyFrame` | 쉬움 (props 카운트) | 낮음 |
| H08 | `EmptyAction` | 쉬움 (icon/label 체크) | 높음 |
| H09 | `ShadowWithoutSurface` | 쉬움 (props 조합) | 중간 |
| H10 | `GapWithoutLayout` | 쉬움 (props 조합) | 중간 |

---

### 5.2 우선순위 MEDIUM (복잡한 분석 필요)

| 규칙 ID | 규칙 이름 | 감지 난이도 | 영향도 |
|---------|-----------|-------------|--------|
| M01 | `ConflictingDimensions` | 중간 (props 충돌) | 높음 |
| M02 | `InvalidSurfaceHierarchy` | 중간 (트리 순회) | 중간 |
| M03 | `ScrollWithoutHeight` | 중간 (맥락 분석) | 높음 |
| M04 | `ClickableWithoutCursor` | 중간 (onClick 감지) | 중간 |
| M05 | `StackWithoutGap` | 중간 (자식 수) | 낮음 |
| M06 | `ExcessiveNesting` | 중간 (깊이 추적) | 중간 |
| M07 | `ProseWithoutContainer` | 중간 (부모 체크) | 중간 |
| M08 | `ArbitraryZIndex` | 쉬움 (값 범위) | 중간 |
| M09 | `HardcodedFontSize` | 쉬움 (regex) | 높음 |
| M10 | `GridWithoutTemplate` | 쉬움 (props 조합) | 중간 |

---

### 5.3 우선순위 LOW (맥락 의존적)

| 규칙 ID | 규칙 이름 | 감지 난이도 | 영향도 |
|---------|-----------|-------------|--------|
| L01 | `IntentMixing` | 어려움 (로직 분석) | 높음 |
| L02 | `ActionWithoutMotion` | 어려움 (동적 분석) | 낮음 |
| L03 | `HeadingHierarchySkip` | 중간 (순서 추적) | 중간 |
| L04 | `AsymmetricPadding` | 어려움 (의도 파악) | 낮음 |
| L05 | `LowTextOpacity` | 쉬움 (값 체크) | 낮음 |
| L06 | `ExcessiveCenterAlignment` | 어려움 (맥락) | 낮음 |
| L07 | `DestructiveActionWithoutConfirmation` | 중간 (키워드) | 중간 |
| L08 | `UnconstrainedProse` | 중간 (부모 크기) | 중간 |
| L09 | `DuplicateSurface` | 중간 (트리 순회) | 낮음 |
| L10 | `ScrollWithoutShrink` | 어려움 (맥락) | 중간 |

---

## Part 6: 실행 계획

### 6.1 Phase 1: 기초 확립 (Week 1-2)

**목표**: 현재 4개 규칙 개선 + HIGH 우선순위 6개 추가

**구현 규칙**:
1. ✅ `HardcodedPixel` (이미 구현)
2. ✅ `TinyAction` (이미 구현)
3. ✅ `FloatingFlatSurface` (이미 구현)
4. ✅ `RigidRow` (이미 구현)
5. 🆕 `ArbitrarySpacing` - 토큰 범위 밖 spacing 값
6. 🆕 `ArbitrarySizing` - 토큰 범위 밖 sizing 값
7. 🆕 `EmptyFrame` - 속성 없는 Frame
8. 🆕 `EmptyAction` - icon/label 없는 Action
9. 🆕 `ShadowWithoutSurface` - shadow만 있고 surface 없음
10. 🆕 `GapWithoutLayout` - gap만 있고 layout 없음

**구현 방법**:
```javascript
// tokens.const.js에서 토큰 범위 import
const SPACE_TOKENS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, ...];
const SIZE_TOKENS = [12, 14, 16, 18, 20, 22, 24, 26, 28, ...];

function checkArbitrarySpacing(value) {
  if (typeof value === 'number' && !SPACE_TOKENS.includes(value)) {
    return `Value ${value} not in space token range. Use nearest: ${findNearest(value, SPACE_TOKENS)}`;
  }
}
```

---

### 6.2 Phase 2: 충돌 감지 (Week 3-4)

**목표**: MEDIUM 우선순위 충돌/맥락 규칙 구현

**구현 규칙**:
1. `ConflictingDimensions` - w + flex, fill + 고정 크기
2. `InvalidSurfaceHierarchy` - surface 순서 위반
3. `ScrollWithoutHeight` - scroll 있는데 h 없음
4. `ClickableWithoutCursor` - onClick + cursor 체크
5. `StackWithoutGap` - Stack layout인데 gap 없음
6. `ExcessiveNesting` - 4단계 이상 중첩
7. `ArbitraryZIndex` - z-index 스케일 외 값

**구현 방법**:
```javascript
function checkConflictingDimensions(node) {
  const conflicts = [];

  if (node.props.w && node.props.flex) {
    conflicts.push('w + flex conflict');
  }

  if (node.props.fill && (node.props.w || node.props.h)) {
    conflicts.push('fill + fixed size conflict');
  }

  return conflicts;
}
```

---

### 6.3 Phase 3: 고급 분석 (Week 5-6)

**목표**: 트리 순회, 부모-자식 관계 분석

**구현 규칙**:
1. `ProseWithoutContainer` - Prose의 부모가 width 제한 없음
2. `HeadingHierarchySkip` - h1 → h4 같은 건너뛰기
3. `GridWithoutTemplate` - grid인데 columns/rows 없음
4. `UnconstrainedProse` - body 텍스트가 680px 초과
5. `DuplicateSurface` - 동일 surface 중첩

**구현 방법**:
```javascript
function buildComponentTree(node, parent = null) {
  const treeNode = {
    ...node,
    parent,
    children: []
  };

  node.children.forEach(child => {
    treeNode.children.push(buildComponentTree(child, treeNode));
  });

  return treeNode;
}

function checkSurfaceHierarchy(node) {
  if (!node.parent || !node.surface) return;

  const parentSurface = node.parent.surface;
  const surfaceOrder = ['sunken', 'base', 'raised', 'overlay', 'primary', 'selected'];

  if (surfaceOrder.indexOf(node.surface) < surfaceOrder.indexOf(parentSurface)) {
    warn('Invalid surface hierarchy: child surface should be higher');
  }
}
```

---

### 6.4 Phase 4: 접근성 & 모션 (Week 7-8)

**목표**: 사용자 경험 품질 규칙

**구현 규칙**:
1. `IconActionWithoutAriaLabel` - icon-only Action에 aria-label 없음
2. `DisabledWithoutOpacity` - disabled인데 시각적 표시 없음
3. `ActionWithoutMotion` - Action에 motion feedback 없음
4. `HoverWithoutTransition` - hover 상태 변화에 transition 없음
5. `InstantSizeChange` - 크기 변화에 transition 없음

---

### 6.5 성능 고려사항

#### 1. 증분 분석
```javascript
// 전체 스캔이 아닌 변경된 파일만 분석
const changedFiles = getGitChangedFiles();
changedFiles.forEach(file => auditFile(file));
```

#### 2. 캐싱
```javascript
// 파일 해시 캐싱
const fileHash = crypto.createHash('md5').update(content).digest('hex');
if (cache[filePath] === fileHash) {
  return cachedResults[filePath];
}
```

#### 3. 병렬 처리
```javascript
// Worker threads로 병렬 분석
const workers = require('worker_threads');
const numCPUs = require('os').cpus().length;
```

#### 4. 규칙 선택적 실행
```javascript
// .designlintrc.json 설정 파일
{
  "rules": {
    "HardcodedPixel": "error",
    "ArbitrarySpacing": "warn",
    "ActionWithoutMotion": "off"
  }
}
```

---

### 6.6 예외 처리 전략

#### 1. Inline 주석으로 비활성화
```tsx
{/* design-lint-disable-next-line TinyAction */}
<Action style={{ width: "16px" }} icon={Icon} />
```

#### 2. 파일 레벨 비활성화
```tsx
/* design-lint-disable TinyAction, HardcodedPixel */
```

#### 3. override prop 내에서 완화
```tsx
// override prop 내에서는 경고만 (에러 아님)
<Frame override={{ p: 15 }}>  {/* warn만, error 아님 */}
  Content
</Frame>
```

---

### 6.7 보고서 포맷 개선

#### 현재 포맷
```
📄 src/apps/SlideApp.tsx
   L66 [Tiny Action]: Interactive element too small (20px)
      Code: <Action icon={ChevronDown} />
```

#### 제안 포맷
```
📄 src/apps/SlideApp.tsx

  66:12  error    Tiny Action: Interactive element too small (20px).
                  Minimum safe size is 28px for mixed environments.

                  66 |   <Action
                > 67 |     icon={ChevronDown}
                     |     ^^^^^^^^^^^^^^^^^^
                  68 |     style={{ width: "20px", height: "20px" }}

                  💡 Suggestion: Change to width: "var(--size-n28)"
                  📖 Why: WCAG 2.5.5 requires minimum 24x24px touch targets
                  🔗 Docs: https://mdk.dev/docs/rules/tiny-action

  88:8   warning  Hardcoded Pixel: Use size token instead of "20px"

                  88 |   style={{ width: "20px" }}
                     |            ^^^^^^^^^^^^^^^

                  💡 Suggestion: style={{ width: "var(--size-n20)" }}
                  📖 Why: Tokens ensure consistency and enable theming

✖ 2 problems (1 error, 1 warning)
  1 error potentially fixable with --fix
```

---

## Part 7: 요약 및 다음 단계

### 7.1 전체 규칙 통계

**현재 구현**: 4개
**HIGH 우선순위**: 10개
**MEDIUM 우선순위**: 10개
**LOW 우선순위**: 10개
**총 제안 규칙**: 34개

---

### 7.2 즉시 구현 가능 (Quick Wins)

1. ✅ `HardcodedPixel` - 이미 구현됨
2. ✅ `TinyAction` - 이미 구현됨
3. ✅ `FloatingFlatSurface` - 이미 구현됨
4. ✅ `RigidRow` - 이미 구현됨
5. 🔜 `ArbitrarySpacing` - 토큰 목록만 추가하면 됨
6. 🔜 `ArbitrarySizing` - 토큰 목록만 추가하면 됨
7. 🔜 `EmptyFrame` - props 카운트만 확인
8. 🔜 `EmptyAction` - icon/label 존재 확인

---

### 7.3 스크립트 확장 제안

#### 1. 설정 파일 지원
```javascript
// .designlintrc.json
{
  "extends": "mdk/recommended",
  "rules": {
    "HardcodedPixel": "error",
    "TinyAction": ["error", { "minSize": 28 }],
    "ArbitrarySpacing": "warn"
  },
  "ignore": [
    "src/legacy/**",
    "src/experiments/**"
  ]
}
```

#### 2. Auto-fix 기능
```bash
$ node scripts/design-audit.cjs --fix

✔ Fixed 5 issues automatically
  - Replaced "20px" with "var(--size-n20)" in 3 files
  - Added cursor="pointer" to 2 Actions
```

#### 3. CI/CD 통합
```yaml
# .github/workflows/design-lint.yml
name: Design Lint
on: [pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: node scripts/design-audit.cjs
      - run: |
          if [ $? -ne 0 ]; then
            echo "::error::Design lint failed. See report above."
            exit 1
          fi
```

#### 4. VS Code 확장
```json
// MDK Design Lint Extension
{
  "name": "mdk-design-lint",
  "displayName": "MDK Design Lint",
  "description": "Real-time design system linting for MDK",
  "features": [
    "Inline warnings in editor",
    "Quick fixes (Cmd+.)",
    "Token autocomplete",
    "Rule documentation on hover"
  ]
}
```

---

### 7.4 측정 지표 (Metrics)

#### 디자인 품질 점수
```
Design Quality Score = 100 - (errors × 10 + warnings × 2)

예시:
- 5 errors, 10 warnings = 100 - 50 - 20 = 30/100 (Poor)
- 2 errors, 5 warnings = 100 - 20 - 10 = 70/100 (Fair)
- 0 errors, 3 warnings = 100 - 0 - 6 = 94/100 (Excellent)
```

#### 토큰 사용률
```
Token Usage Rate = (tokenized values / total values) × 100

예시:
- 50 속성 중 45개가 토큰 사용 = 90% (Good)
- 50 속성 중 30개가 토큰 사용 = 60% (Needs improvement)
```

#### 일관성 점수
```
Consistency Score = 1 - (unique arbitrary values / total values)

예시:
- 5개 unique 임의 값 / 50 총 값 = 90% (Consistent)
- 20개 unique 임의 값 / 50 총 값 = 60% (Inconsistent)
```

---

### 7.5 학습 리소스 연결

각 린트 규칙에 학습 자료 링크:

```
[TinyAction] detected
📖 Learn more:
  - docs/claude/22-design-lint-anti-patterns-catalog.md#tiny-action
  - WCAG 2.5.5: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  - MDK Sizing: docs/claude/22-sizing-decision-model.md
```

---

## 결론

**디자인 린트의 목적**:
- ✅ 일관성 강제 (토큰 사용, 패턴 준수)
- ✅ 접근성 보장 (최소 크기, 색상 대비, 키보드 내비게이션)
- ✅ 사용성 향상 (피드백, 모션, 명확한 상태)
- ✅ 유지보수성 (명확한 Intent, 예측 가능한 구조)

**MDK 철학 반영**:
- 모든 규칙은 "WHY" 질문에 답함
- 13개 CSS 카테고리에 매핑됨
- 3-Tier Intent System 준수 확인
- "No CSS Without Reason" 강제

**다음 단계**:
1. Phase 1 규칙 구현 (Week 1-2)
2. CI/CD 통합 (Week 3)
3. Auto-fix 기능 추가 (Week 4)
4. VS Code 확장 개발 (Week 5-8)

---

**작성일**: 2025-01-15
**버전**: 1.0.0
**키워드**: #DesignLint #AntiPatterns #MDK #CSS13Categories #IntentSystem #Accessibility
