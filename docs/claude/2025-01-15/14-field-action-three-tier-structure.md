# Field & Action 3-Tier 구조: Intent 기반 계층화

**날짜**: 2026년 1월 14일 (심야 회의)
**참석자**: 6명 (동일 팀)
**목표**: Field.{Intent}.{Component} 3-Tier 구조 정립
**핵심**: Intent를 중간 계층으로 명시화

---

## 🎬 Act 1: 새로운 발견 - "Intent를 API에 노출하자"

### Emma (디자이너)
*(문서 읽다가 번뜩이며)*

잠깐! 우리가 Intent를 이렇게 명확히 정의했는데...

왜 API에는 안 보이죠?

```tsx
// 현재 API
<Field name="email" label="이메일" validate={schema}>
  <Input />
</Field>
```

여기서 `label`이 **Guidance Intent**라는 걸 어떻게 알아요?

### Sarah (아키텍트)
음... 문서에 적혀있죠?

### Emma
아니요! **API 자체가 Intent를 표현**해야 해요!

```tsx
// Intent가 보이는 API
<Field.Guidance name="email" label="이메일">
  <Field.Validation validate={schema}>
    <Input />
  </Field.Validation>
</Field.Guidance>
```

이렇게 하면 "아! Guidance는 label을 쓰는구나" 바로 보여요!

### Marcus (개발자)
오... 그런데 너무 복잡하지 않아요?

### Dev (기여자)
*(갑자기)*

잠깐! 3-Tier 구조면 어때요?

```
Field.{Intent}.{Component}
```

### Everyone
*(귀 기울이며)*

---

## 🎬 Act 2: 3-Tier 구조 제안

### Dev (기여자)
*(화이트보드에 그리며)*

```
Tier 1: Primitive (Field, Action)
   ↓
Tier 2: Intent (Guidance, Validation, Progress...)
   ↓
Tier 3: Component (Label, Input, Button...)
```

예를 들어:

```tsx
// Tier 1: Field
<Field name="email">

  {/* Tier 2: Intent - Guidance */}
  <Field.Guidance>
    <Field.Label>이메일</Field.Label>
    <Field.Description>로그인에 사용됩니다</Field.Description>
  </Field.Guidance>

  {/* Tier 2: Intent - Validation */}
  <Field.Validation schema={emailSchema}>
    <Field.Input />
    <Field.Error />
  </Field.Validation>

</Field>
```

### Yuki (UX 연구원)
오! Intent가 **그룹**으로 보이네요!

### Emma (디자이너)
구조가 명확해요! Guidance 관련은 다 `Field.Guidance` 아래에!

### Sarah (아키텍트)
잠깐, 이건 너무 복잡해요. 일반적인 사용에는 과할 것 같은데...

### Dev (기여자)
그래서 **3가지 레벨**로 나누는 거예요!

```tsx
// Level 1: Simple (Intent 숨김)
<Field name="email" label="이메일" validate={schema}>
  <Input />
</Field>

// Level 2: Structured (Intent 명시)
<Field name="email">
  <Field.Guidance label="이메일" />
  <Field.Validation schema={schema} />
  <Field.Control>
    <Input />
  </Field.Control>
</Field>

// Level 3: Explicit (Intent + Component 분리)
<Field name="email">
  <Field.Guidance>
    <Field.Label>이메일</Field.Label>
    <Field.Description>로그인용</Field.Description>
  </Field.Guidance>
  <Field.Validation schema={schema}>
    <Field.Control>
      <Input />
    </Field.Control>
    <Field.Error />
  </Field.Validation>
</Field>
```

### Marcus (개발자)
아! Progressive Enhancement네요!

---

## 🎬 Act 3: Field 3-Tier 구조 정의

### Sarah (아키텍트)
좋아요. Field부터 완전히 체계화해봅시다.

---

### 📋 Field 3-Tier 구조

