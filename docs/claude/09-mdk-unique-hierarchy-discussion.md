# MDK 고유 개념 위계 정립 회의록

**날짜**: 2026년 1월 14일
**참석자**: 6명
**목적**: MDK만의 독특한 컴포넌트 계층 구조 확정
**형식**: 원탁 토론

---

## 👥 참석자

- **Sarah Chen** (디자인 시스템 아키텍트) - 전체 구조 설계 담당
- **Marcus Kim** (시니어 프론트엔드 개발자) - 실제 구현 및 사용성 관점
- **Yuki Tanaka** (UX 연구원) - 사용자 행동 및 멘탈 모델 분석
- **Alex Rivera** (기술 문서 작성자) - 명명 및 설명 명확성
- **Emma Wu** (제품 디자이너) - Figma, Sketch 등 디자인 도구 관점
- **Dev Kumar** (오픈소스 기여자) - 커뮤니티 및 생태계 관점

---

## 🎬 Act 1: 문제 제기 - "Form은 어디에 속하는가?"

### Sarah (아키텍트)
좋습니다, 시작하죠. 우리가 지난 회의에서 7개 카테고리를 확정했습니다:
```
Frame, Field, Data, Feedback, Overlay, Navigation, Prose
```

그런데 문제가 있어요. **Form**을 어디에 둘지 결정하지 못했습니다. Form을 최상위 카테고리로 할까요, 아니면 Field로 이름을 바꿀까요?

### Marcus (개발자)
잠깐만요, Sarah. 저는 지난번에 Field를 쓰자고 했는데, 실제로 코드를 짜다 보니 헷갈리더라고요.

```tsx
// 이게 맞나요?
<Field.Input />
<Field.Select />
<Field.Checkbox />

// 아니면 이게 맞나요?
<Form.Input />
<Form.Select />
<Form.Checkbox />
```

로그인 폼을 만들 때 "Form 컴포넌트"를 찾는 게 자연스럽지 않나요?

### Yuki (UX 연구원)
Marcus, 그 관점도 이해하지만 사용자 멘탈 모델을 봐야 해요. 제가 인터뷰한 디자이너들은 이렇게 말했어요:

> "이메일 **필드**를 추가했어요"
> "비밀번호 **필드**를 입력하세요"

"필드"는 개별 입력 단위를 의미합니다. 반면 "폼"은:

> "로그인 **폼**을 작성하세요"

전체 양식을 의미하죠. 우리가 제공하는 건 개별 UI 프리미티브 아닌가요?

### Emma (디자이너)
Yuki 말이 맞아요. Figma에서도 우리는 "Text Field", "Select Field"라고 부르지, "Form Input"이라고 안 해요. 하지만 Marcus 고민도 이해가 가요. 개발자들은 "form component"를 찾을 테니까요.

### Dev (기여자)
제 생각엔 둘 다 필요한 것 같은데요? 리서치해보니까:
- **shadcn/ui**: "Forms & Input" (병행 표기)
- **Material Design**: "Text inputs" (입력 단위)
- **React Hook Form**: `useForm()` (양식 전체)

"Form"과 "Field"는 다른 추상화 레벨인 거죠.

### Alex (문서 작성자)
Dev 말이 핵심이에요. 제가 문서를 쓸 때 느낀 건, **Form은 패턴이고, Field는 프리미티브**라는 거예요.

예를 들어:
```
Primitive (프리미티브):
- Field.Input
- Field.Select
- Action.Button

Pattern (패턴):
- Form = Field.Input + Field.Select + Action.Button + Layout + Validation
```

Form은 여러 프리미티브의 **조합**이에요!

---

## 🎬 Act 2: Action의 발견 - "버튼은 Field인가?"

### Sarah (아키텍트)
Alex, 좋은 지적이에요. 그런데 방금 당신이 `Action.Button`이라고 했는데, Action이 뭔가요? 우리 7개 카테고리에 Action 없었잖아요.

### Marcus (개발자)
아, 맞다! 우리 Action 카테고리를 없앴죠. 왜냐면 "Action은 각 Context에 속한다"고 했으니까. 그런데 Alex 말을 들으니까... 버튼을 Field에 넣을 순 없잖아요?

```tsx
// 이건 이상해요
<Field.Button>Submit</Field.Button>
<Field.Input type="email" />
```

버튼은 "입력 필드"가 아니에요!

