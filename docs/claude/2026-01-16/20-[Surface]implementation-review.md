# Surface Interactive Implementation Review

**작성일**: 2026-01-16
**태그**: #Surface #Interactive #Review #Implementation

## 1. 구현 현황

### ✅ 완료된 부분

#### 1.1 TypeScript 타입 정의
**파일**: `src/design-system/Frame/FrameProps.ts:57`
```typescript
interactive?: boolean | "button" | "text";
```
- `boolean`: 기본 interactive 동작
- `"button"`: cursor: pointer
- `"text"`: cursor: text (Field 용)
- **평가**: ✅ 유연하고 명확한 타입 정의

#### 1.2 Ghost Surface 추가
**파일**: `src/design-system/lib/types.ts:23`
```typescript
export type SurfaceToken =
  | "base"
  | "raised"
  | "sunken"
  | "overlay"
  | "primary"
  | "selected"
  | "page"
  | "panel"
  | "card"
  | "hover"
  | "ghost";  // ← 추가됨
```
- **평가**: ✅ 추가 완료

#### 1.3 Frame 컴포넌트 통합
**파일**: `src/design-system/Frame/Frame.tsx:43, 109`
```typescript
// Line 43: Prop 추가
interactive,

// Line 109: Settings에 포함
...(interactive !== undefined && { interactive }),
```
- **평가**: ✅ 올바른 통합

#### 1.4 frameToSettings 처리
**파일**: `src/design-system/Frame/frameToSettings.ts:223-228`
```typescript
if (props.interactive) {
  classes.push("interactive");
  if (typeof props.interactive === "string") {
    classes.push(`interactive-${props.interactive}`);
  }
}
```
- **평가**: ✅ 간결하고 명확한 로직

#### 1.5 CSS - Ghost Interactive (완벽)
**파일**: `src/style/surface.css:115-130`
```css
.surface-ghost {
  background-color: transparent;
  color: var(--text-body);
  border: var(--border-width) solid transparent;  /* ← Layout shift 방지! */
}

.frame.interactive.surface-ghost:hover {
  background-color: var(--control-bg-hover);
  color: var(--text-primary);
}

.frame.interactive.surface-ghost:active {
  background-color: var(--surface-overlay);
}
```
- **평가**: ✅ **완벽!** Transparent border로 layout shift 방지

#### 1.6 CSS - Sunken Interactive (Field 패턴, 완벽)
**파일**: `src/style/surface.css:89-110`
```css
.frame.interactive.surface-sunken {
  background-color: var(--surface-sunken);
  border: 1px solid var(--border-color);  /* 항상 border */
}

.frame.interactive.surface-sunken:hover {
  background-color: var(--surface-sunken);  /* 배경 유지 */
  border-color: var(--text-muted);          /* Border만 진해짐 */
}

.frame.interactive.surface-sunken:focus-within,
.frame.interactive.surface-sunken.active {
  background-color: var(--surface-base);  /* ← 상승! */
  border-color: var(--text-primary);
  z-index: 1;
}
```
- **평가**: ✅ **완벽!** Field 패턴 정확히 구현

#### 1.7 CSS - Primary Interactive
**파일**: `src/style/surface.css:135-141`
```css
.frame.interactive.surface-primary:hover {
  opacity: 0.9;
}

.frame.interactive.surface-primary:active {
  opacity: 0.8;
}
```
- **평가**: ✅ 올바름

#### 1.8 CSS - Transition
**파일**: `src/style/surface.css:56-60`
```css
.frame.interactive {
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
```
- **평가**: ✅ 부드러운 전환 구현

---

## 2. 문제점 및 개선 필요

### ⚠️ 2.1 CRITICAL: Raised/Overlay의 기본 border+shadow 제거 안 됨

**문제**: `src/style/surface.css:15-25`
```css
.surface-raised {
  background-color: var(--surface-raised);
  box-shadow: var(--shadow-sm);           /* ← 여전히 있음! */
  border: var(--border-width) solid var(--border-color);  /* ← 여전히 있음! */
}

.surface-overlay {
  background-color: var(--surface-overlay);
  box-shadow: var(--shadow-lg);           /* ← 여전히 있음! */
  border: var(--border-width) solid var(--border-color);  /* ← 여전히 있음! */
}
```

**왜 문제인가**:
- **Interactive 전략의 핵심**: "Surface는 색상만, interactive가 border/shadow 처리"
- 현재 코드: `<Frame surface="raised" />` (interactive 없음)에서도 border+shadow 나타남
- **전략과 불일치**: Surface가 여전히 decoration을 포함

