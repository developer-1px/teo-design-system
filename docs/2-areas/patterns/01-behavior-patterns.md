# Behavior Patterns (동작 패턴)

UI 컴포넌트가 아닌 재사용 가능한 동작/로직 패턴입니다.

---

## 개요

Behavior Patterns는 **컴포넌트가 아닌 동작(Behavior)**을 캡슐화한 패턴입니다. Hook이나 Util 함수로 구현되며, 여러 컴포넌트에서 재사용됩니다.

### 왜 필요한가?
- **재사용성**: 동일한 동작을 여러 컴포넌트에서 사용
- **관심사 분리**: UI와 동작 로직 분리
- **테스트 용이성**: 동작만 독립적으로 테스트 가능
- **접근성**: 표준화된 키보드/포커스 동작 제공

---

## 1. Focus Management Patterns

### 1.1 FocusTrap

#### 설명
모달, 다이얼로그 등에서 포커스를 특정 영역 내부로 가두는 패턴입니다.

#### 사용 시기
- Modal/Dialog가 열릴 때
- Drawer/Sheet가 열릴 때
- 복잡한 Popover 내부

#### IDDL 통합
```tsx
// Overlay 컴포넌트와 함께 사용
import { useFocusTrap } from '@/hooks/useFocusTrap';

<Overlay role="Modal" onClose={handleClose}>
  {(ref) => {
    useFocusTrap(ref, { active: true });
    return <ModalContent />;
  }}
</Overlay>
```

#### 구현 예제
```tsx
export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  options: { active: boolean; restoreFocus?: boolean }
) {
  useEffect(() => {
    if (!options.active || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    // 초기 포커스
    firstFocusable?.focus();

    // 저장할 이전 포커스
    const previouslyFocused = document.activeElement as HTMLElement;

    // Tab 키 핸들러
    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTab as any);

    return () => {
      element.removeEventListener('keydown', handleTab as any);
      // 포커스 복원
      if (options.restoreFocus) {
        previouslyFocused?.focus();
      }
    };
  }, [ref, options.active, options.restoreFocus]);
}
```

#### ARIA & Accessibility
- Modal 열릴 때 자동 포커스
- Tab 키로 순환 가능
- 닫힐 때 이전 포커스 복원
- `aria-modal="true"` 속성 필요

---

### 1.2 FocusLock

#### 설명
FocusTrap보다 강력하며, 외부 클릭/스크롤도 차단합니다.

#### 사용 시기
- 중요한 Modal (예: 결제, 확인)
- 전체 화면 Overlay

---

### 1.3 RestoreFocus

#### 설명
컴포넌트가 언마운트될 때 이전 포커스를 복원합니다.

#### 구현 예제
```tsx
export function useRestoreFocus(ref: RefObject<HTMLElement>) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;

    return () => {
      previouslyFocused.current?.focus();
    };
  }, []);
}
```

---

## 2. Keyboard Navigation Patterns

### 2.1 ArrowNavigation

#### 설명
방향키로 리스트, 그리드, 메뉴 등을 탐색하는 패턴입니다.

#### 사용 시기
- List / Menu 컴포넌트
- Grid / DataGrid
- Tree 컴포넌트

#### IDDL 통합
```tsx
<Group role="List">
  {items.map((item, index) => (
    <Action
      key={item.id}
      variant="list-item"
      onKeyDown={(e) => handleArrowKey(e, index)}
    >
      {item.label}
    </Action>
  ))}
</Group>
```

#### 구현 예제
```tsx
export function useArrowNavigation(
  itemCount: number,
  options: {
    orientation?: 'vertical' | 'horizontal' | 'both';
    loop?: boolean;
  } = {}
) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const { orientation = 'vertical', loop = true } = options;

      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            newIndex = currentIndex + 1;
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            newIndex = currentIndex - 1;
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            newIndex = currentIndex + 1;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            newIndex = currentIndex - 1;
          }
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = itemCount - 1;
          break;
        default:
          return;
      }

      // Loop handling
      if (loop) {
        if (newIndex < 0) newIndex = itemCount - 1;
        if (newIndex >= itemCount) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(newIndex, itemCount - 1));
      }

      setFocusedIndex(newIndex);
    },
    [itemCount, options]
  );

  return { focusedIndex, handleKeyDown };
}
```

#### ARIA & Accessibility
- `role="menu"` + `role="menuitem"`
- `aria-activedescendant` 사용
- Home/End 키 지원

---

### 2.2 KeyboardShortcuts

#### 설명
전역 또는 지역 키보드 단축키를 관리합니다.

