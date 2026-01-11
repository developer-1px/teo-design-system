# Type (컴포넌트 타입 계층)

**난이도**: ⭐⭐⭐☆☆
**소요 시간**: 20분
**선행 학습**: [Role](./04-role.md)

---

## 📌 이 문서에서 배울 내용

- Type이 무엇이고 왜 중요한가?
- 5가지 Type 완전 이해
- Type 계층 구조와 중첩 규칙
- Type별 사용 시나리오
- 자주 하는 실수와 해결법

---

## 🎯 Type이란?

**Type**은 "컴포넌트 분류"를 나타내는 IDDL의 핵심 축입니다.

```tsx
// "이 컴포넌트가 무엇인가?"를 선언
Page      // 페이지 (최상위 루트)
Section   // 레이아웃 영역
Block     // 논리적 그룹
Element   // 기본 요소 (Text, Field, Action)
Overlay   // Floating UI
```

**개발자가 선언하는 것**: 컴포넌트의 타입 (보통 컴포넌트 이름으로 자동 결정)
**시스템이 처리하는 것**: 계층 구조 검증, 중첩 규칙 체크

---

## 📚 5가지 Type

### 1. Page (최상위 루트)

**정의**: 애플리케이션의 최상위 컴포넌트

**용도**:
- 전체 화면 앱 (IDE, Dashboard)
- 스크롤 가능한 문서 페이지
- 로그인/결제 같은 집중 화면
- 프레젠테이션 전체 화면

**중첩 규칙**:
- ✅ Page는 최상위에만 위치
- ❌ Page 안에 Page 중첩 불가
- ✅ Page 안에 Section, Block, Element, Overlay 가능

**예시**:
```tsx
// ✅ GOOD - 최상위에 Page
function App() {
  return (
    <Page role="Application" layout="Studio">
      <Section role="PrimarySidebar">...</Section>
      <Section role="Editor">...</Section>
    </Page>
  );
}

// ❌ BAD - Page 중첩
<Page role="Application">
  <Page role="Document">  {/* 불가능 */}
  </Page>
</Page>
```

---

### 2. Section (레이아웃 영역)

**정의**: 화면의 주요 레이아웃 영역

**용도**:
- IDE 레이아웃 (ActivityBar, Sidebar, Editor, Panel)
- 일반 레이아웃 (Header, Footer, Container)
- Resizable 영역

**중첩 규칙**:
- ✅ Section은 Page 바로 아래에만
- ❌ Section 안에 Section 중첩 불가
- ✅ Section 안에 Block, Element 가능

**예시**:
```tsx
// ✅ GOOD - Page 바로 아래 Section
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">
    <Block role="List">...</Block>
  </Section>
  <Section role="PrimarySidebar">
    <Block role="List">...</Block>
  </Section>
</Page>

// ❌ BAD - Section 중첩
<Section role="Container">
  <Section role="Header">  {/* 불가능 */}
  </Section>
</Section>
```

---

### 3. Block (논리적 그룹)

**정의**: 논리적으로 관련된 요소들의 그룹

**용도**:
- Form (폼 그룹)
- Card (카드)
- Toolbar (버튼 그룹)
- List (리스트)
- Grid (그리드 레이아웃)

**중첩 규칙**:
- ✅ Block은 Page, Section, Block 안에 위치
- ✅ Block 안에 Block 중첩 가능 (최대 4단계)
- ✅ Block 안에 Element 가능

**예시**:
```tsx
// ✅ GOOD - Block 중첩 (적절)
<Block role="Form" prominence="Strong">
  <Text role="Title">Profile</Text>

  <Block role="Toolbar">  {/* 1단계 중첩 */}
    <Action prominence="Standard">Cancel</Action>
    <Action prominence="Strong">Save</Action>
  </Block>
</Block>

// ⚠️ WARNING - 과도한 중첩 (4단계 넘음)
<Block>
  <Block>
    <Block>
      <Block>
        <Block>  {/* 5단계 - 피하세요 */}
        </Block>
      </Block>
    </Block>
  </Block>
</Block>
```

