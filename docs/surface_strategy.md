# Surface 전략과 UI에서의 "4색 정리" (4-Color Theorem)

## 1. 핵심 문제: "인접한 동일 영역"의 분리
현재 고민하고 계신 문제는 UI 토폴로지의 근본적인 질문입니다: **"배경색이 같은 두 영역(A와 B)을 어떻게 시각적으로 구분할 것인가?"**

**4색 정리(4-Color Theorem)**에 대한 직관은 매우 정확합니다. 하지만 UI 디자인에서는 이를 조금 다르게 적용합니다. 지도에서 영역을 구분하기 위해 4가지 색상이 필요하다면, UI에서는 **깊이 단계(Depth Layers)**가 그 역할을 합니다:

1.  **Sunken** (Level -1 / 배경, 움푹 들어간 곳)
2.  **Base** (Level 0 / 캔버스, 기본 면)
3.  **Raised** (Level 1 / 카드, 패널, 떠있는 요소)
4.  **Overlay** (Level 2 / 모달, 툴팁)

엄격한 레이어링 규칙만 지킨다면, 이 4가지 단계만으로도 충분합니다.

## 2. 현재 보유한 자원 (Inventory)
현재 `SurfaceToken` 세트는 이 지도를 완벽하게 커버하고 있습니다:

| 레벨 | 토큰 | 의미론적 역할 (Semantic Role) |
| :--- | :--- | :--- |
| **L-1** | `sunken` | 앱 배경, 슬롯, "비어있는 공간" |
| **L0** | `base` | 메인 캔버스, 기본 패널, 사이드바 |
| **L1** | `raised` | 분리된 패널, 카드, 팝오버 |
| **L2** | `overlay` | 툴팁, 모달, 플로팅 액션 |

*참고: `page`, `panel`, `card`는 위 토큰들의 별칭(Alias)으로 동작합니다.*

## 3. "Border"의 딜레마: Variant인가 Modifier인가?
질문하신 내용: *"Border Variant가 하나 있어야 할까?"*

### 권장 사항: `border`를 Surface Variant로 만들지 마십시오.
"테두리"를 `Surface`의 변형(예: `surface="outlined"`)으로 만드는 것은 함정입니다. 이는 **"바닥에 닿는 면(Surface)"**과 **"가장자리를 정의하는 선(Border)"**의 개념을 섞어버리기 때문입니다. 흰색 카드(Surface)에 회색 테두리(Border)가 필요한 경우처럼, 두 속성은 동시에 필요할 때가 많습니다.

만약 Border를 Surface Variant로 정의하게 되면, 배경색을 가질 수 없거나(투명 강제), 조합의 유연성을 잃게 됩니다.

### 해결책: Border는 "공간을 차지하지 않는 구분선(Zero-Space Separator)"
4색 문제에서 두 `빨간색` 영역이 맞닿아 있다면 경계선이 필요합니다. UI에서 두 개의 `Base` 패널이 맞닿을 때, 깔끔한 해결책은 딱 두 가지입니다:

#### 옵션 A: "Sunken Gap" (Modern / AiryStyle)
두 영역이 닿지 않게 합니다. 그 사이에 `sunken` 공간을 둡니다.
*   **구조**: `[Base Panel] -- gap (sunken) -- [Base Panel]`
*   **장점**: 매우 깔금하고, 위계가 명확하며, "카드(Card)" 느낌을 줍니다.
*   **단점**: 픽셀을 낭비합니다(Gap 만큼의 공간).

#### 옵션 B: "1px Hairline" (Dense / Productivity Style)
두 영역을 붙이되, 선을 긋습니다.
*   **구조**: `[Base Panel] -- 1px Border -- [Base Panel]`
*   **장점**: 공간 효율이 극대화됩니다(`SlideApp` 같은 도구에 적합), "IDE" 같은 느낌을 줍니다.
*   **단점**: 테두리 관리가 까다로울 수 있습니다(이중 테두리 방지 등).

## 4. `SlideApp.tsx` 적용 가이드 (심층 분석)
`SlideApp`과 같은 생산성 도구에서는 **밀도(Density)**가 생명입니다. 슬라이드 목록, 캔버스, 속성 패널 사이에 넓은 "Sunken Gap"을 두는 것은 공간 낭비일 수 있습니다. 타이트하게 붙여야 합니다.

**Border를 활용한 "4-Color" 논리 적용:**

1.  **App Container**: `surface="sunken"` (무한한 바닥).
2.  **Header**: `sunken` 위에 투명하게, 하지만 `border="bottom"`으로 구분.
3.  **Panels (좌/우)**: `surface="base"`.
    *   **구분**: `sunken` 위에 떠 있으니 자연스럽게 분리될까요?
    *   **아니요**, 보통 패널은 화면 끝까지 닿아 있습니다.
    *   **더 나은 패턴**: 고밀도 앱에서는 보통 **패널을 `surface="base"`**로, **중앙 작업 영역(캔버스)을 `surface="sunken"`**으로 둡니다.

