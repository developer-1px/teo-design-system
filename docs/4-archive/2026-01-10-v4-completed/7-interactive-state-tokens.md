# Interactive State Token System (IDDL v3.1)

**Created:** 2025-01-09
**Status:** ✅ Implemented

## 목적

반복적인 인터랙션 스타일 코드를 제거하고, prominence × intent 조합으로 모든 인터랙션 상태(hover, active, selected, disabled, focus)를 자동 계산합니다.

### 해결하는 문제

**Before (수동 className):**
```tsx
<button className="w-full flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-hover rounded transition-colors">
  List Item
</button>
```

**After (자동 Token System):**
```tsx
<Action
  prominence="Standard"
  intent="Neutral"
  selected={isSelected}
>
  List Item
</Action>
```

**장점:**
- ✅ hover, active, selected, disabled 상태를 prominence + intent 조합으로 자동 생성
- ✅ 일관된 인터랙션 경험 보장 (모든 버튼이 같은 규칙 따름)
- ✅ 반복 코드 제거 (hover:bg-*, active:*, focus:* 등)
- ✅ 디자인 변경 시 Token만 수정하면 전체 적용

---

## 공식 (Formula)

```
prominence × intent × state → className
```

### Input 파라미터

1. **prominence**: Hero | Primary | Secondary | Tertiary
   - Hero: 가장 강조된 인터랙션 (Primary CTA)
   - Standard: 표준 인터랙션 (일반 버튼, 리스트 아이템)
   - Strong: 덜 강조된 인터랙션 (보조 버튼)
   - Subtle: 가장 약한 인터랙션 (아이콘 버튼)

2. **intent**: Neutral | Brand | Positive | Caution | Critical | Info
   - Neutral: 기본 색상 (회색 계열)
   - Brand: 브랜드 색상 (Primary CTA용)
   - Positive: 성공/확인 (녹색 계열)
   - Caution: 경고 (노란색 계열)
   - Critical: 위험/삭제 (빨간색 계열)
   - Info: 정보 (파란색 계열)

3. **state**: idle | hover | active | selected | disabled
   - idle: 기본 상태
   - hover: 마우스 호버 시
   - active: 클릭 중 (마우스 다운)
   - selected: 선택된 상태 (토글, 탭, 리스트 아이템)
   - disabled: 비활성화 상태

### Output

Tailwind CSS className 문자열

```typescript
getInteractiveClasses({
  prominence: 'Standard',
  intent: 'Neutral',
  config: { selected: true }
})
// → "bg-accent-subtle text-accent border-l-2 border-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent"
```

---

## 구현 상세

### 파일 위치

`/src/shared/config/interactive-tokens.ts`

### 핵심 타입

```typescript
export type InteractiveState = 'idle' | 'hover' | 'active' | 'selected' | 'disabled';

export interface InteractiveConfig {
  selected?: boolean;
  disabled?: boolean;
  focusable?: boolean;
  clickable?: boolean;
}
```

### CVA Variants 구조

```typescript
export const interactiveVariants = cva('transition-colors duration-150', {
  variants: {
    prominence: { Hero, Primary, Secondary, Tertiary },
    intent: { Neutral, Brand, Positive, Caution, Critical, Info },
    state: { idle, hover, active, selected, disabled },
  },
  compoundVariants: [
    // prominence × intent × state 조합별 className 정의
    { prominence: 'Standard', intent: 'Neutral', state: 'hover', class: 'hover:bg-surface-hover' },
    { prominence: 'Standard', intent: 'Neutral', state: 'selected', class: 'bg-accent-subtle text-accent border-l-2 border-accent' },
    // ... 70+ combinations
  ],
});
```

### 헬퍼 함수

```typescript
export function getInteractiveClasses({
  prominence = 'Primary',
  intent = 'Neutral',
  config = {},
  className,
}: {
  prominence?: Prominence;
  intent?: Intent;
  config?: InteractiveConfig;
  className?: string;
}): string;
```

