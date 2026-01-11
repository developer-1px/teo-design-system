# 웹 vs 앱: 본질적 차이와 Behavior Intent

## 📋 요약

**웹**: 읽기 중심 (Document) - "페이지를 본다"
**앱**: 조작 중심 (Tool) - "도구를 쓴다"

**핵심 차이**: 웹은 탐색(읽기) 후 클릭, 앱은 **선택(Select) 후 조작(Act)**

---

## Why: 웹 vs 앱의 본질적 차이

### 웹 (Document)

```
사용자 → 읽는다 → 클릭한다 → 이동한다

- 탐색: 링크 클릭
- 선택: 없음 (텍스트 드래그 정도)
- 키보드: Tab으로 폼 이동
- 멘탈모델: "페이지를 본다"
```

**특징**:
- 정보 소비가 목적
- 하이퍼링크 중심
- 페이지 단위 이동
- 마우스/터치 중심

### 앱 (Tool)

```
사용자 → 선택한다 → 조작한다 → 결과를 본다

- 탐색: 키보드로 빠르게 이동
- 선택: 대상을 선택 → 액션 적용
- 키보드: 모든 조작이 키보드로 가능
- 멘탈모델: "도구를 쓴다"
```

**특징**:
- 작업 수행이 목적
- 객체 선택/조작 중심
- 화면 내 인터랙션
- 키보드 네비게이션 필수

---

## 앱의 핵심 패턴: Navigate → Select → Act

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   1. Navigate    →    2. Select    →    3. Act         │
│   (대상 찾기)          (대상 지정)        (조작)         │
│                                                         │
│   ↑↓←→ 이동           Click/Space      Delete/Enter    │
│   Tab 전환             Shift+범위       Ctrl+C/V        │
│   검색/필터            Ctrl+A 전체      Drag 이동       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**이 세 단계가 매끄럽지 않으면 앱이 아니라 웹페이지입니다.**

---

## Real-world 예제 비교

### 예제 1: 이메일 삭제

**웹 (Gmail 초기)**:
1. 이메일 제목 클릭 → 상세 페이지 이동
2. 삭제 버튼 클릭 → 확인 팝업
3. 확인 → 목록으로 돌아감

**앱 (Gmail 현재, Outlook)**:
1. ↑↓로 이메일 탐색
2. Space로 선택 (또는 Shift+범위 선택)
3. Delete 키 → 즉시 삭제

### 예제 2: 슬라이드 편집 (PPT)

**웹 (Google Slides 초기)**:
1. 썸네일 클릭 → 편집 모드
2. 텍스트 박스 클릭 → 편집
3. 다른 슬라이드 보려면 다시 썸네일 클릭

**앱 (PowerPoint, Keynote)**:
1. ↑↓로 썸네일 탐색
2. Enter로 선택 → 편집 모드
3. Esc로 썸네일로 복귀 (포커스 유지)

### 예제 3: 파일 관리

**웹 (파일 공유 사이트)**:
1. 파일명 클릭 → 다운로드 또는 미리보기
2. 한 번에 한 파일만 조작 가능

**앱 (Finder, Windows Explorer)**:
1. ↑↓로 파일 탐색
2. Space로 선택 (Cmd+클릭으로 다중 선택)
3. Cmd+C → Cmd+V로 복사/붙여넣기

---

## 왜 이것이 중요한가?

### 1. 생산성
- **웹**: 클릭 → 로딩 → 클릭 → 로딩 (느림)
- **앱**: 선택 → 즉시 조작 (빠름)

### 2. 학습 곡선
- **웹**: "어디를 클릭해야 하지?" (탐색 위주)
- **앱**: "어떤 키를 누르지?" (패턴 학습 후 자동화)

### 3. 접근성
- **웹**: 마우스 의존 → 키보드만으로 사용 어려움
- **앱**: 키보드 우선 → 마우스 없어도 모든 조작 가능

