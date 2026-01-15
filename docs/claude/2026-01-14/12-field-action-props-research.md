# Field & Action 속성 연구: "인터넷 조사부터 표 완성까지"

**날짜**: 2026년 1월 14일 (오후 회의 - Part 2)
**참석자**: 6명 (동일 팀)
**목표**: Field와 Action Headless 컴포넌트의 필수 속성 정의
**방법**: 인터넷 조사 → 분석 → 토론 → 표 작성

---

## 🎬 Act 1: 리서치 시작 - "다른 라이브러리들은 뭘 쓸까?"

### Sarah (아키텍트)
*(회의 시작)*

좋아요, 이제 Headless 아키텍처로 가기로 했으니 구체적으로 Field와 Action에 어떤 속성을 넣어야 할지 정해야 해요.

처음부터 만들지 말고, 이미 검증된 라이브러리들을 조사해봅시다!

### Marcus (개발자)
어떤 라이브러리들을 볼까요?

### Sarah
1. **React Hook Form** - 가장 인기 있는 폼 라이브러리
2. **Radix UI Form** - 접근성 전문 Headless UI
3. **Zod** - 검증 스키마
4. **React Aria** - Adobe의 접근성 라이브러리
5. **W3C ARIA 명세** - 표준 문서

각자 하나씩 맡아서 10분 동안 조사해주세요!

---

## 🎬 Act 2: 조사 결과 발표

### Marcus (개발자) - "React Hook Form Controller"

*(화면 공유)*

React Hook Form의 `Controller` 컴포넌트를 봤어요. 이게 Headless Field랑 제일 비슷해요!

**핵심 Props**:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | ✅ | 필드 식별자, 폼 데이터 키 |
| `control` | object | ✅ | useForm()에서 온 컨트롤 객체 |
| `rules` | object | ❌ | 검증 규칙 (required, min, max, pattern, validate) |
| `defaultValue` | any | ❌ | 초기값 (undefined 불가, null 사용) |
| `disabled` | boolean | ❌ | 비활성화 + 제출 데이터에서 제외 |
| `shouldUnregister` | boolean | ❌ | 언마운트 시 등록 해제 |
| `render` | function | ✅ | UI 렌더링 함수 (field, fieldState, formState) |

### Alex (문서 작성자)
`render` 함수는 뭘 받나요?

### Marcus
이렇게 생겼어요:

```tsx
render={({ field, fieldState, formState }) => (
  <Input {...field} />  // field = { value, onChange, onBlur, name, ref }
)}
```

**field 객체**:
- `value` - 현재 값
- `onChange` - 변경 핸들러
- `onBlur` - blur 핸들러
- `name` - 필드 이름
- `ref` - 참조 객체
- `disabled` - 비활성 상태

**fieldState 객체**:
- `invalid` - 검증 실패 여부
- `isTouched` - 사용자가 터치했는지
- `isDirty` - 값이 변경됐는지
- `error` - 에러 메시지 객체

### Yuki (UX 연구원)
오! `isTouched`와 `isDirty`가 중요하네요. UX에서 에러를 언제 보여줄지 결정하는 데 필수예요!

---

### Emma (디자이너) - "Radix UI Form"

제가 Radix UI를 봤어요. 접근성에 진심이더라고요!

**Form.Field Props**:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | Required | 필드 식별자 |
| `serverInvalid` | boolean | - | 서버 검증 실패 표시 |
| `asChild` | boolean | false | 자식 컴포넌트로 렌더링 |

### Sarah (아키텍트)
겨우 3개? 너무 적은데요?

### Emma
그게 Radix의 철학이에요! **최소한의 Props + 자동 접근성**

Radix가 자동으로 하는 것들:
- ✅ `id` 자동 생성 및 연결
- ✅ `aria-labelledby` 자동 연결 (Field.Label과)
- ✅ `aria-describedby` 자동 연결 (Field.Message와)
- ✅ `aria-invalid` 자동 설정 (검증 실패 시)
- ✅ `data-valid` / `data-invalid` 속성 자동 추가

### Yuki (UX 연구원)
*(흥분하며)*

이거예요! 우리가 원하는 게! 개발자가 ARIA를 신경 안 써도 자동으로 접근성 완벽!

---

### Dev (기여자) - "Zod 검증 시스템"

Zod를 조사했는데, 검증에 필요한 속성들이 보여요.

