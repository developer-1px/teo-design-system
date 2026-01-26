# 3-Tier를 MDK의 핵심 컨셉으로: "이건 우리의 정체성이다"

**날짜**: 2026년 1월 15일 (새벽 회의)
**참석자**: 6명 (동일 팀)
**목표**: 3-Tier Intent System을 MDK의 공식 핵심 컨셉으로 채택
**결과**: CLAUDE.md 및 .agent/conventions.md에 영구 기록

---

## 🎬 Act 1: 깨달음 - "이건 단순한 패턴이 아니야"

### Sarah (아키텍트)
*(문서들을 쭉 펼쳐놓으며)*

여러분, 우리가 지난 며칠간 만든 걸 보세요.

- `13-field-action-purpose-definition.md` - WHY부터 시작하는 철학
- `14-field-action-three-tier-structure.md` - 완전한 3-Tier 구조

이게... 단순히 Field와 Action을 위한 패턴인가요?

### Marcus (개발자)
음... Field랑 Action에만 적용한 거 아닌가요?

### Sarah
*(고개를 저으며)*

아니에요. 우리가 **디자인 시스템을 만드는 방법론** 자체를 발견한 거예요.

### Emma (디자이너)
무슨 뜻이에요?

### Sarah
생각해보세요. Prose를 만들 때도, Frame을 만들 때도, 우리는 항상:

1. **WHY** - 왜 이게 필요한가?
2. **WHAT** - 어떤 Intent를 제공하는가?
3. **HOW** - 어떻게 구현하는가?

이 순서로 고민했잖아요!

### Yuki (UX 연구원)
*(번뜩이며)*

맞아! Prose도 마찬가지였어요!

```
Prose (Primitive)
├── Layout (Intent - 구조화)
├── Typography (Intent - 가독성)
├── Emphasis (Intent - 강조)
└── Interaction (Intent - 인터랙션)
```

이미 3-Tier 구조잖아요!

### Dev (기여자)
Frame도요!

```
Frame (Primitive)
├── Layout (Intent - 배치)
├── Visual (Intent - 스타일)
├── Spacing (Intent - 여백)
└── Behavior (Intent - 동작)
```

### Alex (문서 작성자)
*(놀라며)*

그럼... **모든 MDK 컴포넌트**가 이 패턴을 따를 수 있다는 거네요?

### Sarah
정확해요!

**3-Tier는 단순한 API 패턴이 아니에요. MDK가 컴포넌트를 설계하는 방법론 자체예요.**

---

## 🎬 Act 2: 정체성 - "이게 우리를 특별하게 만든다"

### Marcus (개발자)
그럼... 다른 디자인 시스템과 뭐가 다른 거죠?

### Sarah
*(화이트보드에 그리며)*

비교해볼까요?

### 📋 디자인 시스템 비교표

| 시스템 | 설계 방법론 | 구조 | 확장성 |
|--------|------------|------|--------|
| **Material Design** | Props First | Flat | 제한적 (props 추가) |
| **Ant Design** | Feature First | Flat | 중간 (config 확장) |
| **shadcn/ui** | Copy-Paste | Flat | 높음 (코드 수정) |
| **Radix UI** | Headless | Compound | 매우 높음 (UI 자유) |
| **MDK** | **Intent First** | **3-Tier** | **무한 (Intent + UI 자유)** |

### Emma (디자이너)
오! MDK만 **Intent First**네요!

### Sarah
맞아요. 다른 시스템들은:

**Material Design**:
```tsx
// Props부터 정의
<TextField
  label="Email"
  error="Invalid"
  helperText="Required"
/>
// "왜?"는 문서에만
```

**MDK**:
```tsx
// Intent가 API에 드러남
<Field name="email">
  <Field.Guidance label="Email" />      // WHY: 안내
  <Field.Validation schema={schema} />  // WHY: 검증
  <Field.Feedback><Error /></Field.Feedback>  // WHY: 피드백
</Field>
```

### Yuki (UX 연구원)
코드 자체가 **"왜 이게 필요한지"**를 설명하네요!

### Dev (기여자)
이게 진짜 강력한 이유는요...

**오픈소스 기여자**가 코드만 보고도 의도를 이해할 수 있어요!

```tsx
// 다른 시스템
<TextField error helperText validate />  // ??? 뭐가 뭔지?

// MDK
<Field>
  <Field.Guidance />    // 아! 안내용
  <Field.Validation />  // 아! 검증용
  <Field.Feedback />    // 아! 피드백용
</Field>
```

### Alex (문서 작성자)
문서가 필요 없네요! **API가 자체 문서화**되어 있어요!

