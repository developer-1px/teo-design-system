# Prose Intent 재구조화: 3-Tier 원칙 재검토

**날짜**: 2026년 1월 15일 (새벽 회의)
**참석자**: 6명 (동일 팀)
**목표**: Prose Intent 구조의 문제점 발견 및 재설계
**핵심**: Tier 3는 완전 독립 컴포넌트 or 순수 variant여야 함

---

## 🎬 Act 1: 문제 발견 - "뭔가 이상한데?"

### Marcus (개발자)
*(Prose Intent 구조를 구현하려다가)*

잠깐... 이거 이상한데요?

```tsx
<Prose.Hierarchy>
  <Prose.Title size="xl">제목</Prose.Title>  // size는 variant
  <Prose.Body>본문</Prose.Body>               // Body는 독립 컴포넌트
  <Prose.List>목록</Prose.List>               // List도 독립 컴포넌트
</Prose.Hierarchy>
```

`Title`은 `size` variant를 받는데, `Body`와 `List`는 완전히 다른 컴포넌트잖아요?

### Sarah (아키텍트)
*(Field 구조 보며)*

Field에서는 이런 문제 없었는데...

```tsx
<Field.Feedback>
  <Field.Error />    // 독립 컴포넌트
  <Field.Success />  // 독립 컴포넌트
  <Field.Warning />  // 독립 컴포넌트
</Field.Feedback>
```

모두 **완전히 분리된 독립 컴포넌트**예요!

### Dev (기여자)
그런데 Prose는...

```tsx
<Prose.Emphasis>
  <Prose.Blockquote />  // 독립?
  <Prose.Callout />     // 독립?
  <Prose.Code />        // 독립?
  <Prose.Mark />        // 독립? variant?
</Prose.Emphasis>
```

이것들이 정말 **같은 Intent 아래** 있어야 하나요?

### Emma (디자이너)
*(명확히 지적하며)*

**Emphasis Intent가 코드에서 뭘 하는 거죠?**

Field.Feedback은 "에러/성공/경고를 보여준다"는 명확한 역할이 있어요.
하지만 Prose.Emphasis는...?

`Blockquote`, `Callout`, `Code`를 묶는다는 게 **개발에서 실제로 의미가 있나요?**

---

## 🎬 Act 2: 3-Tier 원칙 재검토

### Sarah (아키텍트)
*(화이트보드에 적으며)*

3-Tier 구조의 **Tier 3 원칙**을 다시 정리해봅시다.

---

### 📋 Tier 3 컴포넌트 원칙

#### ✅ 올바른 Tier 3 패턴

**패턴 1: 완전 독립 컴포넌트**
```tsx
<Field.Feedback>
  <Field.Error />    // 완전히 다른 컴포넌트
  <Field.Success />  // 완전히 다른 컴포넌트
  <Field.Warning />  // 완전히 다른 컴포넌트
</Field.Feedback>
```
- 각각 독립적인 컴포넌트
- 서로 대체 불가
- 공통 Intent(Feedback) 공유

---

**패턴 2: 같은 컴포넌트의 Variant**
```tsx
<Button>
  <Button.Primary />    // variant: primary
  <Button.Secondary />  // variant: secondary
  <Button.Ghost />      // variant: ghost
</Button>

// 또는
<Button variant="primary" />
<Button variant="secondary" />
```
- 같은 컴포넌트의 스타일/동작 변형
- 서로 대체 가능
- 공통 Props/기능 공유

---

#### ❌ 잘못된 Tier 3 패턴

**안티패턴: 독립 컴포넌트 + Variant 혼재**
```tsx
<Prose.Hierarchy>
  <Prose.Title size="xl" />   // ← variant 사용
  <Prose.Body />              // ← 독립 컴포넌트
  <Prose.List />              // ← 독립 컴포넌트
</Prose.Hierarchy>
```

**문제점**:
- `Title`은 size variant를 받음
- `Body`와 `List`는 완전히 다른 컴포넌트
- 혼재된 구조 = 일관성 없음

---

### Yuki (UX 연구원)
그러면... Prose는 어떻게 해야 하죠?

### Sarah (아키텍트)
**Intent를 다시 정의**해야 해요.

Field/Action에서 했던 것처럼:
1. **사용자 질문**에서 시작
2. **코드에서 실제로 사용되는 분류**인지 확인
3. **Tier 3가 원칙을 따르는지** 검증

