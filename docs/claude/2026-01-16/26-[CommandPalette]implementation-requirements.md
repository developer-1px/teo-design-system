# Command Palette 구현 요구사항 분석

**Date**: 2026-01-16
**Purpose**: 커맨드 팔레트 자체 구현을 위한 기존 컴포넌트 활용 및 신규 개발 항목 정리

---

## 📋 Overview

커맨드 팔레트는 키보드 중심의 빠른 내비게이션 인터페이스로, 사용자가 검색을 통해 액션/페이지/설정 등에 빠르게 접근할 수 있는 기능입니다.

**주요 기능:**
- Cmd+K (Mac) / Ctrl+K (Windows) 단축키로 열기
- 실시간 검색 및 필터링
- 키보드 화살표로 항목 선택 (↑↓)
- Enter로 실행, ESC로 닫기
- 그룹별 커맨드 분류
- 최근 사용 커맨드 표시

---

## ✅ 이미 가지고 있는 컴포넌트/훅

| 컴포넌트/훅 | 파일 위치 | 제공 기능 | 커맨드 팔레트 활용 방안 |
|------------|----------|----------|----------------------|
| **useModal** | `hooks/useModal.ts` | - Focus trap<br>- Scroll lock<br>- ESC 닫기<br>- Backdrop 클릭 닫기<br>- ARIA 속성 자동 생성 | **모달 기본 로직으로 활용**<br>- 백드롭 + ESC 처리<br>- 포커스 트랩으로 모달 내부만 탭 이동<br>- 배경 스크롤 방지 |
| **Overlay** | `Overlay.tsx` | - Portal 렌더링<br>- 절대/고정 포지셔닝<br>- 외부 클릭 감지<br>- z-index 관리 | **모달 컨테이너로 활용**<br>- 화면 중앙 고정 포지셔닝<br>- 높은 z-index로 최상단 표시 |
| **useDropdown** | `hooks/useDropdown.ts` | - 키보드 네비게이션 (↑↓)<br>- 아이템 하이라이트<br>- 선택 상태 관리<br>- ARIA listbox 패턴 | **결과 리스트 네비게이션**<br>- 화살표 키로 항목 이동<br>- Enter로 선택 실행<br>- 하이라이트 상태 관리 |
| **Field** | `Field.tsx` | - 입력 필드 UI<br>- 아이콘 지원<br>- 스타일 일관성 | **검색 입력 필드**<br>- 돋보기 아이콘 표시<br>- 실시간 검색어 입력 |
| **Frame** | `Frame/Frame.tsx` | - 레이아웃 프리미티브<br>- 토큰 기반 스타일<br>- Flexbox/Grid | **모든 레이아웃 구성**<br>- 모달 컨테이너<br>- 리스트 아이템<br>- 그룹 구조 |
| **Action** | `Action.tsx` | - 버튼 컴포넌트<br>- 아이콘 + 텍스트<br>- 인터랙티브 스타일 | **클릭 가능한 커맨드 아이템**<br>- Hover/Active 상태 표시 |
| **Text.Menu** | `text/context/Menu.tsx` | - 메뉴 아이템 텍스트<br>- 그룹 라벨 텍스트 | **커맨드 텍스트 스타일**<br>- 아이템 라벨<br>- 그룹 헤더 |
| **Icon** | `Icon.tsx` | - Lucide 아이콘 래퍼<br>- 크기 토큰 지원 | **커맨드 아이콘 표시**<br>- 각 커맨드 아이콘<br>- 검색 아이콘 |
| **Separator** | `Separator.tsx` | - 수평/수직 구분선 | **그룹 구분선**<br>- 커맨드 그룹 사이 |
| **useFocusTrap** | `hooks/utils/useFocusTrap.ts` | - 포커스 트랩 로직<br>- 초기 포커스 설정 | useModal에 포함 |
| **useScrollLock** | `hooks/utils/useScrollLock.ts` | - 배경 스크롤 방지 | useModal에 포함 |
| **useId** | `hooks/utils/useId.ts` | - 고유 ID 생성 | ARIA ID 생성 |
| **useControlledState** | `hooks/utils/useControlledState.ts` | - Controlled/Uncontrolled 상태 | 검색어 상태 관리 |

---

## 🆕 새로 만들어야 하는 컴포넌트/훅

