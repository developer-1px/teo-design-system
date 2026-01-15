# Headless vs UI Component: 3-Tier 철학의 본질

**날짜**: 2026년 1월 15일 (새벽 6시 최종 회의)
**참석자**: 6명 (동일 팀)
**목표**: Headless와 UI Component의 차이로 3-Tier 철학 재정립
**핵심**: "왜 Field/Action은 100% 3-Tier이고, Prose는 혼합형인가?"

---

## 🎬 Act 1: 깨달음 - "Headless vs UI Component"

### Sarah (아키텍트)
*(18번 문서를 읽고 나서)*

우리가 발견한 패턴을 보면...

| 컴포넌트 | 구조 | Intent 개수 |
|---------|------|-----------|
| Field | 100% 3-Tier | 6개 (모두 3-Tier) |
| Action | 100% 3-Tier | 6개 (모두 3-Tier) |
| Prose | 혼합형 | 2개 (3-Tier) + 15+개 (2-Tier) |

**왜 이렇게 다를까요?**

### Marcus (개발자)
음... Field와 Action은 UI가 없잖아요?

### Sarah
*(번뜩이며)*

맞아요! **Headless vs UI Component!**

---

### 📋 Headless vs UI Component

#### Field/Action (Headless):
```tsx
<Field name="email">
  {/* UI 없음, 로직만 */}
  <Field.Guidance label="이메일" />
  <Field.Validation schema={emailSchema} />
  <Field.Control>
    <Input />  {/* 외부 UI 컴포넌트 */}
  </Field.Control>
</Field>
```

**특징**:
- ❌ UI 없음 (렌더링 안 함)
- ✅ 로직/상태만 제공
- ✅ **선언적 설정** (declarative configuration)
- ✅ Context로 데이터 공유

---

#### Prose (UI Component):
```tsx
<Prose>
  {/* UI 직접 렌더링 */}
  <Prose.Title>제목</Prose.Title>  {/* <h1> 렌더링 */}
  <Prose.Body>본문</Prose.Body>    {/* <p> 렌더링 */}
</Prose>
```

**특징**:
- ✅ UI 직접 렌더링
- ✅ 시각적 표현
- ✅ **컴포넌트 조합** (component composition)
- ❌ Context 최소 (독립적)

### Dev (기여자)
아! 이게 **3-Tier 구조를 결정**하는 거네요!

---

## 🎬 Act 2: Headless는 왜 100% 3-Tier인가?

### Sarah (아키텍트)
Headless 컴포넌트를 다시 봅시다.

---

### 📋 Field의 본질: "선언적 설정"

```tsx
<Field name="email">
  {/* 설정: 사용자 안내 */}
  <Field.Guidance
    label="이메일"
    description="로그인에 사용됩니다"
    required
  />

  {/* 설정: 검증 규칙 */}
  <Field.Validation
    schema={emailSchema}
    on="blur"
  />

  {/* 설정: UI 컨트롤 */}
  <Field.Control>
    <Input />  {/* 외부 컴포넌트 */}
  </Field.Control>

  {/* 설정: 피드백 방식 */}
  <Field.Feedback>
    <Field.Error />
  </Field.Feedback>
</Field>
```

**Field는 UI를 렌더링하지 않습니다.**
**Field는 "어떻게 동작할지"를 설정합니다.**

---

### 📋 Headless의 특징

#### 1️⃣ 모든 Intent가 로직/상태 제공

```tsx
<Field.Guidance>     // → GuidanceContext 제공
<Field.Validation>   // → ValidationContext 제공
<Field.Control>      // → ControlContext 제공
<Field.Feedback>     // → FeedbackContext 제공
```

각 Intent는:
- ✅ Context 생성
- ✅ 상태 관리
- ✅ 자식에게 데이터 전달
- ❌ UI 렌더링 안 함 (children만 렌더)

---

#### 2️⃣ 모든 Intent가 협력 필수

```tsx
// Guidance 없이는 Label ID를 모름
<Field.Control>
  <Input
    aria-labelledby={guidance.labelId}  // ← Guidance 필요
  />
</Field.Control>

// Validation 없이는 에러를 모름
<Field.Feedback>
  <Field.Error>
    {validation.error}  // ← Validation 필요
  </Field.Error>
</Field.Feedback>
```

