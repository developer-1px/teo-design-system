# Navigable: 키보드 네비게이션 Behavior

## 📋 요약

**Intent**: "사용자가 키보드만으로 모든 항목에 도달할 수 있어야 한다"

**Why**: 마우스 없이도 앱을 사용할 수 있어야 함 (접근성, 생산성, 파워유저)

**How**: Arrow keys, Tab, Home/End 등으로 포커스 이동

---

## Why: 왜 Navigable이 필요한가?

### 1. 접근성 (Accessibility)

```
시각장애인: 스크린리더로 항목 읽기 → Enter로 선택
운동장애인: 마우스 조작 어려움 → 키보드만으로 조작
```

**법적 요구사항**: WCAG 2.1 - 키보드 접근성 필수

### 2. 생산성 (Productivity)

```
마우스 사용:
  손 이동 (키보드 → 마우스) → 포인터 이동 → 클릭
  소요 시간: ~2초

키보드 사용:
  ↓ 키 누름 → 즉시 이동
  소요 시간: ~0.1초

속도 차이: 20배
```

### 3. 파워유저 경험

```
초보: 마우스로 클릭클릭
중급: 가끔 키보드 단축키 사용
고급: 손을 키보드에서 떼지 않음

VS Code, Figma, Notion 모두 키보드 중심 설계
```

---

## What: Navigable이 제공하는 것

### 1. 항목 간 이동 (Item Navigation)

```
↑↓  - List 항목 이동 (vertical)
←→  - Grid 열 이동 (horizontal)
Tab - 다음 포커스 가능 요소
Shift+Tab - 이전 포커스 가능 요소
```

### 2. 경계 이동 (Boundary Navigation)

```
Home - 첫 항목
End - 마지막 항목
Ctrl+Home - 최상단
Ctrl+End - 최하단
```

### 3. 페이지 이동 (Page Navigation)

```
PageUp - 한 화면 위로
PageDown - 한 화면 아래로
```

### 4. 검색 이동 (Search Navigation)

```
타이핑 - 첫 글자로 검색 (typeahead)
Ctrl+F - 검색 모드
```

---

## How: 어떻게 동작하는가?

### Pattern 1: List Navigation (1D - Vertical)

**Use case**: 파일 목록, 이메일 목록, 슬라이드 썸네일

```tsx
// PPT 썸네일 예제
<Block role="List" behavior={{ navigable: true }}>
  <Item>Slide 1</Item>
  <Item>Slide 2</Item>
  <Item>Slide 3</Item>
</Block>
```

**키보드 조작**:
```
현재: Slide 1
↓ 누름 → Slide 2로 포커스 이동
↓ 누름 → Slide 3으로 포커스 이동
↑ 누름 → Slide 2로 복귀
Home → Slide 1로 점프
End → Slide 3로 점프
```

**ARIA**:
```html
<div role="listbox" aria-activedescendant="slide-2">
  <div role="option" id="slide-1" aria-selected="false">Slide 1</div>
  <div role="option" id="slide-2" aria-selected="true">Slide 2</div>
  <div role="option" id="slide-3" aria-selected="false">Slide 3</div>
</div>
```

### Pattern 2: Grid Navigation (2D)

**Use case**: 아이콘 그리드, 이미지 갤러리, 칸반 보드

```tsx
<Block role="Grid" behavior={{ navigable: true }}>
  <Item>Cell 1-1</Item>
  <Item>Cell 1-2</Item>
  <Item>Cell 2-1</Item>
  <Item>Cell 2-2</Item>
</Block>
```

**키보드 조작**:
```
현재: Cell 1-1
→ 누름 → Cell 1-2
↓ 누름 → Cell 2-2
← 누름 → Cell 2-1
↑ 누름 → Cell 1-1
```

**ARIA**:
```html
<div role="grid">
  <div role="row">
    <div role="gridcell" tabindex="0">Cell 1-1</div>
    <div role="gridcell" tabindex="-1">Cell 1-2</div>
  </div>
  <div role="row">
    <div role="gridcell" tabindex="-1">Cell 2-1</div>
    <div role="gridcell" tabindex="-1">Cell 2-2</div>
  </div>
</div>
```

### Pattern 3: Tree Navigation (계층형)

**Use case**: 파일 트리, 폴더 구조, 아웃라인

