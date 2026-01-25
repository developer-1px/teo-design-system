# Headless UI Hooks

업계 표준 headless hook 라이브러리. Downshift, React Aria, Headless UI의 디자인 패턴을 참고하여 구현되었습니다.

## 핵심 개념

**Headless = Logic + State만 제공, UI는 사용자가 자유롭게 구성**

- ✅ 완전한 접근성 (ARIA 속성 자동 생성)
- ✅ 키보드 네비게이션 완벽 지원
- ✅ Controlled/Uncontrolled 모드
- ✅ TypeScript 완전 지원
- ✅ 제로 스타일 의존성

---

## Hooks

### 1. useAccordion

WAI-ARIA Accordion Pattern을 따르는 아코디언 hook

```tsx
import { useAccordion } from "../design-system/hooks";

function MyAccordion() {
  const { expandedIds, getItemProps, getPanelProps } = useAccordion({
    items: ["item-1", "item-2", "item-3"],
    defaultExpanded: ["item-1"],
    allowMultiple: true,
    onChange: (ids) => console.log("Expanded:", ids),
  });

  return (
    <div>
      {items.map((item) => {
        const itemProps = getItemProps(item.id);
        const panelProps = getPanelProps(item.id);

        return (
          <div key={item.id}>
            {/* Trigger */}
            <button {...itemProps}>
              <Icon src={itemProps.expanded ? ChevronDown : ChevronRight} />
              {item.title}
            </button>

            {/* Panel */}
            <div {...panelProps}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

**Features:**
- Space/Enter 키로 토글
- `allowMultiple` 모드 지원
- 전체 펼치기/접기 (`expandAll`, `collapseAll`)
- ARIA 속성 자동 생성

---

### 2. useTabs

WAI-ARIA Tabs Pattern을 따르는 탭 hook

```tsx
import { useTabs } from "../design-system/hooks";

