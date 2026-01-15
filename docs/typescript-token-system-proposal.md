# TypeScript 기반 토큰 관리 시스템 제안

**작성일:** 2026-01-15
**목적:** CSS 기반 토큰의 한계를 극복하고, TypeScript 기반으로 완전히 전환하여 dead code 추적 및 AI lint 가능한 시스템 구축

---

## 1. 현재 시스템 분석

### 1.1 현재 아키텍처

**1차 토큰 (token.const.1tier.ts)**
```typescript
// 토큰 식별자 문자열 반환
export const Space = {
  n0: "space.n0",
  n8: "space.n8",
  n12: "space.n12",
  // ...
} as const satisfies Record<SpaceKey, `space.n${SpaceScale}`>;
```

**CSS 변수 (tokens.1tier.css)**
```css
/* 스크립트로 자동 생성 */
:root {
  --space-n0: 0px;
  --space-n8: 8px;
  --space-n12: 12px;
}
```

**2차 토큰 (token.const.2tier.ts)**
```typescript
// 1차 토큰 조합, 객체 형태
export const ActionSize = {
  md: {
    height: Size.n40,      // "size.n40"
    icon: IconSize.n20,    // "icon-size.n20"
    padding: Space.n8,     // "space.n8"
    fontSize: FontSize.n14,// "font-size.n14"
  },
} as const;
```

**Layout 프리셋 (Layout.ts)**
```typescript
// 토큰 식별자 반환
export const Layout = {
  Stack: {
    Content: {
      Default: "stack.content",
    }
  }
} as const;

// Runtime resolver - key-value 명시적 매핑
export function resolveLayout(layout: LayoutToken) {
  switch (layout) {
    case Layout.Stack.Content.Default:
      return { align: "start", gap: Space.n12 }; // ✅ key-value
  }
}
```

### 1.2 현재 시스템의 문제점

**CSS 기반의 한계:**
1. ❌ **Dead code 추적 불가** - CSS 변수는 사용 여부를 정적 분석할 수 없음
2. ❌ **AI lint 불가** - CSS는 구조화된 타입 정보가 없어 AI가 규칙 검증 어려움
3. ❌ **중복 정의** - TS 상수 + CSS 변수로 이중 관리
4. ❌ **Build step 필요** - `scripts/generate-tokens.js`로 CSS 자동 생성
5. ❌ **Runtime overhead** - 문자열 식별자 → CSS 변수 → 실제 값으로 2단계 resolve

**2차 토큰의 불일치:**
- `ActionSize`는 객체로 속성을 묶었지만, **CSS 속성명(key)과 매핑이 암묵적**
- `Layout`은 resolver 함수로 **명시적 key-value 매핑**을 제공
- 두 가지 패턴이 혼재되어 일관성 부족

---

## 2. 제안: TypeScript 기반 완전 전환

### 2.1 핵심 원칙

1. **Single Source of Truth**: TypeScript만이 진실의 원천
2. **Explicit Key-Value Mapping**: 2차 토큰은 CSS 속성명을 명시적으로 포함
3. **Type-Safe**: 모든 토큰은 타입 안전하게 참조
4. **AI Lintable**: 구조화된 타입 정보로 AI가 규칙 검증 가능
5. **Dead Code Trackable**: TypeScript 정적 분석으로 미사용 토큰 추적

### 2.2 새로운 토큰 포맷

#### 2.2.1 1차 토큰 - 실제 값 반환

**기존 (문자열 식별자):**
```typescript
export const Space = {
  n0: "space.n0",   // ❌ 문자열
  n8: "space.n8",
} as const;
```

**제안 (실제 값):**
```typescript
// Option A: 숫자 값 직접 반환
export const Space = {
  n0: 0,    // ✅ 숫자
  n8: 8,
  n12: 12,
} as const;

// Option B: 단위 포함 문자열
export const Space = {
  n0: "0px",    // ✅ CSS 값
  n8: "8px",
  n12: "12px",
} as const;

// Option C: 숫자 + 유틸리티 (추천)
export const Space = {
  n0: 0,
  n8: 8,
  n12: 12,
} as const;

// 픽셀 변환 유틸리티
export const px = (value: number) => `${value}px`;
export const rem = (value: number) => `${value / 16}rem`;
```

