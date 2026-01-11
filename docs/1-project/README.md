# 1-project: 진행 중인 프로젝트

이 디렉토리는 **현재 진행 중인 프로젝트**를 관리합니다. 프로젝트가 완료되면 해당 문서는 `docs/2-areas/` 또는 `docs/4-archive/`로 이동됩니다.

---

## 📁 현재 프로젝트

### Phase 1 완료 프로젝트 (2026-01-11 시작)

**목표**: IDDL Phase 1 (선언적 UI 렌더링) 100% 완료
**기간**: 4주 (2026-01-11 ~ 2026-02-07)
**현재 진행도**: ~80%

#### 핵심 문서:

1. **[phase-1-implementation-gap-analysis.md](./phase-1-implementation-gap-analysis.md)** ⭐
   - 스펙 vs 구현 갭 분석
   - 컴포넌트별 상세 현황
   - 우선순위 작업 목록

2. **[phase-1-action-plan.md](./phase-1-action-plan.md)** ⭐
   - 4주 실행 계획서
   - Week별 작업 목록
   - 구체적인 파일 경로 및 코드 예시

---

## 🎯 프로젝트 현황 요약

### Phase 1 완료를 위한 핵심 갭

| Component | 스펙 완료 | 구현 완료 | 갭 크기 | 우선순위 |
|-----------|----------|----------|---------|---------|
| Page | ✅ | ✅ | 0% | ✅ 완료 |
| Section | ✅ | ✅ | 0% | ✅ 완료 |
| Block | ⚠️ | 🚧 | **60%** | 🔴 High |
| Text | ⚠️ | ✅ | **20%** | 🟡 Medium |
| Field | ✅ | 🚧 | **43%** | 🔴 High |
| Action | ⚠️ | 🚧 | **40%** | 🟡 Medium |
| Separator | ⚠️ | ✅ | **10%** | 🟢 Low |
| Overlay | ⚠️ | 🚧 | **50%** | 🟡 Medium |

### 가장 큰 갭 Top 3

1. **Block (60%)** - 스펙 문서 부재, Form/List/Grid 미구현
2. **Field (43%)** - 21개 dataType 중 9개 미구현 또는 확인 필요
3. **Overlay (50%)** - Drawer, Toast, Popover 미구현

---

## 📅 4주 로드맵

### Week 1 (Jan 11-17): 핵심 갭 해소
- [ ] Field 21 dataType 완전 구현
- [ ] block.spec.md 작성
- [ ] Form/List/Grid Block role 구현

### Week 2 (Jan 18-24): 스펙 문서 및 Action 완성
- [ ] text.spec.md, action.spec.md 작성
- [ ] Link/MenuItem Action role 구현
- [ ] Toast 시스템 구현

### Week 3 (Jan 25-31): Overlay 완성 및 CVA 표준화 시작
- [ ] overlay.spec.md 작성
- [ ] Drawer 구현
- [ ] CVA Variants 표준화 시작 (50%)

### Week 4 (Feb 1-7): CVA 표준화 완료 및 통합 테스트
- [ ] CVA Variants 표준화 완료 (100%)
- [ ] 통합 테스트 및 버그 수정
- [ ] Phase 1 완료 🎉

---

## 🔴 P0 작업 (긴급)

1. **Field dataType 확인 및 미구현 항목 구현**
   - 현재: 12개 renderer / 목표: 21개 dataType 커버
   - 작업: daterange, multiselect, richtext 구현
   - 기간: 2-3일

2. **block.spec.md 작성**
   - BlockRole 전체 카탈로그 정의
   - Props API 표준화
   - 기간: 1일

3. **Form, List, Grid Block role 구현**
   - 핵심 BlockRole 3개 구현
   - 기간: 2일

---

## 🟡 P1 작업 (높음)

4. **text.spec.md, action.spec.md 작성** (1일)
5. **Link, MenuItem Action role 구현** (1일)
6. **Toast 시스템 구현** (1-2일)
7. **overlay.spec.md 작성 및 Drawer 구현** (2일)
8. **CVA Variants 표준화** (3-4일)

---

## 🟢 P2 작업 (중간 - Phase 2 가능)

9. **separator.spec.md 작성** (0.5일)
10. **Popover, ContextMenu 구현** (2일)
11. **Keyboard shortcut 시스템 통합** (2-3일)
12. **Focus trap 및 Accessibility 개선** (2-3일)

---

## 📊 완료 기준 (Definition of Done)

Phase 1이 완료되었다고 판단하는 기준:

### ✅ 스펙 문서 완료 (7/8)
- [x] Page ✅
- [x] Section ✅
- [ ] Block ⚠️
- [ ] Text ⚠️
- [x] Field ✅
- [ ] Action ⚠️
- [ ] Overlay ⚠️
- [x] Separator (P2)

### ✅ 구현 완료
- [x] Page (4 roles) ✅
- [x] Section (12+ roles) ✅
- [ ] Block (15+ roles) - 최소 Form/List/Grid 필수
- [ ] Text (10 roles)
- [ ] Field (21 dataTypes)
- [ ] Action (4 roles)
- [x] Separator ✅
- [ ] Overlay (최소 Dialog/Drawer/Toast/Tooltip)

### ✅ CVA Variants
- [ ] 모든 컴포넌트에 prominence × intent × density 적용
- [ ] Compound variants 정의
- [ ] 수동 className 최소화

### ✅ Accessibility
- [ ] 모든 컴포넌트에 ARIA 속성
- [ ] 키보드 탐색 지원
- [ ] Focus management
- [ ] Screen reader 지원

---

## 🔗 관련 문서

**비전 & 전략**:
- [../2-areas/core/0-evolution/application-platform-vision.md](../2-areas/core/0-evolution/application-platform-vision.md) - 프로젝트 비전
- [../2-areas/core/0-evolution/phase-1-declarative-ui.md](../2-areas/core/0-evolution/phase-1-declarative-ui.md) - Phase 1 개요

**스펙 문서**:
- [../2-areas/spec/](../2-areas/spec/) - IDDL 스펙 전체

**구현 분석**:
- [../2-areas/spec/9-meta/iddl-coverage-analysis.md](../2-areas/spec/9-meta/iddl-coverage-analysis.md) - 구현 커버리지
- [../2-areas/spec/9-meta/renderer-improvement-roadmap.md](../2-areas/spec/9-meta/renderer-improvement-roadmap.md) - 렌더러 로드맵

---

## 📞 프로젝트 상태 업데이트

**최초 작성**: 2026-01-11
**최종 업데이트**: 2026-01-11
**다음 체크인**: 2026-01-17 (Week 1 완료)

### 주간 체크인 일정:
- **Week 1**: 2026-01-17 (금)
- **Week 2**: 2026-01-24 (금)
- **Week 3**: 2026-01-31 (금)
- **Week 4**: 2026-02-07 (금) - Phase 1 완료 선언

---

## 💡 사용 방법

### 1. 갭 분석 먼저 읽기
```bash
# 스펙 vs 구현 갭 이해
cat docs/1-project/phase-1-implementation-gap-analysis.md
```

### 2. 실행 계획 확인
```bash
# 4주 실행 계획 확인
cat docs/1-project/phase-1-action-plan.md
```

### 3. 작업 시작
- Week별로 작업 진행
- 체크리스트 완료하며 진행
- 문서 업데이트

### 4. 주간 체크인
- 금요일마다 진행 상황 리뷰
- 블로커 공유
- 다음 주 계획 조정

---

**프로젝트 담당**: Claude Code
**승인자**: User
**목표 완료일**: 2026-02-07
