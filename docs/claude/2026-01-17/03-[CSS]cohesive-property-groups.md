# CSS Cohesive Property Groups

**Date**: 2026-01-17
**Tags**: `#css` `#design-validation` `#design-system` `#mdk`

---

## Overview

CSS 속성의 종류가 너무 많아서 디자이너나 AI가 하나의 속성을 수정할 때 어떤 다른 속성들을 함께 확인해야 하는지 명확하지 않습니다. 이 문서는 **"함께 다니는 CSS"** 즉, 하나를 바꾸면 다른 것도 검증해야 하는 CSS 속성 그룹들을 정리합니다.

### 핵심 원칙

> **"CSS를 수정하면 같이 봐야하는 CSS"**
> 디자이너가 어떤 CSS를 바꾸면 실제로 바꾸지는 않더라도 **디자인이 올바른가 확인해야만 하는** CSS들을 하나로 묶는다.

**예시**:
- `border`가 있는데 `padding`이 없으면 → 올바른 디자인이 아님
- `shadow`가 있는데 `z-index`가 없으면 → 시각적 깊이와 스택 순서 불일치
- `interactive` 상태인데 `cursor`가 없으면 → 사용자 피드백 부족

---

## 1. Surface Group

**개념**: `surface = bg + border + shadow + padding`

| 속성 | 역할 | 토큰/값 예시 |
|------|------|-------------|
| `background-color` | 표면의 기본색 | `var(--surface-raised-bg)` |
| `border` | 표면의 경계선 | `1px solid var(--surface-raised-border)` |
| `box-shadow` | 표면의 입체감 | `var(--surface-raised-shadow)` |
| `padding` | 표면 내부 여백 (필수) | `Space.n12`, `Space.n16` |
| `border-radius` | 표면의 모서리 | `Radius2.md` (6px) |

### WHY: 왜 함께 다니는가?

1. **Border + Padding Rule**:
   - Border가 있으면 내용물과 테두리 사이에 숨쉴 공간(`padding`)이 필요
   - Border 없이 내용물이 테두리에 붙으면 답답하고 비전문적으로 보임

2. **Shadow + Background**:
   - Shadow는 표면이 띄워져 있음을 표현
   - Shadow 없이 border만 있으면 flat하게 보임
   - `raised`와 `overlay`는 shadow가 필수

3. **Surface Integrity**:
   - 하나의 표면은 일관된 시각적 속성들의 조합
   - MDK에서는 `surface` prop 하나로 관련 속성들을 자동 적용

### MDK 구현

```tsx
// ✅ Good: surface prop이 bg + border + shadow를 자동 적용
<Frame surface="raised" override={{ p: Space.n16 }}>
  {/* padding은 명시적으로 추가 */}
</Frame>

// ❌ Bad: border만 추가하고 padding 없음
<Frame override={{ border: true }}>
  {/* 내용물이 테두리에 붙어서 답답함 */}
</Frame>
```

### 디자인 검증

- [ ] `border`가 있으면 `padding`도 있는가?
- [ ] `shadow`가 있으면 적절한 `background-color`가 있는가?
- [ ] `surface="raised"` 또는 `"overlay"`를 사용할 때 `padding`을 명시했는가?

---

## 2. Elevation

**개념**: `elevation = shadow + z-index`

| 속성 | 역할 | 토큰/값 예시 |
|------|------|-------------|
| `box-shadow` | 시각적 깊이 표현 | `var(--shadow-sm)`, `var(--shadow-lg)` |
| `z-index` | 실제 스택 순서 | `ZIndex.n10`, `ZIndex.n50` |

### WHY: 왜 함께 다니는가?

1. **시각적 깊이 = 스택 순서**:
   - Shadow가 크면 더 높이 떠있는 것처럼 보여야 함
   - 시각적으로 위에 있는데 스택 순서가 낮으면 클릭 시 가려짐
   - 일관성: 보이는 것과 동작이 일치해야 함

2. **Elevation Levels**:
   - `sm shadow` → `z-index: 1-5`
   - `md shadow` → `z-index: 10-20`
   - `lg shadow` → `z-index: 30-50`
   - `xl shadow` → `z-index: 75-100`

### MDK 구현

