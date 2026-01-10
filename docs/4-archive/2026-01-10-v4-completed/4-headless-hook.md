좋아. 그럼 headless 구현 로드맵 정리해줄게.

---

## Headless Hooks 구현 목록

### 우선순위 1: 핵심 패턴 (가장 많이 씀)

| Hook | 사용처 | 핵심 기능 |
|---|---|---|
| `useDisclosure` | Modal, Drawer, Popover, Dropdown, Accordion | open/close 상태 |
| `useFocusTrap` | Modal, Drawer, AlertDialog | 포커스 가두기 |
| `useClickOutside` | Popover, Dropdown, ContextMenu | 외부 클릭 감지 |
| `useRovingFocus` | Menu, Tabs, Toolbar, RadioGroup | 화살표 키 이동 |
| `useListNavigation` | Menu, Listbox, Combobox, Tree | 위/아래 키 + 선택 |

### 우선순위 2: 컴포넌트별

| Hook | 대상 컴포넌트 | 의존성 |
|---|---|---|
| `useTabs` | Tabs, TabList, TabPanel | useRovingFocus |
| `useMenu` | Menu, MenuItem, Dropdown | useListNavigation, useClickOutside |
| `useAccordion` | Accordion, AccordionItem | useDisclosure |
| `useTree` | Tree, TreeItem | useListNavigation |
| `useCombobox` | Combobox, Autocomplete | useListNavigation, useDisclosure |
| `useModal` | Modal, Dialog, AlertDialog | useFocusTrap, useDisclosure |
| `usePopover` | Popover, Tooltip, Dropdown | useClickOutside, positioning |
| `useToast` | Toast | 큐 관리, 자동 dismiss |

### 우선순위 3: 입력 컨트롤

| Hook | 대상 컴포넌트 | 핵심 기능 |
|---|---|---|
| `useSlider` | Slider, Range | 드래그, 키보드 증감 |
| `useRating` | Rating | 클릭, 키보드, 반값 |
| `useNumberInput` | Stepper | 증감 버튼, min/max |

---

## 기반 유틸리티

```tsx
// utils/keyboard.ts
export const Keys = {
  Enter: "Enter",
  Space: " ",
  Escape: "Escape",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
  Tab: "Tab",
} as const;

// utils/dom.ts
export function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  );
}

// utils/id.ts
let id = 0;
export function useId(prefix = "iddl") {
  const [uid] = useState(() => `${prefix}-${++id}`);
  return uid;
}
```

---

## 구현 예시: useRovingFocus

모든 네비게이션의 기반이 되는 훅.

```tsx
// headless/useRovingFocus.ts
interface UseRovingFocusOptions {
  orientation?: "horizontal" | "vertical" | "both";
  loop?: boolean;
  onFocusChange?: (index: number) => void;
}

export function useRovingFocus(
  itemCount: number,
  options: UseRovingFocusOptions = {}
) {
  const { orientation = "vertical", loop = true, onFocusChange } = options;
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  
  const setItemRef = (index: number) => (el: HTMLElement | null) => {
    itemRefs.current[index] = el;
  };
  
  const focusItem = (index: number) => {
    const nextIndex = loop
      ? (index + itemCount) % itemCount
      : Math.max(0, Math.min(index, itemCount - 1));
    
    setFocusedIndex(nextIndex);
    itemRefs.current[nextIndex]?.focus();
    onFocusChange?.(nextIndex);
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    const prev = orientation === "horizontal" ? Keys.ArrowLeft : Keys.ArrowUp;
    const next = orientation === "horizontal" ? Keys.ArrowRight : Keys.ArrowDown;
    
    switch (e.key) {
      case prev:
        e.preventDefault();
        focusItem(focusedIndex - 1);
        break;
      case next:
        e.preventDefault();
        focusItem(focusedIndex + 1);
        break;
      case Keys.Home:
        e.preventDefault();
        focusItem(0);
        break;
      case Keys.End:
        e.preventDefault();
        focusItem(itemCount - 1);
        break;
    }
  };
  
  const getContainerProps = () => ({
    onKeyDown: handleKeyDown,
  });
  
  const getItemProps = (index: number) => ({
    ref: setItemRef(index),
    tabIndex: focusedIndex === index ? 0 : -1,
    onFocus: () => setFocusedIndex(index),
  });
  
  return {
    focusedIndex,
    focusItem,
    getContainerProps,
    getItemProps,
  };
}
```

---

## 구현 예시: useTabs (useRovingFocus 활용)

```tsx
// headless/useTabs.ts
interface UseTabsOptions {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function useTabs(tabs: { id: string; label: string }[], options: UseTabsOptions = {}) {
  const [selected, setSelected] = useControllable({
    defaultValue: options.defaultValue ?? tabs[0]?.id,
    value: options.value,
    onChange: options.onChange,
  });
  
  const roving = useRovingFocus(tabs.length, {
    orientation: "horizontal",
    onFocusChange: (index) => setSelected(tabs[index].id),
  });
  
  const baseId = useId("tabs");
  
  const getTabListProps = () => ({
    role: "tablist",
    "aria-orientation": "horizontal" as const,
    ...roving.getContainerProps(),
  });
  
  const getTabProps = (index: number) => {
    const tab = tabs[index];
    return {
      id: `${baseId}-tab-${tab.id}`,
      role: "tab",
      "aria-selected": selected === tab.id,
      "aria-controls": `${baseId}-panel-${tab.id}`,
      onClick: () => setSelected(tab.id),
      ...roving.getItemProps(index),
    };
  };
  
  const getPanelProps = (tabId: string) => ({
    id: `${baseId}-panel-${tabId}`,
    role: "tabpanel",
    "aria-labelledby": `${baseId}-tab-${tabId}`,
    hidden: selected !== tabId,
    tabIndex: 0,
  });
  
  return {
    selected,
    setSelected,
    getTabListProps,
    getTabProps,
    getPanelProps,
  };
}
```

---

## 파일 구조

```
src/iddl/
├── headless/
│   ├── utils/
│   │   ├── keyboard.ts
│   │   ├── dom.ts
│   │   ├── id.ts
│   │   └── controllable.ts
│   ├── primitives/
│   │   ├── useDisclosure.ts
│   │   ├── useFocusTrap.ts
│   │   ├── useClickOutside.ts
│   │   ├── useRovingFocus.ts
│   │   └── useListNavigation.ts
│   ├── components/
│   │   ├── useTabs.ts
│   │   ├── useMenu.ts
│   │   ├── useAccordion.ts
│   │   ├── useTree.ts
│   │   ├── useCombobox.ts
│   │   ├── useModal.ts
│   │   ├── usePopover.ts
│   │   └── useToast.ts
│   └── index.ts
├── styles/
├── renderer/
└── index.tsx
```

---

## 어디서부터 시작할까?

1. **primitives 먼저** → 다른 훅들의 기반
2. **useTabs** → 가장 단순한 interactive 패턴
3. **useMenu** → Dropdown, ContextMenu에 재사용
4. **useModal** → Overlay 계열 기반
5. 나머지...

하나씩 같이 구현해볼까?