### 4. 파워유저 경험
- **웹**: 빠른 사용자도 마우스 클릭 반복
- **앱**: 단축키로 속도 10배 향상

---

## IDDL의 도전: 앱 수준 인터랙션 선언

### 기존 IDDL (Phase 1 - Visual Intent)

```tsx
// "어떻게 보일까?" (How)
<Action prominence="Primary" intent="Brand">
  Save
</Action>

// "왜 중요한가?" (Why - Visual)
prominence="Primary"  → "시각적으로 중요하다"
intent="Brand"        → "브랜드 액션이다"
```

### 새로운 도전 (Phase 3 - Behavior Intent)

```tsx
// "어떻게 동작할까?" (How - Behavior)
<Block
  role="List"
  behavior={{
    navigable: true,    // ↑↓로 탐색 가능
    selectable: true,   // Space로 선택 가능
  }}
>
  {items.map(item => <Item>{item}</Item>)}
</Block>

// "왜 이 동작이 필요한가?" (Why - Behavior)
navigable: true   → "키보드로 탐색할 수 있어야 한다"
selectable: true  → "조작 대상을 지정할 수 있어야 한다"
```

---

## Behavior Intent의 4가지 핵심

| Intent | Why (목적) | How (조작) |
|--------|-----------|-----------|
| **Navigable** | 대상을 찾을 수 있어야 한다 | ↑↓←→, Tab, 검색 |
| **Selectable** | 대상을 지정할 수 있어야 한다 | Click, Space, Shift+범위 |
| **FocusScope** | 맥락을 유지해야 한다 | 모달 내 Tab, Esc 복귀 |
| **Reorderable** | 순서를 바꿀 수 있어야 한다 | Drag, Ctrl+↑↓ |

---

## 1차 목표: Navigable + Selectable

### Why 이 두 개만?

**이유**:
- Navigate → Select는 앱의 핵심 패턴
- Act(조작)는 개별 액션의 문제 (Delete, Copy 등)
- FocusScope는 고급 기능 (모달, 다이얼로그)
- Reorderable은 특수 케이스 (Drag & Drop)

**Navigable + Selectable만 있으면**:
```
사용자 → ↑↓로 탐색 → Space로 선택 → Delete/Enter로 조작

이것만으로도 90%의 앱 인터랙션이 해결됨
```

---

## 다음 단계

1. **Navigable 스펙 작성** (`02-navigable.md`)
   - 키보드 네비게이션 패턴
   - ARIA 접근성
   - IDDL API 설계

2. **Selectable 스펙 작성** (`03-selectable.md`)
   - 단일/다중 선택
   - 범위 선택 (Shift)
   - 전체 선택 (Ctrl+A)
   - IDDL API 설계

3. **PPT 썸네일 예제** (`04-ppt-thumbnail-example.md`)
   - Navigable + Selectable 통합
   - 실제 구현 코드
   - 테스트 시나리오

---

## 참고: 기존 시스템 분석

| 시스템 | Navigate | Select | 특징 |
|--------|----------|--------|------|
| **VS Code** | ↑↓ (파일 트리) | Click/Enter | 파일 선택 후 Tab 이동 |
| **Figma** | ↑↓ (레이어) | Click/Space | 다중 선택 (Cmd+클릭) |
| **Notion** | ↑↓ (블록) | Click | 블록 단위 선택 |
| **Gmail** | j/k (이메일) | x (체크박스) | 단축키 중심 |
| **PowerPoint** | ↑↓ (썸네일) | Click/Enter | 슬라이드 단위 선택 |

**공통 패턴**:
- 모두 키보드 네비게이션 지원
- 모두 명시적 선택 상태 표시
- 모두 선택 후 액션 가능 (Delete, Copy 등)

---

**작성일**: 2026-01-11
**상태**: ✅ 개념 정리 완료
**다음**: Navigable 스펙 작성 (`02-navigable.md`)
