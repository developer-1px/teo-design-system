# AI-Priority Layout Methodology: "Structural Contract" Proposal (AI 우선 레이아웃 방법론: "구조적 계약" 제안)

## 1. 서론: AI 컨텍스트 문제 (Introduction)

현재 디자인 시스템은 **시맨틱 네이밍(Semantic Naming)** (예: `Layout.Row.Header.Default`)을 사용하여 인간의 가독성과 "의도"를 우선시합니다. 이는 유지보수에는 훌륭하지만, AI 보조 코딩에는 다음과 같은 문제를 야기합니다.

1.  **블랙박스 모호성:** AI는 `Layout.Row.Header` 내부의 값을 볼 수 없습니다. 패딩, 높이, 간격을 추측하거나 환각(hallucination)을 일으킬 수 있습니다.
2.  **컨텍스트 낭비:** AI가 특정 디자인에 맞는 레이아웃인지 알기 위해 정의 파일을 찾아보아야 하므로 토큰을 낭비합니다.
3.  **조합의 경직성:** 디자인 변형(예: "헤더인데 패딩 20px")이 생기면 새로운 시맨틱 이름을 만들거나(API 비대화), `override`를 사용해야 합니다(엄격함 훼손).

사용자는 시각적 사실을 이름에 포함하는 **설명적 "Atomic" 네이밍 규칙**(예: `Layout.Row.start.gap4.px16.h40`)을 제안했습니다.

이 문서는 이 제안에 대한 **"레드팀 vs 블루팀"** 분석과 구현을 위한 합의된 방법론을 다룹니다.

---

## 2. 레드팀 vs 블루팀 분석 (Red Team vs. Blue Team)

### 🔴 레드팀 (회의론자 / 인간 중심)
> "우리는 의미를 버리고 JS로 포장된 유틸리티 클래스로 돌아가는 것입니까?"

*   **의도의 상실:** `Layout.Stack.gap12.p24`는 이것이 *무엇*인지는 말해주지만 *왜* 존재하는지는 말해주지 않습니다. `Layout.Section.Main`은 이것이 메인 섹션임을 명확히 합니다.
*   **유지보수의 악몽:** 모든 "카드"의 간격을 `12px`에서 `16px`로 바꾸고 싶다면:
    *   *시맨틱:* `Layout.Grid.Cards.Default`만 수정하면 끝.
    *   *Atomic:* 500개 파일에서 `Layout.Grid.gap12`를 찾아 `Layout.Grid.gap16`으로 일일이 변경해야 함.
*   **API 비대화:** 정렬, 간격, 패딩의 조합은 수천 가지입니다. `Layout.Row.Start.Gap4...`와 같은 객체 그래프를 만들면 `Layout.ts` 파일이 감당할 수 없이 커집니다.
*   **가독성 저하:** `Layout.Row.Start.Gap4.Px16.MinH40`은 `Layout.Row.Item`보다 읽기 어렵습니다.

### 🔵 블루팀 (혁신가 / AI 중심)
> "시맨틱 이름은 AI에게 숨겨진 의존성입니다."

*   **명시적 계약:** `Layout.Row.gap12`는 12px 간격을 보장합니다. AI는 정의를 찾아볼 필요가 없습니다. 이름 자체에서 규칙을 봅니다.
*   **환각 감소:** AI는 시맨틱 토큰을 신뢰하지 못해 스타일을 덮어쓰는 경우가 많습니다. Atomic 토큰을 사용하면 제약 조건이 눈에 보입니다.
*   **WYSIWYG:** 말하는 그대로 얻습니다. 시맨틱 토큰이 완벽하게 맞지 않아 개발자(또는 AI)가 인라인 스타일을 추가하는 "Override 함정"을 줄입니다.
*   **유연한 엄격함:** 우리는 *디자인 시스템 토큰*(`Gap4`, `Gap8` 등)으로 선택지를 제한하되, 자유로운 조합을 허용합니다. 이것은 엄격한 토큰과 유연한 적용 사이의 "중용(Goldilocks zone)"입니다.

---

## 3. 심층 분석: "접미사 태깅 전략 (Suffix Tagging)" - 추가 검토

사용자가 제안한 **`Layout.Grid.2x2.gap10.Bento`** 패턴(구조 + 의미)에 대한 분석입니다.

### 3.1. 개념 (The Best of Both Worlds?)
이 패턴은 **[구조적 진실]** + **[의도적 의미]**를 결합합니다.
*   **Prefix (`Layout.Grid.2x2.gap10`)**: AI가 시각적 구조를 이해하는 데 필요한 "물리적 사실"을 제공합니다. (블루팀 만족)
*   **Suffix (`.Bento`)**: 인간이 이 레이아웃의 사용 목적을 이해하는 데 필요한 "맥락"을 제공합니다. (레드팀 만족)

