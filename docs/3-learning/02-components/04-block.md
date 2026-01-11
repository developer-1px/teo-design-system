# Block 컴포넌트

**난이도**: ⭐⭐⭐☆☆
**소요 시간**: 30분
**선행 학습**: [Type](../01-fundamentals/05-type.md), [Text](./01-element-text.md), [Action](./02-element-action.md)

---

## 📌 이 문서에서 배울 내용

- Block이 무엇인가?
- 6가지 BlockRole 카테고리 완전 이해
- Layout 시스템 (stack, inline, grid)
- Prominence × Intent 조합
- 실전 활용 패턴 (Form, Card, Toolbar, List)
- 자주 하는 실수와 해결법

---

## 🎯 Block이란?

**Block**은 **논리적 그룹핑을 담당하는 IDDL 컴포넌트**입니다.

```tsx
// Element들을 논리적으로 묶어서 하나의 기능 단위로 만듦
<Block role="Form">
  <Field label="Email" dataType="email" />
  <Field label="Password" dataType="password" />
  <Block role="Toolbar">
    <Action prominence="Standard">Cancel</Action>
    <Action prominence="Strong" intent="Positive">Submit</Action>
  </Block>
</Block>
```

**핵심 특징**:
- **Type**: Block (Element들을 묶는 컨테이너)
- **용도**: Form, Card, Toolbar, List 등 기능적 그룹
- **Nesting**: Block 안에 Block 중첩 가능 (최대 4 depth)
- **Layout**: 자식 배치 방식 결정 (stack, inline, grid)

---

## 📚 BlockRole 카테고리

Block은 **기능적 목적**에 따라 6개 카테고리로 분류됩니다.

### 1. Layout Containers (레이아웃 컨테이너)

**용도**: 자식 요소의 배치를 제어하는 투명한 컨테이너

| Role | 설명 | Layout | HTML |
|------|------|--------|------|
| **Container** | 일반 컨테이너 (기본값) | stack | `<div>` |
| **Stack** | 수직 쌓기 | stack | `<div>` |
| **Row** | 수평 배치 | inline | `<div>` |
| **Group** | 그룹 (Stack과 동일) | stack | `<div>` |
| **Inline** | 인라인 그룹 | inline | `<div>` |
| **Split** | 분할 레이아웃 (Resizable) | split | `<div>` |

**예시**:
```tsx
// 수직 쌓기
<Block role="Stack">
  <Text role="Title">Title 1</Text>
  <Text role="Body">Content 1</Text>
  <Text role="Title">Title 2</Text>
  <Text role="Body">Content 2</Text>
</Block>

// 수평 배치
<Block role="Row">
  <Action>Button 1</Action>
  <Action>Button 2</Action>
  <Action>Button 3</Action>
</Block>
```

---

### 2. Data Display (데이터 표시)

**용도**: 데이터를 시각적으로 표시하는 컨테이너

| Role | 설명 | Use Case | HTML |
|------|------|----------|------|
| **Card** | 카드 UI | 대시보드 카드, 제품 카드 | `<div>` |
| **List** | 항목 리스트 | 파일 목록, 검색 결과 | `<ul>` |
| **Grid** | 그리드 레이아웃 | 이미지 그리드, 제품 그리드 | `<div>` |
| **Table** | 테이블 | 데이터 테이블 | `<table>` |
| **Divider** | 구분선 | 섹션 구분, 메뉴 구분 | `<hr>` |

**예시**:
```tsx
// 카드
<Block role="Card" prominence="Standard">
  <Text role="Title" prominence="Strong">User Profile</Text>
  <Text role="Body">John Doe</Text>
  <Text role="Caption">Member since 2024</Text>
</Block>

// 리스트
<Block role="List">
  <Block role="ListItem">Item 1</Block>
  <Block role="ListItem">Item 2</Block>
  <Block role="ListItem">Item 3</Block>
</Block>

// 그리드 (3열)
<Block role="Grid" spec={{ columns: 3 }}>
  <Block role="Card">Card 1</Block>
  <Block role="Card">Card 2</Block>
  <Block role="Card">Card 3</Block>
</Block>
```

