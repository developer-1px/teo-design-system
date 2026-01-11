# Action 컴포넌트

**난이도**: ⭐⭐⭐☆☆
**소요 시간**: 30분
**선행 학습**: [Text 컴포넌트](./01-element-text.md)

---

## 📌 이 문서에서 배울 내용

- Action Element가 무엇인가?
- 7가지 Action Role 완전 이해
- Prominence × Intent 조합
- Behavior 시스템
- 실전 활용 패턴
- 자주 하는 실수와 해결법

---

## 🎯 Action이란?

**Action**은 사용자 인터랙션을 처리하는 IDDL Element입니다.

```tsx
// 클릭, 네비게이션, 제출 등의 상호작용
<Action role="Button" prominence="Strong" intent="Positive">
  Save Changes
</Action>
```

**핵심 특징**:
- **Type**: Element (원자적 요소)
- **용도**: 버튼, 링크, 메뉴, 탭 등 모든 클릭 가능한 UI
- **상태**: disabled, loading, selected 지원

---

## 📚 7가지 Action Role

### Button (기본 버튼)

**용도**: 일반적인 버튼 (폼 제출, 액션 트리거)

**HTML 매핑**: `<button type="button">`

**예시**:
```tsx
// 일반 버튼
<Action role="Button" prominence="Strong" intent="Positive">
  Save
</Action>

// 위험한 액션
<Action role="Button" prominence="Strong" intent="Critical">
  Delete
</Action>

// 보조 버튼
<Action role="Button" prominence="Standard">
  Cancel
</Action>
```

**자동 스타일**:
- prominence에 따라 padding, font-weight 조정
- intent에 따라 배경색 자동 설정
- hover, active, focus 상태 자동 처리

---

### IconButton (아이콘 버튼)

**용도**: 텍스트 없이 아이콘만 표시하는 버튼

**HTML 매핑**: `<button type="button">`

**예시**:
```tsx
import { Settings, Search, Files } from 'lucide-react';

// 설정 버튼
<Action role="IconButton" title="Settings">
  <Settings size={20} />
</Action>

// 검색 버튼
<Action role="IconButton" title="Search">
  <Search size={20} />
</Action>

// ActivityBar 아이콘
<Action role="IconButton" title="Files" selected={true}>
  <Files size={20} />
</Action>
```

**중요**:
- `title` prop은 필수 (접근성)
- 아이콘 크기는 20px 권장
- selected 상태 지원

**자동 스타일**:
- padding: 정사각형 (p-2)
- min-width, min-height: 터치 타겟 확보
- selected 시 배경색 변경

---

### Link (링크)

**용도**: 페이지 이동, 외부 링크

**HTML 매핑**: `<a href="...">`

**예시**:
```tsx
// 내부 링크
<Action role="Link" href="/docs">
  Documentation
</Action>

// 외부 링크 (새 탭)
<Action role="Link" href="https://example.com" target="_blank">
  Visit Website
</Action>

// behavior로 네비게이션 (SPA)
<Action
  role="Link"
  behavior={{ action: 'navigate', to: '/settings' }}
>
  Settings
</Action>
```

**자동 스타일**:
- 텍스트 스타일 (배경 없음)
- underline on hover
- intent에 따라 text-color 변경

---

### MenuItem (메뉴 아이템)

**용도**: 드롭다운 메뉴, 컨텍스트 메뉴

**HTML 매핑**: `<button role="menuitem">`

**예시**:
```tsx
<Block role="Menu">
  <Action role="MenuItem" onClick={handleOpen}>
    Open File
  </Action>
  <Action role="MenuItem" onClick={handleSave}>
    Save
  </Action>
  <Action role="MenuItem" intent="Critical">
    Delete
  </Action>
</Block>
```

**자동 스타일**:
- width: 100% (메뉴 전체 폭)
- text-align: left
- padding: px-4 py-2
- hover 시 배경색 변경

---

### ListItem (리스트 아이템)

**용도**: 선택 가능한 리스트 아이템 (파일 트리, 검색 결과)

**HTML 매핑**: `<button>`