### 3.2. 장점 (Pros)
1.  **필터링 효과:** 개발자(또는 AI)가 레이아웃을 고를 때, 먼저 구조(2x2, gap10)로 범위를 좁히고, 마지막에 의도(Bento, Gallery)를 선택하게 합니다. 이는 "아무거나 골라 쓰는" 실수를 방지합니다.
2.  **자기 문서화 (Self-Documenting):** 코드만 봐도 "아, 이건 10px 간격의 2x2 그리드인데, 벤토(Bento) 스타일로 쓰이는구나"를 알 수 있습니다.
3.  **검색 용이성:** `Layout...Bento`로 검색하면 Bento 스타일이 쓰인 곳을 찾을 수 있고, `Layout.Grid.2x2`로 검색하면 구조를 찾을 수 있습니다.

### 3.3. 단점 및 해결책 (Cons & Mitigations)
*   **API 깊이 문제:** `Layout.Grid.2x2.gap10`이 값을 가지면서 동시에 `.Bento`라는 하위 속성을 가질 수는 없습니다. (JS 객체 구조 한계)
    *   **해결책:** **"Mandatory Suffix Rule"**. 모든 Atomic 체인은 반드시 의미론적 접미사(Suffix)로 끝나야 합니다.
    *   `Layout.row.gap4` (❌ 불가)
    *   `Layout.row.gap4.Default` (✅ 가능 - 일반적인 경우)
    *   `Layout.row.gap4.Dense` (✅ 가능 - 좁은 경우)

### 3.4. 결론: "Mandatory Suffix" 채택 권장
이 방식은 AI가 **구조를 먼저 선택**하고 **의도를 나중에 확인**하게 하므로, 환각을 방지하면서도 유지보수성을 확보하는 강력한 전략입니다.

---

## 4. 합의: "구조적 접미사 시스템 (Structured Suffix System)"

우리는 최종적으로 **Atomic 구조 + Semantic 접미사** 시스템을 제안합니다.

**구문:** `Layout.<Type>.<Structure>.<Gap>.<Intent>`

*   **Type:** `Row` | `Stack` | `Grid`
*   **Structure:**
    *   Row/Stack: `Start` | `Center` | `Space`
    *   Grid: `Cols2` | `Cols3` | `Auto` (2x2 대신 TS 변수명 규칙 준수)
*   **Gap:** `Gap0` | `Gap4` | `Gap8` ...
*   **Intent (Suffix):** `Default`, `Bento`, `Card`, `Form` ...

#### 사용 예시

```tsx
// 1. 일반적인 2단 그리드 (구조 + 기본)
<Frame layout={Layout.Grid.Cols2.Gap20.Default}>

// 2. 벤토 스타일 그리드 (구조 + 의미)
<Frame layout={Layout.Grid.Cols3.Gap12.Bento}>

// 3. 헤더 (구조 + 의미)
<Frame layout={Layout.Row.Space.Gap16.Header}>
```

---

## 5. 구현 계획

1.  **Suffix 매트릭스 정의:** 각 구조별로 허용할 Suffix(`Default`, `Header`, `Bento` 등)를 정의합니다. 대부분은 `Default`가 될 것입니다.
2.  **Layout.ts 리팩토링:**
    *   기존: `Layout.Grid.Cards...`
    *   변경: `Layout.Grid.ColsAuto.Gap12.Cards`
3.  **AI 가이드:** "항상 `Structure`를 먼저 맞추고, 가장 적절한 `Suffix`를 선택하라. 없을 경우 `Default`를 사용하라."

이 방식은 사용자가 제안한 `.Bento` 예시를 시스템 전체의 규칙으로 확장한 것으로, **가장 완성도 높은 타협안**입니다.

---
---

# AI-First Layout Methodology: The "Structural Contract" Proposal (English Version)

## 1. Introduction: The AI Context Problem

The current Design System uses **Semantic Naming** (e.g., `Layout.Row.Header.Default`), which prioritizes human readability and "intent." While excellent for human maintenance, this approach presents significant challenges for AI-assisted coding:

1.  **Black Box Ambiguity:** AI cannot "see" the values inside `Layout.Row.Header`. It has to guess or hallucinate the padding, height, and gap.
2.  **Context Window Inefficiency:** To know if `Layout.Row.Header` fits a specific design, the AI must retrieve the definition file, wasting context tokens.
3.  **Combinatorial Stiffness:** Design variations (e.g., "Header but with 20px padding") require either creating a new semantic name (bloating the API) or using `override` (breaking strictness).

The User has proposed a **Descriptive "Atomic" Naming Convention** (e.g., `Layout.Row.start.gap4.px16.h40`) which embeds visual reality into the name itself.

This document serves as a "Red Team vs. Blue Team" analysis of this proposal and offers a synthesized methodology for implementation.

---

## 2. Red Team vs. Blue Team Analysis

### 🔴 Red Team (The Skeptics / Human-Centric)
> "We are abandoning meaning for utility classes wrapped in JS."