```tsx
// ✅ Good: shadow와 z-index가 함께
<Frame
  shadow="lg"
  override={{ zIndex: ZIndex.n30 }}
>
  {/* 시각적으로도 높고, 실제로도 위에 */}
</Frame>

// ❌ Bad: shadow는 크지만 z-index 없음
<Frame shadow="xl">
  {/* 시각적으로는 최상위인데 다른 요소에 가려질 수 있음 */}
</Frame>
```

### 디자인 검증

- [ ] `shadow`가 있으면 적절한 `z-index`가 있는가?
- [ ] Shadow 크기와 z-index 값이 비례하는가?
- [ ] Overlay 요소는 충분히 높은 z-index를 가지는가? (최소 50+)

---

## 3. Interactive States

**개념**: `interactive = cursor + transition + hover/focus/active states`

| 속성 | 역할 | 토큰/값 예시 |
|------|------|-------------|
| `cursor` | 마우스 포인터 모양 | `pointer`, `text`, `move` |
| `transition` | 상태 변화 애니메이션 | `background-color 0.2s ease` |
| `:hover` | 마우스 오버 시 스타일 | `background-color`, `border-color` |
| `:focus-within` | 포커스 시 스타일 | `border-color`, `z-index` |
| `:active` | 클릭 시 스타일 | `transform`, `opacity` |

### WHY: 왜 함께 다니는가?

1. **사용자 피드백 일관성**:
   - Interactive 요소는 "클릭할 수 있음"을 시각적으로 알려야 함
   - `cursor: pointer` 없이 hover 효과만 있으면 혼란스러움
   - Transition 없이 즉각 변하면 부자연스러움

2. **접근성**:
   - Keyboard 사용자를 위한 `:focus` 상태 필수
   - Mouse 사용자를 위한 `:hover` 상태 필수
   - Touch 사용자를 위한 `:active` 상태 필수

3. **Surface별 다른 Interactive 패턴**:
   - `surface-base`: hover → 배경색 약간 어두움
   - `surface-sunken`: focus → 배경색 밝아짐 (pop effect)
   - `surface-ghost`: hover → 배경 나타남
   - `surface-raised`: active → 아래로 눌림 (tactile feedback)

### MDK 구현

```tsx
// ✅ Good: interactive prop이 cursor + transition + states 자동 적용
<Frame surface="base" interactive>
  {/* cursor: pointer + all hover/active states */}
</Frame>

// ✅ Good: 특정 cursor 지정
<Frame surface="sunken" interactive="text">
  {/* cursor: text for input-like elements */}
</Frame>

// ❌ Bad: hover 효과는 있는데 cursor가 default
<Frame surface="base" override={{ /* custom hover but no cursor */ }}>
  {/* 사용자가 클릭 가능한지 알 수 없음 */}
</Frame>
```

### 디자인 검증

- [ ] Interactive 요소는 `cursor`를 명시했는가?
- [ ] Hover/focus/active 상태가 모두 정의되어 있는가?
- [ ] Transition이 적용되어 자연스러운가?
- [ ] Surface 타입에 맞는 interactive 패턴을 사용하는가?

---

## 4. Border-Padding Rule

**개념**: `border → padding 필수`

| 속성 | 역할 | 최소값 |
|------|------|--------|
| `border` | 경계선 | `1px solid` |
| `padding` | 내부 여백 (필수) | 최소 `Space.n8` (8px) |

### WHY: 왜 함께 다니는가?

1. **시각적 숨쉬기 공간**:
   - Border가 content에 바로 붙으면 답답하고 읽기 어려움
   - 최소 8px의 padding이 필요 (보통 12-16px 권장)

2. **디자인 품질**:
   - Padding 없는 border는 미완성처럼 보임
   - 전문적인 UI는 항상 적절한 내부 여백을 유지

3. **예외 상황**:
   - Separator/Divider는 border만 있고 padding 불필요 (content가 없음)
   - Table cell은 border와 padding이 별도로 관리될 수 있음

### MDK 구현

```tsx
// ✅ Good: border + padding
<Frame override={{ border: true, p: Space.n12 }}>
  Content has breathing room
</Frame>

// ✅ Good: surface="raised"는 자동으로 border 포함, padding은 명시
<Frame surface="raised" override={{ p: Space.n16 }}>
  Raised surface with proper padding
</Frame>

// ❌ Bad: border만 있고 padding 없음
<Frame override={{ border: true }}>
  Text touches the border - looks cramped
</Frame>
```

### 디자인 검증

