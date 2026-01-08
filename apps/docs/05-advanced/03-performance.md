# 성능 최적화: 빠르고 효율적인 UI 만들기 ⚡

**예상 소요 시간**: 16분
**난이도**: ⭐⭐⭐⭐⭐ 최고급
**사전 지식**: 전체 Level 0-4

---

## 이 문서를 읽고 나면

- IDDL 렌더링 성능을 최적화할 수 있습니다
- 불필요한 리렌더링을 방지할 수 있습니다
- 대용량 데이터를 효율적으로 처리할 수 있습니다

---

## IDDL 성능 원칙

> **"선언적 의도, 최적화는 렌더러가"**

IDDL은 의도를 선언하고, 렌더러가 최적화를 담당합니다.

**핵심 전략**:
```
1. 가상 스크롤링 (Virtualization)
2. 지연 로딩 (Lazy Loading)
3. 메모이제이션 (Memoization)
4. 조건부 렌더링 (Conditional Rendering)
```

---

## 1. 가상 스크롤링

### 문제

```json
{
  "type": "Group",
  "role": "Table",
  "children": [...]  // 10,000개 행 → 느림
}
```

❌ **모든 행을 한 번에 렌더링** → 느린 초기 로드, 많은 메모리 사용

---

### 해결

```json
{
  "type": "Group",
  "role": "Table",
  "virtualized": true,  // ← 가상 스크롤링 활성화
  "rowHeight": 48,      // ← 행 높이 (px)
  "overscan": 5,        // ← 버퍼 행 개수
  "children": [...]
}
```

✅ **보이는 영역만 렌더링** → 빠른 로드, 적은 메모리

**렌더링**:
```
화면에 20개 행만 보임 → 25개만 렌더링 (20 + 5 overscan)
스크롤 → 필요한 행만 동적 렌더링
```

---

## 2. 지연 로딩

### 탭 지연 로딩

```json
{
  "type": "Group",
  "role": "Tabs",
  "lazyLoad": true,  // ← 활성 탭만 로드
  "children": [
    {
      "type": "Group",
      "id": "tab-1",
      "label": "Profile",
      "children": [...]  // 즉시 로드
    },
    {
      "type": "Group",
      "id": "tab-2",
      "label": "Orders",
      "children": [...]  // 탭 클릭 시 로드
    },
    {
      "type": "Group",
      "id": "tab-3",
      "label": "Activity",
      "children": [...]  // 탭 클릭 시 로드
    }
  ]
}
```

---

### 이미지 지연 로딩

```json
{
  "type": "Field",
  "label": "Product Image",
  "model": "product.image",
  "dataType": "image",
  "lazy": true,          // ← 뷰포트에 들어올 때 로드
  "placeholder": "/placeholder.jpg"
}
```

---

### 무한 스크롤

```json
{
  "type": "Group",
  "role": "List",
  "infiniteScroll": true,
  "pageSize": 20,
  "loadMore": {
    "action": "command",
    "endpoint": "/api/items?page={page}",
    "method": "GET"
  },
  "children": [...]
}
```

**동작**:
```
1. 초기 20개 로드
2. 스크롤 하단 도달 → 다음 20개 로드
3. 이전 데이터 유지
```

---

## 3. 메모이제이션

### 컴포넌트 메모이제이션

```typescript
// 렌더러 구현
import { memo } from 'react';

export const MemoizedField = memo(
  function Field(props: FieldProps) {
    return <FieldComponent {...props} />;
  },
  (prevProps, nextProps) => {
    // props 변경 없으면 리렌더링 스킵
    return (
      prevProps.model === nextProps.model &&
      prevProps.value === nextProps.value
    );
  }
);
```

---

### 데이터 캐싱

```json
{
  "type": "Group",
  "role": "Table",
  "cacheKey": "users-list",  // ← 캐시 키
  "cacheDuration": 300000,   // ← 5분 (ms)
  "children": [...]
}
```

**동작**:
```
1. 첫 로드: API 호출
2. 5분 내 재방문: 캐시된 데이터 사용
3. 5분 후: 새로 API 호출
```

---

## 4. 조건부 렌더링 최적화

### ❌ 나쁜 예

```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "hidden": "!isAdmin",  // ← 렌더링은 되지만 숨김
      "children": [...]      // ← 불필요한 렌더링
    }
  ]
}
```

---

### ✅ 좋은 예

```json
{
  "type": "Group",
  "role": "Container",
  "children": "$isAdmin ? adminCard : null",  // ← 조건부로 포함
  "adminCard": {
    "type": "Group",
    "role": "Card",
    "children": [...]  // ← isAdmin=true일 때만 렌더링
  }
}
```

---

## 5. 대용량 테이블 최적화

### 패턴 1: 페이지네이션

```json
{
  "type": "Group",
  "role": "Table",
  "pagination": {
    "pageSize": 50,
    "currentPage": 1,
    "totalPages": 100,
    "onChange": {
      "action": "command",
      "endpoint": "/api/items?page={page}&size=50"
    }
  },
  "children": [...]
}
```

