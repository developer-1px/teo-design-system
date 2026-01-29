# 🚨 레드팀 아키텍처 감사 보고서: 폴더 구조 및 리팩토링 제안

**작성일**: 2026-01-29
**분석 대상**: `/src` 및 프로젝트 루트 디렉토리
**감사 등급**: 🔴 Critical Refactoring Required

## 1. 개요 (Executive Summary)

현재 프로젝트는 `features` 기반의 도메인 분리가 이루어져 있어 초기 확장성은 확보했으나, **"Headless Logic"과 "UI Shell"의 분리**라는 핵심 아키텍처 원칙이 폴더 구조 레벨에서 지켜지지 않고 있습니다. 특히 로직(Hooks, Utils)를 담을 표준화된 컨테이너가 부재하여, 비즈니스 로직이 UI 컴포넌트(`*.tsx`) 내부에 강하게 결합될 위험이 매우 높은 상태입니다. 이는 장기적인 유지보수성과 테스트 용이성을 심각하게 저해합니다.

## 2. 주요 발견 사항 (Critical Findings)

### 2.1. 🔴 "Missing Kernel" - 로직 레이어의 부재
가장 심각한 구조적 결함은 최상위 레벨 또는 기능(Feature) 레벨에서 `hooks`와 `utils` 디렉토리가 명시적으로 보이지 않는다는 점입니다.
- **현상**: `src/hooks`, `src/utils` 디렉토리가 없으며, `src/features/mail` 등의 기능 폴더 내부도 `.tsx`와 `.css.ts` 파일들이 평면적(Flat)으로 나열되어 있습니다.
- **위험**: 모든 비즈니스 로직, 상태 관리, 데이터 페칭 코드가 리액트 컴포넌트(`App.tsx`, `EmailList.tsx` 등) 내부에 인라인으로 작성되어 있을 가능성이 큽니다. 이는 "Logic Purity" 원칙을 위반하며 Red Team Audit 기준 불합격 사항입니다.

### 2.2. 🟡 Documentation Schism - 문서의 파편화
문서화의 진실 공급원(Source of Truth)이 분산되어 혼란을 초래합니다.
- **현상**: 
  - `src/components/docs`: 컴포넌트 레벨 문서?
  - `src/docs`: 앱 내에서 렌더링되는 문서? (01-Overview 등)
  - `docs/`: 프로젝트 메타 문서? (inbox 등)
- **위험**: 유지보수 시 어느 문서를 업데이트해야 하는지 불분명하며, 문서 간 정합성이 깨질 수 있습니다.

### 2.3. 🟡 Component Bloat - UI 라이브러리의 비대화
`src/components/ui` 디렉토리가 "덤프" 공간이 되어가고 있습니다.
- **현상**: 47개 이상의 컴포넌트가 단일 폴더에 평면적으로 존재합니다. `Button`(Primitive)과 `SearchFilterBar`(Composite)가 같은 위계에 섞여 있습니다.
- **위험**: 컴포넌트의 재사용 범위와 복잡도를 파악하기 어렵습니다.

### 2.4. 🟢 Inconsistent Feature Anatomy - 기능 모듈의 구조 부재
`src/features` 하위 폴더들이 표준화된 내부 구조를 갖추지 않았습니다.
- **현상**: `src/features/mail` 확인 결과, 12개의 파일이 평면적으로 나열됨. 하위 폴더 없음.
- **제안**: Feature 내부에서도 `components`, `hooks`, `model` 등으로 책임을 나눠야 합니다.

## 3. 리팩토링 로드맵 (Refactoring Roadmap)

### Phase 1: 아키텍처 정상화 (The "Logic Extraction")
최우선적으로 로직을 UI에서 분리할 공간을 마련해야 합니다.

```bash
mkdir src/hooks      # 전역 커스텀 훅 (useMount, useKeyPress 등)
mkdir src/utils      # 순수 함수 (formatDate, calculateTax 등)
mkdir src/types      # 전역 타입 정의
```

### Phase 2: 컴포넌트 계층화 (Tiered Component System)
`src/components`를 명확한 계층으로 재편성합니다.

```
src/components/
├── primitives/      # (Tier 1) Button, Input, Badge, Icon 등 원자 단위
├── composites/      # (Tier 2) SearchFilterBar, Dialog, FormField 등 조합 단위
├── layout/          # (Shell) Sidebar, Header, PageLayout 등 배치 단위
└── shared/          # (Special) JsonViewer 등 도메인 불가지론적 복합체
```

### Phase 3: 기능(Feature) 내부 구조 표준화
Feature 폴더가 5개 이상의 파일을 가질 경우, 강제로 하위 폴더를 생성하도록 규칙을 정합니다.

```
src/features/mail/
├── components/      # EmailList, EmailRow (해당 기능 전용 UI)
├── hooks/           # useMailSelection, useEmailFetch (해당 기능 전용 로직)
├── model/           # types.ts, constants.ts (데이터 모델)
└── index.ts         # Public API
```

### Phase 4: 문서 공간 통합
- `src/docs`: 앱 내에서 보여지는 "콘텐츠"로서의 문서로 정의 (유지)
- `docs/`: 개발팀을 위한 "설계 및 관리" 문서로 정의
- `src/components/docs`: 제거하고 Storybook이나 `src/docs`의 디자인 시스템 섹션으로 통합 권장

## 4. 결론 (Conclusion)

현재 프로젝트는 **"기능 동작"에는 집중했으나 "유지보수 구조"설계가 누락**된 상태입니다. 특히 Hooks의 물리적 공간 부재는 심각한 기술 부채를 야기할 수 있으므로, **Phase 1(Logic Extraction)** 작업을 즉시 수행할 것을 강력히 권고합니다.