---

## 🎬 Act 3: Prose 사용자 질문 재분석

### Yuki (UX 연구원)
Prose를 읽는 사람의 **진짜 질문**을 다시 생각해봅시다.

---

### 📋 Prose 독자의 핵심 질문

#### 1️⃣ "이 글 어디서 시작하지?"
→ **Structure Intent** ✅ (여전히 유효)

**사용 패턴**:
```tsx
<Prose.Document>      // 글 전체 컨테이너
<Prose.Section>       // 섹션 구분
<Prose.Article>       // 아티클
```
→ 모두 **독립 컴포넌트** (컨테이너)

---

#### 2️⃣ "이게 제목인가 본문인가?"
→ ~~**Hierarchy Intent**~~ ❌ (문제!)

**현재 구조**:
```tsx
<Prose.Hierarchy>
  <Prose.Title size="xl" />  // variant
  <Prose.Body />             // 독립
  <Prose.List />             // 독립
</Prose.Hierarchy>
```

**문제점**:
- `Title`, `Body`, `List`는 **완전히 다른 컴포넌트**
- 왜 같은 Intent 아래 있죠?
- 코드에서 `Prose.Hierarchy`를 직접 쓸 일이 있나요?

---

#### 3️⃣ "어디가 중요한 부분이지?"
→ ~~**Emphasis Intent**~~ ❌ (문제!)

**현재 구조**:
```tsx
<Prose.Emphasis>
  <Prose.Blockquote />
  <Prose.Callout />
  <Prose.Code />
  <Prose.Mark />
</Prose.Emphasis>
```

**문제점**:
- 모두 독립 컴포넌트인데 왜 `Emphasis`로 묶죠?
- `Code`는 강조가 목적인가요? 아니면 **코드 표시**가 목적인가요?
- `Blockquote`는 강조? 아니면 **인용**?

### Emma (디자이너)
아! **목적이 다른 컴포넌트를 억지로 묶은 거네요!**

---

## 🎬 Act 4: 진짜 문제 - "Intent vs Component"

### Dev (기여자)
*(핵심 지적)*

Prose의 진짜 문제는...

**Field/Action은 Intent가 "역할"이었는데**
**Prose는 Intent를 "카테고리"로 착각했어요!**

---

### 📋 Intent vs 카테고리

| | Field/Action | Prose (잘못됨) |
|---|---|---|
| **Tier 2 의미** | 역할 (Role) | 카테고리 (Category) |
| **예시** | `Feedback` = "피드백 보여주기" | `Emphasis` = "강조류 묶기" |
| **Tier 3 관계** | 독립 컴포넌트들이 공통 역할 | 독립 컴포넌트들의 분류 기준 모호 |
| **코드 사용** | `<Field.Feedback>` 자주 사용 | `<Prose.Emphasis>` 직접 사용 안 함 |

---

**예시로 보는 차이**:

#### ✅ Field: Intent = 역할
```tsx
<Field.Feedback>  // "피드백을 보여준다"는 명확한 역할
  <Field.Error />
  <Field.Success />
</Field.Feedback>
```

#### ❌ Prose: Intent = 카테고리
```tsx
<Prose.Emphasis>  // "강조류"라는 모호한 카테고리
  <Prose.Blockquote />  // 인용이 주 목적
  <Prose.Code />        // 코드 표시가 주 목적
  <Prose.Mark />        // 강조가 주 목적
</Prose.Emphasis>
```

### Sarah (아키텍트)
**Intent는 "왜 이걸 쓰는가?"에 대한 답**이어야 하는데,
Prose는 "이게 어떤 종류인가?"로 분류했네요.

---

## 🎬 Act 5: Prose는 정말 3-Tier가 맞나?

### Marcus (개발자)
*(조심스럽게)*

혹시... Prose는 **3-Tier 구조가 안 맞는 건 아닐까요?**

### Everyone
*(충격)*

### Sarah (아키텍트)
*(잠시 생각하다가)*

좋은 지적이에요. 생각해봅시다.

---

### 📋 Field vs Prose 근본 차이

#### Field/Action의 특징:
```tsx
<Field>
  <Field.Guidance>    // 여러 컴포넌트를 묶는 역할
  <Field.Validation>  // 여러 컴포넌트를 묶는 역할
  <Field.Feedback>    // 여러 컴포넌트를 묶는 역할
</Field>
```