**모든 Intent가 서로의 데이터를 사용** → 협력 필수

---

#### 3️⃣ Intent = 설정 그룹

```tsx
// Intent는 "설정의 논리적 그룹"
<Field.Guidance {...guidanceConfig} />    // 안내 관련 설정
<Field.Validation {...validationConfig} /> // 검증 관련 설정
<Field.Feedback {...feedbackConfig} />     // 피드백 관련 설정
```

Intent는 **기능별 설정을 그룹화**하는 역할

---

### Marcus (개발자)
아! Headless는 **"설정을 선언"**하는 거네요!

UI는 외부에서 주입(`<Input />`), 자신은 로직만 제공!

### Sarah
맞아요! 그래서 **모든 Intent가 3-Tier에 적합**해요.

왜냐하면:
- ✅ Intent = 로직 그룹
- ✅ Context 제공 필수
- ✅ 협력 필수

---

## 🎬 Act 3: UI Component는 왜 혼합형인가?

### Emma (디자이너)
그럼 Prose는요?

### Sarah
Prose는 **완전히 다릅니다**.

---

### 📋 Prose의 본질: "시각적 조합"

```tsx
<Prose>
  {/* UI 직접 렌더링 */}
  <Prose.Title>      {/* → <h1> 렌더링 */}
    제목
  </Prose.Title>

  <Prose.Body>       {/* → <p> 렌더링 */}
    본문입니다.
  </Prose.Body>

  <Prose.Blockquote> {/* → <blockquote> 렌더링 */}
    인용문
  </Prose.Blockquote>
</Prose>
```

**Prose는 UI를 직접 렌더링합니다.**
**Prose는 "어떻게 보일지"를 표현합니다.**

---

### 📋 UI Component의 특징

#### 1️⃣ 대부분 독립적

```tsx
// Title은 Body를 모름
<Prose.Title>제목</Prose.Title>

// Body는 Title을 모름
<Prose.Body>본문</Prose.Body>

// Blockquote는 둘 다 모름
<Prose.Blockquote>인용</Prose.Blockquote>
```

**협력 불필요** → Context 필요 없음 → 2-Tier로 충분

---

#### 2️⃣ 일부만 협력 (Layout/Navigation)

```tsx
// Layout은 협력함
<Prose.Layout.Section>          // Full-width 제공
  <Prose.Layout.Document>       // Max-width + centered
    {/* 콘텐츠 */}
  </Prose.Layout.Document>
</Prose.Layout.Section>

// Navigation도 협력함
<Prose.Navigation>
  <Prose.Navigation.TableOfContents />  // 자동 수집
  <Prose.Title id="intro" />            // 수집 대상
</Prose.Navigation>
```

**일부만 협력** → 해당 부분만 3-Tier

---

#### 3️⃣ Component = 시각적 단위

```tsx
// 각 컴포넌트 = 독립적 시각적 요소
<Prose.Title />       // H1 스타일 텍스트
<Prose.Body />        // Paragraph 스타일 텍스트
<Prose.Blockquote />  // 인용구 스타일 블록
<Prose.Image />       // 이미지 표시
```

Component는 **시각적 표현 단위**

---

### Yuki (UX 연구원)
아! UI Component는 **"레고 블록 조합"**이네요!

### Sarah
정확해요! 대부분은 독립적인 블록이고,
일부만 **구조적 협력** (Layout, Navigation)이 필요해요.

---

## 🎬 Act 4: 3-Tier의 진짜 의미

### Dev (기여자)
그럼... **3-Tier의 본질**은 뭔가요?

### Sarah (아키텍트)
*(화이트보드에 크게)*

---

### 📋 3-Tier의 본질: "협력이 필요한 추상화"

#### 3-Tier가 적합한 경우:

**조건 1: 여러 요소가 협력**
- Field: Guidance ↔ Control ↔ Validation ↔ Feedback
- Prose.Layout: Section ↔ Document