### Yuki (UX 연구원)
정확해요! 사용자 행동을 분석해보면:
- **Field**: 사용자가 **데이터를 입력**하는 곳 (Input, Select, Checkbox)
- **Action**: 사용자가 **행동을 트리거**하는 곳 (Button, Link)

전혀 다른 인터랙션이에요!

### Emma (디자이너)
그런데 Toggle은요? Switch는요? 이건 입력인가요, 행동인가요?

```tsx
<Toggle checked={darkMode} onChange={setDarkMode} />
```

값을 저장하니까 Field 같기도 하고, 클릭 한 번으로 즉시 반영되니까 Action 같기도 하고...

### Dev (기여자)
좋은 질문이에요! 제가 다른 라이브러리들 봤는데:
- **shadcn/ui**: Switch를 "Forms & Input"에 포함
- **Material Design**: Switch를 "Selection"에 포함 (Checkbox와 함께)
- **Ant Design**: Switch를 "Data Entry"에 포함

대부분 **입력 도구**로 분류하네요.

### Alex (문서 작성자)
구분 기준을 제안할게요:

**Field (입력)**:
- 값(value)을 저장
- 폼 데이터의 일부
- 예: Input, Select, Checkbox, Radio, **Switch**, **Slider**

**Action (행동/반응)**:
- 이벤트를 트리거
- 즉각적인 반응
- 폼 데이터 아님
- 예: Button, IconButton, Link, FAB

### Marcus (개발자)
그럼 Submit 버튼은요?

```tsx
<button type="submit">Login</button>
```

이건 폼과 관련 있잖아요? Field.Submit으로 해야 하나요?

### Sarah (아키텍트)
아니요, Marcus. Submit 버튼은 **행동**이에요. "폼을 제출한다"는 행동을 트리거하죠. 값을 저장하지 않아요. 그러니까 `Action.Submit`이 맞습니다.

### Yuki (UX 연구원)
동의해요. 사용자 관점에서:
- Checkbox 체크 = **입력** (선택 사항 저장)
- Submit 클릭 = **행동** (제출 실행)

---

## 🎬 Act 3: Block 개념의 탄생

### Alex (문서 작성자)
좋아요, 그럼 정리하면:
- Field: 입력 프리미티브
- Action: 행동 프리미티브

그런데 Form은? Form은 둘의 **조합**이잖아요. 어디에 둘 건가요?

### Dev (기여자)
제 생각엔 새로운 카테고리가 필요할 것 같아요. **Pattern** 카테고리요.

```
Primitives (프리미티브):
- Frame, Field, Action, Data, Feedback, Overlay, Navigation, Prose

Patterns (패턴):
- Form (Field + Action + Layout 조합)
- Card (Data + Action 조합)
- Panel (Frame + Data 조합)
```

### Emma (디자이너)
Dev, 근데 "Pattern"이라는 이름은 좀 추상적이에요. Figma에서 우리는 "Component", "Block", "Module"이라고 부르거든요.

**Block**은 어때요? "Form Block", "Card Block" 이런 식으로.

### Sarah (아키텍트)
Block... 좋네요! 다른 시스템을 봐도:
- **Notion**: Block 기반 에디터
- **WordPress**: Block Editor (Gutenberg)
- **Framer**: Building Blocks

"Block"은 **조립 가능한 단위**를 의미해요. 완벽하네요!

### Marcus (개발자)
그럼 이렇게 되는 건가요?

```tsx
// Primitives (프리미티브)
<Field.Input />
<Action.Button />

// Block (패턴 = 프리미티브 조합)
<Block.Form>
  <Field.Input name="email" />
  <Action.Submit>Login</Action.Submit>
</Block.Form>
```

### Yuki (UX 연구원)
완벽해요! 사용자 입장에서도 명확해요:
1. **개별 부품이 필요해?** → Field, Action (프리미티브)
2. **미리 만들어진 패턴이 필요해?** → Block (조합)

---

## 🎬 Act 4: 경계선 케이스 토론

### Emma (디자이너)
좋아요, 그런데 애매한 케이스들을 정리해야 할 것 같아요.

**Case 1: Card**
Card는 Block인가요, Frame인가요?

```tsx
// Option A: Frame (레이아웃 도구)
<Frame layout="card">
  <Text>Content</Text>
</Frame>

// Option B: Block (패턴)
<Block.Card>
  <Text>Content</Text>
</Block.Card>
```

