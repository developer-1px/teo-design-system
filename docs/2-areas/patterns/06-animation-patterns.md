# Animation Patterns (애니메이션 패턴)

UI 애니메이션과 트랜지션을 구현하는 패턴입니다.

---

## 개요

Animation Patterns는 **사용자 경험을 향상시키는 동적 효과**를 구현합니다. 성능, 접근성, 사용자 선호도를 고려해야 합니다.

### 왜 필요한가?
- **피드백**: 사용자 액션에 대한 즉각적 반응
- **맥락 유지**: 상태 변화를 시각적으로 연결
- **주의 유도**: 중요한 변화에 집중
- **인지 부하 감소**: 자연스러운 흐름

---

## 1. Presence Animations

### 1.1 Mount/Unmount Animations

#### 설명
컴포넌트가 DOM에 추가/제거될 때 애니메이션을 적용합니다.

#### 구현 예제 (CSS)

```tsx
import { useState } from 'react';
import './FadeIn.css';

export function FadeInComponent() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {show && (
        <div className="fade-in">
          <p>This content fades in</p>
        </div>
      )}
    </div>
  );
}
```

```css
/* FadeIn.css */
.fade-in {
  animation: fadeIn 300ms ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 1.2 Framer Motion Presence

#### 설명
Framer Motion의 AnimatePresence를 사용한 고급 presence 애니메이션입니다.

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function MotionPresence() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle</button>
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>Animated content</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### 1.3 Custom usePresence Hook

#### 설명
DOM에서 제거되기 전 exit 애니메이션을 재생하는 커스텀 훅입니다.

```tsx
import { useState, useEffect } from 'react';

interface UsePresenceOptions {
  duration?: number;
}