**Trade-off 분석:**

| 옵션 | 장점 | 단점 | 추천 |
|------|------|------|------|
| A (숫자) | • 계산 가능<br>• 타입 안전<br>• 단위 변환 유연 | • CSS에 직접 사용 불가<br>• 유틸리티 필요 | ⭐⭐⭐⭐⭐ |
| B (문자열) | • CSS에 직접 사용 가능 | • 계산 불가<br>• 타입 안전성 낮음 | ⭐⭐ |
| C (숫자+유틸) | • 계산 + 변환 모두 가능<br>• 타입 안전<br>• 유연성 최고 | • 약간의 보일러플레이트 | ⭐⭐⭐⭐⭐ |

**추천: Option C (숫자 + 유틸리티)**

#### 2.2.2 2차 토큰 - 명시적 Key-Value 매핑

**문제: 현재 2차 토큰은 CSS 속성명이 암묵적**

```typescript
// ❌ 현재: 속성명이 height, icon, padding인지 암묵적
export const ActionSize = {
  md: {
    height: Size.n40,    // CSS 속성명이 뭐지? height? h? size?
    icon: IconSize.n20,  // iconSize? icon-size?
    padding: Space.n8,   // padding? p? space?
    fontSize: FontSize.n14,
  }
};
```

**제안 1: CSS 속성명 명시 (Verbose)**

```typescript
export const ActionSize = {
  md: {
    height: Size.n40,           // ✅ CSS: height
    "--icon-size": IconSize.n20, // ✅ CSS custom property
    padding: Space.n8,          // ✅ CSS: padding
    fontSize: FontSize.n14,     // ✅ CSS: fontSize (camelCase)
  }
} as const;

// 사용
const styles = {
  ...ActionSize.md,  // spread로 직접 적용
};
```

**문제점:**
- `--icon-size` 같은 custom property는 camelCase 변환 불가
- CSS 속성명과 TS 속성명 혼재 (kebab-case vs camelCase)

**제안 2: Resolver 패턴 (Layout 방식)**

```typescript
// 토큰 정의
export const ActionSizeToken = {
  xs: "action-size.xs",
  sm: "action-size.sm",
  md: "action-size.md",
  lg: "action-size.lg",
  xl: "action-size.xl",
} as const;

export type ActionSizeToken = typeof ActionSizeToken[keyof typeof ActionSizeToken];

// Resolver 함수 - 명시적 key-value 매핑
export function resolveActionSize(size: ActionSizeToken): CSSProperties {
  switch (size) {
    case ActionSizeToken.xs:
      return {
        height: px(Size.n24),
        "--icon-size": px(IconSize.n14),
        padding: px(Space.n4),
        fontSize: px(FontSize.n12),
      };
    case ActionSizeToken.md:
      return {
        height: px(Size.n40),
        "--icon-size": px(IconSize.n20),
        padding: px(Space.n8),
        fontSize: px(FontSize.n14),
      };
    // ...
  }
}
```

**장점:**
- ✅ CSS 속성명 명시적
- ✅ 타입 안전
- ✅ Layout 패턴과 일관성
- ✅ Dead code 추적 가능 (resolver 함수 내부 참조 추적)
- ✅ AI lint 가능 (switch case 패턴 분석)

**단점:**
- ⚠️ 보일러플레이트 증가 (resolver 함수 필요)
- ⚠️ Runtime overhead (함수 호출)

**제안 3: Hybrid - 객체 + Typed Resolver (추천)**

