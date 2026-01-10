# Section v4.1 스펙 - Role Configuration 중앙화

**버전**: IDDL v4.1
**최종 업데이트**: 2026-01-09
**상태**: ✅ Stable

## 개요

Section v4.1은 **Role Configuration 중앙화**를 통해 모든 Section role의 속성을 단일 파일에서 관리합니다. 이는 Page template과 Section role의 조합으로 자동으로 gridArea, overflow, htmlTag, ariaProps, baseStyles를 결정합니다.

## 핵심 원칙

### 1. **Page 책임 원칙** (Primary Responsibility)

```
Page template + Section role → 모든 Section 속성 자동 결정
```

- **Page가 결정**: gridArea, overflow (스크롤), layout
- **Section이 받음**: 외부에서 주입된 설정 적용
- **명시적 override 없음**: 순수 자동 시스템

### 2. **중앙화된 설정** (role-config.ts)

모든 Section role의 속성을 하나의 파일에서 관리:

```typescript
// src/components/types/Section/role-config.ts
export interface RoleConfig {
  gridArea: string;           // CSS Grid 배치
  overflow: OverflowBehavior; // 스크롤 동작 (auto | hidden | scroll | visible)
  htmlTag: string;            // 시맨틱 HTML 태그
  ariaProps?: Record<string, string>; // 접근성 속성
  baseStyles: string;         // Tailwind CSS 클래스
  description?: string;       // 역할 설명
}
```

### 3. **Renderer 단순화**

Renderer는 더 이상 스타일을 하드코딩하지 않고, 외부에서 주입받은 설정을 적용:

```typescript
export function IDESection({
  baseStyles,      // ✅ 외부 주입
  overflowClass,   // ✅ 외부 주입
  ariaProps,       // ✅ 외부 주입
  ...rest
}: IDESectionProps) {
  return (
    <Element
      className={cn(baseStyles, overflowClass, className)}
      {...ariaProps}
      {...rest}
    >
      {children}
    </Element>
  );
}
```

## 지원하는 Template

### 1. studio (IDE/Studio 레이아웃)

```tsx
<Page role="App" template="studio">
  <Section role="Toolbar">...</Section>
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
  <Section role="Panel">...</Section>
  <Section role="SecondarySidebar">...</Section>
  <Section role="Auxiliary">...</Section>
</Page>
```

**Grid Layout**:
```
toolbar (auto)
+----+-------+--------+-------+
| AB | Sidebar | Editor | Panel |
+----+-------+--------+-------+
```

**Overflow 정책**:
- Toolbar: `hidden` (고정 영역)
- ActivityBar: `hidden` (아이콘 바)
- PrimarySidebar: `auto` (파일 트리 스크롤)
- Editor: `hidden` (CodeMirror 내부 스크롤)
- Panel: `auto` (터미널 출력 스크롤)
- SecondarySidebar: `auto` (속성 패널 스크롤)

### 2. sidebar-content (웹 표준 레이아웃)

```tsx
<Page role="App" template="sidebar-content">
  <Section role="Navigator">...</Section>
  <Section role="Main">...</Section>
  <Section role="Aside">...</Section>
</Page>
```

**Grid Layout**:
```
+-------+--------+-------+
|  Nav  |  Main  | Aside |
+-------+--------+-------+
```

**Overflow 정책**:
- Navigator: `auto` (네비게이션 스크롤)
- Main: `hidden` (메인 콘텐츠 자체 스크롤)
- Aside: `auto` (사이드바 스크롤)

### 3. 3-col (3단 레이아웃 + 헤더)

```tsx
<Page role="App" template="3-col">
  <Section role="Header">...</Section>
  <Section role="Navigator">...</Section>
  <Section role="Main">...</Section>
  <Section role="Aside">...</Section>
</Page>
```

**Grid Layout**:
```
+---------+---------+---------+
|      Header (전체)         |
+---------+---------+---------+
|  Left   | Center  |  Right  |
+---------+---------+---------+
```

**Overflow 정책**:
- Header: `hidden` (고정 헤더)
- Navigator: `auto` (좌측 목록 스크롤)
- Main: `hidden` (중앙 캔버스)
- Aside: `auto` (우측 패널 스크롤)

### 4. presentation (프레젠테이션 레이아웃)

