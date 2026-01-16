# TypeScript Typecheck 에러 자동 수정 보고서

**작성일**: 2026-01-16
**초기 에러**: 134개
**최종 에러**: 122개
**자동 수정**: 12개
**자동 수정률**: 8.9%

---

## 요약

design-lint의 auto-fix 기능을 확장하여 `RestrictedFrameStyle` 위반 에러를 자동으로 수정하는 시스템을 구축했습니다.

### 핵심 개선사항

1. **opacity, zIndex 토큰 매핑** 추가
2. **자동 import 추가** 기능 구현
3. **에러 처리** 개선 (주석이 있는 style 객체 스킵)

---

## 구현 내용

### 1. 토큰 매핑 테이블 추가

```typescript
// Opacity 매핑 (0 ~ 1 → Opacity.n0 ~ Opacity.n100)
const OPACITY_VALUES_TO_TOKENS: Record<string, string> = {
  "0": "Opacity.n0",
  "0.05": "Opacity.n5",
  "0.5": "Opacity.n50",
  "1": "Opacity.n100",
  // ...
};

// ZIndex 매핑 (0 ~ 200 + 대형 값)
const ZINDEX_VALUES_TO_TOKENS: Record<string, string> = {
  "0": "ZIndex.n0",
  "100": "ZIndex.n100",
  "9999": "ZIndex.n200", // 매핑
  // ...
};
```

### 2. 자동 Import 추가 함수

```typescript
function ensureTokenImports(
  sourceFile: any,
  requiredTokens: Set<string>, // ["Space", "Size", "ZIndex", "Opacity"]
): void {
  // 1. 기존 token import 찾기
  const importDecl = sourceFile.getImportDeclaration((imp: any) =>
    imp.getModuleSpecifierValue().includes("token.const.1tier")
  );

  // 2. import 없으면 새로 생성 (상대 경로 자동 계산)
  if (!importDecl) {
    const depth = sourceFilePath.split("/src/")[1]?.split("/").length - 1 || 0;
    const relativePath = "../".repeat(depth) + "design-system/token/token.const.1tier";

    sourceFile.addImportDeclaration({
      namedImports: Array.from(requiredTokens),
      moduleSpecifier: relativePath,
    });
    return;
  }

  // 3. 있으면 필요한 토큰만 추가
  const existingImports = new Set(
    importDecl.getNamedImports().map((ni: any) => ni.getName())
  );

  for (const token of requiredTokens) {
    if (!existingImports.has(token)) {
      importDecl.addNamedImport(token);
    }
  }
}
```

### 3. 변환 예시

**Before (에러)**:
```tsx
import { Space } from "./design-system/token/token.const.1tier";

<Frame
  override={{ p: Space.n4 }}
  style={{ zIndex: 9999, opacity: 0.5, minHeight: "100vh" }}
>
```

**After (자동 수정)**:
```tsx
import { Space, ZIndex, Opacity, Size } from "./design-system/token/token.const.1tier";

<Frame
  override={{
    p: Space.n4,
    zIndex: ZIndex.n200,
    opacity: Opacity.n50,
    minHeight: Size.screen
  }}
  style={{}}
>
```

---

## 자동 수정 가능한 패턴

### ✅ 자동 수정 성공

| CSS Property | 조건 | 변환 |
|---|---|---|
| `padding`, `paddingTop`, etc. | 토큰 테이블에 존재 | `Space.nX` |
| `width`, `height` | 토큰 테이블에 존재 | `Size.nX` or `Size.fill` |
| `gap` | 토큰 테이블에 존재 | `Space.nX` |
| `opacity` | 0 ~ 1 범위, 0.05 단위 | `Opacity.nX` |
| `zIndex` | 0, 1, 2, 3, 5, 10, ... 200 | `ZIndex.nX` |
| `zIndex` | 999, 9999, 99999 | `ZIndex.n200` (최댓값 매핑) |

---

## 자동 수정 불가능한 패턴

### ❌ 수동 수정 필요

#### 1. 동적 값 (조건부 표현식)
```tsx
<Frame style={{
  width: isOpen ? "240px" : "64px",
  opacity: isActive ? 1 : 0.5
}}>
```
**이유**: AST에서 ternary expression을 토큰으로 변환 불가

#### 2. 토큰 테이블에 없는 값
```tsx
<Frame style={{
  width: "350px",  // SIZE_VALUES_TO_TOKENS에 없음
  opacity: 0.45,   // OPACITY_VALUES_TO_TOKENS에 0.45 없음 (0, 0.05, 0.1, 0.15, 0.2, ...)
}}>
```
**이유**: 정확히 일치하는 토큰이 없음

#### 3. 템플릿 리터럴
```tsx
<Frame style={{ width: `${size}px` }}>
```
**이유**: 동적 값 계산 불가