```typescript
// 타입 정의
type CSSPropertiesStrict = {
  height?: string | number;
  padding?: string | number;
  fontSize?: string | number;
  [key: `--${string}`]: string | number; // Custom properties
};

// 2차 토큰 정의 - 명시적 CSS 속성명
export const ActionSize = {
  xs: {
    height: Size.n24,
    "--icon-size": IconSize.n14,
    padding: Space.n4,
    fontSize: FontSize.n12,
  },
  md: {
    height: Size.n40,
    "--icon-size": IconSize.n20,
    padding: Space.n8,
    fontSize: FontSize.n14,
  },
  // ...
} as const satisfies Record<string, CSSPropertiesStrict>;

// Resolver (optional, for px conversion)
export function resolveActionSize(
  size: keyof typeof ActionSize
): React.CSSProperties {
  const token = ActionSize[size];
  return Object.entries(token).reduce((acc, [key, value]) => {
    acc[key] = typeof value === "number" ? px(value) : value;
    return acc;
  }, {} as React.CSSProperties);
}
```

**장점:**
- ✅ CSS 속성명 명시적 (객체 key가 CSS property)
- ✅ 타입 안전 (`satisfies CSSPropertiesStrict`)
- ✅ Resolver는 선택적 (px 변환만 필요하면 사용)
- ✅ Dead code 추적 가능
- ✅ AI lint 가능
- ✅ 보일러플레이트 최소화

---

## 3. 구현 예시

### 3.1 1차 토큰 - 완전 TypeScript

**src/design-system/token/token.const.1tier.ts**

```typescript
/**
 * TMDK 1-Tier Primitive Tokens (TypeScript Native)
 * - 실제 값(숫자)을 직접 반환
 * - CSS 변수 생성은 선택적 (빌드 타임 또는 런타임)
 * - Dead code 추적 가능
 */

// ---------------------------------
// Helpers
// ---------------------------------
export const px = (value: number) => `${value}px`;
export const rem = (value: number) => `${value / 16}rem`;
export const percent = (value: number) => `${value}%`;

// ---------------------------------
// Space (spacing)
// ---------------------------------
export const SpaceScale = [
  0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48,
  56, 64, 72, 80, 88, 96, 112, 128, 144, 160,
] as const;

export type SpaceScale = (typeof SpaceScale)[number];
export type SpaceKey = `n${SpaceScale}`;

export const Space = {
  n0: 0,
  n2: 2,
  n4: 4,
  n6: 6,
  n8: 8,
  n10: 10,
  n12: 12,
  n14: 14,
  n16: 16,
  n18: 18,
  n20: 20,
  n22: 22,
  n24: 24,
  n26: 26,
  n28: 28,
  n30: 30,
  n32: 32,
  n36: 36,
  n40: 40,
  n44: 44,
  n48: 48,
  n56: 56,
  n64: 64,
  n72: 72,
  n80: 80,
  n88: 88,
  n96: 96,
  n112: 112,
  n128: 128,
  n144: 144,
  n160: 160,
} as const satisfies Record<SpaceKey, SpaceScale>;

export type SpaceToken = (typeof Space)[keyof typeof Space];

// ---------------------------------
// Size (container / layout)
// ---------------------------------
export const SizeScale = [
  0, 4, 8, 12, 16, 20, 24, 32, 36, 40, 44, 48, 56, 64, 72, 80, 88, 96, 112, 128,
  144, 160, 176, 192, 208, 224, 240, 256, 288, 320, 384, 448, 512, 576, 640,
  704, 768,
] as const;

export type SizeScale = (typeof SizeScale)[number];
export type SizeNumericKey = `n${SizeScale}`;

export const SizeKeywords = ["full", "screen", "min", "max", "fit", "auto"] as const;
export type SizeKeyword = (typeof SizeKeywords)[number];

export type SizeKey = SizeNumericKey | SizeKeyword;

export const Size = {
  n0: 0,
  n4: 4,
  n8: 8,
  n12: 12,
  n16: 16,
  n20: 20,
  n24: 24,
  n32: 32,
  n36: 36,
  n40: 40,
  n44: 44,
  n48: 48,
  n56: 56,
  n64: 64,
  n72: 72,
  n80: 80,
  n88: 88,
  n96: 96,
  n112: 112,
  n128: 128,
  n144: 144,
  n160: 160,
  n176: 176,
  n192: 192,
  n208: 208,
  n224: 224,
  n240: 240,
  n256: 256,
  n288: 288,
  n320: 320,
  n384: 384,
  n448: 448,
  n512: 512,
  n576: 576,
  n640: 640,
  n704: 704,
  n768: 768,

  // Keywords (문자열 값)
  full: "100%",
  screen: "100vh",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
  auto: "auto",
} as const;

export type SizeToken = (typeof Size)[keyof typeof Size];

// ---------------------------------
// FontSize
// ---------------------------------
export const FontSizeScale = [
  9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64,
  72, 80, 96, 112, 128,
] as const;

export type FontSizeScale = (typeof FontSizeScale)[number];
export type FontSizeKey = `n${FontSizeScale}`;

export const FontSize = {
  n9: 9,
  n10: 10,
  n11: 11,
  n12: 12,
  n13: 13,
  n14: 14,
  n15: 15,
  n16: 16,
  n18: 18,
  n20: 20,
  n22: 22,
  n24: 24,
  n26: 26,
  n28: 28,
  n32: 32,
  n36: 36,
  n40: 40,
  n48: 48,
  n56: 56,
  n64: 64,
  n72: 72,
  n80: 80,
  n96: 96,
  n112: 112,
  n128: 128,
} as const satisfies Record<FontSizeKey, FontSizeScale>;

export type FontSizeToken = (typeof FontSize)[keyof typeof FontSize];

// ... 나머지 토큰들도 동일 패턴
```