- [ ] `border`가 있는 요소는 `padding`이 있는가?
- [ ] Padding 값이 최소 8px 이상인가?
- [ ] Content 타입에 맞는 적절한 padding인가? (text는 더 많이 필요)

---

## 5. Layout Context

**개념**: `layout = direction + gap + align + justify + padding`

| 속성 | 역할 | 토큰/값 예시 |
|------|------|-------------|
| `flex-direction` | 배치 방향 | `row`, `column` |
| `gap` | 자식 간 간격 | `Space.n8`, `Space.n12`, `Space.n16` |
| `align-items` | 교차축 정렬 | `start`, `center`, `end`, `stretch` |
| `justify-content` | 주축 정렬 | `start`, `center`, `end`, `space-between` |
| `padding` | 컨테이너 내부 여백 | `Space.n12`, `Space.n16` |

### WHY: 왜 함께 다니는가?

1. **Layout 일관성**:
   - Direction이 바뀌면 gap의 의미가 달라짐 (수평 ↔ 수직)
   - Align/justify는 direction에 종속적 (주축과 교차축)
   - Padding은 gap과 균형을 이루어야 함

2. **시각적 리듬**:
   - Gap과 padding의 비율이 시각적 계층을 만듦
   - 보통 `padding = gap * 1.5` 정도가 자연스러움
   - 예: `gap: 12px` → `padding: 16-20px`

3. **MDK Layout Presets**:
   - `Layout.Stack.*`: column + gap + padding 세트
   - `Layout.Row.*`: row + gap + align 세트
   - Preset 사용 시 자동으로 조화로운 조합 적용

### MDK 구현

```tsx
// ✅ Good: Layout preset 사용 (자동으로 조화로운 조합)
<Frame layout={Layout.Stack.Content.Default}>
  {/* column + gap:12 + padding:16 + align:stretch */}
</Frame>

// ✅ Good: Override로 개별 지정 (gap과 padding 균형)
<Frame override={{
  row: true,
  gap: Space.n12,
  p: Space.n16,
  align: "center"
}}>
  {/* 수동이지만 균형잡힌 조합 */}
</Frame>

// ❌ Bad: gap만 크고 padding 없음
<Frame override={{ row: true, gap: Space.n24 }}>
  {/* 자식 간격은 넓은데 외부 여백 없어서 부자연스러움 */}
</Frame>
```

### 디자인 검증

- [ ] `gap`과 `padding`이 적절한 비율인가? (보통 1:1.5 또는 1:1.3)
- [ ] Direction 변경 시 align/justify를 재검토했는가?
- [ ] Layout preset을 사용할 수 있는 경우가 아닌가?

---

## 6. Typography Cohesion

**개념**: `typography = font-size + line-height + letter-spacing`

| 속성 | 역할 | 관계 |
|------|------|------|
| `font-size` | 글자 크기 | 기준값 |
| `line-height` | 줄 간격 | font-size의 1.4-1.6배 (본문) |
| `letter-spacing` | 자간 | 큰 글자는 음수, 작은 글자는 양수 |
| `font-weight` | 글자 굵기 | 제목은 bold, 본문은 regular |

### WHY: 왜 함께 다니는가?

1. **가독성 3요소**:
   - Font-size만 키우고 line-height를 안 조정하면 줄이 겹침
   - Letter-spacing 없이 큰 제목은 답답해 보임
   - 작은 글자는 자간을 넓혀야 읽기 편함

2. **크기별 최적 비율**:
   - **큰 제목 (40px+)**: line-height 1.1-1.2, letter-spacing -0.02em
   - **중간 제목 (24-32px)**: line-height 1.3-1.4, letter-spacing 0em
   - **본문 (16-20px)**: line-height 1.5-1.6, letter-spacing 0em
   - **작은 글자 (12-14px)**: line-height 1.4-1.5, letter-spacing 0.02-0.05em

3. **MDK Prose Tokens**:
   - `--prose-h1-*`: size/height/spacing이 세트로 정의됨
   - 하나만 바꾸면 균형이 깨짐

### MDK 구현

```tsx
// ✅ Good: Prose token 사용 (자동으로 조화로운 조합)
<Text.Prose.Title variant="xl">
  {/* font-size: 80px + line-height: 1.1 + letter-spacing: -0.03em */}
</Text.Prose.Title>

// ❌ Bad: font-size만 키우고 line-height 안 조정
<Text style={{ fontSize: "80px" }}>
  {/* 기본 line-height 1.5로 너무 넓어서 부자연스러움 */}
</Text>
```

