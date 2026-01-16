# Block Implementation Analysis - 현재 구현 상태

**작성일**: 2026-01-16
**목적**: 현재 구현된 컴포넌트들을 Complete vs Composable 관점에서 분석하고 재설계 방향 제시

---

## 핵심 발견: 구현 방식의 불일치

### 현재 구현된 컴포넌트들

| 컴포넌트 | 현재 구현 방식 | 올바른 분류 | 문제점 |
|---------|--------------|-----------|--------|
| **Table** | 🔵 Composable (Namespace) | 🟢 Complete | 정렬 로직이 있는데 Composable로 구현됨 |
| **Drawer** | 🔵 Composable | 🟢 Complete | Resizable 로직이 있는데 Composable로 구현됨 |
| **PropertySection** | 🟢 Complete (내장) | 🟢 Complete (Accordion) | 올바른 구현, 표준화 필요 |

---

## 1. Table - 잘못된 구현 (Composable로 만든 Complete)

### 현재 구조 (`src/ui/table/`)

```typescript
// src/ui/table/Table.tsx
export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Empty: TableEmpty,
};

// 사용 예시 (CRMTable.tsx)
<Table.Root>
  <Table.Header columns={columnTemplate}>
    <Table.Head
      sortable={header.column.getCanSort()}
      sorted={sortState}
      onSort={() => header.column.toggleSorting()}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
    </Table.Head>
  </Table.Header>

  <Table.Row
    columns={columnTemplate}
    selected={isSelected}
    onClick={() => setSelectedRowId(rowData.__rowId)}
  >
    <Table.Cell>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </Table.Cell>
  </Table.Row>
</Table.Root>
```

### 문제점

**❌ 왜 잘못되었나?**

1. **완결된 로직이 있음**
   - 정렬 기능 (`sortable`, `sorted`, `onSort`)
   - 선택 상태 관리 (`selected`, `onClick`)
   - 빈 상태 처리 (`Table.Empty`)

2. **Tanstack Table과 강하게 결합**
   - `flexRender` 직접 사용
   - `columnDef`, `getContext()` 노출
   - Tanstack Table 없이는 사용 불가

3. **반복적인 보일러플레이트**
   ```typescript
   // 매번 이걸 작성해야 함
   const table = useReactTable({
     data,
     columns,
     state: { sorting },
     onSortingChange: setSorting,
     getCoreRowModel: getCoreRowModel(),
     getSortedRowModel: getSortedRowModel(),
   });

   // 매번 이걸 렌더링해야 함
   {table.getHeaderGroups().map((headerGroup) => (
     <Table.Header key={headerGroup.id} columns={columnTemplate}>
       {headerGroup.headers.map((header) => (
         <Table.Head
           key={header.id}
           sortable={header.column.getCanSort()}
           sorted={header.column.getIsSorted()}
           onSort={() => header.column.toggleSorting()}
         >
           {flexRender(header.column.columnDef.header, header.getContext())}
         </Table.Head>
       ))}
     </Table.Header>
   ))}
   ```

4. **Props를 외워야 함**
   - `columns` prop이 뭐지?
   - `sortable`과 `sorted`를 둘 다 넣어야 하나?
   - `flexRender`를 어떻게 사용하지?

### 올바른 구현: Complete Component로 재설계

```typescript
// ✅ Complete Component - Props 방식
<DataTable
  columns={[
    { key: "name", header: "Name", sortable: true },
    { key: "company", header: "Company" },
    { key: "status", header: "Status" },
  ]}
  data={data}
  onRowClick={(row) => setSelectedRowId(row.id)}
  selectedRowId={selectedRowId}
  emptyMessage="No data available"
/>
```

**개선점:**
- ✅ Tanstack Table 내부로 숨김
- ✅ 정렬/선택/빈 상태 자동 처리
- ✅ 외울 것 없음 (columns, data만 필수)
- ✅ 재사용 가능

---

## 2. Drawer - 잘못된 구현 (Composable로 만든 Complete)

### 현재 구조 (`src/apps/crm/CRMDrawer.tsx`)

