# [token-system] Props-to-CSS 변환 시스템의 과도기적 중복 분석 보고서

**작성일**: 2026-01-15
**버전**: 1.0
**태그**: `#token-system` `#refactoring` `#technical-debt` `#code-smell`

---

## 📑 목차

1. [개요](#개요)
2. [발견된 중복 문제](#발견된-중복-문제)
3. [중복의 근본 원인](#중복의-근본-원인)
4. [영향 분석](#영향-분석)
5. [해결 방안](#해결-방안)
6. [우선순위 및 로드맵](#우선순위-및-로드맵)
7. [부록](#부록)

---

## 개요

### 배경

MDK(Minimal Design Kit)는 props를 CSS로 변환하는 토큰 시스템의 **과도기**를 겪고 있습니다. 기존의 **문자열 기반 toToken 시스템**에서 **Branded Type 기반 px/rem 시스템**으로 전환 중이며, 이 과정에서 다음과 같은 불필요한 중복이 발생했습니다:

1. **두 개의 utils 파일**: 기존 `lib/utils.ts`와 새로운 `token/lib/utils.ts`
2. **frameToSettings 내부의 중복 resolver**: `resolveSpace`, `resolveRadius`, `resolveOpacity`, `resolveSizing`
3. **컴포넌트별 중복 함수**: Section, Field의 동일한 `resolveSizingProp/Style`
4. **toToken vs px 이중 시스템**: CSS 변수 방식과 직접 값 방식의 혼재
5. **TS/CSS 토큰 정의 중복**: `token.const.1tier.ts`와 `tokens.1tier.css`
6. **변환 로직의 불일치**: 컴포넌트마다 다른 변환 패턴

### 조사 범위

- **파일 범위**: `src/design-system/` 하위 모든 TS/TSX 파일
- **중점 분석 대상**:
  - `lib/utils.ts`
  - `token/lib/utils.ts`
  - `Frame/frameToSettings.ts`
  - `Section.tsx`, `Field.tsx`, `Action.tsx`, `Icon.tsx`, `Overlay.tsx`, `Text.tsx`
- **분석 기간**: 2026-01-15 (단일 세션)

---

## 발견된 중복 문제

### 1. ⚠️ 두 개의 Utils 파일 (이중 시스템)

**위치**:
- `src/design-system/lib/utils.ts` (91줄)
- `src/design-system/token/lib/utils.ts` (248줄)

**증상**:
두 파일이 서로 다른 목적으로 존재하지만, 기능이 일부 중복되고 혼란을 야기합니다.

**비교표**:

| 측면 | `lib/utils.ts` | `token/lib/utils.ts` |
|------|----------------|---------------------|
| **주요 함수** | `toToken()` 단일 함수 | `px()`, `rem()`, `opacity()`, `lineHeight()` 등 다수 |
| **변환 방식** | `var(--prefix-value)` (CSS 변수) | `${value}px` (직접 값) |
| **입력 타입** | `string \| number \| boolean \| undefined` | Branded Type (`SpaceToken`, `FontSizeToken` 등) |
| **출력 형식** | CSS 변수 문자열 | 단위 포함 문자열 또는 숫자 |
| **사용처** | Icon, Overlay, Text | frameToSettings, Action, 2-tier tokens |
| **설계 철학** | 동적 토큰 (런타임 변경 가능) | 정적 값 (컴파일 타임 고정) |

**코드 예시**:

```typescript
// lib/utils.ts
toToken(8, "space")           // → "var(--space-n8)"
toToken("md", "radius")       // → "var(--radius-md)"
toToken(true, "shadow")       // → "var(--shadow-md)"

// token/lib/utils.ts
px(Space.n8)                  // → "8px"
rem(FontSize.n16)             // → "1rem"
opacity(Opacity.n50)          // → 0.5
```

**문제점**:
- ❌ **의도 불명확**: 언제 `toToken`을 쓰고, 언제 `px`를 써야 하는가?
- ❌ **일관성 없음**: 같은 `Space.n8` 값이 어떤 곳에선 `var(--space-n8)`, 어떤 곳에선 `8px`로 변환
- ❌ **학습 비용**: 신규 개발자가 두 시스템의 차이를 이해해야 함
- ❌ **테마 변경 불가능**: `px()` 방식은 CSS 변수가 아니라 런타임 테마 변경 불가

**영향 범위**:
- `toToken` 사용: Icon.tsx:26, Overlay.tsx:79,84,85,86,87, Text.tsx:90,96
- `px` 사용: frameToSettings.ts:23,34,58,78-83, Action.tsx(간접적), token.const.2tier.ts:78-81

---

### 2. 🔄 frameToSettings 내부의 중복 Resolver 함수들

**위치**: `src/design-system/Frame/frameToSettings.ts:19-99`

**증상**:
`resolveSpace`, `resolveRadius`, `resolveOpacity`, `resolveSizing` 함수가 거의 동일한 패턴을 가지고 있습니다.

**코드 중복 분석**:

```typescript
// resolveSpace (19-27줄) - 9줄
const resolveSpace = (val: string | number | undefined) => {
  if (val === undefined) return undefined;
  // Branded Type: numeric token
  if (typeof val === "number") {
    return px(val as any); // px() 호출
  }
  // Allow explicit string overrides
  return val;
};

// resolveRadius (30-38줄) - 9줄
const resolveRadius = (val: string | number | undefined) => {
  if (val === undefined) return undefined;
  // Branded Type: numeric token
  if (typeof val === "number") {
    return px(val as any); // px() 호출
  }
  // Allow explicit string overrides
  return val;
};

// resolveOpacity (41-50줄) - 10줄
const resolveOpacity = (val: string | number | undefined) => {
  if (val === undefined) return undefined;
  // Branded Type: numeric token
  // Opacity tokens are 0-100 scale, convert to 0-1 for CSS
  if (typeof val === "number") {
    return val / 100; // 직접 계산 (opacity() 함수와 중복)
  }
  // Allow explicit string overrides
  return val;
};

// resolveSizing (53-99줄) - 47줄 (더 복잡)
const resolveSizing = (
  val: string | number | undefined,
  axis: "width" | "height",
) => {
  if (val === undefined) return undefined;

  // Branded Type: numeric token
  if (typeof val === "number") {
    return px(val as any); // px() 호출
  }

  // String handling: Size keywords and explicit overrides
  if (typeof val === "string") {
    // Size.screen needs axis-specific handling
    if (val === "100vh") {
      return axis === "width" ? "100vw" : "100vh";
    }

    // Pass through Size keyword values
    if ([
      "100%", "100vw", "min-content", "max-content",
      "fit-content", "auto",
    ].includes(val)) {
      return val;
    }

    // Allow explicit CSS unit values
    if (/^-?\d*\.?\d+(px|rem|em|%|vw|vh)$/.test(val)) {
      return val;
    }

    // Allow other percentage values
    if (["50%", "33%", "66%", "25%", "75%"].includes(val)) {
      return val;
    }
  }

  return undefined;
};
```

**공통 패턴 추출**:

```typescript
// 모든 resolver가 따르는 패턴:
function resolve*(val) {
  if (val === undefined) return undefined;     // 1. undefined 체크
  if (typeof val === "number") {                // 2. number → 변환
    return 변환함수(val);
  }
  if (typeof val === "string") {                // 3. string → 검증 후 반환
    // 특수 케이스 처리
  }
  return val;                                   // 4. 기본 반환
}
```

**문제점**:
- ❌ **코드 중복**: 같은 패턴이 4번 반복 (총 ~75줄)
- ❌ **유지보수 어려움**: 로직 변경 시 4군데 수정 필요
- ❌ **함수 중복**: `px()` 함수를 이미 import했는데 또 호출, `opacity()` 함수 대신 `/100` 직접 계산
- ❌ **테스트 어려움**: 각 함수를 개별 테스트해야 함

**통합 가능성**:
```typescript
// 제안: 제네릭 resolver
function resolveToken<T>(
  val: T | string | number | undefined,
  converter: (val: number) => any,
  stringValidator?: (val: string) => boolean
): any {
  if (val === undefined) return undefined;
  if (typeof val === "number") return converter(val);
  if (typeof val === "string" && stringValidator?.(val)) return val;
  return val;
}

// 사용 예시
const resolveSpace = (val) => resolveToken(val, px);
const resolveRadius = (val) => resolveToken(val, px);
const resolveOpacity = (val) => resolveToken(val, opacity);
```

---

### 3. 📋 컴포넌트별 중복 함수 (Copy-Paste)

**위치**:
- `src/design-system/Section.tsx:45-63` (19줄)
- `src/design-system/Field.tsx:30-48` (19줄)

**증상**:
`resolveSizingProp`과 `resolveSizingStyle` 함수가 **완전히 동일**하게 두 컴포넌트에 중복됩니다.

**코드 비교**:

```typescript
// Section.tsx (45-63줄)
const resolveSizingProp = (val: string | number | undefined) => {
  if (
    typeof val === "string" &&
    (val.startsWith("size.") || val.startsWith("container."))
  ) {
    return val as any;
  }
  return undefined;
};

const resolveSizingStyle = (val: string | number | undefined) => {
  if (
    typeof val === "string" &&
    (val.startsWith("size.") || val.startsWith("container."))
  ) {
    return undefined;
  }
  if (typeof val === "number") return `${val}px`;
  return val;
};

// Field.tsx (30-48줄)
const resolveSizingProp = (val: string | number | undefined) => {
  if (
    typeof val === "string" &&
    (val.startsWith("size.") || val.startsWith("container."))
  ) {
    return val as any;
  }
  return undefined;
};

const resolveSizingStyle = (val: string | number | undefined) => {
  if (
    typeof val === "string" &&
    (val.startsWith("size.") || val.startsWith("container."))
  ) {
    return undefined;
  }
  if (typeof val === "number") return `${val}px`;
  return val;
};
```

**차이점**: **없음** (100% 동일)

**문제점**:
- ❌ **DRY 원칙 위반**: 같은 코드가 두 곳에 존재
- ❌ **Copy-Paste 냄새**: 명백한 코드 스멜
- ❌ **변경 시 동기화 필요**: 한 곳을 수정하면 다른 곳도 수정해야 함
- ❌ **버그 위험**: 한 곳만 고치고 다른 곳은 놓칠 수 있음
- ❌ **확장성 없음**: 새로운 컴포넌트가 추가될 때마다 복사될 가능성

**사용 패턴**:
```typescript
// Section.tsx (65-84줄)
<Frame
  style={{
    width: resolveSizingStyle(w),
    height: resolveSizingStyle(h),
    // ...
  }}
  override={{
    w: resolveSizingProp(w),
    h: resolveSizingProp(h),
    // ...
  }}
/>

// Field.tsx (53-64줄)
<Frame
  style={{
    width: resolveSizingStyle(effW),
    // ...
  }}
  override={{
    w: resolveSizingProp(effW),
    // ...
  }}
/>
```

**왜 이렇게 분리했을까?**:
- `resolveSizingProp`: Frame의 `override` prop에 전달 (토큰 형태 유지)
- `resolveSizingStyle`: inline `style`에 전달 (CSS 값으로 변환)

**개선안**:
```typescript
// shared/utils/tokenResolvers.ts (새 파일)
export function resolveSizingProp(val: string | number | undefined) {
  // ...
}

export function resolveSizingStyle(val: string | number | undefined) {
  // ...
}

// Section.tsx & Field.tsx
import { resolveSizingProp, resolveSizingStyle } from '@/shared/utils/tokenResolvers';
```

---

### 4. 🔀 toToken vs px 이중 시스템 (일관성 부재)

**증상**:
같은 토큰 값(`Space.n8`)이 컴포넌트에 따라 **다른 방식**으로 변환됩니다.

**변환 방식 비교**:

| 컴포넌트 | 토큰 | 변환 함수 | 결과 | 파일:줄 |
|---------|------|----------|------|---------|
| Icon | `IconSize.n16` | `toToken(size, "icon-size")` | `var(--icon-size-n16)` | Icon.tsx:26 |
| Overlay | `Space.n8` | `toToken(x, "space")` | `var(--space-n8)` | Overlay.tsx:84 |
| Text | `FontSize.n14` | `toToken(size, "font-size")` | `var(--font-size-n14)` | Text.tsx:96 |
| Frame | `Space.n8` | `px(Space.n8)` | `"8px"` | frameToSettings.ts:23 |
| Action | `Size.n40` | `px(sizeConfig.height)` | `"40px"` | Action.tsx:100 (간접) |
| Section | `Space.n8` | 직접 사용 | `Space.n8` (그대로) | Section.tsx:78 |

**코드 예시**:

```typescript
// Icon.tsx - CSS 변수 방식
const resolvedSize = toToken(sizeValue, "icon-size");
// size=16 → "var(--icon-size-n16)"
<IconComponent style={{ width: resolvedSize, height: resolvedSize }} />

// Frame - 직접 값 방식
const resolvedSpace = px(props.p);
// p=8 → "8px"
<div style={{ padding: resolvedSpace }} />

// Section - 토큰 그대로
<Frame override={{ p: Space.n8 }} />
// Space.n8이 Frame 내부에서 다시 변환됨
```

**의도 추측**:

| 방식 | 장점 | 단점 | 의도된 사용처 |
|------|------|------|--------------|
| **CSS 변수** (`toToken`) | 테마 변경 가능, 동적 조정 가능 | 복잡함, 디버깅 어려움 | Icon, Text 등 유연성 필요한 곳 |
| **직접 값** (`px`) | 단순함, 빠름, 디버깅 쉬움 | 테마 변경 불가, 고정값 | Frame, Action 등 확정된 값 |
| **토큰 그대로** | Frame이 알아서 처리 | Frame 의존성 | Frame을 사용하는 곳 |

**문제점**:
- ❌ **일관성 없음**: 같은 상황에서 다른 방식 사용
- ❌ **선택 기준 불명확**: 언제 어떤 방식을 써야 하는지 가이드라인 없음
- ❌ **테마 변경 제약**: `px()` 방식은 CSS 변수를 쓰지 않아 런타임 테마 변경 불가
- ❌ **성능 차이**: CSS 변수는 약간의 오버헤드, 직접 값은 더 빠름 (미미하지만)
- ❌ **디버깅 어려움**: 개발자 도구에서 `var(--space-8)` vs `8px` 혼재

**실제 사용 예시**:
```typescript
// Overlay.tsx (84-87줄)
const style: React.CSSProperties = {
  position,
  zIndex: resolvedZIndex,         // toToken 사용
  top: toToken(y, "space"),        // toToken 사용
  left: toToken(x, "space"),       // toToken 사용
  right: toToken(right, "space"),  // toToken 사용
  bottom: toToken(bottom, "space"), // toToken 사용
  ...customStyle,
};

// Action.tsx (100+줄, 간접적)
<Frame
  style={{
    height: px(sizeConfig.height), // px 사용 (via resolveActionSize)
    padding: px(sizeConfig.padding),
  }}
/>
```

**통일 방안 제안**:
1. **기본 원칙**: 모든 토큰은 CSS 변수로 변환 (`toToken` 사용)
2. **예외 케이스**: 명시적으로 고정값이 필요한 경우만 `px` 사용
3. **가이드라인 문서화**: "언제 toToken을 쓰고, 언제 px를 쓰는가" 명확히 정의

---

### 5. 📊 TS/CSS 토큰 정의 중복

**위치**:
- TypeScript: `src/design-system/token/token.const.1tier.ts`
- CSS: `src/style/tokens.1tier.css`

**증상**:
같은 토큰 값이 TS와 CSS 두 곳에 정의되어 있습니다.

**비교**:

```typescript
// token.const.1tier.ts (63-80줄)
export const Space = {
  n0: 0 as SpaceToken,
  n2: 2 as SpaceToken,
  n4: 4 as SpaceToken,
  n6: 6 as SpaceToken,
  n8: 8 as SpaceToken,
  n10: 10 as SpaceToken,
  n12: 12 as SpaceToken,
  // ...
};
```

```css
/* tokens.1tier.css (7-38줄) */
:root {
  --space-n0: 0px;
  --space-n2: 2px;
  --space-n4: 4px;
  --space-n6: 6px;
  --space-n8: 8px;
  --space-n10: 10px;
  --space-n12: 12px;
  /* ... */
}
```

**중복 통계**:

| 토큰 그룹 | TS 정의 | CSS 정의 | 중복 개수 |
|----------|---------|----------|----------|
| Space | ✅ | ✅ | ~30개 |
| IconSize | ✅ | ✅ | ~20개 |
| Size | ✅ | ✅ | ~40개 |
| Container | ✅ | ✅ | ~12개 |
| Radius | ✅ | ✅ | ~15개 |
| FontSize | ✅ | ✅ | ~10개 |
| Opacity | ✅ | ✅ | ~10개 |
| **총계** | **~137개** | **~137개** | **274개 정의** |

**왜 이렇게 했을까?**:
- **TS 토큰**: 타입 안전성 제공 + Branded Type으로 AI가 직접 숫자 못 쓰게 강제
- **CSS 토큰**: 실제 CSS에서 `var(--space-n8)` 형태로 사용

**자동 생성 확인**:
```css
/* tokens.1tier.css */
/**
 * Generated by scripts/generate-tokens.js
 * Do not edit directly.
 */
```

**결론**: CSS 파일은 **자동 생성**되므로, 실제로는 TS → CSS 단방향 생성입니다.

**문제점**:
- ✅ **자동 생성이라 실제 문제 아님**: 스크립트가 있으므로 수동 동기화 불필요
- ⚠️ **스크립트 의존성**: `generate-tokens.js` 스크립트가 없으면 동기화 깨짐
- ⚠️ **빌드 프로세스 복잡도**: 토큰 변경 시 스크립트 실행 필요
- ⚠️ **문서화 부족**: 스크립트 사용법이 명확히 문서화되어 있는지 불명

**확인 필요**:
- [ ] `scripts/generate-tokens.js` 파일 존재 여부
- [ ] 스크립트 실행 방법 (npm script에 등록되어 있는지?)
- [ ] CI/CD 파이프라인에 자동 실행 설정 여부

---

### 6. 🔧 변환 로직의 불일치 (패턴 파편화)

**증상**:
컴포넌트마다 props → CSS 변환 방식이 다릅니다.

**패턴 비교**:

| 컴포넌트 | 변환 방식 | 특징 | 파일:줄 |
|---------|----------|------|---------|
| **Frame** | `frameToSettings()` | className + inline style 혼합 | frameToSettings.ts:5-333 |
| **Action** | 직접 inline style | `px()` 함수 직접 호출 | Action.tsx:100+ |
| **Section** | `resolveSizingProp/Style` | Frame의 `override`와 `style`에 분리 전달 | Section.tsx:65-84 |
| **Field** | `resolveSizingProp/Style` | Section과 동일한 패턴 | Field.tsx:53-64 |
| **Icon** | `toToken()` | CSS 변수로 변환 후 style에 전달 | Icon.tsx:26 |
| **Overlay** | `toToken()` | CSS 변수로 변환 후 style에 전달 | Overlay.tsx:84-87 |
| **Text** | `toToken()` | CSS 변수로 변환 후 style에 전달 | Text.tsx:96 |

**코드 예시**:

```typescript
// Frame - frameToSettings() 사용
export function Frame(props: FrameProps) {
  const { className, style } = frameToSettings(props);
  return <Component className={className} style={style} />;
}

// Action - 직접 style 구성
export function Action({ size = "sm", ... }) {
  const sizeConfig = ActionSize[size];
  return (
    <Frame
      style={{
        height: px(sizeConfig.height),
        padding: px(sizeConfig.padding),
        fontSize: px(sizeConfig.fontSize),
      }}
    />
  );
}

// Section - resolveSizing + Frame 사용
export function Section({ w, h, ... }) {
  return (
    <Frame
      style={{
        width: resolveSizingStyle(w),
        height: resolveSizingStyle(h),
      }}
      override={{
        w: resolveSizingProp(w),
        h: resolveSizingProp(h),
      }}
    />
  );
}

// Icon - toToken 사용
export function Icon({ size = IconSize.n16, ... }) {
  const resolvedSize = toToken(size, "icon-size");
  return (
    <IconComponent
      style={{
        width: resolvedSize,
        height: resolvedSize,
      }}
    />
  );
}
```

**Frame의 특수성**:
Frame은 가장 복잡한 변환 로직을 가지고 있습니다:
- **className 생성**: `flex`, `vbox`, `items-center` 등 유틸리티 클래스
- **inline style 생성**: padding, gap, width, height 등
- **CSS 변수 생성**: `--gap` 같은 동적 변수

```typescript
// frameToSettings 반환값
{
  className: "flex vbox items-center surface-base r-md",
  style: {
    padding: "8px",
    gap: "12px",
    width: "100%",
    "--gap": 12,
  }
}
```

**문제점**:
- ❌ **일관성 없음**: 같은 목적(props → CSS)인데 방법이 제각각
- ❌ **학습 비용**: 각 컴포넌트마다 다른 패턴 이해 필요
- ❌ **재사용 어려움**: Frame의 `frameToSettings`를 다른 곳에서 재사용하기 어려움
- ❌ **테스트 복잡**: 각 변환 방식을 개별적으로 테스트해야 함
- ❌ **확장성 부족**: 새로운 컴포넌트 추가 시 어떤 패턴을 따라야 할지 불명확

**왜 이렇게 되었나?**:
1. **Frame이 먼저**: Frame이 범용 레이아웃이라 복잡한 `frameToSettings()` 필요
2. **다른 컴포넌트는 간단**: Action, Icon 등은 단순해서 직접 style만 써도 충분
3. **점진적 진화**: 시간이 지나면서 각자 필요에 맞게 발전
4. **리팩토링 누락**: 패턴 통일 리팩토링이 이루어지지 않음

**이상적인 패턴** (제안):
```typescript
// 통일된 변환 유틸리티
import { resolveTokens } from '@/design-system/lib/tokenResolvers';

// 모든 컴포넌트에서 사용
export function AnyComponent({ p, gap, w, h, ... }) {
  const { className, style, vars } = resolveTokens({
    p, gap, w, h,
  });
  return <div className={className} style={{ ...style, ...vars }} />;
}
```

---

## 중복의 근본 원인

### 1. 🔄 과도기적 마이그레이션 (Legacy → Modern)

**상황**:
MDK는 **두 세대의 토큰 시스템**이 공존하는 과도기를 겪고 있습니다.

**타임라인 추정**:

```
[Phase 1] 초기 - 문자열 기반 시스템
   ├─ toToken() 함수 개발
   ├─ var(--prefix-value) 형태로 변환
   └─ Icon, Overlay, Text 등에서 사용

[Phase 2] 중기 - Branded Type 도입
   ├─ Branded Type 개념 도입 (AI 숫자 입력 방지)
   ├─ px(), rem(), opacity() 등 함수 개발
   ├─ Frame에 frameToSettings() 적용
   └─ Action에 2-tier token 적용

[Phase 3] 현재 - 이중 시스템 공존 ← 지금 여기
   ├─ toToken (legacy) vs px (modern) 혼재
   ├─ 일부 컴포넌트는 toToken 사용
   ├─ 일부 컴포넌트는 px 사용
   └─ 명확한 마이그레이션 계획 없음

[Phase 4] 미래 - 통일된 시스템 (목표)
   ├─ 하나의 변환 시스템으로 통일
   ├─ 모든 컴포넌트가 일관된 패턴 사용
   └─ 레거시 코드 제거
```

**증거**:
- `toToken` 함수는 여전히 Icon, Overlay, Text에서 사용 중
- `px` 함수는 Frame, Action에서 사용 중
- 두 시스템이 서로 다른 목적으로 설계됨 (CSS 변수 vs 직접 값)

**왜 완전히 전환하지 못했나?**:
1. **호환성 유지**: 기존 컴포넌트 깨뜨리지 않으려고
2. **점진적 마이그레이션**: 한 번에 모든 걸 바꾸기 어려움
3. **우선순위**: 새 기능 개발이 리팩토링보다 우선
4. **명확한 계획 부재**: "언제까지 무엇을 어떻게 바꿀지" 로드맵 없음

---

### 2. 📦 컴포넌트별 격리 개발 (Communication Gap)

**상황**:
각 컴포넌트가 독립적으로 개발되면서, 공통 패턴을 추출하지 않았습니다.

**증거**:
```
Section.tsx (개발자 A)
  └─ resolveSizingProp/Style 함수 작성
       ↓
  (시간 경과, 의사소통 없음)
       ↓
Field.tsx (개발자 B)
  └─ resolveSizingProp/Style 함수 복사-붙여넣기
```

**왜 공유하지 않았나?**:
1. **급한 개발**: "일단 작동하게 만들고, 나중에 리팩토링하자" → 나중은 오지 않음
2. **인지 부족**: Section에 이미 같은 함수가 있다는 걸 몰랐을 수도
3. **프로젝트 구조**: `shared/utils/` 같은 공통 유틸 폴더가 명확하지 않음
4. **코드 리뷰 누락**: PR 리뷰 시 중복 코드 발견 못 함

---

### 3. 🎯 Frame의 특수성 (Over-Engineering)

**상황**:
Frame은 "범용 레이아웃 컴포넌트"라서 복잡한 로직이 필요했고, 이게 다른 컴포넌트와 괴리를 만들었습니다.

**Frame의 복잡성**:
- Props 수: 40개 이상
- 변환 함수: 4개 (resolveSpace, resolveRadius, resolveOpacity, resolveSizing)
- 출력 형태: className + inline style + CSS vars
- 스마트 로직: shrink, scroll, sizing 자동 추론

**다른 컴포넌트의 단순성**:
- Action: size prop 하나로 height, padding, fontSize 자동 설정
- Icon: size prop만 변환
- Overlay: x, y, right, bottom만 변환

**괴리**:
- Frame은 "모든 경우를 다 처리하는 만능 함수"
- 다른 컴포넌트는 "필요한 것만 간단히 처리"
- 결과: Frame의 `frameToSettings`를 재사용할 수 없음 (너무 복잡)

**Over-Engineering 지표**:
- `frameToSettings` 함수: 333줄
- `isFixedDimension` 헬퍼: 사용처 1곳뿐
- Shadow 중복 코드: 262-268줄에 같은 코드 2번

```typescript
// frameToSettings.ts (262-268줄)
// --- Shadow ---
if (props.shadow) {
  classes.push(`shadow-${props.shadow}`);
}

// --- Shadow ---
if (props.shadow) {
  classes.push(`shadow-${props.shadow}`);
}
```

---

### 4. 🚫 명확한 컨벤션 부재

**문제**:
"props를 CSS로 변환하는 방법"에 대한 프로젝트 차원의 가이드라인이 없습니다.

**질문들**:
- ❓ 언제 `toToken`을 쓰고, 언제 `px`를 쓰는가?
- ❓ Frame을 사용하는 컴포넌트는 `override` prop를 써야 하는가?
- ❓ 새로운 토큰 추가 시 어떤 파일을 수정해야 하는가?
- ❓ `resolveSizing` 같은 함수는 어디에 위치해야 하는가?

**현재 상태**:
- conventions.md에는 토큰 사용법만 있고, 변환 로직에 대한 가이드 없음
- 각 개발자가 기존 코드를 보고 "비슷하게" 따라 함
- 결과: 일관성 없는 패턴 확산

---

## 영향 분석

### 1. 📈 코드 품질 메트릭

**중복 코드 통계**:

| 항목 | 라인 수 | 파일 수 | 중복률 |
|------|---------|---------|--------|
| **resolver 함수** (frameToSettings 내부) | ~75줄 | 1개 | 4배 중복 |
| **resolveSizing** (Section, Field) | ~38줄 | 2개 | 2배 중복 |
| **전체 토큰 시스템** | ~800줄 | 8개 | 이중 시스템 |

**복잡도 지표**:
- `frameToSettings` 함수: Cyclomatic Complexity 추정 ~25 (높음, 권장 <10)
- 중첩 깊이: 최대 4레벨 (if 안의 if 안의 if...)
- 함수 길이: 333줄 (권장 <50줄)

---

### 2. 🐛 버그 위험도

**시나리오 1: 중복 함수 수정 누락**
```
문제: Section의 resolveSizing에 버그 발견
수정: Section만 고침
결과: Field에는 여전히 버그 존재 ← 동기화 실패
```

**시나리오 2: toToken vs px 혼동**
```
개발자: "Space.n8을 사용하고 싶은데..."
선택 1: toToken(Space.n8, "space") → "var(--space-n8)"
선택 2: px(Space.n8) → "8px"
문제: 어떤 걸 써야 할지 모름 → 임의로 선택 → 일관성 깨짐
```

**시나리오 3: Frame props 변경 영향**
```
변경: Frame의 padding 로직 수정
영향: frameToSettings에 의존하는 모든 컴포넌트
위험: Section, Field는 자체 resolver를 쓰므로 영향 없음 → 불일치 발생
```

---

### 3. 👨‍💻 개발자 경험 (DX)

**신규 개발자**:
- ❌ "어떤 utils를 import해야 하나?" - lib/utils vs token/lib/utils
- ❌ "toToken vs px 차이가 뭐지?" - 문서 없음
- ❌ "왜 Section과 Field에 같은 코드가?" - 혼란
- ❌ "새 컴포넌트를 만들 때 어떤 패턴을 따라야?" - 불명확

**기존 개발자**:
- ⚠️ "이 함수를 수정하면 어디에 영향이?" - 파악 어려움
- ⚠️ "중복 코드가 있다는 건 알지만..." - 리팩토링 시간 없음
- ⚠️ "일관성이 없다는 건 알지만..." - 기존 코드 깨뜨리기 두려움

**학습 곡선**:
```
Day 1: toToken 사용법 배움
Day 3: px가 있다는 걸 발견
Day 5: frameToSettings의 존재 인지
Day 7: resolveSizing이 여러 곳에 있다는 걸 깨달음
Day 10: "언제 뭘 써야 하는지 아직도 모르겠어..."
```

---

### 4. 🔧 유지보수 비용

**변경 시나리오 분석**:

| 변경 내용 | 수정 파일 수 | 영향 범위 | 위험도 |
|----------|-------------|----------|--------|
| Space 토큰 추가 (예: n5 = 5px) | 2개 (TS + CSS 생성) | 전체 | 낮음 (자동 생성) |
| toToken 로직 변경 | 1개 + 테스트 | Icon, Overlay, Text | 중간 |
| px 로직 변경 | 1개 + 테스트 | Frame, Action | 중간 |
| resolveSizing 로직 변경 | 3개 (frameToSettings, Section, Field) | 높음 | **높음** (동기화 필요) |
| 새로운 변환 방식 도입 | 전체 리팩토링 | 전체 | **매우 높음** |

**기술 부채 추정**:
- 중복 코드 제거 및 통합: **2-3일**
- toToken vs px 통일: **3-5일**
- 컨벤션 문서화: **1일**
- 테스트 작성: **2일**
- **총 기술 부채**: **8-11일** (약 2주)

---

## 해결 방안

### Phase 1: 즉시 해결 (Quick Wins)

#### 1.1 중복 함수 추출 (1일)

**목표**: Section, Field의 `resolveSizing` 함수를 공통 유틸로 추출

**작업**:
```typescript
// 새 파일: src/design-system/lib/tokenResolvers.ts
export function resolveSizingProp(
  val: string | number | undefined
): string | undefined {
  if (
    typeof val === "string" &&
    (val.startsWith("size.") || val.startsWith("container."))
  ) {
    return val as any;
  }
  return undefined;
}

export function resolveSizingStyle(
  val: string | number | undefined
): string | undefined {
  if (
    typeof val === "string" &&
    (val.startsWith("size.") || val.startsWith("container."))
  ) {
    return undefined;
  }
  if (typeof val === "number") return `${val}px`;
  return val;
}
```

**수정 파일**:
- [ ] `src/design-system/lib/tokenResolvers.ts` (신규)
- [ ] `src/design-system/Section.tsx` (import로 변경)
- [ ] `src/design-system/Field.tsx` (import로 변경)

**영향**: 38줄 중복 제거, 향후 확장 용이

---

#### 1.2 frameToSettings resolver 통합 (2일)

**목표**: `resolveSpace`, `resolveRadius` 등을 제네릭 함수로 통합

**작업**:
```typescript
// frameToSettings.ts
type TokenConverter = (val: number) => string | number;

function resolveToken(
  val: string | number | undefined,
  converter: TokenConverter
): string | number | undefined {
  if (val === undefined) return undefined;
  if (typeof val === "number") return converter(val);
  return val; // string pass-through
}

// 사용
const resolvedSpace = resolveToken(props.p, px);
const resolvedRadius = resolveToken(props.r, px);
const resolvedOpacity = resolveToken(props.opacity, opacity);
```

**수정 파일**:
- [ ] `src/design-system/Frame/frameToSettings.ts` (리팩토링)

**영향**: ~50줄 중복 제거, 가독성 향상

---

#### 1.3 Shadow 중복 제거 (5분)

**목표**: frameToSettings의 shadow 코드 중복 제거

**작업**:
```typescript
// frameToSettings.ts (262-268줄)
// BEFORE
// --- Shadow ---
if (props.shadow) {
  classes.push(`shadow-${props.shadow}`);
}

// --- Shadow ---
if (props.shadow) {
  classes.push(`shadow-${props.shadow}`);
}

// AFTER
// --- Shadow ---
if (props.shadow) {
  classes.push(`shadow-${props.shadow}`);
}
```

**영향**: 명백한 복사-붙여넣기 실수 수정

---

### Phase 2: 중기 해결 (Architecture Improvements)

#### 2.1 toToken vs px 통일 전략 결정 (1일)

**옵션 A: CSS 변수 우선 (권장)**

**원칙**:
- 기본: 모든 토큰은 `toToken`으로 CSS 변수로 변환
- 예외: 성능 critical한 경우만 `px` 직접 사용

**장점**:
- ✅ 테마 변경 가능 (런타임 동적 조정)
- ✅ 일관성 확보
- ✅ 미래 확장성 (테마 시스템 개선 시 유리)

**단점**:
- ⚠️ 약간의 성능 오버헤드 (CSS 변수 lookup)
- ⚠️ 디버깅 시 computed style 확인 필요

**마이그레이션**:
```typescript
// BEFORE
const style = {
  padding: px(Space.n8), // "8px"
};

// AFTER
const style = {
  padding: toToken(Space.n8, "space"), // "var(--space-n8)"
};
```

---

**옵션 B: 하이브리드 (현재 유지)**

**원칙**:
- Frame, Action: `px` 사용 (고정값)
- Icon, Text, Overlay: `toToken` 사용 (유연값)

**장점**:
- ✅ 변경 최소화
- ✅ 성능 최적화 (Frame은 빠르게)

**단점**:
- ❌ 여전히 일관성 부족
- ❌ 개발자 혼란 지속

---

**결정 기준**:
- **테마 변경 필요성**: 높음 → Option A
- **성능 우선순위**: 높음 → Option B
- **팀 합의**: 논의 필요

**권장**: **Option A** (CSS 변수 우선)

---

#### 2.2 공통 변환 유틸리티 개발 (3일)

**목표**: 모든 컴포넌트가 사용할 수 있는 통합 변환 시스템

**설계**:
```typescript
// src/design-system/lib/styleResolver.ts
export interface ResolveOptions {
  // Layout
  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  gap?: SpaceToken;

  // Sizing
  w?: WidthToken;
  h?: HeightToken;

  // Visual
  r?: RadiusToken;
  opacity?: OpacityToken;

  // ... 기타
}

export interface ResolveResult {
  className: string;
  style: React.CSSProperties;
  vars: Record<string, any>;
}

export function resolveStyleTokens(options: ResolveOptions): ResolveResult {
  // frameToSettings와 유사하지만 더 범용적
  // ...
}
```

**사용 예시**:
```typescript
// Action.tsx
export function Action({ p, gap, w, h, ... }) {
  const { className, style, vars } = resolveStyleTokens({ p, gap, w, h });
  return <button className={className} style={{ ...style, ...vars }} />;
}

// Section.tsx
export function Section({ w, h, ... }) {
  const { className, style, vars } = resolveStyleTokens({ w, h });
  return <section className={className} style={{ ...style, ...vars }} />;
}
```

**영향**: 모든 컴포넌트가 일관된 패턴 사용

---

#### 2.3 컨벤션 문서화 (1일)

**목표**: 명확한 가이드라인 문서 작성

**문서 내용**:
```markdown
# Token to CSS 변환 가이드라인

## 원칙

1. **기본**: 모든 토큰은 `toToken`으로 CSS 변수로 변환
2. **예외**: 성능 critical한 경우만 `px` 직접 사용
3. **일관성**: 같은 목적은 같은 방법으로

## 언제 어떤 함수를 사용하는가?

| 상황 | 사용 함수 | 예시 |
|------|----------|------|
| Space 토큰 → CSS | `toToken(val, "space")` | `toToken(Space.n8, "space")` → `"var(--space-n8)"` |
| Size 토큰 → CSS | `toToken(val, "size")` | `toToken(Size.n40, "size")` → `"var(--size-n40)"` |
| IconSize → CSS | `toToken(val, "icon-size")` | `toToken(IconSize.n16, "icon-size")` → `"var(--icon-size-n16)"` |
| Opacity → CSS | `toToken(val, "opacity")` | `toToken(Opacity.n50, "opacity")` → `"var(--opacity-n50)"` |
| 성능 critical (예외) | `px(val)` | `px(Space.n8)` → `"8px"` |

## 새 컴포넌트 개발 시

1. `resolveStyleTokens` 사용 (권장)
2. 특수 케이스: 자체 resolver 작성 → `lib/tokenResolvers.ts`에 추가
3. 절대 컴포넌트 내부에 inline resolver 작성 금지

## 예제

... (코드 예제)
```

**위치**: `docs/conventions/token-to-css.md`

---

### Phase 3: 장기 해결 (System Redesign)

#### 3.1 Branded Type → CSS Variable 자동 변환 (1주)

**목표**: TS 타입 시스템을 활용한 자동 변환

**아이디어**:
```typescript
// 새로운 토큰 타입
type CSSToken<T extends Brand<number, string>> = {
  value: T;
  cssVar: string; // 자동 생성
  px: string;     // 자동 생성
};

export const Space = {
  n8: {
    value: 8 as SpaceToken,
    cssVar: "var(--space-n8)",
    px: "8px",
  },
  // ...
};

// 사용
<div style={{ padding: Space.n8.cssVar }} />  // CSS 변수
<div style={{ padding: Space.n8.px }} />      // 직접 값
```

**장점**:
- ✅ 명시적 선택 가능
- ✅ 타입 안전성 유지
- ✅ 자동 완성 지원

**단점**:
- ⚠️ 토큰 객체 크기 증가
- ⚠️ 기존 코드 전면 수정 필요

---

#### 3.2 코드 생성 시스템 개선 (1주)

**목표**: TS → CSS 자동 생성 시스템 개선

**현재**:
```
token.const.1tier.ts (수동 작성)
   ↓
scripts/generate-tokens.js
   ↓
tokens.1tier.css (자동 생성)
```

**개선**:
```
tokens.config.ts (Single Source of Truth)
   ↓
scripts/generate-tokens.js (개선)
   ↓
├─ token.const.1tier.ts (자동 생성)
└─ tokens.1tier.css (자동 생성)
```

**이점**:
- ✅ 진정한 Single Source of Truth
- ✅ TS/CSS 동기화 보장
- ✅ 토큰 추가/수정이 더 쉬움

**예시**:
```typescript
// tokens.config.ts
export const tokenConfig = {
  space: {
    scale: [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
    unit: "px",
  },
  size: {
    scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128],
    unit: "px",
  },
  // ...
};

// 자동 생성:
// token.const.1tier.ts: export const Space = { n0: 0, n2: 2, ... }
// tokens.1tier.css: --space-n0: 0px; --space-n2: 2px; ...
```

---

#### 3.3 Frame 간소화 (1주)

**목표**: frameToSettings 복잡도 감소

**전략**:
1. **책임 분리**: Layout 전용 props와 Visual 전용 props 분리
2. **계층 구조**: Frame → LayoutFrame + VisualFrame
3. **컴포지션**: 복잡한 로직은 훅으로 분리

**예시**:
```typescript
// BEFORE
<Frame p={2} gap={3} surface="base" rounded="md" scroll shrink />

// AFTER
<LayoutFrame p={2} gap={3} scroll shrink>
  <VisualFrame surface="base" rounded="md">
    {children}
  </VisualFrame>
</LayoutFrame>
```

**이점**:
- ✅ 각 컴포넌트가 단순해짐
- ✅ 테스트 용이
- ✅ 재사용성 향상

**단점**:
- ⚠️ 기존 API 호환성 깨짐 (Breaking Change)
- ⚠️ 마이그레이션 필요

---

## 우선순위 및 로드맵

### 우선순위 매트릭스

| 항목 | 영향 | 난이도 | 우선순위 | 기간 |
|------|------|--------|----------|------|
| Shadow 중복 제거 | 낮음 | 낮음 | P3 | 5분 |
| resolveSizing 추출 | 중간 | 낮음 | **P1** | 1일 |
| frameToSettings resolver 통합 | 중간 | 중간 | **P2** | 2일 |
| toToken vs px 전략 결정 | 높음 | 낮음 | **P1** | 1일 |
| 컨벤션 문서화 | 높음 | 낮음 | **P1** | 1일 |
| 공통 변환 유틸리티 개발 | 높음 | 높음 | P2 | 3일 |
| Branded Type 자동 변환 | 중간 | 높음 | P3 | 1주 |
| 코드 생성 시스템 개선 | 중간 | 높음 | P3 | 1주 |
| Frame 간소화 | 낮음 | 매우높음 | P4 | 1주 |

---

### 로드맵 (4주)

**Week 1: Quick Wins + 전략 수립**
- [ ] resolveSizing 추출 (1일)
- [ ] toToken vs px 전략 결정 (1일)
- [ ] 컨벤션 문서화 (1일)
- [ ] frameToSettings resolver 통합 (2일)

**Week 2: 공통 유틸리티 개발**
- [ ] resolveStyleTokens 설계 (1일)
- [ ] resolveStyleTokens 구현 (2일)
- [ ] 테스트 작성 (1일)
- [ ] Action, Section에 적용 (1일)

**Week 3: 마이그레이션**
- [ ] Icon, Overlay, Text를 toToken → 통합 시스템으로 마이그레이션
- [ ] 테스트 및 검증
- [ ] 문서 업데이트

**Week 4: 검증 및 정리**
- [ ] 전체 컴포넌트 테스트
- [ ] 성능 벤치마크
- [ ] 레거시 코드 제거
- [ ] 최종 문서화

---

## 부록

### A. 파일별 중복 현황

| 파일 | 중복 유형 | 라인 수 | 상세 |
|------|----------|---------|------|
| `frameToSettings.ts` | resolver 함수 중복 | ~75줄 | resolveSpace, resolveRadius, resolveOpacity, resolveSizing |
| `Section.tsx` | resolveSizing 중복 | ~19줄 | Field.tsx와 100% 동일 |
| `Field.tsx` | resolveSizing 중복 | ~19줄 | Section.tsx와 100% 동일 |
| `frameToSettings.ts` | Shadow 중복 | 7줄 | 262-268줄 2회 반복 |
| `lib/utils.ts` | 시스템 중복 | 91줄 | toToken 시스템 |
| `token/lib/utils.ts` | 시스템 중복 | 248줄 | px/rem/opacity 시스템 |

---

### B. 컴포넌트별 변환 방식 매트릭스

| 컴포넌트 | 파일 | toToken | px | 자체 resolver | frameToSettings |
|---------|------|---------|----|--------------|--------------------|
| Frame | Frame.tsx | ❌ | ✅ | ❌ | ✅ |
| Action | Action.tsx | ❌ | ✅ | ❌ | ❌ |
| Section | Section.tsx | ❌ | ❌ | ✅ | ❌ |
| Field | Field.tsx | ❌ | ❌ | ✅ | ❌ |
| Icon | Icon.tsx | ✅ | ❌ | ❌ | ❌ |
| Overlay | Overlay.tsx | ✅ | ❌ | ❌ | ❌ |
| Text | Text.tsx | ✅ | ❌ | ❌ | ❌ |

---

### C. 테스트 전략

**Unit Tests**:
```typescript
// tokenResolvers.test.ts
describe('resolveSizingProp', () => {
  it('should return token for size.n40', () => {
    expect(resolveSizingProp('size.n40')).toBe('size.n40');
  });

  it('should return undefined for number', () => {
    expect(resolveSizingProp(40)).toBeUndefined();
  });
});

// frameToSettings.test.ts
describe('resolveToken', () => {
  it('should convert number to px', () => {
    expect(resolveToken(8, px)).toBe('8px');
  });

  it('should pass string through', () => {
    expect(resolveToken('auto', px)).toBe('auto');
  });
});
```

**Integration Tests**:
```typescript
// Frame.test.tsx
describe('Frame', () => {
  it('should apply Space.n8 correctly', () => {
    const { container } = render(<Frame p={Space.n8} />);
    expect(container.firstChild).toHaveStyle({ padding: '8px' });
  });
});
```

---

### D. 마이그레이션 체크리스트

**Phase 1**:
- [ ] resolveSizing 함수를 `lib/tokenResolvers.ts`로 이동
- [ ] Section.tsx에서 import로 변경
- [ ] Field.tsx에서 import로 변경
- [ ] 기존 함수 제거
- [ ] 테스트 작성 및 실행

**Phase 2**:
- [ ] frameToSettings의 resolver 함수들을 제네릭 `resolveToken`으로 통합
- [ ] resolveSpace, resolveRadius, resolveOpacity 제거
- [ ] resolveSizing 간소화
- [ ] 테스트 업데이트

**Phase 3**:
- [ ] toToken vs px 전략 문서 작성
- [ ] 팀 리뷰 및 합의
- [ ] 컨벤션 문서 작성
- [ ] PR 템플릿에 체크리스트 추가

**Phase 4**:
- [ ] resolveStyleTokens 설계 문서
- [ ] Proof of Concept 구현
- [ ] Action에 시범 적용
- [ ] 피드백 수렴 및 개선

---

### E. 참고 자료

**관련 문서**:
- `docs/token-enum-enforcement-strategies.md` - Branded Type 전략
- `docs/typescript-token-system-proposal.md` - 토큰 시스템 제안
- `.agent/conventions.md` - 코딩 컨벤션

**관련 이슈**:
- (없음 - 이 보고서를 기반으로 이슈 생성 필요)

**관련 PR**:
- (없음 - 향후 리팩토링 PR 작성 시 참조)

---

## 결론

MDK의 토큰 시스템은 **과도기적 이중 시스템** 상태입니다. `toToken`(legacy)과 `px`(modern)가 공존하며, 컴포넌트마다 다른 변환 패턴을 사용하고 있습니다. 이로 인해 **코드 중복, 일관성 부재, 유지보수 어려움** 문제가 발생하고 있습니다.

**즉시 조치 필요**:
1. ✅ resolveSizing 중복 함수 추출 (1일)
2. ✅ toToken vs px 전략 결정 및 문서화 (1일)
3. ✅ 컨벤션 문서 작성 (1일)

**중기 목표**:
- 공통 변환 유틸리티(`resolveStyleTokens`) 개발
- frameToSettings 간소화
- 전체 컴포넌트 일관성 확보

**장기 비전**:
- 통합된 토큰 시스템
- 자동 코드 생성 시스템 개선
- 최소한의 보일러플레이트

이 보고서를 기반으로 **4주 리팩토링 계획**을 수립하고, 우선순위에 따라 점진적으로 개선할 것을 권장합니다.

---

**문서 끝**

*이 보고서는 2026-01-15에 작성되었으며, 코드베이스 변경에 따라 업데이트가 필요할 수 있습니다.*