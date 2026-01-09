# Accessibility Patterns (접근성 패턴)

웹 접근성(A11y)을 보장하기 위한 필수 패턴입니다.

---

## 개요

Accessibility Patterns는 **모든 사용자가 UI를 사용**할 수 있도록 보장하는 패턴입니다. 스크린리더, 키보드 전용 사용자, 시각/청각 장애 사용자를 포함합니다.

### 왜 필요한가?
- **포용성**: 모든 사용자에게 동등한 경험 제공
- **법적 준수**: WCAG 2.1 AA 기준 충족
- **SEO 개선**: 접근 가능한 콘텐츠는 검색 엔진도 잘 이해
- **사용성 향상**: 키보드 사용자, 터치스크린 사용자 모두 혜택

---

## 1. Live Regions Patterns

### 1.1 LiveAnnouncer

#### 설명
동적 콘텐츠 변경을 스크린리더에 알립니다.

#### 사용 시기
- 폼 제출 성공/실패
- 검색 결과 업데이트
- Toast 알림
- 로딩 상태 변경

#### IDDL 통합
```tsx
import { useLiveAnnouncer } from '@/hooks/useLiveAnnouncer';

function SearchResults() {
  const announce = useLiveAnnouncer();

  useEffect(() => {
    if (results) {
      announce(`${results.length} results found for "${query}"`);
    }
  }, [results]);

  return <Group role="List">...</Group>;
}
```

#### 구현 예제
```tsx
export function useLiveAnnouncer() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // 싱글톤 Live Region 생성
    let liveRegion = document.getElementById('live-announcer');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'live-announcer';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only'; // 시각적으로 숨김
      document.body.appendChild(liveRegion);
    }

    // 기존 내용 제거 후 새 메시지 추가
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion!.textContent = message;
    }, 100);
  }, []);

  return announce;
}

// CSS (.sr-only 클래스)
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### ARIA 속성
- `aria-live="polite"` - 스크린리더가 현재 읽기를 마친 후 알림
- `aria-live="assertive"` - 즉시 알림 (중요한 경우만)
- `aria-atomic="true"` - 전체 내용 읽기

---

### 1.2 StatusMessages

#### 설명
상태 변경을 사용자에게 알립니다.

#### 구현 예제
```tsx
export function StatusMessage({ status, message }: { status: 'info' | 'success' | 'warning' | 'error'; message: string }) {
  return (
    <div
      role={status === 'error' ? 'alert' : 'status'}
      aria-live={status === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <Group role="Alert" intent={statusToIntent[status]}>
        <Text role="Body">{message}</Text>
      </Group>
    </div>
  );
}
```

---

## 2. ARIA Patterns

### 2.1 SkipLink

#### 설명
키보드 사용자가 반복 콘텐츠를 건너뛸 수 있게 합니다.

#### 사용 시기
- 모든 페이지 상단 (네비게이션 전)
- 긴 사이드바가 있는 페이지

#### 구현 예제
```tsx
export function SkipLink({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      onFocus={(e) => e.currentTarget.classList.add('focused')}
      onBlur={(e) => e.currentTarget.classList.remove('focused')}
    >
      Skip to main content
    </a>
  );
}

// CSS
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-accent);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link.focused,
.skip-link:focus {
  top: 0;
}

// Page 구조
<SkipLink targetId="main" />
<Section role="Header">...</Section>
<main id="main">...</main>
```

---

### 2.2 LandmarkRegions

#### 설명
페이지 구조를 스크린리더에 명확히 전달합니다.

#### IDDL 통합
```tsx
// IDDL Section은 자동으로 적절한 landmark를 생성
<Page>
  <Section role="Header">
    {/* <header> 또는 role="banner" */}
    <Text role="Title">Site Name</Text>
  </Section>

  <Section role="Navigator">
    {/* <nav> 또는 role="navigation" */}
    <Group role="Menu">...</Group>
  </Section>

  <Section role="Container">
    {/* <main> 또는 role="main" */}
    <Text role="Title">Page Content</Text>
  </Section>

  <Section role="Aside">
    {/* <aside> 또는 role="complementary" */}
    <Text role="Label">Related Links</Text>
  </Section>

  <Section role="Footer">
    {/* <footer> 또는 role="contentinfo" */}
    <Text role="Caption">© 2024</Text>
  </Section>