- Field는 **여러 Intent가 협력**하여 하나의 필드를 만듦
- Intent들이 **서로 다른 시점**에 작동 (Guidance → Control → Validation → Feedback)
- Intent = **라이프사이클 단계**

---

#### Prose의 특징:
```tsx
<Prose>
  <Prose.Title />      // 독립적으로 사용
  <Prose.Body />       // 독립적으로 사용
  <Prose.Blockquote /> // 독립적으로 사용
</Prose>
```

- Prose는 **독립 컴포넌트들의 집합**
- 컴포넌트들이 **협력하지 않음**
- Title은 Title, Body는 Body, 각자 역할

### Emma (디자이너)
아! Prose는 **컴포넌트 라이브러리**지,
Field처럼 **하나의 시스템**이 아니네요!

---

## 🎬 Act 6: 두 가지 가능성

### Dev (기여자)
그러면 두 가지 방향이 있어요:

---

### 📋 Option 1: Prose는 2-Tier 구조

**"Prose는 Intent 없이 바로 컴포넌트"**

```tsx
Prose (Tier 1: Primitive)
├── Title (Tier 2: Component)
│   ├── xl (variant)
│   ├── lg (variant)
│   ├── md (variant)
│   └── sm (variant)
├── Body (Tier 2: Component)
├── Blockquote (Tier 2: Component)
├── Code (Tier 2: Component)
├── List (Tier 2: Component)
├── Image (Tier 2: Component)
└── Link (Tier 2: Component)
```

**장점**:
- ✅ 심플하고 명확
- ✅ 실제 사용 패턴과 일치
- ✅ 억지 Intent 분류 없음

**단점**:
- ❌ 3-Tier 철학과 맞지 않음
- ❌ Prose가 "특별한 예외"가 됨

---

### 📋 Option 2: Prose의 진짜 Intent 찾기

**"Prose도 Intent가 있다. 하지만 다르게 접근"**

Field/Action은 **"컴포넌트 간 협력"** 관점
Prose는 **"컨텐츠 역할"** 관점

#### Prose의 진짜 Intent?

**사용자 질문**:
1. "이 컨텐츠를 어떻게 표시하지?" → **Display Intent**
2. "독자가 이걸 어떻게 인식하지?" → **Semantic Intent**
3. "이 컨텐츠로 뭘 하지?" → **Interactive Intent**

---

**Option 2 구조 예시**:

```
Prose (Tier 1: Primitive)
├── Display (Tier 2: Intent) - "어떻게 보여줄까?"
│   ├── Title (Tier 3: Component)
│   │   ├── xl, lg, md, sm (variants)
│   ├── Body (Tier 3: Component)
│   └── Caption (Tier 3: Component)
├── Semantic (Tier 2: Intent) - "의미가 뭐지?"
│   ├── Blockquote (Tier 3: Component)
│   ├── Code (Tier 3: Component)
│   └── Mark (Tier 3: Component)
└── Interactive (Tier 2: Intent) - "상호작용이 필요한가?"
    ├── Link (Tier 3: Component)
    ├── Anchor (Tier 3: Component)
    └── Accordion (Tier 3: Component)
```

### Yuki (UX 연구원)
음... 이것도 억지스러운데요?

`Display` Intent 안에 `Title`, `Body`, `Caption`을 넣는다고
코드에서 `<Prose.Display>`를 직접 쓸 일이 있나요?

---

## 🎬 Act 7: 핵심 통찰 - "Intent의 두 가지 타입"

### Sarah (아키텍트)
*(갑자기 깨달으며)*

아! **Intent에 두 가지 타입이 있어요!**

---

### 📋 Intent의 두 가지 타입

#### Type A: Container Intent (컨테이너 의도)
**"여러 컴포넌트를 담아서 하나의 역할을 수행"**

```tsx
<Field.Feedback>  // Feedback이라는 컨테이너
  <Field.Error />
  <Field.Success />
</Field.Feedback>
```

- Intent 컴포넌트(`Field.Feedback`)가 **직접 사용됨**
- Tier 3 컴포넌트들이 **협력**하여 Intent 달성
- `<Field.Feedback>` 자체가 의미 있음

---

#### Type B: Namespace Intent (네임스페이스 의도)
**"컴포넌트들을 분류만 하고 직접 사용 안 됨"**