**동작 방식:**
1. `config.disabled` → state = 'disabled'
2. `config.selected` → state = 'selected'
3. 그 외 → state = 'idle'
4. `interactiveVariants()` + `focusVariants()` + custom className 합성

---

## 사용 예시

### Action 컴포넌트 (v3.1)

**Before (v1.0.1 - 수동 CVA variants):**
```tsx
<button className={actionVariants({ prominence, intent, density })}>
  Click me
</button>
```

**After (v3.1 - Interactive Token System):**
```tsx
const interactiveClasses = getInteractiveClasses({
  prominence,
  intent,
  config: { selected, disabled, focusable: true },
});

<button className={cn('inline-flex items-center', interactiveClasses, spacingClasses)}>
  Click me
</button>
```

### Sidebar 리스트 아이템 (v3.1)

**Before (Raw HTML):**
```tsx
<button
  onClick={handleClick}
  className="w-full flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-hover rounded transition-colors"
>
  {icon}
  {label}
</button>
```

**After (Pure IDDL):**
```tsx
<Action
  prominence="Standard"
  intent="Neutral"
  selected={isSelected}
  onClick={handleClick}
  className="w-full justify-start"
>
  {icon}
  {label}
</Action>
```

**자동 적용되는 스타일:**
- idle: `bg-transparent text-text-secondary`
- hover: `hover:bg-surface-raised`
- selected: `bg-surface-raised text-text-primary font-medium`
- focus: `focus-visible:ring-2 focus-visible:ring-accent`

### Group 컴포넌트 (Clickable 리스트 아이템)

```tsx
<Group
  role="Container"
  prominence="Standard"
  clickable={true}
  selected={isSelected}
  onClick={handleClick}
>
  {children}
</Group>
```

**자동 적용:**
- `clickable=true` → Interactive State 적용
- `clickable=false` → Interactive State 미적용 (기본 컨테이너)

---

## prominence × intent × state 조합 예시

### Primary + Neutral (가장 일반적인 버튼/리스트)

| State | className |
|-------|-----------|
| idle | `bg-surface text-text-primary` |
| hover | `hover:bg-surface-hover` |
| active | `active:bg-surface-pressed` |
| selected | `bg-accent-subtle text-accent border-l-2 border-accent` |

### Primary + Brand (Primary CTA)

| State | className |
|-------|-----------|
| idle | `bg-accent text-white` |
| hover | `hover:bg-accent-hover` |
| active | `active:bg-accent-pressed` |
| selected | `bg-accent-pressed text-white ring-2 ring-accent ring-offset-2` |

### Secondary + Neutral (보조 버튼)

| State | className |
|-------|-----------|
| idle | `bg-transparent text-text-secondary` |
| hover | `hover:bg-surface-raised` |
| active | `active:bg-surface-hover` |
| selected | `bg-surface-raised text-text-primary font-medium` |

### Primary + Critical (삭제 버튼)

| State | className |
|-------|-----------|
| idle | `bg-critical text-white` |
| hover | `hover:bg-critical-hover` |
| active | `active:bg-critical-pressed` |

---

## Focus State Variants

키보드 네비게이션을 위한 포커스 링:

```typescript
export const focusVariants = cva('outline-none', {
  variants: {
    intent: {
      Neutral: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      Brand: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      Critical: 'focus-visible:ring-2 focus-visible:ring-critical focus-visible:ring-offset-2',
      // ...
    },
  },
});
```

**의도한 접근성:**
- `outline-none` - 기본 브라우저 outline 제거
- `focus-visible:ring-2` - 키보드 포커스 시에만 ring 표시
- intent별 색상 - intent에 맞는 포커스 색상 사용

---

## 통합 (Integration)

### Action 컴포넌트

**파일:** `/src/components/types/Item/Action/Action.tsx`

**변경사항:**
1. Import 추가:
   ```tsx
   import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
   import { spacingVariants } from '@/shared/config/spacing-tokens';
   ```

2. Props 확장:
   ```tsx
   export interface ActionProps {
     // ... existing props
     selected?: boolean; // v3.1
   }
   ```

