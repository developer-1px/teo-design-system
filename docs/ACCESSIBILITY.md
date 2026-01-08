# 키보드 접근성 가이드

> **핵심 원칙**: 모든 UI는 키보드만으로 완전히 조작 가능해야 합니다.

## 목차

1. [기본 원칙](#기본-원칙)
2. [키보드 네비게이션](#키보드-네비게이션)
3. [포커스 관리](#포커스-관리)
4. [컴포넌트별 가이드](#컴포넌트별-가이드)
5. [테스트 체크리스트](#테스트-체크리스트)

---

## 기본 원칙

### 1. 모든 인터랙티브 요소는 키보드로 접근 가능

```tsx
// ❌ 잘못된 예: div로 버튼 만들기
<div onClick={handleClick}>Click me</div>

// ✅ 올바른 예: button 사용
<button onClick={handleClick}>Click me</button>

// ✅ 또는 div에 키보드 지원 추가
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click me
</div>
```

### 2. 포커스 스타일은 절대 숨기지 않음

```css
/* ❌ 잘못된 예 */
*:focus {
  outline: none;
}

/* ✅ 올바른 예: focus-visible 사용 */
*:focus-visible {
  outline: 2px solid rgb(var(--accent));
  outline-offset: 2px;
}
```

### 3. 논리적인 Tab 순서

```tsx
// ✅ 올바른 예: 자연스러운 DOM 순서
<form>
  <input name="name" />      {/* Tab 순서: 1 */}
  <input name="email" />     {/* Tab 순서: 2 */}
  <button type="submit">Submit</button> {/* Tab 순서: 3 */}
</form>

// ❌ 잘못된 예: tabIndex로 순서 변경 (가급적 피하기)
<div>
  <input tabIndex={3} />
  <input tabIndex={1} />
  <input tabIndex={2} />
</div>
```

---

## 키보드 네비게이션

### 표준 키보드 단축키

| 키 | 기능 |
|---|------|
| **Tab** | 다음 포커스 가능한 요소로 이동 |
| **Shift + Tab** | 이전 포커스 가능한 요소로 이동 |
| **Enter** | 버튼/링크 활성화, 폼 제출 |
| **Space** | 버튼/체크박스 토글 |
| **Escape** | Modal/Dropdown 닫기, 취소 |
| **Arrow Up/Down** | 리스트/메뉴에서 이전/다음 항목 |
| **Arrow Left/Right** | 탭/슬라이더 이동 |
| **Home** | 첫 번째 항목으로 |
| **End** | 마지막 항목으로 |

### 구현 예시

```tsx
// List navigation with arrow keys
function ListComponent() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = ['Item 1', 'Item 2', 'Item 3'];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setSelectedIndex(items.length - 1);
        break;
    }
  };

  return (
    <div role="listbox" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <div
          key={index}
          role="option"
          tabIndex={index === selectedIndex ? 0 : -1}
          aria-selected={index === selectedIndex}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

---

## 포커스 관리

### 1. Skip Links (건너뛰기 링크)

페이지 상단에 숨겨진 "본문으로 건너뛰기" 링크를 제공:

```tsx
function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>
      <nav>{/* ... */}</nav>
      <main id="main-content">
        {/* Main content */}
      </main>
    </>
  );
}
```

```css
/* src/styles/focus.css에 정의됨 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: rgb(var(--accent));
  color: white;
}

.skip-link:focus {
  top: 0;
}
```

### 2. Focus Trap (포커스 가두기)

Modal/Dialog가 열렸을 때 포커스가 밖으로 나가지 않도록:

```tsx
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    // 포커스 가능한 요소들 찾기
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // 첫 번째 요소로 포커스 이동
    firstElement?.focus();

    // Tab 키 감지
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div ref={modalRef} role="dialog" aria-modal="true">
        {/* Modal content */}
      </div>
    </div>
  );
}
```

### 3. Focus Restoration (포커스 복원)

Modal을 닫을 때 이전 포커스 위치로 복원:

```tsx
function useModalFocus(isOpen: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Modal 열릴 때: 현재 포커스 저장
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else {
      // Modal 닫힐 때: 이전 포커스 복원
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);
}
```

---

## 컴포넌트별 가이드

### Button

```tsx
// ✅ 올바른 예
<button
  onClick={handleClick}
  className="focus-visible:ring-2 focus-visible:ring-accent"
>
  Click me
</button>

// ✅ IconButton은 title 필수
<button title="Close" aria-label="Close">
  <X size={20} />
</button>
```

### Input

```tsx
// ✅ 올바른 예: label과 연결
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-describedby="email-help"
/>
<span id="email-help">Enter your email address</span>

// ❌ 잘못된 예: label 없음
<input type="email" placeholder="Email" />
```

### Dropdown/Menu

```tsx
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Menu
      </button>

      {isOpen && (
        <div role="menu">
          {options.map((option, index) => (
            <div
              key={index}
              role="menuitem"
              tabIndex={index === selectedIndex ? 0 : -1}
              onClick={() => console.log(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  console.log(option);
                }
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Tabs

```tsx
function Tabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];

  return (
    <div>
      <div role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === activeTab}
            tabIndex={index === activeTab ? 0 : -1}
            onClick={() => setActiveTab(index)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                setActiveTab((activeTab + 1) % tabs.length);
              } else if (e.key === 'ArrowLeft') {
                setActiveTab((activeTab - 1 + tabs.length) % tabs.length);
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div role="tabpanel" tabIndex={0}>
        {/* Tab content */}
      </div>
    </div>
  );
}
```

---

## 테스트 체크리스트

### 기본 테스트

- [ ] Tab 키만으로 모든 인터랙티브 요소에 접근 가능한가?
- [ ] 포커스 순서가 논리적인가?
- [ ] 포커스가 명확하게 보이는가?
- [ ] Enter/Space로 모든 버튼/링크가 동작하는가?
- [ ] Escape로 Modal/Dropdown이 닫히는가?

### 고급 테스트

- [ ] 화살표 키로 리스트 탐색이 가능한가?
- [ ] Modal이 열리면 포커스가 Modal 안에 갇히는가?
- [ ] Modal을 닫으면 이전 포커스 위치로 돌아가는가?
- [ ] Skip link가 동작하는가?
- [ ] 화면 리더로 테스트했는가? (VoiceOver, NVDA)

### 자동화 테스트 도구

- **axe DevTools**: Chrome extension
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Chrome DevTools에 내장

---

## ARIA 속성 가이드

### 자주 사용하는 ARIA 속성

| 속성 | 용도 | 예시 |
|------|------|------|
| `aria-label` | 보이지 않는 레이블 | `<button aria-label="Close">×</button>` |
| `aria-labelledby` | 다른 요소로 레이블 지정 | `<div aria-labelledby="title">` |
| `aria-describedby` | 추가 설명 | `<input aria-describedby="help-text">` |
| `aria-expanded` | 확장/축소 상태 | `<button aria-expanded={isOpen}>` |
| `aria-selected` | 선택 상태 | `<div role="option" aria-selected={true}>` |
| `aria-hidden` | 스크린 리더에서 숨김 | `<div aria-hidden="true">` |
| `aria-live` | 동적 콘텐츠 알림 | `<div aria-live="polite">` |

---

## 참고 자료

- **WAI-ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **WebAIM**: https://webaim.org/
- **A11y Project**: https://www.a11yproject.com/

---

**작성일**: 2026-01-08
**버전**: 1.0
**상태**: 최신