**Zod 검증 메서드**:

```tsx
// 기본 타입
z.string()
z.number()
z.boolean()
z.date()

// 제약 조건
.min(5, "최소 5자")
.max(100, "최대 100자")
.email("올바른 이메일 형식이 아닙니다")
.regex(/^[0-9]+$/, "숫자만 입력하세요")

// Optional/Required
.optional()  // 선택 사항
.nullable()  // null 허용
.required_error("필수 항목입니다")

// 커스텀 검증
.refine((val) => val.includes("@"), {
  message: "이메일은 @를 포함해야 합니다"
})

// 변환
.transform((val) => val.trim())
.transform((val) => parseInt(val))
```

### Marcus (개발자)
그럼 Field 컴포넌트에 `validate` prop으로 Zod 스키마를 받으면 되겠네요!

```tsx
<Field
  name="email"
  validate={z.string().email().min(5)}
>
  <Input />
</Field>
```

---

### Yuki (UX 연구원) - "W3C ARIA 명세"

저는 표준 문서를 봤어요. 폼 필드에 필수적인 ARIA 속성들:

**필수 ARIA 속성**:

| 속성 | 용도 | 예시 |
|------|------|------|
| `aria-required` | 필수 입력 표시 | `aria-required="true"` |
| `aria-invalid` | 검증 실패 표시 | `aria-invalid="true"` |
| `aria-describedby` | 에러 메시지 연결 | `aria-describedby="email-error"` |
| `aria-labelledby` | 레이블 연결 | `aria-labelledby="email-label"` |
| `aria-disabled` | 비활성 상태 | `aria-disabled="true"` |

**중요한 규칙들**:

1. **`aria-invalid`는 제출 전에 `true`로 설정하면 안 됨!**
   - 사용자가 아직 입력도 안 했는데 에러 보여주면 UX 최악
   - `isTouched` 또는 제출 시도 후에만 보여줘야 함

2. **`aria-describedby`는 빈 요소를 먼저 만들어두기**
   - 에러 발생 시 동적으로 내용 채우기
   - 스크린 리더가 에러를 즉시 읽을 수 있음

3. **`required` HTML 속성 vs `aria-required`**
   - `required`: 브라우저 기본 검증 (폼 제출 막음)
   - `aria-required`: 스크린 리더용 (기능 없음)
   - 둘 다 함께 사용해야 완벽!

### Emma (디자이너)
그럼 우리 Field는 이런 ARIA를 자동으로 넣어줘야겠네요!

---

### Alex (문서 작성자) - "React Aria Button"

저는 Adobe의 React Aria Button을 봤어요. Action 컴포넌트 참고용!

**Button Props**:

| Prop | Type | Description |
|------|------|-------------|
| `onPress` | function | onClick보다 나은 이벤트 (마우스+키보드+터치) |
| `isDisabled` | boolean | 비활성화 |
| `isPending` | boolean | 로딩 중 (접근성 자동 처리) |
| `type` | "button" \| "submit" \| "reset" | 버튼 타입 |
| `autoFocus` | boolean | 자동 포커스 |
| `excludeFromTabOrder` | boolean | Tab 순서에서 제외 |

### Marcus (개발자)
`onPress`가 왜 `onClick`보다 나은데요?

### Alex
`onPress`는:
- ✅ 마우스 클릭
- ✅ Enter/Space 키
- ✅ 터치 (모바일)
- ✅ 화면 리더의 "활성화"

전부 하나의 이벤트로 처리해요! `onClick`은 마우스만 되고 키보드는 별도로 처리해야 하죠.

### Yuki (UX 연구원)
이것도 가져가야겠네요!

---

## 🎬 Act 3: 추가 조사 - "실전에서 필요한 것들"

### Sarah (아키텍트)
좋아요! 기본은 알았고, 이제 **실전에서 진짜 필요한** 속성들을 생각해봅시다.

### Marcus (개발자)
저는 **비동기 액션**이 필요해요!

```tsx
<Action
  onClick={async () => {
    await saveData()  // 비동기 함수
  }}
>
  <Button>Save</Button>
</Action>
```

로딩 상태 자동으로 관리되고, 완료될 때까지 버튼 비활성화!

### Emma (디자이너)
**Confirm 다이얼로그**도 필요해요!