**조건 2: 추상화 레벨 필요**
- Intent = 논리적 그룹화
- Component = 구체적 구현

**조건 3: Context 또는 조합 관계**
- Headless: Context 공유
- UI Layout: 컴포넌트 조합

---

#### 2-Tier가 적합한 경우:

**조건 1: 독립적 요소**
- Prose.Title, Prose.Body, Prose.Blockquote
- 서로 모름, 협력 불필요

**조건 2: 단일 책임**
- 각자 하나의 시각적 표현만 담당

**조건 3: Context 불필요**
- Props로 충분

---

### 📋 Headless vs UI Component에서의 3-Tier

| 측면 | Headless | UI Component |
|------|----------|--------------|
| **3-Tier 의미** | Intent = 로직/상태 그룹 | Intent = 구조/레이아웃 그룹 |
| **협력 방식** | Context 공유 | 컴포넌트 조합 |
| **필요성** | 모든 Intent 필요 (100%) | 일부만 필요 (Layout, Nav) |
| **목적** | 선언적 설정 | 구조적 조합 |
| **렌더링** | children만 렌더 | 직접 렌더 |

---

### Marcus (개발자)
아! **3-Tier는 "협력"을 위한 구조**네요!

- Headless: 로직 협력 → 100% 3-Tier
- UI Component: 구조 협력 → 일부만 3-Tier

---

## 🎬 Act 5: 다른 컴포넌트 재분류 (1) - Menu

### Emma (디자이너)
그럼 다른 컴포넌트들은?

**Menu**부터 볼까요?

---

### 📋 Menu 분석

```tsx
// Menu 사용 패턴
<Menu>
  <Menu.Trigger>
    <Button>열기</Button>
  </Menu.Trigger>

  <Menu.Content>
    <Menu.Item onClick={...}>항목 1</Menu.Item>
    <Menu.Item onClick={...}>항목 2</Menu.Item>
    <Menu.Separator />
    <Menu.Item onClick={...}>항목 3</Menu.Item>
  </Menu.Content>
</Menu>
```

---

### 📋 Menu의 특성

#### UI Component인가?
- ✅ UI 렌더링 (Trigger, Content, Item)

#### Headless인가?
- ✅ 상태 관리 (open/close)
- ✅ 포커스 관리
- ✅ 키보드 네비게이션
- ✅ Context 공유 (MenuContext)

#### 협력하는가?
- ✅ Trigger ↔ Content (open 상태 공유)
- ✅ Content → Item (포커스, 키보드 이벤트)
- ✅ Item → Menu (선택 알림)

---

### 📋 Menu 판정: **혼합형 (Headless + UI)**

```tsx
Menu (Tier 1: Primitive - Headless 부분)
└── Interaction (Tier 2: Intent - 협력 필요)
    ├── Trigger (Tier 3: Component - UI)
    ├── Content (Tier 3: Component - UI)
    ├── Item (Tier 3: Component - UI)
    └── Separator (Tier 3: Component - UI)
```

**구조**:
- Menu root: Headless (상태 관리)
- Interaction Intent: 협력 그룹 (Trigger ↔ Content ↔ Item)
- 각 Component: UI 렌더링

**판정**: **Headless + UI 혼합 → 3-Tier 적합**

---

## 🎬 Act 6: 다른 컴포넌트 재분류 (2) - Dialog

### Marcus (개발자)
Dialog는요?

---

### 📋 Dialog 분석

