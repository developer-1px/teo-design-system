# Design: Frame Prop 진화 전략 v3 (Winner: Strict Top / Flexible Override)

**User Insight 반영**:
> "나는 `override`의 역할이 그(예외 처리) 역할을 해줄 거라 생각했다."

이 통찰은 매우 정확하며, 디자인 시스템의 계층 구조("규칙 vs 예외")를 가장 잘 표현합니다. AI도 타입 정의가 명확하다면 이 패턴을 충분히 잘 수행할 수 있습니다.

따라서 불필요한 `rawW` 같은 신조어(Neologism)를 만들지 않고, **기존 `override` prop의 의미를 확장**하여 문제를 해결하는 것이 가장 우아한 해법입니다.

---

## 1. 최종 전략: "Strict Top-Level, Flexible Override"

### A. Top-Level: 시스템 규칙의 수호자 (Guardians of the System)
최상위 Prop들은 **오직 디자인 토큰**만 허용합니다. 이는 코드를 읽는 즉시 "이 컴포넌트는 시스템 디자인을 따르고 있음"을 보장합니다.

```typescript
interface FrameProps {
  // ✅ Only Tokens allowed!
  w?: WidthToken;  // e.g. Size.n100
  h?: HeightToken; // e.g. Size.fill
  gap?: SpaceToken;
  p?: SpaceToken;
}
```

### B. Override: 규칙 파괴를 위한 공간 (The Exception Layer)
`override` 객체 내부는 **토큰과 Raw Value(숫자/문자열)**를 모두 허용합니다. 이곳은 시스템 규칙을 "Override(재정의/무시)"하는 공간이기 때문입니다.

```typescript
interface FrameOverrides {
  // ✅ Tokens OR Raw Values allowed
  w?: WidthToken | number | string;
  h?: HeightToken | number | string;
  
  // Spacing 등도 마찬가지
  gap?: SpaceToken | number;
}
```

---

## 2. 사용 예시 (Usage Examples)

### 상황 1: 일반적인 UI 개발 (Happy Path)
개발자와 AI는 기본적으로 Top-level prop을 사용합니다. 자동완성은 토큰만 보여주므로 실수를 방지합니다.

```tsx
// ✅ System-aligned (Most common)
<Frame w={Size.fill} p={Space.n24} gap={Space.n12}>
  <Content />
</Frame>
```

### 상황 2: 동적 크기 / 트윅 (The Exception)
동적 스플리터나 외부 라이브러리 연동 시 `override`를 사용합니다.

```tsx
// ✅ Dynamic / Exception
<Frame 
  // 기본 설정
  layout={Layout.Row.Sidebar}
  // 예외 처리: 여기서 시스템 규칙을 깸
  override={{ w: isDragging ? currentWidth : 240 }} 
>
  <SidebarContent />
</Frame>
```

---

## 3. 왜 이 방식이 최선인가? (Why?)

1.  **멘탈 모델의 일치 (Match Mental Model)**:
    *   Top-level = "Default Case" (규칙)
    *   Override = "Special Case" (예외)
    *   사용자의 직관("Override가 그 역할을 해야 한다")과 정확히 일치합니다.

2.  **가독성 및 검색 (Readability & Grep)**:
    *   `override={{ ... }}`가 등장하는 순간, 리뷰어는 "아, 뭔가 표준이 아닌 설정이 있구나"라고 즉시 인지할 수 있습니다.
    *   `rawW` 같은 새로운 용어를 배울 필요가 없습니다.

3.  **AI 가이드 효율성**:
    *   AI에게: *"기본은 Top-level을 씁니다. 만약 픽셀 값이나 계산이 필요하면 무조건 `override` 안에 넣으세요."*
    *   이 규칙은 매우 명확하여 AI가 혼동할 여지가 적습니다.

---

## 4. 실행 계획 (Action Plan)

1.  `FrameProps.ts`: `FramePresetProps`(Top-level)는 그대로 두고, `FrameOverrides` 인터페이스의 타입을 `Token | number | string`으로 확장합니다.
2.  `frameToSettings.ts`: `override` 객체를 처리할 때 `number`나 `string`이 들어오면 `style`로 변환하고, `Token`이 들어오면 CSS 변수(`var(--...)`)로 변환하는 로직을 추가/보강합니다.
3.  JSDoc 업데이트: 각 Prop에 의도를 명시합니다.

이 전략은 디자인 시스템의 **엄격함(Top-level)**과 실무의 **유연함(Override)**을 완벽하게 분리해줍니다.
