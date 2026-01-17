# [Debate] Syntax for AI Learning: Nested Objects vs. Alternatives

**Date:** 2026-01-17
**Topic:** **"Type Constraint as a Hallucination Guardrail"** 전략을 위한 최적의 구문 구조(Syntax) 분석.
**Premise:** 우리는 AI가 코드를 생성하고 -> 타입 에러를 만나면 -> 스스로 값을 수정하며 학습(Self-Correction)하는 루프를 전제합니다.
**Question:** 이 루프를 위해 `Layout.Row.Gap12...` 같은 **Nested Object** 방식이 필수적인가? 아니면 더 AI 친화적인 대안이 있는가?

---

## 🟥 Red Team (공격측): "Flat String/Atomic이 AI에게 더 직관적이다"
**주장:** "Nested Object는 과도한 깊이(Depth)로 인해 AI에게 불필요한 인지 부하를 주고, 에러 메시지도 복잡하다. Flat한 구조가 확률론적 예측에 더 유리하다."

### 1. Alternative Proposal: `Template Literal Types` (Tailwind-like)
*   **Syntax:** `layout="row center gap-12 px-16"`
*   **Argument:**
    *   **Token Efficiency:** `Layout.Row.Center.Gap12...` vs `"row center gap-12"`. 토큰 소모량이 1/3 수준입니다. LLM의 Context Window를 아낄 수 있습니다.
    *   **Prediction Model:** LLM은 본질적으로 "다음 단어 예측기"입니다. Tailwind CSS처럼 Flat한 문자열의 조합을 예측하는 데 매우 특화되어 있습니다. 계층 구조를 타고 내려가는 것보다, 빈도수 높은 단어들의 조합(`row` 옆엔 `center`가 잘 오더라)을 더 잘 맞춥니다.

### 2. Error Feedback Quality
*   **Red Team's View:** `layout="row gap-99"`라고 썼을 때, TS 에러는 `"Type 'gap-99' is not assignable to type 'gap-4 | gap-8 | ...'"`라고 뜹니다. AI는 이 목록을 보고 "아, 99는 없고 12가 있네"라고 바로 수정(Correction)할 수 있습니다. 굳이 객체 탐색을 할 필요가 없습니다.

---

## 🟦 Blue Team (수비측): "Nested Object는 AI를 위한 'Decision Tree'다"
**주장:** "단순한 자동완성이 아니라, **'논리적 제약(Logical Constraint)'**을 통해 환각을 원천 차단하려면 계층 구조가 필수적이다."

### 1. The "Narrowing" Effect (범위 좁히기)
*   **Argument:** `Layout.Row`를 선택하는 순간, AI가 선택할 수 있는 다음 토큰의 우주(Universe)가 절반으로 줄어듭니다.
    *   Flat String 판에서는 `gap-12`가 `row`에도 붙고 `column`에도 붙을 수 있지만, Nested Object에서는 `Layout.Page` 하위에는 `Gap`이 없을 수도 있습니다(예: `Page`는 `Gap` 대신 `Padding`만 허용).
    *   **Nested Object는 문법 수준에서 "유효하지 않은 조합"을 원천 봉쇄**합니다. `Layout.Page.Gap12`가 타입 정의에 없다면, AI는 애초에 그 경로로 진입할 수 없습니다.

### 2. Error Message as a "Pathfinder"
*   **Blue Team's View:** AI 학습 루프에서 가장 중요한 것은 **"내가 어디서 틀렸는지"**를 아는 것입니다.
    *   **Flat String Error:** 전체 문자열 중 어느 부분이 틀렸는지 파싱해야 합니다. (복합적인 에러일 경우 난해함)
    *   **Nested Object Error:** `Property 'Gap12' does not exist on type '...Row...'`. 아주 명확합니다. "Row 단계까지는 맞았는데, 그 다음 Gap에서 틀렸구나."
    *   이것은 AI에게 **Checkpoint** 역할을 합니다. AI는 `Layout.Row`까지는 유지하고, 그 뒷부분만 다시 탐색하면 됩니다.

---

## ⚖️ Synthesis & Verdict (종합 판결)

### AI의 "Self-Correction Loop" 관점에서의 승자: **Blue Team (Nested Object)** 🏆

**이유:** 사용자가 제시한 전제(**"에러가 났을 때 값을 찾으러 가고 학습을 한다"**)에 가장 부합하는 구조는 **"탐색 가능한 트리(Navigable Tree)"** 구조입니다.

1.  **Guided Exploration (유도된 탐색):**
    *   AI가 `Layout.`을 찍었을 때, `Row`, `Stack`, `Page`라는 1차 관문이 나옵니다.
    *   `Row.`를 찍으면 `Gap`, `Align`이라는 2차 관문이 나옵니다.
    *   이 과정은 AI에게 **"단계별 힌트(Chain of Thought)"**를 강제하는 효과가 있습니다. Flat String은 한번에 정답을 맞춰야 하는(Zero-shot) 부담이 있지만, Nested Object는 단계별로 정답을 찾아가는(Step-by-step) 과정입니다.

2.  **Explicit Constraints (명시적 제약):**
    *   Flat String 방식(`row gap-12`)은 "Row이면서 Gap이 없는" 컴포넌트를 정의하기 어렵습니다(타입이 복잡해짐).
    *   Nested Object는 `Layout.SplitPane` 객체 내부에 `Gap` 속성을 정의하지 않음으로써, AI가 실수로 `Gap`을 넣으려 할 때 **"여기서는 Gap을 쓸 수 없어"**라고 명확히(Compiler Error) 알려줄 수 있습니다.

### 🚀 Recommendation for MDK
**"Stick to Nested Objects for AI Safety"**

사람에게는 타이핑이 조금 번거로울 수 있으나(Verbose), **AI에게는 이 계층 구조가 "안전 가이드레일"이자 "학습 지도"**가 됩니다. AI가 에러를 통해 스스로 궤도를 수정(Self-Correction)하기에는 **결과값(String)보다 경로(Path)를 알려주는 Object 방식**이 훨씬 유리합니다.
