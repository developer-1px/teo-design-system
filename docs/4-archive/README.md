# Archive

이 폴더는 **outdated되었거나 더 이상 사용하지 않는 문서**들을 보관하는 곳입니다.

> ⚠️ **중요**: 이 폴더의 문서들은 참조하지 마세요. 최신 정보는 다른 문서를 참조하세요.

---

## 아카이브 정책

다음 조건에 해당하는 문서는 이 폴더로 이동됩니다:

1. **Outdated** - 최신 버전으로 대체됨
2. **Deprecated** - 더 이상 사용하지 않는 기능/패턴
3. **Duplicate** - 중복 문서 (최신 버전 유지)
4. **Draft** - 임시/초안 문서 (정식 버전 존재)
5. **Personal** - 개인 메모/임시 작업 파일

---

## 폴더 구조

- **`me/`** - 개인 메모, 임시 작업 파일
- **`spec-drafts/`** - 스펙 초안 (정식 버전 존재)
- **`spec-duplicates/`** - 중복 스펙 문서 (대안 유지)
- **`2026-01-registry-standardization/`** - Registry Pattern 표준화 프로젝트 (완료)

---

## 아카이브된 문서 목록

### Personal Notes (`me/`)

- **`role-spec.md`** - IDDL Role Catalog 초안 (개인 메모)
  - **대체 문서**: `/docs/2-areas/spec/` 폴더의 공식 스펙 참조
  - **아카이브 날짜**: 2026-01-11

### Spec Drafts (`spec-drafts/`)

- **`iddl-1.0-draft.md`** - IDDL 1.0 Part 1 초안
  - **대체 문서**: `/docs/2-areas/spec/0-core/iddl-1.0-spec-ko.md` (정식 스펙)
  - **아카이브 날짜**: 2026-01-11

### Duplicate Specs (`spec-duplicates/`)

- **`page.gemini.spec.md`** - Page 컴포넌트 스펙 (Gemini 버전)
  - **대체 문서**: `/docs/2-areas/spec/1-page/page.gpt.spec.md` (GPT 버전 유지)
  - **아카이브 날짜**: 2026-01-11
  - **이유**: 두 AI가 작성한 중복 스펙, GPT 버전이 더 상세함

### Completed Projects (`2026-01-registry-standardization/`)

**프로젝트**: Registry Pattern 표준화
**기간**: 2026-01-11
**상태**: ✅ 완료

**완료된 작업**:
1. **Text Component 통합** (v1/v2 → v2 단일 버전)
2. **Role Component 연동** (Alert, Avatar, Kbd, Tag 4개 renderer 추가)
3. **Registry Pattern 표준화** (전체 7개 IDDL 컴포넌트)
4. **BaseRoleConfig 인터페이스 생성** (`/src/components/types/shared/role.base.ts`)
5. **파일 네이밍 통일** (`role-config.ts` → `role-registry.ts`)
6. **종합 문서 작성** (`/docs/architecture/registry-pattern.md`)

**아카이브된 문서**:
- **`TEXT_COMPONENT_IMPROVEMENT_PROPOSAL.md`** - Text 개선 제안서
- **`TEXT_IMPLEMENTATION_SUMMARY.md`** - Text v2 구현 요약
- **`TEXT_TIME_ROLE_UPDATE.md`** - Time role 업데이트
- **`TEXT_USAGE_EXAMPLES.md`** - Text 사용 예제
- **`phase-1-action-plan.md`** - Phase 1 액션 플랜
- **`phase-1-implementation-gap-analysis.md`** - Phase 1 갭 분석
- **`HISTORY.md`** - 프로젝트 전체 히스토리

**대체 문서**:
- **Primary**: `/docs/architecture/registry-pattern.md` (900줄, 종합 가이드)
- **Spec**: `/docs/2-areas/spec/` (IDDL 공식 스펙)
- **Implementation**: `/src/components/types/*/role-registry.ts` (각 컴포넌트 레지스트리)

**프로젝트 성과**:
- ✅ 100% 타입 안전성 (BaseRoleConfig 기반)
- ✅ 7개 컴포넌트 표준화 (Page, Section, Block, Action, Overlay, Text, Field)
- ✅ Runtime 확장 가능 (custom role registration)
- ✅ 종합 문서화 (900줄 가이드)
- ✅ Zero Breaking Changes (기존 코드 수정 불필요)

---

## 현재 문서 참조

최신 문서는 다음을 참조하세요:

- **학습 가이드**: `/docs/3-learning/` - IDDL 공식 학습 커리큘럼
- **스펙 문서**: `/docs/2-areas/spec/` - IDDL 1.0 공식 스펙
- **프로젝트 개요**: `/CLAUDE.md` - 프로젝트 구조 및 컨벤션
- **문서 인덱스**: `/docs/index.md` - 전체 문서 목차

---

## 문서 복구

아카이브된 문서가 필요한 경우:

1. 이 README에서 아카이브 이유와 대체 문서 확인
2. 대체 문서에서 필요한 정보를 찾을 수 없는 경우에만 아카이브 참조
3. 복구가 필요한 경우 이슈 생성 또는 팀에 문의

---

**최종 업데이트**: 2026-01-11 (Registry Pattern 표준화 프로젝트 아카이브)
**관리자**: IDDL Core Team
