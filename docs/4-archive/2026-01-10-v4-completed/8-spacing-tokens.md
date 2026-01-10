# Spacing Token System (IDDL v3.1)

**Created:** 2025-01-09
**Status:** ✅ Implemented

## 목적

수동 spacing 결정(gap-1, px-2, py-1.5 등)을 제거하고, prominence × density 조합으로 일관된 spacing을 자동 계산합니다.

### 해결하는 문제

**Before (수동 spacing):**
```tsx
<button className="flex items-center gap-1 px-2 py-1.5 text-sm">
  Click me
</button>

<div className="flex flex-col gap-4 p-6">
  {children}
</div>
```

**After (자동 Spacing Token System):**
```tsx
<Action prominence="Standard" density="Standard">
  Click me
</Action>
// → 자동 적용: gap-3 px-2 py-1.5

<Group prominence="Standard" density="Comfortable">
  {children}
</Group>
// → 자동 적용: gap-6 px-4 py-3 (if padding needed)
```

**장점:**
- ✅ prominence × density 조합으로 spacing 자동 계산
- ✅ 일관성 보장 (같은 prominence/density는 항상 같은 spacing)
- ✅ 수동 결정 제거 (gap-1? gap-2? → 시스템이 결정)
- ✅ 디자인 변경 시 공식만 수정하면 전체 적용

---

## 공식 (Formula)

```
prominence × density → gap/padding
```

### Input 파라미터

1. **prominence**: Hero | Primary | Secondary | Tertiary
   - Hero: 1.5배 (가장 넓은 spacing)
   - Standard: 1.0배 (표준)
   - Strong: 0.75배
   - Subtle: 0.5배 (가장 좁은 spacing)

2. **density**: Comfortable | Standard | Compact
   - Comfortable: 1.5배 (여유로운 spacing)
   - Standard: 1.0배 (표준)
   - Compact: 0.75배 (좁은 spacing)

### Output

Tailwind CSS className 문자열 (gap, padding)

```typescript
calculateSpacing({
  prominence: 'Standard',
  density: 'Standard'
})
// → {
//   gap: 16,
//   paddingX: 12,
//   paddingY: 8,
//   className: 'gap-4 px-3 py-2'
// }
```

---

## 계산 로직

### Step 1: Factor 계산

```typescript
const prominenceFactors: Record<Prominence, number> = {
  Hero: 1.5,      // 1.5배 큰 spacing
  Standard: 1.0,   // 표준 spacing
  Strong: 0.75, // 0.75배 작은 spacing
  Subtle: 0.5,  // 0.5배 가장 작은 spacing
};

const densityFactors: Record<Density, number> = {
  Comfortable: 1.5, // 1.5배 여유로운 spacing
  Standard: 1.0,    // 표준 spacing
  Compact: 0.75,    // 0.75배 좁은 spacing
};
```

### Step 2: Base Spacing 값

```typescript
const BASE_GAP = 16;        // gap의 기준값 (px)
const BASE_PADDING_X = 12;  // padding-x의 기준값 (px)
const BASE_PADDING_Y = 8;   // padding-y의 기준값 (px)
```

### Step 3: 계산 공식

```typescript
rawValue = baseValue × prominenceFactor × densityFactor
```

**예시: Primary + Standard**
```
gap = 16 × 1.0 × 1.0 = 16px
paddingX = 12 × 1.0 × 1.0 = 12px
paddingY = 8 × 1.0 × 1.0 = 8px
```

**예시: Hero + Comfortable**
```
gap = 16 × 1.5 × 1.5 = 36px → snap to 32px
paddingX = 12 × 1.5 × 1.5 = 27px → snap to 24px
paddingY = 8 × 1.5 × 1.5 = 18px → snap to 16px
```

### Step 4: Snap to Allowed Values

계산된 값을 허용된 값으로 스냅:

**허용된 spacing 값 (px):**
```typescript
[4, 8, 12, 16, 24, 32, 48, 64, 96]
```