```
Field (Tier 1: Primitive)
├── Guidance (Tier 2: Intent)
│   ├── Label (Tier 3: Component)
│   ├── Description (Tier 3: Component)
│   └── Required (Tier 3: Component)
├── Control (Tier 2: Intent)
│   ├── Input (Tier 3: Component)
│   ├── Select (Tier 3: Component)
│   ├── Textarea (Tier 3: Component)
│   └── [Any Custom UI] (Tier 3: Component)
├── Validation (Tier 2: Intent)
│   ├── Schema (Tier 3: Component)
│   ├── Rules (Tier 3: Component)
│   └── Trigger (Tier 3: Component)
├── Feedback (Tier 2: Intent)
│   ├── Error (Tier 3: Component)
│   ├── Success (Tier 3: Component)
│   ├── Warning (Tier 3: Component)
│   └── Info (Tier 3: Component)
├── State (Tier 2: Intent)
│   ├── Value (Tier 3: Component)
│   ├── Touched (Tier 3: Component)
│   ├── Dirty (Tier 3: Component)
│   └── Valid (Tier 3: Component)
└── Transform (Tier 2: Intent)
    ├── Format (Tier 3: Component)
    ├── Parse (Tier 3: Component)
    └── Sanitize (Tier 3: Component)
```

---

## 🎬 Act 4: Field 3-Tier 표 작성

### Alex (문서 작성자)
표로 만들어볼까요?

---

### 📋 Table 1: Field 3-Tier 구조 상세

| Tier 1<br/>(Primitive) | Tier 2<br/>(Intent) | Tier 3<br/>(Component) | Props | 설명 |
|----------------------|-------------------|---------------------|-------|------|
| **Field** | | | `name` | 필드 루트 |
| | **Guidance** | | | 사용자 안내 |
| | | `Label` | `text`, `required` | 필드 이름 표시 |
| | | `Description` | `text` | 도움말 텍스트 |
| | | `Placeholder` | `text` | 입력 예시 |
| | | `Required` | `indicator` | 필수 표시 |
| | **Control** | | | 입력 컨트롤 |
| | | `Input` | `type`, `placeholder` | 텍스트 입력 |
| | | `Select` | `options`, `multiple` | 선택 입력 |
| | | `Textarea` | `rows`, `cols` | 여러 줄 입력 |
| | | `Checkbox` | `checked` | 체크박스 |
| | | `Radio` | `value` | 라디오 버튼 |
| | | `[Custom]` | `any` | 커스텀 UI |
| | **Validation** | | | 검증 로직 |
| | | `Schema` | `zodSchema` | Zod 스키마 검증 |
| | | `Rules` | `required`, `min`, `max` | 검증 규칙 |
| | | `Custom` | `validate: Function` | 커스텀 검증 함수 |
| | | `Trigger` | `on: "blur"\|"change"` | 검증 시점 |
| | | `Deps` | `fields: string[]` | 의존 필드 |
| | **Feedback** | | | 피드백 메시지 |
| | | `Error` | `message` | 에러 메시지 |
| | | `Success` | `message` | 성공 메시지 |
| | | `Warning` | `message` | 경고 메시지 |
| | | `Info` | `message` | 정보 메시지 |
| | **State** | | | 상태 관리 |
| | | `Value` | `current`, `default` | 값 관리 |
| | | `Touched` | `isTouched` | 터치 여부 |
| | | `Dirty` | `isDirty` | 변경 여부 |
| | | `Valid` | `isValid` | 유효성 여부 |
| | | `Disabled` | `isDisabled` | 비활성 여부 |
| | **Transform** | | | 값 변환 |
| | | `Format` | `formatter: Function` | 표시용 포맷 (010-1234-5678) |
| | | `Parse` | `parser: Function` | 저장용 파싱 (01012345678) |
| | | `Sanitize` | `sanitizer: Function` | 값 정제 (trim, lowercase) |

---

## 🎬 Act 5: Action 3-Tier 구조 정의

### Marcus (개발자)
Action도 같은 방식으로 해볼까요?

---

### 📋 Action 3-Tier 구조

