# Field & Action 목적 정의: "Why부터 시작하자"

**날짜**: 2026년 1월 14일 (저녁 회의)
**참석자**: 6명 (동일 팀)
**목표**: 속성 구현 전, Field와 Action의 본질적 목적과 Intent 정의
**접근**: Why → What → How 순서로 사고

---

## 🎬 Act 1: 문제 제기 - "우리 뭐 하려는 거였지?"

### Sarah (아키텍트)
*(회의실 불 끄고 화이트보드만 켬)*

잠깐, 모두 멈춰요.

### Marcus (개발자)
무슨 일이에요?

### Sarah
우리 지금까지 뭐 했죠?
- Headless 아키텍처 확정
- 속성 19개, 22개 정의

그런데... **왜** Field가 필요한지, **왜** Action이 필요한지 제대로 정의했나요?

### Alex (문서 작성자)
음... "입력을 받으려고"요?

### Sarah
그게 **목적**인가요, **수단**인가요?

*(침묵)*

### Sarah
우리 지금 **How**(어떻게 구현)부터 시작했어요. 19개 속성, 22개 속성...

하지만 **Why**(왜 존재하는가)를 먼저 정의해야 해요.

Simon Sinek의 Golden Circle 아시죠?

```
    ┌─────────────┐
    │     WHY     │  ← 왜 존재하는가?
    │  ┌───────┐  │
    │  │  WHAT │  │  ← 무엇을 제공하는가?
    │  │ ┌───┐ │  │
    │  │ │HOW│ │  │  ← 어떻게 구현하는가?
    │  │ └───┘ │  │
    │  └───────┘  │
    └─────────────┘
```

우리는 HOW부터 시작했어요. 지금 WHY로 돌아가야 해요.

### Yuki (UX 연구원)
*(고개 끄덕이며)*

맞아요. 속성 목록은 만들었지만, **이게 왜 필요한지** 설명 못 하면 아무도 안 써요.

---

## 🎬 Act 2: Field의 WHY - "왜 Field가 존재하는가?"

### Sarah (아키텍트)
좋아요. 첫 번째 질문.

**"왜 Field가 필요한가?"**

Input 태그 있잖아요. 그냥 `<input>`으로 만들면 되는데 왜 Field를 만들죠?

### Marcus (개발자)
음... 검증하려고?

### Sarah
왜 검증이 필요하죠?

### Marcus
사용자가 잘못된 값을 입력할 수 있으니까...

### Sarah
왜 사용자가 잘못된 값을 입력하나요?

### Yuki (UX 연구원)
사람은 실수를 하니까요. 오타, 착각, 모르고...

### Sarah
정확해요! 계속 파고들어봅시다.

**사용자가 실수하면 어떻게 되죠?**

### Emma (디자이너)
폼 제출이 실패하죠.

### Sarah
그럼요?

### Emma
다시 입력해야 하고... 짜증나고... 이탈해요.

### Sarah
*(화이트보드에 쓰며)*

```
사용자 실수
  ↓
제출 실패
  ↓
재입력
  ↓
짜증 + 이탈
  ↓
비즈니스 손실
```

### Sarah
그럼 **Field의 근본 목적**은 뭘까요?

### Dev (기여자)
*(깨달으며)*

**"사용자 실수를 방지하고, 올바른 데이터 수집을 보장"**

### Sarah
바로 그거예요!

Field는 단순히 "입력받는 것"이 아니라:

**"사용자와 시스템 사이의 신뢰할 수 있는 데이터 계약(Contract)"**

---

## 🎬 Act 3: Field의 Intent 분류

### Sarah (아키텍트)
좋아요. 이제 Field가 **무엇을 제공해야 하는지**(WHAT) 생각해봅시다.

"신뢰할 수 있는 데이터 계약"을 위해 뭐가 필요하죠?

### Yuki (UX 연구원)
첫째, **사용자가 뭘 입력해야 하는지 알아야** 해요.

### Sarah
*(화이트보드에)*

```
Intent 1: Guidance (안내)
- 무엇을 입력해야 하는가?
- 어떤 형식이어야 하는가?
- 필수인가, 선택인가?
```

### Marcus (개발자)
둘째, **입력하는 동안 도움**을 줘야 해요.

