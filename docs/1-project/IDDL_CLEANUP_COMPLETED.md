# IDDL Spec Violations Cleanup - Completed

**작성일**: 2026-01-11
**상태**: ✅ Completed
**영향**: Breaking Changes (타입 시스템 클린업)

---

## 🎯 목표

IDDL 명세를 위반하는 불필요한 props 제거 완료

---

## ✅ 완료된 작업

### 1. Block.types.ts - 제거된 Props

#### Layout Helpers (8개 제거)
```typescript
// ❌ REMOVED
padding?: string;
justify?: string;
align?: string;
flex?: string | number;
divider?: string;
width?: string | number;
height?: string | number;
orientation?: 'horizontal' | 'vertical';
```

**이유**: IDDL은 `prominence × density`로 자동 계산. 직접 픽셀값 금지.

#### Layout Override (1개 제거)
```typescript
// ❌ REMOVED
layout?: Layout;
```

**이유**: `role`이 layout을 자동 결정. Override 불필요.

#### Gap Override (1개 제거)
```typescript
// ❌ REMOVED
gap?: number | string;
```

**이유**: `density`로 자동 계산.

#### Role-specific Props (15개 제거)
```typescript
// ❌ REMOVED - Toolbar
sticky?: boolean;
border?: 'top' | 'bottom' | 'both' | 'none';

// ❌ REMOVED - Accordion
mode?: 'single' | 'multiple';
defaultValue?: string | string[];
accordionValue?: string | string[];
onValueChange?: (value: string | string[]) => void;

// ❌ REMOVED - SortableList
items?: any[];
onReorder?: (items: any[]) => void;
renderItem?: (item: any, index: number) => ReactNode;

// ❌ REMOVED - Tree
data?: any[];
icons?: Record<string, string>;
onNodeClick?: (node: any) => void;
expandable?: boolean;
selectable?: boolean;
defaultExpandedIds?: string[];
```

**이유**: Role-specific props는 `spec` 객체로 통합되어야 함.

---

### 2. Action.types.ts - 제거된 Props

#### Size Override (1개 제거)
```typescript
// ❌ REMOVED
size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
```

**이유**: `prominence × density`로 자동 계산.

---

### 3. 문서 파일 클린업 (.d.ts 및 .md)

#### docs/2-areas/spec/0-core/iddl.d.ts
```typescript
// ❌ REMOVED from BlockProps
gap?: 'none' | 'small' | 'medium' | 'large';

// ❌ REMOVED from TextProps
align?: 'left' | 'center' | 'right';

// ❌ REMOVED from ImageProps
aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3';
fit?: 'cover' | 'contain';
```

#### docs/2-areas/spec/4-element/action/iddl-components.d.ts
```typescript
// ❌ REMOVED type definitions
export type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Align = 'start' | 'center' | 'end' | 'stretch';
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

// ❌ REMOVED from BaseBlockProps
gap?: Gap;
padding?: Gap;
align?: Align;
justify?: Justify;

// ❌ REMOVED from GridSpec
rowGap?: Gap;
columnGap?: Gap;

// ❌ REMOVED from TextProps
align?: 'left' | 'center' | 'right';

// ❌ REMOVED from ImageProps
aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3';
fit?: 'cover' | 'contain';

// ❌ REMOVED from SeparatorProps
size?: 'small' | 'medium' | 'large';
```

#### docs/2-areas/spec/4-element/action/block-spec.md
```typescript
// ❌ REMOVED entire LayoutProps interface
interface LayoutProps {
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

// ✅ REPLACED with guidance
// Layout 관련 속성은 prominence × density로 자동 계산됩니다.
```

#### docs/2-areas/spec/0-core/iddl-1.0-spec-ko.md
```typescript
// ❌ REMOVED from TextProps
align?: 'left' | 'center' | 'right';

// ❌ REMOVED from ImageProps
aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3';
fit?: 'cover' | 'contain';

// ❌ REMOVED from SeparatorProps
size?: 'small' | 'medium' | 'large';
```

**총 정리**: 문서에서 20+ 위반 props 제거 및 수정

---

## 📊 Before / After

### Block Props (Before)
```typescript
export interface BlockProps {
  role?: BlockRole;
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  // ⚠️ 26개 추가 props (layout helpers + role-specific)
  layout?: Layout;
  gap?: number | string;
  padding?: string;
  justify?: string;
  align?: string;
  flex?: string | number;
  divider?: string;
  width?: string | number;
  height?: string | number;
  orientation?: 'horizontal' | 'vertical';
  sticky?: boolean;
  border?: 'top' | 'bottom' | 'both' | 'none';
  mode?: 'single' | 'multiple';
  defaultValue?: string | string[];
  accordionValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  items?: any[];
  onReorder?: (items: any[]) => void;
  renderItem?: (item: any, index: number) => ReactNode;
  data?: any[];
  icons?: Record<string, string>;
  onNodeClick?: (node: any) => void;
  expandable?: boolean;
  selectable?: boolean;
  defaultExpandedIds?: string[];
  // ... 기타 props
}
```

### Block Props (After)
```typescript
export interface BlockProps {
  role?: BlockRole;
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  children?: ReactNode;
  className?: string; // EXCEPTION: 데이터 시각화만
  style?: React.CSSProperties; // EXCEPTION: 동적 레이아웃만
  spec?: Record<string, unknown>; // Role-specific parameters
  state?: LoadState;
  emptyContent?: ReactNode;
  errorContent?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  selected?: boolean;
  clickable?: boolean;
  condition?: string;
  value?: string | number;
  selectionModel?: SelectionModel;
}
```