```typescript
export function CRMDrawer() {
  const [selectedRowId, setSelectedRowId] = useAtom(selectedRowIdAtom);
  const handleClose = () => setSelectedRowId(null);

  // Resizable hook 직접 사용
  const { size, resizeHandleProps } = useResizable({
    direction: "right",
    defaultSize: 512,
    minSize: 320,
    maxSize: 800,
    storageKey: "crm-drawer-width",
  });

  return (
    <Frame
      w={`${size}px` as unknown as any}
      z={ZIndex.n100}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
      }}
      surface="base"
    >
      <ResizeHandle direction="right" {...resizeHandleProps} />
      {hasSelection && selectedRow ? (
        <>
          <DrawerHeader title={...} onClose={handleClose} />
          <Frame flex fill scroll>
            <DrawerProperties entries={...} />
            <DrawerActivity />
          </Frame>
          <DrawerFooter onClose={handleClose} />
        </>
      ) : (
        <Frame flex fill layout={Layout.Center.Default}>
          {/* Empty state */}
        </Frame>
      )}
    </Frame>
  );
}
```

### 문제점

**❌ 왜 잘못되었나?**

1. **완결된 로직이 있음**
   - Resizable 로직 (`useResizable` hook)
   - 열기/닫기 상태 관리
   - Overlay/Backdrop 처리
   - 위치 계산 (`position: absolute`, `top/right/bottom`)

2. **매번 반복 작성해야 함**
   - `useResizable` hook 직접 사용
   - `ResizeHandle` 수동 배치
   - 빈 상태 처리 직접 작성
   - 위치 스타일 직접 작성

3. **재사용 불가**
   - CRMApp 전용 구조
   - Jotai atom에 강하게 결합
   - 다른 앱에서 사용하려면 전체 복사 필요

### 올바른 구현: Complete Component로 재설계

```typescript
// ✅ Complete Component - Props 방식
<Drawer
  open={selectedRowId !== null}
  onClose={() => setSelectedRowId(null)}
  position="right"
  size={512}
  resizable={{
    min: 320,
    max: 800,
    storageKey: "crm-drawer-width",
  }}
  emptyState={{
    icon: FileText,
    title: "No Selection",
    description: "Select a row to view details",
  }}
>
  {selectedRow && (
    <>
      <Drawer.Header
        title={getDisplayTitle(selectedRow)}
        subtitle={`${Object.entries(selectedRow).length} properties`}
        avatar={{ color: getAvatarColor(selectedRow) }}
      />
      <Drawer.Content>
        <DrawerProperties entries={...} />
        <DrawerActivity />
      </Drawer.Content>
      <Drawer.Footer>
        <Action label="Close" onClick={() => setSelectedRowId(null)} />
      </Drawer.Footer>
    </>
  )}
</Drawer>
```

**개선점:**
- ✅ Resizable 로직 내부로 숨김
- ✅ 열기/닫기 상태 자동 관리
- ✅ Backdrop/Overlay 자동 처리
- ✅ 위치 계산 자동 (position prop만)
- ✅ 빈 상태 자동 렌더링
- ✅ 재사용 가능 (다른 앱에서도 사용)

---

## 3. PropertySection - 올바른 구현 (Complete)

### 현재 구조 (`src/apps/crm/drawer/PropertySection.tsx`)

```typescript
export function PropertySection({
  title,
  icon: IconSrc,
  defaultExpanded = false,
  level = 0,
  children,
}: PropertySectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Frame layout={Layout.Stack.Content.Default}>
      <Frame
        layout={Layout.Row.Item.Default}
        onClick={() => setExpanded(!expanded)}
        style={{
          paddingLeft: `${level * 16}px`,
          backgroundColor: expanded
            ? "var(--surface-raised)"
            : "var(--surface-base)",
        }}
      >
        <Icon src={expanded ? ChevronDown : ChevronRight} />
        {IconSrc && <Icon src={IconSrc} />}
        <Text.Menu.Group>{title.toUpperCase()}</Text.Menu.Group>
      </Frame>

      {expanded && (
        <Frame layout={Layout.Stack.List.Default}>
          {children}
        </Frame>
      )}
    </Frame>
  );
}
```