### Sarah
```
Intent 2: Assistance (보조)
- 실시간 피드백
- 자동 완성/제안
- 포맷팅 (전화번호 하이픈)
```

### Emma (디자이너)
셋째, **잘못 입력했을 때 알려줘야** 해요.

### Sarah
```
Intent 3: Validation (검증)
- 올바른 형식인가?
- 제약 조건 만족하는가?
- 비즈니스 규칙 통과하는가?
```

### Alex (문서 작성자)
넷째, **고쳐야 할 부분을 명확히** 알려줘야 해요.

### Sarah
```
Intent 4: Correction (교정)
- 무엇이 잘못됐는가?
- 어떻게 고쳐야 하는가?
- 어디를 보면 되는가?
```

### Dev (기여자)
다섯째, **최종 데이터가 정확해야** 해요.

### Sarah
```
Intent 5: Guarantee (보장)
- 타입 안전성
- 데이터 일관성
- 제출 가능 여부
```

### Yuki (UX 연구원)
여섯째, **누구나 사용 가능해야** 해요!

### Sarah
```
Intent 6: Accessibility (접근성)
- 스크린 리더 지원
- 키보드 네비게이션
- 명확한 에러 전달
```

---

## 🎬 Act 4: Field Intent 체계화

### Sarah (아키텍트)
*(화이트보드 정리)*

좋아요. Field의 6가지 Intent를 정리했어요.

이제 각 Intent가 **왜** 필요한지, **무엇을** 제공하는지 체계화해봅시다.

---

### 📋 Field Intent Hierarchy

| Intent | Why (왜 필요한가?) | What (무엇을 제공하는가?) | 사용자 질문 |
|--------|-------------------|------------------------|------------|
| **1. Guidance<br/>(안내)** | 사용자는 빈 입력 필드만 보고는 뭘 해야 할지 모른다 | • Label (무엇을 입력하나?)<br/>• Placeholder (예시 보기)<br/>• Description (상세 설명)<br/>• Required indicator (필수?) | "뭘 입력해야 하지?" |
| **2. Assistance<br/>(보조)** | 사용자는 정확한 형식을 외우지 못한다 | • Auto-formatting (자동 포맷)<br/>• Suggestions (자동완성)<br/>• Character count (글자 수)<br/>• Input mask (입력 마스크) | "어떻게 입력하지?" |
| **3. Validation<br/>(검증)** | 사용자 입력은 항상 잘못될 수 있다 | • Schema validation (스키마)<br/>• Type checking (타입 체크)<br/>• Range validation (범위 검사)<br/>• Custom rules (커스텀 규칙) | "이거 맞나?" |
| **4. Correction<br/>(교정)** | 에러 메시지 없으면 사용자는 막막하다 | • Error message (에러 설명)<br/>• Field highlighting (필드 강조)<br/>• Suggestion (제안)<br/>• Focus management (포커스) | "뭐가 틀렸지?" |
| **5. Guarantee<br/>(보장)** | 시스템은 타입 안전한 데이터가 필요하다 | • Type safety (타입 보장)<br/>• Data transformation (변환)<br/>• Sanitization (정제)<br/>• Submit readiness (제출 준비) | "제출해도 되나?" |
| **6. Accessibility<br/>(접근성)** | 모든 사용자가 동등하게 사용해야 한다 | • ARIA labels (레이블)<br/>• Screen reader (스크린 리더)<br/>• Keyboard nav (키보드)<br/>• Focus visible (포커스 표시) | "나도 쓸 수 있나?" |

### Marcus (개발자)
오! 이제 **왜** 각 기능이 필요한지 명확하네요!

### Yuki (UX 연구원)
사용자 질문이 특히 좋아요. 각 Intent가 **어떤 불안을 해소**하는지 보여요!

---

## 🎬 Act 5: Action의 WHY - "왜 Action이 존재하는가?"

### Sarah (아키텍트)
좋아요, 이제 Action으로 가봅시다.

**"왜 Action이 필요한가?"**

Button 있잖아요. 그냥 `<button onClick={...}>`면 되는데 왜 Action을 만들죠?

### Dev (기여자)
음... onClick에 비동기 처리, 로딩, 에러 핸들링 다 넣으면 복잡하니까요?

### Sarah
맞아요. 그럼 **더 근본적으로**, 사용자가 버튼 누르면 뭐가 일어나죠?

