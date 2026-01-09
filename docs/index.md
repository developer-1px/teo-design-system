# IDE UI Kit 문서

> **IDDL(Intent-Driven Design Language) 기반 디자인 시스템 - PARA 방법론으로 정리**

**마지막 업데이트**: 2025-01-09

---

## 🗺️ 문서 구조 (PARA Method)

이 문서는 **PARA (Projects, Areas, Resources, Archive)** 방법론을 따릅니다:

```
docs/
├── inbox/              # 📥 새로 받은 보고서/요구사항
├── 1-projects/         # 🎯 진행 중인 프로젝트 (목표 + 데드라인)
├── 2-areas/            # 🔄 지속 관리 영역 (표준, 스펙, 패턴)
├── 3-resources/        # 📚 참고 자료 (외부 링크, 연구 노트)
└── 4-archive/          # 📦 완료/비활성화 항목
```

---

## 🚀 빠른 시작

### 신규 사용자

```
1. Why IDDL? 읽기
   → 2-areas/core/4-explanation/why-iddl.md

2. Getting Started 따라하기
   → 2-areas/core/1-tutorials/01-getting-started.md

3. 첫 컴포넌트 만들기
   → 2-areas/core/1-tutorials/02-your-first-component.md
```

### 기존 사용자 (빠른 참조)

```
API 레퍼런스
  → 2-areas/core/3-reference/

패턴 검색
  → 2-areas/patterns/

디자인 철학
  → 2-areas/design-system/project-philosophy.md
```

### 기여자

```
프로젝트 철학 이해
  → 2-areas/design-system/project-philosophy.md

패턴 학습
  → 2-areas/patterns/

How-to 가이드
  → 2-areas/core/2-how-to/
```

---

## 📥 inbox/ (보고서 수신)

**새로 받은 보고서, 분석 결과, 요구사항**

```
inbox/
├── darkmode-issue-analysis.md
├── debug-panel-requirements-analysis-2026-01-09.md
├── folder-structure-recommendations-2026-01-09.md
└── iddl-renderer-requirements-2026-01-09.md
```

**정리 주기**: 주간 (Projects/Areas/Resources/Archive로 분류)

---

## 🎯 1-projects/ (진행 중인 프로젝트)

> **명확한 목표와 데드라인이 있는 작업**

[📁 1-projects/README.md](./1-projects/README.md) - 프로젝트 관리 가이드

### 현재 프로젝트

- [Current Sprint](./1-projects/current-sprint/) - 현재 스프린트 작업

### 프로젝트 추가 방법

1. `1-projects/` 폴더에 프로젝트 폴더 생성
2. README.md 작성 (목표, 데드라인, 진행 상황)
3. 완료 시 → `2-areas/` (지속 관리) 또는 `4-archive/` (보관)

---

## 🔄 2-areas/ (지속 관리 영역)

> **계속 유지하고 업데이트해야 하는 표준과 지식**

[📁 2-areas/README.md](./2-areas/README.md) - Areas 개념 설명

### 2-areas/core/ - IDDL 코어 문서

[📁 2-areas/core/README.md](./2-areas/core/README.md) - **Diátaxis 구조 설명**

IDDL 문서는 **Diátaxis Framework**를 따릅니다:

#### 🎓 [1-tutorials/](./2-areas/core/1-tutorials/) (배우기)
**단계별 학습 가이드 (20-30분)**

- [01. Getting Started](./2-areas/core/1-tutorials/01-getting-started.md) - IDDL 설치 및 기본 사용법
- [02. Your First Component](./2-areas/core/1-tutorials/02-your-first-component.md) - 로그인 폼 만들기

**누구를 위한?**: 처음 배우는 사람

---

#### 🛠️ [2-how-to/](./2-areas/core/2-how-to/) (만들기)
**문제 해결 레시피 (10-15분)**

- [Add New IDDL Role](./2-areas/core/2-how-to/add-new-iddl-role.md) - Custom Role 추가
- [Customize Design Tokens](./2-areas/core/2-how-to/customize-design-tokens.md) - 토큰 커스터마이징

**누구를 위한?**: 특정 문제를 해결하려는 사람

---

#### 📖 [3-reference/](./2-areas/core/3-reference/) (찾기)
**API 레퍼런스와 스펙**

- [Field Reference](./2-areas/core/3-reference/field-reference.md) - Field 컴포넌트 완전 가이드 (21가지 dataType)
- [Page v2.0 Spec](./2-areas/core/3-reference/page-v2-spec.md) - Page 컴포넌트 스펙
- [Component Role Mapping](./2-areas/core/3-reference/component-role-mapping.md) - 일반 컴포넌트 → IDDL 매핑

**누구를 위한?**: 빠른 정보 검색이 필요한 모든 사람

---

#### 💡 [4-explanation/](./2-areas/core/4-explanation/) (이해하기)
**개념, 철학, 배경**

