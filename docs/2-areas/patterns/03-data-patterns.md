# Data Patterns (데이터 처리 패턴)

대용량 데이터를 효율적으로 처리하고 표시하는 패턴입니다.

---

## 개요

Data Patterns는 **데이터 로딩, 렌더링, 조작**을 최적화하는 패턴입니다. 특히 대용량 리스트, 테이블, 그리드에서 성능을 보장합니다.

### 왜 필요한가?
- **성능**: 수천 개 항목도 부드럽게 렌더링
- **메모리 효율**: 필요한 만큼만 DOM에 렌더링
- **사용자 경험**: 빠른 로딩과 부드러운 스크롤
- **데이터 관리**: 효율적인 정렬, 필터링, 검색

---

## 1. Virtualization Patterns

### 1.1 VirtualList

#### 설명
뷰포트에 보이는 항목만 렌더링하여 성능을 최적화합니다.

#### 사용 시기
- 1000개 이상의 리스트 항목
- 실시간 로그 뷰어
- 채팅 메시지 리스트
- 파일 탐색기

#### 구현 예제
```tsx
export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);

  // Overscan으로 부드러운 스크롤
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(items.length, visibleEnd + overscan);

  const visibleItems = items.slice(start, end).map((item, index) => ({
    item,
    index: start + index,
    offsetTop: (start + index) * itemHeight,
  }));

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}

// 사용 예제
function VirtualizedList({ items }: { items: Item[] }) {
  const { visibleItems, totalHeight, onScroll } = useVirtualList({
    items,
    itemHeight: 50,
    containerHeight: 600,
  });

  return (
    <div style={{ height: 600, overflow: 'auto' }} onScroll={onScroll}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, offsetTop }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offsetTop,
              left: 0,
              right: 0,
              height: 50,
            }}
          >
            <ItemComponent item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 1.2 VirtualGrid

#### 설명
2D 그리드를 가상화합니다.

#### 사용 시기
- 이미지 갤러리
- 제품 목록
- 데이터 그리드

#### 구현 예제
```tsx
export function useVirtualGrid<T>({
  items,
  columns,
  rowHeight,
  columnWidth,
  containerWidth,
  containerHeight,
}: {
  items: T[];
  columns: number;
  rowHeight: number;
  columnWidth: number;
  containerWidth: number;
  containerHeight: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const totalRows = Math.ceil(items.length / columns);

  const visibleRowStart = Math.floor(scrollTop / rowHeight);
  const visibleRowEnd = Math.ceil((scrollTop + containerHeight) / rowHeight);
  const visibleColStart = Math.floor(scrollLeft / columnWidth);
  const visibleColEnd = Math.ceil((scrollLeft + containerWidth) / columnWidth);

  const visibleItems: Array<{
    item: T;
    row: number;
    col: number;
    top: number;
    left: number;
  }> = [];

  for (let row = visibleRowStart; row < visibleRowEnd; row++) {
    for (let col = visibleColStart; col < visibleColEnd; col++) {
      const index = row * columns + col;
      if (index < items.length) {
        visibleItems.push({
          item: items[index],
          row,
          col,
          top: row * rowHeight,
          left: col * columnWidth,
        });
      }
    }
  }

  return {
    visibleItems,
    totalHeight: totalRows * rowHeight,
    totalWidth: columns * columnWidth,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
      setScrollLeft(e.currentTarget.scrollLeft);
    },
  };
}
```

---

## 2. Pagination Patterns

### 2.1 Client-side Pagination

#### 설명
전체 데이터를 클라이언트에서 페이지로 나눕니다.

#### 구현 예제
```tsx
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNext = () => goToPage(currentPage + 1);
  const goToPrev = () => goToPage(currentPage - 1);

  return {
    currentItems,
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    goToPage,
    goToNext,
    goToPrev,
  };
}