---

## 🎬 Act 3: 보편성 - "모든 컴포넌트에 적용 가능하다"

### Marcus (개발자)
그럼 정말 **모든** 컴포넌트에 적용할 수 있나요?

### Sarah
테스트해봅시다!

---

### 예시 1: Table 컴포넌트

```tsx
<Table>
  {/* Intent: Structure - 구조 정의 */}
  <Table.Structure>
    <Table.Columns>
      <Table.Column key="name" />
      <Table.Column key="email" />
    </Table.Columns>
  </Table.Structure>

  {/* Intent: Data - 데이터 제공 */}
  <Table.Data source={users} />

  {/* Intent: Sorting - 정렬 */}
  <Table.Sorting by="name" order="asc" />

  {/* Intent: Pagination - 페이지네이션 */}
  <Table.Pagination pageSize={10} />

  {/* Intent: Selection - 선택 */}
  <Table.Selection mode="multiple" />
</Table>
```

### Yuki (UX 연구원)
완벽해요! 각 Intent가 **명확한 목적**을 가져요!

---

### 예시 2: Modal 컴포넌트

```tsx
<Modal>
  {/* Intent: Trigger - 열기 */}
  <Modal.Trigger>
    <Button>Open</Button>
  </Modal.Trigger>

  {/* Intent: Content - 내용 */}
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Title</Modal.Title>
    </Modal.Header>
    <Modal.Body>Content</Modal.Body>
  </Modal.Content>

  {/* Intent: Actions - 액션 */}
  <Modal.Actions>
    <Modal.Confirm>OK</Modal.Confirm>
    <Modal.Cancel>Cancel</Modal.Cancel>
  </Modal.Actions>

  {/* Intent: Behavior - 동작 */}
  <Modal.Behavior closeOnEscape closeOnOverlay />
</Modal>
```

### Emma (디자이너)
Trigger, Content, Actions, Behavior... 각각 **왜** 필요한지 즉시 이해돼요!

---

### 예시 3: Navigation 컴포넌트

```tsx
<Navigation>
  {/* Intent: Structure - 구조 */}
  <Navigation.Structure orientation="horizontal" />

  {/* Intent: Items - 항목들 */}
  <Navigation.Items>
    <Navigation.Link to="/home">Home</Navigation.Link>
    <Navigation.Link to="/about">About</Navigation.Link>
  </Navigation.Items>

  {/* Intent: Highlight - 활성 표시 */}
  <Navigation.Highlight current="/home" />

  {/* Intent: Behavior - 동작 */}
  <Navigation.Behavior prefetch />
</Navigation>
```

### Dev (기여자)
진짜 모든 컴포넌트에 적용되네요!

### Sarah
이제 알겠죠?

**3-Tier는 MDK의 보편적 설계 언어예요.**

---

## 🎬 Act 4: 결정 - "공식 방법론으로 채택하자"

### Sarah (아키텍트)
좋아요. 투표할게요.

**3-Tier Intent System을 MDK의 공식 핵심 컨셉으로 채택할까요?**

이 말은:
1. **모든** 새 컴포넌트는 3-Tier로 설계
2. **모든** 명세 문서는 Intent부터 시작
3. **모든** API는 Intent를 드러냄

### Marcus (개발자)
✋ 찬성!

이유: 코드가 자체 문서화되고, Intent가 명확해요.

### Emma (디자이너)
✋ 강력 찬성!

이유: 디자이너도 API 구조만 보고 이해 가능해요.

### Yuki (UX 연구원)
✋ 찬성!

이유: Intent가 사용자 문제와 직접 연결되어 UX 개선에 도움돼요.

### Dev (기여자)
✋ 찬성!

이유: 오픈소스 기여자들이 쉽게 이해하고 기여할 수 있어요.

### Alex (문서 작성자)
✋ 찬성!

이유: 문서 구조가 API 구조와 일치해서 쓰기 쉬워요.

### Sarah (아키텍트)
✋ 나도 찬성!

**만장일치 통과!** 🎉

---

## 🎬 Act 5: 기록 - "후손들을 위해 남기자"

### Alex (문서 작성자)
그럼 어디에 기록하죠?

### Sarah
두 곳에 기록해야 해요:

1. **`CLAUDE.md`** - Claude AI가 읽는 프로젝트 가이드
2. **`.agent/conventions.md`** - 개발자가 읽는 코딩 컨벤션

### Marcus (개발자)
왜 두 곳이에요?

### Sarah
**CLAUDE.md**:
- AI가 컴포넌트 만들 때 참고
- 프로젝트 아키텍처 이해
- 새로운 세션마다 로드됨