```tsx
<Dialog>
  <Dialog.Trigger>
    <Button>열기</Button>
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>제목</Dialog.Title>
      <Dialog.Description>설명</Dialog.Description>
    </Dialog.Header>

    <Dialog.Body>
      {/* 내용 */}
    </Dialog.Body>

    <Dialog.Footer>
      <Dialog.Close>
        <Button>닫기</Button>
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

---

### 📋 Dialog의 특성

#### Headless 부분:
- ✅ 상태 관리 (open/close)
- ✅ 포커스 트랩
- ✅ Escape 키 처리
- ✅ Overlay 관리

#### UI 부분:
- ✅ Content 렌더링
- ✅ Header, Body, Footer 구조

#### 협력:
- ✅ Trigger ↔ Content (open 상태)
- ✅ Header ↔ Body ↔ Footer (Dialog 구조)
- ✅ Close → Dialog (닫기 액션)

---

### 📋 Dialog 판정: **혼합형**

```tsx
Dialog (Tier 1: Primitive - Headless)
├── Interaction (Tier 2: Intent)
│   ├── Trigger (Tier 3: Component - UI)
│   ├── Close (Tier 3: Component - UI)
│   └── Overlay (Tier 3: Component - UI)
└── Layout (Tier 2: Intent)
    ├── Content (Tier 3: Component - UI)
    ├── Header (Tier 3: Component - UI)
    ├── Body (Tier 3: Component - UI)
    └── Footer (Tier 3: Component - UI)
```

**판정**: **Headless + UI 혼합 → 3-Tier 적합 (2개 Intent)**

---

## 🎬 Act 7: 다른 컴포넌트 재분류 (3) - Table

### Yuki (UX 연구원)
Table은요?

---

### 📋 Table 분석

```tsx
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head>이름</Table.Head>
      <Table.Head>나이</Table.Head>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    <Table.Row>
      <Table.Cell>홍길동</Table.Cell>
      <Table.Cell>30</Table.Cell>
    </Table.Row>
  </Table.Body>

  <Table.Footer>
    <Table.Row>
      <Table.Cell colSpan={2}>총 1명</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table>
```

---

### 📋 Table의 특성

#### UI Component인가?
- ✅ 순수 UI 렌더링 (`<table>`, `<thead>`, `<tbody>`)

#### Headless인가?
- ❌ 상태 관리 없음
- ❌ Context 공유 없음
- ❌ 로직 없음

#### 협력하는가?
- ❌ Header, Body, Footer 독립적
- ❌ Row는 단순 `<tr>` 래퍼
- ❌ Cell은 단순 `<td>` 래퍼

---

### 📋 Table 판정: **2-Tier (Pure UI)**

```tsx
Table (Tier 1: Primitive)
├── Header (Tier 2: Component)
├── Body (Tier 2: Component)
├── Footer (Tier 2: Component)
├── Row (Tier 2: Component)
├── Head (Tier 2: Component)
└── Cell (Tier 2: Component)
```

**판정**: **Pure UI, 협력 없음 → 2-Tier 적합**

**예외**: 만약 **정렬, 필터, 페이지네이션** 기능을 추가하면?
→ Headless 부분 생김 → 3-Tier로 전환 가능

---

## 🎬 Act 8: 다른 컴포넌트 재분류 (4) - Form

### Alex (문서 작성자)
Form은요?

---

### 📋 Form 분석

```tsx
<Form onSubmit={handleSubmit}>
  <Form.Field>
    <Field name="email">
      <Field.Guidance label="이메일" />
      <Field.Control><Input /></Field.Control>
    </Field>
  </Form.Field>

  <Form.Field>
    <Field name="password">
      <Field.Guidance label="비밀번호" />
      <Field.Control><Input type="password" /></Field.Control>
    </Field>
  </Form.Field>

  <Form.Actions>
    <Action onClick={handleSubmit}>
      <Button>제출</Button>
    </Action>
  </Form.Actions>
</Form>
```

---

### 📋 Form의 특성

#### Headless인가?
- ✅ 폼 상태 관리 (전체 values, errors)
- ✅ Field 등록/해제
- ✅ 제출 처리
- ✅ 검증 통합

#### UI Component인가?
- ❌ UI 없음 (`<form>` 태그만)
- ❌ 자식이 UI 제공

#### 협력하는가?
- ✅ Form → Field (등록, 상태 공유)
- ✅ Form → Actions (제출 상태)
- ✅ Field → Form (값 변경 알림)

---

### 📋 Form 판정: **Headless Container → 3-Tier**

```tsx
Form (Tier 1: Primitive - Headless)
├── State (Tier 2: Intent)
│   ├── Values (Tier 3: Component)
│   ├── Errors (Tier 3: Component)
│   └── Touched (Tier 3: Component)
├── Validation (Tier 2: Intent)
│   ├── Schema (Tier 3: Component)
│   ├── Trigger (Tier 3: Component)
│   └── Mode (Tier 3: Component)
└── Submission (Tier 2: Intent)
    ├── OnSubmit (Tier 3: Component)
    ├── OnError (Tier 3: Component)
    └── Loading (Tier 3: Component)