| 항목 | 타입 | 설명 | 구현 이유 |
|------|------|------|----------|
| **CommandPalette** | Component | 메인 커맨드 팔레트 컴포넌트 | **통합 컴포넌트 필요**<br>- 모든 하위 컴포넌트 조합<br>- 컨텍스트 프로바이더 역할<br>- 공개 API 제공 |
| **useCommandPalette** | Hook | 커맨드 팔레트 전용 로직 훅 | **통합 로직 필요**<br>- useModal + useDropdown 결합<br>- 검색 상태 + 선택 상태 통합<br>- 커맨드 실행 로직<br>- 최근 사용 커맨드 관리 |
| **CommandInput** | Component | 검색 입력 필드 (Field 확장) | **전용 입력 필드 필요**<br>- 자동 포커스<br>- 검색 아이콘 고정<br>- Placeholder "Search commands..."<br>- 검색어 초기화 버튼 (X) |
| **CommandList** | Component | 스크롤 가능한 결과 리스트 | **결과 표시 컨테이너**<br>- 가상 스크롤 (많은 아이템 대응)<br>- 최대 높이 제한<br>- 스크롤 영역 관리 |
| **CommandItem** | Component | 개별 커맨드 아이템 | **커맨드 표시 컴포넌트**<br>- 아이콘 + 라벨 + 단축키<br>- 하이라이트 상태 표시<br>- 최근 사용 표시 (별표 등)<br>- 키보드 네비게이션 대응 |
| **CommandGroup** | Component | 커맨드 그룹 (헤더 + 아이템들) | **논리적 그룹핑**<br>- 그룹 라벨 (예: "Navigation", "Actions")<br>- Separator 자동 삽입<br>- 조건부 렌더링 (검색 결과 없으면 숨김) |
| **CommandEmpty** | Component | 검색 결과 없음 상태 | **빈 상태 표시**<br>- "No results found" 메시지<br>- 제안 텍스트 표시 가능<br>- 중앙 정렬, 회색 텍스트 |
| **CommandShortcut** | Component | 키보드 단축키 표시 (예: ⌘K) | **단축키 시각화**<br>- Kbd 스타일<br>- 플랫폼별 표시 (Mac/Win)<br>- 우측 정렬 |
| **useHotkey** | Hook | 글로벌 키보드 단축키 등록 | **Cmd+K 감지 필요**<br>- 글로벌 키 리스너<br>- 플랫폼 감지 (Mac/Win)<br>- 충돌 방지 로직 |
| **useFuzzySearch** | Hook | 퍼지 검색 알고리즘 | **스마트 검색 필요**<br>- 부분 일치<br>- 순서 무관 매칭<br>- 점수 기반 정렬<br>- 예: "gf" → "Go to File" |
| **CommandContext** | Context | 커맨드 팔레트 상태 공유 | **상태 공유 필요**<br>- 검색어<br>- 선택된 인덱스<br>- 필터링된 커맨드 리스트<br>- 커맨드 실행 함수 |
| **useRecentCommands** | Hook | 최근 사용 커맨드 추적 | **사용자 경험 개선**<br>- localStorage 저장<br>- 빈도/최신 순 정렬<br>- 최대 개수 제한 (10개) |
| **filterCommands** | Util | 커맨드 필터링 유틸 함수 | **검색 로직 분리**<br>- 검색어로 커맨드 필터링<br>- 그룹 필터링<br>- 비활성 커맨드 제외 |
| **useVirtualScroll** | Hook (Optional) | 가상 스크롤 최적화 | **성능 최적화**<br>- 수백 개 커맨드 대응<br>- 보이는 영역만 렌더링<br>- 스크롤 성능 개선<br>- (선택사항: 초기엔 생략 가능) |

---

## 🏗️ 구현 우선순위

### Phase 1: 핵심 기능 (MVP)
1. ✅ **CommandPalette** - 메인 컴포넌트
2. ✅ **useCommandPalette** - 통합 로직
3. ✅ **CommandInput** - 검색 입력
4. ✅ **CommandList** - 결과 리스트
5. ✅ **CommandItem** - 개별 아이템
6. ✅ **useHotkey** - Cmd+K 단축키
7. ✅ **filterCommands** - 기본 검색

### Phase 2: 사용성 개선
8. ✅ **CommandGroup** - 그룹핑
9. ✅ **CommandEmpty** - 빈 상태
10. ✅ **CommandShortcut** - 단축키 표시
11. ✅ **useRecentCommands** - 최근 사용

### Phase 3: 고급 기능
12. ⚠️ **useFuzzySearch** - 퍼지 검색
13. ⚠️ **useVirtualScroll** - 가상 스크롤 (선택)

---

## 📐 컴포넌트 구조 예시

```tsx
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={commands}
>
  <CommandInput placeholder="Search commands..." />

  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>

    <CommandGroup heading="Navigation">
      <CommandItem
        icon={<Home />}
        onSelect={() => navigate('/')}
        shortcut="⌘H"
      >
        Go to Home
      </CommandItem>
      <CommandItem
        icon={<Settings />}
        onSelect={() => navigate('/settings')}
        shortcut="⌘,"
      >
        Open Settings
      </CommandItem>
    </CommandGroup>

    <CommandGroup heading="Actions">
      <CommandItem
        icon={<Plus />}
        onSelect={() => createNew()}
        shortcut="⌘N"
      >
        Create New
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandPalette>
```