### Emma (디자이너)
서버에 데이터 전송, 페이지 이동, 모달 열기...

### Sarah
공통점이 뭐죠?

### Marcus (개발자)
**"상태 변화"**?

### Sarah
정확해요!

```
사용자 액션
  ↓
시스템 상태 변화
  ↓
UI 업데이트
```

그런데 **문제**가 뭐죠?

### Marcus
상태 변화가 즉시 일어나지 않아요. **비동기**죠.

```
버튼 클릭
  ↓
⏳ 로딩... (0.5초? 3초? 10초?)
  ↓
✅ 성공 또는 ❌ 실패
```

### Sarah
그동안 사용자는 뭐 하죠?

### Yuki (UX 연구원)
기다려요... 그런데 **불안**해해요!

- "클릭이 됐나?"
- "처리 중인가?"
- "언제 끝나지?"
- "실패한 건 아닐까?"

### Sarah
*(화이트보드에)*

```
사용자 불안
  ↓
중복 클릭
  ↓
중복 요청
  ↓
데이터 오류 / 서버 부하
```

### Sarah
그럼 **Action의 근본 목적**은 뭘까요?

### Yuki (UX 연구원)
**"비동기 상태 변화 과정에서 사용자 불안을 제거하고, 명확한 피드백 제공"**

### Sarah
완벽해요!

Action은 단순히 "클릭 처리"가 아니라:

**"사용자와 시스템 사이의 신뢰할 수 있는 상태 변화 중개자(Mediator)"**

---

## 🎬 Act 6: Action의 Intent 분류

### Sarah (아키텍트)
좋아요. Action이 **무엇을 제공해야 하는지** 생각해봅시다.

"신뢰할 수 있는 상태 변화"를 위해 뭐가 필요하죠?

### Yuki (UX 연구원)
첫째, **클릭했다는 확신**을 줘야 해요.

### Sarah
```
Intent 1: Acknowledgment (인지)
- 클릭이 접수됐음을 확인
- 즉각적인 시각적 피드백
- 촉각/청각 피드백 (선택)
```

### Marcus (개발자)
둘째, **진행 상황을 보여줘야** 해요.

### Sarah
```
Intent 2: Progress (진행)
- 로딩 중임을 표시
- 진행 정도 표시 (선택)
- 예상 소요 시간 (선택)
```

### Emma (디자이너)
셋째, **중복 실행을 막아야** 해요.

### Sarah
```
Intent 3: Prevention (방지)
- 중복 클릭 방지
- 비활성 상태 관리
- 조건부 실행
```

### Dev (기여자)
넷째, **위험한 액션은 확인해야** 해요.

### Sarah
```
Intent 4: Confirmation (확인)
- 위험 액션 경고
- 되돌릴 수 없음 알림
- 명시적 동의
```

### Alex (문서 작성자)
다섯째, **결과를 명확히** 알려줘야 해요.

### Sarah
```
Intent 5: Outcome (결과)
- 성공/실패 피드백
- 에러 메시지
- 다음 액션 제안
```

### Yuki (UX 연구원)
여섯째, **성능을 최적화**해야 해요!

### Sarah
```
Intent 6: Optimization (최적화)
- Debounce (연속 클릭)
- Throttle (스크롤 등)
- Lazy execution
```

---

## 🎬 Act 7: Action Intent 체계화

### Sarah (아키텍트)
Action의 6가지 Intent를 체계화해봅시다.

---

### 📋 Action Intent Hierarchy

