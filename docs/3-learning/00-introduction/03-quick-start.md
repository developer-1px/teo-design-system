# Quick Start

**난이도**: ⭐⭐☆☆☆
**소요 시간**: 20분
**선행 학습**: [핵심 개념](./02-core-concept.md)

---

## 📌 이 문서에서 배울 내용

- 5분 안에 첫 IDDL UI 만들기
- Text, Action, Field 기본 사용법
- prominence와 intent 실전 적용
- 간단한 로그인 폼 완성

---

## 🚀 5분 안에 첫 UI 만들기

### Step 1: 첫 버튼 (1분)

```tsx
import { Action } from '@/components/types/Element/Action/Action.tsx';

function App() {
  return (
    <Action prominence="Strong" intent="Brand">
      Click Me
    </Action>
  );
}
```

**결과**:
- 큰 버튼 (Strong → px-6 py-3)
- Accent 색상 (Brand → bg-accent)
- 자동 hover/focus 효과

**확인사항**:
- [ ] 버튼이 보이나요?
- [ ] 클릭하면 hover 효과가 있나요?
- [ ] Tab키로 focus 이동이 되나요?

---

### Step 2: 텍스트 추가 (1분)

```tsx
import { Action } from '@/components/types/Element/Action/Action.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';

function App() {
  return (
    <div className="p-8">
      <Text role="Title" prominence="Strong">
        Welcome to IDDL
      </Text>

      <Text role="Body" prominence="Standard">
        Create UIs by declaring "why", not "how"
      </Text>

      <Action prominence="Strong" intent="Brand">
        Get Started
      </Action>
    </div>
  );
}
```

**추가된 것**:
- Title (16px, font-medium)
- Body (14px, opacity-80)

---

### Step 3: 입력 필드 추가 (2분)

```tsx
import { Action } from '@/components/types/Element/Action/Action.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Field } from '@/components/types/Element/Field/Field.tsx';

function App() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Text role="Title" prominence="Strong" className="mb-4">
        Sign In
      </Text>

      <Field
        label="Email"
        dataType="email"
        placeholder="you@example.com"
        required
      />

      <Field
        label="Password"
        dataType="password"
        required
      />

      <Action prominence="Strong" intent="Brand" className="w-full">
        Sign In
      </Action>
    </div>
  );
}
```

**추가된 것**:
- Email 입력 필드 (자동 검증)
- Password 입력 필드 (자동 마스킹)
- 전체 폭 버튼

---

### Step 4: Block으로 그룹핑 (1분)