---

### 패턴 2: 서버 사이드 정렬/필터

```json
{
  "type": "Group",
  "role": "Table",
  "serverSide": true,  // ← 서버에서 처리
  "filters": {
    "search": "filters.search",
    "status": "filters.status"
  },
  "sorting": {
    "field": "sorting.field",
    "order": "sorting.order"
  },
  "onFilterChange": {
    "action": "command",
    "endpoint": "/api/items?search={search}&status={status}&sortBy={field}&order={order}"
  },
  "children": [...]
}
```

---

### 패턴 3: 컬럼 가상화

```json
{
  "type": "Group",
  "role": "Table",
  "virtualizeColumns": true,  // ← 보이는 컬럼만 렌더링
  "columnWidth": 150,
  "children": [
    // 100개 컬럼이지만 보이는 5-10개만 렌더링
    ...Array.from({ length: 100 }, (_, i) => ({
      "type": "Field",
      "label": `Column ${i}`,
      "model": `item.col${i}`
    }))
  ]
}
```

---

## 6. 번들 크기 최적화

### 코드 스플리팅

```typescript
// 렌더러 구현
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

export function renderNode(node: IDDLNode) {
  if (node.type === 'myapp:Chart') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <HeavyChart {...node} />
      </Suspense>
    );
  }
}
```

---

### Tree Shaking

```typescript
// ❌ Bad: 전체 라이브러리 import
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Good: 필요한 것만 import
import debounce from 'lodash/debounce';
debounce(fn, 300);
```

---

## 7. 실시간 업데이트 최적화

### Debounce

```json
{
  "type": "Field",
  "label": "Search",
  "model": "filters.search",
  "dataType": "text",
  "debounce": 500,  // ← 500ms 후 업데이트
  "onChange": {
    "action": "command",
    "endpoint": "/api/search?q={value}"
  }
}
```

---

### Throttle

```json
{
  "type": "Field",
  "model": "scroll.position",
  "throttle": 100,  // ← 100ms마다 최대 1회 업데이트
  "onChange": {
    "action": "command",
    "command": "trackScrollPosition"
  }
}
```

---

## 8. 성능 측정

### 렌더링 시간

```typescript
// 렌더러 구현
import { Profiler } from 'react';

export function IDDLRenderer({ spec }: { spec: IDDLSpec }) {
  return (
    <Profiler
      id="IDDL"
      onRender={(id, phase, actualDuration) => {
        console.log(`${id} (${phase}): ${actualDuration}ms`);
      }}
    >
      {renderSpec(spec)}
    </Profiler>
  );
}
```

---

### 메모리 사용량

```typescript
// 개발자 도구
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const memory = (performance as any).memory;
    console.log('Heap:', (memory.usedJSHeapSize / 1048576).toFixed(2), 'MB');
  }, 5000);
}
```

---

## 핵심 정리

### 렌더링 최적화

```
대용량 리스트 → virtualized=true
탭 → lazyLoad=true
이미지 → lazy=true
테이블 → pagination + serverSide
```

### 데이터 최적화

```
캐싱 → cacheKey + cacheDuration
메모이제이션 → memo()
조건부 렌더링 → hidden보다는 조건부 포함
```

### 네트워크 최적화

```
Debounce → 검색 입력 (500ms)
Throttle → 스크롤 추적 (100ms)
무한 스크롤 → 필요할 때만 로드
```

### 번들 최적화

```
Code Splitting → lazy()
Tree Shaking → 필요한 것만 import
```

### Best Practice

```
✓ 가상 스크롤링 (1000+ 행)
✓ 페이지네이션 (100+ 행)
✓ 이미지 lazy loading
✓ 탭 lazy loading
✓ 검색 debounce (500ms)
✓ 서버 사이드 필터/정렬
✗ 모든 데이터 한 번에 로드 금지
✗ hidden으로 대용량 데이터 숨김 금지
```

---

## 성능 체크리스트

### 초기 로드

```
□ 번들 크기 < 200KB (gzipped)
□ 초기 렌더링 < 1초
□ First Contentful Paint < 1.5초
□ Time to Interactive < 3초
```

### 런타임

```
□ 리렌더링 < 16ms (60 FPS)
□ 메모리 사용량 < 50MB
□ 1000+ 행 테이블도 부드러운 스크롤
```

### 네트워크

```
□ API 응답 시간 < 500ms
□ 불필요한 요청 없음
□ 캐싱 적절히 사용
```

---

## 다음 단계

성능 최적화를 완벽히 이해했습니다!
이제 **접근성(Accessibility)**을 배워봅시다.

**다음**: [접근성 →](./04-accessibility.md)

---

**이전**: [← 반응형 디자인](./02-responsive-design.md)
**다음**: [접근성 →](./04-accessibility.md)