| Intent | Why (왜 필요한가?) | What (무엇을 제공하는가?) | 사용자 질문 |
|--------|-------------------|------------------------|------------|
| **1. Acknowledgment<br/>(인지)** | 사용자는 클릭이 접수됐는지 불안하다 | • Visual feedback (시각 피드백)<br/>• Active state (활성 상태)<br/>• Haptic/Sound (촉각/청각)<br/>• Immediate response (즉각 반응) | "클릭됐나?" |
| **2. Progress<br/>(진행)** | 사용자는 진행 중인지 알고 싶어한다 | • Loading indicator (로딩 표시)<br/>• Progress bar (진행률)<br/>• Pending state (대기 상태)<br/>• Time estimate (예상 시간) | "처리 중인가?" |
| **3. Prevention<br/>(방지)** | 중복 실행은 데이터 오류를 만든다 | • Disable on click (클릭 시 비활성)<br/>• Once execution (1회 실행)<br/>• Conditional enable (조건부 활성)<br/>• State guard (상태 가드) | "또 눌러도 되나?" |
| **4. Confirmation<br/>(확인)** | 위험한 액션은 되돌릴 수 없다 | • Confirm dialog (확인 다이얼로그)<br/>• Warning message (경고)<br/>• Destructive style (위험 스타일)<br/>• Two-step action (2단계) | "정말 할까?" |
| **5. Outcome<br/>(결과)** | 사용자는 결과를 명확히 알아야 한다 | • Success feedback (성공 피드백)<br/>• Error message (에러 메시지)<br/>• Toast/Alert (알림)<br/>• Next action (다음 액션) | "됐나? 안됐나?" |
| **6. Optimization<br/>(최적화)** | 불필요한 실행은 성능을 저하시킨다 | • Debounce (디바운스)<br/>• Throttle (쓰로틀)<br/>• Request deduplication (중복 제거)<br/>• Cache strategy (캐시) | "너무 자주?" |

### Marcus (개발자)
이제 Action도 명확해졌어요!

### Emma (디자이너)
각 Intent가 **사용자 불안**을 해소하는 게 보이네요!

---

## 🎬 Act 8: Intent → Props 매핑

### Sarah (아키텍트)
좋아요! 이제 각 Intent를 **구체적인 Props**로 매핑해봅시다.

**Intent가 WHY라면, Props는 HOW**예요.

---

### 📋 Field: Intent → Props 매핑

| Intent | 관련 Props | 역할 |
|--------|-----------|------|
| **Guidance<br/>(안내)** | `name`<br/>`label`<br/>`placeholder`<br/>`description`<br/>`required` | 사용자에게 무엇을, 어떻게 입력할지 안내 |
| **Assistance<br/>(보조)** | `transform`<br/>`setValueAs`<br/>`mask`<br/>`suggestions` | 입력 과정을 도와주는 자동화 |
| **Validation<br/>(검증)** | `validate`<br/>`schema`<br/>`rules`<br/>`validateOn`<br/>`deps` | 입력값이 올바른지 검사 |
| **Correction<br/>(교정)** | `error`<br/>`errorMessage`<br/>`touched`<br/>`dirty` | 무엇이 잘못됐는지 알려줌 |
| **Guarantee<br/>(보장)** | `value`<br/>`defaultValue`<br/>`onChange`<br/>`disabled` | 데이터 무결성 보장 |
| **Accessibility<br/>(접근성)** | `aria-*`<br/>`id`<br/>`labelId`<br/>`errorId` | 모든 사용자가 접근 가능 |

---

### 📋 Action: Intent → Props 매핑

| Intent | 관련 Props | 역할 |
|--------|-----------|------|
| **Acknowledgment<br/>(인지)** | `onPress`<br/>`onClick`<br/>`activeStyle`<br/>`haptic` | 클릭 접수를 즉시 피드백 |
| **Progress<br/>(진행)** | `loading`<br/>`pending`<br/>`progress`<br/>`autoLoading` | 진행 상황 표시 |
| **Prevention<br/>(방지)** | `disabled`<br/>`once`<br/>`when`<br/>`unless` | 중복/조건 실행 방지 |
| **Confirmation<br/>(확인)** | `confirm`<br/>`confirmTitle`<br/>`confirmMessage`<br/>`dangerous` | 위험 액션 확인 |
| **Outcome<br/>(결과)** | `onSuccess`<br/>`onError`<br/>`successMessage`<br/>`errorMessage` | 결과 피드백 |
| **Optimization<br/>(최적화)** | `debounce`<br/>`throttle`<br/>`cache`<br/>`deduplicate` | 성능 최적화 |

### Marcus (개발자)
오! 이제 **왜 이 Props가 필요한지** 이유가 명확해요!

### Alex (문서 작성자)
문서 쓸 때도 Intent 기반으로 설명하면 이해하기 쉽겠어요!

---

## 🎬 Act 9: 최종 정의 표

### Sarah (아키텍트)
좋아요. 이제 Field와 Action을 **한 문장으로 정의**해봅시다.

---

### 📋 최종 정의 표

#### Field 컴포넌트

