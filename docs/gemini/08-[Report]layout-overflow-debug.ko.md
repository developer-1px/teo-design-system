# 레이아웃 디버그 및 토큰 시스템 리포트

이 리포트는 `CRMApp.tsx`에서 발생한 전역 스크롤 문제를 분석하고, 수정 과정에서 확인된 토큰 시스템의 강제성(Type Enforcement)을 설명합니다.

## 1. 레이아웃 문제: Flexbox와 `min-width`

### **증상 (Symptom)**
`div.hbox` 컨테이너의 너비가 1728px(뷰포트)가 아니라 **1968px**(사이드바 240px + 메인 콘텐츠 1728px)로 늘어나며, 화면 전체에 가로 스크롤바가 생기는 현상이 발생했습니다.

### **원인: `min-width: auto`**
CSS Flexbox에서 Flex 아이템(우리의 메인 콘텐츠 영역)의 기본 `min-width` 값은 `auto`입니다.
- 이는 **"내 콘텐츠의 크기보다 더 작아질 수 없다"**는 의미입니다.
- 메인 콘텐츠 내부의 `CRMTable`은 약 5000px에 달하는 매우 넓은 스크롤 너비를 가지고 있습니다.
- 따라서 메인 콘텐츠 영역은 `flex: 1`이 설정되어 있어도, 내부 테이블의 너비 때문에 줄어들기를 "거부"했습니다.
- "최소 콘텐츠 크기(minimum content size)"가 Flex 축소(shrink) 규칙보다 우선 적용되었습니다.

### **해결책: `min-width: 0`**
`minWidth: 0`(코드에서는 `Size.n0`)을 명시적으로 설정하여 이 기본 동작을 덮어썼습니다.
- 브라우저에게 이야기합니다: **"필요하다면 0px까지 줄어들어도 괜찮다."**
- 이 설정을 통해 `flex: 1` 규칙이 다시 힘을 얻어, 메인 콘텐츠가 남은 공간(1488px)에 맞춰 줄어들게 되었습니다. 이제 내부의 `overflow: auto`가 정상적으로 작동하여 테이블 자체만 스크롤됩니다.

---

## 2. 토큰 시스템 및 타입 안전성 (Token System & Type Safety)

### **왜 숫자 `0`은 타입 에러가 발생했는가?**
질문: *"0은 토큰이 아니니까 타입 에러가 나야 하는데 안 나고 왜 된거야?"*

**결론부터 말씀드리면, 실제로 타입 에러가 발생했습니다.**

제가 처음 숫자 `0`을 넣으려 했을 때(Step 186), TypeScript 컴파일러가 다음 에러로 차단했습니다:
```typescript
override={{ borderRight: true, minWidth: 0 }}
```
> **Error**: `Type 'number' is not assignable to type 'WidthToken | undefined'.`

이는 **Minimal Design Kit (MDK)가 토큰 사용을 엄격하게 강제하고 있음**을 증명합니다. `0`, `100`, `50%`와 같은 원시 숫자(raw number)나 임의의 문자열을 레이아웃 속성에 직접 전달할 수 없습니다.

### **`Size.n0`가 작동하는 이유**
타입 에러를 해결하기 위해 저는 명시적인 토큰을 사용했습니다:
```typescript
import { Size } from "../../design-system/token/token.const.1tier";

// ...
override={{ minWidth: Size.n0 }}
```

- **`Size.n0`**는 Branded String 타입입니다: `"var(--size-n0)" as SizeToken`.
- 이는 `WidthToken` 타입 요구사항을 충족합니다.
- 실제 런타임에는 CSS 변수 `--size-n0`로 컴파일되며, 이는 전역 CSS에서 `0px`로 정의되어 있습니다.

### **요약**
1. **CSS 문제**: `min-width: auto` 속성이 Flex 컨테이너의 넘침 방지를 막고 있었습니다.
2. **해결**: `min-width: 0`을 통해 Flex 아이템이 줄어들 수 있도록 허용했습니다.
3. **타입 안전성**: MDK는 원시 숫자 `0`의 사용을 차단했으며, 의미적으로 정의된 `Size.n0` 토큰을 사용하도록 강제하여 일관성을 지켰습니다.
