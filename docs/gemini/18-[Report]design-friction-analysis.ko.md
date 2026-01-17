# [Report] MDK 디자인 시 헷갈렸던 부분 분석 (Design Friction Analysis)

**작성일:** 2026-01-16
**주제:** `CommandBarDesignApp` 디자인 과정에서 경험한 MDK 사용성 마찰(Friction) 포인트 분석

## 1. 요약 (Executive Summary)

MDK(Minimal Design Kit)는 "Physics over Painting(그리기보다 물리 법칙)" 철학을 강제하여 일관성을 보장하는 강력한 시스템입니다. 하지만 기존 CSS나 Tailwind 방식에 익숙한 에이전트(및 개발자)에게는 초기 진입 장벽(Friction)이 존재합니다. 가장 큰 혼란 포인트는 **토큰의 타입 호환성(Type Compatibility)**, 특히 개념적으로 유사하지만 타입이 호환되지 않는 토큰들(예: `Size` vs `ContainerSize`)의 구분 짓기였습니다.

## 2. 주요 마찰 포인트 (Friction Points)

### 2.1. 토큰 타입 비호환성 (`Size` vs `ContainerSize`)

**문제점:**
`maxHeight` 속성에 `Size.n320`을 사용하려다 다음과 같은 타입 에러가 발생했습니다.
> `Type 'SizeToken' is not assignable to type 'ContainerSizeToken'`

**헷갈리는 이유:**
AI나 사용자 입장에서 `320px`은 그저 하나의 '크기'일 뿐입니다. 하지만 MDK 시스템은 "콘텐츠/레이아웃 크기(`Size`)"와 "컨테이너/제약 크기(`ContainerSize`)"를 엄격하게 구분합니다.
-   `Size`: 작은 단위 위주 (4, 8, 16...)
-   `ContainerSize`: 브레이크포인트 및 큰 컨테이너 너비 (320, 480, 640...)

**영향:**
올바른 토큰 Enum을 찾기 위해 타입 정의를 다시 읽거나 시행착오를 겪어야 했습니다.

### 2.2. 컴포넌트 API의 발견 가능성 (`Text` Dot-Notation)

**문제점:**
`Text.Menu.Item` 같은 Dot-notation 프리셋이 존재하므로, 당연히 `Text.Caption`도 있을 것이라고 가정하고 코드를 작성했으나 에러가 발생했습니다.
> `Property 'Caption' does not exist on type 'Text'`

**헷갈리는 이유:**
라이브러리가 두 가지 패턴을 혼용하고 있어 예측이 어렵습니다.
1.  **Context Presets (문맥 프리셋):** `Text.Menu.Item`, `Text.Card.Title` (Dot-notation 사용)
2.  **Variants (변형):** `<Text variant="caption">` (Prop 사용)

일관성은 예측 가능성의 핵심입니다. 패턴이 섞여 있으면 코드 작성 시 추측을 하게 만듭니다.

### 2.3. Icon 컴포넌트 인터페이스

**문제점:**
일반적인 라이브러리처럼 문자열 prop(`<Icon name="search" />`)을 사용할 것으로 예상했으나, 실제 API는 컴포넌트 참조(`<Icon src={Search} />`)를 요구했습니다.

**영향:**
`lucide-react`에서 사용하는 모든 아이콘을 개별적으로 import 해야 하므로, 문자열 방식에 비해 import 문이 길어지고 번거로움이 증가했습니다.

### 2.4. Import 오버헤드

**문제점:**
단 하나의 간단한 컴포넌트를 디자인하기 위해 너무 많은 요소들을 import 해야 했습니다.
-   `Frame`, `Layout`, `Text`, `Icon` (컴포넌트)
-   `Space`, `Size`, `ContainerSize`, `Radius`, `Radius2`, `Opacity`, `IconSize` (토큰)
-   `Search`, `File`, `Zap`, ... (아이콘)

**영향:**
엄격한 시스템은 상세한 import를 강제합니다. 이는 번들 사이즈 관리에는 좋지만, "Hello World"를 띄우기까지의 초기 비용(시간, 노력)을 증가시킵니다.

## 3. 향후 에이전트를 위한 제언

1.  **항상 제약(Constraint) 타입을 확인하라**: 토큰을 사용하기 전에 해당 Prop이 일반적인 `Size`를 요구하는지, 아니면 `ContainerSize`나 `MaxWidth` 같은 특정한 제약 타입을 요구하는지 먼저 확인해야 합니다.
2.  **컴포넌트 API를 검증하라**: 모든 variant에 대해 Dot-notation이 존재한다고 가정하지 마십시오. `Text.tsx`나 `Icon.tsx` 파일을 열어 실제 정의를 확인하는 것이 빠릅니다.
3.  **1-Tier 토큰을 활용하라**: 특별한 의미론적(Semantic) 토큰이 필요한 경우가 아니라면, 기본적으로 `token.const.1tier.ts`에 정의된 토큰을 사용하는 것이 안전합니다.

## 4. 결론

MDK는 잘못된 값을 사용하는 것을 컴파일 타임에 차단함으로써 "가짜 디자인(Fake Design)"을 효과적으로 방지합니다. 제가 겪은 마찰(Friction)은 시스템이 의도대로 작동하고 있다는 증거이기도 합니다. 시스템은 제가 단순히 "픽셀 값을 던져넣는" 행위를 거부하고, 의미론적으로 올바른 토큰을 선택하도록 강제했습니다.