| 항목 | 내용 |
|------|------|
| **WHY<br/>(존재 이유)** | 사용자와 시스템 간 **신뢰할 수 있는 데이터 계약**을 보장하기 위해 |
| **WHAT<br/>(제공 가치)** | 6가지 Intent 제공:<br/>1. Guidance - 무엇을 입력할지 안내<br/>2. Assistance - 입력 과정 보조<br/>3. Validation - 올바른 데이터 검증<br/>4. Correction - 오류 교정 도움<br/>5. Guarantee - 데이터 무결성 보장<br/>6. Accessibility - 모든 사용자 접근 가능 |
| **HOW<br/>(구현 방식)** | Headless 컴포넌트로 로직과 상태 관리<br/>Context API로 자식 UI에 전달<br/>ARIA 자동 생성 |
| **핵심 책임** | ✅ 사용자 입력 받기<br/>✅ 실시간 검증<br/>✅ 명확한 에러 전달<br/>✅ 타입 안전 보장<br/>✅ 접근성 자동화 |
| **핵심 가치** | **"사용자는 실수하지 않는다 - 시스템이 방지한다"** |

#### Action 컴포넌트

| 항목 | 내용 |
|------|------|
| **WHY<br/>(존재 이유)** | 비동기 상태 변화 과정에서 **사용자 불안을 제거**하고 **명확한 피드백**을 제공하기 위해 |
| **WHAT<br/>(제공 가치)** | 6가지 Intent 제공:<br/>1. Acknowledgment - 클릭 인지 즉시 피드백<br/>2. Progress - 진행 상황 표시<br/>3. Prevention - 중복/위험 실행 방지<br/>4. Confirmation - 위험 액션 확인<br/>5. Outcome - 성공/실패 명확한 결과<br/>6. Optimization - 성능 최적화 |
| **HOW<br/>(구현 방식)** | Headless 컴포넌트로 비동기 로직 관리<br/>Promise 자동 처리<br/>로딩/에러 상태 자동 관리 |
| **핵심 책임** | ✅ 비동기 실행 관리<br/>✅ 로딩 상태 표시<br/>✅ 중복 실행 방지<br/>✅ 에러 핸들링<br/>✅ 사용자 피드백 |
| **핵심 가치** | **"사용자는 기다리지 않는다 - 시스템이 알린다"** |

---

## 🎬 Act 10: Intent 기반 Props 우선순위 재분류

### Sarah (아키텍트)
이제 Intent를 기준으로 Props 우선순위를 **다시** 분류해봅시다.

이전에는 P0/P1/P2로 나눴는데, 이제는 **Intent 기반**으로!

---

### 📋 Field Props - Intent 기반 분류

| Intent | Props | 우선순위 | 이유 |
|--------|-------|----------|------|
| **Guidance** | `name` | **P0** | 필드 식별 필수 |
| | `label` | **P1** | 무엇을 입력할지 알려줘야 함 |
| | `placeholder` | P2 | 있으면 좋음 |
| | `description` | P2 | 복잡한 필드만 필요 |
| | `required` | **P1** | 필수 여부는 중요 |
| **Assistance** | `transform` | P2 | 고급 기능 |
| | `setValueAs` | P2 | 타입 변환 |
| | `mask` | P2 | 특수한 경우 |
| **Validation** | `validate` | **P1** | 검증은 핵심 |
| | `schema` | **P1** | validate의 다른 이름 |
| | `validateOn` | P2 | 기본값으로 충분 |
| | `deps` | P2 | 복잡한 폼만 필요 |
| **Correction** | `error` | **P0** | 내부 상태 (자동) |
| | `errorMessage` | P2 | 커스텀 메시지 |
| | `touched` | **P0** | 내부 상태 (자동) |
| | `dirty` | **P0** | 내부 상태 (자동) |
| **Guarantee** | `value` | **P1** | Controlled 모드 |
| | `defaultValue` | **P1** | Uncontrolled 모드 |
| | `onChange` | **P1** | 값 변경 핸들러 |
| | `disabled` | **P1** | 자주 쓰임 |
| **Accessibility** | `aria-*` | **P0** | 자동 생성 (내부) |
| | `id` | **P0** | 자동 생성 (내부) |

---

### 📋 Action Props - Intent 기반 분류

