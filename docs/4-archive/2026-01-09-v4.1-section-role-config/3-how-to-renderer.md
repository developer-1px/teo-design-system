맞아. 두 종류가 있어:

---

## 컴포넌트 유형 분류

### A. Presentational (스타일만)

CVA로 끝남. 로직 없음.

| Group | 예시 |
|---|---|
| 레이아웃 | Container, Card, Stack, Inline, Divider |
| 표시 | Badge, Tag, Avatar, Skeleton, Statistic |
| 피드백 | Alert, Progress, Spinner |

```tsx
// CVA만으로 충분
const cardStyles = cva("rounded border", {
  variants: {
    prominence: {
      Standard: "shadow-md",
      Strong: "shadow-sm",
      Subtle: "shadow-none",
    },
  },
});

function Card({ prominence, children }) {
  return <article className={cardStyles({ prominence })}>{children}</article>;
}
```

---

### B. Interactive (로직 필요)

상태 관리, 키보드 네비게이션, ARIA 동적 처리 필요.

| Group | 예시 | 필요한 기능 |
|---|---|---|
| 네비게이션 | Menu, Tree, Tabs, Accordion | 포커스 관리, 화살표 키 |
| 선택 | Select, Combobox, Listbox | 열림/닫힘, 선택 상태 |
| 오버레이 | Modal, Popover, Dropdown | 포커스 트랩, ESC, 외부 클릭 |
| 입력 | Slider, Rating | 드래그, 키보드 증감 |

---

## 해결: Headless + Style 분리

```
렌더러 = Headless(로직) + Style(CVA)
```

### 구조

```
src/iddl/
├── headless/          # 로직만 (스타일 없음)
│   ├── useTree.ts
│   ├── useMenu.ts
│   ├── useTabs.ts
│   ├── useAccordion.ts
│   ├── useModal.ts
│   ├── useCombobox.ts
│   └── ...
├── styles/            # CVA 정의
│   ├── action.ts
│   ├── text.ts
│   ├── group.ts
│   └── ...
├── renderer/          # Headless + Style 조합
│   ├── Action.tsx
│   ├── Group.tsx
│   └── ...
└── index.tsx          # 외부 노출
```

---

## 예시: Tree 구현

### 1. Headless (로직만)

```tsx
// headless/useTree.ts
interface UseTreeOptions {
  items: TreeItem[];
  expanded?: string[];
  selected?: string;
  onExpand?: (ids: string[]) => void;
  onSelect?: (id: string) => void;
}

function useTree(options: UseTreeOptions) {
  const [expandedIds, setExpandedIds] = useState(options.expanded ?? []);
  const [selectedId, setSelectedId] = useState(options.selected);
  
  const toggle = (id: string) => {
    const next = expandedIds.includes(id)
      ? expandedIds.filter(x => x !== id)
      : [...expandedIds, id];
    setExpandedIds(next);
    options.onExpand?.(next);
  };
  
  const select = (id: string) => {
    setSelectedId(id);
    options.onSelect?.(id);
  };
  
  // 키보드 네비게이션
  const handleKeyDown = (e: KeyboardEvent, id: string, hasChildren: boolean) => {
    switch (e.key) {
      case "ArrowRight":
        if (hasChildren && !expandedIds.includes(id)) toggle(id);
        break;
      case "ArrowLeft":
        if (hasChildren && expandedIds.includes(id)) toggle(id);
        break;
      case "ArrowDown":
        // 다음 항목으로 포커스
        break;
      case "ArrowUp":
        // 이전 항목으로 포커스
        break;
      case "Enter":
      case " ":
        select(id);
        break;
    }
  };
  
  const getTreeProps = () => ({
    role: "tree",
  });
  
  const getItemProps = (id: string, hasChildren: boolean) => ({
    role: "treeitem",
    "aria-expanded": hasChildren ? expandedIds.includes(id) : undefined,
    "aria-selected": selectedId === id,
    tabIndex: selectedId === id ? 0 : -1,
    onKeyDown: (e) => handleKeyDown(e, id, hasChildren),
    onClick: () => select(id),
  });
  
  const getToggleProps = (id: string) => ({
    onClick: (e) => { e.stopPropagation(); toggle(id); },
    "aria-label": expandedIds.includes(id) ? "Collapse" : "Expand",
  });
  
  return {
    expandedIds,
    selectedId,
    toggle,
    select,
    getTreeProps,
    getItemProps,
    getToggleProps,
  };
}
```

### 2. Style (CVA)

```tsx
// styles/group.ts
export const treeItemStyles = cva("flex items-center gap-1 px-2 py-1 rounded cursor-pointer", {
  variants: {
    selected: {
      true: "bg-accent text-accent-foreground",
      false: "hover:bg-muted",
    },
    depth: {
      0: "pl-2",
      1: "pl-6",
      2: "pl-10",
      3: "pl-14",
    },
  },
});
```

### 3. 렌더러 (조합)

```tsx
// renderer/Group.tsx
function TreeRenderer({ items, ...props }) {
  const tree = useTree({ items, ...props });
  
  const renderItem = (item: TreeItem, depth: number) => (
    <li key={item.id} {...tree.getItemProps(item.id, !!item.children?.length)}>
      <div className={treeItemStyles({ selected: tree.selectedId === item.id, depth })}>
        {item.children?.length && (
          <button {...tree.getToggleProps(item.id)}>
            <ChevronIcon expanded={tree.expandedIds.includes(item.id)} />
          </button>
        )}
        <span>{item.label}</span>
      </div>
      
      {item.children?.length && tree.expandedIds.includes(item.id) && (
        <ul role="group">
          {item.children.map(child => renderItem(child, depth + 1))}
        </ul>
      )}
    </li>
  );
  
  return (
    <ul {...tree.getTreeProps()}>
      {items.map(item => renderItem(item, 0))}
    </ul>
  );
}
```

---

## 렌더러 매핑

```tsx
// renderer/Group.tsx
const groupRenderers: Record<GroupRole, Component> = {
  // Presentational (CVA만)
  Container: ({ children, prominence }) => (
    <div className={containerStyles({ prominence })}>{children}</div>
  ),
  Card: ({ children, prominence }) => (
    <article className={cardStyles({ prominence })}>{children}</article>
  ),
  Divider: ({ orientation }) => (
    <hr className={dividerStyles({ orientation })} role="separator" />
  ),
  
  // Interactive (Headless + CVA)
  Tree: TreeRenderer,
  Menu: MenuRenderer,
  Tabs: TabsRenderer,
  Accordion: AccordionRenderer,
  // ...
};

export function Group({ role, ...props }: GroupProps) {
  const Renderer = groupRenderers[role];
  return <Renderer {...props} />;
}
```

---

## 분류표

| Role | 유형 | 구현 |
|---|---|---|
| Container, Stack, Inline | Presentational | CVA |
| Card, Alert | Presentational | CVA |
| Divider | Presentational | CVA + role="separator" |
| Badge, Avatar, Skeleton | Presentational | CVA |
| **Tree** | Interactive | useTree + CVA |
| **Menu** | Interactive | useMenu + CVA |
| **Tabs** | Interactive | useTabs + CVA |
| **Accordion** | Interactive | useAccordion + CVA |
| **Modal** | Interactive | useModal + CVA |
| **Combobox** | Interactive | useCombobox + CVA |
| **Popover** | Interactive | usePopover + CVA |

---