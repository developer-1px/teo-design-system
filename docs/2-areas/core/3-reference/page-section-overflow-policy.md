# Page-Section Overflow 정책

**버전**: IDDL v4.1
**최종 업데이트**: 2026-01-09
**상태**: ✅ Stable

## 핵심 원칙

### Page 책임 원칙 (Page Responsibility Principle)

```
Page가 template을 정의하고, template + role 조합이 overflow를 결정한다.
Section은 주어진 설정을 따를 뿐, 스스로 결정하지 않는다.
```

**Why Page?**
- Page는 전체 레이아웃의 주체 (App-like vs Page-like)
- Page는 template을 알고 있음 (studio, sidebar-content, 3-col, etc.)
- Section은 자신의 context를 모름 (어디에 배치될지 모름)

**Why NOT explicit override?**
- `overflow` prop을 제공하지 않음
- 명시적 override는 일관성을 해침
- Template + role 조합이 충분히 명확함

## 책임 분리

| 주체 | 책임 | 예시 |
|------|------|------|
| **Page** | Template 선택, Layout 정의 | `<Page role="App" template="studio">` |
| **role-config.ts** | Role별 overflow 정책 정의 | `PrimarySidebar: { overflow: 'auto' }` |
| **Section** | 주입받은 설정 적용 | `<Element className={cn(baseStyles, overflowClass)}>` |

## Overflow 타입

```typescript
type OverflowBehavior = 'auto' | 'hidden' | 'scroll' | 'visible';
```

### 1. `auto` - 조건부 스크롤

```css
overflow-y: auto;
```

**사용 케이스**:
- 내용이 많아질 수 있는 목록
- 사이드바, 네비게이션
- 터미널 출력

**특징**:
- 내용이 넘치면 스크롤바 표시
- 내용이 적으면 스크롤바 숨김
- 가장 자주 사용됨

**예시**:
```tsx
// Navigator - 파일 목록
<Section role="Navigator"> {/* overflow: auto */}
  <FileTree items={1000} />
</Section>

// Panel - 터미널 출력
<Section role="Panel"> {/* overflow: auto */}
  <TerminalOutput lines={10000} />
</Section>
```

### 2. `hidden` - 스크롤 없음

```css
overflow: hidden;
```

**사용 케이스**:
- 고정 높이 영역 (Header, Footer, Toolbar)
- 내부 컴포넌트가 자체 스크롤 관리 (Editor, Canvas)
- 넘침 방지

**특징**:
- 스크롤바 표시 안 함
- 넘치는 내용 잘림
- 내부 컴포넌트에 스크롤 위임

**예시**:
```tsx
// Toolbar - 고정 높이
<Section role="Toolbar"> {/* overflow: hidden */}
  <ToolbarButtons />
</Section>

// Editor - CodeMirror가 스크롤 관리
<Section role="Editor"> {/* overflow: hidden */}
  <CodeMirror /> {/* 내부에서 overflow: auto */}
</Section>
```

### 3. `scroll` - 강제 스크롤바

```css
overflow-y: scroll;
```

**사용 케이스**:
- 항상 스크롤바를 표시해야 하는 경우 (레이아웃 shift 방지)
- 드물게 사용됨

**특징**:
- 내용 여부와 관계없이 스크롤바 표시
- 레이아웃 안정성

**예시**:
```tsx
// 특수한 경우만 사용 (드물음)
<Section role="CustomList"> {/* overflow: scroll */}
  <List />
</Section>
```

### 4. `visible` - 넘침 허용

```css
overflow: visible;
```

**사용 케이스**:
- 드롭다운, 팝오버 (Overlay로 처리하는 것이 더 나음)
- 거의 사용 안 함

**특징**:
- 부모 영역을 벗어남
- 일반적으로 권장하지 않음

## Template별 Overflow 정책

### 1. studio (IDE/Studio)

