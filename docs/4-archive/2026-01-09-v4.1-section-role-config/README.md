# Section v4.1 Role Configuration 중앙화 (2026-01-09)

**아카이브 날짜**: 2026-01-09
**버전**: IDDL v4.0 → v4.1
**주요 변경**: Section Role Configuration 중앙화

## 주요 변경사항

### v4.0 (이전)
- Section renderer마다 개별적으로 스타일, overflow 하드코딩
- gridArea, htmlTag, ariaProps 매핑이 Section.tsx에 분산
- Template-aware validation만 지원

### v4.1 (현재)
- **role-config.ts** 중앙 설정 파일 도입
- 모든 Section role 속성 통합 관리:
  - `gridArea`: CSS Grid 배치
  - `overflow`: 스크롤 동작 (Page 책임)
  - `htmlTag`: 시맨틱 HTML 태그
  - `ariaProps`: 접근성 속성
  - `baseStyles`: Tailwind 클래스
- Renderer 단순화 (외부 주입 방식)

## 아카이브된 파일

### 2-react-redender.md
- **내용**: v4.0 React Renderer 구현 가이드
- **상태**: v4.1에서 role-config.ts로 대체됨
- **이유**: 중앙화된 설정 시스템으로 전환

### 3-how-to-renderer.md
- **내용**: v4.0 Renderer 작성 방법
- **상태**: v4.1에서 Renderer 패턴 단순화됨
- **이유**: 외부 주입 방식으로 변경되어 복잡도 감소

## 새로운 문서 위치

v4.1 관련 최신 문서는 다음 위치에서 확인하세요:

- **Section v4.1 스펙**: `/docs/2-areas/core/3-reference/section-v4.1-spec.md`
- **Page-Section Overflow 정책**: `/docs/2-areas/core/3-reference/page-section-overflow-policy.md`
- **Template-aware Architecture**: `/docs/2-areas/core/3-reference/template-aware-architecture.md`
- **IDDL v4.1 스펙**: `/docs/2-areas/spec/iddl-spec-1.0.1.md` (업데이트 예정)

## 참고

이 아카이브는 IDDL v4.0에서 v4.1로의 전환 과정을 기록합니다. v4.0의 개별 renderer 패턴에서 v4.1의 중앙화된 role-config 시스템으로 전환되었습니다.