| Intent | Props | 우선순위 | 이유 |
|--------|-------|----------|------|
| **Acknowledgment** | `onClick` | **P0** | 핵심 기능 |
| | `onPress` | **P0** | onClick과 동일 역할 |
| **Progress** | `loading` | **P1** | 로딩 표시 중요 |
| | `autoLoading` | **P1** | 자동 처리 편함 |
| | `progress` | P2 | 특수한 경우 |
| **Prevention** | `disabled` | **P1** | 자주 쓰임 |
| | `once` | P2 | 특정 상황 |
| | `when` | P2 | 조건부 실행 |
| **Confirmation** | `confirm` | P2 | 위험 액션만 |
| | `confirmTitle` | P2 | confirm의 세부 |
| | `confirmMessage` | P2 | confirm의 세부 |
| **Outcome** | `onSuccess` | P2 | 있으면 좋음 |
| | `onError` | **P1** | 에러 처리 중요 |
| | `successMessage` | P2 | 선택 사항 |
| | `errorMessage` | P2 | 선택 사항 |
| **Optimization** | `debounce` | P2 | 특수 상황 |
| | `throttle` | P2 | 특수 상황 |
| | `cache` | P2 | 고급 기능 |

---

## 🎬 Act 11: 최종 핵심 Props 표

### Sarah (아키텍트)
좋아요! 이제 **진짜 필요한 Props만** 남겨서 최종 표를 만들어봅시다.

**원칙**:
1. P0 (필수) - 없으면 작동 안 함
2. P1 (핵심) - 90%가 사용
3. P2 (고급) - 10%만 사용

---

### 📋 FINAL: Field 핵심 Props

| Category | Prop | Type | Required | Default | Intent | Why |
|----------|------|------|----------|---------|--------|-----|
| **Identity** | `name` | `string` | ✅ | - | Guidance | 필드를 식별하고 폼 데이터 키로 사용 |
| | `children` | `ReactNode` | ✅ | - | - | UI 컴포넌트 렌더링 |
| **Guidance** | `label` | `string` | ❌ | - | Guidance | 사용자에게 무엇을 입력할지 알림 |
| | `description` | `string` | ❌ | - | Guidance | 추가 설명 제공 |
| | `required` | `boolean` | ❌ | false | Guidance | 필수 입력 여부 표시 |
| **Value** | `defaultValue` | `T` | ❌ | undefined | Guarantee | Uncontrolled 모드 초기값 |
| | `value` | `T` | ❌ | - | Guarantee | Controlled 모드 현재값 |
| | `onChange` | `(value: T) => void` | ❌ | - | Guarantee | 값 변경 핸들러 |
| **Validation** | `validate` | `Schema \| Function` | ❌ | - | Validation | 검증 로직 (Zod 스키마 또는 함수) |
| | `validateOn` | `"blur"\|"change"\|"submit"` | ❌ | "blur" | Validation | 검증 시점 제어 |
| **State** | `disabled` | `boolean` | ❌ | false | Guarantee | 입력 비활성화 |
| | `readOnly` | `boolean` | ❌ | false | Guarantee | 읽기 전용 (값은 제출됨) |
| **Transform** | `transform` | `(value: T) => T` | ❌ | - | Assistance | 제출 전 값 변환 (trim, lowercase 등) |
| **Error** | `errorMessage` | `string \| Function` | ❌ | - | Correction | 커스텀 에러 메시지 |

**내부 상태 (자동 관리)**:
- `error: string | null` - 검증 에러 메시지
- `touched: boolean` - 사용자가 필드를 터치했는지
- `dirty: boolean` - 초기값에서 변경됐는지
- `valid: boolean` - 검증 통과했는지

**자동 생성 ARIA**:
- `id` - 필드 고유 ID
- `aria-required` - required prop 기반
- `aria-invalid` - error 존재 여부 기반
- `aria-describedby` - description + error 연결

---

### 📋 FINAL: Action 핵심 Props