### "SlideApp" 토폴로지 제안

```tsx
<Frame surface="base"> {/* 전체 앱 윈도우는 Base */}
  
  {/* 헤더: Base 위에 Border만 추가 */}
  <Frame border="bottom" h={Size.n44} />

  <Frame row flex>
    {/* 왼쪽 패널: Base + 오른쪽 Border */}
    <Frame w={Size.n240} border="right" />

    {/* 중앙 캔버스: SUNKEN (작업 영역은 더 깊이감 있게) */}
    <Frame surface="sunken" flex fill>
       {/* 슬라이드 용지 자체는 Base (책상 위의 종이) */}
       <Frame surface="base" shadow="md" />
    </Frame>

    {/* 오른쪽 패널: Base + 왼쪽 Border */}
    <Frame w={Size.n280} border="left" />
  </Frame>

</Frame>
```

**이 구조가 효과적인 이유:**
1.  **대비(Contrast)**: "작업물(Slide)"이 `sunken`(어두운/회색조) 배경 위의 `base`(밝은/흰색)로 놓이면서 확연히 눈에 띕니다(Pop).
2.  **패널(Panels)**: 작업 영역을 감싸는 형태로, `base` 레벨을 유지하여 안정감을 줍니다.
3.  **테두리(Borders)**: 크롬(Chrome) 간의 경계를 긋는 용도로만 사용됩니다.

## 5. (New) Interactive Surface: Input 전략
**"Input은 단순한 Surface가 아닙니다. 사용자와 대화하는 창입니다."**

Input에 대해서는 **"항상 Border가 있어야 한다"**는 의견에 전적으로 동의합니다. 이는 Input Field가 단순한 배경이 아니라, 사용자가 상호작용할 수 있는 명시적인 영역(Container)임을 정의하기 때문입니다.

### 5.1 The "Interact" State Model
단순히 Border의 유무를 넘어, **상태(State)**에 따라 Border와 Surface가 유기적으로 변해야 합니다.

| 상태 (State) | Surface (배경) | Border (테두리) | 의도 (Intent) |
| :--- | :--- | :--- | :--- |
| **Idle (기본)** | `Sunken` (연화이트/회색) | `Default` (연한 회색) | *"나는 입력 공간입니다. 여기에 존재합니다."* |
| **Hover (탐색)** | `Raised` or `Sunken` 유지 | `Hover` (약간 진한 회색) | *"나를 클릭할 수 있습니다."* (인식 강화) |
| **Focus (입력)** | `Base` (순수 화이트) | `Focus` (Primary/검정) | *"지금 나에게 입력 중입니다."* (가장 중요함) |
| **Active (클릭)** | `Base` | `Focus`와 동일 | Input은 보통 Focus와 Active가 동일합니다. |

### 5.2 왜 이 전략이 강력한가?
1.  **Idle = Sunken**: 기본적으로 Input은 주변(Card/Panel)보다 **움푹 들어간 홈**처럼 보여야 안정감을 줍니다.
2.  **Focus = Pop**: 입력 순간에는 `Sunken`에서 `Base`(순백색)로 튀어 나오면서(Pop), 마치 조명을 비춘 듯한 집중 효과를 줍니다.
3.  **Always Border**: 흰 배경 위에 흰 Input이 있을 때, Border는 생명선입니다. 하지만 `Sunken` 배경일 때도 Border는 **"정밀함(Precision)"**을 더해줍니다.

### 5.3 구현 가이드 (CSS Variables 제안)
```css
/* 기본 상태: 들어간 느낌 + 경계 */
--input-bg: var(--surface-sunken);
--input-border: var(--border-default);

/* 호버 상태: 경계만 강조 */
--input-bg-hover: var(--surface-sunken);
--input-border-hover: var(--border-darker);

/* 포커스 상태: 튀어나옴 + 명확한 경계 */
--input-bg-focus: var(--surface-base); /* 흰색으로 반전 */
--input-border-focus: var(--border-active); /* 브랜드 컬러 or 검정 */
```

## 6. 결론
*   **Surface 개수를 늘리지 마세요.** 4개(`sunken`, `base`, `raised`, `overlay`)면 충분합니다.
*   **"Border"를 Surface Variant로 만들지 마세요.** `border`, `borderTop`과 같이 원자적(Atomic) 속성으로 유지하세요.
*   **Input은 "Interactive Surface"입니다.** 항상 Border를 가지며, Idle(Sunken) -> Focus(Base)로 표면의 깊이가 변화하는 전략을 사용하세요.

**결과:** 주요 영역은 **깊이감(Sunken vs Base)**으로 분리하고, 인접한 동일 레벨 영역은 **선(Border)**으로 분리함으로써 4색 정리를 완벽하게 충족할 수 있습니다.