**Snap 로직:**
```typescript
function snapToAllowedValue(value: number): number {
  const allowedValues = [4, 8, 12, 16, 24, 32, 48, 64, 96];
  return allowedValues.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

snapToAllowedValue(14) → 16
snapToAllowedValue(20) → 24
snapToAllowedValue(36) → 32
```

### Step 5: px → Tailwind Class 변환

```typescript
const map: Record<number, string> = {
  4: '1',   // gap-1 = 4px
  8: '2',   // gap-2 = 8px
  12: '3',  // gap-3 = 12px
  16: '4',  // gap-4 = 16px
  24: '6',  // gap-6 = 24px
  32: '8',  // gap-8 = 32px
  48: '12', // gap-12 = 48px
  64: '16', // gap-16 = 64px
  96: '24', // gap-24 = 96px
};
```

---

## prominence × density 조합 Matrix

### Gap Values (px 기준)

| Prominence \ Density | Comfortable | Standard | Compact |
|---------------------|-------------|----------|---------|
| **Hero**            | 32px (gap-8) | 24px (gap-6) | 16px (gap-4) |
| **Primary**         | 24px (gap-6) | 16px (gap-4) | 8px (gap-2) |
| **Secondary**       | 16px (gap-4) | 12px (gap-3) | 8px (gap-2) |
| **Tertiary**        | 12px (gap-3) | 8px (gap-2) | 4px (gap-1) |

### Padding-X Values (px 기준)

| Prominence \ Density | Comfortable | Standard | Compact |
|---------------------|-------------|----------|---------|
| **Hero**            | 32px (px-8) | 24px (px-6) | 16px (px-4) |
| **Primary**         | 16px (px-4) | 12px (px-3) | 8px (px-2) |
| **Secondary**       | 12px (px-3) | 8px (px-2) | 8px (px-2) |
| **Tertiary**        | 8px (px-2)  | 8px (px-2) | 4px (px-1) |

### Padding-Y Values (px 기준)

| Prominence \ Density | Comfortable | Standard | Compact |
|---------------------|-------------|----------|---------|
| **Hero**            | 24px (py-6) | 16px (py-4) | 12px (py-3) |
| **Primary**         | 12px (py-3) | 8px (py-2)  | 4px (py-1) |
| **Secondary**       | 8px (py-2)  | 6px (py-1.5)| 4px (py-1) |
| **Tertiary**        | 6px (py-1.5)| 4px (py-1)  | 2px (py-0.5)|

---

## 구현 상세

### 파일 위치

`/src/shared/config/spacing-tokens.ts`

### 핵심 타입

```typescript
export interface SpacingConfig {
  prominence?: Prominence;
  density?: Density;
  override?: {
    gap?: number;
    padding?: { x?: number; y?: number };
  };
}

export interface SpacingResult {
  gap: number;
  paddingX: number;
  paddingY: number;
  className: string;
}
```

### CVA Variants (Full Spacing)

```typescript
export const spacingVariants = cva('', {
  variants: {
    prominence: { Hero, Primary, Secondary, Tertiary },
    density: { Comfortable, Standard, Compact },
  },
  compoundVariants: [
    // Hero
    { prominence: 'Hero', density: 'Comfortable', class: 'gap-8 px-8 py-6' },
    { prominence: 'Hero', density: 'Standard', class: 'gap-6 px-6 py-4' },
    { prominence: 'Hero', density: 'Compact', class: 'gap-4 px-4 py-3' },

    // Primary
    { prominence: 'Standard', density: 'Comfortable', class: 'gap-6 px-4 py-3' },
    { prominence: 'Standard', density: 'Standard', class: 'gap-4 px-3 py-2' },
    { prominence: 'Standard', density: 'Compact', class: 'gap-2 px-2 py-1' },

    // ... 12 combinations total
  ],
});
```

### CVA Variants (Gap Only)

