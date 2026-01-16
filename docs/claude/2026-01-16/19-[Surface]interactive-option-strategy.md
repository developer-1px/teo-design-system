# Surface Interactive Option Strategy

**작성일**: 2026-01-16
**태그**: #Surface #Interactive #Design #State

## 1. 결정 사항 요약

### 핵심 결정
1. **Variants 방식 폐기**: `raised-bordered`, `raised-floating` 등 복합 토큰 사용 안 함
2. **Interactive 옵션 도입**: `interactive` prop으로 hover/active/focus/selected 등 모든 state 처리
3. **Ghost Surface 추가**: 투명 배경의 새로운 surface 토큰
4. **Border/Shadow의 본질**: Interactive state 표현이 목적

### 기존 접근의 문제점

**Option A (Variants)의 한계**:
```typescript
// ❌ 조합 폭발
"raised" | "raised-bordered" | "raised-floating" | "raised-flat"
"overlay" | "overlay-bordered" | "overlay-floating" | "overlay-flat"

// 10개 토큰으로 증가
// 네이밍 복잡도 증가
// 여전히 interactive state는 별도 처리 필요
```

**근본 원인 재인식**:
> Border와 shadow가 필요한 이유는 **정적 구분이 아니라 Interactive state 표현** 때문

## 2. 논의 과정

### 2.1 Border/Shadow의 본질

**질문**: "왜 raised/overlay에 border + shadow가 필요한가?"

**기존 답변**:
- "Elevation 표현"
- "4색 정리를 위한 시각적 구분"
- "Depth 표현"

**새로운 인식**:
```css
/* Field의 경우 */
.field-base {
  border: 1px solid var(--field-border);  /* ← 왜 필요? */
}
.field-base:hover {
  border-color: var(--field-border-hover);  /* ← Interactive! */
}
.field-base:focus-within {
  background: var(--field-bg-focus);        /* ← Interactive! */
  border-color: var(--field-border-focus);
}

/* Action의 경우 */
.action-surface:hover {
  background: var(--surface-raised);  /* ← Interactive! */
}
.action-surface:active {
  background: var(--surface-overlay);  /* ← Interactive! */
}
```

**핵심 통찰**:
> Border와 shadow는 **Interactive state를 시각적으로 구분하기 위한 도구**

### 2.2 Variants의 진짜 문제

**SlideApp 중첩 사례 재검토**:
```tsx
<Frame surface="overlay">
  <Frame surface="overlay" />  // 구분 안 됨
</Frame>
```

**기존 해석**: "같은 surface라서 구분 안 됨"
**새로운 해석**: "둘 다 **interactive가 아니라서** border/shadow가 불필요"

```tsx
// 올바른 사용
<Frame surface="overlay" interactive>  {/* 버튼처럼 동작 */}
  <Frame surface="base">                {/* 정적 컨텐츠 */}
    Content
  </Frame>
</Frame>
```

**깨달음**:
- Container (정적)는 border/shadow 불필요
- Interactive (동적)만 border/shadow 필요
- Variants가 아니라 **Interactive 여부**가 핵심!

### 2.3 Component Token의 본질

**Field와 Action 재분석**:

```css
/* Field = 항상 interactive */
.field-base {
  border: 1px solid var(--field-border);
}

/* Action ghost = interactive + 투명 배경 */
.action-ghost { /* 배경 없음 */ }
.action-ghost:hover { background: var(--control-bg-hover); }

/* Action surface = interactive + base 배경 */
.action-surface {
  background: var(--surface-base);
  border: 1px solid var(--border-color);
}
```

**패턴 발견**:
1. Field/Action은 **항상 interactive**
2. Interactive 요소만 border/shadow 필요
3. Ghost = Interactive + 투명 배경

**새로운 접근**:
```tsx
// Field = Frame + interactive (항상)
<Frame interactive surface="sunken">
  <input />
</Frame>

// Action ghost = Frame + interactive + ghost surface
<Frame interactive surface="ghost">
  Click me
</Frame>

// Action surface = Frame + interactive + base surface
<Frame interactive surface="base">
  Click me
</Frame>
```

### 2.4 Ghost Surface의 필요성

**Action ghost 패턴**:
```css
.action-ghost {
  /* 배경 없음 */
}
.action-ghost:hover {
  background: var(--control-bg-hover);
}
```

**문제**: "배경 없음"을 어떤 surface로 표현?
- `surface={undefined}`? → 명시적이지 않음
- `surface="transparent"`? → 의미적으로 맞지 않음
- `surface="none"`? → Surface가 "없다"는 건 이상함