```tsx
// 이렇게 쓰지 않음
<Prose.Hierarchy>
  <Prose.Title />
</Prose.Hierarchy>

// 이렇게 씀
<Prose.Title />
<Prose.Body />
```

- Intent 컴포넌트(`Prose.Hierarchy`)가 **직접 사용 안 됨**
- Tier 3 컴포넌트들이 **독립적**으로 사용
- Intent는 그냥 **네임스페이스 분류**일 뿐

---

### Marcus (개발자)
**Container Intent는 3-Tier 맞고**
**Namespace Intent는 2-Tier인 거네요!**

### Emma (디자이너)
그럼 Prose는...?

### Everyone
**2-Tier!**

---

## 🎬 Act 8: Prose 2-Tier 재설계

### Sarah (아키텍트)
좋아요. Prose를 2-Tier로 재설계해봅시다.

---

### 📋 Prose 2-Tier 구조

```
Prose (Tier 1: Primitive)
├── Title (Tier 2: Component)
│   └── Variants: xl, lg, md, sm
├── Body (Tier 2: Component)
├── Caption (Tier 2: Component)
├── Blockquote (Tier 2: Component)
├── Code (Tier 2: Component)
├── CodeBlock (Tier 2: Component)
├── Mark (Tier 2: Component)
├── List (Tier 2: Component)
│   └── Variants: ordered, unordered
├── ListItem (Tier 2: Component)
├── Link (Tier 2: Component)
├── Image (Tier 2: Component)
├── Video (Tier 2: Component)
├── Separator (Tier 2: Component)
└── Callout (Tier 2: Component)
    └── Variants: info, warning, error, success
```

---

### 📋 사용 예시

```tsx
// ✅ 심플하고 명확
<Prose>
  <Prose.Title size="xl">제목</Prose.Title>
  <Prose.Body>본문입니다</Prose.Body>
  <Prose.Blockquote>인용문</Prose.Blockquote>
  <Prose.Code>inline code</Prose.Code>
  <Prose.List type="ordered">
    <Prose.ListItem>항목 1</Prose.ListItem>
  </Prose.List>
</Prose>
```

**장점**:
- ✅ 억지 Intent 없음
- ✅ 실제 사용 패턴과 일치
- ✅ 심플하고 직관적

---

## 🎬 Act 9: "그럼 3-Tier가 항상 맞는 건 아니네?"

### Yuki (UX 연구원)
그럼... 3-Tier 철학이 잘못된 건가요?

### Sarah (아키텍트)
아니요! **3-Tier가 맞는 컴포넌트가 있고, 아닌 게 있어요.**

---

### 📋 3-Tier vs 2-Tier 판단 기준

| 질문 | Field/Action | Prose |
|------|-------------|-------|
| **컴포넌트들이 협력하나?** | ✅ Guidance + Control + Validation | ❌ Title, Body 각자 독립 |
| **Intent가 라이프사이클인가?** | ✅ Guidance → Control → Feedback | ❌ Title은 Title, Body는 Body |
| **Intent 컴포넌트를 직접 쓰나?** | ✅ `<Field.Feedback>` 사용 | ❌ `<Prose.Hierarchy>` 사용 안 함 |
| **Intent가 Context를 제공하나?** | ✅ `GuidanceContext` 제공 | ❌ 제공할 Context 없음 |
| **결론** | **3-Tier 적합** | **2-Tier 적합** |

---

### 📋 판단 기준 요약

#### ✅ 3-Tier가 적합한 경우:
1. **컴포넌트 간 협력이 필요**
2. **Intent가 Context를 제공**
3. **Intent 컴포넌트가 직접 사용됨**
4. **라이프사이클 또는 역할 기반 분류**

**예**: Field, Action, Form, Dialog

---

#### ✅ 2-Tier가 적합한 경우:
1. **독립 컴포넌트들의 집합**
2. **Intent가 네임스페이스일 뿐**
3. **Intent 컴포넌트를 직접 사용 안 함**
4. **단순 카테고리 분류**

**예**: Prose, Icon, Illustration

---

## 🎬 Act 10: 최종 결정

### Sarah (아키텍트)
정리하면:

---

### 📋 MDK 컴포넌트 구조 원칙

#### 1️⃣ Container Intent → 3-Tier
```tsx
// Intent가 역할을 하고 직접 사용됨
<Field>
  <Field.Guidance>...</Field.Guidance>
  <Field.Control>...</Field.Control>
</Field>
```