### 디자인 검증

- [ ] Font-size 변경 시 line-height를 함께 조정했는가?
- [ ] 큰 제목은 음수 letter-spacing을 사용하는가?
- [ ] 작은 글자는 양수 letter-spacing을 사용하는가?
- [ ] Prose token을 사용할 수 있는 경우가 아닌가?

---

## 7. Scroll Container

**개념**: `scroll = overflow + scroll-behavior + clip`

| 속성 | 역할 | 값 예시 |
|------|------|---------|
| `overflow` | 넘침 처리 | `auto`, `scroll`, `hidden` |
| `scroll-behavior` | 스크롤 애니메이션 | `smooth` |
| `clip` | 자식 요소 잘림 | `overflow: hidden` |

### WHY: 왜 함께 다니는가?

1. **Scroll 동작 완성**:
   - `overflow: auto` 없이 content가 넘치면 레이아웃 깨짐
   - `scroll-behavior: smooth` 없으면 스크롤이 거칠게 보임
   - `clip: true` 없이 absolute 요소가 튀어나갈 수 있음

2. **Height와의 관계**:
   - Scroll 가능하려면 고정 height 필요
   - Height 없이 `overflow: auto`는 의미 없음

### MDK 구현

```tsx
// ✅ Good: scroll + fixed height
<Frame scroll h={Size.n640}>
  {/* Scrollable container with defined height */}
</Frame>

// ✅ Good: clip으로 넘침 숨김
<Frame clip>
  {/* Absolute positioned children won't overflow */}
</Frame>

// ❌ Bad: scroll인데 height가 "hug"
<Frame scroll override={{ h: "hug" }}>
  {/* Height이 content에 맞춰지므로 scroll 불가능 */}
</Frame>
```

### 디자인 검증

- [ ] `scroll` prop 사용 시 고정 `height`가 있는가?
- [ ] Scroll 컨테이너는 `smooth` behavior를 사용하는가?
- [ ] Absolute 요소가 있다면 `clip`을 고려했는가?

---

## 8. Focus Behavior

**개념**: `focus = outline/ring + z-index`

| 속성 | 역할 | 값 예시 |
|------|------|---------|
| `outline` / `box-shadow` | 포커스 시각 표시 | `0 0 0 2px var(--primary-bg)` |
| `z-index` | 포커스 시 앞으로 | `z-index: 1` (relative) |

### WHY: 왜 함께 다니는가?

1. **접근성 + 가시성**:
   - Focus ring만 있고 z-index 없으면 다른 요소에 가려짐
   - 특히 list item이나 table row는 focus 시 위로 올라와야 함

2. **Surface-sunken 패턴**:
   - Input 계열은 focus 시 배경이 밝아지면서 z-index도 증가
   - 시각적 "pop" 효과와 실제 레이어 변화가 일치

### MDK 구현

```tsx
// ✅ Good: interactive sunken surface (자동으로 focus + z-index)
<Frame surface="sunken" interactive>
  {/* :focus-within → bg 밝아짐 + z-index: 1 */}
</Frame>

// surface.css에서 자동 처리:
// .frame.interactive.surface-sunken:focus-within {
//   background-color: var(--surface-sunken-bg-focus);
//   border-color: var(--surface-sunken-border-focus);
//   z-index: 1; /* Bring to front if overlapping */
// }
```

### 디자인 검증

- [ ] Interactive 요소는 focus 상태가 정의되어 있는가?
- [ ] Focus 시 z-index가 증가하여 앞으로 오는가?
- [ ] Focus ring이 다른 요소에 가려지지 않는가?

---

## 9. Interactive Surface Variants

**개념**: `surface type → specific interaction pattern`

각 Surface 타입마다 고유한 Interactive 패턴이 정해져 있음:

| Surface | Hover | Active | Focus | 용도 |
|---------|-------|--------|-------|------|
| `base` | 배경 어두워짐 | 더 어두워짐 | - | List items, Menu items |
| `sunken` | 배경 밝아짐 | - | 배경 더 밝아짐 + border | Input, Textarea |
| `ghost` | 배경 나타남 | 배경 더 진함 | - | Icon buttons, Text buttons |
| `raised` | Filter brightness(0.95) | Transform down 1px | - | Solid buttons |
| `primary` | Opacity 0.9 | Opacity 0.8 | - | Primary CTA buttons |