```typescript
export const gapVariants = cva('', {
  variants: {
    prominence: { Hero, Primary, Secondary, Tertiary },
    density: { Comfortable, Standard, Compact },
  },
  compoundVariants: [
    { prominence: 'Standard', density: 'Standard', class: 'gap-4' },
    // ...
  ],
});
```

### CVA Variants (Padding Only)

```typescript
export const paddingVariants = cva('', {
  variants: {
    prominence: { Hero, Primary, Secondary, Tertiary },
    density: { Comfortable, Standard, Compact },
  },
  compoundVariants: [
    { prominence: 'Standard', density: 'Standard', class: 'px-3 py-2' },
    // ...
  ],
});
```

---

## 사용 예시

### Action 컴포넌트

**Before (수동 spacing):**
```tsx
<button className="py-2 px-4 text-base font-medium gap-2">
  Click me
</button>
```

**After (Spacing Token System):**
```tsx
const spacingClasses = spacingVariants({
  prominence: 'Standard',
  density: 'Standard',
});

<button className={cn('inline-flex items-center', spacingClasses)}>
  Click me
</button>
// → Applies: gap-4 px-3 py-2
```

### Group 컴포넌트 (Gap만 필요)

```tsx
const spacingClasses = gapVariants({
  prominence: 'Standard',
  density: 'Compact',
});

<div className={cn('flex flex-col', spacingClasses)}>
  {children}
</div>
// → Applies: gap-2
```

### Override (특수 케이스)

```tsx
const spacing = calculateSpacing({
  prominence: 'Standard',
  density: 'Standard',
  override: {
    gap: 24, // 강제 24px gap
    padding: { x: 16 }, // 강제 16px padding-x
  }
});

<div className={spacing.className}>
  {children}
</div>
// → Applies: gap-6 px-4 py-2
```

---

## 통합 (Integration)

### Action 컴포넌트

**파일:** `/src/components/types/Item/Action/Action.tsx`

**변경사항:**
```tsx
import { spacingVariants } from '@/shared/config/spacing-tokens';

export function Action({ prominence, density, ... }) {
  const computedDensity = density ?? ctx.density ?? 'Standard';

  const spacingClasses = spacingVariants({
    prominence: computedProminence as Prominence,
    density: computedDensity as 'Compact' | 'Standard' | 'Comfortable',
  });

  return (
    <button className={cn(
      'inline-flex items-center',
      spacingClasses, // Automatic spacing
      className
    )} />
  );
}
```

### Group 컴포넌트 (Gap만 적용)

**파일:** `/src/components/types/Group/Group.tsx`

**변경사항:**
```tsx
import { gapVariants } from '@/shared/config/spacing-tokens';

export function Group({ prominence, density, gap, ... }) {
  // Manual override 지원
  const spacingClasses = gap
    ? `gap-${gap}` // override
    : gapVariants({
        prominence: computedProminence as Prominence,
        density: computedDensity as Density,
      });

  return (
    <Component className={cn(
      groupVariants({ layout, role, density }),
      spacingClasses, // Automatic gap
      className
    )} />
  );
}
```

---

## 디버깅

### calculateSpacing

```typescript
import { calculateSpacing } from '@/shared/config/spacing-tokens';

const result = calculateSpacing({
  prominence: 'Standard',
  density: 'Comfortable'
});

console.log(result);
// {
//   gap: 24,
//   paddingX: 16,
//   paddingY: 12,
//   className: 'gap-6 px-4 py-3'
// }
```

### showSpacingMatrix

```typescript
import { showSpacingMatrix } from '@/shared/config/spacing-tokens';

showSpacingMatrix();
// Console.table()로 모든 prominence × density 조합 출력
```

