# [Proposal] AI 에이전트를 위한 디자인 시스템 허점 보완 (Closing Design Gaps for Agents)

**작성일:** 2026-01-16
**목적:** "타입 안전성(1차 방어선)"은 구축되었으나, "디자인 의도(2차 방어선)"에서 발생하는 누락을 시스템적으로 방지하기 위함.

## 1. 핵심 문제: 의미론적 기대와 구현의 불일치 (Semantic Expectation Mismatch)

현재 시스템의 가장 큰 함정은 **"이름이 약속하는 것"**과 **"실제 제공하는 것"**의 차이입니다.

-   **Case A (성공):** `Layout.Row.Header`
    -   이름: "헤더" (컴포넌트)
    -   기대: 헤더다운 높이와 패딩이 있겠지?
    -   실제: `h: Size.n44`, `px: Space.n16` 포함.
    -   결과: AI가 추가 작업 없이 써도 "헤더"가 나옴.

-   **Case B (실패):** `Layout.Row.Item`
    -   이름: "아이템" (컴포넌트)
    -   기대: 아이템다운 클릭 영역(패딩)이 있겠지?
    -   실제: `gap: Space.n12` (배치 규칙)만 있음. 패딩 없음.
    -   결과: AI는 "시스템이 다 해주겠지"라고 믿고 사용했다가 "납작한 텍스트 줄"을 만듦.

=> **진단:** `Layout.Row.Item`이 **"Component Semantics(의미)"**를 표방하면서 **"Abstract Flow(추상 배치)"**만 제공하고 있는 것이 "함정(Trap)"입니다.

## 2. 해결 방안: 프리셋 책임의 명확화 (Standardizing Preset Responsibility)

AI가 실수하지 않게 하려면, **"의미론적 이름(Semantic Name)을 가진 프리셋은 반드시 물리적 실체(Body)를 가져야 한다"**는 규칙을 시스템에 심어야 합니다.

### 전략 1: 의미론적 프리셋의 '완전성(Completeness)' 강화

`Item`, `Card`, `Header`, `Toolbar` 등 **"구체적인 무언가"**를 지칭하는 프리셋은 반드시 최소한의 **Container Property(패딩, 최소 높이)** 를 포함해야 합니다.

-   **수정 제안 (`Layout.ts`):**
    ```typescript
    // Current
    Item: {
      Default: { row: true, align: "center", gap: Space.n12 }
    }

    // Proposed
    Item: {
      Default: {
          row: true,
          align: "center",
          gap: Space.n12,
          minHeight: Size.n40, // 터치 타겟 보장
          px: Space.n12        // 기본 호흡 보장
      }
    }
    ```

### 전략 2: 추상적 프리셋과 의미론적 프리셋의 분리

만약 `Layout`이 순수하게 "자식 배치"만 담당해야 한다면, 이름을 변경하여 AI의 기대를 낮춰야 합니다.

-   `Layout.Row.Item` -> `Layout.Row.StartAligned` (또는 `Layout.Flex.Row`)
-   이름이 추상적이면 AI는 "아, 이건 배치만 해주니까 패딩은 내가 잡아야지"라고 생각하게 됩니다.
-   하지만 MDK의 철학(Semantic System)상 **전략 1(완전성 강화)**이 더 적합합니다.

### 전략 3: 린트/타입 레벨의 가이드 (심화)

`interactive={true}`가 설정된 Frame인데 `minHeight`나 `p`(padding)가 충분하지 않으면 경고를 주는 시스템적 가드레일이 있다면 가장 이상적입니다. 
(하지만 이는 구현 비용이 높으므로, 전략 1이 가장 현실적이고 효과적인 대안입니다.)

## 3. 결론

"타입 강제"는 AI가 **"존재하지 않는 값"**을 쓰는 것을 막아줍니다.
이제 필요한 것은 AI가 **"필요한 값을 생략"**하는 것을 막는 것입니다.

이를 위해 **"프리셋이 이름값을 하도록(Be true to its name)"** 업데이트해야 합니다. 아이템은 아이템다워야 하고, 헤더는 헤더다워야 합니다. 시스템이 이 '기본값'을 쥐고 있으면, AI는 디자인 디테일을 챙기는 대신 구조 설계에 집중할 수 있게 되어 "알아서 잘 디자인"하는 목표에 도달할 수 있습니다.