| Category | Prop | Type | Required | Default | Intent | Why |
|----------|------|------|----------|---------|--------|-----|
| **Handler** | `onClick` | `() => void \| Promise<void>` | ✅ | - | Acknowledgment | 클릭 핸들러 (비동기 자동 지원) |
| | `children` | `ReactNode` | ✅ | - | - | UI 컴포넌트 렌더링 |
| **State** | `disabled` | `boolean` | ❌ | false | Prevention | 클릭 비활성화 |
| | `loading` | `boolean` | ❌ | false | Progress | 외부 로딩 상태 (수동 제어) |
| **Type** | `type` | `"button"\|"submit"\|"reset"` | ❌ | "button" | - | 버튼 타입 (폼 제출 등) |
| **Async** | `autoLoading` | `boolean` | ❌ | true | Progress | onClick이 Promise면 자동 로딩 |
| | `onSuccess` | `(result: any) => void` | ❌ | - | Outcome | 성공 시 콜백 |
| | `onError` | `(error: Error) => void` | ❌ | - | Outcome | 에러 시 콜백 |
| **Confirmation** | `confirm` | `string \| ConfirmConfig` | ❌ | - | Confirmation | 실행 전 확인 다이얼로그 |
| **Performance** | `debounce` | `number` | ❌ | - | Optimization | 디바운스 지연(ms) |
| | `throttle` | `number` | ❌ | - | Optimization | 쓰로틀 간격(ms) |
| | `once` | `boolean` | ❌ | false | Prevention | 한 번만 실행 |
| **Accessibility** | `label` | `string` | ❌ | - | Acknowledgment | 접근성 레이블 |

**내부 상태 (자동 관리)**:
- `isLoading: boolean` - 현재 로딩 중인지 (autoLoading 활성 시)
- `isPending: boolean` - 대기 중인지
- `error: Error | null` - 마지막 에러

**자동 생성 ARIA**:
- `aria-disabled` - disabled 상태 기반
- `aria-busy` - loading 상태 기반
- `aria-label` - label prop 기반

---

## 🎬 Act 12: 핵심 원칙 정립

### Sarah (아키텍트)
*(화이트보드 정리 완료)*

좋아요! 이제 Field와 Action의 설계 원칙을 정립해봅시다.

---

### 📋 Field & Action 설계 원칙

#### 1️⃣ Intent-Driven Design (의도 중심 설계)

```
❌ 나쁜 예: Props부터 나열
Props: name, value, onChange, error, touched, dirty, ...

✅ 좋은 예: Intent부터 정의
Intent: Guidance → Props: name, label, description, required
Intent: Validation → Props: validate, validateOn
```

**원칙**: "왜 필요한가?"를 먼저 정의하고, 그에 맞는 Props 제공

---

#### 2️⃣ Progressive Disclosure (점진적 공개)

```
// Level 1: 최소 (P0)
<Field name="email">
  <Input />
</Field>

// Level 2: 일반 (P0 + P1)
<Field name="email" label="이메일" validate={emailSchema}>
  <Input />
</Field>

// Level 3: 고급 (P0 + P1 + P2)
<Field
  name="email"
  label="이메일"
  validate={emailSchema}
  validateOn="blur"
  transform={(v) => v.trim()}
  errorMessage={(e) => `오류: ${e.message}`}
>
  <Input />
</Field>
```

**원칙**: 간단하게 시작하고, 필요할 때 점진적으로 기능 추가

---

#### 3️⃣ Automatic Accessibility (자동 접근성)

```tsx
// 개발자가 작성
<Field name="email" label="이메일" required>
  <Input />
</Field>

// 자동 생성 ARIA
<div>
  <label id="email-label" for="email">이메일 *</label>
  <input
    id="email"
    name="email"
    aria-labelledby="email-label"
    aria-required="true"
    aria-invalid="false"
  />
</div>
```

**원칙**: 개발자가 ARIA를 몰라도 접근성 완벽

---

#### 4️⃣ Zero Configuration Defaults (제로 설정 기본값)

```tsx
// 기본값만으로도 완벽 작동
<Field name="username">  {/* validateOn="blur" 자동 */}
  <Input />
</Field>

<Action onClick={handleSave}>  {/* autoLoading=true 자동 */}
  <Button>Save</Button>
</Action>
```

**원칙**: 가장 좋은 UX 패턴을 기본값으로 제공

---

#### 5️⃣ User Anxiety Reduction (사용자 불안 해소)