### 3.2 2차 토큰 - 명시적 Key-Value

**src/design-system/token/token.const.2tier.ts**

```typescript
/**
 * TMDK 2-Tier Semantic Tokens (TypeScript Native)
 * - 1차 토큰만 참조 (직접 값 입력 금지)
 * - CSS 속성명 명시적 매핑
 * - Dead code 추적 가능
 */

import type { CSSProperties } from "react";
import { FontSize, IconSize, Size, Space, px } from "./token.const.1tier";

// ---------------------------------
// Type Definitions
// ---------------------------------
type CSSPropertiesNumeric = {
  [K in keyof CSSProperties]?: CSSProperties[K] extends string | number | undefined
    ? number | string
    : CSSProperties[K];
} & {
  [key: `--${string}`]: string | number; // Custom CSS properties
};

// ---------------------------------
// Action Size
// ---------------------------------
export const ActionSizeScale = ["xs", "sm", "md", "lg", "xl"] as const;
export type ActionSizeScale = (typeof ActionSizeScale)[number];

export const ActionSize = {
  xs: {
    height: Size.n24,
    "--icon-size": IconSize.n14,
    padding: Space.n4,
    fontSize: FontSize.n12,
  },
  sm: {
    height: Size.n32,
    "--icon-size": IconSize.n16,
    padding: Space.n6,
    fontSize: FontSize.n13,
  },
  md: {
    height: Size.n40,
    "--icon-size": IconSize.n20,
    padding: Space.n8,
    fontSize: FontSize.n14,
  },
  lg: {
    height: Size.n48,
    "--icon-size": IconSize.n24,
    padding: Space.n12,
    fontSize: FontSize.n16,
  },
  xl: {
    height: Size.n56,
    "--icon-size": IconSize.n28,
    padding: Space.n16,
    fontSize: FontSize.n18,
  },
} as const satisfies Record<ActionSizeScale, CSSPropertiesNumeric>;

export type ActionSizeToken = keyof typeof ActionSize;

// Resolver - px 변환 (선택적)
export function resolveActionSize(size: ActionSizeToken): CSSProperties {
  const token = ActionSize[size];
  return Object.entries(token).reduce((acc, [key, value]) => {
    acc[key] = typeof value === "number" ? px(value) : value;
    return acc;
  }, {} as CSSProperties);
}

// ---------------------------------
// Input Size (Form Components)
// ---------------------------------
export const InputSizeScale = ["sm", "md", "lg"] as const;
export type InputSizeScale = (typeof InputSizeScale)[number];

export const InputSize = {
  sm: {
    height: Size.n32,
    paddingInline: Space.n8,
    fontSize: FontSize.n13,
    borderRadius: 6, // Radius.n6 (예시)
  },
  md: {
    height: Size.n40,
    paddingInline: Space.n12,
    fontSize: FontSize.n14,
    borderRadius: 8,
  },
  lg: {
    height: Size.n48,
    paddingInline: Space.n16,
    fontSize: FontSize.n16,
    borderRadius: 10,
  },
} as const satisfies Record<InputSizeScale, CSSPropertiesNumeric>;

export type InputSizeToken = keyof typeof InputSize;

// ---------------------------------
// Card Padding Presets
// ---------------------------------
export const CardPaddingScale = ["tight", "default", "loose"] as const;
export type CardPaddingScale = (typeof CardPaddingScale)[number];

export const CardPadding = {
  tight: {
    padding: Space.n12,
    gap: Space.n8,
  },
  default: {
    padding: Space.n16,
    gap: Space.n12,
  },
  loose: {
    padding: Space.n24,
    gap: Space.n16,
  },
} as const satisfies Record<CardPaddingScale, CSSPropertiesNumeric>;

export type CardPaddingToken = keyof typeof CardPadding;
```

