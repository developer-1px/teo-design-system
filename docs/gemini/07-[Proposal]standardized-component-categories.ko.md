# 표준화된 컴포넌트 분류 (Standardized Component Categorization)

이 제안서는 `Frame` 인터페이스를 **유니버설 디자인 이론 (CSS Box Model)**과 **업계 표준 (Figma Auto Layout)**에 기반하여 재분류합니다.
목표는 추상성을 제거하고, 각 카테고리가 브라우저 렌더링 방식과 직관적으로 매핑되도록 하는 것입니다.

---

## 분류 체계: "Box, Layout, Paint"
브라우저 렌더링 엔진 및 모던 디자인 툴(Figma)의 멘탈 모델과 일치시킵니다.

### 1. Layout (레이아웃 / 배치)
*   **업계 표준**: Figma "Auto Layout", CSS "Flexbox/Grid".
*   **정의**: 컨테이너가 **자식 요소들을 어떻게 배열**할지 결정합니다. '안쪽'을 향한 설정입니다.
*   **키워드**: `방향(Direction)`, `간격(Gap)`, `분배(Distribution/Justify)`, `정렬(Align)`, `패딩(Padding)`.
    *   *참고: Figma에서는 패딩을 Auto Layout의 속성으로 봅니다.*
*   **CSS 매핑**: `display`, `flex-direction`, `gap`, `justify-content`, `align-items`, `padding`.
*   **질문**: "내용물이 안에서 어떻게 흐르는가?"

### 2. Sizing (사이징 / 크기)
*   **업계 표준**: Figma "Resizing" (Hug/Fill/Fixed), CSS Box Sizing.
*   **정의**: 컨테이너가 **부모 내에서 얼마나 공간을 차지**할지 결정합니다. '바깥'을 향한 설정입니다.
*   **키워드**: `너비(Width)`, `높이(Height)`, `최소/최대(Min/Max)`, `비율(Aspect Ratio)`, `수축/팽창(Shrink/Grow)`.
*   **CSS 매핑**: `width`, `height`, `min-width`, `flex-basis`, `flex-grow`, `aspect-ratio`.
*   **질문**: "나는 얼마나 큰 공간을 차지하는가?"

### 3. Appearance (어피어런스 / 외관)
*   **업계 표준**: Figma "Appearance" / "Fill & Stroke", CSS "Decoration".
*   **정의**: 레이아웃 흐름에 영향을 주지 않는 **시각적 장식**입니다.
*   **키워드**: `채우기(Fill/Background)`, `선(Stroke/Border)`, `반경(Radius)`, `효과(Effects/Shadow/Opacity)`.
*   **CSS 매핑**: `background-color`, `border`, `border-radius`, `box-shadow`, `opacity`.
*   **질문**: "나는 어떻게 보이는가?"

### 4. Positioning (위임됨 / Delegated)
*   **상태**: **Frame에서 제거됨 (Removed)**
*   **담당**: `Overlay`, `Absolute` 등 별도의 위치 제어 컴포넌트.
*   **이유**: `Frame`은 흐름(Layout)과 실체(Appearance)에 집중해야 합니다. 포지셔닝은 "뷰포트/부모 대비 나의 위치"를 결정하는 상위 레벨의 관심사이며, 종종 Portal이나 Z-Context 관리가 필요합니다.
*   **예외**: `Overlay`의 앵커 역할을 위해 `relative`는 필요할 수 있으나, `absolute`/`fixed`/`z-index`는 외부로 위임합니다.

---

## 이전 용어와의 비교 (Comparison)

| 이전 (임의적) | **신규 (표준화)** | 변경 근거 |
| :--- | :--- | :--- |
| **Surface** | **Appearance** | "Surface"는 추상적입니다. "Appearance" 또는 "Decoration"이 시각적 스타일을 뜻하는 표준 용어입니다. |
| **Layout** | **Layout** | 유지. Figma Auto Layout 및 Flexbox와 완벽히 일치합니다. |
| **Sizing** | **Sizing** | 유지. 치수(Dimensions)를 뜻하는 표준 용어입니다. |
| **Behavior** | *(삭제/분해)* | "Behavior"는 모호합니다. 스크롤은 `Layout(overflow)`으로, 클릭은 이벤트로 이동합니다. |

---

## API 적용 예시 (Example)

```tsx
<Frame
  // 1. Layout (내부 흐름 제어)
  flow="row"         // flex-direction
  gap="n4"           // gap
  align="center"     // align-items (교차 축)
  distribute="start" // justify-content (주 축)
  padding="n4"       // padding (레이아웃 컨텍스트의 일부)

  // 2. Sizing (외부 크기 제어)
  width="fill"       // width: 100% / flex-grow: 1
  height="hug"       // height: auto
  
  // 3. Appearance (시각적 장식)
  fill="card"        // background-color token
  stroke="default"   // border token
  radius="n2"        // border-radius
  
  // 4. Positioning -> <Overlay />로 이동됨
  // z="n10"
/>
```

## 아키텍처: Frame vs Overlay
*   **Frame**: "몸체 (Body)". 내부 내용물과 외관을 담당합니다.
*   **Overlay**: "유령 (Ghost)". 몸체가 어디에 *뜨고* 어떻게 *겹칠지*를 담당합니다.
