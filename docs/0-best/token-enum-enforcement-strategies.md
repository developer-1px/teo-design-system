# TypeScript 토큰 시스템: Enum 강제 전략 비교

**작성일:** 2026-01-15
**핵심 질문:** "1차 토큰을 숫자로 하면 AI가 직접 `8`을 쓸 수 있잖아? Enum을 어떻게 강제하지?"

---

## 문제 정의

### 현재 상황

**기존 방식 (문자열 식별자):**
```typescript
export const Space = {
  n8: "space.n8",   // 문자열 식별자
} as const;

// AI 사용
const value = Space.n8;  // ✅ "space.n8"
const bad = "space.n8";  // ⚠️ 가능하지만 ESLint로 금지 가능
const worse = 8;         // ❌ 타입 에러 (string이 아님)
```

**제안 방식 (숫자 값):**
```typescript
export const Space = {
  n8: 8,   // 숫자
} as const;

export const px = (value: number) => `${value}px`;

// AI 사용
px(Space.n8);  // ✅ OK
px(8);         // ❌ 이게 문제! AI가 직접 쓸 수 있음
```

### 핵심 요구사항

**Q: 왜 Enum을 강제해야 하나?**

A: 디자인 시스템의 일관성을 위해서입니다.

```typescript
// ❌ 이런 걸 막아야 함
const styles = {
  padding: px(8),      // 직접 값 - Space 스케일 위반 가능성
  margin: px(15),      // 15는 Space 스케일에 없음!
  gap: px(Space.n12),  // ✅ 이것만 허용
};
```

**원하는 것:**
1. ✅ AI가 반드시 `Space.n8` 형태로만 사용
2. ✅ 직접 숫자 `8` 입력 시 타입 에러
3. ✅ Dead code 추적 가능
4. ✅ 계산도 가능하면 좋음 (Space.n8 * 2)

---

## 전략 1: Branded Type

### 개념

> "숫자에 보이지 않는 꼬리표를 달자"

TypeScript의 Branded Type 패턴을 사용해서, 일반 `number`와 `SpaceToken` 타입을 구분합니다.

### 구현

```typescript
// 1️⃣ 브랜드 타입 정의
declare const __brand: unique symbol;
type Brand<T, TBrand extends string> = T & { [__brand]: TBrand };

type SpaceToken = Brand<number, "Space">;
type SizeToken = Brand<number, "Size">;

// 2️⃣ 토큰 정의 - 숫자를 브랜드로 캐스팅
export const Space = {
  n0: 0 as SpaceToken,
  n8: 8 as SpaceToken,
  n12: 12 as SpaceToken,
  n16: 16 as SpaceToken,
} as const;

export const Size = {
  n24: 24 as SizeToken,
  n40: 40 as SizeToken,
} as const;

// 3️⃣ 유틸리티 - Branded Type만 받음
export function px(value: SpaceToken | SizeToken): string {
  return `${value}px`;
}

// 4️⃣ 사용
px(Space.n8);   // ✅ OK - SpaceToken
px(Size.n40);   // ✅ OK - SizeToken
px(8);          // ❌ 타입 에러! number는 SpaceToken이 아님
px(40);         // ❌ 타입 에러! number는 SizeToken이 아님
```

### 동작 원리

**Q: 런타임에는 뭐가 달라지나?**

A: 아무것도 안 달라집니다!

```typescript
// 컴파일 전 (TypeScript)
const value = Space.n8;  // SpaceToken (브랜드 타입)
px(value);

// 컴파일 후 (JavaScript)
const value = 8;  // 그냥 숫자
console.log(`${value}px`);

// 브랜드는 타입 시스템에만 존재, 런타임에는 사라짐
```

### 계산은 어떻게?

```typescript
// ❌ 이렇게 하면 브랜드가 사라짐
const doubled = Space.n8 * 2;  // number (일반 숫자)
px(doubled);  // ❌ 타입 에러

// ✅ 헬퍼 함수 사용
function multiply(value: SpaceToken, factor: number): SpaceToken {
  return (value * factor) as SpaceToken;
}

const doubled = multiply(Space.n8, 2);  // 16 (SpaceToken)
px(doubled);  // ✅ OK

// ✅ 또는 직접 캐스팅
const tripled = (Space.n8 * 3) as SpaceToken;
px(tripled);  // ✅ OK
```