```
Action (Tier 1: Primitive)
├── Handler (Tier 2: Intent)
│   ├── Click (Tier 3: Component)
│   ├── Press (Tier 3: Component)
│   └── Submit (Tier 3: Component)
├── State (Tier 2: Intent)
│   ├── Loading (Tier 3: Component)
│   ├── Disabled (Tier 3: Component)
│   └── Pending (Tier 3: Component)
├── Confirmation (Tier 2: Intent)
│   ├── Dialog (Tier 3: Component)
│   ├── Message (Tier 3: Component)
│   └── Buttons (Tier 3: Component)
├── Feedback (Tier 2: Intent)
│   ├── Success (Tier 3: Component)
│   ├── Error (Tier 3: Component)
│   └── Progress (Tier 3: Component)
├── Prevention (Tier 2: Intent)
│   ├── Once (Tier 3: Component)
│   ├── Debounce (Tier 3: Component)
│   └── Throttle (Tier 3: Component)
└── Lifecycle (Tier 2: Intent)
    ├── OnStart (Tier 3: Component)
    ├── OnSuccess (Tier 3: Component)
    ├── OnError (Tier 3: Component)
    └── OnComplete (Tier 3: Component)
```

---

## 🎬 Act 6: Action 3-Tier 표 작성

### 📋 Table 2: Action 3-Tier 구조 상세

| Tier 1<br/>(Primitive) | Tier 2<br/>(Intent) | Tier 3<br/>(Component) | Props | 설명 |
|----------------------|-------------------|---------------------|-------|------|
| **Action** | | | `onClick` | 액션 루트 |
| | **Handler** | | | 이벤트 핸들러 |
| | | `Click` | `onClick: Function` | 클릭 핸들러 |
| | | `Press` | `onPress: Function` | 접근성 향상 핸들러 |
| | | `Submit` | `type: "submit"` | 폼 제출 |
| | | `Async` | `async: boolean` | 비동기 자동 처리 |
| | **State** | | | 상태 관리 |
| | | `Loading` | `isLoading` | 로딩 상태 |
| | | `Disabled` | `isDisabled` | 비활성 상태 |
| | | `Pending` | `isPending` | 대기 상태 |
| | | `Active` | `isActive` | 활성 상태 |
| | **Confirmation** | | | 확인 요청 |
| | | `Dialog` | `show: boolean` | 다이얼로그 표시 |
| | | `Title` | `text` | 확인 제목 |
| | | `Message` | `text` | 확인 메시지 |
| | | `Confirm` | `label`, `onClick` | 확인 버튼 |
| | | `Cancel` | `label`, `onClick` | 취소 버튼 |
| | **Feedback** | | | 결과 피드백 |
| | | `Success` | `message`, `duration` | 성공 메시지 |
| | | `Error` | `message`, `retry` | 에러 메시지 |
| | | `Progress` | `percent`, `label` | 진행률 표시 |
| | | `Toast` | `message`, `type` | 토스트 알림 |
| | **Prevention** | | | 중복 방지 |
| | | `Once` | `executed: boolean` | 1회만 실행 |
| | | `Debounce` | `delay: number` | 디바운스 (ms) |
| | | `Throttle` | `interval: number` | 쓰로틀 (ms) |
| | | `Cooldown` | `duration: number` | 쿨다운 시간 |
| | **Lifecycle** | | | 생명주기 |
| | | `OnStart` | `callback: Function` | 시작 시 |
| | | `OnSuccess` | `callback: Function` | 성공 시 |
| | | `OnError` | `callback: Function` | 에러 시 |
| | | `OnComplete` | `callback: Function` | 완료 시 (성공/실패 무관) |

---

## 🎬 Act 7: 사용 예시 - 3가지 레벨

### Sarah (아키텍트)
이제 실제 사용 예시를 3가지 레벨로 보여줘봅시다!

---

### 📋 Field 사용 예시

#### Level 1: Simple (Props 기반, Intent 숨김)

```tsx
// 가장 간단한 사용
<Field
  name="email"
  label="이메일"
  description="로그인에 사용됩니다"
  required
  validate={emailSchema}
  errorMessage="유효한 이메일을 입력하세요"
>
  <Input type="email" placeholder="you@example.com" />
</Field>
```

**특징**:
- ✅ 빠른 개발
- ✅ 간결한 코드
- ❌ Intent 구조 불명확
- ❌ 세밀한 제어 어려움

---

#### Level 2: Structured (Intent 그룹화)