### Marcus (개발자)
Card는 단순 컨테이너면 Frame이고, 헤더/바디/푸터 같은 구조가 있으면 Block 아닐까요?

```tsx
// Simple Card = Frame
<Frame surface="raised" rounded="lg" p={4}>
  <Text>Simple content</Text>
</Frame>

// Pattern Card = Block
<Block.Card>
  <Block.Card.Header>
    <Text.Card.Title>Title</Text.Card.Title>
  </Block.Card.Header>
  <Block.Card.Body>
    <Text.Card.Desc>Description</Text.Card.Desc>
  </Block.Card.Body>
  <Block.Card.Actions>
    <Action.Button>Click</Action.Button>
  </Block.Card.Actions>
</Block.Card>
```

### Alex (문서 작성자)
Marcus 구분이 정확해요. 기준을 만들어볼게요:

**Frame (프리미티브)**:
- 단순 컨테이너
- 자유로운 내용
- 예: `<Frame surface="card">`

**Block (패턴)**:
- 정해진 구조
- 슬롯 기반 (Header, Body, Footer)
- 예: `<Block.Card>`

### Sarah (아키텍트)
좋아요. 다음 케이스!

**Case 2: DatePicker**
DatePicker는 Field인가요, Block인가요?

```tsx
// DatePicker는 Calendar + Input 조합이에요
<DatePicker />
```

### Yuki (UX 연구원)
사용자 관점에서 보면 DatePicker는 **입력 도구**예요. 날짜 값을 선택하죠. 그러니까 Field.DatePicker가 맞아요.

내부적으로 복잡하더라도, 사용자에게는 "날짜 입력 필드"로 보여요.

### Dev (기여자)
동의해요. 다른 라이브러리들도:
- **Material Design**: Date Picker를 "Selection"에 포함
- **shadcn/ui**: Date Picker를 "Forms & Input"에 포함

DatePicker = Field.DatePicker ✅

### Emma (디자이너)
**Case 3: SearchBar**
SearchBar는 Field? Block? Navigation?

```tsx
// SearchBar = Input + Button + 자동완성 리스트
<SearchBar />
```

### Marcus (개발자)
이건 명확히 **Block**이에요! 왜냐면:

```tsx
<Block.SearchBar>
  <Field.Input />  {/* 검색어 입력 */}
  <Action.Button>  {/* 검색 실행 */}
  <Overlay.Dropdown>  {/* 자동완성 */}
    <Data.List />
  </Overlay.Dropdown>
</Block.SearchBar>
```

여러 프리미티브의 조합이죠!

### Alex (문서 작성자)
정리하면:
- **단일 입력 도구** → Field
- **복잡한 조합** → Block

---

## 🎬 Act 5: 최종 합의 - MDK 고유 위계

### Sarah (아키텍트)
좋아요, 이제 최종 구조를 확정하죠.

## 📐 MDK 컴포넌트 계층 구조 (최종안)

### Tier 1: Primitives (프리미티브)
개별 UI 단위, 조합 가능한 빌딩 블록

```
1. Frame       - 레이아웃 프리미티브 (Layout.* 프리셋 포함)
2. Field       - 입력 프리미티브 (값 저장)
3. Action      - 행동 프리미티브 (이벤트 트리거)
4. Data        - 데이터 표시 프리미티브
5. Feedback    - 피드백 프리미티브
6. Overlay     - 플로팅 UI 프리미티브
7. Navigation  - 탐색 프리미티브
8. Prose       - 콘텐츠 프리미티브
```

### Tier 2: Blocks (패턴)
프리미티브의 조합, 미리 만들어진 패턴

```
Block
├── Form        (Field + Action + Layout)
├── Card        (Data + Action + Frame)
├── SearchBar   (Field + Action + Overlay)
├── Panel       (Frame + Data + Action)
├── Toolbar     (Action + Navigation)
└── Header      (Navigation + Action)
```

### Marcus (개발자)
그럼 실제 코드는 이렇게 되는 거죠?

```tsx
// ✅ Primitives (자유롭게 조합)
<Frame layout="stack" gap={4}>
  <Field.Input name="email" />
  <Field.Input name="password" type="password" />
  <Action.Submit>Login</Action.Submit>
</Frame>

// ✅ Block (미리 정의된 패턴)
<Block.LoginForm
  onSubmit={handleLogin}
  fields={['email', 'password']}
/>
```