### 장점

✅ **완벽한 Enum 강제**
```typescript
px(8);  // ❌ 컴파일 에러
// Error: Argument of type 'number' is not assignable to parameter of type 'SpaceToken'
```

✅ **Zero 런타임 오버헤드**
```typescript
// 런타임에는 그냥 숫자. 추가 비용 없음
const value = Space.n8;  // 컴파일 후: const value = 8;
```

✅ **Dead code 추적 가능**
```typescript
// Space.n8을 아무도 안 쓰면 TypeScript unused exports로 감지
export const Space = {
  n8: 8 as SpaceToken,   // ⚠️ unused
  n12: 12 as SpaceToken, // ✅ 사용됨
};
```

✅ **타입 안전**
```typescript
// 컴파일 타임에 모든 실수 잡음
px(Space.n8);   // ✅ SpaceToken
px(Size.n40);   // ✅ SizeToken
px(Space.n8 + Size.n40);  // ❌ 에러: 브랜드 혼합
```

### 단점

⚠️ **계산 시 타입 캐스팅 필요**
```typescript
// 매번 as SpaceToken 붙여야 함
const result = (Space.n8 * 2) as SpaceToken;

// 또는 헬퍼 함수 만들어야 함
const result = multiply(Space.n8, 2);
```

⚠️ **브랜드 타입 정의 보일러플레이트**
```typescript
// 이런 걸 한 번 작성해야 함
declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { [__brand]: TBrand };
```

⚠️ **IDE 표시가 복잡해 보일 수 있음**
```typescript
// 마우스 올리면 이렇게 보임
const value: number & { [__brand]: "Space" }
```

---

## 전략 2: 문자열 식별자 유지 + Runtime Resolver

### 개념

> "현재 방식을 그대로 쓰되, Runtime에 값을 변환하자"

문자열 식별자를 유지하고, 실제 값은 별도 맵에 저장한 뒤 런타임에 resolve합니다.

### 구현

```typescript
// 1️⃣ 토큰 정의 - 문자열 식별자 (기존과 동일)
export const Space = {
  n0: "space.n0",
  n8: "space.n8",
  n12: "space.n12",
} as const;

export type SpaceToken = typeof Space[keyof typeof Space];

// 2️⃣ 값 맵 정의
const spaceValueMap: Record<SpaceToken, number> = {
  "space.n0": 0,
  "space.n8": 8,
  "space.n12": 12,
};

// 3️⃣ Resolver 함수
export function resolveSpace(token: SpaceToken): number {
  return spaceValueMap[token];
}

// 4️⃣ 유틸리티
export function px(token: SpaceToken | SizeToken): string {
  // 토큰 타입에 따라 다른 맵 조회
  if (typeof token === "string" && token.startsWith("space.")) {
    return `${spaceValueMap[token as SpaceToken]}px`;
  }
  // ... 다른 토큰 타입 처리
}

// 5️⃣ 사용
px(Space.n8);     // ✅ OK → "8px"
px("space.n8");   // ✅ 타입상 OK (하지만 ESLint로 금지 가능)
px(8);            // ❌ 타입 에러
```

### 동작 원리

```typescript
// 1. 토큰 참조
const token = Space.n8;  // "space.n8"

// 2. px() 호출
px(token);

// 3. 내부에서 맵 조회
spaceValueMap["space.n8"]  // → 8

// 4. px 변환
`${8}px`  // → "8px"
```

### 장점

✅ **완벽한 Enum 강제**
```typescript
px(8);  // ❌ 타입 에러
px("space.n8");  // ⚠️ 타입상 OK지만 ESLint로 금지 가능
px(Space.n8);    // ✅ OK
```

✅ **기존 코드와 호환**
```typescript
// 현재 시스템과 동일한 구조
export const Space = {
  n8: "space.n8",  // 기존 방식
};
```

✅ **Dead code 추적**
```typescript
// 문자열 리터럴 타입도 참조 추적 가능
Space.n8  // 사용 안 하면 unused로 감지
```

