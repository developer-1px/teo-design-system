# Performance Patterns (성능 패턴)

React 애플리케이션의 성능을 최적화하는 패턴입니다.

---

## 개요

Performance Patterns는 **렌더링 성능과 번들 크기를 최적화**하는 기법입니다. 불필요한 리렌더링 방지, 코드 분할, 메모이제이션 등을 다룹니다.

### 왜 필요한가?
- **사용자 경험**: 빠른 로딩과 부드러운 인터랙션
- **리소스 절약**: 불필요한 연산 방지
- **확장성**: 대규모 애플리케이션 대응
- **접근성**: 저사양 기기 지원

---

## 1. Memoization Patterns

### 1.1 React.memo

#### 설명
Props가 변경되지 않으면 컴포넌트 리렌더링을 방지합니다.

#### 구현 예제

```tsx
import { memo } from 'react';

interface ListItemProps {
  id: string;
  title: string;
  description: string;
  onClick: (id: string) => void;
}

// ❌ Before: 부모가 리렌더링되면 항상 리렌더링
function ListItem({ id, title, description, onClick }: ListItemProps) {
  console.log('ListItem rendered:', id);
  return (
    <div onClick={() => onClick(id)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// ✅ After: Props가 같으면 리렌더링 스킵
export const MemoizedListItem = memo(ListItem);

// 커스텀 비교 함수
export const ListItemWithCustomCompare = memo(ListItem, (prevProps, nextProps) => {
  // true를 반환하면 리렌더링 스킵
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description
  );
});
```

---

### 1.2 useMemo

#### 설명
비용이 큰 계산 결과를 메모이제이션합니다.

```tsx
import { useMemo } from 'react';

interface DataTableProps {
  data: Array<{ id: string; name: string; value: number }>;
  filterText: string;
}

export function DataTable({ data, filterText }: DataTableProps) {
  // ❌ Bad: 매 렌더링마다 필터링 수행
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // ✅ Good: filterText나 data가 변경될 때만 계산
  const filteredDataMemo = useMemo(() => {
    console.log('Filtering data...');
    return data.filter((item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [data, filterText]);

  // ✅ Good: 복잡한 통계 계산 메모이제이션
  const statistics = useMemo(() => {
    console.log('Calculating statistics...');
    return {
      total: filteredDataMemo.reduce((sum, item) => sum + item.value, 0),
      average: filteredDataMemo.length > 0
        ? filteredDataMemo.reduce((sum, item) => sum + item.value, 0) / filteredDataMemo.length
        : 0,
      max: Math.max(...filteredDataMemo.map((item) => item.value)),
      min: Math.min(...filteredDataMemo.map((item) => item.value)),
    };
  }, [filteredDataMemo]);

  return (
    <div>
      <div>Total: {statistics.total}</div>
      <div>Average: {statistics.average}</div>
      {filteredDataMemo.map((item) => (
        <div key={item.id}>{item.name}: {item.value}</div>
      ))}
    </div>
  );
}
```

---

### 1.3 useCallback

#### 설명
함수를 메모이제이션하여 자식 컴포넌트의 불필요한 리렌더링을 방지합니다.

```tsx
import { useState, useCallback, memo } from 'react';

interface ChildProps {
  onItemClick: (id: string) => void;
}

const Child = memo(({ onItemClick }: ChildProps) => {
  console.log('Child rendered');
  return <button onClick={() => onItemClick('123')}>Click</button>;
});

export function Parent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<string[]>([]);

  // ❌ Bad: 매 렌더링마다 새 함수 생성 → Child 리렌더링
  const handleItemClick = (id: string) => {
    console.log('Item clicked:', id);
  };

  // ✅ Good: 함수 메모이제이션 → Child 리렌더링 방지
  const handleItemClickMemo = useCallback((id: string) => {
    console.log('Item clicked:', id);
    setItems((prev) => [...prev, id]);
  }, []); // 의존성 배열 비어있음 → 함수 변경 안 됨

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onItemClick={handleItemClickMemo} />
    </div>
  );
}
```

---

## 2. Code Splitting

### 2.1 React.lazy

#### 설명
컴포넌트를 동적으로 로드하여 초기 번들 크기를 줄입니다.

```tsx
import { lazy, Suspense } from 'react';

// ❌ Bad: 모든 페이지를 초기에 로드
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// ✅ Good: 필요할 때만 로드
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Suspense>
  );
}
```