function MyTabs() {
  const {
    selectedTab,
    getTabListProps,
    getTabProps,
    getTabPanelProps,
  } = useTabs({
    tabs: ["overview", "activity", "settings"],
    defaultTab: "overview",
    orientation: "horizontal",
    keyboardActivation: "automatic", // or "manual"
  });

  return (
    <div>
      {/* Tab List */}
      <div {...getTabListProps()}>
        {tabs.map((tab) => (
          <button key={tab.id} {...getTabProps(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab) => (
        <div key={tab.id} {...getTabPanelProps(tab.id)}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
```

**Features:**
- ←→ (또는 ↑↓) 방향키 네비게이션
- Home/End 키 지원
- Automatic/Manual activation 모드
- ARIA 속성 자동 생성

---

### 3. useDropdown

Downshift API 스타일의 드롭다운 hook

```tsx
import { useDropdown } from "../design-system/hooks";

function MyDropdown() {
  const items = ["Apple", "Banana", "Cherry", "Date"];

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useDropdown({
    items,
    onSelectedItemChange: (item) => console.log("Selected:", item),
  });

  return (
    <div>
      <label {...getLabelProps()}>Choose a fruit</label>

      <button {...getToggleButtonProps()}>
        {selectedItem ?? "Select item"}
      </button>

      {isOpen && (
        <ul {...getMenuProps()}>
          {items.map((item, index) => (
            <li
              key={index}
              {...getItemProps({ item, index })}
              style={{
                backgroundColor: getItemProps({ item, index }).highlighted
                  ? "#f0f0f0"
                  : "white",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Features:**
- ↑↓ 방향키로 하이라이트 이동
- Enter/Space로 선택
- Esc로 닫기
- Home/End 키 지원
- Prop Getter 패턴 (Downshift 스타일)

---

### 4. useModal

Headless UI Dialog 패턴을 따르는 모달 hook

```tsx
import { useModal } from "../design-system/hooks";

function MyModal() {
  const [open, setOpen] = useState(false);

  const {
    getBackdropProps,
    getDialogProps,
    getTitleProps,
    getDescriptionProps,
    getCloseButtonProps,
  } = useModal({
    open,
    onClose: () => setOpen(false),
    closeOnEsc: true,
    closeOnBackdropClick: true,
    lockScroll: true,
  });

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        {...getBackdropProps()}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />

      {/* Dialog */}
      <div
        {...getDialogProps()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h2 {...getTitleProps()}>Modal Title</h2>
        <p {...getDescriptionProps()}>Modal description</p>
        <button {...getCloseButtonProps()}>Close</button>
      </div>
    </>
  );
}
```

**Features:**
- Focus Trap (Tab 순환)
- Scroll Lock (body scroll 방지)
- Esc 키로 닫기
- Backdrop 클릭으로 닫기
- Focus 복원

---

### 5. useTooltip

자동 위치 계산이 가능한 툴팁 hook

```tsx
import { useTooltip } from "../design-system/hooks";

function MyTooltip() {
  const { isOpen, getTriggerProps, getTooltipProps } = useTooltip({
    placement: "top",
    delay: 500,
    closeDelay: 200,
    offset: 8,
  });

  return (
    <>
      <button {...getTriggerProps()}>
        Hover me
      </button>

      {isOpen && (
        <div
          {...getTooltipProps()}
          style={{
            ...getTooltipProps().style,
            padding: "8px 12px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "4px",
          }}
        >
          Tooltip content
        </div>
      )}
    </>
  );
}
```

**Features:**
- Hover + Focus 지원
- 지연 표시/숨김
- 자동 위치 계산 (top/bottom/left/right)
- Window resize/scroll 시 재계산
- ARIA tooltip role

---

## Utility Hooks

### useControlledState

Controlled/Uncontrolled 패턴 지원

```tsx
import { useControlledState } from "../design-system/hooks";

function MyComponent({ value, defaultValue, onChange }) {
  const [internalValue, setValue] = useControlledState(
    value,        // Controlled value (optional)
    defaultValue, // Default value for uncontrolled mode
    onChange      // Callback when value changes
  );

  // Component is controlled if 'value' prop exists
  // Otherwise uses internal state
}
```

### useId

React 18 useId wrapper

```tsx
import { useId } from "../design-system/hooks";

const id = useId("accordion");
// Returns: "accordion-:r1:"
```

### useFocusTrap

Focus trap 구현

```tsx
import { useFocusTrap } from "../design-system/hooks";

const containerRef = useRef<HTMLDivElement>(null);

useFocusTrap(containerRef, {
  active: isOpen,
  initialFocus: firstButtonRef,
  restoreFocus: true,
});
```

### useScrollLock

Body scroll lock

```tsx
import { useScrollLock } from "../design-system/hooks";

useScrollLock(isModalOpen);
```

---

## Design Patterns

### Prop Getter Pattern

Downshift에서 유래한 패턴. Props를 함수로 반환하여 사용자가 호출하도록 함.

```tsx
// ✅ Prop Getter - 사용자가 호출
const itemProps = getItemProps(id);
<button {...itemProps}>Item</button>

// ❌ Direct Props - 직접 전달
<button expanded={expanded} onClick={...} onKeyDown={...}>
```

**장점:**
- 여러 props를 한 번에 전달
- ARIA 속성 자동 생성
- 이벤트 핸들러 자동 병합
- 타입 안정성

---

## References

구현 시 참고한 라이브러리:

- **Downshift** - useDropdown API 패턴
- **React Aria (Adobe)** - useTabs, ARIA 구현
- **Headless UI** - useModal, Focus Trap
- **@szhsin/react-accordion** - useAccordion 패턴

---

## TypeScript Support

모든 Hook은 완전한 TypeScript 지원:

```tsx
import type {
  UseAccordionOptions,
  UseAccordionReturn,
} from "../design-system/hooks";

const options: UseAccordionOptions = {
  items: ["a", "b", "c"],
  allowMultiple: true,
};

const accordion: UseAccordionReturn = useAccordion(options);
```

---

## 다음 단계

이 Headless Hook들 위에 Complete Component를 구축:

```tsx
// Complete Component는 Headless Hook 사용
export function Accordion({ items, ...options }: AccordionProps) {
  const { getItemProps, getPanelProps } = useAccordion({
    items: items.map(i => i.id),
    ...options,
  });

  return (
    <Frame layout={Layout.Stack.Start.Gap12.Content.Default}>
      {items.map((item) => (
        <Frame key={item.id}>
          <Action {...getItemProps(item.id)}>
            {item.title}
          </Action>
          <Frame {...getPanelProps(item.id)}>
            {item.content}
          </Frame>
        </Frame>
      ))}
    </Frame>
  );
}
```

사용자는 선택 가능:
- **Headless Hook** → 완전한 UI 제어
- **Complete Component** → 편리한 기본 구현