### WHY: 왜 함께 다니는가?

1. **Surface 의미 = Interaction 방식**:
   - `sunken`은 "눌려있는" 상태이므로 focus 시 "올라옴" (pop effect)
   - `ghost`는 "투명"하므로 hover 시 "나타남"
   - `raised`는 "떠있는" 상태이므로 active 시 "눌림" (tactile)

2. **일관성**:
   - 같은 surface는 항상 같은 방식으로 반응
   - 사용자는 surface만 보고 어떻게 반응할지 예측 가능

3. **자동화**:
   - MDK에서 `surface + interactive` 조합이 자동으로 적절한 패턴 적용
   - 개발자가 hover/active를 수동으로 정의할 필요 없음

### MDK 구현

```tsx
// ✅ Good: surface에 맞는 자동 interaction
<Frame surface="ghost" interactive>
  {/* Hover → 배경 나타남 (자동) */}
</Frame>

<Frame surface="raised" interactive>
  {/* Active → 1px 아래로 눌림 (자동) */}
</Frame>

<Frame surface="sunken" interactive>
  {/* Focus → 배경 밝아짐 (자동) */}
</Frame>

// ❌ Bad: surface와 맞지 않는 custom interaction
<Frame surface="ghost" interactive style={{ /* custom hover that conflicts */ }}>
  {/* 일관성 깨짐 */}
</Frame>
```

### 디자인 검증

- [ ] Surface 타입에 맞는 interaction 패턴을 사용하는가?
- [ ] Custom hover/active를 추가할 때 surface의 의미와 충돌하지 않는가?
- [ ] Interactive prop 대신 수동 처리가 정말 필요한가?

---

## Design Validation Checklist

### 필수 검증 항목

디자인을 변경하거나 새로운 컴포넌트를 만들 때 다음을 확인:

#### Surface
- [ ] Surface가 있으면 padding도 있는가?
- [ ] Border가 있으면 최소 8px padding이 있는가?
- [ ] Raised/overlay surface는 shadow + padding이 모두 있는가?

#### Interactive
- [ ] Interactive 요소는 cursor가 명시되어 있는가?
- [ ] Hover, focus, active 상태가 모두 정의되어 있는가?
- [ ] Transition이 적용되어 자연스러운가?

#### Elevation
- [ ] Shadow가 있으면 적절한 z-index가 있는가?
- [ ] Shadow 크기와 z-index가 비례하는가?

#### Layout
- [ ] Gap과 padding의 비율이 적절한가? (1:1.3 ~ 1:1.5)
- [ ] Direction 변경 시 align/justify를 재검토했는가?

#### Typography
- [ ] Font-size 변경 시 line-height를 조정했는가?
- [ ] 큰 제목은 음수 letter-spacing, 작은 글자는 양수인가?

#### Scroll
- [ ] Scroll container는 고정 height가 있는가?
- [ ] Clip이 필요한 경우는 아닌가?

#### Focus
- [ ] Focus 상태가 정의되어 있는가?
- [ ] Focus 시 z-index가 증가하는가?

---

## Quick Reference Table

| 변경하는 CSS | 함께 확인해야 할 CSS | 이유 |
|-------------|-------------------|------|
| `border` | `padding` | Border 없이 content가 붙으면 답답함 |
| `box-shadow` | `z-index` | 시각적 깊이와 스택 순서 일치 필요 |
| `interactive` | `cursor`, `transition` | 사용자 피드백 일관성 |
| `font-size` | `line-height`, `letter-spacing` | 가독성 3요소 |
| `gap` | `padding` | 시각적 리듬과 균형 |
| `overflow: auto` | `height` | Scroll 가능하려면 고정 height 필요 |
| `:focus` | `z-index` | Focus ring이 가려지지 않도록 |
| `surface` | `interactive pattern` | Surface 타입에 따른 고유 반응 |

---

## Conclusion

CSS 속성들은 독립적으로 존재하지 않고 **의미론적 그룹**을 형성합니다. 하나의 속성을 변경할 때는 반드시 관련 그룹의 다른 속성들도 함께 검토해야 디자인 품질을 유지할 수 있습니다.

MDK는 이러한 그룹들을 **semantic props** (surface, interactive, layout 등)로 추상화하여, 개발자와 AI가 자동으로 조화로운 조합을 사용하도록 유도합니다.

**핵심**: "No CSS Without Reason" + "No CSS Without Its Cohort"