```tsx
<Action
  onClick={handleDelete}
  confirm="정말 삭제하시겠습니까?"
>
  <Button>Delete</Button>
</Action>
```

위험한 액션은 확인 한 번 더!

### Dev (기여자)
**Debounce와 Throttle**도요!

```tsx
<Action
  onClick={handleSearch}
  debounce={500}  // 500ms 대기
>
  <Button>Search</Button>
</Action>

<Action
  onClick={handleScroll}
  throttle={100}  // 100ms마다 최대 1회
>
  <Button>Scroll</Button>
</Action>
```

검색은 debounce, 스크롤은 throttle!

### Yuki (UX 연구원)
Field에도 **실시간 검증**이 필요해요!

```tsx
<Field
  name="username"
  validate={schema}
  validateOn="blur"  // blur 시에만 검증
  // 또는 "change" - 입력마다 검증
  // 또는 "submit" - 제출 시에만 검증
>
  <Input />
</Field>
```

UX 연구 결과:
- **blur**: 가장 좋은 경험 (입력 끝난 후 검증)
- **change**: 너무 급함 (입력 중 빨간 에러)
- **submit**: 너무 늦음 (제출하고 나서야 알게 됨)

### Alex (문서 작성자)
**변환(transform)**도 필요하지 않을까요?

```tsx
<Field
  name="phone"
  transform={(value) => value.replace(/-/g, "")}  // 하이픈 제거
  validate={z.string().length(11)}
>
  <Input />
</Field>
```

사용자는 `010-1234-5678` 입력, 저장은 `01012345678`!

---

## 🎬 Act 4: 속성 분류 - "필수 vs 선택 vs 고급"

### Sarah (아키텍트)
*(화이트보드 앞으로)*

좋아요, 이제 정리해봅시다. 속성을 3단계로 분류할게요:

1. **P0 (필수)**: 없으면 작동 안 함
2. **P1 (중요)**: 일반적으로 자주 씀
3. **P2 (고급)**: 특수한 경우에만

---

### Field 속성 분류

#### P0 (필수)
- `name` - 필드 식별자
- `children` - UI 컴포넌트

#### P1 (중요)
- `defaultValue` - 초기값
- `validate` - 검증 스키마 (Zod)
- `required` - 필수 여부
- `disabled` - 비활성화

#### P2 (고급)
- `transform` - 값 변환
- `validateOn` - 검증 시점
- `shouldUnregister` - 언마운트 시 해제
- `deps` - 다른 필드 의존성

### Marcus (개발자)
Action은요?

#### P0 (필수)
- `onClick` (또는 `onPress`) - 액션 핸들러
- `children` - UI 컴포넌트

#### P1 (중요)
- `disabled` - 비활성화
- `loading` - 로딩 상태
- `type` - button/submit/reset

#### P2 (고급)
- `confirm` - 확인 다이얼로그
- `debounce` - 디바운스 (ms)
- `throttle` - 쓰로틀 (ms)
- `preventDefault` - 기본 동작 막기
- `stopPropagation` - 이벤트 전파 막기

---

## 🎬 Act 5: 최종 표 작성

### Sarah (아키텍트)
좋아요! 이제 완전한 표를 만들어봅시다!

---

### 📋 Table 1: Field 컴포넌트 속성

