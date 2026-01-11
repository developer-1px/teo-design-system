# 0-core: IDDL 핵심 스펙 문서

이 디렉토리는 **IDDL (Intent-Driven Design Language)의 핵심 스펙 문서**를 담고 있습니다.

## 📄 파일 구조

### 공식 스펙 문서
- **[iddl-1.0-draft.md](./iddl-1.0-draft.md)** - IDDL 1.0 공식 스펙 (영문)
  - IDDL의 전체 구조와 설계 철학
  - 5 Axes 시스템 (Type, Role, Prominence, Intent, Density)
  - 컴포넌트 계층 구조 (Page → Section → Block → Element)

- **[iddl-1.0-spec-ko.md](./iddl-1.0-spec-ko.md)** - IDDL 1.0 공식 스펙 (한글)
  - 한국어 개발자를 위한 상세 설명
  - 디자인 패턴 및 사용 예시

### TypeScript 타입 정의
- **[iddl.d.ts](./iddl.d.ts)** - IDDL TypeScript 타입 정의
  - 모든 IDDL 컴포넌트의 타입
  - Props 인터페이스
  - 렌더러 구현을 위한 타입 시스템

### 레퍼런스
- **[iddl-key-pool.md](./iddl-key-pool.md)** - IDDL 키 풀 레퍼런스
  - 사용 가능한 모든 props 키 목록
  - 각 키의 의미와 사용법

## 🎯 용도

**이 폴더의 문서들은**:
- ✅ **지속적으로 업데이트** - IDDL 스펙이 진화하면 함께 업데이트
- ✅ **모든 컴포넌트의 기준** - 1-page, 2-section, 3-block, 4-element 모두 이 스펙을 따름
- ✅ **렌더러 구현의 근거** - React, Vue, Svelte 렌더러는 이 스펙을 구현

**읽는 순서**:
1. `iddl-1.0-spec-ko.md` - IDDL 개념 이해
2. `iddl.d.ts` - 타입 시스템 파악
3. `iddl-key-pool.md` - 사용 가능한 키 확인

## 🔗 관련 문서

- [../1-page/](../1-page/) - Page 컴포넌트 스펙
- [../2-section/](../2-section/) - Section 컴포넌트 스펙
- [../3-block/](../3-block/) - Block (Group) 컴포넌트 스펙
- [../4-element/](../4-element/) - Element (Item) 컴포넌트 스펙
- [../5-overlay/](../5-overlay/) - Overlay 컴포넌트 스펙
- [../9-meta/](../9-meta/) - 메타 문서 (분석, 로드맵)

---

**최종 업데이트**: 2026-01-11
**버전**: IDDL 1.0