**예시**:
```tsx
// 파일 트리
<Block role="List">
  {files.map(file => (
    <Action
      key={file.id}
      role="ListItem"
      selected={selectedId === file.id}
      onClick={() => handleSelect(file.id)}
    >
      {file.name}
    </Action>
  ))}
</Block>

// 검색 결과
<Block role="List">
  {results.map(result => (
    <Action
      key={result.id}
      role="ListItem"
      selected={selectedId === result.id}
    >
      <Text role="Body">{result.title}</Text>
      <Text role="Caption">{result.description}</Text>
    </Action>
  ))}
</Block>
```

**자동 스타일**:
- width: 100%
- text-align: left
- padding: px-3 py-2
- selected 시 배경색 변경
- hover 시 배경색 변경

---

### Tab (탭 버튼)

**용도**: 탭 네비게이션

**HTML 매핑**: `<button role="tab">`

**예시**:
```tsx
<Block role="Tabs">
  <Action role="Tab" selected={activeTab === 'profile'}>
    Profile
  </Action>
  <Action role="Tab" selected={activeTab === 'security'}>
    Security
  </Action>
  <Action role="Tab" selected={activeTab === 'notifications'}>
    Notifications
  </Action>
</Block>
```

**자동 스타일**:
- border-bottom on selected
- padding: px-4 py-2
- selected 시 border-accent

---

### Chip (칩/태그)

**용도**: 토글 가능한 칩, 태그, 필터

**HTML 매핑**: `<button>`

**예시**:
```tsx
// 필터 칩
<Block role="Toolbar">
  {filters.map(filter => (
    <Action
      key={filter.id}
      role="Chip"
      selected={selectedFilters.includes(filter.id)}
      onClick={() => toggleFilter(filter.id)}
    >
      {filter.label}
    </Action>
  ))}
</Block>

// 태그
<Action role="Chip" intent="Brand">
  Featured
</Action>

<Action role="Chip" intent="Positive">
  Active
</Action>
```

**자동 스타일**:
- rounded-full
- padding: px-3 py-1
- selected 시 배경색 변경

---

## 🎨 Prominence × Intent 조합

### 버튼 조합 (Button role)

```tsx
function ButtonExamples() {
  return (
    <div className="flex flex-col gap-4">
      {/* Hero: 랜딩 페이지 주요 CTA */}
      <Action role="Button" prominence="Hero" intent="Brand">
        Get Started Now
      </Action>

      {/* Strong: 폼 제출 버튼 */}
      <Action role="Button" prominence="Strong" intent="Positive">
        Save Changes
      </Action>

      {/* Standard: 보조 버튼 */}
      <Action role="Button" prominence="Standard">
        Cancel
      </Action>

      {/* Subtle: 덜 중요한 액션 */}
      <Action role="Button" prominence="Subtle" intent="Info">
        Learn More
      </Action>
    </div>
  );
}
```

**자동 스타일**:
| Prominence | Padding | Font Weight | Use Case |
|-----------|---------|-------------|----------|
| Hero | px-8 py-4 | 700 | 랜딩 페이지 CTA |
| Strong | px-6 py-3 | 600 | 주요 액션 |
| Standard | px-4 py-2 | 500 | 보조 액션 |
| Subtle | px-2 py-1 | 400 | 덜 중요한 액션 |

---

### Intent별 색상

```tsx
function IntentExamples() {
  return (
    <div className="flex flex-col gap-2">
      <Action role="Button" prominence="Strong" intent="Neutral">
        Neutral
      </Action>

      <Action role="Button" prominence="Strong" intent="Brand">
        Brand
      </Action>

      <Action role="Button" prominence="Strong" intent="Positive">
        Save
      </Action>

      <Action role="Button" prominence="Strong" intent="Caution">
        Warning
      </Action>

      <Action role="Button" prominence="Strong" intent="Critical">
        Delete
      </Action>

      <Action role="Button" prominence="Strong" intent="Info">
        Info
      </Action>
    </div>
  );
}
```

**자동 색상**:
- Neutral: bg-gray-500
- Brand: bg-accent
- Positive: bg-green-500
- Caution: bg-yellow-500
- Critical: bg-red-500
- Info: bg-blue-500

---

## ⚙️ Behavior 시스템