```tsx
<Page role="App" template="presentation">
  <Section role="Header">...</Section>
  <Section role="Footer">...</Section>
  <Section role="Main">...</Section>
</Page>
```

**Grid Layout**:
```
+-------------------+
|      Header       |
+-------------------+
|       Main        |
+-------------------+
|      Footer       |
+-------------------+
```

**Overflow 정책**:
- Header: `hidden` (고정)
- Footer: `hidden` (고정)
- Main: `hidden` (슬라이드 캔버스)

### 5. master-detail (마스터-디테일 레이아웃)

```tsx
<Page role="App" template="master-detail">
  <Section role="Master">...</Section>
  <Section role="Detail">...</Section>
</Page>
```

**Grid Layout**:
```
+--------+-------------+
| Master |   Detail    |
+--------+-------------+
```

**Overflow 정책**:
- Master: `auto` (목록 스크롤)
- Detail: `auto` (상세 내용 스크롤)

### 6. dialog (다이얼로그 레이아웃)

```tsx
<Overlay role="Dialog">
  <Section role="DialogHeader">...</Section>
  <Section role="DialogContent">...</Section>
  <Section role="DialogFooter">...</Section>
</Overlay>
```

**Grid Layout**:
```
+-------------------+
|  DialogHeader     | (auto)
+-------------------+
|  DialogContent    | (1fr)
+-------------------+
|  DialogFooter     | (auto)
+-------------------+
```

**Overflow 정책**:
- DialogHeader: `hidden` (고정)
- DialogContent: `auto` (콘텐츠 스크롤)
- DialogFooter: `hidden` (고정)

### 7. universal (범용 fallback)

Template이 지정되지 않았거나, 알려지지 않은 role을 사용할 때 fallback으로 사용:

```tsx
<Page role="App">
  <Section role="Header">...</Section>
  <Section role="Footer">...</Section>
  <Section role="Main">...</Section>
  <Section role="Container">...</Section>
</Page>
```

**Overflow 정책**:
- Header/Footer: `hidden` (고정)
- Main/Container: `auto` (스크롤 가능)

## 구현 세부사항

### 1. role-config.ts 구조

```typescript
export const ROLE_CONFIGS: Record<string, Record<string, RoleConfig>> = {
  studio: {
    PrimarySidebar: {
      gridArea: 'sidebar',
      overflow: 'auto',
      htmlTag: 'aside',
      ariaProps: { 'aria-label': 'Primary Sidebar' },
      baseStyles: 'flex flex-col w-64 flex-shrink-0 bg-surface border-r border-border-default',
      description: '메인 사이드바 (파일 트리 등) - 스크롤',
    },
    // ... 더 많은 role들
  },
  'sidebar-content': { /* ... */ },
  '3-col': { /* ... */ },
  // ... 더 많은 template들
};

export function getRoleConfig(role: string, template?: string): RoleConfig {
  if (template && ROLE_CONFIGS[template]?.[role]) {
    return ROLE_CONFIGS[template][role];
  }
  if (ROLE_CONFIGS.universal[role]) {
    return ROLE_CONFIGS.universal[role];
  }
  // Fallback for unknown roles
  return {
    gridArea: role.toLowerCase(),
    overflow: 'auto',
    htmlTag: 'section',
    baseStyles: 'flex-1',
    description: `Unknown role "${role}" (fallback)`,
  };
}
```

### 2. Section.tsx 흐름

```typescript
export function Section({ role = 'Container', ...props }: SectionProps) {
  const parentCtx = useLayoutContext();

  // ✅ 1. role-config에서 모든 설정 가져오기
  const config = getRoleConfig(role, parentCtx.template);

  const {
    gridArea: configGridArea,
    overflow,
    htmlTag,
    ariaProps: configAriaProps,
    baseStyles: configBaseStyles,
  } = config;

  // ✅ 2. Overflow 클래스 생성
  const overflowClass = getOverflowClass(overflow);

  // ✅ 3. Renderer에 전달
  const rendererProps = {
    role: role as any,
    baseStyles: configBaseStyles,
    overflowClass,
    ariaProps: configAriaProps,
    // ... 기타 props
  };

  // ✅ 4. 적절한 Renderer 선택
  if (['Container', 'Main', 'SplitContainer'].includes(role)) {
    return <ContainerSection {...rendererProps} />;
  }
  if (['Header', 'Footer', 'Navigator', 'Aside'].includes(role)) {
    return <FrameSection {...rendererProps} />;
  }
  if (['Toolbar', 'ActivityBar', 'PrimarySidebar', ...].includes(role)) {
    return <IDESection {...rendererProps} />;
  }
  if (['DialogHeader', 'DialogFooter', 'DialogContent'].includes(role)) {
    return <DialogSection {...rendererProps} />;
  }

  // Fallback
  return <ContainerSection {...rendererProps} />;
}
```

