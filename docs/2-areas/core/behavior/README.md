# Behavior Intent System

## 📋 Overview

**목적**: IDDL에 앱 수준의 인터랙션 패턴 추가

**핵심 인사이트**: 웹(Document)과 앱(Tool)의 본질적 차이는 "선택 후 조작" 패턴

```
웹 (Document):  읽기 → 클릭 → 이동
앱 (Tool):      Navigate → Select → Act
```

---

## 📚 문서 구조

### 1. [웹 vs 앱: 본질적 차이](01-web-vs-app.md)

**Why**: 왜 Behavior Intent가 필요한가?

- 웹과 앱의 멘탈모델 차이
- "Navigate → Select → Act" 패턴
- 4가지 핵심 Behavior Intent
- 1차 목표: Navigable + Selectable

### 2. [Navigable: 키보드 네비게이션](02-navigable.md)

**Intent**: "사용자가 키보드만으로 모든 항목에 도달할 수 있어야 한다"

**핵심 내용**:
- Why: 접근성, 생산성, 파워유저
- What: 항목 간 이동, 경계 이동, 페이지 이동
- How: List (1D), Grid (2D), Tree (계층형)
- IDDL API: `behavior={{ navigable: true }}`
- 구현: `useNavigableCursor` hook (이미 존재)

### 3. [Selectable: 선택 Behavior](03-selectable.md)

**Intent**: "사용자가 조작할 대상을 명시적으로 지정할 수 있어야 한다"

**핵심 내용**:
- Why: 명시적 대상 지정, 일괄 처리, 명확한 피드백
- What: Single selection, Multiple selection, Range selection, Toggle selection
- How: Space, Shift+범위, Ctrl+A, Escape
- IDDL API: `behavior={{ selectable: 'single' | 'multiple' }}`
- 구현: `useSelection` hook (새로 작성 필요)

### 4. [PPT 썸네일 통합 예제](04-ppt-thumbnail-example.md)

**목표**: Navigable + Selectable 실제 통합

**핵심 내용**:
- 사용자 시나리오 (슬라이드 편집, 삭제, 범위 선택)
- 완전한 IDDL 코드
- 생성될 HTML/ARIA
- 키보드 조작 흐름
- 구현 코드 (useNavigableSelection hook, ThumbnailList component)
- 테스트 시나리오
- 접근성 검증

---

## 🎯 핵심 Behavior Intent

| Behavior | Intent (Why) | Status |
|----------|-------------|--------|
| **Navigable** | 키보드로 탐색할 수 있어야 한다 | ✅ 스펙 완료 |
| **Selectable** | 조작 대상을 지정할 수 있어야 한다 | ✅ 스펙 완료 |
| **FocusScope** | 맥락을 유지해야 한다 | ⏳ 추후 |
| **Reorderable** | 순서를 바꿀 수 있어야 한다 | ⏳ 추후 |

---

## 🚀 IDDL API 예제

### 기본 사용

```tsx
// Navigable only (탐색만)
<Block role="List" behavior={{ navigable: true }}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
</Block>

// Selectable only (선택만)
<Block role="List" behavior={{ selectable: 'single' }}>
  <Item>Option 1</Item>
  <Item>Option 2</Item>
</Block>

// Navigable + Selectable (탐색 + 선택)
<Block
  role="List"
  behavior={{
    navigable: true,
    selectable: 'multiple',
  }}
>
  <Item>File 1</Item>
  <Item>File 2</Item>
</Block>
```

### 고급 사용 (Controlled)

```tsx
const [selected, setSelected] = useState<Set<string>>(new Set());

<Block
  role="List"
  behavior={{
    navigable: true,
    selectable: {
      mode: 'multiple',
      selected: selected,
      onSelectionChange: setSelected,
    },
  }}
  onActivate={(id) => console.log('Activated:', id)}
  onDelete={() => console.log('Delete:', selected)}
>
  {items.map(item => (
    <Item key={item.id} selected={selected.has(item.id)}>
      {item.name}
    </Item>
  ))}
</Block>
```

---

## 📊 구현 로드맵

### Phase 1: Navigable (완료)
- [x] `useNavigableCursor` hook (이미 존재)
- [x] 스펙 문서 작성
- [ ] NavigableList 컴포넌트
- [ ] Block에 통합
- [ ] ARIA 접근성

### Phase 2: Selectable (진행 중)
- [x] 스펙 문서 작성
- [ ] `useSelection` hook
- [ ] SelectableList 컴포넌트
- [ ] Block에 통합
- [ ] 시각적 피드백 (CSS)

### Phase 3: Navigable + Selectable 통합
- [x] PPT 썸네일 예제 문서
- [ ] `useNavigableSelection` hook
- [ ] ThumbnailList 컴포넌트
- [ ] 실제 PPT 앱에 적용
- [ ] 접근성 테스트

