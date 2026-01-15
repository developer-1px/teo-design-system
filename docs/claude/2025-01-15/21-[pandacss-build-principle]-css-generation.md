# PandaCSS 빌드타임 정적 CSS 생성 원리

> **주제**: PandaCSS는 어떻게 빌드타임에 정적 CSS를 생성하는가?
> **형식**: 기술 대화록
> **날짜**: 2025-01-15

---

## Act 1: 핵심 철학 - "런타임 제로, 빌드타임에 모든 것을"

### Alex (PandaCSS 아키텍트)
PandaCSS의 가장 큰 특징은 **Zero-runtime**이에요. 브라우저에서 CSS를 생성하지 않습니다. 모든 스타일은 빌드 시점에 정적 CSS 파일로 변환됩니다.

### Sarah (개발자)
그럼 런타임 CSS-in-JS 라이브러리(styled-components, emotion)와 어떻게 다른가요?

### Alex
런타임 라이브러리는:
1. 브라우저에서 JS → CSS 변환 (성능 비용)
2. 스타일 주입을 위한 런타임 코드 (번들 크기 증가)
3. 동적 스타일 생성 가능 (유연성)

PandaCSS는:
1. 빌드 시점에 JS → CSS 변환 (브라우저는 순수 CSS만 받음)
2. 런타임 코드 제로 (번들 크기 최소화)
3. 정적 추출로 예측 가능한 CSS (일관성)

**트레이드오프**: 동적 스타일은 CSS 변수로 해결해야 함

---

## Act 2: 5단계 빌드 프로세스

### Sarah
구체적으로 어떤 단계를 거쳐서 CSS가 생성되나요?

### Alex
5단계 파이프라인을 거칩니다:

#### 1단계: 정적 분석 (Static Analysis)
```typescript
// 소스 코드
import { css } from '../styled-system/css'

const Button = () => (
  <button className={css({ bg: 'blue.500', px: '4' })}>
    Click me
  </button>
)
```

**빌드 도구가 하는 일**:
- 모든 `.tsx`, `.ts`, `.jsx`, `.js` 파일 스캔
- `css()`, `cva()`, `styled()` 함수 호출 찾기
- 설정 파일에서 지정한 패턴 매칭

#### 2단계: AST 파싱 (Abstract Syntax Tree Parsing)
```typescript
// AST 노드 예시
{
  type: "CallExpression",
  callee: { name: "css" },
  arguments: [{
    type: "ObjectExpression",
    properties: [
      { key: "bg", value: "blue.500" },
      { key: "px", value: "4" }
    ]
  }]
}
```

**빌드 도구가 하는 일**:
- Babel/SWC를 사용해 코드를 AST로 파싱
- `css()` 함수의 인자 객체 추출
- 정적으로 분석 가능한 값만 처리 (변수는 제외)

#### 3단계: 스타일 속성 추출 (Style Property Extraction)
```typescript
// 추출된 스타일 맵
{
  bg: 'blue.500',    // → background: var(--colors-blue-500)
  px: '4'            // → padding-left: var(--spacing-4), padding-right: var(--spacing-4)
}
```

**빌드 도구가 하는 일**:
- 단축 속성 확장 (`px` → `paddingLeft` + `paddingRight`)
- 토큰 참조 해석 (`blue.500` → `var(--colors-blue-500)`)
- CSS 속성명 변환 (`bg` → `background`)

#### 4단계: 원자적 CSS 생성 (Atomic CSS Generation)
```css
/* 생성된 CSS */
@layer utilities {
  .bg_blue\.500 {
    background: var(--colors-blue-500);
  }

  .px_4 {
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }
}
```

**빌드 도구가 하는 일**:
- 각 스타일 속성을 원자적 클래스로 변환
- 클래스명 해싱 (충돌 방지)
- Cascade Layers로 우선순위 관리

#### 5단계: 빌드 도구 통합 (Build Tool Integration)
```typescript
// 변환된 소스 코드
const Button = () => (
  <button className="bg_blue.500 px_4">
    Click me
  </button>
)
```

**빌드 도구가 하는 일**:
- 원본 코드에서 `css()` 호출 제거
- 생성된 클래스명으로 대체
- 최종 CSS 파일 출력 (`styled-system/styles.css`)

---

## Act 3: Cascade Layers - 우선순위 관리 시스템

### Sarah
여러 스타일이 충돌하면 어떻게 되나요?

### Alex
PandaCSS는 **CSS Cascade Layers**를 사용해 명확한 우선순위를 정의합니다:

