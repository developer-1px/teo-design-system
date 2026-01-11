# Role (역할 기반 설계)

**난이도**: ⭐⭐⭐☆☆
**소요 시간**: 20분
**선행 학습**: [Prominence](./01-prominence.md), [Intent](./02-intent.md), [Density](./03-density.md)

---

## 📌 이 문서에서 배울 내용

- Role이 무엇이고 왜 중요한가?
- Role vs Type 차이
- 컴포넌트별 주요 Role
- Role 기반 자동화
- 자주 하는 실수와 해결법

---

## 🎯 Role이란?

**Role**은 "구체적인 역할"을 나타내는 IDDL의 핵심 축입니다.

```tsx
// "이 컴포넌트가 무슨 역할을 하는가?"를 선언
<Text role="Title">Welcome</Text>        // 제목 역할
<Text role="Body">Description</Text>     // 본문 역할
<Text role="Label">Email</Text>          // 레이블 역할
```

**개발자가 선언하는 것**: 이 컴포넌트의 역할
**시스템이 처리하는 것**: HTML 태그, ARIA 속성, 기본 스타일, 키보드 탐색

---

## 🔄 Role vs Type

### Type: "무엇인가?" (분류)

```tsx
Page      // 페이지
Section   // 레이아웃 영역
Block     // 논리적 그룹
Element   // 기본 요소 (Text, Field, Action)
Overlay   // Floating UI
```

### Role: "어떤 역할?" (구체적 용도)

```tsx
// 같은 Text Element이지만 다른 Role
<Text role="Title">제목</Text>         // Type: Element, Role: Title
<Text role="Body">본문</Text>          // Type: Element, Role: Body
<Text role="Label">레이블</Text>       // Type: Element, Role: Label
<Text role="Code">코드</Text>          // Type: Element, Role: Code
```

**차이점**:
- **Type**: 컴포넌트 분류 (5가지: Page, Section, Block, Element, Overlay)
- **Role**: 구체적 역할 (무수히 많음: Title, Body, Button, Form, etc.)

---

## 📚 컴포넌트별 주요 Role

### Page Role (페이지 유형)

```tsx
// Application: 전체 화면 앱 (IDE, Studio)
<Page role="Application" layout="Studio">
  {/* CSS Grid 레이아웃 자동 생성 */}
</Page>

// Document: 스크롤 가능한 문서
<Page role="Document" title="Settings">
  {/* max-width, overflow-y-auto */}
</Page>

// Focus: 중앙 집중 (로그인, 결제)
<Page role="Focus" title="Sign In">
  {/* flex items-center justify-center */}
</Page>

// Fullscreen: 전체 화면 잠금 (프레젠테이션)
<Page role="Fullscreen">
  {/* w-screen h-screen overflow-hidden */}
</Page>
```

**자동화**:
- Application → CSS Grid 레이아웃 생성
- Document → max-width, 스크롤
- Focus → 중앙 정렬
- Fullscreen → 뷰포트 잠금

---

### Section Role (레이아웃 영역)

```tsx
// IDE 레이아웃
<Section role="ActivityBar">...</Section>      // 좌측 아이콘 바 (48px)
<Section role="PrimarySidebar">...</Section>   // 파일 트리 (250px)
<Section role="Editor">...</Section>           // 코드 편집기 (1fr)
<Section role="Panel">...</Section>            // 하단 패널 (300px)
<Section role="SecondarySidebar">...</Section> // 우측 사이드바 (250px)

// 일반 레이아웃
<Section role="Header">...</Section>       // 헤더
<Section role="Footer">...</Section>       // 푸터
<Section role="Container">...</Section>    // 컨테이너
<Section role="Navigator">...</Section>    // 네비게이션
```

**자동화**:
- role에 따라 CSS Grid area 위치 결정
- 기본 너비/높이 자동 설정
- Resizable 기본값 설정

---

### Block Role (논리적 그룹)

```tsx
// Form: 폼 그룹
<Block role="Form" prominence="Strong">
  <Field label="Name" />
  <Field label="Email" />
  <Action prominence="Strong">Submit</Action>
</Block>

// Card: 카드
<Block role="Card" prominence="Strong">
  <Text role="Title">Title</Text>
  <Text role="Body">Content</Text>
</Block>

// Toolbar: 버튼 그룹 (가로 배치)
<Block role="Toolbar">
  <Action prominence="Standard">Cancel</Action>
  <Action prominence="Strong">Save</Action>
</Block>

// List: 리스트
<Block role="List">
  {items.map(item => (
    <Text key={item.id} role="Body">{item.name}</Text>
  ))}
</Block>

// Grid: 그리드 레이아웃
<Block role="Grid">
  {cards.map(card => (
    <Block key={card.id} role="Card">...</Block>
  ))}
</Block>
```

**자동화**:
- Form → 세로 배치 (flex-col), gap 자동
- Card → shadow, rounded, padding 자동
- Toolbar → 가로 배치 (flex-row), justify-end
- List → 세로 배치, divider 자동
- Grid → grid layout, gap 자동