---

### 3. Forms (입력 폼)

**용도**: 사용자 입력을 받는 폼 그룹

| Role | 설명 | HTML | ARIA |
|------|------|------|------|
| **Form** | 폼 컨테이너 | `<form>` | `role="form"` |
| **Fieldset** | 필드 그룹 | `<fieldset>` | - |

**예시**:
```tsx
// 로그인 폼
<Block role="Form">
  <Text role="Title" prominence="Strong">Sign In</Text>
  <Field label="Email" dataType="email" required />
  <Field label="Password" dataType="password" required />

  <Block role="Toolbar">
    <Action prominence="Standard">Cancel</Action>
    <Action prominence="Strong" intent="Positive">Submit</Action>
  </Block>
</Block>

// Fieldset (관련 필드 그룹)
<Block role="Form">
  <Block role="Fieldset">
    <Text role="Label">Personal Information</Text>
    <Field label="First Name" dataType="text" />
    <Field label="Last Name" dataType="text" />
  </Block>

  <Block role="Fieldset">
    <Text role="Label">Contact</Text>
    <Field label="Email" dataType="email" />
    <Field label="Phone" dataType="tel" />
  </Block>
</Block>
```

---

### 4. Action Blocks (액션 그룹)

**용도**: 버튼/액션들을 그룹화

| Role | 설명 | Layout | Use Case |
|------|------|--------|----------|
| **Toolbar** | 툴바/액션 모음 | inline | 에디터 툴바, 버튼 그룹 |
| **FloatingToolbar** | 플로팅 툴바 | inline | 선택 시 나타나는 액션 |

**예시**:
```tsx
// 에디터 툴바
<Block role="Toolbar" prominence="Standard">
  <Action role="IconButton" title="Bold"><Bold /></Action>
  <Action role="IconButton" title="Italic"><Italic /></Action>
  <Action role="IconButton" title="Underline"><Underline /></Action>
  <Block role="ToolbarDivider" />
  <Action role="IconButton" title="Link"><Link /></Action>
</Block>

// 플로팅 툴바 (선택 시 나타남)
<Block role="FloatingToolbar" prominence="Strong">
  <Action intent="Critical">Delete</Action>
  <Action intent="Neutral">Copy</Action>
  <Action intent="Neutral">Move</Action>
</Block>
```

---

### 5. Navigation (네비게이션)

**용도**: 탐색 및 네비게이션 UI

| Role | 설명 | Use Case |
|------|------|----------|
| **Tabs** | 탭 컨테이너 | 설정 탭, 에디터 탭 |
| **Accordion** | 아코디언 | FAQ, 설정 그룹 |
| **Steps** | 단계별 진행 | 회원가입, 결제 과정 |
| **Breadcrumbs** | 경로 탐색 | 파일 경로, 페이지 경로 |
| **Menu** | 메뉴 | 컨텍스트 메뉴, 드롭다운 |

**예시**:
```tsx
// 탭
<Block role="Tabs">
  <Action role="Tab" selected={true}>Profile</Action>
  <Action role="Tab">Security</Action>
  <Action role="Tab">Notifications</Action>
</Block>

// 아코디언
<Block role="Accordion" mode="single">
  <Block>
    <Text role="Title">Section 1</Text>
    <Text role="Body">Content 1</Text>
  </Block>
  <Block>
    <Text role="Title">Section 2</Text>
    <Text role="Body">Content 2</Text>
  </Block>
</Block>

// Steps
<Block role="Steps">
  <Block>
    <Text role="Title">Step 1: Account</Text>
    <Field label="Email" dataType="email" />
  </Block>
  <Block>
    <Text role="Title">Step 2: Profile</Text>
    <Field label="Name" dataType="text" />
  </Block>
</Block>
```