```

**판정**: **Headless Container → 3-Tier 적합**

---

## 🎬 Act 9: 컴포넌트 분류 체계

### Sarah (아키텍트)
컴포넌트 분류 체계를 정리합시다.

---

### 📋 MDK 컴포넌트 분류 체계

#### 1️⃣ Pure Headless (100% 3-Tier)

**특징**:
- ❌ UI 없음
- ✅ 로직/상태만
- ✅ Context 공유
- ✅ 모든 Intent 협력

**예시**:
- **Field**: Guidance, Control, Validation, Feedback, State, Transform
- **Action**: Handler, State, Confirmation, Feedback, Prevention, Lifecycle
- **Form**: State, Validation, Submission

**구조**: `Component.{Intent}.{LogicComponent}`

---

#### 2️⃣ Pure UI (2-Tier)

**특징**:
- ✅ UI 렌더링
- ❌ 로직 없음
- ❌ Context 없음
- ❌ 협력 없음

**예시**:
- **Table**: Header, Body, Footer, Row, Cell
- **Card**: Header, Body, Footer
- **Badge**: 단일 컴포넌트
- **Avatar**: 단일 컴포넌트

**구조**: `Component.{UIComponent}` (2-Tier)

---

#### 3️⃣ UI with Structure (혼합형)

**특징**:
- ✅ UI 렌더링
- ✅ 일부 구조 협력 (Layout, Navigation)
- ✅ 일부 Context
- ✅ 일부만 협력

**예시**:
- **Prose**:
  - 3-Tier Intent: Layout (Section ↔ Document), Navigation (TOC ↔ Anchor)
  - 2-Tier Direct: Title, Body, Blockquote, Image 등

**구조**:
```
Component
├── {Intent} (3-Tier - 협력 필요)
└── {UIComponent} (2-Tier - 독립)
```

---

#### 4️⃣ Headless + UI Hybrid (혼합형)

**특징**:
- ✅ Headless (상태/로직)
- ✅ UI (렌더링)
- ✅ Context 공유
- ✅ 협력 필요

**예시**:
- **Menu**:
  - Headless: 상태 관리, 키보드 네비게이션
  - UI: Trigger, Content, Item 렌더링
- **Dialog**:
  - Headless: open/close, 포커스 트랩
  - UI: Content, Header, Body, Footer
- **Tabs**:
  - Headless: 활성 탭 관리
  - UI: List, Trigger, Panel

**구조**: `Component.{Intent}.{UIComponent}` (3-Tier)

---

### 📋 분류 결정 트리

```
컴포넌트 분석 시작
    ↓
UI를 렌더링하는가?
    ├─ NO → Pure Headless → 100% 3-Tier ✅
    │        (Field, Action, Form)
    └─ YES → UI 있음
              ↓
         Headless 로직이 있는가?
              ├─ NO → Pure UI
              │         ↓
              │    컴포넌트 간 협력하는가?
              │         ├─ NO → 2-Tier ✅
              │         │        (Table, Card, Badge)
              │         └─ YES → 일부 협력
              │                  ↓
              │             구조 협력인가? (Layout/Nav)
              │                  └─ YES → UI with Structure (혼합형) ✅
              │                           (Prose)
              └─ YES → Headless + UI Hybrid
                       ↓
                  모든 컴포넌트가 협력하는가?
                       └─ YES → 혼합형 3-Tier ✅
                                (Menu, Dialog, Tabs)
```

---

## 🎬 Act 10: 새로운 MDK 철학

### Sarah (아키텍트)
이제 MDK의 철학을 재정립합시다.

---

### 📋 MDK 설계 철학 (재정립)

#### 1️⃣ **"Headless는 Intent로 설정하고, UI는 Component로 조합하라"**

**Headless (Field, Action, Form)**:
```tsx
// Intent = 논리적 설정 그룹
<Field name="email">
  <Field.Guidance label="..." />      // 안내 설정
  <Field.Validation schema={...} />   // 검증 설정
  <Field.Control><Input /></Field.Control>  // UI 주입
