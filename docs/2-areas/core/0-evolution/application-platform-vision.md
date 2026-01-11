# Application Platform Vision

> **"상용 애플리케이션을 위한 완전한 UI 토대"**

**작성일**: 2026-01-11
**상태**: Living Document
**Phase**: 1 of 3 (Declarative UI Rendering)

---

## 📋 목차

1. [문제 정의](#문제-정의)
2. [비전: 3-Phase 전략](#비전-3-phase-전략)
3. [왜 이 순서인가](#왜-이-순서인가)
4. [현재 위치](#현재-위치)
5. [성공 기준](#성공-기준)

---

## 1. 문제 정의

### 1.1 상용 애플리케이션의 현실

VS Code, Figma, Notion 같은 상용 애플리케이션을 만들려고 하면 **세세한 곳에서 디자인 문제가 끊임없이 발생**한다:

```tsx
// 예시: IDE 사이드바를 만든다고 가정
<div className="sidebar">
  {/* 1. 키보드 네비게이션 어떻게? */}
  <input onKeyDown={handleArrowKeys} /> {/* ← 수동 구현 */}

  {/* 2. 포커스 관리 어떻게? */}
  <div tabIndex={0} onFocus={...} onBlur={...}> {/* ← 수동 구현 */}

  {/* 3. 선택 커서 어떻게? */}
  <div className={selected ? "bg-blue" : ""}> {/* ← 수동 구현 */}

  {/* 4. 리사이징 어떻게? */}
  <div onMouseDown={handleResize}> {/* ← 수동 구현 */}
</div>
```

**문제의 본질**:
- 🔴 **매번 수동 구현**: 키보드, 포커스, 선택, 리사이징을 프로젝트마다 처음부터 구현
- 🔴 **일관성 없음**: 같은 팀 내에서도 개발자마다 다른 방식으로 구현
- 🔴 **접근성 취약**: 기본적인 ARIA, 키보드 네비게이션도 누락되기 쉬움
- 🔴 **테스트 불가능**: 상호작용 로직이 컴포넌트마다 흩어져 있어 테스트 어려움

---

### 1.2 기존 디자인 시스템의 한계

**Material-UI, shadcn/ui, Ant Design 같은 디자인 시스템**은 이 문제를 해결해주는가?

#### ❌ 해결 못하는 이유

**1. "보여주기"에만 집중**
```tsx
// Material-UI 예시
<Button variant="contained" color="primary">Save</Button>
```
→ 예쁜 버튼은 나오지만, **애플리케이션 레벨의 행동**은 없음

**2. 컴포넌트가 독립적**
```tsx
<Sidebar />
<Panel />
<Editor />
```
→ 각 컴포넌트가 서로를 모름. **전체 애플리케이션의 조율**이 안 됨

**3. 상호작용 토대 부재**
- 키보드 네비게이션: ❌ 각 컴포넌트가 개별적으로 처리
- 포커스 관리: ❌ 전역 포커스 순서 없음
- 선택 시스템: ❌ 다중 선택, Cmd+클릭 같은 표준 없음
- 리사이징: ❌ 패널 크기 조절은 직접 구현

**결론**: 기존 DS는 **"겉모습"**은 제공하지만, **"뼈대"**는 제공하지 않는다.

---

### 1.3 필요한 것: 엔터프라이즈급 Full Package

**목표**: VS Code, Figma, Notion에 **당연히 있는** 기능들을 패키지로 제공

#### 기본 기능 vs 엔터프라이즈 기능

| 영역 | 기본 DS (Material-UI) | 엔터프라이즈 앱 (VS Code, Figma) | 이 프로젝트 |
|------|---------------------|--------------------------------|------------|
| **Visual** | 예쁜 버튼, 인풋 | + 일관된 패턴 | ✅ 제공 |
| **Structure** | 독립적 컴포넌트 | 계층적 레이아웃 (Page → Section → Block) | ✅ 제공 |
| **Command** | - | Command Palette (Cmd+K) | 🎯 목표 |
| **Keyboard** | 부분적 | 글로벌 단축키, 방향키 네비게이션 | 🎯 목표 |
| **Focus** | - | 포커스 순서, Scope, Trap | 🎯 목표 |
| **Selection** | - | 다중 선택 (Cmd+클릭, Shift+클릭) | 🎯 목표 |
| **Resize** | - | 패널 리사이징 (드래그, 최소/최대) | 🚧 부분 구현 |
| **Drag & Drop** | - | 파일/항목 순서 변경 | 🎯 목표 |
| **Undo/Redo** | - | 히스토리 관리 (Cmd+Z) | 🎯 목표 |
| **Context Menu** | - | 우클릭 메뉴 | 🎯 목표 |
| **Search** | - | 글로벌 검색 (Cmd+F) | 🚧 부분 구현 |
| **Settings** | - | 설정 패널 | 🚧 부분 구현 |
| **Theme** | - | 테마 전환 (light/dark) | ✅ 제공 |

**이 프로젝트의 목표**: 엔터프라이즈급 앱의 **기본 기능을 Full Package로 제공**

#### "Full Package"의 의미

**기존 방식** (개발자가 직접 구현):
```tsx
// Command Palette를 직접 만들어야 함
const [open, setOpen] = useState(false);
const [commands, setCommands] = useState([...]);

useEffect(() => {
  const handler = (e) => {
    if (e.metaKey && e.key === 'k') {
      setOpen(true);
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);

// 300줄의 코드...
```

**이 프로젝트** (패키지로 제공):
```tsx
import { CommandPalette } from '@/components/types/Overlay/CommandPalette';

<CommandPalette commands={commands} />
// 끝!
```

→ **"당연히 있어야 하는 것"을 처음부터 만들지 않게**

---

## 2. 비전: 3-Phase 전략

### 개요

```
Phase 1: 선언적 UI 렌더링         ← 현재
         "의도를 선언하면 화면이 나온다"
              ↓
Phase 2: 데이터 바인딩 & 상태     ← 다음
         "입력과 상태가 연결된다"
              ↓
Phase 3: 인터랙션 행동 시스템     ← 최종
         "포커스, 선택, 리사이징이 자연스럽게 동작한다"
```

---

### Phase 1: 선언적 UI 렌더링 (현재)

**목표**: "의도만 선언하면 패턴대로 화면이 나온다"

#### Before (기존 방식)
```tsx
// 개발자가 매번 "어떻게 보일지" 결정
<button
  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
  onClick={handleSave}
>
  Save
</button>
```

#### After (IDDL)
```tsx
// "왜 중요한가"만 선언
<Action prominence="Primary" intent="Positive">
  Save
</Action>
```

**자동으로 처리되는 것**:
- ✅ 색상 (토큰에서 자동 선택)
- ✅ 크기 (prominence에 따라)
- ✅ 간격 (density에 따라)
- ✅ 호버/포커스 상태 (intent에 따라)
- ✅ 접근성 (role에 따라)

**핵심 컨셉**:
1. **5개 축**: `type`, `role`, `prominence`, `intent`, `density`
2. **패턴 시스템**: 축의 조합마다 정해진 디자인 패턴
3. **계층 구조**: `Page → Section → Block → Element`

**산출물** (IDDL Part 1):
- [✅] IDDL 1.0 Core Specification
- [✅] Design Tokens System
- [✅] Layout System (Depth-based)
- [✅] Standard Role Registry
- [🚧] CVA Variants (패턴 완성 중)

---

### Phase 2: 데이터 바인딩 & 상태 (예정)

**목표**: "입력과 상태가 자동으로 연결된다"

#### Before
```tsx
const [value, setValue] = useState('');
const [error, setError] = useState('');

<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className={error ? 'border-red' : 'border-gray'}
/>
```

#### After (IDDL Part 2)
```tsx
<Field
  label="Email"
  model="user.email"     // ← 자동 바인딩
  dataType="email"       // ← 자동 검증
  required
/>
```

**자동으로 처리되는 것**:
- 🎯 데이터 바인딩 (`model` ↔ state)
- 🎯 유효성 검증 (`dataType` 기반)
- 🎯 에러 표시 (검증 실패 시)
- 🎯 로딩/비활성화 상태

**핵심 컨셉**:
1. **Model Binding**: 양방향 데이터 흐름
2. **Validation**: dataType 기반 자동 검증
3. **State Management**: loading, error, disabled 통합

---

### Phase 3: 인터랙션 행동 시스템 (최종 목표)

**목표**: "포커스, 선택, 리사이징이 자연스럽게 동작한다"

#### Before
```tsx
// 파일 트리 네비게이션을 직접 구현
const [selected, setSelected] = useState(null);
const handleKeyDown = (e) => {
  if (e.key === 'ArrowDown') { /* 다음 항목 선택 */ }
  if (e.key === 'ArrowUp') { /* 이전 항목 선택 */ }
  if (e.key === 'Enter') { /* 항목 열기 */ }
};

<div onKeyDown={handleKeyDown} tabIndex={0}>
  {items.map(item => (
    <div
      className={selected === item.id ? 'bg-blue' : ''}
      onClick={() => setSelected(item.id)}
    >
      {item.name}
    </div>
  ))}
</div>
```

#### After (IDDL Part 3)
```tsx
<Block role="FileTree" navigable selectable>
  {items.map(item => (
    <Element.Text>{item.name}</Element.Text>
  ))}
</Block>
```

**자동으로 처리되는 것**:
- 🎯 **키보드 네비게이션**: 방향키, Tab, 단축키
- 🎯 **포커스 관리**: 포커스 순서, Scope, Trap
- 🎯 **선택 커서**: 단일/다중 선택, Cmd+클릭, Shift+클릭
- 🎯 **리사이징**: 패널 크기 조절, 최소/최대 제한
- 🎯 **드래그 앤 드롭**: 항목 순서 변경
- 🎯 **접근성**: 스크린 리더, ARIA

**핵심 컨셉**:
1. **Navigable System**: 키보드 네비게이션 자동화
2. **Selectable System**: 선택 커서 자동화
3. **Resizable System**: 리사이징 자동화
4. **Accessibility**: ARIA, 키보드 접근성 자동화

**이미 준비된 것** (`src/shared/lib/keyboard/`):
- [✅] `useShortcut` - 글로벌 단축키
- [✅] `useFocusScope` - 포커스 범위 관리
- [✅] `useNavigableCursor` - 커서 이동
- [✅] `useTreeNavigation` - 트리 네비게이션

→ 이것들을 **선언적으로 만들기**가 Phase 3의 목표

---

## 3. 왜 이 순서인가

### 3.1 화면 → 데이터 → 인터랙션

**Phase 1을 먼저 푸는 이유**:

#### 1. 화면이 없으면 인터랙션도 없다

```tsx
// ❌ 인터랙션만 있고 화면이 없으면?
<Navigable> {/* 뭘 네비게이션 하지? */}
```

**화면이 먼저 있어야**:
- 무엇을 선택할지 알 수 있음
- 무엇에 포커스를 줄지 알 수 있음
- 무엇을 리사이징할지 알 수 있음

---

#### 2. 구조가 잡혀야 행동의 컨텍스트가 생긴다

**IDDL 계층 구조**:
```
Page
 └─ Section (PrimarySidebar)
     └─ Block (FileTree)
         └─ Element (File)
```

**이 구조가 정의하는 것**:
- **포커스 순서**: Section → Block → Element 순서로 Tab 이동
- **선택 범위**: Block 내에서만 선택 가능
- **리사이징 범위**: Section 단위로 크기 조절

→ **구조 없이는 "어디서부터 어디까지"를 정의할 수 없음**

---

#### 3. 의도 축이 시각적 피드백의 기준이 된다

**예시: 선택 상태의 시각적 피드백**

```tsx
<Block role="FileTree">
  <Element.Text
    prominence="Primary"   // ← 중요한 항목
    intent="Brand"         // ← 브랜드 액센트
    selected               // ← 선택됨
  >
    package.json
  </Element.Text>
</Block>
```

**Phase 1 없이 Phase 3를 하면**:
- "선택된 항목"을 어떤 색으로 표시할지 **매번 정의**해야 함
- `prominence`와 `intent`가 정의되어 있으면:
  - `Primary + Brand + selected` → 자동으로 강한 배경색
  - `Secondary + Neutral + selected` → 자동으로 약한 배경색

→ **Phase 1의 의도 축이 Phase 3의 시각적 피드백을 자동화**

---

### 3.2 계층적 의존성

```
Phase 1 (Structure + Intent)
    ↓ 제공
Phase 2 (Data Binding)
    ↓ 제공
Phase 3 (Interaction)
```

**각 단계가 다음 단계에 제공하는 것**:

| Phase | 제공하는 것 | 다음 단계가 사용하는 방법 |
|-------|------------|------------------------|
| Phase 1 | 계층 구조, 의도 축 | Phase 2: 어떤 컴포넌트에 데이터를 바인딩할지 |
| Phase 2 | 데이터 흐름, 상태 | Phase 3: 어떤 상태일 때 인터랙션을 활성화할지 |
| Phase 3 | 인터랙션 행동 | - |

→ **역순은 불가능**

---

## 4. 현재 위치

### 4.1 Phase 1 현황 (2026-01-11 기준)

#### ✅ 완료된 것

**Core Specification**:
- [✅] IDDL 1.0 Part 1 Spec (영문/한글)
- [✅] TypeScript 타입 정의 (`iddl.d.ts`)
- [✅] 계층 구조: `Page → Section → Block → Element`
- [✅] 5개 축: `type`, `role`, `prominence`, `intent`, `density`

**Design System**:
- [✅] Design Tokens (`src/shared/config/tokens.ts`)
- [✅] Depth-based Layout System
- [✅] Theme System (light/dark, color schemes, density)

**Implementation**:
- [✅] Page Component (role-based rendering)
- [✅] Section Component (renderers, role variants)
- [✅] Block Component (role variants)
- [✅] Element Components (Text, Field, Action, Separator)

**Infrastructure**:
- [✅] IDDL Inspector (Cmd+D 디버깅 도구)
- [✅] Multi-app showcase (14개 앱)
- [✅] Documentation (`apps/docs/`, `docs/2-areas/`)

---

#### 🚧 진행 중

**CVA Variants 완성**:
- [🚧] Field renderers (TextField, NumberField, SelectField 등)
- [🚧] Action renderers (ButtonAction, IconButtonAction)
- [🚧] Text role variants (Badge, Alert, Avatar, Kbd)

**Pattern Completion**:
- [🚧] `prominence × intent × state` 조합별 패턴 정의
- [🚧] Interactive states (hover, active, selected, disabled, focus)
- [🚧] Spacing tokens (`prominence × density → gap/padding`)

---

#### 📋 TODO (Phase 1 완료를 위해)

1. **CVA Variants 완성**
   - [ ] 모든 Field dataType 렌더러 완성
   - [ ] 모든 prominence × intent 조합 패턴 정의
   - [ ] Interactive state 토큰 시스템 완성

2. **Documentation**
   - [ ] Pattern catalog (모든 조합 예시)
   - [ ] Component API reference 완성
   - [ ] Migration guide (v4.x → v1.0)

3. **Testing**
   - [ ] Visual regression tests
   - [ ] Accessibility tests (axe-core)
   - [ ] Cross-browser tests

---

### 4.2 Phase 2 준비 상황

**이미 준비된 것**:
- [✅] Field component 구조 (headless + renderer)
- [✅] dataType 시스템 (21가지 타입)
- [🚧] Model binding 컨셉 (아직 미구현)

**필요한 것**:
- [ ] Data binding library 선택 (react-hook-form? 자체 구현?)
- [ ] Validation library 통합 (zod? yup?)
- [ ] State management 전략 (Zustand? Jotai? Context?)

---

### 4.3 Phase 3 준비 상황

**이미 준비된 것** (`src/shared/lib/keyboard/`):
- [✅] `useShortcut` - 글로벌 단축키 시스템
- [✅] `useFocusScope` - 포커스 범위 관리
- [✅] `useNavigableCursor` - 방향키 커서 이동
- [✅] `useTreeNavigation` - 트리 네비게이션

**필요한 것**:
- [ ] 이 hooks를 선언적 API로 래핑
- [ ] Selection system 설계
- [ ] Resizable system 설계 (이미 부분 구현)
- [ ] Drag & Drop system 설계

---

## 5. 성공 기준

### 5.1 Phase 1 성공 기준

**"개발자가 IDDL만으로 화면을 만들 수 있다"**

#### 시나리오: 사용자 프로필 페이지 만들기

```tsx
<Page role="Document" title="User Profile">
  <Section role="Container">
    <Block role="Card">
      <Text role="Title" prominence="Primary">Profile Settings</Text>

      <Block role="Form">
        <Field label="Name" model="user.name" dataType="text" required />
        <Field label="Email" model="user.email" dataType="email" required />
        <Field label="Bio" model="user.bio" dataType="textarea" />
      </Block>

      <Block role="Toolbar">
        <Action prominence="Secondary" intent="Neutral">Cancel</Action>
        <Action prominence="Primary" intent="Positive">Save</Action>
      </Block>
    </Block>
  </Section>
</Page>
```

**결과**:
- ✅ 화면이 패턴대로 렌더링됨
- ✅ 반응형 (모바일/데스크톱)
- ✅ 테마 지원 (light/dark)
- ✅ 접근성 (ARIA, 시맨틱 HTML)
- ✅ 일관된 디자인 (prominence × intent)

→ **개발자가 디자인을 신경쓰지 않아도 됨**

---

### 5.2 Phase 2 성공 기준

**"개발자가 데이터 바인딩 코드를 작성하지 않아도 된다"**

```tsx
// model만 선언하면 자동 바인딩
<Field label="Email" model="user.email" dataType="email" required />
```

**결과**:
- 🎯 입력값이 자동으로 `user.email`에 저장
- 🎯 유효성 검증 자동 (email 형식 체크)
- 🎯 에러 메시지 자동 표시
- 🎯 로딩 상태 자동 처리

---

### 5.3 Phase 3 성공 기준 (최종)

**"개발자가 인터랙션 코드를 작성하지 않아도 된다"**

```tsx
<Block role="FileTree" navigable selectable>
  {files.map(file => (
    <Element.Text>{file.name}</Element.Text>
  ))}
</Block>
```

**결과**:
- 🎯 방향키로 네비게이션 자동 동작
- 🎯 선택 커서 자동 표시
- 🎯 Cmd+클릭 다중 선택 자동 지원
- 🎯 스크린 리더 자동 지원

→ **"VS Code 같은 앱을 선언만으로 만들 수 있다"**

---

## 6. 관련 문서

- [Phase 1 상세](./phase-1-declarative-ui.md) - 현재 Phase 상세 분석
- [IDE Design Philosophy](./ide-design-philosophy.md) - IDDL의 디자인 철학
- [IDDL 1.0 Spec](../../spec/iddl-1.0-spec-ko.md) - 공식 스펙 (한글)
- [Standard Roles](../3-reference/iddl-standard-roles.md) - 표준 Role 레지스트리

---

**Last Updated**: 2026-01-11
**Status**: Phase 1 진행 중 (~80% 완성)
**Next Milestone**: Phase 1 완료 → Phase 2 시작