export function usePresence(isVisible: boolean, options: UsePresenceOptions = {}) {
  const { duration = 300 } = options;
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsAnimating(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const state = isVisible ? 'entering' : isAnimating ? 'exiting' : 'exited';

  return { shouldRender, state };
}

// 사용 예제
function AnimatedModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { shouldRender, state } = usePresence(isOpen, { duration: 300 });

  if (!shouldRender) return null;

  return (
    <div
      className={`modal ${state}`}
      style={{
        opacity: state === 'entering' ? 1 : 0,
        transform: state === 'entering' ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 300ms, transform 300ms',
      }}
    >
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <p>Modal content</p>
      </div>
    </div>
  );
}
```

---

## 2. Transition Patterns

### 2.1 CSS Transitions

#### 설명
CSS transition 속성을 사용한 간단한 트랜지션입니다.

```tsx
export function HoverButton() {
  return (
    <button
      style={{
        padding: '12px 24px',
        background: 'var(--color-accent)',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'transform 200ms, box-shadow 200ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      Hover me
    </button>
  );
}
```

---

### 2.2 React Transition Group

#### 설명
React Transition Group 라이브러리를 사용한 트랜지션입니다.

```tsx
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Transition.css';

interface Item {
  id: string;
  text: string;
}

export function TransitionList({ items }: { items: Item[] }) {
  return (
    <TransitionGroup>
      {items.map((item) => (
        <CSSTransition key={item.id} timeout={300} classNames="item">
          <div className="item">{item.text}</div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
```

```css
/* Transition.css */
.item-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.item-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 300ms, transform 300ms;
}

.item-exit {
  opacity: 1;
  transform: translateX(0);
}

.item-exit-active {
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 300ms, transform 300ms;
}
```

---

### 2.3 Shared Layout Transitions

#### 설명
여러 컴포넌트 간 레이아웃 변화를 부드럽게 애니메이션합니다.

```tsx
import { motion, LayoutGroup } from 'framer-motion';
import { useState } from 'react';

export function SharedLayoutExample() {
  const [selected, setSelected] = useState<string | null>(null);

  const items = ['Item 1', 'Item 2', 'Item 3'];

  return (
    <LayoutGroup>
      <div style={{ display: 'flex', gap: '8px' }}>
        {items.map((item) => (
          <motion.div
            key={item}
            layout
            onClick={() => setSelected(item)}
            style={{
              padding: '12px 24px',
              background: selected === item ? 'var(--color-accent)' : 'var(--color-surface-base)',
              color: selected === item ? 'white' : 'var(--color-text-primary)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
            transition={{ duration: 0.3 }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </LayoutGroup>
  );
}
```

---

## 3. Gesture Animations

### 3.1 Drag and Drop

#### 설명
드래그 가능한 요소를 애니메이션과 함께 구현합니다.

```tsx
import { motion } from 'framer-motion';

export function DraggableCard() {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      style={{
        width: '200px',
        height: '200px',
        background: 'var(--color-surface-base)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
      }}
    >
      Drag me
    </motion.div>
  );
}
```

---

### 3.2 Swipe to Dismiss

#### 설명
스와이프 제스처로 요소를 제거하는 패턴입니다.

```tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface SwipeCardProps {
  onDismiss: () => void;
  children: React.ReactNode;
}

export function SwipeCard({ onDismiss, children }: SwipeCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onDismiss();
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{
        x,
        opacity,
        padding: '16px',
        background: 'white',
        borderRadius: '8px',
        marginBottom: '8px',
        cursor: 'grab',
      }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 4. Scroll Animations

### 4.1 Scroll-triggered Fade In

#### 설명
요소가 뷰포트에 들어올 때 페이드인 애니메이션을 적용합니다.

```tsx
import { useEffect, useRef, useState } from 'react';

export function useInView(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, isInView };
}

// 사용 예제
export function ScrollFadeIn({ children }: { children: React.ReactNode }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 600ms, transform 600ms',
      }}
    >
      {children}
    </div>
  );
}
```

---

### 4.2 Parallax Scroll

#### 설명
스크롤에 따라 요소가 다른 속도로 움직이는 패럴랙스 효과입니다.

```tsx
import { useEffect, useState } from 'react';

export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setOffset(window.pageYOffset * speed);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
}

// 사용 예제
export function ParallaxSection() {
  const offset = useParallax(0.3);

  return (
    <div
      style={{
        height: '500px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          transform: `translateY(${offset}px)`,
          background: 'var(--color-surface-elevated)',
          padding: '40px',
          borderRadius: '12px',
        }}
      >
        <h2>Parallax Content</h2>
        <p>This moves slower than the scroll</p>
      </div>
    </div>
  );
}
```

---

### 4.3 Scroll Progress Indicator

#### 설명
스크롤 진행률을 시각적으로 표시합니다.

```tsx
import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

// 사용 예제
export function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'var(--color-surface-elevated)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--color-accent)',
          transition: 'width 100ms',
        }}
      />
    </div>
  );
}
```

---

## 5. Loading Animations

### 5.1 Spinner

#### 설명
로딩 상태를 표시하는 회전 스피너입니다.

```tsx
export function Spinner({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `${size / 10}px solid var(--color-border-default)`,
        borderTop: `${size / 10}px solid var(--color-accent)`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
}

// CSS
// @keyframes spin {
//   to { transform: rotate(360deg); }
// }
```

---

### 5.2 Skeleton

#### 설명
콘텐츠 로딩 중 플레이스홀더를 표시하는 스켈레톤 UI입니다.

```tsx
export function Skeleton({ width = '100%', height = '20px' }: { width?: string; height?: string }) {
  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, var(--color-surface-sunken) 25%, var(--color-surface-base) 50%, var(--color-surface-sunken) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
      }}
    />
  );
}

// CSS
// @keyframes shimmer {
//   0% { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }

// 사용 예제
export function SkeletonCard() {
  return (
    <div style={{ padding: '16px', border: '1px solid var(--color-border-default)', borderRadius: '8px' }}>
      <Skeleton width="60%" height="24px" />
      <div style={{ marginTop: '12px' }}>
        <Skeleton width="100%" height="16px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" />
      </div>
    </div>
  );
}
```

---

### 5.3 Progress Bar

#### 설명
작업 진행률을 표시하는 프로그레스 바입니다.

```tsx
interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  animated?: boolean;
}

export function ProgressBar({ progress, height = 8, animated = true }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        width: '100%',
        height,
        background: 'var(--color-surface-sunken)',
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          background: 'var(--color-accent)',
          transition: animated ? 'width 300ms ease-out' : 'none',
        }}
      />
    </div>
  );
}
```

---

## 6. Accessibility Considerations

### 6.1 prefers-reduced-motion

#### 설명
사용자가 애니메이션을 선호하지 않을 때 애니메이션을 비활성화합니다.

```tsx
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// 사용 예제
export function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
      }}
    >
      Content
    </motion.div>
  );
}
```

---

### 6.2 CSS Media Query

```css
/* 기본 애니메이션 */
.animated {
  transition: transform 300ms, opacity 300ms;
}

/* prefers-reduced-motion이 활성화된 경우 */
@media (prefers-reduced-motion: reduce) {
  .animated {
    transition: none;
    animation: none;
  }
}
```

---

## 구현 우선순위

### 🔴 High Priority (즉시 구현)
1. **Fade In/Out** - 기본 presence 애니메이션
2. **Loading Spinner/Skeleton** - 로딩 상태 필수
3. **prefers-reduced-motion** - 접근성 필수

### 🟡 Medium Priority
4. **Scroll Animations** - 사용자 경험 향상
5. **Hover/Focus States** - 인터랙션 피드백

### 🟢 Low Priority
6. **Gesture Animations** - 고급 인터랙션
7. **Parallax** - 시각적 효과

---

## 참고 자료

### 주요 라이브러리
- **Framer Motion**: https://www.framer.com/motion/
- **React Spring**: https://www.react-spring.dev/
- **React Transition Group**: https://reactcommunity.org/react-transition-group/
- **Auto Animate**: https://auto-animate.formkit.com/
- **GSAP**: https://greensock.com/gsap/

### 아티클
- **MDN - Web Animations API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
- **CSS Tricks - Animation Guide**: https://css-tricks.com/almanac/properties/a/animation/
- **Web.dev - Animations**: https://web.dev/animations/

### 관련 문서
- [Behavior Patterns](01-behavior-patterns.md)
- [Accessibility Patterns](02-accessibility-patterns.md)