```tsx
<Page role="App" template="studio">
  <Section role="Toolbar">...</Section>         {/* hidden */}
  <Section role="ActivityBar">...</Section>     {/* hidden */}
  <Section role="PrimarySidebar">...</Section>  {/* auto */}
  <Section role="Editor">...</Section>          {/* hidden */}
  <Section role="Panel">...</Section>           {/* auto */}
  <Section role="SecondarySidebar">...</Section> {/* auto */}
</Page>
```

| Role | Overflow | 이유 |
|------|----------|------|
| Toolbar | `hidden` | 고정 높이 툴바, 스크롤 불필요 |
| ActivityBar | `hidden` | 아이콘 바, 고정 높이 |
| PrimarySidebar | `auto` | 파일 트리, 많은 파일 시 스크롤 |
| Editor | `hidden` | CodeMirror가 내부 스크롤 관리 |
| Panel | `auto` | 터미널 출력, 긴 로그 스크롤 |
| SecondarySidebar | `auto` | 속성 패널, 많은 속성 시 스크롤 |

**핵심**:
- **고정 영역** (Toolbar, ActivityBar): `hidden`
- **목록 영역** (Sidebar, Panel): `auto`
- **에디터 영역** (Editor): `hidden` (내부 위임)

### 2. sidebar-content (웹 표준)

```tsx
<Page role="App" template="sidebar-content">
  <Section role="Navigator">...</Section>  {/* auto */}
  <Section role="Main">...</Section>       {/* hidden */}
  <Section role="Aside">...</Section>      {/* auto */}
</Page>
```

| Role | Overflow | 이유 |
|------|----------|------|
| Navigator | `auto` | 네비게이션 메뉴, 많은 항목 시 스크롤 |
| Main | `hidden` | 메인 콘텐츠는 내부 컴포넌트가 스크롤 |
| Aside | `auto` | 사이드바 위젯, 많은 위젯 시 스크롤 |

**핵심**:
- **네비게이션/사이드바**: `auto` (목록)
- **메인 영역**: `hidden` (내부 위임)

### 3. 3-col (3단 레이아웃)

```tsx
<Page role="App" template="3-col">
  <Section role="Header">...</Section>     {/* hidden */}
  <Section role="Navigator">...</Section>  {/* auto */}
  <Section role="Main">...</Section>       {/* hidden */}
  <Section role="Aside">...</Section>      {/* auto */}
</Page>
```

| Role | Overflow | 이유 |
|------|----------|------|
| Header | `hidden` | 고정 헤더 (툴바, 탭 등) |
| Navigator | `auto` | 좌측 목록 (슬라이드 목록 등) |
| Main | `hidden` | 중앙 캔버스 (캔버스 자체 스크롤) |
| Aside | `auto` | 우측 패널 (속성, 포맷 등) |

**핵심**:
- **헤더**: `hidden` (고정)
- **좌우 패널**: `auto` (목록/속성)
- **중앙 캔버스**: `hidden` (내부 위임)

### 4. presentation (프레젠테이션)

```tsx
<Page role="App" template="presentation">
  <Section role="Header">...</Section>  {/* hidden */}
  <Section role="Footer">...</Section>  {/* hidden */}
  <Section role="Main">...</Section>    {/* hidden */}
</Page>
```

| Role | Overflow | 이유 |
|------|----------|------|
| Header | `hidden` | 상단 툴바, 고정 |
| Footer | `hidden` | 하단 컨트롤, 고정 |
| Main | `hidden` | 슬라이드 캔버스, 스크롤 없음 |

**핵심**:
- 모든 영역 `hidden` (프레젠테이션은 스크롤 없음)

### 5. master-detail (마스터-디테일)

```tsx
<Page role="App" template="master-detail">
  <Section role="Master">...</Section>  {/* auto */}
  <Section role="Detail">...</Section>  {/* auto */}
</Page>
```

| Role | Overflow | 이유 |
|------|----------|------|
| Master | `auto` | 목록, 많은 항목 시 스크롤 |
| Detail | `auto` | 상세 내용, 긴 내용 시 스크롤 |