---

## 🔑 핵심 로직 플로우

### 1. 열기/닫기
```
User: Cmd+K 누름
  ↓
useHotkey: 감지
  ↓
setOpen(true)
  ↓
CommandPalette: 렌더링
  ↓
useModal: focus trap + scroll lock
  ↓
CommandInput: 자동 포커스
```

### 2. 검색 & 선택
```
User: 타이핑
  ↓
searchQuery 업데이트
  ↓
filterCommands 실행
  ↓
filteredCommands 업데이트
  ↓
CommandList: 재렌더링
  ↓
User: ↓ 키 누름
  ↓
useDropdown: highlightedIndex++
  ↓
CommandItem: 하이라이트 표시
  ↓
User: Enter 누름
  ↓
선택된 커맨드 실행
  ↓
useRecentCommands: 기록 저장
  ↓
setOpen(false)
```

### 3. 퍼지 검색 (Phase 3)
```
searchQuery: "gf"
  ↓
useFuzzySearch:
  - "Go to File" → 매치 (점수: 0.9)
  - "Git Fetch" → 매치 (점수: 0.7)
  - "Save File" → 불일치
  ↓
점수 순 정렬
  ↓
상위 결과 표시
```

---

## 🎨 디자인 토큰 활용

| 요소 | 토큰 | 값 |
|------|------|-----|
| 모달 배경 | `surface="raised"` | 부각된 레이어 |
| 입력 필드 | `surface="sunken"` | 음각 효과 |
| 리스트 최대 높이 | `Size.n480` | 480px |
| 아이템 패딩 | `Space.n12` | 12px |
| 그룹 간격 | `Space.n16` | 16px |
| 아이템 간격 | `Space.n4` | 4px |
| 아이콘 크기 | `IconSize.n16` | 16px |
| 하이라이트 배경 | `surface="selected"` | 선택 상태 |
| 둥근 모서리 | `Radius2.lg` | 8px |
| 모달 너비 | `Size.n640` | 640px |

---

## ⚠️ 주의사항

### 기존 컴포넌트 재사용 시
1. **useModal vs useDropdown 충돌 방지**
   - useModal의 ESC 처리와 useDropdown의 ESC 처리가 중복될 수 있음
   - useCommandPalette에서 통합 관리 필요

2. **Field 컴포넌트 확장**
   - Field는 label이 있지만 CommandInput은 label 불필요
   - 별도 컴포넌트로 만들거나 Field의 label={undefined} 사용

3. **Action vs CommandItem**
   - Action은 버튼이지만 CommandItem은 리스트 아이템
   - role="option"으로 변경 필요
   - Frame 기반으로 새로 만드는 것이 적합

### 성능 고려사항
1. **많은 커맨드 처리**
   - 100개 이상의 커맨드: useVirtualScroll 고려
   - 그 이하: 일반 렌더링으로 충분

2. **검색 최적화**
   - useMemo로 필터링 결과 캐싱
   - debounce 고려 (입력 빈도 높을 경우)

3. **최근 사용 저장**
   - localStorage 용량 제한 (최대 10개)
   - JSON.parse 에러 처리

---

## 📚 참고 구현

**영감을 받을 수 있는 라이브러리:**
- **cmdk** (Vercel) - 가장 인기 있는 커맨드 팔레트
- **kbar** (Tim Neutkens)
- **Raycast** (데스크톱 앱)

**하지만 자체 구현 이유:**
- MDK 디자인 시스템 완전 통합
- 토큰 시스템 활용
- 불필요한 의존성 제거
- 학습 목적

---

## 🎯 성공 기준

### 필수 기능
- ✅ Cmd+K로 열기
- ✅ 실시간 검색
- ✅ 키보드 네비게이션 (↑↓ Enter ESC)
- ✅ 그룹별 커맨드 분류
- ✅ 빈 상태 표시

### 선택 기능
- ⚠️ 퍼지 검색
- ⚠️ 최근 사용 표시
- ⚠️ 가상 스크롤
- ⚠️ 커맨드 아이콘
- ⚠️ 단축키 표시

### 접근성
- ✅ ARIA listbox/option 패턴
- ✅ 키보드 전용 사용 가능
- ✅ 스크린 리더 지원
- ✅ Focus trap

### 성능
- ✅ 빠른 열기/닫기 (<100ms)
- ✅ 부드러운 검색 (no lag)
- ⚠️ 100+ 커맨드에서도 성능 유지

---

**작성자**: Claude Code
**마지막 업데이트**: 2026-01-16
**관련 문서**:
- `docs/0-best/19-headless-vs-ui-component-philosophy.md`
- `docs/0-best/15-three-tier-as-core-concept.md`
