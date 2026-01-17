# [Proposal] Solving "Pad Dummy" : Intermediate Validity Pattern

**Date:** 2026-01-17
**Problem:** 현재의 Layout 시스템은 고정된 깊이(Fixed Depth)나 특정 종단점(Terminal)을 요구하기 때문에, 더 이상 정의할 속성이 없어도 구색을 맞추기 위해 `.Default`나 `.Item` 같은 "Pad Dummy" 토큰을 붙여야 합니다.
**Goal:** `Layout.Row.Center`에서 끝내도 되고, `Layout.Row.Center.Gap8.Px10...` 처럼 길게 써도 되는 **"가변 깊이(Variable Depth)"** 구조 제안.

---

## 💡 Core Concept: "Intermediate Constraint Validity"

현재는 `Layout` 객체의 리프 노드(Leaf Node)만 `LayoutToken` 값을 가집니다.
제안하는 방식은 **"중간 노드(Intermediate Node)도 그 자체로 유효한 LayoutToken이자, 하위 속성을 가지는 네임스페이스"**가 되는 것입니다.

### Before (Fixed Depth / Pad Dummy)
```ts
// Layout.Row.Center 만으로는 타입 에러 (값이 아님)
Layout.Row.Center.Default // ✅ 겨우 .Default를 붙여야 값으로 인정됨
```
*   **문제점:** AI나 개발자가 "이쯤이면 됐는데" 싶어도 억지로 `.Default`를 찾아 붙여야 함.

### After (Variable Depth / Intersection Type)
```ts
// 1. 여기서 멈추면 "Gap=0, Padding=0"인 Row 토큰
Layout.Row.Center 

// 2. 더 구체화하고 싶으면 계속 체이닝
Layout.Row.Center.Gap8 

// 3. 극한의 디테일
Layout.Row.Center.Gap8.Px10.Py4.ScrollY 
```
*   **해결:** `.Default` 같은 더미가 필요 없음. **"멈추는 곳이 곧 정의가 끝나는 곳"**

---

## 🔧 Implementation Strategy (TS Intersection)

이것을 구현하기 위한 TypeScript 타입 매직은 **Intersection Type (`&`)**을 활용하는 것입니다.

```typescript
type LayoutToken = {
  // 실제 CSS 변수들
  display: string;
  gap?: string;
  padding?: string;
  // ...
};

// "값"이면서 동시에 "하위 속성"을 가짐
type RowNode = LayoutToken & {
  Gap4: Gap4Node;
  Gap8: Gap8Node;
  Center: CenterNode;
  // ...
};

const Layout: RootNode = { ... };
```

### 생성기(Generator) 수정 방안
1.  **Base Token:** `Layout.Row`는 기본적으로 `gl-row-gap0-px0...` 토큰 값을 가집니다.
2.  **Variant Extension:** `Layout.Row` 객체에 `Gap8` 프로퍼티를 추가합니다. 이 `Gap8` 프로퍼티는 `gl-row-gap8-px0...` 값을 가지는 객체입니다.
3.  **Recursive Construction:** 이 과정을 재귀적으로 수행하여 트리를 구성합니다.

## ⚖️ Trade-offs

### Pros (장점)
1.  **AI Ergonomics:** AI가 필요한 제약조건을 다 걸었다고 판단하면 즉시 멈출 수 있습니다. 불필요한 `Default`를 추론할 필요가 없습니다.
2.  **Clean Code:** 코드가 훨씬 간결해집니다. `Layout.Row.Center.Default` -> `Layout.Row.Center`.
3.  **Flexible Extension:** 나중에 속성을 더 추가하고 싶을 때, 기존 코드를 깨지 않고 깊이를 더할 수 있습니다.

### Cons (단점)
1.  **Generator Complexity:** `generate-layout.ts` 스크립트 작성 난이도가 올라갑니다. (단순 중첩 객체가 아니라, 모든 노드에 값을 하이드레이션 해야 함)
2.  **Intellisense Noise:** 자동완성 목록에 `LayoutToken`의 속성(예: `display`, `gap` 값 자체)과 하위 네임스페이스(예: `Gap8`)가 섞여서 뜰 수 있습니다. (TS 설정으로 제어 가능 여부 확인 필요)

## 🚀 Verdict
**"Intermediate Validity" 패턴 도입을 강력 권장합니다.**
AI가 "에러를 만나면 값을 찾으러 간다"는 시나리오에서도, 더 이상 갈 곳이 없을 때(즉, 유효한 속성을 다 찾았을 때) 자연스럽게 멈추는 것이 가장 인간적/지능적인 인터페이스입니다. "끝내기 위해 무의미한 단어를 덧붙이는 행위"는 AI에게 노이즈가 됩니다.