#### 2️⃣ Namespace Intent → 2-Tier
```tsx
// Intent는 분류일 뿐, 컴포넌트만 직접 사용
<Prose>
  <Prose.Title />
  <Prose.Body />
</Prose>
```

---

### 새로운 슬로건 수정

# ~~"See the Intent, Control the Component"~~

# **"Intent When Needed, Simple When Not"**
### 필요할 때 Intent, 필요 없으면 Simple

---

### Emma (디자이너)
완벽해요! **억지로 3-Tier 맞추지 않아도 되네요!**

### Marcus (개발자)
**적재적소(適材適所)**네요!

---

## 🎬 Act 11: Prose 최종 구조

### Sarah (아키텍트)
Prose 최종 2-Tier 구조를 정리합시다.

---

### 📋 Prose 2-Tier 최종 구조

```
Prose (Tier 1: Primitive)
│
├── Typography (컴포넌트 그룹 - 코드 분류용, API 노출 안 됨)
│   ├── Title (Tier 2: Component)
│   │   └── Props: size (xl|lg|md|sm), align, color
│   ├── Body (Tier 2: Component)
│   │   └── Props: size (md|sm), align, color
│   ├── Caption (Tier 2: Component)
│   └── Label (Tier 2: Component)
│
├── Semantic (컴포넌트 그룹 - 코드 분류용, API 노출 안 됨)
│   ├── Blockquote (Tier 2: Component)
│   ├── Code (Tier 2: Component)
│   ├── CodeBlock (Tier 2: Component)
│   │   └── Props: language, lineNumbers, highlight
│   ├── Mark (Tier 2: Component)
│   │   └── Props: color
│   └── Abbr (Tier 2: Component)
│
├── List (컴포넌트 그룹 - 코드 분류용, API 노출 안 됨)
│   ├── List (Tier 2: Component)
│   │   └── Props: type (ordered|unordered|none)
│   ├── ListItem (Tier 2: Component)
│   └── DefinitionList (Tier 2: Component)
│
├── Interactive (컴포넌트 그룹 - 코드 분류용, API 노출 안 됨)
│   ├── Link (Tier 2: Component)
│   │   └── Props: href, external, underline
│   └── Anchor (Tier 2: Component)
│
├── Media (컴포넌트 그룹 - 코드 분류용, API 노출 안 됨)
│   ├── Image (Tier 2: Component)
│   │   └── Props: src, alt, caption, ratio
│   ├── Figure (Tier 2: Component)
│   └── Video (Tier 2: Component)
│
└── Layout (컴포넌트 그룹 - 코드 분류용, API 노출 안 됨)
    ├── Separator (Tier 2: Component)
    ├── Spacer (Tier 2: Component)
    └── Callout (Tier 2: Component)
        └── Variants: info, warning, error, success
```

**중요**: `Typography`, `Semantic` 등은 **코드 구조 분류용**이지 **API에 노출되지 않음**

---

### 📋 Prose API (실제 사용)

```tsx
// ✅ 이렇게 사용
<Prose.Title size="xl">제목</Prose.Title>
<Prose.Body>본문</Prose.Body>
<Prose.Blockquote>인용</Prose.Blockquote>

// ❌ 이렇게 사용 안 함
<Prose.Typography>
  <Prose.Title>제목</Prose.Title>
</Prose.Typography>
```

---

## 🎬 Act 12: 변경 사항 요약

### Alex (문서 작성자)
변경 사항을 표로 정리해볼게요.

---

### 📋 Before vs After

| 측면 | Before (3-Tier 시도) | After (2-Tier 확정) |
|------|---------------------|-------------------|
| **구조** | `Prose.{Intent}.{Component}` | `Prose.{Component}` |
| **Intent 개수** | 6개 (Hierarchy, Emphasis 등) | 0개 (Intent 없음) |
| **API 예시** | `<Prose.Hierarchy.Title />` | `<Prose.Title />` |
| **컴포넌트 개수** | 20+ | 15+ (정리됨) |
| **장황함** | 3단계 깊이 | 2단계 깊이 |
| **명확성** | ❌ Intent 역할 모호 | ✅ 컴포넌트 역할 명확 |
| **코드 분류** | Intent로 분류 | 폴더로 분류 (Typography, Semantic 등) |

---

### 📋 실제 사용 비교