### 3.3 Layout 프리셋 - 일관성 유지

**src/design-system/Frame/Layout/Layout.ts**

```typescript
/**
 * MDK Layout Presets (TypeScript Native)
 * - 2-Tier 토큰 패턴 적용
 * - 명시적 key-value 매핑
 */

import type { CSSProperties } from "react";
import { Size, Space, px } from "../../token/token.const.1tier";

// Layout 토큰 정의 (기존과 동일)
export const Layout = {
  Stack: {
    Content: {
      Default: "stack.content",
      Tight: "stack.content.tight",
      Loose: "stack.content.loose",
    },
    // ...
  },
  Row: {
    Item: {
      Default: "row.item",
      Tight: "row.item.tight",
    },
    // ...
  },
  // ...
} as const;

export type LayoutToken = DeepValue<typeof Layout>;

// Resolver 함수 - 명시적 key-value 매핑
export function resolveLayout(layout: LayoutToken): CSSProperties {
  switch (layout) {
    case Layout.Stack.Content.Default:
      return {
        alignItems: "start",
        gap: px(Space.n12),
      };
    case Layout.Stack.Content.Tight:
      return {
        alignItems: "start",
        gap: px(Space.n8),
      };
    case Layout.Row.Item.Default:
      return {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: px(Space.n12),
      };
    // ...
    default:
      return {};
  }
}
```

---

## 4. CSS 변수 전환 전략

TypeScript로 전환하되, CSS 변수의 장점(테마 전환)을 유지하려면?

### 4.1 Option A: CSS 변수 완전 제거

```typescript
// TS만 사용
const styles = {
  padding: px(Space.n8),  // "8px"
  gap: px(Space.n12),     // "12px"
};
```

**장점:**
- ✅ Dead code 추적 가능
- ✅ 빌드 스텝 불필요
- ✅ Runtime overhead 최소

**단점:**
- ❌ CSS 변수 기반 테마 전환 불가
- ❌ 동적 테마 변경 어려움

### 4.2 Option B: Hybrid - TS + CSS 변수 자동 생성 (추천)

```typescript
// 1. TS에서 토큰 정의 (진실의 원천)
export const Space = {
  n8: 8,
  n12: 12,
} as const;

// 2. 빌드 타임에 CSS 변수 자동 생성
// scripts/generate-css-vars.ts
const css = Object.entries(Space)
  .map(([key, value]) => `  --space-${key}: ${value}px;`)
  .join('\n');
// → :root { --space-n8: 8px; --space-n12: 12px; }

// 3. TS에서 CSS 변수 참조 (테마 전환 필요시)
const styles = {
  padding: "var(--space-n8)",  // CSS 변수 사용
  gap: px(Space.n12),          // 직접 값 사용
};
```

**장점:**
- ✅ TS가 Single Source of Truth
- ✅ CSS 변수로 테마 전환 가능
- ✅ Dead code 추적 가능 (TS 기준)
- ✅ 기존 CSS 변수 기반 코드 호환