**해결**: `ghost` surface 도입
```typescript
type SurfaceToken =
  | "ghost"    // ← NEW: 투명 배경 (interactive 전용)
  | "sunken"
  | "base"
  | "raised"
  | "overlay"
  | "primary"
  | "selected"
```

**의미**:
- `ghost`: 존재하지만 보이지 않는 배경
- Interactive 시에만 나타남 (hover/active)
- Button, MenuItem 등에 적합

## 3. 새로운 아키텍처

### 3.1 Surface Token 재정의

```typescript
type SurfaceToken =
  | "ghost"      // 투명 배경 (interactive 전용)
  | "sunken"     // 낮은 배경 (#f9f9fb)
  | "base"       // 기본 배경 (#ffffff)
  | "raised"     // 높은 배경 (#ffffff, 원래 border+shadow였지만 이제는 색상만)
  | "overlay"    // 최상단 배경 (#ffffff, 원래 border+shadow였지만 이제는 색상만)
  | "primary"    // 강조 배경 (#18181b)
  | "selected"   // 선택 배경
```

**핵심 변경**:
- `raised`/`overlay`에서 **border + shadow 제거**
- 순수하게 **색상만** 표현
- Border/shadow는 **interactive 옵션이 처리**

### 3.2 Interactive 옵션

```typescript
interface FrameProps {
  surface?: SurfaceToken;
  interactive?: boolean | InteractiveConfig;
  // ... 기타 props
}

type InteractiveConfig = {
  hover?: boolean;      // hover state 활성화 (기본: true)
  active?: boolean;     // active state 활성화 (기본: true)
  focus?: boolean;      // focus state 활성화 (기본: true)
  selected?: boolean;   // selected state (controlled)
  disabled?: boolean;   // disabled state
};
```

**사용 예시**:
```tsx
// 단순 활성화
<Frame surface="base" interactive>
  Click me
</Frame>

// 세밀한 제어
<Frame
  surface="ghost"
  interactive={{ hover: true, active: true, focus: false }}
>
  Hover only
</Frame>

// Selected state (controlled)
<Frame
  surface="base"
  interactive={{ selected: isSelected }}
>
  {isSelected ? "Selected" : "Not selected"}
</Frame>
```

### 3.3 CSS 구현

```css
/* --- 1. Surface (색상만) --- */
.surface-ghost {
  background-color: transparent;
}

.surface-sunken {
  background-color: var(--surface-sunken);
}

.surface-base {
  background-color: var(--surface-base);
}

.surface-raised {
  background-color: var(--surface-raised);
}

.surface-overlay {
  background-color: var(--surface-overlay);
}

.surface-primary {
  background-color: var(--primary-bg);
  color: var(--primary-fg);
}

.surface-selected {
  background-color: var(--surface-selected);
}

/* --- 2. Interactive States --- */
/* Ghost + Interactive */
.surface-ghost.interactive {
  /* 기본 상태: 투명 */
}

.surface-ghost.interactive:hover {
  background-color: var(--control-bg-hover);  /* #f4f4f5 */
}

.surface-ghost.interactive:active {
  background-color: var(--surface-sunken);
  border: 1px solid var(--border-color);
}

/* Base + Interactive */
.surface-base.interactive {
  border: 1px solid var(--border-color);
}

.surface-base.interactive:hover {
  background-color: var(--surface-raised);
  box-shadow: var(--shadow-sm);
}

.surface-base.interactive:active {
  background-color: var(--surface-overlay);
  box-shadow: var(--shadow-md);
}

/* Sunken + Interactive (Field 패턴) */
.surface-sunken.interactive {
  border: 1px solid var(--field-border);
}

.surface-sunken.interactive:hover {
  border-color: var(--field-border-hover);
}

.surface-sunken.interactive:focus-within {
  background-color: var(--surface-base);  /* 상승 */
  border-color: var(--field-border-focus);
}

/* Raised + Interactive */
.surface-raised.interactive {
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.surface-raised.interactive:hover {
  background-color: var(--surface-overlay);
  box-shadow: var(--shadow-md);
}

.surface-raised.interactive:active {
  box-shadow: var(--shadow-lg);
}

/* Primary + Interactive */
.surface-primary.interactive:hover {
  opacity: 0.9;
}

.surface-primary.interactive:active {
  opacity: 0.8;
}

/* Selected State */
.interactive.is-selected {
  background-color: var(--surface-selected);
  border-color: var(--primary-bg);
}

/* Disabled State */
.interactive:disabled,
.interactive.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### 3.4 State Transition 전략

**Surface 상승 규칙**:
```
ghost     → (hover) sunken     → (active) sunken + border
sunken    → (hover) sunken     → (focus)  base
base      → (hover) raised     → (active) overlay
raised    → (hover) overlay    → (active) overlay + shadow-lg
overlay   → (hover) overlay    → (active) overlay + shadow-xl
primary   → (hover) opacity 0.9 → (active) opacity 0.8
```

**핵심 패턴**:
1. **Elevation 상승**: 한 단계 위 surface로 전환
2. **Shadow 강화**: 같은 surface에서 shadow만 증가
3. **Border 추가**: 필요 시 border 추가 (ghost → sunken)
4. **Opacity 감소**: primary는 색상 유지하고 투명도만 변경

## 4. 마이그레이션

### 4.1 기존 코드 변경

#### Field Component
**Before**:
```tsx
// Component Token 사용
<Field />  // .field-base 클래스
```

**After**:
```tsx
// Frame + interactive로 통합
<Frame
  surface="sunken"
  interactive
  as="label"
