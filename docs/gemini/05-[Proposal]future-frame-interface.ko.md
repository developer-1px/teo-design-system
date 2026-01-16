# Frame 인터페이스의 미래 제안 (Future Proposal)

이 문서는 `Frame` 컴포넌트의 이상적인 최종 형태를 상상하며, **Surface(면), Layout(레이아웃), Sizing(크기), Behavior(동작)**의 4대 기둥으로 단순화된 인터페이스 모델들을 제안합니다.

이는 구현 계획이 아닌, 디자인 시스템의 방향성을 논의하기 위한 **개념 제안**입니다.

---

## 비전: 4대 핵심 기둥 (The 4 Pillars)
우리는 단순히 "속성들의 나열"이 아니라, 명확한 기능적 그룹으로 나아가야 합니다:
1.  **Surface (면)**: 시각적 요소 (배경, 테두리, 그림자, 불투명도).
2.  **Layout (배치)**: 자식 요소들의 배열 (Flex, Grid, 간격, 정렬).
3.  **Sizing (크기)**: 자신의 치수 (너비, 높이, 비율).
4.  **Behavior (동작)**: 인터랙션 및 메커니즘 (스크롤, 클릭, 호버, 애니메이션).

---

## 제안 A: "카테고리 객체" 인터페이스 (The Categorized Prop)
설정을 타입이 지정된 객체로 묶습니다. 루트 네임스페이스를 깔끔하게 유지하고 카테고리를 명시적으로 드러냅니다.

```tsx
// 현재 (Current)
<Frame row gap="n4" w="full" surface="card" />

// 제안 A (Proposal A)
<Frame
  layout={{ flow: "row", gap: "n4", align: "center" }}
  size={{ width: "full", height: "auto" }}
  surface={{ intent: "card", border: true }}
/>
```

### 장단점
*   ✅ **명시성**: 무엇이 레이아웃이고 무엇이 시각적인지 모호함이 없습니다.
*   ✅ **깔끔한 루트**: `style`이나 `override` 없이도 대부분의 속성을 안전하게 수용할 수 있습니다.
*   ✅ **확장성**: 새로운 레이아웃 기능을 추가해도 메인 컴포넌트 속성 목록이 지저분해지지 않습니다.
*   ❌ **작성량**: `layout={{ ... }}`은 `row gap="..."`보다 타이핑이 번거롭습니다.
*   ❌ **성능**: 렌더링마다 새로운 객체가 생성됩니다 (미미하지만 존재).

---

## 제안 B: "시맨틱 컴포넌트" 조합 (The Semantic Composition)
`Frame`을 전문화된 하위 컴포넌트로 분리합니다. `Frame`은 오직 컨테이너/배경 역할만 수행합니다.

```tsx
// 현재
<Frame row gap="n4" surface="card">...</Frame>

// 제안 B
<Frame variant="card">
  <Layout.Row gap="n4" align="center">
    <Content />
  </Layout.Row>
</Frame>
```

### 장단점
*   ✅ **가독성**: 코드가 문서 구조처럼 읽힙니다.
*   ✅ **관심사 분리**: `Frame`은 비주얼, `Layout.*`은 위치를 담당합니다.
*   ✅ **발견 가능성**: `<Layout.`을 치는 순간 레이아웃 관련 속성만 자동완성됩니다.
*   ❌ **중첩 지옥**: 단순한 UI를 그리기 위해 트리가 깊어질 수 있습니다.
*   ❌ **전환 비용**: 기존 JSX 구조를 대부분 다시 작성해야 합니다.

---

## 제안 C: "아토믹 프리셋" 인터페이스 (The Atomic Preset)
현재의 평면적(Flat) 속성 구조를 유지하되, 4대 기둥에 맞춰 네이밍과 타입을 엄격하게 정제합니다. 현재의 "Preset Props"가 진화할 **가장 현실적인 방향**입니다.

```tsx
// 현재
<Frame row gap="n4" surface="card" w="full" />

// 제안 C (표준화된 네이밍)
<Frame
  // 1. Layout (접두사 없이 직관적으로)
  flow="row" // 'row' boolean 대신 명확한 열거형?
  gap="n4"
  
  // 2. Sizing (단축형 유지)
  w="full"
  h="auto"

  // 3. Surface (프리셋 기반)
  layer="card" // 'surface' -> 'layer' (깊이감 표현)
  
  // 4. Behavior
  scroll="y"
  onClick={...}
/>
```

### 진화 전략
제안 C를 위해 타입을 명확히 정의합니다:
```ts
interface FrameProps extends LayoutProps, SizingProps, SurfaceProps, BehaviorProps {}
```
그리고 모호한 속성(숫자형 flex 등)을 점진적으로 deprecated 처리하고 명확한 속성으로 대체합니다.

---

## 제안 D: "변형(Variant) 우선" 접근
속성을 통한 커스텀을 극단적으로 줄이고, 모든 조합을 코드/설정의 **Variant**로 정의하게 합니다.

```tsx
// 제안 D
<Frame variant="card-row-padded" />

// design-system/variants.ts
const variants = {
  "card-row-padded": {
    surface: "card",
    layout: "row",
    gap: "n4",
    padding: "n4"
  }
}
```

### 장단점
*   ✅ **절대적 일관성**: "Snowflake" (눈송이처럼 제각각인) 디자인이 불가능합니다.
*   ❌ **개발 피로도**: 작은 수정 하나를 위해 파일을 열어 변형을 정의해야 합니다.
*   ❌ **이름 짓기**: `card-row-padded-large-gap` 같은 이름 짓기 지옥이 열립니다.

---

## 권장사항 (Recommendation)
**제안 C (아토믹 프리셋)**를 기본으로 하되, **A의 명확성**을 차용합니다.

1.  **DX(개발 경험)**를 위해 속성은 Flat 구조를 유지합니다.
2.  **내부적**으로는 4대 기둥(Surface, Layout, Sizing, Behavior)으로 코드를 엄격히 분리합니다.
3.  `FrameProps` = `SurfaceProps & LayoutProps & SizingProps` 형태로 타입을 구성하여 IDE에서 그룹화되어 보이게 합니다.
4.  복잡한 레이아웃을 위해 `layout={{ ... }}`을 **선택적 대안**으로 도입할 수도 있습니다 (하이브리드).