// IDDL 통합
function PaginatedList({ items }: { items: Item[] }) {
  const { currentItems, currentPage, totalPages, hasNext, hasPrev, goToNext, goToPrev } =
    usePagination(items, 20);

  return (
    <>
      <Group role="List">
        {currentItems.map((item) => (
          <Action key={item.id} variant="list-item">
            {item.title}
          </Action>
        ))}
      </Group>

      <Group role="Pagination">
        <Action variant="secondary" onClick={goToPrev} disabled={!hasPrev}>
          Previous
        </Action>
        <Text role="Caption">
          Page {currentPage} of {totalPages}
        </Text>
        <Action variant="secondary" onClick={goToNext} disabled={!hasNext}>
          Next
        </Action>
      </Group>
    </>
  );
}
```

---

### 2.2 Server-side Pagination

#### 설명
서버에서 페이지별 데이터를 가져옵니다.

#### 구현 예제
```tsx
export function useServerPagination<T>({
  fetchFn,
  pageSize = 10,
}: {
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>;
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    setLoading(true);
    fetchFn(page, pageSize)
      .then((result) => {
        setData(result.data);
        setTotal(result.total);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize, fetchFn]);

  return {
    data,
    loading,
    page,
    totalPages,
    goToPage: setPage,
    goToNext: () => setPage((p) => Math.min(p + 1, totalPages)),
    goToPrev: () => setPage((p) => Math.max(p - 1, 1)),
  };
}
```

---

## 3. Infinite Scroll Patterns

### 3.1 IntersectionObserver 방식

#### 설명
스크롤 끝에 도달하면 자동으로 다음 페이지를 로드합니다.

#### 구현 예제
```tsx
export function useInfiniteScroll<T>({
  fetchFn,
  pageSize = 20,
}: {
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; hasMore: boolean }>;
  pageSize?: number;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // 데이터 로드
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchFn(page, pageSize);
      setItems((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFn, pageSize]);

  // IntersectionObserver 설정
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  return { items, loading, hasMore, sentinelRef };
}

// 사용 예제
function InfiniteList() {
  const { items, loading, hasMore, sentinelRef } = useInfiniteScroll({
    fetchFn: async (page, pageSize) => {
      const response = await fetch(`/api/items?page=${page}&size=${pageSize}`);
      const data = await response.json();
      return { data: data.items, hasMore: data.hasMore };
    },
  });

  return (
    <Group role="List">
      {items.map((item) => (
        <Action key={item.id} variant="list-item">
          {item.title}
        </Action>
      ))}

      {/* Sentinel 요소 */}
      <div ref={sentinelRef} style={{ height: 20 }} />

      {loading && <Text role="Caption">Loading...</Text>}
      {!hasMore && <Text role="Caption">No more items</Text>}
    </Group>
  );
}
```

---

## 4. Data Transformation Patterns

### 4.1 Sorting

#### 구현 예제
```tsx
export function useSorting<T>(
  items: T[],
  initialKey: keyof T | null = null,
  initialDirection: 'asc' | 'desc' = 'asc'
) {
  const [sortKey, setSortKey] = useState<keyof T | null>(initialKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection);

  const sortedItems = useMemo(() => {
    if (!sortKey) return items;

    return [...items].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortKey, sortDirection]);

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return { sortedItems, sortKey, sortDirection, toggleSort };
}
```

---

### 4.2 Filtering

#### 구현 예제
```tsx
export function useFiltering<T>(
  items: T[],
  filters: Record<keyof T, (value: T[keyof T]) => boolean>
) {
  return useMemo(() => {
    return items.filter((item) => {
      return Object.entries(filters).every(([key, predicate]) => {
        return (predicate as (value: any) => boolean)(item[key as keyof T]);
      });
    });
  }, [items, filters]);
}

// 사용 예제
const filters = {
  status: (status: string) => status === 'active',
  price: (price: number) => price > 100,
};

const filteredItems = useFiltering(items, filters);
```

---

### 4.3 Search

#### 구현 예제
```tsx
export function useSearch<T>(items: T[], searchKeys: Array<keyof T>) {
  const [query, setQuery] = useState('');

  const searchedItems = useMemo(() => {
    if (!query) return items;

    const lowerQuery = query.toLowerCase();

    return items.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        if (typeof value === 'number') {
          return value.toString().includes(lowerQuery);
        }
        return false;
      });
    });
  }, [items, query, searchKeys]);

  return { searchedItems, query, setQuery };
}