**Breaking Change 여부**: YES
- 기존 `surface="raised"` 사용하는 모든 곳에서 border/shadow 사라짐
- Interactive 의도였다면 `interactive` prop 추가 필요

**제안**:
```css
/* Surface는 순수하게 색상만 */
.surface-raised {
  background-color: var(--surface-raised);
  /* border, shadow 제거 */
}

.surface-overlay {
  background-color: var(--surface-overlay);
  /* border, shadow 제거 */
}
```

**대응 방안**:
1. Migration script: `surface="raised"` → `surface="raised" interactive`
2. Deprecation warning: 1 버전 동안 경고
3. Fallback: `data-legacy` 속성 지원

---

### ⚠️ 2.2 Base Interactive - State Transition 불일치

**문제**: `src/style/surface.css:75-83`
```css
.frame.interactive.surface-base:hover {
  background-color: var(--surface-panel);  /* ← Panel? */
}

.frame.interactive.surface-base:active {
  background-color: var(--surface-sunken);  /* ← Sunken? */
}
```

**왜 문제인가**:
1. **Panel은 특수 토큰** (Sidebar 전용), 일반 state transition 아님
2. **논의된 전략**: `base → raised → overlay` (상승)
3. **Action surface 패턴과 불일치**: 기존 `.action-surface`는 `base → raised → overlay`

**현재 (index.css:85-97)**:
```css
.action-surface {
  background-color: var(--surface-base);
  border: 1px solid var(--border-color);
}

.action-surface:hover {
  background-color: var(--surface-raised);  /* ← Raised로 상승 */
}

.action-surface:active {
  background-color: var(--surface-overlay);  /* ← Overlay로 상승 */
}
```

**제안**:
```css
.frame.interactive.surface-base {
  border: 1px solid var(--border-color);
}

.frame.interactive.surface-base:hover {
  background-color: var(--surface-raised);  /* 상승 */
  box-shadow: var(--shadow-sm);
}

.frame.interactive.surface-base:active {
  background-color: var(--surface-overlay);  /* 더 상승 */
  box-shadow: var(--shadow-md);
}
```

---

### ⚠️ 2.3 Raised Interactive - filter 사용 문제

**문제**: `src/style/surface.css:146-156`
```css
.frame.interactive.surface-raised:hover {
  filter: brightness(0.95);  /* ← 문제! */
  border-color: var(--text-muted);  /* ← border가 정의 안 됨 */
}

.frame.interactive.surface-raised:active {
  filter: brightness(0.9);
  transform: translateY(1px);
}
```

**왜 문제인가**:
1. **`filter: brightness()`는 모든 자식에 영향**
   - Icon, Text 색상도 어두워짐
   - 의도한 동작 아닐 가능성
2. **`border-color` 변경하는데 border가 없음**
   - 위에서 `.surface-raised`의 border 제거 안 됨
   - 제거하면 이 코드도 작동 안 함
3. **State transition 전략과 불일치**
   - 논의: `raised → overlay` (상승)
   - 현재: brightness만 감소 (상승 아님)

**제안**:
```css
.frame.interactive.surface-raised {
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.frame.interactive.surface-raised:hover {
  background-color: var(--surface-overlay);  /* 상승 */
  box-shadow: var(--shadow-md);
}

.frame.interactive.surface-raised:active {
  box-shadow: var(--shadow-lg);
  transform: translateY(1px);  /* Tactile feedback 유지 */
}
```

---

### ⚠️ 2.4 Overlay Interactive CSS 누락

**문제**: Overlay interactive CSS가 전혀 없음

**왜 문제인가**:
- `<Frame surface="overlay" interactive />` 사용 시 hover/active 동작 없음
- State transition 전략 불완전

**제안**:
```css
.frame.interactive.surface-overlay {
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
}

.frame.interactive.surface-overlay:hover {
  box-shadow: var(--shadow-xl);
}

.frame.interactive.surface-overlay:active {
  box-shadow: var(--shadow-2xl);
}
```

---

### ⚠️ 2.5 `.active` 클래스 관리 불명확

**문제**: `src/style/surface.css:104`
```css
.frame.interactive.surface-sunken:focus-within,
.frame.interactive.surface-sunken.active {  /* ← .active 클래스? */
  background-color: var(--surface-base);
}
```

**왜 문제인가**:
- `.active` 클래스를 **누가 추가하는지 불명확**
- Frame 컴포넌트에서 state 관리 안 함
- :active pseudo-class와 혼동 가능