---

### 4. Element (기본 요소)

**정의**: 더 이상 분해할 수 없는 원자적 요소

**하위 타입**:
- **Text**: 정적 콘텐츠 (Title, Body, Label, Code, Badge, Alert, Kbd)
- **Field**: 데이터 바인딩 (Input, Select, Checkbox, Radio, Textarea)
- **Action**: 인터랙션 (Button, IconButton, Link, MenuItem)

**중첩 규칙**:
- ✅ Element는 모든 곳에 위치 가능
- ❌ Element 안에 다른 Element 중첩 불가 (원칙)
- ⚠️ 예외: Action 안에 Icon은 가능

**예시**:
```tsx
// ✅ GOOD - Element는 원자적
<Text role="Title" prominence="Strong">
  Welcome
</Text>

<Field label="Email" dataType="email" />

<Action prominence="Strong" intent="Positive">
  Save
</Action>

// ⚠️ 예외 - Action 안에 Icon
<Action role="IconButton" title="Settings">
  <Settings size={20} />  {/* 허용 */}
</Action>

// ❌ BAD - Element 중첩
<Text role="Title">
  <Text role="Body">...</Text>  {/* 불가능 */}
</Text>
```

---

### 5. Overlay (Floating UI)

**정의**: 화면 위에 떠 있는 UI

**용도**:
- Dialog (모달 대화상자)
- Drawer (슬라이드 패널)
- Popover (팝오버)
- Toast (토스트 알림)
- Tooltip (툴팁)

**중첩 규칙**:
- ✅ Overlay는 독립적으로 존재 (Page와 별개)
- ✅ Overlay 안에 Section, Block, Element 가능
- ❌ Overlay 안에 Overlay 중첩 주의 (Dialog 안에 Dialog는 피하세요)

**예시**:
```tsx
// ✅ GOOD - 독립적인 Overlay
function App() {
  return (
    <>
      <Page role="Application">
        {/* 메인 화면 */}
      </Page>

      {/* Overlay는 별도로 존재 */}
      <Overlay role="Dialog" open={isOpen}>
        <Block role="Form">
          <Text role="Title">Confirm</Text>
          <Text role="Body">Are you sure?</Text>
          <Block role="Toolbar">
            <Action prominence="Standard">Cancel</Action>
            <Action prominence="Strong">Confirm</Action>
          </Block>
        </Block>
      </Overlay>
    </>
  );
}
```

---

## 🌲 Type 계층 구조

```
┌─────────────────────────────────────────┐
│ Page (최상위 루트)                       │
│ ├─ Section (레이아웃 영역)               │
│ │   ├─ Block (논리적 그룹)               │
│ │   │   ├─ Block (중첩 가능, 최대 4단계) │
│ │   │   │   └─ Element (원자적 요소)     │
│ │   │   └─ Element                       │
│ │   └─ Element                           │
│ └─ Element                               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Overlay (독립적 Floating UI)             │
│ ├─ Block                                │
│ │   └─ Element                          │
│ └─ Element                              │
└─────────────────────────────────────────┘
```

---

## 🎨 실전 예시

### 1. IDE 레이아웃

```tsx
function IDEApp() {
  return (
    <Page role="Application" layout="Studio">  {/* Type: Page */}
      <Section role="ActivityBar">  {/* Type: Section */}
        <Block role="List">  {/* Type: Block */}
          <Action role="IconButton" title="Files">  {/* Type: Element */}
            <Files size={20} />
          </Action>
        </Block>
      </Section>

      <Section role="PrimarySidebar">  {/* Type: Section */}
        <Block role="List">  {/* Type: Block */}
          <Text role="Body">file1.tsx</Text>  {/* Type: Element */}
          <Text role="Body">file2.tsx</Text>  {/* Type: Element */}
        </Block>
      </Section>

      <Section role="Editor">  {/* Type: Section */}
        <CodeEditor />
      </Section>
    </Page>
  );
}
```

