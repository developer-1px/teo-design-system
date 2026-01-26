# Frame 속성 위계 (Frame Prop Hierarchy)

디자인의 일관성을 유지하면서도 필요한 유연성을 제공하기 위해, `Frame` 속성에 대해 명확한 3단계 위계를 정의합니다.

## 위계 구조 (The Hierarchy)

1.  **제한된 스타일 (Restricted Style)** (최상위 우선순위, "비상탈출구")
2.  **오버라이드 (Overrides)** (중간 우선순위, "1-Tier 토큰 정밀 조정")
3.  **Preset Props (프리셋 속성)** (기본 우선순위, "2-Tier 시맨틱 디자인")

---

### 1. 제한된 스타일 `style={{ ... }}`
*   **역할**: "비상탈출구 (Escape Hatch)".
*   **사용처**: 디자인 시스템에서 다루지 **않는** CSS 속성(예: `transform`, `filter`, `perspective`)이나 **동적 데이터 기반 값**(예: `backgroundColor: user.color`)을 사용할 때 씁니다.
*   **제약 (Restriction)**: 
    *   **차단됨 (Blocked)**: 레이아웃 및 여백 (`width`, `height`, `margin`, `padding`, `gap`, `zIndex`). 이들은 시스템의 수치적 무결성(Numeric Integrity)을 해칩니다.
    *   **허용됨 (Allowed)**: 페인트, 인터랙션, 키워드 (`color`, `cursor`, `flex`, `grid`). 표준 CSS 키워드를 사용하는 속성들은 시스템을 해치지 않으므로 허용됩니다.
*   **우선순위**: 가장 높음 (모든 것을 덮어씀).

### 2. 오버라이드 `override={{ ... }}`
*   **역할**: **"토큰 기반 정밀 조정 (Token-Strict Tweaks)"**.
*   **사용처**: "Strict Props"가 제공하는 프리셋에서 벗어나고 싶지만, 여전히 디자인 시스템(토큰) 안에 머물고 싶을 때 사용합니다.
*   **제약**: **오직 1-Tier 토큰만 사용 가능**. 임의의 값을 사용하지 마세요.
    *   *Correct*: `override={{ w: Size.n320 }}`
    *   *Incorrect*: `override={{ w: "33px" }}` (정말 필요하다면 `style`을 사용하세요)
*   **우선순위**: Preset Props를 덮어씁니다.

### 3. Preset Props (최상위 속성) `...`
*   **역할**: **"2-Tier 시맨틱 디자인 (2-Tier Semantic Design)"**.
*   **정의**: 3가지 디자인 요소 **면(Surface), 선(Border), 간격(Spacing)**을 기반으로 한 설정들.
*   **사용처**: UI 레이아웃의 표준. 여러 1-Tier 토큰을 조합하거나 특정 디자인 로직이 적용된 단순화된 인터페이스입니다.
*   **미래 방향**: `surface`, `layout`, `sizing`, `behavior` 등으로 단순화될 예정이며, 하위 호환성을 유지하며 점진적으로 마이그레이션합니다.
*   **예시**: `gap`, `row`, `pack`, `fill`, `border`, `rounded`.
*   **우선순위**: 기본 레벨.

---

## 의도 (Why?)
우리는 개발자가 **Preset Props** (2-Tier)를 기본으로 사용하도록 **유도**합니다.
- 표준 레이아웃(면, 선, 간격)은 **Preset Props**로 빠르고 안전하게 작성합니다.
- 디테일한 토큰 조정이 필요할 때만 **Overrides** (1-Tier)를 사용합니다.
- Raw CSS나 동적 값이 필요할 때만 **Restricted Style**을 사용합니다.