### 3. Context 전달

Page.tsx에서 template을 Context로 전달:

```typescript
// Page.tsx
export function Page({ role = 'Content', template, ...props }: PageProps) {
  if (role === 'App') {
    return (
      <LayoutProvider
        value={{
          prominence,
          density,
          intent,
          depth: 0,
          mode: 'view',
          template, // ✅ template 전달
        }}
      >
        <AppLayout template={template} gap={gap} prominence={prominence}>
          {children}
        </AppLayout>
      </LayoutProvider>
    );
  }
  // ... Content 페이지 로직
}
```

### 4. useDynamicGridTemplate 통합

useDynamicGridTemplate.ts도 role-config를 사용하여 중복 제거:

```typescript
function extractUsedAreas(children: ReactNode, template?: string): Set<string> {
  const areas = new Set<string>();

  const traverse = (node: ReactNode) => {
    if (typeof node === 'object' && 'props' in node) {
      const props = (node as any).props;

      // ✅ role-config 사용
      if (props?.role) {
        const config = getRoleConfig(props.role, template);
        areas.add(config.gridArea);
      }
      // Backward compatibility
      else if (props?.gridArea) {
        areas.add(props.gridArea);
      }
    }
  };

  traverse(children);
  return areas;
}
```

## Overflow 동작 원칙

### 기본 원칙

1. **Page가 결정**: Template + Role 조합이 overflow 결정
2. **명시적 override 없음**: `overflow` prop 제공 안 함
3. **Context-dependent**: 같은 role이라도 template에 따라 다른 overflow

### Overflow 타입

```typescript
type OverflowBehavior = 'auto' | 'hidden' | 'scroll' | 'visible';
```

| 타입 | Tailwind | 사용 케이스 |
|------|----------|------------|
| `auto` | `overflow-y-auto` | 스크롤 가능한 목록, 사이드바 |
| `hidden` | `overflow-hidden` | 고정 영역, 내부 스크롤 위임 |
| `scroll` | `overflow-y-scroll` | 강제 스크롤바 표시 |
| `visible` | `overflow-visible` | 드롭다운, 팝오버 (드물게 사용) |

### 스크롤 정책 가이드

#### 1. 고정 영역 (`hidden`)
- Header, Footer, Toolbar
- 높이가 고정되고 스크롤 불필요

#### 2. 목록/사이드바 (`auto`)
- Navigator, Sidebar, Panel, Aside
- 내용이 많아지면 스크롤

#### 3. 에디터/캔버스 (`hidden`)
- Editor, Main (IDE)
- 내부 컴포넌트(CodeMirror, Canvas)가 자체 스크롤 관리

#### 4. 콘텐츠 영역 (`auto`)
- Main (웹 페이지)
- DialogContent
- 일반 콘텐츠 스크롤

## Role Renderer 패턴

### v4.0 (이전) - 하드코딩

```typescript
// ❌ 이전 방식: Renderer 내부에 스타일 하드코딩
export function IDESection({ role, ...rest }: IDESectionProps) {
  const roleStyles = {
    PrimarySidebar: 'flex flex-col w-64 overflow-y-auto border-r',
    Editor: 'flex-1 overflow-hidden',
    Panel: 'flex flex-col h-80 overflow-y-auto border-t',
  }[role];

  return (
    <Element className={cn(roleStyles, className)} {...rest}>
      {children}
    </Element>
  );
}
```

### v4.1 (현재) - 외부 주입

```typescript
// ✅ 현재 방식: 외부에서 주입받음
export function IDESection({
  baseStyles,      // ✅ role-config에서 주입
  overflowClass,   // ✅ role-config에서 주입
  ariaProps,       // ✅ role-config에서 주입
  ...rest
}: IDESectionProps) {
  return (
    <Element
      className={cn(baseStyles, overflowClass, className)}
      {...ariaProps}
      {...rest}
    >
      {children}
    </Element>
  );
}
```

