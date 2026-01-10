# Documentation Reorganization Report (2026-01-10)

**작성일**: 2026-01-10 23:30 (KST)
**작성자**: Antigravity

## 1. 변경 배경 (Why)
IDDL 1.0 Part 1 스펙이 확정됨에 따라, `docs/1-project` 디렉토리에 핵심 스펙(Normative), 가이드(Informative), 분석 보고서(Analysis), 그리고 임시 초안(Drafts)이 혼재되어 있어 정보의 중요도 파악이 어려워졌습니다.
이를 해결하기 위해 문서를 **정보의 성격과 위계**에 따라 재분류하고, 더 이상 유효하지 않은 실험적 문서들을 Archive로 이관하여 문서의 신뢰도를 높이고자 합니다.

## 2. 구조 변경 내역 (Changes)

### 2.1 분류 체계 신설
`docs/1-project/` 하위 구조를 다음과 같이 개편하였습니다.

*   `core/`: **Normative(규범)** 문서. 프로젝트의 "법"이 되는 문서들입니다.
    *   `iddl-1.0-draft.md`: 영문 공식 스펙.
    *   `iddl-1.0-spec-ko.md`: 국문 공식 스펙.
    *   `iddl.d.ts`: 타입 정의 기술 명세.
    *   `ide-design-philosophy.md`: 핵심 철학.
*   `guides/`: **Informative(정보)** 문서. 실제 구현과 사용을 돕는 가이드입니다.
    *   `iddl-1.0-renderer-guide.md`: 렌더러 구현 가이드.
    *   `iddl-1.0-developer-guide-ko.md`: 사용자(개발자) 가이드.
    *   `iddl-1.0-standard-roles.md`: 표준 Role 사전.
    *   `iddl-1.0-migration-guide.md`: 마이그레이션 가이드.
*   `reports/`: 분석 및 보고서. 스펙 결정의 근거가 되는 문서들입니다.
    *   `iddl-role-migration-report.md`: Role 스펙 갭 분석.
    *   `iddl-1.0-assessment.md`: 초기 평가 보고서.

### 2.2 Archiving (청산)
다음 문서들은 `docs/4-archive/2026-01-10-misc-drafts`로 이동되었습니다.

*   `4-headless-hook-implementation.md`: 특정 구현 디테일 제안 (스펙 확정으로 인해 참조용으로 격하).
*   `5-iddl-missing-cases.md`: 초기 누락 케이스 분석 (대부분 스펙에 반영 완료).

## 3. 기대 효과
1.  **가독성 향상**: 새 진입자는 `core` 폴더만 먼저 숙지하면 됩니다.
2.  **유지보수 용이성**: 스펙 변경(`core`)과 가이드 업데이트(`guides`)의 라이프사이클을 분리하여 관리할 수 있습니다.
3.  **신뢰도 확보**: "Draft" 딱지가 붙은 파일들이 메인 폴더에서 사라짐으로써, 남은 문서들이 "공식 스펙"임을 명확히 합니다.
