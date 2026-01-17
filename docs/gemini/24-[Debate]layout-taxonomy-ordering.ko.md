# [Debate] Layout Taxonomy Ordering: Value-First vs. Intent-First

**Date:** 2026-01-17
**Context:** `Layout` 토큰의 명명 규칙(Ordering)이 AI와 사람에게 미치는 영향 분석.
**Current Standard:** `Value-First` (예: `Layout.Row.Gap12...Header`)
**Challenger:** `Intent-First` (예: `Layout.Header...Row.Gap12`)

---

## 🟥 Red Team (공격측): "Intent-First" 지지
**주장:** "목적(Intent)이 먼저 나와야 AI와 사람 모두에게 효율적이다."

### 1. AI Context & Hallucination Control
*   **Context Priming (맥락 프라이밍):** LLM은 앞에 나온 단어에 큰 영향을 받습니다. `Layout.Header`라고 시작하면, AI는 즉시 "아, 헤더를 만드는구나"라고 인지하고 그 뒤에 올 `Height`나 `Padding`을 헤더에 적합한 값으로 예측 확률을 보정합니다.
*   **Hallucination 감소:** `Layout.Row.Gap12...`로 시작하면, 이것이 카드의 Row인지, 리스트의 Row인지, 헤더의 Row인지 모호합니다. 이 모호함 속에서 AI는 엉뚱한 Variant를 선택할 확률이 미세하게 높아집니다.
*   **Token Probability:** `Layout.Header.Default`까지 나오면 그 뒤에 `Gap`이나 `Px`가 올 수 있는 경우의 수가 대폭 줄어듭니다.

### 2. Human Autocomplete (검색 효율성)
*   **Goal-Oriented Search:** 개발자는 "헤더를 만들어야지"라고 생각하고 타이핑을 시작합니다. `Layout.He...`를 치면 바로 관련 토큰이 필터링되어야 합니다.
*   **Current Friction:** 현재 방식에서는 "헤더를 만들어야지"라고 생각해도, `Layout.Row...`부터 시작해야 하므로 "헤더가 Row였나 Stack이었나?"를 먼저 고민해야 하는 인지 부하(Cognitive Load)가 발생합니다.

---

## 🟦 Blue Team (수비측): "Value-First" 지지 (Current)
**주장:** "구조(Structure)가 진실이고, 의도(Intent)는 껍데기다. 구조를 먼저 정의해야 재사용성이 높아진다."

### 1. WYSIWYG Code (보이는 대로 코딩)
*   **Visual Logic:** UI 개발은 시각적입니다. "가로로 배치하고(Row), 가운데 정렬하고(Center), 간격은 12px(Gap12)"이라는 사고 흐름이 자연스럽습니다.
*   **Structural Truth:** `Layout.Header`라고 썼는데 실제로는 `Gap0`이라면, 개발자는 `Gap`을 확인하기 위해 정의를 타고 들어가야 합니다. 하지만 `Layout.Row.Gap12`는 이름 자체가 스펙입니다.

### 2. AI "CoT" (Chain of Thought) 효과
*   **Step-by-Step Construction:** AI가 코드를 짤 때도 `Row` -> `Center` -> `Gap12` 순서로 추론(Reasoning)해 나가는 것이 물리적인 레이아웃을 구성하는 데 더 유리합니다. "헤더니까 Gap12"가 아니라, "이 요소들을 배치하려면 Gap12가 필요해 -> 결론적으로 이건 헤더네"라는 논리가 더 견고합니다.
*   **Handling Variants:** `Intent-First`로 가면 `Header.Generic`, `Header.TitleOnly`, `Header.WithSearch` 처럼 변종 이름짓기 지옥에 빠집니다. `Value-First`는 그냥 구조가 다르면 이름이 달라지므로 명확합니다.

---

## ⚖️ Cross-Examination (교차 검증) & Conclusion

### AI 관점에서의 승자: **Blue Team (Value-First)** 🏆
*   **이유:** 최신 LLM(Claude 3.5 Sonnet, GPT-4o)은 짧은 Context Window 내에서 강력한 추론 능력을 가집니다. `Intent`가 뒤에 있더라도 전체 토큰을 한 번에 처리하므로, `Intent-First`의 프라이밍 효과보다 **`Value-First`의 명시적 스펙(Explicit Spec)**이 Hallucination을 줄이는 데 더 효과적입니다.
*   AI에게 "헤더 만들어줘"라고 했을 때, AI는 학습된 데이터에서 "보통 헤더는 Gap16이지"라고 추측하는 것보다, **"사용 가능한 토큰 목록(`Layout.Row.Gap12...`) 중에서 물리적으로 가장 적합한 것"**을 고르는 것이 더 정확합니다.

### Human 관점에서의 승자: **무승부 (상황에 따라 다름)**
*   **숙련자:** 구조를 꿰뚫고 있으므로 `Value-First`가 빠릅니다. (Tailwind 방식)
*   **초보자:** "헤더"를 찾고 싶으므로 `Intent-First`가 편합니다. (Bootstrap 방식)

### 🚀 Final Verdict for MDK
**"Maintain Layout.Row... (Value-First) Order"**

**근거:**
1.  **Code as Documentation:** 토큰 이름이 곧 스펙 문서 역할을 하려면 수치가 앞에 와야 합니다.
2.  **Anti-Snowflake:** `Intent-First`는 비슷한 구조임에도 이름만 다른 토큰을 양산할 위험이 큽니다. `Value-First`는 구조가 같으면 토큰도 하나로 수렴합니다.
3.  **AI Compatibility:** AI는 '모호한 의도'보다 '명확한 제약조건(Constraint)'을 줄 때 더 잘 동작합니다. `Row.Gap12`는 강력한 제약조건입니다.