### Phase 4: FocusScope (추후)
- [ ] 스펙 문서 작성
- [ ] `useFocusScope` hook (이미 존재)
- [ ] Modal/Dialog 통합
- [ ] Tab trap 구현

### Phase 5: Reorderable (추후)
- [ ] 스펙 문서 작성
- [ ] Drag & Drop 구현
- [ ] 키보드 순서 변경 (Ctrl+↑↓)
- [ ] 슬라이드 순서 변경 예제

---

## 🎓 학습 포인트

### 1. 웹 ≠ 앱

```
웹:   클릭 = 액션 (즉시 실행)
앱:   선택 ≠ 액션 (대상 지정 후 별도 액션)
```

### 2. 포커스 ≠ 선택

```
포커스:   "현재 키보드 커서 위치" (Navigable)
선택:     "조작할 대상" (Selectable)

예:
  File 1 (포커스, 선택 안됨)  ← 현재 커서
  File 2 (포커스 안됨, 선택됨)  ← 이전에 선택
```

### 3. Intent-Driven Design

```
Visual Intent (Phase 1):
  prominence="Primary"  → "시각적으로 중요하다"
  intent="Critical"     → "위험한 것이다"

Behavior Intent (Phase 3):
  navigable={true}      → "탐색할 수 있다"
  selectable={'multiple'} → "선택할 수 있다"
```

### 4. 접근성 = 앱의 기본

```
WCAG 2.1 준수:
  - 2.1.1 Keyboard: 모든 기능이 키보드로 가능
  - 2.1.2 No Keyboard Trap: 포커스가 갇히지 않음
  - 2.4.3 Focus Order: 포커스 순서가 논리적
  - 2.4.7 Focus Visible: 포커스 상태가 명확

ARIA 패턴:
  - role="listbox" + aria-activedescendant
  - role="option" + aria-selected
  - aria-multiselectable="true"
```

---

## 🔗 관련 문서

**IDDL 스펙**:
- [Field 스펙](../../spec/5-field/field.spec.md) - Headless + Renderer 패턴 참고
- [Page 스펙](../../spec/1-page/) - PageRole 및 Layout 시스템
- [Section 스펙](../../spec/2-sectoin/section.spec.md) - Section role 정의

**구현 코드**:
- `src/shared/lib/keyboard/` - 키보드 네비게이션 hooks
  - `useNavigableCursor.ts` - ↑↓ 커서 이동
  - `useTreeNavigation.ts` - 트리 네비게이션
  - `useFocusScope.ts` - 포커스 범위 제한
- `src/components/types/Block/Block.tsx` - Block 컴포넌트 (behavior prop 추가 예정)

**프로젝트 비전**:
- [Application Platform Vision](../0-evolution/application-platform-vision.md) - 3-phase 전략
- [Phase 1: Declarative UI](../0-evolution/phase-1-declarative-ui.md) - 현재 진행 상황
- [Enterprise Features Checklist](../0-evolution/enterprise-features-checklist.md) - 100+ 기능 추적

---

## 📝 다음 단계

### 즉시 구현 (High Priority)

1. **useSelection Hook**
   - 위치: `src/shared/lib/keyboard/useSelection.ts`
   - 기능: Single/Multiple selection, Range selection, Ctrl+A
   - 참고: `03-selectable.md` 스펙

2. **useNavigableSelection Hook**
   - 위치: `src/shared/lib/keyboard/useNavigableSelection.ts`
   - 기능: Navigable + Selectable 통합
   - 참고: `04-ppt-thumbnail-example.md` 구현 코드

3. **ThumbnailList Component**
   - 위치: `src/apps/PPT/widgets/ThumbnailList.tsx`
   - 기능: PPT 썸네일 리스트 (Navigable + Selectable)
   - 참고: `04-ppt-thumbnail-example.md` 컴포넌트 코드

### 중기 계획 (Medium Priority)

4. **Block behavior prop 통합**
   - Block.tsx에 behavior prop 추가
   - role별 default behavior 설정
   - NavigableList, SelectableList 컴포넌트 분리

5. **접근성 테스트**
   - Screen reader 테스트 (NVDA, VoiceOver)
   - 키보드 전용 테스트
   - WCAG 2.1 준수 검증

### 장기 계획 (Low Priority)

6. **FocusScope 구현**
   - Modal/Dialog에 FocusScope 적용
   - Tab trap 구현
   - Escape 키로 복귀

7. **Reorderable 구현**
   - Drag & Drop
   - 키보드 순서 변경
   - 슬라이드 순서 변경 예제

---

**작성일**: 2026-01-11
**상태**: ✅ 문서화 완료
**다음**: useSelection hook 구현