#### 4. margin 속성
```tsx
<Frame style={{
  margin: "20px auto",
  marginTop: "16px"
}}>
```
**이유**: MDK에서 margin 사용 금지 (레이아웃 패턴 위반)

#### 5. 커스텀 boxShadow
```tsx
<Frame style={{
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
}}>
```
**이유**: 토큰 테이블에 정확한 매핑 없음

#### 6. 주석이 있는 style 객체
```tsx
<Frame style={{
  paddingBottom: "var(--space-n16)", // Space for scrollbar
}}>
```
**이유**: ts-morph AST 조작 시 에러 발생

---

## 남은 122개 에러 분류

### 1. RestrictedFrameStyle 위반 (약 90개)

**주요 패턴**:
- 동적 width/height 값 (`isOpen ? "240px" : "64px"`)
- 토큰 테이블에 없는 값 (`width: "350px"`)
- margin 속성 사용 (`marginTop: "16px"`)
- opacity 동적 값 (`opacity: isActive ? 1 : 0`)

**위치**:
- `src/apps/cms/` (약 40개)
- `src/apps/crm/` (약 20개)
- `src/apps/discord/` (약 10개)
- `src/inspector/` (약 5개)
- 기타 (약 15개)

### 2. border Prop 타입 에러 (약 20개)

```tsx
// 에러: border는 boolean 기대, string 전달
<Frame border="top" />
```

**해결 방법**: Frame의 border prop 타입을 `boolean | "top" | "bottom" | "left" | "right"`로 변경 필요

### 3. Hook 타입 에러 (약 10개)

```typescript
// useAccordion.ts
setExpandedSet((prev) => {  // prev implicit any
  const next = new Set(prev);
  ...
});

// useModal.ts, useTooltip.ts
ref: React.RefObject<HTMLElement | null>  // null 허용 필요
```

### 4. 기타 (약 2개)

- `NodeJS.Timeout` → `number` 변경 필요 (브라우저 환경)
- `itemToString` 미사용 변수 제거

---

## 권장 수정 순서

### 1단계: Hook 타입 에러 (10개, 쉬움)

```typescript
// useAccordion.ts:141, 167, 183
setExpandedSet((prev: Set<string>) => {
  const next = new Set(prev);
  ...
});

// useModal.ts, useTooltip.ts
ref: React.RefObject<HTMLElement | null>  // null 허용

// useTooltip.ts:122, 123
const timeoutRef = useRef<number | null>(null);  // NodeJS.Timeout → number

// useDropdown.ts:185
// itemToString 선언 제거
```

**예상 시간**: 5분

---

### 2단계: Frame border Prop 타입 확장 (20개, 중간)

```typescript
// FrameProps.ts
interface FramePresetProps {
  border?: boolean | "top" | "bottom" | "left" | "right";
  ...
}
```

**예상 시간**: 10분

---

### 3단계: RestrictedFrameStyle 위반 수동 수정 (90개, 복잡)

#### 3-1. margin → Layout 패턴으로 변경 (약 10개)

```tsx
// Before
<Frame style={{ margin: "20px auto" }}>

// After
<Frame override={{ maxWidth: ContainerSize.nX }}>
```

#### 3-2. 동적 width → Resizable 또는 CSS var 사용 (약 30개)

```tsx
// Before
<Frame style={{ width: isOpen ? "240px" : "64px" }}>

// After (옵션 1: CSS variable)
<Frame style={{ width: isOpen ? "var(--size-n240)" : "var(--size-n64)" }}>

// After (옵션 2: override with conditional)
<Frame override={{ w: isOpen ? Size.n240 : Size.n64 }}>
```

#### 3-3. 토큰 없는 값 → 가장 가까운 토큰 or 커스텀 처리 (약 50개)

**선택 1**: 가장 가까운 토큰으로 라운딩
**선택 2**: 커스텀 값이 필요하면 `style`에 남기고 에러 무시 (`@ts-expect-error`)

**예상 시간**: 2~3시간

---

## 결론

### 성과

- ✅ design-lint auto-fix 시스템 구축
- ✅ opacity, zIndex 토큰 자동 변환
- ✅ 자동 import 추가 기능
- ✅ 12개 에러 자동 수정 (8.9%)

### 한계

- ❌ 동적 값 변환 불가 (조건부, 템플릿 리터럴)
- ❌ 토큰 테이블에 없는 값 변환 불가
- ❌ margin 패턴은 아키텍처 수정 필요

### 다음 단계

**즉시 수정 가능 (30개)**:
1. Hook 타입 에러 (10개) - 5분
2. border prop 타입 (20개) - 10분

**수동 수정 필요 (90개)**:
3. RestrictedFrameStyle 위반 - 2~3시간
   - 우선순위: margin → 동적 width → 토큰 없는 값

**장기 개선**:
- Frame의 `style` prop을 완전히 제거하고 `override`만 사용하도록 마이그레이션
- 동적 값을 위한 CSS variable 시스템 구축