```tsx
import { Page } from '@/components/types/Page/Page.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { Block } from '@/components/types/Block/Block.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Field } from '@/components/types/Element/Field/Field.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';

function App() {
  return (
    <Page role="Focus">
      <Section role="Container">
        <Block role="Form" prominence="Strong">
          <Text role="Title" prominence="Strong">
            Sign In
          </Text>

          <Field label="Email" dataType="email" required />
          <Field label="Password" dataType="password" required />

          <Block role="Toolbar">
            <Action prominence="Standard">Cancel</Action>
            <Action prominence="Strong" intent="Brand">Sign In</Action>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

**추가된 것**:
- Page (role="Focus" → 중앙 정렬)
- Section (Container 영역)
- Block (Form → 자동 spacing, rounded, shadow)
- Toolbar (버튼 가로 배치)

**✅ 완성!**

---

## 🎨 prominence 실습

### 버튼 중요도 비교

```tsx
function ButtonExample() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <Action prominence="Hero">Hero Button</Action>
      <Action prominence="Strong">Primary Button</Action>
      <Action prominence="Standard">Secondary Button</Action>
      <Action prominence="Subtle">Tertiary Button</Action>
    </div>
  );
}
```

**결과 비교**:
| prominence | 크기 | 패딩 | 강조 |
|-----------|------|------|------|
| Hero | 가장 큼 | px-8 py-4 | font-bold |
| Strong | 큼 | px-6 py-3 | font-semibold |
| Standard | 중간 | px-4 py-2 | font-normal |
| Subtle | 작음 | px-2 py-1 | font-normal |

**실습**:
1. Hero는 언제 사용할까요? → 랜딩 페이지 주요 CTA
2. Strong는 언제 사용할까요? → 화면의 주요 액션
3. Standard는 언제 사용할까요? → 보조 액션 (Cancel, Back)
4. Subtle는 언제 사용할까요? → 덜 중요한 액션 (Help, Info)

---

## 🌈 intent 실습

### 의미별 버튼

```tsx
function IntentExample() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <Action prominence="Strong" intent="Neutral">
        Neutral
      </Action>
      <Action prominence="Strong" intent="Brand">
        Brand
      </Action>
      <Action prominence="Strong" intent="Positive">
        Save
      </Action>
      <Action prominence="Strong" intent="Caution">
        Warning
      </Action>
      <Action prominence="Strong" intent="Critical">
        Delete
      </Action>
      <Action prominence="Strong" intent="Info">
        Learn More
      </Action>
    </div>
  );
}
```

**결과 비교**:
| intent | 색상 | 사용 예 |
|--------|------|---------|
| Neutral | 회색 | 기본 버튼 |
| Brand | Accent | 브랜드 액션 |
| Positive | 초록색 | 저장, 확인 |
| Caution | 노란색 | 주의, 경고 |
| Critical | 빨간색 | 삭제, 취소 |
| Info | 파란색 | 정보, 도움말 |

**실습**:
- 저장 버튼은? → intent="Positive"
- 삭제 버튼은? → intent="Critical"
- 브랜드 액션은? → intent="Brand"
- 취소 버튼은? → intent="Neutral", prominence="Standard"

---

## 📝 실습: 로그인 폼 완성하기

### 요구사항

1. 제목: "Welcome Back"
2. 입력 필드:
   - Email (필수)
   - Password (필수)
3. 버튼:
   - "Forgot Password?" (덜 중요)
   - "Sign In" (주요 액션, 브랜드 색)

### 정답 예시

```tsx
function LoginForm() {
  return (
    <Page role="Focus">
      <Section role="Container">
        <Block role="Form" prominence="Strong">
          {/* 제목 */}
          <Text role="Title" prominence="Hero">
            Welcome Back
          </Text>

          <Text role="Body" prominence="Standard">
            Sign in to your account to continue
          </Text>

          {/* 입력 필드 */}
          <Field
            label="Email"
            dataType="email"
            placeholder="you@example.com"
            required
          />

          <Field
            label="Password"
            dataType="password"
            required
          />

          {/* 버튼 */}
          <Block role="Toolbar" layout="inline" className="justify-between">
            <Action prominence="Subtle" intent="Neutral">
              Forgot Password?
            </Action>

            <Action prominence="Strong" intent="Brand">
              Sign In
            </Action>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

**체크리스트**:
- [ ] 제목이 Hero prominence로 강조되었나요?
- [ ] Email 필드가 자동 검증되나요?
- [ ] Password 필드가 마스킹되나요?
- [ ] "Forgot Password?"가 덜 강조되었나요?
- [ ] "Sign In" 버튼이 브랜드 색인가요?
- [ ] 전체가 중앙 정렬되었나요? (Page role="Focus")

---

## 🎯 자주 쓰는 패턴

### 1. Primary CTA + Secondary Cancel

```tsx
<Block role="Toolbar">
  <Action prominence="Standard">Cancel</Action>
  <Action prominence="Strong" intent="Positive">Save</Action>
</Block>
```

### 2. 위험한 삭제 액션

```tsx
<Action prominence="Strong" intent="Critical">
  Delete Account
</Action>
```

### 3. 폼 입력 필드

```tsx
<Field label="Name" dataType="text" required />
<Field label="Email" dataType="email" required />
<Field label="Age" dataType="number" min={0} max={120} />
```

### 4. 제목 + 부제목

```tsx
<Text role="Title" prominence="Strong">Main Title</Text>
<Text role="Body" prominence="Standard">Subtitle or description</Text>
```

### 5. 카드 UI

```tsx
<Block role="Card" prominence="Strong">
  <Text role="Title">Card Title</Text>
  <Text role="Body">Card description...</Text>
  <Action prominence="Standard" intent="Brand">
    Learn More
  </Action>
</Block>
```

---

## ⚡ 실전 팁

### 1. prominence는 화면당 1-3개만

```tsx
// ✅ GOOD
<Action prominence="Strong">Save</Action>
<Action prominence="Standard">Cancel</Action>
<Action prominence="Subtle">Help</Action>

// ❌ BAD - 모두 Strong
<Action prominence="Strong">Save</Action>
<Action prominence="Strong">Cancel</Action>
<Action prominence="Strong">Delete</Action>
```

**이유**: 모든 게 중요하면 아무것도 중요하지 않습니다.

---

### 2. intent는 의미를 명확히

```tsx
// ✅ GOOD - 의미 명확
<Action intent="Positive">Save</Action>
<Action intent="Critical">Delete</Action>

// ❌ BAD - 의미 불명확
<Action intent="Brand">Delete</Action>  // 삭제가 브랜드 액션?
```

---

### 3. required 필드는 명시

```tsx
// ✅ GOOD
<Field label="Email" dataType="email" required />

// ⚠️ MISSING
<Field label="Email" dataType="email" />  // 필수인데 required 없음
```

---

## ✅ 이 문서를 읽고 나면

- [x] 첫 IDDL UI를 만들었다
- [x] Text, Action, Field를 사용할 수 있다
- [x] prominence와 intent를 적용할 수 있다
- [x] 간단한 로그인 폼을 만들었다

---

## 🔗 다음 단계

이제 기초를 다질 시간입니다:

- [Prominence](../01-fundamentals/01-prominence.md) - 시각적 중요도 완전 정복
- [Intent](../01-fundamentals/02-intent.md) - 의미적 색상 완전 정복

---

**최종 업데이트**: 2026-01-11
**난이도**: 기초
**예상 소요 시간**: 20분 (실습 포함)