---

### 6. Utility (유틸리티)

**용도**: 특수 목적 블록

| Role | 설명 | Use Case |
|------|------|----------|
| **Spacer** | 여백 | flex-1으로 공간 채우기 |

**예시**:
```tsx
// Spacer (버튼을 오른쪽으로 밀기)
<Block role="Toolbar">
  <Text role="Label">Title</Text>
  <Block role="Spacer" />
  <Action prominence="Strong">Save</Action>
</Block>
```

---

## 🎨 Layout 시스템

Block의 핵심 기능은 **자식 요소의 배치를 제어**하는 것입니다.

### Layout Variants

| Layout | 설명 | CSS | Use Case |
|--------|------|-----|----------|
| `stack` | 수직 쌓기 (기본값) | `flex flex-col` | Form, List, Section |
| `inline` | 수평 배치 | `flex flex-row` | Toolbar, Button group |
| `grid` | 그리드 | `grid` | 이미지 그리드, 대시보드 |
| `split` | 분할 (2열) | `grid grid-cols-2` | Master-Detail |
| `tabs` | 탭 레이아웃 | `flex flex-col` | 탭 + 내용 |
| `steps` | 단계 레이아웃 | `flex flex-col` | Wizard, 진행 과정 |

### Layout 예시

```tsx
// Stack (세로 쌓기)
<Block layout="stack" gap={4}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Block>

// Inline (가로 정렬)
<Block layout="inline" gap={2}>
  <Action>Button 1</Action>
  <Action>Button 2</Action>
  <Action>Button 3</Action>
</Block>

// Grid (3열 그리드)
<Block role="Grid" spec={{ columns: 3 }} gap={4}>
  <Block role="Card">Card 1</Block>
  <Block role="Card">Card 2</Block>
  <Block role="Card">Card 3</Block>
  <Block role="Card">Card 4</Block>
  <Block role="Card">Card 5</Block>
  <Block role="Card">Card 6</Block>
</Block>

// Split (2분할)
<Block layout="split">
  <Block>Left Panel</Block>
  <Block>Right Panel</Block>
</Block>
```

---

## 🌈 Prominence × Intent 조합

Block도 prominence와 intent를 사용해 강조도와 의미를 표현합니다.

### Card Prominence

```tsx
function ProminenceCards() {
  return (
    <Block layout="stack" gap={4}>
      {/* Hero: 메인 카드 (강조) */}
      <Block role="Card" prominence="Hero">
        <Text role="Title">Featured Content</Text>
        <Text role="Body">This is the most important card</Text>
      </Block>

      {/* Strong: 일반 카드 */}
      <Block role="Card" prominence="Strong">
        <Text role="Title">Normal Card</Text>
        <Text role="Body">Standard content card</Text>
      </Block>

      {/* Subtle: 배경 카드 */}
      <Block role="Card" prominence="Subtle">
        <Text role="Title">Background Card</Text>
        <Text role="Body">Less important content</Text>
      </Block>
    </Block>
  );
}
```

**결과**:
| Prominence | Background | Shadow | Border | Use Case |
|-----------|------------|--------|--------|----------|
| Hero | `bg-surface-raised` | `shadow-4` | none | 메인 카드, 강조 콘텐츠 |
| Strong | `bg-surface-raised` | `shadow-3` | none | 일반 카드 |
| Standard | `bg-surface` | `shadow-2` | none | 기본 카드 |
| Subtle | `bg-surface-sunken` | none | `border` | 배경 카드, 덜 중요한 콘텐츠 |

### Intent Colors