### 장점

1. **중앙 관리**: 모든 설정이 role-config.ts 한 곳에
2. **일관성**: 같은 role은 항상 같은 설정
3. **유지보수**: 설정 변경 시 한 곳만 수정
4. **확장성**: 새 template 추가 시 role-config만 업데이트
5. **타입 안전성**: RoleConfig 인터페이스로 타입 보장

## Migration Guide (v4.0 → v4.1)

### Before (v4.0)

```typescript
// Section.tsx
const roleToTag: Record<string, string> = {
  Header: 'header',
  Footer: 'footer',
  // ...
};

const roleToAria: Record<string, Record<string, string>> = {
  Navigator: { role: 'navigation' },
  // ...
};

function getRoleGridArea(role: string, template?: string): string {
  // ... 복잡한 매핑 로직
}

// Renderer
const roleStyles = {
  PrimarySidebar: 'flex flex-col w-64 overflow-y-auto',
  // ...
}[role];
```

### After (v4.1)

```typescript
// role-config.ts (중앙화)
export const ROLE_CONFIGS = {
  studio: {
    PrimarySidebar: {
      gridArea: 'sidebar',
      overflow: 'auto',
      htmlTag: 'aside',
      ariaProps: { 'aria-label': 'Primary Sidebar' },
      baseStyles: 'flex flex-col w-64 flex-shrink-0',
    },
  },
};

// Section.tsx (단순화)
const config = getRoleConfig(role, parentCtx.template);

// Renderer (단순화)
<Element className={cn(baseStyles, overflowClass, className)} />
```

## Best Practices

### 1. Template 선택

```tsx
// ✅ 올바른 template 선택
<Page role="App" template="studio"> {/* IDE 앱 */}
<Page role="App" template="3-col"> {/* PPT 앱 */}
<Page role="App" template="sidebar-content"> {/* 웹 앱 */}

// ❌ 잘못된 template 선택
<Page role="App" template="studio"> {/* 웹 앱인데 studio 사용 */}
  <Section role="Main">...</Section> {/* studio에는 Main이 없음 */}
</Page>
```

### 2. Role 사용

```tsx
// ✅ Template에 맞는 role 사용
<Page role="App" template="studio">
  <Section role="PrimarySidebar">...</Section> {/* studio role */}
  <Section role="Editor">...</Section>
</Page>

// ❌ Template에 없는 role 사용
<Page role="App" template="studio">
  <Section role="Navigator">...</Section> {/* sidebar-content role */}
</Page>
```

### 3. 명시적 gridArea 회피

```tsx
// ✅ role만 지정 (자동 계산)
<Section role="PrimarySidebar">...</Section>

// ❌ 명시적 gridArea (불필요)
<Section role="PrimarySidebar" gridArea="sidebar">...</Section>
```

## Validation

개발 모드에서 자동 검증:

```typescript
// Section.tsx
if (import.meta.env.DEV && parentCtx.template) {
  const template = parentCtx.template;
  const validRoles = TEMPLATE_SECTION_ROLES[template] || [];
  const universalRoles = TEMPLATE_SECTION_ROLES.universal || [];
  const allValidRoles = [...new Set([...universalRoles, ...validRoles])];

  if (!allValidRoles.includes(role)) {
    console.warn(
      `[Section] Role "${role}" is not valid for template "${template}". ` +
      `Valid roles: ${allValidRoles.join(', ')}`
    );
  }
}
```

## 참고 문서

- **Page-Section Overflow 정책**: `./page-section-overflow-policy.md`
- **Template-aware Architecture**: `./template-aware-architecture.md`
- **IDDL v1.0.1 스펙**: `/docs/2-areas/spec/iddl-spec-1.0.1.md`
- **Component Role Mapping**: `./component-role-mapping.md`

## 변경 이력

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| v4.1 | 2026-01-09 | Role Configuration 중앙화, overflow 정책 명확화 |
| v4.0 | 2026-01-08 | Template-aware architecture, Role Renderer 패턴 도입 |
| v3.0 | 2025-12-XX | Section role 개념 도입 |