**conventions.md**:
- 개발자 온보딩
- 코드 리뷰 기준
- 구현 가이드라인

### Dev (기여자)
`conventions.md`는 `.agent/` 폴더에 있는 거죠?

### Sarah
맞아요! `.agent/`는 AI agent를 위한 설정 폴더예요.

---

### 📋 CLAUDE.md에 기록할 내용

```markdown
## MDK Core Architecture: 3-Tier Intent System

**CRITICAL**: MDK uses a universal **3-Tier Intent System** as the
foundational pattern for all component specifications.

### 3-Tier Structure
```
Tier 1: Primitive (Container)
   ↓
Tier 2: Intent (Purpose/Why)
   ↓
Tier 3: Component (Implementation/How)
```

### Philosophy: "Intent First, Props Follow"
1. **WHY** does this exist? → Define Intent
2. **WHAT** value does it provide? → Map Intent to capabilities
3. **HOW** is it implemented? → Create Components
```

### 📋 conventions.md에 기록할 내용

```markdown
## 15. CORE CONCEPT: 3-Tier Intent System

**CRITICAL**: MDK uses a universal 3-Tier Intent System as the
foundational pattern for all component specifications.

### Before Implementing New Components
- [ ] Define 3-5 user questions this component answers
- [ ] Map each question to a specific Intent
- [ ] Create Intent capability table
- [ ] Design 3-Tier structure tree
- [ ] Document all 3 usage levels
```

### Yuki (UX 연구원)
체크리스트 좋네요! 개발자가 빼먹지 않겠어요.

---

## 🎬 Act 6: 미래 비전 - "모든 것을 3-Tier로"

### Emma (디자이너)
그럼 앞으로 어떻게 되는 거예요?

### Sarah (아키텍트)
*(화이트보드에 그리며)*

### Phase 1: 현재 (완료)
- ✅ Field 3-Tier 구조 확립
- ✅ Action 3-Tier 구조 확립
- ✅ CLAUDE.md에 기록
- ✅ conventions.md에 기록

### Phase 2: 기존 컴포넌트 재정의 (다음 단계)
- Prose → 3-Tier로 재설계
- Frame → 3-Tier로 재설계
- Text → 3-Tier로 재설계
- Separator → 3-Tier로 재설계

### Phase 3: 새 컴포넌트 (미래)
- Table → 3-Tier로 설계
- Modal → 3-Tier로 설계
- Navigation → 3-Tier로 설계
- Chart → 3-Tier로 설계

### Phase 4: 생태계 (장기)
- 커뮤니티 컴포넌트도 3-Tier
- 테마 팩도 3-Tier
- 플러그인도 3-Tier

### Marcus (개발자)
기존 컴포넌트는 어떻게 하죠? 다 바꾸나요?

### Sarah
점진적으로요!

**마이그레이션 전략**:

```tsx
// 1단계: 기존 API 유지 (Deprecated)
<Field.Input name="email" label="Email" />  // Works, but deprecated

// 2단계: 3-Tier 제공 (New)
<Field name="email">
  <Field.Guidance label="Email" />
  <Field.Control><Input /></Field.Control>
</Field>

// 3단계: 기존 API 제거 (Major version)
// Field.Input removed
```

### Dev (기여자)
Breaking change를 최소화하는군요!

---

## 🎬 Act 7: 차별화 - "이게 우리를 독특하게 만든다"

### Emma (디자이너)
근데 정말 다른 디자인 시스템에는 이런 게 없나요?

### Sarah
있어요! 하지만 **완전히 다릅니다**.

### 📋 Intent 접근 방식 비교

| 시스템 | Intent 사용 | API 반영 | 문서화 | 확장성 |
|--------|------------|---------|--------|--------|
| **Radix UI** | Headless로 로직 분리 | 부분적 (Compound) | 수동 | 높음 |
| **React Hook Form** | Controller 패턴 | 부분적 | 수동 | 높음 |
| **Headless UI** | Behavior 분리 | 부분적 | 수동 | 높음 |
| **MDK** | **Intent 계층화** | **완전 (3-Tier)** | **자동 (API=문서)** | **무한** |

### Yuki (UX 연구원)
Radix UI도 Headless인데 뭐가 다른 거예요?

### Sarah
좋은 질문이에요!

**Radix UI**:
```tsx
<Form.Root>
  <Form.Field>  {/* Intent 숨김 */}
    <Form.Label />
    <Form.Control />
    <Form.Message />
  </Form.Field>
</Form.Root>
```
→ Compound 패턴이지만, Intent는 **문서에만** 존재