```css
/* 생성된 CSS 구조 */
@layer reset, base, tokens, recipes, utilities;

/* Layer 1: Reset (가장 낮은 우선순위) */
@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
  }
}

/* Layer 2: Base */
@layer base {
  html {
    font-family: system-ui;
    line-height: 1.5;
  }
}

/* Layer 3: Tokens (CSS 변수) */
@layer tokens {
  :where(:root, :host) {
    --colors-blue-500: #3b82f6;
    --spacing-4: 1rem;
  }
}

/* Layer 4: Recipes (컴포넌트 스타일) */
@layer recipes {
  .button {
    padding: var(--spacing-4);
    border-radius: 0.375rem;
  }
}

/* Layer 5: Utilities (가장 높은 우선순위) */
@layer utilities {
  .bg_blue\.500 {
    background: var(--colors-blue-500);
  }
}
```

### Sarah
이렇게 하면 뭐가 좋은가요?

### Alex
세 가지 장점:

1. **명시성 제로 우선순위**
   - `!important` 불필요
   - Layer 순서만으로 우선순위 결정
   - `utilities` > `recipes` > `tokens` > `base` > `reset`

2. **예측 가능한 오버라이드**
   ```tsx
   // Recipe 스타일
   <Button className={button()}>Click</Button>

   // Utility로 오버라이드 (항상 이김)
   <Button className={button() + ' ' + css({ bg: 'red.500' })}>
     Click
   </Button>
   ```

3. **명세도 전쟁 종료**
   - 모든 클래스가 단일 클래스 명세도 (0,0,1,0)
   - Layer 순서가 곧 우선순위

---

## Act 4: 최적화 기법 - 트리 쉐이킹과 클래스 해싱

### Sarah
사용하지 않는 스타일은 어떻게 제거하나요?

### Alex
**정적 추출의 핵심 장점**이 여기 있습니다:

#### 1. 완벽한 트리 쉐이킹
```typescript
// Button.tsx
const button = css({ bg: 'blue.500', px: '4' })

// Card.tsx (사용 안 함)
const unused = css({ bg: 'red.500', py: '8' })
```

**빌드 결과**:
```css
/* red.500과 py_8은 생성되지 않음 */
@layer utilities {
  .bg_blue\.500 { background: var(--colors-blue-500); }
  .px_4 { padding-inline: var(--spacing-4); }
}
```

런타임 CSS-in-JS는 불가능한 최적화입니다.

#### 2. 클래스명 해싱
```css
/* 개발 환경 */
.bg_blue\.500 { ... }
.px_4 { ... }

/* 프로덕션 환경 */
.a { ... }
.b { ... }
```

**효과**:
- CSS 파일 크기 40% 감소
- 브라우저 파싱 속도 향상
- 클래스명 충돌 완전 방지

#### 3. CSS 변수 최적화
```css
/* 비효율적 */
.text-blue-500 { color: #3b82f6; }
.bg-blue-500 { background: #3b82f6; }
.border-blue-500 { border-color: #3b82f6; }

/* PandaCSS 방식 */
:root { --colors-blue-500: #3b82f6; }
.text-blue-500 { color: var(--colors-blue-500); }
.bg-blue-500 { background: var(--colors-blue-500); }
.border-blue-500 { border-color: var(--colors-blue-500); }
```

**효과**:
- 색상 값 중복 제거
- 테마 전환 가능 (CSS 변수 오버라이드)
- Gzip 압축률 향상 (반복 패턴)

---

## Act 5: 타입 안전성 - TypeScript 통합

### Sarah
TypeScript와 어떻게 통합되나요?

### Alex
PandaCSS는 **빌드 시점에 타입 정의를 자동 생성**합니다:

#### 1. 토큰 타입 생성
```typescript
// panda.config.ts
export default defineConfig({
  theme: {
    tokens: {
      colors: {
        blue: { 500: { value: '#3b82f6' } }
      }
    }
  }
})

// 자동 생성: styled-system/tokens.d.ts
type ColorToken = 'blue.500' | 'blue.600' | ...
```

#### 2. CSS 함수 타입 체크
```typescript
// ✅ 타입 체크 통과
css({ bg: 'blue.500' })

// ❌ 타입 에러: 'blue.999' does not exist in type 'ColorToken'
css({ bg: 'blue.999' })

// ❌ 타입 에러: Property 'invalid' does not exist
css({ invalid: 'value' })
```

#### 3. Recipe 타입 체크
```typescript
const button = cva({
  variants: {
    size: {
      sm: { px: '3' },
      lg: { px: '6' }
    }
  }
})

// ✅ 타입 체크 통과
<Button className={button({ size: 'sm' })} />

// ❌ 타입 에러: 'xl' is not assignable to type 'sm' | 'lg'
<Button className={button({ size: 'xl' })} />
```

