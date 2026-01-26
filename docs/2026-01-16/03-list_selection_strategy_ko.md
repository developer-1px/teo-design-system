# 제안: 리스트 선택 시각화 전략 (Border vs. Block)

## 1. 맥락 및 문제점 (Context & Problem)
현재 `MailList` 컴포넌트는 선택 상태를 나타내기 위해 4면 Border와 Surface 변경(Sunken/Raised)을 모두 사용하고 있습니다.
*   **현재 상태**: 상자(Boxy) 느낌이 강하여 플랫한 리스트 미학과는 거리가 있습니다.
*   **사용자 선호**: **위/아래만 Border**가 있는 더 깔끔한 룩을 선호합니다.
*   **난제**: 가로 Border만 사용할 경우, 단순히 리스트를 구분하는 **"구분선(Separator)"**인지, 상태를 나타내는 **"선택 강조(Selection Highlight)"**인지 구별하기 어려워집니다.

## 2. 핵심 딜레마: "선형 vs. 공간형" (Linear vs. Spatial)
디자인의 근본적인 질문은 선택된 아이템이 **선형 리스트(Linear List)**의 일부로 남을 것인가, 아니면 별도의 **공간적 객체(Spatial Object)**가 될 것인가 하는 점입니다.

### Type A: "선형" 선택 (Separator-Based)
아이템은 평평(Flat)하게 유지됩니다. 선택은 이미 존재하는 경계(구분선)를 변형하여 표시합니다.

*   **시각적 표현**: 구분선(border-bottom)의 색상이나 두께가 변하거나, 배경 틴트가 살짝 바뀝니다.
*   **장점**: 매우 깔끔하고, 밀도(Density)가 높으며, 네이티브 느낌(macOS Finder 리스트 뷰)을 줍니다.
*   **단점**: 어포던스(행동 유도성)가 낮습니다. 활성/비활성 포커스를 구분하기 어렵습니다.
*   **적합한 곳**: 데이터가 많은 테이블, 엄격한 선형 로그.

```
[ Item 1 ] -- border-bottom: gray
[ Item 2 ] -- border-bottom: BLUE (Selected)
[ Item 3 ] -- border-bottom: gray
```

### Type B: "공간형" 선택 (Card-Based / Block)
선택된 아이템이 리스트 흐름에서 분리되어 하나의 "카드"가 됩니다.

*   **시각적 표현**: 4면 Border, 둥근 모서리, 그림자(Raised) 또는 내부 음영(Sunken). (현재 구현 방식)
*   **장점**: 구분이 명확하고, "객체(Object)"로서의 느낌이 강합니다.
*   **단점**: 시각적 리듬을 깹니다. "시각적 소음"(간격, 모서리 등)이 추가됩니다.
*   **적합한 곳**: 카드 리스트, 칸반, 밀도가 낮은 리스트.

### Type C: "하이브리드" 선택 (Inset / Marker)
**Minimal Design Kit**의 프리미엄 감성에 가장 부합하는 방향입니다.

## 3. 제안된 솔루션 (Proposed Solutions)

### 옵션 1: "내부 면(Inset Face)" 방식 (Mail 앱 추천)
외부 컨테이너는 선형(전체 너비)을 유지하되, *내부 컨텐츠 면*을 선택 영역으로 처리합니다.

*   **구조**: `<li>`는 전체 너비를 차지하며 단순 구분선을 가집니다. 내부 컨텐츠는 패딩을 가집니다.
*   **선택 표현**:
    *   **Border**: 위/아래만 적용하되, 양옆 끝까지 닿지 않고 살짝 **안쪽으로 들어감(Inset)**.
    *   **Marker**: 왼쪽에 강한 수직 바(Accent Color) 추가.
*   **이유**: 완전히 상자에 가두지 않으면서도 '블록'임을 정의할 수 있습니다.

### 옵션 2: "시네마 모드" (Focus)
선택된 아이템을 상자에 가두는 대신, **나머지를 흐리게** 만듭니다.

*   **선택 표현**: `Surface: Base` (White), `Z-Index: 1`, `Shadow: sm`.
*   **나머지**: `Opacity: 0.6` 또는 `Surface: Transparent`.
*   **Border**: 선택 시 Border를 제거하고 그림자/Elevation에 의존합니다.

### 옵션 3: "분할 Border" (사용자 요청에 대한 기술적 해법)
사용자가 "위/아래만 구분"을 원하면서도 "블록" 느낌을 우려한 점을 반영했습니다.

*   **아이디어**:
    *   **기본(Idle)**: 1px 하단 Border (Separator).
    *   **선택(Selected)**:
        *   **상단 Border**: 1px Solid Accent (또는 진한 회색).
        *   **하단 Border**: 1px Solid Accent.
        *   **좌/우**: 열어둠 (Transparent).
        *   **배경**: 아주 미세한 틴트 (Sunken).
*   **효과**: 꽉 막힌 "상자"가 아니라, 위아래가 뚫린 "열린 소매(Open Sleeve)" 같은 느낌을 줍니다.

## 4. 구현 전략 (추후 과제)
리스트 아이템에 `border-left` / `border-right`는 구현하지 않는 것을 권장합니다.

1.  **MailList 구현**:
    *   기본: `border-bottom: 1px solid var(--border-color)` (구분선).
    *   선택됨:
        *   `background: var(--surface-sunken)` (미세한 강조).
        *   `border-top: 1px solid var(--border-darker)`.
        *   `border-bottom: 1px solid var(--border-darker)`.
        *   **중요**: 이중 테두리를 방지하기 위해 *이전 아이템*의 구분선을 숨겨야 합니다.

2.  **디자인 시스템 업데이트**:
    *   리스트에서 선택된 아이템의 Border가 구분선 위에 그려지도록 "Border 겹침(Collapsing Borders)" 메커니즘이나 "Z-Index 관리"가 필요합니다.