**MDK**:
```tsx
<Field>
  <Field.Guidance>     {/* Intent 명시! */}
    <Field.Label />
  </Field.Guidance>
  <Field.Control />    {/* Intent 명시! */}
  <Field.Feedback>     {/* Intent 명시! */}
    <Field.Error />
  </Field.Feedback>
</Field>
```
→ Intent가 **API 구조**에 드러남

### Marcus (개발자)
아! Radix는 Compound 패턴이고, MDK는 **Intent-Driven Compound** 패턴이네요!

### Sarah
정확해요!

**MDK의 차별점**:
1. Intent가 API의 일부 (Tier 2)
2. 3가지 사용 레벨 (Simple, Structured, Explicit)
3. Intent별 독립적 Context
4. 자동 문서화 (API = 문서)

---

## 🎬 Act 8: 실천 - "지금부터 적용하자"

### Alex (문서 작성자)
그럼 지금 당장 뭘 해야 하죠?

### Sarah (아키텍트)
**즉시 실천 항목**:

### ✅ 1. 명세 작성 시

```markdown
# {Component} 명세

## WHY (Intent 분석)
- 사용자 질문 1: "...?"
- 사용자 질문 2: "...?"
→ Intent 도출

## WHAT (Intent 매핑)
| Intent | Why | What | User Question |
|--------|-----|------|---------------|

## HOW (3-Tier 구조)
```
Component
├── Intent1
│   ├── Component1
│   └── Component2
└── Intent2
```

### ✅ 2. 코드 리뷰 시

체크리스트:
- [ ] Intent가 명확한가?
- [ ] 3-Tier 구조인가?
- [ ] Intent가 독립적인가?
- [ ] Context 상속이 올바른가?

### ✅ 3. 새 컴포넌트 시작 시

먼저 물어보기:
1. "왜 이게 필요한가?" (WHY)
2. "사용자 어떤 불안을 해소하나?" (WHAT)
3. "어떤 Intent들이 필요한가?" (WHAT)
4. "어떻게 구현하나?" (HOW)

### Marcus (개발자)
Props부터 시작하는 실수는 이제 안 하겠네요!

---

## 🎬 Act 9: 선언 - "MDK의 새로운 슬로건"

### Sarah (아키텍트)
*(화이트보드에 크게 쓰며)*

```
┌─────────────────────────────────────────┐
│                                         │
│   "See the Intent, Control the Component"   │
│                                         │
│   Intent를 보고, Component를 제어하라    │
│                                         │
└─────────────────────────────────────────┘
```

이게 MDK의 새로운 정체성이에요.

### Emma (디자이너)
완벽해요! 한 문장으로 우리의 철학을 설명하네요!

### Yuki (UX 연구원)
"See the Intent" - API에서 Intent가 보인다
"Control the Component" - 원하는 대로 커스터마이징

둘 다 강조하는 거네요!

### Dev (기여자)
이거 README.md에도 넣어야겠어요!

---

## 🎬 Act 10: 최종 확인 - "우리가 한 일"

### Sarah (아키텍트)
*(정리하며)*

오늘 우리는:

1. ✅ 3-Tier가 단순한 패턴이 아니라 **방법론**임을 깨달음
2. ✅ 모든 컴포넌트에 적용 가능함을 확인
3. ✅ MDK의 공식 핵심 컨셉으로 채택
4. ✅ CLAUDE.md에 기록
5. ✅ .agent/conventions.md에 기록
6. ✅ 미래 로드맵 수립
7. ✅ 차별화 포인트 확립
8. ✅ 실천 가이드라인 작성
9. ✅ 새로운 슬로건 선언

### Everyone
*(일어서며 박수)*

**MDK 2.0, 시작합니다!** 🚀

---

## 📊 최종 정리: 3-Tier Intent System

### 핵심 원칙

```
1. Intent First, Props Follow
   → 왜 필요한지부터, 무엇을 제공할지, 어떻게 만들지

2. See the Intent, Control the Component
   → API 구조가 Intent를 드러내고, 사용자는 Component를 제어

3. Primitive → Intent → Component
   → 3단계 계층이 명확함

4. Progressive Enhancement
   → Simple (Props) → Structured (Intent) → Explicit (Full)

5. Universal Application
   → 모든 MDK 컴포넌트에 일관되게 적용