Action은 behavior prop으로 실행할 동작을 선언할 수 있습니다.

### command (명령 실행)

```tsx
<Action
  role="Button"
  behavior={{ action: 'command', command: 'file.open', args: { path: '/' } }}
>
  Open File
</Action>
```

---

### navigate (페이지 이동)

```tsx
// 내부 이동
<Action
  role="Button"
  behavior={{ action: 'navigate', to: '/settings' }}
>
  Settings
</Action>

// 새 탭
<Action
  role="Link"
  behavior={{ action: 'navigate', to: 'https://example.com', target: '_blank' }}
>
  Visit
</Action>
```

---

### submit / reset (폼)

```tsx
<Block role="Form">
  <Field label="Name" />
  <Field label="Email" />

  <Block role="Toolbar">
    <Action behavior={{ action: 'reset' }}>
      Reset
    </Action>
    <Action behavior={{ action: 'submit' }}>
      Submit
    </Action>
  </Block>
</Block>
```

---

### open / close (오버레이)

```tsx
<Action
  behavior={{ action: 'open', overlay: 'settings-dialog' }}
>
  Open Settings
</Action>

<Action
  behavior={{ action: 'close' }}
>
  Close
</Action>
```

---

### toggle (토글)

```tsx
<Action
  behavior={{ action: 'toggle', target: 'sidebar' }}
>
  Toggle Sidebar
</Action>
```

---

## 💡 상태 관리

### disabled (비활성화)

```tsx
<Action role="Button" disabled={true}>
  Disabled Button
</Action>

<Action role="Button" disabled={!hasChanges}>
  Save (disabled until changes)
</Action>
```

---

### loading (로딩 중)

```tsx
<Action role="Button" loading={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</Action>
```

**자동 처리**:
- 클릭 무시
- 커서 변경 (cursor-wait)

---

### selected (선택됨)

```tsx
// 탭
<Action role="Tab" selected={activeTab === 'profile'}>
  Profile
</Action>

// 리스트 아이템
<Action role="ListItem" selected={selectedId === item.id}>
  {item.name}
</Action>

// 칩
<Action role="Chip" selected={isFiltered}>
  Active
</Action>
```

---

### confirm (확인 다이얼로그)

```tsx
<Action
  role="Button"
  intent="Critical"
  confirm="Are you sure you want to delete this?"
>
  Delete
</Action>
```

**자동 처리**:
- 클릭 시 `window.confirm()` 표시
- 취소 시 액션 중단

---

## 🎯 실전 패턴

### 1. 폼 버튼 조합

```tsx
<Block role="Toolbar">
  <Action role="Button" prominence="Standard">
    Cancel
  </Action>
  <Action role="Button" prominence="Strong" intent="Positive">
    Save
  </Action>
</Block>
```

---

### 2. 위험한 액션 (삭제)

```tsx
<Action
  role="Button"
  prominence="Strong"
  intent="Critical"
  confirm="Are you sure you want to delete this account? This action cannot be undone."
>
  Delete Account
</Action>
```

---

### 3. ActivityBar (IDE)

```tsx
<Section role="ActivityBar">
  <Block role="List">
    <Action role="IconButton" title="Files" selected={view === 'files'}>
      <Files size={20} />
    </Action>
    <Action role="IconButton" title="Search" selected={view === 'search'}>
      <Search size={20} />
    </Action>
    <Action role="IconButton" title="Settings" selected={view === 'settings'}>
      <Settings size={20} />
    </Action>
  </Block>
</Section>
```

---

### 4. 탭 네비게이션

```tsx
<Block role="Tabs">
  <Action role="Tab" selected={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
    Profile
  </Action>
  <Action role="Tab" selected={activeTab === 'security'} onClick={() => setActiveTab('security')}>
    Security
  </Action>
  <Action role="Tab" selected={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
    Notifications
  </Action>
</Block>
```

---

### 5. 필터 칩

```tsx
<Block role="Toolbar">
  <Text role="Label">Filter by:</Text>
  {filters.map(filter => (
    <Action
      key={filter.id}
      role="Chip"
      selected={selectedFilters.includes(filter.id)}
      onClick={() => toggleFilter(filter.id)}
    >
      {filter.label}
    </Action>
  ))}
</Block>
```