**계층**:
```
Page
└─ Section (ActivityBar)
    └─ Block (List)
        └─ Action (IconButton)
└─ Section (Sidebar)
    └─ Block (List)
        └─ Text (Body) ×N
└─ Section (Editor)
```

---

### 2. 로그인 페이지

```tsx
function LoginPage() {
  return (
    <Page role="Focus" title="Sign In">  {/* Type: Page */}
      <Section role="Container">  {/* Type: Section */}
        <Block role="Form" prominence="Strong">  {/* Type: Block */}
          <Text role="Title" prominence="Strong">  {/* Type: Element */}
            Sign In
          </Text>

          <Field role="Input" label="Email" dataType="email" />  {/* Type: Element */}
          <Field role="Input" label="Password" dataType="password" />  {/* Type: Element */}

          <Block role="Toolbar">  {/* Type: Block (중첩) */}
            <Action prominence="Subtle">Forgot Password?</Action>  {/* Type: Element */}
            <Action prominence="Strong" intent="Brand">Sign In</Action>  {/* Type: Element */}
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

**계층**:
```
Page
└─ Section (Container)
    └─ Block (Form)
        ├─ Text (Title)
        ├─ Field (Input) ×2
        └─ Block (Toolbar)
            └─ Action (Button) ×2
```

---

### 3. 대시보드 + Dialog

```tsx
function DashboardWithDialog() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      {/* Type: Page */}
      <Page role="Application" density="Compact">
        <Section role="Container">  {/* Type: Section */}
          <Text role="Title" prominence="Hero">Dashboard</Text>  {/* Type: Element */}

          <Block role="Grid">  {/* Type: Block */}
            <Block role="Card" prominence="Strong">  {/* Type: Block (중첩) */}
              <Text role="Title" prominence="Hero">$1.2M</Text>  {/* Type: Element */}
              <Text role="Body">Revenue</Text>  {/* Type: Element */}
            </Block>
          </Block>
        </Section>
      </Page>

      {/* Type: Overlay (독립적) */}
      <Overlay role="Dialog" open={isDialogOpen}>
        <Block role="Form">  {/* Type: Block */}
          <Text role="Title">Confirm Action</Text>  {/* Type: Element */}
          <Text role="Body">Are you sure?</Text>  {/* Type: Element */}
          <Block role="Toolbar">  {/* Type: Block (중첩) */}
            <Action prominence="Standard">Cancel</Action>  {/* Type: Element */}
            <Action prominence="Strong">Confirm</Action>  {/* Type: Element */}
          </Block>
        </Block>
      </Overlay>
    </>
  );
}
```

**계층**:
```
Page
└─ Section
    └─ Block (Grid)
        └─ Block (Card)
            └─ Text ×2

Overlay (독립)
└─ Block (Form)
    ├─ Text ×2
    └─ Block (Toolbar)
        └─ Action ×2
```

---

## 🚫 자주 하는 실수

### 실수 1: Page 중첩

```tsx
// ❌ BAD - Page 중첩
<Page role="Application">
  <Page role="Document">
    {/* 불가능 */}
  </Page>
</Page>

// ✅ GOOD - Page는 최상위 하나만
<Page role="Application">
  <Section role="Container">
    {/* ... */}
  </Section>
</Page>
```

---

### 실수 2: Section을 Page 밖에 사용

```tsx
// ❌ BAD - Section이 최상위
<Section role="Container">
  {/* Section은 Page 안에만 */}
</Section>

// ✅ GOOD
<Page role="Document">
  <Section role="Container">
    {/* ... */}
  </Section>
</Page>
```

---

### 실수 3: Section 중첩

```tsx
// ❌ BAD - Section 중첩
<Section role="Container">
  <Section role="Header">
    {/* 불가능 */}
  </Section>
</Section>

// ✅ GOOD - Section은 형제 관계
<Page role="Document">
  <Section role="Header">...</Section>
  <Section role="Container">...</Section>
  <Section role="Footer">...</Section>