**옵션**:
1. **제거**: `:focus-within`만 사용
2. **명확화**: `.is-active` 또는 `.is-selected`로 변경
3. **구현**: Frame에서 controlled state 추가

**제안**: 일단 제거
```css
.frame.interactive.surface-sunken:focus-within {
  background-color: var(--surface-base);
  border-color: var(--text-primary);
  z-index: 1;
}
```

---

### ⚠️ 2.6 Selected State 미구현

**논의에서 언급됨**:
```typescript
interactive?: boolean | InteractiveConfig;

type InteractiveConfig = {
  selected?: boolean;  // controlled state
};
```

**현재**: Selected state CSS 없음

**제안**:
1. **타입 확장 필요** (현재는 `boolean | "button" | "text"` 만)
2. **CSS 추가**:
```css
.frame.interactive.is-selected {
  background-color: var(--surface-selected);
  border-color: var(--primary-bg);
}
```

3. **Frame 컴포넌트에서 처리**:
```typescript
// Frame.tsx
const isSelected = typeof interactive === "object" && interactive.selected;
className={`frame ${settingsClass} ${isSelected ? "is-selected" : ""}`}
```

**우선순위**: 낮음 (필요 시 나중에 추가 가능)

---

## 3. 종합 평가

### 3.1 잘된 점 (70%)

1. ✅ **Ghost surface 완벽 구현**
   - Transparent border로 layout shift 방지
   - Hover/active state 완벽

2. ✅ **Sunken interactive (Field 패턴) 완벽**
   - Border 강제
   - Focus 시 base로 상승
   - z-index 처리

3. ✅ **Primary interactive 완벽**
   - Opacity 조절

4. ✅ **TypeScript 타입 정의 명확**
   - boolean | "button" | "text"

5. ✅ **frameToSettings 로직 간결**

### 3.2 문제점 (30%)

1. ⚠️ **CRITICAL: Raised/Overlay의 기본 border+shadow 제거 안 됨**
   - 전략의 핵심 원칙 위반
   - Breaking change 필요

2. ⚠️ **Base interactive state transition 불일치**
   - Panel 사용 (잘못됨)
   - Raised로 상승해야 함

3. ⚠️ **Raised interactive filter 사용 문제**
   - 자식 요소에 영향
   - Overlay로 상승해야 함

4. ⚠️ **Overlay interactive CSS 누락**

5. ⚠️ **`.active` 클래스 관리 불명확**

---

## 4. 우선순위별 수정 사항

### Priority 1: CRITICAL (전략 일관성)

#### 4.1 Surface에서 border+shadow 제거
```css
/* Before */
.surface-raised {
  background-color: var(--surface-raised);
  box-shadow: var(--shadow-sm);
  border: var(--border-width) solid var(--border-color);
}

/* After */
.surface-raised {
  background-color: var(--surface-raised);
}
```

**영향 범위**: 모든 `surface="raised"` 사용처
**대응**: Migration script 필요

#### 4.2 Base Interactive 수정
```css
.frame.interactive.surface-base {
  border: 1px solid var(--border-color);
}

.frame.interactive.surface-base:hover {
  background-color: var(--surface-raised);
  box-shadow: var(--shadow-sm);
}

.frame.interactive.surface-base:active {
  background-color: var(--surface-overlay);
  box-shadow: var(--shadow-md);
}
```

#### 4.3 Raised Interactive 수정
```css
.frame.interactive.surface-raised {
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.frame.interactive.surface-raised:hover {
  background-color: var(--surface-overlay);
  box-shadow: var(--shadow-md);
}

.frame.interactive.surface-raised:active {
  box-shadow: var(--shadow-lg);
  transform: translateY(1px);
}
```

### Priority 2: HIGH (완성도)

#### 4.4 Overlay Interactive 추가
```css
.frame.interactive.surface-overlay {
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
}

.frame.interactive.surface-overlay:hover {
  box-shadow: var(--shadow-xl);
}

.frame.interactive.surface-overlay:active {
  box-shadow: var(--shadow-2xl);
}
```

#### 4.5 `.active` 클래스 제거
```css
/* Before */
.frame.interactive.surface-sunken:focus-within,
.frame.interactive.surface-sunken.active {
  background-color: var(--surface-base);
}

/* After */
.frame.interactive.surface-sunken:focus-within {
  background-color: var(--surface-base);
  border-color: var(--text-primary);
  z-index: 1;
}
```

### Priority 3: MEDIUM (Future Enhancement)