*   **Loss of Intent:** `Layout.Stack.gap12.p24` tells me *what* it is, but not *why* it exists. `Layout.Section.Main` tells me it's a main section.
*   **Maintenance Nightmare:** If we want to update the spacing of all "Cards" from `12px` to `16px`:
    *   *Semantic:* Update `Layout.Grid.Cards.Default`. Done.
    *   *Atomic:* Find and replace `Layout.Grid.gap12` with `Layout.Grid.gap16` across 500 files.
*   **API Bloat:** There are thousands of permutations of alignment, gap, padding, and size. Creating an object graph `Layout.Row.Start.Gap4...` leads to a massive, unmanageable `Layout.ts` file.
*   **Verbosity:** `Layout.Row.Start.Gap4.Px16.MinH40` is harder to read than `Layout.Row.Item`.

### 🔵 Blue Team (The Innovators / AI-Centric)
> "Semantic names are a dependency hidden from the AI."

*   **Explicit Contract:** `Layout.Row.gap12` guarantees a 12px gap. The AI doesn't need to look up a definition. It sees the rule in the name.
*   **Reduced Hallucination:** AI often hallucinates overriding styles because it doesn't trust the semantic token. With atomic tokens, the constraints are visible.
*   **WYSIWYG:** What You Say Is What You Get. This reduces the "Override Trap" where developers (or AI) add inline styles because the semantic token didn't perfectly match.
*   **Flexible Rigidity:** We limit choices to *Design System Tokens* (only `Gap4`, `Gap8`, etc.), but allow free composition. This is the "Goldilocks" zone—strict tokens, flexible application.

---

## 3. Deep Dive: "Suffix Tagging Strategy" - Additional Review

Analysis of the user's proposed **`Layout.Grid.2x2.gap10.Bento`** pattern (Structure + Intent).

### 3.1. Concept (The Best of Both Worlds?)
This pattern combines **[Structural Truth]** + **[Intentional Meaning]**.
*   **Prefix (`Layout.Grid.2x2.gap10`)**: Provides the "physical facts" the AI needs to understand the visual structure. (Satisfies Blue Team)
*   **Suffix (`.Bento`)**: Provides the "context" the human needs to understand the purpose. (Satisfies Red Team)

### 3.2. Pros
1.  **Filtering Effect:** When selecting a layout, the developer (or AI) narrows scope by Structure first (2x2, gap10), and selects Intent last (Bento, Gallery). This prevents "picking a random Grid but using it for a Bento".
2.  **Self-Documenting:** The code reveals: "This is a 2x2 grid with 10px gap, used as a Bento style."
3.  **Searchability:** Search `Layout...Bento` to find Bento usages; search `Layout.Grid.2x2` to find structural usages.

### 3.3. Cons & Mitigations
*   **API Depth Issue:** `Layout.Grid.2x2.gap10` cannot be a value AND have properties like `.Bento`. (JS Object limitation).
    *   **Solution:** **"Mandatory Suffix Rule"**. Every Atomic chain MUST end with a Semantic Suffix.
    *   `Layout.row.gap4` (❌ Invalid)
    *   `Layout.row.gap4.Default` (✅ Valid - Generic case)
    *   `Layout.row.gap4.Dense` (✅ Valid - Specific case)

### 3.4. Conclusion: Recommend "Mandatory Suffix"
This strategy forces the AI to **commit to Structure first**, then **confirm Intent**, preventing hallucinations while preserving maintainability.

---

## 4. Consensus: "Structured Suffix System"

We finally propose the **Atomic Structure + Semantic Suffix** system.

**Syntax:** `Layout.<Type>.<Structure>.<Gap>.<Intent>`

*   **Type:** `Row` | `Stack` | `Grid`
*   **Structure:**
    *   Row/Stack: `Start` | `Center` | `Space`
    *   Grid: `Cols2` | `Cols3` | `Auto` (Adhering to TS variable naming rules instead of 2x2)
*   **Gap:** `Gap0` | `Gap4` | `Gap8` ...
*   **Intent (Suffix):** `Default`, `Bento`, `Card`, `Form` ...

#### Usage Examples

```tsx
// 1. Generic 2-column grid (Structure + Default)
<Frame layout={Layout.Grid.Cols2.Gap20.Default}>

// 2. Bento style grid (Structure + Intent)
<Frame layout={Layout.Grid.Cols3.Gap12.Bento}>

// 3. Header (Structure + Intent)
<Frame layout={Layout.Row.Space.Gap16.Header}>
```

---

## 5. Implementation Plan

1.  **Define Suffix Matrix:** Define allowed suffixes for each structure (`Default`, `Header`, `Bento`, etc.). Most will be `Default`.
2.  **Refactor Layout.ts:**
    *   Old: `Layout.Grid.Cards...`
    *   New: `Layout.Grid.ColsAuto.Gap12.Cards`
3.  **AI Guide:** "Always match `Structure` first, then select the most appropriate `Suffix`. Use `Default` if none exists."

This approach expands the user's `.Bento` example into a system-wide rule, representing the **most robust compromise**.