```tsx
<Block role="Tree" behavior={{ navigable: true }}>
  <Item>
    📁 src
    <Item>📁 components</Item>
    <Item>📁 utils</Item>
  </Item>
  <Item>📁 docs</Item>
</Block>
```

**키보드 조작**:
```
현재: 📁 src (접힌 상태)
→ 누름 → 펼쳐짐 (children 보임)
↓ 누름 → 📁 components
← 누름 → 📁 src로 복귀 (접힘)
```

**ARIA**:
```html
<div role="tree">
  <div role="treeitem" aria-expanded="true">
    📁 src
    <div role="group">
      <div role="treeitem">📁 components</div>
      <div role="treeitem">📁 utils</div>
    </div>
  </div>
  <div role="treeitem" aria-expanded="false">📁 docs</div>
</div>
```

---

## IDDL API 설계

### Option 1: Behavior Prop (단순)

```tsx
<Block
  role="List"
  behavior={{
    navigable: true,  // ✅ "이 리스트는 키보드로 탐색 가능"
  }}
>
  {items.map(item => <Item key={item.id}>{item.name}</Item>)}
</Block>
```

**장점**: 간단, 명확
**단점**: 커스터마이징 어려움

### Option 2: Behavior Config (상세)

```tsx
<Block
  role="List"
  behavior={{
    navigable: {
      enabled: true,
      direction: 'vertical',  // 'vertical' | 'horizontal' | 'both'
      wrap: true,             // 끝에서 처음으로 순환
      homeEnd: true,          // Home/End 키 지원
      pageKeys: false,        // PageUp/Down 지원 안함
      typeahead: true,        // 타이핑으로 검색
    },
  }}
>
  {items.map(item => <Item key={item.id}>{item.name}</Item>)}
</Block>
```

**장점**: 세밀한 제어
**단점**: 복잡함

### Option 3: Role 기반 Default (추천)

```tsx
// role에 따라 자동으로 navigable 설정
<Block role="List">           {/* navigable: vertical, wrap: true */}
<Block role="Grid">           {/* navigable: both, wrap: false */}
<Block role="Tree">           {/* navigable: vertical + expand/collapse */}
<Block role="Toolbar">        {/* navigable: horizontal, wrap: true */}

// 명시적으로 override 가능
<Block
  role="List"
  behavior={{
    navigable: {
      wrap: false,  // 순환 비활성화
    },
  }}
>
```

**장점**: 간단하면서도 커스터마이징 가능
**단점**: role과 behavior 매핑 관리 필요

---

## 구현 패턴

### Hook: useNavigableCursor

**이미 존재하는 hook**: `src/shared/lib/keyboard/useNavigableCursor.ts`

```tsx
// 기존 구현 (참고)
export function useNavigableCursor<T>(items: T[]) {
  const [cursor, setCursor] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setCursor(prev => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      setCursor(prev => (prev - 1 + items.length) % items.length);
    }
  };

  return { cursor, handleKeyDown };
}
```

### Block 컴포넌트 통합

```tsx
// Block.tsx (새로운 구현)
export function Block({ role, behavior, children }: BlockProps) {
  const navigable = behavior?.navigable;

  if (navigable && role === 'List') {
    return <NavigableList {...props}>{children}</NavigableList>;
  }

  return <div>{children}</div>;
}

// NavigableList.tsx (새로운 컴포넌트)
function NavigableList({ children }: { children: ReactNode }) {
  const items = React.Children.toArray(children);
  const { cursor, handleKeyDown } = useNavigableCursor(items);

  return (
    <div
      role="listbox"
      onKeyDown={handleKeyDown}
      aria-activedescendant={`item-${cursor}`}
    >
      {items.map((item, index) => (
        <div
          key={index}
          id={`item-${index}`}
          role="option"
          aria-selected={cursor === index}
          data-focused={cursor === index}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

---

## 실제 예제: PPT 썸네일

### 요구사항

```
사용자 시나리오:
1. ↑↓로 슬라이드 탐색
2. Home/End로 첫/마지막 슬라이드
3. 포커스된 슬라이드는 시각적으로 강조
4. 스크린리더로 "Slide 3 of 10" 읽어줌
```

### IDDL 코드

```tsx
// AppPPT.tsx
<Block
  role="List"
  behavior={{
    navigable: true,  // ✅ 키보드 네비게이션 활성화
  }}
>
  {slides.map((slide, index) => (
    <Item key={slide.id} data-index={index}>
      <ThumbnailPreview slide={slide} />
      <Text role="Caption">{`Slide ${index + 1}`}</Text>
    </Item>
  ))}