### Emma (디자이너)
완벽해요! Figma에서도 이렇게 나눌 수 있어요:
- **Primitives Tab**: 개별 컴포넌트 (Field, Action, Frame)
- **Blocks Tab**: 패턴 라이브러리 (Form, Card, SearchBar)

### Yuki (UX 연구원)
사용자 학습 곡선도 명확해요:

**초급 사용자**: Block 사용 (빠른 프로토타입)
```tsx
<Block.ContactForm />
```

**중급 사용자**: Primitive 조합 (커스텀)
```tsx
<Frame>
  <Field.Input />
  <Action.Button />
</Frame>
```

**고급 사용자**: 새로운 Block 생성
```tsx
function MyCustomBlock() {
  return <Frame>...</Frame>
}
```

### Dev (기여자)
커뮤니티도 쉽게 기여할 수 있어요:

```
공식 MDK:
- Primitives (안정적, 변경 적음)

커뮤니티:
- Blocks (계속 추가 가능)
- mdk-blocks-commerce (이커머스 패턴)
- mdk-blocks-dashboard (대시보드 패턴)
```

### Alex (문서 작성자)
문서 구조도 명확해요:

```
MDK Documentation
├── Getting Started
│   └── Understanding Primitives vs Blocks
│
├── Primitives (프리미티브)
│   ├── Frame
│   ├── Field
│   ├── Action
│   ├── Data
│   ├── Feedback
│   ├── Overlay
│   ├── Navigation
│   └── Prose
│
└── Blocks (패턴)
    ├── Form
    ├── Card
    ├── SearchBar
    └── Panel
```

---

## 📊 최종 결정 사항

### 1. Field vs Action 구분 원칙

| 기준 | Field | Action |
|------|-------|--------|
| **목적** | 값 저장 (입력) | 이벤트 트리거 (행동) |
| **폼 데이터** | 포함됨 | 포함 안 됨 |
| **예시** | Input, Select, Checkbox, Radio, Switch, Slider, DatePicker | Button, IconButton, Link, FAB, MenuItem |
| **사용자 행동** | "선택하다", "입력하다", "체크하다" | "클릭하다", "제출하다", "취소하다" |

### 2. Primitive vs Block 구분 원칙

| 기준 | Primitive | Block |
|------|-----------|-------|
| **복잡도** | 단일 책임 | 다중 프리미티브 조합 |
| **커스터마이징** | 완전 자유 | 구조 정해짐 (슬롯 기반) |
| **학습 곡선** | 낮음 (단순) | 높음 (패턴 이해 필요) |
| **사용 시기** | 세밀한 제어 필요 | 빠른 프로토타입 |
| **예시** | Field.Input, Action.Button | Block.Form, Block.Card |

### 3. 애매한 케이스 결정

| 컴포넌트 | 분류 | 이유 |
|---------|------|------|
| **DatePicker** | Field.DatePicker | 날짜 "입력" 도구 (값 저장) |
| **SearchBar** | Block.SearchBar | Input + Button + Dropdown 조합 |
| **Simple Card** | Frame (surface="card") | 단순 컨테이너 |
| **Pattern Card** | Block.Card | Header/Body/Actions 구조 |
| **Toggle/Switch** | Field.Toggle, Field.Switch | Boolean 값 저장 (입력) |
| **Submit Button** | Action.Submit | 폼 제출 트리거 (행동) |
| **Slider** | Field.Slider | 숫자 값 입력 (값 저장) |

---

## 🎯 MDK 고유 철학

### Sarah (아키텍트) - 최종 발언
우리가 오늘 정립한 구조는 다른 디자인 시스템과 다릅니다:

**Material Design 3**: Flat 카테고리 (Actions, Communication, Containment...)
**shadcn/ui**: 혼합 카테고리 (Forms & Input, Data & Tables...)
**MDK**: **2-Tier 구조 (Primitives + Blocks)**

이게 MDK의 정체성입니다:
1. **명확한 추상화 레벨 구분** (프리미티브 vs 패턴)
2. **의미론적 정확성** (Field = 입력, Action = 행동)
3. **Frame 중심 레이아웃** (Layout은 Frame의 하위)
4. **확장 가능한 Block 생태계**

### Marcus (개발자) - 개발자 관점
코드도 깔끔해집니다:

