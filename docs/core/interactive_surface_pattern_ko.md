# Interactive Surface Pattern & Input Strategy
**MDK (Minimal Design Kit) v7.7 Implementation Report**

## 1. 개요 (Overview)
*   **문제**: Input 컴포넌트는 단순한 입력 필드(`input`) 이상입니다. 아이콘, 클리어 버튼, 로딩 인디케이터 등 다양한 요소가 포함된 "컨테이너"입니다.
    *   대부분의 UI 라이브러리는 이를 `div` 래퍼로 감싸고, 클릭 이벤트를 자바스크립트로 가로채거나, 정교한 스타일링으로 해결하려고 합니다.
    *   이 과정에서 **동작(Behavior)**과 **의미(Semantics)**가 분리되거나, 커서(Cursor) 처리가 모호해지는 문제가 발생합니다.
*   **해결책**:
    1.  **Semantic Container**: `Frame`을 `<label>` 태그로 렌더링 (`as="label"`).
    2.  **Explicit Interactive Mode**: `interactive` 속성을 확장하여 `"text"` 모드 도입.

---

## 2. MDK 구현 상세 (Implementation Details)

### 2.1 The Code
```tsx
// MailHeader.tsx (Example)
<Frame
  as="label"               // 1. Semantic: 클릭 시 내부 Input으로 포커스 이양 (Native Browser Behavior)
  interactive="text"       // 2. Behavioral: 커서를 'text'로 설정, Hover/Active 스타일 적용
  surface="sunken"
  layout={Layout.Row.Toolbar.Compact}
>
  <Icon src={Search} />
  <Input placeholder="Search..." /> 
</Frame>
```

### 2.2 `interactive` Prop의 진화
단순 `boolean`에서 `Union Type`으로 확장하여 의도를 명확히 했습니다.

| 값 (Value) | 의미 (Semantics) | 커서 (Cursor) | 용도 (Usage) |
| :--- | :--- | :--- | :--- |
| `false` / `undefined` | Non-interactive | `default` | 기본 컨테이너 |
| `true` / `"button"` | Clickable Element | `pointer` | 버튼, 리스트 아이템, 카드 |
| `"text"` | Text Input Container | `text` | **Input Wrapper**, Textarea Wrapper |

### 2.3 CSS 처리 (`surface.css`)
```css
/* Explicit Interactive Modes */
.frame.interactive-button {
  cursor: pointer;
}

.frame.interactive-text {
  cursor: text; /* 마치 텍스트 에디터처럼 동작 */
}

/* Common Interactive States */
.frame.interactive.surface-sunken:focus-within {
  /* 포커스가 내부 Input에만 있어도, 컨테이너 전체가 활성화됨 */
  background-color: var(--surface-base);
  border-color: var(--text-primary);
  /* Pop Effect */
}
```

---

## 3. 벤치마킹 & 비교 분석 (Benchmarking)

주요 React UI 라이브러리들은 이 문제를 어떻게 해결하고 있을까요?

### 3.1 Radix UI (The Accessibility Gold Standard)
*   **접근 방식**: 철저한 **WAI-ARIA 및 Native Label** 활용.
*   **비교**: MDK의 방식(`as="label"`)과 가장 유사합니다. Radix는 `Label` 프리미티브를 제공하여 Input과 연결합니다.
*   **MDK의 장점**: Radix는 별도의 `Label` 컴포넌트를 조합해야 하지만, MDK는 `Frame` 자체를 Label로 변환하여 레이아웃/스타일링/기능을 단일 노드에서 처리합니다.

### 3.2 Material UI (MUI)
*   **접근 방식**: **Floating Label** 패턴 + `InputAdornment`.
*   **문제점**:
    *   Input 앞뒤의 아이콘(`Adornment`) 클릭 시 포커스가 Input으로 가지 않는 경우가 많음.
    *   이를 해결하기 위해 `disablePointerEvents` 같은 복잡한 prop이나 별도의 `ref` 처리가 필요함.
    *   Floating Label은 모던/미니멀 디자인 트렌드와는 다소 거리가 있음.
*   **MDK의 장점**: Native `<label>` 동작을 그대로 쓰기 때문에 `onClick` 핸들러나 `pointer-events` 핵(Hack)이 필요 없습니다.

### 3.3 Chakra UI
*   **접근 방식**: `InputGroup` 래퍼 + `pointer-events: none`.
*   **문제점**:
    *   Input 내부의 아이콘 클릭을 뚫고 Input에 도달하게 하기 위해 `pointer-events: none` 스타일 핵을 자주 사용함.
    *   "Label로 감싸기"보다는 "Input 위에 아이콘 띄우기" 접근 방식.
*   **MDK의 장점**: CSS 핵 없이 구조적(Semantic)으로 해결했습니다.

---

## 4. 결론 (Conclusion)

MDK v7.7의 처리 방식은 **"가장 웹 표준에 가까운 것이 가장 강력하다"**는 원칙을 증명합니다.

1.  **Zero JS Logic**: 클릭 핸들러 없이 브라우저 기본 동작(`<label>`)만으로 완벽한 포커스 UX를 구현했습니다.
2.  **Better DX**: 개발자는 `as="label" interactive="text"`만 기억하면 됩니다.
3.  **Superior UX**: 사용자는 검색창의 빈 공간, 아이콘, 여백 어디를 클릭해도 즉시 입력을 시작할 수 있으며(Fitts' Law), 커서 모양(`text`)은 이곳이 입력 가능한 공간임을 명확히 암시합니다.
