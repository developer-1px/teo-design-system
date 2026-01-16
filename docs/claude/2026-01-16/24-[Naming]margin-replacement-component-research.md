# Margin 대체 컴포넌트 네이밍 조사 보고서

**Date**: 2026-01-16
**Purpose**: margin 속성을 제거하고 대체할 컴포넌트의 최적 네이밍 결정

---

## Executive Summary

업계에서는 **Divider**와 **Spacer**를 명확히 구분하여 사용:
- **Divider/Separator**: 시각적 구분선 + 의미론적 분리 (ARIA 지원)
- **Spacer**: 순수 빈 공간 (프레젠테이션만)

Chakra UI는 v3에서 **Divider → Separator**로 리네이밍하여 의미론적 역할을 강조했습니다.

---

## 1. 주요 네이밍 패턴 비교표

| 이름 | 채택 시스템 | 주요 목적 | 시각적 요소 | 의미론적 역할 | 사용 빈도 |
|------|-------------|-----------|-------------|---------------|-----------|
| **Divider** | Material UI, Ant Design, Adobe Spectrum, Polaris, Chakra v2, SwiftUI, Flutter | 콘텐츠 구분 | ✅ 선 (line) | ✅ 테마틱 브레이크 | ⭐⭐⭐⭐⭐ |
| **Separator** | Radix UI, shadcn/ui, Twilio Paste, Chakra v3 | 의미론적 분리 | ✅ 선 (line) | ✅ ARIA separator role | ⭐⭐⭐⭐ |
| **Spacer** | Chakra UI, SwiftUI, Flutter, React Native | 빈 공간 생성 | ❌ 투명 | ❌ 프레젠테이션만 | ⭐⭐⭐⭐ |
| **Space** | Ant Design | 레이아웃 간격 | ❌ 투명 | ❌ 레이아웃 유틸리티 | ⭐⭐⭐ |
| **Stack** | MUI, Chakra UI, Nord | 자식 요소 간격 | ❌ 부모 컨테이너 | ❌ 레이아웃 패턴 | ⭐⭐⭐⭐⭐ |

---

## 2. Divider vs Separator - 차이점 분석

### Divider (전통적 네이밍)

| 측면 | 설명 | 예시 |
|------|------|------|
| **정의** | "A thin line that groups content" (Material Design) | `<Divider />` |
| **시각적 특징** | 수평/수직 선 (1px solid border) | `─────────────` |
| **변형** | solid, dashed, dotted | Material UI: `variant="fullWidth"` |
| **크기** | 두께 조절 가능 | Adobe Spectrum: `size="S/M/L"` |
| **채택 시스템** | Material Design, Ant Design, Adobe Spectrum, Polaris, SwiftUI, Flutter | 가장 보편적 |
| **역사적 맥락** | HTML `<hr>` 태그의 의미론적 확장 | 웹 표준 기반 |

**Material Design 정의**:
> "Dividers are thin lines that group content in lists and containers"

**Adobe Spectrum 철학**:
> "Dividers bring clarity to a layout by grouping and dividing content in close proximity"

### Separator (현대적 네이밍)

| 측면 | 설명 | 예시 |
|------|------|------|
| **정의** | "Creates visual and semantic separation" (Twilio Paste) | `<Separator />` |
| **접근성 우선** | ARIA `role="separator"` 명시적 지원 | 스크린 리더 최적화 |
| **의미론 강조** | "Represents a thematic break" | 콘텐츠 섹션 구분 |
| **채택 시스템** | Radix UI, shadcn/ui, Twilio Paste, Chakra v3 | 현대적 디자인 시스템 |
| **마이그레이션 사례** | Chakra UI v2 → v3 리네이밍 | 접근성 향상 목적 |

**Twilio Paste 정의**:
> "A Separator is a line that creates visual and semantic separation between UI elements or sections"

**Radix UI 특징**:
- ARIA semantics 기본 내장
- 수평/수직 orientation 지원
- RTL (right-to-left) 레이아웃 지원

### 왜 Separator로 전환하는가?