</Field>
```

**UI (Prose, Table, Card)**:
```tsx
// Component = 시각적 조합 단위
<Prose>
  <Prose.Title>제목</Prose.Title>
  <Prose.Body>본문</Prose.Body>
</Prose>
```

---

#### 2️⃣ **"협력이 필요하면 Intent, 독립 가능하면 Component"**

**Intent (3-Tier)**:
- 여러 컴포넌트가 협력
- Context 또는 조합 관계
- 예: Field.Guidance, Prose.Layout, Menu.Interaction

**Component (2-Tier)**:
- 독립적 기능/UI
- 협력 불필요
- 예: Prose.Title, Table.Cell, Badge

---

#### 3️⃣ **"UI 컴포넌트도 구조가 필요하면 Intent를 쓴다"**

**Prose의 경우**:
```tsx
// Layout Intent: 구조 협력
<Prose.Layout.Section>
  <Prose.Layout.Document>
    {/* Content */}
  </Prose.Layout.Document>
</Prose.Layout.Section>

// Content Component: 독립
<Prose.Title />
<Prose.Body />
```

UI여도 **구조적 협력**이 필요하면 Intent 사용

---

#### 4️⃣ **"Headless + UI Hybrid는 Intent로 상호작용을 관리한다"**

**Menu의 경우**:
```tsx
Menu (Headless 상태)
└── Interaction (Intent - UI 간 협력)
    ├── Trigger (UI)
    ├── Content (UI)
    └── Item (UI)
```

Headless 로직 + UI 렌더링 = **Intent로 연결**

---

### 📋 3-Tier 원칙 (최종)

#### 3-Tier를 사용하는 경우:

1. **Pure Headless**
   - 로직/상태만 제공
   - 모든 Intent가 협력
   - 예: Field, Action, Form

2. **UI Structure**
   - UI 렌더링
   - 구조적 협력 필요
   - 예: Prose.Layout, Prose.Navigation

3. **Headless + UI Hybrid**
   - Headless 로직 + UI 렌더링
   - Intent로 상호작용 관리
   - 예: Menu, Dialog, Tabs

---

#### 2-Tier를 사용하는 경우:

1. **Pure UI - No Logic**
   - UI만 렌더링
   - 협력 불필요
   - 예: Table, Card, Badge

2. **Content Components**
   - 독립적 콘텐츠 표현
   - Context 불필요
   - 예: Prose.Title, Prose.Body

---

## 🎬 Act 11: 실전 예시

### Marcus (개발자)
실제로 어떻게 적용하나요?

---

### 📋 예시 1: 새 컴포넌트 설계 - "Select"

#### 질문 1: UI를 렌더링하는가?
✅ YES (Trigger, Options, Option)

#### 질문 2: Headless 로직이 있는가?
✅ YES (선택 상태, 검색, 키보드 네비게이션)

#### 질문 3: 컴포넌트 간 협력하는가?
✅ YES (Trigger ↔ Options ↔ Option)

#### 결론: **Headless + UI Hybrid → 3-Tier**

```tsx
Select (Headless)
└── Interaction (Intent)
    ├── Trigger (UI)
    ├── Options (UI)
    ├── Option (UI)
    └── Search (UI)