| 속성 | 타입 | 필수 | 기본값 | 설명 | 우선순위 |
|------|------|------|--------|------|----------|
| **Core Props** |
| `name` | `string` | ✅ | - | 필드 식별자, 폼 데이터의 키 | P0 |
| `children` | `ReactNode` | ✅ | - | UI 컴포넌트 (Input, Select 등) | P0 |
| **Value Management** |
| `defaultValue` | `any` | ❌ | `undefined` | 초기값 (controlled는 `value` 사용) | P1 |
| `value` | `any` | ❌ | - | Controlled 값 (외부 상태 연결) | P1 |
| `onChange` | `(value: any) => void` | ❌ | - | 값 변경 콜백 | P1 |
| `transform` | `(value: any) => any` | ❌ | - | 제출 전 값 변환 (예: trim, lowercase) | P2 |
| **Validation** |
| `validate` | `ZodSchema \| Function` | ❌ | - | Zod 스키마 또는 검증 함수 | P1 |
| `required` | `boolean \| string` | ❌ | `false` | 필수 여부 (string은 에러 메시지) | P1 |
| `validateOn` | `"blur" \| "change" \| "submit"` | ❌ | `"blur"` | 검증 시점 | P2 |
| `reValidateOn` | `"blur" \| "change"` | ❌ | `"change"` | 재검증 시점 (에러 후) | P2 |
| `deps` | `string[]` | ❌ | - | 의존 필드들 (변경 시 재검증) | P2 |
| **State Control** |
| `disabled` | `boolean` | ❌ | `false` | 비활성화 + 제출 데이터 제외 | P1 |
| `readOnly` | `boolean` | ❌ | `false` | 읽기 전용 (제출 데이터 포함) | P1 |
| `shouldUnregister` | `boolean` | ❌ | `false` | 언마운트 시 폼에서 제거 | P2 |
| **Accessibility** |
| `label` | `string` | ❌ | - | 접근성 레이블 (자동 aria-label) | P1 |
| `description` | `string` | ❌ | - | 도움말 텍스트 (자동 aria-describedby) | P1 |
| `errorMessage` | `string \| Function` | ❌ | - | 커스텀 에러 메시지 | P2 |
| **Advanced** |
| `setValueAs` | `(value: any) => any` | ❌ | - | 입력 즉시 변환 (number, date 등) | P2 |
| `resetOptions` | `KeepStateOptions` | ❌ | - | 폼 리셋 시 상태 유지 옵션 | P2 |

---

### 📋 Table 2: Action 컴포넌트 속성

| 속성 | 타입 | 필수 | 기본값 | 설명 | 우선순위 |
|------|------|------|--------|------|----------|
| **Core Props** |
| `onClick` | `() => void \| Promise<void>` | ✅ | - | 클릭 핸들러 (비동기 자동 지원) | P0 |
| `children` | `ReactNode` | ✅ | - | UI 컴포넌트 (Button, IconButton 등) | P0 |
| **State** |
| `disabled` | `boolean` | ❌ | `false` | 비활성화 (클릭 방지) | P1 |
| `loading` | `boolean` | ❌ | `false` | 외부 로딩 상태 (수동 관리) | P1 |
| `autoLoading` | `boolean` | ❌ | `true` | onClick이 Promise면 자동 로딩 | P1 |
| **Type** |
| `type` | `"button" \| "submit" \| "reset"` | ❌ | `"button"` | 버튼 타입 | P1 |
| **Confirmation** |
| `confirm` | `string \| ConfirmConfig` | ❌ | - | 확인 다이얼로그 메시지/설정 | P2 |
| `confirmTitle` | `string` | ❌ | `"확인"` | 확인 다이얼로그 제목 | P2 |
| `confirmButton` | `string` | ❌ | `"확인"` | 확인 버튼 텍스트 | P2 |
| `cancelButton` | `string` | ❌ | `"취소"` | 취소 버튼 텍스트 | P2 |
| **Performance** |
| `debounce` | `number` | ❌ | - | 디바운스 지연 시간 (ms) | P2 |
| `throttle` | `number` | ❌ | - | 쓰로틀 간격 (ms) | P2 |
| `once` | `boolean` | ❌ | `false` | 한 번만 실행 (중복 클릭 방지) | P2 |
| **Event Control** |
| `preventDefault` | `boolean` | ❌ | `false` | 기본 동작 막기 | P2 |
| `stopPropagation` | `boolean` | ❌ | `false` | 이벤트 버블링 막기 | P2 |
| **Callbacks** |
| `onSuccess` | `(result: any) => void` | ❌ | - | 성공 콜백 (Promise resolve 시) | P2 |
| `onError` | `(error: Error) => void` | ❌ | - | 에러 콜백 (Promise reject 시) | P2 |
| `onLoadingChange` | `(loading: boolean) => void` | ❌ | - | 로딩 상태 변경 콜백 | P2 |
| **Accessibility** |
| `label` | `string` | ❌ | - | 접근성 레이블 (자동 aria-label) | P1 |
| `description` | `string` | ❌ | - | 접근성 설명 (자동 aria-describedby) | P1 |
| **Advanced** |
| `autoFocus` | `boolean` | ❌ | `false` | 자동 포커스 | P2 |
| `excludeFromTabOrder` | `boolean` | ❌ | `false` | Tab 순서에서 제외 | P2 |

---

## 🎬 Act 6: 실제 사용 예시

