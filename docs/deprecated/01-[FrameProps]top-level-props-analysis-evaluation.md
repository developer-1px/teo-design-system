# Frame Top-Level Props Analysis & Evaluation

**Date**: 2026-01-17
**Status**: ✅ Analysis Complete
**Related**: `FrameProps.ts`, `Layout.ts`, `CLAUDE.md`

---

## 📋 Overview

Frame 컴포넌트의 top-level props를 분석하고, 각 prop이 top-level에 있는 이유와 설계 적합성을 평가했습니다. 4 Pillars(Layout, Sizing, Appearance, Decoration) 구조를 기반으로 19개 props를 검토했습니다.

---

## 📊 Full Analysis Table

| Prop | 카테고리 | Top-Level 이유 | 사용 빈도 | 설계 적합성 | 점수 |
|------|---------|---------------|----------|------------|-----|
| **`layout`** | Layout | 2-Tier 시스템의 핵심. 의도 기반 레이아웃 선택 | ⭐⭐⭐⭐⭐ | ✅ 완벽 - 의미론적 레이아웃 | **10/10** |
| **`row`** | Layout | 가장 흔한 플렉스 방향. `layout` 없이 빠른 사용 | ⭐⭐⭐⭐⭐ | ⚠️ `layout`과 중복 가능성 | **7/10** |
| **`wrap`** | Layout | 반응형 그리드 필수. 자주 사용 | ⭐⭐⭐ | ✅ 유용 | **7/10** |
| **`fill`** | Layout | 100% 너비/높이 단축키. 매우 흔함 | ⭐⭐⭐⭐⭐ | ✅ 간결성 제공 | **9/10** |
| **`pack`** | Layout | center alignment 단축키 (`align + justify`) | ⭐⭐⭐⭐ | ✅ 매우 유용한 단축키 | **9/10** |
| **`grid`** | Layout | CSS Grid 활성화. 복잡한 레이아웃에 필수 | ⭐⭐⭐ | ⚠️ `columns/rows` 없이 불완전 | **6/10** |
| **`gap`** | Layout | 자식 간 간격. 거의 모든 레이아웃에 사용 | ⭐⭐⭐⭐⭐ | ✅ 필수 prop | **10/10** |
| **`w`** | Sizing | 너비 지정. 매우 흔함 | ⭐⭐⭐⭐⭐ | ✅ 필수 | **10/10** |
| **`h`** | Sizing | 높이 지정. 매우 흔함 | ⭐⭐⭐⭐ | ✅ 필수 | **10/10** |
| **`ratio`** | Sizing | aspect-ratio 단축키. 이미지/비디오에 유용 | ⭐⭐⭐ | ✅ 유용 | **8/10** |
| **`maxWidth`** | Sizing | 반응형 컨테이너에 자주 사용 | ⭐⭐⭐⭐ | ✅ 중요 | **9/10** |
| **`flex`** | Sizing | flex: 1 단축키. 공간 분배에 필수 | ⭐⭐⭐⭐⭐ | ✅ 필수 | **10/10** |
| **`surface`** | Appearance | 배경/테마 적용. 핵심 디자인 토큰 | ⭐⭐⭐⭐⭐ | ✅ MDK 핵심 개념 | **10/10** |
| **`rounded`** | Appearance | border-radius. 거의 모든 surface에 필요 | ⭐⭐⭐⭐⭐ | ✅ 필수 | **10/10** |
| **`interactive`** | Appearance | hover/active 상태. 인터랙션에 필수 | ⭐⭐⭐⭐ | ✅ 유용 | **9/10** |
| **`selected`** | Appearance | 선택 상태 표시. CommandBar 등에 필요 | ⭐⭐⭐ | ✅ 유용 | **8/10** |
| **`opacity`** | Decoration | 투명도. 시각적 계층에 사용 | ⭐⭐⭐ | ⚠️ 덜 중요, override 가능 | **6/10** |
| **`clip`** | Decoration | overflow: hidden 단축키 | ⭐⭐⭐⭐ | ✅ 유용 | **8/10** |
| **`scroll`** | Decoration | overflow: auto/scroll. 스크롤 영역에 필수 | ⭐⭐⭐⭐⭐ | ✅ 필수 | **10/10** |

---

## 📈 카테고리별 점수

| 카테고리 | Props 개수 | 평균 점수 | 총평 |
|---------|----------|---------|------|
| **Layout** | 7개 | **8.3/10** | 대부분 필수적이지만 `row`/`grid`는 `layout`과 약간 중복 |
| **Sizing** | 5개 | **9.4/10** | 거의 완벽. 모두 자주 사용됨 |
| **Appearance** | 4개 | **9.25/10** | MDK의 핵심 개념들. 매우 잘 설계됨 |
| **Decoration** | 3개 | **8.0/10** | 유용하지만 `opacity`는 덜 중요 |

**종합 평가**: **8.7/10** 🟢

---

## ✅ 설계 장점