- [Why IDDL?](./2-areas/core/4-explanation/why-iddl.md) ⭐ - IDDL이 필요한 이유
- [IDDL vs Traditional](./2-areas/core/4-explanation/iddl-vs-traditional.md) - 전통적 방식과 비교

**누구를 위한?**: 깊이 이해하려는 사람, 의사결정자

---

### 2-areas/design-system/ - 디자인 시스템

[📁 2-areas/design-system/README.md](./2-areas/design-system/README.md)

- [Project Philosophy](./2-areas/design-system/project-philosophy.md) ⭐ - 프로젝트 철학 (10개 섹션)
- Design Principles (예정) - 핵심 디자인 원칙

**핵심 개념**:
- Why-First Design: HOW → WHY
- 16-Token System: 색상 6, 크기 4, 굵기 2, 간격 4
- 7-Layer System: Depth 0-6

---

### 2-areas/patterns/ - React 패턴 백과사전

[📁 2-areas/patterns/README.md](./2-areas/patterns/README.md) ⭐ - **8개 패턴 완전 개요**

| 패턴 | 내용 | 우선순위 |
|------|------|---------|
| [01-behavior-patterns.md](./2-areas/patterns/01-behavior-patterns.md) | Focus, Keyboard, Interaction, Scroll | 🔴 High |
| [02-accessibility-patterns.md](./2-areas/patterns/02-accessibility-patterns.md) | ARIA, Live Regions, Screen Reader | 🔴 High |
| [03-data-patterns.md](./2-areas/patterns/03-data-patterns.md) | Virtualization, Pagination, Filtering | 🟡 Medium |
| [04-composition-patterns.md](./2-areas/patterns/04-composition-patterns.md) | Compound, Polymorphic, Slots | 🟡 Medium |
| [05-state-patterns.md](./2-areas/patterns/05-state-patterns.md) | Controlled, Form State, Error Boundaries | 🔴 High |
| [06-animation-patterns.md](./2-areas/patterns/06-animation-patterns.md) | Presence, Gestures, Scroll Animations | 🟢 Low |
| [07-layout-patterns.md](./2-areas/patterns/07-layout-patterns.md) | Grid, Flexbox, Responsive | 🟡 Medium |
| [08-performance-patterns.md](./2-areas/patterns/08-performance-patterns.md) | Memoization, Code Splitting, Lazy Loading | 🟡 Medium |

**사용 시나리오**:
- "Modal을 만들어야 해" → 01 + 02 + 06 + 05
- "대용량 테이블" → 03 + 08 + 07
- "복잡한 Form" → 05 + 02 + 04

---

## 📚 3-resources/ (참고 자료)

> **외부 자료와 연구 노트**

[📁 3-resources/README.md](./3-resources/README.md)

- [External Links](./3-resources/external-links.md) - 외부 참고 자료 (디자인 시스템, 라이브러리, 도구)
- [Research](./3-resources/research/) - 조사 및 분석 결과

**정리 주기**: 매월 새 자료 추가, 매 분기 링크 확인

---

## 📦 4-archive/ (보관소)

> **완료되거나 비활성화된 프로젝트**

[📁 4-archive/README.md](./4-archive/README.md) - Archive 정책

**이동 조건**:
- Projects 완료 → Archive
- 3년 이상 미사용 → 완전 삭제

---

## 🎯 사용자별 학습 경로

### 신규 개발자 (IDDL 처음)

```
Step 1: 개념 이해 (30분)
  → why-iddl.md

Step 2: 기본 학습 (1시간)
  → tutorials/01-getting-started.md
  → tutorials/02-your-first-component.md

Step 3: 실전 적용 (2시간)
  → how-to 가이드들
  → patterns 참조

Step 4: 깊이 이해 (1시간)
  → project-philosophy.md
  → iddl-vs-traditional.md
```

### 중급 개발자 (React 경험자)

```
Step 1: IDDL 개념 (15분)
  → why-iddl.md (핵심만)

Step 2: 레퍼런스 (30분)
  → reference/ 전체 훑기

Step 3: 패턴 학습 (2시간)
  → patterns/ (자주 사용하는 것부터)

Step 4: 실전 (∞)
  → how-to 가이드로 문제 해결
```

### 시니어 개발자 / 아키텍트

```
Step 1: 철학 (30분)
  → project-philosophy.md
  → iddl-vs-traditional.md

Step 2: 패턴 심화 (3시간)
  → patterns/ 전체

Step 3: 기여 (∞)
  → how-to/add-new-iddl-role.md
  → 새로운 패턴 문서화
```

### AI/LLM 개발자

```
Step 1: Why IDDL (필수)
  → why-iddl.md
  → "AI 시대의 디자인 시스템" 섹션

Step 2: 구조 이해
  → component-role-mapping.md
  → 100개 컴포넌트 매핑

Step 3: 코드 생성 규칙
  → reference/ (API 스펙)
  → patterns/ (베스트 프랙티스)
```