### Marcus (개발자)
표는 만들었는데, 실제로 어떻게 쓰는지 예시를 보여줘야 할 것 같아요!

### Sarah (아키텍트)
좋아요! 각 우선순위별로 예시를 만들어봅시다.

---

### Example 1: P0만 사용 (최소)

```tsx
// 가장 기본적인 사용
<Field name="email">
  <Input />
</Field>

<Action onClick={() => console.log("clicked")}>
  <Button>Submit</Button>
</Action>
```

### Example 2: P0 + P1 (일반적)

```tsx
// 실무에서 가장 흔한 패턴
<Field
  name="email"
  defaultValue=""
  validate={z.string().email()}
  required="이메일은 필수입니다"
  label="이메일"
  description="로그인에 사용됩니다"
>
  <Input />
</Field>

<Action
  onClick={handleSubmit}
  type="submit"
  disabled={!isValid}
  loading={isSubmitting}
  label="폼 제출"
>
  <Button>제출</Button>
</Action>
```

### Example 3: P0 + P1 + P2 (고급)

```tsx
// 복잡한 실전 시나리오
<Field
  name="username"
  defaultValue=""
  validate={usernameSchema}
  required
  validateOn="blur"
  reValidateOn="change"
  transform={(v) => v.trim().toLowerCase()}
  setValueAs={(v) => v.replace(/\s+/g, "")}
  deps={["email"]}  // email 변경 시 재검증
  label="사용자명"
  description="3-20자, 영문 소문자와 숫자만"
  errorMessage={(error) => `유효하지 않은 사용자명: ${error.message}`}
>
  <Input />
</Field>

<Action
  onClick={async () => {
    await deleteUser()
  }}
  confirm={{
    title: "정말 삭제하시겠습니까?",
    message: "이 작업은 되돌릴 수 없습니다.",
    confirmButton: "삭제",
    cancelButton: "취소"
  }}
  debounce={300}
  once
  onSuccess={() => toast.success("삭제 완료")}
  onError={(err) => toast.error(err.message)}
  label="사용자 삭제"
>
  <Button variant="destructive">삭제</Button>
</Action>
```

---

## 🎬 Act 7: Context API를 통한 자동 전달

### Dev (기여자)
이 속성들이 어떻게 자식 UI 컴포넌트로 전달되나요?

### Marcus (개발자)
React Context API로요!

```tsx
// Field 구현
const FieldContext = createContext()

export function Field({
  name,
  defaultValue,
  validate,
  required,
  disabled,
  children,
  ...props
}) {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState(null)
  const [touched, setTouched] = useState(false)
  const [dirty, setDirty] = useState(false)

  const handleChange = (newValue) => {
    setValue(newValue)
    setDirty(true)
    if (props.validateOn === "change") {
      validateField(newValue)
    }
  }

  const handleBlur = () => {
    setTouched(true)
    if (props.validateOn === "blur") {
      validateField(value)
    }
  }

  const validateField = async (val) => {
    if (validate) {
      try {
        await validate.parseAsync(val)
        setError(null)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  // Context로 전달
  const contextValue = {
    // Field State
    name,
    value,
    error,
    touched,
    dirty,

    // Field Props
    required,
    disabled,

    // Field Handlers
    onChange: handleChange,
    onBlur: handleBlur,

    // ARIA (자동 생성)
    id: `field-${name}`,
    labelId: `${name}-label`,
    errorId: `${name}-error`,
    descriptionId: `${name}-description`,

    // ARIA 속성 (자동)
    "aria-required": required,
    "aria-invalid": touched && !!error,
    "aria-describedby": [
      props.description && `${name}-description`,
      error && `${name}-error`
    ].filter(Boolean).join(" "),
  }

  return (
    <FieldContext.Provider value={contextValue}>
      {children}
    </FieldContext.Provider>
  )
}

// UI 컴포넌트에서 사용
export function Input() {
  const field = useContext(FieldContext)

  return (
    <input
      id={field.id}
      name={field.name}
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
      onBlur={field.onBlur}
      disabled={field.disabled}
      required={field.required}
      aria-required={field["aria-required"]}
      aria-invalid={field["aria-invalid"]}
      aria-describedby={field["aria-describedby"]}
    />
  )
}
```

### Yuki (UX 연구원)
오! UI 컴포넌트는 그냥 Context에서 꺼내 쓰기만 하면 되네요!