```tsx
// Intent별로 그룹화
<Field name="email">
  <Field.Guidance
    label="이메일"
    description="로그인에 사용됩니다"
    required
  />

  <Field.Control>
    <Input type="email" placeholder="you@example.com" />
  </Field.Control>

  <Field.Validation
    schema={emailSchema}
    on="blur"
  />

  <Field.Feedback>
    <Field.Error />
  </Field.Feedback>
</Field>
```

**특징**:
- ✅ Intent 구조 명확
- ✅ 중간 수준 제어
- ✅ 읽기 쉬운 코드
- ❌ Level 1보다 장황함

---

#### Level 3: Explicit (Intent + Component 완전 분리)

```tsx
// 모든 컴포넌트 명시적 제어
<Field name="email">

  {/* Guidance Intent */}
  <Field.Guidance>
    <Field.Label required>
      이메일
    </Field.Label>
    <Field.Description>
      로그인에 사용됩니다
    </Field.Description>
  </Field.Guidance>

  {/* Control Intent */}
  <Field.Control>
    <Field.Input
      type="email"
      placeholder="you@example.com"
    />
  </Field.Control>

  {/* Validation Intent */}
  <Field.Validation>
    <Field.Schema value={emailSchema} />
    <Field.Trigger on="blur" />
  </Field.Validation>

  {/* Feedback Intent */}
  <Field.Feedback>
    <Field.Error>
      {(error) => (
        <div className="error-custom">
          ❌ {error.message}
        </div>
      )}
    </Field.Error>
  </Field.Feedback>

  {/* Transform Intent */}
  <Field.Transform>
    <Field.Sanitize fn={(v) => v.trim().toLowerCase()} />
  </Field.Transform>

</Field>
```

**특징**:
- ✅ 완전한 제어
- ✅ 커스터마이징 자유
- ✅ Intent 완벽 표현
- ❌ 가장 장황함
- ❌ 보일러플레이트 많음

---

### 📋 Action 사용 예시

#### Level 1: Simple (Props 기반)

```tsx
// 가장 간단한 사용
<Action
  onClick={handleDelete}
  loading={isDeleting}
  confirm="정말 삭제하시겠습니까?"
  onSuccess={() => toast.success("삭제 완료")}
  onError={(err) => toast.error(err.message)}
  debounce={300}
>
  <Button variant="destructive">삭제</Button>
</Action>
```

---

#### Level 2: Structured (Intent 그룹화)

```tsx
// Intent별로 그룹화
<Action onClick={handleDelete}>

  <Action.State loading={isDeleting} />

  <Action.Confirmation
    title="삭제 확인"
    message="정말 삭제하시겠습니까?"
    confirmLabel="삭제"
    cancelLabel="취소"
  />

  <Action.Prevention debounce={300} />

  <Action.Lifecycle
    onSuccess={() => toast.success("삭제 완료")}
    onError={(err) => toast.error(err.message)}
  />

  <Button variant="destructive">삭제</Button>
</Action>
```

---

#### Level 3: Explicit (Intent + Component 완전 분리)

```tsx
// 모든 컴포넌트 명시적 제어
<Action>

  {/* Handler Intent */}
  <Action.Handler>
    <Action.Click onClick={handleDelete} />
    <Action.Async enabled />
  </Action.Handler>

  {/* State Intent */}
  <Action.State>
    <Action.Loading show={isDeleting}>
      <Spinner />
    </Action.Loading>
    <Action.Disabled when={!canDelete} />
  </Action.State>

  {/* Confirmation Intent */}
  <Action.Confirmation>
    <Action.Dialog>
      <Action.Title>삭제 확인</Action.Title>
      <Action.Message>
        정말 삭제하시겠습니까?<br/>
        이 작업은 되돌릴 수 없습니다.
      </Action.Message>
      <Action.Buttons>
        <Action.Confirm>삭제</Action.Confirm>
        <Action.Cancel>취소</Action.Cancel>
      </Action.Buttons>
    </Action.Dialog>
  </Action.Confirmation>

  {/* Prevention Intent */}
  <Action.Prevention>
    <Action.Debounce delay={300} />
    <Action.Once />
  </Action.Prevention>

  {/* Feedback Intent */}
  <Action.Feedback>
    <Action.Success>
      <Action.Toast message="삭제 완료" />
    </Action.Success>
    <Action.Error>
      {(error) => (
        <Action.Toast
          message={error.message}
          action={{ label: "재시도", onClick: handleDelete }}
        />
      )}
    </Action.Error>
  </Action.Feedback>

  {/* Lifecycle Intent */}
  <Action.Lifecycle>
    <Action.OnStart fn={() => console.log("시작")} />
    <Action.OnSuccess fn={() => toast.success("완료")} />
    <Action.OnError fn={(e) => toast.error(e.message)} />
  </Action.Lifecycle>

  <Button variant="destructive">삭제</Button>
</Action>
```