</Page>
```

---

### 실수 4: 과도한 Block 중첩

```tsx
// ❌ BAD - 5단계 중첩
<Block>
  <Block>
    <Block>
      <Block>
        <Block>  {/* 너무 깊음 */}
        </Block>
      </Block>
    </Block>
  </Block>
</Block>

// ✅ GOOD - 최대 3-4단계
<Block role="Form">
  <Block role="Toolbar">
    <Block role="ButtonGroup">  {/* 3단계까지는 OK */}
      <Action>...</Action>
    </Block>
  </Block>
</Block>
```

---

### 실수 5: Element 중첩

```tsx
// ❌ BAD - Element 중첩
<Text role="Title">
  <Text role="Body">...</Text>
</Text>

// ✅ GOOD - Element는 원자적
<Text role="Title">Welcome</Text>
<Text role="Body">Description</Text>
```

---

## 📝 실습: 설정 페이지 계층 설계

### 요구사항

다음 설정 페이지를 적절한 Type 계층으로 설계하세요:

1. 페이지 제목: "Settings"
2. 탭 그룹: "Profile", "Security", "Notifications"
3. Profile 섹션:
   - 제목: "Profile"
   - 필드: Name, Email
   - 버튼: Cancel, Save

### 정답 예시

```tsx
function SettingsPage() {
  return (
    <Page role="Document" title="Settings">  {/* Type: Page */}
      <Section role="Container">  {/* Type: Section */}
        <Text role="Title" prominence="Hero">  {/* Type: Element */}
          Settings
        </Text>

        <Block role="Tabs">  {/* Type: Block */}
          <Action prominence="Standard">Profile</Action>  {/* Type: Element */}
          <Action prominence="Standard">Security</Action>  {/* Type: Element */}
          <Action prominence="Standard">Notifications</Action>  {/* Type: Element */}
        </Block>

        <Block role="Form" prominence="Strong">  {/* Type: Block */}
          <Text role="Title" prominence="Strong">  {/* Type: Element */}
            Profile
          </Text>

          <Field role="Input" label="Name" dataType="text" />  {/* Type: Element */}
          <Field role="Input" label="Email" dataType="email" />  {/* Type: Element */}

          <Block role="Toolbar">  {/* Type: Block (중첩) */}
            <Action prominence="Standard">Cancel</Action>  {/* Type: Element */}
            <Action prominence="Strong" intent="Positive">Save</Action>  {/* Type: Element */}
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

**계층 다이어그램**:
```
Page (Document)
└─ Section (Container)
    ├─ Text (Title) - "Settings"
    ├─ Block (Tabs)
    │   └─ Action ×3
    └─ Block (Form)
        ├─ Text (Title) - "Profile"
        ├─ Field ×2
        └─ Block (Toolbar)
            └─ Action ×2
```

**체크리스트**:
- [ ] Page가 최상위에 있는가?
- [ ] Section이 Page 바로 아래에 있는가?
- [ ] Block이 적절히 중첩되어 있는가? (최대 4단계)
- [ ] Element가 가장 안쪽에 있는가?
- [ ] Section이 중첩되지 않았는가?

---

## ✅ 이 문서를 읽고 나면

- [x] Type의 개념을 이해했다
- [x] 5가지 Type의 차이를 알았다
- [x] Type 계층 구조를 파악했다
- [x] 중첩 규칙을 이해했다
- [x] 적절한 Type을 선택할 수 있다

---

## 🔗 다음 단계

이제 기초를 마쳤습니다! Level 2: Components로 넘어가세요:

- [Text 컴포넌트](../02-components/01-element-text.md) - Element의 첫 번째 타입
- [Action 컴포넌트](../02-components/02-element-action.md) - 인터랙션 요소
- [Field 컴포넌트](../02-components/03-element-field.md) - 데이터 바인딩

---

**최종 업데이트**: 2026-01-11
**난이도**: 중급
**예상 소요 시간**: 20분