### Sarah
이게 왜 중요한가요?

### Alex
세 가지 보장:

1. **토큰 일관성 보장**
   - 존재하지 않는 토큰 사용 불가
   - 오타 방지
   - 리팩토링 안전성

2. **빌드 타임 검증**
   - 런타임 에러 → 컴파일 에러
   - IDE 자동완성
   - 빠른 피드백 루프

3. **문서화 자동화**
   - 타입 정의가 곧 API 문서
   - 팀원 온보딩 시간 단축
   - 디자인 토큰 탐색 용이

---

## Act 6: 전체 플로우 다이어그램

### Alex
전체 프로세스를 한눈에 보면:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. 개발 단계 (Development)                                       │
├─────────────────────────────────────────────────────────────────┤
│ Button.tsx                                                       │
│   ↓                                                              │
│ import { css } from '../styled-system/css'                      │
│ const styles = css({ bg: 'blue.500', px: '4' })                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. 빌드 시작 (Build Start)                                       │
├─────────────────────────────────────────────────────────────────┤
│ $ pnpm build                                                     │
│   ↓                                                              │
│ Vite Plugin 실행                                                 │
│   ↓                                                              │
│ PandaCSS Compiler 시작                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. 정적 분석 (Static Analysis)                                   │
├─────────────────────────────────────────────────────────────────┤
│ 파일 스캔:                                                       │
│ - src/**/*.{ts,tsx,js,jsx}                                      │
│ - 패턴 매칭: css(...), cva(...), styled(...)                    │
│                                                                  │
│ 발견:                                                            │
│ - Button.tsx: css({ bg: 'blue.500', px: '4' })                 │
│ - Card.tsx: css({ p: '6', rounded: 'lg' })                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. AST 파싱 (AST Parsing)                                        │
├─────────────────────────────────────────────────────────────────┤
│ Babel/SWC 파서:                                                  │
│   ↓                                                              │
│ CallExpression(css)                                              │
│   arguments: [                                                   │
│     ObjectExpression {                                           │
│       bg: Literal('blue.500'),                                   │
│       px: Literal('4')                                           │
│     }                                                            │
│   ]                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. 스타일 추출 & 변환 (Style Extraction & Transform)             │
├─────────────────────────────────────────────────────────────────┤
│ 입력: { bg: 'blue.500', px: '4' }                               │
│   ↓                                                              │
│ 단축 속성 확장:                                                  │
│ - px: '4' → paddingLeft: '4', paddingRight: '4'                │
│   ↓                                                              │
│ 토큰 해석:                                                       │
│ - blue.500 → var(--colors-blue-500)                             │
│ - 4 → var(--spacing-4)                                          │
│   ↓                                                              │
│ CSS 속성 변환:                                                   │
│ - bg → background                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. 원자적 CSS 생성 (Atomic CSS Generation)                       │
├─────────────────────────────────────────────────────────────────┤
│ 각 속성 → 원자적 클래스:                                         │
│                                                                  │
│ @layer utilities {                                               │
│   .bg_blue\.500 {                                                │
│     background: var(--colors-blue-500);                          │
│   }                                                              │
│   .px_4 {                                                        │
│     padding-inline: var(--spacing-4);                            │
│   }                                                              │
│ }                                                                │
│                                                                  │
│ 클래스명 해싱 (프로덕션):                                        │
│ - .bg_blue\.500 → .a                                             │
│ - .px_4 → .b                                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. 코드 변환 (Code Transform)                                    │
├─────────────────────────────────────────────────────────────────┤
│ 변환 전:                                                         │
│ const styles = css({ bg: 'blue.500', px: '4' })                │
│                                                                  │
│ 변환 후:                                                         │
│ const styles = 'bg_blue.500 px_4'                               │
│                                                                  │
│ (프로덕션: const styles = 'a b')                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. CSS 파일 출력 (CSS Output)                                    │
├─────────────────────────────────────────────────────────────────┤
│ styled-system/styles.css:                                        │
│                                                                  │
│ @layer reset, base, tokens, recipes, utilities;                 │
│                                                                  │
│ @layer tokens {                                                  │
│   :root {                                                        │
│     --colors-blue-500: #3b82f6;                                  │
│     --spacing-4: 1rem;                                           │
│   }                                                              │
│ }                                                                │
│                                                                  │
│ @layer utilities {                                               │
│   .bg_blue\.500 { background: var(--colors-blue-500); }         │
│   .px_4 { padding-inline: var(--spacing-4); }                   │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. 최적화 (Optimization)                                         │
├─────────────────────────────────────────────────────────────────┤
│ - 사용되지 않는 클래스 제거 (Tree Shaking)                       │
│ - 클래스명 압축 (.bg_blue\.500 → .a)                            │
│ - CSS 변수 최적화                                                │
│ - Minification (공백 제거, 속성 단축)                            │
│ - Gzip 압축                                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. 최종 번들 (Final Bundle)                                     │
├─────────────────────────────────────────────────────────────────┤
│ dist/                                                            │
│ ├── index.html                                                   │
│ ├── assets/                                                      │
│ │   ├── index-a3f5b2c8.js  (런타임 CSS 코드 제로)              │
│ │   └── index-7d4e9f1a.css (순수 정적 CSS)                     │
│                                                                  │
│ 브라우저 로드:                                                   │
│ <link rel="stylesheet" href="index-7d4e9f1a.css">               │
│ → 즉시 파싱, 런타임 비용 제로                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Act 7: MDK와의 비교 - 런타임 vs 빌드타임

### Sarah
MDK는 어떻게 다른가요?

### Alex
근본적으로 다른 접근입니다:

### PandaCSS 접근 (빌드타임)
```typescript
// 개발 시
<Frame surface="raised" p={4} />

// 빌드 후
<div className="bg_raised px_4" />

// CSS (빌드타임 생성)
.bg_raised { background: var(--surface-raised); }
.px_4 { padding: var(--spacing-4); }
```

**특징**:
- CSS 생성: 빌드 시점
- 런타임 비용: 제로
- 유연성: 정적 값만 가능
- 번들 크기: CSS만 (JS 제로)

### MDK 접근 (런타임)
```typescript
// 개발 시
<Frame surface="raised" p={4} />

// 빌드 후 (변환 없음)
<Frame surface="raised" p={4} />

// 컴포넌트 내부 (런타임)
style={{
  background: 'var(--surface-raised)',
  padding: 'var(--space-4)'
}}
```

**특징**:
- CSS 생성: 런타임 (브라우저)
- 런타임 비용: Props → Style 변환
- 유연성: 동적 값 가능
- 번들 크기: JS 로직 포함

### 성능 비교

| 측면 | PandaCSS (빌드타임) | MDK (런타임) |
|------|---------------------|--------------|
| **초기 로드** | 빠름 (CSS만 파싱) | 보통 (JS 평가 필요) |
| **리렌더링** | 매우 빠름 (CSS 재사용) | 빠름 (인라인 스타일) |
| **번들 크기** | 작음 (CSS만) | 중간 (JS + CSS) |
| **캐싱** | 완벽 (정적 CSS) | 제한적 (동적 로직) |
| **동적 스타일** | 제한적 (CSS 변수) | 완전 지원 |

---

## Act 8: 실제 빌드 명령어 흐름

### Sarah
실제로 명령어를 실행하면 어떤 일이 일어나나요?

### Alex
단계별로 보겠습니다:

#### 1. Panda CLI 명령어
```bash
# 1) 설정 파일 기반으로 styled-system 생성
$ panda codegen

# 출력:
# ✔ Generated styled-system
# - styled-system/css/index.d.ts
# - styled-system/css/index.js
# - styled-system/tokens/index.d.ts
# - styled-system/patterns/index.d.ts
# ...
```

**역할**:
- 설정 파일 (`panda.config.ts`) 읽기
- 타입 정의 생성
- Helper 함수 생성 (`css`, `cva`, `styled`)
- 토큰 파일 생성

#### 2. Vite/Webpack 플러그인 통합
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import pandacss from '@pandacss/dev/vite'

export default defineConfig({
  plugins: [
    pandacss()  // PandaCSS 플러그인 추가
  ]
})
```

**빌드 시 흐름**:
```
$ pnpm build
  ↓
Vite 시작
  ↓
PandaCSS Plugin 실행
  ↓
소스 파일 스캔 (src/**/*.tsx)
  ↓
css() 호출 추출
  ↓
CSS 생성 (styled-system/styles.css)
  ↓
코드 변환 (css() → 클래스명)
  ↓
Vite 번들링 계속
  ↓
최종 빌드 완료
```

#### 3. Watch 모드
```bash
$ panda --watch

# 파일 변경 감지:
# - Button.tsx에 css({ bg: 'red.500' }) 추가
#   ↓
# - AST 파싱
#   ↓
# - .bg_red\.500 클래스 생성
#   ↓
# - styles.css 업데이트
#   ↓
# - HMR (Hot Module Replacement)
```

---

## Act 9: 한계와 트레이드오프

### Sarah
빌드타임 생성의 한계는 없나요?

### Alex
물론 있습니다. 트레이드오프를 이해해야 합니다:

### 한계 1: 동적 값 불가
```typescript
// ❌ 불가능: 빌드 시점에 알 수 없음
const dynamicColor = getUserPreference()
css({ bg: dynamicColor })

// ✅ 해결책: CSS 변수 사용
<div
  className={css({ bg: 'var(--user-color)' })}
  style={{ '--user-color': dynamicColor }}
/>
```

### 한계 2: 정적 분석 요구
```typescript
// ❌ 불가능: 스프레드는 정적 분석 불가
const styles = { bg: 'blue.500' }
css({ ...styles })

// ✅ 해결책: 직접 작성
css({ bg: 'blue.500' })
```

### 한계 3: 빌드 시간 증가
```typescript
// 대규모 프로젝트:
// - 1000개 파일 스캔
// - 10000개 css() 호출 추출
// - 빌드 시간: +5-10초
```

**완화 방법**:
- 증분 빌드 (변경된 파일만)
- 병렬 처리
- 캐싱

### 한계 4: IDE 지원 제한
```typescript
// 타입은 생성되지만...
css({ bg: 'blue.500' })
     // ^ 자동완성은 IDE 플러그인 필요
```

**MDK 접근의 장점**:
- 완전한 동적 스타일링
- 빌드 도구 의존성 없음
- 단순한 Props 기반 API
- IDE 지원 기본 제공

---

## Act 10: 결론 - 언제 PandaCSS를 선택할까?

### Alex
PandaCSS는 이런 경우에 최적입니다:

#### ✅ 선택해야 할 때
1. **성능이 중요한 경우**
   - 대규모 앱 (1000+ 컴포넌트)
   - 모바일 타겟
   - SEO 중요 (SSR/SSG)

2. **타입 안전성이 필수인 경우**
   - 대형 팀 협업
   - 디자인 시스템 엄격한 준수
   - 리팩토링 빈번

3. **번들 크기가 중요한 경우**
   - 런타임 CSS-in-JS 라이브러리 제거
   - JS 번들 최소화
   - 정적 사이트

#### ❌ 피해야 할 때
1. **동적 스타일이 많은 경우**
   - 사용자 커스터마이징 UI
   - 실시간 테마 생성
   - 데이터 기반 스타일링

2. **빠른 프로토타이핑**
   - 디자인 토큰 미확정
   - 빈번한 스타일 변경
   - 빌드 도구 설정 부담

3. **간단한 프로젝트**
   - 소규모 앱 (< 50 컴포넌트)
   - 성능이 이슈가 아님
   - 인라인 스타일로 충분

### Sarah
MDK는 어떤 경우에 더 나은가요?

### Alex
MDK의 강점:

1. **학습과 추론 중심**
   - WHY-first 철학
   - AI 친화적 구조
   - 의사결정 프레임워크

2. **유연성과 단순성**
   - 빌드 도구 불필요
   - 동적 스타일 자유로움
   - Props 기반 직관성

3. **디자인 시스템 교육**
   - 13 카테고리 이해
   - Intent 시스템 학습
   - 일관성 훈련

**최고의 시나리오**: PandaCSS + MDK 철학
- PandaCSS로 정적 CSS 생성 (성능)
- MDK 13 카테고리로 토큰 설계 (일관성)
- Intent 시스템으로 API 설계 (명확성)

---

## 핵심 요약

### PandaCSS 빌드 프로세스 5단계
1. **정적 분석**: 소스 파일에서 `css()` 호출 찾기
2. **AST 파싱**: 코드를 트리 구조로 분해
3. **스타일 추출**: 속성과 토큰 변환
4. **CSS 생성**: 원자적 클래스 생성
5. **코드 변환**: `css()` 호출을 클래스명으로 대체

### 핵심 원리
- **Zero-runtime**: 브라우저는 순수 CSS만 받음
- **Cascade Layers**: 명확한 우선순위 관리
- **Tree Shaking**: 사용 안 하는 스타일 자동 제거
- **Type Safety**: 빌드 시점 검증

### 트레이드오프
- 성능 ↑, 유연성 ↓
- 번들 크기 ↓, 빌드 시간 ↑
- 타입 안전 ↑, 동적 스타일 ↓

---

**작성일**: 2025-01-15
**작성자**: Alex (PandaCSS 아키텍트), Sarah (개발자)
**키워드**: #PandaCSS #빌드타임 #정적CSS생성 #AST #원자적CSS #제로런타임