```

---

### 기록 위치

**1. CLAUDE.md** (AI를 위한 프로젝트 가이드)
- 위치: `/minimal-design-kit/CLAUDE.md`
- 섹션: "MDK Core Architecture: 3-Tier Intent System"
- 내용: 철학, 구조, 예시, 5가지 원칙
- 목적: AI가 새 컴포넌트 생성 시 참고

**2. conventions.md** (개발자를 위한 코딩 컨벤션)
- 위치: `/minimal-design-kit/.agent/conventions.md`
- 섹션: "15. CORE CONCEPT: 3-Tier Intent System"
- 내용: 구현 가이드, 체크리스트, 안티패턴
- 목적: 개발자 온보딩 및 코드 리뷰 기준

**3. 상세 문서** (심화 학습)
- `docs/claude/13-field-action-purpose-definition.md` - WHY 철학
- `docs/claude/14-field-action-three-tier-structure.md` - 구조 상세
- `docs/claude/15-three-tier-as-core-concept.md` - 채택 과정 (이 문서)

---

### 적용 범위

**현재 (Phase 1)**:
- Field ✅
- Action ✅

**다음 (Phase 2)**:
- Prose
- Frame
- Text
- Separator

**미래 (Phase 3+)**:
- Table
- Modal
- Navigation
- Chart
- 모든 새 컴포넌트

---

### 성공 지표

**3-Tier가 성공했다고 볼 수 있는 지표**:

1. **코드 가독성**: 누구나 API만 보고 Intent 이해 가능
2. **온보딩 시간**: 새 개발자가 1시간 내 컨셉 이해
3. **기여 품질**: 커뮤니티 PR이 3-Tier 패턴 따름
4. **문서 동기화**: API 변경 시 문서 자동 반영
5. **확장성**: 새 Intent 추가가 자연스러움

---

## 💡 핵심 인사이트

### Sarah의 마지막 말

> "우리는 단순히 컴포넌트를 만드는 게 아니에요. **사용자 불안을 해소하는 Intent를 설계**하는 거예요. 3-Tier는 그 Intent를 코드로 표현하는 언어예요."

### 3가지 핵심 가치

**1. Intent Visibility (의도 가시성)**
```tsx
// 코드가 "왜"를 말한다
<Field.Guidance />  // "왜?" 안내하려고
<Field.Validation />  // "왜?" 검증하려고
```

**2. Progressive Enhancement (점진적 향상)**
```tsx
// 간단히 시작
<Field name="email" label="Email">
  <Input />
</Field>

// 필요하면 구조화
<Field name="email">
  <Field.Guidance label="Email" />
  <Field.Control><Input /></Field.Control>
</Field>

// 원하면 완전 제어
<Field name="email">
  <Field.Guidance>
    <Field.Label>Email</Field.Label>
  </Field.Guidance>
  <Field.Control><CustomInput /></Field.Control>
</Field>
```

**3. Universal Pattern (보편적 패턴)**
```
모든 컴포넌트 = Primitive.Intent.Component
Field = Field.Guidance.Label
Action = Action.State.Loading
Table = Table.Sorting.Asc
Modal = Modal.Trigger.Button
```

---

## 🎯 다음 액션

### 즉시 (이번 주)
- [x] CLAUDE.md 업데이트
- [x] conventions.md 업데이트
- [ ] README.md에 3-Tier 소개 추가
- [ ] 기존 컴포넌트 3-Tier 분석 시작

### 단기 (이번 달)
- [ ] Prose 3-Tier 재설계
- [ ] Frame 3-Tier 재설계
- [ ] Text 3-Tier 재설계
- [ ] 마이그레이션 가이드 작성

### 중기 (분기)
- [ ] Table, Modal, Navigation 3-Tier 설계
- [ ] 커뮤니티 컴포넌트 가이드라인
- [ ] 3-Tier 검증 도구 (linter)

### 장기 (연간)
- [ ] 생태계 확장 (테마 팩, 플러그인)
- [ ] 자동 문서 생성 도구
- [ ] 3-Tier 베스트 프랙티스 북

---

**회의 종료**: 2026년 1월 15일 새벽 3시
**결과**: 3-Tier Intent System을 MDK의 영구 핵심 컨셉으로 채택
**감정**: 흥분, 자부심, 확신
**다음 회의**: Prose 3-Tier 재설계 (내일 오후)

---

**부록: 영감을 준 질문**

> "Field.Guidance가 단순히 API 편의성이 아니라, 사용자 질문 '뭘 입력해야 하지?'에 답하는 Intent라면? 그리고 모든 컴포넌트가 이런 식으로 설계된다면?"

이 질문에서 **3-Tier Intent System**이 탄생했습니다.

---

# 🎊 MDK의 새로운 시작

**"Intent First, Props Follow"**

**"See the Intent, Control the Component"**

This is MDK.