**단점:**
- ⚠️ 빌드 스텝 필요
- ⚠️ TS 변경 → CSS 재생성 필요

### 4.3 Option C: Runtime CSS 변수 생성

```typescript
// TS에서 정의
export const Space = {
  n8: 8,
  n12: 12,
} as const;

// Runtime에 CSS 변수 주입
export function injectCSSVariables() {
  const root = document.documentElement;
  Object.entries(Space).forEach(([key, value]) => {
    root.style.setProperty(`--space-${key}`, `${value}px`);
  });
}

// App 초기화
injectCSSVariables();
```

**장점:**
- ✅ 빌드 스텝 불필요
- ✅ 동적 테마 변경 가능
- ✅ TS가 Single Source of Truth

**단점:**
- ⚠️ Runtime overhead
- ⚠️ SSR 시 초기 렌더링 깜빡임 가능

---

## 5. AI Lint 전략

### 5.1 현재 문제점

**CSS 기반은 AI가 lint 어려움:**
```css
/* AI는 이게 사용되는지, 규칙을 위반했는지 알 수 없음 */
:root {
  --space-n8: 8px;
  --unknown-token: 999px; /* 규칙 위반? */
}
```

### 5.2 TypeScript 기반 AI Lint

**1. 타입 체크로 규칙 강제**
```typescript
// ✅ Scale 외 값 사용 시 타입 에러
export const Space = {
  n8: 8,
  // n9: 9, // ❌ Error: 9는 SpaceScale에 없음
} as const satisfies Record<SpaceKey, SpaceScale>;
```

**2. Resolver 함수 패턴 검증**
```typescript
// AI가 분석 가능한 패턴
export function resolveActionSize(size: ActionSizeToken) {
  switch (size) {
    case "md":
      return {
        height: Size.n40,      // ✅ 1차 토큰만 참조
        padding: 8,            // ❌ AI가 감지: 직접 값 입력 금지!
      };
  }
}
```

**3. ESLint Custom Rule**
```typescript
// eslint-plugin-mdk/no-hardcoded-values.js
module.exports = {
  create(context) {
    return {
      ObjectExpression(node) {
        if (isInsideResolverFunction(node)) {
          node.properties.forEach(prop => {
            if (typeof prop.value.value === 'number') {
              context.report({
                node: prop,
                message: '2차 토큰은 1차 토큰만 참조해야 합니다',
              });
            }
          });
        }
      }
    };
  }
};
```

**4. AI가 검증할 수 있는 규칙**
- ✅ 2차 토큰이 1차 토큰만 참조하는지
- ✅ CSS 속성명이 명시적으로 매핑되었는지
- ✅ Scale에 정의된 값만 사용하는지
- ✅ Deprecated 토큰 사용 여부
- ✅ Dead code (미사용 토큰) 탐지

---

## 6. Migration Plan

### 6.1 Phase 1: 1차 토큰 전환 (Week 1-2)

1. `token.const.1tier.ts` 수정
   - 문자열 → 숫자 값 반환
   - `px()` 유틸리티 추가
   - 타입 안전성 유지

2. CSS 변수 생성 스크립트 업데이트
   - `scripts/generate-tokens.js` → `generate-css-vars.ts`
   - TS 토큰을 읽어서 CSS 생성

3. 기존 컴포넌트 호환성 테스트
   - `toToken()` 유틸리티 업데이트
   - 기존 `Space.n8` → `px(Space.n8)` 변환

### 6.2 Phase 2: 2차 토큰 전환 (Week 3-4)

1. `token.const.2tier.ts` 리팩토링
   - ActionSize, InputSize 등을 명시적 key-value로 변경
   - `satisfies CSSPropertiesNumeric` 타입 체크 추가

2. Layout.ts 일관성 확인
   - 기존 resolver 패턴 유지
   - 타입 안전성 강화

3. 컴포넌트 적용
   - Action, Field 등 주요 컴포넌트에서 새 토큰 사용
   - `resolveActionSize()` 적용

### 6.3 Phase 3: AI Lint 구축 (Week 5-6)