</Block>
```

### 생성될 HTML

```html
<div
  role="listbox"
  aria-label="Slide thumbnails"
  aria-activedescendant="slide-2"
  tabindex="0"
>
  <div role="option" id="slide-0" aria-selected="false">
    <img src="..." alt="Slide 1 thumbnail" />
    <span>Slide 1</span>
  </div>
  <div role="option" id="slide-1" aria-selected="false">
    <img src="..." alt="Slide 2 thumbnail" />
    <span>Slide 2</span>
  </div>
  <div role="option" id="slide-2" aria-selected="true" data-focused="true">
    <img src="..." alt="Slide 3 thumbnail" />
    <span>Slide 3</span>
  </div>
</div>
```

### 시각적 피드백 (CSS)

```css
/* 포커스된 항목 강조 */
[role="option"][data-focused="true"] {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  background: var(--accent-subtle);
}

/* 선택된 항목 (Selectable과 조합 시) */
[role="option"][aria-selected="true"] {
  background: var(--accent-muted);
}
```

---

## 접근성 체크리스트

### WCAG 2.1 준수

- [x] 2.1.1 Keyboard: 모든 기능이 키보드로 가능
- [x] 2.1.2 No Keyboard Trap: 포커스가 갇히지 않음
- [x] 2.4.3 Focus Order: 포커스 순서가 논리적
- [x] 2.4.7 Focus Visible: 포커스 상태가 시각적으로 명확

### ARIA 패턴

**Listbox Pattern**:
- `role="listbox"` on container
- `role="option"` on items
- `aria-activedescendant` for focus management
- `aria-selected` for selection state

**Grid Pattern**:
- `role="grid"` on container
- `role="row"` on rows
- `role="gridcell"` on cells
- `tabindex` management (roving tabindex)

**Tree Pattern**:
- `role="tree"` on container
- `role="treeitem"` on items
- `aria-expanded` for expand/collapse state
- `aria-level` for hierarchy

---

## 키보드 네비게이션 매핑

| 키 | List | Grid | Tree | 설명 |
|----|------|------|------|------|
| **↑** | 이전 항목 | 위 행 | 이전 항목 | 위로 이동 |
| **↓** | 다음 항목 | 아래 행 | 다음 항목 | 아래로 이동 |
| **←** | - | 이전 열 | 접기 | 왼쪽 이동 |
| **→** | - | 다음 열 | 펼치기 | 오른쪽 이동 |
| **Home** | 첫 항목 | 첫 셀 | 첫 항목 | 처음으로 |
| **End** | 마지막 항목 | 마지막 셀 | 마지막 항목 | 끝으로 |
| **PageUp** | 한 화면 위 | - | - | 빠른 이동 |
| **PageDown** | 한 화면 아래 | - | - | 빠른 이동 |
| **Tab** | 다음 위젯 | 다음 위젯 | 다음 위젯 | 포커스 이탈 |

---

## 구현 우선순위

### Phase 1: List Navigation (PPT 썸네일)
- [x] `useNavigableCursor` hook (이미 존재)
- [ ] `NavigableList` 컴포넌트
- [ ] Block에 navigable behavior 통합
- [ ] ARIA 접근성 추가
- [ ] 시각적 피드백 (CSS)

### Phase 2: Grid Navigation
- [ ] `useGridNavigation` hook
- [ ] `NavigableGrid` 컴포넌트
- [ ] 2D arrow key 처리

### Phase 3: Tree Navigation
- [x] `useTreeNavigation` hook (이미 존재)
- [ ] `NavigableTree` 컴포넌트
- [ ] Expand/collapse 로직

---

## 다음 단계

1. **Navigable + Selectable 통합 문서** (`04-ppt-thumbnail-example.md`)
   - 두 behavior가 함께 동작하는 예제
   - PPT 썸네일 완전한 구현

2. **NavigableList 구현** (`src/components/types/Block/behaviors/NavigableList.tsx`)
   - useNavigableCursor 활용
   - ARIA 접근성 완전 구현
   - 시각적 피드백

3. **Block 컴포넌트 통합**
   - behavior.navigable prop 처리
   - role별 default behavior

---

**작성일**: 2026-01-11
**상태**: ✅ 스펙 완료
**다음**: Selectable 스펙 작성 (`03-selectable.md`)