#### 구현 예제
```tsx
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    scope?: 'global' | 'local';
  } = {}
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const { ctrl, shift, alt, meta } = options;

      // Modifier 키 체크
      if (ctrl && !e.ctrlKey) return;
      if (shift && !e.shiftKey) return;
      if (alt && !e.altKey) return;
      if (meta && !e.metaKey) return;

      // 키 체크
      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options]);
}

// 사용 예제
useKeyboardShortcut('s', handleSave, { ctrl: true }); // Ctrl+S
useKeyboardShortcut('Escape', handleClose); // ESC
```

---

## 3. Interaction Patterns

### 3.1 ClickOutside

#### 설명
요소 외부 클릭을 감지하는 패턴입니다.

#### 사용 시기
- Dropdown, Popover 닫기
- Context Menu 닫기
- Modal 외부 클릭

#### 구현 예제
```tsx
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    // 약간의 지연을 두어 현재 이벤트 이후에 등록
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, handler, enabled]);
}

// 사용 예제
const dropdownRef = useRef<HTMLDivElement>(null);
useClickOutside(dropdownRef, () => setOpen(false), open);
```

---

### 3.2 EscapeHandler

#### 설명
ESC 키를 눌렀을 때 동작을 처리합니다.

#### 구현 예제
```tsx
export function useEscapeKey(handler: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handler();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handler, enabled]);
}
```

---

### 3.3 LongPress

#### 설명
길게 누르기 제스처를 감지합니다.

#### 구현 예제
```tsx
export function useLongPress(
  callback: () => void,
  options: { threshold?: number } = {}
) {
  const { threshold = 500 } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isLongPress = useRef(false);

  const start = useCallback(() => {
    isLongPress.current = false;
    timeoutRef.current = setTimeout(() => {
      isLongPress.current = true;
      callback();
    }, threshold);
  }, [callback, threshold]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const click = useCallback((e: React.MouseEvent) => {
    if (isLongPress.current) {
      e.preventDefault();
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
    onClick: click,
  };
}
```

---

## 4. Scroll Patterns

### 4.1 ScrollLock

#### 설명
Modal/Overlay가 열렸을 때 배경 스크롤을 막습니다.

#### 구현 예제
```tsx
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 스크롤바 제거로 인한 레이아웃 시프트 방지
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);
}
```

---

### 4.2 ScrollIntoView

#### 설명
요소를 뷰포트로 스크롤합니다.

#### 구현 예제
```tsx
export function useScrollIntoView<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const scrollIntoView = useCallback(
    (options?: ScrollIntoViewOptions) => {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        ...options,
      });
    },
    []
  );

  return { ref, scrollIntoView };
}
```

---

### 4.3 InfiniteScroll

#### 설명
스크롤 끝에 도달하면 자동으로 데이터를 로드합니다.

#### 구현 예제
```tsx
export function useInfiniteScroll(
  callback: () => void,
  options: { threshold?: number; enabled?: boolean } = {}
) {
  const { threshold = 100, enabled = true } = options;
  const observerRef = useRef<IntersectionObserver>();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [callback, threshold, enabled]);

  return { sentinelRef };
}

// 사용 예제
const { sentinelRef } = useInfiniteScroll(() => loadMore(), {
  threshold: 200,
  enabled: hasMore && !loading,
});

return (
  <div>
    {items.map(item => <Item key={item.id} />)}
    <div ref={sentinelRef} /> {/* Sentinel element */}
  </div>
);
```

---

## 구현 우선순위

### 🔴 High Priority (즉시 구현)
1. **FocusTrap** - Modal/Dialog 필수
2. **ClickOutside** - Dropdown/Popover 필수
3. **EscapeHandler** - Overlay 닫기 필수
4. **ScrollLock** - Modal 배경 스크롤 방지

### 🟡 Medium Priority
5. **ArrowNavigation** - 키보드 네비게이션 UX
6. **KeyboardShortcuts** - 생산성 향상
7. **RestoreFocus** - 접근성 개선

### 🟢 Low Priority
8. **LongPress** - 모바일 인터랙션
9. **InfiniteScroll** - 특정 사용 사례
10. **ScrollIntoView** - 편의 기능

---

## 참고 자료

### 주요 라이브러리
- **React Aria**: https://react-spectrum.adobe.com/react-aria/
- **Radix UI Primitives**: https://www.radix-ui.com/primitives
- **Headless UI**: https://headlessui.com/
- **Floating UI**: https://floating-ui.com/
- **use-hooks**: https://usehooks.com/

### 웹 표준
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/patterns/
- **Keyboard Navigation**: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- **Focus Management**: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_vs_selection

### 관련 문서
- [Accessibility Patterns](./02-accessibility-patterns.md)
- [Component Role Mapping](../component-role-mapping.md)