1. ESLint Custom Rule 작성
   - `no-hardcoded-values`: 직접 값 입력 금지
   - `no-invalid-token-reference`: 존재하지 않는 토큰 참조 금지

2. AI Lint 프롬프트 작성
   - Design lint와 통합
   - 2차 토큰 규칙 검증 프롬프트

3. CI/CD 통합
   - Pre-commit hook에 lint 추가
   - PR에서 자동 검증

### 6.4 Phase 4: Dead Code 제거 (Week 7-8)

1. 미사용 토큰 탐지
   - TypeScript unused exports 분석
   - ESLint `no-unused-vars` 활용

2. 토큰 사용량 리포트
   - 각 토큰이 몇 번 사용되는지 통계
   - 중복/유사 토큰 통합 제안

3. CSS 변수 최적화
   - 실제 사용되는 토큰만 CSS로 생성
   - 번들 사이즈 최적화

---

## 7. 최종 권장 사항

### 7.1 추천 아키텍처

```
┌─────────────────────────────────────┐
│  1차 토큰 (token.const.1tier.ts)    │
│  - 실제 값 (숫자) 반환               │
│  - Scale 강제 (타입 체크)            │
│  - Dead code 추적 가능               │
└─────────────┬───────────────────────┘
              │
              │ import
              ▼
┌─────────────────────────────────────┐
│  2차 토큰 (token.const.2tier.ts)    │
│  - 명시적 CSS 속성명 매핑            │
│  - 1차 토큰만 참조 (타입 강제)       │
│  - Resolver 선택적 사용              │
└─────────────┬───────────────────────┘
              │
              │ import
              ▼
┌─────────────────────────────────────┐
│  Layout 프리셋 (Layout.ts)          │
│  - Resolver 패턴                    │
│  - 명시적 key-value 반환             │
└─────────────┬───────────────────────┘
              │
              │ build
              ▼
┌─────────────────────────────────────┐
│  CSS 변수 (자동 생성, 선택적)        │
│  - 테마 전환 지원                    │
│  - SSR/SSG 호환                     │
└─────────────────────────────────────┘
```

### 7.2 핵심 결정 사항

1. **1차 토큰은 숫자 값 반환** (`Space.n8 = 8`)
2. **2차 토큰은 명시적 CSS 속성명 포함** (`{ height: Size.n40, padding: Space.n8 }`)
3. **Resolver 패턴 유지** (Layout처럼 런타임 변환)
4. **CSS 변수는 빌드 타임 자동 생성** (테마 전환 지원)
5. **TypeScript가 Single Source of Truth**
6. **ESLint + AI로 규칙 강제**

### 7.3 기대 효과

✅ **Dead code 추적**: TypeScript unused exports로 미사용 토큰 자동 탐지
✅ **AI Lint 가능**: 구조화된 타입으로 규칙 검증
✅ **타입 안전**: 컴파일 타임에 잘못된 토큰 참조 차단
✅ **개발 경험 향상**: IDE 자동완성, 타입 힌트
✅ **번들 최적화**: 사용되는 토큰만 CSS 생성
✅ **일관성**: 모든 2차 토큰이 동일한 패턴 (key-value 명시)
✅ **유지보수성**: 단일 진실의 원천 (TS 파일만 수정)

---

## 8. 결론

**TypeScript 기반 토큰 시스템은 다음을 가능하게 합니다:**

1. **Dead Code 추적** - TS 정적 분석으로 미사용 토큰 자동 탐지
2. **AI Lint** - 구조화된 타입 정보로 규칙 자동 검증
3. **명시적 Key-Value** - CSS 속성명을 객체 key로 명시
4. **1차 토큰만 참조** - 타입 체크로 직접 값 입력 차단
5. **테마 전환 유지** - 빌드 타임 CSS 변수 자동 생성으로 호환성 유지

**다음 단계:**
- Phase 1-4 마이그레이션 계획 실행
- ESLint 플러그인 개발
- AI lint 프롬프트 작성
- 컴포넌트 점진적 마이그레이션

---

**작성:** Claude Code
**날짜:** 2026-01-15