### 분석

**✅ 왜 올바른가?**

1. **완결된 로직**
   - 열기/닫기 토글 (`useState`)
   - 애니메이션 (background transition)
   - 계층 구조 (level prop으로 indentation)

2. **Props 방식**
   - `title`, `icon`, `defaultExpanded`, `level`
   - 명확한 API

3. **재사용 가능**
   - CRM Drawer에서만 사용하지만
   - 다른 곳에서도 사용 가능한 구조

### 개선점: Accordion으로 표준화

```typescript
// ✅ Complete Component - Accordion으로 표준화
<Accordion
  items={[
    {
      title: "Contact",
      icon: Mail,
      defaultExpanded: true,
      content: <PropertyList entries={contactEntries} />,
    },
    {
      title: "Address",
      icon: MapPin,
      content: <PropertyList entries={addressEntries} />,
    },
  ]}
  allowMultiple={true}
  level={0}
/>
```

**개선점:**
- ✅ 표준 Accordion API
- ✅ 여러 아이템 한 번에 관리
- ✅ `allowMultiple` 옵션
- ✅ 업계 표준 네이밍

---

## 재설계 전략

### Phase 1: Table/DataTable 재설계 (최우선)

**현재 문제:**
- Tanstack Table이 노출되어 있음
- 매번 `useReactTable` hook 직접 사용
- 반복적인 렌더링 로직

**목표:**
```typescript
// Before (현재)
const table = useReactTable({ ... });
<Table.Root>
  {table.getHeaderGroups().map(...)}
  {table.getRowModel().rows.map(...)}
</Table.Root>

// After (목표)
<DataTable
  columns={columns}
  data={data}
  onRowClick={handleRowClick}
  selectedRowId={selectedRowId}
/>
```

**구현 위치:**
```
src/design-system/Complete/DataTable/
├── DataTable.tsx           # Main component (Tanstack Table 내장)
├── DataTable.types.ts      # Props interface
└── DataTable.stories.tsx   # Storybook
```

---

### Phase 2: Drawer 재설계

**현재 문제:**
- Resizable 로직이 외부에 노출
- 위치 계산 수동
- 빈 상태 처리 직접 작성

**목표:**
```typescript
// Before (현재)
const { size, resizeHandleProps } = useResizable({ ... });
<Frame w={`${size}px`} style={{ position: "absolute", ... }}>
  <ResizeHandle {...resizeHandleProps} />
  {hasSelection ? <Content /> : <EmptyState />}
</Frame>

// After (목표)
<Drawer
  open={open}
  onClose={onClose}
  position="right"
  size={512}
  resizable={{ min: 320, max: 800 }}
  emptyState={{ ... }}
>
  <Drawer.Header />
  <Drawer.Content />
  <Drawer.Footer />
</Drawer>
```

**구현 위치:**
```
src/design-system/Complete/Drawer/
├── Drawer.tsx              # Main component (Resizable 내장)
├── DrawerHeader.tsx        # Header sub-component
├── DrawerContent.tsx       # Content sub-component
├── DrawerFooter.tsx        # Footer sub-component
├── Drawer.types.ts         # Props interface
└── Drawer.stories.tsx      # Storybook
```

---

### Phase 3: PropertySection → Accordion 표준화

**현재 문제:**
- 이름이 모호함 (`PropertySection`은 CRM 전용처럼 보임)
- 단일 아이템만 관리 (여러 아이템 관리 불가)

**목표:**
```typescript
// Before (현재)
<PropertySection title="Contact" icon={Mail} defaultExpanded={true}>
  <PropertyList />
</PropertySection>
<PropertySection title="Address" icon={MapPin}>
  <PropertyList />
</PropertySection>

// After (목표)
<Accordion
  items={[
    { title: "Contact", icon: Mail, defaultExpanded: true, content: <PropertyList /> },
    { title: "Address", icon: MapPin, content: <PropertyList /> },
  ]}
  allowMultiple={true}
/>
```