### 단점

❌ **Runtime 오버헤드**
```typescript
// 매번 함수 호출 + 맵 조회
px(Space.n8)
  → spaceValueMap 조회
  → 템플릿 리터럴 생성

// vs Branded Type
px(Space.n8)
  → 그냥 템플릿 리터럴 (`${8}px`)
```

❌ **이중 정의 (Single Source of Truth 위반)**
```typescript
// 토큰 정의
export const Space = {
  n8: "space.n8",  // 1. 여기 정의
};

// 값 맵
const spaceValueMap = {
  "space.n8": 8,   // 2. 여기도 정의
};

// 둘이 싱크 안 맞으면?
export const Space = {
  n9: "space.n9",  // 추가했는데
};
// spaceValueMap에 안 넣으면 런타임 에러!
```

❌ **계산 불가**
```typescript
const doubled = Space.n8 * 2;  // ❌ 문자열 * 숫자 = NaN
const resolved = resolveSpace(Space.n8);  // 8
const doubled = resolved * 2;  // 16
// 하지만 이제 브랜드 없음. px()에 못 씀
```

---

## 전략 3: Opaque Type (타사 라이브러리)

### 개념

> "타입만으로 구분하되, 라이브러리로 편하게 쓰자"

`type-fest` 같은 라이브러리의 `Opaque` 타입을 사용합니다.

### 구현

```typescript
// 1️⃣ 라이브러리 설치
// npm install type-fest

import type { Opaque } from 'type-fest';

// 2️⃣ Opaque 타입 정의
type SpaceToken = Opaque<number, 'Space'>;
type SizeToken = Opaque<number, 'Size'>;

// 3️⃣ 토큰 정의
export const Space = {
  n8: 8 as SpaceToken,
  n12: 12 as SpaceToken,
} as const;

// 4️⃣ 사용 (Branded Type과 동일)
px(Space.n8);  // ✅ OK
px(8);         // ❌ 타입 에러
```

### 차이점

**Branded Type (직접 구현):**
```typescript
declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { [__brand]: TBrand };
```

**Opaque Type (라이브러리):**
```typescript
import type { Opaque } from 'type-fest';
// 내부 구현은 동일하지만 라이브러리가 제공
```

### 장점

✅ **Branded Type과 동일한 장점**
- Enum 강제, Zero 런타임 오버헤드, Dead code 추적

✅ **보일러플레이트 감소**
```typescript
// 직접 Brand 타입 정의 안 해도 됨
import { Opaque } from 'type-fest';
```

### 단점

⚠️ **외부 의존성 추가**
```typescript
// package.json
{
  "dependencies": {
    "type-fest": "^4.0.0"  // 추가 패키지
  }
}
```

⚠️ **Branded Type과 동일한 단점**
- 계산 시 타입 캐스팅 필요
- IDE 표시 복잡

---

## 전략 4: Template Literal Type + Validator

### 개념

> "문자열로 하되, 패턴을 강제하자"

템플릿 리터럴 타입으로 `"8px"` 같은 패턴만 허용합니다.

### 구현

```typescript
// 1️⃣ 템플릿 리터럴 + 브랜드
type SpaceValue = `${number}px` & { __brand: 'SpaceValue' };

// 2️⃣ Factory 함수
function createSpace(value: number): SpaceValue {
  return `${value}px` as SpaceValue;
}

// 3️⃣ 토큰 정의
export const Space = {
  n8: createSpace(8),    // "8px"
  n12: createSpace(12),  // "12px"
} as const;

// 4️⃣ 사용
function applySpace(value: SpaceValue): string {
  return value;  // 이미 "8px" 형태
}

applySpace(Space.n8);   // ✅ OK
applySpace("8px");      // ❌ 타입 에러 (브랜드 없음)
applySpace(8);          // ❌ 타입 에러
```

### 장점

✅ **Enum 강제**
```typescript
applySpace("8px");  // ❌ 에러 (브랜드 없음)
```

✅ **CSS에 바로 사용 가능**
```typescript
const styles = {
  padding: Space.n8,  // "8px" 그대로
};
```