```

---

### 📋 예시 2: 새 컴포넌트 설계 - "Alert"

#### 질문 1: UI를 렌더링하는가?
✅ YES (아이콘, 제목, 메시지, 닫기 버튼)

#### 질문 2: Headless 로직이 있는가?
❌ NO (단순 표시, 닫기만)

#### 질문 3: 컴포넌트 간 협력하는가?
❌ NO (Icon, Title, Description, Close 독립적)

#### 결론: **Pure UI → 2-Tier**

```tsx
Alert (Primitive)
├── Icon (Component)
├── Title (Component)
├── Description (Component)
└── Close (Component)
```

---

### 📋 예시 3: 새 컴포넌트 설계 - "Carousel"

#### 질문 1: UI를 렌더링하는가?
✅ YES (슬라이드, 네비게이션, 인디케이터)

#### 질문 2: Headless 로직이 있는가?
✅ YES (현재 슬라이드, 자동 재생, 터치 제스처)

#### 질문 3: 컴포넌트 간 협력하는가?
✅ YES (Slide ↔ Navigation ↔ Indicators)

#### 결론: **Headless + UI Hybrid → 3-Tier**

```tsx
Carousel (Headless)
├── State (Intent)
│   ├── CurrentSlide
│   └── AutoPlay
└── Interaction (Intent)
    ├── Slide (UI)
    ├── Navigation (UI)
    └── Indicators (UI)