**구현 위치:**
```
src/design-system/Complete/Accordion/
├── Accordion.tsx           # Main component
├── AccordionItem.tsx       # Item sub-component
├── Accordion.types.ts      # Props interface
└── Accordion.stories.tsx   # Storybook
```

---

## 파일 구조 재정리

### 현재 구조 (혼란스러움)

```
src/
├── ui/table/               # ❌ 왜 ui/ 디렉토리인가?
│   ├── Table.tsx           # ❌ Complete인데 Composable로 구현
│   ├── TableRoot.tsx
│   ├── TableRow.tsx
│   └── ...
├── apps/crm/
│   ├── CRMDrawer.tsx       # ❌ Complete인데 Composable로 구현
│   └── drawer/
│       ├── PropertySection.tsx  # ✅ Complete (올바름)
│       └── ...
└── design-system/
    ├── Frame/
    ├── Action/
    └── ...                 # ❌ Complete 디렉토리 없음
```

### 목표 구조 (명확함)

```
src/design-system/
├── Complete/               # ✅ Complete Component 전용
│   ├── DataTable/
│   │   ├── DataTable.tsx
│   │   └── DataTable.types.ts
│   ├── Drawer/
│   │   ├── Drawer.tsx
│   │   ├── DrawerHeader.tsx
│   │   ├── DrawerContent.tsx
│   │   ├── DrawerFooter.tsx
│   │   └── Drawer.types.ts
│   ├── Accordion/
│   │   ├── Accordion.tsx
│   │   ├── AccordionItem.tsx
│   │   └── Accordion.types.ts
│   ├── Modal/
│   ├── Tabs/
│   ├── Dropdown/
│   └── ...
│
├── preset/                 # ✅ Layout Preset
│   ├── Layout.ts
│   ├── Layout.Marketing.ts
│   ├── Layout.Application.ts
│   └── Layout.Component.ts
│
├── Frame/                  # ✅ Primitive
├── Action/
├── Text/
└── ...

src/examples/
└── patterns/               # ✅ Composable Pattern 예시
    ├── Hero.example.tsx
    ├── Features.example.tsx
    ├── Sidebar.example.tsx
    └── ...
```

---

## 다음 단계

### 즉시 실행

1. ✅ DataTable 재설계 시작
   - Tanstack Table 내장
   - Props 기반 API
   - 정렬/선택/빈 상태 자동 처리

2. ✅ Drawer 재설계 시작
   - Resizable 로직 내장
   - 위치 계산 자동
   - 빈 상태 자동 렌더링

3. ✅ PropertySection → Accordion 표준화
   - 업계 표준 네이밍
   - 여러 아이템 관리
   - `allowMultiple` 옵션

### 이후 작업

4. ✅ Layout Preset 정의
   - `src/design-system/preset/Layout.ts`
   - Flat한 네이밍 (`Layout.Hero`, `Layout.Sidebar`)

5. ✅ Composable Pattern 예시 작성
   - `src/examples/patterns/`
   - Hero, Features, Sidebar 등

6. ✅ Storybook 문서화
   - Complete Component Storybook
   - Composable Pattern Storybook

---

## 결론

### 핵심 발견

**현재 구현의 문제:**
- ❌ Complete Component를 Composable 방식으로 구현
- ❌ 완결된 로직이 있는데 외부에 노출
- ❌ 매번 반복적인 보일러플레이트 작성
- ❌ 재사용 불가능한 구조

**올바른 방향:**
- ✅ Complete는 Props 방식 (Table, Drawer, Accordion)
- ✅ 완결된 로직은 내부로 숨김 (Tanstack Table, Resizable)
- ✅ 명확한 API (외울 것 없음)
- ✅ 재사용 가능한 구조

### 우선순위

1. **DataTable** - 이미 사용 중, 가장 급함
2. **Drawer** - 2개 앱에서 사용
3. **Accordion** - PropertySection 표준화

이제 구현을 시작할 준비가 되었습니다! 🚀