```tsx
// 사용자 질문에 답하는 Props
<Field
  name="password"
  label="비밀번호"              // "뭘 입력하지?"
  description="8자 이상"        // "어떻게 입력하지?"
  validate={passwordSchema}     // "이거 맞나?"
  errorMessage="너무 짧아요"    // "뭐가 틀렸지?"
>
  <Input />
</Field>

<Action
  onClick={handleDelete}
  loading={isDeleting}          // "처리 중인가?"
  confirm="정말 삭제?"          // "정말 할까?"
  onSuccess={() => toast("완료")} // "됐나?"
>
  <Button>Delete</Button>
</Action>
```

**원칙**: 모든 사용자 불안 질문에 답하는 Props 제공

---

## 🎬 Act 13: 최종 정리

### Sarah (아키텍트)
*(모두를 바라보며)*

오늘 우리는:

1. ✅ **WHY부터 시작** - 왜 Field와 Action이 필요한지 정의
2. ✅ **Intent 분류** - 6가지 핵심 의도 도출
3. ✅ **Intent → Props 매핑** - 의도를 구체적 Props로 변환
4. ✅ **우선순위 재분류** - Intent 기반 P0/P1/P2
5. ✅ **설계 원칙 정립** - 5가지 핵심 원칙

이제 **왜** 이 컴포넌트를 만드는지, **무엇을** 제공하는지, **어떻게** 구현할지 명확해졌어요!

### Marcus (개발자)
이제 구현하면 되겠네요!

### Yuki (UX 연구원)
Intent 기반이라 UX 가이드 쓰기도 쉬울 것 같아요!

### Emma (디자이너)
디자이너도 이해하기 쉬워요. "왜"가 명확하니까!

### Dev (기여자)
오픈소스 기여자들도 Intent 보고 "아! 이래서 이 Props가 있구나" 이해할 거예요!

### Alex (문서 작성자)
문서는 Intent 카테고리별로 나눠서 쓰면 완벽하겠어요!

```markdown
# Field 컴포넌트

## Guidance (안내)
사용자에게 무엇을 입력할지 알려줍니다.
- label: 필드 이름
- description: 상세 설명
- required: 필수 여부

## Validation (검증)
올바른 데이터인지 검증합니다.
- validate: 검증 스키마
- validateOn: 검증 시점
```

### Sarah (아키텍트)
*(만족스러운 표정)*

완벽해요!

이제 우리는 **"어떻게 만들까?"**가 아니라 **"왜 만들까?"**에서 시작하는 팀이 됐어요.

**Props는 수단이고, Intent가 목적**이에요.

---

**회의 종료**: 2026년 1월 14일 밤 10시
**결과**: Field & Action 목적 및 Intent 명확화
**다음 단계**: Intent 기반 구현 시작

---

## 📊 최종 비교: 이전 vs 이후

| 접근 방식 | 이전 (Props First) | 이후 (Intent First) |
|-----------|-------------------|---------------------|
| **시작점** | "어떤 Props가 필요해?" | "왜 이게 필요해?" |
| **분류 기준** | 기술적 (value, validation, state) | 사용자 중심 (guidance, correction, guarantee) |
| **우선순위** | P0/P1/P2 (구현 난이도) | P0/P1/P2 (사용자 가치) |
| **문서화** | Props 레퍼런스 나열 | Intent 스토리 설명 |
| **이해도** | "이게 뭐 하는 거지?" | "아! 이래서 필요하구나!" |
| **확장성** | Props 추가하다 복잡해짐 | Intent 유지하며 자연스럽게 확장 |

---

## 💡 핵심 인사이트

### Sarah의 마지막 말

> "우리는 **Props를 만드는 게 아니라**, 사용자 불안을 해소하는 **Intent를 구현**하는 거예요."

### 3가지 질문 프레임워크

모든 Props 추가 시 물어봐야 할 질문:

1. **WHY**: "왜 이게 필요한가?" → Intent 확인
2. **WHAT**: "사용자 어떤 불안을 해소하는가?" → 가치 검증
3. **HOW**: "가장 단순한 API는 무엇인가?" → 구현 결정

---

**부록: Intent 기반 사고 훈련**

```
❌ Props First 사고:
"transform prop 추가하자"

✅ Intent First 사고:
"사용자가 '010-1234-5678'을 입력하는데
 시스템은 '01012345678'이 필요해
 → Assistance Intent
 → transform prop 추가"
```

---

**MDK의 새로운 슬로건**:

# **"Intent First, Props Follow"**
### 의도가 먼저, 속성은 따라온다