### 1. **2-Tier Layout 시스템**
```tsx
// 의도 기반 레이아웃 선택
<Frame layout={Layout.Stack.Content}>
  {children}
</Frame>
```
- ✅ 의미론적으로 명확
- ✅ 일관된 디자인 결정
- ✅ AI 친화적 (WHY 기반)

### 2. **필수 Props 잘 선정**
```tsx
<Frame
  w={Size.n240}        // ✅ 거의 모든 컴포넌트에 사용
  h={Size.n400}        // ✅ 높이 제어 필수
  gap={Space.n12}      // ✅ 자식 간 간격 필수
  flex                 // ✅ 공간 분배 필수
  surface="raised"     // ✅ MDK 핵심
  rounded={Radius2.md} // ✅ 시각적 일관성
  scroll               // ✅ 스크롤 영역 필수
/>
```

### 3. **유용한 단축키 제공**
```tsx
// pack = alignItems: "center" + justifyContent: "center"
<Frame pack>
  <Icon />
</Frame>

// fill = width: "100%" + height: "100%"
<Frame fill>
  <Content />
</Frame>

// clip = overflow: "hidden"
<Frame clip rounded={Radius2.lg}>
  <Image />
</Frame>
```

### 4. **4 Pillars 구조 명확**
1. **Layout** (Inner Flow) - 자식 배치 방식
2. **Sizing** (Outer Constraints) - 자기 자신 크기
3. **Appearance** (Visual Decoration) - 시각적 스타일
4. **Decoration** (Behavior) - 추가 동작

---

## ⚠️ 개선 가능 영역

### 1. **`row` vs `layout` 중복** (7/10)

**문제**: `row`가 top-level에 있으면 `layout`과 충돌 가능

```tsx
// Case 1: row만 사용
<Frame row gap={4}>
  {children}
</Frame>

// Case 2: layout 사용
<Frame layout={Layout.Row.Default}>
  {children}
</Frame>

// Case 3: 둘 다 사용? 🤔
<Frame row layout={Layout.Stack.Content}> // ❓ 어떤게 우선?
  {children}
</Frame>
```

**개선 방안**:

**옵션 A**: 둘 다 유지 + 우선순위 명시
```tsx
// row가 있으면 layout 무시
if (props.row) {
  // row 우선 적용
} else if (props.layout) {
  // layout 적용
}
```

**옵션 B**: `row` 제거, `layout` 전용
```tsx
// row 제거
<Frame layout={Layout.Row.Default}> // ✅ 일관성
```

**추천**: 옵션 A (빠른 사용성 + 일관성)

---

### 2. **`grid` 불완전** (6/10)

**문제**: `grid={true}`만으로는 부족. `columns`/`rows`가 `override`에만 있음

```tsx
// 현재 (불완전)
<Frame grid gap={4}>
  {/* columns를 어떻게 설정? */}
</Frame>

// override 필요 (번거로움)
<Frame grid override={{ columns: "1fr 2fr" }}>
  {children}
</Frame>
```

**개선 방안**: `columns` prop을 top-level로 승격

```tsx
// 제안
interface FramePresetProps {
  grid?: boolean;
  columns?: string; // ✅ top-level 추가
  rows?: string;    // ✅ top-level 추가
  gap?: SpaceToken;
}

// 사용
<Frame grid columns="1fr 2fr" gap={4}> // ✅ 간결
  {children}
</Frame>
```

**점수 개선**: 6/10 → 9/10

---

### 3. **`opacity` 우선순위 낮음** (6/10)

**문제**: 자주 사용되지 않는데 top-level에 있음

```tsx
// 사용 빈도 낮음
<Frame opacity={Opacity.n50}>
  {children}
</Frame>

// override로 충분
<Frame override={{ opacity: Opacity.n50 }}> // ✅ 충분
  {children}
</Frame>
```

**개선 방안**: `opacity`를 top-level에서 제거

```tsx
// Before
interface FramePresetProps {
  opacity?: OpacityToken; // ❌ 제거 고려
}

// After
interface FramePresetProps {
  // opacity 제거
}

interface FrameOverrides {
  opacity?: OpacityToken; // ✅ override 전용
}
```

**점수 개선**: 6/10 → (제거됨)

---

## 🏆 최종 우선순위 순위

### 🥇 Tier S (10/10) - 절대 필수
```tsx
layout, gap, w, h, flex, surface, rounded, scroll
```
- 거의 모든 컴포넌트에 사용
- 제거 불가능
- MDK 핵심 개념

### 🥈 Tier A (8-9/10) - 매우 유용
```tsx
fill, pack, maxWidth, interactive, selected, clip
```
- 자주 사용
- 간결성 제공
- 대체 가능하지만 번거로움

### 🥉 Tier B (7/10) - 유용
```tsx
row, wrap, ratio
```
- 특정 상황에서 유용
- 대체 가능
- 중복 우려 있음