---

## 🎬 Act 8: Intent Context 자동 전달

### Dev (기여자)
각 Intent는 Context로 자동 전달되는 거죠?

### Marcus (개발자)
맞아요! 예를 들어:

```tsx
// Field.Guidance 구현
const GuidanceContext = createContext()

function Guidance({ label, description, required, children }) {
  const field = useFieldContext() // Field Context

  const guidanceValue = {
    label,
    description,
    required,
    labelId: `${field.name}-label`,
    descriptionId: `${field.name}-description`,
  }

  return (
    <GuidanceContext.Provider value={guidanceValue}>
      {children || (
        // children 없으면 자동 렌더링
        <>
          {label && <Label required={required}>{label}</Label>}
          {description && <Description>{description}</Description>}
        </>
      )}
    </GuidanceContext.Provider>
  )
}

// Field.Label이 Guidance Context 사용
function Label({ children, required }) {
  const guidance = useContext(GuidanceContext)
  const field = useFieldContext()

  return (
    <label
      id={guidance.labelId}
      htmlFor={field.id}
    >
      {children || guidance.label}
      {required && <span aria-label="required">*</span>}
    </label>
  )
}
```

---

## 🎬 Act 9: 최종 비교 표

### Sarah (아키텍트)
3가지 레벨을 비교 표로 만들어봅시다!

---

### 📋 Table 3: 3-Level 비교

| 측면 | Level 1: Simple | Level 2: Structured | Level 3: Explicit |
|------|----------------|---------------------|-------------------|
| **코드 길이** | ⭐⭐⭐⭐⭐ 가장 짧음 | ⭐⭐⭐ 중간 | ⭐ 가장 김 |
| **Intent 가시성** | ⭐ Props에 숨김 | ⭐⭐⭐⭐ Intent 그룹 명시 | ⭐⭐⭐⭐⭐ 완전 명시 |
| **커스터마이징** | ⭐⭐ 제한적 | ⭐⭐⭐⭐ 중간 수준 | ⭐⭐⭐⭐⭐ 무한 자유 |
| **학습 곡선** | ⭐⭐⭐⭐⭐ 쉬움 | ⭐⭐⭐ 보통 | ⭐ 어려움 |
| **보일러플레이트** | ⭐⭐⭐⭐⭐ 최소 | ⭐⭐⭐ 중간 | ⭐ 최대 |
| **타입 안전성** | ⭐⭐⭐ 보통 | ⭐⭐⭐⭐ 좋음 | ⭐⭐⭐⭐⭐ 완벽 |
| **적합한 사용자** | 초급, 빠른 프로토타입 | 중급, 프로덕션 | 고급, 디자인 시스템 제작자 |
| **적합한 상황** | CRUD, 폼 많음 | 복잡한 폼, 커스텀 필요 | 완전 커스텀 UI, 라이브러리 제작 |

---

## 🎬 Act 10: 혼용 가능성

### Yuki (UX 연구원)
3가지 레벨을 섞어 쓸 수 있나요?

### Marcus (개발자)
물론이죠! 필요한 부분만 Explicit하게!