---

### 2.2 Route-based Splitting

#### 설명
라우트별로 코드를 분할하여 페이지 전환 시 필요한 코드만 로드합니다.

```tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Route 컴포넌트들을 lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));

// 로딩 컴포넌트
function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Loading page...</div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

### 2.3 Component-based Splitting

#### 설명
무거운 컴포넌트를 필요할 때만 로드합니다.

```tsx
import { lazy, Suspense, useState } from 'react';

// 무거운 차트 라이브러리는 필요할 때만 로드
const ChartComponent = lazy(() => import('./components/ChartComponent'));
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));

export function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <ChartComponent />
        </Suspense>
      )}

      <button onClick={() => setShowEditor(true)}>Show Editor</button>
      {showEditor && (
        <Suspense fallback={<div>Loading editor...</div>}>
          <RichTextEditor />
        </Suspense>
      )}
    </div>
  );
}
```

---

## 3. Lazy Loading

### 3.1 Intersection Observer

#### 설명
뷰포트에 들어올 때 컴포넌트를 로드합니다.

```tsx
import { useEffect, useRef, useState } from 'react';

export function useLazyLoad(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // 한 번만 로드
        }
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// 사용 예제
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, isVisible } = useLazyLoad();

  return (
    <div ref={ref} style={{ minHeight: '200px' }}>
      {isVisible ? (
        <img src={src} alt={alt} style={{ width: '100%' }} />
      ) : (
        <div style={{ background: '#eee', height: '200px' }}>Loading...</div>
      )}
    </div>
  );
}
```

---

### 3.2 Native Lazy Loading

#### 설명
브라우저 네이티브 이미지 lazy loading을 사용합니다.

```tsx
export function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy" // 네이티브 lazy loading
      decoding="async" // 비동기 디코딩
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
```

---

## 4. Windowing/Virtualization

### 4.1 Virtual List

#### 설명
화면에 보이는 항목만 렌더링하여 대량의 데이터를 효율적으로 표시합니다.

```tsx
import { useState, useRef, useEffect } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 보이는 영역 계산
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
  const visibleItems = items.slice(startIndex, endIndex);

  // 전체 높이
  const totalHeight = items.length * itemHeight;

  // 스크롤 이벤트 핸들러
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* 전체 높이를 유지하는 spacer */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* 보이는 항목만 렌더링 */}
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                width: '100%',
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 사용 예제
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

  return (
    <VirtualList
      items={items}
      itemHeight={50}
      containerHeight={600}
      renderItem={(item) => (
        <div style={{ padding: '12px', border: '1px solid #ddd' }}>
          {item.name}
        </div>
      )}
    />
  );
}
```

---

### 4.2 React Window (라이브러리)

#### 설명
React Window 라이브러리를 사용한 가상화입니다.

```tsx
import { FixedSizeList } from 'react-window';

interface Item {
  id: string;
  name: string;
}

export function VirtualizedList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <div style={{ padding: '12px', border: '1px solid #ddd' }}>
        {items[index].name}
      </div>
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

## 5. Debouncing & Throttling

### 5.1 useDebounce

#### 설명
입력이 멈춘 후 일정 시간이 지나면 함수를 실행합니다.