**Chakra UI v3.0 마이그레이션 가이드**:
```tsx
// v2 (Old)
import { Divider } from '@chakra-ui/react'

// v3 (New)
import { Separator } from '@chakra-ui/react'
```

**전환 이유**:
1. **의미론적 명확성**: "Separator"가 ARIA role과 일치
2. **접근성 우선**: 스크린 리더 지원 강조
3. **표준 정렬**: WAI-ARIA 사양 준수

---

## 3. Spacer - 순수 여백 컴포넌트

### 정의와 목적

| 시스템 | 정의 | 특징 |
|--------|------|------|
| **Chakra UI** | "Creates adjustable, empty space" | Flex container 내 자동 확장 |
| **SwiftUI** | "Flexible space that expands along major axis" | Stack 레이아웃 전용 |
| **Flutter** | "Adjustable, empty spacer in Flex container" | `flex` 속성으로 비율 제어 |
| **React Native** | "Component whose sole purpose is to create space" | Margin 대체 패턴 |

### Spacer의 핵심 특징

```tsx
// Chakra UI 예시
<Flex>
  <Box>Left</Box>
  <Spacer />  // 남은 공간 모두 차지
  <Box>Right</Box>
</Flex>
```

**동작 원리**:
- `flex: 1` 또는 `flex-grow: 1` 자동 적용
- 형제 요소 간 균등/비균등 분배
- **시각적 요소 없음** (투명한 빈 공간)

### Spacer vs Margin - 왜 Spacer인가?

**React Native 커뮤니티 권장사항**:

| 문제 | Margin 사용 시 | Spacer 사용 시 |
|------|---------------|---------------|
| **Margin Collapse** | Flexbox에서 합산됨 (20px + 20px = 40px) | ✅ 독립적 공간 |
| **재사용성** | ❌ 컨텍스트 의존적 | ✅ 컴포넌트 독립적 |
| **명확성** | ❌ 암묵적 여백 | ✅ 명시적 의도 |
| **디버깅** | ❌ 어려움 | ✅ 시각적 확인 가능 |

**Eduardo Gómez (React Native 엔지니어)**:
> "The biggest problem with margins is that they are codependent. Spacer components provide better component reusability and maintainability."

---

## 4. Space (Ant Design) - 레이아웃 유틸리티

### 특징

```tsx
<Space size="middle" direction="vertical">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Space>
```

| 속성 | 설명 | 옵션 |
|------|------|------|
| **size** | 간격 크기 | `small`, `middle`, `large`, 커스텀 숫자 |
| **direction** | 방향 | `horizontal`, `vertical` |
| **wrap** | 줄바꿈 | `true`, `false` |
| **split** | 구분자 삽입 | React Node (예: `<Divider />`) |

### 의도

> "Set spacing between inline elements. Suitable for equidistant arrangement of multiple child elements."

**차이점**:
- **Spacer**: 단일 빈 공간 (한 곳에만)
- **Space**: 모든 자식 요소 사이에 자동 간격 (래퍼 컴포넌트)

---

## 5. Stack - Gap 기반 레이아웃 패턴

### 개념

**Stack = 자식 요소들 사이에 일정한 gap을 적용하는 레이아웃 컨테이너**

| 시스템 | API | 특징 |
|--------|-----|------|
| **Material UI** | `<Stack spacing={2}>` | Flexbox gap 사용 |
| **Chakra UI** | `<VStack spacing={4}>` | 수직 Stack |
| **Chakra UI** | `<HStack spacing={4}>` | 수평 Stack |
| **Nord Design** | `<nord-stack gap="m">` | Web Component |
| **React Native** | `react-native-spacing-system` | Stack/Queue/Inset |

### Stack vs Spacer

```tsx
// Stack 방식 (부모가 제어)
<Stack spacing={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</Stack>

// Spacer 방식 (명시적 삽입)
<Flex direction="column">
  <Box>Item 1</Box>
  <Spacer h={4} />
  <Box>Item 2</Box>
  <Spacer h={4} />
  <Box>Item 3</Box>
</Flex>
```

**Stack의 장점**:
- Top-down 접근: 부모가 일관된 간격 보장
- 자식 컴포넌트는 레이아웃 무관심
- CSS `gap` 활용으로 성능 최적화