```tsx
function IntentCards() {
  return (
    <Block layout="grid" spec={{ columns: 3 }} gap={4}>
      <Block role="Card" intent="Neutral">
        <Text role="Title">Neutral</Text>
      </Block>

      <Block role="Card" intent="Brand">
        <Text role="Title">Brand</Text>
      </Block>

      <Block role="Card" intent="Positive">
        <Text role="Title">Success</Text>
      </Block>

      <Block role="Card" intent="Caution">
        <Text role="Title">Warning</Text>
      </Block>

      <Block role="Card" intent="Critical">
        <Text role="Title">Error</Text>
      </Block>

      <Block role="Card" intent="Info">
        <Text role="Title">Info</Text>
      </Block>
    </Block>
  );
}
```

**자동 적용**:
- Intent에 따라 border-left 또는 background tint 자동 적용
- 의미적 색상으로 카드 구분

---

## 🎯 실전 패턴

### 1. 로그인 폼

```tsx
function LoginForm() {
  return (
    <Block role="Form" prominence="Standard" className="max-w-md mx-auto">
      <Text role="Title" prominence="Strong">Sign In</Text>
      <Text role="Body" prominence="Subtle">
        Enter your credentials to continue
      </Text>

      <Field label="Email" dataType="email" required />
      <Field label="Password" dataType="password" required />

      <Block role="Toolbar" layout="inline" className="justify-end">
        <Action prominence="Standard">Cancel</Action>
        <Action prominence="Strong" intent="Positive">Sign In</Action>
      </Block>
    </Block>
  );
}
```

---

### 2. 대시보드 카드 그리드

```tsx
function Dashboard() {
  return (
    <Block role="Grid" spec={{ columns: 3 }} gap={4}>
      <Block role="Card" prominence="Strong">
        <Text role="Label">Total Users</Text>
        <Text role="Title" prominence="Hero">12,345</Text>
        <Text role="Caption" intent="Positive">+12% from last month</Text>
      </Block>

      <Block role="Card" prominence="Strong">
        <Text role="Label">Revenue</Text>
        <Text role="Title" prominence="Hero">$45,678</Text>
        <Text role="Caption" intent="Positive">+8% from last month</Text>
      </Block>

      <Block role="Card" prominence="Strong">
        <Text role="Label">Active Sessions</Text>
        <Text role="Title" prominence="Hero">1,234</Text>
        <Text role="Caption" intent="Neutral">-2% from last month</Text>
      </Block>
    </Block>
  );
}
```

---

### 3. 에디터 툴바

```tsx
function EditorToolbar() {
  return (
    <Block role="Toolbar" prominence="Standard">
      <Block role="Row">
        <Action role="IconButton" title="Bold"><Bold /></Action>
        <Action role="IconButton" title="Italic"><Italic /></Action>
        <Action role="IconButton" title="Underline"><Underline /></Action>
      </Block>

      <Block role="ToolbarDivider" />

      <Block role="Row">
        <Action role="IconButton" title="Align Left"><AlignLeft /></Action>
        <Action role="IconButton" title="Align Center"><AlignCenter /></Action>
        <Action role="IconButton" title="Align Right"><AlignRight /></Action>
      </Block>

      <Block role="Spacer" />

      <Action prominence="Strong" intent="Positive">Save</Action>
    </Block>
  );
}
```

---

### 4. 파일 목록 (Selectable List)

```tsx
function FileList() {
  const [selectedFile, setSelectedFile] = useState('file1.tsx');

  return (
    <Block role="List">
      <Block
        role="ListItem"
        clickable
        selected={selectedFile === 'file1.tsx'}
        onClick={() => setSelectedFile('file1.tsx')}
      >
        <Text role="Body">file1.tsx</Text>
      </Block>
      <Block
        role="ListItem"
        clickable
        selected={selectedFile === 'file2.tsx'}
        onClick={() => setSelectedFile('file2.tsx')}
      >
        <Text role="Body">file2.tsx</Text>
      </Block>
      <Block
        role="ListItem"
        clickable
        selected={selectedFile === 'file3.tsx'}
        onClick={() => setSelectedFile('file3.tsx')}
      >
        <Text role="Body">file3.tsx</Text>
      </Block>
    </Block>
  );
}
```