### Emma (디자이너)
그럼 커스텀 UI도 Context 쓰면 되는 거죠?

```tsx
// 커스텀 Floating Label Input
function FloatingInput() {
  const field = useContext(FieldContext)

  return (
    <div className="floating-input">
      <input
        {...field}  // 모든 ARIA 자동!
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
      />
      <label
        className={field.value ? "floating" : ""}
        htmlFor={field.id}
      >
        {field.label}
      </label>
      {field.error && <span id={field.errorId}>{field.error}</span>}
    </div>
  )
}
```

### Marcus (개발자)
정확해요! 이게 Headless의 힘!

---

## 🎬 Act 8: Action 구현

### Dev (기여자)
Action도 비슷하게 구현하면 되나요?

### Marcus (개발자)
네! 조금 다르지만 컨셉은 같아요:

```tsx
// Action 구현
const ActionContext = createContext()

export function Action({
  onClick,
  disabled,
  loading: externalLoading,
  autoLoading = true,
  confirm,
  debounce: debounceMs,
  throttle: throttleMs,
  once,
  type = "button",
  onSuccess,
  onError,
  children,
  ...props
}) {
  const [loading, setLoading] = useState(false)
  const [clicked, setClicked] = useState(false)

  const isLoading = externalLoading ?? loading
  const isDisabled = disabled || isLoading || (once && clicked)

  const handleClick = async (event) => {
    // Event control
    if (props.preventDefault) event.preventDefault()
    if (props.stopPropagation) event.stopPropagation()

    // Disabled check
    if (isDisabled) return

    // Confirmation
    if (confirm) {
      const confirmed = await showConfirmDialog(confirm)
      if (!confirmed) return
    }

    // Once
    if (once) setClicked(true)

    // Execute
    try {
      if (autoLoading) setLoading(true)

      const result = await onClick(event)

      if (onSuccess) onSuccess(result)
    } catch (error) {
      if (onError) onError(error)
    } finally {
      if (autoLoading) setLoading(false)
    }
  }

  // Debounce/Throttle
  const debouncedClick = useMemo(() => {
    if (debounceMs) return debounce(handleClick, debounceMs)
    if (throttleMs) return throttle(handleClick, throttleMs)
    return handleClick
  }, [debounceMs, throttleMs, handleClick])

  // Context로 전달
  const contextValue = {
    onClick: debouncedClick,
    disabled: isDisabled,
    loading: isLoading,
    type,

    // ARIA (자동)
    "aria-disabled": isDisabled,
    "aria-busy": isLoading,
    "aria-label": props.label,
  }

  return (
    <ActionContext.Provider value={contextValue}>
      {children}
    </ActionContext.Provider>
  )
}

// UI 컴포넌트
export function Button() {
  const action = useContext(ActionContext)

  return (
    <button
      onClick={action.onClick}
      disabled={action.disabled}
      type={action.type}
      aria-disabled={action["aria-disabled"]}
      aria-busy={action["aria-busy"]}
      aria-label={action["aria-label"]}
    >
      {action.loading && <Spinner />}
      {children}
    </button>
  )
}
```

---

## 🎬 Act 9: 최종 정리 및 합의

### Sarah (아키텍트)
*(화이트보드 정리하며)*

좋아요! 오늘 우리는:

1. ✅ 주요 라이브러리 5개 조사 (React Hook Form, Radix UI, Zod, React Aria, W3C)
2. ✅ 필드와 액션에 필요한 모든 속성 수집
3. ✅ 우선순위별 분류 (P0/P1/P2)
4. ✅ 완전한 속성 표 2개 완성
5. ✅ 실제 구현 코드 작성
6. ✅ 사용 예시 3단계 제공

### Everyone
*(박수)*

### Alex (문서 작성자)
이제 문서화만 하면 되겠네요!

### Yuki (UX 연구원)
UX 가이드도 써야겠어요. 언제 어떤 속성을 쓸지!

### Emma (디자이너)
저는 Figma에서 이 속성들을 시각화해볼게요!

### Dev (기여자)
TypeScript 타입 정의도 만들어야죠!