### 단점

❌ **계산 불가**
```typescript
Space.n8 * 2  // ❌ "8px" * 2 = NaN
```

❌ **유연성 낮음**
```typescript
// px만 가능, rem 변환 어려움
rem(Space.n8)  // "8px"를 어떻게 rem으로?
```

❌ **Factory 함수 필요**
```typescript
// 매번 이렇게 써야 함
n8: createSpace(8),
n12: createSpace(12),
```

---

## 전략 5: Nominal Type (향후 TypeScript 기능)

### 개념

> "TypeScript가 공식 지원할 때까지 기다리자"

TypeScript 5.x+에서 Nominal Type이 논의 중입니다 (아직 미지원).

### 예상 구문 (제안)

```typescript
// 향후 TypeScript에서 이렇게 될 수도
type SpaceToken = nominal number;

export const Space = {
  n8: 8 as SpaceToken,
} as const;

px(Space.n8);  // ✅ OK
px(8);         // ❌ 에러
```

### 현재 상태

❌ **아직 미지원**
- TypeScript 공식 Nominal Type 없음
- Branded Type이 사실상 표준 workaround

---

## 비교표

| 전략 | Enum 강제 | 런타임 오버헤드 | 계산 가능 | Dead Code 추적 | 보일러플레이트 | 외부 의존성 |
|------|----------|----------------|----------|---------------|--------------|-----------|
| **1. Branded Type** | ✅ 완벽 | ✅ Zero | ✅ 가능* | ✅ 가능 | ⚠️ 중간 | ✅ 없음 |
| **2. 문자열 식별자** | ✅ 완벽 | ❌ 있음 | ❌ 불가 | ✅ 가능 | ❌ 많음 | ✅ 없음 |
| **3. Opaque Type** | ✅ 완벽 | ✅ Zero | ✅ 가능* | ✅ 가능 | ✅ 적음 | ⚠️ type-fest |
| **4. Template Literal** | ✅ 완벽 | ✅ Zero | ❌ 불가 | ✅ 가능 | ⚠️ 중간 | ✅ 없음 |
| **5. Nominal (미래)** | ✅ 완벽 | ✅ Zero | ✅ 가능 | ✅ 가능 | ✅ 없음 | ✅ 없음 |

*계산 가능하지만 타입 캐스팅 필요

---

## 실전 시나리오 비교

### 시나리오 1: 단순 사용

```typescript
// Branded Type
px(Space.n8)  // ✅ 간단

// 문자열 식별자
px(Space.n8)  // ✅ 간단 (하지만 내부에서 맵 조회)

// Template Literal
applySpace(Space.n8)  // ✅ 간단
```

**승자:** 모두 비슷

---

### 시나리오 2: 계산 필요

```typescript
// Branded Type
const doubled = multiply(Space.n8, 2);  // ✅ 헬퍼 함수
// 또는
const doubled = (Space.n8 * 2) as SpaceToken;  // ✅ 캐스팅

// 문자열 식별자
const value = resolveSpace(Space.n8);  // 8
const doubled = value * 2;  // 16
px(doubled);  // ❌ 에러 (일반 number)

// Template Literal
// ❌ 불가능
```

**승자:** Branded Type

---

### 시나리오 3: 2차 토큰에서 사용

```typescript
// 2차 토큰 정의
export const ActionSize = {
  md: {
    height: Size.n40,
    padding: Space.n8,
    fontSize: FontSize.n14,
  }
} as const;

// Branded Type
function resolveActionSize(size: "md") {
  return {
    height: px(Size.n40),        // ✅ OK
    padding: px(Space.n8),       // ✅ OK
    fontSize: px(FontSize.n14),  // ✅ OK
  };
}

// 문자열 식별자
function resolveActionSize(size: "md") {
  return {
    height: px(Size.n40),   // ✅ OK (내부 맵 조회)
    padding: px(Space.n8),  // ✅ OK (내부 맵 조회)
    // ... 매번 조회
  };
}
```

**승자:** Branded Type (Zero 오버헤드)

---

### 시나리오 4: CSS 변수 생성