```tsx
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 사용 예제 (검색)
export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API 호출은 500ms 후에만 실행
      console.log('Searching for:', debouncedSearchTerm);
      fetch(`/api/search?q=${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

### 5.2 useThrottle

#### 설명
일정 시간 간격으로만 함수를 실행합니다.

```tsx
import { useRef, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

// 사용 예제 (스크롤 이벤트)
export function ScrollTracker() {
  const handleScroll = useThrottle(() => {
    console.log('Scroll position:', window.pageYOffset);
    // 무거운 작업 (예: analytics tracking)
  }, 1000);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <div style={{ height: '200vh' }}>Scroll down...</div>;
}
```

---

## 6. Bundle Optimization

### 6.1 Tree Shaking

#### 설명
사용하지 않는 코드를 번들에서 제거합니다.

```tsx
// ❌ Bad: 전체 라이브러리 import
import _ from 'lodash';
import * as Icons from 'lucide-react';

const result = _.debounce(fn, 500);
const icon = <Icons.Home />;

// ✅ Good: 필요한 것만 import
import debounce from 'lodash/debounce';
import { Home } from 'lucide-react';

const result = debounce(fn, 500);
const icon = <Home />;
```

---

### 6.2 Dynamic Imports

#### 설명
조건부로 모듈을 로드합니다.

```tsx
export async function handleExport(format: 'pdf' | 'csv') {
  if (format === 'pdf') {
    const { exportToPDF } = await import('./exporters/pdfExporter');
    exportToPDF(data);
  } else {
    const { exportToCSV } = await import('./exporters/csvExporter');
    exportToCSV(data);
  }
}
```

---

## 7. State Management Optimization

### 7.1 Context Splitting

#### 설명
Context를 분리하여 불필요한 리렌더링을 방지합니다.

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// ❌ Bad: 하나의 큰 Context
interface AppContextValue {
  user: User;
  theme: Theme;
  notifications: Notification[];
  setUser: (user: User) => void;
  setTheme: (theme: Theme) => void;
  addNotification: (notification: Notification) => void;
}

// ✅ Good: Context 분리
const UserContext = createContext<{ user: User; setUser: (user: User) => void } | null>(null);
const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void } | null>(null);
const NotificationsContext = createContext<{
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
} | null>(null);

// Theme만 사용하는 컴포넌트는 Theme Context만 구독
function ThemedButton() {
  const { theme } = useContext(ThemeContext)!;
  return <button style={{ background: theme.primaryColor }}>Click</button>;
}
```

---

### 7.2 Atomic State

#### 설명
상태를 작은 단위로 분리하여 관리합니다.

```tsx
import { atom, useAtom } from 'jotai';

// ❌ Bad: 큰 객체 상태
const [state, setState] = useState({
  user: { name: '', email: '' },
  settings: { theme: 'light', language: 'en' },
  ui: { sidebarOpen: false, modalOpen: false },
});

// ✅ Good: Atomic state (Jotai)
const userAtom = atom({ name: '', email: '' });
const themeAtom = atom('light');
const languageAtom = atom('en');
const sidebarOpenAtom = atom(false);

// 각 컴포넌트는 필요한 atom만 구독
function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle</button>;
}
```

---

## 8. Measurement & Profiling

### 8.1 React DevTools Profiler

#### 설명
React DevTools의 Profiler를 사용하여 성능 병목 지점을 찾습니다.

```tsx
// 프로파일링을 위해 컴포넌트에 id 추가
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

export function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}
```

---

### 8.2 Performance Monitoring

#### 설명
Web Vitals를 측정하여 성능을 모니터링합니다.

```tsx
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  onCLS(console.log); // Cumulative Layout Shift
  onFID(console.log); // First Input Delay
  onFCP(console.log); // First Contentful Paint
  onLCP(console.log); // Largest Contentful Paint
  onTTFB(console.log); // Time to First Byte
}

// main.tsx
reportWebVitals();
```

---

## 구현 우선순위

### 🔴 High Priority (즉시 구현)
1. **React.memo** - 불필요한 리렌더링 방지
2. **useMemo/useCallback** - 비용 큰 계산 최적화
3. **Code Splitting (Route-based)** - 초기 로딩 개선

### 🟡 Medium Priority
4. **Debouncing** - 입력 이벤트 최적화
5. **Lazy Loading** - 이미지/컴포넌트 지연 로딩
6. **Context Splitting** - 전역 상태 최적화

### 🟢 Low Priority
7. **Virtualization** - 대용량 리스트 (필요 시)
8. **Tree Shaking** - 번들 크기 최적화

---

## 참고 자료

### 주요 라이브러리
- **React Window**: https://react-window.vercel.app/
- **React Virtualized**: https://bvaughn.github.io/react-virtualized/
- **web-vitals**: https://github.com/GoogleChrome/web-vitals
- **Jotai**: https://jotai.org/
- **Zustand**: https://zustand-demo.pmnd.rs/

### 아티클
- **React Docs - Performance Optimization**: https://react.dev/learn/render-and-commit
- **Web.dev - Performance**: https://web.dev/performance/
- **Kent C. Dodds - Fix the slow render**: https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render

### 도구
- **React DevTools Profiler**: https://react.dev/learn/react-developer-tools
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **webpack-bundle-analyzer**: https://github.com/webpack-contrib/webpack-bundle-analyzer

### 관련 문서
- [Data Patterns](./03-data-patterns.md)
- [State Patterns](./05-state-patterns.md)
