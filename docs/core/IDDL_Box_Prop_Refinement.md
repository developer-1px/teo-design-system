# IDDL Box Props 미세조정(Fine-tuning) 분석 보고서

**분석 일자:** 2026-01-17
**분석 대상:** IDDL Box Props v1.0
**목적:** "미니멀리즘" 철학을 유지하면서 실무 개발 편의성과 AI 추론 정확도를 높이기 위한 Prop 미세조정 제안

---

## 1. `placement`의 의미론적 확장 (Semantic Expansion)

현재 `placement`는 Flexbox의 복잡한 축(Axis) 개념을 `center`, `top` 등으로 단순화합니다. 하지만 `row={false}` (기본값, Column)일 때와 `row={true}`일 때의 직관성이 떨어질 수 있습니다.

### 🔴 문제점
- `row` (수평)일 때: `placement="center"` → `justify: center`, `align: center` (직관적)
- `column` (수직)일 때: `placement="center"` → `align: center`, `justify: center` (직관적)
- **Edge Case:** "텍스트는 왼쪽 정렬하되 수직 중앙에 놓고 싶다면?"
  - 현재: `placement="left"`? `left`는 가로 개념인데 세로 축(`align-items`)은 어떻게 되는가? `stretch`인가 `center`인가?
  - 모호함 발생: `placement` 하나로 두 축을 다 제어하려니 `cross-axis`의 기본값(Stretch vs Center) 충돌.

### ✅ 미세조정 제안
`placement`를 쪼개지 말고, **"주로 쓰이는 조합"을 명시적 키워드로 확장**합니다.

| 기존 값 | 제안 추가 값 | Flex 해석 (Row 기준) | 설명 |
|:---:|:---:|:---|:---|
| `center` | | `justify: center`, `align: center` | 정중앙 |
| `center-between` | | `justify: space-between`, `align: center` | 헤더 표준 |
| | **`start-center`** | `justify: flex-start`, `align: center` | 아이콘+텍스트 트립 (가장 흔함) |
| | **`end-center`** | `justify: flex-end`, `align: center` | 우측 하단 버튼 그룹 |
| `top` / `bottom` | **삭제 권장** | - | `align-items`인지 `justify`인지 모호함이 큼 |

**효과:** 방향성(Start/End)과 정렬(Center/Stretch)을 결합한 복합어(`start-center`)를 사용하여 AI가 "왼쪽 정렬에 수직 중앙"을 정확히 의도하게 함.

---

## 2. `padding`의 명시적 제어 (Explicit Override)

`surface`가 있으면 padding이 자동 적용되는 것은 훌륭한 휴리스틱이지만, "예외"를 위한 문법이 필요합니다.

### 🔴 문제점
- "카드 내부에 꽉 차는 지도 이미지"
- "카드 내부에 꽉 차는 데이터 테이블 (zebra striping)"
- 현재 설계로는 `surface="default"`를 쓰면 무조건 padding이 생겨서, 내부 `Box`에 음수 마진을 주거나 스타일을 덮어써야 함.

### ✅ 미세조정 제안
`spacing` prop은 그대로 두고, **`padding` prop을 별도로 부활시키되 토큰만 허용**하거나, **`fitted` (padding 제거) prop**을 추가.

**Option A: `fitted` prop (Boolean)**
```tsx
<Box surface="default" fitted> {/* padding: 0 */}
  <Image width="fill" />
  <Box spacing="md">Text...</Box>
</Box>
```

**Option B: `padding` prop (Override)**
```tsx
<Box surface="default" padding="none"> ... </Box>
```
**권장:** `padding` prop 사용. `spacing`은 "자식 간격(gap)" 전용으로 의미를 축소하고, `padding`은 "내부 여백"으로 분리하는 것이 장기적으로 덜 헷갈림.
- (현재 설계의 `spacing`이 gap+padding 통합이라면, 이를 분리하는 것이 가장 시급한 미세조정)

---

## 3. `interactive`의 깊이 (Interaction Depth)

`interactive={true}` 하나로는 부족한 경우가 생깁니다.

### 🔴 문제점
- **Focus Ring:** "클릭은 되지만 Focus Ring은 없어야 하는 경우" (예: 전체 행 클릭) vs "버튼처럼 명확한 Focus가 필요한 경우".
- **Cursor:** `pointer` vs `default`. 인터랙티브하지만 커서는 유지하고 싶을 때.
- **Role:** 의미론적으로 `button`인지 `a`(링크)인지 `div`(단순 js 클릭)인지 구분 불가.

### ✅ 미세조정 제안
`interactive`를 Boolean 대신 **Role 기반 String**으로 확장하거나, `role` prop과 연동.

```ts
// 변경 제안
type Interactive = boolean; // 기존 유지 (기본 button 동작)
type Role = 'button' | 'link' | 'checkbox' | 'tab'; // 추가

// 컴포넌트
<Box interactive role="link" href="/home">...</Box>
```
**미세조정:** `interactive` prop 자체는 유지하되, **내부적으로 `as` prop이나 `htmlProps`를 받을 수 있게 열어두어야 합니다. (`Box`에 `onClick`만 달지 말고 `tabIndex`, `onKeyDown` 자동 처리 필수)

---