```tsx
// Level 1 + Level 3 혼용
<Field
  name="email"
  label="이메일"  // Level 1: Simple prop
  required
>
  {/* Level 3: Explicit Control */}
  <Field.Control>
    <MyCustomFloatingInput />
  </Field.Control>

  {/* Level 1: Simple prop */}
  <Field.Validation schema={emailSchema} />

  {/* Level 3: Explicit Feedback */}
  <Field.Feedback>
    <Field.Error>
      {(error) => (
        <AnimatedErrorMessage error={error} />
      )}
    </Field.Error>
  </Field.Feedback>
</Field>
```

### Emma (디자이너)
완벽해요! **필요한 만큼만 제어**할 수 있네요!

---

## 🎬 Act 11: 최종 3-Tier 원칙

### Sarah (아키텍트)
3-Tier 구조의 핵심 원칙을 정리해봅시다.

---

### 📋 3-Tier 설계 원칙

#### 1️⃣ Intent Visibility (의도 가시성)

```tsx
❌ Intent 숨김 (Props만)
<Field name="email" label="이메일" validate={schema}>
  <Input />
</Field>

✅ Intent 명시 (구조)
<Field name="email">
  <Field.Guidance label="이메일" />
  <Field.Validation schema={schema} />
  <Field.Control>
    <Input />
  </Field.Control>
</Field>
```

**원칙**: API 구조가 Intent를 드러내야 한다

---

#### 2️⃣ Progressive Enhancement (점진적 향상)

```tsx
// 초급 → 중급 → 고급 순차적 마이그레이션 가능
<Field name="email" label="이메일">  // Level 1
  ↓
<Field name="email">
  <Field.Guidance label="이메일" />  // Level 2
  ↓
<Field name="email">
  <Field.Guidance>
    <Field.Label>이메일</Field.Label>  // Level 3
```

**원칙**: 레벨 간 순차 마이그레이션이 자연스러워야 한다

---

#### 3️⃣ Default Composition (기본 조합)

```tsx
// children 없으면 자동 렌더링
<Field.Guidance label="이메일" />
// ↓ 내부적으로
<Field.Guidance>
  <Field.Label>이메일</Field.Label>
</Field.Guidance>

// children 있으면 커스텀
<Field.Guidance label="이메일">
  <MyCustomLabel />
</Field.Guidance>
```

**원칙**: 기본 조합을 제공하되, 재정의 가능해야 한다

---

#### 4️⃣ Context Inheritance (컨텍스트 상속)

```
Field Context
  ↓
Guidance Context
  ↓
Label Component
```

```tsx
// Label은 Field + Guidance Context 모두 접근
function Label() {
  const field = useFieldContext()       // name, id, ...
  const guidance = useGuidanceContext()  // label, required, ...

  return (
    <label id={guidance.labelId} htmlFor={field.id}>
      {guidance.label}
    </label>
  )
}
```

**원칙**: 하위 컴포넌트는 상위 Intent의 Context를 상속받는다

---

#### 5️⃣ Intent Independence (의도 독립성)

```tsx
// Intent는 독립적으로 작동
<Field name="username">
  <Field.Guidance label="사용자명" />
  {/* Validation 없어도 됨 */}
  <Field.Control>
    <Input />
  </Field.Control>
</Field>

// 순서 바뀌어도 됨
<Field name="username">
  <Field.Control>
    <Input />
  </Field.Control>
  <Field.Guidance label="사용자명" />  {/* 아래에 와도 OK */}
</Field>
```

**원칙**: 각 Intent는 다른 Intent에 의존하지 않는다

---

## 🎬 Act 12: 최종 요약

### Sarah (아키텍트)
*(정리하며)*

오늘 우리는 **Intent를 API에 명시화**하는 3-Tier 구조를 만들었어요!

---

### 📋 최종 요약 표

#### Field 3-Tier 요약

| Tier | 역할 | 예시 | 개수 |
|------|------|------|------|
| **Tier 1: Primitive** | 최상위 컨테이너 | `Field` | 1 |
| **Tier 2: Intent** | 의도별 그룹화 | `Guidance`, `Validation`, `Control`, `Feedback`, `State`, `Transform` | 6 |
| **Tier 3: Component** | 구체적 UI/로직 | `Label`, `Input`, `Error`, `Schema`, `Value`, `Format` 등 | 20+ |

#### Action 3-Tier 요약