---

## 🚫 자주 하는 실수

### 실수 1: IconButton에 title 누락

```tsx
// ❌ BAD - 접근성 없음
<Action role="IconButton">
  <Settings size={20} />
</Action>

// ✅ GOOD - title 필수
<Action role="IconButton" title="Settings">
  <Settings size={20} />
</Action>
```

**이유**: title은 스크린 리더와 툴팁에 필수입니다.

---

### 실수 2: 모든 버튼을 prominence="Strong"으로

```tsx
// ❌ BAD - 모두 동일한 중요도
<Block role="Toolbar">
  <Action prominence="Strong">Save</Action>
  <Action prominence="Strong">Cancel</Action>
  <Action prominence="Strong">Delete</Action>
</Block>

// ✅ GOOD - 계층 구조
<Block role="Toolbar">
  <Action prominence="Strong" intent="Positive">Save</Action>
  <Action prominence="Standard">Cancel</Action>
  <Action prominence="Standard" intent="Critical">Delete</Action>
</Block>
```

**이유**: 주요 액션은 1개만 있어야 합니다.

---

### 실수 3: Link에 onClick만 사용

```tsx
// ❌ BAD - href 없는 링크
<Action role="Link" onClick={() => navigate('/docs')}>
  Documentation
</Action>

// ✅ GOOD - href 또는 behavior 사용
<Action role="Link" href="/docs">
  Documentation
</Action>

// ✅ GOOD - behavior로 네비게이션
<Action role="Link" behavior={{ action: 'navigate', to: '/docs' }}>
  Documentation
</Action>
```

**이유**: Link는 href가 있어야 접근성이 보장됩니다.

---

### 실수 4: ListItem에 width 수동 설정

```tsx
// ❌ BAD - 수동 width
<Action role="ListItem" className="w-full">
  Item
</Action>

// ✅ GOOD - 자동 full-width
<Action role="ListItem">
  Item
</Action>
```

**이유**: ListItem, MenuItem은 자동으로 full-width입니다.

---

## 📝 실습: CRUD 버튼 세트

### 요구사항

다음 요구사항을 만족하는 CRUD 버튼 세트를 만드세요:

1. Create (새로 만들기) - 브랜드 색
2. Read (보기) - 정보 색
3. Update (수정) - 긍정 색
4. Delete (삭제) - 위험 색, 확인 다이얼로그

### 정답 예시

```tsx
function CRUDActions() {
  return (
    <Block role="Toolbar">
      {/* Create */}
      <Action role="Button" prominence="Strong" intent="Brand">
        Create New
      </Action>

      {/* Read */}
      <Action role="Button" prominence="Standard" intent="Info">
        View Details
      </Action>

      {/* Update */}
      <Action role="Button" prominence="Strong" intent="Positive">
        Save Changes
      </Action>

      {/* Delete */}
      <Action
        role="Button"
        prominence="Standard"
        intent="Critical"
        confirm="Are you sure you want to delete this item?"
      >
        Delete
      </Action>
    </Block>
  );
}
```

**체크리스트**:
- [ ] Create가 `intent="Brand"`인가?
- [ ] Read가 `intent="Info"`인가?
- [ ] Update가 `intent="Positive"`인가?
- [ ] Delete가 `intent="Critical"`이고 `confirm`이 있는가?
- [ ] 주요 액션이 1-2개만 `prominence="Strong"`인가?

---

## ✅ 이 문서를 읽고 나면

- [x] Action Element의 역할을 이해했다
- [x] 7가지 Action Role을 파악했다
- [x] Prominence × Intent 조합을 활용할 수 있다
- [x] Behavior 시스템을 사용할 수 있다
- [x] 상태 관리 (disabled, loading, selected)를 할 수 있다
- [x] 실전 패턴을 익혔다

---

## 🔗 다음 단계

[Field 컴포넌트](./03-element-field.md) - 데이터 입력 필드 (21개 dataType)를 배웁니다.

---

**최종 업데이트**: 2026-01-11
**난이도**: 중급
**예상 소요 시간**: 30분
