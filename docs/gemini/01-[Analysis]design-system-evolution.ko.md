# 디자인 시스템 분석 보고서

## 1. 요약 (Executive Summary)

**Minimal Design Kit**는 유연한 CSS-in-JS 스타일 시스템에서 **엄격한 제약 기반(constraint-based) 디자인 시스템**으로 진화하고 있습니다.

핵심 철학은 **"코드를 통한 강제(Enforcement by Code)"**로 변화했습니다:
- **`Frame.tsx`**: 이제 개발자가 임의의 CSS 값(예: `margin: "10px"`, `width: "50%"`)을 사용하는 것을 **능동적으로 차단**합니다.
- **`token.const.1tier.ts`**: **Branded Types**를 도입하여, TypeScript 컴파일 단계에서 오직 유효한 디자인 토큰만이 속성으로 전달될 수 있도록 강제합니다.

이러한 전환의 목표는 "매직 넘버(magic numbers)"를 제거하고, 애플리케이션 전반에 걸쳐 픽셀 단위의 일관성을 보장하며, 모든 시각적 의사결정을 토큰 레지스트리로 중앙화하여 기술 부채를 줄이는 것입니다.

---

## 2. 컴포넌트 분석: `Frame.tsx`

`Frame`은 단순한 UI 컴포넌트가 아니라, 디자인 시스템의 **문지기(Gatekeeper)**이자 모든 레이아웃의 기본 구성 요소입니다.

### 핵심 메커니즘: "필터링(The Blocker)"
최근 변경 사항(Git 기록 분석)에 따르면, `style` 속성에서 "위험한" 속성들을 제거하는 필터링 메커니즘이 도입되었습니다.

```typescript
// Frame.tsx (로직 단순화)
const {
  width, height, margin, padding, gap, opacity, borderRadius, ...safeUserStyle
} = props.style;

// 결과: 'safeUserStyle'에는 위 속성들이 포함되지 않습니다.
// 개발자는 반드시 전용 속성(w, h, p, gap)을 사용해야 하며, 이는 토큰 사용을 강제합니다.
```

### 최근 진화 과정 (Git History)
1.  **사이즈 차단**: `width`, `height`, `min/max` 크기 속성이 필터링됩니다.
2.  **여백 차단**: `margin`이 차단되어 레이아웃에는 `gap`(내부 여백)이나 명시적인 `Divider` 컴포넌트 사용을 유도합니다. `padding` 또한 차단되어 `p` 속성 사용을 강제합니다.
3.  **시각 효과 차단**: `opacity`, `borderRadius` (`rounded`), `boxShadow`가 차단되어 각각에 해당하는 토큰 사용을 강제합니다.

### 설계 의도
- **레이아웃**: `margin`(외부 여백) 중심에서 `gap`(내부 여백) 및 Flex/Grid 패턴으로 이동합니다.
- **시각 효과**: 모든 라운드값, 그림자, 투명도가 시스템 토큰에서 나오도록 보장합니다.

---

## 3. 토큰 시스템 분석: `token.const.1tier.ts`

"1-Tier" 토큰 시스템은 속도와 정밀함을 위해 설계된 **플랫한 숫자 기반 스케일**을 의미합니다.

### 타입 안전성 (Branded Types)
이 시스템은 정교한 TypeScript 패턴을 사용하여 원시 숫자(raw number)의 우발적인 사용을 방지합니다.

```typescript
// TypeScript에 의한 강제
px(Space.n8); // ✅ 유효함
px(8);        // ❌ 컴파일 에러: number는 SpaceToken에 할당할 수 없음
```

### 토큰 카테고리
- **Space (여백)**: 패딩/간격을 위한 선형 스케일 (2, 4, 8... 160).
- **Sizes (크기)**: 숫자 단계와 키워드(`full`, `screen`, `min`/`max`)의 조합.
- **Visuals (시각)**: `Opacity`, `Radius`, `Shadow`, `ZIndex`에 대한 세밀한 제어.
- **Text (텍스트)**: `FontSize`와 `LineHeight`가 분리되어 미세 조정 가능.

---

## 4. 진화 방향 (Evolution & Future Direction)

### 1단계: 유연성 (과거)
초기의 `Frame`은 `div`에 Flexbox 편의 기능을 더한 래퍼(wrapper) 역할이었으며, `style` 속성을 통한 완전한 CSS 오버라이딩을 허용했습니다.

### 2단계: 강제 (현재)
현재는 과도기적 단계로 다음과 같은 특징을 보입니다:
1.  **엄격함 강화**: `Frame` 컴포넌트가 임의의 값 입력을 거부하도록 업데이트되고 있습니다.
2.  **마이그레이션**: 기존 코드가 리팩토링되고 있습니다 (예: `260px` → `Size.n256`, `margin: 0 auto` → `pack` 속성).
3.  **교육적인 도구**: 코드가 곧 가이드가 됩니다. `style={{ marginTop: 10 }}`을 입력하면 작동하지 않으므로, 개발자는 자연스럽게 올바른 API를 찾게 됩니다.

### 3단계: "성공의 구덩이 (The Pit of Success)" (미래)
궁극적인 방향은 **"나쁜" UI 코드를 작성하는 것이 "좋은" UI 코드를 작성하는 것보다 더 어려운 상태**를 만드는 것입니다.

- **자동완성 주도 개발 (AutoComplete Driven Development)**: 개발자는 토큰 값을 찾기 위해 IDE 자동완성에 크게 의존하게 될 것입니다.
- **레이아웃 변형 제로 (Zero Layout Drift)**: 모든 값이 토큰이므로, 서로 다른 개발자가 만든 페이지도 완벽하게 정렬됩니다.
- **테마화 (Themability)**: 값들이 CSS 변수(`var(--space-n8)`)로 고정되므로, React 코드를 수정하지 않고도 CSS 변수만 업데이트하여 애플리케이션 전체의 룩앤필을 즉시 변경할 수 있습니다.

## 5. 변경 사항 요약

| 기능 | 이전 상태 | 현재/미래 상태 |
| :--- | :--- | :--- |
| **여백 (Spacing)** | `style` 속성의 `margin`, `padding` | `SpaceToken`을 사용하는 `gap`, `p` 속성 |
| **크기 (Sizing)** | 임의의 `px` / `%` 값 | `SizeToken` / `ContainerSizeToken` |
| **투명도 (Opacity)** | `0` ~ `1` 숫자 | `OpacityToken` (5단위 스케일) |
| **오버라이드** | `style` 속성으로 모든 것 허용 | `style` 필터링됨; 특정 토큰 사용 시 `override` 속성 필수 |
| **철학** | 설정보다 관습 (Convention over Configuration) | **컴파일러에 의한 설정 강제 (Configuration enforced by Compiler)** |