</Page>
```

#### ARIA Landmarks
- `banner` - 사이트 헤더 (1개만)
- `navigation` - 네비게이션 영역
- `main` - 메인 콘텐츠 (1개만)
- `complementary` - 관련 콘텐츠 (사이드바)
- `contentinfo` - 사이트 푸터 (1개만)
- `search` - 검색 영역
- `form` - 폼 영역 (aria-label 필요)
- `region` - 일반 영역 (aria-label 필요)

---

### 2.3 DescribedBy & LabelledBy

#### 설명
요소 간 관계를 명시적으로 연결합니다.

#### 구현 예제
```tsx
// Field 컴포넌트 (IDDL)
export function Field({ label, helperText, error, ...props }: FieldProps) {
  const id = useId();
  const helperTextId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <Group role="FormControl">
      <Text role="Label" as="label" htmlFor={id}>
        {label}
      </Text>

      <input
        id={id}
        aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />

      {helperText && (
        <Text role="Caption" id={helperTextId} prominence="Secondary">
          {helperText}
        </Text>
      )}

      {error && (
        <Text role="Caption" id={errorId} prominence="Primary" intent="Critical">
          {error}
        </Text>
      )}
    </Group>
  );
}
```

---

## 3. Keyboard Accessibility

### 3.1 Roving TabIndex

#### 설명
그룹 내에서 하나의 요소만 Tab으로 포커스 가능하도록 합니다.

#### 사용 시기
- Toolbar (버튼 그룹)
- Menu (메뉴 항목)
- Grid (셀 탐색)
- Tree (노드 탐색)

#### 구현 예제
```tsx
export function useRovingTabIndex(itemCount: number) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const getTabIndex = useCallback(
    (index: number) => (index === focusedIndex ? 0 : -1),
    [focusedIndex]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % itemCount);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;
      }
    },
    [itemCount]
  );

  return { getTabIndex, handleKeyDown, setFocusedIndex };
}