---

## 6. Type/Variant 패턴 조사

### Divider/Separator의 Type 속성

| 디자인 시스템 | 속성명 | 옵션 | 목적 |
|--------------|--------|------|------|
| **Material UI** | `variant` | `fullWidth`, `inset`, `middle` | 너비 제어 |
| **Material UI** | `orientation` | `horizontal`, `vertical` | 방향 |
| **Ant Design** | `type` | `horizontal`, `vertical` | 방향 |
| **Ant Design** | `dashed` | `true`, `false` | 스타일 |
| **Adobe Spectrum** | `size` | `S`, `M`, `L` | 두께/계층 |
| **Adobe Spectrum** | `orientation` | `horizontal`, `vertical` | 방향 |
| **Polaris** | `borderColor` | `border`, `border-inverse`, `transparent` | 색상 |
| **Polaris** | `borderWidth` | `025` (기본값) | 두께 |
| **Radix UI** | `orientation` | `horizontal`, `vertical` | 방향 |
| **Radix UI** | `decorative` | `true`, `false` | ARIA role 제거 |

### 사용자 제안 Type 패턴 검증

**제안**: `type="space" | "dot" | "line"`

#### "space" - Spacer와 중복

업계 표준:
- ❌ Divider/Separator에 "space" type 없음
- ✅ 별도 **Spacer** 컴포넌트로 분리

**권장**: Divider와 Spacer를 별개 컴포넌트로 유지

#### "dot" - Dotted style

업계 표준:
- Material UI: `variant="dotted"` ❌ (미지원)
- Ant Design: `dashed={true}` (dashed만 지원)
- CSS: `border-style: dotted` 가능

**권장**: `variant="dotted"` 또는 `style="dotted"`

#### "line" - Solid style (기본값)

업계 표준:
- Material UI: `variant="solid"` (기본값)
- Ant Design: 기본 동작
- Adobe Spectrum: 모든 Divider는 line

**권장**: `variant="solid"` (기본값), `variant="dashed"`, `variant="dotted"`

### 최종 Type 패턴 권장안

```tsx
// 옵션 1: Material Design 스타일
<Divider variant="solid" />      // 기본 선
<Divider variant="dashed" />     // 점선
<Divider variant="dotted" />     // 도트

// 옵션 2: 간결한 스타일
<Divider />                       // 기본 선
<Divider dashed />                // 점선
<Divider dotted />                // 도트

// 옵션 3: Type 기반 (비권장)
<Divider type="line" />           // ❌ "line"은 암묵적 기본값
<Divider type="dashed" />
<Divider type="dotted" />
```

---

## 7. 특수 패턴: React Native Spacing System

### 3가지 컴포넌트 체계

**react-native-spacing-system**이 제안하는 의미론적 구분:

| 컴포넌트 | 용도 | 비유 | 방향 |
|----------|------|------|------|
| **Stack** | 수직 쌓기 | "A pile of plates at a buffet" | Vertical |
| **Queue** | 수평 나열 | "A line of people waiting" | Horizontal |
| **Inset** | 내부 여백 | "Frames around a picture" | Padding |

### 왜 이런 구분을 했는가?

**이유**:
1. **의도 명확성**: Stack vs Queue로 방향 암시
2. **의미론적 코드**: "사람들이 줄 서 있다" → Queue
3. **Padding 분리**: Inset으로 "프레임" 개념

**비판적 관점**:
- ❌ 학습 곡선 증가
- ❌ 대부분 시스템은 `orientation` prop 선호
- ✅ 하지만 의도 기반 API는 MDK 철학과 일치

---

## 8. 접근성 (Accessibility) 고려사항

### Divider vs Spacer의 의미론적 차이

| 측면 | Divider/Separator | Spacer |
|------|-------------------|--------|
| **ARIA Role** | `role="separator"` | `role="presentation"` 또는 없음 |
| **스크린 리더** | "Separator" 읽음 | 무시 |
| **의미론적 목적** | 콘텐츠 섹션 구분 | 순수 시각적 공간 |
| **언제 사용** | 테마틱 브레이크 필요 시 | 레이아웃 조정만 필요 시 |

