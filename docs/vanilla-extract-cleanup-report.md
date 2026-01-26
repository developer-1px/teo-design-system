# Vanilla Extract 중복 기능 정리 및 개선 제안

현재 코드베이스 내의 Vanilla Extract 유틸리티들을 분석한 결과, 역할이 중복되거나 비효율적으로 산재된 기능들이 식별되었습니다. 이를 MECE(Mutually Exclusive, Collectively Exhaustive)하게 정리하고, 향후 유지보수를 위한 개선안을 제안합니다.

## 1. 중복된 기능 현황 (Duplicates)

### 1.1 Surface (배경/서피스) 정의 중복 🔴
가장 큰 중복 영역입니다. 서피스 스타일을 정의하는 방식이 3가지로 나뉘어 있어 일관성을 해칠 위험이 있습니다.

| 위치 | 정의 방식 | 특징 | 상태 |
| :--- | :--- | :--- | :--- |
| `src/design-system/surfaces.css.ts` | **Recipe** (`recipe()`) | Hover, Active, Disabled, Error 등 복잡한 상태 관리 포함. 가장 강력함. | ✅ **권장 (Main)** |
| `src/design-system/mixins.ts` | **Function** (`surface()`) | 헬퍼 함수 형태. 동적 값을 받아 스타일 객체를 반환. | ⚠️ **보조 (Legacy)** |
| `src/ui/utils.css.ts` | **Object** (`surface = {...}`) | `base`, `card`, `sunken` 등의 값이 **하드코딩**되어 있음. 테마 변수(`vars`)와 동기화되지 않을 수 있음. | ❌ **제거 대상** |

### 1.2 Text 유틸리티 중복 🟡
텍스트 줄임(Truncate) 처리가 두 곳에 정의되어 있습니다.

| 위치 | 이름 | 코드 형태 |
| :--- | :--- | :--- |
| `src/design-system/mixins.ts` | `truncate` | `export const truncate: StyleRule = { ... }` |
| `src/ui/utils.css.ts` | `text.truncate` | `export const text = { truncate: { ... } }` |

### 1.3 Positioning 유틸리티 중복 🟡
`absolute` 포지셔닝을 채우는 유틸리티가 이름만 다르고 내용은 같습니다.

| 위치 | 이름 | 내용 |
| :--- | :--- | :--- |
| `src/design-system/mixins.ts` | `absoluteFill` | `top:0, left:0, right:0, bottom:0` |
| `src/ui/utils.css.ts` | `layout.absoluteFull` | `top:0, left:0, right:0, bottom:0` |

---

## 2. 역할 재정립 및 개선 제안 (Action Plan)

현재 `ui/utils.css.ts`가 레이아웃(Grid/Flex) 시스템과 단순 믹스인들이 섞여 있어 비대해져 있습니다. 역할을 명확히 분리해야 합니다.

### 2.1 파일별 역할 정의 (To-Be)

1.  **`src/ui/utils.css.ts`** -> **`src/ui/layout.css.ts` (제안)**
    *   **역할:** **Strict Layout System 전용**. 레이아웃 구조(Grid, Flex)와 관련된 기능만 남깁니다.
    *   **포함:** `createGrid`, `createFlex`, `styled.box/flex/grid`, `grid12`, `gridForm`, `createNamedGrid`.
    *   **제거:** `text`, `surface` (Visual 속성).

2.  **`src/design-system/mixins.ts`**
    *   **역할:** **Visual Helper 전용**. 눈에 보이는 스타일(텍스트, 색상, 장식) 처리를 담당합니다.
    *   **포함:** `truncate`, `lineClamp`, `visuallyHidden`, `hideScrollbar`, `transition`.
    *   **통합:** `ui/utils.css.ts`에 있던 `absoluteFull` 등을 이쪽으로 일원화합니다.

3.  **`src/design-system/surfaces.css.ts`**
    *   **역할:** **서피스 컴포넌트의 Single Source of Truth**.
    *   React 컴포넌트에서 서피스를 사용할 때는 무조건 이 파일의 `recipe`를 사용하도록 가이드합니다.

### 2.2 구체적인 리팩토링 단계

1.  **Deprecation Marking**: `ui/utils.css.ts` 내의 `surface` 객체와 `text` 객체에 `@deprecated` 주석을 추가하여 사용을 억제합니다.
2.  **Migration**: 현재 `utils.surface.card` 등을 사용하는 코드를 찾아 `vars.color.surface.card` (테마 변수 직접 사용) 또는 `surfaces.css.ts`의 레시피로 교체합니다.
3.  **Deletion**: 사용처가 없어지면 `ui/utils.css.ts`에서 중복 코드를 영구 삭제합니다.

## 3. 요약

| 기능 카테고리 | 현재 상태 | 개선 방향 |
| :--- | :--- | :--- |
| **Grid/Layout System** | `utils.css.ts`에 잘 구현됨 | 현행 유지 (가칭 `layout.css.ts`로 이름 변경 고려) |
| **Surface Styles** | 3곳에 분산됨 | `surfaces.css.ts` (Recipe)로 통일, `utils.css.ts`의 하드코딩 제거 |
| **Text Helpers** | 2곳에 분산됨 | `mixins.ts`로 통일 |
| **Positioning** | 2곳에 분산됨 | `mixins.ts`로 통일 |

이 정리를 통해 **"Layout은 `utils`, Visual은 `mixins/vars`"**라는 명확한 규칙을 확립할 수 있습니다.