// 사용 예제
function SearchableList({ items }: { items: Product[] }) {
  const { searchedItems, query, setQuery } = useSearch(items, ['name', 'description', 'sku']);

  return (
    <>
      <Field
        dataType="text"
        placeholder="Search products..."
        value={query}
        onChange={(value) => setQuery(value as string)}
      />

      <Group role="List">
        {searchedItems.map((item) => (
          <Action key={item.id} variant="list-item">
            {item.name}
          </Action>
        ))}
      </Group>
    </>
  );
}
```

---

### 4.4 Grouping

#### 구현 예제
```tsx
export function useGrouping<T>(items: T[], groupKey: keyof T) {
  return useMemo(() => {
    const groups = new Map<string, T[]>();

    items.forEach((item) => {
      const key = String(item[groupKey]);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });

    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      items,
    }));
  }, [items, groupKey]);
}

// 사용 예제
function GroupedList({ items }: { items: Task[] }) {
  const groups = useGrouping(items, 'status');

  return (
    <>
      {groups.map((group) => (
        <Section key={group.key} role="Container">
          <Text role="Title">{group.key}</Text>
          <Group role="List">
            {group.items.map((item) => (
              <Action key={item.id} variant="list-item">
                {item.title}
              </Action>
            ))}
          </Group>
        </Section>
      ))}
    </>
  );
}
```

---

## 5. 복합 패턴 예제

### 5.1 완전한 데이터 테이블

#### 설명
Sorting + Filtering + Pagination + Search를 결합합니다.

#### 구현 예제
```tsx
function DataTable<T>({ items, columns }: { items: T[]; columns: Column<T>[] }) {
  // 1. Search
  const { searchedItems, query, setQuery } = useSearch(
    items,
    columns.map((c) => c.key)
  );

  // 2. Filtering
  const [filters, setFilters] = useState({});
  const filteredItems = useFiltering(searchedItems, filters);

  // 3. Sorting
  const { sortedItems, sortKey, sortDirection, toggleSort } = useSorting(filteredItems);

  // 4. Pagination
  const { currentItems, currentPage, totalPages, goToNext, goToPrev } = usePagination(
    sortedItems,
    20
  );

  return (
    <div>
      {/* Search */}
      <Field
        dataType="text"
        placeholder="Search..."
        value={query}
        onChange={(value) => setQuery(value as string)}
      />

      {/* Table */}
      <Group role="Table">
        {/* Header */}
        <Group role="Container">
          {columns.map((col) => (
            <Action
              key={String(col.key)}
              onClick={() => toggleSort(col.key)}
              aria-sort={sortKey === col.key ? sortDirection : undefined}
            >
              {col.label}
              {sortKey === col.key && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </Action>
          ))}
        </Group>

        {/* Body */}
        {currentItems.map((item, index) => (
          <Group key={index} role="Container">
            {columns.map((col) => (
              <Text key={String(col.key)} role="Body">
                {col.render ? col.render(item[col.key], item) : String(item[col.key])}
              </Text>
            ))}
          </Group>
        ))}
      </Group>

      {/* Pagination */}
      <Group role="Pagination">
        <Action onClick={goToPrev} disabled={currentPage === 1}>
          Previous
        </Action>
        <Text role="Caption">
          {currentPage} / {totalPages}
        </Text>
        <Action onClick={goToNext} disabled={currentPage === totalPages}>
          Next
        </Action>
      </Group>
    </div>
  );
}
```

---

## 구현 우선순위

### 🔴 High Priority
1. **Pagination** - 기본 데이터 표시
2. **Search** - 사용자 편의성
3. **Sorting** - 데이터 탐색

### 🟡 Medium Priority
4. **Filtering** - 고급 검색
5. **InfiniteScroll** - SNS 스타일 UI
6. **Grouping** - 데이터 조직화

### 🟢 Low Priority
7. **VirtualList** - 대용량 데이터 (1000+ 항목)
8. **VirtualGrid** - 이미지 갤러리

---

## 참고 자료

### 주요 라이브러리
- **TanStack Table**: https://tanstack.com/table/v8
- **TanStack Virtual**: https://tanstack.com/virtual/v3
- **react-window**: https://github.com/bvaughn/react-window
- **react-virtualized**: https://github.com/bvaughn/react-virtualized

### 관련 문서
- [Performance Patterns](./08-performance-patterns.md)
- [Component Role Mapping](../component-role-mapping.md)