---

### 5. 설정 페이지 (Tabs + Form)

```tsx
function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Block layout="stack" gap={6}>
      <Text role="Title" prominence="Hero">Settings</Text>

      <Block role="Tabs">
        <Action
          role="Tab"
          selected={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </Action>
        <Action
          role="Tab"
          selected={activeTab === 'security'}
          onClick={() => setActiveTab('security')}
        >
          Security
        </Action>
        <Action
          role="Tab"
          selected={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </Action>
      </Block>

      {activeTab === 'profile' && (
        <Block role="Form">
          <Field label="Name" dataType="text" />
          <Field label="Email" dataType="email" />
          <Field label="Bio" dataType="textarea" />
        </Block>
      )}
    </Block>
  );
}
```

---

## 🚫 자주 하는 실수

### 실수 1: Block 대신 Element 직접 배치

```tsx
// ❌ BAD - Section에 Element 직접 배치
<Section role="Container">
  <Text role="Title">Title</Text>
  <Field label="Name" dataType="text" />
</Section>

// ✅ GOOD - Block으로 감싸기
<Section role="Container">
  <Block role="Form">
    <Text role="Title">Title</Text>
    <Field label="Name" dataType="text" />
  </Block>
</Section>
```

**이유**: IDDL 계층 규칙: Section → Block → Element

---

### 실수 2: role과 layout 불일치

```tsx
// ❌ BAD - Form인데 inline layout
<Block role="Form" layout="inline">
  <Field label="Name" dataType="text" />
  <Field label="Email" dataType="email" />
</Block>

// ✅ GOOD - Form은 stack layout
<Block role="Form" layout="stack">
  <Field label="Name" dataType="text" />
  <Field label="Email" dataType="email" />
</Block>
```

**이유**: Form은 세로 배치가 자연스럽습니다.

---

### 실수 3: 과도한 중첩 (4 depth 초과)

```tsx
// ❌ BAD - 5 depth 중첩
<Block>           {/* depth 1 */}
  <Block>         {/* depth 2 */}
    <Block>       {/* depth 3 */}
      <Block>     {/* depth 4 */}
        <Block>   {/* depth 5 - 너무 깊음! */}
          <Text>Content</Text>
        </Block>
      </Block>
    </Block>
  </Block>
</Block>

// ✅ GOOD - 최대 4 depth
<Block>           {/* depth 1 */}
  <Block>         {/* depth 2 */}
    <Block>       {/* depth 3 */}
      <Text>Content</Text>
    </Block>
  </Block>
</Block>
```

**이유**: IDDL은 최대 4 depth를 권장합니다.

---

### 실수 4: Card에 prominence 없음

```tsx
// ❌ BAD - Card에 prominence 없음 (기본값 사용)
<Block role="Card">
  <Text>Content</Text>
</Block>

// ✅ GOOD - 명시적 prominence
<Block role="Card" prominence="Strong">
  <Text>Content</Text>
</Block>
```

**이유**: Card는 prominence로 강조도를 명확히 해야 합니다.

---

### 실수 5: Toolbar에 stack layout 사용

```tsx
// ❌ BAD - Toolbar인데 세로 배치
<Block role="Toolbar" layout="stack">
  <Action>Button 1</Action>
  <Action>Button 2</Action>
</Block>

// ✅ GOOD - Toolbar는 inline layout (자동 적용)
<Block role="Toolbar">
  <Action>Button 1</Action>
  <Action>Button 2</Action>
</Block>
```

**이유**: Toolbar는 자동으로 inline layout을 사용합니다.

---

## 📝 실습: 회원가입 폼

### 요구사항

다음 요구사항을 만족하는 회원가입 폼을 만드세요:

1. **Form 구조**:
   - 제목: "Create Account"
   - 설명: "Sign up to get started"
   - 이메일 입력 (required)
   - 비밀번호 입력 (required)
   - 비밀번호 확인 입력 (required)
   - 약관 동의 체크박스 (required)

2. **버튼 그룹**:
   - "Cancel" 버튼 (Standard prominence)
   - "Sign Up" 버튼 (Strong prominence, Positive intent)
   - 오른쪽 정렬

3. **스타일**:
   - Form은 Standard prominence
   - 최대 너비 400px, 중앙 정렬

### 정답 예시

```tsx
function SignupForm() {
  return (
    <Block
      role="Form"
      prominence="Standard"
      className="max-w-md mx-auto"
    >
      {/* 헤더 */}
      <Text role="Title" prominence="Strong">
        Create Account
      </Text>
      <Text role="Body" prominence="Subtle">
        Sign up to get started
      </Text>

      {/* 입력 필드 */}
      <Field label="Email" dataType="email" required />
      <Field label="Password" dataType="password" required />
      <Field label="Confirm Password" dataType="password" required />

      {/* 약관 동의 */}
      <Field
        label="I agree to the Terms of Service"
        role="Checkbox"
        required
      />

      {/* 버튼 그룹 */}
      <Block role="Toolbar" layout="inline" className="justify-end">
        <Action prominence="Standard">Cancel</Action>
        <Action prominence="Strong" intent="Positive">Sign Up</Action>
      </Block>
    </Block>
  );
}
```

**체크리스트**:
- [ ] Form role 사용?
- [ ] 모든 필드가 required?
- [ ] Toolbar로 버튼 그룹핑?
- [ ] 버튼이 오른쪽 정렬?
- [ ] prominence와 intent 명시?

---

## 💡 고급 기능

### 1. Selectable List (v1.0.2)

```tsx
function SelectableList() {
  const selectionModel = useSelectionModel({
    mode: 'single',
    defaultValue: 'item1',
  });

  return (
    <Block role="List">
      <Block value="item1" selectionModel={selectionModel}>
        Item 1
      </Block>
      <Block value="item2" selectionModel={selectionModel}>
        Item 2
      </Block>
      <Block value="item3" selectionModel={selectionModel}>
        Item 3
      </Block>
    </Block>
  );
}
```

---

### 2. Loading/Error/Empty States

```tsx
function DataCard({ state }: { state: 'loading' | 'error' | 'empty' | 'idle' }) {
  return (
    <Block
      role="Card"
      state={state}
      emptyContent={<Text>No data available</Text>}
      errorContent={<Text intent="Critical">Failed to load</Text>}
    >
      {/* 정상 데이터 */}
      <Text>Data content here</Text>
    </Block>
  );
}
```

---

### 3. Accordion (Collapsible)

```tsx
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/types/Block/Block';

function FAQAccordion() {
  return (
    <Block role="Accordion" mode="single">
      <AccordionItem value="item1">
        <AccordionTrigger>What is IDDL?</AccordionTrigger>
        <AccordionContent>
          IDDL is an Intent-Driven Design Language...
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item2">
        <AccordionTrigger>How do I use Block?</AccordionTrigger>
        <AccordionContent>
          Block is used to group Elements...
        </AccordionContent>
      </AccordionItem>
    </Block>
  );
}
```

---

## ✅ 이 문서를 읽고 나면

- [x] Block의 역할을 이해했다
- [x] 6가지 BlockRole 카테고리를 파악했다
- [x] Layout 시스템을 활용할 수 있다
- [x] Prominence × Intent 조합을 사용할 수 있다
- [x] 실전 패턴 (Form, Card, Toolbar, List)을 익혔다

---

## 🔗 다음 단계

[Section 컴포넌트](./05-section.md) - 레이아웃 영역 (Header, Sidebar, Editor, Panel)

---

**최종 업데이트**: 2026-01-11
**난이도**: 중급
**예상 소요 시간**: 30분