**결과**: 26개 props 제거 → **IDDL Canonical Props만 유지**

---

## 🎨 새로운 사용 패턴

### Before (IDDL 위반)
```tsx
// ❌ 직접 픽셀값 지정
<Block role="Card" padding="md" gap="4" width="300px" />

// ❌ Role-specific props 직접 노출
<Block role="Toolbar" sticky={true} border="bottom" />
<Block role="Accordion" mode="single" defaultValue="item1" />

// ❌ Size override
<Action size="sm" />
```

### After (IDDL 준수)
```tsx
// ✅ prominence × density로 자동 계산
<Block role="Card" prominence="Standard" density="Compact" />

// ✅ Role-specific params는 spec으로
<Block role="Toolbar" spec={{ sticky: true, border: 'bottom' }} />
<Block role="Accordion" spec={{ mode: 'single', defaultValue: 'item1' }} />

// ✅ prominence × density 조합
<Action prominence="Secondary" density="Compact" />
```

---

## 🚨 Breaking Changes

### 1. gap prop 제거
```tsx
// ❌ Before
<Block role="Stack" gap={4} />

// ✅ After - density로 자동 결정
<Block role="Stack" density="Compact" />
```

### 2. layout prop 제거
```tsx
// ❌ Before
<Block role="Container" layout="stack" />

// ✅ After - role이 자동 결정
<Block role="Stack" />
```

### 3. Role-specific props → spec
```tsx
// ❌ Before
<Block role="Toolbar" sticky={true} border="bottom" />

// ✅ After
<Block role="Toolbar" spec={{ sticky: true, border: 'bottom' }} />
```

### 4. Action size 제거
```tsx
// ❌ Before
<Action size="sm" />

// ✅ After
<Action prominence="Secondary" density="Compact" />
```

---

## 📋 Migration Checklist

### Phase 1: Type Errors 수정
- [ ] `gap` 사용처 → `density` 변경
- [ ] `layout` 사용처 → 적절한 `role` 변경
- [ ] `size` 사용처 → `prominence × density` 조합
- [ ] Role-specific props → `spec` 객체로 이동

### Phase 2: Runtime Warnings 제거
- [ ] Layout helpers (`padding`, `justify`, `align` 등) 사용처 제거
- [ ] 직접 픽셀값 (`width`, `height`) 사용처 제거

### Phase 3: 문서 업데이트
- [x] IDDL Spec 종합 정리 문서 작성
- [x] Cleanup 완료 문서 작성
- [x] 명세 문서 (.d.ts, .md) 클린업
- [ ] 마이그레이션 가이드 작성
- [ ] 컴포넌트 사용 예시 업데이트

---

## 📈 개선 효과

### 1. 타입 안전성 향상
- Props 수 감소: 26개 제거
- Canonical Props만 유지 → 명확한 API

### 2. IDDL 명세 준수
- 의도 기반 선언 강제
- `prominence × density × intent` 공식 준수

### 3. 코드 가독성 향상
```tsx
// Before: 구현 세부사항 노출
<Block role="Card" padding="md" gap="4" width="300px" height="200px" />

// After: 의도만 선언
<Block role="Card" prominence="Standard" density="Compact" />
```

### 4. 유지보수성 향상
- Role-specific props가 `spec`로 격리
- 새로운 role 추가 시 BlockProps 수정 불필요

---

## 🔗 관련 문서

- [IDDL Spec 종합 정리](./IDDL_SPEC_COMPREHENSIVE_SUMMARY.md)
- [IDDL Spec Violations Report](./IDDL_SPEC_VIOLATIONS_CLEANUP.md)
- [Adaptive Scale System](./adaptive-scale-system.md)

---

**최종 업데이트**: 2026-01-11
**담당**: AI Assistant
**상태**: ✅ Code & Documentation Cleanup Completed, Migration In Progress

---

## 📝 문서 클린업 요약

### 클린업된 파일 (5개)

**타입 정의 파일 (.d.ts):**
1. `docs/2-areas/spec/0-core/iddl.d.ts` - BlockProps, TextProps, ImageProps 클린업
2. `docs/2-areas/spec/4-element/action/iddl-components.d.ts` - Gap/Align/Justify 타입 제거, 모든 인터페이스 클린업
3. `docs/2-areas/spec/behavior/behavior-primitives-v3.d.ts` - ✅ 위반 없음 확인

**명세 문서 (.md):**
4. `docs/2-areas/spec/4-element/action/block-spec.md` - LayoutProps 인터페이스 제거 및 대체
5. `docs/2-areas/spec/0-core/iddl-1.0-spec-ko.md` - TextProps, ImageProps, SeparatorProps 클린업

### 제거된 위반 패턴
- ❌ `gap`, `padding` - prominence × density로 자동 계산되어야 함
- ❌ `align`, `justify` - role에 따라 자동 결정되어야 함
- ❌ `size` - density로 자동 계산되어야 함
- ❌ `aspectRatio`, `fit` - spec 객체에 포함되어야 함

### 다음 단계
이제 **애플리케이션 코드의 TypeScript 에러 수정** 차례입니다. `pnpm lint`를 실행하여 제거된 props 사용처를 찾아 IDDL 준수 패턴으로 변경해야 합니다.