#### Before (3-Tier):
```tsx
<Prose>
  <Prose.Hierarchy>
    <Prose.Title size="xl">제목</Prose.Title>
  </Prose.Hierarchy>
  <Prose.Hierarchy>
    <Prose.Body>본문</Prose.Body>
  </Prose.Hierarchy>
  <Prose.Emphasis>
    <Prose.Blockquote>인용</Prose.Blockquote>
  </Prose.Emphasis>
</Prose>
```

**문제점**:
- ❌ `Hierarchy`, `Emphasis` 반복
- ❌ Intent가 역할 없음
- ❌ 불필요하게 장황

---

#### After (2-Tier):
```tsx
<Prose>
  <Prose.Title size="xl">제목</Prose.Title>
  <Prose.Body>본문</Prose.Body>
  <Prose.Blockquote>인용</Prose.Blockquote>
</Prose>
```

**장점**:
- ✅ 심플하고 직관적
- ✅ 컴포넌트 역할 명확
- ✅ 실제 사용 패턴과 일치

---

## 🎬 Act 13: 폴더 구조

### Marcus (개발자)
그럼 코드에서는 어떻게 분류하죠?

### Sarah (아키텍트)
**폴더 구조**로 분류하면 돼요!

---

### 📋 Prose 폴더 구조

```
src/design-system/Prose/
├── index.tsx                 # Prose 루트 + 전체 export
├── Prose.types.ts            # 공통 타입 정의
├── Prose.context.tsx         # Prose Context (theme, spacing 등)
│
├── typography/               # Typography 그룹
│   ├── Title.tsx
│   ├── Body.tsx
│   ├── Caption.tsx
│   └── index.ts
│
├── semantic/                 # Semantic 그룹
│   ├── Blockquote.tsx
│   ├── Code.tsx
│   ├── CodeBlock.tsx
│   ├── Mark.tsx
│   └── index.ts
│
├── list/                     # List 그룹
│   ├── List.tsx
│   ├── ListItem.tsx
│   └── index.ts
│
├── interactive/              # Interactive 그룹
│   ├── Link.tsx
│   ├── Anchor.tsx
│   └── index.ts
│
├── media/                    # Media 그룹
│   ├── Image.tsx
│   ├── Figure.tsx
│   ├── Video.tsx
│   └── index.ts
│
└── layout/                   # Layout 그룹
    ├── Separator.tsx
    ├── Spacer.tsx
    ├── Callout.tsx
    └── index.ts
```

---

### 📋 index.tsx (Export)

```tsx
// src/design-system/Prose/index.tsx
import { ProseRoot } from './Prose'
import { Title } from './typography/Title'
import { Body } from './typography/Body'
import { Caption } from './typography/Caption'
import { Blockquote } from './semantic/Blockquote'
import { Code } from './semantic/Code'
// ... 나머지 import

// Compound Component 패턴
export const Prose = Object.assign(ProseRoot, {
  // Typography
  Title,
  Body,
  Caption,

  // Semantic
  Blockquote,
  Code,
  CodeBlock,
  Mark,

  // List
  List,
  ListItem,

  // Interactive
  Link,
  Anchor,

  // Media
  Image,
  Figure,
  Video,

  // Layout
  Separator,
  Spacer,
  Callout,
})
```

---

## 🎬 Act 14: 최종 원칙 정립

### Sarah (아키텍트)
이제 MDK의 **구조 결정 원칙**을 정립합시다.

---

### 📋 MDK 구조 결정 원칙

#### 질문 1: "컴포넌트들이 협력하는가?"

**YES** → 3-Tier 고려
- Field: Guidance + Control + Validation 협력
- Action: Handler + State + Feedback 협력

**NO** → 2-Tier 고려
- Prose: Title, Body 각자 독립

---

#### 질문 2: "Intent가 Context를 제공하는가?"

**YES** → 3-Tier 적합
```tsx
<Field.Guidance label="이메일">  // GuidanceContext 제공
  <Field.Label />                // Context 사용
</Field.Guidance>
```

**NO** → 2-Tier 적합
```tsx
<Prose.Title />  // Context 제공 안 함
<Prose.Body />   // 독립적
```

---

#### 질문 3: "Intent 컴포넌트를 직접 사용하는가?"

**YES** → 3-Tier 적합
```tsx
<Field.Feedback>  // Feedback 자체가 사용됨
  <Field.Error />
</Field.Feedback>
```