>
  <input />
</Frame>
```

#### Action Component
**Before**:
```tsx
<Action variant="ghost" icon={Icon} />
<Action variant="surface" label="Button" />
<Action variant="primary" label="Save" />
```

**After**:
```tsx
<Frame surface="ghost" interactive as="button">
  <Icon />
</Frame>

<Frame surface="base" interactive as="button">
  Button
</Frame>

<Frame surface="primary" interactive as="button">
  Save
</Frame>
```

### 4.2 SlideApp 수정

**Before** (문제):
```tsx
<Frame surface="overlay">
  <Frame surface="overlay" />  // 구분 안 됨
</Frame>
```

**After** (해결):
```tsx
<Frame surface="overlay" interactive>  {/* 버튼으로 동작 */}
  <Frame surface="base">                {/* 정적 컨텐츠 */}
    Icon
  </Frame>
</Frame>
```

**또는**:
```tsx
<Frame surface="base">                  {/* 정적 container */}
  <Frame surface="ghost" interactive>  {/* interactive 버튼 */}
    Icon
  </Frame>
</Frame>
```

### 4.3 Breaking Changes

#### 1. Surface CSS 변경
```css
/* Before */
.surface-raised {
  background: var(--surface-raised);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

/* After */
.surface-raised {
  background: var(--surface-raised);
  /* border, shadow 제거 → interactive가 처리 */
}
```

**영향**:
- 기존 `surface="raised"` 사용 시 border/shadow 사라짐
- Interactive 의도라면 `interactive` prop 추가 필요

#### 2. Component Token 제거
```css
/* Before */
.field-base { /* ... */ }
.action-ghost { /* ... */ }
.action-surface { /* ... */ }

/* After */
/* 모두 .interactive 클래스로 통합 */
```

**영향**:
- Field/Action 컴포넌트 내부 구현 변경
- 외부 API는 유지 가능 (래퍼로 사용)

## 5. 장점

### 5.1 일관성
```tsx
// 모든 interactive 요소가 같은 패턴
<Frame surface="ghost" interactive />      // Button ghost
<Frame surface="base" interactive />       // Button surface
<Frame surface="sunken" interactive />     // Field
<Frame surface="base" interactive={{ selected }} />  // List item
```

### 5.2 명확한 의도
```tsx
// Container (정적)
<Frame surface="base">
  Content
</Frame>

// Interactive (동적)
<Frame surface="base" interactive>
  Click me
</Frame>
```

**한눈에 구분 가능**:
- `interactive` 있음 → 클릭/포커스 가능
- `interactive` 없음 → 정적 컨텐츠

### 5.3 유연성
```tsx
// 세밀한 제어
<Frame
  surface="ghost"
  interactive={{
    hover: true,
    active: false,  // active state 비활성화
    selected: isSelected,
    disabled: isDisabled,
  }}
/>
```

### 5.4 토큰 단순화
```typescript
// Before (Variants 방식)
10개 토큰:
  base, sunken,
  raised, raised-bordered, raised-floating, raised-flat,
  overlay, overlay-bordered, overlay-floating, overlay-flat

// After (Interactive 방식)
7개 토큰:
  ghost, sunken, base, raised, overlay, primary, selected

// 3개 감소 + 명확한 역할 분리
```

### 5.5 CSS 간소화
```css
/* Before */
.surface-raised { /* ... */ }
.surface-raised-bordered { /* ... */ }
.surface-raised-floating { /* ... */ }
.surface-raised-flat { /* ... */ }
/* 4개 클래스 */

/* After */
.surface-raised { /* 색상만 */ }
.surface-raised.interactive { /* border + shadow */ }
.surface-raised.interactive:hover { /* state */ }
/* 3개 클래스 (더 명확) */
```

## 6. 단점 및 대응

### 6.1 Breaking Change
**문제**: 기존 `surface="raised"` 코드에서 border/shadow 사라짐

**대응**:
1. **Deprecation 경고**: 1 버전 동안 경고 표시
2. **Migration Script**: 자동 변환 도구 제공
3. **Fallback**: `data-legacy` 속성으로 기존 스타일 유지

```tsx
// Fallback 예시
<Frame surface="raised" data-legacy>
  {/* 기존 border + shadow 유지 */}
</Frame>
```

### 6.2 Boolean Complexity
**문제**: `interactive={true}` vs `interactive={{ hover: true, ... }}`

**대응**:
```typescript
// Default = 모든 state 활성화
interactive={true}  // = { hover: true, active: true, focus: true }

// 필요 시에만 세밀한 제어
interactive={{ hover: true, active: false }}
```

### 6.3 Field/Action 래퍼 유지
**문제**: Field/Action 컴포넌트 제거?

**대응**: 래퍼로 유지
```tsx
// Field.tsx
export function Field(props) {
  return (
    <Frame
      surface="sunken"
      interactive
      as="label"
      {...props}
    >
      <input />
    </Frame>
  );
}

// Action.tsx
export function Action({ variant = "ghost", ...props }) {
  const surface = variant === "ghost" ? "ghost" :
                  variant === "surface" ? "base" :
                  "primary";

  return (
    <Frame
      surface={surface}
      interactive
      as="button"
      {...props}
    />
  );
}
```

## 7. 구현 우선순위

### Phase 1: CSS 기반 작업
1. [ ] `surface.css`에서 raised/overlay border/shadow 제거
2. [ ] `.interactive` 클래스 추가 및 state 정의
3. [ ] `.surface-ghost` 추가
4. [ ] State transition 규칙 구현

### Phase 2: TypeScript 타입
1. [ ] `SurfaceToken`에 `ghost` 추가
2. [ ] `FrameProps`에 `interactive` prop 추가
3. [ ] `InteractiveConfig` 타입 정의

### Phase 3: Frame 컴포넌트
1. [ ] `interactive` prop 처리 로직 추가
2. [ ] `.interactive` 클래스 조건부 적용
3. [ ] State 관리 (selected, disabled)

### Phase 4: 검증
1. [ ] SlideApp 수정 및 테스트
2. [ ] Field/Action 래퍼 업데이트
3. [ ] 모든 앱 검토 (Discord, CRM, CMS, Mail)

### Phase 5: 문서화
1. [ ] Interactive 사용 가이드
2. [ ] Surface 선택 기준
3. [ ] Migration 가이드

## 8. 예상 결과

### 코드 가독성 향상
```tsx
// Before (혼란스러움)
<Frame surface="raised" />  // 정적? interactive?

// After (명확함)
<Frame surface="base" />              // 정적 container
<Frame surface="base" interactive />  // Interactive button
```

### 일관된 패턴
```tsx
// 모든 interactive 요소가 동일한 패턴
<Frame surface="ghost" interactive />   // Ghost button
<Frame surface="sunken" interactive />  // Input field
<Frame surface="base" interactive />    // Surface button
```

### Surface의 본질 회복
```
Surface = 색상 (시각적 레이어)
Interactive = 상호작용 (동작)

명확한 역할 분리
```

## 9. 결론

### 핵심 인사이트
1. **Border/Shadow의 본질은 Interactive state 표현**
2. **Variants는 문제를 해결하지 못함** (여전히 state 처리 필요)
3. **Interactive 옵션이 근본 해결책**

### 결정 사항
1. Surface Variants 폐기
2. Interactive 옵션 도입
3. Ghost Surface 추가
4. Surface는 순수하게 색상만 표현

### 기대 효과
1. 명확한 의도 표현
2. 일관된 패턴
3. 토큰 단순화 (10개 → 7개)
4. CSS 간소화
5. 타입 안정성 향상

---

**논의 참여자**: Teo, Claude
**최종 결정**: Interactive 옵션 방식 채택
**다음 단계**: Phase 1 구현 시작