**핵심**:
- 둘 다 `auto` (목록과 상세 모두 스크롤)

### 6. dialog (다이얼로그)

```tsx
<Overlay role="Dialog">
  <Section role="DialogHeader">...</Section>  {/* hidden */}
  <Section role="DialogContent">...</Section> {/* auto */}
  <Section role="DialogFooter">...</Section>  {/* hidden */}
</Overlay>
```

| Role | Overflow | 이유 |
|------|----------|------|
| DialogHeader | `hidden` | 제목/닫기 버튼, 고정 |
| DialogContent | `auto` | 다이얼로그 본문, 긴 내용 시 스크롤 |
| DialogFooter | `hidden` | 버튼 영역, 고정 |

**핵심**:
- **Header/Footer**: `hidden` (고정)
- **Content**: `auto` (스크롤 가능)

## Overflow 결정 흐름

```
1. 사용자가 Page template 선택
   <Page role="App" template="studio">

2. Section role 지정
   <Section role="PrimarySidebar">

3. role-config에서 설정 조회
   getRoleConfig('PrimarySidebar', 'studio')
   → { overflow: 'auto', ... }

4. Overflow 클래스 생성
   getOverflowClass('auto')
   → 'overflow-y-auto'

5. Section에 적용
   <aside className="... overflow-y-auto">
```

## 구현 세부사항

### 1. role-config.ts

```typescript
export const ROLE_CONFIGS: Record<string, Record<string, RoleConfig>> = {
  studio: {
    PrimarySidebar: {
      gridArea: 'sidebar',
      overflow: 'auto', // ✅ Page가 결정
      htmlTag: 'aside',
      ariaProps: { 'aria-label': 'Primary Sidebar' },
      baseStyles: 'flex flex-col w-64 flex-shrink-0 bg-surface border-r',
    },
    Editor: {
      gridArea: 'editor',
      overflow: 'hidden', // ✅ Page가 결정
      htmlTag: 'main',
      baseStyles: 'flex-1 flex flex-col min-w-0 bg-surface',
    },
  },
};
```

### 2. getOverflowClass 함수

```typescript
export function getOverflowClass(overflow: OverflowBehavior): string {
  const overflowMap: Record<OverflowBehavior, string> = {
    auto: 'overflow-y-auto',
    hidden: 'overflow-hidden',
    scroll: 'overflow-y-scroll',
    visible: 'overflow-visible',
  };
  return overflowMap[overflow];
}
```

### 3. Section.tsx 적용

```typescript
export function Section({ role = 'Container', ...props }: SectionProps) {
  const parentCtx = useLayoutContext();

  // ✅ 1. role-config에서 overflow 가져오기
  const config = getRoleConfig(role, parentCtx.template);
  const { overflow } = config;

  // ✅ 2. Overflow 클래스 생성
  const overflowClass = getOverflowClass(overflow);

  // ✅ 3. Renderer에 전달
  const rendererProps = {
    role: role as any,
    baseStyles: config.baseStyles,
    overflowClass, // ← 여기
    ariaProps: config.ariaProps,
    // ...
  };

  return <IDESection {...rendererProps} />;
}
```

### 4. Renderer 적용

```typescript
export function IDESection({
  baseStyles,
  overflowClass, // ← 받음
  ariaProps,
  className,
  ...rest
}: IDESectionProps) {
  return (
    <Element
      className={cn(baseStyles, overflowClass, className)} // ← 적용
      {...ariaProps}
      {...rest}
    >
      {children}
    </Element>
  );
}
```

## 일반적인 패턴

### 패턴 1: 목록 (Lists)

```tsx
// ✅ 목록은 항상 auto
<Section role="Navigator"> {/* overflow: auto */}
  <FileTree />
  <MenuList />
  <ItemList />
</Section>
```

**이유**: 항목이 많아지면 스크롤 필요

### 패턴 2: 에디터 (Editors)

```tsx
// ✅ 에디터는 항상 hidden (내부 위임)
<Section role="Editor"> {/* overflow: hidden */}
  <CodeMirror /> {/* 내부에서 overflow: auto */}
</Section>
```

