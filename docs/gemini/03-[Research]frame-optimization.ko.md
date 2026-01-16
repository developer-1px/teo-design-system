# Frame 제한 코드 최적화 연구 (Frame Style Optimization Research)

## 문제 정의 (Problem Statement)
현재 `Frame.tsx` 구현은 30여 개의 속성을 수동으로 구조 분해하여 `style` 속성에서 차단하고 있습니다. 이로 인해 컴포넌트 코드에 약 80줄의 노이즈가 추가되어 가독성과 유지보수성이 저하되고, 속성이 늘어날수록 코드가 비대해지는 문제가 있습니다.

## 최적화 전략 (Optimization Strategies)

### 1. 추출 패턴 (추천)
필터링 로직을 별도의 유틸리티 함수로 이동시킵니다.

**장점:**
- `Frame.tsx`가 획기적으로 깔끔해집니다.
- 런타임 안전성을 유지하며 재사용 가능합니다.

**단점:**
- 로직이 사라지는 것이 아니라 이동할 뿐입니다 (총 코드량은 비슷).

**예시:**
```typescript
// styleUtils.ts
export function sanitizeStyle(style: React.CSSProperties) {
  const { width, height, margin, padding, ...safe } = style;
  return safe;
}

// Frame.tsx
const safeUserStyle = sanitizeStyle(style);
```

### 2. Lint 전용 강제 (런타임 비용 제로)
런타임 차단을 완전히 제거하고, ESLint 규칙에만 의존하여 사용을 방지합니다.

**장점:**
- `Frame.tsx` 코드가 극도로 최소화됩니다.
- 런타임 성능 비용이 없습니다.

**단점:**
- **안전성 저하**: 개발자가 린트를 무시하거나 `any`로 캐스팅하면 제한된 스타일이 DOM으로 누수되어 디자인 일관성이 깨집니다.
- 커스텀 ESLint 설정이 필요합니다.

### 3. 타입 레벨 제외 (Type-Level Exclusion)
`style` 속성 타입을 `Omit<React.CSSProperties, "width" | "height" ...>`으로 재정의합니다.

**장점:**
- 사용 시점에 TypeScript 에러가 즉시 발생합니다.
- 런타임 코드가 추가되지 않습니다.

**단점:**
- Lint 방식과 마찬가지로, `any` 캐스팅이나 동적 객체에 대해 런타임 보장을 제공하지 못합니다.

## 제안 (Recommendation)
**전략 1 (추출 패턴)을 구현하세요.**
디자인 시스템의 목표는 **엄격한 강제**입니다. "Gatekeeper(문지기)로서의 코드" 철학을 지키기 위해서는 런타임 차단이 필수적입니다. 복잡한 로직을 유틸리티 파일로 이동시키면, 보안(강제성)을 유지하면서도 컴포넌트 코드를 깨끗하게 만들 수 있습니다.