---

### Text Role (텍스트 유형)

```tsx
// Title: 제목
<Text role="Title" prominence="Hero">Main Title</Text>

// Body: 본문
<Text role="Body" prominence="Standard">Description</Text>

// Label: 레이블 (Form field 레이블)
<Text role="Label">Email</Text>

// Code: 코드 (monospace font)
<Text role="Code">const x = 10;</Text>

// Badge: 뱃지 (작은 상태 표시)
<Text role="Badge" intent="Positive">Active</Text>

// Alert: 알림 메시지
<Text role="Alert" intent="Critical">Error occurred</Text>

// Kbd: 키보드 단축키
<Text role="Kbd">Cmd+S</Text>
```

**자동화**:
- Title → text-xl, font-semibold
- Body → text-base, font-normal
- Label → text-sm, uppercase
- Code → font-mono, bg-gray-100
- Badge → px-2 py-1, rounded-full
- Alert → border-l-4, padding
- Kbd → border, shadow, font-mono

---

### Field Role (입력 필드 유형)

```tsx
// Input: 텍스트 입력
<Field role="Input" label="Name" dataType="text" />

// Select: 드롭다운 선택
<Field role="Select" label="Country" dataType="select" options={countries} />

// Checkbox: 체크박스
<Field role="Checkbox" label="Agree" dataType="checkbox" />

// Radio: 라디오 버튼
<Field role="Radio" label="Gender" dataType="radio" options={genders} />

// Textarea: 여러 줄 입력
<Field role="Textarea" label="Message" dataType="textarea" />
```

**자동화**:
- role에 따라 적절한 HTML 태그 선택
- ARIA 속성 자동 설정
- 키보드 탐색 자동 처리
- 유효성 검증 자동 적용

---

### Action Role (액션 유형)

```tsx
// Button: 일반 버튼
<Action role="Button" prominence="Strong" intent="Positive">
  Save
</Action>

// IconButton: 아이콘 버튼
<Action role="IconButton" title="Settings">
  <Settings size={20} />
</Action>

// Link: 링크
<Action role="Link" href="/docs">
  Documentation
</Action>

// MenuItem: 메뉴 아이템
<Action role="MenuItem" onClick={handleClick}>
  Open File
</Action>
```

**자동화**:
- Button → `<button>` 태그, role="button"
- IconButton → padding 최소화, 정사각형
- Link → `<a>` 태그, href 처리
- MenuItem → 가로 폭 100%, 텍스트 좌측 정렬

---

## ⚙️ Role 기반 자동화

### 1. HTML 태그 자동 선택

```tsx
// Role에 따라 자동으로 적절한 태그 생성

<Text role="Title">        → <h1> 또는 <h2>
<Text role="Body">         → <p>
<Text role="Label">        → <label>
<Text role="Code">         → <code>

<Action role="Button">     → <button>
<Action role="Link">       → <a>
<Action role="MenuItem">   → <button role="menuitem">

<Field role="Input">       → <input>
<Field role="Select">      → <select>
<Field role="Checkbox">    → <input type="checkbox">
```

---

### 2. ARIA 속성 자동 설정

```tsx
// Role에 따라 ARIA 속성 자동 추가

<Block role="Toolbar">
  // → role="toolbar"
  // → aria-label="Toolbar"

<Block role="List">
  // → role="list"
  // → 자식에 role="listitem" 자동

<Action role="MenuItem">
  // → role="menuitem"
  // → aria-haspopup (서브메뉴 있으면)
```

---

### 3. 레이아웃 자동 처리

```tsx
// Role에 따라 레이아웃 자동 적용

<Block role="Form">
  // → flex flex-col gap-4

<Block role="Toolbar">
  // → flex flex-row justify-end gap-2

<Block role="Grid">
  // → grid grid-cols-auto-fit gap-4

<Block role="List">
  // → flex flex-col divide-y
```

---

## 🎨 실전 패턴

### 1. 로그인 폼

