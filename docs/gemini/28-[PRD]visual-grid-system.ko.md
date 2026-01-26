# PRD: Visual Grid Layout System (비주얼 그리드 레이아웃 시스템)

## 1. 개요 (Overview)
복잡한 웹 애플리케이션(예: SlideApp, Properties Panel)의 레이아웃을 체계적으로 관리하기 위해, CSS Grid와 Subgrid를 활용한 "Visual Grid Layout System"을 도입한다. 특히 Vanilla Extract를 기반으로, 데이터 밀도가 높은 속성 패널(Properties Panel)에서 라벨과 입력 필드가 섹션 간에 완벽하게 정렬되도록 보장한다.

## 2. 배경 및 목적 (Background & Objectives)
### 배경
- 기존 Flexbox 기반 레이아웃은 중첩된 컴포넌트(Accordion 등) 내에서 수직 라인(Vertical Rhythm)을 맞추기 어렵다.
- "Visual Vanilla Extract"라는 컨셉 하에, 코드 레벨에서 시각적 일관성을 강제할 수 있는 도구가 필요하다.
- SlideApp의 Properties Panel은 Label-Value 쌍이 반복되며, 2열 또는 4열 그리드 구조가 필요하다.

### 목적
1. **Subgrid 활용**: 부모 컨테이너의 그리드 트랙을 자식 요소가 상속받아, 깊나 중첩된 구조에서도 열(Keyline)을 일치시킨다.
2. **Vanilla Extract 통합**: 타입 안전성을 보장하며 Grid 스타일을 정의한다.
3. **가독성 및 유지보수성**: `box`, `flex` 대신 명시적인 `grid`, `subgrid` 컴포넌트/유틸리티를 사용하여 의도를 명확히 한다.

## 3. 핵심 요구사항 (Key Requirements)

### 3.1. Grid System Architecture
- **Master Grid**: 12컬럼 또는 4컬럼의 마스터 그리드 정의.
- **Properties Grid**: `Label(Fixed) | Input(Fluid) | Label(Fixed) | Input(Fluid)` 형태의 4열 구조.
  - 라벨 너비: `n16` (토큰 기반 고정 너비).
  - 입력 필드: `1fr` (가변 너비).
  - 간격: `n8` (Gutter).

### 3.2. Subgrid Integration
- Accordion 내부의 `div`나 `section`이 부모 그리드를 상속받도록 `gridTemplateColumns: "subgrid"`를 지원해야 한다.
- `fullWidth` 요소는 `gridColumn: "1 / -1"`로 전체를 점유한다.
- `spanHalf` 요소는 `span 2`로 절반을 점유한다.

### 3.3. Component Implementation
- **PropertiesPanel**: 루트에 Master Grid를 선언하고, 각 섹션(Transform, Layer 등)은 Subgrid로 참여한다.
- **GridInput**: 라벨과 인풋 래퍼를 `Fragment`로 렌더링하여 그리드 셀에 직접 배치되도록 한다.

## 4. 기술적 설계 (Technical Design)

### 4.1. `utils.css.ts` 확장
`styled.grid` 외에 구체적인 Form Grid 유틸리티 추가 고려.
```typescript
export const propertiesGrid = style({
    display: "grid",
    gridTemplateColumns: "var(--label-width) 1fr var(--label-width) 1fr",
});
```
(현재는 `n16` 토큰 사용 중)

### 4.2. 파일 구조
- `src/apps/slide/SlideApp.css.ts`: 앱 전용 그리드 정의.
- `src/ui/utils.css.ts`: 범용 그리드 헬퍼.

## 5. 성공 기준 (Success Metrics)
- Properties Panel의 모든 섹션(Layer, Text 등)에서 라벨(X, Y, W, H 등)의 시작 위치가 픽셀 단위로 일치해야 한다.
- 윈도우 리사이즈 시 입력 필드만 늘어나고 라벨 영역은 고정되어야 한다.
- 코드가 직관적이어야 하며(예: `<GridInput />` 사용), 불필요한 `div` 래퍼 지옥(Wrapper Hell)이 없어야 한다.

## 6. 향후 계획 (Next Steps)
- 이 시스템을 CMS 앱 등 다른 복잡한 폼 뷰에도 전파한다.
- Grid Inspector 도구를 만들어 그리드 라인을 시각적으로 오버레이하여 디버깅 편의성을 제공한다.