// 사용 예제
function Toolbar({ items }: { items: ToolbarItem[] }) {
  const { getTabIndex, handleKeyDown, setFocusedIndex } = useRovingTabIndex(items.length);

  return (
    <Group role="Toolbar">
      {items.map((item, index) => (
        <Action
          key={item.id}
          tabIndex={getTabIndex(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => setFocusedIndex(index)}
        >
          {item.label}
        </Action>
      ))}
    </Group>
  );
}
```

---

### 3.2 GridNavigation

#### 설명
2D 그리드에서 방향키로 탐색합니다.

#### 구현 예제
```tsx
export function useGridNavigation(rows: number, cols: number) {
  const [position, setPosition] = useState({ row: 0, col: 0 });

  const getTabIndex = useCallback(
    (row: number, col: number) => (row === position.row && col === position.col ? 0 : -1),
    [position]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setPosition((prev) => ({
            ...prev,
            col: Math.min(prev.col + 1, cols - 1),
          }));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setPosition((prev) => ({
            ...prev,
            col: Math.max(prev.col - 1, 0),
          }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setPosition((prev) => ({
            ...prev,
            row: Math.min(prev.row + 1, rows - 1),
          }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setPosition((prev) => ({
            ...prev,
            row: Math.max(prev.row - 1, 0),
          }));
          break;
      }
    },
    [rows, cols]
  );

  return { getTabIndex, handleKeyDown, setPosition };
}
```

---

### 3.3 FocusVisible

#### 설명
마우스 클릭 시 포커스 링을 숨기고, 키보드 탐색 시만 표시합니다.

#### 구현 예제
```tsx
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const hadKeyboardEvent = useRef(false);

  useEffect(() => {
    function handleKeyDown() {
      hadKeyboardEvent.current = true;
    }

    function handleMouseDown() {
      hadKeyboardEvent.current = false;
    }

    function handleFocus() {
      if (hadKeyboardEvent.current) {
        setIsFocusVisible(true);
      }
    }

    function handleBlur() {
      setIsFocusVisible(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
    };
  }, []);

  return isFocusVisible;
}

// CSS (전역)
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

---

## 4. Screen Reader Support

### 4.1 VisuallyHidden

#### 설명
스크린리더에만 표시되고 시각적으로는 숨겨진 콘텐츠입니다.

#### 사용 시기
- 아이콘 버튼에 설명 추가
- 테이블 헤더 숨기기 (시각적으로만)
- 폼 레이블 숨기기 (placeholder가 있을 때)

#### 구현 예제
```tsx
export function VisuallyHidden({ children, ...props }: { children: React.ReactNode }) {
  return (
    <span className="sr-only" {...props}>
      {children}
    </span>
  );
}

// 사용 예제
<Action prominence="Primary">
  <IconX />
  <VisuallyHidden>Close modal</VisuallyHidden>
</Action>
```

---

### 4.2 Alternative Text

#### 설명
이미지, 아이콘에 대체 텍스트를 제공합니다.

#### 가이드라인
- **의미 있는 이미지**: 설명적인 alt 텍스트
- **장식 이미지**: `alt=""` (빈 문자열)
- **복잡한 이미지**: `aria-describedby` 사용
- **아이콘**: `aria-label` 또는 VisuallyHidden

#### 예제
```tsx
// 의미 있는 이미지
<img src="chart.png" alt="Monthly sales increased by 25% in Q4" />

// 장식 이미지
<img src="decoration.png" alt="" role="presentation" />

// 아이콘 버튼
<button aria-label="Delete item">
  <IconTrash />
</button>

// 복잡한 이미지
<img
  src="complex-chart.png"
  alt="Sales data chart"
  aria-describedby="chart-description"
/>
<div id="chart-description" className="sr-only">
  Detailed description of the chart...
</div>
```

---

### 4.3 RoleDescriptions

#### 설명
커스텀 컴포넌트에 역할 설명을 추가합니다.

#### 구현 예제
```tsx
// Carousel 컴포넌트
<div
  role="region"
  aria-roledescription="carousel"
  aria-label="Featured products"
>
  <div role="group" aria-roledescription="slide" aria-label="1 of 5">
    <img src="product1.jpg" alt="Product 1" />
  </div>
</div>

// Timeline 컴포넌트
<ol role="list" aria-label="Project timeline">
  <li role="listitem" aria-roledescription="timeline event">
    <time dateTime="2024-01-15">Jan 15, 2024</time>
    <p>Project started</p>
  </li>
</ol>
```

---

## 5. Form Accessibility

### 5.1 Required Fields

#### 구현 예제
```tsx
<Field
  label="Email"
  required
  aria-required="true"
  helperText="We'll never share your email"
/>

// Label에 시각적 표시 추가
<Text role="Label">
  Email <span aria-label="required">*</span>
</Text>
```

---

### 5.2 Error Messages

#### 구현 예제
```tsx
<Field
  label="Email"
  error="Please enter a valid email address"
  aria-invalid="true"
  aria-errormessage="email-error"
/>

// Error message는 자동으로 live region이 됨
<Text role="Caption" id="email-error" intent="Critical" role="alert">
  Please enter a valid email address
</Text>
```

---

## 구현 우선순위

### 🔴 High Priority (즉시 구현)
1. **LiveAnnouncer** - 동적 콘텐츠 알림 필수
2. **SkipLink** - 키보드 네비게이션 필수
3. **LandmarkRegions** - 페이지 구조 필수
4. **FocusVisible** - 키보드 포커스 UX
5. **VisuallyHidden** - 아이콘 버튼 접근성

### 🟡 Medium Priority
6. **RovingTabIndex** - 키보드 네비게이션 개선
7. **DescribedBy/LabelledBy** - 폼 접근성
8. **StatusMessages** - 사용자 피드백

### 🟢 Low Priority
9. **GridNavigation** - 복잡한 데이터 그리드
10. **RoleDescriptions** - 커스텀 컴포넌트

---

## 접근성 체크리스트

### ✅ 기본 요구사항
- [ ] 모든 인터랙티브 요소는 키보드로 접근 가능
- [ ] 포커스 순서가 논리적
- [ ] 포커스 표시가 명확 (focus-visible)
- [ ] 모든 이미지에 alt 속성
- [ ] 폼 필드에 label 연결

### ✅ ARIA 요구사항
- [ ] Landmark regions 사용
- [ ] 동적 콘텐츠에 live regions
- [ ] 적절한 ARIA roles
- [ ] aria-label/aria-describedby 사용

### ✅ 키보드 요구사항
- [ ] Tab/Shift+Tab 동작
- [ ] Enter/Space 선택
- [ ] Escape 닫기
- [ ] 방향키 네비게이션

---

## 참고 자료

### 표준 및 가이드라인
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **WebAIM**: https://webaim.org/resources/

### 테스트 도구
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **NVDA** (스크린리더): https://www.nvaccess.org/
- **JAWS** (스크린리더): https://www.freedomscientific.com/products/software/jaws/

### 관련 문서
- [Behavior Patterns](./01-behavior-patterns.md)
- [Component Role Mapping](../component-role-mapping.md)