## 4. `width` / `height`의 유연성 확보 (Controlled Flexibility)

`fill` (100%)과 `fit` (auto)만으로는 부족한 "중간 지점"이 있습니다.

### 🔴 문제점
- **Truncation (말줄임):** 텍스트가 너무 길 때 `width="fit"`이면 늘어나고, `width="fill"`이면 부모에 맞춥니다. 하지만 "최대 200px까지만 늘어나고 줄어들게(min-max)" 하려면?
- **Aspect Ratio:** 정사각형(`size`) 말고 16:9 비디오 비율 등을 잡으려면?

### ✅ 미세조정 제안
숫자를 직접 쓰는 것은 막더라도, **CSS Variable이나 style 객체 주입**은 열어둬야 합니다.
가장 깔끔한 것은 **`className` 대신 `style` prop을 1급 시민으로 인정**하는 것입니다.

```tsx
// 허용하되 가독성을 위해 style로 분리
<Box width="fill" style={{ maxWidth: '300px' }}>...</Box>
```
**정책:** "Layout에 영향을 주는 width/height px 값은 style prop으로 넘긴다"는 명시적 규칙 수립.

---

## 5. `radius`의 독립성 (Corner Control)

`edge` prop으로 radius를 0으로 만드는 로직은 좋지만, "원래 둥글어야 하는데 더 둥글게/덜 둥글게" 하고 싶을 때가 있습니다.

### ✅ 미세조정 제안
`radius` prop 추가 (Optional).
- `surface` 레벨에서 기본값이 있지만, 이를 오버라이드 가능하게.
- `radius="full"` (Pill shape 버튼), `radius="none"` (완전 사각형 카드) 등.
- **Top-tier use case:** Pill Button (`radius="full"`)은 매우 흔하므로 `Box` 레벨에서 지원해야 함.

---

## 🔍 최종 미세조정된 Props 제안 (Revamped Interface)

```ts
type BoxProps = {
  // ...기존 self props...
  
  // [Change 1] Placement 확장: 방향+정렬 명시
  placement?: 'center' | 'center-between' | 'start-center' | 'end-center' | 'stretch';
  
  // [Change 2] Spacing 분리: gap과 padding의 독립성 보장
  gap?: SpacingToken;      // 자식 사이 간격 (구 spacing)
  padding?: SpacingToken;  // 테두리 여백 (Surface 기본값 override 가능)
  
  // [Change 3] Radius 명시
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';

  // [Change 4] Interaction Role
  as?: 'div' | 'button' | 'a' | 'span';
  
  // ...나머지 surface, interactive 등...
}
```

**결론:** `spacing`을 `gap`과 `padding`으로 다시 쪼개는 것이 "단순함"을 약간 희생하더라도 "예측 가능성"을 훨씬 높여줍니다. 그리고 `placement` 키워드를 좀 더 Flexbox 패턴에 맞게 구체화하면 AI가 코드를 짤 때 실수를 덜 할 것입니다.

---

## 6. Ghost Surface의 Selected 상태 정의 (Visual Logic)

`surface="ghost"`는 평소에 투명하지만, `selected={true}`일 때의 동작이 모호할 수 있습니다. 이를 위한 명세가 필요합니다.

### 🔴 문제점 (Ambiguity)
- `ghost` 버튼이 선택되었을 때, `default`가 되어야 하는가? 아니면 `subtle`이 되어야 하는가? 아니면 `brand` 컬러를 써야 하는가?
- 만약 투명한 상태로 아이콘 색만 바뀐다면, 그것은 `surface`가 아니라 `text/icon`의 영역입니다.

### ✅ 디자인 명세 제안 (Refined Spec)
`ghost` 서피스는 **"상태가 활성화되면(Selected) 물질(Matter)이 된다"**는 규칙을 제안합니다.

| State | Appearance | Token Mapping (Example) | 비고 |
|:---:|:---|:---|:---|
| **Default** | 투명 (Invisible) | `bg-transparent` | 아이콘/텍스트만 보임 |
| **Hover** | 옅은 배경 (Subtle) | `bg-neutral-subtle-hover` | 마우스 올리면 영역 인지 |
| **Selected** | **짙은 배경 (Solid/Subtle)** | `bg-neutral-subtle-selected` | **"눌린 상태" 시각화 필수** |
| **Seld. + Hover** | 더 짙은 배경 | `bg-neutral-subtle-selected-hover` | 선택된 상태에서의 호버 |

- **동작 원칙:** `selected={true}`인 `ghost`는 더 이상 "유령"이 아닙니다. 시각적으로 공간을 점유해야 합니다.
- **Tone 연동:** `tone="brand"` + `selected` 시 Primary Color 배경(soft/subtle variant) 사용을 강제하여 "활성화됨"을 명확히 합니다.

**구현 레퍼런스:**
```tsx
// Ghost Selected 상태의 실제 렌더링
<Box surface="ghost" selected> 
  {/* 실제 렌더링 결과 미리보기 */}
  <div style={{ backgroundColor: 'var(--color-neutral-subtle-selected)' }} />
</Box>
```
이 규칙을 통해 "Ghost는 선택되면 Subtle이 된다"는 공식이 성립하며, 디자인 시스템의 예측 가능성이 높아집니다.
