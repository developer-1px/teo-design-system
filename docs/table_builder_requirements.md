# Table Builder 핵심 요구사항 정의서 (Pareto Optimized V2)

## 1. 개요 (Overview)
본 문서는 Table Builder의 **MVP(Minimum Viable Product)** 범위를 정의합니다.
이전 버전에서 정의된 10여 가지 타입을 **"가장 빈번하게 사용되는 4가지 핵심 패턴 (The Big 4)"**으로 압축하여,
개발 복잡도를 최소화하면서도 80% 이상의 Admin Table 유스케이스를 커버하는 것을 목표로 합니다.

## 2. 디자인 구성의 파레토 법칙 (The 80/20 Rule)
복잡한 "User Profile", "Tag List", "Switch" 등은 모두 기본 타입의 변형이거나 조합입니다.
우리는 **"더 적은 요소로 더 많은 것을(Less but Better)"** 표현하는 4가지 본질적 요소에 집중합니다.

## 3. The Big 4: 핵심 컬럼 타입 (Core Column Types)

### 3.1. 텍스트 (Text) - "정보의 60%"
모든 식별 정보와 설명을 담당합니다.
*   **통합 범위**: ID, Title, Description, Link, Email.
*   **단일 컬럼 타입**으로 처리하되, **Style Option**으로 구분합니다.
    *   `Primary (Bold)`: 제목, 중요 키워드. (Entity Title)
    *   `Secondary (Regular)`: 일반 텍스트, 설명. (Description)
    *   `Monospace`: ID, 코드, 주문번호. (Primary Key)

### 3.2. 상태 (Status) - "업무의 흐름"
데이터의 현재 단계를 시각적으로 인지하게 합니다. Admin에서 가장 중요한 시각적 랜드마크입니다.
*   **통합 범위**: Badge, Process Step, Boolean(Active/Inactive).
*   **UI 형태**: 색상이 적용된 `Badge` 형태단일 (Single Select).
*   **핵심 프리셋**:
    *   `Gray/Green/Red` (Default/Success/Danger)
    *   `Blue/Orange/Purple` (Process/Warning/Option)

### 3.3. 숫자 (Number) - "정량적 지표"
비즈니스의 성과를 측정합니다.
*   **통합 범위**: Currency(금액), Count(수량), Percentage(비율).
*   **핵심 속성**: 우측 정렬(Right ALign) + 천단위 콤마(,).

### 3.4. 날짜 (Date) - "시점과 마감"
기록의 생성과 소멸을 다룹니다.
*   **통합 범위**: Created At, Updated At, Deadline.
*   **UI 형태**: `YYYY-MM-DD` 텍스트 형태.

---
*(참고: Row Actions(수정/삭제 메뉴)는 데이터 컬럼이 아닌 시스템 컬럼이므로 별도 취급)*

## 4. 제거된 "틈새 디자인(Niche Compositions)"
다음 요소들은 V1에서 **제외**하며, 필요 시 위 4가지 타입으로 대체합니다.
*   **User Profile (Avatar)**: 이미지 처리 로직 복잡도 제거 -> **Text (이름)**로 대체.
*   **Tag List (Multi-select)**: 배열 데이터 처리 복잡도 제거 -> **Status (주 상태)**로 대체.
*   **Boolean (Switch)**: 인터랙션 복잡도 제거 -> **Status (Active/Inactive Badge)**로 대체.
*   **Smart Mocking (Auto Data)**: 데이터 생성 로직 제거 -> **Placeholder(빈 값)**로 시작.

## 5. 핵심 인터랙션: Proximity Context (근접성)
화려한 드래그 앤 드롭이나 복잡한 모달 대신, **"클릭한 그 자리"**에서 해결하는 경험을 제공합니다.

### 5.1. 헤더 컨텍스트 (Header Context)
*   **트리거**: 컬럼 헤더 클릭.
*   **동작**: 헤더 바로 아래에 `Popover` 메뉴 노출.
*   **기능**:
    1.  이름 변경 (Input)
    2.  타입 변경 (Select: Text/Number/Date/Status)
    3.  정렬/필터 (Sort/Filter)
    4.  컬럼 삭제 (Delete)

### 5.2. 빠른 추가 (Quick Add)
*   **트리거**: 테이블 우측 끝 `+` 버튼.
*   **동작**: "어떤 정보를 추가할까요?" (단순 타입 선택).
    *   `Text`, `Number`, `Date`, `Status` 4개 버튼만 노출.

## 6. 결론
**"텍스트, 숫자, 날짜, 상태."**
이 4가지만 견고하게 만들면 Table Builder는 완성됩니다. 나머지는 장식입니다.