#### 4.6 Selected State 구현
- 타입 확장: `InteractiveConfig` 추가
- CSS 추가: `.is-selected`
- Frame 로직 추가

---

## 5. State Transition 전략 정리

### 5.1 올바른 Transition 규칙

```
ghost     → (hover) sunken     → (active) overlay
sunken    → (hover) sunken     → (focus)  base
base      → (hover) raised     → (active) overlay
raised    → (hover) overlay    → (active) overlay + shadow-lg
overlay   → (hover) overlay    → (active) overlay + shadow-xl
primary   → (hover) opacity 0.9 → (active) opacity 0.8
```

### 5.2 현재 구현 vs 올바른 전략

| Surface | State | 현재 구현 | 올바른 전략 | 일치? |
|---------|-------|----------|-----------|------|
| ghost | hover | sunken ✅ | sunken | ✅ |
| ghost | active | overlay ✅ | overlay | ✅ |
| sunken | hover | sunken ✅ | sunken | ✅ |
| sunken | focus | base ✅ | base | ✅ |
| base | hover | panel ❌ | raised | ❌ |
| base | active | sunken ❌ | overlay | ❌ |
| raised | hover | brightness ❌ | overlay | ❌ |
| raised | active | brightness ❌ | overlay+shadow | ❌ |
| overlay | hover | ❌ 없음 | overlay+shadow | ❌ |
| primary | hover | opacity ✅ | opacity | ✅ |

**일치율**: 5/10 = 50%

---

## 6. Breaking Changes 관리

### 6.1 영향 받는 코드

**검색 패턴**:
```bash
grep -r 'surface="raised"' src/apps
grep -r 'surface="overlay"' src/apps
```

**예상 영향**:
- SlideApp: overlay 사용 (interactive 추가 필요)
- CMS/CRM: raised/overlay 사용
- 기타 앱들

### 6.2 Migration 전략

#### Phase 1: CSS 수정 + Fallback
```css
/* Legacy 지원 (1 버전 동안) */
.surface-raised[data-legacy] {
  box-shadow: var(--shadow-sm);
  border: var(--border-width) solid var(--border-color);
}
```

#### Phase 2: Deprecation Warning
```typescript
// Frame.tsx
if (surface === "raised" && !interactive && !props["data-legacy"]) {
  console.warn(
    "DEPRECATED: surface='raised' without interactive. " +
    "Add interactive prop or data-legacy attribute."
  );
}
```

#### Phase 3: Migration Script
```bash
# Auto-add interactive to common patterns
sed -i 's/surface="raised" onClick/surface="raised" interactive onClick/g' **/*.tsx
```

---

## 7. 다음 단계

### 즉시 수정 필요 (Priority 1)
1. [ ] `surface.css`: raised/overlay에서 border+shadow 제거
2. [ ] `surface.css`: base interactive state transition 수정
3. [ ] `surface.css`: raised interactive state transition 수정

### 곧 수정 필요 (Priority 2)
4. [ ] `surface.css`: overlay interactive 추가
5. [ ] `surface.css`: `.active` 클래스 제거

### 검증
6. [ ] SlideApp 수정 및 테스트
7. [ ] 모든 앱 검토 (Discord, CRM, CMS, Mail)
8. [ ] Visual regression test

### 문서화
9. [ ] Migration 가이드 작성
10. [ ] Surface 선택 가이드 업데이트
11. [ ] Interactive 사용 예시 추가

---

## 8. 결론

### 구현 품질: B+ (85/100)

**강점**:
- ✅ 핵심 아이디어 정확히 이해
- ✅ Ghost/Sunken/Primary 완벽 구현
- ✅ TypeScript 타입 명확
- ✅ 코드 구조 깔끔

**약점**:
- ⚠️ Raised/Overlay 기본 스타일 미제거 (전략 불일치)
- ⚠️ State transition 50% 일치율
- ⚠️ Breaking change 대응 미준비

### 권장 사항

1. **Priority 1 수정 먼저**: Surface CSS에서 border+shadow 제거
2. **State transition 통일**: 모든 surface가 상승 패턴 따름
3. **Migration 준비**: Fallback + Warning + Script
4. **검증**: SlideApp부터 시작

### 최종 평가

**구현 자체는 우수하지만**, **전략과 100% 일치하려면 Priority 1 수정 필수**.
현재 상태로도 80% 작동하지만, **원칙과의 일관성**을 위해 수정 권장.

---

**검토자**: Claude
**검토일**: 2026-01-16
**다음 리뷰**: Priority 1 수정 후
