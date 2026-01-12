# Token Engine 발전 가능성 및 개선 제안

> **"현재의 Token Engine은 시작일 뿐이다"**
>
> Token Engine v3.1의 현재 상태를 분석하고, 앞으로 나아갈 방향을 제시합니다.

---

## 목차

1. [현재 시스템 분석](#1-현재-시스템-분석)
2. [단기 개선 제안 (Quick Wins)](#2-단기-개선-제안-quick-wins)
3. [중기 발전 방향 (6개월)](#3-중기-발전-방향-6개월)
4. [장기 비전 (1년+)](#4-장기-비전-1년)
5. [실험적 아이디어](#5-실험적-아이디어)
6. [커뮤니티 피드백 반영](#6-커뮤니티-피드백-반영)

---

## 1. 현재 시스템 분석

### 1.1 강점 (Strengths)

#### ✅ 수학적 일관성
- 모든 spacing/typography가 **공식으로 계산**됨
- 개발자가 작성해도 **동일한 결과** 보장
- 디자이너가 **공식만 조정**하면 전체 시스템 변경 가능

#### ✅ 컨텍스트 인식
- Page → Section → Block 계층을 **자동 감지**
- SectionType에 따라 **자동 크기 조정**
- prominence × density 조합으로 **모든 상태 처리**

#### ✅ 타입 안전성
- TypeScript로 **잘못된 조합 방지**
- IDE 자동완성으로 **빠른 개발**
- 컴파일 타임 에러로 **런타임 버그 감소**

#### ✅ 개발자 경험 (DX)
- 의도만 선언하면 **시스템이 자동 처리**
- className 조합 고민 **제거**
- 학습 곡선 **단순화** (prominence, intent, density만)

### 1.2 약점 (Weaknesses)

#### ❌ 유연성 제한
**문제**: 정해진 조합만 사용 가능, 예외 처리 어려움

**사례**:
```tsx
// ❌ "gap-5만 필요한데 Standard는 gap-4, Hero는 gap-6..."
<Block prominence="Standard"> {/* gap-4 */}
  {/* gap-5가 딱 필요함 */}
</Block>

// 현재 해결책: override (불완전)
<Block prominence="Standard" className="!gap-5">
```

**영향**:
- 디자인 QA 피드백 반영 어려움
- "1px만 조정" 요청 처리 복잡
- 특수 케이스마다 override 남발

#### ❌ Snapping으로 인한 정밀도 손실
**문제**: 계산값이 허용 값으로 반올림되면서 의도와 달라짐

**사례**:
```typescript
// Panel × Hero × Standard
gap = 16 × 0.875 × 1.29 × 1.0 = 18.06px
// → snap to 16px (2px 손실, -11%)

// Float × Subtle × Compact
paddingX = 12 × 0.8125 × 0.92 × 0.75 = 6.73px
// → snap to 8px (+1.27px, +19% 증가!)
```

**영향**:
- 계산 공식과 **실제 결과가 다름**
- 특정 조합에서 **과도한 snap** (±20%)
- 디자이너의 의도가 **왜곡될 수 있음**

#### ❌ 런타임 계산 비용
**문제**: 매 렌더링마다 TokenEngine.resolve() 호출

**사례**:
```typescript
// 매 렌더링마다 실행
const tokens = useIDDLToken({ prominence, intent });

// 5개 generator × N개 컴포넌트 = 부담
```

**영향**:
- 복잡한 페이지에서 **성능 저하 가능**
- useMemo로 완화하지만 **여전히 계산 필요**
- 불필요한 재계산 발생

#### ❌ 디버깅 어려움
**문제**: 생성된 className이 **동적**이므로 추적 어려움

**사례**:
```tsx
// 개발자 도구에서 보면...
<button class="gap-4 px-3 py-2 bg-accent hover:bg-accent-hover ...">

// 어디서 생성된 className인지 알 수 없음
// prominence/intent 조합을 역추적해야 함
```

**영향**:
- "이 spacing은 어떻게 나온 거지?" 의문
- IDDL Inspector 없이는 디버깅 **매우 어려움**
- Tailwind IntelliSense 작동 안 함

#### ❌ 문서화 부족
**문제**: 공식/조합이 코드에만 존재, 외부 문서 부족

**사례**:
- "Panel × Hero는 왜 1.29배인가?" → 코드 읽어야 알 수 있음
- "Snapping 알고리즘은?" → 구현 코드 확인 필요
- 디자이너와 소통 시 **공통 언어 부족**

**영향**:
- 팀 온보딩 **시간 증가**
- 디자이너-개발자 간 **소통 어려움**
- 외부 기여자가 **이해하기 어려움**

### 1.3 기회 (Opportunities)

#### 🌟 AI 기반 자동 prominence/intent 추론
**아이디어**: 텍스트/역할을 보고 AI가 적절한 prominence/intent 제안

```tsx
// 현재
<Action prominence="Standard" intent="Critical">Delete Account</Action>

// 미래 (AI 추론)
<Action>Delete Account</Action>
// AI가 "Delete"라는 단어를 보고 intent="Critical" 자동 추론
```

#### 🌟 Figma Plugin 연동
**아이디어**: Figma 디자인을 IDDL 코드로 자동 변환

```
Figma Design → Figma Plugin → IDDL Code
- Button 컴포넌트 → <Action prominence="Standard" intent="Brand">
- spacing 분석 → prominence/density 추론
```

#### 🌟 실시간 Design Preview
**아이디어**: 코드 작성 중 실시간으로 디자인 미리보기

```tsx
// VS Code Extension
<Action prominence="Standard"> {/* 옆에 버튼 미리보기 표시 */}
```

#### 🌟 Design Token Export
**아이디어**: Token Engine 공식을 다른 시스템으로 export

```typescript
// Export to CSS Variables
:root {
  --iddl-gap-standard-standard: 16px;
  --iddl-gap-hero-comfortable: 32px;
}

// Export to Design Tokens (JSON)
{
  "spacing": {
    "standard-standard": { "gap": 16, "paddingX": 12 }
  }
}
```

### 1.4 위협 (Threats)

#### ⚠️ Tailwind/다른 CSS 프레임워크와의 충돌
**문제**: Token Engine이 Tailwind에 강하게 의존

**위험**:
- Tailwind 버전 업그레이드 시 **breaking change**
- 다른 CSS 프레임워크 사용 시 **재작성 필요**
- Tailwind의 방향성과 **불일치 가능**

#### ⚠️ React 의존성
**문제**: useIDDLToken이 React Hook

**위험**:
- Vue, Svelte 등 **다른 프레임워크 사용 불가**
- React 19 이후 변화에 **대응 필요**
- SSR, SSG 환경에서 **제약 가능**

#### ⚠️ 학습 곡선
**문제**: 새로운 개념 (prominence, sectionType 등)

**위험**:
- 신입 개발자가 **거부감** 가질 수 있음
- 기존 Tailwind 사용자가 **불편** 느낄 수 있음
- 프로젝트 도입 시 **팀 설득 어려움**

---

## 2. 단기 개선 제안 (Quick Wins)

### 2.1 Memoization 최적화 (Performance)

**문제**: TokenEngine.resolve()가 매번 새로운 객체 생성

**현재**:
```typescript
export class TokenEngine {
  static resolve(input: TokenInput): TokenOutput {
    return {
      spacing: generateSpacing(input),  // 매번 새로 생성
      surface: generateSurface(input),
      // ...
    };
  }
}
```

**개선**:
```typescript
// LRU Cache로 최근 N개 결과 캐싱
const cache = new Map<string, TokenOutput>();
const MAX_CACHE_SIZE = 100;

export class TokenEngine {
  static resolve(input: TokenInput): TokenOutput {
    // 1. Cache key 생성
    const key = JSON.stringify(input);

    // 2. Cache hit
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    // 3. Cache miss - 계산
    const output = {
      spacing: generateSpacing(input),
      surface: generateSurface(input),
      geometry: generateGeometry(input),
      typography: generateTypography(input),
      shadow: generateShadow(input),
    };

    // 4. Cache 저장 (LRU)
    if (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, output);

    return output;
  }
}
```

**효과**:
- ✅ 동일한 input 반복 시 **즉시 반환** (O(1))
- ✅ 복잡한 페이지에서 **렌더링 성능 향상**
- ✅ useMemo와 함께 사용 시 **거의 재계산 없음**

**Trade-off**:
- ❌ 메모리 사용량 증가 (100개 × 객체 크기)
- ❌ Cache key 생성 비용 (JSON.stringify)

**대안**: WeakMap 사용 (GC 가능)
```typescript
const cache = new WeakMap<TokenInput, TokenOutput>();
// 단, TokenInput이 객체 참조로 비교됨 (deep equality 불가)
```

### 2.2 Dev Tools 개선

**문제**: IDDL Inspector가 Cmd+D로만 토글, 정보 부족

**개선 1: Browser Extension**

```typescript
// Chrome Extension으로 분리
// - 항상 켜둘 수 있음
// - DevTools 패널로 통합
// - React DevTools처럼 컴포넌트 트리 표시

interface IDDLInspectorPanel {
  componentTree: {
    name: string;
    props: { prominence, intent, density };
    tokens: TokenOutput;  // 실제 생성된 토큰 표시
  }[];
  breakdown: {
    // 계산 과정 표시
    spacing: {
      base: 16,
      typeScale: 0.875,
      prominence: 1.0,
      density: 1.0,
      raw: 14,
      final: 16,  // snap 결과
    };
  };
}
```

**개선 2: VS Code Extension**

```typescript
// Hover시 토큰 미리보기
<Action prominence="Standard">
//      ^ Hover here

// Tooltip 표시:
// prominence="Standard"
// → spacing: gap-4 px-3 py-2
// → surface: bg-transparent hover:bg-surface-hover
// → Calculation: 16px × 1.0 × 1.0 = 16px
```

**개선 3: Console Helper**

```typescript
// 콘솔에서 바로 테스트
window.__IDDL__ = {
  calculate(prominence, intent, density) {
    return TokenEngine.resolve({
      role: 'Button',
      prominence,
      intent,
      density,
    });
  },

  debug(element) {
    // DOM 요소를 보고 어떤 prominence/intent인지 역추적
  },
};

// 사용
__IDDL__.calculate('Hero', 'Brand', 'Comfortable');
// → { spacing: { gap: 32, ... }, ... }
```

### 2.3 Documentation Generator

**문제**: 공식이 코드에만 존재, 외부 문서 수동 작성

**개선**: TypeDoc 스타일 자동 문서 생성

```typescript
// tokens.config.ts (단일 설정 파일)
export const TOKEN_CONFIG = {
  spacing: {
    baseValues: {
      gap: 16,
      paddingX: 12,
      paddingY: 8,
      /**
       * @description children 사이 간격
       * @unit px
       * @tailwind gap-4
       */
    },
    prominenceFactors: {
      Hero: 1.5,
      /**
       * @description 150% 증가
       * @reason 시각적으로 "두드러짐"을 느끼려면 최소 1.5배 차이 필요
       * @reference Weber-Fechner 법칙
       */
      Standard: 1.0,
      // ...
    },
  },
  // ...
};

// CLI 실행
$ pnpm generate-token-docs

// 생성 결과: docs/tokens/spacing.md
```

**생성 문서 예시**:

```markdown
# Spacing Tokens

## Base Values

| Property | Value | Unit | Tailwind |
|----------|-------|------|----------|
| gap | 16 | px | gap-4 |
| paddingX | 12 | px | px-3 |
| paddingY | 8 | px | py-2 |

## Prominence Factors

| Prominence | Factor | Description |
|-----------|--------|-------------|
| Hero | 1.5 | 150% 증가. 시각적으로 "두드러짐"을 느끼려면 최소 1.5배 차이 필요 (Weber-Fechner 법칙) |
| Standard | 1.0 | 기준값 |

## Examples

### Hero × Comfortable

\`\`\`typescript
gap = 16 × 1.5 × 1.5 = 36px → snap to 32px
className: "gap-8"
\`\`\`
```

### 2.4 Type-safe Override System

**문제**: className override가 타입 안전하지 않음

**현재**:
```tsx
// ❌ 타입 체크 없음, 오타 가능
<Action prominence="Standard" className="!gap-99">
  {/* gap-99는 존재하지 않는 className */}
</Action>
```

**개선**: Typed Override API

```tsx
// ✅ 타입 안전한 override
<Action
  prominence="Standard"
  override={{
    spacing: {
      gap: 20,  // number (px)
      // TypeScript가 허용 값 체크
    }
  }}
>
```

**구현**:
```typescript
interface OverrideConfig {
  spacing?: {
    gap?: AllowedSpacing;  // 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 96
    paddingX?: AllowedSpacing;
    paddingY?: AllowedSpacing;
  };
  surface?: {
    background?: string;  // Tailwind className
  };
  // ...
}

// 사용 시 타입 체크
<Action override={{ spacing: { gap: 99 } }}> {/* ❌ 컴파일 에러 */}
<Action override={{ spacing: { gap: 24 } }}> {/* ✅ OK */}
```

**효과**:
- ✅ override 시에도 **타입 안전성** 유지
- ✅ 허용 값만 사용 가능 (디자인 일관성)
- ✅ IDE 자동완성 지원

### 2.5 Tailwind Plugin 통합

**문제**: Token Engine이 Tailwind와 **분리**되어 있음

**개선**: Tailwind Plugin으로 통합

```typescript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@iddl/tailwind-plugin')({
      // Token Engine 설정 주입
      spacing: {
        baseGap: 16,
        prominenceFactors: { Hero: 1.5, Standard: 1.0 },
      },
    }),
  ],
};
```

**효과**:
- ✅ Tailwind의 **theme.spacing**과 자동 동기화
- ✅ CSS 변수로 export (`--iddl-gap-standard`)
- ✅ JIT 모드와 완벽 호환

**생성 결과**:
```css
/* 자동 생성된 CSS */
:root {
  --iddl-gap-standard-standard: 1rem;
  --iddl-gap-hero-comfortable: 2rem;
}

.gap-iddl-standard {
  gap: var(--iddl-gap-standard-standard);
}
```

---

## 3. 중기 발전 방향 (6개월)

### 3.1 Adaptive Snapping (스마트 반올림)

**문제**: 현재 snapping이 너무 단순 (가장 가까운 값으로 무조건 반올림)

**개선**: 컨텍스트 기반 스마트 snapping

```typescript
function smartSnap(
  rawValue: number,
  context: {
    property: 'gap' | 'paddingX' | 'paddingY';
    sectionType: SectionType;
    prominence: Prominence;
  }
): number {
  const allowedValues = [4, 8, 12, 16, 24, 32, 48, 64, 96];

  // 1. 기본 snap (가장 가까운 값)
  let snapValue = allowedValues.reduce((prev, curr) =>
    Math.abs(curr - rawValue) < Math.abs(prev - rawValue) ? curr : prev
  );

  // 2. 컨텍스트 기반 조정
  const deviation = Math.abs(snapValue - rawValue) / rawValue;

  // Hero는 snap down 선호 (크게 보이는 게 중요)
  if (context.prominence === 'Hero' && deviation > 0.1) {
    const largerValue = allowedValues.find(v => v > rawValue);
    if (largerValue) snapValue = largerValue;
  }

  // Compact는 snap down 선호 (공간 절약)
  if (context.sectionType === 'Panel' && deviation > 0.1) {
    const smallerValue = [...allowedValues].reverse().find(v => v < rawValue);
    if (smallerValue) snapValue = smallerValue;
  }

  // 3. 최소값 보장 (padding은 최소 4px)
  if (context.property.startsWith('padding') && snapValue < 4) {
    snapValue = 4;
  }

  return snapValue;
}
```

**예시**:
```typescript
// Panel × Hero × Standard
rawGap = 18.06px

// 기존: 18.06 → 16px (snap down, -11%)
// 개선: Hero는 크게 보이는 게 중요 → 24px (snap up, +33%)
```

**효과**:
- ✅ 의도에 맞는 snapping
- ✅ Hero는 항상 **크게**, Compact는 항상 **작게**
- ✅ 디자이너 의도 **보존**

### 3.2 Dynamic Base Values (반응형)

**문제**: Base Values가 고정 (16px, 12px, 8px)

**개선**: 화면 크기에 따라 동적 조정

```typescript
// Breakpoint별 base values
const RESPONSIVE_BASE_VALUES = {
  mobile: {
    gap: 12,       // 작은 화면에서는 좁게
    paddingX: 8,
    paddingY: 6,
  },
  tablet: {
    gap: 16,       // 기준
    paddingX: 12,
    paddingY: 8,
  },
  desktop: {
    gap: 20,       // 큰 화면에서는 넓게
    paddingX: 16,
    paddingY: 10,
  },
};

// useBreakpoint Hook 통합
function useIDDLToken(localInput: TokenInput) {
  const breakpoint = useBreakpoint(); // 'mobile' | 'tablet' | 'desktop'
  const baseValues = RESPONSIVE_BASE_VALUES[breakpoint];

  // baseValues를 TokenEngine에 전달
  return TokenEngine.resolve(localInput, { baseValues });
}
```

**효과**:
- ✅ 모바일에서 **자동으로 조밀하게**
- ✅ 데스크톱에서 **자동으로 넓게**
- ✅ 미디어 쿼리 수동 작성 **제거**

### 3.3 Animation Tokens

**문제**: transition, animation이 Token Engine 범위 밖

**개선**: 애니메이션도 prominence/intent로 제어

```typescript
// Animation Config
const ANIMATION_TOKENS = {
  transition: {
    duration: {
      Hero: '300ms',      // 느린 transition (주목)
      Standard: '150ms',  // 표준
      Subtle: '100ms',    // 빠른 transition
    },
    easing: {
      Hero: 'cubic-bezier(0.4, 0, 0.2, 1)',     // ease-out
      Standard: 'cubic-bezier(0.4, 0, 1, 1)',   // ease-in-out
      Subtle: 'linear',
    },
  },
  hover: {
    scale: {
      Hero: 1.05,      // 5% 확대
      Standard: 1.02,  // 2% 확대
      Subtle: 1.0,     // 확대 없음
    },
  },
};

// TokenOutput에 추가
interface TokenOutput {
  // ...
  animation: {
    transition: string;  // "all 150ms ease-in-out"
    hover: {
      scale: number;
      className: string; // "hover:scale-105"
    };
  };
}
```

**사용**:
```tsx
<Action prominence="Hero" intent="Brand">
  {/* 자동: transition-all duration-300 hover:scale-105 */}
  Click me
</Action>
```

**효과**:
- ✅ 애니메이션도 **일관된 prominence** 체계
- ✅ Hero는 **느리고 눈에 띄게**, Subtle은 **빠르고 미묘하게**

### 3.4 Multi-Theme Support

**문제**: 현재 단일 테마만 지원

**개선**: 여러 테마 전환 가능

```typescript
// Theme Presets
const THEMES = {
  default: {
    prominenceFactors: { Hero: 1.5, Standard: 1.0 },
    densityFactors: { Comfortable: 1.5, Standard: 1.0, Compact: 0.75 },
  },
  compact: {
    // 전체적으로 조밀한 테마
    prominenceFactors: { Hero: 1.3, Standard: 1.0 },
    densityFactors: { Comfortable: 1.3, Standard: 0.9, Compact: 0.6 },
  },
  spacious: {
    // 전체적으로 넓은 테마
    prominenceFactors: { Hero: 1.8, Standard: 1.0 },
    densityFactors: { Comfortable: 1.8, Standard: 1.2, Compact: 0.9 },
  },
};

// ThemeProvider
<ThemeProvider theme="compact">
  <App />
</ThemeProvider>
```

**효과**:
- ✅ 사용자가 **테마 선택** 가능
- ✅ 접근성 설정 (큰 텍스트 모드)과 연동
- ✅ 기업별 **브랜딩** (Compact 테마 = Slack, Spacious = Notion)

### 3.5 Server-Side Token Generation

**문제**: 런타임에 TokenEngine 계산 (CSR 전용)

**개선**: 빌드 타임에 모든 조합 미리 생성 (SSG)

```typescript
// build-tokens.ts (빌드 스크립트)
const allCombinations = generateAllCombinations();

// 모든 prominence × density 조합 미리 계산
const precomputedTokens = allCombinations.map(({ prominence, intent, density }) => {
  return {
    key: `${prominence}-${intent}-${density}`,
    tokens: TokenEngine.resolve({ prominence, intent, density }),
  };
});

// JSON 파일로 저장
fs.writeFileSync('precomputed-tokens.json', JSON.stringify(precomputedTokens));
```

**런타임에서 사용**:
```typescript
import precomputedTokens from './precomputed-tokens.json';

function useIDDLToken(input: TokenInput) {
  const key = `${input.prominence}-${input.intent}-${input.density}`;
  return precomputedTokens[key]; // O(1) 조회
}
```

**효과**:
- ✅ **런타임 계산 제거** → 극도로 빠름
- ✅ SSR, SSG 완벽 지원
- ✅ 빌드 타임에 검증 가능 (모든 조합 테스트)

**Trade-off**:
- ❌ JSON 파일 크기 증가 (수백 KB)
- ❌ 동적 base values 사용 불가

---

## 4. 장기 비전 (1년+)

### 4.1 AI-Powered Token Engine

**비전**: AI가 디자인 의도를 이해하고 자동으로 prominence/intent 추론

#### Phase 1: 텍스트 기반 추론

```tsx
// 현재
<Action prominence="Standard" intent="Critical">Delete Account</Action>

// 미래
<Action>Delete Account</Action>
// AI가 "Delete"를 보고 intent="Critical" 자동 추론
// "Account"를 보고 prominence="Standard" 추론
```

**구현**:
```typescript
// AI Model (GPT-4 기반)
function inferIntent(text: string): Intent {
  const prompt = `
    Given the button text "${text}", infer the semantic intent.
    Return one of: Neutral, Brand, Positive, Caution, Critical, Info

    Examples:
    - "Delete Account" → Critical
    - "Save" → Brand
    - "Cancel" → Neutral
    - "Learn More" → Info
  `;

  const response = await openai.complete(prompt);
  return response as Intent;
}

// 사용
<Action text="Delete Account">
  {/* 자동: intent="Critical" */}
</Action>
```

#### Phase 2: 컨텍스트 기반 추론

```tsx
// Form 내부의 버튼 → prominence="Standard"
<Form>
  <Action>Submit</Action> {/* 자동: prominence="Standard" */}
</Form>

// Modal Footer의 버튼 → prominence="Hero"
<Modal>
  <Footer>
    <Action>Confirm</Action> {/* 자동: prominence="Hero" */}
  </Footer>
</Modal>
```

**구현**:
```typescript
function inferProminence(context: {
  parentRole: string;
  siblingCount: number;
  position: 'first' | 'last' | 'middle';
}): Prominence {
  // Rule-based + ML
  if (context.parentRole === 'ModalFooter' && context.position === 'last') {
    return 'Hero'; // Modal의 마지막 버튼 = Primary CTA
  }

  if (context.siblingCount > 3) {
    return 'Subtle'; // 많은 버튼 중 하나 = 덜 중요
  }

  return 'Standard';
}
```

#### Phase 3: 디자인 학습

```typescript
// 디자이너가 수동으로 조정한 케이스를 학습
<Action prominence="Hero"> {/* 디자이너가 Hero로 변경 */}
  Learn More
</Action>

// AI가 학습: "Learn More" + "이 컨텍스트" = Hero
// 다음부터 자동 추론
```

**효과**:
- ✅ 개발자가 **prominence/intent 생략** 가능
- ✅ AI가 **디자인 의도 이해**
- ✅ 시간이 지날수록 **학습하여 정확도 향상**

### 4.2 Design System as Code (DSaC)

**비전**: 디자인 시스템 전체를 코드로 정의, 자동 생성

#### 구조

```typescript
// design-system.config.ts
export const designSystem = {
  identity: {
    name: 'ACME Design System',
    version: '2.0.0',
  },

  tokens: {
    // Base Tokens
    color: {
      primary: '#3B82F6',
      success: '#10B981',
      error: '#EF4444',
    },
    spacing: {
      base: 16,
      scale: 'major-third', // 1.25 비율
    },
    typography: {
      fontFamily: 'Inter',
      scale: 'major-third',
    },
  },

  components: {
    // Component-level overrides
    Button: {
      prominence: {
        Hero: {
          fontSize: 18,
          padding: { x: 24, y: 12 },
        },
      },
    },
  },

  rules: {
    // Design Rules
    maxAccentUsage: 1, // 화면당 최대 1개 accent
    minTouchTarget: 44, // 최소 터치 영역 44px
    maxNestingDepth: 4, // 최대 4단계 nesting
  },
};
```

**자동 생성**:
```bash
$ pnpm generate-design-system

# 생성 결과:
# - src/tokens/ (모든 토큰 코드 자동 생성)
# - docs/ (자동 문서화)
# - figma/ (Figma Plugin용 토큰)
# - storybook/ (자동 Storybook Stories)
```

**효과**:
- ✅ 단일 설정 파일로 **전체 시스템 제어**
- ✅ 버전 관리 가능 (디자인 시스템 v2.0 → v3.0 마이그레이션)
- ✅ 다른 팀과 **설정 공유** (ACME Design System → 자회사)

### 4.3 Cross-Framework Support

**비전**: React 외 Vue, Svelte, Solid 등 모든 프레임워크 지원

#### 구조

```
@iddl/core         # Framework-agnostic Token Engine
  ├─ TokenEngine.ts   # Pure TypeScript (no React)
  └─ types.ts

@iddl/react        # React bindings
  └─ useIDDLToken.ts

@iddl/vue          # Vue bindings
  └─ useIDDLToken.ts (Composition API)

@iddl/svelte       # Svelte bindings
  └─ iddlToken.ts (Svelte Store)

@iddl/solid        # Solid.js bindings
  └─ createIDDLToken.ts
```

**사용 예시**:

**React**:
```tsx
import { useIDDLToken } from '@iddl/react';

function Button({ prominence }) {
  const tokens = useIDDLToken({ prominence });
  return <button className={tokens.spacing.className}>Click</button>;
}
```

**Vue**:
```vue
<script setup>
import { useIDDLToken } from '@iddl/vue';

const tokens = useIDDLToken({ prominence: 'Standard' });
</script>

<template>
  <button :class="tokens.spacing.className">Click</button>
</template>
```

**Svelte**:
```svelte
<script>
import { iddlToken } from '@iddl/svelte';

$: tokens = iddlToken({ prominence: 'Standard' });
</script>

<button class={$tokens.spacing.className}>Click</button>
```

**효과**:
- ✅ React 생태계 벗어나 **범용 시스템**으로 발전
- ✅ 다른 프레임워크 사용자도 **IDDL 사용 가능**
- ✅ 커뮤니티 확장

### 4.4 Visual Programming Interface

**비전**: 코드 없이 GUI로 Token Engine 조작

#### Figma Plugin

```
┌─────────────────────────────────────┐
│ IDDL Token Engine Plugin            │
├─────────────────────────────────────┤
│ Component: Button                   │
│ ┌─────────────────────────────────┐ │
│ │ prominence: [Standard ▼]        │ │
│ │ intent: [Brand ▼]               │ │
│ │ density: [Standard ▼]           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Generated Tokens:                   │
│ ┌─────────────────────────────────┐ │
│ │ spacing: gap-4 px-3 py-2        │ │
│ │ surface: bg-accent              │ │
│ │ typography: text-base           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Copy Code] [Apply to Layer]       │
└─────────────────────────────────────┘
```

**워크플로우**:
1. 디자이너가 Figma에서 버튼 디자인
2. Plugin에서 prominence/intent 선택
3. Plugin이 자동으로 Token Engine 계산
4. "Apply to Layer" → Figma 레이어에 자동 적용
5. "Copy Code" → 클립보드에 IDDL 코드 복사

```tsx
// 복사된 코드
<Action prominence="Standard" intent="Brand">
  Click me
</Action>
```

#### Web-based Playground

```
https://iddl.dev/playground

┌─────────────────────────────────────────────┐
│ Token Engine Playground                     │
├─────────────────────────────────────────────┤
│ Input:                    │ Output:          │
│ ┌───────────────────────┐ │ ┌──────────────┐ │
│ │ prominence: [Hero ▼]  │ │ │  [Button]    │ │
│ │ intent: [Brand ▼]     │ │ │  Click me    │ │
│ │ density: [Standard ▼] │ │ └──────────────┘ │
│ └───────────────────────┘ │                  │
│                           │ Tokens:          │
│                           │ gap-6 px-6 py-4  │
│                           │ bg-accent        │
│                           │ text-white       │
│                           │                  │
│ [Share Playground Link] [Export Code]       │
└─────────────────────────────────────────────┘
```

**효과**:
- ✅ 디자이너가 **코드 없이** 실험 가능
- ✅ 팀원과 **결과 공유** (링크로)
- ✅ 학습 도구로 활용

### 4.5 Design Lint Integration

**비전**: 디자인 규칙 위반을 자동 감지

#### ESLint Plugin

```typescript
// .eslintrc.js
module.exports = {
  plugins: ['@iddl/eslint-plugin'],
  rules: {
    '@iddl/max-accent-usage': ['error', { max: 1 }],
    '@iddl/min-touch-target': ['warn', { min: 44 }],
    '@iddl/consistent-prominence': 'error',
  },
};
```

**감지 예시**:

```tsx
// ❌ ESLint Error: max-accent-usage
<Page>
  <Action prominence="Standard" intent="Brand">Save</Action>
  <Action prominence="Standard" intent="Brand">Publish</Action>
  {/* 2개 accent → 규칙 위반 */}
</Page>

// ✅ 수정
<Page>
  <Action prominence="Standard" intent="Brand">Save</Action>
  <Action prominence="Standard" intent="Neutral">Cancel</Action>
</Page>
```

**Figma Lint**:

```typescript
// Figma Plugin이 자동 검사
function lintDesign(layers) {
  const buttons = layers.filter(l => l.type === 'Button');
  const accentButtons = buttons.filter(b => b.fill === 'accent');

  if (accentButtons.length > 1) {
    return {
      error: 'Too many accent buttons',
      suggestion: 'Use only 1 primary CTA per screen',
    };
  }
}
```

**효과**:
- ✅ 디자인 규칙 **자동 강제**
- ✅ 코드 리뷰에서 **디자인 일관성 확인**
- ✅ 신입 개발자 **실수 방지**

---

## 5. 실험적 아이디어

### 5.1 Generative Tokens (생성형 토큰)

**아이디어**: AI가 새로운 prominence/intent 조합을 생성

```typescript
// AI가 학습한 데이터:
// - 1000개 웹사이트의 버튼 디자인
// - 각 버튼의 prominence, intent, spacing, color 분석

// 요청
generateTokenCombination({
  goal: 'Create a futuristic, tech-focused design',
  constraints: {
    maxSpacing: 64,
    colorScheme: 'blue-purple gradient',
  },
});

// AI 생성 결과
{
  prominence: {
    Hero: 1.8,  // 기존 1.5보다 큼 (미래적 느낌)
    Standard: 1.0,
  },
  colors: {
    accent: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  animation: {
    Hero: 'scale-110 duration-500', // 과감한 애니메이션
  },
}
```

### 5.2 Emotion-Based Tokens

**아이디어**: 감정에 따라 토큰 자동 조정

```typescript
// 감정 → 토큰 매핑
const EMOTION_TOKENS = {
  calm: {
    prominence: { Hero: 1.2, Standard: 1.0 }, // 작은 차이
    colors: { accent: '#9CA3AF' }, // 회색 계열
    animation: { duration: 500 }, // 느린 애니메이션
  },
  energetic: {
    prominence: { Hero: 2.0, Standard: 1.0 }, // 큰 차이
    colors: { accent: '#EF4444' }, // 빨강
    animation: { duration: 100 }, // 빠른 애니메이션
  },
  professional: {
    prominence: { Hero: 1.3, Standard: 1.0 },
    colors: { accent: '#3B82F6' }, // 파랑
    spacing: { density: 1.2 }, // 여유로운 spacing
  },
};

// 사용
<ThemeProvider emotion="energetic">
  <App /> {/* 모든 버튼이 에너제틱하게 */}
</ThemeProvider>
```

### 5.3 Adaptive Tokens (사용자 행동 기반)

**아이디어**: 사용자 행동을 분석하여 토큰 자동 조정

```typescript
// 사용자가 특정 버튼을 계속 놓치는 경우
analytics.track('button-miss-rate', {
  button: 'Save',
  missRate: 0.35, // 35% 놓침
});

// Token Engine이 자동 조정
TokenEngine.adjust({
  role: 'Button',
  label: 'Save',
  adjustment: {
    prominence: 'Hero', // Standard → Hero 자동 변경
    padding: { increase: 1.2 }, // padding 20% 증가
  },
  reason: 'High miss rate detected',
});
```

**효과**:
- ✅ 사용자 경험을 **데이터 기반으로 개선**
- ✅ A/B 테스트 자동화
- ✅ 접근성 자동 향상

### 5.4 Collaborative Token Editing

**아이디어**: 여러 디자이너가 실시간으로 토큰 편집

```typescript
// Realtime Token Editor (Figma처럼)
<TokenEditor>
  <TokenSlider
    name="prominence.Hero"
    value={1.5}
    min={1.0}
    max={2.0}
    onChange={(value) => {
      // 실시간으로 모든 Hero 버튼 크기 변경
      broadcast('token-update', { prominence: { Hero: value } });
    }}
  />
</TokenEditor>

// 다른 디자이너 화면에 실시간 반영
// - Cursor 위치 표시
// - 누가 무엇을 수정 중인지 표시
// - Undo/Redo 지원
```

### 5.5 Token Versioning & Time Travel

**아이디어**: Git처럼 토큰 변경 이력 관리

```bash
# 토큰 변경 커밋
$ iddl commit -m "Increase Hero prominence for better CTA visibility"

# 토큰 이력 확인
$ iddl log
commit a1b2c3d  (HEAD -> main)
Author: Designer <designer@acme.com>
Date: 2026-01-12

    Increase Hero prominence for better CTA visibility

    Changes:
    - prominence.Hero: 1.5 → 1.8
    - reason: A/B test showed +15% click rate

# 이전 토큰으로 롤백
$ iddl checkout a1b2c3d

# 특정 시점의 디자인 미리보기
$ iddl preview --date="2025-12-01"
```

**효과**:
- ✅ 디자인 변경 **이력 추적**
- ✅ 실험 후 **롤백** 가능
- ✅ 팀원과 **변경 사항 공유**

---

## 6. 커뮤니티 피드백 반영

### 6.1 피드백 수집 메커니즘

#### In-App Feedback

```tsx
// 모든 IDDL 컴포넌트에 피드백 버튼 (Dev Mode)
<Action prominence="Standard" intent="Brand">
  Click me
  {process.env.NODE_ENV === 'development' && (
    <FeedbackButton
      componentType="Action"
      props={{ prominence: 'Standard', intent: 'Brand' }}
      onFeedback={(feedback) => {
        // 피드백 자동 수집
        sendFeedback({
          message: feedback.message,
          tokens: feedback.generatedTokens,
          expectedTokens: feedback.expectedTokens,
        });
      }}
    />
  )}
</Action>
```

#### GitHub Discussions Integration

```markdown
# IDDL Token Engine - Community Feedback

## Spacing Issues
- [#123] Hero × Comfortable gap too large (36px → 32px snap)
  - Votes: 45 👍
  - Status: Under Review

## New Feature Requests
- [#234] Support for custom prominence levels
  - Votes: 89 👍
  - Status: Planned for v4.0
```

### 6.2 Community-Driven Presets

**아이디어**: 커뮤니티가 토큰 프리셋 공유

```typescript
// @iddl/presets (NPM 패키지)
import { slackPreset } from '@iddl/presets/slack';
import { notionPreset } from '@iddl/presets/notion';
import { linearPreset } from '@iddl/presets/linear';

// 사용
<TokenEngineProvider preset={slackPreset}>
  <App /> {/* Slack 스타일 디자인 자동 적용 */}
</TokenEngineProvider>
```

**Preset 예시**:
```typescript
// slack-preset.ts
export const slackPreset = {
  name: 'Slack Design System',
  author: '@slack-community',
  spacing: {
    prominenceFactors: {
      Hero: 1.4,  // Slack은 Hero가 덜 두드러짐
      Standard: 1.0,
    },
    densityFactors: {
      Compact: 0.7, // Slack은 매우 조밀함
    },
  },
  colors: {
    accent: '#611f69', // Slack Purple
  },
};
```

### 6.3 Plugin Ecosystem

**비전**: 서드파티 플러그인으로 Token Engine 확장

```typescript
// @iddl/plugin-glassmorphism
import { glassmorphismPlugin } from '@iddl/plugin-glassmorphism';

TokenEngine.use(glassmorphismPlugin, {
  intensity: 0.8,
  blur: 'xl',
});

// 모든 Card/Modal에 glassmorphism 자동 적용
<Block role="Card"> {/* bg-white/80 backdrop-blur-xl */}
```

**Plugin API**:
```typescript
interface IDDLPlugin {
  name: string;
  version: string;

  // Token 생성 후 수정
  transform(tokens: TokenOutput, input: TokenInput): TokenOutput;

  // 새로운 generator 추가
  generators?: {
    [key: string]: (input: TokenInput) => any;
  };
}
```

---

## 요약 및 로드맵

### Priority Matrix

| 제안 | 영향도 | 난이도 | 우선순위 | 예상 시간 |
|------|--------|--------|----------|----------|
| Memoization 최적화 | High | Low | P0 | 1주 |
| Dev Tools 개선 | High | Medium | P0 | 2주 |
| Type-safe Override | High | Low | P0 | 1주 |
| Documentation Generator | Medium | Low | P1 | 1주 |
| Adaptive Snapping | High | Medium | P1 | 3주 |
| Animation Tokens | Medium | Medium | P1 | 2주 |
| Multi-Theme Support | Medium | Medium | P2 | 4주 |
| SSG Token Generation | High | Medium | P2 | 3주 |
| AI-Powered Inference | Low | High | P3 | 3개월 |
| Cross-Framework | High | High | P3 | 6개월 |
| Visual Programming | Medium | High | P4 | 6개월 |

### Roadmap

#### Q1 2026 (단기)
- ✅ Memoization 최적화
- ✅ Dev Tools 개선 (Browser Extension)
- ✅ Type-safe Override System
- ✅ Documentation Generator

**예상 효과**:
- 성능 20% 향상
- DX 대폭 개선
- 문서 자동화

#### Q2 2026 (중기)
- ✅ Adaptive Snapping
- ✅ Animation Tokens
- ✅ Multi-Theme Support
- ✅ Tailwind Plugin 통합

**예상 효과**:
- Snapping 정확도 30% 향상
- 애니메이션 일관성 확보
- 테마 전환 가능

#### Q3-Q4 2026 (장기)
- ✅ SSG Token Generation
- ✅ AI-Powered Inference (실험)
- ✅ Cross-Framework Support 시작
- ✅ Figma Plugin v1.0

**예상 효과**:
- SSR/SSG 완벽 지원
- AI로 생산성 50% 향상
- Vue, Svelte 지원

#### 2027+ (비전)
- ✅ Design System as Code
- ✅ Visual Programming Interface
- ✅ Design Lint Integration
- ✅ Community Plugin Ecosystem

**예상 효과**:
- 범용 디자인 시스템 플랫폼
- 코드 없이 디자인 가능
- 커뮤니티 주도 발전

---

**작성일**: 2026-01-12
**작성자**: Claude (AI Assistant)
**버전**: Token Engine Future Proposals v1.0
**다음 리뷰**: 2026-03-01