**이유**: CodeMirror, Monaco 등이 자체 스크롤 관리

### 패턴 3: 캔버스 (Canvas)

```tsx
// ✅ 캔버스는 항상 hidden (내부 위임)
<Section role="Main"> {/* overflow: hidden */}
  <Canvas /> {/* 내부에서 pan/zoom 관리 */}
</Section>
```

**이유**: 캔버스는 pan/zoom으로 스크롤 대체

### 패턴 4: 터미널 (Terminals)

```tsx
// ✅ 터미널은 항상 auto
<Section role="Panel"> {/* overflow: auto */}
  <Terminal />
</Section>
```

**이유**: 터미널 출력이 길어지면 스크롤 필요

### 패턴 5: 고정 영역 (Fixed Areas)

```tsx
// ✅ Header, Footer, Toolbar는 항상 hidden
<Section role="Header"> {/* overflow: hidden */}
  <Toolbar />
</Section>
```

**이유**: 고정 높이, 스크롤 불필요

## Anti-patterns (피해야 할 패턴)

### ❌ 명시적 overflow prop

```tsx
// ❌ WRONG - overflow prop 사용하지 않음
<Section role="PrimarySidebar" overflow="auto">
  ...
</Section>

// ✅ CORRECT - role-config가 자동 결정
<Section role="PrimarySidebar">
  ...
</Section>
```

### ❌ 외부에서 className으로 override

```tsx
// ❌ WRONG - overflow를 className으로 override
<Section role="Editor" className="overflow-y-auto">
  <CodeMirror />
</Section>

// ✅ CORRECT - role-config 신뢰
<Section role="Editor">
  <CodeMirror />
</Section>
```

### ❌ 잘못된 role 선택

```tsx
// ❌ WRONG - Editor에 목록 컴포넌트
<Section role="Editor"> {/* overflow: hidden */}
  <FileTree /> {/* 스크롤이 필요한데 hidden */}
</Section>

// ✅ CORRECT - 적절한 role 사용
<Section role="PrimarySidebar"> {/* overflow: auto */}
  <FileTree />
</Section>
```

## 디버깅 가이드

### 1. 스크롤이 안 보이는 경우

**증상**: 내용이 많은데 스크롤이 안 보임

**확인**:
```typescript
// 1. Role 확인
console.log('role:', role); // PrimarySidebar?

// 2. Template 확인
console.log('template:', parentCtx.template); // studio?

// 3. Overflow 확인
console.log('overflow:', config.overflow); // auto?

// 4. 적용된 클래스 확인
console.log('overflowClass:', overflowClass); // overflow-y-auto?
```

**해결**:
- 올바른 role 사용 (`Editor` → `PrimarySidebar`)
- Template이 올바른지 확인

### 2. 불필요한 스크롤바가 보이는 경우

**증상**: 내용이 적은데 스크롤바가 보임

**확인**:
```typescript
// overflow: scroll을 사용하고 있는지 확인
console.log('overflow:', config.overflow); // scroll? → auto로 변경
```

**해결**:
- `scroll` → `auto`로 변경 (role-config.ts)

### 3. 내부 스크롤이 작동 안 하는 경우

**증상**: Editor 내부 CodeMirror 스크롤이 안 됨

**확인**:
```typescript
// Section이 overflow: auto인지 확인
console.log('overflow:', config.overflow); // auto? → hidden으로 변경
```

**해결**:
- `auto` → `hidden`으로 변경 (role-config.ts)
- 내부 컴포넌트에 스크롤 위임

## 참고 문서

- **Section v4.1 스펙**: `./section-v4.1-spec.md`
- **Template-aware Architecture**: `./template-aware-architecture.md`
- **IDDL v1.0.1 스펙**: `/docs/2-areas/spec/iddl-spec-1.0.1.md`

## 변경 이력

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| v4.1 | 2026-01-09 | Page 책임 원칙 명확화, overflow 정책 문서화 |
