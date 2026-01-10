# IDDL 1.0 Renderer 구현 가이드

**대상:** 디자인 시스템 엔지니어, 프론트엔드 아키텍트  
**목표:** IDDL Part 1 (Core Freeze) 명세를 실제 픽셀 UI로 변환하는 Renderer 구현 규칙 정의

---

## 1. 렌더링 계약 (The Rendering Contract)

Renderer는 IDDL의 **5대 축(Axes)**을 입력받아 **디자인 토큰(Tokens)**으로 변환하는 함수입니다.

`Renderer(Node) = Component + Style(Tokens)`

### 1.1 Role 매핑 (Component Selection)
*   **원칙**: `Role` 문자열은 Design System의 구체적인 컴포넌트와 1:1 또는 N:1로 매핑되어야 합니다.
*   **Fallback**: 알 수 없는 `Role`이 들어오면, 렌더링을 중단하지 않고 **기본 컨테이너(`div`)**로 렌더링하며 자식을 출력해야 합니다.

### 1.2 Intent/Prominence/Density 매핑
*   **Intent**: 의미론적 색상 변수 (`--color-brand`, `--color-danger` 등)로 매핑.
*   **Prominence**: 크기/굵기/배경 유무 (Hero=Large/Bold, Subtle=Small/Gray)로 매핑.
*   **Density**: 패딩/마진/폰트 스케일 (Compact=Small Spacing, Comfortable=Large Spacing)로 매핑.

---

## 2. 레이아웃 처리 (Handling Layout)

IDDL 1.0 Part 1에서는 `layout` 속성이 코어에서 제거되었습니다. 
Renderer는 **Role 기반의 기본 레이아웃(Role-Derived Defaults)**을 내장해야 합니다.

### 2.1 Default Flow & Placement 정의
각 `Role` 구현체는 자신의 기본 `display` 및 `flex-direction`, 고정 위치 등을 정의해야 합니다.

```tsx
// Example Implementation Strategy
const RoleDefaults = {
  // Section
  Header: { 
    tag: 'header',
    styles: { position: 'sticky', top: 0, display: 'flex', justifyContent: 'space-between' } 
  },
  
  // Block
  Toolbar: { 
    display: 'flex', flexDirection: 'row', gap: 'var(--spacing-small)', alignItems: 'center' 
  },
  Form: { 
    display: 'flex', flexDirection: 'column', gap: 'var(--spacing-medium)' 
  },
  Card: { 
    display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' 
  }
};
```

### 2.2 Spec을 통한 제어
`spec` 속성에 Role별 전용 파라미터가 있다면 이를 처리합니다.
*   예: `role="Grid"`이고 `spec={ columns: 3 }`이면 `grid-template-columns: repeat(3, 1fr)` 적용.
*   **주의**: `spec`은 상속되지 않으므로 해당 노드에만 적용합니다.

---

## 3. 구현 체크리스트

1.  [ ] **Factory Pattern**: 노드의 `level`과 `role`을 보고 적절한 컴포넌트를 리턴하는 팩토리 함수 구현.
2.  [ ] **Token System**: 5대 축을 받아 CSS 클래스/변수를 생성하는 유틸리티 구현.
3.  [ ] **Role Registry**: 지원하는 Role 목록과 Fallback 처리 로직 구현.
4.  [ ] **Recursive Rendering**: `Page` -> `Section` -> `Block` -> `Element` 순회 렌더러 구현.