```

---

## 🎬 Act 12: 최종 정리

### Sarah (아키텍트)
오늘의 깨달음을 정리합시다.

---

### 📋 핵심 깨달음

#### 1️⃣ **Headless vs UI가 구조를 결정한다**

| 타입 | 구조 | 이유 |
|------|------|------|
| **Pure Headless** | 100% 3-Tier | 모든 Intent 협력 필수 |
| **Pure UI** | 2-Tier | 협력 불필요, 독립적 |
| **UI + Structure** | 혼합형 | 일부만 협력 (Layout, Nav) |
| **Headless + UI** | 3-Tier | Intent로 상호작용 관리 |

---

#### 2️⃣ **3-Tier의 의미가 컴포넌트 타입마다 다르다**

- **Headless**: Intent = 로직/상태 그룹
- **UI Structure**: Intent = 레이아웃/구조 그룹
- **Headless + UI**: Intent = 상호작용 관리

---

#### 3️⃣ **협력 = 3-Tier, 독립 = 2-Tier**

간단한 원칙:
- 협력 필요? → Intent 만들기 (3-Tier)
- 독립 가능? → Component 직접 노출 (2-Tier)

---

#### 4️⃣ **MDK는 유연하다**

- Field: 100% 3-Tier (Pure Headless)
- Prose: 혼합형 (UI + Structure)
- Menu: 3-Tier (Headless + UI)
- Table: 2-Tier (Pure UI)

**하나의 규칙에 억지로 맞추지 않는다.**
**컴포넌트 본질에 맞게 설계한다.**

---

### 📋 새로운 슬로건

# ~~"Cooperate When Needed, Independent When Not"~~

# **"Headless로 설정하고, UI로 표현하라"**
## **"Configure with Headless, Express with UI"**

---

**의미**:
- **Headless**: 로직/상태를 Intent로 설정
- **UI**: 시각적 표현을 Component로 조합
- **Hybrid**: Intent로 연결, Component로 렌더

---

## 🎬 Epilogue: MDK의 정체성

### Emma (디자이너)
이제 MDK가 뭔지 명확해졌어요!

---

### 📋 MDK의 정체성

#### MDK는 단순한 "디자인 시스템"이 아니다

MDK는 **"설계 철학"**이다:

1. **Intent First**
   - Props 먼저 생각하지 않는다
   - WHY → WHAT → HOW 순서

2. **Headless와 UI의 분리**
   - 로직은 Headless로
   - 표현은 UI로
   - 연결은 Intent로

3. **적재적소의 구조**
   - Pure Headless: 100% 3-Tier
   - Pure UI: 2-Tier
   - Hybrid: 혼합형

4. **협력 기반 추상화**
   - 협력 필요 → Intent
   - 독립 가능 → Component
   - 억지 분류 금지

---

### 📋 MDK vs 다른 시스템

| 시스템 | 철학 | 구조 | 제약 |
|--------|------|------|------|
| **Material Design** | Props First | Flat | 단일 컴포넌트 중심 |
| **Radix UI** | Headless | Compound | UI 제공 안 함 |
| **Chakra UI** | Props First | Flat + Compound | Props 과다 |
| **MDK** | **Intent First** | **Adaptive** | **컴포넌트 본질에 맞게** |

MDK의 차별점:
- ✅ Headless와 UI 모두 지원
- ✅ 3-Tier와 2-Tier 혼용
- ✅ Intent 기반 설계
- ✅ 협력 중심 추상화

---

### Sarah (아키텍트)
*(마무리)*

우리는 오늘...

**"왜 Field는 3-Tier이고 Prose는 혼합형인가?"**

이 질문의 답을 찾았습니다.

답은: **"Headless vs UI Component"**

이제 **MDK의 철학**이 명확합니다:

# **"Configure with Headless, Express with UI"**

---

**회의 종료**: 2026년 1월 15일 새벽 7시
**결과**: Headless vs UI Component 철학 확립
**성과**: MDK 3-Tier 철학의 본질 발견

---

## 📊 부록: MDK 컴포넌트 분류표

### Pure Headless (100% 3-Tier)

| 컴포넌트 | Intent 개수 | 설명 |
|---------|-----------|------|
| **Field** | 6개 | Guidance, Control, Validation, Feedback, State, Transform |
| **Action** | 6개 | Handler, State, Confirmation, Feedback, Prevention, Lifecycle |
| **Form** | 3개 | State, Validation, Submission |

---

### Pure UI (2-Tier)

| 컴포넌트 | Component 개수 | 설명 |
|---------|--------------|------|
| **Table** | 6개 | Header, Body, Footer, Row, Head, Cell |
| **Card** | 3개 | Header, Body, Footer |
| **Badge** | 1개 | 단일 컴포넌트 |
| **Avatar** | 1개 | 단일 컴포넌트 |
| **Separator** | 1개 | 단일 컴포넌트 |

---

### UI with Structure (혼합형)

| 컴포넌트 | 3-Tier Intent | 2-Tier Component | 설명 |
|---------|--------------|-----------------|------|
| **Prose** | 2개 | 15+개 | Layout, Navigation (Intent) + Title, Body, Blockquote... (Component) |

---

### Headless + UI Hybrid (3-Tier)

| 컴포넌트 | Intent 개수 | 설명 |
|---------|-----------|------|
| **Menu** | 1개 | Interaction (Trigger, Content, Item) |
| **Dialog** | 2개 | Interaction (Trigger, Close), Layout (Content, Header, Body, Footer) |
| **Tabs** | 1개 | Interaction (List, Trigger, Panel) |
| **Select** | 1개 | Interaction (Trigger, Options, Option, Search) |
| **Carousel** | 2개 | State, Interaction |
| **Accordion** | 1개 | Interaction (Trigger, Content) |
| **Popover** | 1개 | Interaction (Trigger, Content) |
| **Tooltip** | 1개 | Interaction (Trigger, Content) |

---

## 📊 부록: 설계 의사결정 가이드

### 새 컴포넌트 설계 시 체크리스트

```
[ ] 1. 컴포넌트 이름과 목적 정의
[ ] 2. UI를 렌더링하는가?
    [ ] NO → Pure Headless → 6단계로
    [ ] YES → 3단계로

[ ] 3. Headless 로직이 있는가? (상태, 키보드, 포커스 등)
    [ ] NO → Pure UI → 4단계로
    [ ] YES → Headless + UI Hybrid → 6단계로

[ ] 4. (Pure UI) 컴포넌트 간 협력하는가?
    [ ] NO → 2-Tier 확정 ✅
    [ ] YES → 5단계로

[ ] 5. (Pure UI) 구조 협력인가? (Layout, Navigation 등)
    [ ] YES → 혼합형 (일부 3-Tier) ✅
    [ ] NO → 다시 검토

[ ] 6. (Headless) Intent 도출
    [ ] 사용자 질문 나열 (5-7개)
    [ ] Intent 매핑 (질문 → Intent)
    [ ] Intent 간 협력 관계 확인
    [ ] 3-Tier 구조 확정 ✅

[ ] 7. API 설계
    [ ] Level 1 (Simple) 설계
    [ ] Level 2 (Structured) 설계
    [ ] Level 3 (Explicit) 설계

[ ] 8. 구현 및 문서화
```

---

**문서 작성 완료**
**MDK 3-Tier 철학 최종 확립**