**NO** → 2-Tier 적합
```tsx
// <Prose.Hierarchy> 직접 사용 안 함
<Prose.Title />  // Title만 사용
```

---

#### 질문 4: "Tier 3가 원칙을 따르는가?"

**3-Tier 원칙**:
- ✅ 모두 독립 컴포넌트 OR
- ✅ 모두 같은 컴포넌트의 variant

**원칙 위반 예시**:
```tsx
<Prose.Hierarchy>
  <Prose.Title size="xl" />  // ← variant
  <Prose.Body />             // ← 독립 컴포넌트
</Prose.Hierarchy>
```
→ 혼재 = 2-Tier로 재설계 필요

---

### 📋 결정 플로우차트

```
컴포넌트 설계 시작
    ↓
컴포넌트들이 협력?
    ├─ YES → Intent 필요 → Context 제공?
    │           ├─ YES → 3-Tier ✅
    │           └─ NO → 재검토
    └─ NO → Intent 불필요 → 2-Tier ✅
```

---

## 🎬 Act 15: 교훈

### Emma (디자이너)
오늘 배운 교훈...

---

### 📋 오늘의 교훈

#### 1️⃣ **"3-Tier가 항상 정답은 아니다"**

Field/Action에 맞다고 해서 Prose에도 맞는 건 아니다.
컴포넌트의 본질을 먼저 이해하라.

---

#### 2️⃣ **"Intent ≠ 카테고리"**

Intent는 "역할"이지 "분류"가 아니다.
- ✅ Feedback = 피드백 보여주는 역할
- ❌ Emphasis = 강조류 카테고리

---

#### 3️⃣ **"코드 사용 패턴이 진실"**

API 설계 시:
- ❌ "이렇게 쓰면 좋을 것 같다" (상상)
- ✅ "실제로 이렇게 쓸 것이다" (현실)

---

#### 4️⃣ **"Tier 3 원칙은 철칙"**

Tier 3는 반드시:
- 모두 독립 컴포넌트 OR
- 모두 variant

**혼재 = 구조 재설계 필요**

---

#### 5️⃣ **"폴더 ≠ API"**

코드 구조 분류(폴더)와 API 구조는 다르다.
- 폴더: `typography/Title.tsx`
- API: `<Prose.Title />` (typography 노출 안 함)

---

## 🎬 Epilogue: 다음 단계

### Sarah (아키텍트)
*(정리하며)*

정리하면:
- **Field, Action**: 3-Tier ✅
- **Prose**: 2-Tier ✅

다음은 다른 컴포넌트들을 분석해봅시다!

---

### 📋 분석할 컴포넌트

| 컴포넌트 | 예상 구조 | 이유 |
|---------|---------|-----|
| **Menu** | 3-Tier? | Trigger + Content + Item 협력? |
| **Dialog** | 3-Tier? | Trigger + Content + Actions 협력? |
| **Table** | 2-Tier? | Header, Body, Row 독립? |
| **Card** | 2-Tier? | Header, Body, Footer 독립? |
| **Tabs** | 3-Tier? | List + Trigger + Content 협력? |

---

**회의 종료**: 2026년 1월 15일 새벽 3시
**결과**: Prose 2-Tier 구조 확정
**핵심 교훈**: **"Intent When Needed, Simple When Not"**

---

## 📊 부록: Prose 2-Tier 전체 API

```tsx
// Typography
<Prose.Title size="xl|lg|md|sm" align="left|center|right" />
<Prose.Body size="md|sm" />
<Prose.Caption />
<Prose.Label />

// Semantic
<Prose.Blockquote />
<Prose.Code>inline</Prose.Code>
<Prose.CodeBlock language="typescript" lineNumbers highlight="1,3-5" />
<Prose.Mark color="yellow|blue|green" />

// List
<Prose.List type="ordered|unordered|none">
  <Prose.ListItem />
</Prose.List>

// Interactive
<Prose.Link href="" external underline />
<Prose.Anchor id="" />

// Media
<Prose.Image src="" alt="" caption="" ratio="16/9" />
<Prose.Figure>
  <img />
  <figcaption />
</Prose.Figure>
<Prose.Video src="" />

// Layout
<Prose.Separator />
<Prose.Spacer size="sm|md|lg" />
<Prose.Callout variant="info|warning|error|success" />
```