**Duet Design System의 명확한 구분**:

> "Divider represents a thematic break and has a semantic meaning for assistive technology. **Divider should never be used for presentational purposes only**."

### Radix UI의 decorative 속성

```tsx
// 의미론적 구분선 (기본값)
<Separator />

// 순수 장식용 (ARIA role 제거)
<Separator decorative />
```

**의도**:
- `decorative={false}`: 콘텐츠 섹션 구분 (의미 있음)
- `decorative={true}`: 시각적 장식만 (의미 없음)

---

## 9. MDK를 위한 네이밍 권장사항

### Option A: Divider + Spacer (업계 표준)

```tsx
// 시각적 구분선 (의미론적)
<Divider />
<Divider orientation="vertical" />
<Divider variant="dashed" />

// 빈 공간 (프레젠테이션)
<Spacer h={4} />
<Spacer flex={1} />
```

**장점**:
- ✅ 업계 표준 (Material UI, Chakra UI, SwiftUI, Flutter 모두 사용)
- ✅ 의미론적 명확성
- ✅ 학습 곡선 낮음

**단점**:
- ❌ 두 개의 컴포넌트 필요

### Option B: Separator + Spacer (현대적)

```tsx
// 의미론적 구분 (ARIA 강조)
<Separator />
<Separator orientation="vertical" />

// 빈 공간
<Spacer h={4} />
```

**장점**:
- ✅ 접근성 우선 (Radix UI, Chakra v3)
- ✅ ARIA role과 이름 일치
- ✅ "Separator"가 더 넓은 의미

**단점**:
- ❌ Divider보다 덜 보편적 (아직 전환 중)

### Option C: Gap 기반 (Stack 활용)

```tsx
// 부모가 간격 제어
<Frame gap={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Frame>

// 명시적 구분선만 컴포넌트화
<Divider />
```

**장점**:
- ✅ CSS gap 활용 (성능 최적화)
- ✅ Top-down 간격 관리
- ✅ Spacer 컴포넌트 불필요

**단점**:
- ❌ 개별 간격 조정 어려움
- ❌ 동적 간격 패턴 복잡

### Option D: 통합 컴포넌트 (비권장)

```tsx
<Divider type="space" />   // ❌ 혼란스러움
<Divider type="line" />
<Divider type="dot" />
```

**왜 비권장?**:
- ❌ "space"와 "line"은 다른 목적 (공간 vs 구분)
- ❌ 업계 표준과 불일치
- ❌ 접근성 혼란 (언제 ARIA role 적용?)

---

## 10. 최종 권장사항

### 권장: Option A (Divider + Spacer)

**이유**:
1. **업계 검증**: 가장 많은 디자인 시스템 채택
2. **명확한 구분**: 시각적 vs 프레젠테이션
3. **MDK 철학 일치**: "Intent First" - 의도가 명확히 드러남

### API 제안

#### Divider

```tsx
interface DividerProps {
  // 방향
  orientation?: "horizontal" | "vertical"  // 기본: horizontal

  // 스타일
  variant?: "solid" | "dashed" | "dotted"  // 기본: solid

  // 크기 (Adobe Spectrum 패턴)
  size?: "sm" | "md" | "lg"                // 기본: md

  // 색상 (Polaris 패턴)
  color?: "default" | "subtle" | "inverse"  // 기본: default

  // 접근성 (Radix 패턴)
  decorative?: boolean                      // 기본: false (의미론적)
}

// 사용 예시
<Divider />                                 // 수평 실선
<Divider orientation="vertical" />          // 수직 실선
<Divider variant="dashed" />                // 점선
<Divider size="lg" />                       // 두꺼운 선
<Divider decorative />                      // 순수 장식용
```

#### Spacer

```tsx
interface SpacerProps {
  // 고정 크기
  h?: SpaceToken                            // 수직 크기
  w?: SpaceToken                            // 수평 크기

  // 유연한 크기 (Chakra/SwiftUI 패턴)
  flex?: number                             // 기본: 1 (남은 공간 차지)
}

// 사용 예시
<Spacer h={Space.n16} />                    // 16px 수직 공간
<Spacer flex={1} />                         // 남은 공간 모두 차지
<Spacer flex={2} />                         // 다른 Spacer의 2배 공간
```

