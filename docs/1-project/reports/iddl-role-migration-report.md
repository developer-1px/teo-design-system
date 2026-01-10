# IDDL Role Spec Gap Analysis & Migration Report (2026-01-10)

본 보고서는 `docs/me/role-spec.md`에 정의된 **IDDL Role Catalog v0.1** 규범과 현재 구현된 코드 사이의 불일치를 분석하고, 이를 최신 스펙으로 동기화하기 위한 마이그레이션 계획을 기술합니다.

---

## 1. 불일치 분석 (Gap Analysis)

### 1.1 Section Role의 비표준화
*   **현재 코드 (`role-config.ts`)**: `ActivityBar`, `PrimarySidebar`, `SecondarySidebar`, `Panel`, `Editor`, `Navigator`, `Master`, `Detail` 등 도메인 종속적(Domain-specific)인 용어를 Section Role로 직접 사용하고 있습니다.
*   **표정 규범 (`role-spec.md`)**: Section Role은 오직 9종(`Header`, `Main`, `Footer`, `Navigation`, `Sidebar`, `Search`, `Region`, `Modal`, `Drawer`)으로 제한됩니다.
*   **영향**: 시스템 간의 호환성이 떨어지며, 도메인이 바뀔 때마다 렌더러의 `role-config`가 비대해집니다.

### 1.2 계층 구조 위반 (Section vs Block)
*   **현재 코드**: `Toolbar`를 `Section` 레벨에서 정의하여 사용하고 있는 경우가 많습니다 (예: Studio 레이아웃의 `Toolbar` 섹션).
*   **표준 규범**: `Toolbar`는 **Block Role**입니다. 섹션은 물리적 구역(`Header`)이며, 그 안에 기능적 덩어리인 `Toolbar`가 배치되어야 합니다.

### 1.3 Element: Field의 세분화 부족
*   **현재 코드**: `Field`의 `type` 속성으로 대략적인 입력을 구분하고 있습니다.
*   **표준 규범**: `Field.role`을 도입하여 `TextInput`, `Select`, `Combobox`, `Slider` 등 **FieldRole**로 승격시키고, 각 Role마다 특화된 `spec`을 요구합니다.

### 1.4 접근성 용어 불일치
*   **현재 코드**: `ariaProps`를 직접 기술하거나 `description` 속성을 산발적으로 사용하고 있습니다.
*   **표준 규범**: 모든 노드는 `name`(Accessible Name)과 `description`(Accessible Description)을 BaseProps로 가져야 하며, 렌더러는 이를 HTML 시맨틱 및 ARIA 매핑으로 자동 변환해야 합니다.

---

## 2. 마이그레이션 계획 (Migration Plan)

### Phase 1: 스펙 및 타입 정의 동기화 (Immediate)
1.  `docs/1-project/iddl.d.ts`를 수정하여 `role-spec.md`의 모든 Canonical Role을 반영합니다.
2.  `FieldRole` 및 `FieldSpec` 타입을 도입하여 입력을 엄격하게 정의합니다.
3.  `BaseProps`에 `name`과 `description`을 추가합니다.

### Phase 2: Role Configuration (`role-config.ts`) 리팩토링
1.  `ROLE_CONFIGS`의 모든 키를 Canonical Section Roles(`Sidebar`, `Navigation`, `Main` 등)로 그룹화합니다.
2.  도메인 용어(`ActivityBar` 등)는 `spec` 또는 `name`으로 처리하도록 매핑 로직을 수정합니다.
3.  `Toolbar` 등 Block Role을 `Section` 구성 요소에서 분리합니다.

### Phase 3: 렌더러 및 컴포넌트 업데이트
1.  `Section.tsx`: Role에 따른 HTML Tag 출력 규칙을 `role-spec.md` 계약서에 맞게 강제합니다 (예: `Navigation` -> `<nav>`, `Main` -> `<main>`).
2.  `Block.tsx`: `Tabs`, `Toolbar`, `List` 등 신규 Block Role에 대한 기본 렌더링 패턴을 구현합니다.
3.  `Field.tsx`: `Field.role` 기반으로 분기하여 네이티브 HTML 입력을 생성하도록 리팩토링합니다.

### Phase 4: 전체 코드베이스 마이그레이션
1.  프로젝트 내 모든 IDDL 노드의 `role`을 표준 용어로 교체합니다.
2.  `layout="inline"` 등 삭제된 속성을 `role="Row"` 또는 `spec`으로 전환합니다.

---

## 3. 우선순위 권고 (Action Items)

| 순위 | 항목 | 설명 |
| :--- | :--- | :--- |
| **1** | **iddl.d.ts 업데이트** | 모든 개발의 기준이 되는 인터페이스를 먼저 최신화합니다. |
| **2** | **Section Role 통합** | `ActivityBar` 등을 `Navigation` 또는 `Sidebar`로 통합합니다. |
| **3** | **FieldRole 전환** | `type` 대신 `role`을 쓰는 구조로 변경하여 입력을 체계화합니다. |
| **4** | **HTML 시맨틱 검증** | 렌더러가 올바른 태그를 뱉고 있는지(A11y 계약) 전수 조사합니다. |