```tsx
// ❌ 헷갈림 (기존 방식)
<Form.Input />        // Form? Input? 뭐가 메인?
<Button type="submit" />  // 폼과 분리된 버튼

// ✅ 명확함 (MDK 방식)
<Field.Input />       // 입력 필드
<Action.Submit />     // 제출 행동

// ✅ 패턴 사용
<Block.Form>
  <Field.Input />
  <Action.Submit />
</Block.Form>
```

### Emma (디자이너) - 디자인 관점
디자인 도구에서도 직관적입니다:

```
Component Library (Figma)
├── 📦 Primitives
│   ├── 🖼️ Frame
│   ├── ✍️ Field
│   ├── 🎯 Action
│   └── ...
│
└── 🧩 Blocks
    ├── 📝 Form Block
    ├── 🎴 Card Block
    └── ...
```

### Yuki (UX 연구원) - 사용자 관점
사용자 멘탈 모델과 일치합니다:
- "필드를 입력한다" ✅
- "버튼을 클릭한다" ✅
- "폼을 작성한다" ✅

### Alex (문서 작성자) - 문서화 관점
문서 작성이 쉬워집니다:

```markdown
# Field.Input
**Category**: Primitive / Field
**Purpose**: 사용자 입력을 받는 텍스트 필드
**Used in**: Block.Form, Block.SearchBar

# Block.Form
**Category**: Block (Pattern)
**Composition**: Field.* + Action.* + Frame
**Purpose**: 완전한 폼 패턴
```

### Dev (기여자) - 커뮤니티 관점
오픈소스 기여가 명확해집니다:

```
Contribution Guidelines:
- Primitives: Core team only (안정성 중요)
- Blocks: Community welcome! (패턴 확장)

예시:
- mdk-blocks-ecommerce
- mdk-blocks-admin
- mdk-blocks-landing
```

---

## ✅ Action Items

### 1. 문서 업데이트
- [ ] 07-prose-peer-categories-research.md 업데이트 (7개 → 8개 카테고리)
- [ ] 08-category-naming-debate.md 업데이트 (Field vs Form → Field vs Action 추가)
- [ ] CLAUDE.md 업데이트 (Block 개념 추가)

### 2. 코드 구조 반영
```
src/design-system/
├── primitives/
│   ├── frame/
│   ├── field/
│   ├── action/
│   ├── data/
│   ├── feedback/
│   ├── overlay/
│   ├── navigation/
│   └── prose/
│
└── blocks/
    ├── form/
    ├── card/
    ├── searchbar/
    └── panel/
```

### 3. 커뮤니티 공지
```markdown
# 🎉 Introducing MDK 2-Tier Architecture

We've established a unique component hierarchy:

**Tier 1: Primitives** (Core building blocks)
- Frame, Field, Action, Data, Feedback, Overlay, Navigation, Prose

**Tier 2: Blocks** (Pre-built patterns)
- Form, Card, SearchBar, Panel

Read more: [MDK Hierarchy Discussion](./09-mdk-unique-hierarchy-discussion.md)
```

---

## 📚 참고: 다른 시스템과의 비교

### Material Design 3 (Flat)
```
Actions, Communication, Containment, Navigation, Selection, Text inputs
```
→ 모두 동등한 레벨 (계층 없음)

### shadcn/ui (Hybrid)
```
Layout & Structure, Forms & Input, Feedback & Display, Data & Tables, Dialogs & Overlays
```
→ 기능 기반 그룹핑 (계층 불명확)

### MDK (2-Tier)
```
Tier 1: Primitives (8개 카테고리)
Tier 2: Blocks (패턴 조합)
```
→ **명확한 추상화 레벨 구분** ✅

---

## 🎤 회의 종료 발언

### Sarah (아키텍트)
훌륭한 토론이었습니다. 우리는 오늘:
1. Field와 Action을 명확히 구분했고
2. Block이라는 새로운 패턴 레이어를 만들었으며
3. MDK만의 고유한 2-Tier 구조를 확립했습니다

이제 우리는 다른 디자인 시스템과 다른 명확한 정체성을 가지게 됐어요.

### All
👏👏👏 (박수)

---

**회의 종료**: 2026년 1월 14일
**결정 사항**: MDK 2-Tier 아키텍처 확정
- **Tier 1**: 8개 Primitives (Frame, Field, Action, Data, Feedback, Overlay, Navigation, Prose)
- **Tier 2**: Blocks (Form, Card, SearchBar, Panel...)

**다음 회의**: Block 우선순위 및 구현 로드맵