**Output:**
```
┌─────────────┬──────────────┬──────┬──────────┬──────────┬────────────────────┐
│   prominence│   density    │  gap │ paddingX │ paddingY │     className      │
├─────────────┼──────────────┼──────┼──────────┼──────────┼────────────────────┤
│ Hero        │ Comfortable  │  32  │    32    │    24    │ gap-8 px-8 py-6    │
│ Hero        │ Standard     │  24  │    24    │    16    │ gap-6 px-6 py-4    │
│ Primary     │ Standard     │  16  │    12    │     8    │ gap-4 px-3 py-2    │
│ ...         │ ...          │  ... │    ...   │    ...   │ ...                │
└─────────────┴──────────────┴──────┴──────────┴──────────┴────────────────────┘
```

---

## 확장 가이드

### Base Spacing 값 변경

`spacing-tokens.ts`:
```typescript
const BASE_GAP = 20;        // 16 → 20으로 변경
const BASE_PADDING_X = 16;  // 12 → 16으로 변경
const BASE_PADDING_Y = 10;  // 8 → 10으로 변경
```

**영향:**
- 모든 prominence × density 조합이 자동으로 재계산됨
- Primary + Standard: gap-4 (16px) → gap-5 (20px) (새로운 snap 필요)

### Prominence/Density Factor 조정

```typescript
const prominenceFactors: Record<Prominence, number> = {
  Hero: 2.0,      // 1.5 → 2.0으로 변경 (더 큰 차이)
  Standard: 1.0,
  Strong: 0.5, // 0.75 → 0.5로 변경 (더 작은 spacing)
  Subtle: 0.25, // 0.5 → 0.25로 변경
};
```

---

## 이전 버전과의 호환성

### v1.0.1 → v3.1 마이그레이션

**v1.0.1 (수동 spacing):**
```tsx
<button className="py-2 px-4 text-base font-medium gap-2">
  Click me
</button>
```

**v3.1 (Spacing Token System):**
```tsx
<Action prominence="Standard" density="Standard">
  Click me
</Action>
// Automatic: gap-4 px-3 py-2
```

**Breaking Changes:**
- None (additive feature)
- 기존 수동 spacing은 그대로 동작
- 새로운 IDDL 컴포넌트만 자동 spacing 사용

---

## Interactive State Token System과의 통합

**Combined Usage:**
```tsx
const interactiveClasses = getInteractiveClasses({
  prominence,
  intent,
  config: { selected, disabled },
});

const spacingClasses = spacingVariants({
  prominence,
  density,
});

<button className={cn(
  'inline-flex items-center rounded',
  interactiveClasses, // hover, active, selected, focus
  spacingClasses,     // gap, padding
  className
)} />
```

**결과:**
- Interactive State: `bg-surface-hover` (hover 시)
- Spacing: `gap-4 px-3 py-2` (prominence × density)
- 두 시스템이 독립적으로 동작하며 충돌 없음

---

## 체크리스트

- [x] Spacing Token System 구현 (`spacing-tokens.ts`)
- [x] calculateSpacing() 함수 구현
- [x] spacingVariants, gapVariants, paddingVariants CVA 정의
- [x] Action 컴포넌트에 통합
- [x] Group 컴포넌트에 통합 (gap only)
- [x] Sidebar.tsx 리팩토링 검증
- [x] 문서화 완료

---

## 다음 단계

1. **Section/Page 컴포넌트 통합** - 큰 컨테이너에도 spacing token 적용
2. **Responsive Spacing** - md:gap-6, lg:gap-8 등 반응형 지원
3. **Storybook 문서화** - 모든 prominence × density 조합 시각화
4. **성능 최적화** - CVA 결과 메모이제이션 검토

---

## 참고 자료

- **Tailwind Spacing:** https://tailwindcss.com/docs/customizing-spacing
- **CVA 문서:** https://cva.style/docs
- **IDDL 스펙 v1.0.1:** `/docs/2-areas/spec/iddl-spec-1.0.1.md`
- **Interactive State Token System:** `/docs/1-project/7-interactive-state-tokens.md`
- **CLAUDE.md:** `/CLAUDE.md` (Design Tokens 섹션)