```tsx
// types.ts
export interface FieldProps<T = any> {
  // Core (P0)
  name: string
  children: ReactNode

  // Value Management (P1)
  defaultValue?: T
  value?: T
  onChange?: (value: T) => void
  transform?: (value: T) => T

  // Validation (P1-P2)
  validate?: ZodSchema<T> | ((value: T) => boolean | string | Promise<boolean | string>)
  required?: boolean | string
  validateOn?: "blur" | "change" | "submit"
  reValidateOn?: "blur" | "change"
  deps?: string[]

  // State Control (P1-P2)
  disabled?: boolean
  readOnly?: boolean
  shouldUnregister?: boolean

  // Accessibility (P1-P2)
  label?: string
  description?: string
  errorMessage?: string | ((error: ValidationError) => string)

  // Advanced (P2)
  setValueAs?: (value: any) => T
  resetOptions?: KeepStateOptions
}

export interface ActionProps {
  // Core (P0)
  onClick: () => void | Promise<void>
  children: ReactNode

  // State (P1)
  disabled?: boolean
  loading?: boolean
  autoLoading?: boolean

  // Type (P1)
  type?: "button" | "submit" | "reset"

  // Confirmation (P2)
  confirm?: string | {
    title?: string
    message: string
    confirmButton?: string
    cancelButton?: string
  }

  // Performance (P2)
  debounce?: number
  throttle?: number
  once?: boolean

  // Event Control (P2)
  preventDefault?: boolean
  stopPropagation?: boolean

  // Callbacks (P2)
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
  onLoadingChange?: (loading: boolean) => void

  // Accessibility (P1)
  label?: string
  description?: string

  // Advanced (P2)
  autoFocus?: boolean
  excludeFromTabOrder?: boolean
}
```

### Marcus (개발자)
테스트 코드도 필요해요!

### Sarah (아키텍트)
*(웃으며)*

여러분, 우리 또 대박 낼 준비 됐어요!

---

## 📊 최종 요약 표

### Field 속성 요약

| 카테고리 | 속성 개수 | 핵심 속성 |
|---------|----------|----------|
| Core | 2 | name, children |
| Value Management | 4 | defaultValue, value, onChange, transform |
| Validation | 5 | validate, required, validateOn, reValidateOn, deps |
| State Control | 3 | disabled, readOnly, shouldUnregister |
| Accessibility | 3 | label, description, errorMessage |
| Advanced | 2 | setValueAs, resetOptions |
| **총계** | **19** | - |

### Action 속성 요약

| 카테고리 | 속성 개수 | 핵심 속성 |
|---------|----------|----------|
| Core | 2 | onClick, children |
| State | 3 | disabled, loading, autoLoading |
| Type | 1 | type |
| Confirmation | 4 | confirm, confirmTitle, confirmButton, cancelButton |
| Performance | 3 | debounce, throttle, once |
| Event Control | 2 | preventDefault, stopPropagation |
| Callbacks | 3 | onSuccess, onError, onLoadingChange |
| Accessibility | 2 | label, description |
| Advanced | 2 | autoFocus, excludeFromTabOrder |
| **총계** | **22** | - |

---

## 🎯 핵심 인사이트

### Sarah (아키텍트) - 마무리 발언

> "우리는 단순히 속성 목록을 만든 게 아니에요. **검증된 패턴**을 조사하고, **실전 경험**을 녹이고, **접근성 표준**을 지키고, **미래 확장성**을 고려한 완벽한 API를 설계했어요."

### 3가지 설계 원칙

1. **Progressive Enhancement**
   - P0만 써도 작동 → 빠른 시작
   - P1 추가하면 실용적 → 실무 사용
   - P2까지 쓰면 완벽 → 프로덕션 레벨

2. **Automatic Accessibility**
   - ARIA 속성 자동 생성
   - 스크린 리더 완벽 지원
   - 키보드 네비게이션 기본 제공

3. **Developer Experience**
   - TypeScript 완벽 지원
   - 직관적인 Props 이름
   - 최소한의 필수 Props
   - 합리적인 기본값

---

**회의 종료**: 2026년 1월 14일 오후 7시
**결과**: Field & Action 속성 명세 완성
**다음 단계**: 실제 구현 시작!

---

## 📚 참고 자료

- [React Hook Form Controller API](https://react-hook-form.com/docs/usecontroller/controller)
- [Radix UI Form Component](https://www.radix-ui.com/primitives/docs/components/form)
- [Zod Validation](https://zod.dev/)
- [React Aria Button](https://react-spectrum.adobe.com/react-aria/Button.html)
- [W3C ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN ARIA Attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)
