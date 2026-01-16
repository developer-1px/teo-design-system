# 디자인 시스템 진화: 다음 단계 (Roadmap)

현재의 과도기적 상태분석을 바탕으로, 디자인 시스템이 완전히 강제되면서도 개발자 친화적인 "성공의 구덩이(Pit of Success)" 단계에 도달하기 위한 권장 로드맵입니다.

## 1. "Blocker" 완성 (즉각적 과제)

현재 `Frame.tsx`는 `margin`, `padding`, `width`, `height`, `opacity`, `borderRadius`, `boxShadow`를 차단하고 있습니다.
디자인 시스템을 완전히 보호하기 위해, 토큰이 존재하는 다른 원시 속성들로 차단 범위를 확장해야 합니다.

### 실행 항목 (Action Items):
- **`zIndex` 차단**: `ZIndexToken` 사용을 강제.
- **`borderWidth` 차단**: `BorderWidthToken` 사용을 강제 (현재 `border` boolean으로 처리되지만, 구체적인 두께 설정이 빠져나갈 수 있음).
- **`fontSize` / `lineHeight` / `color` 차단**:
    - **참고**: 이 속성들은 종종 상속됩니다. `Frame`이 단순 레이아웃용으로 쓰일 때 이를 차단하는 것은 너무 공격적일 수 있습니다. 하지만 텍스트를 포함하는 "Leaf Frame"의 경우 `Text` 컴포넌트나 전용 속성을 통해 제어되어야 합니다.
    - **권장사항**: 아직 `Frame`에서 차단하지는 말되, `Text` 컴포넌트가 이를 엄격히 강제하도록 합니다.

## 2. 정적 분석 강제 (ESLint)

`Frame.tsx`에서의 런타임 차단은 안전망이지만, 브라우저에서 실행해봐야 알 수 있다는 단점이 있습니다. IDE에서 코드를 작성하는 시점에 즉시 알 수 있어야 합니다.

### 실행 항목 (Action Items):
- **커스텀 ESLint 규칙 생성**: `no-restricted-syntax` 또는 커스텀 플러그인 활용.
    - **규칙**: `Frame` 컴포넌트의 `style={{ ... }}` 속성 내에서 특정 키 사용 금지.
    - **에러 메시지**: "style에 'margin'을 사용하지 마세요. 간격에는 'gap'을, 분리에는 'Divider'를 사용하세요."
    - **에러 메시지**: "style에 'width'를 사용하지 마세요. Size 토큰과 함께 'w' 속성을 사용하세요."
- **이점**: 개발자가 타이핑하는 즉시 빨간 줄로 경고를 볼 수 있습니다.

## 3. 레거시 코드의 마이그레이션

코드베이스 검색 결과, `Separator.tsx`, `Icon.tsx`, `CMSDrawer.tsx` 등 곳곳에서 `style={{ ... }}`이 여전히 많이 사용되고 있습니다.

### 실행 항목 (Action Items):
- **`Icon.tsx`**: 종종 `style={{ color }}`나 transform을 사용합니다. `Icon`이 색상 토큰을 직접 받거나 적절히 상속받도록 해야 합니다.
- **`Separator.tsx` / `Divider.tsx`**: 내부적으로 임의의 margin을 사용하지 않는지 확인해야 합니다.
- **앱 컴포넌트**: `grep` 결과를 기반으로 체계적으로 `style` 속성을 `Frame`의 최상위 속성으로 교체합니다.
    - `style={{ flex: 1 }}` -> `flex` (boolean 또는 prop)
    - `style={{ overflow: 'hidden' }}` -> `clip`
    - `style={{ cursor: 'pointer' }}` -> `cursor="pointer"` (prop이 없다면 단순화된 prop 추가 필요)

## 4. 프리미티브(Primitive) 세트 확장

현재 시스템은 `Frame`에 너무 많은 역할을 의존하고 있습니다. `override` 사용을 줄이기 위해 더 특화된 프리미티브가 필요할 수 있습니다.

### 실행 항목 (Action Items):
- **`ScrollFrame`**: `Frame`에 `scroll` 속성이 있지만, 오버플로우와 스크롤바 스타일링 토큰을 더 광범위하게 처리하는 전용 컴포넌트가 유용할 수 있습니다.
- **`Surface`**: `surface` 속성을 개선하여 단순히 "primary"뿐만 아니라, 시맨틱 컬러 토큰(배경+전경 쌍)과 매핑되도록 합니다.

## 5. 문서화 및 개발자 경험 (DX)

속성들이 "Strict", "Layout", "Overrides"로 분산되어 있어 사용법이 혼란스러울 수 있습니다.

### 실행 항목 (Action Items):
- **"단일 속성(One Prop)" 정책**: 사용 빈도가 높은(예: 10회 이상) 오버라이드는 최상위 Strict 속성으로 승격시킵니다.
- **Storybook / 문서**: "잘못된 방법(style 속성)"과 "올바른 방법(토큰 속성)"을 나란히 보여주는 비교 문서를 작성합니다.

## 6. "비상 탈출구(Escape Hatch)" 프로토콜

서드파티 통합이나 복잡한 애니메이션 같은 엣지 케이스는 항상 존재합니다.

### 실행 항목 (Action Items):
- **탈출구 표준화**: 언젠가 차단될 `style`이 조용히 작동하도록 두는 대신, `unsafe_style` 속성을 명시적으로 만들거나, `// eslint-disable-next-line` 같은 주석을 요구하여 "나는 내가 무엇을 하는지 알고 있으며, 타당한 이유가 있다"는 것을 명시하게 합니다.

---

## 결론

다음 단계는 **"정리 및 도구화(Cleanup & Tooling)"**입니다.
1.  **마이그레이션**: 남은 `style` 사용을 속성으로 전환.
2.  **린트(Lint)**: 회귀 방지.
3.  **문서화**: `Frame`의 방대한 API 문서화.
