# IDE UI Kit - Layer System

## Concept
5단계 Z-Layer 시스템으로 깊이감을 표현. 각 레이어는 배경색과 shadow로 구분됨.

## Layer Hierarchy

### Layer 0 - Base (z-0)
- **용도**: 최하단 배경 (앱 전체 배경)
- **색상**: `#fafafa` (가장 어두운 회색)
- **Shadow**: 없음
- **예시**: 앱 전체 배경

### Layer 1 - Sunken (z-10)
- **용도**: 내려간 영역 (입력 필드, 터미널 배경)
- **색상**: `#f5f5f5` (Base보다 약간 밝음)
- **Shadow**: Inner shadow 느낌 (약간 어두운 테두리)
- **예시**: Input field, Terminal background, Code editor background

### Layer 2 - Surface (z-20)
- **용도**: 기본 표면 (사이드바, 패널 기본)
- **색상**: `#ffffff` (흰색)
- **Shadow**: 없음 (Base와 색 차이로만 구분)
- **예시**: Sidebar, File tree panel, Status bar

### Layer 3 - Elevated (z-30)
- **용도**: 약간 떠 있는 요소 (카드, 버튼 호버)
- **색상**: `#ffffff` (흰색)
- **Shadow**: `0 2px 8px -2px rgba(0, 0, 0, 0.05)` (은은한 그림자)
- **예시**: Cards, Hover states, Toolbar

### Layer 4 - Floating (z-40)
- **용도**: 떠 있는 요소 (드롭다운, 툴팁)
- **색상**: `#ffffff` (흰색)
- **Shadow**: `0 4px 16px -4px rgba(0, 0, 0, 0.08)` (중간 그림자)
- **예시**: Dropdown menus, Context menus, Tooltips

### Layer 5 - Modal (z-50)
- **용도**: 최상단 요소 (모달, 다이얼로그)
- **색상**: `#ffffff` (흰색)
- **Shadow**: `0 8px 32px -8px rgba(0, 0, 0, 0.15)` (강한 그림자)
- **예시**: Modal dialogs, Notifications, Command palette

## Visual Hierarchy Rules

1. **색상 규칙**
   - 낮은 레이어일수록 어두움 (Base)
   - 높은 레이어는 모두 흰색이지만 shadow로 구분

2. **Shadow 규칙**
   - Layer 0-2: Shadow 없거나 최소화
   - Layer 3+: 레이어가 높아질수록 blur와 opacity 증가

3. **사용 원칙**
   - 항상 인접한 레이어끼리 배치
   - 레이어 건너뛰기 금지 (Layer 0 → Layer 3 직접 배치 X)
   - 부모 레이어보다 자식이 항상 높은 레이어