| Tier | 역할 | 예시 | 개수 |
|------|------|------|------|
| **Tier 1: Primitive** | 최상위 컨테이너 | `Action` | 1 |
| **Tier 2: Intent** | 의도별 그룹화 | `Handler`, `State`, `Confirmation`, `Feedback`, `Prevention`, `Lifecycle` | 6 |
| **Tier 3: Component** | 구체적 UI/로직 | `Click`, `Loading`, `Dialog`, `Success`, `Debounce`, `OnSuccess` 등 | 20+ |

---

### 핵심 가치

```
3-Tier = Intent Visibility + Progressive Enhancement + Infinite Customization
```

**Level 1 (Simple)**: 빠른 개발 → Props 기반
**Level 2 (Structured)**: 명확한 구조 → Intent 그룹
**Level 3 (Explicit)**: 완전한 제어 → Intent + Component 분리

---

### 새로운 슬로건

# **"See the Intent, Control the Component"**
### Intent를 보고, Component를 제어하라

---

**회의 종료**: 2026년 1월 15일 새벽 2시
**결과**: Field & Action 3-Tier 구조 완성
**다음 단계**: 3-Tier 구현 시작!

---

## 📊 부록: 전체 구조 맵

### Field 완전 맵

```tsx
<Field name="email">
  <Field.Guidance>
    <Field.Label>이메일</Field.Label>
    <Field.Description>로그인용</Field.Description>
    <Field.Placeholder>you@example.com</Field.Placeholder>
    <Field.Required />
  </Field.Guidance>

  <Field.Control>
    <Field.Input />
    {/* 또는 */}
    <Field.Select />
    <Field.Textarea />
    <Field.Checkbox />
    <Field.Radio />
    {/* 또는 커스텀 */}
    <MyCustomInput />
  </Field.Control>

  <Field.Validation>
    <Field.Schema value={zodSchema} />
    <Field.Rules required min={5} max={100} />
    <Field.Custom validate={myValidator} />
    <Field.Trigger on="blur" />
    <Field.Deps fields={["password"]} />
  </Field.Validation>

  <Field.Feedback>
    <Field.Error />
    <Field.Success />
    <Field.Warning />
    <Field.Info />
  </Field.Feedback>

  <Field.State>
    <Field.Value default="" />
    <Field.Touched />
    <Field.Dirty />
    <Field.Valid />
    <Field.Disabled />
  </Field.State>

  <Field.Transform>
    <Field.Format fn={(v) => formatPhone(v)} />
    <Field.Parse fn={(v) => parsePhone(v)} />
    <Field.Sanitize fn={(v) => v.trim()} />
  </Field.Transform>
</Field>
```

### Action 완전 맵

```tsx
<Action>
  <Action.Handler>
    <Action.Click onClick={handleClick} />
    <Action.Press onPress={handlePress} />
    <Action.Submit />
    <Action.Async enabled />
  </Action.Handler>

  <Action.State>
    <Action.Loading />
    <Action.Disabled />
    <Action.Pending />
    <Action.Active />
  </Action.State>

  <Action.Confirmation>
    <Action.Dialog>
      <Action.Title>확인</Action.Title>
      <Action.Message>정말?</Action.Message>
      <Action.Buttons>
        <Action.Confirm>예</Action.Confirm>
        <Action.Cancel>아니오</Action.Cancel>
      </Action.Buttons>
    </Action.Dialog>
  </Action.Confirmation>

  <Action.Feedback>
    <Action.Success message="완료" />
    <Action.Error message="실패" />
    <Action.Progress percent={50} />
    <Action.Toast />
  </Action.Feedback>

  <Action.Prevention>
    <Action.Once />
    <Action.Debounce delay={300} />
    <Action.Throttle interval={100} />
    <Action.Cooldown duration={1000} />
  </Action.Prevention>

  <Action.Lifecycle>
    <Action.OnStart fn={() => {}} />
    <Action.OnSuccess fn={() => {}} />
    <Action.OnError fn={() => {}} />
    <Action.OnComplete fn={() => {}} />
  </Action.Lifecycle>

  <Button>클릭</Button>
</Action>
```