### 대안: Separator + Spacer (미래 지향)

Chakra UI v3의 경로를 따라 접근성을 더 강조하고 싶다면:

```tsx
<Separator />                               // ARIA role 명시적
<Separator decorative />                    // 순수 장식용

<Spacer h={4} />                            // 변경 없음
```

---

## 11. 참고 자료

### 주요 디자인 시스템 문서

| 시스템 | Divider/Separator | Spacer/Space | Stack |
|--------|-------------------|--------------|-------|
| **Material UI** | [Divider](https://mui.com/material-ui/react-divider/) | - | [Stack](https://mui.com/material-ui/react-stack/) |
| **Ant Design** | [Divider](https://ant.design/components/divider/) | [Space](https://ant.design/components/space/) | - |
| **Chakra UI v2** | [Divider](https://v2.chakra-ui.com/docs/components/divider) | [Spacer](https://v2.chakra-ui.com/docs/components/flex) | [Stack](https://v2.chakra-ui.com/docs/components/stack) |
| **Chakra UI v3** | [Separator](https://chakra-ui.com/docs/components/separator) | [Spacer](https://chakra-ui.com/docs/components/spacer) | - |
| **Radix UI** | [Separator](https://www.radix-ui.com/primitives/docs/components/separator) | - | - |
| **shadcn/ui** | [Separator](https://ui.shadcn.com/docs/components/separator) | - | - |
| **Adobe Spectrum** | [Divider](https://spectrum.adobe.com/page/divider/) | - | - |
| **Polaris** | [Divider](https://polaris-react.shopify.com/components/layout-and-structure/divider) | - | - |
| **SwiftUI** | [Divider](https://developer.apple.com/documentation/swiftui/divider) | [Spacer](https://developer.apple.com/documentation/swiftui/spacer) | - |
| **Flutter** | [Divider](https://api.flutter.dev/flutter/material/Divider-class.html) | [Spacer](https://api.flutter.dev/flutter/widgets/Spacer-class.html) | - |

### React Native 커뮤니티

- [Use a Spacer component instead of margin](https://eduardogomez.io/blog/use-a-spacer-component-instead-of-margin-with-react-native/)
- [react-native-spacing-system](https://github.com/hirokazutei/react-native-spacing-system)
- [Spacing Components Pattern](https://github.com/kylpo/react-playbook/blob/master/patterns/Spacing-Components.md)

### 접근성 가이드

- [Duet Design System - Divider vs Spacer](https://www.duetds.com/components/divider/)
- [Twilio Paste - Separator](https://paste.twilio.design/components/separator)

---

## 12. 결론

### 핵심 발견

1. **Divider ≠ Spacer**: 업계는 명확히 구분 (의미론 vs 프레젠테이션)
2. **Separator는 Divider의 현대적 진화**: 접근성 강조
3. **Type 통합은 비표준**: "space" | "line" 패턴은 업계에 없음
4. **Stack/Gap이 대세**: 부모 제어 방식이 margin 대체의 주류

### MDK 맥락에서의 최종 제안

**단기 (빠른 구현)**:
```tsx
<Divider />                    // 시각적 구분선
<Spacer h={4} />              // 빈 공간
```

**장기 (접근성 고려)**:
```tsx
<Separator />                  // 의미론적 구분
<Separator decorative />       // 장식용
<Spacer h={4} />              // 빈 공간
```

**MDK의 "Intent First" 철학과 정렬**:
- **WHY**: Divider = "콘텐츠 구분", Spacer = "공간 조정"
- **WHAT**: 각자 명확한 역할
- **HOW**: 간단한 props로 의도 표현

### 추가 고려사항

만약 MDK가 **gap 기반 레이아웃**을 적극 활용한다면:
- Frame의 `gap` prop 강화 → Spacer 필요성 감소
- Divider만 컴포넌트화 → 심플한 구조

그러나 **개별 간격 조정**이 필요한 경우가 많다면:
- Spacer는 여전히 유용 (예: 불규칙한 간격 패턴)
