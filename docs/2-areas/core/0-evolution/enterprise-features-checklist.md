# 엔터프라이즈 기능 체크리스트

> **VS Code, Figma, Notion에 당연히 있는 기능들**

**목표**: 엔터프라이즈급 애플리케이션의 기본 기능을 Full Package로 제공

**Last Updated**: 2026-01-11

---

## 📋 목차

1. [Core Features (핵심 기능)](#core-features-핵심-기능)
2. [Navigation (네비게이션)](#navigation-네비게이션)
3. [Editing (편집)](#editing-편집)
4. [Layout (레이아웃)](#layout-레이아웃)
5. [System (시스템)](#system-시스템)
6. [Integration (통합)](#integration-통합)

---

## Legend (범례)

| 상태 | 의미 |
|------|------|
| ✅ | 완료 (Production ready) |
| 🚧 | 진행 중 (Partial implementation) |
| 🎯 | 계획됨 (Phase 2-3) |
| ❌ | 미계획 (Out of scope) |

---

## 1. Core Features (핵심 기능)

### 1.1 Command Palette

**참고**: VS Code (Cmd+Shift+P), Figma (Cmd+/), Notion (Cmd+K)

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 글로벌 명령 검색 | ✅ | ✅ | ✅ | `CommandPalette.tsx` |
| 키보드 단축키 (Cmd+K) | ✅ | ✅ | ✅ | `useShortcut` |
| Fuzzy search | ✅ | ✅ | 🚧 | `CommandPalette.tsx` (부분) |
| 최근 명령 | ✅ | ✅ | 🎯 | - |
| 명령 카테고리 | ✅ | ✅ | 🎯 | - |
| 커스텀 명령 등록 | ✅ | ✅ | 🎯 | - |

**현재 상태**: 기본 구조 완성, 검색 기능 개선 필요

---

### 1.2 Global Search

**참고**: VS Code (Cmd+Shift+F), Figma (Cmd+/), Notion (Cmd+P)

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 파일/콘텐츠 검색 | ✅ | ✅ | 🚧 | `SearchModal.tsx` |
| 정규식 지원 | ✅ | - | 🎯 | - |
| 대소문자 구분 | ✅ | ✅ | 🎯 | - |
| 검색 히스토리 | ✅ | ✅ | 🎯 | - |
| 검색 결과 미리보기 | ✅ | ✅ | 🎯 | - |
| 바꾸기 (Replace) | ✅ | - | 🎯 | - |

**현재 상태**: 기본 UI 완성, 검색 로직 미구현

---

### 1.3 Settings / Preferences

**참고**: VS Code (Cmd+,), Figma (Settings panel)

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 설정 패널 | ✅ | ✅ | ✅ | `SettingsModal.tsx` |
| 검색 가능한 설정 | ✅ | ✅ | 🚧 | `SettingsModal.tsx` (부분) |
| 카테고리 구분 | ✅ | ✅ | ✅ | `SettingsModal.tsx` |
| 사용자/워크스페이스 설정 | ✅ | - | 🎯 | - |
| 설정 동기화 | ✅ | ✅ | ❌ | - |
| JSON 편집 모드 | ✅ | - | 🎯 | - |

**현재 상태**: UI 완성, 실제 설정 저장 로직 필요

---

## 2. Navigation (네비게이션)

### 2.1 Keyboard Navigation

**참고**: 모든 엔터프라이즈 앱의 필수 기능

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| Tab 네비게이션 | ✅ | ✅ | 🚧 | `useFocusScope` (부분) |
| 방향키 이동 | ✅ | ✅ | 🚧 | `useNavigableCursor` |
| Enter/Space 활성화 | ✅ | ✅ | 🚧 | - |
| Esc 닫기 | ✅ | ✅ | ✅ | Overlay 컴포넌트 |
| Cmd+숫자 패널 전환 | ✅ | - | 🎯 | - |
| Cmd+Shift+[/] 패널 이동 | ✅ | - | 🎯 | - |

**현재 상태**: 기본 hooks 있음, 선언적 API 필요

---

### 2.2 Focus Management

**참고**: 모달, 사이드바 등의 포커스 관리

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| Focus Scope | ✅ | ✅ | ✅ | `useFocusScope` |
| Focus Trap (모달) | ✅ | ✅ | 🚧 | Overlay 컴포넌트 (부분) |
| Focus Restore (모달 닫기 후) | ✅ | ✅ | 🎯 | - |
| Focus visible (키보드만) | ✅ | ✅ | ✅ | CSS `:focus-visible` |
| 프로그래밍 방식 포커스 | ✅ | ✅ | 🎯 | - |

**현재 상태**: Scope 관리 가능, Trap/Restore 개선 필요

---

### 2.3 Tree Navigation

**참고**: 파일 트리, 계층 구조 네비게이션

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 방향키 이동 (↑↓←→) | ✅ | ✅ | ✅ | `useTreeNavigation` |
| Enter 펼치기/접기 | ✅ | ✅ | 🚧 | `useTreeNavigation` (부분) |
| Home/End 첫/끝 | ✅ | ✅ | 🎯 | - |
| PageUp/PageDown | ✅ | - | 🎯 | - |
| Type-ahead 검색 | ✅ | - | 🎯 | - |

**현재 상태**: 기본 구조 있음, 선언적 API 필요

---

## 3. Editing (편집)

### 3.1 Selection System

**참고**: VS Code, Figma의 다중 선택

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 단일 선택 (클릭) | ✅ | ✅ | 🎯 | - |
| 다중 선택 (Cmd+클릭) | ✅ | ✅ | 🎯 | - |
| 범위 선택 (Shift+클릭) | ✅ | ✅ | 🎯 | - |
| 전체 선택 (Cmd+A) | ✅ | ✅ | 🎯 | - |
| 선택 해제 (Esc) | ✅ | ✅ | 🎯 | - |
| 선택 반전 | ✅ | - | 🎯 | - |

**현재 상태**: 미구현 (Phase 3 목표)

---

### 3.2 Undo/Redo

**참고**: 모든 엔터프라이즈 앱의 필수 기능

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| Undo (Cmd+Z) | ✅ | ✅ | 🎯 | - |
| Redo (Cmd+Shift+Z) | ✅ | ✅ | 🎯 | - |
| 히스토리 스택 | ✅ | ✅ | 🎯 | - |
| 히스토리 뷰어 | ✅ | ✅ | 🎯 | - |
| 선택적 Undo | - | ✅ | ❌ | - |

**현재 상태**: 미구현 (Phase 2-3 목표)

---

### 3.3 Drag & Drop

**참고**: VS Code의 파일 이동, Figma의 레이어 순서 변경

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 항목 드래그 | ✅ | ✅ | 🎯 | - |
| 드롭 영역 표시 | ✅ | ✅ | 🎯 | - |
| 순서 변경 | ✅ | ✅ | 🚧 | `SortableList` (부분) |
| 복사 (Alt+드래그) | ✅ | ✅ | 🎯 | - |
| 취소 (Esc) | ✅ | ✅ | 🎯 | - |

**현재 상태**: SortableList 컴포넌트 있음, 범용 시스템 필요

---

### 3.4 Copy/Paste

**참고**: 클립보드 관리

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| Copy (Cmd+C) | ✅ | ✅ | 🎯 | - |
| Cut (Cmd+X) | ✅ | ✅ | 🎯 | - |
| Paste (Cmd+V) | ✅ | ✅ | 🎯 | - |
| Duplicate (Cmd+D) | ✅ | ✅ | 🎯 | - |
| 클립보드 히스토리 | ✅ | - | ❌ | - |

**현재 상태**: 미구현

---

## 4. Layout (레이아웃)

### 4.1 Panel Resizing

**참고**: VS Code의 사이드바, 패널 크기 조절

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 드래그 리사이징 | ✅ | ✅ | ✅ | `useResizable` |
| 더블클릭 초기화 | ✅ | - | 🎯 | - |
| 최소/최대 크기 제한 | ✅ | ✅ | ✅ | `useResizable` |
| 키보드 리사이징 | ✅ | - | 🎯 | - |
| 비율 저장 | ✅ | ✅ | 🎯 | - |

**현재 상태**: 기본 기능 구현, 세부 개선 필요

---

### 4.2 Panel Toggle

**참고**: 패널 보이기/숨기기

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 패널 토글 (Cmd+B) | ✅ | ✅ | 🎯 | - |
| 패널 접기/펼치기 | ✅ | ✅ | 🎯 | - |
| 전체화면 (Cmd+Ctrl+F) | ✅ | - | 🎯 | - |
| Zen 모드 | ✅ | - | ❌ | - |

**현재 상태**: 미구현

---

### 4.3 Split View

**참고**: VS Code의 에디터 분할

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 가로 분할 | ✅ | - | 🎯 | - |
| 세로 분할 | ✅ | - | 🎯 | - |
| 그리드 분할 | ✅ | - | 🎯 | - |
| 분할 크기 조절 | ✅ | - | 🎯 | - |

**현재 상태**: 미구현

---

## 5. System (시스템)

### 5.1 Theme System

**참고**: light/dark 테마, 커스텀 테마

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| Light/Dark 모드 | ✅ | ✅ | ✅ | `theme.ts` |
| Color scheme 변경 | ✅ | - | ✅ | `theme.ts` (emerald/blue/purple/red) |
| Density 변경 | - | - | ✅ | `theme.ts` (compact/normal/comfortable) |
| 커스텀 테마 | ✅ | - | 🎯 | - |
| 테마 미리보기 | ✅ | - | 🎯 | - |

**현재 상태**: 기본 테마 시스템 완성

---

### 5.2 Accessibility

**참고**: 스크린 리더, 키보드 접근성

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| ARIA labels | ✅ | ✅ | 🚧 | 컴포넌트별 부분 구현 |
| 시맨틱 HTML | ✅ | ✅ | 🚧 | IDDL role 기반 |
| 키보드 네비게이션 | ✅ | ✅ | 🚧 | `keyboard/` |
| 스크린 리더 지원 | ✅ | 🚧 | 🎯 | - |
| High contrast 모드 | ✅ | - | 🎯 | - |
| 색상 대비 (WCAG AA) | ✅ | ✅ | 🚧 | 토큰 시스템 |

**현재 상태**: 부분 구현, 체계적 개선 필요

---

### 5.3 Shortcuts System

**참고**: 전역 단축키 관리

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 글로벌 단축키 | ✅ | ✅ | ✅ | `useShortcut` |
| 단축키 충돌 감지 | ✅ | - | 🎯 | - |
| 단축키 커스터마이징 | ✅ | - | 🎯 | - |
| 단축키 목록 보기 | ✅ | ✅ | 🎯 | - |
| Context별 단축키 | ✅ | ✅ | 🎯 | - |

**현재 상태**: 기본 hook 있음, 관리 시스템 필요

---

### 5.4 Notifications

**참고**: 알림, 토스트 메시지

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| Toast 알림 | ✅ | ✅ | 🎯 | - |
| Progress notification | ✅ | - | 🎯 | - |
| 알림 센터 | ✅ | - | 🎯 | - |
| 알림 설정 | ✅ | - | 🎯 | - |

**현재 상태**: 미구현

---

## 6. Integration (통합)

### 6.1 Context Menu

**참고**: 우클릭 메뉴

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 우클릭 메뉴 | ✅ | ✅ | 🎯 | - |
| Context별 메뉴 항목 | ✅ | ✅ | 🎯 | - |
| 메뉴 아이템 아이콘 | ✅ | ✅ | 🎯 | - |
| 서브메뉴 | ✅ | ✅ | 🎯 | - |
| 단축키 표시 | ✅ | - | 🎯 | - |

**현재 상태**: 미구현

---

### 6.2 Tooltips

**참고**: 호버 시 설명

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| 기본 Tooltip | ✅ | ✅ | ✅ | `Tooltip` role |
| Rich Tooltip (포맷팅) | ✅ | - | 🎯 | - |
| 단축키 표시 | ✅ | ✅ | 🎯 | - |
| 딜레이 설정 | ✅ | ✅ | 🎯 | - |

**현재 상태**: 기본 구현, 개선 필요

---

### 6.3 Modals & Overlays

**참고**: 다이얼로그, 드로어

| 기능 | VS Code | Figma | 이 프로젝트 | 구현 위치 |
|------|---------|-------|------------|----------|
| Modal Dialog | ✅ | ✅ | 🚧 | `Overlay.tsx` (부분) |
| Drawer (사이드 패널) | ✅ | - | 🎯 | - |
| Popover | ✅ | ✅ | 🎯 | - |
| 모달 스택 관리 | ✅ | ✅ | 🎯 | - |

**현재 상태**: 기본 구조, 완성 필요

---

## 7. 우선순위 로드맵

### Phase 1 (현재 - 2026-01)

**목표**: 화면 렌더링 완성

✅ 완료:
- Theme System
- Layout System (depth, resizable)
- IDDL Inspector

🚧 진행 중:
- CVA Variants
- Field dataType

---

### Phase 2 (2026-02 - 2026-03)

**목표**: 데이터 & 인터랙션 기본

🎯 계획:
- Keyboard Navigation (선언적 API)
- Focus Management (Trap, Restore)
- Selection System (단일/다중 선택)
- Undo/Redo

---

### Phase 3 (2026-04 - 2026-06)

**목표**: 엔터프라이즈 기능 완성

🎯 계획:
- Drag & Drop
- Context Menu
- Split View
- Notifications
- Advanced Search
- Shortcuts Management

---

## 8. 경쟁 분석

### VS Code

**강점**:
- 완벽한 키보드 네비게이션
- 확장 가능한 Command Palette
- 강력한 Search & Replace

**우리가 배울 점**:
- 단축키 시스템의 일관성
- Command Palette 검색 알고리즘
- 패널 레이아웃 저장/복원

---

### Figma

**강점**:
- 직관적인 선택 시스템
- 부드러운 애니메이션
- 실시간 협업

**우리가 배울 점**:
- 다중 선택 UX
- Context Menu 구성
- Drag & Drop 피드백

---

### Notion

**강점**:
- 간단한 Command Palette
- 블록 기반 편집
- 템플릿 시스템

**우리가 배울 점**:
- 빠른 검색 UX
- 설정 패널 구성
- 온보딩 경험

---

## 9. 관련 문서

- [Application Platform Vision](./application-platform-vision.md) - 전체 비전
- [Phase 1: Declarative UI](./phase-1-declarative-ui.md) - 현재 단계
- [IDE Design Philosophy](./ide-design-philosophy.md) - 디자인 철학

---

**Last Updated**: 2026-01-11
**Total Features**: 100+
**Implemented**: ~30% (Phase 1 집중)
**Target**: 80% by 2026-06 (Phase 3 완료)