3. 렌더링 변경:
   ```tsx
   const interactiveClasses = getInteractiveClasses({
     prominence: computedProminence,
     intent: computedIntent,
     config: { selected, disabled, focusable: true },
   });

   <button className={cn(
     'inline-flex items-center rounded',
     interactiveClasses,
     spacingClasses,
     className
   )} />
   ```

### Group 컴포넌트

**파일:** `/src/components/types/Group/Group.tsx`

**변경사항:**
1. Import 추가:
   ```tsx
   import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
   import { gapVariants } from '@/shared/config/spacing-tokens';
   ```

2. Props 확장:
   ```tsx
   export interface GroupProps {
     // ... existing props
     selected?: boolean; // v3.1
     clickable?: boolean; // v3.1
   }
   ```

3. 조건부 Interactive State 적용:
   ```tsx
   const interactiveClasses = clickable
     ? getInteractiveClasses({
         prominence: computedProminence,
         intent: computedIntent,
         config: { selected, disabled: false, focusable: true },
       })
     : '';
   ```

---

## 디버깅

### debugInteractiveState

```typescript
import { debugInteractiveState } from '@/shared/config/interactive-tokens';

debugInteractiveState({
  prominence: 'Standard',
  intent: 'Neutral',
  config: { selected: true, disabled: false },
});

// Console output:
// [Interactive State] {
//   prominence: 'Standard',
//   intent: 'Neutral',
//   config: { selected: true, disabled: false },
//   computedState: 'selected'
// }
```

---

## 확장 가이드

### 새로운 prominence × intent 조합 추가

**Step 1:** `interactive-tokens.ts` → compoundVariants 추가

```typescript
{
  prominence: 'Hero',
  intent: 'Info',
  state: 'hover',
  class: 'hover:bg-info-hover',
}
```

**Step 2:** CSS variable 확인 (필요 시 추가)

`src/styles/themes.css`:
```css
:root {
  --color-info-hover: hsl(210 100% 45%);
}
```

**Step 3:** Storybook에서 테스트

```tsx
<Action prominence="Hero" intent="Info">Test</Action>
```

---

## 이전 버전과의 호환성

### v1.0.1 → v3.1 마이그레이션

**v1.0.1 (수동 CVA variants):**
```tsx
const actionVariants = cva('...', {
  variants: {
    prominence: { ... },
    intent: { ... },
  },
  compoundVariants: [
    { prominence: 'Standard', intent: 'Brand', class: 'bg-accent text-white' },
  ],
});

<button className={actionVariants({ prominence, intent })} />
```

**v3.1 (Interactive Token System):**
```tsx
const interactiveClasses = getInteractiveClasses({
  prominence,
  intent,
  config: { selected, disabled },
});

<button className={cn('base-classes', interactiveClasses)} />
```

**Breaking Changes:**
- `variant` prop 제거 (Action에서 `variant="list-item"` 등 사용 불가)
- `prominence`/`intent` 조합만으로 스타일 결정
- `selected` prop으로 선택 상태 표현 (prominence를 바꾸는 대신)

---

## 체크리스트

- [x] Interactive State Token System 구현 (`interactive-tokens.ts`)
- [x] Action 컴포넌트에 통합
- [x] Group 컴포넌트에 통합 (clickable 지원)
- [x] Sidebar.tsx 리팩토링 (Pure IDDL + Interactive Tokens)
- [x] 문서화 완료

---

## 다음 단계

1. **Overlay 컴포넌트 통합** - Dialog, Drawer, Popover에도 Interactive Tokens 적용
2. **Storybook 문서화** - 모든 prominence × intent 조합 시각화
3. **성능 최적화** - CVA 결과 메모이제이션 검토
4. **테마 지원** - Dark mode에서도 일관된 Interactive State

---

## 참고 자료

- **CVA 문서:** https://cva.style/docs
- **IDDL 스펙 v1.0.1:** `/docs/2-areas/spec/iddl-spec-1.0.1.md`
- **Spacing Token System:** `/docs/1-project/8-spacing-tokens.md`
- **CLAUDE.md:** `/CLAUDE.md` (Design Token 섹션)