---

## 🔍 빠른 검색 인덱스

### 주제별

| 주제 | 문서 |
|------|------|
| **IDDL이 뭔가요?** | [why-iddl.md](./2-areas/core/4-explanation/why-iddl.md) |
| **어떻게 시작하나요?** | [getting-started.md](./2-areas/core/1-tutorials/01-getting-started.md) |
| **Field 사용법은?** | [field-reference.md](./2-areas/core/3-reference/field-reference.md) |
| **Modal 만들려면?** | [behavior-patterns](./2-areas/patterns/01-behavior-patterns.md) + [accessibility-patterns](./2-areas/patterns/02-accessibility-patterns.md) |
| **프로젝트 철학은?** | [project-philosophy.md](./2-areas/design-system/project-philosophy.md) |
| **외부 자료는?** | [external-links.md](./3-resources/external-links.md) |

### 컴포넌트별

| 컴포넌트 | 레퍼런스 | 패턴 |
|---------|---------|------|
| **Button** | (예정) | [behavior](./2-areas/patterns/01-behavior-patterns.md), [accessibility](./2-areas/patterns/02-accessibility-patterns.md) |
| **Field** | [field-reference.md](./2-areas/core/3-reference/field-reference.md) | [state](./2-areas/patterns/05-state-patterns.md) |
| **Modal** | (예정) | [behavior](./2-areas/patterns/01-behavior-patterns.md), [animation](./2-areas/patterns/06-animation-patterns.md) |
| **Table** | [component-role-mapping](./2-areas/core/3-reference/component-role-mapping.md) | [data](./2-areas/patterns/03-data-patterns.md), [performance](./2-areas/patterns/08-performance-patterns.md) |

### 문제별

| 문제 | 해결 |
|------|------|
| **일관성 없는 스타일** | [why-iddl.md](./2-areas/core/4-explanation/why-iddl.md) → IDDL 도입 |
| **접근성 부족** | [accessibility-patterns.md](./2-areas/patterns/02-accessibility-patterns.md) |
| **대용량 데이터** | [data-patterns.md](./2-areas/patterns/03-data-patterns.md) |
| **느린 렌더링** | [performance-patterns.md](./2-areas/patterns/08-performance-patterns.md) |
| **복잡한 Form** | [state-patterns.md](./2-areas/patterns/05-state-patterns.md) |

---

## 📊 PARA 운영 가이드

### Projects (1-projects/)
- **추가 시기**: 명확한 목표 + 데드라인 설정 시
- **완료 시**: Areas (지속 관리 필요) 또는 Archive (보관)
- **예시**: "IDDL Renderer 구현 (2025-02-15)"

### Areas (2-areas/)
- **추가 시기**: 지속적으로 유지할 표준/스펙
- **업데이트**: 매주 검토, 매월 추가
- **예시**: IDDL 스펙, 디자인 시스템, 패턴

### Resources (3-resources/)
- **추가 시기**: 참고할 외부 자료 발견 시
- **정리**: 매월 추가, 매 분기 링크 확인
- **예시**: Material Design 가이드, React 아티클

### Archive (4-archive/)
- **이동 시기**: 프로젝트 완료, 3년 미사용
- **삭제**: 3년 이상 Archive에 있고 검색 기록 없음
- **예시**: 2024년 완료 프로젝트

---

## 🔗 외부 링크

### 프로젝트 링크
- **GitHub**: (URL)
- **Demo**: http://localhost:5173
- **Tokens App**: http://localhost:5173/tokens

### 관련 문서
- **README.md** (루트) - 프로젝트 개요
- **CLAUDE.md** (루트) - AI 개발자 가이드

---

## 📝 문서 기여 가이드

### 새 문서 추가 시

1. **적절한 위치 선택**:
   - 프로젝트? → `1-projects/`
   - 표준/스펙? → `2-areas/core/` (Diátaxis 분류)
   - 패턴? → `2-areas/patterns/`
   - 참고 자료? → `3-resources/`

2. **템플릿 사용**:
   - Tutorial: 단계별, 20-30분
   - How-to: 레시피, 10-15분
   - Reference: 완전한 목록, 예제 포함
   - Explanation: 에세이, "왜?"

3. **README 업데이트**:
   - 해당 폴더 README에 링크 추가
   - 이 index.md에 주요 문서 추가

---

## 🎉 마치며

이 문서 구조는 **PARA + Diátaxis**를 결합하여:

- ✅ **프로젝트 관리** (PARA)
- ✅ **학습 지원** (Diátaxis)
- ✅ **빠른 검색** (인덱스)
- ✅ **명확한 진입점** (README)

을 제공합니다.

**질문이 있으신가요?**
- [Why IDDL?](./2-areas/core/4-explanation/why-iddl.md)부터 시작하세요!

---

**Built with ❤️ for Humans and AI**

**마지막 업데이트**: 2025-01-09