### 📉 Tier C (6/10) - 개선 필요
```tsx
grid, opacity
```
- `grid`: 불완전 (columns/rows 필요)
- `opacity`: 빈도 낮음 (override로 충분)

---

## 🔧 구체적 개선 제안

### 1. Grid 완성도 높이기

**Before**:
```tsx
interface FramePresetProps {
  grid?: boolean;
  gap?: SpaceToken;
}
```

**After**:
```tsx
interface FramePresetProps {
  grid?: boolean;
  columns?: string; // ✅ 추가
  rows?: string;    // ✅ 추가
  gap?: SpaceToken;
}
```

**Usage**:
```tsx
// Before (불편)
<Frame grid override={{ columns: "1fr 2fr" }}>

// After (간결)
<Frame grid columns="1fr 2fr">
```

**예상 점수**: 6/10 → 9/10

---

### 2. Row/Layout 우선순위 명시

**frameToSettings.ts 수정**:
```tsx
export function frameToSettings(props: FrameProps): ComputedFrameSettings {
  // Priority 1: row prop (quick shortcut)
  if (props.row) {
    return {
      display: "flex",
      flexDirection: "row",
      gap: props.gap ? `var(--space-${props.gap})` : undefined,
    };
  }

  // Priority 2: layout preset (semantic)
  if (props.layout) {
    const layoutSettings = resolveLayout(props.layout);
    return layoutSettings;
  }

  // Priority 3: default (stack/column)
  return {
    display: "flex",
    flexDirection: "column",
  };
}
```

**예상 점수**: 7/10 → 9/10

---

### 3. Opacity 제거

**Before**:
```tsx
interface FramePresetProps {
  opacity?: OpacityToken; // ❌
}
```

**After**:
```tsx
// Top-level에서 제거
// override 전용으로만 사용
interface FrameOverrides {
  opacity?: OpacityToken; // ✅
}
```

**Migration**:
```tsx
// Before
<Frame opacity={Opacity.n50}>

// After
<Frame override={{ opacity: Opacity.n50 }}>
```

---

## 📊 개선 후 예상 점수

| 카테고리 | 현재 점수 | 개선 후 점수 | 변화 |
|---------|---------|------------|------|
| **Layout** | 8.3/10 | **9.0/10** | +0.7 (grid 완성) |
| **Sizing** | 9.4/10 | **9.4/10** | 변화 없음 |
| **Appearance** | 9.25/10 | **9.25/10** | 변화 없음 |
| **Decoration** | 8.0/10 | **9.0/10** | +1.0 (opacity 제거) |

**종합 평가**: **8.7/10** → **9.3/10** 🟢 (+0.6)

---

## 🎯 실행 계획

### Phase 1: Grid 완성 (Quick Win)
1. ✅ `columns`, `rows` prop을 `FramePresetProps`에 추가
2. ✅ `frameToSettings.ts`에서 grid 처리 로직 업데이트
3. ✅ 기존 `override={{ columns: "..." }}` 사용처를 `columns="..."로 마이그레이션

**예상 시간**: 30분
**예상 효과**: Grid 점수 6/10 → 9/10

### Phase 2: Row/Layout 우선순위 문서화 (Documentation)
1. ✅ `frameToSettings.ts`에 우선순위 주석 추가
2. ✅ CLAUDE.md에 우선순위 규칙 명시
3. ✅ 예제 코드 추가

**예상 시간**: 20분
**예상 효과**: Row 점수 7/10 → 9/10 (명확성 향상)

### Phase 3: Opacity 제거 (Breaking Change)
1. ⚠️ `FramePresetProps`에서 `opacity` 제거
2. ⚠️ 사용처 검색 및 마이그레이션
3. ⚠️ 문서 업데이트

**예상 시간**: 1시간
**예상 효과**: Decoration 카테고리 8.0/10 → 9.0/10
**Breaking Change**: Yes (마이그레이션 필요)

---

## 📖 참고 자료

- `src/design-system/Frame/FrameProps.ts` - Props 정의
- `src/design-system/Frame/frameToSettings.ts` - Props → CSS 변환
- `src/design-system/Frame/Layout/Layout.ts` - Layout 프리셋
- `docs/claude/0-best/15-three-tier-as-core-concept.md` - 3-Tier 시스템
- `CLAUDE.md` - Frame API 문서

---

## ✍️ 결론

Frame의 top-level props는 **8.7/10**으로 잘 설계되어 있습니다. 특히 **Layout, Sizing, Appearance** 카테고리는 거의 완벽하며, MDK의 의도 기반 설계 철학을 잘 반영합니다.

**핵심 개선 포인트**:
1. **Grid 완성** (columns/rows top-level 승격) → **+0.3점**
2. **Row/Layout 우선순위 명시** → **+0.2점**
3. **Opacity 제거** → **+0.1점**

이 3가지 개선을 적용하면 **9.3/10**까지 도달 가능합니다.

---

**작성자**: Claude Code
**마지막 업데이트**: 2026-01-17
**분석 대상**: `FrameProps.ts` (19 props)