```tsx
function LoginForm() {
  return (
    <Page role="Focus" title="Sign In">
      <Section role="Container">
        <Block role="Form" prominence="Strong">
          <Text role="Title" prominence="Strong">
            Sign In
          </Text>

          <Field role="Input" label="Email" dataType="email" required />
          <Field role="Input" label="Password" dataType="password" required />

          <Block role="Toolbar">
            <Action role="Link" href="/forgot-password" prominence="Subtle">
              Forgot Password?
            </Action>
            <Action role="Button" prominence="Strong" intent="Brand">
              Sign In
            </Action>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

**자동화**:
- Page role="Focus" → 중앙 정렬
- Block role="Form" → 세로 배치, gap-4
- Field role="Input" → `<input>` 태그, ARIA
- Block role="Toolbar" → 가로 배치, justify-end
- Action role="Button" → `<button>` 태그

---

### 2. IDE 레이아웃

```tsx
function IDELayout() {
  return (
    <Page role="Application" layout="Studio">
      <Section role="ActivityBar">
        <Block role="List" density="Compact">
          <Action role="IconButton" title="Files">
            <Files size={20} />
          </Action>
          <Action role="IconButton" title="Search">
            <Search size={20} />
          </Action>
        </Block>
      </Section>

      <Section role="PrimarySidebar" resizable>
        <Block role="List" density="Compact">
          {/* 파일 트리 */}
        </Block>
      </Section>

      <Section role="Editor">
        <CodeEditor />
      </Section>

      <Section role="Panel" resizable>
        <Block role="List" density="Compact">
          {/* 터미널 로그 */}
        </Block>
      </Section>
    </Page>
  );
}
```

**자동화**:
- Page role="Application" → CSS Grid 생성
- Section role="ActivityBar" → 48px 고정
- Section role="PrimarySidebar" → 250px 기본, resizable
- Section role="Editor" → 1fr (남은 공간)
- Section role="Panel" → 300px 기본, resizable

---

### 3. 대시보드 카드 그리드

```tsx
function Dashboard() {
  return (
    <Page role="Application" density="Compact">
      <Section role="Container">
        <Text role="Title" prominence="Hero">
          Dashboard
        </Text>

        <Block role="Grid">
          <Block role="Card" prominence="Strong">
            <Text role="Title" prominence="Hero">$1.2M</Text>
            <Text role="Body" prominence="Standard">Revenue</Text>
          </Block>

          <Block role="Card" prominence="Standard">
            <Text role="Title" prominence="Strong">1,234</Text>
            <Text role="Body" prominence="Standard">Users</Text>
          </Block>

          <Block role="Card" prominence="Standard">
            <Text role="Title" prominence="Strong">567</Text>
            <Text role="Body" prominence="Standard">Signups</Text>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

**자동화**:
- Block role="Grid" → grid layout, gap-4
- Block role="Card" → shadow, rounded, padding

---

## 🚫 자주 하는 실수

### 실수 1: Role을 생략

```tsx
// ❌ BAD - role 없음
<Text>Welcome</Text>

// ✅ GOOD - role 명시
<Text role="Title" prominence="Hero">
  Welcome
</Text>
```

**이유**: role이 없으면 기본 스타일만 적용되고 의미가 명확하지 않습니다.

---

### 실수 2: 부적절한 Role 선택

```tsx
// ❌ BAD - 제목인데 Body role
<Text role="Body" prominence="Hero">
  Main Title
</Text>

// ✅ GOOD
<Text role="Title" prominence="Hero">
  Main Title
</Text>
```

**이유**: prominence와 role이 일치해야 합니다.

---

### 실수 3: Role과 Type 혼동

```tsx
// ❌ BAD - Page에 Button role?
<Page role="Button">  // role="Button"은 Action용

// ✅ GOOD
<Page role="Application">  // PageRole 사용
```

**이유**: 각 컴포넌트는 정해진 role만 사용할 수 있습니다.

---

## 📝 실습: 설정 페이지

### 요구사항

다음 요구사항을 만족하는 설정 페이지를 만드세요:

1. 페이지 제목: "Settings"
2. 섹션 제목: "Profile"
3. 폼 필드: Name, Email
4. 버튼: Cancel, Save Changes

각 요소에 적절한 role을 지정하세요.

### 정답 예시

```tsx
function SettingsPage() {
  return (
    <Page role="Document" title="Settings">
      <Section role="Container">
        <Text role="Title" prominence="Hero">
          Settings
        </Text>

        <Block role="Form" prominence="Strong">
          <Text role="Title" prominence="Strong">
            Profile
          </Text>

          <Field role="Input" label="Name" dataType="text" required />
          <Field role="Input" label="Email" dataType="email" required />

          <Block role="Toolbar">
            <Action role="Button" prominence="Standard" intent="Neutral">
              Cancel
            </Action>
            <Action role="Button" prominence="Strong" intent="Positive">
              Save Changes
            </Action>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

**체크리스트**:
- [ ] Page role이 "Document"인가?
- [ ] 페이지 제목 role이 "Title"인가?
- [ ] 섹션 role이 "Container"인가?
- [ ] 폼 role이 "Form"인가?
- [ ] 필드 role이 "Input"인가?
- [ ] 버튼 그룹 role이 "Toolbar"인가?
- [ ] 버튼 role이 "Button"인가?

---

## ✅ 이 문서를 읽고 나면

- [x] Role의 개념을 이해했다
- [x] Role과 Type의 차이를 알았다
- [x] 컴포넌트별 주요 Role을 파악했다
- [x] Role 기반 자동화를 이해했다
- [x] 적절한 Role을 선택할 수 있다

---

## 🔗 다음 단계

[Type](./05-type.md) - 컴포넌트 타입 계층 구조를 배웁니다.

---

**최종 업데이트**: 2026-01-11
**난이도**: 중급
**예상 소요 시간**: 20분