```typescript
// 빌드 타임 CSS 생성 스크립트

// Branded Type
Object.entries(Space).forEach(([key, value]) => {
  css += `--space-${key}: ${value}px;\n`;  // ✅ 간단
});

// 문자열 식별자
Object.entries(Space).forEach(([key, token]) => {
  const value = spaceValueMap[token];  // 맵 조회 필요
  css += `--space-${key}: ${value}px;\n`;
});
```

**승자:** Branded Type

---

## AI Lint 관점

### Branded Type

```typescript
// AI가 이렇게 쓰면
px(8);

// 즉시 타입 에러
// Error: Argument of type 'number' is not assignable to parameter of type 'SpaceToken'

// AI 학습 용이:
// "타입 에러 나면 Space.n8 형태로 써야 한다"
```

### 문자열 식별자

```typescript
// AI가 이렇게 쓰면
px("space.n8");

// 타입상 OK (문자열 리터럴 타입)
// ESLint 룰로 막아야 함
// → 추가 설정 필요
```

**승자:** Branded Type (타입 체크만으로 충분)

---

## 최종 권장사항

### 🏆 1순위: Branded Type

**사용 추천 케이스:**
- ✅ 런타임 성능이 중요한 경우
- ✅ 계산이 필요한 경우
- ✅ 외부 의존성을 최소화하고 싶은 경우
- ✅ TypeScript만으로 완결하고 싶은 경우

**구현 예시:**
```typescript
// brand.ts
declare const __brand: unique symbol;
export type Brand<T, TBrand extends string> = T & { [__brand]: TBrand };
export type SpaceToken = Brand<number, "Space">;
export type SizeToken = Brand<number, "Size">;

// token.const.1tier.ts
export const Space = {
  n8: 8 as SpaceToken,
  n12: 12 as SpaceToken,
} as const;

// utils.ts
export function px(value: SpaceToken | SizeToken): string {
  return `${value}px`;
}

export function multiply(value: SpaceToken, factor: number): SpaceToken {
  return (value * factor) as SpaceToken;
}
```

---

### 🥈 2순위: Opaque Type (type-fest)

**사용 추천 케이스:**
- ✅ 보일러플레이트를 줄이고 싶은 경우
- ✅ type-fest 이미 사용 중인 경우
- ✅ Branded Type과 동일한 효과를 더 쉽게

**구현 예시:**
```typescript
import type { Opaque } from 'type-fest';

type SpaceToken = Opaque<number, 'Space'>;

export const Space = {
  n8: 8 as SpaceToken,
} as const;
```

---

### 🥉 3순위: 문자열 식별자 유지

**사용 추천 케이스:**
- ✅ 기존 시스템과의 호환성이 최우선인 경우
- ✅ 런타임 오버헤드가 크게 문제되지 않는 경우
- ✅ 계산이 거의 필요 없는 경우

**단, 이중 정의 문제를 해결해야 함:**
```typescript
// 자동 생성 스크립트로 해결
// Space 정의에서 자동으로 valueMap 생성
```

---

## 결론

**TypeScript Branded Type 방식이 최선입니다.**

이유:
1. ✅ **완벽한 Enum 강제** - AI가 숫자 직접 입력 불가
2. ✅ **Zero 런타임 오버헤드** - 컴파일 후 사라짐
3. ✅ **계산 가능** - 타입 캐스팅으로 해결
4. ✅ **Dead code 추적** - TypeScript 분석 가능
5. ✅ **외부 의존성 없음** - TypeScript 기본 기능
6. ✅ **AI Lint 용이** - 타입 체크만으로 충분

단점도 있지만:
- ⚠️ 계산 시 타입 캐스팅 필요 → 헬퍼 함수로 해결
- ⚠️ 브랜드 타입 정의 → 한 번만 작성하면 됨

---

**다음 단계:**
1. Branded Type 방식으로 1차 토큰 리팩토링
2. 계산 헬퍼 함수 작성 (multiply, add 등)
3. 2차 토큰에서 1차 토큰 참조 강제
4. ESLint 룰 추가 (보험용)
5. AI 프롬프트에 타입 에러 대응 방법 추가

---

**작성:** Claude Code
**날짜:** 2026-01-15
